import React, {Component, useContext} from "react";
import { Modal } from "react-bootstrap";
import TitleTabs from "../organisms/TitleTabs";
import axios from "axios";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import LargeUserIcon from "../atoms/LargeUserIcon";
import Context from "~/helpers/configureStore";
import HistoryList from "../molecules/HistoryList";
import ListItem from "../organisms/ListItem";
// import PatientCardWrapper from "../atoms/PatientCardWrapper";
import { Wrapper, Kana, PatientName } from "../styles/PatientInfoCardCss";
import MedicineRankSelection from "../organisms/MedicineRankSelection";
import MedicineSetSelection from "../organisms/MedicineSetSelection";
import * as apiClient from "../../api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import DoneModal from "~/components/organisms/DoneModal";
import PrescriptionDoneModal from "~/components/organisms/PrescriptionDoneModal";
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import Button from "~/components/atoms/Button";
import * as sessApi from "~/helpers/cacheSession-utils";
import Spinner from "react-bootstrap/Spinner";

const MedicineSelectionWrapper = styled.div`
  width: 100%;
  height: 100%;  
  // background-color: #ffffff;
  background: #f1f3f4;
  border: 1px solid ${colors.disable};
  border-top: none;  
  // -ms-overflow-style: none;
  overflow-y:auto;
  .prescription-body-part {
    width: 100%;
    padding-left: 5.5rem !important;
  }
`;
const SpinnerWrapper = styled.div`
    margin: auto;
    // top: 50%;
    left: 50%;
    position: relative;
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
  margin-bottom: 0;
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

class BasePrescriptionsTable extends Component {
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
      medicineHistory: this.props.prescriptionsList,
      openPatientId: -1,
      openPatientInfo: null,
      confirm_message: "",
      isOpenPrescriptionDoneModal: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      medicineHistory: nextProps.prescriptionsList
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

  closeDoneModal = () => {
    this.setState({
      isOpenPrescriptionDoneModal: false,      
    });
  }

  closeModalAndRefresh = () => {
    this.setState({
      isOpenPrescriptionDoneModal: false,      
    }, () => {
      this.props.searchPrescriptionList();
    });   
  }

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

  getCurrentItem = (number) => {
    let result = [];
    if (number == null || number == undefined) {
      return result;
    }
    this.state.medicineHistory.map(item=>{
      if (item.prescription.number == number) {
        result = item;
      }
    });

    let ret = {};
    ret.target_number = result.prescription.number;
    ret.patient_id = result.prescription.patient_id;
    ret.updated_at = result.prescription.updated_at;
    ret.treatment_datetime = result.prescription.treat_date;
    ret.is_doctor_consented = result.prescription.is_doctor_consented;
    ret.input_staff_name = result.prescription.proxy_input_staff_name;
    ret.doctor_name = result.prescription.order_data.doctor_name;
    ret.data = result.prescription;
    return ret;
  }
  onMedicineClicked() {}
  additionalChild() {}
  handleClick() {}

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

  render() {
    let medicineHistoryList = this.state.medicineHistory.map(
      (medicine, orderIndex) => {
        return (
          <div key={orderIndex} onClick={((e)=>this.onMedicineClicked(e, orderIndex)).bind(this)} onContextMenu={e => this.handleClick(e, medicine.prescription,medicine.prescription.done_order )} id="list-table">
            <ListItem
              department={medicine.prescription.order_data.department}
              ya
              doctor_name={medicine.prescription.order_data.doctor_name}
              class_name={medicine.prescription.order_data.class_name}
              substitute_name={medicine.prescription.order_data.substitute_name}
              diagnosing_date={
                medicine.prescription.order_data.executed_date_time
                  ? medicine.prescription.order_data.executed_date_time
                  : ""
              }
              is_internal_prescription={
                medicine.prescription.order_data.is_internal_prescription
              }
              onAngleClicked={this.onAngleClicked.bind(this)}
              number={medicine.prescription.number}
              isEdit={false}
              is_doctor_consented={medicine.prescription.is_doctor_consented}
              is_enabled={
                medicine.prescription.is_enabled !== undefined
                  ? medicine.prescription.is_enabled
                  : 1
              }
              isNotConsentedPopup={false}
              orderNumber={medicine.prescription.number}
              getOrderNumberList={this.getOrderNumberList}
              patientName={medicine.patient.name}
              receiverName={medicine.prescription.receiver_key_name}
              isFromPrescriptionList={true}
              done_order={medicine.prescription.done_order}
              karte_status={medicine.prescription.karte_status}
            />
            <HistoryListDiv>
              {medicine.prescription.order_data.order_data.map(
                (order, index) => {
                  return (
                    <HistoryList
                      key={this.getRandomKey()}
                      orderNumber={medicine.prescription.number}
                      patientId="169"
                      order_data={medicine.prescription.order_data}
                      order={order}
                      orderIndex={orderIndex}
                      serial_number={index + 1}
                      onCopyOrder={null}
                      onCopyOrders={null}
                      onEditOrders={null}
                      doctors={null}
                      doctor_code={medicine.prescription.order_data.doctor_name}
                      doctor_name={medicine.prescription.order_data.doctor_name}
                      setDoctorInfo={null}
                      patientInfo={null}
                      class_name={
                        medicine.prescription.order_data.class_name === "open"
                          ? ""
                          : "hidden"
                      }
                      is_doctor_consented={false}
                      is_enabled={
                        medicine.prescription.is_enabled !== undefined
                          ? medicine.prescription.is_enabled
                          : 1
                      }
                      openNotConsentedModal={false}
                      isNotConsentedPopup={false}
                      isNotConsentedDataLength={0}
                      forNotConsentedCheckDoctorCode={
                        medicine.prescription.order_data.doctor_code
                      }
                      consent={null}
                      isPatientInfo={true}
                      patientInfoObject={medicine.patient}
                    />
                  );
                }
              )}
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
        {this.state.isOpenPrescriptionDoneModal == true && (            
            <PrescriptionDoneModal
              patientId={this.state.system_patient_id}
              closeModal={this.closeDoneModal}
              modal_type={this.state.done_modal_type}
              modal_title={this.state.done_modal_title}
              modal_data={this.getCurrentItem(this.state.order_number)}
              patientInfo = {this.state.selectedMedPatientInfo}
              donePrescription={this.closeModalAndRefresh}
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

BasePrescriptionsTable.contextType = Context;
BasePrescriptionsTable.propTypes = {
  prescriptionsList: PropTypes.array,
  searchPrescriptionList:PropTypes.func,
  doctors: PropTypes.array,  
};

const ModalContent = styled.div`
  &.modal-content {
    width: 100%;
  }
  height: 68vh;
  .medicine-rank, .medicine-set {
    height: calc(100% - 1.6rem);
  }
