import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import DepartOneTwo from "./DepartOneTwo";
import RegionBottom from "../Common/RegionBottom";
import styled from "styled-components";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import Radiobox from "~/components/molecules/Radiobox";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import Context from "~/helpers/configureStore";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import {formatDateLine, formatDateSlash, formatJapanDateSlash} from "~/helpers/date";
import { KARTEMODE } from "~/helpers/constants";
import EndoscopeEditModal from "~/components/templates/Patient/Modals/Common/EndoscopeEditModal";
import axios from "axios";
import EndoscopeReservationModal from "~/components/templates/Patient/Modals/Common/EndoscopeReservationModal";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import AmountInput from "../../../../molecules/AmountInput";
registerLocale("ja", ja);
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import $ from "jquery";
import { harukaValidate } from "~/helpers/haruka_validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import {removeRedBorder, setDateColorClassName} from '~/helpers/dialConstants';
import BodyPartsPanel from "~/components/templates/Patient/Modals/Physiological/BodyPartsPanel";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import Tooltip from "react-bootstrap/Tooltip";
const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";

const CheckBoxArea = styled.div`
    width: 26vw;
    float: left;
    margin-left: 10px;
  .head-title {
      text-align: center;
      background-color: #b8b8f3;
      font-size: 1.2rem;
  }
  .inspection {
    width: 30vw;
    margin-top: 33px;
    label {
      font-size: 1.2rem;
      width: 35%;
    }
    label:last-child {
      width: 16%;
    }
  }
  .content-list{    
    padding: 3px;
    height: 35vh;
    float:left;
    width: 100%;
    border: 1px solid #aaa;
  }
  .calculation-start-date {
    display:flex;
    margin-top:0.5rem;
    .label-title {
      font-size: 1rem;
      margin:0;
      margin-right: 0.5rem;
      max-width: 11rem;
      text-align: left;
      line-height: 2rem;
      font-size: 1rem;
    }
    input {
      font-size: 1rem;
      width: 7rem;
      height: 2rem;
    }
  }
  .count-area {
      label {
        font-size: 1.2rem;
        margin-top: 5px;
        margin-bottom: 0;
      }
      .label-title {
        text-align: right;
        margin-right: 8px;
        width: 100px;
      }
      .label-unit {
        margin-right: 0;
        text-align: left;
        width: 50px;
      }
      input {
        width: 150px !important;
      }
  }
`;

const Wrapper = styled.div`
  overflow: hidden;
  height: 100%;
  .flex {display: flex;}
  .head-title {
    text-align: center;
    font-size: 1.2rem;
    font-weight: bold;
    background-color: #a0ebff;
    border:1px solid #aaa;
    border-bottom:none;
  }
  .border-bottom {border-bottom:1px solid #aaa !important;}
  .block-area {
    border: 1px solid #aaa;
    margin-top: 20px;
    padding: 10px;
    position: relative;
    label {
      font-size: 0.9rem;
      width: 45%;
    }
  }
  .block-title {
    position: absolute;
    top: -16px;
    left: 10px;
    font-size: 1.2rem;
    background-color: white;
    padding-left: 5px;
    padding-right: 5px;
  }
  .shoot-instruction{
    label{
      width:auto;
    }
  }
  .depart{
    width: 53vw;
    overflow: hidden;
  }
  .div-tall-weight{
    div {margin-top:0;}
    .label-title {
      width:4.5rem;
      font-size: 1rem;
      margin: 0;
      line-height: 2rem;
    }
    .form-control {
      ime-mode: inactive;
    }
    .notice{
      width: 100%;
      display: flex;
    }
    .label-unit {
      font-size: 1rem;
      margin-top: 0;
      margin-bottom: 0;
      line-height: 2rem;
      width: 1.5rem;
      margin-left: 0.3rem;
    }
  }
  .selected{
      background: lightblue;
  }
  .row-item {
    cursor:pointer;
  }
  .formula_area{
    .pullbox-select, .pullbox-label{
      width: 9rem;
      margin-bottom: 0;
      height: 2rem;
    }
  }
  .react-numeric-input input{
    width:6.5rem !important;
    height:2rem;
    font-size:1rem !important;
  }
  .reserve-date-area {
    height:10rem;
    overflow-y:auto;
    border:1px solid #aaa;
    margin-top: 0.5rem;
    .time-row {
      border-bottom:1px solid #aaa;
      padding:0 0.2rem;
    }
  }
`;

const Footer = styled.div`
  display: flex;    
  align-items: center;
  span{
    color: white;
    font-size: 1rem;
  }
  button{
    float: right;
    padding: 5px;
    font-size: 1rem;
    margin-right: 1rem;
  }
  .emergency{
    margin-right: 3.75rem;
    margin-left: 3.75rem;
  }
  .select-eme {
    background-color: #881717;
  }
  .date-input{
    padding-top: 0px;
    border: solid 1px #999;
    width: 100px;
    margin: 0 10px;
    cursor: pointer;
    height: 36px;
    line-height: 36px;
  }
  .date{
    margin-top: 5px;
    margin-right: 10px;
  }
  .react-datepicker-wrapper {
    padding-top: 0px;
    input{
        height: 2rem;
        // line-height: 2rem;
        width: 7rem;
        margin-right:10px;
        padding-top:0.15rem;
    }
  }
  .date-area {
    padding-top: 0px;
    min-width: 7rem;
    padding: 0 0.3rem;
    // height:40px;
    height:2rem;
    border:1px solid #aaa;
    // line-height: 36px;
    padding-top:0.15rem;
    margin-right:10px;
  }
  .date-label {
    height: 2rem;
    margin: 0;
    // line-height: 2rem;
    margin-right: 10px;
    padding-top:0.3rem;
  }
`;

const Header = styled.div`
  span{
    font-size: 1rem;
  }
  button{
    float: right;
    margin-right: 1rem;
    padding: 5px;
    font-weight: 100;
  }
`;

const SpinnerWrapper = styled.div`
    margin: auto;
    margin-top: 40vh;
`;

