import {
  formatDate,  
  formatJapanDateSlash,
  getWeekNamesBySymbol,
} from "~/helpers/date";

export default function(_prescriptionData, _from) {  
  let clipboard_text = "";    
    let loop_obj = _prescriptionData;
    if (_from == "middle") {
      loop_obj = _prescriptionData.data.order_data;
    } else if(_from == "right") {
      loop_obj = _prescriptionData;
    } else if(_from == "right_del" || _from == "right_rp_del") {
      loop_obj = _prescriptionData.order_data;
    }
    let map_obj = _from == "middle" || _from == "right_del" || _from == "right_rp_del" ?  loop_obj.order_data : loop_obj.presData;
    map_obj.map((rp_item, rp_index)=>{  
      let usage_obj = _from == "middle" || _from == "right_del" || _from == "right_rp_del" ?  rp_item.usage_name : rp_item.usageName;
      if (usage_obj != undefined && usage_obj != undefined && usage_obj != "") {        
        let _keyName = {
          // can_generic_name: "一般名処方",
          // is_not_generic: "後発不可",
          // milling: "粉砕",
          // free_comment: "備考",
          // separate_packaging: "別包",
          one_dose_package: "一包化",
          temporary_medication: "臨時処方",
          mixture:"混合"
        };
        let sameKeys = this.getCheckSameOptions(rp_item);
        let sameOptions = sameKeys != undefined && sameKeys != "" ? this.getSameOptions(rp_item, sameKeys) : "";              
        let sameOptionsView = [];
        if (sameOptions !== undefined && sameOptions.length > 0 && sameOptions != "" && sameKeys != undefined && sameKeys != "") {          
          Object.keys(_keyName).map(_key=>{            
            if(sameOptions != undefined && sameOptions != null && sameOptions != "" && sameOptions.length > 0){
              sameOptions.map(_option=>{
                if(_option != undefined  && _option[_key] == 1) {                
                  sameOptionsView.push("【" + _keyName[_key] + "】");
                }
              });            
            }
          });
        }

        let medicines_obj = _from == "middle" || _from == "right_del" || _from == "right_rp_del" ?  rp_item.med : rp_item.medicines;
        if (medicines_obj.length > 0) {
          medicines_obj.map((med_item, med_index)=>{
            if ((_from == "middle" || _from == "right_del" || _from == "right_rp_del" ? med_item.item_name : med_item.medicineName) != "") {            
              if (med_index == 0) {
                if (rp_index < 9) {
                  if (rp_index == 0) {
                    clipboard_text += " " + (rp_index + 1) + ") ";
                  } else {
                    clipboard_text += " " + (rp_index + 1) + ") ";
                  }
                } else {
                  clipboard_text += (rp_index + 1) + ") ";              
                }
                clipboard_text += (_from == "middle" || _from == "right_del" || _from == "right_rp_del" ? med_item.item_name : med_item.medicineName) + this.getOneSpaces(3) + med_item.amount + med_item.unit + "\n";
              } else {
                clipboard_text += this.getOneSpaces(2) + (_from == "middle" || _from == "right_del" || _from == "right_rp_del" ? med_item.item_name : med_item.medicineName) + this.getOneSpaces(3) + med_item.amount + med_item.unit + "\n";
              }
              
              // 薬剤オプション              
              let tmp_clipboard_text = this.getOneSpaces(3);
              let _exist_options = 0;           

              if (med_item["can_generic_name"] != undefined && med_item["can_generic_name"] == 1) {
                tmp_clipboard_text += "【一般名処方】";
                _exist_options = 1;
              }
              if (med_item["is_not_generic"] != undefined && med_item["is_not_generic"] == 1) {
                tmp_clipboard_text += "【後発不可】";
                _exist_options = 1;
              }
              if (med_item["milling"] != undefined && med_item["milling"] == 1) {
                tmp_clipboard_text += "【粉砕】";
                _exist_options = 1;
              }
              if (med_item["separate_packaging"] != undefined && med_item["separate_packaging"] == 1) {
                tmp_clipboard_text += "【別包】";
                _exist_options = 1;
              }

              if (_exist_options == 1) {              

                tmp_clipboard_text += "\n";
                clipboard_text += tmp_clipboard_text;
              }              

              // 薬剤コメント
              if (med_item.free_comment && med_item.free_comment.length > 0) {
                med_item.free_comment.map(comment => {
                  clipboard_text += this.getOneSpaces(3) + comment + "\n";              
                })
              }
            }

          });
        }
        // 用法

        let usage_obj = _from == "middle" || _from == "right_del" || _from == "right_rp_del" ?  rp_item.usage_name : rp_item.usageName;
        if (usage_obj != undefined && usage_obj != undefined && usage_obj != "") {        
          clipboard_text += this.getOneSpaces(2) + "用法：" + usage_obj;
          if (rp_item.days !== 0 && rp_item.days !== undefined) {
            clipboard_text += this.getOneSpaces(1) + "(" + rp_item.days;
            if (rp_item.days_suffix !== undefined && rp_item.days_suffix !== "") {
              clipboard_text += rp_item.days_suffix + ")" + "\n";
            } else {
              clipboard_text += "日分" + ")" + "\n";
            }
          } else {
            clipboard_text += "\n";
          }
        }      

        // 追加用法コメント
        if (rp_item.usage_remarks_comment) {
          rp_item.usage_remarks_comment.map(comment => {          
            clipboard_text += this.getOneSpaces(3) + comment + "\n";
          })
        }

        // RPオプション
        if(sameOptionsView.length > 0){
          clipboard_text += this.getOneSpaces(3);
          sameOptionsView.map(_option=>{
            clipboard_text += _option;
          })
          clipboard_text += "\n";
        }

        // 部位/補足
        if (rp_item.body_part != undefined && rp_item.body_part != "") {        
          clipboard_text += this.getOneSpaces(3) + "部位/補足：" + rp_item.body_part + "\n";
        }

        // 処方開始日
        if (rp_item.start_date !== undefined && rp_item.start_date !== "" && (rp_item.administrate_period == undefined || rp_item.administrate_period == null)) {
          clipboard_text += this.getOneSpaces(3) + "処方開始日：" + formatJapanDateSlash(formatDate(rp_item.start_date)) + "\n";
        }

        // 投与期間
        if (rp_item.administrate_period != undefined && rp_item.administrate_period != null) {
          clipboard_text += this.getOneSpaces(3) + "投与期間：" + formatJapanDateSlash(rp_item.administrate_period.period_start_date) + "～" + formatJapanDateSlash(rp_item.administrate_period.period_end_date) + "\n";
          if (rp_item.administrate_period.period_type == 0 && rp_item.administrate_period.period_category != null) {
            clipboard_text += this.getOneSpaces(3) + "間隔：";
            clipboard_text += rp_item.administrate_period.period_category == 0 ? "日":rp_item.administrate_period.period_category == 1 ? "週" : "月";
            clipboard_text += "\n";
          }
          if (rp_item.administrate_period.period_type == 1 && rp_item.administrate_period.period_week_days.length > 0) {
            clipboard_text += this.getOneSpaces(3) + "曜日：" + getWeekNamesBySymbol(rp_item.administrate_period.period_week_days) + "\n";
          }
        }

        // 保険
        if (rp_item.insurance_type != undefined) {
          clipboard_text += this.getOneSpaces(3) + "保険：" + this.getInsurance(rp_item.insurance_type) + "\n";
        }

        // RPオプション
        // if(sameOptionsView.length > 0){
        //   clipboard_text += this.getOneSpaces(3);
        //   sameOptionsView.map(_option=>{
        //     clipboard_text += _option;
        //   })
        //   clipboard_text += "\n";
        // }
      }            
    });

    if (_from != "right_rp_del") {
      // 備考のオプション
      if (loop_obj != null && loop_obj.med_consult != null && loop_obj.med_consult !== undefined && loop_obj.med_consult == 1) {      
        clipboard_text += "【お薬相談希望あり】" + "\n";
      }
      if (loop_obj != null && loop_obj.supply_med_info != null && loop_obj.supply_med_info !== undefined && loop_obj.supply_med_info == 1) {      
        clipboard_text += "【薬剤情報提供あり】" + "\n";
      }

      // 持参薬種別
      if (loop_obj != null && loop_obj.potion != null && loop_obj.potion !== undefined && (loop_obj.potion == 0 || loop_obj.potion == 1) && loop_obj.is_internal_prescription == 5) {
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
