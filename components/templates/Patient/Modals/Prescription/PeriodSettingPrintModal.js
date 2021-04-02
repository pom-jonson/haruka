import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
// import * as apiClient from "~/api/apiClient";
// import Checkbox from "~/components/molecules/Checkbox";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
// import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import axios from "axios/index";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import {formatDateLine} from "~/helpers/date";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  height: 100%;
  float: left;
  input {
    width: 200px;
    font-size: 1rem;
    height: 2rem;
  }
  
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 1rem;
    width: 120px;
    text-align: right;
    margin-right: 8px;
    margin-top: 0px;
    margin-bottom: 0px;
    line-height: 2rem;
   }
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {
    padding-left: 120px;
    label{
        font-size: 16px;
        width: 100px;
    }
  }
  .short-input-group{
    display:flex;
    input{
        width:130px;
    }
  }
  .medicine_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    margin-left: -20px;
    input {
      font-size: 18px;
      width: 155px;
    }
    label {
      width: 120px;
      font-size: 15px;
    }
    .husei-code label {
      width: 100px;
      margin-left: 10px;
    }
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;
      height: 38px;
      margin-top: 8px;
      margin-left: 10px;
    }
    span {
      color: white;
    }
  }
  .kana_area {
    padding-top: 10px;
  }
  .name_area {
    padding-top: 20px;
  }
  .gender {
    font-size: 18px;
    margin-top: 10px;
    margin-left: 15px;
    margin-bottom: 10px;
    .gender-label {
      width: 100px;
      margin-top: 8px;
      float: left;
    }
    .radio-group-btn label{
        font-size: 14px;
        width: 45px;
        padding: 4px 4px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin-left: 5px;
    }
    .radio-group-btn:last-child {
        label {
            width: 85px;
        }
    }
  }
  .pullbox {
    margin-top: 8px;
  }

 `;

class PeriodSettingPrintModal extends Component {
    constructor(props) {
        super(props);        
        
        let init_start_date = this.getInitStartDate(this.props.printPostParam['init_period_date']);
        let init_end_date = this.getInitEndDate(this.props.printPostParam['init_period_date']);
        this.state = {
            start_date: init_start_date != null && init_start_date != "" ? new Date(init_start_date) : new Date(),
            end_date: init_end_date != null && init_end_date != "" ? new Date(init_end_date) : new Date(),            
            confirm_message: "",
            complete_message:"",
            alert_messages:""
        }
    }

    getInitStartDate = (_searchDate) => {
      let result = "";
      if (_searchDate == null || _searchDate == undefined || _searchDate == "") return result;
      let line_split = _searchDate.split("-");
      if (line_split.length > 2) { // day
        result = _searchDate;
      } else if(line_split.length == 2) { // month
        result = _searchDate + "-01";
      } else { // year
        result = _searchDate + "-01-01";
      }
      return result;
    }

    getInitEndDate = (_searchDate) => {
      let result = "";
      if (_searchDate == null || _searchDate == undefined || _searchDate == "") return result;
      let line_split = _searchDate.split("-");
      if (line_split.length > 2) { // day
        result = _searchDate;
      } else if(line_split.length == 2) { // month
        let _month = parseInt(line_split[1]) - 1;        
        let _date = new Date(line_split[0], _month + 1, 0);
        result = formatDateLine(_date);
      } else { // year
        result = _searchDate + "-12-31";
      }
      return result;
    }

    getStartDate = (value) => {
        this.setState({ start_date: value });
    };

    getEndDate = (value) => {
        this.setState({ end_date: value });
    };

    printPdf = () => {
      if (this.state.start_date == null || this.state.start_date == "" || this.state.end_date == null || this.state.end_date == "") {
        this.setState({ alert_messages: "対象期間を正確に入力してください。" });
        return;
      }
      if (this.state.end_date < this.state.start_date) {
        this.setState({ alert_messages: "対象期間を正確に入力してください。" });
        return;
      }
        if(this.props.medicineHistoryData.length > 0){
          this.setState({confirm_message:"印刷しますか？"});
        }
    }

    confirmCancel = () => {
        this.setState({
          confirm_message: "",
          alert_messages:""
        });
      }

    confirmOk=async()=>{ //
        this.setState({
          confirm_message:"",
          complete_message:"印刷中"
        });
        let path = "/app/api/v2/order/prescription/print/medicine_history_print";
        let print_data = this.props.printPostParam;
        print_data.table_data = this.props.medicineHistoryData;   
        print_data.start_date = formatDateLine(this.state.start_date);   
        print_data.end_date = formatDateLine(this.state.end_date);   
        print_data.patient_info = this.props.patientInfo;
        print_data.course_date = formatDateLine(new Date());
        print_data.modal_type = this.props.modal_type;
        axios({
          url: path,
          method: 'POST',
          data:{print_data},
          responseType: 'blob', // important
        }).then((response) => {
            this.setState({complete_message:""});
            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            let title = this.get_title_pdf();
            if(window.navigator.msSaveOrOpenBlob) {
              //IE11 & Edge
              window.navigator.msSaveOrOpenBlob(blob, title);
            }
            else{
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', title); //or any other extension
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

    get_title_pdf=()=>{
        var title = '処方歴_';
        if (this.props.modal_type == "injection") {
          title = "注射履歴_";
        }
        title += this.props.patientInfo.receId;
        title += "_" + formatDateLine(this.state.start_date).split('-').join('');
        title += "_" + formatDateLine(this.state.end_date).split('-').join('');
        return title + ".pdf";
      }

    render() {        
        return  (
            <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>{this.props.modal_type == "prescription" ? "処方歴" : this.props.modal_type == "injection" ? "注射履歴" : ""}印刷期間指定</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <InputWithLabelBorder
                          label="開始日"
                          type="date"
                          getInputText={this.getStartDate.bind(this)}                          
                          diseaseEditData={this.state.start_date}
                        />
                        <InputWithLabelBorder
                          label="終了日"
                          type="date"
                          getInputText={this.getEndDate.bind(this)}                          
                          diseaseEditData={this.state.end_date}
                        />
                    </Wrapper>                    
                    {this.state.confirm_message !== "" && (
                      <SystemConfirmModal
                        hideConfirm= {this.confirmCancel.bind(this)}
                        confirmCancel= {this.confirmCancel.bind(this)}
                        confirmOk= {this.confirmOk.bind(this)}
                        confirmTitle= {this.state.confirm_message}
                      />
                    )}
                    {this.state.complete_message !== '' && (
                      <CompleteStatusModal
                        message = {this.state.complete_message}
                      />
                    )}
                    {this.state.alert_messages !== "" && (
                      <SystemAlertModal
                        hideModal= {this.confirmCancel.bind(this)}
                        handleOk= {this.confirmCancel.bind(this)}
                        showMedicineContent= {this.state.alert_messages}
                      />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel-btn" onClick={this.props.confirmCancel}>キャンセル</Button>
                    <Button className="red-btn" onClick={this.printPdf}>印刷</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

PeriodSettingPrintModal.contextType = Context;

PeriodSettingPrintModal.propTypes = {
    confirmCancel : PropTypes.func,
    medicineHistoryData: PropTypes.array,
    printPostParam: PropTypes.object,
    modal_type: PropTypes.string,
    // confirmOk : PropTypes.func,
    patientInfo: PropTypes.object,
};

export default PeriodSettingPrintModal;
