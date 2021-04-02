import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import * as methods from "~/components/templates/Dial/DialMethods";
import SelectorWithLabelIndex from "~/components/molecules/SelectorWithLabelIndex";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as sessApi from "~/helpers/cacheSession-utils";
import {makeList_code, makeList_codeName, 
  setDateColorClassName
} from "~/helpers/dialConstants";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import NumericInputWithUnitLabel from "~/components/molecules/RemComponents/NumericInputWithUnitLabel";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import DatePicker from "react-datepicker";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import { formatDateLine, 
  formatDateTimeIE 
} from "../../../../../../helpers/date";
import CalcDial from "~/components/molecules/CalcDial";
import Spinner from "react-bootstrap/Spinner";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  font-size: 0.875rem;
  width: 100%;
  height: 90%;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
 .a_tag{
    text-decoration: underline;
    color: blue;
    cursor:pointer;
    margin-left:2rem;
 } 
 .selected, .selected:hover{
    background:lightblue!important;      
 }
.ex-label {    
    width: 45px;
    text-align: center;
    margin-left:10px;    
    border:1px solid;
    height:25px;
    padding-top:3px;
}
.left-area{
    width:57%;
    margin-right:2%;
    .ex-label {
        width:150px;
        margin-left:25px;
        margin-right:0px;
        height:25px;
        padding-top:3px;
    }
}
.right-area{
    width:40%;    
}
.radio-area{
    input{
        width:85px;
    }
    position: fixed;
    right: 16%;
    margin-top: -1.5rem;
    label{
        font-size: 1rem;
    }
}
.sub-body {
    border:1px solid;
}
.record{
    margin-top: 5px;
    margin-left: 10px;
}
.unit-area {
    width:85px;
    text-align: center;
}
.item-name{
    width:100px;
    text-align: center;
}
.next-value-area{
    margin-left:10px;
    margin-right:10px;
    .label-title{
        display:none;
    }
    input{
        width:100px;
    }
    .pullbox-label, .pullbox-select{
        width:100px;
    }
    .numeric-input{
        margin-top:-3px;
        width:100px;
    }
}
.second-input-area{
    input{
        height: 30px;
        margin-top: -12px;
    }
}
.next-value-area input {
    height: 30px;
 }
 .pullbox-select {
    height: 30px;
 } 
