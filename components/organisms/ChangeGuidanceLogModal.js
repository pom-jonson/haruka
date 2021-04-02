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
      left: 160px;
    }    

    .text-left{
      .table-item{
        width: 150px;
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
    label {
      margin-bottom: 0;
    }
  }
  .deleted-order {
    text-decoration: line-through !important;
    label {
      text-decoration: line-through !important;
    }
  }
`;

export class ChangeGuidanceLogModal extends Component {
  constructor(props) {
    super(props);
    const differences = this.checkDifference(this.props.historySoapList);
    this.state = {
      outputs: differences.outputs,
      history_list: this.props.historySoapList
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
            <div className='text-blue'>{displayLineBreak(cur)}</div>
            <div className='deleted-order'>{displayLineBreak(prev)}</div>
          </>
        )
      }
    }
  };
  getTreatDetailChange(cur, prev) {
    let return_array = [];
    if (prev == undefined || prev == null || prev.length == 0) {
      if (cur != undefined && cur != null && cur.length > 0) {
        cur.map(item=>{
          item.is_deleted = 0;
          if(item.is_enabled != 0)
            return_array.push(item);
        })
      }
    }
    else {
      if (cur != undefined && cur != null && cur.length > 0) {
        cur.map((item, index)=>{
          if (Object.keys(item).length > 0) {
            item.prev = prev[index];
            if (prev[index] === undefined || prev[index] == null || Object.keys(prev[index]).length === 0 ) {
              item.prev == undefined;
              item.is_deleted = 0;
            }
            if(item.is_enabled != 0)
              return_array.push(item);
          }
        });
      }
      if (prev !== undefined && prev != null && prev.length > 0) {
        prev.map((item, index)=>{
          if (Object.keys(item).length > 0) {
            if (cur === undefined || cur[index] === undefined || cur[index] == null || cur[index].item_name === undefined || cur[index].item_name == '' || cur[index].is_enabled == 0) {
              item.is_deleted = 1;
              return_array.push(item);
            }
          }
        })
      }
    }
    if(return_array.length > 0)
    return (
      <div className="flex between drug-item table-row">
        <div className="text-left">
          <div className="table-item"></div>
        </div>
        <div className="text-right">
          <div className="table-item remarks-comment">
            {return_array.map(detail=>{
              return(
                <>
                  <div>
                    {this.getChangeDetailItemPart(detail, detail.prev)}
                  </div>
                </>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
  
  getChangeDetailItemPart = (cur, prev) => {
    if (cur != undefined && prev != undefined && cur.item_name == prev.item_name && cur.value1 == prev.value1 && cur.value2 == prev.value2 && cur.is_enabled != 0) {
      return (
        <>
          <div>
            <label>・{cur.item_name}
              {((cur.value1 != undefined && cur.value1 != null) || (cur.value2 != undefined && cur.value2 != null))? "：": ""}</label>
            {cur.format1 != null && cur.format1 != undefined && cur.format1.includes("年") && cur.format1.includes("月") ? (
              <label>
                {cur.value1 != null && cur.value1 != undefined && (
                  <label>{(cur.value1_format !== undefined) ? cur.value1_format : cur.value1}</label>
                )}
                {cur.value2 != null && cur.value2 != undefined && (
                  <> ~ <label>{(cur.value2_format !== undefined) ? cur.value2_format : cur.value2}</label></>
                )}
              </label>
            ):(
              <label>
                {cur.value1 != null && cur.value1 != undefined && (
                  <label>{cur.value1}</label>
                )}
                {cur.value2 != null && cur.value2 != undefined && (
                  <label>{cur.value2}</label>
                )}
              </label>
            )}
          </div>
          
          
        </>
      )
    } else {
      if (cur.is_deleted == 1 && prev != undefined && prev.item_name != undefined && prev.is_enabled != 0) {
        return (
          <>
            <div className="deleted-order">
              <label>・{prev.item_name}
                {((prev.value1 != undefined && prev.value1 != null) || (prev.value2 != undefined && prev.value2 != null))? "：": ""}</label>
              {prev.format1 != null && prev.format1 != undefined && prev.format1.includes("年") && prev.format1.includes("月") ? (
                <label>
                  {prev.value1 != null && prev.value1 != undefined && (
                    <label>{(prev.value1_format !== undefined) ? prev.value1_format : prev.value1}</label>
                  )}
                  {prev.value2 != null && prev.value2 != undefined && (
                    <> ~ <label>{(prev.value2_format !== undefined) ? prev.value2_format : prev.value2}</label></>
                  )}
                </label>
              ):(
                <label>
                  {prev.value1 != null && prev.value1 != undefined && (
                    <label>{prev.value1}</label>
                  )}
                  {prev.value2 != null && prev.value2 != undefined && (
                    <label>{prev.value2}</label>
                  )}
                </label>
              )}
            </div>
          </>
        )
      } else if (prev == undefined || prev == null || prev == '') {
        return (
          <>
            {cur.is_enabled != 0 && (
              <div className={cur.is_deleted == 1 ? 'deleted-order' : 'text-blue'}>
                <label>・{cur.item_name}
                  {((cur.value1 != undefined && cur.value1 != null) || (cur.value2 != undefined && cur.value2 != null))? "：": ""}</label>
                {cur.format1 != null && cur.format1 != undefined && cur.format1.includes("年") && cur.format1.includes("月") ? (
                  <label>
                    {cur.value1 != null && cur.value1 != undefined && (
                      <label>{(cur.value1_format !== undefined) ? cur.value1_format : cur.value1}</label>
                    )}
                    {cur.value2 != null && cur.value2 != undefined && (
                      <> ~ <label>{(cur.value2_format !== undefined) ? cur.value2_format : cur.value2}</label></>
                    )}
                  </label>
                ):(
                  <label>
                    {cur.value1 != null && cur.value1 != undefined && (
                      <label>{cur.value1}</label>
                    )}
                    {cur.value2 != null && cur.value2 != undefined && (
                      <label>{cur.value2}</label>
                    )}
                  </label>
                )}
              </div>
            )}
          </>
        )
      } else {
        return (
          <>
            {cur.is_enabled != 0 && (
              <div>
                <label>・{cur.item_name}
                  {((cur.value1 != undefined && cur.value1 != null) || (cur.value2 != undefined && cur.value2 != null))? "：": ""}</label>
                {cur.format1 != null && cur.format1 != undefined && cur.format1.includes("年") && cur.format1.includes("月") ? (
                  <label>
                    {cur.value1 != null && cur.value1 != undefined && (
                      <label>{(cur.value1_format !== undefined) ? cur.value1_format : cur.value1}</label>
                    )}
                    {cur.value2 != null && cur.value2 != undefined && (
                      <> ~ <label>{(cur.value2_format !== undefined) ? cur.value2_format : cur.value2}</label></>
                    )}
                  </label>
                ):(
                  <label>
                    {cur.value1 != null && cur.value1 != undefined && (
                      <label>{cur.value1}</label>
                    )}
                    {cur.value2 != null && cur.value2 != undefined && (
                      <label>{cur.value2}</label>
                    )}
                  </label>
                )}
              </div>
            )}
            {prev != undefined && prev != null && prev.item_name != undefined && prev.is_enabled != 0 && (
              <div className='deleted-order'>
                <label>・{prev.item_name}
                  {((prev.value1 != undefined && prev.value1 != null) || (prev.value2 != undefined && prev.value2 != null))? "：": ""}</label>
                {prev.format1 != null && prev.format1 != undefined && prev.format1.includes("年") && prev.format1.includes("月") ? (
                  <label>
                    {prev.value1 != null && prev.value1 != undefined && (
                      <label>{(prev.value1_format !== undefined) ? prev.value1_format : prev.value1}</label>
                    )}
                    {prev.value2 != null && prev.value2 != undefined && (
                      <> ~ <label>{(prev.value2_format !== undefined) ? prev.value2_format : prev.value2}</label></>
                    )}
                  </label>
                ):(
                  <label>
                    {prev.value1 != null && prev.value1 != undefined && (
                      <label>{prev.value1}</label>
                    )}
                    {prev.value2 != null && prev.value2 != undefined && (
                      <label>{prev.value2}</label>
                    )}
                  </label>
                )}
              </div>
            )}
          </>
        )
      }
    }
  }

  render() {
    let outputs = this.state.outputs;
    let history_list = this.state.history_list;
    return (
      <Modal show={true} size="lg" className="prescription_confirm_modal">
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
                              {item.is_enabled == 2 ? "削除" : (idx == 1 ? "新規" : "修正")}
                            </td>
                            <td className="w-5">
                              {item.order_data.order_data.department_id != undefined ? this.props.getDepartmentName(item.order_data.order_data.department_id):""}
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
                if(output.history_show == 1){
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
                            <span className="mr-3 doctor-name-area">{renderHTML(doctor_name)}
                            </span>
                          </div>
                          <MedicineListWrapper>
                            <div className={`history-item soap-data-item ${output.is_enabled == 2 ? "deleted-order" : ""}`}>
                              <div className="history-item">
                              <div className="phy-box w70p" draggable="true">
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">日付</div>
                                  </div>
                                  <div className="text-right">
                                    <div className={'table-item remarks-comment'}>
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.treat_date, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.treat_date, output.prev.order_data.order_data.treat_date)
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={`history-item`}>
                              <div className="phy-box w70p" draggable="true">
                                {(output.order_data.order_data.classific_id !== undefined || (output.prev != null && output.prev.order_data.order_data.classific_name != undefined)) && (
                                    <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                            <div className="table-item">分類</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={'table-item remarks-comment'}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.classific_name, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.classific_name, output.prev.order_data.order_data.classific_name)
                                            )}
                                          </div>
                                        </div>
                                    </div>
                                )}
  
                                {(output.order_data.order_data.classific_detail_id !== undefined || (output.prev != null && output.prev.order_data.order_data.classific_detail_id != undefined)) &&  (
                                    <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                            <div className="table-item">分類詳細</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.classific_detail_name, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.classific_detail_name, output.prev.order_data.order_data.classific_detail_name)
                                            )}
                                          </div>
                                        </div>
                                    </div>
                                )}
                                {((output.order_data.order_data.details != undefined && output.order_data.order_data.details != null && output.order_data.order_data.details.length > 0) ||
                                  (output.prev != null && output.prev.order_data != undefined && output.prev.order_data.order_data.details != undefined && output.prev.order_data.order_data.details != null && output.prev.order_data.order_data.details.length > 0)) && (
                                  output.prev != null && output.prev.order_data.order_data.details != undefined && output.prev.order_data.order_data.details != null ?
                                  this.getTreatDetailChange(output.order_data.order_data.details, output.prev.order_data.order_data.details) :
                                  this.getTreatDetailChange(output.order_data.order_data.details, undefined)
                                )}
                                {((output.order_data.order_data.karte_description_name !== undefined && output.order_data.order_data.karte_description_name != null && output.order_data.order_data.karte_description_name !== "") ||
                                (output.prev != null && output.prev.order_data.order_data.karte_description_name !== undefined && output.prev.order_data.order_data.karte_description_name != null && output.prev.order_data.order_data.karte_description_name !== "")) && (
                                    <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                            <div className="table-item">カルテ記述名称</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.karte_description_name, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.karte_description_name, output.prev.order_data.order_data.karte_description_name)
                                            )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {((output.order_data.order_data.comment !== undefined && output.order_data.order_data.comment != null && output.order_data.order_data.comment !== "") ||
                                (output.prev != null && output.prev.order_data.order_data.comment !== undefined && output.prev.order_data.order_data.comment !== "")) && (
                                    <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                            <div className="table-item">コメント</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.comment, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.comment, output.prev.order_data.order_data.comment)
                                            )}
                                            </div>
                                        </div>
                                    </div>
                                )}
  
                                {output.order_data.order_data.additions !== undefined && Object.keys(output.order_data.order_data.additions).length > 0 && (
                                    <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                            <div className="table-item">追加指示等</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="table-item remarks-comment">
                                                {Object.keys(output.order_data.order_data.additions).map(addition=>{
                                                    return(
                                                        <>
                                                            <span>{output.order_data.order_data.additions[addition].name}</span><br />
                                                        </>
                                                    )
                                                })}
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
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} id='log_cancel_id' className="cancel-btn">閉じる</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
ChangeGuidanceLogModal.contextType = Context;

ChangeGuidanceLogModal.propTypes = {
  closeModal: PropTypes.func,
  getDepartmentName: PropTypes.func,
  historySoapList: PropTypes.array,
};

export default ChangeGuidanceLogModal;