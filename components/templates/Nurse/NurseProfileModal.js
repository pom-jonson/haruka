import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import * as apiClient from "~/api/apiClient";
// import {
  // formatDateTimeIE,
  // formatDateLine,
  // formatDateSlash
// } from "~/helpers/date";
import UpdateReasonModal from "~/components/templates/Nurse/profile/UpdateReasonModal";
import ReasonHistoryModal from "~/components/templates/Nurse/profile/ReasonHistoryModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Button from "~/components/atoms/Button";
import NurseProblemListModal from "./NurseProblemListModal";

import ProfileComp from "./profile/ProfileComp";
import Summary from "./profile/Summary";
import HealthManage from "./profile/HealthManage";
import NutrityManage from "./profile/NutrityManage";
import Excretion from "./profile/Excretion";
import Exercise from "./profile/Exercise";
import Rest from "./profile/Rest";
import Perception from "./profile/Perception";
import SelfPerception from "./profile/SelfPerception";
import RoleRelation from "./profile/RoleRelation";
import Gender from "./profile/Gender";
import Stress from "./profile/Stress";
import ValueBelief from "./profile/ValueBelief";
import { getNavigationMenuInfoById } from "~/helpers/commonFunc";
import ShowProfileHistory from "~/components/templates/Nurse/profile/history/ShowProfileHistory";
import Spinner from "react-bootstrap/Spinner";
registerLocale("ja", ja);

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Header = styled.div`
  margin-bottom:4px;
  float:right;
  button{    
    height: 2rem;
    width:6rem;
    font-size: 1rem;
    margin-right:0.5rem;
    padding:0.3rem;
  }
  .cancel-btn {
    background: #ffffff;
    border: solid 2px #7e7e7e;
    span {
      color: #7e7e7e;
    }
  }
  .cancel-btn:hover {
    border: solid 2px #000000;
    background: #ffffff;
    span {
      color: #000000;
    }
  }
`

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 0.9rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .selected {
   background: rgb(105, 200, 225) !important;
 }  
 .disable-btn{
    span{
        color: #888 !important;
    }
 }
 .button-area{
    button {
      height: 2rem;
      width:8rem;
      font-size: 1rem;
      margin-right:0.5rem;
      padding:0.5rem;
      padding-top:0.2rem;
      padding-bottom:0.2rem;
      background: lightgray;
      border: 1px solid;
      span{
        font-size:1rem;
        color:black;
      }
    }
    .cancel-btn {
      background: #ffffff;
      border: solid 1px #7e7e7e;
      span {
        color: #7e7e7e;
      }
    }
    .cancel-btn:hover {
      border: solid 1px #000000;
      background: #ffffff;
      span {
        color: #000000;
      }
    }
    .red-btn {
      background: #cc0000;
      border:1px solid #cc0000;
      span {
        color: #ffffff;
      }
    }
    .red-btn:hover {
      background: #e81123;
      span {
        color: #ffffff;
      }
    }
 }
  .main-title{
    font-weight:bold;
    font-size:1.1rem;
    margin-top:-1.5rem;
    margin-bottom:0rem;
    margin-left:2rem;
    max-width:14rem;
  }
  input[type="text"]{
    padding-top:0!important;
  }
