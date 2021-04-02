import React, { 
    Component, 
    // useContext
   } from "react";
  import PropTypes from "prop-types";
  import styled from "styled-components";
//   import * as colors from "~/components/_nano/colors";
  import { Modal} from "react-bootstrap";
  import Context from "~/helpers/configureStore";
  import * as apiClient from "~/api/apiClient";
  // import Radiobox from "~/components/molecules/Radiobox";  
  import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";  
  // import InputWithLabel from "~/components/molecules/InputWithLabel";
  import Button from "~/components/atoms/Button";
  // import $ from "jquery";
  import NurseServerityModal from "./NurseServerityModal";
  import {formatJapanDate} from "~/helpers/date";
  import Checkbox from "~/components/molecules/Checkbox";
  import DatePicker, { registerLocale } from "react-datepicker";
  import ja from "date-fns/locale/ja";
  import {makeList_number, setDateColorClassName} from "~/helpers/dialConstants";
  import SystemAlertModal from "~/components/molecules/SystemAlertModal";
  import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
  import {DatePickerBox} from "~/components/styles/DatePickerBox";
  registerLocale("ja", ja);

  const Popup = styled.div`    
    .flex {
      display: flex;
    }
    font-size:1rem;
    height: 96%;
    .nurse-header{
      padding-bottom:3px;
      border-bottom:1px solid;
      .big-label-title{
        padding-top:5px;
        font-size:1rem;
        width:100px;
        text-align:right;
        margin-right:5px;
      }
      .label-title{
        font-size:1rem;
        width:5rem;
        text-align:right;
        margin-right:5px;
        line-height:2rem;
        height:2rem;  
        padding-top:0.2rem;      
      }
      .pullbox-label, .pullbox-select{
        width:12.5rem;
        font-size:1rem;
        margin-right:1.25rem;
        line-height:2rem;
        height:2.2rem;
      }
      .example-custom-input{
        font-size:1.25rem;
        border:1px solid;
        padding:3px;
      }
      .checkbox-area{
        padding-top:5px;
        label{
          font-size:1rem;
        }
        margin-right:2rem;
      }      
    }
    button{
      height:2rem;
    }
    .react-datepicker-popper{
      button {        
        min-width: auto;
        margin-left: 2%;
        height:0;
      }
      .react-datepicker__navigation{
        background:none;
      }
    }
    
    .sub-header{
      padding-top:0.625rem;
      padding-bottom:0.625rem;
      padding-left:3rem;
      .checkbox-area{
        font-size:1rem;
        label{
          margin-right:1.25rem;
        }
        margin-right:2rem;
      }
      button{
        margin-right:0.625rem;
      }      
    }
    .no-border-td{
      border-top:none;
      border-left:noen;
      border-bottom:none;
      width:7.5rem;
    }
    .small-row{
      width:75%;
    }

    .panel-menu {
      width: 100%;
      margin-bottom: 1rem;
      font-weight: bold;
      .menu-btn {
          width:auto;
          text-align: center;
          border-bottom: 1px solid black;
          background-color: rgba(200, 194, 194, 0.22);
          padding: 5px 10px;
          cursor: pointer;
      }
      .active-menu {
          width:auto;
          text-align: center;
          border-top: 1px solid black;
          border-right: 1px solid black;
          border-left: 1px solid black;
          padding: 5px 10px;
      }
      .no-menu {
          width: calc(100% - 35rem);
          border-bottom: 1px solid black;
          background-color: rgba(200, 194, 194, 0.22);
      }
    }
    .work-area{
      overflow-x:scroll;
      overflow-y:auto;
      height: calc(100vh - 36rem);
      .no-break{
        td{
          word-break: keep-all;
        }        
      }
      button{
        height:2rem;
      }
    }
    td{
      label{
        margin:0;
      }
      .label-title{
        display:none;
      }
      .pullbox-label{
        width:7.5rem;
      }
      .pullbox-select{
        width:7.5rem;
        min-width:3rem;
        font-size:1rem;
      }
      vertical-align:middle;
    }
    th{
      word-break: keep-all;
      vertical-align:middle;
    }
    .confirm-area{
      margin-left:2rem;
    }
  `;
  
  class NurseRequireModal extends Component {
    constructor(props) {
      super(props);    
      this.state = {        
        departmentCode:1,        
        number:0,
        tab_id:0,
        isOpenNurseServerityModal:false,

        search_date:this.props.search_date != undefined? this.props.search_date: new Date(),
        selected_ward: this.props.selected_ward != undefined? this.props.selected_ward: '',
        workzone_options:[{id:0, value:''}],
        ward_master:[{id:0, value:"全病棟"}],
        vote_target_master_options:{},
        ward_code_options:{},
        alert_message:'',
        isConfirmModal:false,
        isConfirmClearModal:false,
        confirm_message:''
      }      
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
      this.department_options = {};
      this.departmentOptions.map(department=>{
        this.department_options[parseInt(department.id)] = department.value;
      });
      this.evalution_options = [
        {id:'', value:''},
        {id:1, value:'一般評価票'},
        {id:2, value:'HCU評価票'},
        {id:3, value:'ICU評価票'},
      ];

      this.checked_patients_number = 0;
      this.unchecked_patients_number = 0;

      this.necessary_master = {
        '創傷処置' : 'wound_care',
        '蘇生術の施行': 'enforcement_of_resuscitation',
        '血圧測定' : 'blood_pressure_measurement',
        '時間尿測定': 'time_urine_measurement',
        '呼吸ケア': 'respiratory_care',
        '点滴ライン同時3本以上': 'more_simultaneous_drip_lines',
        '心電図モニタ': 'electrocardiogram_monitor',
        'シリンジポンプ': 'syringe_pump', 
        '輸血や血液製剤': 'blood_transfusion_and_blood_products',
        '抗悪性腫瘍剤の使用':'use_of_antineoplastic_agents',
        '麻薬注射薬の使用':'use_of_narcotic_injection',
        '放射線治療': 'radiation_therapy',
        '免疫抑制剤の使用':'use_of_immunosuppressants',
        '昇圧剤の使用':'use_of_pressor',
        '抗不整脈剤の使用':'use_of_antiarrhythmic_drugs',
        'ドレナージの管理':'drainage_management',
        '無菌治療室での治療':'treatment_in_sterile_treatment_room',
        '座位保持': 'sedentary',
        '移乗':'transfer',
        '口腔清潔':'oral_cleanliness',
        '食事摂取':'food_intake',
        '衣服の着脱':'putting_on_and_taking_off_clothes',
        '診療・療養上の指示が通じる':'medical_instructions_is_ok',
        '危険行動':'dangerous_behavior',
        '骨の手術':'bone_surgery',
        '胸腔鏡・腹腔鏡手術': 'thoracoscopic_and_laparoscopic_surgery',
        '全身麻酔・脊椎麻酔の手術':'anesthesia_surgery',
        '救命等に係る内科的治療':'medical_treatment_for_lifesaving'
      }

      this.necessary_A_fields = [
        'wound_care',
        'enforcement_of_resuscitation',
        'blood_pressure_measurement',
        'time_urine_measurement',
        'respiratory_care',
        'more_simultaneous_drip_lines',
        'electrocardiogram_monitor',
        'syringe_pump', 
        'blood_transfusion_and_blood_products',
        'use_of_antineoplastic_agents',
        'use_of_narcotic_injection',
        'radiation_therapy',
        'use_of_immunosuppressants',
        'use_of_pressor',
        'use_of_antiarrhythmic_drugs',
        'drainage_management',
        'treatment_in_sterile_treatment_room',
      ];
      this.necessary_B_fields = [
        'sedentary',
        'transfer',
        'oral_cleanliness',
        'food_intake',
        'putting_on_and_taking_off_clothes',
        'medical_instructions_is_ok',
        'dangerous_behavior',
      ];
      this.necessary_C_fields = [
        'bone_surgery',
        'thoracoscopic_and_laparoscopic_surgery',
        'anesthesia_surgery',
        'medical_treatment_for_lifesaving'
      ];
    }  
    componentDidMount(){
      this.getSearchResult();
      this.getWorkzoneMaster();
      this.getMaster();
    }

    getSearchResult = async() => {
      let path = "/app/api/v2/nurse/getRequireInfo";
      var search_date = this.state.search_date;
      if (this.state.start_hour != undefined && this.state.start_minutes != undefined){
        search_date.setHours(this.state.start_hour);
        search_date.setMinutes(this.state.start_minutes);
      } else{
        search_date.setHours(0);
        search_date.setMinutes(0);
      }
      var post_data = {
        search_date:search_date,
        ward_id:this.state.selected_ward
      }
      await apiClient.post(path, post_data)
      .then((res) => {
        var total_patients = 0;
        var level_1_patients = 0;
        var level_2_patients = 0;
        var level_3_patients = 0;
        var level_4_patients = 0;
        var level_5_patients = 0;
        var no_level_patients = 0;
        var not_input_patients = 0;

        var icu_count = 0;
        var hcu_count = 0;
        var general_count = 0;
        if (res != undefined && res != null && res.length> 0){
          var selectedPatients = this.props.selectedPatients;          
          if (selectedPatients != undefined && selectedPatients != null && selectedPatients.length > 0){
            var temp = [];
            res.map(item => {
              if (selectedPatients.findIndex(x => parseInt(x.patient_number) == parseInt(item.patient_number)) > -1) temp.push(item);
            })
            res = temp;
          }
          total_patients = res.length;
          res.map(item =>{
            if (item.nursing_need_level_id == null) not_input_patients++;
            if (item.nursing_need_level_id == 1) level_1_patients++;
            if (item.nursing_need_level_id == 2) level_2_patients++;
            if (item.nursing_need_level_id == 3) level_3_patients++;
            if (item.nursing_need_level_id == 4) level_4_patients++;
            if (item.nursing_need_level_id == 5) level_5_patients++;

            if (item.icu_judgment_flag) icu_count++;
            if (item.hcu_judgment_flag) hcu_count++;
            if (item.general_judgment_flag) general_count++;
          })
        }
        this.setState({
          all_data:res,
          data_list:res,
          level_1_patients,
          level_2_patients,
          level_3_patients,
          level_4_patients,
          level_5_patients,
          no_level_patients,
          not_input_patients,
          total_patients,

          icu_count,
          hcu_count,
          general_count
        }, () => {
          this.extractData();
        })
        
      });
    }

    getMaster = async()=> {

      //get ward master
      let path = "/app/api/v2/ward/get/bed_control/master_data";
      await apiClient.post(path, {params: {}})
      .then(res => {
        let ward_master = this.state.ward_master;
        var ward_code_options = this.state.ward_code_options;
        if(res.ward_master.length > 0){
          res.ward_master.map(ward=>{
            ward_master.push({id:ward.number, value:ward.name});
            ward_code_options[ward.number] = ward.ward_code;
          });
        }        
        this.setState({
          ward_master,
          ward_master_data:makeList_number(res.ward_master),
          ward_code_options,
        })
      })

      //get evaluation vote target master
      path = "/app/api/v2/nurse/getEvaluationVoteTargetMaster";
      await apiClient.post(path, {params: {}})
      .then(res => {
        var vote_target_master_options = this.state.vote_target_master_options; 
        if (res != null && res.length != 0){
          Object.keys(res).map(key => {
            vote_target_master_options[key] = (res[key]);
          })          
        }
        this.setState({vote_target_master_options});
      })

      //get nursing need level master
      path = "/app/api/v2/nurse/getNeedLevelMaster";
      await apiClient.post(path, {params: {}})
      .then(res => {
        if (res.length > 0){
          this.setState({
            need_level_master:res,
            need_level_options:makeList_number(res)
          })
        }
      })

    }

    getWorkzoneMaster = async() => {
      let path = "/app/api/v2/ward/get/shift_pattern_master";
      await apiClient.post(path, {})
      .then((res) => {
        if (res.length > 0){
          var workzone_options = this.state.workzone_options;
          res.map(item => {
            workzone_options.push({id:item.number, value:item.name});
          })
          this.setState({
            workzone_data:res,
            workzone_options,
          })
        }
      });
    }
    closeModal = () => {
      this.setState({                
        isOpenNurseServerityModal:false,
      })
    }

    getCategory (e){
      this.setState({select_category_code:e.target.id})
    }

    getDate = (value) => {
      this.setState({
        search_date:value
      }, () => {
        this.getSearchResult();
      })
    }

    getWardInfo = (e) => {
      this.setState({
        selected_ward:e.target.id,
      }, () => {
        this.getSearchResult();
      })
    }

    getPatientInfo = (e) => {
      this.setState({
        selected_patient_id:e.target.id
      })
    }
    switchDisplay = (name, value) => {
      switch(name){
        case 'display_all':
          this.setState({display_all:value})
          break;
        case 'display_absent':
          this.setState({display_absent:value})
          break;
        case 'HCU':
          this.setState({hcu_flag:value}, () => {
            this.extractData();
          })
          break;
        case 'ICU':
          this.setState({icu_flag:value}, () => {
            this.extractData();
          })
          break;
        case 'general':
          this.setState({general_flag:value}, () => {
            this.extractData();
          })
          break;
      }
    }
    
    extractData = () => {
      var all_data = this.state.all_data;
      var data_list = [];
      if (all_data == undefined || all_data == null || all_data.length == 0) {
        this.setState({data_list})
        return;
      }
      if (this.state.hcu_flag != 1 && this.state.icu_flag != 1 && this.state.general_flag != 1){
        this.setState({
          data_list:all_data,          
        }, () => {
          this.sum_by_kind();
        })
        return;
      }
      all_data.map(item => {        
        if (!data_list.includes(item)){
          if (this.state.hcu_flag && this.state.icu_flag && this.state.general_flag){
            if ((this.state.hcu_flag & item.hcu_judgment_flag) & (this.state.icu_flag & item.icu_judgment_flag) & (this.state.general_flag & item.general_judgment_flag)){
              data_list.push(item);
            }
          } else {
            if (this.state.hcu_flag && this.state.icu_flag){
              if ((this.state.hcu_flag & item.hcu_judgment_flag) & (this.state.icu_flag & item.icu_judgment_flag)){
                data_list.push(item);
              }
            } else if(this.state.hcu_flag && this.state.general_flag){
              if ((this.state.hcu_flag & item.hcu_judgment_flag) & (this.state.general_flag & item.general_judgment_flag)){
                data_list.push(item);
              }
            } else if (this.state.icu_flag && this.state.general_flag){
              if ((this.state.icu_flag & item.icu_judgment_flag) & (this.state.general_flag & item.general_judgment_flag)){
                data_list.push(item);
              }
            } else {
              if ((this.state.hcu_flag & item.hcu_judgment_flag) | (this.state.icu_flag & item.icu_judgment_flag) | (this.state.general_flag & item.general_judgment_flag)){
                data_list.push(item);
              }
            }
          }          
        }
      })
      this.setState({data_list}, () => {
        this.sum_by_kind();
      })
    }

    sum_by_kind = () => {      
      var data_list = this.state.data_list;
      if (data_list != undefined && data_list != null && data_list.length > 0){
        this.icu_criteria_sum = 0;
        this.hcu_criteria_sum = 0;
        this.general_criteria_sum = 0;        
        data_list.map(item => {
          item.A_field_point_sum = 0;
          item.B_field_point_sum = 0;
          item.C_field_point_sum = 0;
          this.necessary_A_fields.map(field_name => {
            if (item[field_name] > 0 ) item.A_field_point_sum += item[field_name];
          })
          this.necessary_B_fields.map(field_name => {
            if (item[field_name] > 0 ) item.B_field_point_sum += item[field_name];
          })
          this.necessary_C_fields.map(field_name => {
            if (item[field_name] > 0 ) item.C_field_point_sum += item[field_name];
          })

          // A得点２点以上かつB得点３点以上
          // B項目のうち「B14診療・療養上の指示が通じる」又は「B15危険行動」に該当する患者であって、A得点１点以上かつB得点３点以上
          // A得点３点以上
          // C得点１点以上

          if (item.icu_judgment_flag){
            if ((item.A_field_point_sum >= 2 && item.B_field_point_sum >=3) || item.A_field_point_sum >=3 || item.C_field_point_sum >=1){
              this.icu_criteria_sum++;
            }
          }
          if (item.hcu_judgment_flag){
            if ((item.A_field_point_sum >= 2 && item.B_field_point_sum >=3) || item.A_field_point_sum >=3 || item.C_field_point_sum >=1){
              this.hcu_criteria_sum++;
            }
          }
          if (item.general_judgment_flag){
            if ((item.A_field_point_sum >= 2 && item.B_field_point_sum >=3) || item.A_field_point_sum >=3 || item.C_field_point_sum >=1){
              this.general_criteria_sum++;
            }
          }

        })
      }
      this.setState({data_list});      
    }

    calcCheckedPatients = () => {
      var data_list = this.state.data_list;
      if (data_list == undefined || data_list == null || data_list.length == 0) return;
      this.checked_patients_number = 0;
      this.unchecked_patients_number = 0;
      data_list.map(item => {
        if (item.is_checked){
          this.checked_patients_number++;
        } else {
          this.unchecked_patients_number++;
        }
      })
    }

    setTab = ( e, val ) => {
      this.setState({
          tab_id:parseInt(val),
      });
    };

    openServerity = (item, index) => {
      this.setState({
        isOpenNurseServerityModal : true,
        selected_item : item,
        selected_index : index,
      })
    }

    selectCheckBox = (index, name, value) => {
      var data_list = this.state.data_list;
      data_list[index][name] = value;
      data_list[index].is_changed = true;
      this.setState({data_list})
    }

    getWorkzone = (e) => {
      var workzone_data = this.state.workzone_data;
      var selected_workzone;
      var start_hour;
      var start_minutes;
      if (workzone_data != undefined && workzone_data.length > 0){
        selected_workzone = workzone_data.filter(x => x.number == e.target.id);
        if (selected_workzone.length > 0){
          start_hour = selected_workzone[0].start_hour;
          start_minutes = selected_workzone[0].start_minutes;
        }
      }
      this.setState({
        workzone_id:e.target.id,
        workzone_name:e.target.value,
        start_hour,
        start_minutes,
      }, () => {
        this.getSearchResult();
      })
    }

    getEvaluateFlag = (index, e) => {
      var data_list = this.state.data_list;
      data_list[index].eval_flag = e.target.id;
      this.setState({data_list});
    }

    handleOk = (require_master, from_decision = null) => {
      var selected_item = this.state.selected_item;
      if (from_decision != null){
        selected_item.is_checked = 1;
      }

      if (require_master != undefined && require_master != null){
        Object.keys(require_master).map(nursing_need_classs_id => {
          var item = require_master[nursing_need_classs_id];          
          Object.keys(item).map(nursing_need_master_id => {
            var sub_item = item[nursing_need_master_id];
            Object.keys(sub_item).map(category_id => {
              var row = sub_item[category_id];
              if(row.is_selected){                
                var field_name = this.necessary_master[row.name];
                selected_item[field_name] = row.point;
                if (row.point >= 0){
                  selected_item.is_changed = true;
                }
              }
            })
          })
        })
      }
    }

    save = () => {
      if (this.state.data_list == undefined || this.state.data_list == null || this.state.data_list.length == 0){
        this.setState({alert_message:"登録するデータがありません。"})
        return;
      }
      var check_flag = false;
      this.state.data_list.map(item => {
        if (item.is_changed) check_flag = true;
      })
      if (check_flag == false){
        this.setState({alert_message:'変更されたデータがありません。'});
        return;
      }

      this.setState({
        isConfirmModal:true,
        confirm_message:'看護必要度情報を保存しますか？'
      })
    }

    clearRow = (index) => {
      this.setState({
        isConfirmClearModal:true,
        confirm_message:'この看護必要度情報をクリアしますか？',
        clear_index:index,
      })
    }

    confirmClear = () => {
      this.confirmCancel();
      var data_list = this.state.data_list;
      data_list[this.state.clear_index].is_changed = true;
      Object.keys(this.necessary_master).map(key => {
        var necessary_field_name = this.necessary_master[key];
        data_list[this.state.clear_index][necessary_field_name] = null;
      })
      this.setState({data_list});
    }

    saveRequire = async() => {
      this.confirmCancel();
      let path = "/app/api/v2/nurse/registerRequireInfo";
      await apiClient.post(path, {params:{data_list:this.state.data_list}})
      .then(() => {
        this.setState({alert_message:'看護必要度情報を保存しました。'});
        this.getSearchResult();
      });
    }

    closeAlert = () => {
      this.setState({alert_message:''})
    }

    confirmCancel = () => {
      this.setState({
        confirm_message:'',
        isConfirmModal:false,
        isConfirmClearModal:false,
      })
    }

    movePrev = () => {
      var selected_index = this.state.selected_index;
      if (selected_index == 0) {
        selected_index = this.state.data_list.length - 1;
      } else {
        selected_index--;
      }

      var selected_item = this.state.data_list[selected_index];
      this.setState({
        selected_index,
        selected_item
      })
    }

    moveNext = () => {
      var selected_index = this.state.selected_index;
      if (selected_index == this.state.data_list.length - 1) {
        selected_index = 0;
      } else {
        selected_index++;
      }
      var selected_item = this.state.data_list[selected_index];
      this.setState({
        selected_index,
        selected_item
      })
    }

    sortByLevel = () => {      
      var data_list = this.state.data_list;
      for(var i = 0; i< data_list.length; i++){
        for (var j = i + 1; j < data_list.length; j++){
          if (data_list[i].level_sum < data_list[j].level_sum){
            var temp;
            temp = data_list[i];
            data_list[i] = data_list[j];
            data_list[j] = temp;
          }
        }
      }
      this.setState({data_list});
    }

    calcSum = () => {
      var data_list = this.state.data_list;
      if (data_list == undefined || data_list == null || data_list.length == 0) return;
      data_list.map(item => {
        var level_sum = 0;
        Object.keys(item).map(key => {
          if (this.necessary_A_fields.includes(key) || this.necessary_B_fields.includes(key) || this.necessary_C_fields.includes(key)){
            if (item[key] > 0) level_sum += item[key];
          }
        })
        item.level_sum = level_sum;
      })
    }
  
    render() {
      const ExampleCustomInput = ({ value, onClick }) => (
        <div className="cur-date morning example-custom-input" onClick={onClick}>
            {formatJapanDate(value)}
        </div>
      );
      var workzone_options = this.state.workzone_options;    
      this.calcSum();
      this.calcCheckedPatients();
      return (
        <>
          <Modal
            show={true}
            id="outpatient"
            className="custom-modal-sm patient-exam-modal bed-control-modal first-view-modal"
          >
            <Modal.Header>
              <Modal.Title style={{width:'20rem'}}>看護必要度</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <DatePickerBox style={{width:"100%", height:"100%"}}>
                <Popup>
                  <div className='nurse-header flex'>
                    <label className='big-label-title'>対象日時</label>
                    <DatePicker
                      locale="ja"
                      selected={new Date(this.state.search_date)}
                      onChange={this.getDate.bind(this)}
                      dateFormat="yyyy/MM/dd"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dayClassName = {date => setDateColorClassName(date)}
                      customInput={<ExampleCustomInput />}
                    />
                    <div className='ward-area'>
                      <SelectorWithLabel
                        options={workzone_options}
                        title="勤務帯"
                        getSelect={this.getWorkzone.bind(this)}
                        departmentEditCode={this.state.workzone_id}
                      />
                    </div>
                    <div className='checkbox-area'>
                      <Checkbox
                        label = "不在者表示"
                        getRadio={this.switchDisplay.bind(this)}
                        value={this.state.display_absent}
                        name="display_absent"
                      />
                    </div>
                    <div className='patient-area'>
                      <SelectorWithLabel
                        options={this.state.ward_master}
                        title="表示患者"
                        getSelect={this.getWardInfo.bind(this)}
                        departmentEditCode={this.state.selected_ward}                      
                      />
                    </div>
                    <button onClick={this.sortByLevel.bind(this)}>最大レベル</button>
                  </div>
                  <div className='sub-header flex'>
                    <div className='checkbox-area'>
                      <Checkbox
                        label = "HCU絞り込み"
                        getRadio={this.switchDisplay.bind(this)}
                        value={this.state.hcu_flag}
                        name="HCU"
                      />
                      <Checkbox
                        label = "ICU絞り込み"
                        getRadio={this.switchDisplay.bind(this)}
                        value={this.state.icu_flag}
                        name="ICU"
                      />
                      <Checkbox
                        label = "一般絞り込み"
                        getRadio={this.switchDisplay.bind(this)}
                        value={this.state.general_flag}
                        name="general"
                      />
                    </div>
                  </div>
                  <div className='content-area'>
                    <div className='one-row'>
                      <table className='table table-bordered'>
                        <tr>
                          <td className='no-border-td'>表示患者</td>                        
                          <td className='text-center'>レベル５</td>
                          <td className='text-center'>レベル４</td>
                          <td className='text-center'>レベル３</td>
                          <td className='text-center'>レベル２</td>
                          <td className='text-center'>レベル１</td>
                          <td className='text-center'>不在</td>
                          <td className='text-center'>未入力</td>
                          <td className='text-center'>合計患者数</td>
                        </tr>
                        <tr>
                          <td className='no-border-td'>分類内訳</td>                        
                          <td className='text-center'>{this.state.level_1_patients}</td>
                          <td className='text-center'>{this.state.level_2_patients}</td>
                          <td className='text-center'>{this.state.level_3_patients}</td>
                          <td className='text-center'>{this.state.level_4_patients}</td>
                          <td className='text-center'>{this.state.level_5_patients}</td>
                          <td className='text-center'>{this.state.no_level_patients}</td>
                          <td className='text-center'>{this.state.not_input_patients}</td>
                          <td className='text-center'>{this.state.total_patients}</td>
                        </tr>
                      </table>
                    </div>
                    <div className='flex'>
                      <div className='one-row small-row'>
                        <table className='table table-bordered'>
                          <tr>
                            <td className='no-border-td'></td>
                            <td className='text-center' colSpan='2'>ICU</td>
                            <td className='text-center' colSpan='2'>HCU</td>
                            <td className='text-center' colSpan='2'>一般</td>
                          </tr>
                          <tr>
                            <td className='no-border-td'>基準到達</td>
                            <td className='text-center'>使用数</td>
                            <td className='text-center'>対象</td>
                            <td className='text-center'>使用数</td>
                            <td className='text-center'>対象</td>
                            <td className='text-center'>使用数</td>
                            <td className='text-center'>対象</td>
                          </tr>
                          <tr>
                            <td className='no-border-td'>患者統計</td>
                            <td className='text-center'>{this.state.icu_count}</td>
                            <td className='text-center'>{this.icu_criteria_sum > 0 ? this.icu_criteria_sum: 0}</td>
                            <td className='text-center'>{this.state.hcu_count}</td>
                            <td className='text-center'>{this.hcu_criteria_sum > 0 ? this.hcu_criteria_sum: 0}</td>
                            <td className='text-center'>{this.state.general_count}</td>
                            <td className='text-center'>{this.general_criteria_sum > 0 ? this.general_criteria_sum: 0}</td>
                          </tr>
                        </table>
                      </div>
                      <div className='confirm-area'>                      
                        <table className='table table-bordered'>
                          <tr>
                            <td className='no-border-td'>確認</td>
                            <td className='text-center' style={{width:'5rem'}}>確認</td>
                            <td className='text-center' style={{width:'5rem'}}>未確認</td>
                          </tr>
                          <tr>
                            <td className='no-border-td'>患者合計</td>
                            <td className='text-center' style={{width:'5rem'}}>{this.checked_patients_number}</td>
                            <td className='text-center' style={{width:'5rem'}}>{this.unchecked_patients_number}</td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="panel-menu flex">
                    { this.state.tab_id === 0 ? (
                        <><div className="active-menu">Ａモニタリング及び処置</div></>
                    ) : (
                        <><div className="menu-btn" onClick={e => {this.setTab(e, 0);}}>Ａモニタリング及び処置</div></>
                    )}
                    { this.state.tab_id === 1 ? (
                        <><div className="active-menu">B 患者の状況等</div></>
                    ) : (
                        <><div className="menu-btn" onClick={e => {this.setTab(e, 1);}}>B 患者の状況等</div></>
                    )}
                    { this.state.tab_id === 2 ? (
                        <><div className="active-menu">C 手術等の医学的状況</div></>
                    ) : (
                        <><div className="menu-btn" onClick={e => {this.setTab(e, 2);}}>C 手術等の医学的状況</div></>
                    )}
                    <div className="no-menu"/>
                  </div>
                  <div className="work-area flex">
                  {this.state.tab_id === 0 && (
                    <>
                    <table className='table table-bordered no-break'>
                      <thead>
                        <tr>
                          <th rowSpan = '2'>一括</th>
                          <th rowSpan = '2'>配置</th>
                          <th rowSpan = '2'>氏名</th>
                          <th rowSpan = '2'>年齢</th>
                          <th rowSpan = '2'>性別</th>
                          <th rowSpan = '2'>診療科</th>
                          <th rowSpan = '2'>入力</th>
                          <th rowSpan = '2'> 分類</th>
                          <th rowSpan = '2'>IC</th>
                          <th rowSpan = '2'>HC</th>
                          <th rowSpan = '2'>一般</th>
                          <th rowSpan = '2'>評価票</th>
                          <th rowSpan = '2'>創傷処置（①創傷の処置を除く、<br/>②褥瘡の処置）</th>
                          <th rowSpan = '2'>呼吸ケア（喀痰吸引<br/>のみの場合を除く）</th>
                          <th rowSpan = '2'>点滴ライン同時<br/>3本以上の管理</th>
                          <th rowSpan = '2'>心電図モニター<br/>の管理</th>
                          <th rowSpan = '2'>シリンジポンプ<br/>の管理</th>
                          <th rowSpan = '2'>輸血や血液<br/>製剤の管理</th>
                          <th colSpan='10' style={{textAlign:'center'}}>専門的な治療・処置</th>
                          <th rowSpan='2'>救急搬送後の入院</th>
                        </tr>
                        <tr>
                          <th>抗悪性腫瘍剤の使用<br/>（注射剤のみ）</th>
                          <th>抗悪性腫瘍剤<br/>の内服の管理</th>
                          <th>麻薬注射薬の使用<br/>（注射剤のみ）</th>
                          <th>麻薬の内服・貼付<br/>・坐薬の管理</th>
                          <th>放射線治療</th>
                          <th>免疫抑制剤の管理</th>
                          <th>抗不整脈剤の使用<br/>（注射剤のみ）</th>
                          <th>抗血栓塞栓薬の<br/>持続点滴の使用</th>
                          <th>ドレナージの管理</th>
                          <th>無菌治療室での治療</th>                        
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.data_list != undefined && this.state.data_list != null && this.state.data_list.length > 0 && 
                          this.state.data_list.map((item, index) => {
                            var birthday = item.birthday;
                            var birth_year = birthday.split('-')[0];
                            var age = new Date().getFullYear() - birth_year;
                            return(
                              <>
                                <tr>
                                  <td>
                                    <button onClick = {this.clearRow.bind(this, index)}>クリア</button>
                                  </td>
                                  <td>{this.state.ward_master_data != undefined? this.state.ward_master_data[item.first_ward_id]:''}</td>
                                  <td>{item.patient_name}</td>
                                  <td className='text-center'>{age}</td>
                                  <td>{item.gender==1?'男性':'女性'}</td>
                                  <td>{this.department_options[item.department_id]}</td>
                                  <td>
                                    <button onClick={this.openServerity.bind(this, item, index)}>入力</button>
                                  </td>
                                  <td>{item.nursing_need_level_id > 0 && this.state.need_level_options != undefined ? this.state.need_level_options[item.nursing_need_level_id]:''}</td>
                                  <td>
                                    <Checkbox
                                      label = ""
                                      getRadio={this.selectCheckBox.bind(this, index)}
                                      value={item.icu_judgment_flag}
                                      name="icu_judgment_flag"
                                    />
                                  </td>
                                  <td>
                                    <Checkbox
                                      label = ""
                                      getRadio={this.selectCheckBox.bind(this, index)}
                                      value={item.hcu_judgment_flag}                      
                                      name="hcu_judgment_flag"
                                    />
                                  </td>
                                  <td>
                                    <Checkbox
                                      label = ""
                                      getRadio={this.selectCheckBox.bind(this, index)}
                                      value={item.general_judgment_flag}                      
                                      name="general_judgment_flag"
                                    />
                                  </td>
                                  <td>                                  
                                    {this.state.ward_code_options != {} && 
                                    this.state.vote_target_master_options[this.state.ward_code_options[item.first_ward_id]] != undefined && 
                                    this.state.vote_target_master_options[this.state.ward_code_options[item.first_ward_id]] != {} && (
                                      <>
                                      <SelectorWithLabel
                                        options={this.state.vote_target_master_options[this.state.ward_code_options[item.first_ward_id]]}
                                        title=""
                                        getSelect={this.getEvaluateFlag.bind(this, index)}
                                        departmentEditCode={item.eval_flag}                      
                                      />
                                      </>
                                    )}
                                    
                                  </td>
                                  <td className='text-right'>{item.wound_care}</td>
                                  <td className='text-right'>{item.respiratory_care}</td>
                                  <td className='text-right'>{item.more_simultaneous_drip_lines}</td>
                                  <td className='text-right'>{item.electrocardiogram_monitor}</td>
                                  <td className='text-right'>{item.syringe_pump}</td>
                                  <td className='text-right'>{item.blood_transfusion_and_blood_products}</td>
                                  <td className='text-right'>{item.use_of_antineoplastic_agents}</td>
                                  <td className='text-right'></td>
                                  <td className='text-right'>{item.use_of_narcotic_injection}</td>
                                  <td className='text-right'></td>
                                  <td className='text-right'>{item.radiation_therapy}</td>
                                  <td className='text-right'>{item.use_of_immunosuppressants}</td>	
                                  {/* <td className='text-right'>{item.use_of_pressor}</td> */}
                                  <td className='text-right'>{item.use_of_antiarrhythmic_drugs}</td>
                                  <td className='text-right'></td>
                                  <td className='text-right'>{item.drainage_management}</td>
                                  <td className='text-right'>{item.treatment_in_sterile_treatment_room}</td>
                                  <td className='text-right'></td>
                                </tr>
                              </>
                            )
                          })
                        }
                      </tbody>                    
                    </table>
                    </>
                  )}
                  {this.state.tab_id ==1 && (
                    <>
                      <table className='table table-bordered no-break'>
                        <thead>
                          <tr>
                            <th>一括</th>
                            <th>配置</th>
                            <th>氏名</th>
                            <th>年齢</th>
                            <th>性別</th>
                            <th>診療科</th>
                            <th>入力</th>
                            <th> 分類</th>
                            <th>IC</th>
                            <th>HC</th>
                            <th>一般</th>
                            <th>評価票</th>
                            <th>寝返り</th>
                            <th>移乗</th>
                            <th>口腔清潔</th>
                            <th>食事摂取</th>
                            <th>衣服の着脱</th>
                            <th>診療・療養上の指示が通じる</th>
                            <th>危険行動</th>
                          </tr>
                        </thead>
                        <tbody>
                        {this.state.data_list != undefined && this.state.data_list != null && this.state.data_list.length > 0 && 
                          this.state.data_list.map((item, index) => {
                            var birthday = item.birthday;
                            var birth_year = birthday.split('-')[0];
                            var age = new Date().getFullYear() - birth_year;
                            return(
                              <>
                                <tr>
                                  <td>
                                    <button onClick = {this.clearRow.bind(this, item)}>クリア</button>
                                  </td>
                                  <td>{this.state.ward_master_data != undefined? this.state.ward_master_data[item.first_ward_id]:''}</td>
                                  <td>{item.patient_name}</td>
                                  <td className='text-center'>{age}</td>
                                  <td>{item.gender==1?'男性':'女性'}</td>
                                  <td>{this.department_options[item.department_id]}</td>
                                  <td>
                                    <button onClick={this.openServerity.bind(this, item, index)}>入力</button>
                                  </td>
                                  <td>{item.nursing_need_level_id > 0 && this.state.need_level_options != undefined ? this.state.need_level_options[item.nursing_need_level_id]:''}</td>
                                  <td>
                                    <Checkbox
                                      label = ""
                                      getRadio={this.selectCheckBox.bind(this, index)}
                                      value={item.icu_judgment_flag}                      
                                      name="icu_judgment_flag"
                                    />
                                  </td>
                                  <td>
                                    <Checkbox
                                      label = ""
                                      getRadio={this.selectCheckBox.bind(this, index)}
                                      value={item.hcu_judgment_flag}                      
                                      name="hcu_judgment_flag"
                                    />
                                  </td>
                                  <td>
                                    <Checkbox
                                      label = ""
                                      getRadio={this.selectCheckBox.bind(this, index)}
                                      value={item.general_judgment_flag}                      
                                      name="general_judgment_flag"
                                    />
                                  </td>
                                  <td>
                                    <SelectorWithLabel
                                      options={this.evalution_options}
                                      title=""
                                      getSelect={this.getEvaluateFlag.bind(this, index)}
                                      departmentEditCode={item.eval_flag}                      
                                    />
                                  </td>
                                  <td className='text-right'>{item.sedentary}</td>
                                  <td className='text-right'>{item.transfer}</td>
                                  <td className='text-right'>{item.oral_cleanliness}</td>
                                  <td className='text-right'>{item.food_intake}</td>
                                  <td className='text-right'>{item.putting_on_and_taking_off_clothes}</td>
                                  <td className='text-right'>{item.medical_instructions_is_ok}</td>
                                  <td className='text-right'>{item.dangerous_behavior}</td>
                                </tr>
                              </>
                            )

                          })
                        }
                        </tbody>                      
                      </table>
                    </>
                  )}
                  {this.state.tab_id ==2 && (
                    <>
                    <table className='table table-bordered no-break'>
                      <thead>
                        <tr>
                          <th>一括</th>
                          <th>配置</th>
                          <th>氏名</th>
                          <th>年齢</th>
                          <th>性別</th>
                          <th>診療科</th>
                          <th>入力</th>
                          <th> 分類</th>
                          <th>IC</th>
                          <th>HC</th>
                          <th>一般</th>
                          <th>評価票</th>
                          <th>開頭の手術</th>
                          <th>開胸の手術</th>
                          <th>開腹の手術</th>
                          <th>骨の手術</th>
                          <th>胸腔鏡・腹腔鏡手術</th>
                          <th>全身麻酔・脊椎麻酔の<br/>手術（1から5を除く）</th>
                          <th>救命等に係る<br/>内科的治療</th>
                        </tr>
                      </thead>
                      <tbody>
                      {this.state.data_list != undefined && this.state.data_list != null && this.state.data_list.length > 0 && 
                        this.state.data_list.map((item, index) => {
                          var birthday = item.birthday;
                          var birth_year = birthday.split('-')[0];
                          var age = new Date().getFullYear() - birth_year;
                          return(
                            <>
                              <tr>
                                <td><button onClick = {this.clearRow.bind(this, item)}>クリア</button></td>
                                <td>{this.state.ward_master_data != undefined? this.state.ward_master_data[item.first_ward_id]:''}</td>
                                <td>{item.patient_name}</td>
                                <td className='text-center'>{age}</td>
                                <td>{item.gender==1?'男性':'女性'}</td>
                                <td>{this.department_options[item.department_id]}</td>
                                <td>
                                  <button onClick={this.openServerity.bind(this, item, index)}>入力</button>
                                </td>
                                <td>{item.nursing_need_level_id > 0 && this.state.need_level_options != undefined ? this.state.need_level_options[item.nursing_need_level_id]:''}</td>
                                <td>
                                  <Checkbox
                                    label = ""
                                    getRadio={this.selectCheckBox.bind(this, index)}
                                    value={item.icu_judgment_flag}                      
                                    name="icu_judgment_flag"
                                  />
                                </td>
                                <td>
                                  <Checkbox
                                    label = ""
                                    getRadio={this.selectCheckBox.bind(this, index)}
                                    value={item.hcu_judgment_flag}                      
                                    name="hcu_judgment_flag"
                                  />
                                </td>
                                <td>
                                  <Checkbox
                                    label = ""
                                    getRadio={this.selectCheckBox.bind(this, index)}
                                    value={item.general_judgment_flag}                      
                                    name="general_judgment_flag"
                                  />
                                </td>
                                <td>
                                    <SelectorWithLabel
                                      options={this.evalution_options}
                                      title=""
                                      getSelect={this.getEvaluateFlag.bind(this, index)}
                                      departmentEditCode={item.eval_flag}                      
                                    />
                                </td>
                                <td className='text-right'></td>
                                <td className='text-right'></td>
                                <td className='text-right'></td>
                                <td className='text-right'>{item.bone_surgery}</td>
                                <td className='text-right'>{item.thoracoscopic_and_laparoscopic_surgery}</td>
                                <td className='text-right'>{item.anesthesia_surgery}</td>
                                <td className='text-right'>{item.medical_treatment_for_lifesaving}</td>
                              </tr>
                            </>
                          )
                        })
                      }
                      </tbody>
                    </table>
                    </>
                  )}
                  </div>
                  
                </Popup>
              </DatePickerBox>
            </Modal.Body>
            <Modal.Footer>
                <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
                <Button className="red-btn" onClick={this.save}>確定</Button>
            </Modal.Footer>
          </Modal>
          {this.state.isOpenNurseServerityModal && (
            <NurseServerityModal
              closeModal = {this.closeModal}
              selected_item = {this.state.selected_item}
              ward_master = {this.state.ward_master_data}
              department_options = {this.department_options}
              workzone_name = {this.state.workzone_name}
              need_level_options = {this.state.need_level_options}
              icu_count = {this.state.icu_count}
              hcu_count = {this.state.hcu_count}
              general_count = {this.state.general_count}
              handleOk = {this.handleOk}
              movePrev = {this.movePrev}
              moveNext = {this.moveNext}
              necessary_master = {this.necessary_master}
            />
          )}
          {this.state.alert_message != "" && (
            <SystemAlertModal
              hideModal= {this.closeAlert}
              handleOk= {this.closeAlert}
              showMedicineContent= {this.state.alert_message}
            />
          )}

          {this.state.isConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.saveRequire.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isConfirmClearModal && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmClear.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
        </>
      );
    }
  }
  NurseRequireModal.contextType = Context;
  
  NurseRequireModal.propTypes = {  
    handleOk :  PropTypes.func,
    closeModal: PropTypes.func,
    patientId: PropTypes.number,
    search_date: PropTypes.object,
    selected_ward: PropTypes.number,
    selectedPatients:PropTypes.array
  };
  
  export default NurseRequireModal;
  