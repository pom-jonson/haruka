import React, { Component } from "react";
import DialSideBar from "../DialSideBar";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import { formatDateLine, formatJapanDate, formatDateSlash, formatDateTimeIE } from "~/helpers/date";
import * as methods from "../DialMethods";
import * as apiClient from "~/api/apiClient";
import DialPatientNav from "../DialPatientNav";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DatePicker, { registerLocale } from "react-datepicker";
import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
registerLocale("ja", ja);
import ja from "date-fns/locale/ja";
import PropTypes from "prop-types";
import { medicalInformationValidate } from '~/helpers/validate'
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import axios from "axios/index";
import ChangeTitleModal from "./ChangeTitleModal";
import {setDateColorClassName} from "~/helpers/dialConstants";

const Card = styled.div`
  position: fixed;
  top: 70px;
  width: calc(100% - 390px);
  left: 200px;
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }
  .footer {
    margin-top: 0.625rem;
    text-align: center;
    button {
      text-align: center;
      border-radius: 0.25rem;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 1.875rem;
    }

    span {
      color: white;
      font-size: 0.8rem;
      font-weight: 100;
    }
  }
  .flex {
    display: flex;
  }
  .sub-title-image {
    width: 82%;
    position: relative;
    .label-folder {
      font-size: 1.25rem;
    }
    form {
      width: 100%;
      display: flex;
    }
    .fileInput {
      height: 2.625rem;
      width: 70%;
      cursor: pointer;
      border: 1px solid gray;
      padding: 0.5rem;
    }
    .filename{
      margin-top:10px;
      font-size:1rem;
      label{
        width: auto;
        margin-right:10px;
      }
      input{
        width:20rem;
      }
    }
    .submitButton {
      font-size: 1.25rem;
      // width: 20%;
      background: rgb(105, 200, 225);
      color: white;
      cursor: pointer;
      border-radius: 0.25rem;
      margin-left: 1rem;
      height: 2.625rem;
      margin-top: 0px;
      border: none;
      width: 91px;
    }
    .submitButton:hover {
      background: rgb(38, 159, 191);
    }
    .disable-btn {
      background: lightgray;
      color: rgb(84, 84, 84);
    }
    .disable-btn:hover {
      background: lightgray !important;
    }
    .left {
      width: calc(100% - 18.75rem);
      label {
        font-size: 1rem;
      }
    }
    .right {
      padding-top: 0.3rem;
      label {
        margin-bottom: 0px;
        font-size: 1rem;
        padding-top: 0.3rem;
      }
      .radio-btn {
        width: 6.25rem;
        border: 1px solid lightgray;
        label {
          border-radius: 0px;
        }
      }
    }
  }
  .sub-title-list {
    width: 20%;
    margin-right: 2%;
    font-size: 1.25rem;
    .cur-date {
      padding: 0.3rem;
      border: 1px solid gray;
    }
  }
  .top-area {
    padding-top: 0.3rem;
    clear: both;
  }
  .file_check_area {
    .gender-label {
      margin-left: 1rem;
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

const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 0.75rem;
  width: 100%;
  height: 4.375rem;
  float: left;
  .list-title {
    margin-top: 1.25rem;
    font-size: 1rem;
    width: 20%;
  }
  .search-box {
    width: 80%;
    display: flex;
  }
  .label-title {
    width: 6rem;
    text-align: right;
    margin-right: 0.625rem;
    display: none;
  }
  .pullbox-select {
    font-size: 0.75rem;
    width: 12.5rem;
  }
  .browse-file {
    div {
      width: 100%;
    }
    button {
      margin-left: 1rem;
      height: 90%;
      margin-top: 9px;
    }
  }
`;
const List = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 0.75rem;
  width: 20%;
  margin-right: 2%;
  height: calc(100vh - 17rem);
  padding: 2px;
  float: left;
  overflow-y: auto;
  border: solid 1px lightgrey;
  .table-row {
    cursor: pointer;
    font-size: 1rem;
    padding: 0.3rem;
    &:nth-child(2n) {
      background-color: #f2f2f2;
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.075);
    }
  }
  .selected-genre {
    background: #4986e6 !important;
    color: white;
  }
