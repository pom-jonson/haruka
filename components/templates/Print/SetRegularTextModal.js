import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import TextareaAutosize from 'react-textarea-autosize';
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import { printValidate } from "~/helpers/validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import {removeRedBorder} from "~/helpers/dialConstants";
import $ from 'jquery';
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as apiClient from "~/api/apiClient";

const Wrapper = styled.div`
  width: 100%;
  overflow-y: auto;
  height: 100%;
  display: flex;
  .flex {display: flex;}
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  font-size:1rem;
  .left-area, .right-area {
    width:38vw;
    height:100%;
    margin-right:1rem;
  }
  .regular-area {
    width:100%;
    .regular-title {
      
    }
    .regular-btn {
      div {margin-top:0;}
      .label-title {display: none;}
      input {
        height: 2rem;
        font-size:1rem;
        width:11rem;
        border: 1px solid rgb(118, 118, 118);
        border-radius: 0;
      }
    }
    .regular-text {
      width:100%;
      margin-top: -1px;
      textarea {
        width:100%;
        overflow: hidden;
        margin-bottom:0.5rem;
      }
    }
  }
`;

class SetRegularTextModal extends Component {
  constructor(props) {
    super(props);
    if(props.modal_type == "medical_info_doc"){
      let disease_name_text = "";
      let introduction_purpose1_btn = "";
      let introduction_purpose1_text = "";
      let introduction_purpose2_btn = "";
      let introduction_purpose2_text = "";
      let introduction_purpose3_btn = "";
      let introduction_purpose3_text = "";
      let introduction_purpose4_btn = "";
      let introduction_purpose4_text = "";
      let family_history_text = "";
      let inspection_result_text = "";
      let course_treatment_text = "";
      let cur_prescription_text = "";
      let remark_text = "";
      if(props.modal_data.length > 0){
        props.modal_data.map(item=>{
          if(item.label == "傷病名"){
            disease_name_text = item.body;
          }
          if(item.label == "紹介目的"){
            if(introduction_purpose1_btn == ""){
              introduction_purpose1_btn = item.title;
              introduction_purpose1_text = item.body;
            } else if(introduction_purpose2_btn == ""){
              introduction_purpose2_btn = item.title;
              introduction_purpose2_text = item.body;
            } else if(introduction_purpose3_btn == ""){
              introduction_purpose3_btn = item.title;
              introduction_purpose3_text = item.body;
            } else if(introduction_purpose4_btn == ""){
              introduction_purpose4_btn = item.title;
              introduction_purpose4_text = item.body;
            }
          }
          if(item.label == "既往歴・家族歴"){
            family_history_text = item.body;
          }
          if(item.label == "症状経過・検査結果"){
            inspection_result_text = item.body;
          }
          if(item.label == "治療経過"){
            course_treatment_text = item.body;
          }
          if(item.label == "現在の処方"){
            cur_prescription_text = item.body;
          }
          if(item.label == "備考"){
            remark_text = item.body;
          }
        })
      }
      this.state = {
        disease_name_text,
        introduction_purpose1_btn,
        introduction_purpose1_text,
        introduction_purpose2_btn,
        introduction_purpose2_text,
        introduction_purpose3_btn,
        introduction_purpose3_text,
        introduction_purpose4_btn,
        introduction_purpose4_text,
        family_history_text,
        inspection_result_text,
        course_treatment_text,
        cur_prescription_text,
        remark_text,
        alert_messages:"",
        check_message:"",
        confirm_alert_title:"",
        confirm_message:"",
        confirm_type:"",
      };
    } else {
      let greeting1_btn = "";
      let greeting1_text = "";
      let greeting2_btn = "";
      let greeting2_text = "";
      let note1_btn = "";
      let note1_text = "";
      let note2_btn = "";
      let note2_text = "";
      let note3_btn = "";
      let note3_text = "";
      let note4_btn = "";
      let note4_text = "";
      if(props.modal_data.length > 0){
        props.modal_data.map(item=>{
          if(item.label == "あいさつ文"){
            if(greeting1_btn == ""){
              greeting1_btn = item.title;
              greeting1_text = item.body;
            } else if(greeting2_btn == ""){
              greeting2_btn = item.title;
              greeting2_text = item.body;
            }
          }
          if(item.label == "＜記＞"){
            if(note1_btn == ""){
              note1_btn = item.title;
              note1_text = item.body;
            } else if(note2_btn == ""){
              note2_btn = item.title;
              note2_text = item.body;
            } else if(note3_btn == ""){
              note3_btn = item.title;
              note3_text = item.body;
            } else if(note4_btn == ""){
              note4_btn = item.title;
              note4_text = item.body;
            }
          }
        })
      }
      this.state = {
        greeting1_btn,
        greeting1_text,
        greeting2_btn,
        greeting2_text,
        note1_btn,
        note1_text,
        note2_btn,
        note2_text,
        note3_btn,
        note3_text,
        note4_btn,
        note4_text,
        alert_messages:"",
        check_message:"",
        confirm_alert_title:"",
        confirm_message:"",
        confirm_type:"",
      };
    }
    this.change_flag = 0;
  }

