import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";
import Button from "../atoms/Button";
import MedicineSelection from "../organisms/MedicineSelection";
import DiseaseConsentPopup from "../organisms/DiseaseConsentPopup";
import Checkbox from "../molecules/Checkbox";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import InjectionSelection from "../organisms/InjectionSelection";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import { KEY_CODES } from "../../helpers/constants";
import * as apiClient from "../../api/apiClient";
import { formatDate4API } from "../../helpers/date";
import NotConsentedTable from "~/components/organisms/NotConsentedTable";
import * as sessApi from "~/helpers/cacheSession-utils";

const IS_DEVELOP = process.env.NODE_ENV !== "production";

const PatientsWrapper = styled.div`
  margin: auto;
`;

const injectTitle = {
  marginTop: "10px"
};

const RightDiv = styled.div`
  text-align: right;
  padding: 15px 0px;
`;

class NotConsentedModal extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this); 
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
        notConsentedHistoryData: [],
        notConsentedInjectionHistoryData: [],
        notConsentedAllOrderHistoryData: [],
        notConsentedInspectionHistoryData:[],
        notConsentedEndoscopeHistoryData:[],
        notConsentedGuidanceHistoryData:[],
        notConsentedHomeHistoryData:[],
        notConsentedSpiritHistoryData:[],
        notConsentedRehabilyHistoryData:[],
        notConsentedRadiationHistoryData:[],
        notConsentedExamHistoryData:[],
        notConsentedTreatmentHistoryData:[],
        notConsentedAllergyHistoryData:[],
        notConsentedModal: false,
        isNotConsentedPopupTrue: true,
        isNotConsentedPopupFalse: false,
        notConsentedDataSelect: false,
        notConsentedInjectionDataSelect: false,
        notConsentedInspectionDataSelect: false,
        staff_category: authInfo.staff_category || 2,
        patientInfo: {},
        authInfo: authInfo,
        diseaseList: [],
        confirm_message:"",
        curFocus: 1,
    }
    this.btns = [];
    this.flag = 1; 
  }

  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.left || e.keyCode === KEY_CODES.right) {      
      let fnum = (this.flag + 1) % this.btns.length; 

      this.setState({curFocus : fnum});
      this.flag = fnum;   
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      if (this.flag === 0) {
        this.openConfirmModal();
      }else{
        this.props.closeNotConsentedModal();
      }      
    }
  }

  async componentDidMount() {
    if (
      document.getElementById("notconsented_dlg") !== undefined &&
      document.getElementById("notconsented_dlg") !== null
    ) {
      document.getElementById("notconsented_dlg").focus();
    }
    this.btns = ["btnOK","btnCancel"];
    this.setState({
      curFocus: 1
    });
    this.flag = 1;
    
    if (this.state.staff_category === 1) {
      const insuranceTypeList = this.getInsuranceTypeList();
      await this.getNotConsentedAllOrderHistoryData();
      await this.getNotConsentedHistoryData();
      await this.getNotConsentedInjectionHistoryData();
      await this.getAllDiseaseList();
      this.setState({
        notConsentedModal: true,
        patientInfo: {
          insurance_type_list: insuranceTypeList
        },
      })
    }
  }
  getAllDiseaseList = async () => {
    let data;
    // let cache_data = sessApi.getObject('disease_consented_list');
    // if (cache_data != undefined && cache_data != null) {
    //   data = cache_data;
    //   if (this.props.patientId != undefined && parseInt(this.props.patientId) > 0) {
    //     let disease_list = data.disease_list.filter(x=>x.system_patient_id == this.props.patientId);
    //     data.disease_list = disease_list;
    //   }
    // }
    // else {
      data = await apiClient.get(
        "/app/api/v2/disease_name/search_in_patient",
        {
          params: {
            systemPatientId: this.props.patientId != undefined ? this.props.patientId : 0,
            doctor_code: this.state.authInfo.doctor_code,
            is_doctor_consented: 0
          }
        }
      );
    // } 
    this.setState({diseaseList: data.disease_list});
  };

  getInsuranceTypeList = () => {
    return this.context.insuranceTypeList;
  };

  closeNotConsentedModal = () => {
    this.setState({
      notConsentedModal: false
    });
    if (this.props.closeNotConsentedModal !== undefined)
      this.props.closeNotConsentedModal();
  };

  openNotConsentedModal = () => {
    this.setState({
      notConsentedModal: true
    });
  };

  diseaseConsent = consentList => {
    if (consentList.length === 0) return false;

    let postData = {
      disease: consentList,
      staff_number: this.state.authInfo.user_number
    };

    axios
      .post("/app/api/v2/disease_name/consent", {
        params: postData
      })
      .then(() => {})
      .catch(res => {
        if (res.status == 400 || res.status == 500) {
          if (res.error != undefined && res.error_alert_message != "") {
            alert(res.error_alert_message + "\n");
          }
        }
      });
    return true;
  };

  consent = async postData => {
    axios
      .post("/app/api/v2/order/prescription/doctor_consent", {
        params: postData
      })
      .catch(res => {
        if (res.status == 400 || res.status == 500) {
          if (res.error != undefined && res.error_alert_message != "") {
            alert(res.error_alert_message + "\n");
          }
        }
      });

    this.getNotConsentedHistoryData();
  };

  consentInjection = async injection_postData => {
    axios
      .post("/app/api/v2/order/injection/consent", {
        patient_id: this.props.patientId,
        params: injection_postData
      })
      .catch(res => {
        if (res.status == 400 || res.status == 500) {
          if (res.error != undefined && res.error_alert_message != "") {
            alert(res.error_alert_message + "\n");
          }
        }
      });
    this.getNotConsentedInjectionHistoryData();
  };

  consentAllOrder = async allOrderList_postData => {
    axios
      .post("/app/api/v2/order/consent/allOrder", {
        params: allOrderList_postData
      })
      .catch(res => {
        if (res.status == 400 || res.status == 500) {
          if (res.error != undefined && res.error_alert_message != "") {
            alert(res.error_alert_message + "\n");
          }
        }
      });
    this.getNotConsentedAllOrderHistoryData();
  };

  getNotConsentedInjectionHistoryData = async () => {
    let notConsentedInjectionHistoryData = [];
    let data = null;
    if (this.props.fromConsentedData == 'first_login')
      data = sessApi.getObject('injection_consented_list');
    if (data == undefined || data == null) {
      let params = (params = {
        get_consent_pending: 1
      });
      await axios.get("/app/api/v2/order/injection/find", {
        params: params
      }).then(res=>{
        data = res.data;
      });
      sessApi.setObject("injection_consented_list", data);
    }
    if (data != undefined && data != null) {
      if (this.props.patientId != undefined && this.props.patientId != null && parseInt(this.props.patientId) > 0)
        notConsentedInjectionHistoryData = data.filter(x=>x.patient_id == this.props.patientId);
      else 
        notConsentedInjectionHistoryData = data;
    }

    if (notConsentedInjectionHistoryData.length > 0) {
      notConsentedInjectionHistoryData.map((item, index) => {
        if (index < 3) {
          item.order_data.class_name = "open";
        } else {
          item.order_data.class_name = "";
        }
        item.data_one_select = 0;
      });
    }

    if (this.props.refresh !== undefined) {
      this.props.refresh();
    }

    this.setState({
      notConsentedInjectionHistoryData: notConsentedInjectionHistoryData
    });
    return notConsentedInjectionHistoryData;
  };

  getNotConsentedAllOrderHistoryData = async () => {
    let notConsentedAllOrderHistoryData = [];
    let data = null;
    if (this.props.fromConsentedData == 'first_login')
      data = sessApi.getObject('allOrder_consented_list');
    if (data == undefined || data == null) {
      let params = (params = {
        get_consent_pending: 1,
      });
      await axios.get("/app/api/v2/order/notConsented/findHistory", {
        params: params
      }).then(res=>{
        data = res.data;
      });
      sessApi.setObject("allOrder_consented_list", data);
    }
    if (data != undefined && data != null) {
      if (this.props.patientId != undefined && this.props.patientId != null && parseInt(this.props.patientId) > 0){
        Object.keys(data).map(index=>{
          data[index] = data[index].filter(x=>x.patient_id == this.props.patientId);
        })
      }
      notConsentedAllOrderHistoryData = data; 
    }
    if (Object.keys(notConsentedAllOrderHistoryData).length > 0) {
      Object.keys(notConsentedAllOrderHistoryData).map(order_name => {
          notConsentedAllOrderHistoryData[order_name].map((item, index)=>{
              if (index < 3) {
                  item.class_name = "open";
              } else {
                  item.class_name = "";
              }
              item.data_one_select = 0;
          })
      });
    }

    if (this.props.refresh !== undefined) {
      this.props.refresh();
    }
    let notConsentedInspectionHistoryData = [];
      let notConsentedEndoscopeHistoryData = [];
      let notConsentedGuidanceHistoryData = [];
      let notConsentedRehabilyHistoryData = [];
      let notConsentedRadiationHistoryData = [];
      let notConsentedExamHistoryData = [];
      let notConsentedTreatmentHistoryData = [];
      let notConsentedAllergyHistoryData = [];

      notConsentedInspectionHistoryData = notConsentedAllOrderHistoryData['inspection'] !== undefined ? notConsentedAllOrderHistoryData['inspection'] : [];
      notConsentedEndoscopeHistoryData = notConsentedAllOrderHistoryData['endoscope'] !== undefined ? notConsentedAllOrderHistoryData['endoscope'] : [];
      notConsentedGuidanceHistoryData = notConsentedAllOrderHistoryData['guidance'] !== undefined ? notConsentedAllOrderHistoryData['guidance'] : [];
      notConsentedRehabilyHistoryData = notConsentedAllOrderHistoryData['rehabily'] !== undefined ? notConsentedAllOrderHistoryData['rehabily'] : [];
      notConsentedRadiationHistoryData = notConsentedAllOrderHistoryData['radiation'] !== undefined ? notConsentedAllOrderHistoryData['radiation'] : [];
      notConsentedExamHistoryData = notConsentedAllOrderHistoryData['examination'] !== undefined ? notConsentedAllOrderHistoryData['examination'] : [];
      notConsentedTreatmentHistoryData = notConsentedAllOrderHistoryData['treatment'] !== undefined ? notConsentedAllOrderHistoryData['treatment'] : [];
      notConsentedAllergyHistoryData = notConsentedAllOrderHistoryData['allergy'] !== undefined ? notConsentedAllOrderHistoryData['allergy'] : [];

    this.setState({
      notConsentedInspectionHistoryData: notConsentedInspectionHistoryData.length > 0 ? notConsentedInspectionHistoryData : [],
      notConsentedEndoscopeHistoryData: notConsentedEndoscopeHistoryData.length > 0 ? notConsentedEndoscopeHistoryData : [],
      notConsentedGuidanceHistoryData: notConsentedGuidanceHistoryData.length > 0 ? notConsentedGuidanceHistoryData : [],
      notConsentedRehabilyHistoryData: notConsentedRehabilyHistoryData.length > 0 ? notConsentedRehabilyHistoryData : [],
      notConsentedRadiationHistoryData: notConsentedRadiationHistoryData.length > 0 ? notConsentedRadiationHistoryData : [],
      notConsentedExamHistoryData: notConsentedExamHistoryData.length > 0 ? notConsentedExamHistoryData : [],
      notConsentedTreatmentHistoryData: notConsentedTreatmentHistoryData.length > 0 ? notConsentedTreatmentHistoryData : [],
      notConsentedAllergyHistoryData: notConsentedAllergyHistoryData.length > 0 ? notConsentedAllergyHistoryData : [],
      notConsentedAllOrderHistoryData: notConsentedAllOrderHistoryData
    });
    return notConsentedAllOrderHistoryData;
  };

  getNotConsentedHistoryData = async () => {
    let notConsentedHistoryData = null;
    let data = null;
    if (this.props.fromConsentedData == 'first_login')
      data = sessApi.getObject('prescription_consented_list');
    if (data == undefined || data == null) {
      let params = (params = {
        get_consent_pending: 1
      });
      await axios.get("/app/api/v2/order/prescription/patient", {
        params: params
      }).then(res=>{
        data = res.data;
      });
      sessApi.setObject("prescription_consented_list", data);
    }
    if (data != undefined && data != null) {
      if (this.props.patientId != undefined && this.props.patientId != null && parseInt(this.props.patientId) > 0)
        notConsentedHistoryData = data.filter(x=>x.patient_id == this.props.patientId);
      else 
        notConsentedHistoryData = data;
    }
    if (notConsentedHistoryData.length>0) {
      notConsentedHistoryData.map((item, index) => {
        if (index < 3) {
          item.order_data.class_name = "open";
        } else {
          item.order_data.class_name = "";
        }
        item.data_one_select = 0;
      });
    }

    if (this.props.refresh !== undefined) {
      this.props.refresh();
    }

    this.setState({
      notConsentedHistoryData: notConsentedHistoryData
    });

    return notConsentedHistoryData;
  };

  getPatientsListSearchResult = async () => {
    let dateStr = this.state.dateStatus
      ? formatDate4API(this.state.dateStatus)
      : "";
    let apitxt = "/app/api/v2/patients/received?";

    apitxt =
      apitxt +
      (this.state.schVal != "" ? "keyword=" + this.state.schVal + "&" : "");
    apitxt = apitxt + (dateStr != "" ? "date=" + dateStr + "&" : "");
    apitxt =
      apitxt +
      (this.state.departmentStatus
        ? "department=" + this.state.departmentStatus + "&"
        : "department=0&");
    apitxt =
      apitxt +
      (this.state.treatStatus
        ? "status=" + this.state.treatStatus + "&"
        : "status=0&");
    apitxt =
      apitxt +
      (this.state.pageStatus ? "page=" + this.state.pageStatus : "page=1");
    apitxt =
      apitxt +
      (this.state.limitStatus != 20 ? "&limit=" + this.state.limitStatus : "");
    apitxt =
      apitxt +
      (this.state.treatStatus == 2 ? "&all_medical_treatment_end=1" : "");
    try {
      const { data } = await axios.get(apitxt);
      return data;
    } catch (err) {
      alert(
        "通信に失敗しました。インターネット接続を確認した後、ページを再読込してください。"
      );
      if (IS_DEVELOP)
        console.error("Error", err); /* eslint-disable-line no-console */
    }
  };

  getRadio(name, value) {
    if (name === "notConsentedDataSelect") {
      let notConsentedHistoryData = this.state.notConsentedHistoryData;
      notConsentedHistoryData.map(item => {
        item.data_one_select = value;
      });
      this.setState({
        notConsentedHistoryData: notConsentedHistoryData,
        notConsentedDataSelect: value === 1
      });
    }
    if (name === "notConsentedInjectionDataSelect") {
      let notConsentedInjectionHistoryData = this.state.notConsentedInjectionHistoryData;
      notConsentedInjectionHistoryData.map(item => {
        item.data_one_select = value;
      });
      this.setState({
        notConsentedInjectionHistoryData: notConsentedInjectionHistoryData,
        notConsentedInjectionDataSelect: value === 1
      });
    }
    if (name === "notConsentedInspectionDataSelect") {
      let notConsentedInspectionHistoryData = this.state.notConsentedInspectionHistoryData;
      notConsentedInspectionHistoryData.map(item => {
        item.data_one_select = value;
      });
      this.setState({
        notConsentedInspectionHistoryData,
        notConsentedInspectionDataSelect: value === 1
      });
    }
    if (name === "notConsentedEndoscopeDataSelect") {
      let notConsentedEndoscopeHistoryData = this.state.notConsentedEndoscopeHistoryData;
      notConsentedEndoscopeHistoryData.map(item => {
        item.data_one_select = value;
      });
      this.setState({
        notConsentedEndoscopeHistoryData,
        notConsentedEndoscopeDataSelect: value === 1
      });
    }
    if (name === "notConsentedGuidanceDataSelect") {
      let notConsentedGuidanceHistoryData = this.state.notConsentedGuidanceHistoryData;
      notConsentedGuidanceHistoryData.map(item => {
        item.data_one_select = value;
      });
      this.setState({
        notConsentedGuidanceHistoryData,
        notConsentedGuidanceDataSelect: value === 1
      });
    }
    if (name === "notConsentedHomeDataSelect") {
      let notConsentedHomeHistoryData = this.state.notConsentedHomeHistoryData;
      notConsentedHomeHistoryData.map(item => {
        item.data_one_select = value;
      });
      this.setState({
        notConsentedHomeHistoryData,
        notConsentedHomeDataSelect: value === 1
      });
    }
    if (name === "notConsentedSpiritDataSelect") {
      let notConsentedSpiritHistoryData = this.state.notConsentedSpiritHistoryData;
      notConsentedSpiritHistoryData.map(item => {
        item.data_one_select = value;
      });
      this.setState({
        notConsentedSpiritHistoryData,
        notConsentedSpiritDataSelect: value === 1
      });
    }
    if (name === "notConsentedRehabilyDataSelect") {
      let notConsentedRehabilyHistoryData = this.state.notConsentedRehabilyHistoryData;
      notConsentedRehabilyHistoryData.map(item => {
        item.data_one_select = value;
      });
      this.setState({
        notConsentedRehabilyHistoryData,
        notConsentedRehabilyDataSelect: value === 1
      });
    }
    if (name === "notConsentedRadiationDataSelect") {
      let notConsentedRadiationHistoryData = this.state.notConsentedRadiationHistoryData;
      notConsentedRadiationHistoryData.map(item => {
        item.data_one_select = value;
      });
      this.setState({
        notConsentedRadiationHistoryData,
        notConsentedRadiationDataSelect: value === 1
      });
    }
    if (name === "notConsentedExamDataSelect") {
      let notConsentedExamHistoryData = this.state.notConsentedExamHistoryData;
      notConsentedExamHistoryData.map(item => {
        item.data_one_select = value;
      });
      this.setState({
        notConsentedExamHistoryData,
        notConsentedExamDataSelect: value === 1
      });
    }
    if (name === "notConsentedTreatmentDataSelect") {
      let notConsentedTreatmentHistoryData = this.state.notConsentedTreatmentHistoryData;
      notConsentedTreatmentHistoryData.map(item => {
        item.data_one_select = value;
      });
      this.setState({
        notConsentedTreatmentHistoryData,
        notConsentedTreatmentDataSelect: value === 1
      });
    }
    if (name === "notConsentedAllergyDataSelect") {
      let notConsentedAllergyHistoryData = this.state.notConsentedAllergyHistoryData;
        notConsentedAllergyHistoryData.map(item => {
        item.data_one_select = value;
      });
      this.setState({
          notConsentedAllergyHistoryData,
          notConsentedAllergyDataSelect: value === 1
      });
    }
  }

  getInjectionRadio(name, value) {
    if (name === "notConsentedInjectionDataSelect") {
      let notConsentedInjectionHistoryData = this.state.notConsentedInjectionHistoryData;
      notConsentedInjectionHistoryData.map(item => {
        item.data_one_select = value;
      });
      this.setState({
        notConsentedInjectionHistoryData: notConsentedInjectionHistoryData,
        notConsentedInjectionDataSelect: value === 1
      });
    }
  }

  deselectItem(number, value) {
    let allChecked = true;
    let notConsentedHistoryData = [];
    this.state.notConsentedHistoryData.map(item => {
      if (item.number === number) {
        item.data_one_select = value;
      }
      if (item.data_one_select === 0) {
        allChecked = false;
      }
      notConsentedHistoryData.push(item);
    });
    this.setState({
      notConsentedHistoryData: notConsentedHistoryData,
      notConsentedDataSelect: allChecked
    });
  }
  deselectInjectionItem(number, value) {

    let allChecked = true;
    let notConsentedInjectionHistoryData = [];
    this.state.notConsentedInjectionHistoryData.map(item => {
      if (item.number === number) {
        item.data_one_select = value;
      }
      if (item.data_one_select === 0) {
        allChecked = false;
      }
      notConsentedInjectionHistoryData.push(item);
    });
    this.setState({
      notConsentedInjectionHistoryData: notConsentedInjectionHistoryData,
      notConsentedInjectionDataSelect: allChecked
    });
  }

  dummpyFunc = () => {};

  handleClick = async () => {
      let postData = {
          order: this.state.orderList
      };
      let injection_postData = {
          targets: this.state.injectionList
      };
      let allOrderList_postData = {
          targets: this.state.allOrderList
      };

      // Disease
      let flg = this.diseaseConsent(this.state.consentList);

      if (postData.order.length !== 0) {
          this.consent(postData);
      }

      if (injection_postData.targets.length !== 0) {
          this.consentInjection(injection_postData);
      }

      if ( Object.keys(allOrderList_postData.targets).length !== 0) {
          this.consentAllOrder(allOrderList_postData);
      }

      if (flg === true || postData.order.length > 0 || injection_postData.targets.length > 0 || Object.keys(allOrderList_postData.targets).length > 0) {
          this.context.$setUnconsentedConfirmed(false);
          this.closeNotConsentedModal();
      }
      this.confirmCancel();
  };

  openConfirmModal =()=> {
      let orderList = [];
      if(this.state.notConsentedHistoryData.length > 0 ){
          this.state.notConsentedHistoryData.map(medicine => {
              if (medicine.data_one_select === 1 || medicine.data_one_select === true)
                  orderList.push(medicine.number);
          });
      }

      let injectionList = [];
      if(this.state.notConsentedInjectionHistoryData.length > 0){
          this.state.notConsentedInjectionHistoryData.map(medicine => {
              if (medicine.data_one_select === 1 || medicine.data_one_select === true)
                  injectionList.push(medicine.number);
          });
      }

      let allOrderList = {};
      if(this.state.notConsentedInspectionHistoryData.length > 0){ //inspection
          allOrderList['inspection'] = [];
          this.state.notConsentedInspectionHistoryData.map(inspection => {
              if (inspection.data_one_select === 1 || inspection.data_one_select === true)
                  allOrderList['inspection'].push(inspection.number);
          });
      }
      if(this.state.notConsentedEndoscopeHistoryData.length > 0){ //endoscope
          allOrderList['endoscope'] = [];
          this.state.notConsentedEndoscopeHistoryData.map(endoscope => {
              if (endoscope.data_one_select === 1 || endoscope.data_one_select === true)
                  allOrderList['endoscope'].push(endoscope.number);
          });
      }
      if(this.state.notConsentedGuidanceHistoryData.length > 0){ //guidance
          allOrderList['guidance'] = [];
          this.state.notConsentedGuidanceHistoryData.map(guidance => {
              if (guidance.data_one_select === 1 || guidance.data_one_select === true)
                  allOrderList['guidance'].push(guidance.number);
          });
      }
      if(this.state.notConsentedHomeHistoryData.length > 0){ //home
          allOrderList['home'] = [];
          this.state.notConsentedHomeHistoryData.map(home => {
              if (home.data_one_select === 1 || home.data_one_select === true)
                  allOrderList['home'].push(home.number);
          });
      }
      if(this.state.notConsentedSpiritHistoryData.length > 0){ //spirit
          allOrderList['spirit'] = [];
          this.state.notConsentedSpiritHistoryData.map(spirit => {
              if (spirit.data_one_select === 1 || spirit.data_one_select === true)
                  allOrderList['spirit'].push(spirit.number);
          });
      }
      if(this.state.notConsentedRehabilyHistoryData.length > 0){ //rehabily
          allOrderList['rehabily'] = [];
          this.state.notConsentedRehabilyHistoryData.map(rehabily => {
              if (rehabily.data_one_select === 1 || rehabily.data_one_select === true)
                  allOrderList['rehabily'].push(rehabily.number);
          });
      }
      if(this.state.notConsentedRadiationHistoryData.length > 0){ //radiation
          allOrderList['radiation'] = [];
          this.state.notConsentedRadiationHistoryData.map(radiation => {
              if (radiation.data_one_select === 1 || radiation.data_one_select === true)
                  allOrderList['radiation'].push(radiation.number);
          });
      }
      if(this.state.notConsentedExamHistoryData.length > 0){ //examination
          allOrderList['examination'] = [];
          this.state.notConsentedExamHistoryData.map(examination => {
              if (examination.data_one_select === 1 || examination.data_one_select === true)
                  allOrderList['examination'].push(examination.number);
          });
      }
      if(this.state.notConsentedTreatmentHistoryData.length > 0){ //treatment
          allOrderList['treatment'] = [];
          this.state.notConsentedTreatmentHistoryData.map(treatment => {
              if (treatment.data_one_select === 1 || treatment.data_one_select === true)
                  allOrderList['treatment'].push(treatment.number);
          });
      }
      if(this.state.notConsentedAllergyHistoryData.length > 0){ //allergy
          allOrderList['allergy'] = [];
          this.state.notConsentedAllergyHistoryData.map(allergy => {
              if (allergy.data_one_select === 1 || allergy.data_one_select === true)
                  allOrderList['allergy'].push(allergy.number);
          });
      }

      let consentList = [];
      if(this.state.diseaseList != undefined && this.state.diseaseList != null && this.state.diseaseList.length > 0){
          this.state.diseaseList.map(item => {
              if (item.is_doctor_consented === 0 && item.checked === true) {
                  consentList.push(item.number);
              }
          });
      }
      if (consentList.length === 0 && orderList.length === 0 && injectionList.length === 0 && Object.keys(allOrderList).length === 0) return;
      this.setState({
          confirm_message: "承認しますか？",
          consentList,
          orderList,
          injectionList,
          allOrderList,
      });
  }

  confirmCancel() {
      this.setState({
          confirm_message: "",
      });
  }
  onHide = () => {};

  render() {
    let prescription_title = <div className="flex"><h6>処方一覧</h6></div>;
    let injection_title = <div className="flex" style={injectTitle}><h6>注射一覧</h6></div>;
    return (
      <PatientsWrapper>
        {this.state.notConsentedModal && this.state.staff_category === 1 ? (
          <Modal
            className='NotConsented first-view-modal not-consented-style'
            show={true}            
            id="notconsented_dlg"
            centered
            size="lg"
            onKeyDown={this.onKeyPressed}
            onHide={this.onHide}
          >
            <Modal.Header>
              <Modal.Title>未承認履歴一覧</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {(this.state.notConsentedHistoryData.length === 0
                    && (this.state.diseaseList.length === 0 || this.state.diseaseList == undefined)
                    && this.state.notConsentedInjectionHistoryData.length === 0
                    && this.state.notConsentedInspectionHistoryData.length === 0
                    && this.state.notConsentedEndoscopeHistoryData.length === 0
                    && this.state.notConsentedGuidanceHistoryData.length === 0
                    && this.state.notConsentedRehabilyHistoryData.length === 0
                    && this.state.notConsentedRadiationHistoryData.length === 0
                    && this.state.notConsentedExamHistoryData.length === 0
                    && this.state.notConsentedTreatmentHistoryData.length === 0
                    && this.state.notConsentedAllergyHistoryData.length === 0) ? (
                        <>
                            <div style={{padding:"200px", textAlign:"center"}}>
                                <span style={{padding:"10px", border:"2px solid #aaa"}}>未承認の内容はありません。</span>
                            </div>
                        </>
                ):(
                    <>
                        {this.state.notConsentedHistoryData.length > 0 && (
                            <>
                                {prescription_title}
                                <div className="row">
                                    <div className="col-md-6">
                                        <Checkbox
                                            ref={ref => (this.selectAll = ref)}
                                            label="全て選択"
                                            getRadio={this.getRadio.bind(this)}
                                            value={this.state.notConsentedDataSelect}
                                            name="notConsentedDataSelect"
                                        />
                                    </div>
                                </div>
                                <MedicineSelection
                                    ref={ref => (this.MedicineSelection = ref)}
                                    tab={0}
                                    patientId={this.props.fromPatient === true ? -1 : 0}
                                    medical_business_diagnosing_type={0}
                                    doctors={[]}
                                    doctor_code={0}
                                    doctor_name={""}
                                    setDoctorInfo={this.dummpyFunc}
                                    medicineHistory={this.state.notConsentedHistoryData}
                                    patientInfo={this.state.patientInfo}
                                    isEditingIndex={-1}
                                    isNotConsentedPopup={this.state.isNotConsentedPopupTrue}
                                    deselectItem={this.deselectItem.bind(this)}
                                    isLoaded={true}
                                    scrollAddHistoryData={this.dummpyFunc}
                                />
                            </>
                        )}
                        {this.state.notConsentedInjectionHistoryData.length > 0 && (
                            <>
                                {injection_title}
                                <div className="row">
                                    <div className="col-md-6">
                                        <Checkbox
                                            ref={ref => (this.selectAll = ref)}
                                            label="全て選択"
                                            getRadio={this.getRadio.bind(this)}
                                            value={this.state.notConsentedInjectionDataSelect}
                                            name="notConsentedInjectionDataSelect"
                                        />
                                    </div>
                                </div>
                                <InjectionSelection
                                    injectionHistory={this.state.notConsentedInjectionHistoryData}
                                    patientId={this.props.fromPatient === true ? -1 : 0}
                                    setDoctorInfo={this.dummpyFunc}
                                    openNotConsentedModal={this.openNotConsentedModal}
                                    isNotConsentedPopup={this.state.isNotConsentedPopupTrue}
                                    deselectInjectionItem={this.deselectInjectionItem.bind(this)}
                                    patientInfo={this.state.patientInfo}
                                    isLoaded={true}
                                />
                            </>
                        )}
                        {this.state.notConsentedInspectionHistoryData.length > 0 && (
                            <>
                                <div className="flex" style={injectTitle}><h6>生理検査一覧</h6></div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Checkbox
                                            ref={ref => (this.selectAll = ref)}
                                            label="全て選択"
                                            getRadio={this.getRadio.bind(this)}
                                            value={this.state.notConsentedInspectionDataSelect}
                                            name="notConsentedInspectionDataSelect"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <NotConsentedTable
                                        order_name={'inspection'}
                                        table_data={this.state.notConsentedInspectionHistoryData}
                                        patientInfo={this.state.patientInfo}
                                    />
                                </div>
                            </>
                        )}
                        {this.state.notConsentedEndoscopeHistoryData.length > 0 && (
                            <>
                                <div className="flex" style={injectTitle}><h6>内視鏡検査一覧</h6></div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Checkbox
                                            ref={ref => (this.selectAll = ref)}
                                            label="全て選択"
                                            getRadio={this.getRadio.bind(this)}
                                            value={this.state.notConsentedEndoscopeDataSelect}
                                            name="notConsentedEndoscopeDataSelect"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <NotConsentedTable
                                        order_name={'endoscope'}
                                        table_data={this.state.notConsentedEndoscopeHistoryData}
                                        patientInfo={this.state.patientInfo}
                                    />
                                </div>
                            </>
                        )}
                        {this.state.notConsentedExamHistoryData.length > 0 && (
                            <>
                                <div className="flex" style={injectTitle}><h6>検体検査一覧</h6></div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Checkbox
                                            ref={ref => (this.selectAll = ref)}
                                            label="全て選択"
                                            getRadio={this.getRadio.bind(this)}
                                            value={this.state.notConsentedExamDataSelect}
                                            name="notConsentedExamDataSelect"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <NotConsentedTable
                                        order_name={'examination'}
                                        table_data={this.state.notConsentedExamHistoryData}
                                        patientInfo={this.state.patientInfo}
                                    />
                                </div>
                            </>
                        )}
                        {this.state.notConsentedTreatmentHistoryData.length > 0 && (
                            <>
                                <div className="flex" style={injectTitle}><h6>処置一覧</h6></div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Checkbox
                                            ref={ref => (this.selectAll = ref)}
                                            label="全て選択"
                                            getRadio={this.getRadio.bind(this)}
                                            value={this.state.notConsentedTreatmentDataSelect}
                                            name="notConsentedTreatmentDataSelect"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <NotConsentedTable
                                        order_name={'treatment'}
                                        table_data={this.state.notConsentedTreatmentHistoryData}
                                        patientInfo={this.state.patientInfo}
                                    />
                                </div>
                            </>
                        )}
                        {this.state.notConsentedGuidanceHistoryData.length > 0 && (
                            <>
                                <div className="flex" style={injectTitle}><h6>汎用オーダー一覧</h6></div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Checkbox
                                            ref={ref => (this.selectAll = ref)}
                                            label="全て選択"
                                            getRadio={this.getRadio.bind(this)}
                                            value={this.state.notConsentedGuidanceDataSelect}
                                            name="notConsentedGuidanceDataSelect"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <NotConsentedTable
                                        order_name={'guidance'}
                                        table_data={this.state.notConsentedGuidanceHistoryData}
                                        patientInfo={this.state.patientInfo}
                                    />
                                </div>
                            </>
                        )}
                        {this.state.notConsentedRehabilyHistoryData.length > 0 && (
                            <>
                                <div className="flex" style={injectTitle}><h6>リハビリ一覧</h6></div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Checkbox
                                            ref={ref => (this.selectAll = ref)}
                                            label="全て選択"
                                            getRadio={this.getRadio.bind(this)}
                                            value={this.state.notConsentedRehabilyDataSelect}
                                            name="notConsentedRehabilyDataSelect"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <NotConsentedTable
                                        order_name={'rehabily'}
                                        table_data={this.state.notConsentedRehabilyHistoryData}
                                        patientInfo={this.state.patientInfo}
                                    />
                                </div>
                            </>
                        )}
                        {this.state.notConsentedRadiationHistoryData.length > 0 && (
                            <>
                                <div className="flex" style={injectTitle}><h6>放射線一覧</h6></div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Checkbox
                                            ref={ref => (this.selectAll = ref)}
                                            label="全て選択"
                                            getRadio={this.getRadio.bind(this)}
                                            value={this.state.notConsentedRadiationDataSelect}
                                            name="notConsentedRadiationDataSelect"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <NotConsentedTable
                                        order_name={'radiation'}
                                        table_data={this.state.notConsentedRadiationHistoryData}
                                        patientInfo={this.state.patientInfo}
                                    />
                                </div>
                            </>
                        )}
                        {this.state.notConsentedAllergyHistoryData.length > 0 && (
                            <>
                                <div className="flex" style={injectTitle}><h6>アレルギー一覧</h6></div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Checkbox
                                            ref={ref => (this.selectAll = ref)}
                                            label="全て選択"
                                            getRadio={this.getRadio.bind(this)}
                                            value={this.state.notConsentedAllergyDataSelect}
                                            name="notConsentedAllergyDataSelect"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <NotConsentedTable
                                        order_name={'allergy'}
                                        table_data={this.state.notConsentedAllergyHistoryData}
                                        patientInfo={this.state.patientInfo}
                                    />
                                </div>
                            </>
                        )}
                        {this.props.fromPatient && this.state.diseaseList != undefined && this.state.diseaseList != null &&  this.state.diseaseList && this.state.diseaseList.length > 0 && (
                            <DiseaseConsentPopup diseaseList={this.state.diseaseList} />
                        )}

                        <RightDiv>                            
                        </RightDiv>
                    </>
                )}
              {this.state.confirm_message !== "" && (
                  <SystemConfirmModal
                      hideConfirm= {this.confirmCancel.bind(this)}
                      confirmCancel= {this.confirmCancel.bind(this)}
                      confirmOk= {this.handleClick.bind(this)}
                      confirmTitle= {this.state.confirm_message}
                  />
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button id="system_confirm_Cancel" onClick={this.props.closeNotConsentedModal} className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"}>キャンセル</Button>
              <Button id="system_confirm_Ok" onClick={this.openConfirmModal.bind(this)} className={this.state.curFocus === 0?"red-btn focus": "red-btn"}>承認</Button>
            </Modal.Footer>
          </Modal>
        ) : (
          ""
        )}
      </PatientsWrapper>
    );
  }
}
NotConsentedModal.contextType = Context;

NotConsentedModal.defaultProps = {
  fromConsentedData: "",
};

NotConsentedModal.propTypes = {
  patientId: PropTypes.string,
  refresh: PropTypes.func,
  closeNotConsentedModal: PropTypes.func,
  fromPatient: PropTypes.bool,
  fromConsentedData: PropTypes.string,
};

export default NotConsentedModal;

