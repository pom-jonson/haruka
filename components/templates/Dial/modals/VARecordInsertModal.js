import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import RadioButton from "~/components/molecules/RadioInlineButton";
import { surface } from "~/components/_nano/colors";
import PropTypes from "prop-types";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import DialVANav from "../DialVANav";
import SelectPannelModal from "~/components/templates/Dial/Common/SelectPannelModal";
import DialSelectFacilityModal from "~/components/templates/Dial/Common/DialSelectFacilityModal";
import { formatDateLine } from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { Dial_VA_Version } from "~/helpers/dialConstants";
import { medicalInformationValidate } from '~/helpers/validate'
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import * as sessApi from "~/helpers/cacheSession-utils";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Card = styled.div`
  position: relative;
  overflow: hidden;
  margin: 0px;
  float: left;
  width: 100%;
  height: 100%;
  background-color: ${surface};
  padding: 0px;
  .footer {
    margin-top: 10px;
    text-align: center;
    margin-left: 0px !important;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }

    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
  }

  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }

  .clickable {
    cursor: pointer;
  }
`;

const Wrapper = styled.div`
  width: 100%;  
  // height: calc(100vh - 250px);
  height: 100%;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  // text-align: center;

  .content{        
    margin-top: 10px;
    overflow:hidden;
    overflow-y: auto;
    height: 100%;   
  }
  .flex {
    display: flex;    
    flex-wrap: wrap;
  }
  .example-custom-input{
      font-size: 18px;
      width:180px;
      text-align:center;
      padding-left: 15px;
      padding-right: 15px;
      padding-top: 5px;
      padding-bottom: 5px;
      border: 1px solid;
      margin-left:5px;
      margin-right:5px;
  }

  .div-style1{
    display: block;
    overflow: hidden;
    .label-type1{
      float: left;
    }
    .label-type2{
      float: right;
    }
  }

  .left-area {
    width: 40%;
    // height: 100%;
    height: 550px;
    padding: 10px;
    border-right: 1px solid;
    .block{
      margin-bottom: 10px;
      input, textarea{
        width:90%;
      }
      textarea{
        height:130px;
      }
      button{
        height: 38px;
        margin-top: 8px;
      }
      .hVAPNc{
        width: 80%;
      }  
    }
    .react-datepicker-wrapper{
      margin-top:-8px;
      input{
        height: 33px;
      }
    }
    .sub-title{
      margin-bottom: 5px;
      font-size: 17px;
    }
    .radio-btn{
      margin-right: 10px;
      label{
        font-size: 18px;
        margin-left: 5px;
        padding: 3px;
        margin-right: 5px;
        border: 1px solid lightgray;
        margin-bottom: 0px;
        border-radius: 0px;
      }
      
    }
    .label-title{
      display:none;
    }
    .history-list{
      margin-top: 20px;
      // height: 30%;
      overflow: hidden;
      height: 50%;      
    }
  }

  .right-area {
    width: 60%;    
    padding-left: 20px;
    height: 100%;
    overflow-y: auto;
    .div-paint{
      float:left;
      // width: 60%;
      width: 430px;
      height: 500px;
      overflow: hidden;
      border: 1px solid #ddd;
    }
    .sc-bdVaJa{
      border: 1px solid #ddd;
      padding-top: 5px;
      height: 100%;
    }

    .sc-htpNat {
      margin-top: -10px;
      background: none;
      font-size: 18px;
      border-bottom: 1px solid #ddd;
      .tab {
          border-bottom: solid 1px #ddd;
      }
      
    }    

  
  .text-left {
    text-align: left;
  }
  .text-right {
    text-align: right;
  }
  .label-box {
    font-size: 18px;
    border: 1px solid #a0a0a0;
  }
  .prev-session {    
    width: 65%;
    padding-left: 5%;
  }
  .pt-20 {
    padding-top: 20px;
  }
  .pt-10 {
    padding-top: 10px;
  }
  .pt-12 {
    padding-top: 12px;
  }
  .padding-top-5 {
    padding-top: 5px;
  }
  .wp-30 {
    width: 30%;
  }
  .wp-35 {
    width: 35%;
  }
  .wp-40 {
    width: 40%;
  }
  .wp-45 {
    width: 45%;
    cursor: pointer;
  }
  .wp-55 {
    width: 55%;
  }
  .wp-60 {
    width: 60%;
  }
  .wp-70 {
    width: 70%;
  }
  .hp-100 {
    height : 100%;
  }
  .footer {
    margin-top: 10px!important;
    button span {
        font-size: 20px;
    }
  }

  .table-view{
    border: 1px solid #ddd;
    overflow: hidden;
    height: 90%;
  }

  .div-double-content{
    width: 50%;
    display: block;
    overflow: hidden;
    float: left;
    margin-top: 10px;
  }
  .list-content{
    border: 1px solid #ddd;
    height: 200px;
    width: 100%;
  }

  .div-regist-content{
    height: 50%;
    .div-double-content{
      height: 95%;
    }
    .list-content{
      height: 90%;
    }
  }

  .arm-img{
    margin-top: 20px;
  }

  .history-item{
    padding: 5px;
  }

  .history-header{
    overflow: hidden;
    display: block;
    margin-bottom: 20px;
  }

  .header-item{
    width: 30%;
    float: left;
    margin-right: 30px;
    label {
        text-align: left;
        width: 60px;
        font-size: 18px;
        margin-top: 7px;
        margin-bottom: 0;
    }
    input {
        width: 64%;
        height: 35px;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 8px;
    }        
  }
 `;

