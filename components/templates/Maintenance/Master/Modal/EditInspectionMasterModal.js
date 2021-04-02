import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import {harukaValidate} from "~/helpers/haruka_validate";
import $ from "jquery";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import Radiobox from "~/components/molecules/Radiobox";
import {toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  div {margin-top:0;}
  .flex {display:flex;}
  .label-title {
    text-align: right;
    width: 16rem;
    margin:0;
    margin-right:0.5rem;
    line-height:2rem;
  }
  label {
    font-size:1rem;
    line-height:2rem;
  }
  input {
    width: calc(100% - 16.5rem);
    font-size: 1rem;
    height:2rem;
  }
  .checkbox_area {
    padding-left: 16.5rem;
    input {height: 15px !important;}
  }
  .radio-area {
    display: flex;
    label {
      font-size:1rem;
      line-height:2rem;
      display: flex;
    }
    input{
      background: none;
    }
  }
  .hankaku-eng-num-input input {
    ime-mode: inactive;
  }
`;

class EditInspectionMasterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title : this.props.inspection_name,
      inspection_id : this.props.inspection_id,
      confirm_type:"",
      confirm_title:'',
      confirm_message: "",
      name:"",
      enable_body_part_comment:0,
      body_part_panel_config:"",
      enable_count_value:0,
      enable_height_weight_surface_area:0,
      height_weight_surface_area_text:"",
      enable_connection_date:0,
      connection_date_title:"",
      count_label:"",
      count_suffix:"",
      is_reserved:0,
      end_until_continue_type:0,
      every_day_continue_type:0,
      performed_multiple_times_type:0,
      is_available_order_from_elapsed_page:0,
      enable_result:0,
      result_input_length:0,
      result_type:0,
      result_suffix:"",
      is_enabled:1,
      alert_messages:"",
      alert_type:"",
      check_message:"",
    };
    this.change_flag = 0;
  }
  
  async componentDidMount() {
    if(this.state.inspection_id != null){
      let path = "/app/api/v2/master/inspection/searchInspectionMaster";
      const post_data = {
        params: {inspection_id : this.state.inspection_id}
      };
      await apiClient.post(path, post_data).then((res)=>{
        if (res){
          this.setState({
            name:res.name,
            enable_body_part_comment:res.enable_body_part_comment,
            body_part_panel_config:res.body_part_panel_config,
            enable_count_value:res.enable_count_value,
            enable_height_weight_surface_area:res.enable_height_weight_surface_area,
            height_weight_surface_area_text:res.height_weight_surface_area_text != null ? res.height_weight_surface_area_text : "",
            enable_connection_date:res.enable_connection_date,
            connection_date_title:res.connection_date_title != null ? res.connection_date_title : "",
            count_label:res.count_label,
            count_suffix:res.count_suffix,
            is_reserved:res.is_reserved,
            is_enabled:res.is_enabled,
            end_until_continue_type:res.end_until_continue_type,
            every_day_continue_type:res.every_day_continue_type,
            performed_multiple_times_type:res.performed_multiple_times_type,
            is_available_order_from_elapsed_page:res.is_available_order_from_elapsed_page,
            enable_result:res.enable_result,
            result_input_length:res.result_input_length,
            result_type:res.result_type,
            result_suffix:res.result_suffix,
          });
        }
      });
    }
  }
  
  getAlwaysShow = (name, value) => {
    this.change_flag = 1;
    let state_data = {};
    if(name === "enable_height_weight_surface_area" && value == 0){
      state_data["height_weight_surface_area_text"] = "";
    }
    if(name === "enable_connection_date" && value == 0){
      state_data["connection_date_title"] = "";
    }
    if(name === "enable_body_part_comment" && value == 0){
      state_data["body_part_panel_config"] = "";
    }
    if(name === "end_until_continue_type_2"){
      state_data['end_until_continue_type'] = value == 1 ? 2 : 1;
    } else {
      state_data[name] = value;
    }
    if(name === "every_day_continue_type" && value == 0){
      state_data["performed_multiple_times_type"] = 0;
    }
    if(name === "enable_result" && value == 0){
      state_data["result_input_length"] = 0;
      state_data["result_type"] = 0;
      state_data["result_suffix"] = "";
    }
    this.setState(state_data);
  };
  
  register=async()=>{
    let path = "/app/api/v2/master/inspection/registerInspectionMaster";
    let post_data = {
      params: this.state
    };
    await apiClient.post(path, post_data).then((res)=>{
      this.setState({
        confirm_type:"",
        confirm_title:'',
        confirm_message:"",
        alert_messages:res.alert_message !== undefined ? res.alert_message : res.error_message,
        alert_type:res.alert_message !== undefined ? "modal_close" : ""
      });
    });
  }
  
  checkValidation = () => {
    let error_str_arr = [];
    let state_data = JSON.parse(JSON.stringify(this.state));
    if(this.state.enable_connection_date === 0){
      state_data.connection_date_title = " ";
    }
    if(this.state.enable_body_part_comment === 0){
      state_data.body_part_panel_config = " ";
    }
    if(this.state.enable_result === 0){
      state_data.result_input_length = 1;
    }
    let validate_data = harukaValidate('master', 'inspection_master', 'inspection_master', state_data);
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id !== "") {
      this.setState({first_tag_id: validate_data.first_tag_id});
    }
    return error_str_arr;
  };
  
  closeValidateAlertModal = () => {
    this.setState({ check_message: "" });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null) {
      $("#" + first_tag_id).focus();
    }
  };
  
  handleOk =()=> {
    if(this.change_flag === 0){
      return;
    }
    let error = this.checkValidation();
    if (error.length > 0) {
      this.setState({ check_message: error.join("\n") });
      return;
    }
    this.setState({
      confirm_type:"register",
      confirm_title:(this.state.inspection_id == null ? "登録" : "変更") + '確認',
      confirm_message: this.state.inspection_id == null ? "登録しますか？" : (this.state.title + "マスタ情報を変更しますか？")
    });
  };
  
  confirmCancel=()=>{
    if(this.state.alert_type === "modal_close"){
      this.props.handleOk();
    }
    this.setState({
      alert_messages: "",
      confirm_type:"",
      confirm_title:'',
      confirm_message: "",
    });
  }
  
  setIntNumberValue = (key,e) => {
    let RegExp = /^[0-9０-９]*$/;
    if (e.target.value != '' && !RegExp.test(e.target.value)){
      this.setState({[key]: this.state[key]});
    } else {
      this.change_flag = 1;
      this.setState({[key]: toHalfWidthOnlyNumber(e.target.value)});
    }
  }
  
  setRadioState = (e) => {
    this.change_flag = 1;
    this.setState({[e.target.name]:parseInt(e.target.value)});
  }
  
  setTextValue = (key,e) => {
    this.change_flag = 1;
    this.setState({[key]: e.target.value});
  }
  
  confirmCloseModal=()=>{
    if(this.change_flag === 1){
      this.setState({
        confirm_type:"modal_close",
        confirm_title:'入力中',
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
      });
    } else {
      this.props.closeModal();
    }
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type === "register"){
      this.register();
    }
    if(this.state.confirm_type === "modal_close"){
      this.props.closeModal();
    }
  }
  
  render() {
    return  (
      <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>{this.state.inspection_id == null ? "生理検査追加" : (this.state.title + "マスタ編集")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="checkbox_area">
              <Checkbox
                label="常に表示"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.is_enabled}
                checked = {this.state.is_enabled ===1}
                name="is_enabled"
              />
            </div>
            {this.state.inspection_id !== null && (
              <div style={{marginBottom:"0.5rem"}}>
                <InputWithLabelBorder
                  label='検査マスタID'
                  type="number"
                  isDisabled={true}
                  diseaseEditData={this.state.inspection_id}
                />
              </div>
            )}
            <InputWithLabelBorder
              label='検査マスタ名'
              type="text"
              id={'name_id'}
              className="name-area"
              getInputText={this.setTextValue.bind(this, "name")}
              diseaseEditData={this.state.name}
            />
            <div className = "checkbox_area">
              <Checkbox
                label="部位指定あり"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.enable_body_part_comment}
                checked = {this.state.enable_body_part_comment === 1}
                name="enable_body_part_comment"
              />
            </div>
            <div>
              <InputWithLabelBorder
                label="部位パネル設定ファイルの場所"
                type="text"
                id={'body_part_panel_config_id'}
                getInputText={this.setTextValue.bind(this, "body_part_panel_config")}
                diseaseEditData={this.state.body_part_panel_config}
                isDisabled={this.state.enable_body_part_comment === 0}
              />
            </div>
            <div className = "checkbox_area">
              <Checkbox
                label="検査数量を使用"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.enable_count_value}
                checked = {this.state.enable_count_value ===1}
                name="enable_count_value"
              />
            </div>
            <div className = "display_order">
              <InputWithLabelBorder
                label="検査数量ラベル"
                type="text"
                id={'count_label_id'}
                getInputText={this.setTextValue.bind(this, "count_label")}
                diseaseEditData={this.state.count_label}
              />
            </div>
            <div style={{marginTop:"0.5rem"}}>
              <InputWithLabelBorder
                label="検査数量単位"
                type="text"
                id={'count_suffix_id'}
                getInputText={this.setTextValue.bind(this, "count_suffix")}
                diseaseEditData={this.state.count_suffix}
              />
            </div>
            <div className="checkbox_area">
              <Checkbox
                label="身長・体重・体表面積"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.enable_height_weight_surface_area}
                checked={this.state.enable_height_weight_surface_area === 1}
                name="enable_height_weight_surface_area"
              />
            </div>
            <div>
              <InputWithLabelBorder
                label="身長・体重・体表面積補足テキスト"
                type="text"
                id={'height_weight_surface_area_text_id'}
                getInputText={this.setTextValue.bind(this, "height_weight_surface_area_text")}
                diseaseEditData={this.state.height_weight_surface_area_text}
                isDisabled={this.state.enable_height_weight_surface_area === 0}
              />
            </div>
            <div className="checkbox_area">
              <Checkbox
                label="連携用日付を使用"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.enable_connection_date}
                checked={this.state.enable_connection_date === 1}
                name="enable_connection_date"
              />
            </div>
            <div>
              <InputWithLabelBorder
                label="日付タイトル"
                type="text"
                id={'connection_date_title_id'}
                getInputText={this.setTextValue.bind(this, "connection_date_title")}
                diseaseEditData={this.state.connection_date_title}
                isDisabled={this.state.enable_connection_date === 0}
              />
            </div>
            <div className = "checkbox_area">
              <Checkbox
                label="予約枠形式"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.is_reserved}
                checked = {this.state.is_reserved === 1}
                name="is_reserved"
              />
            </div>
            <div className = "checkbox_area flex">
              <Checkbox
                label="終了まで継続する形式"
                getRadio={this.getAlwaysShow.bind(this)}
                value={(this.state.end_until_continue_type === 1 || this.state.end_until_continue_type === 2)}
                checked = {(this.state.end_until_continue_type === 1 || this.state.end_until_continue_type === 2)}
                name="end_until_continue_type"
              />
              <Checkbox
                label="入院のみ"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.end_until_continue_type === 2}
                checked = {this.state.end_until_continue_type === 2}
                name="end_until_continue_type_2"
                isDisabled={this.state.end_until_continue_type === 0}
              />
            </div>
            <div className="checkbox_area">
              <Checkbox
                label="実施中で毎日継続形式"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.every_day_continue_type}
                checked = {this.state.every_day_continue_type === 1}
                name="every_day_continue_type"
              />
            </div>
            <div className="checkbox_area">
              <Checkbox
                label="継続中に複数回実行"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.performed_multiple_times_type}
                checked = {this.state.performed_multiple_times_type === 1}
                name="performed_multiple_times_type"
                isDisabled={this.state.every_day_continue_type === 0}
              />
            </div>
            <div className="checkbox_area">
              <Checkbox
                label="熱型表から使用可能"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.is_available_order_from_elapsed_page}
                checked = {this.state.is_available_order_from_elapsed_page === 1}
                name="is_available_order_from_elapsed_page"
              />
            </div>
            <div className="checkbox_area">
              <Checkbox
                label="実施時に結果値を使用"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.enable_result }
                checked = {this.state.enable_result === 1}
                name="enable_result"
              />
            </div>
            <div className={'hankaku-eng-num-input'}>
              <InputWithLabelBorder
                label="結果値の最大文字数"
                type="text"
                id={'result_input_length_id'}
                getInputText={this.setIntNumberValue.bind(this, 'result_input_length')}
                diseaseEditData={this.state.result_input_length}
                isDisabled={this.state.enable_result === 0}
              />
            </div>
            <div className={'radio-area'}>
              <div className={'label-title'}>結果値のタイプ</div>
              <Radiobox
                label={'decimal'}
                value={0}
                getUsage={this.setRadioState.bind(this)}
                checked={this.state.result_type === 0}
                name={`result_type`}
                isDisabled={this.state.enable_result === 0}
              />
              <Radiobox
                label={'text'}
                value={1}
                getUsage={this.setRadioState.bind(this)}
                checked={this.state.result_type === 1}
                name={`result_type`}
                isDisabled={this.state.enable_result === 0}
              />
              <Radiobox
                label={'textarea'}
                value={2}
                getUsage={this.setRadioState.bind(this)}
                checked={this.state.result_type === 2}
                name={`result_type`}
                isDisabled={this.state.enable_result === 0}
              />
            </div>
            <div>
              <InputWithLabelBorder
                label="結果値の単位"
                type="text"
                id={'result_suffix_id'}
                getInputText={this.setTextValue.bind(this, "result_suffix")}
                diseaseEditData={this.state.result_suffix}
                isDisabled={this.state.enable_result === 0}
              />
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.confirmCloseModal}>キャンセル</Button>
          <Button className={this.change_flag === 1 ? "red-btn" : "disable-btn"} onClick={this.handleOk}>{this.state.inspection_id == null ? "登録" : "変更"}</Button>
        </Modal.Footer>
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title={this.state.confirm_title}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.confirmCancel.bind(this)}
            handleOk= {this.confirmCancel.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.check_message !== "" && (
          <ValidateAlertModal
            handleOk={this.closeValidateAlertModal}
            alert_meassage={this.state.check_message}
          />
        )}
      </Modal>
    );
  }
}

EditInspectionMasterModal.contextType = Context;
EditInspectionMasterModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  inspection_id: PropTypes.number,
  inspection_name : PropTypes.string,
};
export default EditInspectionMasterModal;
