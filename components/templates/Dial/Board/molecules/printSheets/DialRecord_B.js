import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import {formatTimeIE, formatJapan, formatDateTimeIE} from "~/helpers/date";
import DialChart from "~/components/templates/Dial/Board/molecules/DialChart"
import * as apiClient from "~/api/apiClient";
import { makeList_code} from "~/helpers/dialConstants";
import { TIMEZONE} from "~/helpers/constants";
import {displayLineBreak, removeLeadZeros} from "~/helpers/dialConstants"
import * as colors from "~/components/_nano/colors";

const Header = styled.div`
    // display: flex;
    font-size:20px;
 `;
const Body = styled.div`
    font-size:16px;
    margin-top: 10px;
    .item{width:15%}
    .small-td{
        font-size:0.8rem;
    }
 `;
const List = styled.div`
    display: block;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 14px;
    width: 100%;
    margin-right: 2%;
    height: calc(100% - 40px);
    overflow-y: auto;
    float: left;
    .td-title{
        width:140px;
    }
    .measure-table{
        table-layout: fixed;
        width:98%;
    }
    .w2{width:2.5%;}
    .w5{width:5%;}
    .w10{width:10%;}
    .w15{width:15%;}
    .w20{width:20%;}
    .w25{width:25%;}
    .w30{width:30%;}
    .w40{width:40%;}
    .w50{width:50%;}
    .w60{width:60%;}
    .w70{width:70%;}
    .border{border:solid 1px black !important;}
    .border-left{border-left: solid 1px black !important;}
    .border-right {border-right: solid 1px black !important;}
    .border-top {border-top: solid 1px black !important;}
    .border-bottom {border-bottom: solid 1px black !important;}
    .flex{
        display: flex;
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
    .table-bordered th, .table-bordered td {
        border: 1px solid #000;
        padding: 3px;
    }
    .p20{padding: 20px;}
    .p10{padding: 10px;}
    .scroll{overflow-y:auto;}
    .h34{height:31px;}
    @media print{
        .print-area-b{
            width: 70% !important;
        }
    }
    .measure-table td{
        border: 0.1px solid grey;
    }
    .border-thick-table td{
        border: 0.1px solid grey;
    }
    .border-thick-table th{
        background: white;
    }
    td{
        word-break:break-all;
        word-wrap:break-word;
    }
    `;

