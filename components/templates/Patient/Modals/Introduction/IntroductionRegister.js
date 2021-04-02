import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { surface } from "~/components/_nano/colors";
import {formatDateLine, formatJapanDateSlash} from "~/helpers/date"
import InputWithLabel from "~/components/molecules/InputWithLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import SelectDoctorModal from "../../../../molecules/SelectDoctorModal";
import SelectorWithLabelIndex from "~/components/molecules/SelectorWithLabelIndex";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import { Modal } from "react-bootstrap";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
`;

const Card = styled.div`
  position: relative;  
  width: 100%;
  margin: 0px;
  float: left;
  background-color: ${surface};
  height: calc(100% - 70px);
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;

  .content{        
    margin-top: 10px;
    overflow:hidden;
    overflow-y: auto;
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .clickable{
    cursor:pointer;
    input{
      cursor:pointer;
    }
  }
  .text-label{
    display: block;
    overflow: hidden;
    width: 100px;
    text-align: right;
    font-size: 16px;
    margin-right: 8px;
    
    .label-type1{    
      font-size: 16px;
      text-align: right;
      width: 100%;  
      float: left;
    }
    .label-type2{
      font-size: 20px;
      float: right;
      cursor: pointer;
    }
  }

  .left-area {
    width: 70%;    
    height: 100%;    
    float: left;
    .main-info{
      height: 15%;
      display: flex;
      margin-bottom: 10px;
    }
    .label-cur-date {
        text-align: left;
        width: 60px;
        font-size: 16px;
        margin-top: 14px;
    }
    .cur-date {
        width: 64%;
        height: 35px;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        margin-top: 8px;
        padding: 0px 8px;
        line-height: 35px;
    }
    .main-info .disease-name {
        height: 80%;
        overflow: hidden;
        border: 1px solid #ddd;
        p {
            margin: 0;
            text-align: center;
            font-size: 20px;
        }
    }
    .disease-name {
        height: 80%;
        border: 1px solid #ddd;
        .history-title {
        font-size: 20px;
        }
        .flex div {
            width: 50%;
        }
        .history-delete {
            cursor: pointer;
        }
    }
    .disease-history {
        width: calc(100% - 100px) !important;
        font-size: 20px;
        textarea {
            width: 100%;
            height: 100%;
        }
        
    }
    .box-border {
        overflow: hidden;
        overflow-y: auto;
        border: 1px solid black;
        height: 85%;
        p {
            margin: 0;
            text-align: center;
        }
        .select-area .radio-group-btn label {
            text-align: left;
            padding-left: 10px;
            border-radius: 4px;
        } 
    }
  }
  .right-area {
    width: 30%;        
    padding-left: 20px;
    height: 100%;
    float:right;
    .area-name {
        font-size: 20px;
        width: calc(100% - 160px);
    }
    .delete-history{
      width: 150px;
    }
  }
    .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .label-box {
    font-size: 16px;
    border: 1px solid #a0a0a0;
  }
  .prev-session {    
    width: 65%;
    padding-left: 5%;
  }
  .pt-20 {
    padding-top: 20px;
  }
  .pt-10 {
    padding-top: 10px;
  }
  .pt-12 {
    padding-top: 12px;
  }
  .padding-top-5 {
    padding-top: 5px;
  }
  .wp-30 {
    width: 30%;
  }
  .wp-35 {
    width: 35%;
  }
  .wp-40 {
    width: 40%;
  }
  .wp-45 {
    width: 45%;
    cursor: pointer;
  }
  .wp-55 {
    width: 55%;
  }
  .wp-60 {
    width: 60%;
  }
  .wp-70 {
    width: 70%;
  }
  .hp-100 {
    height : 100%;
  }
  .selected{
    background:lightblue;
  }
  .table-view{
    border: 1px solid #ddd;
    overflow: hidden;
    height: 90%;
  }

  .history-item{
    padding: 5px;
  }

  .history-header{
    overflow: hidden;
    display: flex;
    margin-bottom: 20px;
  }

  .header-item{
    width: 70%;    
    margin-right: 30px;
    .div-foot{
      overflow: hidden;
      width: 100%;
      display: flex;
      .pullbox {
        width: calc(100% - 100px);
        float: left;
        margin-right: 20px;
      }
      .unit {
        padding-top: 14px;
      }
      span{
        margin-top: 12px;        
        display: flex;
      }
      .hVAPNc{
          width: 60% !important;
          margin-right: 10px;
      }
    }
    .label-title{
        width: 100px;
        text-align: right;
        font-size: 16px;
        margin-top: 5px;
        margin-bottom: 0;
        margin-right: 8px;
    }
    .hVAPNc{
      width: 70%;
      float: left;
    }
    .pullbox-label {
        width: 80%;
        select {
            width: 100%;
            height: 35px;
        }
    }
    label {              
        width: 100px;
        text-align: right;
        font-size: 16px;
        margin-top: 5px;
        margin-bottom: 0;
    }
    input {
        width: 80%;
        float: left;
        height: 35px;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 8px;
    }
    button{
      margin-left: 10px;
      margin-top: 8px; 
        background-color: #f3f3f3;
    }
    .flex label{
      display:none;
    }    
  }

  .header-item-right{
    width: 30% !important;    
    margin-right: 30px;
    .hVAPNc{
      width:100%;
      float:none;
    }
    .eWZCMA {
        width: calc(100% - 100px);
    }
    .react-datepicker-wrapper {
        width: calc(100% - 100px);
        input {
            width: 100%;
        }
    }
  }
  textarea{
    height: 100px !important;
    font-size: 15px;
    }
 `;

const init_other_facilities_department_datas = [
    { id: 0, value: "" },
];

const init_other_facilities_doctors = [
    { id: 0, value: "" },
];


class IntroductionRegister extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        this.state = {
            patient_id:0,
            past_history: "",
            disease_history: "",
            isShowDiseaseList:false,
            doctor_number:0,
            disease_codes:[],
            selected_history_number:0,
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message:"",
            isOpenPreviewModal: false,
            patientInfo: "",
            other_facilities_data:[],
            other_facilities_department_datas:init_other_facilities_department_datas,
            other_facilities_doctors:init_other_facilities_doctors,
            number:'',
            write_date:new Date(),
            other_facility_number:0,
            other_facilities_department:'',
            other_facilities_doctor:'',
            disease_name: "",
            introduction_purpose: "",
            family_history: "",
            inspection_result: "",
            course_treatment: "",
            cur_prescription: "",
            remark: "",
            disease_history_data:[],
            select_data:'',
            isShowDoctorList:false,
            instruction_doctor_number: 0,
            instruction_doctor_name: "",
            other_facilities_doctor_name: "",
            other_facilities_department_name: "",
            select_doctor: false,
            isSaveConfirmModal: false,
            isCancelConfirmModal: false,
            isNewCancelConfirmModal: false,
        }
    }

    async componentDidMount() {
        var base_modal = document.getElementsByClassName("outpatient-modal")[0];
        base_modal.style['z-index'] = 1040;
        await apiClient.get("/app/api/v2/secure/staff/search?")
            .then((res) => {
                let staff_list_by_number = {};
                if (res != undefined){
                    Object.keys(res).map((key) => {
                        staff_list_by_number[res[key].number] = res[key].name;
                    });
                }
                this.setState({
                    staffs: res,
                    staff_list_by_number
                });
            });
        await this.getMedicalDocInfo();
        if (this.props.selected_history !== undefined && Object.keys(this.props.selected_history).length > 0) {
            this.selectFromHistory(this.props.selected_history);
        }
    }

    async UNSAFE_componentWillMount(){
        await this.getDoctors();
        await this.getDiseases();
        await this.setDoctors();
        await this.getOtherFacilities();
    }

    selectStaff = (staff) => {
        this.setState({
            instruction_doctor_number:staff.number,
            instruction_doctor_name: staff.name
        });
        this.closeDoctorSelectModal();
    };

    async getMedicalDocInfo(){
        let path = "/app/api/v2/patients/introduction/search";
        const post_data = {
            system_patient_id:this.props.patientId,
            document_name:'紹介情報',
            write_date:this.state.write_date,
        };
        await apiClient
            ._post(path, {
                params: post_data
            })
            .then((res) => {
                if(res.length > 0){
                    this.setState({
                        disease_history_data:res,
                    });
                } else {
                    this.setState({
                        disease_history_data:[],
                        family_history:'',
                    });
                }
            })
            .catch(() => {

            });
    }

    getOtherFacilityName = e => {
        let department_datas = [
            { id: 0, value: "" },
        ];
        let doctor_datas = [
            { id: 0, value: "" },
        ];

        this.setState({
                other_facility_number:parseInt(e.target.id),
                other_facilities_department_datas:department_datas,
                other_facilities_doctors:doctor_datas,
                other_facilities_department:'',
                other_facilities_doctor:'',
            },
            ()=>{
                this.getOtherFacilitiesDepartmentDatas(this.state.other_facility_number);
            })
    };

    getOtherFacilitiesDepartmentDatas =async( other_facility_number ) => {
        if(other_facility_number !== 0){
            let path = "/app/api/v2/dial/master/other_facilities_department_search";
            let post_data = {
                other_facilities_number: other_facility_number,
                is_enabled: 1
            };
            let { data } = await axios.post(path, { params: post_data });
            let department_datas = init_other_facilities_department_datas;
            data.map((item, index) => {
                let department_info = {id: item.number, value: item.name};
                department_datas[index+1]= department_info;
            });
            this.setState({
                other_facilities_department_datas:department_datas,
            });
        }
    };

    getOtherFacilitiesDepartment = e => {
        this.setState({
            other_facilities_department: parseInt(e.target.id),
        }, ()=>{
            this.getOtherFacilitiesDoctors(this.state.other_facility_number, this.state.other_facilities_department);
        });
    };

    getOtherFacilitiesDoctors =async( other_facility_number, other_facilities_department ) => {
        let doctor_datas = [
            { id: 0, value: "" },
        ];
        if(other_facilities_department !== 0){
            let path = "/app/api/v2/dial/master/other_facilities_doctor_search";
            let post_data = {
                other_facilities_number: other_facility_number,
                other_facilities_department_number: other_facilities_department,
                is_enabled: 1
            };
            let { data } = await axios.post(path, { params: post_data });

            data.map((item, index) => {
                let doctor_info = {id: item.number, value: item.name};
                doctor_datas[index+1]= doctor_info;
            });
        }
        this.setState({other_facilities_doctors:doctor_datas});
    };

    getOtherFacilitiesDoctor = e => {
        this.setState({
            other_facilities_doctor: parseInt(e.target.id),
        });
    };

    setDiseaseName = (e) => {
        this.setState({disease_name:e.target.value});
    };

    setIntroductionPurpose = (e) => {
        this.setState({introduction_purpose:e.target.value});
    };

    setFamilyHistory = (e) => {
        this.setState({family_history:e.target.value});
    };

    setInspectionResult = (e) => {
        this.setState({inspection_result:e.target.value});
    };

    setCourseTreatment = (e) => {
        this.setState({course_treatment:e.target.value});
    };

    setCurPrescription = (e) => {
        this.setState({cur_prescription:e.target.value});
    };

    setRemark = (e) => {
        this.setState({remark:e.target.value});
    };

    selectPatient = (patientInfo) => {
        this.setState({
            patientInfo:patientInfo,
            number:'',
            other_facility_number:0,
            other_facilities_department:'',
            other_facilities_doctor:'',
            write_date:new Date(),
            disease_name:'',
            introduction_purpose:'',
            family_history:'',
            inspection_result:'',
            course_treatment:'',
            cur_prescription:'',
            remark:'',
            select_data:'',
            other_facilities_data:[],
            other_facilities_department_datas:init_other_facilities_department_datas,
            other_facilities_doctors:init_other_facilities_doctors,
            instruction_doctor_number: 0,
        }, () => {this.getMedicalDocInfo();})
    };

    selectDoctor = (doctor) => {
        this.setState({
            instruction_doctor_number:doctor.number
        })
        this.closeModal();
    }

    selectFromHistory = (data) => {
        let {other_facility_number,other_facilities_department,other_facilities_doctor,disease_name,introduction_purpose,
            family_history,inspection_result,course_treatment,cur_prescription,remark} = this.state;
        if (other_facility_number == 0 && other_facilities_department == "" && other_facilities_doctor == "" && disease_name == "" && 
            introduction_purpose == "" && family_history == "" && inspection_result == "" && course_treatment == "" && cur_prescription == "" && remark == ""){
            if (data != undefined) {
                this.setState({selected_history_data: data}, ()=>{
                    this.selectHistory();
                })
            }
          return;  
        } 

        if (data !== undefined) {
            this.setState({
                selected_history_data: data,
                isCancelConfirmModal: true,
                confirm_message: "入力内容を破棄しますか？",
            });
        } 
    }

    selectHistory = () => {
        this.confirmCancel();
        let data = this.state.selected_history_data;
        if (data == undefined) {
            return;
        }
        this.getOtherFacilities();
        this.getOtherFacilitiesDepartmentDatas(data.other_facilities_number);
        this.getOtherFacilitiesDoctors(data.other_facilities_number, data.other_facilities_department_number);
        let disease_name = '';
        let introduction_purpose = '';
        let family_history = '';
        let inspection_result = '';
        let course_treatment = '';
        let cur_prescription = '';
        let remark = '';
        data.item.map((item) => {
            if(item.form_name === '傷病名'){
                disease_name = item.body;
            }
            if(item.form_name === '紹介目的'){
                introduction_purpose = item.body;
            }
            if(item.form_name === '既往歴,家族歴'){
                family_history = item.body;
            }
            if(item.form_name === '症状経過,検査結果'){
                inspection_result = item.body;
            }
            if(item.form_name === '治療経過'){
                course_treatment = item.body;
            }
            if(item.form_name === '現在の処方'){
                cur_prescription = item.body;
            }
            if(item.form_name === '備考'){
                remark = item.body;
            }
        });

        this.setState({
            select_data:data,
            number:data.number,
            other_facility_number:data.other_facilities_number,
            other_facilities_department:data.other_facilities_department_number,
            other_facilities_doctor:data.other_facilities_doctor_number,
            write_date:new Date(data.write_date),
            disease_name,
            introduction_purpose,
            family_history,
            inspection_result,
            course_treatment,
            cur_prescription,
            remark,
            instruction_doctor_number: data.instruction_doctor_number,
        });
    };

    deleteHistory = async() => {
        let path = "/app/api/v2/patients/introduction/delete";
        const post_data = {
            number:this.state.number
        };
        await apiClient
            ._post(path, {
                params: post_data
            })
            .then((res) => {
                window.sessionStorage.setItem("alert_messages", res.alert_message);
                this.selectPatient(this.state.patientInfo);
            })
            .catch(() => {

            });

        this.setState({isDeleteConfirmModal:false});
    }

    getDate = value => {
        this.setState({
            write_date: value,
        }, ()=>this.getMedicalDocInfo());
    };

    delete = () => {
        if(this.state.number !== ""){
            this.setState({
                isDeleteConfirmModal : true,
                confirm_message: "履歴情報を削除しますか?",
            });
        }
    }

    openPreviewModal = () => {
        if(this.state.select_data === '') {
            window.sessionStorage.setItem("alert_messages", "履歴を選択してください。");
            return;
        }
        this.setState({
            isOpenPreviewModal: true,
        });
    }
    closeModal = () => {
        this.setState({
            isOpenPreviewModal: false,
            isShowDoctorList:false,
        });
    };

    confirmCancel() {
        this.setState({
            isDeleteConfirmModal: false,
            isSaveConfirmModal: false,
            isCancelConfirmModal: false,
            isNewCancelConfirmModal: false,
            confirm_message: "",
        });
    }

    register = () => {
        if(this.state.other_facility_number === 0){
            window.sessionStorage.setItem("alert_messages", "医療機関名を選択してください。");
            return;
        }
        if(this.state.other_facilities_department === ''){
            window.sessionStorage.setItem("alert_messages", "診療科を選択してください。");
            return;
        }
        if(this.state.other_facilities_doctor === ''){
            window.sessionStorage.setItem("alert_messages", "御担当医を選択してください。");
            return;
        }
        if (this.props.patientId === undefined || this.props.patientId == null) return;
        this.setState({
            isSaveConfirmModal: true,
            confirm_message: this.state.number ? '編集しますか？' : '登録しますか？',
        });
    };

    saveData = async() => {
        let path = "/app/api/v2/patients/introduction/register";
        let input_data = {
            number:this.state.number,
            system_patient_id:this.props.patientId,
            document_name:'紹介情報',
            write_date:formatDateLine(this.state.write_date),
            other_facilities_number: this.state.other_facility_number,
            other_facility_name:this.state.otherFacilitiesData != undefined ? this.state.otherFacilitiesData[this.state.other_facility_number] : '',
            other_facilities_department_number: this.state.other_facilities_department,
            other_facilities_department_name:(this.state.other_facilities_department_datas != undefined  && this.state.other_facilities_department_datas.find(x => x.id === this.state.other_facilities_department) != undefined) ? this.state.other_facilities_department_datas.find(x => x.id === this.state.other_facilities_department).value : '',
            other_facilities_doctor_number:this.state.other_facilities_doctor,
            other_facilities_doctor_name:(this.state.other_facilities_doctors != undefined  && this.state.other_facilities_doctors.find(x => x.id === this.state.other_facilities_doctor) != undefined) ? this.state.other_facilities_doctors.find(x => x.id === this.state.other_facilities_doctor).value : '',
            disease_name:this.state.disease_name,
            introduction_purpose:this.state.introduction_purpose,
            family_history:this.state.family_history,
            inspection_result:this.state.inspection_result,
            course_treatment:this.state.course_treatment,
            cur_prescription:this.state.cur_prescription,
            remark:this.state.remark,
            instruction_doctor_number: this.state.instruction_doctor_number,
            instruction_doctor_name: this.state.instruction_doctor_name,
        };
        await apiClient._post(path, {params: input_data}).then((res) => {
            if(res){
                window.sessionStorage.setItem("alert_messages", res.alert_message);
                this.selectPatient(this.state.patientInfo);
            }
        }).catch(() => {});
        this.confirmCancel();
    }

    getDoctor = e => {
        this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
        // this.getSetData(e.target.id, this.context.department.code, 0, 0);
    };

    selectDoctorFromModal = (id, name) => {
        this.setState({
            instruction_doctor_number: id,
            instruction_doctor_name: name,
            select_doctor: false
        });
    };

    closeDoctor = () => {
        this.setState({
            select_doctor:false
        });
    };

    chooseDoctor = () =>{
        let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
        if (authInfo != undefined && authInfo != null && authInfo.doctor_number > 0) return;
        this.getDoctorsLists();
    };

    getDoctorsLists = async () => {
        let data = await apiClient.get("/app/api/v2/secure/doctor/search?");
        this.setState({
            doctors: data,
            select_doctor: true,
        });
    };

    formatInputValue = () => {
        this.confirmCancel();
        this.selectPatient(this.state.patientInfo);
    };

    newInsert = () => {
        let {other_facility_number,other_facilities_department,other_facilities_doctor,disease_name,introduction_purpose,
            family_history,inspection_result,course_treatment,cur_prescription,remark} = this.state;
        if (other_facility_number == 0 && other_facilities_department == "" && other_facilities_doctor == "" && disease_name == "" && 
            introduction_purpose == "" && family_history == "" && inspection_result == "" && course_treatment == "" && cur_prescription == "" && remark == ""){
          return;  
        } 
        this.setState({
            isNewCancelConfirmModal: true,
            confirm_message: "入力内容を破棄しますか？",
        });
    };

    render() {
        const { closeModal} = this.props;
        let {disease_history_data, otherFacilitiesData, other_facilities_department_datas, other_facilities_doctors} = this.state;
        let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
        let doctor_name = authInfo != undefined && authInfo != null && authInfo.doctor_number > 0 ? authInfo.name : "";
        let cur_prescription = '';
        if(this.state.cur_prescription){
            cur_prescription = this.state.cur_prescription;
        }
        return (
            <Modal show={true} className="outpatient-modal exa-modal">
                <Modal.Header>
                    <Modal.Title><span>紹介情報</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Card>
                    <Wrapper>
                        <div className="hp-100 content">
                            <div className="left-area">
                                <div className="history-header">
                                    <div className="header-item">
                                        <SelectorWithLabelIndex
                                            options={otherFacilitiesData}
                                            title="医療機関名"
                                            getSelect={this.getOtherFacilityName.bind(this)}
                                            departmentEditCode={this.state.other_facility_number}
                                        />
                                        <SelectorWithLabel
                                            title="診療科"
                                            options={other_facilities_department_datas}
                                            getSelect={this.getOtherFacilitiesDepartment}
                                            departmentEditCode={this.state.other_facilities_department}
                                        />
                                        <div className="div-foot">
                                            <SelectorWithLabel
                                                title="御担当医"
                                                options={other_facilities_doctors}
                                                getSelect={this.getOtherFacilitiesDoctor}
                                                departmentEditCode={this.state.other_facilities_doctor}
                                            />
                                            <div className={'unit'}>御侍史</div>
                                        </div>
                                    </div>
                                    <div className="header-item header-item-right">
                                        <div className='direct_man' onClick={this.chooseDoctor}>
                                            <InputWithLabel
                                                label="医師名"
                                                type="text"
                                                placeholder = "クリックして選択"
                                                diseaseEditData={doctor_name != "" ? doctor_name : (this.state.instruction_doctor_number>0 ? this.state.instruction_doctor_name:'')}
                                            />

                                        </div>
                                        <InputWithLabel
                                            label="作成日"
                                            type="date"
                                            getInputText={this.getDate.bind(this)}
                                            diseaseEditData={this.state.write_date}
                                        />
                                    </div>
                                </div>
                                <div className="main-info">
                                    <div className="text-label">
                                        <div className="label-type1"> 傷病名</div>
                                    </div>
                                    <div className="disease-history">
                                      <textarea
                                          onChange={this.setDiseaseName.bind(this)}
                                          value={this.state.disease_name}
                                      />
                                    </div>
                                </div>

                                <div className="main-info">
                                    <div className="text-label">
                                        <div className="label-type1">紹介目的</div>
                                    </div>
                                    <div className="disease-history">
                                      <textarea
                                          onChange={this.setIntroductionPurpose.bind(this)}
                                          value={this.state.introduction_purpose}
                                      />
                                    </div>
                                </div>

                                <div className="main-info">
                                    <div className="text-label">
                                        <div className="label-type1">既往歴<br />家族歴</div>
                                    </div>
                                    <div className="disease-history">
                                      <textarea
                                          onChange={this.setFamilyHistory.bind(this)}
                                          value={this.state.family_history}
                                      />
                                    </div>
                                </div>

                                <div className="main-info">
                                    <div className="text-label">
                                        <div className="label-type1">症状経過<br />検査結果</div>
                                    </div>
                                    <div className="disease-history">
                                      <textarea
                                          onChange={this.setInspectionResult.bind(this)}
                                          value={this.state.inspection_result}
                                      />
                                    </div>
                                </div>

                                <div className="main-info">
                                    <div className="text-label">
                                        <div className="label-type1">治療経過</div>
                                    </div>
                                    <div className="disease-history">
                                      <textarea
                                          onChange={this.setCourseTreatment.bind(this)}
                                          value={this.state.course_treatment}
                                      />
                                    </div>
                                </div>

                                <div className="main-info">
                                    <div className="text-label">
                                        <div className="label-type1">現在の処方</div>
                                    </div>
                                    <div className="disease-history">
                                      <textarea
                                          onChange={this.setCurPrescription.bind(this)}
                                          value={cur_prescription}
                                      />
                                    </div>
                                </div>

                                <div className="main-info">
                                    <div className="text-label">
                                        <div className="label-type1">備考</div>
                                    </div>
                                    <div className="disease-history">
                                      <textarea
                                          onChange={this.setRemark.bind(this)}
                                          value={this.state.remark}
                                      />
                                    </div>
                                </div>
                            </div>
                            <div className="right-area">
                                <div className={'flex'}>
                                    <div className="area-name">履歴一覧</div>
                                    <div className='delete-history clickable' onClick={this.delete}><Icon icon={faTrash}/>選択した履歴を削除</div>
                                </div>
                                <div className="table-view">
                                    <div style={{cursor:"pointer"}} onClick={this.newInsert}>新規入力</div>
                                    {disease_history_data !== undefined && disease_history_data !==null && (
                                        disease_history_data.map((item, index) => {
                                            return (
                                                <>
                                                    <div className={this.state.number === item.number?"history-item clickable selected":"history-item clickable"}
                                                         onClick={this.selectFromHistory.bind(this, disease_history_data[index])}>
                                                        {formatJapanDateSlash(item.write_date)}<br />
                                                        {item.subject}
                                                    </div>
                                                </>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </Wrapper>
                    {this.state.isDeleteConfirmModal !== false && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.deleteHistory.bind(this)}
                            confirmTitle= {this.state.confirm_message}
                        />
                    )}
                    {this.state.isSaveConfirmModal !== false && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.saveData.bind(this)}
                            confirmTitle= {this.state.confirm_message}
                        />
                    )}
                    {this.state.isCancelConfirmModal !== false && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.selectHistory.bind(this)}
                            confirmTitle= {this.state.confirm_message}
                        />
                    )}
                    {this.state.isNewCancelConfirmModal !== false && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.formatInputValue.bind(this)}
                            confirmTitle= {this.state.confirm_message}
                        />
                    )}
                    {this.state.select_doctor === true ? (
                        <SelectDoctorModal
                            closeDoctor={this.closeDoctor}
                            getDoctor={this.getDoctor}
                            selectDoctorFromModal={this.selectDoctorFromModal}
                            doctors={this.state.doctors}
                        />
                    ) : (
                        ""
                    )}
                </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel-btn" onClick={closeModal}>キャンセル</Button>
                    <Button className="red-btn" onClick={this.register}>{this.state.number ? '変更' : '登録'}</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

IntroductionRegister.contextType = Context;

IntroductionRegister.propTypes = {
    closeModal: PropTypes.func,
    patientId: PropTypes.number,
    patientInfo: PropTypes.object,
    history: PropTypes.object,
    selected_history: PropTypes.object,

};

export default IntroductionRegister