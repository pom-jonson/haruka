import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {formatDateLine} from "~/helpers/date";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    font-size:1rem;
    .flex {display: flex;}
    .div-title {
      line-height: 2rem;
      width: 8rem;
    }
    .react-datepicker-wrapper {
      input {
        width: 7rem;
        height: 2rem;
        font-size:1rem;
        text-align: center;
      }
    }
    .free-comment {
      div {margin-top:0;}
      .input-comment {width:calc(100% - 8.5rem);}
      .label-title {
        width: 8rem;
        margin: 0;
        font-size: 1rem;
        line-height: 2rem;
      }
      input {
        width: calc(100% - 8rem);
        height: 2rem;
        font-size:1rem;
      }
    }
`;

class DeathRegister extends Component {
  constructor(props) {
    super(props);
    let cache_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.DEATH_REGISTER);
    this.state = {
      load_flag:false,
      death_date:(cache_data !== undefined && cache_data != null) ? new Date(cache_data.death_date.split("-").join("/")) : new Date(),
      free_comment:(cache_data !== undefined && cache_data != null) ? cache_data.free_comment : "",
      confirm_message:"",
      alert_messages:"",
      can_register:false,
    };
    this.change_flag = 0;
  }

  async UNSAFE_componentWillMount() {
    this.setState({can_register:this.context.$canDoAction(this.context.FEATURES.DEATH_REGISTER,this.context.AUTHS.REGISTER)});
  }

  setDateValue = (key,value) => {
    this.change_flag = 1;
    this.setState({[key]:(value == null || value == "") ? new Date() : value});
  };

  setFreeComment = e => {
    if(this.state.free_comment.length > 25){
      this.setState({free_comment: this.state.free_comment});
    } else {
      this.change_flag = 1;
      this.setState({free_comment: e.target.value});
    }
  };

  handleOk = () => {
    if(!this.state.can_register) {return;}
    this.setState({
      confirm_message:"登録しますか？"
    });
  };

  register = async () => {
    let death_register = {};
    death_register['death_date'] = formatDateLine(this.state.death_date);
    death_register['free_comment'] = this.state.free_comment;
    death_register['system_patient_id'] = this.props.patientId;
    karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.DEATH_REGISTER, JSON.stringify(death_register), 'insert');
    this.context.$setExaminationOrderFlag(1);
    this.props.closeModal();
  }

  confirmCancel=()=>{
    this.setState({
      confirm_message:"",
      alert_messages:"",
    });
  }

  render() {
    return  (
      <Modal show={true} id="add_contact_dlg"  className="death-register-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>死亡情報</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DatePickerBox style={{width:"100%", height:"100%"}}>
            <Wrapper>
              <div className={'flex select-date'}>
                <div className={'div-title'}>死亡日付</div>
                <DatePicker
                  locale="ja"
                  id='death_date_id'
                  selected={this.state.death_date}
                  onChange={this.setDateValue.bind(this,"death_date")}
                  dateFormat="yyyy/MM/dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dayClassName = {date => setDateColorClassName(date)}
                />
              </div>
              <div className={'flex free-comment'} style={{paddingTop:"0.5rem"}}>
                <div className={'input-comment'}>
                  <InputWithLabelBorder
                    label="フリーコメント"
                    type="text"
                    id={'discharge_free_comment_id'}
                    getInputText={this.setFreeComment.bind(this)}
                    diseaseEditData={this.state.free_comment}
                  />
                </div>
                <div className={'div-title'}>（25文字まで）</div>
              </div>
            </Wrapper>
          </DatePickerBox>
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.props.closeModal} className={"custom-modal-btn cancel-btn"} style={{cursor:"pointer"}} id='cancel_btn'><span>キャンセル</span></div>
          {this.state.can_register ? (
            <div onClick={this.handleOk} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}>
              <span>確定</span>
            </div>
          ):(
            <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
              <div className={"custom-modal-btn disable-btn"}><span>確定</span></div>
            </OverlayTrigger>
          )}
        </Modal.Footer>
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.register}
            confirmTitle= {this.state.confirm_message}
            title= {this.state.confirm_alert_title}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
      </Modal>
    );
  }
}

DeathRegister.contextType = Context;

DeathRegister.propTypes = {
  closeModal: PropTypes.func,
  patientId : PropTypes.number,
};

export default DeathRegister;
