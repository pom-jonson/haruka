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

class DialMasterPrintPreview extends Component {
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
    let path = "/app/api/v2/dial/status/print";
    let print_data = {};
    print_data.bed_data_2f = this.props.bed_data_2f;
    print_data.bed_data_3f = this.props.bed_data_3f;
    print_data.used_bed_count = this.props.used_bed_count;
    print_data.show_time = this.props.show_time;
    print_data.view_content = this.props.view_content;
    print_data.schedule_date = this.props.schedule_date;
    print_data.timezone = this.props.timezone;
    print_data.time_zone_list = this.props.time_zone_list;
    axios({
      url: path,
      method: "POST",
      data: { print_data },
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
  
  downloadPdf = async() => {
    if (this.state.file != null) {
      this.setState({ download_flag: true });
      const blob = new Blob([this.state.file], {
        type: "application/octet-stream",
      });
      
      // "透析状況モニタ.pdf"
      let pdf_file_name = await this.get_title_pdf();
      if (window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(
          blob, pdf_file_name
        );
      } else {
        const url = window.URL.createObjectURL(new Blob([this.state.file]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", pdf_file_name); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
      this.setState({ download_flag: false });
    }
  };
  
  get_title_pdf = async () => {
    let server_time = await getServerTime(); // y/m/d H:i:s
    server_time = formatDateString(new Date(server_time))
    let pdf_file_name = "透析状況モニタ_" + server_time + ".pdf";
    return pdf_file_name;
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
    const { pageNumber, numPages } = this.state;
    return (
      <Modal
        show={true}
        onHide={this.onHid}
        id="add_contact_dlg"
        className="master-modal medical-info-doc-preview-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>{'透析状況モニタ'}</Modal.Title>
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
                        <PDF file={this.state.file} page={pageNumber} onDocumentComplete={this.onDocumentComplete} />
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

DialMasterPrintPreview.contextType = Context;

DialMasterPrintPreview.propTypes = {
  closeModal: PropTypes.func,
  bed_data_2f: PropTypes.array,
  bed_data_3f: PropTypes.array,
  used_bed_count: PropTypes.number,
  show_time: PropTypes.number,
  view_content: PropTypes.number,
  schedule_date: PropTypes.string,
  timezone: PropTypes.number,
  time_zone_list: PropTypes.array,
};

export default DialMasterPrintPreview;
