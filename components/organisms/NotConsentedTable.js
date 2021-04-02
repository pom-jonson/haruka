import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Checkbox from "~/components/molecules/Checkbox";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";
import * as colors from "~/components/_nano/colors";
import renderHTML from "react-render-html";
import {formatJapanDateSlash} from "~/helpers/date";
import {midEmphasis} from "~/components/_nano/colors";
import {disable} from "~/components/_nano/colors";
import {secondary200} from "~/components/_nano/colors";
import ChangeRadiationLogModal from "~/components/organisms/ChangeRadiationLogModal";
import ChangeRehabilyLogModal from "~/components/organisms/ChangeRehabilyLogModal";
import ChangeExaminationLogModal from "~/components/organisms/ChangeExaminationLogModal";
import ChangeTreatmentLogModal from "~/components/organisms/ChangeTreatmentLogModal";
import ChangeInspectionLogModal from "~/components/organisms/ChangeInspectionLogModal";
import axios from "axios/index";
import ChangeGuidanceLogModal from "~/components/organisms/ChangeGuidanceLogModal";
import ChangeAllergyLogModal from "~/components/organisms/ChangeAllergyLogModal";
import {ALLERGY_TYPE_ARRAY, ALLERGY_STATUS_ARRAY, getInspectionName} from "~/helpers/constants";
import {displayLineBreak} from "~/helpers/dialConstants"
import CytologyExamOrderData from "../templates/Patient/Modals/Examination/CytologyExamOrderData";
import RadiationData from "~/components/templates/Patient/components/RadiationData";
import {formatTimeIE} from "../../helpers/date";

const Wrapper = styled.div`
  width: 100%;
  font-size: 14px;
  font-family: "Noto Sans JP", sans-serif;
  .flex {
    display: flex;
  }
  table {
    td {
        padding:0;
    }
  }
  .main-block {
    display: flex;
    cursor: pointer;
  }
  .ixnvCM {
    padding-left: 8px;
  }
  .red-line {
      background-color: ${colors.error};
      width: 8px;
  }
  .create-date {
    font-family: NotoSansJP;
  }
  .close-angle {
    transform: rotate(180deg);
  }
  .span-color {
    color: ${colors.error};
  }
  .first-tr {
    display: flex;
    width: 100%;
    position: relative;
    padding: 8px 32px 8px 0px;
  }
  .angle {
    position: absolute;
    top: 0px;
    right: 8px;
    bottom: 0px;
    margin: auto;
  }
  .name-label {
    margin-left: auto;
    text-align: right;
    font-size: 12px;
  }
  .deleted-order {
    background: rgb(221, 221, 221);
  }
`;

const Angle = styled(FontAwesomeIcon)`
  color: ${colors.onSurface};
  cursor: pointer;
  display: inline-block;
  font-size: 25px;
`;

const MedicineListWrapper = styled.div`
  font-size: 12px;
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
    margin-left: 16px;
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
    // width: calc(100% - 80px);
    width:830px;
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
  .deleted-data {
    color:red;
  }
`;

const historyButtonStyle = {
  textAlign: "center",
  color: "red",
  cursor: "pointer",
  marginLeft: "0.5rem",
  fontSize:"12px",
  
};


