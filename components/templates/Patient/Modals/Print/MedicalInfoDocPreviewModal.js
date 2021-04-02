import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import axios from "axios/index";
import PDF from "react-pdf-js";

import Spinner from "react-bootstrap/Spinner";

const Wrapper = styled.div`
    width: 100%;
    height: calc( 100vh - 220px);
    .preview-content {
        height: calc(100vh - 320px);
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
    
    .loaded-area {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        height: 100%;
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

class MedicalInfoDocPreviewModal extends Component {
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
    axios({
      url: '/app/api/v2/print_haruka/generatepdf?number=' + this.props.history_number,
      method: 'GET',
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
  
  changeLoaded =()=>{
    let loaded_area = document.getElementsByClassName("loaded-area")[0];
    if(loaded_area !== undefined && loaded_area != null){
      loaded_area.style['display'] = "none";
    }
    let content = document.getElementsByClassName("preview-content")[0];
    if(content !== undefined && content != null){
      content.style['overflow-y'] = "auto";
    }
  }
  
  downloadPdf =()=>{
    if(this.state.file != null){
      const blob = new Blob([this.state.file], { type: 'application/octet-stream' });
      if(window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, '診療情報提供書.pdf');
      }
      else{
        const url = window.URL.createObjectURL(new Blob([this.state.file]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '診療情報提供書.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    }
    this.downloadPdfB();
  }
  
  async downloadPdfB () {
    axios({
      url: '/app/api/v2/print_haruka/generatepdfB',
      method: 'POST',
      data:{number:this.props.history_number},
      responseType: 'blob', // important
    }).then((response) => {
      this.setState({
        file: response.data,
      });
      
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      if(window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, '診療情報提供書.pdf');
      }
      else{
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '診療情報提供書.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    });
  }
  onDocumentComplete = (pages) => {
    this.setState({ numPages: pages, page:1 }, () => {
      setTimeout(() => {
        this.changeLoaded();
      }, 1000);
    });
  }
  onHide = () => {};
  
  render() {
    const { closeModal } = this.props;
    const { pageNumber, numPages } = this.state;
    return  (
      <Modal show={true} id="add_contact_dlg" onHide={this.onHide} className="master-modal medical-info-doc-preview-modal">
        <Modal.Header>
          <Modal.Title>診療情報提供書</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className='preview-content'>
              {this.state.file != null && (
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
                </>
              )}
              <div className={'loaded-area'}>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </div>
            </div>
            <div className="add-button">
              <Button type="mono" onClick={this.downloadPdf.bind(this)}>印刷</Button>
              <Button type="mono" onClick={closeModal}>閉じる</Button>
            </div>
          </Wrapper>
        </Modal.Body>
      </Modal>
    );
  }
}

MedicalInfoDocPreviewModal.contextType = Context;

MedicalInfoDocPreviewModal.propTypes = {
  closeModal: PropTypes.func,
  history_number: PropTypes.number,
};

export default MedicalInfoDocPreviewModal;
