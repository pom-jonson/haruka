import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import RadioButton from "~/components/molecules/RadioInlineButton";
import { Row, Col } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as methods from "~/components/templates/Dial/DialMethods";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as apiClient from "~/api/apiClient";
import VARecordInsertModal from "../modals/VARecordInsertModal";
import { formatDateSlash, formatJapanYear, formatDateTimeIE} from "~/helpers/date";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import {displayLineBreak,validateValue, makeList_code} from "~/helpers/dialConstants"
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import InputPanel from "~/components/templates/Dial/Board/molecules/InputPanel";
import DialShowShemaModal from "~/components/templates/Patient/Modals/Common/DialShowShemaModal";
import $ from "jquery";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;
`;
const Wrapper = styled.div`
    display: block;
    height: calc(100vh - 10rem);
    font-size: 1rem;
    overflow-y:auto;
    .border-bottom {
        border-bottom: solid 1px #eee;
        margin-left: 0.625rem;
        margin-top: 0.3rem;
    }
    span {
        color: blue;
        font-weight: bolder;
    }
    .cursor-pointer{
        cursor: pointer;
    }
    .selected{
        background:rgb(42, 182, 193)!important;
    }
    .schema-div{
        display: block;
        width: 100%;
        .schema-content{
            width: 100%;
            float: left;
            text-align: left;
        }
        .no-schema {
            width: 100%;
            text-align: left;
        }
        .schema-button{
            float: right;
        }
      }
 `;
const LeftContent = styled.div`
 width: 69%;
 height: 100%;
 float: left;
 .instruction-doctor{
    width: 80%;
    justify-content: flex-end;
    button{
        float:left;
        margin-top: 0.5rem;
        margin-left: 3%;
    }

    .div-doctor{
        display: inline-block;
        width: 15.625rem;
        label{
            text-align: right;
        }
    }
 }
 .checkbox-group{
   display: flex;
  .gender {
    font-size: 1rem;
      margin-top: 0.3rem;
      .gender-label {
          width: 25%;
          float: left;
          text-align: right;
          margin-top: 0.3rem;
      }
      .radio-btn label{
            width: 18%;
            font-size:1rem;
            border: solid 1px rgb(206, 212, 218);
            border-radius: 0.25rem;
            margin-left: 0.3rem;
      }
  }
  .before-treat{
    width:98%;
    .title {
        border-bottom: solid 1px #ddd;
    }
  }
  .after {
    margin-left: 4%;
  }
}
.middle-content {
    margin-top: 0.625rem;
}

.use-history {
    margin-top: 0.625rem;
    .VAManager__List-sc-1pyghe7-3 {
        height: 10%;
    }
    tbody tr{
        cursor: pointer;
    }
}
.toggle-button{
    margin-top:2px;
    margin-bottom:2px;
}
.instruction-doctor{
    button{
        span{
            font-size: 1rem;
            font-weight: 100;
        }
    }
}
 `;
const RightContent = styled.div`
 width: 30%;
 margin-left:1%;
 height: 100%;
 float: left;
 overflow: hidden;
border: solid 1px black;
.dv-register{
    margin-right: 1.25rem;
    font-size:1rem;
}
img {
    max-height: 85%;
    margin-top: 0.625rem;
    max-width: 100%;
}
 `;
const List = styled.div`
    display: block;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 1rem;
    width: 100%;
    margin-right: 2%;
    height: calc(100% - 7px);
    float: left;
    overflow-y:hidden;
    border: solid 1px darkgray;
    label {
        margin: 0;
    }
    table {
        height: 100%;
        margin-bottom:0px;
        thead{
            display: table;
            width:100%;
        }
        tbody{
            overflow-y:auto;
            display:block;
            height: calc(100% - 18px);
        }
        tr{
            display: table;
            width: 100%;
            box-sizing: border-box;
        }
        tr:nth-child(even) {background-color: #f2f2f2;}
        td {
            padding: 0.25rem;
            text-align: center;
            word-break:break-all;
            input {
                margin: 0;
            }
        }
        th {
            text-align: center;
            padding: 0.3rem;
        }
        .table-check {
            width: 3.75rem;
        }
        .table-content {
            width: 30rem;
        }
        .input-name, .complete-by{
            min-width:10.3rem;
        }
    }
    .tl {
        text-align: left;
    }
    .tr {
        text-align: right;
    }
    
 `;

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;

    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
`;

const TooltipMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
    width: 20rem;
    opacity: 0.8;
    border: 2px solid #807f7f;
    border-radius: 12px;
  }
  .tooltip-item{
    display: flex;
  }
  .item-title{
    width: 6rem;
    text-align: left;
    padding: 3px 3px !important;
  }
  .item-content{
    width: 10rem;
    word-break: break-all;
  }
  .tooltip-content-area{
    line-height: 1rem;
    background: #050404;
    color: white;
  }
  .context-menu li {
    font-size: 1rem;
    line-height: 1.3rem;
    clear: both;
    color: black;
    cursor: pointer;
    font-weight: normal;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    border-bottom: solid 1px #888;
    -webkit-transition: all 0.3s;
    div {
      padding: 3px 3px;
    }
  }
