import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import Button from "~/components/atoms/Button";
import {formatDateSlash, formatJapan} from "~/helpers/date";
import * as sessApi from "~/helpers/cacheSession-utils";
registerLocale("ja", ja);
import Spinner from "react-bootstrap/Spinner";
import * as apiClient from "~/api/apiClient";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import RegisterComment from "~/components/templates/Nurse/NurseSummaryList/RegisterComment";
import {displayLineBreak} from "~/helpers/dialConstants";
import Context from "~/helpers/configureStore";

const Wrapper = styled.div`
 width: 100%;
 height: 100%;
 font-size: 1rem;
 .flex{display: flex;}
 .label-title{
  margin:0;
  width:4rem;
  margin-right:0.5rem;
  text-align:right;
  line-height:2rem;
  height:2rem;
  font-size:1rem;
  margin-top:0.1rem;
}
 .blog-title{
   font-size:1.2rem;
 }
 .blog-content{
   padding-left:3rem;
 }
 .blog{
   margin-bottom:2rem;
 }
 .fr{
   position:absolute;
   right:4rem;
 }
 button{
   margin-right:0.8rem;
 }
 .left-area{
   width:35%;
 }
 .right-area{
   width:65%;
   border:1px solid #aaa;
   height:100%;
   padding:1rem;
   overflow-y:auto;
   .summary-data {
    .div-title {
      padding:0.2rem;
      width:8rem;
    }
    .div-value {
      padding:0.2rem;
      width: calc(100% - 10rem);
    }
   }
 }
 .title-label{
   width: 8rem;
 }
 .comment-area {
  width:calc(100% - 9rem);
  padding:0.3rem;
  border:1px solid #aaa;
  overflow-y:auto;
  max-height: 15rem;
 }
`;

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class NurseSummaryAgreeModal extends Component {
  constructor(props) {
    super(props);
    let summary_data = props.summary_info.summary_data;
    this.state = {
      summary_data,
      create_comment:(summary_data != null && summary_data.create_comment != null) ? summary_data.create_comment : "",
      approval_comment:(summary_data != null && summary_data.approval_comment != null) ? summary_data.approval_comment : "",
      is_loaded:false,
      isOpenRegisterComment:false,
      alert_messages:"",
      alert_title:"",
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
    };
    this.help_data = "";
    this.food_type_name = "";
    this.staff_list = [];
    let staff_list = sessApi.getStaffList();
    if(staff_list != undefined && staff_list != null && Object.keys(staff_list).length > 0){
      Object.keys(staff_list).map(staff_number=>{
        this.staff_list[staff_number] = staff_list[staff_number]['name'];
      })
    }
    let doctor_code_list = [];
    let doctor_data = sessApi.getDoctorList();
    this.doctor_names = [];
    doctor_data.map(doctor=>{
      let index = doctor_code_list.indexOf(doctor.doctor_code);
      if(index === -1){
        doctor_code_list.push(doctor.doctor_code);
        this.doctor_names[doctor.number] = doctor.name;
      }
    });
  }
  
  async componentDidMount() {
    await this.getMaster();
  }
  
  getMaster=async()=>{
    let path = "/app/api/v2/nursing_service/get/nurse_summary_agree/master";
    let post_data = {
      food_type:this.state.summary_data != null ? this.state.summary_data.food_type : 0,
      writer:this.state.summary_data != null ? this.state.summary_data.writer : 0,
    };
    await apiClient.post(path, {params: post_data})
      .then(res => {
        this.help_data = (res.help_data != undefined && res.help_data.text != undefined) ? res.help_data.text : "";
        this.food_type_name = res.food_type_name;
        this.writer_name = res.writer_name;
      })
      .catch(()=> {
      })
    this.setState({is_loaded:true});
  }
  
  helpView=()=>{
    this.setState({
      alert_title:"ヘルプ",
      alert_messages: this.help_data,
    });
  }
  
  closeModal=()=>{
    this.setState({
      alert_messages: "",
      alert_title:"",
      confirm_title:"",
      confirm_message:"",
      confirm_type:"",
      isOpenRegisterComment:false,
    });
  }
  
  confirmApprove=(approval_category)=>{
    if (!this.context.$canDoAction(this.context.FEATURES.HOSPITAL_NURSE_SUMMARY,this.context.AUTHS.CONFIRM)) {
      this.setState({alert_messages:"権限がありません。"});
      return;
    }
    this.setState({
      confirm_title:(approval_category == 1 ? "承認" : "差し戻し") + "確認",
      confirm_message:(approval_category == 1 ? "承認" : "差し戻") + "しますか？",
      confirm_type:"summary_approve",
      approval_category
    });
  }
  
  approveSummary=async()=>{
    this.setState({
      is_loaded:false,
      confirm_title:"",
      confirm_message:"",
      confirm_type:"",
    });
    let path = "/app/api/v2/nursing_service/approve/nurse_summary";
    let summary_data = this.state.summary_data;
    summary_data.create_comment = this.state.create_comment;
    summary_data.approval_comment = this.state.approval_comment == "" ? null : this.state.approval_comment;
    summary_data.approval_category = this.state.approval_category;
    let post_data = {
      number:summary_data.number,
      create_comment:this.state.create_comment,
      approval_comment:this.state.approval_comment === "" ? null : this.state.approval_comment,
      approval_category:this.state.approval_category,
      patient_id:summary_data.patient_id
    };
    let alert_messages = "";
    await apiClient.post(path, {params: post_data})
      .then(res => {
        if(res.error_message != undefined){
          alert_messages = res.error_message;
          summary_data = this.props.summary_info.summary_data;
        } else {
          alert_messages = (this.state.approval_category == 1 ? "承認" : "差し戻") + "しました。";
          summary_data = res;
        }
      })
      .catch(()=> {
      });
    this.setState({
      is_loaded:true,
      summary_data,
      alert_messages
    });
  }
  
  openRegisterComment=()=>{
    if (!this.context.$canDoAction(this.context.FEATURES.HOSPITAL_NURSE_SUMMARY,this.context.AUTHS.CONFIRM)) {
      this.setState({alert_messages:"権限がありません。"});
      return;
    }
    this.setState({isOpenRegisterComment:true});
  }
  
  setComment=(create_comment, approval_comment)=>{
    this.setState({
      create_comment,
      approval_comment,
      isOpenRegisterComment:false
    });
  }
  
  confirmSaveSummary=()=>{
    if (!this.context.$canDoAction(this.context.FEATURES.HOSPITAL_NURSE_SUMMARY,this.context.AUTHS.CONFIRM)) {
      this.setState({alert_messages:"権限がありません。"});
      return;
    }
    this.setState({
      confirm_title:"確定確認",
      confirm_message:"確定しますか？",
      confirm_type:"summary_save",
    });
  }
  
  saveSummary=async()=>{
    this.setState({
      confirm_title:"",
      confirm_message:"",
      confirm_type:"",
    });
    let path = "/app/api/v2/nursing_service/register/nurse_summary";
    let summary_data = this.state.summary_data;
    if(summary_data == null){
      summary_data = {};
      summary_data.number = 0;
      summary_data.patient_id = this.props.summary_info.patient_id;
      summary_data.hospitalization_date = this.props.summary_info.date_and_time_of_hospitalization;
      summary_data.create_flag = 0;
    }
    summary_data.create_comment = this.state.create_comment;
    summary_data.approval_comment = this.state.approval_comment == "" ? null : this.state.approval_comment;
    let alert_messages = "";
    await apiClient.post(path, {params: summary_data})
      .then(res => {
        if(res.error_message !== undefined){
          alert_messages = "確定失敗";
          summary_data = this.props.summary_info.summary_data;
          this.setState({
            summary_data,
            alert_messages
          });
        } else {
          this.props.closeModal('register', "確定しました。")
        }
      })
      .catch(()=> {
      });
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type == "summary_approve"){
      this.approveSummary();
    }
    if(this.state.confirm_type == "summary_save"){
      this.saveSummary();
    }
  }
  
  render() {
    let summary_data = this.state.summary_data;
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm patient-exam-modal bed-control-modal first-view-modal"
        >
          <Modal.Header><Modal.Title>看護サマリー承認</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              {this.state.is_loaded ? (
                <div className='flex' style={{height:"100%"}}>
                  <div className = 'left-area'>
                    <div className='blog'>
                      <div className='blog-title'>作成</div>
                      <div className='blog-content'>
                        <div className='flex' style={{marginTop:"0.5rem"}}>
                          <div className='title-label'>サマリ状態</div>
                          <div className = 'content-label'>
                            {summary_data == null ? "未作成" : ((summary_data.create_flag == 1) ? "作成済" : "作成中")}
                          </div>
                        </div>
                        <div className='flex' style={{marginTop:"0.5rem"}}>
                          <div className='title-label'>日付</div>
                          <div className = 'content-label'>
                            {(summary_data != null && summary_data.created_at != null)
                              ? formatDateSlash(new Date(summary_data.created_at.split("-").join("/"))) : ""}
                          </div>
                        </div>
                        <div className='flex' style={{marginTop:"0.5rem"}}>
                          <div className='title-label'>利用者名</div>
                          <div className = 'content-label'>
                            {(summary_data != null && summary_data.created_by != null && this.staff_list[summary_data.created_by] != undefined)
                              ? this.staff_list[summary_data.created_by] : ""}
                          </div>
                        </div>
                        <div className='flex' style={{marginTop:'0.5rem'}}>
                          <div className='title-label' style={{paddingTop:"0.3rem"}}>コメント</div>
                          <div className='comment-area'>{this.state.create_comment}</div>
                        </div>
                      </div>
                    </div>
                    <div className='blog'>
                      <div className='blog-title'>承認／差し戻し</div>
                      <div className='blog-content'>
                        <div className='flex' style={{marginTop:"0.5rem"}}>
                          <div className='title-label'>サマリ状態</div>
                          <div className = 'content-label'>
                            {this.state.summary_data == null ? "未承認" : ((summary_data.approval_category == 0)
                              ? "未承認" : ((summary_data.approval_category == 1) ? "承認済み" : "差し戻し"))}
                          </div>
                        </div>
                        <div className='flex' style={{marginTop:"0.5rem"}}>
                          <div className='title-label'>日付</div>
                          <div className = 'content-label'>
                            {(summary_data != null && summary_data.approval_date != null)
                              ? formatDateSlash(new Date(summary_data.approval_date.split("-").join("/"))) : ""}
                          </div>
                        </div>
                        <div className='flex' style={{marginTop:"0.5rem"}}>
                          <div className='title-label'>利用者名</div>
                          <div className = 'content-label'>
                            {(summary_data != null && summary_data.approval_staff_id != null && this.staff_list[summary_data.approval_staff_id] != undefined)
                              ? this.staff_list[summary_data.approval_staff_id] : ""}
                          </div>
                        </div>
                        <div className='flex' style={{marginTop:'0.5rem'}}>
                          <div className='title-label' style={{lineHeight:"2rem"}}>コメント</div>
                          <div className='comment-area'>{this.state.approval_comment}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className = 'right-area'>
                    <div>サマリー内容</div>
                    <div className={'summary-data'}>
                      <div className={'flex'}>
                        <div className={'div-title'}>診療科: </div>
                        <div className={'div-value'}>{this.props.summary_info.department_name}</div>
                      </div>
                      <div className={'flex'}>
                        <div className={'div-title'}>病棟: </div>
                        <div className={'div-value'}>{this.props.summary_info.ward_name}</div>
                      </div>
                      <div className={'flex'}>
                        <div className={'div-title'}>氏名:</div>
                        <div className={'div-value'}>{this.props.summary_info.patient_name}</div>
                      </div>
                      <div className={'flex'}>
                        <div className={'div-title'}>生年月日:</div>
                        <div className={'div-value'}>{this.props.summary_info.birth_day}</div>
                      </div>
                      <div className={'flex'}>
                        <div className={'div-title'}>病名:</div>
                        <div className={'div-value'}>{this.props.summary_info.disease_name}</div>
                      </div>
                      {summary_data != null && (
                        <>
                          <div className={'div-title'}>既往歴:</div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>年齢 </div>
                            <div className={'div-value'}>{summary_data.medical_history_age != null ? summary_data.medical_history_age + "歳" : ""}</div>
                          </div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>病名 </div>
                            <div className={'div-value'}>{summary_data.medical_history_disease_name != null ? summary_data.medical_history_disease_name : ""}</div>
                          </div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>病院 </div>
                            <div className={'div-value'}>{summary_data.medical_history_hospital != null ? summary_data.medical_history_hospital : ""}</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>入院経過:</div>
                            <div className={'div-value'}>
                              ≪入院期間≫{formatJapan(this.props.summary_info.date_and_time_of_hospitalization.split("-").join("/"))} ～
                              {this.props.summary_info.discharge_date != null ? formatJapan(this.props.summary_info.discharge_date.split("-").join("/")) : ""}
                            </div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>内服:</div>
                            <div className={'div-value'}>「おくすり説明書」参照</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>褥瘡:</div>
                            <div className={'div-value'}>{summary_data.pressure_ulcer_judgment == 0 ? "無" : "有"}</div>
                          </div>
                          {summary_data.pressure_ulcer_judgment == 1 && summary_data.pressure_ulcer_site != "" && (
                            <div className={'flex'} style={{marginLeft:"1rem"}}>
                              <div className={'div-title'}>部位 </div>
                              <div className={'div-value'}>{summary_data.pressure_ulcer_site}</div>
                            </div>
                          )}
                          <div className={'flex'}>
                            <div className={'div-title'}>移動:</div>
                            <div className={'div-value'}>{summary_data.movement_judgment == 1 ? "自立"
                              : (summary_data.movement_judgment == 2 ? "見守り"
                                : (summary_data.movement_judgment == 3 ? "部分介助"
                                  : (summary_data.movement_judgment == 4 ? "全介助" : "")))}</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>更衣:</div>
                            <div className={'div-value'}>{summary_data.change_of_clothes_judgment == 1 ? "自立"
                              : (summary_data.change_of_clothes_judgment == 2 ? "見守り"
                                : (summary_data.change_of_clothes_judgment == 3 ? "部分介助"
                                  : (summary_data.change_of_clothes_judgment == 4 ? "全介助" : "")))}</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>入浴:</div>
                            <div className={'div-value'}>{summary_data.bathing_judgment == 1 ? "自立"
                              : (summary_data.bathing_judgment == 2 ? "見守り"
                                : (summary_data.bathing_judgment == 3 ? "部分介助"
                                  : (summary_data.bathing_judgment == 4 ? "全介助" : "")))}</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>食事:</div>
                            <div className={'div-value'}>{summary_data.meal_judgment == 1 ? "自立"
                              : (summary_data.meal_judgment == 2 ? "見守り"
                                : (summary_data.meal_judgment == 3 ? "部分介助"
                                  : (summary_data.meal_judgment == 4 ? "全介助" : "")))}</div>
                          </div>
                          <div className={'div-title'}>食種:</div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>形態</div>
                            <div className={'div-value'}>{this.food_type_name}</div>
                          </div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>エネルギー</div>
                            <div className={'div-value'}>{summary_data.food_energy != null ? summary_data.food_energy + "㎉" : ""}</div>
                          </div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>塩分</div>
                            <div className={'div-value'}>{summary_data.food_type_salt_content != null ? summary_data.food_type_salt_content + "g" : ""}</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>義歯:</div>
                            <div className={'div-value'}>{summary_data.denture_judgment == 0 ? "無"
                              : ("有 " + (summary_data.denture_part == 1 ? "全部" : (summary_data.denture_part == 2 ? "部分" : "")))}
                            </div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>ＰＥＧ:</div>
                            <div className={'div-value'}>{summary_data.peg_construction_date != null
                              ? ("造設日又は交換（挿入）施工日 " + formatJapan(summary_data.peg_construction_date.split("-").join("/"))) : ""}
                            </div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>ＥＤチューブ:</div>
                            <div className={'div-value'}>{summary_data.scheduled_ed_tube_date != null
                              ? ("次回交換（挿入）予定日 " + formatJapan(summary_data.scheduled_ed_tube_date.split("-").join("/"))) : ""}
                            </div>
                          </div>
                          <div className={'div-title'}>排泄：</div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>排便</div>
                            <div className={'div-value'}>{summary_data.defecation != null ? summary_data.defecation + "回/日" : ""}</div>
                          </div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>最終排便</div>
                            <div className={'div-value'}>
                              {summary_data.last_defecation != null ?
                                (summary_data.last_defecation.split(" ")[0].split("-")[1] + '月' + summary_data.last_defecation.split(" ")[0].split("-")[2] + '日') : ""}
                            </div>
                          </div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>排尿回数</div>
                            <div className={'div-value'}>{summary_data.number_of_urination != null ? summary_data.number_of_urination + "回/日" : ""}</div>
                          </div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>バルン</div>
                            <div className={'div-value'}>{summary_data.balun_judgment == 0 ? "無"
                              : ("有 " + (summary_data.balun_size != null ? ("サイズ（" + summary_data.balun_size + "Fr）") : ""))}
                              {summary_data.balun_insert_date != null ? ("挿入日" + formatJapan(summary_data.balun_insert_date.split("-").join("/"))) : ""}
                            </div>
                          </div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>ストマ</div>
                            <div className={'div-value'}>{summary_data.stoma_judgment == 0 ? "無" : "有"}</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>感染症:</div>
                            <div className={'div-value'}>{summary_data.infectious_disease_judgment == 0 ? "無"
                              : ("有 " + (summary_data.hbs == 1 ? "HBS " : "") + (summary_data.hcv == 1 ? "HCV " : "") + (summary_data.wa == 1 ? "Wa " : "") + (summary_data.mrsa == 1 ? "MRSA" : ""))}
                            </div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>アレルギー:</div>
                            <div className={'div-value'}>{summary_data.allergy_judgment == 0 ? "無"
                              : ("有 " + " 食品 " + (summary_data.allergic_food == 1 ? "有 " : "無 ") + " 薬品 " + (summary_data.allergic_drugs == 1 ? "有" : "無"))}
                            </div>
                          </div>
                          <div className={'div-title'}>最終バイタル:</div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>T</div>
                            <div className={'div-value'}>{summary_data.t != null ? summary_data.t + "℃" : ""}</div>
                          </div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>P</div>
                            <div className={'div-value'}>{summary_data.p != null ? summary_data.p + "回/分" : ""}</div>
                          </div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>BP</div>
                            <div className={'div-value'}>{summary_data.bp != null ? summary_data.bp + "㎜Hg" : ""}</div>
                          </div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>SPO2</div>
                            <div className={'div-value'}>{summary_data.spo2 != null ? summary_data.spo2 + "%" : ""}</div>
                          </div>
                          <div className={'div-title'}>介護保険:</div>
                          {summary_data.long_term_care_insurance_judgment == 4 ? (
                            <>
                              <div className={'flex'} style={{marginLeft:"1rem"}}>
                                <div className={'div-title'}>事業所</div>
                                <div className={'div-value'}>{(summary_data.long_term_care_insurance_required != null ? summary_data.long_term_care_insurance_required : "")}</div>
                              </div>
                            </>
                          ):(
                            <>
                              <div className={'div-value'} style={{marginLeft:"1rem"}}>
                                {summary_data.long_term_care_insurance_judgment == 3 ? "要支援"
                                  : (summary_data.long_term_care_insurance_judgment == 2 ? "申請中"
                                    :(summary_data.long_term_care_insurance_judgment == 1 ? "有" : "無"))}
                              </div>
                            </>
                          )}
                          {summary_data.long_term_care_insurance_office != null && (
                            <div className={'flex'} style={{marginLeft:"1rem"}}>
                              <div className={'div-title'}>事業所</div>
                              <div className={'div-value'}>{summary_data.long_term_care_insurance_office}</div>
                            </div>
                          )}
                          <div className={'div-title'}>家族構成:</div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>キーパーソン</div>
                            <div className={'div-value'}>{summary_data.key_person != null ? summary_data.key_person : ""}</div>
                          </div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>身寄りなし</div>
                            <div className={'div-value'}>{summary_data.no_relatives != null ? summary_data.no_relatives : ""}</div>
                          </div>
                          <div className={'div-title'}>緊急連絡先:</div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>氏名（続柄）</div>
                            <div className={'div-value'}>
                              {summary_data.emergency_contact_name != null ? summary_data.emergency_contact_name : ""}
                              {summary_data.emergency_contact_relations != null ? ("（" + summary_data.emergency_contact_relations + "）") : ""}
                            </div>
                          </div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>電話番号</div>
                            <div className={'div-value'}>
                              {summary_data.emergency_contact_phone_number != null ? summary_data.emergency_contact_phone_number : ""}
                            </div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>看護上の問題:</div>
                            <div className={'div-value'}>
                              {summary_data.long_term_care_problems != null ? displayLineBreak(summary_data.long_term_care_problems) : ""}
                            </div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>視覚障害:</div>
                            <div className={'div-value'}>{summary_data.visually_impaired == 1 ? "有" : "無"}</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>聴覚障害:</div>
                            <div className={'div-value'}>{summary_data.hearing_impairment == 1 ? "有" : "無"}</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>言語障害:</div>
                            <div className={'div-value'}>{summary_data.language_disorder == 1 ? "有" : "無"}</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>運動障害:</div>
                            <div className={'div-value'}>{summary_data.movement_disorders == 1 ? "有" : "無"}</div>
                          </div>
                          <div className={'div-title'}>麻痺:</div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>上肢</div>
                            <div className={'div-value'}>{summary_data.paralyzed_upper_limbs == 1 ?
                              ("有 " + (summary_data.paralyzed_upper_limb_site != null ? ("（" + summary_data.paralyzed_upper_limb_site + "") : "）")) : "無"}</div>
                          </div>
                          <div className={'flex'} style={{marginLeft:"1rem"}}>
                            <div className={'div-title'}>下肢</div>
                            <div className={'div-value'}>{summary_data.paralyzed_lower_limbs == 1 ?
                              ("有 " + (summary_data.paralyzed_lower_limb_site != null ? ("（" + summary_data.paralyzed_lower_limb_site + "") : "）")) : "無"}</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>理解度:</div>
                            <div className={'div-value'}>{summary_data.comprehension != null ? summary_data.comprehension : ""}</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>気管切開:</div>
                            <div className={'div-value'}>{summary_data.tracheostomy_judgment == 1
                              ? ("有 " + (summary_data.tracheostomy_type != null ? ("種類（" + summary_data.tracheostomy_type + "） Fr") : "")) : "無"}</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>特記事項:</div>
                            <div className={'div-value'}>{summary_data.notices != null ? displayLineBreak(summary_data.notices) : ""}</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>主治医:</div>
                            <div className={'div-value'}>{(summary_data.doctor != null && this.doctor_names[summary_data.doctor] != undefined)
                              ? this.doctor_names[summary_data.doctor] : ""}</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>師長:</div>
                            <div className={'div-value'}>{(summary_data.division_teacher != null && this.doctor_names[summary_data.division_teacher] != undefined)
                              ? this.doctor_names[summary_data.division_teacher] : ""}</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>記載者:</div>
                            <div className={'div-value'}>{this.writer_name}</div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>記載日:</div>
                            <div className={'div-value'}>
                              {summary_data.date_of_description != null ? formatJapan(summary_data.date_of_description.split("-").join("/")) : ""}
                            </div>
                          </div>
                          <div className={'flex'}>
                            <div className={'div-title'}>改定日:</div>
                            <div className={'div-value'}>
                              {summary_data.revision_date != null ? formatJapan(summary_data.revision_date.split("-").join("/")) : ""}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ):(
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            {/*<Button className="red-btn" onClick={this.helpView}>ヘルプ</Button>*/}
            <Button className="red-btn" onClick={this.confirmApprove.bind(this, 1)}>承認</Button>
            <Button className={"red-btn"} onClick={this.confirmApprove.bind(this, 2)}>差し戻し</Button>
            <Button className="red-btn" onClick={this.openRegisterComment}>コメント登録</Button>
            <Button className="red-btn" onClick={this.confirmSaveSummary}>確定</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
              title= {this.state.alert_title}
            />
          )}
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title= {this.state.confirm_title}
            />
          )}
          {this.state.isOpenRegisterComment && (
            <RegisterComment
              closeModal={this.closeModal}
              setComment={this.setComment}
              create_comment={this.state.create_comment}
              approval_comment={this.state.approval_comment}
            />
          )}
        </Modal>
      </>
    );
  }
}

NurseSummaryAgreeModal.contextType = Context;
NurseSummaryAgreeModal.propTypes = {
  closeModal: PropTypes.func,
  summary_info : PropTypes.object
};

export default NurseSummaryAgreeModal;

