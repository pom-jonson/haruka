import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SystemConfirmWithBtnModal from "~/components/molecules/SystemConfirmWithBtnModal";
import * as apiClient from "~/api/apiClient";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: auto;
    font-size: 1rem;
    .flex {display: flex;}
    .label-title {
      font-size: 1rem;
      text-align: right;
      margin-right: 0.5rem;
      width: 6rem;
    }
    .place-label {
      width: 6rem;
      text-align: right;
      margin-right: 0.5rem;
    }
    .label-name {
      width: calc(100% - 6.5rem);
      word-break: break-all;
    }
    .visit-place {
      margin-bottom: 10px;
      margin-top: 10px;
    }
    .visit-group {
      .pullbox-label {
        width: calc(100% - 6.5rem);
        select {
          width: 100%;
          font-size: 1rem;
        }
      }
    }
`;

class GroupMoveModal extends Component {
  constructor(props) {
    super(props);
    let visit_group_data = [{id:0, value:"", number:0}];
    if(props.visit_group_data.length > 0){
      props.visit_group_data.map(visit_group=>{
        if(visit_group.visit_group_id != props.selected_group_id){
          let group = {id:visit_group.visit_group_id, value:visit_group.name, number:visit_group.number};
          visit_group_data.push(group);
        }
      })
    }
    this.state = {
      visit_group_id:0,
      visit_group_number:0,
      visit_group_data,
      isConfirmModal:false,
      isConfirmSchedule:false,
      alert_messages:""
    }
  }
  
  openConfirmModal=(type)=>{
    if(this.state.visit_group_id === 0){
      this.setState({alert_messages:"グループを選択してください。"});
      return;
    }
    if(type === 'move'){
      this.setState({
        isConfirmModal:true,
        confirm_message:"移動しますか？",
        confirm_type:type,
      });
    } else {
      this.setState({
        isConfirmModal:false,
        isConfirmSchedule:true,
        confirm_message:"未実施のスケジュールを中止しますか？",
        confirm_type:type,
      });
    }
  }
  
  confirmCancel=()=>{
    this.setState({
      isConfirmModal:false,
      confirm_type:"",
      alert_messages:"",
      isConfirmSchedule:false,
    });
  }
  
  getGroupSelect = e => {
    let select_obj = document.getElementsByClassName('visit-group')[0].getElementsByTagName("select")[0];
    if(select_obj != undefined && select_obj != null){
      if(e.target.value.length > 65){
        select_obj.style.fontSize = "0.65rem";
      } else {
        select_obj.style.fontSize = "1rem";
      }
    }
    this.setState({
      visit_group_id: parseInt(e.target.id),
      visit_group_number: parseInt(e.target.number)
    });
  };
  
  moveGroup=async(action)=>{
    let path = "/app/api/v2/visit/add/group_patient";
    let post_data = {
      number:this.props.system_patient_id,
      visit_group_id:parseInt(this.state.visit_group_id),
      action,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then(() => {
        this.confirmCancel();
        this.props.handleOk(this.state.visit_group_number, this.state.visit_group_id);
        this.props.closeModal();
      })
      .catch(() => {
      
      });
  }
  
  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal group-move-modal first-view-modal">
          <Modal.Body>
            <Wrapper>
              <div className={'visit-place flex'}>
                <div className={'place-label'}>訪問診療先名</div>
                <div className={'label-name'}>{this.props.selected_place_name}</div>
              </div>
              <div className={'visit-group'}>
                <SelectorWithLabel
                  options={this.state.visit_group_data}
                  title="グループ名"
                  getSelect={this.getGroupSelect}
                  departmentEditCode={this.state.visit_group_id}
                />
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className={'cancel-btn'} onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={'red-btn'} onClick={this.openConfirmModal.bind(this, 'move')}>確定</Button>
          </Modal.Footer>
          {this.state.isConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.openConfirmModal.bind(this, 'schedule')}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isConfirmSchedule && (
            <SystemConfirmWithBtnModal
              firstMethod= {this.moveGroup.bind(this, 'cancel')}
              secondMethod= {this.moveGroup.bind(this, '')}
              confirmTitle= {this.state.confirm_message}
              first_btn_name={'中止する'}
              second_btn_name={'スケジュールは残す'}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>
      </>
    );
  }
}
GroupMoveModal.contextType = Context;
GroupMoveModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  selected_place_name:PropTypes.string,
  selected_group_id:PropTypes.number,
  system_patient_id:PropTypes.number,
  visit_group_data:PropTypes.array,
};

export default GroupMoveModal;
