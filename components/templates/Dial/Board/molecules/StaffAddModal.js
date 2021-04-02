import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import * as apiClient from "~/api/apiClient";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import axios from "axios";
import SelectNonAccountDoctorModal from "../../../../molecules/SelectNonAccountDoctorModal";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import MenuSettingModal from "../../../Maintenance/Master/MenuSettingModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES } from "~/helpers/constants";
import { masterValidate } from "~/helpers/validate";
import {
  addRedBorder,
  removeRedBorder,
  removeRequiredBg,
} from "~/helpers/dialConstants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import {toHalfWidthOnlyNumber} from "~/helpers/dialConstants";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 100%;
  flex-direction: column;
  text-align: center;
  .clear_icon {
    background-color: blue;
    color: white;
  }
  .flex {
    display: flex;
  }
  .left {
    float: left;
  }
  .right {
    float: right;
  }

  .sub_title {
    padding-top: 20px;
    clear: both;
  }
  .label-title {
    width: 270px;
    text-align: right;
    font-size: 18px;
    margin-top: 6px;
    margin-bottom: 0;
  }
  .pullbox, .permission_area {
    .permission_label {
      width: 87px;
      text-align: right;
      margin-right: 10px;
    }
  }
  .date_area {
    .label-title {
      display: none;
    }
    .react-datepicker-wrapper {
      input {
        width: 90px;
      }
    }
    .date_label {
      width: 90px;
      text-align: right;
      margin-right: 10px;
      margin-top: 10px;
    }
    ._label {
      margin-top: 10px;
      margin-left: 5px;
      margin-right: 5px;
    }
  }
  .footer {
    padding-top: 20px;
    clear: both;
    span {
      font-size: 22px;
      font-weight: normal;
    }
    button {
      margin-right: 20px;
    }
  }
  .transition_buttons {
    padding-top: calc(17vh - 100px);
    button {
      margin-top: 20px;
    }
  }
  .staff-search {
    width: 100%;
    label {
      width: 0;
      margin: 0;
    }
    input {
      font-size: 12px;
    }
  }
  .checkbox_area {
    display: flex;
    label {
      font-size: 1rem;
      line-height: 2rem;
      width: 12rem;
      text-align: right;
      input {height:15px;}
    }
    .direct_man {
      width: calc(100% - 12rem);
      div {margin-top:0;}
      label {
        width: 5rem;
        margin: 0;
        line-height: 2rem;
        margin-right: 0.5rem;
      }
      input {
        font-size: 1rem;
        width: calc(100% - 13rem);
        height: 2rem;
      }
    }
  }
  .checkbox-label {
    width: 30%;
    text-align: left;
    font-size: 18px;
    margin-bottom: 0;
  }
  .password-area {
    .label-title {display:none;}
    .password-label {
      width: 12rem;
      text-align: right;
      cursor: pointer;
      margin: 0;
      line-height: 2rem;
      margin-right: 0.5rem;
      font-size: 1rem;
    }
    .password-value {
      width: calc(100% - 20rem);
      input {width:100%;}
    }
  }
  .check-notify{
    text-align:left;
    margin-left:12.5rem;
    label{
      font-size:1rem;
      line-height: 2rem;
      input {height: 15px;}
    }
  }
  #signin_id_id{
    ime-mode: inactive;
  }
  #password_id, #password_confirm_id{
    ime-mode: inactive;
  }
  .label-title {
    width: 12rem;
    text-align: right;
    font-size: 1rem;
    margin: 0;
    line-height: 2rem;
    margin-right: 0.5rem;
  }
  input {
    font-size: 1rem;
    width: calc(100% - 20rem);
    height: 2rem;
  }
  .no-margin-top {
    div {margin-top:0;}
    margin-top:0.5rem;
  }
  .pullbox-label {
    margin: 0;
    width: calc(100% - 20rem);
    .pullbox-select {
      width: 100%;
      font-size: 1rem;
          height: 2rem;
    }
  }
