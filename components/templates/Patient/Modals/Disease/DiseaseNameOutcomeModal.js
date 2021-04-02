import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "~/components/_nano/colors";
import { Modal } from "react-bootstrap";
import Context from "~/helpers/configureStore";
import axios from "axios";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import InputWithErrorLabel from "~/components/molecules/InputWithErrorLabel";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import Spinner from "react-bootstrap/Spinner";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import { EXITUS_REASON, KARTEMODE } from "~/helpers/constants";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Radiobox from "~/components/molecules/Radiobox";
import {formatDateLine} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";

const Karte_status_type = [
  {
    id: 0,
    value: "入外"
  },
  {
    id: 1,
    value: "外来"
  },
  {
    id: 2,
    value: "入院"
  }
];

const Popup = styled.div`
  height: 100%;
  .flex {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .group-out-btn{     
     margin-top:8px;
     margin-left: 10px;
     font-size: 1rem;
     span{
      font-size: 1rem;
     }
  }

  h2 {
    color: ${colors.onSurface};
    font-size: 17px;
    font-weight: 500;
    margin: 6px 0;
  }
  .insert-button {
    display: flex;
    button{
      margin-top: 8px;
      margin-left: 10px;
      padding: 4px 8px !important;  
      span{
        font-size: 16px;
      }
    }
  }
  .disease-header{
    overflow: hidden;    
    .radio-area:nth-child(odd){      
      float: left;
    }
    .radio-area{
        width: auto;
        min-width: 240px;
        margin-right: 10px;
        margin-top: 5px;
        border:1px solid darkgray;
        padding: 5px;    
        legend{
        font-size: 16px;
        width: auto;
        margin-bottom: 0;
        padding-left: 10px;
        margin-left: 10px;
        padding-right: 10px;
        }
        margin-bottom:10px;
        .radio-groups{
            label{
                margin-right:20px;
                margin-bottom:5px;
                font-size:14px;
            }
        }
    }
    .radio-area-second {
        width: 240px;
    }
  }

  .disease-list{
    // height: calc(100% - 120px);
    margin-bottom: 5px !important;
    .list-content{
      // overflow-y: auto;
      width: 100%;
      height: calc( 100vh - 250px);
      margin-top: 5px;
      border: none;
      .disease-list-table{
        margin-bottom:0px;
        font-size:1rem;
        thead{
          display:table;
          width:100%;
        }
        tbody{
          display:block;
          overflow-y: auto;
          height: calc( 100vh - 285px);
          width:100%;
        }
        tr{
          display: table;
          width: 100%;
        }      
        td {
          word-break: break-all;
          padding: 0.25rem;
        }
        th {
            position: sticky;
            text-align: center;
            padding: 0.3rem;
        }
        .kind{
          width:3.5rem;
        }
        .department{
          width:4.5rem;
        }
        .name{
          width:34rem;
        }
        .start_date{
          width:8rem;
        }
        .end_date{
          width:15rem;
        }
        .end_date_1{
          width:7rem;
        }
        .end_date_2{
          width:8rem;
        }
        .one-letter{
          width:2rem;
        }
        .doctor-name{
          width:15rem;        
        }
        .insurance{
          width:3rem;
        }
        // .agree{
        //   width:6rem;
        // }
      }
    }
  }

  .disease-search-label{
    font-size: 15px;
    margin-left: 10px;
    margin-bottom: 5px !important;
    margin-top: 10px !important;
  }

  .edit_tr{
    background: #ddd;
  }

  .disease-search-bound{
    display: block !important;
    border: 1px solid #ddd !important;    
    .disease-name-div{
      margin-top: 10px !important;
      margin-bottom: 5px !important;
    }
    .disease-input-div{
      margin: auto 10px !important;
      margin-bottom: 20px !important;
    }
  }

  .checkbox-div{
    margin-bottom: 22px !important;
  }
  .disease-name-search{
    margin-bottom: 6px !important;
    position: absolute !important;
    margin-top: -17px !important;
    margin-left: 10px !important;
    background: white !important;
    h2{
      padding: 0 7px;
      font-size: 18px;
    }
  }

  .right-area_1{
    float: right;
  }
  .right-area_2{
    float: right;
  }
  .checkbox-content{
    width: 100%;
    label{
      width: 70px;
    }
    .main-disease{
      float: left;
    }
    .suspicion{
      float: left;
    }
    .ration{
      float: left;
    }
    .disease-ration{
      float: left;
    }
    .accident{
      float: left;
    }
    .insurance{
      float: left;
      // font-size: 12px;
      margin-top: 6px;
      width: 50px;
    }
  }
  .disease-name{
    width: 100%;
    .hvMNwk{
      margin-top:0px;
      width: calc(100% - 41px);
      float: left;
      margin-right: 1px;
      label{
        width: 0px;
      }
      input{
        width: 100%;
        pointer-events: none;
        border: none;
        border-bottom: 1px solid #ddd;
      }
    }
    .clear-button {    
      width: 40px;
      min-width: 40px !important;
      margin-top: 0px;
      height: 38px;
      background-color: buttonface;
      border: 1px solid #7e7e7e;
      line-height: 0px;
      span{
        color:black;        
      }    
    }
  }
  .disease-input{
    width: 100%;
    display: flex;
    justify-content: space-between;
    .disease-input-element{
      width: 14%;
      overflow: hidden;
      float: left;
      input{
        width: 100%;
        ime-mode: active;
      }
    }

    .none-active{
      input{
        pointer-events: none;
      }
    }
    .has-content{
      line-height: 33px;
      height: 35px;
      margin-top: 4px;
      font-size: 14px;
      border-radius: 4px;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(206, 212, 218);
      border-image: initial;
      padding: 0px 8px;
      background: #f2f2f2;
    }
  }
  .input-content{
    width: 100%;
    .karte-status{
      float: left;
      margin-top: 8px;
      .pullbox-title{
        width: 0px;
        margin-right: 0px;
      }
      select{
        width: 100px;
      }
    }

    .department-status{
      float: left;
      margin-top: 8px;
      .pullbox-title{
        width: 0px;
      }
      select{
        width: 200px;
      }
    }
    .disease-start-day{
      float: left;
      input{
        width: 100px;
      }
    }
  }
  .exitus_reason{
    margin-top: 8px;
    float: left;
    select{
      width: 100px;
    }
  }
  .disease-result-day{
    float: left;
    input{
      width: 100px;
    }
  }

  .left-content {
    width: 30%;

    & > button {
      display: block;
      width: auto;
      margin: 10px auto;
    }

    button {
      float: right;
    }
  }

  .right-content {
    width: 68%;
    height: 100%;
    max-height: 230px;
    overflow-y: scroll;

    p {
      margin: 0;
    }
  }

  label {
    margin: 0;
  }

  .label-title {
    font-size:14px;
    float: left;
    text-align: right;
    width: 70px;
    line-height: 38px;
    &.pullbox-title {
      margin-right: 8px;
    }
  }

  .result-list {
    width: 250px;
    padding: 0;
    margin: 0 0 0 78px;
    li {
      background-color: ${colors.secondary200};
      border: 1px solid ${colors.background};
      font-size: 14px;
      list-style-type: none;
      padding: 4px 8px;
      margin-top: -1px;
    }
  }

  table {
    font-size: 14px;
    vertical-align: middle;
    width: 100%;
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

  th {
    background-color: ${colors.midEmphasis};
    color: ${colors.surface};
    text-align: center;
    font-weight: normal;
    label {
      color: ${colors.surface};
    }
  }

  th,
  td {
    border: 1px solid ${colors.background};
    padding: 4px 8px;
  }
  .start_date {
    width: 90px;
  }
  .end_date {
    width: 120px;
  }

  .center {
    text-align: center;
    button {
      height: 25px;
      padding: 0;
      line-height: 25px;
      span {
        color: ${colors.surface};
      }
    }

    span {
      color: rgb(241, 86, 124);
    }

    .black {
      color: #000;
    }
  }
  .red {
    color: rgb(241, 86, 124);
  }
  .redRight {
    text-align: right;
    color: rgb(241, 86, 124);
  }

  .search-tab-list{
    .category-tabs{
      li{
        div{
          padding: 4px 8px !important;
        }
      }
    }
  }
  .tab-list{
    height: 160px;
    overflow-y: auto;
    width: calc(100% - 300px);
    table{
      .search-table-date{
        width: 90px;
      }
      .search-table-department{
        width: 200px;
      }
      .search-disease-item:hover{
        background: rgb(241, 243, 244);
        cursor: pointer;
      }
    }
  }
`;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 200px;
  display: flex;
