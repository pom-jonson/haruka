import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {formatDateLine, formatJapanDateTimeIE, getNextDayByJapanFormat, getPrevDayByJapanFormat} from "~/helpers/date";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as colors from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Spinner from "react-bootstrap/Spinner";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Button from "~/components/atoms/Button";
import IndividualRead from "./IndividualRead";
import UploadScannerModal from "./Scanner/UploadScannerModal";
import LoadingModal from "~/components/molecules/LoadingModal";
import Checkbox from "~/components/molecules/Checkbox";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Radiobox from "~/components/molecules/Radiobox";
import DatePicker from "react-datepicker";
import {setDateColorClassName} from "~/helpers/dialConstants";
import FromApiPagination from "~/components/templates/Maintenance/FromApiPagination";
import RadioButton from "~/components/molecules/RadioInlineButton";
import axios from "axios";
import $ from "jquery";

const renderTooltip = (props) => <Tooltip {...props}>{props}</Tooltip>;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
`;

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  font-size:1rem;
  .content-cache{    
    .pullbox{
      pointer-events: none;
    }
    .pullbox-select{
      background: #eee;
      color: gray;
    }
    button{
      pointer-events: none;
      background: #eee;
      border-color: rgb(206, 212, 218);
      span{
        color: gray;
      }
      pointer-events: none;
    }
    .date-area{
      pointer-events: none;
      .prev-day, .next-day, .select-today{
        background: #eee;
        color: gray;
        border-color: rgb(206, 212, 218);
      }
      input{
        background: #eee;
        border-color: rgb(206, 212, 218);
        color: gray;        
      }
    }
    .after-date-check{
      pointer-events: none;
      input{
        background: #eee;
        color: gray;
        border-color: rgb(206, 212, 218);
      }
    }
  }
  .flex {
    display: flex;
  }
  .spinner-disease-loading{
    height: 100%;
    overflow-y: auto;    
  }
  .selected{
    background: lightblue !important;
  }
  .item-check{
    width: 3rem;    
    text-align: center;
    label {
      margin-right:0px !important;
      input{
        margin-right: 0px !important;
      }
    }
    
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .div-input-area{
    margin-right: 2rem;
    div{
      margin-top: 0px !important;  
      width: 100%;    
    }
    input{
      width: calc(100% - 6rem);
      height: 2.2rem;
    }
  }
  .disable-btn{
    pointer-events: none;
  }
  .condition-area{    
    position: absolute;
    right: 0px;
    top: -2.5rem;
    button{
      height: 2.2rem;
    }    
  }
  .schedule-area {
    margin-top: 0.2rem;
    ul{
      margin-top:0.5rem;
      margin-bottom: 0px;
    }
    width: 100%;
    .sort-symbol{     
      margin-left:10px;
      font-size:1rem;
      cursor:pointer;
    }
    table {
      margin:0;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc( 100vh - 50rem);
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
        background-color: #a0ebff;            
        tr{
          width: calc(100% - 17px);
        }
      }
      td {
        padding: 0.25rem;
        word-break: break-all;
        button{
          float:right;
        }
      }
      th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
        white-space:nowrap;
        border:none;
        border-right:1px solid #dee2e6;        
      }
    }  
  }
  .label-title {
    margin:0;
    height:2.3rem; 
    line-height:2.3rem; 
    font-size:1rem;
  }
  .box-area {
    border:1px solid #aaa;
    height:2.3rem; 
    line-height:2.3rem; 
    padding:0 0.2rem;
  }
  .barcode-area {
    width:35%;
    .label-title {
      width:6rem;
    }
    .box-area {
      width:calc(100% - 6rem);
    }
  }
  .import-count-area {
    width:auto;
    min-width: 10rem;
    .label-title {
      width:6rem;
    }
    .box-area {
      min-width: 4rem;
      width: auto;
      text-align: right;
    }
  }
  .left-area {
    width:32%;
    .flex {margin-top:-1px;}
    .label-title {
      width:6rem;
    }
    .box-area {
      width:calc(100% - 6rem);
    }
  }
  .middle-area {
    width:32%;
    .flex {margin-top:-1px;}
    .label-title {
      width:6rem;
    }
    .box-area {
      width:calc(100% - 6rem);
    }
  }
  .right-area {
    width:32%;
    .flex {margin-top:-1px;}
    .label-title {
      width:10rem;
    }
    .box-area {
      width:calc(100% - 10rem);
    }
  }
`;

const Flex = styled.div`
    display: flex;
    // background: ${colors.background};
    // padding: 10px 0px 10px 10px;
    // margin-top: 0.5rem;
    align-items: center;
    width: 100%;    
    .inline-radio{
      label {
        font-size: 1rem;
        margin-right: 0.25rem;
        border-radius: 4px;
        border: solid 1px #ddd;
        margin-bottom:0;
        height: 2.4rem;
        line-height: 2.4rem;
      }
      div{
        margin-right: 0.25rem;
      }
    }
    z-index: 100;
    .label-title {
        text-align: right;
        width: 8.5rem;
        margin-right:0.5rem;        
        font-size: 1rem;
        line-height:2.4rem;
        height:2.4rem;
    }
    .search-btn-style{
      min-width: 6rem !important;
    }
    .pullbox-label, select {
        width: 100%;
        font-size:1rem;
        height:2.4rem;
        line-height:2.4rem;
    }
    label {
        margin: 0;
    }
    
    button {
        min-width: auto;
        margin-left: 24px;
        background-color: white;
        height:2.4rem;
        padding:0;
        padding-left:1rem;
        padding-right:1rem;
        span{
          font-size:1rem;
        }
    }
    .react-datepicker-wrapper{
        input {
            width: 7.5rem;
            font-size:1rem;
            height: 1.8rem;
        }        
    }
    .react-datepicker{
      button{
        height:0;
        margin-left:0;
        padding:0;
      }
    }
    .include-no-date {
        padding-left: 10px;
        display:-ms-grid;
        .after-date-check{
            margin-top: -2rem;
            margin-bottom: 0.5rem;
        }
        label {
            font-size: 1rem;
            input {                
                font-size: 1rem;
            }
        }
    }
    .react-datepicker__navigation{
      background:none;
    }
  .MyCheck{
    margin-left: 24px;
    margin-bottom: 5px;
    label{
      font-size: 1rem;
      margin-right: 10px;
      line-height: 1.8rem;
    }
  }
  .from-to {
    padding-left: 5px;
    padding-right: 5px;
    line-height: 1.8rem;
  }
  .prev-day {
    cursor: pointer;
    border: 1px solid #aaa;
    background-color: white;
    line-height: 1.8rem;
    padding-left: 5px;
    padding-right: 5px;
  }
  .next-day {
    cursor: pointer;
    border: 1px solid #aaa;
    background-color: white;
    line-height: 1.8rem;
    padding-left: 5px;
    padding-right: 5px;
  }
  .select-today {
    cursor: pointer;
    border: 1px solid #aaa;
    background-color: white;
    line-height: 1.8rem;
    margin-left: 5px;
    margin-right: 5px;
    padding-left: 5px;
    padding-right: 5px;
  }
`;

