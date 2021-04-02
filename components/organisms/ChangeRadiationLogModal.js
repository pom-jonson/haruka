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
import EndoscopeImageModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeImageModal";
import axios from "axios";
import {getStaffName} from "~/helpers/constants";
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

const imageButtonStyle = {
  cursor: "pointer",
};

const imageOldButtonStyle = {
  cursor: "pointer",
};

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
    .text-blue{
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
        p {
          margin-bottom: 0;
        }
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
    label {
      text-decoration: line-through;
    }
  }
`;

export class ChangeRadiationLogModal extends Component {
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
        current.doctor_name = order.order_data.order_data.doctor_name;
        current.department_name = this.props.getDepartmentName(order.order_data.order_data.department_id);
        current.substitute_name = order.is_doctor_consented == 2 ? "": getStaffName(order.updated_by);
        current.version = version;
        if(order.order_data.order_data.selected_kind_id != undefined && order.order_data.order_data.selected_kind_id != null) {
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
        } else {
          if (index < result.length - 1) {
            let detail_data = order.order_data.order_data.radiation_data;
            let prev_detail = result[index + 1].order_data.order_data.radiation_data;
            detail_data.map(item=>{
              let prev_item = prev_detail.find(x=>x.order_number == item.order_number);
              item.prev_item = prev_item;
            });
            let removedIndex = 0;
            prev_detail.map(prev_item=>{
              let removed = true;
              detail_data.map((cur_item, index)=>{
                if (cur_item.order_number == prev_item.order_number) {
                  removed = false;
                  removedIndex = index;
                }
              });
              if (removed == true) {
                prev_item.is_deleted = true;
                detail_data.splice(removedIndex + 1, 0, prev_item);
              }
            });
            current.detail_data = detail_data;
            current.prev = result[index + 1];
            let output = current;
            output.history_show = 1;
            outputs.push(output);
          } else {
            current.prev = null;
            current.detail_data = order.order_data.order_data.radiation_data;
            let output = current;
            output.history_show = 1;
            outputs.push(output);
          }
        }
      });
    }
    return {
      outputs: outputs
    };
  };

  getChangePart = (cur, prev, suffix = '') => {
    if (cur != undefined && cur != null && cur != "" && cur == prev) {
      return (
        <>
          <div>
            {displayLineBreak(cur)}{suffix}</div>
        </>
      )
    } else if ((cur == undefined || cur == null || cur == '') && (prev != undefined && prev != null && prev != '')) {
      return (
        <>
          <div className="deleted-order">{displayLineBreak(prev)}{suffix}</div>
        </>
      )
    } else if ((prev == undefined || prev == null || prev == '') && (cur != undefined && cur != null && cur != '')) {
      return (
        <div className="text-blue">{displayLineBreak(cur)}{suffix}</div>
      )
    } else if (cur != undefined && cur != null && cur != '' && prev != undefined && prev != null && prev != ''){
      return (
        <>
          <div className="text-blue">{displayLineBreak(cur)}{suffix}</div>
          <div className='deleted-order'>{displayLineBreak(prev)}{suffix}</div>
        </>
      )
    }
  }

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

  getChangeDetailItemPart = (cur, prev) => {
    if (cur != undefined && prev != undefined && cur.item_name == prev.item_name && cur.count == prev.count && cur.lot == prev.lot && cur.comment == prev.comment) {
      return (
        <>
          <div>
            <label>・{cur.name}
              {((cur.value1 != undefined && cur.value1 != null) || (cur.value2 != undefined && cur.value2 != null))? "：": ""}</label>
            {(cur.value1 !== undefined && cur.value1 != null && cur.value1 !== "") && (
              <><label>{cur.value1}{cur.input_item1_unit}</label><br /></>
            )}
            {(cur.value2 !== undefined && cur.value2 != null && cur.value2 !== "") && (
              <><label>{cur.value2}{cur.input_item2_unit}</label><br /></>
            )}
          </div>
        </>
      )
    } else {
      if (cur.is_deleted == 1) {
        return (
          <>
            <div className="deleted-order">
              <label>・{prev.name}
                {((prev.value1 != undefined && prev.value1 != null) || (prev.value2 != undefined && prev.value2 != null))? "：": ""}</label>
              {(prev.value1 !== undefined && prev.value1 != null && prev.value1 !== "") && (
                <><label>{prev.value1}{prev.input_item1_unit}</label><br /></>
              )}
              {(prev.value2 !== undefined && prev.value2 != null && prev.value2 !== "") && (
                <><label>{prev.value2}{prev.input_item2_unit}</label><br /></>
              )}
            </div>
          </>
        )
      } else if (prev == undefined || prev == null || prev == '') {
        return (
          <>
            <div className='text-blue'>
              <label>・{cur.name}
                {((cur.value1 != undefined && cur.value1 != null) || (cur.value2 != undefined && cur.value2 != null))? "：": ""}</label>
              {(cur.value1 !== undefined && cur.value1 != null && cur.value1 !== "") && (
                <><label>{cur.value1}{cur.input_item1_unit}</label><br /></>
              )}
              {(cur.value2 !== undefined && cur.value2 != null && cur.value2 !== "") && (
                <><label>{cur.value2}{cur.input_item2_unit}</label><br /></>
              )}
            </div>
          </>
        )
      } else {
        return (
          <>
            <div>
              <label>・{cur.name}
                {((cur.value1 != undefined && cur.value1 != null) || (cur.value2 != undefined && cur.value2 != null))? "：": ""}</label>
              {(cur.value1 !== undefined && cur.value1 != null && cur.value1 !== "") && (
                <><label>{cur.value1}{cur.input_item1_unit}</label><br /></>
              )}
              {(cur.value2 !== undefined && cur.value2 != null && cur.value2 !== "") && (
                <><label>{cur.value2}{cur.input_item2_unit}</label><br /></>
              )}
            </div>
            <div className='deleted-order'>
              <label>・{prev.name}
                {((prev.value1 != undefined && prev.value1 != null) || (prev.value2 != undefined && prev.value2 != null))? "：": ""}</label>
              {(prev.value1 !== undefined && prev.value1 != null && prev.value1 !== "") && (
                <><label>{prev.value1}{prev.input_item1_unit}</label><br /></>
              )}
              {(prev.value2 !== undefined && prev.value2 != null && prev.value2 !== "") && (
                <><label>{prev.value2}{prev.input_item2_unit}</label><br /></>
              )}
            </div>
          </>
        )
      }
    }
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

  getTreatprevChange(cur, prev) {
    let return_array = [];
    if (prev == undefined || prev == null || prev.length == 0) return_array = cur;
    else {
      cur.map((item, index)=>{
        item.prev = prev[index];
        return_array.push(item);
      });
      prev.map((item, index)=>{
        if (cur[index] == undefined || cur[index] == null || cur[index].item_name == '') {
          item.is_deleted = 1;
          return_array.push(item);
        }
      })
    }
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
  getTreatDetailChange = (cur, prev, is_prefix = 0) => {
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
        <div className="flex between drug-item table-row">
          <div className="text-left">
            <div className="table-item"></div>
          </div>
          <div className="text-right">
            <div className="table-item remarks-comment">
              {return_array.map((item, index)=>{
                let prefix = "、";
                if (index == 0) prefix = "";
                return(
                  <label key = {index} className={item.is_new==1 ?"text-blue": (item.is_deleted == 1 ?"deleted-order": "")}>
                    {is_prefix == 1 ? prefix:""}{item.name}
                  </label>
                )
              })}
            </div>
          </div>
        </div>

      )
    }
  };

  // open shema
  openInspectionImageModal = async (number) => {
    let path = "/app/api/v2/order/radiation/getImage";

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
  getChangeArray = (cur, prev, is_prefix = 1) => {
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
                          {item.is_enabled == 2 ? "削除" : (idx == 1 ? "新規" : "修正")}
                        </td>
                        <td className="w-5">
                          {this.props.getDepartmentName(item.order_data.order_data.department_id)}
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
                              <span className="mr-3 doctor-name-area">
                            {renderHTML(doctor_name)}
                          </span>
                            </div>
                            <MedicineListWrapper>
                              <div className={`history-item soap-data-item`}>
                                <div className={`history-item ${output.is_enabled == 2 ? "deleted-order" : ""}`}>
                                  <div className="phy-box w70p">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">検査日</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {output.prev == null ? (
                                            this.getChangePart(
                                              output.order_data.order_data.treat_date == "日未定" ? "[日未定]" :
                                                (formatJapanDateSlash(output.order_data.order_data.treat_date)
                                                  + ((output.order_data.order_data.reserve_time != undefined && output.order_data.order_data.reserve_time != "") ?
                                                    " "+output.order_data.order_data.reserve_time : "") + (output.order_data.order_data.is_emergency == 1 ? "[当日緊急]":"")),
                                              undefined
                                            )
                                          ):(
                                            this.getChangePart(
                                              output.order_data.order_data.treat_date == "日未定" ? "[日未定]" :
                                                (formatJapanDateSlash(output.order_data.order_data.treat_date)
                                                  + ((output.order_data.order_data.reserve_time != undefined && output.order_data.order_data.reserve_time != "") ?
                                                    " "+output.order_data.order_data.reserve_time : "") + (output.order_data.order_data.is_emergency == 1 ? "[当日緊急]":"")),
                                              output.prev.order_data.order_data.treat_date == "日未定" ? "[日未定]" :
                                                (formatJapanDateSlash(output.prev.order_data.order_data.treat_date)
                                                  + ((output.prev.order_data.order_data.reserve_time != undefined && output.prev.order_data.order_data.reserve_time != "") ?
                                                    " "+output.prev.order_data.order_data.reserve_time : "") + (output.prev.order_data.order_data.is_emergency == 1 ? "[当日緊急]":""))
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    {output.detail_data != undefined && output.detail_data != null && output.detail_data.length > 0 && output.detail_data.map((item,index)=>{
                                      if (item.is_deleted == true) {
                                        return(
                                          <div key={index} className="deleted-order">
                                            {item.classfic_name != undefined && item.classfic_name != '' && (
                                              <>
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">撮影区分</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">{item.classfic_name}</div>
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            {item.part_name != undefined && item.part_name != '' && (
                                              <>
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">撮影部位</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">
                                                      {item.left_right_name != undefined && item.left_right_name !='' && item.left_right_name}{item.part_name}
                                                    </div>
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            {item.selected_directions != undefined && Object.keys(item.selected_directions).length > 0 &&
                                            Object.keys(item.selected_directions).map((id, index) => {
                                              return(
                                                <>
                                                  <div className="flex between drug-item table-row">
                                                    <div className="text-left">
                                                      {index ==0 && (
                                                        <div className="table-item">方向</div>
                                                      )}
                                                      {index !=0 && (
                                                        <div className="table-item"></div>
                                                      )}
                                                    </div>
                                                    <div className="text-right">
                                                      <div className="table-item remarks-comment">{item.selected_directions[id]}</div>
                                                    </div>
                                                  </div>
                                                </>
                                              )
                                            })
                                            }
                                            {item.method_name != undefined && item.method_name != '' && (
                                              <>
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">撮影体位/方法</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">{item.method_name}</div>
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            {item.selected_comments != undefined && Object.keys(item.selected_comments).length > 0 &&
                                            Object.keys(item.selected_comments).map((id, index) => {
                                              return(
                                                <>
                                                  <div className="flex between drug-item table-row">
                                                    <div className="text-left">
                                                      {index ==0 && (
                                                        <div className="table-item">撮影コメント</div>
                                                      )}
                                                      {index !=0 && (
                                                        <div className="table-item"></div>
                                                      )}
                                                    </div>
                                                    <div className="text-right">
                                                      <div className="table-item remarks-comment">{item.selected_comments[id]}</div>
                                                    </div>
                                                  </div>
                                                </>
                                              )
                                            })
                                            }
                                            {item.shoot_count != undefined && item.shoot_count != null && item.shoot_count != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">撮影回数</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">{item.shoot_count}</div>
                                                </div>
                                              </div>
                                            )}

                                            {item.sub_picture != undefined && item.sub_picture != null && item.sub_picture != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">分画数</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">{item.sub_picture}</div>
                                                </div>
                                              </div>
                                            )}

                                            {item.direction_count != undefined && item.direction_count != null && item.direction_count != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">方向数</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">{item.direction_count}</div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )
                                      } else {
                                        return(
                                          <div key={index}>
                                            {item.classfic_name != undefined && item.classfic_name != '' && (
                                              <>
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">撮影区分</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">
                                                      {item.prev_item != undefined && item.prev_item != null ?
                                                        this.getChangePart(item.classfic_name, item.prev_item.classfic_name) :
                                                        this.getChangePart(item.classfic_name, undefined) }
                                                    </div>
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            {item.part_name != undefined && item.part_name != '' && (
                                              <>
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">撮影部位</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">
                                                      {item.prev_item != undefined && item.prev_item != null ?
                                                        this.getChangePart((item.left_right_name != undefined && item.left_right_name !='' ? item.left_right_name:"") + item.part_name, (item.prev_item.left_right_name != undefined && item.prev_item.left_right_name !='' ? item.prev_item.left_right_name:"") + item.prev_item.part_name) :
                                                        this.getChangePart((item.left_right_name != undefined && item.left_right_name !='' ? item.left_right_name:"") + item.part_name, undefined) }
                                                    </div>
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            {item.selected_directions != undefined && Object.keys(item.selected_directions).length > 0 &&
                                            Object.keys(item.selected_directions).map((id, index) => {
                                              return(
                                                <>
                                                  <div className="flex between drug-item table-row">
                                                    <div className="text-left">
                                                      {index ==0 && (
                                                        <div className="table-item">方向</div>
                                                      )}
                                                      {index !=0 && (
                                                        <div className="table-item"></div>
                                                      )}
                                                    </div>
                                                    <div className="text-right">
                                                      {/* <div className="table-item remarks-comment">{item.selected_directions[id]}</div> */}
                                                      <div className="table-item remarks-comment">
                                                        {item.prev_item != undefined && item.prev_item != null && item.prev_item.selected_directions != undefined ?
                                                          this.getChangePart(item.selected_directions[id], item.prev_item.selected_directions[id]) :
                                                          this.getChangePart(item.selected_directions[id], undefined) }
                                                      </div>
                                                    </div>
                                                  </div>
                                                </>
                                              )
                                            })
                                            }
                                            {item.method_name != undefined && item.method_name != '' && (
                                              <>
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">撮影体位/方法</div>
                                                  </div>
                                                  <div className="text-right">
                                                    {/* <div className="table-item remarks-comment">{item.method_name}</div> */}
                                                    <div className="table-item remarks-comment">
                                                      {item.prev_item != undefined && item.prev_item != null ?
                                                        this.getChangePart(item.method_name, item.prev_item.method_name) :
                                                        this.getChangePart(item.method_name, undefined) }
                                                    </div>
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            {item.selected_comments != undefined && Object.keys(item.selected_comments).length > 0 &&
                                            Object.keys(item.selected_comments).map((id, index) => {
                                              return(
                                                <>
                                                  <div className="flex between drug-item table-row">
                                                    <div className="text-left">
                                                      {index ==0 && (
                                                        <div className="table-item">撮影コメント</div>
                                                      )}
                                                      {index !=0 && (
                                                        <div className="table-item"></div>
                                                      )}
                                                    </div>
                                                    <div className="text-right">
                                                      {/* <div className="table-item remarks-comment">{item.selected_comments[id]}</div> */}
                                                      <div className="table-item remarks-comment">
                                                        {item.prev_item != undefined && item.prev_item != null && item.prev_item.selected_comments != undefined ?
                                                          this.getChangePart(item.selected_comments[id], item.prev_item.selected_comments[id]) :
                                                          this.getChangePart(item.selected_comments[id], undefined) }
                                                      </div>
                                                    </div>
                                                  </div>
                                                </>
                                              )
                                            })
                                            }
                                            {item.shoot_count != undefined && item.shoot_count != null && item.shoot_count != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">撮影回数</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {item.prev_item != undefined && item.prev_item != null ?
                                                      this.getChangePart(item.shoot_count, item.prev_item.shoot_count) :
                                                      this.getChangePart(item.shoot_count, undefined) }
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                            {item.sub_picture != undefined && item.sub_picture != null && item.sub_picture != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">分画数</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {item.prev_item != undefined && item.prev_item != null ?
                                                      this.getChangePart(item.sub_picture, item.prev_item.sub_picture) :
                                                      this.getChangePart(item.sub_picture, undefined) }
                                                  </div>
                                                </div>
                                              </div>
                                            )}

                                            {item.direction_count != undefined && item.direction_count != null && item.direction_count != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">方向数</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {item.prev_item != undefined && item.prev_item != null ?
                                                      this.getChangePart(item.direction_count, item.prev_item.direction_count) :
                                                      this.getChangePart(item.direction_count, undefined) }
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )
                                      }}
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.height != undefined && output.prev.order_data.order_data.height != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.height != undefined && output.order_data.order_data.height != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">身長</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.height, undefined, "cm")
                                            ):(
                                              this.getChangePart(output.order_data.order_data.height, output.prev.order_data.order_data.height, "cm")
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
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.weight, undefined, "kg")
                                            ):(
                                              this.getChangePart(output.order_data.order_data.weight, output.prev.order_data.order_data.weight, "kg")
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
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.surface_area, undefined, "㎡")
                                            ):(
                                              this.getChangePart(output.order_data.order_data.surface_area, output.prev.order_data.order_data.surface_area, "㎡")
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.sick_name != undefined && output.prev.order_data.order_data.sick_name != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.sick_name != undefined && output.order_data.order_data.sick_name != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">臨床診断、病名</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
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
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.etc_comment, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.etc_comment, output.prev.order_data.order_data.etc_comment)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.request_comment != undefined && output.prev.order_data.order_data.request_comment != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.request_comment != undefined && output.order_data.order_data.request_comment != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">依頼コメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.request_comment, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.request_comment, output.prev.order_data.order_data.request_comment)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.pregnancy != undefined && output.prev.order_data.order_data.pregnancy != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.pregnancy != undefined && output.order_data.order_data.pregnancy != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">妊娠</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.pregnancy, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.pregnancy, output.prev.order_data.order_data.pregnancy)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.film_output != undefined && output.prev.order_data.order_data.film_output != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.film_output != undefined && output.order_data.order_data.film_output != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">フィルム出力</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.film_output, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.film_output, output.prev.order_data.order_data.film_output)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.filmsend != undefined && output.prev.order_data.order_data.filmsend != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.filmsend != undefined && output.order_data.order_data.filmsend != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">フィルム搬送先</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.filmsend, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.filmsend, output.prev.order_data.order_data.filmsend)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.kind != undefined && output.prev.order_data.order_data.kind != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.kind != undefined && output.order_data.order_data.kind != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">区分</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.kind, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.kind, output.prev.order_data.order_data.kind)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.move != undefined && output.prev.order_data.order_data.move != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.move != undefined && output.order_data.order_data.move != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">移動形態</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.move, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.move, output.prev.order_data.order_data.move)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.use != undefined && output.prev.order_data.order_data.use != "" && output.prev.order_data.order_data.use != "使用しない") ||
                                      (output.order_data!= undefined && output.order_data.order_data.use != undefined && output.order_data.order_data.use != "" && output.order_data.order_data.use != "使用しない" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">造影剤使用</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.use, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.use, output.prev.order_data.order_data.use)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.inquiry != undefined && output.prev.order_data.order_data.inquiry != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.inquiry != undefined && output.order_data.order_data.inquiry != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">造影剤問診票</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.inquiry, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.inquiry, output.prev.order_data.order_data.inquiry)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {/* {output.order_data.order_data.selected_instructions != undefined && output.order_data.order_data.selected_instructions != null && output.order_data.order_data.selected_instructions.length > 0 && (
                                    <>
                                        {output.order_data.order_data.selected_instructions.map((item, index)=>{
                                            return (
                                                <>
                                                    <div className="flex between drug-item table-row">
                                                        <div className="text-left">
                                                            {index ==0 && (
                                                                <div className="table-item">撮影指示</div>
                                                            )}
                                                            {index !=0 && (
                                                                <div className="table-item"></div>
                                                            )}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="table-item remarks-comment">{item.name}</div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })}
                                    </>
                                )} */}
                                    {((output.order_data!= undefined && output.order_data.order_data.selected_instructions != undefined && output.order_data.order_data.selected_instructions != null && output.order_data.order_data.selected_instructions.length > 0) ||
                                      (output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.selected_instructions != undefined && output.prev.order_data.order_data.selected_instructions != null && output.prev.order_data.order_data.selected_instructions.length > 0))&& (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">撮影指示</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {output.prev == null ?(
                                                this.getChangeArray(output.order_data.order_data.selected_instructions, undefined)
                                              ) : (
                                                this.getChangeArray(output.order_data.order_data.selected_instructions, output.prev.order_data.order_data.selected_instructions)
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {((output.order_data!= undefined && output.order_data.order_data.selected_shootings != undefined && output.order_data.order_data.selected_shootings != null && output.order_data.order_data.selected_shootings.length > 0) ||
                                      (output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.selected_shootings != undefined && output.prev.order_data.order_data.selected_shootings != null && output.prev.order_data.order_data.selected_shootings.length > 0))&& (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">撮影</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {output.prev == null ?(
                                                this.getChangeArray(output.order_data.order_data.selected_shootings, undefined)
                                              ) : (
                                                this.getChangeArray(output.order_data.order_data.selected_shootings, output.prev.order_data.order_data.selected_shootings)
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.other_kind != undefined && output.prev.order_data.order_data.other_kind != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.other_kind != undefined && output.order_data.order_data.other_kind != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">分類</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.other_kind.name, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.other_kind.name, output.prev.order_data.order_data.other_kind.name)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.other_kind_detail != undefined && output.prev.order_data.order_data.other_kind_detail != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.other_kind_detail != undefined && output.order_data.order_data.other_kind_detail != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">分類詳細</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.other_kind_detail.name, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.other_kind_detail.name, output.prev.order_data.order_data.other_kind_detail.name)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.other_body_part != undefined && output.prev.order_data.order_data.other_body_part != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.other_body_part != undefined && output.order_data.order_data.other_body_part != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">部位</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.other_body_part, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.other_body_part, output.prev.order_data.order_data.other_body_part)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.free_comment != undefined && output.prev.order_data.order_data.free_comment != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.free_comment != undefined && output.order_data.order_data.free_comment != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">フリーコメント</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.free_comment, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.free_comment, output.prev.order_data.order_data.free_comment)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {output.order_data.order_data.additions != undefined && output.order_data.order_data.additions != null && Object.keys(output.order_data.order_data.additions).length > 0 && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">追加項目</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {Object.keys(output.order_data.order_data.additions).map(addition_id => {
                                              var item = output.order_data.order_data.additions[addition_id];
                                              return(
                                                <>
                                                  <div>{item.name}</div>
                                                </>
                                              )
                                            })}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.done_order ==1 && output.prev.order_data.order_data.obtain_tech != undefined && output.prev.order_data.order_data.obtain_tech != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.done_order ==1 && output.order_data.order_data.obtain_tech != undefined && output.order_data.order_data.obtain_tech != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">造影剤注入手技</div>
                                        </div>
                                        <div className="text-right">
                                          <div className={`table-item remarks-comment`}>
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.obtain_tech, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.obtain_tech, output.prev.order_data.order_data.obtain_tech)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {output.order_data.order_data.done_order ==1 &&
                                     output.order_data.order_data.details != undefined && output.order_data.order_data.details != null &&
                                     output.order_data.order_data.details.length > 0 && (
                                     output.prev != null && output.prev.order_data.order_data.done_order ==1 && output.prev.order_data.order_data.details != undefined && output.prev.order_data.order_data.details != null ?
                                        this.getTreatprevChange(output.order_data.order_data.details, output.prev.order_data.order_data.details) :
                                        this.getTreatprevChange(output.order_data.order_data.details, undefined)
                                    )}
                                    {/* {output.order_data.order_data.details !== undefined && output.order_data.order_data.details.length>0 && (
                                    <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                            <div className="table-item"> </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="table-item remarks-comment">
                                                {output.order_data.order_data.details.map(detail=>{
                                                    return(
                                                        <>
                                                            <div><label>・{detail.name}
                                                            {((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": ""}</label>
                                                            {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                              <><label>{detail.value1}{detail.input_item1_unit}</label><br /></>
                                                            )}
                                                            {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                              <><label>{detail.value2}{detail.input_item2_unit}</label><br /></>
                                                            )}
                                                            </div>
                                                        </>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                )} */}
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
ChangeRadiationLogModal.contextType = Context;

ChangeRadiationLogModal.propTypes = {
  closeModal: PropTypes.func,
  getDepartmentName: PropTypes.func,
  orderNumber: PropTypes.number,
  insuranceTypeList: PropTypes.array,
  historySoapList: PropTypes.array,
};

export default ChangeRadiationLogModal;