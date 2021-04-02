import React, {Component, useContext} from "react";
import { Modal } from "react-bootstrap";
import TitleTabs from "../organisms/TitleTabs";
import axios from "axios";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import LargeUserIcon from "../atoms/LargeUserIcon";
import Context from "~/helpers/configureStore";
import InjectionHistoryList from "../molecules/InjectionHistoryList";
import InjectionListItem from "../organisms/InjectionListItem";
import PatientCardWrapper from "../atoms/PatientCardWrapper";
import { Wrapper, Flex, PatientId, Kana, PatientName } from "../styles/PatientInfoCardCss";
import InjectionRankSelection from "../organisms/InjectionRankSelection";
import InjectionSetSelection from "../organisms/InjectionSetSelection";
import * as apiClient from "../../api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import NotDoneListModal from "~/components/organisms/NotDoneListModal";
import DoneModal from "~/components/organisms/DoneModal";
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import Button from "~/components/atoms/Button";
import { formatJapanDateSlash } from "~/helpers/date";

const Footer = styled.div`
  display: flex;
  span{
    color: white;
    font-size: 16px;
  }
  button{
    float: right;
    padding: 5px;
    font-size: 16px;
    margin-right: 16px;
  }
`;

const textAlignRight = {
  textAlign: "right"
};

const MedicineSelectionWrapper = styled.div`
  width: 100%;
  height: 100%;  
  // background-color: #ffffff;
  background: #f1f3f4;
  border: 1px solid ${colors.disable};
  border-top: none;  
  // -ms-overflow-style: none;
  overflow-y:auto;
`;

const HistoryListDiv = styled.div`
  width: 100%;

  .line-through {
    color: #ff0000;
  }
`;

const MedicineListWrapper = styled.div`  
  background: white;
  border-bottom: 1px solid rgb(213, 213, 213);
  font-size: 12px;
  p {
    margin-bottom: 0;
  }

  .row {
    border-top: 1px solid ${colors.disable};
    margin: 0;
  }

  .department {
    width: 15%;
  }

  .patient-name {
    margin: auto;
  }

  .name-label {
    width: 35%;
    p {
      display: inline-block;
      margin-left: 8px;
    }
  }

  .history-item {
    &:first-child {
      .box {
        border-top: none;
      }
    }
    &:after {
      content: "";
      display: block;
      clear: both;
    }
  }

  .box {
    border-top: 1px solid ${colors.disable};
    border-right: 1px solid ${colors.disable};
    float: left;
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${colors.disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 75px;
    }
    &:after {
      content: "";
      background-color: ${colors.disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 80px;
    }
  }

  .table-row {
    border-bottom: 1px solid ${colors.disable};
    font-size: 14px;
    line-height: 1.3;
    padding: 4px;
    &:nth-child(2n) {
      background-color: ${colors.secondary200};
    }
    &:last-child {
      border-bottom: none;
    }
  }

  .number {
    margin-right: 8px;
    width: 75px;
  }

  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 80px);
    word-wrap: break-word;
  }

  .text-right {
    width: calc(100% - 88px);
  }

  .w80 {
    text-align: right;
    width: 80px;
    margin-left: 8px;
  }

  .w70p {
    width: 70%;
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

  .patient-info {
    color: #000;
  }

  .w30p {
    width: 30%;
  }

  .patient-info-header {
    background-color: #fbeaea;
    padding-left: 16px;
  }

  .patientinfo-item {
    border-bottom: 1px solid ${colors.disable};
    font-size: 14px;
    line-height: 1.3;
    padding: 4px;
  }

  .detail-item {
    display: inline-block;
    width: 50%;
    &:nth-of-type(2) {
      width: 100%;
    }
    &:nth-of-type(3) {
      border-right: 1px solid ${colors.disable};
    }
  }

  .draggable {
    border-right: solid 1px ${colors.disable};
  }

  .order-copy {
    background-color: transparent;
    border: 1px solid #ced4da;
    padding: 0 4px;
    min-width: auto;
    span {
      color: ${colors.midEmphasis};
      font-weight: normal;
      letter-spacing: 0;
    }
  }

  .hidden {
    display: none;
  }
`;

