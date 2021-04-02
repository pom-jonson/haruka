import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import * as apiClient from "~/api/apiClient";
import WorkSheetModal from "./WorkSheetModal";
import { getServerTime} from "~/helpers/constants";
import {
  formatDateString
} from "~/helpers/date";
import axios from "axios/index";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import * as localApi from "~/helpers/cacheLocal-utils";
// import { CACHE_LOCALNAMES, ALLERGY_STATUS_ARRAY } from "~/helpers/constants";
// import * as karteApi from "~/helpers/cacheKarte-utils";
// import Radiobox from "~/components/molecules/Radiobox";
// import AllergyListModal from "./AllergyListModal";
// import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;

  .div-date-label{
    margin-bottom: 1rem;
    margin-top: 1rem;
  }
  
  flex-direction: column;
  display: flex;
  text-align: center;
  .content{
    // height: 500px;
    height: 40rem;
    overflow-y: auto;
    text-align: left;
    textarea{
        height: 180px !important;
    }
  }
  .footer {
    margin: 0 auto;
    button {
      margin-top: 10px;
    }
    span {
      font-size: 18px;
      font-weight: normal;
    }
   }
   .radio-group{
    label {font-size: 16px;}
   }
   .content-area{
    border: 1px solid rgb(170, 170, 170);
    height: 43vh;
    overflow-y: auto;
    width: 90%;
    margin-left: 4rem;
   }
   .comment-area{
    border: 1px solid rgb(170, 170, 170);
    height: 8vh;
    overflow-y: auto;
    width: 90%;
    margin-left: 4rem;
    margin-top: 1rem;
   }
   .item-ele:hover{
    background: #ddd;
    cursor: pointer;
   }
   .item-ele{
    padding: 3px;
   }
   .sel-ele{
    background: #bbb;
   }
   .date-label{
    line-height: 30px;
    width: 4rem;
    text-align: right;
    padding-right: 1rem;
   }
   .react-datepicker-wrapper{
    float:left;
   }
 `;

class NurseCourseSeatModal extends Component {
  constructor(props) {
    super(props);
    let patientId = props.patientId;
    let selectedPatients = props.selectedPatients;
    let path = window.location.href.split("/");
    if(path[path.length - 1] == "nursing_document"){
      let nurse_patient_info = localApi.getObject("nurse_patient_info");
      if(nurse_patient_info !== undefined && nurse_patient_info != null){
        selectedPatients = nurse_patient_info.patientInfo;
        patientId = nurse_patient_info.detailedPatientInfo.patient[0]['number'];
      }
    }
    this.state = {
      patientId,
      selectedPatients,
      course_date:new Date(),
      confirm_message:"",
      complete_message: "",
      confirm_type:"",
      alert_messages:"",
      type: this.props.type ? this.props.type : "",
      selectedWorkSheet:null,
      isOpenWorksheetModal:false,
      work_sheet_master: []
    }
  }
  async componentDidMount() {
    await this.getWorkSheetMaster();
  }
  
  getWorkSheetMaster = async() => {
    let path = "/app/api/v2/ward/get_work_sheet_master";
    let post_data = {
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let work_sheet_master = this.state.work_sheet_master;
        if(res.work_sheet_master.length > 0){
          work_sheet_master = res.work_sheet_master;
        }
        this.setState({
          work_sheet_master,
        });
      })
      .catch(() => {
      
      });
  };
  
  cancelModal = () => {
    this.props.closeModal();
  }
  
  getDate = value => {
    this.setState({
      course_date: value,
    });
  }
  
  selectWorkSheet = (item) => {
    this.setState({
      selectedWorkSheet: item,
    });
  }
  
  showIndividualWorksheet = () => {
    
    if (this.state.selectedWorkSheet == null) return;
    
    this.setState({
      isOpenWorksheetModal: true,
    });
  }
  
  saveWorkSheetAndPrint = async () => {
    if (this.state.selectedWorkSheet == undefined && this.state.selectedWorkSheet == null) return;
    if (this.state.course_date == "") return;
    
    // print
    await this.printWorkSheet();
  }
  
  printWorkSheet = () => {
    // if(this.state.problem_list.length > 0){
    this.setState({
      confirm_message:"印刷しますか？",
      confirm_type: "print"
    });
    // }
  }
  
  closeConfirmModal = () =>{
    this.setState({
      confirm_message:"",
      confirm_type:"",
      alert_messages:"",
    });
  };
  
  get_title_pdf = async () => {
    let server_time = await getServerTime(); // y/m/d H:i:s
    server_time = formatDateString(new Date(server_time))
    let pdf_file_name = "個人看護ワークシート_" + server_time + ".pdf";
    return pdf_file_name;
  }
  
  confirmPrint = async () => {
    this.setState({
      confirm_message:"",
      complete_message:"印刷中"
    });
    let path = "/app/api/v2/master/nurse/worksheet/worksheet_print";
    let print_data = {};
    print_data.table_data = this.state.selectedWorkSheet.free_comment;
    print_data.patient_info = this.props.selectedPatients;
    print_data.print_date = this.state.course_date;
    print_data.type="multi_patient";
    
    let pdf_file_name = await this.get_title_pdf();
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
          window.navigator.msSaveOrOpenBlob(blob, pdf_file_name);
        }
        else{
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', pdf_file_name); //or any other extension
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
    return  (
      <Modal show={true} id="done-order-modal"  className="custom-modal-sm allergy-modal first-view-modal nurse-course-modal">
        <Modal.Header>
          <Modal.Title>ワークシートメニュー</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox>
            <Wrapper>
              <div className="content w-100">
                <div className="flex div-date-label">
                  <div className="date-label">日付</div>
                  <DatePicker
                    locale="ja"
                    selected={this.state.course_date}
                    onChange={this.getDate.bind(this)}
                    dateFormat="yyyy/MM/dd"
                    placeholderText={"年/月/日"}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"                  
                    dayClassName = {date => setDateColorClassName(date)}
                  />
                </div>
                <div className="content-area">
                  {this.state.work_sheet_master.length > 0 && this.state.work_sheet_master.map(item=>{
                    return(
                      <>
                        <div onClick={()=>this.selectWorkSheet(item)} className={`item-ele ${this.state.selectedWorkSheet != null && this.state.selectedWorkSheet.number == item.number ? "sel-ele":""}`}>{item.name}</div>
                      </>
                    );
                  })}
                </div>
                <div className="comment-area">{this.state.selectedWorkSheet != null && this.state.selectedWorkSheet != undefined && this.state.selectedWorkSheet.free_comment}</div>
              </div>
              {this.state.isOpenWorksheetModal && (
                <WorkSheetModal
                  worksheetInfo={this.state.selectedWorkSheet}
                  selectedPatients={this.state.selectedPatients}
                  closeModal = {this.props.closeModal}
                  course_date = {this.state.course_date}
                  type={this.props.type}
                  patientId={this.state.patientId}
                />
              )}
              {this.state.confirm_message !== "" && this.state.confirm_type == "print" && (
                <SystemConfirmJapanModal
                  hideConfirm= {this.closeConfirmModal.bind(this)}
                  confirmCancel= {this.closeConfirmModal.bind(this)}
                  confirmOk= {this.confirmPrint.bind(this)}
                  confirmTitle= {this.state.confirm_message}
                />
              )}
              {this.state.alert_messages !== "" && (
                <SystemAlertModal
                  hideModal= {this.closeConfirmModal.bind(this)}
                  handleOk= {this.closeConfirmModal.bind(this)}
                  showMedicineContent= {this.state.alert_messages}
                />
              )}
              {this.state.complete_message !== '' && (
                <CompleteStatusModal
                  message = {this.state.complete_message}
                />
              )}
            </Wrapper>
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.cancelModal}>キャンセル</Button>
          {this.props.type != "individual" && (
            <>
              <Button onClick={this.saveWorkSheetAndPrint} className={this.state.selectedWorkSheet != undefined && this.state.selectedWorkSheet != null?'red-btn':"disable-btn"} >印刷</Button>
            </>
          )}
          <Button onClick={this.showIndividualWorksheet} className={this.state.selectedWorkSheet != undefined && this.state.selectedWorkSheet != null?'red-btn':"disable-btn"}>表示</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

NurseCourseSeatModal.contextType = Context;

NurseCourseSeatModal.propTypes = {
  closeModal: PropTypes.func,
  selectedPatients: PropTypes.array,
  type: PropTypes.string,
  patientId: PropTypes.number,
};

export default NurseCourseSeatModal;