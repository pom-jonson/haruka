import React, { Component, useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "~/components/_nano/colors";
import { Modal } from "react-bootstrap";
import Context from "~/helpers/configureStore";
import axios from "axios";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import InputWithErrorLabel from "~/components/molecules/InputWithErrorLabel";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import InputKeyWord from "~/components/molecules/InputKeyWord";
import DiseaseNameListPopup from "~/components/organisms/DiseaseNameListPopup.js";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import Spinner from "react-bootstrap/Spinner";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import { EXITUS_REASON, KARTEMODE, checkSMPByUnicode } from "~/helpers/constants";
import SelectPannelHarukaModal from "~/components/templates/Patient/Modals/Common/SelectPannelHarukaModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import DiseaseNameOutcomeModal from "./DiseaseNameOutcomeModal";
import Radiobox from "~/components/molecules/Radiobox";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as patientApi from "~/helpers/cachePatient-utils";
import UsageTab from "~/components/molecules/UsageTab";
import { getCurrentDate, formatDateLine } from "~/helpers/date";
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import $ from 'jquery';

const SearchUl = styled.ul`
  width: 100%;
  &.nav {
    padding-left: 0px;
  }
  > li > div {
    cursor: pointer;
  }
  li div {
    font-size: 16px;
  }
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
  .disable-add-btn{
    pointer-events: none;
  }
  .disease-all-btn{
    button{
      height: 2rem;
      padding: 4px 8px !important;
      span{
        font-size: 16px;
        line-height: 1rem;
      }
    }
  }
  label{
    font-size:14px;
  }

  .selected{
    background:lightblue;
  }
  .karte_mode_read{
    select, input{
      pointer-events: none;
    }
  }
  .list{
    font-size:14px;
    height:100px;
    width:auto;
    overflow-y:auto;
    border:1px solid;
    cursor:pointer;
    min-width:200px;
    max-width:200px;
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
      padding: 4px 8px !important;
      span{
        font-size: 16px;
        font-weight: normal;
      }
    }
    .cancel-btn:hover {
      border: solid 2px #000000;
      background: #ffffff;
      span {
        color: #000000;
      }
    }
    .cancel-btn {
      background: #ffffff;
      border: solid 2px #7e7e7e;
      span {
        color: #7e7e7e;
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
    margin-bottom: 5px !important;
  }

  .disease-search-label{
    font-size: 1rem;
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
      // margin-top: 20px !important;
      // margin-left: 10px !important;
      // margin-right: 10px !important;
      input{
        height: 2.7rem;
      }
    }
    .disease-input-div{
      margin: auto 10px !important;
      margin-bottom: 20px !important;
    }
    .special-bottom{
      margin-bottom: 0.3rem !important;
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
    .insurance{
      height: 26px;
      line-height: 27px;
    }
  }
  .right-area_1{
    .label-title{
      font-size: 16px !important;
    }
  }
  .checkbox-content{
    label{
      font-size: 16px !important;
    }
    .insurance{
      font-size: 16px !important;
    }
    input{
      top: 2px !important;
    }
  }
  .checkbox-content{
    width: 100%;
    label{
      width: 100px;
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
    .checkbox-area{
      label{
        width:auto;
        margin-right:10px;
      }
    }
    .insurance{
      float: left;
      font-size: 14px;
      // margin-top: 2px;
      width: 50px;
    }
  }
  .disease-name{
    width: 100%;
    border-bottom: 1px solid rgb(221, 221, 221);
    padding: 0.3rem 0;
    display: flex;
    margin-top: 1px;
    div{
      margin-top:0px;
      width: calc(100% - 2.5rem);
      margin-right: 1px;
      label{
        display:none;
      }
      input{
        width: 100%;
        pointer-events: none;
        border: none;
        height: 2rem !important;
      }
    }
    .clear-button {
      width: 2rem;
      height:2rem!important;
      min-width: 2rem !important;
      background-color: buttonface;
      border: 1px solid #7e7e7e;
      line-height:2rem;
      span{
        color:black;
      }
    }
    .clear-button:hover{
      border: solid 2px #7e7e7e;
    }
  }
  .disease-preinput-name{
    width: calc(100% - 10px);
    margin-left: 10px;
    .hvMNwk{
      margin-top:10px;
      width: calc(100% - 41px);
      float: left;
      margin-right: 1px;
      label{
        width: 0px;
      }
      input{
        width: 100%;
        // border: none;
        // border-bottom: 1px solid #ddd;
      }
    }
    input{
      height: 2.3rem !important;
    }
    .clear-button {
      padding: 0px;
      width: 2.3rem;
      min-width: 2.3rem !important;
      margin-top: 10px;
      height: 2.3rem;
      background-color: buttonface;
      border: 1px solid #7e7e7e;
      line-height: 0px;
      span{
        font-size: 1rem;
        font-weight: normal;
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
    .disease-result-day{
      float: left;
      input{
        width: 100px;
      }
      .react-datepicker-popper{
        margin-left: -200px !important;
      }
      .react-datepicker__triangle{
        margin-left: 200px !important;
      }
    }
    .exitus_reason{
      margin-top: 8px;
      float: left;
      select{
        width: 100px;
      }
    }
  }

  .spinner-loading{
    // height: calc( 100vh - 43rem);
    height: calc( 100vh - 39rem);
  }

  .list-content{
    width: 100%;
    margin-top: 5px;
    border: 1px solid #ddd;
    .disease-list-table{
      margin-bottom:0px;
      font-size:1rem;
      thead{
        display:table;
        width: calc(100% - 17px);
      }
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc( 100vh - 43rem);
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
        width:29rem;
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
      .agree{
        width:6rem;
      }
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
    float: left;
    text-align: right;
    width: 70px;
    font-size:14px;
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
    // background-color: rgb(160, 235, 255);
    color: ${colors.surface};
    // color:black;
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
    // width: 90px;
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

  .spinner-disease-loading{
    height: 10rem;
    overflow-y: auto;
    width: calc(100% - 80px);
  }

  .past-disease-body{
    display: block;
    overflow-y: auto;
    height: 10rem;
    width: 100%;
  }

  .search-tab-list{
    .category-tabs{
      li{
        border: 1px solid #7e7e7e;
        border-bottom: none;
        border-right: none;
        div{
          padding: 4px 8px !important;
          background: #ddd;
        }
        .active{
          background: white;
        }
      }
      li:last-child{
        border-right: 1px solid #7e7e7e;
      }
    }
  }
  .tab-list{
    width: calc(100% - 80px);
    padding-bottom: 0.6rem;
    table{
      .search-table-date{
        width: 90px;
      }
      .search-table-department{
        width: 200px;
      }
      .search-disease-item{
        display: table;
        width: 100%;
      }
      .search-disease-item:hover{
        background: rgb(241, 243, 244);
        cursor: pointer;
      }
    }
    .left-area{
      width:70%;
    }
    .right-area{
      width:28%;
      padding-left:10%;
      .list{
        height:40px;
        margin-bottom:0.2rem;
        width:200px;
      }
    }
  }

  .clear-btn{
    min-width: 2rem !important;
    height: 2rem !important;
    padding: 0px !important;
    display: inline-block !important;
    border-radius: 4px !important;
    box-sizing: border-box !important;
    border: 1px solid rgb(126, 126, 126) !important;
    span{
      font-size: 1rem;
      font-weight: normal;
    }
  }
`;

// const SpinnerWrapper = styled.div`
//   justify-content: center;
//   align-items: center;
//   height: 200px;
//   display: flex;
//   // justify-content: center;
//   // align-items: center;
// `;

const SpinnerOtherWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
  // justify-content: center;
  // align-items: center;
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
  departmentCode: "0",
  diseaseName: "",
  diseaseDate: "",
  diseaseList: [],
  diseaseEditDate: "",
  diseaseEndDate: "",
  diseaseEditEndDate: "",
  isOpenDoctorSoapModal: false,
  isOpenClearDiseaseConfirmPopup: false,
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
  preInputName: "",
  selected_name_number: -1,
  btnName: "追加",
  errors: init_errors,
  allChecked: false,
  dieaseNameShow: false,
  isOpenDiseaseInputModal: false,
  diseaseNameList: [],
  confirm_type:'',
  confirm_message:'',
  alert_message:'',
  isDiseaseNameOutcomeModal:false,
  isDeleteConfirmModal:false,
  isAddConfirmModal:false,
  change_flag: 0,
};

const ContextMenu_Freq = ({visible, x, y, type, disease_cd, parent}) => {
  if (visible && parent.enable_add_freq){
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div onClick={() =>parent.FreqDiseaseDo(type, disease_cd)}>
              {type =='add'?'頻用追加':'削除'}
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    )
  } else {
    return null;
  }
}

