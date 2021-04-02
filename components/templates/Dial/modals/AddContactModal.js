import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "../../../atoms/Button";
import Checkbox from "../../../molecules/Checkbox";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { getPatientValidate } from "~/components/templates/Dial/DialMethods";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import {getHalfLength} from "~/helpers/dialConstants"
import {addRedBorder, removeRedBorder, addRequiredBg, removeRequiredBg} from "~/helpers/dialConstants";
import $ from "jquery";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 0.9rem;
  width: 100%;
  height: 100%;
  padding: 1.25rem;
  label {
      text-align: right;
      width:6rem;
      font-size: 1rem;
      margin-top:0;
      margin-bottom:0;
      line-height:2.5rem;
  }
  input, select {
    height:2.5rem;
    width: calc(100% - 7rem);
  }
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .hankaku-eng-num-input {
      ime-mode: inactive;
      input{
        ime-mode: inactive;
      }
  }
  .add-button {
      text-align: center;
      padding-top: 50px;
      button {
        background: rgb(105, 200, 225); 
        margin-right: 10px;
        span {
            font-size: 20px;
            color: white !important;
        }
      }
  }
  .left_area {
    width: 50%;
  }
  .right_area {
    width: 50%;
  }
  .checkbox_area {
    padding-left: 1rem;
    label{
      font-size: 1rem;
      margin-left: 7.5rem;
      width: 15rem;
    }
    input {
      height: 1rem;
    }
  }
  .name_area {
    display: -webkit-flex; /* Safari */
    -webkit-flex-wrap: wrap; /* Safari 6.1+ */
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
  }
  .tel_area1 {
    display: -webkit-flex; /* Safari */
    -webkit-flex-wrap: wrap; /* Safari 6.1+ */
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
  }
  .tel_area2 {
    display: -webkit-flex; /* Safari */
    -webkit-flex-wrap: wrap; /* Safari 6.1+ */
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
  }
  .address_area {
    padding-top: 20px;
    .address1_area {
        input {
            border-bottom-right-radius: 0px;
            border-bottom-left-radius: 0px;
        }
    }
    .address2_area {
        margin-top: -9px;
        input {
            border-top-right-radius: 0px;
            border-top-left-radius: 0px;
        }
    }
  }
  .remark_area {
    display: -webkit-flex; /* Safari */
    -webkit-flex-wrap: wrap; /* Safari 6.1+ */
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    .label_area {
      width: 6rem;
      text-align: right;
      line-height:2.5rem;
      margin-right: 8px;
    }
    .text_area {
      width: calc(100% - 7rem);
      textarea {
          width: 100%;
      }
    }
  }
 `;

class AddContactModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.state = {
      alwaysShow:
        modal_data !== null && modal_data.is_enabled != undefined
          ? modal_data.is_enabled
          : 1,
      id: modal_data !== null && modal_data.id != undefined ? modal_data.id : 0,
      name:
        modal_data !== null && modal_data.name !== undefined
          ? modal_data.name
          : "",
      relation:
        modal_data !== null && modal_data.relation !== undefined
          ? modal_data.relation
          : "",
      address_1:
        modal_data !== null && modal_data.address_1 !== undefined
          ? modal_data.address_1
          : "",
      address_2:
        modal_data !== null && modal_data.address_2 !== undefined
          ? modal_data.address_2
          : "",
      phone_number_1_name:
        modal_data !== null && modal_data.phone_number_1_name !== undefined
          ? modal_data.phone_number_1_name
          : "",
      phone_number_2_name:
        modal_data !== null && modal_data.phone_number_2_name !== undefined
          ? modal_data.phone_number_2_name
          : "",
      phone_number_1:
        modal_data !== null && modal_data.phone_number_1 !== undefined
          ? modal_data.phone_number_1
          : "",
      phone_number_2:
        modal_data !== null && modal_data.phone_number_2 !== undefined
          ? modal_data.phone_number_2
          : "",
      note:
        modal_data !== null && modal_data.note !== undefined
          ? modal_data.note
          : "",
      system_patient_id: this.props.system_patient_id,
      alert_message: "",
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_alert_title:'',
    };
  // this.original="";
  this.original = JSON.stringify(this.state);

  this.dial_emergency_validate = getPatientValidate().dial_emergency;
  }
  componentDidMount() {
    this.changeBackground();
    this.original = JSON.stringify(this.state);
  }

  componentDidUpdate () {
    this.changeBackground();
  }

  checkValidation = () => {        
    let error_str_arr = [];
    let error_arr = [];
    removeRedBorder("name_id");    
    // $(".birth-label .alert-span").remove();
    // let result = patternvalidate("dial_prescript", this.state);

    if (this.state.name == null || this.state.name === "") {
      error_str_arr.push(this.dial_emergency_validate.name.requierd_message);
      error_arr.push({
        // state_key: 'name',
        // error_msg: '連絡先名未入力エラー',
        // error_type: 'blank',
        tag_id:'name_id'
      });
      addRedBorder("name_id");
    }
    if (this.state.name != "" && this.state.name.length > this.dial_emergency_validate.name.length) {            
        error_str_arr.push(this.dial_emergency_validate.name.overflow_message);
        error_arr.push({
          // state_key: 'name',
          // error_msg: '連絡先名長さエラー',
          // error_type: 'length',
          tag_id:'name_id'
        });
        addRedBorder("name_id");
    }
    if (this.state.relation != null && this.state.relation != undefined && this.state.relation != "" && getHalfLength(this.state.relation) > this.dial_emergency_validate.relation.length) {         
        error_str_arr.push(this.dial_emergency_validate.relation.overflow_message);
        error_arr.push({          
          tag_id:'relation_id'
        });
        addRedBorder("relation_id");
    } else {
      removeRedBorder("relation_id");    
    } 
    if (this.state.address_1 != null && this.state.address_1 != undefined && this.state.address_1 != "" && this.state.address_1.length > this.dial_emergency_validate.address_1.length) {            
        error_str_arr.push(this.dial_emergency_validate.address_1.overflow_message);
        error_arr.push({          
          tag_id:'address_1_id'
        });
        addRedBorder("address_1_id");
    } else {
      removeRedBorder("address_1_id");    
    } 
    if (this.state.address_2 != null && this.state.address_2 != undefined && this.state.address_2 != "" && this.state.address_2.length > this.dial_emergency_validate.address_2.length) {            
        error_str_arr.push(this.dial_emergency_validate.address_2.overflow_message);
        error_arr.push({          
          tag_id:'address_2_id'
        });
        addRedBorder("address_2_id");
    } else {
      removeRedBorder("address_2_id");    
    } 
    if (this.state.phone_number_1_name != null && this.state.phone_number_1_name != undefined && this.state.phone_number_1_name != "" && this.state.phone_number_1_name.length > this.dial_emergency_validate.phone_number_1_name.length) {            
        error_str_arr.push(this.dial_emergency_validate.phone_number_1_name.overflow_message);
        error_arr.push({          
          tag_id:'phone_number_1_name_id'
        });
        addRedBorder("phone_number_1_name_id");
    } else {
      removeRedBorder("phone_number_1_name_id");    
    } 
    if (this.state.phone_number_1 != null && this.state.phone_number_1 != undefined && this.state.phone_number_1 != "" && this.state.phone_number_1.length > this.dial_emergency_validate.phone_number_1.length) {            
        error_str_arr.push(this.dial_emergency_validate.phone_number_1.overflow_message);
        error_arr.push({          
          tag_id:'phone_number_1_id'
        });
        addRedBorder("phone_number_1_id");
    } else {
      removeRedBorder("phone_number_1_id");    
    } 
    if (this.state.phone_number_2_name != null && this.state.phone_number_2_name != undefined && this.state.phone_number_2_name != "" && this.state.phone_number_2_name.length > this.dial_emergency_validate.phone_number_2_name.length) {            
        error_str_arr.push(this.dial_emergency_validate.phone_number_2_name.overflow_message);
        error_arr.push({          
          tag_id:'phone_number_2_name_id'
        });
        addRedBorder("phone_number_2_name_id");
    } else {
      removeRedBorder("phone_number_2_name_id");    
    } 
    if (this.state.phone_number_2 != null && this.state.phone_number_2 != undefined && this.state.phone_number_2 != "" && this.state.phone_number_2.length > this.dial_emergency_validate.phone_number_2.length) {            
        error_str_arr.push(this.dial_emergency_validate.phone_number_2.overflow_message);
        error_arr.push({          
          tag_id:'phone_number_2_id'
        });
        addRedBorder("phone_number_2_id");
    } else {
      removeRedBorder("phone_number_2_id");    
    } 
    if (this.state.note != null && this.state.note != undefined && this.state.note != "" && this.state.note.length > this.dial_emergency_validate.note.length) {            
        error_str_arr.push(this.dial_emergency_validate.note.overflow_message);
        error_arr.push({          
          tag_id:'note_id'
        });
        addRedBorder("note_id");
    } else {
      removeRedBorder("note_id");    
    }     
    
    this.setState({error_arr});
    return error_str_arr;
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
  getAlwaysShow = (name, value) => {
    if (name == "contract_alwaysShow") this.setState({ alwaysShow: value });
  };
  getContactName = (e) => {
    this.setState({ name: e.target.value });
  };
  getContactRelation = (e) => {
    this.setState({ relation: e.target.value });
  };
  getContactAddress1 = (e) => {
    this.setState({ address_1: e.target.value });
  };
  getContactAddress2 = (e) => {
    this.setState({ address_2: e.target.value });
  };
  getContactTelName1 = (e) => {
    this.setState({ phone_number_1_name: e.target.value });
  };
  getContactTelName2 = (e) => {
    this.setState({ phone_number_2_name: e.target.value });
  };

  toHalfWidthOnlyNumber = (strVal) => {
    // 半角変換
    var halfVal = strVal.replace(/[０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    });

    return halfVal;
  };

  getContactTelNumber1 = (e) => {
    let regx = /^[-]*[0-9０-９][-0-9０-９]*$/;
    if (e.target.value != "" && !regx.test(e.target.value)) return;
    if (e.target.value.length > this.dial_emergency_validate.phone_number_1.length) return;
    this.setState({
      phone_number_1: this.toHalfWidthOnlyNumber(e.target.value),
    });
  };
  getContactTelNumber2 = (e) => {
    let regx = /^[-]*[0-9０-９][-0-9０-９]*$/;
    if (e.target.value != "" && !regx.test(e.target.value)) return;
    if (e.target.value.length > this.dial_emergency_validate.phone_number_2.length) return;
    this.setState({
      phone_number_2: this.toHalfWidthOnlyNumber(e.target.value),
    });
  };
  getNote = (e) => {
    if (e.target.value.length > this.dial_emergency_validate.note.length) return;
    this.setState({ note: e.target.value });
  };

  saveData = () => {
    this.props.saveContact(this.state);
  };

  confirmCancel() {
    this.setState({
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      
      confirm_message: "",
      confirm_alert_title:'',
    });
  }
  register = () => {
    if (JSON.stringify(this.state) == this.original) return;
    // if (this.state.name === "") {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "連絡先名を入力してください。"
    //   );
    //   return;
    // }

    let error_str_array = this.checkValidation();
    if (error_str_array.length > 0 ) {
        this.setState({alert_message:error_str_array.join('\n')});
        return;
    }
    // if (
    //   this.state.phone_number_1 != "" &&
    //   this.state.phone_number_1.length > 20
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "TEL①を20文字以下で入力してください。"
    //   );
    //   return;
    // }
    // if (
    //   this.state.phone_number_2 != "" &&
    //   this.state.phone_number_2.length > 20
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "TEL②を20文字以下で入力してください。"
    //   );
    //   return;
    // }
    let str_msg = this.props.modal_data != null ? "変更" : "登録";
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: "連絡先を" + str_msg + "しますか？",
      confirm_alert_title : str_msg + '確認',
    });
    // if (this.props.modal_data !== null) {
    //   this.setState({
    //     isUpdateConfirmModal: true,
    //     confirm_message: "連絡先を変更しますか?",
    //   });
    // } else {
    //   this.saveData();
    // }
  };


  onHide = () => {};

  closeConfirmModal = () => {
    this.confirmCancel();
    this.props.closeModal();
  };

  closeAlertModal = () => {
    this.setState({alert_message: ''});
    if(this.state.error_arr.length > 0){
      let first_obj = this.state.error_arr[0];
      $("#" + first_obj.tag_id).focus();
    }
  }

  changeBackground = () => {
    if (this.state.name == "") {
        addRequiredBg("name_id");
      } else {
        removeRequiredBg("name_id");
      }      
  }  

  render() {        
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal add-contact-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>
            連絡先
            {this.props.modal_data != undefined && this.props.modal_data != null
              ? "編集"
              : "登録"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="checkbox_area">
              <Checkbox
                label="この連絡先を 常に表示"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.alwaysShow}
                checked={this.state.is_enabled === 1}
                name="contract_alwaysShow"
              />
            </div>
            <div className="name_area">
              <div className="left_area">
                <InputWithLabelBorder
                  id="name_id"
                  label="連絡先名"
                  type="text"
                  placeholder=""
                  getInputText={this.getContactName.bind(this)}
                  diseaseEditData={this.state.name}
                />
              </div>
              <div className="right_area">
                <InputWithLabelBorder
                  id="relation_id"
                  label="続柄"
                  type="text"
                  placeholder=""
                  getInputText={this.getContactRelation.bind(this)}
                  diseaseEditData={this.state.relation}
                />
              </div>
            </div>

            <div className="address_area">
              <div className="address1_area">
                <InputWithLabelBorder
                  id="address_1_id"
                  label="住所"
                  type="text"
                  placeholder=""
                  getInputText={this.getContactAddress1.bind(this)}
                  diseaseEditData={this.state.address_1}
                />
              </div>
              <div className="address2_area">
                <InputWithLabelBorder
                  id="address_2_id"
                  label=""
                  type="text"
                  placeholder=""
                  getInputText={this.getContactAddress2.bind(this)}
                  diseaseEditData={this.state.address_2}
                />
              </div>
            </div>

            <div className="tel_area1">
              <div className="left_area">
                <InputWithLabelBorder
                  id="phone_number_1_name_id"
                  label="名称①"
                  type="text"
                  placeholder=""
                  getInputText={this.getContactTelName1.bind(this)}
                  diseaseEditData={this.state.phone_number_1_name}
                />
              </div>
              <div className="right_area hankaku-eng-num-input">
                <InputWithLabelBorder
                  id="phone_number_1_id"
                  label="TEL①"
                  type="text"
                  placeholder=""
                  getInputText={this.getContactTelNumber1.bind(this)}
                  diseaseEditData={this.state.phone_number_1}
                />
              </div>
            </div>

            <div className="tel_area2">
              <div className="left_area">
                <InputWithLabelBorder
                  id="phone_number_2_name_id"
                  label="名称②"
                  type="text"
                  placeholder=""
                  getInputText={this.getContactTelName2.bind(this)}
                  diseaseEditData={this.state.phone_number_2_name}
                />
              </div>
              <div className="right_area hankaku-eng-num-input">
                <InputWithLabelBorder
                  id="phone_number_2_id"
                  label="TEL②"
                  type="text"
                  placeholder=""
                  getInputText={this.getContactTelNumber2.bind(this)}
                  diseaseEditData={this.state.phone_number_2}
                />
              </div>
            </div>

            <div className="remark_area">
              <div className="label_area">
                備考
              </div>
              <div className="text_area">
                <textarea
                  id="note_id"
                  onChange={this.getNote.bind(this)}
                  value={this.state.note}
                />
              </div>
            </div>
          </Wrapper>
        </Modal.Body>
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.saveData.bind(this)}
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
        {this.state.alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
            <Button
              className = {`${JSON.stringify(this.state) != this.original ? 'red-btn':'disable-btn'}`}                            
              onClick={this.register}
            >
              {this.props.modal_data != null ? "変更" : "登録"}
            </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

AddContactModal.contextType = Context;

AddContactModal.propTypes = {
    closeModal: PropTypes.func,
    saveContact: PropTypes.func,
    modal_data: PropTypes.object,
    system_patient_id: PropTypes.number
};

export default AddContactModal;
