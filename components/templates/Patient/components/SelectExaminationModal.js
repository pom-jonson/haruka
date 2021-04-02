import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import ExamRadioButton from "../../..//molecules/ExamRadioButton";
import * as colors from "~/components/_nano/colors";
import styled from "styled-components";
import ExamCategoryNav from "../../../organisms/ExamCategoryNav";
import $ from "jquery";
import ExamCheckbox from "../../../molecules/ExamCheckbox";
import Checkbox from "../../../molecules/Checkbox";
import SelectExaminationSetModal from "./SelectExaminationSetModal";
import Button from "../../../atoms/Button";
import Context from "~/helpers/configureStore";
import Spinner from "react-bootstrap/Spinner";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import SelectExaminationItemModal from "../Modals/Common/SelectExaminationItemModal";
import axios from "axios";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES, CACHE_SESSIONNAMES, KARTEMODE, EXAMINATION_TYPE} from "~/helpers/constants";
import {formatDateLine} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import { harukaValidate } from "~/helpers/haruka_validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import ExaminationEditModal from "~/components/templates/Patient/Modals/Common/ExaminationEditModal"
import {removeRedBorder, setDateColorClassName} from '~/helpers/dialConstants';
import Radiobox from "~/components/molecules/Radiobox";
import SelectMedicineModal from "~/components/templates/Patient/Modals/Common/SelectMedicineModal";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import * as sessApi from "~/helpers/cacheSession-utils";
registerLocale("ja", ja);
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import AdministratePeriodInputExaminationModal from "~/components/molecules/AdministratePeriodInputExaminationModal";

const ExamRowElement = styled.div`
  font-size: 18px;
  border: 1px solid #888;     
  margin: 0 3px;
  width: 32%;
  margin-top: 2px;
  margin-bottom: 2px;
  border-radius: 5px;
  float: left;
  label{
    margin-bottom: 0px;
    margin-right: 0px;
    text-align: center;
    display: block;
    line-height: 2;
    border-radius: 5px;
    input{
      display: none;
    }
  }  
  .checked{
    background:rgb(207, 226, 243);
  }
`;

// const TodayResult = styled.div`
//   label{
//     width: 130px;
//   }
//   input{
//     width: 1.25rem !important;
//     height: 1.25rem !important;
//   }
// `;

const TodayResultAnother = styled.div`
  height: 2rem;
  display: flex;
  label{
    width: 1rem;
    line-height: 2rem;
    vertical-align: middle;
    margin-bottom: 0px;
  }
  input{
    width: 1.25rem !important;
    height: 1.25rem !important;
  }
`;

const TodayOtherResult = styled.div`
  label{
    width: auto;
    line-height: unset;
    float: left;
  }
  input{    
    width: 1.25rem !important;
    height: 1.25rem !important;
  }
  p{
    line-height: 25px;
    margin-bottom: 0px;
  }
`;

const TodayOtherResultAnother = styled.div`
  display: flex;
  label{
    width: 1rem !important;
    line-height: 2rem;
    float: left;
    height: 2rem;
    vertical-align: middle;
    margin-bottom: 0px;
  }
  .label-important{
    width: 3rem !important;
  }
  input{    
    width: 1.25rem !important;
    height: 1.25rem !important;
  }
  p{
    line-height: 25px;
    margin-bottom: 0px;
  }
`;

const Cytology = styled.div`
  display: flex;
  width: 100%;
  margin-top: 0.5rem;
  .label-title {
    line-height: 30px;
    text-align: right;
    margin-right: 0.5rem;
    margin-top: 0;
  }
  .woman-area {
    width: 27%;
    padding: 0.25rem;
    input {
      width: 8rem;
    }
    .label-title {
      width: 4.5rem;
    }
  }
  .clinical-diagnosis {
    width: 33%;
    margin-left: 0.5%;
    padding: 0.25rem;
    textarea {
      width: 100%;
    }
    .label-title {
      width: 12rem;
    }
  }
  .anticancer-area {
    width: 39%;
    padding: 0.25rem;
    margin-left: 0.5%;
    .check-area{
      input {
        height: 15px !important;
      }
    }
    .label-title {
      width: 7rem;
    }
    .full-width-input, .hankaku-eng-num-input{
      width: calc(100% - 7rem);
    }
  }
  .full-width-input {
    ime-mode: active;
    input {
      ime-mode: active
    }
    textarea {
      ime-mode: active;
    }
  }
  .hankaku-eng-num-input {
    ime-mode: inactive;
    input {
      ime-mode: inactive;
    }
    textarea {
      ime-mode: inactive;
    }
  }
  .
`;

