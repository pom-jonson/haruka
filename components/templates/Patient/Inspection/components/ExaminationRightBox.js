import React, {Component, useContext} from "react";
import styled from "styled-components";
import {
    surface,
    disable
} from "../../../../_nano/colors";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import $ from "jquery";
import InspectionResultModal from "../../../../organisms/InspectionResultModal";
import {KARTEMODE, WEEKDAYS} from "../../../../../helpers/constants";
import { SOAP_TREE_CATEGORY} from "../../../../../helpers/constants";
import { persistedState } from "../../../../../helpers/cache";
import { CACHE_LOCALNAMES} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";
import * as karteApi from "~/helpers/cacheKarte-utils";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import * as apiClient from "~/api/apiClient";

const Col = styled.div`
  width: 99%;
  max-height: calc(100vh - 182px);
  overflow-y: auto;
  -ms-overflow-style: auto;
  textarea {
    width: 100%;
    resize: none;
  }
  .function-region{
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    .function-region-name{
      width: 70%;
      float: left;
      padding: 5px;      
    }
    .function-region-value{
      width: 30%;
      float: left;
      padding: 5px;
      border-left: 1px solid #ddd;
    }
  }
  .data-item{
    border-bottom: 1px solid ${disable};
    background: rgb(160, 235, 255);
  }
  .data-header{
    background: rgb(105, 200, 225);
    color: white;
    padding: 4px 8px;
  }  
  .bottom-line{
    border-bottom: 1px solid rgb(213, 213, 213);
  }  
  .data-title{
    border: 1px solid rgb(213,213,213);
    cursor: pointer;
  }
  .department{
    font-size: 12px;
  }
  .note{
    font-weight: bold;
  }
  .date{
    font-weight:bold
  }
  .doctor-name{
    font-size: 13px;
    padding-right: 8px;
  }
  .history-region{
    border-bottom: 1px solid rgb(213,213,213);
    font-size: 13px;
    padding-right: 8px;
  }
  .order{
    display: block !important;
  }
  .data-list{
    background-color: ${surface};
    overflow: hidden;
  }

  .soap-history-title{
    font-size: 12px;
  }

  .low-title,
  .middle-title{
    background: #ddf8ff;
  }

  .tb-soap{
    width: 100%;
  
    th{
      background: #f6fcfd; 
    }

    textarea{
      background: white;
      color: black;
      height: 25px;
    }
  }
  .flex {
    display:flex;
  }
  .tag-block-area {
    display:block;
    width:calc(100% - 90px);
    padding: 5px 5px 0 5px;
    .tag-block {
        cursor:pointer;
        width: auto;
        padding: 0px 10px;
        margin-right: 5px;
        float: left;
        margin-bottom: 5px;
    }
  }
`;

const LoadingCol = styled.div`
  width: 49%;  
  height: calc(100vh - 182px);
  max-height: calc(100vh - 182px);
  overflow-y: auto;
  -ms-overflow-style: auto;
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;


const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;

    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
`;

const ContextMenu = ({
                         visible,
                         x,
                         y,
                         index,
                         parent,
                     }) => {
    const {karteMode} = useContext(Context);
    var isWrite = (karteMode == KARTEMODE.READ) ?  false: true;
    if (visible && isWrite) {
        return (
            <>
                <ContextMenuUl>
                    <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                        <>
                            <li>
                                <div onClick={() => parent.contextMenuAction("importance_level_high", index)}>
                                    重要度：高
                                </div>
                            </li>
                            <li>
                                <div onClick={() => parent.contextMenuAction("importance_level", index)}>
                                    重要度：標準
                                </div>
                            </li>
                        </>
                    </ul>
                </ContextMenuUl>
            </>
        );
    } else {
        return null;
    }
};

class ExaminationRightBox extends Component {
    constructor(props) {
        super(props);
        this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
        this.state = {
            contextMenu: {
                visible: false,
                x: 0,
                y: 0,
                index: 0,
            },
            inspectionModal: false,
            historyExaminationModal: false,
            openExamOrderList:false,
            selectedOrderNumber: 0,
            historySoapList: [],
            confirm_message: "",
            confirm_type: "",
            modaly_type: "",
            endoscope_image:"",
            soapIndex: 0,
            page_number:0,
            soapList:props.soapList,
        };
        this.stopGetHistory = false;
        let { cacheDelExamState } = persistedState(this.props.patientId);
        if (this.state.soapList != null && this.state.soapList != undefined && Object.keys(this.state.soapList).length > 0) {
            Object.keys(this.state.soapList).map(key=>{
              let item = this.state.soapList[key];             
              if (cacheDelExamState && cacheDelExamState.length > 0 && item.category == "検査") {
                cacheDelExamState.map(ele=>{
                  if (item.data != null && item.data != undefined && ele.number == item.number && ele.system_patient_id == item.system_patient_id) {
                    item.isDeleted = true;
                  }
                });
              }                
            });
        }
    }

