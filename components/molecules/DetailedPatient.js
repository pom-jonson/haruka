import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import UsageTab from "./UsageTab";
import PatientBaseInfoPopup from "../organisms/PatientBaseInfoPopup";
import PatientDetailPopup1 from "../organisms/PatientDetailPopup1";
import PatientDetailPopup2 from "../organisms/PatientDetailPopup2";
import PatientDetailPopup3 from "../organisms/PatientDetailPopup3";
import PatientList from "./PatientList";
import AllergyTable from "./Allergy/AllergyTable";
import { Modal } from "react-bootstrap";
import disabled_status_no from "../_demo/Patients_panel_icon/disabled_status_no.png";
import disabled_status_yes from "../_demo/Patients_panel_icon/disabled_status_yes.png";
import drugalergy_status_no from "../_demo/Patients_panel_icon/drugalergy_status_no.png";
import drugalergy_status_yes from "../_demo/Patients_panel_icon/drugalergy_status_yes.png";
import foodalergy_status_no from "../_demo/Patients_panel_icon/foodalergy_status_no.png";
import foodalergy_status_yes from "../_demo/Patients_panel_icon/foodalergy_status_yes.png";
import staff_status_no from "../_demo/Patients_panel_icon/staff_status_no.png";
import staff_status_yes from "../_demo/Patients_panel_icon/staff_status_yes.png";
import ADL_status_no from "../_demo/Patients_panel_icon/ADL_status_no.png";
import ADL_status_yes from "../_demo/Patients_panel_icon/ADL_status_yes.png";
import vaccine_status_no from "../_demo/Patients_panel_icon/vaccine_status_no.png";
import vaccine_status_yes from "../_demo/Patients_panel_icon/vaccine_status_yes.png";
import infection_status_positive from "../_demo/Patients_panel_icon/infection_status_positive.png";
import infection_status_no from "../_demo/Patients_panel_icon/infection_status_no.png";
import infection_status_unknown from "../_demo/Patients_panel_icon/infection_status_unknown.png";
import infection_status_negative from "../_demo/Patients_panel_icon/infection_status_negative.png";
import alergy_status_positive from "../_demo/Patients_panel_icon/alergy_status_positive.png";
import alergy_status_no from "../_demo/Patients_panel_icon/alergy_status_no.png";
import alergy_status_unknown from "../_demo/Patients_panel_icon/alergy_status_unknown.png";
import alergy_status_negative from "../_demo/Patients_panel_icon/alergy_status_negative.png";
import navigation_status from "../_demo/Patients_panel_icon/navigation_status.png";
import introduction_status from "../_demo/Patients_panel_icon/introduction_status.png";
import Button from "~/components/atoms/Button";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as apiClient from "~/api/apiClient";
import Context from "~/helpers/configureStore";
import ValidateAlertModal from '~/components/molecules/ValidateAlertModal';
import Spinner from "react-bootstrap/Spinner";
import {formatDateLine} from "~/helpers/date";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import * as karteApi from "~/helpers/cacheKarte-utils";
import DeathRegister from "~/components/templates/Patient/DeathRegister";
import $ from "jquery";

const Ul = styled.ul`
  width: 100%;

  &.nav {
    padding-left: 0px;
  }

  > li > div {
    cursor: pointer;
  }
  li div {
    font-size: 30px;
  }
`;

const PatientDiv = styled.div`
  display: flex;
  width: 100%;
`;

const PatientUl = styled.ul`
  width: 100%;
  list-style: none;
  padding: 0;
`;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
`;

const ModalContent = styled.div`
  &.modal-content {
    width: 100%;
  }
  .div-content-scroll{
    padding: 1rem;
    overflow: hidden;
    height: 54vh;
  }
  .fifth_tab {
    .allergy-btn button span {
      font-size: 1rem;
    }
    .red-btn {
      background: #cc0000;
      border: solid 2px #cc0000;
      span {
        color: #ffffff;
      }
    }
    .red-btn:hover {
      background: #e81123;
      border: solid 2px #e81123;
      span {
        color: #ffffff;
      }
    }
    .delete-btn {
      border: solid 2px #4285f4;
      background: #ffffff;
      span {
        color: #4285f4;
      }
    }
    .delete-btn:hover {
      background: #4285f4;
      span {
        color: #ffffff;
      }
    }
    .disable-btn {
      background: #d3d3d3;
      span {
        color: #595959;
      }
    }
    .disable-btn:hover {
      background: #d3d3d3;
      span {
        color: #595959;
      }
    }
  }
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
      font-size: 16px;
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

