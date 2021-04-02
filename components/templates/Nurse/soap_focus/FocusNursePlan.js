import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import {formatDateLine} from "~/helpers/date";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .div-title {
   height:2.3rem;
   line-height:2.3rem;
   width:5rem;
 }
 .div-value {
   height:2.3rem;
   line-height:2.3rem;
   padding:0 0.3rem;
 }
 .react-datepicker-wrapper {
   input {
    height: 2.3rem;
    width: 7rem;
    font-size:1rem;
   }
 }
 .select-classific {
    label {
      font-size: 1rem;
      line-height: 2.3rem;
    }
 }
 .input-area {
   .label-title {
    margin: 0;
    line-height: 2.3rem;
    font-size: 1rem;
   }
   input {
    height: 2.3rem;
    font-size: 1rem;
   }
   div {margin-top:0;}
 }
 .input-problem-number {
    input {width: 3rem;}
    .label-title {width: 6rem;}
 } 
 .input-problem-focus {
    input {width: 15rem;}
    .label-title {width: 11rem;}
 } 
 .input-article {
    input {width: 20rem;}
    .label-title {width: 5rem;}
 } 
 .btn-area {
   button {
     height:2.3rem;
     margin-left:1rem;
     font-size:1rem;
   }
 }
 .table-area {
   margin-top:0.5rem;
   width: 100%;
   .table-title {
    width: 2rem;
    text-align: center;
    padding-top: 4.5rem;
   }
   table {
     width:100%;
     margin:0;
     tbody{
       display:block;
       overflow-y: scroll;
       height: 40.5vh;
       width:100%;
       tr{cursor:pointer;}
       tr:nth-child(even) {background-color: #f2f2f2;}
       tr:hover{background-color:#e2e2e2;}
     }
     tr{
       display: table;
       width: 100%;
     }
     thead{
       display:table;
       width:100%;    
       border-bottom: 1px solid #dee2e6;    
       tr{width: calc(100% - 17px);}
     }
     th {
       position: sticky;
       text-align: center;
       padding: 0.3rem;
       white-space:nowrap;
       border:none;
       border-right:1px solid #dee2e6;
       vertical-align: middle;
     }
     td {
       padding: 0.25rem;
       word-break: break-all;
     }
     .selected {background-color:#6FF;}
     .selected:hover {background-color:#6FF;}
   }  
 }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class FocusNursePlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load_flag:false,
      start_date:"",
      end_date:"",
      problem_focus_classification:props.problem_focus_classification,
      problem_number:"",
      nursing_problem_focus:"",
      article:"",
      soap_focus_records:[],
      selected_index:-1,
      alert_messages:"",
    };
  }
  async componentDidMount() {
    await this.searchSoapFocusRecord();
    document.getElementById("cancel_btn").focus();
  }

  setPeriod=(key,value)=>{
    this.setState({[key]:value});
  };

  setComment=(key, e)=>{
    if(key == "problem_number"){
      if(e.target.value == "" || e.target.value >= 0){
        this.setState({[key]: e.target.value});
      } else {
        this.setState({[key]: this.state.problem_number});
      }
    } else {
      this.setState({[key]: e.target.value});
    }
  }

  setproblemFocusClassification = (e) => {
    this.setState({
      problem_focus_classification:e.target.value,
      load_flag:false,
    }, ()=>{
      this.searchSoapFocusRecord();
    });
  }

  searchSoapFocusRecord=async()=>{
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/nursing_service/search_plan/soap_focus_record";
    let post_data = {
      hos_number:this.props.hos_number,
      start_date:(this.state.start_date != null && this.state.start_date !== "") ? formatDateLine(this.state.start_date) : "",
      end_date:(this.state.end_date != null && this.state.end_date !== "") ? formatDateLine(this.state.end_date) : "",
      problem_focus_classification:this.state.problem_focus_classification,
      nursing_problem_focus:this.state.nursing_problem_focus,
      article:this.state.article,
      problem_number:this.state.problem_number,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          load_flag:true,
          soap_focus_records:res,
          selected_index:-1,
        });
      })
      .catch(() => {

      });
  };

  selectProblem=(index)=>{
    this.setState({selected_index:index});
  }

  confirmOk=()=>{
    if(this.state.selected_index == -1){
      this.setState({alert_messages: (this.state.problem_focus_classification == "#" ? "看護問題" : "フォーカス") + "を選択してください。"});
    } else {
      this.props.setRecordData(this.state.soap_focus_records[this.state.selected_index]);
    }
  }

  closeModal=()=>{
    this.setState({alert_messages:""});
  }

  clearCondition=()=>{
    this.setState({
      start_date:"",
      end_date:"",
      problem_number:"",
      nursing_problem_focus:"",
      article:"",
    }, ()=>{
      this.searchSoapFocusRecord();
    });
  }

  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm focus-nurse-plan first-view-modal"
        >
          <Modal.Header><Modal.Title>フォーカス＆看護計画</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={'flex select-period'}>
                  <div className={'div-title'}>記録日時</div>
                  <DatePicker
                    locale="ja"
                    selected={this.state.start_date}
                    onChange={this.setPeriod.bind(this,"start_date")}
                    dateFormat="yyyy/MM/dd"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dayClassName = {date => setDateColorClassName(date)}
                  />
                  <div className={'div-value'}>~</div>
                  <DatePicker
                    locale="ja"
                    selected={this.state.end_date}
                    onChange={this.setPeriod.bind(this,"end_date")}
                    dateFormat="yyyy/MM/dd"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    dayClassName = {date => setDateColorClassName(date)}
                  />
                </div>
                <div className={'select-classific flex'}>
                  <div className={'div-title'}>表示対象</div>
                  <Radiobox
                    label={'看護問題'}
                    value={"#"}
                    getUsage={this.setproblemFocusClassification.bind(this)}
                    checked={this.state.problem_focus_classification === "#"}
                    disabled={true}
                    name={`problem_focus_classification`}
                  />
                  <Radiobox
                    label={'フォーカス'}
                    value={"F"}
                    getUsage={this.setproblemFocusClassification.bind(this)}
                    checked={this.state.problem_focus_classification === "F"}
                    disabled={true}
                    name={`problem_focus_classification`}
                  />
                </div>
                <div className={'flex'}>
                  <div className={'input-area input-problem-number'}>
                    <InputWithLabel
                      type="text"
                      label={"問題番号　#"}
                      getInputText={this.setComment.bind(this, 'problem_number')}
                      diseaseEditData={this.state.problem_number}
                      isDisabled={this.state.problem_focus_classification === "F"}
                    />
                  </div>
                  <div className={'input-area input-problem-focus'} style={{marginLeft:"0.5rem"}}>
                    <InputWithLabel
                      type="text"
                      label="看護問題/フォーカス"
                      getInputText={this.setComment.bind(this, 'nursing_problem_focus')}
                      diseaseEditData={this.state.nursing_problem_focus}
                    />
                  </div>
                </div>
                <div className={'flex btn-area'} style={{marginTop:"0.5rem"}}>
                  <div className={'input-area input-article'}>
                    <InputWithLabel
                      type="text"
                      label="記事"
                      getInputText={this.setComment.bind(this, 'article')}
                      diseaseEditData={this.state.article}
                    />
                  </div>
                  <button onClick={this.searchSoapFocusRecord}>最新表示</button>
                  <button onClick={this.clearCondition}>条件クリア</button>
                </div>
                <div className={'table-area flex'}>
                  <table className="table-scroll table table-bordered table-hover" id={'table_area'}>
                    <thead>
                      <tr>
                        <th style={{width:"5rem"}}>問題番号</th>
                        <th style={{width:"15rem"}}>看護問題/フォーカス</th>
                        <th>記事</th>
                        <th style={{width:"7rem"}}>最終記録日</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.load_flag ? (
                        <>
                        {this.state.soap_focus_records.length > 0 && (
                          this.state.soap_focus_records.map((item, index)=>{
                            return (
                              <>
                                <tr
                                className={this.state.selected_index == index ? 'selected' : ""}
                                onClick={this.selectProblem.bind(this, index)}
                                >
                                  <td style={{width:"5rem"}}>{item.problem_number != null ? ("#"+item.problem_number) : ""}</td>
                                  <td style={{width:"15rem"}}>{item.nursing_problem_focus}</td>
                                  <td>{item.article}</td>
                                  <td style={{width:"7rem"}}>{item.updated_at}</td>
                                </tr>
                              </>
                            )
                          })
                        )}
                        </>
                      ):(
                        <tr>
                          <td colSpan={'3'}>
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" id={'cancel_btn'} onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={"red-btn"} onClick={this.confirmOk}>{"確定"}</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>
      </>
    );
  }
}

FocusNursePlan.propTypes = {
  closeModal: PropTypes.func,
  setRecordData: PropTypes.func,
  problem_focus_classification: PropTypes.string,
  hos_number: PropTypes.number,
};

export default FocusNursePlan;
