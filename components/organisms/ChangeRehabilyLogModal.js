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
import {REHABILY_DISEASE} from "~/helpers/constants";
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
    label {
      margin-bottom: 0;
    }
  }
  .deleted-order {
    text-decoration: line-through;
    label {
      text-decoration: line-through;
    }
  }
`;

export class ChangeRehabilyLogModal extends Component {
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
          let detail_data = [];
          Object.keys(order.order_data.order_data.detail).map(detail_index=>{
            let tab_data = order.order_data.order_data.detail[detail_index];
            if (tab_data.length > 0) {
              tab_data.map(tab_item=>{
                detail_data.push(tab_item);
              })
            }
          });
          let prev_detail = [];
          Object.keys(result[index + 1].order_data.order_data.detail).map(detail_index=>{
            let tab_data = result[index + 1].order_data.order_data.detail[detail_index];
            if (tab_data.length > 0) {
              tab_data.map(tab_item=>{
                prev_detail.push(tab_item);
              })
            }
          });
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
          let detail_data = [];
          Object.keys(order.order_data.order_data.detail).map(detail_index=>{
            let tab_data = order.order_data.order_data.detail[detail_index];
            if (tab_data.length > 0) {
              tab_data.map(tab_item=>{
                detail_data.push(tab_item);
              })
            }
          });
          current.detail_data = detail_data;
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
  
  getChangePart = (cur, prev, suffix = '') => {
    if (cur != undefined && cur != null && cur != "" && cur == prev) {
      return (
        <>
          <div>{displayLineBreak(cur)}{suffix}</div>
        </>
      )
    } else if ((cur == undefined || cur == null || cur == '') && (prev != undefined && prev != null && prev != '')) {
      return (
        <>
          <del className="deleted-order">{displayLineBreak(prev)}{suffix}</del>
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
          <del className='deleted-order'>{displayLineBreak(prev)}{suffix}</del>
        </>
      )
    }
  }
  
  getChangeDetailItemPart = (cur, prev) => {
    if (cur != undefined && prev != undefined && cur.item_name == prev.item_name && cur.value1 == prev.value1 && cur.value2 == prev.value2) {
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
      if (cur.is_deleted == 1 && prev != undefined && prev.item_name != undefined) {
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
          </>
        )
      } else {
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
            {prev != undefined && prev != null && prev.item_name != undefined && (
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
  
  getDiseaseDetailChange = (cur, prev) => {
    if (JSON.stringify(cur) == JSON.stringify(prev)) {
      return (
        <>
          {cur.map((item)=>{
            return this.renderDisease(item);
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
      } else if (prev !=undefined && prev != null && prev.length > 0){
        return_array = cur;
        return_array.map((item, index)=>{
          if (prev[index] == undefined || prev[index] == null || Object.keys(prev[index]) == 0) {
            item.is_new = 1;
          } else {
            let prev_item = prev[index];
            if (prev_item != undefined && prev_item != null && Object.keys(prev_item).length > 0) {
              item.prev_item = prev_item;
            }
          }
        });
        prev.map((prev_item, prev_index)=> {
          let removed = false;
          if (cur[prev_index] == undefined || cur[prev_index] == null || Object.keys(cur[prev_index]) == 0) {
            removed = true;
          }
          if (removed == true) {
            prev_item.is_deleted = 1;
            return_array.push(prev_item)
          }
        })
      }
      return (
        <>
        {return_array.map(disease_item=>{
          return this.renderDisease(disease_item);
        })}
        </>
      
      )
    }
  };
  
  renderDisease = (disease_item) => {
    if (disease_item.is_new==1) {
      return (
        <>
          {disease_item.disease_name !== undefined && disease_item.disease_name !== "" && (
            <div className="flex between drug-item table-row">
              <div className="text-left">
                <div className="table-item">病名</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment"><div className="text-blue">{disease_item.disease_name}</div></div>
              </div>
            </div>
          )}
          {disease_item.occur_date !== undefined && disease_item.occur_date !== "" && (
            <div className="flex between drug-item table-row">
              <div className="text-left">
                <div className="table-item">発症日</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  <div className="text-blue">
                  {(disease_item.occur_date !== undefined && disease_item.occur_date != null && disease_item.occur_date !== '') ? formatJapanDateSlash(disease_item.occur_date) : ''}
                  </div>
                </div>
              </div>
            </div>
          )}
          {disease_item.treat_start_date !== undefined && disease_item.treat_start_date !== "" && (
            <div className="flex between drug-item table-row">
              <div className="text-left">
                <div className="table-item">
                  {disease_item.date_type != undefined && disease_item.date_type != null ? REHABILY_DISEASE[disease_item.date_type] : ""}
                </div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  <div className="text-blue">
                    {disease_item.treat_start_date != null ? formatJapanDateSlash(disease_item.treat_start_date) : ""}
                  </div>
                </div>
              </div>
            </div>
          )}
          {disease_item.start_date !== undefined && disease_item.start_date !== "" && (
            <div className="flex between drug-item table-row">
              <div className="text-left">
                <div className="table-item">病名登録日</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  <div className="text-blue">
                  {(disease_item.start_date !== undefined && disease_item.start_date != null && disease_item.start_date !== '') ? formatJapanDateSlash(disease_item.start_date) : ''}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      );
    } else if (disease_item.is_deleted == 1) {
      return (
        <>
          {disease_item.disease_name !== undefined && disease_item.disease_name !== "" && (
            <div className="flex between drug-item table-row">
              <div className="text-left">
                <div className="table-item">病名</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment"><div className={"deleted-order"}>{disease_item.disease_name}</div></div>
              </div>
            </div>
          )}
          {disease_item.occur_date !== undefined && disease_item.occur_date !== "" && (
            <div className="flex between drug-item table-row">
              <div className="text-left">
                <div className="table-item">発症日</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  <div className={"deleted-order"}>
                  {(disease_item.occur_date !== undefined && disease_item.occur_date != null && disease_item.occur_date !== '') ? formatJapanDateSlash(disease_item.occur_date) : ''}
                  </div>
                </div>
              </div>
            </div>
          )}
          {disease_item.treat_start_date !== undefined && disease_item.treat_start_date !== "" && (
            <div className="flex between drug-item table-row">
              <div className="text-left">
                <div className="table-item">
                  {disease_item.date_type != undefined && disease_item.date_type != null ? REHABILY_DISEASE[disease_item.date_type] : ""}
                </div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  <div className={"deleted-order"}>
                    {disease_item.treat_start_date != null ? formatJapanDateSlash(disease_item.treat_start_date) : ""}
                  </div>
                </div>
              </div>
            </div>
          )}
          {disease_item.start_date !== undefined && disease_item.start_date !== "" && (
            <div className="flex between drug-item table-row">
              <div className="text-left">
                <div className="table-item">病名登録日</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  <div className="deleted-order">
                  {(disease_item.start_date !== undefined && disease_item.start_date != null && disease_item.start_date !== '') ? formatJapanDateSlash(disease_item.start_date) : ''}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      );
    } else if (disease_item.prev_item != undefined) {
      return (
        <>
          {disease_item.disease_name !== undefined && disease_item.disease_name !== "" && (
            <div className="flex between drug-item table-row">
              <div className="text-left">
                <div className="table-item">病名</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {this.getChangePart(disease_item.disease_name, disease_item.prev_item.disease_name)}
                </div>
              </div>
            </div>
          )}
          {disease_item.occur_date !== undefined && disease_item.occur_date !== "" && (
            <div className="flex between drug-item table-row">
              <div className="text-left">
                <div className="table-item">発症日</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {this.getChangePart(disease_item.occur_date, disease_item.prev_item.occur_date)}
                </div>
              </div>
            </div>
          )}
          {disease_item.treat_start_date !== undefined && disease_item.treat_start_date !== "" && (
            <div className="flex between drug-item table-row">
              <div className="text-left">
                <div className="table-item">
                  {disease_item.date_type != undefined && disease_item.date_type != null ? this.getChangePart(REHABILY_DISEASE[disease_item.date_type], REHABILY_DISEASE[disease_item.prev_item.date_type]): ""}
                </div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {this.getChangePart(disease_item.treat_start_date, disease_item.prev_item.treat_start_date)}
                </div>
              </div>
            </div>
          )}
          {disease_item.start_date !== undefined && disease_item.start_date !== "" && (
            <div className="flex between drug-item table-row">
              <div className="text-left">
                <div className="table-item">病名登録日</div>
              </div>
              <div className="text-right">
                <div className="table-item remarks-comment">
                  {this.getChangePart(disease_item.start_date, disease_item.prev_item.start_date)}
                </div>
              </div>
            </div>
          )}
        </>
      );
    }
  }
  
  getChangeArray = (cur_arr, prev_arr) => {
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
          {cur.map((item)=>{
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
              <div key = {index} className={item.is_new==1 ?"text-blue": (item.is_deleted == 1 ?"deleted-order": "")}>{item.name}</div>
            )
          })}
        </>
      )
    }
  };
  getAdditionChangeArray = (cur_arr, prev_arr) => {
    let cur = [];
    let prev = [];
    if (prev_arr != undefined && prev_arr != null && Object.keys(prev_arr).length > 0) {
      Object.keys(prev_arr).map(index=>{
        prev.push(prev_arr[index]);
      });
    }
    if (cur_arr != undefined && cur_arr != null && Object.keys(cur_arr).length > 0) {
      Object.keys(cur_arr).map(index=>{
        cur.push(cur_arr[index]);
      });
    }
    if (JSON.stringify(cur) == JSON.stringify(prev)) {
      return (
        <>
          {cur.map((item)=>{
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
              <div key = {index} className={item.is_new==1 ?"text-blue": (item.is_deleted == 1 ?"deleted-order": "")}>{item.name}</div>
            )
          })}
        </>
      )
    }
  };
  
  getDetailChange(cur, prev) {
    let return_array = [];
    if (prev == undefined || prev == null || prev.length == 0) {
      if (cur != undefined && cur != null && cur.length > 0) {
        cur.map(item=>{
          item.is_deleted = 0;
        })
      }
      return_array = cur;
    }
    else {
      if (cur != undefined && cur != null && cur.length > 0) {
        cur.map((item, index)=>{
          if (Object.keys(item).length > 0) {
            item.prev = prev[index];
            if (prev[index] == undefined || prev[index] == null || Object.keys(prev[index]).length == 0 ) {
              item.prev == undefined;
              item.is_deleted = 0;
            }
            return_array.push(item);
          }
        });
      }
      if (prev != undefined && prev != null && prev.length > 0) {
        prev.map((item, index)=>{
          if (Object.keys(item).length > 0) {
            if (cur[index] == undefined || cur[index] == null || cur[index].item_name == undefined || cur[index].item_name == '') {
              item.is_deleted = 1;
              return_array.push(item);
            }
          }
        })
      }
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
  getInsuranceName = (_insuranceName) => {
    let result = "既定";
    if (_insuranceName == undefined || _insuranceName == null || _insuranceName == "") return result;
    return _insuranceName
  }
  
  render() {
    let outputs = this.state.outputs;
    let status_type_array = {1:"開始", 2:"変更", 3:"中止", 4:"終了"};
    let start_place_array = {1:"ベッドサイドより", 2:"リハ医療室にて", 3:"院内にて", 4:"院外にて"};
    let disease_type_array = {1:"急性", 2:"慢性"};
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
                          {this.props.getDepartmentName(item.order_data.order_data.department_id)}
                        </td>
                        <td className="date">
                          {item.updated_at.split('-').join('/')}
                        </td>
                        <td className="text-left">
                          <span className={doctor_change ? "text-blue":""}>{item.order_data.order_data.doctor_name}</span>
                          {item.order_data.order_data.substitute_name !== undefined && item.order_data.order_data.substitute_name !== "" && (
                            <span>、 入力者: {item.order_data.order_data.substitute_name}</span>
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
                                  <div className="phy-box w70p" draggable="true">
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.request_date != undefined && output.prev.order_data.order_data.request_date != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.request_date != undefined && output.order_data.order_data.request_date != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">依頼日</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.request_date, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.request_date, output.prev.order_data.order_data.request_date)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.insurance_name != undefined && output.prev.order_data.order_data.insurance_name != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.insurance_name != undefined && output.order_data.order_data.insurance_name != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">保険</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(this.getInsuranceName(output.order_data.order_data.insurance_name), undefined)
                                            ):(
                                              this.getChangePart(this.getInsuranceName(output.order_data.order_data.insurance_name), this.getInsuranceName(output.prev.order_data.order_data.insurance_name))
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.request_doctor_name != undefined && output.prev.order_data.order_data.request_doctor_name != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.request_doctor_name != undefined && output.order_data.order_data.request_doctor_name != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">依頼医</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.request_doctor_name, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.request_doctor_name, output.prev.order_data.order_data.request_doctor_name)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.prescription_date != undefined && output.prev.order_data.order_data.prescription_date != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.prescription_date != undefined && output.order_data.order_data.prescription_date != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">処方日</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.prescription_date, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.prescription_date, output.prev.order_data.order_data.prescription_date)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.prescription_doctor_name != undefined && output.prev.order_data.order_data.prescription_doctor_name != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.prescription_doctor_name != undefined && output.order_data.order_data.prescription_doctor_name != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">処方医</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.prescription_doctor_name, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.prescription_doctor_name, output.prev.order_data.order_data.prescription_doctor_name)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.status_type != undefined && output.prev.order_data.order_data.status_type != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.status_type != undefined && output.order_data.order_data.status_type != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item"></div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(status_type_array[output.order_data.order_data.status_type], undefined)
                                            ):(
                                              this.getChangePart(status_type_array[output.order_data.order_data.status_type], status_type_array[output.prev.order_data.order_data.status_type])
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.done_want_date != undefined && output.prev.order_data.order_data.done_want_date != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.done_want_date != undefined && output.order_data.order_data.done_want_date != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">実施希望日</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.done_want_date, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.done_want_date, output.prev.order_data.order_data.done_want_date)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.calculation_start_date != undefined && output.prev.order_data.order_data.calculation_start_date != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.calculation_start_date != undefined && output.order_data.order_data.calculation_start_date != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">起算日</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.calculation_start_date, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.calculation_start_date, output.prev.order_data.order_data.calculation_start_date)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.free_comment != undefined && output.prev.order_data.order_data.free_comment != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.free_comment != undefined && output.order_data.order_data.free_comment != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">経過・RISK・合併症等</div>
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
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.special_comment != undefined && output.prev.order_data.order_data.special_comment != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.special_comment != undefined && output.order_data.order_data.special_comment != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">特記事項</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.special_comment, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.special_comment, output.prev.order_data.order_data.special_comment)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.order_data!= undefined && output.order_data.order_data.fault_name_array != undefined && output.order_data.order_data.fault_name_array != null && output.order_data.order_data.fault_name_array.length > 0) ||
                                      (output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.fault_name_array != undefined && output.prev.order_data.order_data.fault_name_array != null && output.prev.order_data.order_data.fault_name_array.length > 0))&& (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">障害名</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {output.prev == null ?(
                                                this.getChangeArray(output.order_data.order_data.fault_name_array, undefined)
                                              ) : (
                                                this.getChangeArray(output.order_data.order_data.fault_name_array, output.prev.order_data.order_data.fault_name_array)
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.start_place != undefined && output.prev.order_data.order_data.start_place != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.start_place != undefined && output.order_data.order_data.start_place != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">開始希望場所</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(start_place_array[output.order_data.order_data.start_place], undefined)
                                            ):(
                                              this.getChangePart(start_place_array[output.order_data.order_data.start_place], start_place_array[output.prev.order_data.order_data.start_place])
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.order_data!= undefined && output.order_data.order_data.basic_policy_array != undefined && output.order_data.order_data.basic_policy_array != null && output.order_data.order_data.basic_policy_array.length > 0) ||
                                      (output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.basic_policy_array != undefined && output.prev.order_data.order_data.basic_policy_array != null && output.prev.order_data.order_data.basic_policy_array.length > 0))&& (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">基本方針</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {output.prev == null ?(
                                                this.getChangeArray(output.order_data.order_data.basic_policy_array, undefined)
                                              ) : (
                                                this.getChangeArray(output.order_data.order_data.basic_policy_array, output.prev.order_data.order_data.basic_policy_array)
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {((output.order_data!= undefined && output.order_data.order_data.social_goal_array != undefined && output.order_data.order_data.social_goal_array != null && output.order_data.order_data.social_goal_array.length > 0) ||
                                      (output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.social_goal_array != undefined && output.prev.order_data.order_data.social_goal_array != null && output.prev.order_data.order_data.social_goal_array.length > 0))&& (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">社会的ゴール</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {output.prev == null ?(
                                                this.getChangeArray(output.order_data.order_data.social_goal_array, undefined)
                                              ) : (
                                                this.getChangeArray(output.order_data.order_data.social_goal_array, output.prev.order_data.order_data.social_goal_array)
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {output.order_data!= undefined && output.order_data.order_data.disease_list != undefined && output.order_data.order_data.disease_list != null && output.order_data.order_data.disease_list.length > 0 && (
                                       output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.disease_list != undefined && output.prev.order_data.order_data.disease_list.length > 0 ?
                                      this.getDiseaseDetailChange(output.order_data.order_data.disease_list, output.prev.order_data.order_data.disease_list) :
                                      this.getDiseaseDetailChange(output.order_data.order_data.disease_list, undefined)
                                    )}
                                    {((output.order_data!= undefined && output.order_data.order_data.developed_date_for_add != undefined && output.order_data.order_data.developed_date_for_add != null && output.order_data.order_data.developed_date_for_add.length > 0) ||
                                      (output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.developed_date_for_add != undefined && output.prev.order_data.order_data.developed_date_for_add != null && output.prev.order_data.order_data.developed_date_for_add.length > 0))&& (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">
                                              {output.order_data.order_data.early_rehabilitation_date_type != undefined && output.order_data.order_data.early_rehabilitation_date_type != null && (
                                                <><span>早期リハビリテーション</span><br /><span>{REHABILY_DISEASE[output.order_data.order_data.early_rehabilitation_date_type]}</span></>
                                              )}</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {output.prev == null ?(
                                                this.getChangePart(output.order_data.order_data.developed_date_for_add, undefined)
                                              ) : (
                                                this.getChangePart(output.order_data.order_data.developed_date_for_add, output.prev.order_data.order_data.developed_date_for_add)
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.disease_type != undefined && output.prev.order_data.order_data.disease_type != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.disease_type != undefined && output.order_data.order_data.disease_type != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">リハビリ直告病患</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(disease_type_array[output.order_data.order_data.disease_type], undefined)
                                            ):(
                                              this.getChangePart(disease_type_array[output.order_data.order_data.disease_type], disease_type_array[output.prev.order_data.order_data.disease_type])
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.acute_date != undefined && output.prev.order_data.order_data.acute_date != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.acute_date != undefined && output.order_data.order_data.acute_date != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">急性憎悪日</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.acute_date, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.acute_date, output.prev.order_data.order_data.acute_date)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.abandoned_syndrome_date != undefined && output.prev.order_data.order_data.abandoned_syndrome_date != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.abandoned_syndrome_date != undefined && output.order_data.order_data.abandoned_syndrome_date != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">廃用症候群憎悪日</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.abandoned_syndrome_date, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.abandoned_syndrome_date, output.prev.order_data.order_data.abandoned_syndrome_date)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.acute_disease_start_date != undefined && output.prev.order_data.order_data.acute_disease_start_date != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.acute_disease_start_date != undefined && output.order_data.order_data.acute_disease_start_date != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">急性期疾患起算日</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart(output.order_data.order_data.acute_disease_start_date, undefined)
                                            ):(
                                              this.getChangePart(output.order_data.order_data.acute_disease_start_date, output.prev.order_data.order_data.acute_disease_start_date)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {((output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.infection_exist != undefined && output.prev.order_data.order_data.infection_exist != "") ||
                                      (output.order_data!= undefined && output.order_data.order_data.infection_exist != undefined && output.order_data.order_data.infection_exist != "" )) && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">感染症</div>
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">
                                            {output.prev == null ? (
                                              this.getChangePart((output.order_data.order_data.infection_exist == 1 ? "有" : "無"), undefined)
                                            ):(
                                              this.getChangePart((output.order_data.order_data.infection_exist == 1 ? "有" : "無"), (output.prev.order_data.order_data.infection_exist == 1 ? "有" : "無"))
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {output.detail_data != undefined && output.detail_data != null && output.detail_data.length > 0 && output.detail_data.map((item,index)=>{
                                      if (item.is_deleted == true) {
                                        return(
                                          <div key={index} className="deleted-order">
                                            {item.therapy_item1_name != undefined && item.therapy_item1_name != '' && (
                                              <>
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">療法項目１</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">{item.therapy_item1_name}</div>
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            {item.therapy_item2_name != undefined && item.therapy_item2_name != '' && (
                                              <>
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">療法項目２</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">
                                                      {item.therapy_item2_name}
                                                      {item.therapy_item2_amount != undefined && item.therapy_item2_amount != "" ? " " + item.therapy_item2_amount : ""}
                                                      {item.therapy_item2_amount != undefined && item.therapy_item2_amount != "" && item.therapy_item2_unit != undefined ? item.therapy_item2_unit : ''}
                                                    </div>
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            {item.therapy_item2_amount != undefined && item.therapy_item2_amount != '' && (
                                              <>
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">療法項目２</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">
                                                      {item.therapy_item2_amount}{item.therapy_item2_unit != undefined ? item.therapy_item2_unit : ''}
                                                    </div>
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            {item.position1_name != undefined && item.position1_name != '' && (
                                              <>
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">部位1</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">{item.position1_name}</div>
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            {item.position2_name != undefined && item.position2_name != null && item.position2_name != "" && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item">部位2</div>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">{item.position2_name}</div>
                                                </div>
                                              </div>
                                            )}
                                            {item.item_details !== undefined && item.item_details != null && item.item_details.length > 0 && (
                                              <div className="flex between drug-item table-row">
                                                <div className="text-left">
                                                  <div className="table-item"/>
                                                </div>
                                                <div className="text-right">
                                                  <div className="table-item remarks-comment">
                                                    {item.item_details.map(sub_item=>{
                                                      return (
                                                        <div key={sub_item}>
                                                          {sub_item.item_name !== undefined && sub_item.item_name != null && sub_item.item_name !== "" && (
                                                            <label>{sub_item.item_name}{((sub_item.value1 != undefined && sub_item.value1 != null) || (sub_item.value2 != undefined && sub_item.value2 != null)) ? "：":""}</label>
                                                          )}
                                                          {sub_item.format1 != null && sub_item.format1 != undefined && sub_item.format1.includes("年") && sub_item.format1.includes("月") ? (
                                                            <label>
                                                              {sub_item.value1 != null && sub_item.value1 != undefined && (
                                                                <label>{(sub_item.value1_format !== undefined) ? sub_item.value1_format : sub_item.value1}</label>
                                                              )}
                                                              {sub_item.value2 != null && sub_item.value2 != undefined && (
                                                                <> ~ <label>{(sub_item.value2_format !== undefined) ? sub_item.value2_format : sub_item.value2}</label></>
                                                              )}
                                                            </label>
                                                          ):(
                                                            <label>
                                                              {sub_item.value1 != null && sub_item.value1 != undefined && (
                                                                <label>{sub_item.value1}</label>
                                                              )}
                                                              {sub_item.value2 != null && sub_item.value2 != undefined && (
                                                                <label>{sub_item.value2}</label>
                                                              )}
                                                            </label>
                                                          )}
                                                          {sub_item.lot !== undefined && sub_item.lot != null && sub_item.lot !== "" && (
                                                            <label>{sub_item.lot}{((sub_item.value1 != undefined && sub_item.value1 != null) || (sub_item.value2 != undefined && sub_item.value2 != null)) ? "：":""}</label>
                                                          )}
                                                        </div>
                                                      )}
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )
                                      } else {
                                        return(
                                          <div key={index}>
                                            {item.therapy_item1_name != undefined && item.therapy_item1_name != '' && (
                                              <>
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">療法項目１</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">
                                                      {item.prev_item != undefined && item.prev_item != null ?
                                                        this.getChangePart(item.therapy_item1_name, item.prev_item.therapy_item1_name) :
                                                        this.getChangePart(item.therapy_item1_name, undefined) }
                                                    </div>
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            {item.therapy_item2_name != undefined && item.therapy_item2_name != '' && (
                                              <>
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">療法項目２</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">
                                                      {item.prev_item != undefined && item.prev_item != null ?
                                                        this.getChangePart(
                                                          item.therapy_item2_amount != undefined && item.therapy_item2_amount != "" ?
                                                            (item.therapy_item2_name + " " + item.therapy_item2_amount + (item.therapy_item2_unit != undefined ? item.therapy_item2_unit : '')) :
                                                            item.therapy_item2_name,
                                                          item.prev_item.therapy_item2_amount != undefined && item.prev_item.therapy_item2_amount != "" ?
                                                            (item.prev_item.therapy_item2_name + " " + item.prev_item.therapy_item2_amount + (item.prev_item.therapy_item2_unit != undefined ? item.prev_item.therapy_item2_unit : '')) :
                                                            item.therapy_item2_name,) :
                                                        this.getChangePart(item.therapy_item2_amount != undefined && item.therapy_item2_amount != "" ?
                                                          (item.therapy_item2_name + " " + item.therapy_item2_amount + (item.therapy_item2_unit != undefined ? item.therapy_item2_unit : '')) :
                                                          item.therapy_item2_name, undefined) }
                                                    </div>
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            {item.position1_name != undefined && item.position1_name != '' && (
                                              <>
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">部位1</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">
                                                      {item.prev_item != undefined && item.prev_item != null ?
                                                        this.getChangePart(item.position1_name, item.prev_item.position1_name) :
                                                        this.getChangePart(item.position1_name, undefined) }
                                                    </div>
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            {item.position2_name != undefined && item.position2_name != '' && (
                                              <>
                                                <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                    <div className="table-item">部位2</div>
                                                  </div>
                                                  <div className="text-right">
                                                    <div className="table-item remarks-comment">
                                                      {item.prev_item != undefined && item.prev_item != null ?
                                                        this.getChangePart(item.position2_name, item.prev_item.position2_name) :
                                                        this.getChangePart(item.position2_name, undefined) }
                                                    </div>
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                            {((item.item_details != undefined && item.item_details != null && item.item_details.length > 0) || 
                                            (item.prev_item != undefined && item.prev_item.item_details != undefined && item.prev_item.item_details != null && item.prev_item.item_details.length > 0)) && (
                                              item.prev_item != undefined && item.prev_item != null ?
                                                this.getDetailChange(item.item_details, item.prev_item.item_details) :
                                                this.getDetailChange(item.item_details, undefined)
                                            )}
                                          </div>
                                        )
                                      }}
                                    )}
                                    {((output.order_data!= undefined && output.order_data.order_data.additions != undefined && output.order_data.order_data.additions != null && Object.keys(output.order_data.order_data.additions).length > 0) ||
                                      (output.prev != null && output.prev.order_data!= undefined && output.prev.order_data.order_data.additions != undefined && output.prev.order_data.order_data.additions != null && Object.keys(output.prev.order_data.order_data.additions).length > 0))&& (
                                      <>
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">追加指示・指導・処置等選択</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="table-item remarks-comment">
                                              {output.prev == null ?(
                                                this.getAdditionChangeArray(output.order_data.order_data.additions, undefined)
                                              ) : (
                                                this.getAdditionChangeArray(output.order_data.order_data.additions, output.prev.order_data.order_data.additions)
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </>
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
ChangeRehabilyLogModal.contextType = Context;

ChangeRehabilyLogModal.propTypes = {
  closeModal: PropTypes.func,
  getDepartmentName: PropTypes.func,
  orderNumber: PropTypes.number,
  insuranceTypeList: PropTypes.array,
  historySoapList: PropTypes.array,
};

export default ChangeRehabilyLogModal;