const scannerImportStatusOptions = [
  {id: 0,value: "全て"},
  {id: 1,value: "取込済"},
  {id: 2,value: "未取込"}, 
];

const perPageOptions = [{id:0, value:10},{id:1, value:20},{id:2, value:50},{id:3, value:100},]

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
  .patient-info-table {
    width: 100%;
    table {
      margin-bottom: 0;
    }
    th {
      font-size: 1rem;
      vertical-align: middle;
      padding: 0;
      text-align: right;
      width: 110px;
      padding-right: 5px;
    }
    td {
      font-size: 1rem;
      vertical-align: middle;
      padding: 0;
      text-align: left;
      padding-left: 5px;
    }
  }
`;

const HoverMenu = ({
                     visible,
                     x,
                     y,
                     parent,
                     patient_info                     
                   }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu hover-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div className={'patient-info-table'}>
              <table className="table-scroll table table-bordered">
                <tbody>
                {patient_info != null && patient_info.patient_number != undefined && (
                  <tr><th>患者ID</th><td>{parent.getPatientNumberWithZero(patient_info.patient_number)}</td></tr>
                )}
                {patient_info != null && patient_info.patient_name != undefined && patient_info.patient_name != "" && (
                  <tr><th>患者氏名</th><td>{patient_info.patient_name}</td></tr>
                )}
                {patient_info != null && patient_info.department_id != undefined && patient_info.department_id != "" && (
                  <tr><th>診療科</th><td>{parent.getDepartmentName(patient_info.department_id)}</td></tr>
                )}
                {patient_info != null && patient_info.document_slip_name != undefined && patient_info.document_slip_name != null && patient_info.document_slip_name != "" && (
                  <tr><th>文書種類</th><td>{patient_info.document_slip_name}</td></tr>
                )}
                {patient_info != null && patient_info.template_name != undefined && patient_info.template_name != null && patient_info.template_name != "" && (
                  <tr><th>書類名</th><td>{patient_info.template_name}</td></tr>
                )}
                {patient_info != null && patient_info.free_comment != undefined && patient_info.free_comment != null && patient_info.free_comment != "" && (
                  <tr><th>備考</th><td>{patient_info.free_comment}</td></tr>
                )}                
                </tbody>
              </table>
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

/*const SET_TIILE = [  
  {id: 0, value: "標準" },
  {id: 1, value: "高画質" },
  {id: 2, value: "低画質" } 
];*/

class ScannerBatchTakeDoc extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_codes = [{id:0, value:"全て"}];
    this.diagnosis = {};
    departmentOptions.map(department=>{
      this.department_codes.push(department);
      this.diagnosis[parseInt(department.id)] = department.value;
    });
    let cur_date = new Date();
    this.state = {
      departmentOptions,
      import_list:[],
      select_value:{id:0, value:"標準"},
      openIndividualRead:false,
      openUploadScannerModal:false,
      selectedScannerIndex:'',
      barcode: "",
      cur_patient_info: null,
      from_date:new Date(),
      end_date:cur_date.setDate(cur_date.getDate() + 1),
      first_ward_id:0,
      ward_master : [{ id: 0, value: "全て" },],
      department_id:0,
      search_type:1,
      patient_id:"",
      tab_id:0,
      alert_messages:'',
      confirm_message:'',
      confirm_type:'',
      confirm_title:'',
      selectPatient: false,
      patient_number:"",
      list_scanner_info: [],
      cache_scanner_info: [],
      selectedScanner: null,
      selectedScannerInfo: null,
      isLoaded: false,
      patient_info_hover: {},
      dateStatus: new Date(),
      start_date: '',
      after_date:0,
      select_date_type: 0,
      importStatusType: 0,
      display_number: 10,
      asc_desc: "desc",
      current_page: 1,
      content_type: 0,
      checked_list: []
    };
    this.ward_name = [];

    this.LoadingModalRef = React.createRef();
  }

  async componentDidMount() {
    await this.getScannerMasterData(true);
    // await this.getSearchResult();
  }

  setValue = e => {
    this.setState({ 
      select_value: {id: e.target.id, value: e.target.value}
    });
  };  

  closeModal = () => {
    this.setState({
      openIndividualRead: false,
      openUploadScannerModal: false,
    });
  }



  getScannerMasterData=async(_onlyDB=null, _flag=null)=>{
    let path = "/app/api/v2/report/scanner/get_info";
    let post_data = {
      current_page: this.state.current_page,
      display_number: this.state.display_number,
      get_data_flag: _flag,
      status: this.state.importStatusType,
      start_date:this.state.start_date !== '' ? formatDateLine(this.state.start_date) : '',
      after_date:this.state.after_date,
      asc_desc: this.state.asc_desc,
      date:this.state.dateStatus !== '' ? formatDateLine(this.state.dateStatus) : '' ,
    };
    await apiClient
      ._post(path, {
          params: post_data
      })
      .then((res) => {
        if (res) {
          // new code
          let content_info = res.data;
          if (_flag == "only_data") {            
            this.setState({
                pageOfItems: content_info != undefined && content_info !=null ? content_info : [],
                isLoaded: true,                
                selectedScannerIndex: "",
            });
            return;
          }
          if(content_info != undefined && content_info !=null){                        
            this.setState({
                list_scanner_info: res.page,
                pageOfItems: content_info,
                selectedScannerIndex: "",
                checked_list: [],
                isLoaded: true
            });
          } else {
              this.setState({
                  list_scanner_info:[],
                  pageOfItems:[],
                  checked_list: [],
                  selectedScannerIndex: "",
                  isLoaded: true
              });
          }
          // new code end          
        }        
      })
      .catch(() => {
        this.setState({
          isLoaded: true
        });
      });
  }


  setDepartment = e => {
    this.setState({ department_id: parseInt(e.target.id)});
  };

  getSearchResult =async()=>{
    let path = "/app/api/v2/ward/get/in_out/hospital/plan_list";
    let post_data = {
      from_date:formatDateLine(this.state.from_date),
      end_date:formatDateLine(this.state.end_date),
      first_ward_id:this.state.first_ward_id,
      department_id:this.state.department_id,
      patient_id:this.state.patient_id,
      search_type:this.state.search_type, //0:予定含む 1:決定完了
      tab_id:this.state.tab_id, //0:入院 1:退院
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          table_data: res,
        });
      })
      .catch(() => {
      });
  }

  confirmCancel() {
    this.setState({
      alert_messages: "",
      confirm_message: "",
      confirm_type: "",
      confirm_title: "",
    });
  }

  getDate = value => {
    this.setState({ dateStatus: value });
  };

  setSearchType = (e) => {
    this.setState({
      search_type:parseInt(e.target.value),
    })
  }

  setTab = ( e, val ) => {
    this.setState({
      tab_id:parseInt(val),
    },()=>{this.getSearchResult()});
  };

  openSelectPatientModal = () => {
    this.setState({
      selectPatient: true
    });
  }

  selectPatient = (patient) => {
    this.setState({
      patient_number: patient.patientNumber,
      patient_id: patient.systemPatientId,
      selectPatient: false,
    });
  }

  openIndividualRead = (_item=null, _index) => {
    this.setState({ 
      openIndividualRead: true,
      selectedScannerIndex: _index,
      selectedScanner: _item      
    });
  }

  uploadFiles = () => {
    // if (this.state.cur_patient_info == null || this.state.cur_patient_info.patient_name == undefined) {
    //   this.setState({
    //     alert_messages: "バーコードを正確に入力してください。"
    //   });
    //   return;
    // }
    this.setState({
      openUploadScannerModal: true,
    });
  }

  getBarcode = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {        
      this.searchList();
    } else {
      this.setState({barcode:e.target.value});
    }
  }

  getOnBlur = () => {
    this.searchList();
  }

  searchList = async () => {
    let url = "/app/api/v2/report/scanner/getPatientInfo";
    let data = {
      params: {
        patientId: this.state.barcode
      }
    };
    axios.post(url, data, { 
    })
    .then(res => { // then print response status
        if (res) {
          this.setState({
            cur_patient_info: res.data ? res.data : null
          });
        }
    })    
  }  

  handleUploadFiles = (_selectedFiles) => {

    this.LoadingModalRef.current.callVisible(true);

    // post of photos
    const data = new FormData()
    for(var x = 0; x<_selectedFiles.length; x++) {
        data.append('file[]', _selectedFiles[x])
    }
    data.append('patient_id', this.state.barcode);    

    // post of scanner info
    /*let add_info = {};
    add_info.import_status = 0;
    add_info.barcode = this.state.barcode;
    add_info.birthday = this.state.cur_patient_info.birthday;
    add_info.gender = this.state.cur_patient_info.gender;
    add_info.barcode = this.state.barcode;    
    add_info.patient_number = this.state.cur_patient_info.patient_number;
    add_info.patient_id = this.state.cur_patient_info.system_patient_id;
    add_info.patient_name = this.state.cur_patient_info.patient_name;
    add_info.number_of_scanners = _selectedFiles.length;
    data.append('insert_record', JSON.stringify(add_info));*/

    let url = "/app/api/v2/report/scanner/upload";        

    axios.post(url, data, { // receive two parameter endpoint url ,form data 
    })
    .then(res => { // then print response status
      // if (res.data.status == true && res.data.file_names != undefined && res.data.file_names != null && res.data.file_names.length > 0) {                            
      if (res.data.status == true && res.data.upload_result != undefined && res.data.upload_result != null && Object.keys(res.data.upload_result).length > 0) {                            

        this.setState({          
          alert_messages: "スキャナ一情報を登録しました。",            
          openUploadScannerModal: false,          
        },()=>{
          // cache save
          // this.saveScannerInfoToCache(res.data.patient_info, res.data.file_names);
          this.saveScannerInfoToCache(res.data.upload_result);
        });
        this.LoadingModalRef.current.callVisible(false);
      } else {
        this.setState({
          openUploadScannerModal: false,
        });
        this.LoadingModalRef.current.callVisible(false);
      }
    })
    .catch(() => {
      this.setState({
        openUploadScannerModal: false
      });
      this.LoadingModalRef.current.callVisible(false);
    });
  } 

  // saveScannerInfoToCache = (patient_info, scanner_files) => {
  saveScannerInfoToCache = (uploaded_array) => {
    let cache_scanner_info = this.state.cache_scanner_info;
    
    if (uploaded_array != undefined && uploaded_array != null && Object.keys(uploaded_array).length > 0) {
      Object.keys(uploaded_array).map(key=>{  
        let item = uploaded_array[key];

        let add_info = {};
        add_info.import_status = 0;
        add_info.checked = 0;
        
        let barcode = "";
        if (item.image_type == "unique_id") {
          barcode = key;
          add_info.unique_id = item.unique_id;  
          add_info.department_id = item.department_id;  
          add_info.document_slip_id = item.document_slip_id;  
          add_info.document_slip_name = item.document_slip_name;  
          add_info.template_id = item.template_id;  
          add_info.template_name = item.template_name;  
          add_info.free_comment = item.free_comment;  
          add_info.karte_status = item.karte_status;  
          add_info.title = item.template_name;  
        } else if(item.image_type == "patient_id") {
          barcode = key;
          add_info.karte_status = 0;  
          add_info.title = ""; 
        } else {
          barcode = "";
          add_info.karte_status = 0;
          add_info.title = ""; 
        }     
        
        let scanner_files = item.file_names != undefined && item.file_names != null ? item.file_names : [];
        let patient_info = item.patient_info != undefined && item.patient_info != null ? item.patient_info : null;        
        add_info.barcode = barcode;
        add_info.birthday = patient_info && patient_info.birthday ? patient_info.birthday : null;
        add_info.gender = patient_info && patient_info.gender ? patient_info.gender : null;    
        add_info.patient_number = patient_info && patient_info.patient_number ? patient_info.patient_number : null;
        add_info.patient_id = patient_info && patient_info.system_patient_id ? patient_info.system_patient_id : null;
        add_info.patient_name = patient_info && patient_info.patient_name ? patient_info.patient_name : null;
        add_info.number_of_scanners = scanner_files.length;
        add_info.import_datetime = patient_info && patient_info.import_datetime ? patient_info.import_datetime : null;
        add_info.cache_key = patient_info && patient_info.cache_key ? patient_info.cache_key : null;
        add_info.scanner_photos = scanner_files;
        add_info.image_type = item.image_type;
                
        cache_scanner_info.push(add_info);
      });
    }

    this.setState({
      cache_scanner_info
    });
  }

  saveScannerInfo = (_saveData=null) => {
    this.closeModal();
    if (_saveData == null) return;

    // if cache data update
    // if (_saveData.import_status == 0 && _saveData.number == null) {
    if (this.state.content_type == 0) {
      let cache_scanner_info = this.state.cache_scanner_info;
      cache_scanner_info.map((item, idx)=>{
        if (idx == this.state.selectedScannerIndex) {   
          item.patient_id = _saveData.patient_id;
          item.patient_number = _saveData.patient_number;
          item.barcode = _saveData.barcode;
          item.patient_name = _saveData.patient_name;
          item.birthday = _saveData.birthday;
          item.gender = _saveData.gender;
          item.import_status = _saveData.import_status;
          item.set_title = _saveData.set_title;
          item.collar_mode = _saveData.collar_mode;
          item.resolution = _saveData.resolution;
          item.import_size_weight = _saveData.import_size_weight;
          item.import_size_height = _saveData.import_size_height;
          item.start_position_vertical = _saveData.start_position_vertical;
          item.start_position_side = _saveData.start_position_side;  
          item.karte_status = _saveData.karte_status;  
          item.title = _saveData.title;  
          if (_saveData.unique_id != undefined && _saveData.unique_id != null && _saveData.unique_id > 0 ) {
            item.unique_id = _saveData.unique_id;
            item.department_id = _saveData.department_id;
            item.document_slip_id = _saveData.document_slip_id;
            item.document_slip_name = _saveData.document_slip_name;
            item.template_id = _saveData.template_id;
            item.template_name = _saveData.template_name;
            item.free_comment = _saveData.free_comment;
            item.image_type = "unique_id"
          } else {
            item.unique_id = null;
            item.department_id = null;
            item.document_slip_id = null;
            item.document_slip_name = null;
            item.template_id = null;
            item.template_name = null;
            item.free_comment = null;
            item.image_type = "";
          }
        }
      });
      this.setState({
        cache_scanner_info
      });
      return;
    }

    // if db data update

    // update scanner info from individual
    let url = "/app/api/v2/report/scanner/registerScannerInfo";
    let data = {
      params: {
        save_data: _saveData
      }
    };
    axios.post(url, data, { 
    })
    .then(res => { // then print response status
        if (res && res.data && res.data.alert_message) {
          this.setState({
            alert_messages: res.data.alert_message,
            isLoaded: false,
          },()=>{
            this.getScannerMasterData(null, "only_data");
          });
        }
    })
  }

  handleRegister = () => {
    let list_scanner_info = this.state.pageOfItems;
    let register_array = [];
    if (list_scanner_info.length) {
      list_scanner_info.map(item=>{
        if (item.import_status == 0 && this.state.checked_list.includes(item.number)) {
          if (item.barcode == null || item.barcode == "") {
            item.barcode = "000000";
          }
          if (item.patient_id == null || item.patient_id == "") {
            item.barcode = "000000";
          }
          register_array.push(item);
        }
      });
    }

    if (this.state.cache_scanner_info.length > 0) {
      this.state.cache_scanner_info.map(item=>{
        if (item.checked != undefined && item.checked ==1) {
          if (item.barcode == null || item.barcode == "") {
            item.barcode = "000000";
          }
          if (item.patient_id == null || item.patient_id == "") {
            item.barcode = "000000";
          }
          register_array.push(item);
        }
      });
    }

    if (register_array.length < 1) return;

    let url = "/app/api/v2/report/scanner/registerScannerArrayInfo";
    let data = {
      params: {
        save_data: register_array
      }
    };
    axios.post(url, data, { 
    })
    .then(res => { // then print response status
        if (res && res.data && res.data.alert_message) {
          let cache_scanner_info = this.state.cache_scanner_info
          if (this.state.cache_scanner_info.length > 0) {
            cache_scanner_info = this.state.cache_scanner_info.filter(item=>{
              if (item.checked == undefined || item.checked == null || item.checked != 1) {
                return item;
              }
            });
          }
          this.setState({
            alert_messages: res.data.alert_message,
            cache_scanner_info,
            checked_list: []
          },()=>{
            this.getScannerMasterData(true);
          });
        }
    })

  }

  handleSelectScannerInfo = (_item, idx) => {
    this.setState({
      selectedScannerInfo: _item,
      selectedScannerIndex: idx
    });
  }  

  getCacheCheckedCount = () => {
    let result  = 0;
    if (this.state.cache_scanner_info.length > 0) {
      this.state.cache_scanner_info.map(item=>{
        if (item.checked != undefined && item.checked  == 1) {
          result ++;
        }
      });
    }
    return result;
  }

  canRegisterScanner = () => {
    let result = false;

    if (this.state.checked_list.length > 0 || this.getCacheCheckedCount() > 0) {      
      result = true;        
    }

    return result;
  }

  handleClearHistory = async () => {
    this.confirmCancel();

    let path = "/app/api/v2/report/scanner/clear_history";
    let post_data = {
    };
    await apiClient
      ._post(path, {
          params: post_data
      })
      .then((res) => {
        if (res) {          
          this.setState({
            alert_messages: "履歴をクリアしました。"
          })
        }        
      })
      .catch(() => {
        this.getScannerMasterData(true);
      });
  }

  clearHistory = () => {
    if (this.state.list_scanner_info.length < 1) return;
    this.setState({
      confirm_message: "履歴をクリアしますか",
      confirm_type: "clear_history",
    });
  }

  handleUniqueItem = (e, patient_info, index) => {
    // validate unique id
    if ((patient_info.unique_id == undefined || patient_info.unique_id == null || patient_info.unique_id == "") && !(patient_info.image_type != undefined && patient_info.image_type == "unique_id")) return;    

    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ hoverMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        hoverMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    let clientY = e.clientY;
    let clientX = e.clientX;
    let state_data = {};
    state_data['hoverMenu'] = {
      visible: true,
      x: clientX - 100,
      y: clientY + window.pageYOffset
    };
    state_data['patient_info_hover'] = patient_info;
    this.setState(state_data, ()=>{
      let modal_header_height = document.getElementsByClassName('scanner-batch-take-doc')[0].getElementsByClassName('modal-header')[0].offsetHeight;
      let table_top = document.getElementsByClassName("schedule-area")[0].offsetTop;
      let tr_top = document.getElementsByClassName("tr-"+index)[0].offsetTop;
      let menu_width = document.getElementsByClassName("hover-menu")[0].offsetWidth;
      let menu_height = document.getElementsByClassName("hover-menu")[0].offsetHeight;
      let scroll_top = $("#table-body").scrollTop();
      state_data['hoverMenu']['y'] = tr_top + table_top + modal_header_height - scroll_top - menu_height;
      let window_width = window.innerWidth;
      if((clientX + menu_width) > window_width){
        state_data['hoverMenu']['x'] = clientX - 100 - menu_width;
      }
      this.setState(state_data);
    });
  };

  closeViewPatientInfo=(e, patient_info)=>{
    // validate unique id
    if ((patient_info.unique_id == undefined || patient_info.unique_id == null || patient_info.unique_id == "") && !(patient_info.image_type != undefined && patient_info.image_type == "unique_id")) return;    

    let hoverMenu = this.state.hoverMenu;
    if(hoverMenu !== undefined && hoverMenu.visible){
      this.setState({hoverMenu: {visible: false}});
    }
  };

  getDepartmentName = code => {
    let name = "";
    this.state.departmentOptions.map(item => {
      if (item.id === parseInt(code)) {
        name = item.value;
      }
    });
    return name;
  };

  getPatientNumberWithZero = (_val) => {
    if (_val == undefined || _val == null) return "";
    if (!(_val.trim() != "" && parseInt(_val.trim()) > 0)) return "";
    
    let converted_val = parseInt(_val.trim()).toString();    
    if (converted_val.length > 6) return converted_val;
    
    let result = "";
    let str_zero = "000000";
    result = str_zero.substring(0, 6 - converted_val.length) + converted_val;
    
    return result;
  }

  getRadio(item, name) { 
    if (this.state.content_type == 1) {
      if (item.number != undefined && item.number > 0 && name != "") {      
        let checked_list = this.state.checked_list;
        let find_idx = checked_list.indexOf(item.number);
        if (find_idx == -1) checked_list.push(item.number);
        else checked_list.splice(find_idx, 1);
        this.setState({checked_list:checked_list});    
      }
    } else {      
      let cache_scanner_info = this.state.cache_scanner_info;
      if (name != "") {
        cache_scanner_info[item].checked = (cache_scanner_info[item].checked + 1) % 2;
      }
      this.setState({cache_scanner_info});          
    }
  }

  getTooltipMessage = (item) => {
    let result = "登録済みです。";
    if ((item.patient_number == undefined || item.patient_number == null || item.patient_number == "") || (item.karte_status == undefined || item.karte_status == null || item.karte_status < 1)) {
      result = "ダブルクリックして個別に情報を登録して下さい。";
    }
    return result;
  }

  getCheckedNumber = () => {
    let result = 0;
    result = this.state.checked_list.length + this.getCacheCheckedCount();
    return result;
  }

  removeChecked = () => {
    this.setState({
      confirm_message: "登録予定の項目をすべて選択解除しますか？",
      confirm_type: "remove_checked",
      confirm_title: "確認"
    });    
  }

  handleConfirmOk = () => {
    if (this.state.confirm_type == "remove_checked") {      
      let cache_scanner_info = this.state.cache_scanner_info;
      if (cache_scanner_info.length > 0) {
        cache_scanner_info = cache_scanner_info.map(item=>{
          item.checked = 0;
          return item;
        });
      }
      this.setState({
        checked_list: [],
        confirm_message: "",
        confirm_type: "",
        confirm_title: "",
        cache_scanner_info
      });
    } else if(this.state.confirm_type == "cancel_input") {
      this.props.closeModal();
    }
  }

  handleCloseModal = () => {
    if (this.getCheckedNumber() > 0 || this.state.cache_scanner_info.length > 0) {
      this.setState({
        confirm_message: "入力内容を破棄しますか？",        
        confirm_type: "cancel_input",        
      });
      return;
    }
    this.props.closeModal();
  }

  setDate = (e) =>{
    let dateStatus = this.state.dateStatus;
    let start_date = this.state.start_date;
    let {after_date} = this.state;
    if(parseInt(e.target.value) === 0){
      dateStatus = new Date();
      start_date = '';
    } else {
      after_date = 0;
    }
    if(parseInt(e.target.value) === 1){
      dateStatus = "";
      start_date = '';
    }
    if(parseInt(e.target.value) === 2){
      if(dateStatus === ''){
        dateStatus = new Date();
      }
      start_date = new Date(dateStatus.getFullYear(), dateStatus.getMonth(), (dateStatus.getDate() - 7));
    }

    this.setState({
      select_date_type:parseInt(e.target.value),
      dateStatus,
      start_date,
      after_date
    })
  };

  getStartDate = value => {
    this.setState({
      start_date: value,
    });
  };

  getAfterDate = (name, value) => {
    if(name === 'after_date'){
      let {select_date_type, start_date} = this.state;
      if (value == 1 && select_date_type != 0) {
        select_date_type = 0;
        start_date = "";
      }
      this.setState({
        after_date:value,
        select_date_type: select_date_type,
        start_date,
        dateStatus : this.state.dateStatus != ''? this.state.dateStatus : new Date(),
      });
    }
  };

  moveDay = (type) => {
    let now_day = this.state.dateStatus;
    if(now_day === ''){
      now_day = new Date();
    }
    let cur_day = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);
    this.setState({
      dateStatus: cur_day,
      select_date_type:0,
      start_date:"",
    });
  };

  selectToday=()=>{
    this.setState({
      dateStatus: new Date(),
      select_date_type:0,
      start_date:"",
    });
  };

  getImportStatus = e => {
    this.setState({ importStatusType: parseInt(e.target.id) });
  };

  getDisplayNumber = e => {
    this.setState({display_number: e.target.value});
  };

  searchScannerByOrder = async (asc_desc = undefined) => {    
    this.setState({
      asc_desc: asc_desc,
      isLoaded: false
    }, ()=>{
      this.getScannerMasterData();
    });    
  };

  onChangePage(pageOfItems, _curPage) {
    if (this.state.content_type == 0) return;
    this.setState({ 
      pageOfItems: pageOfItems,
      current_page: _curPage,
      isLoaded: false
    }, ()=>{
      this.getScannerMasterData(null, "only_data");
    });
  }

  handleSearch = () => {
    this.setState({
      isLoaded: false
    }, () => {
      this.getScannerMasterData();
    });
  }

  setContentType = (e) => {
    if (this.state.content_type == e.target.value) return;
    this.setState({
      content_type: parseInt(e.target.value),
      selectedScannerIndex: '',
      selectedScannerInfo: null
    },()=>{
      if (this.state.content_type == 1) {
        this.getScannerMasterData(null, "only_data");
      }
    });
  }

  isChecked = (_item) => {
    let result = false;
    if (this.state.content_type == 0) {
      result = _item.checked != undefined && _item.checked == 1;
    } else {
      result = this.state.checked_list.includes(_item.number);
    }

    return result == true ? 1 : 0;
  }

  render() {
    let table_list = this.state.content_type == 0 ? this.state.cache_scanner_info : this.state.pageOfItems;
    let canRegisterScanner = this.canRegisterScanner();
    return (
      <Modal show={true} id="add_contact_dlg"  className="scanner-batch-take-doc first-view-modal">
        <Modal.Header><Modal.Title>一覧形式一括読み込み</Modal.Title></Modal.Header>
        <Modal.Body>
          <PatientsWrapper>
            <div className={'flex justify-content'}>
              <div className={'barcode-area flex'}>
                <div className={'flex div-input-area'}>                  
                  <div className={'label-title'}>バーコード</div>
                  <div className={'box-area'} style={{width: "10rem"}}>{this.state.selectedScannerInfo != null && this.state.selectedScannerInfo.barcode != undefined && this.state.selectedScannerInfo.barcode != "000000" && this.state.selectedScannerInfo.barcode}</div>
                </div>                
              </div>
              <div className={'import-count-area flex'}>
                <div className={'label-title'}>取込み件数</div>
                <div className={'box-area'}>{this.state.selectedScannerInfo != null && this.state.selectedScannerInfo.number_of_scanners != undefined && this.state.selectedScannerInfo.number_of_scanners}</div>
              </div>
            </div>
            <div className={'flex justify-content'} style={{marginTop:"1rem"}}>
              <div className={'left-area'}>
                <div className={'flex'}>
                  <div className={'label-title'}>患者氏名</div>
                  <div className={'box-area'}>{this.state.selectedScannerInfo != null && this.state.selectedScannerInfo.patient_name != undefined && this.state.selectedScannerInfo.patient_name}</div>
                </div>
                <div className={'flex'}>
                  <div className={'label-title'}>患者ID</div>
                  <div className={'box-area'}>{this.state.selectedScannerInfo != null && this.state.selectedScannerInfo.patient_number != undefined && this.getPatientNumberWithZero(this.state.selectedScannerInfo.patient_number)}</div>
                </div>
                <div className={'flex'}>
                  <div className={'label-title'}>検査時年齢</div>
                  <div className={'box-area'}></div>
                </div>
                <div className={'flex'}>
                  <div className={'label-title'}>性別</div>
                  <div className={'box-area'} style={{width:"3rem"}}>{this.state.selectedScannerInfo != null && this.state.selectedScannerInfo.gender != undefined ? this.state.selectedScannerInfo.gender == 1 ? "男性" : "女性" : ""}</div>
                </div>
              </div>
              <div className={'middle-area'}>
                <div className={'flex'}>
                  <div className={'label-title'}>オーダ番号</div>
                  <div className={'box-area'}></div>
                </div>
                <div className={'flex'}>
                  <div className={'label-title'}>依頼科</div>
                  <div className={'box-area'}></div>
                </div>
                <div className={'flex'}>
                  <div className={'label-title'}>病棟</div>
                  <div className={'box-area'}></div>
                </div>
                <div className={'flex'}>
                  <div className={'label-title'}>検査項目</div>
                  <div className={'box-area'}></div>
                </div>
              </div>
              <div className={'right-area'}>
                <div className={'flex'}>
                  <div className={'label-title'}>画質</div>
                  <div className={'box-area'}>{this.state.selectedScannerInfo != null && this.state.selectedScannerInfo.set_title != undefined && this.state.selectedScannerInfo.set_title}</div>
                </div>
                <div className={'flex'}>
                  <div className={'label-title'}>カラーモード</div>
                  <div className={'box-area'}>{this.state.selectedScannerInfo != null && this.state.selectedScannerInfo.collar_mode != undefined && this.state.selectedScannerInfo.collar_mode}</div>
                </div>
                <div className={'flex'}>
                  <div className={'label-title'}>解像度</div>
                  <div className={'box-area'}>{this.state.selectedScannerInfo != null && this.state.selectedScannerInfo.resolution != undefined && this.state.selectedScannerInfo.resolution}</div>
                </div>
                <div className={'flex'}>
                  <div className={'label-title'}>取込サイズ（高さ）</div>
                  <div className={'box-area'}>{this.state.selectedScannerInfo != null && this.state.selectedScannerInfo.import_size_height != undefined && this.state.selectedScannerInfo.import_size_height}</div>
                </div>
                <div className={'flex'}>
                  <div className={'label-title'}>取込サイズ（幅）</div>
                  <div className={'box-area'}>{this.state.selectedScannerInfo != null && this.state.selectedScannerInfo.import_size_weight != undefined && this.state.selectedScannerInfo.import_size_weight}</div>
                </div>
                <div className={'flex'}>
                  <div className={'label-title'}>開始位置（縦）</div>
                  <div className={'box-area'}>{this.state.selectedScannerInfo != null && this.state.selectedScannerInfo.start_position_vertical != undefined && this.state.selectedScannerInfo.start_position_vertical}</div>
                </div>
                <div className={'flex'}>
                  <div className={'label-title'}>開始位置（横）</div>
                  <div className={'box-area'}>{this.state.selectedScannerInfo != null && this.state.selectedScannerInfo.start_position_side != undefined && this.state.selectedScannerInfo.start_position_side}</div>
                </div>
              </div>
            </div>
            <Flex className={`${this.state.content_type === 0 ? "content-cache" : "content-db"}`}>   
              <div className="flex inline-radio">
                <RadioButton
                  id="cache"
                  value={0}
                  label="未保存ファイル"
                  name="content_type"
                  getUsage={this.setContentType}
                  checked={this.state.content_type === 0}
                />
                <RadioButton
                  id="no-cache"
                  value={1}
                  label="保存済みファイル"
                  name="content_type"
                  getUsage={this.setContentType}
                  checked={this.state.content_type === 1}
                />
              </div>           
              <SelectorWithLabel
                options={scannerImportStatusOptions}
                title="状態"
                getSelect={this.getImportStatus}
                departmentEditCode={this.state.importStatusType}
              />              
              <div className="display_number">
                <SelectorWithLabel
                  options={perPageOptions}
                  title="表示件数"
                  getSelect={this.getDisplayNumber}
                  departmentEditCode={this.state.display_number}
                />
              </div>
              <Button className="search-btn-style" type="mono" onClick={this.handleSearch.bind(this)}>検索</Button>
            </Flex>
            <Flex className={`${this.state.content_type === 0 ? "content-cache" : "content-db"}`}>
              <div className="date-area" style={{marginTop:"5px"}}>
                <div className="MyCheck d-flex">
                  <Radiobox
                    label="日付指定"
                    value={0}
                    getUsage={this.setDate.bind(this)}
                    checked={this.state.select_date_type === 0 ? true : false}
                    name={`date-scanner-set`}
                  />
                  <div className="prev-day" onClick={this.moveDay.bind(this, 'prev')}>{"＜ "}</div>
                  <div className={'select-today'} onClick={this.selectToday.bind()}>本日</div>
                  <div className="next-day" onClick={this.moveDay.bind(this, 'next')}>{" ＞"}</div>
                </div>
                <div className="MyCheck d-flex">
                  <Radiobox
                    label="期間指定"
                    value={2}
                    getUsage={this.setDate.bind(this)}
                    checked={this.state.select_date_type === 2 ? true : false}
                    name={`date-scanner-set`}
                  />
                  <div className={'d-flex'}>
                    <DatePicker
                      locale="ja"
                      selected={this.state.start_date}
                      onChange={this.getStartDate.bind(this)}
                      dateFormat="yyyy/MM/dd"
                      placeholderText="年/月/日"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      disabled={this.state.select_date_type === 2 ?  false : true}
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                    <div className={'from-to'}>～</div>
                    <DatePicker
                      locale="ja"
                      selected={this.state.dateStatus}
                      onChange={this.getDate.bind(this)}
                      dateFormat="yyyy/MM/dd"
                      placeholderText="年/月/日"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      disabled={this.state.dateStatus === '' ?  true : false}
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                  </div>
                </div>                
              </div>
              <div className={'include-no-date'}>
                <div className="after-date-check">
                  <Checkbox
                    label={'指定日以降'}
                    getRadio={this.getAfterDate.bind(this)}
                    value={this.state.after_date}
                    name={`after_date`}
                  />
                </div>                
              </div>
            </Flex>            
            <div style={{position:'relative'}}>
              <div className={'d-flex condition-area'}>                
                {this.getCheckedNumber() > 0 && (
                  <div style={{lineHeight:"2.2rem"}}>選択中: {this.getCheckedNumber()}件</div>
                )}                
                <div className="check-off footer-buttons">
                  <button className={this.getCheckedNumber() > 0 ? "cancel-btn" : "disable-btn cancel-btn"} onClick={this.removeChecked}>全て選択解除</button>
                </div>
              </div>
            </div>
            <div className={'schedule-area'}>
              <table className="table-scroll table table-bordered table-hover">
                <thead>
                  <tr>
                    <th style={{width:"3rem"}}> </th>
                    <th className='item-check'>登録</th>
                    <th style={{width:"3rem"}}>状態</th>
                    <th style={{width:"15rem"}}>
                      日時
                      {this.state.asc_desc == 'desc' ? (
                        <>
                          <span className='sort-symbol' onClick={this.searchScannerByOrder.bind(this, 'asc')}>▼</span>
                        </>
                      ):(
                        <>
                          <span className='sort-symbol' onClick={this.searchScannerByOrder.bind(this, 'desc')}>▲</span>
                        </>
                      )}                      
                    </th>
                    <th style={{width:"10rem"}}>患者ID</th>
                    <th style={{width:"8rem"}}>検査項目</th>
                    <th style={{width:"15rem"}}>患者氏名</th>
                    <th style={{width:"3rem"}}>枚数</th>
                    <th>メッセージ</th>                                
                  </tr>
                </thead>
                <tbody id="table-body">
                  {this.state.isLoaded == false ? (
                    <div className='spinner-disease-loading center'>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </div>
                  ):(
                    <>
                      {table_list != undefined && table_list != null && table_list.length > 0 && (
                        table_list.map((item, idx)=>{
                          return(
                            <>
                              <tr 
                                className={('tr-'+idx) + (this.state.selectedScannerIndex === idx ? " selected": "")}
                                onClick={()=>this.handleSelectScannerInfo(item, idx)}
                                onDoubleClick={()=>this.openIndividualRead(item, idx)} 
                                onMouseOver={e => this.handleUniqueItem(e, item, idx)}
                                onMouseOut={e => {this.closeViewPatientInfo(e, item)}}
                                style={{cursor:"pointer"}}
                              >
                                <td style={{width:"3rem", textAlign:"right"}}>{idx+1}</td>                                
                                {item.import_status == 1 || (item.patient_number == undefined || item.patient_number == null && item.patient_number == "") || (item.karte_status == undefined || item.karte_status == null || item.karte_status < 1) ? (
                                  <OverlayTrigger
                                    placement={"top"}
                                    overlay={renderTooltip(this.getTooltipMessage(item))}
                                  >                        
                                    <td className={'item-check'}>            
                                      <Checkbox
                                        label=""
                                        getRadio={this.getRadio.bind(this, idx)}
                                        isDisabled={true}
                                        value={item.import_status == 1 ? 1 : 0}                                        
                                        name={"checbox_"+idx}
                                      />                                    
                                    </td>
                                  </OverlayTrigger>
                                ):(
                                  <td className={'item-check'}>
                                    <Checkbox
                                      label=""
                                      getRadio={this.getRadio.bind(this, this.state.content_type == 1 ? item : idx)}                                      
                                      value={this.isChecked(item)}
                                      name={"checbox_"+idx}
                                    />                                  
                                  </td>
                                )}                                                                  
                                <td style={{width:"3rem", textAlign:"center"}}>{item.import_status == 1 ? "済" : "未"}</td>
                                <td style={{width:"15rem"}}>{formatJapanDateTimeIE(item.import_datetime)}</td>
                                <td style={{width:"10rem", textAlign:"right"}}>{item.patient_number != undefined && item.patient_number != null && item.patient_number != "" ? this.getPatientNumberWithZero(item.patient_number) : ""}</td>
                                <td style={{width:"8rem"}}></td>
                                <td style={{width:"15rem"}}>{item.patient_name}</td>
                                <td style={{width:"3rem", textAlign:"right"}}>{item.number_of_scanners != undefined && item.number_of_scanners != null ? item.number_of_scanners : ""}</td>
                                <td></td> 
                              </tr>                              
                            </>
                          )
                        })                   
                      )}                  
                    </>
                  )}
                </tbody>
              </table>
              {this.state.content_type == 0 ? (
                <FromApiPagination
                  items={[]}
                  initialPage={1}
                  onChangePage={this.onChangePage.bind(this)}
                  pageSize = {this.state.display_number}
                  showAlways={true}
                />
              ) : (
                <FromApiPagination
                  items={this.state.list_scanner_info}
                  onChangePage={this.onChangePage.bind(this)}
                  pageSize = {this.state.display_number}
                  showAlways={true}
                />
              )}
            </div>
          </PatientsWrapper>                
        </Modal.Body>
        <Modal.Footer>  
          <Button className={'cancel-btn'} onClick={this.handleCloseModal}>キャンセル</Button>
          {/*<Button className={this.state.list_scanner_info.length > 0 ? "cancel-btn":"disable-btn"} onClick={this.clearHistory}>履歴クリア</Button>
          <div className={'select-value'}>
            <SelectorWithLabel
              options={SET_TIILE}
              getSelect={this.setValue}
              value={this.state.select_value.value}
              departmentEditCode={this.state.select_value.id}
            />
          </div>*/}
          <Button className={'red-btn'} onClick={this.uploadFiles}>アップロード</Button>
          {canRegisterScanner ? (
            <>
              <Button className={'red-btn'} onClick={this.handleRegister}>登録</Button>
            </>
            ):(
            <>
              <Button className={'disable-btn'}>登録</Button>
            </>
            )}          
        </Modal.Footer>
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.confirm_message !== "" && this.state.confirm_type == "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.treatStop.bind(this)}
            confirmTitle= {this.state.confirm_message}            
          />
        )}
        {this.state.confirm_message !== "" && this.state.confirm_type != "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.handleConfirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title= {this.state.confirm_title}
          />
        )}                
        {this.state.openIndividualRead && (
          <IndividualRead
            closeModal={this.closeModal}
            scannerInfo={this.state.selectedScanner}
            saveScannerInfo={this.saveScannerInfo}
            selectedScannerIndex={this.state.selectedScannerIndex}
            scannerInfoList={this.state.content_type == 1 ? this.state.pageOfItems : this.state.cache_scanner_info}
          />        
        )}                
        {this.state.openUploadScannerModal && (
          <UploadScannerModal
            closeModal={this.closeModal}
            uploadFiles={this.handleUploadFiles}
          />
        )}
        <LoadingModal 
          ref={this.LoadingModalRef}
          message={'処理中...'}           
        />
        <HoverMenu
          {...this.state.hoverMenu}
          parent={this}
          patient_info={this.state.patient_info_hover}          
        />
      </Modal>
    );
  }
}

ScannerBatchTakeDoc.contextType = Context;
ScannerBatchTakeDoc.propTypes = {
  closeModal: PropTypes.func,
}
export default ScannerBatchTakeDoc;

