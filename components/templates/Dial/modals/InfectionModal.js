import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import RadioButton from "~/components/molecules/RadioInlineButton";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import { formatDateLine } from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import { medicalInformationValidate } from '~/helpers/validate'
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  height: 100%;
  float: left;
  .add-button {
    text-align: center;
    .first {
      margin-left: -30px;
    }
  }
  .footer {
    display: flex;
    margin-top: 10px;
    text-align: center;
    .add-button {
      margin: auto;
    }
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }

    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .patient_info {
    font-size: 25px;
    padding-bottom: 20px;
  }
  .left-area {
    width: calc(100% - 80px);
    .react-datepicker-wrapper {
      width: 100%;
      .react-datepicker__input-container {
        width: 100%;
        input {
          font-size: 16px;
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
    .pullbox-select {
      font-size: 16px;
      width: 100%;
    }
    .pullbox .pullbox-label {
      height: 38px;
      width: calc(100% - 65px);
      margin-right: 0px;
    }
    .pullbox .label-title {
      width: 70px;
      text-align: right;
      font-size: 18px;
      margin-right: 10px;
      margin-top: 5px;
    }
    .search-btn {
      border: 1px solid rgb(206, 212, 218);
      font-size: 16px;
      margin-top: 8px;
      margin-left: 5px;
      padding: 8px 10px 0 10px;
    }
    .select-day {
      width: 50%;
      .react-datepicker-wrapper {
        width: calc(100% - 75px);
      }
    }
    .input-title {
      width: calc(100% - 75px);
      input {
        width: calc(100% - 70px);
      }
    }
    .display-day {
      width: 50%;
      margin-top: 3px;
      font-size: 18px;
      .display-day-label {
        width: 90px;
        margin-right: 10px;
        margin-top: 12px;
        float: left;
        font-size: 18px;
        text-align: right;
      }
      .radio-btn {
        label {
          width: 70px;
        }
      }
    }
    .description {
      width: 100%;
      padding-top: 15px;
      .label-title {
        width: 70px;
        font-size: 18px;
        text-align: right;
        margin-right: 10px;
      }
      .input-text-area {
        width: calc(100% - 80px);
        textarea {
          font-size: 16px;
          width: 100%;
          height: 100px;
        }
      }
    }
  }
  label {
    width: 70px;
    font-size: 16px;
    text-align: right;
    margin-top: 9px;
    margin-right: 10px;
  }

  .radio-btn label {
    font-size: 16px;
    width: 55px;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 4px;
    padding: 4px 5px;
    text-align: center;
    margin-right: 10px;
  }
  .right-area {
    width: 30%;
    position: relative;
    min-height: 200px;
    .confirm-area {
      position: absolute;
      bottom: 0;
      left: 0;
      .select-day {
        .label-title {
          width: 85px;
        }
        input {
          width: calc(100% - 100px);
        }
      }
      .checkbox-label {
        margin-right: 10px;
        width: 85px;
        text-align: right;
        margin-top: 10px;
      }
      .checkbox_area {
        label {
          width: 0;
        }
      }
    }
  }
`;

const display_day = ["年月日", "年月", "年"];
const display_format = ["yyyy年MM月dd日", "yyyy年MM月", "yyyy年"];

class InfectionModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    let type_date = 0;
    let date = "";
    if (
      modal_data != undefined &&
      modal_data != null &&
      modal_data.year != undefined &&
      modal_data.year != null
    ) {
      date = modal_data.date;
      if (modal_data.date != undefined && modal_data.date != null) {
        type_date = 0;
        date = modal_data.date;
      } else if (modal_data.month != undefined && modal_data.month != null) {
        date = modal_data.year.toString() + "-" + ("00" + modal_data.month.toString()).slice(-2);
        type_date = 1;
      } else {
        date = modal_data.year.toString();
        type_date = 2;
      }
    }
    let data_list = [{id:"", value:""}];
    if (this.props.codeData != undefined && this.props.codeData != null) {
      this.props.codeData.map((item) => {
        if (item.is_enabled){
          let temp = {id:item.code, value:item.name};
          data_list.push(temp);
        }
      });
    }
    this.state = {
      id: modal_data == null ? null : modal_data.id,
      name:modal_data !== null && modal_data.name !== undefined ? modal_data.name : "",
      type_date: type_date,
      date:date != undefined && date != null && date !== "" ? new Date(date) : "",
      note:modal_data !== null && modal_data.note !== undefined ? modal_data.note : "",
      infrection_code:modal_data !== null && modal_data.infrection_code !== undefined ? modal_data.infrection_code : "",
      number: modal_data !== null ? modal_data.id : 0,
      data_list,
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      alert_messages: "",
      confirm_alert_title:'',
      check_message:"",
    };
    this.original="";
  }
  
  componentDidMount() {
    this.original = JSON.stringify(this.state);
    this.changeBackground();
  }
  
  componentDidUpdate () {
    this.changeBackground();
  }
  
  changeBackground = () => {
    medicalInformationValidate("infection", this.state, "background");
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
  
  getPlannedDate = (value) => {
    this.setState({ date: value });
  };
  
  getSelect = (e) => {
    this.setState({ infrection_code: e.target.id });
  };
  
  selectTypeDate = (value) => {
    this.setState({ type_date: value });
  };
  
  handleOk = () => {
    let validate_data = medicalInformationValidate("infection", this.state);
    if (validate_data['error_str_arr'].length > 0 ) {
      this.setState({
        check_message:validate_data['error_str_arr'].join('\n'),
        first_tag_id:validate_data['first_tag_id']
      });
      return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message:
        this.props.modal_data != null
          ? "感染症情報を変更しますか?"
          : "感染症情報を登録しますか?",
    });
  };
  
  register = () => {
    let postData = {
      date: formatDateLine(this.state.date),
      note: this.state.note,
      type_date: this.state.type_date,
      infrection_code: this.state.infrection_code,
    };
    if (
      this.state.number != undefined &&
      this.state.number != null &&
      this.state.number > 0
    ) {
      postData.number = this.state.number;
    }
    this.confirmCancel();
    this.props.handleOk(postData);
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
  
  getSending = (e) => {
    this.setState({ note: e.target.value });
  };
  
  onHide = () => {};
  
  closeConfirmModal = () =>{
    this.confirmCancel();
    this.props.closeModal();
  }
  
  closeAlertModal = () => {
    this.setState({check_message: ''});
    $("#" + this.state.first_tag_id).focus();
  }
  
  render() {
    let tooltip = "";
    if (this.state.infrection_code == "") {
      tooltip = "名称を選択してください。";
    } else if (this.state.date == null || this.state.date === "") {
      tooltip = "日付を選択してください。";
    }
    const is_add =
      this.props.modal_data != undefined &&
      this.props.modal_data != null &&
      this.props.modal_data.id != undefined &&
      this.props.modal_data.id != null
        ? 0
        : 1;
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal add-infection-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>感染症{is_add ? "追加" : "編集"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="flex">
              <div className="left-area">
                <SelectorWithLabel
                  options={this.state.data_list}
                  title="名称"
                  id='infrection_code_id'
                  getSelect={this.getSelect.bind(this)}
                  departmentEditCode={this.state.infrection_code}
                />
                <div className="flex">
                  <div className="select-day">
                    <InputWithLabelBorder
                      label="日付"
                      type="date"
                      id='date_id'
                      getInputText={this.getPlannedDate}
                      diseaseEditData={this.state.date}
                      dateFormat={display_format[this.state.type_date]}
                    />
                  </div>
                  <div className="display-day">
                    <label className="display-day-label">日付表示</label>
                    <>
                      {display_day.map((item, key) => {
                        return (
                          <>
                            <RadioButton
                              id={`display_day_${key}`}
                              value={key}
                              label={item}
                              name="display_day"
                              getUsage={this.selectTypeDate.bind(this, key)}
                              checked={this.state.type_date == key}
                            />
                          </>
                        );
                      })}
                    </>
                  </div>
                </div>
                <div className="description flex">
                  <div className="label-title">備考</div>
                  <div className="input-text-area">
                    <textarea
                      onChange={this.getSending.bind(this)}
                      value={this.state.note}
                      id='note_id'
                    />
                  </div>
                </div>
              </div>
            </div>
          </Wrapper>
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
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal={this.confirmCancel.bind(this)}
              handleOk={this.confirmCancel.bind(this)}
              showMedicineContent={this.state.alert_messages}
            />
          )}
          {this.state.check_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.check_message}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
          <Button
            onClick={this.handleOk}
            className={tooltip != "" ? "disable-btn" : "red-btn"}
            tooltip={tooltip}
          >
            {is_add ? "登録" : "変更"}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

InfectionModal.contextType = Context;

InfectionModal.propTypes = {
  system_patient_id: PropTypes.number,
  modal_data: PropTypes.object,
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  codeData: PropTypes.object,
};

export default InfectionModal;