`;

const init_errors = {
  system_patient_id: "",
  start_date: "",
  disease_name: "",
  department_code: ""
};

const init_state = {
  departmentCode: "1",
  department:1,
  end_date:0,
  diseaseName: "",
  diseaseDate: "",
  diseaseList: [],
  diseaseEditDate: "",
  diseaseEndDate: "",
  diseaseEditEndDate: "",
  contextMenu: {
    visible: false,
    x: 0,
    y: 0,
    type:""
  },
  karte_status: {
    code: 0,
    name: "入外"
  },
  exitus_reason: {
    code: 0,
    name: ""
  },
  input_disease_list: [
    {
      id: 0,
      status: "input",
      disease_cd: 0,
      disease_name: ""
    },
    {
      id: 1,
      status: "",
      disease_cd: 0,
      disease_name: ""
    },
    {
      id: 2,
      status: "",
      disease_cd: 0,
      disease_name: ""
    },
    {
      id: 3,
      status: "",
      disease_cd: 0,
      disease_name: ""
    },
    {
      id: 4,
      status: "",
      disease_cd: 0,
      disease_name: ""
    },
    {
      id: 5,
      status: "",
      disease_cd: 0,
      disease_name: ""
    },
    {
      id: 6,
      status: "",
      disease_cd: 0,
      disease_name: ""
    }
  ],
  main_disease: 0,
  confidentiality: 0,
  ration: 0,
  suspicion: 0,
  accident: 0,
  disease_ration: 0,
  diseaseNum: "",
  disease_combine_name: "",
  selected_name_number: -1,
  btnName: "追加",
  errors: init_errors,
  allChecked: false,
  confirm_message:'',
  alert_message:'',
  outcome_number_array:[],
  confirm_outcome_number:[],
};

class DiseaseNameOutcomeModal extends Component {
  constructor(props) {
    super(props);    
    this.state = init_state;
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
  }  

  updateDiseasesList = async () => {
    const { data } = await axios.get(
      "/app/api/v2/disease_name/search_in_patient",
      {
        params: {
          systemPatientId: this.props.patientId
        }
      }
    );
    data.disease_list.map(item => {
      item.checked = item.is_doctor_consented === 0 ? false : true;
    });
    let input_disease_list = [
      {
        id: 0,
        status: "input",
        disease_cd: 0,
        disease_name: ""
      },
      {
        id: 1,
        status: "",
        disease_cd: 0,
        disease_name: ""
      },
      {
        id: 2,
        status: "",
        disease_cd: 0,
        disease_name: ""
      },
      {
        id: 3,
        status: "",
        disease_cd: 0,
        disease_name: ""
      },
      {
        id: 4,
        status: "",
        disease_cd: 0,
        disease_name: ""
      },
      {
        id: 5,
        status: "",
        disease_cd: 0,
        disease_name: ""
      },
      {
        id: 6,
        status: "",
        disease_cd: 0,
        disease_name: ""
      }
    ];
    const update_state = Object.assign({}, init_state);
    const obj = {};

    // ●YJ794 病名・病名一括転帰モーダルの重さ・描画の修正
    let disease_list_result = data;
    if (disease_list_result.disease_list != undefined && disease_list_result.disease_list.length > 0) {
      disease_list_result.disease_list = disease_list_result.disease_list.map(item=>{
        item.is_consented_disease = this.isConsentedDisease(item);
        return item;
      });
    }

    obj["diseaseList"] = data;
    Object.assign(update_state, obj);
    update_state.input_disease_list = input_disease_list;
    update_state.outcome_number_array = [];
    update_state.isLoaded = true;
    update_state.diseaseDate = this.getCurrentDate();
    update_state.diseaseEditDate = this.getCurrentDate();
    this.setState(update_state);
  };

  upDateErrors = errors => {
    if (errors == [] || errors == "") {
      return;
    } else {
      const update_errors = Object.assign({}, init_errors);
      for (const key in this.state.errors) {
        const error_key = "disease." + key;
        if (errors.hasOwnProperty(error_key)) {
          if (key == "disease_name") {
            this.cancelDiseaseSelect();
          }
          const obj = {};
          obj[key] = errors[error_key][0];
          Object.assign(update_errors, obj);
        }
      }
      this.setState({ errors: update_errors });
    }
  };

  getCurrentDate = () => {
    var dt = new Date();
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var result = y + "-" + m + "-" + d;
    return result;
  };

  async componentDidMount() {
    this.setInsuranceCheckBox();
    this.setState({
      diseaseList:[],
      allChecked: false,
      diseaseDate: this.getCurrentDate(),
      diseaseEditDate: this.getCurrentDate(),
      departmentCode: "1",
      diseaseName: "",
      diseaseEndDate: "",
      diseaseEditEndDate: "",
      showAlert: false,
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
        type:""
      },
      karte_status: {
        code: 0,
        name: "入外"
      },
      exitus_reason: {
        code: 0,
        name: ""
      },
      input_disease_list: [
        {
          id: 0,
          status: "input",
          disease_cd: 0,
          disease_name: ""
        },
        {
          id: 1,
          status: "",
          disease_cd: 0,
          disease_name: ""
        },
        {
          id: 2,
          status: "",
          disease_cd: 0,
          disease_name: ""
        },
        {
          id: 3,
          status: "",
          disease_cd: 0,
          disease_name: ""
        },
        {
          id: 4,
          status: "",
          disease_cd: 0,
          disease_name: ""
        },
        {
          id: 5,
          status: "",
          disease_cd: 0,
          disease_name: ""
        },
        {
          id: 6,
          status: "",
          disease_cd: 0,
          disease_name: ""
        }
      ],
      main_disease: 0,
      confidentiality: 0,
      ration: 0,
      disease_ration: 0,
      suspicion: 0,
      accident: 0,
      diseaseNum: "",
      edit_number: "",
      disease_combine_name: "",
      selected_name_number: -1,
      btnName: "追加",
      errors: init_errors,
      confirm_message:'',
      alert_message:'',
      isLoaded: false,
      search_tab: 1,
      selected_disease: {},
      outcome_number_array:[],
      confirm_outcome_number:[],
    },()=>{
        this.updateDiseasesList();
    });
  }

  setInsuranceCheckBox = () => {
    let patient_insurance = [];
    if (this.props.detailedPatientInfo != null && this.props.detailedPatientInfo != undefined) {          
      patient_insurance = this.props.detailedPatientInfo.insurance;
    }
    let canAccident = true; // 労災
    let canRation = true; // 自賠
    let canDiseaseRation = true; // 併用自賠
    if (patient_insurance != null && patient_insurance != undefined && patient_insurance.length > 0) {
      patient_insurance.map(item=>{
        if (item.insurance_type != "" && item.insurance_type.substring(0, 1) == "R") {
          // 患者の有効な保険情報で、Rで始まるものがあれば「労災」チェックボックスが使用可能
          canAccident = false;
        } else if(item.insurance_type != "" && ((item.insurance_type.substring(0, 1) == "J" && item.insurance_type != "J0" && item.insurance_type != "J9") || item.insurance_type.substring(0, 1) == "Z")){
        // 患者の有効な保険情報で、上記（J0,J9）以外のJまたはZで始まるものがあれば「自賠」チェックボックスが使用可能
          canRation = false;        
        }
        if (item.insurance_type != "" && (item.insurance_type == "J0" || item.insurance_type == "J9")) {
          // 患者の有効な保険情報にJ0またはJ9があれば「併用自賠」チェックボックスが使用可能
          canDiseaseRation = false;
        }
      });
    }
    this.setState({
      canAccident,
      canRation,
      canDiseaseRation
    });
  }

  getDiseaseEndDate = value => {
    this.setState({ diseaseEndDate: value, diseaseEditEndDate: value });
  };

    confirmOk = async() => {
        let base_modal = document.getElementsByClassName("outcome-modal")[0];
        if(base_modal !== undefined && base_modal != null){
            base_modal.style['z-index'] = 1050;
        }
        let path = "/app/api/v2/disease_name/updateOutcome";
        let post_data = {
            numbers: this.state.confirm_outcome_number,
            end_date: formatDateLine(this.state.diseaseEndDate),
            exitus_reason: this.state.exitus_reason.code,
        };
        await apiClient
            ._post(path, {
                params: post_data
            })
            .then(() => {
                if(this.state.confirm_type == "end"){
                    this.confirmCancel();
                    this.props.closeModal();
                } else {
                    this.setState({
                        isLoaded: false,
                        confirm_message: "",
                        confirm_type: "",
                    }, ()=>{
                      this.updateDiseasesList();
                    });
                    
                }
            })
            .catch(() => {
            });
    }

  onConsent = () => {
    if (this.context.$getKarteMode(this.props.patientId) === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合

    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let consentList = [];
    this.state.diseaseList.disease_list.map(item => {
      if (item.is_doctor_consented === 0 && item.checked === true) {
        consentList.push(item.number);
      }
    });

    if (consentList.length === 0) return;

    let postData = {
      disease: consentList,
      staff_number: authInfo.user_number
    };

    axios
      .post("/app/api/v2/disease_name/consent", {
        params: postData
      })
      .then(() => {
        let diseaseList = this.state.diseaseList;
        diseaseList.disease_list.map(item => {
          if (item.is_doctor_consented === 0 && item.checked === true) {
            item.is_doctor_consented = 1;
          }
        });

        this.setState({
          diseaseList: diseaseList,
          allChecked: false
        });
      })
      .catch(res => {
        if (res.status == 400 || res.status == 500) {
          if (res.error != undefined && res.error_alert_message != "") {
            alert(res.error_alert_message + "\n");
          }
        }
      });
  };

  getOutcomeCheck =(name, number)=>{
    if(name == "out_come_check"){
      let outcome_number_array = this.state.outcome_number_array;
      let confirm_outcome_number = this.state.confirm_outcome_number;
      let index = outcome_number_array.indexOf(number);
      if(index === -1){
          outcome_number_array.push(number);
      } else {
          outcome_number_array.splice(index, 1);
      }
      if(confirm_outcome_number.length > 0){
        confirm_outcome_number = [...outcome_number_array]
      }
      this.setState({
          outcome_number_array,
          confirm_outcome_number,
      });
    }
  }

  getRadio = (name, value) => {
    if (name === "notConsentedDataOneSelect") {
      let diseaseList = this.state.diseaseList;
      let allChecked = true;
      diseaseList.disease_list.map(item => {
        if (item.number === value) {
          item.checked = !item.checked;
        }
        if (item.checked === false) {
          allChecked = false;
        }
      });

      this.setState({
        diseaseList: diseaseList,
        allChecked: allChecked
      });
    } else if (name === "notConsentedDataAllSelect") {
      let allChecked = !this.state.allChecked;
      let diseaseList = this.state.diseaseList;
      diseaseList.disease_list.map(item => {
        item.checked = allChecked;
      });
      this.setState({
        diseaseList: diseaseList,
        allChecked: allChecked
      });
    }

    if (name == "main-disease") {
      this.setState({
        main_disease: value
      });
    }
    if (name == "confidentiality") {
      this.setState({
        confidentiality: value
      });
    }
    if (name == "suspicion") {
      let disease_combine_name = "";
      let input_disease_list = this.state.input_disease_list;
      input_disease_list.map(item=>{
        if (item.status == "completed") {
          disease_combine_name += item.disease_name;
        }
      });
      if (value == 1 && disease_combine_name != "") {
        disease_combine_name += "の疑い";
      }
      this.setState({
        suspicion: value,
        disease_combine_name
      });
    }
    if (name == "ration") {
      this.setState({
        ration: value
      });
    }
    if (name == "accident") {
      this.setState({
        accident: value
      });
    }
    if (name == "disease_ration") {
      this.setState({
        disease_ration: value
      });
    }
  };

  cancelDiseaseSelect = () => {
    this.setState({
      diseaseName: ""
    });
  };

  getDepartmentName = code => {
    let name = "";
    this.departmentOptions.map(item => {
      if (item.id === parseInt(code)) {
        name = item.value;
      }
    });
    if (name == "") {
      name = "全科";
    }
    return name;
  };

  hasConfirmNeeded = () => {
    if (this.state.diseaseList.disease_list === undefined) return false;
    let hasConfirm = false;
    this.state.diseaseList.disease_list.map(item => {
      if (item.is_doctor_consented === 0) {
        hasConfirm = true;
      }
    });

    return hasConfirm;
  };

    confirmCancel = () => {
        this.setState({
            confirm_message: "",
            confirm_type: "",
        });
    }

    getExitusReason = e => {
      this.setState({
        exitus_reason:{name: e.target.value, code: e.target.id}
      });
    };

    closeAlert = () => {
        this.setState({
            alert_message: "",
        });
        let base_modal = document.getElementsByClassName("outcome-modal")[0];
        if(base_modal !== undefined && base_modal != null){
            base_modal.style['z-index'] = 1050;
        }
    }

    getInsuranceName = (disease) => {
      let insurace_type_accident = null;
      let insurace_type_ration = null;
      let insurace_type_disease_ration = null;
      if (disease.insurance_type1 != null && disease.insurance_type1.substring(0, 1) == "R") {
        insurace_type_accident = "accident";
      }
      if (disease.insurance_type1 != null && ((disease.insurance_type1.substring(0, 1) == "J" && disease.insurance_type1 != "J0" && disease.insurance_type1 != "J9") || disease.insurance_type1.substring(0, 1) == "Z")) {
        insurace_type_ration = "ration";
      }
      if (disease.insurance_type2 != null && ((disease.insurance_type2.substring(0, 1) == "J" && disease.insurance_type2 != "J0" && disease.insurance_type2 != "J9") || disease.insurance_type2.substring(0, 1) == "Z")) {
        insurace_type_ration = "ration";
      }
      if (disease.insurance_type3 != null && ((disease.insurance_type3.substring(0, 1) == "J" && disease.insurance_type3 != "J0" && disease.insurance_type3 != "J9") || disease.insurance_type3.substring(0, 1) == "Z")) {
        insurace_type_ration = "ration";
      }
      if (disease.insurance_type1 != null && (disease.insurance_type1 == "J0" || disease.insurance_type1 == "J9")) {
        insurace_type_disease_ration = "disease_ration";
      }
      if (disease.insurance_type2 != null && (disease.insurance_type2 == "J0" || disease.insurance_type2 == "J9")) {
        insurace_type_disease_ration = "disease_ration";
      }
      if (disease.insurance_type3 != null && (disease.insurance_type3 == "J0" || disease.insurance_type3 == "J9")) {
        insurace_type_disease_ration = "disease_ration";
      }
      let result = "";
      if (insurace_type_accident == "accident") result = "労災、";
      if (insurace_type_ration == "ration") result += "自賠、";
      if (insurace_type_disease_ration == "disease_ration") result += "併用自賠、";
      if (result != "") {
        return result.substring(0, result.length - 1);
      } else {
        return "";
      }
    }

    isConsentedDisease = (disease) => {
      // 依頼医 承認チェックボックスが表示
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      let user_name = authInfo.name;
      if (this.context.$canDoAction(this.context.FEATURES.DISEASE, this.context.AUTHS.CONFIRM)) {
        if (user_name == disease.doctor_name) {
          return true;
        }
      }
      
      return false;
    }

    getConsentedDiseaseCount = () => {
      // get consented 依頼医'count
      let disease_list = this.state.diseaseList.disease_list;
      if (disease_list == null || disease_list == undefined || disease_list.length < 1) {
        return 0;
      }
      let nCount = 0;
      disease_list.map(item=>{
        if (this.isConsentedDisease(item) == true && item.is_doctor_consented == 0) {
          nCount ++;
        }
      });
      return nCount;
    }

    getDepartment = (e) => {
        this.setState({department:parseInt(e.target.value)});
    }

    getEndDate = (e) => {
        this.setState({end_date:parseInt(e.target.value)});
    }

    checkAllOutcomeNuber=()=>{
      this.setState({
        confirm_outcome_number:[...this.state.outcome_number_array],
      });
    }

    saveData=(type=null)=>{
        let alert_message = "";
        if(this.state.diseaseEndDate === ""){
            alert_message = "転帰日を入力してください。";
        }
        if(this.state.exitus_reason.code == 0){
            alert_message = "転帰事由を選択してください。";
        }
        if(alert_message !== ""){
            let base_modal = document.getElementsByClassName("outcome-modal")[0];
            if(base_modal !== undefined && base_modal != null){
                base_modal.style['z-index'] = 1040;
            }
            this.setState({
                alert_message,
            });
        } else {
            let confirm_message = "";
            if(type === "end"){
                confirm_message = "病名終了しますか？"
            } else {
                confirm_message = "確定しますか？"
            }
            let base_modal = document.getElementsByClassName("outcome-modal")[0];
            if(base_modal !== undefined && base_modal != null){
                base_modal.style['z-index'] = 1040;
            }
            this.setState({
                confirm_message,
                confirm_type:type,
            });
        }
    }

  handleCloseModal = () => {
    if (this.state.confirm_outcome_number.length > 0 || this.state.outcome_number_array.length > 0) {
      this.setState({
        confirm_message: "入力内容を破棄しますか？",
        confirm_type: "close_button"
      })
      return;
    }
    this.props.closeModal();
  }

  confirmCloseOk = () => {
    if (this.state.confirm_type == "close_button") {
      this.props.closeModal();
    }
  }

  render() {
    let noresult = 0;
    if(this.state.diseaseList.disease_list != undefined){
      noresult = this.state.diseaseList.disease_list.length;
    }
    return (
      <>
        <Modal
          show={true}          
          className="custom-modal-sm patient-exam-modal disease-name-modal disease-name-patient-modal outcome-modal first-view-modal"
        >
          <Modal.Header>
              <Modal.Title>病名一括転帰</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Popup>
                <div style={{display:"flex"}}>
                  <div style={{display:"flex", width:"calc(100% - 310px)"}}>
                      <div className="exitus_reason">
                          <SelectorWithLabel
                              title="転帰事由"
                              options={EXITUS_REASON}
                              getSelect={this.getExitusReason}
                              value={this.state.exitus_reason.name}
                              departmentEditCode={this.state.exitus_reason.code}
                              id="karte-status"
                          />
                      </div>
                      <div className="disease-result-day">
                          <InputWithErrorLabel
                              label="転帰日"
                              type="date"
                              getInputText={this.getDiseaseEndDate}
                              diseaseEditData={this.state.diseaseEditEndDate == "" || this.state.diseaseEditEndDate == null ? "" : new Date(this.state.diseaseEditEndDate)}
                              error={this.state.errors.end_date}
                              handleKeyPress={() => {}}
                          />
                      </div>
                      <Button className="group-out-btn" onClick={this.checkAllOutcomeNuber}>一括転帰</Button>
                  </div>
                </div>
              <div className="disease-header" style={{display:"flex"}}>
                <fieldset className="radio-area">
                    <legend className="blog-title">診療科</legend>
                    <div className = "radio-groups">
                        <Radiobox
                            label={`自科(${this.context.department.name !== ""?this.context.department.name:"内科"})`}
                            value={0}
                            getUsage={this.getDepartment.bind(this)}
                            checked={this.state.department == 0 ? true : false}
                            name={`sel-department`}
                        />
                        <Radiobox
                            label={'全科'}
                            value={1}
                            getUsage={this.getDepartment.bind(this)}
                            checked={this.state.department == 1 ? true : false}
                            name={`sel-department`}
                        />
                    </div>
                </fieldset>
                <fieldset className="radio-area radio-area-second">
                    <legend className="blog-title">転帰/未転帰</legend>
                    <div className = "radio-groups">
                        <Radiobox
                            label={'未転帰のみ'}
                            value={0}
                            getUsage={this.getEndDate.bind(this)}
                            checked={this.state.end_date === 0 ? true : false}
                            name={`sel-outcome`}
                        />
                        <Radiobox
                            label={'全て'}
                            value={1}
                            getUsage={this.getEndDate.bind(this)}
                            checked={this.state.end_date === 1 ? true : false}
                            name={`sel-outcome`}
                        />
                    </div>
                </fieldset>
            </div>
              <div className="flex disease-list">
                <div className="list-content">
                {this.state.isLoaded == false ? (
                    <div className='center'>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                  </div>
                ):(
                  <table className='disease-list-table'>
                    <thead>
                    <tr>
                      <th style={{width:'30px'}}> </th>
                      <th className='kind'>入外</th>
                      <th className='department'>診療科</th>
                      <th className='name'>病名</th>
                      <th className={'start_date'}>開始日</th>
                      <th className={'end_date'}>転帰日・事由</th>
                      <th className='one-letter'>主</th>
                      <th className='one-letter'>守</th>
                      <th className='doctor-name'>医師名</th>
                      <th className='insurance'>保険</th>
                      <th className='agree'>承認</th>
                      {/* <th>
                        {this.context.$canDoAction(
                          this.context.FEATURES.DISEASE,
                          this.context.AUTHS.CONFIRM
                        ) &&
                          this.hasConfirmNeeded() && (
                            <Checkbox
                              label="全て選択"
                              getRadio={this.getRadio.bind(this)}
                              value={this.state.allChecked}
                              name="notConsentedDataAllSelect"
                            />
                          )}
                      </th> */}
                    </tr>
                    </thead>
                    <tbody>
                      {noresult > 0 ? (
                        this.state.diseaseList.disease_list.filter(item=>{
                          if (this.state.department == 1) {
                            if (this.state.end_date == 0) {
                              if (item.end_date == null) return true;
                              else return false;
                            } else return true;
                          } else {
                            if (item.department_code == (this.context.department.code == 0 ? 1: this.context.department.code)) {
                              if (this.state.end_date == 0) {
                                if (item.end_date == null) return true;
                                else return false;
                              } else return true;
                            } else {
                              return false;
                            }
                          }
                        })
                        .map(disease => (
                          <tr
                            key={disease.number}
                            className={this.state.diseaseNum == disease.number ? "edit_tr" : ""}
                            style={{backgroundColor:this.state.confirm_outcome_number.includes(disease.number) ? "rgb( 255, 255, 200)":""}}
                          >
                            <td style={{width:'30px'}} className={'text-center'}>
                                <Checkbox
                                    getRadio={this.getOutcomeCheck.bind(this)}
                                    value={(this.state.outcome_number_array.includes(disease.number))}
                                    number={disease.number}
                                    name="out_come_check"
                                />
                            </td>
                            <td className={'text-center kind'}>{Karte_status_type[disease.patient_type > 0 ? disease.patient_type : 0].value}</td>
                            <td className={'text-center department'}>{this.getDepartmentName(disease.department_code)}</td>
                            <td className='name'>{disease.disease_name}</td>
                            <td className={'text-center start_date'}>{disease.start_date}</td>
                            <td className={'text-center end_date_1'}>{disease.end_date === null ? "" : disease.end_date}</td>
                            <td className='end_date_2'>{EXITUS_REASON[disease.exitus_reason > 0 ? disease.exitus_reason : 0].value}</td>  
                            <td className={'text-center one-letter'}>{disease.main_diease_name_flag == 1 && "主"}</td>
                            <td className={'text-center one-letter'}>{disease.confidentiality_flag == 1 && "守"}</td>
                            <td className='doctor-name'>
                              {disease.is_doctor_consented !== 2 ? (
                                <>
                                  <p>依頼医: {disease.doctor_name}</p>
                                  <p>入力者: {disease.updated_by_name != null && disease.updated_by_name != undefined && disease.updated_by_name != "" ? disease.updated_by_name : disease.created_by_name}</p>
                                </>
                              ) : (
                                <p>{disease.updated_by_name != null && disease.updated_by_name != undefined && disease.updated_by_name != "" ? disease.updated_by_name : disease.created_by_name}</p>
                              )}
                            </td>
                            <td className={'text-center insurance'}>{this.getInsuranceName(disease)}</td>
                            {disease.is_doctor_consented === 0 ? (
                              <td className="center agree">
                                {disease.is_consented_disease != undefined && disease.is_consented_disease ? (
                                  <Checkbox
                                    ref={ref => (this.selectAll = ref)}
                                    label="選択"
                                    getRadio={this.getRadio.bind(this)}
                                    value={disease.checked}
                                    number={disease.number}
                                    name="notConsentedDataOneSelect"
                                  />
                                ) : (
                                  <span className="red">未承認</span>
                                )}
                              </td>
                            ) : (
                              <td className="center agree">
                                {disease.is_doctor_consented === 1 && (
                                  <span className="black">承認済み</span>
                                )}
                              </td>
                            )}
                            {/* <td></td> */}
                          </tr>
                        ))
                      ) : (
                        <>
                        <tr>
                          <td colSpan="11" className="center">
                            <div className="table-scroll"><div className="no-result"><p>条件に一致する結果は見つかりませんでした。</p></div></div>
                            </td>
                        </tr>
                        </>
                      )}
                      
                      </tbody>
                  </table>   
                )}                         
                </div>
              </div>
              {this.state.confirm_message !== "" && this.state.confirm_type != "close_button" && (
                  <SystemConfirmModal
                      hideConfirm= {this.confirmCancel.bind(this)}
                      confirmCancel= {this.confirmCancel.bind(this)}
                      confirmOk= {this.confirmOk.bind(this)}
                      confirmTitle= {this.state.confirm_message}
                  />
              )}
              {this.state.confirm_message !== "" && this.state.confirm_type == "close_button" && (
                <SystemConfirmModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.confirmCloseOk.bind(this)}
                  confirmTitle= {this.state.confirm_message}
                />
              )}
              {this.state.alert_message !== "" && (
                <SystemAlertModal
                  hideModal= {this.closeAlert}
                  handleOk= {this.closeAlert}
                  showMedicineContent= {this.state.alert_message}
                />
              )}
            </Popup>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.handleCloseModal}>閉じる</Button>
            {/*{this.state.confirm_outcome_number.length == 0 ? (
              <Button className="disable-btn">病名終了</Button>
            ):(
              <Button className="red-btn" onClick={this.saveData.bind(this, 'end')}>病名終了</Button>
            )}*/}
            {this.state.confirm_outcome_number.length == 0 ? (
              <Button className="disable-btn">確定</Button>
            ):(
              <Button className="red-btn" onClick={this.saveData}>確定</Button>
            )}
          </Modal.Footer>
        </Modal>        
      </>
    );
  }
}
DiseaseNameOutcomeModal.contextType = Context;

DiseaseNameOutcomeModal.propTypes = {
  closeModal: PropTypes.func,
  detailedPatientInfo: PropTypes.object,
  patientId: PropTypes.number
};

export default DiseaseNameOutcomeModal;
