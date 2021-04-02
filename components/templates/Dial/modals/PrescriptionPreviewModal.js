import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "../../../atoms/Button";
import ReactToPrint from "react-to-print";
import * as methods from "../DialMethods";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import axios from "axios";
import {formatJapan, getThirdDayByJapanFormat} from "../../../../helpers/date";
import * as apiClient from "~/api/apiClient";

const Header = styled.div`
    font-size: 20px;
    .border{border:solid 1px black !important;}
.border-left{border-left: solid 1px black !important;}
.border-right {border-right: solid 1px black !important;}
.border-top {border-top: solid 1px black !important;}
.border-bottom {border-bottom: solid 1px black !important;}
.flex{
    display: flex;
}
.header-title{
    text-align: center;
   .title{
    font-size: 40px;
   }
   .month{
    float: right;
    margin-top: 30px;
   }
}
.w5{width:5%;}
.w10{width:10%;}
.w15{width:15%;}
.w20{width:20%;}
.w25{width:25%;}
.w30{width:30%;}
.padding{    align-items: center;
    display: flex;}
.circle{
    border: solid 1px black;
    border-radius: 50%;
    width: 30px;
    text-align: center;
    margin: auto;
    display: block;
}


    .border-1-b {
        border: 1px solid black;
    }
    .w100p {
        width: 100%;
    }
    .w50p {
        width: 50%;
    }
    .f-s-b {
        font-weight: bold;
    }
    .border-r-1-b {
        border-right: 1px solid black;
    }
    .border-l-1-b {
        border-left: 1px solid black;
    }
    .border-b-1-b {
        border-bottom: 1px solid black;
    }
    .border-t-1-b {
        border-top: 1px solid black;
    }
    .eight{
        width: calc((100% - 220px) / 8);
        display: flex;
        border-top: 1px solid black;
        border-right: 1px solid black;
        border-bottom: 1px solid black;
        text-align: center;
        align-items: center;
        padding-left:10px;
    }
    .width-padding {
    width: 220px; padding-right: 5px; padding-left: 5px;
    }
 `;
const Body = styled.div`
    font-size: 20px;
    display: flex;
    min-height: 200px;
    border: solid 1px black;
    text-align: right;
 `;
const Footer = styled.div`
    font-size: 20px;
    border: solid 1px black;
 `;
const List = styled.div`
    display: block;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 14px;
    width: 100%;
    margin-right: 2%;
    height: calc(100% - 40px);
    overflow-y: auto;
    float: left;
    .w2{width:2.5%;}
    .w5{width:5%;}
.w10{width:10%;}
.w15{width:15%;}
.w20{width:20%;}
.w25{width:25%;}
.w30{width:30%;}
    .border{border:solid 1px black !important;}
.border-left{border-left: solid 1px black !important;}
.border-right {border-right: solid 1px black !important;}
.border-top {border-top: solid 1px black !important;}
.border-bottom {border-bottom: solid 1px black !important;}
.flex{
    display: flex;
}
    .border-1-b {
        border: 1px solid black;
    }
    .w100p {
        width: 100%;
    }
    .w50p {
        width: 50%;
    }
    .f-s-b {
        font-weight: bold;
    }
    .border-r-1-b {
        border-right: 1px solid black;
    }
    .border-l-1-b {
        border-left: 1px solid black;
    }
    .border-b-1-b {
        border-bottom: 1px solid black;
    }
    .border-t-1-b {
        border-top: 1px solid black;
    }
    label {
        margin: 0;
    }
    table {
    border-color: black important;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        td {
            padding: 0.25rem;
            text-align: center;
            input {
                margin: 0;
            }
        }
        th {
            text-align: center;
            padding: 0.3rem;
        }
        .table-check {
            width: 60px;
        }
        .table-content {
            width: 65%;
        }
    }
    .tl {
        text-align: left;
    }
    .tr {
        text-align: right;
    }
    .bracket{font-size:45px;}
 `;

