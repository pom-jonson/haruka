import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import * as methods from "~/components/templates/Dial/DialMethods";
import { surface } from "~/components/_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import DialSideBar from "../DialSideBar";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import VARecordInsertModal from "../modals/VARecordInsertModal";
import DialPatientNav from "../DialPatientNav";
import * as apiClient from "~/api/apiClient";
import {
  formatDateSlash,
  formatJapanYear,
  formatDateTimeIE
} from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {displayLineBreak, makeList_code} from "~/helpers/dialConstants";
import DigitalImageVAModal from "~/components/templates/Dial/MedicalInformation/DigitalImageVAModal";
import axios from "axios/index";
import * as sessApi from "~/helpers/cacheSession-utils";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 18rem;
  display: flex;
`;

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 0.3rem;
`;

const Card = styled.div`
  position: relative;
  width: 100%;
  margin: 0px;
  top: 70px;
  width: calc(100% - 390px);
  left: 200px;
  height: calc(100% - 70px);
  position: fixed;
  background-color: ${surface};
  padding: 1.25rem;
  
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
    line-height: 3rem;
  }
  .selected-row {
    background-color: #a0ebff !important;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1rem;
  .content {
    margin-top: 0.5rem;
    width: 100%;
    height: calc(100% - 3rem);
  }
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .clickable {
    cursor: pointer;
    input {
      cursor: pointer;
    }
  }
  .div-style1 {
    display: block;
    overflow: hidden;
    line-height: 2rem;
    .label-type1 {
      float: left;
    }
    .label-type2 {
      float: right;
    }
  }

  .left-area {
    width: 70%;
    height: 100%;
    display: block;
    .main-info {
      width: 100%;
      height: 50%;
      overflow: hidden;
      p {
        margin: 0;
        text-align: center;
        font-size: 1.25rem;
      }
    }
    .va-body {
      height: calc(100% - 2rem);
    }
    .history-list {
      height: 50%;
      width: 100%;
      .history-title {
        font-size: 1.25rem;
      }
      .flex div {
        width: 50%;
      }
      .history-delete {
        cursor: pointer;
      }
    }
    .box-border {
      overflow: hidden;
      overflow-y: auto;
      border: 1px solid black;
      height: 85%;
      p {
        margin: 0;
        text-align: center;
      }
      .select-area .radio-group-btn label {
        text-align: left;
        padding-left: 0.625rem;
        border-radius: 0.25rem;
      }
    }
  }
  .right-area {
    width: 30%;
    height:100%;
    padding-left: 1.25rem;
    .dv-register {
      margin-right: 1.25rem;
      font-size: 1rem;
    }
    .padding-style1 {
      margin-top: 0.3rem;
      margin-left: 0.3rem;
    }
    img {
      margin-top: 0.625rem;      
    }
    .image-area {
      border: 1px solid #aaa;
      margin: 0.625rem;
      cursor:pointer;
      text-align:center;
      img {
        max-width:100%;
        max-height:6.25rem;
        padding: 0.3rem;
      }
    }
  }

  .table-view {
    border: 1px solid lightgray;
    overflow: hidden;
    height: calc(100% - 3rem);
    overflow-y:auto;
  }
  table {
    height: 100%;
    thead {
      display: table;
      width: 100%;
      line-height: 2rem;
    }
    tbody {
      display: block;
      overflow-y: auto;
      height: calc((100vh - 15.5rem - 70px)/2);
      width: 100%;
    }
    tr {
      display: table;
      width: 100%;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    tr:hover{background-color:#e2e2e2 !important;}
    td {
      word-break: break-all;
      padding: 0.25rem;
    }
    th {
      position: sticky;
      text-align: center;
      padding: 0.3rem;
    }
    .td-date {
      width: 6rem;
    }
    .facility-cell{
      width : 14rem;
    }
    .width-30 {
      width: 10rem;
    }
    .item-no {
      width: 3.125rem;
    }
    .code-number {
      width: 7.5rem;
    }
    .width-40 {
      width: 13rem;
    }
  }
  .a-link{
    border-bottom: 1px solid;
    color: #007bff;
    cursor:pointer;
    margin-top:3px;
    margin-bottom:3px;
  }
`;

const ContextMenuUl = styled.ul`  
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 16px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;

    div {
      padding: 0.3rem 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .selected{
    background:lightblue;
  }
  .selected li: hover{
    background:lightblue;
  }
`;

