import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {disable} from "../../../../../_nano/colors";
import InputWithLabel from "../../../../../molecules/InputWithLabel";
import PrescriptMedicineSelectModal from "../../../modals/PrescriptMedicineSelectModal";
import SelectUsageModal from "../../../modals/SelectUsageModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import PrescriptionPatternModal from "~/components/templates/Dial/Pattern/PrescriptionPatternModal";
import {formatDateLine} from "../../../../../../helpers/date";
import * as apiClient from "~/api/apiClient";
import EditPrescript from "../EditPrescript";

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
  .disabled-presc{
    cursor: default;
    background: lightgray !important;
    color: #595959;
  }
 .period {
    label {
        width: 0;
    }
    display: flex;
    .pd-15 {
        padding: 15px 0 0 7px;
    }
    .w55 {
        width: 55px;
    }
    .react-datepicker-wrapper {
        // width: 100%;
    }
    .start-date .react-datepicker-wrapper {
        width: calc(100% - 100px);
    }
    .start-date{
        margin-top: -8px;
    }
    .end-date{
        margin-top: -8px;
        
        .label-title {
            width: 0;
        }
    }
  }
.period {
    .label-title {
        width: 100px;
        text-align: right;
        padding-right: 0.5rem;
        margin-right: 0;
        font-size: 1rem;
        margin-top: 0;
        line-height: 2.375rem;
        margin-bottom: 0;
    }
}
.react-datepicker-wrapper {
        width: 100%;
        .react-datepicker__input-container {
            width: 100%;
            input {
                font-size: 1rem;
                width: 100%;
                height: 2.375rem;
                border-radius: 4px;
                border-width: 1px;
                border-style: solid;
                border-color: rgb(206, 212, 218);
                border-image: initial;
                padding: 0px 8px;
            }
        }
    }
.periodic-btn {
    .radio-btn label {
        padding: 0;
        margin: 0;
        margin-right: 5px;
    }
}
  .radio-btn label{
    font-size: 16px;
    width: 75px;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 4px;
    padding: 4px 5px;
    text-align:center;
    margin: 0 5px;
    margin-bottom: 5px;
  }
  .pattern-info{
    span {
        margin-left: 5px;
    }
  }
  .selected-pattern{
    background-color: rgb(105, 200, 225);
  }
`;

const Table = styled.table`
  font-size: 14px;
  font-family: "Noto Sans JP", sans-serif;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  display: inline-block;
  tr{
    height: 36px;
  }
  th{
    position: sticky;
    top: 0px;
  }
  th, td {
    border: 1px solid ${disable};
    padding: 4px;
    button{width: 100%;}
  }
  td {
    .label-title{
        width: 0;
    }
    .label-unit{
        width: auto;
        font-size: 0.9rem;
        margin-left: 4px;
        margin-top: 7px;
    }
    .react-numeric-input input{
        width: 70px !important;
    }
    label{
        margin-right: 4px;
    }
  }
  .med-area {
    input{
        width: 200px;
    }
  }
  .usage-area {
    input{
        width: 150px;
    }
  }
  .changed-area{
    background: lightcoral;
  }
  
