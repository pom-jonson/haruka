import {  
  formatJapanDateSlash,
  getWeekNamesBySymbol,
  formatDateLine
} from "~/helpers/date";

import {
  getPeriodInjectionRpDoneStatus,  
} from "~/helpers/constants";

export default function(_injectionData, _from) {
  let clipboard_text = "";    
    let loop_obj = _injectionData;
    if (_from == "middle") {
      loop_obj = _injectionData.data.order_data;
    } else if(_from == "right") {
      loop_obj = _injectionData;
    } else if(_from == "right_del" || _from == "right_rp_del") {
      loop_obj = _injectionData.order_data;
    }

    let map_obj = _from == "middle" || _from == "right_del" || _from == "right_rp_del" ?  loop_obj.order_data : loop_obj.injectData;
    map_obj.map((rp_item, rp_index)=>{            
      let usage_obj = _from == "middle" || _from == "right_del" || _from == "right_rp_del" ?  rp_item.usage_name : rp_item.usageName;
      if (usage_obj) {        
        if (rp_index < 9) {
          if (rp_index == 0) {
            clipboard_text += " " + (rp_index + 1) + ") ";
          } else {
            clipboard_text += " " + (rp_index + 1) + ") ";
          }
        } else {
          clipboard_text += (rp_index + 1) + ") ";              
        }
        
        if (usage_obj) {
          clipboard_text += "手技：" + usage_obj + "\n";
        }

        // 追加用法コメント
        if (rp_item.usage_remarks_comment) {
          rp_item.usage_remarks_comment.map(comment => {          
            clipboard_text += this.getOneSpaces(3) + comment + "\n";
          })
        }

        let medicines_obj = _from == "middle" || _from == "right_del" || _from == "right_rp_del" ?  rp_item.med : rp_item.medicines;

        if (medicines_obj.length > 0) {
          medicines_obj.map(med_item=>{
            clipboard_text += this.getOneSpaces(2) + (_from == "middle" || _from == "right_del" || _from == "right_rp_del" ? med_item.item_name : med_item.medicineName) + this.getOneSpaces(3) + med_item.amount + med_item.unit + "\n";                              

            // 薬剤コメント
            if (med_item.free_comment && med_item.free_comment.length > 0) {
              med_item.free_comment.map(comment => {
                clipboard_text += this.getOneSpaces(3) + comment + "\n";              
              })
            }
          });
        }                               

        // 投与期間
        if (rp_item.administrate_period != undefined && rp_item.administrate_period != null) {
          clipboard_text += this.getOneSpaces(3) + "1日" + rp_item.administrate_period.done_count + "回：" + getInjectionDoneTimes(rp_item.administrate_period.done_times) + "\n";
          clipboard_text += this.getOneSpaces(3) + "投与期間：" + formatJapanDateSlash(rp_item.administrate_period.period_start_date) + "～" + formatJapanDateSlash(rp_item.administrate_period.period_end_date);
          if (rp_item.administrate_period.days != undefined && rp_item.administrate_period.days > 0) {
            clipboard_text += "　" + rp_item.administrate_period.days+"日分";
          }
          clipboard_text += "\n";
          if (rp_item.administrate_period.period_type == 0 && rp_item.administrate_period.period_category != null) {
            clipboard_text += this.getOneSpaces(3) + "間隔：";
            clipboard_text += rp_item.administrate_period.period_category == 0 ? "日":rp_item.administrate_period.period_category == 1 ? "週" : "月";
            clipboard_text += "\n";
          }
          if (rp_item.administrate_period.period_type == 1 && rp_item.administrate_period.period_week_days.length > 0) {
            clipboard_text += this.getOneSpaces(3) + "曜日：" + getWeekNamesBySymbol(rp_item.administrate_period.period_week_days) + "\n";
          }
          if (rp_item.administrate_period.start_count != undefined && rp_item.administrate_period.done_days != undefined && ( rp_item.administrate_period.start_count != 1 || rp_item.administrate_period.end_count != rp_item.administrate_period.done_count)) {
            clipboard_text += this.getOneSpaces(3) + "初回 " + formatJapanDateSlash(rp_item.administrate_period.done_days[0]) + "の" + rp_item.administrate_period.start_count + "回目から" + "\n";
            clipboard_text += this.getOneSpaces(3) + "最終 " + formatJapanDateSlash(rp_item.administrate_period.done_days[rp_item.administrate_period.done_days.length - 1]) + "の" + rp_item.administrate_period.end_count + "回目まで" + "\n";
          }
        }

        if (rp_item.stop_date != undefined && rp_item.stop_date != null && rp_item.stop_date != "" && loop_obj.is_completed == 4) {
          clipboard_text += this.getOneSpaces(3) + "中止日：" + formatJapanDateSlash(rp_item.stop_date) + "\n";
          clipboard_text += this.getOneSpaces(3) + "中止回数目：" + rp_item.stop_count + "\n";
        }      

        // 保険
        if (rp_item.insurance_type != undefined) {
          clipboard_text += this.getOneSpaces(3) + "保険：" + this.getInsurance(rp_item.insurance_type) + "\n";
        }

        // 部位/補足
        if (rp_item.body_part != undefined && rp_item.body_part != "") {        
          clipboard_text += this.getOneSpaces(3) + "部位/補足：" + rp_item.body_part + "\n";
        } 

        // 用法
        if (rp_item.injectUsageName != undefined && rp_item.injectUsageName != null && rp_item.injectUsageName != "") {
          clipboard_text += this.getOneSpaces(2) + "用法：" + rp_item.injectUsageName + "\n";
        }

        // 実施状態
        if (rp_item.done_numbers != undefined && rp_item.done_numbers != null && (rp_item.done_numbers.length > 0 || Object.keys(rp_item.done_numbers).length > 0)) {
          clipboard_text += this.getOneSpaces(3) + "実施状態：";
          if (getPeriodInjectionRpDoneStatus(rp_item.done_numbers) == 1) {          
            clipboard_text += "実施済\n";
          } else if (getPeriodInjectionRpDoneStatus(rp_item.done_numbers) == 2) {          
            clipboard_text += "実施中\n";
          } else {
            clipboard_text += "未実施\n";
          }
        }
      }
      
    });

    // 備考のオプション
    
    if (loop_obj.is_completed != 4 && _from != "right_rp_del") {
      if (loop_obj.schedule_date != undefined && loop_obj.schedule_date != null && loop_obj.schedule_date != "") {
        if (_from == "middle") {
          clipboard_text += "実施予定日：" + formatJapanDateSlash(loop_obj.schedule_date) + "\n";
        } else {
          clipboard_text += "実施予定日：" + formatJapanDateSlash(formatDateLine(loop_obj.schedule_date)) + "\n";          
        }
      }
      if (_from == "middle" && _injectionData.data != undefined && _injectionData.data != null && _injectionData.data.done_order == 1) {
        clipboard_text += "実施日時：" + formatJapanDateSlash(loop_obj.executed_date_time) + " " + loop_obj.executed_date_time.substr(11, 2) + "時" + loop_obj.executed_date_time.substr(14, 2) + "分" + "\n";
      }
    }

    if (_from != "right_rp_del") {
      // 実施場所
      if (loop_obj.location_name !== null && loop_obj.location_name !== undefined && loop_obj.location_name != "") {
        clipboard_text += "実施場所：" + loop_obj.location_name + "\n";
      }

      // 点滴速度
      if (loop_obj.drip_rate !== null && loop_obj.drip_rate !== undefined && loop_obj.drip_rate !== "" && loop_obj.drip_rate !== 0) {
        clipboard_text += "点滴速度：" + loop_obj.drip_rate + "ml/h\n";
      }

      // 1分あたり
      if (loop_obj.water_bubble !== null && loop_obj.water_bubble !== undefined && loop_obj.water_bubble !== "" && loop_obj.water_bubble !== 0) {
        clipboard_text += "1分あたり：" + loop_obj.water_bubble + "滴\n";
      }

      // 交換サイクル
      if (loop_obj.exchange_cycle !== null && loop_obj.exchange_cycle !== undefined && loop_obj.exchange_cycle !== "" && loop_obj.exchange_cycle !== 0) {
        clipboard_text += "交換サイクル：" + loop_obj.exchange_cycle + "時間\n";
      }

      // 所要時間
      if (loop_obj.require_time !== null && loop_obj.require_time !== undefined && loop_obj.require_time !== "" && loop_obj.require_time !== 0) {
        clipboard_text += "所要時間：" + loop_obj.require_time + "時間\n";
      }


      if (loop_obj != null && loop_obj.med_consult != null && loop_obj.med_consult !== undefined && loop_obj.med_consult == 1) {      
        clipboard_text += "【お薬相談希望あり】" + "\n";
      }
      if (loop_obj != null && loop_obj.supply_med_info != null && loop_obj.supply_med_info !== undefined && loop_obj.supply_med_info == 1) {      
        clipboard_text += "【薬剤情報提供あり】" + "\n";
      }

      // 持参薬種別
      if (loop_obj != null && loop_obj.potion != null && loop_obj.potion !== undefined && (loop_obj.potion == 0 || loop_obj.potion == 1) && loop_obj.is_internal_injection == 5) {
        clipboard_text += loop_obj.potion == 0 ? "持参薬（自院）" : "持参薬（他院）";
        clipboard_text += "\n";
      }

      // 該当のチェックボックス
      if (loop_obj != null && loop_obj.hospital_opportunity_disease != null && loop_obj.hospital_opportunity_disease !== undefined && loop_obj.hospital_opportunity_disease == 1) {
        clipboard_text += "入院契機傷病の治療に係るもの" + "\n";
      }

      // 向精神薬多剤投与理由
      if (loop_obj != null && loop_obj.psychotropic_drugs_much_reason != null && loop_obj.psychotropic_drugs_much_reason !== undefined && loop_obj.psychotropic_drugs_much_reason !== "") {      
        clipboard_text += "●向精神薬多剤投与理由：" + loop_obj.psychotropic_drugs_much_reason + "\n";
      }

      // 湿布薬超過投与理由
      if (loop_obj != null && loop_obj.poultice_many_reason != null && loop_obj.poultice_many_reason !== undefined && loop_obj.poultice_many_reason !== "") {      
        clipboard_text += "●湿布薬超過投与理由：" + loop_obj.poultice_many_reason + "\n";
      }

      // 備考
      if (loop_obj != null && loop_obj.free_comment != null && loop_obj.free_comment !== undefined && loop_obj.free_comment.length > 0 &&  loop_obj.free_comment[0] != null) {
        clipboard_text += "●備考：" + loop_obj.free_comment[0] + "\n";
      }
    }

    if (window.clipboardData) {
      window.clipboardData.setData ("Text", clipboard_text);
    }
}

const getInjectionDoneTimes = (_done_times=null) => {
  if (_done_times == null || _done_times.length < 1) return "";
  let result = "";

  _done_times.map((item, index)=>{
    result += (index+1) + "回目 " + (item != "" ? item : "未定") + (index == (_done_times.length - 1) ? "":"、");    
  });
  return result;   
}