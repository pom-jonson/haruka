import React, { Component } from "react";
import * as methods from "./DialMethods";
import styled from "styled-components";
import { surface } from "../../_nano/colors";
import Button from "../../atoms/Button";
import * as apiClient from "~/api/apiClient";
import InputBoxTag from "../../molecules/InputBoxTag";
import DialSideBar from "./DialSideBar";
import DialPatientNav from "./DialPatientNav";
import {formatDateLine} from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import PropTypes from "prop-types";
import { addKeyEvent, registerElement } from "~/helpers/formControl";
import * as sessApi from "~/helpers/cacheSession-utils";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import {extract_enabled,makeList_data,addRedBorder, removeRedBorder, addRequiredBg, removeRequiredBg} from "~/helpers/dialConstants";

const Card = styled.div`
  padding: 20px;
  position: fixed;  
  top: 70px;
  width: calc(100% - 390px);
  left:200px;
  margin: 0px;
  height: calc(100% - 70px);  
  background-color: ${surface};
    button {
        margin-bottom: 10px;
        margin-left: 10px;
    }
    .title {
        font-size: 2rem;
        padding-left: 7px;
        border-left: solid 5px #69c8e1;
    }
    .others {
        position:absolute;
        right:1.25rem;
        button {
            margin-left: 0.2rem;
            margin-bottom: 0px;
            margin-top: 0.3rem;
        }
        span {
            font-size: 1rem;
        }
    }
    .disable-button {
      background: rgb(101, 114, 117);
		  cursor: auto;
    }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  height: calc(98vh - 8.5rem - 70px);
  padding: 1.25rem;
  margin-bottom: 0.5rem;
  overflow-y: auto;
  .flex {
    display: flex;
  }
  .hankaku-eng-num-input {
      ime-mode: inactive;
      input{
        ime-mode: inactive;
      }
  }
  label {
    font-size: 16px;
    margin-top: 6px;
  }
  .left-area {
    overflow-y:auto;
    width: 50%;
    margin-left: 17%;
    .label-title {
        text-align: right;
        margin-right: 8px;
        width: 180px;
        font-size: 16px;
        margin-top: 5px;
    }
    .pullbox-title {
      margin-top:0;
    }
    .pullbox-label {
      width:40%;
      select {
        width: 100%;
      }
      margin-top:0;
    }
  }
 
    .react-datepicker-wrapper {
        width:40%;
       .react-datepicker__input-container {
           width: 100%;
           input {
                width: 100%;
                font-size: 14px;
                height: 38px;
                border-radius: 4px;
                border-width: 1px;
                border-style: solid;
                border-color: rgb(206, 212, 218);
                border-image: initial;
                padding: 0px 8px;
           }
       } 
    }
  label {
      text-align: right;
  }
  .insurance_number{
    input {
        width:40%;
    }
  }
  .insurance_area1{
    input {
        width:40%;
    }
  }
  .input-card-area {
    padding-top: 0;

  }
  .insurance_area2{
    input {
        width:40%;
    }
  }
  .insurance_day{
    input {
        width:40%;
    }
    .input-box-area {
        margin-top:8px;
        label {
          margin-bottom:0;
        }
    }
    .right-box {
        float: left;
        label {
            width: 0px;
        }
        input {    
            margin-left: -8PX;
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
        }
    }
    .left-box {
        float: left;
        input {
            width: 100px;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
        }
    }
  }
  .insurance_area3{
    height: 55px;
     input {
        width: 5.7rem;
    }
    .right-box {
        float: left;
        label {
            width: 0px;
        }
        input {
            width:40%;
            margin-left: -8PX;
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
        }
    }
    .left-box {
        float: left;
        input { 
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
        }
    }
    div {
        float: left;
    }
  }
  
  .tall {
    margin-left: 5px;
    margin-top: 18px;
    float: left;
  }
  .day_area {
    margin-left: 42px;
      input {
        width:40%;
      }
      div {
        clear: both;
      }
  }
  .disabled-input{
      input{
        opacity: 0.7;
        background: lightgray!important;
      }
  }
 `;

