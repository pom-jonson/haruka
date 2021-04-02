import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import * as colors from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import Context from "~/helpers/configureStore";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import {formatDateLine, getNextDayByJapanFormat} from "~/helpers/date";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import * as apiClient from "~/api/apiClient";
import SelectMedicineModal from "~/components/templates/Patient/Modals/Common/SelectMedicineModal";
import DiseaseNameModal from "~/components/templates/Patient/Modals/Disease/DiseaseNameModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import Spinner from "react-bootstrap/Spinner";
import { harukaValidate } from "~/helpers/haruka_validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as sessApi from "~/helpers/cacheSession-utils";
import {
  CACHE_LOCALNAMES,
  getEnableChangeMeal,
  BOILERPLATE_FUNCTION_ID_CATEGORY,
  CACHE_SESSIONNAMES
} from "~/helpers/constants";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import $ from 'jquery';

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
`;
const Wrapper = styled.div`
  display: block;
  .left-col{
    width: 65%;
  }
  .right-col{
    width: 35%;
  }
  .div-flex{
    display: flex;
  }
  .spinner-loading{      
    height: 30rem;
  }
  .info-title {
    padding-bottom:0.3rem;
  }
  .label-title{
    font-size:1rem;
    width: 9rem;
    line-height:2rem;
    margin:0;
  }
  .pullbox-label {
    margin:0;
  }
  .react-datepicker-wrapper {
    width: 7.5rem;
    .react-datepicker__input-container {
        width: 100%;
        input {
            font-size: 14px;
            width: 100%;
            height: 2rem;
            border-radius: 4px;
            border-width: 1px;
            border-style: solid;
            border-color: rgb(206, 212, 218);
            border-image: initial;
            padding: 0px 8px;
        }
    } 
  }
  .to-date{
    margin-left: 2rem;
    .label-title{
      width: 0rem;
    }
  }
  .select-date {
    div {margin-top:0;}
    input {width: 7rem;}
  }
  .time-class {
    margin-left: 0.3rem;
    .pullbox-title {width: 0;}
    .pullbox-select {width: 4rem !important;}
  }
  .number-of-meals {
    margin-bottom:0.3rem;
    .label-unit {
      margin-left:0.3rem;
      line-height:2rem;
    }
    select {width: 7rem;}
  }
  .select-food-type {
    margin-bottom:0.3rem;
    .pullbox-select {width:12rem;}
  }
  }  
  .select-food-condition {
    .pullbox-title {
      width:0;
      margin-right:0.3rem;
    }
    .food-classific {
      .pullbox-title {
        width:9rem;
        margin-right:0;
      }
    }
    .pullbox-select {width:12rem;}
  }
  .select-food-type-td {
    // margin-bottom:0.3rem;
    .pullbox-select {width:100%;}
  }
  .select-food-condition-td {
    .pullbox-title {
      width:0;
      // margin-right:0.3rem;
    }
    .food-classific {
      .pullbox-title {
        width:0px;
        margin-right:0;
      }
    }
    .pullbox-select {width:8rem;}
  }
  .staple-food {
    margin-right:1rem;
    .pullbox-select {width:10rem;}
  }
  .side_food_breakfast {
    .pullbox {margin-right:1rem;}
    .pullbox-select {width:10rem;}
  }
  .drink {
    .pullbox-select {width:12rem;}
    button {margin-left:0.3rem;}
  }
  .select-disease {
    margin-bottom:0.3rem;
    .disease-name {
      width: 20rem;
      padding-left:0.3rem;
      border:1px solid #aaa;
      min-height:2rem;
      display: flex;
      align-items: center;
    }
    button {
      margin-left:0.3rem;
      height:2rem;
      // line-height:2rem;
    }
  }
  .serving {
    margin-bottom:0.3rem;
    .pullbox-select {width:10rem;}
  }
  .pullbox-label {
    margin:0;
    .pullbox-select {
      height: 2rem;
    }
  }
  input {
    height: 2rem;
  }
  .meal-comment {
    margin-bottom:0.3rem;
    .label-comment {
      font-size:1rem;
      width: 9rem;
    }
    .comment-area {
      width: 30rem;
      height:4rem;
      border:1px solid #aaa;
      overflow-y: auto;
      table {
        width:100%;
        margin-left: -1px;
        .td-check {
          text-align: center;
          label {margin: 0;}
          input {
            margin: 0;
            height: 15px !important;
          }
        }
        .td-comment {
          padding:0 0.2rem;
        }
      }
    }
    button {
      margin-left:0.3rem;
      height:2rem;
    }
  }
  .free-comment{
    div {margin:0;}
    margin-bottom:0.3rem;
    input {width: 30rem;}
  }
  .meal-free-comment{
    div {margin:0;}
    margin-bottom:0.2rem;
    input {width: 34.6rem;}
  }
  .thick-liquid-food {
    margin-bottom:0.3rem;
    button {height:2rem;}
    .table-area {
      margin-left:0.3rem;
      .pullbox-title {width:0;}
      .pullbox-select {
        width:10rem;
        font-size: 1rem;
        padding: 0px 0.5rem;
        height:2rem;
      }
      .condition-1 select{width:15rem;}
      // .condition-2 select{width:calc(30rem + 4px);}
      .condition-3 select{width:calc(30rem + 3px);}
    }
  }
  table {
    th {
      background-color: #dbeef3;
      text-align: center;
      font-weight: normal;
      label {
        color: ${colors.surface};
      }
    }
    th,td {
      border: 1px solid #aaa;
      padding: 0;
    }
  }
  .last-start-date{
    width: 7rem;
    border: 1px solid #aaa;
    height: 2rem;
    line-height: 2rem;
  }
  .last-start-time-classification {
    width: 3rem;
    border: 1px solid #aaa;
    margin-left: 0.3rem;
    height: 2rem;
    line-height: 2rem;
  }
  .allergy-area {
    width:100%;
    border:1px solid #aaa;
    height:8rem;
    overflow-y:auto;
    div {padding-left:0.3rem;}
  }
  .amount-title {
    width:4rem;
    height:2rem;
    line-height:2rem;  
  }
  .amount-tall{
    width:4rem;
    height:2rem;
    line-height:2rem;  
    border: 1px solid #aaa;
    text-align:center;
    margin-right:0.3rem;
  }
  .amount-unit {
    height:2rem;
    line-height:2rem;  
  }
  .amount-date{
    width:7rem;
    height:2rem;
    line-height:2rem;  
    border: 1px solid #aaa;
    text-align:center;
    margin-right:0.3rem;
  }
  .food-prop-name{
    width: 50%;
    padding-left: 5px;
    background: #c8eef8;
    border: 1px solid #aaa;
  }
  .food-prop-amount{
    width: 30%;
    padding-left: 5px;
    background: #dbeef3;
    border: 1px solid #aaa;
  }
  .food-prop-unit{
    width: 20%;    
    padding-left: 5px;
    border: 1px solid #aaa;
  }
  .treat-date{
        width: 100px;
        border: 1px solid #aaa;
  }

  .clear-btn-1{
    min-width: 2rem;
    margin-right: 0.5rem;
    height: 2rem;
    margin-left: 0.5rem;
    padding: 0px;
    display: inline-block;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid rgb(126, 126, 126);
  }

  .clear-btn-2{
    min-width: 2rem;
    height: 2rem;
    padding: 0px;
    display: inline-block;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid rgb(126, 126, 126);
  }
`;

const ContextMenuUl = styled.ul`
  margin-bottom: 0;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
    max-height: 31rem;
    overflow-y: auto;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.1rem 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
  .pos-left{
    min-width: 290px;
    div{
      width: 100%;
      text-align: right;
    }
  }