`;

class InputRegularPrescriptionPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditPrescriptModal: false,
      isPatternModal: false,
      regular_prescription: props.regular_prescription,
      isOpenMedicineModal: false,
      isDeleteConfirmModal: false,
      isConfirmComplete:false,
      is_edit: false,
      time_limit_from: new Date(this.props.schedule_date),
      regular_prescription_number:0,
      regular_prescription_pattern:this.props.pattern_data,
      isOpenPatternModal: false,
      regular_prescription_schedule:[],
      change_regular_number: false
      // time_limit_to: null,
    };
    this.origin_data= null;
  }
  
  async componentDidMount () {
    this.initialize();
    // this.getPrescriptionInfo();
  }
  
  getPrescriptionInfo = async() => {
    if (this.props.patientInfo == undefined || this.props.patientInfo.system_patient_id == undefined) return;
    let path = "/app/api/v2/dial/schedule/regular_prescription_search";
    let post_data = {
      params:{
        patient_id:this.props.patientInfo.system_patient_id,
        schedule_date: formatDateLine(this.props.schedule_date),
        patten_search: 1
      },
    };
    await apiClient.post(path, post_data)
      .then((res) => {
        let origin_data = this.prescriptionCopy(res)
        this.setState({new_presc_schedule:res, origin_data });
        this.pattern_data = res;
        this.props.handleRegularOk(res, origin_data, null,'no_change');
      });
  };
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.regular_prescription.prev) == JSON.stringify(this.state.regular_prescription_schedule)) return;
    this.initialize();
  }
  
  initialize () {
    if (this.props.regular_prescription.prev !== undefined){
      this.setState({regular_prescription_schedule:this.props.regular_prescription.prev})
    }
    if (this.props.regular_prescription.prev !== undefined && this.props.regular_prescription.prev.length > 0){
      let origin_data = this.prescriptionCopy(this.props.regular_prescription.prev);
      this.setState({new_presc_schedule:this.props.regular_prescription.after,origin_data});
    }
    if (this.props.regular_prescription.after !== undefined && this.props.regular_prescription.after.length === 0 && this.props.regular_prescription.prev.length > 0) {
      let new_presc_schedule = [];
      new_presc_schedule = this.prescriptionCopy(this.props.regular_prescription.prev);
      let origin_data = this.prescriptionCopy(new_presc_schedule);
      this.setState({
        new_presc_schedule,
        origin_data
      });
      this.props.handleRegularOk(new_presc_schedule, origin_data, null,'no_change');
    }
  }
  
  showPrescript = () => {
    this.setState({
      isEditPrescriptModal: true,
      change_regular_number: true,
      edit_item:this.state.new_presc_schedule,
    });
  };
  
  showPatternModal = () => {
    this.setState({
      isOpenPatternModal: false,
      isPatternModal: true,
      edit_item:this.state.new_presc_schedule,
    })
  }
  
  closeModal = () => {
    this.setState({
      isEditPrescriptModal: false,
      isPatternModal: false,
      isOpenMedicineModal: false,
      isOpenUsageModal: false
    });
  };
  
  saveData = async (data) => {
    let {new_presc_schedule} = this.state;
    let deleted = this.props.regular_prescription.deleted;
    if (data.length > 0) {
      data.map(item=>{
        if (item != null) {
          let sch_index = new_presc_schedule.findIndex(x=>x.pattern_number==item.pattern_number);
          if(sch_index > -1) {
            item.data_json.map((rp_item, rp_key)=>{
              if (new_presc_schedule[sch_index].data_json[rp_key] === undefined) {
                new_presc_schedule[sch_index].data_json[rp_key] = rp_item;
              }
              rp_item.medicines.map((medi_item,medi_key)=>{
                medi_item.is_schedule = 1;
                if (medi_item.is_deleted == 1) {
                  deleted.push(medi_item);
                }
                new_presc_schedule[sch_index].data_json[rp_key].medicines[medi_key]={...medi_item};
              });
              
              new_presc_schedule[sch_index].data_json[rp_key].days=rp_item.days;
              new_presc_schedule[sch_index].data_json[rp_key].disable_days_dosing=rp_item.disable_days_dosing;
              new_presc_schedule[sch_index].data_json[rp_key].prescription_category=rp_item.prescription_category;
              new_presc_schedule[sch_index].data_json[rp_key].free_comment=rp_item.free_comment;
              new_presc_schedule[sch_index].data_json[rp_key].rp_number=rp_item.rp_number;
              new_presc_schedule[sch_index].data_json[rp_key].usage_code=rp_item.usage_code;
              new_presc_schedule[sch_index].data_json[rp_key].usage_name=rp_item.usage_name;
              if (rp_item.is_deleted == 1) {
                new_presc_schedule[sch_index].data_json[rp_key].is_deleted=1;
              }
            });
            
            new_presc_schedule[sch_index].schedule_date = this.props.schedule_date instanceof Date ? formatDateLine(this.props.schedule_date) : this.props.schedule_date;
            new_presc_schedule[sch_index].time_limit_from = formatDateLine(this.state.time_limit_from);
            new_presc_schedule[sch_index].time_limit_to = formatDateLine(this.state.time_limit_to);
            new_presc_schedule[sch_index].is_pattern = 1;
            new_presc_schedule[sch_index].comment = item.comment;
          }
        }
      });
    }
    this.props.handleRegularOk( new_presc_schedule,null, deleted);
    this.props.handleRegularOk(new_presc_schedule);
    this.setState({
      new_presc_schedule,
      isEditPrescriptModal: false,
    });
  };
  
  delete = (pres_key,rp_key,medi_key) => {
    let prev = this.state.regular_prescription_schedule;
    let med_name = "";
    if (prev != undefined && prev != null && prev.length > 0 && prev[pres_key] != null && prev[pres_key].data_json != undefined && prev[pres_key].data_json[rp_key] != null) {
      med_name = prev[pres_key].data_json[rp_key].medicines[medi_key].item_name;
    }
    this.setState({
      isDeleteConfirmModal : true,
      confirm_message: "薬剤を削除しますか?",
      waring_message: med_name,
      pres_key,rp_key,medi_key
    });
  };
  
  delMedicine = async() => {
    this.setState({isDeleteConfirmModal:false, waring_message:"", confirm_message: ""});
    let prev = this.state.regular_prescription_schedule;
    let {pres_key,rp_key,medi_key} = this.state;
    let deleted = this.props.regular_prescription.deleted;
    if (prev != undefined && prev != null && prev.length > 0 && prev[pres_key] != null && prev[pres_key].data_json != undefined && prev[pres_key].data_json[rp_key] != null)
      deleted.push(prev[pres_key].data_json[rp_key].medicines[medi_key]);
    let after = this.state.new_presc_schedule;
    if (after != undefined && after != null && after.length > 0) {
      if (after[pres_key].data_json[rp_key].medicines[medi_key].is_original == 1) {
        after[pres_key].data_json[rp_key].medicines[medi_key]['is_deleted']=1;
        after[pres_key].data_json[rp_key].medicines[medi_key]['is_schedule']=1;
      } else {
        after[pres_key].data_json[rp_key].medicines.splice(medi_key, 1);
      }
      
      if (after[pres_key].data_json[rp_key].medicines.findIndex(x=>x.is_deleted!=1) == -1) {
        if (after[pres_key].data_json[rp_key].is_original == 1) after[pres_key].data_json[rp_key].is_deleted = 1;
        else after[pres_key].data_json.splice(rp_key, 1);
      }
      if (after[pres_key].data_json.findIndex(x=>x.is_deleted == undefined ) == -1) {
        after[pres_key].is_deleted = 1;
      }
      after[pres_key].time_limit_to = formatDateLine(this.state.time_limit_to);
      after[pres_key].time_limit_from = formatDateLine(this.state.time_limit_from);
    }
    this.props.handleRegularOk( after,null, deleted);
    this.setState({
      regular_prescription_schedule:prev,
      new_presc_schedule: after,
      isConfirmComplete:false
    });
  };
  
  confirmCancel() {
    this.setState({
      isDeleteConfirmModal: false,
      isOpenPatternModal: false,
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
  
  gettime_limit_to = value => {
    this.setState({time_limit_to: value});
    let {new_presc_schedule} = this.state;
    if (new_presc_schedule != undefined && new_presc_schedule != null && new_presc_schedule.length > 0) {
      new_presc_schedule.map((item)=>{
        item['time_limit_from'] = formatDateLine(this.state.time_limit_from);
        item['time_limit_to'] = formatDateLine(value);
      })
      this.props.handleRegularOk(new_presc_schedule, null, null, "no_change");
    }
  };
  
  gettime_limit_from = value => {
    this.setState({time_limit_from: value});
    let {new_presc_schedule} = this.state;
    if (new_presc_schedule != undefined && new_presc_schedule != null && new_presc_schedule.length > 0) {
      new_presc_schedule.map(item=>{
        item['time_limit_from'] = formatDateLine(value);
      });
      this.props.handleRegularOk(new_presc_schedule, null, null, "no_change");
    }
  };
  
  closePatternModal = () => {
    this.getPrescriptionInfo();
    this.setState({isPatternModal: false});
  };
  
  openEditPrescript = (pres_key) => {
    this.setState({
      isEditPrescriptModal: true,
      edit_item:this.state.new_presc_schedule[pres_key],
      is_edit: true,
      change_regular_number: false
    });
  };
  
  prescriptionCopy(prescription) {
    let new_presc_schedule = [];
    if (prescription != null && prescription.length > 0) {
      prescription.map((pres_item) => {
        let row = {};
        Object.keys(pres_item).map(idx => {
          if (idx !== "data_json") {
            row[idx] = pres_item[idx];
          } else {
            let row_json = [];
            pres_item.data_json.map(rp_item => {
              let rp_row = {};
              Object.keys(rp_item).map(rp_idx => {
                rp_row[rp_idx] = rp_item[rp_idx];
                let medicines = [];
                if (rp_idx === "medicines") {
                  rp_item.medicines.map(medi_item => {
                    let medi_row = {};
                    Object.keys(medi_item).map(medi_idx => {
                      medi_row[medi_idx] = medi_item[medi_idx];
                      medi_row.is_original = 1;
                    });
                    medicines.push(medi_row);
                  });
                  rp_row['medicines'] = medicines;
                  rp_row.is_original = 1;
                }
              });
              row_json.push(rp_row);
              row['data_json'] = row_json;
            })
          }
          
        });
        new_presc_schedule.push(row);
      });
    }
    return new_presc_schedule;
  }
  
  medicine_validate(origin_data,pres_key,rp_key,medi_key){
    return origin_data !== undefined && origin_data != null && origin_data[pres_key]!= null && origin_data[pres_key].data_json!== undefined &&
      origin_data[pres_key].data_json[rp_key] != null && origin_data[pres_key].data_json[rp_key].medicines != undefined &&
      origin_data[pres_key].data_json[rp_key].medicines[medi_key] != null;
  }
  rp_validate(origin_data,pres_key,rp_key){
    return origin_data !== undefined && origin_data != null && origin_data[pres_key]!= null && origin_data[pres_key].data_json!== undefined &&
      origin_data[pres_key].data_json[rp_key] != null;
  }
  
  render() {
    let {new_presc_schedule,origin_data} = this.state;
    return  (
      <Wrapper>
        <div className="">
          <div className={`d-flex`}>
            {new_presc_schedule !== undefined && new_presc_schedule != null && new_presc_schedule.length > 0 ? (
              <div><p className='border selected text-center' style={{cursor: "pointer",width:"7rem", fontSize: "1rem", lineHeight:"2.37rem"}} onClick={this.showPrescript}>定期薬</p></div>
            ):(
              <div><p className='border disabled-presc text-center' style={{cursor: "default",width:"7rem", fontSize: "1rem", lineHeight:"2.37rem"}}>定期薬</p></div>
            )}
            <div className="period remove-x-input">
              <div className="start-date ">
                <InputWithLabel
                  label="期限"
                  type="date"
                  getInputText={this.gettime_limit_from}
                  diseaseEditData={this.state.time_limit_from}
                /></div>
              <div style={{paddingLeft:"0.5rem", lineHeight:"2.375rem"}}>～</div>
              <div className="end-date">
                <InputWithLabel
                  label=""
                  type="date"
                  getInputText={this.gettime_limit_to}
                  diseaseEditData={this.state.time_limit_to}
                />
              </div>
            </div>
          </div>
          <div className={`w-100 d-flex`}>
            {/*{this.props.is_loaded}*/}
            <Table>
              <tr>
                <th style={{width: 60}}/>
                <th style={{width: "20%"}}>薬剤名</th>
                <th style={{width: "5%"}}>一日量</th>
                <th style={{width: "15%"}}>服用時点</th>
                <th style={{width: 80}}/>
                <th style={{width: 60}}/>
                <th style={{width: "20%"}}>薬剤名</th>
                <th style={{width: "5%"}}>一日量</th>
                <th style={{width: "15%"}}>服用時点</th>
                <th style={{width: 80}}/>
              </tr>
              {new_presc_schedule !== undefined && new_presc_schedule != null && new_presc_schedule.length > 0 && new_presc_schedule.map((pres_item,pres_key)=>{
                let regular_title = "";
                if (pres_item.regular_prescription_number === 1) regular_title = "定１";
                else if (pres_item.regular_prescription_number === 2) regular_title = "定2";
                else if (pres_item.regular_prescription_number === 3) regular_title = "定3";
                return (
                  <>
                    {pres_item.data_json !== undefined && pres_item.data_json != null && pres_item.data_json.length > 0 && pres_item.data_json.map((rp_item,rp_key)=>{
                      return (
                        <>
                          {rp_item.medicines.length > 0 && rp_item.medicines.map((medi_item, medi_key)=>{
                            return (
                              <>
                                <tr>
                                  <td className={`text-center`}>{medi_key === 0 && rp_key === 0 ? regular_title : ""}</td>
                                  <td>{this.medicine_validate(origin_data,pres_key,rp_key,medi_key) ? origin_data[pres_key].data_json[rp_key].medicines[medi_key].item_name + (origin_data[pres_key].data_json[rp_key].medicines[medi_key].is_not_generic == 1 ? "【後発変更不可】": "" ) : ""}</td>
                                  <td>{this.medicine_validate(origin_data,pres_key,rp_key,medi_key) ? origin_data[pres_key].data_json[rp_key].medicines[medi_key].amount + (origin_data[pres_key].data_json[rp_key].medicines[medi_key].unit != undefined ? origin_data[pres_key].data_json[rp_key].medicines[medi_key].unit :  "" ) : ""}</td>
                                  <td>
                                    {this.rp_validate(origin_data,pres_key,rp_key) ? origin_data[pres_key].data_json[rp_key].usage_name: ""}
                                    {this.rp_validate(origin_data,pres_key,rp_key) ? (origin_data[pres_key].data_json[rp_key].disable_days_dosing == 0? "("+origin_data[pres_key].data_json[rp_key].days+(origin_data[pres_key].data_json[rp_key].prescription_category == "頓服"? "回分)" : "日分)") : ""):""}
                                  </td>
                                  <td className="text-center">から</td>
                                  <td onClick={this.openEditPrescript.bind(this,pres_key,medi_item.is_schedule)}>{medi_key === 0 && rp_key === 0 ? regular_title : ""}</td>
                                  <td onClick={this.openEditPrescript.bind(this,pres_key,medi_item.is_schedule)}
                                      className={medi_item.is_deleted==1  || !this.medicine_validate(origin_data,pres_key,rp_key,medi_key) ||
                                      (this.medicine_validate(origin_data,pres_key,rp_key,medi_key) && origin_data[pres_key].data_json[rp_key].medicines[medi_key].item_name != medi_item.item_name)?"changed-area": ""}>
                                    {medi_item.is_deleted!=1 && medi_item.is_schedule ? medi_item.item_name  + (medi_item.is_not_generic == 1 ? "【後発変更不可】": "" ) :""}
                                  </td>
                                  <td onClick={this.openEditPrescript.bind(this,pres_key,medi_item.is_schedule)}
                                      className={medi_item.is_deleted==1  || !this.medicine_validate(origin_data,pres_key,rp_key,medi_key) ||
                                      (this.medicine_validate(origin_data,pres_key,rp_key,medi_key) && origin_data[pres_key].data_json[rp_key].medicines[medi_key].amount != medi_item.amount)?"changed-area": ""}>
                                    {medi_item.is_deleted!=1 && medi_item.is_schedule ? medi_item.amount + (medi_item.unit != undefined ? medi_item.unit: "") : ""}</td>
                                  <td onClick={this.openEditPrescript.bind(this,pres_key,medi_item.is_schedule)}
                                      className={medi_item.is_deleted==1 || !this.medicine_validate(origin_data,pres_key,rp_key,medi_key) ||
                                      (this.rp_validate(origin_data,pres_key,rp_key) && origin_data[pres_key].data_json[rp_key].usage_name != rp_item.usage_name) ||
                                      (this.rp_validate(origin_data,pres_key,rp_key) && origin_data[pres_key].data_json[rp_key].days != rp_item.days)
                                        ?"changed-area": ""}>
                                    {medi_item.is_deleted!=1 && medi_item.is_schedule ? rp_item.usage_name +
                                      (rp_item.days !== undefined && rp_item.days !== null && rp_item.disable_days_dosing == 0? "("+rp_item.days+(rp_item.prescription_category == "頓服"? "回分)" : "日分)") : "") : ""}
                                  
                                  </td>
                                  <td style={{width:80}}>
                                    {/*{medi_item.is_deleted!=1 && (*/}
                                    <button onClick={this.delete.bind(this,pres_key,rp_key,medi_key)}>削除</button>
                                    {/*)}*/}
                                  </td>
                                </tr>
                              </>
                            )
                          })}
                        </>
                      )
                    })}
                  </>
                )
              })}
            </Table>
          </div>
        </div>
        {this.state.isPatternModal && (
          <PrescriptionPatternModal
            closeModal={this.closePatternModal}
            schedule_date={this.props.schedule_date}
            patientInfo={this.props.patientInfo}
          />
        )}
        {this.state.isEditPrescriptModal && (
          <EditPrescript
            handleOk={this.saveData.bind(this)}
            closeModal={this.closeModal}
            schedule_date={this.props.schedule_date}
            time_limit_to={this.state.time_limit_to}
            patientInfo={this.props.patientInfo}
            editPrescriptType={0}
            only_pattern={0}
            from_karte={1}
            schedule_item={this.state.change_regular_number ? JSON.parse(JSON.stringify(this.state.new_presc_schedule)) : [JSON.parse(JSON.stringify(this.state.edit_item))]}
            change_regular_number={this.state.change_regular_number}
          />
        )}
        {this.state.isOpenMedicineModal && (
          <PrescriptMedicineSelectModal
            handleOk={this.handleMedicineOk}
            closeModal={this.closeModal}
            medicine_type_name={''}
            modal_data={[]}
            rp_number={this.state.rp_number}
            is_open_usage={0}
            medicine_kind={this.state.prescription_category}
          />
        )}
        {this.state.isOpenUsageModal && (
          <SelectUsageModal
            handleOk={this.handleUsageOk}
            closeModal={this.closeModal}
            medicine_kind={this.state.medicine_kind}
            modal_data={this.state.modal_data}
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
        {this.state.isOpenPatternModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.showPatternModal.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isConfirmComplete !== false && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
      </Wrapper>
    )}
}

InputRegularPrescriptionPanel.contextType = Context;

InputRegularPrescriptionPanel.propTypes = {
  regular_prescription:PropTypes.array,
  schedule_date:PropTypes.string,
  patientInfo:PropTypes.object,
  is_temporary:PropTypes.number,
  handleRegularOk:PropTypes.func,
  pattern_data: PropTypes.array,
  is_loaded:PropTypes.boolean
};

export default InputRegularPrescriptionPanel;