class DialInsuranceBody extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        this.state = {
            table_number: "",
            insurer_number: "",
            symbol: "",
            bangou: "",
            publicly_funded_treatment_recipient_number_1: "",
            publicly_funded_treatment_recipient_number_2: "",
            public_expenditure_recipient_number_1: "",
            public_expenditure_recipient_number_2: "",
            insurance_category_code: 0,
            issue_date: "",
            comment: "",
            patient_burden_ratio: "",
            insurance_card_category_code: 0,
            system_patient_id:"",
            isUpdateConfirmModal: false,
            confirm_message:"",
            patientInfo:[],            
            isConfirmMoveOtherPage:false,
            alert_message:"",
            confirm_alert_title:''
        }
        this.registering_flag = false;
        this.formElements = {};
        this.change_flag = 0;
        this.sideBarRef = null;
        this.dial_insurance_validate = this.getPatientValidate().dial_insurance;
    }

    componentDidMount() {
        addKeyEvent(this);
        var insurer_number_id = document.getElementById('insurer_number_id');
        if (insurer_number_id !== undefined) {
            this.setCaretPosition(document.getElementById('insurer_number_id'),this.state.insurer_number.length);
        }
        if(this.props.patientInfo != undefined && this.props.patientInfo != null){
          this.selectPatient(this.props.patientInfo);
        }
        let code_master = sessApi.getObjectValue("dial_common_master","code_master");
        this.setState({
          insurance_category_list:makeList_data(extract_enabled(code_master['保険区分'])),
          insurance_card_category_codes:makeList_data(extract_enabled(code_master['保険証区分'])),
        })
    }    
    
    setCaretPosition =(elem, caretPos)=> {
        var range;
        if(elem != null) {
            if(elem.createTextRange) {
                range = elem.createTextRange();
                range.move('character', caretPos);
                range.select();
            } else {
                elem.focus();
                if(elem.selectionStart !== undefined) {
                    elem.setSelectionRange(caretPos, caretPos);
                }
            }
        }
    }
    setChangeFlag=(change_flag = 0)=>{
        this.change_flag = change_flag;
        if (change_flag == 1){          
          sessApi.setObjectValue('dial_change_flag', 'dial_insurance', 1);
        } else {          
          sessApi.remove('dial_change_flag');
        }
    }

    toHalfWidthOnlyNumber = (strVal) => {
        // 半角変換
        var halfVal = strVal.replace(/[０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 65248);
        });
        return halfVal;
    }

    getInsuranceNumber = e => {
        let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
        input_value = this.toHalfWidthOnlyNumber(input_value);
        if (this.state.insurer_number != input_value){
          this.setChangeFlag(1);
        } 
        if(input_value.length > this.dial_insurance_validate.insurer_number.length){
          return;
        }
        this.setState({insurer_number: input_value})
    };

    getSymbol = e => {
        let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
        input_value = this.toHalfWidthOnlyNumber(input_value);
        if (this.state.symbol != input_value){
          this.setChangeFlag(1);
        } 
        if(input_value.length > this.dial_insurance_validate.symbol.length){
          return;
        }
        this.setState({symbol:input_value});
    };
    getBangou = e => {
        let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
        input_value = this.toHalfWidthOnlyNumber(input_value);
        if (this.state.bangou != input_value){
          this.setChangeFlag(1);
        } 
        if(input_value.length > this.dial_insurance_validate.bangou.length){
          return;
        }
        this.setState({bangou: input_value});
    };

    dateClick = () => {
        if (this.state.patientInfo.length==0) {
            var obj = document.getElementsByClassName('react-datepicker-popper');
            if (obj != undefined && obj != null && obj.length>0){
                obj[0].style.display = 'none';                
            }
        }
    }
    
    getIssueDate = value => {
        if (this.state.patientInfo.length==0) {
            return;
        }
        if (this.state.issue_date != value){
          this.setChangeFlag(1);
        } 
        this.setState({issue_date: value})
    };

    getComment = e => {
        if (this.state.comment != e.target.value){
          this.setChangeFlag(1);
        } 
        this.setState({comment: e.target.value});
    };

    getPubliclyFundedTreatmentRecipientNumber1 = e => {
        let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
        input_value = this.toHalfWidthOnlyNumber(input_value);
        if (this.state.publicly_funded_treatment_recipient_number_1 != input_value){
          this.setChangeFlag(1);
        } 
        if(input_value.length > this.dial_insurance_validate.publicly_funded_treatment_recipient_number_1.length){
          return;
        }
        this.setState({publicly_funded_treatment_recipient_number_1:input_value});
    };

    getPubliclyFundedTreatmentRecipientNumber2 = e => {
        let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
        input_value = this.toHalfWidthOnlyNumber(input_value);
        if (this.state.publicly_funded_treatment_recipient_number_2 != input_value){
          this.setChangeFlag(1);
        } 
        if(input_value.length > this.dial_insurance_validate.publicly_funded_treatment_recipient_number_2.length){
          return;
        }
        this.setState({publicly_funded_treatment_recipient_number_2:input_value});
    };

    getPublicExpenditureRecipientNumber1 = e => {
        let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
        input_value = this.toHalfWidthOnlyNumber(input_value);
        if (this.state.public_expenditure_recipient_number_1 != input_value){
          this.setChangeFlag(1);
        } 
        if(input_value.length > this.dial_insurance_validate.public_expenditure_recipient_number_1.length){
          return;
        }
        this.setState({public_expenditure_recipient_number_1:input_value});
    };

    getPublicExpenditureRecipientNumber2 = e => {
        let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
        input_value = this.toHalfWidthOnlyNumber(input_value);
        if (this.state.public_expenditure_recipient_number_2 != input_value){
          this.setChangeFlag(1);
        } 
        if(input_value.length > this.dial_insurance_validate.public_expenditure_recipient_number_2.length){
          return;
        }
        this.setState({public_expenditure_recipient_number_2:input_value});
    };

    getInsuranceCategoryCode = e => {
        if(this.state.insurance_category_code != e.target.id){
          this.setChangeFlag(1);
        } 
        this.setState({insurance_category_code:e.target.id});
    };

    getPatientBurdenRatio = e => {
        let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
        input_value = this.toHalfWidthOnlyNumber(input_value);
        if(this.state.patient_burden_ratio != input_value){
          this.setChangeFlag(1);
        } 
        if(input_value.length > this.dial_insurance_validate.patient_burden_ratio.length){
          return;
        }
        this.setState({patient_burden_ratio:input_value});
    };

    getInsuranceCardCategoryCode = e => {
        if (this.state.insurance_card_category_code != e.target.id){
          this.setChangeFlag(1);
        } 
        this.setState({insurance_card_category_code:e.target.id});
    };

    registerInsurance = () => {
        this.confirmCancel();
        if(this.registering_flag){
            return;
        }
        let new_insurance = {
            number: this.state.table_number!=undefined?this.state.table_number:'',
            system_patient_id: this.state.system_patient_id,
            insurer_number: this.state.insurer_number,
            symbol: this.state.symbol,
            bangou: this.state.bangou,
            publicly_funded_treatment_recipient_number_1: this.state.publicly_funded_treatment_recipient_number_1,
            publicly_funded_treatment_recipient_number_2: this.state.publicly_funded_treatment_recipient_number_2,
            public_expenditure_recipient_number_1: this.state.public_expenditure_recipient_number_1,
            public_expenditure_recipient_number_2: this.state.public_expenditure_recipient_number_2,
            insurance_category_code: this.state.insurance_category_code,
            issue_date: this.state.issue_date != "" && this.state.issue_date != null && this.state.issue_date != undefined ? formatDateLine(this.state.issue_date) : "",
            comment:  this.state.comment,
            patient_burden_ratio: this.state.patient_burden_ratio,
            insurance_card_category_code: this.state.insurance_card_category_code,
        };

        let path = "/app/api/v2/dial/patient/registerInsurance";
        this.registering_flag = true;

        apiClient.post(path, {
            params: new_insurance
        }).then((res) => {
            if (res){
                window.sessionStorage.setItem("alert_messages", "登録完了##" + "保険情報を登録しました。");
                this.selectPatient(this.state.patientInfo );
                this.setChangeFlag(0);
            } else {
                window.sessionStorage.setItem("alert_messages", "項目を正確に入力してください。");
            }
        }).catch(() => {

        }).finally(()=>{
            this.registering_flag = false;
        });
    };
    
    componentDidUpdate () {
      this.changeBackground();
    }

    changeBackground = () => {
        if(this.dial_insurance_validate.insurer_number.is_required == 1 &&  this.state.insurer_number == ""){
          addRequiredBg("insurer_number_id");
        } else {
          removeRequiredBg("insurer_number_id");
        }
        if(this.dial_insurance_validate.symbol.is_required == 1 &&  this.state.symbol == ""){
          addRequiredBg("symbol_id");
        } else {
          removeRequiredBg("symbol_id");
        }

        if(this.dial_insurance_validate.bangou.is_required == 1 &&  this.state.bangou == ""){
          addRequiredBg("bangou_id");
        } else {
          removeRequiredBg("bangou_id");
        }

        if(this.dial_insurance_validate.publicly_funded_treatment_recipient_number_1.is_required == 1 &&  this.state.publicly_funded_treatment_recipient_number_1 == ""){
          addRequiredBg("publicly_funded_treatment_recipient_number_1_id");
        } else {
          removeRequiredBg("publicly_funded_treatment_recipient_number_1_id");
        }

        if(this.dial_insurance_validate.publicly_funded_treatment_recipient_number_2.is_required == 1 &&  this.state.publicly_funded_treatment_recipient_number_2 == ""){
          addRequiredBg("publicly_funded_treatment_recipient_number_2_id");
        } else {
          removeRequiredBg("publicly_funded_treatment_recipient_number_2_id");
        }

        if(this.dial_insurance_validate.public_expenditure_recipient_number_1.is_required == 1 &&  this.state.public_expenditure_recipient_number_1 == ""){
          addRequiredBg("public_expenditure_recipient_number_1_id");
        } else {
          removeRequiredBg("public_expenditure_recipient_number_1_id");
        }

        if(this.dial_insurance_validate.public_expenditure_recipient_number_2.is_required == 1 &&  this.state.public_expenditure_recipient_number_2 == ""){
          addRequiredBg("public_expenditure_recipient_number_2_id");
        } else {
          removeRequiredBg("public_expenditure_recipient_number_2_id");
        }

        if(this.dial_insurance_validate.insurance_category_code.is_required == 1 &&  this.state.insurance_category_code == 0){
          addRequiredBg("insurance_category_code_id");
        } else {
          removeRequiredBg("insurance_category_code_id");
        }

        if(this.dial_insurance_validate.issue_date.is_required == 1 &&  this.state.issue_date == ""){
          addRequiredBg("issue_date_id");
        } else {
          removeRequiredBg("issue_date_id");
        }

        if(this.dial_insurance_validate.comment.is_required == 1 &&  this.state.comment == ""){
          addRequiredBg("comment_id");
        } else {
          removeRequiredBg("comment_id");
        }

        if(this.dial_insurance_validate.patient_burden_ratio.is_required == 1 &&  this.state.patient_burden_ratio == ""){
          addRequiredBg("patient_burden_ratio_id");
        } else {
          removeRequiredBg("patient_burden_ratio_id");
        }

        if(this.dial_insurance_validate.insurance_card_category_code.is_required == 1 &&  this.state.insurance_card_category_code == 0){
          addRequiredBg("insurance_card_category_code_id");
        } else {
          removeRequiredBg("insurance_card_category_code_id");
        }
    }

    selectPatient = (patientInfo) => {
        this.setState({
            patientInfo: patientInfo,
            system_patient_id: patientInfo.system_patient_id,
            insurer_number:"",
            symbol:"",
            bangou:"",
            publicly_funded_treatment_recipient_number_1:"",
            publicly_funded_treatment_recipient_number_2:"",
            public_expenditure_recipient_number_1:"",
            public_expenditure_recipient_number_2:"",
            insurance_category_code:0,
            issue_date: "",
            comment: "",
            patient_burden_ratio: "",
            insurance_card_category_code: 0,
        }, () => {        
            this.setChangeFlag(0);
        });
        this.getInsuranceInfo(patientInfo.system_patient_id).then(()=>{
        });
        var insurer_number_id = document.getElementById('insurer_number_id');
        if (insurer_number_id !== undefined) {
            this.setCaretPosition(document.getElementById('insurer_number_id'),this.state.insurer_number.length);
        }
        removeRedBorder("insurer_number_id");
        removeRedBorder("symbol_id");
        removeRedBorder('bangou_id');
        removeRedBorder('publicly_funded_treatment_recipient_number_1_id');
        removeRedBorder('publicly_funded_treatment_recipient_number_2_id');
        removeRedBorder('public_expenditure_recipient_number_1_id');
        removeRedBorder('public_expenditure_recipient_number_2_id');
        removeRedBorder('insurance_category_code_id');
        removeRedBorder('issue_date_id');
        removeRedBorder('comment_id');
        removeRedBorder('patient_burden_ratio_id');
        removeRedBorder('insurance_card_category_code_id');
    };

    async getInsuranceInfo(system_patient_id){
        let path = "/app/api/v2/dial/patient/getInsuranceInfo";
        const post_data = {
            system_patient_id:system_patient_id
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
                        insurance_category_code: (res.insurance_category_code != undefined && res.insurance_category_code != null) ? res.insurance_category_code : 0,
                        issue_date: (res.issue_date != null && res.issue_date != undefined) ? new Date(res.issue_date) : "",
                        comment:  (res.comment != undefined && res.comment != null) ? res.comment : "",
                        patient_burden_ratio:  (res.patient_burden_ratio != undefined && res.patient_burden_ratio != null) ? res.patient_burden_ratio : "",
                        insurance_card_category_code:  (res.insurance_card_category_code != undefined && res.insurance_card_category_code != null) ? res.insurance_card_category_code : 0,
                    });
                }
            })
            .catch(() => {

            });
    }

    updateData = () => {
        if (!(this.state.system_patient_id>0)){
            window.sessionStorage.setItem("alert_messages", '患者様を選択してください。');
            return;
        }
        this.registerInsurance();
    }

    register = () => {
        if (this.state.patientInfo.length==0 || this.change_flag == 0){
          return;
        } 
        let error_str_array = this.checkValidation();
        if (error_str_array.length > 0 ) {
            this.setState({alert_message:error_str_array.join('\n')});
            return;
        }
        this.setState({
            isUpdateConfirmModal:true,
            confirm_message:"内容を保存しますか？",
            confirm_alert_title:'保存確認',
        });
    };

    checkValidation = () => {        
        let error_str_arr = [];
        let error_arr = [];
        removeRedBorder("insurer_number_id");
        removeRedBorder("symbol_id");
        removeRedBorder('bangou_id');
        removeRedBorder('publicly_funded_treatment_recipient_number_1_id');
        removeRedBorder('publicly_funded_treatment_recipient_number_2_id');
        removeRedBorder('public_expenditure_recipient_number_1_id');
        removeRedBorder('public_expenditure_recipient_number_2_id');
        removeRedBorder('insurance_category_code_id');
        removeRedBorder('issue_date_id');
        removeRedBorder('comment_id');
        removeRedBorder('patient_burden_ratio_id');
        removeRedBorder('insurance_card_category_code_id');

        if(this.dial_insurance_validate.insurer_number.is_required == 1 &&  this.state.insurer_number == ""){
          error_str_arr.push(this.dial_insurance_validate.insurer_number.requierd_message);
          error_arr.push({
            tag_id:'insurer_number_id'
          });
          addRedBorder("insurer_number_id");
        } else if(this.state.insurer_number.length > this.dial_insurance_validate.insurer_number.length){
          error_str_arr.push(this.dial_insurance_validate.insurer_number.overflow_message);
          error_arr.push({
            tag_id:'insurer_number_id'
          });
          addRedBorder("insurer_number_id");
        }

        if(this.dial_insurance_validate.symbol.is_required == 1 &&  this.state.symbol == ""){
          error_str_arr.push(this.dial_insurance_validate.symbol.requierd_message);
          error_arr.push({
            tag_id:'symbol_id'
          });
          addRedBorder("symbol_id");
        } else if(this.state.symbol.length > this.dial_insurance_validate.symbol.length){
          error_str_arr.push(this.dial_insurance_validate.symbol.overflow_message);
          error_arr.push({
            tag_id:'symbol_id'
          });
          addRedBorder("symbol_id");
        }

        if(this.dial_insurance_validate.bangou.is_required == 1 &&  this.state.bangou == ""){
          error_str_arr.push(this.dial_insurance_validate.bangou.requierd_message);
          error_arr.push({
            tag_id:'bangou_id'
          });
          addRedBorder("bangou_id");
        } else if(this.state.bangou.length > this.dial_insurance_validate.bangou.length){
          error_str_arr.push(this.dial_insurance_validate.bangou.overflow_message);
          error_arr.push({
            tag_id:'bangou_id'
          });
          addRedBorder("bangou_id");
        }

        if(this.dial_insurance_validate.publicly_funded_treatment_recipient_number_1.is_required == 1 &&  this.state.publicly_funded_treatment_recipient_number_1 == ""){
          error_str_arr.push(this.dial_insurance_validate.publicly_funded_treatment_recipient_number_1.requierd_message);
          error_arr.push({
            tag_id:'publicly_funded_treatment_recipient_number_1_id'
          });
          addRedBorder("publicly_funded_treatment_recipient_number_1_id");
        } else if(this.state.publicly_funded_treatment_recipient_number_1.length > this.dial_insurance_validate.publicly_funded_treatment_recipient_number_1.length){
          error_str_arr.push(this.dial_insurance_validate.publicly_funded_treatment_recipient_number_1.overflow_message);
          error_arr.push({
            tag_id:'publicly_funded_treatment_recipient_number_1_id'
          });
          addRedBorder("publicly_funded_treatment_recipient_number_1_id");
        }

        if(this.dial_insurance_validate.publicly_funded_treatment_recipient_number_2.is_required == 1 &&  this.state.publicly_funded_treatment_recipient_number_2 == ""){
          error_str_arr.push(this.dial_insurance_validate.publicly_funded_treatment_recipient_number_2.requierd_message);
          error_arr.push({
            tag_id:'publicly_funded_treatment_recipient_number_2_id'
          });
          addRedBorder("publicly_funded_treatment_recipient_number_2_id");
        } else if(this.state.publicly_funded_treatment_recipient_number_2.length > this.dial_insurance_validate.publicly_funded_treatment_recipient_number_2.length){
          error_str_arr.push(this.dial_insurance_validate.publicly_funded_treatment_recipient_number_2.overflow_message);
          error_arr.push({
            tag_id:'publicly_funded_treatment_recipient_number_2_id'
          });
          addRedBorder("publicly_funded_treatment_recipient_number_2_id");
        }

        if(this.dial_insurance_validate.public_expenditure_recipient_number_1.is_required == 1 &&  this.state.public_expenditure_recipient_number_1 == ""){
          error_str_arr.push(this.dial_insurance_validate.public_expenditure_recipient_number_1.requierd_message);
          error_arr.push({
            tag_id:'public_expenditure_recipient_number_1_id'
          });
          addRedBorder("public_expenditure_recipient_number_1_id");
        } else if(this.state.public_expenditure_recipient_number_1.length > this.dial_insurance_validate.public_expenditure_recipient_number_1.length){
          error_str_arr.push(this.dial_insurance_validate.public_expenditure_recipient_number_1.overflow_message);
          error_arr.push({
            tag_id:'public_expenditure_recipient_number_1_id'
          });
          addRedBorder("public_expenditure_recipient_number_1_id");
        }

        if(this.dial_insurance_validate.public_expenditure_recipient_number_2.is_required == 1 &&  this.state.public_expenditure_recipient_number_2 == ""){
          error_str_arr.push(this.dial_insurance_validate.public_expenditure_recipient_number_2.requierd_message);
          error_arr.push({
            tag_id:'public_expenditure_recipient_number_2_id'
          });
          addRedBorder("public_expenditure_recipient_number_2_id");
        } else if(this.state.public_expenditure_recipient_number_2.length > this.dial_insurance_validate.public_expenditure_recipient_number_2.length){
          error_str_arr.push(this.dial_insurance_validate.public_expenditure_recipient_number_2.overflow_message);
          error_arr.push({
            tag_id:'public_expenditure_recipient_number_2_id'
          });
          addRedBorder("public_expenditure_recipient_number_2_id");
        }

        if(this.dial_insurance_validate.insurance_category_code.is_required == 1 &&  this.state.insurance_category_code == 0){
          error_str_arr.push(this.dial_insurance_validate.insurance_category_code.requierd_message);
          error_arr.push({
            tag_id:'insurance_category_code_id'
          });
          addRedBorder("insurance_category_code_id");
        }

        if(this.dial_insurance_validate.issue_date.is_required == 1 &&  this.state.issue_date == ""){
          error_str_arr.push(this.dial_insurance_validate.issue_date.requierd_message);
          error_arr.push({
            tag_id:'issue_date_id'
          });
          addRedBorder("issue_date_id");
        }

        if(this.dial_insurance_validate.comment.is_required == 1 &&  this.state.comment == ""){
          error_str_arr.push(this.dial_insurance_validate.comment.requierd_message);
          error_arr.push({
            tag_id:'comment_id'
          });
          addRedBorder("comment_id");
        } else if(this.state.comment.length > this.dial_insurance_validate.comment.length){
          error_str_arr.push(this.dial_insurance_validate.comment.overflow_message);
          error_arr.push({
            tag_id:'comment_id'
          });
          addRedBorder("comment_id");
        }

        if(this.dial_insurance_validate.patient_burden_ratio.is_required == 1 &&  this.state.patient_burden_ratio == ""){
          error_str_arr.push(this.dial_insurance_validate.patient_burden_ratio.requierd_message);
          error_arr.push({
            tag_id:'patient_burden_ratio_id'
          });
          addRedBorder("patient_burden_ratio_id");
        } else if(this.state.patient_burden_ratio.length > this.dial_insurance_validate.patient_burden_ratio.length){
          error_str_arr.push(this.dial_insurance_validate.patient_burden_ratio.overflow_message);
          error_arr.push({
            tag_id:'patient_burden_ratio_id'
          });
          addRedBorder("patient_burden_ratio_id");
        }

        if(this.dial_insurance_validate.insurance_card_category_code.is_required == 1 &&  this.state.insurance_card_category_code == 0){
          error_str_arr.push(this.dial_insurance_validate.insurance_card_category_code.requierd_message);
          error_arr.push({
            tag_id:'insurance_card_category_code_id'
          });
          addRedBorder("insurance_card_category_code_id");
        }

        this.setState({error_arr});
        return error_str_arr;
    }

    confirmCancel() {
        this.setState({
            isUpdateConfirmModal: false,            
            isConfirmMoveOtherPage:false,
            new_patient:null,
            confirm_message: "",
            confirm_alert_title:'',
        });
    }

    goOtherPage = (url) => {
        this.go_otherUrl = url;
        if (this.change_flag === 1){
            this.setState({
              isConfirmMoveOtherPage:true,
              confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
              confirm_alert_title:'入力中'
            })      
        } else {
            if (this.props.type != undefined && this.props.type == "page"){
                this.props.history.replace(url);
            } else {
                this.props.goOtherPage(url);
            }
        }
    }

    moveOtherPage = () => {
        if (this.props.type != undefined && this.props.type == "page"){
            this.props.history.replace(this.go_otherUrl);
        } else {
            this.props.goOtherPage(this.go_otherUrl);
        }
    }

    closeAlertModal = () => {
      this.setState({alert_message: ''});
      if(this.state.error_arr.length > 0){
        let first_obj = this.state.error_arr[0];
        $("#" + first_obj.tag_id).focus();
      }
    }

    render() {
        let {type} = this.props;
        let { insurance_category_list, insurance_card_category_codes, patientInfo } = this.state;
        
        return (
            <>
                {type != undefined && type == "page" && (<>
                    <DialSideBar
                        onGoto={this.selectPatient}
                        ref = {ref => this.sideBarRef = ref}
                        history = {this.props.history}
                    />
                    <DialPatientNav
                        patientInfo={this.state.patientInfo}
                        history = {this.props.history}
                    />
                </>)}
                <Card className={type=="modal"?"modal_card insurance-modal":""}>
                    <div className='flex'>
                        <div className="title">保険情報</div>
                        <div className='others'>
                            <Button onClick={this.goOtherPage.bind(this,"/dial/dial_patient?from_other=1")}>透析患者マスタ</Button>
                            <Button className="disable-button">保険情報</Button>
                            <Button onClick={this.goOtherPage.bind(this,"/dial/dial_emergency")}>緊急連絡先</Button>
                            <Button onClick={this.goOtherPage.bind(this,"/dial/dial_family")}>家族歴</Button>                 
                        </div>
                    </div>
                    <Wrapper className={type=="modal"?"insurance-modal-wrapper":""}>
                        <div className={'left-area'}>
                            <div className="insurance_number hankaku-eng-num-input">
                                <InputBoxTag
                                    label="保険者番号"
                                    type="text"
                                    id="insurer_number_id"
                                    getInputText={this.getInsuranceNumber.bind(this)}
                                    value={this.state.insurer_number}
                                    isDisabled = {patientInfo.length==0?true:false}
                                    className={patientInfo.length==0?"disabled-general": ""}
                                    myref={e => {
                                        registerElement(this, e, 1)
                                    }}
                                />
                                <InputBoxTag
                                    label="記号"
                                    type="text"
                                    id="symbol_id"
                                    getInputText={this.getSymbol.bind(this)}
                                    value={this.state.symbol}
                                    isDisabled = {patientInfo.length==0?true:false}
                                    className={patientInfo.length==0?"disabled-general": ""}
                                    myref={e => {
                                        registerElement(this, e, 2)
                                    }}
                                />
                                <InputBoxTag
                                    label="番号"
                                    type="text"
                                    id="bangou_id"
                                    getInputText={this.getBangou.bind(this)}
                                    value={this.state.bangou}
                                    isDisabled = {patientInfo.length==0?true:false}
                                    className={patientInfo.length==0?"disabled-general": ""}
                                    myref={e => {
                                        registerElement(this, e, 3)
                                    }}
                                />
                            </div>

                            <div className="insurance_area1 hankaku-eng-num-input">
                                <InputBoxTag
                                    label="公費負担者番号I"
                                    type="text"
                                    id="publicly_funded_treatment_recipient_number_1_id"
                                    getInputText={this.getPubliclyFundedTreatmentRecipientNumber1.bind(this)}
                                    value={this.state.publicly_funded_treatment_recipient_number_1}
                                    isDisabled = {patientInfo.length==0?true:false}
                                    className={patientInfo.length==0?"disabled-general": ""}
                                    myref={e => {
                                        registerElement(this, e, 4)
                                    }}
                                />
                                <InputBoxTag
                                    label="公費負担者番号II"
                                    type="text"
                                    id="publicly_funded_treatment_recipient_number_2_id"
                                    getInputText={this.getPubliclyFundedTreatmentRecipientNumber2.bind(this)}
                                    value={this.state.publicly_funded_treatment_recipient_number_2}
                                    isDisabled = {patientInfo.length==0?true:false}
                                    className={patientInfo.length==0?"disabled-general": ""}
                                    myref={e => {
                                        registerElement(this, e, 5)
                                    }}
                                />
                            </div>

                            <div className="insurance_area2 hankaku-eng-num-input">
                                <InputBoxTag
                                    label="公費受給者番号I"
                                    type="text"
                                    id="public_expenditure_recipient_number_1_id"
                                    getInputText={this.getPublicExpenditureRecipientNumber1.bind(this)}
                                    value={this.state.public_expenditure_recipient_number_1}
                                    isDisabled = {patientInfo.length==0?true:false}
                                    className={patientInfo.length==0?"disabled-general": ""}
                                    myref={e => {
                                        registerElement(this, e, 6)
                                    }}
                                />
                                <InputBoxTag
                                    label="公費受給者番号II"
                                    type="text"
                                    id="public_expenditure_recipient_number_2_id"
                                    getInputText={this.getPublicExpenditureRecipientNumber2.bind(this)}
                                    value={this.state.public_expenditure_recipient_number_2}
                                    isDisabled = {patientInfo.length==0?true:false}
                                    className={patientInfo.length==0?"disabled-general": ""}
                                    myref={e => {
                                        registerElement(this, e, 7)
                                    }}
                                />
                            </div>
                            <div className="insurance_day">
                                <div className="input-box-area">
                                    <SelectorWithLabel
                                        options={insurance_category_list}
                                        title="保険区分"
                                        id="insurance_category_code_id"
                                        getSelect={this.getInsuranceCategoryCode.bind(this)}
                                        departmentEditCode={this.state.insurance_category_code}
                                        isDisabled = {patientInfo.length==0?true:false}
                                        className={patientInfo.length==0?"disabled-general": ""}
                                        myref={e => {
                                            registerElement(this, e, 8)
                                        }}
                                    />
                                </div>
                                <div className={patientInfo.length==0?"disabled-input": ""} onClick={this.dateClick.bind(this)}>
                                    <InputBoxTag
                                        label="交付年月日"
                                        type="date"
                                        id="issue_date_id"
                                        getInputText={this.getIssueDate.bind(this)}
                                        value={this.state.issue_date}
                                        isDisabled = {patientInfo.length==0?true:false}
                                        className={patientInfo.length==0?"disabled-general": ""}
                                        noTodayButton={true}
                                        // myref={e => {
                                            // registerElement(this, e, 9)
                                        // }}
                                    />
                                </div>
                                
                                <InputBoxTag
                                    label="コメント"
                                    type="text"
                                    id="comment_id"
                                    placeholder="コメント入力"
                                    getInputText={this.getComment.bind(this)}
                                    value={this.state.comment}
                                    isDisabled = {patientInfo.length==0?true:false}
                                    className={patientInfo.length==0?"disabled-general": ""}
                                    myref={e => {
                                        registerElement(this, e, 9)
                                    }}
                                />
                            </div>

                            <div className="insurance_area3 hankaku-eng-num-input">
                                <InputBoxTag
                                    label="患者負担割合"
                                    type="text"
                                    id="patient_burden_ratio_id"
                                    getInputText={this.getPatientBurdenRatio.bind(this)}
                                    value={this.state.patient_burden_ratio}
                                    isDisabled = {patientInfo.length==0?true:false}
                                    className={patientInfo.length==0?"disabled-general": ""}
                                    myref={e => {
                                        registerElement(this, e, 10)
                                    }}
                                />
                                <span className="tall">割</span>
                            </div>
                            <div className="input-card-area">
                                <SelectorWithLabel
                                    options={insurance_card_category_codes}
                                    title="保険証区分"
                                    id="insurance_card_category_code_id"
                                    getSelect={this.getInsuranceCardCategoryCode.bind(this)}
                                    departmentEditCode={this.state.insurance_card_category_code}
                                    isDisabled = {patientInfo.length==0?true:false}
                                    className={patientInfo.length==0?"disabled-general": ""}
                                    myref={e => {
                                        registerElement(this, e, 11)
                                    }}
                                />
                            </div>
                        </div>
                    </Wrapper>
                    <div className="footer-buttons">
                      {type != undefined && type == "modal" && (
                        <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                      )}
                        <Button onClick={this.register}  className={`${(patientInfo.length==0 || this.change_flag == 0)?"disable-btn": "red-btn"}`}>{this.state.table_number === "" ? "登録" : "変更"}</Button>
                    </div>
                    {this.state.isUpdateConfirmModal !== false && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.updateData.bind(this)}
                            confirmTitle= {this.state.confirm_message}
                        />
                    )}                    
                    {this.state.isConfirmMoveOtherPage !== false && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.moveOtherPage.bind(this)}
                            confirmTitle= {this.state.confirm_message}
                            title = {this.state.confirm_alert_title}
                        />
                    )}
                    {this.state.alert_message != "" && (
                      <ValidateAlertModal
                        handleOk={this.closeAlertModal}
                        alert_meassage={this.state.alert_message}
                      />
                    )}
                </Card>
                </>
        )
    }
}

DialInsuranceBody.propTypes = {
    closeModal: PropTypes.func,
    history: PropTypes.object,
    goOtherPage: PropTypes.func,
    patientInfo: PropTypes.object,
    type:PropTypes.string
};

export default DialInsuranceBody