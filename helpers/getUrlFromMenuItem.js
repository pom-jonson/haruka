export const getUrlFromMenuItem = (item) => {
  
  if(!item.is_modal) return item.url;
  let id = item.id;
  let url = '';
  
  switch(id){
    case 110:
    case 229:
      url = 'consentedFromNav';
      break;
    case 113:
    case 203:
      url = 'document_create';
      break;
    case 111:
    case 211:
    case 233:
      url = 'hospitalize_prescription';
      break;
    case 126:
    case 247:
      url = 'hospital_plan_list';
      break;
    case 248:
      url = 'summary_list';
      break;
    case 231:
      url = 'account_hospital_order';
      break;
    case 212:
      url = 'hospitalize_soap';
      break;
    case 558:
      url = 'soap';
      break;
    case 124:
    case 217:
    case 281:
    case 282:
    case 283:
    case 284:
    case 285:
    case 286:
    case 287:
    case 291:
    case 215:
    case 218:
    case 216:
      url = 'allergy';
      break;
    case 146:
    case 221:
    case 556:
      url = 'prescription';
      break;
    case 147:
    case 223:
    case 238:
    case 557:
      url = 'injection';
      break;
    case 301:
      url = 'bed_control';
      break;
    case 303:
      url = 'nurse_instruction';
      break;
    case 323:
      url = 'hospital_instruction';
      break;
    case 304:
      url = 'instruction_reception_list';
      break;
    case 307:
      url = 'soap_focus';
      break;
    case 308:
      url = 'nurse_assignment';
      break;
    case 311:
      url = 'patients_schedule';
      break;
    case 312:
      url = 'incharge_sheet_list';
      break;
    case 313:
      url = 'move_plan_patient_list';
      break;
    case 314:
      url = 'out_injection_patient_list';
      break;
    case 315:
      url = 'nurse_summary_list';
      break;
    case 318:
      url = 'patient_certification';
      break;
    case 319:
      url = 'hospital_patient_barcode_print';
      break;
    case 320:
      url = 'visit_nurse_summary';
      break;
    case 148:
    case 224:
      url = 'outpatient';
      break;
    case 149:
    case 150:
    case 151:
    case 152:
    case 153:
    case 154:
    case 155:
    case 156:
    case 157:
    case 158:
    case 159:
    case 160:
    case 161:
    case 162:
    case 163:
    case 164:
    case 192:
    case 193:
    case 194:
    case 195:
    case 196:
    case 197:
    case 198:
    case 199:
    case 200:
    case 256:
    case 257:
    case 258:
    case 259:
    case 260:
    case 261:
    case 262:
    case 263:
    case 264:
    case 265:
    case 266:
    case 267:
    case 268:
    case 269:
    case 270:
    case 271:
    case 2004:
    case 2005:
    case 2010:
    case 2011:
    case 2017:
    case 2018:
    case 2019:
    case 2020:
    case 2021:
      url = 'physiological';
      break;
    case 241: // 指示簿
      url = 'instruction_book';
      break;
    case 242: // 指示簿
      url = 'instruction_book_list';
      break;
    case 235: // 中止処方
      url = 'stop_prescription';
      break;
    case 243: // 退院一括削除
      url = 'out_hospital_group_delete';
      break;
    case 165:
    case 272:
      url = 'endoscope';
      break;
    case 166:
    case 273:
    case 2013:
    case 2014:
    case 2015:
    case 559:
      url = 'openExamination';
      break;
    case 174:
    case 175:
    case 176:
    case 177:
    case 178:
    case 179:
    case 180:
    case 181:
    case 249:
    case 250:
    case 251:
    case 252:
    case 253:
    case 254:
    case 255:
    case 280:
      url = 'radiation';
      break;
    case 183:
      url = 'home_treatment';
      break;
    case 185:
    case 292:
      url = 'home_prescription';
      break;
    case 186:
    case 293:
      url = 'home_injection';
      break;
    case 201:
      url = 'diseaseName';
      break;
    case 202:
      url = 'symptomDetail';
      break;
    case 208:
      url = 'guidance';
      break;
    case 210:
      url = 'nutrition_guidance';
      break;
    case 245:
      url = 'change_responsibility';
      break;
    case 230:
      url = 'account_order';
      break;
    case 275:
      url = 'rehabilitation';
      break;
    case 279:
      url = 'home_treatment';
      break;
    case 240:
      url = 'hospital_treatment';
      break;
    case 117:
      url = 'set_create';
      break;
    case 118:
      url = 'set_register';
      break;
    case 187:
      url = 'set_deployment';
      break;
    case 288:
      url = 'pills';
      break;
    case 289:
      url = 'inspection';
      break;
    case 290:
      url = 'pacs';
      break;
    case 120:
    case 294:
      url = 'reservation_create';
      break;
    case 295:
      url = 'importance_order_list';
      break;
    case 296:
      url = 'period_order_list';
      break;
    case 302:
      url = "nurse_plan";
      break;
    case 306:
      url = "nurse_plan_reference";
      break;
    case 317:
      url = "individual_work_sheet";
      break;
    case 4005:
      url = 'visit_treatment_group';
      break;
    case 4006:
      url = 'visit_treatment_patient';
      break;
    case 840:
      url = 'hospitalized_setting';
      break;
    case 901:
      url = 'print/haruka/medical_info_doc';
      break;
    case 902:
      url = 'print/haruka/karte';
      break;
    case 835:
      url = 'guidance_fee_master';
      break;
    case 404:
      url = 'chemical_information_search';
      break;
    case 407:
      url = 'ward_label';
      break;
    case 412:
      url = 'nutrition_guidance_slip_total';
      break;
    case 416:
      url = 'inpatient_contact_list';
      break;
    case 442:
      url = 'inspection_reservation_list';
      break;
    case 441:
      url = 'inspection_status_list';
      break;
    case 446:
      url = 'endoscope_status_list';
      break;
    case 436:
      url = 'radiation_status_list';
      break;
    case 447:
      url = 'endoscope_reservation_list';
      break;
    case 443:
      url = 'inspection_department_result';
      break;
    case 448:
      url = 'endoscope_department_result';
      break;
    case 438:
      url = 'radiation_department_result';
      break;
    case 451:
      url = 'out_exam_cooperation_request_output';
      break;
    case 458:
      url = 'scanner_batch_take_doc';
      break;
    case 299:
    case 452:
    case 453:
    case 454:
    case 455:
      url = 'report_creat_list';
      break;
    case 105:
      url = 'emergency_reception';
      break;
    case 437:
      url = 'radiation_reservation_list';
      break;
    case 244:
      url = 'move_meal_calendar';
      break;
    case 457:
      url = 'medication_guidance_schedule';
      break;
    case 2001:
      url = 'simple_order';
      break;
    case 236:
      url = 'batch_do_prescription_list';
      break;
    case 2002:
      url = 'potion_report';
      break;
    case 2003:
      url = 'hospital_prescription';
      break;
    case 2007:
      url = 'discharge_decision';
      break;
    case 2008:
      url = 'discharge_done';
      break;
    case 2009:
      url = 'hospital_done';
      break;
    case 2012:
      url = 'instruction_book_calendar';
      break;
    case 136:
      url = 'document_reference';
      break;
    case 903:
      url = 'barcode_mount_print';
      break;
    case 4009:
      url = 'death_register';
      break;
  }
  return url;
};


