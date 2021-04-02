import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import SelectorWithLabelIndex from "~/components/molecules/SelectorWithLabelIndex";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import * as methods from "~/components/templates/Dial/DialMethods";
import {formatTimePicker} from "~/helpers/date";
registerLocale("ja", ja);
import InputWithLabel from "~/components/molecules/InputWithLabel";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";


const Wrapper = styled.div`
  .content{
    margin-bottom: 30px;
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
.flex {
    display: flex;
    flex-wrap: wrap;
}
.no-padding{
  padding:0;
}
td label{
  display:none;
}
.label-title {
    width: 130px;    
    margin-right: 10px;
    text-align: right;
    font-size: 16px;
}
.pullbox-select {
    width: 100%;
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
.datepicker {
    label {
        width: 130px;
        text-align: right;
        margin-right: 10px;
        font-size: 16px;
        padding-top: 8px;
    }
}
.hVAPNc {
 .label-title{
    width: 130px;
 }
 input {
    width: 240px;
 }
}
 .hvMNwk {
    margin-top: 0;
    label {
        text-align: right;
        margin-right: 10px;
        width: 130px;
        font-size: 16px;
    }
    input {
        width: 240px;
    }
 }
 `;

class EditPatientGroup extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        let schedule_data = this.props.schedule_data !=undefined && this.props.schedule_data !=null ? this.props.schedule_data : ''
        this.state = {
            confirm_message:'',
            confirm_type:'',
            group: (schedule_data.group !=undefined && schedule_data.group != null) ? schedule_data.group : 0,
            group2: (schedule_data.group2 !=undefined && schedule_data.group2 != null) ? schedule_data.group2 : 0,
            scheduled_start_time: (schedule_data.scheduled_start_time !=undefined && schedule_data.scheduled_start_time != null && schedule_data.scheduled_start_time !== '') ? formatTimePicker(schedule_data.scheduled_start_time+':00') : '',
            scheduled_end_time: (schedule_data.scheduled_end_time !=undefined && schedule_data.scheduled_end_time != null && schedule_data.scheduled_end_time !== '') ? formatTimePicker(schedule_data.scheduled_end_time+':00') : '',
            list_note:(schedule_data.list_note != undefined && schedule_data.list_note != null) ? schedule_data.list_note : '',
            isShowDoctorList: false,
            directer_name:0,
            entry_name:0,
            entry_date:new Date(),
            entry_time:new Date(),
            isShowStaffList:false,

        };
    }

    async UNSAFE_componentWillMount(){        
        this.getDoctors();
        this.getStaffs();
    }

    EditInfo = () => {
        let path = "/app/api/v2/dial/patient/editDialWithInjectionByGroup";
        let post_data = {
            schedule_number: this.props.schedule_data.schedule_number,
            condition_number: this.props.schedule_data.condition_number,
            group: this.state.group,
            group2: this.state.group2,
            scheduled_start_time: this.state.scheduled_start_time,
            scheduled_end_time: this.state.scheduled_end_time,
            list_note: this.state.list_note,
            directer_name: this.state.directer_name,
            entry_name: this.state.entry_name,
            entry_date: this.state.entry_date,
            entry_time: this.state.entry_time,
        };
        apiClient._post(path, {
            params: post_data
        }).then(() => {
            this.closeModal();
        }).catch(() => {
        });
    }
    getValue = (key, e) => {
        switch(key){
            case 'group':
                this.setState({
                    group: e.target.id
                });
                break;
            case 'group2':
                this.setState({
                    group2: e.target.id
                });
                break;
            case 'scheduled_start_time':
                this.setState({
                    scheduled_start_time: e
                });
                break;
            case 'scheduled_end_time':
                this.setState({
                    scheduled_end_time: e
                });
                break;
            case 'entry_time':
                this.setState({
                    entry_time: e
                });
                break;
            case 'list_note':
                this.setState({
                    list_note: e.target.value
                });
                break;
            case 'entry_date':
                this.setState({
                    entry_date: e
                });
                break;
        }
    };

    closeModal = () => {
        this.props.closeModal();
    };

    confirmCancel = () => {
        this.setState({
            confirm_message: "",
            confirm_type: "",
        });
    }

    confirmOk = () => {
        if(this.state.confirm_type === 'save'){
            this.EditInfo();
        }
        this.props.handleOk();
    }
    openConfirmModal() {
        let schedule_data = this.state.schedule_data;
        let prev_data = this.props.schedule_data;
        if(schedule_data.group !== prev_data.group
            && schedule_data.group2 !== prev_data.group2
            && schedule_data.scheduled_start_time !== prev_data.scheduled_start_time
            && schedule_data.scheduled_end_time !== prev_data.scheduled_end_time
            && schedule_data.list_note !== prev_data.list_note){
            this.setState({
                confirm_message: '保存しますか？',
                confirm_type: 'save',
            });
        } else {
            this.setState({
                confirm_message: '変更されていません。',
                confirm_type: 'close',
            });
        }
    }

    showDoctorList = () => {
        this.setState({
            isShowDoctorList:true
        });
    }

    showStaffList = () => {
        this.setState({isShowStaffList:true});
    }
    selectDoctor = (doctor) => {
        this.setState({
            directer_name:doctor.number
        })
        this.closeDoctorSelectModal();
    }

    selectStaff = (staff) => {
        this.setState({entry_name:staff.number})
        this.closeDoctorSelectModal();
    }

    closeDoctorSelectModal = () => {
        this.setState({
            isShowDoctorList:false,
            isShowStaffList:false
        });
    }
    render() {        
        let { dial_group_codes, dial_group_codes2} = this.state;
        return  (
            <Modal show={true} id="add_contact_dlg"  className="master-modal edit-group-schedule-modal">
                <Modal.Header>
                    <Modal.Title>患者グループ分け編集</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className="content flex">
                            <div className={'edit-area'}>
                                <SelectorWithLabelIndex
                                    options={dial_group_codes}
                                    title="グループ"
                                    getSelect={this.getValue.bind(this, 'group')}
                                    departmentEditCode={this.state.group}
                                />
                                <SelectorWithLabelIndex
                                    options={dial_group_codes2}
                                    title="グループ2"
                                    getSelect={this.getValue.bind(this, 'group2')}
                                    departmentEditCode={this.state.group2}
                                />
                                <div className="datepicker flex">
                                    <label>開始予定時刻</label>
                                    <DatePicker
                                        selected={this.state.scheduled_start_time}
                                        onChange={this.getValue.bind(this,'scheduled_start_time')}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={10}
                                        dateFormat="HH:mm"
                                        timeFormat="HH:mm"
                                        timeCaption="時間"
                                    />
                                </div>
                                <div className="datepicker flex">
                                    <label>終了予定時刻</label>
                                    <DatePicker
                                        selected={this.state.scheduled_end_time}
                                        onChange={this.getValue.bind(this,'scheduled_end_time')}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={10}
                                        dateFormat="HH:mm"
                                        timeFormat="HH:mm"
                                        timeCaption="時間"
                                    />
                                </div>
                                <InputBoxTag
                                    label="備考"
                                    type="text"
                                    placeholder=""
                                    className="right"
                                    getInputText={this.getValue.bind(this, 'list_note')}
                                    value={this.state.list_note}
                                />
                            </div>
                            <div className={'input-area'}>
                                <InputWithLabel
                                    label="入力日"
                                    type="date"
                                    getInputText={this.getValue.bind(this,'entry_date')}
                                    diseaseEditData={this.state.entry_date}
                                />
                                <div className="datepicker flex">
                                    <label>入力時間</label>
                                    <DatePicker
                                        selected={this.state.entry_time}
                                        onChange={this.getValue.bind(this,'entry_time')}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={10}
                                        dateFormat="HH:mm"
                                        timeFormat="HH:mm"
                                        timeCaption="時間"
                                    />
                                </div>
                                <div className="entry_name" onClick={this.showStaffList}>
                                    <InputWithLabel
                                        label="入力者"
                                        type="text"
                                        placeholder = ""
                                        diseaseEditData={this.state.entry_name > 0?this.state.staff_list_by_number[this.state.entry_name]:''}
                                    />
                                </div>
                                <div className='direct_man' onClick={this.showDoctorList}>
                                    <InputWithLabel
                                        label="指示者"
                                        type="text"
                                        placeholder = ""
                                        diseaseEditData={this.state.directer_name>0?this.state.doctor_list_by_number[this.state.directer_name]:''}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="footer">
                            <div className="add-button">
                                <Button type="mono" onClick={this.openConfirmModal}>保存</Button>
                                <Button type="mono" onClick={this.closeModal}>閉じる</Button>
                            </div>
                        </div>
                        {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
                            <SystemConfirmModal
                                hideConfirm= {this.confirmCancel.bind(this)}
                                confirmCancel= {this.confirmCancel.bind(this)}
                                confirmOk= {this.confirmOk.bind(this)}
                                confirmTitle= {this.state.confirm_message}
                            />
                        )}
                        {this.state.isShowDoctorList && (
                            <DialSelectMasterModal
                                selectMaster = {this.selectDoctor}
                                closeModal = {this.closeDoctorSelectModal}
                                MasterCodeData = {this.state.doctors}
                                MasterName = '医師'
                            />
                        )}
                        {this.state.isShowStaffList && (
                            <DialSelectMasterModal
                                selectMaster = {this.selectStaff}
                                closeModal = {this.closeDoctorSelectModal}
                                MasterCodeData = {this.state.staffs}
                                MasterName = 'スタッフ'
                            />
                        )}
                    </Wrapper>
                </Modal.Body>
            </Modal>
        );
    }
}

EditPatientGroup.contextType = Context;

EditPatientGroup.propTypes = {
    closeModal:PropTypes.func,
    handleOk:PropTypes.func,
    schedule_data:PropTypes.object
};

export default EditPatientGroup;
