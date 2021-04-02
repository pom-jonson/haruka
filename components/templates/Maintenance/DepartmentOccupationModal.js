import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as sessApi from "~/helpers/cacheSession-utils";

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
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
  label {
    text-align: right;
    width: 80px;
  }
  input {
    width: 400px;
    font-size: 1rem;
  }
  .datepickerbox{
    input{      
      height: 2rem;
      line-height: 2rem;    
    }
  }
  .disease_classification {
    display: flex;
    font-size: 1rem;
    margin-left: 15px;
    margin-top: 8px;
    .radio-btn label {
      width: 60px;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 4px;
      margin: 0 5px;
      padding: 4px 5px;
    }
    .checkbox-label {
      width: 69px;
      text-align: right;
      margin-top: 8px;
    }
  }
  .checkbox-label {
    width: 30%;
    text-align: left;
  }
  .add-button {
    text-align: center;
  }
  .checkbox_area {    
    label {
      margin-left: 88px;
      text-align: left;
      width: 100px;
      font-size: 1rem;
    }
  }
  .pattern_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    input {
      font-size: 1rem;
      width: 155px;
    }
  }
  .kana_area {
    padding-top: 10px;
  }
  .label-title {
    font-size: 1rem;
    margin-top: 0px;
    height: 2rem;
    line-height: 2rem;
  }
  .name_area {
    padding-top: 20px;
  }
  .footer {
    display: flex;
    margin-left: 32%;
    margin-top: 20px;
    margin-bottom: 20px;
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
      font-size: 1rem;
      font-weight: 100;
    }
  }
`;

class DepartmentOccupationModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.state = {
      is_enabled: modal_data != null ? modal_data.is_enabled : 1,
      number: modal_data != null ? modal_data.id : 0,
      name: modal_data != null ? modal_data.name : "",
      name_kana: modal_data != null ? modal_data.name_kana : "",
      isUpdateConfirmModal: false,
      isOpenConfirmModal: false,
      confirm_message: "",
			change_flag: 0,
			alert_message: "",
    };
  }

  componentDidMount() {
		this.setChangeFlag(0);
		this.changeBackground();
	}
	
	componentDidUpdate() {
    this.changeBackground();
  }
  
  componentWillUnmount() {
    // sessApi.delObjectValue('dial_change_flag', 'word_pattern');
    sessApi.remove("dial_change_flag");
	}
	
	changeBackground = () => {
    masterValidate("authority", this.state, 'background');
  };

  checkValidation = () => {
    removeRedBorder("name_id");
    removeRedBorder("name_kana_id");
    let error_str_arr = [];
    let validate_data = masterValidate("authority", this.state);

    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != "") {
      this.setState({ first_tag_id: validate_data.first_tag_id });
    }
    return error_str_arr;
  };

  closeAlertModal = () => {
    this.setState({ alert_message: "" });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };

  setChangeFlag = (change_flag) => {
    this.setState({ change_flag });
    if (change_flag) {
      sessApi.setObjectValue("dial_change_flag", "departtment_occupation", 1);
    } else {
      sessApi.remove("dial_change_flag");
    }
  };

  getAlwaysShow = (name, value) => {
    this.setChangeFlag(1);
    if (name === "alwaysShow") this.setState({ is_enabled: value });
  };
  
  getValue = (key, e) => {
    this.setChangeFlag(1);
    this.setState({[key]:e.target.value})    
  };

  async registerMedicine() {
    let path = "/app/api/v2/dial/department_occupation/register";
    const post_data = {
      params: this.state,
    };
    await apiClient.post(path, post_data).then(() => {
      if (this.props.modal_data !== null) {
        this.props.handleOk("update");
      } else {
        this.props.handleOk("register");
      }
    });
  }

  handleOk = () => {
    if (this.state.change_flag == 0) return;
    // if (
    //   this.state.name == undefined ||
    //   this.state.name == null ||
    //   this.state.name == ""
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "名称を入力してください。"
    //   );
    //   return;
		// }
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
      // this.registerMedicine();
    }
  };

  confirmCloseOk = () => {
    this.setState(
      {
        isOpenConfirmModal: false,
        confirm_message: "",
      },
      () => {
        this.props.closeModal();
      }
    );
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isOpenConfirmModal: false,
      confirm_message: "",
    });
  }

  handleClose = () => {
    if (this.state.change_flag == 1) {
      this.setState({
        isOpenConfirmModal: true,
        confirm_message:
          "登録していない内容があります。変更内容を破棄して閉じますか？",
      });
      return;
    }
    this.props.closeModal();
  };

  render() {
    return (
      <Modal show={true} className="master-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>
            部門・職種{this.props.modal_data != null ? "編集" : "登録"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="checkbox_area">
              <Checkbox
                label="使用する"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.is_enabled}
                checked={this.state.is_enabled === 1}
                name="alwaysShow"
              />
            </div>
            <InputWithLabelBorder
              label="名称"
              type="text"
              className="name-area"
              getInputText={this.getValue.bind(this, "name")}
							diseaseEditData={this.state.name}
							id="name_id"
            />
            <InputWithLabelBorder
              label="カナ名称"
              type="text"
              className="name-area"
              getInputText={this.getValue.bind(this, "name_kana")}
							diseaseEditData={this.state.name_kana}
							id="name_kana_id"
            />            
          </Wrapper>
          {this.state.isUpdateConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.registerMedicine.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
          {this.state.isOpenConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.confirmCloseOk}
              confirmTitle={this.state.confirm_message}
            />
          )}
					{this.state.alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
        </Modal.Body>
        <Modal.Footer>            
          <Button className="cancel-btn" onClick={this.handleClose}>キャンセル</Button>
          <Button
            className={this.state.change_flag == 0 ? "disable-btn" : "red-btn"}
            onClick={this.handleOk}
          >
            {this.props.modal_data !== null ? "変更" : "登録"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

DepartmentOccupationModal.contextType = Context;

DepartmentOccupationModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  modal_data: PropTypes.object,
};

export default DepartmentOccupationModal;
