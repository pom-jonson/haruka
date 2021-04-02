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
      overflow-y: scroll;
      height: 31rem;
      border: solid 1px lightgray;
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
  }
 `;

export class AntiHistoryModal extends Component {
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
      item.new = true;
      let prev = undefined;
      let chanage_history = [];
      if (index > 0) {
        prev = result[index - 1];
        item.prev = prev;
      }
      item.chanage_history = chanage_history;            
      this.outputs.push(item);
    });
    this.outputs.reverse();
    this.setState({history_list:result.reverse()});
  }
  
  getRadio = async (number,name,value) => {
    if (name === "check") {
      let {history_list} = this.state;
      history_list.find(x=>x.number == number).enable_show = value;
      this.outputs.find(x=>x.number == number).enable_show = value;
      this.forceUpdate();
    }
  };

  getInDetailItems = (code, data) => {    
    if (data == undefined || data.pattern == undefined || data.pattern.length == 0) return false;
    var item_data = data.pattern;
    var index = item_data.findIndex(x => x.code == code);
    if (index == -1) return false;
    return item_data[index];
  }

  render() {    
    var {history_list,doctor_list_by_number, staff_list_by_number} = this.state;    
    return (
      <Modal show={true} size="lg" className="modal-history-drkarte master-modal">
        <Modal.Header>
          <Modal.Title>抗凝固法パターン変更履歴</Modal.Title>
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
              {this.outputs != undefined && this.outputs != null && this.outputs.length > 0 && doctor_list_by_number != undefined && staff_list_by_number != undefined &&
                this.outputs.map((item, index) => {
                  index = this.outputs.length - index;
                  var pattern_name_changed = (item.prev != undefined && item.pattern_title != item.prev.pattern_title);
                  if(item.enable_show){                    
                    return(
                      <>
                      <div className="content-header pl-1">
                        <span className="mr-3">{index == 1 ? "初版" : parseInt(index).toString() + "版"}</span>
                        <span className="mr-3">{index == 1 ? "新規" : "修正"}</span>                            
                        <span className="mr-3">{item.updated_at.split('-').join('/')}</span>
                        <span className="mr-3">
                          {doctor_list_by_number[item.instruction_doctor_number]}
                          {item.updated_by != null && staff_list_by_number[item.updated_by]!= doctor_list_by_number[item.instruction_doctor_number] && ("、 入力者: " + staff_list_by_number[item.updated_by])}
                        </span>
                      </div>
                      <div className='content-main'>
                        <div className={'w100'}>
                          <div className={(index == 1 || pattern_name_changed)?'w100 blue-div':''}>{item.pattern_title}</div>
                          {pattern_name_changed && (
                            <>
                            <del>{item.prev.pattern_title}</del>
                            </>
                          )}
                        </div>
                        {item.pattern.map((pattern_item, item_index) => {
                          var detail_item_in_prev = this.getInDetailItems(pattern_item.item_code, item.prev);                          
                          var deleted_detail_items = [];
                          if (pattern_name_changed != true && item.prev != undefined && item.prev.pattern != undefined && item.prev.pattern != null){
                            item.prev.pattern.map(prev_pattern_item => {
                              if (item.pattern.findIndex(x => x.code == prev_pattern_item.code) == -1) deleted_detail_items.push(prev_pattern_item);
                            })
                          }                          
                          return(
                            <>
                            <div className={'w100 flex ' + (index == 1?'blue-div':'')}>
                              <div style={{width:'80%', borderRight:'1px solid lightgray'}}>
                                <div className={(pattern_name_changed != true && detail_item_in_prev != false) ? (deleted_detail_items[item_index] != undefined?'blue-div':'') : 'blue-div'}>
                                  {pattern_item.name}
                                </div>
                                {deleted_detail_items[item_index] != undefined && (
                                  <del>{deleted_detail_items[item_index].name}</del>
                                )}
                              </div>
                              <div style={{width:'10%', borderRight:'1px solid lightgray'}} className='text-right'>                                
                                <div className={(pattern_name_changed != true && detail_item_in_prev != false) ? (detail_item_in_prev.amount != pattern_item.amount?'blue-div':'') : 'blue-div'}>
                                  {pattern_item.amount}
                                </div>
                                {pattern_name_changed != true && detail_item_in_prev != false && detail_item_in_prev.amount != pattern_item.amount && (
                                  <del>{detail_item_in_prev.amount}</del>
                                )}
                              </div>
                              <div style={{width:'10%'}}>
                                <div className={pattern_name_changed != true && detail_item_in_prev != false ? (detail_item_in_prev.unit != pattern_item.unit?'blue-div':'') : 'blue-div'}>{pattern_item.unit}</div>
                                {pattern_name_changed != true && detail_item_in_prev != false && detail_item_in_prev.unit != pattern_item.unit && (
                                  <del>{detail_item_in_prev.unit}</del>
                                )}
                              </div>
                            </div>
                            </>
                          )
                        })}
                        <div className={'w100'}>
                          <div className={(index == 1 || (item.prev != undefined && item.weekday != item.prev.weekday))?'w100 blue-div':''}>
                            {getWeekday(item.weekday).join('・')}
                          </div>
                          {item.prev != undefined && item.weekday != item.prev.weekday && (
                            <>
                            <del>{getWeekday(item.prev.weekday).join('・')}</del>
                            </>
                          )}
                        </div>
                        <div className={'w100'}>
                          <div className={(index == 1 || (item.prev != undefined && (item.time_limit_to != item.prev.time_limit_to || item.time_limit_from != item.prev.time_limit_from)))?'w100 blue-div':''}>
                            {item.time_limit_from}～{item.time_limit_to != null?item.time_limit_to:'無期限'}
                          </div>
                          {item.prev != undefined && (item.time_limit_to != item.prev.time_limit_to || item.time_limit_from != item.prev.time_limit_from) && (
                            <>
                            <del>{item.prev.time_limit_from}～{item.prev.time_limit_to != null?item.prev.time_limit_to:'無期限'}</del>
                            </>
                          )}
                        </div>
                      </div>
                      </>
                    )
                  }
                })
               }               
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
AntiHistoryModal.contextType = Context;

AntiHistoryModal.propTypes = {
  closeModal: PropTypes.func,  
  selected_history_item: PropTypes.array
};

export default AntiHistoryModal;