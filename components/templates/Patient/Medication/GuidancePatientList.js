import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import ja from "date-fns/locale/ja";
import { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Radiobox from "~/components/molecules/Radiobox";
import Checkbox from "~/components/molecules/Checkbox";
import PharmacistChoice from "~/components/templates/Patient/Medication/PharmacistChoice";
import {formatDateLine} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import Button from "~/components/atoms/Button";

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    font-size: 1rem;
    .flex {
        display: flex;
    }
    .inspection-period {
        width: 400px;
        .div-title {
            line-height: 30px;
            margin-top: 8px;
            width: 60px;
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
    .patient-id {
        div {
            margin-top: 0;
            .label-title {
                font-size: 1rem;
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
            width: 8rem;
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
        font-size: 1rem;
    }
    .select-doctor {
      .pullbox-select {
        width: 15rem;
      }
      .label-title {
          width: 7rem;
      }
    }
    .select-ward {
        .label-title {
            width: 100px;
        }
    }
    .radio-area {
        border:1px solid #aaa;
        label {
            line-height: 30px;
            font-size: 1rem;
            width: 100px;
        }
        margin-right: 1rem;
        padding-left: 1rem;
    }
    .select-check {
        label {
            line-height: 30px;
            font-size: 1rem;
        }
    }
    .table-area {
        width:100%;
        height: calc(100% - 250px);
        overflow-y: auto;
        padding-top:10px;
        table {
          height: calc(100% - 1rem);
        }
        th {
            text-align: center;
            padding:0;
        }
        thead{
          display:table;
          width:100%;    
          border-bottom: 1px solid #dee2e6;    
          tr{width: calc(100% - 17px);}
        }
        tbody{
          display:block;
          overflow-y: scroll;
          height: calc(100% - 2rem);
          width:100%;
          tr {
            cursor: pointer
          }
        }
        tr{
          display: table;
          width: 100%;
        }
        .selected {
          background: lightblue;
        }
        td {
          padding: 0.25rem;
          word-break: break-all;
        }
        .td-status {
            width: 3rem;
        }
        .td-date {
            width: 10rem;
        }
        .td-ward {
            width: 5rem;
        }
        .td-room {
            width: 5rem;
        }
        .td-patientName {
            width: calc(100% - 40rem);
        }
        .td-patientId {
            width: 6rem;
        }
        .td-sex {
            width: 3rem;
        }
        .td-department {
            width: 7rem;
        }
    }
`;


class GuidancePatientList extends Component {
    constructor(props) {
        super(props);
        let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
        let department_codes = [{id:0, value:"全て"}];
        let diagnosis = {};
        departmentOptions.map(department=>{
            department_codes.push(department);
            diagnosis[parseInt(department.id)] = department.value;
        });
        this.departmentOptions = departmentOptions;
        let cache_ward_master = JSON.parse(window.sessionStorage.getItem("init_status")).ward_master;
        let ward_master = [{id:0, value:"全病棟"}];
        let ward_names = {};
        if (cache_ward_master != undefined && ward_master.length > 0){
            cache_ward_master.map(ward=>{
                ward_master.push({id:ward.number, value: ward.name});
                ward_names[parseInt(ward.number)] = ward.name;
            });
        }
        
        let cur_date = new Date();
        this.state = {
            start_date: new Date(cur_date.getTime() - 60 * 60 * 24 * 7 * 1000),
            end_date: cur_date,
            patient_id:'',
            department_id:0,
            department_codes,
            diagnosis,
            ward_master,
            staff_master:[{id:0, value:"未設定"}],
            first_ward_id:0,
            doctor_id:0,
            status:2,
            medication_instruction_flag:0,
            drug_instruction_flag:0,
            openPharmacistChoice:false,
            table_list:[],
            is_loaded: false,
            alert_messages: '',
            confirm_message: '',
            complete_message: '',
        };
    }

    async componentDidMount() {
      await this.searchResult();
    }

   searchResult = async () => {
      this.setState({is_loaded: false});
      let params = {
        start_date: formatDateLine(this.state.start_date),
        end_date: formatDateLine(this.state.end_date),
        doctor_id: this.state.doctor_id,
        patient_id: this.state.patient_id,
        department_id: this.state.department_id,
        first_ward_id: this.state.first_ward_id,
        drug_instruction_flag: this.state.drug_instruction_flag,
        medication_instruction_flag: this.state.medication_instruction_flag,
        complete_status: this.state.status
      }
      await apiClient.post("/app/api/v2/secure/medicine_guidance_request/search?", params)
      .then((res) => {
        this.setState({
          is_loaded: true,
          table_list: res
        })
      });
    }

    setPeriod=(key,value)=>{
        this.setState({[key]:value});
    };

    setPatientId = e => {
        this.setState({patient_id: e.target.value})
    };

    getDepartment = e => {
      this.setState({department_id:e.target.id})
    };

    setWard=(e)=>{
      this.setState({first_ward_id:e.target.id});
    };

    setStaffId=(e)=>{
      this.setState({doctor_id:e.target.id});
    };

    setCheck = (name, value) => {
      if (name === "medication_instruction_flag"){
        this.setState({medication_instruction_flag: value});
      }
      if (name === "drug_instruction_flag"){
        this.setState({drug_instruction_flag: value});
      }
    };

    setStatus = (e) => {
      this.setState({status:parseInt(e.target.value)});
    };

    closeModal=(refresh = false)=>{
      let base_modal = document.getElementsByClassName("guidance-patient-list")[0];
      if(base_modal !== undefined && base_modal != null){
          base_modal.style['z-index'] = 1050;
      }
      this.setState({
        openPharmacistChoice:false,
        confirm_message:'',
      });
      if (refresh) this.searchResult();
    };
    
    getDepartmentName = id => {
      let departmentStr = "";
      this.departmentOptions.map(item => {
        if (parseInt(item.id) === parseInt(id)) {
          departmentStr = item.value;
        }
      });
      return departmentStr;
    }
    selectOrder = (item) => {
      this.setState({selected_item: item});
    }
    registerPharmacist = (item = null) => {
      let base_modal = document.getElementsByClassName("guidance-patient-list")[0];
      if(base_modal !== undefined && base_modal != null){
          base_modal.style['z-index'] = 1040;
      }
      if (item == null && (this.state.selected_item == undefined || this.state.selected_item == null)) {
        this.setState({alert_messages: "患者様を選択してください。"});
        return;
      }
      if (item == null) {
        this.setState({openPharmacistChoice:true});
      } else {
        this.setState({
          openPharmacistChoice:true,
          selected_item: item
        });
      }
    }

    closeSystemAlertModal () {
      let base_modal = document.getElementsByClassName("guidance-patient-list")[0];
      if(base_modal !== undefined && base_modal != null){
          base_modal.style['z-index'] = 1050;
      }
      this.setState({alert_messages: ''});
    }
    confirmPrint=()=>{
      let base_modal = document.getElementsByClassName("guidance-patient-list")[0];
      if(base_modal !== undefined && base_modal != null){
          base_modal.style['z-index'] = 1040;
      }
      if(this.state.table_list.length > 0){
        this.setState({confirm_message:"印刷しますか？"});
      }
    }

    confirmOk=async()=>{ //㊞
      this.setState({
        confirm_message:"",
        complete_message:"印刷中"
      });
      let path = "/app/api/v2/secure/medicine_guidance_schedule/print/guidance_patient_list";
      let print_data = {};
      print_data.table_data = this.state.table_list;
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
          window.navigator.msSaveOrOpenBlob(blob, '指導患者一覧.pdf');
        }
        else{
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', '指導患者一覧.pdf'); //or any other extension
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
    }

    render() {
      let {table_list} = this.state;
        return (
            <>
                <Modal show={true} className="custom-modal-sm patient-exam-modal guidance-patient-list">
                    <Modal.Body>
                        <Wrapper>
                            <div className={'flex'}>
                                <div className={'inspection-period flex'}>
                                    <div className={'div-title'}>同意日</div>
                                    <InputWithLabel
                                        type="date"
                                        getInputText={this.setPeriod.bind(this, 'start_date')}
                                        diseaseEditData={this.state.start_date}
                                    />
                                    <div className={'from-to'}>～</div>
                                    <InputWithLabel
                                        type="date"
                                        getInputText={this.setPeriod.bind(this, 'end_date')}
                                        diseaseEditData={this.state.end_date}
                                    />
                                </div>
                                <div style={{textAlign:"right", width:"calc(100% - 400px)", marginTop:"8px"}}>
                                    <Button type="common" onClick={this.registerPharmacist.bind(this, null)}>薬剤師登録</Button>
                                </div>
                            </div>
                            <div className={'flex'} style={{marginTop:10}}>
                                <div className={'patient-id'}>
                                    <InputWithLabel
                                        label="患者ID"
                                        type="text"
                                        getInputText={this.setPatientId.bind(this)}
                                        diseaseEditData={this.state.patient_id}
                                    />
                                </div>
                                <div className={'select-department'}>
                                    <SelectorWithLabel
                                        title="診療科"
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
                                <div className={'select-doctor'}>
                                    <SelectorWithLabel
                                        title="担当薬剤師"
                                        options={this.props.doctor_list}
                                        getSelect={this.setStaffId}
                                        departmentEditCode={this.state.doctor_id}
                                    />
                                </div>
                            </div>
                            <div style={{textAlign:"right", paddingTop:"10px"}}>
                                <Button type="common" onClick={this.props.closeModal}>閉じる</Button>
                            </div>
                            <div style={{paddingTop:"10px"}}>服薬指導</div>
                            <div className={'flex'}>
                                <div className={'radio-area'}>
                                    <Radiobox
                                        label={'済'}
                                        value={1}
                                        getUsage={this.setStatus.bind(this)}
                                        checked={this.state.status === 1}
                                        disabled={true}
                                        name={`radio_type`}
                                    />
                                    <Radiobox
                                        label={'予定'}
                                        value={0}
                                        getUsage={this.setStatus.bind(this)}
                                        checked={this.state.status === 0}
                                        disabled={true}
                                        name={`radio_type`}
                                    />
                                    <Radiobox
                                        label={'全て'}
                                        value={2}
                                        getUsage={this.setStatus.bind(this)}
                                        checked={this.state.status === 2}
                                        disabled={true}
                                        name={`radio_type`}
                                    />
                                </div>
                                <div className={'select-check'}>
                                    <Checkbox
                                        label="服薬指導あり"
                                        getRadio={this.setCheck.bind(this)}
                                        value={this.state.medication_instruction_flag}
                                        name="medication_instruction_flag"
                                    />
                                    <Checkbox
                                        label="麻薬指導あり"
                                        getRadio={this.setCheck.bind(this)}
                                        value={this.state.drug_instruction_flag}
                                        name="drug_instruction_flag"
                                    />
                                </div>
                            </div>
                            <div className={'flex'} style={{paddingTop:"10px"}}>
                                <div style={{width:"50%"}}><Button type="common" onClick={this.searchResult}>最新表示</Button></div>
                                <div style={{width:"50%", textAlign:"right"}}><Button type="common" onClick={this.confirmPrint}>一覧印刷</Button></div>
                            </div>
                            <div className={'table-area'}>
                                <table className="table-scroll table table-bordered" id="code-table">
                                    <thead>
                                    <tr>
                                        <th className="td-status">指導</th>
                                        <th className="td-date">指導日</th>
                                        <th className="td-ward">病棟</th>
                                        <th className="td-room">病室</th>
                                        <th className="td-patientName">氏名</th>
                                        <th className="td-patientId">患者ID</th>
                                        <th className="td-sex">性別</th>
                                        <th className="td-department">診療科</th>
                                        <th className="td-date">同意日</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.is_loaded ? (
                                     <>
                                      {table_list.length >0 && table_list.map((item, index)=>{
                                        return (
                                          <tr key={index} onClick={this.selectOrder.bind(this, item)} className={this.state.selected_item != undefined && this.state.selected_item.number == item.number ? "selected" : ""}>
                                            <td className="td-status">{item.complete_flag == 0 ? "予定" : "済"}</td>
                                            <td className="td-date">{item.guidance_date != null && item.guidance_date != '' ? item.guidance_date.split("-").join("/"):""}</td>
                                            <td className="td-ward">{item.bed_name}</td>
                                            <td className="td-room">{item.room_name}</td>
                                            <td className="td-patientName" onDoubleClick={this.registerPharmacist.bind(this, item)}>{item.patient_name}</td>
                                            <td className="td-patientId">{item.patient_number}</td>
                                            <td className="td-sex">{item.gender == 1 ? "男": item.gender == 2 ? "女" : ""}</td>
                                            <td className="td-department">{this.getDepartmentName(item.department_id)}</td>
                                            <td className="td-date">{item.consent_date != null && item.consent_date != '' ? item.consent_date.split("-").join("/"):""}</td>
                                          </tr>
                                        )
                                      })}
                                     </> 
                                    ):(
                                      <SpinnerWrapper>
                                          <Spinner animation="border" variant="secondary" />
                                      </SpinnerWrapper>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </Wrapper>
                    </Modal.Body>
                    {this.state.openPharmacistChoice && (
                        <PharmacistChoice
                            closeModal={this.closeModal}
                            patient_name={this.state.patient_name}
                            order_data={this.state.selected_item}
                            doctor_list={this.props.doctor_list}
                        />
                    )}
                    {this.state.alert_messages !== "" && (
                      <AlertNoFocusModal
                        hideModal= {this.closeSystemAlertModal.bind(this)}
                        handleOk= {this.closeSystemAlertModal.bind(this)}
                        showMedicineContent= {this.state.alert_messages}
                      />
                    )}
                    {this.state.confirm_message !== "" && (
                      <SystemConfirmModal
                        hideConfirm= {this.closeModal.bind(this)}
                        confirmCancel= {this.closeModal.bind(this)}
                        confirmOk= {this.confirmOk.bind(this)}
                        confirmTitle= {this.state.confirm_message}
                      />
                    )}
                    {this.state.complete_message !== '' && (
                      <CompleteStatusModal
                        message = {this.state.complete_message}
                      />
                    )}
                </Modal>
            </>
        );
    }
}

GuidancePatientList.contextType = Context;
GuidancePatientList.propTypes = {
    closeModal: PropTypes.func,
    ward_master: PropTypes.array,
    doctor_list: PropTypes.array,
};

export default GuidancePatientList;
