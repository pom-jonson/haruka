import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import {displayLineBreak, setDateColorClassName} from "~/helpers/dialConstants";
import {HOSPITALIZE_PRESCRIPTION_TYPE, getInspectionName, getStaffName} from "~/helpers/constants";
import {REHABILY_DISEASE} from "~/helpers/constants";
import {formatDateLine, formatJapanDateSlash, formatDateSlash, formatTimeIE} from "~/helpers/date";
import Radiobox from "~/components/molecules/Radiobox";
import SlipDetailPrintModal from "./SlipDetailPrintModal";
import SearchConditionModal from "./SearchConditionModal";
import SlipHelpModal from "./SlipHelpModal";
import Checkbox from "~/components/molecules/Checkbox";
import Spinner from "react-bootstrap/Spinner";
import {
  getNextDayByJapanFormat,
  getPrevDayByJapanFormat
} from "~/helpers/date";
import {formatTime} from "../../../../helpers/date";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import Button from "~/components/atoms/Button";

registerLocale("ja", ja);

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
`;

const Wrapper = styled.div`
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .before-btn-area{  
    height: 30px;  
 }
  .next-btn-area{    
    height: 30px;    
  }
 .check-all-btn-area{   
  margin-right: 3px;   
 }
 label {
   margin-bottom:0;
   height:2.2rem;
   line-height:2.2rem;
 }
 button {
  height: 2.2rem;
  line-height: 2.2rem;
  font-size: 1rem;
 }
 .disable-btn{
  opacity: 0.5;
 }
 .spinner-disease-loading{
    height: 15rem;
    overflow-y: auto;
    // width: calc(100% - 80px);
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
  justify-content: flex-end;
    label {
        line-height: 2.2rem;
        font-size: 14px;
        width: 10rem;
    }
    width:60%;
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
  table {
    font-size: 1rem;
    margin-bottom: 0;
  }
  label{
    height: 1.6rem;
    line-height: 1.6rem;
  }

  .tr-order{
    .hospital-3-bc{
      background: #92d050;
    }
    .hospital-today-bc{
      background: #edecb1;
    }
    .outpatient-3-bc{
      background: #92d050;
    }
    .outpatient-today-bc{
      background: #edecb1;
    }
    .hospital-0-3-fc{
      color: #00b050;
    }
    .hospital-0-today-fc{
      color: #00b050;
    }
    .hospital-1-3-fc{
      color: #4f81bd;
    }
    .hospital-1-today-fc{
      color: #4f81bd;
    }
    .outpatient-0-3-fc{
      color: #ffc000;
    }
    .outpatient-0-today-fc{
      color: #cccc00;
    }
    .outpatient-1-3-fc{
      color: #ffc000;
    }
    .outpatient-1-today-fc{
      color: #ffc000;
    }
    .hospital-4-today-fc{
      color: magenta;
    }
    .hospital-4-3-fc{
      color: magenta;
    }
    .outpatient-4-today-fc{
      color: #e46d0a;
    }
    .outpatient-4-3-fc{
      color: #e46d0a;
    }
  }
    
    thead{
      margin-bottom: 0;
      display:table;
      width:100%;
      border: 1px solid #dee2e6;
      tr{
          width: calc(100% - 16px);
      }
    }
    tbody{
      height: 21vh;
      overflow-y: scroll;
      display:block;
      // tr:nth-child(even) {background-color: #f2f2f2;}
      // tr:hover{background-color:#e2e2e2;}
    }
    .content-table{
      height: 30vh;
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        padding: 0.1rem;
        text-align: left;
        vertical-align: middle;
    }
    th {
        text-align: center;
        padding: 0.3rem;
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
  .react-datepicker {
    .react-datepicker__navigation--previous, .react-datepicker__navigation--next {
      height:10px !important;
    }
  }
}

.patient-name{
  width: "80px";
  line-height: 2.2rem;
  margin-left: 10rem;
  margin-right: 0.5rem;
}
.patient-name-label{
  min-width: 10rem;
  width: auto;
  border: 1px solid #aaa;
  margin-right: 3rem;
  line-height: 2.2rem;
  height: 2.2rem;
}
.button-group{
  float: right;
  button{
    margin-left: 10px;
  }
}
.user-css{
  width: 80px;
  line-height: 26px;
}
.user-content-css{
  width: auto;
  min-width: 10rem;
  border: 1px solid #aaa;
  line-height: 26px;
  margin-right: 20px;
}
.react-datepicker-wrapper{
  input{
    height: 30px;
  }
}

.condition-btn{
  width: 40%;
  justify-content: flex-end;
}
.td-check{
  width: 7rem !important;
  text-align: center !important;
  label{
    margin-right: 0px !important;
  }
  input{
    margin-right: 0px !important;
  }
}
`;

class InchargeSheetModal extends Component {
  constructor(props) {
    super(props);
    let search_type = 2; // 依頼日検索
    if(this.props.selectType == "completed_at") search_type = 1; // 実施日検索
    if(this.props.selectType == "emergency_instruction") search_type = 3; // 緊急指示検索
    
    let slipTypeArray = [
      {id:0,name:"移動",check:false,alias:"moving_flag", enable: 1},
      // {id:1,name:"給気",check:false,alias:"air_supply_flag", enable: 1},
      {id:2,name:"検体検査",check:false,alias:"specimen_inspection_flag", enable: 1},
      {id:3,name:"放射線",check:false,alias:"radiation_flag", enable: 1},
      {id:4,name:"内視鏡",check:false,alias:"endoscope_flag", enable: 1},
      {id:5,name:"処方",check:false,alias:"prescription_flag", enable: 1},
      {id:6,name:"注射",check:false,alias:"injection_flag", enable: 1},
      {id:7,name:"生体検査",check:false,alias:"biopsy_flag", enable: 1},
      {id:8,name:"看護指示",check:false,alias:"nursing_instruction_flag", enable: 1},
      {id:9,name:"処置",check:false,alias:"action_flag", enable: 1},
      {id:10,name:"リハビリ",check:false,alias:"rehab_flag", enable: 1},
      {id:11,name:"汎用オーダ―",check:false,alias:"guidance_flag", enable: 1},
      // {id:11,name:"手術",check:false,alias:"surgical_flag", enable: 0},
      // {id:12,name:"輸血",check:false,alias:"blood_transfusion_flag", enable: 0},
      // {id:13,name:"一括 ＯＮ/OFF",check:false,alias:"", enable: 1},
      // {id:14,name:"血液浄化",check:false,alias:"blood_purification_flag", enable: 0},
      {id:15,name:"予約",check:false,alias:"reserved_flag", enable: 1},
      {id:16,name:"指示簿",check:false,alias:"instruction_book_flag", enable: 1},
      // {id:17,name:"チーム医療",check:false,alias:"team_medical_flag", enable: 0},
      // {id:18,name:"その他",check:false,alias:"other_flags", enable: 0},
      {id:19,name:"削除伝票",check:false,alias:"delete_slip_flag", enable: 1},
    ];
    
    this.state = {
      course_date:new Date(),
      order_list:[],
      slipTypeArray,
      isOpenPrintPreview:false,
      isConditionModal:false,
      isOpenHelpModal:false,
      search_type,
      // 指示受け状況
      instruction_received_flag: false,
      flag_not_received: false,
      // 部門受付体制
      department_reception_column_flag: false,
      outside_department_reception_flag: false,
      // 実施体制
      not_implemented_flag: false,
      implemented_flag: false,
      flag_not_to_be_implemented: false,
      // 入外区分
      foreign_flag: false,
      hospitalization_flag: false,
      // 削除オーダ
      delete_order_display_flag: false,
      // 検索条件
      search_condition: null,
      confirm_message: "",
      alert_messages:'',
      all_master:{
        large_master_data:[],
        middle_master_data: [],
        content_master_data: []
      },
      isLoaded: false
    }
  }
  
  async componentDidMount() {
    await this.getCondition();
    await this.getOrderData();
    await this.getInstructionBookMaster();
  }
  
  getCondition = async () => {
    
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo == undefined || authInfo == null || authInfo.user_number == undefined) return;
    
    let path = "/app/api/v2/nurse/get_condition";
    let post_data = {
      user_number: authInfo.user_number
    };
    
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        // this.setState({
        //   search_condition: res
        // });
        let slip_array = this.state.slipTypeArray;
        slip_array.map(item=>{
          if (res[item.alias] != undefined && res[item.alias] != null) {
            item.check = res[item.alias] == 1 ? true : false;
          }
        });
        
        this.setState({
          slipTypeArray: slip_array,
          instruction_received_flag: res["instruction_received_flag"] == 1 ? true :false,
          flag_not_received: res["flag_not_received"] == 1 ? true :false,
          // 部門受付体制
          department_reception_column_flag: res["department_reception_column_flag"] == 1 ? true :false,
          outside_department_reception_flag: res["outside_department_reception_flag"] == 1 ? true :false,
          // 実施体制
          not_implemented_flag: res["not_implemented_flag"] == 1 ? true :false,
          implemented_flag: res["implemented_flag"] == 1 ? true :false,
          flag_not_to_be_implemented: res["flag_not_to_be_implemented"] == 1 ? true :false,
          // 入外区分
          foreign_flag: res["foreign_flag"] == 1 ? true :false,
          hospitalization_flag: res["hospitalization_flag"] == 1 ? true :false,
          // 削除オーダ
          delete_order_display_flag: res["delete_order_display_flag"] == 1 ? true :false,
        });
      })
      .catch(() => {
      
      });
  }
  
  getInstructionBookMaster = async() => {
    var path = "/app/api/v2/instruction_book/search_master";
    await apiClient._post(path, {params: {}})
      .then((res) => {
        if (res){
          this.setState({
            instruction_large_master:res.large_master_data,
            all_master: res,
            selected_large_number:res.large_master_data[0] != undefined ? res.large_master_data[0].number:0,
          });
        } else {
          this.setState({
            instruction_large_master:[],
            instruction_middle_master:[],
            instruction_content_master:[],
            selected_large_number:0,
            selected_middle_number:0,
            selected_content_number:0
          })
        }
      })
      .catch(() => {
      });
  }
  
  closeModal = () => {
    this.setState({
      isOpenPrintPreview:false,
      isConditionModal:false,
      isOpenHelpModal:false,
    })
  }
  
  moveDay = (_type) => {
    let now_day = this.state.course_date;
    if(now_day === ''){
      now_day = new Date();
    }
    let cur_day = _type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);
    this.setState({
      course_date: cur_day,
      isLoaded: false,
    }, async ()=>{
      await this.getOrderData();
    });
  }
  
  getOrderData = async () => {
    let post_data = {};
    this.state.slipTypeArray.map(item=>{
      if (item.alias != "") {
        post_data[item.alias] = item.check;
      }
    });
    
    let search_type = "suggest_at"; // 依頼日検索
    if(this.state.search_type == 1) search_type = "completed_at"; // 実施日検索
    if(this.state.search_type == 3) search_type = "emergency_instruction"; // 緊急指示検索
    post_data.search_type = search_type;
    
    post_data.search_date = formatDateLine(this.state.course_date);
    post_data.slipTypeArray = this.state.slipTypeArray;
    post_data.course_date = this.state.course_date;
    post_data.instruction_received_flag = this.state.instruction_received_flag;
    post_data.flag_not_received = this.state.flag_not_received;
    post_data.department_reception_column_flag = this.state.department_reception_column_flag;
    post_data.outside_department_reception_flag = this.state.outside_department_reception_flag;
    post_data.not_implemented_flag = this.state.not_implemented_flag;
    post_data.implemented_flag = this.state.implemented_flag;
    post_data.flag_not_to_be_implemented = this.state.flag_not_to_be_implemented;
    post_data.foreign_flag = this.state.foreign_flag;
    post_data.hospitalization_flag = this.state.hospitalization_flag;
    post_data.delete_order_display_flag = this.state.delete_order_display_flag;
    
    this.setState({list_data: []});
    let path = "/app/api/v2/nurse/get_all_order";
    post_data.search_date = formatDateLine(this.state.course_date);
    post_data.patient_id = this.props.patientId;
    post_data.search_type = search_type;
    
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        let order_list = [];
        if(res.main_order.length > 0){
          res.main_order.map(item=>{
            item.isChecked = 0;
            order_list.push(item);
          });
        }
        if(res.nurse_instructions.length > 0){
          res.nurse_instructions.map(item=>{
            item.isChecked = 0;
            item.category = "nurse_instruction";
            order_list.push(item);
          });
        }
        if(res.instruction_books.length > 0){
          res.instruction_books.map(item=>{
            item.isChecked = 0;
            item.category = "instruction_book";
            order_list.push(item);
          });
        }
        
        if(order_list.length > 0){
          this.setState({
            order_list: order_list,
            isLoaded: true,
          });
        } else {
          this.setState({
            order_list: [],
            isLoaded: true,
          });
        }
      })
      .catch(() => {
        this.setState({
          isLoaded: true
        });
      });
  }
  
  getDate = value => {
    this.setState({
      course_date: value,
      isLoaded: false,
    }, async ()=>{
      await this.getOrderData();
    });
  }
  
  setSearchType = (e) => {
    this.setState({
      search_type:parseInt(e.target.value),
      isLoaded: false,
    },async ()=>{
      await this.getOrderData();
    });
  };
  
  openPrintPreview(){
    this.setState({isOpenPrintPreview:true})
  }
  
  openConditionModal = () => {
    this.setState({
      isConditionModal:true,
    })
  }
  
  openHelpModal = () => {
    this.setState({
      isOpenHelpModal:true,
    })
  }
  
  handleOk = (_postData) => {
    this.closeModal();
    this.setState({
      course_date:_postData.course_date,
      slipTypeArray: _postData.slipTypeArray,
      isOpenPrintPreview: _postData.isOpenPrintPreview,
      isConditionModal: _postData.isConditionModal,
      isOpenHelpModal: _postData.isOpenHelpModal,
      search_type: _postData.search_type,
      // 指示受け状況
      instruction_received_flag: _postData.instruction_received_flag,
      flag_not_received: _postData.flag_not_received,
      // 部門受付体制
      department_reception_column_flag: _postData.department_reception_column_flag,
      outside_department_reception_flag: _postData.outside_department_reception_flag,
      // 実施体制
      not_implemented_flag: _postData.not_implemented_flag,
      implemented_flag: _postData.implemented_flag,
      flag_not_to_be_implemented: _postData.flag_not_to_be_implemented,
      // 入外区分
      foreign_flag: _postData.foreign_flag,
      hospitalization_flag: _postData.hospitalization_flag,
      // 削除オーダ
      delete_order_display_flag: _postData.delete_order_display_flag,
      isLoaded: false
    },()=>{
      this.getOrderData();
    });
  }
  
  getRadio(number, name, value) {    
    if (name == "all_check") {
      let order_list = this.state.order_list;
      order_list.map(item=>{
        if (item.number == number) {            
          item.isChecked = value;            
        }  
      });
      this.setState({order_list});
    }
  }
  
  getOtherRadio(number, rp_index=-1, cnt_index=-1, name, value) {
    if (name == "all_check") {
      let order_list = this.state.order_list;
      order_list.map(item=>{
        if (rp_index >= 0 && cnt_index >= 0 && item.rp_index != undefined && item.cnt_index != undefined) {
          if (item.number == number) {    
            if (item.rp_index == rp_index && cnt_index == item.cnt_index) {
              item.isChecked = value;
            }            
          }
        } else {
          if (item.number == number) {            
            item.isChecked = value;            
          }  
        }      
      });
      this.setState({order_list});
    }
  }
  
  checkAll = (val) => {
    if (this.state.order_list.length < 1) return;
    let order_list = this.state.order_list;
    order_list.map(item=>{
      item.isChecked = val;
    });
    this.setState({order_list});
  }
  
  saveInstructionInfo = async () => {
    if (this.state.order_list.length < 1) return;
    let order_list = this.state.order_list;
    
    let result_arr = [];
    result_arr = order_list.filter(item=>{
      if (item.isChecked == 1) {
        return item;
      }
    });
    
    if (result_arr.length < 1) return;
    
    for (let i = 0; i < result_arr.length; i ++) {
      let path = "/app/api/v2/nurse/set_instruction";
      let post_data = {
        number: result_arr[i].record_number,
        order_category: result_arr[i].category
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then((res) => {
          // suucess
          if (res.alert_message == "success") {
            // count ++;
          }
        })
        .catch((err) => {
          if (err.response.data) {
            // const { error_messages } = err.response.data;
            // error_msg = error_messages;
          }
          // return false;
        });
    }
  }
  
  getRecordInfo = (_index, _val) => {
    return(
      <>
        <tr>
          <td style={{width:"7rem"}}>{_index == 0 ? _val : ""}</td>
          <td style={{width:"13rem"}}>{_index == 1 ? _val : ""}</td>
          <td style={{width:"13rem"}}>{_index == 2 ? _val : ""}</td>
          <td>{_index == 3 ? _val : ""}</td>
          <td style={{width:"13rem"}}>{_index == 4 ? _val : ""}</td>
        </tr>
      </>
    );
  }
  
  getSearchCondition = () => {
    let _ret = {};
    _ret.slipTypeArray = this.state.slipTypeArray;
    _ret.search_type = this.state.search_type;
    _ret.course_date = formatDateSlash(this.state.course_date);
    _ret.instruction_received_flag = this.state.instruction_received_flag;
    _ret.flag_not_received = this.state.flag_not_received;
    _ret.department_reception_column_flag = this.state.department_reception_column_flag;
    _ret.outside_department_reception_flag = this.state.outside_department_reception_flag;
    _ret.not_implemented_flag = this.state.not_implemented_flag;
    _ret.implemented_flag = this.state.implemented_flag;
    _ret.flag_not_to_be_implemented = this.state.flag_not_to_be_implemented;
    _ret.foreign_flag = this.state.foreign_flag;
    _ret.hospitalization_flag = this.state.hospitalization_flag;
    _ret.delete_order_display_flag = this.state.delete_order_display_flag;
    
    return _ret
  }
  
  getInsuranceName = (_insuranceName) => {
    let result = "既定";
    
    if (_insuranceName == undefined || _insuranceName == null || _insuranceName == "") return result;
    
    return _insuranceName
  }
  
  getInsurance = type => {
    let insurance = "既定";
    if (this.props.patientInfo && this.props.patientInfo.insurance_type_list) {
      this.props.patientInfo.insurance_type_list.map(item => {
        if (item.code === parseInt(type)) {
          insurance = item.name;
        }
      });
    }
    
    if (insurance == undefined || insurance == null || insurance == "") {
      insurance = "既定";
    }
    
    return insurance;
  };
  
  getConvertDateTime = (_date=null) => {
    let result = "";
    if(_date == undefined || _date == null || _date == "") return result;
    
    result = _date.substr(0, 4) + "/" + _date.substr(5, 2) + "/" + _date.substr(8, 2) + " ";
    if (_date.length > 10) {
      result = result + _date.substr(11, 2) + ":" + _date.substr(14, 2);
    }
    
    return result
  }
  
  registerInstruction = () => {
    if (this.getSaveInstructionData().length < 1) return;
    this.setState({
      confirm_message: "指示受け情報を登録しますか",
    });
    // this.props.closeModal();
  }
  
  confirm_message = () => {
    this.setState({
      confirm_message: ""
    });
  }
  
  getSaveInstructionData = () => {
    let order_data = [];
    if (this.state.order_list.length > 0) {
      this.state.order_list.map(item=>{
        if (item.isChecked == 1) {
          let _item = {number: item.record_number, category: item.category};
          if (item.category == "nurse_instruction" && item.record_number == null) {
            _item.nurse_instruction_id = item.number;
          } else if (item.category == "instruction_book") {
            _item.number = item.number;
          }
          if (item.cnt_index != undefined && item.rp_index != undefined) {
            _item.cnt_index =  item.cnt_index;
            _item.rp_index = item.rp_index;
            if (item.category == "注射") {
              _item.is_period_injection = 1;
              _item.schedule_date = item.schedule_date;
            }
          }
          order_data.push(_item);
        }
      });
    }
    
    return order_data;
  }
  
  handleRegister = async () => {
    this.confirmCancel();
    
    let path = "/app/api/v2/nurse/register_instruction";
    let post_data = {
      order_data: this.getSaveInstructionData()
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res) {
          this.setState({
            alert_messages: "指示受け情報を登録しました。"
          },()=>{
            this.getOrderData();
          })
        }
      })
      .catch(() => {
      });
  }
  
  confirmCancel = () => {
    this.setState({
      confirm_message: "",
      alert_messages: "",
    });
  }
  
  getOptionLabels = (medicine_item) => {
    let allOptions = [
      "milling",
      "can_generic_name",
      "is_not_generic",
      "one_dose_package",
      "temprary_dedicine",
      "insurance_type",
      "separate_packaging",
      "mixture"
    ];
    
    let _keyName = {
      can_generic_name: "一般名処方",
      is_not_generic: "後発不可",
      milling: "粉砕",
      // free_comment: "備考",
      separate_packaging: "別包",
      one_dose_package: "一包化",
      temporary_medication: "臨時処方",
      mixture:"混合"
    };
    
    let result = "";
    
    allOptions.map(option=>{
      if (_keyName[option] && medicine_item[option] && (medicine_item[option] == 1 || medicine_item[option] == "1")) {
        result = result + "【"+_keyName[option]+"】 ";
      }
    });
    return result;
    
  }
  
  getStartdate = (_date) => {
    let date = _date.toString();
    let year = date.substring(0, 4);
    let month = date.substring(4, 6);
    let day = date.substring(6, 8);
    return year+"/"+month+"/"+day;
  }
  
  // get 伝票文字色や背景色
  getBackgroundAndForeColor = (_order) => {
    let cur_date = new Date();
    let current_time = new Date(formatDateLine(new Date()).split("-").join("/") + " 00:00:00").getTime();
    let order_update_time = new Date(formatDateLine(new Date(_order.updated_at.substring(0, 10))).split("-").join("/") + " 00:00:00").getTime();
    
    // check 入院, 外来
    let karte_status = _order.karte_status;
    if (_order.category == "nurse_instruction") karte_status = 3;
    
    // check 当日受付指示
    let today_order = current_time == order_update_time;
    // check ３時間以内発行指示
    let diff_hours = this.getDiffHours(cur_date, new Date(formatDateLine(new Date(_order.updated_at.substring(0, 10))).split("-").join("/")+ _order.updated_at.substring(10, 19)));
    let today_in_3_order = diff_hours <= 3;
    
    let order_status = 0; // 未指示受け(0)
    // 未指示受け(0), 指示受け済(1), 指示確認済(2), 実施中(3), 実施済(4), 実施済(5)
    if (_order.instruction_received == 1) { // 指示受け済(1)
      order_status = 1;
    }
    if (_order.done_order == 1) { // 実施済(4)
      order_status = 4;
    }
    
    return this.getSlipClassName(karte_status, today_order, today_in_3_order, order_status);
  }
  
  getDiffHours = (_dt2, _dt1) => {
    let diff = (_dt2.getTime() - _dt1.getTime())/ 1000;
    diff = diff / 3600;
    
    return Math.abs(Math.round(diff));
  }
  
  getSlipClassName = (karte_status, today_order, today_in_3_order, order_status) => {
    
    // (入院 - 未指示受け)当日受付指示 b: #edecb1, f: #00b050
    // (入院 - 未指示受け)３時間以内発行指示 b: #92d050, f: #00b050
    
    // (外来 - 未指示受け)当日受付指示 b: #edecb1, f: #cccc00
    // (外来 - 未指示受け)３時間以内発行指示 b: #92d050, f: #ffc000
    
    let result = {
      bc: "",
      fc: ""
    };
    if (karte_status == 3) { // 入院
      if (today_in_3_order == true) { // ３時間以内発行指示
        if (order_status == 0) { // 未指示受け
          result.bc = "hospital-3-bc";
          result.fc = "hospital-0-3-fc";
        } else if(order_status == 1) { // 指示受け済
          result.fc = "hospital-1-3-fc";
        } else if(order_status == 4) {
          result.fc = "hospital-4-3-fc";
        }
      } else if(today_order == true) { // 当日受付指示
        if (order_status == 0) {
          result.bc = "hospital-today-bc";
          result.fc = "hospital-0-today-fc";
        } else if(order_status == 1) {
          result.fc = "hospital-1-today-fc";
        } else if(order_status == 4) {
          result.fc = "hospital-4-today-fc";
        }
      }
    } else if(karte_status == 1) { // 外来
      if (today_in_3_order == true) {
        if (order_status == 0) {
          result.bc = "outpatient-3-bc";
          result.fc = "outpatient-0-3-fc";
        } else if(order_status == 1) {
          result.fc = "outpatient-1-3-fc";
        } else if(order_status == 4) {
          result.fc = "outpatient-4-3-fc";
        }
      } else if(today_order == true) {
        if (order_status == 0) {
          result.bc = "outpatient-today-bc";
          result.fc = "outpatient-0-today-fc";
        } else if(order_status == 1) {
          result.fc = "outpatient-1-today-fc";
        } else if(order_status == 4) {
          result.fc = "outpatient-4-today-fc";
        }
      }
    }
    
    return result;
  }
  
  getContentName = (content_id) => {
    let content_master = this.state.all_master.content_master_data;
    let find_data = content_master.find(x=>x.number == content_id);
    if (find_data === undefined) return "";
    return find_data.content;
  };
  
  getSubCategoryName = (subcategory_id) => {
    let middle_master = this.state.all_master.middle_master_data;
    let find_data = middle_master.find(x=>x.number == subcategory_id);
    if (find_data === undefined) return "";
    return find_data.name;
  }
  
  render() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let status_type_array = {1:"開始", 2:"変更", 3:"中止", 4:"終了"};
    let disease_type_array = {1:"急性", 2:"慢性"};
    let start_place_array = {1:"ベッドサイドより", 2:"リハ医療室にて", 3:"院内にて", 4:"院外にて"};
    let hasSaveInstructionData = this.getSaveInstructionData().length > 0 ? true : false;
    
    
    return (
      <>
        <Modal
          show={true}
          id="outpatient"
          className="custom-modal-sm patient-exam-modal bed-control-modal first-view-modal"
        >
          <Modal.Header><Modal.Title>指示受け一覧</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={'flex'}>
                  <div className="user-css">利用者</div>
                  <div className="user-content-css">{authInfo.name}</div>                  
                  <Button type="common" className="before-btn-area" onClick={()=>this.moveDay("before")}>{'<'}</Button>
                  <DatePicker
                    locale="ja"
                    selected={this.state.course_date}
                    onChange={this.getDate.bind(this)}
                    dateFormat="yyyy/MM/dd"
                    placeholderText={"年/月/日"}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"                  
                    dayClassName = {date => setDateColorClassName(date)}
                  />
                  <Button type="common" className="next-btn-area" onClick={()=>this.moveDay("next")}>{'>'}</Button>                  
                </div>
                <div className={'flex'}>
                  <div className={'radio-area flex'}>
                    <Radiobox
                      label={'実施日検索'}
                      value={1}
                      getUsage={this.setSearchType.bind(this)}
                      checked={this.state.search_type === 1}
                      disabled={true}
                      name={`search_type`}
                    />
                    <Radiobox
                      label={'依頼日検索'}
                      value={2}
                      getUsage={this.setSearchType.bind(this)}
                      checked={this.state.search_type === 2}
                      disabled={true}
                      name={`search_type`}
                    />
                    <Radiobox
                      label={'緊急指示検索'}
                      value={3}
                      getUsage={this.setSearchType.bind(this)}
                      checked={this.state.search_type === 3}
                      disabled={true}
                      name={`search_type`}
                    />
                    <Button type="common" onClick={this.openConditionModal.bind(this)}>{'検索条件'}</Button>                    
                  </div>
                  <div className={'flex condition-btn'}>
                    <div style={{width:"calc(100% - 100px)", textAlign:"right"}}>                      
                      <Button type="common" onClick={this.openHelpModal.bind(this)}>{'ヘルプ'}</Button>
                      {/*<button style={{marginLeft:"10px"}}>確定→続行</button>*/}
                      {/*<button onClick={this.saveInstructionInfo} style={{marginLeft:"10px"}}>確定</button>*/}                                            
                    </div>
                  </div>
                </div>
                <div className={'table-title flex'} style={{marginBottom:"0.5rem"}}>
                  <label className={'table-name'}>指示内容一覧</label>
                </div>
                <div className={'table-area'}>
                  <table className="table-scroll table table-bordered">
                    <thead>
                    <tr>
                      <th style={{width:"7rem"}}>部屋</th>
                      <th style={{width:"10rem"}}>氏名</th>
                      <th style={{width:"10rem"}}>実施予定日</th>
                      <th>伝票名</th>
                      <th style={{width:"10rem"}}>オーダー発行日時</th>
                      <th style={{width:"10rem"}}>依頼者</th>
                      {this.state.instruction_received_flag == true && (
                        <>
                          <th style={{width:"10rem"}}>指示受け日時</th>
                          <th style={{width:"10rem"}}>指示受け者</th>
                        </>
                      )}
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
                        {this.state.order_list.length > 0 && (
                          this.state.order_list.map(order=>{
                            let karte_status_name = "外来・";
                            if (order.karte_status != undefined && order.karte_status != null) {
                              karte_status_name = order.karte_status == 1 ? "外来・" : order.karte_status == 2 ? "訪問診療・" : order.karte_status == 3 ? "入院・" : "";
                            }
                            // 伝票名 -- 画面.伝票名には、カルテの【】に記載されている内容
                            let category_title = '';
                            let schedule_date_time = '';
                            if(order.category === '注射'){
                              category_title = karte_status_name + "注射";
                              if (order != undefined && order != null && order.order_data.is_completed == 4 && order.rp_index != undefined) {                              
                                // 実施予定日時
                                let rp_index = order.cnt_index;
                                let rp_data = order.order_data.order_data[0];
                                if (rp_data.done_numbers != undefined && rp_data.done_numbers != null && (Object.keys(rp_data.done_numbers).length > 0 || rp_data.done_numbers.length > 0)) {
                                  // count schedule_date_time
                                  if(order.order_data.schedule_date !== null && order.order_data.schedule_date !== undefined && order.order_data.schedule_date != "" && order.order_data.is_completed == 4 && order.rp_index != undefined) {
                                    schedule_date_time = formatJapanDateSlash(order.order_data.schedule_date);
                                    schedule_date_time = schedule_date_time + " " + rp_data.done_numbers[order.order_data.schedule_date][rp_index].time;        
                                  }
                                }
                              }
                            } else if(order.category === '処方'){
                              let prescription_category = order.order_data.is_internal_prescription == 0?"院外" : "院内";
                              if(order.karte_status == 3) prescription_category = HOSPITALIZE_PRESCRIPTION_TYPE[order.order_data.is_internal_prescription].value
                              category_title = karte_status_name + prescription_category;
                              category_title += '処方';
                            } else if(order.category === '検査' && (order.sub_category === 'オーダー' || order.sub_category === '細胞診検査' ||
                              order.sub_category === '病理検査' || order.sub_category === '細菌検査')){
                              let order_title = '検体検査';
                              if (order.sub_category == "細胞診検査") order_title = "細胞診検査";
                              else if (order.sub_category == "病理検査") order_title = "病理組織検査";
                              else if (order.sub_category == "細菌検査") order_title = "細菌・抗酸菌検査";
                              category_title = karte_status_name + order_title;
                            } else if(order.category === 'リハビリ'){
                              category_title = karte_status_name + order.category;
                            } else if(order.category =='放射線'){
                              category_title = karte_status_name + '放射線 '+ ' ' + order.sub_category;
                            } else if(order.category =='生理検査' || order.category =='内視鏡検査'){
                              category_title = karte_status_name + order != null && order.order_data.order_data.inspection_id != null && order.order_data.order_data.inspection_id != undefined ? getInspectionName(order.order_data.order_data.inspection_id) : "生理";
                            } else if(order.category =='処置'){
                              category_title = order.karte_status == 3 ? "入院処置" : order.karte_status === 2 ? "在宅処置" : "外来処置";
                            } else if(order.category == "nurse_instruction") {
                              category_title = "看護指示";
                            } else if(order.category == "instruction_book") {
                              category_title = "指示簿";
                            } else if(order.category == "汎用オーダー") {
                              category_title = "汎用オーダー";
                            } else if(order.sub_category == "入院実施" || order.sub_category == "外泊実施" || order.sub_category == "帰院実施" || order.sub_category == "退院許可"
                              || order.sub_category == "退院決定" || order.sub_category == "転棟・転室実施" || order.sub_category == "退院実施"){
                              category_title = karte_status_name + order.sub_category;
                            } else if(order.sub_category == "入院決定オーダ"){
                              category_title = karte_status_name + "入院決定";
                            } else if(order.sub_category == "入院申込オーダ"){
                              category_title = karte_status_name + "入院申込";
                            }
                            // get 伝票文字色や背景色
                            let BFColor = this.getBackgroundAndForeColor(order);
                            return (
                              <>
                                <tr className={`tr-order`}>
                                  <td style={{width:"7rem"}}>{order.room_name ? order.room_name : ""}</td>
                                  <td style={{width:"10rem"}}>{order.patient_name}</td>
                                  <td className={`${BFColor.fc} ${BFColor.bc}`} style={{width:"10rem"}}>
                                    {order.category === '注射' && schedule_date_time != "" ? (
                                      <>
                                        {schedule_date_time}
                                      </>
                                    ):(
                                      <>
                                        {order.category === '注射' && order.order_data.schedule_date != undefined && order.order_data.schedule_date != null && order.order_data.schedule_date != "" && (
                                          <>
                                            {formatJapanDateSlash(order.order_data.schedule_date)}
                                          </>
                                        )}
                                      </>
                                    )}                                  
                                    {(order.sub_category == "入院実施" || order.sub_category == "入院決定オーダ" || order.sub_category == "入院申込オーダ"
                                      || order.sub_category == "外泊実施" || order.sub_category == "帰院実施" || order.sub_category == "転棟・転室実施"
                                      || order.sub_category == "退院許可" || order.sub_category == "退院決定" || order.sub_category == "退院実施") && (
                                        <>{formatJapanDateSlash(order.treat_date)}</>
                                    )}
                                    
                                  </td>
                                  <td className={`${BFColor.fc} ${BFColor.bc}`}>{category_title}</td>
                                  <td className={`${BFColor.fc} ${BFColor.bc}`} style={{width:"10rem"}}>{this.getConvertDateTime(order.created_at)}</td>
                                  <td className={`${BFColor.fc} ${BFColor.bc}`} style={{width:"10rem"}}>{order.instruction_staff_name}</td>
                                  {this.state.instruction_received_flag == true && (
                                    <>
                                      {order.cnt_index != undefined && order.rp_index != undefined && order.order_data.is_completed == 4 ? (
                                        <>
                                          <td className={`${BFColor.fc} ${BFColor.bc}`} style={{width:"10rem"}}>
                                            {order.order_data.order_data[0].done_numbers[order.schedule_date][order.cnt_index].instruction_receive_date != undefined && order.order_data.order_data[0].done_numbers[order.schedule_date][order.cnt_index].instruction_receive_date != "" ? this.getConvertDateTime(order.order_data.order_data[0].done_numbers[order.schedule_date][order.cnt_index].instruction_receive_date) : ""}
                                          </td>
                                          <td className={`${BFColor.fc} ${BFColor.bc}`} style={{width:"10rem"}}>
                                            {order.order_data.order_data[0].done_numbers[order.schedule_date][order.cnt_index].instruction_receiver != undefined && order.order_data.order_data[0].done_numbers[order.schedule_date][order.cnt_index].instruction_receiver != null ? getStaffName(order.order_data.order_data[0].done_numbers[order.schedule_date][order.cnt_index].instruction_receiver) :""}
                                          </td>
                                        </>
                                      ) : (
                                        <>
                                          <td className={`${BFColor.fc} ${BFColor.bc}`} style={{width:"10rem"}}>{order.instruction_receive_date != undefined && order.instruction_receive_date != null ? this.getConvertDateTime(order.instruction_receive_date) : ""}</td>
                                          <td className={`${BFColor.fc} ${BFColor.bc}`} style={{width:"10rem"}}>{order.instruction_receiver_name != undefined && order.instruction_receiver_name != null ? order.instruction_receiver_name :""}</td>
                                        </>
                                      )}
                                    </>
                                  )}
                                </tr>
                              </>
                            )
                          })
                        )}
                      </>
                    )}
                    </tbody>
                  </table>
                </div>
                <div className={'table-title flex'} style={{marginBottom:"0.5rem"}}>
                  <label className={'table-name'}>指示詳細一覧</label>
                </div>
                <div className={'flex'} style={{marginBottom:"0.5rem"}}>                  
                  <Button type="common" className="check-all-btn-area" onClick={()=>this.checkAll(1)}>{'受け選択'}</Button>
                  <Button type="common" onClick={()=>this.checkAll(0)}>{'受け解除'}</Button>                  
                  <div className="patient-name">患者氏名</div>
                  <div className="patient-name-label">{this.props.patientInfo.name}</div>
                  <div className="button-group">
                    {/*<button>指示簿一覧</button>
                    <button>経過表</button>
                    <button>患者スケジュール</button>
                    <button>診療カレンダ</button>*/}
                    <Button type="common" onClick = {this.openPrintPreview.bind(this)}>{'伝票詳細印刷'}</Button>                    
                  </div>
                </div>
                <div className={'table-area'}>
                  <table className="table-scroll table table-bordered">
                    <thead>
                    <tr>
                      <th style={{width:"7rem"}}>受け</th>
                      <th style={{width:"13rem"}}>伝票名</th>
                      <th style={{width:"13rem"}}>実施予定日時</th>
                      <th>記載事項</th>
                      <th style={{width:"13rem"}}>オーダー番号</th>
                    </tr>
                    </thead>
                    <tbody className="content-table">
                    {this.state.isLoaded == false ? (
                      <div className='spinner-disease-loading center'>
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      </div>
                    ):(
                      <>
                        {this.state.order_list.length > 0 && (
                          this.state.order_list.map((order)=>{
                            let karte_status_name = "外来・";
                            let order_number = "";
                            let rp_index = "";
                            let cnt_index = "";
                            if (order.karte_status != undefined && order.karte_status != null) {
                              karte_status_name = order.karte_status == 1 ? "外来・" : order.karte_status == 2 ? "訪問診療・" : order.karte_status == 3 ? "入院・" : "";
                            }
                            // 伝票名 -- 画面.伝票名には、カルテの【】に記載されている内容
                            let category_title = '';
                            let schedule_date_time = "";
                            if(order.category === '注射'){
                              category_title = karte_status_name + "注射";
                              if (order != undefined && order != null && order.order_data.is_completed == 4 && order.rp_index != undefined) {                              
                                // 実施予定日時
                                rp_index = order.rp_index;
                                cnt_index = order.cnt_index;
                                let rp_data = order.order_data.order_data[0];
                                if (rp_data.done_numbers != undefined && rp_data.done_numbers != null && (Object.keys(rp_data.done_numbers).length > 0 || rp_data.done_numbers.length > 0)) {
                                  // count schedule_date_time
                                  if(order.order_data.schedule_date !== null && order.order_data.schedule_date !== undefined && order.order_data.schedule_date != "" && order.order_data.is_completed == 4 && order.rp_index != undefined) {
                                    schedule_date_time = formatJapanDateSlash(order.order_data.schedule_date);
                                    schedule_date_time = schedule_date_time + " " + rp_data.done_numbers[order.order_data.schedule_date][cnt_index].time;        
                                  }

                                  // get order number                       
                                  if (order.schedule_date != undefined && order.schedule_date != "" && rp_data.done_numbers[order.schedule_date]) {
                                    order_number = rp_data.done_numbers[order.schedule_date][cnt_index].order_number;
                                  }       
                                }

                              }      
                            } else if(order.category === '処方'){
                              let prescription_category = order.order_data.is_internal_prescription == 0?"院外" : "院内";
                              if(order.karte_status == 3) prescription_category = HOSPITALIZE_PRESCRIPTION_TYPE[order.order_data.is_internal_prescription].value
                              category_title = karte_status_name + prescription_category;
                              category_title += '処方';
                            } else if(order.category === '検査' && (order.sub_category === 'オーダー' || order.sub_category === '細胞診検査' ||
                              order.sub_category === '病理検査' || order.sub_category === '細菌検査')){
                              let order_title = '検体検査';
                              if (order.sub_category == "細胞診検査") order_title = "細胞診検査";
                              else if (order.sub_category == "病理検査") order_title = "病理組織検査";
                              else if (order.sub_category == "細菌検査") order_title = "細菌・抗酸菌検査";
                              category_title = karte_status_name + order_title;
                              order_number = order.order_data.order_data.order_number;
                            } else if(order.category === 'リハビリ'){
                              category_title = karte_status_name + order.category;
                              order_number = order.order_data.order_data.order_number;
                            } else if(order.category =='放射線'){
                              category_title = karte_status_name + '放射線 '+ ' ' + order.sub_category;
                            } else if(order.category =='放射線'){
                              category_title = karte_status_name + order != null && order.order_data.order_data.inspection_id != null && order.order_data.order_data.inspection_id != undefined ? getInspectionName(order.order_data.order_data.inspection_id) : "生理";
                            } else if(order.category =='生理検査' || order.category =='内視鏡検査'){
                              category_title = karte_status_name + '生理検査 '+ ' ' + order.sub_category;
                              order_number = order.order_data.order_data.order_number;
                            } else if(order.category =='処置'){
                              category_title = order.karte_status == 3 ? "入院処置" : order.karte_status === 2 ? "在宅処置" : "外来処置";
                            } else if(order.category == "nurse_instruction"){
                              category_title = "看護指示";
                            } else if(order.category == "instruction_book"){
                              category_title = "指示簿";
                            } else if(order.category == "汎用オーダー"){
                              category_title = "汎用オーダー";
                              order_number = order.order_data.order_data.order_number;
                            } else if(order.sub_category == "入院実施" || order.sub_category == "外泊実施" || order.sub_category == "帰院実施" || order.sub_category == "退院許可"
                              || order.sub_category == "退院決定" || order.sub_category == "転棟・転室実施" || order.sub_category == "退院実施"){
                              category_title = karte_status_name + order.sub_category;
                              order_number = order.order_data.order_data.number;
                            } else if(order.sub_category == "入院決定オーダ"){
                              category_title = karte_status_name + "入院決定";
                              order_number = order.order_data.order_data.number;
                            } else if(order.sub_category == "入院申込オーダ"){
                              category_title = karte_status_name + "入院申込";
                              order_number = order.order_data.order_data.number;
                            }
                            return (
                              <>
                                {order.category == "注射" && order.order_data.order_data.map((item, item_idx)=>{                                
                                  return(
                                    <>
                                      {item.med.length == 0 && (
                                        <>
                                          <tr>
                                            <td className="td-check" style={{width:"7rem"}}> 
                                              {rp_index != "" ? (
                                                <>
                                                  <Checkbox
                                                    label=""
                                                    getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                                    value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                                    name={'all_check'}
                                                  />
                                                </>
                                              ):(
                                                <>
                                                  <Checkbox
                                                    label=""
                                                    getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                                    value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                                    name={'all_check'}
                                                  />
                                                </>
                                              )}                                          
                                            </td>
                                            <td style={{width:"13rem"}}>{category_title}</td>
                                            <td style={{width:"13rem"}}>
                                              {schedule_date_time != "" ? (
                                                <>
                                                  {schedule_date_time}
                                                </>
                                              ):(
                                                <>
                                                  {order.order_data.schedule_date != undefined && order.order_data.schedule_date != null && order.order_data.schedule_date != "" && (
                                                    <>
                                                      {formatJapanDateSlash(order.order_data.schedule_date)}
                                                    </>
                                                  )}
                                                </>
                                              )}
                                            </td>
                                            <td>{"手技:" + item.usage_name}</td>
                                            <td style={{width:"13rem"}}>{order_number != "" ? order_number : item.order_number}</td>                                      
                                          </tr>
                                                                                  
                                          {item.injectUsageName != "" && (
                                            <>
                                              {this.getRecordInfo(3,"用法:" + item.injectUsageName)}
                                            </>
                                          )}
                                          {item.body_part !== undefined && item.body_part !== "" && (
                                            <>
                                              {this.getRecordInfo(3,"部位/補足:"+item.body_part)}
                                            </>
                                          )}
                                          {item.insurance_type !== undefined && (
                                            <>
                                              {this.getRecordInfo(3,"保険:"+this.getInsurance(item.insurance_type))}
                                            </>
                                          )}
                                        </>
                                      )}
                                      {item.med.length > 0 && item.med.map((medicine_item, medicine_key)=>{
                                        return(
                                          <>
                                            <tr>
                                              {item_idx == 0 && medicine_key == 0 ? (
                                                <>
                                                  <td className="td-check" style={{width:"7rem"}}>
                                                    {rp_index != "" ? (
                                                      <>
                                                        <Checkbox
                                                          label=""
                                                          getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                                          value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                                          name={'all_check'}
                                                        />
                                                      </>
                                                    ):(
                                                      <>
                                                        <Checkbox
                                                          label=""
                                                          getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                                          value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                                          name={'all_check'}
                                                        />
                                                      </>
                                                    )}
                                                  </td>
                                                  <td style={{width:"13rem"}}>{category_title}</td>
                                                  <td style={{width:"13rem"}}>
                                                    {schedule_date_time != "" ? (
                                                      <>
                                                        {schedule_date_time}
                                                      </>
                                                    ):(
                                                      <>
                                                        {order.order_data.schedule_date != undefined && order.order_data.schedule_date != null && order.order_data.schedule_date != "" && (
                                                          <>
                                                            {formatJapanDateSlash(order.order_data.schedule_date)}
                                                          </>
                                                        )}
                                                      </>
                                                    )}
                                                  </td>
                                                  <td>{medicine_item.item_name}</td>
                                                  <td style={{width:"13rem"}}>{order_number != "" ? order_number : item.order_number}</td>
                                                </>
                                              ):(
                                                <>
                                                  {medicine_key == 0 ? (
                                                    <>
                                                      <tr>
                                                        <td style={{width:"7rem"}}></td>
                                                        <td style={{width:"13rem"}}></td>
                                                        <td style={{width:"13rem"}}></td>
                                                        <td>{medicine_item.item_name}</td>
                                                        <td style={{width:"13rem"}}>{item.order_number}</td>
                                                      </tr>
                                                    </>
                                                  ):(
                                                    <>
                                                      {this.getRecordInfo(3,medicine_item.item_name)}
                                                    </>
                                                  )}
                                                </>
                                              )}
                                            </tr>
                                            {this.getRecordInfo(3,medicine_item.amount+medicine_item.unit)}
                                            {item.med.length == (medicine_key + 1) && (
                                              <>
                                                {this.getRecordInfo(3,"手技:" + item.usage_name)}
                                                {item.injectUsageName != "" && (
                                                  <>
                                                    {this.getRecordInfo(3,"用法:" + item.injectUsageName)}
                                                  </>
                                                )}
                                              </>
                                            )}
                                            {item.body_part !== undefined && item.body_part !== "" && (
                                              <>
                                                {this.getRecordInfo(3,"部位/補足:"+item.body_part)}
                                              </>
                                            )}
                                            {item.insurance_type !== undefined && (
                                              <>
                                                {this.getRecordInfo(3,"保険:"+this.getInsurance(item.insurance_type))}
                                              </>
                                            )}
                                          </>
                                        );
                                      })}
                                      {order.order_data.order_data.length == (item_idx + 1) && (
                                        <>
                                          {order.order_data.location_name != undefined && order.order_data.location_name != null && order.order_data.location_name != "" && (
                                            <>
                                              {this.getRecordInfo(3,"実施場所:" + order.order_data.location_name)}
                                            </>
                                          )}
                                          {order.order_data.drip_rate != undefined && order.order_data.drip_rate != null && order.order_data.drip_rate != "" && (
                                            <>
                                              {this.getRecordInfo(3,"点滴速度:" + order.order_data.drip_rate + "ml/h")}
                                            </>
                                          )}
                                          {order.order_data.water_bubble != undefined && order.order_data.water_bubble != null && order.order_data.water_bubble != "" && (
                                            <>
                                              {this.getRecordInfo(3,"1分あたり:" + order.order_data.water_bubble+"滴")}
                                            </>
                                          )}
                                          {order.order_data.exchange_cycle != undefined && order.order_data.exchange_cycle != null && order.order_data.exchange_cycle != "" && (
                                            <>
                                              {this.getRecordInfo(3,"交換サイクル:" + order.order_data.exchange_cycle + "時間")}
                                            </>
                                          )}
                                          {order.order_data.require_time != undefined && order.order_data.require_time != null && order.order_data.require_time != "" && (
                                            <>
                                              {this.getRecordInfo(3,"所要時間:" + order.order_data.require_time + "時間")}
                                            </>
                                          )}
                                          {order.order_data.free_comment != undefined && order.order_data.free_comment != null && order.order_data.free_comment.length > 0 && order.order_data.free_comment[0] != null && order.order_data.free_comment[0] != "" && (
                                            <>
                                              {this.getRecordInfo(3,"備考:" + order.order_data.free_comment[0])}
                                            </>
                                          )}
                                          {order.order_data.item_details != undefined && order.order_data.item_details != null && order.order_data.item_details.length > 0 && order.order_data.item_details.map(detail=>{
                                            if(detail != null){
                                              let value1 = detail.value1;
                                              let value2 = detail.value2;
                                              let semi = "";
                                              if ((value1 != undefined && value1 != null && value1 != "") || (value2 != undefined && value2 != null && value2 != "")) {
                                                semi = ":";
                                              }
                                              let show_msg = ""
                                              if (detail.format1 != null && detail.format1 != undefined && detail.format1.includes("年") && detail.format1.includes("月")) {
                                                if (value1 != undefined && value1 != null && value1 != "") {
                                                  if (detail.value1_format != undefined) {
                                                    show_msg = detail.value1_format;
                                                  } else {
                                                    show_msg = detail.value1;
                                                  }
                                                }
                                                if (value2 != undefined && value2 != null && value2 != "") {
                                                  if (detail.value2_format != undefined) {
                                                    show_msg = show_msg + "~" + detail.value2_format;
                                                  } else {
                                                    show_msg = show_msg + "~" + detail.value2;
                                                  }
                                                }
                                              } else {
                                                if (value1 != undefined && value1 != null && value1 != "") {
                                                  if (detail.value1_format != undefined) {
                                                    show_msg = detail.value1_format;
                                                  } else {
                                                    show_msg = detail.value1;
                                                  }
                                                }
                                                if (value2 != undefined && value2 != null && value2 != "") {
                                                  if (detail.value2_format != undefined) {
                                                    show_msg = show_msg + "<br>" + detail.value2_format;
                                                  } else {
                                                    show_msg = show_msg + "<br>" + detail.value2;
                                                  }
                                                }
                                              }
                                              return(
                                                <>
                                                  {this.getRecordInfo(3,detail.item_name + semi + show_msg)}
                                                </>
                                              );
                                            }
                                          })}
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                                {order.category == "処方" && order.order_data.order_data.map((item, item_idx)=>{
                                  return(
                                    <>
                                      {item.med.length > 0 && item.med.map((medicine_item, medicine_key)=>{
                                        return(
                                          <>
                                            <tr>
                                              {item_idx == 0 && medicine_key == 0 ? (
                                                <>
                                                  <td className="td-check" style={{width:"7rem"}}>
                                                    <Checkbox
                                                      label=""
                                                      getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                                      value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                                      name={'all_check'}
                                                    />
                                                  </td>
                                                  <td style={{width:"13rem"}}>{category_title}</td>
                                                  <td style={{width:"13rem"}}></td>
                                                  <td>{medicine_item.item_name}</td>
                                                  <td style={{width:"13rem"}}>{item.order_number}</td>
                                                </>
                                              ):(
                                                <>
                                                  {medicine_key == 0 ? (
                                                    <>
                                                      <tr>
                                                        <td style={{width:"7rem"}}></td>
                                                        <td style={{width:"13rem"}}></td>
                                                        <td style={{width:"13rem"}}></td>
                                                        <td>{medicine_item.item_name}</td>
                                                        <td style={{width:"13rem"}}>{item.order_number}</td>
                                                      </tr>
                                                    </>
                                                  ):(
                                                    <>
                                                      {this.getRecordInfo(3,medicine_item.item_name)}
                                                    </>
                                                  )}
                                                </>
                                              )}
                                            </tr>
                                            {this.getRecordInfo(3,medicine_item.amount+medicine_item.unit)}
                                            {medicine_item.free_comment && medicine_item.free_comment.length > 0 && medicine_item.free_comment.map(comment=>{
                                              {this.getRecordInfo(3,comment)}
                                            })}
                                            {this.getRecordInfo(3,this.getOptionLabels(medicine_item))}
                                            {item.med.length == (medicine_key + 1) && (
                                              <>
                                                {this.getRecordInfo(3,"用法:" + item.usage_name)}
                                                {item.usage_remarks_comment && item.usage_remarks_comment.length > 0 && item.usage_remarks_comment.map(comment=>{
                                                  {this.getRecordInfo(3,comment)}
                                                })}
                                              </>
                                            )}
                                            {item.is_precision !== undefined && item.is_precision == 1 && (
                                              <>
                                                {this.getRecordInfo(3,"【精密持続点滴】")}
                                              </>
                                            )}
                                            {item.start_date !== undefined && item.start_date !== "" && (
                                              <>
                                                {this.getRecordInfo(3,"処方開始日:"+this.getStartdate(item.start_date))}
                                              </>
                                            )}
                                            {item.body_part !== undefined && item.body_part !== "" && (
                                              <>
                                                {this.getRecordInfo(3,"部位/補足:"+item.body_part)}
                                              </>
                                            )}
                                            {item.insurance_type !== undefined && (
                                              <>
                                                {this.getRecordInfo(3,"保険:"+this.getInsurance(item.insurance_type))}
                                              </>
                                            )}
                                          </>
                                        );
                                      })}
                                      {order.order_data.order_data.length == (item_idx + 1) && (
                                        <>
                                          {order.order_data != null && order.order_data.med_consult != null && order.order_data.med_consult !== undefined && order.order_data.med_consult == 1 && (
                                            <>
                                              {this.getRecordInfo(3,"【お薬相談希望あり】")}
                                            </>
                                          )}
                                          {order.order_data != null && order.order_data.supply_med_info != null && order.order_data.supply_med_info !== undefined && order.order_data.supply_med_info == 1 && (
                                            <>
                                              {this.getRecordInfo(3,"【薬剤情報提供あり】")}
                                            </>
                                          )}
                                          {order.order_data != null && order.order_data.potion != null && order.order_data.potion !== undefined && (order.order_data.potion == 0 || order.order_data.potion == 1) && order.order_data.is_internal_prescription == 5 && (
                                            <>
                                              {this.getRecordInfo(3,(order.order_data.potion == 0 ? "持参薬（自院）" : "持参薬（他院）"))}
                                            </>
                                          )}
                                          {order.order_data.psychotropic_drugs_much_reason != undefined && order.order_data.psychotropic_drugs_much_reason != null && order.order_data.psychotropic_drugs_much_reason != "" && (
                                            <>
                                              {this.getRecordInfo(3,"向精神薬多剤投与理由:" + order.order_data.psychotropic_drugs_much_reason)}
                                            </>
                                          )}
                                          {order.order_data.poultice_many_reason != undefined && order.order_data.poultice_many_reason != null && order.order_data.poultice_many_reason != "" && (
                                            <>
                                              {this.getRecordInfo(3,"湿布薬超過投与理由:" + order.order_data.poultice_many_reason)}
                                            </>
                                          )}
                                          {order.order_data.free_comment != undefined && order.order_data.free_comment != null && order.order_data.free_comment.length > 0 && order.order_data.free_comment[0] != null && order.order_data.free_comment[0] != "" && (
                                            <>
                                              {this.getRecordInfo(3,"備考:" + order.order_data.free_comment[0])}
                                            </>
                                          )}
                                          {order.order_data.item_details != undefined && order.order_data.item_details != null && order.order_data.item_details.length > 0 && order.order_data.item_details.map(detail=>{
                                            if(detail != null){
                                              let value1 = detail.value1;
                                              let value2 = detail.value2;
                                              let semi = "";
                                              if ((value1 != undefined && value1 != null && value1 != "") || (value2 != undefined && value2 != null && value2 != "")) {
                                                semi = ":";
                                              }
                                              let show_msg = ""
                                              if (detail.format1 != null && detail.format1 != undefined && detail.format1.includes("年") && detail.format1.includes("月")) {
                                                if (value1 != undefined && value1 != null && value1 != "") {
                                                  if (detail.value1_format != undefined) {
                                                    show_msg = detail.value1_format;
                                                  } else {
                                                    show_msg = detail.value1;
                                                  }
                                                }
                                                if (value2 != undefined && value2 != null && value2 != "") {
                                                  if (detail.value2_format != undefined) {
                                                    show_msg = show_msg + "~" + detail.value2_format;
                                                  } else {
                                                    show_msg = show_msg + "~" + detail.value2;
                                                  }
                                                }
                                              } else {
                                                if (value1 != undefined && value1 != null && value1 != "") {
                                                  if (detail.value1_format != undefined) {
                                                    show_msg = detail.value1_format;
                                                  } else {
                                                    show_msg = detail.value1;
                                                  }
                                                }
                                                if (value2 != undefined && value2 != null && value2 != "") {
                                                  if (detail.value2_format != undefined) {
                                                    show_msg = show_msg + "<br>" + detail.value2_format;
                                                  } else {
                                                    show_msg = show_msg + "<br>" + detail.value2;
                                                  }
                                                }
                                              }
                                              return(
                                                <>
                                                  {this.getRecordInfo(3,detail.item_name + semi+show_msg)}
                                                </>
                                              );
                                            }
                                          })}
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                                {order.category == "処置" && order.order_data.order_data.detail.map((item, item_idx)=>{
                                  return(
                                    <>
                                      {item_idx == 0 && (
                                        <>
                                          <tr>
                                            <td className="td-check" style={{width:"7rem"}}>
                                              <Checkbox
                                                label=""
                                                getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                                value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                                name={'all_check'}
                                              />
                                            </td>
                                            <td style={{width:"13rem"}}>{category_title}</td>
                                            <td style={{width:"13rem"}}></td>
                                            <td>処置日:
                                              {order.order_data.order_data.header.date == undefined || order.order_data.order_data.header.date == null || order.order_data.order_data.header.date == "" ? ""
                                                : ((order.order_data.order_data.header.start_time === "" || order.order_data.order_data.header.start_time === null) ? formatJapanDateSlash(order.order_data.order_data.header.date)
                                                  : formatJapanDateSlash(order.order_data.order_data.header.date)+"  "+order.order_data.order_data.header.start_time)}
                                            </td>
                                            <td style={{width:"13rem"}}>{item.order_number}</td>
                                          </tr>
                                          {this.getRecordInfo(3,"保険:" + this.getInsuranceName(order.order_data.order_data.header.insurance_name))}
                                        </>
                                      )}
                                      {item.classification_name != undefined && item.classification_name != "" && (
                                        <>
                                          {this.getRecordInfo(3,"分類:" + item.classification_name)}
                                        </>
                                      )}
                                      {item.practice_name != undefined && item.practice_name != "" && (
                                        <>
                                          {this.getRecordInfo(3,"行為名:" + item.practice_name)}
                                        </>
                                      )}
                                      {item.request_name != undefined && item.request_name != "" && (
                                        <>
                                          {this.getRecordInfo(3,"請求情報:" + item.request_name)}
                                        </>
                                      )}
                                      {item.position_name != undefined && item.position_name != "" && (
                                        <>
                                          {this.getRecordInfo(3,"部位:" + item.position_name)}
                                        </>
                                      )}
                                      {item.side_name != undefined && item.side_name != "" && (
                                        <>
                                          {this.getRecordInfo(3,"左右:" + item.side_name)}
                                        </>
                                      )}
                                      {item.barcode != undefined && item.barcode != "" && (
                                        <>
                                          {this.getRecordInfo(3,"バーコード:" + item.barcode)}
                                        </>
                                      )}
                                      {item.treat_detail_item != undefined && item.treat_detail_item.length > 0 && (
                                        <>
                                          {this.getRecordInfo(3,"個別指示:")}
                                          {item.treat_detail_item.map(detail=>{
                                            let oxygen_data = detail['oxygen_data'] !== undefined && detail['oxygen_data'] != null ?
                                              JSON.parse(detail['oxygen_data']) : null;
                                            return(
                                              <>
                                                {this.getRecordInfo(3,
                                                  detail.item_name+":"+detail.count
                                                  +(detail.unit_name !== '' || (detail.main_unit != null && detail.main_unit !== '') ? detail.unit_name !== '' ? detail.unit_name : detail.main_unit : "")
                                                  + " " + ((detail.lot != undefined && detail.lot != null && detail.lot != "") && "ロット:"+detail.lot)
                                                  + " "+((detail.comment !== undefined && detail.comment != null && detail.comment !== '') && "フリーコメント:"+detail.comment))}
                                                {oxygen_data != null && oxygen_data.length > 0 && oxygen_data.map((oxygen_item, oxygen_index)=>{
                                                            let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
                                                            if (oxygen_index > 0 && oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
                                                  return (
                                                    <>
                                                      {this.getRecordInfo(3,oxygen_inhaler_name + formatTime(oxygen_item.start_time) + "~" + formatTime(oxygen_item.end_time) + " " + oxygen_item.blood_flow + "L/分" + " " + oxygen_item.density + "%")}
                                                    </>
                                                  )
                                                })}
                                              </>
                                            )
                                          })}
                                        </>
                                      )}
                                      {item.treat_done_info != undefined && item.treat_done_info.length > 0 && (
                                        <>
                                          {this.getRecordInfo(3,"実施情報:")}
                                          {item.treat_done_info.map(detail=>{
                                            let oxygen_data = detail['oxygen_data'] !== undefined && detail['oxygen_data'] != null ?
                                              JSON.parse(detail['oxygen_data']) : null;
                                            return(
                                              <>
                                                {this.getRecordInfo(3,
                                                  detail.item_name+":"+detail.count
                                                  +(detail.unit_name !== '' || (detail.main_unit != null && detail.main_unit !== '') ? detail.unit_name !== '' ? detail.unit_name : detail.main_unit : "")
                                                  + " " + ((detail.lot != undefined && detail.lot != null && detail.lot != "") && "ロット:"+detail.lot)
                                                  + " "+((detail.comment !== undefined && detail.comment != null && detail.comment !== '') && "フリーコメント:"+detail.comment))}
                                                {oxygen_data != null && oxygen_data.length > 0 && oxygen_data.map((oxygen_item, oxygen_index)=>{
                                                            let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
                                                            if (oxygen_index > 0 && oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
                                                  return (
                                                    <>
                                                      {this.getRecordInfo(3,oxygen_inhaler_name + formatTime(oxygen_item.start_time) + "~" + formatTime(oxygen_item.end_time) + " " + oxygen_item.blood_flow + "L/分" + " " + oxygen_item.density + "%")}
                                                    </>
                                                  )
                                                })}
                                              </>
                                            )
                                          })}
                                        </>
                                      )}
                                      {item.comment !== undefined && item.comment !== "" && (
                                        <>
                                          {this.getRecordInfo(3,"コメント:" + item.comment)}
                                        </>
                                      )}
                                      {item.done_comment !== undefined && (
                                        <>{this.getRecordInfo(3,"実施コメント:" + displayLineBreak(item.done_comment))}</>
                                      )}
                                      {item_idx == order.order_data.order_data.detail.length - 1 && (
                                        <>
                                          {order.order_data.order_data.item_details != undefined && order.order_data.order_data.item_details != null && order.order_data.order_data.item_details.length > 0 && order.order_data.order_data.item_details.map(detail=>{
                                            if(detail != null){
                                              let value1 = detail.value1;
                                              let value2 = detail.value2;
                                              let semi = "";
                                              if ((value1 != undefined && value1 != null && value1 != "") || (value2 != undefined && value2 != null && value2 != "")) {
                                                semi = ":";
                                              }
                                              let show_msg = "";
                                              if (value1 != undefined && value1 != null && value1 != "") {
                                                if (detail.value1_format !== undefined) {
                                                  show_msg = detail.value1_format;
                                                } else {
                                                  show_msg = detail.value1;
                                                }
                                              }
                                              if (detail.unit_name1 != undefined) {
                                                show_msg = show_msg + detail.unit_name1;
                                              }
                                              if (value2 != undefined && value2 != null && value2 != "") {
                                                if (detail.value2_format !== undefined) {
                                                  show_msg = show_msg + detail.value2_format;
                                                } else {
                                                  show_msg = show_msg + detail.value2;
                                                }
                                              }
                                              if (detail.unit_name2 != undefined) {
                                                show_msg = show_msg + detail.unit_name2;
                                              }
                                              
                                              return(
                                                <>
                                                  {this.getRecordInfo(3,detail.item_name + semi+show_msg)}
                                                </>
                                              );
                                            }
                                          })}
                                          {order.order_data.order_data.additions != undefined && order.order_data.order_data.additions != null && order.order_data.order_data.additions.length > 0 && (
                                            <>
                                              {this.getRecordInfo(3,"追加指示等:")}
                                              {Object.keys(order.order_data.order_data.additions).map(addition_id=>{
                                                return(
                                                  <>
                                                    {this.getRecordInfo(3,order.order_data.order_data.additions[addition_id].name)}
                                                  </>
                                                );
                                              })}
                                            </>
                                          )}
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                                {order.category == "放射線" && order.order_data.order_data.radiation_data != undefined && order.order_data.order_data.radiation_data.length > 0 && order.order_data.order_data.radiation_data.map((item, item_idx)=>{
                                  return(
                                    <>
                                      {item_idx == 0 && (
                                        <>
                                          <tr>
                                            <td className="td-check" style={{width:"7rem"}}>
                                              <Checkbox
                                                label=""
                                                getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                                value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                                name={'all_check'}
                                              />
                                            </td>
                                            <td style={{width:"13rem"}}>{category_title}</td>
                                            <td style={{width:"13rem"}}></td>
                                            <td>{order.order_data.order_data.radiation_name=='他医撮影診断'? '日付':'検査日'}:
                                              {order.order_data.order_data.treat_date == "日未定" ? "[日未定]" : formatJapanDateSlash(order.order_data.order_data.treat_date)}
                                            </td>
                                            <td style={{width:"13rem"}}>{item.order_number}</td>
                                          </tr>
                                          {this.getRecordInfo(3,"保険:" + this.getInsuranceName(order.order_data.order_data.insurance_name))}
                                          {order.order_data.order_data.portable_shoot != undefined && order.order_data.order_data.portable_shoot != null && order.order_data.order_data.portable_shoot != "" && (
                                            <>
                                              {this.getRecordInfo(3,"撮影:" + "ポータブル")}
                                            </>
                                          )}
                                        </>
                                      )}
                                      {item.classfic_name != undefined && item.classfic_name != "" && (
                                        <>
                                          {this.getRecordInfo(3,"撮影区分:" + item.classfic_name)}
                                        </>
                                      )}
                                      {item.part_name != undefined && item.part_name != "" && (
                                        <>
                                          {this.getRecordInfo(3,"撮影部位:" + (item.left_right_name != undefined && item.left_right_name !='' ? item.left_right_name : "") + item.part_name)}
                                        </>
                                      )}
                                      {item.selected_directions != undefined && item.selected_directions != null && Object.keys(item.selected_directions).length > 0 && (
                                        <>
                                          {this.getRecordInfo(3,"方向:")}
                                          {Object.keys(item.selected_directions).map(id=>{
                                            return(
                                              <>
                                                {this.getRecordInfo(3,item.selected_directions[id])}
                                              </>
                                            )
                                          })}
                                        </>
                                      )}
                                      {item.method_name != undefined && item.method_name != "" && (
                                        <>
                                          {this.getRecordInfo(3,"撮影体位/方法:" + item.method_name)}
                                        </>
                                      )}
                                      {item.selected_comments != undefined && item.selected_comments != null && Object.keys(item.selected_comments).length > 0 && (
                                        <>
                                          {this.getRecordInfo(3,"撮影コメント:")}
                                          {Object.keys(item.selected_comments).map(id=>{
                                            return(
                                              <>
                                                {this.getRecordInfo(3,item.selected_comments[id])}
                                              </>
                                            )
                                          })}
                                        </>
                                      )}
                                      {item.shoot_count != undefined && item.shoot_count != "" && (
                                        <>
                                          {this.getRecordInfo(3,"撮影回数:" + item.shoot_count)}
                                        </>
                                      )}
                                      {item.sub_picture != undefined && item.sub_picture != "" && (
                                        <>
                                          {this.getRecordInfo(3,"分画数:" + item.sub_picture)}
                                        </>
                                      )}
                                      {item.direction_count != undefined && item.direction_count != "" && (
                                        <>
                                          {this.getRecordInfo(3,"方向数:" + item.direction_count)}
                                        </>
                                      )}
                                      {item_idx == order.order_data.order_data.radiation_data.length - 1 && (
                                        <>
                                          {order.done_order == 1 && order.order_data.order_data.done_comment != undefined && order.order_data.order_data.done_comment != null && order.order_data.order_data.done_comment != "" && (
                                            <>
                                              {this.getRecordInfo(3,"実施コメント:" + order.order_data.order_data.done_comment)}
                                            </>
                                          )}
                                          {order.done_order == 1 && order.order_data.order_data.shoot_done_user != undefined && order.order_data.order_data.shoot_done_user != null && order.order_data.order_data.shoot_done_user != "" && (
                                            <>
                                              {this.getRecordInfo(3,"撮影実施者:" + order.order_data.order_data.shoot_done_user)}
                                            </>
                                          )}
                                          {order.order_data.order_data.height != undefined && order.order_data.order_data.height != null && order.order_data.order_data.height != "" && (
                                            <>
                                              {this.getRecordInfo(3,"身長:" + order.order_data.order_data.height + "cm")}
                                            </>
                                          )}
                                          {order.order_data.order_data.weight != undefined && order.order_data.order_data.weight != null && order.order_data.order_data.weight != "" && (
                                            <>
                                              {this.getRecordInfo(3,"体重:" + order.order_data.order_data.weight+"kg")}
                                            </>
                                          )}
                                          {order.order_data.order_data.surface_area != undefined && order.order_data.order_data.surface_area != null && order.order_data.order_data.surface_area != "" && (
                                            <>
                                              {this.getRecordInfo(3,"体表面積:" + order.order_data.order_data.surface_area+"㎡")}
                                            </>
                                          )}
                                          {order.order_data.order_data.sick_name != undefined && order.order_data.order_data.sick_name != null && order.order_data.order_data.sick_name != "" && (
                                            <>
                                              {this.getRecordInfo(3,"臨床診断、病名:" + order.order_data.order_data.sick_name)}
                                            </>
                                          )}
                                          {order.order_data.order_data.etc_comment != undefined && order.order_data.order_data.etc_comment != null && order.order_data.order_data.etc_comment != "" && (
                                            <>
                                              {this.getRecordInfo(3,"主訴、臨床経過 検査目的、コメント:" + order.order_data.order_data.etc_comment)}
                                            </>
                                          )}
                                          {order.order_data.order_data.request_comment != undefined && order.order_data.order_data.request_comment != null && order.order_data.order_data.request_comment != "" && (
                                            <>
                                              {this.getRecordInfo(3,"依頼コメント:" + order.order_data.order_data.request_comment)}
                                            </>
                                          )}
                                          {order.order_data.order_data.pregnancy != undefined && order.order_data.order_data.pregnancy != null && order.order_data.order_data.pregnancy != "" && (
                                            <>
                                              {this.getRecordInfo(3,"妊娠:" + order.order_data.order_data.pregnancy)}
                                            </>
                                          )}
                                          {order.order_data.order_data.film_output != undefined && order.order_data.order_data.film_output != null && order.order_data.order_data.film_output != "" && (
                                            <>
                                              {this.getRecordInfo(3,"フィルム出力:" + order.order_data.order_data.film_output)}
                                            </>
                                          )}
                                          {order.order_data.order_data.filmsend != undefined && order.order_data.order_data.filmsend != null && order.order_data.order_data.filmsend != "" && (
                                            <>
                                              {this.getRecordInfo(3,"フィルム搬送先:" + order.order_data.order_data.filmsend)}
                                            </>
                                          )}
                                          {order.order_data.order_data.kind != undefined && order.order_data.order_data.kind != null && order.order_data.order_data.kind != "" && (
                                            <>
                                              {this.getRecordInfo(3,"区分:" + order.order_data.order_data.kind)}
                                            </>
                                          )}
                                          {order.order_data.order_data.move != undefined && order.order_data.order_data.move != null && order.order_data.order_data.move != "" && (
                                            <>
                                              {this.getRecordInfo(3,"移動形態:" + order.order_data.order_data.move)}
                                            </>
                                          )}
                                          {order.order_data.order_data.use != undefined && order.order_data.order_data.use != null && order.order_data.order_data.use != "" && order.order_data.order_data.use != "使用しない" && (
                                            <>
                                              {this.getRecordInfo(3,"造影剤使用:" + order.order_data.order_data.use)}
                                            </>
                                          )}
                                          {order.order_data.order_data.inquiry != undefined && order.order_data.order_data.inquiry != null && order.order_data.order_data.inquiry != "" && (
                                            <>
                                              {this.getRecordInfo(3,"造影剤問診票:" + order.order_data.order_data.inquiry)}
                                            </>
                                          )}
                                          {order.order_data.order_data.selected_instructions != undefined && order.order_data.order_data.selected_instructions != null && order.order_data.order_data.selected_instructions.length > 0 && (
                                            <>
                                              {this.getRecordInfo(3,"撮影指示")}
                                              {order.order_data.order_data.selected_instructions.map(item=>{
                                                {this.getRecordInfo(3,item.name)}
                                              })}
                                            </>
                                          )}
                                          {order.order_data.order_data.selected_shootings != undefined && order.order_data.order_data.selected_shootings != null && order.order_data.order_data.selected_shootings.length > 0 && (
                                            <>
                                              {this.getRecordInfo(3,"撮影")}
                                              {order.order_data.order_data.selected_shootings.map(item=>{
                                                {this.getRecordInfo(3,item.name)}
                                              })}
                                            </>
                                          )}
                                          {order.order_data.order_data.other_kind != undefined && order.order_data.order_data.other_kind != null && (
                                            <>
                                              {this.getRecordInfo(3,"分類:" + order.order_data.order_data.other_kind.name)}
                                            </>
                                          )}
                                          {order.order_data.order_data.other_kind_detail != undefined && order.order_data.order_data.other_kind_detail != null && (
                                            <>
                                              {this.getRecordInfo(3,"分類詳細:" + order.order_data.order_data.other_kind_detail.name)}
                                            </>
                                          )}
                                          {order.order_data.order_data.other_body_part != undefined && order.order_data.order_data.other_body_part != null && (
                                            <>
                                              {this.getRecordInfo(3,"部位:" + order.order_data.order_data.other_body_part)}
                                            </>
                                          )}
                                          {order.order_data.order_data.free_comment != undefined && order.order_data.order_data.free_comment != null && (
                                            <>
                                              {this.getRecordInfo(3,"フリーコメント:" + order.order_data.order_data.free_comment)}
                                            </>
                                          )}
                                          {order.order_data.order_data.additions != undefined && order.order_data.order_data.additions != null && order.order_data.order_data.additions.length > 0 && (
                                            <>
                                              {this.getRecordInfo(3,"追加項目:")}
                                              {Object.keys(order.order_data.order_data.additions).map(addition_id=>{
                                                return(
                                                  <>
                                                    {this.getRecordInfo(3,order.order_data.order_data.additions[addition_id].name)}
                                                  </>
                                                );
                                              })}
                                            </>
                                          )}
                                          {order.order_data.order_data.done_order ==1 && order.order_data.order_data.obtain_tech != undefined && order.order_data.order_data.obtain_tech != null && order.order_data.order_data.obtain_tech != "" && (
                                            <>
                                              {this.getRecordInfo(3,"造影剤注入手技:" + order.order_data.order_data.obtain_tech)}
                                            </>
                                          )}
                                          {order.order_data.order_data.done_order ==1 && order.order_data.order_data.details != undefined && order.order_data.order_data.details != null && order.order_data.order_data.details.length > 0 && (
                                            <>
                                              {order.order_data.order_data.details.map(detail=>{
                                                return(
                                                  <>
                                                    <tr>
                                                      <td style={{width:"7rem"}}></td>
                                                      <td style={{width:"13rem"}}></td>
                                                      <td style={{width:"13rem"}}></td>
                                                      <td>
                                                        <div><label>・{detail.name}
                                                          {((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": ""}</label>
                                                          {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                            <>
                                                              <label>{detail.value1}{detail.input_item1_unit}</label><br />
                                                            </>
                                                          )}
                                                          {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                            <>
                                                              <label>{detail.value2}{detail.input_item2_unit}</label><br />
                                                            </>
                                                          )}
                                                        </div>
                                                      </td>
                                                      <td style={{width:"13rem"}}></td>
                                                    </tr>
                                                  </>
                                                );
                                              })}
                                            </>
                                          )}
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                                {(order.category == "生理検査" || order.category == "内視鏡検査") && order.order_data.order_data.inspection_purpose != undefined && order.order_data.order_data.inspection_purpose.length > 0 && order.order_data.order_data.inspection_purpose.map((item, item_idx)=>{
                                  return(
                                    <>
                                      {item_idx == 0 && (
                                        <>
                                          <tr>
                                            <td className="td-check" style={{width:"7rem"}}>
                                              <Checkbox
                                                label=""
                                                getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                                value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                                name={'all_check'}
                                              />
                                            </td>
                                            <td style={{width:"13rem"}}>{category_title}</td>
                                            <td style={{width:"13rem"}}></td>
                                            <td>検査日:
                                              {order.order_data.order_data.treat_date == "日未定" ? "[日未定]" : formatJapanDateSlash(order.order_data.order_data.inspection_DATETIME)}
                                            </td>
                                            <td style={{width:"13rem"}}>{order_number}</td>
                                          </tr>
                                          {this.getRecordInfo(3,"保険:" + this.getInsuranceName(order.order_data.order_data.insurance_name))}
                                          {order.order_data.order_data.classification1_name != undefined && order.order_data.order_data.classification1_name != null && order.order_data.order_data.classification1_name != "" && (
                                            <>
                                              {this.getRecordInfo(3,"検査種別:" + order.order_data.order_data.classification1_name)}
                                            </>
                                          )}
                                          {order.order_data.order_data.classification2_name != undefined && order.order_data.order_data.classification2_name != null && order.order_data.order_data.classification2_name != "" && (
                                            <>
                                              {this.getRecordInfo(3,"検査詳細:" + order.order_data.order_data.classification2_name)}
                                            </>
                                          )}
                                          {order.order_data.order_data.inspection_type_name != undefined && order.order_data.order_data.inspection_type_name != null && order.order_data.order_data.inspection_type_name != "" && (
                                            <>
                                              {this.getRecordInfo(3,"検査種別:" + order.order_data.order_data.inspection_type_name)}
                                            </>
                                          )}
                                          {order.order_data.order_data.inspection_item_name != undefined && order.order_data.order_data.inspection_item_name != null && order.order_data.order_data.inspection_item_name != "" && (
                                            <>
                                              {this.getRecordInfo(3,"検査項目:" + order.order_data.order_data.inspection_item_name)}
                                            </>
                                          )}
                                          {order.order_data.order_data.endoscope_purpose_name != undefined && order.order_data.order_data.endoscope_purpose_name != null && order.order_data.order_data.endoscope_purpose_name != "" && (
                                            <>
                                              {this.getRecordInfo(3,"検査目的:" + order.order_data.order_data.endoscope_purpose_name)}
                                            </>
                                          )}
                                        </>
                                      )}
                                      {item.name != undefined && item.name != "" && (
                                        <>
                                          {this.getRecordInfo(3,"検査目的:" + item.name)}
                                        </>
                                      )}
                                      {item_idx == order.order_data.order_data.inspection_purpose.length - 1 && (
                                        <>
                                          {order.order_data.order_data.inspection_symptom != undefined && order.order_data.order_data.inspection_symptom != null && order.order_data.order_data.inspection_symptom.length > 0 && (
                                            <>
                                              {order.order_data.order_data.inspection_symptom.map(item=>{
                                                {this.getRecordInfo(3,"現症:"+item.name)}
                                              })}
                                            </>
                                          )}
                                          {order.order_data.order_data.inspection_risk != undefined && order.order_data.order_data.inspection_risk != null && order.order_data.order_data.inspection_risk.length > 0 && (
                                            <>
                                              {order.order_data.order_data.inspection_risk.map(item=>{
                                                {this.getRecordInfo(3,"冠危険因子:"+item.name)}
                                              })}
                                            </>
                                          )}
                                          {order.order_data.order_data.inspection_sick != undefined && order.order_data.order_data.inspection_sick != null && order.order_data.order_data.inspection_sick.length > 0 && (
                                            <>
                                              {order.order_data.order_data.inspection_sick.map(item=>{
                                                {this.getRecordInfo(3,item.title + ":"+item.name)}
                                              })}
                                            </>
                                          )}
                                          {order.order_data.order_data.inspection_request != undefined && order.order_data.order_data.inspection_request != null && order.order_data.order_data.inspection_request.length > 0 && (
                                            <>
                                              {order.order_data.order_data.inspection_request.map(item=>{
                                                {this.getRecordInfo(3,item.title + ":"+item.name)}
                                              })}
                                            </>
                                          )}
                                          {order.order_data.order_data.is_anesthesia != undefined && order.order_data.order_data.is_anesthesia != null && order.order_data.order_data.is_anesthesia.length > 0 && (
                                            <>
                                              {order.order_data.order_data.is_anesthesia.map(item=>{
                                                {this.getRecordInfo(3,item.title + ":"+item.name)}
                                              })}
                                            </>
                                          )}
                                          {order.order_data.order_data.is_sedation != undefined && order.order_data.order_data.is_sedation != null && order.order_data.order_data.is_sedation.length > 0 && (
                                            <>
                                              {order.order_data.order_data.is_sedation.map(item=>{
                                                {this.getRecordInfo(3,item.title + ":"+item.name)}
                                              })}
                                            </>
                                          )}
                                          {order.order_data.order_data.inspection_movement != undefined && order.order_data.order_data.inspection_movement != null && order.order_data.order_data.inspection_movement.length > 0 && (
                                            <>
                                              {order.order_data.order_data.inspection_movement.map(item=>{
                                                {this.getRecordInfo(3,"患者移動形態:"+item.name)}
                                              })}
                                            </>
                                          )}
                                          {order.order_data.order_data.height != undefined && order.order_data.order_data.height != null && order.order_data.order_data.height != "" && (
                                            <>
                                              {this.getRecordInfo(3,"身長:" + order.order_data.order_data.height+"cm")}
                                            </>
                                          )}
                                          {order.order_data.order_data.weight != undefined && order.order_data.order_data.weight != null && order.order_data.order_data.weight != "" && (
                                            <>
                                              {this.getRecordInfo(3,"体重:" + order.order_data.order_data.weight+"kg")}
                                            </>
                                          )}
                                          {order.order_data.order_data.surface_area != undefined && order.order_data.order_data.surface_area != null && order.order_data.order_data.surface_area != "" && (
                                            <>
                                              {this.getRecordInfo(3,"体表面積:" + order.order_data.order_data.surface_area+"㎡")}
                                            </>
                                          )}
                                          {order.order_data.order_data.sick_name != undefined && order.order_data.order_data.sick_name != null && order.order_data.order_data.sick_name != "" && (
                                            <>
                                              {this.getRecordInfo(3,"臨床診断、病名:" + order.order_data.order_data.sick_name)}
                                            </>
                                          )}
                                          {order.order_data.order_data.connection_date_title != undefined && (
                                            <>
                                              {this.getRecordInfo(3,(order.order_data.order_data.connection_date_title + ":" +formatJapanDateSlash(order.order_data.order_data.calculation_start_date)))}
                                            </>
                                          )}
                                          {order.order_data.order_data.etc_comment != undefined && order.order_data.order_data.etc_comment != null && order.order_data.order_data.etc_comment != "" && (
                                            <>
                                              {this.getRecordInfo(3,"主訴、臨床経過 検査目的、コメント:" + order.order_data.order_data.etc_comment)}
                                            </>
                                          )}
                                          {order.order_data.order_data.special_presentation != undefined && order.order_data.order_data.special_presentation != "" && (
                                            <>
                                              {this.getRecordInfo(3,"特殊指示:" + order.order_data.order_data.special_presentation)}
                                            </>
                                          )}
                                          {order.order_data.order_data.count != undefined && order.order_data.order_data.count != "" && (
                                            <>
                                              {this.getRecordInfo(3,(order.order_data.order_data.count_label !=''?order.order_data.order_data.count_label:'')+":" + order.order_data.order_data.count+(order.order_data.order_data.count_suffix!=''?order.order_data.order_data.count_suffix:''))}
                                            </>
                                          )}
                                          {((order.order_data.order_data.done_body_part !== undefined && order.order_data.order_data.done_body_part !== "")
                                            || (order.order_data.order_data.done_body_part === undefined && order.order_data.order_data.body_part !== undefined && order.order_data.order_data.body_part !== "")) && (
                                            <>
                                              {this.getRecordInfo(3,"部位指定コメント:" + (order.order_data.order_data.done_body_part !== undefined ? order.order_data.order_data.done_body_part : order.order_data.order_data.body_part))}
                                            </>
                                          )}
                                          {order.state == 2 && order.order_data.order_data.done_comment != undefined && order.order_data.order_data.done_comment != null && order.order_data.order_data.done_comment != "" && (
                                            <>
                                              {this.getRecordInfo(3,"実施コメント:" + order.order_data.order_data.done_comment)}
                                            </>
                                          )}
                                          {order.order_data.order_data.additions != undefined && Object.keys(order.order_data.order_data.additions).length > 0 && (
                                            <>
                                              {this.getRecordInfo(3,"追加指示等:")}
                                              {Object.keys(order.order_data.order_data.additions).map(addition_id=>{
                                                return (
                                                  <>
                                                    {this.getRecordInfo(3,order.order_data.order_data.additions[addition_id].name)}
                                                  </>
                                                );
                                              })}
                                            </>
                                          )}
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                                {(order.sub_category === 'オーダー' || order.sub_category === '細胞診検査' ||
                                  order.sub_category === '病理検査' || order.sub_category === '細菌検査') && order.order_data.order_data.examinations != undefined && order.order_data.order_data.examinations.length > 0 && order.order_data.order_data.examinations.map((item, item_idx)=>{
                                  return(
                                    <>
                                      {item_idx == 0 && (
                                        <>
                                          <tr>
                                            <td className="td-check" style={{width:"7rem"}}>
                                              <Checkbox
                                                label=""
                                                getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                                value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                                name={'all_check'}
                                              />
                                            </td>
                                            <td style={{width:"13rem"}}>{category_title}</td>
                                            <td style={{width:"13rem"}}></td>
                                            <td>検査日時:
                                              {order.order_data.order_data.collected_date === "" ? "次回診察日" : order.order_data.order_data.collected_time === "" ? formatJapanDateSlash(order.order_data.order_data.collected_date) : formatJapanDateSlash(order.order_data.order_data.collected_date)+"  "+order.order_data.order_data.collected_time.substr(0,order.order_data.order_data.collected_time.length-3)}
                                            </td>
                                            <td style={{width:"13rem"}}>{order_number}</td>
                                          </tr>
                                          {this.getRecordInfo(3,"保険:" + this.getInsuranceName(order.order_data.order_data.insurance_name))}
                                          {order.order_data.order_data.subject != undefined && order.order_data.order_data.subject != '' && (
                                            <>
                                              {this.getRecordInfo(3,"概要: " + order.order_data.order_data.subject)}
                                            </>
                                          )}
                                        </>
                                      )}
                                      {item_idx == order.order_data.order_data.examinations.length - 1 && (
                                        <>
                                          {this.getRecordInfo(3,"検査項目:" + item.name)}
                                          {order.order_data.order_data.examinations.map(item=>{
                                            return(
                                              <>
                                                {this.getRecordInfo(3,(item.is_attention != undefined && item.is_attention == 1? "*": "")+(item.not_done_flag == true?'【不実施】':'')+(item.urgent != undefined && item.urgent == 1? "【至急】": "") + item.name)}
                                              </>
                                            )
                                          })}
                                          {order.order_data.order_data.free_instruction != undefined && order.order_data.order_data.free_instruction.length > 0 && (
                                            <>
                                              {this.getRecordInfo(3,"自由入力オーダー")}
                                              {order.order_data.order_data.free_instruction.map(item=>{
                                                return(
                                                  <>
                                                    {this.getRecordInfo(3,(item.is_attention != undefined && item.is_attention == 1? "*": "")+(item.not_done_flag == true?'【不実施】':'')+(item.urgent != undefined && item.urgent == 1? "【至急】": "")+item.text)}
                                                  </>
                                                )
                                              })}
                                            </>
                                          )}
                                          {order.order_data.order_data.todayResult === 1 && (
                                            <>
                                              {this.getRecordInfo(3,"当日結果説明あり")}
                                            </>
                                          )}
                                          {order.order_data.order_data.order_comment !== "" && (
                                            <>
                                              {this.getRecordInfo(3,
                                                (order.order_data.order_data.order_comment_urgent != undefined && order.order_data.order_data.order_comment_urgent == 1?"【至急】":"")+
                                                (order.order_data.order_data.fax_report != undefined && order.order_data.order_data.fax_report == 1?"【FAX報告】":"")+
                                                "依頼コメント:"+order.order_data.order_data.order_comment)}
                                            </>
                                          )}
                                          {order.order_data.order_data.free_comment !== "" && (
                                            <>
                                              {this.getRecordInfo(3,"フリーコメント:"+order.order_data.order_data.free_comment)}
                                            </>
                                          )}
                                          
                                          {order.order_data.order_data.additions != undefined && Object.keys(order.order_data.order_data.additions).length > 0 && (
                                            <>
                                              {this.getRecordInfo(3,"追加指示等")}
                                              {Object.keys(order.order_data.order_data.additions).map(addition_id=>{
                                                return(
                                                  <>
                                                    {this.getRecordInfo(3,order.order_data.order_data.additions[addition_id].name)}
                                                  </>
                                                );
                                              })}
                                            </>
                                          )}
                                          {(order.done_order == 3 || order.done_order == 1) && order.order_data.order_data.done_comment != undefined && order.order_data.order_data.done_comment != "" && (
                                            <>
                                              {this.getRecordInfo(3,"採取実施コメント:"+order.order_data.order_data.done_comment)}
                                            </>
                                          )}
                                        </>
                                      )}
                                    </>
                                  );
                                })}
                                {order.category == "リハビリ" && order.order_data.order_data.detail != undefined && Object.keys(order.order_data.order_data.detail).map(item_key=>{
                                  let detail_tab_item = order.order_data.order_data.detail[item_key];
                                  return(
                                    detail_tab_item.map((detail_item, item_idx)=>{
                                      return (
                                        <>
                                          {item_idx == 0 && (
                                            <>
                                              <tr>
                                                <td className="td-check" style={{width:"7rem"}}>
                                                  <Checkbox
                                                    label=""
                                                    getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                                    value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                                    name={'all_check'}
                                                  />
                                                </td>
                                                <td style={{width:"13rem"}}>{category_title}</td>
                                                <td style={{width:"13rem"}}></td>
                                                <td>依頼日:
                                                  {order.order_data.order_data.request_date !== undefined && order.order_data.order_data.request_date != null && order.order_data.order_data.request_date !== "" ? formatJapanDateSlash(order.order_data.order_data.request_date) : ""}
                                                </td>
                                                <td style={{width:"13rem"}}>{order_number}</td>
                                              </tr>
                                              {this.getRecordInfo(3,"保険:" + this.getInsuranceName(order.order_data.order_data.insurance_name))}
                                              {this.getRecordInfo(3,"依頼医:" + (order.order_data.order_data.request_doctor_name !== undefined && order.order_data.order_data.request_doctor_name != null && order.order_data.order_data.request_doctor_name !== "" ? order.order_data.order_data.request_doctor_name : ""))}
                                              {this.getRecordInfo(3,"処方日:" + (order.order_data.order_data.prescription_date !== undefined && order.order_data.order_data.prescription_date != null && order.order_data.order_data.prescription_date !== "" ? formatJapanDateSlash(order.order_data.order_data.prescription_date) : ""))}
                                              {this.getRecordInfo(3,"処方医:" + (order.order_data.order_data.prescription_doctor_name !== undefined && order.order_data.order_data.prescription_doctor_name != null && order.order_data.order_data.prescription_doctor_name !== "" ? order.order_data.order_data.prescription_doctor_name : ""))}
                                              {this.getRecordInfo(3,(order.order_data.order_data.status_type !== undefined && order.order_data.order_data.status_type != null && order.order_data.order_data.status_type !== "" ? status_type_array[order.order_data.order_data.status_type] : ""))}
                                              {this.getRecordInfo(3,"実施希望日:" + (order.order_data.order_data.done_want_date !== undefined && order.order_data.order_data.done_want_date != null && order.order_data.order_data.done_want_date !== "" ? formatJapanDateSlash(order.order_data.order_data.done_want_date) : ""))}
                                              {this.getRecordInfo(3,"起算日:" + (order.order_data.order_data.calculation_start_date !== undefined && order.order_data.order_data.calculation_start_date != null && order.order_data.order_data.calculation_start_date !== "" ? formatJapanDateSlash(order.order_data.order_data.calculation_start_date) : ""))}
                                              {this.getRecordInfo(3,"経過・RISK・合併症等:" + (order.order_data.order_data.free_comment !== undefined && order.order_data.order_data.free_comment != null && order.order_data.order_data.free_comment !== "" ? displayLineBreak(order.order_data.order_data.free_comment) : ""))}
                                              {this.getRecordInfo(3,"特記事項:" + (order.order_data.order_data.special_comment !== undefined && order.order_data.order_data.special_comment != null && order.order_data.order_data.special_comment !== "" ? displayLineBreak(order.order_data.order_data.special_comment) : ""))}
                                              {order.order_data.order_data.fault_name_array !== undefined && order.order_data.order_data.fault_name_array != null && order.order_data.order_data.fault_name_array.length > 0 && (
                                                <>
                                                  {this.getRecordInfo(3,"障害名")}
                                                  {order.order_data.order_data.fault_name_array.map(basic_item=>{
                                                    {this.getRecordInfo(3,basic_item)}
                                                  })}
                                                </>
                                              )}
                                              {this.getRecordInfo(3,"開始希望場所:" + (order.order_data.order_data.start_place !== undefined && order.order_data.order_data.start_place != null && order.order_data.order_data.start_place !== "" ? start_place_array[order.order_data.order_data.start_place] : ""))}
                                              {order.order_data.order_data.basic_policy_array !== undefined && order.order_data.order_data.basic_policy_array != null && order.order_data.order_data.basic_policy_array.length > 0 && (
                                                <>
                                                  {this.getRecordInfo(3,"基本方針")}
                                                  {order.order_data.order_data.basic_policy_array.map(basic_item=>{
                                                    {this.getRecordInfo(3,basic_item)}
                                                  })}
                                                </>
                                              )}
                                              {order.order_data.order_data.social_goal_array !== undefined && order.order_data.order_data.social_goal_array != null && order.order_data.order_data.social_goal_array.length > 0 && (
                                                <>
                                                  {this.getRecordInfo(3,"社会的ゴール")}
                                                  {order.order_data.order_data.social_goal_array.map(basic_item=>{
                                                    {this.getRecordInfo(3,basic_item)}
                                                  })}
                                                </>
                                              )}
                                              {order.order_data.order_data.disease_list !== undefined && order.order_data.order_data.disease_list != null && order.order_data.order_data.disease_list.length > 0 &&order.order_data.order_data.disease_list.map(disease_item=>{
                                                return (
                                                  <>
                                                    {this.getRecordInfo(3,"病名:" + (order.order_data.order_data.free_comment !== undefined && order.order_data.order_data.free_comment != null && order.order_data.order_data.free_comment !== "" ? displayLineBreak(order.order_data.order_data.free_comment) : ""))}
                                                    {this.getRecordInfo(3,"発症日:" + (order.order_data.order_data.free_comment !== undefined && order.order_data.order_data.free_comment != null && order.order_data.order_data.free_comment !== "" ? displayLineBreak(order.order_data.order_data.free_comment) : ""))}
                                                    {this.getRecordInfo(3,(disease_item.date_type != undefined && disease_item.date_type != null ? REHABILY_DISEASE[disease_item.date_type] : "") + (disease_item.treat_start_date != null ? formatJapanDateSlash(disease_item.treat_start_date) : ""))}
                                                    {this.getRecordInfo(3,"病名登録日:" + ((disease_item.start_date !== undefined && disease_item.start_date != null && disease_item.start_date !== '') ? formatJapanDateSlash(disease_item.start_date) : ''))}
                                                  </>
                                                )
                                              })}
                                              {this.getRecordInfo(3,"リハビリ直告病患:" + (order.order_data.order_data.disease_type !== undefined && order.order_data.order_data.disease_type != null && order.order_data.order_data.disease_type !== "" ? disease_type_array[order.order_data.order_data.disease_type] : ""))}
                                              {this.getRecordInfo(3,"急性憎悪日:" + (order.order_data.order_data.acute_date !== undefined && order.order_data.order_data.acute_date != null && order.order_data.order_data.acute_date !== "" ? formatJapanDateSlash(order.order_data.order_data.acute_date) : ""))}
                                              {this.getRecordInfo(3,"廃用症候群憎悪日:" + (order.order_data.order_data.abandoned_syndrome_date !== undefined && order.order_data.order_data.abandoned_syndrome_date != null && order.order_data.order_data.abandoned_syndrome_date !== "" ? formatJapanDateSlash(order.order_data.order_data.abandoned_syndrome_date) : ""))}
                                              {this.getRecordInfo(3,"急性期疾患起算日:" + (order.order_data.order_data.acute_disease_start_date !== undefined && order.order_data.order_data.acute_disease_start_date != null && order.order_data.order_data.acute_disease_start_date !== "" ? formatJapanDateSlash(order.order_data.order_data.acute_disease_start_date) : ""))}
                                              {this.getRecordInfo(3,"感染症:" + (order.order_data.order_data.infection_exist === 1 ? "有" : "無"))}
                                            </>
                                          )}
                                          {detail_item.therapy_item1_name != undefined && detail_item.therapy_item1_name != "" && (
                                            <>
                                              {this.getRecordInfo(3,"療法項目１:" + detail_item.therapy_item1_name)}
                                            </>
                                          )}
                                          {detail_item.therapy_item2_name != undefined && detail_item.therapy_item2_name != "" && (
                                            <>
                                              {this.getRecordInfo(3,"療法項目２:" + detail_item.therapy_item2_name+(detail_item.therapy_item2_amount != undefined && detail_item.therapy_item2_amount != '' ?
                                                " " + detail_item.therapy_item2_amount + detail_item.therapy_item2_unit:""))}
                                            </>
                                          )}
                                          {detail_item.position1_name != undefined && detail_item.position1_name != "" && (
                                            <>
                                              {this.getRecordInfo(3,"部位1:" + detail_item.position1_name)}
                                            </>
                                          )}
                                          
                                          {detail_item.position2_name != undefined && detail_item.position2_name != "" && (
                                            <>
                                              {this.getRecordInfo(3,"部位2:" + detail_item.position2_name)}
                                            </>
                                          )}
                                          {detail_item.item_details !== undefined && detail_item.item_details != null && detail_item.item_details.length > 0 && (
                                            <>
                                              {detail_item.item_details.map(sub_item=>{
                                                return(
                                                  <>
                                                    {sub_item.item_name !== undefined && sub_item.item_name != null && sub_item.item_name !== "" && (
                                                      <>
                                                        {this.getRecordInfo(3,sub_item.item_name+(((sub_item.value1 != undefined && sub_item.value1 != null) || (sub_item.value2 != undefined && sub_item.value2 != null)) ? "：":""))}
                                                      </>
                                                    )}
                                                    {sub_item.format1 != null && sub_item.format1 != undefined && sub_item.format1.includes("年") && sub_item.format1.includes("月") ? (
                                                      <>
                                                        {sub_item.value1 != null && sub_item.value1 != undefined && (
                                                          <>
                                                            {this.getRecordInfo(3,(sub_item.value1_format !== undefined) ? sub_item.value1_format : sub_item.value1)}
                                                          </>
                                                        )}
                                                        {sub_item.value2 != null && sub_item.value2 != undefined && (
                                                          <>
                                                            {this.getRecordInfo(3," ~ "+((sub_item.value2_format !== undefined) ? sub_item.value2_format : sub_item.value2))}
                                                          </>
                                                        )}
                                                      </>
                                                    ):(
                                                      <>
                                                        {sub_item.value1 != null && sub_item.value1 != undefined && (
                                                          <>
                                                            {this.getRecordInfo(3,sub_item.value1)}
                                                          </>
                                                        )}
                                                        {sub_item.value2 != null && sub_item.value2 != undefined && (
                                                          <>
                                                            {this.getRecordInfo(3,sub_item.value2)}
                                                          </>
                                                        )}
                                                      </>
                                                    )}
                                                    {sub_item.lot !== undefined && sub_item.lot != null && sub_item.lot !== "" && (
                                                      <>
                                                        {this.getRecordInfo(3,sub_item.lot+(((sub_item.value1 != undefined && sub_item.value1 != null) || (sub_item.value2 != undefined && sub_item.value2 != null)) ? "：":""))}
                                                      </>
                                                    )}
                                                    {order.order_data.order_data.additions != undefined && Object.keys(order.order_data.order_data.additions).length > 0 && (
                                                      <>
                                                        {this.getRecordInfo(3,"追加指示等")}
                                                        {Object.keys(order.order_data.order_data.additions).map(addition_id=>{
                                                          return (
                                                            <>
                                                              {this.getRecordInfo(3,order.order_data.order_data.additions[addition_id].name)}
                                                            </>
                                                          );
                                                        })}
                                                      </>
                                                    )}
                                                  </>
                                                )
                                              })}
                                            </>
                                          )}
                                          {item_idx == Object.keys(order.order_data.order_data.detail).length - 1 && (
                                            <>
                                            </>
                                          )}
                                        </>
                                      )
                                    })
                                  )
                                })}
                                {(order.sub_category == "入院申込オーダ" || order.sub_category == "入院決定オーダ") && order.order_data.order_data != undefined && (
                                  <>
                                    <tr>
                                      <td className="td-check" style={{width:"7rem"}}>
                                        <Checkbox
                                          label=""
                                          getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                          value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                          name={'all_check'}
                                        />
                                      </td>
                                      <td style={{width:"13rem"}}>{category_title}</td>
                                      <td style={{width:"13rem"}}>{formatDateSlash(order.treat_date.split('-').join('/')) + " " + formatTimeIE(order.treat_date.split('-').join('/'))}</td>
                                      <td>入院病名:{order.order_data.order_data.disease_name}</td>
                                      <td style={{width:"13rem"}}></td>
                                    </tr>
                                    {order.order_data.order_data.purpose_array_names != undefined && order.order_data.order_data.purpose_array_names.length > 0 && (
                                      <>
                                        {this.getRecordInfo(3,"入院目的:")}
                                        {order.order_data.order_data.purpose_array_names.map(name=>{
                                          return (
                                            <>{this.getRecordInfo(3,name)}</>
                                          )
                                        })}
                                      </>
                                    )}
                                    {order.order_data.order_data.hospitalization_purpose_comment != undefined && order.order_data.order_data.hospitalization_purpose_comment != "" && (
                                      <>
                                        {this.getRecordInfo(3,"入院目的フリーコメント:" + order.order_data.order_data.hospitalization_purpose_comment)}
                                      </>
                                    )}
                                    {order.order_data.order_data.hospital_type == "in_apply" ? (
                                      <>
                                        {order.order_data.order_data.treatment_plan_name != undefined && order.order_data.order_data.treatment_plan_name != "" && (
                                          <>
                                            {this.getRecordInfo(3,"治療計画:" + order.order_data.order_data.treatment_plan_name)}
                                          </>
                                        )}
                                        {order.order_data.order_data.treatment_plan_comments != undefined && order.order_data.order_data.treatment_plan_comments != "" && (
                                          <>
                                            {this.getRecordInfo(3,"治療計画フリーコメント:" + order.order_data.order_data.treatment_plan_comments)}
                                          </>
                                        )}
                                      </>
                                    ):(
                                      <>
                                        {order.order_data.order_data.discharge_plan_name != undefined && order.order_data.order_data.discharge_plan_name != "" && (
                                          <>
                                            {this.getRecordInfo(3,"退院計画:" + order.order_data.order_data.discharge_plan_name)}
                                          </>
                                        )}
                                        {order.order_data.order_data.discharge_plan_comment != undefined && order.order_data.order_data.discharge_plan_comment != "" && (
                                          <>
                                            {this.getRecordInfo(3,"退院計画フリーコメント:" + order.order_data.order_data.discharge_plan_comment)}
                                          </>
                                        )}
                                      </>
                                    )}
                                    {order.order_data.order_data.path_name != undefined && order.order_data.order_data.path_name != "" && (
                                      <>
                                        {this.getRecordInfo(3,"パス:" + order.order_data.order_data.path_name)}
                                      </>
                                    )}
                                    {order.order_data.order_data.surgery_day != null && (
                                      <>
                                        {this.getRecordInfo(3,"手術日:" + formatJapanDateSlash(order.order_data.order_data.surgery_day))}
                                      </>
                                    )}
                                    {order.order_data.order_data.surgery_name != null && order.order_data.order_data.surgery_name != "" && (
                                      <>
                                        {this.getRecordInfo(3,"手術名:" + order.order_data.order_data.surgery_name)}
                                      </>
                                    )}
                                    {order.order_data.order_data.treatment_day != null && (
                                      <>
                                        {this.getRecordInfo(3,"治療日:" + formatJapanDateSlash(order.order_data.order_data.treatment_day))}
                                      </>
                                    )}
                                    {order.order_data.order_data.treatment_name != null && order.order_data.order_data.treatment_name != "" && (
                                      <>
                                        {this.getRecordInfo(3,"治療名:" + order.order_data.order_data.treatment_name)}
                                      </>
                                    )}
                                    {order.order_data.order_data.inspection_date != null && (
                                      <>
                                        {this.getRecordInfo(3,"検査日:" + formatJapanDateSlash(order.order_data.order_data.inspection_date))}
                                      </>
                                    )}
                                    {order.order_data.order_data.inspection_name != null && order.order_data.order_data.inspection_name != "" && (
                                      <>
                                        {this.getRecordInfo(3,"検査名:" + order.order_data.order_data.inspection_name)}
                                      </>
                                    )}
                                    {order.order_data.order_data.estimated_hospitalization_period_name != undefined && order.order_data.order_data.estimated_hospitalization_period_name != "" && (
                                      <>
                                        {this.getRecordInfo(3,"推定入院期間:" + order.order_data.order_data.estimated_hospitalization_period_name)}
                                      </>
                                    )}
                                    {order.order_data.order_data.urgency_name != undefined && order.order_data.order_data.urgency_name != "" && (
                                      <>
                                        {this.getRecordInfo(3,"緊急度:" + order.order_data.order_data.urgency_name)}
                                      </>
                                    )}
                                    {order.order_data.order_data.rest_name != undefined && order.order_data.order_data.rest_name != "" && (
                                      <>
                                        {this.getRecordInfo(3,"安静度:" + order.order_data.order_data.rest_name)}
                                      </>
                                    )}
                                    {order.order_data.order_data.desired_room_type_name != undefined && order.order_data.order_data.desired_room_type_name != "" && (
                                      <>
                                        {this.getRecordInfo(3,"希望部屋種:" + order.order_data.order_data.desired_room_type_name)}
                                      </>
                                    )}
                                    {this.getRecordInfo(3,"診療科:" + order.order_data.order_data.department_name)}
                                    {order.order_data.order_data.hospital_type == "in_decision" ? (
                                      <>
                                        {this.getRecordInfo(3,"病棟:" + order.order_data.order_data.ward_name)}
                                        {this.getRecordInfo(3,"病室:" + order.order_data.order_data.room_name)}
                                        {this.getRecordInfo(3,"病床:" + (order.order_data.order_data.hospital_bed_id == null ? "未指定" : order.order_data.order_data.bed_name))}
                                        {order.order_data.order_data.emergency_admission_comments != undefined && order.order_data.order_data.emergency_admission_comments != "" && (
                                          <>
                                            {this.getRecordInfo(3,"緊急入院時コメント:" + order.order_data.order_data.emergency_admission_comments)}
                                          </>
                                        )}
                                      </>
                                    ):(
                                      <>
                                        {this.getRecordInfo(3,"第1病棟:" + order.order_data.order_data.ward_name)}
                                        {order.order_data.order_data.second_ward_name != undefined && order.order_data.order_data.second_ward_name != "" && (
                                          <>
                                            {this.getRecordInfo(3,"第2病棟:" + order.order_data.order_data.second_ward_name)}
                                          </>
                                        )}
                                        {order.order_data.order_data.free_comment != undefined && order.order_data.order_data.free_comment != "" && (
                                          <>
                                            {this.getRecordInfo(3,"フリーコメント:" + order.order_data.order_data.free_comment)}
                                          </>
                                        )}
                                      </>
                                    )}
                                    {order.order_data.order_data.bulletin_board_reference_flag == 1 && (
                                      <>
                                        {this.getRecordInfo(3,"掲示板参照:" + "あり")}
                                      </>
                                    )}
                                    {this.getRecordInfo(3,"主担当医:" + order.order_data.order_data.main_doctor_name)}
                                    {order.order_data.order_data.doctor_list_names != undefined && order.order_data.order_data.doctor_list_names.length > 0 && (
                                      <>
                                        {this.getRecordInfo(3,"担当医:")}
                                        {order.order_data.order_data.doctor_list_names.map(name=>{
                                          return (
                                            <>
                                              {this.getRecordInfo(3,name)}
                                            </>
                                          )
                                        })}
                                      </>
                                    )}
                                    {order.order_data.order_data.nurse_id_in_charge_name != undefined && order.order_data.order_data.nurse_id_in_charge_name != "" && (
                                      <>
                                        {this.getRecordInfo(3,"担当看護師:" + order.order_data.order_data.nurse_id_in_charge_name)}
                                      </>
                                    )}
                                    {order.order_data.order_data.deputy_nurse_name != undefined && order.order_data.order_data.deputy_nurse_name != "" && (
                                      <>
                                        {this.getRecordInfo(3,"副担当看護師:" + order.order_data.order_data.deputy_nurse_name)}
                                      </>
                                    )}
                                    {order.order_data.order_data.hospital_type != "in_apply" && (
                                      <>
                                        {order.order_data.order_data.route_name != undefined && (
                                          <>
                                            {this.getRecordInfo(3,"入院経路:" + order.order_data.order_data.route_name)}
                                          </>
                                        )}
                                        {order.order_data.order_data.identification_name != undefined && (
                                          <>
                                            {this.getRecordInfo(3,"入院識別:" + order.order_data.order_data.identification_name)}
                                          </>
                                        )}
                                      </>
                                    )}
                                    {this.getRecordInfo(3,"食事開始日:"
                                      + (formatJapanDateSlash(order.order_data.order_data.start_date)
                                      + (order.order_data.order_data.start_time_classification_name != undefined ? (" ("+ order.order_data.order_data.start_time_classification_name +") から開始") : "")))}
                                    {order.order_data.order_data.food_type_name != undefined && order.order_data.order_data.food_type_name != "" && (
                                      <>
                                        {this.getRecordInfo(3,"食事:" + order.order_data.order_data.food_type_name)}
                                      </>
                                    )}
                                  </>
                                )}
                                {order.sub_category == "入院実施" && order.order_data.order_data != undefined && (
                                  <>
                                    <tr>
                                      <td className="td-check" style={{width:"7rem"}}>
                                        <Checkbox
                                          label=""
                                          getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                          value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                          name={'all_check'}
                                        />
                                      </td>
                                      <td style={{width:"13rem"}}>{category_title}</td>
                                      <td style={{width:"13rem"}}>{formatJapanDateSlash(order.order_data.order_data.treat_date.split(" ")[0])+" "+order.order_data.order_data.treat_date.split(" ")[1]}</td>
                                      <td>病棟:{order.order_data.order_data.ward_name}</td>
                                      <td style={{width:"13rem"}}></td>
                                    </tr>
                                    {this.getRecordInfo(3,"病室:" + order.order_data.order_data.room_name)}
                                    {this.getRecordInfo(3,"ベッド:" + order.order_data.order_data.bed_name)}
                                    {this.getRecordInfo(3,"配膳開始:" + formatJapanDateSlash(order.order_data.order_data.start_date) +" （"+order.order_data.order_data.start_time_name+"）より開始")}
                                  </>
                                )}
                                {order.sub_category == "転棟・転室実施" && order.order_data.order_data != undefined && (
                                  <>
                                    <tr>
                                      <td className="td-check" style={{width:"7rem"}}>
                                        <Checkbox
                                          label=""
                                          getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                          value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                          name={'all_check'}
                                        />
                                      </td>
                                      <td style={{width:"13rem"}}>{category_title}</td>
                                      <td style={{width:"13rem"}}>{formatJapanDateSlash(order.order_data.order_data.treat_date.split(" ")[0])+" "+order.order_data.order_data.treat_date.split(" ")[1]}</td>
                                      <td>病棟:{order.order_data.order_data.ward_name}</td>
                                      <td style={{width:"13rem"}}></td>
                                    </tr>
                                    {this.getRecordInfo(3,"病室:" + order.order_data.order_data.room_name)}
                                    {this.getRecordInfo(3,"ベッド:" + order.order_data.order_data.bed_name)}
                                    {order.order_data.order_data.department_name != undefined && (
                                      <>
                                        {this.getRecordInfo(3,"診療科:" + order.order_data.order_data.department_name)}
                                      </>
                                    )}
                                  </>
                                )}
                                {order.sub_category == "外泊実施" && order.order_data.order_data != undefined && (
                                  <>
                                    <tr>
                                      <td className="td-check" style={{width:"7rem"}}>
                                        <Checkbox
                                          label=""
                                          getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                          value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                          name={'all_check'}
                                        />
                                      </td>
                                      <td style={{width:"13rem"}}>{category_title}</td>
                                      <td style={{width:"13rem"}}>{formatJapanDateSlash(order.order_data.order_data.treat_date.split(" ")[0])+" "+order.order_data.order_data.treat_date.split(" ")[1]}</td>
                                      <td>外出泊理由:{order.order_data.order_data.going_out_name}</td>
                                      <td style={{width:"13rem"}}></td>
                                    </tr>
                                    {this.getRecordInfo(3,"配膳停止:" + formatJapanDateSlash(order.order_data.order_data.stop_serving_date)
                                      +" （"+order.order_data.order_data.stop_serving_time_name+"）より停止")}
                                    {this.getRecordInfo(3,"配膳開始:" + formatJapanDateSlash(order.order_data.order_data.start_date)+" （"+order.order_data.order_data.start_time_name+"）より開始")}
                                  </>
                                )}
                                {order.sub_category == "帰院実施" && order.order_data.order_data != undefined && (
                                  <>
                                    <tr>
                                      <td className="td-check" style={{width:"7rem"}}>
                                        <Checkbox
                                          label=""
                                          getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                          value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                          name={'all_check'}
                                        />
                                      </td>
                                      <td style={{width:"13rem"}}>{category_title}</td>
                                      <td style={{width:"13rem"}}>{formatJapanDateSlash(order.order_data.order_data.treat_date.split(" ")[0])+" "+order.order_data.order_data.treat_date.split(" ")[1]}</td>
                                      <td>配膳開始:{formatJapanDateSlash(order.order_data.order_data.start_date)+" （"+order.order_data.order_data.start_time_name+"）より開始"}</td>
                                      <td style={{width:"13rem"}}></td>
                                    </tr>
                                  </>
                                )}
                                {(order.sub_category == "退院実施" || order.sub_category == "退院決定") && order.order_data.order_data != undefined && (
                                  <>
                                    <tr>
                                      <td className="td-check" style={{width:"7rem"}}>
                                        <Checkbox
                                          label=""
                                          getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                          value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                          name={'all_check'}
                                        />
                                      </td>
                                      <td style={{width:"13rem"}}>{category_title}</td>
                                      <td style={{width:"13rem"}}>{(formatJapanDateSlash(order.order_data.order_data.treat_date.split(" ")[0])+" "+order.order_data.order_data.treat_date.split(" ")[1])}</td>
                                      <td>配膳停止:{formatJapanDateSlash(order.order_data.order_data.start_date) +" （"+order.order_data.order_data.start_time_name+"）より停止"}</td>
                                      <td style={{width:"13rem"}}></td>
                                    </tr>
                                    {this.getRecordInfo(3,"転帰理由:" + order.order_data.order_data.outcome_reason_name)}
                                    {this.getRecordInfo(3,"退院経路:" + order.order_data.order_data.discharge_route_name)}
                                    {order.order_data.order_data.discharge_free_comment !== "" && (
                                      <>
                                        {this.getRecordInfo(3,"フリーコメント:" + order.order_data.order_data.discharge_free_comment)}
                                      </>
                                    )}
                                  </>
                                )}
                                {order.sub_category == "退院許可" && order.order_data.order_data != undefined && (
                                  <>
                                    <tr>
                                      <td className="td-check" style={{width:"7rem"}}>
                                        <Checkbox
                                          label=""
                                          getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                          value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                          name={'all_check'}
                                        />
                                      </td>
                                      <td style={{width:"13rem"}}>{category_title}</td>
                                      <td style={{width:"13rem"}}>{order.order_data.order_data.discharge_date !== "" ? formatJapanDateSlash(order.order_data.order_data.discharge_date) : ""}</td>
                                      <td>転帰理由:{order.order_data.order_data.outcome_reason_name}</td>
                                      <td style={{width:"13rem"}}></td>
                                    </tr>
                                    {this.getRecordInfo(3,"退院経路:" + order.order_data.order_data.discharge_route_name)}
                                    {order.order_data.order_data.free_comment !== undefined && order.order_data.order_data.free_comment != null && order.order_data.order_data.free_comment !== "" && (
                                      <>
                                        {this.getRecordInfo(3,"フリーコメント:" + order.order_data.order_data.free_comment)}
                                      </>
                                    )}
                                  </>
                                )}
                                {order.category == "nurse_instruction" && (
                                  <>
                                    <tr>
                                      <td className="td-check" style={{width:"7rem"}}>
                                        <Checkbox
                                          label=""
                                          getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                          value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                          name={'all_check'}
                                        />
                                      </td>
                                      <td style={{width:"13rem"}}>{category_title}</td>
                                      <td style={{width:"13rem"}}></td>
                                      <td>指示内容:{order.name}</td>
                                      <td style={{width:"13rem"}}></td>
                                    </tr>
                                    {order.start_date != null && order.start_date != "" && (
                                      <>
                                        {this.getRecordInfo(3,"開始日:" + formatJapanDateSlash(order.start_date))}
                                      </>
                                    )}
                                    {order.end_date != null && order.end_date != "" && (
                                      <>
                                        {this.getRecordInfo(3,"終了日:" + (order.end_date != null && order.end_date != "" ? formatJapanDateSlash(order.end_date) : ""))}
                                      </>
                                    )}
                                    {order.attribute_name != null && order.attribute_name != undefined && order.attribute_name != "" && (
                                      <>
                                        {this.getRecordInfo(3,"付帯情報:" + order.attribute_name)}
                                      </>
                                    )}
                                    {order.comment != null && order.comment != undefined && order.comment != "" && (
                                      <>
                                        {this.getRecordInfo(3,"コメント:" + (order.comment != null ? order.comment : ""))}
                                      </>
                                    )}
                                    {order.number_of_interval != null && order.implementation_interval_class == 2 && (
                                      <>
                                        {this.getRecordInfo(3,"間隔:" + order.number_of_interval + "日ごと")}
                                      </>
                                    )}
                                    {order.number_of_interval != null && order.implementation_interval_class == 3 && (
                                      <>
                                        {this.getRecordInfo(3,"間隔:" + order.number_of_interval + "週ごと")}
                                      </>
                                    )}
                                    {order.number_of_times_per_day != null && (
                                      <>
                                        {this.getRecordInfo(3,"１日回数:" + order.number_of_times_per_day)}
                                      </>
                                    )}
                                    {order.time_interval_id != null && (
                                      <>
                                        {this.getRecordInfo(3,"時間間隔:" + order.time_interval_id)}
                                      </>
                                    )}
                                  </>
                                )}
                                {order.category == "instruction_book" && (
                                  <>
                                    <tr>
                                      <td className="td-check" style={{width:"7rem"}}>
                                        <Checkbox
                                          label=""
                                          getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                          value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                          name={'all_check'}
                                        />
                                      </td>
                                      <td style={{width:"13rem"}}>{category_title}</td>
                                      <td style={{width:"13rem"}}></td>
                                      <td>伝票:{this.getSubCategoryName(order.subcatergory_detail_id)}</td>
                                      <td style={{width:"13rem"}}></td>
                                    </tr>
                                    {this.getRecordInfo(3,"内容:" + this.getContentName(order.drug_content_id))}
                                    {order.start_date != null && order.start_date != undefined && order.start_date != "" && (
                                      <>
                                        {this.getRecordInfo(3,"開始日:" + order.start_date)}
                                      </>
                                    )}
                                    {order.end_date != null && order.end_date != undefined && order.end_date != "" && (
                                      <>
                                        {this.getRecordInfo(3,"終了日:" + order.end_date)}
                                      </>
                                    )}
                                    {order.title != null && order.title != undefined && order.title != "" && (
                                      <>
                                        {this.getRecordInfo(3,"用法:" + (order.title != null ? order.title : ""))}
                                      </>
                                    )}
                                  </>
                                )}
                                {order.category == "汎用オーダー" && (
                                  <>
                                    <tr>
                                      <td className="td-check" style={{width:"7rem"}}>
                                        <Checkbox
                                          label=""
                                          getRadio={this.getOtherRadio.bind(this, order.number, rp_index, cnt_index)}
                                          value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                          name={'all_check'}
                                        />
                                      </td>
                                      <td style={{width:"13rem"}}>{category_title}</td>
                                      <td style={{width:"13rem"}}></td>
                                      <td>{"カルテ記述名称: " + order.order_data.order_data.karte_description_name}</td>
                                      <td style={{width:"13rem"}}>{order_number}</td>
                                    </tr>
                                    {order.order_data.order_data.additions != undefined && order.order_data.order_data.additions != null && order.order_data.order_data.additions.length > 0 && (
                                      <>
                                        {this.getRecordInfo(3,"追加指示等: ")}
                                        {Object.keys(order.order_data.order_data.additions).map(addition_id=>{
                                          return(
                                            <>
                                              {this.getRecordInfo(3,order.order_data.order_data.additions[addition_id].name)}
                                            </>
                                          );
                                        })}
                                      </>
                                    )}
                                    {order.order_data.order_data.karte_text_data != undefined && order.order_data.order_data.karte_text_data != null && order.order_data.order_data.karte_text_data.length > 0 && (
                                      <>
                                        {this.getRecordInfo(3,"カルテ記述内容: ")}
                                        {order.order_data.order_data.karte_text_data.map(karte_text=>{
                                          return(
                                            <>
                                              {this.getRecordInfo(3,karte_text.karte_text)}
                                            </>
                                          );
                                        })}
                                      </>
                                    )}
                                    
                                    {order.order_data.order_data.comment != undefined && order.order_data.order_data.comment != null && order.order_data.order_data.comment != "" && (
                                      <>
                                        {this.getRecordInfo(3,"コメント: " + order.order_data.order_data.comment)}
                                      </>
                                    )}
                                    {order.order_data.order_data.details != undefined && order.order_data.order_data.details != null && order.order_data.order_data.details.length > 0 && (
                                      <>
                                        {order.order_data.order_data.details.map(detail=>{
                                          return(
                                            <>
                                              <tr>
                                                <td style={{width:"7rem"}}></td>
                                                <td style={{width:"13rem"}}></td>
                                                <td style={{width:"13rem"}}></td>
                                                <td>
                                                  <div><label>・{detail.item_name}
                                                    {((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": ""}</label>
                                                    {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                      <>
                                                        <label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}</label><br />
                                                      </>
                                                    )}
                                                    {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                      <>
                                                        <label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}</label><br />
                                                      </>
                                                    )}
                                                  </div>
                                                </td>
                                                <td style={{width:"13rem"}}></td>
                                              </tr>
                                            </>
                                          );
                                        })}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            )
                          })
                        )}
                      </>
                    )}
                    </tbody>
                  </table>
                </div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>            
            <Button className={'cancel-btn'}  onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={!hasSaveInstructionData ? "disable-btn" : "red-btn"} onClick={this.registerInstruction}>確定</Button>
          </Modal.Footer>
          {this.state.isOpenPrintPreview && (
            <SlipDetailPrintModal
              patientId = {this.props.patientId}
              patientInfo = {this.props.patientInfo}
              detailedPatientInfo = {this.props.detailedPatientInfo}
              orderData={this.state.order_list}
              closeModal = {this.closeModal}
              course_date = {this.state.course_date}
              all_master = {this.state.all_master}
            />
          )}
          {this.state.isConditionModal && (
            <SearchConditionModal
              patientId = {this.props.patientId}
              patientInfo = {this.props.patientInfo}
              detailedPatientInfo = {this.props.detailedPatientInfo}
              closeModal = {this.closeModal}
              searchCondition={this.getSearchCondition()}
              handleOk = {this.handleOk}
            />
          )}
          {this.state.isOpenHelpModal && (
            <SlipHelpModal
              patientId = {this.props.patientId}
              patientInfo = {this.props.patientInfo}
              detailedPatientInfo = {this.props.detailedPatientInfo}
              closeModal = {this.closeModal}
            />
          )}
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.handleRegister.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>
      
      </>
    );
  }
}

InchargeSheetModal.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  closeModal: PropTypes.func,
  selectType: PropTypes.string,
  detailedPatientInfo : PropTypes.object
};

export default InchargeSheetModal;
