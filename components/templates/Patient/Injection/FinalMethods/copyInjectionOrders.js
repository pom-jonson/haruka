import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
export default async function(injection, from=null) {

  // ■YJ401 Doや編集が展開できていないように見える問題の修正
  if(this.prescribeTableRef.current != undefined && this.prescribeTableRef.current != undefined){
    await this.prescribeTableRef.current.setPrescribeTableLoad(false);  
  }

  // 空の状態へのオーダー単位のDoは、処方と同じように備考エリアの内容も反映するように
  let idx = this.state.injectData[this.state.injectData.length - 1].order_number ? this.state.injectData.length : this.state.injectData.length - 1;
  if (idx == 0) {
    this.modal_obj.location_id = injection.order_data.location_id ? injection.order_data.location_id : 0;
    this.modal_obj.location_name = injection.order_data.location_name && injection.order_data.location_name != "" ? injection.order_data.location_name : "";
    this.modal_obj.drip_rate = injection.order_data.drip_rate ? injection.order_data.drip_rate : 0;
    this.modal_obj.water_bubble = injection.order_data.water_bubble ? injection.order_data.water_bubble : 0;
    this.modal_obj.exchange_cycle = injection.order_data.exchange_cycle ? injection.order_data.exchange_cycle : 0;
    this.modal_obj.require_time = injection.order_data.require_time ? injection.order_data.require_time : 0;
    // ●YJ110 SOAPの中央カラムからDoしたときに、新規発行する入外区分は現在の区分に合わせるように
    if (from == "_fromSoap") {
      // ●YJ1069 SOAP画面のDoで、外来患者に放射線など尾のオーダーを入院で発行できてしまう
      if (this.context.karte_status.code == 1 && injection.order_data.is_completed == 4) {
        this.modal_obj.inOut = 4;  
      } else {
        this.modal_obj.inOut = this.modal_obj.inOut;      
      }
    } else {      
      this.modal_obj.inOut = injection.order_data.is_completed ? injection.order_data.is_completed : 0;
    }
    this.modal_obj.free_comment = injection.order_data.free_comment ? injection.order_data.free_comment : "";
    let remark_status = {
      location_id: injection.order_data.location_id,
      drip_rate: injection.order_data.drip_rate,
      water_bubble: injection.order_data.water_bubble,
      exchange_cycle: injection.order_data.exchange_cycle,
      require_time: injection.order_data.require_time,
      free_comment: injection.order_data.free_comment ? injection.order_data.free_comment : "",
    };
    this.remarkRef.current.testRemarkRender(remark_status);
    let reset_state = {
      id: this.modal_obj.inOut
    };
    if(this.injectionInOutRef.current != undefined && this.injectionInOutRef.current != null){
      this.injectionInOutRef.current.testInOutRender(reset_state);
    }
  }
  let cacheState = karteApi.getSubVal(parseInt(this.props.match.params.id), CACHE_LOCALNAMES.INJECTION_EDIT, this.m_cacheSerialNumber);
  let item_details = [];
  if (injection.order_data.item_details != undefined && injection.order_data.item_details != null && injection.order_data.item_details.length > 0) {
    item_details = injection.order_data.item_details.map(item=>{
      return {
        classfic: item.classfic,
        classfic_name: item.classfic_name,
        item_id: item.item_id,
        item_name: item.item_name,
        attribute1: item.attribute1,
        format1: item.format1,
        unit_name1: item.unit_name1,
        max_length1: item.max_length1,
        value1: item.value1,
        attribute2: item.attribute2,
        format2: item.format2,
        unit_name2: item.unit_name2,
        max_length2: item.max_length2,
        value2: item.value2,
      }
    });
  }  

  if (item_details !== undefined && item_details.length > 0) {    
    // ■YS5 処方箋単位でDoしたときに、区分跨ぎエラーの警告でキャンセルすると、品名の反映がキャンセルされない
    this.modal_obj.do_item_details = item_details;
    this.modal_obj.item_details = item_details;
    this.m_show_detail_flag = 1;
    this.showItemDetailArea(1);
  }

  if (cacheState != undefined && cacheState != null && cacheState[0] != undefined) {
    if (cacheState[0].item_details != null && cacheState[0].item_details != undefined && cacheState[0].item_details.length > 0) {
      let cache_item_dettails = cacheState[0].item_details;
      if (item_details.length > 0) {
        item_details.map(item=>{
          cache_item_dettails.push(item);
        });
      }            
      let blank_insert = {classfic: 0, classfic_name:'', item_id: 0, item_name: "", attribute1:"0", format1:"", unit_name1:"", max_length1:"", value1:"", attribute2:"0", format2:"", unit_name2:"", max_length2:"", value2:""};
      cache_item_dettails = cache_item_dettails.filter(x=>x.item_id !== 0);
      cache_item_dettails.push(blank_insert);
      item_details = cache_item_dettails;
    }
  }

  // save all item_details 
  this.modal_obj.all_item_details = item_details;
    
  // 全RPコピー
  let flag = false;
  let order_numbers = [];
  injection.order_data.order_data.map(order => {
    if (this.copyInjectionOrder(order, 1, idx == 0)) {
      order_numbers.push(order.order_number);
      flag = true;
    }
  });
  if (order_numbers.length > 0 && this.state.titleTab == 0) {
    this.setInjectDoCopyStatus(order_numbers, true, false, 1);
  }

  // if(this.patientModalRef.current != undefined && this.patientModalRef.current != null){      
  //   this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
  // }
  return flag;
}
