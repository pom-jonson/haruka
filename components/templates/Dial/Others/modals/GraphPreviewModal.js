import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import axios from "axios/index";
import PDF from "react-pdf-js";
import { formatDateLine } from "~/helpers/date";
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

class GraphPreviewModal extends Component {
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
    let path = '/app/api/v2/dial/generatepdf/guide_line_graph';
    let print_data = {};
    print_data.start_date = this.props.start_date;
    print_data.end_date = this.props.end_date;
    print_data.section = this.props.section;
    print_data.comment = this.props.comment;
    print_data.count_by_section = this.props.count_by_section;
    print_data.horr_low = this.props.horr_low;
    print_data.horr_high = this.props.horr_high;
    print_data.ver_low = this.props.ver_low;
    print_data.ver_high = this.props.ver_high;
    print_data.ver_name = this.props.ver_name;
    print_data.horr_name = this.props.horr_name;
    print_data.modal_title = this.props.modal_title;
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

  downloadPdf = () => {
    if (this.state.file != null) {
      this.setState({ download_flag: true });
      const blob = new Blob([this.state.file], {
        type: "application/octet-stream",
      });
      
      let pdf_file_name = this.get_title_pdf();
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

  get_title_pdf = () => {
    let server_time = formatDateLine(this.props.start_date).split("-").join("") + "-" + formatDateLine(this.props.end_date).split("-").join("");
    let pdf_file_name = this.props.modal_title + "_" + server_time + ".pdf";

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
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal medical-info-doc-preview-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>{this.props.modal_title}</Modal.Title>
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

GraphPreviewModal.contextType = Context;

GraphPreviewModal.propTypes = {
  closeModal: PropTypes.func,
  start_date: PropTypes.string,
  end_date: PropTypes.string,
  comment:PropTypes.array,
  count_by_section:PropTypes.array,
  horr_low : PropTypes.number,    
  horr_high : PropTypes.number,
  ver_low : PropTypes.number,
  ver_high : PropTypes.number,
  section : PropTypes.number,
  ver_name: PropTypes.string,
  horr_name: PropTypes.string,
  modal_title : PropTypes.string,
};
      
export default GraphPreviewModal;

// import React, { Component } from "react";
// import { Modal } from "react-bootstrap";
// import PropTypes from "prop-types";
// import Context from "~/helpers/configureStore";
// import styled from "styled-components";
// import ReactToPrint from 'react-to-print';
// import Button from "~/components/atoms/Button";


// const Graph = styled.div`
//     .flex {
//         display: flex;
//         flex-wrap: wrap;
//     }
//     width: 100%;
//     height: 100%;
//     padding-left:30px;
//     padding-right:30px;
//     overflow-y: auto;
//     .width100 {
//         width: 100%;
//         margin-top:20px;
//     }
//     .c_graph {
//         width: 70px;
//         .ver-line {
//             background-color: rgb(85, 88, 244);
//             width: 20px;
//             margin-left: 24.5px;
//         }
//         .ver-point {
//             text-align: center;
//             font-size: 14px;
//         }
//         .height-line-1 {
//             height: 110px;
//         }
//         .height-line-2 {
//             height: 180px;
//         }
//         .height-line-3 {
//             height: 240px;
//         }
//     }
//     .p_graph {
//         .hor-line {
//             background-color: rgb(85, 88, 244);
//             height:20px;
//         }
//         .her-point {
//             line-height: 20px;
//         }
//         .width-line-1 {
//             margin-left: 24.5px;
//             width: 35%;
//         }
//         .width-line-2 {
//             width: 25%;
//         }
//         .width-line-3 {
//             width: calc(40% - 150px);
//         }
//     }
    
//     .triangle-up {
//         width: 0;
//         height: 0;
//         border-left: 25px solid transparent;
//         border-right: 25px solid transparent;
//         border-bottom: 50px solid rgb(85, 88, 244);    
//         margin-left: 10px;
//     }
//     .triangle-right {
//         width: 0;
//         height: 0;
//         border-top: 25px solid transparent;
//         border-left: 50px solid rgb(85, 88, 244);
//         border-bottom: 25px solid transparent;    
//         margin-top: -15px;
//     }
//     .box-area {
//         width: calc(100% - 70px);
//         font-size: 14px;
//         .flex {
//             margin-bottom: -1px;
//         }
//         .guide-box {
//             position: relative;
//             p {
//                 margin: 0;
//                 padding-left: 5px;
//             }
//             width: 33%;
//             height: 200px;
//             margin-right: -1px;
//             border: 1px solid black;
//             button {
//                 background-color: #ccc;
//                 color: black;
//             }
//             .box-bottom-area{
//                 position: absolute;
//                 bottom: 10px;
//                 margin-left: 15px;
//             }
//             .people-count {
//                 width:auto;
//                 margin-right:10px;
//                 margin-top:5px;
//             }
//             .box-btn {
//                 width: 50px;                
//             }
//         }
//         .color-1 {
//             background-color: rgb(226, 103, 121);
//         }
//         .color-2 {
//             background-color: rgb(222, 186, 190);
//         }
//         .color-3 {
//             background-color: rgb(238, 237, 181);
//         }
//         .color-4 {
//             background-color: rgb(239, 238, 182);
//         }
//         .color-5 {
//             background-color: white;
//         }
//         .color-6 {
//             background-color: rgb(217, 176, 174);
//         }
//         .color-7 {
//             background-color: rgb(169, 192, 226);
//         }
//         .color-8 {
//             background-color: rgb(247, 237, 140);
//         }
//         .color-9 {
//             background-color: rgb(85, 133, 218);
//         }
//     }
// `;

// class GraphPreviewModal extends Component {
//     constructor(props) {
//         super(props);        
//         this.state = {             
//         }        
//     }
//     closeModal = () => {
//         this.props.closeModal();
//     };

//     render() {
//         const { closeModal} = this.props;        
//         return  (
//             <Modal show={true} onHide={closeModal} id="add_contact_dlg"  className="master-modal medical-info-doc-preview-modal">
//                 <Modal.Header>
//                     <Modal.Title>PとCaの治療指針</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <div style={{width:"100%", height:"100%"}}>
//                         <ComponentToPrint
//                             ref={el => (this.componentRef = el)}
//                             comment ={this.props.comment}
//                             count_by_section = {this.props.count_by_section}
//                             horr_low = {this.props.horr_low}
//                             horr_high = {this.props.horr_high}
//                             ver_low = {this.props.ver_low}
//                             ver_high = {this.props.ver_high}
//                             horr_name = {this.props.horr_name}
//                             ver_name = {this.props.ver_name}
//                         />
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer>
//                   <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
//                     <ReactToPrint
//                         trigger={() => <Button className="red-btn">印刷</Button>}
//                         content={() => this.componentRef}
//                     />
                    
//                 </Modal.Footer>
//             </Modal>
//         );
//     }
// }

// class ComponentToPrint extends React.Component {
//     constructor(props) {
//         super(props);        
//         this.state={
//             comment:this.props.comment,
//             count_by_section:this.props.count_by_section,
//             horr_low : this.props.horr_low,
//             horr_high : this.props.horr_high,
//             ver_low : this.props.ver_low,
//             ver_high : this.props.ver_high,
//             horr_name : this.props.horr_name,
//             ver_name : this.props.ver_name,
//         }
//     }
    
//     render() {
//         let {count_by_section, comment} = this.state;
//         return (
//             <Graph>
//                 <div className="flex width100">
//                     <div className="c_graph">
//                         <div className="ver-point">{this.state.ver_name}</div>
//                         <div className="triangle-up"></div>
//                         <div className="ver-line height-line-1"></div>
//                         <div className="ver-point">{this.state.ver_high}</div>
//                         <div className="ver-line height-line-2"></div>
//                         <div className="ver-point">{this.state.ver_low}</div>
//                         <div className="ver-line height-line-3"></div>
//                     </div>
//                     <div className="box-area">
//                         <div className="flex">
//                             <div className="guide-box color-7">
//                                 <p>⑦</p>
//                                 {comment != undefined && comment != null && comment[6].length>0 && (
//                                     comment[6].map(item => {
//                                         return(
//                                             <>
//                                                 <p>{item}</p>
//                                             </>
//                                         )
//                                     })
//                                 )}                                        
//                                 <div className="flex box-bottom-area">
//                                 <div className="people-count">{count_by_section[7]}人</div>
//                                     {/* <div className="box-btn"><Button>備考</Button></div> */}
//                                 </div>
//                             </div>
//                             <div className="guide-box color-4">
//                                 <p>④</p>
//                                 {comment != undefined && comment != null && comment[3].length>0 && (
//                                     comment[3].map(item => {
//                                         return(
//                                             <>
//                                                 <p>{item}</p>
//                                             </>
//                                         )
//                                     })
//                                 )}
//                                 <div className="flex box-bottom-area">
//                                     <div className="people-count">{count_by_section[4]}人</div>
//                                     {/* <div className="box-btn"><Button>備考</Button></div> */}
//                                 </div>

//                             </div>
//                             <div className="guide-box color-1">
//                                 <p>①</p>
//                                 {comment != undefined && comment != null && comment[0].length>0 && (
//                                     comment[0].map(item => {
//                                         return(
//                                             <>
//                                                 <p>{item}</p>
//                                             </>
//                                         )
//                                     })
//                                 )}
//                                 <div className="flex box-bottom-area">
//                                     <div className="people-count">{count_by_section[1]}人</div>
//                                     {/* <div className="box-btn"><Button>備考</Button></div> */}
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="flex">
//                             <div className="guide-box color-8">
//                                 <p>⑧</p>
//                                 {comment != undefined && comment != null && comment[7].length>0 && (
//                                     comment[7].map(item => {
//                                         return(
//                                             <>
//                                                 <p>{item}</p>
//                                             </>
//                                         )
//                                     })
//                                 )}
//                                 <div className="flex box-bottom-area">
//                                     <div className="people-count">{count_by_section[8]}人</div>
//                                     {/* <div className="box-btn"><Button>備考</Button></div> */}
//                                 </div>
//                             </div>
//                             <div className="guide-box color-5">
//                                 <p>⑤</p>
//                                 {comment != undefined && comment != null && comment[4].length>0 && (
//                                     comment[4].map(item => {
//                                         return(
//                                             <>
//                                                 <p>{item}</p>
//                                             </>
//                                         )
//                                     })
//                                 )}
//                                 <div className="flex box-bottom-area">
//                                     <div className="people-count">{count_by_section[5]}人</div>
//                                     {/* <div className="box-btn"><Button>備考</Button></div> */}
//                                 </div>
//                             </div>
//                             <div className="guide-box color-2">
//                                 <p>②</p>
//                                 {comment != undefined && comment != null && comment[1].length>0 && (
//                                     comment[1].map(item => {
//                                         return(
//                                             <>
//                                                 <p>{item}</p>
//                                             </>
//                                         )
//                                     })
//                                 )}
//                                 <div className="flex box-bottom-area">
//                                     <div className="people-count">{count_by_section[2]}人</div>
//                                     {/* <div className="box-btn"><Button>備考</Button></div> */}
//                                 </div>
//                             </div>
//                         </div>
//                         <div className="flex">
//                             <div className="guide-box color-9">
//                                 <p>⑨</p>
//                                 {comment != undefined && comment != null && comment[8].length>0 && (
//                                     comment[8].map(item => {
//                                         return(
//                                             <>
//                                                 <p>{item}</p>
//                                             </>
//                                         )
//                                     })
//                                 )}
//                                 <div className="flex box-bottom-area">
//                                     <div className="people-count">{count_by_section[9]}人</div>
//                                     {/* <div className="box-btn"><Button>備考</Button></div> */}
//                                 </div>
//                             </div>
//                             <div className="guide-box color-6">
//                                 <p>⑥</p>
//                                 {comment != undefined && comment != null && comment[5].length>0 && (
//                                     comment[5].map(item => {
//                                         return(
//                                             <>
//                                                 <p>{item}</p>
//                                             </>
//                                         )
//                                     })
//                                 )}
//                                 <div className="flex box-bottom-area">
//                                     <div className="people-count">{count_by_section[6]}人</div>
//                                     {/* <div className="box-btn"><Button>備考</Button></div> */}
//                                 </div>
//                             </div>
//                             <div className="guide-box color-3">
//                                 <p>③</p>
//                                 {comment != undefined && comment != null && comment[2].length>0 && (
//                                     comment[2].map(item => {
//                                         return(
//                                             <>
//                                                 <p>{item}</p>
//                                             </>
//                                         )
//                                     })
//                                 )}
//                                 <div className="flex box-bottom-area">
//                                     <div className="people-count">{count_by_section[3]}人</div>
//                                     {/* <div className="box-btn"><Button>備考</Button></div> */}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="flex p_graph">
//                     <div className="hor-line width-line-1"></div>
//                     <div className="her-point">{this.state.horr_low}</div>
//                     <div className="hor-line width-line-2"></div>
//                     <div className="her-point">{this.state.horr_high}</div>
//                     <div className="hor-line width-line-3"></div>
//                     <div className="triangle-right"></div>
//                     <div className="her-point">{this.state.horr_name}</div>
//                 </div>
//             </Graph>
//         );
//     }
// }

// GraphPreviewModal.contextType = Context;

// GraphPreviewModal.propTypes = {
//     closeModal: PropTypes.func,
//     comment:PropTypes.array,
//     count_by_section:PropTypes.array,
//     horr_low : PropTypes.number,    
//     horr_high : PropTypes.number,
//     ver_low : PropTypes.number,
//     ver_high : PropTypes.number,
//     horr_name : PropTypes.string,
//     ver_name : PropTypes.string,
// };

// ComponentToPrint.contextType = Context;

// ComponentToPrint.propTypes = {
//     closeModal: PropTypes.func,
//     comment:PropTypes.array,
//     count_by_section:PropTypes.array,
//     horr_low : PropTypes.number,    
//     horr_high : PropTypes.number,
//     ver_low : PropTypes.number,
//     ver_high : PropTypes.number,
//     horr_name : PropTypes.string,
//     ver_name : PropTypes.string,
// };

// export default GraphPreviewModal;