const InputBox = styled.div`
  display: flex;
  margin-left: 24px;
  float: left;
  label {
    color: ${colors.onSecondaryDark};
    font-size: 1rem !important;
    line-height: 38px;
    letter-spacing: 0.4px;
    margin-right: 8px;
  }
  input {
    border-radius: 4px;
    border: solid 1px #ced4da;
    background: ${colors.surface};
    color: ${colors.onSecondaryDark};
    font-size: 12px;
    padding: 0 8px;
    width: 120px;
    height: 38px;
  }
  input::-ms-clear {
    visibility: hidden;
  }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenuUl = styled.ul`
  margin-bottom: 0px;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;    
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
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
`;

const ContextMenu = ({
  selected_index,
  modal_type,
  exam_info,
  visible,
  x,
  y,
  parent,
}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
        {selected_index != undefined ? (
          <>
            {selected_index != "medicine" ? (
              <>
                <li onClick={() => parent.contextMenuAction("instruction_add", selected_index)}><div>追加</div></li>
                <li onClick={() => parent.contextMenuAction("instruction_delete", selected_index)}><div>削除</div></li>
                {modal_type == "検体検査" && exam_info != undefined && exam_info != null && exam_info.is_attention != 1 && (
                  <><li onClick={() => parent.contextMenuAction("instruction_attention_add", selected_index)}><div>注目</div></li></>
                )}
                {modal_type == "検体検査" && exam_info != undefined && exam_info != null && exam_info.is_attention == 1 && (
                  <><li style={{color:"blue"}} onClick={() => parent.contextMenuAction("instruction_attention_delete", selected_index)}><div>注目</div></li></>
                )}
              </>
            ):(
              <li onClick={() => parent.contextMenuAction('disease_insert')}><div>病名引用</div></li>
            )}
          </>
        ):(
          <li onClick={() => parent.contextMenuAction("insurance_edit")}><div>保険変更</div></li>
        )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextAttentionMenu = ({
  selected_index,
  visible,
  exam_info,
  x,
  y,
  parent,
}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
        {exam_info != undefined && exam_info != null && exam_info.is_attention != 1 ? (
          <>           
            <li onClick={() => parent.contextMenuAction("attention_add", selected_index)}><div>注目</div></li>            
          </>
        ):(
          <>                       
            <li style={{color:"blue"}} onClick={() => parent.contextMenuAction("attention_delete", selected_index)}><div>注目</div></li>              
          </>
        )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

export class SelectExaminationModal extends Component {
  constructor(props) {
    super(props);
    let patientInfo = karteApi.getPatient(this.props.patientId);
    let examination_type = this.props.examination_type != undefined ? this.props.examination_type : 1;
    let modalName = this.props.modalName != undefined ? this.props.modalName : "検体検査";
    let cache = null;
    if (examination_type == EXAMINATION_TYPE.EXAMINATION) {
      cache = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_EDIT);
    } else if(examination_type == EXAMINATION_TYPE.CYTOLOGY) {
      cache = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT);
    } else if(examination_type == EXAMINATION_TYPE.PATHOLOGY) {
      cache = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT);
    } else if(examination_type == EXAMINATION_TYPE.BACTERIAL) {
      cache = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT);
    }
    if (cache != null) {
      if (cache.modalName != undefined && cache.modalName != null) modalName = cache.modalName;
      if (cache.examination_type != undefined && cache.examination_type != null) examination_type = cache.examination_type;
    }

    let free_instruction = [
      {text:"", urgent: 0},
      {text:"", urgent: 0},
    ];
    // YJ461 検体検査で、検査項目を目立たせられるように
    if (modalName == "検体検査") {
      free_instruction = [
        {text:"", urgent: 0, is_attention: 1},
        {text:"", urgent: 0, is_attention: 1},
      ];
    }

    // YJ482 検体検査の注目マークの文字に何を使うかは動的にする
    let examination_attention_mark = "";
    this.examination_free_instruction_is_enabled = "OFF";
    if (modalName == "検体検査") {
      let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
      if(initState !== undefined && initState != null && initState.conf_data !== undefined){
        if(initState.conf_data.examination_attention_mark !== undefined && initState.conf_data.examination_attention_mark != ""){
          examination_attention_mark = initState.conf_data.examination_attention_mark;
        }
        if(initState.conf_data.examination_free_instruction_is_enabled !== undefined && initState.conf_data.examination_free_instruction_is_enabled != ""){
          this.examination_free_instruction_is_enabled = initState.conf_data.examination_free_instruction_is_enabled;
        }
      }
    }
    this.state = {
      tab: 0, // select examination tab
      exam_tab: 0, // select order tab
      usageSelectIndex: -1,
      examination_attention_mark,
      tabs: [],
      isDeleteConfirmModal: false,
      isOpenShemaModal: false,
      isClearConfirmModal: false,
      isUpdateConfirmModal: false,
      isOpenAlertOpen: false,
      confirm_message:'',
      imgBase64: "",
      image_path: "",
      alert_messages:'',
      exam_tabs:[],
      is_loaded: false,
      sel_exams: [],
      collected_date: new Date(),
      collected_time: "",
      todayResult: 0,
      order_comment_urgent: 0,
      fax_report: 0,
      insurance_type: patientInfo != null && patientInfo != undefined && patientInfo.insurance_type != undefined && patientInfo.insurance_type != null ? patientInfo.insurance_type : 0,
      order_comment: "",
      free_comment: "",
      _cur_tab_name: "",
      _cur_category_name: "",
      _sel_category: 0,
      _sel_tab: 0,
      _sel_order_list: [],
      _exam_category_list: [],
      _exam_tab_list: [],
      _exam_order_list: [],
      _exam_item_list: [],
      _exam_preset_list: [],
      _exam_preset_order_list: [],
      examinationData:[],
      datefocus: false,
      can_insurance_edit: false,
      isExaminationSetPopupOpen: false,
      not_yet: false,
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
      },
      selected_exam_names:[],
      number:0,
      is_done:0,
      isSelectedDeleteConfirmModal:false,
      alert_message:'',
      free_instruction:free_instruction,
      karte_status: 0,
      examination_type,
      modalName,
      confirm_title: '',
      menstruation_date: '',
      menstruation_period: '',
      clinical_diagnosis: '',
      previous_histology: '',
      done_instruction: '',
      recheck_array : [
        {date: '', number: ''},
        {date: '', number: ''},
        {date: '', number: ''},
        {date: '', number: ''},
        {date: '', number: ''}
      ],
      isOpenSelectDiseaseModal: false,
      isAdministratePeriodModalOpen:false,
      administrate_period: null,
    };
    this.change_flag = 0;
    this.radio_option1=["無し","使用中", "使用後"];
    this.radio_option2=["無し","治療中", "治療後"];
    this.cache = cache;
  }

  async componentDidMount() {

    // 検体検査DB操作
    /*-------------response data ------------
    categories:[],
    tabs:[],
    exam_items:[],
    preset:[],
    preset_items:[]
    -----------------------------------------*/
    const { data } = await axios.post("/app/api/v2/master/getExaminationData", {
      params: {
        examination_type: this.state.examination_type
      }
    });
    let examinationData = data;
    let _exam_category_list = [];
    let _exam_order_list = [];
    let _sel_category = 0;
    let karte_status = this.context.karte_status.code == 0 ? 1 : this.context.karte_status.code == 1 ? 3 : 2;
    // 検体検査カテゴリマスタ
    if (data.categories.length > 0) {
      data.categories.map((category_item) =>{
        let item = {
          id: parseInt(category_item.outsourcing_inspection_category_id),
          name: category_item.name
        };
        _exam_category_list.push(item);
      });
    }
    let _cur_category_name = "";
    if (_exam_category_list.length > 0)
      _sel_category = _exam_category_list[0].id;
      _cur_category_name = _exam_category_list[0].name;

    let _exam_tab_list = [];
    let _cur_tab_name = "";
    let _sel_tab = 0;

    // 検体検査タブマスタ
    if (data.tabs.length > 0) {
      data.tabs.map((tab_item) =>{
        let item = {
          id: tab_item.outsourcing_inspection_tab_id,
          name: tab_item.name
        };
        if (data.exam_items[_sel_category] != undefined && data.exam_items[_sel_category] != null && data.exam_items[_sel_category][tab_item.outsourcing_inspection_tab_id] != undefined) _exam_tab_list.push(item);
      });
    }

    if (_exam_tab_list.length > 0 && _exam_tab_list[0] != undefined && _exam_tab_list[0] != null) {      
      _cur_tab_name = _exam_tab_list[0].name;
      _sel_tab = parseInt(_exam_tab_list[0].id);
    }

    if (examinationData.exam_items[_sel_category] != undefined && examinationData.exam_items[_sel_category] != null) {
      _exam_order_list = examinationData.exam_items[_sel_category][_sel_tab];
    }

    let _exam_preset_list = [];
    let _exam_preset_order_list = [];

    // 検査セット
    // Object.keys(data.preset).map((id) =>{
    //   let item = {
    //     id: parseInt(id),
    //     name: data.preset[id]
    //   };
    //   _exam_preset_list.push(item);

    // });
    data.preset.map(sub => {
      var item = {
        id:parseInt(sub.outsourcing_inspection_set_id),
        name:sub.name,
      }
        _exam_preset_list.push(item);
    })
    
    _exam_preset_order_list = examinationData.preset_items[_exam_preset_list[0].id];

    // キャッシュ操作
    let cache = this.cache;
    if (this.props.cache_data != undefined && this.props.cache_data != null) cache = JSON.parse(JSON.stringify(this.props.cache_data));
    let exam_tabs = [];
    let karte_mode = this.context.$getKarteMode(this.props.patientId);
    if (karte_mode == KARTEMODE.EXECUTE) {
      exam_tabs = [
        {id: 1, name: "依頼受付済み"},
        {id: 3, name: "採取済み"},
        // {id: 0, name: "未採取"},
      ];
    } else if (karte_mode == KARTEMODE.WRITE) {
      exam_tabs = [
        // {id: 1, name: "依頼受付済み"},
        {id: 3, name: "採取済み"},
        {id: 0, name: "未採取"},
      ];
    }
    let exam_tab  = karte_mode == KARTEMODE.EXECUTE ? 2 : 0;
    let sel_exams  = [];
    let collected_date = this.state.collected_date;
    let collected_time = "";
    let free_comment = "";
    let order_comment = "";
    let insurance_type = this.state.insurance_type;
    let todayResult = 0;
    let order_comment_urgent = 0;
    let fax_report = 0;
    let not_yet = this.state.not_yet;
    let done_state = 0;
    let number = 0;
    let is_done = 0;
    let free_instruction = this.state.free_instruction;
    let subject = '';
    if(cache != null) {
      number = cache.number;
      is_done = cache.is_done;
      exam_tab = cache.done_order;
      karte_status = cache.karte_status;
      if(is_done == 1){
          exam_tab = 1;
          if (karte_mode == KARTEMODE.WRITE)
          exam_tabs = [
          {id: 1, name: "依頼受付済み"},
          {id: 3, name: "採取済み"},
          {id: 0, name: "未採取"},
        ];
      }
      todayResult = cache.todayResult == 1 ? 1 : 0;
      order_comment_urgent = cache.order_comment_urgent == 1 ? 1 : 0;
      fax_report = cache.fax_report == 1 ? 1 : 0;
      // exam_tab = cache.is_completed == undefined ? 0 : cache.is_completed;
      done_state = cache.is_completed !== undefined && cache.is_completed == 1 ? 1 : 0;
      sel_exams =  cache.examinations == undefined ? [] : cache.examinations;
      collected_date = cache.collected_date === "日未定" ? "" : new Date(cache.collected_date);
      not_yet = cache.collected_date === "日未定" ? true : false;
      collected_time = cache.collected_time;
      if (cache.free_instruction != undefined && cache.free_instruction.length > 0){
        free_instruction = cache.free_instruction;
        free_instruction.push({text:'', urgent:0});
      }
        
      if (cache.collected_time !== "") {
        var d = new Date(),
            s = cache.collected_time,
            ss = s. replace(":","."),
            parts = ss.match(/(\d+)\.(\d+)/),
            hours = parseInt(parts[1], 10),
            minutes = parseInt(parts[2], 10);

        d.setHours(hours);
        d.setMinutes(minutes);
        collected_time = d;
      }

      free_comment = cache.free_comment;
      order_comment = cache.order_comment;
      insurance_type = cache.insurance_type;
      if (cache.subject != undefined && cache.subject != '') subject = cache.subject;
    }

    // 項目名称リストのデータ選択状態をを_exam_order_listに反映
    _exam_order_list.map(item=>{
      sel_exams.map(exam=>{
        if(item.examination_code == exam.examination_code) {
          item.is_selected = true;
        }
      });
    });

    //加算項目-----------------------------------------------
    let additions_check = {};
    let additions_send_flag_check = {};
    let additions = [];
    let addition_order_number = null;
    if (cache != null && cache.addition_order_number != undefined)
      addition_order_number = cache.addition_order_number;
    if (data.additions !== undefined && data.additions!= null){
        additions = data.additions;
        additions.map(addition=> {
            if (cache != null && cache.additions != undefined && cache.additions[addition.addition_id] != undefined){
                additions_check[addition.addition_id] = true;
                let sending_flag = cache.additions[addition.addition_id]['sending_flag'];
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

    // 患者のその日の検体検査オーダー
    var today_data = sel_exams;
    let rec_data = [];
    let post_data = {
      number: number,
      patient_id: this.props.patientId
    };
    await apiClient.post("/app/api/v2/order/examination/search", {params: post_data}).then(res => {
      rec_data = res.original;
    });

    // get unique array
    // var names = ["Mike","Matt","Nancy","Adam","Jenny","Nancy","Carl"];
    var unique_exam_array = [];
    $.each(rec_data, function(i, el){
        if($.inArray(el, unique_exam_array) === -1) unique_exam_array.push(el);
    });

    this.m_unique_exam_array = unique_exam_array;
    let {examination_type, modalName} = this.state;
    if (cache != null) {
      if (cache.modalName != undefined && cache.modalName != null) modalName = cache.modalName;
      if (cache.examination_type != undefined && cache.examination_type != null) examination_type = cache.examination_type;
    }
    let _state = {
      tab: 0,
      exam_tab,
      exam_tabs,
      number,
      is_done,
      examinationData,
      _exam_category_list,
      _exam_tab_list,
      _cur_tab_name,
      _cur_category_name,
      _sel_tab,
      _sel_category,
      _exam_order_list,
      _exam_preset_list,
      _exam_preset_order_list,
      todayResult,
      order_comment_urgent,
      fax_report,
      is_loaded: true,
      sel_exams,
      collected_date,
      collected_time,
      not_yet,
      free_comment,
      order_comment,
      insurance_type,
      done_state,
      additions,
      additions_check,
      additions_send_flag_check,
      addition_order_number,
      today_data,
      free_instruction,
      karte_status,
      examination_type,
      modalName,
      subject,
      administrate_period: cache != null && cache.administrate_period != undefined && cache.administrate_period != null ? cache.administrate_period : null,
  
    };
    let imgBase64 = "";
    let image_path = "";
    if (this.state.examination_type == EXAMINATION_TYPE.CYTOLOGY) {
      _state.imgBase64 = imgBase64;
      _state.image_path = image_path;
      if (cache != null) {
        _state.imgBase64 = cache.imgBase64;
        if (cache.image_path != null && cache.image_path != undefined && cache.image_path != "") {
          _state.image_path = cache.image_path;
        }
        let cache_tmp = cache;
        if (cache_tmp['imgBase64'] == null || cache_tmp['imgBase64'] == undefined || cache_tmp['imgBase64'] == "") {
          if (cache_tmp['image_path'] != null && cache_tmp['image_path'] != undefined && cache_tmp['image_path'] != "") {
            const { data } = await axios.post("/app/api/v2/order/examination/getImage", {
              params: {
                number: cache_tmp['number']
              }
            });
            _state.imgBase64 = data;
          }
        }
      }
  
      if (cache != null) {
        let recheck_array = cache.recheck_array;
        recheck_array.map(item => {
          if (item.date != '') {
            item.date = new Date(item.date);
          }
        });
        _state.recheck_array = recheck_array;
      } else {
        _state.recheck_array = this.state.recheck_array;
      }
      if (cache != null) {
        _state.menstruation_date = cache.menstruation_date != undefined && cache.menstruation_date != '' ? new Date(cache.menstruation_date) : '';
        _state.menstruation_period = cache.menstruation_period;
        _state.menopause = cache.menopause;
        _state.pregnancy = cache.pregnancy;
        _state.production = cache.production;
    
        _state.clinical_diagnosis = cache.clinical_diagnosis;
        _state.previous_histology = cache.previous_histology;
        _state.done_instruction = cache.done_instruction;
    
        _state.recheck = cache.recheck;
        _state.before_class = cache.before_class;
    
        _state.anticancer_use = cache.anticancer_use;
        _state.radiation_treat = cache.radiation_treat;
        _state.hormon_use = cache.hormon_use;
        _state.anticancer_kind = cache.anticancer_kind;
        _state.anticancer_amount = cache.anticancer_amount;
      }
    }

    this.setState(_state);

    var variable_area = document.getElementsByClassName('variable-area')[0];
    var tbody_area = document.getElementsByClassName('select_instruction_items_tbody')[0];
    let html_obj = document.getElementsByTagName("html")[0];
    let width = html_obj.offsetWidth;
    if(parseInt(width) < 1367){
      variable_area.style['height'] = '52%';
      if (tbody_area != undefined)
        tbody_area.style['height'] = 'calc(100% - 2rem)';
      if (examination_type == EXAMINATION_TYPE.CYTOLOGY) variable_area.style['height'] = '48%';
      if (examination_type == EXAMINATION_TYPE.EXAMINATION) variable_area.style['height'] = '72%';
    } else if(parseInt(width) < 1441){
      variable_area.style['height'] = '52%';
      if (examination_type == EXAMINATION_TYPE.CYTOLOGY) variable_area.style['height'] = '48%';
      if (examination_type == EXAMINATION_TYPE.EXAMINATION) variable_area.style['height'] = '76%';
    } else if(parseInt(width) < 1601){
      variable_area.style['height'] = '58%';
      if (examination_type == EXAMINATION_TYPE.CYTOLOGY) variable_area.style['height'] = '53%';
      if (examination_type == EXAMINATION_TYPE.EXAMINATION) variable_area.style['height'] = '76%';
    } else if(parseInt(width) < 1681){
      variable_area.style['height'] = '64%';
      if (examination_type == EXAMINATION_TYPE.CYTOLOGY) variable_area.style['height'] = '60%';
      if (examination_type == EXAMINATION_TYPE.EXAMINATION) variable_area.style['height'] = '78%';
    } else if(parseInt(width) > 1919){
      variable_area.style['height'] = '68%';
      if (examination_type == EXAMINATION_TYPE.CYTOLOGY) variable_area.style['height'] = '65%';
      if (examination_type == EXAMINATION_TYPE.EXAMINATION) variable_area.style['height'] = '77%';
    }

    $(document).ready(function(){
      $(window).resize(function(){
        let html_obj = document.getElementsByTagName("html")[0];
        let width = html_obj.offsetWidth;
        if(parseInt(width) < 1367){
          if(tbody_area != undefined) tbody_area.style['height'] = 'calc(100% - 2rem)';
          variable_area.style['height'] = '52%';
          if (examination_type == EXAMINATION_TYPE.CYTOLOGY) variable_area.style['height'] = '48%';
          if (examination_type == EXAMINATION_TYPE.EXAMINATION) variable_area.style['height'] = '72%';
        } else if(parseInt(width) < 1441){
          variable_area.style['height'] = '52%';
          if (examination_type == EXAMINATION_TYPE.CYTOLOGY) variable_area.style['height'] = '48%';
          if (examination_type == EXAMINATION_TYPE.EXAMINATION) variable_area.style['height'] = '76%';
        } else if(parseInt(width) < 1601){
          variable_area.style['height'] = '58%';
          if (examination_type == EXAMINATION_TYPE.CYTOLOGY) variable_area.style['height'] = '53%';
          if (examination_type == EXAMINATION_TYPE.EXAMINATION) variable_area.style['height'] = '76%';
        } else if(parseInt(width) < 1681){
          variable_area.style['height'] = '64%';
          if (examination_type == EXAMINATION_TYPE.CYTOLOGY) variable_area.style['height'] = '60%';
          if (examination_type == EXAMINATION_TYPE.EXAMINATION) variable_area.style['height'] = '78%';
        } else if(parseInt(width) > 1919){
          if (tbody_area != undefined) tbody_area.style['height'] = 'calc(100% - 1.4rem)';
          variable_area.style['height'] = '68%';
          if (examination_type == EXAMINATION_TYPE.CYTOLOGY) variable_area.style['height'] = '65%';
          if (examination_type == EXAMINATION_TYPE.EXAMINATION) variable_area.style['height'] = '77%';
        }
      });
    });
  }

  selectUsageKind = e => {
    this.setState({ tab: parseInt(e.target.id), usageSelectIndex: -1 });
    // this.getShowDoctorList(e.target.id);
    if (
      document.getElementById("prescription_dlg") !== undefined &&
      document.getElementById("prescription_dlg") !== null
    ) {
      document.getElementById("prescription_dlg").focus();
    }
  };

  selectTab = e => {
    let _cur_tab_name = "";
    let old_tab_id = null;
    this.state._exam_tab_list.map(item=>{
      if (item.id == e.target.id) {
        _cur_tab_name = item.name;
      }
      if (item.id == this.state._sel_tab) {
        old_tab_id = item.id;
      }
    });
    let old_tab_data = this.state.examinationData.tabs.find(x=>x.outsourcing_inspection_tab_id == old_tab_id);
    if (old_tab_data != null && old_tab_data.require_mode == 2) {
      let filtered_exam_order_list = this.state._exam_order_list.filter(x=>x.is_selected == 1);
      if (this.state.examination_type != 1 && filtered_exam_order_list.length == 0) {
        this.setState({
          showTitle: true,
          isOpenAlertOpen: true,
          alert_messages: "項目を1件以上選択してください",
          alert_messages_title: "エラー"
        });
        return;
      }
    }
    

    let define_master = this.state.examinationData.define_master;
    let _exam_order_list = this.state.examinationData.exam_items[this.state._sel_category][e.target.id];
    let sel_exams = this.state.sel_exams;
    _exam_order_list.map(item=>{
      item.is_selected = 0;
      let find_define_data = define_master.find(x=>x.code == item.examination_code);
      if (find_define_data != undefined && (find_define_data.default_selected == 1 || find_define_data.default_selected == 2)) {
        item.is_selected = 1;
        if (this.state.examination_type != EXAMINATION_TYPE.EXAMINATION && find_define_data.default_selected == 2) {
          item.not_chagne = true;
          item.background = "yellow";
        }
        if (!(sel_exams.length > 0 && sel_exams.findIndex(x=>x.examination_code == item.examination_code) > -1))
        sel_exams.push(item);
      }
      sel_exams.map(sel_item=>{
        if (sel_item.examination_code == item.examination_code) {
          item.is_selected = 1;
        }
      });
    });
    

    this.change_flag = 1;
    this.setState({
      _sel_tab: parseInt(e.target.id),
      _cur_tab_name,
      _exam_order_list,
      sel_exams
    });

    if (document.getElementById("prescription_dlg") !== undefined && document.getElementById("prescription_dlg") !== null) {
      document.getElementById("prescription_dlg").focus();
    }
  };
  
  selectRadio = () => {
    let _exam_order_list = this.state._exam_order_list;
    let sel_exams = this.state.sel_exams;
    _exam_order_list.map(item=>{
      item.is_selected = 0;
      sel_exams.map(sel_item=>{
        if (sel_item.examination_code == item.examination_code) {
          item.is_selected = 1;
        }
      });
    });
  }

  selectCategory = id => {
    let _exam_order_list = [];
    let new_exam_tab_list = [];
    let new_category_data = this.state.examinationData.categories.find(x=>x.outsourcing_inspection_category_id == id);
    let _cur_category_name = new_category_data.name;
    let old_category_data = this.state.examinationData.categories.find(x=>x.outsourcing_inspection_category_id == this.state._sel_category);
    let define_master = this.state.examinationData.define_master;
    if (this.state.examinationData.exam_items[id] != null && this.state.examinationData.exam_items[id] != undefined) {
      this.state.examinationData.tabs.map(tab_item => {
        let tab_id = tab_item.outsourcing_inspection_tab_id;
        if (this.state.examinationData.exam_items[id][tab_id] != undefined && this.state.examinationData.exam_items[id][tab_id] != null)
          new_exam_tab_list.push({id:tab_id, name:tab_item.name});
      })

      if (new_exam_tab_list.length>0 && this.state.examinationData.exam_items[id][new_exam_tab_list[0].id] != null && this.state.examinationData.exam_items[id][new_exam_tab_list[0].id] != undefined) {
        _exam_order_list = this.state.examinationData.exam_items[id][new_exam_tab_list[0].id];
      }
    }

    let sel_exams = this.state.sel_exams;
    if (this.state.examination_type != 1 && sel_exams.length > 0 &&
      ((new_category_data != undefined && new_category_data.single_category == 1) || (old_category_data != undefined && old_category_data.single_category == 1))) {
      let _exist = false;
      if (define_master != undefined && define_master.length > 0) {
        sel_exams.map(sel_item=>{
          define_master.map(define_item=>{
            if (define_item.code == sel_item.examination_code) {
              if (define_item.outsourcing_inspection_category_id == new_category_data.outsourcing_inspection_category_id ||
                define_item.outsourcing_inspection_category_id == old_category_data.outsourcing_inspection_category_id) {
                _exist = true;
              }
            }
          });
        });
      }
      if (_exist) {
        let base_modal = document.getElementsByClassName("prescript-medicine-select-modal")[0];
        if(base_modal !== undefined && base_modal != null){
          base_modal.style['z-index'] = 1040;
        }
        this.setState({
          confirm_title: "切替確認",
          confirm_message:"このカテゴリは他のカテゴリと同時に登録できません。"+"\n"+"全削除して切り替えますか？",
          isSelectedDeleteConfirmModal:true,
          delete_type: "all",
          confirm_type: "category_change",
          tmp_exam_tab_list:new_exam_tab_list,
          tmp_sel_category: id,
          tmp_sel_tab: new_exam_tab_list.length>0? new_exam_tab_list[0].id:undefined,
          tmp_cur_tab_name: new_exam_tab_list.length>0? new_exam_tab_list[0].name:undefined,
          tmp_exam_order_list: _exam_order_list,
          tmp_sel_exams:sel_exams
        });
        return;
      }
    }
    let filtered_exam_order_list = this.state._exam_order_list.filter(x=>x.is_selected == 1);
    if (this.state.examination_type != EXAMINATION_TYPE.EXAMINATION && filtered_exam_order_list.length == 0 && old_category_data.require_mode == 2) {
      this.setState({
        showTitle: true,
        isOpenAlertOpen: true,
        alert_messages: "項目を1件以上選択してください",
        alert_messages_title: "エラー"
      });
      return;
    }
    
    _exam_order_list.map(item=>{
      item.is_selected = 0;
      let find_define_data = define_master.find(x=>x.code == item.examination_code);
      if (find_define_data != undefined && find_define_data.default_selected == 1) {
        item.is_selected = 1;
        if (!(sel_exams.length > 0 && sel_exams.findIndex(x=>x.examination_code == item.examination_code) > -1))
        sel_exams.push(item);
      }
      sel_exams.map(sel_item=>{
        if (sel_item.examination_code == item.examination_code) {
          item.is_selected = 1;
        }
      });
    });

    this.change_flag = 1;
    this.setState({
      _exam_tab_list:new_exam_tab_list,
      _sel_category: id,
      _cur_category_name,
      _sel_tab: new_exam_tab_list.length>0? new_exam_tab_list[0].id:undefined,
      _cur_tab_name: new_exam_tab_list.length>0? new_exam_tab_list[0].name:undefined,
      _exam_order_list,
      sel_exams,
    });

    if (document.getElementById("prescription_dlg") !== undefined && document.getElementById("prescription_dlg") !== null) {
      document.getElementById("prescription_dlg").focus();
    }
  };
  

  selectExamKind = e => {
    /* 記載、事後、閲覧のみモードとの関連 2020-09-29
    * ・未採取：未受付として登録で、事後モードでは選択不可 記載モードの初期選択はこれです。
    * ・採取済み：・記載・事後どちらでも使用可能 ・事後モードの初期選択はこれです。
    * ・依頼受付済み：・事後モードの時のみ選択可能
    */
    if (this.state.is_done == 1) return;
    if (e.target.id == 0 && this.context.$getKarteMode(this.props.patientId) == KARTEMODE.EXECUTE) return;
    if (this.context.$getKarteMode(this.props.patientId) != KARTEMODE.EXECUTE && e.target.id == 1) return;
    this.change_flag = 1;
    this.setState({exam_tab: parseInt(e.target.id)});
  };

  scrollToelement = () => {
    const els = $(".med-modal [class*=focused]");
    const pa = $(".med-modal .modal-body");
    if (els.length > 0 && pa.length > 0) {
      const scrollTop = 29 * this.state.usageSelectIndex;
      $(pa[0]).scrollTop(scrollTop);
    }
  };

  getRadio = (index, value) => {
    let _exam_order_list = this.state._exam_order_list;
    let sel_exams = this.state.sel_exams;
    let cur_exam_item = _exam_order_list[index];
    if (cur_exam_item.not_chagne) return;
    
    if (value == 1) {
      if (this.checkDuplicate(cur_exam_item.examination_code)) cur_exam_item.is_duplicate = 1;
      if (this.state.modalName == "検体検査") {
        cur_exam_item.is_attention = 1;
      }
      sel_exams.push(cur_exam_item);
    } else {
      sel_exams.map((item, index) => {
        if (item.examination_code == cur_exam_item.examination_code) {
          sel_exams.splice(index, 1);
        }
      });
    }

    _exam_order_list[index].is_selected = value;
    this.change_flag = 1;
    this.setState({
      _exam_order_list,
      sel_exams
    });
  }

  getPresetRadio = (e) => {
    const selectPresetData = this.state.examinationData.preset_items[parseInt(e.target.id)];
    if (selectPresetData == undefined || selectPresetData == null || selectPresetData.length == 0 ) {
      window.sessionStorage.setItem("alert_messages", "登録した検査項目がありません。");
      return;
    }
    let preset_data = this.state.examinationData.preset;
    let {preset_title} = this.state;
    let find_preset = preset_data.find(x=>x.outsourcing_inspection_set_id == e.target.id);
    if (find_preset !== undefined) preset_title = find_preset.name;
    // let preset_title = this.state.examinationData.preset[parseInt(e.target.id)];
    
    this.change_flag = 1;
    this.setState({
      isExaminationSetPopupOpen: true,
      _exam_preset_order_list: selectPresetData,
      preset_title,
    });
  }

  storeDataInCache = () => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let examOrder = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_EDIT);
    if (this.props.cache_data != undefined && this.props.cache_data != null) examOrder = JSON.parse(JSON.stringify(this.props.cache_data));
    let isForUpdate = 0;
    let isDone = 0;
    let isDoneEdit = 0;
    let number = 0;
    if (examOrder != null && examOrder.isForUpdate !== undefined && examOrder.isForUpdate != null && examOrder.isForUpdate == 1) {
      isForUpdate = 1;
      number = examOrder.number;
    }
    if (examOrder != null && examOrder.isForUpdate !== undefined && examOrder.isForUpdate != null && examOrder.is_done == 1) {
      isDone = 1;
    }
    if (examOrder != null && examOrder.isForUpdate !== undefined && examOrder.is_done_edit != null && examOrder.is_done_edit === 1) {
      isDoneEdit = 1;
    }
    let {free_instruction} = this.state;
    free_instruction = free_instruction.filter(x=>x.text!='');

    let params = {
      system_patient_id: this.props.patientId,
      department_code: this.context.department.code == 0 ? 1 : this.context.department.code,
      is_completed: isDone == 1 ? 1 : this.state.exam_tab,
      examinations: this.state.sel_exams,
      substitute_name:authInfo.name,
      insurance_type: this.state.insurance_type,
      insurance_name: this.getInsurance(this.state.insurance_type),
      collected_date: this.state.not_yet ? "日未定" : this.state.collected_date ? this.formatDate(this.state.collected_date) : "",
      collected_time: this.state.collected_time ? this.formatTime(this.state.collected_time) : "",
      order_comment: this.state.order_comment,
      free_comment: this.state.free_comment,
      isForUpdate: isForUpdate,
      todayResult: this.state.todayResult,
      order_comment_urgent: this.state.order_comment_urgent,
      fax_report:this.state.fax_report,
      // is_done: isDone,
      is_done: isDone == 1 || this.state.exam_tab == 1 ? 1 : 0,
      is_done_edit: isDoneEdit,
      done_order: isDone == 1 ? 1 : this.state.exam_tab,
      number: number,
      created_at: examOrder != null && examOrder != undefined && examOrder['created_at'] != null && examOrder['created_at'] != undefined ? examOrder['created_at'] : "",
      free_instruction,
      examination_type: this.state.examination_type,
      modalName: this.state.modalName,
      subject: this.state.subject,
    };
    if(this.state.administrate_period != null) {
      params.administrate_period = this.state.administrate_period;
    }
    if(isForUpdate === 1){
      if(examOrder !== undefined && examOrder != null && examOrder.last_doctor_code !== undefined){
        params.last_doctor_code = examOrder.last_doctor_code;
        params.last_doctor_name = examOrder.last_doctor_name;
      }
      if (this.props.cache_data !== undefined && this.props.cache_data != null){
        params.last_doctor_code = examOrder.doctor_code;
        params.last_doctor_name = examOrder.doctor_name;
      }
    }
    if (examOrder != null && examOrder.in_hospital_header_number != undefined) {
      params.in_hospital_header_number = examOrder.in_hospital_header_number;
    }
    if (examOrder != null && examOrder.out_hospital_header_number != undefined) {
      params.out_hospital_header_number = examOrder.out_hospital_header_number;
    }
    if (this.state.examination_type == EXAMINATION_TYPE.CYTOLOGY) {
      let recheck_array = this.state.recheck_array;
      recheck_array.map(item => {
        if (item.date != '') {
          item.date = formatDateLine(item.date);
        }
      })
      params.menstruation_date = formatDateLine(this.state.menstruation_date);
      params.menstruation_period = this.state.menstruation_period;
      params.menopause = this.state.menopause;
      params.pregnancy = this.state.pregnancy;
      params.production = this.state.production;
      
      params.clinical_diagnosis = this.state.clinical_diagnosis;
      params.image_path = this.state.image_path;
      params.imgBase64 = this.state.imgBase64;
      params.previous_histology = this.state.previous_histology;
      params.done_instruction = this.state.done_instruction;
      
      params.recheck = this.state.recheck;
      params.before_class = this.state.before_class;
      params.recheck_array = recheck_array;
      
      params.anticancer_use = this.state.anticancer_use;
      params.radiation_treat = this.state.radiation_treat;
      params.hormon_use = this.state.hormon_use;
      params.anticancer_kind = this.state.anticancer_kind;
      params.anticancer_amount = this.state.anticancer_amount;
    }

    //加算項目------------------------------
    if(this.state.additions != undefined && this.state.additions != null && Object.keys(this.state.additions_check).length > 0){
        params.additions = {};
        params.addition_order_number = this.state.addition_order_number;
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
                params.additions[key] = addition_row;
            }
        })
    }
    if(authInfo.staff_category == 1) {
      params.doctor_code = authInfo.doctor_code;
      params.doctor_name =  authInfo.name;
    } else {
      params.doctor_code = this.context.selectedDoctor.code;
      params.doctor_name =  this.context.selectedDoctor.name;
      params.substitute_name = authInfo.name;
    }
    params.karte_status = this.state.karte_status;
    // SOAPで検査オーダー
    // sessApi.setObject(CACHE_SESSIONNAMES.PATIENT_EXAM, params);
    let {examination_type} = this.state;
    if (examination_type == EXAMINATION_TYPE.EXAMINATION) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_EDIT, JSON.stringify(params), 'insert');
    } else if(examination_type == EXAMINATION_TYPE.CYTOLOGY) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT, JSON.stringify(params), 'insert');
    } else if(examination_type == EXAMINATION_TYPE.PATHOLOGY) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT, JSON.stringify(params), 'insert');
    } else if(examination_type == EXAMINATION_TYPE.BACTERIAL) {
      karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT, JSON.stringify(params), 'insert');
    }
  }

  closeExaminationSet = () => {
    this.setState({ isExaminationSetPopupOpen: false});
  }

  checkDuplicate = (code) => {
    var sel_exams = this.state.sel_exams;
    if (sel_exams == undefined || sel_exams == null || sel_exams.length == 0) return false;
    var res = false;
    sel_exams.map(item => {
      if (item.examination_code == code) res = true;
    })
    return res;
  }

  confirm = (arr) => {
    let _exam_order_list = this.state._exam_order_list;
    let sel_exams = this.state.sel_exams;

    arr.map(item=>{
      if (item.is_selected == 1) {
        let nflag = false;
        sel_exams.map(sel_item=>{
          if (sel_item.examination_code == item.examination_code) {
            nflag = true;
          }
        });
        if (nflag == false) {
          if (this.checkDuplicate(item.examination_code)) item.is_duplicate = 1;
          if (this.state.modalName == "検体検査") {
            item.is_attention = 0;
          }
          sel_exams.push(item);

        }
      }
    });

    _exam_order_list.map(item=>{
      sel_exams.map(sel_item=>{
        if (sel_item.examination_code == item.examination_code) {
          item.is_selected = 1;
        }
      });
    });
    let {subject} = this.state;
    if (this.state.preset_title != undefined && this.state.preset_title != '') {
      if (subject == undefined) subject = this.state.preset_title;
      else subject += this.state.preset_title;
    }

    this.change_flag = 1;
    this.setState({
      isExaminationSetPopupOpen: false,
      subject,
      _exam_order_list,
      sel_exams
    });
  }

  componentDidUpdate () {
    this.changeBackground();
  }

  changeBackground = () => {
    harukaValidate('karte', 'physiological', 'specimen_test', this.state, 'background');
  }

  initRedBorder = () => {
    removeRedBorder('sel_exams_id');
    removeRedBorder('free_comment_id');
    removeRedBorder('order_comment_id');
  }

  checkValidation = () => {
    this.initRedBorder();
    let error_str_arr = [];
    let first_tag_id = '';
    let validate_data = harukaValidate('karte', 'physiological', 'specimen_test', this.state);
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (this.state.sel_exams.length == 0 && (this.state.free_instruction.length == 1 && this.state.free_instruction[0].text == '')) {
      error_str_arr.push('検査項目や自由入力オーダーを入力してください。')
    }
    if (validate_data.first_tag_id != '') {
      first_tag_id = validate_data.first_tag_id;
    }
    this.setState({first_tag_id});
    return error_str_arr;
  }

  handleOk = () => {
    if (!this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.REGISTER) && !this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.REGISTER_PROXY)) return;
    if (!this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.EDIT) && !this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.EDIT_PROXY)) return;
    if (this.state.collected_date == "" && !this.state.not_yet) {
      window.sessionStorage.setItem("alert_messages", "採取日を指定するか、日未定に設定してください");
      this.setState({
        datefocus: true
      });
      return;
    }
    let error_str_array = this.checkValidation()

    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return;
    }
    
    let old_category_data = this.state.examinationData.categories.find(x=>x.outsourcing_inspection_category_id == this.state._sel_category);
    let filtered_exam_order_list = this.state._exam_order_list.filter(x=>x.is_selected == 1);
    
    let require_tab_exist = true;
    let tab_name_array = [];
    
    if (this.state.examinationData.exam_items[this.state._sel_category] != null && this.state.examinationData.exam_items[this.state._sel_category] != undefined) {
      this.state.examinationData.tabs.map(tab_item => {
        let tab_id = tab_item.outsourcing_inspection_tab_id;
        if (tab_item.require_mode == 2) {
          let exam_items = this.state.examinationData.exam_items[this.state._sel_category][tab_id];
          if (exam_items !== undefined && exam_items.length > 0) {
            require_tab_exist = false;
            tab_name_array.push(tab_item.name);
            let {sel_exams} = this.state;
            if (sel_exams !== undefined && sel_exams != null && sel_exams.length > 0) {
              exam_items.map(item=> {
                let find_data = sel_exams.find(x=>x.examination_code == item.examination_code);
                if (find_data !== undefined) {
                  require_tab_exist = true;
                  let remove_index = tab_name_array.indexOf(tab_item.name);
                  if (remove_index > -1) tab_name_array.splice(remove_index, 1);
                }
              })
            } else {
              require_tab_exist = false;
            }
          }
        }
      })
    }
    if (this.state.examination_type != EXAMINATION_TYPE.EXAMINATION &&
      ((old_category_data != undefined && old_category_data.require_mode == 2 && filtered_exam_order_list.length == 0) || (require_tab_exist === false))) {
      let alert_messages = "項目を1件以上選択してください。";
      if (tab_name_array.length > 0) {
        alert_messages = tab_name_array.join("、") + "を1項目以上選択してください。";
      }
      this.setState({
        showTitle: true,
        isOpenAlertOpen: true,
        alert_messages,
        alert_messages_title: "エラー"
      });
      return;
    }
    
    this.setState({
      isUpdateConfirmModal:true,
      confirm_message:'登録しますか？'
    })
  }

  closeAlertModal = () => {
    this.setState({ alert_message: '' });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }

  save = () => {
    this.confirmCancel();
    this.setState({
      can_insurance_edit: false
    });
    this.storeDataInCache();
    this.context.$setExaminationOrderFlag(1);

    this.props.handleOk();
  }

  getDate = (key,value) => {
    this.change_flag = 1;
    this.setState({
      [key]: value,
      datefocus: false,
    });
  }

  getTime = value => {
    this.change_flag = 1;
    this.setState({
      collected_time: value
    });
  }

  formatTime = dt => {
    if (dt.length === undefined) {
    var h = ("00" + dt.getHours()).slice(-2);
    var m = ("00" + dt.getMinutes()).slice(-2);
    var s = ("00" + dt.getSeconds()).slice(-2);
    var result = h + ":" + m + ":" + s;
    return result;
    } else {
      return dt;
    }
  }

  formatDate = dt => {
    if (dt.length === undefined) {
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var result = y + "-" + m + "-" + d;
    return result;
    } else {
      return dt;
    }
  }

  delTime = () => {
    this.change_flag = 1;
    this.setState({
      collected_time: ""
    });
  }

  noDate = () => {
    this.change_flag = 1;
    this.setState({
      collected_time: "",
      collected_date: "",
      not_yet: true,
      datefocus: false,
    }, () =>{
      this.storeDataInCache();
    });
  }

  delDuplicate = () => {
    let sel_exams = this.state.sel_exams;
    if (sel_exams.length < 1){
      this.setState({
        isOpenAlertOpen: true,
        alert_messages: "選択中の検査項目がありません。"
      });
      return;
    }
    if (this.m_unique_exam_array.length < 1){
      this.setState({
        isOpenAlertOpen: true,
        alert_messages: "重複項目がありません。"
      });
      return;
    }
    this.setState({
      isDeleteConfirmModal:true,
      confirm_message:'重複項目の選択を削除しますか？',
    })
  }
  
  deleteDuplicateExam = () => {    
    this.confirmCancel();
    let sel_exams = this.state.sel_exams;
    let temp_arr = [];
    sel_exams.map(item => {
      if (!this.m_unique_exam_array.includes(item.examination_code)) {
        temp_arr.push(item);
      }
    })
    var _exam_order_list = this.state._exam_order_list;
    _exam_order_list.map(item=>{
      item.is_selected = 0;
      temp_arr.map(sel_item=>{
          if (sel_item.examination_code == item.examination_code) {
              item.is_selected = 1;
          }
      });
    });

    let selected_exam_names = this.state.selected_exam_names;
    let cur_selected_exam_names = selected_exam_names;
    Object.keys(selected_exam_names).map((code)=>{
        if(selected_exam_names[code] !== undefined && selected_exam_names[code] === 1){
            delete cur_selected_exam_names[code];
        }
    })
    this.change_flag = 1;
    this.setState({
      sel_exams:temp_arr,
      _exam_order_list,
      selected_exam_names : cur_selected_exam_names,
    });    
  }
  
  delSelectedItem =()=>{
    if(this.state.delete_type == null){
        let selected_exam_names = this.state.selected_exam_names;

        let sel_exams = this.state.sel_exams;
        let temp_arr = [];
        sel_exams.map(item=>{
            if (selected_exam_names[item.examination_code] != 1) {
                temp_arr.push(item);
            }
        });

        let _exam_order_list = this.state._exam_order_list;
        _exam_order_list.map(item=>{
            item.is_selected = 0;
            temp_arr.map(sel_item=>{
                if (sel_item.examination_code == item.examination_code) {
                    item.is_selected = 1;
                }
            });
        });
        let cur_selected_exam_names = selected_exam_names;
        Object.keys(selected_exam_names).map((code)=>{
            if(selected_exam_names[code] !== undefined && selected_exam_names[code] === 1){
                delete cur_selected_exam_names[code];
            }
        })

      this.change_flag = 1;
        this.setState({
            selected_exam_names : cur_selected_exam_names,
            sel_exams: temp_arr,
            _exam_order_list,
        });
    } else {
        let _exam_order_list = this.state._exam_order_list;
        _exam_order_list.map(item=>{
            item.is_selected = 0;
        });

      this.change_flag = 1;
        this.setState({
            sel_exams: [],
            _exam_order_list,
            selected_exam_names:[],
        });
    }
      this.confirmCancel();
  }

  selectSelExams(e, examination_code) {
      let selected_exam_names = this.state.selected_exam_names;
      if(selected_exam_names[examination_code] !== undefined && selected_exam_names[examination_code] === 1){
          selected_exam_names[examination_code] = 0;
      } else {
          selected_exam_names[examination_code] = 1;
      }
    this.change_flag = 1;
      this.setState({
          selected_exam_names,
      });
  }

  handleOrderComment = e => {
    this.change_flag = 1;
    this.setState({
      order_comment: e.target.value
    });
  }

  handleFreeComment = e => {
    this.change_flag = 1;
    this.setState({
      free_comment: e.target.value
    });
  }

  handleInsuranceTypeChange = e =>{
    this.change_flag = 1;
    this.setState({
      insurance_type: parseInt(e.target.value)
    })
  }

  handleClick = e => {
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
          contextMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
          .getElementById("prescription_dlg")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("prescription_dlg")
              .removeEventListener(`scroll`, onScrollOutside);
          });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("prescription_dlg").offsetLeft,          
          y: e.clientY + window.pageYOffset - document.getElementById("prescription_dlg").offsetTop -  document.getElementsByClassName("modal-content")[0].offsetTop,
        }
      });
    }
  }

  contextMenuAction = (act, index=null) => {
    if (act === "insurance_edit") {
      this.setState({
        can_insurance_edit: true
      })
    } else if (act == "instruction_add" && index != null) {
      let {free_instruction} = this.state;
      if (free_instruction[free_instruction.length-1].text != undefined && free_instruction[free_instruction.length-1].text != '') {
        free_instruction.push({text:'', urgent:0});
        this.setState({free_instruction});
      }
    } else if (act == "instruction_delete" && index != null) {
      let {free_instruction} = this.state;
      free_instruction.splice(index, 1);
      if (free_instruction.length == 0) { free_instruction.push({text:'', urgent:0});}
      this.setState({free_instruction});
    } else if (act == "disease_insert") {
      this.setState({
        isOpenSelectDiseaseModal: true
      })
    } else if (act == "attention_add") {
      this.setAttention(index, 1);
    } else if (act == "attention_delete") {
      this.setAttention(index, 0);
    } else if (act == "instruction_attention_add") {
      this.setAttention(index, 1, "instruction");
    } else if (act == "instruction_attention_delete") {
      this.setAttention(index, 0, "instruction");
    }
  };

  setAttention = (_index=null, _status=null, _type=null) => {
    let sel_exams = this.state.sel_exams;
    if (_type == "instruction") sel_exams = this.state.free_instruction;
    
    sel_exams[_index].is_attention = _status;
    
    let _state = {sel_exams: sel_exams};
    if (_type == "instruction") {
      _state = {free_instruction: sel_exams};
    }
    
    this.setState(_state);
  }

  getInsurance = type => {
    let insurance = "既定";
    if (this.props.patientInfo.insurance_type_list) {
      this.props.patientInfo.insurance_type_list.map(item => {
        if (item.code === parseInt(type)) {
          insurance = item.name;
        }
      });
    }
    return insurance;
  };

  clearOrderComment = () => {
    if (this.state.order_comment == '') return;
    this.setState({
        isClearConfirmModal:true,
        confirm_message:'依頼コメントを削除しますか？',
        deleteTarget:'order_comment',
    });
  }

  clearFreeComment = () => {
    if (this.state.free_comment == '') return;
    this.setState({
        isClearConfirmModal:true,
        confirm_message:'フリーコメントを削除しますか？',
        deleteTarget:'free_comment',
    });
  };
  
  openSearchModal = () => {
    this.setState({
      isItemSelectModal: true
    })
  };
  
  closeModal = () => {
    this.setState({
      isItemSelectModal: false,
      isOpenSelectDiseaseModal: false,
    });
  };

  getSelExamByCode = (_code=null) => {
    if (_code == null) return;
    var sel_exams = this.state.sel_exams;
    if (sel_exams == undefined || sel_exams == null || sel_exams.length == 0) return null;
    var res = null;
    sel_exams.map(item => {
      if (item.examination_code == _code) res = item;
    })
    return res;
  }
  
  setItemName = (data) => {
    this.closeModal();
    if (data == null || data == undefined || data.length == 0) {
      return;
    }
    let sel_exams = [];

    data.map(item=>{
        if (this.checkDuplicate(item.examination_code)) item.is_duplicate = 1;
        if (item.is_duplicate == 1) {
          item = this.getSelExamByCode(item.examination_code);
        } else {          
          if (this.state.modalName == "検体検査" && item.is_duplicate != 1) {          
            item.is_attention = 1;
          }
        }
        sel_exams.push(item);
    });

    let _exam_order_list = this.state._exam_order_list;
    _exam_order_list.map(item=>{
      item.is_selected = 0;
      sel_exams.map(sel_item=>{
        if (sel_item.examination_code == item.examination_code) {
          item.is_selected = 1;
        }
      });
    });

    // _exam_order_list[index].is_selected = value;
    this.change_flag = 1;
    this.setState({
      _exam_order_list,
      sel_exams
    });
  };

  checkTodayResult = (name, value) => {
    this.change_flag = 1;
    this.setState({
      todayResult: value
    });
  }
  
  checkOrderCommentUrgent = (name, value) => {
    this.change_flag = 1;
    this.setState({
      order_comment_urgent: value
    });
  };

  checkOrderfaxReport = (name, value) => {
    this.change_flag = 1;
    this.setState({
      fax_report:value,
    })
  }
  checkRecheck = (name, value) => {
    this.change_flag = 1;
    this.setState({
      recheck:value,
    })
  }

  getAdditions = (name, number) => {
      let check_status = {};
      if (name == 'additions') {
        this.change_flag = 1;
          check_status = this.state.additions_check;
          check_status[number] = !check_status[number];
          this.setState({additions_check:check_status});
      }
  }

  getAdditionsSendFlag = (name, number) => {
      let check_status = {};
      if (name == 'additions_sending_flag') {
        this.change_flag = 1;
          check_status = this.state.additions_send_flag_check;
          check_status[number] = !check_status[number];
          this.setState({additions_send_flag_check:check_status});
      }
  }

  setNextExamDate = async() => {
    if(this.context.karte_status.code === 1) return;
    let collected_date = "";
    let path = "";
    if(this.context.karte_status.code == 0){//外来
      //外来診察予約
        path = "/app/api/v2/reservation/get/next_exam_date";
    }
    if(this.context.karte_status.code == 2){//
      //訪問診療スケジュール
        path = "/app/api/v2/visit/get/next_exam_date";
    }
      let post_data = {
          system_patient_id:this.props.patientId,
          scheduled_date: formatDateLine(new Date()),
      };
      await apiClient
          .post(path, {
              params: post_data
          })
          .then((res) => {
              if(res.scheduled_date != null){
                  collected_date = res.scheduled_date;
              }
          })
          .catch(() => {

          });

    if(collected_date === ''){
        // window.sessionStorage.setItem("alert_messages", "次回診察の予約が登録されていません。");
        this.setState({
          isOpenAlertOpen: true,
          alert_messages: "次回診察の予約が登録されていません。"
        });
    } else {
      this.change_flag = 1;
        this.setState({
            collected_time: "",
            collected_date: new Date(collected_date),
            not_yet: false
        });
    }
  }

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isClearConfirmModal: false,
      isOpenAlertOpen: false,
      confirm_message: "",
      confirm_title: "",
      confirm_type: "",
      isSelectedDeleteConfirmModal: false,
      delete_type: null,
      alert_messages: "",
      alert_messages_title: "",
      showTitle:false
    });
}

  clearComment = () => {
    this.confirmCancel();
    if (this.state.deleteTarget != undefined){
      this.change_flag = 1;
      this.setState({[this.state.deleteTarget]: ''});
    }

  };

  checkExamUrgent = (index, name, value, ) => {
    let sel_exam_item = {...this.state.sel_exams[index]};
    sel_exam_item.urgent= value;
    let {sel_exams}= this.state;
      sel_exams[index] = sel_exam_item;
    this.change_flag = 1;
    this.setState({sel_exams});
  };
  
  checkFreeUrgent = (index, name, value, ) => {
    let {free_instruction} = this.state;
      free_instruction[index].urgent = value;
    this.change_flag = 1;
    this.setState({free_instruction});
  };

  confirmDelete=(type)=>{
      if(this.state.sel_exams.length === 0){
          return;
      }
      let confirm_message = "選択した項目を削除しますか？";
      if(type != null){
          confirm_message = "選択中の項目を全て削除しますか？"
      }
      let base_modal = document.getElementsByClassName("prescript-medicine-select-modal")[0];
      if(base_modal !== undefined && base_modal != null){
          base_modal.style['z-index'] = 1040;
      }
      this.setState({
          delete_type:type,
          confirm_message,
          isSelectedDeleteConfirmModal:true,
      })
  }

  confirmCloseModal=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"close",
        confirm_alert_title:'入力中',
      });
    } else {
      this.confirmDeleteCache();
    }
  }
  
  confirmDeleteCache=()=>{
    this.props.closeExamination();
  };
  
  getInstructionText = (index, e) => {
    let {free_instruction} = this.state;
    free_instruction[index].text = e.target.value;
    this.change_flag = 1;
    var check_blank = false;
    free_instruction.map(item => {
      if (item.text == '') check_blank = true;
    })
    if (check_blank == false) {
      if (this.state.modalName == "検体検査") {
        free_instruction.push({text:"", urgent: 0,is_attention:1});
      } else {        
        free_instruction.push({text:"", urgent: 0});
      }
    }
    this.setState({free_instruction});
  };
  
  handleFreeInstruction = (e, index) => {
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
          contextMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
          .getElementById("prescription_dlg")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("prescription_dlg")
              .removeEventListener(`scroll`, onScrollOutside);
          });      
      this.setState({
        contextMenu: {
          selected_index: index,
          modal_type: this.state.modalName,
          exam_info: this.state.free_instruction[index],
          visible: true,
          x: e.clientX - document.getElementById("prescription_dlg").offsetLeft,          
          y: e.clientY + window.pageYOffset - document.getElementById("prescription_dlg").offsetTop -  document.getElementsByClassName("modal-content")[0].offsetTop,
        }
      });
    }
  }
  handleExaminations = (e, index) => {
    // YJ461 検体検査で、検査項目を目立たせられるように
    if (this.state.modalName != "検体検査") return;

    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextAttentionMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextAttentionMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
          .getElementById("prescription_dlg")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextAttentionMenu: { visible: false }
            });
            document
              .getElementById("prescription_dlg")
              .removeEventListener(`scroll`, onScrollOutside);
          });
      this.setState({
        contextAttentionMenu: {
          selected_index: index,
          exam_info: this.state.sel_exams[index],
          visible: true,
          x: e.clientX - document.getElementById("prescription_dlg").offsetLeft,          
          y: e.clientY + window.pageYOffset - document.getElementById("prescription_dlg").offsetTop -  document.getElementsByClassName("modal-content")[0].offsetTop          
        }
      });
    }
  }
  handleMedicineClick = (e) => {
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
          contextMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
          .getElementById("prescription_dlg")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("prescription_dlg")
              .removeEventListener(`scroll`, onScrollOutside);
          });
      this.setState({
        contextMenu: {
          visible: true,
          selected_index: "medicine",
          x: e.clientX - document.getElementById("prescription_dlg").offsetLeft,
          y: e.clientY + window.pageYOffset - document.getElementById("prescription_dlg").offsetTop -  document.getElementsByClassName("modal-content")[0].offsetTop,
        }
      });
    }
  }
  
  confirmOk = () => {
    if (this.state.confirm_type == "category_change") {
      this.setState({
        delete_type:"all",
        _exam_tab_list: this.state.tmp_exam_tab_list,
        _sel_category: this.state.tmp_sel_category,
        _sel_tab: this.state.tmp_sel_tab,
        _cur_tab_name: this.state.tmp_cur_tab_name,
        _exam_order_list: this.state.tmp_exam_order_list,
        sel_exams: this.state.tmp_sel_exams
      }, ()=>{
        this.delSelectedItem();
      });
    }
  };
  
  setValue = (key, e) =>{
    if (key == "menstruation_period" || key == "menopause" || key == "pregnancy" || key == "production") {
      var value = e.target.value;
      var RegExp = /^[0-9０-９]*$/;
      if (value != "" && !RegExp.test(e.target.value)) {
        return;
      }
    }
    this.setState({[key]: e.target.value});
  }

  handleShema = () => {
    this.change_flag = 1;
    this.setState({
      isOpenShemaModal: true
    });
  }

  closeShemaModal = () => {
    this.setState({
      isOpenShemaModal: false
    })
  }

  registerImage = (img_base64) => {
    this.change_flag = 1;
    this.setState({
      imgBase64: img_base64,
      isOpenShemaModal: false
    });
  };
  
  getRecheckDate = (index, value) => {
    let {recheck_array} = this.state;
    recheck_array[index].date = value;
    this.setState({recheck_array});
  };
  setRecheckValue = (index, e) =>{
    let {recheck_array} = this.state;
    recheck_array[index].number = e.target.value;
    this.setState({recheck_array});
  }
  openSelectDiseaseModal (){
    this.setState({isOpenSelectDiseaseModal:true})
  }
  pasteDiseaseName = (disease_name) => {
    this.closeModal();
    let {clinical_diagnosis} = this.state;
    clinical_diagnosis += disease_name;
    this.setState({clinical_diagnosis});
  };
  
  saveCheck = () => {
    let result = "";
    if (!this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.REGISTER) && !this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.REGISTER_PROXY)) result = "登録権限がありません。";
    if (!this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.EDIT) && !this.context.$canDoAction(this.context.FEATURES.EXAMORDER, this.context.AUTHS.EDIT_PROXY)) result = "編集権限がありません。";
    return result;
  }
  
  setAdministratePeriod = () => {
    if (this.state.exam_tab == 3) return;
    this.setState({isAdministratePeriodModalOpen: true});
  }
  
  closeAdministratePeriodModal = () => {
    this.setState({
      isAdministratePeriodModalOpen: false
    });
  }
  
  saveAdministratePeriod = (_value) => {
    this.closeAdministratePeriodModal();
    this.setState({administrate_period: _value});
  }
  
  render() {    
    const count = this.state.sel_exams !== undefined && this.state.sel_exams.length > 0 ? this.state.sel_exams.length : 0;
    let save_tooltip = this.saveCheck();
    const examList = [];
    let pressetList = [];
    if(this.state.is_loaded && this.state._exam_order_list.length > 0) {
      this.state._exam_order_list.map((exam, index) => {
        let item = <ExamRowElement>
              <ExamCheckbox
                key={index}
                id={exam.number}
                label={exam.label.trim()}
                title={exam.name.trim()}
                name={index}
                usageType={this.state._sel_tab}
                getRadio={this.getRadio}
                value={exam.is_selected}
                background={exam.background}
              />
            </ExamRowElement>
        examList.push(item);
      })
     }

    if (this.state._exam_preset_list.length > 0) {
      this.state._exam_preset_list.map((preset, index) => {
        pressetList.push(
          <>
          <ExamRadioButton
            key={index}
            index={index}
            id={preset.id}
            label={preset.name}
            getUsage={this.getPresetRadio}
            name="deparment"
            checked={index === this.state.usageSelectIndex}
          />
          </>
        );
      });
    }

    // < 追加指示・指導・処置等選択 > 表示 condition
    let addition_count = 0;
    if (this.state.additions != undefined && this.state.additions != null && this.state.additions.length > 0) {
      this.state.additions.map(addition => {
        if (addition.addition_id != 6496){
          addition_count ++;
        } else {
          var check_flag = false;
          this.state.sel_exams.map(exam_item => {
            if (exam_item.name.indexOf('細菌培養同定') == 0){
              check_flag = true;
            }
          })
          if (check_flag){
            addition_count ++;
          }
        }
      });
    }
    
    let addition_component = <></>;
    if (this.state.additions != undefined && this.state.additions != null && this.state.additions.length > 0 && addition_count > 0) {
      addition_component = <>
        <div className={'flex'} style={{marginTop:"20px"}}>
          <div className={'block-area div-style1'} style={{width:"100%"}}>
            <div className={'block-title'}>追加指示・指導・処置等選択</div>
            {this.state.additions.map(addition => {
              if (addition.addition_id != 6496){
                return (
                  <>
                    <div className={'flex'}>
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
                          <div style={{fontSize:"14px"}}>※送信するチェックボックスにチェックすると医事に送信されます。</div>
                        </>
                      )}
                    </div>
                  </>
                )
              } else {
                var check_flag = false;
                this.state.sel_exams.map(exam_item => {
                  if (exam_item.name.indexOf('細菌培養同定') == 0){
                    check_flag = true;
                  }
                })
                if (check_flag){
                  return (
                    <>
                      <div className={'flex'}>
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
                            <div style={{fontSize:"14px"}}>※送信するチェックボックスにチェックすると医事に送信されます。</div>
                          </>
                        )}
                      </div>
                    </>
                  )}
              }
        
            })}
          </div>
        </div>
      </>;
    }

    return (
      <Modal
        show={true}
        onKeyDown={this.onKeyPressed}
        tabIndex="0"
        id="prescription_dlg"
        className="custom-modal-sm exa-modal first-view-modal select-examination-modal shema-modal-design"
      >
        <Modal.Header>
          <Modal.Title>
            <span>{this.state.modalName != undefined ? this.state.modalName: "検体検査"}選択</span>
            <ExamCategoryNav
            selectUsageKind={this.selectExamKind}
            id={this.state.exam_tab}
            diagnosis={this.state.exam_tabs}
          />
            {this.state.examination_type == EXAMINATION_TYPE.CYTOLOGY && (
              <div className="shema-btn">
                <Button className="red-btn" onClick={this.handleShema} style={{position:'absolute', right:'16px'}}>シェーマ</Button>
              </div>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            {this.state.is_loaded ? (
              <>
                {this.state.examination_type == EXAMINATION_TYPE.EXAMINATION && ( // 検体検査の場合
                  <>
                    <div className="flex" style={{height:"100%"}}>
                      <div className="left-content-area" style={{width:"70%"}}>
                        <div className="data-input">
                          <div className="collect collect-other">
                            <InputBox>
                              <label>採取日</label>
                              <DatePicker
                                locale="ja"
                                selected={this.state.collected_date}
                                onChange={this.getDate.bind(this, 'collected_date')}
                                dateFormat="yyyy/MM/dd"
                                placeholderText={this.state.not_yet ? "日未定" : "年/月/日"}
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                className={this.state.datefocus ? "readline date-area" : "date-area"}
                                dayClassName = {date => setDateColorClassName(date)}
                              />
                            </InputBox>
                            <InputBox>
                              <label>採取時刻</label>
                              <DatePicker
                                selected={this.state.collected_time}
                                onChange={this.getTime.bind(this)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={10}
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                className={"time-area"}
                                timeCaption="時間"
                              />
                            </InputBox>
                            <Button type="mono" onClick={this.delTime}>時刻無し</Button>
                            <Button type="mono" onClick={this.setNextExamDate}>次回診察日</Button>
                            <Button type="mono" onClick={this.noDate}>日未定</Button>
                            <Button type="mono" onClick={this.setAdministratePeriod}>期間指定</Button>
                          </div>
                          <div className="insurance-other" id="insurance" onContextMenu={e =>
                            this.handleClick(e)}>
                            {this.state.can_insurance_edit ? (
                              <div className="">
                                <span>保険 </span>
                                <select
                                  value={this.state.insurance_type}
                                  onChange={this.handleInsuranceTypeChange}
                                  onKeyPress={this.handleInsuranceTypeChange}
                                >
                                  {this.props.patientInfo.insurance_type_list.map(
                                    (item, index) => {
                                      return (
                                        <option value={item.code} key={index}>
                                          {item.name}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              </div>
                            ) : (
                              <div className="">
                                保険: {this.getInsurance(this.state.insurance_type)}
                                &nbsp;
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="btn-group">
                          {this.state._exam_category_list != null && this.state._exam_category_list != undefined && this.state._exam_category_list.length > 0 && (
                            this.state._exam_category_list.map(item=>{
                              return <><Button type="mono" className={ this.state._sel_category == item.id?"active": ""} onClick={()=>this.selectCategory(item.id)}>{item.name}</Button></>
                            })
                          )}                        
                        </div>
                        <div className={'flex variable-area'}>
                          <div className="preset preset-other">
                            <div className="preset-title">検査セット</div>
                            <div className="preset-content">{pressetList}</div>
                          </div>
                          <div className="categoryContent categoryContent-other" style={{width:"70%"}}>
                            <ExamCategoryNav
                              selectUsageKind={this.selectTab}
                              id={this.state._sel_tab}
                              diagnosis={this.state._exam_tab_list}
                            />
                            <div className="categoryName">
                              <span className="">{this.state._cur_category_name}（{this.state._cur_tab_name}）</span>
                            </div>
                            <div className={this.state._exam_tab_list.length > 0 ? "exam-list exam-list-other":"exam-list tab-exam-list tab-exam-list-other"}>
                              {examList}
                            </div>
                            <div className={'flex'} style={{marginTop:"1rem"}}>
                              {/*
                                <div style={{width:"70%"}}>
                                  {addition_component}
                                </div>
                              */}
                              <div className="comment" style={{width: "100%"}}>
                                <div className={`d-flex full-width-input`} style={{marginRight:"2rem"}}>
                                  <div style={{width:"8rem", marginRight:"0.5rem", lineHeight:"2rem", height:"2rem"}}>セット・概要</div>
                                  <input
                                    type="text"
                                    value={this.state.subject }
                                    onChange={this.setValue.bind(this, "subject")}
                                    id = 'subject_id'
                                    style={{width:"16rem", marginRight:"2rem", height:"2rem !important"}}
                                  />
                                  <TodayResultAnother>
                                    <Checkbox
                                      label=""
                                      getRadio={this.checkTodayResult.bind(this)}
                                      value={this.state.todayResult}
                                      name="todayResult"
                                    />
                                    <label style={{width:"130px",verticalAlign:"unset"}}>当日結果説明あり</label>
                                  </TodayResultAnother>
                                </div>
                                <div className="order-comment">
                                  <label style={{width:"8rem", marginRight:"0.5rem", marginBottom:"0px",lineHeight:"2rem", height:"2rem"}}>依頼コメント</label>
                                  <div className="flex" style={{width:"16rem", marginRight:"2rem", height: "2rem"}}>
                                    <input
                                      type="text"
                                      value={this.state.order_comment }
                                      onChange={this.handleOrderComment}
                                      id = 'order_comment_id'
                                      style={{width:"calc(100% - 0.25rem - 30px)", height:"2rem !important"}}
                                    />
                                    <Button type="mono" className={this.state.curFocus === 1?"focus clear clear-other": "clear clear-other"} onClick={this.clearOrderComment}>C</Button>
                                  </div>
                                  <div>
                                    <TodayOtherResultAnother>
                                      <Checkbox
                                        label=""
                                        getRadio={this.checkOrderCommentUrgent.bind(this)}
                                        value={this.state.order_comment_urgent}
                                        name="urgent"
                                      />
                                      <label className="label-important" style={{verticalAlign:"unset"}}>至急</label>
                                    </TodayOtherResultAnother>
                                  </div>
                                </div>
                                <div className="free-comment">
                                  <label style={{marginRight:"0.5rem"}}>フリーコメント</label>
                                  <div className="flex" style={{width:"16rem", marginRight:"2rem"}}>
                                    <textarea
                                      value={this.state.free_comment }
                                      onChange={this.handleFreeComment}
                                      id = 'free_comment_id'
                                      style={{height:"3rem", width:"calc(100% - 0.25rem - 30px)"}}
                                    />
                                    <Button type="mono" className={this.state.curFocus === 1?"focus clear clear-other": "clear clear-other"} onClick={this.clearFreeComment}>C</Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>                      
                        </div>                        
                      </div>
                      <div className="right-content-area" style={{width:"30%"}}>
                        <div className="selected-exam" style={this.examination_free_instruction_is_enabled == "ON" ?{height:"64%", width:"100%"}:{height: "100%", width:"100%"}}>
                          <div className="del-btn-group-other min-btn min-btn-other">                            
                            <Button type="mono" className={this.state.curFocus === 1?"focus search-btn": "search-btn"} onClick={this.openSearchModal}>項目検索</Button>
                            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick={this.confirmDelete.bind(this, null)}>選択削除</Button>
                            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick={this.confirmDelete.bind(this, 'all')}>全削除</Button>
                            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick={this.delDuplicate.bind(this)}>重複削除</Button>
                          </div>
                          <div className="selected-count" style={{marginLeft:"7px"}}>選択中の検査項目数 {count}</div>
                          <div className="selected-items" id = 'sel_exams_id' style={{height:"calc(100% - 5rem"}}>
                            <div style={{width:'100%', background:'#a0ebff'}}>
                              <div className="table-header">
                                <span className="exam-name">項目名称</span>
                                <span className="exam-material">至急</span>
                                <span className="exam-material">材料</span>
                              </div>
                            </div>
                            <div className='table-body'>
                              {this.state.sel_exams !== undefined && this.state.sel_exams !== null && this.state.sel_exams.length > 0 ? (
                
                                this.state.sel_exams.map((exam, index) => {
                                  let exist_today_exam = 0;
                                  if (this.m_unique_exam_array.length > 0 &&
                                    this.m_unique_exam_array.includes(exam.examination_code)) {
                                    exist_today_exam = 1;
                                  }
                                  return (
                                    <>
                                      <div
                                        className={(this.state.selected_exam_names[exam.examination_code] !== undefined && this.state.selected_exam_names[exam.examination_code] === 1) ? "div-row selected-item" : "div-row"}
                                        onClick={e => this.selectSelExams(e, exam.examination_code)} style = {{background:exist_today_exam == 1?'LIGHTYELLOW':''}} onContextMenu={e=>this.handleExaminations(e, index)}>
                                        <span className="exam-name" style={{display:"flex"}}>
                                          {exam.is_attention != undefined && exam.is_attention == 1 && (
                                            <>
                                              <span className="no-span-border">{this.state.examination_attention_mark}</span>
                                            </>
                                          )}
                                          <span className="no-span-border">
                                            {exam.name.trim()}
                                          </span>
                                          </span>
                                        <span className="exam-urgent exam-material">
                                            <Checkbox
                                              label=""
                                              getRadio={this.checkExamUrgent.bind(this, index)}
                                              value={exam['urgent']}
                                              name="urgent-item"
                                            />
                                        </span>
                                        <span className="exam-last-td">&nbsp;</span>
                                      </div>
                                    </>
                                  )
                                })
                              ) : (
                                <div className="no-select">選択された項目がありません。</div>
                              )}
                            </div>
                          </div>                          
                          {this.examination_free_instruction_is_enabled == "ON" && (
                            <div className="selected-instruction-items">
                              <div className='mt-2 mb-1'>自由入力オーダー</div>
                              <div style={{width:'100%', background:'#a0ebff'}}>
                                <div className="table-header">
                                  <span className="exam-name">項目名称</span>
                                  <span className="exam-material">至急</span>
                                </div>
                              </div>
                              <div className='table-body select_instruction_items_tbody'>
                                {this.state.free_instruction !== undefined && this.state.free_instruction !== null && this.state.free_instruction.length > 0 ? (
                                  this.state.free_instruction.map((item, index) => {
                                    return (
                                      <>
                                        <div onContextMenu={e=>this.handleFreeInstruction(e, index)} className="border-bottom d-flex">
                                        <span className="exam-name" style={{display:"flex"}}>
                                          {item.is_attention != undefined && item.is_attention == 1 && item.text.trim() != "" && (
                                            <>
                                              <span>{this.state.examination_attention_mark}</span>
                                            </>
                                          )}
                                          <input type="text" value={item.text} onChange={this.getInstructionText.bind(this, index)}/>
                                        </span>
                                          <span className="exam-urgent exam-material">
                                            <Checkbox
                                              label=""
                                              getRadio={this.checkFreeUrgent.bind(this, index)}
                                              value={item['urgent']}
                                              name="urgent-item"
                                            />
                                        </span>
                                        </div>
                                      </>
                                    )
                                  })
                                ) : (
                                  <div className="no-select">選択された項目がありません。</div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>                                        
                  </>
                )}
                {this.state.examination_type == EXAMINATION_TYPE.CYTOLOGY && ( // 細胞診
                  <>
                    <div className="data-input">
                      <div className="collect">
                        <InputBox>
                          <label>採取日</label>
                          <DatePicker
                            locale="ja"
                            selected={this.state.collected_date}
                            onChange={this.getDate.bind(this, 'collected_date')}
                            dateFormat="yyyy/MM/dd"
                            placeholderText={this.state.not_yet ? "日未定" : "年/月/日"}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            className={this.state.datefocus ? "readline date-area" : "date-area"}
                            dayClassName = {date => setDateColorClassName(date)}
                          />
                        </InputBox>
                        <InputBox>
                          <label>採取時刻</label>
                          <DatePicker
                            selected={this.state.collected_time}
                            onChange={this.getTime.bind(this)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={10}
                            dateFormat="HH:mm"
                            timeFormat="HH:mm"
                            className={"time-area"}
                            timeCaption="時間"
                          />
                        </InputBox>
                        <Button type="mono" onClick={this.delTime}>時刻無し</Button>
                        <Button type="mono" onClick={this.setNextExamDate}>次回診察日</Button>
                        <Button type="mono" onClick={this.noDate}>日未定</Button>
                        <Button type="mono" onClick={this.setAdministratePeriod}>期間指定</Button>
                      </div>
                      <div className="insurance" id="insurance" onContextMenu={e =>
                        this.handleClick(e)}>
                        {this.state.can_insurance_edit ? (
                          <div className="text-right">
                            <span>保険 </span>
                            <select
                              value={this.state.insurance_type}
                              onChange={this.handleInsuranceTypeChange}
                              onKeyPress={this.handleInsuranceTypeChange}
                            >
                              {this.props.patientInfo.insurance_type_list.map(
                                (item, index) => {
                                  return (
                                    <option value={item.code} key={index}>
                                      {item.name}
                                    </option>
                                  );
                                }
                              )}
                            </select>
                          </div>
                        ) : (
                          <div className="text-right">
                            保険: {this.getInsurance(this.state.insurance_type)}
                            &nbsp;
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="btn-group">
                      {this.state._exam_category_list != null && this.state._exam_category_list != undefined && this.state._exam_category_list.length > 0 && (
                        this.state._exam_category_list.map(item=>{
                          return <><Button type="mono" className={ this.state._sel_category == item.id?"active": ""} onClick={()=>this.selectCategory(item.id)}>{item.name}</Button></>
                        })
                      )}
                    </div>
                    <div className={'flex variable-area'}>
                      <div className="categoryContent" style={{width: "70%"}}>
                        <ExamCategoryNav
                          selectUsageKind={this.selectTab}
                          id={this.state._sel_tab}
                          diagnosis={this.state._exam_tab_list}
                        />
                        <div className="categoryName" style={{marginLeft: 0}}>
                          <span className="">{this.state._cur_category_name}（{this.state._cur_tab_name}）</span>
                        </div>
                        <div className={this.state._exam_tab_list.length > 0 ? "exam-list":"exam-list tab-exam-list"} style={{marginLeft: 0}}>
                          {examList}
                        </div>
                      </div>
                      <div className="selected-exam h-100">
                        <div className="del-btn-group min-btn">
                          <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick={this.confirmDelete.bind(this, null)}>選択削除</Button>
                          <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick={this.confirmDelete.bind(this, 'all')}>全削除</Button>
                        </div>
                        <div className="selected-items h-50" id = 'sel_exams_id'>
                          <div style={{width:'100%', background:'#a0ebff'}}>
                            <div className="table-header">
                              <span className="exam-name w-100">項目名称</span>
                            </div>
                          </div>
                          <div className='table-body'>
                            {this.state.sel_exams !== undefined && this.state.sel_exams !== null && this.state.sel_exams.length > 0 ? (
                              this.state.sel_exams.map((exam) => {
                                let exist_today_exam = 0;
                                if (this.m_unique_exam_array.length > 0 &&
                                  this.m_unique_exam_array.includes(exam.examination_code)) {
                                  exist_today_exam = 1;
                                }
                                return (
                                  <>
                                    <div
                                      className={(this.state.selected_exam_names[exam.examination_code] !== undefined && this.state.selected_exam_names[exam.examination_code] === 1) ? "div-row selected-item" : "div-row"}
                                      onClick={e => this.selectSelExams(e, exam.examination_code)} style = {{background:exist_today_exam == 1?'LIGHTYELLOW':''}}>
                                      <span className="exam-name w-100">{exam.name.trim()}</span>
                                    </div>
                                  </>
                                )
                              })
                            ) : (
                              <div className="no-select">選択された項目がありません。</div>
                            )}
                          </div>
                        </div>
                        <div className="selected-items border mt-2 p-2" style={{height: "calc(50% - 3rem)", overflowY: "auto"}}>
                          <TodayOtherResult>
                            <Checkbox
                              label="細胞診再検"
                              getRadio={this.checkRecheck.bind(this)}
                              value={this.state.recheck}
                              name="recheck"
                            />
                          </TodayOtherResult>
                          <br />
                          <InputBoxTag
                            label="前回クラス"
                            getInputText={this.setValue.bind(this, 'before_class')}
                            value={this.state.before_class}
                            id={'before_class_id'}
                          />
                          <div className='recheck-area'>
                            {this.state.recheck_array !== undefined && this.state.recheck_array !== null && this.state.recheck_array.length > 0 ? (
                              this.state.recheck_array.map((item, index) => {
                                return (
                                  <>
                                    <div className="d-flex">
                                      <div className="recheck-date">
                                        <DatePicker
                                          locale="ja"
                                          selected={item.date}
                                          onChange={this.getRecheckDate.bind(this, index)}
                                          dateFormat="yyyy/MM/dd"
                                          placeholderText="年/月/日"
                                          showMonthDropdown
                                          showYearDropdown
                                          dropdownMode="select"
                                          popperPlacement="top"
                                          dayClassName = {date => setDateColorClassName(date)}
                                        />
                                      </div>
                                      <label className={`text-center`} style={{width: "2rem", lineHeight: "30px"}}>No</label>
                                      <div className="hankaku-eng-num-input recheck-no">
                                          <input type="text" value={item.number} onChange={this.setRecheckValue.bind(this, index)} style={{width: "100%"}}/>
                                      </div>
                                    </div>
                                  </>
                                )
                              })
                            ) : (
                              <div className="no-select">選択された項目がありません。</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={'flex'}>
                      <div style={{width:"70%"}}>
                        <Cytology>
                          <div className={`woman-area border`}>
                            <div className={`d-flex`}>
                              <label className={`label-title`}>最終月経</label>
                              <DatePicker
                                locale="ja"
                                selected={this.state.menstruation_date}
                                onChange={this.getDate.bind(this, 'menstruation_date')}
                                dateFormat="yyyy/MM/dd"
                                placeholderText="年/月/日"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                dayClassName = {date => setDateColorClassName(date)}
                              />
                            </div>
                            <div className={`hankaku-eng-num-input`}>
                              <label className={`label-title`}>日数</label>
                              <input type="text" value={this.state.menstruation_period} onChange={this.setValue.bind(this, 'menstruation_period')} id='menstruation_period_id' />
                            </div>
                            <div className={`hankaku-eng-num-input d-flex`}>
                              <InputBoxTag
                                label="閉経"
                                getInputText={this.setValue.bind(this, 'menopause')}
                                id={`menopause_id`}
                                value={this.state.menopause}
                              />
                              <label className={`label-title text-left`} style={{marginTop: 8, marginLeft: "0.5rem", width: "1rem"}}>歳</label>
                            </div>
                            <div className={`hankaku-eng-num-input d-flex`}>
                              <input type="text" value={this.state.pregnancy} onChange={this.setValue.bind(this, 'pregnancy')} style={{width: "4rem"}}/>
                              <label className={`label-title text-left`} style={{marginLeft: "0.5rem", width: "2rem"}}>妊</label>
                              <input type="text" value={this.state.production} onChange={this.setValue.bind(this, 'production')} style={{width: "4rem"}}/>
                              <label className={`label-title text-left`} style={{marginLeft: "0.5rem", width: "1rem"}}>産</label>
                            </div>
                          </div>
                          <div className={`clinical-diagnosis border`}>
                            <div className="free-comment">
                              <label>臨床診断</label>
                              <textarea
                                value={this.state.clinical_diagnosis }
                                className={`full-width-input`}
                                onChange={this.setValue.bind(this, 'clinical_diagnosis')}
                                onContextMenu={this.handleMedicineClick}
                                id='clinical_diagnosis_id'
                              />
                            </div>
                            <InputBoxTag
                              label="既往組織診結果"
                              className={`full-width-input`}
                              getInputText={this.setValue.bind(this, 'previous_histology')}
                              value={this.state.previous_histology}
                              id={`previous_histology`}
                            />
                            <InputBoxTag
                              label="実施機関"
                              className={`full-width-input`}
                              getInputText={this.setValue.bind(this, 'done_instruction')}
                              value={this.state.done_instruction}
                              id='done_instruction_id'
                            />
                          </div>
                          <div className={`anticancer-area border`}>
                            <div className={'radio-box d-flex'}>
                              <label className="label-title">抗がん剤</label>
                              {this.radio_option1.map((item,index) => {
                                return (
                                  <div key={index} className="check-area">
                                    <Radiobox
                                      label={item}
                                      value={index}
                                      getUsage={this.setValue.bind(this, "anticancer_use")}
                                      checked={this.state.anticancer_use == index ? true : false}
                                      name="anticancer_use"
                                    />
                                  </div>
                                )
                              })}
                            </div>
                            <div className={'radio-box d-flex'}>
                              <label className="label-title">放射線治療</label>
                              {this.radio_option2.map((item,index) => {
                                return (
                                  <div key={index} className="check-area">
                                    <Radiobox
                                      label={item}
                                      value={index}
                                      getUsage={this.setValue.bind(this, "radiation_treat")}
                                      checked={this.state.radiation_treat == index ? true : false}
                                      name="radiation_treat"
                                    />
                                  </div>
                                )
                              })}
                            </div>
                            <div className={'radio-box d-flex'}>
                              <label className="label-title">ホルモン剤使用</label>
                              {this.radio_option1.map((item,index) => {
                                return (
                                  <div key={index} className="check-area">
                                    <Radiobox
                                      label={item}
                                      value={index}
                                      getUsage={this.setValue.bind(this, "hormon_use")}
                                      checked={this.state.hormon_use == index ? true : false}
                                      name="hormon_use"
                                    />
                                  </div>
                                )
                              })}
                            </div>
                            <InputBoxTag
                              label="種類"
                              className={`full-width-input`}
                              getInputText={this.setValue.bind(this, 'anticancer_kind')}
                              value={this.state.anticancer_kind}
                              id={`anticancer_kind_id`}
                            />
                            <InputBoxTag
                              label="量"
                              className={`hankaku-eng-num-input`}
                              getInputText={this.setValue.bind(this, 'anticancer_amount')}
                              value={this.state.anticancer_amount}
                              id={'anticancer_amount_id'}
                            />
                          </div>
                        </Cytology>
                        {addition_component}
                      </div>
                      <div className="comment mt-2">
                        <div className="order-comment">
                          <label>依頼コメント</label>
                          <input
                            type="text"
                            value={this.state.order_comment }
                            onChange={this.handleOrderComment}
                            id = 'order_comment_id'
                          />
                          <Button type="mono" className={this.state.curFocus === 1?"focus clear": "clear"} onClick={this.clearOrderComment}>C</Button>
                        </div>
                        <div style={{marginLeft:"8rem",marginTop:"5px"}}>
                          <TodayOtherResult>
                            <Checkbox
                              label="至急"
                              getRadio={this.checkOrderCommentUrgent.bind(this)}
                              value={this.state.order_comment_urgent}
                              name="urgent"
                            />
                          </TodayOtherResult>
                          <br />
                          <TodayOtherResult>
                            <Checkbox
                              label="FAX報告"
                              getRadio={this.checkOrderfaxReport.bind(this)}
                              value={this.state.fax_report}
                              name="fax_report"
                            />
                          </TodayOtherResult>
                        </div>
                        <div className="free-comment">
                          <label>フリーコメント</label>
                          <textarea
                            value={this.state.free_comment }
                            onChange={this.handleFreeComment}
                            id='free_comment_id'
                          />
                          <Button type="mono" className={this.state.curFocus === 1?"focus clear": "clear"} onClick={this.clearFreeComment}>C</Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {(this.state.examination_type == EXAMINATION_TYPE.BACTERIAL || this.state.examination_type == EXAMINATION_TYPE.PATHOLOGY) ? ( // 細菌・抗酸菌、病理
                  <>
                    <div className="data-input">
                      <div className="collect">
                        <InputBox>
                          <label>採取日</label>
                          <DatePicker
                            locale="ja"
                            selected={this.state.collected_date}
                            onChange={this.getDate.bind(this, 'collected_date')}
                            dateFormat="yyyy/MM/dd"
                            placeholderText={this.state.not_yet ? "日未定" : "年/月/日"}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            className={this.state.datefocus ? "readline date-area" : "date-area"}
                            dayClassName = {date => setDateColorClassName(date)}
                          />
                        </InputBox>
                        <InputBox>
                          <label>採取時刻</label>
                          <DatePicker
                            selected={this.state.collected_time}
                            onChange={this.getTime.bind(this)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={10}
                            dateFormat="HH:mm"
                            timeFormat="HH:mm"
                            className={"time-area"}
                            timeCaption="時間"
                          />
                        </InputBox>
                        <Button type="mono" onClick={this.delTime}>時刻無し</Button>
                        <Button type="mono" onClick={this.setNextExamDate}>次回診察日</Button>
                        <Button type="mono" onClick={this.noDate}>日未定</Button>
                        <Button type="mono" onClick={this.setAdministratePeriod}>期間指定</Button>
                      </div>
                      <div className="insurance" id="insurance" onContextMenu={e =>
                        this.handleClick(e)}>
                        {this.state.can_insurance_edit ? (
                          <div className="text-right">
                        <span>保険 </span>
                        <select
                          value={this.state.insurance_type}
                          onChange={this.handleInsuranceTypeChange}
                          onKeyPress={this.handleInsuranceTypeChange}
                        >
                          {this.props.patientInfo.insurance_type_list.map(
                            (item, index) => {
                              return (
                                <option value={item.code} key={index}>
                                  {item.name}
                                </option>
                              );
                            }
                          )}
                        </select>
                      </div>
                        ) : (
                          <div className="text-right">
                            保険: {this.getInsurance(this.state.insurance_type)}
                            &nbsp;
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="btn-group">
                      {this.state._exam_category_list != null && this.state._exam_category_list != undefined && this.state._exam_category_list.length > 0 && (
                        this.state._exam_category_list.map(item=>{
                          return <><Button type="mono" className={ this.state._sel_category == item.id?"active": ""} onClick={()=>this.selectCategory(item.id)}>{item.name}</Button></>
                        })
                      )}
                    </div>
                    <div className={'flex variable-area'}>
                        <div className="categoryContent" style={{width: "70%"}}>
                            <ExamCategoryNav
                                selectUsageKind={this.selectTab}
                                id={this.state._sel_tab}
                                diagnosis={this.state._exam_tab_list}
                            />
                            <div className="categoryName" style={{marginLeft: 0}}>
                              <span className="">{this.state._cur_category_name}（{this.state._cur_tab_name}）</span>
                            </div>
                            <div className={this.state._exam_tab_list.length > 0 ? "exam-list":"exam-list tab-exam-list"} style={{marginLeft: 0}}>
                                {examList}
                            </div>
                        </div>
                        <div className="selected-exam" style={{height:"calc(100% - 38px"}}>
                          <div className="del-btn-group min-btn">
                            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick={this.confirmDelete.bind(this, null)}>選択削除</Button>
                            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick={this.confirmDelete.bind(this, 'all')}>全削除</Button>
                          </div>
                            <div className="selected-items" id = 'sel_exams_id' style={{height: "100%"}}>
                              <div style={{width:'100%', background:'#a0ebff'}}>
                                <div className="table-header">
                                    <span className="exam-name w-100">項目名称</span>
                                </div>
                              </div>
                                <div className='table-body'>
                                {this.state.sel_exams !== undefined && this.state.sel_exams !== null && this.state.sel_exams.length > 0 ? (
                                    this.state.sel_exams.map((exam) => {
                                      let exist_today_exam = 0;
                                      if (this.m_unique_exam_array.length > 0 &&
                                        this.m_unique_exam_array.includes(exam.examination_code)) {
                                          exist_today_exam = 1;
                                      }
                                        return (
                                            <>
                                                <div
                                                    className={(this.state.selected_exam_names[exam.examination_code] !== undefined && this.state.selected_exam_names[exam.examination_code] === 1) ? "div-row selected-item" : "div-row"}
                                                    onClick={e => this.selectSelExams(e, exam.examination_code)} style = {{background:exist_today_exam == 1?'LIGHTYELLOW':''}}>
                                                    <span className="exam-name w-100">{exam.name.trim()}</span>
                                                </div>
                                            </>
                                        )
                                    })
                                ) : (
                                    <div className="no-select">選択された項目がありません。</div>
                                )}
                                </div>
                            </div>
                          </div>
                    </div>
                    <div className={'flex'}>
                        <div style={{width:"70%"}}>
                            {addition_component}
                        </div>
                        <div className="comment mt-2">
                            <div className="order-comment">
                                <label>依頼コメント</label>
                                <input
                                    type="text"
                                    value={this.state.order_comment }
                                    onChange={this.handleOrderComment}
                                    id = 'order_comment_id'
                                />
                                <Button type="mono" className={this.state.curFocus === 1?"focus clear": "clear"} onClick={this.clearOrderComment}>C</Button>
                            </div>
                          {this.state.examination_type != 4 && (
                            <div style={{marginLeft:"8rem",marginTop:"5px"}}>
                                <TodayOtherResult>
                                <Checkbox
                                    label="至急"
                                    getRadio={this.checkOrderCommentUrgent.bind(this)}
                                    value={this.state.order_comment_urgent}
                                    name="urgent"
                                />
                                </TodayOtherResult>
                            </div>
                          )}
                            <div className="free-comment">
                                <label>フリーコメント</label>
                                <textarea
                                    value={this.state.free_comment }
                                    onChange={this.handleFreeComment}
                                    id = 'free_comment_id'
                                />
                                <Button type="mono" className={this.state.curFocus === 1?"focus clear": "clear"} onClick={this.clearFreeComment}>C</Button>
                            </div>
                        </div>
                    </div>
                  </>
                ):(<></>)}
              </>
            ) : (
                <>
                    <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                </>
            )}
          </DatePickerBox>
        </Modal.Body>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        <ContextAttentionMenu
          {...this.state.contextAttentionMenu}
          parent={this}
        />
        <Modal.Footer>
          <Button className={`cancel-btn`} onClick={this.confirmCloseModal}>キャンセル</Button>
          <Button className={save_tooltip !== ""? "disable-btn" : "red-btn"}  onClick={this.handleOk}>確定</Button>
        </Modal.Footer>
        {this.state.isExaminationSetPopupOpen && (
          <SelectExaminationSetModal
            closeExaminationSet={this.closeExaminationSet}
            selectExaminationFromModal={this.selectExaminationFromModal}
            preset={this.state._exam_preset_order_list}
            selExams={this.state.sel_exams}
            examOrderList={this.state._exam_order_list}
            handleOk={this.confirm}
          />
        )}
        {this.state.isItemSelectModal && (
            <SelectExaminationItemModal
                selectMaster = {this.setItemName.bind(this)}
                closeModal= {this.closeModal}
                MasterName= {'検査項目'}
                sel_exams= {this.state.sel_exams}
                from_source="order-modal"
            />
        )}
        {this.state.isDeleteConfirmModal !== false && (
          <ConfirmNoFocusModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.deleteDuplicateExam.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
          )}
        {this.state.isClearConfirmModal !== false && (
          <ConfirmNoFocusModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.clearComment.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isOpenAlertOpen !== false && (
          <SystemAlertModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.alert_messages}
              showTitle={true}
              title={this.state.alert_messages_title}
          />
        )}
          {this.state.isUpdateConfirmModal && (
            <ConfirmNoFocusModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.save.bind(this)}
              confirmTitle= {this.state.confirm_message}
          />
          )}
          {this.state.isSelectedDeleteConfirmModal && (
              <ConfirmNoFocusModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.delSelectedItem.bind(this)}
                  confirmTitle= {this.state.confirm_message}
                  title={this.state.confirm_title}
              />
          )}
          {this.state.alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}          
          {this.state.confirm_message !== "" && this.state.confirm_type === "close" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmDeleteCache}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
          {this.state.confirm_message !== "" && this.state.confirm_type === "category_change" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
          {this.state.isOpenShemaModal === true && (
            <ExaminationEditModal              
              closeModal={this.closeShemaModal}
              handlePropInsert={this.registerImage}
              imgBase64={this.state.imgBase64}
            />
          )}
          {this.state.isOpenSelectDiseaseModal && (
            <SelectMedicineModal
              system_patient_id = {this.props.patientId}
              closeModal = {this.closeModal}
              selectDiseaseName = {this.pasteDiseaseName.bind(this)}
            />
          )}
        {this.state.isAdministratePeriodModalOpen && (
          <AdministratePeriodInputExaminationModal
            closeModal={this.closeAdministratePeriodModal}
            saveAdministratePeriod={this.saveAdministratePeriod}
            administrate_period={this.state.administrate_period}
            type="treatment"
          />
        )}
      </Modal>
    );
  }
}
SelectExaminationModal.contextType = Context;
SelectExaminationModal.propTypes = {
  selectDoctorFromModal: PropTypes.func,
  closeExamination: PropTypes.func,
  examinations: PropTypes.array,
  preset: PropTypes.array,
  handleOk: PropTypes.func,
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
  cache_data:PropTypes.object,
  modalName: PropTypes.string,
  examination_type: PropTypes.number,
};

export default SelectExaminationModal;