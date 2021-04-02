import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/pro-solid-svg-icons";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 100%;
  float: left;
  .flex{
    display:flex;
    margin-top:10px;
  }  
  label {
    text-align: right;
    width: 120px;    
  }
  .label{
    padding-top:8px;
    font-size:16px;
  }
  .label-title{
    font-size:16px
  }
  input {
    width: 265px;
    font-size: 16px;
  }  
  .patient_id, .patient_name{
    font-size:25px;
  }
  .schedule_date{
    margin-top:10px;
    margin-bottom:10px;
    font-size:18px
  }
  .modal_container{
    padding-left:0%;
  }
  .react-datepicker-wrapper {
      width: fit-content;
      border: 1px solid;
      margin-left:128px;
      padding: 5px;
      .example-custom-input{
        font-size:20px;
      }

  }
  .modal_container{
    .pullbox{
      margin-top:10px;
    }
    .pullbox-title{
      width: 128px;
      text-align: right;
      padding-right: 10px;
    }
    .pullbox-label, .pullbox-select{
      width:265px;
    }
    th, td{
      text-align:center;
      vertical-align:middle;
    }
  }

  .radio-btn label{
    width: 60px;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 4px;
    margin: 0 5px;
    padding: 4px 5px;
  }

  .checkbox_area {
    padding-left: 15px;
    margin-top:10px;
    margin-left: 113px;
    margin-bottom: 15px;
    label{
      text-align:left;
      font-size:18px;
      width:128px;
    }
  }  
  .radio-btn label{
    font-size:14px;
  }
  .sub_title{
    letter-spacing:3px;
    font-size:16px;
  }
  .footer {    
    margin-top: 10px;
    text-align: center;
    padding-top:20px;
    clear:both;
    label{
      width:100px;      
    }        
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;
      margin-right: 30px;
      padding-left: 15px;
      padding-right: 15px;
    }
    .add-button {
      text-align: center;      
    }
    span {
      color: white;
      font-size: 15px;
      font-weight: 100;
      letter-spacing: 3px;
    }
  }  
}
 `;

class ScheduleHistoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schedule_item:this.props.schedule_item,
      schedule_date:new Date(),
      move_date_flag:0,
    }
  }

  
  // saveEditedSchedule = () => {
  //   var temp = {...this.state.schedule_item};
  //   temp.updated_flag = 1;    
  //   this.setState({
  //     schedule_item:temp}, ()=>{
  //       this.props.saveDailysisSchedule(this.state.schedule_item, this.state.schedule_item.patient_id, this.state.schedule_item.schedule_day);
  //       this.props.closeModal();    
  //     });    
  // }

  onHide=()=>{}

  render() {    
    let {schedule_item} = this.state;
    return  (
      <Modal show={true} onHide={this.onHide}  className="master-modal dial_history-modal">
        <Modal.Header>
          <Modal.Title>スケジュール移動履歴確認</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Wrapper>
              <div className="sub_title">{schedule_item.patient_number}:{schedule_item.patient_name}</div>
              <div className="modal_container">
                <table className="table table-bordered table-striped table-hover" id="code-table">
                  <thead>
                    <tr>
                      <th  className="delete"/>
                      <th className="">作業日</th>
                      <th className="">作業時間</th>
                      <th className="">本来透析日</th>
                      <th className="">時間帯</th>
                      <th>透析時間</th>
                      <th>ベッド</th>
                      <th>コンソール</th>
                      <th>グループ</th>
                      <th>変更後透析日</th>
                      <th className="">時間帯</th>
                      <th>透析時間</th>
                      <th>ベッド</th>
                      <th>コンソール</th>
                      <th>グループ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="delete"><Icon icon={faMinusCircle} /></td>
                      <td className="">2019/12/3</td>
                      <td className="">14:40</td>
                      <td>{schedule_item.schedule_date}</td>
                      <td>{schedule_item.dial_pattern.time_zone}</td>
                      <td>{schedule_item.dial_pattern.reservation_time}</td>
                      <td>{schedule_item.dial_pattern.bed_no}</td>
                      <td>{schedule_item.dial_pattern.console}</td>
                      <td>{schedule_item.dial_pattern.group}</td>
                      <td>{schedule_item.schedule_date}</td>
                      <td>{schedule_item.dial_pattern.time_zone}</td>
                      <td>{schedule_item.dial_pattern.reservation_time}</td>
                      <td>{schedule_item.dial_pattern.bed_no}</td>
                      <td>{schedule_item.dial_pattern.console}</td>
                      <td>{schedule_item.dial_pattern.group}</td>
                    </tr>
                  </tbody>                
                </table>              
              </div>
              <div className="footer footer-buttons">
                    {/* <Button type="mono" onClick={this.saveEditedSchedule}>登録</Button> */}
                    <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                    <Button className="red-btn" onClick={this.props.closeModal}>登録して再スケジュール</Button>
                    <Button className="red-btn" onClick={this.props.closeModal}>登録</Button>
              </div>
            </Wrapper>
        </Modal.Body>        
      </Modal>
    );
  }
}

ScheduleHistoryModal.contextType = Context;

ScheduleHistoryModal.propTypes = {
  closeModal: PropTypes.func,  
  schedule_item:PropTypes.array,
};

export default ScheduleHistoryModal;
