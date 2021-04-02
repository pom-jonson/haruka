import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { onSecondaryDark } from "~/components/_nano/colors";
import {formatTimeIE} from "../../../../helpers/date";

const DoubleModal = styled.div`
  font-family: NotoSansJP;
  font-size: 16px;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 4px 4px 4px 0;
  margin: 0;
  z-index:100;
  position: absolute;
    right: 10px;
    border: solid 1px gold;
    padding: 20px;
    border-radius: 10px;
    background: linear-gradient(45deg, #eae4e4, transparent);
`;

class SystemConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        content:{
            new_machine_data:  null,
            new_blood_data: null,
            new_log_data: null,
            new_alarm_data: null,
        }
    }    
  }

  async componentDidMount() {
    this.setState({
        content:{
            new_machine_data: this.props.content.new_machine_data != null && this.props.content.new_machine_data.length > 0 ? this.props.content.new_machine_data : null,
            new_blood_data: this.props.content.new_blood_data != null && this.props.content.new_blood_data.length > 0 ? this.props.content.new_blood_data : null,
            new_log_data: this.props.content.new_log_data != null && this.props.content.new_log_data.length > 0 ? this.props.content.new_log_data : null,
            new_alarm_data:this.props.content.new_alarm_data != null && this.props.content.new_alarm_data.length > 0 ? this.props.content.new_alarm_data : null,
        }
    })
  }
  openBloodModal = () => {
    this.setState({
        content:{
            new_machine_data:  this.state.content.new_machine_data,
            new_blood_data: null,
            new_log_data: this.state.content.new_log_data,
            new_alarm_data: this.state.content.new_alarm_data,
        }
    }, () => {
        this.closeModal();
    })
      this.props.openBloodModal();
  };

  openMachineModal = () => {
      this.setState({
          content:{
              new_machine_data: null,
              new_blood_data: this.state.content.new_blood_data,
              new_log_data: this.state.content.new_log_data,
              new_alarm_data: this.state.content.new_alarm_data,
          }
      }, () => {
          this.closeModal();
      });
    this.props.openMachineModal();
  };

  openLogModal = (type) => {
    if (type === 1){
      this.setState({
          content:{
              new_machine_data: this.state.content.new_machine_data,
              new_blood_data: this.state.content.new_blood_data,
              new_log_data: null,
              new_alarm_data: this.state.content.new_alarm_data,
          }
      }, () => {
          this.closeModal();
      })
    } else {
        this.setState({
            content:{
                new_machine_data: this.state.content.new_machine_data,
                new_blood_data: this.state.content.new_blood_data,
                new_log_data: this.state.content.new_log_data,
                new_alarm_data: null,
            }
        }, () => {
            this.closeModal();
        })
    }
    this.props.openLogModal();
  };
  closeModal = () => {
      if (this.state.content.new_alarm_data == null && this.state.content.new_blood_data == null &&
          this.state.content.new_machine_data == null && this.state.content.new_log_data == null){
          this.props.closeFlashPopUp();
      } else {
          return;
      }
  }

  render() {
    let new_machine_data = this.state.content != null && this.state.content.new_machine_data != undefined && this.state.content.new_machine_data;
    let new_blood_data = this.state.content != null && this.state.content.new_blood_data != undefined && this.state.content.new_blood_data;
    let new_log_data = this.state.content != null && this.state.content.new_log_data != undefined && this.state.content.new_log_data;
    let new_alarm_data = this.state.content != null && this.state.content.new_alarm_data != undefined && this.state.content.new_alarm_data;
    return (
            <DoubleModal>
            <div onClick={this.openMachineModal.bind(this)} style={{cursor:"pointer"}}>
                {new_machine_data != undefined && new_machine_data != null && new_machine_data.length > 0 && new_machine_data.map(item =>{
                  return (
                      <><span>{item.ms_current_time != null && formatTimeIE(item.ms_current_time)}</span><span>新しい計測値があります</span></>
                  )
                })}
            </div>
            <div onClick={this.openBloodModal.bind(this)} style={{cursor:"pointer"}}>
                {new_blood_data != undefined && new_blood_data != null && new_blood_data.length > 0 && new_blood_data.map(item =>{
                  return (
                      <><span>{item.bp_measure_time != null && formatTimeIE(item.bp_measure_time)}</span><span>新しい血圧データがあります</span></>
                  )
                })}
            </div>
            <div onClick={this.openLogModal.bind(this,1)} style={{cursor:"pointer"}}>
                {new_log_data != undefined && new_log_data != null && new_log_data.length > 0 && new_log_data.map(item =>{
                  return (
                      <><span>{item.ol_time != null && formatTimeIE(item.ol_time)}</span><span>新しい操作履歴データがあります</span></>
                  )
                })}
            </div>
            <div onClick={this.openLogModal.bind(this,0)} style={{cursor:"pointer"}}>
                {new_alarm_data != undefined && new_alarm_data != null && new_alarm_data.length > 0 && new_alarm_data.map(item =>{
                  return (
                      <><span>{item.al_create_time != null && formatTimeIE(item.al_create_time)}</span><span>新しい警報履歴データがあります</span></>
                  )
                })}
            </div>
            </DoubleModal>
    );
  }
}
SystemConfirmModal.propTypes = {  
    openBloodModal: PropTypes.func,
    openMachineModal: PropTypes.func,
    openLogModal: PropTypes.func,
    closeFlashPopUp: PropTypes.func,
    content: PropTypes.array,
};

export default SystemConfirmModal;
