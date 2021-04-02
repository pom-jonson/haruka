import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import {surface} from "~/components/_nano/colors";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import { faPlus, faMinus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import SearchBar from "~/components/molecules/SearchBar";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import Checkbox from "~/components/molecules/Checkbox";
import Radiobox from "~/components/molecules/Radiobox";
import DocumentSaveConfirm from "./DocumentSaveConfirm";
import XLSX from 'xlsx';
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import {fetch} from 'whatwg-fetch'
import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_LOCALNAMES, CACHE_SESSIONNAMES, checkSMPByUnicode} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {addRedBorder} from "~/helpers/dialConstants";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import * as localApi from "~/helpers/cacheLocal-utils";
import SelectDoctorModal from "~/components/molecules/SelectDoctorModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  .flex {display: flex;}
  .header-area {
    width: 100%;
    margin-bottom:0.5rem;
    display:flex;
    align-items: flex-start;
    justify-content: space-between;
    .preview-box {
      border:1px solid #aaa;
      text-align: center;
      font-size: 1rem;
    }
  }
  .work-list{
    width: 100%;
    margin-bottom: 0.5rem;
    align-items: flex-start;
    justify-content: space-between;
    .left-area {
      width:30%;
      height: 41vh;
      .panel-menu {
        width: 100%;
        font-size: 1rem;
        font-weight: bold;
        .menu-btn {
          width:100px;
          text-align: center;
          border: 1px solid #aaa;
          background-color: rgba(200, 194, 194, 0.22);
          height: 2rem;
          line-height: 2rem;
          cursor: pointer;
        }
        .active-menu {
          width:100px;
          text-align: center;
          border-top: 1px solid #aaa;
          border-right: 1px solid #aaa;
          border-left: 1px solid #aaa;
          height: 2rem;
          line-height: 2rem;
        }
        .no-menu {
          width: calc(100% - 100px);
          border-bottom: 1px solid #aaa;
        }
      }
      .tree-area {
        border-bottom: 1px solid #aaa;
        border-right: 1px solid #aaa;
        border-left: 1px solid #aaa;
        height: calc(100% - 2rem);
        width:100%;
        padding-top:0.5rem;
        .radio-area {
          height: 2rem;
          line-height: 2rem;
          padding-left: 1rem;
          margin-bottom: 0.5rem;
          label {
           font-size: 1rem;
           line-height: 2rem;
            height: 2rem;
          }
        }
        .search-word {
          margin-bottom: 0.5rem;
          display:flex;
          div {
            margin-top:0;
            height:2rem !important;
            line-height: 2rem;
          }
          .label-title {
            font-size: 1rem;
            width:3rem;
            line-height:2rem;
            margin: 0;
            margin-left: 0.5rem;
          }
          input {
            width:100%;
            height: 2rem;
            font-size: 1rem;
          }
          svg {
            font-size: 1rem;
            top: 0.6rem;
          }
        }
      }
    }
    .right-area {
      border: 1px solid #aaa;
      width:68%;
      height: 41vh;
      overflow:auto;
    }
  }
  .bottom-area {
    align-items: flex-start;
    justify-content: space-between;
    .left-area {
      width:30%;
    }
    .right-area {
      width:68%;
      div {margin-top:0;}
      .label-title {
        width:8rem;
        line-height:2rem;
        margin: 0;
        font-size:1rem;
      }
      input {
        height:2rem;
        font-size:1rem;
        width:calc(100% - 8rem);
      }
    }
  }
  .check-area {
    label {
      font-size:1rem;
      line-height: 2rem;
    }
  }
