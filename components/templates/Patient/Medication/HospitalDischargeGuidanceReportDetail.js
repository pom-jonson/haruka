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

class HospitalDischargeGuidanceReportDetail extends Component {
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
        <Modal.Header><Modal.Title>退院時指導レポート</Modal.Title></Modal.Header>
        <Modal.Body>
          <Wrapper>
            <Col id="soap_list_wrapper">
              <Bar>
                <div className="content">
                  <div className={'patient-info'}>{modal_data.patient_number} : {modal_data.patient_name}</div>
                  <div className="data-list">
                    <div className={`data-title ${this.getOrderTitleClassName(1, modal_data.karte_status)}`}>
                      <div className={'data-item'}>
                        <div className="flex justify-content">
                          <div className="note">【入院・退院時指導レポート】</div>
                          <div className="department text-right">{this.departmentOptions[modal_data.order_data.order_data.department_id]}</div>
                        </div>
                        <div className="date">
                          {modal_data.treatment_datetime !== undefined && modal_data.treatment_datetime !== "" ?
                            formatJapanSlashDateTime(modal_data.treatment_datetime):formatJapanDateSlash(modal_data.treatment_date)}
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
                              <div className="table-item">日時</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">
                                {formatJapanDateSlash(modal_data.order_data.order_data.start_date)+" "+modal_data.order_data.order_data.start_time+'~'+modal_data.order_data.order_data.end_time}
                              </div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">記載者</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{modal_data.order_data.order_data.write_staff_name}</div>
                            </div>
                          </div>
                          {modal_data.order_data.order_data.hospital_doctor_name != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">【院内】医師</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.hospital_doctor_name}</div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.nurse_name != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">【院内】看護師</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.nurse_name}</div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.discharge_support_nurse_name != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">【院内】退院支援看護師</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.discharge_support_nurse_name}</div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.msw_text != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">【院内】ＭＳＷ</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.msw_text}</div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.hospital_other_text != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">【院内】その他</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.hospital_other_text}</div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.instructed_nurse_name != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">【院外】在宅医or指示を受けた看護師</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.instructed_nurse_name}</div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.visit_nurse_name != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">【院外】訪問看護師</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.visit_nurse_name}</div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.care_manager_name != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">【院外】ケアマネージャー</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.care_manager_name}</div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.outside_hospital_other_text != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">【院外】その他</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.outside_hospital_other_text}</div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.recheck != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">病状・病期の説明と患者・家族の理解の再確認</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.recheck}</div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.check_inject_names != undefined && modal_data.order_data.order_data.check_inject_names.length > 0 && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">【薬・注射】</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">
                                  {modal_data.order_data.order_data.check_inject_names.map((name, index)=>{
                                    return (
                                      <>
                                        <span>{index == 0 ? name : ("、"+name)}</span>
                                      </>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.check_equipment_names != undefined && modal_data.order_data.order_data.check_equipment_names.length > 0 && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">【医療機器】</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">
                                  {modal_data.order_data.order_data.check_equipment_names.map((name, index)=>{
                                    return (
                                      <>
                                        <span>{index == 0 ? name : ("、"+name)}</span>
                                      </>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                          {((modal_data.order_data.order_data.check_treat_names != undefined && modal_data.order_data.order_data.check_treat_names.length > 0)
                            || modal_data.order_data.order_data.treat_check_other_text != undefined) && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">【医療処置】</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">
                                  {modal_data.order_data.order_data.check_treat_names != undefined && modal_data.order_data.order_data.check_treat_names.length > 0 && (
                                    modal_data.order_data.order_data.check_treat_names.map((name, index)=> {
                                      return (
                                        <>
                                          <span>{index == 0 ? name : ("、"+name)}</span>
                                        </>
                                      )
                                    })
                                  )}
                                  {modal_data.order_data.order_data.treat_check_other_text != undefined && (
                                    <span>{(modal_data.order_data.order_data.check_treat_names != undefined && modal_data.order_data.order_data.check_treat_names.length > 0) ? "、" : ""}{modal_data.order_data.order_data.treat_check_other_text}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.medicine_detail != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">詳細</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.medicine_detail}</div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.need_medicine != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">必要な医薬物品（製品名）・調達先</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.need_medicine}</div>
                              </div>
                            </div>
                          )}
                          {((modal_data.order_data.order_data.check_body_assistance_names != undefined && modal_data.order_data.order_data.check_body_assistance_names.length > 0)
                            || modal_data.order_data.order_data.body_assistance_check_other_text != undefined) && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">身体援助</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">
                                  {modal_data.order_data.order_data.check_body_assistance_names != undefined && modal_data.order_data.order_data.check_body_assistance_names.length > 0 && (
                                    modal_data.order_data.order_data.check_body_assistance_names.map((name, index)=> {
                                      return (
                                        <>
                                          <span>{index == 0 ? name : ("、"+name)}</span>
                                        </>
                                      )
                                    })
                                  )}
                                  {modal_data.order_data.order_data.body_assistance_check_other_text != undefined && (
                                    <span>{(modal_data.order_data.order_data.check_body_assistance_names != undefined && modal_data.order_data.order_data.check_body_assistance_names.length > 0) ? "、" : ""}{modal_data.order_data.order_data.body_assistance_check_other_text}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.future_treatment_issue != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">今後の治療課題・生活課題</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.future_treatment_issue}</div>
                              </div>
                            </div>
                          )}
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">【退院後(一ヶ月以内）病院看護師の訪問指導】</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{modal_data.order_data.order_data.nurse_visit_guidance == 1 ? "有" : "無"}</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">【退院直後・特別指示書での訪問看護の必要性】</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{modal_data.order_data.order_data.visit_nurse_need == 1 ? "有" : "無"}</div>
                            </div>
                          </div>
                          {modal_data.order_data.order_data.discharge_date != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">退院予定日</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">
                                  {formatJapanDateSlash(modal_data.order_data.order_data.discharge_date)}
                                </div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.move_tool != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">移送手段</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.move_tool}</div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.nurse_taxi_name != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">介護タクシー</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.nurse_taxi_name}</div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.discharge_after_doctor_name != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">退院後の主治医</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.discharge_after_doctor_name}</div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.home_doctor_name != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">在宅医</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.home_doctor_name}</div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.visit_nurse_period_first != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">【訪問看護指示書】</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{modal_data.order_data.order_data.visit_nurse_period_first+"~"+modal_data.order_data.order_data.visit_nurse_period_second}ヶ月
                                </div>
                              </div>
                            </div>
                          )}
                          {(modal_data.order_data.order_data.general_hospital_check == 1 || modal_data.order_data.order_data.body_assistance_check_other_text != undefined) && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">【緊急時対応】</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">
                                  {modal_data.order_data.order_data.general_hospital_check == 1 ? "県立総合病院" : ""}
                                  {modal_data.order_data.order_data.body_assistance_check_other_text != undefined ?
                                    (modal_data.order_data.order_data.general_hospital_check == 1 ? "、"+modal_data.order_data.order_data.body_assistance_check_other_text
                                      : modal_data.order_data.order_data.body_assistance_check_other_text)
                                    : ""}
                                </div>
                              </div>
                            </div>
                          )}
                          {modal_data.order_data.order_data.send_information == 1 && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">病院⇔ステーション</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">１週間～１ヶ月の間に、別紙にて情報の送信をお願いいたします</div>
                              </div>
                            </div>
                          )}
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

HospitalDischargeGuidanceReportDetail.contextType = Context;
HospitalDischargeGuidanceReportDetail.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.object,
};
export default HospitalDischargeGuidanceReportDetail;