const ContextMenu = ({visible, x, y, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction("open_death_register")}>死亡登録</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

const patientTags = [
  {
    id: 1,
    name: "患者情報"
  },
  {
    id: 3,
    name: "住所情報"
  },
  {
    id: 4,
    name: "保険情報"
  },
  {
    id: 5,
    name: "保険パターン"
  },
  {
    id: 6,
    name: 'アレルギー'
  }
];

const PatientListPropTypes = {
  patientListTitle: PropTypes.string.isRequired,
  patientListValue: PropTypes.string.isRequired
};

PatientList.propTypes = PatientListPropTypes;

class DetailedPatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailedPatient: {
        patient: [],
        address: [],
        insurance: [],
        insurance_pattern: [],
        allergy: [],
      },
      addressTags: [],
      insuranceTags: [],
      insurancePatternTags: [],
      allergyTags: [
        {id:401, name:'アレルギー薬剤'},
        {id:402, name:'アレルギー食物'},
        {id:403, name:'造影剤'},
        {id:404, name:'その他アレルギー'},
        {id:405, name:'皮内テスト'},
        {id:406, name:'インプラント'},
      ],
      tab: this.props.tabIndex,
      disabled_status_no: 1,
      disabled_status_yes: 0,
      drugalergy_status_no: 1,
      drugalergy_status_yes: 0,
      foodalergy_status_no: 1,
      foodalergy_status_yes: 0,
      staff_status_no: 1,
      staff_status_yes: 0,
      ADL_status_no: 1,
      ADL_status_yes: 0,
      vaccine_status_no: 1,
      vaccine_status_yes: 0,
      infection_status_positive: 0,
      infection_status_no: 0,
      infection_status_unknown: 0,
      infection_status_negative: 0,
      alergy_status_positive: 0,
      alergy_status_no: 0,
      alergy_status_unknown: 0,
      alergy_status_negative: 0,
      navigation_status: 0,
      introduction_status: 0,
      alert_message: '',
      alert_messages: '',
      complete_message: '',
      allergy_data:{},
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      isCancelAllergyModal: false,
      allergy_loaded:false,
      isOpenDeathRegister:false,
    };
    this.original_allergy=null;
    this.allergy_validate_msg={
      1:{allergen_id: "アレルギー薬剤を入力して下さい。", start_date:"アレルギー薬剤の開始日を入力して下さい。", symptom: "アレルギー薬剤の症状を入力して下さい。"},
      2:{allergen_id: "アレルギー食物を入力して下さい。", start_date:"アレルギー食物の開始日を入力して下さい。", symptom: "アレルギー食物の症状を入力して下さい。"},
      3:{allergen_id: "アレルギー造影剤を入力して下さい。", start_date:"造影剤の開始日を入力して下さい。", symptom: "造影剤の症状を入力して下さい。"},
      4:{allergen_id: "アレルゲンを入力して下さい。", start_date:"その他アレルギーの開始日を入力して下さい。", symptom: "その他アレルギーの症状を入力して下さい。"},
      5:{allergen_id: "皮内テストを入力して下さい。", start_date:"皮内テストの診断日を入力して下さい。", symptom: "皮内テストの結果を入力して下さい。"},
      6:{allergen_id: "インプラントの種類を選択してください。", start_date:"インプラントの装着日を入力して下さい。", symptom: "インプラントの部位を入力して下さい。"},
    };
  }

  selectTab = e => {
    this.setState({ tab: e.target.id });
  };

  getSelectedTag = id => {
    const tab = parseInt(this.state.tab);
    if (id == 5 && tab > 300) return true; /* 保険パターン */
    if (id == 4 && tab > 200 && tab < 300) return true; /* 保険情報 */
    if (id == 3 && tab > 100 && tab < 200) return true; /* 保険情報 */
    if (id == this.state.tab) return true;
    return false;
  };

  async UNSAFE_componentWillMount () {
    let allergy_data = await this.getAllergyData();
    this.original_allergy = JSON.parse(JSON.stringify(allergy_data));
    this.setState({
      allergy_data,
      allergy_loaded: true,
    });
  }

  async componentDidMount() {
    const detailedPatient = this.props.detailedPatientInfo;
    const addressTags = [];
    const insuranceTags = [];
    const insurancePatternTags = [];
    if (detailedPatient.address !== undefined && detailedPatient.address !== null) {
      detailedPatient.address.map((address, key) => {
        addressTags.push({
          id: key + 101,
          name: "住所情報" + (key + 1)
        });
      });
    }
    if (detailedPatient.insurance !== undefined && detailedPatient.insurance !== null) {
      detailedPatient.insurance.map((insurance, key) => {
        insuranceTags.push({
          id: key + 201,
          name: "保険情報" + (key + 1)
        });
      });
    }

    if (detailedPatient.insurance !== undefined && detailedPatient.insurance !== null) {
      detailedPatient.insurance_pattern.map((insurance, key) => {
        insurancePatternTags.push({
          id: key + 301,
          name: "パターン" + (key + 1)
        });
      })
    }
    // let allergy_data = await this.getAllergyData();
    this.setState({ detailedPatient, addressTags, insuranceTags, insurancePatternTags });
  }

  async getAllergyData () {
    let allergy_data = {};
    let path = "/app/api/v2/allergy/getAllergy";
    let post_data = {
      system_patient_id:this.props.detailedPatientInfo.patient[0].system_patient_id,
    };
    await apiClient.post(path, {
      params: post_data
    }).then((res) => {
      if (res)
        allergy_data = res;
      Object.keys(allergy_data).map(index=>{
        let item = allergy_data[index];
        item.map((sub_item)=>{
          if(sub_item.allergen_name != "" && sub_item.allergen_id > 0) {
            if (sub_item.start_date != null)
              sub_item.start_date = new Date(sub_item.start_date);
          }
        });
      });
    });
    return allergy_data;
  }

  isMounted = false;

  async componentWillUnmount() {
    this.isMounted = false;
  }

  getRadio = (name, value) => {
    switch (name) {
      case "disabled_status_no":
        return this.setState(
          { disabled_status_no: value, disabled_status_yes: value ? 0 : 1 },
          () => {
            if (this.state.disabled_status_no == 1) {
              this.props.getSelected("disabled_status_no");
            } else {
              this.props.getSelected("disabled_status_yes");
            }
          }
        );
      case "disabled_status_yes":
        return this.setState(
          { disabled_status_yes: value, disabled_status_no: value ? 0 : 1 },
          () => {
            if (this.state.disabled_status_no == 1) {
              this.props.getSelected("disabled_status_no");
            } else {
              this.props.getSelected("disabled_status_yes");
            }
          }
        );
      case "drugalergy_status_no":
        return this.setState(
          { drugalergy_status_no: value, drugalergy_status_yes: value ? 0 : 1 },
          () => {
            if (this.state.drugalergy_status_no == 1) {
              this.props.getSelected("drugalergy_status_no");
            } else {
              this.props.getSelected("drugalergy_status_yes");
            }
          }
        );
      case "drugalergy_status_yes":
        return this.setState(
          { drugalergy_status_yes: value, drugalergy_status_no: value ? 0 : 1 },
          () => {
            if (this.state.drugalergy_status_no == 1) {
              this.props.getSelected("drugalergy_status_no");
            } else {
              this.props.getSelected("drugalergy_status_yes");
            }
          }
        );
      case "foodalergy_status_no":
        return this.setState(
          { foodalergy_status_no: value, foodalergy_status_yes: value ? 0 : 1 },
          () => {
            if (this.state.foodalergy_status_no == 1) {
              this.props.getSelected("foodalergy_status_no");
            } else {
              this.props.getSelected("foodalergy_status_yes");
            }
          }
        );
      case "foodalergy_status_yes":
        return this.setState(
          { foodalergy_status_yes: value, foodalergy_status_no: value ? 0 : 1 },
          () => {
            if (this.state.foodalergy_status_no == 1) {
              this.props.getSelected("foodalergy_status_no");
            } else {
              this.props.getSelected("foodalergy_status_yes");
            }
          }
        );
      case "staff_status_no":
        return this.setState(
          { staff_status_no: value, staff_status_yes: value ? 0 : 1 },
          () => {
            if (this.state.staff_status_no == 1) {
              this.props.getSelected("staff_status_no");
            } else {
              this.props.getSelected("staff_status_yes");
            }
          }
        );
      case "staff_status_yes":
        return this.setState(
          { staff_status_yes: value, staff_status_no: value ? 0 : 1 },
          () => {
            if (this.state.staff_status_no == 1) {
              this.props.getSelected("staff_status_no");
            } else {
              this.props.getSelected("staff_status_yes");
            }
          }
        );
      case "ADL_status_no":
        return this.setState(
          { ADL_status_no: value, ADL_status_yes: value ? 0 : 1 },
          () => {
            if (this.state.ADL_status_no == 1) {
              this.props.getSelected("ADL_status_no");
            } else {
              this.props.getSelected("ADL_status_yes");
            }
          }
        );
      case "ADL_status_yes":
        return this.setState(
          { ADL_status_yes: value, ADL_status_no: value ? 0 : 1 },
          () => {
            if (this.state.ADL_status_no == 1) {
              this.props.getSelected("ADL_status_no");
            } else {
              this.props.getSelected("ADL_status_yes");
            }
          }
        );
      case "vaccine_status_no":
        return this.setState(
          { vaccine_status_no: value, vaccine_status_yes: value ? 0 : 1 },
          () => {
            if (this.state.vaccine_status_no == 1) {
              this.props.getSelected("vaccine_status_no");
            } else {
              this.props.getSelected("vaccine_status_yes");
            }
          }
        );
      case "vaccine_status_yes":
        return this.setState(
          { vaccine_status_yes: value, vaccine_status_no: value ? 0 : 1 },
          () => {
            if (this.state.vaccine_status_no == 1) {
              this.props.getSelected("vaccine_status_no");
            } else {
              this.props.getSelected("vaccine_status_yes");
            }
          }
        );
      case "infection_status_positive":
        return this.setState(
          {
            infection_status_positive: value,
            infection_status_no: 0,
            infection_status_unknown: 0,
            infection_status_negative: 0
          },
          () => {
            if (value == 1) {
              this.props.getSelected("infection_status_positive");
            } else {
              this.props.getSelected("infection_status_init");
            }
          }
        );
      case "infection_status_no":
        return this.setState(
          {
            infection_status_positive: 0,
            infection_status_no: value,
            infection_status_unknown: 0,
            infection_status_negative: 0
          },
          () => {
            if (value == 1) {
              this.props.getSelected("infection_status_no");
            } else {
              this.props.getSelected("infection_status_init");
            }
          }
        );
      case "infection_status_unknown":
        return this.setState(
          {
            infection_status_positive: 0,
            infection_status_no: 0,
            infection_status_unknown: value,
            infection_status_negative: 0
          },
          () => {
            if (value == 1) {
              this.props.getSelected("infection_status_unknown");
            } else {
              this.props.getSelected("infection_status_init");
            }
          }
        );
      case "infection_status_negative":
        return this.setState(
          {
            infection_status_positive: 0,
            infection_status_no: 0,
            infection_status_unknown: 0,
            infection_status_negative: value
          },
          () => {
            if (value == 1) {
              this.props.getSelected("infection_status_negative");
            } else {
              this.props.getSelected("infection_status_init");
            }
          }
        );
      case "alergy_status_positive":
        return this.setState(
          {
            alergy_status_positive: value,
            alergy_status_no: 0,
            alergy_status_unknown: 0,
            alergy_status_negative: 0
          },
          () => {
            if (value == 1) {
              this.props.getSelected("alergy_status_positive");
            } else {
              this.props.getSelected("alergy_status_init");
            }
          }
        );
      case "alergy_status_no":
        return this.setState(
          {
            alergy_status_positive: 0,
            alergy_status_no: value,
            alergy_status_unknown: 0,
            alergy_status_negative: 0
          },
          () => {
            if (value == 1) {
              this.props.getSelected("alergy_status_no");
            } else {
              this.props.getSelected("alergy_status_init");
            }
          }
        );
      case "alergy_status_unknown":
        return this.setState(
          {
            alergy_status_positive: 0,
            alergy_status_no: 0,
            alergy_status_unknown: value,
            alergy_status_negative: 0
          },
          () => {
            if (value == 1) {
              this.props.getSelected("alergy_status_unknown");
            } else {
              this.props.getSelected("alergy_status_init");
            }
          }
        );
      case "alergy_status_negative":
        return this.setState(
          {
            alergy_status_positive: 0,
            alergy_status_no: 0,
            alergy_status_unknown: 0,
            alergy_status_negative: value
          },
          () => {
            if (value == 1) {
              this.props.getSelected("alergy_status_negative");
            } else {
              this.props.getSelected("alergy_status_init");
            }
          }
        );
      case "navigation_status":
        return this.setState({ navigation_status: value });
      case "introductin_status":
        return this.setState({ introduction_status: value });
    }
  };

  saveAllergy = (allergy_category, data)=> {
    let {allergy_data} = this.state;
    allergy_data[allergy_category]=data;
    this.setState({allergy_data, allergy_changed:true});
  };

  registerAllergy = () =>{
    if(!this.state.allergy_changed) return;
    let allergy_data = this.state.allergy_data;
    let error_str_array = [];
    Object.keys(allergy_data).map(index=>{
      let item = allergy_data[index];
      item.map((sub_item)=>{
        if (sub_item.allergen_name != '' || sub_item.start_date != '' || sub_item.symptom != ''){
          if(!(sub_item.allergen_id > 0)) {
            error_str_array.push(this.allergy_validate_msg[sub_item.category_id]['allergen_id']);
          }
          if(sub_item.start_date == "" || sub_item.start_date == null) {
            error_str_array.push(this.allergy_validate_msg[sub_item.category_id]['start_date']);
          }
          if(!(sub_item.symptom != "")) {
            error_str_array.push(this.allergy_validate_msg[sub_item.category_id]['symptom']);
          }
        }
      });
    });
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: "保存しますか?",
    });
  };
  closeAlertModal = () => {
    this.setState({
      alert_message: '',
      alert_messages: '',
    });
  }

  confirmCancel=()=>{
    this.setState({
      isUpdateConfirmModal: false,
      isCloseConfirmModal: false,
      isCancelAllergyModal: false,
      confirm_message: "",
      isOpenDeathRegister:false,
    });
  }

  postAllergyData = async () =>{
    this.confirmCancel();
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let path = "/app/api/v2/allergy/registerAllergy";
    let allergy_data = this.state.allergy_data;
    Object.keys(allergy_data).map(index=> {
      let item = allergy_data[index];
      if (item.length>0) {
        item.map(sub_item=>{
          if (sub_item.allergen_id > 0 && sub_item.start_date != '' && sub_item.start_date != null) {
            sub_item.start_date = formatDateLine(sub_item.start_date);
          }
        })
      }
    })
    let post_data = {
      system_patient_id:this.props.detailedPatientInfo.patient[0].system_patient_id,
      doctor_code:authInfo.staff_category == 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
      doctor:authInfo.staff_category == 1 ? authInfo.name : this.context.selectedDoctor.name,
      allergy_data,
    };
    this.setState({alert_messages: '保存しました。'});
    await apiClient.post(path, {params: post_data});
    allergy_data = await this.getAllergyData();
    this.original_allergy = JSON.parse(JSON.stringify(allergy_data));
    this.setState({
      allergy_data,
      allergy_changed:false,
    });
    this.props.patientInfoRefresh();
  };

  closeModal = () =>{
    if(this.state.allergy_changed) {
      this.setState({
        isCloseConfirmModal:true,
        confirm_message:"未保存のアレルギー情報があります。変更を破棄して閉じますか？"
      })
    } else
      this.props.closeModal();
  };

  closeConfirm = () =>{
    this.setState({
      isCloseConfirmModal:false,
      confirm_message:""
    });
    this.props.closeModal();
  };

  cancelAllergy = () =>{
    if(this.state.allergy_changed){
      this.setState({
        isCancelAllergyModal:true,
        confirm_message:"変更を破棄しますか？"
      });
    }
  };

  cancelAllergyData = () =>{
    this.confirmCancel();
    let original_allergy = JSON.parse(JSON.stringify(this.original_allergy));
    Object.keys(original_allergy).map(index=> {
      let item = original_allergy[index];
      if (item.length>0) {
        item.map(sub_item=>{
          if (sub_item.allergen_id > 0 && sub_item.start_date != '' && sub_item.start_date != null) {
            sub_item.start_date = new Date(sub_item.start_date);
          }
        })
      }
    })
    this.setState({
      allergy_data:original_allergy,
      allergy_changed:false,
    });
  };

  handleClick=(e, tag_id)=>{
    if(tag_id != 1){return;}
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
      if (!this.context.$canDoAction(this.context.FEATURES.DEATH_REGISTER,this.context.AUTHS.REGISTER)) {
        return;
      }
      if (karteApi.isDeathPatient(this.props.detailedPatientInfo.patient[0].system_patient_id)){
        return true;
      }
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - parseInt($('.tab-id-'+tag_id).offset().left),
          y: e.clientY - 120,
        },
      })
    }
  };

  contextMenuAction=(act)=> {
    if(act == "open_death_register" ){
      this.setState({isOpenDeathRegister:true});
    }
  };

  render() {
    const { detailedPatient } = this.state;

    const patientListsInfo = [
      {
        patientListTitle: "カナ氏名:",
        patientListValueKey: "patient_name_kana"
      },
      {
        patientListTitle: "漢字氏名:",
        patientListValueKey: "patient_name"
      },
      {
        patientListTitle: "性別:",
        patientListValueKey: "gender"
      },
      {
        patientListTitle: "生年月日:",
        patientListValueKey: "birthday"
      },
      {
        patientListTitle: "旧カナ氏名:",
        patientListValueKey: "patient_old_name_kana"
      },
      {
        patientListTitle: "旧漢字氏名:",
        patientListValueKey: "patient_old_name"
      },
      {
        patientListTitle: "旧氏名有効期限:",
        patientListValueKey: "patient_old_name_limit_str"
      },
      {
        patientListTitle: "血液型:",
        patientListValueKey: "blood_type"
      },
      {
        patientListTitle: "出生時体重:",
        patientListValueKey: "birth_weight"
      },
      {
        patientListTitle: "職種:",
        patientListValueKey: "job_category"
      },
      {
        patientListTitle: "患者区分1名称:",
        patientListValueKey: "patient_category_1_name"
      }
    ];

    const addressListsInfo = [
      {
        patientListTitle: "住所区分:",
        patientListValueKey: "address_type"
      },
      {
        patientListTitle: "名称:",
        patientListValueKey: "address_name"
      },
      {
        patientListTitle: "郵便番号:",
        patientListValueKey: "postal_code"
      },
      {
        patientListTitle: "電話番号1:",
        patientListValueKey: "phone_number_1"
      },
      {
        patientListTitle: "電話番号2:",
        patientListValueKey: "phone_number_2"
      },
      {
        patientListTitle: "住所:",
        patientListValueKey: "address"
      },
      {
        patientListTitle: "コメント1:",
        patientListValueKey: "comment_1"
      },
      {
        patientListTitle: "コメント2:",
        patientListValueKey: "comment_2"
      }
    ];

    const insuranceListsInfo = [
      {
        patientListTitle: "保険／公費識別:",
        patientListValueKey: "insurance_public_expense_flag"
      },
      {
        patientListTitle: "保険区分:",
        patientListValueKey: "insurance_type"
      },
      {
        patientListTitle: "保険名称:",
        patientListValueKey: "insurance_name"
      },
      {
        patientListTitle: "保険名称（略称）:",
        patientListValueKey: "insurance_short_name"
      },
      {
        patientListTitle: "保険者番号:",
        patientListValueKey: "insurer_number"
      },
      {
        patientListTitle: "保険証記号:",
        patientListValueKey: "insurance_card_sign"
      },
      {
        patientListTitle: "保険証／受給者番号:",
        patientListValueKey: "insurance_card_pensioner_no"
      },
      {
        patientListTitle: "保険証枝番:",
        patientListValueKey: "insurance_card_branch_number"
      },
      {
        patientListTitle: "続柄:",
        patientListValueKey: "connection_type"
      },
      {
        patientListTitle: "給付割合（外来）:",
        patientListValueKey: "benefit_ratio_outpatient"
      },
      {
        patientListTitle: "給付割合（入院）:",
        patientListValueKey: "benefit_ratio_inpatient"
      },
      {
        patientListTitle: "負担率切替年月:",
        patientListValueKey: "charge_ratio_switching_date"
      }
    ];

    const insurancePatternListsInfo = [
      {
        patientListTitle: "診療科:",
        patientListValueKey: "hospital_department"
      },

      {
        patientListTitle: "保険負担率（外来）:",
        patientListValueKey: "insurance_charge_ratio_outpatient"
      },
      {
        patientListTitle: "保険負担率（入院）:",
        patientListValueKey: "insurance_charge_ratio_inpatient"
      },
      {
        patientListTitle: "保険正式名称:",
        patientListValueKey: "insurance_legal_name"
      },
      {
        patientListTitle: "保険略称:",
        patientListValueKey: "insurance_short_name"
      },
      {
        patientListTitle: "保険種別:",
        patientListValueKey: "insurance_type"
      },
      {
        patientListTitle: "有効開始日:",
        patientListValueKey: "valid_start_date"
      },
      {
        patientListTitle: "有効終了日:",
        patientListValueKey: "valid_end_date"
      }
    ];

    const patientItems = detailedPatient.patient.map((patient, key) => (
      <PatientDiv key={key}>
        <PatientUl>
          {patientListsInfo.map((patientList, key) => {
            return (
              <PatientList
                patientListTitle={patientList.patientListTitle}
                patientListValue={patient[patientList.patientListValueKey]}
                key={key}
              />
            );
          })}
        </PatientUl>

        {/*<PatientUl>*/}
        {/*{patientDescListsInfo.map((patientDescList, key) => {*/}
        {/*<PatientList*/}
        {/*patientListTitle={patientDescList.patientListTitle}*/}
        {/*patientListValue={patient[patientDescList.patientListValueKey]}*/}
        {/*key={key}*/}
        {/*/>;*/}
        {/*})}*/}
        {/*</PatientUl>*/}
      </PatientDiv>
    ));

    const addressTag = this.state.addressTags.map(tag => (
      <UsageTab
        key={tag.id}
        id={tag.id}
        name={tag.name}
        selectTab={this.selectTab}
        active={this.getSelectedTag(tag.id)}
      />
    ));

    const addressItems = [];
    if (detailedPatient.address !== undefined && detailedPatient.address !== null) {
      detailedPatient.address.map((address, key) => {
        addressItems.push(
          <>
            <Ul className="nav nav-tabs child-tabs">{addressTag}</Ul>
            <PatientDiv key={key}>
              <PatientUl>
                {addressListsInfo.map((addressList, key) => {
                  return (
                    <PatientList
                      patientListTitle={addressList.patientListTitle}
                      patientListValue={address[addressList.patientListValueKey]}
                      key={key}
                    />
                  );
                })}
              </PatientUl>
            </PatientDiv>
          </>
        );
      });
    }

    const insuranceTag = this.state.insuranceTags.map(tag => (
      <UsageTab
        key={tag.id}
        id={tag.id}
        name={tag.name}
        selectTab={this.selectTab}
        active={this.getSelectedTag(tag.id)}
      />
    ));


    const insuranceItems = [];
    if (detailedPatient.insurance !== undefined && detailedPatient.insurance !== null) {
      detailedPatient.insurance.map((insurance, key) =>{        
        insuranceItems.push(
          <>
            <Ul className="nav nav-tabs child-tabs">{insuranceTag}</Ul>
            <PatientDiv key={key}>
              <PatientUl style={{overflowY:"scroll",height:"45vh"}}>
                {insuranceListsInfo.map((insuranceList, key) => {
                  return (
                    <PatientList
                      patientListTitle={insuranceList.patientListTitle}
                      patientListValue={
                        insurance[insuranceList.patientListValueKey]
                      }
                      key={key}
                    />
                  );
                })}
              </PatientUl>

              {/*<PatientUl>*/}
              {/*{insuranceDescListsInfo.map((insuranceDescList, key) => {*/}
              {/*<PatientList*/}
              {/*patientListTitle={insuranceDescList.patientListTitle}*/}
              {/*patientListValue={*/}
              {/*insurance[insuranceDescList.patientListValueKey]*/}
              {/*}*/}
              {/*key={key}*/}
              {/*/>;*/}
              {/*})}*/}
              {/*</PatientUl>*/}
            </PatientDiv>
          </>
        )
      });
    }

    const insurancePatternTags = this.state.insurancePatternTags.map(tag => (
      <UsageTab
        key={tag.id}
        id={tag.id}
        name={tag.name}
        selectTab={this.selectTab}
        active={this.getSelectedTag(tag.id)}
      />
    ));

    const insurancePatternItems = [];
    if (detailedPatient.insurance !== undefined && detailedPatient.insurance !== null) {
      detailedPatient.insurance_pattern.map(
        (insurance, key) => (
          insurancePatternItems.push(
            <>
              <Ul className="nav nav-tabs child-tabs">{insurancePatternTags}</Ul>
              <PatientDiv key={key}>
                <PatientUl>
                  {insurancePatternListsInfo.map((insurancePatternList, key) => {
                    return (
                      <PatientList
                        patientListTitle={insurancePatternList.patientListTitle}
                        patientListValue={
                          insurance[insurancePatternList.patientListValueKey]
                        }
                        key={key}
                      />
                    );
                  })}
                </PatientUl>
              </PatientDiv>
            </>
          )
        )
      );
    }
    const allergyTags = this.state.allergyTags.map(tag => (
      <UsageTab
        key={tag.id}
        id={tag.id}
        name={tag.name}
        selectTab={this.selectTab}
        active={this.getSelectedTag(tag.id)}
      />
    ))
    const allergyItems = [];
    if (this.state.allergy_loaded) {
      allergyTags.map((item, key) => {
        allergyItems.push(
          <>
            <Ul className="nav nav-tabs child-tabs">{allergyTags}</Ul>
            <PatientDiv key={key}>
              <AllergyTable
                key = {key}
                allergy_kind = {key}
                saveData={this.saveAllergy}
                allergy_data={this.state.allergy_data}
                loaded={this.state.allergy_loaded}
                patient_id={this.props.detailedPatientInfo.patient[0].system_patient_id}
              />
            </PatientDiv>
            <div style={{textAlign:"right", marginTop:"5px"}} className="allergy-btn">
              <Button className={this.state.allergy_changed ? "delete-btn mr-1" : "disable-btn mr-1"} onClick={this.cancelAllergy}>破棄</Button>
              <Button onClick={this.registerAllergy} className={this.state.allergy_changed ? "red-btn" : "disable-btn"}>確定</Button>
            </div>
          </>
        )
      })
    }

    const { tab } = this.state;

    const Item = styled.li`
      font-family: NotoSansJP;
      font-size: 12px;
    `;

    const tags = patientTags.map((tag) => (
      <Item className={"nav-item " + "tab-id-" + tag.id} onClick={this.selectTab} key={tag.id} onContextMenu={e => this.handleClick(e, tag.id)}>
        <div id={tag.id} className={`nav-link ${this.getSelectedTag(tag.id) ? "active" : ""}`}>
          {tag.name}
        </div>
      </Item>
    ));

    return (
      <Modal show={true} size="xl" className="patient-detail-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>患 者 詳 細 情 報</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModalContent className="modal-content">
            <div className="modal-body">
              <Ul className="nav nav-tabs category-tabs">{tags}</Ul>
              <div className={`div-content-scroll ${this.state.tab == 1 ? "first-tab" : this.state.tab >= 101 && this.state.tab <= 110 ? "second-tab" :
                this.state.tab >= 201 && this.state.tab <= 210 ? "third-tab" : this.state.tab >= 301 && this.state.tab <= 310 ? "forth-tab" :
                  this.state.tab>=401 && this.state.tab<500?'fifth_tab':""}`}>
                {(() => {
                  switch (parseInt(tab)) {
                    case 1:
                      return patientItems;
                    case 2:
                      return (
                        <PatientBaseInfoPopup
                          patientId={this.props.patientId}
                        />
                      );
                    case 3: {
                      if (addressItems[0] == undefined) {
                        return <span>データ無し</span>;
                      } else {
                        this.setState({ tab: "101" });
                        return addressItems[0];
                      }
                    }
                    case 4: {
                      if (insuranceItems[0] == undefined) {
                        return <span>データ無し</span>;
                      } else {
                        this.setState({ tab: "201" });
                        return insuranceItems[0];
                      }
                    }
                    case 5:
                      if (insurancePatternItems[0] == undefined) {
                        return <span>データ無し</span>;
                      } else {
                        this.setState({ tab: "301" });
                        return insurancePatternItems[0];
                      }
                    case 6:
                      if(this.state.allergy_loaded == false){
                        return (
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                        );
                      } else {
                        if (allergyItems[0] == undefined){
                          return <span>データ無し</span>;
                        } else {
                          this.setState({ tab: "401" });
                          return allergyItems[0];
                        }
                      }

                    case 7:
                      return;
                    case 8:
                      return;
                    // return (
                    //   <DiseaseNamePopup patientId={this.props.patientId} />
                    // );
                    case 9:
                      return (
                        <PatientDetailPopup3
                          title="ナビゲーション"
                          label=" : クリックすると未承認対象データがあれば、ナビゲーション画面が起動します。"
                          status={this.state.navigation_status}
                          img={navigation_status}
                          name={"navigation_status"}
                          getRadio={this.getRadio.bind(this)}
                        />
                      );
                    case 10:
                      return (
                        <PatientDetailPopup3
                          title="紹介情報"
                          label=" : 地域連携オプション機能が起動します。"
                          status={this.state.introduction_status}
                          img={introduction_status}
                          name={"introduction_status"}
                          getRadio={this.getRadio.bind(this)}
                        />
                      );
                    case 11:
                      return (
                        <PatientDetailPopup2
                          title="感染症"
                          label_positive=" : 感染症情報にて陽性結果があれば左記アイコンとなります。"
                          label_no=" : 感染症情報にてすべて未検査の場合は左記アイコンとなります。"
                          label_unknown=" : 感染症情報にて陽性結果がなく、不明結果があれば、左記アイコンとなります。"
                          label_negative=" : 感染症情報にて陽性結果も不明結果もなく、陰性結果があれば左記アイコンとなります。"
                          status_positive={this.state.infection_status_positive}
                          status_no={this.state.infection_status_no}
                          status_unknown={this.state.infection_status_unknown}
                          status_negative={this.state.infection_status_negative}
                          img_positive={infection_status_positive}
                          img_no={infection_status_no}
                          img_unknown={infection_status_unknown}
                          img_negative={infection_status_negative}
                          name_positive={"infection_status_positive"}
                          name_no={"infection_status_no"}
                          name_unknown={"infection_status_unknown"}
                          name_negative={"infection_status_negative"}
                          getRadio={this.getRadio.bind(this)}
                        />
                      );
                    case 12:
                      return (
                        <PatientDetailPopup1
                          title="障害情報"
                          status_no={this.state.disabled_status_no}
                          status_yes={this.state.disabled_status_yes}
                          img_no={disabled_status_no}
                          img_yes={disabled_status_yes}
                          name_no={"disabled_status_no"}
                          name_yes={"disabled_status_yes"}
                          getRadio={this.getRadio.bind(this)}
                        />
                      );
                    case 13:
                      return (
                        <PatientDetailPopup2
                          title="一般アレルギー"
                          label_positive=" : 一般アレルギー情報にて陽性結果があれば左記アイコンとなります。"
                          label_no=" : 一般アレルギー情報にてすべて未検査の場合は左記アイコンとなります。"
                          label_unknown=" : 一般アレルギー情報にて陽性結果がなく、不明結果があれば、左記アイコンとなります。"
                          label_negative=" : 一般アレルギー情報にて陽性結果も不明結果もなく、陰性結果があれば左記アイコンとなります。"
                          status_positive={this.state.alergy_status_positive}
                          status_no={this.state.alergy_status_no}
                          status_unknown={this.state.alergy_status_unknown}
                          status_negative={this.state.alergy_status_negative}
                          img_positive={alergy_status_positive}
                          img_no={alergy_status_no}
                          img_unknown={alergy_status_unknown}
                          img_negative={alergy_status_negative}
                          name_positive={"alergy_status_positive"}
                          name_no={"alergy_status_no"}
                          name_unknown={"alergy_status_unknown"}
                          name_negative={"alergy_status_negative"}
                          getRadio={this.getRadio.bind(this)}
                        />
                      );
                    case 14:
                      return (
                        <PatientDetailPopup1
                          title="薬剤アレルギー"
                          status_no={this.state.drugalergy_status_no}
                          status_yes={this.state.drugalergy_status_yes}
                          img_no={drugalergy_status_no}
                          img_yes={drugalergy_status_yes}
                          name_no={"drugalergy_status_no"}
                          name_yes={"drugalergy_status_yes"}
                          getRadio={this.getRadio.bind(this)}
                        />
                      );
                    case 15:
                      return (
                        <PatientDetailPopup1
                          title="食物アレルギー"
                          status_no={this.state.foodalergy_status_no}
                          status_yes={this.state.foodalergy_status_yes}
                          img_no={foodalergy_status_no}
                          img_yes={foodalergy_status_yes}
                          name_no={"foodalergy_status_no"}
                          name_yes={"foodalergy_status_yes"}
                          getRadio={this.getRadio.bind(this)}
                        />
                      );
                    case 16:
                      return (
                        <PatientDetailPopup1
                          title="担当職員"
                          status_no={this.state.staff_status_no}
                          status_yes={this.state.staff_status_yes}
                          img_no={staff_status_no}
                          img_yes={staff_status_yes}
                          name_no={"staff_status_no"}
                          name_yes={"staff_status_yes"}
                          getRadio={this.getRadio.bind(this)}
                        />
                      );
                    case 17:
                      return (
                        <PatientDetailPopup1
                          title="ADL情報"
                          status_no={this.state.ADL_status_no}
                          status_yes={this.state.ADL_status_yes}
                          img_no={ADL_status_no}
                          img_yes={ADL_status_yes}
                          name_no={"ADL_status_no"}
                          name_yes={"ADL_status_yes"}
                          getRadio={this.getRadio.bind(this)}
                        />
                      );
                    case 18:
                      return (
                        <PatientDetailPopup1
                          title="患者ワクチン情報"
                          status_no={this.state.vaccine_status_no}
                          status_yes={this.state.vaccine_status_yes}
                          img_no={vaccine_status_no}
                          img_yes={vaccine_status_yes}
                          name_no={"vaccine_status_no"}
                          name_yes={"vaccine_status_yes"}
                          getRadio={this.getRadio.bind(this)}
                        />
                      );
                    default:
                      if (100 < parseInt(tab) && parseInt(tab) <= 200) {
                        return this.state.addressTags.map((tag, key) => {
                          if (parseInt(tab) == key + 101) {
                            return addressItems[key];
                          }
                        });
                      } else if (200 < parseInt(tab) && parseInt(tab) <= 300) {
                        return this.state.insuranceTags.map((tag, key) => {
                          if (parseInt(tab) == key + 201) {
                            return insuranceItems[key];
                          }
                        });
                      } else if (300 < parseInt(tab) && parseInt(tab) <= 400) {
                        return this.state.insurancePatternTags.map((tag, key) => {
                          if (parseInt(tab) == key + 301) {
                            return insurancePatternItems[key];
                          }
                        });
                      } else if (400 < parseInt(tab) && parseInt(tab) <= 500) {
                        return this.state.allergyTags.map((tag, key) => {
                          if (parseInt(tab) == key + 401) {
                            return allergyItems[key];
                          }
                        });
                      }
                  }
                })()}
              </div>
            </div>
          </ModalContent>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.closeModal} className="cancel-btn">キャンセル</Button>
        </Modal.Footer>
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.postAllergyData.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isCloseConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.closeConfirm.bind(this)}
            confirmTitle= {this.state.confirm_message}
            curFocus={1}
            OkBackground="rgb(226, 56, 56)"
          />
        )}
        {this.state.isCancelAllergyModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.cancelAllergyData.bind(this)}
            confirmTitle= {this.state.confirm_message}
            curFocus={1}
            OkBackground="rgb(226, 56, 56)"
          />
        )}
        {this.state.alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeAlertModal.bind(this)}
            handleOk= {this.closeAlertModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.complete_message != "" && (
          <CompleteStatusModal message={this.state.complete_message} />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        {this.state.isOpenDeathRegister && (
          <DeathRegister
            patientInfo={this.props.patientInfo}
            closeModal={this.confirmCancel}
            patientId={this.props.patientId}
            detailedPatientInfo={this.props.detailedPatientInfo}
          />
        )}
      </Modal>
    );
  }
}
DetailedPatient.contextType = Context;
DetailedPatient.propTypes = {
  closeModal: PropTypes.func,
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  tabIndex: PropTypes.string,
  getSelected: PropTypes.func,
  patientInfoRefresh: PropTypes.func,
  detailedPatientInfo: PropTypes.object
};

export default DetailedPatient;