`;

const Col = styled.div`
  width: calc(100% - 1rem);
  height: calc(100% - 3rem);
  flex-grow: 1;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  background-color: ${surface};
  overflow:auto;
  border: 1px solid #aaa;
  margin-left: 0.5rem;
  .tree_open{

  }
  .tree_close{
    display:none;
  }
  nav ul li{
    padding-right: 0 !important;
  }
  li{
    cursor: default;
  }
  li span{
    cursor: pointer;
    white-space: nowrap;
  }
  nav {
    padding: 4px 0;
    ul {
      padding-left: 0;
      margin-bottom: 0;
      &:before {
        content: "";
        border-left: 1px solid #ccc;
        display: block;
        width: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
      }

      .selected {
        background: #ddd;
      }
      ul {
        margin-left: 10px;
        position: relative;
        margin-bottom: 0px;

        li {
          padding: 0px 12px;

          &:before {
            content: "";
            border-top: 1px solid #ccc;
            display: block;
            width: 8px;
            height: 0;
            position: absolute;
            top: 10px;
            left: 0;
          }
          &:last-child:before {
            background: #fff;
            height: auto;
            top: 10px;
            bottom: 0;
          }

          ul {
            margin-bottom: 0px;
            li {
              padding: 0px 12px;

              ul {
                margin-bottom: 0px;

                li {
                  padding: 0px 12px;
                }
              }
            }
          }
        }
      }
      li {
        margin: 0;
        padding: 3px 12px;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 0.8125‬rem;
        line-height: 20px;
        position: relative;
      }
    }

    li {
      cursor: pointer;
      list-style-type: none;
    }
  }
`;

const Icon = styled(FontAwesomeIcon)`
  color: black;
  font-size: 15px;
  margin-right: 5px;
