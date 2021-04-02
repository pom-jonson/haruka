import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import {formatDateLine} from "~/helpers/date";
import axios from "axios/index";
import PDF from "react-pdf-js";
import Spinner from "react-bootstrap/Spinner";


const Wrapper = styled.div`
  width: 100%;
    height: calc( 100vh - 220px);
    .content {
        height: 100%;
        overflow-y:hidden;
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

class XRayPreviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contents:this.props.contents,
      facility_data: this.props.facility_data,
      numPages: null,
      pageNumber: 1,
      file:null,
      file2:null,
    }
  }
  closeModal = () => {
    this.props.closeModal();
  };
  async componentDidMount() {
    // download pdf
    var url;
    url = '/app/api/v2/dial/generatepdf/x_ray_print';
    
    axios({
      url: url,
      method: 'POST',
      data:{
        contents:this.state.contents,
        facility:this.state.facility_data,
        all_print:this.props.all_print,
        time_zone: this.props.time_zone,
        floor: this.props.floor,
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
  
  
  downloadPdf =()=>{
    if(this.state.file != null){
      const blob = new Blob([this.state.file], { type: 'application/octet-stream' });
      // var title = this.props.all_print?'X線照射録(一覧).pdf':'X線照射録(個別).pdf';
      
      // "title.pdf"
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
  }
  
  get_title_pdf = () => {
    let title = this.props.all_print?'X線照射録(一覧)':'X線照射録(個別)_'+this.state.contents[0].patient_number;
    let pdf_file_name = title + "_" + formatDateLine(this.props.x_ray_date).split("-").join("") + ".pdf";
    return pdf_file_name;
  }
  onDocumentComplete = (pages) => {
    this.setState({ numPages: pages, page:1 }, () => {
      setTimeout(() => {
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
  onHide = () => {};
  
  render() {
    let file_area = document.getElementsByClassName("react-pdf__Page PDFPage PDFPageOne")[0];
    let file_left = 0;
    let file_top = 0;
    if (file_area != undefined){
      let modal_area = document.getElementsByClassName("preview-content")[0];
      file_left = (modal_area.clientWidth - 900) / 2;
      file_top = file_area.offsetTop + 2;
    }
    const { pageNumber, numPages } = this.state;
    return  (
      <Modal show={true} id="add_contact_dlg" onHide={this.onHide} className="master-modal medical-info-doc-preview-modal">
        <Modal.Header>
          <Modal.Title>{this.props.all_print?'X線照射録(一覧)':'X線照射録(個別)'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
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
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} className={'cancel-btn'}>キャンセル</Button>
          <Button onClick={this.downloadPdf.bind(this)} className={'red-btn'}>印刷</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

XRayPreviewModal.contextType = Context;

XRayPreviewModal.propTypes = {
  closeModal: PropTypes.func,
  contents: PropTypes.array,
  cur_date: PropTypes.string,
  facility_data: PropTypes.array,
  all_print: PropTypes.number,
  time_zone: PropTypes.string,
  x_ray_date: PropTypes.string,
  floor: PropTypes.string
};

export default XRayPreviewModal;