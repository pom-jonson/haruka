import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as sessApi from "~/helpers/cacheSession-utils";
import Radiobox from "~/components/molecules/Radiobox";
import {formatDateLine} from "~/helpers/date";
import {secondary, surface} from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import { formatDateSlash } from "../../../helpers/date";
import {getInspectionName} from "~/helpers/constants";
import Button from "~/components/atoms/Button";

const Wrapper = styled.div`
  width:100%;
  height: 100%;
  .flex {display: flex;}
  .inspection-period {
    div {margin-top:0;}
    .react-datepicker-popper {
      margin-top:10px;
    }
    .from-to{
      padding: 0 0.5rem;
      line-height: 2rem;
      height: 2rem;
    }
    .label-title {
      width: 0;
      margin: 0;
    }
    input {
      height: 2rem;
      width: 6rem;
      font-size: 1rem;
    }
  }
  .row-item {
    cursor:pointer;
    padding-left: 5px;
  }
  .selected{
    background: lightblue;
  }
  .div-title {
    margin-top: 0.5rem;
    line-height: 2rem;
    margin-right: 0.5rem;
    height: 2rem;
  }
  .period-check {
    label {
      font-size: 1rem;
      line-height: 2rem;
      margin-left: 0.5rem;
      input {height: 15px;}
    }
  }
  .patient-id {
    .label-title {
      font-size: 1rem;
      text-align: right;
      width: 80px;
      margin: 0;
      margin-right: 0.5rem;
      line-height: 2rem;
    }
    input {
      width: calc(100% - 100px);
      height: 2rem;
      font-size: 1rem;
    }
  }
  .karte-status {
    margin-top: 0.5rem;
    .label-title {
      font-size: 1rem;
      text-align: right;
      line-height: 2rem;
      width: 80px;
      margin: 0;
      margin-right: 0.5rem;
    }
    .pullbox-label {
      width: calc(100% - 100px);
      select {
        width: 100%;
        height: 2rem;
        font-size: 1rem;
      }
    }
  }
  .select-department {
    width: 20%;
    button {
      margin-bottom: -1px;
    }
    .department-name {
      width: 100%;
      border: 1px solid #aaa;
      height: 100px;
      overflow-y: auto;
    }
  }
  .justify-content {
    -webkit-box-pack: justify;
    justify-content: space-between;
  }
  .select-sort {
    .pullbox {
      width: calc(100% - 200px);
      .label-title {
        font-size: 1rem;
        text-align: right;
        margin-right: 10px;
        line-height: 2rem;
      }
      .pullbox-label {
        width: calc(100% - 100px);
        .pullbox-select {
          width: 100%;
          font-size: 1rem;
          height: 2rem;
        }
      }
    }
    .radio-area {
      label {
        font-size: 14px;
        line-height: 38px;
        margin-left: 10px;
      }
    }
  }
  .table-area {
    position: relative;
    height: calc(100% - 440px);
    margin-bottom:0;
    thead{
      display: table;
      width:100%;
    }
    tbody{
      height: calc(90vh - 41rem);
      overflow-y:auto;
      display:block;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
      padding: 0.25rem;
      text-align: left;
    }
    th {
      background-color: ${secondary};
      color: ${surface};
      text-align: center;
      padding: 0.3rem;
    }
    .tl {
      text-align: left;
    }
    .tr {
      text-align: right;
    }
    .no-result {
      text-align: center;
      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
  }
  .btn-area {
    .left-btn {
      button {
        margin-top: 2.5rem;
      }
    }
    .right-btn {
      margin-left: auto;
      margin-right: 0;
      button {
        width: 120px;
        margin-bottom: 0.5rem;
        margin-left: 0.5rem;
      }
    }
  }
`;