class NotConsentedTable extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.state = {
      departmentOptions,
      historyGuidanceModal: false,
      historyInspectionModal: false,
      historyTreatmentModal: false,
      historyExaminationModal: false,
      historyRehabilyModal: false,
      historyRadiationModal: false,
      historyAllergyModal: false,
    }
  }
  
  async componentDidMount() {
  }
  
  getRadio = (name, index) => {
    let table_data = this.props.table_data;
    if (name === "check") {
      table_data[index]['data_one_select'] = !table_data[index]['data_one_select'];
    }
    this.setState({table_data});
  };
  
  viewDetailTr =(index, e)=>{
    e.stopPropagation();
    e.preventDefault();
    let table_data = this.props.table_data;
    table_data[index]['class_name'] = table_data[index]['class_name'] === "open" ? "" : "open";
    this.setState({table_data});
  }
  
  openChangeModal =(order_name, patient_id, number, history,e)=>{
    e.stopPropagation();
    e.preventDefault();
    this.getHistory({
      number: number,
      id: patient_id,
      arrNumbers: history,
      order_name,
    });
  }
  
  getHistory = async (params) => {
    const { data } = await axios.post("/app/api/v2/order/find/history", {
      params: {
        patient_id: params.id,
        limit: 1000,
        offset: 0,
        type: params.order_name,
        numbers: params.arrNumbers,
      }
    });
    var resultData = Object.keys(data).map(i=>data[i]);
    var result = [];
    var nLength = resultData.length - 1;
    resultData.map((item, index)=>{
      result[nLength - index] = item;
    });
    let historyInspectionModal = (params.order_name === "inspection" || params.order_name === "endoscope") ? true : false;
    let historyGuidanceModal = (params.order_name === "guidance" || params.order_name === "home" || params.order_name === "spirit") ? true : false;
    let historyTreatmentModal = params.order_name === "treatment" ? true : false;
    let historyExaminationModal = params.order_name === "examination" ? true : false;
    let historyRehabilyModal = params.order_name === "rehabily" ? true : false;
    let historyRadiationModal = params.order_name === "radiation" ? true : false;
    let historyAllergyModal = params.order_name === "allergy";
    
    this.setState({
      historyGuidanceModal,
      historyInspectionModal,
      historyTreatmentModal,
      historyExaminationModal,
      historyRehabilyModal,
      historyRadiationModal,
      historyAllergyModal,
      selectedOrderNumber: params.number,
      historySoapList: result
    });
  };
  
  closeModal = () => {
    this.setState({
      historyGuidanceModal: false,
      historyInspectionModal: false,
      historyTreatmentModal: false,
      historyExaminationModal: false,
      historyRehabilyModal: false,
      historyRadiationModal: false,
      historyAllergyModal: false,
      selectedOrderNumber: 0
    });
  }
  
  getDepartment = id => {
    let departmentStr = "";
    this.state.departmentOptions.map(item => {
      if (parseInt(item.id) === parseInt(id)) {
        departmentStr = item.value;
      }
    });
    
    return departmentStr;
  }
  
  getInsuranceName = (_insuranceName) => {
    let result = "既定";
    if (_insuranceName == undefined || _insuranceName == null || _insuranceName == "") return result;
    return _insuranceName
  }
  
  render() {
    return (
      <Wrapper>
        <table className="table-scroll table table-bordered" id="code-table">
          {this.props.table_data.length > 0 && (
            this.props.table_data.map((item, index) => {
              if(item.order_data != null && item.order_data !== undefined){
                return (
                  <>
                    <tr>
                      <td style={{width:"100%"}}>
                        <div className={item.is_enabled === 2 ?'deleted-order main-block' : 'main-block'} onClick={this.viewDetailTr.bind(this, index)}>
                          {item.class_name === "open" && (
                            <div className={'red-line'}></div>
                          )}
                          <div className={'first-tr'}>
                            <Checkbox
                              label="選択"
                              number={index}
                              getRadio={this.getRadio.bind(this)}
                              value={item.data_one_select}
                              name={"check"}
                            />
                            <div className={'create-date'}>
                              {(item.created_at != null  && item.created_at !== '') && (
                                <>
                                  <span>{item.created_at.substr(0, 4)}年</span>
                                  <span>{item.created_at.substr(5, 2)}月</span>
                                  <span>{item.created_at.substr(8, 2)}日</span>
                                  <span>{item.created_at.substr(11, 2)}時</span>
                                  <span>{item.created_at.substr(14, 2)}分</span>
                                </>
                              )}
                            </div>
                            <div className={'span-color'} style={{paddingLeft:"8px", marginRight:"4px"}}>
                              {this.props.order_name === "inspection" && (
                                <span>{getInspectionName(item.order_data.order_data.inspection_id)}</span>
                              )}
                              {this.props.order_name === "endoscope" && (
                                <span>{item.order_data.order_data.inspection_name}</span>
                              )}
                              {(this.props.order_name === "examination") && (
                                <span>検体検査</span>
                              )}
                              {(this.props.order_name === "treatment") && (
                                <span>{item.general_id === 2 ? "在宅処置" : item.general_id === 3 ? "入院処置": "外来処置"}</span>
                              )}
                              {(this.props.order_name === "guidance") && (
                                <span>汎用オーダー</span>
                              )}
                              {(this.props.order_name === "home") && (
                                <span>在宅</span>
                              )}
                              {(this.props.order_name === "spirit") && (
                                <span>精神</span>
                              )}
                              {(this.props.order_name === "rehabily") && (
                                <span>リハビリ</span>
                              )}
                              {(this.props.order_name === "radiation") && (
                                <span>放射線</span>
                              )}
                              {(this.props.order_name === "allergy") && (
                                <span>{ALLERGY_TYPE_ARRAY[item.order_data.order_data.type]}</span>
                              )}
                            </div>
                            <div style={{marginLeft:"16px", fontSize:"12px"}}>{item.patient_name}[{item.patient_number}]</div>
                            {item.history != null && item.history !== "" && item.history.split(",").length > 1 && (
                              <span onClick={this.openChangeModal.bind(this, this.props.order_name, item.patient_id, item.number, item.history)} style={historyButtonStyle}>(0{item.history.split(",").length}版)</span>
                            )}
                            <div className={'name-label'}>
                              <div style={{textAlign:"right"}}>
                                <span className={'span-color'}>[未承認]</span><span>{item.is_enabled === 2 ? "[削除済み]" : ""}</span>
                                依頼医:<span className={'span-color'}>{this.props.order_name == "treatment" ? item.order_data.order_data.header.doctor_name : item.order_data.order_data.doctor_name}</span>
                              </div>
                              <div style={{textAlign:"right"}}>入力者: {this.props.order_name == "treatment" ? item.order_data.order_data.header.substitute_name :
                                (this.props.order_name == "examination" ?item.order_data.substitute_name : item.order_data.order_data.substitute_name)}</div>
                            </div>
                            <Angle className={item.class_name === "open" ? 'angle':"angle close-angle"} icon={faAngleDown} />
                          </div>
                        </div>
                      </td>
                    </tr>
                    {item.class_name === "open" && (
                      <tr>
                        {(this.props.order_name === "inspection" || this.props.order_name === "endoscope") && (
                          <MedicineListWrapper>
                            <div className="history-item soap-data-item">
                              <div className={item.is_enabled === 2 ? "history-item deleted-data" : "history-item"}>
                                <div className="phy-box w70p" draggable="true">
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">検査日</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {item.inspection_DATETIME == null ? "[日未定]" : formatJapanDateSlash(item.inspection_DATETIME)}{item.is_emergency == 1 && renderHTML("<span className='note-red'>[当日緊急]</span>")}
                                      </div>
                                    </div>
                                  </div>
                                  {item.order_data.order_data.classification1_name != undefined && item.order_data.order_data.classification1_name != "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">検査種別</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{item.order_data.order_data.classification1_name}</div>
                                      </div>
                                    </div>
                                  )}
                                  {item.order_data.order_data.classification2_name != undefined && item.order_data.order_data.classification2_name != "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">検査詳細</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{item.order_data.order_data.classification2_name}</div>
                                      </div>
                                    </div>
                                  )}
                                  {/* ---------- start 内視鏡------------- */}
                                  {item.order_data.order_data.inspection_type_name != undefined && item.order_data.order_data.inspection_type_name != "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">検査種別</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{item.order_data.order_data.inspection_type_name}</div>
                                      </div>
                                    </div>
                                  )}
                                  {item.order_data.order_data.inspection_item_name != undefined && item.order_data.order_data.inspection_item_name != "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">検査項目</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{item.order_data.order_data.inspection_item_name}</div>
                                      </div>
                                    </div>
                                  )}
                                  {item.order_data.order_data.endoscope_purpose_name != undefined && item.order_data.order_data.endoscope_purpose_name != "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">検査目的</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{item.order_data.order_data.endoscope_purpose_name}</div>
                                      </div>
                                    </div>
                                  )}
                                  {item.order_data.order_data.inspection_purpose != undefined && item.order_data.order_data.inspection_purpose != null && item.order_data.order_data.inspection_purpose.length > 0 && (
                                    item.order_data.order_data.inspection_purpose.map((item, index) =>{
                                      return (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              {index == 0 && (
                                                <div className="table-item">検査目的</div>
                                              )}
                                              {index != 0 && (
                                                <div className="table-item"></div>
                                              )}
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.name}</div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })
                                  )}
                                  {item.order_data.order_data.inspection_symptom != undefined && item.order_data.order_data.inspection_symptom != null && item.order_data.order_data.inspection_symptom.length > 0 && (
                                    item.order_data.order_data.inspection_symptom.map((item, index)=>{
                                      return (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              {index ==0 && (
                                                <div className="table-item">現症</div>
                                              )}
                                              {index !=0 && (
                                                <div className="table-item"></div>
                                              )}
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.name}</div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })
                                  )}
                                  {item.order_data.order_data.inspection_risk != undefined && item.order_data.order_data.inspection_risk != null && item.order_data.order_data.inspection_risk.length > 0 && (
                                    item.order_data.order_data.inspection_risk.map((item, index)=>{
                                      return (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              {index ==0 && (
                                                <div className="table-item">{item.title}</div>
                                              )}
                                              {index !=0 && (
                                                <div className="table-item"></div>
                                              )}
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.name}</div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })
                                  )}
                                  {/* --------------------- start --------------- */}
                                  {item.order_data.order_data.inspection_sick != undefined && item.order_data.order_data.inspection_sick != null && item.order_data.order_data.inspection_sick.length > 0 && (
                                    item.order_data.order_data.inspection_sick.map((item, index)=>{
                                      return (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              {index ==0 && (
                                                <div className="table-item">{item.title}</div>
                                              )}
                                              {index !=0 && (
                                                <div className="table-item"></div>
                                              )}
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.name}</div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })
                                  )}
                                  {item.order_data.order_data.inspection_request != undefined && item.order_data.order_data.inspection_request != null && item.order_data.order_data.inspection_request.length > 0 && (
                                    item.order_data.order_data.inspection_request.map((item, index)=>{
                                      return (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              {index ==0 && (
                                                <div className="table-item">{item.title}</div>
                                              )}
                                              {index !=0 && (
                                                <div className="table-item"></div>
                                              )}
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.name}</div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })
                                  )}
                                  {item.order_data.order_data.is_anesthesia != undefined && item.order_data.order_data.is_anesthesia != null && item.order_data.order_data.is_anesthesia.length > 0 && (
                                    item.order_data.order_data.is_anesthesia.map((item, index)=>{
                                      return (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              {index ==0 && (
                                                <div className="table-item">{item.title}</div>
                                              )}
                                              {index !=0 && (
                                                <div className="table-item"></div>
                                              )}
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.name}</div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })
                                  )}
                                  {item.order_data.order_data.is_sedation != undefined && item.order_data.order_data.is_sedation != null && item.order_data.order_data.is_sedation.length > 0 && (
                                    item.order_data.order_data.is_sedation.map((item, index)=>{
                                      return (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              {index ==0 && (
                                                <div className="table-item">{item.title}</div>
                                              )}
                                              {index !=0 && (
                                                <div className="table-item"></div>
                                              )}
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.name}</div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })
                                  )}
                                  {item.order_data.order_data.inspection_movement != undefined && item.order_data.order_data.inspection_movement != null && item.order_data.order_data.inspection_movement.length > 0 && (
                                    item.order_data.order_data.inspection_movement.map((item, index)=>{
                                      return (
                                        <>
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              {index ==0 && (
                                                <div className="table-item">患者移動形態</div>
                                              )}
                                              {index !=0 && (
                                                <div className="table-item"></div>
                                              )}
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{item.name}</div>
                                            </div>
                                          </div>
                                        </>
                                      )
                                    })
                                  )}
                                  {(item.order_data.order_data.body_part !== undefined && item.order_data.order_data.body_part !== "") && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">部位指定コメント</div>
                                      </div>
                                      <div className="text-right">
                                        <div className={'table-item remarks-comment'}>
                                          {item.order_data.order_data.body_part}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  {item.order_data.order_data.height != undefined && item.order_data.order_data.height != null && item.order_data.order_data.height != "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">身長</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{item.order_data.order_data.height}cm</div>
                                      </div>
                                    </div>
                                  )}
                                  {item.order_data.order_data.weight != undefined && item.order_data.order_data.weight != null && item.order_data.order_data.weight != "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">体重</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{item.order_data.order_data.weight}kg</div>
                                      </div>
                                    </div>
                                  )}
                                  {item.order_data.order_data.surface_area != undefined && item.order_data.order_data.surface_area != null && item.order_data.order_data.surface_area != "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">体表面積</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{item.order_data.order_data.surface_area}㎡</div>
                                      </div>
                                    </div>
                                  )}
                                  {item.order_data.order_data.connection_date_title !== undefined && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">{item.order_data.order_data.connection_date_title}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{formatJapanDateSlash(item.order_data.order_data.calculation_start_date)}</div>
                                      </div>
                                    </div>
                                  )}
                                  {item.order_data.order_data.sick_name != undefined && item.order_data.order_data.sick_name != null && item.order_data.order_data.sick_name != "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">臨床診断、病名</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{item.order_data.order_data.sick_name}</div>
                                      </div>
                                    </div>
                                  )}
                                  {item.order_data.order_data.etc_comment != undefined && item.order_data.order_data.etc_comment != null && item.order_data.order_data.etc_comment != "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">主訴、臨床経過、検査目的、コメント</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{item.order_data.order_data.etc_comment}</div>
                                      </div>
                                    </div>
                                  )}
                                  {item.order_data.order_data.special_presentation != undefined && item.order_data.order_data.special_presentation != "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">特殊提示</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{item.order_data.order_data.special_presentation}</div>
                                      </div>
                                    </div>
                                  )}
                                  {item.order_data.order_data.count != undefined && item.order_data.order_data.count != "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">{item.order_data.order_data.count_label !=''?item.order_data.order_data.count_label:''}</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{item.order_data.order_data.count}{item.order_data.order_data.count_suffix !=''?item.order_data.order_data.count_suffix:''}</div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </MedicineListWrapper>
                        )}
                        {this.props.order_name === "examination" && (
                          <MedicineListWrapper>
                            <div className="history-item soap-data-item">
                              <div className={item.is_enabled === 2 ? "history-item deleted-data" : "history-item"}>
                                <div className="phy-box w70p" draggable="true">
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">検査日時</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {item.order_data.order_data.collected_date === "" ? "次回診察日" : item.order_data.order_data.collected_time === "" ? item.order_data.order_data.collected_date.split("-").join("/") : item.order_data.order_data.collected_date.split("-").join("/")+"  "+item.order_data.order_data.collected_time.substr(0,item.order_data.order_data.collected_time.length-3)}
                                      </div>
                                    </div>
                                  </div>
                                  {item.order_data.order_data.subject != undefined && item.order_data.order_data.subject != null && item.order_data.order_data.subject != '' && (
                                    <>
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          <div className="table-item">概要</div>
                                          <div className="table-item remarks-comment">{item.order_data.order_data.subject}</div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">検査項目</div>
                                    </div>
                                    <div className="text-right">
                                      {item.order_data.order_data.examinations.map((item)=> {
                                        return (
                                          <>
                                            <div className="table-item remarks-comment">{item.urgent != undefined && item.urgent == 1? "【至急】": ""}{item.name}</div>
                                          </>
                                        
                                        )
                                      })}
                                    </div>
                                  </div>
                                  <CytologyExamOrderData cache_data={item.order_data.order_data} from_source={"detail-modal"}/>
                                  {item.order_data.order_data.todayResult === 1 && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">当日結果説明</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">あり</div>
                                      </div>
                                    </div>
                                  )}
                                  {item.order_data.order_data.order_comment !== "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">依頼コメント</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {item.order_data.order_data.order_comment_urgent != undefined && item.order_data.order_data.order_comment_urgent == 1?"【至急】":""}
                                          {item.order_data.order_data.fax_report != undefined && item.order_data.order_data.fax_report == 1?"【FAX報告】":""}
                                          {item.order_data.order_data.order_comment}</div>
                                      </div>
                                    </div>
                                  )}
                                  {item.order_data.order_data.free_comment !== "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">フリーコメント</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{item.order_data.order_data.free_comment}</div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </MedicineListWrapper>
                        )}
                        {this.props.order_name === "treatment" && (
                          <MedicineListWrapper>
                            <div className="history-item soap-data-item">
                              <div className={item.is_enabled === 2 ? "history-item deleted-data" : "history-item"}>
                                <div className="phy-box w70p" draggable="true">
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">処置日</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {item.order_data.order_data.header.date == undefined || item.order_data.order_data.header.date == null || item.order_data.order_data.header.date == "" ? "" : (item.order_data.order_data.header.start_time === "" ? item.order_data.order_data.header.date.split("-").join("/") : item.order_data.order_data.header.date.split("-").join("/")+"  "+item.order_data.order_data.header.start_time)}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">保険</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {this.getInsuranceName(item.order_data.order_data.header.insurance_name)}
                                      </div>
                                    </div>
                                  </div>
                                  {item.order_data.order_data.detail.map((detail)=>{
                                    return(
                                      <>
                                        {detail.classification_name != undefined && detail.classification_name != "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">分類</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{detail.classification_name}</div>
                                            </div>
                                          </div>
                                        )}
                                        {detail.practice_name != undefined && detail.practice_name != "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">行為名</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{detail.practice_name}</div>
                                            </div>
                                          </div>
                                        )}
                                        {detail.request_name != undefined && detail.request_name != "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">請求情報</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{detail.request_name}</div>
                                            </div>
                                          </div>
                                        )}
                                        {detail.position_name != undefined && detail.position_name != "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">部位</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{detail.position_name}</div>
                                            </div>
                                          </div>
                                        )}
                                        {detail.side_name != undefined && detail.side_name != "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">左右</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{detail.side_name}</div>
                                            </div>
                                          </div>
                                        )}
                                        {detail.barcode != undefined && detail.barcode != "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">バーコード</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{detail.barcode}</div>
                                            </div>
                                          </div>
                                        )}
                                        {detail.treat_detail_item != undefined && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">個別指示</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                {detail.treat_detail_item.map(detail_item=>{
                                                  let oxygen_data = detail['oxygen_data'] !== undefined && detail['oxygen_data'] != null ?
                                                    JSON.parse(detail['oxygen_data']) : null;
                                                  return(
                                                    <>
                                                      <div>
                                                        <label>・{detail_item.item_name}：</label>
                                                        <label>{detail_item.count}</label>
                                                        {(detail_item.unit_name !== '' || (detail_item.main_unit != null && detail_item.main_unit !== '')) && (
                                                          <>
                                                            <label>{detail_item.unit_name !== '' ? detail_item.unit_name : detail_item.main_unit}</label>
                                                          </>
                                                        )}
                                                        <br />
                                                        {oxygen_data != null && oxygen_data.length > 0 && oxygen_data.map((oxygen_item, oxygen_index)=>{
                                                          let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
                                                          if (oxygen_index > 0 && oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
                                                          return (
                                                            <div key={oxygen_item}>
                                                              <label>{oxygen_inhaler_name} {formatTimeIE(oxygen_item.start_time)}~{formatTimeIE(oxygen_item.end_time)}</label>
                                                              {oxygen_item.oxygen_flow !== undefined && oxygen_item.oxygen_flow != "" && (
                                                                <label className="ml-2">{oxygen_item.oxygen_flow}L/分</label>
                                                              )}
                                                              {oxygen_item.fio2_value !== undefined && oxygen_item.fio2_value != "" && (
                                                                <label className="ml-2">{oxygen_item.fio2_value * 100}%</label>
                                                              )}
                                                            </div>
                                                          )
                                                        })}
                                                        {detail_item.lot !== undefined && detail_item.lot != null && detail_item.lot !== '' && (
                                                          <>
                                                            <label>ロット:{detail_item.lot}</label><br />
                                                          </>
                                                        )}
                                                        {detail_item.comment !== undefined && detail_item.comment != null && detail_item.comment !== '' && (
                                                          <>
                                                            <label>フリーコメント:{detail_item.comment}</label><br />
                                                          </>
                                                        )}
                                                      </div>
                                                    </>
                                                  )
                                                })}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {(detail.treat_done_info !== undefined && detail.treat_done_info.length > 0) && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">実施情報</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">
                                                {detail.treat_done_info.map(done_detail=>{
                                                  let oxygen_data = detail['oxygen_data'] !== undefined && detail['oxygen_data'] != null ?
                                                    JSON.parse(detail['oxygen_data']) : null;
                                                  return(
                                                    <>
                                                      <div>
                                                        <label>・{done_detail.item_name}：</label>
                                                        <label>{done_detail.count}</label>
                                                        {(done_detail.unit_name !== '' || (done_detail.main_unit != null && done_detail.main_unit !== '')) && (
                                                          <>
                                                            <label>{done_detail.unit_name !== '' ? done_detail.unit_name : done_detail.main_unit}</label>
                                                          </>
                                                        )}
                                                        <br />
                                                        {oxygen_data != null && oxygen_data.length > 0 && oxygen_data.map((oxygen_item, oxygen_index)=>{
                                                          let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
                                                          if (oxygen_index > 0 && oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
                                                          return (
                                                            <div key={oxygen_item}>
                                                              <label>{oxygen_inhaler_name} {formatTimeIE(oxygen_item.start_time)}~{formatTimeIE(oxygen_item.end_time)}</label>
                                                              {oxygen_item.oxygen_flow !== undefined && oxygen_item.oxygen_flow != "" && (
                                                                <label className="ml-2">{oxygen_item.oxygen_flow}L/分</label>
                                                              )}
                                                              {oxygen_item.fio2_value !== undefined && oxygen_item.fio2_value != "" && (
                                                                <label className="ml-2">{oxygen_item.fio2_value * 100}%</label>
                                                              )}
                                                            </div>
                                                          )
                                                        })}
                                                        {done_detail.lot !== undefined && done_detail.lot != null && done_detail.lot !== '' && (
                                                          <>
                                                            <label>ロット:{done_detail.lot}</label><br />
                                                          </>
                                                        )}
                                                        {done_detail.comment !== undefined && done_detail.comment != null && done_detail.comment !== '' && (
                                                          <>
                                                            <label>フリーコメント:{done_detail.comment}</label><br />
                                                          </>
                                                        )}
                                                      </div>
                                                    </>
                                                  )
                                                })}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                        {detail.comment != undefined && detail.comment != "" && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">コメント</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{detail.comment}</div>
                                            </div>
                                          </div>
                                        )}
                                        {detail.done_comment !== undefined && (
                                          <div className="flex between drug-item table-row">
                                            <div className="text-left">
                                              <div className="table-item">実施コメント</div>
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item remarks-comment">{displayLineBreak(detail.done_comment)}</div>
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    )
                                  })}
                                  {item.order_data.order_data.item_details !== undefined && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item"> </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {item.order_data.order_data.item_details.map(detail=>{
                                            return(
                                              <>
                                                <div><label>{detail.item_name}
                                                  {((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": ""}</label>
                                                  {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                    <><label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}{detail.unit_name1 != undefined ? detail.unit_name1 : ""}</label><br /></>
                                                  )}
                                                  {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                    <><label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}{detail.unit_name2 != undefined ? detail.unit_name2 : ""}</label><br /></>
                                                  )}
                                                </div>
                                              </>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </MedicineListWrapper>
                        )}
                        {(this.props.order_name === "guidance" || this.props.order_name === "home" || this.props.order_name === "spirit") && (
                          <MedicineListWrapper>
                            <div className="history-item soap-data-item">
                              <div className={item.is_enabled === 2 ? "history-item deleted-data" : "history-item"}>
                                <div className="phy-box w70p" draggable="true">
                                  {item.order_data.order_data.classific_id !== undefined && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">分類</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{item.order_data.order_data.classific_name}</div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {item.order_data.order_data.classific_detail_id !== undefined && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">分類詳細</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{item.order_data.order_data.classific_detail_name}</div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {item.order_data.order_data.details !== undefined && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item"> </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {item.order_data.order_data.details.map(detail=>{
                                            return(
                                              <>
                                                <div><label>・{detail.item_name}
                                                  {((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": ""}</label>
                                                  {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                                    <><label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}</label><br /></>
                                                  )}
                                                  {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                                    <><label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}</label><br /></>
                                                  )}
                                                </div>
                                              </>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {item.order_data.order_data.comment !== undefined && item.order_data.order_data.comment !== "" && (
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">コメント</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">{item.order_data.order_data.comment}</div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </MedicineListWrapper>
                        )}
                        {this.props.order_name === "rehabily" && (
                          <MedicineListWrapper>
                            <div className="history-item soap-data-item">
                              <div className={item.is_enabled === 2 ? "history-item deleted-data" : "history-item"}>
                                <div className="phy-box w70p" draggable="true">
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">依頼日</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {item.order_data.order_data.request_date !== undefined && item.order_data.order_data.request_date != null && item.order_data.order_data.request_date !== "" ? item.order_data.order_data.request_date : ""}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">依頼医</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {item.order_data.order_data.request_doctor_name !== undefined && item.order_data.order_data.request_doctor_name != null && item.order_data.order_data.request_doctor_name !== "" ? item.order_data.order_data.request_doctor_name : ""}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">処方日</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {item.order_data.order_data.prescription_date !== undefined && item.order_data.order_data.prescription_date != null && item.order_data.order_data.prescription_date !== "" ? item.order_data.order_data.prescription_date : ""}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">処方医</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {item.order_data.order_data.prescription_doctor_name !== undefined && item.order_data.order_data.prescription_doctor_name != null && item.order_data.order_data.prescription_doctor_name !== "" ? item.order_data.order_data.prescription_doctor_name : ""}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">経過・RISK・合併症等</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {item.order_data.order_data.free_comment !== undefined && item.order_data.order_data.free_comment != null && item.order_data.order_data.free_comment !== "" ? item.order_data.order_data.free_comment : ""}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex between drug-item table-row">
                                    <div className="text-left">
                                      <div className="table-item">特記事項</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="table-item remarks-comment">
                                        {item.order_data.order_data.special_comment !== undefined && item.order_data.order_data.special_comment != null && item.order_data.order_data.special_comment !== "" ? item.order_data.order_data.special_comment : ""}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </MedicineListWrapper>
                        )}
                        {this.props.order_name === "radiation" && (
                          <MedicineListWrapper>
                            <div className={item.is_enabled === 2 ? "soap-data-item history-item deleted-data" : "soap-data-item history-item"}>
                              <RadiationData
                                data = {item.order_data.order_data}
                              />
                            </div>
                          </MedicineListWrapper>
                        )}
                        {this.props.order_name === "allergy" && (
                          <MedicineListWrapper>
                            <div className="history-item soap-data-item">
                              <div className="phy-box w70p" draggable="true">
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">
                                      {item.order_data.order_data.type === "past" ? "既往歴" : ALLERGY_TYPE_ARRAY[item.order_data.order_data.type]}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{displayLineBreak(item.order_data.order_data.body_1)}</div>
                                  </div>
                                </div>
                                {(item.order_data.order_data.type === "past" || item.order_data.order_data.type === "infection" || item.order_data.order_data.type === "alergy") && (
                                  <>
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">
                                          {item.order_data.order_data.type === "past" ? "アレルギー" : "状態"}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {(item.order_data.order_data.type === "infection" || item.order_data.order_data.type === "alergy") ?
                                            ALLERGY_STATUS_ARRAY[parseInt(item.order_data.order_data.body_2)] :
                                            displayLineBreak(item.order_data.order_data.body_2)}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </MedicineListWrapper>
                        )}
                      </tr>
                    )}
                  </>
                )
              }
            })
          )}
        </table>
        
        {this.state.historyInspectionModal && (
          <ChangeInspectionLogModal
            closeModal={this.closeModal}
            historySoapList={this.state.historySoapList}
            orderNumber={this.state.selectedOrderNumber}
            insuranceTypeList={this.props.patientInfo.insurance_type_list}
            getDepartmentName={this.getDepartment}
            size="lg"
          />
        )}
        {this.state.historyTreatmentModal && (
          <ChangeTreatmentLogModal
            closeModal={this.closeModal}
            historySoapList={this.state.historySoapList}
            orderNumber={this.state.selectedOrderNumber}
            insuranceTypeList={this.props.patientInfo.insurance_type_list}
            getDepartmentName={this.getDepartment}
            size="lg"
          />
        )}
        {this.state.historyExaminationModal && (
          <ChangeExaminationLogModal
            closeModal={this.closeModal}
            historySoapList={this.state.historySoapList}
            orderNumber={this.state.selectedOrderNumber}
            insuranceTypeList={this.props.patientInfo.insurance_type_list}
            getDepartmentName={this.getDepartment}
            size="lg"
          />
        )}
        {this.state.historyRehabilyModal && (
          <ChangeRehabilyLogModal
            closeModal={this.closeModal}
            historySoapList={this.state.historySoapList}
            orderNumber={this.state.selectedOrderNumber}
            insuranceTypeList={this.props.patientInfo.insurance_type_list}
            getDepartmentName={this.getDepartment}
            size="lg"
          />
        )}
        {this.state.historyRadiationModal && (
          <ChangeRadiationLogModal
            closeModal={this.closeModal}
            historySoapList={this.state.historySoapList}
            orderNumber={this.state.selectedOrderNumber}
            insuranceTypeList={this.props.patientInfo.insurance_type_list}
            getDepartmentName={this.getDepartment}
            size="lg"
          />
        )}
        {this.state.historyGuidanceModal && (
          <ChangeGuidanceLogModal
            closeModal={this.closeModal}
            historySoapList={this.state.historySoapList}
            orderNumber={this.state.selectedOrderNumber}
            insuranceTypeList={this.props.patientInfo.insurance_type_list}
            getDepartmentName={this.getDepartment}
            size="lg"
          />
        )}
        {this.state.historyAllergyModal && (
          <ChangeAllergyLogModal
            closeModal={this.closeModal}
            historySoapList={this.state.historySoapList}
            orderNumber={this.state.selectedOrderNumber}
            insuranceTypeList={this.props.patientInfo.insurance_type_list}
            getDepartmentName={this.getDepartment}
            size="lg"
          />
        )}
      </Wrapper>
    );
  }
}

NotConsentedTable.propTypes = {
  order_name:PropTypes.string,
  table_data:PropTypes.array,
  patientInfo: PropTypes.array,
};

export default NotConsentedTable;
