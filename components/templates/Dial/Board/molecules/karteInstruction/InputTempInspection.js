import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {disable} from "../../../../../_nano/colors";
import {formatDateTimeIE} from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SelectorWithLabelIndex from "~/components/molecules/SelectorWithLabelIndex";
import {CACHE_SESSIONNAMES} from "~/helpers/constants";
import {
  makeList_code,
  sortTimingCodeMaster,
  makeList_codeName,
} from "~/helpers/dialConstants";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as methods from "~/components/templates/Dial/DialMethods";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  height: 99%;

  .remove-x-input{
    input{
      width: 270px;
      height:25px;
    }
    .label-title{
      margin-top:3px;
      text-align:right;
      margin-right:5px;
      width:5rem;
    }
  }
`;

const Table = styled.div`
  font-size: 1rem;
  font-family: "Noto Sans JP", sans-serif;
  width: 100%;
  height: calc(100% - 3.5rem);
  .th-div{
    text-align: center;
    background: lightgray;
    font-weight: bold;
  }
  .tbody-div {
    height: calc(100% - 2rem);
    overflow-y: auto;
  }
  .th-div, .td-div {
    border: 1px solid ${disable};
    padding: 0.25rem;
  }
  .td-div {
    .label-title, .label-unit{
        width: 0;
    }
    button{
      max-width:10rem;
    }
    input{
      height:2rem;
    }
    .pullbox-select{
      height:2rem;
    }
  }
  .name-td{
    width:25rem;
    .pullbox-label, .pullbox-select{
      width:24rem;
      margin-bottom: 0;
    }
  }
  .amount-td{
    width:2.5rem;
  }
  .popup-td{
    width:12rem;
    .pullbox-label, .pullbox-select{
      width:11rem;
      margin-bottom: 0;
    }
  }
  .date-td{
    width:10rem;
    .react-datepicker-wrapper{
      margin-top:-8px;
    }
    .label-title{
      display:none;
    }
    input{
      width:9rem;
      height:2rem;
    }
  }
  .timing-td{
    width:20rem;
    .pullbox-label, .pullbox-select{
      width:19rem;
      margin-bottom: 0;
    }
  }
  .done-td{
    width:5rem;
    cursor: pointer;
  }
  .not-done-td{
    background-color: lightgrey;
  }
  .real-done-td{
    background-color: rgb(105, 200, 225);
  }
  .done-name-td{
    width:15rem;
  }
  .button-td {
    width: 5rem;
  }