`;

class NurseProfileModal extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let department_codes = [{id:0, value:"全て"}];
    let diagnosis = {};
    departmentOptions.map(department=>{
      department_codes.push(department);
      diagnosis[parseInt(department.id)] = department.value;
    });
    this.change_flag = false;    
    this.general_data = {
      patient_id:this.props.patientId,
      reason_for_renewal:'',
      profile_data:{
        patient_id:this.props.patientId,
        // hospitalization_date:null,
        // hospitalization_time_hour:null,
        // hospitalization_time_minute:null,
        // number_of_hospitalizations:null,
        myself_flag:0,
        spouse_flag:0,
        mother_flag:0,
        father_flag:0,
        children_flag:0,
        brother_flag:0,
        other_flag:0,
        other_children:'',
        other_brother:'',
        other_visitor:'',
        medical_history_id:0,
        key_pearson:'',
        relation:'',
        purpose_of_hospitalization:0,
        respiration:null,
        pulse:this.props.patientInfo.pluse,
        heart_rate:null,
        diastolic_blood_pressure:this.props.patientInfo.max_blood,
        systolic_blood_pressure:this.props.patientInfo.min_blood,
        measurement_prohibited_area:'',
        hospitalization_history:0,
        hospitalization_history_reference:'',
        external_prescription:0,
        external_prescription_reference:'',
        background_of_hospitalization:'',
        // current_medical_history:null,
        remarks:'',
        attention:'',
        consideration_during_treatment:'',
        pressure_sore:0,
        sacral_region_flag:0,
        ischium_flag:0,
        coccyx_flag:0,
        ilium_flag:0,
        greater_trochanter_club_flag:0,
        calcaneus_flag:0,
        pressure_sore_other_flag:0,
        other:'',
        braden_scale:'',
        criteria:0,
        replacement_enforcement_date:null,
        next_scheduled_replacement_date:null,
        towel_lease:0,
        clothing_lease:0,
        hospital_change_source:'',
        hearing_nurse_id:0        
      },
      emergency_contact_data_1:{        
        name_kana_1:'',
        name_1:'',
        relations_1:'',
        remarks_1:''
      },
      emergency_contact_data_2:{
        name_kana_2:'',
        name_2:'',
        relations_2:'',
        remarks_2:''
      },
      emergency_contact_data_3:{        
        name_kana_3:'',
        name_3:'',
        relations_3:'',
        remarks_3:''
      },
      health_data:{
        patient_id:this.props.patientId,
        diagnosis:'',
        doctor_explanation:'',
        the_person_understanding:'',
        family_supporter_understanding:'',
        with_or_without_for_health:0,
        for_health:'',
        coping:'',
        medical_history:'',
        allergy:'',
        infection:'',
        drinking:0,
        frequency_of_drinking:null,
        amount_of_drinking:null,
        drinking_content:'',
        smoking:0,
        number_of_smoking:null,
        years_of_smoking:null,
        blood_transfusion_history:0,
        other:'',
        summary:'',
        confirmation_flag:0,
      },
      excertion_data:{
        patient_id:this.props.patientId,
        number_of_bowel_movements:null,
        defecation_every_other_day:null,
        stool_properties:null,
        last_defecation:null,
        with_or_without_defecation_concomitant_symptoms:0,
        discomfort_flag:0,
        feeling_of_residual_stool_flag:0,
        abdominal_pain_flag:0,
        tactile_sensation_flag:0,
        other_defecation_concomitant_symptoms_flag:0,          
        other_defecation_concomitant_symptoms:'',
        gut_peristalsis:0,
        coping:'',
        laxative_flag:0,
        enema_flag:0,
        suppository_flag:0,
        antidiarrheal_agent_flag:0,
        drug_delivery_remarks:'',
        diapers:0,
        stoma:0,
        urination_frequency_day:null,
        urination_frequency_night:null,
        last_urination:null,
        last_urination_time:null,
        changes_in_urination_status:'',
        urinary_incontinence:0,
        with_or_without_urinary_concomitant_symptoms:0,
        urinary_pressure_flag:0,
        urine_leak_flag:0,
        full_feeling_of_continuation_flag:0,
        residual_urine_flag:0,
        other_urinary_concomitant_symptoms_flag:0,
        other_urinary_concomitant_symptoms:'',
        intermittent_catheterization_flag:0,
        indwelling_catheter_flag:0,
        urinary_tract_change_flag:0,          
        urination_method_remarks:'',
        other:'',
        summary:'',
        confirmation_flag:0,
      },
      exercise_data:{
        patient_id:this.props.patientId,
        breathing_rhythm:0,
        with_or_without_respiratory_symptoms:0,
        breathing_flag:0,
        difficult_flag:0,
        cough_flag:0,
        sputum_flag:0,
        other_respiratory_symptoms_flag:0,
        other_respiratory_symptoms:'',
        abnormal_breath_sounds:0,
        circular_rhythm:0,
        with_or_without_cardiovascular_symptoms:0,
        palpitations:0,
        shortness_of_breath:0,
        chest_pain:0,
        other_cardiovascular_symptoms_flag:0,
        other_cardiovascular_symptoms:'',
        dominant_hand:0,
        with_or_without_range_of_motion:0,
        range_of_motion:'',
        with_or_without_disability:0,
        disability:null,
        paralyzed_area_flag:0,
        defective_site_flag:0,
        contracture_site_flag:0,
        other_parts_flag:0,
        paralysis_site:'',
        defect_site:'',
        contracture_site:'',
        other_site:'',
        meal:0,
        clean:0,
        changing_clothes:0,
        excretion:0,
        move:0,
        rolling_over:0,
        housework:0,
        self_help_devices:'',
        adl_remarks:'',
        with_or_without_exercise_habits:0,          
        exercise_habits:'',
        with_or_without_activity_restrictions:0,
        activity_restrictions:'',
        other:'',
        summary:'',
        confirmation_flag:0,
      },
      perception_data:{
        patient_id:this.props.patientId,
        pupil_r:'',
        pupil_l:'',
        with_or_without_visual_impairment:0,
        visual_impairment_r_flag:0,
        visual_impairment_l_flag:0,
        glasses_flag:0,
        contact_flag:0,
        with_or_without_hearing_impairment:0,
        hearing_impairment_r_flag:0,
        hearing_impairment_l_flag:0,
        hearing_aid_flag:0,
        dizziness_wobbling:0,
        with_or_without_olfactory_disorder:0,
        olfactory_disorder:'',
        with_or_without_taste_disorders:0,
        taste_disorders:'',
        language_disorder:0,
        sign_language_flag:0,
        dial_flag:0,
        written_conversation_flag:0,
        with_or_without_disorientation:0,
        disorientation:null,
        man_flag:0,
        place_flag:0,
        time_flag:0,
        with_or_without_paresthesia:0,
        paresthesia_site:'',
        with_or_without_pain:0,
        pain_site:'',
        how_to_deal_with_pain:'',
        with_or_without_consciousness_disorder:0,
        consciousness_disorder:'',
        with_or_without_cognitive_impairment:0,
        cognitive_impairment:'',
        memory:'',
        judgment_ability:'',
        conversational_ability:'',
        other:'',
        summary:'',
        confirmation_flag:0,
      },
      summary_data:{
        patient_id:this.props.patientId,
        health_perception_health_care_flag:0,
        health_perception_health_care:'',
        nutrition_metabolism_flag:0,
        nutrition_metabolism:'',
        excretion_flag:0,
        excretion:'',
        activity_exercise_flag:0,
        activity_exercise:'',
        sleep_rest_flag:0,
        sleep_rest:'',
        cognition_perception_flag:0,
        cognition_perception:'',
        self_perception_flag:0,
        self_perception:'',
        role_relationship_flag:0,
        role_relationship:'',
        sexual_reproduction_flag:0,
        sexual_reproduction:'',
        coping_stress_resistance_flag:0,
        coping_stress_resistance:'',
        value_belief_flag:0,
        value_belief:'',
        comprehensive_evaluation:'',
        evaluation_at:new Date(),
        confirmation_flag:0,
      },
      self_perception_data:{
        patient_id:this.props.patientId,
        strong_point:'',
        weak_point:'',
        appearance:'',
        change_after_illness:'',
        going_forward:'',
        worries_anxiety:'',
        other:'',
        summary:'',
        confirmation_flag:0,
      },
      nutrition_data:{
        patient_id:this.props.patientId,
        number_of_meals:null,          
        rice_flag:0,
        whole_porridge_flag:0,
        heavy_water_flag:0,
        bread_flag:0,
        other_staple_food_flag:0,
        other_staple_food:'',          
        usually_flag:0,
        soft_vegetables_flag:0,
        shredded_flag:0,
        other_side_dish_flag:0,
        other_side_dish:'',
        with_or_without_eat_between_meals:0,
        eat_between_meals:0,          
        oral_ingestion_flag:0,
        tube_feeding_flag:0,
        gastrostomy_flag:0,
        enteric_fistula_flag:0,
        tpn_flag:0,
        other_ingestion_status_flag:0,
        other_ingestion_status:'',
        moisture:null,
        unbalanced_diet:'',
        appetite:'',
        difficulty_swallowing:'',
        number_of_teeth:null,
        with_or_without_denture:null,          
        full_dentures_flag:0,
        partial_denture_top_flag:0,
        partial_denture_bottom_flag:0,
        insert_tooth_top_flag:0,
        insert_tooth_bottom_flag:0,
        other_denture_flag:0,
        other_denture:'',          
        stomatitis_flag:0,
        vitiligo_teeth_flag:0,
        meat_bleeding_flag:0,
        dry_flag:0,
        other_oral_mucosa_flag:0,
        other_oral_mucosa:'',
        caries:0,
        weight:null,
        height:null,
        weight_change:0,
        weight_change_period:'',
        weight_change_kg:null,
        temperature:null,
        normal_temperature:null,
        usually_color_flag:0,
        pallor_flag:0,
        flush_flag:0,
        yellow_dyeing_flag:0,
        other_complexion_flag:0,
        other_complexion:'',
        skin:'',
        other:'',
        summary:'',
        confirmation_flag:0,
      },
      rest_data:{
        patient_id:this.props.patientId,
        time_of_sleeping:null,
        bedtime:null,
        wake_up_time:null,
        sleep_time:null,
        with_or_without_sleep_interruption:0,
        number_of_sleep_interruptions:null,
        with_or_without_napping_habit:0,
        hours_of_napping:null,
        sleep_state:0,
        reason_for_insomnia:'',
        how_to_deal_with_insomnia:'',
        with_or_without_sleeping_pills:0,
        sleeping_pills_name:'',
        frequency_of_sleeping_pills:0,
        with_or_without_awake_symptoms:0,
        awake_symptoms:'',
        sleepiness_flag:0,
        yawn_flag:0,
        malaise_flag:0,
        other_awake_symptoms_flag:0,
        other_awake_symptoms:'',
        rest_satisfaction:0,
        rest_status_health_:'',
        rest_status_hospitalization:'',
        other:'',
        summary:'',
        confirmation_flag:0,
      },
      role_data:{
        patient_id:this.props.patientId,
        family_diagram:null,
        domestic_role:null,
        decision_making_flag:0,
        source_of_income_flag:0,
        housework_flag:0,
        childcare_flag:0,
        long_term_care_flag:0,
        other_domestic_role_flag:0,
        other_domestic_role:'',
        occupation:'',
        job_description:'',
        job_role:'',
        group_activity:'',
        visit_status:'',
        problem:'',
        with_or_without_financial_concern:0,
        financial_concern:'',
        other:'',
        summary:'',
        confirmation_flag:0,
      },
      gender_data:{
        patient_id:this.props.patientId,
        with_or_without_genital_disease:0,
        genital_disease:'',
        with_or_without_menopause_symptom:0,
        menopause_symptom:'',
        sexual_problem:'',
        menarche_age:null,
        menopause_age:null,
        menstrual_cycle:0,
        menstrual_cycle_days:null,
        menstruation_period_of_days:null,
        menstrual_blood_loss:2,
        with_or_without_abnormal_vaginal_bleeding:0,
        with_or_without_concomitant_symptoms:0,
        concomitant_symptoms:null,
        back_pain_flag:0,
        stomach_ache_flag:0,
        diarrhea_flag:0,
        constipation_flag:0,
        other_concomitant_symptoms_flag:0,
        other_concomitant_symptoms:'',
        use_of_analgesics:0,
        analgesics_name:'',
        number_of_pregnancy:null,
        natural_delivery:null,
        caesarean_section:null,
        spontaneous_abortion:null,
        artificial_abortion:null,
        contraception_method:'',
        other:'',
        summary:'',
        confirmation_flag:0,
      },        
      stress_data:{
        patient_id:this.props.patientId,
        past_stress:'',
        changes_in_the_past:'',
        how_to_deal_with_the_past:'',
        present_stress:'',
        changes_in_the_present:'',
        how_to_deal_with_the_present:'',
        hobby:'',
        adviser:0,
        relationship:'',
        other:'',
        summary:'',
        confirmation_flag:0,
      },
      belief_data:{
        patient_id:this.props.patientId,
        religion:0,
        religious_customs:'',
        lifestyle:'',
        value:'',
        life_goal:'',
        health_relationship:'',
        points_to_remember:'',
        other:'',
        summary:'',
        confirmation_flag:0,
      }
    }
    this.state = {      
      department_codes,      
      diagnosis,
      department_id:0,      
      alert_messages:"",
      complete_message:"",      
      confirm_message:"",
      confirm_type:"",

      isOpenReasonModal:false,
      isUpdateConfirmModal:false,
      isHistoryModal:false,
      isOpenNursePlanModal:false,
      isClearConfirmModal:false,
      isCloseConfirmModal:false,
      isOpenHistoryDetailModal:false,
      comp_num:0,
      title:'プロフィール',

      general_data:JSON.parse(JSON.stringify(this.general_data)),
      is_loaded:false,
    }
  }

  componentDidMount = async() => { 
    this.getHospitalInfo();   
    this.getPatientDiseases();
    this.getHospitalPurposeMaster();
    this.getNurseStaff();
    this.getAllPropfileData();
  }

  getHospitalInfo = async() => {      
    let path = "/app/api/v2/in_out_hospital/in_hospital/get";
    let post_data = {
      patient_id: this.props.detailedPatientInfo.patient[0].system_patient_id,
    };
    await apiClient._post(path, {params: post_data}).then((res) => {
      this.current_disease_id = res.length>0?res[0].hospitalized_disease_name_id:undefined;
      var hospital_datetime = res.length>0?res[0].date_and_time_of_hospitalization:undefined;
      var hospital_date = null;
      var hospital_mins = null;
      var hospital_hour = null;
      if (hospital_datetime != undefined && hospital_datetime != null && hospital_datetime != ''){
        hospital_date = hospital_datetime.split(' ')[0];
        var time_part = hospital_datetime.split(' ')[1];
        hospital_hour = time_part.split(':')[0];
        hospital_mins = time_part.split(':')[1];
      }
      var general_data = this.state.general_data;
      general_data.profile_data.hospitalization_date = hospital_date;
      general_data.profile_data.hospitalization_time_minute = hospital_mins;
      general_data.profile_data.hospitalization_time_hour = hospital_hour;
      general_data.profile_data.number_of_hospitalizations = res.length>0?res.length:null;
      this.setState({        
        general_data,
      })
    })
  }

  getPatientDiseases = async() => {
    let path = "/app/api/v2/disease_name/search_in_patient";
    await apiClient.get(path, {params:{systemPatientId: this.props.patientId}})
    .then(res => {
      if (res.disease_list != undefined && res.disease_list != null && res.disease_list.length > 0){
        var options = [{id:0, value:''}];
        var diseaseName_object = {};
        var current_medical_history;
        res.disease_list.map(item => {          
          if (item.number == this.current_disease_id) current_medical_history = item.disease_name;
          options.push({id:item.number, value:item.disease_name});
          diseaseName_object[item.number] = item.disease_name;
        })
        var general_data = this.state.general_data;
        general_data.profile_data.current_medical_history = current_medical_history;
        this.setState({
          diseaseName_options:options,
          disaseNamses:res.disease_list,
          current_medical_history,
          diseaseName_object,
          general_data
        })
        
      }
    })      
  }
  getHospitalPurposeMaster = async() => {
    let path = "/app/api/v2/master/hospitalization/searchMasterData";
    await apiClient.post(path, {params:{}})
    .then(res => {        
      var options = [{id:0, value:''}];
      if (res.hospitalization_purpose_master.length > 0){
        res.hospitalization_purpose_master.map(item => {
          options.push({id:item.number, value:item.name})
        })
      }
      this.setState({
        hosptial_purpose_master:res.hospitalization_purpose_master,
        hosptial_purpose_master_options:options,        
      })
    })
  }

  getNurseStaff = async() => {
    let path = "/app/api/v2/dial/master/staff/getNurseStaff";
    await apiClient.post(path, {params:{}})
    .then(res => {
      var options = [{id:0, value:''}];
      if (res.length > 0){
        res.map(item => {
          options.push({id:item.number, value:item.name})
        })
      }
      this.setState({
        nurse_staff:res,
        nurse_staff_options:options,        
      })
    })
  }

  getAllPropfileData = async() => {
    let path = "/app/api/v2/nurse/getAllProfileData";
    var post_data = {patient_id:this.props.patientId}
    await apiClient._post(path, {params:post_data})
    .then(res => {
      if (res.emergency_contact != undefined && Object.keys(res.emergency_contact).length > 0){
        this.resetEmergencyContact(res.emergency_contact);
      }
      if (res.data != undefined && res.data.length != 0 && Object.keys(res.data).length > 0){
        this.resetHistoryData(res.data);
        this.setState({
          all_profile_data:res.data
        }, () => {
          var final_key = Object.keys(res.data)[Object.keys(res.data).length -1];
          this.resetData(final_key);
        })
      }
      this.setState({is_loaded:true}, () => {        
      })
    })
    .catch(() => {
      this.setState({is_loaded:true})
    })
  }

  resetEmergencyContact = (data) => {
    var general_data = this.state.general_data;    
    if (data[1] != undefined){
      general_data.emergency_contact_data_1.name_kana_1 = data[1].name_kana;
      general_data.emergency_contact_data_1.name_1 = data[1].name;
      general_data.emergency_contact_data_1.relations_1 = data[1].relations;
      general_data.emergency_contact_data_1.remarks_1 = data[1].remarks!=null?data[1].remarks:'';
      general_data.emergency_contact_data_1.order = 1;      
    }
    if (data[2] != undefined){
      general_data.emergency_contact_data_2.name_kana_2 = data[2].name_kana;
      general_data.emergency_contact_data_2.name_2 = data[2].name;
      general_data.emergency_contact_data_2.relations_2 = data[2].relations;
      general_data.emergency_contact_data_2.remarks_2 = data[2].remarks!=null?data[2].remarks:'';
      general_data.emergency_contact_data_2.order = 2;      
    }
    if (data[3] != undefined){
      general_data.emergency_contact_data_3.name_kana_3 = data[3].name_kana;
      general_data.emergency_contact_data_3.name_3 = data[3].name;
      general_data.emergency_contact_data_3.relations_3 = data[3].relations;
      general_data.emergency_contact_data_3.remarks_3 = data[3].remarks!=null?data[3].remarks:'';
      general_data.emergency_contact_data_3.order = 3;      
    }
    this.setState({general_data})
  }

  resetHistoryData = (res) => {
    var history_data = [];
    Object.keys(res).map(key => {
      history_data.push(res[key].history_data);
    })
    if(history_data != undefined && history_data != null && history_data.length > 0) history_data.reverse();
    this.setState({history_data})
  }

  showHistoryDetailModal = (history_number) => {
    this.closeModal();
    var res = this.state.all_profile_data;    
    if (res == undefined || res == null) return;
    res = res[history_number];    
    this.setState({
      isOpenHistoryDetailModal:true,
      selected_history_data:res,
    })
  }

  resetData = (history_number) => {
    this.closeModal();
    var general_data = this.state.general_data;
    general_data.reason_for_renewal = '';
    var res = this.state.all_profile_data;
    if (res == undefined || res == null) return;
    res = res[history_number];
    Object.keys(general_data.profile_data).map(key => {
      if (res.profile_data[key] != undefined) {
        general_data.profile_data[key] = res.profile_data[key]!=null?res.profile_data[key]:'';
      }
    })
    Object.keys(general_data.health_data).map(key => {
      if (res.health_data[key] != undefined) {
        general_data.health_data[key] = res.health_data[key]!=null?res.health_data[key]:'';
      }
    })
    Object.keys(general_data.excertion_data).map(key => {
      if (res.excertion_data[key] != undefined) {
        general_data.excertion_data[key] = res.excertion_data[key]!=null?res.excertion_data[key]:'';
      }
    })
    Object.keys(general_data.exercise_data).map(key => {
      if (res.exercise_data[key] != undefined) {
        general_data.exercise_data[key] = res.exercise_data[key]!=null?res.exercise_data[key]:'';
      }
    })
    Object.keys(general_data.perception_data).map(key => {
      if (res.perception_data[key] != undefined) {
        general_data.perception_data[key] = res.perception_data[key]!=null?res.perception_data[key]:'';
      }
    })
    Object.keys(general_data.summary_data).map(key => {
      if (res.summary_data[key] != undefined) {
        general_data.summary_data[key] = res.summary_data[key]!=null?res.summary_data[key]:'';
      }
    })
    Object.keys(general_data.self_perception_data).map(key => {
      if (res.self_perception_data[key] != undefined) {
        general_data.self_perception_data[key] = res.self_perception_data[key]!=null?res.self_perception_data[key]:'';
      }
    })
    Object.keys(general_data.nutrition_data).map(key => {
      if (res.nutrition_data[key] != undefined) {
        general_data.nutrition_data[key] = res.nutrition_data[key]!=null?res.nutrition_data[key]:'';
      }
    })
    Object.keys(general_data.rest_data).map(key => {
      if (res.rest_data[key] != undefined) {
        general_data.rest_data[key] = res.rest_data[key]!=null?res.rest_data[key]:'';
      }
    })
      
    Object.keys(general_data.role_data).map(key => {
      if (res.role_data[key] != undefined) {
        general_data.role_data[key] = res.role_data[key]!=null?res.role_data[key]:'';
      }
    })
    Object.keys(general_data.gender_data).map(key => {
      if (res.gender_data[key] != undefined) {
        general_data.gender_data[key] = res.gender_data[key]!=null?res.gender_data[key]:'';
      }
    })
    Object.keys(general_data.stress_data).map(key => {
      if (res.stress_data[key] != undefined) {
        general_data.stress_data[key] = res.stress_data[key]!=null?res.stress_data[key]:'';
      }
    })
    Object.keys(general_data.belief_data).map(key => {
      if (res.belief_data[key] != undefined) {
        general_data.belief_data[key] = res.belief_data[key]!=null?res.belief_data[key]:'';
      }
    })
    this.setState({general_data})
  }

  closeModal=()=>{
    this.setState({      
      isOpenReasonModal:false, 
      isUpdateConfirmModal:false,
      isOpenNursePlanModal:false,
      isHistoryModal:false,
      isClearConfirmModal:false,
      isCloseConfirmModal:false,
      isOpenHistoryDetailModal:false,      
      confirm_message:"",
      confirm_type:"",
    });
  };

  closeAlertModal = () => {
    this.setState({
      alert_messages:"",
    })
  }

  printPdf=()=>{
    if(this.state.hospitalization_list.length > 0 || this.state.discharge_list.length > 0){
      this.setState({complete_message:"印刷中"});
      let path = "/app/api/v2/ward/print/hospitalization_list";
      let print_data = {};
      print_data.hospitalization_list = this.state.hospitalization_list;
      print_data.discharge_list = this.state.discharge_list;
      print_data.discharge_route_master = this.state.discharge_route_master;
      print_data.hospital_room_master = this.state.hospital_room_master;
      print_data.outcome_reason_master = this.state.outcome_reason_master;
      print_data.diagnosis = this.state.diagnosis;
      axios({
        url: path,
        method: 'POST',
        data:{print_data},
        responseType: 'blob', // important
      }).then((response) => {
        this.setState({complete_message:""});
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        if(window.navigator.msSaveOrOpenBlob) {
          //IE11 & Edge
          window.navigator.msSaveOrOpenBlob(blob, '転入・入院_転出・退院予定一覧.pdf');
        }
        else{
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', '転入・入院_転出・退院予定一覧.pdf'); //or any other extension
          document.body.appendChild(link);
          link.click();
        }
      })
        .catch(() => {
          this.setState({
            complete_message:"",
            alert_messages:"印刷失敗",
          });
        })
    } else {
      this.setState({alert_messages:"条件に一致する結果は見つかりませんでした。"});
    }
  };

  setTab = (comp_num, title) => {
    this.setState({
      comp_num,
      title
    })
  }

  openReasonModal = () => {
    this.setState({
      isOpenReasonModal:true,      
    })
  }

  openHistoryModal = () => {
    this.setState({isHistoryModal:true})
  }

  convertKeyNames = (str) => {
    var res = '';
    switch(str){
      case 'health_perception_health_care':
        res = 'health_data';
        break;
      case 'nutrition_metabolism':
        res = 'nutrition_data';        
        break;
      case 'excretion':
        res = 'excertion_data';        
        break;
      case 'activity_exercise':
        res = 'exercise_data';        
        break;
      case 'cognition_perception':
        res = 'perception_data';        
        break;
      case 'sleep_rest':
        res = 'rest_data';        
        break;
      case 'self_perception':
        res = 'self_perception_data';        
        break;
      case 'role_relationship':
        res = 'role_data';
        break;
      case 'sexual_reproduction':
        res = 'gender_data';        
        break;
      case 'coping_stress_resistance':
        res = 'stress_data';        
        break;
      case 'value_belief':
        res = 'belief_data';        
        break;

      case 'health_data':
        res = 'health_perception_health_care';
        break;
      case 'nutrition_data':
        res = 'nutrition_metabolism';
        break;
      case 'excertion_data':
        res = 'excretion';
        break;
      case 'exercise_data':
        res = 'activity_exercise';
        break;
      case 'perception_data':
        res = 'cognition_perception';
        break;
      case 'rest_data':
        res = 'sleep_rest';
        break;
      case 'self_perception_data':
        res = 'self_perception';
        break;
      case 'role_data':
        res = 'role_relationship';
        break;
      case 'gender_data':
        res = 'sexual_reproduction';
        break;
      case 'stress_data':
        res = 'coping_stress_resistance';
        break;
      case 'belief_data':
        res = 'value_belief';
        break;
    }
    return res;
  }

  updateGeneral = (general_data, change_flag = true, sub_key = null, origin_tab = null) => {
    if (change_flag){
      this.change_flag = true;
    }    
    if (sub_key != null){
      var converted_key = this.convertKeyNames(sub_key);
      if (converted_key != ''){
        if (origin_tab == null){
          general_data.summary_data[converted_key] = general_data[sub_key].summary;
          general_data.summary_data[converted_key + '_flag'] = 1;        
        } else {      
          general_data[converted_key].summary = general_data.summary_data[sub_key];
        }
      }
    }    
    this.setState({
      general_data,
    })
  }

  save = () => {
    if (this.state.general_data.reason_for_renewal == undefined || this.state.general_data.reason_for_renewal == null || this.state.general_data.reason_for_renewal == ''){
      this.setState({
        alert_messages:'更新理由を入力して下さい。'
      })      
      return;
    }
    if (this.change_flag == false){
      this.setState({
        alert_messages:'更新内容がありません。'
      })      
      return;
    }
    this.setState({
      isUpdateConfirmModal:true,
      confirm_message:'保存しますか？'
    })
  }
  

  saveConfirm = async() => {
    this.setState({is_loaded:false})
    this.closeModal();
    let path = "/app/api/v2/nurse/registerProfile";
    let post_data = {
      general_data:this.state.general_data,
    }
    await apiClient._post(path, {params:post_data})
    .then(() => {
      this.getAllPropfileData();
      this.change_flag = false;
      this.setState({
        alert_messages:'保存しました。'
      })
    })
    .catch(()=>{
      this.setState({alert_messages:'失敗しました。', is_loaded:true})
    })
  }

  openNursePlanModal = () => {
    this.setState({isOpenNursePlanModal:true})
  }

  clearAll = () => {
    this.setState({
      isClearConfirmModal:true,
      confirm_message:'クリアしますか？'
    })    
  }

  clearConfirm = () => {
    this.closeModal();    
    this.setState({general_data:JSON.parse(JSON.stringify(this.general_data))})
  }

  closeThisModal = () => {
    if (this.change_flag) {
      this.setState({
        isCloseConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title: "入力中",
      });
    } else {
      this.props.closeModal();
    }
  }

  render() {
    // 看護計画(id: 302)
    let permission = true;
    let nursePlan = getNavigationMenuInfoById(302);
    if (nursePlan.is_enabled != 1) {
      permission = false;
    }

    return (
      <>
        <Modal
          show={true}          
          className="custom-modal-sm patient-exam-modal bed-control-modal nurse-profile-modal first-view-modal"
        >
          <Modal.Header>
            <Header>
              <Button className='cancel-btn' style={{marginRight:'10px'}} onClick={this.openHistoryModal.bind(this)}>歴一覧</Button>              
            </Header>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className='button-area'>
                <div className='flex'>
                  <Button onClick={this.openReasonModal.bind(this)}>更新理由</Button>
                  <Button className={this.state.comp_num == 0?'selected':''} onClick={this.setTab.bind(this, 0, 'プロフィール')}>プロフィール</Button>
                  <Button className={this.state.comp_num == 1?'selected':''} onClick={this.setTab.bind(this, 1, 'パターン要約')}>パターン要約</Button>
                  <Button className={this.state.comp_num == 2?'selected':''} onClick={this.setTab.bind(this, 2, '健康知覚-健康管理')}>健康知覚</Button>
                  <Button className={this.state.comp_num == 3?'selected':''} onClick={this.setTab.bind(this, 3, '食物・水分摂取状況')}>栄養-代謝</Button>
                  <Button className={this.state.comp_num == 4?'selected':''} onClick={this.setTab.bind(this, 4, '排泄')}>排泄</Button>
                  <Button className={this.state.comp_num == 5?'selected':''} onClick={this.setTab.bind(this, 5, '活動-運動')}>活動-運動</Button>
                  <Button className={this.state.comp_num == 6?'selected':''} onClick={this.setTab.bind(this, 6, '睡眠-休息')}>睡眠-休息</Button>
                  {this.props.from != "nurseProblemList" && (
                    <>
                      <Button className={permission ? "": "disable-btn"} onClick={permission && this.openNursePlanModal.bind(this)} style={{marginLeft:'6rem'}}>看護計画</Button>
                    </>
                  )}
                </div>
                <div className='flex' style={{paddingLeft:'17rem', marginTop:'3px'}}>
                  <Button className={this.state.comp_num == 7?'selected':''} onClick={this.setTab.bind(this, 7, '認知-知覚')}>認知-知覚</Button>
                  <Button className={this.state.comp_num == 8?'selected':''} onClick={this.setTab.bind(this, 8, '自己知覚-自己概念')}>自己知覚</Button>
                  <Button className={this.state.comp_num == 9?'selected':''} onClick={this.setTab.bind(this, 9, '役割- 関係')}>役割-関係</Button>
                  <Button className={this.state.comp_num == 10?'selected':''} onClick={this.setTab.bind(this, 10, '性- 生殖')}>性-生殖</Button>
                  <Button className={this.state.comp_num == 11?'selected':''} onClick={this.setTab.bind(this, 11, 'コーピング- ストレス耐性')}>コーピング</Button>
                  <Button className={this.state.comp_num == 12?'selected':''} onClick={this.setTab.bind(this, 12, '価値-信念')}>価値-信念</Button>
                  {/* <Button style={{marginLeft:'3rem'}} >印刷</Button> */}
                </div>
              </div>
              <div className='main-title'>{this.state.title}</div>
              {this.state.is_loaded != true && (
                <>
                <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
                </>
              )}
              {this.state.is_loaded == true && (
                <>
                {this.state.comp_num == 0 && this.state.general_data != undefined && (
                  <ProfileComp
                    patientId = {this.props.patientId}
                    patientInfo = {this.props.patientInfo}
                    cache_index = {this.props.cache_index}
                    detailedPatientInfo = {this.props.detailedPatientInfo}
                    general_data = {this.state.general_data}
                    handleGeneralOk = {this.updateGeneral}  
                    nurse_staff_options = {this.state.nurse_staff_options}
                    diseaseName_options = {this.state.diseaseName_options}
                    hosptial_purpose_master_options = {this.state.hosptial_purpose_master_options}
                  />
                )}
                {this.state.comp_num == 1 && (
                  <Summary
                    patientId = {this.props.patientId}
                    patientInfo = {this.props.patientInfo}                  
                    cache_index = {this.props.cache_index}
                    detailedPatientInfo = {this.props.detailedPatientInfo}
                    general_data = {this.state.general_data}
                    handleGeneralOk = {this.updateGeneral}
                  />
                )}
                {this.state.comp_num == 2 && (
                  <HealthManage
                    patientId = {this.props.patientId}
                    patientInfo = {this.props.patientInfo}                  
                    cache_index = {this.props.cache_index}
                    detailedPatientInfo = {this.props.detailedPatientInfo}
                    general_data = {this.state.general_data}
                    handleGeneralOk = {this.updateGeneral}
                  />
                )}
                {this.state.comp_num == 3 && (
                  <NutrityManage
                    patientId = {this.props.patientId}
                    patientInfo = {this.props.patientInfo}
                    cache_index = {this.props.cache_index}
                    detailedPatientInfo = {this.props.detailedPatientInfo}
                    general_data = {this.state.general_data}
                    handleGeneralOk = {this.updateGeneral}
                  />
                )}
                {this.state.comp_num == 4 && (
                  <Excretion
                    patientId = {this.props.patientId}
                    patientInfo = {this.props.patientInfo}
                    cache_index = {this.props.cache_index}
                    detailedPatientInfo = {this.props.detailedPatientInfo}
                    general_data = {this.state.general_data}
                    handleGeneralOk = {this.updateGeneral}
                  />
                )}

                {this.state.comp_num == 5 && (
                  <Exercise
                    patientId = {this.props.patientId}
                    patientInfo = {this.props.patientInfo}
                    cache_index = {this.props.cache_index}
                    detailedPatientInfo = {this.props.detailedPatientInfo}
                    general_data = {this.state.general_data}
                    handleGeneralOk = {this.updateGeneral}
                  />
                )}
                {this.state.comp_num == 6 && (
                  <Rest
                    patientId = {this.props.patientId}
                    patientInfo = {this.props.patientInfo}
                    cache_index = {this.props.cache_index}
                    detailedPatientInfo = {this.props.detailedPatientInfo}
                    general_data = {this.state.general_data}
                    handleGeneralOk = {this.updateGeneral}
                  />
                )}
                {this.state.comp_num == 7 && (
                  <Perception
                    patientId = {this.props.patientId}
                    patientInfo = {this.props.patientInfo}
                    cache_index = {this.props.cache_index}
                    detailedPatientInfo = {this.props.detailedPatientInfo}
                    general_data = {this.state.general_data}
                    handleGeneralOk = {this.updateGeneral}
                  />
                )}

                {this.state.comp_num == 8 && (
                  <SelfPerception
                    patientId = {this.props.patientId}
                    patientInfo = {this.props.patientInfo}
                    cache_index = {this.props.cache_index}
                    detailedPatientInfo = {this.props.detailedPatientInfo}
                    general_data = {this.state.general_data}
                    handleGeneralOk = {this.updateGeneral}
                  />
                )}
                {this.state.comp_num == 9 && (
                  <RoleRelation
                    patientId = {this.props.patientId}
                    patientInfo = {this.props.patientInfo}
                    cache_index = {this.props.cache_index}
                    detailedPatientInfo = {this.props.detailedPatientInfo}
                    general_data = {this.state.general_data}
                    handleGeneralOk = {this.updateGeneral}
                  />
                )}
                {this.state.comp_num == 10 && (
                  <Gender
                    patientId = {this.props.patientId}
                    patientInfo = {this.props.patientInfo}
                    cache_index = {this.props.cache_index}
                    detailedPatientInfo = {this.props.detailedPatientInfo}
                    general_data = {this.state.general_data}
                    handleGeneralOk = {this.updateGeneral}
                  />
                )}
                {this.state.comp_num == 11 && (
                  <Stress
                    patientId = {this.props.patientId}
                    patientInfo = {this.props.patientInfo}                  
                    cache_index = {this.props.cache_index}
                    detailedPatientInfo = {this.props.detailedPatientInfo}
                    general_data = {this.state.general_data}
                    handleGeneralOk = {this.updateGeneral}
                  />
                )}
                {this.state.comp_num == 12 && (
                  <ValueBelief
                    patientId = {this.props.patientId}
                    patientInfo = {this.props.patientInfo}                  
                    cache_index = {this.props.cache_index}
                    detailedPatientInfo = {this.props.detailedPatientInfo}
                    general_data = {this.state.general_data}
                    handleGeneralOk = {this.updateGeneral}
                  />
                )}
                </>
              )}              
              </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className='cancel-btn' onClick={this.clearAll.bind(this)}>クリア</Button>
            <Button className="cancel-btn" onClick={this.closeThisModal}>キャンセル</Button>            
            <Button className='red-btn' onClick={this.save.bind(this)}>確定</Button>            
          </Modal.Footer>          
          {this.state.isOpenReasonModal && (
            <UpdateReasonModal
              closeModal={this.closeModal}
              patientInfo = {this.props.patientInfo}
              patientId = {this.props.patientId}
              cache_index = {this.props.cache_index}
              general_data = {this.state.general_data}
              handleOk = {this.closeModal}
              handleGeneralOk = {this.updateGeneral}
            />
          )}
          {this.state.isHistoryModal && (
            <ReasonHistoryModal
              closeModal={this.closeModal}
              patientId = {this.props.patientId}
              history_data = {this.state.history_data}
              handleOk = {this.showHistoryDetailModal}
            />
          )}
          {this.state.isOpenNursePlanModal && (
            <NurseProblemListModal              
              patientId = {this.props.patientId}
              closeModal={this.closeModal}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeAlertModal}
              handleOk= {this.closeAlertModal}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
          {this.state.isUpdateConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal}
              confirmCancel= {this.closeModal}
              confirmOk= {this.saveConfirm}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isClearConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal}
              confirmCancel= {this.closeModal}
              confirmOk= {this.clearConfirm}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isCloseConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.closeModal.bind(this)}
              confirmCancel={this.closeModal.bind(this)}
              confirmOk={this.props.closeModal}
              confirmTitle={this.state.confirm_message}
              title={this.state.confirm_alert_title}
            />
          )}
          {this.state.isOpenHistoryDetailModal && (
            <ShowProfileHistory
              closeModal = {this.closeModal}
              modal_data = {this.state.selected_history_data}
              patientInfo = {this.props.patientInfo}
              current_medical_history = {this.state.current_medical_history}
              nurse_staff  = {this.state.nurse_staff}
              hosptial_purpose_master = {this.state.hosptial_purpose_master}
              diseaseName_object = {this.state.diseaseName_object}
            />
          )}
        </Modal>

      </>
    );
  }
}

NurseProfileModal.propTypes = {
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  closeModal: PropTypes.func,
  cache_index:PropTypes.number,  
  from:PropTypes.string,  
  detailedPatientInfo : PropTypes.object
};

export default NurseProfileModal;

