import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import Button from "~/components/atoms/Button";
import axios from "axios/index";
import {formatDateLine} from "~/helpers/date";
import PDF from "react-pdf-js";
import Spinner from "react-bootstrap/Spinner";


const Wrapper = styled.div`
    width: 100%;
    overflow-y:hidden;
    .content {
        height: calc(100vh - 220px);
        overflow-y:auto;
        position:relative;
    }
    .add-button {
      text-align: center;
      padding-top: 50px;
      button {
        background: rgb(105, 200, 225);
        margin-right: 10px;
        border: none;
        span {
            font-size: 20px;
            color: white !important;
        }
      }
    }
    .flex {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .PDFPage {
        box-shadow: 0 0 8px rgba(0, 0, 0, .5);
    }

    .PDFPageOne {
        margin-bottom: 25px;
    }

    .PDFPage > canvas {
        max-width: 100%;
        height: auto !important;
    }

    .period-label{
        margin-top: 4px;
        margin-right: 15px;
    }
    
    .loaded-area {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        height: 100%;
        background-color: white;
    }
    .loaded-area-file {
        position: absolute;
        width: 900px;
        height: 841px;
        background-color: white;
    }
  .canvas-div {
    display: flex;
    flex-direction: column;
    -webkit-box-align: center;
    align-items: center;
    canvas {
      box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 8px;
      width: 900px;
      height: auto;
    }
  }
`;
const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class PrintModal extends Component {
  constructor(props) {
    super(props);
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    this.graph_table_show = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").graph_table_show;
    if (patientInfo == null) patientInfo = this.props.patientInfo;
    if (schedule_date == null) schedule_date = this.props.schedule_date;

    var graph_monitor_data =sessApi.getObject("from_graph_monitor");
    this.display_measure_data = [];
    this.graph_base64 = '';
    if (graph_monitor_data != undefined && graph_monitor_data != null){
      this.x_range = graph_monitor_data.x_range;
      this.display_measure_data = graph_monitor_data.display_measure_data;
      this.graph_base64 = graph_monitor_data.graph_base64;
    } else{
      this.x_range = 5;
    }

    this.state = {
      numPages: null,
      pageNumber: 1,
      file:null,
      file2:null,
      
      system_patient_id:patientInfo.system_patient_id,
      patientInfo,
      schedule_date,
      start_date:schedule_date,
      end_date:schedule_date,
    }
  }
  
  async componentDidMount() {
    // download pdf
    var url;
    switch(this.props.sheet_style){
      case 'A':
        url = '/app/api/v2/dial/generatepdf/dial_record_a';
        break;
      case 'B':
        url = '/app/api/v2/dial/generatepdf/dial_record_b';
        break;
      case 'C':
        url = '/app/api/v2/dial/generatepdf/dial_record_c';
        break;
    }
    axios({
      url: url,
      method: 'POST',
      data:{
        patient_id:this.state.system_patient_id,
        start_date:this.state.start_date,
        end_date:this.state.end_date,
        graph:this.props.graph_base64 != undefined ? this.props.graph_base64 : this.graph_base64,
        display_measure_data:this.props.display_measure_data != undefined? this.props.display_measure_data:this.display_measure_data,
        graph_table_show:this.graph_table_show,
        x_range:this.props.x_range != undefined ? this.props.x_range: this.x_range,
      },
      responseType: 'blob', // important
    }).then((response) => {
      this.setState({
        file: response.data,
      });
    });
  }
  
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages },()=>{
      setTimeout(()=>{
        this.changeLoaded();
      }, 1000);
    });
  }
  
  changeLoaded =()=>{
    let loaded_area = document.getElementsByClassName("loaded-area-file")[0];
    if(loaded_area !== undefined && loaded_area != null){
      loaded_area.style['display'] = "none";
    }
    let content = document.getElementsByClassName("content")[0];
    if(content !== undefined && content != null){
      content.style['overflow-y'] = "auto";
    }
  }
  
  goToPrevPage = () =>{
    if((this.state.pageNumber - 1) !== 0){
      this.setState(state => ({ pageNumber: state.pageNumber - 1 }));
    }
  }
  
  goToNextPage = () =>{
    if((this.state.pageNumber + 1) <= this.state.numPages){
      this.setState(state => ({ pageNumber: state.pageNumber + 1 }));
    }
  }
  
  get_title_pdf = () => {
    
    let pdf_file_name = "血液透析記録" + "_" + this.state.patientInfo.patient_number + '_' + formatDateLine(this.state.start_date).split("-").join("") + ".pdf";
    return pdf_file_name;
  }
  
  downloadPdf =()=>{
    if(this.state.file != null){
      const blob = new Blob([this.state.file], { type: 'application/octet-stream' });
      
      let pdf_file_name = this.get_title_pdf();
      if(window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, pdf_file_name);
      }
      else{
        const url = window.URL.createObjectURL(new Blob([this.state.file]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', pdf_file_name); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    }
    // let frmPop = document.frmPopup;
    // frmPop.action = "/app/api/v2/dial/generatepdf/dial_record_c";
    
    // frmPop.patient_id.value = this.state.system_patient_id;
    // frmPop.start_date.value = this.state.start_date;
    // frmPop.end_date.value = this.state.end_date;
    // frmPop.graph.value = this.props.graph_base64;
    
    // frmPop.submit();
  }
  
  getStartDate = value => {
    this.setState({start_date:formatDateLine(value)});
  };
  
  getEndDate = value => {
    this.setState({end_date:formatDateLine(value)});
  };
  
  // generatePDF = () => {
  //     axios({
  //         url: '/app/api/v2/dial/generatepdf/dial_record_a?patient_id='+this.state.system_patient_id+'&start_date='+this.state.start_date+'&end_date='+this.state.end_date,
  //         method: 'GET',
  //         responseType: 'blob', // important
  //     }).then((response) => {
  //         this.setState({
  //             file: response.data,
  //         });
  //     });
  // }
  
  onHide=()=>{}
  onDocumentComplete = (pages) => {
    this.setState({ numPages: pages, page:1 }, () => {
      setTimeout(() => {
        this.changeLoaded();
      }, 1000);
    });
  }
  
  render() {
    let file_area = document.getElementsByClassName("react-pdf__Page PDFPage PDFPageOne")[0];
    let file_left = 0;
    let file_top = 0;
    if (file_area != undefined){
      let modal_area = document.getElementsByClassName("preview-content")[0];
      file_left = (modal_area.clientWidth - 900) / 2;
      file_top = file_area.offsetTop + 2;
    }
    const { closeModal } = this.props;
    const { pageNumber, numPages } = this.state;
    return  (
      <Modal show={true} onHide={this.onHide} id="add_contact_dlg_print"  className="master-modal medical-info-doc-preview-modal print-sheet-modal">
        <Modal.Header>
          <Modal.Title>透析記録用紙</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className='content preview-content'>
              <form name="frmPopup" method="post">
                <input type="hidden" name="patient_id" />
                <input type="hidden" name="start_date" />
                <input type="hidden" name="end_date" />
                <input type="hidden" name="graph" />
              </form>
              {this.state.file != null ? (
                <>
                  <div>
                    <nav style={{marginBottom:"1rem"}}>
                      <button onClick={this.goToPrevPage}>前へ</button>
                      <button onClick={this.goToNextPage}>次へ</button>
                    </nav>
                    <div>
                      <div className="canvas-div">
                        <PDF file={this.state.file} page={pageNumber} onDocumentComplete={this.onDocumentComplete} scale={1.512}/>
                      </div>
                      <p>ページ {pageNumber} / {numPages}</p>
                    </div>
                  </div>
                  <div className={'loaded-area-file'} id="loaded-area-file" style={{left:file_left,top:file_top, width: "100%"}}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                </>
              ) : (
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={closeModal}>キャンセル</Button>
          <Button className="red-btn" onClick={this.downloadPdf.bind(this)}>印刷</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

PrintModal.contextType = Context;

PrintModal.propTypes = {
  closeModal: PropTypes.func,
  sheet_style: PropTypes.string,
  graph_base64 : PropTypes.string,
  display_measure_data:PropTypes.array,
  x_range:PropTypes.number,
  patientInfo: PropTypes.object,
  schedule_date: PropTypes.string
};

export default PrintModal;
