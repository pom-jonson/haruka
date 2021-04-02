import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import Checkbox from "../molecules/Checkbox";
import Radiobox from "~/components/molecules/Radiobox";
import InputWithLabel from "../molecules/InputWithLabel";
import SelectorWithLabel from "../molecules/SelectorWithLabel";
import Context from "~/helpers/configureStore";
import {CACHE_LOCALNAMES, KARTEMODE} from "~/helpers/constants"
import * as karteApi from "~/helpers/cacheKarte-utils";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import $ from "jquery";

const RemarksWrapper = styled.div`
  background-color: #ffffff;
  border: 1px solid ${colors.disable};
  border-radius: 4px;
  padding: 8px 8px 8px 0;

  .row {
    margin: 0 0 0 0px;
  }

  .padding-15{
    padding-left: 15px;
  }

  .label-title {
    width: 200px;
    margin: 8px 0 0 8px;
    font-size:0.9rem;
  }

  .label-title + label {
    width: 100%;
    margin-top: 8px;
  }

  select {
    width: 100%;
  }
  .field-1{    
    .div-textarea{
      margin-left: 10px;
      margin-top: 0.4rem;
      margin-bottom: 0.4rem;
      overflow: hidden;
      .txt-area-1{
        margin:0;
        float: left;
        width: calc(100% - 50px);      
        height: 3rem;
      }
    }
  .field-1{
    border: 1px solid #aaa;
    padding: 5px;
  }
`;

const options = [
  {
    id: 1,
    value: ""
  },
  {
    id: 2,
    value: "逓減除外（イ）他医療機関多剤投与"
  },
  {
    id: 3,
    value: "逓減除外（ロ）向精神薬一時投与"
  },
  {
    id: 4,
    value: "逓減除外（ハ）向精神薬臨時投与"
  },
  {
    id: 5,
    value: "逓減除外（ニ）精神科経験医師"
  }
];

class Remarks extends Component {
  constructor(props) {
    super(props);
    let prescription_data = karteApi.getSubVal(parseInt(props.patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.props.cacheSerialNumber);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let additions = props.additions;
    let additions_check = {};
    let additions_send_flag_check = {};
    if(additions !== undefined && additions != null && additions.length > 0){
        additions.map(addition=> {
            if(prescription_data !== undefined && prescription_data != null && prescription_data[0].additions !== undefined && prescription_data[0].additions[addition.addition_id] !== undefined){
                additions_check[addition.addition_id] = true;
                let sending_flag = prescription_data[0].additions[addition.addition_id]['sending_flag'];
                if(sending_flag !== undefined && sending_flag !== null && sending_flag === 1){
                    additions_send_flag_check[addition.addition_id] = true;
                } else {
                    additions_send_flag_check[addition.addition_id] = false;
                }
            } else {
                additions_check[addition.addition_id] = false;
                additions_send_flag_check[addition.addition_id] = false;
            }
        })
    }

    this.state = {
      inOut: this.props.inOut ? this.props.inOut : "0",
      department:
        props.department ||
        (departmentOptions.find(option => option.id == props.departmentId) !==
        undefined
          ? departmentOptions.find(option => option.id == props.departmentId)
              .value
          : ""),
      free_comment: props.free_comment,
      poultice_many_reason: props.poultice_many_reason,
      psychotropic_drugs_much_reason: props.psychotropic_drugs_much_reason,
      additions_check:additions_check,
      additions_send_flag_check:additions_send_flag_check,
      additions,
      potion: props.potion != undefined && props.potion != "" ? props.potion : this.props.inOut == 5 ? 0 : 2, // default: 通常の処方
      hospital_opportunity_disease: props.hospital_opportunity_disease != undefined ? props.hospital_opportunity_disease : 0,
      bulk: this.props.bulk,
      presData: this.props.presData,
      alert_messages: "",
      confirm_alert_title: "",
      confirm_message: "",
      // 1009-2 処方や中央・右カラムの表示抜け・表示個所の修正
      med_consult: this.props.med_consult ? this.props.med_consult : 0, // お薬相談希望あり
      supply_med_info: this.props.supply_med_info ? this.props.supply_med_info : 0, // 薬剤情報提供あり
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ 
      additions: nextProps.additions,
    });
  }  

