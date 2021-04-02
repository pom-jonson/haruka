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
import {displayLineBreak} from "~/helpers/dialConstants"
import { ALLERGY_STATUS_ARRAY } from "~/helpers/constants";
import {getStaffName} from "~/helpers/constants";
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
      left: 140px;
    }    

    .text-left{
      .table-item{
        width: 150px;
        float: left;
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

export class ChangeAllergyLogModal extends Component {
  constructor(props) {
    super(props);
    const differences = this.checkDifference(this.props.historySoapList);
    this.state = {
      outputs: differences.outputs,
      history_list: this.props.historySoapList,
      complete_message: ""
    };
  }
  async UNSAFE_componentWillMount() {
    let history_list = [...this.props.historySoapList];
    history_list.map(item=>{
      item.history_show = 1;
      item.substitute_name = item.is_doctor_consented == 2 ? "" : getStaffName(item.updated_by);
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

  getChangePart = (cur, prev) => {
    if (cur == prev) {
      return (
        <>
          <div>{cur != undefined ? displayLineBreak(cur) : ""}</div>
        </>
      )
    } else {
      if (cur == undefined || cur == null || cur == '') {
        return (
          <>
          {prev != undefined && (
            <div className="deleted-order">{displayLineBreak(prev)}</div>
          )}
          </>
        )
      } else if (prev == undefined || prev == null || prev == '') {
        return (
          <div className="text-blue">{cur != undefined ? displayLineBreak(cur) : ""}</div>
        )
      } else {
        return (
          <>
            <div className="text-blue">{cur != undefined ? displayLineBreak(cur) : ""}</div>
            <div className='deleted-order'>{prev != undefined ? displayLineBreak(prev) : ""}</div>
          </>
        )
      }
    }
  };

  getOptional = (optional_json) => {
    let optional_str = '';
    if (optional_json != undefined && optional_json['tpha'] != 0) {
      optional_str = optional_str + "TPHA：" + (optional_json['tpha'] == 1 ? "(+)": optional_json['tpha'] == 2 ? "(-)" : "(±) ");
    }
    if (optional_json != undefined && optional_json['hbs_ag'] != 0) {
      optional_str = optional_str + "HBs-Ag：" + (optional_json['hbs_ag'] == 1 ? "(+)": optional_json['hbs_ag'] == 2 ? "(-)" : "(±) ");
    }
    if (optional_json != undefined && optional_json['hcv_Ab'] != 0) {
      optional_str = optional_str + "HCV-Ab：" + (optional_json['hcv_Ab'] == 1 ? "(+)": optional_json['hcv_Ab'] == 2 ? "(-)" : "(±) ");
    }
    if (optional_json != undefined && optional_json['hiv'] != 0) {
      optional_str = optional_str + "HIV：" + (optional_json['hiv'] == 1 ? "(+)": optional_json['hiv'] == 2 ? "(-)" : "(±) ");
    }
    return optional_str;
  }
  
  printLog = () => {
    let {outputs} = this.state;
    if (outputs.findIndex(x=>x.history_show == 1) == -1) return;
    this.setState({
      isConfirmComplete:true,
      complete_message:"印刷中"
    });
    let path = "/app/api/v2/order/print/allergy_log";
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
    let print_disable = false;
    if (outputs.findIndex(x=>x.history_show == 1) == -1) print_disable = true;
    let body1_title = "";
    let body2_title = "";
    // let alergy_title = "";
    if (history_list[0] !== undefined){
      switch (history_list[0].type) {
        case "past":
          body1_title = "既往歴";
          body2_title = "アレルギー";
          // alergy_title = "既往歴・アレルギー";
          break;
        case "foodalergy":
          body1_title = "食物アレルギー";
          // alergy_title = "食物アレルギー";
          break;
        case "drugalergy":
          body1_title = "薬剤アレルギー";
          // alergy_title = "薬剤アレルギー";
          break;
        case "disabled":
          body1_title = "障害情報";
          // alergy_title = "障害情報";
          break;
        case "vaccine":
          body1_title = "患者ワクチン情報";
          // alergy_title = "患者ワクチン情報";
          break;
        case "adl":
          body1_title = "ADL情報";
          // alergy_title = "ADL情報";
          break;
        case "infection":
          body1_title = "感染症";
          body2_title = "状態";
          // alergy_title = "感染症";
          break;
        case "alergy":
          body1_title = "一般アレルギー";
          body2_title = "状態";
          // alergy_title = "一般アレルギー";
          break;
        case "contraindication":
          body1_title = "禁忌";
          // alergy_title = "禁忌";
          break;
      case "process_hospital":
          body1_title = "主訴";
          body2_title = "現病歴";
          // alergy_title = "入院までの経過";
          break;
      case "inter_summary":
          body1_title = "臨床経過";
          // alergy_title = "中間サマリー";
          body2_title = "治療方針";
          break;
      case "current_symptoms_on_admission":
          body1_title = "入院時身体所見";
          body2_title = "入院時検査所見";
          break;
      }
    }
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
                            <div className={`history-item soap-data-item ${output.is_enabled == 2 ? 'deleted-order' : ''}`}>
                              <div className="history-item">
                                <div className="phy-box w70p" draggable="true">
                                  {output.order_data.order_data.body_1 !== "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">{body1_title}</div>
                                      </div>
                                      <div className="text-left">
                                      {output.prev == null ? (
                                       this.getChangePart(output.order_data.order_data.body_1, undefined)
                                      ):(
                                        this.getChangePart(output.order_data.order_data.body_1, output.prev.order_data.order_data.body_1)
                                      )}
                                      </div>
                                    </div>
                                  )}
                                  {body2_title !== "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">{body2_title}</div>
                                      </div>
                                      <div className="text-left">
                                      {output.order_data.order_data.type == "current_symptoms_on_admission" && (
                                        <>
                                          {output.prev == null ? (
                                          this.getChangePart(this.getOptional(output.order_data.order_data.optional_json), undefined)
                                          ):(
                                            this.getChangePart(this.getOptional(output.order_data.order_data.optional_json), this.getOptional(output.prev.order_data.order_data.optional_json))
                                          )}
                                        </>
                                      )}
                                      {output.prev == null ? (
                                       this.getChangePart((output.order_data.order_data.type === "infection" || output.order_data.order_data.type === "alergy") ?
                                                  ALLERGY_STATUS_ARRAY[parseInt(output.order_data.order_data.body_2)] :
                                                  output.order_data.order_data.body_2, undefined)
                                      ):(
                                        this.getChangePart((output.order_data.order_data.type === "infection" || output.order_data.order_data.type === "alergy") ?
                                                  ALLERGY_STATUS_ARRAY[parseInt(output.order_data.order_data.body_2)] :
                                                  output.order_data.order_data.body_2,
                                                  (output.prev.order_data.order_data.type === "infection" || output.prev.order_data.order_data.type === "alergy") ?
                                                  ALLERGY_STATUS_ARRAY[parseInt(output.prev.order_data.order_data.body_2)] :
                                                  output.prev.order_data.order_data.body_2)
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
                }
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
          <Button onClick={this.printLog} id='log_print_id' className={print_disable ? "disable-btn" : "red-btn"}>印刷</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
ChangeAllergyLogModal.contextType = Context;

ChangeAllergyLogModal.propTypes = {
  closeModal: PropTypes.func,
  getDepartmentName: PropTypes.func,
  orderNumber: PropTypes.number,
  insuranceTypeList: PropTypes.array,
  historySoapList: PropTypes.array,
};

export default ChangeAllergyLogModal;