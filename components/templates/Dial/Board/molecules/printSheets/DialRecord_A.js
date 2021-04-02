import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import {formatJapan,formatDateLine, formatTimeIE, formatDateTimeIE, getDifferentTime} from "~/helpers/date";
import DialChart from "~/components/templates/Dial/Board/molecules/DialChart"
import * as apiClient from "~/api/apiClient";
import {displayLineBreak} from "~/helpers/dialConstants"
// import * as colors from "~/components/_nano/colors";
import {removeLeadZeros} from "~/helpers/dialConstants";
import renderHTML from 'react-render-html';

const Header = styled.div`
    display: block;
    width: 100%;
    font-size:1.25rem;
    .border{border:solid 1px black !important;}
    .border-left{border-left: solid 1px black !important;}
    .border-right {border-right: solid 1px black !important;}
    .border-top {border-top: solid 1px black !important;}
    .border-bottom {border-bottom: solid 1px black !important;}
 `;
const Body = styled.div`
    font-size:16px;
    margin-top: 10px;
    .item{width:15%}    
    .small-td{
        font-size:0.8rem;
        text-align:center;
    }
    .hr-bp {
        position: absolute;
        top: 13px;
        margin-left: 100px;
        z-index: 1
    }
    .print-area-b{
        position: relative;
    }
 `;
const List = styled.div`
    display: block;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 0.8rem;
    width: 100%;
    margin-right: 2%;
    height: 100%;
    overflow-y: auto;
    float: left;
    .w2{width:2.5%;}
    .w5{width:5%;}
    .w10{width:10%;}
    .w13{width:13%;}
    .w14{width:14%;}
    .w15{width:15%;}
    .w20{width:20%;}
    .w25{width:25%;}
    .w30{width:30%;}
    .w35{width:35%;}
    .w40{width:40%;}
    .w50{width:50%;}
    .w55{width:55%;}
    .w60{width:60%;}
    .w70{width:70%;}
    .w80{width:80%;}
    .w100{width:100%;}
    .w90p{width:90px;}
    .w110p{width:110px;}
    .border{border:solid 1px black !important;}
    .border-left{border-left: solid 1px black !important;}
    .border-right {border-right: solid 1px black !important;}
    .border-top {border-top: solid 1px black !important;}
    .border-bottom {border-bottom: solid 1px black !important;}
    .flex{
        display: flex;
        .padding-10{
            padding-left:10px;
            padding-right:10px;
        }
    }
    .mt10{margin-top: 10px;}
    .mt5{margin-top: 5px;}
    .mt15{margin-top: 15px;}
    .mt20{margin-top: 20px;}
    .mt30{margin-top: 30px;}
    .ml10{margin-left: 10px;}
    .mr10{margin-right: 10px;}
    .pt5{padding-top: 5px;}
    .pt10{padding-top: 10px;}
    .pt15{padding-top: 15px;}
    .pt20{padding-top: 20px;}
    table {
        margin-bottom: 0;
        border:1px solid black;
    }
    .table-bordered th, .table-bordered td {
        border: 1px solid #000;
        padding: 3px;
    }
    th{
        font-size: 1rem;
        text-align: center;
        background: lightgray;        
    }
    td{font-size:1rem;}
    .p20{padding: 1.25rem;}
    .p10{padding: 0.62rem;}
    .scroll{overflow-y:auto;}
    .h34{height:35px;}
     @media print{
        .print-area-b{
            width: 80% !important;
        }
    }
    .td-border{
        td {border-left: solid 1px black;}
    }
    .graph_area{
        height: auto;
        border-left: solid 1px black;
        border-right: solid 1px black;
        padding-top: 10px;
        padding-left: 0rem;
    }
    .measure-table td{
        border: 1px solid grey;
        border-right:none;
    }
    .measure-table{
        table-layout: fixed;
        width:100%;
        border:1px solid black;
    }
    .border-thick-table th{
        background: white;
    }
    td{
        word-break:break-all;
        word-wrap:break-word;
        p{
            margin-bottom:0px;
        }
    }
    .top-padding{
      padding-top:2rem;
    }
    .kana-name{
      font-size:10px;
      letter-spacing:2px;
    }
    .title{
        width:6rem;
        border-left:1px solid black!important;
    }
    .unit {
        width: 4rem;
        text-align:center;
    }
    .top-table{
        th{
            border:1px solid #828282;
        }
        td{
            border-left:1px solid #828282;
            border-top:1px solid #828282;
            border-bottom:1px solid #828282;
        }
    }
    `;

