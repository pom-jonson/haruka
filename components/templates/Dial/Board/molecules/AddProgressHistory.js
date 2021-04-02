import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import InputPanel from "./InputPanel";
import InputSoapPanel from "./InputSoapPanel";
import EditPrescript from "./EditPrescript";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import EditInspectionModal from "../../Schedule/modals/EditInspectionModal";
import axios from "axios/index";
import EditRegularInjectionModal from "~/components/templates/Dial/Board/molecules/karteInstruction/EditRegularInjectionModal";
import EditTempInjectionModal from "~/components/templates/Dial/Board/molecules/karteInstruction/EditTempInjectionModal"
import * as apiClient from "~/api/apiClient";
import {formatDateLine} from "~/helpers/date";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

const Wrapper = styled.div`
  display: block;
//   align-items: flex-start;
//   justify-content: space-between;
  font-size: 14px;
  width: 100%;
  height: 100%;
  min-height:100px;
  float: left;
  display: flex;
  button {
      text-align: center;
      background: #ddd;
      border: solid 1px #aaa;
      margin-bottom: 15px;
      width: 10rem;
   }
   .s-a-btn {
    width: 12rem;
    text-align: center;
    button {
        background: rgb(255, 255, 255);
        span {
        font-size: 20px;
            color: black;
        }
    }
   }
   .o-p-btn {
    width: 12rem;
    text-align: center;
    button {
        background: rgb(255, 255, 255);
        span {
            font-size: 20px;
            color: black;
        }
    }
   }
   .temporary-btn {
    width: 12rem;
    text-align: center;
    button {
    span {font-size: 20px;}
    
        background: rgb(242, 161, 21);
    }
   }
   .regular-btn {
    width: 12rem;
    text-align: center;
    button {
        span {font-size: 20px;}
        background: rgb(13, 159, 144);
    }
   }

 `;