.right-top{
    height:138px;
}
.anti-area{
    width:80%;
}
.anti-title-area{
    width:100%;
    .ex-label{
        width: auto;
        padding-left: 7px;
        padding-right: 7px;
        height: 30px;
        padding-top: 3px;
    }
    .pullbox-select, .pullbox-label{
        width:auto;
        min-width:350px;
    }
    .pullbox-select {
        padding-right: 25px;
    }
}
.anti-item-area{
    padding-left:25%;
    .ex-label{
        width:100px;
    }
    .item-name{
        width:65px;
    }    
}

  .panel-menu {
    width: 100%;
    margin-bottom: 20px;
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
        width: calc(100% - 600px);
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
    }
  }
  .gender {
    font-size: 0.75rem;
    margin-top: 0.3rem;
    margin-left: 1rem;
    .gender-label {
      width: 6.25rem;
      text-align: right;
      padding-right: 0.3rem;
      margin-top: 0.5rem;
      float: left;
      font-size: 1rem;
    }
  }
  .selet-day-check {
    margin-top: 0.3rem;
    padding-top:0.5rem;
    label {
        width: 100%;
        padding-left: 0.625rem;
        input {
            top: 1px;
        }
    }
  }
  .radio-group-btn label{
    width: 2.2rem;
    padding: 0.5rem 0px 2px 0px;
    border-radius:0;
    border: 1px solid lightgray;
    margin-left:2px;
    margin-right:2px;
  }
  .no-dial-day {
    width: 1.875rem;
    display: inline-block;
  }
  .footer {
    position: absolute;
    right: 100px;    
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
  .alert-area{
      text-algin:center;
      font-size:20px;
  }
  .div_return_fail{
    color: #FF6633;
    text-align: center;
    font-size: 0.825rem;
  }
  .unit-label{
    width:4rem;
    padding-top:3px;
    margin-left:5px;
  }
`;


const dilution_timings = {
     0: "前補液",
     1: "後補液",
};

class DialCondition extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        let dial_method_master = sessApi.getObjectValue("dial_common_master","dial_method_master");
        // let code_master = sessApi.getObjectValue('dial_common_master', 'code_master');
        let material_master = sessApi.getObjectValue('dial_common_master', 'material_master');
        let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");        
        let dial_liquid_data = material_master['透析液'];
        let default_array = this.getTelegramDefaultValue();        

        this.state = {
            dial_method_master,
            dial_method_list: makeList_code(dial_method_master,1),
            dial_method_list_options: makeList_codeName(dial_method_master,1),
            dial_liquid_list:makeList_code(dial_liquid_data,1),
            dial_liquid_list_options:makeList_codeName(dial_liquid_data,1),
            karte_data:this.props.karte_data,
            start_date:this.props.karte_data.dial.start_date,
            default_array,
            schedule_date,
            error_msg: [],     
            isOpenCalcModal: false,  
            calcUnit: "",
            calcTitle: "",      
            alert_message: '',
        }
        this.dial_method = null;
        this.can_open_calc = false;
    }

    async componentDidMount(){        
        await this.getDialyzerCode();
        await this.getAllMasterAntiPattern();
        await this.getAllMasterAnti();
        await this.setReservationRange();        
        this.can_open_calc = true;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.karte_data.dial.dial_method.after != undefined && nextProps.karte_data.dial.dial_method.after!=null && nextProps.karte_data.dial.dial_method.after!=''){
            this.dial_method = nextProps.karte_data.dial.dial_method.after;
            this.setDefaultValue(this.dial_method, nextProps.karte_data);
            return;
        }
        if (this.dial_method != nextProps.karte_data.dial.dial_method.prev){
            this.dial_method = nextProps.karte_data.dial.dial_method.prev;
            this.setDefaultValue(this.dial_method, nextProps.karte_data);
        }

    }
    setReservationRange () {
        let dial_tiems = [
            { id: 0, value: "" },
            { id: 1, value: "3:00" },
            { id: 2, value: "3:30" },
            { id: 3, value: "4:00" },
            { id: 4, value: "4:30" },
            { id: 5, value: "4:45" },
            { id: 6, value: "5:00" },
            { id: 7, value: "6:00" },
            { id: 8, value: "6:30" },
            { id: 9, value: "7:00" },
            { id: 10, value: "" },
        ];
        let index = 11;
        for(let hour = 1; hour < 8; hour++){
            for(let minutes = 0; minutes < 60; minutes+=5){
                let dial_tiem = '';
                if(minutes < 10){
                    dial_tiem = {id: index, value: hour + ":" + "0" + minutes};
                } else {
                    dial_tiem = {id: index, value: hour + ":" + minutes};
                }
                dial_tiems[index]= dial_tiem;
                index++;
            }
        }
        dial_tiems[index]= {id: index, value: "8:00"};
        this.setState({dial_tiems,})
    }

    setDefaultValue = (dial_method = 0, new_karte_data = null) =>{
        let default_array = this.getTelegramDefaultValue(dial_method);        
        var karte_data = this.state.karte_data;
        if (new_karte_data!=null) karte_data = new_karte_data;
        if(default_array != undefined && default_array != null && Object.keys(default_array).length !== 0){
            Object.keys(default_array).map(index=>{
                let item = default_array[index];
                if (item.is_usable === 0) {
                    // if(index == "weight_before" || index == "target_water_removal_amount") {
                    //     temp[index] = "";
                    // } else if (index == "syringe_stop_time" || index == "syringe_speed" || index == "syringe_amount"){
                    //     temp.dial_anti[index] = "";
                    // } else {
                    //     temp.dial_pattern[index] = "";
                    // }
                    if (karte_data.dial[index] != undefined && karte_data.dial[index].after != undefined){                        
                        karte_data.dial[index].after = '';
                    }
                }
            });
        }
        
        this.setState({            
            default_array,
            karte_data,
        })
    };

    checkChanged = (karte_data) => {
        if (karte_data.dial.dw.prev != karte_data.dial.dw.after) return true;
        if (karte_data.dial.dialysate_amount.prev != karte_data.dial.dialysate_amount.after) return true
        if (karte_data.dial.blood_flow.prev != karte_data.dial.blood_flow.after) return true
        if (karte_data.dial.fluid_speed.after != '' && karte_data.dial.fluid_speed.prev != karte_data.dial.fluid_speed.after) return true
        if (karte_data.dial.dial_method_name.after != '' && karte_data.dial.dial_method_name.prev != karte_data.dial.dial_method_name.after) return true
        if (karte_data.dial.dial_liquid_name.after != '' && karte_data.dial.dial_liquid_name.prev != karte_data.dial.dial_liquid_name.after) return true
        if (karte_data.dial.reservation_time.after != '' && karte_data.dial.reservation_time.prev != karte_data.dial.reservation_time.after) return true
        if (karte_data.dial.dial_dialyzer.after != '' && karte_data.dial.dial_dialyzer.prev[0].dialyzer_code != karte_data.dial.dial_dialyzer.after[0].dialyzer_code) return true
        if (karte_data.dial.dilution_timing.after != '' && karte_data.dial.dilution_timing.prev != karte_data.dial.dilution_timing.after) return true
        if (karte_data.dial.hdf_init_time.after != '' && karte_data.dial.hdf_init_time.prev != karte_data.dial.hdf_init_time.after) return true
        if (karte_data.dial.hdf_init_amount.after != '' && karte_data.dial.hdf_init_amount.prev != karte_data.dial.hdf_init_amount.after) return true
        if (karte_data.dial.hdf_step.after != '' && karte_data.dial.hdf_step.prev != karte_data.dial.hdf_step.after) return true
        if (karte_data.dial.hdf_speed.after != '' && karte_data.dial.hdf_speed.prev != karte_data.dial.hdf_speed.after) return true
        if (karte_data.dial.dial_anti.after != '' && karte_data.dial.dial_anti.after.title != undefined && karte_data.dial.dial_anti.after.title != ''
            && karte_data.dial.dial_anti.prev.title != karte_data.dial.dial_anti.after.title) return true
        if (karte_data.dial.dial_anti.after != '' && karte_data.dial.dial_anti.after.anti_items != undefined && karte_data.dial.dial_anti.after.anti_items != null){
            if (karte_data.dial.dial_anti.after.anti_items.length > 0){
                karte_data.dial.dial_anti.after.anti_items.map((sub, index) => {
                    if (sub.amount != karte_data.dial.dial_anti.prev.anti_items[index].amount) return true
                })
            }
        }
        return false;
    }

    getNewMethod = e => {   
        var karte_data = this.state.karte_data;
        karte_data.dial.dial_method.after = parseInt(e.target.id);
        karte_data.dial.dial_method_name.after = this.state.dial_method_list[parseInt(e.target.id)];
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({karte_data});
        this.setDefaultValue(e.target.id);
        this.props.handleOk(karte_data);
    };
    getDialyser = (e, index) => {
        var karte_data = this.state.karte_data;
        if (karte_data.dial.dial_dialyzer.prev != '' && karte_data.dial.dial_dialyzer.prev.length > 0){            
            if (karte_data.dial.dial_dialyzer.after ==""){
                karte_data.dial.dial_dialyzer.after = [];
                karte_data.dial.dial_dialyzer.prev.map(item => {
                    karte_data.dial.dial_dialyzer.after.push({number:item.number});
                })
            }
            karte_data.dial.dial_dialyzer.after[index].dialyzer_code = e.target.id;
            karte_data.dial.dial_dialyzer.after[index].name = this.state.dialyzerCodeData[e.target.id];
        } else {
            karte_data.dial.dial_dialyzer.after = [{}];
            karte_data.dial.dial_dialyzer.after[0].dialyzer_code = e.target.id;
            karte_data.dial.dial_dialyzer.after[0].name = this.state.dialyzerCodeData[e.target.id];
        }
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({karte_data});
        this.props.handleOk(karte_data);
    }

    getAnticoagulationMethod = e => {
        var karte_data = this.state.karte_data;
        if (karte_data.dial.dial_anti.after == '') karte_data.dial.dial_anti.after = {};
        karte_data.dial.dial_anti.after.anticoagulation_code = e.target.id;
        karte_data.dial.dial_anti.after.title = e.target.value;
        if (e.target.id == 0) karte_data.dial.dial_anti.after = '';
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({karte_data});
        this.props.handleOk(karte_data);
    }

    getNewAntiItems = (index, e) => {
        if (parseFloat(e) < 0 ) e = 0;
        var karte_data = this.state.karte_data;
        
        if (karte_data.dial.dial_anti.after.anti_items == undefined || karte_data.dial.dial_anti.after.anti_items == null){
            if (karte_data.dial.dial_anti.after == '') karte_data.dial.dial_anti.after = {};
            karte_data.dial.dial_anti.after.anti_items = [];
            if (karte_data.dial.dial_anti.prev != '' && karte_data.dial.dial_anti.prev.anti_items != null && karte_data.dial.dial_anti.prev.anti_items.length > 0){
                karte_data.dial.dial_anti.prev.anti_items.map(item => {                
                    karte_data.dial.dial_anti.after.anti_items.push({number:item.number, detail_number:item.detail_number,item_code:item.item_code, name:item.name, unit:item.unit});
                })
            } else {
                karte_data.dial.dial_anti.after.anti_items.push({amount:0, item_code:4, name:'ＩＰダイヤル値', unit:'ml/hr', maxlength:4,});
                karte_data.dial.dial_anti.after.anti_items.push({amount:0, item_code:5, name:'事前停止', unit:'分前', maxlength:3,});
                karte_data.dial.dial_anti.after.anti_items.push({amount:0, item_code:9, name:'ワンショット', unit:'mL', maxlength:4,});
            }
        }
        let error_msg = this.state.error_msg;
        let anti_items;
        if (karte_data.dial.dial_anti.after.anti_items == undefined || karte_data.dial.dial_anti.after.anti_items == null){
            anti_items = karte_data.dial.dial_anti.prev.anti_items;
            if(anti_items[index].maxlength != 0 && e > 0 && e.toString().length >anti_items[index].maxlength){
                let msg = anti_items[index].name + "は " + anti_items[index].maxlength + "文字以内で入力してください";
                error_msg[index] = msg;
                this.setState({error_msg});
                return;
            }
        } else {
            anti_items = karte_data.dial.dial_anti.after.anti_items;
            if(anti_items[index].maxlength != 0 && e > 0 && e.toString().length >anti_items[index].maxlength){
                let msg = anti_items[index].name + "は " + anti_items[index].maxlength + "文字以内で入力してください";
                error_msg[index] = msg;
                this.setState({error_msg});
                return;
            }
        }
        
        if (error_msg[index] != undefined && error_msg[index] != null && error_msg[index] != ""){
            error_msg[index]='';
        }
        // karte_data.dial.dial_anti.after.anti_items[index].amount = parseFloat(e);
        karte_data.dial.dial_anti.after.anti_items[index].amount = e;
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({karte_data, error_msg});
        this.props.handleOk(karte_data);
    }

    getDialTime = e => {
        var karte_data = this.state.karte_data;        
        karte_data.dial.reservation_time.after = e.target.value;
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({karte_data});
        this.props.handleOk(karte_data);
    }

    getNewHdfStep = value => {
        if (parseFloat(value) < 0 ) value = 0;
        var karte_data = this.state.karte_data;
        karte_data.dial.hdf_step.after = parseInt(value);
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({karte_data});
        this.props.handleOk(karte_data);        
    }

    getNewHdfInitAmount = value => {
        if (parseFloat(value) < 0 ) value = 0;
        var karte_data = this.state.karte_data;
        karte_data.dial.hdf_init_amount.after = parseFloat(value);
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({karte_data});
        this.props.handleOk(karte_data);        
    }

    getNewHdfInitTime = value => {
        if (parseFloat(value) < 0 ) value = 0;
        var karte_data = this.state.karte_data;
        karte_data.dial.hdf_init_time.after = parseInt(value);
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({karte_data});
        this.props.handleOk(karte_data);        
    }

    getNewHdfSpeed = value => {
        if (parseFloat(value) < 0 ) value = 0;
        var karte_data = this.state.karte_data;
        karte_data.dial.hdf_speed.after = parseFloat(value);
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({karte_data});
        this.props.handleOk(karte_data);        
    }

    getNewFluidSpeed = value => {
        if (parseFloat(value) < 0 ) value = 0;
        var karte_data = this.state.karte_data;
        karte_data.dial.fluid_speed.after = parseFloat(value);
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({karte_data});
        this.props.handleOk(karte_data);
    }

    getNewBloodFlow = value=> {
        if (parseFloat(value) < 0 ) value = 0;
        var karte_data = this.state.karte_data;
        karte_data.dial.blood_flow.after = parseFloat(value);
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({karte_data});
        this.props.handleOk(karte_data);
    }

    getNewFluid = value=> {
        if (parseFloat(value) < 0 ) value = 0;
        var karte_data = this.state.karte_data;
        karte_data.dial.dialysate_amount.after = parseInt(value);
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({karte_data});
        this.props.handleOk(karte_data);
    }

    getNewDW = value=> {
        if (parseFloat(value) < 0 ) value = 0;
        var karte_data = this.state.karte_data;
        karte_data.dial.dw.after = parseFloat(value);
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({karte_data});
        this.props.handleOk(karte_data);
    }

    getNewDialLiquid = e => {
        var karte_data = this.state.karte_data;
        karte_data.dial.dial_liquid.after = parseInt(e.target.id);
        karte_data.dial.dial_liquid_name.after = this.state.dial_liquid_list[parseInt(e.target.id)];
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({karte_data});
        this.props.handleOk(karte_data);        
    }

    getDilutionTiming = e => {
        var karte_data = this.state.karte_data;
        karte_data.dial.dilution_timing.after = parseInt(e.target.id) >=0? parseInt(e.target.id):'';
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({karte_data});
        this.props.handleOk(karte_data);
    }

    setApplyPeriod = e => {
        var karte_data = this.state.karte_data;
        karte_data.dial.applied_status = parseInt(e.target.value);
        this.setState({karte_data});
    }

    removeFirstZero = (str) => {
        if (str == null || str =='') return '';        
        if (str.substring(0, 1) == '0'){            
            return str.substring(1, str.length);
        }
        return str;
    }

    getStartDate = value => {        
        var karte_data = this.state.karte_data;
        karte_data.dial.start_date = value;
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({start_date: value, karte_data});
        this.props.handleOk(karte_data);
    };

    getEndDate = value => {
        var start_date = new Date(formatDateLine(this.state.start_date));
        var end_date = new Date(formatDateLine(value));
        if (start_date>end_date){
            window.sessionStorage.setItem("alert_messages", '期間を正確に選択してください。');
            return;
        }
        var karte_data = this.state.karte_data;
        karte_data.dial.end_date = value;
        karte_data.dial_change_flag = this.checkChanged(karte_data);
        this.setState({end_date: value, karte_data});
        this.props.handleOk(karte_data);
    };

    getCheckAnotherDay = (name, value) => {
        if (name === "schedule"){
            if(value === 0){                
                this.setState({
                    checkAnotherDay:value,
                    checkdialdays:this.state.dialdays,
                })
            } else {
                this.setState({
                    checkAnotherDay: value,
                    checkdialdays:{0:true, 1:true, 2:true, 3:true, 4:true, 5:true, 6:true},
                });
            }
        }
    };

    // openCalc = (type, value, index = null) => {     
    openCalc = (type, value, unit, title, max_length, daysSelect, index = null) => {
        if (!this.can_open_calc) return;
        let days_select = daysSelect;
        if (unit == "分前") days_select = true;
        let _state = {
            calcInit: value != null && value != undefined ? value : 0,
            calcValType: type,
            calcUnit: unit,
            calcTitle: title,
            calcDigits: max_length,
            calcIndex: index,
            daysSelect: days_select,
            isOpenCalcModal: true,
            decimalPointDigits: 0,
        };
        if (type == "getNewAntiItems") {
            _state.decimalPointDigits = 2;
        }
        this.setState(_state);
    }

    calcCancel = () => {
        this.setState({
            isOpenCalcModal: false,
            calcValType: "",
            calcUnit: "",
            calcTitle: "",
            calcInit: 0
        });
    }

    calcConfirm = (val) => {
        let _state = {isOpenCalcModal: false};
        switch(this.state.calcValType) {
            case "getNewDW":
                this.getNewDW(val);
                break;
            case "getNewFluid":
                this.getNewFluid(val);
                break;
            case "getNewBloodFlow":
                this.getNewBloodFlow(val);
                break;
            case "getNewFluidSpeed":
                this.getNewFluidSpeed(val);
                break;
            case "getNewHdfInitTime":
                this.getNewHdfInitTime(val);
                break;
            case "getNewHdfInitAmount":
                this.getNewHdfInitAmount(val);
                break;
            case "getNewHdfStep":
                this.getNewHdfStep(val);
                break;
            case "getNewHdfSpeed":
                this.getNewHdfSpeed(val);
                break;   
            case "getNewAntiItems":
                this.getNewAntiItems(this.state.calcIndex, val);
                break;                
        }
        // this.getNewAntiItems(this.state.calcIndex, val);                
        
        _state.calcValType = "";
        _state.calcInit = 0;
        _state.calcTitle = "";
        _state.calcUnit = "";
        // _state.anti_items = anti_items;

        this.setState(_state);
    }

    goToDialPattern(url){
      this.props.history.replace(url);
    }

    render() {        
        let dializers = [{id:0, vlaue:''}];
        if(this.state.dialyzerCodeData != undefined){
            dializers = this.state.dialyzer_options_list;
        }
        var anticoagulation_master_pattern_list_select = [{id:0, vlaue:''}];
        if (this.state.anticoagulation_master_pattern_list_select != undefined){
            anticoagulation_master_pattern_list_select = this.state.anticoagulation_master_pattern_list_select;
        }        
        var dial_data = this.state.karte_data.dial;
        var dial_dialyzer = dial_data.dial_dialyzer.prev;        
        var default_array = this.state.default_array;

        var after_anti_items = (dial_data.dial_anti.after != '' && dial_data.dial_anti.after.anti_items != null)?dial_data.dial_anti.after.anti_items:null;        
        return  (          
              <Wrapper>
              {this.props.karte_data.dial_exist === true && this.props.is_loaded === true && (
                  <>
                  <div className="flex">
                      <div className="left-area">
                          <div className="sub-title">基本設定</div>
                          <div className="sub-body">
                              <div className="record flex">
                                  <label className="item-name">DW</label>
                                  <label className="ex-label">{dial_data.dw.prev!=''?parseFloat(dial_data.dw.prev).toFixed(1):''}</label><label className='unit-label'>kg</label><label className="item-name">➝</label>
                                  <div className="next-value-area">
                                      <NumericInputWithUnitLabel
                                          label=''
                                          value={dial_data.dw.after}
                                          getInputText={this.getNewDW.bind(this)}
                                          onClickEvent={()=>this.openCalc("getNewDW", dial_data.dw.after, "kg", "DW", 0, false)}
                                          precision={1}
                                          step={0.1}
                                          min = {0}
                                          inputmode="numeric"
                                          unit = {'kg'}
                                      />
                                  </div>
                                  
                              </div>
                              <div className="record flex">
                                  <label className="item-name">治療法</label>
                                  <label className="ex-label">{dial_data.dial_method_name.prev}</label><label className='unit-label'></label><label className="item-name">➝</label>
                                  <div className="next-value-area">
                                      <SelectorWithLabel
                                          options={this.state.dial_method_list_options}
                                          title=""
                                          getSelect={this.getNewMethod}
                                          departmentEditCode={dial_data.dial_method.after}
                                      />
                                  </div>
                              </div>
                              <div className="record flex">
                                  <label className="item-name">透析液</label>
                                  <label className="ex-label">{dial_data.dial_liquid_name.prev}</label><label className='unit-label'></label><label className="item-name">➝</label>
                                  <div className="next-value-area">
                                      <SelectorWithLabel
                                          options={this.state.dial_liquid_list_options}
                                          title=""
                                          getSelect={this.getNewDialLiquid.bind(this)}
                                          departmentEditCode={dial_data.dial_liquid.after}
                                      />
                                  </div>
                              </div>
                              <div className="record flex">
                                  <label className="item-name">透析液流量</label>
                                  <label className="ex-label">{dial_data.dialysate_amount.prev}</label><label className='unit-label'>mL/min</label><label className="item-name">➝</label>
                                  <div className="next-value-area">
                                      <NumericInputWithUnitLabel
                                          label=''
                                          value={dial_data.dialysate_amount.after}
                                          getInputText={this.getNewFluid.bind(this)}
                                          onClickEvent={()=>this.openCalc("getNewFluid", dial_data.dialysate_amount.after, "mL/min", "透析液流量", 0, false)}
                                          inputmode="numeric"
                                          step = {10}
                                          min = {0}
                                          unit = {'mL/min'}
                                      />
                                  </div>
                              </div>
                              <div className="record flex">
                                  <label className="item-name">透析時間</label>
                                  <label className="ex-label">{this.removeFirstZero(dial_data.reservation_time.prev)}</label><label className='unit-label'></label><label className="item-name">➝</label>
                                  <div className="next-value-area">
                                      <SelectorWithLabel
                                          title="透析時間"
                                          options={this.state.dial_tiems != undefined && this.state.dial_tiems != null && this.state.dial_tiems}
                                          getSelect={this.getDialTime.bind(this)}
                                          value={dial_data.reservation_time.after}
                                      />
                                  </div>
                              </div>
                              <div className="record flex">
                                  <label className="item-name">血流量</label>
                                  <label className="ex-label">{dial_data.blood_flow.prev}</label><label className='unit-label'>mL/min</label><label className="item-name">➝</label>
                                  <div className="next-value-area">
                                      <NumericInputWithUnitLabel
                                          label=''
                                          value={dial_data.blood_flow.after}                                            
                                          getInputText={this.getNewBloodFlow.bind(this)}  
                                          onClickEvent={()=>this.openCalc("getNewBloodFlow", dial_data.blood_flow.after, "mL/min", "血流量", 0, false)}                                          
                                          step={10}
                                          min = {0}
                                          inputmode="numeric"
                                          disabled={Object.keys(default_array).length !== 0 && default_array.blood_flow.is_usable === 0}
                                          unit = {'mL/min'}
                                      />
                                  </div>
                              </div>
                              {dial_dialyzer != null &&  dial_dialyzer != '' && dial_dialyzer.length>0 && (
                                  dial_dialyzer.map((item, index) => {
                                      if (index == 0){
                                          return(
                                              <>
                                              <div className="record flex">
                                                  <label className="item-name">ダイアライザー</label>
                                                  <label className="ex-label">{item.name}</label><label className='unit-label'></label><label className="item-name">➝</label>
                                                  <div className="next-value-area">
                                                      <SelectorWithLabel
                                                          options={dializers}
                                                          getSelect={e => this.getDialyser(e, index)}
                                                          departmentEditCode={(dial_data.dial_dialyzer.after != '' && dial_data.dial_dialyzer.after[index] != undefined)?dial_data.dial_dialyzer.after[index].dialyzer_code:''}
                                                      />
                                                  </div>
                                              </div>
                                              </>
                                          )
                                      }
                                      
                                  })
                              )}
                              {dial_dialyzer == '' && (
                                  <>
                                  <div className="record flex">
                                      <label className="item-name">ダイアライザー</label>
                                      <label className="ex-label"></label><label className='unit-label'></label><label className="item-name">➝</label>
                                      <div className="next-value-area">
                                          <SelectorWithLabel
                                              options={dializers}
                                              getSelect={e => this.getDialyser(e, 0)}
                                              departmentEditCode={(dial_data.dial_dialyzer.after != '' && dial_data.dial_dialyzer.after[0] != undefined)?dial_data.dial_dialyzer.after[0].dialyzer_code:''}
                                          />
                                      </div>
                                  </div>
                                  </>
                              )}                                                            
                          </div>
                      </div>
                      
                      <div className="right-area">
                          <div className="right-top">
                              <div className="sub-title">HDF設定</div>
                              <div className="sub-body">
                                  <div className="record flex">
                                      <label className="item-name">前・後補液</label>
                                      <label className="ex-label">{dial_data.dilution_timing.prev!=null?dilution_timings[dial_data.dilution_timing.prev]:''}</label><label className='unit-label'></label><label className="item-name">➝</label>
                                      <div className="next-value-area">
                                          <SelectorWithLabelIndex
                                              options={dilution_timings}
                                              title=""
                                              getSelect={this.getDilutionTiming}
                                              departmentEditCode={dial_data.dilution_timing.after}
                                              isDisabled={Object.keys(default_array).length !== 0 && default_array.dilution_timing.is_usable !== undefined && default_array.dilution_timing.is_usable === 0}
                                          />                                        
                                      </div>
                                  </div>
                                  <div className="record flex">
                                      <label className="item-name">補液速度</label>
                                      <label className="ex-label">{dial_data.fluid_speed.prev}</label><label className='unit-label'>L/h</label><label className="item-name">➝</label>
                                      <div className="next-value-area">
                                          <NumericInputWithUnitLabel
                                              label=''
                                              value={dial_data.fluid_speed.after}
                                              getInputText={this.getNewFluidSpeed.bind(this)}
                                              onClickEvent={()=>this.openCalc("getNewFluidSpeed", dial_data.fluid_speed.after, "L/h", "補液速度", 0, false)} 
                                              inputmode="numeric"
                                              step = {0.1}
                                              min = {0}
                                              disabled = {Object.keys(default_array).length !== 0 && default_array.fluid_speed.is_usable === 0}
                                              unit = {'L/h'}
                                          />
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div className="right-bottom" style={{}}>
                              <div className="sub-title">I-HDF設定</div>
                              <div className="sub-body">
                              <div className="record flex">
                                      <label className="item-name">初回補液時間</label>
                                      <label className="ex-label">{dial_data.hdf_init_time.prev}</label><label className='unit-label'>min</label><label className="unit-area">➝</label>
                                      <div className="next-value-area">
                                          <NumericInputWithUnitLabel
                                              label=''
                                              value={dial_data.hdf_init_time.after}
                                              getInputText={this.getNewHdfInitTime.bind(this)}
                                              onClickEvent={()=>this.openCalc("getNewHdfInitTime", dial_data.hdf_init_time.after, "分", "初回補液時間", 0, true)} 
                                              inputmode="numeric"
                                              min = {0}
                                              disabled = {Object.keys(default_array).length !== 0 && default_array.hdf_init_time.is_usable === 0}
                                              unit={'min'}
                                          />
                                      </div>
                                  </div>
                                  <div className="record flex">
                                      <label className="item-name">1回補液量</label>
                                      <label className="ex-label">{dial_data.hdf_init_amount.prev}</label><label className='unit-label'>mL</label><label className="unit-area">➝</label>
                                      <div className="next-value-area">
                                          <NumericInputWithUnitLabel
                                              label=''
                                              value={dial_data.hdf_init_amount.after}
                                              getInputText={this.getNewHdfInitAmount.bind(this)}
                                              onClickEvent={()=>this.openCalc("getNewHdfInitAmount", dial_data.hdf_init_amount.after, "mL", "1回補液量", 0, false)} 
                                              inputmode="numeric"
                                              step = {0.1}
                                              min = {0}
                                              disabled = {Object.keys(default_array).length !== 0 && default_array.hdf_init_amount.is_usable === 0}
                                              unit = {'mL'}
                                          />
                                      </div>
                                  </div>
                                  <div className="record flex">
                                      <label className="item-name">補液間隔</label>
                                      <label className="ex-label">{dial_data.hdf_step.prev}</label><label className='unit-label'>min</label><label className="unit-area">➝</label>
                                      <div className="next-value-area">
                                          <NumericInputWithUnitLabel
                                              label=''
                                              value={dial_data.hdf_step.after}
                                              getInputText={this.getNewHdfStep.bind(this)}
                                              onClickEvent={()=>this.openCalc("getNewHdfStep", dial_data.hdf_step.after, "分", "補液間隔", 0, true)} 
                                              inputmode="numeric"
                                              step = {1}
                                              min = {0}
                                              disabled = {Object.keys(default_array).length !== 0 && default_array.hdf_init_amount.is_usable === 0}
                                              unit = {'min'}
                                          />
                                      </div>
                                  </div>                                
                                  <div className="record flex">
                                      <label className="item-name">1回補液速度</label>
                                      <label className="ex-label">{dial_data.hdf_speed.prev}</label><label className='unit-label'>mL/min</label><label className="unit-area">➝</label>
                                      <div className="next-value-area">
                                          <NumericInputWithUnitLabel
                                              label=''
                                              value={dial_data.hdf_speed.after}
                                              getInputText={this.getNewHdfSpeed.bind(this)}
                                              onClickEvent={()=>this.openCalc("getNewHdfSpeed", dial_data.hdf_speed.after, "mL/min", "1回補液速度", 0, false)}
                                              inputmode="numeric"
                                              step = {0.1}
                                              min = {0}
                                              disabled = {Object.keys(default_array).length !== 0 && default_array.hdf_speed.is_usable === 0}
                                              unit = {'mL/min'}
                                          />
                                      </div>
                                  </div>
                              </div>
                          </div>
                          
                      </div>
                      
                      <div className='anti-area'>
                          <div className="record flex anti-title-area">
                              <label className="item-name">抗凝固剤</label>
                              <label className="ex-label" style={{minWidth:'150px'}}>{dial_data.dial_anti.prev != null && dial_data.dial_anti.prev != ''? dial_data.dial_anti.prev.title:''}</label>
                              <label className='unit-label'></label>
                              <label className="item-name">➝</label>
                              <div className="next-value-area">
                                  <SelectorWithLabel
                                      options={anticoagulation_master_pattern_list_select}
                                      title=""
                                      getSelect={this.getAnticoagulationMethod.bind(this)}
                                      departmentEditCode={dial_data.dial_anti.after != ''?dial_data.dial_anti.after.anticoagulation_code:''}
                                  />
                              </div>                                
                          </div>
                      
                      {dial_data.dial_anti.prev != null && dial_data.dial_anti.prev.anti_items != null && dial_data.dial_anti.prev.anti_items.length > 0 && (
                          dial_data.dial_anti.prev.anti_items.map((item, index) => {                                
                              return(
                                  <>
                                  <div className="record flex anti-item-area">
                                      <label style={{width:'100px'}} className="item-name">{item.name}</label>
                                      <label className="ex-label">{item.amount}</label><label className='unit-label'>{item.unit}</label><label className="item-name">➝</label>
                                      <div className="next-value-area second-input-area">
                                          {item.category =='事前停止' ? (
                                              <InputWithLabel
                                                  label=""
                                                  type="number"
                                                  getInputText={this.getNewAntiItems.bind(this, index)}
                                                  diseaseEditData={(after_anti_items != null && after_anti_items[index] != undefined)?after_anti_items[index].amount:''}
                                                  onClick={()=>this.openCalc("getNewAntiItems", (after_anti_items != null && after_anti_items[index] != undefined)?after_anti_items[index].amount:'', item.unit, item.name, item.maxlength, false, index)}
                                              />                                                
                                          ) : (
                                              <InputWithLabel
                                                  label=""
                                                  type="number"
                                                  getInputText={this.getNewAntiItems.bind(this, index)}
                                                  diseaseEditData={(after_anti_items != null && after_anti_items[index] != undefined)?after_anti_items[index].amount:''}
                                                  onClick={()=>this.openCalc("getNewAntiItems", (after_anti_items != null && after_anti_items[index] != undefined)?after_anti_items[index].amount:'', item.unit, item.name, item.maxlength, false, index)}
                                              />                                                
                                          )}
                                      </div>
                                      <label>{item.unit}</label>
                                  </div>
                                  {this.state.error_msg[index] && (
                                      <div className="warning div_return_fail">
                                          <div className="div_notify" role="alert">
                                          {this.state.error_msg[index]}
                                          </div>
                                      </div>
                                  )}
                                  </>
                              )
                          })
                      )}
                      {dial_data.dial_anti.prev == '' && dial_data.dial_anti.after != '' && dial_data.dial_anti.after.anticoagulation_code>0 && (
                          <>
                          <div className="record flex anti-item-area">
                              <label style={{width:'100px'}} className="item-name">ＩＰダイヤル値</label>
                              <div className="next-value-area second-input-area">
                                  <InputWithLabel
                                      label=""
                                      type="number"
                                      getInputText={this.getNewAntiItems.bind(this, 0)}
                                      diseaseEditData={(after_anti_items != null && after_anti_items[0] != undefined)?after_anti_items[0].amount:''}
                                      onClick={()=>this.openCalc("getNewAntiItems", (after_anti_items != null && after_anti_items[0] != undefined)?after_anti_items[0].amount:'', 'ml/hr', 'ＩＰダイヤル値', 4, false, 0)}
                                  />
                              </div>
                              <label>ml/hr</label>
                          </div>
                          <div className="record flex anti-item-area">
                              <label style={{width:'100px'}} className="item-name">事前停止</label>
                              <div className="next-value-area second-input-area">
                                  <InputWithLabel
                                      label=""
                                      type="number"
                                      getInputText={this.getNewAntiItems.bind(this, 1)}
                                      diseaseEditData={(after_anti_items != null && after_anti_items[1] != undefined)?after_anti_items[1].amount:''}
                                      onClick={()=>this.openCalc("getNewAntiItems", (after_anti_items != null && after_anti_items[1] != undefined)?after_anti_items[1].amount:'', '分前', '事前停止', 3, false, 1)}
                                  />
                              </div>
                              <label>分前</label>
                          </div>
                          <div className="record flex anti-item-area">
                              <label style={{width:'100px'}} className="item-name">ワンショット</label>
                              <div className="next-value-area second-input-area">
                                  <InputWithLabel
                                      label=""
                                      type="number"
                                      getInputText={this.getNewAntiItems.bind(this, 2)}
                                      diseaseEditData={(after_anti_items != null && after_anti_items[2] != undefined)?after_anti_items[2].amount:''}
                                      onClick={()=>this.openCalc("getNewAntiItems", (after_anti_items != null && after_anti_items[2] != undefined)?after_anti_items[2].amount:'', 'mL', 'ワンショット', 4, false, 2)}
                                  />
                              </div>
                              <label>mL</label>
                          </div>
                          </>
                      )}
                      </div>
                  </div>
                  {dial_data.only_today_change != true ? (
                      <>
                      <DatePickerBox style={{height:'auto'}}>
                      <div className='radio-area'>
                          <div className='flex'>
                            <label style={{marginRight:'10px'}}>開始日</label>
                            <DatePicker
                              locale="ja"
                              selected={formatDateTimeIE(this.state.karte_data.dial.start_date)}
                              onChange={this.getStartDate.bind(this)}
                              dateFormat="yyyy/MM/dd"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              dayClassName = {date => setDateColorClassName(date)}
                            />
                            <span style={{marginLeft:'5px',marginRight:'5px' }}>～</span>
                            <DatePicker
                              locale="ja"
                              selected={formatDateTimeIE(this.state.karte_data.dial.end_date)}
                              onChange={this.getEndDate.bind(this)}
                              dateFormat="yyyy/MM/dd"
                              showMonthDropdown
                              minDate={formatDateTimeIE(this.state.karte_data.dial.start_date)}
                              showYearDropdown
                              dropdownMode="select"
                              dayClassName = {date => setDateColorClassName(date)}
                            />
                          </div>                          
                          <div style={{fontSize:'1rem'}}>{this.props.edit_weeks_str}</div>                        
                      </div>
                      </DatePickerBox>
                      </>
                  ) : (
                  <>
                  <div style={{position:"fixed", opacity:0}}>&nbsp;</div></>
                  )}
                </>
              )}
              {this.props.karte_data.dial_exist !== true && this.props.is_loaded === true && (
                  <>
                  <div className="alert-area">
                    透析パターンの登録が1つもありません。<br/>
                    透析パターンで登録をしてください。
                    <span className ='a_tag' onClick={this.goToDialPattern.bind(this,'/dial/pattern/dialPattern')}>透析パターン</span>
                  </div>
                  
                  </>
              )}
              {this.props.is_loaded != true && (
                  <>
                  <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                  </>
              )}
              {this.state.isOpenCalcModal ? (
                <CalcDial
                  calcConfirm={this.calcConfirm}
                  units={this.state.calcUnit}
                  calcCancel={this.calcCancel}                        
                  daysSelect={this.state.daysSelect}
                  numberDigits={this.state.calcDigits}
                  daysInitial={0.00}
                  daysLabel=""
                  daysSuffix=""     
                  maxAmount={100000}         
                  calcTitle={this.state.calcTitle}  
                  calcInitData={this.state.calcInit}
                  decimalPointDigits={this.state.decimalPointDigits}
                />
              ) : (
                ""
              )} 
          </Wrapper>          
        );
    }
}

DialCondition.contextType = Context;

DialCondition.propTypes = {    
    kind:PropTypes.string,
    handleOk:PropTypes.func,
    karte_data:PropTypes.object,
    is_loaded: PropTypes.bool,
    edit_weeks_str: PropTypes.string,
    history:PropTypes.object,    
};

export default DialCondition;