class DialRecord_A extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        var graph_table_show = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").graph_table_show;
        this.graph_table_show = graph_table_show;
        this.state={
            graph_data: [],
            list_data: [],
            patientInfo:this.props.patientInfo,
            schedule_data:this.props.schedule_data,
            blood_data:this.props.rows_blood,
            rows_temp: this.props.rows_temp,
            rows_measure: this.props.rows_measure,
            schedule_date:this.props.schedule_date,
        }
        this.ChartRef = React.createRef();
        this.min_x = '';
        this.time_series = [];
        this.display_measure_data = [];
        this.td_count = [];
        for(var i = 0; i < (this.props.x_range != undefined ? this.props.x_range : 8 ); i++) {
            this.td_count.push(i);
        }

        this.measure_display_first_time = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").measure_display_first_time;
        this.measure_display_period_offset = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").measure_display_period_offset;
        this.measure_display_period = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").measure_display_period;
        this.dial_init_machine_get_time = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").dial_init_machine_get_time;
        if (this.measure_display_first_time == undefined) this.measure_display_first_time = 300;
        if (this.measure_display_period_offset == undefined) this.measure_display_period_offset = 0;
        if (this.measure_display_period == undefined) this.measure_display_period = 60;
        if (this.dial_init_machine_get_time == undefined) this.dial_init_machine_get_time = 30;
    }

    setMinX = (min, value) => {
        if (min == '') return value;        
        if (typeof min == 'string') min = min.split("-").join("/");
        if (typeof value == 'string') value = value.split("-").join("/");        
        if (new Date(min).getTime() > new Date(value).getTime()) return new Date(value);
        return new Date(min);
    }

    initialize(){
        let patientInfo = this.props.patientInfo;
        if(patientInfo == undefined || patientInfo == null){
            return;
        }
        this.getSoapInfo();        
        this.getInjectionInfo();
        this.getInspectionInfo();
        this.getStaffs();
        this.getCurDiseaseInfo();
        this.getInstructionInfo();
        this.getDoctors();
        this.getVARecordInfo();

        let temperature_data = this.props.rows_temp;
        let blood_data = this.props.rows_blood;
        let measure_data = this.props.rows_measure;
        this.setGraphListData(blood_data, measure_data, temperature_data);
        
        let {schedule_data} = this.props;
        let props_start_time = "";
        let props_end_time = "";
        let pass_time = "";

        if (schedule_data !== undefined){
            if (schedule_data.start_date != undefined && schedule_data.start_date != null && schedule_data.start_date != ''){
                props_start_time = formatTimeIE(schedule_data.start_date);
            } else {
                if (schedule_data.console_start_date != undefined && schedule_data.console_start_date != null && schedule_data.console_start_date != ''){
                    props_start_time = formatTimeIE(schedule_data.console_start_date);
                }
            }
            if (schedule_data.end_date != undefined && schedule_data.end_date != null && schedule_data.end_date != ''){
                props_end_time = formatTimeIE(schedule_data.end_date);
            } 
            // else {
            //     if (schedule_data.console_end_date != undefined && schedule_data.console_end_date != null && schedule_data.console_end_date != ''){
            //         props_end_time = formatTimeIE(schedule_data.console_end_date);
            //     }
            // }
            pass_time = this.getPassTime(props_end_time,props_start_time);
        }
        this.setState({            
            props_end_time,
            props_start_time,
            pass_time,
            patientInfo:this.props.patientInfo,
            schedule_date:this.props.schedule_date,
            schedule_data:this.props.schedule_data,
        });        
    }

    componentDidMount() {
        this.initialize();    
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.state.patientInfo.system_patient_id == nextProps.patientInfo.system_patient_id && this.state.schedule_date == nextProps.schedule_date &&
           this.state.schedule_data.number == nextProps.schedule_data.number ) return;

        this.initialize();
    }
    
    setGraphListData = (blood_data, measure_data, temperature_data) =>{
        this.min_x = '';
        let graph_data = [
            { values: [], label: "脈拍"},
            { values: [], label: "最低血圧"},
            { values: [], label: "最高血圧"},
            // { values: [], label: "除水量"},
            { values: [], label: "体温"},
        ];
        let list_data = [];
        if (temperature_data != undefined && temperature_data != null && temperature_data.length > 0) {
            let filteredArr = temperature_data.reduce((acc, current) => {
                const x = acc.find(item => (item.input_time === current.input_time));
                if (!x) {
                    return acc.concat([current]);
                } else {
                    return acc;
                }
            }, []);
            filteredArr.map(item => {
                let time = item.input_time;
                // let temperature_value = {x: time, y: 10, indexLabel:parseFloat(item.temperature).toFixed(1) + "℃", indexLabelFontColor:item.temperature >37.5 ? "red":colors.temperatureLineColor};
                let temperature_value = {x: time, y: 10, indexLabel:parseFloat(item.temperature).toFixed(1) + "℃", indexLabelFontColor:item.temperature >37.5 ? "black":'black'};
                graph_data[3].values.push(temperature_value);
                this.min_x = this.setMinX(this.min_x, formatDateTimeIE(time));
            });
        }
        if (blood_data != undefined && blood_data != null && blood_data.length > 0) {
            let filteredArr = blood_data.filter(item=>{
                if (item.is_enabled === 1) {
                    return item;
                }
            });
            filteredArr.map(item => {
                let time = item.input_time;
                let pulse_add_value = {x: time, y: parseInt(item.bp_pulse)};
                let blood_add_min_value = {x:time, y: parseInt(item.bp_pressure_min)};
                let blood_add_max_value = {x:time, y: parseInt(item.bp_pressure_max)};

                graph_data[0].values.push(pulse_add_value);
                graph_data[0].markerColor = 'black';
                graph_data[0].lineColor = 'black';
                graph_data[1].values.push(blood_add_min_value);
                graph_data[1].markerColor = 'black';
                graph_data[1].lineColor = 'black';
                graph_data[2].values.push(blood_add_max_value);
                graph_data[2].markerColor = 'black';
                graph_data[2].lineColor = 'black';
                this.min_x = this.setMinX(this.min_x, formatDateTimeIE(time));
            });            
        }
        if (measure_data !== undefined && measure_data !== null){            
            measure_data.map((item) => {
                let time = item.input_time;                
                list_data.push({
                    input_time: time,
                    ms_number:item.ms_number,
                    ms_blood_cur_flow:item.ms_blood_cur_flow,
                    ms_venous_pressure:item.ms_venous_pressure,
                    ms_fluid_pressure:item.ms_fluid_pressure,
                    ms_cur_drainage:item.ms_cur_drainage,
                    ms_dialysate_cur_temperature:item.ms_dialysate_cur_temperature,
                    ms_drainage_cur_speed:item.ms_drainage_cur_speed,
                    ms_target_drainage:item.ms_target_drainage,
                    ms_fluid_speed:item.ms_fluid_speed,
                    ms_fluid_cur_amount:item.ms_fluid_cur_amount,
                    ms_hdf_count:item.ms_hdf_count,
                    ms_hdf_amount:item.ms_hdf_amount,
                    ms_blood_target_flow:item.ms_blood_target_flow,
                    ms_syringe_speed:item.ms_syringe_speed,
                    ms_syringe_value:item.ms_syringe_value,
                    ms_dialysate_target_temperature:item.ms_dialysate_target_temperature,
                    ms_dialysate_target_concentration:item.ms_dialysate_target_concentration,
                    ms_dialysate_cur_concentration:item.ms_dialysate_cur_concentration,
                    ms_dializer_pressure:item.ms_dializer_pressure,
                    ms_arterial_pressure:item.ms_arterial_pressure,
                    ms_fluid_target_amount:item.ms_fluid_target_amount,
                    ms_fluid_target_temperature:item.ms_fluid_target_temperature,
                    ms_fluid_cur_temperature:item.ms_fluid_cur_temperature,
                    ms_emergency_amount:item.ms_emergency_amount,
                    ms_tmp:item.ms_tmp,
                });
            });
        }
        this.setState({
            graph_data: graph_data,
            list_data:list_data,
        });
    };
    getInjectionInfo = async() => {
        let schedule_date = this.props.schedule_date;
        let patientInfo = this.props.patientInfo;

        let path = "/app/api/v2/dial/schedule/injection_schedule_search";
        let post_data = {
            params:{"schedule_date":schedule_date, "patient_id":patientInfo !== undefined && patientInfo.system_patient_id},
        };
        await apiClient.post(path, post_data)
            .then((res) => {
                this.setState({injection:res});
            });
    };

    getVARecordInfo = async() => {
        let patientInfo = this.props.patientInfo;
        if(patientInfo == undefined || patientInfo == null || patientInfo.system_patient_id == undefined){
            return;
        }
        let schedule_date = this.props.schedule_date;
        if (schedule_date == undefined || schedule_date == null || schedule_date == "") return ;
        let path = "/app/api/v2/dial/medicine_information/VARecord/searchByDate";
        await apiClient
            ._post(path, {
                params: {
                    patient_id:patientInfo.system_patient_id,
                    schedule_date,
                }
            })
            .then((res) => {
                this.setState({
                    showImage: res
                });
            })
            .catch(() => {
                this.setState({showImage:undefined})
            })
    };

    getDisease = async() =>{
        let schedule_date = this.props.schedule_date;
        let patientInfo = this.props.patientInfo;

        let path = "/app/api/v2/dial/medicine_information/getDiseaseHistory";
        const post_data = {
            patient_id:patientInfo.system_patient_id,
            end_date:formatDateLine(schedule_date),
            get_last:1
        };
        await apiClient
            .post(path, {
                params: post_data
            })
            .then(res=>{
                this.setState({disease_name : res.name})
            })
    }

    getInspectionInfo = async() => {
        let schedule_date = this.props.schedule_date;
        let patientInfo = this.props.patientInfo;

        let path = "/app/api/v2/dial/schedule/inspection_search";
        let post_data = {
            params:{"schedule_date":schedule_date, "patient_id":patientInfo !== undefined && patientInfo.system_patient_id},
        };
        await apiClient.post(path, post_data)
            .then((res) => {
                this.setState({inspection:res});
            });
    };
    getSoapInfo = async() => {
        let patientInfo = this.props.patientInfo;
        let schedule_date = this.props.schedule_date;
        if(patientInfo === undefined || patientInfo == null){
            return;
        }
        let path = "/app/api/v2/dial/board/Soap/search";
        await apiClient
            ._post(path, {
                params: {
                    is_enabled:1,
                    system_patient_id: patientInfo.system_patient_id,
                    date: schedule_date
                }
            })
            .then((res) => {
                if (res.length != 0){
                    this.setState({
                        treat_monitor_list:res,
                    })
                } else {
                    this.setState({
                        treat_monitor_list:[],

                    })
                }
            })
            .catch(() => {

            });
    };

    checkSO = (category_2) => {
        if((category_2 =='S') || category_2 =="O" || category_2 =="A") return true;
        else return false;
    };
    
    getPassTime(first_dt, second_dt){
        if (first_dt == null || first_dt == "" || second_dt == null || second_dt == "") return "";
        first_dt = formatDateTimeIE(first_dt)
        second_dt = formatDateTimeIE(second_dt)
        var diff = getDifferentTime(first_dt, second_dt);
        var diff_second = Math.floor(diff / 1000);
        var diff_min =  Math.floor(diff_second / 60);
        var diff_hour = 0;
        if(diff_min >= 60) {
            diff_hour = Math.floor(diff_min / 60);
        }
        var temp = '';
        diff_min = diff_min % 60;
        if(parseInt(diff_min) < 10) {
            temp = parseInt(diff_min);
            diff_min = "0" + temp.toString();
        }
        if(parseInt(diff_hour) < 10) {
            temp = parseInt(diff_hour);
            diff_hour = "0" + temp.toString();
        }
        return diff_hour + ":" + diff_min;
    }

    removeLabel = (value) => {
        let replace_array = ["(S)","(O)","(A)","(P)","（提示）","(経過)","(指示)","(所見)","(定期)","(臨時)","(臨検 追加)","(臨注)","(臨検 変更) ","（臨処）"];
        replace_array.forEach(item=>{
            value = value.replace(item, "");
        });
        return value;
    };

    makeTimeListMeasure(start_time, range_hours){
        if (start_time == undefined || start_time == null || start_time =='') return;    
        var temp = this.state.list_data;
        this.time_series = [];        
        this.display_measure_data = [];
        start_time = new Date(start_time);               
        var proportion = 2;
        for (var i = 0;i<range_hours*proportion;i++){
            this.time_series.push(start_time.getTime()+ i *30*60*1000);
        }        
        var final_time_limit = start_time.getTime() + range_hours*60*60*1000;        
        var interval_measure = 1;
        if (this.measure_display_period == 60) interval_measure = 2;      
        var input_time_temp;
        var offset_time = this.measure_display_period_offset;
        this.time_series[0] = this.time_series[0] + this.measure_display_first_time * 1000 + offset_time * 1000;
        //---------------make even measure data----------------------------------------
        for(i = 0; i < range_hours*proportion; i = i + interval_measure){
          for (var j = temp.length - 1;j >= 0 ; j--){
            if (typeof temp[j].input_time == 'string') temp[j].input_time = temp[j].input_time.split("-").join("/");
            input_time_temp = new Date(temp[j].input_time).getTime();
            if (i == 0 && temp[j].ms_number == 0) input_time_temp += this.measure_display_first_time * 1000;

            if (input_time_temp >= this.time_series[i] - offset_time * 1000 && input_time_temp < final_time_limit){
              if (this.time_series[i+interval_measure] > 0){
                if (input_time_temp < this.time_series[i+interval_measure] - offset_time * 1000){
                    if (i == 0){
                        if (input_time_temp < start_time.getTime() + this.dial_init_machine_get_time * 60 * 1000 - offset_time * 1000){
                          this.display_measure_data[i] = temp[j];  
                        }
                      } else {
                        this.display_measure_data[i] = temp[j];
                      }
                }
              } else {
                if (i == 0){
                    if (input_time_temp < start_time.getTime() + this.dial_init_machine_get_time * 60 * 1000 - offset_time * 1000){
                      this.display_measure_data[i] = temp[j];  
                    }
                  } else {
                    this.display_measure_data[i] = temp[j];
                  }
              }
            } 
          }
        }
        //----------------------------------------------------------------------------
        //---------------make odd measure data----------------------------------------
        if (interval_measure == 2){
          for(i = 1; i < range_hours*proportion; i = i + interval_measure){
            for (j = temp.length - 1;j >= 0 ; j--){
              if (typeof temp[j].input_time == 'string') temp[j].input_time = temp[j].input_time.split("-").join("/");
              input_time_temp = new Date(temp[j].input_time).getTime();
              if (this.display_measure_data[i-1] != undefined && input_time_temp < final_time_limit){
                var criteria_time = this.display_measure_data[i-1].input_time;
                if (typeof criteria_time == 'string') criteria_time = criteria_time.split("-").join("/");
                criteria_time = new Date(criteria_time).getTime();
                if (input_time_temp > criteria_time){
                  if (this.time_series[i+1] > 0){
                    if (input_time_temp < this.time_series[i+1] - offset_time * 1000){
                      this.display_measure_data[i] = temp[j];
                    } 
                  } else {
                    this.display_measure_data[i] = temp[j];
                  }
                }
              }
            }
          }
        }
        //----------------------------------------------------------------------------      
        //---------------make second element of display measure data------------------------
        if (this.dial_init_machine_get_time < 60){
            this.display_measure_data[1] = undefined;
            var second_element_criteria_time_min = start_time.getTime() + this.dial_init_machine_get_time * 60 * 1000 - offset_time * 1000;
            var second_element_criteria_time_max = start_time.getTime() + 60 * 60 * 1000 - offset_time * 1000;
            for (j = temp.length - 1;j >= 0 ; j--){
              if (typeof temp[j].input_time == 'string') temp[j].input_time = temp[j].input_time.split("-").join("/");
              input_time_temp = new Date(temp[j].input_time).getTime();
              if (input_time_temp >= second_element_criteria_time_min && input_time_temp < second_element_criteria_time_max && input_time_temp < final_time_limit){
                if (this.display_measure_data[0] != undefined){              
                  if (input_time_temp > new Date(this.display_measure_data[0].input_time).getTime()){
                    this.display_measure_data[1] = temp[j];
                  }
                } else {
                  this.display_measure_data[1] = temp[j];
                }
              }
            }
          }
        //---------------------------------------------------------------------------------
    }

    getCurDiseaseInfo = async() => {
        let schedule_date = this.props.schedule_date;
        let path = "/app/api/v2/dial/board/Soap/search_disease";
        await apiClient
            ._post(path, {
                params: {
                    is_enabled:1,
                    system_patient_id: this.state.patientInfo.system_patient_id,
                    date: schedule_date
                }
            })
            .then((res) => {
                this.setState({
                    disease_history:res,
                });
            });
    };

    getInstructionInfo = async() => {
        let schedule_date = this.props.schedule_date;
        let path = "/app/api/v2/dial/board/Soap/search_instruction";
        await apiClient
            ._post(path, {
                params: {
                    is_enabled:1,
                    system_patient_id: this.state.patientInfo.system_patient_id,
                    date: schedule_date
                }
            })
            .then((res) => {
                if (res.length != 0){
                    this.setState({
                        instruction_list:res,
                    })
                } else {
                    this.setState({
                        instruction_list:[],
                    })
                }
            });
    };

    render() {        
        // var graph_table_show = this.graph_table_show;
        let schedule_date = this.props.schedule_date;
        let patientInfo = this.props.patientInfo;
        let schedule_data = this.props.schedule_data;
        let {treat_monitor_list, staff_list_by_number, doctor_list_by_number, instruction_list, disease_history} = this.state;
        let actualDrainage = '';
        // if(schedule_data !== undefined && schedule_data.dial_pattern !== undefined){
        //     if (schedule_data.weight_before != null && schedule_data.weight_after != null){
        //         actualDrainage = schedule_data.weight_before+schedule_data.dial_pattern.supplementary_food+schedule_data.dial_pattern.fluid-schedule_data.weight_after;
        //         actualDrainage = isNaN(actualDrainage) ? "":actualDrainage.toFixed(2);
        //     }
        // }
        if(schedule_data !== undefined && schedule_data.dial_pattern !== undefined){
            if (schedule_data.weight_before != null && schedule_data.weight_after != null){
                actualDrainage = schedule_data.weight_before-schedule_data.weight_after;
                actualDrainage = isNaN(actualDrainage) ? "":actualDrainage.toFixed(2) + ' L';
            }
        }
        let plan_hours = schedule_data!=undefined && schedule_data.dial_pattern != undefined?schedule_data.dial_pattern.reservation_time:'';
        let schedule_start_time = '';
        var schedule_start_datetime = '';
        let schedule_end_time = '';
        var schedule_end_datetime='';
        if (schedule_data != undefined){
            if (schedule_data.start_date != null) {
                schedule_start_datetime = schedule_data.start_date;
                schedule_start_time = formatTimeIE(schedule_data.start_date);
            } else {
                if(schedule_data.console_start_date != null) {
                    schedule_start_datetime = schedule_data.console_start_date;
                    schedule_start_time = formatTimeIE(schedule_data.console_start_date);
                }
            }

            if (schedule_data.end_date != null) {
                schedule_end_datetime = schedule_data.end_date;
                schedule_end_time = formatTimeIE(schedule_data.end_date);
            } 
            // else {
            //     if(schedule_data.console_end_date != null) {
            //         schedule_end_datetime = schedule_data.console_end_date;
            //         schedule_end_time = formatTimeIE(schedule_data.console_end_date);
            //     }
            // }
        }

        let start_time = null;
        let end_time = null;
        if (schedule_start_time != '' && plan_hours != ''){
            start_time = new Date(formatDateTimeIE(schedule_start_datetime));            
            start_time.setSeconds(0);
            end_time = new Date(schedule_date);
            if (schedule_end_time != ''){
                end_time = new Date(formatDateTimeIE(schedule_end_datetime));                
            } else {
                end_time.setHours(parseInt(schedule_start_time.split(':')[0]) + parseInt(plan_hours.split(':')[0]));
                end_time.setMinutes(parseInt(schedule_start_time.split(':')[1]) + parseInt(plan_hours.split(':')[1]));
            }
            end_time.setSeconds(0);            
        }
        let syringe_amount,syringe_speed,syringe_stop_time = "";
        if (schedule_data != undefined && schedule_data.dial_anti != undefined && schedule_data.dial_anti.anti_items != undefined &&
            schedule_data.dial_anti.anti_items != null && schedule_data.dial_anti.anti_items.length > 0){
            schedule_data.dial_anti.anti_items.map(item=>{
                if (item.category === "初回量" || item.name =='ワンショット') {
                    syringe_amount = item.amount +' '+ item.unit;
                } 
                if (item.category === "持続量" || item.name == 'ＩＰダイヤル値') {
                    syringe_speed = item.amount +' ' + item.unit;
                } 
                if (item.category === "事前停止" || item.name =='事前停止') {
                    syringe_stop_time = item.amount + ' ' + item.unit;
                }
            })
        }
        //measure data for graph
        if (start_time!= undefined && start_time != null) this.min_x = this.setMinX(this.min_x, start_time);
        if (this.min_x != '') {
            // this.min_x.setMinutes(0);
            this.makeTimeListMeasure(start_time, this.props.x_range);
        }
        var temp;
        var pass_time = this.getPassTime(schedule_end_datetime,schedule_start_datetime);
        return (
            <List>
                <Header>
                    <div style={{fontSize:"46px"}} className={`text-center w100`}>【血液透析記録】</div>
                    <div className="flex w100" style={{justifyContent:'space-between'}}>
                        <div className="border-bottom border-dark w15 top-padding">ID： {patientInfo!= null ? patientInfo.patient_number: ""}</div>
                        <div className='flex border-bottom' style={{width:'60%'}}>
                            <div className='top-padding '>氏名：</div>
                            <div className="border-dark" style={{display:'flex', width: "90%"}}>
                                <label>
                                    <span className='kana-name'>{patientInfo!= null ? patientInfo.kana_name: ""}</span><br/>
                                    <span className='name'>{patientInfo!= null ? patientInfo.patient_name: ""}</span>
                                </label>
                            </div>
                        </div>
                        
                        <div className="text-right border-bottom border-dark top-padding">透析日： {schedule_data.schedule_date != undefined && formatJapan(schedule_data.schedule_date)}</div>
                    </div>
                </Header>
                <Body>
                    <div className={`flex w-100`}>
                        <table className="table-scroll table table-bordered top-table">
                            <tr>
                                <th style={{width:"13%",borderLeftColor:'black', borderTopColor:'black'}}>DW</th>
                                <td className="w10 text-center" style={{borderTopColor:'black'}}>{schedule_data !== undefined && schedule_data!=null && schedule_data.dial_pattern !== undefined  && schedule_data.dial_pattern.dw != ""?parseFloat(schedule_data.dial_pattern.dw).toFixed(1)+" kg" :""}</td>
                                <th style={{width:"17%",borderLeftColor:'black', borderTopColor:'black'}}>治療法</th>
                                <td className="text-center" style={{borderTopColor:'black'}}>{schedule_data !== undefined && schedule_data!=null && schedule_data.dial_pattern !== null && schedule_data.method_data !== undefined ?
                                    schedule_data.method_data[schedule_data.dial_pattern.dial_method] : ""}</td>
                                <th className="w90p" style={{borderLeftColor:'black', borderTopColor:'black'}}>開始時間</th>
                                <td className="w10 text-center" style={{borderTopColor:'black'}}>{this.state.props_start_time}</td>
                                <th className="w110p" style={{borderLeftColor:'black', borderTopColor:'black'}}>穿刺者</th>
                                <td className="w13 text-center" style={{borderTopColor:'black', borderRightColor:'black'}}>{staff_list_by_number != undefined && schedule_data !== undefined && schedule_data!=null && schedule_data.puncture_staff != null &&staff_list_by_number[schedule_data.puncture_staff]}</td>
                            </tr>
                            <tr>
                                <th style={{width:"13%",borderLeftColor:'black'}}>前回体重</th>
                                <td className="w10 text-center">{schedule_data !== undefined && schedule_data!=null && schedule_data.prev_weight_after != null && schedule_data.prev_weight_after != "" ?parseFloat(schedule_data.prev_weight_after).toFixed(1)+" kg" :""}</td>
                                <th style={{width:"17%",borderLeftColor:'black'}}>ダイアライザ</th>
                                <td className="text-center" style={{letterSpacing:"-1px"}}>{schedule_data !== undefined && schedule_data!=null && schedule_data.dial_dialyzer !== undefined && schedule_data.dial_dialyzer !== null &&
                                schedule_data.dial_dialyzer[0] !== undefined && schedule_data.dial_dialyzer[0] !== null ? schedule_data.dial_dialyzer[0].name: " "}</td>
                                <th className="w90p" style={{borderLeftColor:'black'}}>終了時間</th>
                                <td className="w10 text-center">{this.state.props_end_time}</td>
                                <th className="w110p" style={{borderLeftColor:'black'}}>開始者</th>
                                <td className="w13 text-center" style={{borderRightColor:'black'}}>{staff_list_by_number != undefined && schedule_data !== undefined && schedule_data!=null && schedule_data.start_staff != null &&staff_list_by_number[schedule_data.start_staff]}</td>
                            </tr>
                            <tr>
                                <th style={{width:"13%",borderLeftColor:'black'}}>前体重</th>
                                <td className="w10 text-center">{schedule_data !== undefined && schedule_data!=null && schedule_data.weight_before != null ? parseFloat(schedule_data.weight_before).toFixed(1)+" kg" :""}</td>
                                <th style={{width:"17%",borderLeftColor:'black'}}>ブラッドアクセス</th>
                                <td className="text-center">{this.state.showImage!=undefined && this.state.showImage !=null && this.state.showImage.va_name}</td>
                                <th className="w90p" style={{borderLeftColor:'black', borderBottomColor:'black'}}>透析時間</th>
                                <td className="w10 text-center" style={{borderBottomColor:'black'}}>{pass_time}</td>
                                <th className="w110p" style={{borderLeftColor:'black', borderBottomColor:'black'}}>終了者</th>
                                <td className="w13 text-center" style={{borderRightColor:'black', borderBottomColor:'black'}}>{staff_list_by_number != undefined && schedule_data !== undefined && schedule_data!=null && schedule_data.end_staff != null &&staff_list_by_number[schedule_data.end_staff]}</td>
                            </tr>
                            <tr>
                                <th style={{width:"13%",borderLeftColor:'black'}}>前回からの増加</th>
                                <td className="w10 text-center">{schedule_data !== undefined && schedule_data!=null && parseFloat(schedule_data.weight_before) >0 &&
                                    parseFloat(schedule_data.prev_weight_after) >0 ? ((parseFloat(schedule_data.weight_before)-parseFloat(schedule_data.prev_weight_after)).toFixed(1))+" kg":''}</td>
                                <th style={{width:"17%",borderLeftColor:'black'}}>血流量</th>
                                <td className=" text-center">{schedule_data !== undefined && schedule_data!=null && schedule_data.dial_pattern !== undefined ?
                                    schedule_data.dial_pattern.blood_flow + ' mL/min' : ""}</td>
                                <th colSpan={2} style={{borderLeftColor:'black', borderRightColor:'black'}}>HDF設定</th>
                                <th colSpan={2} style={{borderTopColor:'black', borderRightColor:'black'}}>I-HDF設定</th>
                            </tr>
                            <tr>
                                <th style={{width:"13%",borderLeftColor:'black'}}>DWからの増加</th>
                                <td className="w10 text-center">{schedule_data !== undefined && schedule_data!=null && schedule_data.dial_pattern != undefined && parseFloat(schedule_data.weight_before) >0 &&
                                parseFloat(schedule_data.dial_pattern.dw) >0 ? ((parseFloat(schedule_data.weight_before)-parseFloat(schedule_data.dial_pattern.dw)).toFixed(1))+" kg":''}</td>
                                <th style={{width:"17%",borderLeftColor:'black',borderBottomColor:'black'}}>透析液流量</th>
                                <td className=" text-center" style={{borderBottomColor:'black'}}>{schedule_data !== undefined && schedule_data.dial_pattern !==undefined && schedule_data.dial_pattern.dialysate_amount != null && schedule_data.dial_pattern.dialysate_amount != ""?
                                    schedule_data.dial_pattern.dialysate_amount + ' mL/min':""}</td>
                                <th className="w90p" style={{borderLeftColor:'black',borderBottomColor:'black'}}>補液速度</th>
                                <td className="w10 text-center" style={{borderBottomColor:'black'}}>{schedule_data.dial_pattern != undefined && schedule_data.dial_pattern.fluid_speed != null &&
                                    schedule_data.dial_pattern.fluid_speed != "" ? schedule_data.dial_pattern.fluid_speed + " L/h" : ""}
                                </td>
                                <th className="w110p" style={{borderLeftColor:'black'}}>補液開始時間</th>
                                <td className="w13 text-center" style={{borderRightColor:'black'}}>{schedule_data.dial_pattern != undefined && schedule_data.dial_pattern.hdf_init_time != null &&
                                schedule_data.dial_pattern.hdf_init_time != "" && schedule_data.dial_pattern.hdf_init_time != 0 ? schedule_data.dial_pattern.hdf_init_time + ' min' : ""}</td>
                            </tr>
                            <tr>
                                <th style={{width:"13%",borderLeftColor:'black'}}>除水量設定</th>
                                <td className=" text-center">{actualDrainage}</td>
                                <th style={{width:"17%",borderLeftColor:'black'}}>抗凝固剤</th>
                                <td className=" text-center" colSpan={3} style={{fontSize:15,letterSpacing:"-1px"}}>{schedule_data !== undefined && schedule_data.dial_anti !== undefined && schedule_data.dial_anti !== null?schedule_data.dial_anti.title : ""}</td>
                                <th className="w110p" style={{borderLeftColor:'black'}}>1回補液量</th>
                                <td className="w13 text-center" style={{borderRightColor:'black'}}>{schedule_data.dial_pattern != undefined && schedule_data.dial_pattern.hdf_init_amount != null &&
                                    schedule_data.dial_pattern.hdf_init_amount != "" && schedule_data.dial_pattern.hdf_init_amount != 0 ? schedule_data.dial_pattern.hdf_init_amount + ' mL' : ""}</td>
                            </tr>
                            <tr>
                                <th style={{width:"13%",borderLeftColor:'black'}}>後体重</th>
                                <td className="w10 text-center">{schedule_data !== undefined && schedule_data!=null && schedule_data.weight_after != null ? parseFloat(schedule_data.weight_after).toFixed(1) + " kg" :""}</td>
                                <th style={{width:"17%",borderLeftColor:'black'}}>初回投与量</th>
                                <td className=" text-center" style={{borderRightColor:'#828282'}}>{syringe_amount != undefined && syringe_amount != "" ? syringe_amount : ""}</td>
                                <th className="w90p" style={{borderLeftColor:'#828282'}}>持続量</th>
                                <td className="w10 text-center">{syringe_speed != undefined && syringe_speed != "" ? syringe_speed : ""}</td>
                                <th className="w110p" style={{borderLeftColor:'black'}}>補液間隔</th>
                                <td className="w13 text-center" style={{borderRightColor:'black'}}>{schedule_data.dial_pattern != undefined && schedule_data.dial_pattern.hdf_step != null &&
                                    schedule_data.dial_pattern.hdf_step != "" && schedule_data.dial_pattern.hdf_step != 0 ? schedule_data.dial_pattern.hdf_step + ' min' : ""}</td>
                            </tr>
                            <tr>
                                <th style={{width:"13%",borderLeftColor:'black', borderBottomColor:'black'}}>本日の減少量</th>
                                <td className="w10 text-center" style={{borderBottomColor:'black'}}>{schedule_data !== undefined && schedule_data!=null && parseInt(schedule_data.weight_before) >0
                                    && parseFloat(schedule_data.weight_after)>0?(parseFloat(schedule_data.weight_before)-parseFloat(schedule_data.weight_after)).toFixed(1) + " kg":''}</td>
                                <th style={{width:"17%",borderLeftColor:'black', borderBottomColor:'black'}}>事前停止</th>
                                <td className=" text-center" style={{borderBottomColor:'black', borderRightColor:'#828282'}}>{syringe_stop_time != undefined && syringe_stop_time != "" ? syringe_stop_time : ""}</td>
                                <th className="w90p text-center" style={{borderBottomColor:'black',borderLeftColor:'#828282'}}></th>
                                <td className="w10 text-center" style={{borderBottomColor:'black'}}></td>
                                <th className="w110p" style={{borderLeftColor:'black', borderBottomColor:'black'}}>1回補液速度</th>
                                <td className="w13 text-center" style={{borderBottomColor:'black', borderRightColor:'black'}}>{schedule_data.dial_pattern != undefined && schedule_data.dial_pattern.hdf_speed != null &&
                                    schedule_data.dial_pattern.hdf_speed != "" && schedule_data.dial_pattern.hdf_speed != 0 ? schedule_data.dial_pattern.hdf_speed +' mL/min' : ""}</td>
                            </tr>
                        </table>
                    </div>
                    <div className={`w100 print-area-b`}>
                        <div className="hr-bp">
                            {/* <span>HR</span>
                            <span style={{marginLeft: 15}}>BP</span> */}
                        </div>
                        <div className="graph_area d-flex" style={{overflow:'hidden'}}>
                            <div className="mt-4" style={{fontSize:'1rem',width:'4rem', paddingTop:'1rem', marginRight:'0.5rem'}}>
                                <div className="text-center ml-3 mt-1">
                                    <div className={``}>血圧</div>
                                    <div className="" style={{paddingTop:'0.2rem'}}>
                                        <div>▼</div>
                                        <div>▲</div>
                                    </div>
                                </div>
                                <div className="text-center ml-3" style={{marginTop:'3rem'}}>
                                    <div>脈拍</div>
                                    <div className="" style={{paddingTop:'0.2rem', fontSize:'17px'}}>●</div>
                                </div>                                
                            </div>
                            <DialChart
                                showData={this.state.graph_data}
                                start_time = {start_time}
                                end_time = {end_time}
                                ref = {this.ChartRef}
                                min_x = {this.min_x}
                                x_range = {this.props.x_range>0?this.props.x_range:5}
                                interval_y_between_label = {10}
                            />
                        </div>
                        <div className={`w100`}>
                            <table className="table-scroll table table-bordered measure-table"> 
                            {/* {graph_table_show.ms_target_drainage == "ON" && ( */}
                                <tr className={`inline-flex grey-back`}>
                                    <td className={`title`}>除水量設定</td>
                                    <td className={`unit`}>L</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_target_drainage);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              {/* )} */}
                              {/* {graph_table_show.ms_drainage_cur_speed == "ON" && ( */}
                                <tr className={`inline-flex`}>
                                    <td className={`title`}>除水速度</td>
                                    <td className={`unit`}>L/h</td>
                                    {this.display_measure_data.length > 0 && 
                                    Object.keys(this.time_series).map(key =>{
                                        if (this.display_measure_data[key] != undefined) {
                                            temp = removeLeadZeros(this.display_measure_data[key].ms_drainage_cur_speed);
                                            return(
                                            <>
                                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                            </>
                                            )
                                        } else {
                                            return(
                                            <>
                                                <td>&nbsp;</td>
                                            </>
                                            )
                                        }
                                    })
                                  }
                                  {this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              {/* )} */}
                              {/* {graph_table_show.ms_cur_drainage == "ON" && ( */}
                                <tr className={`inline-flex grey-back`}>
                                    <td className={`title`}>除水量積算</td>
                                    <td className={`unit`}>L</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_cur_drainage);
                                                return(
                                                <>
                                                    <td className='small-td'>
                                                        {temp!=''?renderHTML(temp):''}
                                                    </td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              {/* )} */}
                              {/* {graph_table_show.ms_blood_target_flow == "ON" && (
                                <tr className={`inline-flex grey-back`}>
                                    <td className={`title`}>血流量設定</td>
                                    <td className={`unit`}>mL/min</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_blood_target_flow);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              )} */}
                              {/* {graph_table_show.ms_blood_cur_flow == "ON" && ( */}
                                <tr className={`inline-flex`}>
                                    <td className={`title`}>血流量</td>
                                    <td className={`unit`}>mL/min</td>
                                    {this.display_measure_data.length > 0 && 
                                    Object.keys(this.time_series).map(key =>{
                                        if (this.display_measure_data[key] != undefined) {
                                            temp = removeLeadZeros(this.display_measure_data[key].ms_blood_cur_flow);
                                            return(
                                            <>
                                                <td className='small-td'>{temp != null && temp != '' && temp>=0?parseInt(temp):''}</td>
                                            </>
                                            )
                                        } else {
                                            return(
                                            <>
                                                <td>&nbsp;</td>
                                            </>
                                            )
                                        }
                                    })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              {/* )} */}
                              {/* {graph_table_show.ms_syringe_speed == "ON" && (
                                <tr className={`moreshow-area inline-flex`}>
                                    <td className={`title`}>シリンジポンプ速度設定</td>
                                    <td className={`unit`}>mL/h</td>
                                    {this.display_measure_data.length > 0 && 
                                    Object.keys(this.time_series).map(key =>{
                                        if (this.display_measure_data[key] != undefined) {
                                            temp = removeLeadZeros(this.display_measure_data[key].ms_syringe_speed);
                                            return(
                                            <>
                                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                            </>
                                            )
                                        } else {
                                            return(
                                            <>
                                                <td>&nbsp;</td>
                                            </>
                                            )
                                        }
                                    })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              )} */}
                              {/* {graph_table_show.ms_syringe_value == "ON" && (
                                <tr className={`moreshow-area inline-flex`}>
                                    <td className={`title`}>SP積算</td>
                                    <td className={`unit`}>mL</td>
                                    {this.display_measure_data.length > 0 && 
                                    Object.keys(this.time_series).map(key =>{
                                        if (this.display_measure_data[key] != undefined) {
                                            temp = removeLeadZeros(this.display_measure_data[key].ms_syringe_value);
                                            return(
                                            <>
                                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                            </>
                                            )
                                        } else {
                                            return(
                                            <>
                                                <td>&nbsp;</td>
                                            </>
                                            )
                                        }
                                    })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              )} */}
                              {/* {graph_table_show.ms_venous_pressure == "ON" && ( */}
                                <tr className={`inline-flex grey-back`}>
                                    <td className={`title`}>静脈圧</td>
                                    <td className={`unit`}>mmHg</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_venous_pressure);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp != null && temp != ''?parseInt(temp):''}</td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              {/* )} */}
                              {/* {graph_table_show.ms_fluid_pressure == "ON" && ( */}
                                <tr className={`inline-flex`}>
                                    <td className={`title`}>透析液圧</td>
                                    <td className={`unit`}>mmHg</td>
                                    {this.display_measure_data.length > 0 && 
                                    Object.keys(this.time_series).map(key =>{                                        
                                        if (this.display_measure_data[key] != undefined) {
                                            // temp = removeLeadZeros(this.display_measure_data[key].ms_fluid_pressure);
                                            temp = this.display_measure_data[key].ms_fluid_pressure;                                            
                                            return(
                                            <>
                                                <td className='small-td'>{temp != null && temp != ''?parseInt(temp):''}</td>
                                            </>
                                            )
                                        } else {
                                            return(
                                            <>
                                                <td>&nbsp;</td>
                                            </>
                                            )
                                        }
                                    })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              {/* )} */}
                              {/* {graph_table_show.ms_dialysate_target_temperature == "ON" && (
                                <tr className={`moreshow-area inline-flex`}>
                                    <td className={`title`}>透析液温度設定</td>
                                    <td className={`unit`}>℃</td>
                                    {this.display_measure_data.length > 0 && 
                                    Object.keys(this.time_series).map(key =>{                                        
                                        if (this.display_measure_data[key] != undefined) {
                                            // temp = removeLeadZeros(this.display_measure_data[key].ms_dialysate_target_temperature);
                                            temp = this.display_measure_data[key].ms_dialysate_target_temperature;                                            
                                            return(
                                            <>
                                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                            </>
                                            )
                                        } else {
                                            return(
                                            <>
                                                <td>&nbsp;</td>
                                            </>
                                            )
                                        }
                                    })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              )} */}
                              {/* {graph_table_show.ms_dialysate_cur_temperature == "ON" && ( */}
                                <tr className={`moreshow-area inline-flex grey-back`}>
                                    <td className={`title`}>透析液温度</td>
                                    <td className={`unit`}>℃</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_dialysate_cur_temperature);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              {/* )} */}
                              {/* {graph_table_show.ms_dialysate_target_concentration == "ON" && (
                                <tr className={`moreshow-area inline-flex grey-back`}>
                                    <td className={`title`}>透析液濃度設定</td>
                                    <td className={`unit`}>mS/cm</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_dialysate_target_concentration);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              )} */}
                              {/* {graph_table_show.ms_dialysate_cur_concentration == "ON" && (
                                <tr className={`moreshow-area inline-flex grey-back`}>
                                    <td className={`title`}>透析液濃度</td>
                                    <td className={`unit`}>mS/cm</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_dialysate_cur_concentration);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              )} */}
                              {/* {graph_table_show.ms_tmp == "ON" && (
                                <tr className={`moreshow-area inline-flex grey-back`}>
                                    <td className={`title`}>TMP</td>
                                    <td className={`unit`}>mmHg</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_tmp);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              )} */}
                              {/* {graph_table_show.ms_dializer_pressure == "ON" && (
                                <tr className={`moreshow-area inline-flex grey-back`}>
                                    <td className={`title`}>ダイアライザ血液入口圧</td>
                                    <td className={`unit`}>mmHg</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_dializer_pressure);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              )} */}
                              {/* {graph_table_show.ms_arterial_pressure == "ON" && (
                                <tr className={`moreshow-area inline-flex grey-back`}>
                                    <td className={`title`}>脱血圧</td>
                                    <td className={`unit`}>mmHg</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_arterial_pressure);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              )} */}
                              {/* {graph_table_show.ms_fluid_target_amount == "ON" && (
                                <tr className={`moreshow-area inline-flex grey-back`}>
                                    <td className={`title`}>目標補液量</td>
                                    <td className={`unit`}>L</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_fluid_target_amount);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              )} */}
                              {/* {graph_table_show.ms_fluid_speed == "ON" && ( */}
                                <tr className={`moreshow-area inline-flex`}>
                                    <td className={`title`}>補液速度</td>
                                    <td className={`unit`}>L/h</td>
                                    {this.display_measure_data.length > 0 && 
                                    Object.keys(this.time_series).map(key =>{
                                        if (this.display_measure_data[key] != undefined) {
                                            temp = removeLeadZeros(this.display_measure_data[key].ms_fluid_speed);
                                            return(
                                            <>
                                                <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                            </>
                                            )
                                        } else {
                                            return(
                                            <>
                                                <td>&nbsp;</td>
                                            </>
                                            )
                                        }
                                    })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              {/* )} */}
                              {/* {graph_table_show.ms_fluid_cur_amount == "ON" && ( */}
                                <tr className={`moreshow-area inline-flex grey-back`}>
                                    <td className={`title`}>補液量積算</td>
                                    <td className={`unit`}>L</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_fluid_cur_amount);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              {/* )} */}
                              {/* {graph_table_show.ms_fluid_target_temperature == "ON" && (
                                <tr className={`moreshow-area inline-flex grey-back`}>
                                    <td className={`title`}>補液温度設定</td>
                                    <td className={`unit`}>℃</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_fluid_target_temperature);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              )} */}
                              {/* {graph_table_show.ms_fluid_cur_temperature == "ON" && (
                                <tr className={`moreshow-area inline-flex grey-back`}>
                                    <td className={`title`}>補液温度</td>
                                    <td className={`unit`}>℃</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_fluid_cur_temperature);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              )}*/}
                              {/* {graph_table_show.ms_hdf_count == "ON" && ( */}
                                <tr className={`moreshow-area inline-flex`}>
                                    <td className={`title`}>補液回数</td>
                                    <td className={`unit`}>回</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_hdf_count);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              {/* )} */}
                              {/* {graph_table_show.ms_hdf_amount == "ON" && ( */}
                                <tr className={`moreshow-area inline-flex grey-back`}>
                                    <td className={`title`}>総補液積算</td>
                                    <td className={`unit`}>L</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_hdf_amount);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              {/* )} */}
                              {/* {graph_table_show.ms_emergency_amount == "ON" && (
                                <tr className={`moreshow-area inline-flex grey-back`}>
                                    <td className={`title`}>緊急総補液量</td>
                                    <td className={`unit`}>mL</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_emergency_amount);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp != undefined && temp!=''?renderHTML(temp):''}</td>
                                                </>
                                                )
                                            } else {
                                                return(
                                                <>
                                                    <td>&nbsp;</td>
                                                </>
                                                )
                                            }
                                        })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              )} */}
                              {/* {graph_table_show.input_time == "ON" && ( */}
                                <tr className={`moreshow-area inline-flex`}>
                                    <td className={`title`}>入力時間</td>
                                    <td className={`unit`}></td>
                                    {this.display_measure_data.length > 0 && 
                                    Object.keys(this.time_series).map(key =>{
                                        if (this.display_measure_data[key] != undefined) {
                                            return(
                                            <>
                                                <td className='small-td'>{formatTimeIE(this.display_measure_data[key].input_time)}</td>
                                            </>
                                            )
                                        } else {
                                            return(
                                            <>
                                                <td>&nbsp;</td>
                                            </>
                                            )
                                        }
                                    })
                                    }{this.display_measure_data.length == 0 && this.td_count.map(item=>{
                                     return (<><td key={item}></td></>)
                                   })}
                                </tr>
                              {/* )} */}
                            </table>
                        </div>
                        <table className="table-scroll table table-bordered border-thick-table">
                            <tr>
                                <th style={{width:"50%"}}>現症</th>
                                <th style={{width:"50%"}}>Dr指示</th>
                            </tr>
                            <tr>
                                <td>
                                    {disease_history !== undefined && disease_history != null && disease_history.map ((item, idx)=>{
                                        return (
                                            <div key={idx}>{displayLineBreak(item.body)}</div>
                                        )}
                                    )}
                                    {disease_history == undefined || disease_history == null || disease_history.length == 0 && (
                                        <div>&nbsp;</div>
                                    )}
                                </td>
                                <td>
                                    {instruction_list !==undefined && instruction_list != [] && (
                                        instruction_list.map((item) => {
                                            return(
                                                <div key={item}>{renderHTML(item.body)}</div>
                                            )
                                        })
                                    )}
                                    {instruction_list == undefined || instruction_list == null || instruction_list.length == 0 && (
                                        <div>&nbsp;</div>
                                    )}
                                </td>
                            </tr>
                            {/*<div className="current_diseases border w-50" style={{borderColor:"lightgrey"}}>*/}
                                {/*<div className="text-center border-bottom border-dark" style={{fontSize:16,borderColor:"lightgrey"}}>現  症</div>*/}
                                {/*<div className="disease-content pl-1 pt-1" id="disease_area" style={{minHeight:100}}>*/}
                                    {/*{disease_history !== undefined && disease_history != null && disease_history.map ((item, idx)=>{*/}
                                        {/*return (*/}
                                            {/*<div key={idx}>{displayLineBreak(item.body)}</div>*/}
                                        {/*)}*/}
                                    {/*)}*/}

                                {/*</div>*/}
                            {/*</div>*/}
                            {/*<div className="instruction current_diseases border border-dark w-50">*/}
                                {/*<div className="text-center border-bottom border-dark" style={{fontSize:16}}>Dr指示</div>*/}
                                {/*<div className="disease-content pl-1 pt-1" style={{minHeight:100}}>*/}
                                    {/*{instruction_list !==undefined && instruction_list != [] && (*/}
                                        {/*instruction_list.map((item) => {*/}
                                            {/*return(*/}
                                                {/*<div key={item}>{displayLineBreak(item.body)}</div>*/}
                                            {/*)*/}
                                        {/*})*/}
                                    {/*)}*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        </table>
                        <table className="table-scroll table table-bordered border-thick-table">
                            <tr>
                                <th className={`text-center`} style={{width:'5%'}}>時間</th>
                                <th className={`text-center`} style={{width:'45%'}}>経過</th>
                                <th className={`text-center`} style={{width:"calc(50% - 9.5rem)"}}>処置</th>
                                <th className={`text-center`} style={{width:'9.5rem'}}>入力者</th>
                            </tr>
                            {treat_monitor_list !==undefined && treat_monitor_list != [] && doctor_list_by_number != undefined && staff_list_by_number != undefined &&(
                                Object.keys(treat_monitor_list).map((key) => {
                                    var item = treat_monitor_list[key];
                                    var soap_left_body = '';
                                    var soap_right_body = '';
                                    if (Array.isArray(item)){
                                        if (item[0].type.includes('soap')){
                                            return(
                                                <>
                                                    <tr onContextMenu={e => this.handleClick(e, item)}>
                                                        <td className="text-center">{item[0].value.write_date_time}</td>
                                                        <td className='suso_col'>
                                                        {item.map((sub_item) => {
                                                            if (this.checkSO(sub_item.value.category_2)) {
                                                                soap_left_body = '(' + sub_item.value.category_2 + ')' + sub_item.value.body;
                                                                return(
                                                                <>
                                                                    <div>{renderHTML(soap_left_body)}</div>                                                                
                                                                </>
                                                                )
                                                            }
                                                        })}

                                                        </td>
                                                        <td className='suso_col'>
                                                        {item.map((sub_item) => {                                                            
                                                            if (!this.checkSO(sub_item.value.category_2)) {
                                                                soap_right_body = '(' + sub_item.value.category_2 + ')' + sub_item.value.body;
                                                                return(
                                                                <>
                                                                    <div>{renderHTML(soap_right_body)}</div>
                                                                </>
                                                                )
                                                            }
                                                        })}
                                                        </td>
                                                        {/* <td>{(item[0].value.instruction_doctor_number != null) ? doctor_list_by_number[item[0].value.instruction_doctor_number]: ""}</td> */}
                                                        <td className='text-center'>{item[0].value.updated_by !== null?staff_list_by_number[item[0].value.updated_by]: ""}</td>
                                                    </tr>
                                                </>
                                            )
                                        }
                                    } else {
                                        if (item.value.category_1!='Drカルテ'){
                                            return (
                                                <>
                                                    <tr onContextMenu={e => this.handleClick(e, item)}>
                                                        <td className="text-center">{item.value.write_date_time}</td>
                                                        {item.type.toString().includes('op_alarm') && (
                                                            <>       
                                                                <td>{item.value.category_1 =='操作履歴'? item.value.body_2:item.value.body}</td>
                                                                <td>{item.value.category_1 =='操作履歴'? item.value.body:item.value.body_2}</td>
                                                            </>
                                                        )}
                                                        {!item.type.toString().includes('op_alarm') && (
                                                            <>
                                                                <td className="">{item.value.category_2=='経過'?displayLineBreak(this.removeLabel(item.value.body)):''}</td>
                                                                <td className="">{item.value.category_2!='経過'?displayLineBreak(this.removeLabel(item.value.body)):''}</td>
                                                            </>
                                                        )}
                                                        {/* <td>{item.value.instruction_doctor_number !== null ? doctor_list_by_number[item.value.instruction_doctor_number]: ""}</td> */}
                                                        <td className='text-center'>{item.value.updated_by !== null?staff_list_by_number[item.value.updated_by]: ""}</td>
                                                    </tr>
                                                </>
                                            )
                                        }
                                    }
                                })
                            )}
                        </table>
                    </div>
                </Body>

            </List>
        );
    }
}

DialRecord_A.contextType = Context;

DialRecord_A.propTypes = {
    print_data: PropTypes.object,
    closeModal: PropTypes.func,
    rows_blood: PropTypes.array,
    rows_measure: PropTypes.array,
    rows_temp: PropTypes.array,
    schedule_data: PropTypes.object,
    disease_history:PropTypes.array,
    patientInfo:PropTypes.object,
    schedule_date: PropTypes.string,    
    x_range:PropTypes.number,
};

export default DialRecord_A;