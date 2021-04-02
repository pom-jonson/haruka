import React, { Component, useContext } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { WEEKDAYS, getVisitPlaceNameForModal } from "~/helpers/constants";
import {
  surface,
  secondary200,
  midEmphasis,
  disable
} from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import EndoscopeImageModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeImageModal";
import RehabilyOrderData from "~/components/templates/Patient/Modals/Rehabilitation/RehabilyOrderData";
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import axios from "axios";
import {Bar} from "~/components/styles/harukaBackgroundCss";
import CytologyExamOrderData from "../Patient/Modals/Examination/CytologyExamOrderData";
import RadiationData from "~/components/templates/Patient/components/RadiationData";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  
  flex-direction column;
  display: flex;
  text-align: center;
  .content{
    height: 100%;
  }
  .patient-info {
    text-align: right;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .rehabily-content{
      height: calc(100% - 8rem);
      overflow-y: auto;
      .order{
        border-right: 1px solid rgb(213, 213, 213);
        border-left: 1px solid rgb(213, 213, 213);
      }
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
 `;

const Col = styled.div`
  background-color: ${surface};
  width: 100%;
  height: 100%;
  -ms-overflow-style: auto;
  textarea {
    width: 100%;
    resize: none;
  }
  .data-item{
    border-bottom: 1px solid ${disable};
    background: rgb(160, 235, 255);
  }
  .data-header{
    background: rgb(105, 200, 225);
    color: white;
    padding: 4px 8px;
  }  
  .bottom-line{
    border-bottom: 1px solid rgb(213, 213, 213);
  }  
  .data-title{
    border: 1px solid rgb(213,213,213);
    cursor: pointer;
    .data-item{
      padding:10px;
    }
    .note{
      text-align: left;
    }
    .date{
      text-align: left;
    }
  }
  .department{
    font-size: 1rem;
  }
  .note{
    font-weight: bold;
  }
  .date{
    font-weight:bold
  }
  .doctor-name{
    font-size: 1rem;
    padding-right: 0.5rem;
  }
  .history-region{
    border-bottom: 1px solid rgb(213,213,213);
    font-size: 1rem;
    padding-right: 0.5rem;
  }
  .order{
    display: block !important;
  }
  .data-list{
    overflow: hidden;
    height: calc(100% - 2rem);
  }

  .soap-history-title{
    font-size: 0.8rem;
  }

  .low-title,
  .middle-title{
    background: #ddf8ff;
  }
  .facility-border{
    border-top: 1px solid rgb(213, 213, 213);
  }
  .tb-soap{
    width: 100%;
  
    th{
      background: #f6fcfd; 
    }

    textarea{
      background: white;
      color: black;
      height: 25px;
    }
  }
.disable-button {
    background: rgb(101, 114, 117);
    }

    ._color_alerted{
        .history-region{
          background: #ffe5c7;
        }
        .doctor-name{
          background: #ffe5c7;
        }
        .data-item{
          background: linear-gradient(#e8d2ac, #ffe6b8, #ffe6b8);
        }
      }
      ._color_received{
        .history-region{
          background: #dbffff;
        }
        .doctor-name{
          background: #dbffff; 
        }
    
        .data-item{
          background: linear-gradient(#bfefef, #c7f8f8, #c7f8f8);
        }
      }
      ._color_implemented{
        .history-region{
          background: #e5ffdb;
        }
        .doctor-name{
          background: #e5ffdb; 
        }
        .data-item{
          background: linear-gradient(#d0e6b5, #e6ffcb, #e6ffcb);
        }
      }
      ._color_not_implemented{
        .history-region{
          background: #ffe5ef;
        }
        .doctor-name{
          background: #ffe5ef; 
        }
        .data-item{
          background: linear-gradient(#eac1db, #ffd4f0, #ffd4f0);
        }
      }
`;

const MedicineListWrapper = styled.div`
  font-size: 0.8rem;
  height: calc(100% - 8rem);
  .history-item {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 1px;
  }
  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${disable};
    }
  }

  .box {
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 50px;
    }
    &:after {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 80px;
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }

  .phy-box{
    line-height: 1.3;
    position: relative;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 200px;
    }    

    .text-left{
      .table-item{
        width: 150px;
        float: left;
        text-align: right;
      }
    }
    .text-right{
      .table-item{
        text-align: left;
      }
    }

    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }

  .line-through {
    color: #ff0000;
  }

  .flex {
    display: flex;
    margin-bottom: 0;

    &.between {
      justify-content: space-between;

      div {
        margin-right: 0;
      }
    }

    div {
      margin-right: 8px;
    }

    .date {
      margin-left: auto;
      margin-right: 24px;
    }
  }

  .patient-name {
    margin-left: 1rem;
  }

  .drug-item {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }

  .number {
    margin-right: 8px;
    width: 75px;    
  }
  .number .rp{
    text-decoration-line: underline;
  }

  .unit{
    text-align: right;
  }

  .w80 {
    text-align: right;
    width: 80px;
    margin-left: 8px;
  }

  .option {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }

  .text-right {
    width: calc(100% - 88px);
  }

  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 80px);
    word-wrap: break-word;
  }

  .order-copy {
    background-color: transparent;
    border: 1px solid #ced4da;
    padding: 0 4px;
    min-width: auto;
    span {
      color: ${midEmphasis};
      font-weight: normal;
      letter-spacing: 0;
    }
  }

  .hidden {
    display: none;
  }

  p {
    margin-bottom: 0;
  }

  .doing {
    background: #ccc !important;

    .table-row {
      &:nth-child(2n) {
        background-color: #ccc;
      }
    }
  }
`;
const ContextMenuUl = styled.ul`
  margin-bottom:0;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.5rem;
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

const ContextMenu = ({ visible, x,  y,  parent, done_order}) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
  if (visible) {
      return (
          <ContextMenuUl>
              <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                {$canDoAction(FEATURES.RADIATION, AUTHS.EDIT_ORDER_STATE) && (
                    <>
                      {done_order == 1 && (
                        <>
                        <li><div onClick={() => parent.chagneStatus(0)}>未受付に戻す</div></li>
                        <li><div onClick={() => parent.chagneStatus(2)}>受付済みに戻す</div></li>
                        </>
                      )}
                      {done_order == 2 && (
                        <>
                        <li><div onClick={() => parent.chagneStatus(0)}>未受付に戻す</div></li>                        
                        </>
                      )}
                    </>
                  )}
              </ul>
          </ContextMenuUl>
      );
  } else {
      return null;
  }
};
class OrderDoneModal extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let departements = {};
    if (departmentOptions != undefined && departmentOptions.length > 0) {
      departmentOptions.map(item=>{
        departements[item.id] = item;
      })
    }
    this.state = {
      departmentOptions: departements,
      modal_type: this.props.modal_type,
      modal_title: this.props.modal_title,
      modal_data: this.props.modal_data,
      isOpenInspectionImageModal: false,
      confirm_message: "",

      isConfirmBackStatusModal:false,
      confirm_back_message:'',
      waring_message:''
    };
    let reception_disable, done_disable = false;
    if (this.props.modal_data !== undefined && this.props.modal_data.done_order !== undefined && (this.props.modal_data.done_order === 1 || this.props.modal_data.done_order === 2) && this.props.reception_or_done === "reception"){
      reception_disable = true;
    }
    if (this.props.modal_data !== undefined && this.props.modal_data.done_order !== undefined && this.props.modal_data.done_order === 1 && this.props.reception_or_done === "done"){
      done_disable = true;
    }
    this.reception_disable = reception_disable;
    this.done_disable = done_disable;
  }

  async componentDidMount() {
      await this.getDoctorsList();
  }

  chagneStatus = (changed_status) => {
    var confirm_back_message = '';
    var waring_message = '';
    var order_data = this.props.modal_data.order_data.order_data;    
    if (changed_status == 0){
      confirm_back_message = 'このオーダーを未受付に戻しますか？';
      if (order_data.done_order == 1){
        waring_message = '※ 実施の追加情報も消去されます。';
      }
    }
    if (changed_status == 2){
      confirm_back_message = 'このオーダーを受付済み(未実施)に戻しますか？';
      waring_message = '※ 実施の追加情報も消去されます'
    }
    if (confirm_back_message != ''){
      this.setState({
        isConfirmBackStatusModal:true,
        confirm_back_message,
        waring_message,
        changed_status,
      })
    }
  }

  confirmBackStatus = async() => {
    let number = this.props.modal_data.order_data.order_data.number;
    var order_data = this.props.modal_data.order_data.order_data;
    let path = "/app/api/v2/order/changeBackStatusRadiation";

    var current_done_flag = false;
    if (order_data.done_order == 1 && order_data.radiation_name != '他医撮影診断'){
      current_done_flag = true;
      order_data.done_comment = undefined;
      order_data.shoot_done_user = undefined;
      order_data.shoot_done_user_number = undefined;
      order_data.radiation_data.map(item => {
        item.kV = undefined;
        item.mA = undefined;
        item.sec = undefined;
        item.FFD = undefined;
        item['管電圧'] = undefined;
        item['トータル'] = undefined;
        item['曝射時間'] = undefined;
        item.done_selected_directions = [];
      })
      order_data.obtain_tech = undefined;
      
      order_data.done_height = undefined;
      order_data.done_weight = undefined;
      order_data.done_surface_area = undefined;
      order_data.done_shoot_count = undefined;
      order_data.done_formula_id = undefined;
    }

    order_data.done_order = this.state.changed_status;    
    let post_data = {
      type : this.props.modal_type,
      number,
      reception_or_done : this.props.reception_or_done,
      order_data : order_data,
      current_done_flag,
    };

    await apiClient._post(path, {params: post_data})
        .then(() => {
          var alert_message = '';
          if (this.state.changed_status == 0){
            alert_message = '未受付に変更しました。'
          }
          if (this.state.changed_status == 2){
            alert_message = '受付済みに戻しました。'
          }
          if (alert_message != ''){
            window.sessionStorage.setItem("alert_messages", alert_message);
          }
        })
        .catch(() => {
        });
    this.props.closeModal("change");
    if (this.props.handleNotDoneOk != undefined && this.props.handleNotDoneOk != null) this.props.handleNotDoneOk();
  }

  doneData = async() => {
      let number = this.props.modal_data.order_data.order_data.number;
      if(this.props.modal_type === 'examination'){
          number = this.props.modal_data.record_number;
      }
    let path = "/app/api/v2/order/orderComplete";
    let post_data = {
      type:this.props.modal_type,
      number,
      reception_or_done: this.props.reception_or_done
    };
    await apiClient._post(
        path,
        {params: post_data})
        .then((res) => {
          if(res){
            window.sessionStorage.setItem("alert_messages", res.alert_message);
          }
        })
        .catch(() => {
        });
    this.props.closeModal("change");
    if (this.props.handleNotDoneOk != undefined && this.props.handleNotDoneOk != null) this.props.handleNotDoneOk();
  };

  getWeekDay = dateStr => {
    let weekday = new Date(dateStr).getDay();
    return WEEKDAYS[weekday];
  }

  getDoctorName = (nDoctorConsented = -1, strDoctorName = "") => {

    if (nDoctorConsented == 4) {

      return `（過去データ取り込み）${strDoctorName}`;

    }
    if (nDoctorConsented == 2) {

      return strDoctorName;

    }else{

      if (nDoctorConsented == 1) {

        return `[承認済み] 依頼医: ${strDoctorName}`;

      }else{
        return  <div><span className='not-consented'>[未承認]</span> 依頼医: {strDoctorName}</div>;
      }
    }
  }

  confirmCancel() {
    this.setState({
      confirm_message: "",

      isConfirmBackStatusModal:false,
      confirm_back_message:'',
      waring_message:''
    });
  }

  confirmOk = () => {
    this.doneData();
    this.setState({
      confirm_message: "",
    });
  };

  openConfirm = () => {
    // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    // if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
    //     this.context.$selectDoctor(true);
    //     return;
    // }
    if (this.done_disable || this.reception_disable) return;

    this.setState({
      confirm_message: this.props.reception_or_done == "done" ? "実施しますか？":"受け付けますか？",
    });
  };

  getDoctor = e => {
      this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  };

  closeDoctor = () => {
      this.context.$selectDoctor(false);
  }

  selectDoctorFromModal = (id, name) => {
      let department_name = "その他";
      this.state.doctors.map(doctor => {
          if (doctor.doctor_code === parseInt(id)) {
              if (doctor.diagnosis_department_name !== "") {
                  department_name = doctor.diagnosis_department_name;
              }
          }
      });
      this.context.$updateDoctor(id, name, department_name);
      this.context.$selectDoctor(false);
      if (this.doctor_modal_flag == 0) return;
      this.setState({
          isVisitTreatmentPatientModal: true
      });
      this.doctor_modal_flag = 0;
  };

  getDoctorsList = async () => {
      let data = await apiClient.get("/app/api/v2/secure/doctor/search?");
      this.setState({ doctors: data });
  };

  getExamOrderTitleClassName = (done_order, karte_status_name) => {
    if (done_order == 0) {
      return karte_status_name =='入院・'? "_color_not_implemented_hospital" : "_color_not_implemented";
    }
    if (done_order == 1) {
      return karte_status_name =='入院・'? "_color_implemented_hospital" : "_color_implemented";
      
    }
    if (done_order == 2 || done_order == 3) {
      return karte_status_name =='入院・'? "_color_received_hospital" : "_color_received";      
    }
  }

  getOrderTitleClassName = (param_obj) => {
    if (param_obj.target_table == "order") {
      if (param_obj.is_doctor_consented != 4 && (param_obj.done_order == 0 || param_obj.done_order == 3)) {
        return param_obj.karte_status != 3? "_color_not_implemented" : "_color_not_implemented_hospital";        
      }
      if (param_obj.done_order == 1) {
        return param_obj.karte_status != 3? "_color_implemented" : "_color_implemented_hospital";        
      }
      if (param_obj.done_order == 2) {
        return param_obj.karte_status != 3? "_color_received" : "_color_received_hospital";
      }
    } else if(param_obj.target_table == "inspection_order") {
      if (param_obj.is_doctor_consented !== 4 && param_obj.state == 0) {
        return param_obj.karte_status != 3? "_color_not_implemented" : "_color_not_implemented_hospital";        
      }
      if ( param_obj.state == 2) {
        return param_obj.karte_status != 3? "_color_implemented" : "_color_implemented_hospital";        
      }
      if (param_obj.state == 1) {
        return param_obj.karte_status != 3? "_color_received" : "_color_received_hospital";        
      }
    } else if(param_obj.target_table == "treat_order_header") {
      if (param_obj.is_doctor_consented !== 4 && param_obj.state == 0) {
        return param_obj.karte_status != 3? "_color_not_implemented" : "_color_not_implemented_hospital";        
      }
      if (param_obj.done_order == 1) {
        return param_obj.karte_status != 3? "_color_implemented" : "_color_implemented_hospital";        
      }
      // if (param_obj.state == 2) {
      //   return "_color_received";
      // }
    }
    return "";
  }

  openInspectionImageModal = async (number, type=null) => {
    let path = "/app/api/v2/order/inspection/getImage";

    if (type == "radiation") {
      path = "/app/api/v2/order/radiation/getImage";
    }

    const { data } = await axios.post(path, {
      params: {
        number: number
      }
    });
    this.setState({
      endoscope_image: data,
      isOpenInspectionImageModal: true,
    });
  }

  closeModal = () => {
    this.setState({
      isOpenInspectionImageModal: false
    });
  }

  getHistoryInfo = (nHistoryLength = -1, strStuffName = "", strDateTime = "", nDoctorConsented = -1) => {
    let strHistory = "";
    nHistoryLength++;
    if (nHistoryLength < 10) {
      nHistoryLength = `0${nHistoryLength}`;
    }

    if (nDoctorConsented == 4) {
      return ""; 
    }
    if (nDoctorConsented == 2) {      
      strHistory = `${nHistoryLength}版 : ${strDateTime.substr(0, 4)}/${strDateTime.substr(5, 2)}/${strDateTime.substr(8, 2)} ${strDateTime.substr(11, 8)}`;
      return strHistory;
    } else{
      if (nDoctorConsented == 1) {
        strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        return strHistory;
      } else{
        strHistory = `${nHistoryLength}版 : ${strDateTime.substr(0, 4)}/${strDateTime.substr(5, 2)}/${strDateTime.substr(8, 2)} ${strDateTime.substr(11, 8)} 入力者 : ${strStuffName}`;
        if (nHistoryLength == 1) {
          strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;  
        }
        return strHistory;
      }
    }    
  }

  getDoneStatus (modal_data, modal_type) {    
    if (modal_data.is_doctor_consented != 4 && modal_data.done_order == 0) return modal_type == 'guidance'?'未実施':'未受付';
    if (modal_data.is_doctor_consented != 4 && modal_data.done_order == 2) return '受付済み';
    return '';
  }

  handleClick = (e) => {
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
          contextMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      // document
      //     .getElementById("code-table")
      //     .addEventListener("scroll", function onScrollOutside() {
      //       that.setState({
      //         contextMenu: { visible: false }
      //       });
      //       document
      //         .getElementById("code-table")
      //         .removeEventListener(`scroll`, onScrollOutside);
      //     });
      var obj_modal = document.getElementById('done-order-modal');      
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - obj_modal.offsetLeft,
          y: e.clientY + window.pageYOffset - obj_modal.offsetTop - 60,
        },
      });
    }
  }

  render() {
    const { modal_data, modal_title, modal_type} = this.props;
    var order_data = this.props.modal_data.order_data.order_data;
    var done_status = this.getDoneStatus(modal_data, modal_type);
    let karte_status_name = "外来・";
    if (modal_data.order_data != undefined && modal_data.order_data.order_data.karte_status != undefined) {
      karte_status_name = modal_data.order_data.order_data.karte_status == 1 ? "外来・" : modal_data.order_data.order_data.karte_status == 2 ? "訪問診療・" : modal_data.order_data.order_data.karte_status == 3 ? "入院・" : "";
    }
    return  (
        <Modal show={true} id="done-order-modal"  className="custom-modal-sm first-view-modal haruka-done-modal">
          <Modal.Header>
            <Modal.Title>{modal_title}{this.props.reception_or_done == "done"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              <Col id="soap_list_wrapper">
                <Bar>
                <div className="content">
                  {(modal_type == "rehabily") && (
                      <>
                          <div className={'patient-info'}>
                              {modal_data.patient_number} : {modal_data.patient_name}
                          </div>
                          <div className="data-list">
                          <div className={`data-title 
                            ${this.getOrderTitleClassName({target_table:modal_data.target_table,is_doctor_consented:modal_data.is_doctor_consented, done_order:modal_data.done_order, state:modal_data.order_data.order_data.state, is_enabled:modal_data.is_enabled, karte_status:modal_data.karte_status})}`}>
                                  <div className={'data-item'}>
                                      <div className="flex" style={{justifyContent:'space-between'}}>
                                        <div className="note">
                                          【{karte_status_name}{modal_title}】{done_status}                                          
                                        </div>
                                        <div className="department text-right">{this.state.departmentOptions[modal_data.order_data.order_data.department_id].value}</div>
                                      </div>
                                      <div className="date">
                                          {(modal_data.treatment_datetime !== undefined && modal_data.treatment_datetime != null && modal_data.treatment_datetime !== "") && (
                                              <>
                                                  {modal_data.treatment_datetime.substr(0, 4)}/
                                                  {modal_data.treatment_datetime.substr(5, 2)}/
                                                  {modal_data.treatment_datetime.substr(8, 2)}
                                                  ({this.getWeekDay(modal_data.treatment_datetime.substr(0,10))})
                                                  {' '}{modal_data.treatment_datetime.substr(11, 8)}
                                              </>
                                          )}
                                      </div>
                                  </div>
                                  {modal_data.history !== "" && modal_data.history != undefined &&
                                    modal_data.history !== null ? (
                                    <div className="history-region text-right middle-title">
                                      {this.getHistoryInfo(modal_data.history.split(",").length-1, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                                    </div>
                                  ):(
                                    <>
                                    {modal_data.is_doctor_consented !=2 && (
                                      <div className="history-region text-right middle-title">
                                      {this.getHistoryInfo(0, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                                    </div>
                                  )}
                                    </>
                                  )}
                                  <div className="doctor-name text-right low-title">
                                      {this.getDoctorName(modal_data.is_doctor_consented, modal_data['order_data']['order_data']['doctor_name'])}
                                  </div>
                                  {order_data != undefined && order_data.visit_place_id != undefined && order_data.visit_place_id > 0 && (
                                    <div className="doctor-name text-right low-title facility-border">
                                      {getVisitPlaceNameForModal(order_data.visit_place_id)}
                                    </div>
                                  )}
                              </div>
                              <RehabilyOrderData rehabily_data={modal_data.order_data.order_data} />
                          </div>
                      </>
                  )}

                  {(modal_type == "radiation") && (
                      <>
                          <div className={'patient-info'}>
                              {modal_data.patient_number} : {modal_data.patient_name}
                          </div>
                          <div className="data-list" onContextMenu={e => this.handleClick(e)}>
                          <div className={`data-title ${this.getOrderTitleClassName({target_table:modal_data.target_table,is_doctor_consented:modal_data.is_doctor_consented, done_order:modal_data.done_order, state:modal_data.order_data.order_data.state, is_enabled:modal_data.is_enabled,karte_status:modal_data.karte_status})}`}>
                                  <div className={'data-item'}>
                                    <div className="flex justify-content">
                                      <div className="note">
                                        【{karte_status_name}放射線&nbsp;&nbsp;{modal_data.sub_category}】{done_status}
                                        
                                      </div>
                                      <div className="department text-right">{this.state.departmentOptions[modal_data.order_data.order_data.department_id].value}</div>
                                    </div>
                                      <div className="date">
                                          {(modal_data.treatment_datetime !== undefined && modal_data.treatment_datetime != null && modal_data.treatment_datetime !== "") && (
                                              <>
                                                  {modal_data.treatment_datetime.substr(0, 4)}/
                                                  {modal_data.treatment_datetime.substr(5, 2)}/
                                                  {modal_data.treatment_datetime.substr(8, 2)}
                                                  ({this.getWeekDay(modal_data.treatment_datetime.substr(0,10))})
                                                  {' '}{modal_data.treatment_datetime.substr(11, 8)}
                                              </>
                                          )}
                                      </div>
                                  </div>
                                  {modal_data.history !== "" && modal_data.history != undefined &&
                                    modal_data.history !== null ? (
                                    <div className="history-region text-right middle-title">
                                      {this.getHistoryInfo(modal_data.history.split(",").length-1, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                                    </div>
                                  ):(
                                    <>
                                    {modal_data.is_doctor_consented !=2 && (
                                      <div className="history-region text-right middle-title">
                                      {this.getHistoryInfo(0, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                                    </div>
                                  )}
                                    </>
                                  )}
                                  <div className="doctor-name text-right low-title">
                                      {this.getDoctorName(modal_data.is_doctor_consented, modal_data['order_data']['order_data']['doctor_name'])}
                                  </div>
                                  {order_data != undefined && order_data.visit_place_id != undefined && order_data.visit_place_id > 0 && (
                                    <div className="doctor-name text-right low-title facility-border">
                                      {getVisitPlaceNameForModal(order_data.visit_place_id)}
                                    </div>
                                  )}
                              </div>
                              <MedicineListWrapper onContextMenu={e => this.handleClick(e)}>
                                <RadiationData
                                  data = {modal_data.order_data.order_data}
                                />
                              </MedicineListWrapper>
                          </div>
                      </> 
                  )}

                  {(modal_type == "guidance") && (
                      <>
                          <div className={'patient-info'}>
                              {modal_data.patient_number} : {modal_data.patient_name}
                          </div>
                          <div className="data-list">
                              <div className={`data-title 
                                ${this.getOrderTitleClassName({target_table:modal_data.target_table,is_doctor_consented:modal_data.is_doctor_consented, done_order:modal_data.done_order, state:modal_data.order_data.order_data.state, is_enabled:modal_data.is_enabled, karte_status:modal_data.karte_status})}`}>
                                  <div className={'data-item'}>
                                      <div className="flex" style={{justifyContent:'space-between'}}>
                                          <div className="note">
                                            【{karte_status_name}{modal_title}】{done_status}                                            
                                          </div>
                                          <div className="department text-right">{this.state.departmentOptions[modal_data.order_data.order_data.department_id].value}</div>
                                      </div>
                                      <div className="date">
                                          {(modal_data.treatment_datetime !== "" && modal_data.treatment_datetime != null && modal_data.treatment_datetime !== "") && (
                                              <>
                                                  {modal_data.treatment_datetime.substr(0, 4)}/
                                                  {modal_data.treatment_datetime.substr(5, 2)}/
                                                  {modal_data.treatment_datetime.substr(8, 2)}
                                                  ({this.getWeekDay(modal_data.treatment_datetime.substr(0,10))})
                                                  {' '}{modal_data.treatment_datetime.substr(11, 8)}
                                              </>
                                          )}
                                      </div>
                                  </div>
                                  {modal_data.history !== "" && modal_data.history != undefined &&
                                    modal_data.history !== null ? (
                                    <div className="history-region text-right middle-title">
                                      {this.getHistoryInfo(modal_data.history.split(",").length-1, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                                    </div>
                                  ):(
                                    <>
                                    {modal_data.is_doctor_consented !=2 && (
                                      <div className="history-region text-right middle-title">
                                      {this.getHistoryInfo(0, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                                    </div>
                                  )}
                                    </>
                                  )}
                                  <div className="doctor-name text-right low-title">
                                      {this.getDoctorName(modal_data.is_doctor_consented, modal_data['order_data']['order_data']['doctor_name'])}
                                  </div>
                              </div>
                              <MedicineListWrapper>
                                  <div className="history-item">
                                      <div className="phy-box w70p" draggable="true">
                                          <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                  <div className="table-item">分類</div>
                                              </div>
                                              <div className="text-right">
                                                  <div className="table-item remarks-comment">{modal_data.order_data.order_data.classific_name}</div>
                                              </div>
                                          </div>
                                          {modal_data.order_data.order_data.classific_detail_id != undefined && (
                                              <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                      <div className="table-item">分類詳細</div>
                                                  </div>
                                                  <div className="text-right">
                                                      <div className="table-item remarks-comment">{modal_data.order_data.order_data.classific_detail_name}</div>
                                                  </div>
                                              </div>
                                          )}
                                          {modal_data.order_data.order_data.comment != undefined && (
                                              <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                      <div className="table-item">コメント</div>
                                                  </div>
                                                  <div className="text-right">
                                                      <div className="table-item remarks-comment">{modal_data.order_data.order_data.comment}</div>
                                                  </div>
                                              </div>
                                          )}
                                          {modal_data.order_data.order_data.details !== undefined && modal_data.order_data.order_data.details != null && modal_data.order_data.order_data.details.length>0 && modal_data.order_data.order_data.details.findIndex(x=>x.is_enabled==1) > -1 && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-left">
                                                <div className="table-item"> </div>
                                              </div>
                                              <div className="text-right">
                                                <div className="table-item remarks-comment">
                                                  {modal_data.order_data.order_data.details.map(detail=>{
                                                    if(detail.is_enabled === undefined || (detail.is_enabled !== undefined && detail.is_enabled == 1)){
                                                      return(
                                                        <>
                                                          <div><label>・{detail.item_name}
                                                            {((detail.value1 != undefined && detail.value1 != null && detail.value1 !== "") || (detail.value2 != undefined && detail.value2 != null && detail.value2 !== ""))? "：": ""}</label>
                                                            {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                              <><label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}</label><br /></>
                                                            )}
                                                            {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                              <><label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}</label><br /></>
                                                            )}
                                                          </div>
                                                        </>
                                                      )
                                                    }
                                                  })}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                      </div>
                                  </div>
                              </MedicineListWrapper>
                          </div>
                      </>
                  )}

                  {(modal_type === 'examination') && (
                      <>
                          <div className={'patient-info'}>
                              {modal_data.patient_number} : {modal_data.patient_name}
                          </div>
                          <div className="data-list">
                              <div className={`data-title ${this.getExamOrderTitleClassName(modal_data.done_order, karte_status_name)}`}>
                                  <div className={'data-item'}>
                                      <div className="flex" style={{justifyContent:'space-between'}}>
                                          <div className="note">
                                            【{karte_status_name}{modal_title}】
                                          </div>
                                          <div className="department text-right">{this.state.departmentOptions[modal_data['order_data']['order_data']['department_code']]['value']}</div>
                                      </div>
                                      <div className="date">
                                          {(modal_data.updated_at !== "" && modal_data.updated_at != null && modal_data.updated_at !== "") && (
                                              <>
                                                  {modal_data.updated_at.substr(0, 4)}/
                                                  {modal_data.updated_at.substr(5, 2)}/
                                                  {modal_data.updated_at.substr(8, 2)}
                                                  ({this.getWeekDay(modal_data.updated_at.substr(0,10))})
                                                  {' '}{modal_data.updated_at.substr(11, 8)}
                                              </>
                                          )}
                                      </div>
                                  </div>
                                  {modal_data.history !== "" && modal_data.history != undefined &&
                                    modal_data.history !== null ? (
                                    <div className="history-region text-right middle-title">
                                      {this.getHistoryInfo(modal_data.history.split(",").length-1, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                                    </div>
                                  ):(
                                    <>
                                    {modal_data.is_doctor_consented !=2 && (
                                      <div className="history-region text-right middle-title">
                                      {this.getHistoryInfo(0, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                                    </div>
                                  )}
                                    </>
                                  )}
                                  <div className="doctor-name text-right low-title">
                                      {this.getDoctorName(modal_data.is_doctor_consented, modal_data['order_data']['order_data']['doctor_name'])}
                                  </div>                                  
                              </div>
                              <MedicineListWrapper>
                                  <div className={'history-item soap-data-item'}>
                                      <div className="history-item">
                                          <div className="phy-box w70p" draggable="true">
                                              <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                      <div className="table-item">検査日時</div>
                                                  </div>
                                                  <div className="text-right">
                                                      <div className="table-item remarks-comment">
                                                          {modal_data.order_data.order_data.collected_date === "" ? "次回診察日" : modal_data.order_data.order_data.collected_time === "" ? modal_data.order_data.order_data.collected_date.split("-").join("/") : modal_data.order_data.order_data.collected_date.split("-").join("/")+"  "+modal_data.order_data.order_data.collected_time.substr(0,modal_data.order_data.order_data.collected_time.length-3)}
                                                      </div>
                                                  </div>
                                              </div>
                                              <div className="flex between drug-item table-row">
                                                  <div className="text-left">
                                                      <div className="table-item">検査項目</div>
                                                  </div>
                                                  <div className="text-right">
                                                      <div className="table-item remarks-comment">
                                                          {modal_data.order_data.order_data.examinations.map((item)=> {
                                                              return (
                                                                  <>
                                                                      <div className={'table-item'}>{item.urgent != undefined && item.urgent == 1? "【至急】": ""}{item.name}</div>
                                                                  </>
                                                              )
                                                          })}
                                                      </div>
                                                  </div>
                                              </div>
                                              {modal_data.order_data.order_data.subject != undefined && modal_data.order_data.order_data.subject != null && modal_data.order_data.order_data.subject != '' && (
                                                <>
                                                  <div className="flex between drug-item table-row">
                                                    <div className="text-left">
                                                      <div className="table-item">概要</div>
                                                    </div>
                                                    <div className="text-right">
                                                      <div className="table-item remarks-comment">{modal_data.order_data.order_data.subject}</div>
                                                    </div>
                                                  </div>
                                                </>
                                              )}
                                              {modal_data.order_data.order_data.free_instruction != undefined && modal_data.order_data.order_data.free_instruction.length > 0 && (
                                                <>
                                                  <div className="flex between drug-item table-row">
                                                      <div className="text-left">
                                                          <div className="table-item">自由入力オーダー</div>
                                                      </div>
                                                      <div className="text-right">
                                                          <div className="table-item remarks-comment">
                                                              {modal_data.order_data.order_data.free_instruction.map((item)=> {
                                                                  return (
                                                                      <>
                                                                          <div className={'table-item'}>{item.urgent != undefined && item.urgent == 1? "【至急】": ""}{item.text}</div>
                                                                      </>
                                                                  )
                                                              })}
                                                          </div>
                                                      </div>
                                                  </div>
                                                </>
                                              )}
                                              <CytologyExamOrderData cache_data={modal_data.order_data.order_data}  from_source={"detail-modal"}/>
                                              {modal_data.order_data.order_data.todayResult === 1 && (
                                                  <div className="flex between drug-item table-row">
                                                      <div className="text-left">
                                                          <div className="table-item">当日結果説明</div>
                                                      </div>
                                                      <div className="text-right">
                                                          <div className="table-item remarks-comment">あり</div>
                                                      </div>
                                                  </div>
                                              )}
                                              {modal_data.order_data.order_data.order_comment !== "" && (
                                                  <div className="flex between drug-item table-row">
                                                      <div className="text-left">
                                                          <div className="table-item">依頼コメント</div>
                                                      </div>
                                                      <div className="text-right">
                                                          <div className="table-item remarks-comment">
                                                              {modal_data.order_data.order_data.order_comment_urgent != undefined && modal_data.order_data.order_data.order_comment_urgent == 1?"【至急】":""}
                                                              {modal_data.order_data.order_data.fax_report != undefined && modal_data.order_data.order_data.fax_report == 1?"【FAX報告】":""}
                                                              {modal_data.order_data.order_data.order_comment}</div>
                                                      </div>
                                                  </div>
                                              )}
                                              {modal_data.order_data.order_data.free_comment !== "" && (
                                                  <div className="flex between drug-item table-row">
                                                      <div className="text-left">
                                                          <div className="table-item">フリーコメント</div>
                                                      </div>
                                                      <div className="text-right">
                                                          <div className="table-item remarks-comment">{modal_data.order_data.order_data.free_comment}</div>
                                                      </div>
                                                  </div>
                                              )}

                                              {modal_data.order_data.order_data.additions != undefined && Object.keys(modal_data.order_data.order_data.additions).length > 0 && (
                                                  <>

                                                      <div className="flex between drug-item table-row">
                                                          <div className="text-left">
                                                              <div className="table-item">追加指示等</div>
                                                          </div>
                                                          <div className="text-right">
                                                              <div className="table-item remarks-comment"></div>
                                                          </div>
                                                      </div>
                                                      {Object.keys(modal_data.order_data.order_data.additions).map(addition=>{
                                                          return (
                                                              <div className="flex between drug-item table-row" key={addition}>
                                                                  <div className="text-left">
                                                                      <div className="table-item">追加指示等</div>
                                                                  </div>
                                                                  <div className="text-right">
                                                                      <div className="table-item remarks-comment">
                                                                          {modal_data.order_data.order_data.additions[addition].name}
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          )
                                                      })}
                                                  </>
                                              )}

                                          </div>
                                      </div>
                                  </div>
                              </MedicineListWrapper>
                          </div>
                      </>
                  )}
                </div>
                </Bar>
              </Col>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <div
              onClick={this.props.closeModal}
              className={this.state.curFocus === 1 ? "custom-modal-btn cancel-btn focus " : "custom-modal-btn cancel-btn"}
              style={{cursor:"pointer"}}
            >
              <span>{this.props.from_page == "outhospital_delete" ? "閉じる" : "キャンセル"}</span>
            </div>
            {this.props.only_close_btn != true && (
              <>
                {(modal_data.done_order !== undefined && modal_data.done_order != null && modal_data.done_order === 1) ? (
                    <></>
                ):(
                  <div     
                    id="system_confirm_Ok"            
                    className={(this.reception_disable || this.done_disable) ? "custom-modal-btn disable-btn" : "custom-modal-btn red-btn"}
                    onClick={this.openConfirm.bind(this)}
                    style={{cursor:"pointer"}}
                  >
                    <span>{this.props.reception_or_done == "done" ? "実施":"受付済み"}</span>
                  </div>
                )}
              </>
            )}
          </Modal.Footer>
          {this.state.isOpenInspectionImageModal == true && (
            <EndoscopeImageModal
              closeModal={this.closeModal}
              imgBase64={this.state.endoscope_image}
            />
          )}
          {this.state.confirm_message !== "" && (
              <SystemConfirmJapanModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.confirmOk.bind(this)}
                  confirmTitle= {this.state.confirm_message}
              />
          )}

          {this.state.isConfirmBackStatusModal && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmBackStatus.bind(this)}
              confirmTitle= {this.state.confirm_back_message}
              waring_message = {this.state.waring_message}
            />
          )}

          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            done_order = {modal_data.done_order}
          />

          {this.state.doctors != undefined && this.context.needSelectDoctor === true ? (
              <SelectDoctorModal
                  closeDoctor={this.closeDoctor}
                  getDoctor={this.getDoctor}
                  selectDoctorFromModal={this.selectDoctorFromModal}
                  doctors={this.state.doctors}
              />
          ) : (
              ""
          )}
        </Modal>
    );
  }
}

OrderDoneModal.contextType = Context;

OrderDoneModal.propTypes = {
  closeModal: PropTypes.func,
  modal_type: PropTypes.string,
  modal_title: PropTypes.string,
  modal_data: PropTypes.object,
  only_close_btn: PropTypes.bool,
  reception_or_done: PropTypes.string,
  from_page: PropTypes.string,
  handleNotDoneOk:PropTypes.func,
};

export default OrderDoneModal;