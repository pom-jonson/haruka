import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import axios from "axios/index";
// import {formatDateLine} from "~/helpers/date";
import PDF from "react-pdf-js";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
    width: 100%;
    .content {
        overflow-y:auto;
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

class KartePrintPreviewModal extends Component {
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
      url: '/app/api/v2/print_haruka/generatepdf/karte',
      method: 'POST',
      data:{
        patient_id:this.props.patientId,
        start_date:this.props.start_date,
        end_date:this.props.end_date,
        department_id:this.props.department_id,
        all_period: this.props.all_period,
        enable_flag: this.props.enable_flag,
        tag_flag: this.props.tag_flag,
      },
      responseType: 'blob', // important
    }).then((response) => {
      this.setState({
        file: response.data,
      });
    });
  }
  
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
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
      if(window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, 'カルテ.pdf');
      }
      else{
        const url = window.URL.createObjectURL(new Blob([this.state.file]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'カルテ.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    }
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
    const { pageNumber, numPages } = this.state;
    return  (
      <Modal show={true} id="add_contact_dlg" onHide={this.onHide}  className="medical-info-doc-preview-modal">
        <Modal.Header>
          <Modal.Title>カルテ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className='content'>
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
              )
              }
              {(this.state.numPages == null) && (
                <>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </>
              )}
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          <Button className={"red-btn"} onClick={this.downloadPdf}>印刷</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

KartePrintPreviewModal.contextType = Context;

KartePrintPreviewModal.propTypes = {
  closeModal: PropTypes.func,
  patientId : PropTypes.number,
  start_date : PropTypes.string,
  end_date : PropTypes.string,
  department_id : PropTypes.number,
  all_period : PropTypes.number,
  enable_flag : PropTypes.number,
  tag_flag : PropTypes.number,
};

export default KartePrintPreviewModal;
