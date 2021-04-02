import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { WEEKDAYS } from "~/helpers/constants";
import {surface,secondary200,disable} from "~/components/_nano/colors";
import {formatJapanDateSlash, formatJapanSlashDateTime} from "~/helpers/date";
import {Bar} from "~/components/styles/harukaBackgroundCss";

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
      left: 80px;
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
      left: 200px;
    }    
    .text-left{
      .table-item{
        width: 9.375rem;
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
    padding: 4px;
  }
  .number {
    margin-right: 8px;
    width: 80px;
  }
  .text-right {
    width: calc(100% - 88px);
  }
  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 80px);
    word-wrap: break-word;
  }
  p {
    margin-bottom: 0;
  }
`;

class HospitalDoneDetail extends Component {
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
  
  getHistoryInfo = (nHistoryLength = -1, strStuffName = "", strDateTime = "", nDoctorConsented = -1) => {
    let strHistory = "";
    nHistoryLength++;
    if (nHistoryLength < 10) {
      nHistoryLength = `0${nHistoryLength}`;
    }
    if (nDoctorConsented == 4) {
      return "";
    }
    if (nDoctorConsented == 2) {
      strHistory = `${nHistoryLength}版 : ${formatJapanSlashDateTime(strDateTime)}`;
      return strHistory;
    } else{
      if (nDoctorConsented == 1) {
        strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        return strHistory;
      } else{
        strHistory = `${nHistoryLength}版 : ${formatJapanSlashDateTime(strDateTime)} 入力者 : ${strStuffName}`;
        if (nHistoryLength == 1) {
          strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        }
        return strHistory;
      }
    }
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
    this.props.closeModal('noRefresh');
  }

  render() {
    let { modal_data} = this.props;
    return  (
      <Modal show={true}  className="custom-modal-sm first-view-modal haruka-done-modal">
        <Modal.Header><Modal.Title>入院実施</Modal.Title></Modal.Header>
        <Modal.Body>
          <Wrapper>
            <Col id="soap_list_wrapper">
              <Bar>
                <div className="content">
                  <div className={'patient-info'}>{modal_data.patient_number} : {modal_data.patient_name}</div>
                  <div className="data-list">
                    <div className={`data-title ${this.getOrderTitleClassName(modal_data.done_order, modal_data.karte_status)}`}>
                      <div className={'data-item'}>
                        <div className="flex justify-content">
                          <div className="note">【入院・入院実施】{modal_data.done_order !== 1 && (<span>未実施</span>)}</div>
                          <div className="department text-right">{this.departmentOptions[modal_data.order_data.order_data.department_id]}</div>
                        </div>
                        <div className="date">
                          {modal_data.treatment_datetime !== undefined && modal_data.treatment_datetime !== "" ?
                            formatJapanSlashDateTime(modal_data.treatment_datetime):formatJapanDateSlash(modal_data.treatment_datetime)}
                        </div>
                      </div>
                      {modal_data.history != null && modal_data.history !== "" ? (
                        <div className="history-region text-right middle-title">
                          {this.getHistoryInfo(modal_data.history.split(",").length-1, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                        </div>
                      ):(
                        <div className="history-region text-right middle-title">
                          {this.getHistoryInfo(0, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                        </div>
                      )}
                      <div className="doctor-name text-right low-title">
                        {this.getDoctorName(modal_data.is_doctor_consented, modal_data.order_data.order_data.doctor_name)}
                      </div>
                    </div>
                    <MedicineListWrapper>
                      <div className="history-item">
                        <div className="phy-box w70p">
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">実施日時</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">
                                {formatJapanDateSlash(modal_data.order_data.order_data.treat_date.split(" ")[0])+" "+modal_data.order_data.order_data.treat_date.split(" ")[1]}
                              </div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">病棟</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{modal_data.order_data.order_data.ward_name}</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">病室</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{modal_data.order_data.order_data.room_name}</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">ベッド</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{modal_data.order_data.order_data.bed_name}</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">配膳開始</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">
                                {formatJapanDateSlash(modal_data.order_data.order_data.start_date) +" （"+modal_data.order_data.order_data.start_time_name+"）"}より開始
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
          <Button onClick={this.closeModal} className="cancel-btn">キャンセル</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

HospitalDoneDetail.contextType = Context;
HospitalDoneDetail.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.object,
};
export default HospitalDoneDetail;