`;
const PatientCardWrapper = styled.div`
  border-radius: 0px;
  border:5px solid #f2f2f2;
  box-shadow: 1px 1px 0 0 rgba(223, 223, 223, 0.5);
  padding: 0.3rem;
  width: 100%;
  margin-top: 5px;
  margin-right:10px;
  height: 6rem;
  .div-left-side{
    .pullbox-label, .pullbox-select{
      width:180px;
    }
  }
`;
const PatientId = styled.div`
  font-size: 1.5rem;
  font-family: NotoSansJP;
  margin-top: 1.5rem;
  margin-right: 1rem;
`;

const MODAL_TABS = [
  {
    id: 0,
    title: "処方歴"
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
      titleTab: 0,
      is_loaded: false,
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
    let resp = await axios.get("/app/api/v2/order/prescription/patient", {
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
      `/app/api/v2/order/prescription/preset`
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
    let data = sessApi.getDoctorList();
    if(data == null) {
        data = await apiClient.get("/app/api/v2/secure/doctor/search?");
    }

    this.setState({ 
      medicineHistory: medicineHistory, 
      medicineSetData: medicineSetData, 
      medicineRankData: medicineRankData,
      doctors: data,
      is_loaded: true,
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
        <Modal.Header >
          <PatientCardWrapper>
            <Wrapper>
              <div className="d-flex">
                {shortPatientInfo.sex === 1 ? (
                  <LargeUserIcon size="5x" color="#9eaeda" />
                ) : (
                  <LargeUserIcon size="5x" color="#f0baed" />
                )}
                <div className="ml-2">
                  <div className="d-flex">
                    <PatientId>{shortPatientInfo.receId}</PatientId>
                    <div className="name-area">
                      <Kana>{shortPatientInfo.kana}</Kana>
                      <PatientName>{shortPatientInfo.name}</PatientName>
                    </div>
                    <PatientId>
                    <div className='d-flex'>
                      <div className="birthday">{shortPatientInfo.birthDate}</div>
                      <div className="age">
                        {shortPatientInfo.age}歳 {shortPatientInfo.age_month}ヶ月
                      </div>
                    </div>
                  </PatientId>
                  </div>
              </div>
              </div>
            </Wrapper>
          </PatientCardWrapper>
        </Modal.Header>
        <Modal.Body>
          <ModalContent className="modal-content">
            {this.state.is_loaded ? (
              <div style={{height: "93%"}}>
                <TitleTabs
                  tabs={MODAL_TABS}
                  selectTitleTab={this.selectTitleTab.bind(this)}
                  id={this.state.titleTab}
                />
                {this.state.titleTab == 0 && (
                    <BasePrescriptionsTable prescriptionsList={this.state.medicineHistory}/>
                )}
                
                {this.state.titleTab == 1 && (
                  <MedicineRankSelection
                    isLoaded={true}
                    medicineRankData={this.state.medicineRankData}
                    className="medicine-rank"
                    allPrescriptionOpen={true}/>
                )}

                {this.state.titleTab == 2 && (
                  <MedicineSetSelection 
                    isLoaded={true}
                    patientId={this.props.patientId}
                    allPrescriptionOpen={true}
                    doctors={this.state.doctors}
                    doctor_code={this.context.selectedDoctor.code}
                    doctor_name={this.context.selectedDoctor.name}
                    setDoctorInfo={()=>{}}
                    consent={()=>{}}
                    medicineHistory={this.state.medicineSetData}
                    className="medicine-set"
                  />
                )}
                
              </div>
            ):(
              <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            )}
          </ModalContent>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
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


class PrescriptionsTable extends BasePrescriptionsTable{
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
    if(e.nativeEvent.which == 1){
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
      // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      // if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
      //   this.context.$selectDoctor(true);
      //   return;
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
        done_modal_title: "処方",
        done_modal_type: "prescription",
        done_modal_data: [],
        isOpenPrescriptionDoneModal: true
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
    let path = "/app/api/v2/order/prescription/execute";
    axios.post(path, {params: postData})
        .then(() => {
          window.sessionStorage.setItem("alert_messages", "実施しました。");
          this.props.searchPrescriptionList();
        })
        .catch(() => {
        });
  }
}


export default PrescriptionsTable;
