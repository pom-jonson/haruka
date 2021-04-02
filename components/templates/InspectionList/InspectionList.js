import React, {Component} from "react";
import styled from "styled-components";
import * as colors from "../../_nano/colors";
import {disable, error, secondary, surface} from "../../_nano/colors";
import Button from "../../atoms/Button";
import PropTypes from "prop-types";
import {SOAP_TREE_CATEGORY, TREE_FLAG, EXAM_CATEGORY} from "~/helpers/constants";
import InspectionResultRight from "./InspectionResultRight";
import InspectionResultTree from "./InspectionResultTree";
import Checkbox from "~/components/molecules/Checkbox";
import * as apiClient from "~/api/apiClient";
import Context from "~/helpers/configureStore";
import RegisterExamResultModal from "./RegisterExamResultModal";
import InputWithLabel from "../../molecules/InputWithLabel";
import InputKeyWord from "~/components/molecules/InputKeyWord";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

const PatientsWrapper = styled.div`
  width: 100%;
  margin: auto;
  .title-area {
    margin-left: 10px;
    padding-top: 10px;
  }
  .title {
    font-size: 30px;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .middle-buttons{
    button{
        span{
            font-size:1rem;
        }
    }
  }
  .remove-x-input{
    input{
      background: white;
    }
  }
  button{
    background: white;
  }
`;

const Flex = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: center;
  padding:0px 10px 10px;
  width: 100%;
  z-index: 100;

  .label-title {
    text-align: right;
    width: auto;
    margin: 0 0.5rem 0 1.5rem;
    font-size: 1rem;
  }
  select {
    width: 7.5rem;
    font-size:1rem;
  }
  button {
    height: 2.5rem;
    min-width: auto;
    margin-left: 0.5rem;
  }

  span {
    font-size: 1rem;
  }

  .search-type{
    label {
      font-size: 1rem;
    }
    button{
      padding: 0.25rem;
      height:2.5rem;
    }
    input{
        height:2.5rem;
    }
  }
  .check-area{
    line-height: 2.5rem;
    label {
      margin-right: 5px;
    }
  }
 .patient-area{
    padding-right: 0.5rem;
    padding-bottom:0.5rem;
    border: solid 1px rgb(126, 126, 126);
    .patient-id-search-input{
        margin-top:0.5rem;
        flex-direction:row;
        div{
            display:inline-block;
            div{
                width: 4.5rem;
                margin-top: 0.7rem;
                text-align: right;
                margin-right: 0.5rem;
            } 
            
        }
        input{
            width: 10rem;
        }
    }
    div{
        font-size:0.875rem;
    }
    .label-title{
        font-size: 0.875rem;
        width: 5rem;
        margin: 0;
        padding-right: 0.5rem;
        text-align: right;
        line-height: 2.5rem;
    }
    input{
        width: 10rem;
        height: 2.5rem;
    }
    .age {
        input{
            width:4rem;
        }
        label{
            line-height: 2.5rem;
            width: 3rem;
        }
    }
    .birthday{
        input{width:10rem;}
    }    
  }
  .select-box{
    .pullbox-title, .label-title{
      margin-left:0.7rem;
      width:  5rem;
      text-align: right;
      margin-right:0.5rem; 
      height:2.5rem;
      line-height:2.5rem;
    }
    .pullbox-select{
        width:10rem;
        padding-right: 1rem;
        height:2.5rem;
        line-height:2.5rem;
    }
  }
  .radio-area label{
    margin-right:0.5rem;
    font-size:1rem;
  }
