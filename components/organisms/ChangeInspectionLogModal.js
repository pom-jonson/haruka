import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import {secondary200, disable} from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import {displayLineBreak} from "~/helpers/dialConstants";
import EndoscopeImageModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeImageModal";
import axios from "axios";
import {getMultiReservationInfo, getStaffName} from "~/helpers/constants";
import {formatJapanDateSlash} from "~/helpers/date";
import renderHTML from 'react-render-html';

const TabContent = styled.div`
  display: flex;
  max-width: 100%;
  width: 100%;
  flex-wrap: wrap;
  font-size: 13px;
  font-family: "Noto Sans JP", sans-serif;

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
  .doctor-name-area{
    span{
      color: blue;
    }
  }
  .history-list {
    width: 100%;
    overflow-y: auto;
    font-size: 1rem;
    .text-blue {
      color: blue;
    }
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

const imageButtonStyle = {
  // textAlign: "right",
  // color: "blue",
  cursor: "pointer",
  // float: "right",
  // width: "100%"
};

const imageOldButtonStyle = {
  // textAlign: "right",
  cursor: "pointer",
  // float: "right",
  // width: "100%"
};

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
      left: 160px;
    }

    .text-left{
      .table-item{
        width: 150px;
        float: left;
        text-align: right;
        p {margin-bottom:0;}
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
    text-decoration: line-through !important;
    label {
      text-decoration: line-through !important;
    }
  }
`;

export class ChangeInspectionLogModal extends Component {
  constructor(props) {
    super(props);
    const differences = this.checkDifference(this.props.historySoapList);
    this.state = {
      outputs: differences.outputs,
      history_list: this.props.historySoapList,
      isOpenInspectionImageModal: false
    };
  }
  async UNSAFE_componentWillMount() {
    let history_list = [...this.props.historySoapList];
    history_list.map(item=>{
      item.history_show = 1;
      item.substitute_name =item.is_doctor_consented == 2 ? "": getStaffName(item.updated_by);
    });
    const differences = this.checkDifference(this.props.historySoapList);
    this.setState({
      outputs: differences.outputs,
      history_list
    });
  }
  
