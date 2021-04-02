import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import InputWithLabel from "../../../molecules/InputWithLabel";
import Button from "~/components/atoms/Button";
import RadioButton from "~/components/molecules/RadioInlineButton";
import Checkbox from "~/components/molecules/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/pro-regular-svg-icons";
import {
  formatDateSlash,
  formatJapanDateSlash,
  formatDateLine,
  formatJapanDate,
} from "~/helpers/date";
import PropTypes from "prop-types";
import * as apiClient from "~/api/apiClient";
import renderHTML from "react-render-html";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as methods from "../DialMethods";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import FootcareFootsEditModal from "../modals/FootcareFootsEditModal";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import img_foot_right from "~/components/_demo/foot_right.png";
// import img_foot_left from "~/components/_demo/foot_left.png";
import bg_img_foot_left_display from "~/components/_demo/background_images/foot_left_display.png";
import bg_img_foot_right_display from "~/components/_demo/background_images/foot_right_display.png";
// import bg_img_foot_left_display from "~/components/_demo/foot_right.png";
// import bg_img_foot_right_display from "~/components/_demo/foot_left.png";
import Spinner from "react-bootstrap/Spinner";
import * as sessApi from "~/helpers/cacheSession-utils";
import { medicalInformationValidate } from '~/helpers/validate'
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import {makeList_data, extract_enabled} from "~/helpers/dialConstants";
import {getServerTime} from "~/helpers/constants";
import {makeList_code} from "../../../../helpers/dialConstants";
import SelectPannelModal from "~/components/templates/Dial/Common/SelectPannelModal";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const SpinnerWrapper = styled.div`
  height: 12.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Icon = styled(FontAwesomeIcon)`
  color: rgba(0, 0, 0, 0.65);
  font-size: 1rem;
  margin-right: 0.25rem;
`;

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 3rem);
  .main-content {
    display: flex;
    height: 100%;
    width: 100%;
    overflow-y: hidden;
  }
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  text-align: center;
  .flex {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 0.3rem;
  }
  .left {
    float: left;
  }
  .right {
    float: right;
  }
  .left-area {
    width: 25%;
    height: 100%;
    .main-info {
      height: 50%;
      p {
        margin: 0;
        text-align: left;
        font-size: 1.25rem;
      }
    }
    .history-list {
      height: 50%;
      .history-title {
        font-size: 1.25rem;
        width: calc(100% - 12.5rem);
      }
      .history-delete {
        width: 12.5rem;
        svg {
          cursor: pointer;
        }
        cursor: pointer;
      }
      .disabled {
        opacity: 0.5;
        cursor: unset;
        svg {
          cursor: unset;
        }
      }
    }
    .box-border {
      border: 1px solid black;
      height: 80%;
      overflow-y: auto;
      p {
        margin: 0;
        text-align: left;
      }
      .table-row {
        text-align: left;
        cursor: pointer;
        font-size: 1rem;
        padding: 0.3rem;
      }
      .selected-history {
        background: #4986e6;
        color: white;
      }
    }
  }
  .right-area {
    width: calc(75% - 0px);
    padding-left: 1.625rem;
    overflow: hidden;
    overflow-y: scroll;
    height: 100%;
    font-size: 1rem;
    .label-box {
      cursor: pointer;
    }

    .first-area {
      .entry-date {
        width: 40%;
        label {
          text-align: right;
          width: 7.5rem;
          font-size: 1rem;
          margin-top: 0.5rem;
          margin-bottom: 0;
        }
        input {
          width: 64%;
          height: 2.25rem;
          font-size:1rem;
        }
        .react-datepicker-wrapper {
          width: 64%;
          .react-datepicker__input-container {
            width: 100%;
            input {
              display: block;
              width: 100%;
              height: 2.5rem;
              border-radius: 0.25rem;
              border-width: 1px;
              border-style: solid;
              border-color: rgb(206, 212, 218);
              border-image: initial;
              padding: 0px 0.5rem;
            }
          }
        }
      }
      .entry-date div:first-child {
        margin-top: 0;
      }
      .staff div:first-child{
        margin-top: 8px !important;
      }
    }
    .second-area {
      .left-space {
        margin-top: 3rem;
        width: 20%;
        font-size: 0.9rem;
        .flex div {
          width: 40%;
        }
        .flex .text-left {
          width: 60%;
        }
      }
      .foots-div {
        height: 25rem;
        overflow: hidden;
        padding-bottom: 0;
        .right-space {
          height: 100%;
          width: 80%;
          font-size: 1rem;
          .left-foot,
          .right-foot {
            overflow: hidden;
            height: 100%;
            margin-right: 1px;
            img {
              height: 85%;
              padding: 1px;
            }
            .foot-label {
              height: 2.5rem;
              padding-top: 0.3rem;
              width: 100%;
              text-align: center;
              background-color: #4f95ef;
              color: white;
            }
          }
          .left-foot {
            width: 50%;
          }
          .right-foot {
            width: 49.5%;
          }
        }
      }
    }
    .third-area {      
      table {
        td {
          width: 40%;
          label {
            width: 30%;
            text-align: left;
            margin-right: 0;
            font-size: 0.8rem;
          }
          .label-title {
            display: none;
          }
          padding: 0.3rem 0px 0.3rem 0;
          .pullbox-label,
          .pullbox-select {
            width: 100%;
            font-size:1rem;
          }
          .hvMNwk {
            margin-top: 0px;
            margin-bottom: 0.5rem;
          }
        }
        .table-label {
          width: 20%;
          background-color: #74a6f4;
          text-align: center;
          color: white;
        }
        .col-md-2 {
          padding: 0;
          max-width: 16%;
          label {
            width: 100%;
          }
        }
        .col-md-1 {
          padding: 0;
        }
      }
      .ml-30 {
        margin-left: 1.875rem;
        max-width: 14% !important;
      }
      .mwp-11 {
        max-width: 11% !important;
      }
      .td-input {
        max-width: 17% !important;
        label {
          width: 0px !important;
        }
        input {
          height: 1.5rem;
          padding: 0;
        }
        div {
          margin-top: -1px;
        }
      }
      .select-input-area{
        div{
          margin-top:0;
          margin-bottom:6px;
        }
      }
    }
  }

  .radio-label {
    width: 9rem;
    padding-top: 0.625rem;
    text-align: right;
  }
  .prev-content {
    .radio-btn label {
      width: 4.7rem;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 0.25rem;
      margin: 0 0.3rem;
      padding: 0.25rem 0.3rem;
      font-size: 1rem;
    }
  }
  .print-type {
    .radio-btn label {
      width: 2rem;
      border: solid 1px rgb(206, 212, 218);
      border-radius: 0.25rem;
      margin: 0 0.3rem;
      padding: 0.25rem 0.3rem;
      font-size: 1rem;
    }
  }
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .label-box {
    font-size: 1rem;
    border: 1px solid #a0a0a0;
  }
  .prev-session {
    width: 55%;
    padding-left: 5%;
  }
  .pt-20 {
    padding-top: 1.25rem;
  }
  .pt-10 {
    padding-top: 0.625rem;
  }
  .pt-12 {
    padding-top: 0.75rem;
  }
  .padding-top-5 {
    padding-top: 0.3rem;
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
  .wp-50 {
    width: 50%;
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
    height: calc(100% - 8.875rem);
  }
  .shoes_kind_text {
    width: calc(70% - 4rem);
    margin-left: 0.625rem;
  }
  .shoes_kind_check {
    position: relative;
    top: 0.25rem;
    height: 1rem;
    cursor: pointer;
    width: 1rem !important;
  }
  .care_text {
    width: calc(70% - 2.5rem);
  }
  .content_other_text {
    width: calc(70% - 2.5rem);
  }
  .footer {
    margin-top: 1.25rem;
    button span {
      font-size: 1rem;
    }
  }
  .can_self_caregiver {
    input {
      height: 1.25rem;
      width: 60%;
    }
  }
  .right-btn{
    right: 10px;
  }
`;

