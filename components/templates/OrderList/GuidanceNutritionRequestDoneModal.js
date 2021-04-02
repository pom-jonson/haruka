import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { WEEKDAYS } from "~/helpers/constants";
import {surface, secondary200, disable} from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import {formatJapanDateSlash, formatJapanSlashDateTime} from "~/helpers/date";
import {Bar} from "~/components/styles/harukaBackgroundCss";
import Tooltip from "react-bootstrap/Tooltip";
const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import * as localApi from "~/helpers/cacheLocal-utils";

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
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
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
`;

const Col = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  textarea {
    width: 100%;
    resize: none;
  }
  .data-item{
    border-bottom: 1px solid ${disable};
    background: linear-gradient(#d0cfcf, #e6e6e7);
  }
  .data-title{
    border: 1px solid rgb(213,213,213);
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
  .department{
    font-size: 1rem;
  }
  .note{
    font-weight: bold;
  }
  .date{
    font-weight:bold;
    text-align: left;
    padding-left: 0.5rem;
  }
  .doctor-name{
    font-size: 12px;
    padding-right: 8px;
  }
  .history-region{
    border-bottom: 1px solid rgb(213,213,213);
    font-size: 12px;
    padding-right: 8px;
  }
  .order{
    display: block !important;
  }
  .data-list{
    background-color: ${surface};
    height: calc(100% - 2.5rem);
    margin-top: 0.5rem;
    .data-item{ 
      padding: 0.5rem 0.5rem 0 0.5rem;
    }
  }
  .low-title,
  .middle-title{
    background: rgb(230, 230, 231);
  }
  .flex {display:flex;}
`;


const MedicineListWrapper = styled.div`
  font-size:${props=>(props.font_props != undefined?0.75 * props.font_props + 'rem':'0.75rem')};
  height: calc(100% - 6.5rem);
  .history-item {
    height: 100%;
    overflow-y: auto;
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
      left: 80px;
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
        width: 9.375rem;
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

  .drug-item {
    border-bottom: 1px solid ${disable};
    border-right: 1px solid ${disable};
    border-left: 1px solid ${disable};
    padding: 4px;
  }

  .number {
    margin-right: 8px;
    width: 80px;
  }
  .text-right {
    width: calc(100% - 88px);
  }
  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 80px);
    word-wrap: break-word;
  }
  p {
    margin-bottom: 0;
  }
`;

class GuidanceNutritionRequestDoneModal extends Component {
  constructor(props) {
    super(props);
    let department_data = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.departmentOptions = [];
    if(department_data.length > 0){
      department_data.map(department=>{
        this.departmentOptions[department['id']] = department['value'];
      })
    }
    this.state = {
      confirm_message: "",
    };
    this.can_done = false;
  }

  async componentDidMount() {
    this.can_done = this.context.$canDoAction(this.context.FEATURES.NUTRITION_GUIDANCE, this.context.AUTHS.DONE_OREDER, 0);
    await this.getDoctorsList();
  }

