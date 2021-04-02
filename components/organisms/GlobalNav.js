import React from "react";
import axios from "axios";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import * as activeIndicator from "../_nano/activeIndicator";
import auth from "~/api/auth";
import { withRouter } from "react-router-dom";
import MenuModal from "../molecules/MenuModal";
import MenuDialModal from "../molecules/MenuDialModal";
import SeatModal from "../molecules/SeatModal";
import {
  CACHE_SESSIONNAMES,
  CACHE_LOCALNAMES,
  KARTEMODE,
  Karte_Types,
  openPacs,
} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as methods from "~/components/methods/StoreMethods";
import DialPatientListModal from "~/components/templates/Dial/DialPatientListModal";
import {
  commonItems,
  commonItemsTwo,
  karteDescriptionItems,
  nurseServiceItems,
  departItems,
  dialItems,
  maintenanceItems,
  maintenanceHarukaItems,
  printHarukaItems,
  printItems
} from "~/helpers/navigationMaps";
import {faHome, faSquare} from "@fortawesome/pro-regular-svg-icons";
import Context from "../../helpers/configureStore";
import FormWithLabel from "../molecules/FormWithLabel";
import { canShowKarteStatus } from "~/helpers/checkUrl";
import Button from "../atoms/Button";
import PropTypes from "prop-types";
import icon from "../_demo/logout.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { patientModalEvent } from "../../events/PatientModalEvent";
import SelectDoctorModal from "../molecules/SelectDoctorModal";
import * as apiClient from "~/api/apiClient";
import $ from "jquery";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import InspectionReservationListModal from "~/components/templates/Patient/Modals/Physiological/InspectionReservationListModal";
import EndoscopeReservationListModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeReservationListModal";
import InspectionStatusList from "~/components/templates/Patient/Modals/Physiological/InspectionStatusList";
import InspectionDepartmentResultModal from "~/components/templates/Patient/Modals/Physiological/InspectionDepartmentResultModal";
import EndoscopeDepartmentResultModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeDepartmentResultModal";
import RadiationDepartmentResultModal from "~/components/templates/Patient/Modals/Radiation/RadiationDepartmentResultModal";
import EndoscopeStatusListModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeStatusListModal";
import RadiationStatusListModal from "~/components/templates/Patient/Modals/Radiation/RadiationStatusListModal";
import OpenPatientKarteListModal from "~/components/molecules/OpenPatientKarteListModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import PrescriptionConfirmModal from "~/components/molecules/PrescriptionConfirmModal";
import { karte_image_array} from "~/helpers/kartePageResource";
import * as pres_methods from "~/components/templates/Patient/PrescriptionMethods";
import OutExamCooperationRequestOutputModal
  from "~/components/templates/InspectionList/OutExamCooperationRequestOutputModal";
import ReportCreatListModal from "~/components/templates/Report/ReportCreatListModal";
import AdminDiaryModal from "~/components/templates/Report/AdminDiaryModal";
import AdministrationDiaryMenuModal from "~/components/templates/Nurse/AdministrationDiaryMenuModal";
import EmergencyReceptionModal from "~/components/templates/Emergency/EmergencyReceptionModal";
import RadiationReservationListModal
  from "~/components/templates/Patient/Modals/Radiation/RadiationReservationListModal";
import MedicationGuidanceSchedule from "~/components/templates/Patient/Medication/MedicationGuidanceSchedule";
import { getUrlFromMenuItem, getInspectionItemId, getRadiationItemId, getAllergyItemId, getExaminationItemId} from "~/helpers/getUrlFromMenuItem";
import NutritionGuidanceSlipTotal from "../templates/Nutrition/NutritionGuidanceSlipTotal";
import ChemicalInformationSearch from "../templates/Patient/Chemicals/ChemicalInformationSearch";
import HospitalPlanList from "../templates/Patient/Modals/Hospital/HospitalPlanList";
import WardLabel from "~/components/templates/Patient/Modals/WardLabel/WardLabel";
import {getMenuAuthority, AUTHS} from "~/helpers/getMenuAuthority";
import ScannerBatchTakeDoc from "../templates/ScannerBatchTakeDoc";
import InpatientContactList from "~/components/templates/InpatientContactList";
import PatientsSchedule from "../templates/Nurse/patients_schedule/PatientsSchedule";
import NurseAssignment from "../templates/Nurse/nurse_assignment/NurseAssignment";
import MovePlanPatientList from "../templates/Ward/MovePlanPatientList";
import OutInjectionPatientModal from "~/components/templates/Nurse/TreatInjectionPatientList/OutInjectionPatientModal";
import ProgressChart from "~/components/templates/Nurse/ProgressChart/ProgressChart";
import NurseSummaryList from "~/components/templates/Nurse/NurseSummaryList/NurseSummaryList";
import VisitNurseSummaryList from "~/components/templates/Nurse/NurseSummaryList/VisitNurseSummaryList";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import * as patientApi from "~/helpers/cachePatient-utils";
import DocumentReference from "~/components/templates/Patient/Modals/Document/DocumentReference";
import NotConsentedModal from "~/components/organisms/NotConsentedModal";
import ConfirmNoFocusModalRef from "~/components/molecules/ConfirmNoFocusModalRef";
import PatientCertification from "~/components/templates/Nurse/patient_certification/PatientCertification";
import HospitalPatientBarcodePrint from "~/components/templates/Nurse/barcode_print/HospitalPatientBarcodePrint";
import NurseProblemListModal from "~/components/templates/Nurse/NurseProblemListModal";
import NurseProfileDatabaseModal from "~/components/templates/Nurse/NurseProfileDatabaseModal";
import SelectShowModeModal from "~/components/templates/Ward/incharge/SelectShowModeModal";
import NursePlanReferenceModal from "~/components/templates/Nurse/NursePlanReferenceModal";
import NurseCourseSeatModal from "~/components/templates/Ward/worksheet/NurseCourseSeatModal";
import NurseInstruction from "~/components/templates/Nurse/NurseInstruction";
import BulkInstructionModal from "~/components/templates/Nurse/BulkInstructionModal";
import SummaryList from "~/components/templates/Ward/Summary/SummaryList";
import HospitalizedSetting from "~/components/templates/Ward/HospitalizedSetting";
import DocumentCreate from "~/components/templates/Patient/Modals/Document/DocumentCreate";

const FlexHaruka = styled.div`
  -webkit-touch-callout: none; /* iOS Safari */ 
  -webkit-user-select: none; /* Safari */ 
  -khtml-user-select: none; /* Konqueror HTML */ 
  -moz-user-select: none; /* Firefox */ 
  -ms-user-select: none; /* Internet Explorer/Edge */ 
  user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
  .w88{
    width: 88px !important;  
  }
  .w45{
    width: 45px !important;  
  }
  .w57{
    width: 57px !important;  
  }
  .w80{
    width: 80px !important;  
  }
  .w60{
    width: 60px !important;  
  }
  .w50{
    width: 50px !important;  
  }
  .w90{
    width: 90px !important;  
  }
  
  .div-menu-modal{
    button{
      outline: none;
    }
  }
  .div-menu-modal-history{
    button{
      outline: none;
    }
  }
  .font-size-setting-area{
    .label-title{
      display:none;
    }
    .pullbox-select{
      width: 180px;
      background:rgb(221, 221, 221);
    }
    div{
      text-align:center;
    }
  }

  .btn-logout-disable{
    background-color: #d0d0d0 !important;
  }

  .patient-nav-div{
    width: 100%;
    height: 100%;
  }
  .patient-nav{
    span{
      overflow: hidden;
      max-height: 30px;
    }
  }

  .menu-design-list{
    li{
      width: 100% !important;
      float: none !important;  
      height: auto !important;    
    }
    img, svg{
      float: left !important;
      width: 20px !important;
      height: 20px !important;
    }
    span{
      text-align: left !important;
      padding-left: 5px !important;
      font-size: 0.75rem !important;
    }
    a{
      padding: 2px 0px !important;
    }
  }

  .clickable{
    cursor:pointer;
  }
  .plus-zoom{
    padding-left:1rem;
  }
  .origin-zoom{
    padding-right:1rem;
  }

  @media only screen and (max-width: 1660px) {
    // border-bottom: 1px solid #dedede;
    // border-left: 1px solid #ddd;
    // background-color: ${colors.surface};
    background-color: #eeeeee;
    // display: flex;
    display: block;
    justify-content: space-between;
    position: fixed;
    top: 0;
    // width: 100%;
    z-index: 101;
    float: right;
    width: 190px;
    height: 100vh;
    right: 0px;

    .temp-user{
      color: white;    
      margin-bottom: 10px;
      background: #e95b5b;
      text-align: center;
      font-size: 0.875rem;    
      padding: 3px;
      margin: 2px 7px;
    }

    .nav {
      align-items: center;

      li{
        width: 100%;
        
        span{
          padding: 2px 0px 6px;
          font-family: "Noto Sans JP", sans-serif;
        }
      }
    }

    span{
      font-weight: lighter;
    }

    .patient-nav{
      // border-top: 1px solid #ced4da;
      font-size: 0;
      padding: 4px;
      padding-top: 2px;
      margin: 0;
      margin-right: 6px;
      height: 100%;
      background: white;
      border: 1px solid rgb(208, 208, 208);
      border-top: none;
      .active {
        // color: ${colors.operationSelectedColor}
        ${activeIndicator.activeIndicator};
        background-color: ${colors.background};
        text-decoration: none;
      }

      li {
        display: inline-block;
        list-style-type: none;
        margin-bottom: 1px;
        width: 33%;
        margin: 2px 0px;
        float:left;
        height: 70px;
      }

      .no-permission{
        a{
          background: white !important;
          color: #aaa !important;
        }
      }

      // li:nth-child(odd) a{
      //   margin-left: 12.5% !important;
      // }
      //
      // li:nth-child(even) a{
      //   margin-right: 12.5% !important;
      // }

      a {
        cursor: pointer;
        display: block;
        text-align: center;
        padding: 4px 0;        

        svg{
          height: 40px;
          width: 40px;
          padding: 7px;
          background: #dbf5dc;
          border-radius: 6px;
        }

        img{
          width:40px;
          height: 40px;
        }

        &:hover {
          background-color: ${colors.background};
        }

        span {
          font-size: 0.625rem;
          display: block;
        }
      }
    }

    .login-user {
      display: inline-block;
      margin-right: 16px;
    }

    .auto-logout {
      display: inline-block;
      margin-right: 16px;
    }

    .prescription {
      line-height: 48px;
    }

    // a:hover {
    //   ${activeIndicator.activeIndicator};
    //   text-decoration: none;
    // }

    .div-buttons{
      display: flex;
      justify-content: inherit;
      margin-top: 5px;    

      button {
        width: 29%;      
        height: 2.5rem;      
        min-width: 30px !important;      
        padding: 0px;
        spongotoan {
          font-size: 0.75rem;
          color: black;
        }      
      }

      .btn-seat{
        // background-color: #ddd;
        // border: 1px solid #aaa;
        background-color: #d0d0d0;
        border:none;
        border-radius: 0px;
        margin: 0 3px 0 6px;
        margin-left: 0px;
      }

      .btn-turn{
        // background-color: #ddd;
        // border: 1px solid #aaa;
        background-color: #d0d0d0;
        border:none;
        border-radius: 0px;
        margin: 0 3px 0 3px;
      }

      .btn-turn-disable{
        pointer-events: none;
        span{
          color: gray !important;
        }
      }

      .btn-black-color{
        color: black !important;
      }

      .btn-logout{
        background-color: #73a8c8;
        border:none;
        border-radius: 0px;
        margin: 0 6px 0 3px;   
        img{
          height: 2.5rem !important;
        }
      }      

      img{
        width: 100%;
        height: 100%;
        padding: 8px 15px;
        margin-left: 2px;
      }
    }

    // .user-button{
    //   width: 17%;
    //   overflow: hidden;
    //   height: 30px;
    //   margin-left: 8px;

    //   button{
    //     width: 100%;
    //     min-width: 30px;
    //     height: 30px;
    //   }
    // }

    .div-name{
      display: flex;
    }

    .user-name{
      width: 100%;
      margin: 0 6px;
      margin-left: 0px;
      input{
        border-radius: 0px;
        border: none;
        margin-top: 0px;
        height: 1.875rem;
        pointer-events: none;
        font-size: 0.75rem;
        color: red;
        font-weight: bold;
      }
    }

    .div-doctor{
      display: flex;
      justify-content: inherit;
    }

    .doctor-button{
      width: 17%;
      overflow: hidden;
      height: 1.875rem;
      margin-left: 0px;    

      button{
        width: 100%;
        min-width: 30px;
        height: 1.875rem;
        padding: 0px;
        background-color: #d0c8fb;
        border-radius: 0px;
        // background-color: #9f78cd;
      }
    }

    .style-one{
      margin-right: 6px;

      button{
        border-radius: 0px;;
        background-color: #e8cc92;
        // background-color: #cbb952;
      }
    }

    .doctor-name{
      width: 57%;
      // margin-left: 5px;
      input{
        border-radius: 0px;;
        border: none;
        margin-top: 0px;
        height: 1.875rem;
        pointer-events: none;
        font-size: 0.75rem;
        color: blue;
        font-weight: bold;
      }
    }

    .div-menu-list{
      display: flex;    
      justify-content: inherit;
      .menu-list-button{
        width: 80%;
        height: 1.875rem;
        margin-left: 0px;
        button{
          width: 100%;
          min-width: 30px;
          height: 1.875rem;
          line-height: 0px;
          background: white;
          border: none;
          border-radius: 0px;;
          span{
            color:black;
            font-size:1rem;
          }
        }
      }
      .btn-home{
        margin-left: 0px !important;
        margin-right: 6px !important;
        button{        
          margin-left: 0px !important;
          background: #a8a8a8;
        }
      }
    }

    .div-menu{
      display: flex;    
      justify-content: inherit;
    }

    .menu-button{      
      width:160px;
      height: 1.875rem;
      margin-left: 0px;      
      button{
        width: 100%;
        min-width: 30px;
        height: 1.875rem;
        line-height: 0px;
        background: #d0d0d0;
        border: none;
        border-radius: 0px;
        span{
          color:black;
          font-size:1rem;
        }
      }
    }

    .menu-div-favourite{
      width: 65%;
      // width: 90px;
      height: 1.875rem;
      margin-left: 0px;

      button{
        width: 100%;
        min-width: 30px;
        height: 1.875rem;
        padding: 0px;
        line-height: 0px;
        background: #d0d0d0;
        border: none;
        border-radius: 0px;;

        span{
          color:black;
        }
      }
    }

    .menu-div-history{
      width: 35%;
      // width: 50px;
      height: 1.875rem;
      margin-left: 0px;

      button{
        width: 100%;
        min-width: 30px;
        height: 1.875rem;
        padding: 0px;
        line-height: 0px;
        background: #d0d0d0;
        border: none;
        border-radius: 0px;;

        span{
          color:black;
        }
      }
    }

    .menu-div-karte{
      // width: 35%;
      width: 57px;
      height: 30px;
      margin-left: 0px;

      button{
        width: 100%;
        min-width: 30px;
        height: 30px;
        padding: 0px;
        line-height: 0px;
        background: #d0d0d0;
        border: none;
        border-radius: 0px;;

        span{
          color:black;
        }
      }
    }

    .menu-select{      
      // width: calc(100% - 7.5rem);
      width:30px;
      overflow: hidden;
      height: 1.875rem;
      margin-left: 0px;      

      button{
        width: 100%;
        min-width: 30px;
        height: 1.875rem;
        // background-color: #ddd;
        // border: 1px solid #aaa;
        line-height: 0px;
        background: #d0d0d0;
        border: none;
        border-radius: 0px;;

        span{
          color:black;
          margin-left: -4px;
        }
      }
    }

    .menu-comment{
      margin: 0px 7px;
      margin-left: 0px;
      height: 100px;
      overflow: hidden;
      select{
        border: none;
        border-radius: 0px;
      }
      textarea{
        width: 100%;
        height: 95px !important;
        pointer-events: none;
        font-size:0.75rem;
      }
    }
    .menu-comment-haruka{
      margin: 0px 7px;
      margin-left: 0px;
      min-height: 100px;
      height: auto;
      overflow: hidden;
      background: #fff;
      .patients-select div{
        height: auto;
        line-height: 24px;
        margin: 3px;
        padding-left: 5px;
        font-size: 0.875rem;
        &:hover {
          cursor: pointer;
        }
      } 
      .patients-select div:nth-child(1){
        background: ${colors.firstPatientColor};
        margin-top: 0px !important;
      }
      .patients-select div:nth-child(2){
        background: ${colors.secondPatientColor};
      }
      .patients-select div:nth-child(3){
        background: ${colors.thirdPatientColor};
      }
      .patients-select div:nth-child(4){
        background: ${colors.forthPatientColor};
      } 
    }

    .div-menu-modal-history{
      display: flex;
      justify-content: inherit;
      // border-bottom: 1px solid #ddd;
      padding-top: 0px;
      margin-bottom: 0px !important;
      margin-right: 6px;   
      background: white; 
      border-right: 1px solid rgb(208, 208, 208);
      border-top: 1px solid rgb(208, 208, 208);  
    }

    .div-menu-modal{
      height: 1.875rem;
      display: flex;
      justify-content: inherit;
      // border-bottom: 1px solid #ddd;
      padding-top: 0px;
      margin-bottom: 0px !important;
      margin-right: 6px;   
      background: rgb(208, 208, 208); 
      border-left: 1px solid rgb(208, 208, 208);
      border-top: 1px solid rgb(208, 208, 208);
    }
    

    .modal-button1-history{
       // width: 80px;    
      width: 70%;    
      overflow: hidden;
      margin-left: 0px;
      // clip-path: polygon(0px 0px, 100% 0px, 88% 100%, 0% 100%);
      // clip-path: url(#clip-triangle);

      button{
        width: 100%;
        height: 30px;
        min-width: 20px !important;      
        padding: 0px;
        background-color: #d0d0d0;
        border-radius: 0px;
        // border: 1px solid #aaa;

        span{
          color:black;
        }
        display: inline-block;
        text-decoration: none;
        outline: none;
        // border-top-left-radius: 5px;
        // border-top-right-radius: 0px;
        // border-bottom-left-radius: 0px;
        // border-bottom-right-radius: 0px;
      }
    }

    .modal-button1{
      // width: 80px;    
      width: 70%;    
      overflow: hidden;
      margin-left: 0px;
      // clip-path: polygon(0 0, 88% 0, 100% 100%, 0% 100%);

      button{
        width: 100%;
        height: 30px;
        min-width: 20px !important;      
        padding: 0px;
        background-color: #d0d0d0;
        border-radius: 0px;
        // border: 1px solid #aaa;

        span{
          color:black;
        }
        display: inline-block;
        text-decoration: none;
        outline: none;
        // border-top-left-radius: 5px;
        // border-top-right-radius: 0px;
        // border-bottom-left-radius: 0px;
        // border-bottom-right-radius: 0px;
      }
    }

    .modal-button2-history{
      // width: 40px;
      width: 30%;
      overflow: hidden;
      margin-left: -8px;
      border-right: 1px solid rgb(208, 208, 208);

      button{
        width: 100%;
        height: 30px;
        min-width: 30px !important;      
        padding: 0px;
        background-color: #d0d0d0;
        // border: 1px solid #aaa;
        border-radius: 0px;

        span{
          color:black;
        }
        display: inline-block;
        text-decoration: none;
        outline: none;
        // border-top-left-radius: 0px;
        // border-top-right-radius: 5px;
        // border-bottom-left-radius: 0px;
        // border-bottom-right-radius: 0px;
      }
    }

    .modal-button2{
      // width: 40px;
      width: 30%;
      overflow: hidden;
      margin-left: -8px;

      button{
        width: 100%;
        height: 30px;
        min-width: 30px !important;      
        padding: 0px;
        background-color: #d0d0d0;
        // border: 1px solid #aaa;
        border-radius: 0px;

        span{
          color:black;
        }
        display: inline-block;
        text-decoration: none;
        outline: none;
        // border-top-left-radius: 0px;
        // border-top-right-radius: 5px;
        // border-bottom-left-radius: 0px;
        // border-bottom-right-radius: 0px;
      }
    }

    .modal-button3{
      width: 50px;
      overflow: hidden;
      margin-right: 6px;
      margin-left: 0px;
      margin-top: -8px;

      button{
        width: 100%;
        height: 30px;
        min-width: 30px !important;      
        padding: 0px;
        background-color: #ddd;
        border: 1px solid #aaa;

        span{
          color:black;
        }
      }
    }

    .grey-color button span{
      // color: grey!important;
      opacity:0.5;
    }

    .btn-favourite-active{
      button {      
        background-color: white !important;
        border-bottom: none !important;      
      }
    }
    .btn-active-fav{
      border-right: 12px solid transparent;
      border-bottom: 1.875rem solid white;
      button {      
        background-color: white !important;
        border-bottom: none !important;      
      }
    }
    .btn-active-his{
      border-left: 12px solid transparent;
      border-bottom: 1.875rem solid white;
      background: #d0d0d0;
      button {      
        background-color: white !important;
        border-bottom: none !important;      
      }
    }
    .btn-active-patient-his{
      border-right: 12px solid transparent;
      border-bottom: 30px solid white;
    }

  }

  @media only screen and (min-width: 1660px) {
    background-color: #eeeeee;
    display: block;
    justify-content: space-between;
    position: fixed;
    top: 0;
    z-index: 101;
    float: right;
    width: 190px;
    height: 100vh;
    right: 0px;

    .temp-user{
      color: white;    
      margin-bottom: 10px;
      background: #e95b5b;
      text-align: center;
      font-size: 0.875rem;    
      padding: 3px;
      margin: 2px 7px;
    }

    .nav {
      align-items: center;

      li{
        width: 100%;
        
        span{
          padding: 2px 0px 6px;
          font-family: "Noto Sans JP", sans-serif;
        }
      }
    }

    span{
      font-weight: lighter;
    }

    .patient-nav{
      // border-top: 1px solid #ced4da;
      font-size: 0;
      padding: 4px;
      padding-top: 20px;
      margin: 0;
      margin-right: 6px;
      height: 100%;
      background: white;
      border: 1px solid rgb(208, 208, 208);
      border-top: none;
      .active {
        // color: ${colors.operationSelectedColor}
        ${activeIndicator.activeIndicator};
        background-color: ${colors.background};
        text-decoration: none;
      }

      li {
        display: inline-block;
        list-style-type: none;
        margin-bottom: 1px;
        width: 33%;
        // margin: 10px 0px;
        float:left;
        height: 70px;
      }

      .no-permission{
        a{
          background: white !important;
          color: #aaa !important;
        }
      }

      // li:nth-child(odd) a{
      //   margin-left: 12.5% !important;
      // }
      //
      // li:nth-child(even) a{
      //   margin-right: 12.5% !important;
      // }

      a {
        cursor: pointer;
        display: block;
        text-align: center;
        padding: 4px 0;        

        svg{
          height: 40px;
          width: 40px;
          padding: 7px;
          background: #dbf5dc;
          border-radius: 6px;
        }

        img{
          width:40px;
          height: 40px;
        }

        &:hover {
          background-color: ${colors.background};
        }

        span {
          font-size: 0.625rem;
          display: block;
        }
      }
    }

    .login-user {
      display: inline-block;
      margin-right: 16px;
    }

    .auto-logout {
      display: inline-block;
      margin-right: 16px;
    }

    .prescription {
      line-height: 48px;
    }

    // a:hover {
    //   ${activeIndicator.activeIndicator};
    //   text-decoration: none;
    // }

    .div-buttons{
      display: flex;
      justify-content: inherit;
      margin-top: 5px;    

      button {
        width: 29%;      
        height: 40px;      
        min-width: 30px !important;      
        padding: 0px;
        span {
          font-size: 0.75rem;
          color: black;
        }      
      }

      .btn-seat{
        // background-color: #ddd;
        // border: 1px solid #aaa;
        background-color: #d0d0d0;
        border:none;
        border-radius: 0px;
        margin: 0 3px 0 6px;
        margin-left: 0px;
      }

      .btn-turn{
        // background-color: #ddd;
        // border: 1px solid #aaa;
        background-color: #d0d0d0;
        border:none;
        border-radius: 0px;
        margin: 0 3px 0 3px;
      }

      .btn-turn-disable{
        pointer-events: none;
        span{
          color: gray !important;
        }
      }

      .btn-black-color{
        color: black !important;
      }

      .btn-logout{
        background-color: #73a8c8;
        border:none;
        border-radius: 0px;
        margin: 0 6px 0 3px;   
        img{
          height: 2.5rem;
        }
      }

      img{
        width: 100%;
        height: 100%;
        padding: 10px 15px;
      }
    }

    .div-name{
      display: flex;
    }

    .user-name{
      width: 100%;
      margin: 0 6px;
      margin-left: 0px;
      input{
        border-radius: 0px;
        border: none;
        margin-top: 0px;
        height: 30px;
        pointer-events: none;
        font-size: 0.75rem;
        color: red;
        font-weight: bold;
      }
    }

    .div-doctor{
      display: flex;
      justify-content: inherit;
    }

    .doctor-button{
      width: 17%;
      overflow: hidden;
      height: 30px;
      margin-left: 0px;    

      button{
        width: 100%;
        min-width: 30px;
        height: 30px;
        padding: 0px;
        background-color: #d0c8fb;
        border-radius: 0px;
      }
    }

    .style-one{
      margin-right: 6px;

      button{
        border-radius: 0px;;
        background-color: #e8cc92;
        // background-color: #cbb952;
      }
    }

    .doctor-name{
      width: 57%;
      // margin-left: 5px;
      input{
        border-radius: 0px;;
        border: none;
        margin-top: 0px;
        height: 30px;
        pointer-events: none;
        font-size: 0.75rem;
        color: blue;
        font-weight: bold;
      }
    }

    .div-menu-list{
      display: flex;    
      justify-content: inherit;
      .menu-list-button{
        width: 80%;
        height: 30px;
        margin-left: 0px;
        button{
          width: 100%;
          min-width: 30px;
          height: 30px;
          line-height: 0px;
          background: white;
          border: none;
          border-radius: 0px;;
          span{
            color:black;
            font-size:1rem;
          }
        }
      }
      .btn-home{
        margin-left: 0px !important;
        margin-right: 6px !important;
        button{        
          margin-left: 0px !important;
          background: #a8a8a8;
        }
      }
    }
    .div-menu{
      display: flex;    
      justify-content: inherit;
    }

    .menu-button{      
      width:160px;
      height: 30px;
      margin-left: 0px;      
      button{
        width: 100%;
        min-width: 30px;
        height: 30px;
        line-height: 0px;
        background: #d0d0d0;
        border: none;
        border-radius: 0px;
        span{
          color:black;
          font-size:1rem;
        }
      }
    }

    .menu-div-favourite{
      width: 65%;
      height: 30px;
      margin-left: 0px;

      button{
        width: 100%;
        min-width: 30px;
        height: 30px;
        padding: 0px;
        line-height: 0px;
        background: #d0d0d0;
        border: none;
        border-radius: 0px;;

        span{
          color:black;
        }
      }
    }

    .menu-div-history{
      width: 35%;
      height: 30px;
      margin-left: 0px;

      button{
        width: 100%;
        min-width: 30px;
        height: 30px;
        padding: 0px;
        line-height: 0px;
        background: #d0d0d0;
        border: none;
        border-radius: 0px;;

        span{
          color:black;
        }
      }
    }

    .menu-div-karte{
      // width: 35%;
      width: 57px;
      height: 30px;
      margin-left: 0px;

      button{
        width: 100%;
        min-width: 30px;
        height: 30px;
        padding: 0px;
        line-height: 0px;
        background: #d0d0d0;
        border: none;
        border-radius: 0px;;

        span{
          color:black;
        }
      }
    }

    .menu-select{      
      // width: calc(100% - 7.5rem);
      width:30px;
      overflow: hidden;
      height: 30px;
      margin-left: 0px;      

      button{
        width: 100%;
        min-width: 30px;
        height: 30px;
        // background-color: #ddd;
        // border: 1px solid #aaa;
        line-height: 0px;
        background: #d0d0d0;
        border: none;
        border-radius: 0px;;

        span{
          color:black;
          margin-left: -4px;
        }
      }
    }

    .menu-comment{
      margin: 0px 7px;
      margin-left: 0px;
      height: 100px;
      overflow: hidden;
      select{
        border: none;
        border-radius: 0px;
      }
      textarea{
        width: 100%;
        height: 95px !important;
        pointer-events: none;
        font-size: 0.75rem;
      }
    }

    .menu-comment-haruka{
      margin: 0px 7px;
      margin-left: 0px;
      min-height: 100px;
      height: auto;
      overflow: hidden;
      background: #fff;
      .patients-select div{
        height: auto;
        margin: 3px;
        padding-left: 5px;
        font-size: 0.875rem;
        &:hover {
          cursor: pointer;
        }
      } 
      .patients-select div:nth-child(1){
        background: ${colors.firstPatientColor};
        margin-top: 0px !important;
      }
      .patients-select div:nth-child(2){
        background: ${colors.secondPatientColor};
      }
      .patients-select div:nth-child(3){
        background: ${colors.thirdPatientColor};
      }
      .patients-select div:nth-child(4){
        background: ${colors.forthPatientColor};
      } 
    }

    .div-menu-modal-history{
      display: flex;
      justify-content: inherit;
      // border-bottom: 1px solid #ddd;
      padding-top: 0px;
      margin-bottom: 0px !important;
      margin-right: 6px;   
      background: white; 
      border-right: 1px solid rgb(208, 208, 208);
      border-top: 1px solid rgb(208, 208, 208);  
    }

    .div-menu-modal{
      display: flex;
      justify-content: inherit;
      // border-bottom: 1px solid #ddd;
      padding-top: 0px;
      margin-bottom: 0px !important;
      margin-right: 6px;   
      background: rgb(208, 208, 208); 
      border-left: 1px solid rgb(208, 208, 208);
      border-top: 1px solid rgb(208, 208, 208);
    }
    

    .modal-button1-history{
       // width: 80px;    
      width: 70%;    
      overflow: hidden;
      margin-left: 0px;
      // clip-path: polygon(0px 0px, 100% 0px, 88% 100%, 0% 100%);
      // clip-path: url(#clip-triangle);

      button{
        width: 100%;
        height: 30px;
        min-width: 20px !important;      
        padding: 0px;
        background-color: #d0d0d0;
        border-radius: 0px;
        // border: 1px solid #aaa;

        span{
          color:black;
        }
        display: inline-block;
        text-decoration: none;
        outline: none;
        // border-top-left-radius: 5px;
        // border-top-right-radius: 0px;
        // border-bottom-left-radius: 0px;
        // border-bottom-right-radius: 0px;
      }
    }

    .modal-button1{
      // width: 80px;    
      width: 70%;    
      overflow: hidden;
      margin-left: 0px;

      button{
        width: 100%;
        height: 30px;
        min-width: 20px !important;      
        padding: 0px;
        background-color: #d0d0d0;
        border-radius: 0px;

        span{
          color:black;
        }
        display: inline-block;
        text-decoration: none;
        outline: none;
      }
    }

    .modal-button2-history{
      width: 30%;
      overflow: hidden;
      margin-left: -8px;
      border-right: 1px solid rgb(208, 208, 208);

      button{
        width: 100%;
        height: 30px;
        min-width: 30px !important;      
        padding: 0px;
        background-color: #d0d0d0;
        border-radius: 0px;

        span{
          color:black;
        }
        display: inline-block;
        text-decoration: none;
        outline: none;
      }
    }

    .modal-button2{
      // width: 40px;
      width: 30%;
      overflow: hidden;
      margin-left: -8px;

      button{
        width: 100%;
        height: 30px;
        min-width: 30px !important;      
        padding: 0px;
        background-color: #d0d0d0;
        border-radius: 0px;

        span{
          color:black;
        }
        display: inline-block;
        text-decoration: none;
        outline: none;
      }
    }

    .modal-button3{
      width: 50px;
      overflow: hidden;
      margin-right: 6px;
      margin-left: 0px;
      margin-top: -8px;

      button{
        width: 100%;
        height: 30px;
        min-width: 30px !important;      
        padding: 0px;
        background-color: #ddd;
        border: 1px solid #aaa;

        span{
          color:black;
        }
      }
    }

    .grey-color button span{
      color: grey!important;
    }

    .btn-favourite-active{
      button {      
        background-color: white !important;
        border-bottom: none !important;      
      }
    }
    .btn-active-fav{
      border-right: 12px solid transparent;
      border-bottom: 30px solid white;
      button {      
        background-color: white !important;
        border-bottom: none !important;      
      }
    }
    .btn-active-his{
      border-left: 12px solid transparent;
      border-bottom: 30px solid white;
      background: #d0d0d0;
      button {      
        background-color: white !important;
        border-bottom: none !important;      
      }
    }
    .btn-active-patient-his{
      border-right: 12px solid transparent;
      border-bottom: 30px solid white;
    }
  }
`;

