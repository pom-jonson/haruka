import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import {
  surface,
  secondary200,
  midEmphasis,
  disable
} from "~/components/_nano/colors";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {formatDate} from "~/helpers/date";
import axios from "axios";
import {Bar} from "~/components/styles/harukaBackgroundCss";
// import DatePicker, { registerLocale } from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import CalcDaysChange from "~/components/molecules/CalcDaysChange";

const underLine = {
  textDecorationLine: "underline"
};

const textAlignRight = {
  textAlign: "right"
};

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;

  .patient-info {
    text-align: right;
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  flex-direction: column;
  display: flex;
  text-align: center;
  .content{
    height: 57vh;
    overflow-y: hidden;
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
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

const Col = styled.div`
  background-color: ${surface};
  width: 100%;
  max-height: calc(100vh - 182px);
  overflow-y: hidden;
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
  }

  .time-area{
    input{
      width: 6rem;
    }
  }

  .soap-history-title{
    font-size: 0.8rem;
  }

  .low-title,
  .middle-title{
    background: #ddf8ff;
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

  .rehabily-content{
    .phy-box{
      border-left: 1px solid #ddd;
      border-right: 1px solid #ddd;
    }
  }
  .rehabily-container{
    height:calc(57vh - 1rem);
    overflow-y:auto;
  }
`;

const ContextMenuUl = styled.ul`
  margin-bottom: 0px;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({ visible, x, y, parent,}) => {
  if (visible) {        
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>          
          <li onClick={() => parent.contextMenuAction("cancelDone")}><div>実施の取り消し</div></li>            
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const MedicineListWrapper = styled.div`
  font-size: 12px;
  height:calc(57vh - 10rem);
  overflow-y:auto;
  .no-bottom{
    label{
      margin-bottom: 0px !important;
    }
  }
  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${disable};
    }
  }
  .function-region{
    border-bottom: 1px solid #ddd;
    overflow: hidden;
    .function-region-name{
      width: 100%;
      float: left;
      padding: 5px;
      word-break: break-all;
    }
  }

  .in-input-area{
    input{
      pointer-events: none;
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
    width: 60px;
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

  .content-border{
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-top: 1px solid #ddd;
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
  .prescription-body-part {
    width: 100%;
    padding-left: 4.5rem;
  }
  .item-details{
    text-align:left;
  }
  .item-details:last-child{
    border-bottom: 1px solid #ddd;
  }
`;

class InjectionInInputModal extends Component {
  constructor(props) {
    super(props);
    let done_time_show = false;
    if (this.props.selected_order.order_data.is_completed == 4 && this.props.selected_order.order_data.order_data[0].done_numbers !== undefined && this.props.selected_order.rp_index != undefined ) {
      let cnt_index = this.props.selected_order.cnt_index;
      let schedule_date = this.props.selected_order.schedule_date;      
      let execute_info = this.props.selected_order.order_data.order_data[0].done_numbers[schedule_date][cnt_index];
      if (execute_info !== undefined && execute_info.time != undefined && execute_info.time == "") {
        done_time_show=true;
      }
    }
    this.state = {
      modal_type: this.props.order_type,
      modal_data: this.props.selected_order,
      isOpenInspectionImageModal: false,
      openTimeSetModal: false,
      isCalcModalOpen: false,
      confirm_message: "",
      detailedInsuranceInfo: [],
      confirm_type: "",
      confirm_done_time: "",
      alert_messages: "",
      done_time_show,
      confirm_in_modal: "",
      rp_key: null,
      medicine_key: null,
    }
  }
  
  async componentDidMount(){
    await this.getInsuranceInfo();    
  }
  
  getInsurance = type => {
    let insurance = "既定";
    // if (this.props.patientInfo.insurance_type_list) {
    if (this.state.detailedInsuranceInfo && this.state.detailedInsuranceInfo.length > 0) {
      this.state.detailedInsuranceInfo.map(item => {
        if (item.insurance_type_number === parseInt(type)) {
          insurance = item.insurance_type;
        }
      });
    }
    return insurance;
  };
  
  getInsuranceInfo = async () => {
    if (this.props.patientId > 0) {
      let data = await axios.get("/app/api/v2/karte/patient_datailed", {
        // パラメータ
        params: {
          systemPatientId: this.props.patientId
        }
      });
      this.setState({
        detailedInsuranceInfo: data.data.insurance_pattern
      });
    }
  }
  
  getInsuranceName = (_insuranceName) => {
    let result = "既定";
    
    if (_insuranceName == undefined || _insuranceName == null || _insuranceName == "") return result;
    
    return _insuranceName
  }
  
  doneData = async() => {
    if (this.state.done_time_show && this.state.confirm_done_time == "") {
      this.setState({alert_messages: "実施時間を設定を選択してください。"});
      return;
    }
    this.setState({
      confirm_message: "実施しますか？",
      confirm_type: "_doneOrder"
    });
  }
  
  getUnevenValues = (values, unit) => {
    let unevenValues = [];
    values.map(splitNum => {
      if (splitNum.value !== undefined) {
        unevenValues.push(splitNum.label + " " + splitNum.value + unit);
      }
    });
    return unevenValues.join(",");
  };
  
  confirmOk = async() => {
    this.confirmCancel();    
  }
  
  confirmCancel() {
    this.setState({
      confirm_message: "",
      confirm_type: "",
      confirm_in_modal: "",
      alert_messages: ""
    });
  }

  contextMenuAction = (act) => {
    if (act == "cancelDone") {
      this.setState({        
        confirm_title: "実施の取り消し確認",
        confirm_message: "実施を取り消しますか？",
        confirm_action:act,
        confirm_in_modal: "menu_in_modal"        
      });
    }
  };

  confirmCancelDoneOk = () => {
    // let path = "/app/api/v2/order/examination/change_state";    
  }

  handleClick = e => {    
    if (this.state.modal_type != "injection") return;
    if (!(this.state.modal_data.done_order !== undefined && this.state.modal_data.done_order != null && this.state.modal_data.done_order === 1 && this.state.modal_data.order_data.is_completed == 4)) return;
    if (!this.context.$canDoAction(this.context.FEATURES.PERIOD_INJECTION, this.context.AUTHS.INJECTION_DONE_TO_NOT_DONE)) return;
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
      document
        .getElementById("done-order-modal")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("done-order-modal")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("done-order-modal").offsetLeft,
          y: e.clientY - document.getElementById("done-order-modal").offsetTop - 100,
        }
      });
    }
  }  

  /*handleInInputAmount = (rp_key, medicine_key, event) => {
    console.log("handleInInputAmount rp_key, medicine_key", rp_key, medicine_key);
    console.log("event.target.value", event.target.value);
    // modal_data.order_data.order_data
    // let modal_data = this.state.modal_data;
    // let order_data = modal_data.order_data.order_data;
    // order_data[rp_key][medicine_key].in_input_amount = event.target.value
  }*/

  openInInputCalcModal = (rp_key, medicine_key) => {
    this.setState({
      isCalcModalOpen: true,
      rp_key: rp_key,
      medicine_key: medicine_key
    });
  }

  closeCalcModal = () => {
    this.setState({
      isCalcModalOpen: false,
      rp_key: null,
      medicine_key: null
    });
  }
  
  confirmCalc = (nValue) => {    
    if (this.state.rp_key != null && this.state.medicine_key != null) {
      let modal_data = this.state.modal_data;
      let order_data = modal_data.order_data.order_data;
      order_data[this.state.rp_key]['med'][this.state.medicine_key].in_input_amount = nValue;
      modal_data.order_data.order_data = order_data;
      this.setState({
        modal_data: modal_data        
      },()=>{
        this.closeCalcModal();
      });
    } else {
      this.closeCalcModal();
    }
  }

  handleConfirm = () => {
    this.props.handleInInputConfirm(this.state.modal_data);
  }
  
  render() {
    let { modal_data, modal_type} = this.state;
    return  (
      <>
      <Modal show={true} id="done-order-modal"  className="custom-modal-sm first-view-modal guidance-done-modal">
        <Modal.Header>
          <Modal.Title>実施時IN量入力</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <Col id="soap_list_wrapper">
              <Bar>
                <div className="content">                
                  {(modal_type == "injection") && (
                    <div className="data-list" onContextMenu={(e)=>this.handleClick(e)}>                      
                      <MedicineListWrapper>
                        <div className="history-item soap-data-item content-border">
                          {modal_data.order_data.order_data.length > 0 && modal_data.order_data.order_data.map((item, key)=>{
                            return (
                              <div className="history-item" key={key}>
                                <div className="box w70p">
                                  <div className="flex between drug-item table-row">
                                    <div className="number" style={underLine}>
                                      {" Rp" + parseInt(key + 1)}
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item" style={{marginRight:'8px'}}>
                                        {!item.usage_name ? "" : `手技: ${item.usage_name}`}
                                      </div>
                                    </div>
                                    <div className="w80 table-item">
                                      {item.days !== 0 && item.days !== undefined
                                        ? item.days +
                                        (item.days_suffix !== undefined && item.days_suffix !== ""
                                          ? item.days_suffix
                                          : "日分")
                                        : ""}
                                    </div>
                                  </div>
                                  {item.med.length > 0 && item.med.map((medicine_item, medicine_key)=>{
                                    return (
                                      <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                        <div className="flex between">
                                          <div className="flex full-width table-item">
                                            <div className="number">
                                            </div>
                                            
                                            <div className="ml-3 full-width mr-2" style={{textAlign:'left'}}>
                                              {medicine_item.item_name}
                                              {medicine_item.amount > 0 &&
                                              medicine_item.uneven_values !== undefined &&
                                              medicine_item.uneven_values.length > 0 && (
                                                <p style={textAlignRight}>
                                                  {this.getUnevenValues(medicine_item.uneven_values, medicine_item.unit)}
                                                </p>
                                              )}
                                              {medicine_item.free_comment
                                                ? medicine_item.free_comment.map(comment => {
                                                  return (
                                                    <p key={comment.id} style={textAlignRight}>
                                                      {comment}
                                                    </p>
                                                  );
                                                })
                                                : ""}
                                            </div>
                                          </div>
                                          <div className="w80 table-item" style={textAlignRight}>
                                            {" "}
                                            {medicine_item.amount}
                                            {medicine_item.unit}
                                          </div>
                                        </div>
                                        <div className="flex between" style={{marginTop:"5px"}}>
                                          <div className="flex full-width table-item in-input-area">
                                            <div className="number">
                                            </div>
                                            
                                            <div className="ml-3 full-width mr-2" style={{textAlign:'left'}}>
                                              <button onClick={()=>this.openInInputCalcModal(key, medicine_key)} style={{marginRight:"5px"}}>IN量入力</button>
                                              <input 
                                                type="text"
                                                value={medicine_item.in_input_amount}                                                                                                
                                                style={{textAlign:"right",width:"6rem"}}                                               
                                              />
                                            </div>
                                          </div>
                                          <div className="w80 table-item" style={textAlignRight}>                                            
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                                  {item.is_precision !== undefined && item.is_precision == 1 && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        【精密持続点滴】
                                      </div>
                                    </div>
                                  )}
                                  {item.insurance_type !== undefined && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`保険: ${this.getInsurance(item.insurance_type)}`}
                                      </div>
                                    </div>
                                  )}
                                  {item.body_part !== undefined && item.body_part !== "" && (
                                    <div className="flex between option table-row prescription-body-part">
                                      <div className="text-right table-item">
                                        {`部位/補足: ${item.body_part}`}
                                      </div>
                                    </div>
                                  )}
                                  {item.discontinuation_start_date !== undefined &&
                                  item.discontinuation_start_date !== "" && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`中止期間の最初日: ${formatDate(
                                          item.discontinuation_start_date
                                        )}`}
                                      </div>
                                    </div>
                                  )}
                                  {item.discontinuation_end_date !== undefined &&
                                  item.discontinuation_end_date !== "" && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`中止期間の最後日: ${formatDate(
                                          item.discontinuation_end_date
                                        )}`}
                                      </div>
                                    </div>
                                  )}
                                  {item.discontinuation_comment !== undefined &&
                                  item.discontinuation_comment !== "" && (
                                    <div className="flex between option table-row">
                                      <div className="text-right table-item">
                                        {`中止コメント: ${item.discontinuation_comment}`}
                                      </div>
                                    </div>
                                  )}
                                  {item.injectUsageName != undefined && item.injectUsageName != null && item.injectUsageName != "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-right">
                                        <div className="table-item">
                                          {!item.injectUsageName ? "" : `用法: ${item.injectUsageName}`}
                                        </div>
                                        {item.usage_remarks_comment ? (
                                          <div className="table-item remarks-comment">
                                            {item.usage_remarks_comment.map((comment, ci) => {
                                              return <p key={ci}>{comment}</p>;
                                            })}
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                      <div className="w80 table-item">
                                      </div>
                                    </div>
                                  )}
                                  {item.med.length > 0 && (
                                    <>
                                      {(item.temporary_medication !== undefined && item.temporary_medication === 1) ||
                                      (item.med[0].one_dose_package !== undefined && item.med[0].one_dose_package === 1) ||
                                      (item.med[0].milling !== undefined && item.med[0].milling === 1) ||
                                      (item.med[0].is_not_generic !== undefined && item.med[0].is_not_generic === 1) ||
                                      (item.med[0].separate_packaging !== undefined && item.med[0].separate_packaging === 1) ||
                                      (item.med[0].can_generic_name !== undefined && item.med[0].can_generic_name === 1) && (
                                        
                                        <div className="option flex table-item table-row dcVhIR">
                                          {item.temporary_medication !== undefined && item.temporary_medication === 1 && (
                                            <p className="gCXasu">【臨時処方】&nbsp;</p>
                                          )}
                                          {item.med[0].one_dose_package !== undefined && item.med[0].one_dose_package === 1 && (
                                            <p className="gCXasu">【一包化】&nbsp;</p>
                                          )}
                                          {item.med[0].milling !== undefined && item.med[0].milling === 1 && (
                                            <p className="gCXasu">【粉砕】&nbsp;</p>
                                          )}
                                          {item.med[0].is_not_generic !== undefined && item.med[0].is_not_generic === 1 && (
                                            <p className="gCXasu">【後発不可】&nbsp;</p>
                                          )}
                                          {item.med[0].separate_packaging !== undefined && item.med[0].separate_packaging === 1 && (
                                            <p className="gCXasu">【別包】&nbsp;</p>
                                          )}
                                          {item.med[0].can_generic_name !== undefined && item.med[0].can_generic_name === 1 && (
                                            <p className="gCXasu">【一般名処方】&nbsp;</p>
                                          )}
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                          <div>                            
                            {/*--------- not 定期注射 --------- */}
                            {/*{modal_data.order_data.schedule_date !== null && modal_data.order_data.schedule_date !== undefined && modal_data.order_data.schedule_date != "" && modal_data.order_data.is_completed != 4 && (
                              <div className="flex between option table-row no-bottom">
                                <div className="text-right table-item">
                                  <label>実施予定日: </label>
                                  <label>{formatJapanDateSlash(modal_data.order_data.schedule_date)}</label>
                                </div>
                              </div>
                            )}
                            {modal_data != undefined && modal_data != null && modal_data.done_order == 1 && modal_data.order_data.is_completed != 4 && (
                              <div className="flex between option table-row no-bottom">
                                <div className="text-right table-item">
                                  <label>実施日時: </label>
                                  <label>{formatJapanDateSlash(modal_data.order_data.executed_date_time) + " " + modal_data.order_data.executed_date_time.substr(11, 2) + ":" + modal_data.order_data.executed_date_time.substr(14, 2)}</label>
                                </div>
                              </div>
                            )}*/}
                            {modal_data.order_data.location_name !== null && modal_data.order_data.location_name !== undefined && modal_data.order_data.location_name != "" && (
                              <div className="history-item">
                                <div className="box">
                                  <div className="flex between option table-row">
                                    <div className="text-right table-item">
                                      <label>実施場所: </label>
                                      <label>{modal_data.order_data.location_name}</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {modal_data.order_data.drip_rate !== null && modal_data.order_data.drip_rate !== undefined && modal_data.order_data.drip_rate !== "" &&
                            modal_data.order_data.drip_rate !== 0 && (
                              <div className="history-item">
                                <div className="box">
                                  <div className="flex between option table-row">
                                    <div className="text-right table-item">
                                      {`点滴速度: ${modal_data.order_data.drip_rate}ml/h`}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {modal_data.order_data.water_bubble !== null && modal_data.order_data.water_bubble !== undefined && modal_data.order_data.water_bubble !== "" &&
                            modal_data.order_data.water_bubble !== 0 && (
                              <div className="history-item">
                                <div className="box">
                                  <div className="flex between option table-row">
                                    <div className="text-right table-item">
                                      {`1分あたり: ${modal_data.order_data.water_bubble}滴`}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {modal_data.order_data.exchange_cycle !== null && modal_data.order_data.exchange_cycle !== undefined && modal_data.order_data.exchange_cycle !== "" &&
                            modal_data.order_data.exchange_cycle !== 0 && (
                              <div className="history-item">
                                <div className="box">
                                  <div className="flex between option table-row">
                                    <div className="text-right table-item">
                                      {`交換サイクル: ${modal_data.order_data.exchange_cycle}時間`}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {modal_data.order_data.require_time !== null && modal_data.order_data.require_time !== undefined && modal_data.order_data.require_time !== "" &&
                            modal_data.order_data.require_time !== 0 && (
                              <div className="history-item">
                                <div className="box">
                                  <div className="flex between option table-row">
                                    <div className="text-right table-item">
                                      {`所要時間: ${modal_data.order_data.require_time}時間`}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {modal_data.order_data != null && modal_data.order_data.free_comment != null && modal_data.order_data.free_comment !== undefined && modal_data.order_data.free_comment.length > 0 &&  modal_data.order_data.free_comment[0] != null && (
                              <div className="history-item">
                                <div className="box">
                                  <div className="flex between option table-row">
                                    <div className="text-right table-item" style={{paddingLeft:"80px"}}>
                                      <label>備考: </label>
                                      <label>{modal_data.order_data.free_comment[0]}</label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {modal_data.order_data.item_details != null && modal_data.order_data.item_details != undefined && modal_data.order_data.item_details.length > 0 && modal_data.order_data.item_details.map(detail=>{
                              return(
                                <>
                                  <div className="item-details"><label>{detail.item_name}
                                    {((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": ""}</label>
                                    {detail.format1 != null && detail.format1 != undefined && detail.format1.includes("年") && detail.format1.includes("月") ? (
                                      <>
                                        {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                          <><label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}</label></>
                                        )}
                                        {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                          <> ~ <label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}</label></>
                                        )}
                                      </>
                                    ):(
                                      <>
                                        {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                          <><label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}</label><br /></>
                                        )}
                                        {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                          <><label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}</label><br /></>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </>
                              );
                            })}
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  )}
                </div>
              </Bar>
              {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
                <SystemConfirmModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.confirmOk.bind(this)}
                  confirmTitle= {this.state.confirm_message}
                />
              )}
              {this.state.confirm_message !== "" && this.state.confirm_in_modal == "menu_in_modal" && (
                <SystemConfirmJapanModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.confirmCancelDoneOk.bind(this)}
                  confirmTitle= {this.state.confirm_message}
                  title = {this.state.confirm_title}                  
                />
              )}
              {this.state.alert_messages !== "" && (
                <AlertNoFocusModal
                  hideModal= {this.confirmCancel.bind(this)}
                  handleOk= {this.confirmCancel.bind(this)}
                  showMedicineContent= {this.state.alert_messages}
                />
              )}  
              {this.state.isCalcModalOpen && this.state.rp_key != null && this.state.medicine_key != null && (
                <CalcDaysChange
                  calcConfirm={this.confirmCalc}
                  units={modal_data.order_data.order_data[this.state.rp_key]['med'][this.state.medicine_key].unit}
                  calcCancel={this.closeCalcModal}
                  daysSelect={false}
                  daysInitial={0}
                  daysLabel=""
                  daysSuffix=""
                  maxAmount={1000000}
                  calcTitle={modal_data.order_data.order_data[this.state.rp_key]['med'][this.state.medicine_key].item_name}
                  calcFormula={"not_decimal"}
                />
              )}          
            </Col>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <div
            onClick={this.props.closeModal}
            className={this.state.curFocus === 1 ? "custom-modal-btn cancel-btn focus " : "custom-modal-btn cancel-btn"}
            style={{cursor:"pointer"}}
          >
            <span>キャンセル</span>
          </div>  
          <div
            id="system_confirm_Ok"
            className={"custom-modal-btn red-btn"}
            onClick={this.handleConfirm}
            style={{cursor:"pointer"}}
          >
            <span>確定</span>
          </div>        
        </Modal.Footer>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
      </Modal>
      </>
    );
  }
}

InjectionInInputModal.contextType = Context;

InjectionInInputModal.propTypes = {
  closeModal: PropTypes.func,
  handleInInputConfirm: PropTypes.func,
  selected_order: PropTypes.object,
  order_type: PropTypes.string,
  patientInfo: PropTypes.object,
  patientId: PropTypes.number,
  // closeInjection: PropTypes.func,
  // closeModalAndRefresh: PropTypes.func,
  // modal_type: PropTypes.string,
  // patientId: PropTypes.number,
  // modal_title: PropTypes.string,
  // modal_data: PropTypes.object,
  // history: PropTypes.object,
  // patientInfo: PropTypes.object,
  // gotoUrl:PropTypes.string,
  // fromPage:PropTypes.string,
};

export default withRouter(InjectionInInputModal);
