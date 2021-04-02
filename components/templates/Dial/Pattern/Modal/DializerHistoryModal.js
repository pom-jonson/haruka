import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import * as methods from "../../DialMethods";
// import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
// import * as apiClient from "~/api/apiClient";
import { 
  // displayLineBreak, 
  getWeekday } from "~/helpers/dialConstants";
// import renderHTML from 'react-render-html';

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  float: left;
  height: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;
  p {
    margin-bottom: 0;
  }
  .history-list {
    width: 100%;
    height:10rem;
    font-size: 1rem;
    table {
      margin-bottom: 0;
      thead{
        display:table;
        width:100%;
      }
      tbody{
          display:block;
          overflow-y: scroll;
          height: 10rem;
          width:100%;
      }
      tr{
          display: table;
          width: 100%;
      }
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
      td {
        word-break: break-all;
          padding: 0.25rem;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      }
      .check {
          width: 2rem;
          label {
            margin-right: 0;
          }
      }
      .date {
          width: 10rem;
      }
      .version {
          width: 3rem;
      }
      .w-3 {
        width: 3rem;
      }
      .w-5 {
        width: 5rem;
      }
      .name{
        width:20rem;
      }
    }
  }
  .history-content {
    width: 100%;
    font-size:1rem;
    height:33rem;
    .content-header {
      background: lightblue;
      text-align: left;
    }
    .w100{
      width:100%;
      border:1px solid lightgray;
      text-align:left;
    }
    .w50{
      width:50%;      
    }
    .deleted-order .row{
      background-position: 0px 50%;
      color: black;
      text-decoration: none;
      background-image: linear-gradient(rgb(0,0,0), rgb(0,0,0));
      background-repeat: repeat-x;
      background-size: 100% 1px;
    }
    .content-body {
      overflow-y: hidden;
      height: 33rem;
      // border: solid 1px lightgray;
      .blue-div {
        color: blue;
      }
      .deleted {
        background-position: 0px 50%;
        color: black;
        text-decoration: none;
        background-image: linear-gradient(rgb(0,0,0), rgb(0,0,0));
        background-repeat: repeat-x;
        background-size: 100% 1px;
      }
    }
    .content-title {
      .left-div {
        width: calc(50% - 8.5px);
      }
      .right-div {
        width: calc(50% + 8.5px);
      }
    }
    table {
      margin-bottom: 0;
      thead{
        display:table;
        width:100%;
      }
      tbody{
          display:block;
          overflow-y: auto;
          height: 31rem;
          width:100%;
      }
      tr{
          display: table;
          width: 100%;
      }
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
      td {
        word-break: break-all;
        padding: 0.25rem;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      }
      .check {
          width: 2rem;
          label {
            margin-right: 0;
          }
      }
      .date {
          width: 10rem;
      }
      .version {
          width: 3rem;
      }
      .w-3 {
        width: 3rem;
      }
      .w-5 {
        width: 5rem;
      }
      .name{
        width:13rem;
      }
      .week{
        width:14rem;
      }
      .period{
        width:12rem;
      }
      .doctor-name{
        width:10rem;
      }
    }
  }
 `;

export class DializerHistoryModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
        name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );    
    this.state = {      
    };
  }

  componentDidMount = async() => {
    await this.getDoctors();
    await this.getStaffs();
    var selected_history_item = this.props.selected_history_item;
    var history_list = selected_history_item.history_data != null?selected_history_item.history_data:[selected_history_item];    
    this.makeHistoryList(history_list);
  }

  makeHistoryList = async(history_list) => {
    this.outputs = [];
    let result = JSON.parse(JSON.stringify(history_list));    
    result.map((item, index) => {
      item.enable_show = true;      
      let prev = undefined;      
      if (index < result.length - 1) {
        prev = result[index + 1];
        item.prev = prev;
      }      
      this.outputs.push(item);
    });    
    this.setState({history_list:result});
  }
  
  getRadio = async (number,name,value) => {
    if (name === "check") {
      let {history_list} = this.state;
      history_list.find(x=>x.number == number).enable_show = value;
      this.outputs.find(x=>x.number == number).enable_show = value;
      this.forceUpdate();
    }
  };

  render() {    
    var {history_list,doctor_list_by_number, staff_list_by_number} = this.state;    
    return (
      <Modal show={true} size="lg" className="modal-history-drkarte master-modal">
        <Modal.Header>
          <Modal.Title>ダイアライザパターン変更履歴</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="history-list">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th className="check"></th>
                    <th className="version">版数</th>
                    <th className="w-3">進捗</th>
                    <th className="date">変更日時</th>
                    <th className="">変更者</th>
                  </tr>
                </thead>
                <tbody>                  
                  {history_list !== undefined && history_list !== null && history_list.length > 0 &&
                    doctor_list_by_number != undefined && staff_list_by_number != undefined && 
                    history_list.map((item, index) => {
                      index = history_list.length - index;                      
                      return (
                        <>
                          <tr>
                            <td className="text-center check">
                              <Checkbox
                                label=""
                                getRadio={this.getRadio.bind(this, item.number)}
                                value={item.enable_show}
                                name="check"
                              />
                            </td>
                            <td className="version">
                              {index == 1 ? "初版" : parseInt(index).toString() + "版"}
                            </td>
                            <td className="w-3">
                              {index == 1 ? "新規" : "修正"}
                            </td>
                            <td className="date">
                              {item.updated_at.split('-').join('/')}
                            </td>
                            <td className="text-left">
                              {doctor_list_by_number[item.instruction_doctor_number]}
                              {item.updated_by != null && staff_list_by_number[item.updated_by]!= doctor_list_by_number[item.instruction_doctor_number] && ("、 入力者: " + staff_list_by_number[item.updated_by])}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </table>
            </div>    
            <div className="history-content">
              <div className="content-body">
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                        <th className="version">版数</th>
                        <th className="w-3">進捗</th>
                        <th className="date">変更日時</th>
                        <th className="name">名称</th>
                        <th className="week">曜日</th>
                        <th className="period">期間</th>
                        <th className="doctor-name">依頼医</th>
                        <th className="">入力者</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.outputs != undefined && this.outputs != null && this.outputs.length > 0 && doctor_list_by_number != undefined && staff_list_by_number != undefined &&
                    this.outputs.map((item, index) => {
                      index = this.outputs.length - index;
                      if (item.enable_show){
                        return (
                          <>
                          <tr>
                            <td className='version'>{index == 1 ? "初版" : parseInt(index).toString() + "版"}</td>
                            <td className='w-3'>{index == 1 ? "新規" : "修正"}</td>
                            <td className='date'>{item.updated_at.split('-').join('/')}</td>
                            <td className={'name ' + (index == 1?'blue-div':'')}>
                              <div className={item.prev != undefined && item.name != item.prev.name?'blue-div':''}>{item.name}</div>
                              {item.prev != undefined && item.name != item.prev.name && (
                                <del>{item.prev.name}</del>
                              )}
                            </td>
                            <td className={'week ' + (index == 1?'blue-div':'')}>
                              <div className={item.prev != undefined && item.weekday != item.prev.weekday?'blue-div':''}>
                                {getWeekday(item.weekday).join('・')}
                              </div>
                              {item.prev != undefined && item.weekday != item.prev.weekday && (
                                <del>{getWeekday(item.prev.weekday).join('・')}</del>
                              )}
                            </td>
                            <td className={'period ' + (index == 1?'blue-div':'')}>
                              <div className={item.prev != undefined && (item.time_limit_to != item.prev.time_limit_to || item.time_limit_from != item.prev.time_limit_from)?'blue-div':''}>
                                {item.time_limit_from}～{item.time_limit_to != null?item.time_limit_to:'無期限'}
                              </div>
                              {item.prev != undefined && (item.time_limit_to != item.prev.time_limit_to || item.time_limit_from != item.prev.time_limit_from) && (
                                <del>{item.prev.time_limit_from}～{item.prev.time_limit_to != null?item.prev.time_limit_to:'無期限'}</del>
                              )}
                            </td>
                            <td className='doctor-name'>
                              {item.instruction_doctor_number > 0?doctor_list_by_number[item.instruction_doctor_number]:''}
                            </td>
                            <td className=''>{item.updated_by != null && staff_list_by_number[item.updated_by]!= doctor_list_by_number[item.instruction_doctor_number]
                              ?staff_list_by_number[item.updated_by]:''}
                            </td>
                          </tr>
                          </>
                        )
                      }
                      
                    })}
                  </tbody>
                </table>     
            </div>
            </div>        
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.props.closeModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
            <span>閉じる</span>
          </div>
          {/* <Button onClick={this.props.closeModal} className="cancel-btn">閉じる</Button> */}
        </Modal.Footer>
      </Modal>
    );
  }
}
DializerHistoryModal.contextType = Context;

DializerHistoryModal.propTypes = {
  closeModal: PropTypes.func,  
  selected_history_item: PropTypes.array
};

export default DializerHistoryModal;