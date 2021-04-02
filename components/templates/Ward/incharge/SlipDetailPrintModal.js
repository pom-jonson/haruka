import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import {HOSPITALIZE_PRESCRIPTION_TYPE, getInspectionName} from "~/helpers/constants";
import {displayLineBreak} from "~/helpers/dialConstants";
import {REHABILY_DISEASE} from "~/helpers/constants";
import {formatJapanDateSlash, formatDateLine, formatTimeIE, formatDateSlash} from "~/helpers/date";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import {formatTime} from "../../../../helpers/date";

const Wrapper = styled.div`
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 label {
   margin-bottom:0;
   height:2.2rem;
   line-height:2.2rem;
 }
 button {
  height: 2.2rem;
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
    label {
        line-height: 2.2rem;
        font-size: 14px;
        width: 10rem;
    }
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
    
    thead{
      margin-bottom: 0;
      display:table;
      width:100%;
      border: 1px solid #dee2e6;
      tr{
          width: calc(100% - 17px);
      }
    }
    tbody{
      height: 65vh;
      overflow-y: scroll;
      display:block;
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        padding: 0.25rem;
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
    let order_data = this.props.orderData;
    this.state = {
      course_date:new Date(),
      order_list:order_data,
      all_master: this.props.all_master,
      discharge_list:[],
      isOpenPrintPreview: false,
      complete_message:"",
      confirm_message: '',
    }
  }
  
  async componentDidMount() {
    let order_list = this.state.order_list;
    if (order_list.length > 0) {
      order_list = order_list.map(item=>{
        if (item.category == "instruction_book") {
          item.sub_category_name = this.getSubCategoryName(item.subcatergory_detail_id);
          item.content_name = this.getContentName(item.drug_content_id);
        }
        return item;
      });
      this.setState({
        order_list: order_list
      });
    }
  }
  
  openPrintPreview(){
    this.setState({isOpenPrintPreview:true})
  }
  
  getRadio(number, rp_index=-1, cnt_index=-1, name, value) {
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
  
  
  confirmPrint=()=>{
    if(this.state.order_list.length > 0){
      this.setState({confirm_message:"印刷しますか？"});
    }
  }
  
  confirmOk=async()=>{ //
    this.setState({
      confirm_message:"",
      complete_message:"印刷中"
    });
    let path = "/app/api/v2/nurse/print/slip_detail_print";
    let print_data = {};
    print_data.table_data = this.state.order_list;
    print_data.course_date = formatDateLine(this.props.course_date);
    print_data.patient_info = this.props.patientInfo;
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
          window.navigator.msSaveOrOpenBlob(blob, '指示受け.pdf');
        }
        else{
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', '指示受け.pdf'); //or any other extension
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
  }
  
  confirmCancel = () => {
    this.setState({
      confirm_message: ""
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
  
  getContentName = (content_id) => {
    if (this.state.all_master == undefined || this.state.all_master == undefined == null) return "";
    
    let content_master = this.state.all_master.content_master_data;
    let find_data = content_master.find(x=>x.number == content_id);
    if (find_data === undefined) return "";
    return find_data.content;
  };
  
  getSubCategoryName = (subcategory_id) => {
    if (this.state.all_master == undefined || this.state.all_master == undefined == null) return "";
    
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
    
    return (
      <>
        <Modal
          show={true}
          id="outpatient"
          className="custom-modal-sm patient-exam-modal bed-control-modal first-view-modal"
        >
          <Modal.Header><Modal.Title>指示受けプレビュー</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'flex'}>
                <div className="user-css">利用者</div>
                <div className="user-content-css">{authInfo.name}</div>
                <div className="user-css">患者氏名</div>
                <div className="user-content-css">{this.props.patientInfo.name}</div>
              </div>
              <div className={'table-title flex'}>
                <label className={'table-name'}>指示詳細一覧</label>
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
                  <tbody>
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
                      let schedule_date_time = '';
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
                        if(order.karte_status == 3) prescription_category = HOSPITALIZE_PRESCRIPTION_TYPE[order.order_data.is_internal_prescription].value;
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
                      } else if(order.category == "nurse_instruction") {
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
                                              getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
                                              value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                              name={'all_check'}
                                            />
                                          </>
                                        ):(
                                          <>
                                            <Checkbox
                                              label=""
                                              getRadio={this.getRadio.bind(this, order.number)}
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
                                                    getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
                                                    value={order.isChecked != undefined && order.isChecked != null ? order.isChecked : false}
                                                    name={'all_check'}
                                                  />
                                                </>
                                              ):(
                                                <>
                                                  <Checkbox
                                                    label=""
                                                    getRadio={this.getRadio.bind(this, order.number)}
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
                                                getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
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
                                          getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
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
                                          {this.getRecordInfo(3, detail.item_name+":"+detail.count
                                            +(detail.unit_name !== '' || (detail.main_unit != null && detail.main_unit !== '') ? detail.unit_name !== '' ? detail.unit_name : detail.main_unit : "")
                                            + " " + ((detail.lot != undefined && detail.lot != null && detail.lot != "") && "ロット:" + detail.lot)
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
                                {item.comment != undefined && item.comment != "" && (
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
                                          getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
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
                                    {order.order_data.order_data.done_order ==1 &&  order.order_data.order_data.obtain_tech != undefined && order.order_data.order_data.obtain_tech != null && order.order_data.order_data.obtain_tech != "" && (
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
                                          getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
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
                                    {order.order_data.order_data.connection_date_title != undefined && (
                                      <>
                                        {this.getRecordInfo(3,(order.order_data.order_data.connection_date_title + ":" +formatJapanDateSlash(order.order_data.order_data.calculation_start_date)))}
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
                                          getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
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
                                              getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
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
                                    getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
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
                                  {this.getRecordInfo(3,"掲示板参照:あり")}
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
                                    getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
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
                                    getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
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
                                    getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
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
                                    getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
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
                                    getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
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
                                    getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
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
                                    getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
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
                                    getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
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
                                    getRadio={this.getRadio.bind(this, order.number, rp_index, cnt_index)}
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
                  </tbody>
                </table>
              </div>
            </Wrapper>
            {this.state.confirm_message !== "" && (
              <SystemConfirmModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.confirmOk.bind(this)}
                confirmTitle= {this.state.confirm_message}
              />
            )}
            {this.state.complete_message !== '' && (
              <CompleteStatusModal
                message = {this.state.complete_message}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button className='cancel-btn' onClick={this.props.closeModal}>キャンセル</Button>
            <Button className='red-btn' onClick={this.confirmPrint}>印刷</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

InchargeSheetModal.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  all_master: PropTypes.object,
  closeModal: PropTypes.func,
  orderData:PropTypes.array,
  course_date:PropTypes.string,
  detailedPatientInfo : PropTypes.object
};

export default InchargeSheetModal;
