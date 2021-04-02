import React, {Component} from "react";
import styled from "styled-components";
import * as colors from "../../_nano/colors";
import {disable, error, secondary, surface} from "../../_nano/colors";
import Button from "../../atoms/Button";
import PropTypes from "prop-types";
import {SOAP_TREE_CATEGORY, TREE_FLAG, EXAM_CATEGORY} from "~/helpers/constants";
import * as apiClient from "~/api/apiClient";
import Context from "~/helpers/configureStore";
import RegisterSelfExamResultModal from "./RegisterSelfExamResultModal";
import InputWithLabel from "../../molecules/InputWithLabel";
import InputKeyWord from "~/components/molecules/InputKeyWord";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Radiobox from "~/components/molecules/Radiobox";
import axios from "axios";
import {formatJapanDate, formatDateLine} from "../../../helpers/date";
import InspectionResultModal from "../../organisms/InspectionResultModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Spinner from "react-bootstrap/Spinner";
import DatePicker, { registerLocale } from "react-datepicker";
import * as karteApi from "~/helpers/cacheKarte-utils";
import ja from "date-fns/locale/ja";
import auth from "~/api/auth";
import * as localApi from "~/helpers/cacheLocal-utils";
import {setDateColorClassName} from "~/helpers/dialConstants";
registerLocale("ja", ja);

const SpinnerWrapper = styled.div`
height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const PatientsWrapper = styled.div`
  width: 100%;
  margin: auto;
  font-size:1rem;
  .title-area {
    margin-left: 10px;
    padding-top: 10px;
    align-items: center;
    button {
      background-color: ${colors.surface};
      min-width: auto;
      margin-left: 9px;
      padding: 8px 12px;
    }
    .tab-btn{
      background: rgb(208, 208, 208);
      span{
        font-weight: normal;
        color: black;
      }
    }
    .button{
      span{
        word-break: keep-all;
      }
    }
    .disabled{
      background: rgb(208, 208, 208);
      span{
        font-weight: normal;
        color: grey !important;
      }
    }
    .move-btn-area {
      margin-right:0;
      margin-left:auto;
      padding-top:0.5rem;
    }
  }
  .title {
    font-size: 1.875rem;
    padding-left: 0.5rem;
    border-left: solid 5px #69c8e1;
  }
  .button-area{
		span{
			font-size:1rem;
		}
		button {
			background: white;
		}
  }
`;

const Flex = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: center;
  padding: 10px 0px 10px 10px;
  width: 100%;
  z-index: 100;
.label-title {
    text-align: right;
    width: auto;
    margin: 0 0.5rem 0 1.5rem;
    font-size: 1rem;
  }
  select {
    width: 7.5rem;
    font-size:1rem;
  }
  button {
    min-width: auto;
    margin-left: 0.5rem;
  }

  span {
    font-size: 1rem;
  }

  .search-type{
    label {
      font-size: 1rem;
    }
    button{
      padding: 0.25rem;
      height:2rem;
    }
    input{
        height:2rem;
    }
  }
  .check-area{
    label {
      margin-right: 5px;
    }
  }
  .patient-area{
    padding-right: 0.5rem;
    padding-bottom:0.5rem;
    border: solid 1px rgb(126, 126, 126);
    .patient-id-search-input{
        margin-top:0.5rem;
        flex-direction:row;
        div{
            display:inline-block;
            div{
                width: 4.5rem;
                margin-top: 0.7rem;
                text-align: right;
                margin-right: 0.5rem;
            }
            
        }
        input{
            width: 10rem;
        }
    }
    div{
        font-size:0.875rem;
    }
    .label-title{
        font-size: 0.875rem;
        width: 5rem;
        margin: 0;
        padding-right: 0.5rem;
        text-align: right;
        line-height: 2rem;
    }
    input{
        width: 10rem;
        height: 2rem;
    }
    .age {
        input{
            width:4rem;
        }
        label{
            line-height: 2rem;
            width: 3rem;
        }
    }
    .birthday{
        input{width:10rem;}
    }
  }
  .select-box{
      .pullbox-title, .label-title{
        margin-left:0rem;
        width:  4.5rem;
        text-align: right;
        margin-right:0.5rem;
        height:2rem;
        line-height:2rem;
       }
       .pullbox-select{
        width:8rem;
        height:2rem;
        line-height:2rem;
      }
  }
  .date-select {
		margin-bottom: 0.5rem;
      .label-title {
          margin-left:0rem;
					width:  4.5rem;
					text-align: right;
					margin-right:0.5rem;
					height:2rem;
					line-height:2rem;
      }
			input {
				width: 12rem;
				height: 2rem;
				background: white;
				font-size: 1rem;
			}
			.react-datepicker-wrapper{
				height: 2rem;
			}
  }
  .radio-area label{
    margin-right:0.5rem;
    font-size:1rem;
  }
`;

