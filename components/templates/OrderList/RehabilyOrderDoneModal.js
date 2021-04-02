import React, { Component, useContext } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { WEEKDAYS, CACHE_LOCALNAMES, getVisitPlaceNameForModal } from "~/helpers/constants";
import { surface, disable } from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import RehabilyOrderData from "~/components/templates/Patient/Modals/Rehabilitation/RehabilyOrderData";
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import {Bar} from "~/components/styles/harukaBackgroundCss";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as sessApi from "~/helpers/cacheSession-utils";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;

const Wrapper = styled.div`
  display: block;<
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
          {$canDoAction(FEATURES.REHABILY, AUTHS.EDIT_ORDER_STATE) && (
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
class RehabilyOrderDoneModal extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let departements = {};
    if (departmentOptions != undefined && departmentOptions.length > 0) {
      departmentOptions.map(item=>{
        departements[item.id] = item;
      })
    }
    var order_data = this.props.from_page == "soap" ? this.props.modal_data.data.order_data.order_data : this.props.modal_data.order_data.order_data;
    this.state = {
      departmentOptions: departements,
      modal_type: this.props.modal_type,
      modal_title: this.props.modal_title,
      modal_data: this.props.modal_data,
      confirm_message: "",
      order_data,
      isConfirmBackStatusModal:false,
      confirm_back_message:'',
      waring_message:'',
    };
    let reception_disable, done_disable, current_done_flag = false;
    if (this.props.modal_data !== undefined && this.props.modal_data.done_order !== undefined && (this.props.modal_data.done_order === 1 || this.props.modal_data.done_order === 2) && this.props.reception_or_done === "reception"){
      reception_disable = true;
    }
    if (this.props.modal_data !== undefined && this.props.modal_data.done_order !== undefined && this.props.modal_data.done_order === 1 && this.props.reception_or_done === "done"){
      done_disable = true;
    }
    if (this.props.modal_data !== undefined && this.props.modal_data.done_order !== undefined && this.props.modal_data.done_order === 1) {
      current_done_flag = true;
    }
    this.reception_disable = reception_disable;
    this.done_disable = done_disable;
    this.current_done_flag = current_done_flag;
    this.can_done = true;
  }
  
  async componentDidMount() {
    await this.getDoctorsList();
    this.can_done = this.context.$canDoAction(this.context.FEATURES.REHABILY, this.context.AUTHS.DONE_OREDER);
  }
  
  chagneStatus = (changed_status) => {
    var confirm_back_message = '';
    var waring_message = '';
    var order_data = this.state.order_data;
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
    var number = this.state.order_data.number;
    var order_data = this.state.order_data;
    let path = "/app/api/v2/order/rehabily/change_done_state";
    order_data.done_order = this.state.changed_status;
    let post_data = {
      type : this.props.modal_type,
      number,
      reception_or_done : this.props.reception_or_done,
      order_data : order_data,
      current_done_flag: this.current_done_flag
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
        if(this.props.from_page == "soap"){
          this.props.doneInspection(this.props.modal_data.number, "rehabily", {done_order:this.state.changed_status});
        }
      })
      .catch(() => {
      });
    this.props.closeModal("change");
    if (this.props.handleNotDoneOk != undefined && this.props.handleNotDoneOk != null) this.props.handleNotDoneOk();
  }
  
  doneData = async() => {
    let number = this.props.from_page == "soap" ? this.props.modal_data.data.order_data.order_data.number : this.props.modal_data.order_data.order_data.number;
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
          if(this.props.from_page == "soap"){
            this.props.doneInspection(this.props.modal_data.number, "rehabily");
          }
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
      waring_message:'',
      isConfirmBackStatusModal:false,
      confirm_back_message:''
    });
  }
  
  confirmOk = () => {
    this.doneData();
    this.setState({
      confirm_message: "",
    });
  };
  
  openConfirm = () => {
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
    let data = sessApi.getDoctorList();
    if(data == null) {
      data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    }
    this.setState({ doctors: data });
  };
  
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
    }
    return "";
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
  
  getDoneStatus (modal_data) {
    if (modal_data.is_doctor_consented != 4 && modal_data.done_order == 0) return '未受付';
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
      var obj_modal = document.getElementById('done-order-modal');
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - obj_modal.offsetLeft,
          y: e.clientY + window.pageYOffset - obj_modal.offsetTop - 80,
        },
      });
    }
  }
  
  render() {
    let { modal_data, modal_title, modal_type, from_page} = this.props;
    let {order_data} = this.state;
    if(from_page == "soap"){
      let tmp_modal_data = modal_data;
      modal_data = modal_data.data;
      modal_data['treatment_datetime'] = tmp_modal_data.treatment_datetime;
      modal_data['treatment_date'] = tmp_modal_data.treatment_date;
      modal_data['target_table'] = tmp_modal_data.target_table;
      modal_data['doctor_name'] = tmp_modal_data.doctor_name;
      modal_data['input_staff_name'] = tmp_modal_data.input_staff_name;
      let patient_info = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PATIENT_INFORMATION);
      modal_data['patient_number'] = patient_info.receId;
      modal_data['patient_name'] = patient_info.name;
    }
    var done_status = this.getDoneStatus(modal_data, modal_type);
    let karte_status_name = "外来・";
    if (order_data != undefined && order_data.karte_status != undefined) {
      karte_status_name = order_data.karte_status == 1 ? "外来・" : order_data.karte_status == 2 ? "訪問診療・" : order_data.karte_status == 3 ? "入院・" : "";
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
                  <div className={'patient-info'}>
                    {modal_data.patient_number} : {modal_data.patient_name}
                  </div>
                  <div className="data-list" onContextMenu={e => this.handleClick(e)}>
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
                <>
                  {this.can_done ? (
                    <div className={(this.reception_disable || this.done_disable) ? "custom-modal-btn disable-btn" : "custom-modal-btn red-btn"} onClick={this.openConfirm.bind(this)} style={{cursor:"pointer"}}>
                      <span>{this.props.reception_or_done == "done" ? "実施":"受付済み"}</span>
                    </div>
                  ):(
                    <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                      <div className="disable-btn">
                        <span>{this.props.reception_or_done == "done" ? "実施":"受付済み"}</span>
                      </div>
                    </OverlayTrigger>
                  )}
                </>
                
                
              )}
              
            </>
          )}
        </Modal.Footer>
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

RehabilyOrderDoneModal.contextType = Context;

RehabilyOrderDoneModal.propTypes = {
  closeModal: PropTypes.func,
  modal_type: PropTypes.string,
  modal_title: PropTypes.string,
  modal_data: PropTypes.object,
  only_close_btn: PropTypes.bool,
  reception_or_done: PropTypes.string,
  handleNotDoneOk:PropTypes.func,
  doneInspection:PropTypes.func,
  patientId: PropTypes.number,
  from_page:PropTypes.string
};

export default RehabilyOrderDoneModal;