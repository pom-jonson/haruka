import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { surface } from "~/components/_nano/colors";
import { formatDateLine, formatJapanDateSlash, formatTime } from "~/helpers/date";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import DialSideBar from "../Dial/DialSideBar";
import DialPatientNav from "../Dial/DialPatientNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import NutritionGuidePreviewModal from "./NutritionGuidePreviewModal";
// import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import EditRegularTextModal from "~/components/templates/Print/EditRegularTextModal";
import Checkbox from "~/components/molecules/Checkbox";
import { CACHE_SESSIONNAMES } from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import renderHTML from "react-render-html";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Context from "~/helpers/configureStore";
import { makeList_code, moveCaretPosition ,displayLineBreak, toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import {
  // addRequiredBg,
  // removeRequiredBg,
  // addRedBorder,
  removeRedBorder
} from '~/helpers/dialConstants';
import { printValidate } from "~/helpers/validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from 'jquery';
import PropTypes from "prop-types";
import { formatJapanDate } from "../../../helpers/date";
import ChangeNutritionGuildModal from "~/components/templates/Dial/modals/ChangeNutritionGuildModal";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const renderTooltip = (props) => <Tooltip {...props}>{props}</Tooltip>;

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  margin: 0px;
  top: 70px;
  float: left;
  width: calc(100% - 390px);
  left: 200px;
  height: 100%;
  position: fixed;
  background-color: ${surface};
  padding: 20px;
  .footer {
    margin-top: 20px;
    text-align: center;
    margin-left: 0px !important;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }
    span {
      color: white;
      font-size: 24px;
      font-weight: 100;
    }
  }
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 13rem);
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  .hankaku-eng-num-input{
    ime-mode: inactive;
    input{
      ime-mode: inactive;
    }
  }
  .justify-content-style{
    justify-content: flex-end;
    label{
      font-size: 1rem;
    }
  }
  .content {
    margin-top: 10px;
    overflow: hidden;
    overflow-y: auto;
    height: 100%;
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .clickable {
    cursor: pointer;
    input {
      cursor: pointer;
    }
  }
  .div-style1 {
    display: block;
    overflow: hidden;
    width: 100px;
    margin-right: 5px;
    .label-type1 {
      font-size: 16px;
      text-align: right;
      width: 100%;
      float: left;
    }
    .label-type2 {
      font-size: 20px;
      float: right;
      cursor: pointer;
    }
  }
  .div-style2 {
    display: block;
    overflow-y: auto;
    width: 110px;
    margin-right: 0px;
    padding: 0;
    margin-top: 0px;
    button {
      margin-bottom: 5px;
      margin-left: 3px;
      min-width: 85px;
    }
  }

  .left-area {
    width: 75%;
    height: 100%;
    float: left;
    .main-info {
      height: 20%;
      display: flex;
      margin-bottom: 10px;
      margin-top: 1rem;
    }
    .label-cur-date {
      text-align: left;
      width: 60px;
      font-size: 16px;
      margin-top: 14px;
    }
    .cur-date {
      width: 64%;
      height: 35px;
      border-radius: 4px;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(206, 212, 218);
      border-image: initial;
      margin-top: 8px;
      padding: 0px 8px;
      line-height: 35px;
    }
    .main-info .disease-name {
      height: 80%;
      overflow: hidden;
      border: 1px solid #ddd;
      p {
        margin: 0;
        text-align: center;
        font-size: 20px;
      }
    }
    .disease-name {
      height: 80%;
      border: 1px solid #ddd;
      .history-title {
        font-size: 20px;
      }
      .flex div {
        width: 50%;
      }
      .history-delete {
        cursor: pointer;
      }
    }
    .disease-history {
      width: calc(100% - 230px) !important;
      font-size: 20px;
      textarea {
        width: 100%;
        height: 100%;
      }
    }
    .box-border {
      overflow: hidden;
      overflow-y: auto;
      border: 1px solid black;
      height: 85%;
      p {
        margin: 0;
        text-align: center;
      }
      .select-area .radio-group-btn label {
        text-align: left;
        padding-left: 10px;
        border-radius: 4px;
      }
    }
  }
  .right-area {
    width: 25%;
    padding-left: 1.25rem;
    height: 100%;
    float: right;
    .area-name {
      font-size: 1.25rem;
      width: calc(100% - 9.3rem);
    }
    .delete-history {
      width: 9.3rem;
      font-size: 0.875rem;
    }
  }
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .label-box {
    font-size: 16px;
    border: 1px solid #a0a0a0;
  }
  .prev-session {
    width: 65%;
    padding-left: 5%;
  }
  .pt-20 {
    padding-top: 20px;
  }
  .pt-10 {
    padding-top: 10px;
  }
  .pt-12 {
    padding-top: 12px;
  }
  .padding-top-5 {
    padding-top: 5px;
  }
  .wp-30 {
    width: 30%;
  }
  .wp-35 {
    width: 35%;
  }
  .wp-40 {
    width: 40%;
  }
  .wp-45 {
    width: 45%;
    cursor: pointer;
  }
  .wp-55 {
    width: 55%;
  }
  .wp-60 {
    width: 60%;
  }
  .wp-70 {
    width: 70%;
  }
  .hp-100 {
    height: 100%;
  }
  .selected {
    background: lightblue;
  }
  .table-view {
    border: 1px solid #ddd;
    overflow: hidden;
    height: 90%;
  }

  .history-item {
    padding: 5px;
  }

  .delete-record{
    color: red;
  }

  .history-date{
    display: flex;
    justify-content:space-between;
  }

  .history-header {
    overflow: hidden;
    display: flex;
    margin-bottom: 20px;
  }

  .header-item {
    width: 60%;
    margin-right: 30px;
    .label-title {
      width: 7.5rem;
      text-align: right;
      font-size: 1rem;
      margin-top: 5px;
      margin-bottom: 0;
      margin-right: 8px;
    }
    input {
      width: 10rem;
    }
    .label-unit {
      text-align: left;
    }
  }
  .header-item-left {
    input {
      width: 7rem;
    }
    .label-title {
      width: 6rem;
    }
    .input-bmi {
      label {
        width: 3rem;
      }
    }
    .react-numeric-input {
      input {
        width: 7rem !important;
      }
    }
  }

  .header-item-right {
    width: 40% !important;
    margin-right: 30px;
    input {
      width: 13rem;

    }
    .react-datepicker-wrapper {
      width: 13rem;
      height: 38px;
      input {
        width: 100%;
        height: 38px;
      }
    }
  }
  .sub-left-area {
    width: 55%;
  }
  .sub-right-area {
    width: 45%;
    padding-left: 1.5rem;
  }
  .checkbox-area {
    label {
      width: 20rem;
      font-size: 1rem;
    }
  }
  .guidance-area {
    display: flex;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid;
    .label-title {
      display: none;
    }
    .date-labe {
      margin-top: 10px;
    }
    .react-datepicker-wrapper {
      input {
        height: 35px;
      }
    }
    .pd-15 {
      margin-left: 3px;
      margin-right: 3px;
      padding-top: 0.5rem;
    }
    button {
      margin-left: 5px;
      height: 35px;
      margin-top: 8px;
    }
    input {
      width: 130px;
    }
  }
  .table-area {
    height:auto;
    min-height: 200px;
    padding-left: 10px;
    padding-right: 10px;
    .presc-area {
      height:calc(100% - 1.5rem);
      width: 100%;      
      border: 1px solid;
      padding-left: 8px;
      .one-prescript-usage {
        padding=left: 10px;
      }
    }
  }
  .left-table {
    width: 30rem;
  }
  .right-table {
    width: calc(100% - 30rem);
  }
  .food-area {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid;
    margin-top: 1rem;
  }
  .table-title {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    padding-left: 1rem;
  }
  .table {
    border: 1px solid;
    th,
    td {
      border: 1px solid black;
    }
    th {
      padding: 0.2rem;
    }
  }
  .instruction-table {
    td input {
      width: 6.25rem;
    }
  }

  #tall_id, #weight_id{
    text-align: right;
    padding: 0.1ex 2ex !important;    
  }
  .input-right-text{
    text-align: right;
  }
  .auto-width{
    input{
      width:24rem;
    }
  }
