import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {disable} from "../../../../../_nano/colors";
import {formatDateTimeIE} from "~/helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import EditInjectionPatternSpecial from "~/components/templates/Dial/Board/molecules/EditInjectionPatternSpecial";
import * as sessApi from "~/helpers/cacheSession-utils";
import {displayInjectionName} from "~/helpers/dialConstants";
import renderHTML from "react-render-html";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as methods from "~/components/templates/Dial/DialMethods";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  height: 98%;
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
  .th-div, .td-div {
    border: 1px solid ${disable};
    padding: 0.25rem;
    word-break: break-all;
    font-size:1rem;
  }
  .tbody-div {
    height: calc(100% - 2rem);
    overflow-y: auto;
  }
  .td-div {
    .label-title, .label-unit{
        width: 0;
    }
  }
  .date-td{
    width: 10rem;
    .react-datepicker-wrapper{
      margin-top:-8px;
    }
    .label-title{
      display:none;
      
    }
    input{
      width:8rem;
      height:2rem;
    }
  }
`;

class InputOtherPanel extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      isEditInjectionModal: false,
      // ex_limit_injection_list: props.karte_data.limit_injection.prev,
      // ex_temporary_injection_list: props.karte_data.temporary_injection.prev,
      isOpenMedicineModal: false,
      schedule_item:{},
      is_edit: false,
      isDeleteConfirmModal: false,
      isShowDoctorList: false,
    }
    this.injection_master = sessApi.getObjectValue("dial_common_master","injection_master");
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

  getInjectionUnit (code) {
    if (this.injection_master == undefined || this.injection_master == null || this.injection_master.length == 0) return '';
    if (code == undefined || code == null || code == '') return '';
    var inject = this.injection_master.find(x => x.code == code);
    if (inject == undefined) return ''
    var unit = inject.unit;
    if (unit == undefined || unit == null) return '';
    return unit;
  }
  initailize () {
    if (this.props.karte_data.limit_injection.prev !== undefined){
      this.setState({ex_limit_injection_list:this.props.karte_data.limit_injection.prev})
    }
    if (this.props.karte_data.temporary_injection.prev !== undefined){
      this.setState({ex_temporary_injection_list:this.props.karte_data.temporary_injection.prev})
    }
    if (this.props.karte_data.limit_injection.after !== undefined){
      this.setState({new_limit_injection_list:this.props.karte_data.limit_injection.after})
    }
    if (this.props.karte_data.temporary_injection.after !== undefined){
      this.setState({new_temporary_injection_list:this.props.karte_data.temporary_injection.after})
    }
    if (this.props.karte_data.limit_injection.after !== undefined && this.props.karte_data.limit_injection.after === '' ) {
      let new_limit_injection_list = [];
      if (this.props.karte_data.limit_injection.prev.length > 0) {
        this.props.karte_data.limit_injection.prev.map((pres_item) => {
          let row = {};
          Object.keys(pres_item).map(idx => {
            if (idx !== "data_json") {
              row[idx] = pres_item[idx];
            } else {
              let row_json = [];
              pres_item.data_json.map(medi_item => {
                let medi_row = {};
                Object.keys(medi_item).map(medi_idx => {
                  medi_row[medi_idx] = medi_item[medi_idx];
                });
                row_json.push(medi_row);
                row['data_json'] = row_json;
              })
            }
          });
          new_limit_injection_list.push(row);
        });
      }
      this.setState({
        new_limit_injection_list,
      });
    }
    
    if (this.props.karte_data.temporary_injection.after !== undefined && this.props.karte_data.temporary_injection.after === '' ) {
      let new_temporary_injection_list = [];
      if (this.props.karte_data.temporary_injection.prev.length > 0) {
        this.props.karte_data.temporary_injection.prev.map((pres_item) => {
          let row = {};
          Object.keys(pres_item).map(idx => {
            if (idx !== "data_json") {
              row[idx] = pres_item[idx];
            } else {
              let row_json = [];
              pres_item.data_json.map(medi_item => {
                let medi_row = {};
                Object.keys(medi_item).map(medi_idx => {
                  medi_row[medi_idx] = medi_item[medi_idx];
                });
                row_json.push(medi_row);
                row['data_json'] = row_json;
              })
            }
          });
          new_temporary_injection_list.push(row);
        });
      }
      this.setState({
        new_temporary_injection_list,
      });
    }
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.karte_data.limit_injection.prev === this.state.ex_limit_injection_list && nextProps.karte_data.temporary_injection.prev === this.state.ex_temporary_injection_list) return;
    this.initailize();
  }
  
  OpenEditInjectionModal = async (e, is_temporary = 0, selected_item = null, selected_index = null) => {    
    this.setState({
      isEditInjectionModal: true,
      is_temporary,
      selected_item, 
      selected_index,
    })
    
  };
  
  closeModal = () => {
    this.setState({
      isEditInjectionModal: false,
      isOpenMedicineModal: false,
      isShowDoctorList:false,
    });
  };
  
  handleOk = (data) => {
    let added_data = {
      system_patient_id:this.props.patientInfo.system_patient_id,
      set_number:data.set_number,
      is_temporary : data.is_temporary,
      schedule_date : data.time_limit_from,
      time_limit_to : data.time_limit_to,
      final_week_days:data.final_week_days,
      injection_category : data.injection_category,
      data_json : data.data_json,
      timing_code : data.timing_code,
      weekday : data.weekday,
      week_interval : data.week_interval,
      monthly_enable_week_number : data.monthly_enable_week_number,
      instruction_doctor_number : data.instruction_doctor_number,
      stop_date : data.stop_date,
      reopening_date : data.reopening_date,
      is_new:true,
    }
    // if (this.state.is_temporary  == 0 ){
    //   var new_limit_injection_list = this.state.new_limit_injection_list;
    //   new_limit_injection_list.push(added_data);
    //   if (this.context.selectedDoctor.code > 0) {
    //     this.setState({
    //       new_limit_injection_list,
    //       instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
    //     });
    //   } else {
    //     this.setState({new_limit_injection_list});
    //   }
    //   this.props.handleOtherOk(new_limit_injection_list, this.state.is_temporary);
    // }
    if (this.state.is_temporary == 1){
      var new_temporary_injection_list = this.state.new_temporary_injection_list;      
      if (this.state.selected_index != undefined && this.state.selected_item != null ){
        var selected_index = this.state.selected_index;
        new_temporary_injection_list[selected_index].set_number = data.set_number;
        new_temporary_injection_list[selected_index].schedule_date = data.time_limit_from;
        new_temporary_injection_list[selected_index].is_temporary = data.is_temporary;
        new_temporary_injection_list[selected_index].injection_category = data.injection_category;
        new_temporary_injection_list[selected_index].data_json = data.data_json;
        new_temporary_injection_list[selected_index].timing_code = data.timing_code;
        new_temporary_injection_list[selected_index].instruction_doctor_number = data.instruction_doctor_number;
      } else {
        new_temporary_injection_list.push(added_data);
      }
      
      if (this.context.selectedDoctor.code > 0) {
        this.setState({
          new_temporary_injection_list,
          instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
        });
      } else {
        this.setState({new_temporary_injection_list});
      }
      
      this.props.handleOtherOk(new_temporary_injection_list, this.state.is_temporary);
    }
    this.closeModal();
  };
  
  delete = (selected_index,is_temporary) => {
    var base_modal = document.getElementsByClassName("input-instruction-modal")[0];
    if (base_modal !== undefined && base_modal != null) base_modal.style['z-index'] = 1040;
    var new_temporary_injection_list = this.state.new_temporary_injection_list;
    var waring_message = '';
    if (new_temporary_injection_list[selected_index].data_json != null && new_temporary_injection_list[selected_index].data_json.length > 0){
      new_temporary_injection_list[selected_index].data_json.map(val => {
        waring_message += val.item_name + '\n';
      })
    }
    this.setState({
      isDeleteConfirmModal : true,
      confirm_message: "薬剤を削除しますか?",
      selected_index,
      is_temporary,
      waring_message
    });
  };
  
  delMedicine = () => {
    let {selected_index,is_temporary} = this.state;
    let {new_limit_injection_list, new_temporary_injection_list} = this.state;
    if (is_temporary ==1 ){
      new_temporary_injection_list[selected_index] = null;
      this.setState({new_temporary_injection_list});
      this.props.handleOtherOk(new_temporary_injection_list, is_temporary);
    }
    if (is_temporary ==0 ){
      new_limit_injection_list[selected_index] = null;
      this.setState({new_limit_injection_list});
      this.props.handleOtherOk(new_limit_injection_list, is_temporary);
    }
    // var base_modal = document.getElementsByClassName("input-instruction-modal")[0];
    // if (base_modal !== undefined && base_modal != null) base_modal.style['z-index'] = 1050;
    this.confirmCancel();
    
  };
  
  getScheduleDate = (item, value) => {
    item.schedule_date = value;
    this.props.handleOtherOk(this.state.new_temporary_injection_list, 1);
  }
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
      waring_message:''
    });
  }
  
  render() {
    let {
      // new_limit_injection_list,
      new_temporary_injection_list
    } = this.state;
    var authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    return  (
      <Wrapper>
        <div><p className='border selected text-center' style={{cursor: "pointer",width:"7rem", fontSize: "1rem", lineHeight:"2.37rem"}} onClick={e => this.OpenEditInjectionModal(e,1)}>臨時注射</p></div>
        <Table>
          <div className="w-100 d-flex thead-div">
            <div className="th-div" style={{width:'calc(100% - 30rem)'}}>薬剤名</div>
            <div className="th-div" style={{width: "6rem"}}>数</div>
            <div className="th-div" style={{width: "8rem"}}>区分</div>
            <div className="th-div date-td">施行日</div>
            <div className="th-div" style={{width: "6rem"}}/>
          </div>
          <div className="w-100 tbody-div">
            {new_temporary_injection_list != null && new_temporary_injection_list.length >0 && (
              new_temporary_injection_list.map((pres_item,pres_key)=>{
                if (pres_item != null){
                  return (
                    <>
                      <div className="w-100 d-flex">
                        <div className="td-div clickable" style={{width:'calc(100% - 30rem)', borderRight:"none"}} onClick={e => this.OpenEditInjectionModal(e, 1, pres_item, pres_key)}>
                          {pres_item.data_json!== null && pres_item.data_json.length>0 && (
                            pres_item.data_json.map((medicine)=>{
                              if (medicine.item_name !== undefined && medicine.item_name !== ''){
                                return(
                                  <>
                                    <div style={{borderBottom:'1px solid'}}>{renderHTML(displayInjectionName(medicine.item_code,medicine.item_name))}</div>
                                  </>
                                )
                              }
                            })
                          )}
                        </div>
                        <div className="td-div clickable" style={{width: "6rem", borderRight:"none"}} onClick={e => this.OpenEditInjectionModal(e, 1, pres_item, pres_key)}>
                          {pres_item.data_json!== null && pres_item.data_json.length>0 && (
                            pres_item.data_json.map((medicine)=>{
                              if (medicine.item_name !== undefined && medicine.item_name !== ''){
                                return(
                                  <>
                                    <div style={{borderBottom:'1px solid'}}>{medicine.amount}{this.getInjectionUnit(medicine.item_code)}</div>
                                  </>
                                )
                              }
                            })
                          )}
                        </div>
                        <div className="td-div clickable" style={{width: "8rem", borderRight:"none"}} onClick={e => this.OpenEditInjectionModal(e, 1, pres_item, pres_key)}>{pres_item.injection_category}</div>
                        <div className="td-div date-td" style={{borderRight:"none"}}>
                          <InputWithLabel
                            label=""
                            type="date"
                            getInputText={this.getScheduleDate.bind(this, pres_item)}
                            diseaseEditData={formatDateTimeIE(pres_item.schedule_date)}
                            isDisabled = {!pres_item.is_new}
                          />
                        </div>
                        <div className="td-div" style={{width: "6rem"}}><button onClick={this.delete.bind(this,pres_key,1)}>削除</button></div>
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
        {this.state.isEditInjectionModal && (
          <EditInjectionPatternSpecial
            handleOk={this.handleOk}
            closeModal={this.closeModal}
            modal_type = {this.state.is_temporary}
            is_temporary = {this.state.is_temporary}
            schedule_date = {this.props.schedule_date}
            patientInfo = {this.props.patientInfo}
            system_patient_id = {this.props.patientInfo.system_patient_id}
            modal_data = {this.state.selected_item}
          />
        )}
        {this.state.isDeleteConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.delMedicine.bind(this)}
            confirmTitle= {this.state.confirm_message}
            waring_message = {this.state.waring_message}
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

InputOtherPanel.contextType = Context;

InputOtherPanel.propTypes = {
  karte_data:PropTypes.object,
  schedule_date:PropTypes.string,
  patientInfo:PropTypes.object,
  is_temporary:PropTypes.number,
  handleOtherOk:PropTypes.func,
  from_source:PropTypes.string,
};

export default InputOtherPanel;