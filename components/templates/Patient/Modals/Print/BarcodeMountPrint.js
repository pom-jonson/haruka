import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import {getServerTime} from "~/helpers/constants";
import {formatDateLine} from "~/helpers/date";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import Context from "~/helpers/configureStore";
import InputWithLabel from "~/components/molecules/InputWithLabel";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`  
 width: 100%;
 min-height: 18rem;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
 .div-title {
   height:2rem;
   line-height:2rem;
 }
 .div-value {
   height:2rem;
   line-height:2rem;
   border:1px solid #aaa;
   padding:0 0.3rem;
 }
  .label-title {
    width:8rem;
    line-height:2rem;
    margin:0;
    font-size:1rem;
  }
 .select-category {
    margin-top:0.5rem;
    .pullbox-label {
      margin:0;
      .pullbox-select {
        width:36rem;
        height:2rem;
        line-height:2rem;
        font-size:1rem;
      }
    }
 }
 .free-comment {
    margin-top:0.5rem;
    div{margin-top:0;}
    input {
      width:calc(100% - 8rem);
      height:2rem;
      line-height:2rem;
      font-size:1rem;
    }
 }
`;

class BarcodeMountPrint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert_messages:"",
      free_comment:"",
      complete_message:"",
      confirm_message:"",
      document_slip_master:[],
      document_slip_id:0,
      document_type_master:[],
      template_id:0,
      department_id:1,
      load_flag:false,
      karte_status:1,
    };
    this.karte_status = [
      {id:1, value:"外来"},
      {id:2, value:"訪問診療"},
      {id:3, value:"入院"},
    ];
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.department_codes = [];
    departmentOptions.map(department=>{
      this.department_codes.push(department);
    });
    this.document_type_master = [];
  }

  async componentDidMount() {
    let path = "/app/api/v2/document/get/barcode_mount/master";
    let post_data = {
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        let document_slip_master = [{id:0, value:""}];
        if(res.document_slip_master.length > 0){
          res.document_slip_master.map(item=>{
            document_slip_master.push({id:item.number, value:item.name});
          });
        }
        this.document_type_master = res.document_type_master;
        this.setState({
          document_slip_master,
          karte_status:this.context.karte_status.code == 0 ? 1 : this.context.karte_status.code == 1 ? 3 : 2,
          department_id:this.context.department.code == 0 ? 1 : this.context.department.code,
          load_flag:true,
        });
      })
      .catch(() => {
      });
  }
  
  setFreeComment = e => {
    this.setState({free_comment: e.target.value.length > 25 ? this.state.free_comment : e.target.value});
  };

  confirmPrint=()=>{
    this.setState({confirm_message:"印刷しますか？"});
  }

  confirmOk=()=>{
    this.printPdf();
  }

  closeModal=()=>{
    this.setState({
      alert_messages:"",
      confirm_message:"",
    });
  }
  
  getFileName=async()=>{
    let file_name = "バーコード台紙_";
    let server_time = await getServerTime();
    file_name = file_name + formatDateLine(new Date(server_time)).split('-').join('')+ "_" + this.props.patientInfo.receId;
    return file_name+".pdf";
  }

  printPdf=async()=>{
    this.setState({
      confirm_message:"",
      complete_message:"印刷中"
    });
    let file_name = await this.getFileName();
    let path = "/app/api/v2/document/print/barcode_mount";
    let print_data = {};
    print_data.patient_id = this.props.patientId;
    print_data.department_id = this.state.department_id;
    print_data.department_name = (this.department_codes.find((x) => x.id == this.state.department_id) !== undefined) ?
      this.department_codes.find((x) => x.id == this.state.department_id).value : "";
    print_data.document_slip_id = this.state.document_slip_id;
    print_data.document_slip_name = (this.state.document_slip_master.find((x) => x.id == this.state.document_slip_id) !== undefined) ?
    this.state.document_slip_master.find((x) => x.id == this.state.document_slip_id).value : "";
    print_data.template_id = this.state.template_id;
    print_data.template_name = (this.state.document_type_master.find((x) => x.id == this.state.template_id) !== undefined) ?
      this.state.document_type_master.find((x) => x.id == this.state.template_id).value : "";
    print_data.patient_number = this.props.patientInfo.receId;
    print_data.patient_name = this.props.patientInfo.name;
    print_data.sex = this.props.patientInfo.sex;
    print_data.age = this.props.patientInfo.age;
    print_data.free_comment = this.state.free_comment;
    print_data.karte_status = this.state.karte_status;
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
        window.navigator.msSaveOrOpenBlob(blob, file_name);
      }
      else{
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file_name); //or any other extension
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
  
  selectSlip=(e) => {
    let document_type_master = [{id:0, value:""}];
    let document_slip_id = parseInt(e.target.id);
    if(this.document_type_master.length > 0){
      this.document_type_master.map(item=>{
        if(item.document_slip_id === document_slip_id && (item.department_id == null || item.department_id === this.state.department_id)){
          document_type_master.push({id:item.template_id, value:item.name});
        }
      })
    }
    this.setState({
      document_slip_id,
      document_type_master,
      template_id:0,
    });
  };
  
  setKarteStatus=(e) => {
    this.setState({karte_status:parseInt(e.target.id)});
  };
  
  selectDocumentType=(e) => {
    this.setState({template_id:parseInt(e.target.id)});
  };
  
  getDepartment = (e) => {
    let document_type_master = [{id:0, value:""}];
    let department_id = parseInt(e.target.id);
    if(this.document_type_master.length > 0){
      this.document_type_master.map(item=>{
        if(item.document_slip_id === this.state.document_slip_id && (item.department_id == null || item.department_id === department_id)){
          document_type_master.push({id:item.template_id, value:item.name});
        }
      })
    }
    this.setState({
      department_id,
      document_type_master,
      template_id:0,
    });
  };

  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm barcode-mount-print first-view-modal"
        >
          <Modal.Header><Modal.Title>バーコード台紙印刷</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              {this.state.load_flag ? (
                <>
                  <div className={'flex'}>
                    <div className={'div-title'} style={{width:"8rem"}}>患者ID</div>
                    <div className={'div-value'} style={{minWidth:"7rem"}}>{this.props.patientInfo.receId}</div>
                    <div className={'div-title'} style={{width:"5rem", marginRight:"0.5rem", textAlign:"right"}}>患者氏名</div>
                    <div className={'div-value'} style={{width:"calc(100% - 34.5rem)"}}>{this.props.patientInfo.name}</div>
                    <div className={'div-title'} style={{width:"3rem", marginRight:"0.5rem", textAlign:"right", paddingTop:"0.05rem"}}>性別</div>
                    <div className={'div-value'} style={{minWidth:"3rem"}}>{this.props.patientInfo.sex == 1 ? "男性" : "女性"}</div>
                    <div className={'div-title'} style={{width:"3rem", marginRight:"0.5rem", textAlign:"right", paddingTop:"0.2rem"}}>年齢</div>
                    <div className={'div-value'} style={{minWidth:"4rem"}}>{this.props.patientInfo.age}歳</div>
                  </div>
                  <div className={'select-category'}>
                    <SelectorWithLabel
                      options={this.karte_status}
                      title={'入外区分'}
                      getSelect={this.setKarteStatus}
                      departmentEditCode={this.state.karte_status}
                    />
                  </div>
                  <div className={'select-category'}>
                    <SelectorWithLabel
                      options={this.department_codes}
                      title={'診療科'}
                      getSelect={this.getDepartment}
                      departmentEditCode={this.state.department_id}
                    />
                  </div>
                  <div className={'select-category'}>
                    <SelectorWithLabel
                      options={this.state.document_slip_master}
                      title={'文書種類'}
                      getSelect={this.selectSlip.bind(this)}
                      departmentEditCode={this.state.document_slip_id}
                    />
                  </div>
                  <div className={'select-category'}>
                    <SelectorWithLabel
                      options={this.state.document_type_master}
                      title={'書類名'}
                      getSelect={this.selectDocumentType.bind(this)}
                      departmentEditCode={this.state.template_id}
                      isDisabled={this.state.document_slip_id === 0}
                    />
                  </div>
                  <div className={'free-comment'}>
                    <InputWithLabel
                      label="フリーコメント"
                      type="text"
                      getInputText={this.setFreeComment.bind(this)}
                      diseaseEditData={this.state.free_comment}
                    />
                    <div style={{marginLeft:"8rem", lineHeight:"2rem"}}>（25文字まで）</div>
                  </div>
                </>
              ):(
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={"red-btn"} onClick={this.confirmPrint}>{"印刷"}</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
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

BarcodeMountPrint.contextType = Context;
BarcodeMountPrint.propTypes = {
  closeModal: PropTypes.func,
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
};

export default BarcodeMountPrint;