const ContextMenuUl = styled.ul`
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
    font-size: 16px;
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

const ContextMenu = ({ visible, x,  y,  parent,  row_index}) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
  if (visible) {
    return (
        <ContextMenuUl>
          <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
            {$canDoAction(FEATURES.PRESCRIPTION, AUTHS.DONE_OREDER) && (
                <li><div onClick={() => parent.contextMenuAction(row_index,"complete")}>実施</div></li>
            )}
          </ul>
        </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class BaseInjectionTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prescriptionsData: [
        {
          number: 1,
          prescriptionNumber: " 9999999",
          systemprescriptionId: 1,
          name: "テスト　患者３１７ ",
          age: 73,
          sex: 1,
          inOut: 0,
          department: "内科",
          accepted_time: "00:31:06",
          diagnosis_type: 1,
          diagnosis_type_name: "診察",
          registration_type: 0,
          registration_type_name: "再来",
          mainDoctor: "",
          mainNurse: ""
        }
      ],
      medicineHistory: this.props.injectionList,
      openPatientId: -1,
      openPatientInfo: null,
      confirm_message: "",
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      medicineHistory: nextProps.injectionList
    });
  }

  getRandomKey = () => {
    const l = 10;
    const c = "abcdefghijklmnopqrstuvwxyz0123456789";
    const cl = c.length;
    let r = "";
    for (var i = 0; i < l; i++) {
      r += c[Math.floor(Math.random() * cl)];
    }
    return r;
  };

  onAngleClicked(e, number) {
    if (e.type == 'click') {
      let history = this.state.medicineHistory.map(function(item) {
        if (item.prescription.number === number) {
          item.prescription.order_data.class_name =
            item.prescription.order_data.class_name === "open" ? "" : "open";
        }
        return item;
      });

      this.setState({
        medicineHistory: history
      });
    }
  }
  onMedicineClicked() {}
  additionalChild() {}

    getCurrentItem = (number) => {
        let result = [];
        if (number == null || number == undefined) {
            return result;
        }
        this.state.medicineHistory.map(item=>{
            if (item.prescription.number == number) {
                result = item;
                result.prescription.record_number = number;
            }
        });
        let ret = {};
        ret.target_number = result.prescription.number;
        ret.patient_id = result.prescription.patient_id;
        ret.updated_at = result.prescription.updated_at;
        ret.treatment_datetime = result.prescription.treat_date;
        ret.is_doctor_consented = result.prescription.is_doctor_consented;
        ret.proxy_input_staff_name = result.prescription.proxy_input_staff_name;
        ret.doctor_name = result.prescription.order_data.doctor_name;
        ret.data = result.prescription;
        return ret;
    }

    closeDoctor = () => {
        this.context.$selectDoctor(false);
    }

    getDoctor = e => {
        this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
    };

    selectDoctorFromModal = (id, name) => {
        let department_name = "その他";
        this.props.doctors.map(doctor => {
            if (doctor.doctor_code === parseInt(id)) {
                if (doctor.diagnosis_department_name !== "") {
                    department_name = doctor.diagnosis_department_name;
                }
            }
        });
        this.context.$updateDoctor(id, name, department_name);
        this.context.$selectDoctor(false);
        this.openConfirm();
    };

    closeDoneModal = () => {
        this.setState({
            isOpenDoneModal: false,
        });
    }

    closeModalAndRefresh = () => {
        this.setState({
            isOpenDoneModal: false,
        }, () => {
            this.props.searchInjectionList();
        });
    }

  render() {    
    let medicineHistoryList = this.state.medicineHistory.map(
      (injection, orderIndex) => {
        let free_comment =
        injection.prescription.order_data.free_comment !== undefined
            ? Array.isArray(injection.prescription.order_data.free_comment)
              ? injection.prescription.order_data.free_comment.join("、")
              : injection.prescription.order_data.free_comment
            : "";
        return (
          <div key={orderIndex} onClick={((e)=>this.onMedicineClicked(e, orderIndex)).bind(this)} onContextMenu={e => this.handleClick(e, injection.prescription,injection.prescription.done_order )} id="list-table">
            <InjectionListItem
              department={injection.prescription.order_data.department}              
              doctor_name={injection.prescription.order_data.doctor_name}
              class_name={injection.prescription.order_data.class_name}
              substitute_name={injection.prescription.order_data.substitute_name}
              diagnosing_date={
                injection.prescription.order_data.executed_date_time
                  ? injection.prescription.order_data.executed_date_time
                  : ""
              }
              is_completed={
                injection.prescription.order_data.is_completed
              }
              onAngleClicked={this.onAngleClicked.bind(this)}
              number={injection.prescription.number}
              is_doctor_consented={injection.prescription.is_doctor_consented}
              done_order={injection.prescription.done_order}
              isNotConsentedPopup={false}
              // deselectItem={this.props.deselectItem}
              // deselectInjectionItem={this.props.deselectInjectionItem}
              is_enabled={
                injection.prescription.is_enabled !== undefined
                  ? injection.prescription.is_enabled
                  : 1
              }
              orderNumber={injection.prescription.number}
              getOrderNumberList={this.getOrderNumberList}
              notConsentedDataOneSelect={injection.prescription.data_one_select}
              patientName={injection.patient.name}
            />
            <HistoryListDiv>
              {injection.prescription.order_data.order_data.map(
                (order, index) => {
                  return (
                    <InjectionHistoryList
                      key={this.getRandomKey()}
                      orderNumber={injection.prescription.number}
                      patientId="169"
                      order_data={injection.prescription.order_data}
                      order={order}
                      orderIndex={orderIndex}
                      serial_number={index + 1}
                      onCopyOrder={null}
                      onCopyOrders={null}
                      onEditOrders={null}
                      doctors={null}
                      doctor_code={injection.prescription.order_data.doctor_name}
                      doctor_name={injection.prescription.order_data.doctor_name}
                      setDoctorInfo={null}
                      patientInfo={null}
                      class_name={
                        injection.prescription.order_data.class_name === "open"
                          ? ""
                          : "hidden"
                      }
                      is_doctor_consented={false}
                      is_enabled={
                        injection.prescription.is_enabled !== undefined
                          ? injection.prescription.is_enabled
                          : 1
                      }
                      openNotConsentedModal={false}
                      isNotConsentedPopup={false}
                      isNotConsentedDataLength={0}
                      forNotConsentedCheckDoctorCode={
                        injection.prescription.order_data.doctor_code
                      }
                      consent={null}
                      isPatientInfo={true}
                      patientInfoObject={injection.patient}
                    />
                  );
                }
              )}              
              <div
                className="history-item ">                
                <div className="box w70p float-left-prescription">   
                    {injection.prescription.order_data.schedule_date != undefined && injection.prescription.order_data.schedule_date != null && injection.prescription.order_data.schedule_date != "" && (
                      <div className="flex between option table-row">
                        <div className="text-right table-item">
                          {"実施予定日: " + formatJapanDateSlash(injection.prescription.order_data.schedule_date)}
                        </div>
                      </div>
                    )}          
                    {injection.prescription.done_order == 1 && (            
                       <div className="flex between option table-row">
                        <div className="text-right table-item">
                          {"実施日時: " + formatJapanDateSlash(injection.prescription.order_data.executed_date_time) + " " + injection.prescription.order_data.executed_date_time.substr(11, 2) + "時" + injection.prescription.order_data.executed_date_time.substr(14, 2) + "分"}
                        </div>
                      </div>
                    )}                              
                  {injection.prescription.order_data
                    .psychotropic_drugs_much_reason !== undefined &&
                    injection.prescription.order_data
                      .psychotropic_drugs_much_reason !== "" && (
                      <div className="flex between option table-row">
                        <div className="text-right table-item">
                          {`向精神薬多剤投与理由: ${
                            injection.prescription.order_data
                              .psychotropic_drugs_much_reason
                          }`}
                        </div>
                      </div>
                    )}
                  {injection.prescription.order_data.poultice_many_reason !==
                    undefined &&
                    injection.prescription.order_data.poultice_many_reason !==
                      "" && (
                      <div className="flex between option table-row">
                        <div className="text-right table-item">
                          {`湿布薬超過投与理由: ${
                            injection.prescription.order_data.poultice_many_reason
                          }`}
                        </div>
                      </div>
                    )}  
                  {injection.prescription.order_data.location_name !==
                    undefined &&
                    injection.prescription.order_data.location_name !==
                      "" &&
                    injection.prescription.order_data.location_name !==
                      0 && (
                    <div className="flex between option table-row">
                      <div className="text-right table-item">
                        {`実施場所: ${injection.prescription.order_data.location_name}`}
                      </div>
                    </div>
                  )}
                  {injection.prescription.order_data.drip_rate !==
                    undefined &&
                    injection.prescription.order_data.drip_rate !==
                      "" &&
                    injection.prescription.order_data.drip_rate !==
                      0 && (
                    <div className="flex between option table-row">
                      <div className="text-right table-item">
                        {`点滴速度: ${injection.prescription.order_data.drip_rate}ml/h`}
                      </div>
                    </div>
                  )}
                  {injection.prescription.order_data.water_bubble !==
                    undefined &&
                    injection.prescription.order_data.water_bubble !==
                      "" &&
                    injection.prescription.order_data.water_bubble !==
                      0 && (
                    <div className="flex between option table-row">
                      <div className="text-right table-item">
                        {`1分あたり: ${injection.prescription.order_data.water_bubble}滴`}
                      </div>
                    </div>
                  )}
                  {injection.prescription.order_data.exchange_cycle !==
                    undefined &&
                    injection.prescription.order_data.exchange_cycle !==
                      "" &&
                    injection.prescription.order_data.exchange_cycle !==
                      0 && (
                    <div className="flex between option table-row">
                      <div className="text-right table-item">
                        {`交換サイクル: ${injection.prescription.order_data.exchange_cycle}時間`}
                      </div>
                    </div>
                  )}
                  {injection.prescription.order_data.require_time !==
                    undefined &&
                    injection.prescription.order_data.require_time !==
                      "" &&
                    injection.prescription.order_data.require_time !==
                      0 && (
                    <div className="flex between option table-row">
                      <div className="text-right table-item">
                        {`所要時間: ${injection.prescription.order_data.require_time}時間`}
                      </div>
                    </div>
                  )}
                  {free_comment !== "" && (
                    <div className="flex between option table-row">
                      <div className="number"></div>
                      <div className="ml-3 text-right mr-2" style={{wordBreak:"break-all"}}>
                        {`備考: ${free_comment}`}
                      </div>
                      <div className="w80 table-item"></div>
                    </div>
                  )}        
                </div>
                {injection.prescription.order_data.item_details != null && injection.prescription.order_data.item_details.length > 0 && (
                  <div className="history-item">
                      <div className="box w70p">
                          <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc">
                              <div className="flex between">
                                  <div className="flex full-width table-item">
                                      <div className="number"></div>
                                      <div className="ml-3 full-width mr-2" style={{wordBreak:"break-all"}}>
                                          {injection.prescription.order_data.item_details.map(detail=>{
                                              if(detail != null){
                                                  return(
                                                      <>
                                                          <div><label>{detail.item_name}
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
                                                  )
                                              }
                                          })}
                                      </div>
                                  </div>
                                  <div className="w80 table-item" style={textAlignRight}> </div>
                              </div>
                          </div>
                      </div>
                  </div>
              )}
              </div>
            </HistoryListDiv>
            {/* <PatientInfoDiv className={medicine.prescription.order_data.class_name === "open" ? "" : "hidden"}>
              <PrescriptionPatientInfo
               patient={medicine.patient}
               />
            </PatientInfoDiv> */}
          </div>
        );
      }
    );

    return (
      <MedicineSelectionWrapper>
        <MedicineListWrapper>{medicineHistoryList}</MedicineListWrapper>
        {this.additionalChild()}
        <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            row_index={this.state.row_index}
        />
        {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.confirmOk.bind(this)}
                confirmTitle= {this.state.confirm_message}
            />
        )}
        {this.state.isOpenDoneModal == true && (            
            <DoneModal
                patientId={this.state.system_patient_id}
                closeModal={this.closeDoneModal}
                closeModalAndRefresh={this.closeModalAndRefresh}
                modal_type={this.state.done_modal_type}
                modal_title={this.state.done_modal_title}
                modal_data={this.getCurrentItem(this.state.order_number)}                
                patientInfo={this.state.selectedMedPatientInfo}
                fromPage={"injectionList"}
            />
        )}
        {this.props.doctors != undefined && this.context.needSelectDoctor === true ? (
            <SelectDoctorModal
                closeDoctor={this.closeDoctor}
                getDoctor={this.getDoctor}
                selectDoctorFromModal={this.selectDoctorFromModal}
                doctors={this.props.doctors}
            />
        ) : (
            ""
        )}
      </MedicineSelectionWrapper>
    );
  }
}

BaseInjectionTable.contextType = Context;
BaseInjectionTable.propTypes = {
  injectionList: PropTypes.array,
  searchInjectionList:PropTypes.func,
    doctors: PropTypes.array,
};

const ModalContent = styled.div`
  &.modal-content {
    width: 100%;
  }
