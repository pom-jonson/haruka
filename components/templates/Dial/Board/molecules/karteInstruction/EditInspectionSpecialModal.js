import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as methods from "~/components/templates/Dial/DialMethods";
import InputTempInspection from "./InputTempInspection";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: calc(90vw - 30px);
  height: 100%;
  float: left;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
 .fl {
    float: left;
 }
 .inline-flex {
    display: inline-flex;
 }
  .selected, .selected:hover{
    background:lightblue!important;      
  }
.work-area {
    min-height:300px;
    max-height: 600px;
    overflow-y: auto;
}

  .panel-menu {
    width: 100%;
    margin-bottom: 20px;
    font-weight: bold;
    .menu-btn {
        width:100px;
        text-align: center;
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
        padding: 5px 0;
        cursor: pointer;
    }
    .active-menu {
        width:100px;
        text-align: center;
        border-top: 1px solid black;
        border-right: 1px solid black;
        border-left: 1px solid black;
        padding: 5px 0;
    }
    .no-menu {
        width: calc(100% - 600px);
        border-bottom: 1px solid black;
        background-color: rgba(200, 194, 194, 0.22);
    }
  }
  .footer {
    position: absolute;
    right: 100px;
    bottom: 20px;
    button {
        margin-right: 10px;
        background-color: rgb(38, 159, 191);
        border-color: rgb(38, 159, 191);
        span {
            color: white;
            font-size: 18px;
        }
    }
  }
`;


class EditInspectionSpecialModal extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        this.state = {            
            karte_data:this.props.karte_data,            
            isCloseConfirmModal:false,
            isSaveConfirmModal:false,
            confirm_alert_title:''
        };
        this.change_flag = 0;
        this.tempInspectionRef = React.createRef();
    }
    
    handleOk = (data) => {
      let karte_data = this.state.karte_data;      
      karte_data.temportary_inspection.after = data;
      this.setState({karte_data});
      this.change_flag = true;
    };

    save = () => {
      if(this.change_flag === 0){
        return;
      }
      if (!(this.tempInspectionRef.current.state.instruction_doctor_number > 0)){
        this.tempInspectionRef.current.showDoctorList();
        return;
      }
      this.setState({
        isSaveConfirmModal:true,
        confirm_message:'変更内容を登録しますか？',
        confirm_alert_title:'登録確認',
        instruction_doctor_number:this.tempInspectionRef.current.state.instruction_doctor_number,
      })
    }

    confirmSave = () => {
      this.props.closeModal();
      this.props.handleOk(this.state.karte_data, this.state.instruction_doctor_number);
    }

    ConfirmClose=()=>{
      if(this.change_flag == 1){
        this.setState({
          isCloseConfirmModal:true,
          confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
          confirm_alert_title:'入力中'
        });
      } else {
        this.props.closeModal();
      }
    };

    confirmCancel=()=>{
      this.setState({
        isCloseConfirmModal:false,
        isSaveConfirmModal:false,
        confirm_message:"",
        confirm_alert_title:''
      });
    }

    onHide=()=>{}

    render() {
        return  (
            <Modal show={true} onHide={this.onHide}  className="wordPattern-modal master-modal input-panel-modal input-instruction-modal">
                <Modal.Header>
                    <Modal.Title>臨時検査</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className="work-area flex">
                            <InputTempInspection
                                karte_data={this.state.karte_data}
                                patientInfo={this.props.patientInfo}
                                schedule_date={this.props.schedule_date}
                                is_temporary = {this.props.is_temporary}
                                handleOk={this.handleOk}
                                from_source = 'dr_medical'
                                ref = {this.tempInspectionRef}
                                staff_list_by_number = {this.props.staff_list_by_number}
                                staffs = {this.props.staffs}
                            />
                        </div>
                    </Wrapper>
                </Modal.Body>
                <Modal.Footer>
                  <Button className="cancel-btn" onClick={this.ConfirmClose}>キャンセル</Button>
                    <Button className={this.change_flag === 0 ? 'disable-btn' : 'red-btn'} onClick={this.save.bind(this)}>登録</Button>
                </Modal.Footer>
                {this.state.isCloseConfirmModal && (
                  <SystemConfirmJapanModal
                    hideConfirm={this.confirmCancel.bind(this)}
                    confirmCancel={this.confirmCancel.bind(this)}
                    confirmOk={this.props.closeModal}
                    confirmTitle={this.state.confirm_message}
                    title = {this.state.confirm_alert_title}
                  />
                )}
                {this.state.isSaveConfirmModal && (
                  <SystemConfirmJapanModal
                    hideConfirm={this.confirmCancel.bind(this)}
                    confirmCancel={this.confirmCancel.bind(this)}
                    confirmOk={this.confirmSave}
                    confirmTitle={this.state.confirm_message}
                    title = {this.state.confirm_alert_title}
                  />
                )}
            </Modal>
        );
    }
}

EditInspectionSpecialModal.contextType = Context;

EditInspectionSpecialModal.propTypes = {
    karte_data:PropTypes.array,
    closeModal:PropTypes.func,
    schedule_date:PropTypes.string,
    patientInfo:PropTypes.object,
    is_temporary:PropTypes.number,
    handleOk:PropTypes.func,
    staff_list_by_number:PropTypes.object,
    staffs:PropTypes.array
};

export default EditInspectionSpecialModal;
