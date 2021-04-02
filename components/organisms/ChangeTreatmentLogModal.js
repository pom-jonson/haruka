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
import {getStrLength} from "~/helpers/constants";
import Checkbox from "~/components/molecules/Checkbox";
import {displayLineBreak} from "~/helpers/dialConstants"
import {getStaffName} from "~/helpers/constants";
import {formatTimeIE} from "../../helpers/date";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
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
    color: #000;
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
  }
  .deleted-order {
    text-decoration: line-through;
    label {
      text-decoration: line-through;
    }
  }
  .history-item {
    border-bottom:solid 1px #ddd;
    &:first-child {
      border-top:solid 1px #ddd;;
    }
  }
`;

export class ChangeTreatmentLogModal extends Component {
  constructor(props) {
    super(props);
    const differences = this.checkDifference(this.props.historySoapList);
    this.state = {
      outputs: differences.outputs,
      history_list: this.props.historySoapList,
      complete_message: ""
    };
  }
  
  async componentDidMount() {
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
        current.doctor_name = order.order_data.order_data.header.doctor_name;
        current.department_name = this.props.getDepartmentName(order.order_data.order_data.header.department_id);
        current.substitute_name = order.is_doctor_consented == 2 ? "": getStaffName(order.updated_by);
        current.version = version;
        if (index < result.length - 1) {
          let detail_data = order.order_data.order_data.detail;
          let prev_detail = result[index + 1].order_data.order_data.detail;
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
          current.detail_data = order.order_data.order_data.detail;
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
            <div className="text-blue">{displayLineBreak(cur)}</div>
            <div className='deleted-order'>{displayLineBreak(prev)}</div>
          </>
        )
      }
    }
  }
  
  getSurfaceChangePart = (cur, prev) => {
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
            <div className="deleted-order">合計：{prev}㎠</div>
          </>
        )
      } else if (prev == undefined || prev == null || prev == '') {
        return (
          <div className="text-blue">合計：{cur}㎠</div>
        )
      } else {
        return (
          <>
            <div className="text-blue">合計：{cur}㎠</div>
            <div className='deleted-order'>合計：{prev}㎠</div>
          </>
        )
      }
    }
  }
  
  getChangeDetailPart = (cur, prev) => {
    if (JSON.stringify(cur) ==JSON.stringify(prev)) {
      return (
        <>
          <div>
            <span>{cur.item_name}</span>
            {(cur.value1 !== undefined && cur.value1 != null && cur.value1 !== "") && (
              <>
                {getStrLength(cur.value1) > 32 && (
                  <br />
                )}
                <span>：{cur.value1}</span><br />
              </>
            )}
            {(cur.value2 !== undefined && cur.value2 != null && cur.value2 !== "") && (
              <>
                {getStrLength(cur.value2) > 32 && (
                  <br />
                )}
                <span>{(cur.value1 == undefined || cur.value1 == null || cur.value1 =='') && '：'}{cur.value2}</span><br />
              </>
            )}
          </div>
        </>
      )
    } else {
      if (cur == undefined || cur == null || cur == '') {
        return (
          <>
            <div className='deleted-order'>
              <span>{prev.item_name}</span>
              {(prev.value1 !== undefined && prev.value1 != null && prev.value1 !== "") && (
                <>
                  {getStrLength(prev.value1) > 32 && (
                    <br />
                  )}
                  <span>：{prev.value1}</span><br />
                </>
              )}
              {(prev.value2 !== undefined && prev.value2 != null && prev.value2 !== "") && (
                <>
                  {getStrLength(prev.value2) > 32 && (
                    <br />
                  )}
                  <span>{(prev.value1 == undefined || prev.value1 == null || prev.value1 =='') && '：'}{prev.value2}</span><br />
                </>
              )}
            </div>
          </>
        )
      } else if (prev == undefined || prev == null || prev == '') {
        return (
          <>
            <div className='text-blue'>
              <span>{cur.item_name}</span>
              {(cur.value1 !== undefined && cur.value1 != null && cur.value1 !== "") && (
                <>
                  {getStrLength(cur.value1) > 32 && (
                    <br />
                  )}
                  <span>：{cur.value1}</span><br />
                </>
              )}
              {(cur.value2 !== undefined && cur.value2 != null && cur.value2 !== "") && (
                <>
                  {getStrLength(cur.value2) > 32 && (
                    <br />
                  )}
                  <span>{(cur.value1 == undefined || cur.value1 == null || cur.value1 =='') && '：'}{cur.value2}</span><br />
                </>
              )}
            </div>
          </>
        )
      } else {
        return (
          <>
            <div className="text-blue">
              <span>{cur.item_name}</span>
              {(cur.value1 !== undefined && cur.value1 != null && cur.value1 !== "") && (
                <>
                  {getStrLength(cur.value1) > 32 && (
                    <br />
                  )}
                  <span>：{cur.value1}</span><br />
                </>
              )}
              {(cur.value2 !== undefined && cur.value2 != null && cur.value2 !== "") && (
                <>
                  {getStrLength(cur.value2) > 32 && (
                    <br />
                  )}
                  <span>{(cur.value1 == undefined || cur.value1 == null || cur.value1 =='') && '：'}{cur.value2}</span><br />
                </>
              )}
            </div>
            <div className='deleted-order'>
              <span>{prev.item_name}</span>
              {(prev.value1 !== undefined && prev.value1 != null && prev.value1 !== "") && (
                <>
                  {getStrLength(prev.value1) > 32 && (
                    <br />
                  )}
                  <span>：{prev.value1}</span><br />
                </>
              )}
              {(prev.value2 !== undefined && prev.value2 != null && prev.value2 !== "") && (
                <>
                  {getStrLength(prev.value2) > 32 && (
                    <br />
                  )}
                  <span>{(prev.value1 == undefined || prev.value1 == null || prev.value1 =='') && '：'}{prev.value2}</span><br />
                </>
              )}
            </div>
          </>
        )
      }
    }
  }
  getChangeDetailItemPart = (cur, prev) => {
    if (cur != undefined && prev != undefined && cur.item_name == prev.item_name && cur.count == prev.count && cur.lot == prev.lot && cur.comment == prev.comment && cur.oxygen_data == prev.oxygen_data) {
      let cur_oxygen_data = cur['oxygen_data'] !== undefined && cur['oxygen_data'] != null ?
        JSON.parse(cur['oxygen_data']) : null;
      return (
        <>
          <div>
            <span>{cur.item_name}：</span>
            <span>{cur.count}</span>
            {(cur.unit_name !== '' || (cur.main_unit != null && cur.main_unit !== '')) && (
              <>
                <span>{cur.unit_name !== '' ? cur.unit_name : cur.main_unit}</span><br />
              </>
            )}
            {cur.lot !== undefined && cur.lot != null && cur.lot !== '' && (
              <>
                <span>ロット:{cur.lot}</span><br />
              </>
            )}
            {cur.comment !== undefined && cur.comment != null && cur.comment !== '' && (
              <>
                <span>フリーコメント:{cur.comment}</span><br />
              </>
            )}
          </div>
          <div>
            {cur_oxygen_data != null && cur_oxygen_data.length > 0 && cur_oxygen_data.map((oxygen_item, oxygen_index)=>{
              let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
              if (oxygen_index > 0 && cur_oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
              return (
                <div key={oxygen_item}>
                  <span>{oxygen_inhaler_name} {formatTimeIE(oxygen_item.start_time)}~{formatTimeIE(oxygen_item.end_time)}</span>
                  {oxygen_item.oxygen_flow !== undefined && oxygen_item.oxygen_flow != "" && (
                    <span className="ml-2">{oxygen_item.oxygen_flow}L/分</span>
                  )}
                  {oxygen_item.fio2_value !== undefined && oxygen_item.fio2_value != "" && (
                    <span className="ml-2">{oxygen_item.fio2_value * 100}%</span>
                  )}
                </div>
              )
            })}
          </div>
        </>
      )
    } else {
      if (cur.is_deleted == 1) {
        let prev_oxygen_data = prev['oxygen_data'] !== undefined && prev['oxygen_data'] != null ?
          JSON.parse(prev['oxygen_data']) : null;
        return (
          <>
            <div className="deleted-order">
              <span>{prev.item_name}：</span>
              <span>{prev.count}</span>
              {(prev.unit_name !== '' || (prev.main_unit != null && prev.main_unit !== '')) && (
                <>
                  <span>{prev.unit_name !== '' ? prev.unit_name : prev.main_unit}</span><br />
                </>
              )}
              {prev.lot !== undefined && prev.lot != null && prev.lot !== '' && (
                <>
                  <span>ロット:{prev.lot}</span><br />
                </>
              )}
              {prev.comment !== undefined && prev.comment != null && prev.comment !== '' && (
                <>
                  <span>フリーコメント:{prev.comment}</span><br />
                </>
              )}
            </div>
            <div className="deleted-order">
              {prev_oxygen_data != null && prev_oxygen_data.length > 0 && prev_oxygen_data.map((oxygen_item, oxygen_index)=>{
                let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
                if (oxygen_index > 0 && prev_oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
                return (
                  <div key={oxygen_item}>
                    <span>{oxygen_inhaler_name} {formatTimeIE(oxygen_item.start_time)}~{formatTimeIE(oxygen_item.end_time)}</span>
                    {oxygen_item.oxygen_flow !== undefined && oxygen_item.oxygen_flow != "" && (
                      <span className="ml-2">{oxygen_item.oxygen_flow}L/分</span>
                    )}
                    {oxygen_item.fio2_value !== undefined && oxygen_item.fio2_value != "" && (
                      <span className="ml-2">{oxygen_item.fio2_value * 100}%</span>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )
      } else if (prev == undefined || prev == null || prev == '') {
        let cur_oxygen_data = cur['oxygen_data'] !== undefined && cur['oxygen_data'] != null ?
          JSON.parse(cur['oxygen_data']) : null;
        return (
          <>
            <div className='text-blue'>
              <span>{cur.item_name}：</span>
              <span>{cur.count}</span>
              {(cur.unit_name !== '' || (cur.main_unit != null && cur.main_unit !== '')) && (
                <>
                  <span>{cur.unit_name !== '' ? cur.unit_name : cur.main_unit}</span><br />
                </>
              )}
              {cur.lot !== undefined && cur.lot != null && cur.lot !== '' && (
                <>
                  <span>ロット:{cur.lot}</span><br />
                </>
              )}
              {cur.comment !== undefined && cur.comment != null && cur.comment !== '' && (
                <>
                  <span>フリーコメント:{cur.comment}</span><br />
                </>
              )}
            </div>
            <div className='text-blue'>
              {cur_oxygen_data != null && cur_oxygen_data.length > 0 && cur_oxygen_data.map((oxygen_item, oxygen_index)=>{
                let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
                if (oxygen_index > 0 && cur_oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
                return (
                  <div key={oxygen_item}>
                    <span>{oxygen_inhaler_name} {formatTimeIE(oxygen_item.start_time)}~{formatTimeIE(oxygen_item.end_time)}</span>
                    {oxygen_item.oxygen_flow !== undefined && oxygen_item.oxygen_flow != "" && (
                      <span className="ml-2">{oxygen_item.oxygen_flow}L/分</span>
                    )}
                    {oxygen_item.fio2_value !== undefined && oxygen_item.fio2_value != "" && (
                      <span className="ml-2">{oxygen_item.fio2_value * 100}%</span>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )
      } else {
        let cur_oxygen_data = cur['oxygen_data'] !== undefined && cur['oxygen_data'] != null ?
          JSON.parse(cur['oxygen_data']) : null;
        let prev_oxygen_data = prev['oxygen_data'] !== undefined && prev['oxygen_data'] != null ?
          JSON.parse(prev['oxygen_data']) : null;
        return (
          <>
            <div className="text-blue">
              <span>{cur.item_name}：</span>
              <span>{cur.count}</span>
              {(cur.unit_name !== '' || (cur.main_unit != null && cur.main_unit !== '')) && (
                <>
                  <span>{cur.unit_name !== '' ? cur.unit_name : cur.main_unit}</span><br />
                </>
              )}
              {cur.lot !== undefined && cur.lot != null && cur.lot !== '' && (
                <>
                  <span>ロット:{cur.lot}</span><br />
                </>
              )}
              {cur.comment !== undefined && cur.comment != null && cur.comment !== '' && (
                <>
                  <span>フリーコメント:{cur.comment}</span><br />
                </>
              )}
            </div>
            <div className="text-blue">
              {cur_oxygen_data != null && cur_oxygen_data.length > 0 && cur_oxygen_data.map((oxygen_item, oxygen_index)=>{
                let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
                if (oxygen_index > 0 && cur_oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
                return (
                  <div key={oxygen_item}>
                    <span>{oxygen_inhaler_name} {formatTimeIE(oxygen_item.start_time)}~{formatTimeIE(oxygen_item.end_time)}</span>
                    {oxygen_item.oxygen_flow !== undefined && oxygen_item.oxygen_flow != "" && (
                      <span className="ml-2">{oxygen_item.oxygen_flow}L/分</span>
                    )}
                    {oxygen_item.fio2_value !== undefined && oxygen_item.fio2_value != "" && (
                      <span className="ml-2">{oxygen_item.fio2_value * 100}%</span>
                    )}
                  </div>
                )
              })}
            </div>
            <div className='deleted-order'>
              <span>{prev.item_name}：</span>
              <span>{prev.count}</span>
              {(prev.unit_name !== '' || (prev.main_unit != null && prev.main_unit !== '')) && (
                <>
                  <span>{prev.unit_name !== '' ? prev.unit_name : prev.main_unit}</span><br />
                </>
              )}
              {prev.lot !== undefined && prev.lot != null && prev.lot !== '' && (
                <>
                  <span>ロット:{prev.lot}</span><br />
                </>
              )}
              {prev.comment !== undefined && prev.comment != null && prev.comment !== '' && (
                <>
                  <span>フリーコメント:{prev.comment}</span><br />
                </>
              )}
            </div>
            <div className='deleted-order'>
              {prev_oxygen_data != null && prev_oxygen_data.length > 0 && prev_oxygen_data.map((oxygen_item, oxygen_index)=>{
                let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
                if (oxygen_index > 0 && prev_oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
                return (
                  <div key={oxygen_item}>
                    <span>{oxygen_inhaler_name} {formatTimeIE(oxygen_item.start_time)}~{formatTimeIE(oxygen_item.end_time)}</span>
                    {oxygen_item.oxygen_flow !== undefined && oxygen_item.oxygen_flow != "" && (
                      <span className="ml-2">{oxygen_item.oxygen_flow}L/分</span>
                    )}
                    {oxygen_item.fio2_value !== undefined && oxygen_item.fio2_value != "" && (
                      <span className="ml-2">{oxygen_item.fio2_value * 100}%</span>
                    )}
                  </div>
                )
              })}
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
  
  getTreatDetailChange(cur, prev) {
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
          <div className="table-item">個別指示</div>
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
  
  getInsuranceName = (_insuranceName) => {
    let result = "既定";
    if (_insuranceName == undefined || _insuranceName == null || _insuranceName == "") return result;
    return _insuranceName
  }
  
  getChangeArray = (cur_arr, prev_arr) => {
    let cur = cur_arr;
    let prev = prev_arr;
    if (JSON.stringify(cur) == JSON.stringify(prev)) {
      return (
        <>
          {cur.map((sub_item)=>{
            return (
              <div key={sub_item}>
                <label>{sub_item.body_part != "" ? sub_item.body_part + "：" : ""}</label>
                <label style={{width: "2.5rem", fontFamily:"monospace"}}>{sub_item.x_value}cm</label>
                <label className="ml-1 mr-1">×</label>
                <label style={{width: "2.5rem", fontFamily:"monospace"}}>{sub_item.y_value}cm</label>
                <label className="ml-1 mr-1">=</label>
                <label style={{width: "2.5rem", fontFamily:"monospace"}}>{sub_item.total_x_y}㎠</label>
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
          if (prev.findIndex(x=>JSON.stringify(x) == JSON.stringify(item)) == -1) {
            item.is_new = 1;
          }
        });
        let removedIndex = 0;
        prev.map(prev_item=> {
          let removed = true;
          cur.map((cur_item, index)=>{
            if (JSON.stringify(prev_item) == JSON.stringify(cur_item)) {
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
          {return_array.map((sub_item, index)=>{
            return(
              <div key = {index} className={sub_item.is_new==1 ?"text-blue": (sub_item.is_deleted == 1 ?"deleted-order": "")}>
                <label>{sub_item.body_part != "" ? sub_item.body_part + "：" : ""}</label>
                <label style={{width: "2.5rem", fontFamily:"monospace"}}>{sub_item.x_value}cm</label>
                <label className="ml-1 mr-1">×</label>
                <label style={{width: "2.5rem", fontFamily:"monospace"}}>{sub_item.y_value}cm</label>
                <label className="ml-1 mr-1">=</label>
                <label style={{width: "2.5rem", fontFamily:"monospace"}}>{sub_item.total_x_y}㎠</label>
              </div>
            )
          })}
        </>
      )
    }
  };
  printLog = () => {
    let {outputs} = this.state;
    if (outputs.findIndex(x=>x.history_show == 1) == -1) return;
    this.setState({
      isConfirmComplete:true,
      complete_message:"印刷中"
    });
    let path = "/app/api/v2/order/print/treatment_log";
    let print_data = {params:this.state.outputs.filter(x=>x.history_show == 1)};
    axios({
      url: path,
      method: 'POST',
      data:{print_data},
      responseType: 'blob', // important
    }).then((response) => {
      this.setState({complete_message:"", isConfirmComplete:false,});
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      if(window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, '変更履歴.pdf');
      }
      else{
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '変更履歴.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    })
      .catch(() => {
        this.setState({
          isConfirmComplete:false,
          alert_messages:"印刷失敗",
          complete_message: ""
        });
      })
  };
  
  render() {
    let outputs = this.state.outputs;
    let history_list = this.state.history_list;
    // let print_disable = false;
    // if (outputs.findIndex(x=>x.history_show == 1) == -1) print_disable = true;
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
                          {item.order_data.order_data.header.department_id != undefined ? this.props.getDepartmentName(item.order_data.order_data.header.department_id):""}
                        </td>
                        <td className="date">
                          {item.updated_at.split('-').join('/')}
                        </td>
                        <td className="text-left">
                          <span className={doctor_change ? "text-blue":""}>{item.order_data.order_data.header.doctor_name}</span>
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
                if(output.history_show == 1)
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
                              <div className={`soap-data-item ${output.is_enabled == 2 ? "deleted-order" : ""}`}>
                                <div>
                                  <div className="phy-box w70p" draggable="true">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">処置日</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {output.prev != undefined ? this.getChangePart(output.order_data.order_data.header.date, output.prev.order_data.order_data.header.date):this.getChangePart(output.order_data.order_data.header.date, undefined)}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">保険</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {output.prev != undefined
                                            ? this.getChangePart(this.getInsuranceName(output.order_data.order_data.header.insurance_name), this.getInsuranceName(output.prev.order_data.order_data.header.insurance_name))
                                            :this.getChangePart(this.getInsuranceName(output.order_data.order_data.header.insurance_name), undefined)}
                                        </div>
                                      </div>
                                    </div>
                                    {output.detail_data != undefined && output.detail_data != null && output.detail_data.length > 0 && output.detail_data.map((item)=>{
                                      if (item.is_deleted == true && output.version != 1) {
                                        return (
                                          <>
                                            {item.classification_name != undefined && item.classification_name != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">分類</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {item.classification_name}
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                            {item.practice_name != undefined && item.practice_name != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">行為名</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment d-flex" style={{justifyContent:"space-between"}}>
                                                    <span>{item.practice_name}</span>
                                                    {item.quantity_is_enabled == 1 && item.quantity !== undefined && item.quantity !== "" && (
                                                      <span className="d-flex">
                                                    （<span>{item.quantity}</span>
                                                        {item.unit != null && item.unit !== "" && (
                                                          <span>{item.unit}</span>
                                                        )}）
                                                  </span>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                            {item.request_name != undefined && item.request_name != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">請求情報</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {item.request_name}
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                            {item.position_name != undefined && item.position_name != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">部位</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {item.position_name}
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                            {item.side_name != undefined && item.side_name != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">左右</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {item.side_name}
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                            {item.barcode != undefined && item.barcode != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">バーコード</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">{item.barcode}</div>
                                                </div>
                                              </div>
                                            )}
                                            {item.surface_data != undefined && item.surface_data.length > 0 && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">面積</div>
                                                </div>
                                                <div className="text-right">
                                                  {item.surface_data.length > 0 && item.surface_data.map(sub_item=> {
                                                    return (
                                                      <div key={sub_item}>
                                                        <label>{sub_item.body_part != "" ? sub_item.body_part + "：" : ""}</label>
                                                        <label style={{width: "2.5rem", fontFamily:"monospace"}}>{sub_item.x_value}cm</label>
                                                        <label className="ml-1 mr-1">×</label>
                                                        <label style={{width: "2.5rem", fontFamily:"monospace"}}>{sub_item.y_value}cm</label>
                                                        <label className="ml-1 mr-1">=</label>
                                                        <label style={{width: "2.5rem", fontFamily:"monospace"}}>{sub_item.total_x_y}㎠</label>
                                                      </div>
                                                    )
                                                  })}
                                                  {item.surface_data.length > 1 && (
                                                    <div>合計：{item.total_surface}㎠</div>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                            {item.treat_detail_item != undefined && item.treat_detail_item != null && item.treat_detail_item.length > 0 && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">個別指示</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="remarks-comment">
                                                    {item.treat_detail_item.map(detail=>{
                                                      return(
                                                        <>
                                                          <div>
                                                            <span>{detail.item_name}：</span>
                                                            <span>{detail.count}</span>
                                                            {(detail.unit_name !== '' || (detail.main_unit != null && detail.main_unit !== '')) && (
                                                              <>
                                                                <span>{detail.unit_name !== '' ? detail.unit_name : detail.main_unit}</span>
                                                              </>
                                                            )}
                                                            <br />
                                                            {detail.lot !== undefined && detail.lot != null && detail.lot !== '' && (
                                                              <>
                                                                <span>ロット:{detail.lot}</span><br />
                                                              </>
                                                            )}
                                                            {detail.comment !== undefined && detail.comment != null && detail.comment !== '' && (
                                                              <>
                                                                <span>フリーコメント:{detail.comment}</span><br />
                                                              </>
                                                            )}
                                                          </div>
                                                        </>
                                                      )
                                                    })}
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                            {item.comment != undefined && item.comment != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">コメント</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">{displayLineBreak(item.comment)}</div>
                                                </div>
                                              </div>
                                            )}
                                          </>
                                        )
                                      } else {
                                        return(
                                          <>
                                            {item.classification_name != undefined && item.classification_name != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">分類</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    <>
                                                      {item.prev_item != undefined && item.prev_item != null ?
                                                        this.getChangePart(item.classification_name, item.prev_item.classification_name) :
                                                        this.getChangePart(item.classification_name, undefined) }
                                                    </>
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                            {item.practice_name != undefined && item.practice_name != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">行為名</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {item.prev_item != undefined && item.prev_item != null ?
                                                      this.getChangePart(item.practice_name, item.prev_item.practice_name) :
                                                      this.getChangePart(item.practice_name, undefined) }
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                            {item.request_name != undefined && item.request_name != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">請求情報</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {item.prev_item != undefined && item.prev_item != null ?
                                                      this.getChangePart(item.request_name, item.prev_item.request_name) :
                                                      this.getChangePart(item.request_name, undefined) }
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                            {item.position_name != undefined && item.position_name != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">部位</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {item.prev_item != undefined && item.prev_item != null ?
                                                      this.getChangePart(item.position_name, item.prev_item.position_name) :
                                                      this.getChangePart(item.position_name, undefined) }
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                            {item.side_name != undefined && item.side_name != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">左右</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {item.prev_item != undefined && item.prev_item != null ?
                                                      this.getChangePart(item.side_name, item.prev_item.side_name) :
                                                      this.getChangePart(item.side_name, undefined) }
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                            {item.barcode != undefined && item.barcode != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">バーコード</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {item.prev_item != undefined && item.prev_item != null ?
                                                      this.getChangePart(item.barcode, item.prev_item.barcode) :
                                                      this.getChangePart(item.barcode, undefined) }
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                            {item.surface_data != undefined && item.surface_data.length > 0 && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">面積</div>
                                                </div>
                                                <div className="text-right">
                                                  {item.prev_item != undefined && item.prev_item != null ?
                                                    this.getChangeArray(item.surface_data, item.prev_item.surface_data) :
                                                    this.getChangeArray(item.surface_data, undefined)}
                                                  {item.prev_item != undefined && item.prev_item != null ?
                                                    this.getSurfaceChangePart(item.total_surface, item.prev_item.total_surface) :
                                                    this.getSurfaceChangePart(item.total_surface, undefined) }
                                                </div>
                                              </div>
                                            )}
                                            {item.treat_detail_item != undefined && item.treat_detail_item != null && item.treat_detail_item.length > 0 && (
                                              item.prev_item != undefined && item.prev_item != null ?
                                                this.getTreatDetailChange(item.treat_detail_item, item.prev_item.treat_detail_item) :
                                                this.getTreatDetailChange(item.treat_detail_item, undefined)
                                            )}
                                            {item.comment != undefined && item.comment != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">コメント</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {item.prev_item != undefined && item.prev_item != null ?
                                                      this.getChangePart(item.comment, item.prev_item.comment) :
                                                      this.getChangePart(item.comment, undefined) }
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </>
                                        )
                                      }
                                    })}
                                    {output.order_data.order_data.item_details !== undefined && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item"> </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.order_data.order_data.item_details.map((detail, index)=>{
                                              if (output.prev == null || output.prev.order_data.order_data.item_details == undefined || output.prev.order_data.order_data.item_details == null || output.prev.order_data.order_data.item_details.length == 0){
                                                return(
                                                  <>
                                                    <div className = 'text-blue'>
                                                      <span>{detail.item_name}</span>
                                                      {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                        <>
                                                          {getStrLength(detail.value1) > 32 && (
                                                            <br />
                                                          )}
                                                          <span>：{detail.value1}</span><br />
                                                        </>
                                                      )}
                                                      {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                        <>
                                                          {getStrLength(detail.value2) > 32 && (
                                                            <br />
                                                          )}
                                                          <span>{(detail.value1 == undefined || detail.value1 == null || detail.value1 =='') && '：'}{detail.value2}</span><br />
                                                        </>
                                                      )}
                                                    </div>
                                                  </>
                                                )
                                              } else {
                                                return(
                                                  <>
                                                    <div>
                                                      {this.getChangeDetailPart(detail, output.prev.order_data.order_data.item_details[index])}
                                                    </div>
                                                  </>
                                                )
                                              }
            
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
              })}
              {this.state.complete_message !== '' && (
                <CompleteStatusModal
                  message = {this.state.complete_message}
                />
              )}
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} id='log_cancel_id' className="cancel-btn">閉じる</Button>
          {/*<Button onClick={this.printLog} id='log_print_id' className={print_disable ? "disable-btn" : "red-btn"}>印刷</Button>*/}
        </Modal.Footer>
      </Modal>
    );
  }
}
ChangeTreatmentLogModal.contextType = Context;

ChangeTreatmentLogModal.propTypes = {
  closeModal: PropTypes.func,
  getDepartmentName: PropTypes.func,
  orderNumber: PropTypes.number,
  insuranceTypeList: PropTypes.array,
  historySoapList: PropTypes.array,
};

export default ChangeTreatmentLogModal;