  componentDidMount () {        
    // YJ601 薬剤検索欄などに残す必要が無い時にデータが残る不具合
    $('.input-area input').on('drop', function(event){
      event.preventDefault();
      return true;
    });        
  }

  getRadio(name, value, type) {
    /*============ 1189-23  2020-08-28
     後発不可オンの薬剤がある状態で「全て一般名処方」をオンに変えようとした場合は、ダイアログを出して、OKなら後発不可をオフにして一般名処方をオンにする。
     一般名処方オンの薬剤がある状態で「全て後発不可」チェックボックスをオンにようとした場合は、ダイアログを出して、OKなら一般名処方をオフにして後発不可をオンにする。
    ==============*/
    if ((name == "can_generic_name" || name == "is_not_generic") && value == 1) {
      this.checkRadioStatus(name, value, type);
    } else
    this.props.getRadio(name, value, type);
  }
  checkRadioStatus = (name, value, type) => {
    const {presData} = this.state;
    var can_generic_name = 0;
    var is_not_generic = 0;
    if (presData != undefined && presData[0] != undefined) {
      presData.map(rp_item=>{
        if (rp_item.medicines != undefined && rp_item.medicines != null && rp_item.medicines.length > 0) {
          rp_item.medicines.map(med_item=>{
            if (med_item.is_not_generic == 1) is_not_generic = 1;
            if (med_item.can_generic_name == 1) can_generic_name = 1;
          })
        }
      })
    }
    if (name == "can_generic_name") {
      if (is_not_generic == 1) {
        this.setState({
          confirm_message: "後発不可の薬剤があります。" + "\n" + "後発不可を解除して一般名処方にしますか？",
          confirm_alert_title: "確認",
          radio_name: name,
          radio_value: value,
          radio_type: type,
        });
      } else {
        this.props.getRadio(name, value, type);
      }
    }
    if (name == "is_not_generic") {
      if (can_generic_name == 1) {
        this.setState({
          confirm_message: "一般名処方の薬剤があります。" + "\n" + "一般名処方を解除して後発不可にしますか？",
          confirm_alert_title: "確認",
          radio_name: name,
          radio_value: value,
          radio_type: type,
        });
      } else {
        this.props.getRadio(name, value, type);
      }
    }
  }
  confirmCancel() {
    this.setState({
      confirm_message: "",
      confirm_alert_title:'',
    });
  }
  confirmOk () {
    this.confirmCancel();
    this.props.getRadio(this.state.radio_name, this.state.radio_value, this.state.radio_type)
  }

  getCheckBox = () => {
    let hospital_opportunity_disease = !this.state.hospital_opportunity_disease;    
    this.props.setRemarkState("hospital_opportunity_disease", hospital_opportunity_disease ? 1 : 0);
  }