export const getInspectionItemId = (item) => {
  if(!item.is_modal) return item.url;
  let id = item.id;
  if(id==149 || id==256){return 1;}
  if(id==150 || id==257){return 2;}
  if(id==151 || id==258){return 3;}
  if(id==152 || id==259){return 4;}
  if(id==153 || id==260){return 5;}
  if(id==154 || id==261){return 6;}
  if(id==155 || id==262){return 7;}
  if(id==156 || id==263){return 8;}
  if(id==157 || id==264){return 9;}
  if(id==158 || id==265){return 10;}
  if(id==159 || id==266){return 11;}
  if(id==160 || id==267){return 12;}
  if(id==161 || id==268){return 13;}
  if(id==162 || id==269){return 14;}
  if(id==163 || id==270){return 15;}
  if(id==164 || id==271){return 16;}
  if(id==165 || id==272){return 17;}
  if(id==192 || id==2004){return 19;}
  if(id==193 || id==2005){return 20;}
  if(id==194 || id==2010){return 21;}
  if(id==195 || id==2011){return 22;}
  if(id==196 || id==2017){return 23;}
  if(id==197 || id==2018){return 24;}
  if(id==198 || id==2019){return 25;}
  if(id==199 || id==2020){return 26;}
  if(id==200 || id==2021){return 27;}
}

export const getRadiationItemId = (item) => {
  if(!item.is_modal) return item.url;
  let id = item.id;
  if(id==174 || id==249){return 1;}
  if(id==175 || id==250){return 2;}
  if(id==176 || id==251){return 3;}
  if(id==177 || id==252){return 4;}
  if(id==178 || id==253){return 5;}
  if(id==179 || id==254){return 6;}
  if(id==180 || id==255){return 7;}
  if(id==181 || id==280){return 8;}
}

export const getAllergyItemId = (item) => {
  if(!item.is_modal) return item.url;
  let id = item.id;
  if(id==124 || id==217){return "past";}
  if(id==281){return "foodalergy";}
  if(id==282){return "drugalergy";}
  if(id==283){return "disabled";}
  if(id==284){return "vaccine";}
  if(id==285){return "adl";}
  if(id==286){return "infection";}
  if(id==287){return "alergy";}
  if(id==291){return "contraindication";}
  if(id==215){return "process_hospital";}
  if(id==218){return "inter_summary";}
  if(id==216){return "current_symptoms_on_admission";}
}

export const getExaminationItemId = (item) => {
  if(!item.is_modal) return item.url;
  let id = item.id;
  if(id==273){return 1;}
  if(id==2013){return 2;}
  if(id==2014){return 3;}
  if(id==2015){return 4;}
}