const FlexDial = styled.div`
  border-bottom: 1px solid #dedede;
  border-left: 1px solid #ddd;
  background-color: ${colors.surface};
  // display: flex;
  display: block;
  justify-content: space-between;
  position: fixed;
  top: 0;
  // width: 100%;
  z-index: 101;
  float: right;
  width: 190px;
  height: 100vh;
  right: 0px;  

  .dial-favourite-btn{
    span{
      font-size: 12px !important;
    }
  }
  .modal-button3{
    span{
      font-size: 14px !important;
    }
  }

   .dialysis-doctor-button{
    width: 30px !important;
  }
  .style-two{
    margin-left: 3px !important;
  }

  .dialysis-doctor-name{
    margin-left: 3px !important;
    width: 112px !important;
    input{
      font-size: 10px !important;
      padding: 0px 2px !important;
    }
  }

  .temp-user{
    color: white;    
    margin-bottom: 10px;
    background: #e95b5b;
    text-align: center;
    font-size: 0.875rem;    
    padding: 3px;
    margin: 2px 7px;
  }

  .nav {
    align-items: center;

    li{
      width: 100%;
      
      span{
        padding: 2px 0px 6px;
        font-family: "Noto Sans JP", sans-serif;
      }
    }
  }

  span{
    font-weight: lighter;
  }

  .menu-design-list{
    li{
      width: 100% !important;
      float: none !important;  
      height: auto !important;    
    }
    img, svg{
      float: left !important;
      width: 20px !important;
      height: 20px !important;
    }
    span{
      line-height: 20px;      
      text-align: left !important;
      padding-left: 5px !important;
      font-size: 0.75rem !important;
    }
    a{
      padding: 2px 0px !important;
    }
  }

  .patient-nav-div{
    width: 100%;
    height: 100%;
  }
  .patient-nav{
    // border-top: 1px solid #ced4da;
    font-size: 0;
    padding: 8px;
    height: 100%;
    margin: 0;
    .active {
      // color: ${colors.operationSelectedColor}
      ${activeIndicator.activeIndicator};
      background-color: ${colors.background};
      text-decoration: none;
    }

    li {
      display: inline-block;
        list-style-type: none;
        margin-bottom: 1px;
        width: 48%;
        margin: 2px 0px;
        float:left;
        height: 50px;
    }

    a {
      cursor: pointer;
      display: block;
      text-align: center;
      padding: 4px 0;

      &:hover {
        background-color: ${colors.background};
      }

      span {
        font-size: 10px;
        display: block;
      }
    }
  }
  button {
  border-radius:0;
  }
  .login-user {
    display: inline-block;
    margin-right: 16px;
  }

  .auto-logout {
    display: inline-block;
    margin-right: 16px;
  }

  .prescription {
    line-height: 48px;
  }

  .half {
      margin-top: 0;
      button {
       margin-left: 5px;
        margin-right: 5px;
        min-width: 84px;
        background: #2f64fc;
        border-radius: 0;
      }
    }

  .div-buttons{
    display: flex;
    justify-content: inherit;
    margin-top: 15px;    

    button {
      width: 29%;      
      height: 40px;      
      min-width: 30px !important;      
      padding: 0px;
      span {
        font-size: 0.75rem;
        color: black;
      }      
    }    

    .btn-seat{
      background-color: #ddd;
      border: 1px solid #aaa;
      margin: 0 3px 0 6px;
    }

    .btn-turn{
      background-color: #ddd;
      border: 1px solid #aaa;
      margin: 0 3px 0 3px;
    }

    .btn-turn-disable{
      pointer-events: none;
      span{
        color: gray !important;
      }
    }

    .btn-black-color{
      color: black !important;
    }

    .btn-logout{
      margin: 0 6px 0 3px;   
    }

    img{
      width: 100%;
      height: 100%;
      padding: 8px 15px;
    }
  }

  .div-home{
      justify-content: center;
      .btn-home{
        width: 30%;
        height: 40px;
        margin-right: 15px;
        button{
          height: 40px;
          background-color: rgb(120, 85, 161);
        }
        svg{
          width: 30px;
          height: 30px;
          color: white;
        }
      }
    }

  .top-home{
    margin-top: 5px;
  }

  .div-name{
    display: flex;
  }

  .user-name{
    width: 100%;
    margin: 0 6px;
    input{
      margin-top: 0px;
      height: 30px;
      pointer-events: none;
      font-size: 0.75rem;
      color: red;
      font-weight: bold;
    }
  }

  .div-doctor{
    display: flex;
    justify-content: inherit;
  }

  .doctor-button{
    width: 17%;
    overflow: hidden;
    height: 30px;
    margin-left: 6px;    

    button{
      width: 100%;
      min-width: 30px;
      height: 30px;
      padding: 0px;
      background-color: #9f78cd;
    }
  }

  .style-one{
    margin-right: 6px;

    button{
      background-color: #cbb952;
    }
  }

  .doctor-name{
    width: 53%;
    margin-left: 5px;
    input{
      margin-top: 0px;
      height: 30px;
      pointer-events: none;
      font-size: 0.75rem;
      color: blue;
      font-weight: bold;
    }
  }

  .div-menu{
    display: flex;    
    justify-content: inherit;
  }

  .menu-button{
    width: 73%;
    height: 30px;
    margin-left: 6px;
    button{
      width: 100%;
      min-width: 30px;
      height: 30px;
      background-color: #ddd;
      border: 1px solid #aaa;
      line-height: 0px;
      span{
        color:black;
        font-size:1rem;
      }
    }
  }

  .menu-select{
    width: 20%;
    overflow: hidden;
    height: 30px;
    margin-left: 0px;
    margin-right: 6px;

    button{
      width: 100%;
      min-width: 30px;
      height: 30px;
      background-color: #ddd;
      border: 1px solid #aaa;
      line-height: 0px;

      span{
        color:black;
        margin-left: -4px;
      }
    }
  }

  .menu-comment{
    margin: 0px 5px;
    height: 100px;
    overflow: hidden;

    textarea{
      width: 100%;
      height: 95px !important;
      pointer-events: none;
    }
  }

  .div-menu-modal{
    display: flex;
    justify-content: inherit;
    border-bottom: 1px solid #ddd;
    padding-bottom: 7px;
    margin-top: 0.25rem;
    padding-left: 3px;
  }

  .modal-button1{
    width: 80px;    
    overflow: hidden;
    margin-left: 6px;

    button{
      width: 100%;
      height: 30px;
      min-width: 20px !important;      
      padding: 0px;
      background-color: white;
      border: 1px solid #aaa;

      span{
        color:black;
      }
      display: inline-block;
      text-decoration: none;
      outline: none;
      border-top-left-radius: 5px;
      border-top-right-radius: 0px;
      border-bottom-left-radius: 5px;
      border-bottom-right-radius: 0px;
    }
  }

  .modal-button2{
    width: 48%;
    overflow: hidden;
    margin-left: -8px;

    button{
      width: 80px;
      height: 30px;
      min-width: 30px !important;      
      padding: 0px;
      background-color: white;
      border: 1px solid #aaa;

      span{
        color:black;
      }
      display: inline-block;
      text-decoration: none;
      outline: none;
      border-top-left-radius: 0px;
      border-top-right-radius: 5px;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 5px;
    }
  }

  .modal-button3{
    width: 100%;
    padding: 5px;
    overflow: hidden;
    margin-right: 6px;
    margin-left: 0px;
    button{
      width: 100%;
      height: 30px;
      min-width: 30px !important;      
      padding: 0px;
      background-color: #ddd;
      border: 1px solid #aaa;
      span{
        font-size: 0.875rem;
        color:black;
      }
    }
  }

  .grey-color button span{
    color: grey!important;
  }
  
  .btn-favourite-active{
    button {      
      background-color: rgb(105, 200, 225) !important;
      span{
        color: white !important;
      }
    }
  }
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 1rem;
  margin: auto;
`;

const propTypes = {
  operationListInfoObj: PropTypes.object.isRequired,
  activeLink: PropTypes.string,
  clickFn: PropTypes.func,
  handleInspectionClick: PropTypes.func,
};

const propFavouriteTypes = {
  operationListInfoObj: PropTypes.object.isRequired,
  activeLink: PropTypes.string,
  clickFn: PropTypes.func,
  handleClick: PropTypes.func,
  handleFavouriteDragStart: PropTypes.func,
  handleFavouriteDropEvent: PropTypes.func,
  handleDragOver: PropTypes.func,
  handleLinkHistoryClick: PropTypes.func,
};

function OperationItem({ operationListInfoObj,  activeLink, clickFn,handleInspectionClick }) {
  let icon_img = null;
  karte_image_array.map(item=>{
    if (item.id == operationListInfoObj.id) {
      icon_img = item.img;
    }
  });
  return (
    <li
      className={(operationListInfoObj.activeLink && operationListInfoObj.activeLink === activeLink) ? 'active' : ''}
      onClick={(operationListInfoObj.iconLabel==="生理検査" || operationListInfoObj.iconLabel==="放射線" || operationListInfoObj.iconLabel==="患者情報") ? e => handleInspectionClick(e, operationListInfoObj) : () => clickFn(operationListInfoObj)} >
      <a>
        {icon_img != null ? (
          <img src={icon_img} />
        ) : (
          <Icon icon={operationListInfoObj.icon} />
        )}
        <span>{operationListInfoObj.iconLabel}</span>
      </a>
    </li>
  );
}

function OperationFavouriteItem({ operationListInfoObj, activeLink, clickFn ,handleClick, handleFavouriteDragStart, handleFavouriteDropEvent, handleDragOver }) {
  let icon_img = null;
  let permission = 1;
  if (operationListInfoObj.no_permission == 1) permission = 0;
  karte_image_array.map(item=>{
    if (item.id == operationListInfoObj.id) {
      icon_img = item.img;
    }
  });
  if(operationListInfoObj.id == 307){
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let view_soap_focus_menu = 0;
    if(initState !== undefined && initState != null && initState.conf_data !== undefined && initState.conf_data != null && initState.conf_data.view_soap_focus_menu !== undefined){
      view_soap_focus_menu = initState.conf_data.view_soap_focus_menu;
    }
    if(view_soap_focus_menu == 1){
      operationListInfoObj.iconLabel = "ＳＯＡＰ＆フォーカス";
    } else {
      operationListInfoObj.iconLabel = "経時記録";
    }
  }
  return (
    <li
      className={(operationListInfoObj.activeLink && operationListInfoObj.activeLink === activeLink) ? 'active ' : permission == 0 ? 'no-permission' : ''}
      onContextMenu={e => handleClick(e, operationListInfoObj.id)}
      draggable={'true'}
      onDragStart={e => handleFavouriteDragStart(e, operationListInfoObj)}
      onDrop={e => handleFavouriteDropEvent(e, operationListInfoObj)}
      onDragOver={e => handleDragOver(e)}
      onClick={() => clickFn(operationListInfoObj)}
    >
      <a title={operationListInfoObj.value}>
        {icon_img != null ? (
          <img src={icon_img} />
        ) : (
          <Icon icon={operationListInfoObj.icon} />
        )}
        <span>{operationListInfoObj.iconLabel == "" || operationListInfoObj.iconLabel == undefined || operationListInfoObj.iconLabel == null ? operationListInfoObj.value : operationListInfoObj.iconLabel}</span>
      </a>
    </li>
  );
}


OperationItem.propTypes = propTypes;
OperationFavouriteItem.propTypes = propFavouriteTypes;

const operationListInfo = [
  {
    id: 10008,
    // icon: faBookMedical,
    iconLabel: "SOAP",
    activeLink: "soap",
    click: self => {
      self.setState({
        activeLink:"soap"
      });
      var path = window.location.href.split("/");
      self.props.history.replace(`/patients/${path[path.length-2]}/soap`);
    }
  },
  {
    id: 10004,
    // icon: faBookUser,
    iconLabel: "患者情報",
    activeLink: "patientInfo",
    // click: (self, event) => {
    //   patientModalEvent.emit("clickOpenDetailedPatientPopup", "1");
    //   event.stopPropagation();
    // }
  },
  {
    id: 10003,
    // icon: faNotesMedical,
    iconLabel: "病名病歴",
    activeLink: "medicine",
    click: (self, event) => {
      // patientModalEvent.emit("clickOpenDetailedPatientPopup", "8");
      patientModalEvent.emit("clickOpenPatientDiseaseNamePopup");
      event.stopPropagation();
    }
  },
  {
    id: 10002,
    // icon: faLaptopMedical,
    iconLabel: "PACS",
    activeLink: "pacs",
    click: self => {
      self.setState({
        activeLink:"pacs"
      });
      const url =
        "http://TFS-C054/01Link/start.aspx?UserID=miyakojima&Password=miyakojima&ApplicationID=1600&RedirectURL=PatID%3d" +
        self.props.patientId;
      // window.open(url, "OpenPACS", "height=600,width=600");
      var params = [
        'height='+screen.height,
        'width='+screen.width,
        'fullscreen=yes', // only works in IE, but here for completeness
        'resizable=yes'
      ].join(',');
      window.open(url, "OpenPACS", params);
      self.props.PACSOn();
    }
  },
  {
    id: 10009,
    // icon: faMicroscope,
    iconLabel: "検査結果",
    activeLink: "inspection",
    click: self => {
      self.setState({
        activeLink:"inspection"
      });
      var path = window.location.href.split("/");
      self.props.history.replace(`/patients/${path[path.length-2]}/inspection`);
    }
  },
  {
    id: 10007,
    // icon: faPills,
    iconLabel: "禁忌薬",
    activeLink: "pills",
    // click: (self, event) => {
    //   self.setState({
    //     activeLink:"pills"
    //   });
    // }
  },
  {
    id: 10000,
    // icon: faCapsules,
    iconLabel: "処方",
    activeLink: "prescription",
    click: self => {
      self.setState({
        activeLink:"prescription"
      });
      var path = window.location.href.split("/");
      self.props.history.replace(`/patients/${path[path.length-2]}/prescription`);
    }
  },
  {
    id: 10001,
    // icon: faSyringe,
    iconLabel: "注射",
    activeLink: "injection",
    click: self => {
      self.setState({
        activeLink:"injection"
      });
      var path = window.location.href.split("/");
      self.props.history.replace(`/patients/${path[path.length-2]}/injection`);
    }
  },
  {
    id: 224,
    iconLabel: "外来処置",
    click: () => {
      patientModalEvent.emit("clickOpenOutpatientPopup", "1");
    }
  },
  {
    id: 273,
    iconLabel: "検体検査",
    click: () => {
      patientModalEvent.emit("clickOpenExaminationPopup", "1");
      // event.stopPropagation();
    }
  },
  {
    id: 10010,
    // icon: faSquare,
    iconLabel: "生理検査",
  },
  {
    id: 272,
    iconLabel: "内視鏡",
    click: (self) => {
      self.onGotoUrlFromSidebar(272)
    }
  },
  {
    id: 10013,
    // icon: faSquare,
    iconLabel: "放射線",

  },
  {
    id: 10011,
    // icon: faSquare,
    iconLabel: "リハビリ",
    click: () => {
      patientModalEvent.emit("clickOpenRehabilyPopup", "1");
    }
  },
  {
    id: 277,
    // icon: faSquare,
    iconLabel: "在宅",
    click: () => {
      patientModalEvent.emit("clickOpenHomePopup", "1");
    }
  },
  {
    id: 10012,
    // icon: faSquare,
    iconLabel: "汎用オーダー",
    click: () => {
      patientModalEvent.emit("clickOpenGuidancePopup", "1");
    }
  },
  // {
  //   id: 10005,
  //   // icon: faAllergies,
  //   iconLabel: "アレルギー",
  //   activeLink: "allergies",
  //   // click: (self, event) => {
  //   //   patientModalEvent.emit("clickOpenAllergyPopup", "1");
  //   //   event.stopPropagation();
  //   // }
  // },
  // {
  //   id: 10006,
  //   // icon: faDisease,
  //   iconLabel: "感染症",
  //   activeLink: "disease",
  //   // click: (self, event) => {
  //   //   self.setState({
  //   //     activeLink:"disease"
  //   //   });
  //   // }
  // },
];

// const sideMenuListInfo = [];

// const favouriteListInfo = [];

// const historyListInfo = [];

const ViewListUl = styled.ul`
  .view-list {
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    overflow: hidden;
    width:100%;
    background:#606060;
  }
  .view-list li {
    color:white;
    background:#606060;
    clear: both;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: normal;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    .menu-button{
      width:100%;
      button{
        background:#606060;
        padding-right:45px;
        span{
          color:white;
          font-size:1rem;
        }
      }
    }
  }
  .view-list li:hover{
    background: lightblue;
    color: black;    
    .menu-button{
      button{
        background: lightblue;
        span{
          color: black;
        }
      }
    }
  }    
  .selected_li{
    // opacity: 0.3;
    // color: aqua;
    display:none;
  }
`;

const ViewList = ({
                    visible,
                    x,
                    y,
                    parent,
                    viewListItems,
                  }) => {
  if (visible) {
    let viewNameList = ["受付一覧","カナ検索","病棟一覧","救急一覧","予約一覧","診察振り分け ","病棟マップ", "訪問診療予定"];
    const strActionList = ["receiptList","kanaSearch","hospital","emergency","reservation","consultation","hospitalMap", "visit_schedule_list"];
    const menu_ids = ["1001","1002","1003","1006","1004","","1007", "1005"];
    return (
      <ViewListUl>
        <ul className="view-list" style={{ left: `${x}px`, top: `${y}px` }}>
          <>
            {viewListItems.map((item, key)=> {
              return(
                <li key={key}>
                  {getMenuAuthority(menu_ids[item], AUTHS.READ) ? (
                    <div className="menu-button" onClick={() => parent.viewListAction(strActionList[item])}>
                      <Button>{viewNameList[item]}</Button>
                    </div>
                  ):(
                    <div className="grey-color menu-button">
                      <Button>{viewNameList[item]}</Button>
                    </div>
                  )}
                </li>
              );
            })}
          </>
        </ul>
      </ViewListUl>
    );
  } else {
    return null;
  }
};
const FontList = ({visible,x, y,parent, font_size}) => {
  if (visible){
    return (
      <ViewListUl>
        <ul className="view-list" style={{ left: `${x}px`, top: `${y}px` }}>
          <li className={font_size == 13?'text-center selected_li':'text-center'} onClick={() => parent.getFontSize(13)} style={{fontSize:'13pt'}}>13pt</li>
          <li className={font_size == 18?'text-center selected_li':'text-center'} onClick={() => parent.getFontSize(18)} style={{fontSize:'18pt'}}>18pt</li>
          <li className={font_size == 27?'text-center selected_li':'text-center'} onClick={() => parent.getFontSize(27)} style={{fontSize:'27pt'}}>27pt</li>
        </ul>
      </ViewListUl>
    )
  } else {
    return null;
  }
}

const ContextMenuUl = styled.div`
  .context-border{    
    .first-li{
      border-bottom: 1px solid;
    }
    span{
      padding-left: 20px;
    }
  }
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
    font-size: 0.875rem;
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
    img {
      width: 30px;
      height: 30px;
    }
    svg {
      width: 30px;
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

const ContextDialFavouriteMenu = ({
                                    visible,
                                    x,
                                    y,
                                    parent,
                                    favouriteMenuId,
                                    rightSideTab
                                  }) => {
  // お気に入りメニュー
  if (visible && favouriteMenuId != 0 && rightSideTab == "favourite") {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {favouriteMenuId != -1 && (//if not favourite area (only icon)
            <li className="first-li">
              <div
                onMouseOver={() =>
                  parent.handleFlavourHover()
                }
                onClick={() =>
                  parent.contextMenuAction(favouriteMenuId, "delete")
                }
              >
                お気に入り解除
              </div>
            </li>
          )}
          <li>
            <div
              className="menu-design"
              onMouseOver={(e) =>
                parent.showHoverMenu(e, parent)
              }
            >
              表示変更
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );

    // 履歴メニュー
  } else if(visible && favouriteMenuId != 0 && rightSideTab == "history") {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {favouriteMenuId != -1 && (//if not history area (only icon)
            <li className="first-li">
              {parent.context.bookmarksList.includes(favouriteMenuId) ?
                (<div
                  onMouseOver={() =>
                    parent.handleFlavourHover()
                  }
                  onClick={() =>
                    parent.contextMenuAction(favouriteMenuId, "delete")
                  }
                >
                  お気に入り解除
                </div>)
                : (<div
                  onMouseOver={() =>
                    parent.handleFlavourHover()
                  }
                  onClick={() =>
                    parent.contextMenuAction(favouriteMenuId)
                  }
                >
                  お気に入り追加
                </div>)}
            </li>
          )}
          <li>
            <div
              className="menu-design"
              onMouseOver={(e) =>
                parent.showHoverMenu(e, parent)
              }
            >
              表示変更
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu = ({
                       visible,
                       x,
                       y,
                       parent,
                       favouriteMenuId,
                       rightSideTab
                     }) => {
  // お気に入りメニュー
  if (visible && favouriteMenuId != 0 && rightSideTab == "favourite") {
    return (
      <ContextMenuUl>
        <ul className="context-menu context-border" style={{ left: `${x}px`, top: `${y}px`, border: `1px solid` }}>
          {favouriteMenuId != -1 && (//if not favourite area (only icon)
            <li className="first-li">
              <div
                onMouseOver={() =>
                  parent.handleFlavourHover()
                }
                onClick={() =>
                  parent.contextMenuAction(favouriteMenuId, "delete")
                }
              >
                お気に入り解除
              </div>
            </li>
          )}
          <li>
            <div
              className="menu-design"
              onMouseOver={(e) =>
                parent.showHoverMenu(e, parent)
              }
            >
              表示変更
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );

    // 履歴メニュー
  } else if(visible && favouriteMenuId != 0 && rightSideTab == "history") {
    return (
      <ContextMenuUl>
        <ul className="context-menu context-border" style={{ left: `${x}px`, top: `${y}px`, border: `1px solid` }}>
          {favouriteMenuId != -1 && (//if not history area (only icon)
            <li className="first-li">
              {parent.context.bookmarksList.includes(favouriteMenuId) ?
                (<div
                  onMouseOver={() =>
                    parent.handleFlavourHover()
                  }
                  onClick={() =>
                    parent.contextMenuAction(favouriteMenuId, "delete")
                  }
                >
                  お気に入り解除
                </div>)
                : (<div
                  onMouseOver={() =>
                    parent.handleFlavourHover()
                  }
                  onClick={() =>
                    parent.contextMenuAction(favouriteMenuId)
                  }
                >
                  お気に入り追加
                </div>)}
            </li>
          )}
          <li>
            <div
              className="menu-design"
              onMouseOver={(e) =>
                parent.showHoverMenu(e, parent)
              }
            >
              表示変更
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextHoverMenu = ({
                            visible,
                            x,
                            y,
                            parent,
                          }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x-100}px`, top: `${y}px`, border: `1px solid` }}>
          <li>
            <div
              onClick={() =>
                parent.contextMenuHoverAction("list")
              }
            >
              一覧表示
            </div>
          </li>
          <li>
            <div
              onClick={() =>
                parent.contextMenuHoverAction("icon")
              }
            >
              アイコン表示
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );

  } else {
    return null;
  }
};

const ContextUserMenu = ({
                           visible,
                           x,
                           y,
                           parent,
                         }) => {


  if ( visible ) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div
              onClick={() =>
                parent.contextUserMenuAction("personal_setting")
              }
            >個人設定
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );


  } else {
    return null;
  }

};

const ContextKarteMenu = ({visible,x, y,parent,menuItems}) => {
  if ( visible ) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {menuItems != null && menuItems.length > 0 && menuItems.map((item)=>{
            let icon_img = null;
            karte_image_array.map(img_item=>{
              if (img_item.id == item.id) {
                icon_img = img_item.img;
              }
            });
            return (
              <li key={item} className="d-flex" onClick={() => parent.contextKarteMenuAction(item.id)}>
                {icon_img != null ? (
                  <img src={icon_img} />
                ) : (
                  <Icon icon={faSquare} />
                )}
                <div>{item.value}</div>
              </li>
            )
          })}
        </ul>
      </ContextMenuUl>
    );
  } else return null;
};

class GlobalNav extends React.Component {
  getBookmarksInfor = methods.getBookmarksInfor.bind(this);
  getLinkHistoryInfor = methods.getLinkHistoryInfor.bind(this);
  getFavouriteHistoryType = methods.getFavouriteHistoryType.bind(this);
  static propTypes = {
    history: PropTypes.object,
    activeLink: PropTypes.string,
    gotoPage: PropTypes.func,
  };
  constructor(props) {
    super(props);
    // let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    // if(initState !== undefined && initState != null && initState.enable_dialysis == 1){
    //   //1366 x 768 ~ 1920 x 1080
    //   let html_obj = document.getElementsByTagName("html")[0];
    //   let width = html_obj.offsetWidth;
    //   if(parseInt(width) < 1367){
    //       html_obj.style.fontSize = 12.5 + "px";
    //   } else if(parseInt(width) < 1441){
    //       html_obj.style.fontSize = 13 + "px";
    //   } else if(parseInt(width) < 1601){
    //       html_obj.style.fontSize = 14 + "px";
    //   } else if(parseInt(width) < 1681){
    //       html_obj.style.fontSize = 15 + "px";
    //   } else if(parseInt(width) > 1919){
    //       html_obj.style.fontSize = 16 + "px";
    //   }
    // }
    let html_obj = document.getElementsByTagName("html")[0];
    let width = html_obj.offsetWidth;
    if(parseInt(width) < 1367){
      this.s_width = '60vh';      
    } else {
      this.s_width = '64vh';            
    }

    Object.entries(pres_methods).forEach(([name, fn]) =>{
      if(name == "getLastPrescription") {
        this[name] = fn.bind(this);
      }
    });    
    const lock_screen = sessApi.getValue(CACHE_SESSIONNAMES.LOCK_SCREEN);
    this.state = {
      activeLink: "soap",
      isOpenModal: false,
      isSeatModal: lock_screen == null ? false : lock_screen ,
      viewList: {
        visible: false,
        x: 0,
        y: 0,
      },
      fontList:{
        visible:false,
        x:0,
        y:0,
        font_size:18,
      },
      viewListItems:[1,2,3,4,5,6,7],   // favouriteList: [0],
      currentViewName: "受付一覧",
      favouriteMenuId: 0,
      // activeFavourite: "favourite",
      needDialSelectDoctor:false,
      isScannerBatchTakeDocPopupOpen: false,
      isHospitalPlanListPopupOpen: false,
      isSummaryListPopupOpen: false,
      isDocumentReferencePopupOpen: false,
      isDocumentCreatePopupOpen: false,
      isRadiationReservationListPopupOpen: false,
      isChemicalInformationSearchPopupOpen: false,
      isNutritionGuidanceSlipTotalPopupOpen: false,
      isInspectionReservationListPopupOpen: false,
      isEndoscopeReservationListPopupOpen: false,
      isWardLabelPopupOpen: false,
      isInspectionStatusListPopupOpen: false,
      isEndoscopeStatusListPopupOpen: false,
      isRadiationStatusListPopupOpen: false,
      isInspectionDepartmentResultPopupOpen: false,
      isEndoscopeDepartmentResultPopupOpen: false,
      isRadiationDepartmentResultPopupOpen: false,
      isOutExamCooperationRequestOutputPopupOpen: false,
      isEmergencyReceptionPopupOpen: false,
      isReportCreatListPopupOpen: false,
      isAdminDiaryPopupOpen: false,
      isAdministrationDiaryPopupOpen: false,
      isHospitalizedSettingPopupOpen: false,
      isInpatientContactListPopupOpen: false,
      isPatientsSchedulePopupOpen: false,
      isMovePlanPatientListPopupOpen: false,
      isHospitalPatientBarcodePrintPopupOpen: false,
      isPatientCertificationPopupOpen: false,
      isNurseSummaryListPopupOpen: false,
      isVisitNurseSummaryListPopupOpen: false,
      isNurseAssignmentPopupOpen: false,
      isOutInjectionPatientListPopupOpen: false,
      isMedicationGuidanceSchedulePopupOpen: false,
      report_creat_list_type:"",
      isOpenPatientKarteModal: false,
      isOpenDialNewPatient: false,
      rightSideTab: "favourite",
      menuDesignType:"icon",
      confirm_message: "",
      prescription_confirm_message: "",
      prescription_selected_id: 0,
      okTitle: "",
      cancelTitle: "",
      alert_messages: "",
      confirm_alert_title:'',
      font_size:18,
      isProgressChartPopup: false,
      isNursePlanPopup: false,
      isNurseProfilePopup: false,
      isInchargeSheetPopup: false,
      isNursePlanReferencePopup: false,
      isIndividualWorkSheetPopup: false,
      isNurseInstructionPopup: false,
      isHospitalInstructionPopup: false,
      isOpenPaitientListModal:false,
      hasNotConsentedData:false,      
    };
    this.modal_show_flag = 0; // 1: 医師を選択後、モーダル表示
    this.drop_flag = 0; // 1: favourite tab's icon drop event occur

    // sidebar menu info
    this.sideMenuListInfo = [];


    // let navigationMaps = [commonItems, karteDescriptionItems, nurseServiceItems, departItems, maintenanceHarukaItems, dialItems];
    // if (this.context.currentSystem == "dialysis") {
    //   navigationMaps = [commonItems, karteDescriptionItems, nurseServiceItems, departItems, maintenanceItems, dialItems];
    // }
    // navigationMaps.map(ele=>{
    //   ele.map(item=>{
    //     item.items.map(element=>{
    //       favouriteListInfo.push(element);
    //       historyListInfo.push(element);
    //     });
    //   });
    // });

    this.html_obj = document.getElementsByTagName('html')[0];
    this.default_fontsize = window.getComputedStyle(this.html_obj, null).getPropertyValue('font-size');
    this.max_fontsize = 19;
    this.min_fontsize = 12;

    //check change of dial page
    this.change_dial_delete = null;
    sessApi.remove('dial_change_flag');

    this.fontSizeOptions = [
      {id:16, value:''},
      {id:18, value:'サイズ:18pt'},
      {id:13, value:'サイズ:13pt'},
      {id:27, value:'サイズ:27pt'},
    ];
    // ●YJ257 ホーム画面が設定されていると、ログイン時に未承認閲覧の確認が出ない 2020/10/29
    this.consent_confirm = false;
    this.confirm_ref = React.createRef();
    this.m_firstLogin = null;
  }

