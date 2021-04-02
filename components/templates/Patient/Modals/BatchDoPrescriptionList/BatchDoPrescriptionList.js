import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import ja from "date-fns/locale/ja";
import { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel"
import Checkbox from "~/components/molecules/Checkbox";
import BatchDoPrescriptionListCalendarModal from "./BatchDoPrescriptionListCalendarModal";
import { formatDateSlash, formatDateLine } from "~/helpers/date";
import ConditionSetModal from "./ConditionSetModal";
import FixedModal from "./FixedModal";
import axios from "axios";
// import {CACHE_LOCALNAMES} from "~/helpers/constants";
// import {CACHE_SESSIONNAMES} from "~/helpers/constants";
// import * as sessApi from "~/helpers/cacheSession-utils";
// import * as localApi from "~/helpers/cacheLocal-utils";
// import * as apiClient from "~/api/apiClient";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    .flex {
        display: flex;
    }
    label {
        line-height: 30px;
        font-size: 16px;
    }
    .patient-id {
        div {
            margin-top: 0;
            .label-title {
                font-size: 16px;
                text-align: left;
                width: 60px;
                margin-right: 0;
            }
            input {
                height: 30px;
                width: calc(100% - 60px);
            }
        }
    }
    .pullbox-label {
        margin-bottom: 0;
        .pullbox-select {
            width: 140px;
            height: 30px;   
        }
    }
    .label-title {
        width: 70px;
        text-align: right;
        line-height: 30px;
        margin-top: 0;
        margin-right: 10px;
        margin-bottom: 0;
        font-size: 16px;
    }
    .select-ward {
        .label-title {
            width: 100px;
        }
    }
    .select-condition {
        border:1px solid #aaa;
        height: 150px;
        // width: calc(100% - 380px);
        width: 300px;
        margin-right: 20px;
        .border-right {
            border-right: 1px solid #aaa;
        }
        .border-bottom {
            border-bottom: 1px solid #aaa;
        }
        div {
            padding-left: 5px;
        }
    }
    .operate-condition{
        height: 150px;
        position: relative;
        .display-btn{
            bottom: 0px;
            position: absolute;
        }
    }
    .inspection-period {
        width: 360px;
        .div-title {
            line-height: 30px;
            margin-top: 8px;
            width: 80px;
            text-align: right;
            padding-right: 10px;
        }
        .from-to{
            padding-left:5px;                
            padding-right:5px;    
            line-height: 30px;
            margin-top: 8px;            
        }
        .label-title {
            width: 0;
            margin: 0;
        }
        input {
            width: 120px;
        }
    }
    
    .table-area {
        height: calc(100% - 280px);        
        padding-top:10px;
        table {
            height: calc(100% - 20px);
        }
        thead {
            height: 30px;
            display: table;
            width: 100%;
            tr{
                display: table;
                width: 100%;
                height: 30px;
            }
        }
        th {
            text-align: center;
            padding:0;
        }
        td {
            padding:0;
            padding-left:5px;
        }       
        .td-check {
            text-align: center;
            width: 1.8rem;
            label {
                margin: 0;
            }
        }
        .td-id {
            width: 8rem;
        }
        .td-name {
            width: 14rem;
        }
        .td-prescription {
            width: 8rem;
        }
        .td-inspection {
            width: 8rem;
        }
        .td-other {
            width: 8rem;
        }
        .td-radiation {
            width: 8rem;
        }
        .td-ward {
            width: 8rem;
        }
        .td-room {
            width: 8rem;
        }
        .td-depart {
            width: 10rem;
        }        
        
        tbody{
            display: block;
            width: 100%;
            overflow-y: auto;
            height: calc(100% - 30px);
            tr{
                display: table;
                width: 100%;
            }
        }
    }
    .chief-physician {
        div {
            margin-top: 0;
            .label-title {
                font-size: 16px;
                text-align: right;
                width: 100px;
                margin-right: 10;
            }
            input {
                height: 30px;
                width: calc(100% - 110px);
            }
        }
    }
    .select-group {
        .label-title {
            width: 110px;
        }
    }
    .select-category {
        .label-title {
            width: 0px;
        }
    }
    .outpatient-select-department{
        .pullbox{
            padding-left: 2px;
            margin-top: 2px;
        }
        .pullbox-title{
            padding-left: 0px;
            margin-right: 5px;
            width: 15px;
        }
        .pullbox-label{
            width: calc(100% - 15px);
        }
        .pullbox-select{
            width: 100%;
        }
    }
    .period-date-format{        
        line-height: 30px;
        margin-top: 8px;
    }
    .order-setting{
        width: 420px;
        height: 70px;
        position: relative;
        .order-set-content{
            width: 420px;
            bottom: 0px;
            position: absolute;
        }
    }
    .do-area{
        width: calc(100% - 420px);
        height: 70px;
        position: relative;
        .do-area-bottom{
            position: absolute;
            bottom: 0px;
            width: 100%;
        }
        button{
            width: 90px;
        }
    } 
    button{
        height: 30px;        
    }   
