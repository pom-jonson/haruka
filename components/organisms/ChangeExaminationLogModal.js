import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import {
  secondary200,
  disable
} from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import {displayLineBreak} from "~/helpers/dialConstants";
import {getStaffName} from "~/helpers/constants";
import EndoscopeImageModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeImageModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import axios from "axios";
import renderHTML from 'react-render-html';

const TabContent = styled.div`
  display: flex;
  max-width: 100%;
  width: 100%;
  flex-wrap: wrap;
  font-size: 13px;
  font-family: "Noto Sans JP", sans-serif;

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
  max-height: 70vh;
  height: 70vh;
  overflow-y: auto;
  .history-list {
    .text-blue {
      color: blue;
    }
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
  }
  .history-content {
    width: 100%;
    overflow-y: auto;
    height: calc(100% - 8rem);
    .content-header {
      background: aquamarine;
      text-align: left;
      font-size: 1rem;
    }
  }
 `;

const MedicineListWrapper = styled.div`
  font-size: 1rem;
  .text-red{
    color: #ff0000;
    text-decoration: line-through rgb(255, 0, 0);
  }

  .text-blue{
    color: #0000ff;
  }

  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${disable};
    }
  }

  .box {
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 50px;
    }
    &:after {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 80px;
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }

  .phy-box{
    line-height: 1.3;
    position: relative;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 175px;
    }    

    .text-left{
      .table-item{
        width: 165px;
        float: left;
        text-align: right;
      }
    }
    .text-right{
      .table-item{
        text-align: left;
        margin-left: 20px;
      }
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }

  .line-through {
    color: #ff0000;
  }

  .flex {
    display: flex;
    margin-bottom: 0;

    &.between {
      justify-content: space-between;

      div {
        margin-right: 0;
      }
    }

    div {
      margin-right: 8px;
    }

    .date {
      margin-left: auto;
      margin-right: 24px;
    }
  }
  .drug-item {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }

  .text-right {
    width: calc(100% - 88px);
  }

  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 20px);
    word-wrap: break-word;
  }
  .deleted-order {
    text-decoration: line-through;
  }
`;

const imageButtonStyle = {
  cursor: "pointer",
};

const imageOldButtonStyle = {
  cursor: "pointer",
};

