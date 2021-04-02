import React, { Component } from "react";
import styled from "styled-components";
import {
    surface,
    disable
} from "../../_nano/colors";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import $ from "jquery";
import InspectionResultModal from "../../organisms/InspectionResultModal";
import { WEEKDAYS } from "~/helpers/constants";
import { SOAP_TREE_CATEGORY} from "~/helpers/constants";
import { persistedState } from "~/helpers/cache";
import { CACHE_LOCALNAMES} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";
import * as karteApi from "~/helpers/cacheKarte-utils";

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

class InspectionResultRight extends Component {
    constructor(props) {
        super(props);
        let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
        this.state = {
            departmentOptions,
            contextMenu: {
                visible: false,
                x: 0,
                y: 0,
                index: 0,
                menuType: "",
                isDeleted: false
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
        };
        let { cacheDelExamState } = persistedState(this.props.patientId);
        if (this.props.soapList != null && this.props.soapList != undefined) {
            this.props.soapList.map(item=>{                
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
        const soapScrollTop = window.sessionStorage.getItem('soap_scroll_top') !== undefined ? parseInt(window.sessionStorage.getItem('soap_scroll_top')) : 0;
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
        if (this.props.soapList != null && this.props.soapList != undefined) {
            this.props.soapList.map((item, ind) => {
                if (ind == index) {
                    presData = item;
                }
            });
        }

        return presData;
    }

    handleScroll = () => {
        window.sessionStorage.setItem('soap_scroll_top', $("#soap_list_wrapper").scrollTop());
        let page = this.context.page;
        let stopGetHistory = this.context.stopGetHistory;
        if (    
          !stopGetHistory &&       
          $("#soap_list_wrapper").scrollTop() +
            $("#soap_list_wrapper").height() >=
            $("#soap_content_wrapper").height() - 100
        ){
          let soapList = this.props.soapList;
          if (soapList != null && soapList != undefined && soapList.length > 0) {
            if ((page+1)*15>=soapList.length) {
              this.context.$updateStopGetHistory(true);
            }
          }
          this.context.$updatePageNumber(page + 1);
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
        let soapList = this.props.soapList.map((item, ind) => {
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

    handleClick(e, index, nType, isDeleted = false, is_enabled = 1) {
        if(is_enabled === 2){
            return;
        }

        if (e.type === "contextmenu") {
            e.preventDefault();
            e.target.click();
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
                    menuType: nType,
                    isDeleted: isDeleted
                }
            });
        }
    }

    formatDate = str => {
        return str.substr(0, 4) + "/" + str.substr(5, 2) + "/" + str.substr(8, 2);
    }

    getDepartment = id => {
        let departmentStr = "";
        this.state.departmentOptions.map(item => {
            if (parseInt(item.id) === parseInt(id)) {
                departmentStr = item.value;
            }
        });

        return departmentStr;
    }

    onInspectionClicked = soap => {
        this.setState({
            inspectionModalContents : soap.data,
            inspectionModal: true,
            inspectionPatientId: soap.system_patient_id,
            inspectionPatientNumber: soap.patient_number != undefined ? soap.patient_number : "",
            inspectionPatientName: soap.patient_name != undefined ? soap.patient_name : "",
        });
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
        let soapList = this.props.soapList.map((item) => {
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

    confirmOk() {        
        this.setState({
            confirm_message: "",
            confirm_type: "",
            soapIndex: 0,
        });
    }

    confirmCancel() {
        this.setState({
            confirm_message: "",
            confirm_type: "",
            soapIndex: 0,
        });
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

    setTagData =(karte_tree_number, data, sub_key)=>{
        this.closeModal();
        this.props.setTagData('add', karte_tree_number, data, sub_key);
    }
    openResultEditModal = (item, e) => {
        e.stopPropagation();
        e.preventDefault();
        if (item == undefined) return;
        item.patient = {
            patient_name: item.patient_name,
            birthday: item.birthday,
            patient_name_kana: item.patient_name_kana,
            gender: item.gender,
            age: item.age,
            patient_number: item.patient_number,
            system_patient_id:item.system_patient_id
        }
        this.props.openRegisterModal(item);
    }

    render() {
        const { soapList} = this.props;
        let page = this.context.page;
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
                    {soapList.filter((ele, idx)=> {
                      if (idx < (page+1)*15) {
                        return true;
                      } else {
                        return false;
                      }
                    }).map((soap, index) => {
                        if (soap.target_table === "examination"){
                            return (
                                <div className="data-list">
                                    {this.props.selDay >= 0 && index == 0 && (
                                        <div className="data-header">
                                            {soap.treatment_date.substr(0, 4)}/
                                            {soap.treatment_date.substr(5, 2)}/
                                            {soap.treatment_date.substr(8, 2)}
                                            ({this.getWeekDay(soap.treatment_date.substr(0,10))})
                                        </div>
                                    )}
                                    <div className="data-title" onClick={() => this.onInspectionClicked(soap)}>
                                        <div className={`data-item`}>
                                            <div className="flex">
                                                <div className="note">
                                                    【{soap.sub_category == "院外" && "院外"}{soap.sub_category == "院内" && "院内"}検査】
                                                    {' '}{soap.treatment_date.substr(0, 4)}/
                                                    {soap.treatment_date.substr(5, 2)}/
                                                    {soap.treatment_date.substr(8, 2)}
                                                    {soap.patient_number != undefined ? "  (" + soap.patient_number + ") " : ""}
                                                    {soap.patient_name != undefined ? soap.patient_name : ""}
                                                </div>
                                                {soap.is_doctor_consented != 4 && soap.data != undefined && soap.data.is_temporary == 1 && (
                                                    <span onClick={this.openResultEditModal.bind(this, soap)}>一時保存</span>
                                                )}
                                            </div>
                                        </div>
                                        {soap.is_doctor_consented == 4 && (
                                            <div className="history-region text-right low-title">
                                                <span>(取り込みデータ)</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        }
                    })}
                    {this.state.inspectionModal === true && (
                        <InspectionResultModal
                            closeModal = {this.closeModal.bind(this)}
                            inspectionList = {this.state.inspectionModalContents}
                            patientId={this.state.inspectionPatientId}
                            patientNumber={this.state.inspectionPatientNumber}
                            patientName={this.state.inspectionPatientName}
                        />
                    )}               
                    </div>
                </Col>
            );
        }
    }
}
InspectionResultRight.contextType = Context;

InspectionResultRight.propTypes = {
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
    setTagData:PropTypes.func,
    openRegisterModal:PropTypes.func,
}
export default InspectionResultRight;
