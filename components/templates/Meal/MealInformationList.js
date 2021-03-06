import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {formatDateLine} from "~/helpers/date";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as colors from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import SearchBar from "~/components/molecules/SearchBar";
import Button from "~/components/atoms/Button";
import {getAutoReloadInfo, PER_PAGE} from "~/helpers/constants";
import * as localApi from "~/helpers/cacheLocal-utils";
import Checkbox from "~/components/molecules/Checkbox";
import Spinner from "react-bootstrap/Spinner";
import auth from "~/api/auth";
import Pagination from "~/components/molecules/Pagination";
import HospitalApplicationOrderDetail from "~/components/templates/Patient/Modals/Hospital/HospitalApplicationOrderDetail";
import HospitalDischargeDetail from "~/components/templates/Ward/HospitalDischargeDetail";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import HospitalOutInDetail from "~/components/templates/Ward/HospitalOutInDetail";
import HospitalMoveDetail from "~/components/templates/Ward/HospitalMoveDetail";
import MealPrescriptionDetail from "~/components/templates/Ward/MealPrescriptionDetail";

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  .flex {display: flex;}
  .title-area {
    margin-left: 10px;
    padding-top: 10px;
    align-items: center;
    .title {
      font-size: 1.875rem;
      padding-left: 7px;
      border-left: solid 5px #69c8e1;
    }
  }
  .auto-reload {
    margin-left: auto;
    margin-right: 0;
    text-align: right;
    line-height: 38px;
    height: 38px;
    button {margin-right:0.5rem;}
    label {
      font-size: 1rem;
      margin-right: 0;
    }
  }
  .schedule-area {
    width: 100%;
    padding-left:0.5rem;
    margin-bottom: 0.5rem;
    table {
      margin:0px;
      background-color: white;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc(100vh - 16rem);
        width:100%;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
      }
      tr{
        display: table;
        width: 100%;
      }
      thead{
        display:table;
        width:100%;
        border-bottom: 1px solid #dee2e6;
        tr{width: calc(100% - 17px);}
      }
      td {
        word-break: break-all;
        font-size: 1rem;
        vertical-align: middle;
        padding: 0.25rem;
        font-size: 1rem;
      }
      th {
        position: sticky;
        text-align: center;
        font-size: 1.25rem;
        white-space:nowrap;
        font-weight: normal;
        padding: 0.3rem;
        border:1px solid #dee2e6;
        border-bottom:none;
        border-top:none;
        font-weight: normal;
      }
    }
    .go-karte {
      cursor: pointer;
    }
    .selected {
      background: rgb(105, 200, 225) !important;
      color: white;
    }
  }
  .no-result {
    text-align: center;
    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
  .pagination {
    float:right;
  }
  .sort-symbol{
    margin-left:0.5rem;
    font-size:1rem;
    cursor:pointer;
  }
`;

const FlexTop = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: center;
  padding: 10px;
  padding-right: 0;
  width: 100%;
  .label-title {
    margin:0;
    font-size:1rem;
    line-height:38px;
    text-align: right;
    margin-right: 0.5rem;
    width:auto;
  }
  .select-group, .select-view-number {
    margin-left:1rem;
    .pullbox-label {
      margin-bottom:0;
      .pullbox-select {
        width:5rem;
        height:38px;
        line-height:38px;
        font-size: 1rem;
      }
    }
  }
  .search-btn {
    margin-left:0.5rem;
    height: 38px;
    padding:0 0.5rem;
    background-color: rgb(255, 255, 255);
    span {font-size:1rem;}
  }
  .select-date {
    margin-left: 1rem;
    div {margin-top:0;}
    .react-datepicker-wrapper {
      width: 7rem;
      .react-datepicker__input-container {
        width: 100%;
        input {
          font-size: 1rem;
          width: 100%;
          height: 38px;
          border-radius: 4px;
          border-width: 1px;
          border-style: solid;
          border-color: rgb(206, 212, 218);
          border-image: initial;
          padding: 0 0.5rem;
        }
      }
    }
    .react-datepicker-popper {
      margin-top:10px;
    }
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenuUl = styled.div`
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
    font-size: 1rem;
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
      font-weight: bold;
    }
    img {
      width: 2rem;
      height: 2rem;
    }
    svg {
      width: 2rem;
      margin: 8px 0;
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

const ContextMenu = ({visible, x, y, cur_order_index, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction("view_detail", cur_order_index)}>詳細</div></li>
          <li><div onClick={() => parent.contextMenuAction("meal_print", cur_order_index)}>印刷</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class MealInstructionList extends Component {
  constructor(props) {
    super(props);
    let auto_reload = 1;
    this.reload_time = 60 * 1000;
    let auto_reload_info = getAutoReloadInfo("meal_instruction_list");
    if(auto_reload_info !== undefined && auto_reload_info != null){
      if(parseInt(auto_reload_info.reload_time) > 0){
        this.reload_time = parseInt(auto_reload_info.reload_time) * 1000;
      }
      auto_reload = auto_reload_info.status;
    }
    this.state = {
      search_date:new Date(),
      view_number_id: 1,
      view_number: 20,
      auto_reload,
      ward_id:0,
      load_flag:false,
      is_searched:false,
      instruction_list:[],
      schVal:"",
      pageOfItems:[],
      confirm_message:"",
      isOpenHospitalApplicationOrderDetail: false,
      isOpenMealDetail: false,
      isOpenHospitalDischargeDetail:false,
      isOpenHospitalOutInDetail:false,
      isOpenHospitalMoveDetail:false,
      complete_message:"",
      order_column:"patient_number",
      orderby_type:"asc",
      isOpenKarteModeModal:false,
      selected_index:-1,
      alert_messages:"",
    };
    this.openModalStatus = 0;
    let cache_ward_master = JSON.parse(window.sessionStorage.getItem("init_status")).ward_master;
    this.ward_master = [{id:0, value:"全て"}];
    if (cache_ward_master !== undefined && cache_ward_master != null && cache_ward_master.length > 0){
      cache_ward_master.map(ward=>{
        this.ward_master.push({id:ward.number, value: ward.name});
      });
    }
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_names = {};
    departmentOptions.map(department=>{
      this.department_names[parseInt(department.id)] = department.value;
    });
  }
  
  async componentDidMount() {
    localApi.setValue("system_next_page", "/meal_information_list");
    localApi.setValue("system_before_page", "/meal_information_list");
    await this.getSearchResult(false);
    document.getElementById("search_bar").focus();
    this.reloadInterval = setInterval(async()=>{
      this.autoReload();
    }, this.reload_time);
    auth.refreshAuth(location.pathname+location.hash);
  }
  
  setAutoReload = (name, value) => {
    if(name === "auto_reload"){
      this.setState({auto_reload:value});
    }
  };
  
  autoReload=()=>{
    if(this.state.auto_reload == 1 && this.openModalStatus == 0){
      this.getSearchResult();
    }
  }
  
  componentWillUnmount (){
    clearInterval(this.reloadInterval);
  }
  
  getSearchResult=async(is_searched=true, order_column=null, orderby_type=null)=>{
    order_column = order_column == null ? this.state.order_column : order_column;
    orderby_type = orderby_type == null ? this.state.orderby_type : orderby_type;
    this.setState({
      load_flag: false,
      order_column,
      orderby_type,
    });
    let path = "/app/api/v2/meal/search/information_list";
    let post_data = {
      keyword:this.state.schVal,
      ward_id:this.state.ward_id,
      start_date:this.state.start_date !== "" ? formatDateLine(this.state.start_date) : "",
      end_date:formatDateLine(this.state.end_date),
      date_type:this.state.select_date_type,
      after_date:this.state.search_after_date,
      order_column,
      orderby_type,
      search_date:formatDateLine(this.state.search_date),
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          instruction_list: res,
          is_searched,
          load_flag:true,
          selected_index:-1,
        });
      })
      .catch(() => {
      });
  }
  
  search = word => {
    word = word.toString().trim();
    this.setState({schVal: word});
  };
  
  enterPressed = e => {
    let code = e.keyCode || e.which;
    if (code === 13) {
      this.getSearchResult();
    }
  };
  
  getWardSelect=(e)=> {
    this.setState({ward_id:parseInt(e.target.id)});
  };
  
  getDisplayNumber=(e)=> {
    this.setState({
      view_number_id:parseInt(e.target.id),
      view_number: parseInt(e.target.value),
    });
  };
  
  onChangePage=(pageOfItems)=>{
    this.setState({pageOfItems: pageOfItems});
  }
  
  handleClick=(e, index)=>{
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
          x: e.clientX,
          y: e.clientY,
          cur_order_index:index
        },
        selected_index:index
      });
    }
  }
  
  contextMenuAction = (modal_type, cur_order_index) => {
    let cur_order = this.state.pageOfItems[cur_order_index];
    if(modal_type === "view_detail") {
      let state_data = {};
      this.openModalStatus = 1;
      state_data.cur_order = cur_order;
      if(cur_order.order_title === "入院決定"){
        state_data.isOpenHospitalApplicationOrderDetail = true;
      }
      if(cur_order.order_title === "食事変更" || cur_order.order_title === "食事一括指示"){
        state_data.isOpenMealDetail = true;
      }
      if(cur_order.order_title === "退院実施"){
        state_data.isOpenHospitalDischargeDetail = true;
      }
      if(cur_order.order_title === "外泊実施" || cur_order.order_title === "帰院実施"){
        if(cur_order.classific === "再開"){
          state_data.isOpenMealDetail = true;
        } else {
          state_data.isOpenHospitalOutInDetail = true;
        }
      }
      if(cur_order.order_title === "転棟・転室実施"){
        state_data.isOpenHospitalMoveDetail = true;
      }
      this.setState(state_data);
    } else if(modal_type === "meal_print") {
      this.setState({
        confirm_message:"印刷しますか？",
        confirm_type: "order_prescription_print",
        cur_order:cur_order
      });
    }
  }
  
  closeModal = () => {
    this.setState({
      isOpenHospitalApplicationOrderDetail: false,
      isOpenMealDetail: false,
      isOpenHospitalDischargeDetail: false,
      isOpenHospitalOutInDetail: false,
      isOpenHospitalMoveDetail: false,
      confirm_message: "",
      isOpenKarteModeModal: false,
      alert_messages: "",
    });
    this.openModalStatus = 0;
  };
  
  get_title_pdf = (type=null, item=null) => {
    let title = "食事箋一覧_";
    if (type === "order_prescription_print") {
      title = "食事箋_";
      title += this.state.cur_order.patient_number + "_";
      if (item != null && item.start_date !== undefined && item.start_date != null && item.start_date !== "") {
        title = title + formatDateLine(item.start_date).split('-').join('');
      } else if(item.end_date !== undefined && item.end_date != null && item.end_date !== ""){
        title = title + formatDateLine(item.end_date).split('-').join('');
      }
      return title+".pdf";
    } else if (type === "order_prescription_all_print") {
      title = "食事箋一括_";
    }
    if(this.state.select_date_type === 0){
      title = title + formatDateLine(this.state.end_date).split('-').join('');
    } else {
      title = title + formatDateLine(this.state.start_date).split('-').join('') + "-" + formatDateLine(this.state.end_date).split('-').join('');
    }
    return title+".pdf";
  }
  
  printList=()=>{
    this.setState({complete_message:"印刷中"});
    let path = "/app/api/v2/meal/print/prescription_list";
    let pdf_file_name = this.get_title_pdf();
    let print_data = {};
    print_data.list_data = this.state.pageOfItems;
    print_data.date_type = this.state.select_date_type;
    print_data.search_after_date = this.state.search_after_date;
    print_data.start_date = this.state.start_date !== "" ? formatDateLine(this.state.start_date) : "";
    print_data.end_date = formatDateLine(this.state.end_date);
    print_data.ward_name = (this.ward_master.find((x) => x.id == this.state.ward_id) !== undefined) ? this.ward_master.find((x) => x.id == this.state.ward_id).value : "";
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
        this.setState({complete_message:""});
      })
  }

  handleOrderAllPrint = () => {
    this.setState({
      confirm_message:"食事箋一括印刷しますか？",
      confirm_type: "order_all_print",      
    });
  }

  orderPrint = (type=null) => {
    this.setState({
      confirm_message:"",
      complete_message:"印刷中"
    });
    let pdf_file_name = this.get_title_pdf(type, this.state.cur_order);
    let path = "/app/api/v2/meal/print_meal";
    let print_data = {};        
    print_data.meal_info = this.state.cur_order;
    print_data.type = type;
    if (type === "order_all_print"){print_data.meal_info = this.state.pageOfItems;}
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

  confirmOk = () => {
    if(this.state.confirm_type === "order_print" || this.state.confirm_type === "order_all_print") {
      this.orderPrint(this.state.confirm_type);
    }
  }
  
  goKarte = async(selected_index) => {
    let patient_info = this.state.pageOfItems[selected_index];
    let patients_list = this.context.patientsList;
    let isExist = 0;
    patients_list.map(item=>{
      if(item.system_patient_id == patient_info.patient_id){isExist = 1;}
    });
    if (patients_list !== undefined && patients_list != null && patients_list.length > 3 && isExist == 0) {
      this.openModalStatus = 1;
      this.setState({
        selected_index,
        alert_messages: '4人以上の患者様を編集することはできません。'
      });
      return;
    }
    if(isExist == 0) { // new patient connect
      let modal_data = {
        systemPatientId:patient_info.patient_id,
        diagnosis_code:patient_info.order_data.order_data.department_id,
        diagnosis_name:this.department_names[patient_info.order_data.order_data.department_id],
        department : this.department_names[patient_info.order_data.order_data.department_id],
      };
      this.openModalStatus = 1;
      this.setState({
        selected_index,
        isOpenKarteModeModal: true,
        modal_data,
      });
    } else { // exist patient connect
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      const page = authInfo.karte_entrance_page === undefined || authInfo.karte_entrance_page === "" ? "soap" : authInfo.karte_entrance_page;
      this.goToUrlFunc("/patients/"+patient_info.patient_id+"/"+page);
    }
  }
  
  goToUrlFunc = (url) => {
    this.props.history.replace(url);
    this.closeModal();
  };
  
  setSearchDate = value => {
    if(value == null || value === ""){
      value = new Date();
    }
    this.setState({search_date: value});
  };
  
  render() {
    return (
      <PatientsWrapper>
        <div className="title-area flex">
          <div className={'title'}>食事情報一覧</div>
        </div>
        <FlexTop>
          <SearchBar
            placeholder="患者ID / 患者名"
            search={this.search}
            enterPressed={this.enterPressed}
            value={this.state.schVal}
            id={'search_bar'}
          />
          <div className="select-group">
            <SelectorWithLabel
              options={this.ward_master}
              title="病棟"
              getSelect={this.getWardSelect}
              departmentEditCode={this.state.ward_id}
            />
          </div>
          <div className={'select-date'}>
            <InputWithLabel
              label="日付"
              type="date"
              getInputText={this.setSearchDate.bind(this)}
              diseaseEditData={this.state.search_date}
            />
          </div>
          <div className="select-view-number">
            <SelectorWithLabel
              options={PER_PAGE}
              title="表示件数"
              getSelect={this.getDisplayNumber}
              departmentEditCode={this.state.view_number_id}
            />
          </div>
          <Button type="mono" className={'search-btn'} onClick={this.getSearchResult}>検索</Button>
          <div className={'auto-reload'}>
            {/*<Button*/}
              {/*type="common"*/}
              {/*className={(this.state.pageOfItems.length === 0 || !this.state.load_flag) ?  'disable-btn' : ''}*/}
              {/*isDisabled={this.state.pageOfItems.length === 0 || !this.state.load_flag}*/}
              {/*onClick={this.printList}*/}
            {/*>一覧印刷</Button>*/}
            {/*<Button*/}
              {/*type="common"*/}
              {/*className={(this.state.pageOfItems.length === 0 || !this.state.load_flag) ?  'disable-btn' : ''}*/}
              {/*isDisabled={this.state.pageOfItems.length === 0 || !this.state.load_flag}*/}
              {/*onClick={this.handleOrderAllPrint}*/}
            {/*>食事箋一括印刷</Button>*/}
            <Checkbox
              label="自動更新"
              getRadio={this.setAutoReload.bind(this)}
              value={this.state.auto_reload === 1}
              name="auto_reload"
            />
          </div>
        </FlexTop>
        <div className={'schedule-area'}>
          <table className="table-scroll table table-bordered" id="code-table">
            <thead className={'thead-area'}>
            <tr>
              <th style={{width:"9rem"}}>病室
                {(this.state.order_column === 'ward_room_bed' && this.state.orderby_type === 'desc') ? (
                  <span className='sort-symbol' onClick={this.getSearchResult.bind(this, true, 'ward_room_bed', 'asc')}>▼</span>
                ):(
                  <span className='sort-symbol' onClick={this.getSearchResult.bind(this, true, 'ward_room_bed', 'desc')}>▲</span>
                )}
              </th>
              <th style={{width:"8rem"}}>患者ID
                {(this.state.order_column === 'patient_number' && this.state.orderby_type === 'desc') ? (
                  <span className='sort-symbol' onClick={this.getSearchResult.bind(this, true, 'patient_number', 'asc')}>▼</span>
                ):(
                  <span className='sort-symbol' onClick={this.getSearchResult.bind(this, true, 'patient_number', 'desc')}>▲</span>
                )}
              </th>
              <th style={{width:"17rem"}}>患者氏名</th>
              <th style={{width:"15rem"}}>食種</th>
              <th style={{width:"10rem"}}>主食(朝)</th>
              <th style={{width:"10rem"}}>主食(昼)</th>
              <th style={{width:"10rem"}}>主食(夕)</th>
              <th>移動</th>
            </tr>
            </thead>
            <tbody className={'scroll-area'}>
            {this.state.load_flag ? (
              <>
                {this.state.pageOfItems.length > 0 ? (
                  <>
                    {this.state.pageOfItems.map(item=>{
                      return(
                        <>
                          <tr
                            // onContextMenu={e => this.handleClick(e, index)}
                            // onClick={this.goKarte.bind(this, index)}
                            // className={'go-karte ' + (this.state.selected_index == index ? 'selected' : '')}
                          >
                            <td style={{width:"9rem"}}>{item.ward_name}/{item.room_name}/{item.bed_name == null ? "病床未定" : item.bed_name}</td>
                            <td style={{width:"8rem", textAlign:"right"}}>{item.patient_number}</td>
                            <td style={{width:"17rem"}}>{item.patient_name}</td>
                            <td style={{width:"15rem"}}>{item.food_type_name}</td>
                            <td style={{width:"10rem"}}>
                              {((item.order_title === "外泊実施" || item.order_title === "帰院実施") && (item.classific === "再開")) ? item.staple_food_id_morning_name
                                : ((item.order_title === "食事変更" || item.order_title === "食事一括指示") ? item.order_data.order_data.staple_food_id_morning_name : "")}
                            </td>
                            <td style={{width:"10rem"}}>
                              {((item.order_title === "外泊実施" || item.order_title === "帰院実施") && (item.classific === "再開")) ? item.staple_food_id_noon_name
                                : ((item.order_title === "食事変更" || item.order_title === "食事一括指示") ? item.order_data.order_data.staple_food_id_noon_name : "")}
                            </td>
                            <td style={{width:"10rem"}}>
                              {((item.order_title === "外泊実施" || item.order_title === "帰院実施") && (item.classific === "再開")) ? item.staple_food_id_evening_name
                                : ((item.order_title === "食事変更" || item.order_title === "食事一括指示") ? item.order_data.order_data.staple_food_id_evening_name : "")}
                            </td>
                            <td>{item.classific + "(" +
                              (item.classific === "退院" ? item.end_time_name : (item.classific === "転室" ? item.start_date.split(' ')[1] : item.start_time_name)) + ")"}
                            </td>
                          </tr>
                        </>
                      )
                    })}
                  </>
                ):(
                  <>
                    {this.state.is_searched && (
                      <tr style={{height:"calc(100vh - 16rem)"}}>
                        <td colSpan={'8'}>
                          <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </>
            ):(
              <tr style={{height:"calc(100vh - 16rem)"}}>
                <td colSpan={'8'}>
                  <div className='spinner_area no-result'>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        <Pagination
          items={this.state.instruction_list}
          onChangePage={this.onChangePage.bind(this)}
          pageSize = {this.state.view_number}
        />
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        {this.state.isOpenHospitalApplicationOrderDetail && (
          <HospitalApplicationOrderDetail
            closeModal={this.closeModal}
            modal_data={this.state.cur_order}
          />
        )}
        {this.state.isOpenMealDetail && (
          <MealPrescriptionDetail
            closeModal={this.closeModal}
            modal_data={this.state.cur_order}
          />
        )}
        {this.state.isOpenHospitalDischargeDetail && (
          <HospitalDischargeDetail
            closeModal={this.closeModal}
            modal_data={this.state.cur_order}
          />
        )}
        {this.state.isOpenHospitalOutInDetail && (
          <HospitalOutInDetail
            closeModal={this.closeModal}
            modal_data={this.state.cur_order}
          />
        )}
        {this.state.isOpenHospitalMoveDetail && (
          <HospitalMoveDetail
            closeModal={this.closeModal}
            modal_data={this.state.cur_order}
          />
        )}
        {this.state.confirm_message !== "" && (
          <SystemConfirmModal
            hideConfirm= {this.closeModal.bind(this)}
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.complete_message !== '' && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
        {this.state.isOpenKarteModeModal && (
          <SelectModeModal
            modal_data={this.state.modal_data}
            goToUrl={this.goToUrlFunc.bind(this)}
            closeModal={this.closeModal}
            modal_type={'meal_prescription_list'}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
      </PatientsWrapper>
    );
  }
}

MealInstructionList.contextType = Context;
MealInstructionList.propTypes = {
  history: PropTypes.object,
}
export default MealInstructionList;