  getFreeComment = e => {
    this.setState({ free_comment: e.target.value });
  };
  getPoulticeReason = e => {
    this.setState({ poultice_many_reason: e.target.value });
  };
  updateFreeComment = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.getFreeComment(e);
  };
  updatePoulticeReason = e => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.value.length > 20) {
      // window.sessionStorage.setItem("alert_messages", "湿布薬超過投与理由は、全角20文字以内で入力してください");
      this.setState({
        alert_messages: "湿布薬超過投与理由は、全角20文字以内で入力してください。"
      });
      e.target.focus();
    } else {
      this.props.getPoulticeReason(e);
    }
  };
  getAdditions = (name, number) => {
    let check_status = {};
    if (name == 'additions') {
      check_status = this.state.additions_check;
      check_status[number] = !check_status[number];
      this.setState({additions_check:check_status});
      this.props.getAdditionsCheck(check_status, this.state.additions_send_flag_check);
    }
  };

  getAdditionsSendFlag = (name, number) => {
      let check_status = {};
      if (name == 'additions_sending_flag') {
          check_status = this.state.additions_send_flag_check;
          check_status[number] = !check_status[number];
          this.setState({additions_send_flag_check:check_status});
          this.props.getAdditionsCheck(this.state.additions_check, check_status);
      }
  }

  testRemarkRender = (remark_status) => {
    this.setState(remark_status);
  }

  setPotion = (e) => {            
    this.props.setRemarkState("potion", parseInt(e.target.value));      
  }

  handleAlertOk = () => {
    this.setState({
      alert_messages: ""
    });
  }  

  render() {
    const { additions } = this.props;
    const {presData, additions_check} = this.state;
    let {addition_condition} = this.props;
    if(this.context.addition_condition !== undefined){
      addition_condition = this.context.addition_condition;
    }
    let bulk = [];
    var med_consult = this.state.bulk.med_consult == 1 || this.state.bulk.med_consult == 0 ? this.state.bulk.med_consult : 0;
    var supply_med_info = this.state.bulk.supply_med_info == 1 || this.state.bulk.supply_med_info == 0 ? this.state.bulk.supply_med_info : 0;
    var generic_name = 1;
    var not_generic = 1;
    var mill = 1;
    var dose_package = 1;
    var temporaryMedication = 1;
    
    if(presData != undefined){
      if(presData.length > 1){

        let package_val = 1;
        let package_count = 0; // 内服薬用の用法のRP'number
        presData.map(medicines_data => {
          // 「全て一包化」ON : 「一包化」「粉砕」は内服薬用の用法のRPだけ設定できるように
          if (medicines_data.allowed_diagnosis_division != undefined && medicines_data.allowed_diagnosis_division.includes("21")) {
            package_count ++;
            package_val = package_val * medicines_data.one_dose_package;
          }

          if(medicines_data.usageName != '') {
            medicines_data.medicines.map(medicine_data => {
              if(medicine_data.medicineId != ''){
                generic_name = generic_name * medicine_data.can_generic_name;
                not_generic = not_generic * medicine_data.is_not_generic;
                // 「全て粉砕」ON : 「一包化」「粉砕」は内服薬用の用法のRPだけ設定できるように                
                if (medicines_data.allowed_diagnosis_division != undefined && medicines_data.allowed_diagnosis_division.includes("21")) {                  
                  mill = mill * medicine_data.milling;
                }
                dose_package = dose_package * medicines_data.one_dose_package;
                temporaryMedication = temporaryMedication * medicines_data.temporary_medication;
              }
            });            
            // med_consult = med_consult * (medicines_data.med_consult != undefined ? medicines_data.med_consult : 0) ;
            // supply_med_info = supply_med_info * (medicines_data.supply_med_info != undefined ? medicines_data.supply_med_info : 0);
          }
        });

        bulk.med_consult = med_consult
        bulk.supply_med_info = supply_med_info
        bulk.can_generic_name = generic_name
        bulk.is_not_generic = not_generic
        bulk.milling = mill
        // bulk.one_dose_package = dose_package        
        bulk.one_dose_package = package_val;    
        if (package_count == 0) {
          bulk.one_dose_package = 0;
          bulk.milling = 0;
        }    
        bulk.temporary_medication = temporaryMedication
      }
      else {
        if (presData != undefined && presData != null && presData.length > 0 && presData[0].medicines != undefined && presData[0].medicines != null && presData[0].medicines[0].medicineName != "") {
          // if there is medicine name without usage
          bulk.can_generic_name = this.state.bulk.can_generic_name;
          bulk.med_consult = med_consult;
          bulk.supply_med_info = supply_med_info;
          bulk.is_not_generic = this.state.bulk.is_not_generic;
          bulk.milling = this.state.bulk.milling;
          bulk.one_dose_package = this.state.bulk.one_dose_package;
          bulk.temporary_medication = this.state.bulk.temporary_medication;
        } else {          
          // no medicine name and usage
          bulk.can_generic_name = 1;
          bulk.med_consult = med_consult;
          bulk.supply_med_info = supply_med_info;
          bulk.is_not_generic = 0;
          bulk.milling = 0;
          bulk.one_dose_package = 0;
          bulk.temporary_medication = 0;
        }
      }
    }

    var path = window.location.href.split("/");
    var presetPath = path[path.length-2] + "/" + path[path.length-1];
    var is_patient = presetPath != "preset/prescription";

    let addition_count = 0;
    if (additions != undefined && additions != null && additions.length > 0) {
      additions.map(addition => {
        if(addition_condition === undefined || addition_condition[addition.addition_id] === undefined || (addition_condition !== undefined && addition_condition[addition.addition_id] !== undefined && addition_condition[addition.addition_id] === 1)){
          addition_count ++;
        }
      });
    }
    let karte_mode = this.context.$getKarteMode(this.props.patientId);
    
    return (
      <RemarksWrapper>
      {is_patient && (
        <div className="row">                
          <div className="col-md-6">
            <Checkbox
              label="お薬相談希望あり"
              getRadio={this.getRadio.bind(this)}
              value={this.state.med_consult == 1 ? 1 : 0}
              name="med_consult"
              isGroup={true}
              isDisabled={karte_mode == KARTEMODE.READ}
            />
          </div>
          <div className="col-md-6">
            <Checkbox
              label="薬剤情報提供あり"
              getRadio={this.getRadio.bind(this)}
              // value={bulk.supply_med_info?bulk.supply_med_info:0}
              // name="supply_med_info"
              value={this.state.supply_med_info == 1 ? 1 : 0}
              name="supply_med_info"
              isGroup={true}
              isDisabled={karte_mode == KARTEMODE.READ}
            />
          </div>
        </div>
      )}
        <div className="row">
          <div className="col-md-6">
            <Checkbox
              label="全て一般名処方"
              getRadio={this.getRadio.bind(this)}
              value={bulk.can_generic_name}
              name="can_generic_name"
              isDisabled={karte_mode == KARTEMODE.READ && is_patient}
            />
          </div>
          <div className="col-md-6">
            <Checkbox
              label="全て後発不可"
              getRadio={this.getRadio.bind(this)}
              value={bulk.is_not_generic}
              name="is_not_generic"
              isDisabled={karte_mode == KARTEMODE.READ && is_patient}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <Checkbox
              label="全て一包化"
              getRadio={this.getRadio.bind(this)}
              value={bulk.one_dose_package}
              name="one_dose_package"
              isGroup={true}
              isDisabled={karte_mode == KARTEMODE.READ && is_patient}
            />
          </div>
          <div className="col-md-6">
            <Checkbox
              label="全て臨時処方"
              getRadio={this.getRadio.bind(this)}
              value={bulk.temporary_medication}
              name="temporary_medication"
              isGroup={true}
              isDisabled={karte_mode == KARTEMODE.READ && is_patient}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <Checkbox
              label="全て粉砕"
              getRadio={this.getRadio.bind(this)}
              value={bulk.milling}
              name="milling"
              isDisabled={karte_mode == KARTEMODE.READ && is_patient}
            />
          </div>
        </div>        

        {/*---------------入院処方 => 持参薬 start ---------------- isDisabled: true(no 持参薬tab)*/} 
        <div className="row padding-15">    
          <fieldset className="field-1" style={{border:"1px solid #aaa",padding:"5px"}}>          
            <Radiobox
              label={'通常の処方'}
              value={2}
              getUsage={this.setPotion.bind(this)}
              checked={this.state.potion == 2 ? true : false}
              name={`potion_home`}
              isDisabled={karte_mode == KARTEMODE.READ && is_patient || this.state.inOut == 5}
            />
            <Radiobox
              label={'持参薬（自院）'}
              value={0}
              getUsage={this.setPotion.bind(this)}
              checked={this.state.potion == 0 ? true : false}
              name={`potion_home`}
              isDisabled={karte_mode == KARTEMODE.READ && is_patient || this.props.karteStatus != 1 || this.state.inOut != 5}
            />
            <Radiobox
              label={'持参薬（他院）'}
              value={1}
              getUsage={this.setPotion.bind(this)}
              checked={this.state.potion == 1 ? true : false}
              name={`potion_out`}
              isDisabled={karte_mode == KARTEMODE.READ && is_patient || this.props.karteStatus != 1 || this.state.inOut != 5}
            />
          </fieldset>      
        </div>

        <div className="row">
          <div className="padding-15">
            <Checkbox
              label="入院契機傷病の治療に係るもの"
              getRadio={this.getCheckBox.bind(this)}
              value={this.state.hospital_opportunity_disease}
              name="hospital_opportunity_disease"
              isDisabled={karte_mode == KARTEMODE.READ && is_patient || this.props.karteStatus != 1 || this.state.inOut != 5}
            />
          </div>
        </div>
      {/*---------------入院処方 => 持参薬 end---------------- */} 
        <SelectorWithLabel
          title="向精神薬多剤投与理由"
          options={options}
          getSelect={this.props.getPsychoReason}
          value={this.state.psychotropic_drugs_much_reason}
          isDisabled={karte_mode == KARTEMODE.READ && is_patient}
        />
        <div className="input-area">
          <InputWithLabel
            label="湿布薬超過投与理由"
            type="text"
            placeholder="全角20字まで"
            getInputText={this.getPoulticeReason.bind(this)}
            onBlur={this.updatePoulticeReason}
            diseaseEditData={this.state.poultice_many_reason}
            isDisabled={karte_mode == KARTEMODE.READ && is_patient}
          />        
          <InputWithLabel
            label="備考"
            type="text"
            placeholder="全角20字まで"
            getInputText={this.getFreeComment.bind(this)}
            onBlur={this.updateFreeComment}
            diseaseEditData={this.state.free_comment}
            isDisabled={karte_mode == KARTEMODE.READ && is_patient}
          />
        </div>
        {additions != undefined && additions != null && additions.length > 0 && addition_count > 0 && (
            <>
              <div className={'d-block ml-2'}>
                <div className={'block-title'}>追加指示・指導・処置等選択</div>
                {additions.map(addition => {
                  if(addition_condition === undefined || addition_condition[addition.addition_id] === undefined || (addition_condition !== undefined && addition_condition[addition.addition_id] !== undefined && addition_condition[addition.addition_id] === 1)){
                      return (
                          <>
                              <div>
                                  <Checkbox
                                      label={addition.name}
                                      getRadio={this.getAdditions.bind(this)}
                                      number={addition.addition_id}
                                      value={additions_check[addition.addition_id]}
                                      name={`additions`}
                                      isDisabled={karte_mode == KARTEMODE.READ && is_patient}
                                  />
                                  {addition.sending_category === 3 && (
                                      <>
                                          <Checkbox
                                              label={'送信する'}
                                              getRadio={this.getAdditionsSendFlag.bind(this)}
                                              number={addition.addition_id}
                                              value={this.state.additions_send_flag_check[addition.addition_id]}
                                              name={`additions_sending_flag`}
                                              isDisabled={karte_mode == KARTEMODE.READ && is_patient}
                                          />
                                          <div style={{fontSize:"14px", textAlign:"right"}}>※送信するチェックボックスにチェックすると医事に送信されます。</div>
                                      </>
                                  )}
                              </div>
                          </>
                      )
                  }
                })}
              </div>
            </>
        )}
        {this.state.alert_messages != "" && (
          <SystemAlertModal
            hideModal= {this.handleAlertOk.bind(this)}
            handleOk= {this.handleAlertOk.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmOk.bind(this)}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}            
          />
        )}
      </RemarksWrapper>
    );
  }
}
Remarks.contextType = Context;
Remarks.propTypes = {
  getDepartment: PropTypes.func,
  getPsychoReason: PropTypes.func,
  getPoulticeReason: PropTypes.func,
  getFreeComment: PropTypes.func,
  getRadio: PropTypes.func,
  getAdditionsCheck: PropTypes.func,
  inOut: PropTypes.number,
  departmentId: PropTypes.number, // 選択済診療科
  department: PropTypes.string, // 選択済診療科
  psychotropic_drugs_much_reason: PropTypes.string,
  poultice_many_reason: PropTypes.string,
  med_consult: PropTypes.number,
  supply_med_info: PropTypes.number,
  free_comment: PropTypes.string,
  bulk: PropTypes.object,
  presData: PropTypes.array,
  additions: PropTypes.array,
  addition_condition: PropTypes.array,
  patientId: PropTypes.number,
  karteStatus: PropTypes.number,
  updateStoreCacheNoRefresh: PropTypes.func,
  setRemarkState: PropTypes.func,
  potion: PropTypes.number,
  hospital_opportunity_disease: PropTypes.number,
  cacheSerialNumber: PropTypes.number,
};

export default Remarks;
