import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Context from "~/helpers/configureStore";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES, KARTEMODE} from "~/helpers/constants";
import Checkbox from "~/components/molecules/Checkbox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import BasicInfoInputModal from "../../components/BasicInfoInputModal";
import EndoscopeReservationModal from "~/components/templates/Patient/Modals/Common/EndoscopeReservationModal";
import {formatDateLine} from "~/helpers/date";
import { faMinusCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import Spinner from "react-bootstrap/Spinner";
import Tooltip from "react-bootstrap/Tooltip";
const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
`;

const Wrapper = styled.div`  
   width: 100%;
   height: 100%;
   font-size: 1rem;
   overflow-y:auto;
   padding-left:20px;
   .flex{
    display: flex;
   }
   .mb-rem{
     margin-bottom:0.3rem;
   }
  .selected, .selected:hover{
    background:lightblue!important;      
  }
  .topic-label{
    width: 5rem;
    line-height: 2rem;
    margin-bottom: 0;
  }
  .patient-profile-content{
    margin-right: 0.3rem;
    min-width: 5rem;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    line-height: 2rem;
    border:1px solid;
  }
  .up-down-buttons{
    float:right;
    padding-right:30px;
  }
  .title-label{
    width: 5rem;
    line-height: 2rem;
    margin-bottom: 0;    
  }
  .value{
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    width: 6rem;
    line-height: 2rem;
    border: 1px solid;
  }
  .unit-span{
    width: 3rem;
    line-height: 2rem;
    margin-left: 0.3rem;
  }
  .list{
    border: 1px solid;
    overflow-y: auto;
    margin-right: 1rem;
    height: 4rem;
    width: 15rem;
    padding: 0.2rem;
  }
  .main-insturctions{
    .list{
      width:90%;
      height:100%;
    }
  }
  .right-area{
    .label-title{
      display:none;
    }
    label{
      margin-right:10px;
    }
    button{
      margin-left:10px;
      margin-right:10px;
    }
  }
  textarea{
    width:100%;
  }
  .checkbox-contents{
    border: 1px solid;
    width: fit-content;
    label{
      margin-right:25px;
    }
    .label-title{
      display:none;
    }
    input{
      width:80%;
      margin-right:20px;
    }
  }
  .disable-area{
    .label-title{
      width:90px;
      text-align:right;
      margin-right:10px;    
    }
    input{
      width:250px;
    }
  }
  .table-area{
    width: 80%;        
    margin-left: 10%;
  }
  .treat-date {
    line-height:2rem;
    width: 5rem;
  }
  .react-datepicker-wrapper {
    input {
      height: 2rem;
      width: 7rem;
    }
  }
  .free-comment {
    div {
      margin:0;
      .label-title {
        width: 0;
        margin: 0;
      }
      input {
        width: 90%;
        height: 2rem;
      }
    }
  }
  .input-value {
    margin-right: 0.3rem;
    div{margin:0;}
    .label-title {
      font-size: 1rem;
      width: 6rem;
      line-height: 2rem;
      margin: 0;
    }
    .react-numeric-input input {
      height:2rem;
      width: 5rem !important;
    }
    .label-unit {
      width: 2rem;
      margin: 0;
      line-height: 2rem;
      font-size: 1rem;
    }
  }
  .select-value {
    .pullbox-title {
      font-size: 1rem;
      width: 6rem;
      margin: 0;
      line-height: 2rem;
    }
    .pullbox-label {
      margin:0;
      .pullbox-select {
        width:7rem;
        height: 2rem;
      }
    }
  }
  .select-disease-area {
    align-items: flex-start;
    justify-content: space-between;
    padding-right: 1rem;
    margin-top: 0.3rem;
    .block-area {
      width:19%;
      .box-area {
        wdith:100%;
        padding: 0.2rem;
        border: 1px solid;
        overflow-y: auto;
        height: 4rem;
        font-size:0.8rem;
      }
    }
    .disease-name-area{
      align-items: flex-start;
      justify-content: space-between;
      .delete-icon {
        cursor:pointer;
      }
    }
  }
  .select-food {font-size:0.8rem;}
  .check-box {
    label {font-size:1rem;}
  }
`;

class NutritionGuidance extends Component {
  constructor(props) {
    super(props);
    let cache_data = karteApi.getVal(props.patientId, CACHE_LOCALNAMES.NUTRITION_GUIDANCE);
    if (cache_data === undefined){
      cache_data = null;
    }
    if(props.order_data !== undefined && props.order_data != null){
      cache_data = props.order_data.order_data;
    }
    if(props.cache_data !== undefined && props.cache_data != null){
      cache_data = props.cache_data;
    }
    this.state = {
      height_weight:null,
      request_content:cache_data != null ? cache_data.request_content : [],
      importance_message:cache_data != null ? cache_data.importance_message : [],
      food_type_id:cache_data != null ? cache_data.food_type_id : 0,
      food_type_name:cache_data != null ? cache_data.food_type_name : '',
      calorie:cache_data != null ? cache_data.calorie : 0,
      protein:cache_data != null ? cache_data.protein : 0,
      lipid:cache_data != null ? cache_data.lipid : 0,
      sugar:cache_data != null ? cache_data.sugar : 0,
      pfc_ratio:cache_data != null ? cache_data.pfc_ratio : 0,
      salt_id:cache_data != null ? cache_data.salt_id : 0,
      phosphorus_flag:cache_data != null ? cache_data.phosphorus_flag : 0,
      potassium_flag:cache_data != null ? cache_data.potassium_flag : 0,
      moisture:cache_data != null ? cache_data.moisture : 0,
      ps_ratio:cache_data != null ? cache_data.ps_ratio : 0,
      guidance_content_other:cache_data != null ? cache_data.guidance_content_other : "",
      content_other:cache_data != null ? cache_data.content_other : "",
      reserve_datetime:cache_data != null ? cache_data.reserve_datetime : "",
      free_comment:cache_data != null ? cache_data.free_comment : "",
      food_type_comment:cache_data != null ? cache_data.food_type_comment : "",
      bmi:cache_data != null ? cache_data.bmi : 0,
      request_disease:cache_data != null ? cache_data.request_disease : [],
      selected_disease_data:cache_data != null ? cache_data.selected_disease_data : [],
      reserve_data:cache_data != null ? cache_data.reserve_data : null,
      done_order:(cache_data != null && cache_data.done_order != undefined) ? cache_data.done_order : 0,
      alert_messages:"",
      guidance_nutrition_content_master:[],
      guidance_nutrition_importance_message_master:[],
      food_classification_master:[],
      food_type_master:[],
      food_types:[],
      isOpenInputModal:false,
      isOpenReserveCalendar:false,
      disease_list:[],
      number:cache_data != null ? cache_data.number : 0,
      isForUpdate:(cache_data != null && cache_data.number != 0) ? 1 : 0,
      confirm_type:"",
      confirm_title: "",
      confirm_message:"",
      load_flag:false,
      close_type:false,
    };
    this.select_flag_data = [{id:0, value:"制限なし"}, {id:1, value:"制限あり"}];
    this.change_flag = 0;
    this.can_register = false;
  }

  async componentDidMount () {
    this.can_register = (this.context.$canDoAction(this.context.FEATURES.NUTRITION_GUIDANCE, this.context.AUTHS.REGISTER) || this.context.$canDoAction(this.context.FEATURES.NUTRITION_GUIDANCE, this.context.AUTHS.REGISTER_PROXY));
    await this.getMasterData();
    await this.getPatientWeightHeightInfo();
  }

  getPatientWeightHeightInfo=async()=>{
    let path = "/app/api/v2/patients/get/weight_height";
    let post_data = {
      patient_id:this.props.patientId,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let bmi = 0;
        if(res.height_weight != null){
          let height = parseFloat(res.height_weight.height/100);
          let weight = res.height_weight.weight;
          bmi = parseFloat(weight/(height*height)).toFixed(2);
        }
        this.setState({
          height_weight:res.height_weight,
          max_min_constants:res.max_min_constants,
          bmi,
          isOpenInputModal:false,
          load_flag:true,
        });
      })
      .catch(() => {
      });
  }

  getMasterData=async()=>{
    let path = "/app/api/v2/nutrition_guidance/get_data";
    let post_data = {
      patient_id:this.props.patientId,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.error_message !== undefined){
          this.setState({
            alert_messages:res.error_message,
            close_type:true,
          });
          return;
        }
        let food_classification_id = 0;
        if(res.food_type_master.length > 0 && this.state.food_type_id != 0){
          res.food_type_master.map(food_type=>{
            if(food_type.number == this.state.food_type_id){
              food_classification_id = food_type.food_classification_id;
            }
          })
        }
        this.category_1_data = res.category_1_data;
        this.category_2_data = res.category_2_data;
        this.category_3_data = res.category_3_data;
        this.disease_2_master_data = res.disease_2_master_data;
        this.setState({
          job_category:res.job_category,
          hos_number:res.hos_number,
          department_id:res.department_id,
          department_name:res.department_name,
          guidance_nutrition_content_master:res.guidance_nutrition_content_master,
          guidance_nutrition_importance_message_master:res.guidance_nutrition_importance_message_master,
          food_classification_master:res.food_classification_master,
          food_classification_id,
          food_type_master:res.food_type_master,
          dispaly_category_1_data:res.category_1_data,
        }, ()=>{
          this.setFoodTypes();
        });
      })
      .catch(() => {

      });
  }

  // 身長・体重
  openHeightInputModal = () => {
    if(!this.context.$canDoAction(this.context.FEATURES.VITAL, this.context.AUTHS.REGISTER, 0)){
      this.setState({alert_messages:"登録権限がありません。"});
      return;
    }
    let modal_data = {};
    if(this.state.height_weight != null){
      if(this.state.height_weight.measure_date == formatDateLine(new Date())){
        modal_data.number = this.state.height_weight.number;
      } else {
        modal_data.number = 0;
      }
      modal_data.height = this.state.height_weight.height;
      modal_data.weight = this.state.height_weight.weight;
      modal_data.measure_date = formatDateLine(new Date());
    } else {
      modal_data = null;
    }
    this.setState({
      isOpenInputModal: true,
      modal_data,
      modal_type: 0,
    });
  };

  setGuidanceNutritionContent =(name, number)=>{
    if(name == "guidance_nutrition_content"){
      let request_content = this.state.request_content;
      let index = request_content.indexOf(number);
      if(index === -1){
        request_content.push(number);
      } else {
        request_content.splice(index, 1);
      }
      this.change_flag = 1;
      this.setState({
        request_content,
      });
    }
    if(name == "guidance_nutrition_importance_message"){
      let importance_message = this.state.importance_message;
      let index = importance_message.indexOf(number);
      if(index === -1){
        importance_message.push(number);
      } else {
        importance_message.splice(index, 1);
      }
      this.change_flag = 1;
      this.setState({
        importance_message,
      });
    }
  };

  setFoodClassification = (item) => {
    this.change_flag = 1;
    this.setState({
      food_classification_id:parseInt(item.number),
      food_type_id:0,
      food_type_name:'',
    },()=>{
      this.setFoodTypes();
    });
  };

  setFoodTypes=()=>{
    let food_types = [];
    if(this.state.food_type_master.length > 0){
      this.state.food_type_master.map(food_type=>{
        if(food_type.food_classification_id == this.state.food_classification_id){
          food_types.push(food_type);
        }
      })
    }
    this.setState({
      food_types,
    });
  }

  setFoodType = (food_type) => {
    this.change_flag = 1;
    this.setState({
      food_type_id:parseInt(food_type.number),
      food_type_name:food_type.name,
    });
  };

  setValue=(key, value)=>{
    if(parseFloat(value) < 0 || value == "" || value == null){
      value = 0;
    }
    if(parseInt(value) < 1000000000){
      this.change_flag = 1;
      this.setState({[key]:parseInt(value)});
    } else {
      this.setState({[key]:this.state[key]});
    }
  };

  setSelectFlagValue=(key, e)=>{
    this.change_flag = 1;
    this.setState({[key]:parseInt(e.target.id)});
  }

  setComment=(key, e)=>{
    if (e.target.value.length > 25) {
      this.setState({alert_messages:(key == "free_comment" ? "フリーコメント":"その他")+"は全角25文字以上入力できません。"});
      return;
    }
    this.change_flag = 1;
    this.setState({[key]: e.target.value});
  }

  confirmCancel=()=>{
    if(this.state.close_type){
      this.props.closeModal();
    }
    this.setState({
      alert_messages: "",
      confirm_type: "",
      confirm_title: "",
      confirm_message: "",
      isOpenInputModal:false,
      isOpenReserveCalendar:false,
    });
  }

  setReserveDateTime = (date, time, reserve_data) => {
    this.change_flag = 1;
    this.setState({
      reserve_datetime:date+" "+(time == null ? "時間未定" : time),
      reserve_data,
      isOpenReserveCalendar:false,
    });
  };

  openReserveCalendar=()=>{
    this.setState({isOpenReserveCalendar:true});
  }

  saveData=()=>{
    if(this.state.height_weight == null){
      this.setState({alert_messages:"身体情報を入力してください。"});
      return;
    }
    if(this.state.food_type_id == 0){
      this.setState({alert_messages:"指示食種を選択してください。"});
      return;
    }
    if(this.state.calorie == 0){
      this.setState({alert_messages:"エネルギーを入力してください。"});
      return;
    }
    if(this.state.protein == 0){
      this.setState({alert_messages:"蛋白質を入力してください。"});
      return;
    }
    if(this.state.lipid == 0){
      this.setState({alert_messages:"脂質を入力してください。"});
      return;
    }
    if(this.state.sugar == 0){
      this.setState({alert_messages:"糖質を入力してください。"});
      return;
    }
    if(this.state.reserve_datetime == ""){
      this.setState({alert_messages:"予約日時を選択してください。"});
      return;
    }
    //test
    if(this.state.request_disease.length == 0){
      this.setState({alert_messages:"病名を選択してください。"});
      return;
    }
    this.setState({
      confirm_type:"register",
      confirm_title:"登録確認",
      confirm_message:"登録しますか？"
    });
  }

  saveCache=()=>{
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let nutrition_guidance = {};
    nutrition_guidance['number'] = this.state.number;
    nutrition_guidance['patient_id'] = this.props.patientId;
    nutrition_guidance['doctor_code'] = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    nutrition_guidance['doctor_name'] = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
    nutrition_guidance['hos_number'] = this.state.hos_number;
    nutrition_guidance['department_id'] = this.state.department_id;
    nutrition_guidance['department_name'] = this.state.department_name;
    nutrition_guidance['height'] = this.state.height_weight.height;
    nutrition_guidance['weight'] = this.state.height_weight.weight;
    nutrition_guidance['height_date'] = this.state.height_weight.measure_date;
    nutrition_guidance['weight_date'] = this.state.height_weight.measure_date;
    nutrition_guidance['bmi'] = this.state.bmi;
    nutrition_guidance['food_type_id'] = this.state.food_type_id;
    nutrition_guidance['food_type_name'] = this.state.food_type_name;
    nutrition_guidance['food_type_comment'] = this.state.food_type_comment;
    nutrition_guidance['calorie'] = this.state.calorie;
    nutrition_guidance['protein'] = this.state.protein;
    nutrition_guidance['lipid'] = this.state.lipid;
    nutrition_guidance['sugar'] = this.state.sugar;
    nutrition_guidance['pfc_ratio'] = this.state.pfc_ratio;
    nutrition_guidance['salt_id'] = this.state.salt_id;
    nutrition_guidance['phosphorus_flag'] = this.state.phosphorus_flag;
    nutrition_guidance['potassium_flag'] = this.state.potassium_flag;
    nutrition_guidance['moisture'] = this.state.moisture;
    nutrition_guidance['ps_ratio'] = this.state.ps_ratio;
    nutrition_guidance['guidance_content_other'] = this.state.guidance_content_other;
    nutrition_guidance['content_other'] = this.state.content_other;
    nutrition_guidance['reserve_datetime'] = this.state.reserve_datetime;
    nutrition_guidance['reserve_data'] = this.state.reserve_data;
    nutrition_guidance['free_comment'] = this.state.free_comment;
    nutrition_guidance['request_disease'] = this.state.request_disease;
    nutrition_guidance['request_disease_names'] = [];
    this.state.request_disease.map(disease=>{
      let disease_name = this.disease_2_master_data.find((x) => x.disease_cd == disease).name;
      nutrition_guidance['request_disease_names'].push(disease_name);
    })
    nutrition_guidance['selected_disease_data'] = this.state.selected_disease_data;
    nutrition_guidance['request_content'] = this.state.request_content;
    nutrition_guidance['request_content_names'] = [];
    if(this.state.request_content.length > 0){
      this.state.request_content.map(content=>{
        let content_name = this.state.guidance_nutrition_content_master.find((x) => x.number == content).name;
        nutrition_guidance['request_content_names'].push(content_name);
      })
    }
    nutrition_guidance['importance_message'] = this.state.importance_message;
    nutrition_guidance['importance_message_names'] = [];
    if(this.state.importance_message.length > 0){
      this.state.importance_message.map(message=>{
        let message_name = this.state.guidance_nutrition_importance_message_master.find((x) => x.number == message).name;
        nutrition_guidance['importance_message_names'].push(message_name);
      })
    }
    if(this.state.done_order == 1){
      nutrition_guidance['done_order'] = this.state.done_order;
    } else {
      nutrition_guidance['done_order'] = this.context.$getKarteMode(this.props.patientId) == KARTEMODE.EXECUTE ? 1 : 0;
    }

    nutrition_guidance['isForUpdate'] = this.state.isForUpdate;
    if(this.state.isForUpdate === 1){
      let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.NUTRITION_GUIDANCE);
      if(cache_data !== undefined && cache_data != null && cache_data.last_doctor_code !== undefined){
        nutrition_guidance.last_doctor_code = cache_data.last_doctor_code;
        nutrition_guidance.last_doctor_name = cache_data.last_doctor_name;
      }
      if (this.props.cache_data !== undefined && this.props.cache_data != null){
        cache_data = JSON.parse(JSON.stringify(this.props.cache_data));
        nutrition_guidance.last_doctor_code = cache_data.doctor_code;
        nutrition_guidance.last_doctor_name = cache_data.doctor_name;
      }
    }
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.NUTRITION_GUIDANCE, JSON.stringify(nutrition_guidance), 'insert');
    this.context.$setExaminationOrderFlag(1);
    this.props.closeModal();
  }

  selectCategory_1=(item)=>{
    let temp = [];
    temp = this.category_2_data.filter(x=>x.category_1_id == parseInt(item.category_1_id));
    this.change_flag = 1;
    this.setState({
      dispaly_category_2_data:temp,
      selected_category_1_id:item.category_1_id,
      selected_category_2_id:undefined,
      selected_category_3_id:undefined,
      dispaly_category_3_data:[],
      display_disease_master_data:[],
    });
  }

  selectCategory_2=(item)=>{
    let temp = [];
    temp = this.category_3_data.filter(x=>x.category_1_id == parseInt(item.category_1_id)).filter(x=>x.category_2_id == parseInt(item.category_2_id));
    this.change_flag = 1;
    this.setState({
      dispaly_category_3_data:temp,
      selected_category_2_id:item.category_2_id,
      selected_category_3_id:undefined,
      display_disease_master_data:[],
    });
  }

  selectCategory_3=(item)=>{
    let temp = [];
    temp = this.disease_2_master_data.filter(x=>x.category_3_id == parseInt(item.category_3_id));
    this.change_flag = 1;
    this.setState({
      display_disease_master_data:temp,
      selected_category_3_id:item.category_3_id,
    });
  }

  setItemName = (disease_item) => {
    let request_disease = this.state.request_disease;
    let index = request_disease.indexOf(disease_item.disease_cd);
    if(index == -1){
      request_disease.push(disease_item.disease_cd);
    } else {
      request_disease.splice(index, 1);
    }
    let selected_disease_data = this.state.selected_disease_data;
    index = -1;
    if(selected_disease_data.length  > 0){
      selected_disease_data.map((item, idx)=>{
        if(item.disease_cd == disease_item.disease_cd){
          index = idx;
        }
      })
    }
    if(index == -1){
      selected_disease_data.push(disease_item);
    } else {
      delete selected_disease_data[index];
    }
    this.change_flag = 1;
    this.setState({
      request_disease,
      selected_disease_data,
    });
  };

  removeDisease=(disease_item)=>{
    let selected_disease_data = this.state.selected_disease_data;
    let index = -1;
    selected_disease_data.map((item, idx)=>{
      if(item.disease_cd == disease_item.disease_cd){
        index = idx;
      }
    });
    if(index != -1){
      delete selected_disease_data[index];
    }
    let request_disease = this.state.request_disease;
    index = request_disease.indexOf(disease_item.disease_cd);
    if(index != -1){
      request_disease.splice(index, 1);
    }
    this.change_flag = 1;
    this.setState({
      selected_disease_data,
      request_disease,
    });
  }

  confirmReset=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_type:"reset",
        confirm_title:"クリア確認",
        confirm_message:"登録情報をクリアします。よろしいですか？"
      });
    }
  }

  resetState=()=>{
    this.change_flag = 0;
    this.setState({
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
      food_classification_id:0,
      food_types:[],
      food_type_id:0,
      food_type_name:"",
      food_type_comment:"",
      calorie:0,
      protein:0,
      lipid:0,
      sugar:0,
      pfc_ratio:0,
      salt_id:0,
      phosphorus_flag:0,
      potassium_flag:0,
      moisture:0,
      ps_ratio:0,
      guidance_content_other:"",
      content_other:"",
      reserve_datetime:"",
      reserve_data:null,
      free_comment:"",
      request_disease:[],
      selected_disease_data:[],
      request_content:[],
      importance_message:[],
      dispaly_category_2_data:[],
      selected_category_1_id:undefined,
      selected_category_2_id:undefined,
      selected_category_3_id:undefined,
      dispaly_category_3_data:[],
      display_disease_master_data:[],
    });
  }

  confirmOk=()=>{
    if(this.state.confirm_type === "reset"){
      this.resetState();
    }
    if(this.state.confirm_type === "register"){
      this.saveCache();
    }
    if(this.state.confirm_type === "close_modal"){
      this.props.closeModal();
    }
  }
  
  confirmCloseModal=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_type:"close_modal",
        confirm_title:'入力中',
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
      });
    } else {
      this.props.closeModal();
    }
  }

  render() {
    var patientInfo = this.props.patientInfo;
    return (
      <>
        <Modal show={true} id="first-view-modal" className="custom-modal-sm patient-exam-modal guidance-modal first-view-modal">
          <Modal.Header>
            <Modal.Title>栄養指導依頼</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              {this.state.load_flag ? (
                <>
                  <div className="mb-rem">
                    <div className='flex mb-rem'>
                      <div className='topic-label'>患者ID</div>
                      <div className='patient-profile-content'>{patientInfo.receId}</div>
                      <div className='topic-label' style={{textAlign:"right", marginRight:"0.5rem"}}>患者氏名</div>
                      <div className='patient-profile-content'>{patientInfo.name}</div>
                      <div className='topic-label' style={{textAlign:"right", marginRight:"0.5rem", width:"3rem"}}>性別</div>
                      <div className='patient-profile-content'>{patientInfo.sex ==1?'男性':'女性'}</div>
                      <div className='topic-label' style={{textAlign:"right", marginRight:"0.5rem", width:"3rem"}}>年令</div>
                      <div className='patient-profile-content'>{patientInfo.age + '歳' + patientInfo.age_month + 'ヶ月'}</div>
                    </div>
                    <div className='flex'>
                      <label className='topic-label'>職業</label>
                      <div className='patient-profile-content'>{this.state.job_category}</div>
                    </div>
                  </div>
                  <div className='patientInfo-area mb-rem'>
                    <div>患者情報</div>
                    <div className = 'flex'>
                      <div className='body-info'>
                        <div className='flex mb-rem'>
                          <div className='title-label'>身長</div>
                          <div className='value'>{this.state.height_weight != null ? this.state.height_weight.height : ''}</div>
                          <span className='unit-span'>cm</span>
                          <div className='title-label' style={{width:"4rem"}}>測定日</div>
                          <div className='value'>{this.state.height_weight != null ? this.state.height_weight.measure_date.split("-").join("/") : ''}</div>
                        </div>
                        <div className='flex mb-rem'>
                          <div className='title-label'>体重</div>
                          <div className='value'>{this.state.height_weight != null ? this.state.height_weight.weight : ''}</div>
                          <span className='unit-span'>kg</span>
                          <div className='title-label' style={{width:"4rem"}}>測定日</div>
                          <div className='value'>{this.state.height_weight != null ? this.state.height_weight.measure_date.split("-").join("/") : ''}</div>
                        </div>
                        <div className='flex'>
                          <div className='title-label'>BMI</div>
                          <div className='value'>{this.state.bmi}</div>
                          <span className='unit-span'> </span>
                          <Button type="common" onClick={this.openHeightInputModal.bind(this)}>身体情報入力</Button>
                        </div>
                      </div>
                    </div>
                    <div className='flex select-disease-area' style={{marginTop:"0.3rem"}}>
                      <div className="block-area">
                        <div>大分類</div>
                        <div className='box-area'>
                          {this.state.dispaly_category_1_data != undefined && this.state.dispaly_category_1_data.length > 0 && (
                            this.state.dispaly_category_1_data.map((item) =>{
                              return(
                                <>
                                  <div
                                    className={this.state.selected_category_1_id == item.category_1_id ? 'selected' : ''}
                                    style={{cursor:"pointer"}}
                                    onClick={this.selectCategory_1.bind(this, item)}
                                  >
                                    {item.name}
                                  </div>
                                </>
                              )
                            })
                          )}
                        </div>
                      </div>
                      <div className="block-area">
                        <div>中分類	</div>
                        <div className='box-area'>
                          {this.state.dispaly_category_2_data != undefined && this.state.dispaly_category_2_data.length > 0 && (
                            this.state.dispaly_category_2_data.map((item) =>{
                              return(
                                <>
                                  <div
                                    className={this.state.selected_category_2_id == item.category_2_id ? 'selected' : ''}
                                    style={{cursor:"pointer"}}
                                    onClick={this.selectCategory_2.bind(this, item)}
                                  >
                                    {item.name}
                                  </div>
                                </>
                              )
                            })
                          )}
                        </div>
                      </div>
                      <div className="block-area">
                        <div>小分類</div>
                        <div className='box-area'>
                          {this.state.dispaly_category_3_data != undefined && this.state.dispaly_category_3_data.length > 0 && (
                            this.state.dispaly_category_3_data.map((item) =>{
                              return(
                                <>
                                  <div
                                    className={this.state.selected_category_3_id == item.category_3_id ? 'selected' : ''}
                                    style={{cursor:"pointer"}}
                                    onClick={this.selectCategory_3.bind(this, item)}
                                  >
                                    {item.name}
                                  </div>
                                </>
                              )
                            })
                          )}
                        </div>
                      </div>
                      <div className="block-area">
                        <div>病名</div>
                        <div className='box-area'>
                          {this.state.display_disease_master_data != undefined && this.state.display_disease_master_data.length > 0 && (
                            this.state.display_disease_master_data.map((item) =>{
                              return(
                                <>
                                  <div
                                    className={this.state.request_disease.includes(item.disease_cd) ? 'selected':''}
                                    style={{cursor:"pointer"}}
                                    onClick={this.setItemName.bind(this, item)}
                                  >
                                    {item.name}
                                  </div>
                                </>
                              )
                            })
                          )}
                        </div>
                      </div>
                      <div className="block-area">
                        <div>&nbsp;</div>
                        <div className='box-area'>
                          {this.state.selected_disease_data !== undefined && this.state.selected_disease_data != null && this.state.selected_disease_data.length > 0 && (
                            this.state.selected_disease_data.map((item) =>{
                              if(item != null){
                                return(
                                  <>
                                    <div className={'flex disease-name-area'}>
                                      <div className="disease-name">{item.name}</div>
                                      <div className={'delete-icon'} onClick={this.removeDisease.bind(this, item)}><Icon icon={faMinusCircle} /></div>
                                    </div>
                                  </>
                                )
                              }
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='insturction-area mb-rem'>
                    <div>指示食種</div>
                    <div className="select-food flex">
                      <div className="list">
                        {this.state.food_classification_master.length > 0 && (
                          this.state.food_classification_master.map(item=>{
                            return (
                              <>
                                <div
                                  className={this.state.food_classification_id == item.number ? 'selected' : ''} style={{cursor:"pointer"}}
                                  onClick={this.setFoodClassification.bind(this, item)}
                                >
                                  {item.name}
                                </div>
                              </>
                            )
                          })
                        )}
                      </div>
                      <div className="list">
                        {this.state.food_types.length > 0 && (
                          this.state.food_types.map(item=>{
                            return (
                              <>
                                <div
                                  className={this.state.food_type_id == item.number ? 'selected' : ''} style={{cursor:"pointer"}}
                                  onClick={this.setFoodType.bind(this, item)}
                                >
                                  {item.name}
                                </div>
                              </>
                            )
                          })
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='nutrition-area mb-rem flex'>
                    <div style={{width:"50%"}}>
                      <div>指示栄餋量</div>
                      <div className='flex'>
                        <div className={'input-value'}>
                          <NumericInputWithUnitLabel
                            label='エネルギー'
                            className="form-control"
                            value={this.state.calorie}
                            id='calorie_id'
                            getInputText={this.setValue.bind(this,'calorie')}
                            inputmode="numeric"
                            unit='kcal'
                          />
                        </div>
                        <div className={'input-value'}>
                          <NumericInputWithUnitLabel
                            label='塩分'
                            className="form-control"
                            value={this.state.salt_id}
                            id='salt_id_id'
                            getInputText={this.setValue.bind(this,'salt_id')}
                            inputmode="numeric"
                            unit='g'
                          />
                        </div>
                      </div>
                      <div className='flex'>
                        <div className={'input-value'}>
                          <NumericInputWithUnitLabel
                            label='蛋白質' //タンパク質
                            className="form-control"
                            value={this.state.protein}
                            id='protein_id'
                            getInputText={this.setValue.bind(this,'protein')}
                            inputmode="numeric"
                            unit='g'
                          />
                        </div>
                        <div className='select-value'>
                          <SelectorWithLabel
                            title="リン"
                            options={this.select_flag_data}
                            getSelect={this.setSelectFlagValue.bind(this, 'phosphorus_flag')}
                            departmentEditCode={this.state.phosphorus_flag}
                          />
                        </div>
                      </div>
                      <div className='flex'>
                        <div className={'input-value'}>
                          <NumericInputWithUnitLabel
                            label='脂質'
                            className="form-control"
                            value={this.state.lipid}
                            id='lipid_id'
                            getInputText={this.setValue.bind(this,'lipid')}
                            inputmode="numeric"
                            unit='g'
                          />
                        </div>
                        <div className='select-value'>
                          <SelectorWithLabel
                            title="カリウム"
                            options={this.select_flag_data}
                            getSelect={this.setSelectFlagValue.bind(this, 'potassium_flag')}
                            departmentEditCode={this.state.potassium_flag}
                          />
                        </div>
                      </div>
                      <div className='flex'>
                        <div className={'input-value'}>
                          <NumericInputWithUnitLabel
                            label='糖質'
                            className="form-control"
                            value={this.state.sugar}
                            id='lipid_id'
                            getInputText={this.setValue.bind(this,'sugar')}
                            inputmode="numeric"
                            unit='g'
                          />
                        </div>
                        <div className={'input-value'}>
                          <NumericInputWithUnitLabel
                            label='水分'
                            className="form-control"
                            value={this.state.moisture}
                            id='moisture_id'
                            getInputText={this.setValue.bind(this,'moisture')}
                            inputmode="numeric"
                            unit='㎖'
                          />
                        </div>
                      </div>
                      <div className='flex'>
                        <div className={'input-value'}>
                          <NumericInputWithUnitLabel
                            label='PFC比'
                            className="form-control"
                            value={this.state.pfc_ratio}
                            id='moisture_id'
                            getInputText={this.setValue.bind(this,'pfc_ratio')}
                            inputmode="numeric"
                          />
                        </div>
                        <div className={'input-value'}>
                          <NumericInputWithUnitLabel
                            label='P/S比'
                            className="form-control"
                            value={this.state.ps_ratio}
                            id='moisture_id'
                            getInputText={this.setValue.bind(this,'ps_ratio')}
                            inputmode="numeric"
                          />
                        </div>
                      </div>
                    </div>
                    <div style={{width:"50%"}} className='right-area'>
                      <div>予約内容</div>
                      <div className='flex'>
                        <div className="treat-date">予約日時</div>
                        <div className="patient-profile-content" style={{minWidth:"10rem"}}>{this.state.reserve_datetime}</div>
                        <Button type="common" onClick={this.openReserveCalendar.bind(this)}>予約取得</Button>
                      </div>
                      <div style={{lineHeight:"2rem"}}>フリーコメント(全角25文字まで)</div>
                      <div className={'free-comment'}>
                        <InputWithLabel
                          label=""
                          type="text"
                          getInputText = {this.setComment.bind(this, 'free_comment')}
                          diseaseEditData={this.state.free_comment}
                        />
                      </div>
                    </div>
                  </div>
                  <div className='main-insturctions flex'>
                    <div style={{width:"50%"}}>
                      <div className = 'sub-title'>指示内容</div>
                      <div className='list' style={{height:"auto", paddingLeft:"0.3rem", minHeight:"3rem"}}>
                        {this.state.guidance_nutrition_content_master.length > 0 && (
                          this.state.guidance_nutrition_content_master.map(item=>{
                            return (
                              <>
                                <div className={'check-box'}>
                                  <Checkbox
                                    label={item.name}
                                    number = {item.number}
                                    value = {this.state.request_content.includes(item.number)}
                                    getRadio={this.setGuidanceNutritionContent}
                                    name="guidance_nutrition_content"
                                  />
                                </div>
                              </>
                            )
                          })
                        )}
                      </div>
                      <div style={{lineHeight:"2rem"}}>その他(全角25文字まで)</div>
                      <div className="free-comment">
                        <InputWithLabel
                          label=""
                          type="text"
                          getInputText={this.setComment.bind(this, 'guidance_content_other')}
                          diseaseEditData={this.state.guidance_content_other}
                        />
                      </div>
                    </div>
                    <div style={{width:"50%"}}>
                      <div className='sub-title'>重点伝達事項</div>
                      <div className='list' style={{height:"auto", paddingLeft:"0.3rem", minHeight:"3rem"}}>
                        {this.state.guidance_nutrition_importance_message_master.length > 0 && (
                          this.state.guidance_nutrition_importance_message_master.map(item=>{
                            return (
                              <>
                                <div className={'check-box'}>
                                  <Checkbox
                                    label={item.name}
                                    number = {item.number}
                                    value = {this.state.importance_message.includes(item.number)}
                                    getRadio={this.setGuidanceNutritionContent}
                                    name="guidance_nutrition_importance_message"
                                  />
                                </div>
                              </>
                            )
                          })
                        )}
                      </div>
                      <div>
                        <div style={{lineHeight:"2rem"}}>その他(全角25文字まで)</div>
                        <div className="free-comment">
                          <InputWithLabel
                            label=""
                            type="text"
                            getInputText={this.setComment.bind(this, 'content_other')}
                            diseaseEditData={this.state.content_other}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ):(
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.confirmCloseModal}>キャンセル</Button>
            <Button className="cancel-btn" onClick={this.confirmReset}>クリア</Button>
            {this.can_register ? (
              <div onClick={this.saveData} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}><span>確定</span></div>
            ):(
              <OverlayTrigger placement={"top"} overlay={renderTooltip("登録権限がありません。")}>
                <div className={"custom-modal-btn disable-btn"}><span>確定</span></div>
              </OverlayTrigger>
            )}
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.isOpenInputModal && this.state.max_min_constants != undefined && (
            <BasicInfoInputModal
              closeModal={this.getPatientWeightHeightInfo}
              patientId={this.props.patientId}
              modal_type={this.state.modal_type}
              modal_data={this.state.modal_data}
              max_min_constants = {this.state.max_min_constants}
            />
          )}
          {this.state.isOpenReserveCalendar && (
            <EndoscopeReservationModal
              handleOk={this.setReserveDateTime.bind(this)}
              system_patient_id={this.props.patientId}
              inspection_DATETIME={this.state.reserve_datetime != "" ? this.state.reserve_datetime.split(' ')[0] : ""}
              reserve_time={this.state.reserve_datetime != "" ? (this.state.reserve_datetime.split(' ')[1] == "時間未定" ? null : this.state.reserve_datetime.split(' ')[1]) : ""}
              closeModal={this.confirmCancel}
              patient_name={patientInfo.name}
              reserve_type={'nutrition_guidance'}
              inspection_id={0}
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

NutritionGuidance.contextType = Context;
NutritionGuidance.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  closeModal: PropTypes.func,
  order_data: PropTypes.object,
  cache_data: PropTypes.object,
};

export default NutritionGuidance;
