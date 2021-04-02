import React, { Component, useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import Context from "~/helpers/configureStore";
import axios from "axios";
import SelectorWithLabel from "../molecules/SelectorWithLabel";
import InputWithErrorLabel from "../molecules/InputWithErrorLabel";
import InputWithLabel from "../molecules/InputWithLabel";
import InputKeyWord from "~/components/molecules/InputKeyWord";
import DiseaseNameListPopup from "./DiseaseNameListPopup.js";
import Button from "../atoms/Button";
import Checkbox from "../molecules/Checkbox";
import Spinner from "react-bootstrap/Spinner";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import { EXITUS_REASON } from "~/helpers/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/pro-regular-svg-icons";
import SelectPannelHarukaModal from "~/components/templates/Patient/Modals/Common/SelectPannelHarukaModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import * as localApi from "~/helpers/cacheLocal-utils";

const Arrow = styled(FontAwesomeIcon)`  
  font-size: 12px;  
`;

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
  .flex {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  h2 {
    color: ${colors.onSurface};
    font-size: 17px;
    font-weight: 500;
    margin: 6px 0;
  }
  .insert-button {
    button{
      margin: 0 auto !important;      
    }
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
      float: right;
    }
    .accident{
      float: right;
    }
    .insurance{
      float: right;
      font-size: 12px;
      margin-top: 6px;
      width: 50px;
    }
  }
  .disease-name{
    width: 100%;
    .hvMNwk{
      width: calc(100% - 41px);
      float: left;
      margin-right: 1px;
      label{
        width: 0px;
      }
      input{
        width: 100%;
        pointer-events: none;
      }
    }
    .clear-button {    
      width: 40px;
      min-width: 40px !important;
      margin-top: 8px;
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
        width: 130px;
      }
    }
    .disease-start-day{
      float: right;
      input{
        width: 100px;
      }
    }
    .disease-result-day{
      float: right;
      input{
        width: 100px;
      }
    }
    .exitus_reason{
      margin-top: 8px;
      float: right;
      select{
        width: 100px;
      }
    }
  }

  .list-content{
    overflow-y: auto;
    width: 100%;
    height: 230px;
    margin-top: 5px;
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
    float: left;
    text-align: right;
    width: 70px;
    line-height: 38px;
    &.pullbox-title {
      margin-right: 8px;
    }
  }

  select,
  input {
    width: 250px;
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
  .start_date, .end_date {
    width: 90px;
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
`;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-left: 33vh;
  display: table-caption;
  position: absolute;
  top: 230px;
`;

const ContextMenuUl = styled.ul`
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
`;

const init_errors = {
  system_patient_id: "",
  start_date: "",
  disease_name: "",
  department_code: ""
};

const init_state = {
  departmentCode: "1",
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
  ration: 0,
  suspicion: 0,
  accident: 0,
  diseaseNum: "",
  disease_combine_name: "",
  selected_name_number: -1,
  btnName: "追加",
  errors: init_errors,
  allChecked: false,
  dieaseNameShow: false,
  isOpenDiseaseInputModal: false,
  diseaseNameList: [],  
  confirm_type:'',
  confirm_message:'',
};

const ContextMenu = ({ visible, x, y, type, parent }) => {
  if (visible) {
    const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
    return (
      <ContextMenuUl>
        {type == "disease_input" && (
          <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
            
              <li>
                <div
                  onClick={() =>
                    parent.contextMenuAction(
                      "searchDisease",
                      parent.state.selected_name_number
                    )
                  }
                >
                  再検索
                </div>
              </li> 
              <li>
                <div
                  onClick={() =>
                    parent.contextMenuAction(
                      "completedDiseaseDelete",
                      parent.state.selected_name_number
                    )
                  }
                >
                  削除
                </div>
              </li>                         
          </ul>
        )}
        {type == "" && (
          <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
            {($canDoAction(FEATURES.DISEASE, AUTHS.EDIT) ||
              $canDoAction(FEATURES.DISEASE, AUTHS.EDIT_OLD) ||
              $canDoAction(FEATURES.DISEASE, AUTHS.EDIT_PROXY) ||
              $canDoAction(FEATURES.DISEASE, AUTHS.EDIT_PROXY_OLD)) && (
              <li>
                <div
                  onClick={() =>
                    parent.contextMenuAction(
                      "diseaseEdit",
                      parent.state.diseaseNum
                    )
                  }
                >
                  編集
                </div>
              </li>
            )}
            {($canDoAction(FEATURES.DISEASE, AUTHS.DELETE) ||
              $canDoAction(FEATURES.DISEASE, AUTHS.DELETE_OLD) ||
              $canDoAction(FEATURES.DISEASE, AUTHS.DELETE_PROXY) ||
              $canDoAction(FEATURES.DISEASE, AUTHS.DELETE_PROXY_OLD)) && (
              <li>
                <div
                  onClick={() =>
                    parent.contextMenuAction(
                      "diseaseDelete",
                      parent.state.diseaseNum
                    )
                  }
                >
                  削除
                </div>
              </li>
            )}
          </ul>
        )}
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class DiseaseNamePopup extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
  }

  updateDiseasesList = async (type=null) => {
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
    if(type == "init"){
      return data;
    } else {
      const update_state = Object.assign({}, init_state);
      const obj = {};
      obj["diseaseList"] = data;
      Object.assign(update_state, obj);
      update_state.isLoaded = true;
      update_state.diseaseDate = this.getCurrentDate();
      update_state.diseaseEditDate = this.getCurrentDate();
      this.setState(update_state);
    }
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
    let diseaseList = [];
    await this.updateDiseasesList('init').then(function(data){
      diseaseList = data;
    });
    this.setState({
      isLoaded:true,
      diseaseList:(diseaseList != undefined && diseaseList != null && diseaseList.length > 0) ? diseaseList : [],
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
      ration: 0,
      suspicion: 0,
      accident: 0,
      diseaseNum: "",
      disease_combine_name: "",
      selected_name_number: -1,
      btnName: "追加",
      errors: init_errors,
      dieaseNameShow: false,
      isOpenDiseaseInputModal: false,
      diseaseNameList: [],      
      confirm_type:'',
      confirm_message:'',
    });
  }

  getSelect = e => {
    this.setState({
      departmentCode: e.target.id
    });
  };

  getDiseaseName = e => {
    this.setState({
      diseaseName: e.target.value
    });
  };

  getDiseaseDate = value => {
    this.setState({ diseaseDate: value, diseaseEditDate: value });
  };

  getDiseaseEndDate = value => {
    this.setState({ diseaseEndDate: value, diseaseEditEndDate: value });
  };

  getDateString = value => {
    if (value == null) return "";
    if (value.constructor.name === "Date")
      return (
        value.getFullYear() +
        "-" +
        (value.getMonth() + 1) +
        "-" +
        value.getDate()
      );
    return value;
  };

  register = async () => {
    let canEdit = 0;
    if (this.state.btnName == "追加") {
      if (
        this.context.$canDoAction(
          this.context.FEATURES.DISEASE,
          this.context.AUTHS.REGISTER
        ) ||
        this.context.$canDoAction(
          this.context.FEATURES.DISEASE,
          this.context.AUTHS.REGISTER_OLD
        )
      ) {
        canEdit = 1;
      }
      if (
        this.context.$canDoAction(
          this.context.FEATURES.DISEASE,
          this.context.AUTHS.REGISTER_PROXY
        ) ||
        this.context.$canDoAction(
          this.context.FEATURES.DISEASE,
          this.context.AUTHS.REGISTER_PROXY_OLD
        )
      ) {
        canEdit = 2;
      }
    } else {
      // Edit
      if (
        this.context.$canDoAction(
          this.context.FEATURES.DISEASE,
          this.context.AUTHS.EDIT
        ) ||
        this.context.$canDoAction(
          this.context.FEATURES.DISEASE,
          this.context.AUTHS.EDIT_OLD
        )
      ) {
        canEdit = 1;
      }
      if (
        this.context.$canDoAction(
          this.context.FEATURES.DISEASE,
          this.context.AUTHS.EDIT_PROXY
        ) ||
        this.context.$canDoAction(
          this.context.FEATURES.DISEASE,
          this.context.AUTHS.EDIT_PROXY_OLD
        )
      ) {
        canEdit = 2;
      }
    }
    if (canEdit === 0) {
      window.sessionStorage.setItem("alert_messages", "権限がありません。");
      // alert("権限がありません。");
      return;
    }

    if (canEdit === 2) {
      if (this.context.selectedDoctor.code === 0) {
        this.context.$selectDoctor(true);
        return;
      }
    }

    if (this.state.btnName == "追加") {
        this.setState({
            confirm_message: "登録しますか？",
            confirm_type: "add",
        });
    } else {
        this.setState({
            confirm_message: "変更しますか？",
            confirm_type: "edit",
        });
    }
  };

    confirmOk = async() => {
        var diseaseData = {};
        var diseaseDateStr = this.getDateString(this.state.diseaseDate);
        var diseaseEndDateStr = this.getDateString(this.state.diseaseEndDate);
        let op_type = "";
        let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
        if(this.state.confirm_type === 'add'){
            op_type = "add";
            let disease_names = this.state.input_disease_list;            
            diseaseData = {
                disease: {
                    system_patient_id: this.props.patientId,
                    disease_name: this.state.diseaseName,
                    department_code: this.state.departmentCode,
                    start_date: diseaseDateStr,
                    end_date: diseaseEndDateStr,
                    disiease_name_list: this.state.input_disease_list,
                    is_doctor_consented: this.context.staff_category === 1 ? 2 : 0,
                    created_by: authInfo.user_number,
                    disease_combine_name: this.state.disease_combine_name,
                    karte_status: this.state.karte_status.code,
                    exitus_reason: this.state.exitus_reason.code,
                    main_disease: this.state.main_disease,
                    ration: this.state.ration,
                    suspicion: this.state.suspicion,
                    accident: this.state.accident,
                    name_1 : disease_names[0].disease_cd,
                    name_2 : disease_names[1].disease_cd,
                    name_3 : disease_names[2].disease_cd,
                    name_4 : disease_names[3].disease_cd,
                    name_5 : disease_names[4].disease_cd,
                    name_6 : disease_names[5].disease_cd,
                    name_7 : disease_names[6].disease_cd,
                    doctor_code:
                        authInfo.doctor_code == 0
                            ? parseInt(this.context.selectedDoctor.code)
                            : parseInt(authInfo.doctor_code)
                }
            };
        } else {
            op_type = "update";
            let disease_names = this.state.input_disease_list;
            diseaseData = {
                disease: {
                    number: this.state.diseaseNum,
                    system_patient_id: this.props.patientId,
                    disease_name: this.state.diseaseName,
                    department_code: this.state.departmentCode,
                    start_date: diseaseDateStr,
                    end_date: diseaseEndDateStr,
                    disiease_name_list: this.state.input_disease_list,
                    disease_combine_name: this.state.disease_combine_name,
                    karte_status: this.state.karte_status.code,
                    exitus_reason: this.state.exitus_reason.code,
                    main_disease: this.state.main_disease,
                    ration: this.state.ration,
                    suspicion: this.state.suspicion,
                    accident: this.state.accident,
                    name_1 : disease_names[0].disease_cd,
                    name_2 : disease_names[1].disease_cd,
                    name_3 : disease_names[2].disease_cd,
                    name_4 : disease_names[3].disease_cd,
                    name_5 : disease_names[4].disease_cd,
                    name_6 : disease_names[5].disease_cd,
                    name_7 : disease_names[6].disease_cd,
                    updated_by: authInfo.user_number
                }
            };
        }
        // let status = await this.checkDiseaseName();
        // if (status) this.registerOfDiseaseData(diseaseData);
        if (this.state.disease_combine_name != "") {
          if (op_type == "add") this.registerOfDiseaseData(diseaseData);// register
          else this.updateOfDiseaseData(diseaseData);// update
        }
        else {
          this.setState({
            showAlert: true
          });
        }
        this.confirmCancel();
    }

  checkDiseaseName = async () => {
       let path = "/app/api/v2/master/disease/search/disease_name";
       let post_data = {
            word:this.state.diseaseName,
        };
        let data = null;
        await axios.post(path, {params: post_data}).
        then((res) => {
                data = res.data;
        })
        .catch(() => {
        });
    // const url =
    //   "/app/api/v2/master/disease/search/index" +
    //   "?word=" +
    //   this.state.diseaseName;
    // const { data } = await axios.get(url);

    let hasMatchedName = false;
    if(data != null && data.length > 0){
      data.map(item => {
        if (item.name === this.state.diseaseName) {
          hasMatchedName = true;
        }
      });
    }

    if (hasMatchedName === false) {
      this.setState({
        errors: {
          system_patient_id: "",
          start_date: "",
          disease_name: "上記病名では登録できません",
          department_code: ""
        }
      });
      return false;
    } else {
      this.setState({
        errors: init_errors
      });
    }
    return true;
  };

  registerOfDiseaseData = async diseaseData => {
    const { data } = await axios.post(
      "/app/api/v2/disease_name/register",
      diseaseData
    );
    this.setState({isLoaded: false}, ()=>{
      if (data.status == "ok") {
        this.updateDiseasesList();
      } else {
        this.upDateErrors(data.errors);// filed
      }
    });
  };

  updateOfDiseaseData = async diseaseData => {
    const { data } = await axios.post(
      "/app/api/v2/disease_name/update",
      diseaseData
    );
    this.setState({isLoaded: false}, ()=>{
      if (data.status == "ok") {
        this.updateDiseasesList();
      } else {
        this.upDateErrors(data.errors); // filed
      }
    });
  };

  deleteOfDiseaseData = async diseaseData => {
    const { data } = await axios.post(
      "/app/api/v2/disease_name/delete",
      diseaseData
    );
    this.setState({isLoaded: false}, ()=>{
      if (data.status === "ok") {
        this.updateDiseasesList();
      }
    });
  };

  handleClick(e, diseaseNum) {
    this.setState({ diseaseNum: diseaseNum });

    if (e.type === "contextmenu") {
      e.preventDefault();
      if (!this.state.contextMenu.visible) {
        // eslint-disable-next-line consistent-this
        const that = this;
        document.addEventListener(`click`, function onClickOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document.removeEventListener(`click`, onClickOutside);
        });
        window.addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          window.removeEventListener(`scroll`, onScrollOutside);
        });
      }
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - 200,
          y: e.clientY - 110,
          type: ""
        }
      });
    }
  }
  handleDiseaseClick(e, disease_id) {
    this.setState({ selected_name_number: disease_id });

    if (e.type === "contextmenu") {
      e.preventDefault();
      if (!this.state.contextMenu.visible) {
        // eslint-disable-next-line consistent-this
        const that = this;
        document.addEventListener(`click`, function onClickOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document.removeEventListener(`click`, onClickOutside);
        });
        window.addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          window.removeEventListener(`scroll`, onScrollOutside);
        });
      }
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - 200,
          y: e.clientY - 110,
          type: "disease_input"
        }
      });
    }
  }

  contextMenuAction = (act, diseaseNum) => {
    if (act === "diseaseDelete") {
      let canEdit = 0;
      // Delete
      if (
        this.context.$canDoAction(
          this.context.FEATURES.DISEASE,
          this.context.AUTHS.DELETE
        ) ||
        this.context.$canDoAction(
          this.context.FEATURES.DISEASE,
          this.context.AUTHS.DELETE_OLD
        )
      ) {
        canEdit = 1;
      }
      if (
        this.context.$canDoAction(
          this.context.FEATURES.DISEASE,
          this.context.AUTHS.DELETE_PROXY
        ) ||
        this.context.$canDoAction(
          this.context.FEATURES.DISEASE,
          this.context.AUTHS.DELETE_PROXY_OLD
        )
      ) {
        canEdit = 2;
      }

      if (canEdit === 0) {
        window.sessionStorage.setItem("alert_messages", "権限がありません。");
        // alert("権限がありません。");
        return;
      }

      if (canEdit === 2) {
        if (this.context.selectedDoctor.code === 0) {
          this.context.$selectDoctor(true);
          return;
        }
      }

      const diseaseData = {
        disease: {
          system_patient_id: this.props.patientId,
          number: diseaseNum
        }
      };
      if (confirm("削除して良いですか？")) {
        this.deleteOfDiseaseData(diseaseData);
      }
    } else if (act === "diseaseEdit") {
      this.state.diseaseList.disease_list.map(disease => {
        if (disease.number == diseaseNum) {
          let karte_status = {
            code: 0,
            name: "入外"
          };
          Karte_status_type.map(item=>{
            if (item.id == disease.patient_type) {
              karte_status.code = item.id;
              karte_status.name = item.name;
            }
          });
          let exitus_reason = {
            code: 0,
            name: ""
          };
          EXITUS_REASON.map(item=>{
            if (item.id == disease.exitus_reason) {
              exitus_reason.code = item.id;
              exitus_reason.name = item.name;
            }
          });
          let input_disease_list = [
            {
              id: 0,
              status: disease.name1 > 0 ? "completed" : "",
              disease_cd: disease.name1 > 0 ? disease.name1 : 0,
              disease_name: disease.name1_val != "" ? disease.name1_val : ""
            },
            {
              id: 1,
              status: disease.name2 > 0 ? "completed" : "",
              disease_cd: disease.name2 > 0 ? disease.name2 : 0,
              disease_name: disease.name2_val != "" ? disease.name2_val : ""
            },
            {
              id: 2,
              status: disease.name3 > 0 ? "completed" : "",
              disease_cd: disease.name3 > 0 ? disease.name3 : 0,
              disease_name: disease.name3_val != "" ? disease.name3_val : ""
            },
            {
              id: 3,
              status: disease.name4 > 0 ? "completed" : "",
              disease_cd: disease.name4 > 0 ? disease.name4 : 0,
              disease_name: disease.name4_val != "" ? disease.name4_val : ""
            },
            {
              id: 4,
              status: disease.name5 > 0 ? "completed" : "",
              disease_cd: disease.name5 > 0 ? disease.name5 : 0,
              disease_name: disease.name5_val != "" ? disease.name5_val : ""
            },
            {
              id: 5,
              status: disease.name6 > 0 ? "completed" : "",
              disease_cd: disease.name6 > 0 ? disease.name6 : 0,
              disease_name: disease.name6_val != "" ? disease.name6_val : ""
            },
            {
              id: 6,
              status: disease.name7 > 0 ? "completed" : "",
              disease_cd: disease.name7 > 0 ? disease.name7 : 0,
              disease_name: disease.name7_val != "" ? disease.name7_val : ""
            }
          ];
          let init_input_tag = -1;
          input_disease_list.map((item)=>{            
            if (init_input_tag == -1 && item.status != "completed") {
              init_input_tag = 1;
              item.status = "input";
            }            
          });
          this.setState({
            departmentCode: disease.department_code,
            diseaseName: disease.disease_name,
            diseaseEditDate: disease.start_date,
            diseaseDate: disease.start_date,
            diseaseEndDate: disease.end_date,
            diseaseEditEndDate: disease.end_date,
            diseaseNum: disease.number,
            karte_status,
            exitus_reason,
            input_disease_list,
            main_disease: disease.main_diease_name_flag,
            // ration,
            suspicion: disease.doubt_flag,
            // accident,
            disease_combine_name: disease.disease_name,
            btnName: "編集",
            errors: init_errors
          });
        }
      });
    } else if (act == "searchDisease"){
      let input_disease_list = this.state.input_disease_list;
      let diseaseName = "";
      input_disease_list.map(item=>{
        if (item.id == diseaseNum) {
          diseaseName = item.disease_name;
        }
      });
      this.setState({
        diseaseName,
        isOpenDiseaseInputModal: true,
        selected_name_number: diseaseNum,
        isLoadData: false
      });
    } else if (act == "completedDiseaseDelete"){
      let input_disease_list = this.state.input_disease_list;
      let tmp = input_disease_list.filter(ele=>{
        if (ele.id != diseaseNum ) {
          return ele;
        }
      });
      let completed_count = 0;
      tmp.map((item, index)=>{
        item.id = index;
        if (item.status == "completed") {
          completed_count ++;
        }
      });
      let init_state = {id: 6, status: "", disease_cd: 0, disease_name: ""};
      if (completed_count == 6) {
        init_state = {id: 6, status: "input", disease_cd: 0, disease_name: ""};
      }
      tmp.push(init_state);
      let disease_combine_name = "";
      tmp.map(item=>{
        if (item.status == "completed") {
          disease_combine_name += item.disease_name;
        }
      });
      if (this.state.suspicion == 1 && disease_combine_name != "") {
        disease_combine_name += "の疑い";
      }
      this.setState({
        input_disease_list: tmp,
        selected_name_number: -1,
        disease_combine_name
      });
    }
  };

  onConsent = () => {
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
  };

  handleKeyPress = e => {
    const keyCode = e.keyCode ? e.keyCode : e.which;
    if (keyCode == 13) {
      this.setState({
        dieaseNameShow: true,
        isLoadData: false
      });
      this.search();
      
    }
  };

  handleDiseaseKeyPressed = (e, disease_id) =>{
    const keyCode = e.keyCode ? e.keyCode : e.which;
    let input_disease_list = this.state.input_disease_list;
    let diseaseName = "";
    input_disease_list.map(item=>{
      if (item.id == disease_id) {
        diseaseName = item.disease_name;
      }
    });
    if (keyCode == 13 && diseaseName != "") {
      this.setState({
        diseaseName,
        isOpenDiseaseInputModal: true,
        selected_name_number: disease_id,
        isLoadData: false
      });
      // this.search();
    }
  }

  search = async () => {
       let path = "/app/api/v2/master/disease/search/disease_name";
       let post_data = {
            word:this.state.diseaseName,
        };
        await axios.post(path, {params: post_data}).
        then((res) => {
          this.setState({ 
            diseaseNameList: res.data, 
            dieaseNameShow: true,
            isLoadData: true
           });
        })
        .catch(() => {
          this.setState(init_state);
        });
  };

  insertMed = medicine => {    
    // this.convertStr(word);
    // this.context.$updateSchIdVal(word);    
    this.setState({
      diseaseName: medicine.name,
      dieaseNameShow: false,
      isOpenDiseaseInputModal: false,
      isLoadData: false,      
    });
  };

  cancelDiseaseSelect = () => {
    this.setState({
      diseaseName: ""
    });
  };

  dieaseNameClose = () => {
    this.setState({ 
      dieaseNameShow: false,
      isOpenDiseaseInputModal: false,
      isLoadData: false,
     });
  };

  getDepartmentName = code => {
    let name = "";
    this.departmentOptions.map(item => {
      if (item.id === parseInt(code)) {
        name = item.value;
      }
    });
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

    getKarteStatus = e => {
      // 入院: no select
      // if (e.target.id == 1) return;
      this.setState({
        karte_status:{name: e.target.value, code: e.target.id}
      });
      // this.context.$updateKarteStatus(e.target.id, e.target.value);
    };

    getExitusReason = e => {
      // 入院: no select
      // if (e.target.id == 1) return;
      // this.context.$updateKarteStatus(e.target.id, e.target.value);
      this.setState({
        exitus_reason:{name: e.target.value, code: e.target.id}
      });
    };

    getEntranceId = () =>{
      // 入院: no select
      let disabledValue = null;
      Karte_status_type.map((item)=>{
        if (item.value == "入院") {
          disabledValue = item.id;
        }
      })
      return disabledValue;
    }

    clearComment = () => {
        this.setState({
          disease_combine_name: "",
          input_disease_list:[
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
          ]
        })
    };

    changeDiseaseInputName = (e, disease_id) => {
        var word = e.target.value;
        word = word.toString().trim();
        let input_disease_list = this.state.input_disease_list;
        input_disease_list.map(item=>{
          if (disease_id == item.id) {
            item.disease_name = word;
          }
        });
        // this.convertStr(word);
        // this.context.$updateSchIdVal(word);
        this.setState({            
            input_disease_list
        });
    };

    changeDiseaseCombineName = (e) => {
        var word = e.target.value;    
        word = word.toString().trim();    
        this.setState({            
            disease_combine_name: word
        });
    };

    setItemName = (disease_item) => {
        let input_disease_list = this.state.input_disease_list;
        let input_index = -1;
        // set input tag to div tag
        input_disease_list.map((item, idx)=>{
          if (this.state.selected_name_number == item.id) {
            item.disease_name = disease_item.name;
            item.status = "completed";
            item.disease_cd = disease_item.disease_cd;
            input_index = idx;
          }
        });
        // set next input focus
        if (input_index >= 0) {
          input_index += 1;
          input_disease_list.map((item, idx)=>{
            if (idx == input_index && item.status != "completed") {
              item.status = "input";
            }
          });
        }
        // make disease combine name
        let disease_combine_name = "";
        input_disease_list.map(item=>{
          if (item.status == "completed") {
            disease_combine_name += item.disease_name;
          }
        });
        if (this.state.suspicion == 1 && disease_combine_name != "") {
          disease_combine_name += "の疑い";
        }
        this.setState({
          isOpenDiseaseInputModal: false,
          selected_name_number: -1,
          input_disease_list,
          disease_combine_name
        });
    };

    closeModal = () => {
        this.setState({
          isOpenDiseaseInputModal: false,          
        });
    };

    closeAlert = () => {
        this.setState({
            showAlert: false
        });
    }


  render() {    
    let noresult = 0;
    if(this.state.diseaseList.disease_list != undefined){
      noresult = this.state.diseaseList.disease_list.length;
    }

    const department = this.departmentOptions.filter(item => {
      return item.id === parseInt(this.state.departmentCode);
    });    

    // let disabledValue = this.getEntranceId();
    let input_list = this.state.input_disease_list.map(item => {
      return (
        <>
          {item.status == "input" ? (
            <div className="disease-input-element">
              <InputKeyWord
                id={'search_input_id'}
                type="text"
                label=""
                onChange={(e)=>this.changeDiseaseInputName(e, item.id)}
                value={item.disease_name}
                onKeyPressed={(e)=>this.handleDiseaseKeyPressed(e, item.id)}
              />
            </div>
          ) : (       
            <>                              
            {item.status == "completed" ? (
              <div className="disease-input-element has-content" onContextMenu={e => this.handleDiseaseClick(e, item.id)}>
                {item.disease_name}
              </div>
            ) : ( 
              <div className="disease-input-element has-content">                
              </div>
            )}
            </>
          )}
        </>
      );
    });
    return (
      <Popup>
        {/*<div className="flex">
          <h2>病名一覧</h2>
        </div>*/}
        <div className="flex">          
          <div className="list-content">
            <table>
              <tr>
                <th>入外</th>
                <th>診療科</th>
                <th>病名</th>
                <th className={'start_date'}>開始日</th>
                <th colSpan="2" className={'end_date'}>転帰日・事由</th>
                <th>主</th>
                <th>医師名</th>
                <th>保険</th>
                <th>承認</th>
                <th>
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
                </th>
              </tr>
              {noresult > 0 ? (
                this.state.diseaseList.disease_list.map(disease => (
                  <tr
                    key={disease.number}
                    onContextMenu={e => this.handleClick(e, disease.number)}
                  >
                    <td>{Karte_status_type[disease.patient_type > 0 ? disease.patient_type : 0].value}</td>
                    <td>{this.getDepartmentName(disease.department_code)}</td>
                    <td>{disease.disease_name}</td>
                    <td>{disease.start_date}</td>
                    <td>{disease.end_date === null ? "" : disease.end_date}</td>
                    <td>{EXITUS_REASON[disease.exitus_reason > 0 ? disease.exitus_reason : 0].value}</td>  
                    <td>{disease.main_diease_name_flag == 1 && "主"}</td>                  
                    <td>
                      {disease.is_doctor_consented !== 2 ? (
                        <>
                          <p>依頼医: {disease.doctor_name}</p>
                          <p>入力者: {disease.created_by_name}</p>
                        </>
                      ) : (
                        <p>{disease.created_by_name}</p>
                      )}
                    </td>
                    <td></td>                    
                    {disease.is_doctor_consented === 0 ? (
                      <td className="center">
                        {this.context.$canDoAction(
                          this.context.FEATURES.DISEASE,
                          this.context.AUTHS.CONFIRM
                        ) ? (
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
                      <td className="center">
                        {disease.is_doctor_consented === 1 && (
                          <span className="black">承認済み</span>
                        )}
                      </td>
                    )}
                    <td></td>
                  </tr>
                ))
              ) : (
                <>
                <tr>
                  <td colSpan="6" className="center">
                    <div className="table-scroll"><div className="no-result"><p>条件に一致する結果は見つかりませんでした。</p></div></div>
                    </td>
                </tr>
                </>
              )}
              {this.context.$canDoAction(
                this.context.FEATURES.DISEASE,
                this.context.AUTHS.CONFIRM
              ) &&
                this.hasConfirmNeeded() && (
                  <tr>
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td />
                    <td className="center">
                      <Button onClick={() => this.onConsent()}>承認</Button>
                    </td>
                  </tr>
                )}
            </table>
            {this.state.isLoaded == false && (
                <div className='center'>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
              </div>
            )}            
          </div>
        </div>
        <div className="flex insert-button">
          <Button onClick={this.register}><Arrow icon={faArrowUp} /> {this.state.btnName}</Button>
        </div>
        <div className="flex">                            
          <div className="input-content">
            <div className="karte-status">
              <SelectorWithLabel
                title=""
                options={Karte_status_type}
                getSelect={this.getKarteStatus}
                value={this.state.karte_status.name}
                departmentEditCode={this.state.karte_status.code}                
              />            
            </div>
            <div className="department-status">
              <SelectorWithLabel
                title=""
                options={this.departmentOptions}
                getSelect={this.getSelect}
                departmentEditCode={this.state.departmentCode}
                value={department[0].name}
              />
            </div>
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
                diseaseEditData={this.state.diseaseEditEndDate == "" ? "" : new Date(this.state.diseaseEditEndDate)}
                error={this.state.errors.end_date}
                handleKeyPress={() => {}}
              />
            </div>
            <div className="disease-start-day">
              <InputWithErrorLabel
                label="開始日"
                type="date"
                getInputText={this.getDiseaseDate}
                diseaseEditData={this.state.diseaseEditDate == "" ? "" : new Date(this.state.diseaseEditDate)}
                error={this.state.errors.start_date}
                handleKeyPress={() => {}}
              />
            </div>
            {/*<InputWithErrorLabel
              label="病名"
              type="text"
              placeholder="病名"
              getInputText={this.getDiseaseName}
              diseaseEditData={this.state.diseaseName}
              error={this.state.errors.disease_name}
              handleKeyPress={this.handleKeyPress}
            />*/}            
          </div>          
        </div>
        <div className="flex">
          <div className="checkbox-content">
            <div className="main-disease">
              <Checkbox
                label="主病名"
                getRadio={this.getRadio.bind(this)}
                value={this.state.main_disease}
                name="main-disease"
              />
            </div>
            <div className="suspicion">
              <Checkbox
                label="疑い"
                getRadio={this.getRadio.bind(this)}
                value={this.state.suspicion}
                name="suspicion"
              />
            </div>
            <div className="ration">
              <Checkbox
                label="自賠"
                getRadio={this.getRadio.bind(this)}
                value={this.state.ration}
                name="ration"
              />
            </div>
            <div className="accident">
              <Checkbox
                label="労災"
                getRadio={this.getRadio.bind(this)}
                value={this.state.accident}
                name="accident"
              />
            </div>
            <div className="insurance">保険:</div>
          </div>          
        </div>
        <div className="flex">
          <div className="disease-name">
            <InputWithLabel
                label=""
                type="text"
                // getInputText={this.getComment.bind(this)}
                // onChange={(e)=>this.changeDiseaseInputName(e, item.id)}
                // getInputText={(e)=>this.changeDiseaseCombineName(e)}
                diseaseEditData={this.state.disease_combine_name}
            />
            <Button className="clear-button" onClick={this.clearComment.bind(this)}>C</Button>
          </div>          
        </div>
        <div className="flex">
          <div className="disease-input">
            {input_list}
          </div>
        </div>
        <ContextMenu {...this.state.contextMenu} parent={this} />
        {this.state.dieaseNameShow ? (
          <DiseaseNameListPopup
            isLoadData={this.state.isLoadData}
            dieaseNameShow={this.state.dieaseNameShow}
            diseaseList={this.state.diseaseNameList}
            insertMed={this.insertMed}
            dieaseNameClose={this.dieaseNameClose}
          />
        ) : (
          ""
        )}
        {this.state.isOpenDiseaseInputModal == true && (          
          <SelectPannelHarukaModal
            selectMaster = {this.setItemName}
            closeModal= {this.closeModal}
            MasterName= {'病名'}
            searchInitName={this.state.diseaseName}
          />
        )}
          {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
              <SystemConfirmModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.confirmOk.bind(this)}
                  confirmTitle= {this.state.confirm_message}
              />
          )}
          {this.state.showAlert == true && (
            <SystemAlertModal
              hideModal= {this.closeAlert}
              handleOk= {this.closeAlert}
              showMedicineContent= {"病名を入力してください。"}
            />
          )}
      </Popup>
    );
  }
}
DiseaseNamePopup.contextType = Context;

DiseaseNamePopup.propTypes = {
  getSelect: PropTypes.func,
  closeModal: PropTypes.func,
  insertMed: PropTypes.func,
  patientId: PropTypes.number
};

export default DiseaseNamePopup;