    componentDidMount = () => {        
        document
          .getElementById("soap_list_wrapper")
          .addEventListener("scroll", this.handleScroll);

        let txtAreaTags = document.getElementsByTagName("textarea");
        for (var i = txtAreaTags.length - 1; i >= 0; i--) {
            txtAreaTags[i].style.height = (txtAreaTags[i].scrollHeight + 12) + "px";
        }
        const soapScrollTop = window.sessionStorage.getItem('inspection_scroll_top') !== undefined ? parseInt(window.sessionStorage.getItem('inspection_scroll_top')) : 0;
        $("#soap_list_wrapper").scrollTop(!isNaN(soapScrollTop) ? soapScrollTop : 0);
        let cacheTagEditData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.TAG_EDIT);
        let cacheTagDeleteData = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.TAG_DELETE);
        this.setState({
            cacheTagEditData,
            cacheTagDeleteData,
        })
    }

    getCurrentSoap = (index) => {
        let presData = undefined;
        if (this.state.soapList != null && this.state.soapList != undefined) {
            this.state.soapList.map((item, ind) => {
                if (ind == index) {
                    presData = item;
                }
            });
        }

        return presData;
    }

    handleScroll = () => {
      window.sessionStorage.setItem('inspection_scroll_top', $("#soap_list_wrapper").scrollTop());
      let page = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_PAGE_NUMBER);
      if(page === undefined || page == null){
          page = this.state.page_number;
      }
      if (!this.stopGetHistory && $("#soap_list_wrapper").scrollTop() + $("#soap_list_wrapper").height() >= $("#soap_content_wrapper").height() - 100){
        let soapList = this.state.soapList;
        if (soapList != null && soapList != undefined && Object.keys(soapList).length > 0) {
          if ((page+1)*15>=Object.keys(soapList).length) {
            this.stopGetHistory = true;
          }
          karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_PAGE_NUMBER, page + 1);
          this.setState({page_number: page + 1});
        }
      }
    }       

    getRows = string => {
        return (string.match(/\n/g) || []).length + 1;
    }        

    addTag = (index) => {
        let modal_data = this.getCurrentSoap(index);
        this.setState({
            isOpenAddTagModal: true,
            karte_tree_number: modal_data.number,
            sticky_data:null,
            sub_key:null,
        });
    };    

    onAngleClicked = index => {
        let nFlag = true;
        let tmpDate;
        let soapList = this.state.soapList.map((item, ind) => {
            if (ind === index) {
                item.class_name = (item.class_name === ""  || item.class_name === undefined ) ? "open" : "";
                if (item.openTag == 0) {
                    nFlag = false;
                    tmpDate = item.treatment_datetime;
                }
            }
            return item;
        });
        if (nFlag == true) {
            this.props.updateSoapList(soapList);
        }else{
            let tmpList = [];
            switch(this.props.categoryType){
                case SOAP_TREE_CATEGORY.CURRENT_SOAP:
                    tmpList = this.props.soapTrees.current_soap;
                    break;
                case SOAP_TREE_CATEGORY.ALL_SOAP:
                    tmpList = this.props.soapTrees.all_soap;
                    break;
                case SOAP_TREE_CATEGORY.ALL_ORDER:
                    tmpList = this.props.soapTrees.all_order;
                    break;
                case SOAP_TREE_CATEGORY.ALL_EXAMINATION:
                    tmpList = this.props.soapTrees.all_examination;
                    break;
                case SOAP_TREE_CATEGORY.ALL_INSPECTION:
                    tmpList = this.props.soapTrees.all_inspection;
                    break;
                case SOAP_TREE_CATEGORY.ALL_TREATMENT:
                    tmpList = this.props.soapTrees.all_treatment;
                    break;
                case SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST:
                    tmpList = this.props.soapTrees.current_soap;
                    break;
                case SOAP_TREE_CATEGORY.ALL_SOAP_LATEST:
                    tmpList = this.props.soapTrees.all_soap;
                    break;
                case SOAP_TREE_CATEGORY.ALL_ORDER_LATEST:
                    tmpList = this.props.soapTrees.all_order;
                    break;
                case SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST:
                    tmpList = this.props.soapTrees.all_examination;
                    break;
                case SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST:
                    tmpList = this.props.soapTrees.all_inspection;
                    break;
                case SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST:
                    tmpList = this.props.soapTrees.all_treatment;
                    break;
            }
            tmpList.map((item, itemIndex) => {
                item.data.map((monthItem, monthItemIndex) => {
                    monthItem.data.map((data, dateIndex) => {
                        if (data.date == tmpDate.substr(0, 10)) {
                            this.props.setOpenClose(this.props.categoryType, 0);
                            this.props.changeSoapList(this.props.categoryType, itemIndex, monthItemIndex, dateIndex);
                        }
                    });
                });
            });
        }
    }

    handleClick=(e, index)=> {
        if (e.type === "contextmenu") {
            e.preventDefault();
            // eslint-disable-next-line consistent-this
            const that = this;
            document.addEventListener(`click`, function onClickOutside() {
                that.setState({ contextMenu: { visible: false } });
                document.removeEventListener(`click`, onClickOutside);
            });
            window.addEventListener("scroll", function onScrollOutside() {
                that.setState({
                    contextMenu: { visible: false }
                });
                window.removeEventListener(`scroll`, onScrollOutside);
            });
            document
                .getElementById("soap_list_wrapper")
                .addEventListener("scroll", function onScrollOutside() {
                    that.setState({
                        contextMenu: { visible: false }
                    });
                    document
                        .getElementById("soap_list_wrapper")
                        .removeEventListener(`scroll`, onScrollOutside);
                });

            this.setState({
                contextMenu: {
                    visible: true,
                    x: e.clientX,
                    y: e.clientY + window.pageYOffset,
                    index: index,
                }
            });
        }
    }

    contextMenuAction = (act, index) => {
        if (act === "importance_level_high") {
            this.setState({
                confirm_message: "重要度を「高」に設定しますか？",
                confirm_type: "_importance_level",
                soapIndex: index,
                importance_level: 100,
            });
        } else if (act === "importance_level") {
            this.setState({
                confirm_message: "重要度を「標準」に設定しますか？",
                confirm_type: "_importance_level",
                soapIndex: index,
                importance_level: 0,
            });
        }
        window.sessionStorage.setItem('inspection_scroll_top', $("#soap_list_wrapper").scrollTop())
    };

    formatDate = str => {
        return str.substr(0, 4) + "/" + str.substr(5, 2) + "/" + str.substr(8, 2);
    }

    getDepartment = id => {
        let departmentStr = "";
        this.departmentOptions.map(item => {
            if (parseInt(item.id) === parseInt(id)) {
                departmentStr = item.value;
            }
        });

        return departmentStr;
    }

    onInspectionClicked = (data) => {
        // if(this.props.selDay >= 0) {
        this.setState({
            inspectionModalContents : data,
            inspectionModal: true
        });
        // }else{
        //     let tmpList = [];
        //     switch(this.props.categoryType){
        //         case SOAP_TREE_CATEGORY.ALL_EXAMINATION:
        //             tmpList = this.props.soapTrees.all_examination;
        //             break;
        //         case SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST:
        //             tmpList = this.props.soapTrees.all_examination;
        //             break;
        //     }
        //     tmpList.map((item, itemIndex) => {
        //         item.data.map((monthItem, monthItemIndex) => {
        //             monthItem.data.map((ele, dateIndex) => {
        //                 if (ele.date == data.collected_date) {
        //                     this.props.setOpenClose(this.props.categoryType, 0);
        //                     this.props.changeSoapList(this.props.categoryType, itemIndex, monthItemIndex, dateIndex);
        //                     return true;
        //                 }
        //             });
        //         });
        //     });
        // }
    }

    closeModal = () => {
        this.setState({
            inspectionModal: false,
            historyExaminationModal: false,
            selectedOrderNumber: 0
        });
    }

    onMedicineClicked = data => {
        let nFlag = true;
        let tmpDate;
        let soapList = this.state.soapList.map((item) => {
            if (item.target_number === data.number) {
                item.class_name = (item.class_name === ""  || item.class_name === undefined ) ? "open" : "";
                if (item.openTag == 0) {
                    nFlag = false;
                    tmpDate = item.treatment_datetime;
                    if (tmpDate == "") {
                        tmpDate = item.treatment_date;
                    }
                }
            }
            return item;
        });
        if (nFlag == true) {
            this.props.updateSoapList(soapList);
        }else{
            let tmpList = [];
            switch(this.props.categoryType){                
                case SOAP_TREE_CATEGORY.ALL_EXAMINATION:
                    tmpList = this.props.soapTrees.all_examination;
                    break;                
                case SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST:
                    tmpList = this.props.soapTrees.all_examination;
                    break;                
            }
            tmpList.map((item, itemIndex) => {
                item.data.map((monthItem, monthItemIndex) => {
                    monthItem.data.map((data, dateIndex) => {
                        if (data.date == tmpDate.substr(0, 10)) {
                            this.props.setOpenClose(this.props.categoryType, 0);
                            this.props.changeSoapList(this.props.categoryType, itemIndex, monthItemIndex, dateIndex);
                            return true;
                        }
                    });
                });
            });
        }
    }

    getCheckSameOptions = (med, order_meds, option) => {
        let keys = Object.keys(med);
        let equalKeys = [];
        const allEqual = arr => arr.every(v => v === arr[0]);
        keys.map(key => {
            let value = [];
            order_meds.map(medi => {
                value.push(medi[key]);
            });
            if (allEqual(value)) {
                equalKeys.push(key);
            }
        });
        return equalKeys.indexOf(option);
    };

    getWeekDay = dateStr => {
        let weekday = new Date(dateStr).getDay();
        return WEEKDAYS[weekday];
    }

    getHistoryInfo = (nHistoryLength = -1, strStuffName = "", strDateTime = "", nDoctorConsented = -1) => {
        let strHistory = "";
        nHistoryLength++;
        if (nHistoryLength < 10) {
            nHistoryLength = `0${nHistoryLength}`;
        }

        if (nDoctorConsented == 4) {

            return "";

        }
        if (nDoctorConsented == 2) {
            strHistory = `${nHistoryLength}版 : ${strDateTime.substr(0, 4)}/${strDateTime.substr(5, 2)}/${strDateTime.substr(8, 2)} ${strDateTime.substr(11, 2)}時${strDateTime.substr(14, 2)}分`;
            return strHistory;

        }else{

            if (nDoctorConsented == 1) {
                strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
                return strHistory;

            }else{

                strHistory = `${nHistoryLength}版 : ${strDateTime.substr(0, 4)}/${strDateTime.substr(5, 2)}/${strDateTime.substr(8, 2)} ${strDateTime.substr(11, 2)}時${strDateTime.substr(14, 2)}分 入力者 : ${strStuffName}`;
                if (nHistoryLength == 1) {
                    strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
                }
                return strHistory;

            }
        }
    }

    getDoctorName = (nDoctorConsented = -1, strDoctorName = "") => {

        if (nDoctorConsented == 4) {

            return `（過去データ取り込み）${strDoctorName}`;

        }
        if (nDoctorConsented == 2) {

            return strDoctorName;

        }else{

            if (nDoctorConsented == 1) {

                return `[承認済み] 依頼医: ${strDoctorName}`;

            }else{
                return  <div><span className='not-consented'>[未承認]</span> 依頼医: {strDoctorName}</div>;
            }
        }
    }    

    openModal = number => {
        this.setState({
            historyModal: true,
            selectedOrderNumber: number
        });
    };

    confirmOk() {
        switch(this.state.confirm_type){
            case "_importance_level":
                this.setImportanceLevel(this.state.soapIndex);
                break;
        }
        this.confirmCancel();
    }

    confirmCancel() {
        this.setState({
            confirm_message: "",
            confirm_type: "",
            soapIndex: 0,
        });
    }

    setImportanceLevel =async(soapIndex)=>{
        let data = this.getCurrentSoap(soapIndex);
        let path = "/app/api/v2/karte/importance_level/set";
        apiClient
            .post(path, {
                number: data.number,
                importance_level: this.state.importance_level,
                patient_name: this.props.patientInfo.name,
            })
            .then(() => {
                this.props.setImportance(soapIndex, this.state.importance_level);
                // this.setState({
                //     alert_messages: res.alert_message,
                // });
            })
            .catch(() => {
            });
    }

    render() {
        const {soapList} = this.state;
        let page = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_PAGE_NUMBER);
        if(page === undefined || page == null || (this.state.page_number != 0 && this.state.page_number != page)){
            page = this.state.page_number;
        }
        let sort_soapList = [];
        let show_order_count = 0;
        if(soapList !== undefined && soapList != null && Object.keys(soapList).length > 0){
            Object.keys(soapList).sort().reverse().forEach(key => {
                if (show_order_count < (page+1)*15) {
                    show_order_count++;
                    sort_soapList.push( {
                        'key':key,
                        'order_data':soapList[key]
                    })
                }
            });
        }
        if (!this.props.isLoaded) {
            return (
                <LoadingCol id="soap_list_wrapper">
                    <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                </LoadingCol>
            );
        } else {
            return (
                <Col id="soap_list_wrapper">
                  <div id="soap_content_wrapper">
                  {sort_soapList.length > 0 &&(
                      sort_soapList.map((list_item) => {
                          let soap = list_item.order_data;
                          let index = list_item.key;
                          if (soap.target_table === "examination"){
                              return (
                                <div className="data-list" onContextMenu={e => this.handleClick(e, index)} onClick={() => this.onInspectionClicked(soap.data)}>
                                  {this.props.selDay >= 0 && index == 0 && (
                                      <div className="data-header">
                                          {soap.treatment_date.substr(0, 4)}/
                                          {soap.treatment_date.substr(5, 2)}/
                                          {soap.treatment_date.substr(8, 2)}
                                          ({this.getWeekDay(soap.treatment_date.substr(0,10))})
                                      </div>
                                  )}
                                  <div className="data-title">
                                  <div className={`data-item`}>
                                    <div className="flex">
                                        <div className="note">
                                            【{soap.sub_category == "院外" && "院外"}{soap.sub_category == "院内" && "院内"}検査】
                                             {' '}{soap.treatment_date.substr(0, 4)}/
                                            {soap.treatment_date.substr(5, 2)}/
                                            {soap.treatment_date.substr(8, 2)}
                                        </div>
                                    </div>
                                  </div>
                                  {soap.is_doctor_consented == 4 && (
                                      <div className="history-region low-title" style={{display:"flex"}}>
                                          <div style={{width:"50%", textAlign:"left"}}>{soap.importance_level === 100 ? '【重要】' :''}</div>
                                          <div style={{width:"50%", textAlign:"right"}}>(取り込みデータ)</div>
                                      </div>
                                  )}
                                  {soap.is_doctor_consented !== 4 && soap.importance_level === 100 && (
                                      <div className="history-region text-left low-title">
                                          <div>【重要】</div>
                                      </div>
                                  )}
                                </div>
                              </div>
                              )
                          }
                      }
                  ))}
                    {this.state.inspectionModal === true && (
                        <InspectionResultModal
                            closeModal = {this.closeModal.bind(this)}
                            inspectionList = {this.state.inspectionModalContents}
                            patientId={this.props.patientId}
                        />
                    )}
                    <ContextMenu
                      {...this.state.contextMenu}
                      parent={this}
                    />
                    {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
                      <SystemConfirmModal
                          hideConfirm= {this.confirmCancel.bind(this)}
                          confirmCancel= {this.confirmCancel.bind(this)}
                          confirmOk= {this.confirmOk.bind(this)}
                          confirmTitle= {this.state.confirm_message}
                      />
                    )}
                    </div>
                </Col>
            );
        }
    }
}
ExaminationRightBox.contextType = Context;

ExaminationRightBox.propTypes = {
    isLoaded: PropTypes.bool,
    soapTrees: PropTypes.array,
    soapList: PropTypes.array,
    allTags: PropTypes.array,
    updateSoapList: PropTypes.func,
    changeSoapList: PropTypes.func,
    updateSoap: PropTypes.func,
    saveConfirmMessage: PropTypes.func,
    setOpenClose: PropTypes.func,
    showModal: PropTypes.func,
    patientId: PropTypes.number,
    patientInfo: PropTypes.array,
    updateIndex: PropTypes.number,
    categoryType: PropTypes.number,
    selYear: PropTypes.number,
    selMonth: PropTypes.number,
    selDay: PropTypes.number,
    history: PropTypes.object,
    setImportance: PropTypes.func,
}
export default ExaminationRightBox;
