import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import InputBoxTag from "~/components/molecules/InputBoxTag";
// import * as pres_methods from "~/components/templates/Patient/PrescriptionMethods";
// import Spinner from "react-bootstrap/Spinner";
import Button from "~/components/atoms/Button";
import InputDateModal from "./InputDateModal";
import * as colors from "~/components/_nano/colors";
// import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as apiClient from "~/api/apiClient";
import Context from "~/helpers/configureStore";
// import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import { formatDateLine, formatJapanDateSlash, formatDateTimeIE } from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
// import RadioButton from "~/components/molecules/RadioInlineButton";
// import Radiobox from "~/components/molecules/Radiobox";
// import Checkbox from "~/components/molecules/Checkbox";
// import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";

registerLocale("ja", ja);
// import SelectPannelHarukaModal from "../Common/SelectPannelHarukaModal";
// import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
// import SetDetailViewModal from "~/components/templates/Patient/Modals/Common/SetDetailViewModal";
// import axios from "axios/index";
// import $ from "jquery";
// import {KARTEMODE} from "~/helpers/constants";
import {setDateColorClassName} from '~/helpers/dialConstants';

const Wrapper = styled.div`
  display: flex;
  .date-select {
    border: solid 1px #999;
    text-align: center;
    height: 30px;
    margin: 0;        
  }
  .selected{
    background:lightblue;
  }
  .stopping{
    background: #fde9d9;
  }
  .no-stopping{
    background: #c8eef8;
  }
  .free-comment{
    label{
      width: 0px;
      margin: 0px;
    }
    input{
      border-color: black;
      border-radius: 0px;
    }
    .comment-label{
      display: flex;
      justify-content: flex-end;
      margin-top: 5px;
    }
  }

  .no-border{
    border: none !important;
    input{
      border: none !important;
      padding: 4px;
      width: 100%;
    }
  }

  .moved-content-area{
    width: 100%;
    border: 1px solid black;
    height: 48vh;
    margin-top: 5px;
    background: #ddd;
  }

  .middle-col{
    display: flex;
    flex-direction: column;
    height: 75vh;
    justify-content: flex-end;
    
    .btn-add{
      width: 30px;
      padding: 40px 5px;
      margin-left: 10px;
      background: #ddd;
      border: 1px solid black;
      margin-bottom: 8vh;
    }
    .btn-add:hover{
      cursor: pointer;      
    }
  }

  .stop-date-area{
    display:flex;
    overflow: hidden;
    justify-content: center;
    .date-select{
      float: left;
      width: 100px;      
    }
    span{
      padding-top:3px;
    }
  }

  .search-order-results{
    overflow-y: auto;
    height: 25vh;
    width: 100%;
    margin-bottom: 10px;
    background: #ddd;
    border: 1px solid black;
  }

  .search-order-contents{
    overflow-y: auto;
    height: 35vh;
    width: 100%;
    background: #ddd;
    border: 1px solid black;
    table{
      background: white;
    }
  }

  .moved-content-area-height{
    height: 48vh;
  }

  table{
    width: 100%;
  }

  th {
    background-color: ${colors.midEmphasis};
    color: ${colors.surface};
    text-align: center;
    font-weight: normal;
    label {
      color: ${colors.surface};
    }
  }

  th,
  td {
    border: 1px solid ${colors.background};
    padding: 4px 8px;
  }

  .order-info-area{
    width: 100%;
    display: flex;
  }

  .order-info-area{
    justify-content: space-between;
  }

  .order-title{
    font-weight: bold;
    margin: 10px auto;
  }

  .current-disease{
    width: 50px;
    border: 1px solid black;
    background: #c8eef8;
    margin-right: 3px;
  }
  .mid-disease{
    width: 50px;
    border: 1px solid black;
    background: #fde9d9;
    margin-left: 10px;
    margin-right: 3px;
  }
  .mid-implement-disease{
    width: 50px;
    border: 1px solid black;
    background: #f4c2d5;
    margin-left: 10px;
    margin-right: 3px;
  }
`;

