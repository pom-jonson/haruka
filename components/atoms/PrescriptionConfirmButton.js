import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "~/components/atoms/Button";
import * as karteApi from "~/helpers/cacheKarte-utils";
import { CACHE_LOCALNAMES, CACHE_SESSIONNAMES, checkSMPByUnicode } from "~/helpers/constants";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import * as sessApi from "~/helpers/cacheSession-utils";

const propTypes = {  
  confirmPrescription: PropTypes.func,
  deletePrescriptionFun: PropTypes.func,
  canConfirm: PropTypes.number,
  patientId: PropTypes.number,
  cacheSerialNumber: PropTypes.number,
  presData:PropTypes.array,
  is_injection:PropTypes.number,
};

const defaultProps = {  
};

class PrescriptionConfirmButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canConfirm: this.props.canConfirm,
      cur_timestamp: new Date().getTime(),
      origin_data: null,
      alert_messages: '',
      is_changed: false,
    }
    this.compare_item1 = ['department_code', 'insurance_type', 'is_internal_prescription', 'karte_status_code', 'poultice_many_reason', 'psychotropic_drugs_much_reason','free_comment', 'med_consult', 'supply_med_info', 'potion'];
    this.injection_compare_item1 = ['department_code', 'insurance_type', 'karte_status_code', 'exchange_cycle', 'location_id','free_comment', 'require_time', 'water_bubble', 'drip_rate'];
    this.compare_item2 = ['body_part', 'days', 'date', 'days_suffix', 'mixture', 'one_dose_package','temporary_medication', 'start_date', 'usage', 'usageName','usage_category_name', 
    'usage_remarks_comment', 'usage_replace_number', 'medicines', 'administrate_period'];
    this.compare_item3 = ['classfic', 'classfic_name', 'item_id', 'item_name', 'attribute1', 'format1', 'unit_name1', 'max_length1', 'value1', 'attribute2', 'format2', 'unit_name2', 'max_length2', 'value2'];

    this.m_existDeleteData = false;
    this.m_delNumbers = 0;
    this.m_canConfirm = false;
    this.disable_utf_character = 1;
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if(initState !== undefined && initState != null && initState.conf_data !== undefined){
      if(initState.conf_data.disable_utf_character !== undefined){
        this.disable_utf_character = initState.conf_data.disable_utf_character;
      }
    }
  }  

  confirmPrescription = () => {
    // if (this.state.canConfirm != 1) return;
    if (this.m_canConfirm != true) return;
    let error_str = this.validate();
    if (error_str.length > 0) {
      this.setState({alert_messages:error_str.join("\n")});
      return;
    }
    // let is_changed = this.getChangeState();
    // if (!is_changed) return;
    if($('#id_prescription_confirm_button').hasClass('confirm')){
      // this.m_existDeleteData => if exist delete data
      // 1211-10 処方・注射画面からの削除の動線の整理・修正(2)
      this.props.confirmPrescription(this.m_existDeleteData, this.m_delNumbers);
    }
  }
  validate () {
    let error_str = [];
    let cacheData = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.props.cacheSerialNumber);
    if (cacheData != undefined && cacheData != null) {
      let presData = cacheData[0].presData;
      let usageCacheData = JSON.parse(window.localStorage.getItem('haruka_cache_usageData'));
      if (usageCacheData != undefined && usageCacheData != null) {
        presData.map(rp_item=>{
          if (rp_item.usage != undefined && rp_item.usage != null && rp_item.usage != '') {
            let usage_data = null;
            let usageData;
            Object.keys(usageCacheData).map((kind)=>{
              usageData = usageCacheData[kind];	
              Object.keys(usageData).map((idx)=>{
                usageData[idx].map((item)=>{
                  if(item.code == rp_item.usage){
                    usage_data = item;	
                  } 
                })
              });
            })
            if (usage_data != null && usage_data.enable_days != 1 && rp_item.days > 0) {
              error_str.push('「日数/回数を使用できない用法です。用法選択を再度行ってください。');
            }
          }
        });
      }
    }
    if (this.props.is_injection == 1) cacheData = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.props.cacheSerialNumber);
    if (cacheData != undefined && cacheData != null) {
      let presData = this.props.is_injection == 1 ? cacheData[0].injectData : cacheData[0].presData;
      let rp_comment_check = false;
      let body_comment_check = false;
      let med_comment_check = false;
      let free_comment_check = false;
      let poultice_check = false;
      let item_comment_check = false;
      presData.map(rp_item => {
        if (rp_item.usage_remarks_comment != null && rp_item.usage_remarks_comment.length > 0 && !rp_comment_check) {
          rp_item.usage_remarks_comment.map(rp_comment => {
            if (checkSMPByUnicode(rp_comment)) rp_comment_check = true;
          });
        }
        if (rp_item.body_part !== undefined && rp_item.body_part != "" && !body_comment_check) {
          if (checkSMPByUnicode(rp_item.body_part)) body_comment_check = true;
        }
        if (rp_item.medicines !== undefined && rp_item.medicines != null && rp_item.medicines.length > 0) {
          if (!med_comment_check) {
            rp_item.medicines.map(med_item => {
              if (med_item.free_comment !== undefined && med_item.free_comment != null && med_item.free_comment.length > 0 && !med_comment_check) {
                med_item.free_comment.map(med_comment => {
                  if (checkSMPByUnicode(med_comment)) med_comment_check = true;
                });
              }
            })
          }
        }
      });
      if (cacheData[0].free_comment !== undefined) {
        let free_comment = cacheData[0].free_comment;
        if (free_comment != null && free_comment.length > 0 && free_comment[0] != null && free_comment[0] != "") {
          if (checkSMPByUnicode(free_comment[0])) free_comment_check = true;
        }
      }
      if (cacheData[0].poultice_many_reason !== undefined && cacheData[0].poultice_many_reason != "") {
        if (checkSMPByUnicode(cacheData[0].poultice_many_reason)) poultice_check = true;
      }
      if (cacheData[0].item_details !== undefined && cacheData[0].item_details.length > 0) {
        cacheData[0].item_details.map(item=>{
          if (item.value1 !== undefined && item.value1 != "") {
            if (checkSMPByUnicode(item.value1)) item_comment_check = true;
          }
          if (item.value2 !== undefined && item.value2 != "") {
            if (checkSMPByUnicode(item.value2)) item_comment_check = true;
          }
        })
      }
      if (med_comment_check) error_str.push("薬剤コメントに印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください。");
      if (rp_comment_check) error_str.push("追加用法コメントに印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください。");
      if (body_comment_check) error_str.push("部位指定コメントに印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください。");
      if (free_comment_check) error_str.push("備考に印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください。");
      if (poultice_check) error_str.push("湿布薬超過投与理由に印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください。");
      if (item_comment_check) error_str.push("追加品名に印刷や医事連携できない可能性のある文字を含んでいます。機種依存文字は他の文字に置き換えてください。");
    }
    return error_str;
  }

  deletePrescription = () => {
    let cacheData = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.props.cacheSerialNumber);
    if (this.props.is_injection == 1) {
      cacheData = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.props.cacheSerialNumber);
    }
    if (cacheData !=  undefined && cacheData[0] != undefined && cacheData[0].temp_saved == undefined) {
      let cache_number = cacheData[0].number;
      if (this.props.is_injection == 1) {        
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.props.cacheSerialNumber);
      } else {
        karteApi.delSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.props.cacheSerialNumber);
      }

      let cache_done_history = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY);
      let cache_done = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
      if (this.props.is_injection == 1) {
        cache_done_history = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY);
        cache_done = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DONE);
      }
      if (cache_done_history != null && cache_done_history.length > 0) {
        cache_done_history = cache_done_history.filter(x=>x.number!=cache_number);
      }
      if (cache_done != null && cache_done.length > 0) {
        cache_done = cache_done.filter(x=>x.number!=cache_number);
      }
      if (cache_done_history != null && cache_done_history.length > 0) {
        if (this.props.is_injection == 1) {          
          karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY, JSON.stringify(cache_done_history));
          karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DONE, JSON.stringify(cache_done));
        } else {
          karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY, JSON.stringify(cache_done_history));
          karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE, JSON.stringify(cache_done));
        }
      } else {
        if (this.props.is_injection == 1) {          
          karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DONE_HISTORY);
          karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DONE);
        } else {
          karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE_HISTORY);
          karteApi.delVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DONE);
        }
      }
    }
    this.props.deletePrescriptionFun(this.m_existDeleteData, this.m_delNumbers);
  }

  testConfirmRender = (canConfirm=null, delConfirm=null) =>{
    let _state = {};
    if (canConfirm != null) _state.canConfirm = canConfirm;
    if (delConfirm != null) _state.delConfirm = delConfirm;
    this.setState(_state);
  }
  setInitialData = () =>{
    let cacheData = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.props.cacheSerialNumber);
    if (this.props.is_injection == 1) cacheData = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.props.cacheSerialNumber);
    if (cacheData == undefined || cacheData == null || cacheData.length == 0) return;
    if (cacheData[0].isUpdate != 1) return;
    this.setState({
      origin_data: cacheData[0]
    });
    window.localStorage.setItem("prescription_origin_data", JSON.stringify(cacheData[0]));
  }
  /**
  get prescription change state 2020-08-28
  if changed return true else return false;
   */
  getChangeState() {
    let cacheData = null;
    let origin_data = null;
    origin_data = JSON.parse(window.localStorage.getItem("prescription_origin_data"));
    cacheData = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.props.cacheSerialNumber);
    if (cacheData == undefined || cacheData == null || cacheData.length == 0) return false;
    if (cacheData[0].isUpdate != 1) return false;
    if (origin_data == null) return false;
    let current_data = cacheData[0];
    let is_changed = false;
    let change_index = '';
    if (origin_data.presData != undefined && current_data.presData != undefined && origin_data.presData.length != current_data.presData.length) return true;
    this.compare_item1.map(item=>{
      if (origin_data[item] instanceof Array) {
        if (origin_data[item].length != current_data[item].length ) {
          if (change_index == '') change_index = item;
          is_changed = true;
        }
        if (item == "free_comment") {
          if (origin_data[item].length == 0 && current_data[item].length == 1 && current_data[item][0] =="") {
            is_changed = false;
          }
        }
        origin_data[item].map((sub_item, sub_index)=>{
          if (sub_item != current_data[item][sub_index]) {
            if (change_index == '') change_index = item;
            is_changed = true;
          }
        })
      } else {
        if (origin_data[item] != current_data[item]){
          if (change_index == '') change_index = item;
          is_changed = true;
        }
      }
    });
    if (is_changed) return true;
    origin_data.presData.map((rp_item, rp_index)=>{
      this.compare_item2.map(item=>{
        if (rp_item[item] != undefined && rp_item[item] != null) {
          if (rp_item[item] instanceof Array) {
            if (item == "medicines") {
              if (rp_item.medicines != undefined && 
                rp_item.medicines != null && 
                current_data.presData[rp_index] != undefined && 
                current_data.presData[rp_index] != null && 
                JSON.stringify(rp_item.medicines) != JSON.stringify(current_data.presData[rp_index]['medicines'])) {
                if (change_index == '') change_index = item;
                is_changed = true;
              }
            } else if (item == "administrate_period") {
              if (rp_item.administrate_period !== undefined && rp_item.administrate_period != null &&
              current_data.presData[rp_index] !== undefined && current_data.presData[rp_index] != null &&
                JSON.stringify(rp_item.administrate_period) != JSON.stringify(current_data.presData[rp_index]['administrate_period'])) {
                if (change_index == '') change_index = item;
                is_changed = true;
              }
            } else if (item == "usage_remarks_comment") {
              if (rp_item.usage_remarks_comment != undefined && 
                rp_item.usage_remarks_comment != null && 
                current_data.presData[rp_index] != undefined && 
                current_data.presData[rp_index] != null && 
                JSON.stringify(rp_item.usage_remarks_comment) != JSON.stringify(current_data.presData[rp_index]['usage_remarks_comment'])) {
                if (change_index == '') change_index = item;
                is_changed = true;
              }
            } else {
              if (rp_item[item] != undefined && rp_item[item] != null && current_data.presData[rp_index] != undefined && current_data.presData[rp_index] != null && current_data.presData[rp_index][item] != undefined && current_data.presData[rp_index][item] != null) {              
                rp_item[item].map((sub_item, sub_index)=>{
                  if (current_data.presData[rp_index][item][sub_index] != undefined && sub_item != current_data.presData[rp_index][item][sub_index]) {
                    if (change_index == '') change_index = item;
                    is_changed = true;
                  }
                })
              }
            }
          } else {
            if (rp_item[item] != undefined && rp_item[item] != null && current_data.presData[rp_index] != undefined && current_data.presData[rp_index][item] != null && rp_item[item] != current_data.presData[rp_index][item]) {
              if (change_index == '') change_index = item;
              is_changed = true;
            }  
          }
        }
      })
    })
    if (is_changed) return true;
    
    origin_data.item_details.map((item, index)=>{
      this.compare_item3.map(key=>{
        if (item[key] != current_data.item_details[index][key]) {
          if (change_index == '') change_index = item;
          is_changed = true;
        }
      })
    });
    if (is_changed) return true;
    if (origin_data.item_details.length != current_data.item_details.length) return true;
    return false;
  }
  getInjectChangeState() {
    let cacheData = null;
    let origin_data = null;
    origin_data = JSON.parse(window.localStorage.getItem("prescription_origin_data"));
    cacheData = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.props.cacheSerialNumber);
    if (cacheData == undefined || cacheData == null || cacheData.length == 0) return false;
    if (cacheData[0].isUpdate != 1) return false;
    if (origin_data == null) return false;
    let current_data = cacheData[0];
    let is_changed = false;
    let change_index = '';
    if (origin_data.injectData != undefined && current_data.injectData != undefined && origin_data.injectData.length != current_data.injectData.length) return true;
    this.injection_compare_item1.map(item=>{
      if (origin_data[item] instanceof Array) {
        origin_data[item].map((sub_item, sub_index)=>{
          if (sub_item != current_data[item][sub_index]) {
            if (change_index == '') change_index = item;
            is_changed = true;
          }
        })
      } else {
        if (origin_data[item] != current_data[item]){
          if (change_index == '') change_index = item;
          is_changed = true;
        }
      }
    });
    if (is_changed) return true;
    let injectData = origin_data.injectData;
    if (this.props.is_injection == 1) injectData = origin_data.injectData;
    if (injectData == undefined) return;
    origin_data.injectData.map((rp_item, rp_index)=>{
      this.compare_item2.map(item=>{
        if (rp_item[item] != undefined && rp_item[item] != null) {
          if (rp_item[item] instanceof Array) {
            if (item == "medicines") {
              if (rp_item.medicines != undefined && 
                rp_item.medicines != null && 
                current_data.injectData[rp_index] != undefined && 
                current_data.injectData[rp_index] != null && 
                JSON.stringify(rp_item.medicines) != JSON.stringify(current_data.injectData[rp_index]['medicines'])) {
                if (change_index == '') change_index = item;
                is_changed = true;
              }
            } else if (item == "usage_remarks_comment") {
              if (rp_item.usage_remarks_comment != undefined && 
                rp_item.usage_remarks_comment != null && 
                current_data.injectData[rp_index] != undefined && 
                current_data.injectData[rp_index] != null && 
                JSON.stringify(rp_item.usage_remarks_comment) != JSON.stringify(current_data.injectData[rp_index]['usage_remarks_comment'])) {
                if (change_index == '') change_index = item;
                is_changed = true;
              }
            } else {
              if (rp_item[item] != undefined && rp_item[item] != null && current_data.injectData[rp_index] != undefined && current_data.injectData[rp_index] != null && current_data.injectData[rp_index][item] != undefined && current_data.injectData[rp_index][item] != null) {              
                rp_item[item].map((sub_item, sub_index)=>{
                  if (current_data.injectData[rp_index][item][sub_index] != undefined && sub_item != current_data.injectData[rp_index][item][sub_index]) {
                    if (change_index == '') change_index = item;
                    is_changed = true;
                  }
                })
              }
            }
          } else {
            if (rp_item[item] != undefined && rp_item[item] != null && current_data.injectData[rp_index] != undefined && current_data.injectData[rp_index][item] != null && rp_item[item] != current_data.injectData[rp_index][item]) {
              if (change_index == '') change_index = item;
              is_changed = true;
            }  
          }
        }
      })
    })
    if (is_changed) return true;
    origin_data.item_details.map((item, index)=>{
      this.compare_item3.map(key=>{
        if (item[key] != current_data.item_details[index][key]) {
          if (change_index == '') change_index = item;
          is_changed = true;
        }
      })
    });
    if (is_changed) return true;
    if (origin_data.item_details.length != current_data.item_details.length) return true;
    return false;
  }

  isEdit () {
    let cacheData = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.props.cacheSerialNumber);
    if (this.props.is_injection == 1) cacheData = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.INJECTION_EDIT, this.props.cacheSerialNumber);

    if (cacheData == undefined || cacheData == null || cacheData.length == 0) return false;
    if (cacheData[0].isUpdate != 1) return false;
    else return true;
  }
  closeSystemAlertModal () {
    this.setState({alert_messages:''});
  }

  testRender = () => {
    this.setState({
      cur_timestamp: new Date().getTime()
    });
  }

  existDelData = () => {
    let result = karteApi.existDeleteData(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_DELETE, this.props.cacheSerialNumber);
    
    if (this.props.is_injection) {
      result = karteApi.existDeleteData(this.props.patientId, CACHE_LOCALNAMES.INJECTION_DELETE, this.props.cacheSerialNumber);
    }

    this.m_existDeleteData = result.exist;
    this.m_delNumbers = result.numbers;

    return result.exist;
  }

  render() {
    let is_changed = this.getChangeState();
    if (this.props.is_injection) is_changed = this.getInjectChangeState();
    
    let _canConfirm = ((this.state.canConfirm == 1 && !this.isEdit()) || (this.isEdit() && is_changed));
    if (this.existDelData()) _canConfirm = true;

    this.m_canConfirm = _canConfirm;
    return (
      <>
        <div id="id_prescription_confirm_button" className={`prescription-check ${ _canConfirm ? "confirm" : ""}`}>                
          <Button onClick={this.deletePrescription} className="cancel-btn">キャンセル</Button>
          <Button onClick={this.confirmPrescription}>{this.state.canConfirm == 2 ? "確認済み" : "確認"}</Button>
        </div>
        {this.state.alert_messages !== "" && (
            <ValidateAlertModal
                handleOk= {this.closeSystemAlertModal.bind(this)}
                alert_meassage= {this.state.alert_messages}
            />
        )}
      </>
    );
  }
}

PrescriptionConfirmButton.propTypes = propTypes;
PrescriptionConfirmButton.defaultProps = defaultProps;

export default PrescriptionConfirmButton;