class PhysiologicalModal extends Component {
  constructor(props) {
    super(props);
    /* eslint-disable no-console */
    console.log("Physiological Constructor", new Date().getTime());
    this.patient_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PATIENT_INFORMATION);
    this.state = {
      patientId:props.patientId,
      patient_name:props.patientInfo.name,
      all_data:null,
      order_comment:'',
      free_comment:'',
      modalName:'',
      imgBase64: "",
      image_path:"",
      isOpenShemaModal: false,
      inspection_DATETIME:new Date(),
      not_yet: false,
      isOpenReserveCalendar:false,
      reserve_time:'',
      reserve_data:null,
      calculation_start_date:'',
      surface_area:'',
      height:'',
      weight:'',
      count:'',
      enable_count_value:0,
      count_label:'',
      count_suffix:'',
      formula_id:0,
      formula:null,
      number:0,
      order_id:0,
      state:0,
      isForUpdate:0,
      created_at:'',
      count_input_length:0,
      alert_message:'',
      karte_status: 0,
      enable_body_part:0,
      body_part_json:null,
      enable_height_weight_surface_area:0,
      height_weight_surface_area_text:"",
      enable_connection_date:0,
      connection_date_title:"",
      body_part:"",
      end_until_continue_type:0,
      confirm_title: "",
      confirm_type: "",
      confirm_message: "",
      multi_reserve_flag:0,
    };
    this.change_flag = 0;
    this.manual_height_weight_change = false;
    this.input_done_info = false;
    this.can_done = false;
    this.can_register = false;
  }

  async componentDidMount() {
    let cache_data = null;
    let modalName = this.props.modalName;
    let inspection_id = this.props.inspectionId;
    let system_patient_id = this.props.patientId;
    let imgBase64 = "";
    let image_path = "";
    let number = this.state.number;
    let order_id = this.state.order_id;
    let state = this.state.state;
    let isForUpdate = this.state.isForUpdate;
    let created_at = this.state.created_at;
    let karte_status = this.context.karte_status.code == 0 ? 1 : this.context.karte_status.code == 1 ? 3 : 2;
    if (this.props.cache_index != null) {
      cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_EDIT, this.props.cache_index);
      if (this.props.cache_data != undefined && this.props.cache_data != null) cache_data = JSON.parse(JSON.stringify(this.props.cache_data));
      number = cache_data['number'];
      isForUpdate = number > 0 ? 1 : 0;
      order_id = cache_data['order_id'];
      state = cache_data['state'];
      created_at = cache_data['created_at'];
      modalName = cache_data['inspection_name'];
      inspection_id = cache_data['inspection_id'];
      imgBase64 = cache_data['imgBase64'];
      karte_status = cache_data['karte_status'];
      if (cache_data['image_path'] != null && cache_data['image_path'] != undefined && cache_data['image_path'] != "") {
        image_path = cache_data['image_path'];
      }
      let cache_data_tmp = cache_data;
      if (cache_data_tmp['imgBase64'] == null || cache_data_tmp['imgBase64'] == undefined || cache_data_tmp['imgBase64'] == "") {
        if (cache_data_tmp['image_path'] != null && cache_data_tmp['image_path'] != undefined && cache_data_tmp['image_path'] != "") {
          const { data } = await axios.post("/app/api/v2/order/inspection/getImage", {
            params: {
              number: cache_data_tmp['number']
            }
          });
          imgBase64 = data;
        }
      }
    }
    let path = "/app/api/v2/master/inspection";
    let post_data = {
      inspection_id:inspection_id,
      system_patient_id:system_patient_id,
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        let inspection_purpose_check = {};
        if (res.inspection_purpose !== undefined) {
          Object.keys(res.inspection_purpose.values).map((index) => {
            if(cache_data != null && cache_data.inspection_purpose !== undefined && cache_data.inspection_purpose.find(x => x.purpose_id === index) !== undefined){
              inspection_purpose_check[index] = true;
            } else {
              inspection_purpose_check[index] = false;
            }
          })
        }
        let inspection_symptom_check = {};
        if (res.inspection_symptom !== undefined) {
          Object.keys(res.inspection_symptom.values).map((index) => {
            if(cache_data != null && cache_data.inspection_symptom !== undefined && cache_data.inspection_symptom.find(x => x.symptoms_id === index) !== undefined){
              inspection_symptom_check[index] = true;
            } else {
              inspection_symptom_check[index] = false;
            }
          })
        }
        let inspection_risk_check = {};
        if (res.inspection_risk !== undefined) {
          Object.keys(res.inspection_risk.values).map((index) => {
            if(cache_data != null && cache_data.inspection_risk !== undefined && cache_data.inspection_risk.find(x => x.risk_factors_id === index) !== undefined){
              inspection_risk_check[index] = true;
            } else {
              inspection_risk_check[index] = false;
            }
          })
        }
        let inspection_sick_check = {};
        if (res.inspection_sick !== undefined) {
          Object.keys(res.inspection_sick.values).map((index) => {
            if(cache_data != null && cache_data.inspection_sick !== undefined && cache_data.inspection_sick.find(x => x.sick_history_id === index) !== undefined){
              inspection_sick_check[index] = true;
            } else {
              inspection_sick_check[index] = false;
            }
          })
        }
        let inspection_request_radio = '';
        if(res.inspection_request !== undefined){
          if(cache_data != null && cache_data.inspection_request !== undefined){
            inspection_request_radio = cache_data.inspection_request[0]['request_id'];
          } else {
            inspection_request_radio = Object.keys(res.inspection_request.values)[0];
          }
        }
        let inspection_movement_radio = '';
        if(res.inspection_movement !== undefined){
          if(cache_data != null && cache_data.inspection_movement !== undefined){
            inspection_movement_radio = cache_data.inspection_movement[0]['movement_id'];
          } else {
            inspection_movement_radio = Object.keys(res.inspection_movement.values)[0];
          }
        }
        let enable_body_part = 0;
        if(res.enable_body_part !== undefined){enable_body_part = res.enable_body_part;}
        let body_part_json = null;
        if(res.body_part_json !== undefined){body_part_json = res.body_part_json;}
        let enable_height_weight_surface_area = 0;
        if(res.enable_height_weight_surface_area !== undefined){enable_height_weight_surface_area = res.enable_height_weight_surface_area;}
        let height_weight_surface_area_text = "";
        if(res.height_weight_surface_area_text !== undefined && res.height_weight_surface_area_text != null){height_weight_surface_area_text = res.height_weight_surface_area_text;}
        let enable_connection_date = 0;
        if(res.enable_connection_date !== undefined){enable_connection_date = res.enable_connection_date;}
        let connection_date_title = "";
        if(res.connection_date_title !== undefined && res.connection_date_title != null){connection_date_title = res.connection_date_title;}
        let end_until_continue_type = 0;
        if(res.end_until_continue_type !== undefined){end_until_continue_type = res.end_until_continue_type;}
        let is_anesthesia = '';
        if(cache_data != null && cache_data.is_anesthesia !== undefined){
          is_anesthesia = cache_data.is_anesthesia[0]['is_anesthesia'];
        }
        let is_sedation = '';
        if(cache_data != null && cache_data.is_sedation !== undefined){
          is_sedation = cache_data.is_sedation[0]['is_sedation'];
        }
        let etc_comment = '';
        if(cache_data != null && cache_data.etc_comment !== undefined){
          etc_comment = cache_data.etc_comment;
        }
        let sick_name = '';
        if(cache_data != null && cache_data.sick_name !== undefined){
          sick_name = cache_data.sick_name;
        }
        let special_presentation = '';
        if(cache_data != null && cache_data.special_presentation !== undefined){
          special_presentation = cache_data.special_presentation;
        }
        let classification1_id = 0;
        let classification1_name = '';
        if(res.inspection_classification1 !== undefined && Object.keys(res.inspection_classification1).length === 1){
          classification1_id = Object.keys(res.inspection_classification1)[0];
          classification1_name = res.inspection_classification1[classification1_id];
        } else {
          if(cache_data != null && cache_data.classification1_id !== undefined){
            classification1_id = cache_data.classification1_id;
          }
          if(cache_data != null && cache_data.classification1_name !== undefined){
            classification1_name = cache_data.classification1_name;
          }
        }
        let classification2_id = 0;
        if(cache_data != null && cache_data.classification2_id !== undefined){
          classification2_id = cache_data.classification2_id;
        }
        let classification2_name = '';
        if(cache_data != null && cache_data.classification2_name !== undefined){
          classification2_name = cache_data.classification2_name;
        }
        let surface_area = '';
        if(cache_data != null && (cache_data.done_surface_area !== undefined || cache_data.surface_area !== undefined)){
          surface_area = cache_data.done_surface_area !== undefined ? cache_data.done_surface_area : cache_data.surface_area;
          if(cache_data.done_surface_area !== undefined){this.input_done_info = true;}
        }        
        let height = '';
        if(cache_data != null && (cache_data.done_height !== undefined || cache_data.height !== undefined)){
          height = cache_data.done_height !== undefined ? cache_data.done_height : cache_data.height;
          if(cache_data.done_height !== undefined){this.input_done_info = true;}
        }
        let formula_id = 0;
        if(cache_data != null && (cache_data.done_formula_id !== undefined || cache_data.formula_id !== undefined)){
          formula_id = cache_data.done_formula_id !== undefined ? cache_data.done_formula_id : cache_data.formula_id;
          if(cache_data.done_formula_id !== undefined){this.input_done_info = true;}
        }
        let formula = null;
        let formula_list = [{id:0, value:''}];
        let formula_data = res.formula;
        if (res.formula !== undefined && res.formula != null){
          Object.keys(res.formula).map((formula_name, index)=> {
            if(formula_id == (index+1)){
              formula = formula_name;
            }
            formula_list.push({id:index+1, value:formula_name, formula:res.formula[formula_name]})
          });
        }
        let weight = '';
        if(cache_data != null && (cache_data.done_weight !== undefined || cache_data.weight !== undefined)){
          weight = cache_data.done_weight !== undefined ? cache_data.done_weight : cache_data.weight;
          if(cache_data.done_weight !== undefined){this.input_done_info = true;}
        }
        let body_part = '';
        if(cache_data != null && (cache_data.done_body_part !== undefined || cache_data.body_part !== undefined)){
          body_part = cache_data.done_body_part !== undefined ? cache_data.done_body_part : cache_data.body_part;
          if(cache_data.done_body_part !== undefined){this.input_done_info = true;}
        }
        let inspection_type_id = 0;
        if(cache_data != null && cache_data.inspection_type_id !== undefined){
          inspection_type_id = cache_data.inspection_type_id;
        }
        let inspection_type_name = '';
        if(cache_data != null && cache_data.inspection_type_name !== undefined){
          inspection_type_name = cache_data.inspection_type_name;
        }
        let inspection_item_id = 0;
        if(cache_data != null && cache_data.inspection_item_id !== undefined){
          inspection_item_id = cache_data.inspection_item_id;
        }
        let inspection_item_name = '';
        if(cache_data != null && cache_data.inspection_item_name !== undefined){
          inspection_item_name = cache_data.inspection_item_name;
        }
        let inspection_DATETIME = new Date();
        let reserve_time = '';
        let reserve_data = null;
        let not_yet = this.state.not_yet;
        let multi_reserve_flag = this.state.multi_reserve_flag;
        if(cache_data != null){
          if(cache_data.multi_reserve_flag === 1){
            multi_reserve_flag = 1;
            reserve_data = cache_data.reserve_data;
            inspection_DATETIME = null;
            reserve_time = null;
          } else {
            if(cache_data.inspection_DATETIME !== undefined){
              if(cache_data.inspection_DATETIME === '日未定'){
                not_yet = true;
                inspection_DATETIME = "";
              } else {
                inspection_DATETIME = new Date(cache_data.inspection_DATETIME);
                if(cache_data.reserve_time !== undefined){
                  reserve_time = cache_data.reserve_time === "時間未定" ? null : cache_data.reserve_time;
                  if(cache_data.reserve_data !== undefined && cache_data.reserve_data != null){
                    reserve_data = cache_data.reserve_data;
                  }
                }
              }
            }
          }
        }
        let is_emergency = 0;
        if(cache_data != null && cache_data.is_emergency !== undefined){
          is_emergency = cache_data.is_emergency;
        }
        let calculation_start_date = '';
        if(cache_data != null && cache_data.calculation_start_date !== undefined){
          calculation_start_date = new Date(cache_data.calculation_start_date);
        }
        let count = '';
        if(cache_data != null && cache_data.count !== undefined){
          count = cache_data.count;
        }
        let enable_count_value = 0;
        if(res.enable_count_value !== undefined){
          enable_count_value = res.enable_count_value;
        }
        let count_label = '';
        if(res.count_label !== undefined && res.count_label != null){
          count_label = res.count_label;
        }
        let count_suffix = '';
        if(res.count_suffix !== undefined && res.count_suffix != null){
          count_suffix = res.count_suffix;
        }
        let count_input_length = 4; //0やNULLならフロントでは4扱い
        if(res.count_input_length !== undefined && res.count_input_length != null && res.count_input_length != 0){
          count_input_length = res.count_input_length;
        }
        //加算項目-----------------------------------------------
        let additions_check = {};
        let additions_send_flag_check = {};
        let additions = [];
        if (res.additions !== undefined && res.additions!= null){
          additions = res.additions;
          additions.map(addition=> {
            if (cache_data != null && cache_data.additions != undefined && cache_data.additions[addition.addition_id] != undefined){
              additions_check[addition.addition_id] = true;
              let sending_flag = cache_data.additions[addition.addition_id]['sending_flag'];
              if(sending_flag !== undefined && sending_flag !== null && sending_flag === 1){
                additions_send_flag_check[addition.addition_id] = true;
              } else {
                additions_send_flag_check[addition.addition_id] = false;
              }
            } else {
              additions_check[addition.addition_id] = false;
              additions_send_flag_check[addition.addition_id] = false;
            }
          })
        }
        if(inspection_id === 17){ //内視鏡検査実施権限
          this.can_done = this.context.$canDoAction(this.context.FEATURES.ENDOSCOPEORDER, this.context.AUTHS.DONE_OREDER);
          this.can_register = isForUpdate ? true :
            (this.context.$canDoAction(this.context.FEATURES.ENDOSCOPEORDER, this.context.AUTHS.REGISTER) || this.context.$canDoAction(this.context.FEATURES.ENDOSCOPEORDER, this.context.AUTHS.REGISTER_PROXY));
        } else { //生理検査実施権限
          this.can_done = this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.DONE_OREDER);
          this.can_register = isForUpdate ? true :
            (this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.REGISTER) || this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.REGISTER_PROXY));
        }
        this.setState({
          number,
          order_id,
          state,
          isForUpdate,
          created_at,
          karte_status,
          modalName,
          inspection_id,
          all_data: res,
          inspection_purpose_check,
          inspection_symptom_check,
          inspection_risk_check,
          inspection_sick_check,
          inspection_request_radio,
          inspection_movement_radio,
          is_anesthesia,
          is_sedation,
          etc_comment,
          body_part,
          sick_name,
          special_presentation,
          classification1_id,
          classification1_name,
          classification2_id,
          classification2_name,
          surface_area,
          formula_id,
          formula,
          height,
          weight,
          inspection_type_id,
          inspection_type_name,
          inspection_item_id,
          inspection_item_name,
          imgBase64: imgBase64,
          image_path: image_path,
          // endoscope_purpose_id,
          // endoscope_purpose_name,
          inspection_DATETIME,
          reserve_time,
          multi_reserve_flag,
          reserve_data,
          not_yet,
          is_emergency,
          enable_body_part,
          body_part_json,
          enable_height_weight_surface_area,
          height_weight_surface_area_text,
          enable_connection_date,
          connection_date_title,
          calculation_start_date,
          count,
          enable_count_value,
          count_label,
          count_suffix,
          count_input_length,
          additions,
          additions_check,
          additions_send_flag_check,
          formula_data,
          formula_list,
          end_until_continue_type
        });
      })
      .catch(() => {
      })
  }

  getPresentCondition = (name, number) => {
    let check_status = {};
    switch(name){
      case 'inspection_purpose':
        check_status = this.state.inspection_purpose_check;
        if(check_status[number] === true){
          check_status[number] = false;
        } else {
          check_status[number] = true;
        }
        this.change_flag = 1;
        this.setState({inspection_purpose_check:check_status});
        break;
      case 'inspection_symptom':
        check_status = this.state.inspection_symptom_check;
        if(check_status[number] === true){
          check_status[number] = false;
        } else {
          check_status[number] = true;
        }
        this.change_flag = 1;
        this.setState({inspection_symptom_check:check_status});
        break;
      case 'inspection_risk':
        check_status = this.state.inspection_risk_check;
        if(check_status[number] === true){
          check_status[number] = false;
        } else {
          check_status[number] = true;
        }
        this.change_flag = 1;
        this.setState({inspection_risk_check:check_status});
        break;
      case 'inspection_sick':
        check_status = this.state.inspection_sick_check;
        if(check_status[number] === true){
          check_status[number] = false;
        } else {
          check_status[number] = true;
        }
        this.change_flag = 1;
        this.setState({inspection_sick_check:check_status});
        break;
    }
  };

  getInspectionRequest = (e) => {
    this.change_flag = 1;
    this.setState({inspection_request_radio:parseInt(e.target.value)});
  };

  getInspectionMovement = (e) => {
    this.change_flag = 1;
    this.setState({inspection_movement_radio:parseInt(e.target.value)});
  };

  getIsAnesthesia = (e) => {
    this.change_flag = 1;
    this.setState({is_anesthesia:parseInt(e.target.value)});
  };

  getIsSedation = (e) => {
    this.change_flag = 1;
    this.setState({is_sedation:parseInt(e.target.value)});
  };

  componentDidUpdate () {
    this.changeBackground();
  }

  changeBackground = () => {
    let inspection_id = this.state.inspection_id;
    let state_data = JSON.parse(JSON.stringify(this.state));
    if(inspection_id == 17){
      if(Object.keys(this.state.all_data.inspection_item).length > 0){
        let classification2_data = [];
        if(this.state.all_data.inspection_item[this.state.inspection_type_id] !== undefined){
          classification2_data = this.state.all_data.inspection_item[this.state.inspection_type_id];
        }
        if(Object.keys(classification2_data).length == 0){
          state_data['inspection_item_name'] = " ";
        }
      }
      harukaValidate('karte', 'physiological', 'endoscope', state_data,'background');
    } else {
      if(this.state.all_data != null && this.state.all_data.inspection_classification2 != undefined && this.state.all_data.inspection_classification2 != null && Object.keys(this.state.all_data.inspection_classification2).length > 0){
        let classification2_data = [];
        if(this.state.all_data.inspection_classification2[this.state.classification1_id] !== undefined){
          classification2_data = this.state.all_data.inspection_classification2[this.state.classification1_id];
        }
        if(Object.keys(classification2_data).length == 0){
          state_data['classification2_name'] = " ";
        }
      }
      harukaValidate('karte', 'physiological', 'physiological', state_data, 'background');
      if(this.state.enable_height_weight_surface_area === 1){
        harukaValidate('karte', 'physiological', 'lung', state_data, 'background');
      }
    }
  }

  checkValidation = () => {
    removeRedBorder('inspection_type_name_id');
    removeRedBorder('inspection_item_name_id');
    removeRedBorder('classification1_name_id');
    removeRedBorder('classification2_name_id');
    removeRedBorder('free_comment_id');
    removeRedBorder('etc_comment_id');
    removeRedBorder('request_comment_id');
    removeRedBorder('height_id');
    removeRedBorder('weight_id');
    removeRedBorder('surface_area_id');
    let error_str_arr = [];
    let first_tag_id = '';
    let validate_data = '';
    let inspection_id = this.state.inspection_id;
    let state_data = JSON.parse(JSON.stringify(this.state));
    if(inspection_id === 17){
      if(Object.keys(this.state.all_data.inspection_item).length > 0){
        let classification2_data = [];
        if(this.state.all_data.inspection_item[this.state.inspection_type_id] !== undefined){
          classification2_data = this.state.all_data.inspection_item[this.state.inspection_type_id];
        }
        if(Object.keys(classification2_data).length === 0){
          state_data['inspection_item_name'] = " ";
        }
      }
      validate_data = harukaValidate('karte', 'physiological', 'endoscope', state_data);
    } else {
      if(this.state.all_data.inspection_classification2 !== undefined &&
        this.state.all_data.inspection_classification2 != null && 
        Object.keys(this.state.all_data.inspection_classification2).length > 0){
        let classification2_data = [];
        if(this.state.all_data.inspection_classification2[this.state.classification1_id] !== undefined){
          classification2_data = this.state.all_data.inspection_classification2[this.state.classification1_id];
        }
        if(Object.keys(classification2_data).length === 0){
          state_data['classification2_name'] = " ";
        }
      }
      validate_data = harukaValidate('karte', 'physiological', 'physiological', state_data);
      if(this.state.enable_height_weight_surface_area === 1){
        validate_data = harukaValidate('karte', 'physiological', 'lung', state_data);
      }
    }
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != '') {
      first_tag_id = validate_data.first_tag_id;
    }
    if (error_str_arr.length > 0) {
      this.setState({
        first_tag_id,
        alert_message: error_str_arr.join('\n')
      });
      return true;
    } else {
      return false;
    }
  }

  closeAlertModal = () => {
    this.setState({ alert_message: '' });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }

  save=(state=0)=>{
    let all_data = this.state.all_data;
    if(all_data == null){return;}
    if (this.state.inspection_id == 17 && !(this.state.inspection_item_id > 0)){
      if (this.state.inspection_type_id > 0 && this.state.all_data.inspection_item[this.state.inspection_type_id] == null){
        this.setState({
          done_flag:state,
          confirm_type: "register",
          confirm_title: "登録確認",
          confirm_message: "登録しますか？",
        });
        return;
      }
    }
    let error_exist = this.checkValidation();
    if(error_exist){return;}
    this.setState({
      confirm_type: "register",
      confirm_title: "登録確認",
      confirm_message: "登録しますか？",
      done_flag:state,
    });
  }

  confirmCancel=()=> {
    this.setState({
      confirm_type: "",
      confirm_title: "",
      confirm_message: "",
    });
  }

  saveData = (state = 0) =>{
    let inspection_id = this.state.inspection_id;
    let all_data = this.state.all_data;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let inspections = {};
    inspections['number'] = this.state.number;
    inspections['order_id'] = this.state.order_id;
    inspections['isForUpdate'] = this.state.isForUpdate;
    if(this.state.isForUpdate === 1 && this.props.cache_index != null){
      let cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_EDIT, this.props.cache_index);
      if(cache_data !== undefined && cache_data != null && cache_data.last_doctor_code !== undefined){
        inspections.last_doctor_code = cache_data.last_doctor_code;
        inspections.last_doctor_name = cache_data.last_doctor_name;
      }
      if (this.props.cache_data !== undefined && this.props.cache_data != null){
        cache_data = JSON.parse(JSON.stringify(this.props.cache_data));
        inspections.last_doctor_code = cache_data.doctor_code;
        inspections.last_doctor_name = cache_data.doctor_name;
      }
    }
    inspections['state'] = this.state.state;
    if(state === 2){
      inspections['state'] = state;
    }
    inspections['created_at'] = this.state.created_at;
    inspections['karte_status'] = this.state.karte_status;
    inspections['inspection_name'] = this.state.modalName;
    inspections['open_flag'] = 1;
    inspections['inspection_id'] = inspection_id;
    if(inspection_id === 17){
      if(this.state.inspection_type_id !== 0 && this.state.inspection_type_name !== ''){
        inspections['inspection_type_id'] = this.state.inspection_type_id;
        inspections['inspection_type_name'] = this.state.inspection_type_name;
      }
      if(this.state.inspection_item_id !== 0 && this.state.inspection_item_name !== ''){
        inspections['inspection_item_id'] = this.state.inspection_item_id;
        inspections['inspection_item_name'] = this.state.inspection_item_name;
      }
      if(this.state.all_data.inspection_item[this.state.inspection_type_id] == undefined){
        inspections['inspection_item_id'] = undefined;
        inspections['inspection_item_name'] = undefined;
      }

      inspections['imgBase64'] = this.state.imgBase64;
      inspections['special_presentation'] = this.state.special_presentation;
    } else {
      if(this.state.classification1_id !== 0 && this.state.classification1_name !== ''){
        inspections['classification1_id'] = this.state.classification1_id;
        inspections['classification1_name'] = this.state.classification1_name;
      }
      inspections['classification2_id'] = this.state.classification2_id;
      inspections['classification2_name'] = this.state.classification2_name;
    }
    if(all_data.inspection_purpose != undefined){
      inspections['inspection_purpose'] = [];
      Object.keys(this.state.inspection_purpose_check).map((index) => {
        if(this.state.inspection_purpose_check[index]) {
          let item = {title:all_data.inspection_purpose.title, purpose_id:index, name:all_data.inspection_purpose.values[index]};
          inspections['inspection_purpose'].push(item);
        }
      })
    }
    if(all_data.inspection_symptom != undefined){
      inspections['inspection_symptom'] = [];
      Object.keys(this.state.inspection_symptom_check).map((index) => {
        if(this.state.inspection_symptom_check[index]) {
          let item = {title:all_data.inspection_symptom.title, symptoms_id:index, name:all_data.inspection_symptom.values[index]};
          inspections['inspection_symptom'].push(item);
        }
      })
    }
    if(all_data.inspection_risk != undefined){
      inspections['inspection_risk'] = [];
      Object.keys(this.state.inspection_risk_check).map((index) => {
        if(this.state.inspection_risk_check[index]) {
          let item = {title:all_data.inspection_risk.title, risk_factors_id:index, name:all_data.inspection_risk.values[index]};
          inspections['inspection_risk'].push(item);
        }
      })
    }
    if(all_data.inspection_sick != undefined){
      inspections['inspection_sick'] = [];
      Object.keys(this.state.inspection_sick_check).map((index) => {
        if(this.state.inspection_sick_check[index]) {
          let item = {title:all_data.inspection_sick.title, sick_history_id:index, name:all_data.inspection_sick.values[index]};
          inspections['inspection_sick'].push(item);
        }
      })
    }
    if(all_data.inspection_request != undefined && this.state.inspection_request_radio !== ''){
      inspections['inspection_request'] = [];
      let item = {title:all_data.inspection_request.title, request_id:this.state.inspection_request_radio, name:all_data.inspection_request.values[this.state.inspection_request_radio]};
      inspections['inspection_request'].push(item);
    }
    if(all_data.inspection_movement != undefined && this.state.inspection_movement_radio !== ''){
      inspections['inspection_movement'] = [];
      let item = {title:all_data.inspection_movement.title, movement_id:this.state.inspection_movement_radio, name:all_data.inspection_movement.values[this.state.inspection_movement_radio]};
      inspections['inspection_movement'].push(item);
    }
    if(this.state.is_anesthesia !== ''){
      inspections['is_anesthesia'] = [];
      let item = {title:'麻酔', is_anesthesia:this.state.is_anesthesia, name:this.state.is_anesthesia ? '麻酔有り' : '麻酔無し'};
      inspections['is_anesthesia'].push(item);
    }
    if(this.state.is_sedation !== ''){
      inspections['is_sedation'] = [];
      let item = {title:'鎮静', is_sedation:this.state.is_sedation, name:this.state.is_sedation ? '麻酔有り' : '麻酔無し'};
      inspections['is_sedation'].push(item);
    }
    if(this.state.enable_connection_date === 1 && this.state.calculation_start_date !== ''){
      inspections['connection_date_title'] = this.state.connection_date_title;
      inspections['calculation_start_date'] = formatDateLine(this.state.calculation_start_date);
    }
    if(this.state.count !== ''){
      inspections['count'] = this.state.count;
    }
    if (all_data.enable_count_value == 1){
      inspections['count_label'] = all_data.count_label;
    }
    if (all_data.count_suffix != ''){
      inspections['count_suffix'] = all_data.count_suffix;
    }
    if(this.state.enable_height_weight_surface_area === 1){
      inspections['height'] = parseFloat(this.state.height);
      inspections['weight'] = parseFloat(this.state.weight);
      inspections['surface_area'] = this.state.surface_area;
      inspections['formula_id'] = this.state.formula_id;
      if(this.input_done_info){
        inspections['done_height'] = parseFloat(this.state.height);
        inspections['done_weight'] = parseFloat(this.state.weight);
        inspections['done_surface_area'] = this.state.surface_area;
        inspections['done_formula_id'] = this.state.formula_id;
      }
    }
    inspections['is_emergency'] = this.state.is_emergency;
    inspections['system_patient_id'] = this.state.patientId;
    inspections['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
    if(this.state.all_data.is_reserved === 1){
      if(this.state.multi_reserve_flag == 1){
        inspections['multi_reserve_flag'] = 1;
        inspections['inspection_DATETIME'] = null;
        inspections['reserve_data'] = this.state.reserve_data;
      } else {
        if(this.state.not_yet){
          inspections['inspection_DATETIME'] = "日未定";
        } else {
          inspections['inspection_DATETIME'] = formatDateLine(this.state.inspection_DATETIME);
          inspections['reserve_time'] = this.state.reserve_time == null ? "時間未定" : this.state.reserve_time;
          inspections['reserve_data'] = this.state.reserve_data;
        }
      }
    } else {
      inspections['inspection_DATETIME'] = this.state.not_yet ? "日未定" : formatDateLine(this.state.inspection_DATETIME);
    }
    inspections['etc_comment'] = this.state.etc_comment;
    if(this.state.enable_body_part === 1){
      inspections['body_part'] = this.state.body_part;
      if(this.input_done_info){
        inspections['done_body_part'] = this.state.body_part;
      }
    }
    inspections['sick_name'] = this.state.sick_name;
    inspections['doctor_code'] = authInfo.staff_category == 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    inspections['doctor_name'] = authInfo.staff_category == 1 ? authInfo.name : this.context.selectedDoctor.name;
    inspections['patientInfo'] = this.props.patientInfo;
    inspections['image_path'] = this.state.image_path;
    //加算項目------------------------------
    if(this.state.additions !== undefined && this.state.additions != null && Object.keys(this.state.additions_check).length > 0){
      inspections['additions'] = {};
      Object.keys(this.state.additions_check).map(key => {
        if (this.state.additions_check[key]){
          let addition_row = '';
          this.state.additions.map(addition => {
            if (addition.addition_id == key){
              addition['sending_flag'] = 2;
              if(addition.sending_category === 1){
                addition['sending_flag'] = 1;
              }
              if(addition.sending_category === 3 && this.state.additions_send_flag_check[key]){
                addition['sending_flag'] = 1;
              }
              addition_row = addition;
            }
          });
          inspections['additions'][key] = addition_row;
        }
      })
    }
    if (authInfo.staff_category != 1){
      inspections['substitute_name'] = authInfo.name;
    }
    if(this.props.cache_index != null){
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_EDIT, this.props.cache_index, JSON.stringify(inspections), 'insert');
    } else {
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.INSPECTION_EDIT, new Date().getTime(), JSON.stringify(inspections), 'insert');
    }
    // refresh soap page
    this.context.$setExaminationOrderFlag(1);
    this.props.closeModal();
  }

  selectClassific1 =(id, name)=>{
    this.change_flag = 1;
    this.setState({
      classification1_id:id,
      classification1_name:name,
      classification2_id:0,
      classification2_name:'',
    });
  }

  selectClassific2 =(id, name)=>{
    this.change_flag = 1;
    this.setState({
      classification2_id:id,
      classification2_name:name,
      additions_check:{},
    });
  }

  getEtcComment =(value)=>{
    this.change_flag = 1;
    this.setState({
      etc_comment:value,
    });
  }

  getSickName =(value)=>{
    this.change_flag = 1;
    this.setState({
      sick_name:value,
    });
  }

  getSpecialPresentation =(value)=>{
    this.change_flag = 1;
    this.setState({
      special_presentation:value,
    });
  }

  calculateSurface(formula_name){
    this.change_flag = 1;
    if (formula_name == undefined || formula_name ==null || formula_name == '') {
      this.setState({surface_area:''});
      return false;
    }
    var height = parseFloat(this.state.height);
    var weight = parseFloat(this.state.weight);
    var formula = this.state.formula_data[formula_name];
    formula = formula.replace('height', height);
    formula = formula.replace('weight', weight);
    var surface_area = eval(formula);
    surface_area = parseFloat(surface_area).toFixed(4);
    this.setState({surface_area});
  }

  selectBody = (name, e) => {
    if(e < 0) e = 0;
    switch(name){
      case 'weight':
        this.change_flag = 1;
        this.manual_height_weight_change = true;
        this.setState({weight: isNaN(parseFloat(e)) ? '' : e}, () => {
          this.calculateSurface(this.state.formula);
        });
        break;
      case 'height':
        this.change_flag = 1;
        this.manual_height_weight_change = true;
        this.setState({height: isNaN(parseFloat(e)) ? '' : e}, () => {
          this.calculateSurface(this.state.formula);
        });
        break;
      case 'surface_area':
        this.change_flag = 1;
        this.setState({surface_area: isNaN(parseFloat(e)) ? '' : parseFloat(e)});
        break;
    }
  };

  selectType =(id, name)=>{
    this.change_flag = 1;
    this.setState({
      inspection_type_id:id,
      inspection_type_name:name,
      inspection_item_id:0,
      inspection_item_name:"",
    });
  }

  selectItem =(id, name)=>{
    this.change_flag = 1;
    this.setState({
      inspection_item_id:id,
      inspection_item_name:name,
    });
  }

  getDate = value => {
    this.change_flag = 1;
    this.setState({
      inspection_DATETIME: value,
      not_yet: false,
    });
  }

  setNodate = () => {
    this.change_flag = 1;
    this.setState({
      inspection_DATETIME: '',
      not_yet: true,
      is_emergency:0,
      isOpenReserveCalendar:false,
    });
  };

  setEmergency=()=>{
    this.change_flag = 1;
    let is_emergency = this.state.is_emergency;
    if(is_emergency === 1){
      this.setState({is_emergency:0});
    } else {
      this.setState({
        is_emergency:1,
        inspection_DATETIME: new Date(),
        not_yet: false,
        reserve_time:'',
        reserve_data:null,
      });
    }
  };

  openBodyPart = () => {
    this.setState({isBodyPartOpen: true})
  };

  closeBodyParts = () =>{
    this.setState({ isBodyPartOpen: false });
  }

  bodyPartConfirm = value => {
    this.change_flag = 1;
    this.setState({
      isBodyPartOpen: false,
      body_part: value
    })
  };

  handleShema = async () => {
    this.change_flag = 1;
    this.setState({
      isOpenShemaModal: true
    });
  }

  closeShemaModal = () => {
    this.change_flag = 1;
    this.setState({
      isOpenShemaModal: false
    })
  }

  openReserveCalendar = () => {
    this.change_flag = 1;
    this.setState({isOpenReserveCalendar: true});
  }

  closeCalendarModal = () => {
    this.setState({isOpenReserveCalendar: false});
  };

  setReserveDateTime = (date, time, reserve_data, multi_reserve_flag=0) => {
    if(date == null && multi_reserve_flag == 0){
      this.setNodate();
      return;
    }
    this.change_flag = 1;
    this.setState({
      multi_reserve_flag,
      inspection_DATETIME: date == null ? date : new Date(date),
      reserve_time: time,
      not_yet: false,
      reserve_data,
      isOpenReserveCalendar:false,
    });
  };

  handleOk = () => {
    this.setState({
      isOpenShemaModal: false
    });
  }

  registerImage = (img_base64) => {
    this.change_flag = 1;
    this.setState({
      imgBase64: img_base64,
      isOpenShemaModal: false
    });
  }

  getCalculationStartDate = value => {
    this.change_flag = 1;
    this.setState({calculation_start_date: value});
  };

  amountCancel = () => {
    this.setState({isAmountOpen: false})
  };

  amountConfirm = (number) => {
    this.change_flag = 1;
    this.setState({
      isAmountOpen: false,
      count:number
    })
  };

  openCalc =()=>{
    this.setState({
      isAmountOpen: true,
    });
  };

  getFormula = e => {
    this.change_flag = 1;
    this.setState({
      formula_id:parseInt(e.target.id),
      formula:e.target.value
    }, () => {
      this.calculateSurface(this.state.formula);
    })
  }

  getAdditions = (name, number) => {
    this.change_flag = 1;
    let check_status = {};
    if (name == 'additions') {
      check_status = this.state.additions_check;
      check_status[number] = !check_status[number];
      this.setState({additions_check:check_status});
    }
  }

  getAdditionsSendFlag = (name, number) => {
    this.change_flag = 1;
    let check_status = {};
    if (name == 'additions_sending_flag') {
      check_status = this.state.additions_send_flag_check;
      check_status[number] = !check_status[number];
      this.setState({additions_send_flag_check:check_status});
    }
  }

  confirmCloseModal=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_type: "modal_close",
        confirm_title: "入力中",
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
      });
    } else {
      this.props.closeModal();
    }
  }
  
  
  confirmOk=()=>{
    if(this.state.confirm_type === "modal_close"){
      this.props.closeModal();
    }
    if(this.state.confirm_type === "register"){
      this.saveData(this.state.done_flag);
    }
  }

  render() {
    let {formula_list} = this.state;
    let addition_count = 0;
    if(this.state.additions != undefined && this.state.additions != null && this.state.additions.length > 0){
      this.state.additions.map(addition => {
        if (addition.addition_id != 6579 || this.state.modalName =='心臓エコー'){
          addition_count ++;
        } else {
          if (this.state.modalName.includes('エコー') && this.state.classification2_name.includes('断層撮影法')){
            addition_count ++;
          }
        }
      });
    }
    return (
      <>
        <Modal
          show={true}
          id="physiological"
          className="custom-modal-sm patient-exam-modal physiological-modal first-view-modal"
        >
          <Modal.Header>
            <Modal.Title>
              <Header>
                {this.state.modalName}
                {(this.state.inspection_id === 17) && (
                  <div className="footer-buttons shema-btn">
                    <Button className="red-btn" onClick={this.handleShema}>シェーマ</Button>
                  </div>
                )}
              </Header>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                {this.state.all_data == null ? (
                  <>
                    <div className='text-center'>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={'flex'} style={{height:"100%"}}>
                      <div>
                        <div className={'flex depart'}>
                          <DepartOneTwo
                            all_data={this.state.all_data}
                            classification1_id={this.state.classification1_id}
                            selectClassific1={this.selectClassific1.bind(this)}
                            classification2_id={this.state.classification2_id}
                            selectClassific2={this.selectClassific2.bind(this)}
                            inspection_id={this.state.inspection_id}
                            selectType={this.selectType.bind(this)}
                            inspection_type_id={this.state.inspection_type_id}
                            selectItem={this.selectItem.bind(this)}
                            inspection_item_id={this.state.inspection_item_id}
                          />
                        </div>
                        <div className={'flex'}>
                          <RegionBottom
                            etc_comment={this.state.etc_comment}
                            getEtcComment={this.getEtcComment.bind(this)}
                            sick_name={this.state.sick_name}
                            getSickName={this.getSickName.bind(this)}
                            special_presentation={this.state.special_presentation}
                            getSpecialPresentation={this.getSpecialPresentation.bind(this)}
                            inspection_id={this.state.inspection_id}
                            system_patient_id={this.state.patientId}
                          />
                          <CheckBoxArea>
                            {this.state.all_data.inspection_request != undefined && (
                              <div className={'block-area'}>
                                <div className={'block-title'}>{this.state.all_data.inspection_request.title}</div>
                                <>
                                  {Object.keys(this.state.all_data.inspection_request.values).map((index)=>{
                                    return (
                                      <>
                                        <Radiobox
                                          label={this.state.all_data.inspection_request.values[index]}
                                          value={index}
                                          getUsage={this.getInspectionRequest.bind(this)}
                                          checked={this.state.inspection_request_radio == index ? true : false}
                                          name={`inspection_request`}
                                        />
                                      </>
                                    );
                                  })}
                                </>
                              </div>
                            )}
                            {this.state.all_data.inspection_movement != undefined && (
                              <div className={'block-area'}>
                                <div className={'block-title'}>{this.state.all_data.inspection_movement.title}</div>
                                <>
                                  {Object.keys(this.state.all_data.inspection_movement.values).map((index)=>{
                                    return (
                                      <>
                                        <Radiobox
                                          label={this.state.all_data.inspection_movement.values[index]}
                                          value={index}
                                          getUsage={this.getInspectionMovement.bind(this)}
                                          checked={this.state.inspection_movement_radio == index ? true : false}
                                          name={`inspection_movement`}
                                        />
                                      </>
                                    );
                                  })}
                                </>
                              </div>
                            )}
                            {this.state.enable_height_weight_surface_area === 1 && (
                              <div className={'block-area'}>
                                <div className={'block-title'}>身長・体重・体表面積</div>
                                <div className="div-tall-weight">
                                  <div className={'flex'} style={{marginTop:"0.5rem"}}>
                                    <NumericInputWithUnitLabel
                                      label={'身長'}
                                      unit="cm"
                                      className="form-control"
                                      value={this.state.height}
                                      min = {0}
                                      max = {400}
                                      size = {4}
                                      step = {0.1}
                                      precision = {1}
                                      getInputText={this.selectBody.bind(this, "height")}
                                      inputmode="numeric"
                                      id='height_id'
                                    />
                                  </div>
                                  <div className={'flex'} style={{marginTop:"0.5rem"}}>
                                    <NumericInputWithUnitLabel
                                      label={'体重'}
                                      unit="kg"
                                      className="form-control"
                                      min = {0}
                                      max = {500}
                                      size = {4}
                                      step = {0.1}
                                      precision = {1}
                                      value={this.state.weight}
                                      getInputText={this.selectBody.bind(this, "weight")}
                                      inputmode="numeric"
                                      id='weight_id'
                                    />
                                  </div>
                                  <div className={'flex'} style={{marginTop:"0.5rem"}}>
                                    <NumericInputWithUnitLabel
                                      label={'体表面積'}
                                      unit='㎡'
                                      className="form-control"
                                      min = {0}
                                      max = {50}
                                      size = {6}
                                      step = {0.0001}
                                      precision = {4}
                                      value={this.state.surface_area}
                                      getInputText={this.selectBody.bind(this, "surface_area")}
                                      inputmode="numeric"
                                      id='surface_area_id'
                                    />
                                    <div className ="formula_area">
                                      <SelectorWithLabel
                                        options={formula_list}
                                        title={'（計算式'}
                                        getSelect={this.getFormula.bind(this)}
                                        departmentEditCode={this.state.formula_id}
                                      />
                                    </div>
                                    <div style={{lineHeight:"2rem"}}>）</div>
                                  </div>
                                  <div className="notice" style={{fontSize:"1rem"}}>{this.state.height_weight_surface_area_text}</div>
                                </div>
                              </div>
                            )}
                            {this.state.enable_connection_date === 1 && (
                              <div className={'block-area'}>
                                <div className={'block-title'}>{this.state.connection_date_title}</div>
                                <div className={'calculation-start-date'}>
                                  <div className={'label-title'}>{this.state.connection_date_title}</div>
                                  <DatePicker
                                    locale="ja"
                                    selected={this.state.calculation_start_date}
                                    onChange={this.getCalculationStartDate.bind(this)}
                                    dateFormat="yyyy/MM/dd"
                                    placeholderText={""}
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    dayClassName = {date => setDateColorClassName(date)}
                                  />
                                </div>
                              </div>
                            )}
                            {(this.state.enable_count_value === 1) && (
                              <>
                                <div className={'block-area'}>
                                  <div className={'block-title'}>{this.state.count_label}</div>
                                  <>
                                    <div className={'count-area d-flex'}>
                                      <div className="border border-black mt-2 pl-1" style={{height:"34px", lineHeight:"34px", width:(this.state.count_input_length * 1.5)+"rem", cursor:"pointer"}} onClick={this.openCalc.bind(this)}>{this.state.count}</div>
                                      <div className="mt-2 pl-1" style={{height:"34px", lineHeight:"34px"}}>{this.state.count_suffix}</div>
                                    </div>
                                  </>
                                </div>
                              </>
                            )}
                          </CheckBoxArea>
                        </div>
                      </div>
                      <CheckBoxArea>
                        <div className={'head-title border-bottom'}>{this.state.inspection_id === 17 ? '検査目的' : 'コメント'}</div>
                        {(this.state.inspection_id === 17 && this.state.all_data.inspection_purpose !== undefined && (
                          <div className={'block-area'}>
                            <>
                              {Object.keys(this.state.all_data.inspection_purpose.values).map((index)=>{
                                return (
                                  <>
                                    <Checkbox
                                      label={this.state.all_data.inspection_purpose.values[index]}
                                      getRadio={this.getPresentCondition.bind(this)}
                                      number={index}
                                      value={this.state.inspection_purpose_check[index]}
                                      name={`inspection_purpose`}
                                    />
                                  </>
                                );
                              })}
                            </>
                          </div>
                        ))}
                        {(this.state.all_data.inspection_purpose !== undefined && this.state.inspection_id !== 17) && (
                          <div className={'block-area'}>
                            <div className={'block-title'}>{this.state.all_data.inspection_purpose.title}</div>
                            <>
                              {Object.keys(this.state.all_data.inspection_purpose.values).map((index)=>{
                                return (
                                  <>
                                    <Checkbox
                                      label={this.state.all_data.inspection_purpose.values[index]}
                                      getRadio={this.getPresentCondition.bind(this)}
                                      number={index}
                                      value={this.state.inspection_purpose_check[index]}
                                      name={`inspection_purpose`}
                                    />
                                  </>
                                );
                              })}
                            </>
                          </div>
                        )}
                        {this.state.all_data.inspection_symptom !== undefined && (
                          <>
                            <div className={'block-area'}>
                              <div className={'block-title'}>{this.state.all_data.inspection_symptom.title}</div>
                              <>
                                {Object.keys(this.state.all_data.inspection_symptom.values).map((index)=>{
                                  return (
                                    <>
                                      <Checkbox
                                        label={this.state.all_data.inspection_symptom.values[index]}
                                        getRadio={this.getPresentCondition.bind(this)}
                                        number={index}
                                        value={this.state.inspection_symptom_check[index]}
                                        name={`inspection_symptom`}
                                      />
                                    </>
                                  );
                                })}
                              </>
                            </div>
                          </>
                        )}
                        {this.state.all_data.inspection_risk !== undefined && (
                          <>
                            <div className={'block-area'}>
                              <div className={'block-title'}>{this.state.all_data.inspection_risk.title}</div>
                              <>
                                {Object.keys(this.state.all_data.inspection_risk.values).map((index)=>{
                                  return (
                                    <>
                                      <Checkbox
                                        label={this.state.all_data.inspection_risk.values[index]}
                                        getRadio={this.getPresentCondition.bind(this)}
                                        number={index}
                                        value={this.state.inspection_risk_check[index]}
                                        name={`inspection_risk`}
                                      />
                                    </>
                                  );
                                })}
                              </>
                            </div>
                          </>
                        )}
                        {this.state.all_data.inspection_sick !== undefined && (
                          <>
                            <div className={'block-area'}>
                              <div className={'block-title'}>{this.state.all_data.inspection_sick.title}</div>
                              <>
                                {Object.keys(this.state.all_data.inspection_sick.values).map((index)=>{
                                  return (
                                    <>
                                      <Checkbox
                                        label={this.state.all_data.inspection_sick.values[index]}
                                        getRadio={this.getPresentCondition.bind(this)}
                                        number={index}
                                        value={this.state.inspection_sick_check[index]}
                                        name={`inspection_sick`}
                                      />
                                    </>
                                  );
                                })}
                              </>
                            </div>
                          </>
                        )}
                        {this.state.inspection_id === 4 && (
                          <>
                            <div className={'block-area'}>
                              <div className={'block-title'}>{'麻酔'}</div>
                              <Radiobox
                                label={'麻酔有り'}
                                value={1}
                                getUsage={this.getIsAnesthesia.bind(this)}
                                checked={this.state.is_anesthesia === 1}
                                name={`is_anesthesia`}
                              />
                              <Radiobox
                                label={'麻酔無し'}
                                value={0}
                                getUsage={this.getIsAnesthesia.bind(this)}
                                checked={this.state.is_anesthesia === 0}
                                name={`is_anesthesia`}
                              />
                            </div>
                            <div className={'block-area'}>
                              <div className={'block-title'}>{'鎮静'}</div>
                              <Radiobox
                                label={'鎮静有り'}
                                value={1}
                                getUsage={this.getIsSedation.bind(this)}
                                checked={this.state.is_sedation === 1}
                                name={`is_sedation`}
                              />
                              <Radiobox
                                label={'鎮静無し'}
                                value={0}
                                getUsage={this.getIsSedation.bind(this)}
                                checked={this.state.is_sedation === 0 ? true : false}
                                name={`is_sedation`}
                              />
                            </div>
                          </>
                        )}
                        {(this.state.enable_body_part === 1) && (
                          <div className={'block-area'}>
                            <div className={'block-title'}>{'部位'}</div>
                            <div className={'flex'}>
                              <input type="text" readOnly={true} value={this.state.body_part} style={{width:"70%",marginTop:10}}/>
                              <button onClick={this.openBodyPart.bind(this)} style={{width:"30%", height:"30px",marginTop:10}}>部位編集</button>
                            </div>
                          </div>
                        )}
                        {this.state.additions !== undefined && this.state.additions != null && this.state.additions.length > 0 && addition_count > 0 && (
                          <div className={'flex'} style={{marginTop:"20px"}}>
                            <div className={'block-area shoot-instruction'} style={{width:"100%"}}>
                              <div className={'block-title'}>追加指示・指導・処置等選択</div>
                              {this.state.additions.map(addition=>{
                                if(addition.addition_id != 6579 || this.state.modalName ==='心臓エコー'){
                                  return (
                                    <>
                                      <div>
                                        <Checkbox
                                          label={addition.name}
                                          getRadio={this.getAdditions.bind(this)}
                                          number={addition.addition_id}
                                          value={this.state.additions_check[addition.addition_id]}
                                          name={`additions`}
                                        />
                                        {addition.sending_category === 3 && (
                                          <>
                                            <Checkbox
                                              label={'送信する'}
                                              getRadio={this.getAdditionsSendFlag.bind(this)}
                                              number={addition.addition_id}
                                              value={this.state.additions_send_flag_check[addition.addition_id]}
                                              name={`additions_sending_flag`}
                                            />
                                            <div style={{fontSize:"14px", textAlign:"right"}}>※送信するチェックボックスにチェックすると医事に送信されます。</div>
                                          </>
                                        )}
                                      </div>
                                    </>
                                  )
                                } else {
                                  if (this.state.modalName.includes('エコー') && this.state.classification2_name.includes('断層撮影法')){
                                    return (
                                      <>
                                        <Checkbox
                                          label={addition.name}
                                          getRadio={this.getAdditions.bind(this)}
                                          number={addition.addition_id}
                                          value={this.state.additions_check[addition.addition_id]}
                                          name={`additions`}
                                        />
                                        {addition.sending_category === 3 && (
                                          <>
                                            <Checkbox
                                              label={'送信する'}
                                              getRadio={this.getAdditionsSendFlag.bind(this)}
                                              number={addition.addition_id}
                                              value={this.state.additions_send_flag_check[addition.addition_id]}
                                              name={`additions_sending_flag`}
                                            />
                                            <div style={{fontSize:"14px", textAlign:"right"}}>※送信するチェックボックスにチェックすると医事に送信されます。</div>
                                          </>
                                        )}
                                      </>
                                    )
                                  }
                                }
                              })}
                            </div>
                          </div>
                        )}
                        {this.state.multi_reserve_flag === 1 && (
                          <div className={'block-area'}>
                            <div className={'block-title'}>予約日時</div>
                            <div className={'reserve-date-area'}>
                              {this.state.reserve_data.map(time=>{
                                return (
                                  <>
                                    <div className={'time-row'}>
                                      {formatJapanDateSlash(time.inspection_date) + " " + time.block_start_time}
                                    </div>
                                  </>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </CheckBoxArea>
                    </div>
                  </>
                )}
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <DatePickerBox>
            <Footer>
              {this.state.multi_reserve_flag === 0 && (
                <>
                  <div className="date-label">検査日</div>
                  {this.state.all_data != null && this.state.all_data.is_reserved === 1 ? (
                    <div className={'date-area'}>
                      {this.state.not_yet ? "日未定" : formatDateSlash(this.state.inspection_DATETIME) + ' ' + (this.state.reserve_time == null ? "時間未定" : this.state.reserve_time)}
                    </div>
                  ):(
                    <DatePicker
                      locale="ja"
                      selected={this.state.inspection_DATETIME}
                      onChange={this.getDate.bind(this)}
                      dateFormat="yyyy/MM/dd"
                      placeholderText={this.state.not_yet ? "日未定" : ""}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                  )}
                </>
              )}
              {this.state.end_until_continue_type === 0 ? (
                <div className={"custom-modal-btn red-btn"} style={{cursor:"pointer", marginRight:"1rem"}} onClick={this.setNodate.bind(this)}><span>日未定</span></div>
              ):(
                <div className={"custom-modal-btn disable-btn"} style={{marginRight:"1rem"}}><span>日未定</span></div>
              )}
              {this.state.all_data != null && this.state.all_data.is_reserved === 1 && this.state.is_emergency === 0 ? (
                <div className={"custom-modal-btn reservation red-btn"} style={{cursor:"pointer"}} onClick={this.openReserveCalendar.bind(this)}><span>予約</span></div>
              ):(
                <div className={"custom-modal-btn disable-btn"}><span>予約</span></div>
              )}
              <div
                className={"custom-modal-btn emergency " + (this.state.multi_reserve_flag === 1 ? 'disable-btn' : (this.state.is_emergency === 1 ? "red-btn select-eme" : "cancel-btn"))}
                style={{cursor:(this.state.multi_reserve_flag === 1 ? '' : "pointer")}}
                onClick={this.setEmergency.bind(this)}
              ><span>当日緊急</span></div>
              <div className={"custom-modal-btn cancel cancel-btn"} style={{cursor:"pointer", marginRight:"1rem"}} onClick={this.confirmCloseModal}><span>キャンセル</span></div>
              {(this.state.end_until_continue_type === 0 || (this.state.end_until_continue_type === 2 && this.state.karte_status != 3)) ? (
                <>
                  {this.context.$getKarteMode(this.props.patientId) == KARTEMODE.EXECUTE ? (
                    <>
                      {(this.state.number > 0 && this.state.state !== 2)  ? (
                        <>
                          {this.can_register ? (
                            <div onClick={this.save.bind(this, 0)} className={"custom-modal-btn red-btn"} style={{cursor:"pointer", marginRight:"1rem"}}><span>確定(指示)</span></div>
                          ):(
                            <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                              <div className={"custom-modal-btn disable-btn"} style={{marginRight:"1rem"}}><span>確定(指示)</span></div>
                            </OverlayTrigger>
                          )}
                        </>
                      ):(
                        <div className={"custom-modal-btn disable-btn"} style={{cursor:"pointer", marginRight:"1rem"}}><span>確定(指示)</span></div>
                      )}
                      {this.can_done ? (
                        <div onClick={this.save.bind(this, 2)} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}><span>確定(指示& 実施)</span></div>
                      ):(
                        <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                          <div className={"custom-modal-btn disable-btn"}><span>確定(指示& 実施)</span></div>
                        </OverlayTrigger>
                      )}
                    </>
                  ):(
                    <>
                      {(this.state.number > 0 && this.state.state === 2)  ? (
                        <>
                          <div className={"custom-modal-btn disable-btn"} style={{cursor:"pointer", marginRight:"1rem"}}><span>確定(指示)</span></div>
                          {this.can_done ? (
                            <div onClick={this.save.bind(this, 2)} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}><span>確定(指示& 実施)</span></div>
                          ):(
                            <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                              <div className={"custom-modal-btn disable-btn"}><span>確定(指示& 実施)</span></div>
                            </OverlayTrigger>
                          )}
                        </>
                      ):(
                        <>
                          {this.can_register ? (
                            <div onClick={this.save.bind(this, 0)} className={"custom-modal-btn red-btn"} style={{cursor:"pointer", marginRight:"1rem"}}><span>確定(指示)</span></div>
                          ):(
                            <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                              <div className={"custom-modal-btn disable-btn"} style={{marginRight:"1rem"}}><span>確定(指示)</span></div>
                            </OverlayTrigger>
                          )}
                          <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                            <div className={"custom-modal-btn disable-btn"}><span>確定(指示& 実施)</span></div>
                          </OverlayTrigger>
                        </>
                      )}
                    </>
                  )}
                </>
              ):(
                <>
                  {(this.state.number > 0 && this.state.state === 2)  ? (
                    <>
                      <div className={"custom-modal-btn disable-btn"} style={{cursor:"pointer", marginRight:"1rem"}}><span>確定(指示)</span></div>
                      {this.can_done ? (
                        <div onClick={this.save.bind(this, 2)} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}><span>確定(指示& 実施)</span></div>
                      ):(
                        <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                          <div className={"custom-modal-btn disable-btn"}><span>確定(指示& 実施)</span></div>
                        </OverlayTrigger>
                      )}
                    </>
                  ):(
                    <>
                      {this.can_register ? (
                        <div onClick={this.save.bind(this)} className={"custom-modal-btn red-btn"} style={{cursor:"pointer", marginRight:"1rem"}}><span>確定(指示)</span></div>
                      ):(
                        <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                          <div className={"custom-modal-btn disable-btn"}><span>確定(指示)</span></div>
                        </OverlayTrigger>
                      )}
                      <div className={"custom-modal-btn disable-btn"} style={{cursor:"pointer"}}><span>確定(指示& 実施)</span></div>
                    </>
                  )}
                </>
              )}
            </Footer>
            </DatePickerBox>
          </Modal.Footer>
          {this.state.isBodyPartOpen && (
            <BodyPartsPanel
              bodyPartData={this.state.body_part_json}
              closeBodyParts={this.closeBodyParts}
              usageName={this.state.modalName}
              body_part={(this.state.body_part !== undefined && this.state.body_part != null) ? this.state.body_part : ""}
              bodyPartConfirm={this.bodyPartConfirm}
            />
          )}
          {this.state.isOpenShemaModal === true && (
            <EndoscopeEditModal
              handleOk={this.handleOk}
              closeModal={this.closeShemaModal}
              handlePropInsert={this.registerImage}
              imgBase64={this.state.imgBase64}
            />
          )}
          {this.state.isOpenReserveCalendar && (
            <EndoscopeReservationModal
              handleOk={this.setReserveDateTime.bind(this)}
              system_patient_id={this.state.patientId}
              inspection_id={this.state.inspection_id}
              inspection_DATETIME={this.state.inspection_DATETIME}
              reserve_time={this.state.reserve_time}
              closeModal={this.closeCalendarModal}
              patient_name={this.state.patient_name}
              reserve_type={'inspection'}
              enable_multi_reserve={this.state.end_until_continue_type === 0}
              reserve_data={this.state.reserve_data}
            />
          )}
          {this.state.isAmountOpen && (
            <AmountInput
              calcConfirm={this.amountConfirm}
              units={this.state.count_suffix}
              calcCancel={this.amountCancel}
              daysSelect={false}
              daysInitial={this.state.daysInitial}
              daysLabel=""
              daysSuffix=""
              usageData={this.state.usageData}
              bodyPartData={this.state.bodyPartData}
              showedPresData={this.state.showedPresData}
              modal_title={this.state.count_label}
              amount={this.state.count}
            />
          )}
          {this.state.alert_message !== "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
          {this.state.confirm_message !== "" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_title}
            />
          )}
        </Modal>
      </>
    );
  }
}

PhysiologicalModal.contextType = Context;
PhysiologicalModal.defaultProps = {
  cache_index: null
};
PhysiologicalModal.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  modalName: PropTypes.string,
  cache_data: PropTypes.object,
  inspectionId: PropTypes.number,
  closeModal: PropTypes.func,
  cache_index:PropTypes.number,
};
export default PhysiologicalModal;
