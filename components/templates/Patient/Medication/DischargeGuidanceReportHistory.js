import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import {secondary200,disable} from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import {formatJapanDateSlash} from "~/helpers/date";
import {getStaffName} from "~/helpers/constants";
import renderHTML from "react-render-html";

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
    color: #000;
    margin: auto;
    .right {text-align: right;}
    .blue {color: #0000ff;}
    .red {text-decoration: line-through;}
  }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  float: left;
  height: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;
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
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
      }
      tr{
        display: table;
        width: 100%;
      }
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
        label {margin-right: 0;}
      }
      .date {width: 10rem;}
      .version {width: 6rem;}
      .w-3 {width: 3rem;}
      .w-5 {width: 5rem;}
      .name{width:20rem;}
    }
  }
  .history-content {
    width: 100%;
    overflow-y: auto;
    height: calc(100% - 8rem);
    .content-header {
      background: aquamarine;
      text-align: left;
    }
    .deleted-order .row{
      text-decoration: line-through;
    }
  }
  .text-blue{color: #0000ff;}
  .doctor-name-area{
    span{color: blue;}
  }
 `;

const MedicineListWrapper = styled.div`
  font-size: 1rem;
  .text-red{
    color: #ff0000;
    text-decoration: line-through rgb(255, 0, 0);
  }
  .text-blue{color: #0000ff;}
  .deleted-order {
    text-decoration: line-through;
  }
  .right-value {
    width: calc(100% - 380px);
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
      left: 370px;
    }
    .text-left{
      .table-item{
        width: 360px;
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
  .line-through {color: #ff0000;}
  .flex {
    display: flex;
    margin-bottom: 0;
    &.between {
      justify-content: space-between;
      div {margin-right: 0;}
    }
    div {margin-right: 8px;}
    .date {
      margin-left: auto;
      margin-right: 24px;
    }
  }
  .drug-item {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }
  .text-right {width: calc(100% - 88px);}
  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 20px);
    word-wrap: break-word;
  }
  .deleted-order{text-decoration: line-through;}
`;

export class DischargeGuidanceReportHistory extends Component {
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
        current.substitute_name = order.is_doctor_consented != 2 ? getStaffName(order.updated_by) : "";
        current.version = version;
        if (index < result.length - 1) {
          current.prev = result[index + 1];
          let output = current;          
          outputs.push(output);                         
        } else {
          current.prev = null;
          let output = current;          
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

    if (cond == "array_names") {
      let data = cur.map(item=>{
        return item.name;
      });
      if (!data.includes(cur)) {
        return "different";
      }
    }
    return "equal";
  }

  getChangePart = (cur, prev, type="string") => {
    if(type == "string"){
      if (cur == prev) {
        return (
          <>
            <div>{cur != undefined ? cur : ""}</div>
          </>
        )
      } else {
        if (cur == undefined || cur == null || cur == '') {
          return (
            <>
              {prev != undefined && (
                <div className="deleted-order">{prev}</div>
              )}
            </>
          )
        } else if (prev == undefined || prev == null || prev == '') {
          return (
            <div className="text-blue">{cur != undefined ? cur : ""}</div>
          )
        } else {
          return (
            <>
              <div className="text-blue">{cur != undefined ? cur : ""}</div>
              <div className='deleted-order'>{prev != undefined ? prev : ""}</div>
            </>
          )
        }
      }
    }
    if(type == "array"){
      let cur_length = cur != undefined ? cur.length : 0;
      let prev_length = prev != undefined ? prev.length : 0;
      cur = cur_length == 0 ? [] : cur;
      prev = prev_length == 0 ? [] : prev;
      let ret_html = [];
      if(cur.length > 0){
        cur.map(value=>{
          if(this.checkExitData(value, prev)){
            ret_html.push(<div>{value}</div>);
          } else {
            ret_html.push(<div className="text-blue">{value}</div>);

          }
        })
      }
      if(prev.length > 0){
        prev.map(value=>{
          if(!this.checkExitData(value, cur)){
            ret_html.push(<div className='deleted-order'>{value}</div>);
          }
        })
      }
      return ret_html;
    }
  };

  checkExitData=(value, data)=>{
    let check_flag = false;
    if(data.length > 0){
      data.map(item=>{
        if(item == value){
          check_flag = true;
        }
      })
    }
    return check_flag;
  }

  getRadio = async (number,name,value) => {
    if (name === "check") {
      let {history_list} = this.state;
      history_list.find(x=>x.number == number).history_show = value;
      let differences = await this.checkDifference(history_list);
      this.setState({
        history_list,
        outputs: differences.outputs,
      });
    }
  };

  render() {    
    let outputs = this.state.outputs;
    let history_list = this.state.history_list;
    return (
      <Modal show={true} size="lg" className="modal-history-inspection">
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
                    <th className="version">バージョン</th>
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
                              {item.department_name}
                            </td>
                            <td className="date">
                              {item.updated_at.split('-').join('/')}
                            </td>
                            <td className="text-left">
                              <span className={doctor_change ? "text-blue":""}>{item.order_data.order_data.doctor_name}</span>
                              {getStaffName(item.updated_by) != item.order_data.order_data.doctor_name && (
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
              {outputs !== undefined && outputs != null && outputs.length > 0 && outputs.map(output=>{
                let doctor_name = "";
                if (output.substitute_name !== undefined && output.substitute_name !== "") {
                  if (output.prev !== undefined && output.prev != null && output.prev.doctor_name !== undefined && output.doctor_name != output.prev.doctor_name) {
                    doctor_name = "<span>" + output.doctor_name + "、" + "</span>" + " 入力者: " + output.substitute_name;
                  } else {
                    doctor_name = output.doctor_name + "、" + " 入力者: " + output.substitute_name;
                  }
                } else {
                  if (output.prev !== undefined && output.prev != null && output.prev.doctor_name !== undefined && output.doctor_name != output.prev.doctor_name) {
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
                          <div className={`history-item soap-data-item`}>
                            <div className={`history-item ${output.is_enabled == 2 ? "deleted-order" : ""}`}>
                              <div className="phy-box w70p">
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">日時</div>
                                  </div>
                                  <div className="text-left right-value">
                                    {output.prev == null ? (
                                      this.getChangePart((formatJapanDateSlash(output.order_data.order_data.start_date)+" "+output.order_data.order_data.start_time+'～'+output.order_data.order_data.end_time),undefined)
                                    ):(
                                      this.getChangePart(
                                        (formatJapanDateSlash(output.order_data.order_data.start_date)+" "+output.order_data.order_data.start_time+'～'+output.order_data.order_data.end_time),
                                        (formatJapanDateSlash(output.prev.order_data.order_data.start_date)+" "+output.prev.order_data.order_data.start_time+'～'+output.prev.order_data.order_data.end_time)
                                      )
                                    )}
                                  </div>
                                </div>
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                      <div className="table-item">記載者</div>
                                  </div>
                                  <div className="text-left right-value">
                                    {output.prev == null ? (
                                      this.getChangePart(output.order_data.order_data.write_staff_name, undefined)
                                    ):(
                                      this.getChangePart(output.order_data.order_data.write_staff_name, output.prev.order_data.order_data.write_staff_name)
                                    )}
                                  </div>
                                </div>
                                {((output.order_data.order_data.hospital_doctor_name !== undefined) || (output.prev != null && output.prev.order_data.order_data.hospital_doctor_name !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">【院内】</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.hospital_doctor_name, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.hospital_doctor_name, output.prev.order_data.order_data.hospital_doctor_name)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.nurse_name !== undefined) || (output.prev != null && output.prev.order_data.order_data.nurse_name !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">【院内】看護師</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.nurse_name, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.nurse_name, output.prev.order_data.order_data.nurse_name)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.discharge_support_nurse_name !== undefined) || (output.prev != null && output.prev.order_data.order_data.discharge_support_nurse_name !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">【院内】退院支援看護師</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.discharge_support_nurse_name, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.discharge_support_nurse_name, output.prev.order_data.order_data.discharge_support_nurse_name)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.msw_text !== undefined) || (output.prev != null && output.prev.order_data.order_data.msw_text !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">【院内】ＭＳＷ</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.msw_text, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.msw_text, output.prev.order_data.order_data.msw_text)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.hospital_other_text !== undefined) || (output.prev != null && output.prev.order_data.order_data.hospital_other_text !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">【院内】その他</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.hospital_other_text, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.hospital_other_text, output.prev.order_data.order_data.hospital_other_text)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.instructed_nurse_name !== undefined) || (output.prev != null && output.prev.order_data.order_data.instructed_nurse_name !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">【院外】在宅医or指示を受けた看護師</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.instructed_nurse_name, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.instructed_nurse_name, output.prev.order_data.order_data.instructed_nurse_name)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.visit_nurse_name !== undefined) || (output.prev != null && output.prev.order_data.order_data.visit_nurse_name !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">【院外】訪問看護師</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.visit_nurse_name, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.visit_nurse_name, output.prev.order_data.order_data.visit_nurse_name)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.care_manager_name !== undefined) || (output.prev != null && output.prev.order_data.order_data.care_manager_name !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">【院外】ケアマネージャー</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.care_manager_name, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.care_manager_name, output.prev.order_data.order_data.care_manager_name)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.outside_hospital_other_text !== undefined) || (output.prev != null && output.prev.order_data.order_data.outside_hospital_other_text !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">【院外】その他</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.outside_hospital_other_text, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.outside_hospital_other_text, output.prev.order_data.order_data.outside_hospital_other_text)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.recheck !== undefined) || (output.prev != null && output.prev.order_data.order_data.recheck !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">病状・病期の説明と患者・家族の理解の再確認</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.recheck, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.recheck, output.prev.order_data.order_data.recheck)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.check_inject_names !== undefined && output.order_data.order_data.check_inject_names.length > 0) ||
                                  (output.prev != null && output.prev.order_data.order_data.check_inject_names !== undefined && output.prev.order_data.order_data.check_inject_names.length > 0)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">【薬・注射】</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.check_inject_names, undefined, 'array')
                                      ):(
                                        this.getChangePart(output.order_data.order_data.check_inject_names, output.prev.order_data.order_data.check_inject_names, 'array')
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.check_equipment_names !== undefined && output.order_data.order_data.check_equipment_names.length > 0) ||
                                  (output.prev != null && output.prev.order_data.order_data.check_equipment_names !== undefined && output.prev.order_data.order_data.check_equipment_names.length > 0)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">【医療機器】</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.check_equipment_names, undefined, 'array')
                                      ):(
                                        this.getChangePart(output.order_data.order_data.check_equipment_names, output.prev.order_data.order_data.check_equipment_names, 'array')
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.check_treat_names !== undefined && output.order_data.order_data.check_treat_names.length > 0) ||
                                  (output.prev != null && output.prev.order_data.order_data.check_treat_names !== undefined && output.prev.order_data.order_data.check_treat_names.length > 0)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">【医療処置】</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.check_treat_names, undefined, 'array')
                                      ):(
                                        this.getChangePart(output.order_data.order_data.check_treat_names, output.prev.order_data.order_data.check_treat_names, 'array')
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.treat_check_other_text !== undefined) || (output.prev != null && output.prev.order_data.order_data.treat_check_other_text !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">【医療処置】その他</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.treat_check_other_text, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.treat_check_other_text, output.prev.order_data.order_data.treat_check_other_text)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.medicine_detail !== undefined) || (output.prev != null && output.prev.order_data.order_data.medicine_detail !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">詳細</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.medicine_detail, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.medicine_detail, output.prev.order_data.order_data.medicine_detail)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.need_medicine !== undefined) || (output.prev != null && output.prev.order_data.order_data.need_medicine !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">必要な医薬物品（製品名）・調達先</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.need_medicine, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.need_medicine, output.prev.order_data.order_data.need_medicine)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.check_body_assistance_names !== undefined && output.order_data.order_data.check_body_assistance_names.length > 0) ||
                                  (output.prev != null && output.prev.order_data.order_data.check_body_assistance_names !== undefined && output.prev.order_data.order_data.check_body_assistance_names.length > 0)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">身体援助</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.check_body_assistance_names, undefined, 'array')
                                      ):(
                                        this.getChangePart(output.order_data.order_data.check_body_assistance_names, output.prev.order_data.order_data.check_body_assistance_names, 'array')
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.body_assistance_check_other_text !== undefined) || (output.prev != null && output.prev.order_data.order_data.body_assistance_check_other_text !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">身体援助 その他</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.body_assistance_check_other_text, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.body_assistance_check_other_text, output.prev.order_data.order_data.body_assistance_check_other_text)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.future_treatment_issue !== undefined) || (output.prev != null && output.prev.order_data.order_data.future_treatment_issue !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">今後の治療課題・生活課題</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.future_treatment_issue, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.future_treatment_issue, output.prev.order_data.order_data.future_treatment_issue)
                                      )}
                                    </div>
                                  </div>
                                )}
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">【退院後(一ヶ月以内）病院看護師の訪問指導】</div>
                                  </div>
                                  <div className="text-left right-value">
                                    {output.prev == null ? (
                                      this.getChangePart(output.order_data.order_data.nurse_visit_guidance === 1 ? "有" : "無", undefined)
                                    ):(
                                      this.getChangePart(output.order_data.order_data.nurse_visit_guidance === 1 ? "有" : "無", output.prev.order_data.order_data.nurse_visit_guidance === 1 ? "有" : "無")
                                    )}
                                  </div>
                                </div>
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">【退院直後・特別指示書での訪問看護の必要性】</div>
                                  </div>
                                  <div className="text-left right-value">
                                    {output.prev == null ? (
                                      this.getChangePart(output.order_data.order_data.visit_nurse_need === 1 ? "有" : "無", undefined)
                                    ):(
                                      this.getChangePart(output.order_data.order_data.visit_nurse_need === 1 ? "有" : "無", output.prev.order_data.order_data.visit_nurse_need === 1 ? "有" : "無")
                                    )}
                                  </div>
                                </div>
                                {((output.order_data.order_data.discharge_date !== undefined) || (output.prev != null && output.prev.order_data.order_data.discharge_date !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">退院予定日</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart((output.order_data.order_data.discharge_date !== undefined ? formatJapanDateSlash(output.order_data.order_data.discharge_date) : ""), undefined)
                                      ):(
                                        this.getChangePart(
                                          (output.order_data.order_data.discharge_date !== undefined ? formatJapanDateSlash(output.order_data.order_data.discharge_date) : ""),
                                          (output.prev.order_data.order_data.discharge_date !== undefined ? formatJapanDateSlash(output.prev.order_data.order_data.discharge_date) : "")
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.move_tool !== undefined) || (output.prev != null && output.prev.order_data.order_data.move_tool !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">移送手段</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.move_tool, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.move_tool, output.prev.order_data.order_data.move_tool)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.nurse_taxi_name !== undefined) || (output.prev != null && output.prev.order_data.order_data.nurse_taxi_name !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">介護タクシー</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.nurse_taxi_name, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.nurse_taxi_name, output.prev.order_data.order_data.nurse_taxi_name)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.discharge_after_doctor_name !== undefined) || (output.prev != null && output.prev.order_data.order_data.discharge_after_doctor_name !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">退院後の主治医</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.discharge_after_doctor_name, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.discharge_after_doctor_name, output.prev.order_data.order_data.discharge_after_doctor_name)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.home_doctor_name !== undefined) || (output.prev != null && output.prev.order_data.order_data.home_doctor_name !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">在宅医</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.home_doctor_name, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.home_doctor_name, output.prev.order_data.order_data.home_doctor_name)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.visit_nurse_period_first !== undefined) || (output.prev != null && output.prev.order_data.order_data.visit_nurse_period_first !== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">【訪問看護指示書】</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart((output.order_data.order_data.visit_nurse_period_first+"～"+output.order_data.order_data.visit_nurse_period_second+'ヶ月'), undefined)
                                      ):(
                                        this.getChangePart((output.order_data.order_data.visit_nurse_period_first+"～"+output.order_data.order_data.visit_nurse_period_second+'ヶ月'),
                                          (output.prev.order_data.order_data.visit_nurse_period_first+"～"+output.prev.order_data.order_data.visit_nurse_period_second+'ヶ月'))
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.general_hospital_check === 1) || (output.prev != null && output.prev.order_data.order_data.general_hospital_check === 1)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">【緊急時対応】</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.general_hospital_check === 1 ? "県立総合病院":"", undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.general_hospital_check === 1 ? "県立総合病院":"", output.prev.order_data.order_data.general_hospital_check === 1 ? "県立総合病院":"")
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.body_assistance_check_other_text !== undefined) || (output.prev != null && output.prev.order_data.order_data.body_assistance_check_other_text!== undefined)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">【緊急時対応】その他</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.body_assistance_check_other_text, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.body_assistance_check_other_text, output.prev.order_data.order_data.body_assistance_check_other_text)
                                      )}
                                    </div>
                                  </div>
                                )}
                                {((output.order_data.order_data.send_information === 1) || (output.prev != null && output.prev.order_data.order_data.send_information === 1)) && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">病院⇔ステーション</div>
                                    </div>
                                    <div className="text-left right-value">
                                      {output.prev == null ? (
                                        this.getChangePart(output.order_data.order_data.send_information === 1 ? "１週間～１ヶ月の間に、別紙にて情報の送信をお願いいたします":"", undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.send_information === 1 ? "１週間～１ヶ月の間に、別紙にて情報の送信をお願いいたします":"",
                                          output.prev.order_data.order_data.send_information === 1 ? "１週間～１ヶ月の間に、別紙にて情報の送信をお願いいたします":"")
                                      )}
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
              })}
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} className="cancel-btn">キャンセル</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

DischargeGuidanceReportHistory.contextType = Context;

DischargeGuidanceReportHistory.propTypes = {
  closeModal: PropTypes.func,
  getDepartmentName: PropTypes.func,
  historySoapList: PropTypes.array,
};
export default DischargeGuidanceReportHistory;