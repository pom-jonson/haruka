import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { WEEKDAYS } from "~/helpers/constants";
import {surface,secondary200,disable} from "~/components/_nano/colors";
import {formatDateTimeJapan, formatJapanSlashDateTime} from "~/helpers/date";
import {Bar} from "~/components/styles/harukaBackgroundCss";
import renderHTML from "react-render-html";

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  display: flex;
  text-align: center;
  .content{
    height: 100%;
  }
  .patient-info {
    text-align: right;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
`;

const Col = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  textarea {
    width: 100%;
    resize: none;
  }
  .data-item{
    border-bottom: 1px solid ${disable};
    background: linear-gradient(#d0cfcf, #e6e6e7);
  }
  .data-title{
    border: 1px solid rgb(213,213,213);
  }
  ._color_implemented{
    .history-region{
      background: #e5ffdb;
    }
    .doctor-name{
      background: #e5ffdb; 
    }
    .data-item{
      background: linear-gradient(#d0e6b5, #e6ffcb, #e6ffcb);
    }
  }
  ._color_not_implemented{
    .history-region{
      background: #ffe5ef;
    }
    .doctor-name{
      background: #ffe5ef; 
    }
    .data-item{
      background: linear-gradient(#eac1db, #ffd4f0, #ffd4f0);
    }
  }
  .department{
    font-size: 1rem;
  }
  .note{
    font-weight: bold;
  }
  .date{
    font-weight:bold;
    text-align: left;
    padding-left: 0.5rem;
  }
  .doctor-name{
    font-size: 12px;
    padding-right: 8px;
  }
  .history-region{
    border-bottom: 1px solid rgb(213,213,213);
    font-size: 12px;
    padding-right: 8px;
  }
  .order{
    display: block !important;
  }
  .data-list{
    background-color: ${surface};
    height: calc(100% - 2.5rem);
    margin-top: 0.5rem;
    .data-item{ 
      padding: 0.5rem 0.5rem 0 0.5rem;
    }
  }
  .low-title, .middle-title{
    background: rgb(230, 230, 231);
  }
  .flex {
    display:flex;
  }
`;

const MedicineListWrapper = styled.div`
  font-size:${props=>(props.font_props != undefined?0.75 * props.font_props + 'rem':'0.75rem')};
  height: calc(100% - 6.5rem);
  .history-item {
    height: 100%;
    overflow-y: auto;
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
      left: 5rem;
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
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 5rem;
    }    
    .text-left{
      .table-item{
        width: 4rem;
        float: left;
        text-align: right;
      }
    }
    .text-right{
      .table-item{
        text-align: left;
      }
    }
    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
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
    border-right: 1px solid ${disable};
    border-left: 1px solid ${disable};
    padding: 0.25rem;
  }
  .number {
    margin-right: 8px;
    width: 80px;
  }
  .text-right {
    width: calc(100% - 5rem);
  }
  .remarks-comment {
    margin-left: 0;
    width: 100%;
    word-wrap: break-word;
  }
  p {margin-bottom: 0;}
  .pass-item {
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

class NurseRecordDetail extends Component {
  constructor(props) {
    super(props);
    let department_data = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.departmentOptions = [];
    if(department_data.length > 0){
      department_data.map(department=>{
        this.departmentOptions[department['id']] = department['value'];
      })
    }
    this.state = {};
  }

  getWeekDay = dateStr => {
    let weekday = new Date(dateStr).getDay();
    return WEEKDAYS[weekday];
  }
  
  getOrderTitleClassName = (done_order, karte_status = null) => {
    if (done_order == 1) {
      return karte_status != 3 ? "_color_implemented" : "_color_implemented_hospital";
    } else {
      return karte_status != 3 ? "_color_not_implemented" : "_color_not_implemented_hospital";
    }
  }
  
  getHistoryInfo = (nHistoryLength = -1, strStuffName = "", strDateTime = "") => {
    let strHistory = "";
    nHistoryLength++;
    if (nHistoryLength < 10) {
      nHistoryLength = `0${nHistoryLength}`;
    }
    strHistory = `${nHistoryLength}版 : ${formatJapanSlashDateTime(strDateTime)} 入力者 : ${strStuffName}`;
    if (nHistoryLength == 1) {
      strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
    }
    return strHistory;
  }
  
  getDoctorName = (nDoctorConsented = -1, strDoctorName = "") => {
    if (nDoctorConsented == 4) {
      return `（過去データ取り込み）${strDoctorName}`;
    }
    if (nDoctorConsented == 2) {
      return strDoctorName;
    } else{
      if (nDoctorConsented == 1) {
        return `[承認済み] 依頼医: ${strDoctorName}`;
      } else{
        return  <div><span className='not-consented'>[未承認]</span> 依頼医: {strDoctorName}</div>;
      }
    }
  }
  
  closeModal=()=>{
    this.props.closeModal();
  }
  
  changeSpaceChar=(text)=>{
    if(text == null || text === ""){return '';}
    text = text.split('');
    let text_length = text.length;
    for(let index = 0; index < text_length; index++){
      if(text[index] === " "){
        if(index == 0){
          text[index] = "&nbsp;";
        } else {
          let change_flag = false;
          for(let prev_index = index - 1; prev_index >= 0; prev_index--){
            if(text[prev_index] === "<"){
              change_flag = true;
              break;
            }
            if(text[prev_index] === ">"){
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
  
  convertBR = (clipboard_data) => {
    clipboard_data = clipboard_data.split(" ").join("<span>&nbsp;</span>");
    let clipboard_data_arr = clipboard_data.split("\n");
    let result = "";
    if(clipboard_data_arr.length > 0) {
      clipboard_data_arr.map((ele, idx)=>{
        if (idx != clipboard_data_arr.length - 1) {
          result += ele + "<br>";
        } else {
          result += ele;
        }
      });
    }
    return result;
  }

  render() {
    let { modal_data} = this.props;
    return  (
      <Modal show={true}  className="custom-modal-sm first-view-modal haruka-done-modal">
        <Modal.Header><Modal.Title>看護記録</Modal.Title></Modal.Header>
        <Modal.Body>
          <Wrapper>
            <Col id="soap_list_wrapper">
              <Bar>
                <div className="content">
                  <div className={'patient-info'}>{this.props.patientInfo.receId} : {this.props.patientInfo.name}</div>
                  <div className="data-list">
                    <div className={'data-title _color_implemented'}>
                      <div className={'data-item'}>
                        <div className="flex justify-content">
                          <div className="note">【看護記録】</div>
                          <div className="department text-right"> </div>
                        </div>
                        <div className="date">{formatJapanSlashDateTime(modal_data.created_at)}</div>
                      </div>
                      {modal_data.history != null ? (
                        <div className="history-region text-right middle-title">
                          {this.getHistoryInfo(modal_data.history.split(",").length-1, modal_data.updated_name, modal_data.updated_at)}
                        </div>
                      ):(
                        <div className="history-region text-right middle-title">
                          {this.getHistoryInfo(0, modal_data.updated_name, modal_data.updated_at)}
                        </div>
                      )}
                    </div>
                    <MedicineListWrapper>
                      <div className="history-item">
                        <div className="phy-box w70p">
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">記録時間</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{formatDateTimeJapan(modal_data.record_date)}</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">問題</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">
                                {((this.props.nursing_problems.find((x) => x.id == modal_data.nursing_problem_id) !== undefined) ?
                                  this.props.nursing_problems.find((x) => x.id == modal_data.nursing_problem_id).value : "")}
                              </div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row" style={{padding:0}}>
                            <div className="text-left" style={{padding:"0.25rem"}}>
                              <div className="table-item">本文</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">
                                {modal_data.passing_of_time.length > 0 && (
                                  modal_data.passing_of_time.map((record_item, item_index)=>{
                                    return (
                                      <>
                                        <div className={'pass-item flex'} style={{borderTop:(item_index == 0 ? "none" : "")}}>
                                          <div className={'pass-label'}>
                                            {this.props.passing_of_time_type_label[record_item.passing_of_time_type_id] !== undefined ? this.props.passing_of_time_type_label[record_item.passing_of_time_type_id] : ""}
                                          </div>
                                          <div className={'pass-content'}>
                                            {renderHTML(this.changeSpaceChar(record_item.passing_of_time))}
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
              </Bar>
            </Col>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.closeModal} className="cancel-btn">閉じる</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

NurseRecordDetail.contextType = Context;
NurseRecordDetail.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.object,
  patientInfo: PropTypes.object,
  passing_of_time_type_label: PropTypes.object,
  nursing_problems: PropTypes.object,
};
export default NurseRecordDetail;