`;

const PrescriptionWrapper = styled.div`
  width: 100%;
  padding-top: 10px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  .examination-content{
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    width: calc(100% - 420px);
  }
  .note-red{
    color: ${error};
  }

  .exam-order{
    margin-left: 75px;
  }

  nav {
    padding: 4px 0;
    ul {
      padding-left: 0;
      margin-bottom: 8px;
      &:before {
        content: "";
        border-left: 1px solid #ccc;
        display: block;
        width: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
      }

      .sel_open {
        background: #ddd;
      }
      ul {
        margin-left: 10px;
        position: relative;
        margin-bottom: 0px;

        li {
          padding: 0px 12px;

          &:before {
            content: "";
            border-top: 1px solid #ccc;
            display: block;
            width: 8px;
            height: 0;
            position: absolute;
            top: 10px;
            left: 0;
          }
          &:last-child:before {
            background: #fff;
            height: auto;
            top: 10px;
            bottom: 0;
          }

          ul {
            margin-bottom: 0px;
            li {
              padding: 0px 12px;

              ul {
                margin-bottom: 0px;

                li {
                  padding: 0px 12px;
                }
              }
            }
          }
        }
      }
      li {
        margin: 0;
        padding: 3px 12px;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 13px;
        line-height: 20px;
        position: relative;
      }
    }

    li {
      cursor: pointer;
      list-style-type: none;
    }
  }

  .mark {
    color: ${surface};
    font-size: 12px;
    display: inline-block;
    padding: 2px;
    line-height: 1;
    &.red {
      background-color: ${error};
    }
    &.blue {
      background-color: ${secondary};
    }
  }

  .data-item {
    padding: 4px 32px 4px 8px;
    position: relative;
    cursor: pointer;

    &.open {
      .angle {
        transform: rotate(180deg);
      }
    }

    &.changed {
      background: #eee;
    }

    &.updating {
      background: #ccc;
    }
  }

  p {
    margin: 0;
  }

  .flex {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .entry-name {
    display: inline-block;
    width: 35%;
  }

  .soap-data,
  .soap-data-item {
    width: 100%;

    tr {
      flex-wrap: nowrap;
    }

    th,
    td {
      border: 1px solid ${disable};
      padding: 2px;
    }

    th {
      background: #f6fcfd;
      text-align: center;
      width: 50px;
    }

    td {
      flex: 1;
    }

    input {
      width: 100%;
    }
  }

  .style-hide{
    display: none;
  }
  
  .detail-deleted {
      color: #ff0000;
      textarea {
        color: #ff0000;
      }
  }
  
  .soap-data-item {
    display: none;
    &.open {
      display: inline-table;
    }

    textarea {
      border: 0px;
      resize: none;
    }

    &.changed {
      background: #eee;
      textarea {
        background: #eee;
      }
    }
    &.deleted {
      color: #ff0000;

      textarea {
        color: #ff0000;
      }
    }
  }

  .data-input{
    display: none;
    &.open{
      display: block;
    }
  }

  .not-consented {
    color: ${error};
  }

  .btn {
    background-color: ${secondary};
    border: none;
    border-radius: 4px;
    box-sizing: border-box;
    color: ${surface};
    display: block;
    font-size: 14px;
    text-align: center;
    margin-left: auto;
    padding: 2px 4px;
    line-height: 1;
  }  
`;

class InspectionList extends Component {
    constructor(props) {
        super(props);
        let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
        this.department_codes = [{id:0, value:"全て"}];
        this.diagnosis = {};
        departmentOptions.map(department=>{
            this.department_codes.push(department);
            this.diagnosis[parseInt(department.id)] = department.value;
        });
        this.state = {
            examining: false,
            inspections: [
                {name:'院内検査', value:EXAM_CATEGORY.CONDITION_IN},
                {name:'院外検査', value:EXAM_CATEGORY.CONDITION_OUT},                
            ],
            inspection_check: [EXAM_CATEGORY.CONDITION_IN, EXAM_CATEGORY.CONDITION_OUT,3,4,5],
            isRegisterModal: false,
            inspection_category_id:"",
            alert_messages: '',
            department_id:0,
            first_ward_id:0,
            ward_master:[{id:0, value:"全て"}],
        };
        this.select_category=[];
    }

    async componentDidMount() {
        this.context.$updateStopGetHistory(false);
        this.context.$updatePageNumber(0);
        await this.getMaster();
        this.setState(
            {
                status_type: 1,
                isLoaded: false,
                bOpenAllExamination: false,
                bOpenAllExaminationLatest: true,
                categoryType: -1,
                curScrollTop: 0,
                selYear:-1,
                selMonth:-1,
                selDay:-1,
                openStatus:{
                    iExamination: 1,
                    eExamination: 1,
                },
                patient_id: "",
                birthday: "",
                age: "",
                patient_name: "",
                patient_name_kana: "",
            });
        this.searchList({
            inspection_type:this.state.inspection_check
        });

        this.setState({activeOperation: 'examination'});
    }
    getMaster = async()=> {
      let path = "/app/api/v2/ward/get/bed_control/master_data";
      await apiClient.post(path, {params: {}})
      .then(res => {
        let ward_master = this.state.ward_master;
        if(res.ward_master.length > 0){
          res.ward_master.map(ward=>{
            ward_master.push({id:ward.number, value:ward.name});
          });
        }        
        this.setState({
          ward_master,
        })
      })
    }

    setOpenClose = (nType, i) => {
        var setVal = false;
        if(i == TREE_FLAG.OPEN_TREE){
            setVal = true;
        }
        switch(nType){
            case SOAP_TREE_CATEGORY.ALL_EXAMINATION:
                this.setState({
                    bOpenAllExamination:setVal,
                });
                break;
            case SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST:
                this.setState({
                    bOpenAllExaminationLatest:setVal
                });
                break;
        }
    };

    setCurScrollTop = (nVal) => {
        this.setState({
            curScrollTop: nVal
        });
    };

    changeLeftSoapList = (department, year, month, date, nCategoryType) => {
        this.context.$updateStopGetHistory(false);
        this.context.$updatePageNumber(0);
        window.sessionStorage.setItem('soap_scroll_top', 0);
        this.ChangeInspectionResultTree(department, year, month, date, nCategoryType);
    };

    searchList = async (params) => {
        params = {category: this.state.inspection_check, keyword: this.state.patient_id};
        await apiClient.post("/app/api/v2/karte/tree/searchInspectionResult", {
            params,
        }).then((res) => {
            res.all_examination.latest = this.getLatestDataByCategory(res.all_examination.latest, res.all_dates);
            res.all_examination.data = this.getDataByCategory(res.all_examination.data, res.all_dates);
            let patient = res.patient;

            let latest = res.all_examination.latest[Object.keys(res.all_examination.latest)[0]];
            let nYear = -1;
            let nMonth = -1;
            let nDay = -1;
            let showDelete = false;
            let noData = true;
            var soapList = [];
            if (this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.SHOW_DELETE)) {
                showDelete = true;
            }
            if (latest != undefined) {
                noData = false;
                var soap_latest = res.all_examination.latest;
                Object.keys(soap_latest).map(date_data=>{
                    soap_latest[date_data].data.map((soap) => {
                        soap["openTag"] = 1;
                        soap.class_name = "open";
                        if (!showDelete) {
                            if (soap.is_enabled == 1) {
                                soapList.push(soap);
                            }
                        } else {
                            soapList.push(soap);
                        }
                    });
                });
            }
            this.setState({
                soapList: noData ? [] : soapList,
                allDateList: res.all_dates,
                allTags:res.all_tags,
                soapTrees: {
                    all_examination: res.all_examination.data,
                    all_examination_latest: res.all_examination.latest,
                },
                selYear: nYear,
                selMonth: nMonth,
                selDay: nDay,
                bOpenAllExamination: true,
                bOpenAllExaminationLatest: true,
                isLoaded: true,
                patient_name: patient !== undefined ?patient.patient_name: "",
                birthday: patient !== undefined ?patient.birthday: "",
                patient_name_kana: patient !== undefined ?patient.patient_name_kana: "",
                gender: patient !== undefined ?(patient.gender === 1 ? "男": patient.gender === 2 ? "女" : ""): "",
                age: patient !== undefined ?patient.age: "",
                patient,
            });
            return res;
        });
    };

    getDataByNumbers = (source, date, numbers = []) => {
        let result = [];
        if (numbers.length > 0) {
            Object.keys(source[date]).map(item=>{
                source[date][item].map(ele=>{
                    if (numbers.includes(ele.number)) {
                        result.push(ele);
                    }
                });
            });
        }
        return result;
    };

    getLatestDataByCategory = (source, all_dates) => {
        Object.keys(source).map((item)=>{
            source[item]["data"] = this.getDataByNumbers(all_dates, item, source[item].numbers);
        });
        return source;
    };

    getDataByCategory = (source, all_dates) => {
        Object.keys(source).map((item)=>{
            source[item].data.map(ele=>{
                ele.data.map(element=>{
                    element.data = this.getDataByNumbers(all_dates, element.date, element.numbers);
                })
            });
        });
        return source;
    };

    getCheck = (name, number) => {
        if (name == 'inspections') {
            var check_status = this.state.inspection_check;
            var find_idx = check_status.indexOf(number);
            if (find_idx == -1) check_status.push(number);
            else check_status.splice(find_idx, 1);
            this.setState({inspection_check:check_status});
        }
    };
    allSelect = () => {
        let check_status = [];
        this.state.inspections.map(item=>{
            check_status.push(item.value);
        });
        this.setState({inspection_check:check_status});
    };
    allDeSelect = () => {
        this.setState({inspection_check:[]});
    };

    ChangeInspectionResultTree(departmentIndex, yearIndex = -1, monthIndex = -1, dateIndex = -1, nCategoryType = -1) {
        let showDelete = false;
        if(this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.SHOW_DELETE)){
            showDelete = true;
        }
        let nOpenTag = true;
        if (dateIndex == -1) {
            nOpenTag = false;
        }
        let soapList = this.state.soapList;
        var strDate = yearIndex+"-"+monthIndex+"-"+dateIndex;
        var soap_latest = [];
        var active_soap_latest = [];
        let nIdx = 0; // first 3 open index
        this.setState({
            selYear: yearIndex,
            selMonth: monthIndex,
            selDay: dateIndex
        });
        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION || departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST){
            let allExamination = this.state.soapTrees.all_examination.map((item, index) => {
                item.class_name = "";
                if (index === yearIndex) {
                    item.class_name = "open";
                }
                if (nCategoryType === SOAP_TREE_CATEGORY.ALL_EXAMINATION) {
                    item.class_name = "";
                }
                item.data = item.data.map((monthItem, ind) => {
                    monthItem.class_name = "";
                    if (ind === monthIndex && index === yearIndex) {
                        monthItem.class_name = "open";
                    }
                    monthItem.data = monthItem.data.map((data, ind2) => {
                        data.class_name = "";
                        if (ind2 === dateIndex && ind === monthIndex && index === yearIndex) {
                            data.class_name = "open";
                            soapList = data.data.map((soap, soapIndex) => {
                                if (soapIndex < 0) {
                                    soap.class_name = "";
                                } else {
                                    soap.class_name = "open";
                                }
                                return soap;
                            });
                        }
                        return data;
                    })
                    return monthItem;
                })
                return item;
            })
            soapList = [];
            this.state.soapTrees.all_examination.map((item, index) => {
                if (index === yearIndex || yearIndex === -1) {
                    item.data.map((monthItem, ind) => {
                        if (ind === monthIndex || monthIndex === -1) {
                            monthItem.data.map((data, ind2) => {
                                if (ind2 === dateIndex || dateIndex === -1) {
                                    data.data.map((soap) => {
                                        soap["openTag"] = 1;
                                        soap.class_name="open";
                                        if (nIdx > 2) {
                                            soap.class_name="";
                                        }
                                        nIdx ++;
                                        if (nOpenTag == true) {
                                            soap["openTag"] = 1;
                                        }
                                        if (!showDelete) {
                                            if (soap.is_enabled == 1) {
                                                soapList.push(soap);
                                            }
                                        }else{
                                            soapList.push(soap);
                                        }
                                    });
                                }
                            })
                        }
                    })
                }
            })
            if(departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST){
                active_soap_latest = this.state.soapTrees.all_examination_latest;
                Object.keys(active_soap_latest).forEach(function(key){
                    if (key == strDate) {
                        active_soap_latest[key].class_name="open";
                    } else {
                        active_soap_latest[key].class_name="";
                    }
                });

                //------------- 自科カルテ最新15日 open tree and show 15day's data--------------------------//
                if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                    active_soap_latest = this.state.soapTrees.all_examination_latest;
                    Object.keys(active_soap_latest).forEach(function(key){
                        active_soap_latest[key].class_name="";
                    });
                }
                soapList = [];

                var stateAllExaminationLatest = this.state.soapTrees.all_examination_latest;
                Object.keys(stateAllExaminationLatest).forEach(function(key){
                    if (key == strDate) {
                        soap_latest = stateAllExaminationLatest[strDate];
                        return false;
                    }
                });

                if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                    let stateCurrentSoapLatest = this.state.soapTrees.all_examination_latest;
                    Object.keys(stateCurrentSoapLatest).forEach(function(key){
                        soap_latest.push(stateAllExaminationLatest[key]);
                    });
                }
                if (Object.keys(soap_latest).length < 1) {
                    return;
                }
                if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                    Object.keys(soap_latest).forEach(function(key){
                        soap_latest[key].data.map((soap)=>{
                            soapList.push(soap);
                        });
                    });
                } else {
                    if (soap_latest.data == null || soap_latest.data == undefined || soap_latest.data.length < 1) {
                        return;
                    }
                    soap_latest.data.map((soap)=>{
                        soap["openTag"] = 1;
                        soap.class_name = "open";
                        if (!showDelete) {
                            if (soap.is_enabled == 1) {
                                soapList.push(soap);
                            }
                        }else{
                            soapList.push(soap);
                        }
                    });
                }
            }

            if (nCategoryType === SOAP_TREE_CATEGORY.ALL_EXAMINATION) {
                this.setState({
                    soapTrees: {
                        ...this.state.soapTrees,
                        all_examination: allExamination,
                        all_examination_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST?active_soap_latest:this.state.soapTrees.all_examination_latest,
                    },
                    soapList: soapList,
                    categoryType: SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST
                });
            }else{
                this.setState({
                    soapTrees: {
                        ...this.state.soapTrees,
                        all_examination: allExamination,
                        all_examination_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST?active_soap_latest:this.state.soapTrees.all_examination_latest,
                    },
                    soapList: soapList,
                    categoryType: departmentIndex
                });
            }
        }
    }

    registerModal = () =>{
        if (this.state.patient === undefined || this.state.patient === null || this.state.patient.number === undefined){
            this.setState({alert_messages:"患者様を選択してください。"});
            return;
        }
        this.setState({isRegisterModal:true, modal_data: undefined});
    };
    closeModal = () =>{
        this.setState({isRegisterModal:false});
    };

    getValue = (e) => {
        this.setState({patient_id:e.target.value});
    };

    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
            this.searchList();
        }
    };

    handleOk = () =>{
        this.closeModal();
        this.searchList();
    };

    getDepartment = e => {
        this.setState({
            inspection_category_id:e.target.id,
            inspection_category_name: e.target.value
        })
    };
    closeSystemAlertModal () {
        this.setState({
            alert_messages: '',
        }, ()=>{
            document.getElementById('patient-search-id').focus();
        });
    }
    getDepartment = e => {
        this.setState({department_id:e.target.id}, ()=>{
        this.searchList();
        });
    };
    setWard=(e)=>{
        this.setState({first_ward_id:e.target.id});
    };
    openRegisterModal = (data) => {
        this.setState({
            patient: data.patient,
            isRegisterModal: true,
            modal_data: data.data
        })
    }

    render() {
        return (
            <>
                <PatientsWrapper>
                    <div className="title-area"><div className={'title'}>検査歴一覧</div></div>
                    <Flex>
                        <div className="w-50">
                            <div className="d-flex">
                                <div className="search-type mb-1 d-flex mr-3 ml-3">
                                    <Button type="mono" onClick={this.allSelect.bind(this)}>全選択</Button>
                                    <Button type="mono" onClick={this.allDeSelect.bind(this)}>全解除</Button>
                                </div>
                                {this.state.inspections.map(inspection => {
                                    return (
                                        <div className="check-area" key={inspection}>
                                            <Checkbox
                                                label={inspection.name}
                                                getRadio={this.getCheck.bind(this)}
                                                number={inspection.value}
                                                value={this.state.inspection_check.includes(inspection.value)}
                                                name={`inspections`}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="select-box d-flex">
                                {/* <SelectorWithLabel
                                    title=""
                                    options={this.state.inspectionCategories}
                                    getSelect={this.getInspectionCategory}
                                    value={this.state.inspection_category_name}
                                    departmentEditCode={this.state.inspection_category_id}
                                /> */}
                                <SelectorWithLabel
                                    title="診療科"
                                    options={this.department_codes}
                                    getSelect={this.getDepartment}
                                    departmentEditCode={this.state.department_id}
                                />
                                <SelectorWithLabel
                                    title="病棟"
                                    options={this.state.ward_master}
                                    getSelect={this.setWard}
                                    departmentEditCode={this.state.first_ward_id}
                                />
                                <Button style={{paddingTop :'0.25rem', paddingBottom:0, paddingLeft:'0.5rem', paddingRight:'0.5rem'}} type="mono" onClick={this.searchList.bind(this)}>検索</Button>
                            </div>
                        </div>
                        <div className="w-50">
                            <div className="patient-area">
                                <div className="d-flex remove-x-input">
                                    <div className="patient-id-search-input">
                                        <InputKeyWord
                                            type="text"
                                            label="患者ID"
                                            onChange={this.getValue.bind(this)}
                                            onKeyPressed={this.enterPressed}
                                            value={this.state.patient_id}
                                            onBlur = {this.searchList.bind(this)}
                                            className='search-input'
                                            id="patient-search-id"
                                        />
                                    </div>
                                    <div className="birthday remove-x-input">
                                        <InputWithLabel
                                            label="生年月日"
                                            type="text"
                                            diseaseEditData={this.state.birthday}
                                            readonly
                                            isDisabled = {true}
                                        />
                                    </div>
                                    <div className="age remove-x-input">
                                        <InputWithLabel
                                            label="年齢"
                                            type="text"
                                            diseaseEditData={this.state.age}
                                            readonly
                                            isDisabled = {true}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex remove-x-input">
                                    <InputWithLabel
                                        label="患者氏名"
                                        type="text"
                                        diseaseEditData={this.state.patient_name}
                                        readonly
                                        isDisabled = {true}
                                    />
                                    <InputWithLabel
                                        label="カナ氏名"
                                        type="text"
                                        diseaseEditData={this.state.patient_name_kana}
                                        readonly
                                        isDisabled = {true}
                                    />
                                </div>
                            </div>
                        </div>
                    </Flex>
                    <div className="middle-buttons d-flex w-100">
                        <div className="w-50 ml-3"><Button type="mono">最新表示</Button></div>
                        <div className="w-50 text-right"><Button type="mono" onClick={this.registerModal}>新規結果入力</Button></div>
                    </div>

                </PatientsWrapper>
                <PrescriptionWrapper>
                    <Wrapper>
                        <InspectionResultTree
                            soapTrees={this.state.soapTrees}
                            changeSoapList={this.changeLeftSoapList}
                            departmentStr={this.context.department !== undefined && this.context.department.name !== ""?this.context.department.name:"内科"}
                            bOpenCurrentSoap={this.state.bOpenCurrentSoap}
                            bOpenAllSoap={this.state.bOpenAllSoap}
                            bOpenAllOrder={this.state.bOpenAllOrder}
                            bOpenAllExamination={this.state.bOpenAllExamination}
                            bOpenAllInspection={this.state.bOpenAllInspection}
                            bOpenAllTreatment={this.state.bOpenAllTreatment}
                            bOpenAllRehabily={this.state.bOpenAllRehabily}
                            bOpenAllRadiation={this.state.bOpenAllRadiation}
                            bOpenCurrentSoapLatest={this.state.bOpenCurrentSoapLatest}
                            bOpenAllSoapLatest={this.state.bOpenAllSoapLatest}
                            bOpenAllOrderLatest={this.state.bOpenAllOrderLatest}
                            bOpenAllExaminationLatest={this.state.bOpenAllExaminationLatest}
                            bOpenAllInspectionLatest={this.state.bOpenAllInspectionLatest}
                            bOpenAllTreatmentLatest={this.state.bOpenAllTreatmentLatest}
                            bOpenAllRehabilyLatest={this.state.bOpenAllRehabilyLatest}
                            bOpenAllRadiationLatest={this.state.bOpenAllRadiationLatest}
                            setOpenClose={this.setOpenClose}
                            curScrollTop={this.state.curScrollTop}
                            setCurScrollTop={this.setCurScrollTop}
                            categoryType={this.state.categoryType}
                            selYear={this.state.selYear}
                            selMonth={this.state.selMonth}
                            selDay={this.state.selDay}
                        />
                        <div className="examination-content">
                            <InspectionResultRight
                                ref={this.middleRef}
                                isLoaded={this.state.isLoaded}
                                soapTrees={this.state.soapTrees}
                                saveConfirmMessage={this.saveConfirmMessage}
                                soapList={this.state.soapList}
                                allTags={this.state.allTags}
                                updateSoapList={this.updateSoapList}
                                changeSoapList={this.changeSoapList}
                                updateSoap={this.updateSoap}
                                showModal={this.emitPatientModalEvent}
                                patientId={this.props.match.params.id}
                                patientInfo={this.state.patientInfo}
                                categoryType={this.state.categoryType}
                                updateIndex={this.state.updateIndex}
                                setOpenClose={this.setOpenClose}
                                selYear={this.state.selYear}
                                selMonth={this.state.selMonth}
                                selDay={this.state.selDay}
                                setTagData={this.setTagData}
                                openRegisterModal={this.openRegisterModal}
                            />
                        </div>
                    </Wrapper>
                    {this.state.isRegisterModal && this.state.patient !== undefined && (
                        <RegisterExamResultModal
                            closeModal={this.closeModal}
                            patient={this.state.patient}
                            handleOk={this.handleOk}
                            modal_data={this.state.modal_data}
                        />
                    )}
                    {this.state.alert_messages !== "" && (
                        <SystemAlertModal
                            hideModal= {this.closeSystemAlertModal.bind(this)}
                            handleOk= {this.closeSystemAlertModal.bind(this)}
                            showMedicineContent= {this.state.alert_messages}
                        />
                    )}
                </PrescriptionWrapper>
            </>
        );
    }
}

InspectionList.contextType = Context;
InspectionList.propTypes = {
    patientInfo: PropTypes.object.isRequired,
    patientId: PropTypes.number.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.node
        }).isRequired
    }).isRequired,
    history: PropTypes.object
};
export default InspectionList;