`;

const SpinnerWrapper = styled.div`
  width:100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class DocumentCreate extends Component {
  constructor(props) {
    super(props);
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_names ={};
    let openOtherDepartmentTree = {};
    openOtherDepartmentTree[0] = false;
    departmentOptions.map(department=>{
      openOtherDepartmentTree[parseInt(department.id)] = false;
      this.department_names[parseInt(department.id)] = department.value;
    });
    let patient_id = 0;
    let patient_info = {};
    let re = /patients[/]\d+/;
    let cur_url = window.location.href;
    let isPatientPage = re.test(cur_url);
    if(isPatientPage){
      let path = cur_url.split("/");
      if (path[path.length - 1] == "nursing_document"){
        let nurse_patient_info = localApi.getObject("nurse_patient_info");
        if(nurse_patient_info !== undefined && nurse_patient_info != null){
          if(nurse_patient_info.detailedPatientInfo !== undefined && nurse_patient_info.detailedPatientInfo.patient !== undefined){
            patient_id = nurse_patient_info.detailedPatientInfo.patient[0]['number'];
          }
          if(nurse_patient_info.patientInfo !== undefined){
            patient_info.patient_number = nurse_patient_info.patientInfo.receId;
            patient_info.name = nurse_patient_info.patientInfo.name;
            patient_info.kana = nurse_patient_info.patientInfo.kana;
            patient_info.sex = nurse_patient_info.patientInfo.sex;
            patient_info.age = nurse_patient_info.patientInfo.age;
            patient_info.birth_day = nurse_patient_info.patientInfo.birth_day;
          }
        }
      } else {
        patient_id = localApi.getValue("current_system_patient_id");
        let patientInfo = karteApi.getPatient(patient_id);
        patient_info.patient_number = patientInfo.receId;
        patient_info.name = patientInfo.name;
        patient_info.kana = patientInfo.kana;
        patient_info.sex = patientInfo.sex;
        patient_info.age = patientInfo.age;
        patient_info.birth_day = patientInfo.birth_day;
      }
    } else {
      patient_info = null;
    }
    this.state = {
      patient_id,
      patient_info,
      tab_id:0,
      preview_skip:0,
      favorite_flg:0,
      search_type:"common",
      key_word:"",
      tree_data:[],
      selected_tree:"",
      html: "",
      load_excel: true,
      load_data_flag:false,
      selected_document_data:{},
      selected_templete_name:"",
      templete_name:"",
      free_comment:"",
      openDocumentSaveConfirm:false,
      alert_messages:"",
      confirm_message:"",
      cur_tree_data:[],
      departmentOptions,
      openPatientTree:false,
      openUserTree:false,
      openDepartmentTree:false,
      openCommonTree:false,
      openOtherDepartmentTree,
      set_order_data:null,
      isOpenSelectDoctor:false,
      complete_message:"",
    };
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    this.webdav_system_path = "";
    if(initState !== undefined && initState != null && initState.conf_data !== undefined && initState.conf_data.webdav_system_path !== undefined){
      this.webdav_system_path = initState.conf_data.webdav_system_path;
    } else {
      this.webdav_system_path = "http://haruka-develop.99sv-coco.com/webdav/";
    }
    this.save_flag = 0;
    this.doctors = sessApi.getDoctorList();
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.can_register = false;
  }

  async componentDidMount() {
    this.can_register = this.context.$canDoAction(this.context.FEATURES.DOCUMENT_CREATE, this.context.AUTHS.REGISTER);
    await this.getDocumentTree();
  }

  setTab = ( e, val ) => {
    this.setState({
      tab_id:val,
      tree_data:[],
    }, ()=>{
      this.getDocumentTree();
    });
  };

  setSearchType = (e) => {
    this.setState({search_type:e.target.value}, ()=>{
      this.getDocumentTree();
    });
  };

  previewFile=(tree_key, document_data)=>{
    this.setState({
      selected_tree:tree_key,
      selected_document_data:document_data,
      load_excel:this.state.preview_skip == 1 ? true : false,
    }, ()=>{
      if(this.state.preview_skip == 0){
        this.getFileData();
      }
    });
  }
  
  getFileData=async()=>{
    if(this.authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      this.setState({
        select_doctor_mode:"get_file_data",
        isOpenSelectDoctor: true,
      });
      return;
    }
    let document_data = this.state.selected_document_data;
    let post_data = {
      file_path:document_data.file_path,
      document_number:document_data.number,
      use_built_in_tool:document_data.use_built_in_tool,
      patient_id:this.state.patient_id,
      patient_number:this.state.patient_info != null ? this.state.patient_info.patient_number : "",
      patient_name:this.state.patient_info != null ? this.state.patient_info.name : "",
      patient_name_kana:this.state.patient_info != null ? this.state.patient_info.kana : "",
      sex:this.state.patient_info != null ? (this.state.patient_info.sex == 1 ? '男' : '女') : "",
      age:this.state.patient_info != null ? this.state.patient_info.age : "",
      birthday:this.state.patient_info != null ? this.state.patient_info.birth_day : "",
      doctor_name:this.authInfo.staff_category === 1 ? this.authInfo.name : this.context.selectedDoctor.name,
    };
    let path = "/app/api/v2/document/get_file_data";
    await fetch(path, {
      method:'POST',
      headers: {'Authorization':axios.defaults.headers.common["Authorization"]},
      body: JSON.stringify({post_data})
    })
      .then((res) => res.arrayBuffer())
      .then((ab) => {
        let wb = XLSX.read(ab, { type: 'buffer', bookVBA: true });
        let firstSheetName = wb.SheetNames[0];
        let worksheet = wb.Sheets[firstSheetName];
        let html = XLSX.utils.sheet_to_html(worksheet);
        this.setState({
          html,
          load_excel:true,
        });
      });
  }

  getDocumentTree=async()=>{
    if(this.state.load_data_flag){
      this.setState({load_data_flag:false});
    }
    let path = "/app/api/v2/document/get_tree";
    let post_data = {
      tab_type:this.state.tab_id == 0 ? "list" : "search",
      search_type: this.state.search_type,
      department_id:this.context.department.code == 0 ? 1 : this.context.department.code,
      key_word:this.state.key_word,
      is_patient_document:this.state.patient_info == null ? 0 :1,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          tree_data:res,
          selected_tree:"",
          html:"",
          load_data_flag:true
        });
      })
      .catch(() => {

      });
  };

  confirmOk=()=>{
  };

  setCheckValue = (name, value) => {
    this.setState({
      [name]: value,
      html:name == "preview_skip" ? "" : this.state.html,
    });
  };

  handleOk=async()=>{
    if(!this.can_register || this.state.selected_tree === ""){return;}
    if(checkSMPByUnicode(this.state.free_comment)){
      addRedBorder('free_comment_id');
      this.setState({alert_messages: "印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください。"});
      return;
    }
    if(this.authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      this.setState({
        select_doctor_mode:"handle_ok",
        isOpenSelectDoctor: true,
      });
      return;
    }
    this.setState({complete_message:"処理中"});
    // window.onbeforeunload = function () {};
    window.onbeforeunload = null;
    let path = "/app/api/v2/document/edit_file_data";
    let karte_status = 1;
    if(this.state.patient_id > 0){
      if (this.context.karte_status.name === "訪問診療") {
        karte_status = 2;
      } else if(this.context.karte_status.name === "入院") {
        karte_status = 3;
      }
    }
    let cur_document_data = this.state.selected_document_data;
    let post_data = {
      file_path:cur_document_data.file_path,
      file_name:cur_document_data.name,
      favorite_flg:this.state.favorite_flg,
      document_number:cur_document_data.number,
      patient_id:this.state.patient_id,
      patient_number:this.state.patient_info != null ? this.state.patient_info.patient_number : null,
      patient_name:this.state.patient_info != null ? this.state.patient_info.name : null,
      patient_name_kana:this.state.patient_info != null ? this.state.patient_info.kana : null,
      sex:this.state.patient_info != null ? (this.state.patient_info.sex == 1 ? '男' : '女') : null,
      age:this.state.patient_info != null ? this.state.patient_info.age : null,
      birthday:this.state.patient_info != null ? this.state.patient_info.birth_day : null,
      doctor_name:this.authInfo.staff_category === 1 ? this.authInfo.name : this.context.selectedDoctor.name,
      create_document:1,
      karte_status,
      department_id:this.state.patient_id == 0 ? 0 : (this.context.department.code == 0 ? 1 : this.context.department.code),
      document_slip_id:cur_document_data.document_slip_id,
      template_id:cur_document_data.template_id,
      use_built_in_tool:cur_document_data.use_built_in_tool,
      free_comment:this.state.free_comment
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.save_flag = 1;
        if(res.file_path !== undefined){
          let document_create = {};
          document_create['slip_id'] = this.state.selected_document_data.document_slip_id;
          document_create['slip_name'] = this.state.selected_document_data.slip_name;
          document_create['doctor_code'] = this.authInfo.staff_category === 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
          document_create['doctor_name'] = this.authInfo.staff_category === 1 ? this.authInfo.name : this.context.selectedDoctor.name;
          document_create['name'] = this.state.selected_document_data.name;
          document_create['file_path'] = res.file_path;
          document_create['free_comment'] = this.state.free_comment;
          document_create['patient_id'] = this.state.patient_id;
          document_create['document_number'] = this.state.selected_document_data.number;
          document_create['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
          if(this.state.patient_id === 0){
            this.saveDocument(document_create);
          } else { // save to cache
            karteApi.setSubVal(this.state.patient_id, CACHE_LOCALNAMES.DOCUMENT_CREATE, new Date().getTime(), JSON.stringify(document_create), 'insert');
            this.context.$setExaminationOrderFlag(1);
          }
          document.location.href = this.webdav_system_path+res.file_path;
          this.props.closeModal();
        }
      })
      .catch(() => {
      });
    setTimeout(()=>{
      window.onbeforeunload = function () {
        return "Really?";
      };
    }, 200);
    // this.setState({openDocumentSaveConfirm:true});
  }
  
  saveDocument=(data)=>{
    let path = "/app/api/v2/document/save_file_info";
    data.department_id = 0;
    let cur_cache_data = data;
    cur_cache_data.karte_status= 1;
    cur_cache_data.is_seal_print = 0;
    cur_cache_data.doctor_code = this.authInfo.staff_category === 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
    cur_cache_data.doctor_name = this.authInfo.staff_category === 1 ? this.authInfo.name : this.context.selectedDoctor.name;
    apiClient
      ._post(path, {
        params: cur_cache_data
      })
      .then(() => {
      })
      .catch(() => {
      });
  }

  closeModal=()=>{
    this.setState({
      openDocumentSaveConfirm:false,
      isOpenSelectDoctor:false,
      alert_messages:"",
      confirm_message:"",
    })
  }

  setKeyWord = word => {
    word = word.toString().trim();
    this.setState({
      key_word: word
    });
  };

  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.getDocumentTree();
    }
  };

  treeOpenClose=(class_name, value)=>{
    let tree_obj_0 = document.getElementsByClassName(class_name)[0];
    let tree_obj_1 = document.getElementsByClassName(class_name)[1];
    if(tree_obj_0 !== undefined && tree_obj_0 != null && tree_obj_1 !== undefined && tree_obj_1 != null){
      if(value == 0){
        tree_obj_0.style['display'] = "none";
        tree_obj_1.style['display'] = "block";
      } else {
        tree_obj_0.style['display'] = "block";
        tree_obj_1.style['display'] = "none";
      }
    }
  }

  setFreeComment = e => {
    this.setState({free_comment: e.target.value.length > 25 ? this.state.free_comment : e.target.value});
  };

  confirmCloseModal=()=>{
    this.props.closeModal();
  }
  
  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  }
  
  selectDoctorFromModal = (id, name) => {
    let department_name = "その他";
    this.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(id, name, department_name);
    this.setState({isOpenSelectDoctor:false}, ()=>{
      if(this.state.select_doctor_mode === "get_file_data"){
        this.getFileData();
      }
      if(this.state.select_doctor_mode === "handle_ok"){
        this.handleOk();
      }
    })
  }

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal set-modal first-view-modal">
          <Modal.Header><Modal.Title>文書作成</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'header-area'}>
                <div style={{width:"30%"}}>&nbsp;</div>
                <div style={{width:"68%"}} className={'preview-box'}>プレビュー</div>
              </div>
              <div className="flex work-list">
                <div className="left-area">
                  <div className="panel-menu flex">
                    {this.state.tab_id == 0 ? (
                      <>
                        <div className="active-menu">一覧</div>
                      </>
                    ) : (
                      <>
                        <div className="menu-btn" onClick={e => {this.setTab(e, 0);}}>一覧</div>
                      </>
                    )}
                    {this.state.tab_id == 1 ? (
                      <>
                        <div className="active-menu" style={{marginLeft:"-1px"}}>検索</div>
                      </>
                    ) : (
                      <>
                        <div className="menu-btn" style={{marginLeft:"-1px"}} onClick={e => {this.setTab(e, 1);}}>検索</div>
                      </>
                    )}
                    <div className="no-menu"></div>
                  </div>
                  <div className={'tree-area'}>
                    {this.state.tab_id == 0 && (
                      <div className={'radio-area flex'}>
                        <Radiobox
                          label={'お気に入り'}
                          value={'favorite'}
                          checked={(this.state.search_type === "favorite")}
                          getUsage={this.setSearchType.bind(this)}
                          disabled={true}
                          name={`search_type`}
                        />
                        <Radiobox
                          label={'共通'}
                          value={'common'}
                          checked={(this.state.search_type === "common")}
                          getUsage={this.setSearchType.bind(this)}
                          disabled={true}
                          name={`search_type`}
                        />
                        <Radiobox
                          label={'科別'}
                          value={'department'}
                          checked={(this.state.search_type === "department")}
                          getUsage={this.setSearchType.bind(this)}
                          disabled={true}
                          name={`search_type`}
                        />
                      </div>
                    )}
                    {this.state.tab_id == 1 && (
                      <div className={'search-word'}>
                        <div className={'label-title'}>検索</div>
                        <div style={{width:"calc(100% - 4rem)"}}>
                          <SearchBar
                            search={this.setKeyWord}
                            enterPressed={this.enterPressed}
                            value={this.state.key_word}
                            id={'search_bar'}
                            onBlur={this.getDocumentTree.bind(this)}
                          />
                        </div>
                      </div>
                    )}
                    <Col id="set_tree">
                      {this.state.load_data_flag ? (
                        <>
                          {this.state.tab_id == 0 ? (
                            <nav>
                              <ul>
                                <li className={this.state.search_type+"-menu"}>
                                  <span onClick={this.treeOpenClose.bind(this, this.state.search_type+"-menu", 0)}>
                                    <Icon icon={faPlus} />{this.state.search_type == "favorite" ? "お気に入り" : (this.state.search_type == "common" ? "共通" : "科別")}
                                  </span>
                                </li>
                                <li className={this.state.search_type+"-menu"} style={{display:"none"}}>
                                  <span onClick={this.treeOpenClose.bind(this, this.state.search_type+"-menu", 1)}>
                                    <Icon icon={faMinus} />{this.state.search_type == "favorite" ? "お気に入り" : (this.state.search_type == "common" ? "共通" : "科別")}
                                  </span>
                                  <ul>
                                    {Object.keys(this.state.tree_data).length > 0 && (
                                      Object.keys(this.state.tree_data).map(slip_id=>{
                                        let slip_data = this.state.tree_data[slip_id];
                                        return (
                                          <>
                                            <li className={"slip-menu-"+slip_id}>
                                          <span onClick={this.treeOpenClose.bind(this, "slip-menu-"+slip_id, 0)}>
                                            <Icon icon={faPlus} />{slip_data['slip_name']}
                                          </span>
                                            </li>
                                            <li className={"slip-menu-"+slip_id} style={{display:"none"}}>
                                          <span onClick={this.treeOpenClose.bind(this, "slip-menu-"+slip_id, 1)}>
                                            <Icon icon={faMinus} />{slip_data['slip_name']}
                                          </span>
                                              <ul>
                                                {Object.keys(slip_data['document']).length > 0 && (
                                                  Object.keys(slip_data['document']).map(document_number=>{
                                                    let document_data = slip_data['document'][document_number];
                                                    return (
                                                      <>
                                                        <li className={"document-menu-"+document_number}>
                                                          <span
                                                            className={this.state.selected_tree == document_number ? " selected" : ""}
                                                            onClick={this.previewFile.bind(this, document_number, document_data)}
                                                          >{document_data['name']}</span>
                                                        </li>
                                                      </>
                                                    )
                                                  })
                                                )}
                                              </ul>
                                            </li>
                                          </>
                                        )
                                      })
                                    )}
                                  </ul>
                                </li>
                              </ul>
                            </nav>
                          ):(
                            <nav>
                              <ul>
                                <li className={"favorite-menu"}>
                                  <span onClick={this.treeOpenClose.bind(this, 'favorite-menu', 0)}><Icon icon={faPlus} />お気に入り</span>
                                </li>
                                <li className={"favorite-menu"} style={{display:"none"}}>
                                  <span onClick={this.treeOpenClose.bind(this, 'favorite-menu', 1)}><Icon icon={faMinus} />お気に入り</span>
                                  <ul>
                                    {this.state.tree_data.favorite != undefined && Object.keys(this.state.tree_data.favorite).length > 0 && (
                                      Object.keys(this.state.tree_data.favorite).map(slip_id=>{
                                        let slip_data = this.state.tree_data.favorite[slip_id];
                                        return (
                                          <>
                                            <li className={"favorite-slip-menu-"+slip_id}>
                                              <span onClick={this.treeOpenClose.bind(this, "favorite-slip-menu-"+slip_id, 0)}>
                                                <Icon icon={faPlus} />{slip_data['slip_name']}
                                              </span>
                                            </li>
                                            <li className={"favorite-slip-menu-"+slip_id} style={{display:"none"}}>
                                              <span onClick={this.treeOpenClose.bind(this, "favorite-slip-menu-"+slip_id, 1)}>
                                                <Icon icon={faMinus} />{slip_data['slip_name']}
                                              </span>
                                              <ul>
                                                {Object.keys(slip_data['document']).length > 0 && (
                                                  Object.keys(slip_data['document']).map(document_number=>{
                                                    let document_data = slip_data['document'][document_number];
                                                    return (
                                                      <>
                                                        <li className={"document-menu-"+document_number}>
                                                          <span
                                                            className={this.state.selected_tree == ("favorite-"+document_number) ? " selected" : ""}
                                                            onClick={this.previewFile.bind(this, "favorite-"+document_number, document_data)}
                                                          >{document_data['name']}</span>
                                                        </li>
                                                      </>
                                                    )
                                                  })
                                                )}
                                              </ul>
                                            </li>
                                          </>
                                        )
                                      })
                                    )}
                                  </ul>
                                </li>
                                <li className={"common-menu"}>
                                  <span onClick={this.treeOpenClose.bind(this, 'common-menu', 0)}><Icon icon={faPlus} />共通</span>
                                </li>
                                <li className={"common-menu"} style={{display:"none"}}>
                                  <span onClick={this.treeOpenClose.bind(this, 'common-menu', 1)}><Icon icon={faMinus} />共通</span>
                                  <ul>
                                    {this.state.tree_data.common != undefined && Object.keys(this.state.tree_data.common).length > 0 && (
                                      Object.keys(this.state.tree_data.common).map(slip_id=>{
                                        let slip_data = this.state.tree_data.common[slip_id];
                                        return (
                                          <>
                                            <li className={"common-slip-menu-"+slip_id}>
                                              <span onClick={this.treeOpenClose.bind(this, "common-slip-menu-"+slip_id, 0)}>
                                                <Icon icon={faPlus} />{slip_data['slip_name']}
                                              </span>
                                            </li>
                                            <li className={"common-slip-menu-"+slip_id} style={{display:"none"}}>
                                              <span onClick={this.treeOpenClose.bind(this, "common-slip-menu-"+slip_id, 1)}>
                                                <Icon icon={faMinus} />{slip_data['slip_name']}
                                              </span>
                                              <ul>
                                                {Object.keys(slip_data['document']).length > 0 && (
                                                  Object.keys(slip_data['document']).map(document_number=>{
                                                    let document_data = slip_data['document'][document_number];
                                                    return (
                                                      <>
                                                        <li className={"document-menu-"+document_number}>
                                                          <span
                                                            className={this.state.selected_tree == ("common-"+document_number) ? " selected" : ""}
                                                            onClick={this.previewFile.bind(this, "common-"+document_number, document_data)}
                                                          >{document_data['name']}</span>
                                                        </li>
                                                      </>
                                                    )
                                                  })
                                                )}
                                              </ul>
                                            </li>
                                          </>
                                        )
                                      })
                                    )}
                                  </ul>
                                </li>
                                <li className={"department-menu"}>
                                  <span onClick={this.treeOpenClose.bind(this, 'department-menu', 0)}><Icon icon={faPlus} />科別</span>
                                </li>
                                <li className={"department-menu"} style={{display:"none"}}>
                                  <span onClick={this.treeOpenClose.bind(this, 'department-menu', 1)}><Icon icon={faMinus} />科別</span>
                                  <ul>
                                    {this.state.tree_data.department != undefined && Object.keys(this.state.tree_data.department).length > 0 && (
                                      Object.keys(this.state.tree_data.department).map(slip_id=>{
                                        let slip_data = this.state.tree_data.department[slip_id];
                                        return (
                                          <>
                                            <li className={"department-slip-menu-"+slip_id}>
                                              <span onClick={this.treeOpenClose.bind(this, "department-slip-menu-"+slip_id, 0)}>
                                                <Icon icon={faPlus} />{slip_data['slip_name']}
                                              </span>
                                            </li>
                                            <li className={"department-slip-menu-"+slip_id} style={{display:"none"}}>
                                              <span onClick={this.treeOpenClose.bind(this, "department-slip-menu-"+slip_id, 1)}>
                                                <Icon icon={faMinus} />{slip_data['slip_name']}
                                              </span>
                                              <ul>
                                                {Object.keys(slip_data['document']).length > 0 && (
                                                  Object.keys(slip_data['document']).map(document_number=>{
                                                    let document_data = slip_data['document'][document_number];
                                                    return (
                                                      <>
                                                        <li className={"document-menu-"+document_number}>
                                                          <span
                                                            className={this.state.selected_tree == ("department-"+document_number) ? " selected" : ""}
                                                            onClick={this.previewFile.bind(this, "department-"+document_number, document_data)}
                                                          >{document_data['name']}</span>
                                                        </li>
                                                      </>
                                                    )
                                                  })
                                                )}
                                              </ul>
                                            </li>
                                          </>
                                        )
                                      })
                                    )}
                                  </ul>
                                </li>
                              </ul>
                            </nav>
                          )}
                        </>
                      ):(
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      )}
                    </Col>
                  </div>
                </div>
                <div className="right-area">
                  {this.state.load_excel ? (
                    <div
                      style={{width:"100%", height:"100%"}}
                      className="App"
                      dangerouslySetInnerHTML={{ __html: this.state.html }}
                    />
                  ):(
                    <div style={{width:"100%", height:"100%"}}>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </div>
                  )}
                </div>
              </div>
              <div className={'flex bottom-area'}>
                <div className="left-area">
                  <div className={'check-area'}>
                    <Checkbox
                      label="お気に入り"
                      getRadio={this.setCheckValue.bind(this)}
                      value={this.state.favorite_flg === 1}
                      name="favorite_flg"
                    />
                  </div>
                  <div className={'check-area'}>
                    <Checkbox
                      label="プレビューをスキップ"
                      getRadio={this.setCheckValue.bind(this)}
                      value={this.state.preview_skip === 1}
                      name="preview_skip"
                    />
                  </div>
                </div>
                <div className="right-area">
                  <InputWithLabelBorder
                    label="フリーコメント"
                    type="text"
                    id={'free_comment_id'}
                    getInputText={this.setFreeComment.bind(this)}
                    diseaseEditData={this.state.free_comment}
                  />
                  <div style={{marginLeft:"8rem", lineHeight:"2rem"}}>（25文字まで）</div>
                </div>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className={'cancel-btn'} onClick={this.confirmCloseModal}>キャンセル</Button>
            <Button
              tooltip={this.can_register ? '' : '権限がありません。'}
              className={(!this.can_register || this.state.selected_tree === "") ? 'disable-btn' : "red-btn"}
              onClick={this.handleOk}
            >確定</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
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
          {this.state.openDocumentSaveConfirm && (
            <DocumentSaveConfirm
              closeModal={this.closeModal}
            />
          )}
          {this.state.isOpenSelectDoctor && (
            <SelectDoctorModal
              closeDoctor={this.closeModal}
              getDoctor={this.getDoctor}
              selectDoctorFromModal={this.selectDoctorFromModal}
              doctors={this.doctors}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
        </Modal>
      </>
    );
  }
}

DocumentCreate.contextType = Context;
DocumentCreate.propTypes = {
  closeModal: PropTypes.func,
};

export default DocumentCreate;
