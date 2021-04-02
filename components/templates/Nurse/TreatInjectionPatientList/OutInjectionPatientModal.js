import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatDateSlash} from "~/helpers/date";
// import {formatDateLine} from "~/helpers/date";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import axios from "axios/index";
// import HospitalApplicationOrder from "~/components/templates/Patient/Modals/Hospital/HospitalApplicationOrder";
import Button from "~/components/atoms/Button";
import Radiobox from "~/components/molecules/Radiobox";
import SearchBar from "~/components/molecules/SearchBar";
import TreatInjectionSelect from "./TreatInjectionSelect";
import { options } from "~/helpers/departments";
import * as colors from "~/components/_nano/colors";
import Spinner from "react-bootstrap/Spinner";
import TreatDoneModal from "~/components/templates/OrderList/TreatDoneModal";
import DoneModal from "~/components/organisms/DoneModal";
import {getAutoReloadInfo} from "~/helpers/constants";
import Checkbox from "~/components/molecules/Checkbox";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import Context from "~/helpers/configureStore";
import {setDateColorClassName} from '~/helpers/dialConstants'
import {DatePickerBox} from "~/components/styles/DatePickerBox";
registerLocale("ja", ja);

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 padding-left:0.8rem;
 padding-right:0.8rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .tb-record{
  cursor:pointer;
 }
 .selected{
    background: lightblue !important;
  }
 .tb-record:hover{
  background-color: ${colors.secondary200};
 }
 .spinner-disease-loading{
    height: 20rem;
    overflow-y: auto;
    // width: calc(100% - 80px);
  }
 .block-area {
    border: 1px solid #aaa;
    margin-top: 15px;
    padding: 10px;
    position: relative;
    label {
      font-size: 0.9rem;
      width: 45%;
    }
  }
  .block-title {
    position: absolute;
    top: -12px;
    left: 10px;
    font-size: 1rem;
    background-color: white;
    padding-left: 5px;
    padding-right: 5px;
  }
 label {
   margin-bottom:0;
   height:2.2rem;
   line-height:2.2rem;
 }
 button {  
  font-size: 1rem;
 }
