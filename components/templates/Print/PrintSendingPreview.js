import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
// import { CACHE_SESSIONNAMES} from "~/helpers/constants";
// import * as sessApi from "~/helpers/cacheSession-utils";
import Button from "~/components/atoms/Button";
import axios from "axios/index";
import {formatDateLine, formatDateString} from "~/helpers/date";
import PDF from "react-pdf-js";
import { getServerTime} from "~/helpers/constants";
import Spinner from "react-bootstrap/Spinner";


const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    .content {
        height: 100%;
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

class PrintSendingPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
      pageNumber: 1,
      file:null,
      file2:null,
    }
  }
  
  async componentDidMount() {
    // download pdf
    var url;
    url = '/app/api/v2/dial/generatepdf/dial_sending_print';
    axios({
      url: url,
      method: 'POST',
      data:{
        table_data : this.props.table_data,
        start_date : this.props.start_date,
        end_date : this.props.end_date,
        display_all : this.props.display_all,
        display_continue : this.props.display_continue,
        display_dr : this.props.display_dr,
        display_next : this.props.display_next,
        display_va_continue: this.props.display_va_continue,
        date_setting : this.props.date_setting,
        staff_list_by_number: this.props.staff_list_by_number,
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
  
  downloadPdf =async()=>{
    if(this.state.file != null){
      const blob = new Blob([this.state.file], { type: 'application/octet-stream' });
      
      // "申し送り一覧.pdf"
      let pdf_file_name = await this.get_title_pdf();
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
  
  get_title_pdf = async () => {
    let server_time = formatDateLine(this.props.start_date).split("-").join("") + "-" + formatDateLine(this.props.end_date).split("-").join("");
    // 本日
    if (this.props.date_setting == 0) {
      server_time = await getServerTime(); // y/m/d H:i:s
      server_time = formatDateLine(new Date(server_time)).split("-").join("");
    } else if(this.props.date_setting == 2) {
      server_time = await getServerTime(); // y/m/d H:i:s
      server_time = formatDateString(new Date(server_time));
    }
    let pdf_file_name = "申し送り一覧" + "_" + server_time + ".pdf";
    return pdf_file_name;
  }
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
      <Modal show={true} onHide={this.onHide} id="add_contact_dlg_print"  className="master-modal medical-info-doc-preview-modal">
        <Modal.Header>
          <Modal.Title>申し送り一覧</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className='content preview-content'>
              {this.state.file != null ? (
                <>
                  <div style={{height:"100%", width:"100%"}}>
                    <nav style={{marginBottom:"1rem"}}>
                      <button onClick={this.goToPrevPage}>前へ</button>
                      <button onClick={this.goToNextPage}>次へ</button>
                    </nav>
                    <div style={{height:"calc(100% - 40px)", width:"100%"}}>
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
          <Button className={'cancel-btn'} onClick={closeModal}>キャンセル</Button>
          <Button className={'red-btn'} onClick={this.downloadPdf.bind(this)}>印刷</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

PrintSendingPreview.contextType = Context;

PrintSendingPreview.propTypes = {
  closeModal: PropTypes.func,
  table_data : PropTypes.array,
  start_date : PropTypes.string,
  end_date : PropTypes.string,
  display_all : PropTypes.bool,
  display_continue : PropTypes.bool,
  display_dr : PropTypes.bool,
  display_next : PropTypes.bool,
  date_setting : PropTypes.number,
  display_va_continue : PropTypes.bool,
  staff_list_by_number: PropTypes.object,
};

export default PrintSendingPreview;
