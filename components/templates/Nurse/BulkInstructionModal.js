import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import Radiobox from "~/components/molecules/Radiobox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import BulkHistoryModal from "./BulkHistoryModal";
import TimesSelectModal from "../../molecules/TimesSelectModal";

const Wrapper = styled.div`
    overflow-y: hidden;
    overflow-x: hidden;
    height: 100%;
    font-size:1rem;
    .select-check {
      margin-right: 0.1rem;
      line-height: 1.9rem;
      label {
        font-size: 1rem;
      }
    }
    :disabled {
      cursor: default !important;
    }
    .left-area{
      width: 41rem;
    }
    .right-area {
      width: calc(100% - 41rem);
    }
    .check-area{
      label {
        font-size: 1rem;
      }
    }
    .check-title {
      width: 8rem;
      line-height: 1.9rem;
    }
    .no-label {
      .label-title {display:none;}
    }
    .inputboxtag {
      width: calc(100% - 8.1rem);
      div {
        margin-top: 0;
      }
      input {
        height: 1.9rem;
        width: 100%;
      }
    }
    .input-text {
      width: calc(100% - 10rem);
      div {margin-top:0;}
      input {
        width:100%;
        height: 1.9rem;
      }
    }
    .hospital-instruction {
      overflow-y: auto;
      height: calc(100% - 17.3rem);
      .check-area{
        label{
          width: 2rem;
          line-height: 1.9rem;
        }
      }
    }
    .inspection-instruction {
      .check-title {
        margin-right: 0.2rem;
        border-right: solid 1px lightgray;
      }
      .right-check-area {
        width: calc(100% - 8rem);
        padding-left: 0.15rem;
        .select-check {
          float: left;
        }
      }
    }
    .disable-routine{
      .right-routine{
        label {
          color: lightgray;
          cursor: default;
        }
        .checked-radio label {
          color: black;
        }
      }
    }
    .routine-instruction {
      .input-text{
        width: 4.5rem;
      }
      .left-routine {
        width: 12rem;
        border-right: solid 1px lightgray;
        padding: 0.15rem;
        padding-right: 0;
      }
      .right-routine {
        width:calc(100% - 12rem);
        padding: 0.15rem;
        .radio-area, .select-area, .input-label, .input-text {
          float: left;
        }
      }
      .check-area label{
        width: 12rem;
        margin-right: 0;
        line-height: 1.9rem;
      }
      label {font-size: 1rem;}
      .select-area {
        margin-right: 0.5rem;
        .label-title {display:none;}
        .pullbox-select {
          width: 9.5rem;
          height: 1.9rem;
          font-size:1rem;
        }
        .pullbox-label {
          margin-bottom: 0;
        }
      }
      .auto-width-check{
        .check-area label {
          width: auto;
        }
        .input-text{
          width: fit-content;
          margin-top: 0;
          margin-bottom: 0;
        }
        .input-box-tag {
          width: 5rem;
        }
        .input-text input{
          ime-mode: inactive;
        }
      }
      .input-label{
        line-height: 1.9rem;
        margin-right: 0.25rem;
        margin-left: 0.25rem;
        cursor: pointer;
        margin-bottom: 0;
        margin-top: 0;
      }
      .radio-area label{
        line-height: 1.9rem;
        margin-right: 0.5rem;
      }
      .letter-space label {
        letter-spacing: -1px;
      }
    }
`;

const Header = styled.div`
  margin-bottom:4px;
  display:flex;
  button{
    height: 2rem;
    width:6rem;
    font-size: 1rem;
    margin-right:0.5rem;
    padding:0.3rem;
    position: absolute;
    right: 15px;
    top: 11px;
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
`;

class BulkInstructionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      food_type_master: [{id:0,value:''}],
      rest_master: [{id:0,value:''}],
      checks_array: [],
      checks_text_array: {},
      confirm_message: "",
      confirm_alert_title: "",
      confirm_action: "",
      is_loaded: false,
      alert_messages: '',
      bulk_history: [],
      isOpenHistoryModal: false,
      timesSelectModal: false,
    };
    this.food_type_master = [];
    this.rest_master = [];
    this.exam_instruction = [];
    this.hos_instruction = [];
    this.routine_instruction = [];
    this.disable = false;
    this.save_check = false;
    this.edit_check = false;
  }
  
  async componentDidMount () {
    this.disable = this.context.$canDoAction(this.context.FEATURES.HOSPITAL_INSTRUCTION, this.context.AUTHS.REGISTER) || this.context.$canDoAction(this.context.FEATURES.HOSPITAL_INSTRUCTION, this.context.AUTHS.REGISTER_PROXY);
    this.save_check = this.context.$canDoAction(this.context.FEATURES.HOSPITAL_INSTRUCTION, this.context.AUTHS.REGISTER) || this.context.$canDoAction(this.context.FEATURES.HOSPITAL_INSTRUCTION, this.context.AUTHS.REGISTER_PROXY);
    this.edit_check = this.context.$canDoAction(this.context.FEATURES.HOSPITAL_INSTRUCTION, this.context.AUTHS.REGISTER) || this.context.$canDoAction(this.context.FEATURES.HOSPITAL_INSTRUCTION, this.context.AUTHS.REGISTER_PROXY);
    await this.getMasterData();
    await this.getBulkInfo();
    await this.getBulkHistoryInfo();
    let {food_type_master, rest_master} = this.state;
    if(this.food_type_master !== undefined && this.food_type_master.length > 0) {
      this.food_type_master.map(item=>{
        let insert_item = {};
        insert_item.id=item.number;
        insert_item.value=item.name;
        food_type_master.push(insert_item);
      });
    }
    if(this.rest_master !== undefined && this.rest_master.length > 0) {
      this.rest_master.map(item=>{
        let insert_item = {};
        insert_item.id=item.number;
        insert_item.value=item.name;
        rest_master.push(insert_item);
      });
    }
    let _state_param = {};
    _state_param[food_type_master] = food_type_master;
    _state_param[rest_master] = rest_master;
    _state_param['is_loaded'] = true;
    this.setState(_state_param);
  }
  getMasterData = async () => {
    let path = "/app/api/v2/nurse/get_master_data";
    await apiClient._post(path).then(res=>{
      this.food_type_master = res.food_type_master;
      this.rest_master = res.rest_master;
      this.exam_instruction = res.exam_instruction;
      this.hos_instruction = res.hos_instruction;
      this.routine_instruction = res.routine_instruction;
    });
  }

  getBulkInfo = async () => {
    let path = "/app/api/v2/nurse/search_bulk_instruction";
    let post_data = {
      system_patient_id: this.props.patientId
    }
    await apiClient._post(path, {params: post_data}).then(res=>{
      if (res.alert_message) {
        this.setState({
          alert_messages: res.alert_message,
          is_loaded: true,
          alert_action: "close"
        });
        this.modalBlack();
        return;
      }
      if (res){
        if (res.number !== undefined && res.number > 0) {
          this.disable = this.context.$canDoAction(this.context.FEATURES.HOSPITAL_INSTRUCTION, this.context.AUTHS.EDIT) || this.context.$canDoAction(this.context.FEATURES.HOSPITAL_INSTRUCTION, this.context.AUTHS.EDIT_PROXY);
        }
        let state_data = this.state;
        state_data['number'] = res.number;
        state_data['checks_array'] = res.checks_array;
        state_data['checks_text_array']= res.checks_text_array;
        state_data['rest_id']= res.rest_id;
        state_data['food_type_id']= res.food_type_id;
        state_data['meal_text']= res.meal_text;
        state_data['vital_text']= res.vital_text;
        state_data['urinalysis_text']= res.urinalysis_text;
        state_data['blood_max_rise']= res.blood_max_rise;
        state_data['blood_min_rise']= res.blood_min_rise;
        state_data['blood_max_rise_1']= res.blood_max_rise_1;
        state_data['blood_min_rise_1']= res.blood_min_rise_1;
        state_data['high_start_speed']= res.high_start_speed;
        state_data['high_max_speed']= res.high_max_speed;
        state_data['down_max_speed']= res.down_max_speed;
        state_data['down_start_speed']= res.down_start_speed;
        state_data['down_max_speed_1']= res.down_max_speed_1;
        state_data['constipatied_text_1']= res.constipatied_text_1;
        state_data['constipatied_text_2']= res.constipatied_text_2;
        state_data['insomnia_text']= res.insomnia_text;
        state_data['temperature']= res.temperature;
        state_data['vital_times_info']= res.vital_times_info;
        if (res.radio_data !== undefined && Object.keys(res.radio_data).length > 0) {
          Object.keys(res.radio_data).map(index=>{
            let item = res.radio_data[index];
            state_data[index] = item;
          })
        }
        this.setState(state_data);
      }
    });
  }
  getBulkHistoryInfo = async () => {
    let path = "/app/api/v2/nurse/searchBulkHistory";
    let post_data = {
      system_patient_id: this.props.patientId
    }
    await apiClient._post(path, {params: post_data}).then(res=>{
      if (res){
        this.setState({bulk_history: res});
      }
    });
  }
  
  onHide = () => {}
  
  setCheckArray = (name, number)=>{
    this.change_flag = 1;
    let check_array = this.state[name];
    let index = check_array.indexOf(number);
    if(index === -1){
      check_array.push(number);
    } else {
      check_array.splice(index, 1);
    }
    this.setState({[name]:check_array});
  };
  setRoutineCheckArray = (name)=>{
    this.change_flag = 1;
    let {checks_array} = this.state;
    if (checks_array.length === 0) return;
    let routine_instruction = this.routine_instruction;
    let routine_data = routine_instruction.find(x => x.key == name);
    let del = false;
    if (routine_data !== undefined) {
      checks_array.map((item, index) => {
        routine_data.value.map(sub_item => {
          if (sub_item[0] == item) {
            checks_array.splice(index, 1);
            del = true;
          }
        })
      })
    }
    if (del) {
      this.setState({checks_array, [name]: undefined});
      if (name == "安静度") this.setState({rest_id: ""});
      else if (name == "食事") {
        this.setState({food_type_id: "", meal_text: undefined});
      } else if (name == "バイタルチェック") {
        this.setState({vital_text: undefined});
      } else if (name == "蓄尿") {
        this.setState({urinalysis_text: undefined});
      } else if (name == "血圧上昇時") {
        this.setState({
          blood_max_rise: undefined,
          blood_min_rise: undefined,
          blood_max_rise_1: undefined,
          blood_min_rise_1: undefined,
          high_start_speed: undefined,
          high_max_speed: undefined,
        });
      } else if (name == "血圧低下時") {
        this.setState({
          down_max_speed: undefined,
          down_start_speed: undefined,
          down_max_speed_1: undefined,
        });
      } else if (name == "便秘時") {
        this.setState({
          constipatied_text_1: undefined,
          constipatied_text_2: undefined,
        });
      } else if (name == "不眠時") {
        this.setState({
          insomnia_text: undefined,
        });
      } else if (name == "熱発時") {
        this.setState({
          temperature: undefined,
        });
      }
    }
  };
  
  setCheckTextArray =(name, number)=>{
    this.change_flag = 1;
    let {checks_text_array} = this.state;
    if(checks_text_array[number] === undefined){
      checks_text_array[number] = "";
    } else {
      delete checks_text_array[number];
    }
    let check_array = this.state[name];
    let find_index = check_array.indexOf(number);
    if(find_index === -1){
      check_array.push(number);
    } else {
      check_array.splice(find_index, 1);
    }
    this.setState({[name]:check_array, checks_text_array});
  };
  setRadioValue = (key,e) => {
    this.change_flag = 1;
    let value = parseInt(e.target.value);
    let routine_instruction = this.routine_instruction;
    let {checks_array} = this.state;
    let routine_data = routine_instruction.find(x => x.key == key);
    if (routine_data !== undefined) {
      checks_array.map((item, index)=> {
        routine_data.value.map(sub_item=>{
          if (sub_item[0] == item) checks_array.splice(index, 1);
        })
      })
    }
    checks_array.push(value);
    if (key == "バイタルチェック" && routine_data !== undefined) {
      let timesSelectModal = false;
      routine_data.value.map(item=>{
        if (item[0] == value && item[1] =="回数選択") timesSelectModal = true;
      })
      this.setState({timesSelectModal});
      this.modalBlack();
    }
    this.setState({[key]: value, checks_array});
  }
  setValue = (key,e) => {
    let RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
    if (e.target.value !== "" && !RegExp.test(e.target.value)) {
      return;
    }
    this.change_flag = 1;
    this.setState({[key]: e.target.value});
  }
  getRoutineCheck = (value) => {
    let routine_instruction = this.routine_instruction;
    let {checks_array} = this.state;
    let routine_data = routine_instruction.find(x => x.key == value);
    let result = false;
    if (routine_data !== undefined) {
      checks_array.map((item)=> {
        routine_data.value.map(sub_item=>{
          if (sub_item[0] == item) result = true;
        })
      })
    }
    return result
  }
  setTextValue = (number,e) => {
    this.change_flag = 1;
    let {checks_text_array} = this.state;
    checks_text_array[number] = e.target.value;
    this.setState({checks_text_array});
  }
  setSelectValue = (key, e) => {
    this.change_flag = 1;
    let {checks_array} = this.state;
    if (key === "rest_id") {
      let routine_instruction = this.routine_instruction;
      let routine_data = routine_instruction.find(x => x.key === "安静度");
      if (routine_data !== undefined) {
        if (checks_array.indexOf(routine_data.value[0][0]) === -1)
          checks_array.push(routine_data.value[0][0]);
      }
    }
    this.setState({[key]:parseInt(e.target.id), checks_array});
  };
  closeModal = () => {
    if (this.change_flag == 1) {
      this.setState({
        confirm_message: "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中',
        confirm_action: "close"
      });
      this.modalBlack();
      return;
    }
    this.props.closeModal();
  }
  
  confirmCancel = () => {
    this.setState({
      confirm_message: "",
      confirm_alert_title: "",
      confirm_action: "",
      alert_messages: "",
      alert_action: "",
      isOpenHistoryModal: false,
      timesSelectModal: false,
    });
    if (this.state.alert_action === "close") this.props.closeModal();
    this.modalBlackBack();
  }
  modalBlack = () => {
    let base_modal = document.getElementsByClassName("hospital-instruction-modal")[0];
    if(base_modal !== undefined && base_modal != null){
      base_modal.style['z-index'] = 1040;
    }
  }
  modalBlackBack = () => {
    let base_modal = document.getElementsByClassName("hospital-instruction-modal")[0];
    if(base_modal !== undefined && base_modal != null){
      base_modal.style['z-index'] = 1050;
    }
  }
  handleOk = () => {
    if (this.change_flag != 1) return;
    if (!this.disable) return;
    this.setState({
      confirm_message: "登録しましか?",
      confirm_action: "save"
    });
    this.modalBlack();
  }
  confirmOk = async () => {
    this.confirmCancel();
    if (this.state.confirm_action === "close") {
      this.props.closeModal();
      return ;
    }
    if (this.state.confirm_action === "save") {
      let path = "/app/api/v2/nurse/register_hos_instruction";
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      let post_data = {
        number: this.state.number,
        patientId: this.props.patientId,
        karte_status: 1,
        is_seal_print: 1,
        checks_array: this.state.checks_array,
        checks_text_array: this.state.checks_text_array,
        rest_id: this.state.rest_id,
        food_type_id: this.state.food_type_id,
        meal_text: this.state.meal_text,
        vital_text: this.state.vital_text,
        urinalysis_text: this.state.urinalysis_text,
        blood_max_rise: this.state.blood_max_rise,
        blood_min_rise: this.state.blood_min_rise,
        blood_max_rise_1: this.state.blood_max_rise_1,
        blood_min_rise_1: this.state.blood_min_rise_1,
        high_start_speed: this.state.high_start_speed,
        high_max_speed: this.state.high_max_speed,
        down_max_speed: this.state.down_max_speed,
        down_start_speed: this.state.down_start_speed,
        down_max_speed_1: this.state.down_max_speed_1,
        constipatied_text_1: this.state.constipatied_text_1,
        constipatied_text_2: this.state.constipatied_text_2,
        insomnia_text: this.state.insomnia_text,
        temperature: this.state.temperature,
        department_id: this.context.department.code == 0 ? 1 : this.context.department.code,
        vital_times_info: this.state.vital_times_info,
      }
      post_data['doctor_code'] = authInfo.staff_category == 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
      post_data['doctor_name'] = authInfo.staff_category == 1 ? authInfo.name : this.context.selectedDoctor.name;
      let {patientInfo} = this.props;
      post_data['patient_insurance_type'] = patientInfo.insurance_type != undefined ? parseInt(patientInfo.insurance_type) : 0;
      post_data['patient_insurance_name'] = patientInfo.insurance_type_list.find((x) => x.code == post_data['patient_insurance_type']) != undefined ?
        patientInfo.insurance_type_list.find((x) => x.code == post_data['patient_insurance_type']).name : "";
      
      if (authInfo.staff_category != 1) post_data['substitute_name'] = authInfo.name;
      await apiClient.post(path, {params: post_data}).then(()=>{
        this.setState({
          alert_messages: "登録しました。",
          alert_action: "close"
        });
        this.modalBlack();
      })
    }
  }
  
  openHistoryModal = () => {
    this.setState({isOpenHistoryModal: true});
    this.modalBlack();
  }
  
  saveAdministratePeriod = (param) => {
    this.setState({vital_times_info: param});
    this.confirmCancel();
  }
  
  render() {
    let save_tooltip = "";
    if (!this.disable) save_tooltip = "権限がありません。";
    return (
      <>
        <Modal show={true} className="patient-exam-modal progresschart-modal nurse-summary hospital-instruction-modal" onHide={this.onHide}>
          <Modal.Header>
            <Header>
            <Modal.Title>入院時指示</Modal.Title>
            <Button className="red-btn" onClick={this.openHistoryModal}>変更履歴</Button>
            </Header>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              {this.state.is_loaded ? (
                <div className={`d-flex h-100`}>
                  <div className="left-area">
                    <div>入院時検査指示</div>
                    <div className="inspection-instruction border mb-2">
                      {this.exam_instruction.length > 0 && this.exam_instruction.map(exam_item=>{
                        return (
                          <div className="d-flex border-bottom pl-1" key={exam_item}>
                            <div className="check-title">{exam_item.key}</div>
                            <div className="right-check-area">
                              {exam_item.value.map((item)=> {
                                return (
                                  <div className={'select-check'} key={item}>
                                    <Checkbox
                                      label={item[1]}
                                      getRadio={this.setCheckArray.bind(this)}
                                      value={(this.state.checks_array.includes(item[0]))}
                                      number={item[0]}
                                      name="checks_array"
                                      isDisabled={!this.disable}
                                    />
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div>入院時指示</div>
                    <div className="hospital-instruction border">
                      {this.hos_instruction.map((item)=>{
                        return (
                          <>
                            <div className="d-flex border-bottom pl-1" key={item}>
                              <div className="check-title">{item.select_text}</div>
                              <div className="check-area">
                                <Checkbox
                                  label=""
                                  getRadio={this.setCheckTextArray.bind(this)}
                                  value={(this.state.checks_array.includes(item.number))}
                                  number={item.number}
                                  name="checks_array"
                                  isDisabled={!this.disable}
                                />
                              </div>
                              <div className="input-text no-label">
                                <InputBoxTag
                                  label=""
                                  type="text"
                                  getInputText={this.setTextValue.bind(this, item.number)}
                                  value = {this.state.checks_text_array[item.number]}
                                  className="input-box-tag"
                                  isDisabled={!this.state.checks_array.includes(item.number) ||!this.disable}
                                />
                              </div>
                            </div>
                          </>
                        )
                      })}
                    </div>
                  </div>
                  <div className="right-area h-100 ml-2">
                    <div>ルーチン指示</div>
                    <div className={`routine-instruction border ${!this.disable ? "disable-routine":""}`}>
                      {this.routine_instruction.map(item=>{
                        return (
                          <div className="d-flex border-bottom pl-1" key={item}>
                            <div className="left-routine">
                              {item.key == "熱発時" && (
                                <div className="auto-width-check d-flex left-title">
                                  <div className='check-area mr-1'>
                                    <Checkbox
                                      label={item.key}
                                      getRadio={this.setRoutineCheckArray.bind(this)}
                                      value={this.getRoutineCheck(item.key)}
                                      number={item.value[0]}
                                      name={item.key}
                                      isDisabled={!this.disable}
                                    />
                                  </div>
                                  <div className="input-text no-label">
                                    <InputBoxTag
                                      label=""
                                      type="text"
                                      getInputText={this.setValue.bind(this,"temperature")}
                                      value = {this.state.temperature}
                                      className="input-box-tag"
                                      isDisabled={!this.getRoutineCheck(item.key) ||!this.disable}
                                    />
                                  </div>
                                  <div className="input-label">℃↑</div>
                                </div>
                              )}
                              {item.key !== "熱発時" && (
                                <div className="check-area left-title">
                                  <Checkbox
                                    label={item.key}
                                    getRadio={this.setRoutineCheckArray.bind(this)}
                                    value={this.getRoutineCheck(item.key)}
                                    number={item.value[0]}
                                    name={item.key}
                                    isDisabled={!this.disable}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="right-routine">
                              {item.key === "安静度" && (
                                <div className="select-area rest-select mt-1 mb-1">
                                  <SelectorWithLabel
                                    options={this.state.rest_master}
                                    title=""
                                    getSelect={this.setSelectValue.bind(this, 'rest_id')}
                                    departmentEditCode={this.state.rest_id}
                                    isDisabled={!this.disable}
                                  />
                                </div>
                              )}
                              {item.key !== "安静度" && (
                                <>
                                  {item.value !== undefined && item.value.length > 0 && item.value.map(sub_item=>{
                                    return (
                                      <>
                                        {sub_item[1] !== "(    )時間ごと" && sub_item[1] !== "(__)時間尿チェック" && sub_item[1] !== "アムロジンOD錠 1錠" &&
                                        sub_item[1] !== "ペルジピン" && sub_item[1] !== "センナリド[ ]錠" && sub_item[1] !== "ヨーピス　滴" &&
                                        sub_item[1] !== "水分制限" && sub_item[1] !== "その他" &&
                                        !sub_item[1].includes("ミオコール点滴静注") &&
                                        !sub_item[1].includes("80mmhg以下　カタボンＨ") &&
                                        !sub_item[1].includes("80mmhg/以下　プレドパ") && (
                                          <div className={this.state[item.key] == sub_item[0] ? "checked-radio radio-area":"radio-area"} key={sub_item}>
                                            <Radiobox
                                              label={sub_item[1]}
                                              value={sub_item[0]}
                                              key={sub_item[0]}
                                              getUsage={this.setRadioValue.bind(this, item.key)}
                                              checked={this.state[item.key] == sub_item[0]}
                                              name={item.key}
                                              isDisabled={!this.disable}
                                            />
                                          </div>
                                        )}
                                        {sub_item[1] === "(    )時間ごと" && (
                                          <div className={this.state[item.key] == sub_item[0] ? "checked-radio":""}>
                                            <div className="radio-area" key={sub_item}>
                                              <Radiobox
                                                label=""
                                                value={sub_item[0]}
                                                key={sub_item[0]}
                                                getUsage={this.setRadioValue.bind(this, item.key)}
                                                checked={this.state[item.key] == sub_item[0]}
                                                name={item.key}
                                                id={item.key+"_"+sub_item[0]}
                                                isDisabled={!this.disable}
                                              />
                                            </div>
                                            <div className="input-text no-label">
                                              <InputBoxTag
                                                label=""
                                                type="text"
                                                getInputText={this.setValue.bind(this,"vital_text")}
                                                value = {this.state.vital_text}
                                                className="input-box-tag"
                                                isDisabled={this.state[item.key] != sub_item[0] || !this.disable}
                                              />
                                            </div>
                                            <label className="input-label" htmlFor={item.key+"_"+sub_item[0]}>時間ごと</label>
                                          </div>
                                        )}
                                        {sub_item[1] === "(__)時間尿チェック" && (
                                          <div className={this.state[item.key] == sub_item[0] ? "checked-radio":""}>
                                            <div className="radio-area" key={sub_item}>
                                              <Radiobox
                                                label=""
                                                value={sub_item[0]}
                                                key={sub_item[0]}
                                                getUsage={this.setRadioValue.bind(this, item.key)}
                                                checked={this.state[item.key] == sub_item[0]}
                                                name={item.key}
                                                id={item.key+"_"+sub_item[0]}
                                                isDisabled={!this.disable}
                                              />
                                            </div>
                                            <div className="input-text no-label">
                                              <InputBoxTag
                                                label=""
                                                type="text"
                                                getInputText={this.setValue.bind(this,"urinalysis_text")}
                                                value = {this.state.urinalysis_text}
                                                className="input-box-tag"
                                                isDisabled={this.state[item.key] != sub_item[0] || !this.disable}
                                              />
                                            </div>
                                            <label htmlFor={item.key+"_"+sub_item[0]} className="input-label">時間尿チェック</label>
                                          </div>
                                        )}
                                        {sub_item[1] == "食種" && (
                                          <div className="select-area">
                                            <SelectorWithLabel
                                              options={this.state.food_type_master}
                                              title=""
                                              getSelect={this.setSelectValue.bind(this, 'food_type_id')}
                                              departmentEditCode={this.state.food_type_id}
                                              isDisabled={this.state[item.key] != sub_item[0] || !this.disable}
                                            />
                                          </div>
                                        )}
                                        {sub_item[1] == "水分制限" && (
                                          <div className={this.state[item.key] == sub_item[0] ? "checked-radio":""}>
                                            <div className="radio-area" key={sub_item}>
                                              <Radiobox
                                                label={sub_item[1]}
                                                value={sub_item[0]}
                                                key={sub_item[0]}
                                                getUsage={this.setRadioValue.bind(this, item.key)}
                                                checked={this.state[item.key] == sub_item[0]}
                                                name={item.key}
                                                id={item.key+"_"+sub_item[0]}
                                                isDisabled={!this.disable}
                                              />
                                            </div>
                                            <label className="input-label" htmlFor={item.key+"_"+sub_item[0]}>(</label>
                                            <div className="input-text no-label">
                                              <InputBoxTag
                                                label=""
                                                type="text"
                                                getInputText={this.setValue.bind(this,"meal_text")}
                                                value = {this.state.meal_text}
                                                className="input-box-tag"
                                                isDisabled={this.state[item.key] != sub_item[0] || !this.disable}
                                              />
                                            </div>
                                            <label className="input-label" htmlFor={item.key+"_"+sub_item[0]}>ml) 以下</label>
                                          </div>
                                        )}
                                        {sub_item[1] == "アムロジンOD錠 1錠" && (
                                          <div className={this.state[item.key] == sub_item[0] ? "checked-radio":""}>
                                            <div className="radio-area" key={sub_item}>
                                              <Radiobox
                                                label=""
                                                value={sub_item[0]}
                                                key={sub_item[0]}
                                                getUsage={this.setRadioValue.bind(this, item.key)}
                                                checked={this.state[item.key] == sub_item[0]}
                                                name={item.key}
                                                id={item.key+"_"+sub_item[0]}
                                                isDisabled={!this.disable}
                                              />
                                            </div>
                                            <div className="input-text no-label">
                                              <InputBoxTag
                                                label=""
                                                type="text"
                                                getInputText={this.setValue.bind(this,"blood_max_rise")}
                                                value = {this.state.blood_max_rise}
                                                className="input-box-tag"
                                                isDisabled={this.state[item.key] != sub_item[0] || !this.disable}
                                              />
                                            </div>
                                            <label htmlFor={item.key+"_"+sub_item[0]} className="input-label">mmhg/</label>
                                            <div className="input-text no-label">
                                              <InputBoxTag
                                                label=""
                                                type="text"
                                                getInputText={this.setValue.bind(this,"blood_min_rise")}
                                                value = {this.state.blood_min_rise}
                                                className="input-box-tag"
                                                isDisabled={this.state[item.key] != sub_item[0] || !this.disable}
                                              />
                                            </div>
                                            <label htmlFor={item.key+"_"+sub_item[0]} className="input-label">mmhg以上　　{sub_item[1]}</label>
                                          </div>
                                        )}
                                        {sub_item[1].includes("ミオコール点滴静注") && (
                                          <div className={this.state[item.key] == sub_item[0] ? "checked-radio radio-area":"radio-area"} key={sub_item} style={{clear:"both"}}>
                                            <Radiobox
                                              label={sub_item[1]}
                                              value={sub_item[0]}
                                              key={sub_item[0]}
                                              getUsage={this.setRadioValue.bind(this, item.key)}
                                              checked={this.state[item.key] == sub_item[0]}
                                              name={item.key}
                                              isDisabled={!this.disable}
                                            />
                                          </div>
                                        )}
                                        {sub_item[1] === "ペルジピン" && (
                                          <div className={this.state[item.key] == sub_item[0] ? "checked-radio":""}>
                                            <div className="radio-area" key={sub_item} style={{clear:"both"}}>
                                              <Radiobox
                                                label=""
                                                value={sub_item[0]}
                                                key={sub_item[0]}
                                                getUsage={this.setRadioValue.bind(this, item.key)}
                                                checked={this.state[item.key] == sub_item[0]}
                                                name={item.key}
                                                id={item.key+"_"+sub_item[0]}
                                                isDisabled={!this.disable}
                                              />
                                            </div>
                                            <div className="input-text no-label">
                                              <InputBoxTag
                                                label=""
                                                type="text"
                                                getInputText={this.setValue.bind(this,"blood_max_rise_1")}
                                                value = {this.state.blood_max_rise_1}
                                                className="input-box-tag"
                                                isDisabled={this.state[item.key] != sub_item[0] || !this.disable}
                                              />
                                            </div>
                                            <label htmlFor={item.key+"_"+sub_item[0]} className="input-label">mmhg/</label>
                                            <div className="input-text no-label">
                                              <InputBoxTag
                                                label=""
                                                type="text"
                                                getInputText={this.setValue.bind(this,"blood_min_rise_1")}
                                                value = {this.state.blood_min_rise_1}
                                                className="input-box-tag"
                                                isDisabled={this.state[item.key] != sub_item[0] || !this.disable}
                                              />
                                            </div>
                                            <label htmlFor={item.key+"_"+sub_item[0]} className="input-label">mmhg以上　　ペルジピン</label>
                                            <div className="input-text no-label">
                                              <InputBoxTag
                                                label=""
                                                type="text"
                                                getInputText={this.setValue.bind(this,"high_start_speed")}
                                                value = {this.state.high_start_speed}
                                                className="input-box-tag"
                                                isDisabled={this.state[item.key] != sub_item[0] || !this.disable}
                                              />
                                            </div>
                                            <label htmlFor={item.key+"_"+sub_item[0]} className="input-label">mg/hより開始　MAX</label>
                                            <div className="input-text no-label">
                                              <InputBoxTag
                                                label=""
                                                type="text"
                                                getInputText={this.setValue.bind(this,"high_max_speed")}
                                                value = {this.state.high_max_speed}
                                                className="input-box-tag"
                                                isDisabled={this.state[item.key] != sub_item[0] || !this.disable}
                                              />
                                            </div>
                                            <label htmlFor={item.key+"_"+sub_item[0]} className="input-label">mg/h</label>
                                          </div>
                                        )}
                                        {sub_item[1].includes("80mmhg以下　カタボンＨ") && (
                                          <div className={this.state[item.key] == sub_item[0] ? "checked-radio":""}>
                                            <div className="radio-area" key={sub_item}>
                                              <Radiobox
                                                label="80mmhg以下　カタボンＨを2.0ml/H~開始 1.0ずつUP MAX"
                                                value={sub_item[0]}
                                                key={sub_item[0]}
                                                getUsage={this.setRadioValue.bind(this, item.key)}
                                                checked={this.state[item.key] == sub_item[0]}
                                                name={item.key}
                                                isDisabled={!this.disable}
                                                id={item.key+"_"+sub_item[0]}
                                              />
                                            </div>
                                            <div className="input-text no-label">
                                              <InputBoxTag
                                                label=""
                                                type="text"
                                                getInputText={this.setValue.bind(this,"down_max_speed")}
                                                value = {this.state.down_max_speed}
                                                className="input-box-tag"
                                                isDisabled={this.state[item.key] != sub_item[0] || !this.disable}
                                              />
                                            </div>
                                            <label htmlFor={item.key+"_"+sub_item[0]} className="input-label" style={{marginBottom: 0}}>ml/H</label>
                                            <label htmlFor={item.key+"_"+sub_item[0]} className="input-label" style={{clear:"both", marginBottom: 0}}>100mmhg以上キープ　1.0ml/HずつDownし中止へ</label>
                                          </div>
                                        )}
                                        {sub_item[1].includes("80mmhg/以下　プレドパ") && (
                                          <div className={this.state[item.key] == sub_item[0] ? "checked-radio":""}>
                                            <div className="radio-area" key={sub_item} style={{clear:"both"}}>
                                              <Radiobox
                                                label="80mmhg/以下　プレドパ"
                                                value={sub_item[0]}
                                                key={sub_item[0]}
                                                getUsage={this.setRadioValue.bind(this, item.key)}
                                                checked={this.state[item.key] == sub_item[0]}
                                                name={item.key}
                                                isDisabled={!this.disable}
                                                id={item.key+"_"+sub_item[0]}
                                              />
                                            </div>
                                            <div className="input-text no-label">
                                              <InputBoxTag
                                                label=""
                                                type="text"
                                                getInputText={this.setValue.bind(this,"down_start_speed")}
                                                value = {this.state.down_start_speed}
                                                className="input-box-tag"
                                                isDisabled={this.state[item.key] != sub_item[0] || !this.disable}
                                              />
                                            </div>
                                            <label htmlFor={item.key+"_"+sub_item[0]} className="input-label">ml/H～開始　　MAX</label>
                                            <div className="input-text no-label">
                                              <InputBoxTag
                                                label=""
                                                type="text"
                                                getInputText={this.setValue.bind(this,"down_max_speed_1")}
                                                value = {this.state.down_max_speed_1}
                                                className="input-box-tag"
                                                isDisabled={this.state[item.key] != sub_item[0] || !this.disable}
                                              />
                                            </div>
                                            <label htmlFor={item.key+"_"+sub_item[0]} className="input-label">ml/H</label>
                                          </div>
                                        )}
                                        {sub_item[1] == "センナリド[ ]錠" && (
                                          <div className={this.state[item.key] == sub_item[0] ? "checked-radio":""}>
                                            <div className="radio-area" key={sub_item}>
                                              <Radiobox
                                                label="センナリド"
                                                value={sub_item[0]}
                                                key={sub_item[0]}
                                                getUsage={this.setRadioValue.bind(this, item.key)}
                                                checked={this.state[item.key] == sub_item[0]}
                                                name={item.key}
                                                isDisabled={!this.disable}
                                                id={item.key+"_"+sub_item[0]}
                                              />
                                            </div>
                                            <div className="input-text no-label">
                                              <InputBoxTag
                                                label=""
                                                type="text"
                                                getInputText={this.setValue.bind(this,"constipatied_text_1")}
                                                value = {this.state.constipatied_text_1}
                                                className="input-box-tag"
                                                isDisabled={this.state[item.key] != sub_item[0] || !this.disable}
                                              />
                                            </div>
                                            <label htmlFor={item.key+"_"+sub_item[0]} className="input-label">錠</label>
                                          </div>
                                        )}
                                        {sub_item[1] == "ヨーピス　滴" && (
                                          <div className={this.state[item.key] == sub_item[0] ? "checked-radio":""}>
                                            <div className="radio-area" key={sub_item}>
                                              <Radiobox
                                                label="ヨーピス"
                                                value={sub_item[0]}
                                                key={sub_item[0]}
                                                getUsage={this.setRadioValue.bind(this, item.key)}
                                                checked={this.state[item.key] == sub_item[0]}
                                                name={item.key}
                                                isDisabled={!this.disable}
                                                id={item.key+"_"+sub_item[0]}
                                              />
                                            </div>
                                            <div className="input-text no-label">
                                              <InputBoxTag
                                                label=""
                                                type="text"
                                                getInputText={this.setValue.bind(this,"constipatied_text_2")}
                                                value = {this.state.constipatied_text_2}
                                                className="input-box-tag"
                                                isDisabled={this.state[item.key] != sub_item[0] || !this.disable}
                                              />
                                            </div>
                                            <label htmlFor={item.key+"_"+sub_item[0]} className="input-label">錠</label>
                                          </div>
                                        )}
                                        {sub_item[1] == "その他" && (
                                          <div className={this.state[item.key] == sub_item[0] ? "checked-radio":""}>
                                            <div className="radio-area" key={sub_item}>
                                              <Radiobox
                                                label={sub_item[1]}
                                                value={sub_item[0]}
                                                key={sub_item[0]}
                                                getUsage={this.setRadioValue.bind(this, item.key)}
                                                checked={this.state[item.key] == sub_item[0]}
                                                name={item.key}
                                                id={item.key+"_"+sub_item[0]}
                                                isDisabled={!this.disable}
                                              />
                                            </div>
                                            <div className="input-text no-label">
                                              <InputBoxTag
                                                label=""
                                                type="text"
                                                getInputText={this.setValue.bind(this,"insomnia_text")}
                                                value = {this.state.insomnia_text}
                                                className="input-box-tag"
                                                isDisabled={this.state[item.key] != sub_item[0] || !this.disable}
                                              />
                                            </div>
                                            <label htmlFor={item.key+"_"+sub_item[0]} className="input-label">錠</label>
                                          </div>
                                        )}
                                      </>
                                    )
                                  })}
                                </>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ):(
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
            <Button className={this.change_flag == 1 && this.disable ? "red-btn" :"disable-btn"} tooltip={save_tooltip} onClick={this.handleOk}>確定</Button>
          </Modal.Footer>
          {this.state.confirm_message !== "" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}hi
              title={this.state.confirm_alert_title}
            />
          )}
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.isOpenHistoryModal && (
            <BulkHistoryModal
              closeModal={this.confirmCancel.bind(this)}
              history_data={this.state.bulk_history}
            />
          )}
          {this.state.timesSelectModal && (
            <TimesSelectModal
              closeModal={this.confirmCancel.bind(this)}
              saveAdministratePeriod={this.saveAdministratePeriod.bind(this)}
              administrate_period={this.state.vital_times_info}
              
            />
          )}
        </Modal>
      </>
    );
  }
}

BulkInstructionModal.contextType = Context;
BulkInstructionModal.propTypes = {
  closeModal: PropTypes.func,
  patientId: PropTypes.number,
  patientInfo: PropTypes.object,
  food_type_master: PropTypes.array,
  handleOk: PropTypes.func
};

export default BulkInstructionModal;