class AddProgressHistory extends Component {
  constructor(props) {
    super(props);
    let patientInfo = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"patient");
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");
    let conf_data = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data");        
    this.course_subs = conf_data.course_record_sub_item;    
    this.state = {
        isInputPanelModal: false,
        isOpenInputSoapPannel:false,
        isEditPrescriptModal: false,
        selected_soap_kind:'',
        patientInfo,
        schedule_date,
        isEditInjectionModal: false,
        isTempInspectionMOdal:false,
        is_temporary: 0,
        schedule_item:{},
        alert_messages:'',
        alert_title:''
    }
  }

  OpenInputSoapPanelModal = (kind) => {
      this.setState({
          isOpenInputSoapPannel:true,
          selected_soap_kind:kind,
      })
      var base_modal = document.getElementsByClassName("addProgress_modal")[0];
      if(base_modal !== undefined) base_modal.style['z-index'] = 1030;
  }
    OpenInputPanelModal = (kind) => {
        // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
        // if((!authInfo.doctor_number > 0) && kind =='指示'){
        //     window.sessionStorage.setItem("alert_messages", '医師のみが指示を登録することができます。');
        //     return;
        // }
        this.setState({ 
            isInputPanelModal:true,
            selected_soap_kind:kind
        });
        var base_modal = document.getElementsByClassName("addProgress_modal")[0];
        if(base_modal !== undefined) base_modal.style['z-index'] = 1030;
    }
    OpenEditPrescriptModal = (type) => {
        this.setState({
            isEditPrescriptModal:true,
            editPrescriptType: type
        });
        var base_modal = document.getElementsByClassName("addProgress_modal")[0];
        if(base_modal !== undefined) base_modal.style['z-index'] = 1030;
    }
    

    openEditInspectionModal = () => {
        this.setState({
            is_temporary:1,
            isTempInspectionMOdal:true,
        })
        var base_modal = document.getElementsByClassName("addProgress_modal")[0];
        if(base_modal !== undefined) base_modal.style['z-index'] = 1030;
    }
    closeModal = () => {
        this.setState({
            isInputPanelModal: false,
            isOpenInputSoapPannel:false,
            isEditPrescriptModal: false,
            isEditInjectionModal: false,
            isTempInspectionMOdal: false,
            alert_messages:'',
            alert_title:''
        });
        var base_modal = document.getElementsByClassName("addProgress_modal")[0];
        if(base_modal !== undefined) base_modal.style['z-index'] = 1040;
    };
    
    handleSOAPOk = () => {
        this.closeModal();
        this.props.handleSOAPOk();
    }
    handleOk = () => {        
        this.closeModal();
        this.props.handleOk();
    };

    OpenEditInjectionModal = async (type) => {

        if (type == 1){
            let path = "/app/api/v2/dial/schedule/injection_schedule_search";
            let post_data = {
                is_temporary: type,
                schedule_date: this.state.schedule_date,
                patient_id: this.state.patientInfo.system_patient_id,
            };
            var karte_data = {
                limit_injection:{
                    prev:'',
                    after:'',
                },
                temporary_injection:{
                    prev:'',
                    after:'',
                },
            }
            await axios.post(path, {params: post_data}).then((res)=>{
                let data = res.data;
                karte_data.temporary_injection.prev = data;
                this.setState({
                    karte_data,
                    isEditInjectionModal: true,
                    is_temporary: type
                })
            });
        } else {
            this.getRegularInjection();
        }
        var base_modal = document.getElementsByClassName("addProgress_modal")[0];
        if(base_modal !== undefined) base_modal.style['z-index'] = 1030;
    }

    getRegularInjection = async() => {
        let path = "/app/api/v2/dial/schedule/regular_injection_search";
        let post_data = {
            instruct_date: formatDateLine(this.state.schedule_date),
            patient_id: this.state.patientInfo.system_patient_id,
        };
        var karte_data = {
            injection:{prev:'', after:'', origin:''}
        }
        await apiClient.post(path, {params: post_data}).then((res)=>{
            karte_data.injection.prev = res.length > 0 ? res : '';
            // karte_data.injection.origin = res.origin;
            this.setState({
                isEditInjectionModal: true,
                is_temporary:0,
                karte_data,
            });
        });
    }

    handleTempInjectionOk = (karte_data) => {
        if (karte_data == undefined || karte_data == null) return;
        this.setState({karte_data});
        this.saveInjection(karte_data);        
    }

    handleInjectionOk = (data) => {
        if (data == undefined || data == null) return;
        let karte_data = this.state.karte_data;
        karte_data.injection.after = data;
        this.setState({karte_data});
        this.saveInjection(karte_data);
    }

    saveInjection = async(karte_data) => {        
        let path = "/app/api/v2/dial/board/karte/register";
        let post_data = {
            system_patient_id:this.state.patientInfo.system_patient_id,
            schedule_date: formatDateLine(this.state.schedule_date),
            karte_data,
        };
        await apiClient
            ._post(path, {
                params: post_data
            })
            .then(() => {
            })
        this.closeModal();
        this.props.handleOk(this.state.is_temporary);
    }

    onHide=()=>{}

  render() {    
    let v_regular_btn = this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.REG_PRESCRIPTION)
        || this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.REG_INJECTION);
    let v_temporary_btn = this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.TEMP_PRESCRIPTION)
        || this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.TEMP_INJECTION)
        || this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.TEMP_INSPECTION);
    let v_op_btn = this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.O)
        || this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.P)
        || this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.CURRENT_DISEASE);
    let v_sa_btn = this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.S)
        || this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.A)
        || this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.INSTRUCTION);
    let cnt = 0;
    if (v_regular_btn) cnt++;
    if (v_temporary_btn) cnt++;
    if (v_op_btn) cnt++;
    if (v_sa_btn) cnt++;
    
    return  (
      <Modal show={true} onHide={this.onHide}  className={`master-modal addProgress_modal ${cnt<3 ? 'small_addProgress_modal':''}`}>
        <Modal.Header>
          <Modal.Title>処置モニタ入力</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Wrapper>
                {v_sa_btn && (
                    <div className="s-a-btn">
                        {this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.S) && (
                            <Button onClick={ this.OpenInputSoapPanelModal.bind(this, 'S') }>S 訴え</Button>
                        )}
                        {this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.A) && (
                            <Button onClick={ this.OpenInputSoapPanelModal.bind(this, 'A') }>A 問題点</Button>
                        )}
                        {this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.INSTRUCTION) && (
                            <Button onClick={ this.OpenInputSoapPanelModal.bind(this, '指示') }>指示</Button>
                        )}
                    </div>
                )}
                {v_op_btn && (
                    <div className="o-p-btn">
                        {this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.O) && (
                            <Button onClick={ this.OpenInputSoapPanelModal.bind(this, 'O') }>O 所見</Button>
                        )}
                        {this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.P) && (
                            <Button onClick={ this.OpenInputSoapPanelModal.bind(this, 'P') }>P 対応</Button>
                        )}
                        {this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.CURRENT_DISEASE) && (
                            <Button onClick={ this.OpenInputPanelModal.bind(this, "現症") }>現症</Button>
                        )}
                    </div>
                )}
                {v_temporary_btn && (
                    <div className="temporary-btn">
                        {this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.TEMP_PRESCRIPTION) && (
                            <Button onClick={ () => this.OpenEditPrescriptModal( 1 ) }>臨時処方</Button>
                        )}
                        {this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.TEMP_INJECTION) && (
                            <Button onClick={ () => this.OpenEditInjectionModal( 1 ) }>臨時注射</Button>
                        )}
                        {this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.TEMP_INSPECTION) && (
                            <Button onClick={ this.openEditInspectionModal }>臨時検査</Button>
                        )}                    
                    </div>
                )}
                {v_regular_btn && (
                    <div className="regular-btn">
                        {this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.REG_PRESCRIPTION) && (
                            <Button onClick={ () => this.OpenEditPrescriptModal( 0 ) }>定期処方</Button>
                        )}
                        {this.context.$canDoAction(this.context.FEATURES.COURSE_SETTING, this.context.AUTHS.REG_INJECTION) && (
                            <Button onClick={ () => this.OpenEditInjectionModal( 0 ) }>定期注射</Button>
                        )}
                        
                    </div>
                )}
                {this.state.isInputPanelModal && (
                    <InputPanel
                        handleOk={this.handleSOAPOk}
                        closeModal={this.closeModal}
                        kind={this.state.selected_soap_kind}
                        patient_id = {this.state.patientInfo.system_patient_id}
                        schedule_date={this.state.schedule_date}
                    />
                )}
                {this.state.isOpenInputSoapPannel && (
                    <InputSoapPanel
                        handleOk={this.handleSOAPOk}
                        closeModal={this.closeModal}
                        kind={this.state.selected_soap_kind}
                        patient_id = {this.state.patientInfo.system_patient_id}
                        schedule_date={this.state.schedule_date}
                    />
                )}
                {this.state.isEditPrescriptModal && (
                    <EditPrescript
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        schedule_date={this.state.schedule_date}
                        patientInfo={this.state.patientInfo}
                        editPrescriptType={this.state.editPrescriptType}
                    />
                )}
                {this.state.isEditInjectionModal && this.state.is_temporary == 1 && (
                    <EditTempInjectionModal                        
                        karte_data = {this.state.karte_data}
                        handleTempInjectionOk={this.handleTempInjectionOk}
                        closeModal={this.closeModal}
                        is_temporary = {this.state.is_temporary}
                        schedule_date = {this.state.schedule_date}
                        patientInfo = {this.state.patientInfo}
                    />
                )}
                {this.state.isEditInjectionModal && this.state.is_temporary != 1 && (
                    <EditRegularInjectionModal
                        injection = {this.state.karte_data.injection}
                        handleInjectionOk={this.handleInjectionOk}
                        closeModal={this.closeModal}
                        is_temporary = {this.state.is_temporary}
                        schedule_date = {this.state.schedule_date}
                        patientInfo = {this.state.patientInfo}
                    />
                )}
                {this.state.isTempInspectionMOdal && (
                    <EditInspectionModal
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        patientInfo = {this.state.patientInfo}
                        schedule_date = {(this.state.schedule_date)}
                        system_patient_id = {this.state.patientInfo.system_patient_id}
                        temporary = {1}
                    />
                )}
                {this.state.alert_messages != "" && (
                <SystemAlertModal
                  hideModal= {this.closeModal.bind(this)}
                  handleOk= {this.closeModal.bind(this)}
                  showMedicineContent= {this.state.alert_messages}
                  title = {this.state.alert_title}
                />
              )}
            </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

AddProgressHistory.contextType = Context;

AddProgressHistory.propTypes = {
    closeModal: PropTypes.func,
    saveContact: PropTypes.func,
    patientInfo: PropTypes.object,    
    schedule_date:PropTypes.instanceOf(Date),
    handleOk:PropTypes.func,
    handleSOAPOk: PropTypes.func,
};

export default AddProgressHistory;
