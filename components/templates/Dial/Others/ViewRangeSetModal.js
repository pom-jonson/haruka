import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { dialOtherValidate } from '~/helpers/validate'
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";

const Wrapper = styled.div`
    width: 100%;
    .flex {
        display: flex;
        flex-wrap: wrap;
    }
    .exam-name {
        height: 50px;
        line-height: 50px;
    }
    .range-area {
        align-items: flex-start;
        justify-content: space-between;
        margin-left: auto;
        margin-right: auto;
        width: 80%;
    }
    .label-title, .label-unit {
        width:0;
        margin:0;
    }
    .compare {
        margin-top: 8px;
        line-height: 38px;
        height: 38px;
    }
    .space-area {
        margin-top: 8px;
        line-height: 38px;
        height: 38px;
        width: 104px;
        text-align: center;
        border: 1px solid #aaa;
    }
`;

class ViewRangeSetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      range_data:props.range_data != null ? props.range_data : {range1_2:0,range2_1:0,range2_2:0,range3_1:0,range3_2:0,range4_1:0,range4_2:0,range5_1:0},
      alert_messages:"",
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:'',
      check_message:"",
    };
    this.change_flag = 0;
  }

  async componentDidMount() {
    this.changeBackground();
  }

  componentDidUpdate () {
    this.changeBackground();
  }

  changeBackground = () => {
    let check_data = this.getCheckData();
    dialOtherValidate("view_range_set", check_data, "background");
  }

  setValue=(key, value)=>{
    if(parseFloat(value) < 0) value = 0;
    let range_data = this.state.range_data;
    range_data[key] = value;
    this.change_flag = 1;
    this.setState({range_data})
  };

  closeAlertModal = () => {
    this.setState({check_message: ''});
    $("#" + this.state.first_tag_id).focus();
  }

  getCheckData=()=>{
    let check_data = {...this.state.range_data}; 
    if(!(check_data['range1_2'] > 0)){
      check_data['range1_2'] = null;
    }
    if(!(check_data['range2_1'] >= this.state.range_data['range1_2'])){
      check_data['range2_1'] = null;
    }
    if(!(check_data['range2_2'] > this.state.range_data['range2_1'])){
      check_data['range2_2'] = null;
    }
    if(!(check_data['range3_1'] >= this.state.range_data['range2_2'])){
      check_data['range3_1'] = null;
    }
    if(!(check_data['range3_2'] > this.state.range_data['range3_1'])){
      check_data['range3_2'] = null;
    }
    if(!(check_data['range4_1'] >= this.state.range_data['range3_2'])){
      check_data['range4_1'] = null;
    }
    if(!(check_data['range4_2'] > this.state.range_data['range4_1'])){
      check_data['range4_2'] = null;
    }
    if(!(check_data['range5_1'] >= this.state.range_data['range4_2'])){
      check_data['range5_1'] = null;
    }
    return check_data;
  }

  confirmSave=()=>{
    if(this.change_flag === 0){
      return;
    }
    let check_data = this.getCheckData();
    let validate_data = dialOtherValidate("view_range_set", check_data);
    let check_message = [];
    validate_data['error_str_arr'].map(message=>{
      if(!check_message.includes(message))
      check_message.push(message);
    })
    if (validate_data['error_str_arr'].length > 0 ) {
        this.setState({
          check_message:check_message.join('\n'),
          first_tag_id:validate_data['first_tag_id']
        });
        return;
    }
    this.setState({
      confirm_message:"表示範囲の設定を保存しますか？",
      confirm_type:"save",
    });
  };

  closeMessageModal=()=>{
    this.setState({
      alert_messages:"",
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:'',
    });
  };

  register=async()=>{
    let path = "/app/api/v2/dial/medicine_information/register_examination_meta";
    let post_data = {
      examination_code:this.props.exam_code,
      range:this.state.range_data,
    };

    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        this.setState({
          confirm_message:"",
          confirm_type:"",
          alert_messages:res.error_message !== undefined ? res.error_message : "",
        }, ()=>{
          if(res.error_message === undefined){
            this.props.handleOk(this.state.range_data);
            var title = '';
            var message = res.alert_message;
            if (message.indexOf('変更') > -1) title = "変更完了##";
            if (message.indexOf('登録') > -1) title = "登録完了##";
            window.sessionStorage.setItem("alert_messages", title + res.alert_message);
          }
        });
      })
      .catch(() => {

      })
  };

  closeModal=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"close",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  };

  render() {
    return  (
      <Modal show={true} id="add_contact_dlg"  className="master-modal view-range-set-modal first-view-modal">
        <Modal.Header><Modal.Title>適正透析分析 表示範囲設定</Modal.Title></Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className={'exam-name'}>{this.props.exam_name}</div>
            <div className={'flex range-area'}>
              <div className={'input-value'}>
                <div className={'space-area'}>0</div>
              </div>
              <div className={'compare'}>{'＜ 表示範囲1 ≦'}</div>
              <div className={'input-value'}>
                <NumericInputWithUnitLabel
                  className="form-control"
                  value={this.state.range_data['range1_2']}
                  id='range1_2_id'
                  getInputText={this.setValue.bind(this,'range1_2')}
                  inputmode="numeric"
                />
              </div>
            </div>
            <div className={'flex range-area'}>
              <div className={'input-value'}>
                <NumericInputWithUnitLabel
                  className="form-control"
                  value={this.state.range_data['range2_1']}
                  id='range2_1_id'
                  getInputText={this.setValue.bind(this,'range2_1')}
                  inputmode="numeric"
                />
              </div>
              <div className={'compare'}>{'＜ 表示範囲2 ≦'}</div>
              <div className={'input-value'}>
                <NumericInputWithUnitLabel
                  className="form-control"
                  value={this.state.range_data['range2_2']}
                  id='range2_2_id'
                  getInputText={this.setValue.bind(this,'range2_2')}
                  inputmode="numeric"
                />
              </div>
            </div>
            <div className={'flex range-area'}>
              <div className={'input-value'}>
                <NumericInputWithUnitLabel
                  className="form-control"
                  value={this.state.range_data['range3_1']}
                  id='range3_1_id'
                  getInputText={this.setValue.bind(this,'range3_1')}
                  inputmode="numeric"
                />
              </div>
              <div className={'compare'}>{'＜ 表示範囲3 ≦'}</div>
              <div className={'input-value'}>
                <NumericInputWithUnitLabel
                  className="form-control"
                  value={this.state.range_data['range3_2']}
                  id='range3_2_id'
                  getInputText={this.setValue.bind(this,'range3_2')}
                  inputmode="numeric"
                />
              </div>
            </div>
            <div className={'flex range-area'}>
              <div className={'input-value'}>
                <NumericInputWithUnitLabel
                  className="form-control"
                  value={this.state.range_data['range4_1']}
                  id='range4_1_id'
                  getInputText={this.setValue.bind(this,'range4_1')}
                  inputmode="numeric"
                />
              </div>
              <div className={'compare'}>{'＜ 表示範囲4 ≦'}</div>
              <div className={'input-value'}>
                <NumericInputWithUnitLabel
                  className="form-control"
                  value={this.state.range_data['range4_2']}
                  id='range4_2_id'
                  getInputText={this.setValue.bind(this,'range4_2')}
                  inputmode="numeric"
                />
              </div>
            </div>
            <div className={'flex range-area'}>
              <div className={'input-value'}>
                <NumericInputWithUnitLabel
                  className="form-control"
                  value={this.state.range_data['range5_1']}
                  id='range5_1_id'
                  getInputText={this.setValue.bind(this,'range5_1')}
                  inputmode="numeric"
                />
              </div>
              <div className={'compare'}>{'＜ 表示範囲5 ≦'}</div>
              <div className={'input-value'}>
                <div className={'space-area'}> </div>
              </div>
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
          <Button className={this.change_flag == 1 ? "red-btn" : "disable-btn"} onClick={this.confirmSave}>{"登録"}</Button>
        </Modal.Footer>
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeMessageModal.bind(this)}
            handleOk= {this.closeMessageModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.confirm_message !== "" && this.state.confirm_type === "save" && (
          <SystemConfirmModal
            hideConfirm= {this.closeMessageModal.bind(this)}
            confirmCancel= {this.closeMessageModal.bind(this)}
            confirmOk= {this.register.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.confirm_message !== "" && this.state.confirm_type === "close" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.closeMessageModal.bind(this)}
            confirmCancel= {this.closeMessageModal.bind(this)}
            confirmOk= {this.props.closeModal}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.check_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.check_message}
          />
        )}
      </Modal>
    );
  }
}

ViewRangeSetModal.contextType = Context;

ViewRangeSetModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  exam_code:PropTypes.number,
  exam_name:PropTypes.string,
  range_data:PropTypes.array
};

export default ViewRangeSetModal;
