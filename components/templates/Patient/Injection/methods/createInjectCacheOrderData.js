import { getInjectionUsageInfo } from "~/helpers/constants";
/**
 *	処方order_dataの整形
 *	用法ごとにまとめて送信する
 */
export default function(source) {
  let isForInjectionUpdate = source.isForInjectionUpdate;
  let results = source    
    .filter(pres => {
      return pres.usageName != "";
    })
    .map(pres => {
      let usageRemarksList = [];
      if (Array.isArray(pres.usage_remarks_comment)) {
        usageRemarksList = pres.usage_remarks_comment;
      } else {
        usageRemarksList.push(pres.usage_remarks_comment);
      }
      let _administratePeriod = pres.administrate_period;
      if (_administratePeriod != undefined && _administratePeriod != null && _administratePeriod.period_end_date != undefined && _administratePeriod.increase_period_end_date != undefined) {
        _administratePeriod.period_end_date = _administratePeriod.increase_period_end_date;
        _administratePeriod.days = _administratePeriod.increase_days;
        delete _administratePeriod.increase_period_end_date;
        delete _administratePeriod.increase_days;
      }
      let ord = {
        medical_business_diagnosing_type: 32,
        med: pres.medicines
          .filter(med => {
            return med.medicineId > 0;
          })
          .map(med => {
            let free_comment = [];
            if (Array.isArray(med.free_comment)) {
              free_comment = med.free_comment.slice(0);
            } else {
              free_comment.push(med.free_comment);
            }
            return {
              item_number: med.medicineId,
              item_name: med.medicineName,
              amount: med.amount,
              unit: med.unit,              
              free_comment: free_comment,              
            };
          }),        
        days: pres.days,
        usage: pres.usage,
        usage_name: pres.usageName,
        start_date: pres.start_date, // 20190307,
        insurance_type: pres.insurance_type,
        body_part: pres.body_part,
        administrate_period: _administratePeriod,
        usage_remarks_comment: usageRemarksList,
        is_precision: pres.is_precision,
        receipt_key_if_precision: pres.receipt_key_if_precision,
        
        // injectDays: pres.injectDays,
        injectUsage: pres.injectUsage,
        injectUsageName: pres.injectUsageName,
        // inject_days_suffix: pres.inject_days_suffix,        
      };
      // let isForInjectionUpdate = window.sessionStorage.getItem("isForInjectionUpdate", false);
      // let isForInjectionUpdate = source.isForInjectionUpdate != undefined && source.isForInjectionUpdate != null ? source.isForInjectionUpdate : 0;
      if (isForInjectionUpdate == 1) {
        ord["order_number"] = pres.order_number;
        ord["order_number_serial"] = pres.order_number_serial;
      }
      // if (pres.usage_replace_number !== undefined) {
      //   ord["usage_replace_number"] = pres.usage_replace_number;
      // }

      // ●YJ698 注射に、薬剤なし登録できる手技を作れるように
      let usage_allow_no_medicine = null;
      usage_allow_no_medicine = getInjectionUsageInfo(ord.usage, "allow_registration_of_no_medicine");
      if (usage_allow_no_medicine == 1) {        
        return ord;
      } else {
        if (ord.med.length > 0) return ord;
      }

    });

  return results.filter(item => {
    if (item !== undefined) return item;
  });
}