const ContextMenu = ({ visible, x, y, parent, item, kind }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div onClick={() => parent.contextMenuAction("edit", item, kind)}>
              変更
            </div>
          </li>
          <li>
            <div onClick={() => parent.contextMenuAction("delete", item, kind)}>
              削除
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenuRight = ({ visible, x, y, parent }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li className={parent.state.display_image_mode == 0?'selected':''}>
            <div onClick={() => parent.changeDisplayMode(0)}>1列表示</div>
          </li>
          <li className={parent.state.display_image_mode == 1?'selected':''}>
            <div onClick={() => parent.changeDisplayMode(1)}>サムネイル一覧</div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class VARecord extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    var VACodeData = code_master['VA名称'];
    var VA_surgeryCodeData = code_master['VA手術'];
    this.double_click = false;
    this.state = {
      VACodeData,
      VA_surgeryCodeData,
      VA_codes:makeList_code(VACodeData),
      VA_surgery_codes:makeList_code(VA_surgeryCodeData),
      openAddVAModal: false,
      VA_list: [],
      is_use_history: 1,
      showImage: "",
      patient_id: 0,
      modal_data: null,
      isDeleteConfirmModal: false,
      confirm_message: "",
      delete_id: "",
      selected_row:0,
      display_va_image:1,
      isOpenDigitalImageModal:false,
      is_loaded:true,
      display_image_mode:1
    };
  }

  async componentDidMount() {    
    await this.getStaffs();
  }

  createPattern = (kind) => {
    if (this.state.patient_id == 0) {
      window.sessionStorage.setItem(
        "alert_messages",
        "左側のメニューから患者様を選択してください。"
      );
      return;
    }
    this.setState({
      openAddVAModal: true,
      VA_kind: kind,
      modal_data: null,
    });
  };

  openDigitalImageModal=(index)=>{    
    this.setState({isOpenDigitalImageModal:true, selected_image:this.state.thumbnail_list[index]});    
};

  selectPatient = (patientInfo) => {
    this.setState({ patientInfo: patientInfo });
    this.initializeInfo(patientInfo.system_patient_id);    
  };

  initializeInfo = async(patient_id) => {
    this.setState({
      patient_id: patient_id,
      VA_list: [],
      is_loaded:false,
    });
    await this.getImageList(patient_id);
    await this.getVARecordInfo(patient_id);
  };

  async getImageList(patient_id){
    let path = "/app/api/v2/dial/medicine_information/getImageByGenre";
    var post_data = {
      system_patient_id:patient_id,
      is_va_record:true,
    };
    await apiClient
      ._post(path, {
          params: post_data
      })
      .then((res) => {
        if (res){
          this.setState({
            thumbnail_list : res,            
          });
        }        
      })
      .catch(() => {        
      });
  }


  handleOk = async() => {
    this.closeModal();
    await this.getVARecordInfo(this.state.patient_id);
  };

  getVARecordInfo = async (patient_id) => {
    let path = "/app/api/v2/dial/medicine_information/VARecord/search";
    await apiClient
      ._post(path, {
        params: { patient_id: patient_id },
      })
      .then((res) => {
        if (res.length > 0){
          if (res[0].system_patient_id == this.state.patientInfo.system_patient_id){
            let showImageData = this.getShowImage(res, this.state.is_use_history);        
            this.setState({
              VA_list: res,
              showImage: showImageData.length > 0 ? showImageData[0] : "",
              is_loaded:true,
            });
          }
        } else {
          this.setState({
            VA_list: [],
            showImage: "",
            is_loaded:true,
          })
        }
      })
      .catch(() => {
        this.setState({
          VA_list: [],
          showImage: "",
          is_loaded:true,
        })
      });
  };

  getShowImage = (imageLists, category) => {
    let showImageLists = [];
    if (
      imageLists != undefined &&
      imageLists != null &&
      imageLists.length > 0
    ) {
      imageLists.map((item) => {
        if (category == 1 && item.category == "VA使用歴") {
          showImageLists.push(item);
        } else if (category != 1 && item.category == "VA処置歴") {
          showImageLists.push(item);
        }
      });
    }
    return showImageLists;
  };

  closeModal = () => {
    this.setState({ 
      openAddVAModal: false, 
      isOpenDigitalImageModal:false,
    });
  };

  getShowDate = (item) => {
    if(item == undefined || item == null) return "";
    if(item.date != null) {
        return formatDateSlash(item.date);
    } else if( item.month != null ) {
        // return formatJapanYearMonth(item.year.toString() + "-" + ("00" + item.month.toString()).slice(-2));
        return (item.year.toString() + "/" + ("00" + item.month.toString()).slice(-2));
    } else {
        return formatJapanYear(item.year.toString());
    }
  }

  changeDisplayMode = (mode) => {
    this.setState({display_image_mode:mode});
  }


handleClick_Right = (e) => {
  if (e.type === "contextmenu") {
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ contextMenu_Right: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        contextMenu_Right: { visible: false },
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    document
      .getElementById("table-view")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu_Right: { visible: false },
        });
        document
          .getElementById("table-view")
          .removeEventListener(`scroll`, onScrollOutside);
      });

      this.setState({
        contextMenu_Right: {
          visible: true,
          x: e.clientX,
          y: e.clientY,          
        },
      });
  }
}

  handleClick = (e, item, kind) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false },
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      if (kind == 0){
        document
        .getElementById("VA-table-0")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false },
          });
          document
            .getElementById("VA-table-0")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      } else {
        document
        .getElementById("VA-table-1")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false },
          });
          document
            .getElementById("VA-table-1")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      }      
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY,
          item: item,
          kind: kind,
        },
      });
    }
  };

  contextMenuAction = (act, item, kind) => {
    if (act === "edit") {
      this.editData(item, kind);
    } else if (act === "delete") {
      this.setState({
        isDeleteConfirmModal: true,
        confirm_message: kind
          ? "VA使用歴情報を削除しますか?"
          : "VA処置歴情報を削除しますか?",
        delete_id: item.number,
      });
    }
  };

  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }

  editData = (item, kind) => {
    this.setState({
      modal_data: item,
      openAddVAModal: true,
      VA_kind: kind,
    });
  };

  deleteData = async () => {
    if (this.state.delete_id !== "") {
      let path = "/app/api/v2/dial/medicine_information/VARecord/delete";

      let post_data = {
        params: { number: this.state.delete_id },
      };
      if (this.double_click == true) return;
      this.double_click = true;
      await apiClient.post(path, post_data).then(()=>{
        window.sessionStorage.setItem(
        "alert_messages",
        "削除完了##" + "削除しました。");
      }).finally(() => {
        this.double_click = false;
      });
      this.getVARecordInfo(this.state.patient_id);
    }
    this.confirmCancel();
  };

  selectShowImage = (e, item) => {
    this.setState({
      showImage: item,
      selected_row:item.number,
      is_use_history: item.category == "VA使用歴" ? 1 : 0,
    });
  };

  // getDate = value => {
  //     this.setState({ schedule_date: value}, () => {
  //         this.getVARecordInfo();
  //     })
  // };

  // PrevDay = () => {
  //     let now_day = this.state.schedule_date;
  //     let cur_day = getPrevDayByJapanFormat(now_day);
  //     this.setState({ schedule_date: cur_day}, () => {
  //         this.getVARecordInfo();
  //     })
  // };

  // NextDay = () => {
  //     let now_day = this.state.schedule_date;
  //     let cur_day = getNextDayByJapanFormat(now_day);
  //     this.setState({ schedule_date: cur_day}, () => {
  //         this.getVARecordInfo();
  //     })
  // };

  toggleImages = (value) => {
    this.setState({display_va_image:value});
  }

  downloadfile = async(image_path, filename) => {    
    let path = "/app/api/v2/dial/download/VAfiles";    
    await axios({
      url: path,
      method: 'POST',
      data:{
          image_path:image_path
      }, 
      responseType: 'blob', // important
    }).then((response) => {      
      if (response.data.size > 0){
        const blob = new Blob([response.data], { type: 'application/octet-stream' });        
        if(window.navigator.msSaveOrOpenBlob) {
          //IE11 & Edge
          window.navigator.msSaveOrOpenBlob(blob, filename);
        }
        else{
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename); //or any other extension
            document.body.appendChild(link);
            link.click();
        }
      }
    });    
  }

  render() {
    let { VA_codes, VA_list, VA_surgery_codes, showImage } = this.state;

    return (
      <>
        <ContextMenu {...this.state.contextMenu} parent={this} />
        <ContextMenuRight {...this.state.contextMenu_Right} parent={this} />
        <>
          <DialSideBar
            onGoto={this.selectPatient}
            history = {this.props.history}
          />
          <DialPatientNav
            patientInfo={this.state.patientInfo}
            history = {this.props.history}
          />
          <Card>
            <Wrapper>
              <div className="title">VA記録</div>              
              <div className="d-flex content">
                <div className="left-area">
                  <div className="main-info">
                    <div className="div-style1">
                      <div className="label-type1">VA使用歴</div>
                      <div
                        className="label-type2 clickable"
                        onClick={this.createPattern.bind(this, 1)}
                      >
                        <Icon icon={faPlus} />
                        VA使用歴を追加
                      </div>
                    </div>
                    <div className="va-body">
                      <table className="table-scroll table table-bordered table-hover">
                        <thead>
                          <th className="td-date">日付</th>
                          <th className="width-40">VA名称</th>
                          <th className='facility-cell'>実施施設</th>
                          <th>コメント</th>
                        </thead>
                        <tbody id="VA-table-1">
                          {this.state.is_loaded != true && (
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          )}
                          {this.state.is_loaded && VA_list.length > 0 && VA_codes != undefined && VA_codes != null && (
                            VA_list.map((item) => {
                              if (item.category == "VA使用歴") {
                                return (
                                  <>
                                    <tr className={this.state.selected_row == item.number ? 'selected-row' : ''} 
                                      // onClick={(e) =>this.selectShowImage(e, item)}
                                      onContextMenu={(e) =>this.handleClick(e, item, 1)}>
                                      <td className="td-date">
                                        {this.getShowDate(item)}
                                      </td>
                                      <td className="width-40">
                                        {VA_codes != undefined ? VA_codes[item.va_title_code] : ""}
                                      </td>
                                      <td className='facility-cell'>
                                        {item.implemented_facilities}                                        
                                      </td>
                                      <td>{item.comment != null && item.comment != ''? displayLineBreak(item.comment):''}</td>
                                    </tr>
                                  </>
                                );
                              }
                            }
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="history-list">
                    <div className="div-style1">
                      <div className="label-type1">VA処置歴</div>
                      <div className="label-type2 clickable" onClick={this.createPattern.bind(this, 0)}>
                        <Icon icon={faPlus} />
                        VA処置歴を追加
                      </div>
                    </div>
                    <div className="va-body">
                      <table className="table-scroll table table-bordered table-hover">
                        <thead>
                          <th className="td-date">日付</th>
                          <th className="width-40">処置内容</th>
                          <th className='facility-cell'>実施施設</th>
                          <th>コメント</th>
                        </thead>
                        <tbody id="VA-table-0">
                          {this.state.is_loaded != true && (
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          )}
                          {this.state.is_loaded && VA_list.length > 0 && VA_surgery_codes != undefined && VA_surgery_codes != null && (
                            VA_list.map((item) => {
                              if (item.category == "VA処置歴") {
                                return (
                                  <>
                                    <tr className={this.state.selected_row == item.number ? 'selected-row' : ''}
                                    //  onClick={(e) =>this.selectShowImage(e, item)}
                                     onContextMenu={(e) =>this.handleClick(e, item, 0)}>
                                      <td className="td-date">
                                        {this.getShowDate(item)}
                                      </td>
                                      <td className="width-40">
                                        {VA_surgery_codes != undefined &&
                                        VA_surgery_codes[item.va_title_code] !=
                                          undefined
                                          ? VA_surgery_codes[item.va_title_code]
                                          : ""}
                                      </td>
                                      <td className='facility-cell'>{item.implemented_facilities}</td>
                                      <td>{item.comment != null && item.comment != ''?displayLineBreak(item.comment):''}</td>
                                    </tr>
                                  </>
                                );
                              }
                            }
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="right-area">
                  {this.state.display_va_image == 1 && (
                    <>
                    <div className='flex' style={{lineHeight:"2rem"}}>
                      <div style={{marginRight:'30px', lineHeight: "3rem"}}>VA履歴</div>
                      <button style={{marginBottom:'5px'}} onClick={this.toggleImages.bind(this, 0)}>VA画像履歴を表示</button>
                    </div>
                    
                    <div className="table-view">
                      <div style={{ fontSize: "2rem", padding: "3px" }} className={`border-bottom padding-style1`}>
                        {showImage != null && showImage != undefined && showImage.va_title_code != null && showImage.va_title_code != undefined 
                          ? showImage.category == "VA使用歴"
                            ? VA_codes != undefined &&
                              VA_codes[showImage.va_title_code]
                            : VA_surgery_codes != undefined &&
                              VA_surgery_codes[showImage.va_title_code]
                          : ""}
                      </div>
                      <div className={`border-bottom padding-style1`}>
                        <div className="d-flex" style={{ padding: "3px" }}>
                          <div className="dv-register">登録者</div>
                          <div className={`w-75 text-left`}>
                            <span>
                              {showImage !== undefined &&
                                showImage != null &&
                                this.state.staff_list_by_number !== undefined &&
                                this.state.staff_list_by_number != null &&
                                this.state.staff_list_by_number[
                                  showImage.updated_by
                                ]}
                            </span>
                          </div>
                        </div>
                      </div>
                      <img
                        src={
                          showImage != null &&
                          showImage != undefined &&
                          showImage.imgBase64
                        }
                        style={{maxWidth: "100%", maxHeight:"85%"}}
                        alt=""
                      />
                    </div>
                    </>
                  )}
                  {this.state.display_va_image != 1 && (
                    <>
                    <div className='flex'>
                      <div style={{marginRight:'30px'}}>VA画像履歴</div>
                      <button style={{marginBottom:'5px'}} onClick={this.toggleImages.bind(this, 1)}>VA使用歴を表示</button>
                    </div>
                    <div className="table-view" id = 'table-view' onContextMenu={(e) =>this.handleClick_Right(e)}>
                      {this.state.display_image_mode == 0 && (
                        <>
                          {this.state.thumbnail_list != undefined && this.state.thumbnail_list != null && this.state.thumbnail_list.length > 0 && (
                            this.state.thumbnail_list.map((item, index) => {
                              if(item.imgBase64 !== ''){
                                return (
                                    <>
                                      <div className={'image-area'} onClick={this.openDigitalImageModal.bind(this, index)}>
                                        <div style={{lineHeight:'6.25rem'}}>
                                          <img src={item.imgBase64} alt="" style={{width: "100%", height:"85%"}} />
                                        </div>
                                        <div className='text-center' style={{marginTop:'3px', marginBottom:'3px'}}>
                                          <span>{formatDateSlash(formatDateTimeIE(item.updated_at))}</span>&nbsp;&nbsp;
                                          <span>{item.image_title != null && item.image_title != ''? item.image_title : item.name}</span>
                                        </div>
                                      </div>                                
                                    </>
                                )
                              }
                              if(item.filename !=null && item.filename != '' && item.imgBase64 == ''){
                                return (
                                  <>
                                  <div className='image-area'>
                                    <div className='a-link text-center' onClick = {this.downloadfile.bind(this, item.image_path, item.filename)}>
                                      <span>{formatDateSlash(formatDateTimeIE(item.updated_at))}</span>&nbsp;&nbsp;
                                      <span>{item.image_title != null && item.image_title != ''? item.image_title : item.name}</span>
                                    </div>
                                  </div>
                                  </>
                                )
                              }
                            })
                          )}
                        </>
                      )}
                      {this.state.display_image_mode == 1 && (
                        <>
                        <div className='flex'>
                          {this.state.thumbnail_list != undefined && this.state.thumbnail_list != null && this.state.thumbnail_list.length > 0 && (
                            this.state.thumbnail_list.map((item, index) => {
                              if(item.imgBase64 !== ''){
                                return (
                                    <>
                                      <div className={'image-area'} onClick={this.openDigitalImageModal.bind(this, index)} style={{width:'48%', margin:'2px'}}>
                                        <div style={{height:'6.25rem'}}>
                                          <img src={item.imgBase64} alt="" style={{maxWidth: "100%", maxHeight:"100%", marginTop:0}} />
                                        </div>
                                      </div>
                                    </>
                                )
                              }
                              if(item.filename !=null && item.filename != '' && item.imgBase64 == ''){
                                return (
                                  <>
                                  <div className='image-area' style={{width:'48%', margin:'2px', height:'6.25rem'}}>
                                    <div className='a-link text-center' onClick = {this.downloadfile.bind(this, item.image_path, item.filename)}>
                                      <span>{formatDateSlash(formatDateTimeIE(item.updated_at))}</span><br/>
                                      <span>{item.image_title != null && item.image_title != ''? item.image_title : item.name}</span>
                                    </div>
                                  </div>
                                  </>
                                )
                              }
                            })
                          )}
                        </div>

                        </>
                      )}
                    
                    </div>
                    </>
                  )}
                </div>
              </div>
            </Wrapper>
          </Card>
          {this.state.openAddVAModal && (
            <VARecordInsertModal
              handleOk={this.handleOk}
              closeModal={this.closeModal}
              kind={this.state.VA_kind}
              VACodeData={this.state.VACodeData}
              VA_surgeryCodeData={this.state.VA_surgeryCodeData}
              VA_codes={this.state.VA_codes}
              VA_surgery_codes={this.state.VA_surgery_codes}
              patient_id={this.state.patient_id}
              patient_number={this.state.patientInfo.patient_number}
              modal_data={this.state.modal_data}
            />
          )}
          {this.state.isDeleteConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.deleteData.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
          {this.state.isOpenDigitalImageModal && (
            <DigitalImageVAModal
                closeModal={this.closeModal}
                image={this.state.selected_image}
            />
          )}
        </>
      </>
    );
  }
}

VARecord.contextType = Context;

VARecord.propTypes = {
  checkFootCare: PropTypes.func,
  history : PropTypes.object
};

export default VARecord;

