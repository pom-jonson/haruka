import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import axios from "axios/index";
import PDF from "react-pdf-js";
import { getServerTime} from "~/helpers/constants";
import { formatDateString } from "~/helpers/date";

import Spinner from "react-bootstrap/Spinner";
import * as sessApi from "~/helpers/cacheSession-utils";
import {makeList_code} from "~/helpers/dialConstants";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  .preview-content {
    height: 100%;
    overflow-y: hidden;
    position: relative;
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
  .landscape {
    width: 900px;
    height: 630px;
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

class PatientLedgerPrintModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
      pageNumber: 1,
      file: null,
      file2: null,
      download_flag: false,
    };
    this.modal_top = 0;
    this.modal_left = 0;    
  }

  async componentDidMount() {
    let path = '/app/api/v2/dial/generatepdf/patient_ledger';
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    var primary_disease_codes = makeList_code(code_master['原疾患'], 1);
    var death_cause_codes = makeList_code(code_master['死亡原因'], 1);
    var occupation_codes = makeList_code(code_master['職業'], 1);

    axios({
      url: path,
      method: "POST",
      data: {
        ...this.props,
        primary_disease_codes,
        death_cause_codes,
        occupation_codes,
        sort_type: this.props.sort_type
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

  changeLoaded = () => {
    let loaded_area = document.getElementsByClassName("loaded-area-file")[0];
    if (loaded_area !== undefined && loaded_area != null) {
      loaded_area.style["display"] = "none";
    }
    let content = document.getElementsByClassName("preview-content")[0];
    if (content !== undefined && content != null) {
      content.style["overflow-y"] = "auto";
    }
  };

  downloadPdf = async () => {
    if (this.state.file != null) {
      this.setState({ download_flag: true });
      const blob = new Blob([this.state.file], {
        type: "application/octet-stream",
      });
      var title = await this.get_title_pdf();
      if (window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(
          blob, title
        );
      } else {
        const url = window.URL.createObjectURL(new Blob([this.state.file]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", title); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
      this.setState({ download_flag: false });
    }
  };
  
  get_title_pdf=async()=>{
    let server_time = await getServerTime(); // y/m/d H:i:s        
    server_time = formatDateString(new Date(server_time))    

    var title = '';
    switch(this.props.modal_type){
      case 'ledger':
        title = '患者台帳_' + this.props.print_data.patient_number + "_";        
        break;
      case 'patient_table':
        title = '透析患者表_';
        break;
      case 'master_table':
        title = '患者マスタ一覧表_';
        break;
      case 'emergency_table':
        title = '緊急連絡先_' + this.props.print_data.patient_number + "_" + server_time;
        break;
    }
    title += this.props.schedule_date.split('-').join('');
    return title + ".pdf";
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
    let file_area = document.getElementsByClassName("react-pdf__Page PDFPage PDFPageOne")[0];
    let file_left = 0;
    let file_top = 0;
    if (file_area != undefined){
      let modal_area = document.getElementsByClassName("preview-content")[0];
      file_left = (modal_area.clientWidth - 900) / 2;
      file_top = file_area.offsetTop + 2;
    }
    var modal_title = '';
    switch(this.props.modal_type){
      case 'ledger':
        modal_title = '患者台帳';
        break;
      case 'patient_table':
        modal_title = '透析患者表';
        break;
      case 'master_table':
        modal_title = '患者マスタ一覧表';
        break;
      case 'emergency_table':
        modal_title = '緊急連絡先';
        break;
    }

    const { pageNumber, numPages } = this.state;
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal medical-info-doc-preview-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>{modal_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="preview-content">
              {this.state.file != null ? (
                <>
                  <div>
                    <nav style={{marginBottom:"1rem"}}>
                      <button onClick={this.goToPrevPage}>前へ</button>
                      <button onClick={this.goToNextPage}>次へ</button>
                    </nav>
                    <div>
                      <div className="canvas-div">
                        <PDF file={this.state.file} page={pageNumber} onDocumentComplete={this.onDocumentComplete}/>
                      </div>
                      <p>ページ {pageNumber} / {numPages}</p>
                    </div>
                  </div>
                  <div
                    className={`loaded-area-file ${this.props.modal_type === 'ledger' ? "landscape" : "portrait"}`}
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
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          {this.state.download_flag ? (
            <>
                <Button className="red-btn">印刷</Button>
            </>
          ) : (
            <>
                <Button className="red-btn" onClick={this.downloadPdf.bind(this)}>印刷</Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

PatientLedgerPrintModal.contextType = Context;

PatientLedgerPrintModal.propTypes = {
  closeModal: PropTypes.func,
  patient_id: PropTypes.number,
  schedule_date: PropTypes.string,
  sort_type: PropTypes.string,
  print_data: PropTypes.object,
  modal_type: PropTypes.string,
  table_data : PropTypes.array,
};

export default PatientLedgerPrintModal;