class ComponentToPrint extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    // let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    // let useday = this.getNextDayByJapanFormat(schedule_date);
    this.state={
      // useday,
    }
  }
  getDiease = async () =>{
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    let path = "/app/api/v2/dial/medicine_information/getDiseaseHistory";
    let post_data = {
      patient_id: patientInfo.system_patient_id
    };
    await axios.post(path, {params: post_data})
      .then((res) => {
        this.setState({
          disease: res.data,
        });
        return res.data;
      })
      .catch(() => {
        return false;
      });
  };
  searchFacility = async() => {
    let path = "/app/api/v2/dial/master/facility_search";
    let post_data = {
    };
    let { data } = await axios.post(path, {params: post_data});
    if (data !=null && data != ''){
      this.setState({list_facility: data[0]});
    } else {
      this.setState({list_facility: null});
    }
  };
  
  async getInsuranceInfo(){
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    let path = "/app/api/v2/dial/patient/getInsuranceInfo";
    const post_data = {
      system_patient_id:patientInfo.system_patient_id
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res){
          this.setState({
            table_number: (res.number != undefined && res.number != null) ? res.number : "",
            insurer_number: (res.insurer_number != undefined && res.insurer_number != null) ? res.insurer_number : "",
            symbol: (res.symbol != undefined && res.symbol != null) ? res.symbol : "",
            bangou: (res.bangou != undefined && res.bangou != null) ? res.bangou : "",
            publicly_funded_treatment_recipient_number_1: (res.publicly_funded_treatment_recipient_number_1 != undefined && res.publicly_funded_treatment_recipient_number_1 != null) ? res.publicly_funded_treatment_recipient_number_1 : "",
            publicly_funded_treatment_recipient_number_2: (res.publicly_funded_treatment_recipient_number_2 != undefined && res.publicly_funded_treatment_recipient_number_2 != null) ? res.publicly_funded_treatment_recipient_number_2 : "",
            public_expenditure_recipient_number_1: (res.public_expenditure_recipient_number_1 != undefined && res.public_expenditure_recipient_number_1 != null) ? res.public_expenditure_recipient_number_1 : "",
            public_expenditure_recipient_number_2: (res.public_expenditure_recipient_number_2 != undefined && res.public_expenditure_recipient_number_2 != null) ? res.public_expenditure_recipient_number_2 : "",
            insurance_category_code: (res.insurance_category_code != undefined && res.insurance_category_code != null) ? res.insurance_category_code : "",
            issue_date: (res.insurer_number != null && res.insurer_number != undefined) ? new Date(res.issue_date) : "",
            comment:  (res.comment != undefined && res.comment != null) ? res.comment : "",
            patient_burden_ratio:  (res.patient_burden_ratio != undefined && res.patient_burden_ratio != null) ? res.patient_burden_ratio : "",
            insurance_card_category_code:  (res.insurance_card_category_code != undefined && res.insurance_card_category_code != null) ? res.insurance_card_category_code : "",
          });
        }
      })
      .catch(() => {
      
      });
  }
  
  UNSAFE_componentWillMount() {
    this.getInsuranceInfo();
    this.searchFacility();
  }
  
  render() {
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    // let useday = this.state.useday;
    let medicines=this.props.print_data;
    let data_json=medicines.data_json!=undefined && medicines.data_json!=null?medicines.data_json:null;
    let facility_info = this.state.list_facility;
    return (
      <List>
        <Header>
          <div>
            <div className="col-lg-12 text-center mt-3" style={{padding:0}}>
              <h1 className="section-heading text-uppercase">
                <span className="font-weight-bold">処 方 せ ん</span></h1>
              <div className={`text-left`}>10101</div>
              <div className={`text-center`}>（この処方せんは、どの保険薬局でも有効です。）</div>
              <div className="flex">
                <div className="w50p">
                  <div className="flex w100p">
                    <div className="f-s-b  border-1-b width-padding">公費負担者番号
                    </div>
                    <div className={`eight`}>{this.state.publicly_funded_treatment_recipient_number_1 != null && this.state.publicly_funded_treatment_recipient_number_1.charAt(0)}</div>
                    <div className={`eight`}>{this.state.publicly_funded_treatment_recipient_number_1 != null && this.state.publicly_funded_treatment_recipient_number_1.charAt(1)}</div>
                    <div className={`eight`}>{this.state.publicly_funded_treatment_recipient_number_1 != null && this.state.publicly_funded_treatment_recipient_number_1.charAt(2)}</div>
                    <div className={`eight`}>{this.state.publicly_funded_treatment_recipient_number_1 != null && this.state.publicly_funded_treatment_recipient_number_1.charAt(3)}</div>
                    <div className={`eight`}>{this.state.publicly_funded_treatment_recipient_number_1 != null && this.state.publicly_funded_treatment_recipient_number_1.charAt(4)}</div>
                    <div className={`eight`}>{this.state.publicly_funded_treatment_recipient_number_1 != null && this.state.publicly_funded_treatment_recipient_number_1.charAt(5)}</div>
                    <div className={`eight`}>{this.state.publicly_funded_treatment_recipient_number_1 != null && this.state.publicly_funded_treatment_recipient_number_1.charAt(6)}</div>
                    <div className={`eight`}>{this.state.publicly_funded_treatment_recipient_number_1 != null && this.state.publicly_funded_treatment_recipient_number_1.charAt(7)}</div>
                  </div>
                  <div className="flex w100p">
                    <div className="f-s-b border-r-1-b border-l-1-b border-b-1-b width-padding">公費負担医療<br />の受給者番号
                    </div>
                    <div className={`eight`}>{this.state.public_expenditure_recipient_number_1 != null && this.state.public_expenditure_recipient_number_1.charAt(0)}</div>
                    <div className={`eight`}>{this.state.public_expenditure_recipient_number_1 != null && this.state.public_expenditure_recipient_number_1.charAt(1)}</div>
                    <div className={`eight`}>{this.state.public_expenditure_recipient_number_1 != null && this.state.public_expenditure_recipient_number_1.charAt(2)}</div>
                    <div className={`eight`}>{this.state.public_expenditure_recipient_number_1 != null && this.state.public_expenditure_recipient_number_1.charAt(3)}</div>
                    <div className={`eight`}>{this.state.public_expenditure_recipient_number_1 != null && this.state.public_expenditure_recipient_number_1.charAt(4)}</div>
                    <div className={`eight`}>{this.state.public_expenditure_recipient_number_1 != null && this.state.public_expenditure_recipient_number_1.charAt(5)}</div>
                    <div className={`eight`}>{this.state.public_expenditure_recipient_number_1 != null && this.state.public_expenditure_recipient_number_1.charAt(6)}</div>
                    <div className={`eight`}>{this.state.public_expenditure_recipient_number_1 != null && this.state.public_expenditure_recipient_number_1.charAt(7)}</div>
                  </div>
                  <div className="w100p">
                    <div className="border-1-b flex">
                      <div className="w10 flex" style={{alignItems:"center"}}>患者</div>
                      <div className={`w100p`}>
                        <div className="flex">
                          <div className="border-l-1-b border-b-1-b w20">氏名
                          </div>
                          <div className="border-l-1-b border-b-1-b w100p">
                            <div className="flex" style={{lineHeight:"60px"}}>
                              <div>{patientInfo.kana_name}</div>
                              <div></div>
                            </div>
                            <div className="flex">
                              <div >{patientInfo.patient_name != null && patientInfo.patient_name}</div>
                              <div >殿</div>
                            </div>
                          
                          </div>
                        </div>
                        <div className="flex border-b-1-b ">
                          <div className="border-l-1-b border-b-1-b w20">生年月日
                          </div>
                          <div className="border-l-1-b border-b-1-b w50">{patientInfo.birthday != null && formatJapan(patientInfo.birthday)}生
                          </div>
                          <div className="border-l-1-b border-b-1-b w20">{patientInfo.gender ==1? "男":"女"}</div>
                        </div>
                        <div className="flex" style={{lineHeight:"55px"}}>
                          <div className="border-l-1-b w20" style={{lineHeight:'60px'}}>区分</div>
                          <div className="border-l-1-b">被扶養者</div>
                          <div className="border-l-1-b" >{this.state.insurance_card_category_code != null&& this.state.insurance_card_category_code}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex border-1-b">
                      <div className="border-right w30" style={{lineHeight:'69px'}}>交付年月日</div>
                      <div className="border-l-1-b w100p" style={{fontSize:"40px"}}>{this.state.issue_date != null && this.state.issue_date != "" && formatJapan(this.state.issue_date)}</div>
                    </div>
                  </div>
                
                </div>
                <div  className={`w50p`}>
                  <div className="w100p" style={{marginLeft:"10px"}}>
                    <div className="flex w100p">
                      <div className="f-s-b  border-1-b width-padding">保 険 者 番 号
                      </div>
                      <div  className={`eight`}>{this.state.insurer_number != null && this.state.insurer_number.charAt(0)}</div>
                      <div  className={`eight`}>{this.state.insurer_number != null && this.state.insurer_number.charAt(1)}</div>
                      <div  className={`eight`}>{this.state.insurer_number != null && this.state.insurer_number.charAt(2)}</div>
                      <div  className={`eight`}>{this.state.insurer_number != null && this.state.insurer_number.charAt(3)}</div>
                      <div  className={`eight`}>{this.state.insurer_number != null && this.state.insurer_number.charAt(4)}</div>
                      <div  className={`eight`}>{this.state.insurer_number != null && this.state.insurer_number.charAt(5)}</div>
                      <div  className={`eight`}>{this.state.insurer_number != null && this.state.insurer_number.charAt(6)}</div>
                      <div  className={`eight`}>{this.state.insurer_number != null && this.state.insurer_number.charAt(7)}</div>
                    </div>
                    <div className="flex w100p">
                      <div className="border-r-1-b border-l-1-b border-b-1-b width-padding" style={{fontSize:"15px"}}>被保険者証・被保険者手帳の<br />記号・番号
                      </div>
                      <div  className={`eight`}>{this.state.symbol != null && this.state.symbol.charAt(0)}</div>
                      <div  className={`eight`}>{this.state.symbol != null && this.state.symbol.charAt(1)}</div>
                      <div  className={`eight`}>{this.state.symbol != null && this.state.symbol.charAt(2)}</div>
                      <div  className={`eight`}>{this.state.symbol != null && this.state.symbol.charAt(3)}</div>
                      <div  className={`eight`}>{this.state.symbol != null && this.state.symbol.charAt(4)}</div>
                      <div  className={`eight`}>{this.state.symbol != null && this.state.symbol.charAt(5)}</div>
                      <div  className={`eight`}>{this.state.symbol != null && this.state.symbol.charAt(6)}</div>
                      <div  className={`eight`}>{this.state.symbol != null && this.state.symbol.charAt(7)}</div>
                    </div>
                  </div>
                  <div className="w100p">
                    <div className="flex">
                      <div style={{fontSize:"15px"}} className={`w30`}>
                        保険医療機関の<br />
                        所在地及び名称
                      </div>
                      <div style={{fontSize:"15px"}}>
                        {facility_info!=null && facility_info.address_1}{facility_info!=null && facility_info.address_2}<br /></div>
                    </div>
                    <div>
                      <div className={`text-center`} style={{marginTop:"-11px"}}>
                        {facility_info!=null && facility_info.medical_institution_name}<br />
                        {facility_info!=null && facility_info.medical_institution_name_kana}<br />
                      </div>
                      <div className={`flex`}>
                        <div className={`text-right w30`} style={{fontSize:"15px"}}>電話番号</div>
                        <div className={`ml-2`}>{facility_info!=null && facility_info.phone_number}</div>
                      </div>
                      <div className={`flex`}>
                        <div className={`text-right w30`} style={{fontSize:"15px"}}>保険医師名</div>
                        <div className={`ml-2`}>{facility_info!=null && facility_info.doctor_name}</div>
                      </div>
                      <div className="flex w100p border-1-b">
                        <div className="border-r-1-b border-l-1-b border-b-1-b width-padding" style={{fontSize:"15px"}}>都道府県
                          <br />番号
                        </div>
                        <div  className={`border-r1-b border-l-1-b border-b-1-b w5`}>{facility_info != null && facility_info.prefectures_number.charAt(0)}</div>
                        <div  className={`border-r1-b border-l-1-b border-b-1-b w5`}>{facility_info != null && facility_info.prefectures_number.charAt(1)}</div>
                        <div  className={`border-r1-b border-l-1-b border-b-1-b w25`} style={{fontSize:"15px"}}>点数表<br /> 番号</div>
                        <div  className={`border-r1-b border-l-1-b border-b-1-b w5`}>{facility_info != null && facility_info.point_table_number}</div>
                        <div  className={`border-r1-b border-l-1-b border-b-1-b w25`} style={{fontSize:"15px"}}>医療機関 <br /> ｺｰﾄ</div>
                        <div  className={`border-r1-b border-l-1-b border-b-1-b w5`}>{facility_info != null && facility_info.medical_institution_code.charAt(0)}</div>
                        <div  className={`border-r1-b border-l-1-b border-b-1-b w5`}>{facility_info != null && facility_info.medical_institution_code.charAt(1)}</div>
                        <div  className={`border-r1-b border-l-1-b border-b-1-b w5`}>{facility_info != null && facility_info.medical_institution_code.charAt(2)}</div>
                        <div  className={`border-r1-b border-l-1-b border-b-1-b w5`}>{facility_info != null && facility_info.medical_institution_code.charAt(3)}</div>
                        <div  className={`border-r1-b border-l-1-b border-b-1-b w5`}>{facility_info != null && facility_info.medical_institution_code.charAt(4)}</div>
                        <div  className={`border-r1-b border-l-1-b border-b-1-b w5`}>{facility_info != null && facility_info.medical_institution_code.charAt(5)}</div>
                        <div  className={`border-r1-b border-l-1-b border-b-1-b w5`}>{facility_info != null && facility_info.medical_institution_code.charAt(6)}</div>
                      </div>
                      <div className="flex w100p" style={{fontSize: "15px"}}>
                        <div className="border-r-1-b border-l-1-b border-b-1-b width-padding" style={{fontSize:"15px"}}>処方せんの
                          <br />使用期間
                        </div>
                        <div className={`flex border-1-b w100p`}>
                          {/*<div className={`w50p text-center`} style={{fontSize:"30px"}}>{useday!=undefined&& useday!=null && useday}</div>*/}
                          <div className={`w50p text-center`} style={{fontSize:"30px"}}>{schedule_date != undefined && schedule_date !=null ? formatJapan(getThirdDayByJapanFormat(new Date(schedule_date))): ""}</div>
                          <div className={`flex`}>
                            <div className={`bracket`}>〔</div>
                            <div className={`w100p`}>
                              特に記載のある場合を除き、<br />
                              交付の日を含めて４日以内に<br />
                              保険薬局に提出すること。
                            </div>
                            <div className={`bracket`}>〕</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  
                  </div>
                
                </div>
              </div>
            </div>
          </div>
        </Header>
        <Body>
        <div className={`w5 border-right flex text-center`} style={{alignItems:"center"}}>処方</div>
        <div className={`w10 border-right`}>変更不可</div>
        <div className={`content w100`}>
          {data_json!=null&&data_json.map(item=>{
            return (
              <>
                {item.medicines!=null && item.medicines.map(med_item=>{
                  return (
                    <><div>
                      {med_item.item_name}
                    </div></>
                  )
                })}
                <div className={`flex`}>
                  <div>【{item.prescription_category}   {item.usage_name}】</div>
                  <div className={`text-right`}>({item.days !== undefined && item.days !== null && item.disable_days_dosing == 0? "("+item.days+(item.prescription_category == "頓服"? "回分)" : "日分)") : ""})</div>
                </div>
              </>
            )
          })}
        </div>
        </Body>
        
        <Footer>
          <div className={`flex`}>
            <div className={`w5 border-right` }>
              備考
            </div>
            <div>
              <div className={`flex w100p`}>
                <div className={`border-bottom border-right`}>
                  <div> 「変更不可」欄に「∨」又は「×」を記載した</div>
                  <div>場合は、署名又は記名・押印すること。</div>
                  <div>保険医署名</div>
                </div>
                <div>負担割合 </div>
                <div>0 </div>
                <div>割</div>
                <div>高一 （長）</div>
              </div>
              <div>保険薬局が調剤時に残薬を確認した場合の対応（特に指示がある場合は「レ」又は「×」を記載すること。）
                <br />
                □保険医療機関へ疑義照会した上で調剤 □保険医療機関へ情報提供</div>
            </div>
          </div>
          <div className={`flex`}>
            <div className={`border-right border-top w20`}>調剤済年月日</div>
            <div className={`border-right border-top text-center w30`}> 年 月 日</div>
            <div className={`border-right border-top w15`}>公費負担者番号</div>
            
            <div  className={`border-right border-top w5`}></div>
            <div  className={`border-right border-top w5`}></div>
            <div  className={`border-right border-top w5`}></div>
            <div  className={`border-right border-top w5`}></div>
            <div  className={`border-right border-top w5`}></div>
            <div  className={`border-right border-top w5`}></div>
            <div  className={`border-right border-top w5`}></div>
            <div  className={`border-right border-top w5`}></div>
          </div>
          <div className={`flex`}>
            <div className={`border-right border-top w20`} style={{fontSize:"15px"}}>保険薬局の所在
              地 及 び 名 称
              保険薬剤師氏名</div>
            <div className={`border-right border-top text-right w30`} >㊞</div>
            <div className={`border-right border-top w15`}>公費負担医療
              の受給者番号</div>
            
            <div  className={`border-right border-top w5`}></div>
            <div  className={`border-right border-top w5`}></div>
            <div  className={`border-right border-top w5`}></div>
            <div  className={`border-right border-top w5`}></div>
            <div  className={`border-right border-top w5`}></div>
            <div  className={`border-right border-top w5`}></div>
            <div  className={`border-right border-top w5`}></div>
            <div  className={`border-top w5`}></div>
          </div>
        </Footer>
        <div>
        
        </div>
      </List>
    );
  }
}

class PrescriptionPreviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
    
    }
  }
  closeModal = () =>{
    this.props.closeModal();
  };
  render() {
    return  (
      <Modal show={true} onHide={this.closeModal.bind(this)} id="add_contact_dlg"  className="master-modal printer-modal">
        <Modal.Body>
          <Button onClick={this.closeModal.bind(this)} color="primary" style={{marginRight:'20px'}}>
            キャンセル
          </Button>
          <ReactToPrint
            trigger={() => (
              <Button size="small" color="primary">
                印刷
              </Button>
            )}
            content={() => this.componentRef}
          />
          <ComponentToPrint
            ref={el => (this.componentRef = el)}
            print_data={this.props.print_data}
          />
        </Modal.Body>
      </Modal>
    );
  }
}

PrescriptionPreviewModal.contextType = Context;

PrescriptionPreviewModal.propTypes = {
  print_data: PropTypes.object,
  closeModal: PropTypes.func,
};
ComponentToPrint.propTypes = {
  print_data: PropTypes.object,
  closeModal: PropTypes.func,
};

export default PrescriptionPreviewModal;
