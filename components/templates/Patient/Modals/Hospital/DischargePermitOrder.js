import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import * as apiClient from "~/api/apiClient";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import SelectDateModal from "./SelectDateModal"
import SelectReasonModal from "./SelectReasonModal"
import SelectDischargePath from "./SelectDischargePath"
import {formatDateLine} from "~/helpers/date";
import OutHospitalGroupDeleteModal from "../OutHospital/OutHospitalGroupDeleteModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import { harukaValidate } from "~/helpers/haruka_validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import Spinner from "react-bootstrap/Spinner";
import $ from 'jquery';
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  .flex{display:flex;}
  .content{
    width: 100%;
    margin-top: 20px;
    padding-left:5%;
    height: 230px;
  }
  .label-title{
    text-align: left;
    width: 120px;
    font-size: 1rem;
    margin-right: 8px;
    line-height: 38px;
    margin-top: 0;
    margin-bottom: 0;
   }
  .pullbox-label{
    width:300px;
    margin-bottom: 0;
    .pullbox-select{
      width:100%;
    }
  }
  .free-comment {
    input {
      width: calc(100% - 150px);
    }
  }
  .react-datepicker-wrapper {
    width: 300px;
    .react-datepicker__input-container {
        width: 100%;
        input {
            font-size: 18px;
            width: 100%;
            height: 38px;
            border-radius: 4px;
            border-width: 1px;
            border-style: solid;
            border-color: rgb(206, 212, 218);
            border-image: initial;
            padding: 0px 8px;
        }
    } 
  }
