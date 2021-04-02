import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputWithLabel from "../../../../molecules/InputWithLabel";
import {formatDateTimeStr, formatTimePicker, formatNowTime} from "../../../../../helpers/date";
import DatePicker  from "react-datepicker";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;
  width: 100px;
    text-align: right;
  button {
    margin-left: auto;
    margin-right: auto;
  }
  input {
    height: 35px;
    width: 250px !important;
  }
  label {
    font-size: 18px !important;
    width: 180px !important;
    }
  .picker {
    margin: 10px auto;
  }
  .dKLdmM {
    margin-left: 7px;
  }
  .input-time {
      margin-top: 10px;
      display: flex;
      label {
        width: 80px;
        font-size: 18px;
      }
      .react-datepicker-wrapper{
        margin-left: 10px;
      }
  }
   .footer {
    display: flex;
    margin-left: 190px;
    margin-top: 10px;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;
      margin-right:10px;
      min-width: 100px;
    }
    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
}
 `;

class BloodEditModal extends Component {
    constructor(props) {
        super(props);
        let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
        let {modal_data} = this.props;
        this.state = {
            number: modal_data != null ? modal_data.number : 0,
            cur_time: modal_data != null ? formatTimePicker(modal_data.input_time.split(" ")[1]) :  formatNowTime(),
            staff_name:authInfo.name,
            pressure_max: modal_data != null ? modal_data.bp_pressure_max : "",
            pressure_min: modal_data != null ? modal_data.bp_pressure_min : "",
            pulse: modal_data != null ? modal_data.bp_pulse: "",
        };
    }

    register = () => {
        if (this.state.pressure_max === ""){
            window.sessionStorage.setItem("alert_messages", "最高血圧を入力してください。");
            return;
        }
        if (this.state.pressure_max !== "" && isNaN(parseFloat(this.state.pressure_max))){
            window.sessionStorage.setItem("alert_messages", "最高血圧を数字で入力してください。");
            return;
        }
        if (this.state.pressure_min === ""){
            window.sessionStorage.setItem("alert_messages", "最低血圧を入力してください。");
            return;
        }
        if (this.state.pressure_min !== "" && isNaN(parseFloat(this.state.pressure_min))){
            window.sessionStorage.setItem("alert_messages", "最低血圧を数字で入力してください。");
            return;
        }
        if (this.state.pulse === ""){
            window.sessionStorage.setItem("alert_messages", "脈拍を入力してください。");
            return;
        }
        if (this.state.pulse !== "" && isNaN(parseFloat(this.state.pulse))){
            window.sessionStorage.setItem("alert_messages", "脈拍を数字で入力してください。");
            return;
        }
        let blood = {
            number: this.state.number,
            input_time: formatDateTimeStr(this.state.cur_time),
            staff: this.state.staff_name,
            bp_pressure_max: this.state.pressure_max ? this.state.pressure_max : "",
            bp_pressure_min: this.state.pressure_min ? this.state.pressure_min : "",
            bp_pulse: this.state.pulse ? this.state.pulse : "",
            is_enabled: this.props.modal_data.is_enabled
        };
        this.props.handleModal(blood);
    };

    onChange = (e, value) =>{
        if (value === "pressure_max")
            this.setState({pressure_max: e.target.value});
        else if (value === "pressure_min")
            this.setState({pressure_min: e.target.value});
        else if (value === "pulse")
            this.setState({pulse: e.target.value});
        else if (value === "input_time")
            this.setState({cur_time: e});
    };

    closeModal = () => {
        this.props.closeModal(true);
    };

    render() {
        return  (
            <Modal show={true} onHide={this.closeModal} id="add_contact_dlg"  className="master-modal staf-modal">
                <Modal.Header>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className="input-time">
                            <label>入力時間</label>
                            <DatePicker
                                selected={this.state.cur_time}
                                onChange={(e) => this.onChange(e,"input_time")}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={10}
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                timeCaption="時間"
                            />
                        </div>
                        <InputWithLabel
                            label="入力者"
                            type="text"
                            diseaseEditData={this.state.staff_name}
                            disabled
                        />
                        <InputWithLabel
                            label="最高血圧"
                            type="text"
                            getInputText={(e) => this.onChange(e,"pressure_max")}
                            diseaseEditData={this.state.pressure_max}
                        />
                        <InputWithLabel
                            label="最低血圧"
                            type="text"
                            getInputText={(e) => this.onChange(e,"pressure_min")}
                            diseaseEditData={this.state.pressure_min}
                        />
                        <InputWithLabel
                            label="脈拍"
                            type="text"
                            getInputText={(e) => this.onChange(e,"pulse")}
                            diseaseEditData={this.state.pulse}
                        />
                        <div className="footer-buttons">
                            <Button className="red-btn" onClick={this.register}>登録</Button>
                            <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
                        </div>
                    </Wrapper>
                </Modal.Body>
            </Modal>
        );
    }
}

BloodEditModal.contextType = Context;

BloodEditModal.propTypes = {
    staffInfo: PropTypes.object,
    closeModal:PropTypes.func,
    handleModal:PropTypes.func,
    title: PropTypes.string,
    modal_data: PropTypes.object
};

export default BloodEditModal;
