import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import {secondary200,disable} from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import {getStaffName} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";
import * as apiClient from "~/api/apiClient";
import renderHTML from "react-render-html";
import {formatDateTimeJapan} from "~/helpers/date";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
`;

const MedicineListWrapper = styled.div`
  font-size: 1rem;
  .text-red{
    color: #ff0000;
    text-decoration: line-through rgb(255, 0, 0);
  }
  .text-blue{color: #0000ff;}
  .deleted-order {text-decoration: line-through;}
  .right-value {width: calc(100% - 11rem);}
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
      left: 11rem;
    }    
    .text-left{
      .table-item{
        width: 10rem;
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
    padding: 0.25rem;
  }
  .text-right {width: calc(100% - 88px);}
  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 20px);
    word-wrap: break-word;
  }
  .deleted-order{text-decoration: line-through;}
  .pass-item {
    // width:calc(((100vw - 200px) /3) - 14.5rem);
    width:100%;
    border-top:1px solid #eaeaea;
  }
  .pass-label {
    width:2rem;
    text-align:center;
    border-right:1px solid #dee2e6;
    padding:0.25rem;
  }
  .pass-content {
    width:calc(100% - 2rem);
    padding:0.25rem;
    font-family: "MS Gothic", monospace;
    p {margin:0;}
  }