const ContextMenuUl = styled.ul`
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
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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

const ContextMenu = ({ visible, x, y, parent }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div onClick={() => parent.contextMenuAction("edit")}>編集</div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};
const ContextAntiMenu = ({ visible, x, y, parent }) => {
  if (visible) {    
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {(parent.state.medicine_item === undefined || parent.state.medicine_item.is_recent ==1) && (
            <li><div onClick={() => parent.contextMenuAction("anti_insert")}>登録</div></li>
          )}
          {(parent.state.medicine_item != undefined && parent.state.medicine_item.is_recent ==1) && (
            <li><div onClick={() => parent.contextMenuAction("anti_stop")}>中止</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class FootCareBody extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let category_list = ["処置", "観察", "その他"];
    let fontaine_classification_list = ["I","II","III","IV",renderHTML("&nbsp;")];
    let patientInfo = this.props.patientInfo;
    let carried_check_list = {
      観察: false,
      足浴: false,
      爪切り: false,
      やすり: false,
      グラインダー: false,
      洗浄: false,
      消毒: false,
      軟膏処置: false,
      保湿ケア: false,
    };
    this.double_click = false;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    let medicine_master = sessApi.getObjectValue("dial_common_master", "medicine_master");
    this.medicine_codeData = makeList_code(medicine_master, 1);
    let assessment_codes_options = makeList_data(extract_enabled(code_master['フットケアアセスメント']));
    let objective_codes_options = makeList_data(extract_enabled(code_master['フットケア看護目標']));
    var instruction_doctor_number = undefined;
    if (authInfo.doctor_number > 0) instruction_doctor_number = authInfo.doctor_number;
    this.state = {
      alert_messages:'',
      instruction_doctor_number,
      category_list,
      fontaine_classification_list,
      system_patient_id:(patientInfo != undefined && patientInfo.system_patient_id != undefined && patientInfo.system_patient_id != null) ? patientInfo.system_patient_id : null,
      patientInfo,
      carried_check_list,
      foot_care_list: null,
      write_date: '',
      confirm_message: "",
      isShowStaffList: false,
      isFootsEditModal: false,
      imgLeftBase64: "",
      imgRightBase64: "",
      schedule_date: this.props.schedule_date,
      isDeleteConfirmModal: false,
      isOpenConfirmModal: false,
      isEditConfirmModal: false,
      change_flag: 0,
      tmpItem: null,
      is_loaded: false,
      created_by:authInfo.user_number,
      check_message:"",
      assessment_codes_options,
      objective_codes_options,
      foot_care_examination:[],
      load_foot_care_examination:false,
      isOpenMedicinePanel:false,
    };
    this.registering_flag = false;
    this.openModalTime = null;
    this.resetState(null);
    sessApi.remove('dial_change_flag');

    this.latest_version = 1;
    this.left_footcare_background_base64 = "";
    this.right_footcare_background_base64 = "";    
    // get footcare background image
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if(initState !== undefined && 
      initState != null && 
      initState.dial_footcare_version_info !== undefined && 
      initState.dial_footcare_version_info.latest_version != undefined && 
      initState.dial_footcare_version_info.latest_version > 0 ){
      let dial_footcare_version_info = initState.dial_footcare_version_info;
      this.latest_version = dial_footcare_version_info.latest_version;      
      this.getFootcareImageInfo(this.latest_version);
    }    
  }  
  
  async componentDidMount() {
    
    this.latest_version = 1;
    this.left_footcare_background_base64 = "";
    this.right_footcare_background_base64 = "";  
    // get footcare background image
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if(initState !== undefined && 
      initState != null && 
      initState.dial_footcare_version_info !== undefined && 
      initState.dial_footcare_version_info.latest_version != undefined && 
      initState.dial_footcare_version_info.latest_version > 0 ){
      let dial_footcare_version_info = initState.dial_footcare_version_info;
      this.latest_version = dial_footcare_version_info.latest_version;      
      this.getFootcareImageInfo(this.latest_version);
    }    

    let server_time = await getServerTime();
    await this.getFootCareAntithrombotic(formatDateLine(new Date(server_time)));
    await this.getFootCareExamination(formatDateLine(new Date(server_time)));
    await this.getStaffs();
    await this.changeBackground();
    await this.getFootcareInfo(true);
    this.setState({
      is_loaded:true,
      load_foot_care_examination:true,
      write_date:new Date(server_time)
    });
  }

  getFootcareImageInfo = (_lastVersion = null) => {
    if (_lastVersion == null) return;

    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if(initState !== undefined && 
      initState != null && 
      initState.dial_footcare_version_info !== undefined && 
      initState.dial_footcare_version_info.latest_version != undefined && 
      initState.dial_footcare_version_info.latest_version > 0 ){
      let dial_footcare_version_info = initState.dial_footcare_version_info;  

      // set latest version
      this.latest_version = _lastVersion;    

      // set left and right image base64
      if (dial_footcare_version_info.version_infos != undefined && dial_footcare_version_info.version_infos.length > 0) {
        dial_footcare_version_info.version_infos.map(item=>{
          if (item.image_version_number == _lastVersion) {
            if (item.left_image_base64 != undefined && item.left_image_base64 != "") {
              this.left_footcare_background_base64 = item.left_image_base64;
            }
            if (item.right_image_base64 != undefined && item.right_image_base64 != "") {
              this.right_footcare_background_base64 = item.right_image_base64;
            }
          }
        });
      }
    }
  }
  
  getFootCareExamination=async(write_date)=>{
    if (this.state.system_patient_id == null) {
      return;
    }
    if(this.state.load_foot_care_examination){
      this.setState({load_foot_care_examination:false});
    }
    let path = "/app/api/v2/dial/board/footcare/get/examination_info";
    await apiClient
      ._post(path, {params: {
        write_date,
        system_patient_id:this.state.system_patient_id,
      }})
      .then((res) => {
        this.setState({
          foot_care_examination:res,
          load_foot_care_examination:true,
        });
      })
      .catch(() => {});
  }
  
  getFootCareAntithrombotic=async(write_date)=>{
    if (this.state.system_patient_id == null) {
      return;
    }
    let path = "/app/api/v2/dial/board/footcare/get_antithrombotic";
    await apiClient
      ._post(path, {params: {
        write_date,
        system_patient_id:this.state.system_patient_id,
      }})
      .then((res) => {
        this.setState({
          antithrombotic:res,
        });
        let medicine_item = {};
        if (res.value != undefined) {
          medicine_item.code = res.value;
          medicine_item.name = this.medicine_codeData[res.value] !== undefined ? this.medicine_codeData[res.value] : "";
          medicine_item.is_recent = res.is_recent,
          this.setState({
            medicine_item
          });
        } else {
          this.setState({medicine_item: undefined});
        }
      })
      .catch(() => {});
  }
  
  componentDidUpdate () {
    this.changeBackground();
  }
  
  changeBackground = () => {
    medicalInformationValidate("foot_care", this.state, "background");
  }
  
  setChangeFlag=(change_flag)=>{
    if (!(this.state.system_patient_id > 0)) return;
    this.setState({change_flag});
    if (change_flag){
      sessApi.setObjectValue('dial_change_flag', 'foot_care', 1)
    } else {
      sessApi.remove('dial_change_flag');
    }
  };
  
  componentWillUnmount() {
    sessApi.remove('dial_change_flag');

    this.double_click = null;
    this.medicine_codeData = null;
    this.registering_flag = null;
    this.openModalTime = null;        
    
    var html_obj = document.getElementsByClassName("foott_care_wrapper")[0];
    if(html_obj !== undefined && html_obj != null){
        html_obj.innerHTML = "";
    }
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    // ●DN574 フットケア画像の左端余白が極端に小さい
    this.latest_version = 1;
    this.left_footcare_background_base64 = "";
    this.right_footcare_background_base64 = "";  
    // get footcare background image
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if(initState !== undefined && 
      initState != null && 
      initState.dial_footcare_version_info !== undefined && 
      initState.dial_footcare_version_info.latest_version != undefined && 
      initState.dial_footcare_version_info.latest_version > 0 ){
      let dial_footcare_version_info = initState.dial_footcare_version_info;
      this.latest_version = dial_footcare_version_info.latest_version;      
      this.getFootcareImageInfo(this.latest_version);
    }

    if (nextProps.patientInfo != undefined && nextProps.patientInfo != null) {
      if (nextProps.patientInfo.system_patient_id !== this.state.system_patient_id || nextProps.schedule_date != this.state.schedule_date) {
        this.setState({
          system_patient_id: nextProps.patientInfo.system_patient_id,
          schedule_date: nextProps.schedule_date,
          patientInfo: nextProps.patientInfo,
          selected_number: 0,
          foot_care_list: null,
        },async() => {
          await this.resetState(null);
          if (this.state.schedule_date != undefined){
            await this.getFootCareAntithrombotic(formatDateLine(new Date(this.state.schedule_date)));
          } else {
            await this.getFootCareAntithrombotic(formatDateLine(new Date(this.state.write_date)));
          }
          
          await this.getFootCareExamination(formatDateLine(new Date(this.state.write_date)));
          await this.getFootcareInfo(true);
        });
      }
    }
  }
  
  resetState =async(data) => {
    let server_time = await getServerTime();
    let carried_check_list = {
      観察: false,
      足浴: false,
      爪切り: false,
      やすり: false,
      グラインダー: false,
      洗浄: false,
      消毒: false,
      軟膏処置: false,
      保湿ケア: false,
    };
    if (data != undefined && data != null) {
      var carried_contents = data.carried_out_content_checkbox;
      carried_contents =
        carried_contents != "" &&
        carried_contents != undefined &&
        carried_contents != null
          ? carried_contents.split(",")
          : [];
      Object.keys(carried_check_list).map((key) => {
        if (carried_contents.indexOf(key) > -1) carried_check_list[key] = true;
      });
    }
    this.setChangeFlag(0);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.setState({
      carried_check_list,
      selected_number: data != undefined && data != null ? data.number : 0,
      number: data != undefined && data != null ? data.number : 0,
      created_by: data != undefined && data != null ? data.created_by : authInfo.user_number,
      write_date:data != undefined && data != null && data.write_date != "" ? new Date(data.write_date) : new Date(server_time),
      next_scheduled_date:data != undefined && data != null && data.next_scheduled_date != "" ? new Date(data.next_scheduled_date) : "",
      category: data != undefined && data != null ? data.category : "",
      fontaine_classification:data != undefined && data != null ? data.fontaine_classification : "",
      left_foot_dorsal_artery:data != undefined && data != null ? data.left_foot_dorsal_artery : "",
      right_foot_dorsal_artery:data != undefined && data != null ? data.right_foot_dorsal_artery : "",
      left_posterior_tibial_artery:data != undefined && data != null ? data.left_posterior_tibial_artery : "",
      right_posterior_tibial_artery:data != undefined && data != null ? data.right_posterior_tibial_artery : "",
      left_popliteal_artery: data != undefined && data != null ? data.left_popliteal_artery : "",
      right_popliteal_artery: data != undefined && data != null ? data.right_popliteal_artery : "",
      left_skin_color: data != undefined && data != null ? data.left_skin_color : "",
      right_skin_color: data != undefined && data != null ? data.right_skin_color : "",
      left_perception: data != undefined && data != null ? data.left_perception : "",
      right_perception:data != undefined && data != null ? data.right_perception : "",
      footwear: data != undefined && data != null ? data.footwear : "",
      sock_wear: data != undefined && data != null ? data.sock_wear : "",
      can_self_care: data != undefined && data != null ? data.can_self_care : null,
      can_self_caregiver: data != undefined && data != null ? data.can_self_caregiver : "",
      foot_care_assessment_1_code: data != undefined && data != null ? data.foot_care_assessment_1_code : "",
      foot_care_assessment_2_code: data != undefined && data != null ? data.foot_care_assessment_2_code : "",
      foot_care_assessment_3_code: data != undefined && data != null ? data.foot_care_assessment_3_code : "",
      foot_care_assessment_1_text: data != undefined && data != null ? data.foot_care_assessment_1_text : "",
      foot_care_assessment_2_text: data != undefined && data != null ? data.foot_care_assessment_2_text : "",
      foot_care_assessment_3_text: data != undefined && data != null ? data.foot_care_assessment_3_text : "",
      foot_care_objective_1_code: data != undefined && data != null ? data.foot_care_objective_1_code : "",
      foot_care_objective_2_code: data != undefined && data != null ? data.foot_care_objective_2_code : "",
      foot_care_objective_3_code: data != undefined && data != null ? data.foot_care_objective_3_code : "",
      foot_care_objective_1_text: data != undefined && data != null ? data.foot_care_objective_1_text : "",
      foot_care_objective_2_text: data != undefined && data != null ? data.foot_care_objective_2_text : "",
      foot_care_objective_3_text: data != undefined && data != null ? data.foot_care_objective_3_text : "",
      carried_out_content_checkbox: data != undefined && data != null ? data.carried_out_content_checkbox : [],
      carried_out_content_text_1: data != undefined && data != null ? data.carried_out_content_text_1 : "",
      carried_out_content_text_2: data != undefined && data != null ? data.carried_out_content_text_2 : "",
      carried_out_content_text_3: data != undefined && data != null ? data.carried_out_content_text_3 : "",
      carried_out_content_text_4: data != undefined && data != null ? data.carried_out_content_text_4 : "",
      instructed_content_observation: data != undefined && data != null ? data.instructed_content_observation : 0,
      instructed_content_footwear: data != undefined && data != null ? data.instructed_content_footwear : 0,
      instructed_content_everyday_life: data != undefined && data != null ? data.instructed_content_everyday_life : 0,
      instructed_content_nail_cutting: data != undefined && data != null ? data.instructed_content_nail_cutting : 0,
      instructed_content_other: data != undefined && data != null ? data.instructed_content_other : 0,
      instructed_content_text_1: data != undefined && data != null ? data.instructed_content_text_1 : "",
      instructed_content_text_2: data != undefined && data != null ? data.instructed_content_text_2 : "",
      instructed_content_text_3: data != undefined && data != null ? data.instructed_content_text_3 : "",
      instructed_content_text_4: data != undefined && data != null ? data.instructed_content_text_4 : "",
      instructed_content_text_5: data != undefined && data != null ? data.instructed_content_text_5 : "",
      history: data != undefined && data != null ? data.history : "",
      imgLeftBase64: data != undefined && data != null && data.imgLeftBase64 != undefined ? data.imgLeftBase64 : "",
      imgRightBase64: data != undefined && data != null && data.imgRightBase64 != undefined ? data.imgRightBase64 : "",      
    });
  };
  
  getFootcareInfo = async (init = false) => {
    if (this.state.system_patient_id == null) {
      return;
    }
    if(this.state.is_loaded){
      this.setState({is_loaded:false});
    }
    let path = "/app/api/v2/dial/board/footcare/search";
    await apiClient
      ._post(path, {
        params: {
          system_patient_id:this.state.system_patient_id,
        },
      })
      .then((res) => {
        if (res.length > 0) {
          this.setState({
            foot_care_list: res,
            is_loaded:true,
          });
          let check_flag = false;
          let write_date_check_flag = false;
          var selected_item = null;
          res.map((item, index) => {
            let next_scheduled_date = new Date(item.next_scheduled_date);
            let schedule_date = new Date(this.state.schedule_date);
            if (init == true && this.state.schedule_date == item.write_date){
              selected_item = item;
            }
            if (schedule_date.getTime() - 7 * 24 * 3600 * 1000 <= next_scheduled_date.getTime() && schedule_date.getTime() + 7 * 24 * 3600 * 1000 >= next_scheduled_date.getTime()){
              check_flag = true;
              res.map((second_item, second_index) => {
                if (index != second_index){
                  let write_date = new Date(second_item.write_date);
                  if (next_scheduled_date.getTime() - 7 * 24 * 3600 * 1000 <= write_date.getTime() && next_scheduled_date.getTime() + 7 * 24 * 3600 * 1000 >= write_date.getTime()){
                    write_date_check_flag = true;
                  }
                }
              })
            }
          });
          if (init == true) this.handleSelectHistory(selected_item);
          if (check_flag) {
            if (write_date_check_flag){
              this.props.checkFootCare(1);
            } else {
              this.props.checkFootCare(0);
            }
          } else {
            this.props.checkFootCare(2);
          }
        } else {
          this.setState({
            foot_care_list: null,
            selected_number: 0,
            is_loaded:true,
          },async() => {
            await this.resetState(null);
          });
          this.props.checkFootCare(2);
        }
      })
      .catch(() => {});
  };
  
  SelectCategory = (e) => {
    this.setChangeFlag(1);
    this.setState({ category: e.target.value });
  };
  
  SelectFontaine = (e) => {
    this.setChangeFlag(1);
    this.setState({ fontaine_classification: e.target.value });
  };
  
  getNextCheckDate = (value) => {
    this.setChangeFlag(1);
    this.setState({ next_scheduled_date: value });
  };
  
  showStaffList = (e) => {

    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e != undefined && (e.target.type == undefined || e.target.type != "text")) return;
    
    this.setState({ isShowStaffList: true });
  };
  
  getRadio = (name, value) => {    
    this.setChangeFlag(1);
    if (this.state[name] == value) value = '';
    switch (name) {
      case "left_foot_dorsal_artery":
        this.setState({ left_foot_dorsal_artery: value });
        break;
      case "right_foot_dorsal_artery":
        this.setState({ right_foot_dorsal_artery: value });
        break;
      case "left_posterior_tibial_artery":
        this.setState({ left_posterior_tibial_artery: value });
        break;
      case "right_posterior_tibial_artery":
        this.setState({ right_posterior_tibial_artery: value });
        break;
      case "left_popliteal_artery":
        this.setState({ left_popliteal_artery: value });
        break;
      case "right_popliteal_artery":
        this.setState({ right_popliteal_artery: value });
        break;
      case "left_skin_color":
        this.setState({ left_skin_color: value });
        break;
      case "right_skin_color":
        this.setState({ right_skin_color: value });
        break;
      case "left_perception":
        this.setState({ left_perception: value });
        break;
      case "right_perception":
        this.setState({ right_perception: value });
        break;
      case "footwear":
        this.setState({
          footwear: value,
          custome_shoes_kind: 0,
        });
        break;
      case "sock_wear":
        this.setState({ sock_wear: value });
        break;
      case "can_self_care":
        this.setState({ can_self_care: value });
        break;
      case "instructed_content_observation":
        this.setState({ instructed_content_observation: value });
        break;
      case "instructed_content_footwear":
        this.setState({ instructed_content_footwear: value });
        break;
      case "instructed_content_everyday_life":
        this.setState({ instructed_content_everyday_life: value });
        break;
      case "instructed_content_nail_cutting":
        this.setState({ instructed_content_nail_cutting: value });
        break;
      case "instructed_content_other":
        this.setState({ instructed_content_other: value });
        break;
      case "carried_out_content_checkbox":
        var carried_contents = this.state.carried_out_content_checkbox;
        carried_contents =
          carried_contents != "" &&
          carried_contents != null &&
          carried_contents != undefined
            ? carried_contents.split(",")
            : [];
        var carried_check_list = this.state.carried_check_list;
        carried_check_list[value] = !carried_check_list[value];
        
        if (carried_check_list[value]) {
          carried_contents.push(value);
        } else {
          var index = carried_contents.indexOf(value);
          if (index > -1) carried_contents.splice(index, 1);
        }
        this.setState({
          carried_out_content_checkbox: carried_contents.join(),
          carried_check_list: carried_check_list,
        });
        break;
    }
  };

  getPerception = (name, value) => {
    var temp = this.state[name];     
    if (temp != undefined && temp != null && temp.includes(value)){      
      temp = temp.replace(value, '');
    } else {
      if (temp == undefined || temp == null) temp = '';
      temp += ' '+ value;
    }
    temp.trim();    
    this.setState({[name]:temp})
    this.setChangeFlag(1);
  }
  
  setCustomShoesKind = () => {
    this.setState({
      custome_shoes_kind: !this.state.custome_shoes_kind,
      footwear: "",
    });
  };
  
  getCustomshoesKind = (e) => {
    this.setState({ footwear: e.target.value });
  };
  
  getCarePerson = (e) => {
    this.setChangeFlag(1);
    this.setState({ can_self_caregiver: e.target.value });
  };
  
  getAssessmentCode = (index, e) => {
    this.setChangeFlag(1);
    switch (index) {
      case 1:
        this.setState({ foot_care_assessment_1_code: e.target.id });
        break;
      case 2:
        this.setState({ foot_care_assessment_2_code: e.target.id });
        break;
      case 3:
        this.setState({ foot_care_assessment_3_code: e.target.id });
        break;
    }
  };
  
  getAssessmentText = (index, e) => {
    this.setChangeFlag(1);
    switch (index) {
      case 1:
        this.setState({ foot_care_assessment_1_text: e.target.value });
        break;
      case 2:
        this.setState({ foot_care_assessment_2_text: e.target.value });
        break;
      case 3:
        this.setState({ foot_care_assessment_3_text: e.target.value });
        break;
    }
  };
  
  getObjectCode = (index, e) => {
    this.setChangeFlag(1);
    switch (index) {
      case 1:
        this.setState({ foot_care_objective_1_code: e.target.id });
        break;
      case 2:
        this.setState({ foot_care_objective_2_code: e.target.id });
        break;
      case 3:
        this.setState({ foot_care_objective_3_code: e.target.id });
        break;
    }
  };
  
  getObjectText = (index, e) => {
    this.setChangeFlag(1);
    switch (index) {
      case 1:
        this.setState({ foot_care_objective_1_text: e.target.value });
        break;
      case 2:
        this.setState({ foot_care_objective_2_text: e.target.value });
        break;
      case 3:
        this.setState({ foot_care_objective_3_text: e.target.value });
        break;
    }
  };
  
  getInstructedContentText = (index, e) => {
    this.setChangeFlag(1);
    switch (index) {
      case 1:
        this.setState({ instructed_content_text_1: e.target.value });
        break;
      case 2:
        this.setState({ instructed_content_text_2: e.target.value });
        break;
      case 3:
        this.setState({ instructed_content_text_3: e.target.value });
        break;
      case 4:
        this.setState({ instructed_content_text_4: e.target.value });
        break;
      case 5:
        this.setState({ instructed_content_text_5: e.target.value });
        break;
    }
  };
  
  createFootcare = async () => {
    
    if (this.registering_flag) {
      return;
    }
    if (this.state.change_flag == 0) return;
    let patientInfo = this.props.patientInfo;
    // let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    if (patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined) {
      return;
    }
    let validate_data = medicalInformationValidate("foot_care", this.state);
    if (validate_data['error_str_arr'].length > 0 ) {
      this.setState({
        check_message:validate_data['error_str_arr'].join('\n'),
        first_tag_id:validate_data['first_tag_id']
      });
      return;
    }
    if (this.state.number > 0) {
      this.setState({
        isEditConfirmModal: true,
        confirm_message: "フットケア情報を変更しますか?",
        confirm_alert_title:'変更確認'
      });
    } else {
      this.setState({
        isEditConfirmModal: true,
        confirm_message: "フットケア情報を登録しますか?",
        confirm_alert_title:'登録確認'
      });
    }
  };
  
  closeAlertModal = () => {
    this.setState({check_message: ''});
    $("#" + this.state.first_tag_id).focus();
  }
  
  delete = () => {
    if (!(this.state.system_patient_id >0)) return;
    if (!(this.state.selected_number > 0)) return;
    this.setState({
      isDeleteConfirmModal: true,
      confirm_message: "選択された履歴を削除しますか？",
      confirm_alert_title:'削除確認'
    });
  };
  
  deleteHistory =async() => {
    if (this.state.selected_number > 0) {
      let params = {
        number: this.state.selected_number,
        system_patient_id:this.state.system_patient_id,
        write_date:this.state.write_date
      };
      await this.resetState(null);
      let path = "/app/api/v2/dial/board/footcare/delete";
      apiClient
        .post(path, {
          params: params,
        })
        .then(async(res) => {
          this.setState({
            alert_messages:res.alert_messages,
            confirm_alert_title:res.alert_title,
          })
          await this.getFootcareInfo();
        })
        .catch(() => {});
    }
    this.confirmCancel();
  };
  
  selectHistory = (item) => {
    if (item.number == this.state.selected_number) return;
    if (this.state.change_flag == 1) {
      this.setState({
        isOpenConfirmModal: true,
        tmpItem: item,
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中',
      });
      return;
    }
    this.handleSelectHistory(item);
  };
  
  handleSelectHistory = (item) => {    
    // ●DN574 フットケア画像の左端余白が極端に小さい
    if (item.background_version_number != undefined && item.background_version_number != null && item.background_version_number > 0) {
      // this.latest_version = item.background_version_number;
      this.getFootcareImageInfo(item.background_version_number);
    }

    this.setState({
        selected_number: item.number,
        load_foot_care_examination: false,
      },async() => {
        await this.setChangeFlag(0);
        await this.resetState(item);
        await this.getFootCareAntithrombotic(formatDateLine(new Date(this.state.write_date)));
        await this.getFootCareExamination(formatDateLine(new Date(this.state.write_date)));
      }
    );
  }
  
  selectStaff = (staff) => {
    this.setChangeFlag(1);
    this.setState({
      created_by: staff.number,
    });
    this.closeModal();
  };
  
  closeModal = () => {
    this.setState({
      isShowStaffList: false,
      isFootsEditModal: false,
      isDeleteConfirmModal: false,
      isEditConfirmModal: false,
      isOpenMedicinePanel: false,
      alert_messages:'',
      confirm_alert_title:''
    });
  };
  
  handleCopyBeforeContent = () => {
    let footLists = this.state.foot_care_list;
    if (footLists == undefined || footLists == null) {
      return;
    }
    if (footLists.length > 0) {
      let data = footLists[0];
      // 2019年12月25日(水)
      if (data.write_date == undefined || data.write_date == null || data.write_date == "") {
        return;
      }
      this.setState({confirm_message: "入力中の内容を" + formatJapanDate(data.write_date) + "の内容で上書きしますか？"});
    }
  };
  
  confirmCancel = () => {
    this.setState({
      confirm_message: "",
      isDeleteConfirmModal: false,
      isEditConfirmModal: false,
      isOpenConfirmModal: false,
      tmpItem: null
    });
  };
  
  confirmOk =async() => {
    this.setState({
      confirm_message: "",
    });
    if (this.state.confirm_action == "anti_stop") {
      this.stopAnti();
      return;
    }
    let data = { ...this.state.foot_care_list[0] };
    // let data = footLists[0];
    if (data.write_date == undefined || data.write_date == null || data.write_date == "") {
      return;
    }
    data.number = null;
    data.next_scheduled_date = "";
    data.write_date = "";
    data.created_by = 0;
    await this.resetState(data);
  };
  stopAnti = async () => {
    if (this.state.medicine_item === undefined || this.state.medicine_item.code === undefined) return;
    let path = "/app/api/v2/dial/board/footcare/stop_antithrombotic";
    await apiClient
      ._post(path, {params: {
          write_date:this.state.write_date != undefined && this.state.write_date != null && this.state.write_date != "" ? formatDateLine(new Date(this.state.write_date)):formatDateLine(new Date()),
          system_patient_id:this.state.system_patient_id,
          value:this.state.medicine_item.code,
        }}).then(res=>{
        if (res.alert_message != undefined)
        this.setState({
          alert_messages:res.alert_message,
          confirm_alert_title:'中止完了'
        })
      });
    await this.getFootCareAntithrombotic(formatDateLine(new Date(this.state.write_date)));
    
  }
  
  contextMenuAction = (act) => {
    if (act === "edit") {
      this.setState({isFootsEditModal: true});
    }
    else if (act === "anti_insert") {
      this.setState({
        isOpenMedicinePanel: true
      })
    } else if (act === "anti_stop") {
      if (this.state.medicine_item === undefined || this.state.medicine_item.name === undefined) return;
      this.setState({
        confirm_message: this.state.medicine_item.name + "を表示から外しますか？",
        confirm_title: "中止確認",
        confirm_action: "anti_stop"
      })
    }
  };
  
  handleClick = (e) => {
    if (!(this.state.system_patient_id > 0)) return;
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false },
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("foot-arae")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false },
          });
          document
            .getElementById("foot-arae")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      let off_x = 0;
      let off_y = 0;
      if (this.props.offset_x != null && this.props.offset_x != undefined && this.props.offset_x > 0) {
        off_x = this.props.offset_x;
      }
      if (this.props.offset_y != null && this.props.offset_y != undefined && this.props.offset_y > 0) {
        off_y = this.props.offset_y;
      }
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - off_x,
          y: e.clientY - off_y,
        },
      });
    }
  };
  
  handleMedicineClick = (e) => {
    if(!(this.state.system_patient_id > 0)) return;
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextAntiMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextAntiMenu: { visible: false },
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("footcare_antithrombotic")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextAntiMenu: { visible: false },
          });
          document
            .getElementById("footcare_antithrombotic")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      let off_x = 0;
      let off_y = 0;
      if (this.props.offset_x != null && this.props.offset_x != undefined && this.props.offset_x > 0) {
        off_x = this.props.offset_x;
      }
      if (this.props.offset_y != null && this.props.offset_y != undefined && this.props.offset_y > 0) {
        off_y = this.props.offset_y;
      }
      this.setState({
        contextAntiMenu: {
          visible: true,
          x: e.clientX - off_x,
          y: e.clientY - off_y,
          medicine_item: this.state.medicine_item
        },
      });
    }
  };
  
  handleOk = () => {
    this.setState({isFootsEditModal: false,});
  };
  
  registerFootImage = (img_base64_left, img_base64_right) => {
    this.setChangeFlag(1);
    this.setState({
      imgLeftBase64: img_base64_left,
      imgRightBase64: img_base64_right,
      isFootsEditModal: false,
    });
  };
  
  handleEdit = async () => {
    this.setState({
      isEditConfirmModal: false,
      confirm_message: "",
      is_loaded: false,
    });    
    if (this.state.number > 0) {
      if (this.double_click) return;
      this.double_click = true;
      let path = "/app/api/v2/dial/board/footcare/register";
      apiClient
        .post(path, {
          params: this.state,
        })
        .then(async(res) => {
          this.setState({
            alert_messages:'登録しました。',
            confirm_alert_title:'登録完了'
          })
          await this.getFootcareInfo();
          this.handleSelectHistory(res);
        })
        .catch(() => {})
        .finally(() => {
          this.double_click = false;          
        });
    } else {
      if (this.openModalTime != null && new Date().getTime() - this.openModalTime < 1000){
        return;
      }
      this.registering_flag = true;
      let post_data = this.state;
      post_data.latest_version = this.latest_version;
      let path = "/app/api/v2/dial/board/footcare/register";
      await apiClient
        .post(path, {
          params: post_data,
        })
        .then(async(res) => {
          this.setState({
            alert_messages:'保存しました。',
            confirm_alert_title:'登録完了'
          })          
          this.registering_flag = false;
          await this.getFootcareInfo();
          this.handleSelectHistory(res);
        })
        .catch(() => {})
        .finally(() => {
          this.registering_flag = false;
          this.openModalTime = new Date().getTime();
          this.confirmCancel();          
        });
    }    
  };
  
  confirmCloseOk = () => {
    this.setState({
      isOpenConfirmModal: false,
      confirm_message: ""
    },()=>{
      this.handleSelectHistory(this.state.tmpItem);
    });
  }
  
  selectMaster = async (item) => {
    let medicine_item = {};
    medicine_item.code = item.code;
    medicine_item.name = item.name;
    this.setState({
      medicine_item,
      isOpenMedicinePanel: false,
    });
    let path = "/app/api/v2/dial/board/footcare/register_antithrombotic";
    await apiClient
      ._post(path, {params: {
          // write_date:this.state.write_date != undefined && this.state.write_date != null && this.state.write_date != "" ? formatDateLine(new Date(this.state.write_date)):formatDateLine(new Date()),
          write_date: this.state.schedule_date != undefined && this.state.schedule_date != null && this.state.schedule_date != ''?formatDateLine(new Date(this.state.schedule_date)):formatDateLine(new Date()),
          system_patient_id:this.state.system_patient_id,
          value:item.code,
        }}).then(res=>{
          if (res.alert_message != undefined)
            this.getFootCareAntithrombotic(this.state.write_date);
            this.setState({
              alert_messages:res.alert_message,
              confirm_alert_title:'登録完了'
            })            
      })
    
  };
  
  render() {
    let foot_care_list = [];
    if (this.state.foot_care_list != undefined) {
      foot_care_list = this.state.foot_care_list;
    }
    let {system_patient_id, patientInfo, assessment_codes_options,objective_codes_options,staff_list_by_number, load_foot_care_examination, foot_care_examination} = this.state;
    return (
      <Wrapper className="foott_care_wrapper">
        {this.state.is_loaded ? (
          <>
            <div className="flex hp-100">
              <div className="main-content">
                <div className="left-area">
                  <div className="main-info">
                    <p>基本情報</p>
                    <div className="box-border" style={{background:"#eee"}}>
                      <div className="flex">
                        <div className="wp-30 border" style={{backgroundImage:"linear-gradient(to bottom, white, blue)"}}>DM</div>
                        <div className="wp-70" style={{background:"#aaa"}}>
                          {patientInfo != undefined && patientInfo.DM != undefined && patientInfo.DM == 0 ? "無":""}
                          {patientInfo != undefined && patientInfo.DM != undefined && patientInfo.DM == 1 ? "有":""}
                        </div>
                      </div>
                      <div className={`flex`} onContextMenu={(e) => this.handleMedicineClick(e)} id="footcare_antithrombotic">
                        <div className="wp-30">抗血栓薬</div>
                        <div className="wp-70">
                          {this.state.medicine_item != undefined && this.state.medicine_item.name != undefined ? this.state.medicine_item.name : "未設定"}
                        </div>
                      </div>
                      <div>
                        {load_foot_care_examination ? (
                          <>
                            {foot_care_examination.length > 0 && (
                              foot_care_examination.map(examination=>{
                                return (
                                  <>
                                    <div className="flex">
                                      <div className="wp-30">{examination.title != undefined ? examination.title : ''}</div>
                                      <div className="wp-70 flex">
                                        <div style={{width:"50%", textAlign:"center"}}>{examination.left_item_value}</div>
                                        <div style={{width:"50%", textAlign:"center"}}>{examination.right_item_value}</div>
                                      </div>
                                    </div>
                                  </>
                                )
                              })
                            )}
                          </>
                        ):(
                          <SpinnerWrapper style={{height:"4rem"}}>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                        )}
                        
                      </div>
                      <div className="flex padding-top-5">
                        <div className="wp-30"></div>
                        <div className="wp-35"></div>
                        <div className="wp-35"></div>
                      </div>
                      <div className="flex padding-top-5">
                        <div className="wp-30"></div>
                        <div className="wp-35"></div>
                        <div className="wp-35"></div>
                      </div>
                      <div className="flex padding-top-5">
                        <div className="wp-30"></div>
                        <div className="wp-70"></div>
                      </div>
                      <div className="flex padding-top-5">
                        <div className="wp-30"></div>
                        <div className="wp-35"></div>
                        <div className="wp-35"></div>
                      </div>
                    </div>
                  </div>
                  <div className="history-list">
                    <div className="flex">
                      <div className="text-left history-title">履歴一覧</div>
                      {system_patient_id >0 && this.state.selected_number > 0 ? (
                        <div className="text-right history-delete pt-10" onClick={this.delete}>
                          <Icon icon={faTrash} />選択された履歴を削除
                        </div>
                      ):(
                        <div className="text-right history-delete pt-10 disabled">
                        <Icon icon={faTrash} />選択された履歴を削除
                        </div>
                      )}
                    </div>
                    <div className="box-border">
                      <table className="table-scroll table table-bordered">
                        <tbody>
                        {foot_care_list !== undefined && foot_care_list !== null && foot_care_list.length > 0 && foot_care_list.map((item) => {
                          return (
                            <>
                              <tr
                                className={this.state.selected_number === item.number ? "table-row selected-history" : "table-row"}
                                onClick={() => this.selectHistory(item)}
                              >
                                <td>{formatDateSlash(new Date(item.write_date))}{" "}{item.category}</td>
                              </tr>
                            </>
                          );
                        })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="right-area">
                  <div className="first-area">
                    <div className="flex">
                      <div className="entry-date">
                        <InputWithLabel
                          label="記載日"
                          type="text"
                          diseaseEditData={formatJapanDateSlash(formatDateLine(this.state.write_date))}
                          readonly
                        />
                        <InputWithLabelBorder
                          label="次回予定日"
                          type="date"
                          id='next_scheduled_date_id'
                          getInputText={this.getNextCheckDate}
                          diseaseEditData={this.state.next_scheduled_date}
                        />
                        <div
                          className="staff remove-x-input cursor-input"                          
                          onClick={(e)=>this.showStaffList(e).bind(this)}
                        >
                          <InputWithLabel
                            label="記載スタッフ"
                            type="text"
                            isDisabled={true}
                            diseaseEditData={
                              staff_list_by_number != undefined &&
                              this.state.created_by > 0
                                ? staff_list_by_number[this.state.created_by]
                                : ""
                            }
                          />
                        </div>
                      </div>
                      <div className="prev-session">
                        <div
                          className="label-box"
                          onClick={() => this.handleCopyBeforeContent()}
                        >
                          前回の内容をコピー
                        </div>
                        <div className="flex pt-12">
                          <div className="radio-label">内容</div>
                          <div className="prev-content">
                            <>
                              {this.state.category_list.map((item, key) => {
                                return (
                                  <>
                                    <RadioButton
                                      id={`category_${key}`}
                                      value={item}
                                      label={item}
                                      name="category"
                                      getUsage={this.SelectCategory}
                                      checked={
                                        this.state.category == item
                                          ? true
                                          : false
                                      }
                                    />
                                  </>
                                );
                              })}
                            </>
                          </div>
                        </div>
                        <div className="flex pt-12">
                          <div className="radio-label">フォンテイン分類</div>
                          <div className="print-type">
                            <>
                              {this.state.fontaine_classification_list.map(
                                (item, key) => {
                                  return (
                                    <>
                                      <RadioButton
                                        id={`fontaine_classification_${key}`}
                                        value={item}
                                        label={item}
                                        name="fontaine_classification"
                                        getUsage={this.SelectFontaine}
                                        checked={
                                          this.state.fontaine_classification ===
                                          item
                                            ? true
                                            : false
                                        }
                                      />
                                    </>
                                  );
                                }
                              )}
                            </>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="second-area pt-20">
                    <div className="flex foots-div">
                      <div className="left-space">
                        <div className="flex">
                          <div>①白癬</div>
                          <div className="text-left">②爪白癬</div>
                        </div>
                        <div className="flex padding-top-5">
                          <div>③巻爪</div>
                          <div className="text-left">④胼胝</div>
                        </div>
                        <div className="flex padding-top-5">
                          <div>⑤鶏眼</div>
                          <div className="text-left">⑥硬化・肥厚</div>
                        </div>
                        <div className="flex padding-top-5">
                          <div>⑦乾燥</div>
                          <div className="text-left">⑧亀裂</div>
                        </div>
                        <div className="flex padding-top-5">
                          <div>⑨発赤</div>
                          <div className="text-left">⑩水泡</div>
                        </div>
                        <div className="flex padding-top-5">
                          <div>⑪潰痬</div>
                          <div className="text-left">⑫外傷</div>
                        </div>
                        <div className="flex padding-top-5">
                          <div>⑬浮腫</div>
                          <div className="text-left">⑭変形</div>
                        </div>
                      </div>
                      <div
                        className="right-space flex" id="foot-arae" onContextMenu={(e) => this.handleClick(e)} style={{paddingBottom:0}}>
                        <div className="left-foot">
                          <div className="foot-label">左足</div>
                          <img src={this.state.imgLeftBase64 != "" ? this.state.imgLeftBase64 : this.left_footcare_background_base64 != "" ? this.left_footcare_background_base64 : bg_img_foot_left_display}/>
                        </div>
                        <div className="right-foot">
                          <div className="foot-label">右足</div>
                          <img src={this.state.imgRightBase64 != "" ? this.state.imgRightBase64 : this.right_footcare_background_base64 != "" ? this.right_footcare_background_base64 : bg_img_foot_right_display}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="third-area">
                    <table className="table table-bordered table-striped table-hover" id="code-table" style={{marginTop:"-1rem"}}>
                      <tr>
                        <td className="table-label">足背動脈</td>
                        <td style={{textAlign:"left", paddingLeft:"1rem"}}>
                          <Checkbox
                            label="良"
                            getRadio={this.getRadio.bind(this)}
                            number="良"
                            value={this.state.right_foot_dorsal_artery == "良"}
                            name="right_foot_dorsal_artery"
                          />
                          <Checkbox
                            label="弱"
                            getRadio={this.getRadio.bind(this)}
                            number="弱"
                            value={this.state.right_foot_dorsal_artery == "弱"}
                            name="right_foot_dorsal_artery"
                          />
                          <Checkbox
                            label="不可"
                            getRadio={this.getRadio.bind(this)}
                            number="不可"
                            value={
                              this.state.right_foot_dorsal_artery == "不可"
                            }
                            name="right_foot_dorsal_artery"
                          />
                        </td>
                        <td style={{textAlign:"left", paddingLeft:"1rem"}}>
                          <Checkbox
                            label="良"
                            getRadio={this.getRadio.bind(this)}
                            number={"良"}
                            value={this.state.left_foot_dorsal_artery == "良"}
                            name="left_foot_dorsal_artery"
                          />
                          <Checkbox
                            label="弱"
                            getRadio={this.getRadio.bind(this)}
                            number={"弱"}
                            value={this.state.left_foot_dorsal_artery == "弱"}
                            name="left_foot_dorsal_artery"
                          />
                          <Checkbox
                            label="不可"
                            getRadio={this.getRadio.bind(this)}
                            number={"不可"}
                            value={this.state.left_foot_dorsal_artery == "不可"}
                            name="left_foot_dorsal_artery"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="table-label">後脛骨動脈</td>
                        <td style={{textAlign:"left", paddingLeft:"1rem"}}>
                          <Checkbox
                            label="良"
                            getRadio={this.getRadio.bind(this)}
                            number="良"
                            value={
                              this.state.right_posterior_tibial_artery == "良"
                            }
                            name="right_posterior_tibial_artery"
                          />
                          <Checkbox
                            label="弱"
                            getRadio={this.getRadio.bind(this)}
                            number="弱"
                            value={
                              this.state.right_posterior_tibial_artery == "弱"
                            }
                            name="right_posterior_tibial_artery"
                          />
                          <Checkbox
                            label="不可"
                            getRadio={this.getRadio.bind(this)}
                            number="不可"
                            value={
                              this.state.right_posterior_tibial_artery == "不可"
                            }
                            name="right_posterior_tibial_artery"
                          />
                        </td>
                        <td style={{textAlign:"left", paddingLeft:"1rem"}}>
                          <Checkbox
                            label="良"
                            getRadio={this.getRadio.bind(this)}
                            number="良"
                            value={
                              this.state.left_posterior_tibial_artery == "良"
                            }
                            name="left_posterior_tibial_artery"
                          />
                          <Checkbox
                            label="弱"
                            getRadio={this.getRadio.bind(this)}
                            number="弱"
                            value={
                              this.state.left_posterior_tibial_artery == "弱"
                            }
                            name="left_posterior_tibial_artery"
                          />
                          <Checkbox
                            label="不可"
                            getRadio={this.getRadio.bind(this)}
                            number="不可"
                            value={
                              this.state.left_posterior_tibial_artery == "不可"
                            }
                            name="left_posterior_tibial_artery"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="table-label">膝 動脈</td>
                        <td style={{textAlign:"left", paddingLeft:"1rem"}}>
                          <Checkbox
                            label="良"
                            getRadio={this.getRadio.bind(this)}
                            number="良"
                            value={this.state.right_popliteal_artery == "良"}
                            name="right_popliteal_artery"
                          />
                          <Checkbox
                            label="弱"
                            getRadio={this.getRadio.bind(this)}
                            number="弱"
                            value={this.state.right_popliteal_artery == "弱"}
                            name="right_popliteal_artery"
                          />
                          <Checkbox
                            label="不可"
                            getRadio={this.getRadio.bind(this)}
                            number="不可"
                            value={this.state.right_popliteal_artery == "不可"}
                            name="right_popliteal_artery"
                          />
                        </td>
                        <td style={{textAlign:"left", paddingLeft:"1rem"}}>
                          <Checkbox
                            label="良"
                            getRadio={this.getRadio.bind(this)}
                            number="良"
                            value={this.state.left_popliteal_artery == "良"}
                            name="left_popliteal_artery"
                          />
                          <Checkbox
                            label="弱"
                            getRadio={this.getRadio.bind(this)}
                            number="弱"
                            value={this.state.left_popliteal_artery == "弱"}
                            name="left_popliteal_artery"
                          />
                          <Checkbox
                            label="不可"
                            getRadio={this.getRadio.bind(this)}
                            number="不可"
                            value={this.state.left_popliteal_artery == "不可"}
                            name="left_popliteal_artery"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="table-label">足の皮膚色</td>
                        <td style={{textAlign:"left", paddingLeft:"1rem"}}>
                          <Checkbox
                            label="蒼白"
                            getRadio={this.getRadio.bind(this)}
                            number="蒼白"
                            value={this.state.right_skin_color == "蒼白"}
                            name="right_skin_color"
                          />
                          <Checkbox
                            label="暗褐色"
                            getRadio={this.getRadio.bind(this)}
                            number="暗褐色"
                            value={this.state.right_skin_color == "暗褐色"}
                            name="right_skin_color"
                          />
                          <Checkbox
                            label="発赤"
                            getRadio={this.getRadio.bind(this)}
                            number="発赤"
                            value={this.state.right_skin_color == "発赤"}
                            name="right_skin_color"
                          />
                        </td>
                        <td style={{textAlign:"left", paddingLeft:"1rem"}}>
                          <Checkbox
                            label="蒼白"
                            getRadio={this.getRadio.bind(this)}
                            number="蒼白"
                            value={this.state.left_skin_color == "蒼白"}
                            name="left_skin_color"
                          />
                          <Checkbox
                            label="暗褐色"
                            getRadio={this.getRadio.bind(this)}
                            number="暗褐色"
                            value={this.state.left_skin_color == "暗褐色"}
                            name="left_skin_color"
                          />
                          <Checkbox
                            label="発赤"
                            getRadio={this.getRadio.bind(this)}
                            number="発赤"
                            value={this.state.left_skin_color == "発赤"}
                            name="left_skin_color"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="table-label">足の知覚</td>
                        <td style={{textAlign:"left", paddingLeft:"1rem"}}>
                          <Checkbox
                            label="痛み"
                            getRadio={this.getPerception.bind(this)}
                            number="痛み"
                            // value={this.state.right_perception == "痛み"}
                            value={this.state.right_perception!= undefined && this.state.right_perception!=null && this.state.right_perception.includes('痛み')}
                            name="right_perception"
                          />
                          <Checkbox
                            label="冷感"
                            getRadio={this.getPerception.bind(this)}
                            number="冷感"
                            // value={this.state.right_perception == "冷感"}
                            value={this.state.right_perception!= undefined && this.state.right_perception!=null && this.state.right_perception.includes('冷感')}
                            name="right_perception"
                          />
                          <Checkbox
                            label="しびれ"
                            getRadio={this.getPerception.bind(this)}
                            number="しびれ"
                            // value={this.state.right_perception == "しびれ"}
                            value={this.state.right_perception!= undefined && this.state.right_perception!=null && this.state.right_perception.includes('しびれ')}
                            name="right_perception"
                          />
                        </td>
                        <td style={{textAlign:"left", paddingLeft:"1rem"}}>
                          <Checkbox
                            label="痛み"
                            getRadio={this.getPerception.bind(this)}
                            number="痛み"
                            // value={this.state.left_perception == "痛み"}
                            value={this.state.left_perception!= undefined && this.state.left_perception!=null && this.state.left_perception.includes('痛み')}
                            name="left_perception"
                          />
                          <Checkbox
                            label="冷感"
                            getRadio={this.getPerception.bind(this)}
                            number="冷感"
                            // value={this.state.left_perception == "冷感"}
                            value={this.state.left_perception!= undefined && this.state.left_perception!=null && this.state.left_perception.includes('冷感')}
                            name="left_perception"
                          />
                          <Checkbox
                            label="しびれ"
                            getRadio={this.getPerception.bind(this)}
                            number="しびれ"
                            // value={this.state.left_perception == "しびれ"}
                            value={this.state.left_perception!= undefined && this.state.left_perception!=null && this.state.left_perception.includes('しびれ')}
                            name="left_perception"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="table-label">履物の種類</td>
                        <td colSpan="2" style={{textAlign:"left", paddingLeft:"1rem"}}>
                          <div className="wp-50 left">
                            <Checkbox
                              label="革靴"
                              getRadio={this.getRadio.bind(this)}
                              number="革靴"
                              value={this.state.footwear == "革靴"}
                              name="footwear"
                            />
                            <Checkbox
                              label="スニーカー"
                              getRadio={this.getRadio.bind(this)}
                              number="スニーカー"
                              value={this.state.footwear == "スニーカー"}
                              name="footwear"
                            />
                            <Checkbox
                              label="サンダル"
                              getRadio={this.getRadio.bind(this)}
                              number="サンダル"
                              value={this.state.footwear == "サンダル"}
                              name="footwear"
                            />
                          </div>
                          <div className="wp-50 right">
                            <Checkbox
                              label="介護靴"
                              getRadio={this.getRadio.bind(this)}
                              number="介護靴"
                              value={this.state.footwear == "介護靴"}
                              name="footwear"
                            />
                            <input
                              type="checkbox"
                              className="shoes_kind_check"
                              onClick={this.setCustomShoesKind.bind(this)}
                              checked={
                                this.state.custome_shoes_kind ? true : false
                              }
                            />
                            <input
                              type="text"
                              id='footwear_id'
                              className="shoes_kind_text"
                              value={
                                this.state.custome_shoes_kind
                                  ? this.state.footwear
                                  : ""
                              }
                              disabled={!this.state.custome_shoes_kind}
                              onChange={this.getCustomshoesKind.bind(this)}
                            />
                          </div>
                        </td>
                      </tr>
                      {/* <tr>
                                            <td className="table-label">靴下の着用</td>
                                            <td colSpan="2">
                                                <div className='wp-50 left'>
                                                    <Checkbox
                                                        label="_"
                                                        getRadio={this.getRadio.bind(this)}
                                                        value={this.state.allChecked}
                                                        name="check"
                                                    />
                                                    <Checkbox
                                                        label="_"
                                                        getRadio={this.getRadio.bind(this)}
                                                        value={this.state.allChecked}
                                                        name="check"
                                                    />
                                                    <Checkbox
                                                        label="__"
                                                        getRadio={this.getRadio.bind(this)}
                                                        value={this.state.allChecked}
                                                        name="check"
                                                    />
                                                </div>
                                                <div className='wp-50 right'>
                                                    <Checkbox
                                                        label="_"
                                                        getRadio={this.getRadio.bind(this)}
                                                        value={this.state.allChecked}
                                                        name="check"
                                                    />
                                                </div>
                                            </td>
                                        </tr> */}
                      <tr>
                        <td className="table-label">セルフケア状況</td>
                        <td colSpan="2" style={{textAlign:"left", paddingLeft:"1rem"}}>
                          <div className="wp-50 left flex">
                            <div className={"text-center wp-30"}>自己ケア</div>
                            <Checkbox
                              label="可"
                              getRadio={this.getRadio.bind(this)}
                              number={1}
                              value={this.state.can_self_care === 1}
                              name="can_self_care"
                            />
                            <Checkbox
                              label="不可"
                              getRadio={this.getRadio.bind(this)}
                              number={0}
                              value={this.state.can_self_care === 0}
                              name="can_self_care"
                            />
                          </div>
                          <div className="wp-50 right">
                            <label>ケアをする人</label>
                            <input
                              type="text"
                              id='can_self_caregiver_id'
                              className="care_text"
                              value={this.state.can_self_caregiver}
                              onChange={this.getCarePerson.bind(this)}
                            />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="table-label">アセスメント</td>
                        <td colSpan="2" style={{textAlign:"left", paddingLeft:"1rem"}}>
                          {assessment_codes_options != undefined && (
                            <>
                              <div className={"wp-50 left"}>
                                <SelectorWithLabel
                                  options={assessment_codes_options}
                                  title=""
                                  getSelect={this.getAssessmentCode.bind(
                                    this,
                                    1
                                  )}
                                  departmentEditCode={
                                    this.state.foot_care_assessment_1_code
                                  }
                                />
                                <SelectorWithLabel
                                  options={assessment_codes_options}
                                  title=""
                                  getSelect={this.getAssessmentCode.bind(
                                    this,
                                    2
                                  )}
                                  departmentEditCode={
                                    this.state.nafoot_care_assessment_2_code
                                  }
                                />
                                <SelectorWithLabel
                                  options={assessment_codes_options}
                                  title=""
                                  getSelect={this.getAssessmentCode.bind(
                                    this,
                                    3
                                  )}
                                  departmentEditCode={
                                    this.state.foot_care_assessment_3_code
                                  }
                                />
                              </div>
                              <div
                                className={"wp-50 right select-input-area"}
                                style={{ paddingLeft: "0.625rem" }}
                              >
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  id="foot_care_assessment_1_text_id"
                                  getInputText={this.getAssessmentText.bind(
                                    this,
                                    1
                                  )}
                                  diseaseEditData={
                                    this.state.foot_care_assessment_1_text
                                  }
                                />
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  id='foot_care_assessment_2_text_id'
                                  getInputText={this.getAssessmentText.bind(
                                    this,
                                    2
                                  )}
                                  diseaseEditData={
                                    this.state.foot_care_assessment_2_text
                                  }
                                />
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  id='foot_care_assessment_3_text_id'
                                  getInputText={this.getAssessmentText.bind(
                                    this,
                                    3
                                  )}
                                  diseaseEditData={
                                    this.state.foot_care_assessment_3_text
                                  }
                                />
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="table-label">看護目標</td>
                        <td colSpan="2" style={{textAlign:"left", paddingLeft:"1rem"}}>
                          {objective_codes_options != undefined && (
                            <>
                              <div className={"wp-50 left"}>
                                <SelectorWithLabel
                                  options={objective_codes_options}
                                  title=""
                                  getSelect={this.getObjectCode.bind(this, 1)}
                                  departmentEditCode={
                                    this.state.foot_care_objective_1_code
                                  }
                                />
                                <SelectorWithLabel
                                  options={objective_codes_options}
                                  title=""
                                  getSelect={this.getObjectCode.bind(this, 2)}
                                  departmentEditCode={
                                    this.state.foot_care_objective_2_code
                                  }
                                />
                                <SelectorWithLabel
                                  options={objective_codes_options}
                                  title=""
                                  getSelect={this.getObjectCode.bind(this, 3)}
                                  departmentEditCode={
                                    this.state.foot_care_objective_3_code
                                  }
                                />
                              </div>
                              <div
                                className={"wp-50 right select-input-area"}
                                style={{ paddingLeft: "0.625rem" }}
                              >
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  id='foot_care_objective_1_text_id'
                                  getInputText={this.getObjectText.bind(
                                    this,
                                    1
                                  )}
                                  diseaseEditData={
                                    this.state.foot_care_objective_1_text
                                  }
                                />
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  id='foot_care_objective_2_text_id'
                                  getInputText={this.getObjectText.bind(
                                    this,
                                    2
                                  )}
                                  diseaseEditData={
                                    this.state.foot_care_objective_2_text
                                  }
                                />
                                <InputWithLabelBorder
                                  label=""
                                  type="text"
                                  id='foot_care_objective_3_text_id'
                                  getInputText={this.getObjectText.bind(
                                    this,
                                    3
                                  )}
                                  diseaseEditData={
                                    this.state.foot_care_objective_3_text
                                  }
                                />
                              </div>
                            </>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="table-label">実施内容</td>
                        <td colSpan="2" style={{textAlign:"left", paddingLeft:"1rem"}}>
                          <div className={"wp-45 left"}>
                            <Checkbox
                              label="観察"
                              getRadio={this.getRadio.bind(this)}
                              number="観察"
                              value={this.state.carried_check_list["観察"]}
                              name="carried_out_content_checkbox"
                            />
                            <Checkbox
                              label="足浴"
                              getRadio={this.getRadio.bind(this)}
                              number="足浴"
                              value={this.state.carried_check_list["足浴"]}
                              name="carried_out_content_checkbox"
                            />
                            <Checkbox
                              label="爪切り"
                              getRadio={this.getRadio.bind(this)}
                              number="爪切り"
                              value={this.state.carried_check_list["爪切り"]}
                              name="carried_out_content_checkbox"
                            />
                          </div>
                          <div className={"wp-55 right text-left"}>
                            <Checkbox
                              label="やすり"
                              getRadio={this.getRadio.bind(this)}
                              number="やすり"
                              value={this.state.carried_check_list["やすり"]}
                              name="carried_out_content_checkbox"
                            />
                            <Checkbox
                              label="グラインダー"
                              getRadio={this.getRadio.bind(this)}
                              number="グラインダー"
                              value={
                                this.state.carried_check_list["グラインダー"]
                              }
                              name="carried_out_content_checkbox"
                            />
                            <Checkbox
                              label="洗浄"
                              getRadio={this.getRadio.bind(this)}
                              number="洗浄"
                              value={this.state.carried_check_list["洗浄"]}
                              name="carried_out_content_checkbox"
                            />
                          </div>
                          <div className={"wp-45 left"}>
                            <Checkbox
                              label="消毒"
                              getRadio={this.getRadio.bind(this)}
                              number="消毒"
                              value={this.state.carried_check_list["消毒"]}
                              name="carried_out_content_checkbox"
                            />
                            <Checkbox
                              label="軟膏処置"
                              getRadio={this.getRadio.bind(this)}
                              number="軟膏処置"
                              value={this.state.carried_check_list["軟膏処置"]}
                              name="carried_out_content_checkbox"
                            />
                            <Checkbox
                              label="保湿ケア"
                              getRadio={this.getRadio.bind(this)}
                              number="保湿ケア"
                              value={this.state.carried_check_list["保湿ケア"]}
                              name="carried_out_content_checkbox"
                            />
                          </div>
                          <div className={"wp-55 right text-left"}>
                            <Checkbox
                              label="その他"
                              getRadio={this.getRadio.bind(this)}
                              number="その他"
                              value={this.state.carried_check_list["その他"]}
                              name="carried_out_content_checkbox"
                            />
                            {/* <input type="text" className="content_other_text" /> */}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="table-label">指導内容</td>
                        <td colSpan="2" style={{textAlign:"left", paddingLeft:"1rem"}}>
                          <div className="flex">
                            <Checkbox
                              label="足の観察方法"
                              getRadio={this.getRadio.bind(this)}
                              value={this.state.instructed_content_observation}
                              name="instructed_content_observation"
                            />
                            <input
                              type="text"
                              id='instructed_content_text_1_id'
                              value={this.state.instructed_content_text_1}
                              onChange={this.getInstructedContentText.bind(
                                this,
                                1
                              )}
                            />
                          </div>
                          <div className="flex">
                            <Checkbox
                              label="履物について"
                              getRadio={this.getRadio.bind(this)}
                              value={this.state.instructed_content_footwear}
                              name="instructed_content_footwear"
                            />
                            <input
                              type="text"
                              id='instructed_content_text_2_id'
                              value={this.state.instructed_content_text_2}
                              onChange={this.getInstructedContentText.bind(
                                this,
                                2
                              )}
                            />
                          </div>
                          <div className="flex">
                            <Checkbox
                              label="日常生活の注意点"
                              getRadio={this.getRadio.bind(this)}
                              value={
                                this.state.instructed_content_everyday_life
                              }
                              name="instructed_content_everyday_life"
                            />
                            <input
                              type="text"
                              id='instructed_content_text_3_id'
                              value={this.state.instructed_content_text_3}
                              onChange={this.getInstructedContentText.bind(
                                this,
                                3
                              )}
                            />
                          </div>
                          <div className="flex">
                            <Checkbox
                              label="爪切りの方法"
                              getRadio={this.getRadio.bind(this)}
                              value={this.state.instructed_content_nail_cutting}
                              name="instructed_content_nail_cutting"
                            />
                            <input
                              type="text"
                              id='instructed_content_text_4_id'
                              value={this.state.instructed_content_text_4}
                              onChange={this.getInstructedContentText.bind(
                                this,
                                4
                              )}
                            />
                          </div>
                          <div className="flex">
                            <Checkbox
                              label="その他"
                              getRadio={this.getRadio.bind(this)}
                              value={this.state.instructed_content_other}
                              name="instructed_content_other"
                            />
                            <input
                              type="text"
                              id='instructed_content_text_5_id'
                              value={this.state.instructed_content_text_5}
                              onChange={this.getInstructedContentText.bind(
                                this,
                                5
                              )}
                            />
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-buttons">
              <Button className={system_patient_id == null || this.state.change_flag == 0 ? "disable-btn" : "red-btn"} onClick={this.createFootcare}>
                {this.state.number > 0 ? "変更" : "登録"}
              </Button>
            </div>
          </>
        ):(
          <>
            <SpinnerWrapper>
              <Spinner animation="border" variant="secondary" />
            </SpinnerWrapper>
          </>
        )}
        
        <ContextMenu {...this.state.contextMenu} parent={this} />
        <ContextAntiMenu {...this.state.contextAntiMenu} parent={this} />
        {this.state.isShowStaffList && (
          <DialSelectMasterModal
            selectMaster={this.selectStaff}
            closeModal={this.closeModal}
            MasterCodeData={this.state.staffs}
            MasterName="スタッフ"
          />
        )}
        {this.state.confirm_message !== "" && (
          <SystemConfirmModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmOk.bind(this)}
            confirmTitle={this.state.confirm_message}
            title={this.state.confirm_title}
          />
        )}
        {this.state.isDeleteConfirmModal && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.deleteHistory.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isOpenConfirmModal !== false &&  (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmCloseOk}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.isEditConfirmModal && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.handleEdit.bind(this)}
            confirmTitle={this.state.confirm_message}
          />
        )}
        {this.state.isFootsEditModal && (
          <FootcareFootsEditModal
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            handlePropInsert={this.registerFootImage}
            imgLeftBase64={this.state.imgLeftBase64}
            imgRightBase64={this.state.imgRightBase64}
            imgBackroundVersion={this.latest_version}
            imgLeftBackgroundBase64={this.left_footcare_background_base64}
            imgRightBackgroundBase64={this.right_footcare_background_base64}
          />
        )}
        {this.state.check_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.check_message}
          />
        )}
        {this.state.isOpenMedicinePanel && (
          <SelectPannelModal
            selectMaster = {this.selectMaster}
            closeModal={this.closeModal}
            MasterName = "薬剤"
            is_antithrombotic={true}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title={this.state.confirm_alert_title}
          />
        )}
      </Wrapper>
    );
  }
}

FootCareBody.contextType = Context;

FootCareBody.propTypes = {
  checkFootCare: PropTypes.func,
  patientInfo: PropTypes.object,
  offset_x: PropTypes.number,
  offset_y: PropTypes.number,
  schedule_date: PropTypes.string,
};

export default FootCareBody;