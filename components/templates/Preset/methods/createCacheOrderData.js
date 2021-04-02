/**
 *	処方order_dataの整形
 *	用法ごとにまとめて送信する
 */
export default function(source) {
  let cacheUsageData = JSON.parse(
    window.localStorage.getItem("haruka_cache_usageData")
  );
  let keys = Object.keys(cacheUsageData);
  keys.map(key => {
    let subKeys = Object.keys(cacheUsageData[key]);
    subKeys.map(subKey => {
      source = source.map(pres => {
        cacheUsageData[key][subKey].map(item => {
          if (pres.usageName === item.name) {
            pres.enable_days = item.enable_days;
          } else {
            pres.enable_days = 0;
          }
        });
        return pres;
      });
    });
  });
  let results = source
    .filter(pres => {
      if (
        pres.usage > 0 &&
        pres.enable_days !== undefined &&
        pres.enable_days === 0
      ) {
        return true;
      }
      if (pres.usageName.includes("ＸＸ") || pres.usageName.includes("　")) {
        return true;
      } else {
        if ( pres.usage > 0 && pres.days > 0 ){
          return true;
        } else {
          return false;
        }
      }
      
    })
    .map(pres => {
      let usageRemarksList = [];
      if (Array.isArray(pres.usage_remarks_comment)) {
        usageRemarksList = pres.usage_remarks_comment;
      } else {
        usageRemarksList.push(pres.usage_remarks_comment);
      }
      let ord = {
        medical_business_diagnosing_type: pres.medical_business_diagnosing_type,
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
              main_unit_flag: med.main_unit_flag,
              is_not_generic: med.is_not_generic,
              can_generic_name: med.can_generic_name,
              milling: med.milling,
              separate_packaging: med.separate_packaging,
              free_comment: free_comment,
              usage_comment: med.usage_comment,
              usage_optional_num: med.usage_optional_num,
              poultice_times_one_day: med.poultice_times_one_day,
              poultice_one_day: med.poultice_one_day,
              poultice_days: med.poultice_days,
              uneven_values: med.uneven_values
            };
          }),
        med_consult: pres.med_consult,
        supply_med_info: pres.supply_med_info,
        one_dose_package: pres.one_dose_package,
        temporary_medication: pres.temporary_medication,
        mixture: pres.mixture,
        days: pres.days,
        usage: pres.usage,
        usage_name: pres.usageName,
        start_date: pres.start_date, // 20190307,
        insurance_type: pres.insurance_type,
        body_part: pres.body_part,
        usage_remarks_comment: usageRemarksList
      };
      let isForPrescriptionUpdate = window.sessionStorage.getItem("isForPrescriptionUpdate", false);
      if (isForPrescriptionUpdate) {
        ord["update_mode"] = "update";
        ord["order_number"] = pres.order_number;
        ord["order_number_serial"] = pres.order_number_serial;
      }
      if (pres.usage_replace_number !== undefined) {
        ord["usage_replace_number"] = pres.usage_replace_number;
      }

      if (ord.med.length > 0) return ord;
    });

  return results.filter(item => {
    if (item !== undefined) return item;
  });
}