class StopPrescriptionModal extends Component {
    constructor(props) {
      super(props);
      let existCache = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.STOP_PRESCRIPTION_EDIT);
      //  Object.entries(pres_methods).forEach(([name, fn]) =>{
      //   if(name == "getHistoryData" || name == "getHistoryMoreData" || name == "getTrackData") {
      //       this[name] = fn.bind(this);
      //   }
      // });
      var start_date = new Date();
      start_date.setDate(start_date.getDate() - 15);
      this.state = {
        start_date,
        end_date: new Date(),
        stop_comment: existCache != undefined && existCache != null && existCache.free_comment != undefined && existCache.free_comment != null && existCache.free_comment != "" ? existCache.free_comment : "",
        isOpenStopDateModal: false,
        prescription_order_list:[],
        prescirption_order_content_list:[],
        selected_rp_numbers:[],
        selected_rps:[],
        stopped_rps:existCache != undefined && existCache != null && existCache.stopped_rps != undefined && existCache.stopped_rps != null && existCache.stopped_rps.length > 0 ? existCache.stopped_rps : [],
        isUpdateConfirmModal: false,
        confirm_message: "",
        progress_dates : [],
        stopping_dates : [],
        stopped_dates : [],
      }
    }

    async componentDidMount() {
      this.getHospitalPrescription();
    }

    async getHospitalPrescription(){
      var param = {
        patient_id:this.props.patientId,
        start_date : formatDateLine(this.state.start_date),
        end_date : formatDateLine(this.state.end_date),
        karte_status : 3, //入院
        department : 0, //全科
      };
      let prescription_order_list = await apiClient.get("/app/api/v2/order/prescription/patient", {
        params: param
      });
      this.checkStoppedDates(prescription_order_list);
      this.setState({
        prescription_order_list:prescription_order_list,
      })
    }

    checkStoppedDates(prescription_order_list){
      var progress_dates = [];
      var stopping_dates = [];
      var stopped_dates = [];
      if (prescription_order_list != undefined && prescription_order_list != null && prescription_order_list.length > 0){
        prescription_order_list.map(item => {
          var order = item.order_data.order_data;
          order.map(sub_itme=> {
            if (sub_itme.done_order != 1 && sub_itme.stop_flag != 1) progress_dates.push(new Date(formatDateLine(formatDateTimeIE(item.order_data.executed_date_time))))
            if (sub_itme.done_order != 1 && sub_itme.stop_flag == 1) stopping_dates.push(new Date(formatDateLine(formatDateTimeIE(item.order_data.executed_date_time))))
            if (sub_itme.done_order == 1 && sub_itme.stop_flag == 1) stopped_dates.push(new Date(formatDateLine(formatDateTimeIE(item.order_data.executed_date_time))))
          })
        })
      }
      this.setState({
        progress_dates,
        stopping_dates,
        stopped_dates
      })
    }

    removeSecond(date){
      if (date == undefined || date == null || date == '') return;
      date = date.split(' ');
      var time = date[1];
      time = time.split(':');
      time = time[0] +':' + time[1];
      return date[0] + ' ' + time;
    }

    getStartDate = value => {
      this.setState({
        start_date: value,
      }, () => {
        this.getHospitalPrescription();
      });
    };

    getEndDate = value => {
      this.setState({
        end_date: value,
      }, () => {
        this.getHospitalPrescription();
      });
    };

    getFreeCommnet(e) {
      if (e.target.value.length > 20){
        window.sessionStorage.setItem("alert_messages", 'フリーコメントは全角20文字以内で入力してください。');
        return;
      }
      this.setState({stop_comment:e.target.value});
    }

    openStopDateModal = () =>{
      if (!(this.state.selected_rps.length > 0)) {
        window.sessionStorage.setItem("alert_messages", '中止したい処方オーダーを選択してください。');
        return;
      }
      this.setState({
        isOpenStopDateModal: true
      });
    }

    closeModal = () => {
      this.setState({
        isOpenStopDateModal: false
      });
    }

    handleOk = (stop_date) => {
      var stopped_rps = this.state.stopped_rps;
      var selected_rps = [...this.state.selected_rps];
      if (selected_rps.length > 0){
        selected_rps.map(item => {
          item.stop_date = stop_date;
          item.stop_flag = 1;
          stopped_rps.push(item);
        })
      }
      this.setState({
        isOpenStopDateModal: false,
        selected_rps:[],
        stopped_rps,
      });
    }

    selectPrescOrder = (item) => {
      this.setState({
        prescirption_order_content_list:item.order_data.order_data,
        selected_order_title:item.order_title,
        selected_execute_date:formatDateLine(formatDateTimeIE(item.order_data.executed_date_time)),
        selected_order_datetime:item.updated_at,
        selected_number:item.number,
        selected_rps:[],
        selected_rp_numbers:[]
      })
    }

    selectRp  = (item) => {
      var selected_rp_numbers = [...this.state.selected_rp_numbers];
      var selected_rps = [...this.state.selected_rps];
      if (selected_rp_numbers.indexOf(item.order_number) < 0){
        selected_rp_numbers.push(item.order_number);
        selected_rps.push(item);
      } else {
        var index = selected_rp_numbers.indexOf(item.order_number);
        selected_rp_numbers.splice(index, 1);
        selected_rps.splice(index, 1);
      }
      this.setState({
        selected_rp_numbers,
        selected_rps,
      })
    }

    changeStopStatus = (index) => {
      var temp = this.state.stopped_rps;
      temp[index].stop_flag = !temp[index].stop_flag;
      this.setState({stopped_rps:temp})
    }

    confirmCancel() {
      this.setState({
        isUpdateConfirmModal: false,
        confirm_message: "",
      });
    }

    save = () => {
      var stopped_rps = this.state.stopped_rps;
      stopped_rps = stopped_rps.filter(x=>x.stop_flag ==1);
      if (stopped_rps.length == 0){
        window.sessionStorage.setItem("alert_messages","中止処方オーダーを追加して下さい。");
        return;
      }
      this.setState({
        isUpdateConfirmModal:true,
        confirm_message:'中止処方オーダーを登録しますか？'
      })
    }

    confirmSave = async() => {
      this.confirmCancel();

      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      let stopped_params = [];

      this.state.stopped_rps.map(item => {
        stopped_params.push(
          {order_number:item.order_number, stop_date:item.stop_date, stop_flag:item.stop_flag}
        )
      })

      // store data in cache
      let params = {
        stopped_rps: this.state.stopped_rps,
        stopped_params: stopped_params,
        free_comment: this.state.stop_comment,
        doctor_code: authInfo.staff_category == 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
      }
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.STOP_PRESCRIPTION_EDIT, JSON.stringify(params), 'insert');

      // refresh soap
      this.context.$setExaminationOrderFlag(1);

      this.props.closeModal();

      // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      // this.confirmCancel();
      // var stopped_rps = this.state.stopped_rps;
      // stopped_rps = stopped_rps.filter(x=>x.stop_flag ==1);
      // var stopped_params = [];
      // stopped_rps.map(item => {
      //   stopped_params.push(
      //     {order_number:item.order_number, stop_date:item.stop_date, stop_flag:item.stop_flag}
      //   )
      // })
      // await apiClient.post("/app/api/v2/order/prescription/registerStoppedRp", {
      //   params: {
      //     stopped_params:stopped_params,
      //     stop_comment:this.state.stop_comment,
      //     doctor_code:authInfo.staff_category == 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
      //   }
      // }).then(() => {
      //   window.sessionStorage.setItem("alert_messages","中止処方オーダを登録しました。");
      //   this.props.closeModal();
      // });
    }

    hasStoppedRp = (order_number) => {
      let result = false;
      if (this.state.stopped_rps.length > 0) {
        this.state.stopped_rps.map(item=>{
          if (item.order_number == order_number) {
            result = true;
          }
        });

      }
      return result;
    }

    render() {
      // let prescription_content = [];
      // if (this.state.medicineHistory != undefined && this.state.medicineHistory.length > 0) {
      //   prescription_content = this.state.medicineHistory[0];
      // }
      var {prescription_order_list, prescirption_order_content_list} = this.state;
        return (
            <>
                <Modal show={true} id="outpatient" className="custom-modal-sm patient-exam-modal outpatient-modal stop-prescription first-view-modal">
                    <Modal.Header>
                        <Modal.Title>中止処方</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                          <div className="left-col" style={{width:"47%"}}>
                            <div className="order-title" style={{fontWeight:"bold"}}>処方オーダ一覧</div>
                            <div className="stop-date-area clickable">
                              <div className="date-select no-border">
                                <DatePicker
                                  locale="ja"
                                  selected={this.state.start_date}
                                  onChange={this.getStartDate.bind(this)}
                                  dateFormat="yyyy/MM/dd"
                                  placeholderText="年/月/日"
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  dayClassName = {date => setDateColorClassName(date)}
                                />
                              </div>
                              <span>~</span>
                              <div className="date-select no-border clickable">
                                <DatePicker
                                  locale="ja"
                                  selected={this.state.end_date}
                                  onChange={this.getEndDate.bind(this)}
                                  dateFormat="yyyy/MM/dd"
                                  placeholderText="年/月/日"
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  dayClassName = {date => setDateColorClassName(date)}
                                />
                              </div>
                              <div className="" style={{marginTop:"5px"}}>実施予定のオーダー</div>
                            </div>
                            <div className="search-order-results">
                                <table>
                                    <tr>
                                      <th>種別</th>
                                      <th>実施予定日</th>
                                      <th>オーダー日時</th>
                                      <th>診療科</th>
                                      <th>発行者</th>
                                    </tr>
                                    {prescription_order_list.length > 0 && prescription_order_list.map((item, index)=>{
                                      return(
                                        <tr className={this.state.selected_number == item.number?'selected clickable':'clickable'} key={index} onClick={this.selectPrescOrder.bind(this, item)}>
                                          <td>{item.order_title}</td>
                                          <td>{formatJapanDateSlash(formatDateLine(formatDateTimeIE(item.order_data.executed_date_time)))}</td>
                                          <td>{this.removeSecond(item.updated_at)}</td>
                                          <td>{item.order_data.department}</td>
                                          <td>{item.order_data.doctor_name}</td>
                                        </tr>
                                      );
                                    })}
                                </table>
                            </div>

                            <div className="order-title" style={{fontWeight:"bold"}}>オーダー内容</div>
                            <div className="order-info-area">
                              <div>{this.state.selected_order_title}</div>
                              <div>{this.state.selected_execute_date}</div>
                              <div>{this.state.selected_number>0?'[オーダー日時]':''}</div>
                              <div>{this.removeSecond(this.state.selected_order_datetime)}</div>
                            </div>
                            <div className="search-order-contents">
                                <table>
                                    <tr>
                                      <th>Rp</th>
                                      <th>内容</th>
                                      <th>数量</th>
                                      <th>単位</th>
                                    </tr>
                                    {prescirption_order_content_list.length > 0 && prescirption_order_content_list.map((item, index)=>{
                                      if (item.stop_flag != 1 && this.hasStoppedRp(item.order_number) != true){
                                        return(
                                          <tr key={index} className={this.state.selected_rp_numbers.includes(item.order_number)?'selected clickable':'clickable'} onClick={this.selectRp.bind(this, item)}>
                                            <td>{index + 1}</td>
                                            <td>
                                              {item.med.map(ele=>{
                                                return(
                                                  <><div>{ele.item_name}</div></>
                                                );
                                              })}
                                            </td>
                                            <td>
                                              {item.med.map(ele=>{
                                                return(
                                                  <><div style={{textAlign:"right"}}>{ele.amount}</div></>
                                                );
                                              })}
                                            </td>
                                            <td>
                                              {item.med.map(ele=>{
                                                return(
                                                  <><div>{ele.unit}</div></>
                                                );
                                              })}
                                            </td>
                                          </tr>
                                        );
                                      }
                                    })}
                                </table>
                            </div>

                          </div>
                          <div className="middle-col" style={{width:"6%"}}>
                            <div className="btn-add" onClick={this.openStopDateModal}>➞追加</div>
                          </div>
                          <div className="right-col" style={{width:"47%"}}>
                            <div className="order-title" style={{fontWeight:"bold",color:"red"}}>中止処方オーダー</div>
                            <div className="order-title" style={{fontWeight:"bold",color:"red"}}>処方を中止したい場合は処方オーダー一覧から追加して下さい。</div>
                            <div style={{display:"flex", color:"red"}}>
                              <div className="current-disease"></div>
                              <div>現在服薬中</div>
                              <div className="mid-disease"></div>
                              <div>服薬中止選択中</div>
                              <div className="mid-implement-disease"></div>
                              <div>既に服薬中止実施済み</div>
                            </div>
                            <div className="moved-content-area search-order-contents moved-content-area-height">
                              {this.state.stopped_rps.length>0 && (
                                  <table>
                                      <tr>
                                        <th>Rp</th>
                                        <th>内容</th>
                                        <th>数量</th>
                                        <th>単位</th>
                                      </tr>
                                      {this.state.stopped_rps.map((item, index)=>{
                                        return(
                                          <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                              {item.med.map(ele=>{
                                                return(
                                                  <>
                                                    <div>
                                                      {ele.item_name}
                                                    </div>
                                                  </>
                                                );
                                              })}
                                              <div style={{marginLeft:'50px'}} onClick={this.changeStopStatus.bind(this,index)} className={item.stop_flag?'clickable stopping':'clickable no-stopping'}>
                                                {item.stop_flag?'服薬中止日　('+formatJapanDateSlash(formatDateLine(item.stop_date)) + ')　':formatJapanDateSlash(formatDateLine(item.stop_date))}
                                              </div>
                                            </td>
                                            <td>
                                              {item.med.map(ele=>{
                                                return(
                                                  <>
                                                    <div style={{textAlign:"right"}}>
                                                      {ele.amount}
                                                    </div>
                                                  </>
                                                );
                                              })}
                                              <div>&nbsp;&nbsp;</div>
                                            </td>
                                            <td>
                                              {item.med.map(ele=>{
                                                return(
                                                  <>
                                                    <div>
                                                      {ele.unit}
                                                    </div>
                                                  </>
                                                );
                                              })}
                                              <div>&nbsp;&nbsp;</div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                  </table>
                              )}
                            </div>
                            <div className="div-flex div-mar-3 free-comment">
                              <div style={{marginTop: "10px"}}>フリーコメント</div>
                              <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getFreeCommnet.bind(this)}
                                value={this.state.stop_comment}
                              />
                              <div className="comment-label">(全角20文字まで)</div>
                            </div>
                          </div>
                        </Wrapper>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
                      <Button className="red-btn" onClick={this.save.bind(this)}>確定</Button>
                    </Modal.Footer>
                    {this.state.isOpenStopDateModal == true && (
                        <InputDateModal
                          closeModal={this.closeModal}
                          handleOk={this.handleOk}
                          selected_rps = {this.state.selected_rps}
                          progress_dates = {this.state.progress_dates}
                          stopping_dates = {this.state.stopping_dates}
                          stopped_dates = {this.state.stopped_dates}
                        />
                    )}
                    {this.state.isUpdateConfirmModal !== false && (
                      <SystemConfirmJapanModal
                        hideConfirm={this.confirmCancel.bind(this)}
                        confirmCancel={this.confirmCancel.bind(this)}
                        confirmOk={this.confirmSave.bind(this)}
                        confirmTitle={this.state.confirm_message}
                      />
                    )}
                </Modal>

            </>
        );
    }
}

StopPrescriptionModal.contextType = Context;
StopPrescriptionModal.propTypes = {
    patientId: PropTypes.number,
    patientInfo: PropTypes.object,
    closeModal: PropTypes.func,
    cache_index:PropTypes.number,
};

export default StopPrescriptionModal;