`;

class DischargePermitOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenSelectDate:false,
      isOpenSelectReason:false,
      isOpenSelectDischargePath:false,
      outcomeReasonList: [],
      dischargeRouteList: [],
      outcome_reason_id: 0,
      discharge_route_id: 0,
      discharge_date:new Date(),
      isOpenOutHospitalGroupDeleteModal: false,
      check_message: "",
      is_loaded: false,
      confirm_type:"",
      confirm_title:'',
      confirm_message:"",
      alert_type:"",
      alert_messages:"",
    };
    this.change_flag = 0;
    this.discharge_date = formatDateLine(new Date());
    this.discharge_date = new Date(this.discharge_date.split('-').join('/')+" 00:00:00");
    this.update_order = 0;
    this.can_register = false;
  }

  async UNSAFE_componentWillMount() {
    this.can_register = this.context.$canDoAction(this.context.FEATURES.DISCHARGE_PERMISSION, this.context.AUTHS.REGISTER)
      || this.context.$canDoAction(this.context.FEATURES.DISCHARGE_PERMISSION, this.context.AUTHS.REGISTER_PROXY);
    // get master data
    await this.getDischargeRoute();
    await this.getOutcomeReason();
  }

  async componentDidMount() {
    if(this.props.cache_index !== undefined && this.props.cache_index != null){
      this.loadFromCache();
    } else {
      await this.getDischargePermit();
    }
    document.getElementById("cancel_btn").focus();
  }

  loadFromCache = () => {
    let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_PERMIT);
    if (cache_data === undefined || cache_data == null) return;
    this.setState({
      outcome_reason_id: cache_data.outcome_reason_id,
      discharge_route_id: cache_data.discharge_route_id,
      discharge_date: new Date(cache_data.discharge_date),
      free_comment: cache_data.free_comment,
      hos_number:cache_data.hos_number,
      hos_detail_id:cache_data.hos_detail_id,
      department_id:cache_data.department_id,
      department_name:cache_data.department_name,
      last_doctor_code:cache_data.last_doctor_code,
      last_doctor_name:cache_data.last_doctor_name,
    });
  };

  getDischargePermit = async () => {
    if(this.props.modal_data == null){
      await apiClient.post("/app/api/v2/in_out_hospital/discharge_permit/get",{patient_id: this.props.patientId}).then(res=>{
        if(res.error_message !== undefined){
          this.setState({
            alert_type:"modal_close",
            alert_messages: res.error_message,
          });
        } else {
          let discharge_date = new Date();
          if(res.expected_discharge_date != null){
            this.update_order = 1;
            discharge_date = new Date(res.expected_discharge_date.split("-").join("/"));
            if(discharge_date.getTime() < this.discharge_date.getTime()){
              discharge_date = new Date();
            }
          }
          this.setState({
            discharge_date,
            outcome_reason_id: res.outcome_reason_id,
            discharge_route_id: res.discharge_route_id,
            free_comment: res.discharge_free_comment,
            hos_number:res.hos_number,
            hos_detail_id:res.hos_detail_id,
            department_id:res.department_id,
            department_name:res.department_name,
            last_doctor_code:res.last_doctor_code,
            last_doctor_name:res.last_doctor_name,
          });
        }
      })
        .catch(() => {

        });
    }
  };

  getDischargeRoute = async () => {
    // get master data
    let data = await apiClient.post("/app/api/v2/in_out_hospital/discharge_route/get");
    if (data != null && data != undefined && data.length > 0) {
      data.map(ele=>{
        ele.id = ele.number;
        ele.value = ele.name;
      });
      let selector_insert={id:0,value:''};
      data.unshift(selector_insert);
    }
    this.setState({
      dischargeRouteList: data
    });
  }

  getOutcomeReason = async () => {
    // get master data
    let data = await apiClient.post("/app/api/v2/in_out_hospital/outcome_reason/get");
    if (data != null && data != undefined && data.length > 0) {
      data.map(ele=>{
        ele.id = ele.number;
        ele.value = ele.name;
      });
      let selector_insert={id:0,value:''};
      data.unshift(selector_insert);
    }
    this.setState({
      outcomeReasonList: data,
      is_loaded: true,
    });
  }
  componentDidUpdate() {
    harukaValidate('karte', 'hospital', 'discharge_permit', this.state, 'background');
  }
  checkValidation = () => {
    let error_str_arr = [];
    let validate_data = harukaValidate('karte', 'hospital', 'discharge_permit', this.state);
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != "") {
      this.setState({ first_tag_id: validate_data.first_tag_id });
    }
    return error_str_arr;
  };
  closeValidateAlertModal = () => {
    this.setState({check_message: ""});
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };

  handleOk = () => {
    if (!this.context.$canDoAction(this.context.FEATURES.DISCHARGE_PERMISSION,this.context.AUTHS.REGISTER) && !this.context.$canDoAction(this.context.FEATURES.DISCHARGE_PERMISSION,this.context.AUTHS.REGISTER_PROXY)) {
      this.setState({alert_messages:'登録権限がありません。'});
      return;
    }
    if(this.validateDate() == false){
      return;
    }
    var error = this.checkValidation();
    if (error.length > 0) {
      this.setState({check_message: error.join("\n") });
      return;
    }
    this.setState({
      confirm_type:"register",
      confirm_title:'登録確認',
      confirm_message:"退院許可情報を登録しますか？",
    });
  };

  getOutcomeReasonName = (id = null) => {
    if (id == null || this.state.outcomeReasonList.length <= 0) return;

    let result = "";
    this.state.outcomeReasonList.map(item=>{
      if (item.id == id) {
        result = item.name;
      }
    });

    return result;
  }

  getDischargeRouteName = (id = null) => {
    if (id == null || this.state.dischargeRouteList.length <= 0) return;

    let result = "";
    this.state.dischargeRouteList.map(item=>{
      if (item.id == id) {
        result = item.name;
      }
    });

    return result;
  }

  register = async () => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let dischargePermitOrrder = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_PERMIT);
    let number = 0;
    let params = {
      patient_id: this.props.patientId,
      system_patient_id: this.props.patientId,
      department_id: this.state.department_id,
      department_name: this.state.department_name,
      done_order: 0,
      discharge_date: formatDateLine(this.state.discharge_date),
      outcome_reason_id: this.state.outcome_reason_id,
      outcome_reason_name: this.getOutcomeReasonName(this.state.outcome_reason_id),
      discharge_route_id: this.state.discharge_route_id,
      discharge_route_name: this.getDischargeRouteName(this.state.discharge_route_id),
      free_comment: this.state.free_comment,
      doctor_code:authInfo.staff_category == 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
      doctor_name:authInfo.staff_category === 1 ? authInfo.name : this.context.selectedDoctor.name,
      number: number,
      hos_number: this.state.hos_number,
      hos_detail_id: this.state.hos_detail_id,
      created_at: dischargePermitOrrder != null && dischargePermitOrrder != undefined && dischargePermitOrrder['created_at'] != null && dischargePermitOrrder['created_at'] != undefined ? dischargePermitOrrder['created_at'] : "",
      isForUpdate:this.update_order
    };
    if(this.update_order){
      params.last_doctor_code = this.state.last_doctor_code;
      params.last_doctor_name = this.state.last_doctor_name;
    }
    // save to cache
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.DISCHARGE_PERMIT, JSON.stringify(params), 'insert');
    this.context.$setExaminationOrderFlag(1);
    this.props.closeModal();

    /*let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let path = "/app/api/v2/in_out_hospital/add_out_hospital_date/register";
  const post_data = {
      params: {
        patient_id: this.props.patientId,
        department_id: this.context.department.code,
        discharge_date: this.state.discharge_date,
        outcome_reason_id: this.state.outcome_reason_id,
        discharge_route_id: this.state.discharge_route_id,
        free_comment: this.state.free_comment,
        doctor_code:authInfo.staff_category == 1 ? authInfo.doctor_code : this.context.selectedDoctor.code,
      }
  };
  await apiClient.post(path, post_data).then((res)=>{
    if(res)
          window.sessionStorage.setItem("alert_messages", res.alert_message);
      this.props.closeModal();
  });*/
  }

  getInputText = (index, e) => {
    if (e.target.value != '') return;
    this.change_flag = 1;
    switch(index){
      case 0:
        this.setState({discharge_date:''});
        break;
      case 1:
        this.setState({reason:''});
        break;
      case 2:
        this.setState({discharge_path:''});
        break;
    }
  }

  getFreeCommnet=(e)=>{
    this.change_flag = 1;
    this.setState({free_comment:e.target.value});
  }

  openSelectDate(){
    this.setState({
      isOpenSelectDate:true,
    })
  }

  openSelectReason(){
    this.setState({
      isOpenSelectReason:true,
    })
  }

  openSelectDischargePath (){
    this.setState({
      isOpenSelectDischargePath:true,
    })
  }

  closeModal=()=> {
    if(this.state.alert_type === "modal_close"){
      this.props.closeModal();
    }
    this.setState({
      isOpenSelectReason:false,
      isOpenSelectDate:false,
      isOpenSelectDischargePath:false,
      isOpenOutHospitalGroupDeleteModal:false,
      confirm_type:"",
      confirm_title:'',
      confirm_message:"",
      alert_messages:"",
    });
  }

  registerOutcomeReason = (outcomeReasonList) => {
    if (this.state.outcomeReasonList.length <= 0) return;
    let set_outcomeReasonList = "";
    let outcome_reason_id = 0;
    outcomeReasonList.map(item=>{
      if (item.selected == true) {
        set_outcomeReasonList += item.name + " ";
        outcome_reason_id = item.number;
      }
    });
    this.change_flag = 1;
    this.setState({
      reason:set_outcomeReasonList,
      isOpenSelectReason: false,
      outcome_reason_id
    });
  }

  registerDischargeRoute = (dischargeRouteList) => {
    if (this.state.dischargeRouteList.length <= 0) return;
    let set_dischargeRouteList = "";
    let discharge_route_id = 0;
    dischargeRouteList.map(item=>{
      if (item.selected == true) {
        set_dischargeRouteList += item.name + " ";
        discharge_route_id = item.number;
      }
    });
    this.change_flag = 1;
    this.setState({
      discharge_path:set_dischargeRouteList,
      isOpenSelectDischargePath: false,
      discharge_route_id
    });
  }

  registerOutHospitalDate = (outHospitalDate) => {
    this.change_flag = 1;
    this.setState({
      discharge_date: formatDateLine(outHospitalDate),
      isOpenSelectDate: false
    });
  }

  handleSearch = () => {
    this.setState({
      isOpenOutHospitalGroupDeleteModal: true
    });
  }

  setSelectorValue = (key,e) => {
    this.change_flag = 1;
    this.setState({[key]:parseInt(e.target.id)});
  };

  setDateValue = (key,value) => {
    this.change_flag = 1;
    this.setState({[key]:value});
  };

  validateDate=()=>{
    if(this.state.discharge_date == null || (this.state.discharge_date != null && this.state.discharge_date.getTime() < this.discharge_date.getTime())){
      this.setState({
        confirm_title:"日付エラー",
        alert_messages:"退院日は本日以降の日付を選択してください。"
      });
      return false;
    } else {
      return true;
    }
  }
  
  confirmCloseModal=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_type:"close_modal",
        confirm_title:'入力中',
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
      });
    } else {
      this.props.closeModal();
    }
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type === "close_modal"){
      this.props.closeModal();
    }
    if(this.state.confirm_type === "register"){
      this.register();
    }
  }

  render() {
    return  (
      <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>退院許可</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <Wrapper>
              <div className='sub-title'>退院情報</div>
              <div className='content'>
                {this.state.is_loaded ? (
                  <>
                    <div className="flex">
                      <div className={'label-title'}>退院日</div>
                      <DatePicker
                        locale="ja"
                        id='discharge_date_id'
                        selected={this.state.discharge_date}
                        onChange={this.setDateValue.bind(this,"discharge_date")}
                        dateFormat="yyyy/MM/dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        minDate={this.discharge_date}
                        onBlur={this.validateDate.bind(this)}
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    </div>
                    <div className="outcome-reason" style={{marginTop:"8px"}}>
                      <SelectorWithLabel
                        title="転帰理由"
                        options={this.state.outcomeReasonList}
                        getSelect={this.setSelectorValue.bind(this,"outcome_reason_id")}
                        departmentEditCode={this.state.outcome_reason_id}
                        id="outcome_reason_id_id"
                      />
                    </div>
                    <div className="discharge-route" style={{marginTop:"8px"}}>
                      <SelectorWithLabel
                        title="退院経路"
                        options={this.state.dischargeRouteList}
                        getSelect={this.setSelectorValue.bind(this,"discharge_route_id")}
                        departmentEditCode={this.state.discharge_route_id}
                        id="discharge_route_id_id"
                      />
                    </div>
                    <div className="free-comment">
                      <InputBoxTag
                        label="フリーコメント"
                        type="text"
                        getInputText={this.getFreeCommnet.bind(this)}
                        value={this.state.free_comment}
                        id="free_comment_id"
                      />
                      <div style={{float:'right',marginRight:"5%"}}>（25文字まで）</div>
                    </div>
                  </>
                ):(
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                )}
              </div>
            </Wrapper>
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.confirmCloseModal} className={"custom-modal-btn cancel-btn"} style={{cursor:"pointer"}} id='cancel_btn'>
            <span>キャンセル</span>
          </div>
          <div onClick={this.handleSearch} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}>
            <span>退院日時後のオーダー検索</span>
          </div>
          {this.can_register ? (
            <div onClick={this.handleOk} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}>
              <span>確定</span>
            </div>
          ):(
            <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
              <div className={"custom-modal-btn disable-btn"}><span>確定</span></div>
            </OverlayTrigger>
          )}
        </Modal.Footer>
        {this.state.isOpenSelectDate && (
          <SelectDateModal
            closeModal = {this.closeModal}
            registerOutHospitalDate = {this.registerOutHospitalDate}
          />
        )}
        {this.state.isOpenSelectReason && (
          <SelectReasonModal
            masterData={this.state.outcomeReasonList}
            registerOutcomeReason={this.registerOutcomeReason}
            closeModal = {this.closeModal}
          />
        )}
        {this.state.isOpenSelectDischargePath && (
          <SelectDischargePath
            masterData={this.state.dischargeRouteList}
            registerDischargeRoute={this.registerDischargeRoute}
            closeModal = {this.closeModal}
          />
        )}
        {this.state.isOpenOutHospitalGroupDeleteModal && (
          <OutHospitalGroupDeleteModal
            closeModal={this.closeModal}
            discharge_date={this.state.discharge_date}
            patientId={this.props.patientId}
          />
        )}
        {this.state.check_message !== "" && (
          <ValidateAlertModal
            handleOk={this.closeValidateAlertModal}
            alert_meassage={this.state.check_message}
          />
        )}
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm= {this.closeModal.bind(this)}
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.confirmOk}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_title}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            showTitle= {true}
            title = {this.state.confirm_title}
          />
        )}
      </Modal>
    );
  }
}

DischargePermitOrder.contextType = Context;
DischargePermitOrder.defaultProps = {
  modal_data: null
};
DischargePermitOrder.propTypes = {
  closeModal: PropTypes.func,
  patientId : PropTypes.number,
  modal_data : PropTypes.array,
  cache_index:PropTypes.number,
};
export default DischargePermitOrder;