  setValue = (key,e) => {
    this.change_flag = 1;
    this.setState({[key]: e.target.value});
  }

  componentDidUpdate () {
    this.changeBackground();
  }

  changeBackground = () => {
  }

  clearRedStyle = () => {
    if(this.props.modal_type == "medical_info_doc"){
      removeRedBorder('disease_name_text_id');
      removeRedBorder('introduction_purpose1_btn_id');
      removeRedBorder('introduction_purpose1_text_id');
      removeRedBorder('introduction_purpose2_btn_id');
      removeRedBorder('introduction_purpose2_text_id');
      removeRedBorder('introduction_purpose3_btn_id');
      removeRedBorder('introduction_purpose3_text_id');
      removeRedBorder('introduction_purpose4_btn_id');
      removeRedBorder('introduction_purpose4_text_id');
      removeRedBorder('family_history_text_id');
      removeRedBorder('inspection_result_text_id');
      removeRedBorder('course_treatment_text_id');
      removeRedBorder('cur_prescription_text_id');
      removeRedBorder('remark_text_id');
    } else {
      removeRedBorder('greeting1_btn_id');
      removeRedBorder('greeting1_text_id');
      removeRedBorder('greeting2_btn_id');
      removeRedBorder('greeting2_text_id');
      removeRedBorder('note1_btn_id');
      removeRedBorder('note1_text_id');
      removeRedBorder('note2_btn_id');
      removeRedBorder('note2_text_id');
      removeRedBorder('note3_btn_id');
      removeRedBorder('note3_text_id');
      removeRedBorder('note4_btn_id');
      removeRedBorder('note4_text_id');
    }
  }

