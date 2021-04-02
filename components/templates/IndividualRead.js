import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as apiClient from "~/api/apiClient";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import Button from "~/components/atoms/Button";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import axios from "axios";
import Iframe from 'react-iframe';
import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";

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
  .flex {
    display: flex;
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .karte-status-area{    
    width: 100%;
    .pullbox{
      width: 100%;
    }
    .pullbox-select{
      width: 100%;
      font-size:1rem;
      height: 2rem;
    }
    .pullbox-label{
      width: calc(100% - 10rem);
      margin-bottom: 0px;
    }
  }
  .div-input-area{
    div{
      margin-top: 0px !important;  
      width: 100%;    
    }
    input{
      width: calc(100% - 10rem);
      height: 2rem;
    }
  }
  .spinner-disease-loading{
    height:calc(100% - 2rem);
    overflow: hidden;    
  }
  .label-title {
    margin:0;
    height:2rem; 
    line-height:2rem; 
    font-size:1rem;
  }
  .box-area {
    border:solid 1px #ced4da;
    height:2rem; 
    line-height:2rem; 
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
    width:15%;
    .label-title {
      width:6rem;
    }
    .box-area {
      width:calc(100% - 6rem);
    }
  }
  .left-area {
    width:35%;
    .flex {margin-top:-1px;}
    .label-title {
      width:10rem;
    }
    .box-area {
      width:calc(100% - 10rem);
      border-radius: 4px;
    }
  }
  .middle-area {
    width:50%;
    height: 100%;
    .image-area {
      border:1px solid #aaa;
      height:calc(100% - 2rem);
      overflow-y: auto;
      img{
        width: 100%;
        height: auto;
      }
    }
    .image-block {
      border:1px solid #aaa;
      height:calc(100% - 2rem);
      overflow-y: hidden;      
      .iframe-area {
        width:100%;
        height:100%;
      }
    }
  }
  .right-area {
    width:5%;
    height: 100%;
    div {
      height:20%;
      button {
        height:100%;
      }
    }
  }
  .btn-area {
    button {margin-right:0.5rem;}
    margin-bottom:1rem;
  }
`;

const KARTE_STATUS_TYPE_SCANNER = [
  {
    id: 0,
    value: ""
  },
  {
    id: 1,
    value: "外来"
  },
  {
    id: 2,
    value: "入院"
  },
  {
    id: 3,
    value: "訪問診療"
  }
];

class IndividualRead extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_codes = [{id:0, value:"全て"}];
    this.diagnosis = {};
    departmentOptions.map(department=>{
      this.department_codes.push(department);
      this.diagnosis[parseInt(department.id)] = department.value;
    });    
    let props_scanner_info = JSON.parse(JSON.stringify(this.props.scannerInfo));
    let karte_status = {
      code: 0,
      name: ""
    };
    if (props_scanner_info != undefined && props_scanner_info != null && props_scanner_info.karte_status != undefined) {
      if (props_scanner_info.karte_status == 1) {
        karte_status.code = 1;
        karte_status.name = "外来";            
      } else if(props_scanner_info.karte_status == 2) {
        karte_status.code = 3;
        karte_status.name = "訪問診療";   
      } else if(props_scanner_info.karte_status == 3) {
        karte_status.code = 2;
        karte_status.name = "入院";   
      }
    }
    this.state = {
      number: props_scanner_info && props_scanner_info.number ? props_scanner_info.number : null,
      cache_key: props_scanner_info && props_scanner_info.cache_key ? props_scanner_info.cache_key : null,
      select_value:0,      
      title: props_scanner_info && props_scanner_info.title ? props_scanner_info.title : "",
      set_title: props_scanner_info && props_scanner_info.set_title ? props_scanner_info.set_title : "",
      import_status: props_scanner_info && props_scanner_info.import_status ? props_scanner_info.import_status : 0,
      number_of_scanners: props_scanner_info && props_scanner_info.number_of_scanners ? props_scanner_info.number_of_scanners : 0,
      collar_mode: props_scanner_info && props_scanner_info.collar_mode ? props_scanner_info.collar_mode : "",      
      resolution: props_scanner_info && props_scanner_info.resolution ? props_scanner_info.resolution : "",      
      import_size_weight: props_scanner_info && props_scanner_info.import_size_weight ? props_scanner_info.import_size_weight : null,      
      import_size_height: props_scanner_info && props_scanner_info.import_size_height ? props_scanner_info.import_size_height : null,      
      start_position_vertical: props_scanner_info && props_scanner_info.start_position_vertical ? props_scanner_info.start_position_vertical : null,      
      start_position_side: props_scanner_info && props_scanner_info.start_position_side ? props_scanner_info.start_position_side : null,      
      scanner_photos: props_scanner_info && props_scanner_info.scanner_photos ? props_scanner_info.scanner_photos : [],                  
      selectedScannerIndex: props.selectedScannerIndex ? props.selectedScannerIndex : 0,
      patient_id:props_scanner_info && props_scanner_info.patient_id ? parseInt(props_scanner_info.patient_id) : "",
      patient_number:props_scanner_info && props_scanner_info.patient_number ? props_scanner_info.patient_number : "",
      patient_name: props_scanner_info && props_scanner_info.patient_name ? props_scanner_info.patient_name : "",
      birthday: props_scanner_info && props_scanner_info.birthday ? props_scanner_info.birthday : "",
      gender: props_scanner_info && props_scanner_info.gender ? props_scanner_info.gender : "",
      barcode: props_scanner_info && props_scanner_info.barcode ? props_scanner_info.barcode : "",
      unique_id: props_scanner_info && props_scanner_info.unique_id != undefined && props_scanner_info.unique_id != null && props_scanner_info.unique_id > 0 ? props_scanner_info.unique_id : null,
      department_id: props_scanner_info && props_scanner_info.department_id != undefined && props_scanner_info.department_id != null && props_scanner_info.department_id > 0 ? props_scanner_info.department_id : null,
      document_slip_id: props_scanner_info && props_scanner_info.document_slip_id != undefined && props_scanner_info.document_slip_id != null && props_scanner_info.document_slip_id > 0 ? props_scanner_info.document_slip_id : null,
      document_slip_name: props_scanner_info && props_scanner_info.document_slip_name != undefined && props_scanner_info.document_slip_name != null && props_scanner_info.document_slip_name != "" ? props_scanner_info.document_slip_name : null,
      template_id: props_scanner_info && props_scanner_info.template_id != undefined && props_scanner_info.template_id != null && props_scanner_info.template_id > 0 ? props_scanner_info.template_id : null,
      template_name: props_scanner_info && props_scanner_info.template_name != undefined && props_scanner_info.template_name != null && props_scanner_info.template_name != "" ? props_scanner_info.template_name : null,
      free_comment: props_scanner_info && props_scanner_info.free_comment != undefined && props_scanner_info.free_comment != null && props_scanner_info.free_comment != "" ? props_scanner_info.free_comment : null,
      cur_photo_id: 0, // scanner photo index
      alert_messages:'',
      confirm_message:'',      
      cur_patient_info: null,
      photo_content: "", // current scanner image content      
      karte_status,
      isLoaded: true
    };
    this.ward_name = [];

    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    this.webdav_system_path = "";
    if(initState !== undefined && initState != null && initState.conf_data !== undefined && initState.conf_data.webdav_system_path !== undefined){
      this.webdav_system_path = initState.conf_data.webdav_system_path;
    } else {
      this.webdav_system_path = "http://haruka-develop.99sv-coco.com/webdav/";
    }
  }

  async componentDidMount() {
    this.setState({
      isLoaded: false
    },async ()=>{
      await this.getScannerPhoto();    
    });
  }

  setValue = e => {
    this.setState({ select_value: parseInt(e.target.id)});
  };

  getScannerPhoto = async()=>{
    if (this.isPdf()){
      this.setState({
        isLoaded: true
      });
      return;
    }
    if (this.state.scanner_photos.length < 1) {
      this.setState({
        isLoaded: true
      });
      return;
    }
    let path = "/app/api/v2/report/get_photo";
    let post_data = {
      path: this.state.scanner_photos[this.state.cur_photo_id],
      type: "scanner"
    };

    await apiClient
      .get(path, {
          params: post_data
      })
      .then((res) => {
        this.setState({
          isLoaded: true,
          photo_content: res
        });
      })
      .catch(() => {
        this.setState({
          isLoaded: true
        });
      });
  } 

  confirmCancel() {
    this.setState({
      alert_messages: "",
      confirm_message: "",
    });
  }

  getDate = (key,value) => {
    if (value == null) {
      value = new Date();
    }
    this.setState({
      [key]: value
    });
  };      

  getSetTitle = e => {
    this.setState({set_title:e.target.value});
  }

  getDocumentTitle = e => {
    this.setState({title:e.target.value});
  }

  getColorMode = e => {
    this.setState({collar_mode:e.target.value});
  }

  getResolution = e => {
    this.setState({resolution:e.target.value});
  }

  getImportSizeWeight = e => {
    this.setState({import_size_weight:e.target.value});
  }

  getStartPositionVertical = e => {
    this.setState({start_position_vertical:e.target.value});
  }

  getStartPositionSide = e => {
    this.setState({start_position_side:e.target.value});
  }

  getImportSizeHeight = e => {
    this.setState({import_size_height:e.target.value});
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

    let search_key;
    if (this.state.barcode.length > 2 && this.state.barcode.substring(0, 2) == "U_") {      
      let unique_id_array = this.state.barcode.split("U_");
      search_key = unique_id_array[1];
      if (!isNaN(parseInt(search_key))) {
        search_key = parseInt(search_key);
      }
      url = "/app/api/v2/document/search_unique_id";
      data = {
        params: {
          uniqueId: search_key
        }
      };
    }
    axios.post(url, data, { 
    })
    .then(res => { // then print response status
        if (res) {
          let _state = {};
          if (res.data.unique_data != undefined) { // unique info
            // ■YJ988 スキャナー一括取り込みの個別読み込み画面で、バーコード手入力欄が患者IDにしか対応していない
            _state.unique_id = search_key;              
            _state.department_id = res.data.unique_data.department_id != undefined && res.data.unique_data.department_id != null ? res.data.unique_data.department_id : null;              
            _state.document_slip_id = res.data.unique_data.document_slip_id != undefined && res.data.unique_data.document_slip_id != null ? res.data.unique_data.document_slip_id : null;              
            _state.document_slip_name = res.data.unique_data.document_slip_name != undefined && res.data.unique_data.document_slip_name != null ? res.data.unique_data.document_slip_name : null;              
            _state.template_id = res.data.unique_data.template_id != undefined && res.data.unique_data.template_id != null ? res.data.unique_data.template_id : null;              
            _state.template_name = res.data.unique_data.template_name != undefined && res.data.unique_data.template_name != null ? res.data.unique_data.template_name : null;              
            _state.title = _state.template_name;              
            _state.free_comment = res.data.unique_data.free_comment != undefined && res.data.unique_data.free_comment != null ? res.data.unique_data.free_comment : null;              
            _state.karte_status = {
              code: 0,
              name: ""
            };              
            if (res.data.unique_data.karte_status != undefined && res.data.unique_data.karte_status != null) {
              if (res.data.unique_data.karte_status == 1) {
                _state.karte_status.code = 1;
                _state.karte_status.name = "外来";            
              } else if(res.data.unique_data.karte_status == 2) {
                _state.karte_status.code = 3;
                _state.karte_status.name = "訪問診療";   
              } else if(res.data.unique_data.karte_status == 3) {
                _state.karte_status.code = 2;
                _state.karte_status.name = "入院";   
              }
            }                        
            _state.patient_name = res.data.patient_info.patient_name ? res.data.patient_info.patient_name : "";
            _state.patient_number = res.data.patient_info.patient_number ? res.data.patient_info.patient_number : "";
            _state.patient_id = res.data.patient_info.system_patient_id ? res.data.patient_info.system_patient_id : "";
            _state.gender = res.data.patient_info.gender ? res.data.patient_info.gender : "";
            _state.birthday = res.data.patient_info.birthday ? res.data.patient_info.birthday : "";                       
          } else { // patient info
            _state.unique_id = null;
            _state.cur_patient_info = res.data ? res.data : null;
            _state.patient_name = res.data && res.data.patient_name ? res.data.patient_name : "";
            _state.patient_number = res.data && res.data.patient_number ? res.data.patient_number : "";
            _state.patient_id = res.data && res.data.system_patient_id ? res.data.system_patient_id : "";
            _state.gender = res.data && res.data.gender ? res.data.gender : "";
            _state.birthday = res.data && res.data.birthday ? res.data.birthday : "";
            _state.title = "";
            _state.department_id = null;              
            _state.document_slip_id = null;
            _state.document_slip_name = null;
            _state.template_id = null;
            _state.template_name = null;
            _state.free_comment = null;
            _state.karte_status = {
              code: 0,
              name: ""
            };
          }
          this.setState(_state);
        }
    })    
  }

  getBarcode = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {        
      this.searchList();
    } else {
      this.setState({barcode:e.target.value});
    }
  }

  saveInfo = () => {
    // validate karte_status
    if (this.state.karte_status.name == "") {
      this.setState({
        alert_messages: "入外区分を選択してください。"
      });
      return;
    }
    if (this.state.number > 0) {
      if (!(this.state.patient_id > 0)) {
        this.setState({
          alert_messages: "患者情報を入力してください。"
        });
        return;
      }
    }
    // if(this.state.number == null) return;

    let save_data = {};
    save_data.number = this.state.number;
    save_data.barcode = this.state.patient_id == null || this.state.patient_id == "" ? "000000" : this.state.barcode;
    save_data.cache_key = this.state.cache_key;
    save_data.patient_id = this.state.patient_id;
    save_data.patient_number = this.state.patient_number;
    save_data.scanner_photos = this.state.scanner_photos;
    save_data.patient_name = this.state.patient_name;
    save_data.birthday = this.state.birthday;
    save_data.gender = this.state.gender;
    save_data.import_status = this.state.import_status;
    save_data.title = this.state.title;
    save_data.set_title = this.state.set_title;
    save_data.collar_mode = this.state.collar_mode;
    save_data.resolution = this.state.resolution;
    save_data.import_size_weight = this.state.import_size_weight;
    save_data.import_size_height = this.state.import_size_height;
    save_data.start_position_vertical = this.state.start_position_vertical;
    save_data.start_position_side = this.state.start_position_side;  
    save_data.number_of_scanners = this.state.number_of_scanners;  
    save_data.unique_id = this.state.unique_id;  
    save_data.department_id = this.state.department_id;  
    save_data.document_slip_id = this.state.document_slip_id;  
    save_data.document_slip_name = this.state.document_slip_name;  
    save_data.template_id = this.state.template_id;  
    save_data.template_name = this.state.template_name;  
    save_data.free_comment = this.state.free_comment;  
    let karte_status_code = this.state.karte_status.code;
    if (karte_status_code == 2) karte_status_code = 3;
    else if(karte_status_code == 3) karte_status_code = 2;
    save_data.karte_status = karte_status_code;  
    this.props.saveScannerInfo(save_data);
  }

  getBeforePhoto = () => {    
    if (this.state.cur_photo_id == 0) return;
    this.setState({
      cur_photo_id: this.state.cur_photo_id > 0 ? this.state.cur_photo_id - 1 : this.state.cur_photo_id,
      isLoaded: false
    },()=>{
      this.getScannerPhoto();
    });
  }

  getNextPhoto = () => {    
    if (this.state.cur_photo_id == this.state.scanner_photos.length - 1) return;
    this.setState({
      cur_photo_id: this.state.cur_photo_id < this.state.scanner_photos.length - 1 ? this.state.cur_photo_id + 1 : this.state.cur_photo_id,
      isLoaded: false
    },()=>{
      this.getScannerPhoto();
    });
  }

  getBeforeScannerInfo = () => {
    if (this.state.selectedScannerIndex == 0) return;
    let selectedScannerIndex = this.state.selectedScannerIndex > 0 ? this.state.selectedScannerIndex - 1 : this.state.selectedScannerIndex;
    let props_scanner_info = this.props.scannerInfoList[selectedScannerIndex];
    let karte_status = {
      code: 0,
      name: ""
    };
    if (props_scanner_info != undefined && props_scanner_info != null && props_scanner_info.karte_status != undefined) {
      if (props_scanner_info.karte_status == 1) {
        karte_status.code = 1;
        karte_status.name = "外来";            
      } else if(props_scanner_info.karte_status == 2) {
        karte_status.code = 3;
        karte_status.name = "訪問診療";   
      } else if(props_scanner_info.karte_status == 3) {
        karte_status.code = 2;
        karte_status.name = "入院";   
      }
    }
    this.setState({
      selectedScannerIndex,
      number: props_scanner_info && props_scanner_info.number ? props_scanner_info.number : null,
      cache_key: props_scanner_info && props_scanner_info.cache_key ? props_scanner_info.cache_key : null,
      select_value:0,      
      title: props_scanner_info && props_scanner_info.title ? props_scanner_info.title : "",
      set_title: props_scanner_info && props_scanner_info.set_title ? props_scanner_info.set_title : "",
      import_status: props_scanner_info && props_scanner_info.import_status ? props_scanner_info.import_status : 0,
      number_of_scanners: props_scanner_info && props_scanner_info.number_of_scanners ? props_scanner_info.number_of_scanners : 0,
      collar_mode: props_scanner_info && props_scanner_info.collar_mode ? props_scanner_info.collar_mode : "",      
      resolution: props_scanner_info && props_scanner_info.resolution ? props_scanner_info.resolution : "",      
      import_size_weight: props_scanner_info && props_scanner_info.import_size_weight ? props_scanner_info.import_size_weight : "",      
      import_size_height: props_scanner_info && props_scanner_info.import_size_height ? props_scanner_info.import_size_height : "",      
      start_position_vertical: props_scanner_info && props_scanner_info.start_position_vertical ? props_scanner_info.start_position_vertical : "",      
      start_position_side: props_scanner_info && props_scanner_info.start_position_side ? props_scanner_info.start_position_side : "",      
      scanner_photos: props_scanner_info && props_scanner_info.scanner_photos ? props_scanner_info.scanner_photos : [],                        
      patient_id:props_scanner_info && props_scanner_info.patient_id ? parseInt(props_scanner_info.patient_id) : "",
      patient_number:props_scanner_info && props_scanner_info.patient_number ? parseInt(props_scanner_info.patient_number) : "",
      patient_name: props_scanner_info && props_scanner_info.patient_name ? props_scanner_info.patient_name : "",
      birthday: props_scanner_info && props_scanner_info.birthday ? props_scanner_info.birthday : "",
      gender: props_scanner_info && props_scanner_info.gender ? props_scanner_info.gender : "",
      barcode: props_scanner_info && props_scanner_info.barcode ? props_scanner_info.barcode : "",
      unique_id: props_scanner_info && props_scanner_info.unique_id != undefined && props_scanner_info.unique_id != null && props_scanner_info.unique_id > 0 ? props_scanner_info.unique_id : null,
      department_id: props_scanner_info && props_scanner_info.department_id != undefined && props_scanner_info.department_id != null && props_scanner_info.department_id > 0 ? props_scanner_info.department_id : null,
      document_slip_id: props_scanner_info && props_scanner_info.document_slip_id != undefined && props_scanner_info.document_slip_id != null && props_scanner_info.document_slip_id > 0 ? props_scanner_info.document_slip_id : null,
      document_slip_name: props_scanner_info && props_scanner_info.document_slip_name != undefined && props_scanner_info.document_slip_name != null && props_scanner_info.document_slip_name != "" ? props_scanner_info.document_slip_name : null,
      template_id: props_scanner_info && props_scanner_info.template_id != undefined && props_scanner_info.template_id != null && props_scanner_info.template_id > 0 ? props_scanner_info.template_id : null,
      template_name: props_scanner_info && props_scanner_info.template_name != undefined && props_scanner_info.template_name != null && props_scanner_info.template_name != "" ? props_scanner_info.template_name : null,
      free_comment: props_scanner_info && props_scanner_info.free_comment != undefined && props_scanner_info.free_comment != null && props_scanner_info.free_comment != "" ? props_scanner_info.free_comment : null,
      cur_photo_id: 0, // scanner photo index
      alert_messages:'',
      confirm_message:'',   
      karte_status,   
      cur_patient_info: null,
      photo_content: "", // current scanner image content
      isLoaded: false
    },async ()=>{
      await this.getScannerPhoto();
    });
  }

  getNextScannerInfo = () => {    
    if(this.state.selectedScannerIndex == (this.props.scannerInfoList.length - 1)) return;
    let selectedScannerIndex = this.state.selectedScannerIndex < this.props.scannerInfoList.length - 1 ? this.state.selectedScannerIndex + 1 : this.state.selectedScannerIndex;
    let props_scanner_info = this.props.scannerInfoList[selectedScannerIndex];
    let karte_status = {
      code: 0,
      name: ""
    };
    if (props_scanner_info != undefined && props_scanner_info != null && props_scanner_info.karte_status != undefined) {
      if (props_scanner_info.karte_status == 1) {
        karte_status.code = 1;
        karte_status.name = "外来";            
      } else if(props_scanner_info.karte_status == 2) {
        karte_status.code = 3;
        karte_status.name = "訪問診療";   
      } else if(props_scanner_info.karte_status == 3) {
        karte_status.code = 2;
        karte_status.name = "入院";   
      }
    }
    this.setState({
      selectedScannerIndex,
      number: props_scanner_info && props_scanner_info.number ? props_scanner_info.number : null,
      cache_key: props_scanner_info && props_scanner_info.cache_key ? props_scanner_info.cache_key : null,
      select_value:0,      
      title: props_scanner_info && props_scanner_info.title ? props_scanner_info.title : "",
      set_title: props_scanner_info && props_scanner_info.set_title ? props_scanner_info.set_title : "",
      import_status: props_scanner_info && props_scanner_info.import_status ? props_scanner_info.import_status : 0,
      number_of_scanners: props_scanner_info && props_scanner_info.number_of_scanners ? props_scanner_info.number_of_scanners : 0,
      collar_mode: props_scanner_info && props_scanner_info.collar_mode ? props_scanner_info.collar_mode : "",      
      resolution: props_scanner_info && props_scanner_info.resolution ? props_scanner_info.resolution : "",      
      import_size_weight: props_scanner_info && props_scanner_info.import_size_weight ? props_scanner_info.import_size_weight : "",      
      import_size_height: props_scanner_info && props_scanner_info.import_size_height ? props_scanner_info.import_size_height : "",      
      start_position_vertical: props_scanner_info && props_scanner_info.start_position_vertical ? props_scanner_info.start_position_vertical : "",      
      start_position_side: props_scanner_info && props_scanner_info.start_position_side ? props_scanner_info.start_position_side : "",      
      scanner_photos: props_scanner_info && props_scanner_info.scanner_photos ? props_scanner_info.scanner_photos : [],                        
      patient_id:props_scanner_info && props_scanner_info.patient_id ? parseInt(props_scanner_info.patient_id) : "",
      patient_number:props_scanner_info && props_scanner_info.patient_number ? parseInt(props_scanner_info.patient_number) : "",
      patient_name: props_scanner_info && props_scanner_info.patient_name ? props_scanner_info.patient_name : "",
      birthday: props_scanner_info && props_scanner_info.birthday ? props_scanner_info.birthday : "",
      gender: props_scanner_info && props_scanner_info.gender ? props_scanner_info.gender : "",
      barcode: props_scanner_info && props_scanner_info.barcode ? props_scanner_info.barcode : "",
      unique_id: props_scanner_info && props_scanner_info.unique_id != undefined && props_scanner_info.unique_id != null && props_scanner_info.unique_id > 0 ? props_scanner_info.unique_id : null,
      department_id: props_scanner_info && props_scanner_info.department_id != undefined && props_scanner_info.department_id != null && props_scanner_info.department_id > 0 ? props_scanner_info.department_id : null,
      document_slip_id: props_scanner_info && props_scanner_info.document_slip_id != undefined && props_scanner_info.document_slip_id != null && props_scanner_info.document_slip_id > 0 ? props_scanner_info.document_slip_id : null,
      document_slip_name: props_scanner_info && props_scanner_info.document_slip_name != undefined && props_scanner_info.document_slip_name != null && props_scanner_info.document_slip_name != "" ? props_scanner_info.document_slip_name : null,
      template_id: props_scanner_info && props_scanner_info.template_id != undefined && props_scanner_info.template_id != null && props_scanner_info.template_id > 0 ? props_scanner_info.template_id : null,
      template_name: props_scanner_info && props_scanner_info.template_name != undefined && props_scanner_info.template_name != null && props_scanner_info.template_name != "" ? props_scanner_info.template_name : null,
      free_comment: props_scanner_info && props_scanner_info.free_comment != undefined && props_scanner_info.free_comment != null && props_scanner_info.free_comment != "" ? props_scanner_info.free_comment : null,
      cur_photo_id: 0, // scanner photo index
      alert_messages:'',
      confirm_message:'',      
      cur_patient_info: null,
      karte_status,
      photo_content: "", // current scanner image content
      isLoaded: false
    },async ()=>{
      await this.getScannerPhoto();
    });
  }

  isPdf = () => {
    let result = false;
    if (this.state.scanner_photos.length < 1) return result;
    let cur_file_path = this.state.scanner_photos[this.state.cur_photo_id];
    if (cur_file_path.substring(cur_file_path.length - 4) == ".pdf") result = true;
    return result;
  }

  getPatientNumberWithZero = (_val) => {
    _val = _val.toString();    
    if (_val == undefined || _val == null) return "";
    if (!(_val.trim() != "" && parseInt(_val.trim()) > 0)) return "";
    
    let converted_val = parseInt(_val.trim()).toString();    
    if (converted_val.length > 6) return converted_val;
    
    let result = "";
    let str_zero = "000000";
    result = str_zero.substring(0, 6 - converted_val.length) + converted_val;
    
    return result;
  }

  getKarteStatus = e => {
    let karte_status = this.state.karte_status;
    karte_status.code = e.target.id;
    karte_status.name = e.target.value;
    this.setState({
      karte_status
    });
  };

  render() {
    return (
      <Modal show={true} id="add_contact_dlg"  className="scanner-batch-take-doc individual-read first-view-modal">
        <Modal.Header><Modal.Title>個別読込み</Modal.Title></Modal.Header>
        <Modal.Body>
          <PatientsWrapper>
            <div className={'btn-area'}>
              {/*<button>取込み一覧</button>*/}
              <Button type="common" onClick={this.getBeforeScannerInfo}>前</Button>
              <Button type="common" onClick={this.getNextScannerInfo}>次</Button>              
            </div>            
            <div className={'flex justify-content'} style={{marginTop:"1rem", height:"calc(100% - 4rem)"}}>
              <div className={'left-area'}>
                <div className={'flex div-input-area'} style={{marginBottom:"1rem"}}>
                  <InputBoxTag
                    label="バーコード"                                    
                    type="text"
                    getInputText={this.getBarcode.bind(this)}                  
                    onBlur={this.getOnBlur.bind(this)}                  
                    value={this.state.barcode}
                  />                  
                </div>
                <div className={'flex'}>
                  <div className={'label-title'}>患者氏名</div>
                  <div className={'box-area'}>{this.state.patient_name}</div>
                </div>
                <div className={'flex'}>                   
                  <div className={'label-title'}>患者ID</div>
                  <div className={'box-area'}>{this.getPatientNumberWithZero(this.state.patient_number)}</div>               
                </div>                  
                <div className={'flex'}>
                  <div className={'label-title'}>検査時年齢</div>
                  <div className={'box-area'}></div>
                </div>
                <div className={'flex'} style={{marginBottom: "1rem"}}>
                  <div className={'label-title'}>性別</div>
                  <div className={'box-area'} style={{width:"3rem"}}>{this.state.gender == 1 ? "男性" :  this.state.gender == 2 ? "女性" : ""}</div>
                </div>
                <div className={'flex div-input-area'}>
                  <InputWithLabel
                    label="タイトル"
                    type="text"
                    className="name-area"
                    getInputText={this.getDocumentTitle.bind(this)}
                    diseaseEditData={this.state.title}
                  />
                </div>                
                {this.state.unique_id != null && this.state.unique_id > 0 ? (
                  <>
                    <div className="karte-status-area flex">
                      <SelectorWithLabel
                        title="入外区分"
                        options={KARTE_STATUS_TYPE_SCANNER}
                        getSelect={this.getKarteStatus}
                        value={this.state.karte_status.name}
                        departmentEditCode={this.state.karte_status.code}                      
                      />
                    </div>
                    <div className={'flex'}>
                      <div className={'label-title'}>診療科</div>
                      <div className={'box-area'}>{this.diagnosis[this.state.department_id]}</div>
                    </div>
                    <div className={'flex'}>
                      <div className={'label-title'}>文書種類</div>
                      <div className={'box-area'}>{this.state.document_slip_name}</div>
                    </div>
                    <div className={'flex'}>
                      <div className={'label-title'}>書類名</div>
                      <div className={'box-area'}>{this.state.template_name}</div>
                    </div>
                    <div className={'flex'}>
                      <div className={'label-title'}>備考</div>
                      <div className={'box-area'}>{this.state.free_comment}</div>
                    </div>
                  </>
                ):(
                  <>
                    <div className="karte-status-area flex">
                      <SelectorWithLabel
                        title="入外区分"
                        options={KARTE_STATUS_TYPE_SCANNER}
                        getSelect={this.getKarteStatus}
                        value={this.state.karte_status.name}
                        departmentEditCode={this.state.karte_status.code}                      
                      />
                    </div>
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
                  </>
                )}
                <div className={'flex'} style={{marginTop:"1rem"}}>
                  <div className={'label-title'}>状態</div>
                  <div className={'box-area'}>{this.state.import_status == 1 ? "済" : "未"}</div>
                </div>
                <div className={'flex div-input-area'}>
                  <InputWithLabel
                    label="画質"
                    type="text"
                    className="name-area"
                    getInputText={this.getSetTitle.bind(this)}
                    diseaseEditData={this.state.set_title}
                  />
                </div>
                <div className={'flex div-input-area'}>
                  <InputWithLabel
                    label="カラーモード"
                    type="text"
                    className="name-area"
                    getInputText={this.getColorMode.bind(this)}
                    diseaseEditData={this.state.collar_mode}
                  />
                </div>
                <div className={'flex div-input-area'}>
                  <InputWithLabel
                    label="解像度"
                    type="text"
                    className="name-area"
                    getInputText={this.getResolution.bind(this)}
                    diseaseEditData={this.state.resolution}
                  />                  
                </div>
                <div className={'flex div-input-area'}>
                  <InputWithLabel
                    label="取込サイズ（高さ）"
                    type="text"
                    className="name-area"
                    getInputText={this.getImportSizeHeight.bind(this)}
                    diseaseEditData={this.state.import_size_height}
                  />                   
                </div>
                <div className={'flex div-input-area'}>
                  <InputWithLabel
                    label="取込サイズ（幅）"
                    type="text"
                    className="name-area"
                    getInputText={this.getImportSizeWeight.bind(this)}
                    diseaseEditData={this.state.import_size_weight}
                  />                   
                </div>
                <div className={'flex div-input-area'}>
                  <InputWithLabel
                    label="開始位置（縦）"
                    type="text"
                    className="name-area"
                    getInputText={this.getStartPositionVertical.bind(this)}
                    diseaseEditData={this.state.start_position_vertical}
                  />                  
                </div>
                <div className={'flex div-input-area'}>
                  <InputWithLabel
                    label="開始位置（横）"
                    type="text"
                    className="name-area"
                    getInputText={this.getStartPositionSide.bind(this)}
                    diseaseEditData={this.state.start_position_side}
                  />                   
                </div>                
              </div>
              <div className={'middle-area'}>
                {this.state.isLoaded == false ? (
                  <div className='spinner-disease-loading center'>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                ):(
                  <>
                    {this.isPdf() == true ? (
                      <>
                        <div className={'image-block'}>
                          <div className={'iframe-area'}>
                            <Iframe
                              url={"/app/api/v2/top/binary?path=" + this.state.scanner_photos[this.state.cur_photo_id]}
                              width="100%"
                              height="100%"
                              id="myId"
                              className=""
                              display="initial"
                              position="relative"
                              allowFullScreen
                            />
                          </div>                      
                        </div>
                      </>
                    ):(
                      <>
                        <div className={'image-area'}>
                          {this.state.photo_content != "" && (
                            <>
                              <img src={this.state.photo_content} />
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
                <div style={{textAlign:"center"}}>{this.state.scanner_photos.length == 0 ? 0 : this.state.cur_photo_id + 1} / {this.state.scanner_photos.length}</div>
              </div>
              <div className={'right-area'}>
                <div></div>
                <div>
                  <Button type="common" onClick={this.getBeforePhoto}>▲</Button>                  
                </div>
                <div></div>
                <div>
                  <Button type="common" onClick={this.getNextPhoto}>▼</Button>                  
                </div>
                <div></div>
              </div>
            </div>
          </PatientsWrapper>                
        </Modal.Body>
        <Modal.Footer>  
          <Button className={'cancel-btn'} onClick={this.props.closeModal}>キャンセル</Button>
          {/*<div className={'select-value'}>
            <SelectorWithLabel
              options={[]}
              title=""
              getSelect={this.setValue}
              departmentEditCode={this.state.select_value}
            />
          </div>*/}
          {/*<Button className={'red-btn'}>取込み開始</Button>*/}
          <Button className={'red-btn'} onClick={this.saveInfo}>登録</Button>
        </Modal.Footer>
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.treatStop.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}                        
      </Modal>
    );
  }
}

IndividualRead.contextType = Context;
IndividualRead.propTypes = {
  closeModal: PropTypes.func,
  saveScannerInfo: PropTypes.func,
  scannerInfo: PropTypes.object,
  scannerInfoList: PropTypes.array,
  selectedScannerIndex: PropTypes.number,
}
export default IndividualRead;