`;

class InputTempInspection extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    var timingCodeData = sortTimingCodeMaster(code_master["実施タイミング"]);
    this.examinationCodeData = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"examination_master");
    this.examination_codes = makeList_code(this.examinationCodeData);
    this.examination_code_options = makeList_codeName(this.examinationCodeData, 1);
    this.timing_codes = makeList_code(timingCodeData);
    this.timing_options = makeList_codeName(timingCodeData, 1);
    if (this.timing_options.length > 0) {
      this.timing_options.shift();
    }
    if (this.examination_code_options.length > 0) {
      this.examination_code_options.shift();
    }
    this.state = {
      isDeleteConfirmModal: false,
      confirm_message:'',
      isShowTreatDoctorList: false,
      isShowInspectList:false,
      isShowDoctorList: false,
    }
  }
  async componentDidMount() {
    this.initailize();
    if (this.props.from_source == 'dr_medical'){
      await this.setDoctors();
      if (this.context.selectedDoctor.code > 0) {
        this.setState({
          instruction_doctor_number: parseInt(this.context.selectedDoctor.code),              
        });
      }
    }
  }
  showDoctorList = (e) => {
    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e != undefined && (e.target.type == undefined || e.target.type != "text")) return;
    
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_number > 0) {
      this.setState({
        instruction_doctor_number: authInfo.doctor_number,
      });
    } else {
      this.setState({
        isShowDoctorList: true,
      });
    }
  };

  selectDoctor = (doctor) => {
    this.setState(
      {
        instruction_doctor_number: doctor.number,
      },
      () => {
        this.context.$updateDoctor(doctor.number, doctor.name);

        this.closeModal();
      }
    );
  };

  initailize () {
    if (this.props.karte_data == undefined || this.props.karte_data == null) return;
    this.ex_temporary_inspection_list = this.props.karte_data.temportary_inspection.prev;
    if (this.props.karte_data.temportary_inspection.after !== undefined){
      this.setState({new_temporary_inspection_list:this.props.karte_data.temportary_inspection.after})
    }
    if (this.props.karte_data.temportary_inspection.after != undefined && this.props.karte_data.temportary_inspection.after == ''){
      if (this.props.karte_data.temportary_inspection.prev != undefined) {
        var new_temporary_inspection_list = JSON.parse(JSON.stringify(this.props.karte_data.temportary_inspection.prev));
        this.setState({new_temporary_inspection_list});
      }
    }
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.karte_data == undefined || nextProps.karte_data == null) return;
    if (nextProps.karte_data.temportary_inspection.prev == this.ex_temporary_inspection_list) return;
    this.initailize();
  }
  
  closeModal = () => {
    this.setState({
      isShowTreatDoctorList: false,
      isShowInspectList:false,
      isShowDoctorList: false,
    });
  };
  
  delete = (selected_index,is_temporary) => {
    var base_modal = document.getElementsByClassName("input-instruction-modal")[0];
    if (base_modal !== undefined && base_modal != null) base_modal.style['z-index'] = 1040;
    var waring_message = '';
    var new_temporary_inspection_list = this.state.new_temporary_inspection_list;
    waring_message = new_temporary_inspection_list[selected_index].name;
    this.setState({
      isDeleteConfirmModal : true,
      confirm_message: "検査を中止しますか?",
      selected_index,
      is_temporary,
      waring_message
    });
  };
  
  delInspection = () => {
    let {new_temporary_inspection_list, selected_index} = this.state;
    new_temporary_inspection_list[selected_index].is_canceled = 1;
    new_temporary_inspection_list[selected_index].is_changed = 1;
    this.setState({new_temporary_inspection_list});
    this.props.handleOk(new_temporary_inspection_list);
    this.confirmCancel();
  };
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
      waring_message:''
    });
  }
  
  getName = (e, item) => {
    item.examination_code = e.target.id;
    item.name = e.target.value;
    item.is_changed = true;
    this.props.handleOk(this.state.new_temporary_inspection_list);
  };
  
  getTiming = (e, item) => {
    item.timing_code = e.target.id;
    item.is_changed = true;
    this.props.handleOk(this.state.new_temporary_inspection_list);
  };
  
  getPopupDisplay = (e, item) => {
    item.is_require_confirmation_before_weight_measurement = e.target.id;
    item.is_changed = true;
    this.props.handleOk(this.state.new_temporary_inspection_list);
  };
  
  getScheduleDate = (item, value) => {
    item.schedule_date = value;
    item.is_changed = true;
    this.props.handleOk(this.state.new_temporary_inspection_list);
  }
  
  
  addInspect = (item) => {
    var temp = this.state.new_temporary_inspection_list;
    var add_item = {
      number: null,
      system_patient_id: this.props.patientInfo.system_patient_id,
      examination_code: item.code,
      timing_code: 1,
      schedule_date: this.props.schedule_date,
      is_temporary: 1,
      temporary:1,
      is_canceled: 0,
      canceled_by: null,
      canceled_at: null,
      is_completed: 0,
      completed_by: null,
      completed_at: null,
      is_changed:true,
      name:item.name,
      is_new:true,
    };
    if (temp == undefined || temp == null || temp == '') temp = [];
    temp.push(add_item);
    this.setState({
      new_temporary_inspection_list: temp,
      isShowInspectList: false,
    }, () => {
      this.props.handleOk(this.state.new_temporary_inspection_list);
    });
  };
  
  change_not_done = (item) => {
    item.is_completed = 0;
    item.completed_by = null;
    item.is_changed = true;
    this.forceUpdate();
    this.props.handleOk(this.state.new_temporary_inspection_list);
  };
  
  change_done = (item) => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    item.is_completed = 1;
    item.completed_by = authInfo.user_number;
    item.is_changed = true;
    this.forceUpdate();
    this.props.handleOk(this.state.new_temporary_inspection_list);
  };
  
  showTreatDoctorList = (item) => {
    if (item.is_completed != 1) return;
    this.setState({
      isShowTreatDoctorList: true,
      selected_row_item: item,
    });
  };
  
  selectTreatDoctor = (doctor) => {
    var selected_item = this.state.selected_row_item;
    selected_item.completed_by = doctor.number;
    selected_item.is_changed = true;
    this.closeModal();
    this.props.handleOk(this.state.new_temporary_inspection_list);
  };
  
  showInspectList = () => {
    this.setState({ isShowInspectList: true });
  };
  
  render() {
    let {new_temporary_inspection_list} = this.state;
    var {staff_list_by_number} = this.props;
    var popup_display = { 0: "無", 1: "有" };
    var authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));    
    return  (
      <Wrapper>
        <div><p className='border selected clickable text-center' style={{width:"7rem", fontSize: "1rem", lineHeight:"2.37rem"}} onClick={this.showInspectList}>臨時検査</p></div>
        <Table>
          <div className="w-100 d-flex thead-div">
            <div className='name-td th-div'>検査名称</div>
            <div className='timing-td th-div'>実施タイミング</div>
            <div className='popup-td th-div'>ポップアップ表示</div>
            <div className='date-td th-div'>施行日</div>
            <div className='done-td th-div'>実施</div>
            <div className='done-name-td th-div'>実施者</div>
            <div className="th-div button-td">&nbsp;</div>
          </div>
          <div className="w-100 tbody-div">
            {new_temporary_inspection_list != null && new_temporary_inspection_list.length >0 && (
              new_temporary_inspection_list.map((item,index)=>{
                if (item != null && item.is_canceled == 0){
                  return (
                    <>
                      <div className="w-100 d-flex">
                        <div className='name-td td-div' style={{borderRight:"none"}}>
                          <SelectorWithLabel
                            options={this.examination_code_options}
                            getSelect={(e) => this.getName(e, item)}
                            departmentEditCode={item.examination_code}
                            id = {'examination_code_id' + index}
                          />
                        </div>
                        <div className='timing-td td-div' style={{borderRight:"none"}}>
                          <SelectorWithLabel
                            options={this.timing_options}
                            getSelect={(e) => this.getTiming(e, item)}
                            departmentEditCode={item.timing_code}
                            id = {'timing_code_id' + index}
                          />
                        </div>
                        <div className='popup-td td-div' style={{borderRight:"none"}}>
                          {(this.timing_codes[item.timing_code] =="透析前" || this.timing_codes[item.timing_code] == "透析終了後") && (
                            <SelectorWithLabelIndex
                              options={popup_display}
                              getSelect={(e) =>this.getPopupDisplay(e, item)}
                              departmentEditCode={item.is_require_confirmation_before_weight_measurement}
                            />
                          )}
                        </div>
                        <div className='date-td td-div' style={{borderRight:"none"}}>
                          <InputWithLabel
                            label=""
                            type="date"
                            getInputText={this.getScheduleDate.bind(this, item)}
                            diseaseEditData={formatDateTimeIE(item.schedule_date)}
                            isDisabled = {!item.is_new}
                          />
                        </div>
                        {item.is_completed === 1 && (
                          <div className="text-center real-done-td done-td td-div" style={{borderRight:"none"}} onClick={() => this.change_not_done(item)}>済</div>
                        )}
                        {item.is_completed === 0 && (
                          <div className="text-center not-done-td done-td td-div" style={{borderRight:"none"}} onClick={() => this.change_done(item)}>未</div>
                        )}
                        <div className='done-name-td td-div' style={{cursor:'pointer', borderRight:"none"}} onClick={this.showTreatDoctorList.bind(this,item)}>
                          {item.completed_by > 0 ? staff_list_by_number[item.completed_by]: ""}
                        </div>
                        <div className='text-center button-td td-div'><button onClick={this.delete.bind(this,index,1)}>中止</button></div>
                      </div>
                    </>
                  )
                }
              })
            )}
          </div>
        </Table>
        {this.props.from_source == 'dr_medical' && (
          <div onClick={(e)=>this.showDoctorList(e)} 
            className={authInfo !== undefined && authInfo != null && authInfo.doctor_number === 0 
            ? "remove-x-input  cursor-input"
            : "remove-x-input display-none"}>
            <InputWithLabel
              label="指示者"
              type="text"
              isDisabled={true}
              diseaseEditData={this.state.instruction_doctor_number > 0 && this.state.doctor_list_by_number != undefined ? this.state.doctor_list_by_number[this.state.instruction_doctor_number]: ""}
            />
          </div>
        )}
        {this.state.isDeleteConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.delInspection.bind(this)}
            confirmTitle= {this.state.confirm_message}
            waring_message = {this.state.waring_message}
          />
        )}
        {this.state.isShowTreatDoctorList !== false && (
          <DialSelectMasterModal
            selectMaster={this.selectTreatDoctor}
            closeModal={this.closeModal}
            MasterCodeData={this.props.staffs}
            MasterName="スタッフ"
          />
        )}
        {this.state.isShowInspectList !== false && (
          <DialSelectMasterModal
            selectMaster={this.addInspect}
            closeModal={this.closeModal}
            MasterCodeData={this.examinationCodeData}
            MasterName="検査"
          />
        )}
        {this.state.isShowDoctorList && (
          <DialSelectMasterModal
            selectMaster={this.selectDoctor}
            closeModal={this.closeModal}
            MasterCodeData={this.state.doctors}
            MasterName="医師"
          />
        )}
      </Wrapper>
    )}
}

InputTempInspection.contextType = Context;

InputTempInspection.propTypes = {
  karte_data:PropTypes.object,
  schedule_date:PropTypes.string,
  patientInfo:PropTypes.object,
  handleOk:PropTypes.func,
  staff_list_by_number:PropTypes.object,
  staffs:PropTypes.array,
  from_source:PropTypes.string
};

export default InputTempInspection;