class DialRecord_B extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        let schedule_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_data");
        let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
        let material_master = sessApi.getObjectValue("dial_common_master","material_master");
        let bed_master = sessApi.getObjectValue("dial_common_master","bed_master");
        let examinationCodeData = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"examination_master");
        let code_master = sessApi.getObjectValue("dial_common_master","code_master");
        this.state={
            graph_data: [],
            list_data: [],
            patientInfo,
            condition: schedule_data!=undefined&&schedule_data != null && schedule_data.dial_pattern != null ? schedule_data.dial_pattern: null,
            schedule_data:schedule_data,
            dialysates:makeList_code(material_master['透析液']),
            bed_data: bed_master,
            blood_data:this.props.rows_blood,
            rows_temp: this.props.rows_temp,
            rows_measure: this.props.rows_measure,
            examinationCodeData,
            examination_codes:makeList_code(examinationCodeData),
            timingCodeData:code_master['実施タイミング'],
            timing_codes:makeList_code(code_master['実施タイミング']),
        }
        this.ChartRef = React.createRef();
        this.min_x = '';
        this.time_series = [];
        this.display_measure_data = [];
    }

    setMinX = (min, value) => {
        if (min == '') return value;        
        if (typeof min == 'string') min = min.split("-").join("/");
        if (typeof value == 'string') value = value.split("-").join("/");        
        if (new Date(min).getTime() > new Date(value).getTime()) return new Date(value);
        return new Date(min);
    }

    async componentDidMount() {
        this.getSoapInfo();        
        this.getInjectionInfo();
        this.getInspectionInfo();
        this.getStaffs();
        this.getDoctors();
        this.getCurDiseaseInfo();
        this.getInstructionInfo();
        let temperature_data = this.props.rows_temp;
        let blood_data = this.props.rows_blood;
        let measure_data = this.props.rows_measure;
        this.setGraphListData(blood_data, measure_data, temperature_data);
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
                let temperature_value = {x: time, y: 30, indexLabel:parseFloat(item.temperature).toFixed(1) + "℃", indexLabelFontColor:item.temperature >37.5 ? "red":colors.temperatureLineColor};
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
                graph_data[1].values.push(blood_add_min_value);
                graph_data[2].values.push(blood_add_max_value);
                this.min_x = this.setMinX(this.min_x, formatDateTimeIE(time));
            });            
        }
        if (measure_data !== undefined && measure_data !== null){            
            measure_data.map((item) => {
                let time = item.input_time;                
                list_data.push({
                    input_time: time,
                    ms_blood_cur_flow:item.ms_blood_cur_flow,
                    ms_venous_pressure:item.ms_venous_pressure,
                    ms_fluid_pressure:item.ms_fluid_pressure,
                    ms_cur_drainage:item.ms_cur_drainage,
                    ms_dialysate_cur_temperature:item.ms_dialysate_cur_temperature,
                    ms_drainage_cur_speed:item.ms_drainage_cur_speed,
                    ms_target_drainage:item.ms_target_drainage,
                    ms_fluid_speed:item.ms_fluid_speed,
                    ms_fluid_cur_amount:item.ms_fluid_cur_amount,
                    ms_hdf_amount:item.ms_hdf_amount,
                    ms_hdf_count:item.ms_hdf_count,
                });
            });
        }
        this.setState({
            graph_data: graph_data,
            list_data:list_data,
        });
    };

    getInjectionInfo = async() => {
        let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
        let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");

        let path = "/app/api/v2/dial/schedule/injection_schedule_search";
        let post_data = {
            params:{"schedule_date":schedule_date, "patient_id":patientInfo !== undefined && patientInfo.system_patient_id},
        };
        await apiClient.post(path, post_data)
            .then((res) => {
                this.setState({injection:res});
            });
    };

    getInspectionInfo = async() => {
        let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
        let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");

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
        let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
        let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
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
    }
    getRecentBloodData=(input_time, blood_data)=> {
        let return_data = {};
        let filtered_data = blood_data.filter(item=>{
            var dt = new Date();
            var y = dt.getFullYear();
            var m = ("00" + (dt.getMonth() + 1)).slice(-2);
            var d = ("00" + dt.getDate()).slice(-2);
            var today = y+"/"+m+"/"+d;
            let first_time = new Date(today + " " +formatTimeIE(item.input_time));
            let second_time = new Date(today + " " +formatTimeIE(input_time));
            if(first_time.getTime()<second_time.getTime()){
                return item;
            }
        })
        if (filtered_data != null && filtered_data.length != 0){
            return_data = filtered_data[filtered_data.length -1];
        }
        return return_data;
    };

    getDiffMinutes(first_dt, second_dt){
        first_dt = first_dt.split(" ");
        second_dt = second_dt.split(" ");
        let first_time = first_dt[1].split(":");
        let first_minute = parseInt(first_time[0]) *60 + parseInt(first_time[1]);
        let second_time = second_dt[1].split(":");
        let second_minute = parseInt(second_time[0]) *60 + parseInt(second_time[1]);
        if(second_minute-first_minute<30){
            return true;
        } else {
            return false;
        }
    }
    async getRecvData(){
        let schedule_data = this.props.schedule_data;
        let path = "/app/api/v2/dial/board/get_request_data";
        const post_data = {
            schedule_id:schedule_data.number,
            system_patient_id:schedule_data.system_patient_id,
        };
        await apiClient._post(path, {params: post_data}).then((res)=>{
            if (res!= undefined && res != null){
                this.setState({
                    blood_data:res.blood_data,
                    rows_measure:res.ms_data
                })
            }
        });
    }

    removeLabel = (value) => {
        if (value == null || value == "") return "";
        let replace_array = ["(S)","(O)","(A)","(A)","(P)","（提示）","(経過)","(指示)","(所見)","(定期)","(臨時)","(臨検 追加)","(臨注)","(臨検 変更) ","（臨処）"];
        replace_array.forEach(item=>{
            value = value.replace(item, "");
        });
        return value;
    };

    makeTimeListMeasure(min_time, range_hours, start_time){
        if(start_time == null) return;
        var temp = this.state.list_data;        
        this.time_series = [];
        this.time_series_for_device = [];
        this.display_measure_data = [];
        var start_time_limit = start_time.getTime();
        var index = 0;
        for (var i = 0;i<range_hours*2;i++){
            this.time_series.push(min_time.getTime()+ i *30*60*1000);
            if (min_time.getTime()+ (i+1) *30*60*1000 < start_time_limit){
                this.time_series_for_device.push(0);
                index++;
            } else {                
                this.time_series_for_device.push(start_time_limit + (i - index)*30*60*1000);
            }
        }        
        var final_time_limit = min_time.getTime() + range_hours*2*30*60*1000;        
        for(i = 0; i < range_hours*2; i++){
            var check_ms_number_flag = false;
            for (var j = temp.length - 1;j >= 0 ; j--){
                if (typeof temp[j].input_time == 'string') temp[j].input_time = temp[j].input_time.split("-").join("/");
                var input_time_temp = new Date(temp[j].input_time).getTime();
                if (i== range_hours*2-1){
                    if (this.time_series_for_device[i]>0 && input_time_temp >= this.time_series_for_device[i] && input_time_temp >= this.time_series[i] && input_time_temp < final_time_limit){
                        if (temp[j].ms_number > 0){
                            check_ms_number_flag = true;
                            this.display_measure_data[i] = temp[j];
                        } else {                            
                            if (check_ms_number_flag == false){
                                this.display_measure_data[i] = temp[j];
                            }
                        }
                    }
                } else {                    
                    if (this.time_series_for_device[i]>0 && input_time_temp >= this.time_series_for_device[i] && input_time_temp >= this.time_series[i] && input_time_temp < this.time_series[i+1]){                    
                        if (temp[j].ms_number > 0){
                            check_ms_number_flag = true;
                            this.display_measure_data[i] = temp[j];
                        } else {
                            if (check_ms_number_flag == false){
                                this.display_measure_data[i] = temp[j];
                            }
                        }
                    }
                }
            }
        }
    }
    getCurDiseaseInfo = async() => {
        let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
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
        let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
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
        let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
        let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");

        let {treat_monitor_list, schedule_data, injection, inspection, dialysates, staff_list_by_number, doctor_list_by_number} = this.state;
        let bed_no = "";        
        // const {list_data} = this.state;
        let actualDrainage = '';
        let dial_counter = '';
        if(schedule_data !== undefined && schedule_data.dial_pattern !== undefined){
            if (schedule_data.weight_before != null && schedule_data.weight_after != null){
                // actualDrainage = schedule_data.weight_before+schedule_data.dial_pattern.supplementary_food+schedule_data.dial_pattern.fluid-schedule_data.weight_after;
                actualDrainage = schedule_data.weight_before-schedule_data.weight_after;
                actualDrainage = isNaN(actualDrainage) ? "":actualDrainage.toFixed(2);
            }
            if (schedule_data.current_dial_count_number != undefined && schedule_data.current_dial_count_number != null){
                dial_counter = schedule_data.current_dial_count_number;
            } else {
                dial_counter = patientInfo.dial_count_number != null && patientInfo.dial_count_number+1;
            }
            if (this.state.bed_data != null){
                bed_no = this.state.bed_data.find(x=>x.number===schedule_data.dial_pattern.bed_no).name;
            }
        }
        let plan_hours = schedule_data!=undefined && schedule_data.dial_pattern != undefined?schedule_data.dial_pattern.reservation_time:'';
        let schedule_start_time = '';
        var schedule_start_datetime = '';
        let schedule_end_time = '';
        var schedule_end_datetime='';
        if (schedule_data != undefined){
            if (schedule_data.console_start_date != null) {
                schedule_start_datetime = schedule_data.console_start_date;
                schedule_start_time = formatTimeIE(schedule_data.console_start_date);
            } else {
                if(schedule_data.start_date != null) {
                    schedule_start_datetime = schedule_data.start_date;
                    schedule_start_time = formatTimeIE(schedule_data.start_date);
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
        //measure data for graph
        if (start_time!= undefined && start_time != null) this.min_x = this.setMinX(this.min_x, start_time);
        if (this.min_x != '') {
            this.min_x.setMinutes(0);            
            this.makeTimeListMeasure(this.min_x, this.props.x_range, start_time);
        }

        var temp;
        return (
            <List>
                <Header>
                    <div style={{fontSize:"46px"}} className={`text-right w50`}>透析記録</div>
                    <div className="d-flex">
                        <div className="w-75 text-right">{formatJapan(schedule_date)}</div>
                        <div className="text-center w20">{schedule_data.dial_pattern !== undefined && schedule_data.dial_pattern.time_zone != null && TIMEZONE[schedule_data.dial_pattern.time_zone]}</div>
                    </div>
                </Header>
                <Body>
                <div className={`flex`}>
                    <div className={`w30`}>
                        <div className={`border`} style={{padding:"10px"}}>
                            <div className={`flex`}>
                                <div className={`w50`}>
                                   <div>{patientInfo!= null ? patientInfo.patient_number: ""}</div>
                                   <div>{patientInfo!= null ? patientInfo.kana_name: ""}</div>
                                </div>
                                <div className={`w50 text-right`}>
                                    {patientInfo!= null && patientInfo.hospitial_flag=== 0 ? "入院" : "外来"}
                                </div>
                            </div>
                            <div className={`flex`}>
                                <div className={`w50`}>{patientInfo!= null && patientInfo.patient_name}</div>
                                <div className={`w50 text-right`}>{patientInfo!= null && patientInfo.age}歳</div>
                            </div>
                        </div>
                        <table className="table-scroll table table-bordered">
                            <tr>
                                <td rowSpan={4} className="w5">透析条件</td>
                                <td className={`flex`}>
                                    {/*<div className={`w50 text-center`}>*/}
                                    治療法:{schedule_data !== undefined && schedule_data!=null && schedule_data.dial_pattern !== null && schedule_data.method_data !== undefined ?
                                            schedule_data.method_data[schedule_data.dial_pattern.dial_method] : ""}
                                            {/*</div>*/}
                                    {/*<div className={`w50 text-center`}>*/}
                                    &nbsp;&nbsp;透析時間:{schedule_data !== undefined && schedule_data!=null && schedule_data.dial_pattern !== undefined ?
                                            schedule_data.dial_pattern.reservation_time.substring(0, 5) : ""}
                                    {/*</div>*/}
                                </td>
                            </tr>
                            <tr><td>
                                血流量:{schedule_data !== undefined && schedule_data!=null && schedule_data.dial_pattern !== undefined ?
                                    schedule_data.dial_pattern.blood_flow + "ml": ""}
                            </td></tr>
                            <tr><td>
                                ダイアライザ:{schedule_data !== undefined && schedule_data!=null && schedule_data.dial_dialyzer !== undefined && schedule_data.dial_dialyzer !== null &&
                                schedule_data.dial_dialyzer[0] !== undefined && schedule_data.dial_dialyzer[0] !== null ?
                                    schedule_data.dial_dialyzer[0].name: " "}
                            </td></tr>
                            <tr><td>
                                透析液の種類:{schedule_data !== undefined && schedule_data!=null && schedule_data.dial_pattern !==undefined && schedule_data.dial_pattern.dial_liquid != null &&
                                            dialysates != null && dialysates[schedule_data.dial_pattern.dial_liquid] != undefined && dialysates[schedule_data.dial_pattern.dial_liquid] != null ? dialysates[schedule_data.dial_pattern.dial_liquid] : ""}
                            </td></tr>
                        </table>
                    </div>
                    <div className={`w30`}>
                        <div className={`flex m20`}>
                            <div className={`w50 text-right`}>透析回数</div>
                            <div className={`w50 text-center`}>{dial_counter}</div>
                        </div>
                        <div className="flex m-2">
                            <div className={`w50 text-right`}>ベッドNo</div>
                            <div className={`w50 text-center`}>
                                {bed_no}
                            </div>
                        </div>
                        <div className="border p10 mt20 ml10 mr10" style={{height:"136px"}}>
                            <div className={`text-center`}>
                            {schedule_data !== undefined && schedule_data.dial_anti !== undefined && schedule_data.dial_anti !== null?schedule_data.dial_anti.title : ""}
                            </div>
                            {schedule_data !== undefined && schedule_data.dial_anti !== undefined && schedule_data.dial_anti !== null && schedule_data.dial_anti.anti_items != null && schedule_data.dial_anti.anti_items.length > 0 &&
                            schedule_data.dial_anti.anti_items.map((item)=>{
                                return (
                                    <><div className={`flex`}>
                                        <div className={`w50 text-center`}>
                                            {item.name}

                                        </div>
                                        <div className={`w50 text-center`}>
                                            {item.amount}{item.unit}
                                        </div>
                                    </div>
                                    </>
                                )
                            })}

                        </div>
                    </div>
                    <div className={`w40`}>
                        <table className="table-scroll table table-bordered mt5">
                            <tr>
                                <td className="w20">前体重</td>
                                <td className="w30" style={{textAlign:'center'}}>{schedule_data !== undefined && schedule_data.weight_before != undefined && schedule_data!=null ? schedule_data.weight_before+"kg" :""}</td>
                                <td className="w20">後体重</td>
                                <td className="w30" style={{textAlign:'center'}}>{schedule_data !== undefined && schedule_data.weight_after != undefined && schedule_data!=null ? schedule_data.weight_after+"kg" :""}</td>
                            </tr>
                            <tr>
                                <td>DW</td>
                                <td style={{textAlign:'center'}}>
                                    {schedule_data !== undefined && schedule_data!=null && schedule_data.dial_pattern !== undefined ?
                                        schedule_data.dial_pattern.dw + "kg":""}
                                </td>
                                <td>実除水</td>
                                <td style={{textAlign:'center'}}>
                                    {actualDrainage>0?actualDrainage+'L':''}
                                </td>
                            </tr>
                            <tr>
                                <td>目標体重</td>
                                <td style={{textAlign:'center'}}>
                                    {schedule_data !== undefined && schedule_data!=null && schedule_data.dial_pattern !== undefined ?
                                        schedule_data.target_weight !== undefined ? schedule_data.target_weight : schedule_data.dial_pattern.target_weight+"kg" : ""}
                                </td>
                                <td>補液</td>
                                <td style={{textAlign:'center'}}>
                                    {schedule_data !== undefined && schedule_data!=null && schedule_data.dial_pattern !== undefined && schedule_data.dial_pattern.fluid_amount!=''?
                                        schedule_data.dial_pattern.fluid_amount+"L" :""}
                                </td>
                            </tr>

                        </table>
                    </div>
                </div>
                <div className={`flex`}>
                    <div className={`w70 print-area-b`}>
                        <div className="graph_area d-flex" style={{border:'1px solid', overflow:'hidden'}}>
                            <div className="ml-2 mt-4" style={{fontSize:'1rem',width:60}}>
                                <div className="text-center mt-1 ml-3 d-flex">
                                    <div>脈拍</div>
                                    <div className="ml-2" style={{color:colors.pulseLineColor, paddingTop:'0.5rem'}}>■</div>
                                </div>
                                <div className="text-center ml-3 mt-1 d-flex">
                                    <div className={`mt-2`}>血圧</div>
                                    <div className="ml-2">
                                        <div style={{color: colors.bloodLineColor}}>▼</div>
                                        <div style={{marginTop:"-8px",color:colors.bloodLineColor, paddingTop:'0.5rem'}}>▲</div>
                                    </div>
                                </div>
                            </div>
                            <DialChart
                                showData={this.state.graph_data}
                                start_time = {start_time}
                                end_time = {end_time}
                                ref = {this.ChartRef}
                                height={35}
                                min_x = {this.min_x}
                                x_range = {this.props.x_range>0?this.props.x_range:5}
                            />
                        </div>
                        <div className={`data-area`}>
                            <table className="table-scroll table table-bordered measure-table">
                                <tr>
                                    <td className="td-title">総除水量</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_target_drainage);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp!=''?parseFloat(temp).toFixed(2):''}</td>
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
                                    {this.display_measure_data.length == 0 && (
                                        <>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </>
                                    )}
                                </tr>
                                <tr>
                                    <td className="td-title">除水速度</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_drainage_cur_speed);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp!=''?parseFloat(temp).toFixed(2):''}</td>
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
                                    {this.display_measure_data.length == 0 && (
                                        <>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </>
                                    )}
                                </tr>
                                <tr>
                                    <td className="td-title">除水量</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_cur_drainage);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp!=''?parseFloat(temp).toFixed(2):''}</td>
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
                                    {this.display_measure_data.length == 0 && (
                                        <>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </>
                                    )}                                    
                                </tr>
                                <tr>
                                <td className="td-title">血流量</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_blood_cur_flow);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp!=''?parseInt(temp):''}</td>
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
                                    {this.display_measure_data.length == 0 && (
                                        <>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </>
                                    )}                                     
                                </tr>
                                <tr>
                                    <td className="td-title">静脈圧</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_venous_pressure);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp!=''?parseInt(temp):''}</td>                                                    
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
                                    {this.display_measure_data.length == 0 && (
                                        <>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </>
                                    )}
                                </tr>
                                <tr>
                                    <td className="td-title">透析液圧</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_fluid_pressure);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp!=''?parseInt(temp):''}</td>
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
                                    {this.display_measure_data.length == 0 && (
                                        <>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </>
                                    )}
                                </tr>
                                <tr>
                                    <td className="td-title">透析液温度</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_dialysate_cur_temperature);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp!=''?parseFloat(temp).toFixed(1):''}</td>
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
                                    {this.display_measure_data.length == 0 && (
                                        <>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </>
                                    )}
                                </tr>
                                <tr>
                                    <td className="td-title">補液速度</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_fluid_speed);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp!=''?parseFloat(temp).toFixed(2):''}</td>
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
                                    {this.display_measure_data.length == 0 && (
                                        <>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </>
                                    )}
                                </tr>
                                <tr>
                                    <td className="td-title">現在補液量</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                temp = removeLeadZeros(this.display_measure_data[key].ms_fluid_cur_amount);
                                                return(
                                                <>
                                                    <td className='small-td'>{temp!=''?parseFloat(temp).toFixed(2):''}</td>
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
                                    {this.display_measure_data.length == 0 && (
                                        <>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </>
                                    )}                                    
                                </tr>
                                <tr>
                                    <td className="td-title">補液回数</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                return(
                                                <>
                                                    <td className='small-td'>{removeLeadZeros(this.display_measure_data[key].ms_hdf_count)}</td>
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
                                    {this.display_measure_data.length == 0 && (
                                        <>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </>
                                    )}                                    
                                </tr>
                                <tr>
                                    <td className="td-title">総補液量</td>
                                    {this.display_measure_data.length > 0 && 
                                        Object.keys(this.time_series).map(key =>{
                                            if (this.display_measure_data[key] != undefined) {
                                                return(
                                                <>
                                                    <td className='small-td'>{removeLeadZeros(this.display_measure_data[key].ms_hdf_amount)}</td>
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
                                    {this.display_measure_data.length == 0 && (
                                        <>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </>
                                    )}                                    
                                </tr>
                                
                                <tr>
                                    <td className="td-title">入力時間</td>
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
                                    }
                                    {this.display_measure_data.length == 0 && (
                                        <>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </>
                                    )}                                    
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className={`w30 ml10`}>
                        <div></div>
                        <div className={`flex`}>

                        </div>
                        <div className={`border`}>
                            <div className={`border-bottom text-center`}>
                                注射
                            </div>
                            <div className={`scroll`} style={{minHeight:"150px"}}>
                                {injection != null && injection.length >0 && (
                                    injection.map((pres_item)=>{
                                        return (
                                            <>
                                                <div>
                                                    {pres_item.is_temporary != null && pres_item.is_temporary == 0 ? "【定期注射】" :"【臨時注射】"}
                                                </div>
                                                {pres_item.data_json!== null && pres_item.data_json.length>0 && (
                                                    pres_item.data_json.map(medicine=>{
                                                        return(
                                                            <>
                                                                {medicine.item_name != "" && (
                                                                    <div>
                                                                        {pres_item.is_completed==1?"済) ":"未) "}{medicine.item_name}
                                                                    </div>
                                                                )}
                                                            </>
                                                        )
                                                    })
                                                )}
                                            </>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                        {/*<div className={`border`}>*/}
                        {/*    <div className={`border-bottom text-center`}>*/}
                        {/*        &nbsp;*/}
                        {/*    </div>*/}
                        {/*    <div className={`scroll`} style={{minHeight:"150px"}}></div>*/}
                        {/*</div>*/}
                        <div className={`border`}>
                            <div className={`border-bottom text-center`}>
                                検査
                            </div>
                            <div className={`scroll`} style={{minHeight:"150px"}}>
                                {inspection != null && inspection.length >0 && this.state.examination_codes !== undefined && (
                                    inspection.map((pres_item)=>{
                                        return (
                                            <>
                                                <div>
                                                   {pres_item.is_temporary != null && pres_item.is_temporary == 0 ? "【定期検査】" :"【臨時検査】"}
                                                </div>
                                                <div>
                                                    {pres_item.is_completed==1?"済) ":"未) "}{pres_item.examination_code != null && this.state.examination_codes[pres_item.examination_code]}
                                                </div>
                                            </>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/*<div className="d-flex w-100">*/}
                    {/*<div className="current_diseases border border-dark w-50">*/}
                        {/*<div className="text-center border-bottom border-dark" style={{fontSize:16}}>現  症</div>*/}
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
                {/*</div>*/}
                <div className={`treat-monitor`}>
                    <table className="table-scroll table table-bordered mt5 border-thick-table w-100">
                        <tr>
                            <td className={`text-center w5`}>時間</td>
                            <td className={`text-center w40`}>経過</td>
                            <td className={`text-center w40`}>処置</td>
                            <td className={`text-center w15`}>入力者</td>
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
                                                        {item.map((sub_item, sub_index) => {
                                                            if (this.checkSO(sub_item.value.category_2)) soap_left_body += sub_item.value.body +'\n';
                                                            if (!this.checkSO(sub_item.value.category_2)) soap_right_body += sub_item.value.body +'\n';

                                                            if (sub_index == item.length-1){
                                                                return(
                                                                <>
                                                                    <td className="">{displayLineBreak(this.removeLabel(soap_left_body))}</td>
                                                                    <td className="">{displayLineBreak(this.removeLabel(soap_right_body))}</td>
                                                                </>
                                                                )
                                                            }
                                                        })}
                                                        {/* <td>{(item[0].value.instruction_doctor_number != null) ? doctor_list_by_number[item[0].value.instruction_doctor_number]: ""}</td> */}
                                                        <td>{item[0].value.updated_by !== null?staff_list_by_number[item[0].value.updated_by]: ""}</td>
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
                                                        <td>{item.value.updated_by !== null?staff_list_by_number[item.value.updated_by]: ""}</td>
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

DialRecord_B.contextType = Context;

DialRecord_B.propTypes = {
    print_data: PropTypes.object,
    closeModal: PropTypes.func,
    rows_blood: PropTypes.array,
    rows_measure: PropTypes.array,
    rows_temp: PropTypes.array,
    schedule_data: PropTypes.object,
    x_range:PropTypes.number,
};

export default DialRecord_B;