  checkDifference = (results) => {
    let outputs = [];
    let result = results.filter(x=>x.history_show==1);
    if (result.length > 0) {
      result.map((order, index) => {
        let version = this.props.historySoapList.findIndex(x=>x.number == order.number);
        version = this.props.historySoapList.length - version;
        let current = order;
        current.doctor_name = order.order_data.order_data.doctor_name;
        current.department_name = this.props.getDepartmentName(order.order_data.order_data.department_id);
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
  componentDidMount(){
    document.getElementById("log_cancel_id").focus();
  }
  
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
  
  getChangePart = (cur, prev, type) => {
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
        if(type === "html"){
          return (
            <>
              <div>{displayLineBreak(cur)}</div>
            </>
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
  getChangeArray = (cur, prev, is_prefix = 0) => {
    if (JSON.stringify(cur) == JSON.stringify(prev)) {
      return (
        <>
          {cur.map((item,index)=>{
            let prefix = "、";
            if (index == 0) prefix = "";
            return (<><label>{is_prefix == 1 ? prefix:""}{item.name}</label></>)
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
            let prefix = "、";
            if (index == 0) prefix = "";
            return(
              <label key = {index} className={item.is_new==1 ?"text-blue": (item.is_deleted == 1 ?"deleted-order": "")}>
                {is_prefix == 1 ? prefix:""}{item.name}
              </label>
            )
          })}
        </>
      )
    }
  };
  getChangeArraySpecial = (cur, prev) => {
    if (JSON.stringify(cur) == JSON.stringify(prev)) {
      return (
        <>
          {cur.map((item, index)=>{
            return (
              <div className="flex between drug-item table-row" key={index}>
                <div className="text-left">
                  <div className="table-item">{item.title}</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment"><div key = {index} >
                    {item.name}
                  </div></div>
                </div>
              </div>
            )
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
              <div className="flex between drug-item table-row" key={index}>
                <div className="text-left">
                  <div className="table-item">{item.title}</div>
                </div>
                <div className="text-right">
                  <div className="table-item remarks-comment"><div key = {index} className={item.is_new==1 ?"text-blue": (item.is_deleted == 1 ?"deleted-order": "")}>
                    {item.name}
                  </div></div>
                </div>
              </div>
            )
          })}
        </>
      )
    }
  };
  
  // open shema
  openInspectionImageModal = async (number) => {
    let path = "/app/api/v2/order/inspection/getImage";
    
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
                          {idx == 1 ? "初版" : parseInt(idx).toString() + "版"}
                        </td>
                        <td className="w-3">
                          {item.is_enabled == 2 ? "削除" : (item.is_enabled == 4 ? "中止" : (idx == 1 ? "新規" : "修正"))}
                        </td>
                        <td className="w-5">
                          {this.props.getDepartmentName(item.department_id)}
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
                if (output.history_show == 1){
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
                              <span className="mr-3">{output.is_enabled == 2 ? "削除" : (output.is_enabled == 4 ? "中止" : (output.version == 1 ? "新規" : "修正"))}</span>
                              <span className="mr-3">{output.department_name}</span>
                              <span className="mr-3">{output.updated_at.split('-').join('/')}</span>
                              <span className="mr-3 doctor-name-area">
                            {renderHTML(doctor_name)}
                          </span>
                            </div>
                            <MedicineListWrapper>
                              <div className={`history-item soap-data-item`}>
                                <div className={`history-item ${(output.is_enabled == 2 || output.is_enabled == 4) ? "deleted-order" : ""}`}>
                                  <div className="phy-box w70p">
                                    {output.order_data.order_data.multi_reserve_flag != 1 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査日</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(
                                                output.order_data.order_data.inspection_DATETIME == "日未定" ? "[日未定]" :
                                                  (formatJapanDateSlash(output.order_data.order_data.inspection_DATETIME)
                                                    + ((output.order_data.order_data.reserve_time != undefined && output.order_data.order_data.reserve_time != "") ?
                                                      " "+output.order_data.order_data.reserve_time : "") + (output.order_data.order_data.is_emergency == 1 ? "[当日緊急]":"")),
                                                undefined
                                              )
                                            ):(
                                              this.getChangePart(
                                                output.order_data.order_data.inspection_DATETIME == "日未定" ? "[日未定]" :
                                                  (formatJapanDateSlash(output.order_data.order_data.inspection_DATETIME)
                                                    + ((output.order_data.order_data.reserve_time != undefined && output.order_data.order_data.reserve_time != "") ?
                                                      " "+output.order_data.order_data.reserve_time : "") + (output.order_data.order_data.is_emergency == 1 ? "[当日緊急]":"")),
                                                output.prev.order_data.order_data.inspection_DATETIME == "日未定" ? "[日未定]" :
                                                  (formatJapanDateSlash(output.prev.order_data.order_data.inspection_DATETIME)
                                                    + ((output.prev.order_data.order_data.reserve_time != undefined && output.prev.order_data.order_data.reserve_time != "") ?
                                                      " "+output.prev.order_data.order_data.reserve_time : "") + (output.prev.order_data.order_data.is_emergency == 1 ? "[当日緊急]":""))
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.classification1_name != undefined && output.prev.order_data.order_data.classification1_name != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.classification1_name != undefined && output.order_data.order_data.classification1_name != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査種別</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.classification1_name, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.classification1_name, output.prev.order_data.order_data.classification1_name)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.classification2_name != undefined && output.prev.order_data.order_data.classification2_name != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.classification2_name != undefined && output.order_data.order_data.classification2_name != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査詳細</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment `}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.classification2_name, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.classification2_name, output.prev.order_data.order_data.classification2_name)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {/* ---------- start 内視鏡------------- */}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.inspection_type_name != undefined && output.prev.order_data.order_data.inspection_type_name != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.inspection_type_name != undefined && output.order_data.order_data.inspection_type_name != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査種別</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment `}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.inspection_type_name, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.inspection_type_name, output.prev.order_data.order_data.inspection_type_name)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.inspection_item_name != undefined && output.prev.order_data.order_data.inspection_item_name != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.inspection_item_name != undefined && output.order_data.order_data.inspection_item_name != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査項目</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment `}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.inspection_item_name, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.inspection_item_name, output.prev.order_data.order_data.inspection_item_name)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.endoscope_purpose_name != undefined && output.prev.order_data.order_data.endoscope_purpose_name != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.endoscope_purpose_name != undefined && output.order_data.order_data.endoscope_purpose_name != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">検査目的</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment `}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.endoscope_purpose_name, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.endoscope_purpose_name, output.prev.order_data.order_data.endoscope_purpose_name)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {/* ----------- end ------------ */}
                                    {((output.order_data!= undefined && output.order_data.order_data.inspection_purpose != undefined && output.order_data.order_data.inspection_purpose != null && output.order_data.order_data.inspection_purpose.length > 0) ||
                                      (output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.inspection_purpose != undefined && output.prev.order_data.order_data.inspection_purpose != null && output.prev.order_data.order_data.inspection_purpose.length > 0))&& (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">検査目的</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {output.prev == null ?(
                                                this.getChangeArray(output.order_data.order_data.inspection_purpose, undefined, 1)
                                              ) : (
                                                this.getChangeArray(output.order_data.order_data.inspection_purpose, output.prev.order_data.order_data.inspection_purpose, 1)
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {((output.order_data!= undefined && output.order_data.order_data.inspection_symptom != undefined && output.order_data.order_data.inspection_symptom != null && output.order_data.order_data.inspection_symptom.length > 0) ||
                                      (output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.inspection_symptom != undefined && output.prev.order_data.order_data.inspection_symptom != null && output.prev.order_data.order_data.inspection_symptom.length > 0))&& (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">現症</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {output.prev == null ?(
                                                this.getChangeArray(output.order_data.order_data.inspection_symptom, undefined, 1)
                                              ) : (
                                                this.getChangeArray(output.order_data.order_data.inspection_symptom, output.prev.order_data.order_data.inspection_symptom, 1)
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {((output.order_data!= undefined && output.order_data.order_data.inspection_risk != undefined && output.order_data.order_data.inspection_risk != null && output.order_data.order_data.inspection_risk.length > 0) ||
                                      (output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.inspection_risk != undefined && output.prev.order_data.order_data.inspection_risk != null && output.prev.order_data.order_data.inspection_risk.length > 0))&& (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">冠危険因子</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {output.prev == null ?(
                                                this.getChangeArray(output.order_data.order_data.inspection_risk, undefined, 1)
                                              ) : (
                                                this.getChangeArray(output.order_data.order_data.inspection_risk, output.prev.order_data.order_data.inspection_risk, 1)
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {/* --------------------- start --------------- */}
                                    {((output.order_data!= undefined && output.order_data.order_data.inspection_sick != undefined && output.order_data.order_data.inspection_sick != null && output.order_data.order_data.inspection_sick.length > 0) ||
                                      (output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.inspection_sick != undefined && output.prev.order_data.order_data.inspection_sick != null && output.prev.order_data.order_data.inspection_sick.length > 0))&& (
                                      <>
                                        {output.prev == null ?(
                                          this.getChangeArraySpecial(output.order_data.order_data.inspection_sick, undefined)
                                        ) : (
                                          this.getChangeArraySpecial(output.order_data.order_data.inspection_sick, output.prev.order_data.order_data.inspection_sick)
                                        )}
                                      </>
                                    )}
                                    {((output.order_data!= undefined && output.order_data.order_data.inspection_request != undefined && output.order_data.order_data.inspection_request != null && output.order_data.order_data.inspection_request.length > 0) ||
                                      (output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.inspection_request != undefined && output.prev.order_data.order_data.inspection_request != null && output.prev.order_data.order_data.inspection_request.length > 0))&& (
                                      <>
                                        {output.prev == null ?(
                                          this.getChangeArraySpecial(output.order_data.order_data.inspection_request, undefined)
                                        ) : (
                                          this.getChangeArraySpecial(output.order_data.order_data.inspection_request, output.prev.order_data.order_data.inspection_request)
                                        )}
                                      </>
                                    )}
                                    {((output.order_data!= undefined && output.order_data.order_data.is_anesthesia != undefined && output.order_data.order_data.is_anesthesia != null && output.order_data.order_data.is_anesthesia.length > 0) ||
                                      (output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.is_anesthesia != undefined && output.prev.order_data.order_data.is_anesthesia != null && output.prev.order_data.order_data.is_anesthesia.length > 0))&& (
                                      <>
                                        {output.prev == null ?(
                                          this.getChangeArraySpecial(output.order_data.order_data.is_anesthesia, undefined)
                                        ) : (
                                          this.getChangeArraySpecial(output.order_data.order_data.is_anesthesia, output.prev.order_data.order_data.is_anesthesia)
                                        )}
                                      </>
                                    )}
                                    {((output.order_data!= undefined && output.order_data.order_data.is_sedation != undefined && output.order_data.order_data.is_sedation != null && output.order_data.order_data.is_sedation.length > 0) ||
                                      (output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.is_sedation != undefined && output.prev.order_data.order_data.is_sedation != null && output.prev.order_data.order_data.is_sedation.length > 0))&& (
                                      <>
                                        {output.prev == null ?(
                                          this.getChangeArraySpecial(output.order_data.order_data.is_sedation, undefined)
                                        ) : (
                                          this.getChangeArraySpecial(output.order_data.order_data.is_sedation, output.prev.order_data.order_data.is_sedation)
                                        )}
                                      </>
                                    )}
                                    {((output.order_data!= undefined && output.order_data.order_data.inspection_movement != undefined && output.order_data.order_data.inspection_movement != null && output.order_data.order_data.inspection_movement.length > 0) ||
                                      (output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.inspection_movement != undefined && output.prev.order_data.order_data.inspection_movement != null && output.prev.order_data.order_data.inspection_movement.length > 0))&& (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">患者移動形態</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {output.prev == null ?(
                                                this.getChangeArray(output.order_data.order_data.inspection_movement, undefined, 1)
                                              ) : (
                                                this.getChangeArray(output.order_data.order_data.inspection_movement, output.prev.order_data.order_data.inspection_movement, 1)
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {/* --------------------- end --------------- */}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.height != undefined && output.prev.order_data.order_data.height != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.height != undefined && output.order_data.order_data.height != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">身長</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment `}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.height, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.height, output.prev.order_data.order_data.height)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.weight != undefined && output.prev.order_data.order_data.weight != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.weight != undefined && output.order_data.order_data.weight != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">体重</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment `}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.weight, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.weight, output.prev.order_data.order_data.weight)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.surface_area != undefined && output.prev.order_data.order_data.surface_area != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.surface_area != undefined && output.order_data.order_data.surface_area != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">体表面積</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment `}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.surface_area, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.surface_area, output.prev.order_data.order_data.surface_area)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!== undefined && output.prev.order_data.order_data.connection_date_title !== undefined) ||
                                      (output.order_data !== undefined && output.order_data.order_data.connection_date_title !== undefined)) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">{output.order_data.order_data.connection_date_title}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment `}>
                                            {(output.prev == null || output.prev.order_data.order_data.connection_date_title === undefined) ? (
                                              this.getChangePart(formatJapanDateSlash(output.order_data.order_data.calculation_start_date), undefined)
                                            ):(
                                              this.getChangePart(formatJapanDateSlash(output.order_data.order_data.calculation_start_date), formatJapanDateSlash(output.prev.order_data.order_data.calculation_start_date))
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {/*------ end -------------  */}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.sick_name != undefined && output.prev.order_data.order_data.sick_name != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.sick_name != undefined && output.order_data.order_data.sick_name != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">臨床診断、病名</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment `}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.sick_name, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.sick_name, output.prev.order_data.order_data.sick_name)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.etc_comment != undefined && output.prev.order_data.order_data.etc_comment != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.etc_comment != undefined && output.order_data.order_data.etc_comment != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">
                                            <p>主訴、臨床経過</p>
                                            <p>検査目的、コメント</p>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment `}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.etc_comment, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.etc_comment, output.prev.order_data.order_data.etc_comment)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.special_presentation != undefined && output.prev.order_data.order_data.special_presentation != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.special_presentation != undefined && output.order_data.order_data.special_presentation != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">特殊指示</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment `}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.special_presentation, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.special_presentation, output.prev.order_data.order_data.special_presentation)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.count_label != undefined && output.prev.order_data.order_data.count_label != "" && output.prev.order_data.order_data.count > 0) ||
                                      (output.order_data!= undefined && output.order_data.order_data.count_label != undefined && output.order_data.order_data.count_label != "" && output.order_data.order_data.count > 0 )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">{output.order_data.order_data.count_label}</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment `}>
                                            {(output.prev == null || output.prev.order_data.order_data.count == undefined || output.prev.order_data.order_data.count == '') ? (
                                              this.getChangePart(output.order_data.order_data.count + output.order_data.order_data.count_suffix, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.count + output.order_data.order_data.count_suffix, output.prev.order_data.order_data.count + output.prev.order_data.order_data.count_suffix)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data !== undefined &&
                                        ((output.prev.order_data.order_data.done_body_part !== undefined && output.prev.order_data.order_data.done_body_part !== "") ||
                                          (output.prev.order_data.order_data.done_body_part === undefined && output.prev.order_data.order_data.body_part !== undefined && output.prev.order_data.order_data.body_part !== ""))
                                      ) ||
                                      (output.order_data !== undefined &&
                                        ((output.order_data.order_data.done_body_part !== undefined && output.order_data.order_data.done_body_part !== "")
                                          || (output.order_data.order_data.done_body_part === undefined && output.order_data.order_data.body_part !== undefined && output.order_data.order_data.body_part !== "")))
                                    ) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">部位指定コメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment `}>
                                            {output.prev == null ? (
                                              this.getChangePart((output.order_data.order_data.done_body_part !== undefined ? output.order_data.order_data.done_body_part : output.order_data.order_data.body_part), undefined)
                                            ):(
                                              this.getChangePart(
                                                output.order_data.order_data.done_body_part !== undefined ? output.order_data.order_data.done_body_part : output.order_data.order_data.body_part,
                                                output.prev.order_data.order_data.done_body_part !== undefined ? output.prev.order_data.order_data.done_body_part : output.prev.order_data.order_data.body_part)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.imgBase64 != undefined && output.prev.order_data.order_data.imgBase64 != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.imgBase64 != undefined && output.order_data.order_data.imgBase64 != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item"></div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getImagePart(output.order_data.order_data.imgBase64, undefined, output.number)
                                            ):(
                                              this.getImagePart(output.order_data.order_data.imgBase64, output.prev.order_data.order_data.imgBase64, output.number)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data.order_data.multi_reserve_flag == 1) || (output.order_data.order_data.multi_reserve_flag == 1)) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">実施/予定情報</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment `}>
                                            {output.prev == null ? (
                                              this.getChangePart(getMultiReservationInfo(output.order_data.order_data.reserve_data, output.order_data.order_data.done_numbers), undefined, 'html')
                                            ):(
                                              this.getChangePart(
                                                getMultiReservationInfo(output.order_data.order_data.reserve_data, output.order_data.order_data.done_numbers),
                                                getMultiReservationInfo(output.prev.order_data.order_data.reserve_data, output.prev.order_data.order_data.done_numbers), 'html')
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
ChangeInspectionLogModal.contextType = Context;

ChangeInspectionLogModal.propTypes = {
  closeModal: PropTypes.func,
  getDepartmentName: PropTypes.func,
  orderNumber: PropTypes.number,
  insuranceTypeList: PropTypes.array,
  historySoapList: PropTypes.array,
};

export default ChangeInspectionLogModal;