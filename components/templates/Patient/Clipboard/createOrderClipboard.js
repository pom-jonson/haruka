import {ALLERGY_STATUS_ARRAY, CACHE_SESSIONNAMES} from "~/helpers/constants";
import {formatJapanDateSlash, formatTimeIE, getWeekNamesBySymbol} from "~/helpers/date";
import {getInspectionMasterInfo, getStaffName, getInsuranceName, getStrLength, REHABILY_DISEASE, getDoctorName} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";

const getOneSpaces = (_n) => {
  let result = "";
  let one_space = "　";
  for (var i = _n - 1; i >= 0; i--) {
    result += one_space;
  }
  return result;
}

export const clipboardMedicineGuidance = (order_data) => {
  let clipboard_text = "";
  
  clipboard_text += "同意日：" + (order_data.consent_date !== undefined && order_data.consent_date != null && order_data.consent_date !== "" ? formatJapanDateSlash(order_data.consent_date) : "") + "\n";
  clipboard_text += "医師名：" + (order_data.doctor_id !== undefined ? getDoctorName(order_data.doctor_id) : '') + "\n";
  clipboard_text += "服薬指導可・不可：" + (order_data.medication_instruction_flag == 1 ? "可" : "不可") + "\n";
  if (order_data.guidance_date !== undefined && order_data.guidance_date != null && order_data.guidance_date !== "") {
    clipboard_text += "指導開始日：" + (formatJapanDateSlash(order_data.guidance_date)) + "\n";
  }
  if (order_data.drug_instruction_flag !== undefined && order_data.drug_instruction_flag != null && order_data.drug_instruction_flag !== "") {
    clipboard_text += getOneSpaces(3) + (order_data.drug_instruction_flag == 0 ? "麻薬指導なし" : "麻薬指導あり") + "\n";
  }
  if (order_data.disease_name_flag !== undefined && order_data.home_instruction_flag != null && order_data.home_instruction_flag !== "") {
    clipboard_text += getOneSpaces(3) + (order_data.home_instruction_flag == 0 ? "在宅指導なし" : "在宅指導あり") + "\n";
  }
  if (order_data.disease_name_flag !== undefined && order_data.disease_name_flag != null && order_data.disease_name_flag !== "") {
    clipboard_text += getOneSpaces(3) + (order_data.disease_name_flag == 0 ? "在宅指導なし" : "病名等未告知あり") + "\n";
  }
  if (order_data.patient_description !== undefined && order_data.patient_description != null && order_data.patient_description !== "") {
    clipboard_text += "患者への説明：" + (order_data.patient_description) + "\n";
  }
  if (order_data.impossible_reason !== undefined && order_data.impossible_reason != null && order_data.impossible_reason !== "") {
    clipboard_text += "不可理由：" + (order_data.impossible_reason) + "\n";
  }
  if (order_data.request_contents_array !== undefined && order_data.request_contents_array != null && order_data.request_contents_array.length > 0) {
    clipboard_text += "指導依頼内容：" + "\n";
    order_data.request_contents_array.map(basic_item=>{
      clipboard_text += getOneSpaces(3) + basic_item.guidance_medication_name + "\n";      
    })
    if (order_data.other_request_content != undefined && order_data.other_request_content != "") {
      clipboard_text += getOneSpaces(3) + order_data.other_request_content;
    }
  } 

  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

export const clipboardExamination = (cache_data) => {
  let clipboard_text = "";
  let radio_option1=["無し","使用中", "使用後"];
  let radio_option2=["無し","治療中", "治療後"];
  let order_data = cache_data;
  if (cache_data == undefined || cache_data == null) return;
  if (cache_data.data !== undefined && cache_data.data != null && cache_data.data.order_data !== undefined && cache_data.data.order_data.order_data !== undefined) {
    order_data = cache_data.data.order_data.order_data;
  }
  let examination_attention_mark = "";
  let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
  if(initState !== undefined && initState != null && initState.conf_data !== undefined){
    if(initState.conf_data.examination_attention_mark !== undefined && initState.conf_data.examination_attention_mark != ""){
      examination_attention_mark = initState.conf_data.examination_attention_mark;
    }    
  }
  if (order_data.administrate_period !== undefined && order_data.administrate_period != null) {
    clipboard_text += "採取(予定)日時" + "\n";
    if (order_data.administrate_period.done_days !== undefined && order_data.administrate_period.done_days.length > 0) {
      order_data.administrate_period.done_days.map(item=>{
        clipboard_text += item + "\n";
      })
    }
  } 
  else {
    clipboard_text += "採取日時：";
    let collect_date = order_data.collected_date === "" ? "次回診察日" : order_data.collected_time === "" ? formatJapanDateSlash(order_data.collected_date) : formatJapanDateSlash(order_data.collected_date)
      +"  "+(order_data.collected_date =="日未定" ? "" : order_data.collected_time.substr(0,order_data.collected_time.length-3));
    clipboard_text += collect_date + "\n";
  }
  clipboard_text += "保険：" + order_data.insurance_name + "\n";
  if (order_data.subject != undefined && order_data.subject != null && order_data.subject != '') {
    clipboard_text += "概要：" + order_data.subject + "\n";
  }
  clipboard_text += "検査項目" + "\n";
  order_data.examinations.map(item=>{    
    let exam_str = item.is_attention != undefined && item.is_attention == 1 ? examination_attention_mark : "";
    exam_str += item.not_done_flag == true? "【不実施】": "";
    exam_str += item.urgent == 1? "【至急】": "";
    exam_str += item.name + "\n";
    clipboard_text += "　　　" + exam_str;
  });
  if (order_data.free_instruction != undefined && order_data.free_instruction.length > 0) {
    clipboard_text += "自由入力オーダー" + "\n";
    order_data.free_instruction.map(item=>{
      let free_str = item.is_attention != undefined && item.is_attention == 1 ? examination_attention_mark : "";
      free_str += item.not_done_flag == true? "【不実施】": "";
      free_str += item.urgent == 1? "【至急】": "";
      free_str += item.text + "\n";
      clipboard_text += "　　　" + free_str;
    });
  }
  if (order_data.menstruation_date !== undefined && order_data.menstruation_date !== '') {
    clipboard_text += "最終月経：";
    clipboard_text += order_data.menstruation_date.split("-").join("/");
    clipboard_text += (order_data.menstruation_period !== undefined && order_data.menstruation_period !== '' ? ("　日数：" + order_data.menstruation_period + "日") : "") + "\n";
  }
  if (order_data.menopause !== undefined && order_data.menopause !== '') {
    clipboard_text += "閉経：";
    clipboard_text += order_data.menopause + " 歳" + "\n";
  }
  if ((order_data.pregnancy !== undefined && order_data.pregnancy !== '') || (order_data.production !== undefined && order_data.production !== '')) {
    clipboard_text += order_data.pregnancy != undefined && order_data.pregnancy != '' ? (order_data.pregnancy + " 妊 ") : "";
    clipboard_text += (order_data.production != undefined && order_data.production != '' ? (order_data.production + " 産 ") : "") + "\n";
  }
  if (order_data.clinical_diagnosis !== undefined && order_data.clinical_diagnosis !== '') {
    clipboard_text += "臨床診断：" + order_data.clinical_diagnosis + "\n";
  }
  if (order_data.previous_histology !== undefined && order_data.previous_histology !== '') {
    clipboard_text += "既往組織診結果：" + order_data.previous_histology + "\n";
  }
  if (order_data.done_instruction !== undefined && order_data.done_instruction !== '') {
    clipboard_text += "実施機関：" + order_data.done_instruction + "\n";
  }
  if (order_data.recheck !== undefined && order_data.recheck !== '') {
    clipboard_text += "細胞診再検";
  }
  if (order_data.before_class !== undefined && order_data.before_class !== '') {
    clipboard_text += "前回クラス：" + order_data.before_class + "\n";
  }
  if (order_data.recheck_array !== undefined &&
    (order_data.recheck_array.find(x=>x.date != '') !== undefined || order_data.recheck_array.find(x=>x.number != '')  !== undefined)) {
    order_data.recheck_array.map(item=>{
      if (item.date !== "" || item.number != "") {
        clipboard_text += item.date != '' ? ("再検日付：" + item.date.split("-").join("/")) : "";
        clipboard_text += (item.number != '' ? (" No：" + item.number) : "") + "\n";
      }
    })
  }
  if (order_data.anticancer_use !== undefined && order_data.anticancer_use !== '') {
    clipboard_text += "抗がん剤：" + radio_option1[order_data.anticancer_use] + "\n";
  }
  if (order_data.radiation_treat !== undefined && order_data.radiation_treat !== '') {
    clipboard_text += "放射線治療：" + radio_option2[order_data.radiation_treat] + "\n";
  }
  if (order_data.hormon_use !== undefined && order_data.hormon_use !== '') {
    clipboard_text += "ホルモン剤使用：" + radio_option1[order_data.hormon_use] + "\n";
  }
  if (order_data.anticancer_kind !== undefined && order_data.anticancer_kind !== '') {
    clipboard_text += "種類：" + order_data.anticancer_kind + "\n";
  }
  if (order_data.anticancer_amount !== undefined && order_data.anticancer_amount !== '') {
    clipboard_text += "量：" + order_data.anticancer_amount + "\n";
  }
  if (order_data.todayResult == 1) {
    clipboard_text += "当日結果説明あり" + "\n";
  }
  if (order_data.order_comment !== "") {
    clipboard_text += "フリーコメント：" + order_data.free_comment + "\n";
  }
  if (order_data.additions !== undefined && Object.keys(order_data.additions).length > 0) {
    clipboard_text += "追加指示等" + "\n";
    Object.keys(order_data.additions).map(addition=>{
      clipboard_text += getOneSpaces(3) + order_data.additions[addition].name + "\n";
    });
  }

  if (cache_data.data !== undefined && cache_data.data != null && cache_data.data.done_order != undefined && (cache_data.data.done_order == 3 || cache_data.data.done_order == 1) && cache_data.data.order_data.order_data.done_comment != undefined && cache_data.data.order_data.order_data.done_comment != "") {
    clipboard_text += getOneSpaces(3) + "採取実施コメント： " + cache_data.data.order_data.order_data.done_comment + "\n";
  } else if(cache_data !== undefined && cache_data != null && cache_data.done_order != undefined && cache_data.done_order != null && (cache_data.done_order == 3 || cache_data.done_order == 1) && cache_data.done_comment != undefined && cache_data.done_comment != "") {
    clipboard_text += getOneSpaces(3) + "採取実施コメント： " + cache_data.done_comment + "\n";
  }
  
  if (window.clipboardData) {
    window.clipboardData.setData("Text", clipboard_text);
  }
}

export const clipboardBacillusInspection = (cache_data, from) => {
  let clipboard_text = "";

  let cacheData = "";  
  if (from == "rightbox") {
    cacheData = cache_data;
    clipboard_text += "採取日付：" + (cacheData.collected_date == "" ? "" : formatJapanDateSlash(cacheData.collected_date)) + (cacheData.collected_time == "" ? "" : cacheData.collected_time) + "\n";    
  } else {
    cacheData = cache_data.data.order_data;
    clipboard_text += "採取日付：" + (cache_data.data.collected_date == "" ? "" : formatJapanDateSlash(cache_data.data.collected_date)) + (cache_data.data.collected_time == "" ? "" : cache_data.data.collected_time) + "\n";
  }
  if (cacheData.gather_part != undefined && cacheData.gather_part != null && cacheData.gather_part != "") {
    clipboard_text += "採取部位採取部位：" + cacheData.gather_part.name + "\n";
  }
  if (cacheData.material != undefined && cacheData.material != null && cacheData.material != "") {
    clipboard_text += "材料：" + cacheData.material.name + "\n";
  }
  if (cacheData.detail_part != undefined && cacheData.detail_part != null && cacheData.detail_part != "") {
    clipboard_text += "詳細部位情報：" + cacheData.detail_part.name + "\n";
  }
  if (cacheData.inspection_target != undefined && cacheData.inspection_target != null && cacheData.inspection_target != "") {
    clipboard_text += "検査目的：" + cacheData.inspection_target.name + "\n";
  }
  if (cacheData.free_comment != undefined && cacheData.free_comment != null && cacheData.free_comment != "") {
    clipboard_text += "フリーコメント：" + cacheData.free_comment + "\n";
  }
  if (cacheData.inspection_item != undefined && cacheData.inspection_item != null && cacheData.inspection_item.length > 0) {
    clipboard_text += "検査項目：" + "\n";
    cacheData.inspection_item.map(item=> {
      clipboard_text += getOneSpaces(3) + item.name + "\n";      
    })
  }
  if (cacheData.basic_disease != undefined && cacheData.basic_disease != null && cacheData.basic_disease != "") {
    clipboard_text += "基礎疾患：" + cacheData.basic_disease.name + "\n";
  }
  if (cacheData.travel_history != undefined && cacheData.travel_history != null && cacheData.travel_history != "") {
    clipboard_text += "渡航履歴：" + cacheData.travel_history.name + "\n";
  }
  if (cacheData.infectious != undefined && cacheData.infectious != null && cacheData.infectious != "") {
    clipboard_text += "推定感染症：" + cacheData.infectious.name + "\n";
  }
  if (cacheData.anti_data != undefined && cacheData.anti_data != null && cacheData.anti_data != "") {
    clipboard_text += "使用中抗菌剤：" + "\n";
    cacheData.anti_data.map(item=> {
      clipboard_text += getOneSpaces(3) + item.name + "\n";      
    })
  }
  if (cacheData.target_bacillus != undefined && cacheData.target_bacillus != null && cacheData.target_bacillus != "") {
    clipboard_text += "目的菌：" + cacheData.target_bacillus.name + "\n";
  }
  
  if (window.clipboardData) {
    window.clipboardData.setData("Text", clipboard_text);
  }
}

export const clipboardRehabily = (rehabily_data) => {
  let clipboard_text = "";      

  let status_type_array = {1:"開始", 2:"変更", 3:"中止", 4:"終了"};
  let disease_type_array = {1:"急性", 2:"慢性"};
  let start_place_array = {1:"ベッドサイドより", 2:"リハ医療室にて", 3:"院内にて", 4:"院外にて"};

  // 依頼日 
  clipboard_text += "依頼日：" + (rehabily_data.request_date !== undefined && rehabily_data.request_date != null && rehabily_data.request_date !== "" ? formatJapanDateSlash(rehabily_data.request_date) : "") + "\n";

  // 保険 
  clipboard_text += "保険：" + getInsuranceName(rehabily_data.insurance_name) + "\n";
  
  // 依頼医 
  clipboard_text += "依頼医：" + (rehabily_data.request_doctor_name !== undefined && rehabily_data.request_doctor_name != null && rehabily_data.request_doctor_name !== "" ? rehabily_data.request_doctor_name : "") + "\n";
  
  // 処方日 
  clipboard_text += "処方日：" + (rehabily_data.prescription_date !== undefined && rehabily_data.prescription_date != null && rehabily_data.prescription_date !== "" ? formatJapanDateSlash(rehabily_data.prescription_date) : "") + "\n";
  
  // 処方医 
  clipboard_text += "処方医：" + (rehabily_data.prescription_doctor_name !== undefined && rehabily_data.prescription_doctor_name != null && rehabily_data.prescription_doctor_name !== "" ? rehabily_data.prescription_doctor_name : "") + "\n";
  
  if (rehabily_data.status_type !== undefined && rehabily_data.status_type != null && rehabily_data.status_type !== "") {
    clipboard_text += getOneSpaces(3) + (rehabily_data.status_type !== undefined && rehabily_data.status_type != null && rehabily_data.status_type !== "" ? status_type_array[rehabily_data.status_type] : "") + "\n";          
  }

  // 実施希望日
  if (rehabily_data.done_want_date !== undefined && rehabily_data.done_want_date != null && rehabily_data.done_want_date !== "") {
    clipboard_text += "実施希望日：" + (rehabily_data.done_want_date !== undefined && rehabily_data.done_want_date != null && rehabily_data.done_want_date !== "" ? formatJapanDateSlash(rehabily_data.done_want_date) : "") + "\n";          
  }

  // 起算日
  if (rehabily_data.calculation_start_date !== undefined && rehabily_data.calculation_start_date != null && rehabily_data.calculation_start_date !== "") {
    clipboard_text += "起算日：" + (rehabily_data.calculation_start_date !== undefined && rehabily_data.calculation_start_date != null && rehabily_data.calculation_start_date !== "" ? formatJapanDateSlash(rehabily_data.calculation_start_date) : "") + "\n";          
  }

  // 経過・RISK・合併症等
  if (rehabily_data.free_comment !== undefined && rehabily_data.free_comment != null && rehabily_data.free_comment !== "") {
    clipboard_text += "経過・RISK・合併症等：" + (rehabily_data.free_comment !== undefined && rehabily_data.free_comment != null && rehabily_data.free_comment !== "" ? rehabily_data.free_comment : "") + "\n";          
  }

  // 特記事項
  if (rehabily_data.special_comment !== undefined && rehabily_data.special_comment != null && rehabily_data.special_comment !== "") {
    clipboard_text += "特記事項：" + (rehabily_data.special_comment !== undefined && rehabily_data.special_comment != null && rehabily_data.special_comment !== "" ? rehabily_data.special_comment : "") + "\n";          
  }

  // 障害名
  if (rehabily_data.fault_name_array !== undefined && rehabily_data.fault_name_array != null && rehabily_data.fault_name_array.length > 0) {
    clipboard_text += "障害名" + "\n";          
    rehabily_data.fault_name_array.map(basic_item=>{
      clipboard_text += getOneSpaces(3) + basic_item + "\n";      
    })
  }

  // 開始希望場所
  if (rehabily_data.start_place !== undefined && rehabily_data.start_place != null && rehabily_data.start_place !== "") {
    clipboard_text += "開始希望場所：" + (rehabily_data.start_place !== undefined && rehabily_data.start_place != null && rehabily_data.start_place !== "" ? start_place_array[rehabily_data.start_place] : "") + "\n";          
  }

  // 基本方針
  if (rehabily_data.basic_policy_array !== undefined && rehabily_data.basic_policy_array != null && rehabily_data.basic_policy_array.length > 0) {
    clipboard_text += "基本方針" + "\n";          
    rehabily_data.basic_policy_array.map(basic_item=>{
      clipboard_text += getOneSpaces(3) + basic_item + "\n";      
    })
  }

  // 社会的ゴール
  if (rehabily_data.social_goal_array !== undefined && rehabily_data.social_goal_array != null && rehabily_data.social_goal_array.length > 0) {
    clipboard_text += "社会的ゴール" + "\n";          
    rehabily_data.social_goal_array.map(basic_item=>{
      clipboard_text += getOneSpaces(3) + basic_item + "\n";      
    })
  }

  if (rehabily_data.disease_list !== undefined && rehabily_data.disease_list != null && rehabily_data.disease_list.length > 0) {
    rehabily_data.disease_list.map(disease_item=>{

      // 病名
      if (disease_item.disease_name !== undefined && disease_item.disease_name !== "") {
        clipboard_text += "病名：" + disease_item.disease_name + "\n";          
      }
      
      // 発症日
      if (disease_item.occur_date !== undefined && disease_item.occur_date !== "") {
        clipboard_text += "発症日：" + ((disease_item.occur_date !== undefined && disease_item.occur_date != null && disease_item.occur_date !== '') ? formatJapanDateSlash(disease_item.occur_date) : '') + "\n";          
      }

      // 
      if (disease_item.treat_start_date !== undefined && disease_item.treat_start_date !== "") {
        clipboard_text += (disease_item.date_type != undefined && disease_item.date_type != null ? REHABILY_DISEASE[disease_item.date_type] : "") + (disease_item.treat_start_date != null ? formatJapanDateSlash(disease_item.treat_start_date) : "") + "\n";          
      }

      // 病名登録日
      if (disease_item.start_date !== undefined && disease_item.start_date !== "") {
        clipboard_text += "病名登録日：" + ((disease_item.start_date !== undefined && disease_item.start_date != null && disease_item.start_date !== '') ? formatJapanDateSlash(disease_item.start_date) : '') + "\n";          
      }

    });
  }

  if (rehabily_data.developed_date_for_add !== undefined && rehabily_data.developed_date_for_add != null && rehabily_data.developed_date_for_add != '') {
    clipboard_text += (rehabily_data.early_rehabilitation_date_type != undefined && rehabily_data.early_rehabilitation_date_type != null ? "早期リハビリテーション " + REHABILY_DISEASE[rehabily_data.early_rehabilitation_date_type] : "") + ((rehabily_data.developed_date_for_add !== undefined && rehabily_data.developed_date_for_add != null && rehabily_data.developed_date_for_add !== '') ? formatJapanDateSlash(rehabily_data.developed_date_for_add) : '') + "\n";          
  }

  // リハビリ直告病患
  clipboard_text += "リハビリ直告病患：" + (rehabily_data.disease_type !== undefined && rehabily_data.disease_type != null && rehabily_data.disease_type !== "" ? disease_type_array[rehabily_data.disease_type] : "") + "\n";          
  
  // 急性憎悪日
  if (rehabily_data.acute_date !== undefined && rehabily_data.acute_date != null && rehabily_data.acute_date !== "") {
    clipboard_text += "急性憎悪日：" + (rehabily_data.acute_date !== undefined && rehabily_data.acute_date != null && rehabily_data.acute_date !== "" ? formatJapanDateSlash(rehabily_data.acute_date) : "") + "\n";          
  }

  // 廃用症候群憎悪日
  if (rehabily_data.abandoned_syndrome_date !== undefined && rehabily_data.abandoned_syndrome_date != null && rehabily_data.abandoned_syndrome_date !== "") {
    clipboard_text += "廃用症候群憎悪日：" + (rehabily_data.abandoned_syndrome_date !== undefined && rehabily_data.abandoned_syndrome_date != null && rehabily_data.abandoned_syndrome_date !== "" ? formatJapanDateSlash(rehabily_data.abandoned_syndrome_date) : "") + "\n";          
  }

  // 急性期疾患起算日
  if (rehabily_data.acute_disease_start_date !== undefined && rehabily_data.acute_disease_start_date != null && rehabily_data.acute_disease_start_date !== "") {
    clipboard_text += "急性期疾患起算日：" + (rehabily_data.acute_disease_start_date !== undefined && rehabily_data.acute_disease_start_date != null && rehabily_data.acute_disease_start_date !== "" ? formatJapanDateSlash(rehabily_data.acute_disease_start_date) : "") + "\n";          
  }

  // 感染症
  if (rehabily_data.infection_exist !== undefined && rehabily_data.infection_exist != null && rehabily_data.infection_exist !== "") {
    clipboard_text += "感染症：" + (rehabily_data.infection_exist === 1 ? "有" : "無") + "\n";          
  }

  if (rehabily_data.detail !== undefined && rehabily_data.detail != null) {
    Object.keys(rehabily_data.detail).map(index=>{
      let detail_tab_item = rehabily_data.detail[index];
      detail_tab_item.map(detail_item=>{
        
        // 療法項目１
        if (detail_item.therapy_item1_name != undefined && detail_item.therapy_item1_name != "") {
          clipboard_text += "療法項目１：" + detail_item.therapy_item1_name + "\n";          
        }
        
        // 療法項目２
        if (detail_item.therapy_item2_name != undefined && detail_item.therapy_item2_name != "") {
          clipboard_text += "療法項目２：" + (detail_item.therapy_item2_name + (detail_item.therapy_item2_amount != undefined && detail_item.therapy_item2_amount != '' ? " " + detail_item.therapy_item2_amount + (detail_item.therapy_item2_unit != undefined ? detail_item.therapy_item2_unit : ""):"")) + "\n";          
        }

        // 部位1
        if (detail_item.position1_name != undefined && detail_item.position1_name != "") {
          clipboard_text += "部位1：" + detail_item.position1_name + "\n";          
        }

        // 部位2
        if (detail_item.position2_name != undefined && detail_item.position2_name != "") {
          clipboard_text += "部位2：" + detail_item.position2_name + "\n";          
        }

        if (detail_item.item_details !== undefined && detail_item.item_details != null && detail_item.item_details.length > 0) {
          detail_item.item_details.map(sub_item=>{
            if (sub_item.item_name !== undefined && sub_item.item_name != null && sub_item.item_name !== "") {
              clipboard_text += getOneSpaces(3) + sub_item.item_name + (((sub_item.value1 != undefined && sub_item.value1 != null) || (sub_item.value2 != undefined && sub_item.value2 != null)) ? "：":"");
              if (sub_item.format1 != null && sub_item.format1 != undefined && sub_item.format1.includes("年") && sub_item.format1.includes("月")) {
                if (sub_item.value1 != null && sub_item.value1 != undefined) {
                  clipboard_text += (sub_item.value1_format !== undefined) ? sub_item.value1_format : sub_item.value1;
                }
                if (sub_item.value2 != null && sub_item.value2 != undefined) {
                  clipboard_text += " ~ " + ((sub_item.value2_format !== undefined) ? sub_item.value2_format : sub_item.value2);
                }              
              } else {
                if (sub_item.value1 != null && sub_item.value1 != undefined) {
                  clipboard_text += sub_item.value1;
                }
                if (sub_item.value2 != null && sub_item.value2 != undefined) {
                  clipboard_text += sub_item.value2;
                }
              }
              if (sub_item.lot !== undefined && sub_item.lot != null && sub_item.lot !== "") {
                clipboard_text += sub_item.lot + (((sub_item.value1 != undefined && sub_item.value1 != null) || (sub_item.value2 != undefined && sub_item.value2 != null)) ? "：":""); 
              }
              clipboard_text += "\n"; 
            }
          });
        }

        if (rehabily_data.additions != undefined && Object.keys(rehabily_data.additions).length > 0) {
          clipboard_text += "追加指示等" + "\n";          
          Object.keys(rehabily_data.additions).map(addition=>{
            clipboard_text += getOneSpaces(3) + rehabily_data.additions[addition].name + "\n";      
          })
        }
      });
    });
  }
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

export const clipboardRadiation = (data) => {
  let clipboard_text = "";    
  let left_msg = "";
  let right_msg = "";

  left_msg = data.radiation_name =='他医撮影診断'?'日付':'検査日';
  right_msg = data.treat_date == "日未定" ? "[日未定]" : formatJapanDateSlash(data.treat_date) + ((data.reserve_time != undefined && data.reserve_time != "") ? (" "+data.reserve_time) : "") + (data.is_emergency == 1 ? "[当日緊急]" : "");
  clipboard_text += left_msg + "：" + right_msg + "\n";
  // 保険
  clipboard_text += "保険" + "：" + getInsuranceName(data.insurance_name) + "\n";  
  // 撮影
  if (data.portable_shoot != undefined && data.portable_shoot != null && data.portable_shoot != "") {
    clipboard_text += "撮影" + "：" + "ポータブル" + "\n";  
  }
  if (data.radiation_data != undefined && data.radiation_data.length>0) {
    data.radiation_data.map(item=> {
      // 撮影区分
      if (item.classfic_name != undefined && item.classfic_name != '') {
        clipboard_text += "撮影区分" + "：" + item.classfic_name + "\n";
      }
      // 撮影部位
      if (item.part_name != undefined && item.part_name != '') {
        clipboard_text += "撮影部位" + "：" + (item.left_right_name != undefined && item.left_right_name !='' ? item.left_right_name : "") + item.part_name + "\n";
      }
      if (item.selected_directions != undefined && Object.keys(item.selected_directions).length > 0) {
        clipboard_text += "方向" + "：" + "\n";        
        Object.keys(item.selected_directions).map(id => {
          clipboard_text += getOneSpaces(3) + item.selected_directions[id] + "\n";
        });
      }
      if (data.done_order == 1 && item.done_selected_directions != undefined && Object.keys(item.done_selected_directions).length > 0) {            
        Object.keys(item.done_selected_directions).map((id) => {
          clipboard_text += getOneSpaces(3) + "実施：" + item.done_selected_directions[id] + "\n";
        });
      }
      if (item.method_name != undefined && item.method_name != '') {            
        clipboard_text += "撮影体位/方法：" + item.method_name + "\n";
      }
      if (item.selected_comments != undefined && Object.keys(item.selected_comments).length > 0) {
        clipboard_text += "撮影コメント：" + "\n";            
        Object.keys(item.selected_comments).map(id => {
          clipboard_text += getOneSpaces(3) + item.selected_comments[id] + "\n";
        });
      }
      if ((data.done_order == 1 && item.done_shoot_count > 0) ||  item.shoot_count > 0) {
        clipboard_text += "撮影回数：" + (data.done_order == 1 && item.done_shoot_count > 0 ? item.done_shoot_count : item.shoot_count) + "\n";
      }

      if (item.sub_picture != undefined && item.sub_picture != null && item.sub_picture != "") {
        clipboard_text += "分画数：" + item.sub_picture + "\n";
      }
      if (item.direction_count != undefined && item.direction_count != null && item.direction_count != "") {
        clipboard_text += "方向数：" + item.direction_count + "\n";
      }
      if (data.done_order == 1 && item.kV >0) {
        clipboard_text += "KV：" + item.kV + (item['kV_unit'] != undefined && item['kV_unit'] != null ? item['kV_unit'] : "") + "\n";
      }
      if (data.done_order == 1 && item.mA >0) {
        clipboard_text += "mA：" + item.mA + (item['mA_unit'] != undefined && item['mA_unit'] != null ? item['mA_unit'] : "") + "\n";
      }
      if (data.done_order == 1 && item.sec >0) {
        clipboard_text += "sec：" + item.sec + (item['sec_unit'] != undefined && item['sec_unit'] != null ? item['sec_unit'] : "") + "\n";
      }
      if (data.done_order == 1 && item.FFD >0) {
        clipboard_text += "FFD：" + item.FFD + (item['FFD_unit'] != undefined && item['FFD_unit'] != null ? item['FFD_unit'] : "") + "\n";
      }
      if (data.done_order == 1 && item['管電圧'] >0) {
        clipboard_text += "管電圧：" + item['管電圧'] + (item['管電圧_unit'] != undefined && item['管電圧_unit'] != null ? item['管電圧_unit'] : "") + "\n";
      }
      if (data.done_order == 1 && item['トータル'] >0) {
        clipboard_text += "トータル：" + item['トータル'] + (item['トータル_unit'] != undefined && item['トータル_unit'] != null ? item['トータル_unit'] : "") + "\n";
      }
      if (data.done_order == 1 && item['曝射時間'] >0) {
        clipboard_text += "曝射時間：" + item['曝射時間'] + (item['曝射時間_unit'] != undefined && item['曝射時間_unit'] != null ? item['曝射時間_unit'] : "") + "\n";
      }
    });
    if (data.done_order == 1 && data.done_comment != undefined && data.done_comment != null && data.done_comment != "") {
      clipboard_text += "実施コメント：" + "\n";
      clipboard_text += data.done_comment + "\n";
    }
    if (data.done_order == 1 && data.shoot_done_user != undefined && data.shoot_done_user != null && data.shoot_done_user != "") {
      clipboard_text += "撮影実施者：" + data.shoot_done_user + "\n";
    }
    if (data.height > 0 || data.done_height >0) {
      clipboard_text += "身長：" + (data.done_height > 0 ? data.done_height:data.height) + "cm" + "\n";
    }
    if (data.weight > 0 || data.done_weight >0) {
      clipboard_text += "体重：" + (data.done_weight > 0? data.done_weight:data.weight) + "kg" + "\n";
    }
    if (data.surface_area > 0 || data.done_surface_area >0) {
      clipboard_text += "体表面積：" + (data.done_surface_area > 0? data.done_surface_area:data.surface_area) + "㎡" + "\n";
    }
    if (data.sick_name != undefined && data.sick_name != null && data.sick_name != "") {
      clipboard_text += "臨床診断、病名：" + data.sick_name + "\n";
    }
    if (data.etc_comment != undefined && data.etc_comment != null && data.etc_comment != "") {
      clipboard_text += "主訴、臨床経過" + "\n";
      clipboard_text += "検査目的、コメント：" + "\n";
      clipboard_text += data.etc_comment + "\n";
    }
    if (data.request_comment != undefined && data.request_comment != null && data.request_comment != "") {
      clipboard_text += "依頼コメント：" + data.request_comment + "\n";
      clipboard_text += data.request_comment + "\n";
    }
    if (data.pregnancy != undefined && data.pregnancy != null && data.pregnancy != "") {
      clipboard_text += "妊娠：" + data.pregnancy + "\n";
    }
    if (data.film_output != undefined && data.film_output != null && data.film_output != "") {
      clipboard_text += "フィルム出力：" + data.film_output + "\n";
    }
    if (data.filmsend != undefined && data.filmsend != null && data.filmsend != "") {
      clipboard_text += "フィルム搬送先：" + data.filmsend + "\n";
    }
    if (data.kind != undefined && data.kind != null && data.kind != "") {
      clipboard_text += "区分：" + data.kind + "\n";
    }
    if (data.move != undefined && data.move != null && data.move != "") {
      clipboard_text += "移動形態：" + data.move + "\n";
    }
    if (data.use != undefined && data.use != null && data.use != "" && data.use != "使用しない") {
      clipboard_text += "造影剤使用：" + data.use + "\n";
    }
    if (data.inquiry != undefined && data.inquiry != null && data.inquiry != "") {
      clipboard_text += "造影剤問診票：" + data.inquiry + "\n";
    }
    if (data.selected_instructions != undefined && data.selected_instructions != null && data.selected_instructions.length > 0) {
        clipboard_text += "撮影指示：" + "\n";   
      data.selected_instructions.map(item=>{
        clipboard_text += getOneSpaces(3) + item.name + "\n";   
      });
    }
    if (data.selected_shootings != undefined && data.selected_shootings != null && data.selected_shootings.length > 0) {
        clipboard_text += "撮影：" + "\n";   
      data.selected_shootings.map(item=>{
        clipboard_text += getOneSpaces(3) + item.name + "\n";   
      });
    }
    if (data.other_kind != undefined && data.other_kind != null) {
      clipboard_text += "分類：" + data.other_kind.name + "\n";
    }
    if (data.other_kind_detail != undefined && data.other_kind_detail != null) {
      clipboard_text += "分類詳細：" + data.other_kind_detail.name + "\n";
    }
    if (data.other_body_part != undefined && data.other_body_part != null) {
      clipboard_text += "部位：" + data.other_body_part + "\n";
    }
    if (data.free_comment != undefined && data.free_comment != null) {
      clipboard_text += "フリーコメント：" + data.free_comment + "\n";
    }
    if (data.additions != undefined && data.additions != null && Object.keys(data.additions).length > 0) {
      clipboard_text += "追加項目：" + "\n";
      Object.keys(data.additions).map(addition_id => {
        var item = data.additions[addition_id];
        clipboard_text += getOneSpaces(3) + item.name + "\n";
      });
    }
    if (data.done_order == 1 && data.obtain_tech != undefined && data.obtain_tech != null && data.obtain_tech != '') {
      clipboard_text += "造影剤注入手技：" + data.obtain_tech + "\n";
    }
    if (data.done_order == 1 && data.details !== undefined && data.details.length>0) {
      data.details.map(detail=>{
        if (detail.item_id > 0){
          clipboard_text += getOneSpaces(3) + "・" + detail.name;
          clipboard_text += ((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": "";
          if (detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") {
            if (getStrLength(detail.value1) > 32) {
              clipboard_text += "\n";
            }
            clipboard_text += detail.value1 + detail.input_item1_unit + "\n";
          }
          if (detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") {
            if (getStrLength(detail.value2) > 32) {
              clipboard_text += "\n";
            }
            clipboard_text += detail.value2 + detail.input_item2_unit + "\n";
          }
        }
      });
    }    
  }
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

export const clipboardMeal = (_mealData) => {
  let clipboard_text = "";    
  // 変更開始  
  clipboard_text += "変更開始：" + formatJapanDateSlash(_mealData.start_date) + " " + (_mealData.start_time_name != undefined ? (_mealData.start_time_name + "より") : "") + "\n";  
  // 変更終了
  if (_mealData.start_date_to != undefined && _mealData.start_date_to != null && _mealData.start_date_to != "") {
    clipboard_text += "変更終了：" + formatJapanDateSlash(_mealData.start_date_to) + " " + (_mealData.start_time_name_to != undefined ? (_mealData.start_time_name_to + "まで") : "") + "\n";
  }
  // 食種
  clipboard_text += "食種：" + _mealData.food_type_name + "\n";
  // 特別食加算
  clipboard_text += "特別食加算：" + _mealData.special_food_addition !== undefined ? _mealData.special_food_addition : "なし" + "\n";
  // 主食（朝）
  if (_mealData.staple_food_id_morning_name) {
    clipboard_text += "主食（朝）：" + _mealData.staple_food_id_morning_name + "\n";
  }
  // 朝のフリーコメント
  if (_mealData.staple_food_morning_free_comment != undefined && _mealData.staple_food_morning_free_comment != null && _mealData.staple_food_morning_free_comment != "") {
    clipboard_text += "朝のフリーコメント：" + _mealData.staple_food_morning_free_comment + "\n";
  }
  // 主食（昼）
  if (_mealData.staple_food_id_noon_name) {
    clipboard_text += "主食（昼）：" + _mealData.staple_food_id_noon_name + "\n";
  }
  // 昼のフリーコメント
  if (_mealData.staple_food_noon_free_comment != undefined && _mealData.staple_food_noon_free_comment != null && _mealData.staple_food_noon_free_comment != "") {
    clipboard_text += "昼のフリーコメント：" + _mealData.staple_food_noon_free_comment + "\n";
  }
  // 主食（夕）
  if (_mealData.staple_food_id_evening_name) {
    clipboard_text += "主食（夕）：" + _mealData.staple_food_id_evening_name + "\n";
  }
  // 夕のフリーコメント
  if (_mealData.staple_food_evening_free_comment != undefined && _mealData.staple_food_evening_free_comment != null && _mealData.staple_food_evening_free_comment != "") {
    clipboard_text += "夕のフリーコメント：" + _mealData.staple_food_evening_free_comment + "\n";
  }
  // 飲み物（朝）
  if (_mealData.drink_id_morning_name != "") {
    clipboard_text += "飲み物（朝）：" + _mealData.drink_id_morning_name + "\n";
  }
  // 飲み物（昼）
  if (_mealData.drink_id_noon_name != "") {
    clipboard_text += "飲み物（昼）：" + _mealData.drink_id_noon_name + "\n";
  }
  // 飲み物（夕）
  if (_mealData.drink_id_evening_name != "") {
    clipboard_text += "飲み物（夕）：" + _mealData.drink_id_evening_name + "\n";
  }
  // 副食
  if (_mealData.side_food_name != undefined && _mealData.side_food_name != null && _mealData.side_food_name != "") {
    clipboard_text += "副食：" + _mealData.side_food_name + "\n";
  }
  // 朝食
  // if (_mealData.breakfast_name != undefined && _mealData.breakfast_name != null && _mealData.breakfast_name != "") {
  //   clipboard_text += "朝食：" + _mealData.breakfast_name + "\n";
  // }
  // 流動食
  if (_mealData.thick_liquid_food_name !== undefined && _mealData.thick_liquid_food_name != "") {
    clipboard_text += "流動食：" + _mealData.thick_liquid_food_name + "\n";
  }
  // 摂取方法
  if (_mealData.ingestion_method_name !== undefined && _mealData.ingestion_method_name != "") {
    clipboard_text += "摂取方法：" + _mealData.ingestion_method_name + "\n";
  }
  // ミルク食
  if (_mealData.milk_name !== undefined && _mealData.milk_name != "") {
    clipboard_text += "ミルク食：" + _mealData.milk_name + "\n";
  }
  // 配膳先
  if (_mealData.serving_name != "") {
    clipboard_text += "配膳先：" + _mealData.serving_name + "\n";
  }
  // コメント
  if (_mealData.meal_comment.length > 0) {
    clipboard_text += "コメント：" + "\n";      
    _mealData.meal_comment.map(comment=>{
      clipboard_text += this.getOneSpaces(3) + comment.name + "\n";      
    });
  }
  // フリーコメント
  if (_mealData.free_comment != null && _mealData.free_comment != "") {
    clipboard_text += this.getOneSpaces(3) + "フリーコメント：" + _mealData.free_comment + "\n";
  }

  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

export const clipboardDeathRegister = (order_data) => {
  let clipboard_text = "死亡日付：" + formatJapanDateSlash(order_data.death_date) + "\n";
  if(order_data.free_comment !== ""){
    clipboard_text += "フリーコメント："+ order_data.free_comment;
  }
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

export const clipboardDiagnosisComment = (comment) => {
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", comment);
  }
}

export const clipboardPatientDescriptionInfo = (order_data) => {
  let body1_title = "";
  let body2_title = "";
  switch (order_data.type) {
    case "past":
      body1_title = "既往歴";
      body2_title = "アレルギー";
      break;
    case "foodalergy":
      body1_title = "食物アレルギー";
      break;
    case "drugalergy":
      body1_title = "薬剤アレルギー";
      break;
    case "disabled":
      body1_title = "障害情報";
      break;
    case "vaccine":
      body1_title = "患者ワクチン情報";
      break;
    case "adl":
      body1_title = "ADL情報";
      break;
    case "infection":
      body1_title = "感染症";
      body2_title = "状態";
      break;
    case "alergy":
      body1_title = "一般アレルギー";
      body2_title = "状態";
      break;
    case "contraindication":
      body1_title = "禁忌";
      break;
    case "process_hospital":
      body1_title = "主訴";
      body2_title = "現病歴";
      break;
    case "inter_summary":
      body1_title = "臨床経過";
      body2_title = "治療方針";
      break;
    case "current_symptoms_on_admission":
      body1_title = "入院時身体所見";
      body2_title = "入院時検査所見";
      break;
  }
  let clipboard_text = body1_title + "：" + "\n";
  clipboard_text += order_data.body_1 + "\n";
  if(body2_title !== ""){
    clipboard_text += body2_title + "：" + "\n";
    if(order_data.type === "current_symptoms_on_admission" && order_data.optional_json !== undefined){
      if(order_data.optional_json.tpha != 0){
        clipboard_text += getOneSpaces(3) + "TPHA：" + (order_data.optional_json.tpha == 1 ? "(+)": order_data.optional_json.tpha == 2 ? "(-)" : "(±)") + "\n";
      }
      if(order_data.optional_json.hbs_ag != 0){
        clipboard_text += getOneSpaces(3) + "HBs-Ag：" + (order_data.optional_json.hbs_ag == 1 ? "(+)": order_data.optional_json.hbs_ag == 2 ? "(-)" : "(±)") + "\n";
      }
      if(order_data.optional_json.hcv_Ab != 0){
        clipboard_text += getOneSpaces(3) + "HCV-Ab：" + (order_data.optional_json.hcv_Ab == 1 ? "(+)": order_data.optional_json.hcv_Ab == 2 ? "(-)" : "(±)") + "\n";
      }
      if(order_data.optional_json.hiv != 0){
        clipboard_text += getOneSpaces(3) + "HIV：" + (order_data.optional_json.hiv == 1 ? "(+)": order_data.optional_json.hiv == 2 ? "(-)" : "(±)") + "\n";
      }
    }
    if(order_data.type === "infection" || order_data.type === "alergy"){
      clipboard_text += ALLERGY_STATUS_ARRAY[parseInt(order_data.body_2)] + "\n";
    } else {
      clipboard_text += order_data.body_2 + "\n";
    }
  }
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

const getContinueDate=(continue_date)=>{
  let date_arr = [];
  continue_date.map(item=>{
    let date = item.date.split(" ")[0];
    if(date_arr[date] === undefined){
      date_arr[date] = [];
    }
    date_arr[date].push(item);
  });
  let date_html = [];
  Object.keys(date_arr).map(date=>{
    date_html.push(formatJapanDateSlash(date));
    date_arr[date].map(item=>{
      date_html.push(
        "・" + ((item.date.split(" ")[1] !== undefined ? formatTimeIE(item.date) : ""))
        + (item.done_result !== undefined ? (" 結果: " + item.done_result + item.result_suffix) : "")
        + ("　" + getStaffName(item.user_number))
      );
      if(item.done_comment !== undefined){
        date_html.push("　コメント:" + (item.done_comment));
      }
    });
  });
  return date_html;
}

export const clipboardInspection = (order_data) => {
  let clipboard_text = "";
  let right_msg = "";
  right_msg = order_data.inspection_DATETIME === "日未定" ? "[日未定]" : (formatJapanDateSlash(order_data.inspection_DATETIME) + ((order_data.reserve_time != undefined && order_data.reserve_time != "") ? " "+order_data.reserve_time : ""));
  clipboard_text += "検査日：" + right_msg + "\n";
  clipboard_text += "保険：" + getInsuranceName(order_data.insurance_name) + "\n";
  if (order_data.classification1_name !== undefined && order_data.classification1_name != null && order_data.classification1_name !== "") {
    clipboard_text += "検査種別：" + order_data.classification1_name + "\n";
  }
  if (order_data.classification2_name != undefined && order_data.classification2_name != "") {
    clipboard_text += "検査詳細：" + order_data.classification2_name + "\n";
  }
  if (order_data.inspection_type_name != undefined && order_data.inspection_type_name != "") {
    clipboard_text += "検査種別：" + order_data.inspection_type_name + "\n";
  }
  if (order_data.inspection_item_name != undefined && order_data.inspection_item_name != "") {
    clipboard_text += "検査項目：" + order_data.inspection_item_name + "\n";
  }
  if (order_data.endoscope_purpose_name != undefined && order_data.endoscope_purpose_name != "") {
    clipboard_text += "検査目的：" + order_data.endoscope_purpose_name + "\n";
  }
  if (order_data.inspection_purpose != undefined && order_data.inspection_purpose != null && order_data.inspection_purpose.length > 0) {
    if (order_data.inspection_purpose.length == 1) {
      clipboard_text += "検査目的：" + order_data.inspection_purpose[0].name + "\n";      
    } else {
      clipboard_text += "検査目的：" + "\n";
      order_data.inspection_purpose.map(item=>{
        clipboard_text += getOneSpaces(3) + item.name + "\n";
      });
    }
  }
  if (order_data.inspection_symptom != undefined && order_data.inspection_symptom != null && order_data.inspection_symptom.length > 0) {
    if (order_data.inspection_symptom.length == 1) {      
      clipboard_text += "現症：" + order_data.inspection_symptom[0].name + "\n";      
    } else {
      clipboard_text += "現症：" + "\n";
      order_data.inspection_symptom.map(item=>{
        clipboard_text += getOneSpaces(3) + item.name + "\n";
      })
    }
  }
  if (order_data.inspection_risk != undefined && order_data.inspection_risk != null && order_data.inspection_risk.length > 0) {
    if (order_data.inspection_risk.length == 1) {            
      clipboard_text += "冠危険因子：" + order_data.inspection_risk[0].name + "\n";      
    } else {
      clipboard_text += "冠危険因子：" + "\n";
      order_data.inspection_risk.map(item=>{
        clipboard_text += getOneSpaces(3) + item.name + "\n";
      })
    }
  }
  if (order_data.inspection_sick != undefined && order_data.inspection_sick != null && order_data.inspection_sick.length > 0) {
    if (order_data.inspection_sick.length == 1) {            
      clipboard_text += order_data.inspection_sick[0].title + "：" + order_data.inspection_sick[0].name + "\n";      
    } else {
      order_data.inspection_sick.map((item, index)=>{
        if (index == 0) {
          clipboard_text += item.title + "：" + "\n";
        }
        clipboard_text += getOneSpaces(3) + item.name + "\n";
      })
    }
  }
  if (order_data.inspection_request != undefined && order_data.inspection_request != null && order_data.inspection_request.length > 0) {
    if (order_data.inspection_request.length == 1) {            
      clipboard_text += order_data.inspection_request[0].title + "：" + order_data.inspection_request[0].name + "\n";      
    } else {
      order_data.inspection_request.map((item, index)=>{
        if (index == 0) {
          clipboard_text += item.title + "：" + "\n";
        }
        clipboard_text += getOneSpaces(3) + item.name + "\n";
      })
    }
  }
  if (order_data.is_anesthesia != undefined && order_data.is_anesthesia != null && order_data.is_anesthesia.length > 0) {
    if (order_data.is_anesthesia.length == 1) {            
      clipboard_text += order_data.is_anesthesia[0].title + "：" + order_data.is_anesthesia[0].name + "\n";      
    } else {
      order_data.is_anesthesia.map((item, index)=>{
        if (index == 0) {
          clipboard_text += item.title + "：" + "\n";
        }
        clipboard_text += getOneSpaces(3) + item.name + "\n";
      })
    }
  }
  if (order_data.is_sedation != undefined && order_data.is_sedation != null && order_data.is_sedation.length > 0) {
    if (order_data.is_sedation.length == 1) {            
      clipboard_text += order_data.is_sedation[0].title + "：" + order_data.is_sedation[0].name + "\n";      
    } else {
      order_data.is_sedation.map((item, index)=>{
        if (index == 0) {
          clipboard_text += item.title + "：" + "\n";
        }
        clipboard_text += getOneSpaces(3) + item.name + "\n";
      })
    }
  }
  if (order_data.inspection_movement != undefined && order_data.inspection_movement != null && order_data.inspection_movement.length > 0) {
    if (order_data.inspection_movement.length == 1) {                  
      clipboard_text += "患者移動形態：" + order_data.inspection_movement[0].name + "\n";      
    } else {
      clipboard_text += "患者移動形態：" + "\n";
      order_data.inspection_movement.map(item=>{
        clipboard_text += getOneSpaces(3) + item.name + "\n";
      })
    }
  }
  if ((order_data.done_height != undefined || (order_data.height != undefined && order_data.height != null && order_data.height != ""))) {
    clipboard_text += "身長：" + (order_data.done_height != undefined ? order_data.done_height :order_data.height) + "cm" + "\n";
  }
  if ((order_data.done_weight != undefined || (order_data.weight != undefined && order_data.weight != null && order_data.weight != ""))) {
    clipboard_text += "体重：" + (order_data.done_weight != undefined ? order_data.done_weight : order_data.weight) + "kg" + "\n";
  }
  if ((order_data.done_surface_area != undefined || (order_data.surface_area != undefined && order_data.surface_area != null && order_data.surface_area != ""))) {
    clipboard_text += "体表面積：" + (order_data.done_surface_area != undefined ? order_data.done_surface_area : order_data.surface_area) + "㎡" + "\n";
  }
  if (order_data.connection_date_title !== undefined) {
    clipboard_text += order_data.connection_date_title + "：" + formatJapanDateSlash(order_data.calculation_start_date) + "\n";
  }
  if (order_data.sick_name !== undefined && order_data.sick_name != null && order_data.sick_name != "") {
    clipboard_text += "臨床診断、病名：" + order_data.sick_name + "\n";
  }
  if (order_data.etc_comment !== undefined && order_data.etc_comment != null && order_data.etc_comment != "") {
    clipboard_text += "主訴、臨床経過、検査目的、コメント" + order_data.etc_comment + "\n";
  }
  if (order_data.special_presentation != undefined && order_data.special_presentation != "") {
    clipboard_text += "特殊指示：" + order_data.special_presentation + "\n";
  }
  if (order_data.count != undefined && order_data.count != "") {
    clipboard_text += (order_data.count_label !=''?order_data.count_label + "：":'') + (order_data.count + (order_data.count_suffix!=''?order_data.count_suffix:'')) + "\n";
  }
  if (((order_data.done_body_part !== undefined && order_data.done_body_part !== "") || (order_data.done_body_part === undefined && order_data.body_part !== undefined && order_data.body_part !== ""))) {
    clipboard_text += "部位指定コメント：" + (order_data.done_body_part !== undefined ? order_data.done_body_part : order_data.body_part) + "\n";
  }
  if (order_data.state == 2) {
    if (order_data.done_result !== undefined) {
      clipboard_text += "結果：" + (order_data.done_result + " " + order_data.result_suffix) + "\n";
    }
    if (order_data.done_comment != undefined && order_data.done_comment != null && order_data.done_comment != "") {
      clipboard_text += "実施コメント：" + order_data.done_comment + "\n";
    }
    if (order_data.details !== undefined) {
      order_data.details.map(detail=>{
        if (detail.item_id > 0){
          clipboard_text += getOneSpaces(3) + "・" + detail.name + (((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": "") + "\n";
          if (detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") {
            clipboard_text += getOneSpaces(3) + detail.value1 + detail.input_item1_unit + "\n";
          }
          if (detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") {
            clipboard_text += getOneSpaces(3) + detail.value2 + detail.input_item2_unit + "\n";
          }
        }
      })
    }
  }
  if (order_data.additions != undefined && Object.keys(order_data.additions).length > 0) {
    if (Object.keys(order_data.additions).length == 1) {                        
      clipboard_text += "追加指示等：";      
      Object.keys(order_data.additions).map(addition=>{
        clipboard_text += order_data.additions[addition].name + "\n";
      })
    } else {
      clipboard_text += "追加指示等：" + "\n";
      Object.keys(order_data.additions).map(addition=>{
        clipboard_text += getOneSpaces(3) + order_data.additions[addition].name + "\n";
      })
    }
  }
  if (order_data.start_date !== undefined) {
    clipboard_text += "開始日時：" + (formatJapanDateSlash(order_data.start_date) + " " + formatTimeIE(new Date((order_data.start_date).split('-').join('/')))) + "\n";
  }
  if (order_data.continue_date !== undefined) {
    clipboard_text += (getInspectionMasterInfo(order_data.inspection_id, 'performed_multiple_times_type') == 1 ? "実施情報" : "継続登録") + "：" + "\n";
    let html_continue_date = getContinueDate(order_data.continue_date);
    if(html_continue_date.length > 0){
      html_continue_date.map(item=>{
        clipboard_text += getOneSpaces(3) + item + "\n";
      });
    }
  }
  if (order_data.end_date !== undefined) {
    clipboard_text += "終了日時：" + (formatJapanDateSlash(order_data.end_date) + " " + formatTimeIE(new Date((order_data.end_date).split('-').join('/'))));
  }
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

export const clipboardDocument = (order_data) => {
  let clipboard_text = "";
  clipboard_text += "文書伝票：" + order_data.slip_name + "\n";
  clipboard_text += "書類名：" + order_data.name + "\n";
  if (order_data.scanner_title != undefined && order_data.scanner_title != null && order_data.scanner_title != "") {
    clipboard_text += "タイトル：" + order_data.scanner_title + "\n";
  }
  clipboard_text += "ファイルパス：" + order_data.file_path + "\n";
  if (order_data.free_comment !== "") {
    clipboard_text += "フリーコメント：" + order_data.free_comment + "\n";
  }
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

export const clipboardApplyDecision = (order_data) => {
  let clipboard_text = "";
  let left_msg = "";
  let right_msg = "";
  left_msg = order_data.hospital_type == "in_apply" ? "入院予定日時" : "入院日時";
  if (order_data.hospital_type == "in_apply") {
    right_msg = formatJapanDateSlash(order_data.desired_hospitalization_date) + (
      (order_data.desired_hospitalization_date.split(' ')[1] == undefined) ? "" :
        (" " + formatTimeIE(order_data.desired_hospitalization_date.split('-').join('/')))
    );
  } else {
    right_msg = formatJapanDateSlash(order_data.date_and_time_of_hospitalization)
      + " " + formatTimeIE(order_data.date_and_time_of_hospitalization.split('-').join('/'));
  }
  clipboard_text += left_msg + "：" + right_msg + "\n";
  clipboard_text += "入院病名：" + order_data.disease_name + "\n";
  if (order_data.purpose_array_names != undefined && order_data.purpose_array_names.length > 0) {
    clipboard_text += "入院目的：" + "\n";
    order_data.purpose_array_names.map(name=>{
      clipboard_text += getOneSpaces(3) + name + "\n";
    })
  }
  if (order_data.hospitalization_purpose_comment != undefined && order_data.hospitalization_purpose_comment != "") {
    clipboard_text += "入院目的フリーコメント：" + order_data.hospitalization_purpose_comment + "\n";
  }
  if (order_data.hospital_type == "in_apply") {
    if (order_data.treatment_plan_name != undefined && order_data.treatment_plan_name != "") {
      clipboard_text += "治療計画：" + order_data.treatment_plan_name + "\n";
    }
    if (order_data.treatment_plan_comments != undefined && order_data.treatment_plan_comments != "") {
      clipboard_text += "治療計画フリーコメント：" + order_data.treatment_plan_comments + "\n";
    }
  } else {
    if (order_data.discharge_plan_name != undefined && order_data.discharge_plan_name != "") {
      clipboard_text += "退院計画：" + order_data.discharge_plan_name + "\n";
    }
    if (order_data.discharge_plan_comment != undefined && order_data.discharge_plan_comment != "") {
      clipboard_text += "退院計画フリーコメント：" + order_data.discharge_plan_comment + "\n";
    }
  }
  if (order_data.path_name != undefined && order_data.path_name != "") {
    clipboard_text += "パス：" + order_data.discharge_plan_comment + "\n";
  }
  if (order_data.surgery_day != null) {
    clipboard_text += "手術日：" + formatJapanDateSlash(order_data.surgery_day) + "\n";
  }
  if (order_data.surgery_name != null && order_data.surgery_name != "") {
    clipboard_text += "手術名：" + order_data.surgery_name + "\n";
  }
  if (order_data.treatment_day != null) {
    clipboard_text += "治療日：" + formatJapanDateSlash(order_data.treatment_day) + "\n";
  }
  if (order_data.treatment_name != null && order_data.treatment_name != "") {
    clipboard_text += "治療名：" + order_data.treatment_name + "\n";
  }
  if (order_data.inspection_date != null) {
    clipboard_text += "検査日：" + formatJapanDateSlash(order_data.inspection_date) + "\n";
  }
  if (order_data.inspection_name != null &&order_data.inspection_name != "") {
    clipboard_text += "検査名：" + order_data.inspection_name + "\n";
  }
  if (order_data.estimated_hospitalization_period_name != undefined && order_data.estimated_hospitalization_period_name != "") {
    clipboard_text += "推定入院期間：" + order_data.estimated_hospitalization_period_name + "\n";
  }
  if (order_data.urgency_name != undefined && order_data.urgency_name != "") {
    clipboard_text += "緊急度：" + order_data.urgency_name + "\n";
  }
  if (order_data.rest_name != undefined && order_data.rest_name != "") {
    clipboard_text += "安静度：" + order_data.rest_name + "\n";
  }
  if (order_data.desired_room_type_name != undefined && order_data.desired_room_type_name != "") {
    clipboard_text += "希望部屋種：" + order_data.desired_room_type_name + "\n";
  }
  clipboard_text += "診療科：" + order_data.department_name + "\n";
  if (order_data.hospital_type == "in_decision") {
    clipboard_text += "病棟：" + order_data.ward_name + "\n";
    clipboard_text += "病室：" + order_data.room_name + "\n";
    clipboard_text += "病床：" + (order_data.hospital_bed_id == null ? "未指定" : order_data.bed_name) + "\n";
    if (order_data.emergency_admission_comments != undefined && order_data.emergency_admission_comments != "") {
      clipboard_text += "緊急入院時コメント：" + order_data.emergency_admission_comments + "\n";
    }
  } else {
    clipboard_text += "第1病棟：" + order_data.ward_name + "\n";
    if (order_data.second_ward_name != undefined && order_data.second_ward_name != "") {
      clipboard_text += "第2病棟：" + order_data.second_ward_name + "\n";
    }
    if (order_data.free_comment != undefined && order_data.free_comment != "") {
      clipboard_text += "フリーコメント：" + order_data.free_comment + "\n";
    }
  }
  if (order_data.bulletin_board_reference_flag == 1) {
    clipboard_text += "掲示板参照：" + "あり" + "\n";
  }
  clipboard_text += "主担当医：" + order_data.main_doctor_name + "\n";
  if (order_data.doctor_list_names != undefined && order_data.doctor_list_names.length > 0) {
    clipboard_text += "担当医：" + "\n";
    order_data.doctor_list_names.map(doctor_name=>{
      clipboard_text += getOneSpaces(3) + doctor_name + "\n";
    });
  }
  if (order_data.nurse_id_in_charge_name != undefined && order_data.nurse_id_in_charge_name != "") {
    clipboard_text += "担当看護師：" + order_data.nurse_id_in_charge_name + "\n";
  }
  if (order_data.deputy_nurse_name != undefined && order_data.deputy_nurse_name != "") {
    clipboard_text += "副担当看護師：" + order_data.deputy_nurse_name + "\n";
  }
  if (order_data.hospital_type != "in_apply") {
    if (order_data.route_name != undefined) {
      clipboard_text += "入院経路：" + order_data.route_name + "\n";
    }
    if (order_data.identification_name != undefined) {
      clipboard_text += "入院識別：" + order_data.identification_name + "\n";
    }
  }
  clipboard_text += "食事開始日：" + (formatJapanDateSlash(order_data.start_date) + (order_data.start_time_classification_name != undefined ? (" ("+ order_data.start_time_classification_name +") から開始") : "")) + "\n";
  if (order_data.food_type_name != undefined && order_data.food_type_name != "") {
    clipboard_text += "食事：" + order_data.food_type_name + "\n";
  }
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

export const clipboardChangeResponsibility = (order_data) => {
  let clipboard_text = "";
  clipboard_text += "変更日" + "：" + ((order_data.moving_day != undefined && order_data.moving_day != "") ? formatJapanDateSlash(order_data.moving_day) : "") + "\n";
  clipboard_text += "診療科" + "：" + ((order_data.prev_department_id !== undefined && order_data.prev_department_id != order_data.department_id) ? (order_data.prev_department_name + " → ") : "") + order_data.department_name + "\n";
  clipboard_text += "主担当" + "：" + ((order_data.prev_main_doctor !== undefined && order_data.prev_main_doctor != order_data.mainDoctor) ? (order_data.prev_main_doctor_name + " → ") : "") + order_data.mainDoctor_name + "\n";
  if (order_data.doctors_name.length > 0) {
    clipboard_text += "担当医" + "：" + "\n";
    order_data.doctors_name.map(name=>{
      clipboard_text += getOneSpaces(3) + name + "\n" ;
    });
  }
  if (order_data.nurse_id_in_charge_name != "") {
    clipboard_text += "担当看護師" + "：" + order_data.nurse_id_in_charge_name + "\n";
  }
  if (order_data.deputy_nurse_name != ""){
    clipboard_text += "副担当看護師" + "：" + order_data.deputy_nurse_name + "\n";
  }
  if (order_data.comment) {
    clipboard_text += "フリーコメント" + "：" + order_data.comment + "\n";
  }
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

export const clipboardHospitalDone = (order_data, from=null) => {
  let clipboard_text = "";
  if(from == "right_box"){
    clipboard_text += "実施日時" + "：" + formatJapanDateSlash(order_data.date_and_time_of_hospitalization.split(" ")[0])+ " " +order_data.date_and_time_of_hospitalization.split(" ")[1] + "\n";
  } else {
    clipboard_text += "実施日時" + "：" + formatJapanDateSlash(order_data.treat_date.split(" ")[0])+" "+order_data.treat_date.split(" ")[1] + "\n";
  }
  clipboard_text += "病棟" + "：" + order_data.ward_name + "\n";
  clipboard_text += "病室" + "：" + order_data.room_name + "\n";
  clipboard_text += "ベッド" + "：" + order_data.bed_name + "\n";
  clipboard_text += "配膳開始" + "：" + formatJapanDateSlash(order_data.start_date) +" （"+order_data.start_time_name+"）より開始" + "\n";
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

export const clipboardHospitalInOut = (order_data) => {
  let clipboard_text = "";
  clipboard_text += "実施日時" + "：" + formatJapanDateSlash(order_data.treat_date.split(" ")[0])+" "+order_data.treat_date.split(" ")[1] + "\n";
  if (order_data.going_out_name !== undefined) {
    clipboard_text += "外出泊理由" + "：" + order_data.going_out_name + "\n";
    clipboard_text += "配膳停止" + "：" + formatJapanDateSlash(order_data.stop_serving_date) +" （"+order_data.stop_serving_time_name+"）より停止" + "\n";
  }
  clipboard_text += "配膳開始" + "：" + formatJapanDateSlash(order_data.start_date)+" （"+order_data.start_time_name+"）より開始" + "\n";
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

export const clipboardDischarge = (order_data, type) => {
  let clipboard_text = "";
  let left_msg = "";
  let right_msg = "";
  left_msg = type === 'done' ? "実施日時" : (type === 'decision' ? "退院日時" : "退院日");
  if(type === 'permit'){
    right_msg = formatJapanDateSlash(order_data.discharge_date)
  } else {
    if(order_data.treat_date !== undefined){
      right_msg = formatJapanDateSlash(order_data.treat_date.split(" ")[0])+" "+order_data.treat_date.split(" ")[1];
    } else {
      right_msg = formatJapanDateSlash(order_data.moving_day.split(" ")[0])+" "+order_data.moving_day.split(" ")[1];
    }
  }
  clipboard_text += left_msg + "：" + right_msg + "\n";
  if (type !== 'permit') {
    clipboard_text += "配膳停止：" + (formatJapanDateSlash(order_data.start_date) +" （"+order_data.start_time_name+"）") + "より停止" + "\n";
  }
  clipboard_text += "転帰理由" + "：" + order_data.outcome_reason_name + "\n";
  clipboard_text += "退院経路" + "：" + order_data.discharge_route_name + "\n";
  if (type !== 'permit' && order_data.discharge_free_comment !== "") {
    clipboard_text += "フリーコメント" + "：" + order_data.discharge_free_comment;
  }
  if (type === 'permit' && order_data.free_comment !== undefined && order_data.free_comment != null && order_data.free_comment !== "") {
    clipboard_text += "フリーコメント" + "：" + order_data.free_comment;
  }
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

export const clipboardHospitalMove = (order_data) => {
  let clipboard_text = "";
  clipboard_text += "実施日時：" + formatJapanDateSlash(order_data.treat_date.split(" ")[0])+" "+order_data.treat_date.split(" ")[1] + "\n";
  if(order_data.department_name !== undefined){
    clipboard_text += "診療科：" + order_data.ward_name + "\n";
  }
  clipboard_text += "病棟：" + order_data.ward_name + "\n";
  clipboard_text += "病室：" + order_data.room_name + "\n";
  clipboard_text += "ベッド：" + order_data.bed_name;
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

export const clipboardGuidance = (order_data) => {
  let clipboard_text = "";
  clipboard_text += "日付：" + (order_data.treat_date === "" ? "" : formatJapanDateSlash(order_data.treat_date)) + "\n";
  clipboard_text += "保険：" + getInsuranceName(order_data.insurance_name) + "\n";
  if (order_data.karte_description_name !== undefined && order_data.karte_description_name != null && order_data.karte_description_name !="") {
    clipboard_text += "カルテ記述名称：" + order_data.karte_description_name + "\n";
  }
  if (order_data.additions !== undefined && order_data.additions != null && Object.keys(order_data.additions).length > 0) {
    clipboard_text += "追加指示等" + "\n";
    Object.keys(order_data.additions).map(addition=>{
      clipboard_text += getOneSpaces(3) + order_data.additions[addition].name + "\n";
    })
  }
  if (order_data.karte_text_data !== undefined && order_data.karte_text_data != null && order_data.karte_text_data.length > 0) {
    clipboard_text += "カルテ記述内容" + "\n";
    order_data.karte_text_data.map(karte_text=>{
      clipboard_text += getOneSpaces(3) + karte_text.karte_text + "\n";
    })
  }
  if (order_data.comment !== undefined && order_data.comment != null && order_data.comment != "") {
    clipboard_text += "コメント：" + order_data.comment + "\n";
  }
  if (order_data.details !== undefined &&
    order_data.details != null &&
    order_data.details.length>0 &&
    order_data.details.findIndex(x=>x.is_enabled==1||x.is_enabled==undefined) > -1) {
    order_data.details.map(detail=>{
      if(detail.is_enabled === undefined || (detail.is_enabled !== undefined && detail.is_enabled == 1)){
        clipboard_text += getOneSpaces(3) + "・" + detail.item_name;
        if ((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null)) {
          clipboard_text += "：";
        }
        if (detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") {
          clipboard_text += (detail.value1_format !== undefined) ? detail.value1_format : detail.value1;
        }
        if (detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") {
          clipboard_text += (detail.value2_format !== undefined) ? detail.value2_format : detail.value2
        }
        clipboard_text += "\n";
      }
    })
  }
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

export const clipboardMedicalExaminationRecord = () => {
  let clipboard_text = "診療コメント：" + "会計あり";
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}

export const clipboardHospitalDischargeGuidanceReport = (order_data) => {
  let clipboard_text = "";
  clipboard_text += "日時：" + (formatJapanDateSlash(order_data.start_date)+" "+order_data.start_time+'~'+order_data.end_time) + "\n";
  clipboard_text += "記載者：" + (order_data.write_staff_name != undefined ? order_data.write_staff_name:"" ) + "\n";
  if (order_data.hospital_doctor_name != undefined) {
    clipboard_text += "【院内】医師：" + order_data.hospital_doctor_name + "\n";
  }
  if (order_data.nurse_name != undefined) {
    clipboard_text += "【院内】看護師：" + order_data.nurse_name + "\n";
  }
  if (order_data.discharge_support_nurse_name != undefined) {
    clipboard_text += "【院内】退院支援看護師：" + order_data.discharge_support_nurse_name + "\n";
  }
  if (order_data.msw_text != undefined) {
    clipboard_text += "【院内】ＭＳＷ：" + order_data.msw_text + "\n";
  }
  if (order_data.hospital_other_text != undefined) {
    clipboard_text += "【院内】その他：" + order_data.hospital_other_text + "\n";
  }
  if (order_data.instructed_nurse_name != undefined) {
    clipboard_text += "【院外】在宅医or指示を受けた看護師：" + order_data.instructed_nurse_name + "\n";
  }
  if (order_data.visit_nurse_name != undefined) {
    clipboard_text += "【院外】訪問看護師：" + order_data.visit_nurse_name + "\n";
  }
  if (order_data.care_manager_name != undefined) {
    clipboard_text += "【院外】ケアマネージャー：" + order_data.care_manager_name + "\n";
  }
  if (order_data.outside_hospital_other_text != undefined) {
    clipboard_text += "【院外】その他：" + order_data.outside_hospital_other_text + "\n";
  }
  if (order_data.recheck != undefined) {
    clipboard_text += "病状・病期の説明と患者・家族の理解の再確認：" + order_data.recheck + "\n";
  }
  if (order_data.check_inject_names != undefined && order_data.check_inject_names.length > 0) {
    clipboard_text += "【薬・注射】：";
    order_data.check_inject_names.map((name, index)=>{
      if (index == 0) {
        clipboard_text += name;
      } else {
        clipboard_text += "、" + name;
      }
    });
    clipboard_text += "\n";
  }
  if (order_data.recheck != undefined) {
    clipboard_text += "【医療機器】：";
    order_data.check_equipment_names.map((name, index)=>{
      if (index == 0) {
        clipboard_text +=  name;
      } else {
        clipboard_text += "、" + name;
      }
    });
    clipboard_text += "\n";
  }
  if (((order_data.check_treat_names != undefined && order_data.check_treat_names.length > 0) || order_data.treat_check_other_text != undefined)) {
    clipboard_text += "【医療処置】：";
    if (order_data.check_treat_names != undefined && order_data.check_treat_names.length > 0) {
      order_data.check_treat_names.map((name, index)=> {
        if (index == 0) {
          clipboard_text += name;
        } else {
          clipboard_text += "、" + name;
        }
      });
      clipboard_text += "\n";
    }
  }
  if (order_data.medicine_detail != undefined) {
    clipboard_text += "詳細：" + order_data.medicine_detail + "\n";
  }
  if (order_data.need_medicine != undefined) {
    clipboard_text += "必要な医薬物品（製品名）・調達先：" + order_data.need_medicine + "\n";
  }
  if (((order_data.check_body_assistance_names != undefined && order_data.check_body_assistance_names.length > 0) || order_data.body_assistance_check_other_text != undefined)) {
    clipboard_text += "身体援助：";
    if (order_data.check_body_assistance_names != undefined && order_data.check_body_assistance_names.length > 0) {
      order_data.check_body_assistance_names.map((name, index)=> {
        if (index == 0) {
          clipboard_text += name;
        } else {
          clipboard_text += "、" + name;
        }
      });
      clipboard_text += "\n";
    }
    if (order_data.body_assistance_check_other_text != undefined) {
      clipboard_text += (order_data.check_body_assistance_names != undefined && order_data.check_body_assistance_names.length > 0) ? "、" : "";
      clipboard_text += order_data.body_assistance_check_other_text;
      clipboard_text += "\n";
    }
  }
  if (order_data.future_treatment_issue != undefined) {
    clipboard_text += "今後の治療課題・生活課題：" + order_data.future_treatment_issue + "\n";
  }
  clipboard_text += "【退院後(一ヶ月以内）病院看護師の訪問指導】：" + (order_data.nurse_visit_guidance == 1 ? "有" : "無") + "\n";
  clipboard_text += "【退院直後・特別指示書での訪問看護の必要性】：" + (order_data.visit_nurse_need == 1 ? "有" : "無") + "\n";
  if (order_data.discharge_date != undefined) {
    clipboard_text += "退院予定日：" + formatJapanDateSlash(order_data.discharge_date) + "\n";
  }
  if (order_data.move_tool != undefined) {
    clipboard_text += "移送手段：" + order_data.move_tool + "\n";
  }
  if (order_data.nurse_taxi_name != undefined) {
    clipboard_text += "介護タクシー：" + order_data.nurse_taxi_name + "\n";
  }
  if (order_data.discharge_after_doctor_name != undefined) {
    clipboard_text += "退院後の主治医：" + order_data.discharge_after_doctor_name + "\n";
  }
  if (order_data.home_doctor_name != undefined) {
    clipboard_text += "在宅医：" + order_data.home_doctor_name + "\n";
  }
  if (order_data.visit_nurse_period_first != undefined) {
    clipboard_text += "【訪問看護指示書】：" + order_data.visit_nurse_period_first+"~"+order_data.visit_nurse_period_second + "ヶ月" + "\n";
  }
  if ((order_data.general_hospital_check == 1 || order_data.body_assistance_check_other_text != undefined)) {
    clipboard_text += "【緊急時対応】：" + (order_data.general_hospital_check == 1 ? "県立総合病院" : "") + (order_data.body_assistance_check_other_text != undefined ?
      (order_data.general_hospital_check == 1 ? "、"+order_data.body_assistance_check_other_text : order_data.body_assistance_check_other_text) : "") + "\n";
  }
  if (order_data.send_information == 1) {
    clipboard_text += "病院⇔ステーション：" + "１週間～１ヶ月の間に、別紙にて情報の送信をお願いいたします" + "\n";
  }
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
  
}

const getDoneTimes = (_done_times=null) => {
  if (_done_times == null || _done_times.length < 1) return "";
  let result = "";
  _done_times.map((item, index)=>{
    result += ((index+1) + "回目 " + (item != "" ? item : "未定") + (index == (_done_times.length - 1) ? "":"、"));
  });
  return result;
}

export const clipboardTreatment = (order_data) => {
  let clipboard_text = "";
  clipboard_text += "処置日：" + (order_data.header.date == undefined || order_data.header.date == null || order_data.header.date == "" ? "" : ((order_data.header.start_time === "" || order_data.header.start_time === null) ? formatJapanDateSlash(order_data.header.date) : formatJapanDateSlash(order_data.header.date)+"  "+order_data.header.start_time)) + "\n";
  clipboard_text += "保険：" + getInsuranceName(order_data.header.insurance_name) + "\n";
  order_data.detail.map((item)=>{
    if (item.classification_name != undefined && item.classification_name != "") {
      clipboard_text += "分類：" + item.classification_name + "\n";
    }
    if (item.practice_name != undefined && item.practice_name != "") {
      clipboard_text += "行為名：" + item.practice_name + "\n";
    }
    if (item.request_name != undefined && item.request_name != "") {
      clipboard_text += "請求情報：" + item.request_name + "\n";
    }
    if (item.position_name != undefined && item.position_name != "") {
      clipboard_text += "部位：" + item.position_name + "\n";
    }
    if (item.side_name != undefined && item.side_name != "") {
      clipboard_text += "左右：" + item.side_name + "\n";
    }
    if (item.barcode != undefined && item.barcode != "") {
      clipboard_text += "バーコード：" + item.barcode + "\n";
    }
    if (item.surface_data != undefined && item.surface_data.length > 0) {
      clipboard_text += "面積：" + "\n";
      if (item.surface_data.length > 0) {
        item.surface_data.map(sub_item=> {
          clipboard_text += getOneSpaces(3);
          clipboard_text += (sub_item.body_part != "" ? sub_item.body_part + "：" : "");
          clipboard_text += sub_item.x_value + "cm";
          clipboard_text += "×";
          clipboard_text += sub_item.y_value + "cm";
          clipboard_text += "=";
          clipboard_text += sub_item.total_x_y + "㎠";
          clipboard_text += "\n";
        })
      }
      clipboard_text += "合計：" + item.total_surface + "㎠" + "\n";
    }
    if ((item.treat_detail_item !== undefined && item.treat_detail_item.length > 0)) {
      clipboard_text += "個別指示：" + "\n";
      item.treat_detail_item.map(detail=>{
        let oxygen_data = detail['oxygen_data'] !== undefined && detail['oxygen_data'] != null ? JSON.parse(detail['oxygen_data']) : null;
        clipboard_text += getOneSpaces(3) + "・" + detail.item_name +"：" + detail.count;
        if ((detail.unit_name !== '' || (detail.main_unit != null && detail.main_unit !== ''))) {
          clipboard_text += (detail.unit_name !== '' ? detail.unit_name : detail.main_unit);
        }
        clipboard_text += "\n";
        if (oxygen_data != null && oxygen_data.length > 0) {
          oxygen_data.map((oxygen_item, oxygen_index)=>{
            let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
            if (oxygen_index > 0 && oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
            clipboard_text += getOneSpaces(3) + oxygen_inhaler_name + (formatTimeIE(oxygen_item.start_time) + "~" + formatTimeIE(oxygen_item.end_time));
            if (oxygen_item.oxygen_flow !== undefined && oxygen_item.oxygen_flow != "") {
              clipboard_text += oxygen_item.oxygen_flow + "L/分";
            }
            if (oxygen_item.fio2_value !== undefined && oxygen_item.fio2_value != "") {
              clipboard_text += (oxygen_item.fio2_value * 100) + "%";
            }
          })
          clipboard_text += "\n";
        }
        if (detail.lot !== undefined && detail.lot != null && detail.lot !== '') {
          clipboard_text += getOneSpaces(3) + "ロット：" + detail.lot + "\n";
        }
        if (detail.comment !== undefined && detail.comment != null && detail.comment !== '') {
          clipboard_text += getOneSpaces(3) + "フリーコメント：" + detail.comment + "\n";
        }
      })
    }
    if (item.start_date !== undefined && item.start_date !== "") {
      clipboard_text += "開始日：" + formatJapanDateSlash(item.start_date) + "\n";
    }
    if (item.end_date !== undefined) {
      clipboard_text += "終了日：" + formatJapanDateSlash(item.end_date) + "\n";
    }
    if (((item.treat_done_info !== undefined && item.treat_done_info.length > 0) || (item.done_numbers !== undefined && Object.keys(item.done_numbers).length > 0))) {
      clipboard_text += "実施情報：" + "\n";
      if (item.done_numbers !== undefined && Object.keys(item.done_numbers).length > 0) {
        Object.keys(item.done_numbers).map(done_index=>{
          let done_item = item.done_numbers[done_index];
          clipboard_text += getOneSpaces(3) + formatJapanDateSlash(done_index) + "\n";
          done_item.map(sub_item=>{
            clipboard_text += getOneSpaces(3) + "・" + (sub_item.completed_at !== undefined && sub_item.completed_at !== "" ? sub_item.completed_at.substr(11, 5) : "") + " " + (sub_item.completed_by !== undefined && sub_item.completed_by != "" && getStaffName(sub_item.completed_by) !== "" ? getStaffName(sub_item.completed_by):"") + " " + (sub_item.done_comment !== undefined ? sub_item.done_comment : "") + "\n";
          })
        })
      }
      if (item.treat_done_info !== undefined && item.treat_done_info.length > 0) {
        item.treat_done_info.map(detail=>{
          let oxygen_data = detail['oxygen_data'] !== undefined && detail['oxygen_data'] != null ? JSON.parse(detail['oxygen_data']) : null;
          clipboard_text += getOneSpaces(3) + "・" + detail.item_name + "：" + detail.count;
          if ((detail.unit_name !== '' || (detail.main_unit != null && detail.main_unit !== ''))) {
            clipboard_text += (detail.unit_name !== '' ? detail.unit_name : detail.main_unit) + "\n";
          }
          if (oxygen_data != null && oxygen_data.length > 0) {
            oxygen_data.map((oxygen_item, oxygen_index)=>{
              let oxygen_inhaler_name = oxygen_item.oxygen_inhaler_name !== undefined ? oxygen_item.oxygen_inhaler_name : "";
              if (oxygen_index > 0 && oxygen_data[oxygen_index - 1].oxygen_inhaler_name == oxygen_item.oxygen_inhaler_name) oxygen_inhaler_name = "";
              clipboard_text += getOneSpaces(3) + oxygen_inhaler_name + " " + formatTimeIE(oxygen_item.start_time) + "~" + formatTimeIE(oxygen_item.end_time);
              if (oxygen_item.oxygen_flow !== undefined && oxygen_item.oxygen_flow != "") {
                clipboard_text += oxygen_item.oxygen_flow + "L/分";
              }
              if (oxygen_item.fio2_value !== undefined && oxygen_item.fio2_value != "") {
                clipboard_text += (oxygen_item.fio2_value * 100) + "%";
              }
            })
            clipboard_text += "\n";
          }
          if (detail.lot !== undefined && detail.lot != null && detail.lot !== '') {
            clipboard_text += getOneSpaces(3) + "ロット：" + detail.lot + "\n";
          }
          if (detail.lot !== undefined && detail.lot != null && detail.lot !== '') {
            clipboard_text += getOneSpaces(3) + "フリーコメント：" + detail.comment + "\n";
          }
        })
      }
    }
    if (item.comment !== undefined && item.comment !== "") {
      clipboard_text += "コメント：" + item.comment + "\n";
    }
    if (item.done_comment !== undefined) {
      clipboard_text += "実施コメント：" + item.done_comment + "\n";
    }
    if (item.administrate_period != undefined && item.administrate_period != null) {
      clipboard_text += "処置期間：" + "\n";
      clipboard_text += getOneSpaces(3) + (item.administrate_period.days != undefined && item.administrate_period.days > 0 ? item.administrate_period.days+"日分":"") + "\n";
      clipboard_text += getOneSpaces(3) + ("1日" + item.administrate_period.done_count + "回 : " + getDoneTimes(item.administrate_period.done_times)) + "\n";
      clipboard_text += getOneSpaces(3) + ("投与期間 : " + formatJapanDateSlash(item.administrate_period.period_start_date) + "～" + formatJapanDateSlash(item.administrate_period.period_end_date)) + "\n";
      if (item.administrate_period.period_type == 0 && item.administrate_period.period_category != null) {
        clipboard_text += getOneSpaces(3) + "間隔 : " + (item.administrate_period.period_category == 0 ? "日":item.administrate_period.period_category == 1 ? "週" : "月") + "\n";
      }
      if (item.administrate_period.period_type == 1 && item.administrate_period.period_week_days.length > 0) {
        clipboard_text += getOneSpaces(3) + "曜日 : " + getWeekNamesBySymbol(item.administrate_period.period_week_days) + "\n";
      }
      if (item.administrate_period.start_count != undefined && item.administrate_period.done_days != undefined && ( item.administrate_period.start_count != 1 || item.administrate_period.end_count != item.administrate_period.done_count)) {
        clipboard_text += getOneSpaces(3) + "初回 " + formatJapanDateSlash(item.administrate_period.done_days[0]) + "の" + item.administrate_period.start_count + "回目から" + "\n";
      }
    }
  })
  if (order_data.item_details !== undefined && order_data.item_details.length>0) {
    order_data.item_details.map(detail=>{
      clipboard_text += getOneSpaces(3) + detail.item_name + "\n";
      clipboard_text += (((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": "");
      if ((detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "")) {
        clipboard_text += getOneSpaces(3) + (((detail.value1_format !== undefined) ? detail.value1_format : detail.value1) + (detail.unit_name1 != undefined ? detail.unit_name1 : "")) + "\n";
      }
      if ((detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "")) {
        clipboard_text += getOneSpaces(3) + (((detail.value2_format !== undefined) ? detail.value2_format : detail.value2) + (detail.unit_name2 != undefined ? detail.unit_name2 : "")) + "\n";
      }
    })
  }
  if (order_data.additions != undefined && Object.keys(order_data.additions).length > 0) {
    clipboard_text += "追加指示等：" + "\n";
    Object.keys(order_data.additions).map(addition=>{
      clipboard_text += getOneSpaces(3) + order_data.additions[addition].name + "\n";
    })
  }
  if (window.clipboardData) {
    window.clipboardData.setData ("Text", clipboard_text);
  }
}