`;


class BatchDoPrescriptionList extends Component {
    constructor(props) {
        super(props);
        let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
        let department_codes = [{id:0, value:"全て"}];
        let diagnosis = {};
        departmentOptions.map(department=>{
            department_codes.push(department);
            diagnosis[parseInt(department.id)] = department.value;
        });
        this.state = {
            department_codes,
            diagnosis,
            search_patient:1,
            department_id:0,
            outpatient_department_id:0,
            first_ward_id:0,
            patient_id:'',
            chief_physician:'',
            start_date: new Date(),
            end_date: new Date(),
            classific:[
                {id:0, value:"処方"},
            ],
            classific_id:0,
            order_category:[
                {id:0, value:""},
            ],
            order_category_id:0,
            isOpenBatchDoCalendarModal: false,
            isOpenConditionModal: false,
            isOpenFixedModal: false,
            search_type: 1,
            prescription_list: {},
            lastPrescription:{}
        };
        this.category_hospital=[
            {id:0, value:"臨時"},
            {id:1, value:"退院時"},
            {id:2, value:"実施済"},
            {id:3, value:"定期"},
            {id:4, value:"つなぎ"},
            {id:5, value:"持参薬"},
        ]
        this.category_outpatient=[
            {id:0, value:"院内"},            
        ]
    }

    async componentDidMount() {
        
        var today = new Date();
        var period = new Date().setDate(today.getDate()-90);

        this.setState({
            order_category: this.category_outpatient,
            start_date: period
        },async ()=>{
            await this.getAllPrescription();        
            await this.getLastPrescriptionPeriod();
        });

    }

    initialState = () => {
        this.setState({
            search_patient:-1,
            // department_id:0,
            outpatient_department_id:0,
            first_ward_id:0,
            patient_id:'',
            // chief_physician:'',
            // start_date: new Date(),
            // end_date: new Date(),
            // classific:[
            //     {id:0, value:"処方"},
            // ],
            // classific_id:0,
            // order_category:[
            //     {id:0, value:""},
            // ],
            // order_category_id:0,
            isOpenBatchDoCalendarModal: false,
            isOpenConditionModal: false,
            isOpenFixedModal: false,
            search_type: -1,
            prescription_list: {},
        });
    }

    getAllPrescription = async () => {
        let _params = {};
        if (this.state.search_type == -1) return;

        _params.start_date = formatDateLine(this.state.start_date);
        _params.to_date = formatDateLine(this.state.end_date);
        _params.search_type = this.state.search_type == 1 ? "hospital" : "outpatient";
        if (_params.search_type == "hospital") {
            _params.search_patient_type = this.state.search_patient == 1 ? "own_patient" : "all_patient";            
            if (this.state.search_patient == 1) {
                // 担当患者
                _params.patient_id = this.props.patientId;
            }
        }
        if (_params.search_type == "outpatient") {
            // 予約日: 本日
            _params.reserve_date = formatDateLine(new Date());
            if (this.state.outpatient_department_id > 0) {
                // 科
                _params.outpatient_department_code = this.state.outpatient_department_id;
            }
        }


        let { data } = await axios.post("/app/api/v2/order/prescription/batchDoPrescriptionList", {
            params: _params
        });
        let prescription_list = data;
        if (Object.keys(prescription_list).length > 0) {
            Object.keys(prescription_list).map(key => {
              prescription_list[key].checked = false;
            });
        }        
        this.setState({
            prescription_list: prescription_list
        });
    }

    getLastPrescriptionPeriod = async () => {
        let _params = {};
        _params.start_date = formatDateLine(this.state.start_date);
        _params.to_date = formatDateLine(this.state.end_date);
        _params.is_internal_prescription = this.state.order_category_id;
        // outpatient: 1, hospital 3
        _params.karte_status = this.state.search_type == 2 ? 1 : 3;
        let { data } = await axios.post("/app/api/v2/order/prescription/lastPrescriptionForBatch", {
            params: _params
        });
        this.setState({
            lastPrescription: data
        });
    }

    setSearchPatient = (e) => {
        this.setState({search_patient:parseInt(e.target.value)},()=>{
            this.getAllPrescription();
        });
    };

    setSearchType = (e) => {
        if (this.state.search_type == e.target.value) return;
        this.setState({search_type:parseInt(e.target.value)},async ()=>{
            await this.getAllPrescription();
            await this.getLastPrescriptionPeriod();
        });
    };

    getDepartment = e => {
        this.setState({
            department_id:e.target.id,
        })
    };

    getOutpatientDepartment = e => {
        this.setState({
            outpatient_department_id:e.target.id,
        },()=>{
            this.getAllPrescription();
        })
    };

    setWard=(e)=>{
        this.setState({first_ward_id:e.target.id});
    };

    setPatientId = e => {
        this.setState({patient_id: e.target.value})
    };

    setChiefPhysician = e => {
        this.setState({chief_physician: e.target.value})
    };

    setPeriod=(key,value)=>{
        this.setState({[key]:value});
    };

    selectOrder =(name, value, number)=>{
        if (name == "select-order") {
            let prescription_list = this.state.prescription_list;
            Object.keys(prescription_list).map(key=>{
                if (key == number) {
                    prescription_list[key].checked = !prescription_list[key].checked;
                }
            });            
            this.setState({
                prescription_list
            });
        }

    };

    checkWard =(name)=>{
        if(name == "check_ward"){
            //
        }
    };

    checkDepartment =(name)=>{
        if(name == "check_department"){
            //
        }
    };

    setClassific = e =>{
        this.setState({
            classific_id: parseInt(e.target.id),
        });
    };

    setOrderCategory =e=>{
        this.setState({
            order_category_id: parseInt(e.target.id),
        });
    };

    openBatchDoCalendar = () => {
        if (this.state.search_type == 1) { // hospital
            if (this.state.order_category_id == 3) {                
                this.setState({
                    isOpenFixedModal: true
                });
            } else {
                this.setState({
                    isOpenBatchDoCalendarModal: true
                });    
            }
        } else if(this.state.search_type == 2) {// outpatient
            this.setState({
                isOpenBatchDoCalendarModal: true
            });
        }
    }

    cancelModal = () => {
        this.setState({
            isOpenBatchDoCalendarModal: false
        });
    }

    handleRefreshContent = () => {
        this.getAllPrescription();
    }

    cancelCondition = () => {
        this.setState({
            isOpenConditionModal: false,
            isOpenFixedModal: false
        });
    }

    setCondition = (nVal) => {
        this.cancelCondition();
        var today = new Date();
        var period = new Date().setDate(today.getDate()-nVal);
        this.setState({
            start_date: period
        },async ()=>{
            await this.getLastPrescriptionPeriod();
        });
    }

    openConditionModal = () => {
        this.setState({
            isOpenConditionModal: true
        });
    }

    handleAllCheck = () => {
        let prescription_list = this.state.prescription_list;
        Object.keys(prescription_list).map(key=>{
            prescription_list[key].checked = true;
        });    
        this.setState({
            prescription_list
        });    
    }

    handleAllUnCheck = () => {
        let prescription_list = this.state.prescription_list;
        Object.keys(prescription_list).map(key=>{
            prescription_list[key].checked = false;
        });        
        this.setState({
            prescription_list
        });    
    }

    // handleConfirmDate = async (str_date) => {
    handleConfirmDate = async () => {
        // db operation 
        // console.log("str_date", str_date);       
        // console.log("this.state.lastPrescription", this.state.lastPrescription);        

        // console.log("this.state.prescription_list", this.state.prescription_list);
        
        let arr = [];
        Object.keys(this.state.prescription_list).forEach(function(key){            
            arr.push(key);
        });
        for (let i = 0; i < arr.length; i ++) {
            //   let path = "/app/api/v2/order/prescription/register";
            let _data = this.state.prescription_list[arr[i]];
            if (_data.checked != true) continue;

            // let last_prescription = this.getBatchLastPrescription(this.state.lastPrescription);
            // console.log("last_prescription", last_prescription);
          
          /*await apiClient
            ._post(path, {
                params: last_prescription
            })
            .then(() => {
                
            })
            .catch((err) => {
                if (err.response.data) {
                    // const { error_messages } = err.response.data;
                    // error_msg = error_messages;
                }                                
                return false;
            });*/
        }        

        // this.props.closeModal();
    }

    /*
    getBatchLastPrescription =async (_lastPrescription) => {
        console.log("getBatchLastPrescription");
        console.log("_lastPrescription", _lastPrescription);
                   
            let prescription = _lastPrescription;            

                let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
                let arrMedCodes = [];
                let order_data = prescription.order_data.order_data;
                if(order_data !== undefined && order_data != null && order_data.length > 0){
                    order_data.map(order => {
                        order.med.map(medicine => {
                            arrMedCodes.push(JSON.parse(JSON.stringify(medicine)).item_number);
                        });
                    });
                }
                let params = {
                    type: "haruka",
                    codes: arrMedCodes.join(",")
                };
                let medDetail = await apiClient.get("/app/api/v2/reference/medicines", {
                    params: params
                });
                let newPresData;
                // セット処方の処理
                let diagnosisPrescriptionData = {};

                // let cacheUsageData = JSON.parse(
                //     window.localStorage.getItem("haruka_cache_usageData")
                // );
                let cacheUsageData = {};
                let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
                if (init_status != null && init_status != undefined && init_status.prescription_usage != undefined && init_status.prescription_usage != null) {
                  cacheUsageData = init_status.prescription_usage;    
                } 

                //haruka_cache_usageData
                let patientInfoResponse = await axios.get("/app/api/v2/karte/patient_datailed", {
                    params: { systemPatientId: patient_id}
                });

                let detailedPatientInfo = null;
                if(patientInfoResponse.data != undefined && patientInfoResponse.data !=null) {
                    detailedPatientInfo =patientInfoResponse.data;
                }

                if(order_data !== undefined && order_data != null && order_data.length > 0){
                    newPresData = order_data.map((order, rpIdx) => {
                        let usageRemarksList = [];
                        if (Array.isArray(order.usage_remarks_comment)) {
                            usageRemarksList = order.usage_remarks_comment;
                        } else {
                            usageRemarksList.push(order.usage_remarks_comment);
                        }

                        let usageData = getUsageInfo(cacheUsageData, order.usage);

                        let usageType = usageData.diagnosis_division != undefined ? usageData.diagnosis_division : "";
                        return {
                            medicines: order.med.map((medicine, medIdx) => {
                                let free_comment = [];
                                if (Array.isArray(medicine.free_comment)) {
                                    free_comment = medicine.free_comment.slice(0);
                                } else {
                                    free_comment.push(medicine.free_comment);
                                }
                                if (usageType == "21" || usageType == "22") {
                                    let age_type = '';
                                    if(detailedPatientInfo !== undefined && detailedPatientInfo != null ) {
                                        let age = getAge(detailedPatientInfo['patient'][0]['real_birthday']);
                                        age_type = age >= 15 ? '成人' : '小児';

                                    }
                                    let med_detail = medDetail[medicine.item_number] !== undefined ? medDetail[medicine.item_number] : [];
                                    medicine.usage_alert_content = "";
                                    if (med_detail.usages === undefined || med_detail.usages === null) {
                                        medicine.usage_permission = 0;
                                    } else {
                                        let amount = -1;
                                        let strUsage = "";
                                        let strItemUsage = "";
                                        let mainUnit = medicine.real_unit !== undefined ? medicine.real_unit : medicine.unit;
                                        let multi = 1;
                                        let unit_list = [];
                                        if (medicine.units_list !== undefined) {
                                            unit_list = medicine.units_list;
                                        } else if (medicine.units !== undefined) {
                                            unit_list = medicine.units;
                                        }

                                        unit_list.map((val) => {
                                            if (val.main_unit_flag == 1) {
                                                mainUnit = val.name;
                                            }
                                            if (val.name == medicine.unit) {
                                                multi = val.multiplier;
                                            }
                                        });
                                        med_detail.usages
                                            .filter((item) => {
                                                if (item.age_category == "") {
                                                    return true;
                                                }
                                                return item.age_category == age_type;
                                            })
                                            .map((item) => {
                                                let items = [];
                                                amount = -1;
                                                strItemUsage = "";
                                                if (usageType == "21") {
                                                    if (mainUnit === item.c029 && item.c028 !== "") {
                                                        items = item.c028.split("～");

                                                        if (amount > parseFloat(items[0]) || amount === -1) {
                                                            amount = parseFloat(items[0]);
                                                            strItemUsage = "・" + item.age_category + ":" + item.target + " 1 日最大量:" + amount + item.c029;
                                                        }
                                                    }

                                                    if (mainUnit === item.c058 && item.c057 !== "") {
                                                        items = item.c057.split("～");
                                                        if (amount > parseFloat(items[0]) || amount === -1) {
                                                            amount = parseFloat(items[0]);
                                                            strItemUsage = "・" + item.age_category + ":" + item.target + " 1 日最大量:" + amount + item.c058;
                                                        }
                                                    }

                                                    if (mainUnit === item.c087 && item.c086 !== "") {
                                                        items = item.c086.split("～");
                                                        if (amount > parseFloat(items[0]) || amount === -1) {
                                                            amount = parseFloat(items[0]);
                                                            strItemUsage = "・" + item.age_category + ":" + item.target + "1 日最大量:" + amount + item.c087;
                                                        }

                                                    }
                                                    if (amount !== -1 && (medicine.amount * multi) > amount) {
                                                        strUsage = strUsage + strItemUsage + "\n";
                                                    }
                                                } else if (usageType == "22") {
                                                    if (mainUnit === item.c029 && item.c027 !== "") {
                                                        items = item.c027.split("～");

                                                        if (amount > parseFloat(items[0]) || amount === -1) {
                                                            amount = parseFloat(items[0]);
                                                            strItemUsage = "・" + item.age_category + ":" + item.target + " 1 回最大量:" + amount + item.c029;
                                                        }
                                                    }

                                                    if (mainUnit === item.c058 && item.c056 !== "") {
                                                        items = item.c056.split("～");
                                                        if (amount > parseFloat(items[0]) || amount === -1) {
                                                            amount = parseFloat(items[0]);
                                                            strItemUsage = "・" + item.age_category + ":" + item.target + " 1 回最大量:" + amount + item.c058;
                                                        }
                                                    }

                                                    if (mainUnit === item.c087 && item.c085 !== "") {
                                                        items = item.c085.split("～");
                                                        if (amount > parseFloat(items[0]) || amount === -1) {
                                                            amount = parseFloat(items[0]);
                                                            strItemUsage = "・" + item.age_category + ":" + item.target + "1 回最大量:" + amount + item.c087;
                                                        }
                                                    }
                                                    if (amount !== -1 && (medicine.amount * multi) > amount) {
                                                        strUsage = strUsage + strItemUsage + "\n";
                                                    }
                                                }
                                            });

                                        if (strUsage !== "") {
                                            medicine.usage_permission = -1;
                                            medicine.usage_alert_content = medicine.item_name + "は下記基準を超えていますが処方を発行しますか？\n" + strUsage;
                                        } else {
                                            medicine.usage_permission = 0;
                                            medicine.usage_alert_content = "";
                                        }
                                    }
                                }
                                let diagnosis_permission = 0;
                                let diagnosis_content = "";
                                if (medicine.diagnosis_division && usageData.allowed_diagnosis_division != undefined) {
                                    if (!usageData.allowed_diagnosis_division.includes(medicine.diagnosis_division.toString())) {
                                        diagnosis_permission = -1;
                                        if (diagnosisPrescriptionData[rpIdx] == undefined) {
                                            diagnosisPrescriptionData[rpIdx] = [];
                                        }
                                        diagnosisPrescriptionData[rpIdx].push(medIdx);
                                    }
                                }
                                let cur_date = formatDateLine(new Date());
                                let cur_date_str = cur_date.split('-')[0]+cur_date.split('-')[1]+cur_date.split('-')[2];
                                return {
                                    medicineId: medicine.item_number,
                                    medicineName: medicine.item_name,
                                    amount: medicine.amount,
                                    unit: medicine.real_unit !== undefined ? medicine.real_unit : medicine.unit,
                                    main_unit_flag: medicine.main_unit_flag,
                                    diagnosis_division: medicine.diagnosis_division,
                                    is_not_generic: medicine.is_not_generic,
                                    can_generic_name: medicine.can_generic_name,
                                    contraindication_alert: medicine.contraindication_alert,
                                    contraindication_reject: medicine.contraindication_reject,
                                    milling: medicine.milling,
                                    separate_packaging: medicine.separate_packaging,
                                    free_comment: free_comment,
                                    usage_comment: medicine.usage_comment,
                                    usage_optional_num: medicine.usage_optional_num,
                                    poultice_times_one_day: medicine.poultice_times_one_day,
                                    poultice_one_day: medicine.poultice_one_day,
                                    poultice_days: medicine.poultice_days,
                                    uneven_values: medicine.uneven_values,
                                    units_list: medicine.units_list,
                                    medDetail: medDetail[medicine.item_number] !== undefined ? medDetail[medicine.item_number] : [],
                                    exists_detail_information: medicine.exists_detail_information,
                                    usage_permission: medicine.usage_permission,
                                    usage_alert_content: medicine.usage_alert_content,
                                    period_permission: 0,
                                    start_month: medicine.start_month !== undefined ? medicine.start_month : "",
                                    end_month: medicine.end_month !== undefined ? medicine.end_month : "",
                                    start_date : target_number > 0 ? medicine.start_date : cur_date_str,
                                    end_date : medicine.end_date !== undefined ? medicine.end_date : "",
                                    gene_name: medicine.gene_name !== undefined ? medicine.gene_name : "",
                                    diagnosis_permission: diagnosis_permission,
                                    diagnosis_content: diagnosis_content,
                                    tagret_contraindication: medicine.tagret_contraindication,
                                    yj_code: medicine.yj_code
                                };
                            }),
                            units: [],
                            usage: order.usage,
                            usageName: order.usage_name,
                            allowed_diagnosis_division: (usageData.allowed_diagnosis_division != undefined) ? usageData.allowed_diagnosis_division : [],
                            usage_category_name: (usageData.category_name != undefined) ? usageData.category_name : "",
                            days: order.days,
                            days_suffix: order.days_suffix,
                            year: "",
                            month: "",
                            date: "",
                            order_number: order.order_number,
                            order_number_serial: order.order_number_serial,
                            supply_med_info: order.supply_med_info,
                            med_consult: order.med_consult,
                            temporary_medication: order.temporary_medication,
                            one_dose_package: order.one_dose_package,
                            mixture: order.mixture === undefined ? 0 : order.mixture,
                            medical_business_diagnosing_type: order.medical_business_diagnosing_type,
                            insurance_type: order.insurance_type === undefined ? 0 : order.insurance_type,
                            usage_remarks_comment: usageRemarksList,
                            start_date: order.start_date,
                            usage_replace_number: order.usage_replace_number,
                            body_part: order.body_part === undefined ? "" : order.body_part
                        };
                    });
                }
                let newBulk = {
                    milling: 1,
                    supply_med_info: 1,
                    med_consult: 1,
                    is_not_generic: 1,
                    can_generic_name: 1,
                    separate_packaging: 1,
                    temporary_medication: 1,
                    one_dose_package: 1
                };
                //全データのフラグが立っていたら画面用(bulk)のフラグON
                if(newPresData !== undefined && newPresData != null){
                    newPresData.forEach(pres => {
                        if (pres.order_number) {
                            pres.medicines.forEach(med => {
                                if (med.milling == 0) newBulk.milling = 0;
                                if (med.is_not_generic == 0) newBulk.is_not_generic = 0;
                                if (med.can_generic_name == 0) newBulk.can_generic_name = 0;
                                if (med.separate_packaging == 0) newBulk.separate_packaging = 0;
                            });
                            if (pres.temporary_medication == 0) newBulk.temporary_medication = 0;
                            if (pres.one_dose_package == 0) newBulk.one_dose_package = 0;
                        }
                    });
                }

                if (prescription['order_data']['med_consult'] == 1) {
                    newBulk.med_consult = 1;
                } else {
                    newBulk.med_consult = 0;
                }

                if (prescription['order_data']['supply_med_info'] == 1) {
                    newBulk.supply_med_info = 1;
                } else {
                    newBulk.supply_med_info = 0;
                }

                let presData = newPresData;
                presData.push(getEmptyPrescription());
                let diseaseData = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.CONTRAINDICATION_DISEASE_DATA)); // 病名禁忌
                let selDiseaseData = {};

                let temp_array = [];
                presData.map((order, rpIdx) => {
                    order.medicines.map((medicine, medIdx) => {
                        var array = {
                            rpIdx: rpIdx,
                            medIdx: medIdx,
                            medicine: medicine
                        };
                        temp_array.push(array);
                    });
                });
                let duplciate_permission = 0;
                let alert_permission = 0;
                for (var i = 0; i < temp_array.length - 1; i++) {
                    duplciate_permission = 0;
                    alert_permission = 0;
                    for (var j = 0; j < temp_array.length - 1; j++) {
                        if (i == j) continue;
                        // 重複禁忌
                        if (temp_array[i].medicine.medicineId == temp_array[j].medicine.medicineId) {
                            duplciate_permission = 1;
                        }
                        // 併用禁忌
                        if (temp_array[i].medicine.contraindication_alert !== undefined &&
                            temp_array[i].medicine.contraindication_alert.length > 0 &&
                            temp_array[j].medicine.medicineId !== undefined &&
                            temp_array[i].medicine.contraindication_alert.includes(temp_array[j].medicine.medicineId.toString())) {
                            alert_permission = 1;
                        }

                        if (temp_array[j].medicine.contraindication_alert !== undefined &&
                            temp_array[j].medicine.contraindication_alert.length > 0 &&
                            temp_array[i].medicine.medicineId !== undefined &&
                            temp_array[j].medicine.contraindication_alert.includes(temp_array[i].medicine.medicineId.toString())) {
                            alert_permission = 1;
                        }
                    }
                    // 病名禁忌
                    selDiseaseData = getDiseasePermissions(diseaseData, temp_array[i].medicine);

                    presData[temp_array[i].rpIdx].medicines[temp_array[i].medIdx].duplciate_permission = duplciate_permission;
                    presData[temp_array[i].rpIdx].medicines[temp_array[i].medIdx].alert_permission = alert_permission;
                    presData[temp_array[i].rpIdx].medicines[temp_array[i].medIdx].disease_permission = (Object.keys(selDiseaseData).length == 0) ? 0 : 1;
                    presData[temp_array[i].rpIdx].medicines[temp_array[i].medIdx].disease_alert_content = selDiseaseData;
                }

                let newPrescription = {
                    user_number :authInfo.user_number,
                    system_patient_id : patient_id,
                    time: formatDateFull(new Date(), "-"),
                    created_at: (department_name != null && prescription.created_at !== undefined) ? prescription.created_at : "",
                    presData: presData,
                    number : department_name != null ? target_number : undefined,
                    insurance_type: 0, //保険情報現状固定
                    psychotropic_drugs_much_reason: prescription.order_data.psychotropic_drugs_much_reason ? prescription.order_data.psychotropic_drugs_much_reason : "",
                    poultice_many_reason: prescription.order_data.poultice_many_reason ? prescription.order_data.poultice_many_reason : "",
                    free_comment: Array.isArray(prescription.order_data.free_comment) ? prescription.order_data.free_comment : [], //備考
                    department_code, //this.state.departmentId,
                    department: department_name != null ? department_name : this.context.department.name, //this.state.department,
                    karte_status_code: this.context.karte_status.code,
                    karte_status_name: this.context.karte_status.name,
                    is_internal_prescription: prescription.order_data.is_internal_prescription ? prescription.order_data.is_internal_prescription : 0,
                    patient_name: prescription.patient_name,
                    medical_department_name: this.context.medical_department_name,
                    duties_department_name: this.context.duties_department_name,
                    bulk: newBulk,
                    unusedDrugSearch: 0,
                    profesSearch: 0,
                    normalNameSearch: 0,
                    additions : prescription.order_data.additions,
                    item_details:prescription.order_data.item_details,
                };
                console.log("newPrescription", newPrescription);
                return newPrescription
                let cacheState = [];
                cacheState.push(newPrescription);
                if (authInfo.staff_category === 2) {
                    cacheState[0].doctor_name = this.context.selectedDoctor.name;
                    cacheState[0].doctor_code = this.context.selectedDoctor.code;
                    cacheState[0].substitute_name = authInfo.name;
                }
                console.log("cacheState", cacheState);

                // cacheState[0].isUpdate = (target_number != null && target_number !== 0) ? 1 : 0;
                // cacheState[0].temp_saved = 1; // 仮登録
                // let serial_key = this.m_cacheSerialNumber;
                // if (serial_key == undefined || serial_key == null) serial_key = new Date().getTime();
                // karteApi.setSubVal(patient_id, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, serial_key, JSON.stringify(cacheState), 'insert');
                // if(param_data === "prescription_page"){
                //     this.setState({presData});
                // }
                // let set_deplyment = localApi.getValue('set_deplyment');
                // if(set_deplyment !== undefined && set_deplyment!= null && set_deplyment == 1){
                //     localApi.remove('set_deplyment');
                //     this.context.$setExaminationOrderFlag(1);
                // }

                // if(karte_status_code != null && target_number ==null){
                //     if(karte_status_code == 1 && this.context.karte_status.code != 0){
                //         this.context.$updateKarteStatus(0,"外来");
                //     }
                //     if(karte_status_code == 2 && this.context.karte_status.code != 2){
                //         this.context.$updateKarteStatus(2, "訪問診療");
                //     }
                //     if(karte_status_code == 3 && this.context.karte_status.code != 1){
                //         this.context.$updateKarteStatus(1, "入院");
                //     }
                // }
    }
    */

    render() {
        return (
            <>
                <Modal
                    show={true}
                    className="custom-modal-sm patient-exam-modal move-meal-calendar first-view-modal"
                >
                    <Modal.Header><Modal.Title>一括Do処方一覧</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                            {/*<div className={'flex'}>
                                <div className={'patient-id flex'}>
                                    <Radiobox
                                        value={1}
                                        getUsage={this.setSearchPatient.bind(this)}
                                        checked={this.state.search_patient === 1}
                                        disabled={true}
                                        name={`search_patient`}
                                    />
                                    <InputWithLabel
                                        label="患者ID"
                                        type="number"
                                        getInputText={this.setPatientId.bind(this)}
                                        diseaseEditData={this.state.patient_id}
                                        isDisabled={this.state.search_patient === 0}
                                    />
                                </div>
                                <div className={'select-department'}>
                                    <SelectorWithLabel
                                        title="依頼科"
                                        options={this.state.department_codes}
                                        getSelect={this.getDepartment}
                                        departmentEditCode={this.state.department_id}
                                    />
                                </div>
                                <div className={'select-ward'}>
                                    <SelectorWithLabel
                                        title="病棟"
                                        options={this.state.ward_master}
                                        getSelect={this.setWard}
                                        departmentEditCode={this.state.first_ward_id}
                                    />
                                </div>
                                <div className={'chief-physician'}>
                                    <InputWithLabel
                                        label="主治医"
                                        type="number"
                                        getInputText={this.setChiefPhysician.bind(this)}
                                        diseaseEditData={this.state.chief_physician}
                                    />
                                </div>
                            </div>*/}
                            <div className={'flex'} style={{paddingTop:"10px"}}>
                                <div className={'select-condition flex'}>
                                    <div className={'border-right'} style={{width:"50%", padding:"0px"}}>
                                        <div style={{borderBottom:"1px solid #aaa"}}>
                                            <Radiobox
                                                label={'入院検索'}
                                                value={1}
                                                getUsage={this.setSearchType.bind(this)}
                                                checked={this.state.search_type === 1}
                                                disabled={true}
                                                name={`search_type`}
                                            />
                                        </div>
                                        {/*<div className={'border-bottom'}> 入院検索</div>*/}
                                        <div style={{height:"30px"}}>
                                            <Radiobox
                                                label={'担当患者'}
                                                value={1}
                                                getUsage={this.setSearchPatient.bind(this)}
                                                checked={this.state.search_patient === 1}
                                                disabled={true}
                                                name={`search_patient`}
                                            />
                                        </div>
                                        <div style={{borderBottom:"1px solid #aaa",height:"30px"}}>
                                            <Radiobox
                                                label={'全患者'}
                                                value={2}
                                                getUsage={this.setSearchPatient.bind(this)}
                                                checked={this.state.search_patient === 2}
                                                disabled={true}
                                                name={`search_patient`}
                                            />
                                        </div>
                                        <div>
                                            <Checkbox
                                                label="病棟"
                                                getRadio={this.checkWard.bind(this)}
                                                value={0}
                                                name="check_ward"
                                            />
                                        </div>
                                        <div>
                                            <Checkbox
                                                label="科"
                                                getRadio={this.checkDepartment.bind(this)}
                                                value={0}
                                                name="check_department"
                                            />
                                        </div>
                                    </div>
                                    <div className={'border-right'} style={{width:"50%", padding:"0px"}}>
                                        <div style={{borderBottom:"1px solid #aaa"}}>
                                            <Radiobox
                                                label={'外来検索'}
                                                value={2}
                                                getUsage={this.setSearchType.bind(this)}
                                                checked={this.state.search_type === 2}
                                                disabled={true}
                                                name={`search_type`}
                                            />
                                        </div>
                                        {/*<div className={'border-bottom'}> 外来検索</div>*/}
                                        <div style={{borderBottom:"1px solid #aaa",height:"30px"}}>予約日</div>
                                        <div style={{borderBottom:"1px solid #aaa",height:"30px"}}>{formatDateSlash(new Date())}</div>
                                        <div className={'outpatient-select-department'}>
                                            <SelectorWithLabel
                                                title="科"
                                                options={this.state.department_codes}
                                                getSelect={this.getOutpatientDepartment}
                                                departmentEditCode={this.state.outpatient_department_id}
                                            />
                                        </div>
                                    </div>
                                    {/*<div className={'border-right'} style={{width:"30%", padding:"0px"}}>
                                        <div className={'border-bottom'}> 共通CMフォルダー</div>
                                    </div>
                                    <div style={{width:"30%", padding:"0px"}}>
                                        <div className={'border-bottom'}> 本人用CMフォルダー</div>
                                    </div>*/}
                                </div>
                                <div className="operate-condition">
                                    <div className={'flex'}>
                                        <div className={'select-department'}>
                                            <SelectorWithLabel
                                                title="依頼科"
                                                options={this.state.department_codes}
                                                getSelect={this.getDepartment}
                                                departmentEditCode={this.state.department_id}
                                            />
                                        </div>
                                    </div>
                                    <div className={'inspection-period flex'}>
                                        <div className={'div-title'}>表示期間</div>
                                        <div className="period-date-format">{formatDateSlash(this.state.start_date)}</div>
                                        {/*<InputWithLabel
                                            type="date"
                                            getInputText={this.setPeriod.bind(this, 'start_date')}
                                            diseaseEditData={this.state.start_date}
                                        />*/}
                                        <div className={'from-to'}>～</div>
                                        <div className="period-date-format">{formatDateSlash(this.state.end_date)}</div>
                                        {/*<InputWithLabel
                                            type="date"
                                            getInputText={this.setPeriod.bind(this, 'end_date')}
                                            diseaseEditData={this.state.end_date}
                                        />*/}
                                    </div>
                                    <div className={'flex display-btn'} style={{paddingTop:"56px", textAlign:"right"}}>
                                        <button style={{width:"90px"}} onClick={this.handleRefreshContent}>最新表示</button>
                                        {/*<div style={{width:"calc(100% - 170px)", textAlign:"center"}}>件数: 0件</div>*/}
                                        <button style={{width:"110px",marginLeft:"20px"}} onClick={this.initialState}>条件クリア</button>
                                    </div>
                                </div>
                            </div>
                            <div className={'table-area'}>
                                <table className="table-scroll table table-bordered" id="code-table" style={{display:"block"}}>
                                    <thead>
                                    <tr>
                                        <th className="td-check"> </th>
                                        <th className="td-id">患者ID</th>
                                        <th className="td-name">患者氏名</th>
                                        <th className="td-prescription">前回処方</th>
                                        <th className="td-inspection">前回検査</th>
                                        <th className="td-other">前回汎用</th>
                                        <th className="td-radiation">前回画像</th>
                                        <th className="td-ward">病棟</th>
                                        <th className="td-room">病室</th>
                                        <th className="td-depart">依頼課</th>
                                        <th className="td-doctor">主治医</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(this.state.prescription_list).length > 0 && Object.keys(this.state.prescription_list).map(key=>{
                                            return(   
                                                <>
                                                    <tr>
                                                        <td className="td-check">
                                                            <Checkbox
                                                                getRadio={this.selectOrder.bind(this, key)}
                                                                value={this.state.prescription_list[key].checked}
                                                                number={key}
                                                                name="select-order"                                                                
                                                            />
                                                        </td>
                                                        <td className="td-id">{this.state.prescription_list[key].patient_number}</td>
                                                        <td className="td-name">{this.state.prescription_list[key].patient_name}</td>
                                                        <td className="td-prescription">{this.state.prescription_list[key].last_prescription != null && this.state.prescription_list[key].last_prescription}</td>
                                                        <td className="td-inspection">{this.state.prescription_list[key].last_prescription != null && this.state.prescription_list[key].last_inspection}</td>
                                                        <td className="td-other"></td>
                                                        <td className="td-radiation">{this.state.prescription_list[key].last_prescription != null && this.state.prescription_list[key].last_radiation}</td>
                                                        <td className="td-ward">{this.state.prescription_list[key].ward_name != undefined && this.state.prescription_list[key].ward_name != null && this.state.prescription_list[key].ward_name}</td>
                                                        <td className="td-room">{this.state.prescription_list[key].room_name != undefined && this.state.prescription_list[key].room_name != null && this.state.prescription_list[key].room_name}</td>
                                                        <td className="td-depart">内科</td>
                                                        <td className="td-doctor">テスト ドクター</td>
                                                    </tr>
                                                </>                                     
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex">
                                <div className="order-setting">
                                    <div className={'flex order-set-content'}>
                                        <div className = "select-group">
                                            <SelectorWithLabel
                                                options={this.state.classific}
                                                title="オーダー設定"
                                                getSelect={this.setClassific}
                                                departmentEditCode={this.state.classific_id}
                                            />
                                        </div>
                                        <div className = "select-category">
                                            <SelectorWithLabel
                                                options={this.state.search_type == 2 ? this.category_outpatient : this.category_hospital}
                                                getSelect={this.setOrderCategory}
                                                departmentEditCode={this.state.order_category_id}                                                
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="do-area">
                                    <div className="">
                                        <div className="" style={{textAlign:"right", paddingTop:"0px"}}>
                                            <button style={{marginLeft:"10px", width: "90px", float:"left"}} onClick={this.openConditionModal}>表示条件</button>                                
                                            <button onClick={this.handleAllCheck}>全選択</button>
                                            <button onClick={this.handleAllUnCheck} style={{marginLeft:"10px"}}>全削除</button>
                                        </div>
                                    </div>    
                                    <div className="do-area-bottom">
                                        <div className="" style={{textAlign:"right", width:"100%", paddingTop:"10px"}}>
                                            <button onClick={this.openBatchDoCalendar} style={{marginLeft:"10px", width:"90px", float:"left"}}>Do</button>
                                            <button onClick={this.props.closeModal} style={{width: "90px"}}>閉じる</button>
                                        </div>
                                    </div>    
                                </div>
                            </div>
                            {this.state.isOpenBatchDoCalendarModal == true && (
                                <BatchDoPrescriptionListCalendarModal 
                                    cancelModal={this.cancelModal}                                    
                                    handleConfirmDate={this.handleConfirmDate}                                    
                                />
                            )}                            
                            {this.state.isOpenConditionModal == true && (
                                <ConditionSetModal 
                                    confirmCancel={this.cancelCondition}
                                    confirmOk={this.setCondition}
                                    end_date={formatDateSlash(this.state.end_date)}
                                />
                            )}                            
                            {this.state.isOpenFixedModal == true && (
                                <FixedModal 
                                    confirmCancel={this.cancelCondition}
                                    confirmOk={this.setCondition}
                                    end_date={formatDateSlash(this.state.end_date)}
                                />
                            )}
                        </Wrapper>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

BatchDoPrescriptionList.contextType = Context;
BatchDoPrescriptionList.propTypes = {
    closeModal: PropTypes.func,
    patientId: PropTypes.number,
};

export default BatchDoPrescriptionList;
