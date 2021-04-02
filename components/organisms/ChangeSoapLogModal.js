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
import renderHTML from 'react-render-html';
import $ from "jquery";
import * as sessApi from "~/helpers/cacheSession-utils";
import {getStaffName} from "~/helpers/constants";

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
  .font-mono {font-family: monospace;}

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

export class ChangeSoapLogModal extends Component {
  constructor(props) {
    super(props);
    const differences = this.checkDifference(this.props.historySoapList);
    this.state = {
      outputs: differences.outputs,
      patient_id: differences.patient_id,
      history_list: this.props.historySoapList
    };
  }
  async UNSAFE_componentWillMount() {
    let data = sessApi.getDoctorList();
    let history_list = [...this.props.historySoapList];
    history_list.map(item=>{
      item.history_show = 1;
      item.doctor_name = data.find(x=>x.doctor_code == item.instruction_doctor_code).name;
      item.substitute_name = item.is_doctor_consented == 2 ? "": getStaffName(item.updated_by);
    });
    const differences = this.checkDifference(this.props.historySoapList);
    this.setState({
      outputs: differences.outputs,
      history_list
    });
  }

  componentDidMount () {
    $(".text-blue").children().css({"color": "blue"});
    $(".deleted-order").children().css({"text-decoration": "line-through"});
    document.getElementById("log_cancel_id").focus();
  }
  strip_html_tags (str) {
    if ((str===null) || (str==='')){
        return false;
    } else {
      str = str.toString();
    }
    return str.replace(/<[^>]*>/g, '');
  }

  checkDifference = (results) => {
    let outputs = [];
    let result = results.filter(x=>x.history_show==1);
    let patient_id = '';
    let data = sessApi.getDoctorList();

    if (result.length > 0) {
      result.map((order, index) => {
        let version = this.props.historySoapList.findIndex(x=>x.number == order.number);
        patient_id = order.patient_id;
        version = this.props.historySoapList.length - version;
        let current = order;
        
        current.doctor_name = data.find(x=>x.doctor_code == order.instruction_doctor_code).name;
        current.department_name = this.props.getDepartmentName(order.department_code);
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
      outputs: outputs,
      patient_id,
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

  //この関数はカラーを変更させるために
  soapColorChange = (text, color) => {
    if(text == null || text == '') return "";
    text = text.toString();
    return text.replace(/color="#[0-9a-f]+"/gi, "color='" + color + "'");
  }
  getChangePart = (cur, prev) => {
    if (cur == prev) {
      return (
        <>
          <div>{cur != undefined && cur != null && cur != '' ? renderHTML(this.soapColorChange(cur, "black")) : ""}</div>
        </>
      )
    } else {
      if (cur == undefined || cur == null || cur == '' || this.strip_html_tags(cur)=='') {
        return (
          <>
          {prev != undefined && prev != null && prev != '' && (
            <div className="deleted-order">{renderHTML(this.soapColorChange(prev, "black"))}</div>
          )}
          </>
        )
      } else if (prev == undefined || prev == null || prev == '' || this.strip_html_tags(prev)=='') {
        return (
          <div className="text-blue">{cur != undefined && cur != null && cur != '' ? renderHTML(this.soapColorChange(cur, "blue")) : ""}</div>
        )
      } else {
        return (
          <>
            <div className="text-blue">{cur != undefined && cur != null && cur != '' ? renderHTML(this.soapColorChange(cur, "blue")) : ""}</div>
            <div className='deleted-order'>{prev != undefined && prev != null && prev != '' ? renderHTML(this.soapColorChange(prev, "black")) : ""}</div>
          </>
        )
      }
    }
  };
  
  changeSpaceChar=(text)=>{
    if(text == null || text == ""){return '';}
    text = text.split('');
    let text_length = text.length;
    for(let index = 0; index < text_length; index++){
      if(text[index] == " "){
        if(index == 0){
          text[index] = "&nbsp;";
        } else {
          let change_flag = false;
          for(let prev_index = index - 1; prev_index >= 0; prev_index--){
            if(text[prev_index] == "<"){
              change_flag = true;
              break;
            }
            if(text[prev_index] == ">"){
              text[index] = "&nbsp;";
              change_flag = true;
              break;
            }
          }
          if(!change_flag){
            text[index] = "&nbsp;";
          }
        }
      }
    }
    return text.join('');
  }

  render() {    
    let outputs = this.state.outputs;
    let history_list = this.state.history_list;
    let SoapCategory = this.props.soap_sub_category != undefined && this.props.soap_sub_category != '' ? this.props.soap_sub_category : 'プログレスノート';
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
                        if (item.doctor_name !== history_list[index + 1].doctor_name) doctor_change = true;
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
                              {this.props.getDepartmentName(item.department_code) }
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
                if(output.history_show == 1){
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
                                    {output.sharp_text !== "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">{SoapCategory != "プログレスノート" ? "主訴" : "#"}</div>
                                        </div>
                                        <div className="text-left font-mono">
                                          {output.prev == null ? (
                                            this.getChangePart(this.changeSpaceChar(output.sharp_text), undefined)
                                          ):(
                                            this.getChangePart(this.changeSpaceChar(output.sharp_text), this.changeSpaceChar(output.prev.sharp_text))
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    {output.s_text !== "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">{SoapCategory != "プログレスノート" ? "現病歴" : "(S)"}</div>
                                        </div>
                                        <div className="text-left font-mono">
                                          {output.prev == null ? (
                                            this.getChangePart(this.changeSpaceChar(output.s_text), undefined)
                                          ):(
                                            this.getChangePart(this.changeSpaceChar(output.s_text), this.changeSpaceChar(output.prev.s_text))
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    {output.o_text !== "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">{SoapCategory != "プログレスノート" ? "所見" : "(O)"}</div>
                                        </div>
                                        <div className="text-left font-mono">
                                          {output.prev == null ? (
                                            this.getChangePart(this.changeSpaceChar(output.o_text), undefined)
                                          ):(
                                            this.getChangePart(this.changeSpaceChar(output.o_text), this.changeSpaceChar(output.prev.o_text))
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    {output.a_text !== "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">{SoapCategory != "プログレスノート" ? "アセスメント" : "(A)"}</div>
                                        </div>
                                        <div className="text-left font-mono">
                                          {output.prev == null ? (
                                            this.getChangePart(this.changeSpaceChar(output.a_text), undefined)
                                          ):(
                                            this.getChangePart(this.changeSpaceChar(output.a_text), this.changeSpaceChar(output.prev.a_text))
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    {output.p_text !== "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">{SoapCategory != "プログレスノート" ? "プラン" : "(P)"}</div>
                                        </div>
                                        <div className="text-left font-mono">
                                          {output.prev == null ? (
                                            this.getChangePart(this.changeSpaceChar(output.p_text), undefined)
                                          ):(
                                            this.getChangePart(this.changeSpaceChar(output.p_text), this.changeSpaceChar(output.prev.p_text))
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
ChangeSoapLogModal.contextType = Context;

ChangeSoapLogModal.propTypes = {
  closeModal: PropTypes.func,
  getDepartmentName: PropTypes.func,
  orderNumber: PropTypes.number,
  insuranceTypeList: PropTypes.array,
  historySoapList: PropTypes.array,
  soap_sub_category: PropTypes.string,
};

export default ChangeSoapLogModal;