import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import RadioButton from "~/components/molecules/RadioInlineButton";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { masterValidate } from "~/helpers/validate";
import {
  removeRedBorder,
  // addRequiredBg,
  // removeRequiredBg,
} from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 100%;
  float: left;
  label {
      text-align: right;
      width: 120px;
      margin-top: 5px;
  }
  input {
    width: 400px;
    font-size: 12px;
  }
    .react-datepicker-wrapper {
        width: 100%;
       .react-datepicker__input-container {
           width: 100%;
           input {
                font-size: 14px;
                width: 100%;
                height: 38px;
                border-radius: 4px;
                border-width: 1px;
                border-style: solid;
                border-color: rgb(206, 212, 218);
                border-image: initial;
                padding: 0px 8px;
           }
       } 
    }
  }
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .add-button {
      text-align: center;
  }
  .checkbox_area {
    padding-left: 15px;
    label{
      font-size: 15px;
      margin-left: 100px;
      width:auto;
    }
  }
  .pattern_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;
    margin-left: -20px;
    label {
      width: 140px;
    }
  }
  .kana_area {
    padding-top: 10px;
  }
  .name_area {
    padding-top: 20px;
  }
  .gender {
    font-size: 12px;
    margin-top: 10px;
    margin-left: 15px;
    margin-bottom: 10px;
    .gender-label {
      width: 100px;
      margin-top: 8px;
      float: left;
  }
    .radio-btn label{
        width: 75px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin: 0 5px;
        padding: 4px 5px;
    }
  }
  .footer {
    display: flex;
    margin-left: 45%;
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
    .unit-button {
          text-align: center;
          border-radius: 4px;
          background: #ddd;
          border: solid 1px #aaa;
          height: 30px;
          margin: 8px 0 0 10px;
    }
    .flex {
      display: flex;
      flex-wrap: wrap;
      button {
        background-color: rgb(208, 213, 214);
      }
    }
 `;

class ImageGenreModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.state = {            
      is_enabled: modal_data !== null?modal_data.is_enabled:1,
      number: modal_data !== null ? modal_data.number : 0,            
      name:modal_data !== null?modal_data.name:"",
      name_kana:modal_data !== null?modal_data.name_kana:"",
      name_short:modal_data !== null?modal_data.name_short:"",      
      category:modal_data !== null?this.props.usage_item.indexOf(modal_data.category):0,
      destination:modal_data !== null?modal_data.destination:'',
      reference:modal_data !== null?modal_data.reference:"",
      is_delete_imported_original_file:modal_data !== null?modal_data.is_delete_imported_original_file:0,      
      is_va_record:modal_data !== null?modal_data.is_va_record:0,

      isUpdateConfirmModal:false,
      isCloseConfirmModal:false,
      confirm_message:'',
      alert_message:''
    };
    this.change_flag = false;
    this.double_click=false;
  }
  componentDidMount(){
    this.changeBackground();
  }

  componentDidUpdate() {
    this.changeBackground();
  }

  changeBackground = () => {
    masterValidate("image_genre_master", this.state, 'background');    
  };

  confirmCancel() {
    this.setState({
      confirm_message:'',
      isUpdateConfirmModal:false,
      isCloseConfirmModal:false,
    })
  }
  closeThisModal = () => {
    this.confirmCancel();
    this.props.closeModal();
    this.change_flag = false;
  };

  getCheckBox = (name, value) => {
    this.change_flag = true;
    this.setState({[name]:value})
  };

  getName = e => {
    this.change_flag = true;
    this.setState({name: e.target.value})
  };

  getKanaName = e => {
    this.change_flag = true;
    this.setState({name_kana: e.target.value})
  };

  getShortName = e => {
    this.change_flag = true;
    this.setState({name_short: e.target.value})
  };

  getCategory = e => {
    this.change_flag = true;
    this.setState({category: e.target.value})
  };
  getDeleteCheck = e => {
    this.change_flag = true;
    this.setState({is_delete_imported_original_file: e.target.value})
  }
  getDestination = e => {
    this.change_flag = true;
    this.setState({destination: e.target.value})
  };
  
  getReference = e => {
    this.change_flag = true;
    this.setState({reference: e.target.value})
  };

  async registerImage()  {
    this.confirmCancel();
    let path = "/app/api/v2/dial/master/image_register";
    const post_data = {
        params: this.state
    };      
    post_data.params.category = this.props.usage_item[this.state.category];
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient.post(path, post_data).finally(()=>{
      this.props.closeModal();
      if (this.props.modal_data == null){
        window.sessionStorage.setItem("alert_messages",  "登録完了##" + "登録しました。");
      } else {
        window.sessionStorage.setItem("alert_messages",  "編集完了##" + "編集しました。");
      }
      this.double_click=false;
      this.change_flag = false;
    });    
    this.props.handleOk();
  }
  checkValidation = () => {    
    removeRedBorder("name_id");
    removeRedBorder("name_kana_id");
    removeRedBorder("name_short_id");
    let error_str_arr = [];
    let validate_data = masterValidate("image_genre_master", this.state);

    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != "") {
      this.setState({ first_tag_id: validate_data.first_tag_id });
    }
    return error_str_arr;
  };
  
  saveImage = () => {
    if (this.change_flag == false) return;
    var error = this.checkValidation();
    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }

    if (this.props.modal_data !== null) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "登録しますか?",
      });
    }
  }
  closeAlertModal = () => {
    this.setState({ alert_message: "" });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };

  onHide=()=>{}

  render() {    
    return  (
      <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal image_genre-modal">
        <Modal.Header >
          <Modal.Title>画像ジャンル編集</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Wrapper>
                <div className="checkbox_area">
                  <Checkbox
                    label="常に表示"
                    getRadio={this.getCheckBox.bind(this)}
                    value={this.state.is_enabled}
                    checked
                    name="is_enabled"
                  />
                  <Checkbox
                    label="VA画像履歴の表示対象"
                    getRadio={this.getCheckBox.bind(this)}
                    value={this.state.is_va_record}
                    checked
                    name="is_va_record"
                  />
                </div>
                <div className="pattern_code">
                    <InputWithLabelBorder
                        label="ジャンル名称"
                        type="text"
                        getInputText={this.getName.bind(this)}
                        diseaseEditData={this.state.name}
                        id = "name_id"
                    />
                </div>
                <InputWithLabelBorder
                    label="カナ名称"
                    type="text"
                    className="name-area"
                    getInputText={this.getKanaName.bind(this)}
                    diseaseEditData={this.state.name_kana}
                    id="name_kana_id"
                />
                <InputWithLabelBorder
                    label="略称"
                    type="text"
                    className="name-area"
                    getInputText={this.getShortName.bind(this)}
                    diseaseEditData={this.state.name_short}
                    id = "name_short_id"
                />
                <div className="gender">
                  <label className="mr-2 gender-label">区分</label>
                  <RadioButton
                      id="image"
                      value={0}
                      label="画像"
                      name="gender"
                      getUsage={this.getCategory}
                      checked={this.state.category == 0 ? true : false}
                  />
                  <RadioButton
                      id="doc"
                      value={1}
                      label="書類"
                      name="gender"
                      getUsage={this.getCategory}
                      checked={this.state.category == 1 ? true : false}
                  />
                </div>
                {/* <InputWithLabelBorder
                    label="保存先"
                    type="text"
                    className="kana_area"
                    getInputText={this.getDestination.bind(this)}
                    diseaseEditData={this.state.destination}
                /> */}
                {/* <div className="flex">
                  <InputWithLabelBorder
                      label="参照先"
                      type="text"
                      getInputText={this.getReference.bind(this)}
                      diseaseEditData={this.state.reference}
                  />
                  <Button className="unit-button">参照</Button>
                </div> */}
                    
                {/* <div className="gender">
                  <label className="mr-2 gender-label">取込剤</label>
                    <RadioButton
                        id="leave"
                        value={0}
                        label="残す"
                        name="dial"
                        getUsage={this.getDeleteCheck}
                        checked={this.state.is_delete_imported_original_file == 0 ? true : false}
                    />
                    <RadioButton
                        id="delete"
                        value={1}
                        label="削除"
                        name="dial"
                        getUsage={this.getDeleteCheck}
                        checked={this.state.is_delete_imported_original_file == 1 ? true : false}
                    />
                </div> */}
                <div className="footer-buttons">
                  <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                    <Button className={this.change_flag?"red-btn":'disable-btn'}  onClick={this.saveImage}>{this.props.modal_data==null?'登録':'変更'}</Button>
                </div>
            </Wrapper>
            {this.state.isUpdateConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.registerImage.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.isCloseConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.closeThisModal.bind(this)}
                confirmTitle={this.state.confirm_message}
                title={this.state.confirm_alert_title}
              />
            )}
            {this.state.alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
        </Modal.Body>        
      </Modal>
    );
  }
}

ImageGenreModal.contextType = Context;

ImageGenreModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  usage_item:PropTypes.array,
  modal_data:PropTypes.object
};

export default ImageGenreModal;