  async componentDidMount() {

    // お気に入り・履歴MAP作成
    let navigationMaps = [commonItems, commonItemsTwo, karteDescriptionItems, nurseServiceItems, departItems, maintenanceItems, maintenanceHarukaItems, printHarukaItems, dialItems, printItems];
    // if (this.context.currentSystem == "dialysis") {
    //   navigationMaps = [commonItems, karteDescriptionItems, nurseServiceItems, departItems, maintenanceItems, dialItems, printItems];
    // }
    navigationMaps.map(ele=>{
      ele.map(item=>{
        item.items.map(element=>{
          this.sideMenuListInfo.push(element);
          // favouriteListInfo.push(element);
          // historyListInfo.push(element);
        });
      });
    });

    // お気に入りメニュー取得
    await this.getBookmarksInfor(this.context.currentSystem);
    await this.getLinkHistoryInfor(this.context.currentSystem);
    await this.getFavouriteHistoryType();

    // 編集中の患者リスト取得
    // let patientsList = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.PATIENTSLIST));
    karteApi.getEditPatientList();

    // YJ1059
    let html_obj = document.getElementsByTagName("html")[0];    
    let width = html_obj.offsetWidth;
    if(parseInt(width) < 1367){
      this.s_width = '60vh';      
    } else {
      this.s_width = '64vh';            
    }

    // eslint-disable-next-line consistent-this
    const that = this;
    $(document).ready(function(){
      $(window).resize(function(){        
        let html_obj = document.getElementsByTagName("html")[0];
        let patient_nav_area = document.getElementsByClassName('patient-nav')[0];
        let width = html_obj.offsetWidth;
        if (patient_nav_area != undefined && patient_nav_area != null) {          
          if(parseInt(width) < 1367){
            that.s_width = '60vh';      
            patient_nav_area.style['height'] = '60vh';
          } else {
            that.s_width = '64vh';            
            patient_nav_area.style['height'] = '64vh';
          }
        }
      });
    });

    // this.context.$updatePatientsList(patientsList);

    //1366 x 768 ~ 1920 x 1080
    // let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    // if(initState !== undefined && initState != null && initState.enable_dialysis == 1){
    //   let html_obj = document.getElementsByTagName("html")[0];
    //   let width = html_obj.offsetWidth;
    //   if(parseInt(width) < 1367){
    //       html_obj.style.fontSize = 12.5 + "px";
    //   } else if(parseInt(width) < 1441){
    //       html_obj.style.fontSize = 13.5 + "px";
    //   } else if(parseInt(width) < 1601){
    //       html_obj.style.fontSize = 14 + "px";
    //   } else if(parseInt(width) < 1681){
    //       html_obj.style.fontSize = 15 + "px";
    //   } else if(parseInt(width) > 1919){
    //       html_obj.style.fontSize = 16 + "px";
    //   }
    //   $(document).ready(function(){
    //     $(window).resize(function(){
    //         let html_obj = document.getElementsByTagName("html")[0];
    //         let width = html_obj.offsetWidth;
    //         if(parseInt(width) < 1367){
    //             html_obj.style.fontSize = 10 + "px";
    //         } else if(parseInt(width) < 1441){
    //             html_obj.style.fontSize = 11 + "px";
    //         } else if(parseInt(width) < 1601){
    //             html_obj.style.fontSize = 13 + "px";
    //         } else if(parseInt(width) < 1681){
    //             html_obj.style.fontSize = 15 + "px";
    //         } else if(parseInt(width) > 1919){
    //             html_obj.style.fontSize = 16 + "px";
    //         }
    //     });
    //   });
    // }
  }

  componentDidUpdate() {    
    setTimeout(()=>{
      this.getconsentState();
    }, 3000);    
  }

  getNotConsentedHistoryData = () => {
    let cache_data = sessApi.getObject('prescription_consented_list');
    return cache_data;
  };

  getNotConsentedInjectionHistoryData = () => {
    let cache_data = sessApi.getObject('injection_consented_list');
    return cache_data;
  };

  getNotConsentedAllOrderHistoryData = () => {
    // setTimeout(()=>{
      let cache_data = sessApi.getObject('allOrder_consented_list');
      return cache_data;
    // }, 500);
  };

  viewListAction = (act) => {
    if (this.context.currentSystem == "haruka") {
      var path = window.location.href.split("/");

      if (path[path.length - 1] == "prescription" || path[path.length - 1] == "injection") {
        if (this.nextUrlCheckFromPrescription("view_list_action", path[path.length - 1], null, null, null, null, act) == false) {
          this.harukaViewListAction(act);
        }
      } else if (path[path.length - 1] == "nursing_document") {
        if (this.nextUrlCheckFromCache("view_list_action", path[path.length - 1], null, null, null, null, act) == false) {
          this.harukaViewListAction(act);
        }
      } else {
        this.harukaViewListAction(act);
      }
    } else {
      this.dialysisViewListAction(act);
    }
  };

  harukaViewListAction = (act) => {
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    //check pac on
    let pac_status = patientApi.getVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);

