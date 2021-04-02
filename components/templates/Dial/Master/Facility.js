import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "../../../_nano/colors";
import Button from "../../../atoms/Button";
import * as apiClient from "~/api/apiClient";

import InputWithLabel from "../../../molecules/InputWithLabel";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import axios from "axios";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { getMasterValidate } from "~/components/templates/Dial/DialMethods";
import * as sessApi from "~/helpers/cacheSession-utils";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import Context from "~/helpers/configureStore";

import { masterValidate } from "~/helpers/validate";
import {
  toHalfWidthOnlyNumber,
  removeRedBorder,
  // addRequiredBg,
  // removeRequiredBg,
} from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  .footer {
    margin-top: 10px;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
    }

    span {
      color: white;
      font-size: 1.25rem;
      font-weight: 100;
    }
  }
  .title {
    margin-left: 20px;
    margin-top: 2vh;
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .selected {
    background-color: lightgray;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  display: -webkit-flex;
  -webkit-flex-wrap: wrap;
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  padding: 0px;  
  margin-bottom:5px;
  height: calc(100vh - 9rem);
  input {
    border-radius: 0px;
  }
  div {
    margin-top: -1px;
  }
  label {
      text-align: right;
  }
  .facility-form {
    padding-top:5px;
    width: 80%;    
  }
    .react-datepicker-wrapper {
        width: 100%;
       .react-datepicker__input-container {
           width: 100%;
           input {
                font-size: 1rem;
                width: 100%;
                height: 2.4rem;
                border-radius: 4px;
                border-width: 1px;
                border-style: solid;
                border-color: rgb(206, 212, 218);
                border-image: initial;
                padding: 0px 0.5rem;
           }
       } 
    }
  }
  .label-title{
    font-size:1rem;
  }
  .facility_code {
    input {
        width: 200px;
    }
    display: -webkit-flex;
    -webkit-flex-wrap: wrap;
    display: flex;
    flex-wrap: wrap;
  }
  .facility_corporate{
    padding-top: 1.2rem;
    input {
        width: 706px;
    }
  }
  .facility_doctor{
    padding-top: 1rem;
    input {
        width: 250px;
    }
    display: -webkit-flex;
    -webkit-flex-wrap: wrap;
    display: flex;
    flex-wrap: wrap;
  }
  .facility_address{
    padding-top: 1.2rem;
    input {
        width: 710px;
    }
    .zipcode input {
        width: 250px;
    }
  }
  .facility_tel{
    padding-top: 1rem;
    input {
        width: 250px;
    }
    display: -webkit-flex;
    -webkit-flex-wrap: wrap;
    display: flex;
    flex-wrap: wrap;
  }
  .facility_day{
    padding-top: 1.2rem;
     input {
        width: 250px;
    }
    display: -webkit-flex;
    -webkit-flex-wrap: wrap;
    display: flex;
    flex-wrap: wrap;
  }
  .facility_Prefecture{
    padding-top: 1rem;
     input {
        width: 250px;
    }
    display: -webkit-flex;
    -webkit-flex-wrap: wrap;
    display: flex;
    flex-wrap: wrap;
  }
  .facility_Hospital{
    padding-top: 1rem;
     input {
        width: 250px;
    }
    display: -webkit-flex;
    -webkit-flex-wrap: wrap;
    display: flex;
    flex-wrap: wrap;
  }  
  .tall {
    margin-left: 5px;
    margin-top: 8px;
  }
  .day_area {
    margin-left: 42px;
      input {
          width: 300px!important;
      }
      div {
        clear: both;
      }
  }
  .right-area{
    margin-left:17px;
  }
  .has-unit {
    display: -webkit-flex;
    -webkit-flex-wrap: wrap;
    display: flex;
    flex-wrap: wrap;
    .pullbox-title{
        text-align:right;
        width:180px;
        margin-right:0.5rem;
    }
    .pullbox-label, .pullbox-select{
      width:235px;
    }
    input{
      width:233px;
    }
  }  
  .pl-18 {
      padding-left: 18px;
  }
 `;

class DialMasterFacility extends Component {
  constructor(props) {
    super(props);
    let list_facility = [];
    let display_facility_info = {};
    let months_list = [];
    let years_list = [];
    this.state = {
      list_facility,
      display_facility_info,
      selected_index: 0,
      months_list,
      years_list,

      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
      change_flag: 0,
      alert_message: "",
    };

    var current_year = new Date().getFullYear();
    var tmp = {};
    for (var i = 1970; i <= current_year; i++) {
      tmp = { id: i, value: i };
      years_list.push(tmp);
    }
    years_list.reverse();
    for (i = 1; i <= 12; i++) {
      tmp = { id: i, value: i };
      months_list.push(tmp);
    }

    this.facility_validate_data = sessApi.getObjectValue('init_status', 'dial_master_validate');
    this.facility_validate_data = this.facility_validate_data.dial_institution_master;    
  }

  componentDidMount() {
    this.setChangeFlag(0);
    this.changeBackground();
  }

  componentDidUpdate() {
    this.changeBackground();
  }

  changeBackground = () => {
    masterValidate("dial_institution_master", this.state.display_facility_info, 'background');    
  };

  checkValidation = () => {
    removeRedBorder("code_id");
    removeRedBorder("ccorporation_name_id");
    removeRedBorder("medical_institution_name_id");
    removeRedBorder("medical_institution_name_kana_id");
    removeRedBorder("view_name_id");
    removeRedBorder("representative_name_id");
    removeRedBorder("doctor_name_id");
    removeRedBorder("zip_code_id");
    removeRedBorder("address_1_id");
    removeRedBorder("address_2_id");
    removeRedBorder("phone_number_id");
    removeRedBorder("fax_number_id");
    removeRedBorder("number_of_consoles_id");
    removeRedBorder("prefectures_number_id");
    removeRedBorder("point_table_number_id");
    removeRedBorder("medical_institution_code_id");
    removeRedBorder("treatment_type_code_id");
    let error_str_arr = [];
    let validate_data = masterValidate(
      "dial_institution_master",
      this.state.display_facility_info
    );
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != "") {
      this.setState({ first_tag_id: validate_data.first_tag_id });
    }
    return error_str_arr;
  };

  closeAlertModal = () => {
    this.setState({ alert_message: "" });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };
  
  componentWillUnmount() {
    sessApi.remove("dial_change_flag");
  }

  async UNSAFE_componentWillMount() {
    this.searchFacility();
  }

  setChangeFlag = (change_flag) => {
    this.setState({ change_flag });
    if (change_flag) {
      sessApi.setObjectValue("dial_change_flag", "facility_data", 1);
    } else {
      sessApi.remove("dial_change_flag");
    }
  };

  searchFacility = async () => {
    let path = "/app/api/v2/dial/master/facility_search";
    let post_data = {};
    let { data } = await axios.post(path, { params: post_data });
    if (data != null && data != "") {
      this.setState({ list_facility: data });
      this.setState({
        display_facility_info: this.state.list_facility[
          this.state.selected_index
        ],
      });
    } else {
      this.setState({ list_facility: null });
      this.setState({ display_facility_info: null });
    }
  };

  updateFacility = async () => {
    let path = "/app/api/v2/dial/master/facility_register";
    let post_data = {};
    if (this.state.display_facility_info == null) {
      post_data = { number: 0 };
    } else {
      post_data = {
        number: this.state.display_facility_info.number,
        code: this.state.display_facility_info.code,
        ccorporation_name: this.state.display_facility_info.ccorporation_name,
        medical_institution_name: this.state.display_facility_info
          .medical_institution_name,
        medical_institution_name_kana: this.state.display_facility_info
          .medical_institution_name_kana,
        view_name: this.state.display_facility_info.view_name,
        representative_name: this.state.display_facility_info
          .representative_name,
        doctor_name: this.state.display_facility_info.doctor_name,
        zip_code: this.state.display_facility_info.zip_code,
        address_1: this.state.display_facility_info.address_1,
        address_2: this.state.display_facility_info.address_2,
        phone_number: this.state.display_facility_info.phone_number,
        fax_number: this.state.display_facility_info.fax_number,
        dialysis_start_year: this.state.display_facility_info
          .dialysis_start_year,
        dialysis_start_month: this.state.display_facility_info
          .dialysis_start_month,
        number_of_concurrent_dialysis: this.state.display_facility_info
          .number_of_concurrent_dialysis,
        maximum_capacity: this.state.display_facility_info.maximum_capacity,
        number_of_consoles: this.state.display_facility_info.number_of_consoles,
        prefectures_number: this.state.display_facility_info.prefectures_number,
        point_table_number: this.state.display_facility_info.point_table_number,
        medical_institution_code: this.state.display_facility_info
          .medical_institution_code,
        treatment_type_code: this.state.display_facility_info
          .treatment_type_code,
      };
    }

    await apiClient
      ._post(path, { params: post_data })
      .then((res) => {
        if (res) {
          this.confirmCancel();
          var title = "";
          var message = res.alert_message;
          if (message.indexOf("変更") > -1) title = "変更完了##";
          if (message.indexOf("登録") > -1) title = "登録完了##";
          window.sessionStorage.setItem(
            "alert_messages",
            title + res.alert_message
          );
          this.setChangeFlag(0);
        }
      })
      .catch(() => {
        this.confirmCancel();
        window.sessionStorage.setItem("alert_messages", "変更が失敗しました。");
      });
  };

  showFacilityinfo = (facility, index) => {
    this.setState({
      display_facility_info: facility,
      selected_index: index,
    });
  };

  getFacilityCode = (e) => {
    this.setChangeFlag(1);
    var tmp = this.state.display_facility_info;
    tmp.code = e.target.value;
    this.setState({ display_facility_info: tmp });
  };
  getFacilityCorporate = (e) => {
    this.setChangeFlag(1);
    var tmp = this.state.display_facility_info;
    tmp.ccorporation_name = e.target.value;
    this.setState({ display_facility_info: tmp });
  };
  getFacilityName = (e) => {
    this.setChangeFlag(1);
    var tmp = this.state.display_facility_info;
    tmp.medical_institution_name = e.target.value;
    this.setState({ display_facility_info: tmp });
  };
  getFacilityKanaName = (e) => {
    this.setChangeFlag(1);
    var tmp = this.state.display_facility_info;
    tmp.medical_institution_name_kana = e.target.value;
    this.setState({ display_facility_info: tmp });
  };
  getFacilitySystemName = (e) => {
    this.setChangeFlag(1);
    var tmp = this.state.display_facility_info;
    tmp.view_name = e.target.value;
    this.setState({ display_facility_info: tmp });
  };
  getFacilityRepresentativeName = (e) => {
    this.setChangeFlag(1);
    var tmp = this.state.display_facility_info;
    tmp.representative_name = e.target.value;
    this.setState({ display_facility_info: tmp });
  };
  getFacilityDoctorName = (e) => {
    this.setChangeFlag(1);
    var tmp = this.state.display_facility_info;
    tmp.doctor_name = e.target.value;
    this.setState({ display_facility_info: tmp });
  };

  insertStrZipCodeStyle (input){
    return input.slice(0, 3) + '-' + input.slice(3,input.length);
  }

  getFacilityZipcode = (e) => {
    let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
    input_value = toHalfWidthOnlyNumber(input_value);
    
    var start_pos = e.target.selectionStart;
    var end_pos = e.target.selectionEnd;
    if(input_value.length >= 3) {    
      input_value = this.insertStrZipCodeStyle(input_value);
      if (input_value.length == 4){
        if (start_pos == end_pos && start_pos == 4){            
          e.target.setSelectionRange(start_pos-1, start_pos-1);
        }
      }
    }
    if (input_value.length > this.facility_validate_data.zip_code.length) return;

    var tmp = this.state.display_facility_info;
    tmp.zip_code = input_value;
    this.setState({ display_facility_info: tmp }, () => {
      var obj = document.getElementById('zip_code_id');
      if (e.keyCode == undefined && start_pos == end_pos){          
        if (start_pos != 4 ){
          obj.setSelectionRange(start_pos, start_pos);
        } else {
          if (input_value.length == 4){
            obj.setSelectionRange(start_pos+1, start_pos+1);
          }
        }
      }
    });    
    this.setChangeFlag(1);
  };

  getFacilityAddress1 = (e) => {
    this.setChangeFlag(1);
    var tmp = this.state.display_facility_info;
    tmp.address_1 = e.target.value;
    this.setState({ display_facility_info: tmp });
  };
  getFacilityAddress2 = (e) => {
    this.setChangeFlag(1);
    var tmp = this.state.display_facility_info;
    tmp.address_2 = e.target.value;
    this.setState({ display_facility_info: tmp });
  };
  getFacilityTel = (e) => {
    let regx = /^[-ー]*[0-9０-９][-ー0-9０-９]*$/;
    if (e.target.value != "" && !regx.test(e.target.value)) return;
    if (e.target.value.length > this.facility_validate_data.phone_number.length) return;

    var tmp = this.state.display_facility_info;
    tmp.phone_number =toHalfWidthOnlyNumber(e.target.value);
    this.setState({ display_facility_info: tmp });
    this.setChangeFlag(1);
  };
  getFacilityFax = (e) => {
    let regx = /^[-ー]*[0-9０-９][-ー0-9０-９]*$/;
    if (e.target.value != "" && !regx.test(e.target.value)) return;
    if (e.target.value.length > this.facility_validate_data.fax_number.length) return;

    var tmp = this.state.display_facility_info;
    tmp.fax_number = toHalfWidthOnlyNumber(e.target.value);
    this.setState({ display_facility_info: tmp });
    this.setChangeFlag(1);
  };
  getFacilityDialYear = (e) => {
    this.setChangeFlag(1);
    var tmp = this.state.display_facility_info;
    tmp.dialysis_start_year = e.target.id;
    this.setState({ display_facility_info: tmp });
  };
  getFacilityDialMonth = (e) => {
    this.setChangeFlag(1);
    var tmp = this.state.display_facility_info;
    tmp.dialysis_start_month = e.target.id;
    this.setState({ display_facility_info: tmp });
  };
  getFacilityDialAbility = (e) => {
    let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
    if (input_value != '' &&  input_value.length > this.facility_validate_data.number_of_concurrent_dialysis.length) return;
    if (input_value != "") {
      input_value = parseInt(toHalfWidthOnlyNumber(input_value));
    }

    var tmp = this.state.display_facility_info;
    tmp.number_of_concurrent_dialysis = input_value;
    this.setState({ display_facility_info: tmp });
    this.setChangeFlag(1);
  };
  getFacilityMaxAbility = (e) => {
    let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
    if (input_value != '' &&  input_value.length > this.facility_validate_data.maximum_capacity.length) return;
    if (input_value != "") {
      input_value = parseInt(toHalfWidthOnlyNumber(input_value));
    }
    
    var tmp = this.state.display_facility_info;
    tmp.maximum_capacity = input_value;
    this.setState({ display_facility_info: tmp });
    this.setChangeFlag(1);
  };
  getFacilityConsole = (e) => {
    let input_value = e.target.value.replace(/[^0-9０-９]/g, '');
    if (input_value != '' &&  input_value.length > this.facility_validate_data.number_of_consoles.length) return;
    if (input_value != "") {
      input_value = parseInt(toHalfWidthOnlyNumber(input_value));
    }

    var tmp = this.state.display_facility_info;
    tmp.number_of_consoles = input_value;
    this.setState({ display_facility_info: tmp });
    this.setChangeFlag(1);
  };
  getFacilityPrefecture = (e) => {
    this.setChangeFlag(1);
    var tmp = this.state.display_facility_info;
    tmp.prefectures_number = e.target.value;
    this.setState({ display_facility_info: tmp });
  };
  getFacilityTableNumber = (e) => {
    this.setChangeFlag(1);
    var tmp = this.state.display_facility_info;
    tmp.point_table_number = e.target.value;
    this.setState({ display_facility_info: tmp });
  };
  getFacilityHospitalCode = (e) => {
    this.setChangeFlag(1);
    var tmp = this.state.display_facility_info;
    tmp.medical_institution_code = e.target.value;
    this.setState({ display_facility_info: tmp });
  };
  getFacilityTreatmentCode = (e) => {
    this.setChangeFlag(1);
    var tmp = this.state.display_facility_info;
    tmp.treatment_type_code = e.target.value;
    this.setState({ display_facility_info: tmp });
  };

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }

  update = () => {
    if (this.change_flag == false) return;
    if (this.context.$canDoAction(this.context.FEATURES.DIAL_FACILITY_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
      window.sessionStorage.setItem("alert_messages","登録権限がありません。");
      return;
    }
    var error = this.checkValidation();
    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }

    let checkNum = this.state.display_facility_info
      .number_of_concurrent_dialysis;
    let tmp = parseFloat(checkNum);
    if (checkNum !== "" && tmp.toString() != checkNum) {
      window.sessionStorage.setItem(
        "alert_messages",
        "同時透析能力を数字で入力してください。"
      );
      return;
    }

    checkNum = this.state.display_facility_info.maximum_capacity;
    tmp = parseFloat(checkNum);
    if (checkNum !== "" && tmp.toString() != checkNum) {
      window.sessionStorage.setItem(
        "alert_messages",
        "最大収容能力を数字で入力してください。"
      );
      return;
    }

    checkNum = this.state.display_facility_info.number_of_consoles;
    tmp = parseFloat(checkNum);
    if (checkNum !== "" && tmp.toString() != checkNum) {
      window.sessionStorage.setItem(
        "alert_messages",
        "コンソール数を数字で入力してください。"
      );
      return;
    }
    let master_validate = getMasterValidate();
    if (master_validate != null) {
      let validate_data = master_validate.dial_institution_master;
      if (
        this.state.display_facility_info.ccorporation_name != null &&
        this.state.display_facility_info.ccorporation_name != "" &&
        this.state.display_facility_info.ccorporation_name.length >
          validate_data.ccorporation_name.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "法人名を" +
            validate_data.ccorporation_name.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (
        this.state.display_facility_info.medical_institution_name != null &&
        this.state.display_facility_info.medical_institution_name != "" &&
        this.state.display_facility_info.medical_institution_name.length >
          validate_data.medical_institution_name.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "医療機関名を" +
            validate_data.medical_institution_name.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (
        this.state.display_facility_info.medical_institution_name_kana !=
          null &&
        this.state.display_facility_info.medical_institution_name_kana != "" &&
        this.state.display_facility_info.medical_institution_name_kana.length >
          validate_data.medical_institution_name_kana.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "医療機関カナ名を" +
            validate_data.medical_institution_name_kana.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (
        this.state.display_facility_info.view_name != null &&
        this.state.display_facility_info.view_name != "" &&
        this.state.display_facility_info.view_name.length >
          validate_data.view_name.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "システム内表示名を" +
            validate_data.view_name.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (
        this.state.display_facility_info.representative_name != null &&
        this.state.display_facility_info.representative_name != "" &&
        this.state.display_facility_info.representative_name.length >
          validate_data.representative_name.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "代表者名を" +
            validate_data.representative_name.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (
        this.state.display_facility_info.doctor_name != null &&
        this.state.display_facility_info.doctor_name != "" &&
        this.state.display_facility_info.doctor_name.length >
          validate_data.doctor_name.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "医師名を" +
            validate_data.doctor_name.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (
        this.state.display_facility_info.zip_code != null &&
        this.state.display_facility_info.zip_code != "" &&
        this.state.display_facility_info.zip_code.length >
          validate_data.zip_code.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "郵便番号を" +
            validate_data.zip_code.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (
        this.state.display_facility_info.address_1 != null &&
        this.state.display_facility_info.address_1 != "" &&
        this.state.display_facility_info.address_1.length >
          validate_data.address_1.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "住所1を" +
            validate_data.address_1.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (
        this.state.display_facility_info.address_2 != null &&
        this.state.display_facility_info.address_2 != "" &&
        this.state.display_facility_info.address_2.length >
          validate_data.address_2.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "住所2を" +
            validate_data.address_2.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (
        this.state.display_facility_info.phone_number != null &&
        this.state.display_facility_info.phone_number != "" &&
        this.state.display_facility_info.phone_number.length >
          validate_data.phone_number.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "電話番号を" +
            validate_data.phone_number.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (
        this.state.display_facility_info.prefectures_number != null &&
        this.state.display_facility_info.prefectures_number != "" &&
        this.state.display_facility_info.prefectures_number.length >
          validate_data.prefectures_number.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "都道府県番号を" +
            validate_data.prefectures_number.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (
        this.state.display_facility_info.point_table_number != null &&
        this.state.display_facility_info.point_table_number != "" &&
        this.state.display_facility_info.point_table_number.length >
          validate_data.point_table_number.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "点数表番号を" +
            validate_data.point_table_number.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (
        this.state.display_facility_info.medical_institution_code != null &&
        this.state.display_facility_info.medical_institution_code != "" &&
        this.state.display_facility_info.medical_institution_code.length >
          validate_data.medical_institution_code.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "医療機関コードを" +
            validate_data.medical_institution_code.length +
            "文字以下で入力してください。"
        );
        return;
      }
      if (
        this.state.display_facility_info.treatment_type_code != null &&
        this.state.display_facility_info.treatment_type_code != "" &&
        this.state.display_facility_info.treatment_type_code.length >
          validate_data.treatment_type_code.length
      ) {
        window.sessionStorage.setItem(
          "alert_messages",
          "診療種別コードを" +
            validate_data.treatment_type_code.length +
            "文字以下で入力してください。"
        );
        return;
      }
    }

    if (this.state.display_facility_info != null) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "機関情報を変更してもいいですか?",
      });
    }
  };

  render() {
    let { list_facility, months_list, years_list } = this.state;    
    return (
      <Card>
        <div className="title">機関マスタ</div>
        <Wrapper>
          <div className="facility">
            <div className="facility-title">施設選択</div>
            <div className="facility-content">
              {list_facility !== undefined &&
                list_facility !== null &&
                list_facility.length > 0 &&
                list_facility.map((item, index) => {
                  if (this.state.selected_index === index) {
                    return (
                      <>
                        <div
                          className="selected"
                          onClick={() => this.showFacilityinfo(item, index)}
                        >
                          {item.view_name}
                        </div>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <div
                          className=""
                          onClick={() => this.showFacilityinfo(item, index)}
                        >
                          {item.view_name}
                        </div>
                      </>
                    );
                  }
                })}
            </div>
          </div>
          <div className="facility-form">
            <div className="facility_code text-right">
              <InputWithLabelBorder
                label="機関コード"
                type="text"
                placeholder="機関コードを入力"
                getInputText={this.getFacilityCode.bind(this)}
                diseaseEditData={
                  this.state.display_facility_info != null
                    ? this.state.display_facility_info.code
                    : ""
                }
                id="code_id"
              />
            </div>

            <div className="facility_corporate">
              <InputWithLabelBorder
                label="法人名"
                type="text"
                placeholder="法人名を入力"
                getInputText={this.getFacilityCorporate.bind(this)}
                diseaseEditData={
                  this.state.display_facility_info != null
                    ? this.state.display_facility_info.ccorporation_name
                    : ""
                }
                id="ccorporation_name_id"
              />
              <InputWithLabelBorder
                label="医療機関名"
                type="text"
                placeholder="医療機関名を入力"
                getInputText={this.getFacilityName.bind(this)}
                diseaseEditData={
                  this.state.display_facility_info != null
                    ? this.state.display_facility_info.medical_institution_name
                    : ""
                }
                id="medical_institution_name_id"
              />
              <InputWithLabelBorder
                label="医療機関カナ名"
                type="text"
                placeholder="医療機関カナ名を入力"
                getInputText={this.getFacilityKanaName.bind(this)}
                diseaseEditData={
                  this.state.display_facility_info != null
                    ? this.state.display_facility_info
                        .medical_institution_name_kana
                    : ""
                }
                id="medical_institution_name_kana_id"
              />
              <InputWithLabelBorder
                label="システム内表示名"
                type="text"
                placeholder="システム内表示名を入力"
                getInputText={this.getFacilitySystemName.bind(this)}
                diseaseEditData={
                  this.state.display_facility_info != null
                    ? this.state.display_facility_info.view_name
                    : ""
                }
                id="view_name_id"
              />
            </div>

            <div className="facility_doctor">
              <InputWithLabelBorder
                label="代表者名"
                type="text"
                placeholder="代表者名を入力"
                getInputText={this.getFacilityRepresentativeName.bind(this)}
                diseaseEditData={
                  this.state.display_facility_info != null
                    ? this.state.display_facility_info.representative_name
                    : ""
                }
                id="representative_name_id"
              />
              <div className="pl-18">
                <InputWithLabelBorder
                  label="医師名"
                  type="text"
                  placeholder="医師名を入力"
                  getInputText={this.getFacilityDoctorName.bind(this)}
                  diseaseEditData={
                    this.state.display_facility_info != null
                      ? this.state.display_facility_info.doctor_name
                      : ""
                  }
                  id="doctor_name_id"
                />
              </div>
            </div>

            <div className="facility_address">
              <div className="zipcode">
                <InputBoxTag
                  label="郵便番号"
                  type="text"
                  placeholder="郵便番号を入力"                  
                  getInputText={this.getFacilityZipcode.bind(this)}                  
                  value={
                    this.state.display_facility_info != null
                      ? this.state.display_facility_info.zip_code
                      : ""
                  }
                  id="zip_code_id"
                />
              </div>
              <InputWithLabelBorder
                label="住所1"
                type="text"
                placeholder="住所1を入力"
                getInputText={this.getFacilityAddress1.bind(this)}
                diseaseEditData={
                  this.state.display_facility_info != null
                    ? this.state.display_facility_info.address_1
                    : ""
                }
                id="address_1_id"
              />
              <InputWithLabelBorder
                label="住所2"
                type="text"
                placeholder="住所2を入力"
                getInputText={this.getFacilityAddress2.bind(this)}
                diseaseEditData={
                  this.state.display_facility_info != null
                    ? this.state.display_facility_info.address_2
                    : ""
                }
                id="address_2_id"
              />
            </div>

            <div className="facility_tel">
              <InputWithLabelBorder
                label="電話番号"
                type="text"
                placeholder="電話番号を入力"
                getInputText={this.getFacilityTel.bind(this)}
                diseaseEditData={
                  this.state.display_facility_info != null
                    ? this.state.display_facility_info.phone_number
                    : ""
                }
                id="phone_number_id"
              />
              <div className="pl-18">
                <InputWithLabelBorder
                  label="Fax番号"
                  type="text"
                  placeholder="Fax番号を入力"
                  getInputText={this.getFacilityFax.bind(this)}
                  diseaseEditData={
                    this.state.display_facility_info != null
                      ? this.state.display_facility_info.fax_number
                      : ""
                  }
                  id="fax_number_id"
                />
              </div>
            </div>

            <div className="facility_day">
              <div className="left-area">
                <div className="has-unit">
                  <SelectorWithLabel
                    options={years_list}
                    title="透析開始年"
                    className="text-right"
                    getSelect={this.getFacilityDialYear.bind(this)}
                    departmentEditCode={
                      this.state.display_facility_info != null
                        ? this.state.display_facility_info.dialysis_start_year
                        : 1970
                    }
                  />
                  {/* <InputWithLabel
                                    label="透析開始年"
                                    type="text"
                                    placeholder="透析開始年を入力"
                                    getInputText={this.getFacilityDialYear.bind(this)}
                                    diseaseEditData={this.state.display_facility_info !=null?this.state.display_facility_info.dialysis_start_year:''}
                                /> */}
                  <div className="tall">年</div>
                </div>
                <div className="has-unit">
                  <InputWithLabel
                    label="同時透析能力"
                    type="text"
                    className="text-right"
                    placeholder="同時透析能力を入力"
                    getInputText={this.getFacilityDialAbility.bind(this)}
                    diseaseEditData={
                      this.state.display_facility_info != null
                        ? this.state.display_facility_info
                            .number_of_concurrent_dialysis
                        : ""
                    }
                  />
                  <div className="tall">人</div>
                </div>
                <div className="has-unit">
                  <InputWithLabelBorder
                    label="コンソール数"
                    type="text"
                    placeholder="コンソール数を入力"
                    className="text-right"
                    getInputText={this.getFacilityConsole.bind(this)}
                    diseaseEditData={
                      this.state.display_facility_info != null
                        ? this.state.display_facility_info.number_of_consoles
                        : ""
                    }
                    id="number_of_consoles_id"
                  />
                  <div className="tall">台</div>
                </div>
              </div>
              <div className="right-area">
                <div className="has-unit">
                  <SelectorWithLabel
                    options={months_list}
                    title="透析開始月"
                    className="text-right"
                    getSelect={this.getFacilityDialMonth.bind(this)}
                    departmentEditCode={
                      this.state.display_facility_info != null
                        ? this.state.display_facility_info.dialysis_start_month
                        : 1
                    }
                  />
                  {/* <InputWithLabel
                                    label="透析開始月"
                                    type="text"
                                    placeholder="透析開始月を入力"
                                    getInputText={this.getFacilityDialMonth.bind(this)}
                                    diseaseEditData={this.state.display_facility_info !=null?this.state.display_facility_info.dialysis_start_month:''}
                                /> */}
                  <div className="tall">月</div>
                </div>
                <div className="has-unit">
                  <InputWithLabel
                    label="最大収容能力"
                    type="text"
                    placeholder="最大収容能力を入力"
                    className="text-right"
                    getInputText={this.getFacilityMaxAbility.bind(this)}
                    diseaseEditData={
                      this.state.display_facility_info != null
                        ? this.state.display_facility_info.maximum_capacity
                        : ""
                    }
                  />
                  <div className="tall">人</div>
                </div>
              </div>
            </div>

            <div className="facility_Prefecture">
              <InputWithLabelBorder
                label="都道府県番号"
                type="text"
                placeholder="都道府県番号を入力"
                className="text-right"
                getInputText={this.getFacilityPrefecture.bind(this)}
                diseaseEditData={
                  this.state.display_facility_info != null
                    ? this.state.display_facility_info.prefectures_number
                    : ""
                }
                id="prefectures_number_id"
              />
              <div className="pl-18">
                <InputWithLabelBorder
                  label="点数表番号"
                  type="text"
                  placeholder="点数表番号を入力"
                  className="text-right"
                  getInputText={this.getFacilityTableNumber.bind(this)}
                  diseaseEditData={
                    this.state.display_facility_info != null
                      ? this.state.display_facility_info.point_table_number
                      : ""
                  }
                  id="point_table_number_id"
                />
              </div>
            </div>

            <div className="facility_Hospital">
              <InputWithLabelBorder
                label="医療機関コード"
                type="text"
                placeholder="医療機関コードを入力"
                className="text-right"
                getInputText={this.getFacilityHospitalCode.bind(this)}
                diseaseEditData={
                  this.state.display_facility_info != null
                    ? this.state.display_facility_info.medical_institution_code
                    : ""
                }
                id="medical_institution_code_id"
              />
              <div className="pl-18">
                <InputWithLabelBorder
                  label="診療種別コード"
                  type="text"
                  placeholder="診療種別コードを入力"
                  className="text-right"
                  getInputText={this.getFacilityTreatmentCode.bind(this)}
                  diseaseEditData={
                    this.state.display_facility_info != null
                      ? this.state.display_facility_info.treatment_type_code
                      : ""
                  }
                  id="treatment_type_code_id"
                />
              </div>
            </div>
          </div>
        </Wrapper>
        <div className="footer-buttons" style={{paddingRight:'1rem'}}>
          {/* <Button className={this.state.curFocus === 1?"focus": ""}>プレビュー</Button> */}
            <Button onClick={this.update} className={`${this.state.change_flag == 0 ? "disable-btn" : "red-btn"}`}>登録</Button>
        </div>
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.updateFacility.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
      </Card>
    );
  }
}
DialMasterFacility.contextType = Context;

export default DialMasterFacility;