`;

export class NurseRecordChangeLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loaded:false,
      history_list:[],
      outputs:[],
    };
  }
  
  async componentDidMount() {
    let path = "/app/api/v2/nurse/record/view_history";
    let post_data = {
      history_numbers:this.props.history_numbers,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        res.map(item=>{
          item.history_show = 1;
        });
        let differences = this.checkDifference(res);
        this.setState({
          is_loaded:true,
          history_list:res,
          outputs: differences.outputs,
        });
      })
      .catch(() => {
      });
  }

  checkDifference = (results) => {
    let outputs = [];
    let result = results.filter(x=>x.history_show==1);
    if (result.length > 0) {
      result.map((record, index) => {
        let version = results.findIndex(x=>x.number == record.number);
        version = results.length - version;
        let current = record;
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
    if (cond === "inspection-date") {
      if (cur != prev) {
        return "different";
      }
    }
    if (cond === "array_names") {
      let data = cur.map(item=>{
        return item.name;
      });
      if (!data.includes(cur)) {
        return "different";
      }
    }
    return "equal";
  }

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
  
  //この関数はカラーを変更させるために
  soapColorChange = (text, color) => {
    if(text == null || text == '') return "";
    text = text.toString();
    return text.replace(/color="#[0-9a-f]+"/gi, "color='" + color + "'");
  }
  
  strip_html_tags (str) {
    if ((str===null) || (str==='')){
      return false;
    } else {
      str = str.toString();
    }
    return str.replace(/<[^>]*>/g, '');
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
    let nursing_problems = this.props.nursing_problems;
    return (
      <Modal show={true} size="lg" className="modal-history-inspection">
        <Modal.Header>
          <Modal.Title>変更履歴</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            {this.state.is_loaded ? (
              <>
                <div className="history-list">
                  <table className="table table-bordered table-hover">
                    <thead>
                    <tr>
                      <th className="check"> </th>
                      <th className="version">版数</th>
                      <th className="w-3">進捗</th>
                      <th className="date">変更日時</th>
                      <th className="">変更者</th>
                    </tr>
                    </thead>
                    <tbody>
                    {history_list.map((item, index) => {
                      index = history_list.length - index;
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
                              {index == 1 ? "初版" : parseInt(index).toString() + "版"}
                            </td>
                            <td className="w-3">
                              {item.is_enabled == 2 ? "削除" : (index == 1 ? "新規" : "修正")}
                            </td>
                            <td className="date">{item.updated_at.split('-').join('/')}</td>
                            <td className="text-left">{getStaffName(item.updated_by)}</td>
                          </tr>
                        </>
                      );
                    })}
                    </tbody>
                  </table>
                </div>
                <div className="history-content">
                  {outputs.map(output=>{
                    return (
                      <>
                        <TabContent>
                          <div className="row">
                            <div className="content w-100">
                              <div className="content-header">
                                <span className="mr-3">{"（" + (output.version == 1 ? "初" : output.version) + "版）"}</span>
                                <span className="mr-3">{output.is_enabled == 2 ? "削除" : (output.version == 1 ? "新規" : "修正")}</span>
                                <span className="mr-3">{output.updated_at.split('-').join('/')}</span>
                                <span className="mr-3">{getStaffName(output.updated_by)}</span>
                              </div>
                              <MedicineListWrapper>
                                <div className={`history-item ${(output.is_enabled == 2) ? "deleted-order" : ""}`}>
                                  <div className="history-item">
                                    <div className="phy-box w70p">
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">記録時間</div>
                                        </div>
                                        <div className="text-left right-value">
                                          {output.prev == null ? (
                                            this.getChangePart(formatDateTimeJapan(output.record_date), undefined)
                                          ):(
                                            this.getChangePart(formatDateTimeJapan(output.record_date), formatDateTimeJapan(output.prev.record_date))
                                          )}
                                        </div>
                                      </div>
                                      {((output.prev != null && output.prev.nursing_problem_id != 0) || (output.nursing_problem_id != 0)) && (
                                        <div className="flex between drug-item table-row">
                                          <div className="text-left">
                                            <div className="table-item">問題</div>
                                          </div>
                                          <div className="text-left right-value" style={{wordBreak:"break-all"}}>
                                            {output.prev == null ? (
                                              this.getChangePart(((nursing_problems.find((x) => x.id == output.nursing_problem_id) !== undefined) ?
                                                nursing_problems.find((x) => x.id == output.nursing_problem_id).value : ""), undefined)
                                            ):(
                                              this.getChangePart(((nursing_problems.find((x) => x.id == output.nursing_problem_id) !== undefined) ?
                                                nursing_problems.find((x) => x.id == output.nursing_problem_id).value : ""),
                                                ((nursing_problems.find((x) => x.id == output.prev.nursing_problem_id) !== undefined) ?
                                                  nursing_problems.find((x) => x.id == output.prev.nursing_problem_id).value : ""))
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      <div className="flex between drug-item table-row" style={{padding:0}}>
                                        <div className="text-left" style={{padding:"0.25rem", paddingRight:"none"}}>
                                          <div className="table-item">本文</div>
                                        </div>
                                        <div className="text-left right-value" style={{wordBreak:"break-all"}}>
                                          {output.passing_of_time.length > 0 && (
                                            output.passing_of_time.map((item, item_idx)=>{
                                              return (
                                                <>
                                                  <div className={'flex pass-item'} style={{borderTop:(item_idx == 0 ? "none" : "")}}>
                                                    <div className={'pass-label'}>
                                                      {this.props.passing_of_time_type_label[item.passing_of_time_type_id] !== undefined ? this.props.passing_of_time_type_label[item.passing_of_time_type_id] : ""}
                                                    </div>
                                                    <div className={'pass-content'}>
                                                      {output.prev == null ? (
                                                        this.getChangePart(this.changeSpaceChar(item.passing_of_time), undefined)
                                                      ):(
                                                        this.getChangePart(this.changeSpaceChar(item.passing_of_time),
                                                          this.changeSpaceChar(output.prev.passing_of_time[item_idx] !== undefined ? output.prev.passing_of_time[item_idx].passing_of_time : ""))
                                                      )}
                                                    </div>
                                                  </div>
                                                </>
                                              )
                                            })
                                          )}
                                        </div>
                                      </div>
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
              </>
            ):(
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} className="cancel-btn">閉じる</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

NurseRecordChangeLog.contextType = Context;
NurseRecordChangeLog.propTypes = {
  closeModal: PropTypes.func,
  history_numbers: PropTypes.string,
  nursing_problems: PropTypes.object,
  passing_of_time_type_label: PropTypes.object,
};
export default NurseRecordChangeLog;