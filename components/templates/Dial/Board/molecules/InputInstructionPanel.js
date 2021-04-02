import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as methods from "~/components/templates/Dial/DialMethods";
import InputRegularPrescriptionPanel from "./karteInstruction/InputRegularPrescriptionPanel";
import DialCondition from "./karteInstruction/DialCondition";
import SelectWeekModal from "./karteInstruction/SelectWeekModal";
import SelectDisplayDataModal from "./karteInstruction/SelectDisplayDataModal";
import * as apiClient from "~/api/apiClient";
import {formatDateLine} from "~/helpers/date";
import InputTempararyPrescriptionPanel from "./karteInstruction/InputTempararyPrescriptionPanel";
import InputInjectionPanel from "./karteInstruction/InputInjectionPanel";
import InputInsulin from "./karteInstruction/InputInsulin";
import InputOtherPanel from "./karteInstruction/InputOtherPanel";
import InputTempInspection from "./karteInstruction/InputTempInspection";
import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as localApi from "~/helpers/cacheLocal-utils";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: calc(90vw - 30px);
  height: 100%;
  float: left;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .inline-flex {
    display: inline-flex;
  }
  .selected, .selected:hover{
    background:lightblue!important;      
  }
  .work-area {
    min-height:36rem;
    height: calc(100% - 3rem);
    overflow-y: auto;
  }
  
  th{
    text-align:center;
    background: lightgray;
  }

  .panel-menu {
    width: 100%;
    margin-bottom: 1rem;
    font-weight: bold;
    .menu-btn {
        width:100px;
        text-align: center;
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
        padding: 5px 0;
        cursor: pointer;
    }
    .active-menu {
        width:100px;
        text-align: center;
        border-top: 1px solid black;
        border-right: 1px solid black;
        border-left: 1px solid black;
        padding: 5px 0;
    }
    .no-menu {
        width: calc(100% - 500px);        
        background-color: rgba(200, 194, 194, 0.22);
    }
  }
  .footer {
    float:right;
    margin-right:2rem;
    margin-top:1rem;
    button {
        margin-right: 10px;
        background-color: rgb(38, 159, 191);
        border-color: rgb(38, 159, 191);
        span {
            color: white;
            font-size: 18px;
        }
    }
  }