`;

const DOCTOR_CREATE = 0;
const DOCTOR_SELECT = 1;

class StaffAddModal extends Component {
  constructor(props) {
    super(props);
    this.getAuthCategory();
    this.getAuthDepartment();
    // let signin_id = window.sessionStorage.getItem("current_user");
    let modal_data = this.props.modal_data;
    var feature_auth = modal_data != null ? modal_data.feature_auth : null;
    
    this.haruka_system_flag = this.checkHarukaSystem() == 'haruka'? true:false;
    this.state = {
      staff_type: 0,
      staff_list: this.props.staff_list,
      staff_number: 0,
      position: 0,
      startDate: "",
      endDate: "",
      name: modal_data !== null ? modal_data.name : "",
      name_kana: modal_data !== null ? modal_data.name_kana : "",
      short_name: "",
      order: 1,
      password: "",
      old_password: "",
      password_confirm: "",
      category: modal_data !== null ? modal_data.category : 0,
      department: modal_data !== null ? modal_data.department : 0,
      start_date: "",
      end_date: "",
      card_registration: "",
      authority: modal_data !== null ? modal_data.authority : 0,
      signin_id: modal_data !== null ? modal_data.signin_id : "",
      number: modal_data !== null ? modal_data.number : 0,
      department_list: [{id:0, value:''}],
      category_list: [],
      is_doctor:
        modal_data != null ? (modal_data.system_doctor_id != null ? 1 : 0) : 0,
      is_enabled: modal_data != null ? modal_data.is_enabled : 1,
      system_doctor_id: modal_data != null ? modal_data.system_doctor_id : null,
      home_page: modal_data != null ? modal_data.home_page : null,
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
      complete_message: "",
      btn_status: true,
      doctor_name_create_mode: DOCTOR_CREATE,
      isPasswordConfirmModal: false,
      openPasswordModal: false,
      isOpenMenuModal: false,
      isOpenConfirmModal: false,
      change_flag: 0,
      alert_message: "",
      feature_auth,
      ward_id:(modal_data != null && modal_data.ward_id != null) ? modal_data.ward_id : 0,
      timeout:(modal_data != null && modal_data.timeout_json != undefined && modal_data.timeout_json != null && modal_data.timeout_json != '')? modal_data.timeout_json.timeout:'',
      warning_time:(modal_data != null && modal_data.timeout_json != undefined && modal_data.timeout_json != null && modal_data.timeout_json != '')? modal_data.timeout_json.warning_time:''
    };
    this.double_click = false;
    this.menu_list = null;
    let cache_ward_master = JSON.parse(window.sessionStorage.getItem("init_status")).ward_master;
    this.ward_master = [{id:0, value:""}];
    if (cache_ward_master != undefined && cache_ward_master != null && cache_ward_master.length > 0){
      cache_ward_master.map(ward=>{
        this.ward_master.push({id:ward.number, value: ward.name});
      });
    }
  }
  
  checkHarukaSystem = () => {
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if (initState == null || initState == undefined) {
      return "haruka";
    }
    if(initState.enable_ordering_karte == 1) return "haruka";
    if(initState.enable_dialysis == 1) return "dialysis";
    return "haruka";
  }
  
  async componentDidMount() {
    this.setChangeFlag(0);
    this.changeBackground();
    let password = "";
    if (
      this.props.modal_data !== undefined &&
      this.props.modal_data != null &&
      this.props.modal_data.number != null
    ) {
      password = await this.getStaffPasword(this.props.modal_data.number);
    }
    var initState = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    let conf = initState.conf_data;
    this.menu_list = initState.navigation_menu;
    let home_page_name = "";
    if (
      this.props.modal_data != null &&
      this.props.modal_data.home_page != null &&
      this.props.modal_data.home_page != ""
    ) {
      home_page_name = this.menu_list.find(
        (x) => x.id == this.props.modal_data.home_page
      ).name;
    }
    
    var notify_update_auth = this.context.FEATURES.NOTIFICATION * 100 + this.context.AUTHS.EDIT;
    var check_notify_update_flag = false;
    if (this.state.feature_auth != null){
      check_notify_update_flag = this.state.feature_auth.includes(notify_update_auth);
    }
    this.setState({
      doctor_name_create_mode:
        conf.doctor_name_create_mode !== undefined
          ? conf.doctor_name_create_mode
          : 0,
      old_password: password != undefined ? password : "",
      home_page_name,
      check_notify_update_flag
    });
  }
  
  setChangeFlag = (change_flag) => {
    this.setState({ change_flag });
    if (change_flag) {
      sessApi.setObjectValue("dial_change_flag", "staff_add", 1);
    } else {
      sessApi.remove("dial_change_flag");
    }
  };
  
  componentDidUpdate() {
    this.changeBackground();
  }
  
  componentWillUnmount() {
    sessApi.remove("dial_change_flag");
  }
  
  changeBackground = () => {
    masterValidate("staff", this.state, 'background');
    if (this.state.number > 0) {
      if (this.state.password == "" && this.state.password_confirm == "") {
        removeRequiredBg("password_id");
        removeRequiredBg("password_confirm_id");
      }
      if (!(this.state.authority > 0)){
        removeRequiredBg("category_id");
      }
    }
  };
  
  checkValidation = () => {
    removeRedBorder("name_id");
    removeRedBorder("name_kana_id");
    removeRedBorder("signin_id_id");
    removeRedBorder("password_id");
    removeRedBorder("password_confirm_id");
    removeRedBorder("category_id");
    let error_str_arr = [];
    let validate_data = masterValidate("staff", this.state);
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    // 編集時
    // B①パスワードと確認欄両方空なら必須チェックをしない。
    // B②パスワードが入力されている→確認欄を必須判定する。
    // B③確認欄が入力されている→パスワード欄を必須判定する
    if (this.state.number > 0) {
      if (this.state.password == "" && this.state.password_confirm == "") {
        let findIndex = error_str_arr.findIndex(x=>x=="パスワードを入力してください。");
        if (findIndex > -1) error_str_arr.splice(findIndex,1);
        findIndex = error_str_arr.findIndex(x=>x=="パスワード(確認)を入力してください。");
        if (findIndex > -1) error_str_arr.splice(findIndex,1);
        removeRedBorder("password_id");
        removeRedBorder("password_confirm_id");
      }
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
  
  getStaffPasword = async (number) => {
    let path = "/app/api/v2/secure/staff/get_password";
    let post = {
      number: number,
    };
    let { data } = await axios.post(path, {
      params: post,
    });
    return data;
  };
  
  getAlwaysShow = (name, value) => {
    this.setChangeFlag(1);
    if (name === "alwaysShow") {
      this.setState({ is_enabled: value });
    }
  };
  
  getNotifyFlag = (name, value) => {
    this.setChangeFlag(1);
    var feature_auth = this.state.feature_auth;
    var notify_update_auth = this.context.FEATURES.NOTIFICATION * 100 + this.context.AUTHS.EDIT;
    if (name == "notify") {
      if (value){
        if (feature_auth != null) {
          feature_auth += "," + notify_update_auth;
        } else{
          feature_auth = notify_update_auth;
        }
        this.setState({
          check_notify_update_flag: value,
          feature_auth,
        });
      } else{
        if (feature_auth != null){
          if (typeof feature_auth != 'string') feature_auth = feature_auth.toString();
          var array_feature_auths = feature_auth.split(',');
          if (array_feature_auths.length > 1){
            for (var i = 0; i < array_feature_auths.length; i++){
              if (array_feature_auths[i] == notify_update_auth){
                array_feature_auths.splice(i, 1);
              }
            }
            feature_auth = array_feature_auths.join(',');
          } else {
            feature_auth = null;
          }
        }
        this.setState({
          check_notify_update_flag: value,
          feature_auth
        });
      }
      
    }
  }
  
  getName = (e) => {
    this.setChangeFlag(1);
    this.setState({ name: e.target.value });
  };
  
  getNameKana = (e) => {
    this.setChangeFlag(1);
    this.setState({ name_kana: e.target.value });
  };
  
  getSigninId = (e) => {
    this.setChangeFlag(1);
    this.setState({ signin_id: e.target.value });
  };
  
  getCategory = (e) => {
    this.setChangeFlag(1);
    let authority = "";
    Object.keys(this.state.category_list).map((key) => {
      if (this.state.category_list[key].id == e.target.id) {
        authority = this.state.category_list[key].authority;
      }
    });
    this.setState({
      category: e.target.id,
      authority,
    });
  };
  getDepartment = (e) => {
    this.setChangeFlag(1);
    this.setState({ department: e.target.id });
  };
  
  getPassword = (e) => {
    this.setChangeFlag(1);
    this.setState({ password: e.target.value });
  };
  
  getPasswordConfirm = (e) => {
    this.setChangeFlag(1);
    this.setState({ password_confirm: e.target.value });
  };
  
  getCheckedPermission = () => {};
  
  getStartDate = (value) => {
    this.setState({ startDate: value });
  };
  getEndDate = (value) => {
    this.setState({ endDate: value });
  };
  
  getAuthCategory = async () => {
    let path = "/app/api/v2/dial/master/staff/getAuthCategory";
    await apiClient
      .post(path, {
        params: {
          type: "category",
          order:'name_kana'
        },
      })
      .then((res) => {
        let category_list = [{ id: 0, value: "" }];
        if (res != undefined) {
          let index = 1;
          Object.keys(res).map((key) => {
            let category_info = {
              id: res[key].id,
              value: res[key].name,
              authority: res[key].authority,
            };
            category_list[index] = category_info;
            index++;
          });
        }
        this.setState({
          category_list,
        });
      });
  };
  
  getAuthDepartment = async () => {
    let path = "/app/api/v2/dial/master/staff/getAuthCategory";
    await apiClient
      .post(path, {
        params: {
          type: "department",
          order:'name_kana'
        },
      })
      .then((res) => {
        let department_list = this.state.department_list;
        if (res != undefined) {
          Object.keys(res).map((key) => {
            department_list.push({id:res[key].id, value:res[key].name})
          });
        }
        this.setState({
          department_list,
        });
      });
  };
  
  registerStaff = async () => {
    if (this.state.change_flag == 0) return;
    var error = this.checkValidation();
    if (this.state.password !== this.state.password_confirm) {
      error.push("パスワードを再確認してください。");
      addRedBorder("password_id");
      addRedBorder("password_confirm_id");
    }
    if (!(this.state.authority>0)) {
      error.push("権限を選択してください。");
      addRedBorder("category_id");
    }
    
    if (this.haruka_system_flag){
      if(this.state.warning_time > 0 && !(this.state.timeout > this.state.warning_time)){
        error.push('ログアウト時間とログアウト警告時間を正しく入力してください。');
        addRedBorder("timeout_id");
        addRedBorder("warning_time_id");
      }
    }
    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }
    if (this.state.number > 0) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "この内容に変更しますか？",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: "この内容で登録しますか？",
      });
    }
  };
  
  register = async () => {
    let path = "";
    let complete_message = "登録中";
    if (this.state.number > 0) {
      path = "/app/api/v2/dial/master/staff/update";
      complete_message = "変更中";
    } else {
      path = "/app/api/v2/dial/master/staff/register";
    }
    let post_data = {
      name: this.state.name,
      name_kana: this.state.name_kana,
      authority: this.state.authority,
      category: parseInt(this.state.category),
      department: parseInt(this.state.department),
      signin_id: this.state.signin_id,
      password: this.state.password,
      password_confirm: this.state.password_confirm,
      number: this.state.number,
      is_enabled: this.state.is_enabled,
      feature_auth: this.state.feature_auth,
    };
    
    if (this.state.doctor_name_create_mode == DOCTOR_SELECT) {
      post_data.system_doctor_id = this.state.system_doctor_id;
    } else {
      post_data.is_doctor = this.state.is_doctor;
    }
    
    if (this.state.home_page !== undefined && this.state.home_page != null && this.state.home_page != "") {
      post_data.home_page = this.state.home_page;
    }
    
    if (this.haruka_system_flag){
      post_data.timeout = this.state.timeout;
      post_data.warning_time = this.state.warning_time;
      post_data.ward_id = this.state.ward_id;
    }
    
    this.setState({
      btn_status: false,
      complete_message,
    });
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient
      .post(path, {
        params: post_data,
      })
      .then((res) => {
        this.confirmCancel();
        if (res.alert_message !== undefined && res.alert_message != null) {
          var title = "";
          var message = res.alert_message;
          if (message.indexOf("変更") > -1) title = "変更完了##";
          if (message.indexOf("登録") > -1) title = "登録完了##";
          window.sessionStorage.setItem(
            "alert_messages",
            title + res.alert_message
          );
          this.props.handleOk();
        } else {
          window.sessionStorage.setItem("alert_messages", res.error_message);
        }
      })
      .catch(() => {
        this.confirmCancel();
      })
      .finally(() => {
        this.double_click = false;
      });
  };
  
  getRadio = (name, value) => {
    this.setChangeFlag(1);
    switch (name) {
      case "doctor":
        this.setState({ is_doctor: value });
        break;
    }
  };
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isPasswordConfirmModal: false,
      isOpenConfirmModal: false,
      confirm_message: "",
      complete_message: "",
      btn_status: true,
    });
  }
  
  chooseDoctor = async () => {
    let data = await apiClient.post(
      "/app/api/v2/secure/doctor/non_staff_search", {params:{}}
    );
    this.setState({
      doctors: data,
      select_doctor: true,
    });
  };
  closeDoctor = () => {
    this.setState({
      select_doctor: false,
    });
  };
  
  getDoctor = (e) => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  };
  
  selectDoctorFromModal = (id, name) => {
    let { doctors } = this.state;
    let system_doctor_id =
      doctors.find((x) => x.code == id) != null
        ? doctors.find((x) => x.code == id).number
        : null;
    this.setState({
      system_doctor_id,
      name: name,
      doctor_name: name,
      select_doctor: false,
    });
  };
  
  showPassWordModal = () => {
    // if(this.state.password == "") return;
    if (
      !this.context.$canDoAction(
        this.context.FEATURES.PASSWORD,
        this.context.AUTHS.READ
      )
    ) {
      return;
    }
    this.setState({
      isPasswordConfirmModal: true,
      confirm_message: "現在のパスワードを表示しますか？",
    });
  };
  
  showPassword = () => {
    this.setState({
      openPasswordModal: true,
      isPasswordConfirmModal: false,
      confirm_message: "",
    });
  };
  
  closeModal = () => {
    this.setState({
      openPasswordModal: false,
      isOpenMenuModal: false,
    });
  };
  
  openMenuModal = () => {
    this.setState({ isOpenMenuModal: true });
  };
  
  handleOk = (menu_item) => {
    this.closeModal();
    this.setState({
      change_flag:1,
      home_page_name: menu_item != null ? menu_item.name : "",
      home_page: menu_item.id,
    });
  };
  
  confirmCloseOk = () => {
    this.setState(
      {
        isOpenConfirmModal: false,
        confirm_message: "",
      },
      () => {
        this.props.closeModal();
      }
    );
  };
  
  handleClose = () => {
    if (this.state.change_flag == 1) {
      this.setState({
        isOpenConfirmModal: true,
        confirm_message:
          "登録していない内容があります。変更内容を破棄して閉じますか？",
      });
      return;
    }
    this.props.closeModal();
  };
  
  onHide = () => {}
  
  getInputNumber = (name, e) => {
    let input_value = e.target.value.replace(/[^0-9/\\.。０-９]/g, "");
    if (input_value != '') input_value = toHalfWidthOnlyNumber(input_value);
    this.setState({[name]:input_value});
    this.setChangeFlag(1);
  }
  
  setWard=(e)=>{
    this.setChangeFlag(1);
    this.setState({ward_id:parseInt(e.target.id)});
  };
  
  render() {
    let { doctor_name_create_mode } = this.state;
    let initState = JSON.parse(
      sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS)
    );
    let is_home_page = initState.enable_ordering_karte == 1;
    return (
      <>
        <Modal
          show={true}
          className="master-modal staff-setting-modal first-view-modal"
          onHide = {this.onHide}
        >
          <Modal.Header>
            <Modal.Title>スタッフマスタ</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className="checkbox_area">
                <Checkbox
                  label="利用可能"
                  getRadio={this.getAlwaysShow.bind(this)}
                  value={this.state.is_enabled}
                  checked={this.state.is_enabled === 1}
                  name="alwaysShow"
                />
                {doctor_name_create_mode == DOCTOR_CREATE ? (
                  this.props.modal_data != null ? (
                    <Checkbox
                      label="医師"
                      isDisabled={true}
                      value={
                        this.props.modal_data.system_doctor_id != null
                          ? true
                          : false
                      }
                    />
                  ) : (
                    <Checkbox
                      label="医師"
                      getRadio={this.getRadio.bind(this)}
                      value={this.state.is_doctor}
                      checked={this.state.is_doctor === 1}
                      name="doctor"
                    />
                  )
                ) : this.props.modal_data != null ? (
                  <div className="direct_man">
                    <InputWithLabel
                      label="医師名"
                      type="text"
                      diseaseEditData={
                        this.props.modal_data.system_doctor_id != null
                          ? this.props.modal_data.name
                          : ""
                      }
                    />
                  </div>
                ) : (
                  <div className="direct_man" onClick={this.chooseDoctor}>
                    <InputWithLabel
                      label="医師名"
                      type="text"
                      placeholder="クリックして選択"
                      diseaseEditData={this.state.doctor_name}
                    />
                  </div>
                )}
              </div>
              <div>
                <div className={'no-margin-top'}>
                  <InputBoxTag
                    label="氏名"
                    type="text"
                    getInputText={this.getName.bind(this)}
                    value={this.state.name}
                    id="name_id"
                  />
                </div>
                <div className={'no-margin-top'}>
                  <InputBoxTag
                    label="カナ氏名"
                    type="text"
                    getInputText={this.getNameKana.bind(this)}
                    value={this.state.name_kana}
                    id="name_kana_id"
                  />
                </div>
                {/*<InputBoxTag*/}
                {/*label="略称"*/}
                {/*type="text"*/}
                {/*// getInputText={this.getValue.bind(this)}*/}
                {/*// value = {value}*/}
                {/*/>*/}
                {/*<InputBoxTag*/}
                {/*label="並び順"*/}
                {/*type="text"*/}
                {/*// getInputText={this.getValue.bind(this)}*/}
                {/*// value = {value}*/}
                {/*/>*/}
                <div className={'no-margin-top'}>
                  <InputBoxTag
                    label="ログインID"
                    type="text"
                    getInputText={this.getSigninId.bind(this)}
                    value={this.state.signin_id}
                    isDisabled={this.props.modal_data != null}
                    id="signin_id_id"
                  />
                </div>
                <div className="d-flex password-area no-margin-top">
                  <label className="password-label" onClick={this.showPassWordModal.bind(this)}>パスワード</label>
                  <div className={'password-value'}>
                    <InputBoxTag
                      label=""
                      type="password"
                      getInputText={this.getPassword.bind(this)}
                      value={this.state.password}
                      readOnly
                      id="password_id"
                    />
                  </div>
                </div>
                <div className={'no-margin-top'}>
                  <InputBoxTag
                    label="パスワード(確認)"
                    type="password"
                    getInputText={this.getPasswordConfirm.bind(this)}
                    value={this.state.password_confirm}
                    id="password_confirm_id"
                  />
                </div>
                <div className={'no-margin-top'}>
                  <SelectorWithLabel
                    options={this.state.department_list}
                    title="部門・職種"
                    getSelect={this.getDepartment.bind(this)}
                    departmentEditCode={this.state.department}
                  />
                </div>
                <div className={'no-margin-top'}>
                  <SelectorWithLabel
                    options={this.state.category_list}
                    title="権限"
                    getSelect={this.getCategory.bind(this)}
                    departmentEditCode={this.state.category}
                    id="category_id"
                  />
                </div>
                {is_home_page && (
                  <div onClick={this.openMenuModal} className={'no-margin-top'}>
                    <InputBoxTag
                      label="ホーム画面"
                      type="text"
                      value={this.state.home_page_name}
                      readonly
                    />
                  </div>
                )}
                <div className='check-notify no-margin-top'>
                  <Checkbox
                    label="お知らせ管理許可"
                    getRadio={this.getNotifyFlag.bind(this)}
                    value={this.state.check_notify_update_flag}
                    checked={this.state.check_notify_update_flag}
                    name="notify"
                  />
                </div>
                {this.haruka_system_flag && (
                  <>
                    <div className={'no-margin-top'}>
                      <InputBoxTag
                        label="ログアウト時間(s)"
                        type="text"
                        value={this.state.timeout}
                        getInputText={this.getInputNumber.bind(this, 'timeout')}
                        id="timeout_id"
                      />
                    </div>
                    <div className={'no-margin-top'}>
                      <InputBoxTag
                        label="ログアウト警告時間(s)"
                        type="text"
                        value={this.state.warning_time}
                        getInputText={this.getInputNumber.bind(this, 'warning_time')}
                        id="warning_time_id"
                      />
                    </div>
                    <div className={'no-margin-top'}>
                      <SelectorWithLabel
                        options={this.ward_master}
                        title="担当病棟"
                        getSelect={this.setWard}
                        departmentEditCode={this.state.ward_id}
                        id="category_id"
                      />
                    </div>
                  </>
                )}
              </div>
            </Wrapper>
            {this.state.isUpdateConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.register.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.isPasswordConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.showPassword.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.complete_message !== "" && (
              <CompleteStatusModal message={this.state.complete_message} />
            )}
            {this.state.isOpenConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.confirmCloseOk}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.select_doctor === true && (
              <SelectNonAccountDoctorModal
                closeDoctor={this.closeDoctor}
                getDoctor={this.getDoctor.bind(this)}
                selectDoctorFromModal={this.selectDoctorFromModal}
                doctors={this.state.doctors}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.handleClose}>キャンセル</Button>
            {this.state.btn_status ? (
              <Button
                className={this.state.change_flag == 0 ? "disable-btn" : "red-btn"}
                onClick={this.registerStaff}
              >
                {this.props.modal_data !== null ? "変更" : "登録"}
              </Button>
            ) : (
              <Button
                className={this.state.change_flag == 0 ? "disable-btn" : "red-btn"}
              >
                {this.props.modal_data !== null ? "変更" : "登録"}
              </Button>
            )}
          </Modal.Footer>
        </Modal>
        {this.state.openPasswordModal && (
          <Modal show={true} className="master-modal auto-width-modal">
            <Modal.Header>
              <Modal.Title>パスワード</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div
                className="border ml-3 mr-3 p-1"
                style={{ width: "90%", fontSize: 18 }}
              >
                {this.state.old_password != ""
                  ? this.state.old_password
                  : "平文パスワード保存無し"}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
            </Modal.Footer>
          </Modal>
        )}
        {this.state.isOpenMenuModal && (
          <MenuSettingModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            menu_id={this.state.home_page}
          />
        )}
        {this.state.alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
      </>
    );
  }
}

StaffAddModal.contextType = Context;

StaffAddModal.propTypes = {
  staff_list: PropTypes.array,
  modal_data: PropTypes.object,
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
};

export default StaffAddModal;
