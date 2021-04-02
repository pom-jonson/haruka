import React, { Component} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import {getStaffName, getDoctorName} from "~/helpers/constants";
import renderHTML from 'react-render-html';

const TabContent = styled.div`
  display: flex;
  max-width: 100%;
  width: 100%;
  flex-wrap: wrap;
  font-size: 13px;
  font-family: "Noto Sans JP", sans-serif;
  .history-data {
    font-size: 1rem;
  }
  .doctor-name-area{
    span{
      color: blue;
    }
  }
  .row {
    display: flex;
    width: 100%;
    margin: auto;

    .right {
      text-align: right;
    }

    .blue {
      color: #0000ff;
    }

    .red {
      text-decoration: line-through;
    }
  }
`;

const Wrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  .no-result {
    padding: 200px;
    text-align: center;
    padding-top: 30vh;

    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
  .history-list {
    width: 100%;
    overflow-y: auto;
    font-size: 1rem;
    table {
      thead{
        display:table;
        width:100%;
      }
      tbody{
          display:block;
          overflow-y: auto;
          height: 4.25rem;
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
          width: 2.3rem;
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
    .text-blue {
      color: blue;
    }
  }
  .history-content {
    width: 100%;
    overflow-y: auto;
    height: calc(100% - 10.5rem);
    .content-header {
      background: aquamarine;
      text-align: left;
      font-size: 1rem;
    }
  }
 `;
  
  class BulkHistoryModal extends Component {
    constructor(props) {
      super(props);
      var history_data = this.props.history_data;
      
      this.state = {
        selected_history_number: 0,
        select_history: history_data[0],
        history_data,
        outputs:[],
        history_list:[]
      }
    }
  
    async UNSAFE_componentWillMount() {
      let {select_history} = this.state;
      this.getHistory(select_history);
    }
    
    getHistory = (select_history) => {
      if (select_history === undefined) return;
      let history_list = [...select_history.history_data];
      history_list.map(item=>{
        item.history_show = 1;
        item.substitute_name = item.is_doctor_consented == 2 ? "" : getStaffName(item.updated_by);
      });
      const differences = this.checkDifference(select_history.history_data);
      this.setState({
        outputs: differences.outputs,
        history_list,
      });
    }
  
    checkDifference = (results) => {
      let outputs = [];
      let {select_history} = this.state;
      let result = results.filter(x=>x.history_show==1);
      if (result.length > 0) {
        result.map((order, index) => {
          let version = select_history.history_data.findIndex(x=>x.number == order.number);
          version = select_history.history_data.length - version;
          let current = order;
          current.doctor_name = getDoctorName(order.instruction_doctor_number);
          current.substitute_name = order.is_doctor_consented == 2 ? "": getStaffName(order.updated_by);
          current.version = version;
          if (index < result.length - 1) {
            current.prev = result[index + 1];
            let output = current;
            output.history_show = 1;
            outputs.push(output);
          } else {
            current.prev = null;
            let output = current;
            output.history_show = 1;
            outputs.push(output);
          }
        });
      }
      return {
        outputs: outputs
      };
    };
    getRadio = async (number,name,value) => {
      if (name === "check") {
        let {history_list, outputs} = this.state;
        history_list.find(x=>x.number == number).history_show = value;
        outputs.find(x=>x.number == number).history_show = value;
        this.setState({
          history_list,
          outputs
        });
      }
    };
    
    selectBeforeHistory = () => {
      let {selected_history_number, history_data} = this.state;
      if (history_data.length === 1) return;
      if (selected_history_number === history_data.length - 1) return;
      selected_history_number = parseInt(selected_history_number)+1
      let select_history = history_data[selected_history_number];
      this.getHistory(select_history)
      this.setState({
        selected_history_number,
        select_history
      });
    }
    selectNextHistory = () => {
      let {selected_history_number, history_data} = this.state;
      if (history_data.length === 1) return;
      if (selected_history_number === 0) return;
      selected_history_number = parseInt(selected_history_number)-1;
      let select_history = history_data[selected_history_number];
      this.getHistory(select_history)
      this.setState({
        selected_history_number,
        select_history
      });
    }
    
    render() {
      let {history_list, outputs, select_history, selected_history_number, history_data} = this.state;
      let before_disable = history_data.length === 1 || selected_history_number === history_data.length - 1;
      let after_disable = history_data.length === 1 || selected_history_number === 0;
      return (
        <Modal show={true} className="custom-modal-sm notice-modal">
          <Modal.Header>
              <Modal.Title style={{width:'20rem'}}>更新履歴</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              {select_history === undefined ? (
                <div className="no-result"><span>登録されていません。</span></div>
              ):(
                <>
                  <div className="w-100 d-flex text-left mb-2">
                    <div className="w-50">{select_history.hospital_during}</div>
                    <div className="btn-area w-50 text-right">
                      <Button type="common" isDisabled={before_disable} className={before_disable ? "disable-btn mr-2":"mr-2"} onClick={this.selectBeforeHistory.bind(this)}>前回</Button>
                      <Button type="common" isDisabled={after_disable} className={after_disable ? "disable-btn":""} onClick={this.selectNextHistory.bind(this)}>次回</Button>
                    </div>
                  </div>
                  {history_list !== undefined && history_list != null && history_list.length > 0 ? (
                    <>
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
                          {history_list !== undefined &&
                          history_list !== null &&
                          history_list.length > 0 &&
                          history_list.map((item, index) => {
                            index = history_list.length - index;
                            let doctor_change = false;
                            if (index > 1 && history_list[index - 1] !== undefined) {
                              if (item.doctor_name !== history_list[index - 1].doctor_name) doctor_change = true;
                            }
                            return (
                              <>
                                <tr>
                                  <td className="text-center check">
                                    <Checkbox
                                      label=""
                                      getRadio={this.getRadio.bind(this, item.number)}
                                      value={item.history_show}
                                      name="check"
                                    />
                                  </td>
                                  <td className="version">
                                    {index == 1 ? "初版" : parseInt(index).toString() + "版"}
                                  </td>
                                  <td className="w-3">
                                    {item.is_enabled == 2 ? "削除" : (index == 1 ? "新規" : "修正")}
                                  </td>
                                  <td className="date">
                                    {item.updated_at.split('-').join('/')}
                                  </td>
                                  <td className="text-left">
                                    <span className={doctor_change ? "text-blue":""}>{item.doctor_name}</span>
                                    {item.substitute_name !== undefined && item.substitute_name !== "" && (
                                      <span>、 入力者: {item.substitute_name}</span>
                                    )}
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                          </tbody>
                        </table>
                      </div>
                      <div className="history-content border-top border-bottom">
                      {outputs !== undefined && outputs != null && outputs.length > 0 && outputs.map(output=>{
                        if(output.history_show == 1) {
                          let doctor_name = "";
                          if (output.substitute_name !== "" && output.substitute_name != undefined) {
                            if (output.prev != undefined && output.prev != null && output.prev.doctor_name != undefined && output.doctor_name != output.prev.doctor_name) {
                              doctor_name = "<span>" + output.doctor_name + "、" + "</span>" + " 入力者: " + output.substitute_name;
                            } else {
                              doctor_name = output.doctor_name + "、" + " 入力者: " + output.substitute_name;
                            }
                          } else {
                            if (output.prev != undefined && output.prev != null && output.prev.doctor_name != undefined && output.doctor_name != output.prev.doctor_name) {
                              doctor_name = "<span>" + output.doctor_name + "</span>";
                            } else {
                              doctor_name = output.doctor_name;
                            }
                          }
        
                          return (
                            <>
                              <TabContent>
                                <div className="row">
                                  <div className="content w-100">
                                    <div className="content-header">
                                      <span className="mr-3">{"（" + (output.version == 1 ? "初" : output.version) + "版）"}</span>
                                      <span className="mr-3">{output.is_enabled == 2 ? "削除" : (output.version == 1 ? "新規" : "修正")}</span>
                                      <span className="mr-3">{output.updated_at.split('-').join('/')}</span>
                                      <span className="mr-3 doctor-name-area">{renderHTML(doctor_name)}</span>
                                    </div>
                
                                  </div>
                                </div>
                                <div className="history-data w-100 border p-2">
                                  {output.data.map(item=>{
                                    return (
                                      <div key={item}>{item.left_text}：{item.right_text}</div>
                                    )
                                  })}
                                </div>
                              </TabContent>
                            </>
                          )
                        }
                      })}
                    </div>
                    </>
                  ):(
                    <div className="no-result"><span>登録されていません。</span></div>
                  )}
                </>
              )}
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
              <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
          </Modal.Footer>
          </Modal>        
      );
    }
  }
  BulkHistoryModal.contextType = Context;
  
  BulkHistoryModal.propTypes = {
    closeModal: PropTypes.func,
    patientId: PropTypes.number,
    history_data:PropTypes.array,
  };
  
  export default BulkHistoryModal;