const ContextMenuUl = styled.ul`
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
    width:180px;
  }
  .context-menu li {
    clear: both;
    width: 180px;
    border-radius: 4px;
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
    color:black;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({visible,x,y,parent,selected_item_index}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction("treat_stop",selected_item_index)}>未読にする</div></li>
          <li><div onClick={() => parent.contextMenuAction("treat_stop",selected_item_index)}>既読にする</div></li>
          <li><div onClick={() => parent.contextMenuAction("treat_stop",selected_item_index)}>レポート作成</div></li>
          <li><div onClick={() => parent.contextMenuAction("karte_view",selected_item_index)}>カルテ開く</div></li>
          <li><div onClick={() => parent.contextMenuAction("treat_stop",selected_item_index)}>レポート表示</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
}

class ReportCreatListModal extends Component {
  constructor(props) {
    super(props);
    let cur_date = new Date();
    this.state = {
      start_date: new Date(cur_date.getTime() - 60 * 60 * 24 * 7 * 1000),
      end_date: cur_date,
      check_unopened: false,
      karte_status: 0,
      department_codes: [],
      status_codes: [],
      request_doctors: [],
      done_doctors: [],
      charge_doctors: [],
      sort_kind1: 0,
      sort_kind2: 1,
      sort_kind3: 2,
      sort_type1: 0,
      sort_type2: 0,
      sort_type3: 0,
      list_data:[],
      selected_order_name:'',
      selected_order:'',
      order_sub_codes:[],
      order_sub_types:[],
      complete_message:"",
      alert_messages:"",
      patient_id:'',
      isOpenKarteModeModal:false,
    };
    this.karte_status_data = [{id: 0, value: "共通"}, {id: 1, value: "外来"}, {id: 3, value: "入院"}];
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.departmentCodes = {};
    this.departmentOptions.map(department=>{
      this.departmentCodes[department.id] = department.value;
    });
    this.statusData = [{id: 0, value: "未作成"}, {id: 1, value: "作成中"}, {id: 2, value: "確認済"}];
    this.inspection_types = [
      {id: 1, value: "心電図"},
      {id: 2, value: "負荷心電図"},
      {id: 3, value: "ABI"},
      {id: 4, value: "脳波"},
      {id: 5, value: "腹部エコー"},
      {id: 6, value: "心臓エコー"},
      {id: 7, value: "肺機能検査"},
      {id: 8, value: "PSG"},
      {id: 9, value: "ホルター心電図"},
      {id: 10, value: "聴力"},
      {id: 11, value: "24時間血圧"},
      {id: 12, value: "頸動脈エコー"},
      {id: 13, value: "下肢血管エコー"},
      {id: 14, value: "表在エコー"},
      {id: 15, value: "乳腺エコー"},
      {id: 16, value: "健診エコー"},
      {id: 19, value: "眼底検査"},
      {id: 20, value: "甲状腺エコー"},
      {id: 21, value: "サーモグラフィー"},
      {id: 22, value: "残尿測定エコー"},
      {id: 23, value: "呼気検査"},
      {id: 24, value: "前立腺エコー"},
      {id: 25, value: "その他エコー"},
    ];
    this.endoscope_types = [
      {id: 17, value: "内視鏡"},
    ];
    this.radiation_types = [
      {id:1, value:"X線"},
      {id:2, value:"透視造影TV"},
      {id:3, value:"CT"},
      {id:4, value:"MRI"},
      {id:5, value:"MRI（藤井寺市民）"},
      {id:6, value:"MMG"},
      {id:7, value:"眼底検査"},
      {id:8, value:"他医撮影診断"},
    ];
    this.rehabily_types = [
      {id: 0, value: "リハビリ"},
    ];
    this.doctor_list = [];
    let doctor_code_list = [];
    let doctor_data = sessApi.getDoctorList();
    doctor_data.map(doctor=>{
      let index = doctor_code_list.indexOf(doctor.doctor_code);
      if(index === -1){
        doctor_code_list.push(doctor.doctor_code);
        this.doctor_list.push(doctor);
      }
    });
    this.sort_Kind = [{id:0, value:"開封"},{id:1, value:"患者ID"},{id:2, value:"診療科"}];
    this.modal_title = "レポート作成一覧";
    this.order_types = [{id: 0, value: "生理検査", type:"inspection"}, {id: 1, value: "内視鏡検査", type:"endoscope"}, {id: 2, value: "放射線", type:"radiation"}, {id: 3, value: "リハビリ", type:"rehabily"}];
    switch (props.report_creat_list_type){
      case "rehabily":
        this.modal_title = "レポート一覧（リハ）";
        this.order_types = [{id: 3, value: "リハビリ", type:"rehabily"}];
        break;
      case "radiation":
        this.modal_title = "レポート一覧（放射線）";
        this.order_types = [{id: 2, value: "放射線", type:"radiation"}];
        break;
      case "inspection":
        this.modal_title = "レポート一覧（生理）";
        this.order_types = [{id: 0, value: "生理検査", type:"inspection"}];
        break;
      case "endoscope":
        this.modal_title = "レポート一覧（内視鏡）";
        this.order_types = [{id: 1, value: "内視鏡検査", type:"endoscope"}];
        break;
    }
  }
  
  async componentDidMount() {
    switch (this.props.report_creat_list_type){
      case "rehabily":
        this.selectOrder("rehabily", "リハビリ");
        break;
      case "radiation":
        this.selectOrder("radiation", "放射線");
        break;
      case "inspection":
        this.selectOrder("inspection", "生理検査");
        break;
      case "endoscope":
        this.selectOrder("endoscope", "内視鏡検査");
        break;
    }
  }
  
  searchList=async()=>{
    let sort_kind = {0:"",1:"patient_number",2:"medical_department_code"};
    this.setState({complete_message:"検索中"});
    let path = "/app/api/v2/report/search";
    let post_data = {
      start_date:(this.state.start_date != null && this.state.start_date !== "") ? formatDateLine(this.state.start_date) : "",
      end_date:(this.state.end_date != null && this.state.end_date !== "") ? formatDateLine(this.state.end_date) : "",
      department_codes:this.state.department_codes,
      status_codes:this.state.status_codes,
      karte_status:this.state.karte_status,
      request_doctors:this.state.request_doctors,
      done_doctors:this.state.done_doctors,
      charge_doctors:this.state.charge_doctors,
      selected_order:this.state.selected_order,
      order_sub_codes:this.state.order_sub_codes,
      patient_id:this.state.patient_id,
      sort_kind1:sort_kind[this.state.sort_kind1],
      sort_kind2:sort_kind[this.state.sort_kind2],
      sort_kind3:sort_kind[this.state.sort_kind3],
      sort_type1:this.state.sort_type1,
      sort_type2:this.state.sort_type2,
      sort_type3:this.state.sort_type3,
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        this.setState({
          complete_message:"",
          list_data:res
        });
      })
      .catch(() => {
        this.setState({complete_message:""});
      })
  }
  
  setPeriod=(key,value)=>{
    this.setState({[key]:value});
  };
  
  getCheckUnopened = (name, value) => {
    if (name === "view_unopened"){
      this.setState({
        check_unopened: value,
      });
    }
  };
  
  setPatientId = e => {
    this.setState({patient_id: e.target.value})
  };
  
  setKarteStatus = (e) => {
    this.setState({
      karte_status:parseInt(e.target.id),
    });
  };
  
  selectDepartment=(department_code)=>{
    let department_codes = this.state.department_codes;
    if(department_code === "all"){
      department_codes = [];
      this.departmentOptions.map(department=>{
        department_codes.push(department.id);
      })
    } else {
      let index = department_codes.indexOf(department_code);
      if(index === -1){
        department_codes.push(department_code);
      } else {
        department_codes.splice(index, 1);
      }
    }
    this.setState({department_codes});
  }
  
  selectStatus=(status_code)=>{
    let status_codes = this.state.status_codes;
    if(status_code === "all"){
      status_codes = [];
      this.statusData.map(status=>{
        status_codes.push(status.id);
      })
    } else {
      let index = status_codes.indexOf(status_code);
      if(index === -1){
        status_codes.push(status_code);
      } else {
        status_codes.splice(index, 1);
      }
    }
    this.setState({status_codes});
  };
  
  selectOrder=(type, value)=>{
    let order_sub_types = [];
    switch (type){
      case "inspection":
        order_sub_types = this.inspection_types;
        break;
      case "endoscope":
        order_sub_types = this.endoscope_types;
        break;
      case "radiation":
        order_sub_types = this.radiation_types;
        break;
      case "rehabily":
        order_sub_types = this.rehabily_types;
        break;
    }
    this.setState({
      selected_order:type,
      selected_order_name:value,
      order_sub_types,
      order_sub_codes:[],
    });
  };
  
  selectOrderSubType=(inspection_code)=>{
    let order_sub_codes = this.state.order_sub_codes;
    if(inspection_code === "all"){
      order_sub_codes = [];
      if(this.state.order_sub_types.length > 0){
        this.state.order_sub_types.map(status=>{
          order_sub_codes.push(status.id);
        })
      }
    } else {
      let index = order_sub_codes.indexOf(inspection_code);
      if(index === -1){
        order_sub_codes.push(inspection_code);
      } else {
        order_sub_codes.splice(index, 1);
      }
    }
    this.setState({order_sub_codes});
  };
  
  selectRequestDoctor=(doctor_code)=>{
    let request_doctors = this.state.request_doctors;
    if(doctor_code === "all"){
      request_doctors = [];
      this.doctor_list.map(doctor=>{
        request_doctors.push(doctor.doctor_code);
      })
    } else {
      let index = request_doctors.indexOf(doctor_code);
      if(index === -1){
        request_doctors.push(doctor_code);
      } else {
        request_doctors.splice(index, 1);
      }
    }
    this.setState({request_doctors});
  };
  
  selectDoneDoctor=(doctor_code)=>{
    let done_doctors = this.state.done_doctors;
    if(doctor_code === "all"){
      done_doctors = [];
      this.doctor_list.map(doctor=>{
        done_doctors.push(doctor.doctor_code);
      })
    } else {
      let index = done_doctors.indexOf(doctor_code);
      if(index === -1){
        done_doctors.push(doctor_code);
      } else {
        done_doctors.splice(index, 1);
      }
    }
    this.setState({done_doctors});
  };
  
  selectChargeDoctor=(doctor_code)=>{
    let charge_doctors = this.state.charge_doctors;
    if(doctor_code === "all"){
      charge_doctors = [];
      this.doctor_list.map(doctor=>{
        charge_doctors.push(doctor.doctor_code);
      })
    } else {
      let index = charge_doctors.indexOf(doctor_code);
      if(index === -1){
        charge_doctors.push(doctor_code);
      } else {
        charge_doctors.splice(index, 1);
      }
    }
    this.setState({charge_doctors});
  };
  
  setSortKind1 = (e) => {
    this.setState({
      sort_kind1:parseInt(e.target.id),
    });
  };
  
  setSortKind2 = (e) => {
    this.setState({
      sort_kind2:parseInt(e.target.id),
    });
  };
  
  setSortKind3 = (e) => {
    this.setState({
      sort_kind3:parseInt(e.target.id),
    });
  };
  
  setSortType1 = (e) => {
    this.setState({sort_type1:parseInt(e.target.value)});
  };
  
  setSortType2 = (e) => {
    this.setState({sort_type2:parseInt(e.target.value)});
  };
  
  setSortType3 = (e) => {
    this.setState({sort_type3:parseInt(e.target.value)});
  };
  
  confirmSearch=()=> {
    let alert_messages = "";
    if(this.state.order_sub_codes.length === 0){
      alert_messages = "検査種別を選択してください。";
    }
    if(this.state.selected_order === ''){
      alert_messages = "オーダー種別を選択してください。";
    }
    // if(this.state.status_codes.length === 0){
    //     alert_messages = "状態を選択してください。";
    // }
    if(this.state.department_codes.length === 0){
      alert_messages = "診療科を選択してください。";
    }
    if(alert_messages !== ""){
      this.setState({alert_messages});
    } else {
      this.searchList();
    }
  };
  
  confirmCancel=()=>{
    this.setState({
      alert_messages:"",
      isOpenKarteModeModal:false,
    });
  };
  
  handleClick=(e, key)=>{
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("code-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: {visible: false}
          });
          document
            .getElementById("code-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX-200,
          y: e.clientY + window.pageYOffset - 100,
        },
        selected_item_index:key,
      })
    }
  }
  
  contextMenuAction = (act, index) => {
    if( act === "karte_view") {
      this.goKartePage(index);
    }
  };
  
  goKartePage = async(index) => {
    let data = this.state.list_data[index];
    let patients_list = this.context.patientsList;
    let isExist = 0;
    if(patients_list !== undefined && patients_list != null && patients_list.length > 0){
      patients_list.map(item=>{
        if (item.system_patient_id == data.system_patient_id) {
          isExist = 1;
        }
      });
    }
    if (patients_list != undefined && patients_list != null && patients_list.length > 3 && isExist == 0) {
      this.setState({alert_messages: '4人以上の患者様を編集することはできません。'});
      return;
    }
    if (isExist == 0) { // new patient connect
      let modal_data = {
        systemPatientId:data['system_patient_id'],
        date:data['treatment_date'],
        medical_department_code:data['medical_department_code'],
        department_name:this.departmentCodes[data['medical_department_code']],
      };
      this.setState({
        isOpenKarteModeModal: true,
        modal_data,
      });
    } else { // exist patient connect
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      const page = authInfo.karte_entrance_page == undefined || authInfo.karte_entrance_page == "" ? "soap" : authInfo.karte_entrance_page;
      this.goToUrlFunc("/patients/"+data.system_patient_id+"/"+page);
    }
  };
  
  goToUrlFunc = (url) => {
    this.props.goToPage(url);
    this.setState({isOpenKarteModeModal: false});
    this.props.closeModal();
  };
  
  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal report-creat-list-modal first-view-modal">
          <Modal.Header><Modal.Title>{this.modal_title}</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'inspection-period flex'}>
                <div className={'div-title'}>検査予定日</div>
                <InputWithLabel
                  type="date"
                  getInputText={this.setPeriod.bind(this, 'start_date')}
                  diseaseEditData={this.state.start_date}
                />
                <div className={'from-to'}>～</div>
                <InputWithLabel
                  type="date"
                  getInputText={this.setPeriod.bind(this, 'end_date')}
                  diseaseEditData={this.state.end_date}
                />
                <div className={'period-check'}>
                  <Checkbox
                    label="未開封のみ表示"
                    getRadio={this.getCheckUnopened.bind(this)}
                    value={this.state.check_unopened}
                    name="view_unopened"
                  />
                </div>
              </div>
              <div className={'flex justify-content'}>
                <div style={{width:"20%"}}>
                  <div className={'patient-id'}>
                    <InputWithLabel
                      label="患者ID"
                      type="number"
                      getInputText={this.setPatientId.bind(this)}
                      diseaseEditData={this.state.patient_id}
                    />
                  </div>
                  <div className={'karte-status'}>
                    <SelectorWithLabel
                      title="入外"
                      options={this.karte_status_data}
                      getSelect={this.setKarteStatus}
                      departmentEditCode={this.state.karte_status}
                    />
                  </div>
                </div>
                <div className={'select-department'}>
                  <div className={'flex'}>
                    <div style={{lineHeight:"2rem", width:"calc(100% - 70px)"}}>診療科</div>
                    <div style={{width:"70px", textAlign:"right"}}>
                      <Button type="common" onClick={this.selectDepartment.bind(this, 'all')}>全科</Button>
                    </div>
                  </div>
                  <div className={'department-name'}>
                    {this.departmentOptions.map((department)=>{
                      return (
                        <>
                          <div
                            className={this.state.department_codes.includes(department.id) ? 'row-item selected' : 'row-item'}
                            onClick={this.selectDepartment.bind(this, department.id)}
                          >
                            {department.value}
                          </div>
                        </>
                      )
                    })}
                  </div>
                </div>
                <div className={'select-department'} style={{marginLeft:"10px"}}>
                  <div className={'flex'}>
                    <div style={{lineHeight:"2rem", width:"calc(100% - 70px)"}}>状態</div>
                    <div style={{width:"70px", textAlign:"right"}}>
                      <Button type="common" onClick={this.selectStatus.bind(this, 'all')}>すべて</Button>
                    </div>
                  </div>
                  <div className={'department-name'}>
                    {this.statusData.map((status)=>{
                      return (
                        <>
                          <div
                            className={this.state.status_codes.includes(status.id) ? 'row-item selected' : 'row-item'}
                            onClick={this.selectStatus.bind(this, status.id)}
                          >
                            {status.value}
                          </div>
                        </>
                      )
                    })}
                  </div>
                </div>
                <div className={'select-department'} style={{marginLeft:"10px"}}>
                  <div className={'flex'}>
                    <div style={{lineHeight:"2rem", width:"calc(100% - 100px)"}}>オーダー種別</div>
                    {/*<button style={{width:"100px"}}>{this.state.selected_order_name}</button>*/}
                  </div>
                  <div className={'department-name'}>
                    {this.order_types.map((order)=>{
                      return (
                        <>
                          <div
                            className={this.state.selected_order === order.type ? 'row-item selected' : 'row-item'}
                            onClick={this.selectOrder.bind(this, order.type, order.value)}
                          >
                            {order.value}
                          </div>
                        </>
                      )
                    })}
                  </div>
                </div>
                <div className={'select-department'} style={{marginLeft:"10px"}}>
                  <div className={'flex'}>
                    <div style={{lineHeight:"2rem", width:"calc(100% - 70px)"}}>検査種別</div>
                    <div style={{width:"70px", textAlign:"right"}}>
                      <Button type="common" onClick={this.selectOrderSubType.bind(this, 'all')}>すべて</Button>
                    </div>
                  </div>
                  <div className={'department-name'}>
                    {this.state.order_sub_types.length > 0 && this.state.order_sub_types.map((order_sub)=>{
                      return (
                        <>
                          <div
                            className={this.state.order_sub_codes.includes(order_sub.id) ? 'row-item selected' : 'row-item'}
                            onClick={this.selectOrderSubType.bind(this, order_sub.id)}
                          >
                            {order_sub.value}
                          </div>
                        </>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className={'flex justify-content'} style={{marginTop:"0.5rem"}}>
                <div className={'select-department'} style={{width:"calc(20% - 10px)"}}>
                  <div className={'flex'}>
                    <div style={{lineHeight:"2rem", width:"calc(100% - 70px)"}}>依頼医師</div>
                    <div style={{width:"70px", textAlign:"right"}}>
                      <Button type="common" onClick={this.selectRequestDoctor.bind(this, 'all')}>すべて</Button>
                    </div>
                  </div>
                  <div className={'department-name'}>
                    {this.doctor_list.map((doctor)=>{
                      return (
                        <>
                          <div
                            className={this.state.request_doctors.includes(doctor.doctor_code) ? 'row-item selected' : 'row-item'}
                            onClick={this.selectRequestDoctor.bind(this, doctor.doctor_code)}
                          >
                            {doctor.name}
                          </div>
                        </>
                      )
                    })}
                  </div>
                </div>
                <div className={'select-department'} style={{width:"calc(20% - 10px)", marginLeft:"10px"}}>
                  <div className={'flex'}>
                    <div style={{lineHeight:"2rem", width:"calc(100% - 70px)"}}>実施医師</div>
                    <div style={{width:"70px", textAlign:"right"}}>
                      <Button type="common" onClick={this.selectDoneDoctor.bind(this, 'all')}>すべて</Button>
                    </div>
                  </div>
                  <div className={'department-name'}>
                    {this.doctor_list.map((doctor)=>{
                      return (
                        <>
                          <div
                            className={this.state.done_doctors.includes(doctor.doctor_code) ? 'row-item selected' : 'row-item'}
                            onClick={this.selectDoneDoctor.bind(this, doctor.doctor_code)}
                          >
                            {doctor.name}
                          </div>
                        </>
                      )
                    })}
                  </div>
                </div>
                <div className={'select-department'} style={{width:"calc(20% - 10px)", marginLeft:"10px"}}>
                  <div className={'flex'}>
                    <div style={{lineHeight:"2rem", width:"calc(100% - 70px)"}}>担当医師</div>
                    <div style={{width:"70px", textAlign:"right"}}>
                      <Button type="common" onClick={this.selectChargeDoctor.bind(this, 'all')}>すべて</Button>
                    </div>
                  </div>
                  <div className={'department-name'}>
                    {this.doctor_list.map((doctor)=>{
                      return (
                        <>
                          <div
                            className={this.state.charge_doctors.includes(doctor.doctor_code) ? 'row-item selected' : 'row-item'}
                            onClick={this.selectChargeDoctor.bind(this, doctor.doctor_code)}
                          >
                            {doctor.name}
                          </div>
                        </>
                      )
                    })}
                  </div>
                </div>
                <div style={{width:"40%"}}>
                  <div style={{paddingLeft:"70px"}}>ソート条件</div>
                  <div className={'select-sort flex'}>
                    <SelectorWithLabel
                      title="第一候補"
                      options={this.sort_Kind}
                      getSelect={this.setSortKind1}
                      departmentEditCode={this.state.sort_kind1}
                    />
                    <div className={'radio-area flex'}>
                      <Radiobox
                        label={'昇順'}
                        value={0}
                        getUsage={this.setSortType1.bind(this)}
                        checked={this.state.sort_type1 === 0}
                        name={`sort_type1`}
                      />
                      <Radiobox
                        label={'降順'}
                        value={1}
                        getUsage={this.setSortType1.bind(this)}
                        checked={this.state.sort_type1 === 1}
                        name={`sort_type1`}
                      />
                    </div>
                  </div>
                  <div className={'select-sort flex'}>
                    <SelectorWithLabel
                      title="第二候補"
                      options={this.sort_Kind}
                      getSelect={this.setSortKind2}
                      departmentEditCode={this.state.sort_kind2}
                    />
                    <div className={'radio-area flex'}>
                      <Radiobox
                        label={'昇順'}
                        value={0}
                        getUsage={this.setSortType2.bind(this)}
                        checked={this.state.sort_type2 === 0}
                        name={`sort_type2`}
                      />
                      <Radiobox
                        label={'降順'}
                        value={1}
                        getUsage={this.setSortType2.bind(this)}
                        checked={this.state.sort_type2 === 1}
                        name={`sort_type2`}
                      />
                    </div>
                  </div>
                  <div className={'select-sort flex'}>
                    <SelectorWithLabel
                      title="第三候補"
                      options={this.sort_Kind}
                      getSelect={this.setSortKind3}
                      departmentEditCode={this.state.sort_kind3}
                    />
                    <div className={'radio-area flex'}>
                      <Radiobox
                        label={'昇順'}
                        value={0}
                        getUsage={this.setSortType3.bind(this)}
                        checked={this.state.sort_type3 === 0}
                        name={`sort_Kind3`}
                      />
                      <Radiobox
                        label={'降順'}
                        value={1}
                        getUsage={this.setSortType3.bind(this)}
                        checked={this.state.sort_type3 === 1}
                        name={`sort_Kind3`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={'btn-area flex'}>
                <div className={'left-btn'}>
                  <Button type="common" onClick={this.confirmSearch}>最新表示</Button>
                </div>
                <div className={'right-btn'}>
                  <div className={'flex'}>
                    <Button type="common" onClick={this.confirmSearch}>ソート</Button>
                    <div style={{marginLeft:"0.5rem;"}}>
                      <Button type="common">レポート作成</Button>
                    </div>
                    <div style={{marginLeft:"0.5rem;"}}>
                      <Button type="common">条件保存</Button>
                    </div>
                  </div>
                  <div className={'flex'}>
                    <Button type="common">画像表示</Button>
                    <div style={{marginLeft:"0.5rem;"}}>
                      <Button type="common">レポート表示</Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={'table-area'}>
                <table className="table-scroll table table-bordered" id={'code-table'}>
                  <thead>
                  <tr>
                    <th style={{width:"3rem"}}>開封</th>
                    <th style={{width:"10rem"}}>患者ID</th>
                    <th style={{width:"15rem"}}>氏名</th>
                    <th style={{width:"7rem"}}>検査予定日</th>
                    <th style={{width:"7rem"}}>実施日時</th>
                    <th style={{width:"15rem"}}>検査</th>
                    <th style={{width:"7rem"}}>レポート</th>
                    <th style={{width:"7rem"}}>部位</th>
                    <th style={{width:"3rem"}}>入外</th>
                    <th>依頼診察科</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.state.list_data != null && (
                    <>
                      {this.state.list_data.length > 0 ? (
                        this.state.list_data.map((item, key) => {
                          return (
                            <>
                              <tr key={key}
                                  onContextMenu={e => this.handleClick(e, key)}
                              >
                                <td style={{width:"3rem"}}></td>
                                <td style={{width:"10rem"}}>{item.patient_number}</td>
                                <td style={{width:"15rem"}}>{item.patient_name}</td>
                                <td style={{width:"7rem"}}>{formatDateSlash(item.inspection_DATETIME)}</td>
                                <td style={{width:"7rem"}}>{item.completed_at}
                                </td>
                                <td style={{width:"15rem"}}>
                                  {this.state.selected_order === "inspection" ? getInspectionName(item.order_data.order_data.inspection_id) : (this.state.selected_order === "radiation" ? item.order_data.order_data.radiation_name : "リハビリ")}
                                  {this.state.selected_order === "endoscope" ? item.order_data.order_data.inspection_name : (this.state.selected_order === "radiation" ? item.order_data.order_data.radiation_name : "リハビリ")}
                                </td>
                                <td style={{width:"7rem"}}></td>
                                <td style={{width:"7rem"}}></td>
                                <td style={{width:"3rem"}} className={'text-center'}>{item.karte_status === 1 ? "外来":(item.karte_status === 2 ? "訪問診療" : "入院")}</td>
                                <td>{this.departmentCodes[item.medical_department_code]}</td>
                              </tr>
                            </>
                          )
                        })
                      ):(
                        <tr style={{height:"calc(90vh - 41rem)"}}>
                          <td colSpan={'10'} style={{verticalAlign:"middle"}}>
                            <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                  </tbody>
                </table>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
          </Modal.Footer>
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            selected_item_index={this.state.selected_item_index}
          />
          {this.state.isOpenKarteModeModal && (
            <SelectModeModal
              modal_data={this.state.modal_data}
              goToUrl={this.goToUrlFunc.bind(this)}
              closeModal={this.confirmCancel}
              modal_type={'report_list'}
            />
          )}
        </Modal>
      </>
    );
  }
}
ReportCreatListModal.contextType = Context;
ReportCreatListModal.propTypes = {
  closeModal: PropTypes.func,
  goToPage: PropTypes.func,
  report_creat_list_type: PropTypes.string,
};

export default ReportCreatListModal;
