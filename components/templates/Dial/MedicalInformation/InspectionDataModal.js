import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import ja from "date-fns/locale/ja";
import {KEY_CODES} from "../../../../helpers/constants";
import InputBoxTag from "../../../molecules/InputBoxTag";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  .label-title {
      text-align: right;
      width: 200px;
      margin-right: 8px;
      font-size: 18px;
      margin-top: 6px;
      margin-bottom: 0;
   }
  input {
    width: 230px;
    font-size: 15px;
    ime-mode: inactive;
  }
  .pattern_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px 0 20px 0;
  }
 `;

class InspectionDataModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.value = (modal_data !== null && modal_data.value != undefined && modal_data.value != null) ? modal_data.value : '';
    this.value2 = (modal_data !== null && modal_data.value2 != undefined && modal_data.value2 != null) ? modal_data.value2 : '';
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.state = {
      modal_data,
      before_or_after_enabled: modal_data !== null ? modal_data.before_or_after_enabled : 0,
      value:(modal_data !== null && modal_data.value != undefined && modal_data.value != null) ? modal_data.value : '',
      value2:(modal_data !== null && modal_data.value2 != undefined && modal_data.value2 != null) ? modal_data.value2 : '',
      change_flag: 0,
      confirm_alert_title:"",
      confirm_message:"",
      confirm_type:"",
      alert_messages:"",
    }
    this.btns = [];
    this.flag = 0;
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    this.examination_result_text_max_length = 10;
    if(initState !== undefined && initState != null && initState.conf_data !== undefined && initState.conf_data.examination_result_text_max_length !== undefined
      && parseInt(initState.conf_data.examination_result_text_max_length) > 0){
      this.examination_result_text_max_length = parseInt(initState.conf_data.examination_result_text_max_length);
    }
  }
  
  componentDidMount () {
    this.setChangeFlag(0);
    if(document.getElementById("value_id")!== undefined && document.getElementById("value_id")!= null){
      document.getElementById("value_id").focus();
    }
  }
  
  getValue = (key, e) => {
    let value_title = "";
    if(this.state.before_or_after_enabled == 0){
      value_title = "結果の値";
    } else {
      value_title = key == "value" ? "透析前結果の値" : "透析後結果の値";
    }
    if(e.target.value.length > this.examination_result_text_max_length){
      this.setState({
        [key]:this.state[key],
        alert_messages:value_title+"を"+this.examination_result_text_max_length+"文字以内で入力してください。",
      })
    } else {
      this.setState({[key]: e.target.value});
      this.setChangeFlag(1);
    }
  };
  
  register = () => {
    if (this.state.change_flag == 0) return;
    if((this.value == this.state.value) && (this.value2 == this.state.value2)){
      return;
    }
    this.setChangeFlag(1);
    this.props.handleOk(this.state.value, this.state.value2);
  };
  
  componentWillUnmount() {
    sessApi.delObjectValue('dial_change_flag', 'medical_history');
  }
  
  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.left || e.keyCode === KEY_CODES.right) {
      let fnum = (this.flag + 1) % this.btns.length;
      
      this.setState({curFocus : fnum});
      this.flag = fnum;
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      if (this.flag === 0) {
        this.register();
      }else{
        this.props.closeModal();
      }
    }
  }
  
  onHide=()=>{}
  
  setChangeFlag=(change_flag)=>{
    this.setState({change_flag});
    if (change_flag){
      sessApi.setObjectValue('dial_change_flag', 'medical_history', 1)
    } else {
      sessApi.remove('dial_change_flag');
    }
  };
  
  handleCloseModal = () => {
    if (this.state.change_flag == 1) {// if data changed
      this.setState({
        confirm_type:"close_modal",
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:"入力中",
      });
      return;
    }
    this.props.closeModal();
  }
  
  confirmCancel=()=>{
    this.setState({
      confirm_alert_title: "",
      confirm_message: "",
      confirm_type: "",
      alert_messages: "",
    });
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type == "close_modal"){
      this.props.closeModal();
    }
  }
  
  render() {
    return  (
      <Modal show={true} onHide={this.onHide}  className="master-modal inspection-pattern-modal" onKeyDown={this.onKeyPressed}>
        <Modal.Header>
          <Modal.Title style={{fontSize:24}}>{this.props.type==1?'合併症':''}検査データ編集</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            {(this.state.before_or_after_enabled !== 0 ) ? (
              <>
                <div className="pattern_code hankaku-eng-num-input">
                  <InputWithLabelBorder
                    label="透析前結果の値"
                    type="text"
                    id='value_id'
                    getInputText={this.getValue.bind(this, 'value')}
                    diseaseEditData={this.state.value}
                  />
                  <InputWithLabelBorder
                    label="透析後結果の値"
                    type="text"
                    id='value2_id'
                    getInputText={this.getValue.bind(this, 'value2')}
                    diseaseEditData={this.state.value2}
                  />
                </div>
              </>
            ) : (
              <>
                <div className={'hankaku-eng-num-input'}>
                  <InputBoxTag
                    label="結果の値"
                    id='value_id'
                    getInputText={this.getValue.bind(this,"value")}
                    value={this.state.value}
                  />
                </div>
              </>
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.handleCloseModal}>キャンセル</Button>
          <Button className={((this.value == this.state.value) && (this.value2 == this.state.value2)) ? "disable-btn":"red-btn"} onClick={this.register}>
            {this.props.modal_data == undefined ? '登録' : ((this.state.modal_data.value == undefined && this.state.modal_data.value2 == undefined) ? '登録' : '変更')}</Button>
        </Modal.Footer>
        {this.state.confirm_message !== "" &&  (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
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
    );
  }
}

InspectionDataModal.contextType = Context;

InspectionDataModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modal_data: PropTypes.object,
  system_patient_id: PropTypes.number,
  type : PropTypes.bool,
};

export default InspectionDataModal;
