import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import {surface} from "~/components/_nano/colors";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import { faPlus, faMinus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import SearchBar from "~/components/molecules/SearchBar";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import DocumentSaveConfirm from "./DocumentSaveConfirm";
import XLSX from 'xlsx';
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import {fetch} from 'whatwg-fetch'
import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as localApi from "~/helpers/cacheLocal-utils";
import $ from "jquery";
import Iframe from 'react-iframe'

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  .flex {display: flex;}
  .search-patient {
    display:flex;
    width:20rem;
    height: 2rem;
    margin-bottom:0.5rem;
    div {
      margin-top:0;
      height:2rem !important;
      line-height: 2rem;
    }
    .label-title {
      font-size: 1rem;
      width:4rem;
      line-height:2rem;
      margin: 0;
    }
    input {
      width:100%;
      height: 2rem;
      font-size: 1rem;
    }
    svg {
      font-size: 1rem;
      top: 0.6rem;
    }
  }
  .work-list{
    width: 100%;
    height: calc(100% - 2.5rem);
    margin-bottom:0.5rem;
    align-items: flex-start;
    justify-content: space-between;
    .left-area {
      width:30%;
      height: 100%;
      .panel-menu {
        width: 100%;
        font-size: 1rem;
        font-weight: bold;
        .menu-btn {
          width:100px;
          text-align: center;
          border: 1px solid #aaa;
          background-color: rgba(200, 194, 194, 0.22);
          height: 2rem;
          line-height: 2rem;
          cursor: pointer;
        }
        .active-menu {
          width:100px;
          text-align: center;
          border-top: 1px solid #aaa;
          border-right: 1px solid #aaa;
          border-left: 1px solid #aaa;
          height: 2rem;
          line-height: 2rem;
        }
        .no-menu {
          width: calc(100% - 100px);
          border-bottom: 1px solid #aaa;
        }
      }
      .tree-area {
        border-bottom: 1px solid #aaa;
        border-right: 1px solid #aaa;
        border-left: 1px solid #aaa;
        height: calc(100% - 4.5rem);
        width:100%;
        padding-top:0.5rem;
        .radio-area {
          height: 2rem;
          line-height: 2rem;
          padding-left: 1rem;
          margin-bottom: 0.5rem;
          label {
           font-size: 1rem;
           line-height: 2rem;
            height: 2rem;
          }
        }
        .search-word {
          margin-bottom: 0.5rem;
          display:flex;
          div {
            margin-top:0;
            height:2rem !important;
            line-height: 2rem;
          }
          .label-title {
            font-size: 1rem;
            width:3rem;
            line-height:2rem;
            margin: 0;
            margin-left: 0.5rem;
          }
          input {
            width:100%;
            height: 2rem;
            font-size: 1rem;
          }
          svg {
            font-size: 1rem;
            top: 0.6rem;
          }
        }
      }
    }
    .right-area {
      width:68%;
      height: 100%;
      .preview-box {
        width:100%;
        border:1px solid #aaa;
        text-align: center;
        font-size: 1rem;
        height:2rem;
        line-height:2rem;
        margin-bottom:0.5rem;
      }
      .preview-area {
        width:100%;
        height:calc(100% - 2.5rem);
        border: 1px solid #aaa;
        overflow:auto;
      }
      .image-block {
        width:100%;
        height:100%;
        padding:0.3rem;
        .image-area {
          width:100%;
          height:calc(100% - 4.5rem);
          line-height: 17rem;
          text-align:center;
          overflow:auto;
          border: 1px solid #aaa;
          .img {
            height: auto;
            width: 100%;
            max-width: 100%;
            max-height: none;
          }
        }
        .iframe-area {
          width:100%;
          height:calc(100% - 2.5rem);
        }
      }
      
    }
  }
  .check-area {
    label {
      font-size:1rem;
      line-height: 2rem;
    }
  }
`;

const Col = styled.div`
  width: calc(100% - 1rem);
  flex-grow: 1;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  background-color: ${surface};
  overflow:auto;
  border: 1px solid #aaa;
  margin-left: 0.5rem;
  .tree_open{

  }
  .tree_close{
    display:none;
  }
  nav ul li{
    padding-right: 0 !important;
  }
  li{
    cursor: default;
  }
  li span{
    cursor: pointer;
    white-space: nowrap;
  }
  nav {
    padding: 4px 0;
    ul {
      padding-left: 0;
      margin-bottom: 0;
      &:before {
        content: "";
        border-left: 1px solid #ccc;
        display: block;
        width: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
      }
      .selected {
        background: #ddd;
      }
      ul {
        margin-left: 10px;
        position: relative;
        margin-bottom: 0px;

        li {
          padding: 0px 12px;

          &:before {
            content: "";
            border-top: 1px solid #ccc;
            display: block;
            width: 8px;
            height: 0;
            position: absolute;
            top: 10px;
            left: 0;
          }
          &:last-child:before {
            background: #fff;
            height: auto;
            top: 10px;
            bottom: 0;
          }

          ul {
            margin-bottom: 0px;
            li {
              padding: 0px 12px;

              ul {
                margin-bottom: 0px;

                li {
                  padding: 0px 12px;
                }
              }
            }
          }
        }
      }
      li {
        margin: 0;
        padding: 3px 12px;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 0.8125‬rem;
        line-height: 20px;
        position: relative;
      }
    }

    li {
      cursor: pointer;
      list-style-type: none;
    }
  }
`;

const Icon = styled(FontAwesomeIcon)`
  color: black;
  font-size: 15px;
  margin-right: 5px;
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class DocumentReference extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tab_id:0,
      preview_skip:0,
      favorite_flg:0,
      key_word:"",
      tree_data:[],
      selected_tree:"",
      html: "",
      load_data_flag:false,
      selected_file_path:"",
      selected_file_name:"",
      free_comment:"",
      search_patient_number:"",
      selected_document_number:0,
      openDocumentSaveConfirm:false,
      alert_messages:"",
      confirm_message:"",
      load_file_data:true,
      selected_document_data:null,
    };
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    this.webdav_system_path = "";
    if(initState !== undefined && initState != null && initState.conf_data !== undefined && initState.conf_data.webdav_system_path !== undefined){
      this.webdav_system_path = initState.conf_data.webdav_system_path;
    } else {
      this.webdav_system_path = "http://haruka-develop.99sv-coco.com/webdav/";
    }
    this.save_flag = 0;
    let re = /patients[/]\d+/;
    this.isPatientPage = re.test(window.location.href); // if patientId no exist
    this.view_search_patient = false;
  }

  async componentDidMount() {
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    if(this.isPatientPage && current_system_patient_id > 0){
      this.view_search_patient = false;
    } else {
      this.view_search_patient = true;
    }
    await this.getDocumentTree();
  }

  setTab = ( e, val ) => {
    this.setState({
      tab_id:val,
      tree_data:[],
    }, ()=>{
      this.getDocumentTree();
    });
  };

  previewFile=async(tree_key, document_data)=>{
    this.setState({
      selected_tree:tree_key,
      selected_document_data:document_data,
      free_comment:document_data.free_comment,
      html:"",
      load_file_data:false,
      file_type:null,
      file_data:null,
    });
    if(document_data.import_file == 1){
      this.getFile(document_data);
    } else {
      let path = "/app/api/v2/document/get_file_data";
      await fetch(path, {
        method:'POST',
        headers: {'Authorization':axios.defaults.headers.common["Authorization"]},
        body: JSON.stringify({
          'open_type':"webdav",
          'file_path': document_data.file_path,
        })
      })
        .then((res) => res.arrayBuffer())
        .then((ab) => {
          let wb = XLSX.read(ab, { type: 'buffer', bookVBA: true });
          let firstSheetName = wb.SheetNames[0];
          let worksheet = wb.Sheets[firstSheetName];
          let html = XLSX.utils.sheet_to_html(worksheet);
          this.setState({
            html,
            load_file_data:true
          });
        });
    }
  }
  
  getFile=async(document_data)=> {
    let path = "/app/api/v2/document/get_file_data";
    await apiClient
      .post(path, {open_type:"webdav", file_path:document_data.file_path, file_name:document_data.file_name, import_file:1})
      .then((res) => {
        this.setState({
          load_file_data:true,
          file_type:res.type,
          file_data:res.file,
        });
      })
      .catch(() => {
        this.setState({
          load_file_data:true,
        });
      });
  }

  getDocumentTree=async()=>{
    if(this.state.load_data_flag){
      this.setState({load_data_flag:false});
    }
    let path = "/app/api/v2/document/search/patients_document_list";
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    let post_data = {
      tab_type:this.state.tab_id == 0 ? "list" : "search",
      patient_number:this.state.search_patient_number,
      key_word:this.state.key_word,
      patient_id:this.view_search_patient ? 0 : current_system_patient_id
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          selected_tree:"",
          html:"",
          load_data_flag:true,
          tree_data:res,
        }, ()=>{
          if(res[current_system_patient_id] !== undefined){
            this.treeOpenClose(current_system_patient_id+"-menu", 0);
          }
        });
      })
      .catch(() => {

      });
  };

  confirmOk=()=>{
  };

  handleOk=async()=>{
    if(this.state.selected_tree == ""){return;}
    if (!(this.context.$canDoAction(this.context.FEATURES.DOCUMENT_REFERENCE, this.context.AUTHS.EDIT, 0))) {
        this.setState({alert_messages: "権限がありません。"});
        return;
    }
    if(this.state.selected_document_data.import_file === 1){
      this.download_file(this.state.selected_document_data.file_path, this.state.selected_document_data.file_name);
    } else {
      window.onbeforeunload = null;
      document.location.href = this.webdav_system_path+this.state.selected_document_data.file_path;
      setTimeout(()=>{
        window.onbeforeunload = function () {
          return "Really?";
        };
      }, 200);
    }
  }
  
  download_file=async(file_path, file_name)=> {
    let path = "/app/api/v2/document/get_file_data";
    axios({
      url: path,
      method: 'POST',
      data:{open_type:"webdav", file_path:file_path},
      responseType: 'blob', // important
    }).then((response) => {
        this.setState({complete_message:""});
        const blob = new Blob([response.data], { type: 'application/octet-stream' });
        if(window.navigator.msSaveOrOpenBlob) {
          //IE11 & Edge
          window.navigator.msSaveOrOpenBlob(blob, file_name);
        }
        else{
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file_name); //or any other extension
          document.body.appendChild(link);
          link.click();
        }
      })
      .catch(() => {
      })
  }

  closeModal=()=>{
    this.setState({
      openDocumentSaveConfirm:false,
      alert_messages:"",
      confirm_message:"",
    })
  }

  setPatientNumber = word => {
    word = word.toString().trim();
    this.setState({
      search_patient_number: word
    });
  };

  setKeyWord = word => {
    word = word.toString().trim();
    this.setState({
      key_word: word
    });
  };

  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.getDocumentTree();
    }
  };

  treeOpenClose=(class_name, value)=>{
    let tree_obj_0 = document.getElementsByClassName(class_name)[0];
    let tree_obj_1 = document.getElementsByClassName(class_name)[1];
    if(tree_obj_0 !== undefined && tree_obj_0 != null && tree_obj_1 !== undefined && tree_obj_1 != null){
      if(value == 0){
        tree_obj_0.style['display'] = "none";
        tree_obj_1.style['display'] = "block";
      } else {
        tree_obj_0.style['display'] = "block";
        tree_obj_1.style['display'] = "none";
      }
    }
  }

  setFreeComment = e => {
    this.setState({free_comment: e.target.value.length > 25 ? this.state.free_comment : e.target.value});
  };

  confirmCloseModal=()=>{
    if(this.save_flag == 1){
      this.context.$setExaminationOrderFlag(1);
    }
    this.props.closeModal();
  }
  
  imageZoomMinus = () => {
    $('.img').width(function(n, c){
      if (c >= 30){
        return c - 10;
      } else {
        return c;
      }
    });
    $('.img')[0].style.maxWidth = 'none';
    $('.img')[0].style.maxHeight = 'none';
    $('.img')[0].style.height = 'auto';
  }
  
  imageZoomPlus = () => {
    $('.img').width(function(n, c){
      if (c <= 2000){
        return c + 10;
      } else {
        return c;
      }
    });
    $('.img')[0].style.maxWidth = 'none';
    $('.img')[0].style.maxHeight = 'none';
    $('.img')[0].style.height = 'auto';
  }
  
  imageFit = () => {
    $('.img')[0].style.height = 'auto';
    $('.img')[0].style.width = 'auto';
    $('.img')[0].style.maxWidth = '100%';
    $('.img')[0].style.maxHeight = '100%';
  }
  
  imageFitHorizontal= () => {
    $('.img')[0].style.width = '100%';
    $('.img')[0].style.height = 'auto';
    $('.img')[0].style.maxWidth = '100%';
    $('.img')[0].style.maxHeight = 'none';
  }
  
  imageOrigin = () => {
    $('.img')[0].style.height = 'auto';
    $('.img')[0].style.width = 'auto';
    $('.img')[0].style.maxWidth = 'none';
    $('.img')[0].style.maxHeight = 'none';
  }

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal document-reference-modal first-view-modal">
          <Modal.Header><Modal.Title>文書参照</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className="flex work-list">
                <div className="left-area">
                  <div className={'search-patient'}>
                    {this.view_search_patient && (
                      <>
                        <div className={'label-title'}>患者ID</div>
                        <div style={{width:"calc(100% - 5rem)"}}>
                          <SearchBar
                            search={this.setPatientNumber}
                            enterPressed={this.enterPressed}
                            value={this.state.search_patient_number}
                            id={'search_bar'}
                            onBlur={this.getDocumentTree.bind(this)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="panel-menu flex">
                    {this.state.tab_id == 0 ? (
                      <>
                        <div className="active-menu">一覧</div>
                      </>
                    ) : (
                      <>
                        <div className="menu-btn" onClick={e => {this.setTab(e, 0);}}>一覧</div>
                      </>
                    )}
                    {this.state.tab_id == 1 ? (
                      <>
                        <div className="active-menu" style={{marginLeft:"-1px"}}>検索</div>
                      </>
                    ) : (
                      <>
                        <div className="menu-btn" style={{marginLeft:"-1px"}} onClick={e => {this.setTab(e, 1);}}>検索</div>
                      </>
                    )}
                    <div className="no-menu"></div>
                  </div>
                  <div className={'tree-area'}>
                    {this.state.tab_id == 1 && (
                      <div className={'search-word'}>
                        <div className={'label-title'}>検索</div>
                        <div style={{width:"calc(100% - 4rem)"}}>
                          <SearchBar
                            search={this.setKeyWord}
                            enterPressed={this.enterPressed}
                            value={this.state.key_word}
                            id={'search_bar'}
                            onBlur={this.getDocumentTree.bind(this)}
                          />
                        </div>
                      </div>
                    )}
                    <Col id="set_tree" style={{height:this.state.tab_id == 0 ? "calc(100% - 0.5rem)" : "calc(100% - 3rem)"}}>
                      {this.state.load_data_flag ? (
                        <nav>
                          {Object.keys(this.state.tree_data).length > 0 && (
                            Object.keys(this.state.tree_data).map(patient_id=>{
                              let patient_doc = this.state.tree_data[patient_id];
                              return (
                                <>
                                  <ul>
                                    <li className={patient_id+"-menu"}>
                                      <span onClick={this.treeOpenClose.bind(this, patient_id+"-menu", 0)}>
                                        <Icon icon={faPlus} />{patient_doc['patient_name']}
                                      </span>
                                    </li>
                                    <li className={patient_id+"-menu"} style={{display:"none"}}>
                                      <span onClick={this.treeOpenClose.bind(this, patient_id+"-menu", 1)}>
                                        <Icon icon={faMinus} />{patient_doc['patient_name']}
                                      </span>
                                      <ul>
                                        {Object.keys(patient_doc['slip_data']).length > 0 && (
                                          Object.keys(patient_doc['slip_data']).map(slip_id=>{
                                            let slip_data = patient_doc['slip_data'][slip_id];
                                            return (
                                              <>
                                                <li className={patient_id+"-slip-menu-"+slip_id}>
                                                  <span onClick={this.treeOpenClose.bind(this, patient_id+"-slip-menu-"+slip_id, 0)}>
                                                    <Icon icon={faPlus} />{slip_data['slip_name']}
                                                  </span>
                                                </li>
                                                <li className={patient_id+"-slip-menu-"+slip_id} style={{display:"none"}}>
                                                  <span onClick={this.treeOpenClose.bind(this, patient_id+"-slip-menu-"+slip_id, 1)}>
                                                    <Icon icon={faMinus} />{slip_data['slip_name']}
                                                  </span>
                                                  <ul>
                                                    {Object.keys(slip_data['document']).length > 0 && (
                                                      Object.keys(slip_data['document']).map(order_number=>{
                                                        let document_data = slip_data['document'][order_number];
                                                        return (
                                                          <>
                                                            <li className={"document-menu-"+order_number}>
                                                              <span
                                                                className={this.state.selected_tree == order_number ? " selected" : ""}
                                                                onClick={this.previewFile.bind(this, order_number, document_data)}
                                                              >{document_data['scanner_title'] != undefined && document_data['scanner_title'] != null && document_data['scanner_title'] != "" ? document_data['scanner_title'] : document_data['name']}</span>
                                                            </li>
                                                          </>
                                                        )
                                                      })
                                                    )}
                                                  </ul>
                                                </li>
                                              </>
                                            )
                                          })
                                        )}
                                      </ul>
                                    </li>
                                  </ul>
                                </>
                              )
                            })
                          )}
                        </nav>
                      ):(
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      )}
                    </Col>
                  </div>
                </div>
                <div className="right-area">
                  <div className={'preview-box'}>プレビュー</div>
                  <div className={'preview-area'}>
                    {this.state.load_file_data ? (
                      <>
                        {this.state.selected_document_data != null && (
                          <>
                            {this.state.selected_document_data.import_file === 1 ? (
                              <>
                                {this.state.file_type === "image" && (
                                  <div className={'image-block'}>
                                    <div className={'image-area'}>
                                      <img className='img' src={this.state.file_data} alt="" />
                                    </div>
                                    <div className='text-center' style={{marginTop:"0.5rem"}}>{this.state.selected_document_data.file_name}</div>
                                    <div className='text-center flex'>
                                      <div className={'flex'} style={{margin:"0 auto"}}>
                                        <button style={{marginRight:"0.5rem"}} onClick={this.imageZoomPlus.bind(this)}>拡大</button>
                                        <button style={{marginRight:"0.5rem"}} onClick={this.imageZoomMinus.bind(this)}>縮小</button>
                                        <button style={{marginRight:"0.5rem"}} onClick={this.imageFit.bind(this)}>１００％</button>
                                        <button style={{marginRight:"0.5rem"}} onClick={this.imageFitHorizontal.bind(this)}>横幅最大</button>
                                        <button onClick={this.imageOrigin.bind(this)}>原寸</button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {this.state.file_type === "pdf" && (
                                  <div className={'image-block'}>
                                    <div className={'iframe-area'}>
                                      <Iframe
                                        url={this.webdav_system_path + this.state.selected_document_data.file_path}
                                        width="100%"
                                        height="100%"
                                        id="myId"
                                        className=""
                                        display="initial"
                                        position="relative"
                                        allowFullScreen
                                      />
                                    </div>
                                    <div className='text-center' style={{marginTop:"0.5rem"}}>{this.state.selected_document_data.file_name}</div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div
                                style={{width:"100%", height:"100%"}}
                                className="App"
                                dangerouslySetInnerHTML={{ __html: this.state.html }}
                              />
                            )}
                          </>
                        )}
                      </>
                    ):(
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    )}
                  </div>
                </div>
              </div>
              <div className={'flex'} style={{height:"2rem"}}>
                <div style={{lineHeight:"2rem", width:"8rem", height:"2rem"}}>フリーコメント</div>
                <div style={{lineHeight:"2rem", width:"calc(100% - 8rem)", border:"1px solid #aaa", height:"2rem", padding:"0 0.2rem"}}>{this.state.free_comment}</div>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className={'cancel-btn'} onClick={this.confirmCloseModal}>キャンセル</Button>
            <Button className={this.state.selected_tree == "" ? 'disable-btn' : "red-btn"} onClick={this.handleOk}>表示</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.confirm_message !== "" && (
            <SystemConfirmModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.openDocumentSaveConfirm && (
            <DocumentSaveConfirm
              closeModal={this.closeModal}
            />
          )}
        </Modal>
      </>
    );
  }
}

DocumentReference.contextType = Context;
DocumentReference.propTypes = {
  closeModal: PropTypes.func,
};

export default DocumentReference;
