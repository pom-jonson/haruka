import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "../_nano/colors";
import Button from "../atoms/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck
} from "@fortawesome/pro-regular-svg-icons";
import SystemConfirmModal from "./SystemConfirmModal";
import UsageAlertModal from "../organisms/UsageAlertModal";
import MedicineDetailModal from "../organisms/MedicineDetailModal";
// import * as patientCacheApi from "~/helpers/cachePatient-utils";
import { CACHE_LOCALNAMES } from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
const DoubleModal = styled.div`
  font-family: NotoSansJP;
  font-size: 20px;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 4px 4px 4px 0;
  margin: 0;
  p{
    margin-bottom: 5px !important;
  }

  ul {
    padding-inline-start: 20px;
    li {

      span.medovername {
        display: inline-block;
        width: 240px;
      }
      span.btn {                                           
        display: inline;
        button {
          padding: 2px;
        }
      }
      span.chk {
        color: green;
      }
      .usage-permission-allow{
        background-color: #ffffcc; 
      }
      .usage-permission-reject{
        background-color: #ffddcc; 
      }

    }
  }

`;
const Icon = styled(FontAwesomeIcon)`
  font-size: 16px;
  margin: auto;
`;
class UsageOverModal extends Component {
  constructor(props) {
    super(props);
    // const cacheState = JSON.parse(
    //   window.localStorage.getItem("haruka_edit_cache")
    // );
    // const cacheState = patientCacheApi.getVal("local", this.props.patientId, CACHE_LOCALNAMES.PATIENT_PRESCRIPTION_EDIT);
    let active_key = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");                          
    const cacheState = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, active_key);

    if(cacheState == null || undefined == cacheState[0]){
      this.props.hideModal();
      return;
    }    

    this.state = {
      checkIdx : [],
      _presData : cacheState[0].presData,
      selected : -1,
      selModal: false,
      confirmMsg:"",
      usageAlertModal: false,
      usageMedDetailModal: false,      
      usageMedicineDetail: [],
      usageAlertContent: [],
    }    
  }

  handleOpenModal = (e, i) => {
    e.preventDefault();
    let strMsg = this.state._presData[this.props.items[i][0]].medicines[this.props.items[i][1]].usage_alert_content;
    if (strMsg == undefined) {
      strMsg = this.props.presData[this.props.items[i][0]].medicines[this.props.items[i][1]].usage_alert_content;
    }

    this.setState({
      selected: i,
      usageAlertModal: true,
      usageAlertContent: strMsg,
    });    
  }

  handleConfirm = () => {
    let chk = this.state.checkIdx;
    if(!chk.includes(this.state.selected)) {
      chk.push(this.state.selected);
    }
    this.setState({
      usageAlertModal: false,
      checkIdx: chk,
      selected: -1,
      usageAlertContent:""
    });    
  }

  handleCancel = () => {
    let chk = this.state.checkIdx;
    const index = chk.indexOf(this.state.selected);
    chk.splice(index, 1);
    this.setState({
      usageAlertModal: false,
      checkIdx: chk,
      selected: -1,
      usageAlertContent:""
    });    
    
  }
  handleOk = () => {
    this.props.handleOk(this.state.checkIdx);
  }

  handleUsageDetail = () =>{
    let detailInfo = {};
    let medicine = this.state._presData[this.props.items[this.state.selected][0]].medicines[this.props.items[this.state.selected][1]];
    detailInfo[medicine.medicineId] = medicine.medDetail;
    this.setState({
      usageMedDetailModal: true,
      usageMedicineDetail: detailInfo
    });    
  }

  handleUsageMedDetailCancel = () => {
    this.setState({
      usageMedDetailModal: false,
    }); 
  }

  async componentDidMount() {
    if (
      document.getElementById("system_btn_Ok") !== undefined &&
      document.getElementById("system_btn_Ok") !== null
    ) {
      document.getElementById("system_btn_Ok").focus();
    }
  }


  render() {    
    return (
      <Modal
        show={true}       
        id="usage_over_dlg"
        className = "system-modal"
        tabIndex="0"
      >

        <Modal.Body>
          <div className="auto-logout">  
              <DoubleModal>
              <div>用法用量の確認が必要な薬剤があります。<br />
クリックして確認してください。</div>
              <ul>
                {this.props.items.map((item, i) => {
                  let usage = this.state.checkIdx.includes(i) ? "usage-permission-allow" : "usage-permission-reject";
                  return (

                    <li key={i}>
                      <span className={`medovername ${usage}`}>{this.state._presData[item[0]].medicines[item[1]].medicineName}</span>
                      <span className="btn"><Button onClick={e=>this.handleOpenModal(e,i)} >内容確認</Button></span>
                      {this.state.checkIdx.includes(i) && (<span className="chk"><Icon icon={faCheck} /></span>)}
                    </li>
                  )
                })}
              </ul>
              </DoubleModal>
              {this.state.usageAlertModal === true && (
                <UsageAlertModal
                  hideModal = {this.handleUsageModal}
                  alertContent = {this.state.usageAlertContent}
                  handleOk = {this.handleConfirm.bind(this)}
                  handleCancel = {this.handleCancel.bind(this)}
                  handleDetail = {this.handleUsageDetail}
                />       
              )}
              {this.state.selModal && (
                <SystemConfirmModal
                  hideConfirm= {this.handleCancel.bind(this)}
                  confirmCancel= {this.handleCancel.bind(this)}
                  confirmOk= {this.handleConfirm.bind(this)}
                  confirmTitle= {this.state.confirmMsg}
                />
              )}              
              {this.state.usageAlertModal && this.state.usageMedDetailModal && (
                <MedicineDetailModal
                  hideModal={this.handleUsageMedDetailCancel}
                  handleCancel={this.handleUsageMedDetailCancel}
                  medicineDetailList={this.state.usageMedicineDetail}
                />
              )}             
          </div>
        </Modal.Body>        
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.hideModal}>閉じる</Button>
          <Button className="red-btn" id="system_btn_Ok" onClick={this.handleOk.bind(this)}>OK</Button>
        </Modal.Footer>
      </Modal>


    );
  }
}
UsageOverModal.propTypes = {  
  hideModal: PropTypes.func,
  handleOk: PropTypes.func,
  showMedicineContent: PropTypes.string,
  items: PropTypes.array,
  presData: PropTypes.array,
  patientId: PropTypes.number,
};

export default UsageOverModal;