`;

const Tooltip = ({visible,x,y,tooltip_content}) => {
  if (visible) {
    return (
      <TooltipMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div className="tooltip-content-area">
              <div className="tooltip-item">
                <div className="item-title">●日付：</div>
                <div className="item-content">{tooltip_content['show_date']}</div>
              </div>
              
              <div className="tooltip-item">
                <div className="item-title">●{tooltip_content['category'] == 'VA処置歴'? "処置内容":"VA名称"}：</div>
                <div className="item-content">{tooltip_content['show_name']}</div>
              </div>
              
              <div className="tooltip-item">
                <div className="item-title">●実施施設：</div>
                <div className="item-content">{tooltip_content['implemented_facilities']}</div>
              </div>
              <div className="">
                <div className="item-title">●コメント：</div>
                <div className="item-content">{tooltip_content['comment']}</div>
              </div>
            </div>
          </li>
        </ul>
      </TooltipMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu = ({visible,x,y,parent,item, kind}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() =>parent.contextMenuAction("edit", item, kind)}>変更</div></li>
          <li><div onClick={() => parent.contextMenuAction("delete",item, kind)}>削除</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class VAManager extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    var VACodeData = code_master['VA名称'];
    var VA_surgeryCodeData = code_master['VA手術'];
    this.state = {
      VACodeData,
      VA_surgeryCodeData,
      VA_codes:makeList_code(VACodeData),
      VA_surgery_codes:makeList_code(VA_surgeryCodeData),
      VA_list:[],
      sending_continue_list:[],
      is_use_history: 1,
      modal_data:null,
      showContinueSendingModal:false,
      isOpenHistoryModal:false,
      isShowDoctorList: false,
      showImage: "",
      schedule_date:this.props.schedule_date,
      directer_name: "",
      instruction_doctor_number: authInfo != undefined && authInfo != null && authInfo.doctor_number != undefined ?authInfo.doctor_number : "",
      patientInfo: patientInfo,
      item_0:{
        id:"透析前血流",
        val:""
      },
      item_1:{
        id:"透析前シャント音",
        val:""
      },
      item_2:{
        id:"透析前脱血状態",
        val:""
      },
      item_3:{
        id:"透析前皮下出血",
        val:""
      },
      item_4:{
        id:"透析後血流",
        val:""
      },
      item_5:{
        id:"透析後シャント音",
        val:""
      },
      item_6:{
        id:"透析後脱血状態",
        val:""
      },
      item_7:{
        id:"透析後皮下出血",
        val:""
      },
      patient_id:patientInfo !== undefined && patientInfo != null && Object.keys(patientInfo).length > 0 ?patientInfo.system_patient_id:0,
      isDeleteConfirmModal: false,
      isUpdateConfirmModal:false,
      confirm_message:"",
      delete_id:"",
      kind:"",
      staff_name:authInfo != undefined && authInfo != null && authInfo.name != undefined && authInfo.name != ""?authInfo.name : "",
      selected_image_index:0,
      isOpenShemaModal: false,
      
    }
    this.double_click=false;
    this.check_exist_va_items = false;
  }
  
  async componentDidMount(){
    this.getStaffs();
    this.setDoctors();
    this.getVARecordInfo();
    this.getConstInfo();
    this.getVAItemInfo();
    
    var tbody_height = '16.5rem';
    let html_obj = document.getElementsByTagName("html")[0];
    let width = html_obj.offsetWidth;
    if(parseInt(width) < 1367){
      tbody_height = '12rem';
    } else if(parseInt(width) < 1441){
      tbody_height = '13rem';
    } else if(parseInt(width) < 1601){
      tbody_height = '14rem';
    } else if(parseInt(width) < 1681){
      tbody_height = '15rem';
    } else if(parseInt(width) > 1919){
      tbody_height = '16.5rem';
    }
    this.setState({tbody_height});
    // eslint-disable-next-line consistent-this
    const that = this;
    $(document).ready(function() {
      $(window).resize(function() {
        let html_obj = document.getElementsByTagName("html")[0];
        let width = html_obj.offsetWidth;
        var tbody_height = '16.5rem';
        if(parseInt(width) < 1367){
          tbody_height = '12rem';
        } else if(parseInt(width) < 1441){
          tbody_height = '13rem';
        } else if(parseInt(width) < 1601){
          tbody_height = '14rem';
        } else if(parseInt(width) < 1681){
          tbody_height = '15rem';
        } else if(parseInt(width) > 1919){
          tbody_height = '16.5rem';
        }
        that.setState({tbody_height})
      });
    });
  }
  
  componentWillUnmount() {
    this.double_click=null;
    this.check_exist_va_items = null;
    
    var html_obj = document.getElementsByClassName("va_manager_wrapper")[0];
    if(html_obj !== undefined && html_obj != null){
      html_obj.innerHTML = "";
    }
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.patientInfo == nextProps.patientInfo && this.state.schedule_date == nextProps.schedule_date) return;
    this.setState({
      patientInfo: nextProps.patientInfo,
      patient_id:nextProps.patientInfo.system_patient_id,
      schedule_date: nextProps.schedule_date
    }, () => {
      this.getVARecordInfo();
      this.getConstInfo();
      this.getVAItemInfo();
    });
  }
  
  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      isUpdateConfirmModal:false,
      confirm_message: "",
    });
  }
  
  handleClick = (e, item, kind) => {
    if (e.type === "contextmenu"){
      this.hideTooltip();
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
        .getElementById("VA-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("VA-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY,
          item: item,
          kind:kind,
        },
      });
    }
  };
  
  contextMenuAction = (act, item, kind) => {
    if( act === "edit") {
      this.editData(item, kind);
    } else if (act === "delete") {
      let confirm_message = "";
      if (kind === 0) confirm_message = "VA処置歴情報を削除しますか?";
      else if (kind === 1) confirm_message = "VA使用歴情報を削除しますか?";
      else confirm_message = "VA継続申し送りを削除しますか?";
      this.setState({
        isDeleteConfirmModal : true,
        confirm_message,
        delete_id: item.number,
        kind,
      });
    }
  };
  
  editData = (item, kind) => {
    this.setState({
      modal_data:item,
      isOpenHistoryModal: kind!=2?true:false,
      showContinueSendingModal:kind==2?true:false,
      VA_kind:kind,
    });
    
  };
  
  getConstInfo = async () => {
    if(this.state.patient_id != "" && this.state.patient_id != undefined ){
      let path = "/app/api/v2/dial/board/getVASendingData";
      let post_data = {
        patient_id: this.state.patient_id,
        category:"VA継続申し送り",
        schedule_date:this.state.schedule_date,
      };
      apiClient.post(path, {
        params: post_data
      }).then((data) => {
        this.setState({
          sending_continue_list: data,
        });
      }).catch(() => {
      });
    }
  };
  getShowDate = (item) => {
    if(item == undefined || item == null) return "";
    if(item.date != null) {
      return formatDateSlash(item.date);
    } else if( item.month != null ) {
      // return formatJapanYearMonth(item.year.toString() + "-" + ("00" + item.month.toString()).slice(-2));
      return (item.year.toString() + "/" + ("00" + item.month.toString()).slice(-2));
    } else {
      return formatJapanYear(item.year.toString());
    }
  }
  
  deleteData = async () => {
    if(this.state.delete_id !== '') {
      let path = '';
      if (this.state.kind == 2) path = "/app/api/v2/dial/board/deleteSendingData";
      else path = "/app/api/v2/dial/medicine_information/VARecord/delete";
      
      let post_data = {
        params: {number: this.state.delete_id, system_patient_id:this.state.patient_id},
      };
      await apiClient.post(path, post_data).then(()=>{
        window.sessionStorage.setItem(
          "alert_messages",
          "削除完了##" + "削除しました。");
      });
      if (this.state.kind == 2) this.getConstInfo();
      else this.getVARecordInfo();
    }
    this.confirmCancel();
  };
  
  getVARecordInfo = async() => {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if(patientInfo === undefined || patientInfo == null || Object.keys(patientInfo).length === 0){
      return;
    }
    let path = "/app/api/v2/dial/medicine_information/VARecord/search";
    await apiClient
      ._post(path, {
        params: {
          patient_id:patientInfo.system_patient_id,
          category:this.state.is_use_history==1?'VA使用歴':"VA処置歴",
        }
      })
      .then((res) => {
        var selected_image_index = undefined;
        if (this.state.is_use_history == 1 && res.length > 0){
          for(var i = 0 ; i< res.length; i++){
            if (res[i].category == 'VA使用歴') {
              selected_image_index = i;
              break;
            }
          }
        }
        // let showImageData = this.getShowImage(res, this.state.is_use_history);
        let showImageData = this.getShowImage(res, 1);
        this.setState({
          VA_list:res,
          showImage: showImageData,
          selected_image_index,
        });
      })
      .catch(() => {
      
      });
  }
  
  getVAItemInfo = async() => {
    if(!validateValue(this.props.patientInfo)){
      return;
    }
    if(this.state.schedule_date === undefined || this.state.schedule_date == null || this.state.schedule_date === ""){
      return;
    }
    let path = "/app/api/v2/dial/board/search_va_text";
    await apiClient
      ._post(path, {
        params: {
          system_patient_id:this.props.patientInfo.system_patient_id,
          write_date: formatDateTimeIE(this.state.schedule_date),
          category_1: "VA管理"
        }
      })
      .then((res) => {
        if (res.length > 0) {
          this.check_exist_va_items = true;
          let item0 = "", item1 = "", item2 = "", item3 = "", item4 = "", item5 = "", item6 = "", item7 = "";
          let nInstructionDoctorNumber = 0;
          res.map(item=>{
            if (item.category_2 == "透析前血流") {
              item0 = item.body;
            }
            if (item.category_2 == "透析前シャント音") {
              item1 = item.body;
            }
            if (item.category_2 == "透析前脱血状態") {
              item2 = item.body;
            }
            if (item.category_2 == "透析前皮下出血") {
              item3 = item.body;
            }
            if (item.category_2 == "透析後血流") {
              item4 = item.body;
            }
            if (item.category_2 == "透析後シャント音") {
              item5 = item.body;
            }
            if (item.category_2 == "透析後脱血状態") {
              item6 = item.body;
            }
            if (item.category_2 == "透析後皮下出血") {
              item7 = item.body;
            }
            nInstructionDoctorNumber = item.instruction_doctor_number;
          });
          this.setState({
            item_0:{...this.state.item_0, val: item0},
            item_1:{...this.state.item_1, val: item1},
            item_2:{...this.state.item_2, val: item2},
            item_3:{...this.state.item_3, val: item3},
            item_4:{...this.state.item_4, val: item4},
            item_5:{...this.state.item_5, val: item5},
            item_6:{...this.state.item_6, val: item6},
            item_7:{...this.state.item_7, val: item7},
            instruction_doctor_number: nInstructionDoctorNumber
          });
        } else {
          this.check_exist_va_items = false;
          this.setState({
            item_0:{...this.state.item_0, val: ""},
            item_1:{...this.state.item_1, val: ""},
            item_2:{...this.state.item_2, val: ""},
            item_3:{...this.state.item_3, val: ""},
            item_4:{...this.state.item_4, val: ""},
            item_5:{...this.state.item_5, val: ""},
            item_6:{...this.state.item_6, val: ""},
            item_7:{...this.state.item_7, val: ""},
            instruction_doctor_number: ""
          });
        }
      })
      .catch(() => {
        this.check_exist_va_items = false;
      });
  }
  
  
  handleOk = () => {
    this.closeModal();
    this.getVARecordInfo();
    this.getConstInfo();
  }
  
  getShowImage = (imageLists, category) => {
    let showImageLists = [];
    if (imageLists != undefined && imageLists != null && imageLists.length > 0) {
      imageLists.map((item) => {
        
        if (category == 1 && item.category == "VA使用歴") {
          showImageLists.push(item);
        } else if(category != 1 && item.category == "VA処置歴"){
          showImageLists.push(item);
        }
        
      });
    }
    return showImageLists.length > 0 ? showImageLists[0] : "";
  }
  openUseHistoryModal = () => {
    if (!validateValue(this.state.patientInfo)){
      window.sessionStorage.setItem("alert_messages", "患者様を選択してください。");
      return;
    }
    this.setState({
      isOpenHistoryModal: true,
      modal_data:null,
      patient_number: this.state.patientInfo.patient_number
    });
  };
  closeModal = () => {
    this.setState({
      isOpenHistoryModal: false,
      showContinueSendingModal:false,
    });
  };
  changeHistory =() => {
    if (this.state.is_use_history === 1){
      let showImageData = this.getShowImage(this.state.VA_list, 1);
      this.setState({
        is_use_history: 0,
        showImage: showImageData,
        selected_image_index:undefined,
      });
    }
    if (this.state.is_use_history === 0){
      let showImageData = this.getShowImage(this.state.VA_list, 1);
      var selected_image_index = undefined;
      if (this.state.VA_list.length > 0){
        for(var i = 0 ; i< this.state.VA_list.length; i++){
          if (this.state.VA_list[i].category == 'VA使用歴') {
            selected_image_index = i;
            break;
          }
        }
      }
      this.setState({
        is_use_history: 1,
        showImage: showImageData,
        selected_image_index,
      });
    }
    
  };
  
  openAddContinueSendingModal = () => {
    if (!validateValue(this.state.patientInfo)){
      window.sessionStorage.setItem("alert_messages", "患者様を選択してください。");
      return;
    }
    this.setState({
      modal_data: null,
      showContinueSendingModal: true});
  }
  
  selectShowImage = (e, item, index) => {
    if (this.state.is_use_history !=1) return;
    this.setState({
      showImage: item,
      selected_image_index:index,
    });
  };
  
  handlePannelOk = () => {
    this.closeModal();
    this.getVARecordInfo();
    this.getConstInfo();
  }
  
  confirmSave = () => {
    this.confirmCancel();
    let itemLists = [
      this.state.item_0,
      this.state.item_1,
      this.state.item_2,
      this.state.item_3,
      this.state.item_4,
      this.state.item_5,
      this.state.item_6,
      this.state.item_7
    ];
    
    let postData = [];
    itemLists.map(item=>{
      let arr = {
        category_1: "VA管理",
        category_2: item.id,
        body: item.val
      };
      postData.push(arr);
    });
    
    this.sendKarteInfo(postData).then(() => {
      this.check_exist_va_items = true;
    });
    this.setChangeFlag(0);
  }
  
  handleSaveKarteText = () => {
    if (!(this.state.patient_id >0)) return;
    this.setState({
      isUpdateConfirmModal:true,
      confirm_message:this.check_exist_va_items?'変更しますか？':'登録しますか？'
    })
  }
  
  async sendKarteInfo (postData){
    if (!validateValue(this.state.patientInfo)){
      window.sessionStorage.setItem("alert_messages", "患者様を選択してください。");
      return;
    }
    if (this.double_click == true) return;
    this.double_click = true;
    let path = "/app/api/v2/dial/board/update_va_text";
    const post_data = {
      system_patient_id: this.state.patientInfo.system_patient_id,
      contents: postData,
      write_date: formatDateTimeIE(this.state.schedule_date),
      instruction_doctor_number: this.state.instruction_doctor_number != "" ? this.state.instruction_doctor_number : 0
    };
    await apiClient.post(path, {params:post_data}).then((res) => {
        if (res)
          var title = '';
        var message = res.alert_message;
        if (message.indexOf('変更') > -1) title = "変更完了##";
        if (message.indexOf('登録') > -1) title = "登録完了##";
        window.sessionStorage.setItem("alert_messages", title + res.alert_message);
      })
      .catch(() => {
        window.sessionStorage.setItem("alert_messages", "通信に失敗しました。");
      }).finally(()=>{
        this.double_click=false;
      });
  }
  
  selectDoctor = (doctor) => {
    this.setState({
      directer_name:doctor.name,
      instruction_doctor_number:doctor.number
    })
    this.closeDoctorSelectModal();
  }
  
  showDoctorList = () => {
    this.setState({
      isShowDoctorList:true
    });
  }
  
  closeDoctorSelectModal = () => {
    this.setState({
      isShowDoctorList:false,
    });
  }
  
  setChangeFlag=(change_flag)=>{
    if (!(this.state.patient_id > 0)) return;
    this.setState({change_flag});
    if (change_flag){
      sessApi.setObjectValue('dial_change_flag', 'va_manage', 1)
    } else {
      sessApi.remove('dial_change_flag');
    }
  };
  
  selectItem_0 = (e) => {
    if (this.state.patientInfo == undefined || this.state.patientInfo == null || Object.entries(this.state.patientInfo).length == 0){
      window.sessionStorage.setItem("alert_messages", "患者様を選択してください。");
      return;
    }
    this.setState({
      item_0: {
        ...this.state.item_0,
        val: e.target.value
      }
    });
    this.setChangeFlag(1);
  };
  
  selectItem_1 = (e) => {
    if (this.state.patientInfo == undefined || this.state.patientInfo == null || Object.entries(this.state.patientInfo).length == 0){
      window.sessionStorage.setItem("alert_messages", "患者様を選択してください。");
      return;
    }
    this.setState({
      item_1: {
        ...this.state.item_1,
        val: e.target.value
      }
    });
    this.setChangeFlag(1);
  };
  
  selectItem_2 = (e) => {
    if (this.state.patientInfo == undefined || this.state.patientInfo == null || Object.entries(this.state.patientInfo).length == 0){
      window.sessionStorage.setItem("alert_messages", "患者様を選択してください。");
      return;
    }
    this.setState({
      item_2: {
        ...this.state.item_2,
        val: e.target.value
      }
    });
    this.setChangeFlag(1);
  };
  
  selectItem_3 = (e) => {
    if (this.state.patientInfo == undefined || this.state.patientInfo == null || Object.entries(this.state.patientInfo).length == 0){
      window.sessionStorage.setItem("alert_messages", "患者様を選択してください。");
      return;
    }
    this.setState({
      item_3: {
        ...this.state.item_3,
        val: e.target.value
      }
    });
    this.setChangeFlag(1);
  };
  
  openShema = (item) => {
    this.setState({
      isOpenShemaModal: true,
      imgBase64: item.imgBase64,
      image_comment: item.image_comment,
      title: item.title
    });
  }
  
  closeShemaModal = () => {
    this.setState({
      isOpenShemaModal: false
    })
  }
  
  hideTooltip = () => {
    this.setState({ tooltip: { visible: false} });
  };
  
  render() {
    let {sending_continue_list, VA_list, VA_codes, showImage,VA_surgery_codes} = this.state;
    return (
      <>
        <Wrapper className="va_manager_wrapper">
          <LeftContent>
            <div className={`checkbox-group`}>
              <div className={`before-treat`}>
                <div className={`title`}>透析前</div>
                <div className="gender">
                  <label className="mr-2 gender-label">血流</label>
                  <RadioButton
                    id="bb-good"
                    value={"良好"}
                    label="良好"
                    name="item0"
                    getUsage={this.selectItem_0}
                    checked={this.state.item_0.val == "良好"}
                  
                  />
                  <RadioButton
                    id="bb-week"
                    value={"微弱"}
                    label="微弱"
                    getUsage={this.selectItem_0}
                    name="item0"
                    checked={this.state.item_0.val == "微弱"}
                  />
                  <RadioButton
                    id="bb-bad"
                    value={"不良"}
                    label="不良"
                    getUsage={this.selectItem_0}
                    name="item0"
                    checked={this.state.item_0.val == "不良"}
                  />
                </div>
                <div className="gender">
                  <label className="mr-2 gender-label">シャント音</label>
                  <RadioButton
                    id="bs-good"
                    value={"良好"}
                    label="良好"
                    name="item1"
                    getUsage={this.selectItem_1}
                    checked={this.state.item_1.val == "良好"}
                  />
                  <RadioButton
                    id="bs-week"
                    value={"微弱"}
                    label="微弱"
                    name="item1"
                    getUsage={this.selectItem_1}
                    checked={this.state.item_1.val == "微弱"}
                  />
                  <RadioButton
                    id="bs-bad"
                    value={"不良"}
                    label="不良"
                    name="item1"
                    getUsage={this.selectItem_1}
                    checked={this.state.item_1.val == "不良"}
                  />
                </div>
                
                <div className="gender">
                  <label className="mr-2 gender-label">スリル</label>
                  <RadioButton
                    id="bcon-good"
                    value={"良好"}
                    label="良好"
                    name="item2"
                    getUsage={this.selectItem_2}
                    checked={this.state.item_2.val == "良好"}
                  />
                  <RadioButton
                    id="bcon-week"
                    value={"微弱"}
                    label="微弱"
                    name="item2"
                    getUsage={this.selectItem_2}
                    checked={this.state.item_2.val == "微弱"}
                  />
                </div>
                <div className="gender">
                  <label className="mr-2 gender-label">皮下出血</label>
                  <RadioButton
                    id="bsub-minus"
                    value={"（－）"}
                    label="（－）"
                    name="item3"
                    getUsage={this.selectItem_3}
                    checked={this.state.item_3.val == "（－）"}
                  />
                  <RadioButton
                    id="bsub-plus"
                    value={"（＋）"}
                    label="（＋）"
                    name="item3"
                    getUsage={this.selectItem_3}
                    checked={this.state.item_3.val == "（＋）"}
                  />
                  <RadioButton
                    id="bsub-double-plus"
                    value={"（＋＋）"}
                    label="（＋＋）"
                    name="item3"
                    getUsage={this.selectItem_3}
                    checked={this.state.item_3.val == "（＋＋）"}
                  />
                </div>
              </div>
            </div>
            <div className='instruction-doctor d-flex footer-buttons'>
              <Button className={this.state.patient_id >0?'red-btn':'disable-btn'} onClick={this.handleSaveKarteText}>{this.check_exist_va_items?'変更':'登録'}</Button>
            </div>
            <div className={`use-history mt-2`}>
              <Row>
                <Col>継続申し送り</Col>
                <Col className={`text-right cursor-pointer`} onClick ={this.openAddContinueSendingModal}><Icon icon={faPlus}/>申し送りを追加</Col>
              </Row>
              <List>
                <table className="table-scroll table table-bordered table-hover" id="wordList-table">
                  <thead style={{width:'calc(100% - 18px)'}}>
                  <tr>
                    <th style={{width:'20px'}}/>
                    {/*<th className="table-check">完了</th>*/}
                    <th className="table-content">内容</th>
                    <th style={{width:'100px', borderRightStyle:'none'}}>入力者</th>
                    {/*<th className="complete-by">完了者</th>*/}
                  </tr>
                  </thead>
                  <tbody style={{overflowY:'scroll', height:this.state.tbody_height}}>
                  {sending_continue_list !== undefined && sending_continue_list !== null && sending_continue_list.length > 0 && this.state.staff_list_by_number!= undefined && (
                    sending_continue_list.map((item, index) => {
                      return (
                        <>
                          <tr onContextMenu={e => this.handleClick(e,item,2)}>
                            <td style={{width:'20px'}} className="text-center">{index + 1}</td>
                            <td className="table-content">
                              <div className="schema-div">
                                <div className={item.image_path != null &&
                                item.image_path != "" &&
                                item.imgBase64 != "" ? "schema-content" :"no-schema"}>{displayLineBreak(item.message)}</div>
                                {item.image_path != null && item.image_path != "" && item.imgBase64 != "" && (
                                  <div className="schema-button"><Button onClick={()=>this.openShema(item)}>シェーマを見る</Button></div>
                                )}
                              </div>
                            </td>
                            <td style={{width:'100px'}}>{this.state.staff_list_by_number[item.updated_by]}</td>
                          </tr>
                        </>)
                    })
                  )}
                  </tbody>
                </table>
              </List>
            </div>
            <div className={`use-history mt-2`}>
              <Row>
                <Col md={2}>{this.state.is_use_history === 1 ? "使用歴" : "処置歴"}</Col>
                <Col md={7}><button onClick={this.changeHistory.bind(this)} className='cursor-pointer toggle-button'>{this.state.is_use_history === 1 ? "処置歴を表示" : "使用歴を表示"}</button></Col>
                <Col md={3} className={`text-right cursor-pointer`} onClick={this.openUseHistoryModal}><Icon icon={faPlus} />{this.state.is_use_history === 1 ? "使用歴を追加" : "処置歴を追加"}</Col>
              </Row>
              <List>
                <table className="table-scroll table table-bordered table-hover" id="VA-table">
                  <thead style={{width:'calc(100% - 18px)'}}>
                  <tr>
                    <th style={{width:'6rem'}}>日付</th>
                    <th style={{width:'13rem'}}>{this.state.is_use_history==1?'VA名称':"処置内容"}</th>
                    <th style={{width:'14rem'}} className="name">実施施設</th>
                    <th style={{borderRightStyle:'none'}}>コメント</th>
                  </tr>
                  </thead>
                  <tbody style={{overflowY:'scroll',height:this.state.tbody_height}}>
                  
                  {VA_list !== undefined && VA_list !== null && VA_list.length > 0 && VA_codes != undefined && VA_codes != null && (
                    VA_list.map((item, index) => {
                        let category = this.state.is_use_history==1?'VA使用歴':"VA処置歴";
                        if (category == item.category){
                          return (
                            <>
                              <tr
                                className={this.state.selected_image_index == index && this.state.is_use_history == 1?"selected":""}
                                onClick={e=>this.selectShowImage(e, item, index)}
                                onContextMenu={e => this.handleClick(e,item,this.state.is_use_history)}
                              >
                                <td  style={{width:'6rem'}}>{this.getShowDate(item)}</td>
                                <td className='text-left' style={{width:'13rem'}}>{this.state.is_use_history==1?(VA_codes[item.va_title_code] != undefined ? VA_codes[item.va_title_code] : ""):(VA_surgery_codes[item.va_title_code] != undefined ? VA_surgery_codes[item.va_title_code]: "")}</td>
                                <td className='text-left' style={{width:'14rem'}}>{item.implemented_facilities}</td>
                                <td className='text-left'>{item.comment != null && item.comment != '' ?displayLineBreak(item.comment):''}</td>
                              </tr>
                            </>)
                        }
                      }
                    ))}
                  </tbody>
                </table>
              </List>
            </div>
          </LeftContent>
          <RightContent>
            <div style={{fontSize:"2rem",padding:"3px"}} className={`border-bottom`}>
              {showImage !== undefined && showImage != null && showImage.va_title_code !== undefined && showImage.va_title_code != null ? VA_codes[showImage.va_title_code]:''}
            </div>
            <div className={`border-bottom`}>
              <div style={{padding: "3px"}} className="d-flex">
                <div className="dv-register">登録者</div>
                <div className={`w-75 text-left`}><sapn>{showImage !== undefined && showImage != null && this.state.staff_list_by_number !== undefined && this.state.staff_list_by_number != null &&  this.state.staff_list_by_number[showImage.updated_by]}</sapn></div>
              </div>
            </div>
            <img src={showImage !== undefined && showImage != null && showImage.imgBase64} alt="" />
          </RightContent>
          {this.state.isOpenHistoryModal == true && (
            <VARecordInsertModal
              handleOk={this.handleOk}
              closeModal={this.closeModal}
              kind = {this.state.is_use_history}
              VACodeData = {this.state.VACodeData}
              VA_surgeryCodeData = {this.state.VA_surgeryCodeData}
              VA_codes = {this.state.VA_codes}
              VA_surgery_codes = {this.state.VA_surgery_codes}
              patient_id = {this.state.patient_id}
              patient_number = {this.state.patientInfo.patient_number != undefined ? this.state.patientInfo.patient_number : 0}
              modal_data = {this.state.modal_data}
            />
          )}
        </Wrapper>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        <Tooltip
          {...this.state.tooltip}
          parent={this}
          tooltip_content={this.state.tooltip_content}
          tooltip_type={this.state.tooltip_type}
        />
        {this.state.isShowDoctorList !== false && (
          <DialSelectMasterModal
            selectMaster = {this.selectDoctor}
            closeModal = {this.closeDoctorSelectModal}
            MasterCodeData = {this.state.doctors}
            MasterName = '医師'
          />
        )}
        {this.state.isDeleteConfirmModal !== false && (
          <ConfirmNoFocusModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.deleteData.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isUpdateConfirmModal !== false && (
          <ConfirmNoFocusModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmSave.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.showContinueSendingModal && (
          <InputPanel
            handleOk={this.handlePannelOk.bind(this)}
            closeModal={this.handlePannelOk.bind(this)}
            kind='VA継続'
            patient_id = {this.state.patient_id}
            schedule_date={this.state.schedule_date}
            item = {this.state.modal_data}
          />
        )}
        {this.state.isOpenShemaModal === true && (
          <DialShowShemaModal
            closeModal={this.closeShemaModal}
            imgBase64={this.state.imgBase64}
            image_comment={this.state.image_comment}
            title={this.state.title}
          />
        )}
      </>
    )
  }
}

VAManager.contextType = Context;

VAManager.propTypes = {
  patientInfo: PropTypes.object,
  schedule_date: PropTypes.string,
};

export default VAManager