`;

const UssageMenu = ({ visible, x, y, parent }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu ussage-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li className={'ussage_regular_comment-menu'}>
            <div onMouseOver={(e) =>parent.contextMenuAction("ussage_regular_comment", e, x, y)}>三食フリーコメント(定型)</div>
          </li>          
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const HoverFirstMenu = ({ visible, x, y, parent, menu_data }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu hover-first-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {menu_data.map((item,index)=>{
            return (
              <li key={index} className={'hover-first-menu'+index}><div onMouseOver={() => parent.setHover(x,y,item, index)} onClick={() => parent.contextMenuAction("first_hover_comment", item)}>{item.category_name}{item.body}</div></li>
            )
          })}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const HoverSecondMenu = ({ visible, x, y, parent, menu_data }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className={`context-menu hover-second-menu ${parent.second_menu_pos == "left" ? "pos-left":""}`} style={{ left: `${x}px`, top: `${y}px` }}>
          {menu_data.map((item,index)=>{
            return (
              <li key={index}><div onClick={() => parent.contextMenuAction("second_hover_comment", item)}>{item.body}</div></li>
            )
          })}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class ChangeMealModal extends Component {
  constructor(props) {
    super(props);
    // let init_data = this.props.modalData;
    let init_data = null;
    if(props.cache_index != null){
      init_data = karteApi.getSubVal(props.patientId, CACHE_LOCALNAMES.MEAL_GROUP_EDIT, this.props.cache_index);
    }
    let start_date = (init_data !== undefined && init_data != null && init_data.start_date != undefined && init_data.start_date != null) ? new Date(init_data.start_date) : new Date();
    this.state={
      hos_number:(init_data !== undefined && init_data != null && init_data.hos_number != undefined && init_data.hos_number != null) ? init_data.hos_number : 0,
      hos_detail_number:(init_data !== undefined && init_data != null && init_data.hos_detail_number != undefined) ? init_data.hos_detail_number : 0,
      department_id:(init_data !== undefined && init_data != null && init_data.department_id != undefined) ? init_data.department_id : 0,
      department_name:(init_data !== undefined && init_data != null && init_data.department_name != undefined) ? init_data.department_name : "",
      start_date:start_date,
      start_date_to: (init_data !== undefined && init_data != null && init_data.start_date_to !== undefined && init_data.start_date_to != null) ? new Date(init_data.start_date_to) : getNextDayByJapanFormat(start_date),
      start_time_classification:(init_data !== undefined && init_data != null && init_data.start_time_classification !== undefined && init_data.start_time_classification != null) ? init_data.start_time_classification : 0,
      start_time_classification_to: (init_data !== undefined && init_data != null && init_data.start_time_classification_to !== undefined && init_data.start_time_classification_to != null) ? init_data.start_time_classification_to : 0,
      meal_time_classification_master:[{id:0, value:""}],
      meal_number_master:[{id:0, value:""}],
      number_of_meals: (init_data !== undefined && init_data != null && init_data.number_of_meals !== undefined && init_data.number_of_meals != null) ? init_data.number_of_meals : 0,
      food_type_id: (init_data !== undefined && init_data != null && init_data.food_type_id !== undefined && init_data.food_type_id != null) ? init_data.food_type_id : 0,
      staple_food_master:[{id:0, value:""}],
      staple_food_id_morning:(init_data !== undefined && init_data != null && init_data.staple_food_id_morning !== undefined && init_data.staple_food_id_morning != null) ? init_data.staple_food_id_morning : 0,
      staple_food_id_noon:(init_data !== undefined && init_data != null && init_data.staple_food_id_noon !== undefined && init_data.staple_food_id_noon != null) ? init_data.staple_food_id_noon : 0,
      staple_food_id_evening:(init_data !== undefined && init_data != null && init_data.staple_food_id_evening !== undefined && init_data.staple_food_id_evening != null) ? init_data.staple_food_id_evening : 0,
      drink_master:[{id:0, value:""}],
      drink_id_morning:(init_data !== undefined && init_data != null && init_data.drink_id_morning !== undefined && init_data.drink_id_morning != null) ? init_data.drink_id_morning : 0,
      drink_id_noon:(init_data !== undefined && init_data != null && init_data.drink_id_noon !== undefined && init_data.drink_id_noon != null) ? init_data.drink_id_noon : 0,
      drink_id_evening:(init_data !== undefined && init_data != null && init_data.drink_id_evening !== undefined && init_data.drink_id_evening != null) ? init_data.drink_id_evening : 0,
      meal_disease_name_id:(init_data !== undefined && init_data != null && init_data.meal_disease_name_id !== undefined && init_data.meal_disease_name_id != null) ? init_data.meal_disease_name_id : 0,
      meal_disease_name:(init_data !== undefined && init_data != null && init_data.meal_disease_name !== undefined && init_data.meal_disease_name != null) ? init_data.meal_disease_name : '',
      isOpenSelectDiseaseModal:false,
      isAddDiseaseNameModal:false,
      confirm_message:"",
      confirm_type:"",
      serving_master:[{id:0, value:""}],
      serving_id:(init_data !== undefined && init_data != null && init_data.serving_id !== undefined && init_data.serving_id != null) ? init_data.serving_id : 0,
      meal_comment:[],
      meal_comment_numbers:(init_data !== undefined && init_data != null && init_data.meal_comment_numbers !== undefined && init_data.meal_comment_numbers != null) ? init_data.meal_comment_numbers : [],
      free_comment:(init_data !== undefined && init_data != null && init_data.free_comment !== undefined && init_data.free_comment != null) ? init_data.free_comment : "",
      staple_food_morning_free_comment:(init_data !== undefined && init_data != null && init_data.staple_food_morning_free_comment != undefined) ? init_data.staple_food_morning_free_comment : "",
      staple_food_noon_free_comment:(init_data !== undefined && init_data != null && init_data.staple_food_noon_free_comment != undefined) ? init_data.staple_food_noon_free_comment : "",
      staple_food_evening_free_comment:(init_data !== undefined && init_data != null && init_data.staple_food_evening_free_comment != undefined) ? init_data.staple_food_evening_free_comment : "",
      thick_liquid_food_master:[{id:0, value:""}],
      thick_liquid_food_conditions_1:[{id:0, value:""}],
      thick_liquid_food_conditions_id1:0,
      thick_liquid_food_conditions_2:[],
      thick_liquid_food_conditions_id2:0,
      thick_liquid_food:[],
      thick_liquid_food_id:(init_data !== undefined && init_data != null && init_data.thick_liquid_food_id !== undefined && init_data.thick_liquid_food_id != null) ? init_data.thick_liquid_food_id : 0,
      ingestion_method:[{id:0, value:""}],
      ingestion_method_id:(init_data !== undefined && init_data != null && init_data.ingestion_method_id !== undefined && init_data.ingestion_method_id != null) ? init_data.ingestion_method_id : 0,
      thick_liquid_food_morning:[{id:0, value:""}],
      thick_liquid_food_number_id_morning:(init_data !== undefined && init_data != null && init_data.thick_liquid_food_number_id_morning !== undefined && init_data.thick_liquid_food_number_id_morning != null) ? init_data.thick_liquid_food_number_id_morning : 0,
      thick_liquid_food_noon:[{id:0, value:""}],
      thick_liquid_food_number_id_noon:(init_data !== undefined && init_data != null && init_data.thick_liquid_food_number_id_noon !== undefined && init_data.thick_liquid_food_number_id_noon != null) ? init_data.thick_liquid_food_number_id_noon : 0,
      thick_liquid_food_evening:[{id:0, value:""}],
      thick_liquid_food_number_id_evening:(init_data !== undefined && init_data != null && init_data.thick_liquid_food_number_id_evening !== undefined && init_data.thick_liquid_food_number_id_evening != null) ? init_data.thick_liquid_food_number_id_evening : 0,
      milk_master:[{id:0, value:""}],
      milk_id:(init_data !== undefined && init_data != null && init_data.milk_id !== undefined && init_data.milk_id != null) ? init_data.milk_id : 0,
      milk_amount:[{id:0, value:""}],
      milk_amount_id:(init_data !== undefined && init_data != null && init_data.milk_amount_id !== undefined && init_data.milk_amount_id != null) ? init_data.milk_amount_id : 0,
      adjustment_amount:(init_data !== undefined && init_data != null && init_data.adjustment_amount !== undefined && init_data.adjustment_amount != null) ? init_data.adjustment_amount : 0,
      food_type_nutritional_value:[],
      nutritional_data:[],
      alert_messages:"",
      side_food_master:[{id:0, value:""}],
      side_food_id:(init_data !== undefined && init_data != null && init_data.side_food_id != undefined) ? init_data.side_food_id : 0,
      breakfast_master:[{id:0, value:""}],
      breakfast_id:(init_data !== undefined && init_data != null && init_data.breakfast_id != undefined) ? init_data.breakfast_id : 0,
      notice_message:"",
      allergy_data:[],
      food_classification_master:[{id:0, value:""}],
      food_classification_id: 0,
      food_type_conditions_master:[],
      food_type_conditions_1:[],
      food_type_conditions_id1:0,
      food_type_conditions_2:[],
      food_type_conditions_id2:0,
      food_type_conditions_3:[],
      food_type_conditions_id3:0,
      food_type_conditions_4:[],
      food_type_conditions_id4:0,
      food_type_conditions_5:[],
      food_type_conditions_id5:0,
      food_type_master:[],
      food_types:[],
      alert_message: "",
      is_loaded: false,
    };
    this.change_flag = 0;
  }

  async componentDidMount() {
    let path = "/app/api/v2/meal/get/change_meal_info";
    let post_data = {
      patient_id: this.props.patientId
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let meal_time_classification_master = this.state.meal_time_classification_master;
        if(res.meal_time_classification_master.length > 0){
          res.meal_time_classification_master.map(meal=>{
            meal_time_classification_master.push({id:meal.number, value:meal.name});
          });
        }
        let weight_height = res.weight_height;
        let meal_number_master = this.state.meal_number_master;
        let ingestion_method = this.state.ingestion_method;
        let milk_amount = this.state.milk_amount;
        let thick_liquid_food_morning = this.state.thick_liquid_food_morning;
        let thick_liquid_food_noon = this.state.thick_liquid_food_noon;
        let thick_liquid_food_evening = this.state.thick_liquid_food_evening;
        if(res.thick_liquid_food_and_milk_item_master.length > 0){
          res.thick_liquid_food_and_milk_item_master.map(item=>{
            if(item.attribute_classification == "01"){ //01：摂取方法
              ingestion_method.push({id:item.number, value:item.name});
            }
            if(item.attribute_classification == "02"){ //02：回数
              meal_number_master.push({id:item.number, value:item.name});
            }
            if(item.attribute_classification == "03"){ //03：一回量
              milk_amount.push({id:item.number, value:item.name});
            }
            if(item.attribute_classification == "05"){ //05：本数（朝）
              thick_liquid_food_morning.push({id:item.number, value:item.name});
            }
            if(item.attribute_classification == "06"){ //06：本数（昼）
              thick_liquid_food_noon.push({id:item.number, value:item.name});
            }
            if(item.attribute_classification == "07"){ //07：本数（夕）
              thick_liquid_food_evening.push({id:item.number, value:item.name});
            }

          });
        }
        let food_classification_master = this.state.food_classification_master;
        if(res.food_classification_master.length > 0){
          res.food_classification_master.map(item=>{
            food_classification_master.push({id:item.number, value:item.name});
          });
        }
        let staple_food_master = this.state.staple_food_master;
        if(res.staple_food_master.length > 0){
          res.staple_food_master.map(item=>{
            staple_food_master.push({id:item.number, value:item.name});
          });
        }
        let drink_master = this.state.drink_master;
        if(res.drink_master.length > 0){
          res.drink_master.map(item=>{
            drink_master.push({id:item.number, value:item.name});
          });
        }
        let serving_master = this.state.serving_master;
        if(res.serving_master.length > 0){
          res.serving_master.map(item=>{
            serving_master.push({id:item.number, value:item.name});
          });
        }
        let side_food_master = this.state.side_food_master;
        if(res.side_food_master.length > 0){
          res.side_food_master.map(item=>{
            side_food_master.push({id:item.number, value:item.name});
          });
        }
        let breakfast_master = this.state.breakfast_master;
        if(res.breakfast_master.length > 0){
          res.breakfast_master.map(item=>{
            breakfast_master.push({id:item.number, value:item.name});
          });
        }
        let thick_liquid_food_master = this.state.thick_liquid_food_master;
        if(res.thick_liquid_food_master.length > 0){
          res.thick_liquid_food_master.map(item=>{
            thick_liquid_food_master.push({id:item.number, value:item.name});
          });
        }
        let milk_master = this.state.milk_master;
        if(res.milk_master.length > 0){
          res.milk_master.map(item=>{
            milk_master.push({id:item.number, value:item.name});
          });
        }
        let food_classification_id = 0;
        let food_type_conditions_id1 = 0;
        let food_type_conditions_id2 = 0;
        let food_type_conditions_id3 = 0;
        let food_type_conditions_id4 = 0;
        let food_type_conditions_id5 = 0;
        let food_types = [{id:0, value:""}];
        if(res.food_type_master.length > 0){
          res.food_type_master.map(food_type=>{
            if(this.state.food_type_id != 0){
              if(food_type.number == this.state.food_type_id){
                food_classification_id = food_type.food_classification_id;
                if(food_type.food_type_conditions_id1 != null){
                  food_type_conditions_id1 = food_type.food_type_conditions_id1;
                }
                if(food_type.food_type_conditions_id2 != null){
                  food_type_conditions_id2 = food_type.food_type_conditions_id2;
                }
                if(food_type.food_type_conditions_id3 != null){
                  food_type_conditions_id3 = food_type.food_type_conditions_id3;
                }
                if(food_type.food_type_conditions_id4 != null){
                  food_type_conditions_id4 = food_type.food_type_conditions_id4;
                }
                if(food_type.food_type_conditions_id5 != null){
                  food_type_conditions_id5 = food_type.food_type_conditions_id5;
                }
              }
            } else {
              food_types.push({id:food_type.number, value:food_type.name});
            }
          })
        }
        let food_type_conditions_1 = [];
        if(food_classification_id != 0){
          let condition1_ids = [];
          food_types = [{id:0, value:""}];
          res.food_type_master.map(food_type=>{
            if(food_type.food_classification_id == food_classification_id){
              condition1_ids.push(food_type.food_type_conditions_id1);
              food_types.push({id:food_type.number, value:food_type.name});
            }
          })
          if(res.food_type_conditions_master.length > 0){
            res.food_type_conditions_master.map(condition=>{
              if(condition.condition_number == 1 && condition1_ids.includes(condition.number)){
                food_type_conditions_1.push({id:condition.number, value:condition.name});
              }
            })
          }
          if(food_type_conditions_1.length > 0){
            food_type_conditions_1.unshift({id:0,value:''});
          }
        }
        let food_type_conditions_2 = [];
        if(food_type_conditions_id1 != 0){
          let condition2_ids = [];
          food_types = [{id:0, value:""}];
          res.food_type_master.map(food_type=>{
            if(food_type.food_classification_id == food_classification_id && food_type.food_type_conditions_id1 == food_type_conditions_id1){
              condition2_ids.push(food_type.food_type_conditions_id2);
              food_types.push({id:food_type.number, value:food_type.name});
            }
          })
          if(res.food_type_conditions_master.length > 0){
            res.food_type_conditions_master.map(condition=>{
              if(condition.condition_number == 2 && condition2_ids.includes(condition.number)){
                food_type_conditions_2.push({id:condition.number, value:condition.name});
              }
            })
          }
          if(food_type_conditions_2.length > 0){
            food_type_conditions_2.unshift({id:0,value:''});
          }
        }
        let food_type_conditions_3 = [];
        if(food_type_conditions_id2 != 0){
          let condition3_ids = [];
          food_types = [{id:0, value:""}];
          res.food_type_master.map(food_type=>{
            if(food_type.food_classification_id == food_classification_id
              && food_type.food_type_conditions_id1 == food_type_conditions_id1
              && food_type.food_type_conditions_id2 == food_type_conditions_id2
            ){
              condition3_ids.push(food_type.food_type_conditions_id3);
              food_types.push({id:food_type.number, value:food_type.name});
            }
          })
          if(res.food_type_conditions_master.length > 0){
            res.food_type_conditions_master.map(condition=>{
              if(condition.condition_number == 3 && condition3_ids.includes(condition.number)){
                food_type_conditions_3.push({id:condition.number, value:condition.name});
              }
            })
          }
          if(food_type_conditions_3.length > 0){
            food_type_conditions_3.unshift({id:0,value:''});
          }
        }
        let food_type_conditions_4 = [];
        if(food_type_conditions_id3 != 0){
          let condition4_ids = [];
          food_types = [{id:0, value:""}];
          res.food_type_master.map(food_type=>{
            if(food_type.food_classification_id == food_classification_id
              && food_type.food_type_conditions_id1 == food_type_conditions_id1
              && food_type.food_type_conditions_id2 == food_type_conditions_id2
              && food_type.food_type_conditions_id3 == food_type_conditions_id3
            ){
              condition4_ids.push(food_type.food_type_conditions_id4);
              food_types.push({id:food_type.number, value:food_type.name});
            }
          })
          if(res.food_type_conditions_master.length > 0){
            res.food_type_conditions_master.map(condition=>{
              if(condition.condition_number == 4 && condition4_ids.includes(condition.number)){
                food_type_conditions_4.push({id:condition.number, value:condition.name});
              }
            })
          }
          if(food_type_conditions_4.length > 0){
            food_type_conditions_4.unshift({id:0,value:''});
          }
        }
        let food_type_conditions_5 = [];
        if(food_type_conditions_id4 != 0){
          let condition5_ids = [];
          food_types = [{id:0, value:""}];
          res.food_type_master.map(food_type=>{
            if(food_type.food_classification_id == food_classification_id
              && food_type.food_type_conditions_id1 == food_type_conditions_id1
              && food_type.food_type_conditions_id2 == food_type_conditions_id2
              && food_type.food_type_conditions_id3 == food_type_conditions_id3
              && food_type.food_type_conditions_id4 == food_type_conditions_id4
            ){
              condition5_ids.push(food_type.food_type_conditions_id5);
              food_types.push({id:food_type.number, value:food_type.name});
            }
          })
          if(res.food_type_conditions_master.length > 0){
            res.food_type_conditions_master.map(condition=>{
              if(condition.condition_number == 5 && condition5_ids.includes(condition.number)){
                food_type_conditions_5.push({id:condition.number, value:condition.name});
              }
            })
          }
          if(food_type_conditions_5.length > 0){
            food_type_conditions_5.unshift({id:0,value:''});
          }
        }
        if(food_type_conditions_id5 != 0){
          food_types = [{id:0, value:""}];
          res.food_type_master.map(food_type=>{
            if(food_type.food_classification_id == food_classification_id
              && food_type.food_type_conditions_id1 == food_type_conditions_id1
              && food_type.food_type_conditions_id2 == food_type_conditions_id2
              && food_type.food_type_conditions_id3 == food_type_conditions_id3
              && food_type.food_type_conditions_id4 == food_type_conditions_id4
              && food_type.food_type_conditions_id5 == food_type_conditions_id5
            ){
              food_types.push({id:food_type.number, value:food_type.name});
            }
          })
        }
        //濃厚流動食情報
        let thick_liquid_food_conditions_id1 = 0;
        let thick_liquid_food_conditions_id2 = 0;
        if(res.thick_liquid_food_master.length > 0){
          res.thick_liquid_food_master.map(item=>{
            if(this.state.thick_liquid_food_id == item.number){
              thick_liquid_food_conditions_id1 = item.thick_liquid_food_conditions_id1;
              thick_liquid_food_conditions_id2 = item.thick_liquid_food_conditions_id2;
            }
          });
        }
        let thick_liquid_food_conditions_1 = [];
        if(res.thick_liquid_food_conditions_master.length > 0){
          res.thick_liquid_food_conditions_master.map(item=>{
            if(item.condition_number == 1){
              thick_liquid_food_conditions_1.push({id:item.number, value:item.name});
            }
          });
          if(thick_liquid_food_conditions_1.length > 0){
            thick_liquid_food_conditions_1.unshift({id:0, value:""});
          }
        }
        let thick_liquid_food_conditions2_ids = [];
        let thick_liquid_food_conditions_2 = [];
        if(thick_liquid_food_conditions_id1 != 0 && res.thick_liquid_food_master.length > 0){
          res.thick_liquid_food_master.map(item=>{
            if(thick_liquid_food_conditions_id1 == item.thick_liquid_food_conditions_id1){
              thick_liquid_food_conditions2_ids.push(item.thick_liquid_food_conditions_id2);
            }
          });
          if(thick_liquid_food_conditions2_ids.length > 0 && res.thick_liquid_food_conditions_master.length > 0){
            res.thick_liquid_food_conditions_master.map(item=>{
              if(thick_liquid_food_conditions2_ids.includes(item.number)){
                thick_liquid_food_conditions_2.push({id:item.number, value:item.name})
              }
            });
            if(thick_liquid_food_conditions_2.length > 0){
              thick_liquid_food_conditions_2.unshift({id:0, value:""});
            }
          }
        }
        let thick_liquid_food = [];
        if(res.thick_liquid_food_master.length > 0){
          res.thick_liquid_food_master.map(item=>{
            if(thick_liquid_food_conditions_id1 != 0 && item.thick_liquid_food_conditions_id1 == thick_liquid_food_conditions_id1){
              if(thick_liquid_food_conditions_id2 != 0 && item.thick_liquid_food_conditions_id2 == thick_liquid_food_conditions_id2){
                thick_liquid_food.push({id:item.number, value:item.name});
              }
              if(thick_liquid_food_conditions_id2 == 0 && item.thick_liquid_food_conditions_id2 == thick_liquid_food_conditions_id2){
                thick_liquid_food.push({id:item.number, value:item.name});
              }
            }
          });
        }
        //ミルク食情報
        let milk_conditions_id1 = 0;
        let milk_conditions_id2 = 0;
        if(res.milk_master.length > 0){
          res.milk_master.map(item=>{
            if(this.state.milk_id == item.number){
              milk_conditions_id1 = item.milk_conditions_id1;
              milk_conditions_id2 = item.milk_conditions_id2;
            }
          });
        }
        let milk_conditions_1 = [];
        if(res.milk_conditions_master.length > 0){
          res.milk_conditions_master.map(item=>{
            if(item.condition_number == 1){
              milk_conditions_1.push({id:item.number, value:item.name});
            }
          });
          if(milk_conditions_1.length > 0){
            milk_conditions_1.unshift({id:0, value:""});
          }
        }
        let milk_conditions2_ids = [];
        let milk_conditions_2 = [];
        if(milk_conditions_id1 != 0 && res.milk_master.length > 0){
          res.milk_master.map(item=>{
            if(milk_conditions_id1 == item.milk_conditions_id1){
              milk_conditions2_ids.push(item.milk_conditions_id2);
            }
          });
          if(milk_conditions2_ids.length > 0 && res.milk_conditions_master.length > 0){
            res.milk_conditions_master.map(item=>{
              if(milk_conditions2_ids.includes(item.number)){
                milk_conditions_2.push({id:item.number, value:item.name})
              }
            });
            if(milk_conditions_2.length > 0){
              milk_conditions_2.unshift({id:0, value:""});
            }
          }
        }
        let milks = [];
        if(res.milk_master.length > 0){
          res.milk_master.map(item=>{
            if(milk_conditions_id1 != 0 && item.milk_conditions_id1 == milk_conditions_id1){
              if(milk_conditions_id2 != 0 && item.milk_conditions_id2 == milk_conditions_id2){
                milks.push({id:item.number, value:item.name});
              }
              if(milk_conditions_id2 == 0 && item.milk_conditions_id2 == milk_conditions_id2){
                milks.push({id:item.number, value:item.name});
              }
            }
          });
        }
        this.setState({
          food_classification_master,
          food_classification_id,
          food_type_conditions_master:res.food_type_conditions_master,
          food_type_conditions_id1,
          food_type_conditions_1,
          food_type_conditions_id2,
          food_type_conditions_2,
          food_type_conditions_id3,
          food_type_conditions_3,
          food_type_conditions_id4,
          food_type_conditions_4,
          food_type_conditions_id5,
          food_type_conditions_5,
          food_type_master:res.food_type_master,
          food_types,
          meal_time_classification_master,
          ingestion_method,
          thick_liquid_food_morning,
          thick_liquid_food_noon,
          thick_liquid_food_evening,
          milk_amount,
          meal_number_master,
          staple_food_master,
          drink_master,
          serving_master,
          meal_comment:res.meal_comment,
          thick_liquid_food_conditions_master:res.thick_liquid_food_conditions_master,
          thick_liquid_food_conditions_1,
          thick_liquid_food_conditions_id1,
          thick_liquid_food_conditions_2,
          thick_liquid_food_conditions_id2,
          thick_liquid_food_master:res.thick_liquid_food_master,
          thick_liquid_food,
          milk_conditions_master:res.milk_conditions_master,
          milk_conditions_1,
          milk_conditions_id1,
          milk_conditions_2,
          milk_conditions_id2,
          milk_master:res.milk_master,
          milks,
          food_type_nutritional_value:res.food_type_nutritional_value,
          weight_height,
          allergy_data:res.allergy_data,
          is_loaded: true,
        },()=>{
          this.setFoodInfo();
        });
      })
      .catch(() => {
        this.setState({
          is_loaded: true
        });
      });

    // 三食フリーコメント
    this.getBoilerplateMenu();
    
    harukaValidate('karte', 'meal', 'meal_period_change', this.state, 'background');
  }

  componentDidUpdate() {
    harukaValidate('karte', 'meal', 'meal_period_change', this.state, 'background');
  }

  setStartDate = (value) => {
    this.change_flag = 1;
    this.setState({ start_date: value });
  };

  setStartDateTo = (value) => {
    this.change_flag = 1;
    this.setState({ start_date_to: value });
  };

  setStartTimeClassification = (e) => {
    this.change_flag = 1;
    this.setState({start_time_classification:parseInt(e.target.id)});
  };

  setStartTimeClassificationTo = (e) => {
    this.change_flag = 1;
    this.setState({start_time_classification_to:parseInt(e.target.id)});
  };

  setNumberOfMeals = (e) => {
    this.change_flag = 1;
    this.setState({number_of_meals:parseInt(e.target.id)});
  };

  setFoodClassification = (e) => {
    this.change_flag = 1;
    let food_type_conditions_1 = [];
    let food_types = [];
    let condition1_ids = [];
    if(this.state.food_type_master.length > 0){
      food_types.push({id:0, value:""});
      this.state.food_type_master.map(food_type=>{
        if(parseInt(e.target.id) == 0){
          food_types.push({id:food_type.number, value:food_type.name});
        } else {
          if(food_type.food_classification_id == parseInt(e.target.id)){
            condition1_ids.push(food_type.food_type_conditions_id1);
            food_types.push({id:food_type.number, value:food_type.name});
          }
        }
      })
    }
    if(this.state.food_type_conditions_master.length > 0){
      this.state.food_type_conditions_master.map(condition=>{
        if(condition.condition_number == 1 && condition1_ids.includes(condition.number)){
          food_type_conditions_1.push({id:condition.number, value:condition.name});
        }
      })
    }
    if(food_type_conditions_1.length > 0){
      food_type_conditions_1.unshift({id:0,value:''});
    }
    this.setState({
      food_classification_id:parseInt(e.target.id),
      food_type_conditions_1,
      food_types,
      food_type_id:0,
      food_type_conditions_2:[],
      food_type_conditions_3:[],
      food_type_conditions_4:[],
      food_type_conditions_5:[],
    });
  };

  setFoodTypeCodition1=(e)=>{
    this.change_flag = 1;
    let food_types = [];
    let food_type_conditions_2 = [];
    let condition2_ids = [];
    if(this.state.food_type_master.length > 0){
      food_types.push({id:0, value:""});
      this.state.food_type_master.map(food_type=>{
        if(parseInt(e.target.id) != 0){
          if(food_type.food_classification_id == this.state.food_classification_id && food_type.food_type_conditions_id1 == parseInt(e.target.id)){
            condition2_ids.push(food_type.food_type_conditions_id2);
            food_types.push({id:food_type.number, value:food_type.name});
          }
        } else {
          if(food_type.food_classification_id == this.state.food_classification_id){
            food_types.push({id:food_type.number, value:food_type.name});
          }
        }
      })
    }
    if(this.state.food_type_conditions_master.length > 0){
      this.state.food_type_conditions_master.map(condition=>{
        if(condition.condition_number == 2 && condition2_ids.includes(condition.number)){
          food_type_conditions_2.push({id:condition.number, value:condition.name});
        }
      })
    }
    if(food_type_conditions_2.length > 0){
      food_type_conditions_2.unshift({id:0,value:''});
    }
    this.setState({
      food_type_conditions_id1:parseInt(e.target.id),
      food_type_conditions_2,
      food_types,
      food_type_id:0,
      food_type_conditions_3:[],
      food_type_conditions_4:[],
      food_type_conditions_5:[],
    });
  };

  setFoodTypeCodition2=(e)=>{
    this.change_flag = 1;
    let food_types = [];
    let food_type_conditions_3 = [];
    let condition3_ids = [];
    if(this.state.food_type_master.length > 0){
      food_types.push({id:0, value:""});
      this.state.food_type_master.map(food_type=>{
        if(parseInt(e.target.id) != 0){
          if(food_type.food_classification_id == this.state.food_classification_id
            && food_type.food_type_conditions_id1 == this.state.food_type_conditions_id1
            && food_type.food_type_conditions_id2 == parseInt(e.target.id)
          ){
            condition3_ids.push(food_type.food_type_conditions_id3);
            food_types.push({id:food_type.number, value:food_type.name});
          }
        } else {
          if(food_type.food_classification_id == this.state.food_classification_id
            && food_type.food_type_conditions_id1 == this.state.food_type_conditions_id1
          ){
            food_types.push({id:food_type.number, value:food_type.name});
          }
        }
      })
    }
    if(this.state.food_type_conditions_master.length > 0){
      this.state.food_type_conditions_master.map(condition=>{
        if(condition.condition_number == 3 && condition3_ids.includes(condition.number)){
          food_type_conditions_3.push({id:condition.number, value:condition.name});
        }
      })
    }
    if(food_type_conditions_3.length > 0){
      food_type_conditions_3.unshift({id:0,value:''});
    }
    this.setState({
      food_type_conditions_id2:parseInt(e.target.id),
      food_type_conditions_3,
      food_types,
      food_type_id:0,
      food_type_conditions_4:[],
      food_type_conditions_5:[],
    });
  };

  setFoodTypeCodition3=(e)=>{
    this.change_flag = 1;
    let food_types = [];
    let food_type_conditions_4 = [];
    let condition4_ids = [];
    if(this.state.food_type_master.length > 0){
      food_types.push({id:0, value:""});
      this.state.food_type_master.map(food_type=>{
        if(parseInt(e.target.id) != 0){
          if(food_type.food_classification_id == this.state.food_classification_id
            && food_type.food_type_conditions_id1 == this.state.food_type_conditions_id1
            && food_type.food_type_conditions_id2 == this.state.food_type_conditions_id2
            && food_type.food_type_conditions_id3 == parseInt(e.target.id)
          ){
            condition4_ids.push(food_type.food_type_conditions_id4);
            food_types.push({id:food_type.number, value:food_type.name});
          }
        } else {
          if(food_type.food_classification_id == this.state.food_classification_id
            && food_type.food_type_conditions_id1 == this.state.food_type_conditions_id1
            && food_type.food_type_conditions_id2 == this.state.food_type_conditions_id2
          ){
            food_types.push({id:food_type.number, value:food_type.name});
          }
        }
      })
    }
    if(this.state.food_type_conditions_master.length > 0){
      this.state.food_type_conditions_master.map(condition=>{
        if(condition.condition_number == 4 && condition4_ids.includes(condition.number)){
          food_type_conditions_4.push({id:condition.number, value:condition.name});
        }
      })
    }
    if(food_type_conditions_4.length > 0){
      food_type_conditions_4.unshift({id:0,value:''});
    }
    this.setState({
      food_type_conditions_id3:parseInt(e.target.id),
      food_type_conditions_4,
      food_types,
      food_type_id:0,
      food_type_conditions_5:[],
    });
  };

  setFoodTypeCodition4=(e)=>{
    this.change_flag = 1;
    let food_types = [];
    let food_type_conditions_5 = [];
    let condition5_ids = [];
    if(this.state.food_type_master.length > 0){
      food_types.push({id:0, value:""});
      this.state.food_type_master.map(food_type=>{
        if(parseInt(e.target.id) != 0){
          if(food_type.food_classification_id == this.state.food_classification_id
            && food_type.food_type_conditions_id1 == this.state.food_type_conditions_id1
            && food_type.food_type_conditions_id2 == this.state.food_type_conditions_id2
            && food_type.food_type_conditions_id3 == this.state.food_type_conditions_id3
            && food_type.food_type_conditions_id4 == parseInt(e.target.id)
          ){
            condition5_ids.push(food_type.food_type_conditions_id5);
            food_types.push({id:food_type.number, value:food_type.name});
          }
        } else {
          if(food_type.food_classification_id == this.state.food_classification_id
            && food_type.food_type_conditions_id1 == this.state.food_type_conditions_id1
            && food_type.food_type_conditions_id2 == this.state.food_type_conditions_id2
            && food_type.food_type_conditions_id3 == this.state.food_type_conditions_id3
          ){
            food_types.push({id:food_type.number, value:food_type.name});
          }
        }
      })
    }
    if(this.state.food_type_conditions_master.length > 0){
      this.state.food_type_conditions_master.map(condition=>{
        if(condition.condition_number == 5 && condition5_ids.includes(condition.number)){
          food_type_conditions_5.push({id:condition.number, value:condition.name});
        }
      })
    }
    if(food_type_conditions_5.length > 0){
      food_type_conditions_5.unshift({id:0,value:''});
    }
    this.setState({
      food_type_conditions_id4:parseInt(e.target.id),
      food_type_conditions_5,
      food_types,
      food_type_id:0,
    });
  };

  setFoodTypeCodition5=(e)=>{
    this.change_flag = 1;
    let food_types = [];
    if(this.state.food_type_master.length > 0){
      food_types.push({id:0, value:""});
      this.state.food_type_master.map(food_type=>{
        if(parseInt(e.target.id) != 0){
          if(food_type.food_classification_id == this.state.food_classification_id
            && food_type.food_type_conditions_id1 == this.state.food_type_conditions_id1
            && food_type.food_type_conditions_id2 == this.state.food_type_conditions_id2
            && food_type.food_type_conditions_id3 == this.state.food_type_conditions_id3
            && food_type.food_type_conditions_id4 == this.state.food_type_conditions_id4
            && food_type.food_type_conditions_id5 == parseInt(e.target.id)
          ){
            food_types.push({id:food_type.number, value:food_type.name});
          }
        } else {
          if(food_type.food_classification_id == this.state.food_classification_id
            && food_type.food_type_conditions_id1 == this.state.food_type_conditions_id1
            && food_type.food_type_conditions_id2 == this.state.food_type_conditions_id2
            && food_type.food_type_conditions_id3 == this.state.food_type_conditions_id3
            && food_type.food_type_conditions_id4 == this.state.food_type_conditions_id4
          ){
            food_types.push({id:food_type.number, value:food_type.name});
          }
        }
      })
    }
    this.setState({
      food_type_conditions_id5:parseInt(e.target.id),
      food_types,
      food_type_id:0,
    });
  };

  setFoodType = (e) => {
    this.change_flag = 1;
    let state_data = {};
    let food_type_id = parseInt(e.target.id);
    state_data['food_type_id'] = food_type_id;
    if(this.state.food_type_master.length > 0 && food_type_id != 0){
      this.state.food_type_master.map(food_type=>{
        if(food_type.number == food_type_id && food_type.default_json != null){
          if(food_type.default_json.staple_food_id_morning != undefined && parseInt(food_type.default_json.staple_food_id_morning) > 0){
            let staple_food_id_morning = parseInt(food_type.default_json.staple_food_id_morning);
            if(this.state.staple_food_master.length > 0 && this.state.staple_food_master.find((x) => x.id == staple_food_id_morning) != undefined){
              state_data['staple_food_id_morning'] = staple_food_id_morning;
            }
          }
          if(food_type.default_json.staple_food_id_noon != undefined && parseInt(food_type.default_json.staple_food_id_noon) > 0){
            let staple_food_id_noon = parseInt(food_type.default_json.staple_food_id_noon);
            if(this.state.staple_food_master.length > 0 && this.state.staple_food_master.find((x) => x.id == staple_food_id_noon) != undefined){
              state_data['staple_food_id_noon'] = staple_food_id_noon;
            }
          }
          if(food_type.default_json.staple_food_id_evening != undefined && parseInt(food_type.default_json.staple_food_id_evening) > 0){
            let staple_food_id_evening = parseInt(food_type.default_json.staple_food_id_evening);
            if(this.state.staple_food_master.length > 0 && this.state.staple_food_master.find((x) => x.id == staple_food_id_evening) != undefined){
              state_data['staple_food_id_evening'] = staple_food_id_evening;
            }
          }
          if(food_type.default_json.drink_id_morning != undefined && parseInt(food_type.default_json.drink_id_morning) > 0){
            let drink_id_morning = parseInt(food_type.default_json.drink_id_morning);
            if(this.state.drink_master.length > 0 && this.state.drink_master.find((x) => x.id == drink_id_morning) != undefined){
              state_data['drink_id_morning'] = drink_id_morning;
            }
          }
          if(food_type.default_json.drink_id_noon != undefined && parseInt(food_type.default_json.drink_id_noon) > 0){
            let drink_id_noon = parseInt(food_type.default_json.drink_id_noon);
            if(this.state.drink_master.length > 0 && this.state.drink_master.find((x) => x.id == drink_id_noon) != undefined){
              state_data['drink_id_noon'] = drink_id_noon;
            }
          }
          if(food_type.default_json.drink_id_evening != undefined && parseInt(food_type.default_json.drink_id_evening) > 0){
            let drink_id_evening = parseInt(food_type.default_json.drink_id_evening);
            if(this.state.drink_master.length > 0 && this.state.drink_master.find((x) => x.id == drink_id_evening) != undefined){
              state_data['drink_id_evening'] = drink_id_evening;
            }
          }
          if(food_type.default_json.staple_food_morning_free_comment != undefined && food_type.default_json.staple_food_morning_free_comment != ""){
            state_data['staple_food_morning_free_comment'] = food_type.default_json.staple_food_morning_free_comment;
          }
          if(food_type.default_json.staple_food_noon_free_comment != undefined && food_type.default_json.staple_food_noon_free_comment != ""){
            state_data['staple_food_noon_free_comment'] = food_type.default_json.staple_food_noon_free_comment;
          }
          if(food_type.default_json.staple_food_evening_free_comment != undefined && food_type.default_json.staple_food_evening_free_comment != ""){
            state_data['staple_food_evening_free_comment'] = food_type.default_json.staple_food_evening_free_comment;
          }
          if(food_type.default_json.side_food_id != undefined && parseInt(food_type.default_json.side_food_id) > 0){
            let side_food_id = parseInt(food_type.default_json.side_food_id);
            if(this.state.side_food_master.length > 0 && this.state.side_food_master.find((x) => x.id == side_food_id) != undefined){
              state_data['side_food_id'] = side_food_id;
            }
          }
          if(food_type.default_json.breakfast_id != undefined && parseInt(food_type.default_json.breakfast_id) > 0){
            let breakfast_id = parseInt(food_type.default_json.breakfast_id);
            if(this.state.breakfast_master.length > 0 && this.state.breakfast_master.find((x) => x.id == breakfast_id) != undefined){
              state_data['breakfast_id'] = breakfast_id;
            }
          }
        }
      })
    }
    this.setState(state_data,()=>{
      this.setFoodInfo();
    });
  };

  setFoodInfo=()=>{
    let food_type_id = this.state.food_type_id;
    let nutritional_data = [];
    if(this.state.food_type_nutritional_value.length > 0){
      this.state.food_type_nutritional_value.map(item=>{
        if(item.food_type_id == food_type_id){
          nutritional_data.push(item);
        }
      })
    }
    this.setState({nutritional_data});
  };

  setStapleFood = (key, e) => {
    this.change_flag = 1;
    this.setState({[key]:parseInt(e.target.id)});
  };

  setDrink = (key, e) => {
    this.change_flag = 1;
    this.setState({[key]:parseInt(e.target.id)});
  };

  clearDisease=()=>{
    this.setState({
      meal_disease_name_id:0,
      meal_disease_name:"",
    });
  };

  setDiseaseName =  () => {
    this.setState({isOpenSelectDiseaseModal: true});
  };

  closeModal=()=>{
    this.setState({
      isOpenSelectDiseaseModal: false,
      isAddDiseaseNameModal: false,
      confirm_message: "",
      confirm_type: "",
      alert_messages: "",
      notice_message: "",
    });
  };

  selectDiseaseName =(disease_name,disease)=>{
    this.change_flag = 1;
    this.setState({
      meal_disease_name:disease_name,
      meal_disease_name_id:disease.number,
    });
  }

  registerDisease =  () => {
    this.setState({isAddDiseaseNameModal: true});
  };

  confrimClear=(type)=>{
    if(type == "food_drink_morning"){
      if(this.state.staple_food_id_morning == 0 && this.state.drink_id_morning == 0){
        return;
      }
      this.setState({
        confirm_message:"主食（朝）、飲み物（朝）の内容をクリアします。よろしいですか？",
        confirm_type:type,
      })
    }
    if(type == "food_drink_noon"){
      if(this.state.staple_food_id_noon == 0 && this.state.drink_id_noon == 0){
        return;
      }
      this.setState({
        confirm_message:"主食（昼）、飲み物（昼）の内容をクリアします。よろしいですか？",
        confirm_type:type,
      })
    }
    if(type == "food_drink_evening"){
      if(this.state.staple_food_id_evening == 0 && this.state.drink_id_evening == 0){
        return;
      }
      this.setState({
        confirm_message:"主食（夕）、飲み物（夕）の内容をクリアします。よろしいですか？",
        confirm_type:type,
      })
    }
    if(type == "meal_disease_name"){
      if(this.state.meal_disease_name_id == 0){
        return;
      }
      this.setState({
        confirm_message:"病名の内容をクリアします。よろしいですか？",
        confirm_type:type,
      })
    }
    if(type == "thick_liquid_food_condition"){
      if(this.state.thick_liquid_food_conditions_id1 == 0 && this.state.thick_liquid_food_conditions_id2 == 0 && this.state.thick_liquid_food_id == 0){
        return;
      }
      this.setState({
        confirm_message:"濃厚流動食情報の内容をクリアします。よろしいですか？",
        confirm_type:type,
      })
    }
    if(type == "thick_liquid_food"){
      if(this.state.ingestion_method_id == 0 && this.state.thick_liquid_food_number_id_morning == 0 && this.state.thick_liquid_food_number_id_noon == 0 && this.state.thick_liquid_food_number_id_evening == 0){
        return;
      }
      this.setState({
        confirm_message:"濃厚流動食情報の内容をクリアします。よろしいですか？",
        confirm_type:type,
      })
    }
    if(type == "milk_conditions"){
      if(this.state.milk_conditions_id1 == 0 && this.state.milk_conditions_id2 == 0 && this.state.milk_id == 0){
        return;
      }
      this.setState({
        confirm_message:"ミルク食情報の内容をクリアします。よろしいですか？",
        confirm_type:type,
      })
    }
    if(type == "milk"){
      if(this.state.milk_amount_id == 0 && this.state.adjustment_amount == 0 && this.state.milk_number_of_times_id_noon == 0){
        return;
      }
      this.setState({
        confirm_message:"ミルク食情報の内容をクリアします。よろしいですか？",
        confirm_type:type,
      })
    }
  };

  confirmOk=()=>{
    // ■YJ917 食事変更と食事一括指示も内容の変更があるときはキャンセルに破棄確認をつける
    if (this.state.confirm_type == "cancel_input") {
      this.props.closeModal();
      return;
    }

    let _state = {};
    _state['confirm_type'] = "";
    _state['confirm_message'] = "";
    if(this.state.confirm_type === "food_drink_morning"){
      _state['staple_food_id_morning'] = 0;
      _state['drink_id_morning'] = 0;
    }
    if(this.state.confirm_type === "food_drink_noon"){
      _state['staple_food_id_noon'] = 0;
      _state['drink_id_noon'] = 0;
    }
    if(this.state.confirm_type === "food_drink_evening"){
      _state['staple_food_id_evening'] = 0;
      _state['drink_id_evening'] = 0;
    }
    if(this.state.confirm_type === "meal_disease_name"){
      _state['meal_disease_name'] = '';
      _state['meal_disease_name_id'] = 0;
    }
    if(this.state.confirm_type === "thick_liquid_food_condition"){
      _state['thick_liquid_food_conditions_id1'] = 0;
      _state['thick_liquid_food_conditions_id2'] = 0;
      _state['thick_liquid_food_id'] = 0;
      _state['thick_liquid_food_conditions_2'] = [];
      _state['thick_liquid_food'] = [];
    }
    if(this.state.confirm_type === "thick_liquid_food"){
      _state['ingestion_method_id'] = 0;
      _state['thick_liquid_food_number_id_morning'] = 0;
      _state['thick_liquid_food_number_id_noon'] = 0;
      _state['thick_liquid_food_number_id_evening'] = 0;
    }
    if(this.state.confirm_type === "milk_conditions"){
      _state['milk_conditions_id1'] = 0;
      _state['milk_conditions_id2'] = 0;
      _state['milk_id'] = 0;
      _state['milk_conditions_2'] = [];
      _state['milks'] = [];
    }
    if(this.state.confirm_type === "milk"){
      _state['milk_amount_id'] = 0;
      _state['adjustment_amount'] = 0;
      _state['milk_number_of_times_id_noon'] = 0;
    }
    if(this.state.confirm_type === "save"){
      this.saveCache();
    }
    this.setState(_state);
  };

  setServing = (e) => {
    this.change_flag = 1;
    this.setState({serving_id:parseInt(e.target.id)});
  };

  setSideFood = (e) => {
    this.change_flag = 1;
    this.setState({side_food_id:parseInt(e.target.id)});
  };

  setBreakfast = (e) => {
    this.change_flag = 1;
    this.setState({breakfast_id:parseInt(e.target.id)});
  };

  setFreeCommnet(e) {
    this.change_flag = 1;
    this.setState({free_comment:e.target.value});
  }

  setMealFreeCommnet(key, e) {
    this.change_flag = 1;
    if (key == "moring") {
      this.setState({staple_food_morning_free_comment:e.target.value});
    } else if(key == "noon") {
      this.setState({staple_food_noon_free_comment:e.target.value});
    } else if(key == "evening") {
      this.setState({staple_food_evening_free_comment:e.target.value});
    }
  }
  
  setThickLiquidFood = (key, e) => {
    this.change_flag = 1;
    let state_data = {};
    state_data[key] = parseInt(e.target.id);
    if(key === "thick_liquid_food_id"){
      state_data.ingestion_method_id = 0;
      state_data.thick_liquid_food_number_id_morning = 0;
      state_data.thick_liquid_food_number_id_noon = 0;
      state_data.thick_liquid_food_number_id_evening = 0;
    }
    this.setState(state_data);
  };

  setMilk = (key, e) => {
    this.change_flag = 1;
    this.setState({[key]:parseInt(e.target.id)});
  };

  getNextDateAndTimeClassification = (date, classification) => {
    let result = {
      date: formatDateLine(date),
      classification: classification
    }

    if(classification < 3){
      result.classification = classification + 1;
    } else if(classification == 3) {
      result.date = formatDateLine(getNextDayByJapanFormat(date));
      result.classification = 1;
    }

    return result;
  }

  confirmSave=()=>{
    if(this.change_flag == 0){
      return;
    }
    let error = this.checkValidation();
    if(this.state.start_date != null && this.state.start_date != "" && this.state.start_date_to != null && this.state.start_date_to != ""){
      let start_date_line = formatDateLine(this.state.start_date);
      let start_date_to_line = formatDateLine(this.state.start_date_to);
      if (start_date_line == start_date_to_line) {
        if (this.state.start_time_classification >= this.state.start_time_classification_to) {
          error.push("対象期間を正確に入力してください。");
        }
      } else if(this.state.start_date_to < this.state.start_date) {
        error.push("対象期間を正確に入力してください。");
      }
    }
    // 食事の時間帯に対する時刻設定
    let changeMealStatus_start = getEnableChangeMeal(this.state.start_date, this.state.meal_time_classification_master);
    let isDisableMealSelected_start = false;
    if (changeMealStatus_start != "") {
      let meal_status_array = [];
      meal_status_array = changeMealStatus_start.split(":");
      if (meal_status_array.includes(this.state.start_time_classification.toString())) {
        isDisableMealSelected_start = true;
      }
    }
    // ●YJ356 食事の締め切りの調整と権限の追加
    // 「食事/実施直前変更」があるユーザーは、食事変更・食事一括指示で、締め切り済みの時間でも変更できるようにする。
    let permission_meal = this.context.$canDoAction(this.context.FEATURES.MEAL_CHANGE,this.context.AUTHS.MEAL_IMPLEMENT_EDIT);
    if (permission_meal) isDisableMealSelected_start = false;
    if(isDisableMealSelected_start){
      let cur_start_date = formatDateLine(this.state.start_date).split('-').join('/');
      let cur_start_time_name = (this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification) != undefined) ?
        this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification).value : "";
      let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
      if(cur_start_time_name == "朝" || cur_start_time_name == "夜"){
        let morning_time = "10:15";
        if (init_status != null && init_status != undefined && init_status.morning_time != undefined && init_status.morning_time != null) {
          morning_time = init_status.morning_time;
        }
        this.setState({alert_messages:"前日の"+morning_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
        return;
      }
      if(cur_start_time_name == "昼"){
        let noon_time = "13:45";
        if (init_status != null && init_status != undefined && init_status.noon_time != undefined && init_status.noon_time != null) {
          noon_time = init_status.noon_time;
        }
        this.setState({alert_messages:"前日の"+noon_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
        return;
      }
      if(cur_start_time_name == "夕"){
        let evening_time = "15:45";
        if (init_status != null && init_status != undefined && init_status.evening_time != undefined && init_status.evening_time != null) {
          evening_time = init_status.evening_time;
        }
        this.setState({alert_messages:"前日の"+evening_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
        return;
      }
    }
    let changeMealStatus_end = getEnableChangeMeal(this.state.start_date_to, this.state.meal_time_classification_master);
    let isDisableMealSelected_end = false;
    if (changeMealStatus_end != "") {
      let meal_status_array = [];
      meal_status_array = changeMealStatus_end.split(":");
      if (meal_status_array.includes(this.state.start_time_classification_to.toString())) {
        isDisableMealSelected_end = true;
      }
    }
    if (permission_meal) isDisableMealSelected_end = false;
    if(isDisableMealSelected_end){
      let cur_start_date = formatDateLine(this.state.start_date_to).split('-').join('/');
      let cur_start_time_name = (this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification_to) != undefined) ?
        this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification_to).value : "";
      let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
      if(cur_start_time_name == "朝" || cur_start_time_name == "夜"){
        let morning_time = "10:15";
        if (init_status != null && init_status != undefined && init_status.morning_time != undefined && init_status.morning_time != null) {
          morning_time = init_status.morning_time;
        }
        this.setState({alert_messages:"前日の"+morning_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
        return;
      }
      if(cur_start_time_name == "昼"){
        let noon_time = "13:45";
        if (init_status != null && init_status != undefined && init_status.noon_time != undefined && init_status.noon_time != null) {
          noon_time = init_status.noon_time;
        }
        this.setState({alert_messages:"前日の"+noon_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
        return;
      }
      if(cur_start_time_name == "夕"){
        let evening_time = "15:45";
        if (init_status != null && init_status != undefined && init_status.evening_time != undefined && init_status.evening_time != null) {
          evening_time = init_status.evening_time;
        }
        this.setState({alert_messages:"前日の"+evening_time+"を過ぎているため、"+cur_start_date+"の"+cur_start_time_name+"食の有無は変更できません。"});
        return;
      }
    }
    // check 期間の重複
    let cache_index = this.props.cache_index != undefined && this.props.cache_index != null ? this.props.cache_index : null;
    let canRegisterMeal = karteApi.checkMealPeriod(this.props.patientId, formatDateLine(this.state.start_date), formatDateLine(this.state.start_date_to), cache_index);
    if (!canRegisterMeal) {
      this.setState({notice_message: "同じ日付を含む一括指示は同時に登録できません。"});
      return;
    }

    if (error.length > 0) {
      this.setState({ alert_message: error.join("\n") });
      return;
    }
    // if(this.state.start_time_classification === 0 || this.state.start_time_classification_to === 0){
    //   this.setState({alert_messages:"食事区分を選択してください。"});
    //   return;
    // }
    // if(this.state.food_type_id === 0){
    //   this.setState({alert_messages:"食種を選択してください。"});
    //   return;
    // }
    this.setState({
      confirm_message:"食事一括指示情報を保存しますか？",
      confirm_type:"save",
    });
  };

  checkValidation = () => {
    let error_str_arr = [];
    let validate_data = harukaValidate('karte', 'meal', 'meal_period_change', this.state);
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != "") {
      this.setState({ first_tag_id: validate_data.first_tag_id });
    }
    return error_str_arr;
  };
  closeValidateAlertModal = () => {
    this.setState({ alert_message: "" });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };

  saveCache= async()=>{
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let meal_edit = {};
    meal_edit['hos_number'] = this.state.hos_number;
    meal_edit['hos_detail_number'] = this.state.hos_detail_number;
    meal_edit['department_id'] = this.state.department_id;
    meal_edit['department_name'] = this.state.department_name;
    meal_edit['patient_id'] = this.props.patientId;
    meal_edit['start_date'] = formatDateLine(this.state.start_date);
    meal_edit['start_time_classification'] = this.state.start_time_classification;
    meal_edit['number_of_meals'] = this.state.number_of_meals;
    meal_edit['food_type_id'] = this.state.food_type_id;
    if(this.state.food_type_master.find((x) => x.number == this.state.food_type_id) !== undefined){
      meal_edit['food_type_name'] = this.state.food_type_master.find((x) => x.number == this.state.food_type_id).name;
    } else {
      meal_edit['food_type_name'] = "";
    }
  
    meal_edit['special_food_addition'] = "なし";
    meal_edit['staple_food_id_morning'] = this.state.staple_food_id_morning == 0 ? null : this.state.staple_food_id_morning;
    if(this.state.staple_food_master.find((x) => x.id == this.state.staple_food_id_morning) !== undefined){
      meal_edit['staple_food_id_morning_name'] = this.state.staple_food_master.find((x) => x.id == this.state.staple_food_id_morning).value;
      let special_meal_code = this.state.staple_food_master.find((x) => x.id == this.state.staple_food_id_morning).special_meal_code;
      if(special_meal_code != null){
        meal_edit['special_food_addition'] = "あり";
      }
    } else {
      meal_edit['staple_food_id_morning_name'] = "";
    }
    meal_edit['staple_food_id_noon'] = this.state.staple_food_id_noon == 0 ? null : this.state.staple_food_id_noon;
    if(this.state.staple_food_master.find((x) => x.id == this.state.staple_food_id_noon) !== undefined){
      meal_edit['staple_food_id_noon_name'] = this.state.staple_food_master.find((x) => x.id == this.state.staple_food_id_noon).value;
      let special_meal_code = this.state.staple_food_master.find((x) => x.id == this.state.staple_food_id_noon).special_meal_code;
      if(special_meal_code != null){
        meal_edit['special_food_addition'] = "あり";
      }
    } else {
      meal_edit['staple_food_id_noon_name'] = "";
    }
    meal_edit['staple_food_id_evening'] = this.state.staple_food_id_evening == 0 ? null : this.state.staple_food_id_evening;
    if(this.state.staple_food_master.find((x) => x.id == this.state.staple_food_id_evening) !== undefined){
      meal_edit['staple_food_id_evening_name'] = this.state.staple_food_master.find((x) => x.id == this.state.staple_food_id_evening).value;
      let special_meal_code = this.state.staple_food_master.find((x) => x.id == this.state.staple_food_id_evening).special_meal_code;
      if(special_meal_code != null){
        meal_edit['special_food_addition'] = "あり";
      }
    } else {
      meal_edit['staple_food_id_evening_name'] = "";
    }
    meal_edit['drink_id_morning'] = this.state.drink_id_morning == 0 ? null : this.state.drink_id_morning;
    if(this.state.drink_master.find((x) => x.id == this.state.drink_id_morning) !== undefined){
      meal_edit['drink_id_morning_name'] = this.state.drink_master.find((x) => x.id == this.state.drink_id_morning).value;
    } else {
      meal_edit['drink_id_morning_name'] = "";
    }
    meal_edit['drink_id_noon'] = this.state.drink_id_noon == 0 ? null : this.state.drink_id_noon;
    if(this.state.drink_master.find((x) => x.id == this.state.drink_id_noon) !== undefined){
      meal_edit['drink_id_noon_name'] = this.state.drink_master.find((x) => x.id == this.state.drink_id_noon).value;
    } else {
      meal_edit['drink_id_noon_name'] = "";
    }
    meal_edit['drink_id_evening'] = this.state.drink_id_evening == 0 ? null : this.state.drink_id_evening;
    if(this.state.drink_master.find((x) => x.id == this.state.drink_id_evening) !== undefined){
      meal_edit['drink_id_evening_name'] = this.state.drink_master.find((x) => x.id == this.state.drink_id_evening).value;
    } else {
      meal_edit['drink_id_evening_name'] = "";
    }
    meal_edit['meal_disease_name_id'] = this.state.meal_disease_name_id == 0 ? null : this.state.meal_disease_name_id;
    meal_edit['meal_disease_name'] = this.state.meal_disease_name;
    meal_edit['serving_id'] = this.state.serving_id == 0 ? null : this.state.serving_id;
    if(this.state.serving_master.find((x) => x.id == this.state.serving_id) !== undefined){
      meal_edit['serving_name'] = this.state.serving_master.find((x) => x.id == this.state.serving_id).value;
    } else {
      meal_edit['serving_name'] = "";
    }
    meal_edit['side_food_id'] = this.state.side_food_id == 0 ? null : this.state.side_food_id;
    if(this.state.side_food_master.find((x) => x.id == this.state.side_food_id) !== undefined){
      meal_edit['side_food_name'] = this.state.side_food_master.find((x) => x.id == this.state.side_food_id).value;
    } else {
      meal_edit['side_food_name'] = "";
    }
    meal_edit['breakfast_id'] = this.state.breakfast_id == 0 ? null : this.state.breakfast_id;
    if(this.state.breakfast_master.find((x) => x.id == this.state.breakfast_id) !== undefined){
      meal_edit['breakfast_name'] = this.state.breakfast_master.find((x) => x.id == this.state.breakfast_id).value;
    } else {
      meal_edit['breakfast_name'] = "";
    }
    meal_edit['free_comment'] = this.state.free_comment == "" ? null : this.state.free_comment;
    meal_edit['staple_food_morning_free_comment'] = this.state.staple_food_morning_free_comment == "" ? null : this.state.staple_food_morning_free_comment;
    meal_edit['staple_food_noon_free_comment'] = this.state.staple_food_noon_free_comment == "" ? null : this.state.staple_food_noon_free_comment;
    meal_edit['staple_food_evening_free_comment'] = this.state.staple_food_evening_free_comment == "" ? null : this.state.staple_food_evening_free_comment;
    meal_edit['meal_comment_numbers'] = this.state.meal_comment_numbers;
    meal_edit['meal_comment'] = [];
    if(this.state.meal_comment_numbers.length > 0 && this.state.meal_comment.length > 0){
      this.state.meal_comment.map(comment=>{
        if(this.state.meal_comment_numbers.includes(comment.number)){
          meal_edit['meal_comment'].push(comment);
        }
      })
    }
    meal_edit['thick_liquid_food_id'] = this.state.thick_liquid_food_id == 0 ? null : this.state.thick_liquid_food_id;
    if(this.state.thick_liquid_food_master.find((x) => x.number == this.state.thick_liquid_food_id) !== undefined){
      meal_edit['thick_liquid_food_name'] = this.state.thick_liquid_food_master.find((x) => x.number == this.state.thick_liquid_food_id).name;
    } else {
      meal_edit['thick_liquid_food_name'] = "";
    }
    meal_edit['ingestion_method_id'] = this.state.ingestion_method_id == 0 ? null : this.state.ingestion_method_id;
    meal_edit['ingestion_method_name'] = this.state.ingestion_method_id == 0 ? "" : this.state.ingestion_method.find((x) => x.id == this.state.ingestion_method_id).value;
    meal_edit['thick_liquid_food_number_id_morning'] = this.state.thick_liquid_food_number_id_morning == 0 ? null : this.state.thick_liquid_food_number_id_morning;
    meal_edit['thick_liquid_food_number_name_morning'] = this.state.thick_liquid_food_number_id_morning == 0 ? "" : this.state.thick_liquid_food_morning.find((x) => x.id == this.state.thick_liquid_food_number_id_morning).value;
    meal_edit['thick_liquid_food_number_id_noon'] = this.state.thick_liquid_food_number_id_noon == 0 ? null : this.state.thick_liquid_food_number_id_noon;
    meal_edit['thick_liquid_food_number_name_noon'] = this.state.thick_liquid_food_number_id_noon == 0 ? "" : this.state.thick_liquid_food_noon.find((x) => x.id == this.state.thick_liquid_food_number_id_noon).value;
    meal_edit['thick_liquid_food_number_id_evening'] = this.state.thick_liquid_food_number_id_evening == 0 ? null : this.state.thick_liquid_food_number_id_evening;
    meal_edit['thick_liquid_food_number_name_evening'] = this.state.thick_liquid_food_number_id_evening == 0 ? "" : this.state.thick_liquid_food_evening.find((x) => x.id == this.state.thick_liquid_food_number_id_evening).value;
    meal_edit['milk_id'] = this.state.milk_id == 0 ? null : this.state.milk_id;
    if(this.state.milk_master.find((x) => x.number == this.state.milk_id) !== undefined){
      meal_edit['milk_name'] = this.state.milk_master.find((x) => x.number == this.state.milk_id).name;
    } else {
      meal_edit['milk_name'] = "";
    }
    meal_edit['milk_amount_id'] = this.state.milk_amount_id == 0 ? null : this.state.milk_amount_id;
    meal_edit['adjustment_amount'] = this.state.adjustment_amount == 0 ? null : this.state.adjustment_amount;
    meal_edit['milk_number_of_times_id_noon'] = this.state.milk_number_of_times_id_noon == 0 ? null : this.state.milk_number_of_times_id_noon;
    meal_edit['doctor_code'] = authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    meal_edit['doctor_name'] = authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name;
    // save <to> infor
    meal_edit['start_date_to'] = formatDateLine(this.state.start_date_to);
    meal_edit['start_time_classification_to'] = this.state.start_time_classification_to;

    let next_date_classification = this.getNextDateAndTimeClassification(this.state.start_date_to, this.state.start_time_classification_to);
    meal_edit['start_date_next'] = next_date_classification.date;
    meal_edit['start_time_classification_next'] = next_date_classification.classification;
    meal_edit['meal_type'] = "meal_from_to";

    if(this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification) !== undefined){
      meal_edit['start_time_name'] = this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification).value;
    } else {
      meal_edit['start_time_name'] = "";
    }

    if(this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification_to) !== undefined){
      meal_edit['start_time_name_to'] = this.state.meal_time_classification_master.find((x) => x.id == this.state.start_time_classification_to).value;
    } else {
      meal_edit['start_time_name_to'] = "";
    }
    if (authInfo.staff_category !== 1){
      meal_edit['substitute_name'] = authInfo.name;
    }

    // save to cache
    if(this.props.cache_index != null){
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.MEAL_GROUP_EDIT, this.props.cache_index, JSON.stringify(meal_edit), 'insert');
    } else {
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.MEAL_GROUP_EDIT, new Date().getTime(), JSON.stringify(meal_edit), 'insert');
    }
    if(this.props.from_mode != "calendar"){
      this.context.$setExaminationOrderFlag(1);
    }
    this.props.closeModal();

    // save <from> info
    // karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.MEAL_EDIT, new Date().getTime(), JSON.stringify(meal_edit), 'insert');
    // await this.saveToDB(meal_edit);

    // save <to> info
    // await this.saveToDB(meal_edit);

    // karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.MEAL_EDIT, new Date().getTime() + 1, JSON.stringify(meal_edit), 'insert');
    // if(this.props.from_mode != "calendar"){
    //   this.context.$setExaminationOrderFlag(1);
    // }
    // this.props.closeModal();
  };

  saveToDB = async (save_data) => {
    let path = "/app/api/v2/meal/save/meal_info_second";
    let cur_cache_data = save_data;
    cur_cache_data.karte_status= 3;
    await apiClient
      ._post(path, {
        params: cur_cache_data
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        if (err.response.data) {
          // error_msg = error_messages;
        }
        return false;
      });
  }

  selectMealComment=(name, number)=>{
    if(name == "meal_comment"){
      let meal_comment_numbers = this.state.meal_comment_numbers;
      let index = meal_comment_numbers.indexOf(number);
      if(index === -1){
        if(meal_comment_numbers.length == 8){
          this.setState({alert_messages:"コメントは8個以内に選択してください。"});
          return;
        }
        meal_comment_numbers.push(number);
      } else {
        meal_comment_numbers.splice(index, 1);
      }
      this.change_flag = 1;
      this.setState({
        meal_comment_numbers,
      });
    }
  };

  contextMenuAction = (act, preset_do_count = null, x_pos=null, y_pos=null) => {
    if (act === "ussage_regular_comment") {  //
      var e = preset_do_count;
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ HoverFirstMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          HoverFirstMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      let top_height = document.getElementsByClassName("ussage_regular_comment-menu")[0].offsetTop;
      let state_data = {};
      state_data['HoverFirstMenu'] = {
        visible: true,
        x: x_pos,
        y: y_pos+top_height
      };      
      state_data['first_menu_data'] = this.first_meal_boilerplate;
      this.setState(state_data
        , ()=>{
          let menu_width = document.getElementsByClassName("hover-first-menu")[0].offsetWidth;
          // state_data['HoverFirstMenu']['x'] = x_pos - menu_width;
          state_data['HoverFirstMenu']['x'] = x_pos + menu_width;
          this.setState(state_data);
        });
    } else if (act === "first_hover_comment") {
        //  let menu_item = preset_do_count;
         // check usage menu or med menu
        // let menu_act = "usage";
        // let comment = menu_item.category_name;     
        // if (menu_item.body !== undefined && menu_item.body != null) {
        //     comment = menu_item.body;
        // }        
        if (preset_do_count.body != undefined) {          
          if (this.state.meal_category == "morning") {
            this.setState({
              staple_food_morning_free_comment: this.state.staple_food_morning_free_comment + preset_do_count.body
            });
          } else if(this.state.meal_category == "noon") {
            this.setState({
              staple_food_noon_free_comment: this.state.staple_food_noon_free_comment + preset_do_count.body
            });
          } else if(this.state.meal_category == "evening") {
            this.setState({
              staple_food_evening_free_comment: this.state.staple_food_evening_free_comment + preset_do_count.body
            });
          }
        }
        // if (menu_act === "usage") {
        //     this.setState({
        //         usage_remarks_comment_index: this.state.indexOfPres,
        //         comment_edit_index: presData[this.state.indexOfPres].usage_remarks_comment.length,
        //         usage_remarks_comment: comment
        //     },()=>{
        //       this.setCaretPosition("usage_remarks_comment_input", comment.length);
        //     });
        // }
    } else if (act === "second_hover_comment") {
        //  let menu_item = preset_do_count;
         // check usage menu or med menu
        // let menu_act = "usage";
        // let comment = menu_item.category_name;        
        // if (menu_item.body !== undefined && menu_item.body != null) {
        //     comment = menu_item.body;
        // }
        if (preset_do_count.body != undefined) {          
          if (this.state.meal_category == "morning") {
            this.setState({
              staple_food_morning_free_comment: this.state.staple_food_morning_free_comment + preset_do_count.body
            });
          } else if(this.state.meal_category == "noon") {
            this.setState({
              staple_food_noon_free_comment: this.state.staple_food_noon_free_comment + preset_do_count.body
            });
          } else if(this.state.meal_category == "evening") {
            this.setState({
              staple_food_evening_free_comment: this.state.staple_food_evening_free_comment + preset_do_count.body
            });
          }
        }
        // if (menu_act === "usage") {
        //     this.setState({
        //         usage_remarks_comment_index: this.state.indexOfPres,
        //         comment_edit_index: presData[this.state.indexOfPres].usage_remarks_comment.length,
        //         usage_remarks_comment: comment
        //     },()=>{
        //       this.setCaretPosition("usage_remarks_comment_input", comment.length);
        //     });
        // }
    }
  };

  setHover (x, y, item, index) {
    if (item.body !== undefined && item.body != null && item.body !== "") {
      this.setState({ HoverSecondMenu: { visible: false } });
      return;
    }
    let menu_data = null;
    if (this.boilerplate_category.find(x=>x.category_id==item.category_id).use_place=="三食フリーコメント") {
      menu_data = this.second_meal_boilerplate.filter(ele=>{
        if (item.category_id == ele.category_id) {
          return ele;
        }
      });
    }
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ HoverSecondMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        HoverSecondMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    let state_data = {};
    let top_height = document.getElementsByClassName("hover-first-menu"+index)[0].offsetTop;
    state_data['HoverSecondMenu'] = {
      visible: true,
      x: x,
      y: y + top_height
    };
    // state_data['presData'] = presData;
    state_data['second_menu_data'] = menu_data;
    this.setState(state_data, ()=>{
      let menu_width = document.getElementsByClassName("hover-second-menu")[0].offsetWidth;
      // state_data['HoverSecondMenu']['x'] = x - menu_width;
      state_data['HoverSecondMenu']['x'] = x + menu_width;
      this.setState(state_data);
    });
  }

  getBoilerplateMenu(){
    let first_meal_menu = [];
    let second_meal_menu = [];
    let category_data = sessApi.getObjectValue('boilerplate_master',"boilerplate_master_category");
    this.boilerplate_category = category_data;
    let master_data = sessApi.getObjectValue('boilerplate_master',"boilerplate_master");
    this.boilerplate_master = master_data;
    if (category_data !== undefined && category_data != null){
      first_meal_menu = category_data.filter(x=>x.function_id==BOILERPLATE_FUNCTION_ID_CATEGORY.MEAL && x.is_flat != 1 && x.use_place === "三食フリーコメント");
    }
    if (master_data !== undefined && master_data != null) {
      if (first_meal_menu !== undefined && first_meal_menu != null){
        first_meal_menu.map(item=>{
          let sub_menu = master_data.filter(x=>x.category_id==item.category_id);
          second_meal_menu = second_meal_menu.concat(sub_menu);
        });
      }      
      let flat_category = [];
      category_data.map(item=>{
        if (item.function_id == BOILERPLATE_FUNCTION_ID_CATEGORY.MEAL && item.is_flat == 1 && item.use_place === "三食フリーコメント"){
          flat_category.push(item.category_id);
        }
      });
      if (flat_category.length > 0) {
        let flat_first_meal_menu = master_data.filter(x=>flat_category.includes(x.category_id.toString()));
        first_meal_menu = first_meal_menu.concat(flat_first_meal_menu);
      }            
    }
    this.first_meal_boilerplate = first_meal_menu;
    this.second_meal_boilerplate = second_meal_menu;
  }

  handleClick (e, _type, _category){
    if (e.type === "contextmenu") {      
      if (_type == "comment") {
        let state_data = {};
        // eslint-disable-next-line consistent-this
        const that = this;
        document.addEventListener(`click`, function onClickOutside() {
          that.setState({
            ussageMenu: { visible: false }
          });
          document.removeEventListener(`click`, onClickOutside);
        });
        window.addEventListener("scroll", function onScrollOutside() {
          that.setState({
            ussageMenu: { visible: false }
          });
          window.removeEventListener(`scroll`, onScrollOutside);
        });
        document
          .getElementById(_category)
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              ussageMenu: { visible: false }
            });
            document
              .getElementById(_category)
              .removeEventListener(`scroll`, onScrollOutside);
          });
        state_data['HoverFirstMenu'] = { visible: false };
        state_data['HoverSecondMenu'] = { visible: false };
        state_data['ussageMenu'] = {
          visible: true,
          x: e.clientX - 80,
          y: e.clientY + window.pageYOffset,
          meal_category: _category
        };
        state_data["meal_category"] = _category;

        this.setState(state_data)
      }
    }
  }
  
  thick_liquid_food_condition1=(e)=>{
    let thick_liquid_food_conditions_2 = [];
    let thick_liquid_food_conditions2_ids = [];
    let thick_liquid_food = [];
    if(this.state.thick_liquid_food_master.length > 0){
      this.state.thick_liquid_food_master.map(item=>{
        if(item.thick_liquid_food_conditions_id1 == parseInt(e.target.id)){
          thick_liquid_food_conditions2_ids.push(item.thick_liquid_food_conditions_id2);
          thick_liquid_food.push({id:item.number, value:item.name});
        }
      })
    }
    if(thick_liquid_food_conditions2_ids.length > 0){
      this.state.thick_liquid_food_conditions_master.map(item=>{
        if(thick_liquid_food_conditions2_ids.includes(item.number)){
          thick_liquid_food_conditions_2.push({id:item.number, value:item.name});
        }
      })
      if(thick_liquid_food_conditions_2.length > 0){
        thick_liquid_food_conditions_2.unshift({id:0,value:''});
        thick_liquid_food = [];
      }
    }
    if(thick_liquid_food.length > 0) {
      thick_liquid_food.unshift({id:0,value:''});
    }
    this.setState({
      thick_liquid_food_conditions_id1:parseInt(e.target.id),
      thick_liquid_food_conditions_2,
      thick_liquid_food,
      thick_liquid_food_conditions_id2:0,
      thick_liquid_food_id:0,
      ingestion_method_id:0,
      thick_liquid_food_number_id_morning:0,
      thick_liquid_food_number_id_noon:0,
      thick_liquid_food_number_id_evening:0,
    });
  }
  
  thick_liquid_food_condition2=(e)=>{
    let thick_liquid_food = [];
    if(this.state.thick_liquid_food_master.length > 0){
      this.state.thick_liquid_food_master.map(item=>{
        if(item.thick_liquid_food_conditions_id1 == this.state.thick_liquid_food_conditions_id1 && item.thick_liquid_food_conditions_id2 == parseInt(e.target.id)){
          thick_liquid_food.push({id:item.number, value:item.name});
        }
      })
    }
    thick_liquid_food.unshift({id:0,value:''});
    this.setState({
      thick_liquid_food_conditions_id2:parseInt(e.target.id),
      thick_liquid_food,
      thick_liquid_food_id:0,
      ingestion_method_id:0,
      thick_liquid_food_number_id_morning:0,
      thick_liquid_food_number_id_noon:0,
      thick_liquid_food_number_id_evening:0,
    });
  }

  handleCloseModal = () => {
    if (this.change_flag == 1) {
      this.setState({
        confirm_message: "入力内容を破棄しますか？",
        confirm_type: "cancel_input"
      })
      return;
    }
    this.props.closeModal();
  }

  render() {
    // 食事の時間帯に対する時刻設定
    let changeMealStatus_start = getEnableChangeMeal(this.state.start_date, this.state.meal_time_classification_master);
    let changeMealStatus_end = getEnableChangeMeal(this.state.start_date_to, this.state.meal_time_classification_master);

    // ●YJ356 食事の締め切りの調整と権限の追加
    // 「食事/実施直前変更」があるユーザーは、食事変更・食事一括指示で、締め切り済みの時間でも変更できるようにする。
    let permission_meal = this.context.$canDoAction(this.context.FEATURES.MEAL_CHANGE,this.context.AUTHS.MEAL_IMPLEMENT_EDIT);

    return (
      <>
        <Modal
          show={true}
          id="outpatient"
          className="custom-modal-sm patient-exam-modal outpatient-modal change-meal first-view-modal"
        >
          <Modal.Header><Modal.Title>食事一括指示</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              {this.state.is_loaded == false ? (
                <div className='spinner-loading center'>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </div>
              ):(
                <>
                  <div>
                    <div className={'info-title'}>【食事一括指示情報】</div>
                    <div className="div-flex">
                      <div className={'div-flex'} style={{marginBottom:"0.3rem"}}>
                        <div className={'select-date'}>
                          <InputWithLabelBorder
                            id="start_date_id"
                            label="食事開始日時"
                            type="date"
                            getInputText={this.setStartDate.bind(this)}
                            diseaseEditData={this.state.start_date}
                          />
                        </div>
                        <div className={'time-class'}>
                          <SelectorWithLabel
                            id="start_time_classification_id"
                            title=""
                            options={this.state.meal_time_classification_master}
                            getSelect={this.setStartTimeClassification}
                            departmentEditCode={this.state.start_time_classification}
                            disabledValue={permission_meal == true ? "" :changeMealStatus_start}
                          />
                        </div>
                        <div style={{marginLeft:"0.3rem", lineHeight:"2rem"}}>より開始</div>
                      </div>
                      <div className={'div-flex to-date'} style={{marginBottom:"0.3rem"}}>
                        <div className={'select-date'}>
                          <InputWithLabelBorder
                            id="start_date_to_id"
                            label=""
                            type="date"
                            getInputText={this.setStartDateTo.bind(this)}
                            diseaseEditData={this.state.start_date_to}
                          />
                        </div>
                        <div className={'time-class'}>
                          <SelectorWithLabel
                            id="start_time_classification_to_id"
                            title=""
                            options={this.state.meal_time_classification_master}
                            getSelect={this.setStartTimeClassificationTo}
                            departmentEditCode={this.state.start_time_classification_to}
                            disabledValue={permission_meal == true ? "" :changeMealStatus_end}
                          />
                        </div>
                        <div style={{marginLeft:"0.3rem", lineHeight:"2rem"}}>まで</div>
                      </div>
                    </div>
                  </div>
                  <div className="div-flex">
                    <div className="left-col">
                      <div className={'info-title'}>【セット情報】</div>
                      <div className="select-food-condition div-flex">
                        <div className={'food-classific'} style={{marginBottom:"0.3rem"}}>
                          <SelectorWithLabel
                            title="食種"
                            options={this.state.food_classification_master}
                            getSelect={this.setFoodClassification}
                            departmentEditCode={this.state.food_classification_id}
                          />
                        </div>
                        {this.state.food_type_conditions_1.length > 0 && (
                          <div style={{marginBottom:"0.3rem"}}>
                            <SelectorWithLabel
                              title=""
                              options={this.state.food_type_conditions_1}
                              getSelect={this.setFoodTypeCodition1}
                              departmentEditCode={this.state.food_type_conditions_id1}
                            />
                          </div>
                        )}
                        {this.state.food_type_conditions_2.length > 0 && (
                          <div className="div-flex" style={{marginBottom:"0.3rem"}}>
                            <SelectorWithLabel
                              title=""
                              options={this.state.food_type_conditions_2}
                              getSelect={this.setFoodTypeCodition2}
                              departmentEditCode={this.state.food_type_conditions_id2}
                            />
                          </div>
                        )}
                        {this.state.food_type_conditions_3.length > 0 && (
                          <div className="div-flex" style={{marginBottom:"0.3rem"}}>
                            <SelectorWithLabel
                              title=""
                              options={this.state.food_type_conditions_3}
                              getSelect={this.setFoodTypeCodition3}
                              departmentEditCode={this.state.food_type_conditions_id3}
                            />
                          </div>
                        )}
                        {this.state.food_type_conditions_4.length > 0 && (
                          <div className="div-flex" style={{marginBottom:"0.3rem"}}>
                            <SelectorWithLabel
                              title=""
                              options={this.state.food_type_conditions_4}
                              getSelect={this.setFoodTypeCodition4}
                              departmentEditCode={this.state.food_type_conditions_id4}
                            />
                          </div>
                        )}
                        {this.state.food_type_conditions_5.length > 0 && (
                          <div className="div-flex" style={{marginBottom:"0.3rem"}}>
                            <SelectorWithLabel
                              title=""
                              options={this.state.food_type_conditions_5}
                              getSelect={this.setFoodTypeCodition5}
                              departmentEditCode={this.state.food_type_conditions_id5}
                            />
                          </div>
                        )}
                      </div>
                      <div className="select-food-type">
                        <SelectorWithLabel
                          id="food_type_id_id"
                          title=""
                          options={this.state.food_types}
                          getSelect={this.setFoodType}
                          departmentEditCode={this.state.food_type_id}
                        />
                      </div>
                      <div className={'div-flex'} style={{marginBottom:"0.2rem"}}>
                        <div className={'staple-food'}>
                          <SelectorWithLabel
                            title="主食(朝)"
                            options={this.state.staple_food_master}
                            getSelect={this.setStapleFood.bind(this, 'staple_food_id_morning')}
                            departmentEditCode={this.state.staple_food_id_morning}
                          />
                        </div>
                        <div className={'drink div-flex'}>
                          <SelectorWithLabel
                            title="飲み物(朝)"
                            options={this.state.drink_master}
                            getSelect={this.setDrink.bind(this, 'drink_id_morning')}
                            departmentEditCode={this.state.drink_id_morning}
                          />
                          <button className="clear-btn-1" onClick={this.confrimClear.bind(this, 'food_drink_morning')}>C</button>
                        </div>
                      </div>
                      <div className={'div-flex meal-free-comment'} id={"morning"} onContextMenu={e =>this.handleClick(e, "comment", "morning")} style={{marginBottom:"0.2rem"}}>
                        <InputBoxTag
                          label="フリーコメント"
                          type="text"
                          getInputText={this.setMealFreeCommnet.bind(this, "moring")}
                          value={this.state.staple_food_morning_free_comment}
                        />
                      </div>
                      <div className={'div-flex'} style={{marginBottom:"0.2rem"}}>
                        <div className={'staple-food'}>
                          <SelectorWithLabel
                            title="主食(昼)"
                            options={this.state.staple_food_master}
                            getSelect={this.setStapleFood.bind(this, 'staple_food_id_noon')}
                            departmentEditCode={this.state.staple_food_id_noon}
                          />
                        </div>
                        <div className={'drink div-flex'}>
                          <SelectorWithLabel
                            title="飲み物(昼)"
                            options={this.state.drink_master}
                            getSelect={this.setDrink.bind(this, 'drink_id_noon')}
                            departmentEditCode={this.state.drink_id_noon}
                          />
                          <button className="clear-btn-1" onClick={this.confrimClear.bind(this, 'food_drink_noon')}>C</button>
                        </div>
                      </div>
                      <div className={'div-flex meal-free-comment'} id={"noon"} onContextMenu={e =>this.handleClick(e, "comment", "noon")} style={{marginBottom:"0.2rem"}}>
                        <InputBoxTag
                          label="フリーコメント"
                          type="text"
                          getInputText={this.setMealFreeCommnet.bind(this, "noon")}
                          value={this.state.staple_food_noon_free_comment}
                        />
                      </div>
                      <div className={'div-flex'} style={{marginBottom:"0.2rem"}}>
                        <div className={'staple-food'}>
                          <SelectorWithLabel
                            title="主食(夕)"
                            options={this.state.staple_food_master}
                            getSelect={this.setStapleFood.bind(this, 'staple_food_id_evening')}
                            departmentEditCode={this.state.staple_food_id_evening}
                          />
                        </div>
                        <div className={'drink div-flex'}>
                          <SelectorWithLabel
                            title="飲み物(夕)"
                            options={this.state.drink_master}
                            getSelect={this.setDrink.bind(this, 'drink_id_evening')}
                            departmentEditCode={this.state.drink_id_evening}
                          />
                          <button className="clear-btn-1" onClick={this.confrimClear.bind(this, 'food_drink_evening')}>C</button>
                        </div>
                      </div>
                      <div className={'div-flex meal-free-comment'} id={"evening"} onContextMenu={e =>this.handleClick(e, "comment", "evening")} style={{marginBottom:"0.2rem"}}>
                        <InputBoxTag
                          label="フリーコメント"
                          type="text"
                          getInputText={this.setMealFreeCommnet.bind(this, "evening")}
                          value={this.state.staple_food_evening_free_comment}
                        />
                      </div>
                      <div className="side_food_breakfast div-flex" style={{marginBottom:"0.2rem"}}>
                        <SelectorWithLabel
                          title="副食"
                          options={this.state.side_food_master}
                          getSelect={this.setSideFood}
                          departmentEditCode={this.state.side_food_id}
                        />
                        {/*<SelectorWithLabel*/}
                          {/*title="朝食"*/}
                          {/*options={this.state.breakfast_master}*/}
                          {/*getSelect={this.setBreakfast}*/}
                          {/*departmentEditCode={this.state.breakfast_id}*/}
                        {/*/>*/}
                      </div>
                      <div className="div-flex select-disease">
                        <div className={'label-title'}>病名</div>
                        <div className={'disease-name'}>{this.state.meal_disease_name}</div>
                        <button className="clear-btn-2" onClick={this.confrimClear.bind(this, 'meal_disease_name')}>C</button>                        
                        <Button type="common" onClick={this.setDiseaseName}>病名選択</Button>
                        <Button type="common" onClick={this.registerDisease}>病名新規登録</Button>
                      </div>
                      <div className="div-flex serving">
                        <SelectorWithLabel
                          title="配膳先"
                          options={this.state.serving_master}
                          getSelect={this.setServing}
                          departmentEditCode={this.state.serving_id}
                        />
                      </div>
                      <div className="div-flex meal-comment">
                        <div>
                          <div className="label-comment">コメント</div>
                          <div>  (8個まで)</div>
                        </div>
                        <div className="comment-area">
                          <table>
                            {this.state.meal_comment.length > 0 && (
                              this.state.meal_comment.map(comment=>{
                                return (
                                  <>
                                    <tr>
                                      <td className={'td-check'}>
                                        <Checkbox
                                          getRadio={this.selectMealComment.bind(this)}
                                          value={(this.state.meal_comment_numbers.includes(comment.number))}
                                          number={comment.number}
                                          name="meal_comment"
                                        />
                                      </td>
                                      <td className={'td-comment'}>{comment.name}</td>
                                    </tr>
                                  </>
                                )
                              })
                            )}
                          </table>
                        </div>
                      </div>
                      <div className="div-flex free-comment">
                        <InputBoxTag
                          label="フリーコメント"
                          type="text"
                          getInputText={this.setFreeCommnet.bind(this)}
                          value={this.state.free_comment}
                        />
                      </div>
                      <div className={'info-title'} style={{paddingTop:"0.3rem"}}>【濃厚流動食情報】</div>
                      <div className="thick-liquid-food">
                        <div className={'table-area'}>
                          <table>
                            <tr>
                              <th></th>
                              <th>流動食名</th>
                            </tr>
                            <tr>
                              <td><button className="clear-btn-2" onClick={this.confrimClear.bind(this, 'thick_liquid_food_condition')}>C</button></td>
                              <td>
                                <div className="div-flex">
                                  <div className={'condition-1'}>
                                    <SelectorWithLabel
                                      title=""
                                      options={this.state.thick_liquid_food_conditions_1}
                                      getSelect={this.thick_liquid_food_condition1}
                                      departmentEditCode={this.state.thick_liquid_food_conditions_id1}
                                    />
                                  </div>
                                  {this.state.thick_liquid_food_conditions_2.length > 0 && (
                                    <div className={'condition-2'}>
                                      <SelectorWithLabel
                                        title=""
                                        options={this.state.thick_liquid_food_conditions_2}
                                        getSelect={this.thick_liquid_food_condition2}
                                        departmentEditCode={this.state.thick_liquid_food_conditions_id2}
                                      />
                                    </div>
                                  )}
                                  {this.state.thick_liquid_food.length > 0 && (
                                    <div className={'condition-3'}>
                                      <SelectorWithLabel
                                        title=""
                                        options={this.state.thick_liquid_food}
                                        getSelect={this.setThickLiquidFood.bind(this, 'thick_liquid_food_id')}
                                        departmentEditCode={this.state.thick_liquid_food_id}
                                      />
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                        <div className={'table-area'}>
                          <table>
                            <tr>
                              <th></th>
                              <th>摂取方法</th>
                              <th>本数(朝)</th>
                              <th>本数(昼)</th>
                              <th>本数(夕)</th>
                            </tr>
                            <tr>
                              <td><button className="clear-btn-2" onClick={this.confrimClear.bind(this, 'thick_liquid_food')}>C</button></td>
                              <td>
                                <div className={'condition-1'}>
                                  <SelectorWithLabel
                                    title=""
                                    options={this.state.ingestion_method}
                                    getSelect={this.setThickLiquidFood.bind(this, 'ingestion_method_id')}
                                    departmentEditCode={this.state.ingestion_method_id}
                                    isDisabled={this.state.thick_liquid_food_id === 0}
                                  />
                                </div>
                              </td>
                              <td>
                                <SelectorWithLabel
                                  title=""
                                  options={this.state.thick_liquid_food_morning}
                                  getSelect={this.setThickLiquidFood.bind(this, 'thick_liquid_food_number_id_morning')}
                                  departmentEditCode={this.state.thick_liquid_food_number_id_morning}
                                  isDisabled={this.state.thick_liquid_food_id === 0}
                                />
                              </td>
                              <td>
                                <SelectorWithLabel
                                  title=""
                                  options={this.state.thick_liquid_food_noon}
                                  getSelect={this.setThickLiquidFood.bind(this, 'thick_liquid_food_number_id_noon')}
                                  departmentEditCode={this.state.thick_liquid_food_number_id_noon}
                                  isDisabled={this.state.thick_liquid_food_id === 0}
                                />
                              </td>
                              <td>
                                <SelectorWithLabel
                                  title=""
                                  options={this.state.thick_liquid_food_evening}
                                  getSelect={this.setThickLiquidFood.bind(this, 'thick_liquid_food_number_id_evening')}
                                  departmentEditCode={this.state.thick_liquid_food_number_id_evening}
                                  isDisabled={this.state.thick_liquid_food_id === 0}
                                />
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                      {/*<div className={'info-title'} style={{paddingTop:"1rem"}}>【ミルク食情報】</div>
                                  <div className="div-flex  thick-liquid-food">
                                    <button className="clear-btn-2">C</button>
                                    <div className={'table-area'}>
                                      <table>
                                        <tr>
                                          <th></th>
                                          <th>ミルク名</th>
                                          <th>一回量(ml)</th>
                                          <th>調乳量(ml)</th>
                                          <th>回数(回)</th>
                                        </tr>
                                        <tr>
                                          <td><button className="clear-btn-2">C</button></td>
                                          <td>
                                            <SelectorWithLabel
                                              title=""
                                              options={this.state.milk_master}
                                              getSelect={this.setMilk.bind(this, 'milk_id')}
                                              departmentEditCode={this.state.milk_id}
                                            />
                                          </td>
                                          <td>
                                            <SelectorWithLabel
                                              title=""
                                              options={this.state.milk_amount}
                                              getSelect={this.setMilk.bind(this, 'milk_amount_id')}
                                              departmentEditCode={this.state.milk_amount_id}
                                            />
                                          </td>
                                          <td>
                                            <SelectorWithLabel
                                              title=""
                                              options={this.state.milk_amount}
                                              getSelect={this.setMilk.bind(this, 'adjustment_amount')}
                                              departmentEditCode={this.state.adjustment_amount}
                                            />
                                          </td>
                                          <td>
                                            <SelectorWithLabel
                                              title=""
                                              options={this.state.meal_number_master}
                                              getSelect={this.setMilk.bind(this, 'milk_number_of_times_id_noon')}
                                              departmentEditCode={this.state.milk_number_of_times_id_noon}
                                            />
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </div>*/}
                    </div>
                    <div className="right-col">
                      <div className={'info-title'}>【栄餋量】</div>
                      <div style={{width:"80%", marginBottom:"1rem"}}>
                        {this.state.nutritional_data.length > 0 && (
                          this.state.nutritional_data.map((item)=>{
                            return(
                              <>
                                <div className="div-flex">
                                  <div className="food-prop-name" style={{width:"60%"}}>{item.name}</div>
                                  <div className="food-prop-amount" style={{width:"25%"}}>{item.value}</div>
                                  <div className="food-prop-unit" style={{width:"15%"}}>{item.unit}</div>
                                </div>
                              </>
                            )
                          })
                        )}
                      </div>
                      <div className={'info-title'}>【プロファイル情報】</div>
                      <div className="div-flex">
                        <div className="amount-title">身長</div>
                        <div className="amount-tall">{this.state.weight_height != null && this.state.weight_height.height != null && this.state.weight_height.height != "" ? this.state.weight_height.height : ""}</div>
                        <div className={'amount-unit'}>㎝</div>
                      </div>
                      <div className="div-flex" style={{marginTop:"-1px"}}>
                        <div className="amount-title">体重</div>
                        <div className="amount-tall">{this.state.weight_height != null && this.state.weight_height.weight != null && this.state.weight_height.weight != "" ? this.state.weight_height.weight : ""}</div>
                        <div className={'amount-unit'}>㎏</div>
                      </div>
                      <div className="div-flex" style={{marginBottom:"0.3rem", marginTop:"-1px"}}>
                        <div className="amount-title">測定日</div>
                        <div className="amount-date">{this.state.weight_height != null && this.state.weight_height.measure_date != null && this.state.weight_height.measure_date != "" ? this.state.weight_height.measure_date : ""}</div>
                      </div>
                      <div className={'info-title'}>【食物アレルギー】</div>
                      {this.state.allergy_data.length > 0 && (
                        <div className="allergy-area">
                          {this.state.allergy_data.map(allergy=>{
                            return (
                              <>
                                <div>{allergy.name}</div>
                              </>
                            )
                          })
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className={'cancel-btn'} onClick={this.handleCloseModal}>キャンセル</Button>
            <Button className={this.change_flag == 1 ? 'red-btn' : 'disable-btn'} onClick={this.confirmSave}>確定</Button>
          </Modal.Footer>
          {this.state.isOpenSelectDiseaseModal && (
            <SelectMedicineModal
              closeModal = {this.closeModal}
              system_patient_id={this.props.patientId}
              selectDiseaseName={this.selectDiseaseName}
            />
          )}
          {this.state.isAddDiseaseNameModal && (
            <DiseaseNameModal
              closeModal = {this.closeModal}
              patientId={this.props.patientId}
            />
          )}
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm={this.closeModal.bind(this)}
              confirmCancel={this.closeModal.bind(this)}
              confirmOk={this.confirmOk.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.alert_message !== "" && (
            <ValidateAlertModal
              handleOk={this.closeValidateAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
          {this.state.notice_message !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.notice_message}
              title={'期間重複'}
            />
          )}
          <UssageMenu
            {...this.state.ussageMenu}
            parent={this}
          />
          <HoverFirstMenu
            {...this.state.HoverFirstMenu}
            parent={this}            
            menu_data={this.state.first_menu_data}
          />
          <HoverSecondMenu
            {...this.state.HoverSecondMenu}
            parent={this}            
            menu_data={this.state.second_menu_data}
          />
        </Modal>
      </>
    );
  }
}

ChangeMealModal.contextType = Context;
ChangeMealModal.propTypes = {
  patientId: PropTypes.number,
  modalData: PropTypes.object,
  patientInfo: PropTypes.object,
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  discharge_date: PropTypes.string,
  cache_index:PropTypes.number,
  from_mode: PropTypes.string,
};

export default ChangeMealModal;
