import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import * as apiClient from "~/api/apiClient";
import {
  formatDateTimeIE,  
  formatDateString,  
  formatDateSlash
} from "~/helpers/date";
import NurseSearchModal from "~/components/templates/Nurse/NurseSearchModal";
import NursePlanModal from "~/components/templates/Nurse/NursePlanModal";
// import NursePlanInstructionModal from "~/components/templates/Nurse/NursePlanInstructionModal";
import NurseInstructionPlanRelationModal from "~/components/templates/Nurse/NurseInstructionPlanRelationModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Button from "~/components/atoms/Button";
// import DiseaseNameModal from "~/components/templates/Patient/Modals/Disease/DiseaseNameModal";
import { patientModalEvent } from "~/events/PatientModalEvent";
// import BigPlanModal from "~/components/templates/Nurse/BigPlanModal";
import BigPlanModalNew from "~/components/templates/Nurse/BigPlanModalNew";
import Spinner from "react-bootstrap/Spinner";
import NurseProfileDatabaseModal from "~/components/templates/Nurse/NurseProfileDatabaseModal";
import NurseProfileModal from "~/components/templates/Nurse/NurseProfileModal";
import { getServerTime} from "~/helpers/constants";
registerLocale("ja", ja);
import * as sessApi from "~/helpers/cacheSession-utils";
import {  
  CACHE_SESSIONNAMES,  
} from "~/helpers/constants";
import * as localApi from "~/helpers/cacheLocal-utils";
import PlanTitleSetModal from "~/components/templates/Nurse/ProgressChart/PlanTitleSetModal";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .spinner-disease-loading{
    height: 20rem;
    overflow-y: auto;      
  }
  .table-scroll {
    width: 100%;
    height: 100%;
    max-height: 190px;

    .no-result {
      padding: 75px;
      text-align: center;

      p {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
  }
 label {
   margin-bottom:0;
   height:2.2rem;
   line-height:2.2rem;
 }
 button {
  height: 2.2rem;
  font-size: 1rem;
 }
 .button-area{
   margin-top:16px;
   button{
     margin-left:10px;
     width:11rem;
   }
 }
.select-period {
    .period-title {    
        line-height: 2.2rem;
        width: 70px;
        text-align: right;
        margin-right: 10px;
    }
    div {
        margin-top: 0;
    }
    input {
      width:7rem;
      height:2.2rem;
    }
    .from-to{
        padding-left:5px;                
        padding-right:5px;    
        line-height: 2.2rem;
    }
    .label-title {
        width: 0;
        margin: 0;
    }
}
.pullbox-select {
    height: 2.2rem;
    width: 10rem;
}
.pullbox {
    .label-title {
        width: 70px;
        text-align: right;
        line-height: 2.2rem;
        margin-right: 10px;
        font-size: 16px;
    }
}
.radio-area {
    label {
        line-height: 2.2rem;
        font-size: 14px;
        width: 100px;
    }
}
.table-title {
    margin-top: 0.5rem;
    label {
        margin-bottom: 0;
    }
    .table-name {
        border: 1px solid #aaa;
        width: 180px;
        text-align: center;
    }
    .table-color {
        width: 100px;
        text-align: center;
    }
    .table-request {
        width: 50px;
        text-align: center;
    }
    .table-ok {
        width: 50px;
        text-align: center;
        border: 1px solid #aaa;
    }
}

.table-area {
  margin-top:16px;
  table {
    font-size: 1rem;
    margin-bottom: 0;
  }
  .clickable{
    padding: 0.1rem !important;
    div{
      background: #efefef;
      border: 2px solid #909090;
    }
  }
  thead{
    margin-bottom: 0;
    display:table;
    width:100%;
    background:rgb(160, 235, 255);
    // border-bottom: 1px solid #dee2e6;
    tr{width: calc(100% - 17px);}
  }
  tbody{
    height: calc(100vh - 20rem);
    overflow-y: scroll;
    display:block;
    // tr:nth-child(even) {background-color: #f2f2f2;}
    // tr:hover{background-color:#e2e2e2;}
  }
  tr{
    display: table;
    width: 100%;
    box-sizing: border-box;
  }
  td {
      padding: 0.25rem;
      text-align: left;
      vertical-align: middle;
      border-bottom: 1px solid #dee2e6;
  }
  th {
      text-align: center;
      padding: 0.3rem;
      border-bottom: 1px solid #dee2e6;
      background-color: rgb(160, 235, 255);
  }      
  .tl {
      text-align: left;
  }      
  .tr {
      text-align: right;
  }
}
.selected {
    background: rgb(105, 200, 225) !important;
    div{
      background: rgb(105, 200, 225) !important;
    }
}
.row-item:hover {
    background:lightblue !important;
}
.react-datepicker-popper {
  .react-datepicker {
    .react-datepicker__navigation--previous, .react-datepicker__navigation--next {
      height:10px !important;
    }
  }
}
.move-btn {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  height: 2rem;
}
`;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
`;

const ContextMenuUl = styled.div`
  margin-bottom:0;
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
      font-size: 1rem;
    }
    img {
      width: 2.2rem;
      height: 2.2rem;
    }
    svg {
      width: 2.2rem;
      margin: 8px 0;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
`;

const ContextMenu = ({visible, x, y, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.openPlanTitleSetModal()}>観察項目編集</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class NurseProblemListModal extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let department_codes = [{id:0, value:"全て"}];
    let diagnosis = {};
    departmentOptions.map(department=>{
      department_codes.push(department);
      diagnosis[parseInt(department.id)] = department.value;
    });
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    this.nurse_profile_simple = 1;
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
      if(initState.conf_data.nurse_profile_simple !== undefined){
        this.nurse_profile_simple = initState.conf_data.nurse_profile_simple;
      }
    }
    let patientId = props.patientId;
    let patientInfo = props.patientInfo;
    let detailedPatientInfo = props.detailedPatientInfo;
    let path = window.location.href.split("/");
    if(path[path.length - 1] == "nursing_document"){
      let nurse_patient_info = localApi.getObject("nurse_patient_info");
      if(nurse_patient_info !== undefined && nurse_patient_info != null){
        patientInfo = nurse_patient_info.patientInfo;
        detailedPatientInfo = nurse_patient_info.detailedPatientInfo;
        patientId = detailedPatientInfo.patient[0]['number'];
      }
    }
    this.state = {
      patientId,
      patientInfo,
      detailedPatientInfo,
      start_date: '',
      end_date: '',
      discharge_route_master:{},
      hospital_room_master:{},
      outcome_reason_master:{},
      department_codes,
      diagnosis,
      department_id:0,
      first_ward_id:0,
      hospitalization_list:[],
      discharge_list:[],      
      hos_number:0,
      alert_messages:"",
      alert_title:'',
      complete_message:"",      
      confirm_message:"",      
      confirm_type:"",      
      isLoaded: false,

      isOpenClassMaster:false,
      isOpenWordProcessor:false,
      isOpenPlanModal:false,
      isOpenBigPlanModal:false,
      isOpenPlanInstructionModal:false,
      isOpenProfileModal:false,
      problem_list:[], 
      updated_problem_numbers:[],
      isCloseConfirmModal:false,
      isSaveProblemsConfirmModal:false,
      confirm_alert_title:'',
      isOpenPlanTitieSetModal:false,
    }
  }

  async componentDidMount() {
    await this.getNurseProblem("init");
  }

  getNurseProblem=async(_flag=null)=> {
    let path = "/app/api/v2/master/nurse/problem_search";
    let post_data = {
      system_patient_id:this.state.patientId,
      order:'asc'
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        if (res!= undefined && res != null && res.length>0){
          let res_array = res;
          this.origin_problem_list = JSON.parse(JSON.stringify(res));
          let _state = {};
          if (_flag == "maintain_cache") {
            // if exist updated plan list
            res_array = [];
            if (this.state.problem_list != undefined && this.state.problem_list != null && this.state.problem_list.length > 0){
              this.state.problem_list.map(item => {
                if (item.number > 0) res_array.push(item);
              })
            }            
            let cur_plan_numbers = [];
            if (res_array.length > 0) {
              res_array.map(ele=>{
                cur_plan_numbers.push(ele.number);
              });
            }
            res.map(item=>{
              if (!cur_plan_numbers.includes(item.number)) {
                res_array.push(item);
              }
            });
          }
          _state.problem_list = res_array;
          _state.isLoaded = true;          
          if (_flag == "init") {
            _state.updated_problem_list = [];
            _state.updated_problem_numbers = [];            
          }
          this.setState(_state);
        } else {
          let _state = {
            problem_list:[],
            isLoaded: true,
          };
          if (_flag == "init") {
            _state.updated_problem_list = [];
            _state.updated_problem_numbers = [];
          }
          this.setState(_state);
        }
        
      })
      .catch(() => {
        this.setState({problem_list:[], isLoaded: true})
      });
  };

  closeModal = (refresh) =>{
    this.setState({
      isOpenClassMaster:false,
      isOpenWordProcessor:false,
      isOpenPlanModal:false,
      isOpenBigPlanModal:false,
      isOpenPlanInstructionModal:false,
      alert_messages:"",
      alert_title:'',
      confirm_message:"",
      confirm_type:"",
      isOpenProfileModal:false,
      isCloseConfirmModal:false,
      isSaveProblemsConfirmModal:false,
      isOpenPlanTitieSetModal:false,
      confirm_alert_title:''
    });
    if (refresh == 'refresh') this.getNurseProblem();
  };

  printPdf=()=>{
    if(this.state.problem_list.length > 0){
      this.setState({
        confirm_message:"印刷しますか？",
        confirm_type: "print"
      });
    }
  };  

  get_title_pdf = async () => {
    let server_time = await getServerTime(); // y/m/d H:i:s
    server_time = formatDateString(new Date(server_time))
    let pdf_file_name = "看護問題リスト_" + server_time + ".pdf";
    return pdf_file_name;
  }

  confirmPrint = async () => {
    this.setState({
      confirm_message:"",
      complete_message:"印刷中"
    });
    let path = "/app/api/v2/master/nurse/plan/problem_list_print";
    let print_data = {};
    print_data.table_data = this.state.problem_list;    
    print_data.patient_info = this.state.patientInfo;

    let pdf_file_name = await this.get_title_pdf();
    axios({
      url: path,
      method: 'POST',
      data:{print_data},
      responseType: 'blob', // important
    }).then((response) => {
      this.setState({complete_message:""});
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      
      if(window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, pdf_file_name);
      }
      else{
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', pdf_file_name); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    })
      .catch(() => {
        this.setState({
          complete_message:"",
          alert_messages:"印刷失敗",
        });
      })
  }

  confirmOk=()=>{
    this.closeModal();    
    // this.openPlanInstructionModal();
    this.saveAllProblem();
  }

  saveAllProblem = async () => {
    let path = "/app/api/v2/master/nurse/save_problem_list";
    var updated_problem_list = this.state.updated_problem_list;
    await apiClient
    ._post(path, {
      params: updated_problem_list
    })
    .then(() => {      
      this.getNurseProblem("init");
    })
    .catch(() => {      
    });
  }

  openClassMaster = () => {
    this.setState({
      isOpenClassMaster:true,
    })
  }

  openWordProcessor = (type=null) => {
    // occur event of patientInfocard    
    if (type == "フリー入力") {      
      patientModalEvent.emit("clickOpenPatientDiseaseFromNursePopup");
    } else if(type == "過去病名参照"){
      patientModalEvent.emit("clickOpenPatientDiseaseFromNursePastPopup");
    }

    // this.setState({
    //   isOpenWordProcessor:true,
    // })
  }

  openPlanModal = (item, index) => {
    if (!(item.number > 0)) return;
    var selected_problem_item = JSON.parse(JSON.stringify(this.state.problem_list[index]));    
    if (!this.state.updated_problem_numbers.includes(selected_problem_item.number)){
      selected_problem_item.evaluation_class_date = new Date();
      selected_problem_item.next_evaluate_date = null;
      if (selected_problem_item.plan_data != undefined && selected_problem_item.plan_data != null && selected_problem_item.plan_data.length > 0){
        selected_problem_item.plan_data.map(item => {
          item.evaluation_class_date = new Date();
          item.next_evaluate_date = null;
        })
      }
    }
    this.setState({
      isOpenPlanModal:true,
      selected_problem_item,
      selected_problem_index : index
    })
    this.selected_origin_item = this.origin_problem_list[index]
  }

  handlePropblemOk = (_problems=null) => {
    if (_problems == null || _problems == undefined || _problems.length < 1) return;    
    var problem_list = this.state.problem_list;
    problem_list = [...problem_list, ..._problems];    
    this.setState({problem_list});
  }

  registerProblem = () => {
    this.setState({
      isSaveProblemsConfirmModal:true,
      confirm_message:'看護問題を登録しますか？',
      confirm_alert_title:'登録確認'
    })
  }

  confirmRegisterProblem = async () => {
    this.closeModal();
    var problem_list = this.state.problem_list;
    if (problem_list == null || problem_list == undefined || problem_list.length < 1) return;
    var _problems = [];
    problem_list.map(item => {
      if (!(item.number > 0)) _problems.push(item);
    })
    if (_problems.length == 0) return;

    let count = 0;
    var created_at = new Date();
    for (let i = 0; i < _problems.length; i ++) {
      created_at.setSeconds(created_at.getSeconds() + 1)
      _problems[i].created_at = created_at;
      let path = "/app/api/v2/master/nurse/problem_register";            
      await apiClient
        ._post(path, {
          params: _problems[i],
          system_patient_id:this.state.patientId,
        })
        .then((res) => {
          // suucess
          if (res.alert_message == "success") {            
            count ++;
          }
        })
        .catch((err) => {
          if (err.response.data) {
            // const { error_messages } = err.response.data;
            // error_msg = error_messages;
          }
          return false;
        });
    }
    this.getNurseProblem("maintain_cache");
    if (count == _problems.length) {
      this.setState({
        alert_messages:'看護問題を登録しました。'
      })
    }
  }

  openBigPlanModal = (_nurse_problem_item,_selected_plan_list) => {
    var selected_problem_index = this.state.selected_problem_index;
    var problem_list = this.state.problem_list;
    problem_list[selected_problem_index] = _nurse_problem_item;
    this.setState({
      isOpenBigPlanModal: true,
      nurse_problem_item: _nurse_problem_item,
      selected_plan_list: _selected_plan_list,
      isOpenPlanModal: false,
      problem_list
    });
  }

  save = () => {
    if (this.check_unsaved_problems == true) return;
    var updated_problem_list = [];
    if (this.state.problem_list != undefined || this.state.problem_list.length > 0){
      this.state.problem_list.map(item => {
        if(this.state.updated_problem_numbers.includes(item.number)){
          updated_problem_list.push(item);
        }
      })
    }
    if (updated_problem_list.length == 0){
      this.setState({alert_messages:'登録した計画がありません。'});
      return;
    }
    this.setState({        
      // isAddConfirmModal:true,
      confirm_message:'計画を確定します。よろしいですか？',
      updated_problem_list
    });
  }

  openPlanInstructionModal = () =>{
    this.closeModal();
    this.setState({
      isOpenPlanInstructionModal: true
    });
  }

  applyPlan = async(added_list) => {    
    if (added_list.length > 0){
      let path = "/app/api/v2/nurse/register_nurse_instruction_from_plan";
      await apiClient._post(path, {params:added_list})
      .then(() => {
        this.closeModal();
        this.setState({
          // alert_messages:"看護指示に反映しました。"
          alert_messages:"登録しました。",
          alert_title:'登録完了',
        })
      })    
    } else {
      this.setState({
        alert_messages:"反映する項目がありません。"
      })
    }
  }

  openProfileModal = () => {
    this.setState({
      isOpenProfileModal:true,
    })
  }

  handleOk = (number, plan_data) => {    
    this.closeModal();
    var updated_problem_numbers = this.state.updated_problem_numbers;
    var problem_list = this.state.problem_list;
    var index = problem_list.map(x => {
      return x.number
    }).indexOf(number);
    problem_list[index].plan_data = plan_data;
    if (!updated_problem_numbers.includes(number)) {
      updated_problem_numbers.push(number);      
    }    
    this.setState({problem_list})
    
    var elapsed_plan_ids = [];
    problem_list.map(item => {
      if (item.plan_data != undefined && item.plan_data != null && item.plan_data.length > 0){
        item.plan_data.map(plan_item => {
          if (plan_item.plan_class_name == 'OP' || plan_item.plan_class_name == 'EP' || plan_item.plan_class_name == 'TP'){
            if (plan_item.active_state == 1) elapsed_plan_ids.push(plan_item.nurse_plan_id);
          }
        })
      }
    })
    this.setState({
      elapsed_plan_ids,
      isOpenPlanTitieSetModal:true,
    })
  }

  openPlanTitleSetModal = () => {
    var problem_list = this.state.problem_list;
    var elapsed_plan_ids = [];
    problem_list.map(item => {
      if (item.plan_data != undefined && item.plan_data != null && item.plan_data.length > 0){
        item.plan_data.map(plan_item => {
          if (plan_item.plan_class_name == 'OP' || plan_item.plan_class_name == 'EP' || plan_item.plan_class_name == 'TP'){
            if (plan_item.active_state == 1) elapsed_plan_ids.push(plan_item.nurse_plan_id);
          }
        })
      }
    })
    this.setState({      
      isOpenPlanTitieSetModal:true,
      elapsed_plan_ids
    })
  }

  closeThisModal = () => {
    if (this.check_unsaved_problems){
      this.setState({
        isCloseConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title: "入力中",
      })
      return;
    }
    this.props.closeModal();
  }

  moveStair = (index, step) => {
    var problem_list = this.state.problem_list;
    if (problem_list == undefined || problem_list == null || problem_list.length == 0) return;
    if (problem_list[index + step] == undefined || problem_list[index + step].number > 0) return;
    var temp = problem_list[index];
    problem_list[index] = problem_list[index + step];
    problem_list[index + step] = temp;
    this.setState({problem_list})
  }

  handleClick = (e) => {    
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
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      
      var modal = document.getElementsByClassName('problem-list-modal')[0];
      var modal_body = document.getElementById('outpatient');
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - modal_body.offsetLeft,
          y: e.clientY + window.pageYOffset - modal.offsetTop
        },        
      });
    }
  }

  render() {
    var {problem_list} = this.state;
    this.check_unsaved_problems = false;
    if (problem_list.length > 0){
      problem_list.map((item) => {
        if (!(item.number > 0)) this.check_unsaved_problems = true;
      })
    }
    return (
      <>
        <Modal
          show={true}
          id="outpatient"
          className="custom-modal-sm patient-exam-modal bed-control-modal first-view-modal problem-list-modal"
        >
          <Modal.Header><Modal.Title>看護問題リスト</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'flex button-area'} style={{paddingTop:"0.5rem"}}>
                <Button type="common" onClick={this.openProfileModal.bind(this)}>{this.nurse_profile_simple?'看護データベース':'看護プロファイル'}</Button>
                {/* <Button type="common" onClick={this.openClassMaster.bind(this)}>階層マスタ</Button> */}
                {/* <Button type="common" onClick={this.openWordProcessor.bind(this, "フリー入力")}>ワープロ登録</Button> */}
                <Button type="common" onClick={this.openWordProcessor.bind(this, "過去病名参照")}>過去歴参照</Button>
                <Button type="common" onClick={this.openClassMaster.bind(this)}>新規作成</Button>
                {this.check_unsaved_problems && (
                  <Button type="common" onClick={this.registerProblem}>問題番号確定</Button>
                )}
                {/* <Button type="common" onClick={this.printPdf}>印刷</Button> */}
              </div>              
              <div className={'table-area'}>
                <table className="table-scroll table table-bordered">
                  <thead>
                  <tr>
                    <th style={{width:"4rem"}}>No</th>
                    <th>内容</th>
                    <th style={{width:"10rem"}}>登録日</th>
                    <th style={{width:"10rem"}}>登録者</th>
                    <th style={{width:"10rem"}}>評価日</th>
                    <th style={{width:"10rem"}}>評価</th>
                    <th style={{width:"10rem"}}>次回評価日</th>
                  </tr>
                  </thead>
                  <tbody id = 'code-table'>
                    {this.state.isLoaded == false ? (
                        <div className='spinner-disease-loading center'>
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                      </div>
                    ):(
                      <>
                        {problem_list.length > 0 ? (
                          problem_list.map((item, index) => {
                            return(
                              <>
                              <tr onContextMenu={e => this.handleClick(e)}>
                                <td onClick={this.openPlanModal.bind(this,item,  index)}
                                  className={(this.state.updated_problem_numbers.includes(item.number)?'text-center selected ':'text-center ') + (item.number>0?'clickable':'')}
                                  style={{width:"4rem", background: item.number>0?'none':'lightyellow'}}>
                                  <div>#{index + 1}</div>
                                </td>
                                <td>{item.name}</td>
                                <td className='text-center' style={{width:"10rem"}}>{formatDateSlash(formatDateTimeIE(item.created_at))}</td>
                                <td style={{width:"10rem"}}>{item.creater_name}</td>
                                <td className='text-center' style={{width:"10rem"}}>{formatDateSlash(formatDateTimeIE(item.evaluation_class_date))}</td>
                                <td style={{width:"10rem"}}>{item.evaluation_name}</td>
                                <td className='text-center' style={{width:"10rem"}}>
                                  {item.number > 0 ? formatDateSlash(formatDateTimeIE(item.next_evaluate_date)): (
                                    <>
                                      <button className='move-btn' onClick = {this.moveStair.bind(this, index, -1)}>↑</button>
                                      <button className='move-btn' onClick = {this.moveStair.bind(this, index, 1)}>↓</button>
                                    </>
                                  )}

                                </td>
                              </tr>
                              </>
                            )
                          })
                        ):(
                          <>
                            {this.state.isLoaded && (
                              <div className="table-scroll"><div className="no-result"><p>登録されたデータがありません。</p></div></div>
                            )}
                          </>                          
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.closeThisModal}>閉じる</Button>
            <Button className={this.check_unsaved_problems?'disable-btn':"red-btn"} onClick={this.save}>確定</Button>
          </Modal.Footer>
          {this.state.isOpenClassMaster && (
            <NurseSearchModal
              handleOk = {this.handlePropblemOk}
              // registerProblem={this.registerProblem}
              closeModal={this.closeModal}              
            />
          )}
          
          {this.state.isOpenPlanModal && (
            <NursePlanModal
              closeModal={this.closeModal}
              openBigPlanModal={this.openBigPlanModal}
              nurse_problem_item={this.state.selected_problem_item}
              selected_origin_item = {this.selected_origin_item}
              patientInfo = {this.state.patientInfo}
              patientId = {this.state.patientId}              
            />
          )}          
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
              showTitle = {this.state.alert_title!=''?true:false}
              title = {this.state.alert_title}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.confirm_message !== "" && this.state.confirm_type == "print" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmPrint.bind(this)}   
              confirmTitle= {this.state.confirm_message}           
            />
          )}
          {this.state.isCloseConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm={this.closeModal.bind(this)}
              confirmCancel={this.closeModal.bind(this)}
              confirmOk={this.props.closeModal}
              confirmTitle={this.state.confirm_message}
              title={this.state.confirm_alert_title}
            />
          )}
          {this.state.isSaveProblemsConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm={this.closeModal.bind(this)}
              confirmCancel={this.closeModal.bind(this)}
              confirmOk={this.confirmRegisterProblem}
              confirmTitle={this.state.confirm_message}
              title={this.state.confirm_alert_title}
            />
          )}
          {this.state.isOpenBigPlanModal && (
            <BigPlanModalNew
              closeModal={this.closeModal}              
              nurse_problem_item = {this.state.nurse_problem_item}
              planDataFromNormalPlanModal={this.state.selected_plan_list}
              patientInfo = {this.state.patientInfo}
              patientId = {this.state.patientId}
              handleOk = {this.handleOk}
              selected_problem_index = {this.state.selected_problem_index}
            />
          )}
          {this.state.isOpenPlanInstructionModal && (
            <NurseInstructionPlanRelationModal
              closeModal={this.closeModal}
              // problem_list = {this.state.problem_list}
              problem_list = {this.state.updated_problem_list}
              patientInfo = {this.state.patientInfo}
              patientId = {this.state.patientId}
              applyPlan = {this.applyPlan}
            />
          )}
          {this.state.isOpenPlanTitieSetModal && (
            <PlanTitleSetModal
              closeModal={this.closeModal}
              elapsed_plan_ids = {this.state.elapsed_plan_ids}
              system_patient_id = {this.state.patientId}              
            />
          )}
          {this.state.isOpenProfileModal && this.nurse_profile_simple == 1 && (
            <>
            <NurseProfileDatabaseModal
              closeModal={this.closeModal}
              patientInfo = {this.state.patientInfo}
              patientId = {this.state.patientId}
              detailedPatientInfo = {this.state.detailedPatientInfo}
              from={'nurseProblemList'}
            />
            </>
          )}
          {this.state.isOpenProfileModal && this.nurse_profile_simple != 1 && (
            <>
            <NurseProfileModal
              closeModal={this.closeModal}
              patientInfo = {this.state.patientInfo}
              patientId = {this.state.patientId}
              detailedPatientInfo = {this.state.detailedPatientInfo}
              from={'nurseProblemList'}
            />
            </>
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
          />
        </Modal>
      </>
    );
  }
}

NurseProblemListModal.propTypes = {
  closeModal: PropTypes.func,
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  detailedPatientInfo : PropTypes.object
};

export default NurseProblemListModal;
