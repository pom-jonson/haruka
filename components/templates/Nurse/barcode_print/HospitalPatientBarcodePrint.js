import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import {formatDateSlash} from "~/helpers/date";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Radiobox from "~/components/molecules/Radiobox";
import Checkbox from "~/components/molecules/Checkbox";
import PreviewPatientBarcode from "~/components/templates/Nurse/barcode_print/PreviewPatientBarcode";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";

const Wrapper = styled.div`
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{display: flex;}
 .select-ward {
   margin:0 0.5rem;
   .label-title {
     width:3rem;
     margin:0;
     line-height: 2rem;
     font-size: 1rem;
   }
   .pullbox-label {
      margin:0;
      select {
        height: 2rem;
        font-size: 1rem;
        width: 7rem;
      }
   }
 }
 .radio-area {
    label {
      font-size: 1rem;
      line-height: 2rem;
    }
 }
 .input-area {
   .label-title {
    margin: 0;
    line-height: 2rem;
    font-size: 1rem;
    width:4rem;
   }
   input {
    height: 2rem;
    font-size: 1rem;
    width:10rem;
   }
   div {margin-top:0;}
 }
 .table-area {
   margin-top:0.5rem;
   width: 100%;
   .table-title {
    width: 2rem;
    text-align: center;
    padding-top: 4.5rem;
   }
   table {
     width:100%;
     margin:0;
     tbody{
       display:block;
       overflow-y: scroll;
       height: calc(80vh - 20.5rem);
       width:100%;
       tr{cursor:pointer;}
       tr:nth-child(even) {background-color: #f2f2f2;}
       tr:hover{background-color:#e2e2e2;}
     }
     tr{
       display: table;
       width: 100%;
     }
     thead{
       display:table;
       width:100%;
       border-bottom: 1px solid #dee2e6;
       tr{width: calc(100% - 17px);}
     }
     th {
       position: sticky;
       text-align: center;
       padding: 0.3rem;
       white-space:nowrap;
       border:none;
       border-right:1px solid #dee2e6;
       vertical-align: middle;
     }
     td {
       padding: 0.25rem;
       word-break: break-all;
     }
   }
 }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class HospitalPatientBarcodePrint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patient_id:'',
      first_ward_id:0,
      hospital_type:0,
      view_mode:0,
      print_mode:0,
      hos_numbers:[],
      isOpenPreviewPatientBarcode:false,
      complete_message:"",
      alert_messages:"",
      load_flag:true,
      patient_lsit:[],
    };
    let cache_ward_master = JSON.parse(window.sessionStorage.getItem("init_status")).ward_master;
    this.ward_master = [{id:0, value:"全病棟"}];
    this.ward_names = [];
    if (cache_ward_master != undefined && cache_ward_master != null && cache_ward_master.length > 0){
      cache_ward_master.map(ward=>{
        this.ward_master.push({id:ward.number, value: ward.name});
        this.ward_names[ward.number] = ward.name;
      });
    }
  }
  
  async componentDidMount() {
    await this.searchPatientList();
  }
  
  setWard=(e)=>{
    this.setState({first_ward_id:parseInt(e.target.id)});
  }
  
  setPatientId=(e)=>{
    this.setState({patient_id: e.target.value});
  }
  
  searchPatientList=async()=>{
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/ward/search/hospital_patient_bracode";
    let post_data = {
      first_ward_id:this.state.first_ward_id,
      patient_id:this.state.patient_id,
      hospital_type:this.state.hospital_type,
      view_mode:this.state.view_mode,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          load_flag:true,
          patient_lsit:res,
          hos_numbers:[],
        });
      })
      .catch(() => {
      
      });
  };
  
  closeModal=()=>{
    this.setState({
      isOpenPreviewPatientBarcode:false,
      alert_messages:""
    });
  }
  
  setHospitalType = (e) => {
    this.setState({hospital_type:parseInt(e.target.value)});
  }
  
  setCheckFlag = (name, value) => {
    this.setState({[name]: value});
  };
  
  confirmPrint=()=>{
    if(this.state.hos_numbers.length == 0 || this.state.load_flag == false){
      return;
    }
    if(this.state.print_mode == 1){
      this.setState({
        isOpenPreviewPatientBarcode: true,
        preview_number:this.state.hos_numbers[0],
      });
    } else {
      this.print();
    }
  }
  
  print=async()=>{
    this.setState({
      isOpenPreviewPatientBarcode:false,
      complete_message:"印刷中"
    });
    let path = "/app/api/v2/ward/print/hospital_patient_bracode";
    let post_data = {
      hos_numbers:this.state.hos_numbers,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          load_flag:false,
          complete_message:"",
          alert_messages:res.alert_message !== undefined ? res.alert_message : res.error_message,
        }, ()=>{
          this.searchPatientList();
        });
      })
      .catch(() => {
      
      });
  }
  
  selectAll=(value)=>{
    let hos_numbers = [];
    if(value && this.state.patient_lsit.length > 0){
      this.state.patient_lsit.map(item=>{
        hos_numbers.push(item.hos_number);
      });
    }
    this.setState({hos_numbers});
  }
  
  selectPatient=(number)=>{
    let hos_numbers = this.state.hos_numbers;
    let index = hos_numbers.indexOf(number);
    if(index === -1){
      hos_numbers.push(number);
    } else {
      hos_numbers.splice(index, 1);
    }
    this.setState({hos_numbers});
  };
  
  render() {
    let index = 0;
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm hospital-patient-barcode-print first-view-modal"
        >
          <Modal.Header><Modal.Title>入院患者バーコード印刷</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'flex'}>
                <div className={'input-area'}>
                  <InputWithLabel
                    type="text"
                    label={"患者ID"}
                    getInputText={this.setPatientId.bind(this)}
                    diseaseEditData={this.state.patient_id}
                  />
                </div>
                <div className={'select-ward'}>
                  <SelectorWithLabel
                    title="病棟"
                    options={this.ward_master}
                    getSelect={this.setWard}
                    departmentEditCode={this.state.first_ward_id}
                  />
                </div>
                <div className={'radio-area'}>
                  <Radiobox
                    label={'入院予定'}
                    value={0}
                    getUsage={this.setHospitalType.bind(this)}
                    checked={this.state.hospital_type === 0}
                    name={`hospital_type`}
                  />
                  <Radiobox
                    label={'入院決定'}
                    value={1}
                    getUsage={this.setHospitalType.bind(this)}
                    checked={this.state.hospital_type === 1}
                    name={`hospital_type`}
                  />
                  <Radiobox
                    label={'入院確認'}
                    value={2}
                    getUsage={this.setHospitalType.bind(this)}
                    checked={this.state.hospital_type === 2}
                    name={`hospital_type`}
                  />
                </div>
              </div>
              <div className={'flex'} style={{marginTop:"0.5rem"}}>
                <Button
                  type="common"
                  onClick={this.selectAll.bind(this, 1)}
                  isDisabled={this.state.patient_lsit.length === 0 || !this.state.load_flag}
                  className={(this.state.patient_lsit.length === 0 || !this.state.load_flag) ? 'disable-btn' : ''}
                >全選択</Button>
                <div style={{marginLeft:"0.5rem"}}>
                  <Button
                    type="common"
                    onClick={this.selectAll.bind(this, 0)}
                    isDisabled={this.state.patient_lsit.length === 0 || !this.state.load_flag}
                    className={(this.state.patient_lsit.length === 0 || !this.state.load_flag) ? 'disable-btn' : ''}
                  >全解除</Button>
                </div>
                <div className={'check-area'}>
                  <Checkbox
                    label="発行済の表示"
                    getRadio={this.setCheckFlag.bind(this)}
                    value={this.state.view_mode === 1}
                    name="view_mode"
                  />
                </div>
                <div style={{marginLeft:"auto", marginRight:0}}>
                  <Button type="common" onClick={this.searchPatientList}>最新表示</Button>
                </div>
              </div>
              <div className={'table-area flex'}>
                <table className="table-scroll table table-bordered table-hover">
                  <thead>
                  <tr>
                    <th style={{width:"3rem"}}> </th>
                    <th style={{width:"3rem"}}>発行</th>
                    <th style={{width:"5rem"}}>病棟</th>
                    <th style={{width:"6rem"}}>入院日</th>
                    <th style={{width:"10rem"}}>患者ID</th>
                    <th>患者氏名</th>
                    <th style={{width:"20rem"}}>カナ氏名</th>
                    <th style={{width:"7rem"}}>生年月日</th>
                    <th style={{width:"7rem"}}>年齢</th>
                    <th style={{width:"3rem"}}>性別</th>
                    <th style={{width:"7rem"}}>血液型</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.state.load_flag ? (
                    <>
                      {this.state.patient_lsit.length > 0 && (
                        this.state.patient_lsit.map((item)=>{
                          if(this.state.view_mode == 0 || (this.state.view_mode == 1 && item.hospitalization_plan_print_flag == 1)){
                            index++;
                            return (
                              <>
                                <tr
                                  onClick={this.selectPatient.bind(this, item.hos_number)}
                                  style={{backgroundColor:this.state.hos_numbers.includes(item.hos_number) ? "#FFA500" : ""}}
                                >
                                  <td style={{width:"3rem", textAlign:"right"}}>{index}</td>
                                  <td style={{width:"3rem"}}>{item.hospitalization_plan_print_flag == 1 ? "済" : "未"}</td>
                                  <td style={{width:"5rem"}}>{this.ward_names[item.first_ward_id]}</td>
                                  <td style={{width:"6rem"}}>
                                    {item.date_and_time_of_hospitalization != null ? formatDateSlash(new Date(item.date_and_time_of_hospitalization.split('-').join('/')))
                                      : (item.desired_hospitalization_date != null ? formatDateSlash(new Date(item.desired_hospitalization_date.split('-').join('/'))) : "")}
                                  </td>
                                  <td style={{width:"10rem", textAlign:"right"}}>{item.patient_number}</td>
                                  <td>{item.patient_name}</td>
                                  <td style={{width:"20rem"}}>{item.patient_name_kana}</td>
                                  <td style={{width:"7rem"}}>{formatDateSlash(new Date(item.birthday.split('-').join('/')))}</td>
                                  <td style={{width:"7rem"}}>{(item.age)+'歳 '+(item.age_month)+'ヶ月'}</td>
                                  <td style={{width:"3rem"}}>{item.gender === 1 ? '男':'女'}性</td>
                                  <td style={{width:"7rem"}}>{item.blood_str}</td>
                                </tr>
                              </>
                            )
                          }
                        })
                      )}
                    </>
                  ):(
                    <tr>
                      <td colSpan={'11'}>
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      </td>
                    </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <div className={'check-area'}>
              <Checkbox
                label="プレビュー印刷する"
                getRadio={this.setCheckFlag.bind(this)}
                value={this.state.print_mode === 1}
                name="print_mode"
              />
            </div>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={this.state.hos_numbers.length > 0 ? "red-btn" : "disable-btn"} onClick={this.confirmPrint}>印刷</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.isOpenPreviewPatientBarcode && (
            <PreviewPatientBarcode
              closeModal={this.closeModal}
              preview_number={this.state.preview_number}
              print={this.print}
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

HospitalPatientBarcodePrint.propTypes = {
  closeModal: PropTypes.func,
};

export default HospitalPatientBarcodePrint;