export class ChangeExaminationLogModal extends Component {
  constructor(props) {
    super(props);
    const differences = this.checkDifference(this.props.historySoapList);
    this.state = {
      outputs: differences.outputs,
      history_list: this.props.historySoapList,
      isOpenInspectionImageModal: false
    };

    // YJ482 検体検査の注目マークの文字に何を使うかは動的にする
    let examination_attention_mark = "";
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
      if(initState.conf_data.examination_attention_mark !== undefined && initState.conf_data.examination_attention_mark != ""){
        examination_attention_mark = initState.conf_data.examination_attention_mark;
      }      
    }
    this.examination_attention_mark = examination_attention_mark;
  }
  async UNSAFE_componentWillMount() {
    let history_list = [...this.props.historySoapList];
    history_list.map(item=>{
      item.history_show = 1;
      item.substitute_name = item.is_doctor_consented == 2 ? "": getStaffName(item.updated_by);
    });
    const differences = this.checkDifference(this.props.historySoapList);
    this.setState({
      outputs: differences.outputs,
      history_list
    });
  }
  componentDidMount(){
    document.getElementById("log_cancel_id").focus();
  }
  checkDifference = (results) => {
    let outputs = [];
    let result = results.filter(x=>x.history_show==1);
    if (result.length > 0) {
      result.map((order, index) => {
        let version = this.props.historySoapList.findIndex(x=>x.number == order.number);
        version = this.props.historySoapList.length - version;
        let current = order;
        current.doctor_name = order.order_data.doctor_name;
        current.department_name = order.order_data.department;
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

  compareWithPrev = (cur, prev, cond) => {
    if (cond == "inspection-date") {
      if (cur != prev) {
        return "different";
      }
    }

    if (cond == "array") {
      let data = prev.map(item=>{
        return item.name;
      });
      if (!data.includes(cur)) {
        return "different";
      }
    }
    return "equal";
  }
  getRadio = async (number,name,value) => {
    if (name === "check") {
      let {history_list, outputs} = this.state;
      history_list.find(x=>x.number == number).history_show = value;
      outputs.find(x=>x.number == number).history_show = value;
      this.setState({
        history_list,
        outputs,
      });
    }
  };

  getChangeExaminations = (cur, prev) => {
    if (JSON.stringify(cur) == JSON.stringify(prev)) {
      return (
        <>
          {cur.map(item=>{
            return (<><div>{item.name}</div></>)
          })}
        </>
      )
    } else {
      let return_array = [];
      if (cur == undefined || cur.length == 0) {
        prev.map(item=>{
          item.is_deleted = 1;
          return_array.push(item);
        });
      } else if (prev == undefined || prev.length == 0) {
        cur.map(item=>{
          item.is_new  = 1;
          return_array.push(item);
        });
      } else {
        return_array = cur;
        return_array.map(item=>{
          if (prev.findIndex(x=>x.examination_code == item.examination_code) == -1) {
            item.is_new = 1;
          }
        });
        let removedIndex = 0;
        prev.map(prev_item=> {
          let removed = true;
          cur.map((cur_item, index)=>{
            if (prev_item.examination_code == cur_item.examination_code) {
              removed = false;
              removedIndex = index;
            }
          });
          if (removed == true) {
            prev_item.is_deleted = 1;
            return_array.splice(removedIndex+1, 0, prev_item)
          }
        })
      }
      return (
        <>
          {return_array.map((item, index)=>{
            return(
              <div key = {index} className={item.is_new==1 ?"text-blue": (item.is_deleted == 1 ?"deleted-order": "")}>
              {item.is_attention != undefined && item.is_attention == 1? this.examination_attention_mark: ""}{item.urgent == 1? "【至急】": ""}{item.name}
              </div>
            )
          })}
        </>
      )
    }
  }
  getChangeDoneNumbers = (cur_arr, prev_arr) => {
    let cur = [];
    let prev = [];
    if (prev_arr != undefined && prev_arr != null && prev_arr.length > 0) {
      prev_arr.map(item=>{
        prev.push({name:item});
      });
    }
    if (cur_arr != undefined && cur_arr != null && cur_arr.length > 0) {
      cur_arr.map(item=>{
        cur.push({name:item});
      });
    }
    if (JSON.stringify(cur) == JSON.stringify(prev)) {
      return (
        <>
          {cur.map(item=>{
            return (<><div>{item.name}</div></>)
          })}
        </>
      )
    } else {
      let return_array = [];
      if (cur == undefined || cur.length == 0) {
        prev.map(item=>{
          item.is_deleted = 1;
          return_array.push(item);
        });
      } else if (prev == undefined || prev.length == 0) {
        cur.map(item=>{
          item.is_new  = 1;
          return_array.push(item);
        });
      } else {
        return_array = cur;
        return_array.map(item=>{
          if (prev.findIndex(x=>x.name == item.name) == -1) {
            item.is_new = 1;
          }
        });
        let removedIndex = 0;
        prev.map(prev_item=> {
          let removed = true;
          cur.map((cur_item, index)=>{
            if (prev_item.name == cur_item.name) {
              removed = false;
              removedIndex = index;
            }
          });
          if (removed == true) {
            prev_item.is_deleted = 1;
            return_array.splice(removedIndex+1, 0, prev_item)
          }
        })
      }
      return (
        <>
          {return_array.map((item, index)=>{
            return(
              <div key = {index} className={item.is_new==1 ?"text-blue": (item.is_deleted == 1 ?"deleted-order": "")}>
                {item.name}
              </div>
            )
          })}
        </>
      )
    }
  }
  getChangeInstruction = (cur, prev) => {
    if (JSON.stringify(cur) == JSON.stringify(prev)) {
      return (
        <>
          {cur.map(item=>{
            return (<><div>{item.text}</div></>)
          })}
        </>
      )
    } else {
      let return_array = [];
      if (cur == undefined || cur.length == 0) {
        prev.map(item=>{
          item.is_deleted = 1;
          return_array.push(item);
        });
      } else if (prev == undefined || prev.length == 0) {
        cur.map(item=>{
          item.is_new  = 1;
          return_array.push(item);
        });
      } else {
        return_array = cur;
        return_array.map(item=>{
          if (prev.findIndex(x=>x.text == item.text) == -1) {
            item.is_new = 1;
          }
        });
        let removedIndex = 0;
        prev.map(prev_item=> {
          let removed = true;
          cur.map((cur_item, index)=>{
            if (prev_item.text == cur_item.text) {
              removed = false;
              removedIndex = index;
            }
          });
          if (removed == true) {
            prev_item.is_deleted = 1;
            return_array.splice(removedIndex+1, 0, prev_item)
          }
        })
      }
      return (
        <>
          {return_array.map((item, index)=>{
            return(
              <div key = {index} className={item.is_new==1 ?"text-blue": (item.is_deleted == 1 ?"deleted-order": "")}>
              {item.is_attention != undefined && item.is_attention == 1 ? this.examination_attention_mark: ""}{item.urgent == 1? "【至急】": ""}{item.text}
              </div>
            )
          })}
        </>
      )
    }
  }

  getChangePart = (cur, prev) => {
    if (cur == prev) {
      return (
        <>
          <div>{displayLineBreak(cur)}</div>
        </>
      )
    } else {
      if (cur == undefined || cur == null || cur == '') {
        return (
          <>
            <div className="deleted-order">{displayLineBreak(prev)}</div>
          </>
        )
      } else if (prev == undefined || prev == null || prev == '') {
        return (
          <div className="text-blue">{displayLineBreak(cur)}</div>
        )
      } else {
        return (
          <>
            <div className="text-blue">{displayLineBreak(cur)}</div>
            <div className='deleted-order'>{displayLineBreak(prev)}</div>
          </>
        )
      }
    }
  };

  getImagePart = (cur, prev, number) => {
    if (cur != undefined && cur != null && cur != "" && cur == prev) {
      return (
        <>
          <div>
            <a
              className="soap-image-title"
              onClick={() => this.openInspectionImageModal(number)}
              style={imageButtonStyle}
            >
              画像を見る
            </a>
          </div>
        </>
      )
    } else if ((cur == undefined || cur == null || cur == '') && (prev != undefined && prev != null && prev != '')) {
      return (
        <>
          <div className="deleted-order" style={imageOldButtonStyle}>画像を見る</div>
        </>
      )
    } else if ((prev == undefined || prev == null || prev == '') && (cur != undefined && cur != null && cur != '')) {
      return (
        <div className="text-blue">
          <a
            className="soap-image-title"
            onClick={() => this.openInspectionImageModal(number)}
            style={imageButtonStyle}
          >
            画像を見る
          </a>
        </div>
      )
    } else if (cur != undefined && cur != null && cur != '' && prev != undefined && prev != null && prev != ''){
      return (
        <>
          <div>
            <a
              className="soap-image-title"
              onClick={() => this.openInspectionImageModal(number)}
              style={imageButtonStyle}
            >
              画像を見る
            </a>
          </div>
          <div className='deleted-order' style={imageOldButtonStyle}>画像を見る</div>
        </>
      )
    }
  }

  // open shema
  openInspectionImageModal = async (number) => {
    let path = "/app/api/v2/order/examination/getImage";

    const { data } = await axios.post(path, {
      params: {
        number: number
      }
    });
    this.setState({
      endoscope_image: data,
      isOpenInspectionImageModal: true,
    });
  }

  closeModal = () => {
    this.setState({
      isOpenInspectionImageModal: false,
    });
  }

  render() {    
    let outputs = this.state.outputs;
    let history_list = this.state.history_list;
    return (
      <Modal show={true} size="lg" className="prescription_confirm_modal first-view-modal">
        <Modal.Header>
          <Modal.Title>変更履歴</Modal.Title>
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
                    <th className="w-5">診療科</th>
                    <th className="date">変更日時</th>
                    <th className="">変更者</th>
                  </tr>
                </thead>
                <tbody>
                  {history_list !== undefined && history_list !== null && history_list.length > 0 &&
                    history_list.map((item, index) => {
                      let idx = history_list.length - index;
                      let doctor_change = false;
                      if (history_list[index + 1] !== undefined) {
                        if (item.order_data.order_data.doctor_name !== history_list[index + 1].order_data.order_data.doctor_name) doctor_change = true;
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
                              {idx == 1 ? "初版" : parseInt(index).toString() + "版"}
                            </td>
                            <td className="w-3">
                              {item.is_enabled == 2 ? "削除" : (idx == 1 ? "新規" : "修正")}
                            </td>
                            <td className="w-5">
                              {item.order_data.department}
                            </td>
                            <td className="date">
                              {item.updated_at.split('-').join('/')}
                            </td>
                            <td className="text-left">
                              <span className={doctor_change ? "text-blue":""}>{item.order_data.order_data.doctor_name}</span>
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
            <div className="history-content">
              {outputs != undefined && outputs != null && outputs.length > 0 && outputs.map(output=>{
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
                            <span className="mr-3">{output.department_name}</span>
                            <span className="mr-3">{output.updated_at.split('-').join('/')}</span>
                            <span className="mr-3 doctor-name-area">{renderHTML(doctor_name)}</span>
                          </div>
                          <MedicineListWrapper>
                            <div className={`history-item soap-data-item ${output.openTag == 1 && output.class_name.includes('open') ? `${output.class_name} order` : ''}`}>
                              <div className={`history-item ${output.is_enabled == 2 ? "deleted-order" : ""}`}>
                                <div className="phy-box w70p" draggable="true">
                                    <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                            <div className="table-item">{output.order_data.order_data.administrate_period !== undefined && output.order_data.order_data.administrate_period != null ? "採取(予定)日時":"採取日時"}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {output.order_data.order_data.administrate_period !== undefined && output.order_data.order_data.administrate_period != null ? (
                                                <>
                                                  {output.prev == null ? (
                                                    this.getChangeDoneNumbers(output.order_data.order_data.administrate_period.done_days, undefined)
                                                  ):(
                                                    this.getChangeDoneNumbers(output.order_data.order_data.administrate_period.done_days, output.prev.order_data.order_data.administrate_period.done_days)
                                                  )}
                                                </>
                                              ):(
                                                <>
                                                  {output.prev == null ? (
                                                    this.getChangePart(output.order_data.order_data.collected_date, undefined)
                                                  ):(
                                                    this.getChangePart(output.order_data.order_data.collected_date, output.prev.order_data.order_data.collected_date)
                                                  )}
                                                </>
                                              )}
                                            </div>
                                        </div>
                                    </div>
                                    {(output.order_data.order_data.subject !== "" || (output.prev != null && output.prev.order_data.order_data.subject !== "")) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">概要</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.subject, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.subject, output.prev.order_data.order_data.subject)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.order_data.order_data.examinations != undefined && output.order_data.order_data.examinations != null && output.order_data.order_data.examinations.length > 0) ||
                                    (output.prev != null && output.prev.order_data.order_data.examinations != undefined && output.prev.order_data.order_data.examinations != null && output.prev.order_data.order_data.examinations.length > 0)) && (
                                    <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                            <div className="table-item">検査項目</div>
                                        </div>
                                        <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {output.prev == null ?(
                                            this.getChangeExaminations(output.order_data.order_data.examinations, undefined)
                                          ) : (
                                            this.getChangeExaminations(output.order_data.order_data.examinations, output.prev.order_data.order_data.examinations)
                                          ) }
                                        </div>
                                        </div>
                                    </div>
                                    )}
                                    {((output.order_data.order_data.free_instruction != undefined && output.order_data.order_data.free_instruction.length > 0) ||
                                    (output.prev != null && output.prev.order_data.order_data.free_instruction != undefined && output.prev.order_data.order_data.free_instruction.length > 0)) && (
                                      <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                              <div className="table-item">自由入力オーダー</div>
                                          </div>
                                          <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ?(
                                              this.getChangeInstruction(output.order_data.order_data.free_instruction, undefined)
                                            ) : (
                                              this.getChangeInstruction(output.order_data.order_data.free_instruction, output.prev.order_data.order_data.free_instruction)
                                            ) }
                                          </div>
                                          </div>
                                      </div>
                                    )}
                                    {(output.order_data.order_data.order_comment !== "" ||
                                     (output.prev != null && output.prev.order_data.order_data.order_comment !== "")) && (
                                        <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                                <div className="table-item">
                                                  {output.order_data.order_data.order_comment_urgent != undefined && output.order_data.order_data.order_comment_urgent == 1?"【至急】":""}
                                                  {output.order_data.order_data.fax_report != undefined && output.order_data.order_data.fax_report == 1?"【FAX報告】":""}
                                                  依頼コメント
                                                </div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                {output.prev == null ? (
                                                  this.getChangePart(output.order_data.order_data.order_comment, undefined)
                                                ):(
                                                  this.getChangePart(output.order_data.order_data.order_comment, output.prev.order_data.order_data.order_comment)
                                                )}
                                              </div>
                                            </div>
                                        </div>
                                    )}
                                    {(output.order_data.order_data.free_comment !== "" || (output.prev != null && output.prev.order_data.order_data.free_comment !== "")) && (
                                        <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                                <div className="table-item">フリーコメント</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                {output.prev == null ? (
                                                  this.getChangePart(output.order_data.order_data.free_comment, undefined)
                                                ):(
                                                  this.getChangePart(output.order_data.order_data.free_comment, output.prev.order_data.order_data.free_comment)
                                                )}
                                              </div>
                                            </div>
                                        </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.image_path != undefined && output.prev.order_data.order_data.image_path != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.image_path != undefined && output.order_data.order_data.image_path != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item"></div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getImagePart(output.order_data.order_data.image_path, undefined, output.number)
                                            ):(
                                              this.getImagePart(output.order_data.order_data.image_path, output.prev.order_data.order_data.image_path, output.number)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </MedicineListWrapper>
                        </div>
                      </div>
                    </TabContent>
                    </>
                  )
                }
              })}
            </div>
            {this.state.isOpenInspectionImageModal == true && (
              <EndoscopeImageModal
                closeModal={this.closeModal}
                imgBase64={this.state.endoscope_image}
              />
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} id='log_cancel_id' className="cancel-btn">閉じる</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
ChangeExaminationLogModal.contextType = Context;

ChangeExaminationLogModal.propTypes = {
  closeModal: PropTypes.func,
  getDepartmentName: PropTypes.func,
  orderNumber: PropTypes.number,
  insuranceTypeList: PropTypes.array,
  historySoapList: PropTypes.array,
};

export default ChangeExaminationLogModal;