    if (pac_status != undefined && pac_status != null && pac_status == "on") {
      openPacs(current_system_patient_id, "close");
      patientApi.delVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);
    }

    let cur_page = "";
    let path = window.location.href.split("/");
    cur_page = path[path.length - 1];
    let viewNameList = ["受付一覧","カナ検索","病棟一覧","救急一覧","予約一覧","診察振り分け","病棟マップ","訪問診療予定"];
    // const strActionList = ["receiptList","kanaSearch","hospital","emergency","reservation","consultation","hospitalMap"];
    let strViewName = this.state.currentViewName;
    let items = this.state.viewListItems;
    if (act == "receiptList" || act == "kanaSearch" || act == 'hospital' || act == 'emergency' || act =="reservation" || act =="hospitalMap" || act =="visit_schedule_list") {
      if (act === "receiptList") {
        if(cur_page != "patients"){
          this.props.history.replace("/patients");
        }
        strViewName="受付一覧";
        items = this.state.viewListItems.filter(item=>item !== 0);
      } else if (act === "kanaSearch") {
        if(cur_page != "patients_search"){
          this.props.history.replace("/patients_search");
        }
        strViewName="カナ検索";
        items = this.state.viewListItems.filter(item=>item !== 1);
      } else if (act === "hospital") {
        if(cur_page != "hospital_ward_list"){
          this.props.history.replace("/hospital_ward_list");
        }
        strViewName="病棟一覧";
        items = this.state.viewListItems.filter(item=>item !== 2);
      } else if (act === "emergency") {
        if(cur_page != "emergency_patients"){
          this.props.history.replace("/emergency_patients");
        }
        strViewName="救急一覧";
        items = this.state.viewListItems.filter(item=>item !== 3);
      } else if (act === "reservation") {
        if(cur_page != "reservation_list"){
          this.props.history.replace("/reservation_list");
        }
        strViewName="予約一覧";
        items = this.state.viewListItems.filter(item=>item !== 4);
      } else if (act === "consultation") {
        if(cur_page != "treatment_sorting"){
          this.props.history.replace("/treatment_sorting");
        }
        strViewName="診察振り分け";
        items = this.state.viewListItems.filter(item=>item !== 5);
      } else if (act === "hospitalMap") {
        if(cur_page != "hospital_ward_map"){
          this.props.history.replace("/hospital_ward_map");
        }
        strViewName="病棟マップ";
        items = this.state.viewListItems.filter(item=>item !== 6);
      } else if (act === "visit_schedule_list") {
        if(cur_page != "visit_schedule_list"){
          this.props.history.replace("/visit_schedule_list");
        }
        strViewName="訪問診療予定";
        items = this.state.viewListItems.filter(item=>item !== 7);
      }
    } else {
      return;
    }
    items.unshift(viewNameList.indexOf(this.state.currentViewName));
    this.setState({
      viewListItems:items,
      // viewList:{
      //   visible: false,
      //   x: 0,
      //   y: 0
      // },
      currentViewName: strViewName
    });
  };

  dialysisViewListAction = (act) => {
    let viewNameList = ["受付一覧","カナ検索","病棟一覧","救急一覧","予約一覧","診察振り分け","病棟マップ","訪問診療予定"];
    // const strActionList = ["receiptList","kanaSearch","hospital","emergency","reservation","consultation","hospitalMap"];
    let strViewName = this.state.currentViewName;
    let items = this.state.viewListItems;
    if (act == "receiptList" || act == "kanaSearch" || act =="reservation" || act =="visit_schedule_list") {
      if (act === "receiptList") {
        this.props.history.replace("/patients");
        strViewName="受付一覧";
        items = this.state.viewListItems.filter(item=>item !== 0);
      } else if (act === "kanaSearch") {
        this.props.history.replace("/patients_search");
        strViewName="カナ検索";
        items = this.state.viewListItems.filter(item=>item !== 1);
      } else if (act === "hospital") {
        this.props.history.replace("/hospital_ward_list");
        strViewName="病棟一覧";
        items = this.state.viewListItems.filter(item=>item !== 2);
      } else if (act === "emergency") {
        this.props.history.replace("/emergency_patients");
        strViewName="救急一覧";
        items = this.state.viewListItems.filter(item=>item !== 3);
      } else if (act === "reservation") {
        this.props.history.replace("/reservation_list");
        strViewName="予約一覧";
        items = this.state.viewListItems.filter(item=>item !== 4);
      } else if (act === "consultation") {
        this.props.history.replace("/treatment_sorting");
        strViewName="診察振り分け";
        items = this.state.viewListItems.filter(item=>item !== 5);
      } else if (act === "hospitalMap") {
        this.props.history.replace("/hospital_ward_map");
        strViewName="病棟マップ";
        items = this.state.viewListItems.filter(item=>item !== 6);
      } else if (act === "visit_schedule_list") {
        this.props.history.replace("/visit_schedule_list");
        strViewName="訪問診療予定";
        items = this.state.viewListItems.filter(item=>item !== 7);
      }
    } else {
      return;
    }
    items.unshift(viewNameList.indexOf(this.state.currentViewName));
    this.setState({
      viewListItems:items,
      // viewList:{
      //   visible: false,
      //   x: 0,
      //   y: 0
      // },
      currentViewName: strViewName
    });
  };

  checkUrl = (nFlag) => {
    var path = window.location.href.split("/");
    path = path[path.length - 1];
    if (nFlag == "no-login" && path == "") {
      return false;
    }
    return true;
  }

  handleTop = () => {

    this.setState({isOpenModal:false})
    let re = /patients[/]\d+/;
    let bPatientsId = re.test(window.location.href);
    if (bPatientsId) return;

    // 患者を開いているときのカルテページ以外でのログアウト警告

    // check cache open karte
    let openKarteArray = karteApi.getEditPatientList();
    if (openKarteArray != undefined && openKarteArray != null && openKarteArray.length > 0) {
      this.setState({
        isOpenPatientKarteModal: true,
        openKarteArray
      });
      return;
    }

    this.setState({
      confirm_message: "ログアウトしますか？",
      confirm_type:"log_out",
      confirm_alert_title:"ログアウト確認"
    });
    // if (confirm("本当にログアウトしますか？")) {
    //   this.handleLogOut();
    // }
  }

  handleDialysisTop = () => {
    this.setState({isOpenModal:false})
    let re = /patients[/]\d+/;
    let bPatientsId = re.test(window.location.href);
    if (bPatientsId) return;
    var confirm_message = '';
    var confirm_type = '';
    var dial_change_flag = sessApi.getObjectValue('dial_change_flag');    
    if(this.change_dial_delete == null && dial_change_flag !== undefined && dial_change_flag != null){
      confirm_message = "登録していない内容があります。\n変更内容を破棄して移動しますか？";
      confirm_type = "change_dial_page";
    }
    if(confirm_message !== ""){
      this.setState({
        confirm_message,
        confirm_type,
        go_func:"handleDialysisTop",
        confirm_alert_title:'入力中'
      });
      return;
    } else {
      this.change_dial_delete = null;
    }    

    this.setState({
      confirm_message: "ログアウトしますか？",
      confirm_type:"log_out",
      confirm_alert_title:'ログアウト',
    });

    /*if (confirm("ログアウトします")) {
      // 入力途中の患者情報削除
      karteApi.delUserVal();

      // const $resetState = useContext(Context);
      this.context.$resetState(0, "");
      this.exitFullscreen();
      auth.signOut();
      let statusTemporaryUser = this.isTemporaryUser();
      if (statusTemporaryUser) {
        this.props.history.replace("/tempLogin");
      } else {
        this.props.history.replace("/");
      }
    }*/
  }

  handleLogOut = () => {
    // 入力途中の患者情報削除
    karteApi.delUserVal();
    this.setState({isOpenPatientKarteModal: false});
    // const $resetState = useContext(Context);
    this.context.$resetState(0, "");
    if (this.enableHaruka() != "dialysis") {
      this.exitFullscreen();
    } else {
      let conf_data = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS)).conf_data;
      if (conf_data.logout_page_fullscreen_control != 1)
        this.exitFullscreen();
    }
    let statusTemporaryUser = this.isTemporaryUser();

    // ●YJ777 MySQLに保存するほうの操作ログの改善
    // ・手動ログアウト実行も記録する (・op_screen=ログアウト、op_type=ログアウト)
    // ・一時利用中のユーザーの手動ログアウトも区別する (・op_screen=一時利用、op_type=一時利用終了)
    if (statusTemporaryUser) {
      auth.signOut("temporary_login", null, "force_logOut");
      // reset temporary user info
      this.removeTemporaryUserInfo();
      // this.props.history.replace("/tempLogin");
      this.props.history.replace("/");
    } else {
      auth.signOut("force_out");
      this.props.history.replace("/");
    }
  }

  removeTemporaryUserInfo = () => {
    let userInfo = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.TEMPORARYUSER));
    userInfo.statusTemporary = 0;
    localApi.setValue(CACHE_LOCALNAMES.TEMPORARYUSER, JSON.stringify(userInfo));
  }

  exitFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  };

  canShowPatientNav = () => {
    let re = /patients[/]\d+/;
    let bPatientsId = re.test(window.location.href);

    if (bPatientsId) {
      return true;
    }

    return false;
  }

  chooseDoctor() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_number > 0) return;
    if(this.context.currentSystem === 'haruka') {
      this.getDoctorsList();
    } else {
      this.getDialDoctorsList();
    }
    return;
  }

  cancelDoctor() {
    this.context.$updateDoctor(0, "");
  }

  openPaitientListModal = () => {
    let confirm_message = "";
    let confirm_type = "";

    var dial_change_flag = sessApi.getObjectValue('dial_change_flag');
    if(this.change_dial_delete == null && dial_change_flag !== undefined && dial_change_flag != null){
      confirm_message = "登録していない内容があります。\n変更内容を破棄して移動しますか？";
      confirm_type = "change_dial_page";
    }
    if(confirm_message !== ""){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type,
        go_func:"openPaitientListModal",
        confirm_alert_title:'入力中'
      });
      return;
    } else {
      this.change_dial_delete = null;
    }
    this.setState({
      isOpenPaitientListModal:true,
    })
  }

  onOpenModal = (e) => {
    if(this.enableHaruka() == "haruka"){
      // check has current inputing prescription or injection data
      var path = window.location.href.split("/");

      if (path[path.length - 1] == "prescription" || path[path.length - 1] == "injection") {

        if (this.nextUrlCheckFromPrescription(null, path[path.length - 1], null, null, null) == true) {
          return;
        }
      } else if (path[path.length - 1] == "nursing_document") {
        if (this.nextUrlCheckFromCache("onOpenModal", path[path.length - 1], null, null, null, null, null,e) == true) {
          return;
        }
      }
      
    }
    if(this.enableHaruka() == "dialysis"){
      let confirm_message = "";
      let confirm_type = "";

      var dial_change_flag = sessApi.getObjectValue('dial_change_flag');
      if(this.change_dial_delete == null && dial_change_flag !== undefined && dial_change_flag != null){
        confirm_message = "登録していない内容があります。\n変更内容を破棄して移動しますか？";
        confirm_type = "change_dial_page";
      }
      if(confirm_message !== ""){
        this.setState({
          confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
          confirm_type,
          go_func:"onOpenModal",
          confirm_event:e,
          confirm_alert_title:'入力中'
        });
        return;
      } else {
        this.change_dial_delete = null;
      }
    }

    // eslint-disable-next-line consistent-this
    const that = this;
    e.preventDefault();
    this.context.$selectMenuModal(true);
    this.setState({isOpenModal: true});
    if(this.enableHaruka() == "haruka"){
      document.addEventListener(`click`, function onClickOutside(e) {
        if ( that.context.needMenuModal == false) {
          document.removeEventListener(`click`, onClickOutside);
          return;
        }
        var obj = e.target;
        do {
          // メニューをクリック時、有効なボタンの場合にはナビゲーションマップを閉じる
          if ( obj.className.indexOf("menu-clickable-item") !=-1 && obj.className.indexOf("disable-button") == -1 && obj.tagName.toLowerCase() == "div" ) {
            that.setState({ isOpenModal: false });
            that.context.$selectMenuModal(false);
            document.removeEventListener(`click`, onClickOutside);
            return;
          }
          if( obj.id != undefined && obj.id != null && obj.id != ""){
            //一覧ボタンの場合 return
            if( obj.id == "view-menu") return;
            //ナビゲーションをクリックの場合、return
            if( obj.id == "haruka-menu-list") return;
          }
          obj = obj.parentElement;
        } while(obj.tagName.toLowerCase() !== "body");
        that.setState({ isOpenModal: false });
        that.context.$selectMenuModal(false);
        document.removeEventListener(`click`, onClickOutside);
      });
    }
  }

  goHomePage =async () => {
    if (this.context.currentSystem == "haruka") {
      let path = window.location.href.split("/");
      if (path[path.length - 1] == "prescription" || path[path.length - 1] == "injection") {
        if (!this.nextUrlCheckFromPrescription("home", path[path.length - 1], null, null, null, null) == false) {
          return;
        }
      } else if (path[path.length - 1] == "nursing_document") {
        if (!this.nextUrlCheckFromCache("home", path[path.length - 1], null, null, null, null) == false) {
          return;
        }
      }
      try{
        let current_system_patient_id = localApi.getValue("current_system_patient_id");
        //check pac on
        let pac_status = patientApi.getVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);

        if (pac_status != undefined && pac_status != null && pac_status == "on") {
          openPacs(current_system_patient_id, "close");
          patientApi.delVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);
        }

        let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
        var sessionStorage = JSON.parse(window.sessionStorage.getItem("haruka"));
        let menu_id = sessionStorage.home_page;
        if (menu_id === undefined || menu_id == null || menu_id == "") {
          this.props.history.replace("/top");
          return;
        }
        let menu_data = initState.navigation_menu;
        if (menu_data === undefined && menu_data == null) {
          this.props.history.replace("/top");
          return;
        }
        let menu_item = menu_data.find(x=>x.id==menu_id);
        if (menu_item === undefined || menu_item == null) {
          this.props.history.replace("/top");
          return;
        }
        let permission_master=[801, 8011, 802];
        // お知らせ管理権限
        const permission_notice=[803];
        // システム設定権限
        const permission_system_setting=[804, 805, 806, 807, 808, 809,810, 811, 812, 813, 814, 815, 816, 817, 818, 819, 820, 821, 822, 823, 824, 825, 826, 827, 828, 829, 830, 831];
        // 訪問診療スケジュール権限
        const permission_visit_schedule_add=[4005, 4006];
        // 訪問診療スケジュール閲覧権限
        const permission_visit_schedule_view=[4007, 4008];
        // 委譲者オーダー承認
        const permission_NotConsented_View=[110, 229];
        // 予約カレンダー権限
        const permission_reservation_schedule_add=[294];
        // 予約カレンダー閲覧権限
        const permission_reservation_schedule_view=[219];
        let permission = true;

        // マスタ設定権限
        if(permission_master.includes(menu_item.id) && !this.context.$canDoAction(this.context.FEATURES.MASTER_SETTING, this.context.AUTHS.EDIT, 0)) {
          permission = false;
        }
        // お知らせ管理権限
        if(permission_notice.includes(menu_item.id) && !this.context.$canDoAction(this.context.FEATURES.NOTIFICATION, this.context.AUTHS.EDIT, 0)) {
          permission = false;
        }
        // システム設定権限
        if(permission_system_setting.includes(menu_item.id) && !this.context.$canDoAction(this.context.FEATURES.SYSTEM_SETTING, this.context.AUTHS.EDIT, 0)) {
          permission = false;
        }
        // 訪問診療スケジュール権限
        if(permission_visit_schedule_add.includes(menu_item.id) && !this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.REGISTER, 0)
        ) {
          permission = false;
        }
        // 訪問診療スケジュール閲覧権限
        if(permission_visit_schedule_view.includes(menu_item.id) && !(
          this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.READ, 0) ||
          this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.REGISTER, 0) ||
          this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.EDIT, 0) ||
          this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.DELETE, 0)
        )
        ) {
          permission = false;
        }
        // 委譲者オーダー承認
        if(permission_NotConsented_View.includes(menu_item.id)){
          let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
          permission = authInfo.staff_category === 1 ? true : false;
        }
        // 予約カレンダー権限
        if(permission_reservation_schedule_add.includes(menu_item.id) && !this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.REGISTER, 0)
        ) {
          permission = false;
        }
        // 予約カレンダー閲覧権限
        if(permission_reservation_schedule_view.includes(menu_item.id) && !(
          this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.READ, 0) ||
          this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.REGISTER, 0) ||
          this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.EDIT, 0) ||
          this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.DELETE, 0)
        )
        ) {
          permission = false;
        }
        if (permission == false) {
          this.props.history.replace("/top");
        }
        if (menu_item.enabled_in_patient_page == 1 && menu_item.enabled_in_default_page == 0) {  // karte page
          let url = menu_item.url;
          if (url == "" || url == null) {
            let modal_url = getUrlFromMenuItem(menu_item);
            if (modal_url == "") return;
            url = modal_url;
            menu_item.url = modal_url;
            if(url == "physiological" || url == "endoscope") { // 生理検査
              let inspection_id = getInspectionItemId(menu_item);
              menu_item.inspectionId = inspection_id;
            }
            else if(url == "radiation") { // 放射線
              let radiation_id = getRadiationItemId(menu_item);
              menu_item.radiation_id = radiation_id;
            } else if(url == "allergy") { // アレルギー関連
              let allergy_type = getAllergyItemId(menu_item);
              menu_item.allergy_type = allergy_type;
            } else if(url == "openExamination") { // 検体検査関連
              let examination_type = getExaminationItemId(menu_item);
              menu_item.examination_type = examination_type;
            }
          }
          if (menu_item.is_modal == 1) {
            menu_item.type = "modal";
          }
          menu_item.ele=menu_item;
          localApi.setObject("select_menu_info", menu_item);
          localApi.setValue("system_before_page", url);
          this.props.history.replace("/patients/0/soap");
        } else {
          // ■YJ781 ログイン時画面・ホームボタン関連の修正
          // ・ベッドコントロールのように、一覧系の特定の画面に移動して開くモーダル。
          if (menu_item.name == "ベッドコントロール") {
            localApi.setValue("bed_control_open", 1);                      
            localApi.remove('ward_map_ward_id');            
            this.props.history.replace("/hospital_ward_map");
            return;
          } else if(menu_item.name == "グループスケジュール登録" || menu_item.name == "スケジュール登録" || menu_item.name == "予約登録") {
            let temp_url = "";
            if (menu_item.name == "グループスケジュール登録") {
              temp_url = "visit_treatment_group";
            } else if(menu_item.name == "スケジュール登録") {
              temp_url = "visit_treatment_patient";
            } else if(menu_item.name == "予約登録") {
              temp_url = "reservation_create";
            }
            this.showModalByCategory(temp_url);
            return;
          }

          // ■YJ781 ログイン時画面・ホームボタン関連の修正
          // ・サマリ一覧など、特定の画面である必要が無いモーダル（＊ログイン時は未設定時のから画面の上に開けばok）
          if(menu_item.name == "放射線検査予定一覧"){
            this.setState({
              isOpenModal: false,
              isRadiationReservationListPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "薬品情報検索"){
            this.setState({
              isOpenModal: false,
              isChemicalInformationSearchPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "栄養指導"){
            this.setState({
              isOpenModal: false,
              isNutritionGuidanceSlipTotalPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "生理検査予定一覧"){
            this.setState({
              isOpenModal: false,
              isInspectionReservationListPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "内視鏡検査予定一覧"){
            this.setState({
              isOpenModal: false,
              isEndoscopeReservationListPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "病棟検体ラベル"){
            this.setState({
              isOpenModal: false,
              isWardLabelPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "生理検査予約状況一覧"){
            this.setState({
              isOpenModal: false,
              isInspectionStatusListPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "endoscope_status_list"){
            this.setState({
              isOpenModal: false,
              isEndoscopeStatusListPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "放射線予約状況一覧"){
            this.setState({
              isOpenModal: false,
              isRadiationStatusListPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "生理検査科別統計"){
            this.setState({
              isOpenModal: false,
              isInspectionDepartmentResultPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "放射線統計"){
            this.setState({
              isOpenModal: false,
              isRadiationDepartmentResultPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "内視鏡科別統計"){
            this.setState({
              isOpenModal: false,
              isEndoscopeDepartmentResultPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "外注検査連携依頼出力"){
            this.setState({
              isOpenModal: false,
              isOutExamCooperationRequestOutputPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "救急受付"){
            this.setState({
              isOpenModal: false,
              isEmergencyReceptionPopupOpen:true,
            });
            return;
          }
          if(menu_item.id == 299 || menu_item.id == 452 || menu_item.id == 453 || menu_item.id == 454 || menu_item.id == 455){
            let report_creat_list_type = "";
            switch (menu_item.id){
              case 299:
                break;
              case 452:
                report_creat_list_type = "rehabily";
                break;
              case 453:
                report_creat_list_type = "radiation";
                break;
              case 454:
                report_creat_list_type = "inspection";
                break;
              case 455:
                report_creat_list_type = "endoscope";
                break;
            }
            this.setState({
              isOpenModal: false,
              isReportCreatListPopupOpen:true,
              report_creat_list_type,
            });
            return;
          }
          if(menu_item.name == "看護日誌統計") {
            this.setState({
              isOpenModal: false,
              isAdminDiaryPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "管理日誌メニュー") {
            this.setState({
              isOpenModal: false,
              isAdministrationDiaryPopupOpen:true,
            });
            return;
          }
          if(menu_item.id == 840){
            this.setState({
              isOpenModal: false,
              isHospitalizedSettingPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "入院連絡患者一覧"){
            this.setState({
              isOpenModal: false,
              isInpatientContactListPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "処置注射患者一覧"){
            this.setState({
              isOpenModal: false,
              isOutInjectionPatientListPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "看護師業務分担"){
            this.setState({
              isOpenModal: false,
              isNurseAssignmentPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "患者スケジュール"){
            this.setState({
              isOpenModal: false,
              isPatientsSchedulePopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "移動予定患者一覧"){
            this.setState({
              isOpenModal: false,
              isMovePlanPatientListPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "入院患者バーコード印刷"){
            this.setState({
              isOpenModal: false,
              isHospitalPatientBarcodePrintPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "患者認証業務"){
            this.setState({
              isOpenModal: false,
              isPatientCertificationPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "看護サマリー一覧"){
            this.setState({
              isOpenModal: false,
              isNurseSummaryListPopupOpen:true,
            });
            return;
          }
          if (menu_item.name == '訪問看護サマリー一覧'){
            this.setState({
              isOpenModal: false,
              isVisitNurseSummaryListPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == "服薬指導スケジュール"){
            this.setState({
              isOpenModal: false,
              isMedicationGuidanceSchedulePopupOpen:true,
            });
            return;
          }
          if(menu_item.name == '入退院計画一覧'){
            this.setState({
              isOpenModal: false,
              isHospitalPlanListPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == 'サマリ一覧'){
            this.setState({
              isOpenModal: false,
              isSummaryListPopupOpen:true,
            });
            return;
          }
          if(menu_item.id == 136){
            this.setState({
              isOpenModal: false,
              isDocumentReferencePopupOpen:true,
            });
            return;
          }
          if(menu_item.id == 203 || menu_item.id == 113){
            this.setState({
              isOpenModal: false,
              isDocumentCreatePopupOpen:true,
            });
            return;
          }
          if(menu_item.name == 'スキャナ一括取込（紙文書取込）'){
            this.setState({
              isOpenModal: false,
              isScannerBatchTakeDocPopupOpen:true,
            });
            return;
          }
          if(menu_item.name == '熱型表'){
            this.setState({
              isOpenModal: false,
              isProgressChartPopup:true,
            });
            return;
          }
          

          if (menu_item.url != ""){
            this.props.history.replace(menu_item.url);
          } else {
            this.props.history.replace("/top");
          }
        }
      } catch (err) {
        /* eslint-disable no-console */
        console.error(err);
        this.props.history.replace("/top");
      }
    } else {
      var confirm_message = '';
      var confirm_type = '';
      var dial_change_flag = sessApi.getObjectValue('dial_change_flag');
      if(this.change_dial_delete == null && dial_change_flag !== undefined && dial_change_flag != null){
        confirm_message = "登録していない内容があります。\n変更内容を破棄して移動しますか？";
        confirm_type = "change_dial_page";
      }
      if(confirm_message !== ""){
        this.setState({
          confirm_message,
          confirm_type,
          go_func:"goHomePage",
          confirm_alert_title:'入力中'
        });
        return;
      } else {
        this.change_dial_delete = null;
      }
      this.setState({isOpenModal: false},()=>{
        window.sessionStorage.removeItem("dial_setting");
        window.sessionStorage.removeItem("from_print");
        window.sessionStorage.removeItem("form_bed_table");
        let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
        if(initState.enable_dialysis == 1 && initState.terminal_info != undefined &&
          initState.terminal_info != null && initState.terminal_info.start_page != undefined){
          if (initState.terminal_info.start_page === "ベッドサイド"){
            sessApi.setValue("from_terminal", 1);
            setTimeout(()=>{
              this.props.history.replace("/dial/board/system_setting");
            }, 100);
          } else if(initState.terminal_info.start_page === "予約一覧") {
            this.props.history.replace("/dial/weight/patientList");
          }
          else {
            this.props.history.replace("/top");
          }
        } else {
          this.props.history.replace("/top");
        }
      });
    }
  }
  
  isPatientPage = (tab_id=null) => {
    let path = window.location.href.split("/");
    if (path[path.length-1] == "nursing_document"){//3:看護記録画面の場合
      return tab_id == 3 ? true : false;
    }
    let re = /patients[/]\d+/;
    let isPatientPage = re.test(window.location.href);
    return isPatientPage ? true : false;
  }

  isEqualPage = (_type) => {
    let result = "";
    let path = window.location.href.split("/");
    if (_type == "prescription") {
      if (path[path.length-1] == "prescription") {
        result = "prescription";
      }
    } else if(_type == "soap") {
      if (path[path.length-1] == "soap") {
        result = "soap"; 
      }
    }    
    return result;
  }

  equalAliasName = (id, arr_history_ids) => {
    if (arr_history_ids != null && arr_history_ids != undefined && arr_history_ids.length > 0) {
      let menu_item = this.getNavigationMenuInfoById(id);
      let result = false;
      arr_history_ids.map(item=>{
        let tmp_menu_item = this.getNavigationMenuInfoById(item);
        if (menu_item != null && tmp_menu_item != null) {
          if (menu_item.is_alias_for != null && menu_item.is_alias_for != undefined && tmp_menu_item.is_alias_for != null && tmp_menu_item.is_alias_for != undefined) {

            if (menu_item.is_alias_for != "" && menu_item.is_alias_for == tmp_menu_item.is_alias_for) {
              result = true;
            }
          }
        }
      });
      return result;
    } else {
      return false;
    }
  }

  getEqualAliasId = (id, arr_history_ids) => {
    if (arr_history_ids != null && arr_history_ids != undefined && arr_history_ids.length > 0) {
      let menu_item = this.getNavigationMenuInfoById(id);
      let result_id = 0;
      arr_history_ids.map(item=>{
        let tmp_menu_item = this.getNavigationMenuInfoById(item);
        if (menu_item != null && menu_item != undefined && menu_item.is_alias_for != null && menu_item.is_alias_for != undefined
          && tmp_menu_item != null && tmp_menu_item != undefined && tmp_menu_item.is_alias_for != null && tmp_menu_item.is_alias_for != undefined) {
          if (menu_item.is_alias_for != "" && menu_item.is_alias_for == tmp_menu_item.is_alias_for) {
            result_id = item;
          }
        }
      });
      return result_id;
    } else {
      return 0;
    }

  }

  closeAlertModal = () => {
    this.setState({
      alert_messages: "",
      prescription_confirm_message: "",
      prescription_selected_id: 0,
      okTitle: "",
      cancelTitle: ""
    });
  }

  nextUrlCheckFromPrescription = (type, cur_url, url = null, id = null, menu_item = null, patient_id = null, act = null) => {
    let result = false;
    let patientId = 0;
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    if (current_system_patient_id != undefined && current_system_patient_id != null && current_system_patient_id > 0) {
      patientId = current_system_patient_id;
    }
    let cachePrescription = null;
    if (patientId > 0) {
      if (cur_url == "prescription") {
        let active_key = karteApi.getSubVal(parseInt(patientId), CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
        cachePrescription = karteApi.getSubVal(parseInt(patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);
      } else {
        let active_key = karteApi.getSubVal(parseInt(patientId), CACHE_LOCALNAMES.ACTIVE_KEY, "injection");
        cachePrescription = karteApi.getSubVal(parseInt(patientId), CACHE_LOCALNAMES.INJECTION_EDIT, active_key);
      }

      let canConfirm = cachePrescription != undefined && cachePrescription != null && cachePrescription.length > 0 && cachePrescription[0].canConfirm != undefined && cachePrescription[0].canConfirm != null ? cachePrescription[0].canConfirm : 0;
      if (canConfirm == 2) { // if 確認済み
        return false;
      }

      // if editing prescription or injection
      if (cachePrescription != undefined && cachePrescription != null && cachePrescription[0].isUpdate != undefined && cachePrescription[0].isUpdate == 1) {
        this.setState({
          alert_messages: cur_url == "prescription" ? "入力中の処方があります。確認か破棄を行ってください" : "入力中の注射があります。確認か破棄を行ってください"
        });
        return true;
      }

      if (cachePrescription != undefined &&
        cachePrescription != null &&
        cachePrescription.length > 0 &&
        cachePrescription[0].temp_saved != undefined &&
        cachePrescription[0].temp_saved != null &&
        cachePrescription[0].temp_saved == 0) {
        result = true;

        let prescription_confirm_message = "";
        if (cur_url == "prescription") {
          prescription_confirm_message = canConfirm == 1 ? "入力中の処方内容があります、保村しますか？破棄しますか？" : "記載途中ですが、確定しますか？";
        } else if(cur_url == "injection") {
          prescription_confirm_message = canConfirm == 1 ? "入力中の注射内容があります、保村しますか？破棄しますか？" : "記載途中ですが、確定しますか？";
        }
        if (canConfirm == 1) {
          this.setState({
            alert_messages: cur_url == "prescription" ? "入力中の処方があります。確認か破棄を行ってください" : "入力中の注射があります。確認か破棄を行ってください"
          });
          return true;
        }
        let okTitle = canConfirm == 1 ? "保存" : "破棄";
        let cancelTitle = canConfirm == 1 ? "破棄" : "戻る";
        let prescription_from = type;

        this.setState({
          prescription_confirm_message,
          cur_url,
          okTitle,
          cancelTitle,
          canConfirm,
          prescription_selected_id: id,
          prescription_url: url,
          prescription_menu_item: menu_item,
          prescription_from,
          prescription_patient_id: patient_id,
          prescription_act: act
        });
      }
    }
    return result;
  }
  
  nextUrlCheckFromCache = (type, cur_url, url = null, id = null, menu_item = null, patient_id = null, act = null, confirm_event = null) => {
    let nursing_history = localApi.getObject("nursing_history");
    if (nursing_history !== undefined && nursing_history != null && nursing_history.progress_chat !== undefined &&
      (nursing_history.progress_chat.result_changed == true || nursing_history.progress_chat.meal_changed == true
        || nursing_history.progress_chat.oxygen_changed == true)) {
      this.setState({
        confirm_message : "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type : "change_document_page",
        cur_url,
        check_selected_id: id,
        check_url: url,
        check_menu_item: menu_item,
        check_from : type,
        check_act: act,
        check_patient_id: patient_id,
        confirm_event: confirm_event,
      })
      return true;
    } else {
      return false;
    }
  }

  onGoto = (url, id, menu_item) => {
    // HARUKA(共通, カルテ記載, 看護業務, 部門) + 透析履歴追加
    if (this.context.currentSystem == "haruka") {
      let path = window.location.href.split("/");
      if(menu_item.ele.tab_id == 3 && this.isPatientPage(menu_item.ele.tab_id)){
        if(path[path.length - 1] == "nursing_document"){  //check 看護記録画面
          let nurse_patient_info = localApi.getObject("nurse_patient_info");
          if(nurse_patient_info !== undefined && nurse_patient_info != null){
            if (nurse_patient_info.patientInfo.is_death == 1) {// check 死亡状態
              this.setState({alertMessage: "death"});
              return;
            }
            if(url == "nurse_plan"){
              this.setState({isNursePlanPopup:true});
              return;
            }
            if(url == "nurse_profile"){
              this.setState({isNurseProfilePopup:true});
              return;
            }
            if(url == "incharge_sheet_list"){
              this.setState({isInchargeSheetPopup:true});
              return;
            }
            if(url == "nurse_plan_reference"){
              this.setState({isNursePlanReferencePopup:true});
              return;
            }
            if(url == "individual_work_sheet"){
              this.setState({isIndividualWorkSheetPopup:true});
              return;
            }
            if(url == "nurse_instruction"){
              this.setState({isNurseInstructionPopup:true});
              return;
            }
            if(url == "hospital_instruction"){
              this.setState({isHospitalInstructionPopup:true});
              return;
            }
            if(menu_item.ele.id == 321){ //看護記録
              let patient_id = nurse_patient_info.detailedPatientInfo.patient[0]['number'];
              localApi.setValue("system_before_page", "/patients/"+patient_id+"/soap");
              this.props.history.replace("/patients/"+patient_id+"/nursing_document");
              return;
            }
          }
        }
        if(menu_item.ele.id == 321){
          localApi.remove("nurse_patient_info");
          localApi.remove("nurse_record");
          localApi.remove("nursing_history");
          let patient_id = localApi.getValue("current_system_patient_id");
          localApi.setValue("system_before_page", "/patients/"+patient_id+"/soap");
          this.props.history.replace("/patients/"+patient_id+"/nursing_document");
          return;
        }
      }
      let current_system_patient_id = localApi.getValue("current_system_patient_id");
      // check karte mode
      if (this.isPatientPage() && this.context.$getKarteMode(current_system_patient_id) == KARTEMODE.READ && menu_item != null && menu_item != undefined &&  menu_item.ele.type == "modal") {
        if (!(menu_item.ele.id == 290 || menu_item.ele.id == 136)) { // PACS enable in read mode
          return;
        }
      }
      if (path[path.length - 1] == "prescription" || path[path.length - 1] == "injection") {
        if ((url == "prescription" && path[path.length - 1] == "prescription") || (url == "injection" && path[path.length - 1] == "injection")) {
          this.harukaGoto(url, id, menu_item);
        } else {
          if (menu_item.ele.type == "modal") {
            this.harukaGoto(url, id, menu_item);
          } else {
            if (this.nextUrlCheckFromPrescription("navigation", path[path.length - 1], url, id, menu_item) == false) {
              this.harukaGoto(url, id, menu_item);
            }
          }
        }
      } else if (path[path.length - 1] == "nursing_document") {
        if (menu_item.ele.type == "modal") {
          this.harukaGoto(url, id, menu_item);
        } else {
          if (this.nextUrlCheckFromCache("navigation", path[path.length - 1], url, id, menu_item) == false) {
            this.harukaGoto(url, id, menu_item);
          }
        }
      } else {
        this.harukaGoto(url, id, menu_item);
      }
    } else { // 透析
      sessApi.remove('dial_change_flag');
      this.DialysisGoto(url, id);
    }
  }

  harukaGoto = async(url, id, menu_item) => {
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    // ■YJ34 PACS機能の修正
    // (B) 閉じるための機能が動作していない
    // ・右サイドバーのメニューなどから、カルテ内用でないページに移動したとき。
    if (menu_item.enabled_in_default_page == 1 && menu_item.is_modal != 1) {
      //check pac on
      let pac_status = patientApi.getVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);

      if (pac_status != undefined && pac_status != null && pac_status == "on") {
        openPacs(current_system_patient_id, "close");
        patientApi.delVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);
      }
    }

    // 履歴メニュー操作
    let maxShows = this.context.linkHistoryMaxshows;
    let tmp = this.context.linkHistoryList.slice(0, maxShows);

    // no exist
    if (!tmp.includes(id) && this.equalAliasName(id, tmp) == false) {
      if (tmp.length >= maxShows) {
        tmp.pop();
      }
      tmp.splice(0, 0, id);
    } else if(tmp.includes(id) || this.equalAliasName(id, tmp) == true) {
      if (tmp.includes(id)) { // id exisst
        tmp.splice(tmp.indexOf(id), 1);
        tmp.splice(0, 0, id);
      } else if(this.equalAliasName(id, tmp) == true) {// alias exist
        //get alias id
        let equal_id = this.getEqualAliasId(id, tmp);
        if (equal_id > 0) {
          tmp.splice(tmp.indexOf(equal_id), 1);
          tmp.splice(0, 0, equal_id);
        }
      }
    }
    this.context.$updateLinkHistoryList(tmp);

    if(url == "radiation_reservation_list"){
      this.setState({
        isOpenModal: false,
        isRadiationReservationListPopupOpen:true,
      });
      return;
    }
    if(url == "chemical_information_search"){
      this.setState({
        isOpenModal: false,
        isChemicalInformationSearchPopupOpen:true,
      });
      return;
    }
    if(url == "nutrition_guidance_slip_total"){
      this.setState({
        isOpenModal: false,
        isNutritionGuidanceSlipTotalPopupOpen:true,
      });
      return;
    }
    if(url == "inspection_reservation_list"){
      this.setState({
        isOpenModal: false,
        isInspectionReservationListPopupOpen:true,
      });
      return;
    }
    if(url == "endoscope_reservation_list"){
      this.setState({
        isOpenModal: false,
        isEndoscopeReservationListPopupOpen:true,
      });
      return;
    }
    if(url == "ward_label"){
      this.setState({
        isOpenModal: false,
        isWardLabelPopupOpen:true,
      });
      return;
    }
    if(url == "inspection_status_list"){
      this.setState({
        isOpenModal: false,
        isInspectionStatusListPopupOpen:true,
      });
      return;
    }
    if(url == "endoscope_status_list"){
      this.setState({
        isOpenModal: false,
        isEndoscopeStatusListPopupOpen:true,
      });
      return;
    }
    if(url == "radiation_status_list"){
      this.setState({
        isOpenModal: false,
        isRadiationStatusListPopupOpen:true,
      });
      return;
    }
    if(url == "inspection_department_result"){
      this.setState({
        isOpenModal: false,
        isInspectionDepartmentResultPopupOpen:true,
      });
      return;
    }
    if(url == "radiation_department_result"){
      this.setState({
        isOpenModal: false,
        isRadiationDepartmentResultPopupOpen:true,
      });
      return;
    }
    if(url == "endoscope_department_result"){
      this.setState({
        isOpenModal: false,
        isEndoscopeDepartmentResultPopupOpen:true,
      });
      return;
    }
    if(url == "out_exam_cooperation_request_output"){
      this.setState({
        isOpenModal: false,
        isOutExamCooperationRequestOutputPopupOpen:true,
      });
      return;
    }
    if(url == "emergency_reception"){
      this.setState({
        isOpenModal: false,
        isEmergencyReceptionPopupOpen:true,
      });
      return;
    }
    if(url == "report_creat_list"){
      let report_creat_list_type = "";
      switch (id){
        case 299:
          break;
        case 452:
          report_creat_list_type = "rehabily";
          break;
        case 453:
          report_creat_list_type = "radiation";
          break;
        case 454:
          report_creat_list_type = "inspection";
          break;
        case 455:
          report_creat_list_type = "endoscope";
          break;
      }
      this.setState({
        isOpenModal: false,
        isReportCreatListPopupOpen:true,
        report_creat_list_type,
      });
      return;
    }
    if(url == "admin_diary") {
      this.setState({
        isOpenModal: false,
        isAdminDiaryPopupOpen:true,
      });
      return;
    }
    if(url == "administration_diary") {
      this.setState({
        isOpenModal: false,
        isAdministrationDiaryPopupOpen:true,
      });
      return;
    }
    if(url == "bed_control"){
      localApi.setValue("bed_control_open", 1);
      let cur_page = "";
      let path = window.location.href.split("/");
      cur_page = path[path.length - 1];
      if(cur_page != "hospital_ward_map"){
        localApi.remove('ward_map_ward_id');
      }
      this.props.history.replace("/hospital_ward_map");
      return;
    }
    if(url == "hospitalized_setting"){
      this.setState({
        isOpenModal: false,
        isHospitalizedSettingPopupOpen:true,
      });
      return;
    }
    if(url == "inpatient_contact_list"){
      this.setState({
        isOpenModal: false,
        isInpatientContactListPopupOpen:true,
      });
      return;
    }
    if(url == "out_injection_patient_list"){
      this.setState({
        isOpenModal: false,
        isOutInjectionPatientListPopupOpen:true,
      });
      return;
    }
    if(url == "nurse_assignment"){
      this.setState({
        isOpenModal: false,
        isNurseAssignmentPopupOpen:true,
      });
      return;
    }
    if(url == "patients_schedule"){
      this.setState({
        isOpenModal: false,
        isPatientsSchedulePopupOpen:true,
      });
      return;
    }
    if(url == "move_plan_patient_list"){
      this.setState({
        isOpenModal: false,
        isMovePlanPatientListPopupOpen:true,
      });
      return;
    }
    if(url == "hospital_patient_barcode_print"){
      this.setState({
        isOpenModal: false,
        isHospitalPatientBarcodePrintPopupOpen:true,
      });
      return;
    }
    if(url == "patient_certification"){
      this.setState({
        isOpenModal: false,
        isPatientCertificationPopupOpen:true,
      });
      return;
    }
    if(url == "nurse_summary_list"){
      this.setState({
        isOpenModal: false,
        isNurseSummaryListPopupOpen:true,
      });
      return;
    }
    if (url == 'visit_nurse_summary'){
      this.setState({
        isOpenModal: false,
        isVisitNurseSummaryListPopupOpen:true,
      });
      return;
    }
    if(url == "medication_guidance_schedule"){
      this.setState({
        isOpenModal: false,
        isMedicationGuidanceSchedulePopupOpen:true,
      });
      return;
    }
    if(url == 'hospital_plan_list'){
      this.setState({
        isOpenModal: false,
        isHospitalPlanListPopupOpen:true,
      });
      return;
    }
    if(url == 'summary_list'){
      this.setState({
        isOpenModal: false,
        isSummaryListPopupOpen:true,
      });
      return;
    }
    if(url == 'document_reference'){
      this.setState({
        isOpenModal: false,
        isDocumentReferencePopupOpen:true,
      });
      return;
    }
    if(url == 'document_create'){
      this.setState({
        isOpenModal: false,
        isDocumentCreatePopupOpen:true,
      });
      return;
    }
    if(url == 'scanner_batch_take_doc'){
      this.setState({
        isOpenModal: false,
        isScannerBatchTakeDocPopupOpen:true,
      });
      return;
    }
    if(url == 'progress_chart'){
      this.setState({
        isOpenModal: false,
        isProgressChartPopup:true,
      });
      return;
    }
    // ====== modal ============
    if(url === "visit_treatment_group" || url === "visit_treatment_patient" || url === "reservation_create"){
      this.showModalByCategory(url);
      return;
    }
    // ==========================(modal)

    // メニューモーダルを閉じる
    this.context.$selectMenuModal(false);
    this.setState({isOpenModal: false});
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let postData = {
      number: authInfo.user_number,
      link_history_json: JSON.stringify(tmp),
      type: this.context.currentSystem
    };
    axios.post("/app/api/v2/user/link_history/set", {params:postData});
    // store before page
    let url_path = window.location.href.split("#");
    if (this.isPatientPage() == false) { // when no patient page
      localApi.setValue("system_before_page", url_path[1]);
    }
    // カルテページ
    // if (url == "prescription" || url == "injection" || url == "soap" || url == "openExamination") {
    if (menu_item != null && menu_item != undefined && menu_item.enabled_in_patient_page == 1 && menu_item.enabled_in_default_page == 0) {
      // let re = /patients[/]\d+/;
      // let isPatientPage = re.test(window.location.href);
      if (this.isPatientPage() == false) { // if patientId no exist
        url = "/patients/0/soap";
      } else { // if patientId exist
        // check 死亡状態        
        if (this.checkDeathPatient(menu_item.ele.type, url)) {          
          this.setState({
            alertMessage: "death"
          });
          return;
        }
        
        if (menu_item.ele.type == "modal") { // modal
          if (url == "physiological") {
            patientModalEvent.emit("clickOpenPhysiologicalPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "endoscope") {
            patientModalEvent.emit("clickOpenPhysiologicalPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "openExamination") {
            patientModalEvent.emit("clickOpenExaminationPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "outpatient") {
            patientModalEvent.emit("clickOpenOutpatientPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "instruction_book") {
            patientModalEvent.emit("clickOpenInstructionBookPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "move_meal_calendar") {
            patientModalEvent.emit("clickOpenMoveMealCalendarPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "batch_do_prescription_list") {
            patientModalEvent.emit("clickOpenBatchDoPrescriptionListPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "nurse_plan") {
            patientModalEvent.emit("clickOpenNursePlanPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "nurse_plan_reference") {
            patientModalEvent.emit("clickOpenNursePlanReferencePopup", menu_item);
            event.stopPropagation();
          }
          if (url == "individual_work_sheet") {
            patientModalEvent.emit("clickOpenIndividualWorkSheetPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "nurse_instruction") {
            patientModalEvent.emit("clickNurseInstructionPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "hospital_instruction") {
            patientModalEvent.emit("clickHospitalInstructionPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "nurse_profile") {
            patientModalEvent.emit("clickNurseProfilePopup", menu_item);
            event.stopPropagation();
          }
          if (url =='nurse_anamnese'){
            patientModalEvent.emit("clickNurseAnamunePopup", menu_item);
            event.stopPropagation();
          }          
          if (url == "incharge_sheet_list") {
            patientModalEvent.emit("clickInchargeSheetPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "instruction_book_list") {
            patientModalEvent.emit("clickOpenInstructionBookListPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "out_hospital_group_delete") {
            patientModalEvent.emit("clickOpenOutHospitalGroupDeletePopup", menu_item);
            event.stopPropagation();
          }
          if (url == "stop_prescription") {
            patientModalEvent.emit("clickOpenStopPrescriptionPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "allergy") {
            patientModalEvent.emit("clickOpenAllergyPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "account_hospital_order") {
            patientModalEvent.emit("clickOpenAccountHospitalOrderPopup", menu_item);
            event.stopPropagation();
          }

          if (url == "radiation") {
            patientModalEvent.emit("clickOpenRadiationPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "rehabilitation") {
            patientModalEvent.emit("clickOpenRehabilyPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "print/haruka/medical_info_doc") {
            patientModalEvent.emit("clickOpenMedicalInfoPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "print/haruka/karte") {
            patientModalEvent.emit("clickOpenKartePrintPopup", menu_item);
            event.stopPropagation();
          }
          //バーコード台紙印刷----------------
          if (url == "barcode_mount_print") {
            patientModalEvent.emit("clickOpenBarcodeMountPrint", menu_item);
            event.stopPropagation();
          }
          if (url == "guidance") {
            patientModalEvent.emit("clickOpenGuidancePopup", menu_item);
            event.stopPropagation();
          }
          if (url == "change_responsibility") {
            patientModalEvent.emit("clickOpenChangeResponsibilityPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "simple_order") {
            patientModalEvent.emit("clickOpenSimpleOrderPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "diseaseName") {
            patientModalEvent.emit("clickOpenPatientDiseaseNamePopup", menu_item);
            event.stopPropagation();
          }
          if (url == "home_treatment") {
            patientModalEvent.emit("clickOpenHomeTreatmentPopup", menu_item);
            event.stopPropagation();
          }
          //死亡登録----------------
          if (url == "death_register") {
            patientModalEvent.emit("clickOpenDeathRegister", menu_item);
            event.stopPropagation();
          }
          //退院実施----------------
          if (url == "discharge_done") {
            patientModalEvent.emit("clickOpenDischargeDoneOrder", menu_item);
            event.stopPropagation();
          }
          //退院決定オーダ----------------
          if (url == "discharge_decision") {
            patientModalEvent.emit("clickOpenDischargeDecisionOrder", menu_item);
            event.stopPropagation();
          }
          //入院実施----------------
          if (url == "hospital_done") {
            patientModalEvent.emit("clickOpenHospitalDoneOrder", menu_item);
            event.stopPropagation();
          }
          //指示簿カレンダー----------------
          if (url == "instruction_book_calendar") {
            patientModalEvent.emit("clickOpenInstructionBookCalendar", menu_item);
            event.stopPropagation();
          }
          if (url == "hospital_treatment") {
            patientModalEvent.emit("clickOpenHospitalTreatmentPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "set_create") {
            patientModalEvent.emit("clickOpenSetCreatePopup", menu_item);
            event.stopPropagation();
          }
          if (url == "set_register") {
            patientModalEvent.emit("clickOpenSetRegisterPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "set_deployment") {
            patientModalEvent.emit("clickOpenSetDeploymentPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "document_create") {
            patientModalEvent.emit("clickOpenDocumentCreatePopup", menu_item);
            event.stopPropagation();
          }
          if (url == "importance_order_list") {
            patientModalEvent.emit("clickOpenImportanceOrderListPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "period_order_list") {
            patientModalEvent.emit("clickOpenPeriodOrderListPopup", menu_item);
            event.stopPropagation();
          }
          if (url == "pills") {
            patientModalEvent.emit("clickOpenPillsPopup", menu_item);
            event.stopPropagation();
          }

          if (url == "symptomDetail") {
            patientModalEvent.emit("clickOpenSymptomDetail", menu_item);
            event.stopPropagation();
          }
          //指導料マスタメンテナンス
          if (url == "guidance_fee_master") {
            patientModalEvent.emit("clickOpenGuidanceFeeMaster", menu_item);
            event.stopPropagation();
          }
          //入院申込オーダ----------------
          if (url == "hospital_application_order") {
            patientModalEvent.emit("clickOpenHospitalApplicationOrder", menu_item);
            event.stopPropagation();
          }
          //入院決定オーダー----------------
          if (url == "hospital_dicision_order") {
            patientModalEvent.emit("clickOpenHospitalDecisionOrder", menu_item);
            event.stopPropagation();
          }
          //退院許可オーダー----------------
          if (url == "discharge_permit_order") {
            patientModalEvent.emit("clickOpenDischargePermitOrder", menu_item);
            event.stopPropagation();
          }

          //入院時現症----------------
          if (url == "hospital_disease") {
            patientModalEvent.emit("clickOpenHospitalDisease", menu_item);
            event.stopPropagation();
          }

          //服薬指導依頼----------------
          if (url == "medicine_guidance") {
            patientModalEvent.emit("clickOpenMedicineGuidance", menu_item);
            event.stopPropagation();
          }

          //栄養指導依頼----------------
          if (url == "nutrition_guidance") {
            patientModalEvent.emit("clickOpenNutritionGuidance", menu_item);
            event.stopPropagation();
          }

          //ＳＯＡＰ＆フォーカス----------------
          if (url == "soap_focus") {
            patientModalEvent.emit("clickOpenSoapFocus", menu_item);
            event.stopPropagation();
          }

          //看護師業務分担----------------
          if (url == "nurse_assignment") {
            patientModalEvent.emit("clickOpenNurseAssignment", menu_item);
            event.stopPropagation();
          }

          //一般細菌検査-------------------------------------------------
          if (url == "bacillus_inspection") {
            patientModalEvent.emit("clickBacillusInspection", menu_item);
            event.stopPropagation();
          }
          //持参薬報告-------------------------------------------------
          if (url == "potion_report") {
            patientModalEvent.emit("clickOpenPotionReportPopup", menu_item);
            event.stopPropagation();
          }
          //入院処方指示-------------------------------------------------
          if (url == "hospital_prescription") {
            patientModalEvent.emit("clickOpenHospitalPrescriptionPopup", menu_item);
            event.stopPropagation();
          }

          if (url == "pacs") {
            // patientModalEvent.emit("clickOpenPacsPopup", menu_item);
            // event.stopPropagation();
            let patientInfo = karteApi.getPatient(current_system_patient_id);
            if(patientInfo == undefined || patientInfo == null) return;

            // YJ34 PACS機能の修正
            patientApi.setVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS, JSON.stringify("on"));
            openPacs(patientInfo.receId, "open");

            /*let url =
              "http://TFS-C054/01Link/start.aspx?UserID=miyakojima&Password=miyakojima&ApplicationID=1600&RedirectURL=PatID%3d" +
              patientInfo.receId;
            var params = [
              'height='+screen.height,
              'width='+screen.width,
              'fullscreen=yes', // only works in IE, but here for completeness
              'resizable=yes'
            ].join(',');
            window.open(url, "OpenPACS", params);            */
          }
          return;
        }
        // 在宅処方、在宅注射の場合 karte status: 訪問診療
        if (url == "/home_prescription" || url == "/home_injection") {
          // check 訪問診療 config
          if (this.hasPermissionConfig("訪問診療") == true) {
            this.context.$updateKarteStatus(2, "訪問診療");
          } else {// no permission
            this.context.$updateKarteStatus(0, "外来");
          }
          // 在宅処方
          if (url == "/home_prescription") url = "prescription";
          // 在宅注射
          if (url == "/home_injection") url = "injection";
        }
        if (url == "/prescription" || url == "/injection") {
          // YJ296 実施済み注射が強制的に外来で登録される不具合 2020/11/4            
          if (!this.isPatientPage()) {
            this.context.$updateKarteStatus(0, "外来");          
          }
        }
        if (url == "/hospitalize_prescription" || url == "/hospitalize_injection" || url == "/hospitalize_soap") {
          if (url == "/hospitalize_prescription" || url == "/hospitalize_injection") {
            // check 入院 config
            if (this.hasPermissionConfig("入院") == true) {
              this.context.$updateKarteStatus(1, "入院");
            } else {// no permission
              this.context.$updateKarteStatus(0, "外来");
            }
          } else if(url == "/hospitalize_soap") { // 初診・入院時ノート
            karteApi.setVal(current_system_patient_id, CACHE_LOCALNAMES.SOAP_CATEGORY, JSON.stringify("hospital_note"));
          }
          url = url == "/hospitalize_prescription" ? "prescription" : url == "/hospitalize_injection" ? "injection" : "soap";
        }

        // if no 初診・入院時ノート, set soapCategory=>"soap"
        if (url == "/soap") {
          karteApi.setVal(current_system_patient_id, CACHE_LOCALNAMES.SOAP_CATEGORY, JSON.stringify("soap"));
        }

        if (url == "/prescription" || url == "/injection" || url == "/soap" || url == "/inspection" || url == "/emergency_karte") {
          url = url.substring(1, url.length);
        }
        if(url == "/last_prescription_soap"){
          if(this.context.$getKarteMode(current_system_patient_id) == KARTEMODE.READ){
            return;
          }
          let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
          let karte_status_code = 1;
          if(id == 234){
            karte_status_code = 3;
          }
          if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
            let data = sessApi.getDoctorList();
            if(data == null) {
              data = await apiClient.get("/app/api/v2/secure/doctor/search?");
            }
            this.setState({
              doctors: data,
              cur_url:"/last_prescription_soap",
              isSelectDoctorModal:true,
              karte_status_code,
            });
            return;
          } else {
            url = "soap";
            let his = this.props.history;
            this.getLastPrescription(current_system_patient_id, this.context.department.code == 0 ? 1 : this.context.department.code, karte_status_code).then(function(value){
              if(value) {
                his.replace(url);
              }
            });
          }
        }
        if(url == "/medical_record_order"){
          let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
          if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
            let data = sessApi.getDoctorList();
            if(data == null) {
              data = await apiClient.get("/app/api/v2/secure/doctor/search?");
            }
            this.setState({
              doctors: data,
              cur_url:"/medical_record_order",
              isSelectDoctorModal:true,
            });
            return;
          } else {
            this.createMedicalRecordOrder(current_system_patient_id);
            url = "soap";
          }
        }
        this.props.history.replace(url);
        return;
      }
    }
    //委譲者オーダー承認:229
    if(url === 'consentedFromNav'){
      url = '/top';
      this.context.$updateConsentedFromNav(true);
    }

    if(url == "/visit/schedule"){
      this.checkSetVisitTreatmentMode(current_system_patient_id);
    }
    this.props.history.replace(url);
  }

  DialysisGoto = async(url, id) => {
    // 履歴メニュー操作
    let maxShows = this.context.linkHistoryMaxshows;
    let tmp = this.context.linkHistoryList.slice(0, maxShows);

    // no exist
    if (!tmp.includes(id)) {
      if (tmp.length >= maxShows) {
        tmp.pop();
      }
      tmp.splice(0, 0, id);
    } else if(tmp.includes(id)) {
      if (tmp.includes(id)) { // id exisst
        tmp.splice(tmp.indexOf(id), 1);
        tmp.splice(0, 0, id);
      }
    }
    this.context.$updateLinkHistoryList(tmp);


    // let maxShows = this.context.linkHistoryMaxshows;
    // let tmp = this.context.linkHistoryList.slice(0, maxShows);
    // if (!tmp.includes(id)) {
    //   if (tmp.length >= maxShows) {
    //     // tmp.shift();
    //     tmp.pop();
    //   }
    //   // tmp.push(id);
    //   tmp.splice(0, 0, id);
    // }

    // this.context.$updateLinkHistoryList(tmp);

    // 履歴メニューDB操作
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let postData = {
      number: authInfo.user_number,
      link_history_json: JSON.stringify(tmp),
      type: this.context.currentSystem
    };
    axios.post("/app/api/v2/user/link_history/set", {params:postData});

    // カルテページ
    if (url == "prescription" || url == "injection" || url == "soap" || url == "openExamination") {
      let patientInfo = sessApi.getObjectValue("dial_setting","patient");
      let patientId = 0;
      if(patientInfo != undefined && patientInfo != null){
        patientId = patientInfo.system_patient_id;
      } else {
        let current_system_patient_id = localApi.getValue("current_system_patient_id");
        current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
        if (current_system_patient_id > 0) {
          patientId = current_system_patient_id;
        }
      }
      if (patientId > 0) {
        if (url == "openExamination") { // if 検体検査
          url = "soap";
          //   patientModalEvent.emit("clickOpenExaminationPopup", "1");
          this.props.history.replace(`/patients/${patientId}/${url}?exam=1`);
          return;
        }
        this.props.history.replace(`/patients/${patientId}/${url}`);
        return;
      }
      let path = "/app/api/v2/dial/patient/list";
      var post_data = {
        keyword:"",
      }
      const { data } = await axios.post(path, {param:post_data});
      if (data != null && data != undefined && data.data!=undefined && data.data!=null && data.data.length > 0) {
        let patient_id = data.data[0].system_patient_id;
        if (url == "openExamination") { // if 検体検査
          url = "soap";
          // patientModalEvent.emit("clickOpenExaminationPopup", "1");
          this.props.history.replace(`/patients/${patient_id}/${url}?exam=1`);
          return;
        }
        this.props.history.replace(`/patients/${patient_id}/${url}`);
        return;
      } else {
        this.props.history.replace('/dial_patients/dial_prescription');
        return;
      }
    }

    // 透析患者マスタ[新規/検索]
    if (url == "/dial/dial_new_patient") {
      let patient_obj = sessApi.getObjectValue("dial_setting", "patient");
      if (patient_obj != null && patient_obj != undefined) {
        let curPatientId = "ID：" + patient_obj.patient_number;
        let curPatientName = "患者氏名：" + patient_obj.patient_name;
        this.setState({
          isOpenDialNewPatient: true,
          new_patient_message:"現在選択中の患者様情報を解除して良いですか？"+"\n" + curPatientId + "\n" + curPatientName
        });
        return;
      }
      sessApi.setObjectValue("dial_setting", "patient", null);
      sessApi.setObjectValue("dial_setting", "patientById", null);
    }

    this.setState({
      isOpenModal: false,
    });

    this.props.history.replace(url);
  }

  confirmNewPatientOk = () => {
    sessApi.setObjectValue("dial_setting", "patient", null);
    sessApi.setObjectValue("dial_setting", "patientById", null);

    this.setState({
      isOpenModal: false,
      isOpenDialNewPatient: false,
      new_patient_message: ""
    },()=>{
      this.props.history.replace("/dial/dial_new_patient");
    });
  }

  onGotoUrlFromSidebar = (id) => {
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    if (this.context.currentSystem == "haruka") {
      //check karte page permission
      if (this.canOperateKarteMenuById(id) == 1) return;
      let menu_item_info = this.getNavigationMenuInfoById(id);
      if (menu_item_info == null || menu_item_info == undefined) return;
      if (menu_item_info.is_visible != 1 || menu_item_info.is_enabled != 1) return;
      this.sideMenuListInfo.map(item=>{
        if (item.id == id) {
          menu_item_info.ele = item;
        }
      });
      if (menu_item_info.ele == null || menu_item_info.ele == undefined) return;
      let path = window.location.href.split("/");
      if(menu_item_info.tab_id == 3 && path[path.length - 1] == "nursing_document"){  //check 看護記録画面
        let nurse_patient_info = localApi.getObject("nurse_patient_info");
        if(nurse_patient_info !== undefined && nurse_patient_info != null){
          if (nurse_patient_info.patientInfo.is_death == 1) {// check 死亡状態
            this.setState({alertMessage: "death"});
            return;
          }
          let url = getUrlFromMenuItem(menu_item_info);
          if(url == "nurse_plan"){
            this.setState({isNursePlanPopup:true});
            return;
          }
          if(url == "nurse_profile"){
            this.setState({isNurseProfilePopup:true});
            return;
          }          
          if(url == "incharge_sheet_list"){
            this.setState({isInchargeSheetPopup:true});
            return;
          }
          if(url == "nurse_plan_reference"){
            this.setState({isNursePlanReferencePopup:true});
            return;
          }
          if(url == "individual_work_sheet"){
            this.setState({isIndividualWorkSheetPopup:true});
            return;
          }
          if(url == "nurse_instruction"){
            this.setState({isNurseInstructionPopup:true});
            return;
          }
          if(url == "hospital_instruction"){
            this.setState({isHospitalInstructionPopup:true});
            return;
          }
          if(menu_item_info.id == 321){ //看護記録
            let patient_id = nurse_patient_info.detailedPatientInfo.patient[0]['number'];
            localApi.setValue("system_before_page", "/patients/"+patient_id+"/soap");
            this.props.history.replace("/patients/"+patient_id+"/nursing_document");
            return;
          }
        }
      }
      if(menu_item_info.id == 321){
        localApi.remove("nurse_patient_info");
        localApi.remove("nurse_record");
        localApi.remove("nursing_history");
        let patient_id = localApi.getValue("current_system_patient_id");
        localApi.setValue("system_before_page", "/patients/"+patient_id+"/soap");
        this.props.history.replace("/patients/"+patient_id+"/nursing_document");
        return;
      }
      // check karte mode
      if (this.isPatientPage() && this.context.$getKarteMode(current_system_patient_id) == KARTEMODE.READ && menu_item_info.ele.type == "modal") {
        if (!(menu_item_info.id == 290 || menu_item_info.id == 136)) { // PACS enable in read mode
          return;
        }
      }
      if (path[path.length - 1] == "prescription" || path[path.length - 1] == "injection") {
        if (this.nextUrlCheckFromPrescription("sidebar", path[path.length - 1], null, id, null) == false) {
          this.harukaGotoUrlFromSidebar(id);
        }
      } else if (path[path.length - 1] == "nursing_document") {
        if (this.nextUrlCheckFromCache("sidebar", path[path.length - 1], null, id, null) == false) {
          this.harukaGotoUrlFromSidebar(id);
        }
      } else {
        this.harukaGotoUrlFromSidebar(id);
      }
    } else {
      this.dialysisGotoUrlFromSidebar(id);
    }
  }

  hasPermissionConfig = (_type = null) => {
    let result = false;
    if (_type == null) return result;

    // get config info
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if(initState == undefined && initState == null && initState.conf_data == undefined) return result;

    let permission = 0;

    switch(_type){
      case "訪問診療":// karte_in_out_enable_visiting
        if(initState.conf_data.karte_in_out_enable_visiting !== undefined && initState.conf_data.karte_in_out_enable_visiting == "ON"){
          permission = 1;
        }
        break;
      case "入院":// karte_in_out_enable_hospitalization
        if(initState.conf_data.karte_in_out_enable_hospitalization !== undefined && initState.conf_data.karte_in_out_enable_hospitalization == "ON"){
          permission = 1;
        }
        break;
    }

    if (permission == 1) result = true;
    return result;
  }

  harukaGotoUrlFromSidebar = async (id) => {
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    let menu_item_info = this.getNavigationMenuInfoById(id);
    // ■YJ34 PACS機能の修正
    // (B) 閉じるための機能が動作していない
    // ・右サイドバーのメニューなどから、カルテ内用でないページに移動したとき。
    if (menu_item_info.enabled_in_default_page == 1 && menu_item_info.is_modal != 1) {
      //check pac on
      let pac_status = patientApi.getVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);
      if (pac_status != undefined && pac_status != null && pac_status == "on") {
        openPacs(current_system_patient_id, "close");
        patientApi.delVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);
      }
    }

    this.sideMenuListInfo.map(item=>{
      if (item.id == id) {
        menu_item_info.ele = item;
      }
    });

    // 履歴メニュー操作
    let maxShows = this.context.linkHistoryMaxshows;
    let tmp = this.context.linkHistoryList.slice(0, maxShows);
    // no exist
    if (!tmp.includes(id) && this.equalAliasName(id, tmp) == false) {
      if (tmp.length >= maxShows) {
        tmp.pop();
      }
      tmp.splice(0, 0, id);
    } else if(tmp.includes(id) || this.equalAliasName(id, tmp) == true) {

      if (tmp.includes(id)) { // id exisst
        tmp.splice(tmp.indexOf(id), 1);
        tmp.splice(0, 0, id);
      } else if(this.equalAliasName(id, tmp) == true) {// alias exist
        //get alias id
        let equal_id = this.getEqualAliasId(id, tmp);
        if (equal_id > 0) {
          tmp.splice(tmp.indexOf(equal_id), 1);
          tmp.splice(0, 0, equal_id);
        }
      }
    }
    this.context.$updateLinkHistoryList(tmp);

    if(menu_item_info.ele.url == "radiation_reservation_list"){
      this.setState({
        isOpenModal: false,
        isRadiationReservationListPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "chemical_information_search"){
      this.setState({
        isOpenModal: false,
        isChemicalInformationSearchPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "nutrition_guidance_slip_total"){
      this.setState({
        isOpenModal: false,
        isNutritionGuidanceSlipTotalPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "inspection_reservation_list"){
      this.setState({
        isOpenModal: false,
        isInspectionReservationListPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "endoscope_reservation_list"){
      this.setState({
        isOpenModal: false,
        isEndoscopeReservationListPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "ward_label"){
      this.setState({
        isOpenModal: false,
        isWardLabelPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "inspection_status_list"){
      this.setState({
        isOpenModal: false,
        isInspectionStatusListPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "endoscope_status_list"){
      this.setState({
        isOpenModal: false,
        isEndoscopeStatusListPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "radiation_status_list"){
      this.setState({
        isOpenModal: false,
        isRadiationStatusListPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "inspection_department_result"){
      this.setState({
        isOpenModal: false,
        isInspectionDepartmentResultPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "radiation_department_result"){
      this.setState({
        isOpenModal: false,
        isRadiationDepartmentResultPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "endoscope_department_result"){
      this.setState({
        isOpenModal: false,
        isEndoscopeDepartmentResultPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "out_exam_cooperation_request_output"){
      this.setState({
        isOpenModal: false,
        isOutExamCooperationRequestOutputPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "emergency_reception"){
      this.setState({
        isOpenModal: false,
        isEmergencyReceptionPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "report_creat_list"){
      let report_creat_list_type = "";
      switch (id){
        case 299:
          break;
        case 452:
          report_creat_list_type = "rehabily";
          break;
        case 453:
          report_creat_list_type = "radiation";
          break;
        case 454:
          report_creat_list_type = "inspection";
          break;
        case 455:
          report_creat_list_type = "endoscope";
          break;
      }
      this.setState({
        isOpenModal: false,
        isReportCreatListPopupOpen:true,
        report_creat_list_type,
      });
      return;
    }
    if(menu_item_info.ele.url == "admin_diary") {
      this.setState({
        isOpenModal: false,
        isAdminDiaryPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "administration_diary") {
      this.setState({
        isOpenModal: false,
        isAdministrationDiaryPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "bed_control"){
      localApi.setValue("bed_control_open", 1);
      let cur_page = "";
      let path = window.location.href.split("/");
      cur_page = path[path.length - 1];
      if(cur_page != "hospital_ward_map"){
        localApi.remove('ward_map_ward_id');
      }
      this.props.history.replace("/hospital_ward_map");
      return;
    }
    if(menu_item_info.ele.url == "hospitalized_setting"){
      this.setState({
        isOpenModal: false,
        isHospitalizedSettingPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "inpatient_contact_list"){
      this.setState({
        isOpenModal: false,
        isInpatientContactListPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "out_injection_patient_list"){
      this.setState({
        isOpenModal: false,
        isOutInjectionPatientListPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "nurse_assignment"){
      this.setState({
        isOpenModal: false,
        isNurseAssignmentPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "patients_schedule"){
      this.setState({
        isOpenModal: false,
        isPatientsSchedulePopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "move_plan_patient_list"){
      this.setState({
        isOpenModal: false,
        isMovePlanPatientListPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "hospital_patient_barcode_print"){
      this.setState({
        isOpenModal: false,
        isHospitalPatientBarcodePrintPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "patient_certification"){
      this.setState({
        isOpenModal: false,
        isPatientCertificationPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "nurse_summary_list"){
      this.setState({
        isOpenModal: false,
        isNurseSummaryListPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "visit_nurse_summary"){
      this.setState({
        isOpenModal: false,
        isVisitNurseSummaryListPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == "medication_guidance_schedule"){
      this.setState({
        isOpenModal: false,
        isMedicationGuidanceSchedulePopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == 'hospital_plan_list'){
      this.setState({
        isOpenModal:false,
        isHospitalPlanListPopupOpen:true,
      })
    }
    if(menu_item_info.ele.url == 'summary_list'){
      this.setState({
        isOpenModal:false,
        isSummaryListPopupOpen:true,
      })
    }
    if(menu_item_info.ele.url == 'document_reference'){
      this.setState({
        isOpenModal:false,
        isDocumentReferencePopupOpen:true,
      })
    }
    if(menu_item_info.ele.url == 'document_create'){
      this.setState({
        isOpenModal: false,
        isDocumentCreatePopupOpen:true,
      });
    }
    if(menu_item_info.ele.url == 'scanner_batch_take_doc'){
      this.setState({
        isOpenModal: false,
        isScannerBatchTakeDocPopupOpen:true,
      });
      return;
    }
    if(menu_item_info.ele.url == 'progress_chart'){
      this.setState({
        isOpenModal: false,
        isProgressChartPopup:true,
      });
      return;
    }
    if(menu_item_info.ele.url === "visit_treatment_group" || menu_item_info.ele.url === "visit_treatment_patient" || menu_item_info.ele.url === "reservation_create") {
      this.showModalByCategory(menu_item_info.ele.url);
      return;
    }
    //委譲者オーダー承認:229
    if(menu_item_info.ele.url === 'consentedFromNav'){
      url = '/top';
      this.context.$updateConsentedFromNav(true);
      this.props.history.replace(url);
      return;
    }

    let url_path = window.location.href.split("#");
    // mark sidebar menu
    menu_item_info.from = "sidebar";
    let url = menu_item_info.ele.url;
    let patientPage =  this.isPatientPage();
    let enablePatientPage = menu_item_info.enabled_in_patient_page;
    let enableDefaultPage = menu_item_info.enabled_in_default_page;
    if (patientPage != true) { // no karte page
      localApi.setValue("system_before_page", url_path[1]);
      localApi.setObject("select_menu_info", menu_item_info);
      if (enablePatientPage == 1 && enableDefaultPage == 0 ) {
        url = "/patients/0/soap";
        this.props.history.replace(url);
        return;
      }
      /*--- if default page ---*/
      this.props.history.replace(url);
    } else { // karte page
      // if you do doubleClick
      var path = window.location.href.split("/");
      if (path[path.length-2] == 0) return;
      if (menu_item_info.ele.type == "modal") { // modal
        // check 死亡状態        
        if (this.checkDeathPatient(menu_item_info.ele.type, url)) {          
          this.setState({
            alertMessage: "death"
          });
          return;
        }
        if (url == "physiological") {
          patientModalEvent.emit("clickOpenPhysiologicalPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "endoscope") {
          patientModalEvent.emit("clickOpenPhysiologicalPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "openExamination") {
          patientModalEvent.emit("clickOpenExaminationPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "outpatient") {
          patientModalEvent.emit("clickOpenOutpatientPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "instruction_book") {
          patientModalEvent.emit("clickOpenInstructionBookPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "move_meal_calendar") {
          patientModalEvent.emit("clickOpenMoveMealCalendarPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "batch_do_prescription_list") {
          patientModalEvent.emit("clickOpenBatchDoPrescriptionListPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "nurse_plan") {
          patientModalEvent.emit("clickOpenNursePlanPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "nurse_plan_reference") {
          patientModalEvent.emit("clickOpenNursePlanReferencePopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "individual_work_sheet") {
          patientModalEvent.emit("clickOpenIndividualWorkSheetPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "nurse_instruction") {
          patientModalEvent.emit("clickNurseInstructionPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "hospital_instruction") {
          patientModalEvent.emit("clickHospitalInstructionPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "nurse_profile") {
          patientModalEvent.emit("clickNurseProfilePopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "nurse_anamnese") {
          patientModalEvent.emit("clickNurseAnamunePopup", menu_item_info);
          event.stopPropagation();
        }        
        if (url == "incharge_sheet_list") {
          patientModalEvent.emit("clickInchargeSheetPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "out_hospital_group_delete") {
          patientModalEvent.emit("clickOpenOutHospitalGroupDeletePopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "instruction_book_list") {
          patientModalEvent.emit("clickOpenInstructionBookListPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "stop_prescription") {
          patientModalEvent.emit("clickOpenStopPrescriptionPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "allergy") {
          patientModalEvent.emit("clickOpenAllergyPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "account_hospital_order") {
          patientModalEvent.emit("clickOpenAccountHospitalOrderPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "rehabilitation") {
          patientModalEvent.emit("clickOpenRehabilyPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "print/haruka/medical_info_doc") {
          patientModalEvent.emit("clickOpenMedicalInfoPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "print/haruka/karte") {
          patientModalEvent.emit("clickOpenKartePrintPopup", menu_item_info);
          event.stopPropagation();
        }
        //バーコード台紙印刷----------------
        if (url == "barcode_mount_print") {
          patientModalEvent.emit("clickOpenBarcodeMountPrint", menu_item_info);
          event.stopPropagation();
        }
        if (url == "guidance") {
          patientModalEvent.emit("clickOpenGuidancePopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "change_responsibility") {
          patientModalEvent.emit("clickOpenChangeResponsibilityPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "simple_order") {
          patientModalEvent.emit("clickOpenSimpleOrderPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "diseaseName") {
          patientModalEvent.emit("clickOpenPatientDiseaseNamePopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "home_treatment") {
          patientModalEvent.emit("clickOpenHomeTreatmentPopup", menu_item_info);
          event.stopPropagation();
        }
        //死亡登録----------------
        if (url == "death_register") {
          patientModalEvent.emit("clickOpenDeathRegister", menu_item_info);
          event.stopPropagation();
        }
        //退院実施----------------
        if (url == "discharge_done") {
          patientModalEvent.emit("clickOpenDischargeDoneOrder", menu_item_info);
          event.stopPropagation();
        }
        //退院決定オーダ----------------
        if (url == "discharge_decision") {
          patientModalEvent.emit("clickOpenDischargeDecisionOrder", menu_item_info);
          event.stopPropagation();
        }
        //入院実施----------------
        if (url == "hospital_done") {
          patientModalEvent.emit("clickOpenHospitalDoneOrder", menu_item_info);
          event.stopPropagation();
        }
        //指示簿カレンダー----------------
        if (url == "instruction_book_calendar") {
          patientModalEvent.emit("clickOpenInstructionBookCalendar", menu_item_info);
          event.stopPropagation();
        }
        if (url == "hospital_treatment") {
          patientModalEvent.emit("clickOpenHospitalTreatmentPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "set_create") {
          patientModalEvent.emit("clickOpenSetCreatePopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "set_register") {
          patientModalEvent.emit("clickOpenSetRegisterPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "set_deployment") {
          patientModalEvent.emit("clickOpenSetDeploymentPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "document_create") {
          patientModalEvent.emit("clickOpenDocumentCreatePopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "radiation") {
          patientModalEvent.emit("clickOpenRadiationPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "importance_order_list") {
          patientModalEvent.emit("clickOpenImportanceOrderListPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "period_order_list") {
          patientModalEvent.emit("clickOpenPeriodOrderListPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "pills") {
          patientModalEvent.emit("clickOpenPillsPopup", menu_item_info);
          event.stopPropagation();
        }
        if (url == "symptomDetail") {
          patientModalEvent.emit("clickOpenSymptomDetail", menu_item_info);
          event.stopPropagation();
        }

        //指導料マスタメンテナンス
        if (url == "guidance_fee_master") {
          patientModalEvent.emit("clickOpenGuidanceFeeMaster", menu_item_info);
          event.stopPropagation();
        }
        //入院申込オーダ
        if (url == "hospital_application_order") {
          patientModalEvent.emit("clickOpenHospitalApplicationOrder", menu_item_info);
          event.stopPropagation();
        }

        //入院決定オーダー----------------
        if (url == "hospital_dicision_order") {
          patientModalEvent.emit("clickOpenHospitalDecisionOrder", menu_item_info);
          event.stopPropagation();
        }

        //退院許可オーダー----------------
        if (url == "discharge_permit_order") {
          patientModalEvent.emit("clickOpenDischargePermitOrder", menu_item_info);
          event.stopPropagation();
        }

        //入院時現症----------------
        if (url == "hospital_disease") {
          patientModalEvent.emit("clickOpenHospitalDisease", menu_item_info);
          event.stopPropagation();
        }

        //服薬指導依頼----------------
        if (url == "medicine_guidance") {
          patientModalEvent.emit("clickOpenMedicineGuidance", menu_item_info);
          event.stopPropagation();
        }

        //栄養指導依頼----------------
        if (url == "nutrition_guidance") {
          patientModalEvent.emit("clickOpenNutritionGuidance", menu_item_info);
          event.stopPropagation();
        }

        //ＳＯＡＰ＆フォーカス----------------
        if (url == "soap_focus") {
          patientModalEvent.emit("clickOpenSoapFocus", menu_item_info);
          event.stopPropagation();
        }

        //看護師業務分担----------------
        if (url == "nurse_assignment") {
          patientModalEvent.emit("clickOpenNurseAssignment", menu_item_info);
          event.stopPropagation();
        }

        //一般細菌検査-------------------------------------------------
        if (url == "bacillus_inspection") {
          patientModalEvent.emit("clickBacillusInspection", menu_item_info);
          event.stopPropagation();
        }
        //持参薬報告-------------------------------------------------
        if (url == "potion_report") {
          patientModalEvent.emit("clickOpenPotionReportPopup", menu_item_info);
          event.stopPropagation();
        }
        //入院処方指示-------------------------------------------------
        if (url == "hospital_prescription") {
          patientModalEvent.emit("clickOpenHospitalPrescriptionPopup", menu_item_info);
          event.stopPropagation();
        }

        if (url == "pacs") {
          // patientModalEvent.emit("clickOpenPacsPopup", menu_item_info);
          // event.stopPropagation();

          let patientInfo = karteApi.getPatient(current_system_patient_id);
          if(patientInfo == undefined || patientInfo == null) return;

          // YJ34 PACS機能の修正
          patientApi.setVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS, JSON.stringify("on"));
          openPacs(patientInfo.receId, "open");

          /*let url =
            "http://TFS-C054/01Link/start.aspx?UserID=miyakojima&Password=miyakojima&ApplicationID=1600&RedirectURL=PatID%3d" +
            patientInfo.receId;
          var params = [
              'height='+screen.height,
              'width='+screen.width,
              'fullscreen=yes', // only works in IE, but here for completeness
              'resizable=yes'
            ].join(',');
            window.open(url, "OpenPACS", params);*/
        }
        return;
      }
      // 在宅処方、在宅注射の場合 karte status: 訪問診療
      if (url == "/home_prescription" || url == "/home_injection") {
        // 在宅処方
        if (url == "/home_prescription") url = "prescription";
        // 在宅注射
        if (url == "/home_injection") url = "injection";
        // check 訪問診療 config
        if (this.hasPermissionConfig("訪問診療") == true) {
          this.context.$updateKarteStatus(2, "訪問診療");
        } else {// no permission
          this.context.$updateKarteStatus(0, "外来");
        }
      }
      if (url == "/prescription" || url == "/injection") {
        this.context.$updateKarteStatus(0, "外来");
      }
      if (url == "/hospitalize_prescription" || url == "/hospitalize_injection" || url == "/hospitalize_soap") {
        if (url == "/hospitalize_prescription" || url == "/hospitalize_injection") {
          // check 入院 config
          if (this.hasPermissionConfig("入院") == true) {
            this.context.$updateKarteStatus(1, "入院");
          } else {// no permission
            this.context.$updateKarteStatus(0, "外来");
          }
        }
        if(url == "/hospitalize_soap") { // 初診・入院時ノート
          karteApi.setVal(current_system_patient_id, CACHE_LOCALNAMES.SOAP_CATEGORY, JSON.stringify("hospital_note"));
        }
        url = url == "/hospitalize_prescription" ? "prescription" : url == "/hospitalize_injection" ? "injection" : "soap";
      }
      // if no 初診・入院時ノート, set soapCategory=>"soap"
      if (url == "/soap"){
        karteApi.setVal(current_system_patient_id, CACHE_LOCALNAMES.SOAP_CATEGORY, JSON.stringify("soap"));
      }
      if (url == "/prescription" || url == "/injection" || url == "/soap" || url == "/inspection" || url == "/emergency_karte") {
        url = url.substring(1, url.length);
      }
      if(url == "/last_prescription_soap"){ //前回処方
        if(this.context.$getKarteMode(current_system_patient_id) == KARTEMODE.READ){
          return;
        }
        let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
        let karte_status_code = 1;
        if(menu_item_info.ele.id == 234){
          karte_status_code = 3;
        }
        if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
          let data = await apiClient.get("/app/api/v2/secure/doctor/search?");
          this.setState({
            doctors: data,
            cur_url:"/last_prescription_soap",
            isSelectDoctorModal:true,
            karte_status_code,
          });
          return;
        } else {
          url_path = "soap";
          let his = this.props.history;
          this.getLastPrescription(current_system_patient_id, this.context.department.code == 0 ? 1 : this.context.department.code, karte_status_code).then(function(value){
            if(value) {
              his.replace(url_path);
            }
          });
        }
      }
      if(url == "/medical_record_order"){ //診察済記録オーダ
        let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
        if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
          let data = sessApi.getDoctorList();
          if(data == null) {
            data = await apiClient.get("/app/api/v2/secure/doctor/search?");
          }
          this.setState({
            doctors: data,
            cur_url:"/medical_record_order",
            isSelectDoctorModal:true,
          });
          return;
        } else {
          this.createMedicalRecordOrder(current_system_patient_id);
          url = "soap";
        }
      }
      if(url == "/visit/schedule"){
        this.checkSetVisitTreatmentMode(current_system_patient_id);
      }
      this.props.history.replace(url);
    }
  }

  getNavigationMenuInfoById = (id) => {
    if (id == undefined || id == null) return;
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if (initState == undefined || initState == null) return;
    let navigation_menu = initState.navigation_menu;
    if (navigation_menu == undefined || navigation_menu == null) return;
    let result = null;
    navigation_menu.map(item=>{
      if (item.id == id) {
        result = item;
      }
    });
    return result;
  }

  onFavouriteUrl = (url, id) => {
    if(this.enableHaruka() == "dialysis"){
      let confirm_message = "";
      let confirm_type = "";

      var dial_change_flag = sessApi.getObjectValue('dial_change_flag');
      if(this.change_dial_delete == null && dial_change_flag !== undefined && dial_change_flag != null){
        confirm_message = "登録していない内容があります。\n変更内容を破棄して移動しますか？";
        confirm_type = "change_dial_page";
      }
      if(confirm_message !== ""){
        this.setState({
          confirm_message,
          confirm_type,
          go_func:"onFavouriteUrl",
          confirm_event:url+':'+id,
          confirm_alert_title:'入力中'
        });
        return;
      } else {
        this.change_dial_delete = null;
      }
    } else { // haruka
      var path = window.location.href.split("/");

      if (path[path.length - 1] == "prescription" || path[path.length - 1] == "injection") {
        if (!this.nextUrlCheckFromPrescription("sidebar", path[path.length - 1], null, id, null) == false) {
          return;
        }
      }
      if (path[path.length - 1] == "nursing_document") {
        if (!this.nextUrlCheckFromCache("sidebar", path[path.length - 1], null, id, null) == false) {
          return;
        }
      }
    }
    // 履歴メニュー操作
    let maxShows = this.context.linkHistoryMaxshows;
    let tmp = this.context.linkHistoryList.slice(0, maxShows);
    if (id != undefined && id != null && id != "") {
      id = parseInt(id);
    }
    if (!tmp.includes(id) && this.equalAliasName(id, tmp) == false) {
      if (tmp.length >= maxShows) {
        tmp.pop();
      }
      tmp.splice(0, 0, id);
    } else if(tmp.includes(id) || this.equalAliasName(id, tmp) == true) {
      tmp.splice(tmp.indexOf(id), 1);
      tmp.splice(0, 0, id);
    }
    this.context.$updateLinkHistoryList(tmp);

    // 透析患者マスタ[新規/検索]
    if (url == "/dial/dial_new_patient") {
      let patient_obj = sessApi.getObjectValue("dial_setting", "patient");
      if (patient_obj != null && patient_obj != undefined) {
        let curPatientId = "ID：" + patient_obj.patient_number;
        let curPatientName = "患者氏名：" + patient_obj.patient_name;
        this.setState({
          isOpenDialNewPatient: true,
          new_patient_message:"現在選択中の患者様情報を解除して良いですか？"+"\n" + curPatientId + "\n" + curPatientName
        });
        return;
      }
      sessApi.setObjectValue("dial_setting", "patient", null);
      sessApi.setObjectValue("dial_setting", "patientById", null);
    }

    //check pac on
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    let pac_status = patientApi.getVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);

    if (pac_status != undefined && pac_status != null && pac_status == "on") {
      openPacs(current_system_patient_id, "close");
      patientApi.delVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);
    }

    this.setState({isOpenModal: false});
    this.props.history.replace(url);
  }

  onCloseModal = () => {
    this.change_dial_delete = null;
    this.context.$selectMenuModal(false);
    this.setState({isOpenModal: false,isOpenPaitientListModal:false});
  }

  onCloseSeatModal = () => {
    this.setState({isSeatModal: false});
  }

  closeModal = () => {
    this.setState({
      isScannerBatchTakeDocPopupOpen: false,
      isHospitalPlanListPopupOpen: false,
      isSummaryListPopupOpen: false,
      isDocumentReferencePopupOpen: false,
      isDocumentCreatePopupOpen: false,
      isRadiationReservationListPopupOpen: false,
      isChemicalInformationSearchPopupOpen: false,
      isNutritionGuidanceSlipTotalPopupOpen: false,
      isInspectionReservationListPopupOpen: false,
      isEndoscopeReservationListPopupOpen: false,
      isWardLabelPopupOpen: false,
      isInspectionStatusListPopupOpen: false,
      isEndoscopeStatusListPopupOpen: false,
      isRadiationStatusListPopupOpen: false,
      isInspectionDepartmentResultPopupOpen: false,
      isEndoscopeDepartmentResultPopupOpen: false,
      isRadiationDepartmentResultPopupOpen: false,
      isOutExamCooperationRequestOutputPopupOpen: false,
      isEmergencyReceptionPopupOpen: false,
      isReportCreatListPopupOpen: false,
      isAdminDiaryPopupOpen: false,
      isAdministrationDiaryPopupOpen: false,
      isHospitalizedSettingPopupOpen: false,
      isInpatientContactListPopupOpen: false,
      isPatientsSchedulePopupOpen: false,
      isMovePlanPatientListPopupOpen: false,
      isHospitalPatientBarcodePrintPopupOpen: false,
      isPatientCertificationPopupOpen: false,
      isNurseSummaryListPopupOpen: false,
      isVisitNurseSummaryListPopupOpen:false,
      isNurseAssignmentPopupOpen: false,
      isOutInjectionPatientListPopupOpen: false,
      isMedicationGuidanceSchedulePopupOpen: false,
      isSimpleOrderPopupOpen: false,
      isOpenPatientKarteModal: false,
      isProgressChartPopup: false,
      isNursePlanPopup: false,
      isNurseProfilePopup: false,
      isInchargeSheetPopup: false,
      isNursePlanReferencePopup: false,
      isIndividualWorkSheetPopup: false,
      isNurseInstructionPopup: false,
      isHospitalInstructionPopup: false,
      report_creat_list_type:"",
    })
  };

  onFontList = (e) => {
    // eslint-disable-next-line consistent-this
    const that = this;
    e.preventDefault();
    let nY = $(".font-setting-area")[0].offsetTop + window.pageYOffset + $(".font-setting-area")[0].offsetHeight;
    this.setState({
      isOpenModal: false,
      fontList: {
        visible: true,
        x: 0,
        y: nY,
        font_size:this.state.font_size
      },
      viewList:{visible:false}
    });
    document.addEventListener(`click`, function onClickOutside(e) {
      var obj = e.target;
      do {
        if( obj.id == "view-font-menu") return;
        obj = obj.parentElement;
      } while(obj.tagName.toLowerCase() !== "body");

      that.setState({ fontList: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
  };

  onViewList = (e) => {
    // eslint-disable-next-line consistent-this
    const that = this;
    e.preventDefault();
    // HARUKA
    let nY = $(".menu-button")[0].offsetTop + window.pageYOffset + $(".menu-button")[0].offsetHeight;
    if (this.context.currentSystem == "dialysis") {
      // 透析
      nY = $(".menu-dial-button")[0].offsetTop + window.pageYOffset + $(".menu-dial-button")[0].offsetHeight;
    }
    this.setState({
      isOpenModal: false,
      viewList: {
        visible: true,
        x: 0,
        y: nY
      },
      fontList:{visible:false}
    });

    document.addEventListener(`click`, function onClickOutside(e) {
      var obj = e.target;
      do {
        if( obj.id == "view-select-menu") return;
        obj = obj.parentElement;
      } while(obj.tagName.toLowerCase() !== "body");

      that.setState({ viewList: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
  }

  onViewAction = () => {
    if (this.context.currentSystem == "haruka") {
      var path = window.location.href.split("/");

      if (path[path.length - 1] == "prescription" || path[path.length - 1] == "injection") {
        if (this.nextUrlCheckFromPrescription("view_action", path[path.length - 1], null, null, null) == false) {
          this.harukaViewAction();
        }
      } else if (path[path.length - 1] == "nursing_document") {
        if (this.nextUrlCheckFromCache("view_action", path[path.length - 1], null, null, null) == false) {
          this.harukaViewAction();
        }
      } else {
        this.harukaViewAction();
      }
    } else {

      // ■YJ34 PACS機能の修正
      // (B) 閉じるための機能が動作していない
      // ・右サイドバーのメニューなどから、カルテ内用でないページに移動したとき。
  
      let current_system_patient_id = localApi.getValue("current_system_patient_id");
      current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
      //check pac on
      let pac_status = patientApi.getVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);

      if (pac_status != undefined && pac_status != null && pac_status == "on") {
        openPacs(current_system_patient_id, "close");
        patientApi.delVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);
      }

      if (this.state.currentViewName == "受付一覧") {
        this.props.history.replace("/patients");
      } else if(this.state.currentViewName == "カナ検索") {
        this.props.history.replace("/patients_search");
      } else if(this.state.currentViewName == "病棟一覧") {
        this.props.history.replace("/hospital_ward_list");
      } else if(this.state.currentViewName == "救急一覧") {
        this.props.history.replace("/emergency_patients");
      } else if(this.state.currentViewName == "予約一覧") {
        this.props.history.replace("/reservation_list");
      } else if(this.state.currentViewName == "診察振り分け") {
        this.props.history.replace("/treatment_sorting");
      } else if(this.state.currentViewName == "病棟マップ") {
        this.props.history.replace("/hospital_ward_map");
      } else if(this.state.currentViewName === "訪問診療予定") {
        this.props.history.replace("/visit_schedule_list");
      }
    }
  }

  harukaViewAction = () => {

    // ■YJ34 PACS機能の修正
    // (B) 閉じるための機能が動作していない
    // ・右サイドバーのメニューなどから、カルテ内用でないページに移動したとき。
  
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    //check pac on
    let pac_status = patientApi.getVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);

    if (pac_status != undefined && pac_status != null && pac_status == "on") {
      openPacs(current_system_patient_id, "close");
      patientApi.delVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);
    }

    let cur_page = "";
    let path = window.location.href.split("/");
    cur_page = path[path.length - 1];
    if (this.state.currentViewName == "受付一覧") {
      if(cur_page != "patients"){
        this.props.history.replace("/patients");
      }
    } else if(this.state.currentViewName == "カナ検索") {
      if(cur_page != "patients_search"){
        this.props.history.replace("/patients_search");
      }
    } else if(this.state.currentViewName == "病棟一覧") {
      if(cur_page != "hospital_ward_list"){
        this.props.history.replace("/hospital_ward_list");
      }
    } else if(this.state.currentViewName == "救急一覧") {
      if(cur_page != "emergency_patients"){
        this.props.history.replace("/emergency_patients");
      }
    } else if(this.state.currentViewName == "予約一覧") {
      if(cur_page != "reservation_list"){
        this.props.history.replace("/reservation_list");
      }
    } else if(this.state.currentViewName == "診察振り分け") {
      if(cur_page != "treatment_sorting"){
        this.props.history.replace("/treatment_sorting");
      }
    } else if(this.state.currentViewName == "病棟マップ") {
      if(cur_page != "hospital_ward_map"){
        this.props.history.replace("/hospital_ward_map");
      }
    } else if(this.state.currentViewName === "訪問診療予定") {
      if(cur_page != "visit_schedule_list"){
        this.props.history.replace("/visit_schedule_list");
      }
    }
  }

  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  }

  showModalByCategory = (url = "") => {
    this.modal_show_flag = 0;
    let modal_url = url;
    if (modal_url == "") {
      modal_url = this.state.modal_url;
    }
    if(modal_url == 'visit_treatment_group'){
      localApi.setValue("visit_treatment_group_open", 1);
      this.props.history.replace("/visit/schedule");
    }
    if(modal_url == 'visit_treatment_patient'){
      if (this.isPatientPage() == true){
        let current_system_patient_id = localApi.getValue("current_system_patient_id");
        current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
        this.checkSetVisitTreatmentMode(current_system_patient_id);
      }
      localApi.setValue("visit_treatment_patient_open", 1);
      this.props.history.replace("/visit/schedule");
    }
    if(modal_url == 'reservation_create'){
      localApi.setValue("reservation_create_modal_open", 1);
      this.props.history.replace("/reservation/schedule");
    }
    this.setState({isOpenModal: false});
  }

  selectDoctorFromModal = (id, name) => {
    let department_name = "その他";
    this.state.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    this.context.$updateDoctor(id, name, department_name);
    if(this.state.cur_url === '/last_prescription_soap'){ //前回処方
      let current_system_patient_id = localApi.getValue("current_system_patient_id");
      current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
      let systemPatientId = current_system_patient_id;
      let url_path = 'soap';
      let his = this.props.history;
      this.setState({
        isSelectDoctorModal: false,
        cur_url:'',
      });
      this.getLastPrescription(systemPatientId, this.context.department.code == 0 ? 1 : this.context.department.code, this.state.karte_status_code).then(function(value){
        if(value) {
          his.replace(`/patients/${systemPatientId}/${url_path}`);
        }
      });
      return;
    }
    if(this.state.cur_url === '/medical_record_order'){ //診察済記録オーダ
      let url_path = 'soap';
      this.setState({
        isSelectDoctorModal: false,
        cur_url:'',
      });
      let current_system_patient_id = localApi.getValue("current_system_patient_id");
      let systemPatientId = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
      this.createMedicalRecordOrder(systemPatientId, id, name);
      this.props.history.replace(`/patients/${systemPatientId}/${url_path}`);
      return;
    }
    this.context.$selectDoctor(false);
    if (this.modal_show_flag == 0) return;
    if(this.state.isOpenModal){
      this.setState({
        isOpenModal: false
      },()=>{
        this.showModalByCategory();
      });
    } else {
      this.showModalByCategory();
    }
  }

  closeDoctor = () => {
    this.modal_show_flag = 0;
    this.context.$selectDoctor(false);
    this.setState({
      canEdit: this.state.staff_category === 1,
      isCopyOrder: false,
      isEditOrder: false,
      tempItems: []
    });
  }

  getDialDoctor = (doctor) => {
    let department_name = "その他";
    this.context.$updateDoctor(doctor.number, doctor.name, department_name);
    this.closeDoctorSelectModal();
  }

  closeDoctorSelectModal = () => {
    this.setState({
      needDialSelectDoctor:false,
    });
  }

  onSeat = () => {
    sessApi.setValue(CACHE_SESSIONNAMES.LOCK_SCREEN, true);
    this.setState({isSeatModal: true});
  }

  getInputSerialNumber = (_type=null, _patientId=null) => {
    let result = null;
    if (_type == null) return result;
    if (_patientId == null || _patientId == 0 || _patientId == "") return result;

    if (_type == "prescription") {
      let cacheState = karteApi.getVal(parseInt(_patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT);       
      if (cacheState != undefined && cacheState != null && Object.keys(cacheState).length > 0) {
        Object.keys(cacheState).map(key=>{
          let cache_data = cacheState[key][0];
          if (cache_data != undefined && 
            cache_data != null && 
            cache_data.temp_saved != undefined && 
            cache_data.temp_saved != null && 
            cache_data.temp_saved == 0) {
            result = key;
          }
        });      
      }
    } else if(_type == "injection") {
      let cacheInjectionState = karteApi.getVal(parseInt(_patientId), CACHE_LOCALNAMES.INJECTION_EDIT);
      if (cacheInjectionState != undefined && cacheInjectionState != null && Object.keys(cacheInjectionState).length > 0) {
        Object.keys(cacheInjectionState).map(key=>{
          let cache_data = cacheInjectionState[key][0];
          if (cache_data != undefined && 
            cache_data != null && 
            cache_data.temp_saved != undefined && 
            cache_data.temp_saved != null && 
            cache_data.temp_saved == 0) {
            result = key;
          }
        });      
      }
    }

    return result;
  }

  onTemporaryLogin = () => {
    if(this.isTemporaryUser()){
      return;
    }
    // 1.local temporary user register
    let userInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    userInfo = {
      name: userInfo.name,
      user_number: userInfo.user_number,
      statusTemporary: 0
    }

    // ■YJ787 切替機能の調整
    if (this.isEqualPage("prescription") != "") {
      let current_system_patient_id = localApi.getValue("current_system_patient_id");
      let currentPatient = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
      userInfo.page = this.isEqualPage("prescription");
      // set patient id
      userInfo.patientNumber = currentPatient;
      // set prescription cache number
      let input_serial_number = null;    
      input_serial_number = this.getInputSerialNumber("prescription", currentPatient);
      if (input_serial_number != null) {
        userInfo.cacheSerialNumber = input_serial_number;
        // set active serial key      
        // karteApi.setSubVal(this.props.match.params.id, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription", input_serial_number);
        // this.goToDropPage(`/patients/${this.props.match.params.id}/prescription`);
        // return;
      }
    } else if(this.isEqualPage("soap") != "") {
      let current_system_patient_id = localApi.getValue("current_system_patient_id");
      let currentPatient = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;      
      userInfo.page = this.isEqualPage("soap");
      userInfo.patientNumber = currentPatient;
    }    

    localApi.setValue(CACHE_LOCALNAMES.TEMPORARYUSER, JSON.stringify(userInfo));

    // ●YJ777 MySQLに保存するほうの操作ログの改善
    // ・切替モードに変更する仮ログアウト動作は区別して記録する (・op_screen=一時利用、op_type=一時ログアウト)

    // 2.logout
    this.context.$resetState(0, "");
    this.exitFullscreen();
    auth.signOut("temporary_login", null, "temp_logOut");
    this.props.history.replace("/");
  }

  getDoctorsList = async () => {
    let data = sessApi.getDoctorList();
    if(data == null) {
      data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    }
    // let data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    this.setState({ doctors: data }, ()=>{
      this.context.$selectDoctor(true);
    });
  };

  getDialDoctorsList = async () => {
    let data = await apiClient.get("/app/api/v2/secure/dial_doctor/search?order=name_kana");
    this.setState({ doctors: data, needDialSelectDoctor: true });
  };

  onGlobalClick = () => {
    this.setState({isOpenModal: false});
  }

  updateFavouriteList = (id, type) => {
    // let tmp = this.state.favouriteList;
    let tmp = this.context.bookmarksList;
    if (type=="delete"){
      const index = tmp.indexOf(id);
      tmp.splice(index, 1);
    } else {
      tmp.push(id);
    }

    // this.setState({
    //   favouriteList: tmp
    // });
    this.context.$updateBookmarksList(tmp);

    // お気に入りメニューDB操作
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let postData = {
      number: authInfo.user_number,
      bookmarks_json: JSON.stringify(tmp),
      type: this.context.currentSystem
    };
    axios.post("/app/api/v2/user/bookmarks/set", {params:postData});
  }

  handleClick = (e, menuId) => {
    if (e.type === "contextmenu") {
      let currentSystem = this.context.currentSystem;
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        if (currentSystem == "dialysis") {
          that.setState({ contextDialMenu: { visible: false } });
        } else {
          that.setState({ contextMenu: { visible: false } });
        }
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        if (currentSystem == "dialysis") {
          that.setState({
            contextDialMenu: { visible: false }
          });
        } else {
          that.setState({
            contextMenu: { visible: false }
          });
        }
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      if (currentSystem == "dialysis") {
        this.setState({
          contextDialMenu: {
            visible: true,
            x: e.clientX - 110,
            y: e.clientY + window.pageYOffset
          },
          favouriteMenuId: menuId
        });
      } else {
        this.setState({
          contextMenu: {
            visible: true,
            x: e.clientX - 110,
            y: e.clientY + window.pageYOffset
          },
          favouriteMenuId: menuId
        });
      }
    }
  }

  handleUserClick = (e) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextUserMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextUserMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      if(this.context.$canDoAction(this.context.FEATURES.PERSONAL, this.context.AUTHS.EDIT)) {
        this.setState({
          contextUserMenu: {
            visible: true,
            x: e.clientX,
            y: e.clientY + window.pageYOffset
          },

        });
      }
    }
  }

  handleLinkHistoryClick = (e, menuId) => {
    if ((e.target.tagName == "SPAN" && menuId == undefined) || (e.target.tagName == "IMG" && menuId == undefined) || (e.target.tagName == "svg" && menuId == undefined)) {
      return;
    }
    // if menuId = -1: favourite & history area's right click
    if (e.type === "contextmenu") {
      e.preventDefault();
      let currentSystem = this.context.currentSystem;
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        if (currentSystem == "dialysis") {
          that.setState({ contextDialMenu: { visible: false } });
        } else {
          that.setState({ contextMenu: { visible: false } });
        }
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        if (currentSystem == "dialysis") {
          that.setState({
            contextDialMenu: { visible: false }
          });
        } else {
          that.setState({
            contextMenu: { visible: false }
          });
        }
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      if (currentSystem == "dialysis") {
        this.setState({
          contextDialMenu: {
            visible: true,
            x: e.clientX - 110,
            y: e.clientY + window.pageYOffset
          },
          favouriteMenuId: menuId == undefined ? -1: menuId
        });
      } else {
        this.setState({
          contextMenu: {
            visible: true,
            x: e.clientX - 110,
            y: e.clientY + window.pageYOffset
          },
          favouriteMenuId: menuId == undefined ? -1: menuId
        });
      }
    }
  }

  handleLinkHistoryTabClick = (e, menuId) => {
    // if menuId = -1: favourite & history area's right click
    if (e.type === "contextmenu") {
      e.preventDefault();
      let currentSystem = this.context.currentSystem;
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        if (currentSystem == "dialysis") {
          that.setState({ contextDialMenu: { visible: false } });
        } else {
          that.setState({ contextMenu: { visible: false } });
        }
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        if (currentSystem == "dialysis") {
          that.setState({
            contextDialMenu: { visible: false }
          });
        } else {
          that.setState({
            contextMenu: { visible: false }
          });
        }
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      if (currentSystem == "dialysis") {
        this.setState({
          contextDialMenu: {
            visible: true,
            x: e.clientX - 110,
            y: e.clientY + window.pageYOffset
          },
          favouriteMenuId: menuId == undefined ? -1: menuId
        });
      } else {
        this.setState({
          contextMenu: {
            visible: true,
            x: e.clientX - 110,
            y: e.clientY + window.pageYOffset
          },
          favouriteMenuId: menuId == undefined ? -1: menuId
        });
      }
    }
  }

  handleInspectionClick = (e, menuObj) => {
    if (!(menuObj.iconLabel === "生理検査" || menuObj.iconLabel === "放射線" || menuObj.iconLabel === "患者情報")) return;
    if (e.type === "click") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextKarteMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextKarteMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      let contextMenuItems = [];
      let contextMenuType = "";
      if (menuObj.iconLabel === "生理検査") {
        contextMenuItems = [
          {id: 149, value: "心電図"},
          {id: 150, value: "負荷心電図"},
          {id: 151, value: "ABI"},
          {id: 152, value: "脳波"},
          {id: 153, value: "腹部エコー"},
          {id: 154, value: "心臓エコー"},
          {id: 155, value: "肺機能検査"},
          {id: 156, value: "PSG"},
          {id: 157, value: "ホルター心電図"},
          {id: 158, value: "聴力"},
          {id: 159, value: "24時間血圧"},
          {id: 160, value: "頸動脈エコー"},
          {id: 161, value: "下肢血管エコー"},
          {id: 162, value: "表在エコー"},
          {id: 163, value: "乳腺エコー"},
          {id: 164, value: "健診エコー"},
          {id: 192, value: "眼底検査"},
          {id: 193, value: "甲状腺エコー"},
        ];
        contextMenuType = "physiological";
      } else if (menuObj.iconLabel === "放射線") {
        contextMenuItems = [
          {id: 249, value: "X線"},
          {id: 250, value: "透視造影TV"},
          {id: 251, value: "CT"},
          {id: 252, value: "MRI"},
          {id: 280, value: "他医撮影診断"},
        ];
        contextMenuType = "radiation";
      } else if (menuObj.iconLabel === "患者情報") {
        contextMenuItems = [
          {id: "patient_info", value: "患者詳細"},
          {id: 217, value: "既往歴・アレルギー"},
          {id: 281, value: "食物アレルギー"},
          {id: 282, value: "薬剤アレルギー"},
          {id: 283, value: "障害情報"},
          {id: 284, value: "患者ワクチン情報"},
          {id: 285, value: "ADL情報"},
          {id: 286, value: "感染症"},
          {id: 287, value: "一般アレルギー"},
        ];
        contextMenuType = "ellergy";
      }
      this.setState({
        contextKarteMenu: {
          visible: true,
          x: e.clientX - 120,
          y: contextMenuType === "physiological" ? e.clientY - 250 : e.clientY - 150,
        },
        contextMenuItems,
      });
    }
  };

  handleFlavourHover = () => {
    this.setState({
      hoverMenu: {
        visible: false
      }
    });
  }

  showHoverMenu = (e, parent) => {
    e.preventDefault();
    const that = parent;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ hoverMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    document.addEventListener(`contextmenu`, function onClickOutside() {
      that.setState({ hoverMenu: { visible: false } });
      document.removeEventListener(`contextmenu`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        hoverMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    // let nX = $(".menu-design").offsetLeft;
    // let nY = $(".menu-design").offsetTop;
    // $(".menu-button")[0].offsetTop + window.pageYOffset
    if(this.state.hoverMenu != undefined && this.state.hoverMenu.visible == true) return;

    this.setState({
      hoverMenu: {
        visible: true,
        x: e.clientX,
        // x: 0,
        y: e.clientY + window.pageYOffset - 10,
        // y: 0,
      }
    });
  }

  contextMenuAction = (act, menuId) => {
    this.updateFavouriteList(act, menuId);
  };

  contextMenuHoverAction = (type="icon") => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let postData = {
      number: authInfo.user_number,
      type: type == "list" ? 1 : 0
    };
    axios.post("/app/api/v2/user/favourite_history_type/set", {params:postData});
    this.context.$updateFavouriteHistoryType(type);
    // this.setState({
    //   menuDesignType: type // icon : list
    // });
  }

  contextUserMenuAction = (act) => {
    let confirm_message = '';
    let confirm_type = '';
    if(act == "personal_setting") {
      let dial_change_flag = sessApi.getObjectValue('dial_change_flag');
      if(this.change_dial_delete == null && dial_change_flag !== undefined && dial_change_flag != null){
        confirm_message = "登録していない内容があります。\n変更内容を破棄して移動しますか？";
        confirm_type = "change_dial_page";
      }
      if(confirm_message !== ""){
        this.setState({
          confirm_message,
          confirm_type,
          go_func:"contextUserMenuAction",
          confirm_event:act,
          confirm_alert_title:'入力中'
        });
        return;
      } else {
        this.change_dial_delete = null;
      }
      if(this.context.$canDoAction(this.context.FEATURES.PERSONAL, this.context.AUTHS.EDIT)) {
        this.setState({isOpenModal:false});
        this.props.history.replace("/mypage/config");
      }
    }
  };

  contextKarteMenuAction = (id) => {
    if (id === "patient_info") {
      patientModalEvent.emit("clickOpenDetailedPatientPopup", "1");
    }
    this.onGotoUrlFromSidebar(id);
  };

  selectFavouriteTab = (strTab) => {
    /*if(this.enableHaruka() == "haruka"){
      // check has current inputing prescription or injection data
      var path = window.location.href.split("/");

      if (path[path.length - 1] == "prescription" || path[path.length - 1] == "injection") {

        if (this.nextUrlCheckFromPrescription(null, path[path.length - 1], null, null, null) == true) {
          return;
        }
      }
    }*/

    if (strTab != "") {
      this.setState({
        rightSideTab: strTab
      });
    }
    // if (strTab === "favourite") { // お気に入り
    // this.setState({
    //   activeFavourite: "favourite"
    // });
    // this.context.$updateRightSideTab("favourite");
    // } else if(strTab === "history") { // 履歴
    // this.setState({
    //   activeFavourite: "history"
    // });
    // this.context.$updateRightSideTab("history");
    // }
    // else if(strTab === "karte") {
    //   // this.setState({
    //   //   activeFavourite: "karte"
    //   // });
    //   this.context.$updateRightSideTab("karte");
    // }
  }

  isTemporaryUser = () => {
    let userInfo = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.TEMPORARYUSER));
    let curUserInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    // if (userInfo !== null && userInfo !== undefined) {
    //   if (curUserInfo !== null && curUserInfo !== undefined) {
    //     if (userInfo.user_number === curUserInfo.user_number) {
    //       localApi.remove(CACHE_LOCALNAMES.TEMPORARYUSER);
    //     }
    //   }
    // }
    // userInfo = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.TEMPORARYUSER));
    // curUserInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    if (userInfo !== null && userInfo !== undefined && userInfo.statusTemporary == 1) {
      return true;
    }
    if (userInfo !== null && userInfo !== undefined && userInfo.statusTemporary == 0) {
      if (curUserInfo !== null && curUserInfo !== undefined && curUserInfo.user_number !== userInfo.user_number) {
        userInfo.statusTemporary = 1;
        localApi.setValue(CACHE_LOCALNAMES.TEMPORARYUSER, JSON.stringify(userInfo));
        return true;
      }
    }
    return false;
  }

  enableHaruka = () => {
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if (initState == null || initState == undefined) {
      return "haruka";
    }
    if(initState.enable_ordering_karte == 1) return "haruka";
    if(initState.enable_dialysis == 1) return "dialysis";
    return "haruka";
    // if (initStatus == null || initStatus == undefined) {
    //   return "haruka";
    // }
    // if (type == "haruka") {
    //   if (((initStatus.enable_ordering_karte != null && initStatus.enable_ordering_karte != undefined && initStatus.enable_ordering_karte === "1") || (initStatus.enable_ordering_karte != null && initStatus.enable_ordering_karte !== undefined && initStatus.enable_ordering_karte !== "1" && initStatus.enable_dialysis != null && initStatus.enable_dialysis !== undefined && initStatus.enable_dialysis !== "1"))) {
    //     return "haruka";
    //   }
    //   status = false;
    // } else if (type == "dialysis") {
    //   if(initStatus.enable_dialysis != null && initStatus.enable_dialysis != undefined && initStatus.enable_dialysis === "1" && initStatus.enable_ordering_karte != null && initStatus.enable_ordering_karte !== undefined && initStatus.enable_ordering_karte !== "1") {
    //     return "dialysis";
    //   }
    //   status = false;
    // }
    // if (status == false) {
    //   return "haruka";
    // }
  }

  // 患者情報表示 (HARUKA 右側のメニューに患者名 click)
  selectPatient = (patient_id) => {
    if (this.context.currentSystem == "haruka") {
      var path = window.location.href.split("/");
      if (path[path.length - 1] == "prescription" || path[path.length - 1] == "injection") {
        if (this.nextUrlCheckFromPrescription("select_patient", path[path.length - 1], null, null, null, patient_id) == false) {
          this.harukaSelectPatient(patient_id);
        }
      } else if (path[path.length - 1] == "nursing_document") {
        if (this.nextUrlCheckFromCache("select_patient", path[path.length - 1], null, null, null, patient_id) == false) {
          this.harukaSelectPatient(patient_id);
        }
      } else {
        this.harukaSelectPatient(patient_id);
      }
    } else {
      this.harukaSelectPatient(patient_id);
    }
  }

  harukaSelectPatient = (patient_id) => {
    // initialize menu item info if current page is not patient page
    if (this.isPatientPage() == false) {
      let url_path = window.location.href.split("#");
      localApi.setValue("system_before_page", url_path[1]);
    }
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    if (current_system_patient_id != patient_id) {
      localApi.setValue("current_system_patient_id", patient_id);
      // YJ100 右サイドバーの患者一覧で患者を切り替えたときに、入外区分や診療科が引き継がれてしまう不具合
      let patient_data = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
      if (patient_data != undefined && patient_data != null) {
        if (patient_data.karte_status != undefined && patient_data.karte_status != null) {
          this.context.$updateKarteStatus(patient_data.karte_status.code, patient_data.karte_status.name, patient_id);
        }
        if (patient_data.department != undefined && patient_data.department != null) {
          this.context.$updateDepartment(patient_data.department.code, patient_data.department.name, patient_id);
        }
      }
      // this.context.$updateKarteStatus();

      //check pac on
      let pac_status = patientApi.getVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);

      // if (this.props.pacsOn) {
      if (pac_status != undefined && pac_status != null && pac_status == "on") {
        openPacs(current_system_patient_id, "close");
        patientApi.delVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);
      }
    }

    // go url
    // handleDocumentHref("patients/"+patient_id+"/soap");
    this.props.history.replace(`/patients/${patient_id}/soap`);
  }

  // 透析 (右側のメニューに患者名 click)
  selectDialEditingPatient = async (e, patient_id) => {
    if (canShowKarteStatus(window.location.href)) { // Karte page
      this.props.history.replace(`/patients/${patient_id}/soap`);
    } else { // no Karte page
      localApi.setValue("current_system_patient_id", patient_id);
    }
  }

  enableTerminal = () => {
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if (initState == null || initState == undefined) return false;
    if(initState.enable_dialysis == 1 && initState.terminal_info != undefined &&
      initState.terminal_info != null && initState.terminal_info.start_page != undefined && (initState.terminal_info.start_page == "ベッドサイド" || initState.terminal_info.start_page == "予約一覧")) return true;
  };

  gotoBed = () => {
    var confirm_message = '';
    var confirm_type = '';
    var dial_change_flag = sessApi.getObjectValue('dial_change_flag');
    if(this.change_dial_delete == null && dial_change_flag !== undefined && dial_change_flag != null){
      confirm_message = "登録していない内容があります。\n変更内容を破棄して移動しますか？";
      confirm_type = "change_dial_page";
    }
    if(confirm_message !== ""){
      this.setState({
        confirm_message,
        confirm_type,
        go_func:"gotoBed",
        confirm_alert_title:'入力中'
      });
      return;
    } else {
      this.change_dial_delete = null;
    }
    window.sessionStorage.removeItem("dial_setting");
    window.sessionStorage.removeItem("from_print");
    window.sessionStorage.removeItem("form_bed_table");
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if(initState.enable_dialysis == 1 && initState.terminal_info != undefined &&
      initState.terminal_info != null && initState.terminal_info.start_page != undefined){
      if (initState.terminal_info.start_page === "ベッドサイド"){
        sessApi.setValue("from_terminal", 1);
        setTimeout(()=>{
          this.props.history.replace("/dial/board/system_setting");
        }, 100);
      } else if(initState.terminal_info.start_page === "予約一覧") {
        this.props.history.replace("/dial/weight/patientList");
      }
      else {
        this.props.history.replace("/top");
      }
    }
  };

  onFavouriteDropEvent = (e, obj) => {
    this.drop_flag = 1;
    // obj: undefined if favourite tab's onDrop
    let item = e.dataTransfer.getData("text");
    if (item == "") return;

    const favouriteListArray = this.context.bookmarksList;

    let from_id = 0;
    if (item != "") from_id = parseInt(item);
    if (from_id == 0) return;

    let to_id = obj.id;
    if (from_id == to_id) return;

    // remove selected id
    let from_id_pos = favouriteListArray.indexOf(from_id);
    if (from_id_pos > -1) {
      favouriteListArray.splice(from_id_pos, 1);
    }

    if (favouriteListArray.includes(from_id) || this.equalAliasName(from_id, favouriteListArray) == true) return;


    // add selected id to drop index of favourite array
    let to_id_pos = favouriteListArray.indexOf(to_id);
    if (to_id_pos > -1) {
      let insert_pos = to_id_pos;
      if (from_id_pos <= to_id_pos) insert_pos = to_id_pos + 1;
      favouriteListArray.splice(insert_pos, 0, from_id);
    }

    // DB operation
    this.context.$updateBookmarksList(favouriteListArray);

    // お気に入りメニューDB操作
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let postData = {
      number: authInfo.user_number,
      bookmarks_json: JSON.stringify(favouriteListArray),
      type: this.context.currentSystem
    };
    axios.post("/app/api/v2/user/bookmarks/set", {params:postData});
  }

  onFavouriteDragStart = (e, item) => {
    e.dataTransfer.setData("text", item.id.toString());
    e.stopPropagation();
  };

  onDragOver = e => {
    e.preventDefault();
  };

  // check click menu item by id with karte page connect permission
  canOperateKarteMenuById = (menu_id) => {
    if (menu_id == undefined || menu_id == null || menu_id == "") return;
    let result = 0;    
    let _flag = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data");
    let menu_item = this.getNavigationMenuInfoById(menu_id);
    if (menu_item == undefined || menu_item == null) return;
    let patientPage = this.isPatientPage(menu_item.tab_id);
    if (_flag != null && _flag != undefined && _flag.patient_menu_enable_in_not_patient_page == "OFF"
      && menu_item.enabled_in_patient_page == 1 && menu_item.enabled_in_default_page == 0 && patientPage != true) {
      result = 1;
    }
    // ■1231-18 入外区分によって機能が使えるかどうかを設定できるように(1)
    let karte_status = this.context.karte_status.code;
    // 0:外来 1:入院 2:訪問
    // if (out_patient_ids.includes(ele.id) || hospitalize_patient_ids.includes(ele.id) || home_patient_ids.includes(ele.id)) {
    if (menu_item.enabled_in_default_page == 0 && menu_item.enabled_in_patient_page == 1 && patientPage) {
      if (karte_status == 0 && menu_item.is_available_in_outpatient_karte != 1) {
        result = 1;
      }
      if (karte_status == 1 && menu_item.is_available_in_hospitalization_karte != 1) {
        result = 1;
      }
      if (karte_status == 2 && menu_item.is_available_in_visiting_karte != 1) {
        result = 1;
      }
    }
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    // YJ316 「カルテ記載を行う」がオンの機能が、お気に入りや履歴ではグレーアウトしない不具合 (525-1)
    if (patientPage && current_system_patient_id > 0 && this.context.$getKarteMode(current_system_patient_id) == KARTEMODE.READ && menu_item.enabled_karte == 1) {
      result = 1;
    }
    return result; // result =1 : no permission
  }

  onFavouriteTabDropEvent = (e) => {
    if (this.drop_flag == 1) {
      this.drop_flag = 0;
      return;
    }
    let item = e.dataTransfer.getData("text");
    if (item == "") return;
    const favouriteListArray = this.context.bookmarksList;
    let item_id = parseInt(item);
    if (favouriteListArray.includes(item_id) || this.equalAliasName(item_id, favouriteListArray) == true) return;
    favouriteListArray.push(item_id);
    // DB operation
    this.context.$updateBookmarksList(favouriteListArray);
    // お気に入りメニューDB操作
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let postData = {
      number: authInfo.user_number,
      bookmarks_json: JSON.stringify(favouriteListArray),
      type: this.context.currentSystem
    };
    axios.post("/app/api/v2/user/bookmarks/set", {params:postData});
  }

  // お気に入り、履歴 click
  clickMenuItem = (item) => {
    if (item.id == 238) window.sessionStorage.setItem('completed_injection', 1);//実施済み注射
    let menu_item = this.getNavigationMenuInfoById(item.id);
    if (item != null && item != undefined && item.id > 0
      && menu_item != null && menu_item.enabled_in_default_page != null && menu_item.enabled_in_default_page != undefined
      && menu_item.enabled_in_patient_page != null && menu_item.enabled_in_patient_page != undefined ) {
      if (menu_item.enabled_in_patient_page == 1 && menu_item.enabled_in_default_page == 0) {
        this.onGotoUrlFromSidebar(item.id);// Modal
      } else {
        if (menu_item.enabled_in_patient_page == 1 && menu_item.enabled_in_default_page == 1) {
          // if type == スケジュール登録(modal(no patientId)) // 4005, 4006
          // if (item.id == 4005 || item.id == 4006) {
          if (menu_item.is_modal == 1) {
            this.onGotoUrlFromSidebar(item.id);
          } else {
            // Link page
            if (item.url != "") {
              this.onFavouriteUrl(item.url, item.id);
            }
          }
        }
      }
    }
  }

  getFontSize = (size) => {
    var font_prop = 1;
    switch(size){
      case 13:
        font_prop = 0.7;
        break;
      case 18:
        font_prop = 1;
        break;
      case 27:
        font_prop = 1.2;
        break;
    }    
    this.context.$updateFontProp(font_prop);
    this.setState({font_size:size});    
  }

  zoomPlusFont = () => {
    var fontsize = window.getComputedStyle(this.html_obj, null).getPropertyValue('font-size');
    fontsize = parseFloat(fontsize);
    if (fontsize < this. max_fontsize){
      fontsize = fontsize+0.5;
    }
    this.html_obj.style.fontSize = fontsize +'px';
  }

  zoomMinusFont = () => {
    var fontsize = window.getComputedStyle(this.html_obj, null).getPropertyValue('font-size');
    fontsize = parseFloat(fontsize);
    if (fontsize > this.min_fontsize){
      fontsize = fontsize - 0.5;
    }
    this.html_obj.style.fontSize = fontsize +'px';
  }

  zoomBack = () => {
    this.html_obj.style.fontSize = this.default_fontsize;
  }

  goKartePage = (patient_id) => {
    if (patient_id <= 0) return;
    this.setState({isOpenPatientKarteModal: false});
    this.props.history.replace(`/patients/${patient_id}/soap`);
  }

  goToPage = (url) => {
    this.setState({
      isOpenPatientKarteModal: false
    });
    this.props.history.replace(url);
  }

  confirmPrescriptionCancel = () => {
    if (this.state.canConfirm == 1) {
      let patientId = 0;
      let current_system_patient_id = localApi.getValue("current_system_patient_id");
      current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
      if (current_system_patient_id > 0) {
        patientId = current_system_patient_id;
      }
      if (patientId > 0) {
        if (this.state.cur_url == "prescription") {
          let active_key = karteApi.getSubVal(parseInt(patientId), CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
          karteApi.delSubVal(parseInt(patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);

          // init active_key
          karteApi.delSubVal(parseInt(patientId), CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
        } else {
          let active_key = karteApi.getSubVal(parseInt(patientId), CACHE_LOCALNAMES.ACTIVE_KEY, "injection");
          karteApi.delSubVal(parseInt(patientId), CACHE_LOCALNAMES.INJECTION_EDIT, active_key);

          // init active_key
          karteApi.delSubVal(parseInt(patientId), CACHE_LOCALNAMES.ACTIVE_KEY, "injection");
        }
      }

      if (this.state.prescription_from == "navigation") {
        // navigationMap
        this.harukaGoto(this.state.prescription_url, this.state.prescription_selected_id, this.state.prescription_menu_item);
      } else if(this.state.prescription_from == "sidebar") {
        // sidebar
        this.harukaGotoUrlFromSidebar(this.state.prescription_selected_id);

      } else if(this.state.prescription_from == "view_action") {
        this.harukaViewAction();
      } else if(this.state.prescription_from == "view_list_action") {
        this.harukaViewListAction(this.state.prescription_act);
      } else if(this.state.prescription_from == "select_patient") {
        this.harukaSelectPatient(this.state.prescription_patient_id);
      } else if(this.state.prescription_from == "home") {
        this.props.history.replace('/top');
      }
    }

    this.setState({
      prescription_confirm_message: "",
      prescription_selected_id: 0,
      okTitle: "",
      cancelTitle: ""
    });
  }

  confirmPrescriptionOk = () => {
    let patientId = 0;
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    if (current_system_patient_id > 0) {
      patientId = current_system_patient_id;
    }
    let active_key = karteApi.getSubVal(parseInt(patientId), CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
    if (this.state.cur_url == "injection") {
      active_key = karteApi.getSubVal(parseInt(patientId), CACHE_LOCALNAMES.ACTIVE_KEY, "injection");
    }
    if (this.state.canConfirm == 1) {
      // let storeData ={"is_reload_state": false,"temp_saved":1, "canConfirm":2};
      // this.storeDataInCache(storeData);
      if (patientId > 0) {

        let cache_prescription = karteApi.getSubVal(parseInt(patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);
        if (this.state.cur_url == "injection") cache_prescription = karteApi.getSubVal(parseInt(patientId), CACHE_LOCALNAMES.INJECTION_EDIT, active_key);
        let type = cache_prescription[0].isUpdate == 1 ? Karte_Types.Update : Karte_Types.Register;
        if (cache_prescription != undefined && cache_prescription != null && cache_prescription.length > 0) {

          // check error of prescription or injection data
          if (this.state.cur_url == "prescription" && this.checkPresDataFromPrescription(cache_prescription[0].presData, type) != true) {
            return;
          } else if(this.state.cur_url == "injection" && this.checkInjectDataFromInjection(cache_prescription[0].injectData, type) != true) {
            return;
          }

          cache_prescription[0].temp_saved = 1;
          cache_prescription[0].canConfirm = 2;
          let newStateStr = JSON.stringify(cache_prescription);
          if (this.state.cur_url == "prescription") {
            karteApi.setSubVal(parseInt(patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key, newStateStr, 'insert');
          } else {
            karteApi.setSubVal(parseInt(patientId), CACHE_LOCALNAMES.INJECTION_EDIT, active_key, newStateStr, 'insert');
          }
        }
      }
    } else {

      if (patientId > 0) {
        if (this.state.cur_url == "prescription") {
          karteApi.delSubVal(parseInt(patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);
        } else {
          karteApi.delSubVal(parseInt(patientId), CACHE_LOCALNAMES.INJECTION_EDIT, active_key);
        }
      }
    }

    // init active_key
    if (this.state.cur_url == "prescription") karteApi.delSubVal(parseInt(patientId), CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");
    else karteApi.delSubVal(parseInt(patientId), CACHE_LOCALNAMES.ACTIVE_KEY, "injection");

    if (this.state.prescription_from == "navigation") {
      // navigationMap
      this.harukaGoto(this.state.prescription_url, this.state.prescription_selected_id, this.state.prescription_menu_item);

    } else if(this.state.prescription_from == "sidebar") {

      // sidebar
      this.harukaGotoUrlFromSidebar(this.state.prescription_selected_id);

    } else if(this.state.prescription_from == "view_action") {
      this.harukaViewAction();
    } else if(this.state.prescription_from == "view_list_action") {
      this.harukaViewListAction(this.state.prescription_act);
    } else if(this.state.prescription_from == "select_patient") {
      this.harukaSelectPatient(this.state.prescription_patient_id);
    } else if(this.state.prescription_from == "home") {

      //check pac on
      let pac_status = patientApi.getVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);

      if (pac_status != undefined && pac_status != null && pac_status == "on") {
        openPacs(current_system_patient_id, "close");
        patientApi.delVal(current_system_patient_id, CACHE_LOCALNAMES.PAC_STATUS);
      }

      this.props.history.replace('/top');
    }
    this.setState({
      prescription_confirm_message: "",
      prescription_selected_id: 0,
      okTitle: "",
      cancelTitle: ""
    });
  }

  confirmCancel = () => {
    this.setState({
      confirm_message: "",
      confirm_alert_title:'',
      isOpenDialNewPatient: false,
      new_patient_message: "",
      cur_url: null,
      check_selected_id: null,
      check_url: null,
      check_menu_item: null,
      check_from: null,
      check_act: null,
      check_patient_id: null,
    });
    // if (this.state.go_func == 'handleDialysisTop')
    this.change_dial_delete = null;
  }

  confirmOk = () => {
    if(this.state.confirm_type === "log_out"){
      this.setState({
        confirm_message: ""
      }, ()=>{
        sessApi.remove('dial_change_flag');
        sessApi.remove('dial_patient_master_method');
        this.handleLogOut();
      });
    } else {
      if (this.state.confirm_type === "change_document_page") {
        localApi.remove("nursing_history");
      }
      this.setState({confirm_message: ""});
      this.confirmCancel();
      if (this.state.confirm_type =='change_dial_page'){
        this.change_dial_delete = 1;
        if (this.state.go_func != 'handleDialysisTop' && this.state.go_func != 'onOpenModal' && this.state.go_func !='openPaitientListModal') sessApi.remove('dial_change_flag');
      }
      
      if(this.state.go_func === "onOpenModal" || this.state.check_from === "onOpenModal"){
        this.onOpenModal(this.state.confirm_event);

      }
      if(this.state.go_func === "onFavouriteUrl"){
        this.onFavouriteUrl(this.state.confirm_event.split(':')[0], this.state.confirm_event.split(':')[1]);
      }

      if (this.state.go_func == 'goHomePage'){
        this.goHomePage()
      }

      if (this.state.go_func == 'gotoBed'){
        this.gotoBed()
      }

      if (this.state.go_func =='handleDialysisTop'){
        this.handleDialysisTop();
      }

      if (this.state.go_func =='contextUserMenuAction'){
        this.contextUserMenuAction(this.state.confirm_event);
      }
      if (this.state.go_func =='openPaitientListModal'){
        this.openPaitientListModal();
      }      
      if (this.state.check_from == "navigation") {
        this.harukaGoto(this.state.check_url, this.state.check_selected_id, this.state.check_menu_item);
      } else if(this.state.check_from == "sidebar") {
        this.harukaGotoUrlFromSidebar(this.state.check_selected_id);
      } else if(this.state.check_from == "view_action") {
        this.harukaViewAction();
      } else if(this.state.check_from == "view_list_action") {
        this.harukaViewListAction(this.state.check_act);
      } else if(this.state.check_from == "select_patient") {
        this.harukaSelectPatient(this.state.check_patient_id);
      } else if(this.state.check_from == "home") {
        this.props.history.replace('/top');
      }
    }
  }

  // 処方以外のページをクリックした場合警告表示処理
  checkPresDataFromPrescription = (presData) => {
    let validationPassed = true;
    let strMessage = "";

    // 用法用量の確認
    let arrNotAllow = [];
    presData.map(item => {
      item.medicines.map(med=>{
        if(med.usage_permission !== undefined && med.usage_permission < 0) {
          validationPassed = false;
          arrNotAllow.push("・" + med.medicineName);
        }
      })
    });

    if (validationPassed == false) {
      strMessage = "用法用量の確認が必要な薬剤があります。処方箋からクリックして確認してください\n対象：\n" + arrNotAllow.join("\n");

      this.setState({alert_messages: strMessage});
      return false;
    }


    // 数量がない
    presData.map(item => {
      item.medicines.map(medicine => {
        if (
          medicine.medicineName !== "" &&
          medicine.amount === undefined
        ) {
          validationPassed = false;
        }
      });
    });

    if (validationPassed === false) {
      strMessage = "薬品の数量を入力して下さい。";

      this.setState({alert_messages: strMessage});
      // this.addMessageSendKarte(Karte_Steps.Prescription, type, strMessage, 1);
      return false;
    }

    // 数量がない
    let selMedicines = [];
    let medList = "";
    presData.map(item => {
      item.medicines.map(medicine => {
        if(medicine.period_permission !== undefined && medicine.period_permission < 0) {
          validationPassed = false;
          if(!selMedicines.includes(medicine.medicineId)) {
            selMedicines.push(medicine.medicineId);
            medList += "◆" + medicine.medicineName + "\n";
            if(medicine.gene_name) {
              medList += "(" + medicine.gene_name + ")\n";
            }
          }
        }
      });
    });

    if (validationPassed === false) {
      strMessage = "有効期間外の薬品があります。処方前に削除または別の製品に変更してください。\n" + medList;

      this.setState({alert_messages: strMessage});
      // this.addMessageSendKarte(Karte_Steps.Prescription, type, strMessage, 1);
      return false;
    }

    // 用法がない
    presData.map(item => {
      if (
        item.medicines.length >= 1 &&
        item.medicines[0].medicineName !== "" &&
        item.usageName === ""
      ) {
        validationPassed = false;
      }
    });

    if (validationPassed === false) {
      strMessage = "用法方法を入力して下さい。";

      this.setState({alert_messages: strMessage});
      // this.addMessageSendKarte(Karte_Steps.Prescription, type, strMessage, 1);
      return false;
    }

    // 日数がない
    presData.map(item => {
      if (item.usage_replace_number === undefined) {
        if (
          item.usageName !== "" &&
          item.days === 0
        ) {
          if (item.usageIndex !== 6 && item.enable_days === 1) {
            validationPassed = false;
          }
        }
      } else {
        if (
          item.usageName !== "" &&
          (item.days === 0 &&
            item.usage_replace_number.length === 0)
        ) {
          if (item.usageIndex !== 6 && item.enable_days === 1) {
            validationPassed = false;
          }
        }
      }

    });

    if (validationPassed === false) {
      strMessage = "用法の日数を入力して下さい。";

      this.setState({alert_messages: strMessage});
      // this.addMessageSendKarte(Karte_Steps.Prescription, type, strMessage, 1);
      return false;
    }

    // 用法 is_enabled
    presData.map(item => {
      if (this.hasPrescriptionUnenabledUsage(item.usage) == true) {
        validationPassed = false;
      }

    });

    if (validationPassed === false) {
      strMessage = "使用できない用法が選択されています。登録する場合は用法を変更してください";

      this.setState({alert_messages: strMessage});
      // this.addMessageSendKarte(Karte_Steps.Prescription, type, strMessage, 1);
      return false;
    }

    return validationPassed;
  }

  hasPrescriptionUnenabledUsage = (usage_number) => {
    // let usageData = JSON.parse(window.localStorage.getItem("haruka_cache_usageData"));
    let usageData = {};
    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if (init_status != null && init_status != undefined && init_status.prescription_usage != undefined && init_status.prescription_usage != null) {
      usageData = init_status.prescription_usage;
    }
    // let usageNumberArray = [];
    if (usage_number == null || usage_number == undefined) {
      return false;
    }

    let nHasUnenabledUsage = 0;
    if (usageData != null && usageData != undefined) {
      usageData.external.all.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      usageData.injection.all.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      if(usageData.internal != null && usageData.internal.internal_other != null) {
        usageData.internal.internal_other.map(ele=>{
          if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
            nHasUnenabledUsage = 1;
          }
        });
      }
      if (nHasUnenabledUsage == 1) return true;
      usageData.internal.times_1.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      usageData.internal.times_2.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      usageData.internal.times_3.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
      usageData.when_necessary.all.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) return true;
    }
    return false;
  }

  // 注射以外のページをクリックした場合警告表示処理
  checkInjectDataFromInjection = (presData) => {
    let validationPassed = true;
    let strMessage = "";

    // 数量がない
    presData.map(item => {
      item.medicines.map(medicine => {
        if (
          medicine.medicineName !== "" &&
          (medicine.amount === undefined)
        ) {
          validationPassed = false;
        }
      });
    });

    if (validationPassed === false) {
      strMessage = "注射の数量を入力して下さい。";

      this.setState({alert_messages: strMessage});
      return false;
    }

    // 数量がない
    let selMedicines = [];
    let medList = "";
    presData.map(item => {
      item.medicines.map(medicine => {
        if(medicine.period_permission !== undefined && medicine.period_permission < 0) {
          validationPassed = false;
          if(!selMedicines.includes(medicine.medicineId)) {
            selMedicines.push(medicine.medicineId);
            medList += "◆" + medicine.medicineName + "\n";
            if(medicine.gene_name) {
              medList += "(" + medicine.gene_name + ")\n";
            }
          }
        }
      });
    });

    if (validationPassed === false) {
      strMessage = "有効期間外の薬品があります。削除または別の製品に変更してください。\n" + medList;

      this.setState({alert_messages: strMessage});
      return false;
    }


    // 用法がない
    // presData.map(item => {
    //   if (
    //     item.medicines.length >= 1 &&
    //     item.medicines[0].medicineName !== "" &&
    //     (item.usageName === "" || item.usageName === undefined)
    //   ) {
    //     validationPassed = false;
    //   }
    // });
    presData.map(item => {
      if (
        item.medicines.length >= 1 &&
        item.medicines[0].medicineName !== "" &&
        (item.usageName === "" || item.usageName === undefined)
      ) {
        validationPassed = false;
      }
    });

    if (validationPassed === false) {
      strMessage = "手技方法を入力して下さい。";

      this.setState({alert_messages: strMessage});
      return false;
      // alert("手技方法を入力して下さい。");
      // return false;
    }

    // 用法 is_enabled
    presData.map(item => {
      if (this.hasInjectionUnenabledUsage(item.usage) == true) {
        validationPassed = false;
      }

    });

    if (validationPassed === false) {
      strMessage = "使用できない手技が選択されています。登録する場合は手技を変更してください";

      this.setState({alert_messages: strMessage});
      return false;
    }

    return validationPassed;
  }

  hasInjectionUnenabledUsage = (usage_number) =>{
    // let usageData = JSON.parse(window.localStorage.getItem("haruka_cache_usageInjectData"));
    let usageData = {};
    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if (init_status != null && init_status != undefined && init_status.injection_usage != undefined && init_status.injection_usage != null) {
      usageData = init_status.injection_usage;
    }
    // let usageNumberArray = [];
    if (usage_number == null || usage_number == undefined) {
      return false;
    }

    let nHasUnenabledUsage = 0;
    if (usageData != null && usageData != undefined && usageData.length > 0) {
      usageData.map(ele=>{
        if (parseInt(usage_number) == parseInt(ele.code) && ele.is_enabled == 0) {
          nHasUnenabledUsage = 1;
        }
      });
      if (nHasUnenabledUsage == 1) {
        return true;
      }
    }
    return false;
  }

  createMedicalRecordOrder=(systemPatientId, doctor_code=null, doctor_name=null)=>{
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let medical_examination_record = {};
    medical_examination_record['patient_id'] = systemPatientId;
    medical_examination_record['department_id'] = this.context.department.code == 0 ? 1 : this.context.department.code;
    medical_examination_record['doctor_code'] = doctor_code != null ? doctor_code : (authInfo.staff_category === 1 ? authInfo.doctor_code : this.context.selectedDoctor.code);
    medical_examination_record['doctor_name'] = doctor_name != null ? doctor_name : (authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name);
    karteApi.setVal(systemPatientId, CACHE_LOCALNAMES.MEDICAL_EXAMINATION_RECORD, JSON.stringify(medical_examination_record), 'insert');
  }

  checkSetVisitTreatmentMode=(patient_id)=>{ //患者選択中用のモード
    let patientInfo = karteApi.getPatient(patient_id);
    if(patientInfo == undefined || patientInfo == null) return;
    if(patientInfo.visit_info == undefined || patientInfo.visit_info == null) return;
    let visit_info = patientInfo.visit_info;
    visit_info['system_patient_id'] = patient_id;
    visit_info['patient_number'] = patientInfo.receId;
    visit_info['patient_name'] = patientInfo.name;
    localApi.setObject("select_patient_visit_mode", visit_info);
  }

  // setCanShowModalEvent = () => {
  //   // eslint-disable-next-line consistent-this
  //   const that = this;

  //   document.addEventListener(`click`, function canShowModalCheck(e) {
  //     if (e.target.tagName !== "BODY") {
  //       var obj = e.target;
  //       do {
  //         if (obj.getAttribute("class") !== null && typeof(obj.className) != "object"){
  //           if(obj.className.indexOf("global-nav-area") > -1){
  //             // 自動ログアウトした後にログインすると復元されてしまうものが他にもあると思われます
  //             localApi.setValue(CACHE_LOCALNAMES.CAN_SHOW_MODAL, 1);
  //             that.context.$enableShowModal(true);
  //             // this.setState({
  //             //   enableShowModal: true
  //             // });
  //             document.removeEventListener(`click`, canShowModalCheck);
  //             break;
  //           }
  //         }
  //         obj = obj.parentElement;
  //       } while(obj.tagName !== "BODY")
  //     }
  //   });

  // }

  reset = () => {
    this.setState({
      needDialSelectDoctor:false,
      isScannerBatchTakeDocPopupOpen: false,
      isHospitalPlanListPopupOpen: false,
      isSummaryListPopupOpen: false,
      isDocumentCreatePopupOpen: false,
      isRadiationReservationListPopupOpen: false,
      isChemicalInformationSearchPopupOpen: false,
      isNutritionGuidanceSlipTotalPopupOpen: false,
      isInspectionReservationListPopupOpen: false,
      isEndoscopeReservationListPopupOpen: false,
      isWardLabelPopupOpen: false,
      isInspectionStatusListPopupOpen: false,
      isEndoscopeStatusListPopupOpen: false,
      isRadiationStatusListPopupOpen: false,
      isInspectionDepartmentResultPopupOpen: false,
      isEndoscopeDepartmentResultPopupOpen: false,
      isRadiationDepartmentResultPopupOpen: false,
      isOutExamCooperationRequestOutputPopupOpen: false,
      isEmergencyReceptionPopupOpen: false,
      isReportCreatListPopupOpen: false,
      isAdminDiaryPopupOpen: false,
      isAdministrationDiaryPopupOpen: false,
      isHospitalizedSettingPopupOpen: false,
      isInpatientContactListPopupOpen: false,
      isPatientsSchedulePopupOpen: false,
      isMovePlanPatientListPopupOpen: false,
      isHospitalPatientBarcodePrintPopupOpen: false,
      isPatientCertificationPopupOpen: false,
      isNurseSummaryListPopupOpen: false,
      isVisitNurseSummaryListPopupOpen:false,
      isNurseAssignmentPopupOpen: false,
      isOutInjectionPatientListPopupOpen: false,
      isMedicationGuidanceSchedulePopupOpen: false,
      report_creat_list_type:"",
      isOpenPatientKarteModal: false,
      isOpenDialNewPatient: false,
      rightSideTab: "favourite",
      // historyList:[],
      menuDesignType:"icon",
      confirm_message: "",
      prescription_confirm_message: "",
      prescription_selected_id: 0,
      okTitle: "",
      cancelTitle: "",
      alert_messages: "",
      confirm_alert_title:'',
      font_size:18,
      isProgressChartPopup: false,
      isNursePlanPopup: false,
      isNurseProfilePopup: false,
      isInchargeSheetPopup: false,
      isNursePlanReferencePopup: false,
      isIndividualWorkSheetPopup: false,
      isNurseInstructionPopup: false,
      isHospitalInstructionPopup: false,
      isOpenPaitientListModal:false,
    },()=>{
      // 自動ログアウトした後にログインすると復元されてしまうものが他にもあると思われます
      localApi.setValue(CACHE_LOCALNAMES.CAN_SHOW_MODAL, 1);
    });
  }

  cancelAlertModal = () => {
    this.setState({
      alertMessage: ""
    });
  }

  checkDeathPatient = (_type, _url) => {
    if (_type == "modal" && 
        (_url == "physiological" || 
        _url == "endoscope" || 
        _url == "radiation" || 
        _url == "guidance" || 
        _url == "rehabilitation" || 
        _url == "hospital_application_order" || 
        _url == "hospital_dicision_order" || 
        _url == "discharge_permit_order" || 
        _url == "change_responsibility" || 
        _url == "hospital_dicision_order" || 
        _url == "hospital_done" || 
        _url == "instruction_book_calendar" ||
        _url == "home_treatment" ||
        _url == "hospital_treatment" || 
        _url == "openExamination" || 
        _url == "instruction_book" ||
        _url == "outpatient")
      ) {
      // 死亡状態に関する修正
      let current_system_patient_id = localApi.getValue("current_system_patient_id");
      current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
      if (karteApi.isDeathPatient(current_system_patient_id)){
        return true;
      }
      return false;
    }
  }
  closeNotConsentedModal = () => {
    this.setState({ hasNotConsentedData: false });
  };

  getconsentState = () => {
    if(!auth.isAuthenticated()) {
      this.m_firstLogin = null;
      return;
    }
    if(this.enableHaruka() != "haruka") return;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo == undefined && authInfo == null && ((authInfo.staff_category || 2) != 1)) return;

    let firstLogin =
      window.sessionStorage.getItem("first_login") !== undefined &&
      window.sessionStorage.getItem("first_login") !== null
        ? window.sessionStorage.getItem("first_login")
        : 0;

    if(this.m_firstLogin == null) {
      this.m_firstLogin = firstLogin;
    }
    // this.m_firstLogin = firstLogin;
    if(this.m_firstLogin == 0) return;

    window.sessionStorage.setItem("first_login", 0);
    this.m_firstLogin = 0;
    // setTimeout(()=>{
      let hasNotConsented = false;
      let data = null;
      data = this.getNotConsentedHistoryData();      
      if (data !== undefined && data != null && data.length > 0) {
        hasNotConsented = true;
      }
      data = this.getNotConsentedInjectionHistoryData();      
      if (data !== undefined && data != null && data.length > 0) {
        hasNotConsented = true;
      }
      data = this.getNotConsentedAllOrderHistoryData();      
      if (data !== undefined && data != null && Object.keys(data).length > 0) {
        hasNotConsented = true;
      }      
      
      this.confirm_ref.current.testConfirmRender(hasNotConsented);
    // }, 1500);
  }
  
  consentedConfirmOk = () => {
    this.consent_confirm = false;    
    this.setState({
      hasNotConsentedData: true
    });
  }

  changeSideMenuInfo = () => {
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if (initState != undefined && initState != null && initState.navigation_menu != undefined && initState.navigation_menu.length > 0) {
      if (this.sideMenuListInfo && this.sideMenuListInfo.length > 0) {
        this.sideMenuListInfo.map(item=>{          
          let menu_item = initState.navigation_menu.find(x=>x.id==item.id);
          if (menu_item != undefined && menu_item != null) {
            item.value = menu_item.name;
          }
        });
      }
    }
  }

  render() {    
    this.changeSideMenuInfo();// change side menu info
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let canShowModal = localApi.getValue(CACHE_LOCALNAMES.CAN_SHOW_MODAL);    
    if (canShowModal == null) {
      this.reset();
    }
    let existTemporaryUser = this.isTemporaryUser();
    let rightSideTab = this.state.rightSideTab;
    // ---------------------------- HARUKA ------------------------
    var mapFavouriteHaruka = (favouriteList, key) => {
      return (
        <OperationFavouriteItem
          clickFn={this.clickMenuItem}
          operationListInfoObj={favouriteList}
          activeLink={this.state.activeLink}
          key={key}
          handleClick={this.handleClick}
          handleFavouriteDragStart={this.onFavouriteDragStart}
          handleFavouriteDropEvent={this.onFavouriteDropEvent}
          handleDragOver={this.onDragOver}
        />
      );
    };
    mapFavouriteHaruka.bind(this);
    const favouriteListArrayHaruka = this.context.bookmarksList;
    // id重複処理
    let item_id_container_favourite_haruka = [];
    const favouriteLists_array_haruka = this.sideMenuListInfo
      .filter(item=>{
        if(favouriteListArrayHaruka.includes(item.id)){
          if (!item_id_container_favourite_haruka.includes(item.id)) {
            item_id_container_favourite_haruka.push(item.id);
            return true;
          }
        }
      });
    let favouriteLists_temp_haruka = [];
    favouriteListArrayHaruka.map(element=>{
      favouriteLists_array_haruka.map(ele=>{
        if (element == ele.id) {
          if (this.canOperateKarteMenuById(ele.id) == 1){
            ele.no_permission = 1;
          } else {
            ele.no_permission = 0;
          }
          favouriteLists_temp_haruka.push(ele);
        }
      });
    });
    const favouriteListsHaruka = favouriteLists_temp_haruka.filter(ele=>{
      if (ele.id != "") {
        return true;
      }
    }).map(mapFavouriteHaruka);

    var mapHistoryHaruka = (historyList, key) => {
      return (
        <OperationFavouriteItem
          clickFn={this.clickMenuItem}
          operationListInfoObj={historyList}
          activeLink={this.state.activeLink}
          key={key}
          handleClick={this.handleLinkHistoryClick}
          handleFavouriteDragStart={this.onFavouriteDragStart}
          handleDragOver={this.onDragOver}
        />
      );
    };
    mapHistoryHaruka.bind(this);
    // 履歴データ from DB
    const historyListArrayHaruka = this.context.linkHistoryList;
    // id重複処理
    let item_id_container_haruka = [];
    let historyLists_array_haruka = this.sideMenuListInfo
      .filter(item=>{
        if(historyListArrayHaruka.includes(item.id)){
          if (!item_id_container_haruka.includes(item.id)) {
            item_id_container_haruka.push(item.id);
            return true;
          }
        }
      });
    let historyLists_temp_haruka = [];
    historyListArrayHaruka.map(element=>{
      historyLists_array_haruka.map(ele=>{
        if (element == ele.id) {
          if (this.canOperateKarteMenuById(ele.id) == 1){
            ele.no_permission = 1;
          } else {
            ele.no_permission = 0;
          }
          historyLists_temp_haruka.push(ele);
        }
      });
    });
    const historyListsHaruka = historyLists_temp_haruka.filter(ele=>{
      if (ele.id != "") {
        return true;
      }
    }).map(mapHistoryHaruka);
    // ---------------------------- HARUKA end ------------------------

    // ---------------------------- 透析 ------------------------
    var mapFunc = (operationList, key) => {
      var clickFunc =
        typeof operationList.click == "function"
          ? event => {
            this.setState({
              isOpenModal: false
            });
            operationList.click(this, event);
          }
          : (operationList)=>{this.changeTab(operationList)};
      return (
        <OperationItem
          clickFn={clickFunc}
          operationListInfoObj={operationList}
          activeLink={this.state.activeLink}
          key={key}
          handleInspectionClick={this.handleInspectionClick}
        />
      );
    };
    mapFunc.bind(this);
    const operationLists = operationListInfo.map(mapFunc);
    const {
      selectedDoctor
    } = this.context;

    var mapFavourite = (favouriteList, key) => {
      var clickFunc =
        typeof favouriteList.click == "function"
          ? event => {
            this.setState({
              isOpenModal: false
            });
            favouriteList.click(this, event);
          }
          : (favouriteList)=>{this.changeTab(favouriteList)};
      return (
        <OperationFavouriteItem
          clickFn={clickFunc}
          operationListInfoObj={favouriteList}
          activeLink={this.state.activeLink}
          key={key}
          handleClick={this.handleClick}
          handleFavouriteDragStart={this.onFavouriteDragStart}
          handleFavouriteDropEvent={this.onFavouriteDropEvent}
          handleDragOver={this.onDragOver}
        />
      );
    };
    mapFavourite.bind(this);
    const favouriteListArray = this.context.bookmarksList;
    // id重複処理
    let item_id_container_favourite = [];
    const favouriteLists_array = this.sideMenuListInfo
      .filter(item=>{
        if(favouriteListArray.includes(item.id)){
          if (!item_id_container_favourite.includes(item.id)) {
            item_id_container_favourite.push(item.id);
            return true;
          }
        }
      });
    let favouriteLists_temp = [];
    favouriteListArray.map(element=>{
      favouriteLists_array.map(ele=>{
        if (element == ele.id) {
          favouriteLists_temp.push(ele);
        }
      });
    });
    const favouriteLists = favouriteLists_temp.filter(ele=>{
      if (ele.id != "") {
        return true;
      }
    }).map(mapFavourite);

    var mapHistory = (historyList, key) => {
      var clickFunc =
        typeof historyList.click == "function"
          ? event => {
            this.setState({
              isOpenModal: false
            });
            historyList.click(this, event);
          }
          : (historyList)=>{this.changeTab(historyList)};
      return (
        <OperationFavouriteItem
          clickFn={clickFunc}
          operationListInfoObj={historyList}
          activeLink={this.state.activeLink}
          key={key}
          handleClick={this.handleLinkHistoryClick}
          handleFavouriteDragStart={this.onFavouriteDragStart}
          handleDragOver={this.onDragOver}
        />
      );
    };
    mapHistory.bind(this);
    // 履歴データ from DB
    const historyListArray = this.context.linkHistoryList;
    // id重複処理
    let item_id_container = [];
    let historyLists_array = this.sideMenuListInfo
      .filter(item=>{
        if(historyListArray.includes(item.id)){
          if (!item_id_container.includes(item.id)) {
            item_id_container.push(item.id);
            return true;
          }
        }
      });
    let historyLists_temp = [];
    historyListArray.map(element=>{
      historyLists_array.map(ele=>{
        if (element == ele.id) {
          historyLists_temp.push(ele);
        }
      });
    });
    const historyLists = historyLists_temp.filter(ele=>{
      if (ele.id != "") {
        return true;
      }
    }).map(mapHistory);
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    
    // ●DN504 ナビゲーションマップ自体のボタン名を変更できるように (navigation_menu_open_button_name)
    let navigation_menu_button_name = "一覧";
    if (this.enableHaruka() == "dialysis") {
      let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
      if(initState != undefined && 
        initState != null && 
        initState.conf_data != undefined && 
        initState.conf_data != null && 
        initState.conf_data.navigation_menu_open_button_name !== undefined && 
        initState.conf_data.navigation_menu_open_button_name !== null && 
        initState.conf_data.navigation_menu_open_button_name.trim() !== "") {
        navigation_menu_button_name = initState.conf_data.navigation_menu_open_button_name;
      }
    }

    // ---------------------------- 透析 end ------------------------
    return (
      <>
        {auth.isAuthenticated() && this.checkUrl("no-login") ? (
          <>
            {this.enableHaruka() == "haruka" && (
              <FlexHaruka className="global-nav-area">
                {existTemporaryUser === true && (<div className="temp-user">一時利用</div>)}
                <div className="div-buttons mb-1">
                  {/*<Button className="btn-seat" onClick={this.onSeat}>離席</Button>*/}
                  {existTemporaryUser == true ? (
                    <button className="btn-turn btn-turn-disable" onClick={this.onTemporaryLogin}>切替</button>                  
                  ):(
                    <button className="btn-turn btn-black-color" onClick={this.onTemporaryLogin}>切替</button>                  
                  )}
                  <Button
                    className={`btn-logout ${this.isPatientPage(3) == true ? "btn-logout-disable" : ""}`} //3:看護記録画面の場合
                    onClick={this.handleTop}
                    id="login-button"
                  >
                    <img src={icon} />
                  </Button>
                </div>
                <div className="div-buttons font-size-setting-area mb-1">
                  {/* <div className='plus-zoom clickable' onClick={this.zoomPlusFont.bind(this)}>
                  <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25px" height="25px"
                    viewBox="0 0 227.406 227.406">
                  <g>
                    <path d="M217.576,214.708l-65.188-67.794c16.139-15.55,26.209-37.355,26.209-61.484
                      c0-47.106-38.323-85.43-85.43-85.43C46.06,0,7.737,38.323,7.737,85.43c0,47.106,38.323,85.43,85.43,85.43
                      c17.574,0,33.924-5.339,47.52-14.474l66.077,68.719c1.473,1.531,3.439,2.302,5.407,2.302c1.87,0,3.743-0.695,5.197-2.094
                      C220.354,222.441,220.447,217.693,217.576,214.708z M22.737,85.43c0-38.835,31.595-70.43,70.43-70.43
                      c38.835,0,70.43,31.595,70.43,70.43s-31.595,70.43-70.43,70.43C54.332,155.859,22.737,124.265,22.737,85.43z"/>
                    <path d="M131.415,77.93h-30.748V47.182c0-4.143-3.357-7.5-7.5-7.5c-4.143,0-7.5,3.357-7.5,7.5V77.93H54.918
                      c-4.143,0-7.5,3.357-7.5,7.5s3.357,7.5,7.5,7.5h30.748v30.749c0,4.143,3.357,7.5,7.5,7.5c4.143,0,7.5-3.357,7.5-7.5V92.93h30.748
                      c4.143,0,7.5-3.357,7.5-7.5S135.557,77.93,131.415,77.93z"/>
                  </g>
                  </svg>

                </div>
                <div className='minus-zoom clickable' onClick={this.zoomMinusFont.bind(this)}>
                  <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px"
                    width="25px" height="25px" viewBox="0 0 494.575 494.575">
                  <g>
                    <path d="M487.428,452.934L292.372,257.873c46.654-63.372,41.5-153.181-15.805-210.485c-63.187-63.183-165.996-63.183-229.179,0
                      s-63.183,165.992,0,229.175c57.305,57.311,147.113,62.459,210.488,15.812L452.933,487.43c9.521,9.527,24.967,9.527,34.495,0
                      C496.956,477.901,496.956,462.45,487.428,452.934z M242.072,242.07c-44.163,44.156-116.022,44.156-160.191,0
                      c-44.159-44.162-44.159-116.025,0-160.185c44.168-44.165,116.022-44.165,160.191,0C286.231,126.045,286.231,197.908,242.072,242.07
                      z M230.782,144.587c9.108,0,16.5,7.383,16.5,16.497c0,9.118-7.392,16.506-16.5,16.506H91.386c-9.118,0-16.506-7.388-16.506-16.506
                      c0-9.114,7.388-16.497,16.506-16.497H230.782z"/>
                  </g>
                  </svg>
                </div>
                <div className='origin-zoom clickable' onClick={this.zoomBack.bind(this)}>
                  <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                    width="25px" height="25px" viewBox="0 0 54.938 54.937">
                  <g>
                    <g>
                      <path d="M9.258,24.475c0,0.473,0.172,0.798,0.655,0.798s0.656-0.326,0.656-0.798v-5.156c0-0.49-0.224-0.617-0.5-0.617
                        c-0.732,0-0.465,1.035-1.423,1.253l-0.319,0.072c-0.448,0.091-0.621,0.182-0.621,0.518c0,0.373,0.155,0.481,0.44,0.481h1.113
                        L9.258,24.475L9.258,24.475z"/>
                      <path d="M13.933,25.273c1.82,0,2.302-1.761,2.302-3.367c0-2.142-0.905-3.205-2.302-3.205s-2.303,1.063-2.303,3.205
                        C11.63,23.512,12.113,25.273,13.933,25.273z M13.933,19.791c0.759,0,1.044,0.835,1.044,2.196c0,1.625-0.38,2.196-1.044,2.196
                        c-0.665,0-1.044-0.571-1.044-2.196C12.889,20.626,13.174,19.791,13.933,19.791z"/>
                      <path d="M19.212,25.273c1.82,0,2.303-1.761,2.303-3.367c0-2.142-0.905-3.205-2.303-3.205c-1.397,0-2.303,1.063-2.303,3.205
                        C16.909,23.512,17.392,25.273,19.212,25.273z M19.212,19.791c0.759,0,1.043,0.835,1.043,2.196c0,1.625-0.379,2.196-1.043,2.196
                        s-1.043-0.571-1.043-2.196C18.168,20.626,18.453,19.791,19.212,19.791z"/>
                      <path d="M26.897,23.54c0,0.979,0.405,1.733,1.448,1.733c1.043,0,1.449-0.753,1.449-1.733s-0.406-1.734-1.449-1.734
                        C27.302,21.806,26.897,22.56,26.897,23.54z M28.346,22.514c0.396,0,0.518,0.481,0.518,1.026c0,0.581-0.121,1.026-0.518,1.026
                        s-0.518-0.445-0.518-1.026C27.828,22.995,27.949,22.514,28.346,22.514z"/>
                      <path d="M24.232,25.201c0,0.154,0.146,0.309,0.336,0.309c0.172,0,0.276-0.137,0.336-0.254l3.104-6.172
                        c0.062-0.118,0.096-0.218,0.096-0.308c0-0.154-0.146-0.309-0.336-0.309c-0.172,0-0.276,0.136-0.335,0.254l-3.105,6.172
                        C24.267,25.01,24.232,25.11,24.232,25.201z"/>
                      <path d="M23.982,22.169c1.043,0,1.449-0.753,1.449-1.734s-0.406-1.734-1.449-1.734s-1.449,0.753-1.449,1.734
                        S22.939,22.169,23.982,22.169z M23.982,19.41c0.396,0,0.517,0.481,0.517,1.026c0,0.581-0.121,1.025-0.517,1.025
                        c-0.397,0-0.518-0.445-0.518-1.025C23.465,19.891,23.585,19.41,23.982,19.41z"/>
                      <path d="M18.75,40.737c5.589,0,10.602-2.471,14.039-6.362l2.682,2.198c-0.262,0.927,0.025,1.961,0.817,2.611l14.563,11.948
                        c0.466,0.383,1.027,0.567,1.584,0.567c0.724,0,1.441-0.312,1.935-0.915c0.876-1.066,0.722-2.643-0.347-3.518L39.459,35.319
                        c-0.791-0.649-1.863-0.729-2.722-0.292l-2.702-2.217c2.174-3.061,3.465-6.791,3.465-10.822c0-10.339-8.41-18.75-18.75-18.75
                        C8.411,3.238,0,11.649,0,21.988C0,32.328,8.411,40.737,18.75,40.737z M18.75,5.237c9.236,0,16.75,7.514,16.75,16.75
                        c0,9.236-7.514,16.75-16.75,16.75C9.514,38.737,2,31.223,2,21.987C2,12.751,9.514,5.237,18.75,5.237z"/>
                      <path d="M18.75,37.85c8.747,0,15.862-7.116,15.862-15.862S27.496,6.126,18.75,6.126c-8.746,0-15.862,7.116-15.862,15.862
                        S10.004,37.85,18.75,37.85z M18.75,8.125c7.644,0,13.862,6.219,13.862,13.862c0,7.644-6.219,13.862-13.862,13.862
                        c-7.643,0-13.862-6.219-13.862-13.862C4.888,14.344,11.107,8.125,18.75,8.125z"/>
                    </g>
                  </g>
                  </svg>

                </div>
               */}
                  <div style={{width:'160px'}} className='font-setting-area'>{'サイズ：'+this.state.font_size+'pt'}</div>
                  <div style={{width:'30px'}} onClick={this.onFontList} id="view-font-menu" className='clickable'>▼</div>
                </div>
                <div className="mb-1 div-name">
                  <div className="user-name" onContextMenu={e => this.handleUserClick(e)}>
                    <FormWithLabel
                      type="text"
                      label=""
                      id="glavalnav-doctor-name"
                      value={authInfo != null && authInfo != undefined && authInfo.name != null && authInfo.name != undefined ? authInfo.name : ""}
                    />
                  </div>
                </div>
                <div className="mb-1 div-doctor">
                  <div className="doctor-button">
                    <Button onClick={this.chooseDoctor.bind(this)}>依</Button>
                  </div>
                  <div className="doctor-name">
                    <FormWithLabel
                      type="text"
                      label=""
                      id="globalnav-consented-doctor"
                      value={selectedDoctor.name}
                    />
                  </div>
                  <div className="doctor-button style-one">
                    <Button onClick={() => this.cancelDoctor()}>C</Button>
                  </div>
                </div>
                <div className="mb-1 div-menu-list">
                  <div className="menu-list-button" id={'view-menu'}>
                    <Button onClick={this.onOpenModal}>一覧</Button>
                  </div>
                  <div className="doctor-button btn-home">
                    <Button onClick={this.goHomePage}>
                      <Icon icon={faHome} />
                    </Button>
                  </div>
                </div>
                <div className="mb-1 div-menu">
                  <div id="dv-viewList" className="menu-button">
                    <Button onClick={this.onViewAction}>{this.state.currentViewName}</Button>
                  </div>
                  <div className="menu-select">
                    <Button onClick={this.onViewList} id="view-select-menu">▼
                    </Button>
                  </div>
                </div>
                <div className="mb-1 menu-comment-haruka">
                  <div className="patients-select">
                    {this.context.patientsList.map((item, key)=>{
                      return (
                        <div key={key} onClick={()=>this.selectPatient(item.system_patient_id)}>
                          {current_system_patient_id == item.system_patient_id ? '* ' + item.name : item.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={`mb-1 ${rightSideTab == 'favourite' ? 'div-menu-modal' : ''} ${rightSideTab=='history' ? 'div-menu-modal-history' : ''} ${rightSideTab != 'history' ? 'div-menu-modal' : ''}`}>
                  <div id="dv-viewList" onContextMenu={(e)=>this.handleLinkHistoryTabClick(e)} className={`menu-div-favourite ${rightSideTab == 'favourite' ? 'btn-active-fav' : ''} ${rightSideTab != 'history' ? 'btn-active-fav' : ''}`} onDrop={e => this.onFavouriteTabDropEvent(e)} onDragOver={e => this.onDragOver(e)}>
                    <Button onClick={() => this.selectFavouriteTab('favourite')}>お気に入り</Button>
                  </div>
                  <div id="dv-viewList" onContextMenu={(e)=>this.handleLinkHistoryTabClick(e)} className={`menu-div-history ${rightSideTab == 'history' ? 'btn-active-his' : ''}`}>
                    <Button onClick={() => this.selectFavouriteTab('history')}>履歴</Button>
                  </div>
                </div>
                {(rightSideTab == 'favourite' ||  rightSideTab != 'history') && (
                  <div className={`patient-nav-div ${this.context.favouriteHistoryType == "list" ? "menu-design-list" : ""}`} onDrop={e => this.onFavouriteTabDropEvent(e)} onDragOver={e => this.onDragOver(e)}>
                    <ul id="favourite-ul-id" className="patient-nav" onClick={this.onGlobalClick} onContextMenu={(e)=>this.handleLinkHistoryClick(e)} style={{height:this.s_width, overflowY:"auto"}}>
                      {(this.context.favouriteHistoryType == "list" || this.context.favouriteHistoryType == "icon") && (
                        <>
                          {favouriteListsHaruka}
                        </>
                      )}
                    </ul>
                  </div>
                )}
                {rightSideTab == 'history' && (
                  <ul id="history-ul-id" onContextMenu={(e)=>this.handleLinkHistoryClick(e)} className={`patient-nav ${this.context.favouriteHistoryType == "list" ? "menu-design-list" : ""}`} onClick={this.onGlobalClick} style={{height:this.s_width, overflowY:"auto"}}>
                    {(this.context.favouriteHistoryType == "list" || this.context.favouriteHistoryType == "icon") && (
                      <>
                        {historyListsHaruka}
                      </>
                    )}
                  </ul>
                )}
                {this.context.needMenuModal == true && this.enableHaruka() == "haruka" && (
                  <MenuModal
                    onCloseModal={this.onCloseModal}
                    onGoto={this.onGoto}
                    updateFavouriteList={this.updateFavouriteList}
                    favouriteList={this.context.bookmarksList}
                  />
                )}
                {this.state.isOpenModal !== undefined && this.state.isOpenModal !== null && this.state.isOpenModal&& this.enableHaruka() == "dialysis" && (
                  <MenuDialModal
                    onCloseModal={this.onCloseModal}
                    onGoto={this.onGoto}
                    updateFavouriteList={this.updateFavouriteList}
                    favouriteList={this.context.bookmarksList}
                  />
                )}
                {this.state.isSeatModal !== undefined && this.state.isSeatModal !== null && this.state.isSeatModal && (
                  <SeatModal
                    onCloseModal={this.onCloseSeatModal}
                    onGoto={this.onGoto}
                  />
                )}
                <ViewList
                  {...this.state.viewList}
                  parent={this}
                  viewListItems={this.state.viewListItems}
                />
                <FontList
                  {...this.state.fontList}
                  parent={this}
                />
                {this.state.doctors != undefined && canShowModal == 1 && (this.context.needSelectDoctor === true || this.state.isSelectDoctorModal === true) && (
                  <SelectDoctorModal
                    closeDoctor={this.closeDoctor}
                    getDoctor={this.getDoctor}
                    selectDoctorFromModal={this.selectDoctorFromModal}
                    doctors={this.state.doctors}
                  />
                )}
                {this.state.isHospitalPlanListPopupOpen && canShowModal == 1 && (
                  <HospitalPlanList
                    closeModal={this.closeModal}
                  />
                )}
                {this.state.isSummaryListPopupOpen && canShowModal == 1 && (
                  <SummaryList
                    closeModal={this.closeModal}
                    goKartePage = {this.goKartePage}
                  />
                )}
                {this.state.isDocumentReferencePopupOpen && canShowModal == 1 && (
                  <DocumentReference
                    closeModal={this.closeModal}
                  />
                )}
                {this.state.isDocumentCreatePopupOpen && canShowModal == 1 && (
                  <DocumentCreate
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isScannerBatchTakeDocPopupOpen && canShowModal == 1 && (
                  <ScannerBatchTakeDoc
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isChemicalInformationSearchPopupOpen && canShowModal == 1 && (
                  <ChemicalInformationSearch
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isNutritionGuidanceSlipTotalPopupOpen && canShowModal == 1 && (
                  <NutritionGuidanceSlipTotal
                    closeModal={this.closeModal}
                    goKartePage = {this.goKartePage}
                  />
                )}
                { this.state.isInspectionReservationListPopupOpen && canShowModal == 1 && (
                  <InspectionReservationListModal
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isRadiationReservationListPopupOpen && canShowModal == 1 && (
                  <RadiationReservationListModal
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isInspectionStatusListPopupOpen && canShowModal == 1 && (
                  <InspectionStatusList
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isEndoscopeStatusListPopupOpen && canShowModal == 1 && (
                  <EndoscopeStatusListModal
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isRadiationStatusListPopupOpen && canShowModal == 1 && (
                  <RadiationStatusListModal
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isEndoscopeReservationListPopupOpen && canShowModal == 1 && (
                  <EndoscopeReservationListModal
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isWardLabelPopupOpen && canShowModal == 1 && (
                  <WardLabel
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isInspectionDepartmentResultPopupOpen && canShowModal == 1 && (
                  <InspectionDepartmentResultModal
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isRadiationDepartmentResultPopupOpen && canShowModal == 1 && (
                  <RadiationDepartmentResultModal
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isEndoscopeDepartmentResultPopupOpen && canShowModal == 1 && (
                  <EndoscopeDepartmentResultModal
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isOutExamCooperationRequestOutputPopupOpen && canShowModal == 1 && (
                  <OutExamCooperationRequestOutputModal
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isEmergencyReceptionPopupOpen && canShowModal == 1 && (
                  <EmergencyReceptionModal
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isReportCreatListPopupOpen && canShowModal == 1 && (
                  <ReportCreatListModal
                    closeModal={this.closeModal}
                    goToPage = {this.goToPage}
                    report_creat_list_type = {this.state.report_creat_list_type}
                  />
                )}
                { this.state.isAdminDiaryPopupOpen && canShowModal == 1 && (
                  <AdminDiaryModal
                    closeModal={this.closeModal}
                    goToPage = {this.goToPage}
                  />
                )}
                { this.state.isAdministrationDiaryPopupOpen && canShowModal == 1 && (
                  <AdministrationDiaryMenuModal
                    closeModal={this.closeModal}
                    goToPage = {this.goToPage}
                  />
                )}
                {this.state.isHospitalizedSettingPopupOpen && canShowModal == 1 && (
                  <HospitalizedSetting
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isInpatientContactListPopupOpen && canShowModal == 1 && (
                  <InpatientContactList
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isOutInjectionPatientListPopupOpen && canShowModal == 1 && (
                  <OutInjectionPatientModal
                    closeModal={this.closeModal}
                    goKartePage = {this.goKartePage}
                  />
                )}
                { this.state.isNurseAssignmentPopupOpen && canShowModal == 1 && (
                  <NurseAssignment
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isPatientsSchedulePopupOpen && canShowModal == 1 && (
                  <PatientsSchedule
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isMovePlanPatientListPopupOpen && canShowModal == 1 && (
                  <MovePlanPatientList
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isHospitalPatientBarcodePrintPopupOpen && canShowModal == 1 && (
                  <HospitalPatientBarcodePrint
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isPatientCertificationPopupOpen && canShowModal == 1 && (
                  <PatientCertification
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isNurseSummaryListPopupOpen && canShowModal == 1 && (
                  <NurseSummaryList
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isVisitNurseSummaryListPopupOpen && canShowModal == 1 && (
                  <VisitNurseSummaryList
                    closeModal={this.closeModal}
                  />
                )}
                { this.state.isMedicationGuidanceSchedulePopupOpen && canShowModal == 1 && (
                  <MedicationGuidanceSchedule
                    closeModal={this.closeModal}
                  />
                )}
                {this.state.isOpenPatientKarteModal !== false && canShowModal == 1 &&  (
                  <OpenPatientKarteListModal
                    openKarteArray = {this.state.openKarteArray}
                    goKartePage = {this.goKartePage}
                    cancelAllLogOut = {this.handleLogOut}
                    closeModal = {this.closeModal}
                  />
                )}
                {this.state.prescription_confirm_message !== "" && canShowModal == 1 &&  (
                  <PrescriptionConfirmModal
                    hideConfirm= {this.confirmPrescriptionCancel.bind(this)}
                    confirmCancel= {this.confirmPrescriptionCancel.bind(this)}
                    confirmOk= {this.confirmPrescriptionOk.bind(this)}
                    confirmTitle= {this.state.prescription_confirm_message}
                    okTitle= {this.state.okTitle}
                    cancelTitle= {this.state.cancelTitle}
                  />
                )}
                {this.state.isProgressChartPopup && canShowModal == 1 &&  (
                  <ProgressChart
                    closeModal={this.closeModal}
                  />
                )}
                {this.state.isNursePlanPopup && canShowModal == 1 &&  (
                  <NurseProblemListModal
                    closeModal={this.closeModal}
                  />
                )}
                {this.state.isNurseProfilePopup && canShowModal == 1 &&  (
                  <NurseProfileDatabaseModal
                    closeModal={this.closeModal}
                  />
                )}
                {this.state.isInchargeSheetPopup && canShowModal == 1 &&  (
                  <SelectShowModeModal
                    closeModal={this.closeModal}
                  />
                )}
                {this.state.isNursePlanReferencePopup && canShowModal == 1 &&  (
                  <NursePlanReferenceModal
                    closeModal={this.closeModal}
                  />
                )}
                {this.state.isIndividualWorkSheetPopup && canShowModal == 1 &&  (
                  <NurseCourseSeatModal
                    closeModal = {this.closeModal}
                    type={'individual'}
                  />
                )}
                {this.state.isNurseInstructionPopup && canShowModal == 1 &&  (
                  <NurseInstruction
                    closeModal={this.closeModal}
                  />
                )}
                {this.state.isHospitalInstructionPopup && canShowModal == 1 &&  (
                  <BulkInstructionModal
                    closeModal={this.closeModal}
                  />
                )}
                {this.state.alertMessage == "death" && (
                  <AlertNoFocusModal
                    hideModal= {this.cancelAlertModal.bind(this)}
                    handleOk= {this.cancelAlertModal.bind(this)}
                    showMedicineContent= {"死亡した患者です。"}
                  />
                )}
                {this.state.alert_messages !== "" && canShowModal == 1 &&  (
                  <SystemAlertModal
                    hideModal= {this.closeAlertModal.bind(this)}
                    handleOk= {this.closeAlertModal.bind(this)}
                    showMedicineContent= {this.state.alert_messages}
                  />
                )}
                {this.state.hasNotConsentedData && (
                  <NotConsentedModal
                    patiendId={0}
                    fromPatient={true}
                    closeNotConsentedModal={this.closeNotConsentedModal}
                    fromConsentedData="first_login"
                  />
                )}                
              </FlexHaruka>
            )}
            {this.enableHaruka() == "dialysis" && (
              <FlexDial>
                {existTemporaryUser === true && (<div className="temp-user">一時利用</div>)}
                <div className="div-buttons div-home mb-1">
                  <div className="doctor-button btn-home">
                    <Button onClick={this.goHomePage}>
                      <Icon icon={faHome} />
                    </Button>
                  </div>
                  <Button className={`btn-logout ${this.isPatientPage() == true ? "btn-logout-disable" : ""}`} onClick={this.handleDialysisTop} id="login-button">
                    <img src={icon} />
                  </Button>
                </div>
                <div className="div-buttons top-home mb-1">
                  <div className="user-name" onContextMenu={e => this.handleUserClick(e)}>
                    <FormWithLabel
                      type="text"
                      label=""
                      value={authInfo.name}
                    />
                  </div>
                </div>
                <div className="mb-1 div-doctor">
                  <div className="doctor-button dialysis-doctor-button">
                    <Button onClick={this.chooseDoctor.bind(this)}>依</Button>
                  </div>
                  <div className="doctor-name dialysis-doctor-name">
                    <FormWithLabel
                      type="text"
                      label=""
                      value={selectedDoctor.name}
                    />
                  </div>
                  <div className="doctor-button style-one dialysis-doctor-button style-two">
                    <Button onClick={() => this.cancelDoctor()}>C</Button>
                  </div>
                </div>
                {/*<div className="mb-1 half">*/}
                {/*  <Button className="btn-seat" onClick={this.onSeat}>離席</Button>*/}
                {/*  <Button className="btn-turn" onClick={this.onTemporaryLogin}>切替</Button>*/}
                {/*</div>    */}
                {this.enableTerminal() && (
                  <div className="modal-button3">
                    <Button onClick={this.gotoBed.bind(this)}>ホーム</Button>
                  </div>
                )}
                <div className="modal-button3">
                  <Button onClick={this.onOpenModal}>{navigation_menu_button_name}</Button>
                  <Button style={{marginTop:'5px'}} onClick={this.openPaitientListModal}>患者一覧</Button>
                </div>
                {/*<div className="mb-1 div-menu">
                <div id="dv-viewList" className="menu-button menu-dial-button">
                  <Button onClick={this.onViewAction}>{this.state.currentViewName}</Button>
                </div>
                <div className="menu-select">
                  <Button onClick={this.onViewList} id="view-select-menu">
                    <Arrow icon={faArrowDown} />
                  </Button>
                </div>
              </div>*/}
                {/*<div className="mb-1 menu-comment">
                  <SelectorDefault
                    options={this.context.patientsList}
                    getSelect={this.selectDialEditingPatient}
                    visible={bPatientsId}
                  />
              </div>*/}
                <div className="mb-1 div-menu-modal">
                  <div onContextMenu={(e)=>this.handleLinkHistoryTabClick(e)} className={`modal-button1 dial-favourite-btn ${rightSideTab == 'favourite' ? 'btn-favourite-active' : ''}`}>
                    <Button onClick={() => this.selectFavouriteTab('favourite')}>お気に入り</Button>
                  </div>
                  <div onContextMenu={(e)=>this.handleLinkHistoryTabClick(e)} className={`modal-button2 dial-favourite-btn ${rightSideTab == 'history' ? 'btn-favourite-active' : ''}`}>
                    <Button onClick={() => this.selectFavouriteTab('history')}>履歴</Button>
                  </div>
                </div>
                {this.canShowPatientNav() == true ? (
                  <ul className="patient-nav" onClick={this.onGlobalClick} style={{height:this.s_width, overflowY:"auto"}}>{operationLists}</ul>
                ):(
                  <>
                    {(rightSideTab == 'favourite' ||  rightSideTab != 'history') && (
                      <div className={`patient-nav-div ${this.context.favouriteHistoryType == "list" ? "menu-design-list" : ""}`}>
                        <ul id="favourite-ul-id" className="patient-nav" onClick={this.onGlobalClick} onContextMenu={(e)=>this.handleLinkHistoryClick(e)} style={{height:this.s_width, overflowY:"auto"}}>
                          {(this.context.favouriteHistoryType == "list" || this.context.favouriteHistoryType == "icon") && (
                            <>
                              {favouriteLists}
                            </>
                          )}
                        </ul>
                      </div>
                    )}
                    {rightSideTab == 'history' && (
                      <ul id="history-ul-id" onContextMenu={(e)=>this.handleLinkHistoryClick(e)} className={`patient-nav ${this.context.favouriteHistoryType == "list" ? "menu-design-list" : ""}`} onClick={this.onGlobalClick} style={{height:this.s_width, overflowY:"auto"}}>
                        {(this.context.favouriteHistoryType == "list" || this.context.favouriteHistoryType == "icon") && (
                          <>
                            {historyLists}
                          </>
                        )}
                      </ul>
                    )}
                  </>
                )}
                {this.state.isOpenModal !== undefined && this.state.isOpenModal !== null && this.state.isOpenModal && this.enableHaruka() == "haruak" && (
                  <MenuModal
                    onCloseModal={this.onCloseModal}
                    onGoto={this.onGoto}
                    updateFavouriteList={this.updateFavouriteList}
                    favouriteList={this.context.bookmarksList}
                  />
                )}
                {this.state.isOpenModal !== undefined && this.state.isOpenModal !== null && this.state.isOpenModal&& this.enableHaruka() == "dialysis" && (
                  <MenuDialModal
                    onCloseModal={this.onCloseModal}
                    onGoto={this.onGoto}
                    updateFavouriteList={this.updateFavouriteList}
                    favouriteList={this.context.bookmarksList}
                  />
                )}

                {this.state.isOpenPaitientListModal && (
                  <DialPatientListModal
                    closeModal={this.onCloseModal}
                    updateFavouriteList={this.updateFavouriteList}
                    favouriteList={this.context.bookmarksList}
                    onGoto={this.onGoto}
                    history = {this.props.history}
                  />
                )}
                {this.state.isSeatModal !== undefined && this.state.isSeatModal !== null && this.state.isSeatModal && (
                  <SeatModal
                    onCloseModal={this.onCloseSeatModal}
                    onGoto={this.onGoto}
                  />
                )}
                {/*<ViewList
              {...this.state.viewList}
              parent={this}
              viewListItems={this.state.viewListItems}
            />*/}
                {this.state.doctors != undefined && canShowModal == 1 && this.context.needSelectDoctor === true ? (
                  <SelectDoctorModal
                    closeDoctor={this.closeDoctor}
                    getDoctor={this.getDoctor}
                    selectDoctorFromModal={this.selectDoctorFromModal}
                    doctors={this.state.doctors}
                  />
                ) : (
                  ""
                )}
                {this.state.needDialSelectDoctor !== false && (
                  <DialSelectMasterModal
                    selectMaster = {this.getDialDoctor}
                    closeModal = {this.closeDoctorSelectModal}
                    MasterCodeData = {this.state.doctors}
                    MasterName = '医師'
                  />
                )}
                {this.state.isOpenDialNewPatient !== false && canShowModal == 1 && (
                  <SystemConfirmJapanModal
                    hideConfirm= {this.confirmCancel.bind(this)}
                    confirmCancel= {this.confirmCancel.bind(this)}
                    confirmOk= {this.confirmNewPatientOk.bind(this)}
                    confirmTitle= {this.state.new_patient_message}
                  />
                )}
              </FlexDial>
            )}
            {this.state.confirm_message !== "" && canShowModal == 1 && (
              <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.confirmOk}
                confirmTitle= {this.state.confirm_message}
                title = {this.state.confirm_alert_title}
                from_source="global"
              />
            )}
          </>
        ) : (
          ""
        )}
        <ConfirmNoFocusModalRef                  
          confirmOk= {this.consentedConfirmOk.bind(this)}
          confirmTitle={"未承認を確認しますか？"}
          title="未承認確認"
          ref = {this.confirm_ref}
        />
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          favouriteMenuId={this.state.favouriteMenuId}
          rightSideTab={this.state.rightSideTab}
        />
        <ContextDialFavouriteMenu
          {...this.state.contextDialMenu}
          parent={this}
          favouriteMenuId={this.state.favouriteMenuId}
          rightSideTab={this.state.rightSideTab}
        />
        <ContextHoverMenu
          {...this.state.hoverMenu}
          parent={this}
        />
        <ContextKarteMenu
          {...this.state.contextKarteMenu}
          parent={this}
          menuItems={this.state.contextMenuItems}
        />
        <ContextUserMenu
          {...this.state.contextUserMenu}
          parent={this}
        />
      </>
    );
  }

}

GlobalNav.contextType = Context;
export default withRouter(GlobalNav);