  doneData = async() => {
    let path = "/app/api/v2/order/orderComplete";
    let post_data = {
      type:"guidance_nutrition_request",
      number:this.props.from_page == "soap" ? this.props.modal_data.data.order_data.order_data.number
        : (this.props.from_page == "important_order_list" ? this.props.modal_data.order_data.order_data.number : this.props.modal_data.number),
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          if(this.props.from_page === "soap" || this.props.from_page === "important_order_list"){
            window.sessionStorage.setItem("alert_messages", res.alert_message);
            if(this.props.from_page === "soap"){
              this.props.doneInspection(this.props.modal_data.number, "guidance-nutrition-request");
            }
          }
        }
      })
      .catch(() => {
      });
    if(this.props.from_page === "soap"){
      this.props.closeModal('change');
    } else {
      let re = /patients[/]\d+/;
      let cur_url = window.location.href;
      let isPatientPage = re.test(cur_url);
      if(isPatientPage){
        let path = cur_url.split("/");
        if(path[path.length - 1] === "soap" && path[path.length - 2] === this.props.modal_data.patient_id){
          localApi.setValue("nutrition_guidance_done_patient", this.props.modal_data.patient_id);
        }
      }
      this.props.closeModal('order_done');
    }
  };

  getWeekDay = dateStr => {
    let weekday = new Date(dateStr).getDay();
    return WEEKDAYS[weekday];
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
      strHistory = `${nHistoryLength}版 : ${formatJapanSlashDateTime(strDateTime)}`;
      return strHistory;
    } else{
      if (nDoctorConsented == 1) {
        strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        return strHistory;
      } else{
        strHistory = `${nHistoryLength}版 : ${formatJapanSlashDateTime(strDateTime)} 入力者 : ${strStuffName}`;
        if (nHistoryLength == 1) {
          strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        }
        return strHistory;
      }
    }
  }

  getDoctorName = (nDoctorConsented = -1, strDoctorName = "") => {
    if (nDoctorConsented == 4) {
      return `（過去データ取り込み）${strDoctorName}`;
    }
    if (nDoctorConsented == 2) {
      return strDoctorName;
    } else{
      if (nDoctorConsented == 1) {
        return `[承認済み] 依頼医: ${strDoctorName}`;
      } else{
        return  <div><span className='not-consented'>[未承認]</span> 依頼医: {strDoctorName}</div>;
      }
    }
  }

  confirmCancel() {
    this.setState({
      confirm_message: "",
    });
  }

  confirmOk = () => {
    this.doneData();
    this.setState({
      confirm_message: "",
    });
  };

  openConfirm = () => {
    this.setState({confirm_message: "実施しますか？"});
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

  getOrderTitleClassName = (done_order, karte_status = null) => {
    if (done_order == 1) {
      return karte_status != 3 ? "_color_implemented" : "_color_implemented_hospital";
    } else {
      return karte_status != 3 ? "_color_not_implemented" : "_color_not_implemented_hospital";
    }
  }

  render() {
    let { modal_data} = this.props;
    let order_data = null;
    if(this.props.from_page == "soap"){
      order_data = modal_data.data.order_data.order_data;
    } else if(this.props.from_page == "important_order_list"){
      order_data = modal_data.order_data.order_data;
    } else {
      order_data = modal_data;
    }
    return  (
      <Modal show={true}  className="custom-modal-sm first-view-modal haruka-done-modal">
        <Modal.Header><Modal.Title>栄養指導依頼実施</Modal.Title></Modal.Header>
        <Modal.Body>
          <Wrapper>
            <Col id="soap_list_wrapper">
              <Bar>
                <div className="content">
                  <div className={'patient-info'}>
                    {modal_data.patient_number} : {modal_data.patient_name}
                  </div>
                  <div className="data-list">
                    <div className={`data-title ${this.getOrderTitleClassName(order_data.done_order, modal_data.karte_status)}`}>
                      <div className={'data-item'}>
                        <div className="flex justify-content">
                          <div className="note">【入院・栄養指導依頼】{order_data.done_order != 1 && (<span>未実施</span>)}</div>
                          <div className="department text-right">{this.departmentOptions[order_data.department_id]}</div>
                        </div>
                        <div className="date">
                          {modal_data.treatment_datetime !== undefined && modal_data.treatment_datetime !== "" ?
                            formatJapanSlashDateTime(modal_data.treatment_datetime):formatJapanDateSlash(modal_data.treatment_date)}
                        </div>
                      </div>
                      {modal_data.data.history != null && modal_data.data.history !== "" ? (
                        <div className="history-region text-right middle-title">
                          {this.getHistoryInfo(modal_data.data.history.split(",").length-1, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                        </div>
                      ):(
                        <>
                          <div className="history-region text-right middle-title">
                            {this.getHistoryInfo(0, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                          </div>
                        </>
                      )}
                      <div className="doctor-name text-right low-title">
                        {this.getDoctorName(modal_data.is_doctor_consented, order_data.doctor_name)}
                      </div>
                    </div>
                    <MedicineListWrapper>
                      <div className="history-item">
                        <div className="phy-box w70p" draggable="true">
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">予約日時</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">
                                {formatJapanDateSlash(order_data.reserve_datetime.split(' ')[0])+" "+order_data.reserve_datetime.split(' ')[1]}
                              </div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">身長</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{order_data.height}cm</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">体重</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{order_data.weight}㎏</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">BMI</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{order_data.bmi}</div>
                            </div>
                          </div>
                          {order_data.request_disease_names != undefined && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">病名</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">
                                  {order_data.request_disease_names.map(disease_name=>{
                                    return (
                                      <>
                                        <p style={{margin:0}}>{disease_name}</p>
                                      </>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">指示食種</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{order_data.food_type_name}</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">エネルギー</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{order_data.calorie}kcal</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">塩分</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{order_data.salt_id}g</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">蛋白質</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{order_data.protein}g</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">リン</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{order_data.phosphorus_flag == 1 ? "制限あり" : "制限なし"}</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">脂質</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{order_data.lipid}g</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">カリウム</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{order_data.potassium_flag == 1 ? "制限あり" : "制限なし"}</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">糖質</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{order_data.sugar}g</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">水分</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{order_data.moisture}㎖</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">PFC比</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{order_data.pfc_ratio}</div>
                            </div>
                          </div>
                          <div className="flex between drug-item table-row">
                            <div className="text-left">
                              <div className="table-item">P/S比</div>
                            </div>
                            <div className="text-right">
                              <div className="table-item remarks-comment">{order_data.ps_ratio}</div>
                            </div>
                          </div>
                          {order_data.request_content_names != undefined && order_data.request_content_names.length > 0 && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">指示内容</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">
                                  {order_data.request_content_names.map(content_name=>{
                                    return (
                                      <>
                                        <p style={{margin:0}}>{content_name}</p>
                                      </>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                          {order_data.guidance_content_other != "" && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">指示内容のその他</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{order_data.guidance_content_other}</div>
                              </div>
                            </div>
                          )}
                          {order_data.importance_message_names != undefined && order_data.importance_message_names.length > 0 && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">重点伝達事項</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">
                                  {order_data.importance_message_names.map(message_name=>{
                                    return (
                                      <>
                                        <p style={{margin:0}}>{message_name}</p>
                                      </>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                          {order_data.content_other != "" && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">重点伝達事項のその他</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{order_data.content_other}</div>
                              </div>
                            </div>
                          )}
                          {order_data.free_comment != "" && (
                            <div className="flex between drug-item table-row">
                              <div className="text-left">
                                <div className="table-item">フリーコメント</div>
                              </div>
                              <div className="text-right">
                                <div className="table-item remarks-comment">{order_data.free_comment}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </MedicineListWrapper>
                  </div>
                </div>
              </Bar>
            </Col>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeModal} className="cancel-btn">キャンセル</Button>
          {order_data.done_order != 1 && (
            <>
              {this.can_done ? (
                <div onClick={this.openConfirm} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}><span>実施</span></div>
              ):(
                <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                  <div className={"custom-modal-btn disable-btn"}><span>実施</span></div>
                </OverlayTrigger>
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
        {this.state.doctors !== undefined && this.context.needSelectDoctor === true && (
          <SelectDoctorModal
            closeDoctor={this.closeDoctor}
            getDoctor={this.getDoctor}
            selectDoctorFromModal={this.selectDoctorFromModal}
            doctors={this.state.doctors}
          />
        )}
      </Modal>
    );
  }
}

GuidanceNutritionRequestDoneModal.contextType = Context;
GuidanceNutritionRequestDoneModal.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.object,
  from_page: PropTypes.string,
  doneInspection: PropTypes.func,
};
export default GuidanceNutritionRequestDoneModal;
