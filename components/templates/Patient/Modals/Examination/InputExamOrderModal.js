import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import ValidateAlertModal from '~/components/molecules/ValidateAlertModal';
import InputBoxTag from "~/components/molecules/InputBoxTag";
import $ from 'jquery';
import {removeRedBorder, addRedBorder, toHalfWidthOnlyNumber} from '~/helpers/dialConstants';
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
  max-height: 65vh;
  overflow-y: auto;
  .selected{
    background: lightgray;
  }
  label {
      text-align: right;
      width: 80px;
  }
  input {
    width: 200px;
    font-size: 1rem;
    height: 2.37rem;
  }
  
  .label-title{
    font-size: 1rem;
    width: 300px;
    margin-right:15px;
    line-height: 2.37rem;
    margin-top: 0.5rem;
   }
   .inputbox-tag {
    .label-title{
      width: 0;
      margin-right: 0;
     }
     input {
      ime-mode: inactive;
     }
   }
 `;


class InputExamOrderModal extends Component {
  constructor(props) {
    super(props);
    let exam_data = JSON.parse(JSON.stringify(this.props.exam_data));
    this.done_numbers = null;
    let show_done_modal = true;
    if (exam_data.administrate_period !== undefined && exam_data.administrate_period.done_numbers !== undefined) {
      this.done_numbers = exam_data.administrate_period.done_numbers;
      show_done_modal = false;
    }
    this.state = {
      exam_data,
      examinations:exam_data.examinations,
      order_id : exam_data.number,
      system_patient_id:exam_data.system_patient_id,
      is_enabled: 1,
      number: 0,
      inspection_id :  '',
      alert_message: '',
      isUpdateConfirmModal: false,
      confirm_message:"",
      alert_messages:"",
      is_result_exist: false,
      is_loaded: !show_done_modal,
      show_done_modal
    }
    this.change_flag = 0;
  }
  
  async UNSAFE_componentWillMount() {
    if (this.state.show_done_modal) await this.searchResult();
  }
  searchResult = async () => {
    if (!this.state.is_loaded) this.setState({is_loaded: true});
    let path = "/app/api/v2/master/examination/searchExamResult";
    const post_data = {
      params: {
        order_id:this.state.order_id,
        system_patient_id:this.state.system_patient_id,
        examinations: this.state.examinations,
        select_date_time: this.state.select_date_time
      }
    };
    await apiClient.post(path, post_data).then((res)=>{
      if (res){
        var exam_result = res.exam_result;
        var temp = this.state.examinations;
        var examinations = res.examinations;
        let is_result_exist = false;
        if (examinations.length > 0) {
          temp.map(item=>{
            let find_data = examinations.find(x=>x.code == item.examination_code);
            if (find_data != undefined) {
              item.is_result_item = find_data.is_result_item;
              if (find_data.is_result_item == 1)
                is_result_exist = true;
            }
          })
        }
        if (exam_result.length > 0) {
          exam_result.map(item => {
            temp.map(val => {
              if (item.examination_code == val.examination_code) {
                val.value = item.value;
                val.number = item.number;
              }
            })
          })
        }
        this.setState({
          examinations:temp,
          is_result_exist,
          is_loaded: true
        })
      }
      
    });
  }
  
  getValue = (index, is_numeric, e) => {
    var temp = this.state.examinations;
    if (is_numeric){
      var RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
      if (e.target.value != '' && !RegExp.test(e.target.value)) return;
      temp[index].value = toHalfWidthOnlyNumber(e.target.value);
    } else {
      temp[index].value = e.target.value;
    }
    this.change_flag = 1;
    this.setState({
      examinations:temp,
    });
  };
  
  async registerMaster()  {
    let path = "/app/api/v2/master/examination/registerExamResult";
    const post_data = {
      params: {
        order_id:this.state.order_id,
        system_patient_id:this.state.system_patient_id,
        examinations:this.state.examinations,
        select_date_time: this.state.select_date_time
      }
    };
    await apiClient.post(path, post_data).then((res)=>{
      if (res){
        this.modalBlack();
        this.setState({alert_messages:res.alert_message});
      }
    });
  }
  
  handleOk = () => {
    if (this.state.is_result_exist != true) return;
    if((this.state.system_patient_id === undefined || this.state.system_patient_id == '' || this.state.system_patient_id <= 0)){
      window.sessionStorage.setItem("alert_messages", '患者IDを入力してください。');
      return;
    }
    let error_str_array = this.checkValidation();
    if (error_str_array.length > 0) {
      this.modalBlack();
      this.setState({ alert_message: error_str_array.join('\n') })
      return
    }
    this.registerMaster();
  };
  checkValidation = () =>{
    this.state.examinations.map((item,index)=>{
      removeRedBorder(index + "_exam_id");
    });
    let first_tag_id = '';
    let error_str_arr = [];
    this.state.examinations.map((item,index)=>{
      if (item.is_result_item == 1) {
        if (item.value == undefined || item.value == null || item.value == '') {
          error_str_arr.push(item.label + "を入力してください。");
          addRedBorder(index + "_exam_id");
          if (first_tag_id == '') first_tag_id = index + "_exam_id";
        }
      }
    });
    this.setState({first_tag_id});
    return error_str_arr;
  }
  closeAlertModal = () => {
    this.modalBlackBack();
    this.setState({ alert_message: '' });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }
  
  register = () => {
    this.confirmCancel();
  }
  
  confirmCancel() {
    this.modalBlackBack();
    this.setState({
      isUpdateConfirmModal: false,
      confirm_message: "",
      confirm_type: "",
    });
  }
  
  confirmCloseModal=()=>{
    if(this.change_flag == 1){
      this.modalBlack();
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"close",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  }
  closeModal = () =>{
    this.setState({alert_messages: ''});
    this.modalBlackBack();
    this.props.handleOk();
  }
  modalBlack() {
    var base_modal = document.getElementsByClassName("input-exam-order")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  }
  modalBlackBack() {
    var base_modal = document.getElementsByClassName("input-exam-order")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
  }
  
  selectDoneTime = (value) => {
    this.setState({select_date_time: value});
  }
  
  openDoneModal = () => {
    if (this.state.select_date_time === undefined) return;
    this.setState({show_done_modal: true});
    this.searchResult();
  }
  
  render() {
    let {examinations} = this.state;
    let modal_title = "検査結果編集";
    if (!this.state.show_done_modal) modal_title = "結果入力対象選択";
    return  (
      <Modal show={true} id="add_contact_dlg"  className="exam-order-list-modal">
        <Modal.Header>
          <Modal.Title>{modal_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.is_loaded ? (
            <>
            {!this.state.show_done_modal ? (
              <Wrapper>
                <div className="w-100 h-100" style={{padding: "2rem"}}>
                  <div className="border w-100 h-100 p-2" style={{overflowY:"auto"}}>
                    {Object.keys(this.done_numbers).map(date_key=>{
                      let item = this.done_numbers[date_key];
                      return(
                        <>
                          {item.map((sub_item)=>{
                            if (sub_item.completed_at != "") {
                              let date_time = date_key + " " + sub_item.time;
                              return (
                                <div key={sub_item} className={this.state.select_date_time == date_time ? "selected w-100 text-left": "w-100 text-left"} style={{cursor: "pointer"}} onClick={this.selectDoneTime.bind(this, date_time)}>
                                  {date_key}　{sub_item.time}
                                </div>
                              )
                            }
                          })}
                        </>
                      )
                    })}
                  </div>
                </div>
              </Wrapper>
            ):(
              <Wrapper>
                {this.state.is_result_exist != true && (
                  <div className={`text-center`} style={{fontSize: "1.5rem"}}>結果値入力のある項目がありません</div>
                )}
                <div>
                  {examinations != undefined && examinations != null && examinations.length > 0 && (
                    examinations.map((item, index) => {
                      return(
                        <div key={index} className={`d-flex`}>
                          <label className={'label-title'}>{item.label}</label>
                          {item.is_result_item == 1 && (
                            <div className={`inputbox-tag`}>
                              <InputBoxTag
                                label=""
                                id={index + "_exam_id"}
                                getInputText={this.getValue.bind(this, index, item.is_numeric)}
                                value={item.value}
                              />
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </Wrapper>
              )}
            </>
          ):(
            <SpinnerWrapper>
              <Spinner animation="border" variant="secondary" />
            </SpinnerWrapper>
          )}
          {this.state.isUpdateConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.register.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.confirm_message !== "" && this.state.confirm_type === "close" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.props.closeModal}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
          {this.state.alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
          {this.state.alert_messages != "" && (
            <AlertNoFocusModal
              handleOk={this.closeModal}
              showMedicineContent={this.state.alert_messages}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.confirmCloseModal}>キャンセル</Button>
          {this.state.show_done_modal ? (
            <Button className={this.state.is_result_exist ? "red-btn" : "disable-btn"} onClick={this.handleOk}>登録</Button>
          ):(
            <Button className={this.state.select_date_time !== undefined ? "red-btn" : "disable-btn"} onClick={this.openDoneModal}>確定</Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

InputExamOrderModal.contextType = Context;

InputExamOrderModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  exam_data : PropTypes.object,
};

export default InputExamOrderModal;