`;

const weeks = ['日', '月', '火','水','木','金','土'];

class InputInstructionPanel extends Component {
    constructor(props) {
      super(props);
      Object.entries(methods).forEach(([name, fn]) =>
          name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
      );
      let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
      this.state = {
          is_temporary: 0,
          tab_id: 0,          
          is_dial_loaded:false,
          karte_data: this.props.karte_data != undefined? this.props.karte_data:{
            dial:{
                dw:{prev:'', after:''},
                dial_method:{prev:'', after:''},
                dial_method_name:{prev:'', after:''},
                dial_liquid:{prev:'', after:''},
                dial_liquid_name:{prev:'', after:''},
                dialysate_amount:{prev:'', after:''},
                fluid_amount:{prev:'', after:''},
                reservation_time:{prev:'', after:''},
                blood_flow:{prev:'', after:''},
                dial_dialyzer:{prev:'', after:''},
                dial_anti:{prev:'', after:''},
                dilution_timing:{prev:'', after:''},
                fluid_speed:{prev:'', after:''},
                liquid_flow:{prev:'', after:''},
                hdf_step:{prev:'', after:''},
                hdf_init_amount:{prev:'', after:''},
                hdf_init_time:{prev:'', after:''},
                hdf_speed:{prev:'', after:''},                    
                updated_status:0,
                week_days:'',
                start_date:this.props.schedule_date!= undefined? this.props.schedule_date: schedule_date,
                end_date:'',
                days:'',
            },
            regular_prescription:{
                prev:[], after: [], deleted:[]
            },
            temporary_prescription:{prev:[], after:[]},
            injection:{
                prev:'',
                after:'',
                origin:''
            },
            limit_injection:{
                prev:'',
                after:'',
            },
            temporary_injection:{
                prev:'',
                after:'',
            },
            insulin:{
                prev:'',
                after:'',                    
                insulin_injection_list:null,
            },
            temportary_inspection:{
              prev:'',
              after:''
            },
            dial_exist:false,
          },
          
          isCloseConfirmModal:false,
          isSaveConfirmModal:false,
          confirm_message:'',
          confirm_alert_title:'',

          isSelectWeekModal:false,
          isSelectDisplayDataModal:false,
      }
      this.change_flag = false;
      this.edit_weeks_str = '';
      this.recent_dial_data = null;
    }

    async componentDidMount() {
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      let dr_karte_cache = localApi.getObject("dr_karte_cache");
      var dr_karte_instruction_cache = undefined;
      if (dr_karte_cache != undefined && dr_karte_cache != null && authInfo !== undefined && authInfo != null && authInfo.user_number == dr_karte_cache.user_number) {
        dr_karte_instruction_cache = dr_karte_cache.dr_karte_instruction_cache;
      } else {
        dr_karte_cache = {};
      }
      if (this.props.karte_data == undefined && (dr_karte_instruction_cache == undefined || dr_karte_instruction_cache == null)){
          await this.getRecentDialPattern(this.props.patient_id, this.props.schedule_date);
          await this.getPrescriptionInfo();
          await this.getInjectionInfo();
          await this.getInsulinInfoData();
          await this.getRegularInjection();
          await this.getPrescriptionPattern();
          await this.getInspectionSchedule();
          this.setState({is_dial_loaded: true});
      } else {
        if (dr_karte_instruction_cache != undefined && dr_karte_instruction_cache != null){          
          var tab_id = dr_karte_instruction_cache.tab_id;
          var karte_data = dr_karte_instruction_cache.karte_data;
          this.change_flag = dr_karte_instruction_cache.change_flag;
          this.setState({
            tab_id,
            karte_data,
            is_dial_loaded:true
          })          
          this.props.closeCompleteModal();
        } else {
          this.setState({is_dial_loaded:true})
        }
      }      
    }
    
    getRecentDialPattern = async(patient_id, schedule_date) => {
        let path = "/app/api/v2/dial/schedule/getRecentDialData";
        await apiClient
          ._post(path, {
                params: {
                    system_patient_id:patient_id,
                    schedule_date:schedule_date
                }
          })
        .then(res => {
            if (res != null && res !=''){                
                this.recent_dial_data = res;
                if (res.today_schedule_data != null){
                    if (res.today_schedule_data.is_updated == 1){                      
                      this.setState({
                          isSelectDisplayDataModal:true
                      })
                      return;
                    } 
                }
                this.chooseData('pattern');
            }
        })
    };

    chooseData = (type) => {      
        this.closeModal();
        var res = this.recent_dial_data;
        var karte_data = this.state.karte_data;        
        if (type == 'pattern'){
            if (res != null && res != ''){
                karte_data.dial.week_days = res.week_days;
                if (res.dial_method_exist != ''){
                    karte_data.dial.days = this.getSameMethodWeekdays(res.dial_method_exist, res.conditions_data);
                } else {
                    var conditions_data = res.conditions_data;
                    if (conditions_data != undefined || conditions_data != null || Object.keys(conditions_data).length >= 0){
                        var dial_method_temp = '';
                        var check_equal_method_flag = true;
                        Object.keys(conditions_data).map(key=> {
                            var item = conditions_data[key];
                            if (dial_method_temp =='' && item.dial_method >0) dial_method_temp = item.dial_method;
                            if (dial_method_temp != item.dial_method) check_equal_method_flag = false;
                        })
                        if (check_equal_method_flag == false){
                            this.setState({
                                isSelectWeekModal:true,
                                conditions_data,
                            })
                        } else {
                            karte_data.dial.days = this.getSameMethodWeekdays(dial_method_temp, res.conditions_data);
                        }
                    }                    
                }
                if(res.dial_pattern != undefined && res.dial_pattern != null){
                    karte_data.dial.dw.prev = res.dial_pattern.dw;
                    karte_data.dial.dw.after = res.dial_pattern.dw;
                    karte_data.dial.dial_method.prev = res.dial_pattern.dial_method;
                    karte_data.dial.dial_liquid.prev = res.dial_pattern.dial_liquid;
                    karte_data.dial.dial_liquid_name.prev = res.dial_pattern.dial_liquid_name;
                    karte_data.dial.dialysate_amount.prev = res.dial_pattern.dialysate_amount;
                    karte_data.dial.dialysate_amount.after = res.dial_pattern.dialysate_amount;
                    karte_data.dial.fluid_speed.prev = res.dial_pattern.fluid_speed;
                    karte_data.dial.fluid_speed.after = res.dial_pattern.fluid_speed;
                    karte_data.dial.fluid_amount.prev = res.dial_pattern.fluid_amount;
                    karte_data.dial.reservation_time.prev = res.dial_pattern.reservation_time;
                    karte_data.dial.blood_flow.prev = res.dial_pattern.blood_flow;
                    karte_data.dial.blood_flow.after = res.dial_pattern.blood_flow;
                    karte_data.dial.dilution_timing.prev = res.dial_pattern.dilution_timing!=null?res.dial_pattern.dilution_timing:'';
                    karte_data.dial.liquid_flow.prev = res.dial_pattern.liquid_flow;
                    karte_data.dial.hdf_step.prev = res.dial_pattern.hdf_step;
                    karte_data.dial.hdf_step.after = res.dial_pattern.hdf_step;
                    karte_data.dial.hdf_init_amount.prev = res.dial_pattern.hdf_init_amount;
                    karte_data.dial.hdf_init_amount.after = res.dial_pattern.hdf_init_amount;
                    karte_data.dial.hdf_init_time.prev = res.dial_pattern.hdf_init_time;
                    karte_data.dial.hdf_init_time.after = res.dial_pattern.hdf_init_time;
                    karte_data.dial.hdf_speed.prev = res.dial_pattern.hdf_speed;
                    karte_data.dial.hdf_speed.after = res.dial_pattern.hdf_speed;

                    karte_data.dial.dial_method_name.prev = res.dial_pattern.dial_method_name !== undefined && res.dial_pattern.dial_method_name !== null ? res.dial_pattern.dial_method_name : "";
                    // 指示の各種変更の変更前内容で、補液前後の値はNULLでも0として扱うように。2020-08-07
                    let default_array = this.getTelegramDefaultValue(res.dial_pattern.dial_method);
                    if (default_array['dilution_timing']['is_usable'] === 0) {
                        karte_data.dial.dilution_timing.prev = '';
                    }
                    karte_data.dial_exist = true;                    
                }                
                
                karte_data.dial.dial_anti.prev = res.dial_anti !== undefined && res.dial_anti != null ? res.dial_anti : "";
                if (res.dial_anti !== undefined && res.dial_anti != null){
                    karte_data.dial.dial_anti.after = {};
                    karte_data.dial.dial_anti.after.anti_items = [];
                    res.dial_anti.anti_items.map(item => {
                        karte_data.dial.dial_anti.after.anti_items.push({number:item.number, detail_number:item.detail_number,item_code:item.item_code,amount:item.amount,  name:item.name, unit:item.unit});
                    })
                }
                karte_data.dial.dial_dialyzer.prev = res.dial_dialyzer !== undefined && res.dial_dialyzer != null ? res.dial_dialyzer : "";
                karte_data.dial.dial_recent_data = res;
                karte_data.dial.done_flag = false;                
            }            
        } else if (type == 'today'){
            if (res != null && res != ''){
                karte_data.dial.only_today_change = true;
                if(res.today_schedule_data != undefined && res.today_schedule_data != null && res.today_schedule_data.dial_pattern != null){
                    karte_data.dial.dw.prev = res.today_schedule_data.dial_pattern.dw;
                    karte_data.dial.dw.after = res.today_schedule_data.dial_pattern.dw;
                    karte_data.dial.dial_method.prev = res.today_schedule_data.dial_pattern.dial_method;
                    karte_data.dial.dial_liquid.prev = res.today_schedule_data.dial_pattern.dial_liquid;
                    karte_data.dial.dial_liquid_name.prev = res.today_schedule_data.dial_pattern.dial_liquid_name;
                    karte_data.dial.dialysate_amount.prev = res.today_schedule_data.dial_pattern.dialysate_amount;
                    karte_data.dial.dialysate_amount.after = res.today_schedule_data.dial_pattern.dialysate_amount;
                    karte_data.dial.fluid_speed.prev = res.today_schedule_data.dial_pattern.fluid_speed;
                    karte_data.dial.fluid_speed.after = res.today_schedule_data.dial_pattern.fluid_speed;
                    karte_data.dial.fluid_amount.prev = res.today_schedule_data.dial_pattern.fluid_amount;
                    karte_data.dial.reservation_time.prev = res.today_schedule_data.dial_pattern.reservation_time;
                    karte_data.dial.blood_flow.prev = res.today_schedule_data.dial_pattern.blood_flow;
                    karte_data.dial.blood_flow.after = res.today_schedule_data.dial_pattern.blood_flow;
                    karte_data.dial.dilution_timing.prev = res.today_schedule_data.dial_pattern.dilution_timing!=null?res.today_schedule_data.dial_pattern.dilution_timing:'';
                    karte_data.dial.liquid_flow.prev = res.today_schedule_data.dial_pattern.liquid_flow;
                    karte_data.dial.hdf_step.prev = res.today_schedule_data.dial_pattern.hdf_step;
                    karte_data.dial.hdf_step.after = res.today_schedule_data.dial_pattern.hdf_step;
                    karte_data.dial.hdf_init_amount.prev = res.today_schedule_data.dial_pattern.hdf_init_amount;
                    karte_data.dial.hdf_init_amount.after = res.today_schedule_data.dial_pattern.hdf_init_amount;
                    karte_data.dial.hdf_init_time.prev = res.today_schedule_data.dial_pattern.hdf_init_time;
                    karte_data.dial.hdf_init_time.after = res.today_schedule_data.dial_pattern.hdf_init_time;
                    karte_data.dial.hdf_speed.prev = res.today_schedule_data.dial_pattern.hdf_speed;
                    karte_data.dial.hdf_speed.after = res.today_schedule_data.dial_pattern.hdf_speed;

                    karte_data.dial.dial_method_name.prev = res.today_schedule_data.dial_pattern.dial_method_name !== undefined && res.today_schedule_data.dial_pattern.dial_method_name !== null ? res.today_schedule_data.dial_pattern.dial_method_name : "";
                    // 指示の各種変更の変更前内容で、補液前後の値はNULLでも0として扱うように。2020-08-07
                    let default_array = this.getTelegramDefaultValue(res.today_schedule_data.dial_pattern.dial_method);
                    if (default_array['dilution_timing']['is_usable'] === 0) {
                        karte_data.dial.dilution_timing.prev = '';
                    }
                    karte_data.dial_exist = true;
                    karte_data.dial.today_schedule_data = res.today_schedule_data;                    
                }                
                
                karte_data.dial.dial_anti.prev = res.today_schedule_data.dial_anti !== undefined && res.today_schedule_data.dial_anti != null ? res.today_schedule_data.dial_anti : "";
                if (res.today_schedule_data.dial_anti !== undefined && res.today_schedule_data.dial_anti != null){
                    karte_data.dial.dial_anti.after = {};
                    karte_data.dial.dial_anti.after.anti_items = [];
                    res.today_schedule_data.dial_anti.anti_items.map(item => {
                        karte_data.dial.dial_anti.after.anti_items.push({number:item.number, detail_number:item.detail_number,item_code:item.item_code,amount:item.amount,  name:item.name, unit:item.unit});
                    })
                }
                karte_data.dial.dial_dialyzer.prev = res.today_schedule_data.dial_dialyzer !== undefined && res.today_schedule_data.dial_dialyzer != null ? res.today_schedule_data.dial_dialyzer : "";
                karte_data.dial.done_flag = false;                
            }            
        }
    }

    getSameMethodWeekdays = (dial_method, conditions_data) => {
        if (conditions_data == undefined || conditions_data == null || Object.keys(conditions_data).length == 0) return 0;
        var result = 0;
        this.edit_weeks_str = '';
        Object.keys(conditions_data).map(key => {
            var item = conditions_data[key];
            if (item.dial_method == dial_method) {
                result += Math.pow(2, item.day);
                this.edit_weeks_str += weeks[item.day]+'・';
            }
        })
        if (this.edit_weeks_str != ''){
            this.edit_weeks_str = this.edit_weeks_str.substring(0, this.edit_weeks_str.length-1);
            this.edit_weeks_str += '曜日を編集中';
        }        
        return result;
    }

    selectWeek = (cond_data, week_days, week_str) => {
        this.closeModal();        

        var karte_data = this.state.karte_data;
        karte_data.dial.dw.prev = cond_data.dw;
        karte_data.dial.dw.after = cond_data.dw;
        karte_data.dial.dial_method.prev = cond_data.dial_method;
        karte_data.dial.dial_liquid.prev = cond_data.dial_liquid;
        karte_data.dial.dial_liquid_name.prev = cond_data.dial_liquid_name;
        karte_data.dial.dialysate_amount.prev = cond_data.dialysate_amount;
        karte_data.dial.dialysate_amount.after = cond_data.dialysate_amount;
        karte_data.dial.fluid_speed.prev = cond_data.fluid_speed;
        karte_data.dial.fluid_speed.after = cond_data.fluid_speed;
        karte_data.dial.fluid_amount.prev = cond_data.fluid_amount;
        karte_data.dial.reservation_time.prev = cond_data.reservation_time;
        karte_data.dial.blood_flow.prev = cond_data.blood_flow;
        karte_data.dial.blood_flow.after = cond_data.blood_flow;
        karte_data.dial.dilution_timing.prev = cond_data.dilution_timing!=null?cond_data.dilution_timing:'';
        karte_data.dial.liquid_flow.prev = cond_data.liquid_flow;
        karte_data.dial.hdf_step.prev = cond_data.hdf_step;
        karte_data.dial.hdf_step.after = cond_data.hdf_step;
        karte_data.dial.hdf_init_amount.prev = cond_data.hdf_init_amount;
        karte_data.dial.hdf_init_amount.after = cond_data.hdf_init_amount;
        karte_data.dial.hdf_init_time.prev = cond_data.hdf_init_time;
        karte_data.dial.hdf_init_time.after = cond_data.hdf_init_time;
        karte_data.dial.hdf_speed.prev = cond_data.hdf_speed;
        karte_data.dial.hdf_speed.after = cond_data.hdf_speed;
        karte_data.dial.dial_method_name.prev = cond_data.dial_method_name !== undefined && cond_data.dial_method_name !== null ? cond_data.dial_method_name : "";
        karte_data.dial.dial_recent_data.dial_conditions_number = cond_data.number;
        karte_data.dial.dial_recent_data.dial_pattern = cond_data;
                
        karte_data.dial.days = week_days;
        this.edit_weeks_str = week_str;
        this.edit_weeks_str += '曜日を編集中';
        this.setState({karte_data, is_dial_loaded: true});
    }

    getPrescriptionInfo = async () => {
        let path = "/app/api/v2/dial/schedule/prescription_search";
        let schedule_date =this.props.schedule_date;
        if (schedule_date instanceof Date) schedule_date = formatDateLine(schedule_date);
        let post_data = {
            params:{
                patient_id:this.props.patient_id,
                schedule_date,
            },
        };

        await apiClient.post(path, post_data)
            .then((res) => {
                // var regular_prescription_schedule = res.filter(item=>{
                //     if (item.is_temporary !== 1) {
                //         return item;
                //     }
                // });
                var temporary_prescription_schedule = res.filter(item=>{
                    if (item.is_temporary == 1 && item.regular_prescription_number == 0) {
                        return item;
                    }
                });
                let karte_data = this.state.karte_data;
                // karte_data.regular_prescription.prev = regular_prescription_schedule;
                karte_data.temporary_prescription.prev = temporary_prescription_schedule;
                this.setState({
                    karte_data,
                });
            });
    };

    getRegularInjection = async() => {
        let path = "/app/api/v2/dial/schedule/regular_injection_search";
        let post_data = {
            instruct_date: this.props.schedule_date,
            patient_id: this.props.patientInfo.system_patient_id,
        };
        await apiClient.post(path, {params: post_data}).then((res)=>{            
            // var no_limit_inject = res.filter(item=>(item.is_temporary !== 1 && item.time_limit_to == null));
            let karte_data = this.state.karte_data;
            // karte_data.injection.prev = no_limit_inject !== undefined ? no_limit_inject : '';
            karte_data.injection.prev = res.length > 0 ? res : '';
            // karte_data.injection.origin = res.origin;
            this.setState({karte_data});
        });
    }

    getInjectionInfo = async () => {
        let path = "/app/api/v2/dial/schedule/injection_schedule_search";
        let post_data = {
            schedule_date: this.props.schedule_date,
            patient_id: this.props.patientInfo.system_patient_id,
        };
        await apiClient.post(path, {params: post_data}).then((res)=>{
            var temporary_inject = res.filter(item=>item.is_temporary === 1);
            var limit_inject = res.filter(item=>(item.is_temporary !== 1 && item.time_limit_to != null));
            // var no_limit_inject = res.filter(item=>(item.is_temporary !== 1 && item.time_limit_to == null));
            let karte_data = this.state.karte_data;
            // karte_data.injection.prev = no_limit_inject !== undefined ? no_limit_inject : '';
            karte_data.limit_injection.prev = limit_inject !== undefined ? limit_inject : '';
            karte_data.temporary_injection.prev= temporary_inject !== undefined ? temporary_inject : '';
            this.setState({karte_data});
        });
    }

    getInspectionSchedule = async () => {
      let path = "/app/api/v2/dial/schedule/inspection_search";
      let post_data = {
        params: {
          schedule_date: this.props.schedule_date,
          patient_id: this.props.patientInfo.system_patient_id,
          is_temporary: 1,
        },
      };
      await apiClient.post(path, post_data).then((res) => {
        var karte_data = this.state.karte_data;
        karte_data.temportary_inspection.prev = res;        
        this.setState({karte_data})
        this.setInstructionKarte('karte_data', karte_data);
        this.setInstructionKarte('change_flag', this.change_flag);
      });
    };

    getInsulinInfoData = async () => {
        let path = "/app/api/v2/dial/medicine_information/insulin/get";
        const post_data = {
            patient_id:this.props.patientInfo.system_patient_id,
        };
        await apiClient
            .post(path, {
                params: post_data
            })
            .then((res) => {                
                var karte_data = this.state.karte_data;
                if(res.length>0){
                    karte_data.insulin.prev = res;                    
                    this.setState({karte_data});                    
                }
            })
            .catch(() => {
            });
    }

    setInstructionKarte = (name, data) => {
      let dr_karte_cache = localApi.getObject("dr_karte_cache");
      var dr_karte_instruction_cache = undefined;
      if (dr_karte_cache != undefined && dr_karte_cache != null) {
        dr_karte_instruction_cache = dr_karte_cache.dr_karte_instruction_cache;
      } else {
        dr_karte_cache = {};
      }
      if (dr_karte_instruction_cache == undefined || dr_karte_instruction_cache == null) dr_karte_instruction_cache = {};
      dr_karte_instruction_cache[name] = data;
      if (dr_karte_instruction_cache.tab_id == undefined) dr_karte_instruction_cache.tab_id = 0;
      dr_karte_cache.dr_karte_instruction_cache = dr_karte_instruction_cache;
      localApi.setObject("dr_karte_cache", dr_karte_cache);
    }

    setTab = ( e, val ) => {
        let is_temporary = 0;
        if (val == 2) is_temporary = 1;        
        this.setState({
            tab_id:parseInt(val),
            is_temporary,
        });
        
        this.setInstructionKarte('tab_id', parseInt(val));
    };

    handleDialOk = (data) => {
        this.setState({karte_data:data});
        this.change_flag = this.change_flag | data.dial_change_flag;
        this.setInstructionKarte('karte_data', data);
        this.setInstructionKarte('change_flag', this.change_flag);
    }

    handleOk = (data) => {
      this.setState({karte_data:data})
      this.change_flag = true;

      this.setInstructionKarte('karte_data', data);
      this.setInstructionKarte('change_flag', this.change_flag);
    }
    handleRegularOk = (after_data,prev_data, deleted_data, change_status = null) => {      
      let karte_data = this.state.karte_data;
      if(prev_data !== undefined && prev_data != null) karte_data.regular_prescription.prev = prev_data;
      if(after_data !== undefined && after_data != null) karte_data.regular_prescription.after = after_data;
      if(deleted_data !== undefined && deleted_data != null) karte_data.regular_prescription.deleted = deleted_data;

      this.setState({karte_data})
      if (change_status != 'no_change') this.change_flag = true;

      this.setInstructionKarte('karte_data', karte_data);
      this.setInstructionKarte('change_flag', this.change_flag);
    };
    handleInjectionOk = (data) => {
      let karte_data = this.state.karte_data;
      karte_data.injection.after = data;
      this.setState({karte_data})
      this.change_flag = true;

      this.setInstructionKarte('karte_data', karte_data);
      this.setInstructionKarte('change_flag', this.change_flag);
    };
    handleInspectionOk = (data) => {
      let karte_data = this.state.karte_data;
      karte_data.temportary_inspection.after = data;
      this.setState({karte_data})
      this.change_flag = true;

      this.setInstructionKarte('karte_data', karte_data);
      this.setInstructionKarte('change_flag', this.change_flag);
    }
    handleTemporaryOk = (data) => {
      let karte_data = this.state.karte_data;
      // if(data.prev !== undefined) karte_data.temporary_prescription.prev = data.prev;
      karte_data.temporary_prescription.after = data;
      this.setState({karte_data})
      this.change_flag = true;

      this.setInstructionKarte('karte_data', karte_data);
      this.setInstructionKarte('change_flag', this.change_flag);
    };    
    handleOtherOk = (data, is_temporary) => {
      let karte_data = this.state.karte_data;
      if (is_temporary === 1) {
          karte_data.temporary_injection.after = data;
          this.setState({karte_data})
      } else {
          karte_data.limit_injection.after = data;
          this.setState({karte_data})
      }
      this.change_flag = true;

      this.setInstructionKarte('karte_data', karte_data);
      this.setInstructionKarte('change_flag', this.change_flag);
    };

    saveKarte = async() => {      
      this.confirmCancel();
      if (this.props.continue_input === true){
        this.props.saveKarteData(this.state.karte_data);
      }
      this.change_flag = false;
      this.props.closeModal();
    }
    save = async() => {
        if (this.change_flag == false) return;
        this.setState({
          isSaveConfirmModal:true,
          confirm_message:'決定しますか？'
        })
    };

    closeModal = () => {
        this.setState({
            isSelectWeekModal:false,
            isSelectDisplayDataModal:false,
        })
    }

    getPrescriptionPattern = async() => {
        let path = "/app/api/v2/dial/schedule/regular_prescription_search";
        let post_data = {
            params:{
                patient_id:this.props.patient_id,
                schedule_date: formatDateLine(this.props.schedule_date),
                patten_search: 1
            },
        };
        await apiClient.post(path, post_data)
            .then((res) => {
                // this.setState({regular_prescription_pattern:res});
                var karte_data = this.state.karte_data;
                if(res.length>0){
                    karte_data.regular_prescription.prev = res
                    this.setState({
                        karte_data,                        
                    });
                }
            });
    };

    close = () => {
      if (this.change_flag){
        this.setState({
          isCloseConfirmModal:true,
          confirm_message:'決定していない内容があります。\n変更内容を破棄して移動しますか？',
          confirm_alert_title:'入力中'
        })
      } else {
        this.closeThisModal();
      }
    }

    closeThisModal = () => {
      let dr_karte_cache = localApi.getObject("dr_karte_cache");
      dr_karte_cache.dr_karte_instruction_cache = undefined;
      localApi.setObject("dr_karte_cache", dr_karte_cache);
      this.confirmCancel();
      this.props.closeModal();
      this.change_flag = false;
      
    }

    confirmCancel = () => {
      this.setState({
        isCloseConfirmModal:false,
        isSaveConfirmModal:false,
        confirm_message:'',
        confirm_alert_title:'',
      })
    }

    onHide=()=>{};

    render() {
        return  (
            <Modal show={true} onHide={this.onHide}  className="wordPattern-modal master-modal input-panel-modal input-instruction-modal">
                <Modal.Header>
                    <Modal.Title>Drカルテ/各種変更</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className="panel-menu flex">
                            { this.state.tab_id === 0 ? (
                                <><div className="active-menu">透析条件</div></>
                            ) : (
                                <><div className="menu-btn" onClick={e => {this.setTab(e, 0);}}>透析条件</div></>
                            )}
                            { this.state.tab_id === 1 ? (
                                <><div className="active-menu">定期薬</div></>
                            ) : (
                                <><div className="menu-btn" onClick={e => {this.setTab(e, 1);}}>定期薬</div></>
                            )}
                            { this.state.tab_id === 2 ? (
                                <><div className="active-menu">臨時薬</div></>
                            ) : (
                                <><div className="menu-btn" onClick={e => {this.setTab(e, 2);}}>臨時薬</div></>
                            )}
                            { this.state.tab_id === 3 ? (
                                <><div className="active-menu">定期注射</div></>
                            ) : (
                                <><div className="menu-btn" onClick={e => {this.setTab(e, 3);}}>定期注射</div></>
                            )}
                            { this.state.tab_id === 4 ? (
                                <><div className="active-menu">臨時注射</div></>
                            ) : (
                                <><div className="menu-btn" onClick={e => {this.setTab(e, 4);}}>臨時注射</div></>
                            )}
                            { this.state.tab_id === 6 ? (
                                <><div className="active-menu">臨時検査</div></>
                            ) : (
                                <><div className="menu-btn" onClick={e => {this.setTab(e, 6);}}>臨時検査</div></>
                            )}
                            { this.state.tab_id === 5 ? (
                                <><div className="active-menu">インスリン</div></>
                            ) : (
                                <><div className="menu-btn" onClick={e => {this.setTab(e, 5);}}>インスリン</div></>
                            )}
                            <div className="no-menu"/>
                        </div>
                        <div className="work-area w-100">
                            { this.state.tab_id === 0 && (
                                <DialCondition
                                    karte_data = {this.state.karte_data}
                                    is_loaded = {this.state.is_dial_loaded}
                                    handleOk = {this.handleDialOk}
                                    edit_weeks_str = {this.edit_weeks_str}
                                    history = {this.props.history}
                                />
                            )}{ this.state.tab_id === 1 && (
                                <InputRegularPrescriptionPanel
                                    regular_prescription={this.state.karte_data.regular_prescription}
                                    patientInfo={this.props.patientInfo}
                                    schedule_date={this.props.schedule_date}
                                    is_temporary={this.state.is_temporary}
                                    handleRegularOk={this.handleRegularOk}
                                    pattern_data={this.state.regular_prescription_pattern}
                                />
                            )}{ this.state.tab_id === 2 && (
                                <>
                                    <InputTempararyPrescriptionPanel
                                        temporary_prescription={this.state.karte_data.temporary_prescription}
                                        patientInfo={this.props.patientInfo}
                                        schedule_date={this.props.schedule_date}
                                        is_temporary={this.state.is_temporary}
                                        handleTemporaryOk={this.handleTemporaryOk}
                                    />
                                </>
                            )}{ this.state.tab_id === 3 && (
                                <InputInjectionPanel
                                    injection={this.state.karte_data.injection}
                                    patientInfo={this.props.patientInfo}
                                    schedule_date={this.props.schedule_date}
                                    handleInjectionOk={this.handleInjectionOk}
                                    dial_exist = {this.state.karte_data.dial_exist}
                                />
                            )}{ this.state.tab_id === 4 && (
                                <InputOtherPanel
                                    karte_data={this.state.karte_data}
                                    patientInfo={this.props.patientInfo}
                                    schedule_date={this.props.schedule_date}
                                    handleOtherOk={this.handleOtherOk}
                                />
                            )}
                            { this.state.tab_id === 5 && (
                                <InputInsulin
                                    karte_data = {this.state.karte_data}
                                    patientInfo={this.props.patientInfo}
                                    schedule_date={this.props.schedule_date}
                                    handleOk = {this.handleOk}
                                />
                            )}
                            { this.state.tab_id === 6 && (
                                <InputTempInspection
                                    karte_data = {this.state.karte_data}
                                    patientInfo={this.props.patientInfo}
                                    schedule_date={this.props.schedule_date}
                                    handleOk = {this.handleInspectionOk}
                                    staff_list_by_number = {this.props.staff_list_by_number}
                                    staffs = {this.props.staffs}
                                />
                            )}
                        </div>
                    </Wrapper>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel-btn" onClick={this.close}>キャンセル</Button>
                      <Button className={this.change_flag?'red-btn':'disable-btn'} onClick={this.save.bind(this)}>決定</Button>
                </Modal.Footer>
                {this.state.isCloseConfirmModal !== false && (
                  <SystemConfirmJapanModal
                      hideConfirm= {this.confirmCancel.bind(this)}
                      confirmCancel= {this.confirmCancel.bind(this)}
                      confirmOk= {this.closeThisModal.bind(this)}
                      confirmTitle= {this.state.confirm_message}
                      title = {this.state.confirm_alert_title}
                  />
                )}
                {this.state.isSaveConfirmModal !== false && (
                  <SystemConfirmJapanModal
                      hideConfirm= {this.confirmCancel.bind(this)}
                      confirmCancel= {this.confirmCancel.bind(this)}
                      confirmOk= {this.saveKarte.bind(this)}
                      confirmTitle= {this.state.confirm_message}
                  />
                )}
                {this.state.isSelectWeekModal && (
                    <SelectWeekModal
                        handleOk = {this.selectWeek}
                        closeModal = {this.closeModal}
                        conditions_data = {this.state.conditions_data}
                    />
                )}
                {this.state.isSelectDisplayDataModal && (
                    <SelectDisplayDataModal
                        closeModal = {this.closeModal}
                        confirmOk= {this.chooseData.bind(this)}
                    />
                )}
            </Modal>
        );
    }
}

InputInstructionPanel.contextType = Context;

InputInstructionPanel.propTypes = {
    closeModal: PropTypes.func,
    kind:PropTypes.string,
    saveKarteData:PropTypes.func,
    patient_id:PropTypes.number,
    patientInfo:PropTypes.object,
    schedule_date:PropTypes.string,
    item:PropTypes.object,
    source : PropTypes.string,
    handover_relation : PropTypes.number,
    continue_input : PropTypes.bool,
    karte_data:PropTypes.array,
    history:PropTypes.object,
    closeCompleteModal:PropTypes.func,
    staff_list_by_number:PropTypes.object,
    staffs:PropTypes.array
};

export default InputInstructionPanel;
