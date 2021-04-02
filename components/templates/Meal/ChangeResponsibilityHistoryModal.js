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
import {CACHE_SESSIONNAMES, getStaffName} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import {formatJapanDateSlash} from "~/helpers/date";
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
  .text-blue{
    color: #0000ff;
  }
  .deleted-order {
    text-decoration: line-through;
  }
  .right-value {
      width: calc(100% - 190px);
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
      left: 180px;
    }    
    .text-left{
      .table-item{
        width: 170px;
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
  .deleted-order{
    text-decoration: line-through;
  }
`;

export class ChangeResponsibilityHistoryModal extends Component {
  constructor(props) {
    super(props);
    const differences = this.checkDifference(this.props.historySoapList);
    this.state = {
      outputs: differences.outputs,
      history_list: this.props.historySoapList
    };
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    this.webdav_system_path = "";
    if(initState !== undefined && initState != null && initState.conf_data !== undefined && initState.conf_data.webdav_system_path !== undefined){
      this.webdav_system_path = initState.conf_data.webdav_system_path;
    } else {
      this.webdav_system_path = "http://haruka-develop.99sv-coco.com/webdav/";
    }
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
                    <th className="check"> </th>
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
                              {item.order_data.order_data.department_name}
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
                                    <div className="table-item">変更日</div>
                                  </div>
                                  <div className="text-left right-value">
                                    {(output.order_data.order_data.moving_day != undefined && output.order_data.order_data.moving_day != "") ?
                                      formatJapanDateSlash(output.order_data.order_data.moving_day): ""}
                                  </div>
                                </div>
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">診療科</div>
                                  </div>
                                  <div className="text-left right-value">
                                    {(output.order_data.order_data.prev_department_id !== undefined && output.order_data.order_data.prev_department_id != output.order_data.order_data.department_id)
                                      ? (output.order_data.order_data.prev_department_name + " → ") : ""}{output.order_data.order_data.department_name}
                                  </div>
                                </div>
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">主担当</div>
                                  </div>
                                  <div className="text-left right-value">
                                    {(output.order_data.order_data.prev_main_doctor !== undefined && output.order_data.order_data.prev_main_doctor != output.order_data.order_data.mainDoctor)
                                      ? (output.order_data.order_data.prev_main_doctor_name + " → ") : ""}{output.order_data.order_data.mainDoctor_name}
                                  </div>
                                </div>
                                {output.order_data.order_data.doctors_name.length > 0 && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">担当医</div>
                                    </div>
                                    <div className="text-left right-value">
                                        {output.order_data.order_data.doctors_name.map(name=>{
                                          return (
                                            <>
                                              <p style={{margin:0}}>{name}</p>
                                            </>
                                          )
                                        })}
                                    </div>
                                  </div>
                                )}
                                {output.order_data.order_data.nurse_id_in_charge_name != "" && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">担当看護師</div>
                                    </div>
                                    <div className="text-left right-value">{output.order_data.order_data.nurse_id_in_charge_name}</div>
                                  </div>
                                )}
                                {output.order_data.order_data.deputy_nurse_name != "" && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">副担当看護師</div>
                                    </div>
                                    <div className="text-left right-value">{output.order_data.order_data.deputy_nurse_name}</div>
                                  </div>
                                )}
                                {/* <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">チーム</div>
                                  </div>
                                  <div className="text-left right-value"></div>
                                </div> */}
                                {output.order_data.order_data.comment != "" && (
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">フリーコメント</div>
                                    </div>
                                    <div className="text-left right-value">{output.order_data.order_data.comment}</div>
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

ChangeResponsibilityHistoryModal.contextType = Context;

ChangeResponsibilityHistoryModal.propTypes = {
  closeModal: PropTypes.func,
  getDepartmentName: PropTypes.func,
  historySoapList: PropTypes.array,
};

export default ChangeResponsibilityHistoryModal;