  checkValidation = () => {
    this.clearRedStyle();
    let error_str_arr = [];
    let cur_state = JSON.parse(JSON.stringify(this.state));
    if(this.props.modal_type == "medical_info_doc"){
      if(cur_state.introduction_purpose1_btn == "" && cur_state.introduction_purpose1_text == ""){
        cur_state.introduction_purpose1_btn = " ";
        cur_state.introduction_purpose1_text = " ";
      }
      if(cur_state.introduction_purpose2_btn == "" && cur_state.introduction_purpose2_text == ""){
        cur_state.introduction_purpose2_btn = " ";
        cur_state.introduction_purpose2_text = " ";
      }
      if(cur_state.introduction_purpose3_btn == "" && cur_state.introduction_purpose3_text == ""){
        cur_state.introduction_purpose3_btn = " ";
        cur_state.introduction_purpose3_text = " ";
      }
      if(cur_state.introduction_purpose4_btn == "" && cur_state.introduction_purpose4_text == ""){
        cur_state.introduction_purpose4_btn = " ";
        cur_state.introduction_purpose4_text = " ";
      }
    } else {
      if(cur_state.greeting1_btn == "" && cur_state.greeting1_text == ""){
        cur_state.greeting1_btn = " ";
        cur_state.greeting1_text = " ";
      }
      if(cur_state.greeting2_btn == "" && cur_state.greeting2_text == ""){
        cur_state.greeting2_btn = " ";
        cur_state.greeting2_text = " ";
      }
      if(cur_state.note1_btn == "" && cur_state.note1_text == ""){
        cur_state.note1_btn = " ";
        cur_state.note1_text = " ";
      }
      if(cur_state.note2_btn == "" && cur_state.note2_text == ""){
        cur_state.note2_btn = " ";
        cur_state.note2_text = " ";
      }
      if(cur_state.note3_btn == "" && cur_state.note3_text == ""){
        cur_state.note3_btn = " ";
        cur_state.note3_text = " ";
      }
      if(cur_state.note4_btn == "" && cur_state.note4_text == ""){
        cur_state.note4_btn = " ";
        cur_state.note4_text = " ";
      }
    }
    let validate_data = printValidate(this.props.modal_type+'_set_regular', cur_state);
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != '') {
      this.setState({first_tag_id: validate_data.first_tag_id});
    }
    return error_str_arr;
  }

  closeAlertModal = () => {
    this.setState({check_message: ''});
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus();
    }
  }

  confirmRegister=()=>{
    if(this.change_flag == 0){
      return;
    }
    let error_str_array = this.checkValidation();
    if (error_str_array.length > 0 ) {
      this.setState({check_message:error_str_array.join('\n')});
      return;
    }
    this.setState({
      confirm_message:"登録しますか？",
      confirm_type:"register",
      confirm_alert_title:"登録確認"
    });
  }

  confirmOk=()=>{
    if(this.state.confirm_type == "register"){
      this.register();
    } else if (this.state.confirm_type == "close") {
      this.props.closeModal();
    }
  }

  register=async()=>{
    let path = "/app/api/v2/dial/master/register_regular_text";
    let post_data = {};
    post_data.regular = [];
    if(this.props.modal_type == "medical_info_doc"){
      post_data.page = "診療情報提供書";
      if(this.state.disease_name_text != ""){
        let regular = {};
        regular['label'] = "傷病名";
        regular['title'] = "定型文";
        regular['body'] = this.state.disease_name_text;
        post_data.regular.push(regular);
      }
      if(this.state.introduction_purpose1_btn != ""){
        let regular = {};
        regular['label'] = "紹介目的";
        regular['title'] = this.state.introduction_purpose1_btn;
        regular['body'] = this.state.introduction_purpose1_text;
        post_data.regular.push(regular);
      }
      if(this.state.introduction_purpose2_btn != ""){
        let regular = {};
        regular['label'] = "紹介目的";
        regular['title'] = this.state.introduction_purpose2_btn;
        regular['body'] = this.state.introduction_purpose2_text;
        post_data.regular.push(regular);
      }
      if(this.state.introduction_purpose3_btn != ""){
        let regular = {};
        regular['label'] = "紹介目的";
        regular['title'] = this.state.introduction_purpose3_btn;
        regular['body'] = this.state.introduction_purpose3_text;
        post_data.regular.push(regular);
      }
      if(this.state.introduction_purpose4_btn != ""){
        let regular = {};
        regular['label'] = "紹介目的";
        regular['title'] = this.state.introduction_purpose4_btn;
        regular['body'] = this.state.introduction_purpose4_text;
        post_data.regular.push(regular);
      }
      if(this.state.family_history_text != ""){
        let regular = {};
        regular['label'] = "既往歴・家族歴";
        regular['title'] = "定型文";
        regular['body'] = this.state.family_history_text;
        post_data.regular.push(regular);
      }
      if(this.state.inspection_result_text != ""){
        let regular = {};
        regular['label'] = "症状経過・検査結果";
        regular['title'] = "定型文";
        regular['body'] = this.state.inspection_result_text;
        post_data.regular.push(regular);
      }
      if(this.state.course_treatment_text != ""){
        let regular = {};
        regular['label'] = "治療経過";
        regular['title'] = "定型文";
        regular['body'] = this.state.course_treatment_text;
        post_data.regular.push(regular);
      }
      if(this.state.cur_prescription_text != ""){
        let regular = {};
        regular['label'] = "現在の処方";
        regular['title'] = "定型文";
        regular['body'] = this.state.cur_prescription_text;
        post_data.regular.push(regular);
      }
      if(this.state.remark_text != ""){
        let regular = {};
        regular['label'] = "備考";
        regular['title'] = "定型文";
        regular['body'] = this.state.remark_text;
        post_data.regular.push(regular);
      }
    } else {
      post_data.page = "紹介状";
      if(this.state.greeting1_btn != ""){
        let regular = {};
        regular['label'] = "あいさつ文";
        regular['title'] = this.state.greeting1_btn;
        regular['body'] = this.state.greeting1_text;
        post_data.regular.push(regular);
      }
      if(this.state.greeting2_btn != ""){
        let regular = {};
        regular['label'] = "あいさつ文";
        regular['title'] = this.state.greeting2_btn;
        regular['body'] = this.state.greeting2_text;
        post_data.regular.push(regular);
      }
      if(this.state.note1_btn != ""){
        let regular = {};
        regular['label'] = "＜記＞";
        regular['title'] = this.state.note1_btn;
        regular['body'] = this.state.note1_text;
        post_data.regular.push(regular);
      }
      if(this.state.note2_btn != ""){
        let regular = {};
        regular['label'] = "＜記＞";
        regular['title'] = this.state.note2_btn;
        regular['body'] = this.state.note2_text;
        post_data.regular.push(regular);
      }
      if(this.state.note3_btn != ""){
        let regular = {};
        regular['label'] = "＜記＞";
        regular['title'] = this.state.note3_btn;
        regular['body'] = this.state.note3_text;
        post_data.regular.push(regular);
      }
      if(this.state.note4_btn != ""){
        let regular = {};
        regular['label'] = "＜記＞";
        regular['title'] = this.state.note4_btn;
        regular['body'] = this.state.note4_text;
        post_data.regular.push(regular);
      }
    }
    await apiClient
      .post(path, {
        params: post_data,
      })
      .then((res) => {
        window.sessionStorage.setItem("alert_messages", res.alert_message);
        this.props.closeModal('edit_regular');
      })
      .catch(() => {});
  }

  closeModal=()=>{
    this.setState({
      alert_messages:"",
      confirm_alert_title:"",
      confirm_message:"",
      confirm_type:"",
    });
  };

  closeCurModal=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"close",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  }

  render() {
    return (
      <>
        <Modal show={true} className="master-modal set-regular-text-modal first-view-modal">
          <Modal.Header><Modal.Title>定型文設定 {this.props.modal_type == "medical_info_doc" ? "診療情報提供書" : "紹介状"}</Modal.Title></Modal.Header>
          <Modal.Body>
            {this.props.modal_type == "medical_info_doc" && (
              <Wrapper>
                <div className={'left-area'}>
                  <div className={'regular-area'}>
                    <div className={'regular-title'}>傷病名</div>
                    <div className={'regular-text'}>
                      <TextareaAutosize
                        id="disease_name_text_id"
                        onChange={this.setValue.bind(this,"disease_name_text")}
                        value={this.state.disease_name_text}
                        minRows={3}
                      />
                    </div>
                  </div>
                  <div className={'regular-area'}>
                    <div className={'regular-title'}>紹介目的（ボタン名／文章）</div>
                    <div className={'regular-btn'}>
                      <InputWithLabelBorder
                        label=""
                        type="text"
                        id={'introduction_purpose1_btn_id'}
                        getInputText={this.setValue.bind(this, "introduction_purpose1_btn")}
                        diseaseEditData={this.state.introduction_purpose1_btn}
                      />
                    </div>
                    <div className={'regular-text'}>
                      <TextareaAutosize
                        id="introduction_purpose1_text_id"
                        onChange={this.setValue.bind(this,"introduction_purpose1_text")}
                        value={this.state.introduction_purpose1_text}
                        minRows={3}
                      />
                    </div>
                  </div>
                  <div className={'regular-area'}>
                    <div className={'regular-btn'}>
                      <InputWithLabelBorder
                        label=""
                        type="text"
                        id={'introduction_purpose2_btn_id'}
                        getInputText={this.setValue.bind(this, "introduction_purpose2_btn")}
                        diseaseEditData={this.state.introduction_purpose2_btn}
                      />
                    </div>
                    <div className={'regular-text'}>
                      <TextareaAutosize
                        id="introduction_purpose2_text_id"
                        onChange={this.setValue.bind(this,"introduction_purpose2_text")}
                        value={this.state.introduction_purpose2_text}
                        minRows={3}
                      />
                    </div>
                  </div>
                  <div className={'regular-area'}>
                    <div className={'regular-btn'}>
                      <InputWithLabelBorder
                        label=""
                        type="text"
                        id={'introduction_purpose3_btn_id'}
                        getInputText={this.setValue.bind(this, "introduction_purpose3_btn")}
                        diseaseEditData={this.state.introduction_purpose3_btn}
                      />
                    </div>
                    <div className={'regular-text'}>
                      <TextareaAutosize
                        id="introduction_purpose3_text_id"
                        onChange={this.setValue.bind(this,"introduction_purpose3_text")}
                        value={this.state.introduction_purpose3_text}
                        minRows={3}
                      />
                    </div>
                  </div>
                  <div className={'regular-area'}>
                    <div className={'regular-btn'}>
                      <InputWithLabelBorder
                        label=""
                        type="text"
                        id={'introduction_purpose4_btn_id'}
                        getInputText={this.setValue.bind(this, "introduction_purpose4_btn")}
                        diseaseEditData={this.state.introduction_purpose4_btn}
                      />
                    </div>
                    <div className={'regular-text'}>
                      <TextareaAutosize
                        id="introduction_purpose4_text_id"
                        onChange={this.setValue.bind(this,"introduction_purpose4_text")}
                        value={this.state.introduction_purpose4_text}
                        minRows={3}
                      />
                    </div>
                  </div>
                </div>
                <div className={'right-area'}>
                  <div className={'regular-area'}>
                    <div className={'regular-title'}>既往歴 及び 家族歴</div>
                    <div className={'regular-text'}>
                      <TextareaAutosize
                        id="family_history_text_id"
                        onChange={this.setValue.bind(this,"family_history_text")}
                        value={this.state.family_history_text}
                        minRows={3}
                      />
                    </div>
                  </div>
                  <div className={'regular-area'}>
                    <div className={'regular-title'}>症状経過 及び 検査結果</div>
                    <div className={'regular-text'}>
                      <TextareaAutosize
                        id="inspection_result_text_id"
                        onChange={this.setValue.bind(this,"inspection_result_text")}
                        value={this.state.inspection_result_text}
                        minRows={3}
                      />
                    </div>
                  </div>
                  <div className={'regular-area'}>
                    <div className={'regular-title'}>治療経過</div>
                    <div className={'regular-text'}>
                      <TextareaAutosize
                        id="course_treatment_text_id"
                        onChange={this.setValue.bind(this,"course_treatment_text")}
                        value={this.state.course_treatment_text}
                        minRows={3}
                      />
                    </div>
                  </div>
                  <div className={'regular-area'}>
                    <div className={'regular-title'}>現在の処方</div>
                    <div className={'regular-text'}>
                      <TextareaAutosize
                        id="cur_prescription_text_id"
                        onChange={this.setValue.bind(this,"cur_prescription_text")}
                        value={this.state.cur_prescription_text}
                        minRows={3}
                      />
                    </div>
                  </div>
                  <div className={'regular-area'}>
                    <div className={'regular-title'}>備考</div>
                    <div className={'regular-text'}>
                      <TextareaAutosize
                        id="remark_text_id"
                        onChange={this.setValue.bind(this,"remark_text")}
                        value={this.state.remark_text}
                        minRows={3}
                      />
                    </div>
                  </div>
                </div>
              </Wrapper>
            )}
            {this.props.modal_type == "intro_letter" && (
              <Wrapper>
                <div className={'left-area'}>
                  <div className={'regular-area'}>
                    <div className={'regular-title'}>あいさつ文（ボタン名／文章）</div>
                    <div className={'regular-btn'}>
                      <InputWithLabelBorder
                        label=""
                        type="text"
                        id={'greeting1_btn_id'}
                        getInputText={this.setValue.bind(this, "greeting1_btn")}
                        diseaseEditData={this.state.greeting1_btn}
                      />
                    </div>
                    <div className={'regular-text'}>
                      <TextareaAutosize
                        id="greeting1_text_id"
                        onChange={this.setValue.bind(this,"greeting1_text")}
                        value={this.state.greeting1_text}
                        minRows={3}
                      />
                    </div>
                  </div>
                  <div className={'regular-area'}>
                    <div className={'regular-btn'}>
                      <InputWithLabelBorder
                        label=""
                        type="text"
                        id={'greeting2_btn_id'}
                        getInputText={this.setValue.bind(this, "greeting2_btn")}
                        diseaseEditData={this.state.greeting2_btn}
                      />
                    </div>
                    <div className={'regular-text'}>
                      <TextareaAutosize
                        id="greeting2_text_id"
                        onChange={this.setValue.bind(this,"greeting2_text")}
                        value={this.state.greeting2_text}
                        minRows={3}
                      />
                    </div>
                  </div>
                </div>
                <div className={'right-area'}>
                  <div className={'regular-area'}>
                    <div className={'regular-title'}>＜記＞（ボタン名／文章）</div>
                    <div className={'regular-btn'}>
                      <InputWithLabelBorder
                        label=""
                        type="text"
                        id={'note1_btn_id'}
                        getInputText={this.setValue.bind(this, "note1_btn")}
                        diseaseEditData={this.state.note1_btn}
                      />
                    </div>
                    <div className={'regular-text'}>
                      <TextareaAutosize
                        id="note1_text_id"
                        onChange={this.setValue.bind(this,"note1_text")}
                        value={this.state.note1_text}
                        minRows={3}
                      />
                    </div>
                  </div>
                  <div className={'regular-area'}>
                    <div className={'regular-btn'}>
                      <InputWithLabelBorder
                        label=""
                        type="text"
                        id={'note2_btn_id'}
                        getInputText={this.setValue.bind(this, "note2_btn")}
                        diseaseEditData={this.state.note2_btn}
                      />
                    </div>
                    <div className={'regular-text'}>
                      <TextareaAutosize
                        id="note2_text_id"
                        onChange={this.setValue.bind(this,"note2_text")}
                        value={this.state.note2_text}
                        minRows={3}
                      />
                    </div>
                  </div>
                  <div className={'regular-area'}>
                    <div className={'regular-btn'}>
                      <InputWithLabelBorder
                        label=""
                        type="text"
                        id={'note3_btn_id'}
                        getInputText={this.setValue.bind(this, "note3_btn")}
                        diseaseEditData={this.state.note3_btn}
                      />
                    </div>
                    <div className={'regular-text'}>
                      <TextareaAutosize
                        id="note3_text_id"
                        onChange={this.setValue.bind(this,"note3_text")}
                        value={this.state.note3_text}
                        minRows={3}
                      />
                    </div>
                  </div>
                  <div className={'regular-area'}>
                    <div className={'regular-btn'}>
                      <InputWithLabelBorder
                        label=""
                        type="text"
                        id={'note4_btn_id'}
                        getInputText={this.setValue.bind(this, "note4_btn")}
                        diseaseEditData={this.state.note4_btn}
                      />
                    </div>
                    <div className={'regular-text'}>
                      <TextareaAutosize
                        id="note4_text_id"
                        onChange={this.setValue.bind(this,"note4_text")}
                        value={this.state.note4_text}
                        minRows={3}
                      />
                    </div>
                  </div>
                </div>
              </Wrapper>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button className={'cancel-btn'} onClick={this.closeCurModal}>キャンセル</Button>
            <Button className={this.change_flag == 1 ? 'red-btn' : 'disable-btn'} onClick={this.confirmRegister}>保存</Button>
          </Modal.Footer>
          {this.state.check_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.check_message}
            />
          )}
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
        </Modal>
      </>
    );
  }
}

SetRegularTextModal.contextType = Context;
SetRegularTextModal.propTypes = {
  closeModal: PropTypes.func,
  modal_data:PropTypes.array,
  modal_type:PropTypes.string,
};

export default SetRegularTextModal;
