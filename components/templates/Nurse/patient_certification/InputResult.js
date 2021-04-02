import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import {formatDateSlash, formatTimeIE} from "~/helpers/date";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const Wrapper = styled.div`  
  width: 100%;
  height: 100%;
  font-size: 1rem;
  overflow-y:auto;
  .flex{display: flex;}
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .title-area {
    width:33%;
    thead{
      border-bottom: 1px solid #dee2e6;
    }
    tbody{
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
    }
    th {
      position: sticky;
      white-space:nowrap;
      border:1px solid #dee2e6;
      border-bottom:none;
      border-top:none;
      font-weight: normal;
    }
  }
  .input-area {
    width:65%;
    .select-check {
      display:flex;
      label {
        font-size:1rem;
        line-height:2rem;
      }
    }
    tr{
      box-sizing: border-box;
    }
    th {
      border-bottom: 1px solid #dee2e6;
    }
  }
  table {
    margin:0px;
    thead{
      display:table;
      width:100%;
      tr{width: calc(100% - 17px);}
    }
    tbody{
      display:block;
      overflow-y: scroll;
      height: calc(70vh - 20rem);
      width:100%;
    }
    tr{
      display: table;
      width: 100%;
    }
    td {
      padding: 0.25rem;
      word-break: break-all;
      font-size: 1rem;
      vertical-align: middle;
    }
    th {
      text-align: center;
      padding: 0.25rem;
    }
    .td-check{
      text-align: center;
      label, input {margin: 0;}
    }
    .selected {
      background: rgb(105, 200, 225) !important;
      color: white;
    }
    .input-value {
      padding:0;
      div {margin-top:0;}
      .label-title {display:none;}
      input {
        width:100%;
        height:2rem;
        font-size:1rem;
      }
    }
    .ime-active {
      input {ime-mode: active;}
    }
    .hankaku-eng-num-input {
      ime-mode: inactive;
      input{
        ime-mode: inactive;
      }
    }
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class InputResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input_result_skip:0,
      start_date_time:null,
      end_date_time:null,
      drip_speed_enable:0,
      start_date_time_enable:0,
      end_date_time_enable:0,
      in_amount_enable:0,
      comment_enable:0,
      drip_speed:"",
      in_amount:"",
      comment:"",
      alert_messages: "",
      alert_title:"",
      load_flag:false,
    };
    this.help_data = "";
  }
  
  async UNSAFE_componentWillMount () {
    let path = "/app/api/v2/nursing_service/get/patient_certification/input_result/master";
    let post_data = {
      food_type:this.state.summary_data != null ? this.state.summary_data.food_type : 0,
      writer:this.state.summary_data != null ? this.state.summary_data.writer : 0,
    };
    await apiClient.post(path, {params: post_data})
      .then(res => {
        this.help_data = (res.help_data != undefined && res.help_data.text != undefined) ? res.help_data.text : "";
      })
      .catch(()=> {
      })
    this.setState({load_flag:true});
  }
  
  setCheckState = (name, value) => {
    this.change_flag = 1;
    this.setState({[name]: value});
  }
  
  setDateTime = (name) => {
    this.change_flag = 1;
    this.setState({[name]: new Date()});
  }
  
  setNumericValue = (key,e) => {
    if(e.target.value == "" || parseInt(e.target.value) > 0){
      this.change_flag = 1;
      this.setState({[key]: e.target.value});
    } else {
      this.setState({[key]: this.state[key]});
    }
  }
  
  setTextValue = (key,e) => {
    this.change_flag = 1;
    this.setState({[key]: e.target.value});
  }
  
  helpView=()=>{
    this.setState({
      alert_messages: this.help_data,
      alert_title:"ガイド",
    });
  }
  
  closeModal=()=>{
    this.setState({
      alert_messages: "",
      alert_title:"",
    });
  }

  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm input-result first-view-modal"
        >
          <Modal.Header><Modal.Title>結果入力</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              {this.state.load_flag ? (
                <>
                  <div className={'flex'}><button style={{marginLeft:"auto", marginRight:0}} onClick={this.helpView}>ガイド</button></div>
                  <div className={'flex justify-content'} style={{marginTop:"0.5rem"}}>
                    <div className={'title-area'}>
                      <div style={{marginTop:"2.5rem"}}>
                        <table className="table-scroll table table-bordered">
                          <thead>
                          <tr>
                            <th>薬品</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr><td>薬品１</td></tr>
                          <tr><td>薬品２</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className={'input-area'}>
                      <div className={'flex'}>
                        <button onClick={this.setDateTime.bind(this, 'start_date_time')}>開始時刻</button>
                        <button onClick={this.setDateTime.bind(this, 'end_date_time')} style={{marginLeft:"0.5rem"}}>終了時刻</button>
                        <div className={'select-check'} style={{marginLeft:"1rem"}}>
                          <Checkbox
                            label="結果入力をスキップする"
                            getRadio={this.setCheckState.bind(this)}
                            value={this.state.input_result_skip}
                            name="input_result_skip"
                          />
                        </div>
                      </div>
                      <div style={{marginTop:"0.5rem"}}>
                        <table className="table-scroll table table-bordered">
                          <thead>
                          <tr>
                            <th style={{width:"3rem"}}>表示</th>
                            <th style={{width:"10rem"}}>測定名称</th>
                            <th>結果</th>
                            <th style={{width:"5rem"}}>単位</th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr>
                            <td className={'td-check'} style={{width:"3rem"}}>
                              <Checkbox
                                label=""
                                getRadio={this.setCheckState.bind(this)}
                                value={this.state.drip_speed_enable}
                                name="drip_speed_enable"
                              />
                            </td>
                            <td style={{width:"10rem"}}>点滴速度</td>
                            <td className={'input-value hankaku-eng-num-input'}>
                              <InputWithLabelBorder
                                label=""
                                type="text"
                                id={'drip_speed_id'}
                                getInputText={this.setNumericValue.bind(this, "drip_speed")}
                                diseaseEditData = {this.state.drip_speed}
                              />
                            </td>
                            <td style={{width:"5rem"}}>ｍｌ/ｈ</td>
                          </tr>
                          <tr>
                            <td className={'td-check'} style={{width:"3rem"}}>
                              <Checkbox
                                label=""
                                getRadio={this.setCheckState.bind(this)}
                                value={this.state.in_amount_enable}
                                name="in_amount_enable"
                              />
                            </td>
                            <td style={{width:"10rem"}}>IN量</td>
                            <td className={'input-value hankaku-eng-num-input'}>
                              <InputWithLabelBorder
                                label=""
                                type="text"
                                id={'in_amount_id'}
                                getInputText={this.setNumericValue.bind(this, "in_amount")}
                                diseaseEditData = {this.state.in_amount}
                              />
                            </td>
                            <td style={{width:"5rem"}}>ａｌ</td>
                          </tr>
                          <tr>
                            <td className={'td-check'} style={{width:"3rem"}}>
                              <Checkbox
                                label=""
                                getRadio={this.setCheckState.bind(this)}
                                value={this.state.start_date_time_enable}
                                name="start_date_time_enable"
                              />
                            </td>
                            <td style={{width:"10rem"}}>開始時刻</td>
                            <td>{this.state.start_date_time != null ? (formatDateSlash(this.state.start_date_time) + ' ' + formatTimeIE(this.state.start_date_time)) : ""}</td>
                            <td style={{width:"5rem"}}> </td>
                          </tr>
                          <tr>
                            <td className={'td-check'} style={{width:"3rem"}}>
                              <Checkbox
                                label=""
                                getRadio={this.setCheckState.bind(this)}
                                value={this.state.end_date_time_enable}
                                name="end_date_time_enable"
                              />
                            </td>
                            <td style={{width:"10rem"}}>終了時刻</td>
                            <td>{this.state.end_date_time != null ? (formatDateSlash(this.state.end_date_time) + ' ' + formatTimeIE(this.state.end_date_time)) : ""}</td>
                            <td style={{width:"5rem"}}> </td>
                          </tr>
                          <tr>
                            <td className={'td-check'} style={{width:"3rem"}}>
                              <Checkbox
                                label=""
                                getRadio={this.setCheckState.bind(this)}
                                value={this.state.comment_enable}
                                name="comment_enable"
                              />
                            </td>
                            <td style={{width:"10rem"}}>コメント</td>
                            <td className={'input-value ime-active'}>
                              <InputWithLabelBorder
                                label=""
                                type="text"
                                id={'comment_id'}
                                getInputText={this.setTextValue.bind(this, "comment")}
                                diseaseEditData = {this.state.comment}
                              />
                            </td>
                            <td style={{width:"5rem"}}> </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
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
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className="red-btn">確定</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
              title= {this.state.alert_title}
            />
          )}
        </Modal>
      </>
    );
  }
}

InputResult.propTypes = {
  closeModal: PropTypes.func,
};

export default InputResult;
