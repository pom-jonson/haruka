import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {disable} from "../../../../../_nano/colors";
import {formatDateLine} from "~/helpers/date";
import EditInjectionModal from "../../../Schedule/modals/EditInjectionModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
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
  height: 100%;
  .work-area{
    height: 97%;
    .selected p{
        background-color: rgb(38, 159, 191);
        border-color: rgb(38, 159, 191); 
    }
  }
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

const Table = styled.table`
  font-size: 14px;
  font-family: "Noto Sans JP", sans-serif;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  display: inline-block;

  th{
    position: sticky;
    top: 0px;
    background: lightgray;
  }
  th, td {
    border: 1px solid ${disable};
    padding: 4px;
    button{width: 100%;}
  }
  td {
    .label-title, .label-unit{
        width: 0;
    }
  }
  .med-area {
      cursor:pointer;
    input{
        width: 200px;
    }
  }
  .changed-area{
    background: lightcoral;
  }
  .usage-area {
    input{
        width: 150px;
    }
  }
  
`;
const week_days = ["日", "月", "火", "水", "木", "金", "土"];

class InputInjectionPanel extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
          name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        this.state = {
            isEditInjectionModal: false,
            injection_list: props.injection.prev,            
            schedule_item:{},
            added: props.injection.added,
            is_edit: false,
            isEditInjectionPatternModal:false,
            isDeleteConfirmModal: false,
            isConfirmComplete:false,
            modal_data:null,
            isShowDoctorList: false,
        }
        this.injection_master = sessApi.getObjectValue("dial_common_master","injection_master");
    }


    async componentDidMount () {        
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
        if (this.props.injection.prev !== undefined){
            this.setState({injection_list:this.props.injection.prev})
        }
        if (this.props.injection.after !== undefined){
            this.setState({new_inject_schedule:this.props.injection.after})
        }
        if (this.props.injection.after !== undefined && this.props.injection.after === '' ) {
            let new_inject_schedule = [];
            if (this.props.injection.prev.length > 0) {
                this.props.injection.prev.map((pres_item) => {
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
                    new_inject_schedule.push(row);
                });
            }            
            this.setState({
                new_inject_schedule,
            });
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {        
        if (nextProps.injection.prev === this.state.injection_list) return;        
        this.initailize();
    }
    OpenAddInjectionPatternModal = async () => {
        this.setState({
            isEditInjectionPatternModal:true,
            modal_data:null,
            selected_index:null,
        })
    };

    closeModal = (option= null) => {
        let {new_inject_schedule, injection_list, selected_index} = this.state;        
        if (option == 'cancel_close'){
          if (selected_index != undefined && selected_index != null){
            if(new_inject_schedule[selected_index] != undefined && new_inject_schedule[selected_index] != null 
              && injection_list[selected_index] != undefined && injection_list[selected_index] != null){                
              new_inject_schedule[selected_index].time_limit_from = injection_list[selected_index].time_limit_from;
            }
          } 
          
        }
        this.setState({
            isEditInjectionModal: false,            
            isEditInjectionPatternModal:false,
            new_inject_schedule,
            isShowDoctorList: false,
        });
    };
    handleOk = (injection_pattern) => {
        var new_inject_schedule = this.state.new_inject_schedule;        
        this.closeModal();
        if (this.state.selected_index != null){
            var selected_index = this.state.selected_index;
            new_inject_schedule[selected_index].pattern_number = injection_pattern.number;
            new_inject_schedule[selected_index].is_temporary = injection_pattern.is_temporary;
            new_inject_schedule[selected_index].time_limit_from = injection_pattern.time_limit_from;
            new_inject_schedule[selected_index].time_limit_to = injection_pattern.time_limit_to;
            new_inject_schedule[selected_index].injection_category = injection_pattern.injection_category;
            new_inject_schedule[selected_index].data_json = injection_pattern.data_json;
            new_inject_schedule[selected_index].timing_code = injection_pattern.timing_code;
            new_inject_schedule[selected_index].weekday = injection_pattern.weekday;
            new_inject_schedule[selected_index].week_interval = injection_pattern.week_interval;
            new_inject_schedule[selected_index].monthly_enable_week_number = injection_pattern.monthly_enable_week_number;
            new_inject_schedule[selected_index].instruction_doctor_number = injection_pattern.instruction_doctor_number;
            new_inject_schedule[selected_index].stop_date = injection_pattern.stop_date;
            new_inject_schedule[selected_index].reopening_date = injection_pattern.reopening_date;
        } else {
            new_inject_schedule.push(
                {
                    system_patient_id:this.props.patientInfo.system_patient_id,
                    set_number:injection_pattern.set_number,
                    is_temporary : injection_pattern.is_temporary,
                    time_limit_from : injection_pattern.time_limit_from,
                    time_limit_to : injection_pattern.time_limit_to,
                    final_week_days:injection_pattern.final_week_days,
                    injection_category : injection_pattern.injection_category,
                    data_json : injection_pattern.data_json,
                    timing_code : injection_pattern.timing_code,
                    weekday : injection_pattern.weekday,
                    week_interval : injection_pattern.week_interval,
                    monthly_enable_week_number : injection_pattern.monthly_enable_week_number,
                    instruction_doctor_number : injection_pattern.instruction_doctor_number,
                    stop_date : injection_pattern.stop_date,
                    reopening_date : injection_pattern.reopening_date
                },
            )
        }
        if (this.context.selectedDoctor.code > 0) {
          this.setState({
            instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
            new_inject_schedule,
          });
        } else {
          this.setState({new_inject_schedule});    
        }
        this.props.handleInjectionOk(new_inject_schedule);        
    };

    changeMedicine = (selected_index) => {
        let {new_inject_schedule} = this.state;
        if( new_inject_schedule[selected_index] == null || new_inject_schedule[selected_index].data_json == undefined) return;        
        new_inject_schedule[selected_index].time_limit_from = formatDateLine(this.props.schedule_date);
        this.setState({            
            selected_index,
            modal_data:new_inject_schedule[selected_index],
            isEditInjectionPatternModal:true,
        });        
    };

    getWeekDay = (weekdays) => {
        let final_week_days = '';
        var weekday = parseInt(weekdays);
        for(var i=0; i < 7; i++){
            var pval = Math.pow(2, i);
            if( (weekday & pval) > 0){
                final_week_days += week_days[i] + " ";
            }
        }
        return final_week_days;
    };

    delete = (selected_index) => {
      var waring_message = '';
      var new_inject_schedule = this.state.new_inject_schedule;
      if (new_inject_schedule[selected_index].data_json != null && new_inject_schedule[selected_index].data_json.length > 0){
        new_inject_schedule[selected_index].data_json.map(val => {
          if(val.item_name != '') waring_message += val.item_name + '\n';
        })
      }
      this.setState({
          isDeleteConfirmModal : true,
          confirm_message: "薬剤を削除しますか?",
          selected_index,
          waring_message,
      });
    };

    delMedicine = () => {
        this.confirmCancel();
        let {new_inject_schedule, selected_index} = this.state;
        new_inject_schedule[selected_index] = null;
        this.setState({new_inject_schedule});
        this.props.handleInjectionOk(new_inject_schedule);
        this.forceUpdate();
    };

    confirmCancel() {
        this.setState({
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message: "",
            waring_message: "",
        });
    }

    openConfirmCompleteModal =(message)=>{
        this.setState({
            isConfirmComplete:true,
            complete_message: message,
        });
    };

    isEqualObject(prev, after){        
        if (typeof prev != 'object' || typeof after != 'object') return false;   
        if (Object.keys(prev).length != Object.keys(after).length) return false;
        var result_flag = true;
        Object.keys(prev).map(key => {            
            if (key == 'data_json'){
                prev[key].map((item, index) => {
                    if (!this.isEqualObject(item, after[key][index])) result_flag = false;
                })
            } else {
                if (prev[key] != after[key]) result_flag = false;
            }
        })
        return result_flag;
    }
    
    render() {
        let {injection_list} = this.state;
        let {new_inject_schedule} = this.state;
        var authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
        return  (
            <Wrapper>                
                <div><p className='border selected text-center' style={{cursor: "pointer",width:"7rem", fontSize: "1rem", lineHeight:"2.37rem"}} onClick={this.OpenAddInjectionPatternModal}>定期注射</p></div>
                <div className={`w-100`} style={{display:'flex', maxHeight:'460px'}}>                        
                    <Table>
                        <thead>
                            <tr>
                                <th style={{width: "24%"}}>薬剤名</th>
                                <th style={{width: 70}}>数</th>
                                <th style={{width: 150}}>透析日</th>
                                <th style={{width: 80}}>区分</th>
                                <th style={{width: 60}}/>
                                <th style={{width: "24%"}}>薬剤名</th>
                                <th style={{width: 70}}>数</th>
                                <th style={{width: 150}}>透析日</th>
                                <th style={{width: 80}}>区分</th>
                                <th style={{width: 80}}/>
                            </tr>
                        </thead>    
                        <tbody>
                        {new_inject_schedule != null && new_inject_schedule.length >0 && (
                            new_inject_schedule.map((item, index)=>{                                
                                var pres_item = injection_list[index];
                                if (pres_item != undefined || item != null){
                                  return (
                                    <>
                                    <tr>
                                        <td style={{height:'30px'}}>
                                            {pres_item != undefined && pres_item.data_json!== null && pres_item.data_json.length>0 && (
                                                pres_item.data_json.map((medicine)=>{
                                                    if (medicine.item_name !== undefined && medicine.item_name !== ''){
                                                        return(
                                                            <>
                                                            <div>{renderHTML(displayInjectionName(medicine.item_code,medicine.item_name))}</div>
                                                            </>
                                                        )
                                                    }
                                                })
                                            )}
                                        </td>
                                        <td>
                                            {pres_item != undefined && pres_item.data_json!== null && pres_item.data_json.length>0 && (
                                                pres_item.data_json.map((medicine)=>{
                                                    if (medicine.item_name !== undefined && medicine.item_name !== ''){
                                                        return(
                                                            <>
                                                            <div>
                                                                {medicine.amount}{this.getInjectionUnit(medicine.item_code)}
                                                            </div>
                                                            </>
                                                        )
                                                    }
                                                })
                                            )}
                                        </td>
                                        <td>{pres_item != undefined && this.getWeekDay(pres_item.weekday)}</td>
                                        <td>{pres_item != undefined && pres_item.injection_category}</td>
                                        <td className="text-center">{pres_item != undefined && 'から'}</td>
                                        {item != null ? (
                                        <td className={"after-data med-area " + (pres_item==undefined?'changed-area':'')} onClick={this.changeMedicine.bind(this, index)}>
                                          {item.data_json!== null && item.data_json.length>0 && (
                                              item.data_json.map((medicine, sub_index)=>{
                                                  if (medicine.item_name !== undefined && medicine.item_name !== ''){
                                                      return(
                                                          <>
                                                          <div 
                                                              className={(pres_item!=undefined && pres_item.data_json!=undefined && 
                                                                  pres_item.data_json[sub_index]!=undefined && pres_item.data_json[sub_index]!=null && 
                                                                  medicine.item_name==pres_item.data_json[sub_index].item_name)?'':'changed-area'}>                                                              
                                                              {renderHTML(displayInjectionName(medicine.item_code,medicine.item_name))}
                                                          </div>
                                                          </>
                                                      )
                                                  }
                                              })
                                          )}
                                        </td>
                                        ) : (
                                          <td className='changed-area'></td>
                                        )}
                                        {item != null ? (
                                        <td className={'med-area ' + (pres_item==undefined?'changed-area':'')} onClick={this.changeMedicine.bind(this, index)}>                                        
                                          {item.data_json!== null && item.data_json.length>0 && (
                                                item.data_json.map((medicine, sub_index)=>{
                                                    if (medicine.item_name !== undefined && medicine.item_name !== ''){
                                                        return(
                                                            <>
                                                            <div
                                                            className={(pres_item!=undefined && pres_item.data_json!=undefined && 
                                                                pres_item.data_json[sub_index]!=undefined && pres_item.data_json[sub_index]!=null && 
                                                                medicine.amount==pres_item.data_json[sub_index].amount)?'':'changed-area'}>
                                                                {medicine.amount}{this.getInjectionUnit(medicine.item_code)}
                                                            </div>
                                                            </>
                                                        )
                                                    }
                                                })
                                            )}
                                          </td>
                                        ) : (
                                          <td className='changed-area'></td>
                                        )}
                                        {item != null ? (
                                          <td className={'med-area '  + (pres_item==undefined?'changed-area':'')} onClick={this.changeMedicine.bind(this, index)}>
                                            {/* {this.isEqualObject(pres_item, item) ===false && ( */}
                                                <>
                                                <div className={pres_item!=undefined && pres_item.weekday==item.weekday?'':'changed-area'}>
                                                    {this.getWeekDay(item.weekday)}
                                                </div>
                                                </>
                                            {/* )} */}
                                          </td>
                                          ) : (
                                            <td className='changed-area'></td>
                                        )}
                                        {item != null ? (
                                        <td className={'med-area ' + (pres_item==undefined?'changed-area':'')} onClick={this.changeMedicine.bind(this, index)}>
                                          {/* {this.isEqualObject(pres_item, item) ===false && ( */}
                                              <>
                                              <div className={pres_item!=undefined && pres_item.injection_category==item.injection_category?'':'changed-area'}>
                                              {item.injection_category}
                                              </div>
                                              </>
                                          {/* )} */}
                                            </td>
                                          ) : (
                                            <td className='changed-area'></td>
                                        )}
                                        <td rowSpan="2">
                                            {item != null && (
                                                <button onClick={this.delete.bind(this,index)}>削除</button>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={4}>
                                            {pres_item != undefined && (
                                                <div>
                                                    期限: {pres_item.time_limit_from} ~ {pres_item.time_limit_to != null ? pres_item.time_limit_to : "無期限"}
                                                </div>
                                            )}
                                            </td>
                                        <td className="text-center">{pres_item != undefined && 'から'}</td>
                                        {item != null ? (
                                          <td colSpan={4} className={'med-area ' + (pres_item==undefined?'changed-area':'')} onClick={this.changeMedicine.bind(this, index)}>
                                            {new_inject_schedule != null && new_inject_schedule.length > 0 ? (
                                                <div className={`d-flex`}><div className={`w-25 text-right`}>期限:</div>
                                                <div className={`border ml-1 mr-1 w-75 h-100`}> {item.time_limit_from} ~ {(item.time_limit_to != null && item.time_limit_to !='') ? item.time_limit_to : "無期限"}</div></div>
                                            ): (
                                                <div className={`border ml-1 mr-1 w-100`} style={{height: 30}} />
                                            )}
                                        </td>
                                        ): (
                                          <td colSpan={4} className="changed-area"></td>
                                        )}                                        
                                    </tr>                                    
                                    </>
                                    )
                                }
                              } 
                            )
                          )
                        }  
                        </tbody>
                    </Table>                    
                </div>
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
                {this.state.isEditInjectionPatternModal && (
                    <EditInjectionPatternSpecial
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        system_patient_id = {this.props.patientInfo.system_patient_id}
                        schedule_date = {this.props.schedule_date}
                        is_temporary = {0}
                        modal_type = {0}
                        modal_data = {this.state.modal_data}
                    />
                )}
                {this.state.isEditInjectionModal && (
                    <EditInjectionModal
                        schedule_item = {this.state.schedule_item}
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        is_temporary = {0}
                        schedule_date = {formatDateLine(this.props.schedule_date)}
                        patientInfo = {this.props.patientInfo}
                        is_edit={this.state.is_edit}
                    />
                )}                
                {this.state.isDeleteConfirmModal !== false && (
                    <SystemConfirmJapanModal
                        hideConfirm= {this.confirmCancel.bind(this)}
                        confirmCancel= {this.confirmCancel.bind(this)}
                        confirmOk= {this.delMedicine.bind(this)}
                        confirmTitle= {this.state.confirm_message}
                        waring_message= {this.state.waring_message}
                    />
                )}
                {this.state.isConfirmComplete !== false && (
                    <CompleteStatusModal
                        message = {this.state.complete_message}
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

InputInjectionPanel.contextType = Context;

InputInjectionPanel.propTypes = {
    injection:PropTypes.array,
    schedule_date:PropTypes.string,
    patientInfo:PropTypes.object,
    is_temporary:PropTypes.number,
    handleInjectionOk:PropTypes.func,   
    from_source:PropTypes.string, 
};

export default InputInjectionPanel;