`;

const MODAL_TABS = [
  {
    id: 0,
    title: "注射履歴"
  },
  {
    id: 1,
    title: "よく使う薬剤"
  },
  {
    id: 2,
    title: "セット"
  }
];

class ModalPrescriptionList extends Component {
  constructor(props){
    super(props);
    this.state = {
      medicineHistory: [],
      medicineRankData: [],
      medicineSetData: [],
      doctors: [],
      shortPatientInfo:{},
      titleTab: 0
    }
  }

  async UNSAFE_componentWillMount(){
    const resp = await axios.get("/app/api/v2/karte/initial_patient",{
      params: {
        patientId: this.props.patientId,
      }
    });
    let shortPatientInfo = resp.data;
    this.setState({shortPatientInfo:shortPatientInfo});
  }

  async componentDidMount(){
    // get medicineHistory
    const { $canDoAction, FEATURES, AUTHS } = this.context;
    let resp = await axios.get("/app/api/v2/order/injection/find", {
      params: {
        patient_id: this.props.patientId,
        limit: 1000,
        offset: 0
      }
    });

    let addCount = 0;
    let medicineHistory = resp.data
      .filter(item => {
        if (
          $canDoAction(FEATURES.PRESCRIPTION, AUTHS.SHOW_DELETE) ||
          item.is_enabled === 1
        ) {
          addCount++;
          return addCount <= 1000;
        }
        return false;
      })
      .map((item, index) => {

        if (index < 3) {
          item.order_data.class_name = "open";
        } else {
          item.order_data.class_name = "";
        }
        return {prescription: item, patient: this.props.patientInfo};
      });

    //get medicineRankData
    resp = await axios.get(
      "/app/api/v2/patients/history/frequently_used_medicine",
      {
        params: { patient_id: this.props.patientId}
      }
    );
    let medicineRankData = resp.data;

    //get medicineSetData
    resp = await axios.get(
      `/app/api/v2/order/injection/preset`
    );
    let medicineSetData = [];
    if (resp.data) {
      medicineSetData = resp.data.map((item, index) => {
        if (index <= 2) {
          item.class_name = "open";
        } else {
          item.class_name = "";
        }
        return item;
      })
    }
    //get doctors
    resp = await apiClient.get("/app/api/v2/secure/doctor/search?");
    let doctors =  resp.data;

    this.setState({ 
      medicineHistory: medicineHistory, 
      medicineSetData: medicineSetData, 
      medicineRankData: medicineRankData,
      doctors: doctors
    });
  }

  selectTitleTab(e) {
    this.setState({ titleTab: parseInt(e.target.id) });
  }

  render(){
    // const detailedPatientInfo = this.props.patientInfo; 
    var shortPatientInfo = this.state.shortPatientInfo;

    return (
      <Modal show={true} size="xl">
        <Modal.Header>
          <PatientCardWrapper>
            <Wrapper>
              <Flex>
                {shortPatientInfo.sex === 1 ? (
                  <LargeUserIcon size="5x" color="#9eaeda" />
                ) : (
                  <LargeUserIcon size="5x" color="#f0baed" />
                )}
                <div className="ml-2">
                  <Flex>
                    <PatientId>{shortPatientInfo.receId}</PatientId>
                    <div className="name-area">
                      <Kana>{shortPatientInfo.kana}</Kana>
                      <PatientName>{shortPatientInfo.name}</PatientName>
                    </div>
                    <div className="patient-info">
                    <Flex>
                      <div className="birthday">{shortPatientInfo.birthDate}</div>
                      <div className="age">
                        {shortPatientInfo.age}歳 {shortPatientInfo.age_month}ヶ月
                      </div>
                    </Flex>
                  </div>
                  </Flex>
              </div>
              </Flex>
            </Wrapper>
          </PatientCardWrapper>
        </Modal.Header>
        <Modal.Body>
          <ModalContent className="modal-content">
            <div>
              <TitleTabs
                tabs={MODAL_TABS}
                selectTitleTab={this.selectTitleTab.bind(this)}
                id={this.state.titleTab}
              />
              {this.state.titleTab == 0 && (
                  <BaseInjectionTable injectionList={this.state.medicineHistory}/>
              )}
              
              {this.state.titleTab == 1 && (
                <InjectionRankSelection
                  isLoaded={true}
                  medicineRankData={this.state.medicineRankData}
                  allPrescriptionOpen={true}/>
              )}

              {this.state.titleTab == 2 && (
                <InjectionSetSelection 
                  isLoaded={true}
                  patientId={this.props.patientId}
                  allPrescriptionOpen={true}
                  doctors={this.state.doctors}
                  doctor_code={this.context.selectedDoctor.code}
                  doctor_name={this.context.selectedDoctor.name}
                  setDoctorInfo={()=>{}}
                  consent={()=>{}}
                  injectionHistory={this.state.medicineSetData}
                />
              )}
              
            </div>
          </ModalContent>
        </Modal.Body>
      <Modal.Footer>
          <Footer>
              <Button className="cancel ml-2" onClick={this.props.closeModal}>閉じる</Button>
          </Footer>
      </Modal.Footer>
      </Modal>
    );
  }
}

ModalPrescriptionList.contextType = Context;
ModalPrescriptionList.propTypes = {
  closeModal: PropTypes.func,
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
}


class InjectionListTable extends BaseInjectionTable{
  constructor(props){
    super(props);
  }
  closeModal(){
    this.setState({openPatientId: -1, openPatientInfo: null});
  }

  additionalChild() {
    if(this.state.openPatientId != -1){
      
      return (
        <ModalPrescriptionList 
          patientId={this.state.openPatientId} 
          closeModal={this.closeModal.bind(this)}
          patientInfo={this.state.openPatientInfo}
        >
        </ModalPrescriptionList>
      )
    }
  }

  onMedicineClicked(e, number){
    if(e.nativeEvent.which == 3){
      let patientId = this.state.medicineHistory[number].prescription.patient_id;
      let patientInfo = this.state.medicineHistory[number].patient;
      this.setState({openPatientId: patientId, openPatientInfo: patientInfo});
    }

    e.preventDefault();
  }
  handleClick = (e, index, state) => {
    if(state == 1) return;
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
          .getElementById("list-table")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
                .getElementById("list-table")
                .removeEventListener(`scroll`, onScrollOutside);
          });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset
        },
        row_index: index,
      });
    }
  };
  contextMenuAction = (prescription, type) => {
    if (type === "complete"){
        let selectedMedPatientInfo = {};
        selectedMedPatientInfo.receId = prescription.patient_number;
        selectedMedPatientInfo.name = prescription.patient_name;
        this.setState({
            order_number: prescription.number,
            system_patient_id: prescription.patient_id,
            selectedMedPatientInfo
        });
      //   let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      //   if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      //     this.context.$selectDoctor(true);
      //     return;
      // }
        this.openConfirm();
    }
  };

  confirmCancel() {
    this.setState({
      confirm_message: "",
    });
  }

  confirmOk = () => {
    this.completeData();
    this.setState({
      confirm_message: "",
    });
  };

  openConfirm = () => {
      this.setState({
          done_modal_title: "注射",
          done_modal_type: "injection",
          done_modal_data: [],
          isOpenDoneModal: true
      });
    // this.setState({
    //   confirm_message: "実施しますか？",
    // });
  };
  completeData = () => {
    let postData = {
      number: this.state.order_number,
      system_patient_id: this.state.system_patient_id,
      done_order:1
    };
    let path = "/app/api/v2/order/injection/execute";
    axios.post(path, {params: postData})
        .then(() => {
          window.sessionStorage.setItem("alert_messages", "実施しました。");
          this.props.searchInjectionList();
        })
        .catch(() => {
        });
  }
}


export default InjectionListTable;