.select-period {
    .period-title {    
        line-height: 2.2rem;
        width: 70px;
        text-align: right;
        margin-right: 10px;
    }
    div {
        margin-top: 0;
    }
    input {
      width:7rem;
      height:2.2rem;
    }
    .from-to{
        padding-left:5px;                
        padding-right:5px;    
        line-height: 2.2rem;
    }
    .label-title {
        width: 0;
        margin: 0;
    }
}
.table-scroll {
  width: 100%;
  height: 100%;
  max-height: 190px;

  .no-result {
    padding: 10rem;
    text-align: center;

    p {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
}
.pullbox-select {
    height: 2.2rem;
    width: 10rem;
}
.pullbox {
    .label-title {
        width: 70px;
        text-align: right;
        line-height: 2.2rem;
        margin-right: 10px;
        font-size: 16px;
    }
}
.radio-area {
    margin-right: 1rem;
    label {
        line-height: 2.2rem;
        font-size: 1rem;
        width: 10rem;
    }
    // text-align: center;
    width: 10rem;
}
.table-title {
    margin-top: 0.5rem;
    label {
        margin-bottom: 0;
    }
    .table-name {
        border: 1px solid #aaa;
        width: 180px;
        text-align: center;
    }
    .table-color {
        width: 100px;
        text-align: center;
    }
    .table-request {
        width: 50px;
        text-align: center;
    }
    .table-ok {
        width: 50px;
        text-align: center;
        border: 1px solid #aaa;
    }
}

.table-area {
    .not-done{
      color: red;
    }
   table {
      font-size: 1rem;
      margin-bottom: 0;
    }
    thead{
      margin-bottom: 0;
      display:table;
      width:100%;        
      // border-bottom: 1px solid #dee2e6;    
      tr{width: calc(100% - 17px);}
    }
    tbody{
      height: calc(58vh - 65px);
      overflow-y: scroll;
      display:block;
      // tr:nth-child(even) {background-color: #f2f2f2;}
      // tr:hover{background-color:#e2e2e2;}
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        padding: 0.25rem;
        text-align: left;
        display: table-cell;
        vertical-align: middle;
    }
    th {
        text-align: center;
        padding: 0.3rem;
        border-bottom: 1px solid #dee2e6;
    }      
    .tl {
        text-align: left;
    }      
    .tr {
        text-align: right;
    }
    .white-row:hover {background-color: #f2f2f2;}
    .purple-row {
      background-color: #A757A8;
      color:white;
    }
    .purple-row:hover {
      background-color: #f377f5;
      color:white;
    }
    .pink-row {
      background-color: #F8ABA6;
      color:white;
    }
    .pink-row:hover {
      background-color: #fb8078;
      color:white;
    }
}
// .selected {
//     background: rgb(105, 200, 225) !important;
// }
.react-datepicker-popper {
  // top: -4rem !important;
  .react-datepicker {
    .react-datepicker__navigation--previous, .react-datepicker__navigation--next {
      height:10px !important;
    }
  }
}

.patient-name{
  width: "80px";
  line-height: 30px;
  margin-left: 10rem;
}
.patient-name-label{
  width: 10rem;
  border: 1px solid #aaa;
  margin-right: 3rem;
}
.button-group{
  float: right;
  button{
    margin-left: 10px;
  }
}
.user-css{
  width: 80px;
  line-height: 2.2rem;
}
.user-content-css{
  width: 150px;
  border: 1px solid #aaa;
  line-height: 2.2rem;
  margin-right: 20px;
}
.react-datepicker-wrapper{
  height: 2.2rem;
  input{
    height: 2.2rem;
    font-size: 1rem;
  }
}
.search-box{
  width: 15rem;
  height: 2.2rem;
  input{
    width: 15rem;
    height: 2.2rem;
    font-size: 1rem;
  }
}
.condition-area{
  width: 50%;
  svg{
    top: 0.45rem;
  }
  .pullbox-title{
    width: 5rem;
  }
  .pullbox{
    .pullbox-title{
      font-size: 1rem;
    }
    .pullbox-select{
      font-size: 1rem;
    }
  }
  .search-box{
    input{
      ime-mode: inactive;
    }
  }
}
.date-area{
  width: 3rem;
  // margin-left: 3rem;
  line-height: 2.2rem;
  font-size: 1rem;
  margin-right: 0px !important;
}
.header-area{
  justify-content: space-between;
}
.button-area1{
  justify-content: flex-end;
  .user-content-css{
    margin-right: 0px;
  }
  button{
    width: 7rem;
    margin-left: 2rem;
  }
}
.button-area2{
  margin-top: 30px;
  justify-content: flex-end;  
  button{
    width: 7rem;
    margin-left: 2rem;
  }
}
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .auto-reload {
    label {font-size:1rem;}
  }

  .padding-10{
    border:1px solid;    
    td{
      padding-left:5px;
      padding-right:60px;
    }
  }
`;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
`;

const InputBox = styled.div`
  display: flex;
  margin-left: 1rem;

  label {
    color: ${colors.onSecondaryDark};
    font-size: 12px;
    line-height: 38px;
    letter-spacing: 0.4px;
    margin-right: 8px;
  }

  input {
    border-radius: 4px;
    border: solid 1px #ced4da;
    background: ${colors.surface};
    color: ${colors.onSecondaryDark};
    font-size: 12px;
    padding: 0 8px;
    width: 120px;
    height: 38px;
  }
`;

const ContextMenuUl = styled.div`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
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
      font-size: 16px;
    }
    img {
      width: 2.2rem;
      height: 2.2rem;
    }
    svg {
      width: 2.2rem;
      margin: 8px 0;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
  .patient-info-table {
        width: 100%;
        table {
            margin-bottom: 0;
        }
        th {
            font-size: 16px;
            vertical-align: middle;
            padding: 0;
            text-align: right;
            width: 110px;
            padding-right: 5px;
        }
        td {
            font-size: 16px;
            vertical-align: middle;
            padding: 0;
            text-align: left;
            padding-left: 5px;
        }
  }
`;

const ContextMenu = ({ visible, x,  y,  parent,  row_index}) => {
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    <li><div onClick={() => parent.contextMenuAction(row_index,"complete")}>詳細</div></li>
                    {/*<li><div onClick={() => parent.contextMenuAction(row_index,"karte_view")}>カルテを開く</div></li>*/}
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};

class OutInjectionPatientModal extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let department_codes = [{id:0, value:"全て"}];
    let diagnosis = {};
    departmentOptions.map(department=>{
      department_codes.push(department);
      diagnosis[parseInt(department.id)] = department.value;
    });
    let auto_reload = 1;
    this.reload_time = 60 * 1000;
    let auto_reload_info = getAutoReloadInfo("treatment_injection_patient_list");
    if(auto_reload_info != undefined && auto_reload_info != null){
      if(parseInt(auto_reload_info.reload_time) > 0){
        this.reload_time = parseInt(auto_reload_info.reload_time) * 1000;
      }
      auto_reload = auto_reload_info.status;
    }
    this.state = {
      start_date: '',
      end_date: '',
      course_date:new Date(),
      keyword: "",
      ward_master:[{id:0, value:"全病棟"}],
      ward_names:{},
      urgency_master:{},
      discharge_route_master:{},
      hospital_room_master:{},
      outcome_reason_master:{},
      department_codes,
      diagnosis,
      department_id:0,
      first_ward_id:0,
      hospitalization_list:[],
      discharge_list:[],
      hos_number:0,
      alert_messages:"",
      complete_message:"",
      openDischargePermitOrder:false,
      confirm_message:"",
      confirm_type:"",
      search_type: 1,
      search_implement_type: 1,
      pre_hos:0,
      next_hos:0,
      departmentStatus: 0,
      table_list: [],
      isLoaded: false,
      isOpenTreatInjectionSelect:false,
      selected_index:'',
      auto_reload,
      patientInfo: {},
      treatInjectData: []
    }
    this.openModalStatus = 0;
  }

  async componentDidMount() {
    await this.getMaster();

    // get injection and treatment list
    await this.getInjectionTreatementList();
    // // get injection
    // await this.getInjectionList();
    // // get treatment
    // await this.getTreatmentList();
    this.reloadInterval = setInterval(async()=>{
      this.autoReload();
    }, this.reload_time)
  }

  autoReload=()=>{
    if(this.state.auto_reload == 1 && this.openModalStatus == 0){
      this.getInjectionTreatementList();
    }
  }
  
  componentWillUnmount (){
    clearInterval(this.reloadInterval);
  }

  getMaster=async()=> {
    let path = "/app/api/v2/ward/get/bed_control/master_data";
    let post_data = {
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let ward_master = this.state.ward_master;
        let ward_names = this.state.ward_names;
        let urgency_master = this.state.urgency_master;
        let discharge_route_master = this.state.discharge_route_master;
        let hospital_room_master = this.state.hospital_room_master;
        let outcome_reason_master = this.state.outcome_reason_master;
        if(res.ward_master.length > 0){
          res.ward_master.map(ward=>{
            ward_master.push({id:ward.number, value:ward.name});
            ward_names[ward.number] = ward.name;
          });
        }
        if(res.urgency_master.length > 0){
          res.urgency_master.map(urgency=>{
            urgency_master[urgency.number] = urgency.name;
          });
        }
        if(res.discharge_route_master.length > 0){
          res.discharge_route_master.map(route=>{
            discharge_route_master[route.number] = route.name;
          });
        }
        if(res.hospital_room_master.length > 0){
          res.hospital_room_master.map(room=>{
            hospital_room_master[room.number] = room.name;
          });
        }
        if(res.outcome_reason_master.length > 0){
          res.outcome_reason_master.map(reason=>{
            outcome_reason_master[reason.number] = reason.name;
          });
        }
        this.setState({
          ward_master,
          ward_names,
          urgency_master,
          discharge_route_master,
          hospital_room_master,
          outcome_reason_master,
        });
      })
      .catch(() => {

      });
  };

  getInjectionTreatementList = async (_type="") => {
    let path = "/app/api/v2/order/injectionTreatmentList";
    let post_data = {
        keyword:this.state.keyword,
        state:this.state.search_implement_type,
        date:this.state.course_date !== '' ? formatDateLine(this.state.course_date) : '' ,
        type:this.state.search_type == 2? "treatment" : this.state.search_type == 3 ? "injection" : "all",
        start_date: "",
        department:this.state.departmentStatus
    };

    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
            this.setState({
              table_list:res,
              isLoaded: true
            },()=>{
              if (_type == "enter") { // input patient id and press enter key
                // →患者IDを入力してEnterを押下すると、処理選択画面が開き、その患者IDの患者情報を表示します。
                if (res.length > 0) {
                  let patientInfo = {};
                  if (res[0] != undefined && res[0] != null) {
                    patientInfo = this.getPatientInfoFromOrder(res[0]);
                  }
                  this.setState({
                    isOpenTreatInjectionSelect: true,
                    patientInfo: patientInfo,
                    treatInjectData: res,
                    selected_index: ''
                  });
                }
              }
            });
        }
      })
      .catch(() => {

      })
  }

  // getInjectionList = async () => {
  //   let dateStr = this.state.course_date
  //     ? this.formatDate4API(this.state.course_date)
  //     : "";
  //     let apitxt = "/app/api/v2/order/injection/injections?";

  //   apitxt =
  //     apitxt +
  //     (this.state.keyword != "" ? "keyword=" + this.state.keyword + "&" : "");
  //   apitxt = apitxt + (dateStr != "" ? "date=" + dateStr + "&" : "");
  //   apitxt =
  //     apitxt +
  //     (this.state.departmentStatus
  //       ? "department=" + this.state.departmentStatus + "&"
  //       : "department=0&");
  //   let state = this.state.search_implement_type;
  //   // if (state == 2) state = 3;
  //   // else if (state == 3) state =2;
  //   apitxt = apitxt + "state=" + state + "&";
  //   // let startDateStr = this.state.start_date
  //   //   ? this.formatDate4API(this.state.start_date)
  //   //   : "";
  //   // apitxt = apitxt + "start_date=" + startDateStr + "&";
  //   // apitxt =
  //   //   apitxt +
  //   //   (this.state.prescriptionType
  //   //     ? "type=" + this.state.prescriptionType
  //   //     : "type=0");
  //   // apitxt =
  //   //   apitxt +
  //   //   (this.state.treatStatus == 2 ? "&all_medical_treatment_end=1" : "");
  //   const { data } = await axios.get(apitxt);
  //   // this.changeHistory(data);
  //   let result_data = [];
  //   if (data != null && data.length > 0) {
  //     result_data = data.filter(ele=>{
  //       if (ele.prescription.is_enabled == 1) {
  //         return ele;
  //       }
  //     });
  //   }
  //   this.setState({ hospitalization_list:result_data });
  // }

  // formatDate4API = dt => {
  //   var y = dt.getFullYear();
  //   var m = ("00" + (dt.getMonth() + 1)).slice(-2);
  //   var d = ("00" + dt.getDate()).slice(-2);
  //   var result = y + m + d;
  //   return result;
  // };

  // getTreatmentList = async () => {
  //   let path = "/app/api/v2/master/treat/treatListByPatient";
  //   let post_data = {
  //       keyword:this.state.keyword,
  //       state:this.state.search_implement_type,
  //       date:this.state.course_date !== '' ? formatDateLine(this.state.course_date) : '' ,
  //       // start_date:this.state.start_date !== '' ? formatDateLine(this.state.start_date) : '' ,
  //   };

  //   await apiClient._post(
  //       path,
  //       {params: post_data})
  //       .then((res) => {
  //         if(res){
  //             this.setState({ tableLIst:res });
  //         }
  //       })
  //       .catch(() => {

  //       })
  // }

  setPeriod=(key,value)=>{
    this.setState({[key]:value});
  };

  closeModal=(act=null, message=null)=>{
    this.setState({
      isOpenTreatInjectionSelect:false,
      isOpenModal:false,
      isOpenTreatModal:false,
      isOpenKarteModeModal:false,
      alert_messages:(act === "register" && message != null) ? message : "",
      confirm_message:"",
      confirm_type:"",
    },()=>{
      if(act === "register" || act === "change"){
        this.getInjectionTreatementList();
      }
    });
    this.openModalStatus = 0;
  };

  printPdf=()=>{
    if(this.state.hospitalization_list.length > 0 || this.state.discharge_list.length > 0){
      this.setState({complete_message:"印刷中"});
      let path = "/app/api/v2/ward/print/hospitalization_list";
      let print_data = {};
      print_data.hospitalization_list = this.state.hospitalization_list;
      print_data.discharge_list = this.state.discharge_list;
      print_data.ward_names = this.state.ward_names;
      print_data.urgency_master = this.state.urgency_master;
      print_data.discharge_route_master = this.state.discharge_route_master;
      print_data.hospital_room_master = this.state.hospital_room_master;
      print_data.outcome_reason_master = this.state.outcome_reason_master;
      print_data.diagnosis = this.state.diagnosis;
      axios({
        url: path,
        method: 'POST',
        data:{print_data},
        responseType: 'blob', // important
      }).then((response) => {
        this.setState({complete_message:""});
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        if(window.navigator.msSaveOrOpenBlob) {
          //IE11 & Edge
          window.navigator.msSaveOrOpenBlob(blob, '転入・入院_転出・退院予定一覧.pdf');
        }
        else{
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', '転入・入院_転出・退院予定一覧.pdf'); //or any other extension
          document.body.appendChild(link);
          link.click();
        }
      })
        .catch(() => {
          this.setState({
            complete_message:"",
            alert_messages:"印刷失敗",
          });
        })
    } else {
      this.setState({alert_messages:"条件に一致する結果は見つかりませんでした。"});
    }
  };    

  confirmOk=()=>{
    if(this.state.confrim_type.split('_')[0] === "cancel"){
      this.cancelAction(this.state.confrim_type.split('_')[1], this.state.hos_data);
    }
    this.closeModal();

  }

  getCheckedDm = (name, value) => {
    if (name != ""){
      this.setState({ [name]: value });
    }
  };

  getDate = value => {
    this.setState({
      course_date: value,
      isLoaded: false,
    },()=>{
      this.getInjectionTreatementList();
    });
  }

  setSearchType = (e) => {
    this.setState({
      search_type:parseInt(e.target.value),
      isLoaded: false,
    },()=>{
      this.getInjectionTreatementList();
    });
  };

  setSearchImplementType = (e) => {
    this.setState({
      search_implement_type:parseInt(e.target.value),
      isLoaded: false,
    },()=>{
      this.getInjectionTreatementList();
    });
  };

  search = word => {
      word = word.toString().trim();
      this.setState({ keyword: word });
  };

  getDepartmentSelect = e => {
      this.setState({
        departmentStatus: parseInt(e.target.id)
      },()=>{
        this.getInjectionTreatementList();
      });
  };

  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.setState({
        isLoaded: false,
      },()=>{
        this.getInjectionTreatementList("enter");
      });
    }
  };

  searchPatientsList = async () => {
    // console.log("test")
  };

  openTreatInjectionSelect=()=>{
    if (this.state.patientInfo != undefined && this.state.patientInfo != null && Object.keys(this.state.patientInfo).length > 0) {
      this.openModalStatus = 1;
      this.setState({isOpenTreatInjectionSelect:true});
    } else {      
      if (this.state.selected_index != "" && this.state.selected_index >= 0) {      
        this.openModalStatus = 1;
        this.setState({
          isOpenTreatInjectionSelect:true,
          patientInfo: this.getPatientInfoFromOrder(this.state.table_list[this.state.selected_index]),
          treatInjectData: this.getTreatInjectionByPatient(this.state.table_list[this.state.selected_index].patient_number)
        });
      }
    }
  }

  getConvertDateTime = (_date=null, _type=null) => {
    let result = "";
    if(_date == undefined || _date == null || _date == "") return result;

    if (_type == "type_2") {
      result = _date.substr(0, 4) + "/" + _date.substr(5, 2) + "/" + _date.substr(8, 2);
      return result;
    }

    result = _date.substr(0, 4) + "/" + _date.substr(5, 2) + "/" + _date.substr(8, 2) + " ";
    if (_date.length > 10) {
      result = result + _date.substr(11, 2) + ":" + _date.substr(14, 2);
    }

    return result
  }

  getImplementDate = (_doneOrder, _treatDate, _updatedAt) => {
    let result = "";
    if (_doneOrder == 1) {
      if (_treatDate != undefined && _treatDate != null && _treatDate != "" && _treatDate.length > 4) {
        result = this.getConvertDateTime(_treatDate);
      } else {
        result = this.getConvertDateTime(_updatedAt);
      }
    }
    return result;
  }

  getDisplayOrder = (_order) => {
    let result = {};

    if (_order.order_title == "注射") {
      // 状態
      // result.status = _order.done_order == 1 ? "実施済み" : _order.done_order == 2 ? "受付済み" : "未実施";
      result.status = _order.done_order == 1 ? "●" : _order.done_order == 2 ? "●" : "○";
      // 実施日
      result.execute_date = this.getImplementDate(_order.done_order, _order.treat_date, _order.updated_at);
      // 受付番号
      result.accept_no = _order.number;
      // 患者ID
      result.patient_id = _order.patient_number;
      // 氏名
      result.patient_name = _order.patient_name;
      // 性別
      result.sex = _order.gender == 1 ? "男性" : "女性";
      // 年齢
      result.age = _order.age ? _order.age : "";
      // 担当医師名
      result.doctor = _order.order_data.doctor_name;
      // 診療科
      result.department = _order.order_data.department;
      // 依頼内容
      result.instruction_content = _order.karte_status == 3 ? "入院注射" : _order.karte_status == 2 ? "在宅注射" : "外来注射";
      // 指示受け日時
      result.instruction_accept_date = this.getConvertDateTime(_order.created_at);

    } else {
      // 状態
      result.status = _order.state == 0 ? "○": "●";
      // 実施日
      result.execute_date = this.getConvertDateTime(_order.completed_at);
      // 受付番号
      result.accept_no = _order.number;
      // 患者ID
      result.patient_id = _order.patient_number;
      // 氏名
      result.patient_name = _order.patient_name;
      // 性別
      result.sex = _order.gender == 1 ? "男性" : "女性";
      // 年齢
      result.age = _order.age ? _order.age : "";
      // 担当医師名
      result.doctor = _order.order_data.order_data.header.doctor_name;
      // 診療科
      result.department = this.state.diagnosis[_order.order_data.order_data.header.department_id];
      // 依頼内容
      result.instruction_content = _order.general_id === 2 ? "在宅処置" : _order.general_id === 3 ? "入院処置" : "外来処置";
      // 指示受け日時
      result.instruction_accept_date = this.getConvertDateTime(_order.created_at);
    }

    //
    return result;
  }

  getLatestInjectionTreatementList = () => {
    this.setState({
      isLoaded: false
    },()=>{
      this.getInjectionTreatementList();
    });
  }

  onlySelectItem=(index, order)=>{
      this.setState({
        selected_index:index,
        // isOpenTreatInjectionSelect: true,
        patientInfo: this.getPatientInfoFromOrder(order),
        treatInjectData: this.getTreatInjectionByPatient(order.patient_number)
      });
  };

  selectedItem=(index, order)=>{
      this.setState({
        selected_index:index,
        isOpenTreatInjectionSelect: true,
        patientInfo: this.getPatientInfoFromOrder(order),
        treatInjectData: this.getTreatInjectionByPatient(order.patient_number)
      });
  };

  getTreatInjectionByPatient = (_patientNumber) => {
    let result = [];

    if (this.state.table_list.length > 0) {
      this.state.table_list.map(item=>{
        if (item.patient_number == _patientNumber) {
          result.push(item);
        }
      });
    }

    return result;
  }

  getPatientInfoFromOrder = (_order=null) => {
    
    let result = {};
    if (_order == null) return result;

    result.age = _order.age != undefined ? _order.age : "";
    result.patient_id = _order.patient_id != undefined ? _order.patient_id : "";
    result.patientNumber = _order.patient_number != undefined ? _order.patient_number : "";
    result.patientName = _order.patient_name != undefined ? _order.patient_name : "";
    result.gender = _order.gender != undefined ? _order.gender : "";

    return result;
  }

  completeData = (index) => {

    let _order = this.state.table_list[index];

    let selectedMedPatientInfo = {};
    selectedMedPatientInfo.receId = _order.patient_number;
    selectedMedPatientInfo.name = _order.patient_name;

    let _state = {};
    _state.modal_data = _order;
    _state.endoscope_image = "";
    _state.selected_index = index;

    this.openModalStatus = 1;
    if (_order.order_title == "注射") {
      _state.isOpenModal = true;
      _state.selectedMedPatientInfo = selectedMedPatientInfo;
    } else { // treatment
      _state.isOpenTreatModal = true;
    }

    this.setState(_state);
  };

  handleClick = (e, index) => {
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
          .getElementById("list-table")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("list-table")
              .removeEventListener(`scroll`, onScrollOutside);
          });

        // let clientY = e.clientY;
        // let clientX = e.clientX;
        this.setState({
            contextMenu: {
                visible: true,
                x: e.clientX - 80,
                y: e.clientY + window.pageYOffset,
            },
            row_index: index,
            selected_index:index,
        });
        // , ()=>{
        //     let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
        //     let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
        //     let window_height = window.innerHeight;
        //     let window_width = window.innerWidth;
        //     if (clientY + menu_height > window_height && clientX + menu_width + 200 > window_width) {
        //         this.setState({
        //             contextMenu: {
        //                 visible: true,
        //                 x: clientX-menu_width,
        //                 y: clientY - menu_height,
        //             },
        //             row_index: index,
        //             selected_index:index,
        //         })
        //     } else if (clientY + menu_height > window_height && clientX + menu_width + 200 < window_width) {
        //         this.setState({
        //             contextMenu: {
        //                 visible: true,
        //                 x: clientX,
        //                 y: clientY - menu_height,
        //             },
        //             row_index: index,
        //             selected_index:index,
        //         })
        //     } else if (clientY + menu_height < window_height && clientX + menu_width + 200 > window_width) {
        //         this.setState({
        //             contextMenu: {
        //                 visible: true,
        //                 x: clientX-menu_width,
        //                 y: clientY + window.pageYOffset,
        //             },
        //             row_index: index,
        //             selected_index:index,
        //         })
        //     }
        // });
    }
  };

  contextMenuAction = (index, type) => {
    if (type === "complete"){
        this.completeData(index);
    }
  };

   // convert data for PrescriptionDoneModal display style
  getModalData = (_modal_data) => {

    let ret = {};
    ret.target_number = _modal_data.number;
    ret.patient_id = _modal_data.patient_id;
    ret.updated_at = _modal_data.updated_at;
    ret.treatment_datetime = _modal_data.treat_date;
    ret.is_doctor_consented = _modal_data.is_doctor_consented;
    ret.input_staff_name = _modal_data.input_staff_name != undefined && _modal_data.input_staff_name != null && _modal_data.input_staff_name != "" ? _modal_data.input_staff_name : _modal_data.proxy_input_staff_name;
    ret.doctor_name = _modal_data.order_data.doctor_name;
    ret.data = _modal_data;
    return ret;
  }

  setAutoReload = (name, value) => {
    if(name == "auto_reload"){
      this.setState({auto_reload:value});
    }
  };

  gokarte=(index)=>{
    let patient_data = this.state.table_list[index];
    let systemPatientId = patient_data.patient_id;
    let diagnosis_code = null;
    if(patient_data.order_title == "注射"){
      diagnosis_code = patient_data.order_data.department_code;
    } else {
      diagnosis_code = patient_data.department_id;

    }
    ['order_data']['order_data'];
    let patients_list = this.context.patientsList;
    let isExist = 0;
    patients_list.map(item=>{
      if (item.system_patient_id == systemPatientId) {
        isExist = 1;
      }
    });
    if (patients_list != undefined && patients_list != null && patients_list.length > 3 && isExist == 0) {
      this.openModalStatus = 1;
      this.setState({alert_messages: '4人以上の患者様を編集することはできません。'});
      return;
    }
    if (isExist == 0) { // new patient connect
      let modal_data = {
        systemPatientId,
        diagnosis_code,
        diagnosis_name : this.state.diagnosis[diagnosis_code],
        department : this.state.diagnosis[diagnosis_code],
      };
      this.openModalStatus = 1;
      this.setState({
        isOpenKarteModeModal: true,
        modal_data,
      });
    } else { // exist patient connect
      this.goToUrlFunc(systemPatientId);
    }
  }

  goToUrlFunc = (patient_id) => {
    this.props.goKartePage(patient_id);
    this.closeModal();
    this.props.closeModal();
  };

  handleCloseModalAndRefresh = () => {
    this.closeModal();

    this.getInjectionTreatementList();    
  }

  render() {
    // const STATUS_OPTIONS_NORECEPTION = [
    //     {id: 0, value: "全て"},
    //     {id: 1, value: "未実施"},
    //     {id: 3, value: "実施"}
    // ];
    return (
      <>
        <Modal
          show={true}
          id="outpatient"
          className="custom-modal-sm patient-exam-modal bed-control-modal first-view-modal"
        >
          <Modal.Header><Modal.Title>処置注射患者一覧</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={'flex header-area'}>
                  <div className={'flex condition-area'}>
                    <SearchBar
                        placeholder="患者ID / 患者名"
                        search={this.search}
                        enterPressed={this.enterPressed}
                    />
                    <SelectorWithLabel
                        options={options}
                        title="診療科"
                        getSelect={this.getDepartmentSelect}
                    />
                    <InputBox>
                        <label className="date-area">日付</label>
                        <DatePicker
                            locale="ja"
                            selected={this.state.course_date}
                            onChange={this.getDate.bind(this)}
                            dateFormat="yyyy/MM/dd"
                            placeholderText="年/月/日"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            dayClassName = {date => setDateColorClassName(date)}
                        />
                    </InputBox>
                  </div>
                  <div className={'flex'}>
                    <div className={'radio-area'}>
                      <div className={'block-area'}>
                        <div className={'block-title'}>{"オーダー種類"}</div>
                        <Radiobox
                          label={'すべて'}
                          value={1}
                          getUsage={this.setSearchType.bind(this)}
                          checked={this.state.search_type === 1}
                          disabled={true}
                          name={`search_type`}
                        />
                        <Radiobox
                          label={'処置'}
                          value={2}
                          getUsage={this.setSearchType.bind(this)}
                          checked={this.state.search_type === 2}
                          disabled={true}
                          name={`search_type`}
                        />
                        <Radiobox
                          label={'注射'}
                          value={3}
                          getUsage={this.setSearchType.bind(this)}
                          checked={this.state.search_type === 3}
                          disabled={true}
                          name={`search_type`}
                        />
                      </div>
                    </div>
                    <div className={'radio-area'}>
                      <div className={'block-area'}>
                        <div className={'block-title'}>{"状態"}</div>
                        <Radiobox
                          label={'すべて'}
                          value={0}
                          getUsage={this.setSearchImplementType.bind(this)}
                          checked={this.state.search_implement_type === 0}
                          disabled={true}
                          name={`search_implement_type`}
                        />
                        <Radiobox
                          label={'未実施'}
                          value={1}
                          getUsage={this.setSearchImplementType.bind(this)}
                          checked={this.state.search_implement_type === 1}
                          disabled={true}
                          name={`search_implement_type`}
                        />
                        <Radiobox
                          label={'実施済'}
                          value={2}
                          getUsage={this.setSearchImplementType.bind(this)}
                          checked={this.state.search_implement_type === 2}
                          disabled={true}
                          name={`search_implement_type`}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className={'flex button-area1'}>
                      <div className="user-css">実施者</div>
                      <div className="user-content-css">テスト 看護師</div>
                      <Button type="common">{'実施者変更'}</Button>                      
                    </div>
                    <div className={'flex button-area2'}>
                      <Button type="common" style={{width:"9rem", marginLeft:"10px"}} onClick={this.openTreatInjectionSelect}>{'処置注射選択'}</Button>                      
                    </div>
                  </div>
                </div>
                <div className={'flex justify-content'}>
                  <div>
                    <Button type="common" onClick={this.getLatestInjectionTreatementList}>{'最新表示'}</Button>                    
                  </div>
                  <div className={'auto-reload'}>
                    <Checkbox
                      label="自動更新"
                      getRadio={this.setAutoReload.bind(this)}
                      value={this.state.auto_reload === 1}
                      name="auto_reload"
                    />
                  </div>
                </div>
                <div className={'table-area'}>
                  <table className="table-scroll table table-bordered">
                    <thead>
                    <tr>
                      <th style={{width:"7rem"}}>状態</th>
                      <th style={{width:"10rem"}}>実施日</th>
                      <th style={{width:"7rem"}}>受付番号</th>
                      <th style={{width:"10rem"}}>患者ID</th>
                      <th>氏名</th>
                      <th style={{width:"5rem"}}>性別</th>
                      <th style={{width:"5rem"}}>年齢</th>
                      <th style={{width:"15rem"}}>担当医師名</th>
                      <th style={{width:"8rem"}}>診療科</th>
                      <th style={{width:"10rem"}}>依頼内容</th>
                      <th style={{width:"10rem"}}>指示受け日時</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.isLoaded == false ? (
                        <div className='spinner-disease-loading center'>
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                      </div>
                    ):(
                      <>
                        {this.state.table_list.length > 0 ? (
                          this.state.table_list.map((order, index)=>{
                            let display_order = this.getDisplayOrder(order);
                            return (
                              <>
                                <tr
                                  className={this.state.selected_index === index ? 'selected tb-record' : 'tb-record'}
                                  id="list-table"
                                  onClick={this.onlySelectItem.bind(this, index, order)}
                                  onContextMenu={e => this.handleClick(e, index)}
                                  onDoubleClick={this.selectedItem.bind(this, index, order)}
                                  // onDoubleClick={this.gokarte.bind(this, index)}
                                >
                                  <td style={{width:"7rem",textAlign:"center"}}>{display_order.status}</td>
                                  <td style={{width:"10rem"}}>{display_order.execute_date}</td>
                                  <td style={{width:"7rem",textAlign:"right"}}>{display_order.accept_no}</td>
                                  <td style={{width:"10rem",textAlign:"right"}} className={display_order.status == "○" ? "not-done" : ""}>{display_order.patient_id}</td>
                                  <td className={display_order.status == "○" ? "not-done" : ""}>{display_order.patient_name}</td>
                                  <td style={{width:"5rem"}} className={display_order.status == "○" && "not-done"}>{display_order.sex}</td>
                                  <td style={{width:"5rem",textAlign:"right"}} className={display_order.status == "○" ? "not-done" : ""}>{display_order.age}</td>
                                  <td style={{width:"15rem"}} className={display_order.status == "○" ? "not-done" : ""}>{display_order.doctor}</td>
                                  <td style={{width:"8rem"}} className={display_order.status == "○" ? "not-done" : ""}>{display_order.department}</td>
                                  <td style={{width:"10rem"}} className={display_order.status == "○" ? "not-done" : ""}>{display_order.instruction_content}</td>
                                  <td style={{width:"10rem"}} className={display_order.status == "○" ? "not-done" : ""}>{display_order.instruction_accept_date}</td>
                                </tr>
                              </>
                            )
                          })
                        ):(
                          <>
                            {this.state.isLoaded && (
                              <div className="table-scroll"><div className="no-result"><p>条件に一致する結果は見つかりませんでした。</p></div></div>
                            )}
                          </>
                        )}
                      </>
                    )}
                    </tbody>
                  </table>                
                </div>
                <div style={{width:'50%', marginTop:'8px'}}>
                  <table className='padding-10'>
                    <tr>
                      <td>記号ガイド</td>
                      <td>文字色ガイド</td>
                    </tr>
                    <tr>
                      <td><span style={{fontSize:'10px'}}>○</span>&nbsp;&nbsp;&nbsp;患者状態(未実施)</td>
                      <td style={{color:'red'}}>文字色&nbsp;&nbsp;&nbsp;患者状態(未実施)</td>
                    </tr>
                    <tr>
                      <td><span style={{fontSize:'12px'}}>●</span>&nbsp;&nbsp;&nbsp;患者状態(実施済)</td>
                      <td>文字色&nbsp;&nbsp;&nbsp;患者状態(実施済)</td>
                    </tr>
                  </table>
                </div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
          </Modal.Footer>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            row_index={this.state.row_index}
           />              
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
          {this.state.isOpenModal && (
            <DoneModal
                patientId={this.state.modal_data.patient_id}
                closeModal={this.closeModal}
                closeModalAndRefresh={()=>this.closeModal("change")}
                modal_type={"injection"}
                modal_title={"注射"}
                // modal_data={this.getModalData(this.state.modal_data)}
                modal_data={this.getModalData(this.state.modal_data)}
                patientInfo={this.state.selectedMedPatientInfo}
                fromPage={"injectionList"}
            />
          )}
          {this.state.isOpenTreatModal && (
            <TreatDoneModal
              closeModal={this.closeModal}
              modal_data={this.state.modal_data}
            />
           )}
          {this.state.isOpenTreatInjectionSelect && (
            <TreatInjectionSelect
              modal_data={this.state.treatInjectData}
              patientInfo={this.state.patientInfo}
              treat_date={formatDateSlash(this.state.course_date)}
              closeModal={this.closeModal}
              closeModalAndRefresh={this.handleCloseModalAndRefresh}
            />
          )}
          {this.state.isOpenKarteModeModal && (
            <SelectModeModal
              modal_data={this.state.modal_data}
              goToUrl={this.goToUrlFunc.bind(this)}
              closeModal={this.closeModal}
              modal_type={'out_treatment_injection_list'}
            />
          )}
        </Modal>

      </>
    );
  }
}
OutInjectionPatientModal.contextType = Context;
OutInjectionPatientModal.propTypes = {
  closeModal: PropTypes.func,
  goKartePage: PropTypes.func,
};

export default OutInjectionPatientModal;
