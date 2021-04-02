import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
// import {formatDateLine} from "~/helpers/date";
import axios from "axios/index";
import PDF from "react-pdf-js";
import Spinner from "react-bootstrap/Spinner";


const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  float: left;
  padding: 25px;
  text-align:center;

  .lb-top-title{
    text-decoration: underline;
  }
.flex {
  display: flex;
  flex-wrap: wrap;
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

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class RadiationPrintModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      print_data:this.props.print_data,
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
    url = '/app/api/v2/print_haruka/generatepdf/radiation_done_print';
    
    axios({
      url: url,
      method: 'POST',
      data:{
        contents:this.state.print_data,
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
      var title = '照射録.pdf';
      if(window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, title);
      }
      else{
        const url = window.URL.createObjectURL(new Blob([this.state.file]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', title); //or any other extension
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
      <Modal show={true} id="add_contact_dlg" onHide={this.onHide}  className="master-modal medical-info-doc-preview-modal">
        <Modal.Header>
          <Modal.Title>{'照射録'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            {this.state.file != null ? (
              <>
                
                  <nav>
                    <div className="d-flex">
                      <button onClick={this.goToPrevPage}>前へ</button>
                      <p className="mt-2 ml-2 mr-2">ページ {pageNumber} / {numPages}</p>
                      <button onClick={this.goToNextPage}>次へ</button>
                    </div>
                  </nav>
                  <div className='flex text-center' style={{width:'100%'}}>
                    <div className="canvas-div">
                        <PDF file={this.state.file} page={pageNumber} onDocumentComplete={this.onDocumentComplete} scale={1.512}/>
                      </div>
                  </div>
                  <div className="d-flex">
                    <button onClick={this.goToPrevPage}>前へ</button>
                    <p className="mt-2 ml-2 mr-2">ページ {pageNumber} / {numPages}</p>
                    <button onClick={this.goToNextPage}>次へ</button>
                  </div>                  
                
              </>
            ) : (
              <>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </>
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

RadiationPrintModal.contextType = Context;

RadiationPrintModal.propTypes = {
  closeModal: PropTypes.func,
  print_data: PropTypes.array,
};

export default RadiationPrintModal;