const display_format = ["yyyy年MM月dd日", "yyyy年MM月", "yyyy年"];

class VARecordInsertModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    let type_date = 0;
    let date = "";
    if (modal_data != undefined && modal_data != null) {
      if (date != undefined && date != null) {
        type_date = 0;
        date = modal_data.date;
      } else if (modal_data.month != undefined && modal_data.month != null) {
        date =modal_data.year.toString() +"-" +("00" + modal_data.month.toString()).slice(-2)+"-01";
        type_date = 1;
      } else {
        date = modal_data.year.toString()+"-01-01";
        type_date = 2;
      }
    }
    this.double_click = false;
    this.state = {
      number: modal_data != null ? modal_data.number : 0,
      implemented_facilities:modal_data != null ? modal_data.implemented_facilities : "",
      comment: modal_data != null ? modal_data.comment : "",
      va_title_code: modal_data != null ? modal_data.va_title_code : "",
      patient_number: props.patient_number,
      date:date != undefined && date != null && date !== "" ? new Date(date) : "",
      date_type: type_date,
      category: this.props.kind === 1 ? "VA使用歴" : "VA処置歴",
      patient_id: this.props.patient_id,
      isShowVAModal: false,
      isShowFacilityModal: false,
      VA_codes: this.props.VA_codes,
      VA_surgery_codes: this.props.VA_surgery_codes,
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      confirm_alert_title:'',
      check_message:"",
      change_flag:0,
      alert_messages: "",
      alert_title: "",
      isConfirmComplete: false,
  
    };
    this.original = "";
    this.VANav = React.createRef();
  }

  componentDidMount() {
    this.setChangeFlag(0);
    this.original = JSON.stringify(this.state);
    this.changeBackground();
  }

  componentDidUpdate () {
    this.changeBackground();
  }

  changeBackground = () => {
    medicalInformationValidate(this.props.kind == 1 ? "va_usage_history" : "va_treatment_history", this.state, "background");
  }

  setChangeFlag=(change_flag)=>{
    this.setState({change_flag});    
  };

  getFacility = (e) => {
    this.setChangeFlag(1);
    this.setState({ implemented_facilities: e.target.value });
  };

  getComment = (e) => {
    this.setChangeFlag(1);
    this.setState({ comment: e.target.value });
  };

  getDate = (value) => {
    this.setChangeFlag(1);
    this.setState({
      date: value,
    });
  };

  setDateType = (e) => {
    this.setChangeFlag(1);
    this.setState({ date_type: e.target.value });
  };

  showVAModal = () => {
    this.setState({
      isShowVAModal: true,
    });
  };

  selectVA = (VA_item) => {
    this.setChangeFlag(1);
    this.setState({ va_title_code: VA_item.code });
    this.closeModal();
  };
  selectFacility = (item) => {
    this.setChangeFlag(1);
    this.setState({
      implemented_facilities: item,
      isShowFacilityModal: false,
    });
  };

  closeModal = () => {
    this.setState({ isShowVAModal: false });
  };

  showFacilityModal = () => {
    this.setState({
      isShowFacilityModal: true,
    });
  };
  closeFacilityModal = () => {
    this.setState({
      isShowFacilityModal: false,
    });
  };
  openConfirmCompleteModal = (message) => {
    this.setState({
      isConfirmComplete: true,
      complete_message: message,
    });
  };

  register = async () => {
    this.confirmCancel();
    let dataURL = this.VANav.current.stageRef.current.toDataURL();
    let postData = {...this.state};
    postData.imageBase64 = dataURL;
    postData.date = postData.date !="" ? formatDateLine(postData.date) : "";
    // post image version
    postData.image_version = Dial_VA_Version.version;
    if (this.props.modal_data != null) {
      // if edit image
      // post old image version
      postData.image_version = this.props.modal_data.image_version;
    }
    let path = "/app/api/v2/dial/medicine_information/VARecord/register";
    if (this.double_click == true) return;
    this.double_click = true;
    this.openConfirmCompleteModal("保存中");
    await apiClient
      .post(path, {
        params: postData,
      })
      .then((res) => {
        var title = '';
        var message = res.alert_message;
        if (message.indexOf('変更') > -1) title = "変更完了";
        if (message.indexOf('登録') > -1) title = "登録完了";
        this.setState({
          isConfirmComplete: false,
          complete_message: "",
          alert_messages: message,
          alert_title: title
        })
        this.setChangeFlag(0);
        sessApi.remove('dial_change_flag');
      })
      .catch(() => {
      })
      .finally(() => {
        this.double_click = false;
      });
  };

  handleInsert = async () => {
    if(this.state.change_flag == 0){
      return;
    }
    let validate_data = medicalInformationValidate(this.props.kind == 1 ? "va_usage_history" : "va_treatment_history", this.state);
    if (validate_data['error_str_arr'].length > 0 ) {
        this.setState({
          check_message:validate_data['error_str_arr'].join('\n'),
          first_tag_id:validate_data['first_tag_id']
        });
        return;
    }
    if (this.props.modal_data !== null) {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: this.state.category + "情報を変更しますか?",
      });
    } else {
      this.setState({
        isUpdateConfirmModal: true,
        confirm_message: this.state.category + "情報を登録しますか?",
      });
    }
  };

  closeAlertModal = () => {
    this.setState({check_message: ''});
    $("#" + this.state.first_tag_id).focus();
  }

  confirmCancel() {
    this.setState({
      isBackConfirmModal: false,
      isUpdateConfirmModal: false,
      confirm_message: "",
      confirm_alert_title:'',
    });
  }

  onHide = () => {};

  closeConfirmModal = () => {
    sessApi.remove('dial_change_flag');
    this.confirmCancel();
    this.props.closeModal();
  };
  
  alertOk = () => {
    this.setState({
      alert_messages:'',
      alert_title:'',
    });
    sessApi.remove('dial_change_flag');
    this.props.handleOk();
  }

  backModal = () => {
    if (this.state.change_flag == 1) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  };

  render() {
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="add_contact_dlg"
        className="master-modal exam-va-calc-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>
            {this.state.category}
            {this.props.modal_data != undefined && this.props.modal_data != null
              ? "編集"
              : "追加"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className="flex hp-100 content">
                  <div className="left-area">
                    <div className="date_block">
                      <div className="sub-title">日付</div>
                      <div className="flex">
                        <InputWithLabelBorder
                          type="date"
                          id='date_id'
                          getInputText={this.getDate.bind(this)}
                          diseaseEditData={this.state.date}
                          dateFormat={display_format[this.state.date_type]}
                        />
                        <RadioButton
                          id="0"
                          value={0}
                          label="年月日"
                          name="date_type"
                          getUsage={this.setDateType}
                          checked={this.state.date_type == 0 ? true : false}
                        />
                        <RadioButton
                          id="1"
                          value={1}
                          label="年月"
                          name="date_type"
                          getUsage={this.setDateType}
                          checked={this.state.date_type == 1 ? true : false}
                        />
                        <RadioButton
                          id="2"
                          value={2}
                          label="年"
                          name="date_type"
                          getUsage={this.setDateType}
                          checked={this.state.date_type == 2 ? true : false}
                        />
                      </div>
                    </div>

                    <div className="block date_block">
                      <div className="sub-title">
                        {this.props.kind === 1 ? "VA名称" : "処置内容"}
                      </div>
                      <div
                        className="clickable"
                        onClick={this.showVAModal.bind(this)}
                      >
                        {this.props.kind === 1 ? (
                          <InputBoxTag
                            label=""
                            type="text"
                            id='va_title_code_id'
                            placeholder="クリックしてコードを選択"
                            // getInputText={this.getEntryStaff.bind(this)}
                            value={
                              this.state.va_title_code != ""
                                ? this.state.VA_codes[this.state.va_title_code]
                                : ""
                            }
                          />
                        ) : (
                          <InputBoxTag
                            label=""
                            type="text"
                            id='va_title_code_id'
                            placeholder="クリックしてコードを選択"
                            // getInputText={this.getEntryStaff.bind(this)}
                            value={
                              this.state.va_title_code != ""
                                ? this.state.VA_surgery_codes[
                                    this.state.va_title_code
                                  ]
                                : ""
                            }
                          />
                        )}
                      </div>
                    </div>

                    <div className="block date_block">
                      <div className="sub-title">実施施設</div>
                      <div className="d-flex">
                        <InputBoxTag
                          label=""
                          type="text"
                          placeholder=""
                          getInputText={this.getFacility.bind(this)}
                          value={this.state.implemented_facilities}
                        />
                        <Button type="mono" onClick={this.showFacilityModal}>
                          検索
                        </Button>
                      </div>
                    </div>

                    <div className="block date_block">
                      <div className="sub-title">コメント</div>
                      <textarea
                        onChange={this.getComment.bind(this)}
                        value={this.state.comment}
                        id='comment_id'
                      />
                    </div>
                  </div>
                  <div className="right-area">
                    <DialVANav
                      ref={this.VANav}
                      img_version={
                        this.props.modal_data != null &&
                        this.props.modal_data.image_version != null
                          ? this.props.modal_data.image_version
                          : 0
                      }
                      imgBase64={
                        this.props.modal_data != null &&
                        this.props.modal_data.imgBase64 != null
                          ? this.props.modal_data.imgBase64
                          : null
                      }
                      handleChange={this.setChangeFlag}
                    />
                  </div>
                </div>
              </Wrapper>
            </DatePickerBox>
            {this.state.isShowVAModal && (
              <SelectPannelModal
                selectMaster={this.selectVA}
                closeModal={this.closeModal}
                MasterName={this.props.kind === 1 ? "VA名称" : "VA手術"}
              />
            )}
            {this.state.isShowFacilityModal && (
              <DialSelectFacilityModal
                selectMaster={this.selectFacility}
                closeModal={this.closeFacilityModal}
                MasterCodeData={this.state.facility_data}
                MasterName="実施施設"
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
            {this.state.isBackConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.closeConfirmModal}
                confirmTitle={this.state.confirm_message}
                title = {this.state.confirm_alert_title}
              />
            )}
            {this.state.check_message != "" && (
              <ValidateAlertModal
                handleOk={this.closeAlertModal}
                alert_meassage={this.state.check_message}
              />
            )}
  
            {this.state.alert_messages !== "" && (
              <AlertNoFocusModal
                hideModal= {this.alertOk.bind(this)}
                handleOk= {this.alertOk.bind(this)}
                showMedicineContent= {this.state.alert_messages}
                title={this.state.alert_title}
              />
            )}
            {this.state.isConfirmComplete !== false && (
              <CompleteStatusModal message={this.state.complete_message} />
            )}
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.backModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
            <span>キャンセル</span>
          </div>
          <div className={this.state.change_flag == 1 ? 'custom-modal-btn red-btn' : 'custom-modal-btn disable-btn'} onClick={this.handleInsert} style={{cursor:"pointer"}}>
            <span>{this.props.modal_data != undefined && this.props.modal_data != null ? "変更" : "登録"}</span>
          </div>
          {/* <Button className="cancel-btn" onClick={this.backModal}>キャンセル</Button>
          <Button className={this.state.change_flag == 1 ? 'red-btn' : 'disable-btn'} onClick={this.handleInsert}>
            {this.props.modal_data != undefined && this.props.modal_data != null ? "変更" : "登録"}
          </Button> */}
        </Modal.Footer>
      </Modal>
    );
  }
}

VARecordInsertModal.contextType = Context;

VARecordInsertModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  kind: PropTypes.string,
  VACodeData: PropTypes.object,
  VA_surgeryCodeData: PropTypes.object,
  VA_codes: PropTypes.object,
  VA_surgery_codes: PropTypes.object,
  modal_data: PropTypes.object,
  patient_id: PropTypes.number,
  patient_number: PropTypes.string,
};

export default VARecordInsertModal;
