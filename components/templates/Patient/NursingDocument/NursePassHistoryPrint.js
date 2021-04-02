import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import {formatDateLine} from "~/helpers/date";
import axios from "axios/index";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";

const Wrapper = styled.div`  
 width: 100%;
 height: 100%;
 font-size: 1rem;
 overflow-y:auto;
 .flex{
  display: flex;
 }
.select-period {
  .period-title {
    line-height: 2rem;
    margin: 0;
    width: 3rem;
    font-size:1rem;
  }
  div {margin-top: 0;}
  .react-datepicker-popper {
    margin-top:10px;
  }
  input {
    width:7rem;
    height:2rem;
    font-size:1rem;
  }
  .from-to{
    padding-left:5px;
    padding-right:5px;
    line-height: 2rem;
    font-size:1rem;
  }
  .label-title {
    width: 0;
    margin: 0;
  }
}
`;

class NursePassHistoryPrint extends Component {
  constructor(props) {
    super(props);
    let last_week = new Date();
    last_week.setDate(last_week.getDate() - 7);
    this.state = {
      start_date: last_week,
      end_date: new Date(),
      complete_message:"",
    };
  }
  
  setPeriod=(key,value)=>{
    if(value == null){
      value = new Date();
    }
    this.setState({[key]:value});
  };
  
  get_title_pdf = async () => {
    let pdf_file_name = "看護記録_"+this.props.patientInfo.receId+"_";
    pdf_file_name = pdf_file_name + formatDateLine(this.state.start_date).split("-").join("") + "-" + formatDateLine(this.state.end_date).split("-").join("");
    return pdf_file_name+".pdf";
  }
  
  print=async()=>{
    this.setState({complete_message:"印刷中"});
    let path = "/app/api/v2/nurse/record/history/print";
    let pdf_file_name = await this.get_title_pdf();
    let print_data = {};
    print_data.start_date = formatDateLine(this.state.start_date);
    print_data.end_date = formatDateLine(this.state.end_date);
    print_data.hos_number = this.props.hos_number;
    print_data.patient_number = this.props.patientInfo.receId;
    print_data.patient_name = this.props.patientInfo.name;
    print_data.passing_records = this.props.passing_records;
    print_data.passing_of_time_type_label = this.props.passing_of_time_type_label;
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
        this.setState({complete_message:""});
      })
  }

  render() {
    return (
      <>
        <Modal
          show={true}
          className="custom-modal-sm nurse-pass-history-print first-view-modal"
        >
          <Modal.Header><Modal.Title>看護記録印刷</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'select-period flex'}>
                <div className={'period-title'}>期間</div>
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
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <div onClick={this.props.closeModal} className={"custom-modal-btn cancel-btn"} style={{cursor:"pointer"}}>
              <span>キャンセル</span>
            </div>
            <div onClick={this.print} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}>
              <span>印刷</span>
            </div>
          </Modal.Footer>
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

NursePassHistoryPrint.propTypes = {
  closeModal: PropTypes.func,
  hos_number: PropTypes.number,
  patientInfo: PropTypes.object,
  passing_records: PropTypes.object,
  passing_of_time_type_label: PropTypes.object,
};

export default NursePassHistoryPrint;
