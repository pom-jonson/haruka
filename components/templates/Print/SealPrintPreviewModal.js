import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
// import { CACHE_SESSIONNAMES} from "~/helpers/constants";
// import * as sessApi from "~/helpers/cacheSession-utils";
import Button from "~/components/atoms/Button";
import axios from "axios/index";
import { formatDateLine } from "~/helpers/date";
import PDF from "react-pdf-js";
import Spinner from "react-bootstrap/Spinner";


const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .content {
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
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  }

  .PDFPageOne {
    margin-bottom: 25px;
  }

  .PDFPage > canvas {
    max-width: 100%;
    height: auto !important;
  }

  .period-label {
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

class SealPrintPreviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
      pageNumber: 1,
    };
  }

  async componentDidMount() {
    // download pdf
    var url = "/app/api/v2/dial/generatepdf/seal_print";

    axios({
      url: url,
      method: "POST",
      data: {
        content_data: this.props.content_data,
      },
      responseType: "blob", // important
    }).then((response) => {
      this.setState({
        file: response.data,
      });
    });
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages }, () => {
      setTimeout(() => {
        this.changeLoaded();
      }, 1000);
    });
  };

  changeLoaded = () => {
    let loaded_area = document.getElementsByClassName("loaded-area-file")[0];
    if (loaded_area !== undefined && loaded_area != null) {
      loaded_area.style["display"] = "none";
    }
    let content = document.getElementsByClassName("content")[0];
    if (content !== undefined && content != null) {
      content.style["overflow-y"] = "auto";
    }
  };

  goToPrevPage = () => {
    if (this.state.pageNumber - 1 !== 0) {
      this.setState((state) => ({ pageNumber: state.pageNumber - 1 }));
    }
  };

  goToNextPage = () => {
    if (this.state.pageNumber + 1 <= this.state.numPages) {
      this.setState((state) => ({ pageNumber: state.pageNumber + 1 }));
    }
  };

  downloadPdf = () => {
    if (this.state.file != null) {
      const blob = new Blob([this.state.file], {
        type: "application/octet-stream",
      });
      // "シール.pdf"
      let pdf_file_name = this.get_title_pdf();
      if (window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, pdf_file_name);
      } else {
        const url = window.URL.createObjectURL(new Blob([this.state.file]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", pdf_file_name); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    }
  };
  
  onHide = () => {};

  get_title_pdf = () => {         
    let pdf_file_name = "抗凝固剤シール" + "_" + formatDateLine(this.props.content_data.search_day).split("-").join("") + ".pdf";
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
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg_print"
        className="master-modal medical-info-doc-preview-modal"
      >
        <Modal.Header>
          <Modal.Title>抗凝固剤シール</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className='content preview-content'>
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
                  <div
                    className={"loaded-area-file"}
                    id="loaded-area-file"
                    style={{ left: file_left, top: file_top, width: "100%" }}
                  >
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

SealPrintPreviewModal.contextType = Context;

SealPrintPreviewModal.propTypes = {
  closeModal: PropTypes.func,
  content_data : PropTypes.object,
//   patientInfo : PropTypes.object,
//   patient_id: PropTypes.number,
//   start_date: PropTypes.string,
//   end_date: PropTypes.string,
//   reserved_patient_codes: PropTypes.array,
//   finishdelete: PropTypes.number,
};

export default SealPrintPreviewModal;
