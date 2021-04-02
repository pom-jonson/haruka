import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
// import * as apiClient from "~/api/apiClient";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import RadioButton from "~/components/molecules/RadioInlineButton";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {addRedBorder, removeRedBorder, addRequiredBg, removeRequiredBg} from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import { getPatientValidate } from "~/components/templates/Dial/DialMethods";
import { FAMILY_CLASS } from "~/helpers/constants";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  height: 100%;
  float: left;
  label {
    text-align: right;
    width: 80px;
  }
  .flex {
    display: flex;
  }
  input {
    width: 400px;
    font-size: 16px;
  }

  .hankaku-eng-num-input {
    ime-mode: inactive;
    input {
      ime-mode: inactive;
    }
  }

  .checkbox-label {
    width: 30%;
    text-align: left;
  }
  .label-title {
    font-size: 16px;
    width: 120px;
    text-align: right;
    margin-right: 10px;
  }
  .add-button {
    text-align: center;
    width: 100%;
  }
  .checkbox_area {
    padding-left: 15px;
  }

  .pullbox-select {
    width: 150px;
  }
  .pullbox-label {
    width: auto;
  }

  .gender {
    font-size: 16px;
    margin-top: 10px;
    margin-left: 15px;
    margin-bottom: 10px;
    .gender-label {
      width: 100px;
      margin-top: 8px;
      float: left;
    }
    .radio-btn label {
      width: 100px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin: 0 5px;
      padding: 4px 5px;
    }
  }
  .color {
    text-align: center;
    .radio-btn label {
      width: 60px;
      height: 30px;
      border: solid 1px rgb(206, 212, 218);
      vertical-align: top;
      font-size: 15px;
    }
  }
  .residence {
    margin-left: 20px;
    .pullbox-title {
      display: none;
    }
    .pullbox-select {
      width: 70px;
      margin-left: 15px;
    }
  }
  .color-clear {
    background-color: transparent;
    padding-top:1px!important;
  }
  .color-1 {
    background-color: cornflowerblue;
    opacity: 0.8;
  }
  .color-2 {
    background-color: lightsalmon;
    opacity: 0.8;
  }
  .color-3 {
    background-color: yellow;
    opacity: 0.8;
  }
  .color-4 {
    background-color: mediumaquamarine;
    opacity: 0.8;
  }
  .color-5 {
    background-color: lightpink;
    opacity: 0.8;
  }

  .selected {
    border: 2px solid !important;
    opacity: 1;
  }
  .footer {
    margin-top: 10px;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }

    span {
      color: white;
      font-size: 0.8rem;
      font-weight: 100;
    }
  }
  .bar{
    width:100%;
    height:15px;
  }
  .footer-buttons{
    margin-top:10px;
    margin-right:16px;
  }
