import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import axios from "axios";
// import RadioButtonOver from "../molecules/RadioButtonOver";
import styled from "styled-components";
// import { KEY_CODES } from "../../helpers/constants";
import Button from "../atoms/Button";
import { Input } from "../../style/common";
import Context from "~/helpers/configureStore";
import {CACHE_LOCALNAMES, CACHE_SESSIONNAMES} from "~/helpers/constants"
import * as karteApi from "~/helpers/cacheKarte-utils";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import * as sessApi from "~/helpers/cacheSession-utils";

const TabContent = styled.div`
  display: block;
  max-width: 100%;
  width: 649px;
  height: calc(100vh*0.65);
  padding: 9px 9px 9px 2px;
  max-height: 700px;
  overflow: auto;
  position: relative;

  .usageListContainer {
    position: relative;
  }

  .usageListContainer > div {
    display: block;
  }

  .register-name{
    input{
      width: 100%;
      text-align: left;
      padding-left: 10px;
    }    
  }

  .error{
    color: #CC0000;
  }
`;


export class RegisterModal extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.onChangeValue = this.onChangeValue.bind(this);
    this.state={
      hasAlert: false,
      alertMsg: "",
      hasError: false,
      confirm_message:"",
      alert_messages:"",
      medicineSetData: this.props.setData
    }
  }

  async componentDidMount() {
    setTimeout(function() {
      this.textInput.focus();
    }.bind(this), 0);
    if (this.props.setData == null || this.props.setData == undefined) {
      this.getSetData();
    }
  }

  getSetData = async () =>{
    let doctor_code = 0;
    let department_code = this.context.department.code;
    let disable_common = 0;
    let editable_only = 0;
    let patient_id = this.props.patientId;
    try {
      const { data } = await axios.get(
        `/app/api/v2/order/prescription/preset`,{
          params: {doctor_code: doctor_code, department_code:department_code,  disable_common:disable_common, editable_only:editable_only, system_patient_id: patient_id}
        }
      );
      if (data) {                
        this.setState({
          medicineSetData: data
        });
      }          
    } catch (e) {      
      return null;
    }
  }

  onChangeValue(e) {
    e.preventDefault();
    if (e.target.value != "") {
      this.setState({
        alertMsg: "",
        hasAlert: false,
        hasError: false
      });
    }
  }

  handleOk = (e) => {
    e.preventDefault();
    if(this.props.preset_do_count !== undefined){
        if (this.validateName(this.textInput.value)) {
            let preset_do_data = karteApi.getVal(this.props.patientId,CACHE_LOCALNAMES.PRESET_DO_PRESCRIPTION);
            let cur_preset_do_count = 0;
            if(preset_do_data !== undefined && preset_do_data != null){
                cur_preset_do_count = preset_do_data.length;
            }
            let confirm_message = "";
            if((parseInt(this.props.preset_do_count) + 1) > cur_preset_do_count){
                let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
                let patient_do_max_number = initState.patient_do_max_number;
                if(patient_do_max_number >1 && cur_preset_do_count > 0){
                    confirm_message = "処方Do（"+(parseInt(this.props.preset_do_count) + 1)+"）を登録しますか？";
                } else {
                    confirm_message = "処方Doを登録しますか？";
                }

            } else {
                confirm_message = "処方Doを新しい内容で上書きしますか？";
            }
            let base_modal = document.getElementsByClassName("register-set-modal")[0];
            if(base_modal !== undefined && base_modal != null){
                base_modal.style['z-index'] = 1040;
            }
            this.setState({
                confirm_message,
            });
        }
    } else {
        if (this.validateName(this.textInput.value)) {
            this.props.handleOk(this.textInput.value);
        }
    }
  }

  validateName = (strName="") =>{
    if (strName == ""){
      this.setState({
        alertMsg: "セットの名前を入力してください。",
        hasAlert: true,
        hasError: false,
      });
      return false;
    }
    
    let isExist = false;
    if(this.props.preset_do_count !== undefined){
        let preset_do_data = karteApi.getVal(this.props.patientId,CACHE_LOCALNAMES.PRESET_DO_PRESCRIPTION);
        if(preset_do_data !== undefined && preset_do_data != null && preset_do_data.length > 0){
            preset_do_data.map(item=>{
                if (item.preset_name == strName) {
                    isExist = true;
                }
            });
        }
    } else {
      if(this.state.medicineSetData != undefined && this.state.medicineSetData != null && this.state.medicineSetData.length > 0){
        this.state.medicineSetData.map(item=>{
          if (item.preset_name == strName) {
              isExist = true;
          }
      });
      }
    }

    if (isExist) {
      // this.setState({
      //   hasAlert: true,
      //   alertMsg: "既に同じ名前のセットがあるので登録できません。",
      //   hasError: true,
      // });
      let { $canDoAction, FEATURES, AUTHS } = this.context;
      if ($canDoAction(FEATURES.PRESET_PATIENT_PRESCRIPTION, AUTHS.EDIT)) {
        this.setState({
          confirm_message: "上書きしますか？",
        });
      } else {        
        this.setState({
          alert_messages: "同じ名前のセットがあるため登録できません"
        });
      }      
      return false;
    }
    return true;
  }

    confirmCancel=()=>{
        let base_modal = document.getElementsByClassName("register-set-modal")[0];
        if(base_modal !== undefined && base_modal != null){
            base_modal.style['z-index'] = 1050;
        }
        this.setState({
            confirm_message:"",
        });
    }

    confirmOk=()=>{
        this.props.handleOk(this.textInput.value);
    }

    closeModal =()=>{
        this.setState({
            alert_messages: "",            
        });
    }

  render() {
    return (
      <Modal
        show={true}
        // onHide={this.props.hideModal}
        tabIndex="0"
        id="prescription_dlg"
        className="custom-modal-sm register-set-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>セットとして保存</Modal.Title>
        </Modal.Header>
        <Modal.Body>          
          <div className="categoryContent">           
            <TabContent className="usageList">
              <div className="register-name">
                <p>セットの名前</p>
                <Input type="input" name="registerSet" onChange={this.onChangeValue} ref={e => this.textInput = e}/>
                {this.state.hasAlert && (
                  <span className={this.state.hasError?"error":""}>{this.state.alertMsg}</span>
                )}
              </div>
            </TabContent>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button id="btnCancel" className="cancel-btn" onClick={this.props.handleCancel}>キャンセル</Button>
          <Button id="btnOk" className="red-btn" onClick={this.handleOk}>確定</Button>
        </Modal.Footer>
          {this.state.confirm_message !== "" && (
              <SystemConfirmModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.confirmOk.bind(this)}
                  confirmTitle= {this.state.confirm_message}
              />
          )}
          {this.state.alert_messages !== "" && (
              <SystemAlertModal
                  hideModal= {this.closeModal.bind(this)}
                  handleOk= {this.closeModal.bind(this)}
                  showMedicineContent= {this.state.alert_messages}
              />
          )}
      </Modal>
    );  
  }
}

RegisterModal.contextType = Context;

RegisterModal.propTypes = {
  handleCancel: PropTypes.func,  
  hideModal: PropTypes.func,  
  handleOk: PropTypes.func,   
  setData: PropTypes.array,
  preset_do_count: PropTypes.number,
  patientId: PropTypes.number,
};

export default RegisterModal;
