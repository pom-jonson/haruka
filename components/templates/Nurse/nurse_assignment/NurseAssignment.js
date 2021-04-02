import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Radiobox from "~/components/molecules/Radiobox";
import AssignmentList from "./AssignmentList";
import { formatDateLine } from "../../../../helpers/date";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .div-title {
   height:2.3rem;
   line-height:2.3rem;
   width:5rem;
 }
 .react-datepicker-wrapper {
   input {
    height: 2.3rem;
    width: 7rem;
    font-size:1rem;
   }
 }
 .select-ward {
   margin-top:0.5rem;
   .label-title {
     width:5rem;
     margin:0;
     line-height: 2.3rem;
     font-size: 1rem;
   }
   select {
     height: 2.3rem;
     font-size: 1rem;
     width: 7rem;
   }
 }
 .select-allocation {
    label {
      font-size: 1rem;
      line-height: 2.3rem;
    }
 }
`;

class NurseAssignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seleted_date:"",
      ward_master:[{id:0, value:""}],
      first_ward_id:0,
      ward_name:"",
      select_allocation:1,
      alert_messages:"",
      openAssignmentList:false,
    };
  }

  async UNSAFE_componentWillMount () {
    let path = "/app/api/v2/ward/get/ward_master";
    let post_data = {
    };
    await apiClient
        .post(path, {
            params: post_data
        })
        .then((res) => {
            let ward_master = this.state.ward_master;
            if(res.length > 0){
                res.map(ward=>{
                    ward_master.push({id:ward.number, value:ward.name});
                });
            }
            this.setState({ward_master});
        })
        .catch(() => {

        });
  }

  setDate=(value)=>{
    this.setState({seleted_date:value});
  };

  setWard=(e)=>{
    this.setState({
      first_ward_id:parseInt(e.target.id),
      ward_name:e.target.value,
    });
  };

  setAllocation = (e) => {
    this.setState({select_allocation:parseInt(e.target.value)});
  }

  confirmOk=()=>{
    if(this.state.seleted_date == "" || this.state.seleted_date == null){
      this.setState({alert_messages: "日付を選択してください。"});
      return;  
    }
    if(this.state.first_ward_id == 0){
      this.setState({alert_messages: "病棟を選択してください。"});
      return;  
    }
    this.setState({
      openAssignmentList:true,
    });
  }

  closeModal=()=>{
    this.setState({
      alert_messages:"",
      openAssignmentList:false,
    });  
  }

  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm nurse-assignment first-view-modal"
        >
          <Modal.Header><Modal.Title>看護師業務分担</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={'flex'}>
                  <div className={'div-title'}>記録日付</div>
                  <DatePicker
                    locale="ja"
                    selected={this.state.seleted_date}
                    onChange={this.setDate.bind(this)}
                    dateFormat="yyyy/MM/dd"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dayClassName = {date => setDateColorClassName(date)}
                  />
                </div>
                <div className={'select-ward'}>
                  <SelectorWithLabel
                    title="病棟"
                    options={this.state.ward_master}
                    getSelect={this.setWard}
                    departmentEditCode={this.state.first_ward_id}
                  />
                </div>
                <div className={'select-allocation flex'}>
                  <div className={'div-title'}>割り付け</div>
                  <Radiobox
                    label={'部屋単位'}
                    value={1}
                    getUsage={this.setAllocation.bind(this)}
                    checked={this.state.select_allocation === 1}
                    disabled={true}
                    name={`select_allocation`}
                  />
                  <Radiobox
                    label={'患者単位'}
                    value={2}
                    getUsage={this.setAllocation.bind(this)}
                    checked={this.state.select_allocation === 2}
                    disabled={true}
                    name={`select_allocation`}
                  />
                </div>
                <div style={{marginTop:"0.5rem"}}>※日付と病棟と業務区分を指定してください</div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={"red-btn"} onClick={this.confirmOk}>{"確定"}</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )} 
          {this.state.openAssignmentList && (
            <AssignmentList
              closeModal={this.closeModal}
              first_ward_id={this.state.first_ward_id}
              ward_name={this.state.ward_name}
              select_allocation={this.state.select_allocation}
              seleted_date={formatDateLine(this.state.seleted_date)}
            />
          )}
        </Modal>
      </>
    );
  }
}

NurseAssignment.propTypes = {
  closeModal: PropTypes.func,
};

export default NurseAssignment;