const ContextMenu = ({ visible, x, y, type, disease_cd, parent, karte_mode }) => {
  if (visible) {
    // karte_mode: 閲覧モードで病名入力制限の修正 => 右クリックメニュー「編集」「削除」が表示されないように
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
            {parent.enable_add_freq && (
              <>
                <li>
                  <div onClick={() =>parent.FreqDiseaseDo('add',disease_cd)}>
                    頻用追加
                  </div>
                </li>
              </>
            )}
          </ul>
        )}
        {type == "" && (
          <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
            {($canDoAction(FEATURES.DISEASE, AUTHS.EDIT) ||
              $canDoAction(FEATURES.DISEASE, AUTHS.EDIT_OLD) ||
              $canDoAction(FEATURES.DISEASE, AUTHS.EDIT_PROXY) ||
              $canDoAction(FEATURES.DISEASE, AUTHS.EDIT_PROXY_OLD)) &&
            karte_mode != true && (
              <li>
                <div
                  onClick={() =>
                    parent.contextMenuAction(
                      "diseaseEdit",
                      parent.state.edit_number
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
              $canDoAction(FEATURES.DISEASE, AUTHS.DELETE_PROXY_OLD)) &&
            karte_mode != true && (
              <li>
                <div
                  onClick={() =>
                    parent.contextMenuAction(
                      "diseaseDelete",
                      parent.state.edit_number
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

const searchTabs = [
  {
    id: 1,
    name: "過去病名参照"
  },
  {
    id: 2,
    name: "キーワード検索"
  },
  {
    id: 3,
    name: "目 次 検 索"
  },
  {
    id: 4,
    name: "科 別 頻 用"
  },
  {
    id: 5,
    name: "医 師 別 頻 用"
  },
  {
    id: 6,
    name: "フリー入力"
  }
];

class DiseaseNameModal extends Component {
  constructor(props) {
    super(props);
    let conf_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data");
    this.state = init_state;
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.departmentOptions.unshift({id: 0, value:"全科"});
    this._configPreInputName = conf_data.wordpro_name;
    this.isPreInputName = 0; // フリー入力
    this.input_state_number = 0;
    this.detailedPatientInfo = undefined;
    let html_obj = document.getElementsByTagName("html")[0];
    let width = html_obj.offsetWidth;
    let tbody_height = 'calc( 100vh - 39rem)';

    let screen_zoom = screen.deviceXDPI / screen.logicalXDPI;    

    if(parseInt(width) < 1281){
      tbody_height = 'calc( 100vh - 50rem)';
    } else if(parseInt(width) < 1367){
      tbody_height = 'calc( 100vh - 43rem)';
    } else if(parseInt(width) < 1441){
      tbody_height = 'calc( 100vh - 42rem)';
    } else if(parseInt(width) < 1601){
      tbody_height = 'calc( 100vh - 41rem)';
    } else if(parseInt(width) < 1681){
      tbody_height = 'calc( 100vh - 40rem)';
    } else if(parseInt(width) > 1919){
      tbody_height = 'calc( 100vh - 39rem)';
      if(screen_zoom == 1.5) {
        tbody_height = 'calc( 100vh - 50rem)';
      }
    }
    this.state.tbody_height = tbody_height;
    this.karte_mode = KARTEMODE.READ;

    this.consentedDiseaseCount = 0;

    // ●YJ884 薬剤検索時に依頼医選択が割り込んだ時に、クリックで選ぶと検索はキャンセルされた扱いになる
    this.act_msg = "";
  }
  
  getDoctor = e => {
    let department_name = "その他";
    this.state.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(e.target.id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(e.target.id, e.target.getAttribute("label"), department_name);
    this.setState({
      isOpenDoctorSoapModal: false,
    },()=>{
      // ●YJ884 薬剤検索時に依頼医選択が割り込んだ時に、クリックで選ぶと検索はキャンセルされた扱いになる
      if (this.act_msg == "register") {
        this.register();
      } else if (this.act_msg == "delete") {
        this.contextMenuAction("diseaseDelete")
      } else if (this.act_msg == "edit") {
        this.contextMenuAction("diseaseEdit")
      }      
      this.act_msg = "";
    });
    
  }
  
  closeDoctorModal = () => {
    this.act_msg = ""
    this.setState({
      isOpenDoctorSoapModal: false
    });
  }
  
  getDoctorsList = async () => {
    let data = sessApi.getDoctorList();
    if(data == null) {
      data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    }
    this.setState({ doctors: data });
  }
  
  updateDiseasesList = async (_flag=null, _msg=null) => {
    const { data } = await axios.get(
      "/app/api/v2/disease_name/search_in_patient",
      {
        params: {
          systemPatientId: this.props.patientId
        }
      }
    );
    
    // 病名禁忌
    if (_flag == "cache_set") {
      patientApi.setVal(this.props.patientId, CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE_API, 1);
    }
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

    obj["diseaseList"] = disease_list_result;
    Object.assign(update_state, obj);
    update_state.input_disease_list = input_disease_list;
    if ((this.state.diseaseEditEndDate != null && this.state.diseaseEditEndDate !='')){
      update_state.end_date = 1;
    }
    update_state.isLoaded = true;
    update_state.diseaseDate = this.getCurrentDate();
    update_state.diseaseEditDate = this.getCurrentDate();

    // ■YJ794 病名・病名一括転帰モーダルの重さ・描画の修正
    if (_msg != null && _msg != "") {
      update_state.showAlert = true;
      update_state.alert_message = _msg;
    }

    // ●YJ794 病名・病名一括転帰モーダルの重さ・描画の修正
    this.consentedDiseaseCount = 0;
    this.consentedDiseaseCount = this.getConsentedDiseaseCount(disease_list_result.disease_list);

    this.act_msg = "";

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
  
  searchDiseaseCategories = async() => {
    await axios.post(
      "/app/api/v2/master/disease/search/disease_categories",
      {
        params: {
        }
      }
    ).then((res) => {
      this.category_1_data = res.data.category_1_data;
      this.disease_1_master_data = res.data.disease_1_master_data;
      this.disease_3_master_data = res.data.disease_3_master_data;
      this.setState({
        dispaly_category_1_data:res.data.category_1_data,
        prefix_data:res.data.disease_1_master_data,
        suffix_data:res.data.disease_3_master_data,
      });
    });
  }
  
  searchDiseasesDepartment = async() => {
    await axios.post(
      "/app/api/v2/master/disease/search/disease_department",
      {
        params: {
          department_code:parseInt(this.state.departmentCode),
        }
      }
    ).then((res) => {
      this.department_category_data = res.data.department_category_data;
      this.department_category_disease_data = res.data.department_category_disease_data;
      
      this.setState({
        dispaly_department_category_data:res.data.department_category_data,
        display_department_category_disease_data:[],
        selected_department_category_id:undefined,
      });
    });
  }
  
  searchDoctorFreqDiseases = async() => {
    await axios.post(
      "/app/api/v2/master/disease/search/freq_disease",
      {
        params: {
          doctor_number:parseInt(this.doctor_code),
        }
      }
    ).then((res) => {
      this.setState({
        freq_diseases:res.data.freq_diseases,
      });
    });
  }
  
  async componentDidMount() {
    // eslint-disable-next-line consistent-this
    const that = this;
    $(document).ready(function() {
      $(window).resize(function() {
        let html_obj = document.getElementsByTagName("html")[0];
        let width = html_obj.offsetWidth;
        let tbody_height = 'calc( 100vh - 39rem)';
        if(parseInt(width) < 1367){
          tbody_height = 'calc( 100vh - 43rem)';
        } else if(parseInt(width) < 1441){
          tbody_height = 'calc( 100vh - 42rem)';
        } else if(parseInt(width) < 1601){
          tbody_height = 'calc( 100vh - 41rem)';
        } else if(parseInt(width) < 1681){
          tbody_height = 'calc( 100vh - 40rem)';
        } else if(parseInt(width) > 1919){
          tbody_height = 'calc( 100vh - 39rem)';
        }
        
        that.setState({
          tbody_height
        });
      });
    });
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let conf_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data");
    this.doctor_code = authInfo.staff_category == 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    this.consented_doctor_frequent_disease_enable = conf_data.consented_doctor_frequent_disease_enable;
    this.enable_add_freq = false;
    if (authInfo.staff_category == 1){
      this.enable_add_freq = true;
    } else {
      if (this.consented_doctor_frequent_disease_enable == 'ON' && this.context.selectedDoctor.code > 0) {
        this.enable_add_freq = true;
      }
    }
    // check insurance info
    if (this.props.detailedPatientInfo == undefined || this.props.detailedPatientInfo == null) {
      await this.getInsuranceInfo();
    }
    this.setInsuranceCheckBox();
    this.searchDiseaseCategories();
    this.searchDiseasesDepartment();
    this.searchDoctorFreqDiseases();
    this.karte_mode = this.context.$getKarteMode(this.props.patientId);
    let search_tab = this.karte_mode == KARTEMODE.READ ? 2 : 1;   // 「閲覧のみ」を選択した場合
    
    // ■1083-3 看護計画の作成 => [ワープロ登録]ボタンクリック処理
    // 【病名】画面を表示する。表示する際、「フリー入力」タブを選択状態にする。
    if (this.props.initTab != undefined && this.props.initTab != null) {
      if (this.props.initTab == "フリー入力") {
        search_tab = 6;
      } else if(this.props.initTab == "過去病名参照"){
        search_tab = 1;
      }
    }
    
    this.setState({
      end_date:0,
      department:1,
      diseaseList:[],
      allChecked: false,
      isOpenClearDiseaseConfirmPopup: false,
      diseaseDate: this.getCurrentDate(),
      diseaseEditDate: this.getCurrentDate(),
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
      preInputName: "",
      selected_name_number: -1,
      btnName: "追加",
      errors: init_errors,
      dieaseNameShow: false,
      isOpenDiseaseInputModal: false,
      diseaseNameList: [],
      confirm_type:'',
      confirm_message:'',
      alert_message:'',
      isLoaded: false,
      search_tab: search_tab,
      selected_disease: {},
      
      dispaly_category_2_data:[],
      dispaly_category_3_data:[],
      display_disease_master_data:[],
      selected_suffix_cd:undefined,
      selected_perfix_cd:undefined,
      change_flag: 0,
    },async()=>{
      await this.updateDiseasesList();
      await this.getDoctorsList();
    });
  }
  
  getInsuranceInfo = async () => {
    if (this.props.patientId > 0) {
      let data = await axios.get("/app/api/v2/karte/patient_datailed", {
        // パラメータ
        params: {
          systemPatientId: this.props.patientId
        }
      });
      this.detailedPatientInfo = data.data;
    }
  }
  
  
  setInsuranceCheckBox = () => {
    /*=============
    病名の保険に「併用自賠」チェックボックスを追加してください。
    Jで始まるもののうち2種だけ、下記のように併用自賠の判定用になります。
    ●自賠関連の判定の優先順序1
    ・患者の有効な保険情報にJ0またはJ9があれば「併用自賠」チェックボックスが使用可能。
    ・病名の保険情報3つのなかにJ0またはJ9があれば「併用自賠」チェックボックスがオン。
    ●自賠関連の判定の優先順序2（J0とJ9が除外される以外は今の自賠と同じ）
    ・患者の有効な保険情報で、上記（J0,J9）以外のJまたはZで始まるものがあれば「自賠」チェックボックスが使用可能
    ・病名の保険情報3つのなかに、上記（J0,J9）以外のJまたはZで始まるものがあれば「自賠」チェックボックスがオン。
    つまり、Jで始まるものがJ0かJ9のみなら「自賠」はオンにならない状態です。
    ●労災の判定（現在と同じ）
    ・患者の有効な保険情報で、Rで始まるものがあれば「労災」チェックボックスが使用可能
    ・病名の保険情報3つのなかに、Rで始まるものがあれば「労災」チェックボックスがオン。

    =================*/
    let patient_insurance = [];
    if (this.props.detailedPatientInfo != null && this.props.detailedPatientInfo != undefined) {
      patient_insurance = this.props.detailedPatientInfo.insurance;
    } else if(this.detailedPatientInfo != null && this.detailedPatientInfo != undefined) {
      patient_insurance = this.detailedPatientInfo.insurance;
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
  
  getSelect = e => {
    this.setChangeFlag(1);

    this.setState({
      departmentCode: e.target.id
    }, () => {
      this.searchDiseasesDepartment();
    });
  };
  
  getDiseaseName = e => {
    this.setState({
      diseaseName: e.target.value
    });
  };
  
  getDiseaseDate = value => {
    this.setChangeFlag(1);

    this.setState({ diseaseDate: value, diseaseEditDate: value });
  };
  
  getDiseaseEndDate = value => {
    this.setChangeFlag(1);

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
    if (this.karte_mode === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    if (this.state.search_tab == 6 && this.state.preInputName.length > 50){
      this.setState({
        alert_message: '病名は50文字以内で入力してください。',
        showAlert: true
      });
      return;
    }
    if (this.state.search_tab == 6 && this.state.preInputName != "" && checkSMPByUnicode(this.state.preInputName)){
      this.setState({
        alert_message: '病名に印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください。',
        showAlert: true
      });
      return;
    }
    if (this.state.disease_combine_name.length > 50){
      this.setState({
        alert_message: '病名は50文字以内で入力してください。',
        showAlert: true
      });
      return;
    }
    let canEdit = 0;
    if (this.state.btnName == "追加") {
      if (this.context.$canDoAction(this.context.FEATURES.DISEASE,this.context.AUTHS.REGISTER) ||
        this.context.$canDoAction(this.context.FEATURES.DISEASE,this.context.AUTHS.REGISTER_OLD)) {
        canEdit = 1;
      }
      if (this.context.$canDoAction(this.context.FEATURES.DISEASE, this.context.AUTHS.REGISTER_PROXY) ||
        this.context.$canDoAction(this.context.FEATURES.DISEASE,this.context.AUTHS.REGISTER_PROXY_OLD)) {
        canEdit = 2;
      }
    } else {
      // Edit
      if (this.context.$canDoAction(this.context.FEATURES.DISEASE,this.context.AUTHS.EDIT) ||
        this.context.$canDoAction(this.context.FEATURES.DISEASE,this.context.AUTHS.EDIT_OLD)) {
        canEdit = 1;
      }
      if (this.context.$canDoAction(this.context.FEATURES.DISEASE,this.context.AUTHS.EDIT_PROXY) ||
        this.context.$canDoAction(this.context.FEATURES.DISEASE,this.context.AUTHS.EDIT_PROXY_OLD)) {
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
        // this.context.$selectDoctor(true);
        this.setState({
          isOpenDoctorSoapModal: true,
        });
        this.act_msg = "register";
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

    // ■YJ892 病名モーダルで新規入力中や編集中に閉じるボタンを押したときは破棄確認を出すように
    if (this.state.confirm_type == "cancel_edit" || this.state.confirm_type == "cancel_input") {
      this.props.closeModal();
    }


    var diseaseData = {};
    var diseaseDateStr = this.getDateString(this.state.diseaseDate);
    var diseaseEndDateStr = this.getDateString(this.state.diseaseEndDate);
    let op_type = "";
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let insurance_types = null;
    if (this.props.detailedPatientInfo != null && this.props.detailedPatientInfo != undefined) {
      insurance_types = this.props.detailedPatientInfo.insurance;
    } else if(this.detailedPatientInfo != null && this.detailedPatientInfo !=undefined) {
      insurance_types = this.detailedPatientInfo.insurance;
    }
    
    /*============
    ●入外区分:patient_typeカラム定数シートを参照
    ●病名の入力
    7つの入力欄は、
    現状の病名と同様に、Enterで検索して病名の候補を表示。病名を選ぶと欄に選択した病名を表示して、次の欄にフォーカス
    繋いだものを別に表示するので、7つのinputは長い病名は見切れてOK
    右クリックメニュー「再検索」で、inputに戻して検索しなおせるように。編集状態で空にしてEnterでは下記削除と同じ
    右クリックメニュー「削除」で、左に詰めて、右端に欄を追加（レコードとしてはname1～7は左から詰める）
    レコードの保存は、文字列ではなくなり、disease1～4テーブルのdisease_cdを、name1～name7カラムに保存。（8や9は不使用）
    禁忌薬剤の検索などに利用するため、disease_nameカラムには、結合後の病名文字列も保存します。
    ●病名終了日→転帰日に項目名を変更。
    ●病名終了日がある場合は「転帰事由」プルダウンが選択必須。exitus_reasonカラム。定数シートを参照

    ●「労災」と「自賠」
    ・その患者の保険情報で、「保険区分」がRで始まるものがある場合、「労災」チェックボックスが使用可能になる
    ・その患者の保険情報で、「保険区分」がJまたはZで始まるものがある場合、「自賠」チェックボックスが使用可能になる
    ・チェックが入っていれば、該当する保険区分（複数ある場合先頭のものでOK）をinsurance_type1～3にセット
    （3つまで保存できる同じ目的のカラムなので、単に1つなら1に、2つなら1と2に、前から詰める）
    ●「主病名」main_disease_name_flagカラム
    ●「疑い」チェックボックスはdoubt_flagカラム1の場合,マスタ項目を繋いだ病名の最後に「の疑い」をつける
    ●診療科プルダウンは、値0として、未選択ではなく「全科」をデフォルト値にする

    ●登録のキューに関しては、app/admin_s/disease_name_t2/insert.phpなどを参考にしてください。診療情報とは別のクラスになります。
    ●disease_name_numberカラムは、連携先システムに対して編集・削除を行うためのキーです。
    "
    "●一覧への表示
    ・入外区分patient_type

    ・病名は、文字列ではなくname1～name7に該当する病名マスタのレコードの名前を繋ぎ、疑い病名（doubt_flag）が1なら末尾に「の疑い」をつける
    ・「主」main_diease_name_flag 主病名フラグ1なら○を表示

    ・終了日は「転帰日」にラベルを変更
    ・転帰事由 exitus_reason0の場合は「継続」と表示せずに空欄にする
    ・保険
    insurance_type1～3に,1文字目がRのものがあれば「労災」と表示
    insurance_type1～3に,1文字目がJまたはZの物があれば「自賠」と表示"
    "●病名マスタ検索結果は「選択パネル」形式に変更
    ・inputでEnterを押した際のキーワードが初期入力されている状態に




    --------------- // ---------------

    ●「労災」と「自賠」
    ・その患者の保険情報で、「保険区分」がRで始まるものがある場合、「労災」チェックボックスが使用可能になる
    ・その患者の保険情報で、「保険区分」がJまたはZで始まるものがある場合、「自賠」チェックボックスが使用可能になる
    ・チェックが入っていれば、該当する保険区分（複数ある場合先頭のものでOK）をinsurance_type1～3にセット
    （3つまで保存できる同じ目的のカラムなので、単に1つなら1に、2つなら1と2に、前から詰める）

    ・有無の判定で1つずつセットするという点はその通りです。
    ・併用自賠だと2桁なのは今の状態で正しいので、「R4・01・R0・Z1・J9」の場合、「R、Z、J9」になります
    ・仮に「R4・01・R0・J1・Z1・J0・J9」なら「R・J・J0」
    ===============*/
    let insurance_type_1 = null;
    let insurance_type_2 = null;
    let insurance_type_3 = null;
    let first_letter_accident = "";
    let first_letter_ration = "";
    let first_letter_disease_ration = "";
    
    if (this.state.accident == 1) {
      // 労災
      first_letter_accident = "accident";
    }
    if (this.state.ration == 1) {
      // 自賠
      first_letter_ration = "ration";
    }
    if (this.state.disease_ration == 1) {
      // 併用自賠
      first_letter_disease_ration = "disease_ration";
    }
    let r_flag = false;
    let j_z_flag = false;
    let j0_j9_flag = false;
    if (insurance_types != null && insurance_types != undefined && insurance_types.length > 0) {
      insurance_types.map(item=>{
        if (first_letter_accident == "accident" && item.insurance_type.substring(0, 1) == "R" && r_flag == false) {
          r_flag = true;
          if (insurance_type_1 == null) {
            insurance_type_1 = item.insurance_type;
          } else if(insurance_type_2 == null) {
            insurance_type_2 = item.insurance_type;
          } else if(insurance_type_3 == null) {
            insurance_type_3 = item.insurance_type;
          }
        }
      });
      
      insurance_types.map(item=>{
        if (first_letter_ration == "ration" && (item.insurance_type.substring(0, 1) == "J" || item.insurance_type.substring(0, 1) == "Z")) {
          if (item.insurance_type != "J0" && item.insurance_type != "J9" && j_z_flag == false) {
            j_z_flag = true;
            if (insurance_type_1 == null) {
              insurance_type_1 = item.insurance_type;
            } else if(insurance_type_2 == null) {
              insurance_type_2 = item.insurance_type;
            } else if(insurance_type_3 == null) {
              insurance_type_3 = item.insurance_type;
            }
          }
        }
      });
      
      insurance_types.map(item=>{
        if (first_letter_disease_ration == "disease_ration" && (item.insurance_type == "J0" || item.insurance_type == "J9") && j0_j9_flag == false) {
          j0_j9_flag = true;
          if (insurance_type_1 == null) {
            insurance_type_1 = item.insurance_type;
          } else if(insurance_type_2 == null) {
            insurance_type_2 = item.insurance_type;
          } else if(insurance_type_3 == null) {
            insurance_type_3 = item.insurance_type;
          }
        }
      });
      
      // let insurance_type_R = insurance_types.filter(item=>{
      //   if (first_letter_flag == "") {
      //     return false;
      //   } else if (first_letter_flag == "accident") {
      //     if (item.insurance_type.substring(0, 1) == "R") {
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   } else if (first_letter_flag == "ration") {
      //     if (item.insurance_type.substring(0, 1) == "J" || item.insurance_type.substring(0, 1) == "Z") {
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   } else {
      //     return false;
      //   }
      // });
      // if (insurance_type_R != null && insurance_type_R != undefined && insurance_type_R.length > 0) {
      //   if (insurance_type_R[0] != null && insurance_type_R[0] != undefined) {
      //     insurance_type_1 = insurance_type_R[0].insurance_type;
      //   }
      //   if (insurance_type_R[1] != null && insurance_type_R[1] != undefined) {
      //     insurance_type_2 = insurance_type_R[1].insurance_type;
      //   }
      //   if (insurance_type_R[2] != null && insurance_type_R[2] != undefined) {
      //     insurance_type_3 = insurance_type_R[2].insurance_type;
      //   }
      // }
    }
    if(this.state.confirm_type === 'add'){
      op_type = "add";
      let disease_names = this.state.input_disease_list;
      diseaseData = {
        disease: {
          system_patient_id: this.props.patientId,
          // disease_name: this.state.diseaseName,
          disease_name: this.state.disease_combine_name,
          department_code: this.state.departmentCode,
          start_date: diseaseDateStr,
          end_date: diseaseEndDateStr,
          disiease_name_list: this.state.input_disease_list,
          // is_doctor_consented: this.context.staff_category === 1 ? 2 : 0,
          created_by: authInfo.user_number,
          disease_combine_name: this.state.disease_combine_name,
          karte_status: this.state.karte_status.code,
          exitus_reason: this.state.exitus_reason.code,
          main_disease: this.state.main_disease,
          confidentiality: this.state.confidentiality,
          ration: this.state.ration,
          disease_ration: this.state.disease_ration,
          suspicion: this.state.suspicion,
          accident: this.state.accident,
          insurance_type_1: insurance_type_1,
          insurance_type_2: insurance_type_2,
          insurance_type_3: insurance_type_3,
          name_1 : this.isPreInputName == 1 ? 0 : disease_names[0].disease_cd,
          name_2 : this.isPreInputName == 1 ? 0 : disease_names[1].disease_cd,
          name_3 : this.isPreInputName == 1 ? 0 : disease_names[2].disease_cd,
          name_4 : this.isPreInputName == 1 ? 0 : disease_names[3].disease_cd,
          name_5 : this.isPreInputName == 1 ? 0 : disease_names[4].disease_cd,
          name_6 : this.isPreInputName == 1 ? 0 : disease_names[5].disease_cd,
          name_7 : this.isPreInputName == 1 ? 0 : disease_names[6].disease_cd,
          wordpro_disease_name_type: this.isPreInputName,
          wordpro_disease_name: this.state.preInputName,
          wordpro_disease_name_flag: this._configPreInputName,
          doctor_code:
            authInfo.doctor_code == 0
              ? parseInt(this.context.selectedDoctor.code)
              : parseInt(authInfo.doctor_code)
        }
      };
    } else if(this.state.confirm_type === 'disease_delete') {
      let wordpro_disease_name_type = 0;
      this.state.diseaseList.disease_list.map(disease => {
        if (disease.number == this.state.edit_number) {
          wordpro_disease_name_type = disease.wordpro_disease_name_type;
        }
      });
      const diseaseData = {
        disease: {
          system_patient_id: this.props.patientId,
          number: this.state.edit_number,
          wordpro_disease_name_flag: this._configPreInputName,
          wordpro_disease_name_type: wordpro_disease_name_type
        }
      };
      this.deleteOfDiseaseData(diseaseData);
      this.setState({
        diseaseNum: ""
      });
      return;
    } else if (this.state.confirm_type === 'disease_edit'){
      this.state.diseaseList.disease_list.map(disease => {
        if (disease.number == this.state.edit_number) {
          if (disease.name1 == null && disease.wordpro_disease_name_type != 1) {
            this.setState({
              showAlert: true,
              alert_message: "過去データのため編集できません。"
            });
          } else if(disease.wordpro_disease_name_type == 1 && this._configPreInputName == 0) {
            this.setState({
              showAlert: true,
              alert_message: "フリー入力病名が無効に設定されているため編集できません"
            });
          } else {
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
            input_disease_list.map((item, index)=>{
              if (init_input_tag == -1 && item.status != "completed") {
                init_input_tag = 1;
                item.status = "input";
                this.input_state_number = index;
              }
            });
            let insurace_type_accident = null;
            let insurace_type_ration = null;
            let insurace_type_disease_ration = null;
            // 労災チェックボックス
            if (disease.insurance_type1 != null && disease.insurance_type1.substring(0, 1) == "R") {
              insurace_type_accident = "accident";
            }
            // 自賠チェックボックス
            if (disease.insurance_type1 != null && ((disease.insurance_type1.substring(0, 1) == "J" && disease.insurance_type1 != "J0" && disease.insurance_type1 != "J9") || disease.insurance_type1.substring(0, 1) == "Z")) {
              insurace_type_ration = "ration";
            }
            if (disease.insurance_type2 != null && ((disease.insurance_type2.substring(0, 1) == "J" && disease.insurance_type2 != "J0" && disease.insurance_type2 != "J9") || disease.insurance_type2.substring(0, 1) == "Z")) {
              insurace_type_ration = "ration";
            }
            if (disease.insurance_type3 != null && ((disease.insurance_type3.substring(0, 1) == "J" && disease.insurance_type3 != "J0" && disease.insurance_type3 != "J9") || disease.insurance_type3.substring(0, 1) == "Z")) {
              insurace_type_ration = "ration";
            }
            // 併用自賠チェックボックス
            if (disease.insurance_type1 != null && (disease.insurance_type1 == "J0" || disease.insurance_type1 == "J9")) {
              insurace_type_disease_ration = "disease_ration";
            }
            if (disease.insurance_type2 != null && (disease.insurance_type2 == "J0" || disease.insurance_type2 == "J9")) {
              insurace_type_disease_ration = "disease_ration";
            }
            if (disease.insurance_type3 != null && (disease.insurance_type3 == "J0" || disease.insurance_type3 == "J9")) {
              insurace_type_disease_ration = "disease_ration";
            }
            let set_state = {
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
              selected_perfix_cd:input_disease_list[0].disease_cd,
              selected_suffix_cd:this.input_state_number>0?input_disease_list[this.input_state_number-1].disease_cd:undefined,
              main_disease: disease.main_diease_name_flag,
              confidentiality: disease.confidentiality_flag,
              ration: this.state.canRation == false && insurace_type_ration == "ration" ? 1 : 0,
              disease_ration: this.state.canDiseaseRation == false && insurace_type_disease_ration == "disease_ration" ? 1 : 0,
              suspicion: disease.doubt_flag,
              accident: this.state.canAccident == false && insurace_type_accident == "accident" ? 1 : 0,
              disease_combine_name: disease.disease_name,
              btnName: "変更",
              errors: init_errors,
              confirm_message:''
            };
            this.editOriginData = {
              departmentCode: disease.department_code,
              diseaseName: disease.disease_name,
              diseaseEditDate: disease.start_date,
              diseaseDate: disease.start_date,
              diseaseEndDate: disease.end_date,
              diseaseEditEndDate: disease.end_date,
              diseaseNum: disease.number,
              karte_status,
              exitus_reason,
              input_disease_list:JSON.parse(JSON.stringify(input_disease_list)),
              selected_perfix_cd:JSON.parse(JSON.stringify(input_disease_list))[0].disease_cd,
              selected_suffix_cd:this.input_state_number>0?JSON.parse(JSON.stringify(input_disease_list))[this.input_state_number-1].disease_cd:undefined,
              main_disease: disease.main_diease_name_flag,
              confidentiality: disease.confidentiality_flag,
              ration: this.state.canRation == false && insurace_type_ration == "ration" ? 1 : 0,
              disease_ration: this.state.canDiseaseRation == false && insurace_type_disease_ration == "disease_ration" ? 1 : 0,
              suspicion: disease.doubt_flag,
              accident: this.state.canAccident == false && insurace_type_accident == "accident" ? 1 : 0,
              disease_combine_name: disease.disease_name,
              btnName: "変更",
              errors: init_errors,
              confirm_message:''
            };            
            this.isPreInputName = 0;
            if (disease.wordpro_disease_name_type == 1) {
              this.isPreInputName = 1;
              set_state.search_tab = 6;
              set_state.preInputName = disease.wordpro_disease_name;
            }
            this.setState(set_state);
          }
        }
      });
      return;
    } else {
      op_type = "update";
      let disease_names = this.state.input_disease_list;
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      var selected_disease = this.state.selected_disease;
      if (selected_disease.disease_name == this.state.disease_combine_name &&
        selected_disease.department_code == this.state.departmentCode &&
        this.getDateString(selected_disease.start_date) == diseaseDateStr &&
        this.getDateString(selected_disease.end_date) == diseaseEndDateStr &&
        selected_disease.exitus_reason == this.state.exitus_reason.code &&
        selected_disease.main_diease_name_flag == this.state.main_disease &&
        selected_disease.doubt_flag == this.state.suspicion &&
        selected_disease.confidentiality_flag == this.state.confidentiality &&
        // selected_disease.ration == this.state.ration &&
        // selected_disease.confidentiality == this.state.confidentiality &&
        selected_disease.patient_type == this.state.karte_status.code
      ){
        this.setState({alert_message:'変更内容がありません。', showAlert:true})
        return;
      }
      diseaseData = {
        disease: {
          number: this.state.diseaseNum,
          system_patient_id: this.props.patientId,
          // disease_name: this.state.diseaseName,
          disease_name: this.state.disease_combine_name,
          department_code: this.state.departmentCode,
          start_date: diseaseDateStr,
          end_date: diseaseEndDateStr,
          is_doctor_consented: authInfo.staff_category === 1 ? 2 : 0,
          disiease_name_list: this.state.input_disease_list,
          disease_combine_name: this.state.disease_combine_name,
          karte_status: this.state.karte_status.code,
          exitus_reason: this.state.exitus_reason.code,
          main_disease: this.state.main_disease,
          confidentiality: this.state.confidentiality,
          ration: this.state.ration,
          disease_ration: this.state.disease_ration,
          suspicion: this.state.suspicion,
          accident: this.state.accident,
          insurance_type_1: insurance_type_1,
          insurance_type_2: insurance_type_2,
          insurance_type_3: insurance_type_3,
          name_1 : this.isPreInputName == 1 ? 0 : disease_names[0].disease_cd,
          name_2 : this.isPreInputName == 1 ? 0 : disease_names[1].disease_cd,
          name_3 : this.isPreInputName == 1 ? 0 : disease_names[2].disease_cd,
          name_4 : this.isPreInputName == 1 ? 0 : disease_names[3].disease_cd,
          name_5 : this.isPreInputName == 1 ? 0 : disease_names[4].disease_cd,
          name_6 : this.isPreInputName == 1 ? 0 : disease_names[5].disease_cd,
          name_7 : this.isPreInputName == 1 ? 0 : disease_names[6].disease_cd,
          wordpro_disease_name_type: this.isPreInputName,
          wordpro_disease_name: this.state.preInputName,
          wordpro_disease_name_flag: this._configPreInputName,
          updated_by: authInfo.user_number,
          doctor_code:
            authInfo.doctor_code == 0
              ? parseInt(this.context.selectedDoctor.code)
              : parseInt(authInfo.doctor_code)
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
        showAlert: true,
        alert_message: "病名を入力してください。",
        diseaseNum: ""
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
        this.isPreInputName = 0;
        this.input_state_number = 0;
        // window.sessionStorage.setItem("alert_messages", "登録しました。");        
        this.updateDiseasesList("cache_set", "登録しました。");        
      } else {
        this.upDateErrors(data.errors); // filed
      }
    });
  };
  
  updateOfDiseaseData = async diseaseData => {
    const { data } = await axios.post(
      "/app/api/v2/disease_name/update",
      diseaseData
    );
    this.setState({
      isLoaded: false,
    }, ()=>{
      if (data.status == "ok") {
        this.isPreInputName = 0;
        this.input_state_number = 0;
        // window.sessionStorage.setItem("alert_messages", "変更しました。");        
        this.updateDiseasesList("cache_set", "変更しました。");        
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
        this.isPreInputName = 0;
        // window.sessionStorage.setItem("alert_messages", "削除しました。");        
        this.updateDiseasesList("cache_set", "削除しました。");        
      }
    });
  };
  
  handleClick(e, diseaseNum, disease) {
    this.setState({ edit_number: diseaseNum, selected_disease:disease });
    
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
          x: e.clientX - 80,
          y: e.clientY - 90,
          type: ""
        },
        contextMenu_freq:{visible:false}
      });
    }
  }
  handleDiseaseClick(e, disease_id, disease_cd) {
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
          x: e.clientX - 80,
          y: e.clientY - 90,
          disease_cd,
          type: "disease_input"
        },
        contextMenu_freq:{visible:false}
      });
    }
  }
  
  handleListDiseaseClick (e, disease_cd, type='add') {
    if (e.type === "contextmenu") {
      e.preventDefault();
      
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({
          contextMenu_freq: { visible: false }
        });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu_freq: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      
      this.setState({
        contextMenu_freq: {
          visible: true,
          x: e.clientX - 80,
          y: e.clientY - 90,
          type: type,
          disease_cd,
        },
        contextMenu:{visible:false}
      });
    }
  }
  
  FreqDiseaseDo = (act, disease_cd) => {
    if (act == 'add'){
      this.setState({
        isAddConfirmModal:true,
        confirm_message:'この病名を追加しますか？',
        freq_disease_cd:disease_cd,
      });
    }
    if (act == 'delete'){
      this.setState({
        isDeleteConfirmModal:true,
        freq_disease_cd:disease_cd,
        confirm_message:'この病名を削除しますか?'
      });
    }
  }
  
  addFreqDisease = async() => {
    let path = "/app/api/v2/master/disease/add_freq_disease";
    let post_data = {
      disease_cd:this.state.freq_disease_cd,
      doctor_number:this.doctor_code
    };
    await axios.post(path, {params: post_data}).then((res) => {
      this.searchDoctorFreqDiseases();
      window.sessionStorage.setItem("alert_messages", res.data.alert_message);
    });
    this.confirmCancel();
  }
  
  deleteFreqDisease = async() => {
    let path = "/app/api/v2/master/disease/delete_freq_disease";
    let post_data = {
      disease_cd:this.state.freq_disease_cd,
      doctor_number:this.doctor_code
    };
    await axios.post(path, {params: post_data}).then((res) => {
      this.searchDoctorFreqDiseases();
      window.sessionStorage.setItem("alert_messages", res.data.alert_message);
    });
    this.confirmCancel();
  }
  
  contextMenuAction = (act, diseaseNum) => {
    if (this.karte_mode === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    
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
          // this.context.$selectDoctor(true);
          this.setState({
            isOpenDoctorSoapModal: true,
          });
          this.act_msg = "delete";          
          return;
        }
      }
      
      // const diseaseData = {
      //   disease: {
      //     system_patient_id: this.props.patientId,
      //     number: diseaseNum
      //   }
      // };
      
      // if (confirm("削除して良いですか？")) {
      //   this.deleteOfDiseaseData(diseaseData);
      // }
      this.setState({
        confirm_message: "病名を削除しますか？",
        confirm_type: "disease_delete"
      });
    } else if (act === "diseaseEdit") {
      let canEdit = 0;
      // Delete
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
      
      if (canEdit === 0) {
        window.sessionStorage.setItem("alert_messages", "権限がありません。");
        // alert("権限がありません。");
        return;
      }
      
      if (canEdit === 2) {
        if (this.context.selectedDoctor.code === 0) {
          // this.context.$selectDoctor(true);
          this.setState({
            isOpenDoctorSoapModal: true,
          });
          this.act_msg = "edit";
          return;
        }
      }
      
      this.setState({
        confirm_message: "病名を編集しますか？",
        confirm_type: "disease_edit"
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
      if(this.input_state_number>0) this.input_state_number--;
      this.setState({
        input_disease_list: tmp,
        selected_name_number: -1,
        disease_combine_name
      });
    }
  };
  
  onConsent = () => {
    if (this.karte_mode === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
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
    if (this.karte_mode === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    this.setChangeFlag(1);
    
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
      
      if (this.state.search_tab  == 6 && disease_combine_name == ''){
        disease_combine_name = this.state.preInputName;
      }
      
      if (this.state.search_tab  == 1){
        if (this.state.selected_disease != undefined && this.state.selected_disease != null && this.state.selected_disease.disease_name != undefined && disease_combine_name == ''){
          disease_combine_name = this.state.selected_disease.disease_name;
        }
      }
      
      if (value == 1 && disease_combine_name != undefined && disease_combine_name != "") {
        disease_combine_name += "の疑い";
      }
      
      this.setState({
        suspicion: value,
        disease_combine_name,
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
    if (this.karte_mode === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    
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
    
    
    // const url =
    //   "/app/api/v2/master/disease/search/index" +
    //   "?word=" +
    //   this.state.diseaseName;
    // axios
    //   .get(url)
    //   .then(res => {
    //     this.setState({
    //       diseaseNameList: res.data,
    //       dieaseNameShow: true,
    //       isLoadData: true
    //      });
    //   })
    //   .catch(() => {
    //     this.setState(init_state);
    //   });
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
      isDeleteConfirmModal:false,
      isAddConfirmModal:false,
    });
  }
  
  getKarteStatus = e => {
    this.setChangeFlag(1);
    // 入院: no select
    // if (e.target.id == 1) return;
    this.setState({
      karte_status:{name: e.target.value, code: e.target.id}
    });
    // this.context.$updateKarteStatus(e.target.id, e.target.value);
  };
  
  getExitusReason = e => {
    this.setChangeFlag(1);
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
  
  handleClear = () => {
    if (this.karte_mode === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    if (this.state.disease_combine_name != undefined && this.state.disease_combine_name != null && this.state.disease_combine_name != "") {
      this.setState({isOpenClearDiseaseConfirmPopup: true});
    }
  }
  
  clearComment = () => {
    
    this.input_state_number = 0;
    this.setState({
      disease_combine_name: "",
      selected_perfix_cd:undefined,
      selected_suffix_cd:undefined,
      isOpenClearDiseaseConfirmPopup:false,
      selected_disease:undefined,
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
  
  clearPreInputComment = () => {
    if (this.karte_mode === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    
    this.setState({
      preInputName: "",
      disease_combine_name: ""
    });
  }
  
  changeDiseaseInputName = (e, disease_id) => {
    this.setChangeFlag(1);
    
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
      input_disease_list,
      selected_perfix_cd:input_disease_list[0].disease_cd,
      selected_suffix_cd:this.input_state_number>0?input_disease_list[this.input_state_number-1].disease_cd:undefined,
    });
  };
  
  changeDiseaseCombineName = (e) => {
    var word = e.target.value;
    word = word.toString().trim();
    this.setState({
      disease_combine_name: word
    });
  };
  
  setItemName = (disease_item, tab_id = null) => {
    this.setChangeFlag(1);

    let input_disease_list = this.state.input_disease_list;
    var remove_input_index = this.checkIncludeInputs(disease_item.disease_cd, input_disease_list);
    var last_suffix = input_disease_list[this.input_state_number-1];
    
    if (remove_input_index === false){
      var selected_name_number = this.state.selected_name_number;
      if (tab_id != null){
        selected_name_number = this.input_state_number;
        if (selected_name_number == 7) {
          window.sessionStorage.setItem("alert_messages", 'これ以上病名キーワードを追加できません');
          return;
        }
        if (tab_id == 3){
          var temp_input = [];
          var temp_disease_combine_name = '';
          if (this.input_state_number > 0 && this.checkInArray(last_suffix, this.disease_3_master_data)){
            input_disease_list.map((item, index) => {
              if (index != this.input_state_number-1 && index < 6) temp_input.push(item);
              if (index == this.input_state_number -1){
                temp_input.push({id:index, status:'completed', disease_cd:disease_item.disease_cd, disease_name:disease_item.name});
                temp_input.push(item);
              }
            })
            temp_input.map((sub_item, index) => {
              sub_item.id = index;
              if (sub_item.status == 'completed') temp_disease_combine_name += sub_item.disease_name;
            });
            if (this.state.suspicion == 1 && temp_disease_combine_name != "") {
              temp_disease_combine_name += "の疑い";
            }
            this.setState({
              input_disease_list:temp_input,
              disease_combine_name:temp_disease_combine_name,
            })
            this.input_state_number++;
            
            return;
          }
        }
      }
      
      let input_index = -1;
      // set input tag to div tag
      input_disease_list.map((item, idx)=>{
        if (selected_name_number == item.id) {
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
            this.input_state_number = idx;
          }
        });
        if (selected_name_number == 6) this.input_state_number = 7;
      }
    } else {
      input_disease_list.splice(remove_input_index, 1);
      input_disease_list.map((sub_item, index) => {
        sub_item.id = index;
      });
      if (this.input_state_number < 7){
        input_disease_list.push({id:6, status:'', disease_cd:'', disease_name:''});
      } else {
        input_disease_list.push({id:6, status:'input', disease_cd:'', disease_name:''});
      }
      
      this.input_state_number--;
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
      // selected_name_number: -1,
      input_disease_list,
      disease_combine_name,
      selected_perfix_cd:input_disease_list[0].disease_cd,
      selected_suffix_cd:this.input_state_number>0?input_disease_list[this.input_state_number-1].disease_cd:undefined,
    });
  };
  
  closeModal = () => {
    this.setState({
      isOpenDiseaseInputModal: false,
      isOpenClearDiseaseConfirmPopup: false,
    });
  };
  
  closeOutcomeModal = () => {
    this.setState({
      isDiseaseNameOutcomeModal:false,
      isLoaded: false,
    }, ()=>{
      this.updateDiseasesList();
    });
  }
  
  closeAlert = () => {
    this.setState({
      showAlert: false
    });
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
    // if (insurace_type_accident == "accident" && insurace_type_ration == "ration" && insurace_type_ration == "disease_ration") {
    //   return "労災、自賠、併用自賠"
    // } else if(insurace_type_accident == "accident") {
    //   return "労災"
    // } else if(insurace_type_ration == "ration") {
    //   return "自賠"
    // }
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
  
  getConsentedDiseaseCount = (_data=null) => {
    // get consented 依頼医'count
    // let disease_list = this.state.diseaseList.disease_list;
    let disease_list = _data;
    if (disease_list == null || disease_list == undefined || disease_list.length < 1) {
      return 0;
    }
    let nCount = 0;
    disease_list.map(item=>{
      if (item.is_consented_disease == true && item.is_doctor_consented == 0) {
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
  
  selectTab = e => {
    if (this.karte_mode === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    if (this.isPreInputName == 1 && this.state.preInputName != "") {
      window.sessionStorage.setItem("alert_messages", "自由入力されているため、キーワード形式には戻せません");
      return;
    }
    
    if (this.state.search_tab == e.target.id) return;
    
    let set_state = {
      search_tab: e.target.id
    };
    if (e.target.id == 6)
      set_state.preInputName = this.state.disease_combine_name;
    else
      this.isPreInputName = 0;
    
    this.setState(set_state);
    
  };
  
  getSelectedTag = id => {
    const tab = parseInt(this.state.search_tab);
    if (id == tab) return true;
    return false;
  };
  
  selectDiseaseFunc = (disease) => {
    this.setChangeFlag(1);

    let input_disease_list = [
      {
        id: 0,
        status: disease.name1_val != null && disease.name1_val != "" ? "completed" : "",
        disease_cd: disease.name1 != null && disease.name1 > 0 ? disease.name1 : 0,
        disease_name: disease.name1_val != null && disease.name1_val != "" ? disease.name1_val : ""
      },
      {
        id: 1,
        status: disease.name2_val != null && disease.name2_val != "" ? "completed" : "",
        disease_cd: disease.name2 != null && disease.name2 > 0 ? disease.name2 : 0,
        disease_name:  disease.name2_val != null && disease.name2_val != "" ? disease.name2_val : ""
      },
      {
        id: 2,
        status: disease.name3_val != null && disease.name3_val != "" ? "completed" : "",
        disease_cd: disease.name3 != null && disease.name3 > 0 ? disease.name3 : 0,
        disease_name:  disease.name3_val != null && disease.name3_val != "" ? disease.name3_val : ""
      },
      {
        id: 3,
        status: disease.name4_val != null && disease.name4_val != "" ? "completed" : "",
        disease_cd: disease.name4 != null && disease.name4 > 0 ? disease.name4 : 0,
        disease_name:  disease.name4_val != null && disease.name4_val != "" ? disease.name4_val : ""
      },
      {
        id: 4,
        status: disease.name5_val != null && disease.name5_val != "" ? "completed" : "",
        disease_cd: disease.name5 != null && disease.name5 > 0 ? disease.name5 : 0,
        disease_name:  disease.name5_val != null && disease.name5_val != "" ? disease.name5_val : ""
      },
      {
        id: 5,
        status: disease.name6_val != null && disease.name6_val != "" ? "completed" : "",
        disease_cd: disease.name6 != null && disease.name6 > 0 ? disease.name6 : 0,
        disease_name:  disease.name6_val != null && disease.name6_val != "" ? disease.name6_val : ""
      },
      {
        id: 6,
        status: disease.name7_val != null && disease.name7_val != "" ? "completed" : "",
        disease_cd: disease.name7 != null && disease.name7 > 0 ? disease.name7 : 0,
        disease_name:  disease.name7_val != null && disease.name7_val != "" ? disease.name7_val : ""
      }
    ];
    
    // set input status
    let nIdx = -1;
    input_disease_list.map((item, index)=>{
      if (item.status == "" && nIdx != 1) {
        nIdx = 1;
        item.status = "input";
        this.input_state_number = index;
      }
    });
    
    
    // new state
    let set_state = {};
    set_state.selected_disease = disease;
    set_state.input_disease_list = input_disease_list;
    
    // set combine disease name
    let disease_combine_name = disease.disease_name;
    // input_disease_list.map(item=>{
    //   if (item.status == "completed") {
    //     disease_combine_name += item.disease_name;
    //   }
    // });
    
    if (disease.doubt_flag == 1){
      if (disease_combine_name != ''){
        disease_combine_name += "";
      }
    } else {
      if (this.state.suspicion){
        disease_combine_name += "の疑い";
      }
    }
    
    set_state.disease_combine_name = disease_combine_name;
    
    set_state.selected_perfix_cd = input_disease_list[0].disease_cd;
    set_state.selected_suffix_cd = this.input_state_number>0?input_disease_list[this.input_state_number-1].disease_cd:undefined;
    
    if (disease.doubt_flag == 1) set_state.suspicion = 1;
    
    this.setState(set_state);
    
  }
  
  getNumber = (number, length=8) => {
    var str = '' + number;
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
  }
  
  openDiseaseNameOutcomeModal=()=>{
    if (this.karte_mode === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    this.setState({
      isDiseaseNameOutcomeModal:true,
    });
  }
  
  changePreInputName = e => {
    this.setChangeFlag(1);

    this.isPreInputName = 1;
    var disease_combine_name = '';
    if (this.state.suspicion){
      if (e.target.value != ''){
        disease_combine_name = e.target.value + 'の疑い';
      } else {
        disease_combine_name = '';
      }
    } else {
      disease_combine_name = e.target.value;
    }
    this.setState({
      preInputName: e.target.value,
      disease_combine_name,
      selected_perfix_cd:undefined,
      selected_suffix_cd:undefined,
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
    });
  };
  
  selectCategory_1 = async(item) => {
    this.setChangeFlag(1);

    await axios.post(
      "/app/api/v2/master/disease/search/disease_categories_2",
      {
        params: {
          category_1_id:item.category_1_id,
        }
      }
    ).then((res) => {
      this.setState({
        dispaly_category_2_data:res.data,
        selected_category_1_id:item.category_1_id,
        selected_category_2_id:undefined,
        selected_category_3_id:undefined,
        
        dispaly_category_3_data:[],
        display_disease_master_data:[],
      })
    });
    // var temp = [];
    // temp = this.category_2_data.filter(x=>x.category_1_id == parseInt(item.category_1_id));
    
  }
  
  selectCategory_2 = async(item) => {
    this.setChangeFlag(1);

    await axios.post(
      "/app/api/v2/master/disease/search/disease_categories_3",
      {
        params: {
          category_1_id:item.category_1_id,
          category_2_id:item.category_2_id,
        }
      }
    ).then((res) => {
      this.setState({
        dispaly_category_3_data:res.data,
        selected_category_2_id:item.category_2_id,
        
        selected_category_3_id:undefined,
        display_disease_master_data:[],
      })
    })
    // var temp = [];
    // temp = this.category_3_data.filter(x=>x.category_1_id == parseInt(item.category_1_id)).filter(x=>x.category_2_id == parseInt(item.category_2_id));
  }
  
  selectCategory_3 = async(item) => {
    this.setChangeFlag(1);

    await axios.post(
      "/app/api/v2/master/disease/search/disease_master_2_data",
      {
        params: {
          category_3_id:item.category_3_id,
        }
      }
    ).then((res) => {
      this.setState({
        display_disease_master_data:res.data,
        selected_category_3_id:item.category_3_id,
      })
    })
    // var temp = [];
    // temp = this.disease_2_master_data.filter(x=>x.category_3_id == parseInt(item.category_3_id));
  }
  
  checkInArray(element, array_values){
    if (element == undefined || element == '') return false;
    var result = false;
    array_values.map(item => {
      if (element.disease_cd == item.disease_cd) result = true;
    })
    return result;
  }
  
  checkIncludeInputs(disease_cd, input_disease_list){
    if (disease_cd == undefined || disease_cd == '') return false;
    if (input_disease_list== undefined || input_disease_list.length==0) return false;
    for(var i = 0;i<input_disease_list.length;i++){
      if (disease_cd == input_disease_list[i].disease_cd) return i;
    }
    return false;
  }
  
  selectSuffix(item) {
    this.setChangeFlag(1);

    var last_disease_part = this.input_state_number>0?this.state.input_disease_list[this.input_state_number-1]:this.state.input_disease_list[0];
    if (last_disease_part.disease_cd == item.disease_cd){
      last_disease_part.disease_cd = '';
      last_disease_part.status = 'input';
      last_disease_part.disease_name = '';
      var ex_input_tag = this.state.input_disease_list[this.input_state_number];
      ex_input_tag.status = '';
      ex_input_tag.disease_cd = '';
      ex_input_tag.disease_name = '';
      this.input_state_number--;
      this.setState({selected_suffix_cd:undefined});
    } else {
      if (this.checkInArray(last_disease_part, this.disease_3_master_data)){
        last_disease_part.disease_cd = item.disease_cd;
        last_disease_part.disease_name = item.name;
        this.forceUpdate();
      } else {
        if (this.input_state_number < 7){
          var temp = this.state.input_disease_list[this.input_state_number];
          temp.status = 'completed';
          temp.disease_cd = item.disease_cd;
          temp.disease_name = item.name;
          this.input_state_number++;
          if (this.input_state_number <7){
            var last_element = this.state.input_disease_list[this.input_state_number];
            last_element.status='input';
          }
          this.forceUpdate();
        } else {
          window.sessionStorage.setItem("alert_messages", 'これ以上病名キーワードを追加できません');
          return;
        }
      }
      this.setState({selected_suffix_cd:item.disease_cd});
    }
    
    // make disease combine name
    let disease_combine_name = "";
    this.state.input_disease_list.map(item=>{
      if (item.status == "completed") {
        disease_combine_name += item.disease_name;
      }
    });
    if (this.state.suspicion == 1 && disease_combine_name != "") {
      disease_combine_name += "の疑い";
    }
    this.setState({disease_combine_name});
  }
  
  selectPrefix(item) {
    this.setChangeFlag(1);

    var first_disease_part = this.state.input_disease_list[0];
    var input_disease_list = this.state.input_disease_list;
    if (first_disease_part.disease_cd == item.disease_cd) {
      input_disease_list.shift();
      input_disease_list.map((sub_item, index) => {
        sub_item.id = index;
      });
      if (this.input_state_number < 7 ) {
        input_disease_list.push({id:6, status:'', disease_cd:'', disease_name:''});
      } else {
        input_disease_list.push({id:6, status:'input', disease_cd:'', disease_name:''});
      }
      
      this.setState({selected_perfix_cd:undefined, input_disease_list});
      this.input_state_number--;
    } else {
      if (this.checkInArray(first_disease_part, this.disease_1_master_data)){
        first_disease_part.disease_cd = item.disease_cd;
        first_disease_part.disease_name = item.name;
        this.forceUpdate();
      } else {
        if (this.input_state_number < 7){
          this.state.input_disease_list.map((sub_item, index) => {
            sub_item.id=index+1;
          })
          var added_pre_element = {id:0, status:'completed', disease_cd:item.disease_cd, disease_name:item.name};
          input_disease_list.unshift(added_pre_element);
          input_disease_list.pop();
          this.input_state_number++;
          this.forceUpdate();
        } else {
          window.sessionStorage.setItem("alert_messages", 'これ以上病名キーワードを追加できません');
          return;
        }
      }
      this.setState({selected_perfix_cd:item.disease_cd});
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
    this.setState({disease_combine_name});
  }
  
  selectDepartmentCategory(item){
    this.setChangeFlag(1);

    var display_department_category_disease_data = this.department_category_disease_data.filter(x=>x.category_id == parseInt(item.category_id));
    this.setState({
      selected_department_category_id:item.category_id,
      display_department_category_disease_data
    })
  }

  handleCloseModal = () => {
    if (this.karte_mode === KARTEMODE.READ) {
      this.props.closeModal();
      return;
    }

    if (this.state.btnName == "変更") {
      if (this.isDiseaseNotChanged()) {
        this.props.closeModal();
        return;   
      }
      this.setState({
        confirm_message: "変更を破棄しますか？",
        confirm_type: "cancel_edit"
      });
      return;
    }
    if (this.state.disease_combine_name != "" || this.state.change_flag == 1) {
      this.setState({
        confirm_message: "入力内容を破棄しますか？",
        confirm_type: "cancel_input"
      })
      return;
    }
    this.props.closeModal();
  }

  setChangeFlag = (_changeFlag) => {
    this.setState({
      change_flag: _changeFlag
    });
  }

  isChangedEditData = () => {
    let result = false;

    if (this.state.departmentCode != this.editOriginData.departmentCode) {      
      return true;      
    }
    // if (this.state.diseaseName != this.editOriginData.diseaseName) {
    //   return true;      
    // }
    let _diseaseEditDate = this.editOriginData.diseaseEditDate == undefined || this.editOriginData.diseaseEditDate == null || this.editOriginData.diseaseEditDate == "" ? "" : this.editOriginData.diseaseEditDate;
    if (formatDateLine(this.state.diseaseEditDate) != _diseaseEditDate) {
      return true;      
    }
    let _diseaseDate = this.editOriginData.diseaseDate == undefined || this.editOriginData.diseaseDate == null || this.editOriginData.diseaseDate == "" ? "" : this.editOriginData.diseaseDate;
    if (formatDateLine(this.state.diseaseDate) != _diseaseDate) {
      return true;      
    }
    let _diseaseEndDate = this.editOriginData.diseaseEndDate == undefined || this.editOriginData.diseaseEndDate == null || this.editOriginData.diseaseEndDate == "" ? "" : this.editOriginData.diseaseEndDate;
    if (formatDateLine(this.state.diseaseEndDate) != _diseaseEndDate) {
      return true;      
    }
    let _diseaseEditEndDate = this.editOriginData.diseaseEditEndDate == undefined || this.editOriginData.diseaseEditEndDate == null || this.editOriginData.diseaseEditEndDate == "" ? "" : this.editOriginData.diseaseEditEndDate;
    if (formatDateLine(this.state.diseaseEditEndDate) != _diseaseEditEndDate) {
      return true;      
    }
    if (this.state.diseaseNum != this.editOriginData.diseaseNum) {
      return true;      
    }
    if (this.state.karte_status.code != this.editOriginData.karte_status.code) {
      return true;      
    }
    if (this.state.exitus_reason.code != this.editOriginData.exitus_reason.code) {
      return true;      
    }
    // if (JSON.stringify(this.state.input_disease_list) != JSON.stringify(this.editOriginData.input_disease_list)) {
    if (this.isChangedDiseaseList()) {
      return true;      
    }
    // if (this.state.selected_perfix_cd != this.editOriginData.selected_perfix_cd) {
    //   return true;      
    // }
    // if (this.state.selected_suffix_cd != this.editOriginData.selected_suffix_cd) {
    //   return true;      
    // }
    let _main_disease_left = this.state.main_disease == undefined || this.state.main_disease == null || this.state.main_disease == "" ? 0 : this.state.main_disease;
    let _main_disease = this.editOriginData.main_disease == undefined || this.editOriginData.main_disease == null || this.editOriginData.main_disease == "" ? 0 : 1;
    if (_main_disease_left != _main_disease) {
      return true;      
    }
    let _confidentiality_left = this.state.confidentiality == undefined || this.state.confidentiality == null || this.state.confidentiality == "" ? 0 : this.state.confidentiality;
    let _confidentiality = this.editOriginData.confidentiality == undefined || this.editOriginData.confidentiality == null || this.editOriginData.confidentiality == "" ? 0 : 1;
    if (_confidentiality_left != _confidentiality) {      
      return true;      
    }
    let _ration_left = this.state.ration == undefined || this.state.ration == null || this.state.ration == "" ? 0 : this.state.ration;
    let _ration = this.editOriginData.ration == undefined || this.editOriginData.ration == null || this.editOriginData.ration == "" ? 0 : 1;
    if (_ration_left != _ration) {
      return true;      
    }
    let _disease_ration_left = this.state.disease_ration == undefined || this.state.disease_ration == null || this.state.disease_ration == "" ? 0 : this.state.disease_ration;
    let _disease_ration = this.editOriginData.disease_ration == undefined || this.editOriginData.disease_ration == null || this.editOriginData.disease_ration == "" ? 0 : 1;
    if (_disease_ration_left != _disease_ration) {
      return true;      
    }
    let _suspicion_left = this.state.suspicion == undefined || this.state.suspicion == null || this.state.suspicion == "" ? 0 : this.state.suspicion;
    let _suspicion = this.editOriginData.suspicion == undefined || this.editOriginData.suspicion == null || this.editOriginData.suspicion == "" ? 0 : 1;
    if (_suspicion_left != _suspicion) {
      return true;      
    }
    let _accident_left = this.state.accident == undefined || this.state.accident == null || this.state.accident == "" ? 0 : this.state.accident;
    let _accident = this.editOriginData.accident == undefined || this.editOriginData.accident == null || this.editOriginData.accident == "" ? 0 : 1;
    if (_accident_left != _accident) {
      return true;      
    }
    if (this.state.disease_combine_name != this.editOriginData.disease_combine_name) {
      return true;      
    }
    if (this.state.btnName != this.editOriginData.btnName) {
      return true;      
    }

    return result;
  }

  isChangedDiseaseList = () => {
    let result = false;

    let compare_name = this.editOriginData.input_disease_list[0].disease_name == undefined || this.editOriginData.input_disease_list[0].disease_name == null || this.editOriginData.input_disease_list[0].disease_name == "" ? "" : this.editOriginData.input_disease_list[0].disease_name;
    let compare_name_left = this.state.input_disease_list[0].disease_name == undefined || this.state.input_disease_list[0].disease_name == null || this.state.input_disease_list[0].disease_name == "" ? "" : this.state.input_disease_list[0].disease_name;
    if (!(this.state.input_disease_list[0].disease_cd == this.editOriginData.input_disease_list[0].disease_cd && compare_name_left == compare_name)) {
      result = true;
    }
    compare_name = this.editOriginData.input_disease_list[1].disease_name == undefined || this.editOriginData.input_disease_list[1].disease_name == null || this.editOriginData.input_disease_list[1].disease_name == "" ? "" : this.editOriginData.input_disease_list[1].disease_name;
    compare_name_left = this.state.input_disease_list[1].disease_name == undefined || this.state.input_disease_list[1].disease_name == null || this.state.input_disease_list[1].disease_name == "" ? "" : this.state.input_disease_list[1].disease_name;
    if (!(this.state.input_disease_list[1].disease_cd == this.editOriginData.input_disease_list[1].disease_cd && compare_name_left == compare_name)) {
      result = true;
    }
    compare_name = this.editOriginData.input_disease_list[2].disease_name == undefined || this.editOriginData.input_disease_list[2].disease_name == null || this.editOriginData.input_disease_list[2].disease_name == "" ? "" : this.editOriginData.input_disease_list[2].disease_name;
    compare_name_left = this.state.input_disease_list[2].disease_name == undefined || this.state.input_disease_list[2].disease_name == null || this.state.input_disease_list[2].disease_name == "" ? "" : this.state.input_disease_list[2].disease_name;
    if (!(this.state.input_disease_list[2].disease_cd == this.editOriginData.input_disease_list[2].disease_cd && compare_name_left == compare_name)) {
      result = true;
    }
    compare_name = this.editOriginData.input_disease_list[3].disease_name == undefined || this.editOriginData.input_disease_list[3].disease_name == null || this.editOriginData.input_disease_list[3].disease_name == "" ? "" : this.editOriginData.input_disease_list[3].disease_name;
    compare_name_left = this.state.input_disease_list[3].disease_name == undefined || this.state.input_disease_list[3].disease_name == null || this.state.input_disease_list[3].disease_name == "" ? "" : this.state.input_disease_list[3].disease_name;
    if (!(this.state.input_disease_list[3].disease_cd == this.editOriginData.input_disease_list[3].disease_cd && compare_name_left == compare_name)) {
      result = true;
    }
    compare_name = this.editOriginData.input_disease_list[4].disease_name == undefined || this.editOriginData.input_disease_list[4].disease_name == null || this.editOriginData.input_disease_list[4].disease_name == "" ? "" : this.editOriginData.input_disease_list[4].disease_name;
    compare_name_left = this.state.input_disease_list[4].disease_name == undefined || this.state.input_disease_list[4].disease_name == null || this.state.input_disease_list[4].disease_name == "" ? "" : this.state.input_disease_list[4].disease_name;
    if (!(this.state.input_disease_list[4].disease_cd == this.editOriginData.input_disease_list[4].disease_cd && compare_name_left == compare_name)) {
      result = true;
    }
    compare_name = this.editOriginData.input_disease_list[5].disease_name == undefined || this.editOriginData.input_disease_list[5].disease_name == null || this.editOriginData.input_disease_list[5].disease_name == "" ? "" : this.editOriginData.input_disease_list[5].disease_name;
    compare_name_left = this.state.input_disease_list[5].disease_name == undefined || this.state.input_disease_list[5].disease_name == null || this.state.input_disease_list[5].disease_name == "" ? "" : this.state.input_disease_list[5].disease_name;
    if (!(this.state.input_disease_list[5].disease_cd == this.editOriginData.input_disease_list[5].disease_cd && compare_name_left == compare_name)) {
      result = true;
    }
    compare_name = this.editOriginData.input_disease_list[6].disease_name == undefined || this.editOriginData.input_disease_list[6].disease_name == null || this.editOriginData.input_disease_list[6].disease_name == "" ? "" : this.editOriginData.input_disease_list[6].disease_name;
    compare_name_left = this.state.input_disease_list[6].disease_name == undefined || this.state.input_disease_list[6].disease_name == null || this.state.input_disease_list[6].disease_name == "" ? "" : this.state.input_disease_list[6].disease_name;
    if (!(this.state.input_disease_list[6].disease_cd == this.editOriginData.input_disease_list[6].disease_cd && compare_name_left == compare_name)) {
      result = true;
    }

    return result;
  }

  // ●YJ973 病名モーダルでなにも追加していなくても「追加」が押せてしまう
  isDiseaseNotChanged = () => {
    let disableAddButton = false;

    if (this.karte_mode == KARTEMODE.READ) {
      disableAddButton = true;
    }
    // 開始日が空欄の場合
    if (this.state.diseaseEditDate == undefined || this.state.diseaseEditDate == null || this.state.diseaseEditDate == "") {
      disableAddButton = true;
    }
    // フリー入力で0文字の場合
    if (parseInt(this.state.search_tab) == 6) {     
      if (this.state.preInputName == "") {        
        disableAddButton = true;
      }
    } else {
      let existDiseaseName = 0;
      // フリー入力以外で病名キーワードが1つもない場合
      this.state.input_disease_list.map(item=>{
        if (item.disease_name != undefined && item.disease_name != null && item.disease_name != "") {
          existDiseaseName = 1;
        }
      })
      if (existDiseaseName == 0) {
        disableAddButton = true;
      }
    }
    // 登録できる権限がない場合
    if (!(this.context.$canDoAction(this.context.FEATURES.DISEASE,this.context.AUTHS.REGISTER) ||
        this.context.$canDoAction(this.context.FEATURES.DISEASE,this.context.AUTHS.REGISTER_OLD) || 
        this.context.$canDoAction(this.context.FEATURES.DISEASE, this.context.AUTHS.REGISTER_PROXY) ||
        this.context.$canDoAction(this.context.FEATURES.DISEASE,this.context.AUTHS.REGISTER_PROXY_OLD))) {
      disableAddButton = true;
    }
    // 変更中で何も変更していない場合（元の内容に戻してもグレーアウトに戻る判定にすること）
    if (this.state.btnName == "変更") {
      if (this.state.change_flag == 0) {
        disableAddButton = true;
      } else {
        // validate
        if (!this.isChangedEditData()) {
          disableAddButton = true;
        }
      }
    }

    return disableAddButton;
  }
  
  render() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let isDoctor = authInfo.staff_category == 1 ? true : false;
    
    let noresult = 0;
    if(this.state.diseaseList.disease_list != undefined){
      noresult = this.state.diseaseList.disease_list.length;
    }
    
    const department = this.departmentOptions.filter(item => {
      return item.id === parseInt(this.state.departmentCode);
    });
    // let disabledValue = this.getEntranceId();
    
    //過去病名参照タブ--------------------------
    let disease_list_temp = [];
    if (noresult > 0) {
      /*---- convert sort array */
      let convert_disease_list = {};
      this.state.diseaseList.disease_list.filter(item=>{
        let cur_dateTime = new Date(getCurrentDate("/")).getTime();
        let item_dateTime = new Date(item.start_date.split('-').join('/')).getTime();
        if (item_dateTime < cur_dateTime) {
          return true;
        } else return false;
      }).map(ele=>{
        let snumber = this.getNumber(ele.number);
        let skey = new Date(ele.start_date.split('-').join('/')).getTime() + snumber;
        convert_disease_list[skey] = ele;
      });
      
      disease_list_temp = Object.keys(convert_disease_list).sort().map(key => {
        return (
          <>
            <tr className="search-disease-item" onClick={()=>this.selectDiseaseFunc(convert_disease_list[key])}>
              <td className="search-table-date">{convert_disease_list[key].start_date}</td>
              <td className="search-table-department">{this.getDepartmentName(convert_disease_list[key].department_code)}</td>
              <td className="search-table-disease">{convert_disease_list[key].disease_name}</td>
            </tr>
          </>
        );
      });
    }
    let diseaseInputType1 = [];
    diseaseInputType1.push(
      <>
        <table>
          <tr style={{display:"table", width:"100%"}}>
            <th className="search-table-date">開始日</th>
            <th className="search-table-department">診療科</th>
            <th className="search-table-disease">病名</th>
          </tr>
          <tbody className="past-disease-body">
          {this.state.isLoaded == false ? (
            <div className='spinner-disease-loading center'>
              <SpinnerOtherWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerOtherWrapper>
            </div>
          ):(
            <>
              {disease_list_temp}
            </>
          )}
          </tbody>
        </table>
      </>
    );
    //---------------------------------------------------------------------
    
    //キーワード検索タブ--------------------------
    let diseaseInputType2 = [];
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
                auto_focus={'focus'}
                disabled={this.karte_mode == KARTEMODE.READ ? 1 : 0}
              />
            </div>
          ) : (
            <>
              {item.status == "completed" ? (
                <div className="disease-input-element has-content" onContextMenu={e => this.handleDiseaseClick(e, item.id, item.disease_cd)}>
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
    
    diseaseInputType2.push(
      <>
        <div className="flex disease-search-label">病名検索</div>
        <div className="flex disease-input-div">
          <div className="disease-input">
            {input_list}
          </div>
        </div>
      </>
    );
    //-----------------------------------------------------------------------------------------
    
    //目次検索タブ---------------------------------------------------------------------------
    let diseaseInputType3 = [];
    diseaseInputType3.push(
      <>
        <div className="flex disease-input-div special-bottom" style={{marginBottom:'10px!important'}}>
          <div style={{width:'5rem'}} className="disease-search-label">病名検索</div>
          <div className="disease-input">
            {input_list}
          </div>
        </div>
        <div style={{width:'100%', display:'flex'}}>
          <div className='left-area flex'>
            <div>
              <div>大分類</div>
              <div className='category_1_list list'>
                {this.state.dispaly_category_1_data != undefined && this.state.dispaly_category_1_data.length > 0 && (
                  this.state.dispaly_category_1_data.map((item) =>{
                    return(
                      <>
                        <div className={this.state.selected_category_1_id == item.category_1_id?'selected':''} onClick={this.selectCategory_1.bind(this, item)}>{item.name}</div>
                      </>
                    )
                  })
                )}
              </div>
            </div>
            <div>
              <div>中分類  </div>
              <div className='category_2_list list'>
                {this.state.dispaly_category_2_data != undefined && this.state.dispaly_category_2_data.length > 0 && (
                  this.state.dispaly_category_2_data.map((item) =>{
                    return(
                      <>
                        <div className={this.state.selected_category_2_id == item.category_2_id?'selected':''} onClick={this.selectCategory_2.bind(this, item)}>{item.name}</div>
                      </>
                    )
                  })
                )}
              </div>
            </div>
            
            <div>
              <div>小分類</div>
              <div className='category_3_list list'>
                {this.state.dispaly_category_3_data != undefined && this.state.dispaly_category_3_data.length > 0 && (
                  this.state.dispaly_category_3_data.map((item) =>{
                    return(
                      <>
                        <div className={this.state.selected_category_3_id == item.category_3_id?'selected':''} onClick={this.selectCategory_3.bind(this, item)}>{item.name}</div>
                      </>
                    )
                  })
                )}
              </div>
            </div>
            <div>
              <div>病名</div>
              <div className='disease_name_list list'>
                {this.state.display_disease_master_data != undefined && this.state.display_disease_master_data.length > 0 && (
                  this.state.display_disease_master_data.map((item) =>{
                    return(
                      <>
                        <div className={this.checkIncludeInputs(item.disease_cd, this.state.input_disease_list) === false ?'':'selected'}
                             onClick={this.setItemName.bind(this, item, 3)}
                             onContextMenu={e => this.handleListDiseaseClick(e, item.disease_cd)}>
                          {item.name}
                        </div>
                      </>
                    )
                  })
                )}
              </div>
            </div>
          </div>
          <div className='right-area'>
            <div>
              <div>接頭語</div>
              <div className='category_1_list list'>
                {this.state.prefix_data != undefined && this.state.prefix_data.length > 0 && (
                  this.state.prefix_data.map((item) =>{
                    return(
                      <>
                        <div
                          className={this.checkIncludeInputs(item.disease_cd, this.state.input_disease_list) === false ?'':'selected'}
                          onClick={this.selectPrefix.bind(this, item)}>{item.name}</div>
                      </>
                    )
                  })
                )}
              </div>
            </div>
            <div>
              <div>接尾語</div>
              <div className='category_2_list list'>
                {this.state.suffix_data != undefined && this.state.suffix_data.length > 0 && (
                  this.state.suffix_data.map((item) =>{
                    return(
                      <>
                        <div
                          className={this.checkIncludeInputs(item.disease_cd, this.state.input_disease_list) === false ?'':'selected'}
                          onClick={this.selectSuffix.bind(this, item)}>{item.name}</div>
                      </>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
    //------------------------------------------------------------------------------------
    
    //科別頻用----------------------------------------------------------------------------
    let diseaseInputType4 = [];
    diseaseInputType4.push(
      <>
        <div className="flex disease-input-div special-bottom" style={{marginBottom:'10px!important'}}>
          <div style={{width:'5rem'}} className="disease-search-label">病名検索</div>
          <div className="disease-input">
            {input_list}
          </div>
        </div>
        <div style={{width:'100%', display:'flex'}}>
          <div style={{marginRight:'50px'}}>
            <div>分類</div>
            <div className='list'>
              {this.state.dispaly_department_category_data != undefined && this.state.dispaly_department_category_data.length > 0 && (
                this.state.dispaly_department_category_data.map((item) =>{
                  return(
                    <>
                      <div className={this.state.selected_department_category_id == item.category_id?'selected':''} onClick={this.selectDepartmentCategory.bind(this, item)}>{item.name}</div>
                    </>
                  )
                })
              )}
            </div>
          </div>
          <div>
            <div>病名</div>
            <div className='list'>
              {this.state.display_department_category_disease_data != undefined && this.state.display_department_category_disease_data.length > 0 && (
                this.state.display_department_category_disease_data.map((item) =>{
                  return(
                    <>
                      <div
                        className={this.checkIncludeInputs(item.disease_cd, this.state.input_disease_list) === false ?'':'selected'}
                        onContextMenu={e => this.handleListDiseaseClick(e, item.disease_cd)}
                        onClick={this.setItemName.bind(this, item, 4)}>{item.name}</div>
                    </>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </>
    );
    //------------------------------------------------------------------------------------
    
    //医 師 別 頻 用------------------------------------------------------------------------
    let diseaseInputType5 = [];
    diseaseInputType5.push(
      <>
        <div className="flex disease-input-div special-bottom" style={{marginBottom:'10px!important'}}>
          <div style={{width:'5rem'}} className="disease-search-label">病名検索</div>
          <div className="disease-input">
            {input_list}
          </div>
        </div>
        <div style={{width:'100%', display:'flex'}}>
          <div style={{marginRight:'50px'}}>
            <div>病名</div>
            <div className='list'>
              {this.state.freq_diseases != undefined && this.state.freq_diseases.length > 0 && (
                this.state.freq_diseases.map((item) =>{
                  return(
                    <>
                      <div
                        className={this.checkIncludeInputs(item.disease_cd, this.state.input_disease_list) === false ?'':'selected'}
                        onContextMenu={e => this.handleListDiseaseClick(e, item.disease_cd, 'delete')}
                        onClick={this.setItemName.bind(this, item, 5)}>{item.name}</div>
                    </>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </>
    );
    //------------------------------------------------------------------------------------
    //フリー入力タブ--------------------------------------------------------------------------------
    let diseaseInputType6 = [];
    diseaseInputType6.push(
      <>
        <div className="disease-preinput-name">
          <InputWithLabel
            label=""
            type="text"
            // getInputText={this.getComment.bind(this)}
            // onChange={(e)=>this.changeDiseaseInputName(e, item.id)}
            getInputText={(e)=>this.changePreInputName(e)}
            diseaseEditData={this.state.preInputName}
          />
          <Button className="clear-button" onClick={this.clearPreInputComment.bind(this)}>C</Button>
        </div>
      </>
    );
    //---------------------------------------------------------------------------------------------
    
    let _searchTabs = [
      {
        id: 1,
        name: "過去病名参照"
      },
      {
        id: 2,
        name: "キーワード検索"
      },
      {
        id: 3,
        name: "目 次 検 索"
      },
      {
        id: 4,
        name: "科 別 頻 用"
      },
      {
        id: 5,
        name: "医 師 別 頻 用"
      }
    ];
    
    let searchTabArray = searchTabs;
    if (parseInt(this._configPreInputName) == 0) {
      searchTabArray = _searchTabs;
    }
    
    const tags = searchTabArray.map(tag => (
      <UsageTab
        key={tag.id}
        id={tag.id}
        name={tag.name}
        selectTab={this.selectTab}
        active={this.getSelectedTag(tag.id)}
      />
    ));

    // ●YJ973 病名モーダルでなにも追加していなくても「追加」が押せてしまう

    let disableAddButton = this.isDiseaseNotChanged();    

    return (
      <>
        <Modal
          show={true}
          id="outpatient"
          className="custom-modal-sm patient-exam-modal disease-name-modal first-view-modal disease-name-patient-modal"
        >
          <Modal.Header>
            <Modal.Title>
              病名
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Popup>
              <div className="disease-header" style={{display:"flex"}}>
                <fieldset className="radio-area">
                  <legend className="blog-title">診療科</legend>
                  <div className = "radio-groups">
                    <Radiobox
                      label={`自科(${this.context.department.name !== ""?this.context.department.name:"内科"})`}
                      value={0}
                      getUsage={this.getDepartment.bind(this)}
                      checked={this.state.department === 0 ? true : false}
                      name={`department`}
                    />
                    <Radiobox
                      label={'全科'}
                      value={1}
                      getUsage={this.getDepartment.bind(this)}
                      checked={this.state.department === 1 ? true : false}
                      name={`department`}
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
                      name={`outcome`}
                    />
                    <Radiobox
                      label={'全て'}
                      value={1}
                      getUsage={this.getEndDate.bind(this)}
                      checked={this.state.end_date === 1 ? true : false}
                      name={`outcome`}
                    />
                  </div>
                </fieldset>
                <div className="footer-buttons disease-all-btn" style={{width:"calc(100% - 480px)", textAlign:"right"}}>
                  <Button className={`${this.karte_mode == KARTEMODE.READ ? "disable-btn":"red-btn"}`} onClick={this.openDiseaseNameOutcomeModal}>病名一括転帰</Button>
                </div>
              </div>
              <div className="flex disease-list">
                <div className="list-content">
                  
                  <table className='disease-list-table'>
                    <thead>
                    <tr>
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
                      {isDoctor && (
                        <th>
                          <Checkbox
                            label="全て選択"
                            getRadio={this.getRadio.bind(this)}
                            value={this.state.allChecked}
                            name="notConsentedDataAllSelect"
                          />
                        </th>
                      )}
                    
                    </tr>
                    </thead>
                    <tbody className='disease-list-tbody' style={{height: this.state.tbody_height}}>
                    {this.state.isLoaded == false ? (
                      <div className='spinner-loading center'>
                        <SpinnerOtherWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerOtherWrapper>
                      </div>
                    ):(
                      <>
                        {noresult > 0 ? (
                          this.state.diseaseList.disease_list.filter(item=>{
                              if (this.state.department == 1) {
                                if (this.state.end_date == 0) {
                                  if (item.end_date == null) return item;
                                } else return item;
                              } else {
                                if (item.department_code == (this.context.department.code == 0 ? 1: this.context.department.code)) {
                                  if (this.state.end_date == 0) {
                                    if (item.end_date == null) return item;
                                  } else return item;
                                }
                              }
                            })
                            .map(disease => (
                              <tr
                                key={disease.number}
                                onContextMenu={e => this.handleClick(e, disease.number, disease)}
                                className={this.state.diseaseNum == disease.number ? "edit_tr" : ""}
                              >
                                <td className='kind'>{Karte_status_type[disease.patient_type > 0 ? disease.patient_type : 0].value}</td>
                                <td className='department'>{this.getDepartmentName(disease.department_code)}</td>
                                <td className='name'>{disease.disease_name}</td>
                                <td className='start_date'>{disease.start_date}</td>
                                <td className='end_date_1'>{disease.end_date === null ? "" : disease.end_date}</td>
                                <td className='end_date_2'>{EXITUS_REASON[disease.exitus_reason > 0 ? disease.exitus_reason : 0].value}</td>
                                <td className='one-letter'>{disease.main_diease_name_flag == 1 && "主"}</td>
                                <td className='one-letter'>{disease.confidentiality_flag == 1 && "守"}</td>
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
                                <td className='insurance'>{this.getInsuranceName(disease)}</td>
                                <td className='center agree'>
                                  {disease.is_doctor_consented === 0  ? !disease.is_consented_disease && (<span className="red">未承認</span>) : disease.is_doctor_consented === 1 && (<span className="black">承認済み</span>)}
                                </td>
                                {/* {disease.is_doctor_consented === 0 ? (
                                <td className="center agree">
                                  {disease.is_consented_disease ? (
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
                              )} */}
                                {isDoctor && (
                                  <>
                                    <td style={{textAlign:'center'}}>{disease.is_doctor_consented === 0 &&  disease.is_consented_disease ?
                                      <Checkbox
                                        ref={ref => (this.selectAll = ref)}
                                        label="選択"
                                        getRadio={this.getRadio.bind(this)}
                                        value={disease.checked}
                                        number={disease.number}
                                        name="notConsentedDataOneSelect"
                                      />
                                      :''}
                                    </td>
                                  </>
                                )}
                              </tr>
                            ))
                        ) : (
                          <>
                            {this.state.isLoaded && (
                              <div className="table-scroll"><div className="no-result"><p>条件に一致する結果は見つかりませんでした。</p></div></div>
                            )}
                          </>
                        )}
                        {this.context.$canDoAction(this.context.FEATURES.DISEASE,this.context.AUTHS.CONFIRM) && this.consentedDiseaseCount > 0 &&
                        this.hasConfirmNeeded() && (
                          <tr>
                            <td className='kind'/>
                            <td className='department'/>
                            <td className='name'/>
                            <td className='start_date'/>
                            <td className='end_date_1' />
                            <td className='end_date_2' />
                            <td className='one-letter'/>
                            <td className='one-letter'/>
                            <td className='doctor-name'/>
                            <td className='insurance'/>
                            <td className='center agree' />
                            <td style={{textAlign:'center'}}>
                              <button onClick={() => this.onConsent()}>承認</button>
                            </td>
                          </tr>
                        )}
                      </>
                    )}
                    </tbody>
                  </table>
                
                </div>
              </div>
              <div className="insert-button footer-buttons">
                <div style={{width:"calc(50% + 50px)", textAlign:"right"}}>
                  <Button className={`${disableAddButton ? "disable-btn disable-add-btn":"red-btn"}`} onClick={this.register}>↑ {this.state.btnName}</Button>
                </div>
                <div style={{width:"calc(50% - 50px)", textAlign:"right"}}>
                  <Button className="cancel-btn" onClick={this.handleCloseModal}>閉じる</Button>
                </div>
              </div>
              <div className={`flex insert-checkbox-design ${this.karte_mode == KARTEMODE.READ ? "karte_mode_read": ""}`}>
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
                  <div className="right-area_1">
                    <div className="disease-start-day">
                      <InputWithErrorLabel
                        label="開始日"
                        type="date"
                        getInputText={this.getDiseaseDate}
                        diseaseEditData={this.state.diseaseEditDate == "" || this.state.diseaseEditDate == null ? "" : new Date(this.state.diseaseEditDate)}
                        error={this.state.errors.start_date}
                        handleKeyPress={() => {}}
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
              <div className={`flex checkbox-div ${this.karte_mode == KARTEMODE.READ ? "karte_mode_read": ""}`}>
                <div className="checkbox-content">
                  <div className="main-disease checkbox-area">
                    <Checkbox
                      label="主病名"
                      getRadio={this.getRadio.bind(this)}
                      value={this.state.main_disease}
                      name="main-disease"
                      isDisabled={this.karte_mode == KARTEMODE.READ}
                    />
                    <Checkbox
                      label="疑い"
                      getRadio={this.getRadio.bind(this)}
                      value={this.state.suspicion}
                      name="suspicion"
                      isDisabled={this.karte_mode == KARTEMODE.READ}
                    />
                    <Checkbox
                      label="守秘"
                      getRadio={this.getRadio.bind(this)}
                      value={this.state.confidentiality}
                      name="confidentiality"
                      isDisabled={this.karte_mode == KARTEMODE.READ}
                    />
                  </div>
                  <div className="right-area_2">
                    <div className="accident checkbox-area">
                      <label className="insurance">保険:</label>
                      <Checkbox
                        label="労災"
                        getRadio={this.getRadio.bind(this)}
                        value={this.state.accident}
                        name="accident"
                        isDisabled={this.karte_mode == KARTEMODE.READ ? true: this.state.canAccident == true ? true : false}
                      />
                      <Checkbox
                        label="自賠"
                        getRadio={this.getRadio.bind(this)}
                        value={this.state.ration}
                        name="ration"
                        isDisabled={this.karte_mode == KARTEMODE.READ ? true: this.state.canRation == true ? true : false}
                      />
                      <Checkbox
                        label="併用自賠"
                        getRadio={this.getRadio.bind(this)}
                        value={this.state.disease_ration}
                        name="disease_ration"
                        isDisabled={this.karte_mode == KARTEMODE.READ ? true: this.state.canDiseaseRation == true ? true : false}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex disease-search-bound">
                <div className="disease-name-search">
                  <h2>病名入力</h2>
                </div>
                <div className="flex disease-name-div">
                  <div className="disease-name">
                    <InputWithLabel
                      label=""
                      type="text"
                      diseaseEditData={this.state.disease_combine_name}
                    />
                    <Button className="clear-button clear-btn" onClick={this.handleClear.bind(this)}>C</Button>
                  </div>
                </div>
                <div className="search-tab-list">
                  <SearchUl className="nav nav-tabs category-tabs">{tags}</SearchUl>
                  <div className="tab-list">
                    {(() => {
                      switch (parseInt(this.state.search_tab)) {
                        case 1:
                          return diseaseInputType1;
                        case 2:
                          return diseaseInputType2;
                        case 3:
                          return diseaseInputType3;
                        case 4:
                          return diseaseInputType4;
                        case 5:
                          return diseaseInputType5;
                        case 6:
                          return diseaseInputType6;
                      }
                    })()}
                  </div>
                </div>
              </div>
              <ContextMenu {...this.state.contextMenu}
                 parent={this}
                 karte_mode = {this.karte_mode == KARTEMODE.READ}
              />
              <ContextMenu_Freq {...this.state.contextMenu_freq} parent={this} />
              {this.state.dieaseNameShow && (
                <DiseaseNameListPopup
                  isLoadData={this.state.isLoadData}
                  dieaseNameShow={this.state.dieaseNameShow}
                  diseaseList={this.state.diseaseNameList}
                  insertMed={this.insertMed}
                  dieaseNameClose={this.dieaseNameClose}
                />
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
              {this.state.showAlert == true && this.state.alert_message != "" && (
                <SystemAlertModal
                  hideModal= {this.closeAlert}
                  handleOk= {this.closeAlert}
                  showMedicineContent= {this.state.alert_message}
                />
              )}
              {this.state.isDiseaseNameOutcomeModal && (
                <DiseaseNameOutcomeModal
                  patientId= {this.props.patientId}
                  detailedPatientInfo= {this.props.detailedPatientInfo != null && this.props.detailedPatientInfo != undefined ? this.props.detailedPatientInfo : this.detailedPatientInfo}
                  closeModal= {this.closeOutcomeModal}
                  showMedicineContent= {this.state.alert_message}
                />
              )}
              
              {this.state.isDeleteConfirmModal !== false && (
                <SystemConfirmJapanModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.deleteFreqDisease.bind(this)}
                  confirmTitle= {this.state.confirm_message}
                />
              )}
              {this.state.isOpenClearDiseaseConfirmPopup !== false && (
                <SystemConfirmJapanModal
                  hideConfirm= {this.closeModal.bind(this)}
                  confirmCancel= {this.closeModal.bind(this)}
                  confirmOk= {this.clearComment.bind(this)}
                  confirmTitle= {"病名をクリアしますか？"}
                />
              )}
              {this.state.isAddConfirmModal !== false && (
                <SystemConfirmJapanModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.addFreqDisease.bind(this)}
                  confirmTitle= {this.state.confirm_message}
                />
              )}
            </Popup>
          </Modal.Body>
          {this.state.doctors != undefined && this.state.isOpenDoctorSoapModal === true && (
            <SelectDoctorModal
              closeDoctor={this.closeDoctorModal}
              getDoctor={this.getDoctor}
              selectDoctorFromModal={this.selectDoctorFromModal}
              doctors={this.state.doctors}
            />
          )}
        </Modal>
      </>
    );
  }
}
DiseaseNameModal.contextType = Context;

DiseaseNameModal.propTypes = {
  getSelect: PropTypes.func,
  closeModal: PropTypes.func,
  insertMed: PropTypes.func,
  detailedPatientInfo: PropTypes.object,
  patientId: PropTypes.number,
  initTab: PropTypes.string
};

export default DiseaseNameModal;