`;

const ContextMenuUl = styled.ul`
  margin-bottom:0;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;

    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
`;

const ContextMenu = ({visible,x,y,parent,item}) => {
  if (visible) {
      return (
          <ContextMenuUl>
              <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>                  
                  <li><div onClick={() =>parent.contextMenuAction("history", item)}>変更履歴</div></li>                  
              </ul>
          </ContextMenuUl>
      );
  } else { return null; }
};

const instruction_items = [
  "病態説明",
  "間食、アルコールについて",
  "食事療法の基本方針",
  "食品交換表の説明",
  "１日の食塩構成",
  "運動について",
  "禁止、制限食品",
  "外食について",
  "献立作成方法と調理方法",
  "その他",
  "塩分含有食品と減塩食のおいしい食べ方",
];
// const periodics = [
//   "【臨時処方】",
//   "【定期処方1】",
//   "【定期処方2】",
//   "【定期処方3】",
// ];
class NutritionGuide extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    var template_master = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.COMMON_MASTER,
      "template_master"
    );
    template_master = template_master.filter(
      (x) => x.document_name == "栄養指導依頼"
    );
    var init_items = JSON.parse(template_master[0].body);
    var check_instructions = {};
    var check_guidances = {};
    instruction_items.map((item) => {
      check_guidances[item] = false;
      check_instructions[item] = false;
    });
    this.state = {
      patient_id: 0,
      past_history: "",
      disease_history: "",
      isShowDiseaseList: false,
      doctor_number: 0,
      disease_codes: [],
      selected_history_number: 0,
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
      isOpenPreviewModal: false,
      patientInfo: "",
      number: "",
      write_date: new Date(),
      general_opinion: "",      
      course_treatment: "",
      cur_prescription: "",
      remark: "",
      disease_history_data: [],
      select_data: "",
      instruction_content: init_items,
      isShowDoctorList: false,
      instruction_doctor_number: 0,
      nutrition_doctor_number: 0,
      general_opinion_regular_text: [],
      soap_list: [],      
      openEditRegularTextModal: false,
      isShowNutrionDoctorList: false,
      isConfirmSelectHistory: false,
      check_instructions,
      check_guidances,
      alert_message: "",
      historyNutritionGuideModal: false,
      show_delete_record: 0,
    };
    this.period_month = 1;
    this.double_click = false;
    let code_master = sessApi.getObjectValue(
      "dial_common_master",
      "code_master"
    );
    this.primary_disease_codes = makeList_code(code_master["原疾患"]);
    this.job_codes = makeList_code(code_master["職業"]);
    this.original = "";
    this.change_flag = 0;
  }

  async componentDidMount() {
    await this.getDoctors();
    await this.getStaffs();
    await this.setDoctors();
    await this.getRegularText();
    this.initialize();
    this.changeBackground();
  }

  componentDidUpdate () {
    this.changeBackground();

    // const that = this;
    let amount_obj = document.getElementById("input-id-0");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition("input-id-0");
      });
    }
    // const that = this;
    amount_obj = document.getElementById("input-id-1");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition("input-id-1");
      });
    }
    // const that = this;
    amount_obj = document.getElementById("input-id-2");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition("input-id-2");
      });
    }
    // const that = this;
    amount_obj = document.getElementById("input-id-3");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition("input-id-3");
      });
    }
    // const that = this;
    amount_obj = document.getElementById("input-id-4");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition("input-id-4");
      });
    }
    // const that = this;
    amount_obj = document.getElementById("input-id-5");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition("input-id-5");
      });
    }
    // const that = this;
    amount_obj = document.getElementById("input-id-6");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition("input-id-6");
      });
    }
    // const that = this;
    amount_obj = document.getElementById("input-id-7");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition("input-id-7");
      });
    }
    // const that = this;
    amount_obj = document.getElementById("tall_id");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition("tall_id");
      });
    }
    // const that = this;
    amount_obj = document.getElementById("weight_id");
    if(amount_obj !== undefined && amount_obj != null){
      amount_obj.addEventListener('focus', function(){
        moveCaretPosition("weight_id");
      });
    }
    
  }

  setChangeFlag = (change_flag = 0) => {
    this.change_flag = change_flag;
    if (change_flag == 1) {
      sessApi.setObjectValue("dial_change_flag", "dial_family", 1);
    } else {
      sessApi.remove("dial_change_flag");
    }
  };

  async initialize() {
    await this.getInspectionResult();
    // await this.getBasicData();
    await this.getPrescription();
    await this.getNutritionData();
    await this.getHeartData();
    await this.getBloodData();

    this.clearRedBorder();
    this.setChangeFlag(0);

    var check_instructions = {};
    var check_guidances = {};
    var template_master = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.COMMON_MASTER,
      "template_master"
    );
    template_master = template_master.filter(
      (x) => x.document_name == "栄養指導依頼"
    );
    var init_items = JSON.parse(template_master[0].body);
    instruction_items.map((item) => {
      check_guidances[item] = false;
      check_instructions[item] = false;
    });

    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    var instruction_doctor_number = "";
    if (
      authInfo != undefined &&
      authInfo != null &&
      authInfo.doctor_number > 0
    ) {
      instruction_doctor_number = authInfo.doctor_number;
    }
    if (this.context.selectedDoctor.code > 0) {
      instruction_doctor_number = parseInt(this.context.selectedDoctor.code);
    }    

    this.setState(
      {
        check_guidances,
        check_instructions,
        instruction_content: init_items,
        instruction_doctor_number,
        general_opinion: "",
      }
    );
  }

  async getHeartData () {    
    let path = "/app/api/v2/dial/medicine_information/heart/list";
    let post_data = {
        system_patient_id: this.state.patientInfo.system_patient_id,
        cur_date:formatDateLine(this.state.write_date)
    };
    await apiClient.post(path, {params: post_data}).then((data)=>{
        if (data.length > 0){
          for (var i = 0 ;i < data.length; i++){
            if (data[i].chest_ratio != undefined && data[i].chest_ratio!='') {
              this.chest_ratio = data[i].chest_ratio;
              break;
            }
          }
        }
    });
  }

  getInspectionResult = async () => {
    if (this.state.patientInfo !== "") {
      let path =
        "/app/api/v2/dial/medicine_information/examination_data/getExamResultData";
      let write_date = this.state.write_date;
      let cur_date = new Date(formatDateLine(write_date));
      cur_date.setMonth(cur_date.getMonth() - parseInt(this.period_month));
      let post_data = {
        system_patient_id: this.state.patientInfo.system_patient_id,
        examination_start_date: formatDateLine(cur_date),
        examination_end_date: formatDateLine(write_date),
        // curPatternCode: this.state.curPatternCode,
        type: "asc",
      };
      const { data } = await axios.post(path, { params: post_data });
      var exam_table_data = [];
      if (data != undefined && data != null && data.length > 0) {
        this.setState({
          exam_table_data: data,
        });
      } else {
        this.setState({ exam_table_data });
      }
    }
  };

  getBloodData = async () => {
    if (this.state.patientInfo != ''){
      let path = "/app/api/v2/dial/medicine_information/basic_data/getBlood";
      let post_data = {
        schedule_date: formatDateLine(this.state.write_date),
        patient_id: this.state.patientInfo.patient_number,
      };
      const { data } = await axios.post(path, { params: post_data });
      if (data != ''){
        this.setState({blood_data:data})
      } else {
        this.setState({blood_data:undefined})
      }
    }
  }

  getBasicData = async () => {
    if (this.state.patientInfo !== "") {
      let path = "/app/api/v2/dial/medicine_information/basic_data/get";
      let post_data = {
        schedule_date: formatDateLine(this.state.write_date),
        patient_id: this.state.patientInfo.patient_number,
      };
      const { data } = await axios.post(path, { params: post_data });
      if (data != null) {
        this.setState({
          basic_data: data[this.state.patientInfo.patient_number],
        });
      } else {
        this.setState({ basic_data: undefined });
      }
    }
  };

  getPrescription = async () => {
    if (this.state.patientInfo !== "") {
      let path = "/app/api/v2/dial/pattern/prescription_pattern_search";
      let post_data = {
        params: {
          schedule_date: formatDateLine(this.state.write_date),
          patient_id: this.state.patientInfo.system_patient_id,
        },
      };

      await apiClient.post(path, post_data).then((res) => {
        // var temporaray_prescription_schedule = res.filter((item) => {
        //   if (item.is_temporary == 1) {
        //     return item;
        //   }
        // });
        var cur_prescription = "";
        if (res != undefined && res != null && res.length > 0) {
          res.map((pres_data, pres_index) => {
            // if (item.regular_prescription_number != null) {
            //   cur_prescription +=
            //     '<div className="one-prescript-header one-header">' +
            //     periodics[item.regular_prescription_number] +
            //     "</div>";
            // }
            // item.data_json.length > 0 &&
            // item.data_json.map((rp_item, index) => {
            //   cur_prescription += "<span>" + (index + 1) + "&nbsp;&nbsp;</span>";                  
            //   rp_item.medicines.length > 0 &&
            //     rp_item.medicines.map((medi_item) => {
            //       cur_prescription += "<span>" + medi_item.item_name + "&nbsp;&nbsp;&nbsp;&nbsp;</span>";
            //       cur_prescription += "<span>" + medi_item.amount + "</span>";
            //     });                  
            //   cur_prescription += '<div className="one-prescript-usage">';
            //   cur_prescription += "<span>" + rp_item.usage_name + "</span>";
            //   cur_prescription += "<span>";
            //   if (rp_item.days != undefined && rp_item.days != null) {
            //     if (rp_item.disable_days_dosing == 0) {
            //       cur_prescription += "(" + rp_item.days;
            //       if (rp_item.prescription_category == "頓服") {
            //         cur_prescription += "回分";
            //       } else {
            //         cur_prescription += "日分";
            //       }
            //       cur_prescription += ")";
            //     }
            //   }
            //   cur_prescription += "</span></div>";
            // });

            if (pres_index > 0) cur_prescription += "\n";
            cur_prescription += "《定期処方" + (pres_index + 1) +"》" + "\n";
            pres_data.data_json.map((rp_item, index) => {
              // cur_prescription = cur_prescription + '【定期薬】' + "\n";
              cur_prescription = cur_prescription + (index + 1) + ")";
              if (rp_item.medicines.length > 0) {
                rp_item.medicines.map((medi_item, medi_index) => {
                  if (medi_index != 0) cur_prescription = cur_prescription + "　";
                  cur_prescription = cur_prescription + medi_item.item_name;
                  cur_prescription = cur_prescription + medi_item.amount;
                  if (medi_item.unit != undefined) {
                    cur_prescription = cur_prescription + medi_item.unit;
                  }
                  cur_prescription = cur_prescription + (medi_item.is_not_generic == 1 ? "【後発変更不可】": "");
                  if (medi_index != (rp_item.medicines.length-1)) {
                    cur_prescription = cur_prescription + "\n";
                  }
                });
                cur_prescription = cur_prescription + " ";
              }
              cur_prescription = cur_prescription + rp_item.usage_name;
              cur_prescription = cur_prescription + "\n";
            });
          });
        }        
        this.setState({          
          cur_prescription,
        });
      });
    }
  };

  getRegularText = async () => {
    let path = "/app/api/v2/dial/master/regular_text";
    let post_data = {
      page_name: "栄養指導依頼書及び報告書",
    };
    let { data } = await axios.post(path, { params: post_data });
    let general_opinion_regular_text = [];
    if (data) {
      this.regularTextData = data;
      general_opinion_regular_text = data.filter((item) => {
        if (item.label == "総合所見") {
          return item;
        }
      });
      this.setState({
        general_opinion_regular_text,
      });
    }
  };

  async getNutritionData() {
    let path = "/app/api/v2/dial/print/getData";
    const post_data = {
      system_patient_id: this.state.patientInfo.system_patient_id,
      document_name: "栄養指導依頼書及び報告書",
      write_date: formatDateLine(this.state.write_date),
    };
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then((res) => {
        if (res.length > 0) {
          this.setState({
            disease_history_data: res[0],
          });
        } else {
          this.setState({
            disease_history_data: [],
          });
        }
      })
      .catch(() => {});
  }

  setGeneralOpinon = (e) => {
    this.setChangeFlag(1);
    this.setState({ general_opinion: e.target.value });
  };

  selectPatient = (patientInfo) => {
    this.setState(
      {
        patientInfo: patientInfo,
        tall:parseFloat(patientInfo.tall) > 0 ? patientInfo.tall:'',
        weight: "",
        bmi: "",
        number: "",
        write_date: new Date(),
        // general_opinion:'',
        // cur_prescription:'',
        // instruction_content:'',
        select_data: "",
        guidance_date: "",
        start_date: "",
        end_date: "",
        start_date_value:'',
        end_date_value:''
        // instruction_doctor_number: 0,
        // nutrition_doctor_number:0,
      },
      () => {
        this.initialize();
      }
    );
  };

  showDoctorList = (e, type) => {

    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e.target.type == undefined || e.target.type != "text") return;
    
    if (type == "doctor") {
      this.setState({ isShowDoctorList: true });
    } else {
      this.setState({ isShowNutrionDoctorList: true });
    }
  };

  selectDoctor = (doctor) => {
    this.setState({
      instruction_doctor_number: doctor.number,
    });
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (
      authInfo != undefined &&
      authInfo != null &&
      !(authInfo.doctor_number > 0)
    ) {
      this.context.$updateDoctor(doctor.number, doctor.name);
    }
    this.setChangeFlag(1);
    this.closeModal();
  };

  selectNutrionDoctor = (doctor) => {
    this.setState({
      nutrition_doctor_number: doctor.number,
    });
    this.setChangeFlag(1);
    this.closeModal();
  };

  confirmSeleteHistory=(data)=>{
    if (this.change_flag == 1) {      
      this.setState({
        isConfirmSelectHistory:true,
        confirm_message:"登録していない内容があります。変更内容を破棄して移動しますか？",
        selected_history_data:data,
      });      
    } else {
      this.setState({
        selected_history_data:data
      },()=>{
        this.selectHistory();
      });
    }
  };

  selectHistory = () => {
    let data = this.state.selected_history_data;
    let general_opinion = "";
    let cur_prescription = "";
    let instruction_content = "";
    let check_instructions = "";
    let check_guidances = "";
    let exam_table_data = "";
    let guidance_date = "";
    let start_date = "";
    let end_date = "";
    var basic_data = "";
    var personal_data = "";    
    data.item.map((item) => {
      if (item.form_name === "総合所見") {
        general_opinion = item.body;
      }
      if (item.form_name === "処方") {
        cur_prescription = item.body;
      }
      if (item.form_name === "依頼内容") {
        if (item.body != null && item.body != "") {
          instruction_content = JSON.parse(item.body);
        }
      }
      if (item.form_name === "指示事項") {
        if (item.body != null && item.body != "") {
          check_instructions = JSON.parse(item.body);
        }
      }
      if (item.form_name === "指導事項") {
        if (item.body != null && item.body != "") {
          check_guidances = JSON.parse(item.body);
        }
      }
      if (item.form_name === "臨床検査値") {
        if (item.body != null && item.body != "") {
          exam_table_data = JSON.parse(item.body);
        }
      }
      if (item.form_name === "基礎データ") {
        if (item.body != null && item.body != "") {
          basic_data = JSON.parse(item.body);
        }
      }
      if (item.form_name === "指導日") {
        guidance_date = item.body!=null && item.body!=''? new Date(item.body):'';
      }
      if (item.form_name === "指導開始日") {
        start_date = item.body!=null && item.body!=''? new Date(item.body):'';
      }
      if (item.form_name === "指導終了日") {
        end_date = item.body!=null && item.body!=''? new Date(item.body):'';
      }

      if (item.form_name == "身長体重") {
        if (item.body != null && item.body != "") {
          personal_data = JSON.parse(item.body);
        }
      }
    });    
    this.setChangeFlag(0);
    this.setState(
      {
        isConfirmSelectHistory:false,
        select_data: data,
        number: data.number,
        write_date: new Date(data.write_date),
        general_opinion,
        cur_prescription,
        instruction_content,
        check_instructions,
        check_guidances,
        guidance_date,
        exam_table_data,
        tall: personal_data["tall"],
        weight: personal_data["weight"],
        bmi: personal_data["bmi"],
        start_date,
        start_date_value:formatTime(start_date),
        end_date,
        end_date_value:formatTime(end_date),
        basic_data,
        instruction_doctor_number: data.instruction_doctor_number,
        nutrition_doctor_number: data.nutrition_doctor_number,
        doctor_name: this.state.doctor_list_by_number[
          data.instruction_doctor_number
        ],
      }
    );
  };

  deleteHistory = async () => {
    let path = "/app/api/v2/dial/print/deleteData";
    const post_data = {
      number: this.state.number,
      system_patient_id: this.state.patientInfo.system_patient_id,
      delete_type:"nutrition_guide"
    };
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then((res) => {
        window.sessionStorage.setItem("alert_messages", res.alert_message);
        this.selectPatient(this.state.patientInfo);
      })
      .catch(() => {});

    this.setState({ isDeleteConfirmModal: false }, () => {
      this.original = JSON.stringify(this.state);
    });
    this.setChangeFlag(0);
  };

  getDate = (value) => {
    this.setState(
      {
        write_date: value,
      },
      () => {
        this.initialize();
      }
    );
  };

  getGuidanceDate = (value) => {
    this.setState({
      guidance_date: value,
    });
    this.setChangeFlag(1);
  };

  clearGuidanceDate() {
    this.setState({ guidance_date: "" });
    this.setChangeFlag(1);
  }
  
  insertStrTimeStyle=(input)=>{
    return input.slice(0, 2) + ':' + input.slice(2,input.length);
  }

  startTimeKeyEvent = (e) => {
    var start_pos = e.target.selectionStart;
    var end_pos = e.target.selectionEnd;
    var key_code = e.keyCode;    
    this.key_code_start_time = key_code;
    this.start_pos_start_time = start_pos;
    var obj = document.getElementById('start_date_id');

    let input_value = e.target.value;    
    
    if (start_pos == end_pos) {
      if (key_code == 37 && start_pos == 3){
        e.target.setSelectionRange(start_pos-1, start_pos-1);
      }
      if (key_code == 39 && start_pos == 2){
        e.target.setSelectionRange(start_pos+1, start_pos+1);
      }
    }

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }

    if (key_code == 9) {
      this.setStartTime(e);
      return;
    }
    
    if (key_code == 8){          
      if (input_value.length == 1 && start_pos == 1 && start_pos == end_pos){
        this.setState({start_date_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (input_value.length == 3 && start_pos == 1 && start_pos == end_pos){
        input_value = input_value.slice(1.2);
        this.setState({start_date_value:input_value}, () => {
          obj.setSelectionRange(0,0);
        });
        e.preventDefault();
      }
      if (start_pos == end_pos && start_pos == 3){        
        input_value = input_value.slice(0,1) + input_value.slice(3, input_value.length);        
        this.setState({
          start_date_value:input_value,
        }, () => {
          obj.setSelectionRange(1, 1);
        })
        e.preventDefault();
      }
      
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          start_date_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
    }
    if (key_code == 46){
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          start_date_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
      if (input_value.length == 1 && start_pos == 0 && start_pos == end_pos){        
        this.setState({start_date_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (start_pos == end_pos && input_value.length == 3){
        if (start_pos == 0){          
          this.setState({
            start_date_value:input_value.slice(1,2),            
          }, () => {
            obj.setSelectionRange(0, 0);
          })
          e.preventDefault();
        }
        if (start_pos == 1){          
          this.setState({
            start_date_value:input_value.slice(0,1),            
          }, () => {
            obj.setSelectionRange(1, 1);
          })
          e.preventDefault();
        }
      }
    }    
    if (key_code != 8 && key_code != 46){
      this.setState({
        start_date_value:input_value,
      })
    }
  }

  getStartDate = (value, e) => {
    if (e == undefined){
      this.setState({
        start_date:value,
        start_date_value:formatTime(value)
      })
      this.setChangeFlag(1);
      return;
    }
    var input_value = e.target.value;

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }

    if (input_value.length == 5) this.setStartTime(e);
    
    this.setState({
      start_date_value:input_value
    }, () => {
      var obj = document.getElementById('start_date_id');
      if (this.key_code_start_time == 46){        
        obj.setSelectionRange(this.start_pos_start_time, this.start_pos_start_time);
      }
      if (this.key_code_start_time == 8){        
        obj.setSelectionRange(this.start_pos_start_time - 1, this.start_pos_start_time - 1);
      }
    })
  };

  setStartTime = (e) => {        
    if (e.target.value.length != 5) {
      this.setState({
        start_date:'',
        start_date_value:undefined
      })
      this.setChangeFlag(1);
      return;
    }    
    var input_value = e.target.value;
    var hours = input_value.split(':')[0];
    var mins = input_value.split(':')[1];    
    if (hours > 23 || mins > 60){
      this.setState({
        start_date:'',
        start_date_value:undefined
      })
      this.setChangeFlag(1);
      return;
    }    
    var now = new Date();
    now.setHours(hours);
    now.setMinutes(mins);
    this.setState({start_date:now})
    this.setChangeFlag(1);
  }

  endTimeKeyEvent = (e) => {
    var start_pos = e.target.selectionStart;
    var end_pos = e.target.selectionEnd;
    var key_code = e.keyCode;
    this.key_code_end_time = key_code;
    this.start_pos_end_time = start_pos;
    var obj = document.getElementById('end_date_id');

    let input_value = e.target.value;    
    
    if (start_pos == end_pos) {
      if (key_code == 37 && start_pos == 3){
        e.target.setSelectionRange(start_pos-1, start_pos-1);
      }
      if (key_code == 39 && start_pos == 2){
        e.target.setSelectionRange(start_pos+1, start_pos+1);
      }
    }

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }

    if (key_code == 9) {
      this.setEndTime(e);
      return;
    }
    
    if (key_code == 8){          
      if (input_value.length == 1 && start_pos == 1 && start_pos == end_pos){
        this.setState({end_date_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (input_value.length == 3 && start_pos == 1 && start_pos == end_pos){
        input_value = input_value.slice(1.2);
        this.setState({end_date_value:input_value}, () => {
          obj.setSelectionRange(0,0);
        });
        e.preventDefault();
      }
      if (start_pos == end_pos && start_pos == 3){        
        input_value = input_value.slice(0,1) + input_value.slice(3, input_value.length);        
        this.setState({
          end_date_value:input_value,
        }, () => {
          obj.setSelectionRange(1, 1);
        })
        e.preventDefault();
      }
      
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          end_date_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
    }
    if (key_code == 46){
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          end_date_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
      if (input_value.length == 1 && start_pos == 0 && start_pos == end_pos){        
        this.setState({end_date_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (start_pos == end_pos && input_value.length == 3){
        if (start_pos == 0){          
          this.setState({
            end_date_value:input_value.slice(1,2),            
          }, () => {
            obj.setSelectionRange(0, 0);
          })
          e.preventDefault();
        }
        if (start_pos == 1){          
          this.setState({
            end_date_value:input_value.slice(0,1),            
          }, () => {
            obj.setSelectionRange(1, 1);
          })
          e.preventDefault();
        }
      }
    }    
    if (key_code != 8 && key_code != 46){
      this.setState({
        end_date_value:input_value,
      })
    }
  }

  getEnddate = (value, e) => {
    if (e == undefined){
      this.setState({
        end_date:value,
        end_date_value:formatTime(value)
      })
      this.setChangeFlag(1);
      return;
    }
    var input_value = e.target.value;

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }

    if (input_value.length == 5) this.setEndTime(e);
    
    this.setState({
      end_date_value:input_value
    }, () => {
      var obj = document.getElementById('end_date_id');
      if (this.key_code_end_time == 46){        
        obj.setSelectionRange(this.start_pos_end_time, this.start_pos_end_time);
      }
      if (this.key_code_end_time == 8){        
        obj.setSelectionRange(this.start_pos_end_time - 1, this.start_pos_end_time - 1);
      }
    })
  };

  setEndTime = (e) => {
    if (e.target.value.length != 5) {
      this.setState({
        end_date:'',
        end_date_value:undefined
      })
      this.setChangeFlag(1);
      return;
    }    
    var input_value = e.target.value;
    var hours = input_value.split(':')[0];
    var mins = input_value.split(':')[1];    
    if (hours > 23 || mins > 60){
      this.setState({
        end_date:'',
        end_date_value:undefined
      })
      this.setChangeFlag(1);
      return;
    }    
    var now = new Date();
    now.setHours(hours);
    now.setMinutes(mins);
    this.setState({end_date:now})
    this.setChangeFlag(1);
  }

  clearStartEndDate() {
    this.setState({
      start_date: "",
      end_date: "",
      start_date_value:'',
      end_date_value:''
    });
    this.setChangeFlag(1);
  }

  delete = () => {
    if (this.state.number !== "") {
      this.setState({
        isDeleteConfirmModal: true,
        confirm_message: "病歴情報を削除しますか?",
      });
    }
  };

  openPreviewModal = () => {
    if (this.state.patientInfo === "") {
      return;
    }
    if (this.state.select_data === "") {
      return;
    }
    var patientInfo = this.state.patientInfo;
    patientInfo.disease_name = this.primary_disease_codes[patientInfo.primary_disease];
    patientInfo.job = this.job_codes[patientInfo.occupation];
    this.setState({
      patientInfo,
      isOpenPreviewModal: true,
    });
  };
  closeModal = (act = null) => {
    this.setState(
      {
        isOpenPreviewModal: false,
        isShowDoctorList: false,
        isShowNutrionDoctorList: false,        
        openEditRegularTextModal: false,
        historyNutritionGuideModal: false,
      },
      () => {
        if (act === "edit_regular") {
          this.getRegularText();
        }
      }
    );
  };

  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      isUpdateConfirmModal: false,
      isConfirmSelectHistory: false,
      confirm_message: "",
    });
  }

  updateData = async () => {
    this.confirmCancel();
    let path = "/app/api/v2/dial/print/registerNutritionData";
    if (this.double_click == true) return;
    this.double_click = true;
    let input_data = {
      number: this.state.number,
      system_patient_id: this.state.patientInfo.system_patient_id,
      document_name: "栄養指導依頼書及び報告書",
      write_date: formatDateLine(this.state.write_date),
      general_opinion: this.state.general_opinion,
      cur_prescription: this.state.cur_prescription,
      instruction_content: JSON.stringify(this.state.instruction_content),
      tall: this.state.tall,
      weight: this.state.weight,
      bmi: this.state.bmi,
      personal_data: JSON.stringify({
        tall: this.state.tall,
        weight: this.state.weight,
        bmi: this.state.bmi,
      }),
      instructions: JSON.stringify(this.state.check_instructions),
      guidance: JSON.stringify(this.state.check_guidances),
      exam_data: JSON.stringify(this.state.exam_table_data),
      basic_data: JSON.stringify(this.state.basic_data),
      guidance_date: this.state.guidance_date,
      start_date: this.state.start_date,
      end_date: this.state.end_date,
      instruction_doctor_number: this.state.instruction_doctor_number,
      nutrition_doctor_number: this.state.nutrition_doctor_number,
    };
    await apiClient
      ._post(path, {
        params: input_data,
      })
      .then((res) => {
        if (res) {
          window.sessionStorage.setItem("alert_messages", res.alert_message);
          this.selectPatient(this.state.patientInfo);
          this.setChangeFlag(0);
        }
      })
      .catch(() => {})
      .finally(() => {
        this.double_click = false;
      });
  };
  register = async () => {
    if (this.state.patientInfo === "") {
      return;
    }
    if (this.state.instruction_doctor_number === 0) {
      return;
    }
    if (this.change_flag == 0) {
      return;
    }

    let error_str_array = this.checkValidation();
    if (error_str_array.length > 0 ) {
        this.setState({alert_message:error_str_array.join('\n')});
        return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message:
        this.state.number > 0 ? "変更しますか？" : "登録しますか？",
    });
  };

  addText = (item) => {
    if (item.label == "総合所見") {
      this.setState({
        general_opinion:
          this.state.general_opinion == ""
            ? item.body
            : this.state.general_opinion + "\n" + item.body,
      });
      this.setChangeFlag(1);
    }
  };
  
  openEditRegularTextModal = () => {
    if (this.regularTextData.length > 0) {
      this.setState({ openEditRegularTextModal: true });
    }
  };

  getRadio = (item, name, value) => {
    var temp;
    this.setChangeFlag(1);
    if (name == "guidance") {
      temp = this.state.check_guidances;
      temp[item] = value;
      this.setState({ check_guidances: temp });
    }
    if (name == "instruction") {
      temp = this.state.check_instructions;
      temp[item] = value;
      this.setState({ check_instructions: temp });
    }
  };

  getHistoryRadio = (name, value) => {
    if(name==="check"){
      this.setState({show_delete_record: value})
    }
  };

  getTall = (e) => {
    if (e == null || e== '' || parseFloat(e) < 0) {
      this.setState({ tall: '' });
      return;
    }
    var bmi;
    if (parseFloat(e) > 0 && this.state.weight > 0) {
      bmi = (100 * 100 * this.state.weight) / (parseFloat(e) * parseFloat(e));
      bmi = parseFloat(bmi).toFixed(2);
    } else {
      bmi = "";
    }
    this.setState({
      tall: parseFloat(e),
      bmi,
    });
    this.setChangeFlag(1);
  };

  getWeight = (e) => {
    if (e == null || e == '' || parseFloat(e) < 0) {
      this.setState({ weight: '' });
      return;
    }
    var bmi;
    var tall = this.state.tall;

    if (tall > 0 && parseFloat(e) > 0) {
      bmi = (100 * 100 * parseFloat(e)) / (tall * tall);
      bmi = parseFloat(bmi).toFixed(2);
    } else {
      bmi = "";
    }
    this.setState({
      weight: parseFloat(e),
      bmi,
    });
    this.setChangeFlag(1);
  };

  setInstructionValue = (index, e) => {
    var value = e.target.value;
    if (isNaN(parseFloat(value))) {
      value = 0;
    }
    var temp = this.state.instruction_content;
    temp[index].default = parseFloat(value);
    this.setState({ instruction_content: temp });
    this.setChangeFlag(1);
  };

  changeBackground = () => {  
    printValidate('dial_nutrition_guide', this.state, 'background');  
    // if (this.state.tall == "" || this.state.tall == null || this.state.tall == undefined || this.state.tall == 0) {
    //   addRequiredBg("tall_id");
    // } else {
    //   removeRequiredBg("tall_id");
    // }   
    // if (this.state.weight == "" || this.state.weight == null || this.state.weight == undefined || this.state.weight == 0) {
    //   addRequiredBg("weight_id");
    // } else {
    //   removeRequiredBg("weight_id");
    // }  
    // if (this.state.guidance_date == "" || this.state.guidance_date == null || this.state.guidance_date == undefined || this.state.guidance_date == 0) {
    //   addRequiredBg("guidance_date_id");
    // } else {
    //   removeRequiredBg("guidance_date_id");
    // }  
    // if (this.state.general_opinion == "" || this.state.general_opinion == null || this.state.general_opinion == undefined || this.state.general_opinion == 0) {
    //   addRequiredBg("general_opinion_id");
    // } else {
    //   removeRequiredBg("general_opinion_id");
    // }          
  }

  clearRedBorder = () => {
    removeRedBorder('tall_id');
    removeRedBorder('weight_id');
    removeRedBorder('guidance_date_id');    
    removeRedBorder('general_opinion_id');  
  }

  checkValidation = () => {
    this.clearRedBorder();

    let error_str_arr = [];
    let validate_data = printValidate('dial_nutrition_guide', this.state);        
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != '') {
      this.setState({first_tag_id: validate_data.first_tag_id});
    }
    return error_str_arr;
  }

  closeAlertModal = () => {
    this.setState({ alert_message: '' });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }

  contextMenuAction = (act, item) => {
    if(act == "history") {
      this.showHistory(item);
    }
  };

  showHistory = (_item) => {      
    this.getHistoryMedicalInfoDoc({
      number: _item.number,
      id: this.state.patientInfo.system_patient_id,
      arrNumbers: _item.history,
      item: _item
    });
  };

  getHistoryMedicalInfoDoc = async (params) => {
    const { data } = await axios.post("/app/api/v2/dial/find/history", {
      params: {
        patient_id: params.id,
        limit: 1000,
        offset: 0,
        type: "nutrition_guide",
        numbers: params.arrNumbers,
      }
    });
    // var resultData = Object.keys(data).map(i=>data[i]);
    var resultData = data;
    if(data.length < 1) {
      resultData = [];
      resultData.push(params.item);
    }

    var result = [];
    var nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    this.setState({
      historyNutritionGuideModal: true,
      selectedOrderNumber: params.number,
      historyList: result
    });
  };

  handleClick = (e, item) => {
    if (e.type === "contextmenu"){        
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
          that.setState({ contextMenu: { visible: false } });
          document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
          that.setState({
              contextMenu: { visible: false }
          });
          window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
          .getElementById("medical-info-table")
          .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                  contextMenu: { visible: false }
              });
              document
                  .getElementById("medical-info-table")
                  .removeEventListener(`scroll`, onScrollOutside);
          });
      this.setState({
          contextMenu: {
              visible: true,
              x: e.clientX - 200,
              y: e.clientY - 70,
              item: item,              
          },
      });
    }
  };

  getToolTip = () => {      
    this.setState({tooltip_msg : "削除済みのため変更できません。"});        
  }

  render() {
    let register_tooltip = "";
    if (this.state.patientInfo === "") {
      register_tooltip = "患者様を選択してください。";
    } else if (this.state.other_facility_number < 1) {
      register_tooltip = "医療機関名を選択してください。";
    } else if (this.state.instruction_doctor_number == 0) {
      register_tooltip = "医師名を選択してください。";
    } else if (this.change_flag == 0) {
      register_tooltip = "変更した内容がありません。";
    }
    let preview_tooltip = "";
    if (this.state.patientInfo === "") {
      preview_tooltip = "患者様を選択してください。";
    } else if (this.state.select_data === "") {
      preview_tooltip = "履歴を選択してください。";
    }
    let {
      disease_history_data,
      instruction_content,
      exam_table_data,
      // basic_data,
    } = this.state;
    var patientInfo = this.state.patientInfo;
    var in_hospital = "";
    if (patientInfo != undefined && patientInfo != null && patientInfo != "") {
      if (
        patientInfo.hospital_start_date != null &&
        patientInfo.hospital_start_date != ""
      ) {
        in_hospital = "入院";
      } else {
        in_hospital = "外来";
      }
    }
    var {blood_data} = this.state;
    let tooltip_msg = "削除済みのため変更できません。";

    return (
      <>
        <DialSideBar
          onGoto={this.selectPatient} 
          history = {this.props.history}
        />
        <DialPatientNav
           patientInfo={this.state.patientInfo}
           history = {this.props.history}
        />
        <Card>
          <Wrapper>
            <div className="title">栄養指導依頼書及び報告書</div>
            <div className="hp-100 content">
              <div className="left-area">
                <div className="history-header">
                  <div className="header-item header-item-left">
                    <InputWithLabel
                      label="入院／外来"
                      type="text"
                      isDisabled={true}
                      diseaseEditData={in_hospital}
                    />
                    <NumericInputWithUnitLabel
                      id="tall_id"
                      label="身長"
                      inputmode="numeric"
                      precision={1}
                      step={0.1}
                      min={0}
                      unit="cm"
                      value={this.state.tall}
                      getInputText={this.getTall}
                    />
                    <div style={{ display: "flex" }}>
                      <NumericInputWithUnitLabel
                        id="weight_id"
                        label="体重"
                        inputmode="numeric"
                        precision={1}
                        step={0.1}
                        min={0}
                        unit="kg"
                        value={this.state.weight}
                        getInputText={this.getWeight}
                      />
                      <div className="input-bmi">
                        <InputWithLabel
                          label="BMI"
                          type="text"
                          isDisabled={true}
                          diseaseEditData={this.state.bmi}
                        />
                      </div>
                    </div>
                    <div className="auto-width">
                      <InputWithLabel
                        label="職業"
                        type="text"
                        isDisabled={true}
                        diseaseEditData={patientInfo != undefined && patientInfo != null? this.job_codes[patientInfo.occupation]:''}
                      />
                    </div>
                    <div className="auto-width">
                      <InputWithLabel
                        label="透析開始日"
                        type="text"
                        // getInputText={this.getDialStartDate}
                        isDisabled={true}
                        diseaseEditData={patientInfo != undefined && patientInfo != null? formatJapanDate(patientInfo.dial_start_date):''}
                      />
                    </div>
                    <div className="auto-width">
                      <InputWithLabel
                        label="原疾患"
                        type="text"
                        isDisabled={true}
                        diseaseEditData={
                          patientInfo != null && patientInfo.primary_disease > 0
                            ? this.primary_disease_codes[
                                patientInfo.primary_disease
                              ]
                            : ""
                        }
                      />
                    </div>                    
                  </div>
                  <div className="header-item header-item-right">
                    <div
                      className="direct_man remove-x-input cursor-input"
                      onClick={(e)=>this.showDoctorList(e, "doctor").bind(this)}
                    >
                      <InputWithLabel
                        label="医師名"
                        type="text"
                        placeholder="クリックして選択"
                        isDisabled={true}
                        diseaseEditData={
                          this.state.instruction_doctor_number > 0 && this.state.doctor_list_by_number != undefined
                            ? this.state.doctor_list_by_number[
                                this.state.instruction_doctor_number
                              ]
                            : ""
                        }
                      />
                    </div>
                    <div
                      className="direct_man remove-x-input cursor-input"
                      onClick={(e)=>this.showDoctorList(e, "nutrit").bind(this)}
                    >
                      <InputWithLabel
                        label="依頼管理栄養士"
                        isDisabled={true}
                        type="text"
                        placeholder="クリックして選択"
                        diseaseEditData={
                          this.state.nutrition_doctor_number > 0 && this.state.staff_list_by_number != undefined
                            ? this.state.staff_list_by_number[
                                this.state.nutrition_doctor_number
                              ]
                            : ""
                        }
                      />
                    </div>
                    <InputWithLabel
                      label="作成日"
                      type="date"
                      getInputText={this.getDate.bind(this)}
                      diseaseEditData={this.state.write_date}
                    />
                  </div>
                </div>
                <div className="flex">
                  <div className="table-area left-table">
                    <div className="table-title">臨床検査値</div>
                    <table className="table-scroll table table-bordered">
                      <thead>
                        <tr>
                          <th style={{width:"6rem"}}>検査項目名</th>
                          <th style={{width:"4rem"}}>結果値</th>
                          <th style={{width:"3rem"}}>単位</th>
                          <th style={{width:"6rem"}}>検査項目名</th>
                          <th style={{width:"4rem"}}>結果値</th>
                          <th style={{width:"3rem"}}>単位</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exam_table_data != undefined &&
                          exam_table_data != null &&
                          exam_table_data.length > 0 &&
                          exam_table_data.map((item, index) => {
                            if (index % 2 == 0) {
                              var next_item = exam_table_data[index + 1];
                              return (
                                <>
                                  <tr>
                                    <td>{item.name}</td>
                                    <td>{item.value}</td>
                                    <td>{item.unit}</td>
                                    {next_item != undefined && (
                                      <>
                                        <td>{next_item.name}</td>
                                        <td>{next_item.value}</td>
                                        <td>{next_item.unit}</td>
                                      </>
                                    )}
                                    {next_item == undefined && (
                                      <>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                      </>
                                    )}
                                  </tr>
                                </>
                              );
                            }
                          })}
                        <tr>
                          <td>心胸比 </td>
                          <td colSpan={2}>{this.chest_ratio}</td>
                          <td>血圧</td>
                          <td colSpan={2}>
                            {blood_data != undefined && blood_data != null && blood_data != ""
                              ? blood_data.bp_pressure_max + "/" + blood_data.bp_pressure_min + "mmHg"
                              : ""}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="table-area right-table">
                    <div className="table-title">処方</div>
                    <div className="presc-area">
                      {displayLineBreak(renderHTML(this.state.cur_prescription))}
                    </div>
                  </div>
                </div>
                <div className="food-area flex">
                  <div className="food-table sub-left-area">
                    <div className="table-title">依頼内容</div>
                    <table className="table-scroll table table-bordered instruction-table">
                      <thead>
                        <tr>
                          <td>項目名</td>
                          <td>初期値</td>
                          <td>単位名</td>
                        </tr>
                      </thead>
                      <tbody>
                        {instruction_content != undefined &&
                          instruction_content != null &&
                          instruction_content.length > 0 &&
                          instruction_content.map((item, index) => {
                            return (
                              <>
                                <tr>
                                  <td>{item.label}</td>
                                  <td>
                                    <input
                                      className="input-right-text hankaku-eng-num-input"
                                      type="text"
                                      id={"input-id-"+index}
                                      value={item.default}
                                      onChange={this.setInstructionValue.bind(
                                        this,
                                        index
                                      )}
                                    ></input>
                                  </td>
                                  <td>{item.unit}</td>
                                </tr>
                              </>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  <div className="checkbox-area sub-right-area">
                    <div className="table-title">指示事項</div>
                    {instruction_items.map((item) => {
                      return (
                        <>
                          <Checkbox
                            label={item}
                            getRadio={this.getRadio.bind(this, item)}
                            value={this.state.check_instructions[item]}
                            name="instruction"
                          />
                        </>
                      );
                    })}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "1.5rem",
                    marginBottom: "15px",
                    marginTop: "15px",
                  }}
                >
                  指示報告
                </div>
                <div className="guidance-area">
                  <div className="sub-left-area">
                    <div className="date-labe">指導日</div>
                    <div className="flex">
                      <InputWithLabelBorder
                        id="guidance_date_id"
                        label=""
                        type="date"
                        getInputText={this.getGuidanceDate.bind(this)}
                        diseaseEditData={this.state.guidance_date}
                      />
                      <button onClick={this.clearGuidanceDate.bind(this)}>
                        クリア
                      </button>
                    </div>
                    <div className="date-labe">指導期間</div>
                    <div className="flex">
                      <DatePicker
                        locale="ja"
                        selected={this.state.start_date}
                        onChange={this.getStartDate.bind(this)}
                        onKeyDown = {this.startTimeKeyEvent}
                        onBlur = {this.setStartTime}
                        value = {this.state.start_date_value}
                        id = 'start_date_id'
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={10}
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                        timeCaption="時間"
                      />
                      <div className="pd-15">～</div>
                      <DatePicker
                        locale="ja"
                        selected={this.state.end_date}
                        onChange={this.getEnddate.bind(this)}
                        onKeyDown = {this.endTimeKeyEvent}
                        onBlur = {this.setEndTime}
                        value = {this.state.end_date_value}
                        id = 'end_date_id'
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={10}
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                        timeCaption="時間"
                      />
                      <button
                        style={{ marginTop: "0px" }}
                        onClick={this.clearStartEndDate.bind(this)}
                      >
                        クリア
                      </button>
                    </div>
                  </div>
                  <div className="sub-right-area checkbox-area">
                    <div className="table-title">指導事項</div>
                    {instruction_items.map((item) => {
                      return (
                        <>
                          <Checkbox
                            label={item}
                            getRadio={this.getRadio.bind(this, item)}
                            value={this.state.check_guidances[item]}
                            name="guidance"
                          />
                        </>
                      );
                    })}
                  </div>
                </div>

                <div className="main-info">
                  <div className="div-style1">
                    <div className="label-type1">総合所見</div>
                  </div>
                  <div className="disease-history">
                    <textarea
                      id="general_opinion_id"
                      onChange={this.setGeneralOpinon.bind(this)}
                      value={this.state.general_opinion}
                    />
                  </div>
                  <div className="div-style2">
                    {/* <Button type="mono" onClick={()=>this.fontSet()}>フォント大</Button> */}
                    {this.state.general_opinion_regular_text.length > 0 &&
                      this.state.general_opinion_regular_text.map((item) => {
                        return (
                          <>
                            {item.label == "総合所見" && (
                              <Button
                                type="mono"
                                onClick={() => this.addText(item)}
                              >
                                {item.title}
                              </Button>
                            )}
                          </>
                        );
                      })}
                  </div>
                </div>
              </div>
              <div className="right-area">
                <div className={"flex"}>
                  <div className="area-name">履歴一覧</div>
                  <div
                    className="delete-history clickable"
                    onClick={this.delete}
                  >
                    <Icon icon={faTrash} />
                    選択した履歴を削除
                  </div>
                </div>
                <div className="table-view" id="medical-info-table">
                  {disease_history_data !== undefined &&
                    disease_history_data !== null &&
                    disease_history_data.map((item, index) => {
                      let record_history = "";
                      if (item.history != null && item.history != undefined && item.history != "") {
                        let explode_count = item.history.split(",");
                        if (explode_count.length < 10 && explode_count.length > 1) {
                          record_history = "(0"+explode_count.length+"版)";
                        } else if(explode_count.length > 9) {
                          record_history = "("+explode_count.length+"版)";
                        }                            
                      }
                      if (this.state.show_delete_record == 1) {
                        if (item.is_enabled == 2) {                              
                          return (
                            <>
                              <OverlayTrigger
                                placement={"top"}
                                overlay={renderTooltip(tooltip_msg)}
                              >
                                <div
                                  className={
                                    this.state.number === item.number
                                      ? "history-item clickable selected border-bottom delete-record"
                                      : "history-item clickable border-bottom delete-record"
                                  }
                                  onContextMenu={e => this.handleClick(e,item)}                                  
                                >
                                  <div className="history-date">
                                    <div>
                                    {formatJapanDateSlash(item.write_date)}
                                    </div>
                                    <div>
                                      {record_history}
                                    </div>
                                  </div>
                                  {item.subject}
                                </div>
                              </OverlayTrigger>
                            </>
                          );
                        } else {
                          return (
                            <>
                              <div
                                className={
                                  this.state.number === item.number
                                    ? "history-item clickable selected border-bottom"
                                    : "history-item clickable border-bottom"
                                }
                                onContextMenu={e => this.handleClick(e,item)}
                                onClick={this.confirmSeleteHistory.bind(
                                  this,
                                  disease_history_data[index]
                                )}
                              >
                                <div className="history-date">
                                  <div>
                                  {formatJapanDateSlash(item.write_date)}
                                  </div>
                                  <div>
                                    {record_history}
                                  </div>
                                </div>
                                {item.subject}
                              </div>
                            </>
                          );
                        }
                      } else {
                        if (item.is_enabled == 1) {                              
                          return (
                            <>
                              <div
                                className={
                                  this.state.number === item.number
                                    ? "history-item clickable selected border-bottom"
                                    : "history-item clickable border-bottom"
                                }
                                onContextMenu={e => this.handleClick(e,item)}
                                onClick={this.confirmSeleteHistory.bind(
                                  this,
                                  disease_history_data[index]
                                )}
                              >
                                <div className="history-date">
                                  <div>
                                  {formatJapanDateSlash(item.write_date)}
                                  </div>
                                  <div>
                                    {record_history}
                                  </div>
                                </div>
                                {item.subject}
                              </div>
                            </>
                          );
                        }
                      }                      
                    })}
                </div>
                {this.context.$canDoAction(this.context.FEATURES.DIAL_SYSTEM, this.context.AUTHS.SHOW_DELETE,0) == true && (
                  <div className={"flex justify-content-style"} style={{lineHeight:"2rem"}}>                      
                    <div className="clickable">
                      <Checkbox
                        label="削除済みも表示"
                        getRadio={this.getHistoryRadio.bind(this)}
                        value={this.state.show_delete_record}
                        name="check"
                        checked={this.state.show_delete_record == 1}
                      />                        
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="footer-buttons mt-3">
              <Button className="red-btn" onClick={this.openEditRegularTextModal}>定型文設定</Button>
              <Button onClick={this.openPreviewModal} className={preview_tooltip != "" ? "disable-btn" : "red-btn"} tooltip={preview_tooltip}>帳票プレビュー</Button>
              <Button onClick={this.register} className={register_tooltip != "" ? "disable-btn" : "red-btn"} tooltip={register_tooltip}>{this.state.number ? "変更" : "登録"}</Button>
            </div>
          </Wrapper>
          {this.state.isOpenPreviewModal !== false && (
            <NutritionGuidePreviewModal
              closeModal={this.closeModal}
              data={this.state.select_data}
              patientInfo={this.state.patientInfo}
              blood_data = {this.state.blood_data}
              chest_ratio = {this.chest_ratio}
            />
          )}
          {this.state.isUpdateConfirmModal == true && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.updateData.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
          {this.state.isDeleteConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.deleteHistory.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
          {this.state.isShowDoctorList && (
            <DialSelectMasterModal
              selectMaster={this.selectDoctor}
              closeModal={this.closeModal}
              MasterCodeData={this.state.doctors}
              MasterName="医師"
            />
          )}

          {this.state.isShowNutrionDoctorList && (
            <DialSelectMasterModal
              selectMaster={this.selectNutrionDoctor}
              closeModal={this.closeModal}
              MasterCodeData={this.state.staffs}
              MasterName="スタッフ"
            />
          )}          
          {this.state.openEditRegularTextModal && (
            <EditRegularTextModal
              closeModal={this.closeModal}
              modal_data={this.regularTextData}
            />
          )}
          {this.state.alert_message != "" && (
              <ValidateAlertModal
                handleOk={this.closeAlertModal}
                alert_meassage={this.state.alert_message}
              />
            )}
          {this.state.isConfirmSelectHistory && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.selectHistory.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
          {this.state.historyNutritionGuideModal && (
            <ChangeNutritionGuildModal
              closeModal={this.closeModal}
              historySoapList={this.state.historyList}
              orderNumber={this.state.selectedOrderNumber}
              size="lg"
            />
          )}
          <ContextMenu
              {...this.state.contextMenu}
              parent={this}
          />
        </Card>
      </>
    );
  }
}

NutritionGuide.contextType = Context;
NutritionGuide.propTypes = {  
  history: PropTypes.object,
};
export default NutritionGuide;