const PrescriptionWrapper = styled.div`
  width: 100%;
  padding-top: 10px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  .examination-content{
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    width: calc(100% - 420px);
  }
  .note-red{
    color: ${error};
  }

  .exam-order{
    margin-left: 4.75rem;
  }

  nav {
    padding: 4px 0;
    ul {
      padding-left: 0;
      margin-bottom: 0.5rem;
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

      .sel_open {
        background: #ddd;
      }
      ul {
        margin-left: 10px;
        position: relative;
        margin-bottom: 0px;

        li {
          padding: 0px 0.75rem;

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
              padding: 0px 0.75rem;

              ul {
                margin-bottom: 0px;

                li {
                  padding: 0px 0.75rem;
                }
              }
            }
          }
        }
      }
      li {
        margin: 0;
        padding: 3px 0.75rem;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 0.75rem;
        line-height: 1.25rem;
        position: relative;
      }
    }

    li {
      cursor: pointer;
      list-style-type: none;
    }
  }

  .mark {
    color: ${surface};
    font-size: 0.75rem;
    display: inline-block;
    padding: 2px;
    line-height: 1;
    &.red {
      background-color: ${error};
    }
    &.blue {
      background-color: ${secondary};
    }
  }

  .data-item {
    padding: 4px 2rem 4px 0.5rem;
    position: relative;
    cursor: pointer;

    &.open {
      .angle {
        transform: rotate(180deg);
      }
    }

    &.changed {
      background: #eee;
    }

    &.updating {
      background: #ccc;
    }
  }

  p {
    margin: 0;
  }

  .flex {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .entry-name {
    display: inline-block;
    width: 35%;
  }

  .soap-data,
  .soap-data-item {
    width: 100%;

    tr {
      flex-wrap: nowrap;
    }

    th,
    td {
      border: 1px solid ${disable};
      padding: 2px;
    }

    th {
      background: #f6fcfd;
      text-align: center;
      width: 3rem;
    }

    td {
      flex: 1;
    }

    input {
      width: 100%;
    }
  }

  .style-hide{
    display: none;
  }
  
  .detail-deleted {
      color: #ff0000;
      textarea {
        color: #ff0000;
      }
  }
  
  .soap-data-item {
    display: none;
    &.open {
      display: inline-table;
    }

    textarea {
      border: 0px;
      resize: none;
    }

    &.changed {
      background: #eee;
      textarea {
        background: #eee;
      }
    }
    &.deleted {
      color: #ff0000;

      textarea {
        color: #ff0000;
      }
    }
  }

  .data-input{
    display: none;
    &.open{
      display: block;
    }
  }

  .not-consented {
    color: ${error};
  }

  .btn {
    background-color: ${secondary};
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    color: ${surface};
    display: block;
    font-size: 1rem;
    text-align: center;
    margin-left: auto;
    padding: 2px 4px;
    line-height: 1;
  }
  .table-area {
    width: 100%;
    margin: auto;
    margin-left: 1rem;
    font-size: 0.875rem;
    font-family: "Noto Sans JP", sans-serif;
    table {
        margin-bottom:0;
        font-size:1rem;
        thead{
          display: table;
          width:calc(100% - 17px);
        }
        tbody{
          height: 67vh;
          overflow-y:scroll;
          display:block;
          background: white;
        }
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        tr{
          display: table;
          width: 100%;
          box-sizing: border-box;
            height: 2rem;
        }
        td {
            font-size:1rem;
            padding: 0.25rem;
            text-align: left;
            cursor: pointer;
            word-break: break-all;
        }
        th {
            font-size:1rem;
            text-align: center;
            padding: 0.3rem;
            background:#e2caff;
        }
        .td-id{
            width:6rem;
        }
        .td-name{
            width:11rem;
        }
        .td-day{
            width:10rem;
        }
        .td-time{
            width:5rem;
        }
        .td-datetime{
            width:11rem;
        }
        .td-status{
            width:6rem;
        }
      }
  }
    .no-result {
      padding: 12.5rem;
      text-align: center;

      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
`;

class SelfInspectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      examining: false,
      inspections: [
        {name:'院内検査', value:EXAM_CATEGORY.CONDITION_IN},
        {name:'院外検査', value:EXAM_CATEGORY.CONDITION_OUT},
        {name:'診療科', value:3},
        {name:'病棟', value:4},
        {name:'検査状態', value:5},
      ],
      inspection_check: [EXAM_CATEGORY.CONDITION_IN, EXAM_CATEGORY.CONDITION_OUT,3,4,5],
      isRegisterModal: false,
      table_list:null,
      isLoadData: false,
      modalFlag:false,
      display_department_id:"",
      search_type:"",
      ward_master:[{id:0, value:""}],
      first_ward_id: '',
      alert_messages: '',
      search_date: new Date()
    };
    this.select_category=[];
    this.karte_status=[{ id: 0, value: ""},{ id: 1, value: "外来"},{ id: 2, value: "入院"}];
    this.radio_array={0:"全て",1:"検査",2:"一時検査"};
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let department_codes = [{id:0, value:"全て"}];
    let diagnosis = {};
    departmentOptions.map(department=>{
      department_codes.push(department);
      diagnosis[parseInt(department.id)] = department.value;
    });
    this.departmentOptions = departmentOptions;
    this.department_codes = department_codes;
  }
  
  async componentDidMount() {
    this.context.$updateStopGetHistory(false);
    this.context.$updatePageNumber(0);
    await this.getMaster();
    this.setState({
      status_type: 1,
      isLoaded: false,
      bOpenAllExamination: false,
      bOpenAllExaminationLatest: true,
      categoryType: -1,
      curScrollTop: 0,
      selYear:-1,
      selMonth:-1,
      selDay:-1,
      openStatus:{
        iExamination: 1,
        eExamination: 1,
      },
      patient_id: "",
      birthday: "",
      age: "",
      patient_name: "",
      patient_name_kana: "",
    });
    this.getInspectionList();
    this.setState({activeOperation: 'examination'});
    auth.refreshAuth(location.pathname+location.hash);
  }
  
  getMaster = async()=> {
    let path = "/app/api/v2/ward/get/bed_control/master_data";
    await apiClient.post(path, {params: {}})
      .then(res => {
        let ward_master = this.state.ward_master;
        if(res.ward_master.length > 0){
          res.ward_master.map(ward=>{
            ward_master.push({id:ward.number, value:ward.name});
          });
        }
        this.setState({
          ward_master,
        })
      })
  }
  
  setOpenClose = (nType, i) => {
    var setVal = false;
    if(i == TREE_FLAG.OPEN_TREE){
      setVal = true;
    }
    switch(nType){
      case SOAP_TREE_CATEGORY.ALL_EXAMINATION:
        this.setState({
          bOpenAllExamination:setVal,
        });
        break;
      case SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST:
        this.setState({
          bOpenAllExaminationLatest:setVal
        });
        break;
    }
  };
  
  setCurScrollTop = (nVal) => {
    this.setState({
      curScrollTop: nVal
    });
  };
  
  searchList = async (params) => {
    params = {category: this.state.inspection_check, keyword: this.state.patient_id};
    await apiClient.post("/app/api/v2/karte/tree/searchInspectionResult", {
      params,
    }).then((res) => {
      res.all_examination.latest = this.getLatestDataByCategory(res.all_examination.latest, res.all_dates);
      res.all_examination.data = this.getDataByCategory(res.all_examination.data, res.all_dates);
      let patient = res.patient;
      
      let latest = res.all_examination.latest[Object.keys(res.all_examination.latest)[0]];
      let nYear = -1;
      let nMonth = -1;
      let nDay = -1;
      let showDelete = false;
      let noData = true;
      var soapList = [];
      if (this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.SHOW_DELETE)) {
        showDelete = true;
      }
      if (latest != undefined) {
        noData = false;
        var soap_latest = res.all_examination.latest;
        Object.keys(soap_latest).map(date_data=>{
          soap_latest[date_data].data.map((soap) => {
            soap["openTag"] = 1;
            soap.class_name = "open";
            if (!showDelete) {
              if (soap.is_enabled == 1) {
                soapList.push(soap);
              }
            } else {
              soapList.push(soap);
            }
          });
        });
      }
      this.setState({
        soapList: noData ? [] : soapList,
        allDateList: res.all_dates,
        allTags:res.all_tags,
        soapTrees: {
          all_examination: res.all_examination.data,
          all_examination_latest: res.all_examination.latest,
        },
        selYear: nYear,
        selMonth: nMonth,
        selDay: nDay,
        bOpenAllExamination: true,
        bOpenAllExaminationLatest: true,
        isLoaded: true,
        patient_name: patient !== undefined ?patient.patient_name: "",
        birthday: patient !== undefined ?patient.birthday: "",
        patient_name_kana: patient !== undefined ?patient.patient_name_kana: "",
        gender: patient !== undefined ?(patient.gender === 1 ? "男": patient.gender === 2 ? "女" : ""): "",
        age: patient !== undefined ?patient.age: "",
        patient,
      });
      return res;
    });
  };
  
  getDataByNumbers = (source, date, numbers = []) => {
    let result = [];
    if (numbers.length > 0) {
      Object.keys(source[date]).map(item=>{
        source[date][item].map(ele=>{
          if (numbers.includes(ele.number)) {
            result.push(ele);
          }
        });
      });
    }
    return result;
  };
  
  getLatestDataByCategory = (source, all_dates) => {
    Object.keys(source).map((item)=>{
      source[item]["data"] = this.getDataByNumbers(all_dates, item, source[item].numbers);
    });
    return source;
  };
  
  getDataByCategory = (source, all_dates) => {
    Object.keys(source).map((item)=>{
      source[item].data.map(ele=>{
        ele.data.map(element=>{
          element.data = this.getDataByNumbers(all_dates, element.date, element.numbers);
        })
      });
    });
    return source;
  };
  
  getCheck = (name, number) => {
    if (name == 'inspections') {
      var check_status = this.state.inspection_check;
      var find_idx = check_status.indexOf(number);
      if (find_idx == -1) check_status.push(number);
      else check_status.splice(find_idx, 1);
      this.setState({inspection_check:check_status});
    }
  };
  allSelect = () => {
    let check_status = [];
    this.state.inspections.map(item=>{
      check_status.push(item.value);
    });
    this.setState({inspection_check:check_status});
  };
  allDeSelect = () => {
    this.setState({inspection_check:[]});
  };
  
  registerModal = () =>{
    if (this.state.patient === undefined || this.state.patient === null || this.state.patient.number === undefined || this.state.patient.number == null){
      this.setState({alert_messages:"患者様を選択してください。"});
      return;
    }
    this.setState({isRegisterModal:true, modal_data:undefined});
  };
  closeModal = () =>{
    this.setState({
      isRegisterModal:false,
      modalFlag:false
    });
  };
  
  getValue = (e) => {
    this.setState({patient_id:e.target.value});
  };
  
  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.getInspectionList();
    }
  };
  
  handleOk = () =>{
    this.closeModal();
    this.getInspectionList();
  };
  getKarteStatus = e => {
    this.setState({
      karte_status_code:e.target.id,
      karte_status_name: e.target.value
    });
  };
  setSearchType = (e) => {
    this.setState({search_type:e.target.value});
  };
  
  getInspectionList = async () => {
    try{
      const { data } = await axios.get(
        `/app/api/v2/karte/inspection/results`,{
          params: {
            keyword:this.state.patient_id,
            hospitalized_flag:this.state.karte_status_code,
            department:this.state.display_department_id,
            search_type:this.state.search_type,
            search_date: formatDateLine(this.state.search_date)
          }
        }
      );
      if (data) {
        this.setState({
          table_list: data.data,
          patient:data.patient,
          patient_name: data.patient !== undefined && data.patient != null ?data.patient.patient_name: "",
          birthday: data.patient !== undefined  && data.patient != null ?data.patient.birthday: "",
          patient_name_kana: data.patient !== undefined  && data.patient != null ?data.patient.patient_name_kana: "",
          gender: data.patient !== undefined  && data.patient != null ?(data.patient.gender === 1 ? "男": data.patient.gender === 2 ? "女" : ""): "",
          age: data.patient !== undefined  && data.patient != null ?data.patient.age: "",
        });
        this.setState({isLoadData: true});
      } else {
        this.setState({table_list: []});
        this.setState({isLoadData: true});
      }
    }catch(e){
      this.setState({table_list: []});
      this.setState({isLoadData: true});
    }
  };
  onAngleClicked(e, number) {
    if (e.type == 'click') {
      let history = this.state.table_list[number];
      this.setState({
        modalContents : history,
        modalFlag: true
      });
    }
  }
  
  getDeparmentName (id) {
    let deparment = this.departmentOptions.find(x=>x.id==id);
    return deparment !== undefined && deparment != null ? deparment.value : "";
  }
  getDepartment = e => {
    this.setState({
      display_department_id:e.target.id,
      department_name: e.target.value
    })
  };
  setWard=(e)=>{
    this.setState({first_ward_id:e.target.id});
  };
  closeSystemAlertModal () {
    this.setState({
      alert_messages: '',
    }, ()=>{
      document.getElementById('patient-search-id').focus();
    });
  }
  
  getDate = value => {
    this.setState({
      search_date: value,
    });
  };
  gotoSoap = () => {
    let patient_info = karteApi.getLatestVisitPatientInfo();
    if (patient_info == undefined || patient_info == null) {
      let current_system_patient_id = localApi.getValue("current_system_patient_id");
      current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
      if (current_system_patient_id > 0) {
        this.props.history.replace(`/patients/${current_system_patient_id}/soap`);
      }
    } else {
      this.props.history.replace(`/patients/${patient_info.patient_id}/soap`);
    }
  }
  
  openResultEditModal = (item, e) => {
    if (item.is_temporary == 0) return;
    e.stopPropagation();
    e.preventDefault();
    if (item == undefined) return;
    this.setState({
      isRegisterModal:true,
      patient: item.patient,
      modal_data: item
    });
  }
  render() {
    let {table_list} = this.state;
    const ExampleCustomInput = ({ onClick }) => (
      <Button type="common" className="cur-date example-custom-input" onClick={onClick}>日付選択</Button>
    );
    return (
      <>
        <PatientsWrapper>
          <div className="title-area flex">
            <div className={'title'}>自科検査一覧</div>
            {karteApi.getEditPatientList() != undefined && karteApi.getEditPatientList() != null && karteApi.getEditPatientList().length > 0 && (
              <>
                <div className={'move-btn-area'}>
                  <Button className="tab-btn button close-back-btn" onClick={this.gotoSoap}>閉じる</Button>
                </div>
              </>
            )}
          </div>
          <Flex>
            <div className="w-50">
              <div className="date-select d-flex">
                <div className='remove-x-input' style={{marginTop:"-8px"}}>
                  <InputWithLabel
                    label="検査日"
                    type="text"
                    diseaseEditData={formatJapanDate(this.state.search_date)}
                    readonly
                    isDisabled = {true}
                  />
                </div>
                <DatePicker
                  locale="ja"
                  selected={this.state.search_date}
                  onChange={this.getDate.bind(this)}
                  dateFormat="yyyy/MM/dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dayClassName = {date => setDateColorClassName(date)}
                  customInput={<ExampleCustomInput />}
                />
              </div>
              <div className="select-box d-flex">
                <SelectorWithLabel
                  title="入外区分"
                  options={this.karte_status}
                  getSelect={this.getKarteStatus}
                  value={this.state.karte_status_name}
                  departmentEditCode={this.state.karte_status_code}
                />
                <SelectorWithLabel
                  title="診療科"
                  options={this.department_codes}
                  getSelect={this.getDepartment}
                  value={this.state.department_name}
                  departmentEditCode={this.state.display_department_id}
                />
                <SelectorWithLabel
                  title="病棟"
                  options={this.state.ward_master}
                  getSelect={this.setWard}
                  departmentEditCode={this.state.first_ward_id}
                />
              </div>
              <div className={`d-flex radio-area ml-2 mt-2`}>
                {Object.keys(this.radio_array).map((index)=>{
                  return (
                    <>
                      <Radiobox
                        label={this.radio_array[index]}
                        value={index}
                        getUsage={this.setSearchType.bind(this)}
                        checked={this.state.search_type == index ? true : false}
                        name={`search-type`}
                      />
                    </>
                  );
                })}
              </div>
            </div>
            <div className="w-50">
              <div className="patient-area">
                <div className="d-flex">
                  <div className='patient-id-search-input'>
                    <InputKeyWord
                      type="text"
                      label="患者ID"
                      onChange={this.getValue.bind(this)}
                      onKeyPressed={this.enterPressed}
                      onBlur = {this.getInspectionList.bind(this)}
                      value={this.state.patient_id}
                      id='patient-search-id'
                    />
                  </div>
                  <div className="birthday">
                    <InputWithLabel
                      label="生年月日"
                      type="text"
                      diseaseEditData={this.state.birthday}
                      readonly
                      isDisabled = {true}
                    />
                  </div>
                  <div className="age">
                    <InputWithLabel
                      label="年齢"
                      type="text"
                      diseaseEditData={this.state.age}
                      readonly
                      isDisabled = {true}
                    />
                  </div>
                </div>
                <div className="d-flex">
                  <InputWithLabel
                    label="患者氏名"
                    type="text"
                    diseaseEditData={this.state.patient_name}
                    readonly
                    isDisabled = {true}
                  />
                  <InputWithLabel
                    label="カナ氏名"
                    type="text"
                    diseaseEditData={this.state.patient_name_kana}
                    readonly
                    isDisabled = {true}
                  />
                </div>
              </div>
            </div>
          </Flex>
          <div className="d-flex w-100 button-area">
            <div className="w-50 ml-3"><Button type="mono" onClick={this.getInspectionList}>最新表示</Button></div>
            <div className="w-50 text-right"><Button type="mono" onClick={this.registerModal}>新規結果入力</Button></div>
          </div>
        
        </PatientsWrapper>
        <PrescriptionWrapper>
          {this.state.isLoadData ? (
            <Wrapper>
              <div className={'table-area'}>
                <table className="table-scroll table table-bordered" id="code-table">
                  <thead>
                  <tr>
                    <th className={'td-id'}>患者ID</th>
                    <th className={'td-name'}>患者氏名</th>
                    <th className={'td-day'}>採取日</th>
                    <th className={'td-time'}>採取時間</th>
                    <th className={'td-status'}>検査状態</th>
                    <th className={'td-datetime'}>更新日</th>
                    <th className={'td-datetime'}>受診時間</th>
                    <th className={''}>検査項目</th>
                  </tr>
                  </thead>
                  <tbody>
                  {table_list != null && table_list.length > 0 ? table_list.map((item,index)=>{
                    return(
                      <tr key={index} onClick={e => this.onAngleClicked(e, index)}>
                        <td className='td-id'>
                          {item.patient !== undefined ? item.patient.patient_number : ""}
                        </td>
                        <td className={'td-name'}>
                          {item.patient !== undefined ? item.patient.patient_name : ""}
                        </td>
                        <td className='td-day'>{formatJapanDate(item.collected_date)}</td>
                        <td className={'td-time'}> {item.collected_time}</td>
                        <td className={'td-status'} onClick={this.openResultEditModal.bind(this, item)}>{item.is_temporary == 1 ? "一時保存" : "検査済保存"}</td>
                        <td className={'td-datetime'}>{formatJapanDate(item.updated_at.split("-").join("/"))}</td>
                        <td className={'td-datetime'}></td>
                        <td className={''}>
                          {item.results != undefined && item.results.length > 0 && item.results.map((sub_item, sub_index) => {
                            return (
                              <span key={sub_index}>
                                                        {sub_item.label != undefined && sub_item.label != '' ? sub_item.label : ''}
                                {sub_index != (item.results.length - 1) ? "、":""}
                                                        </span>
                            )
                          })}
                        </td>
                      </tr>
                    )
                  }):(
                    <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>
                  )}
                  </tbody>
                </table>
              </div>
            </Wrapper>
          ):(
            <SpinnerWrapper>
              <Spinner animation="border" variant="secondary" />
            </SpinnerWrapper>
          )}
          
          {this.state.isRegisterModal && this.state.patient !== undefined && (
            <RegisterSelfExamResultModal
              closeModal={this.closeModal}
              patient={this.state.patient}
              handleOk={this.handleOk}
              modal_data={this.state.modal_data}
            />
          )}
          {this.state.modalFlag === true && (
            <InspectionResultModal
              closeModal = {this.closeModal.bind(this)}
              inspectionList = {this.state.modalContents}
              patientId={this.state.modalContents.patient.system_patient_id}
              patient_name_kana={this.state.modalContents.patient.patient_name_kana}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeSystemAlertModal.bind(this)}
              handleOk= {this.closeSystemAlertModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </PrescriptionWrapper>
      </>
    );
  }
}

SelfInspectionList.contextType = Context;
SelfInspectionList.propTypes = {
  patientInfo: PropTypes.object.isRequired,
  patientId: PropTypes.number.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.node
    }).isRequired
  }).isRequired,
  history: PropTypes.object
};
export default SelfInspectionList;