`;
const Wrapper = styled.div`
  height: calc(100% - 15rem);
  margin-top:1rem;
  overflow-y: auto;
  width: 78%;
  float: right;
  h3 {
    margin-left: 1rem;
  }
  .imgPreview {
    text-align: center;
    margin: 0.3rem 1rem;
    height: 12.5rem;
    width: 31.25rem;
    border: 1px solid gray;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .previewText {
    width: 100%;
    margin-top: 1.25rem;
  }

  .centerText {
    text-align: center;
    width: 31.25rem;
  }
  .image-list {
    width: 100%;
  }
  .image-area {
    width:12.5rem;
    height:9.8rem;
    float: left;
    border: 1px solid gray;
    margin-right: 0.625rem;
    margin-bottom: 0.625rem;
    text-align:center;
    img {
      max-width: 12.5rem;
      max-height: 8rem;
      padding: 0.3rem;
    }
  }
`;

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({ visible, x, y, parent, index }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div onClick={() => parent.changeTitle(index)}>タイトル変更</div>
          </li>
          <li>
            <div onClick={() => parent.contextMenuAction(index)}>削除</div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class ImageRegist extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      selected_genre: "",
      file: null,
      patient_number: "",
      system_patient_id: "",
      image_list: [],
      isDeleteConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      delete_id: "",
      cur_date: '',
      change_flag: 0,
      check_message:"",
      is_loaded:true,
      isConfirmComplete: false,
      isOpenChangeTitleModal:false,
      image_title:'',
    };
    this.registering_flag = false;
    this.upload_max_filesize = 2;
    let upload_max_filesize = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").upload_max_filesize;
    if (upload_max_filesize != undefined) this.upload_max_filesize = upload_max_filesize;
  }
  
  async componentDidMount () {
    let server_time = await getServerTime();
    sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(new Date(server_time)));
    this.setState({cur_date:new Date(server_time)});
    this.setChangeFlag(0);
    this.changeBackground();
    await this.getGenreMasterCode("画像");
  }
  
  componentDidUpdate () {
    this.changeBackground();
  }
  
  changeBackground = () => {
    medicalInformationValidate("image_register", this.state, "background");
  }
  
  componentWillUnmount() {
    sessApi.remove('dial_change_flag');
    sessApi.remove('for_left_sidebar');
  }
  
  setChangeFlag=(change_flag)=>{
    this.setState({change_flag});
    if (change_flag){
      sessApi.setObjectValue('dial_change_flag', 'image_regist', 1)
    } else {
      sessApi.remove('dial_change_flag');
    }
  };
  
  selectGenre = (code) => {
    this.setState({
      selected_genre: code,
    });
    
    this.getImageInfo(this.state.system_patient_id, code);
  };
  
  async getImageInfo(system_patient_id, code) {
    if (system_patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    if (code === 0) {
      window.sessionStorage.setItem(
        "alert_messages",
        "画像ジャンルを選択してください。"
      );
      return;
    }
    let path = "/app/api/v2/dial/medicine_information/getImageByGenre";
    const post_data = {
      system_patient_id: system_patient_id,
      image_genre_code: code,
      cur_date: formatDateLine(this.state.cur_date),
    };
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then((res) => {
        if (res) {
          this.setState({
            image_list: res,
            // file: null,
          });
        }
      })
      .catch(() => {});
  }
  
  onFormSubmit = (e) => {
    if (this.registering_flag) {
      return;
    }
    e.preventDefault();
    // TODO: do something with -> this.state.file
    if (this.state.system_patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    if (this.state.selected_genre === '') {
      window.sessionStorage.setItem(
        "alert_messages",
        "画像ジャンルを選択してください。"
      );
      return;
    }
    let validate_data = medicalInformationValidate("image_register", this.state);
    if (validate_data['error_str_arr'].length > 0 ) {
      this.setState({
        check_message:validate_data['error_str_arr'].join('\n'),
        first_tag_id:validate_data['first_tag_id']
      });
      return;
    }
    if (this.state.file.size > this.upload_max_filesize * 1024 * 1024){
      window.sessionStorage.setItem("alert_messages","ファイルサイズが" + this.upload_max_filesize + "MBを超えています");
      return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: "画像を登録しますか?",
    });
  }
  
  closeAlertModal = () => {
    this.setState({check_message: ''});
    $("#" + this.state.first_tag_id).focus();
  }

  closeModal = () => {
    this.setState({isOpenChangeTitleModal:false,})
  }
  
  register = () => {
    this.confirmCancel();
    this.openConfirmCompleteModal("アップロード中");
    const formData = new FormData();
    formData.append("img_file", this.state.file);
    formData.append("system_patient_id", this.state.system_patient_id);
    formData.append("patient_number", this.state.patient_number);
    formData.append("selected_genre", this.state.selected_genre);
    formData.append("image_title", this.state.image_title);
    formData.append("cur_date", formatDateLine(this.state.cur_date));
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    this.registering_flag = true;
    let path = "/app/api/v2/dial/medicine_information/uploadImage";
    apiClient
      .post(path, formData, config)
      .then((res) => {
        this.setState({ isConfirmComplete: false });
        var title = '';
        var message = res.alert_message;
        if (message.indexOf('変更') > -1) title = "変更完了##";
        if (message.indexOf('登録') > -1) title = "登録完了##";
        window.sessionStorage.setItem("alert_messages", title + res.alert_message);
        this.registering_flag = false;
        let system_patient_id = this.state.system_patient_id;
        let selected_genre = this.state.selected_genre;
        document.getElementsByClassName("fileInput")[0].value = "";
        document
          .getElementsByClassName("browse-file")[0]
          .getElementsByTagName("input")[0].value = "";
        this.setState({ file: null, is_loaded:true }, () => {
          this.getImageInfo(system_patient_id, selected_genre);
        });
        this.setChangeFlag(0);
      })
      .catch(() => {})
      .finally(() => {
        this.registering_flag = false;
        this.setState({ isConfirmComplete: false, image_title:''});
      });
  };
  
  _handleImageChange = (e) => {
    e.preventDefault();
    this.setChangeFlag(1);
    this.setState({ file: e.target.files[0] });
  };
  
  selectPatient = (patientInfo) => {
    this.setState({
      patientInfo: patientInfo,
      system_patient_id: patientInfo.system_patient_id,
      patient_number: patientInfo.patient_number,
      selected_genre: "",
      image_list: [],
    });
  };
  
  handleClick = (e, index) => {
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
      document
        .getElementById("image_list")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false },
          });
          document
            .getElementById("image_list")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - 200,
          y: e.clientY + window.pageYOffset - 70,
        },
        index: index,
      });
    }
  };

  changeTitle = (index) => {
    this.setState({
      isOpenChangeTitleModal:true,
      modal_data:this.state.image_list[index],
      selected_index:index,
    })
  }

  confirmChangeTitle = () => {
    this.closeModal();
    this.getImageInfo(this.state.system_patient_id, this.state.selected_genre);
  }
  
  contextMenuAction = (index) => {
    this.setState({
      isDeleteConfirmModal: true,
      confirm_message: "画像を削除しますか?",
      delete_id: this.state.image_list[index].number,
    });
  };
  
  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      delete_id: "",
    });
  }
  
  deleteData = async () => {
    if (this.state.delete_id !== "") {
      let data = {
        number: this.state.delete_id,
        system_patient_id: this.state.system_patient_id,
      };
      
      let path = "/app/api/v2/dial/medicine_information/deleteImage";
      apiClient
        .post(path, {
          params: data,
        })
        .then((res) => {
          window.sessionStorage.setItem("alert_messages", res.alert_message);
          this.getImageInfo(
            this.state.system_patient_id,
            this.state.selected_genre
          );
        })
        .catch(() => {});
    }
    this.confirmCancel();
  };
  
  getDate = (value) => {
    this.setChangeFlag(1);
    this.setState({ cur_date: value }, () => {
      this.getImageInfo(
        this.state.system_patient_id,
        this.state.selected_genre
      );
      sessApi.setObjectValue('for_left_sidebar', 'date', formatDateLine(this.state.cur_date));
    });
  };
  
  openConfirmCompleteModal = (message) => {
    this.setState({
      isConfirmComplete: true,
      complete_message: message,
    });
  };
  
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

  getInputText = (name, e) => {
    if (e.target.value != '' && e.target.value.length > 15){
      return;
    }
    this.setState({[name]:e.target.value});
  }
  
  render() {
    let genreMasterdata = [];
    if (this.state.genreMasterCode != undefined) {
      genreMasterdata = this.state.genreMasterCode;
    }
    let image_list = this.state.image_list;
    const ExampleCustomInput = ({ value, onClick }) => (
      <div className={"cur-date"} onClick={onClick}>
        {formatJapanDate(value)}
      </div>
    );
    return (
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
          <div className="title">画像登録</div>
          <SearchPart>
            <div className="sub-title-list">
              <div>登録日</div>
              {this.state.cur_date != "" && (
                <DatePicker
                  locale="ja"
                  selected={this.state.cur_date}
                  onChange={this.getDate.bind(this)}
                  dateFormat="yyyy/MM/dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dayClassName = {date => setDateColorClassName(date)}
                  customInput={<ExampleCustomInput />}
                />
              )}
            </div>
            <div className="sub-title-image">
              <div className={"label-folder"}>ファイル</div>
              <div className="flex browse-file">
                <form onSubmit={this.onFormSubmit}>
                  <input
                    className="fileInput"
                    type="file"
                    id='file_id'
                    onChange={(e) => this._handleImageChange(e)}
                  />
                  <button className={`submitButton ${this.state.change_flag == 0 ? "disable-btn":""}`} type="submit">
                    登録
                  </button>
                </form>
              </div>
              <div className='filename'>
                <label>タイトル(任意)</label>
                <input className='filename-input' value = {this.state.image_title} type='text' onChange = {this.getInputText.bind(this, 'image_title')}></input>
              </div>
            </div>
          </SearchPart>
          <div className="top-area flex">
            <div className="sub-title-list">画像ジャンル</div>
            {/* <div className="sub-title-image flex"> */}
              {/* <div className="checkbox-area left"> */}
                {/*<Checkbox*/}
                {/*label="全体ファイル選択"*/}
                {/*// getRadio={this.getRadio.bind(this)}*/}
                {/*value={this.state.allChecked}*/}
                {/*name="all_check"*/}
                {/*/>*/}
              </div>
              {/*<div className="right file_check_area flex">*/}
              {/*<label className="mr-2 gender-label">元ファイル</label>*/}
              {/*<RadioButton*/}
              {/*id="save"*/}
              {/*value={3}*/}
              {/*label="残す"*/}
              {/*name="gender"*/}
              {/*// getUsage={this.getMedicineCategory}*/}
              {/*// checked={this.state.category == 0 ? true : false}*/}
              {/*/>*/}
              {/*<RadioButton*/}
              {/*id="delete"*/}
              {/*value={4}*/}
              {/*label="削除する"*/}
              {/*name="gender"*/}
              {/*// getUsage={this.getMedicineCategory}*/}
              {/*// checked={this.state.category == 1 ? true : false}*/}
              {/*/>*/}
              {/*</div>                      */}
            {/* </div> */}
          {/* </div> */}
          <List>
            {genreMasterdata !== undefined &&
            genreMasterdata !== null &&
            genreMasterdata.length > 0 &&
            genreMasterdata.map((item) => {
              return (
                <>
                  <div
                    className={
                      this.state.selected_genre === item.number
                        ? "table-row selected-genre"
                        : "table-row"
                    }
                    onClick={() => this.selectGenre(item.number)}
                  >
                    {item.name}
                  </div>
                </>
              );
            })}
          </List>
          <Wrapper>
            <div className={"image-list"} id="image_list">
              {image_list != undefined &&
              image_list != null &&
              image_list.length > 0 &&
              image_list.map((item, index) => {
                if (item.imgBase64 !== "") {
                  return (
                    <>
                      <div className={"image-area"} onContextMenu={(e) => this.handleClick(e, index)}>
                        <div style={{lineHeight:'8rem'}}>
                          <img src={item.imgBase64} alt="" />
                        </div>
                        <div className='text-center'>{item.image_title != undefined && item.image_title!=null && item.image_title !=''?item.image_title:'タイトルなし'}</div>
                      </div>
                    </>
                  );
                }
                if (item.imgBase64 == "") {
                  return (
                    <>
                      <div className={"image-area"} onContextMenu={(e) => this.handleClick(e, index)}>
                        <div className='a-link' onClick = {this.downloadfile.bind(this, item.image_path, item.filename)}>
                          {formatDateSlash(formatDateTimeIE(item.updated_at))}
                        </div>
                      </div>
                    </>
                  );
                }
              })}
            </div>
            
            {this.state.isConfirmComplete !== false && (
              <CompleteStatusModal message={this.state.complete_message} />
            )}
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
              favouriteMenuType={this.state.favouriteMenuType}
              index={this.state.index}
            />
            {this.state.isDeleteConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.deleteData.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.isUpdateConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.register.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.check_message != "" && (
              <ValidateAlertModal
                handleOk={this.closeAlertModal}
                alert_meassage={this.state.check_message}
              />
            )}
            {this.state.isOpenChangeTitleModal && (
              <ChangeTitleModal
                closeModal = {this.closeModal}
                handleOk = {this.confirmChangeTitle}
                modal_data = {this.state.modal_data}
              />
            )}
          </Wrapper>
          {/*<div className="footer">*/}
          {/*<Button type="mono">登録</Button>*/}
          {/*<Button type="mono">新規作成</Button>*/}
          {/*<Button type="mono">90度回転</Button>*/}
          {/*<Button type="mono">削除</Button>*/}
          {/*</div>*/}
        </Card>
      </>
    );
  }
}

ImageRegist.propTypes = {
  history: PropTypes.object,
};
export default ImageRegist;
