import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import {formatDateLine} from "~/helpers/date";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import {getTimeZoneList} from "~/components/templates/Dial/DialMethods/getSystemTimeZone";

const Wrapper = styled.div`
  .content{
    margin-bottom: 30px;
      .label-title {
        margin-right: 10px;
        text-align: right;
        font-size: 16px;
      }
      label {
        width: 50%;
        select {
            width: 100%;
        }
      }
  }
  .footer {
    text-align:center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;  
      margin-right: 20px;    
    }    
    span {
      color: white;
      font-size: 16px;
      padding-left: 35px;
      padding-right: 35px;
      font-weight: 100;
    }    
}
.no-padding{
  padding:0;
}
td label{
  display:none;
}
.label-title {
    width: 230px;
}
.hvMNwk .label-title {
    width: 230px;
}
.pullbox {
    .pullbox-label {
        width: 240px;
    }
}
.react-datepicker-wrapper {
        width: 240px;
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
 `;

class EditBedInfo extends Component {
    constructor(props) {
        super(props);
        let time_zones = getTimeZoneList();
        this.state = {
            time_zones:time_zones != undefined ? time_zones : [],
            time_zone:this.props.bed_data.time_zone,
            schedule_date:new Date(this.props.bed_data.schedule_date),
            confirm_message:'',
            bed_no: this.props.bed_data.bed_no,
            console: this.props.bed_data.console,
            confirm_type: '',
        };
    }

    getInputdate = value => {
        this.setState({schedule_date: value});
    };
    getValue = (e) => {
        this.setState({time_zone: e.target.id});
    };

    EditBedInfo = (type) => {
        if((type === 'time_zone' && this.state.time_zone !== this.props.bed_data.time_zone) || (type === 'date' && formatDateLine(this.state.schedule_date) !== this.props.bed_data.schedule_date)){
            let path = "/app/api/v2/dial/patient/changeScheduleInfo";
            let post_data = {
                schedule_number: this.props.bed_data.schedule_number,
                schedule_date: formatDateLine(this.state.schedule_date),
                time_zone: this.state.time_zone,
                type: type,
                bed_no: this.state.bed_no,
                console: this.state.console,
            };
            apiClient._post(path, {
                params: post_data
            }).then((res) => {
                if(res.alert_message != undefined && res.alert_message != null){
                    this.props.closeModal();
                }
                if(res.bed_message != undefined && res.bed_message != null){
                    this.setState({
                        confirm_message: res.bed_message,
                        confirm_type: 'bed_no',
                    });
                }
                if(res.console_message != undefined && res.console_message != null){
                    this.setState({
                        confirm_message: res.console_message,
                        confirm_type: 'console',
                    });
                }
            }).catch(() => {
            });
        } else {
            this.closeModal();
        }
    }

    closeModal = () => {
        this.props.closeModal();
    };

    confirmCancel() {
        this.setState({
            confirm_message: "",
            confirm_type: "",
        });
    }

    confirmOk() {
        if(this.state.confirm_type === 'bed_no'){
            this.setState({
                confirm_message: "",
                confirm_type: "",
                bed_no: 100,
            });
        } else {
            this.setState({
                confirm_message: "",
                confirm_type: "",
                console: 100,
            });
        }
        this.EditBedInfo('time_zone');
        this.closeModal();
    }

    onHide=()=>{}

    render() {
        return  (
            <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal edit-bed-modal">
                <Modal.Header>
                    <Modal.Title>ベッドNo設定</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className="content">
                            <SelectorWithLabel
                                options={this.state.time_zones}
                                title="時間帯"
                                getSelect={this.getValue.bind(this)}
                                departmentEditCode={this.props.bed_data.time_zone}
                            />
                            <InputWithLabel
                                label="透析日付"
                                type="date"
                                getInputText={this.getInputdate.bind(this)}
                                diseaseEditData={this.state.schedule_date}
                            />
                        </div>
                        <div className="footer-buttons">
                                <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
                                <Button className="red-btn" onClick={this.EditBedInfo.bind(this,'time_zone')}>時間帯設定</Button>
                                <Button className="red-btn" onClick={this.EditBedInfo.bind(this,'date')}>透析日付設定</Button>
                        </div>
                        {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
                            <SystemConfirmModal
                                hideConfirm= {this.confirmCancel.bind(this)}
                                confirmCancel= {this.confirmCancel.bind(this)}
                                confirmOk= {this.confirmOk.bind(this)}
                                confirmTitle= {this.state.confirm_message}
                            />
                        )}
                    </Wrapper>
                </Modal.Body>
            </Modal>
        );
    }
}

EditBedInfo.contextType = Context;

EditBedInfo.propTypes = {
    closeModal:PropTypes.func,
    handleOk:PropTypes.func,
    bed_data:PropTypes.object
};

export default EditBedInfo;