`;

const residence_list = [
  { id: "-1", value: "", field_name: "" },
  { id: "1", value: "同居", field_name: "" },
  { id: "0", value: "別居", field_name: "" },
];
class FamilyModal extends Component {
  constructor(props) {
    super(props);
    let person_info = this.props.person_info;
    this.state = {
      generation: this.props.row_index,
      colmun_number: this.props.col_index,
      system_patient_id: this.props.system_patient_id,

      id: person_info != null ? person_info.id : 0,
      is_this_patient: person_info != null ? person_info.is_this_patient : 0,
      relation: person_info != null ? person_info.relation : "",
      gender: person_info != null ? person_info.gender : "",
      age: person_info != null ? person_info.age : "",
      is_alive: person_info != null ? person_info.is_alive : 1,
      note: person_info != null ? person_info.note : "",
      parents_color: person_info != null ? person_info.parents_color : 0,
      children_color: person_info != null ? person_info.children_color : 0,
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      confirm_message: "",
      alert_messages: "",
      confirm_alert_title:'',
      is_living_together:
      person_info != null ? person_info.is_living_together : -1,

      validate_message:'',      
    };    
    this.original = JSON.stringify(this.state);
    this.dial_family_validate = getPatientValidate().dial_family;
  }

  componentDidMount() {    
    this.changeBackground();
    this.extractFamilycode(this.props.familyMasterData);
    let person_info = this.props.person_info;
    var parents_color = person_info != null ? person_info.parents_color : 0;
    var children_color = person_info != null ? person_info.children_color : 0;
    var top_bar = document.getElementsByClassName('top-bar')[0];
    switch(parseInt(parents_color)){
      case 0:
        top_bar.style.backgroundColor ='transparent';
        break;
      case 1:        
        top_bar.style.backgroundColor ='cornflowerblue';
        break;
      case 2:
        top_bar.style.backgroundColor ='lightsalmon';
        break;        
      case 3:
        top_bar.style.backgroundColor ='yellow';
        break;
      case 4:
        top_bar.style.backgroundColor ='mediumaquamarine';
        break;        
      case 5:
        top_bar.style.backgroundColor ='lightpink';
        break;
    }
    var bottom_bar = document.getElementsByClassName('bottom-bar')[0];
    switch(parseInt(children_color)){
      case 0:
        bottom_bar.style.backgroundColor ='transparent';
        break;
      case 1:
        bottom_bar.style.backgroundColor ='cornflowerblue';
        break;
      case 2:
        bottom_bar.style.backgroundColor ='lightsalmon';
        break;        
      case 3:
        bottom_bar.style.backgroundColor ='yellow';
        break;
      case 4:
        bottom_bar.style.backgroundColor ='mediumaquamarine';
        break;        
      case 5:
        bottom_bar.style.backgroundColor ='lightpink';
        break;
    }
    this.forceUpdate();
  }

  extractFamilycode = (familyMasterData) =>{
    var result = [{id:0, value:''}];
    if (familyMasterData == undefined || familyMasterData == null) return result;
    var generation = this.props.row_index;
    var family_class_name = '';
    switch(generation){      
      case FAMILY_CLASS.GRAND_PARENT:
        family_class_name = '祖父母';
        break;
      case FAMILY_CLASS.PARENT:
        family_class_name = '父母';
        break;
      case FAMILY_CLASS.SAME:
        family_class_name = '配偶者・兄弟姉妹';
        break;
      case FAMILY_CLASS.CHILD:
      family_class_name = '子';
        break;
      case FAMILY_CLASS.GRAND_CHILD:
        family_class_name = '孫';
        break;
    }
    familyMasterData.map(item => {
      if(item.is_enabled){
        if (item.value == null || item.value == '' || item.value == family_class_name) {        
          result.push({id:item.code, value:item.name});        
        }
      }
    })    
    this.setState({family_code_options:result}, () => {
      this.original = JSON.stringify(this.state);
    })
  }

  componentDidUpdate () {
    this.changeBackground();
  }

  changeBackground = () => {
    if (this.state.relation == "" || this.state.relation == 0) {
      addRequiredBg("relation_id");
    } else {
      removeRequiredBg("relation_id");
    }
    if (this.state.age == "") {
      addRequiredBg("age_id");
    } else {
      removeRequiredBg("age_id");
    }
  }

  closeModal = () => {
    if (JSON.stringify(this.state) != this.original) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  };

  getTopColor = (e) => {
    var top_bar = document.getElementsByClassName('top-bar')[0];
    switch(parseInt(e.target.value)){
      case 0:
        top_bar.style.backgroundColor ='transparent';
        break;
      case 1:
        top_bar.style.backgroundColor ='cornflowerblue';
        break;
      case 2:
        top_bar.style.backgroundColor ='lightsalmon';
        break;        
      case 3:
        top_bar.style.backgroundColor ='yellow';
        break;
      case 4:
        top_bar.style.backgroundColor ='mediumaquamarine';
        break;        
      case 5:
        top_bar.style.backgroundColor ='lightpink';
        break;
    }    
    this.setState({ parents_color: e.target.value });
    this.forceUpdate();
  };

  getBottomColor = (e) => {
    var bottom_bar = document.getElementsByClassName('bottom-bar')[0];
    switch(parseInt(e.target.value)){
      case 0:
        bottom_bar.style.backgroundColor ='transparent';
        break;
      case 1:
        bottom_bar.style.backgroundColor ='cornflowerblue';
        break;
      case 2:
        bottom_bar.style.backgroundColor ='lightsalmon';
        break;        
      case 3:
        bottom_bar.style.backgroundColor ='yellow';
        break;
      case 4:
        bottom_bar.style.backgroundColor ='mediumaquamarine';
        break;        
      case 5:
        bottom_bar.style.backgroundColor ='lightpink';
        break;
    }    
    this.setState({ children_color: e.target.value });
    this.forceUpdate();
  };

  getRelation = (e) => {
    this.setState({ relation: e.target.id });
  };

  getResidence = (e) => {
    this.setState({ is_living_together: e.target.id });
  };

  toHalfWidthOnlyNumber = (strVal) => {
    // 半角変換
    var halfVal = strVal.replace(/[０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    });

    return halfVal;
  };

  getAge = (e) => {
    let input_value = e.target.value.replace(/[^0-9０-９]/g, "");
    if (input_value != "") {
      input_value = parseInt(this.toHalfWidthOnlyNumber(input_value));
    }
    if (parseInt(input_value) < 0 || parseInt(input_value) > 999) return;
    this.setState({ age: input_value });
    // if (parseInt(e.target.value) <= 0 || parseInt(e.target.value) > 999) return;
    // this.setState({age: parseInt(e.target.value)})
  };

  getGender = (e) => {
    this.setState({ gender: e.target.value });
  };

  getLive = (e) => {
    this.setState({ is_alive: e.target.value });
  };
  getNote = (e) => {
    this.setState({ note: e.target.value });
  };
  register = () => {
    this.props.handleOk(this.state);
  };

  checkValidation () {
    removeRedBorder('relation_id');
    removeRedBorder('age_id');
    removeRedBorder('note_id');
    let error_str_arr = [];
    let error_arr = [];
    if (this.state.relation == "" || this.state.relation == 0) {
      error_str_arr.push(this.dial_family_validate.relation.requierd_message);
      error_arr.push({
        state_key: 'relation_id',
        error_msg: this.dial_family_validate.relation.requierd_message,
        error_type: 'blank',
        tag_id:'relation_id'
      });
      addRedBorder('relation_id')
    }
    if (this.state.age == ''){
      error_str_arr.push(this.dial_family_validate.age.requierd_message);
      error_arr.push({
        state_key: 'age_id',
        error_msg: this.dial_family_validate.age.requierd_message,
        error_type: 'blank',
        tag_id:'age_id'
      });
      addRedBorder('age_id')
    }
    var age = parseInt(this.state.age);    
    if (!(age >= 0 && age < 1000)) {
      error_str_arr.push(this.dial_family_validate.age.overflow_message);
      error_arr.push({
        state_key: 'age_id',
        error_msg: this.dial_family_validate.age.overflow_message,
        error_type: 'blank',
        tag_id:'age_id'
      });
      addRedBorder('age_id')
    }
    if (this.state.note != undefined && this.state.note != null && this.state.note != "" && this.state.note.length > 7) {
      error_str_arr.push(this.dial_family_validate.note.overflow_message);
      error_arr.push({
        state_key: 'note_id',
        error_msg: this.dial_family_validate.note.overflow_message,
        error_type: 'blank',
        tag_id:'note_id'
      });
      addRedBorder('note_id')
    }
    this.setState({error_arr});
    return error_str_arr;
  }
  handleOk = () => {
    var error = this.checkValidation();
    if (error.length > 0){
      this.setState({alert_message:error.join('\n')});        
      return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message:
        this.props.person_info !== null
          ? "家族歴情報を変更しますか?"
          : "家族歴情報を登録しますか?",
    });
  };

  closeConfirmModal = () => {
    this.confirmCancel();
    this.props.closeModal();
  };
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      confirm_message: "",
      alert_messages: "",
      confirm_alert_title:'',
    });
  }
  closeAlertModal = () => {
    this.setState({validate_message: ''});
    if(this.state.error_arr.length > 0){
      let first_obj = this.state.error_arr[0];
      $("#" + first_obj.tag_id).focus();
    }
  }

  onHide = () => {};

  render() {
    let tooltip = "";
    var age = parseInt(this.state.age);
    if (this.state.relation == "" || this.state.relation == 0) {
      tooltip = "続柄を選択してください。";
    } else if (!(age >= 0 && age < 1000)) {
      tooltip = "年齢を3桁以下の数字で入力してください。";
    } else if (
      this.state.note != undefined &&
      this.state.note != null &&
      this.state.note.length > 7
    ) {
      tooltip = "備考は全角7文字以内で入力してください。";
    }    
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal first-view-modal family-modal"
      >
        <Modal.Header>
          <Modal.Title>家族歴編集</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className='top-bar bar'></div>
            <div className="gender color">
              <RadioButton
                id="top-color-5"
                value={5}
                label=""
                name="parents_color"
                getUsage={this.getTopColor.bind(this)}
                className={
                  this.state.parents_color == 5 ? "selected color-5" : "color-5"
                }
                checked={false}
              />
              <RadioButton
                id="top-color-1"
                value={1}
                label=""
                name="parents_color"
                className={
                  this.state.parents_color == 1 ? "selected color-1" : "color-1"
                }
                getUsage={this.getTopColor.bind(this)}
                checked={false}
              />
              <RadioButton
                id="top-color-2"
                value={2}
                label=""
                name="parents_color"
                className={
                  this.state.parents_color == 2 ? "selected color-2" : "color-2"
                }
                getUsage={this.getTopColor.bind(this)}
                checked={false}
              />
              <RadioButton
                id="top-color-3"
                value={3}
                label=""
                name="parents_color"
                className={
                  this.state.parents_color == 3 ? "selected color-3" : "color-3"
                }
                getUsage={this.getTopColor.bind(this)}
                checked={false}
              />
              <RadioButton
                id="top-color-4"
                value={4}
                label=""
                name="parents_color"
                className={
                  this.state.parents_color == 4 ? "selected color-4" : "color-4"
                }
                getUsage={this.getTopColor.bind(this)}
                checked={false}
              />
              <RadioButton
                id="top-color-0"
                value={0}
                label="クリア"
                name="parents_color"
                className={
                  this.state.parents_color == 0
                    ? "selected color-clear"
                    : "color-clear"
                }
                getUsage={this.getTopColor.bind(this)}
                checked={false}
              />
            </div>
            <div className="flex">
              <SelectorWithLabel
                options={this.state.family_code_options}
                title="続柄"
                isDisabled={this.state.is_this_patient == 1 ? true : false}
                getSelect={this.getRelation.bind(this)}
                departmentEditCode={this.state.relation}
                id = 'relation_id'
              />
              <div className="residence">
                <SelectorWithLabel
                  options={residence_list}
                  title=""
                  className="residence"
                  isDisabled={this.state.is_this_patient == 1 ? true : false}
                  getSelect={this.getResidence.bind(this)}
                  departmentEditCode={this.state.is_living_together}
                />
              </div>
            </div>
            <div className="hankaku-eng-num-input">
              <InputWithLabelBorder
                label="年齢"
                type="text"
                getInputText={this.getAge.bind(this)}
                isDisabled={this.state.is_this_patient == 1 ? true : false}
                diseaseEditData={this.state.age}
                id = 'age_id'
              />
            </div>
            <div className="gender">
              <label className="mr-2 gender-label">性別</label>
              <RadioButton
                id="male"
                value={1}
                label="男性"
                name="gender"
                isDisabled={this.state.is_this_patient == 1 ? true : false}
                getUsage={this.getGender.bind(this)}
                checked={this.state.gender == 1 ? true : false}
              />
              <RadioButton
                id="female"
                value={2}
                label="女性"
                name="gender"
                isDisabled={this.state.is_this_patient == 1 ? true : false}
                getUsage={this.getGender.bind(this)}
                checked={this.state.gender == 2 ? true : false}
              />
              <RadioButton
                id="non-gender"
                value={0}
                label="不明"
                name="gender"
                isDisabled={this.state.is_this_patient == 1 ? true : false}
                getUsage={this.getGender.bind(this)}
                checked={this.state.gender == 0 ? true : false}
              />
            </div>
            <div className="gender">
              <label className="mr-2 gender-label">生存</label>
              <RadioButton
                id="live"
                value={1}
                label="生存"
                name="live"
                isDisabled={this.state.is_this_patient == 1 ? true : false}
                getUsage={this.getLive.bind(this)}
                checked={this.state.is_alive == 1 ? true : false}
              />
              <RadioButton
                id="dead"
                value={0}
                label="死亡"
                name="live"
                isDisabled={this.state.is_this_patient == 1 ? true : false}
                getUsage={this.getLive.bind(this)}
                checked={this.state.is_alive == 0 ? true : false}
              />
            </div>
            <InputWithLabelBorder
              label="備考"
              type="text"
              className="note-area"
              getInputText={this.getNote.bind(this)}
              diseaseEditData={this.state.note}
              id = 'note_id'
            />

            <div className="gender color">
              <RadioButton
                id="bottom-color-5"
                value={5}
                label=""
                name="children_color"
                className={
                  this.state.children_color == 5
                    ? "selected color-5"
                    : "color-5"
                }
                getUsage={this.getBottomColor.bind(this)}
                checked={false}
              />
              <RadioButton
                id="bottom-color-1"
                value={1}
                label=""
                name="children_color"
                className={
                  this.state.children_color == 1
                    ? "selected color-1"
                    : "color-1"
                }
                getUsage={this.getBottomColor.bind(this)}
                checked={false}
              />
              <RadioButton
                id="bottom-color-2"
                value={2}
                label=""
                name="children_color"
                className={
                  this.state.children_color == 2
                    ? "selected color-2"
                    : "color-2"
                }
                getUsage={this.getBottomColor.bind(this)}
                checked={false}
              />
              <RadioButton
                id="bottom-color-3"
                value={3}
                label=""
                name="children_color"
                className={
                  this.state.children_color == 3
                    ? "selected color-3"
                    : "color-3"
                }
                getUsage={this.getBottomColor.bind(this)}
                checked={false}
              />
              <RadioButton
                id="bottom-color-4"
                value={4}
                label=""
                name="children_color"
                className={
                  this.state.children_color == 4
                    ? "selected color-4"
                    : "color-4"
                }
                getUsage={this.getBottomColor.bind(this)}
                checked={false}
              />
              <RadioButton
                id="bottom-color-0"
                value={0}
                label="クリア"
                name="children_color"
                className={
                  this.state.children_color == 0
                    ? "selected color-clear"
                    : "color-clear"
                }
                getUsage={this.getBottomColor.bind(this)}
                checked={false}
              />
            </div>
            <div className='bottom-bar bar'></div>
            <div className="footer-buttons">
              <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
                <Button
                  onClick={this.handleOk}
                  tooltip={tooltip}
                  className={tooltip != "" ? "disable-btn" : "red-btn"}
                >
                  {this.props.person_info !== null ? "変更" : "登録"}
                </Button>
            </div>
          </Wrapper>
        </Modal.Body>
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.register.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isBackConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.closeConfirmModal}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.validate_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.validate_message}
          />
        )}
      </Modal>
    );
  }
}

FamilyModal.contextType = Context;

FamilyModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  person_info: PropTypes.object,
  row_index: PropTypes.number,
  col_index: PropTypes.number,
  familyMasterData: PropTypes.array,
  family_codes: PropTypes.object,
  family_code_options: PropTypes.object,
  system_patient_id: PropTypes.number,
};

export default FamilyModal;
