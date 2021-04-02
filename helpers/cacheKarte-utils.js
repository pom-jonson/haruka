import * as localApi from "~/helpers/cacheLocal-utils";
import { CACHE_LOCALNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";

const getAuthInfo = () => {
  /*@cc_on _win = window; eval ( 'var window = _win') @*/
  return JSON.parse(window.sessionStorage.getItem("haruka"));
}

export const setVal = (patient_id, key, value, type) => {  
  let exist_in_cache = getVal(patient_id, key);
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
  if(cacheObj == null) cacheObj = {};
  if(cacheObj[user_number] == undefined) cacheObj[user_number] = {};
  if(cacheObj[user_number][patient_id] == undefined) cacheObj[user_number][patient_id] = {};
  if(type === 'insert'){
    if(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT] == undefined){
      cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT] = {};
    } else {
      Object.keys(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT]).map(sort_index=>{
        if(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT][sort_index]['order_key'] == key){
          delete cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT][sort_index];
        }
      });
    }
    if(key == CACHE_LOCALNAMES.SOAP_EDIT){
      cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT][0] = {};
      cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT][0]['order_key'] = key;
      cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT][0]['open'] = true;
    } else {
      let cur_stamp = new Date().getTime();
      if(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT][cur_stamp] !== undefined){
        cur_stamp++;
      }
      cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT][cur_stamp] = {};
      cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT][cur_stamp]['order_key'] = key;
      cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT][cur_stamp]['open'] = true;
    }
  }
  cacheObj[user_number][patient_id][key] = JSON.parse(value);
  if(cacheObj[user_number][patient_id]["patient"] == undefined) {
    cacheObj[user_number][patient_id]["patient"] = localApi.getObject(CACHE_LOCALNAMES.CUR_PATIENT);
    updateEditPatientList(user_number, cacheObj);
  }
  localApi.setObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME, cacheObj);  
  // ●YJ983 訪問診療では、登録時に印刷せず後で一括印刷できるように  
  if (exist_in_cache == undefined && exist_in_cache == null) {      
    creatSealCache(patient_id, key);
  }
}

export const setSubVal = (patient_id, key, subkey, value, type) => {    
  let exist_in_cache = getSubVal(patient_id, key, subkey);
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
  if(cacheObj == null) cacheObj = {};
  if(cacheObj[user_number] == undefined) cacheObj[user_number] = {};
  if(cacheObj[user_number][patient_id] == undefined) cacheObj[user_number][patient_id] = {};
  if(type === 'insert'){
    if(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT] == undefined){
      cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT] = {};
    } else {
      Object.keys(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT]).map(sort_index=>{
        if(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT][sort_index]['order_key'] == key+':'+subkey){
          delete cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT][sort_index];
        }
      });
    }
    let cur_stamp = new Date().getTime();
    cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT][cur_stamp] = {};
    cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT][cur_stamp]['order_key'] = key+':'+subkey;
    cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT][cur_stamp]['open'] = true;
  }
  if(cacheObj[user_number][patient_id][key] == undefined) cacheObj[user_number][patient_id][key] = {};
  if(cacheObj[user_number][patient_id][key][subkey] == undefined) cacheObj[user_number][patient_id][key][subkey] = {};
  cacheObj[user_number][patient_id][key][subkey] = JSON.parse(value);
  
  if(cacheObj[user_number][patient_id]["patient"] == undefined) {
    cacheObj[user_number][patient_id]["patient"] = localApi.getObject(CACHE_LOCALNAMES.CUR_PATIENT);
    updateEditPatientList(user_number, cacheObj);
  }
  localApi.setObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME, cacheObj);

  // ●YJ983 訪問診療では、登録時に印刷せず後で一括印刷できるように  
  if (exist_in_cache == undefined && exist_in_cache == null) {    
    creatSealCache(patient_id, key, subkey);
  }
}

export const getVal = (patient_id, key) => {
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
  if(cacheObj == null) return null;
  if(cacheObj[user_number] == undefined) return null;
  if(cacheObj[user_number][patient_id] == undefined) return null;
  if(cacheObj[user_number][patient_id][key] == undefined) return null;
  return cacheObj[user_number][patient_id][key];
}

export const getSubVal = (patient_id, key, subkey) => {
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
  if(cacheObj == null) return null;
  if(cacheObj[user_number] == undefined) return null;
  if(cacheObj[user_number][patient_id] == undefined) return null;
  if(cacheObj[user_number][patient_id][key] == undefined) return null;
  if(cacheObj[user_number][patient_id][key][subkey] == undefined) return null;
  return cacheObj[user_number][patient_id][key][subkey];
}

export const delVal = (patient_id, key) => {
  delSealSubVal(patient_id, key);
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
  if(cacheObj == null) return;
  if(cacheObj[user_number] == undefined) return;
  if(cacheObj[user_number][patient_id] == undefined) return;
  if(cacheObj[user_number][patient_id][key] == undefined) return;
  delete cacheObj[user_number][patient_id][key];
  if(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT] !== undefined){
    let sort_data = cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT];
    Object.keys(sort_data).map(sort_index=>{
      if(sort_data[sort_index]['order_key'] == key){
        delete sort_data[sort_index];
      }
    });
    if(Object.keys(sort_data).length === 0)
      delete cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT];
  }
  
  let arr = Object.keys(cacheObj[user_number][patient_id]);
  if(arr.length == 0) {
    delete cacheObj[user_number][patient_id];
    // 患者情報を削除する場合、シール印刷も削除する
    delAllSealVal(patient_id);
    // updateEditPatientList(user_number, cacheObj);
  }
  // else if(arr.length == 1 && arr.includes(CACHE_LOCALNAMES.PATIENT_INFORMATION)) {
  //   delete cacheObj[user_number][patient_id];
  //   // 患者情報を削除する場合、シール印刷も削除する
  //   delAllSealVal(patient_id);
  //   // updateEditPatientList(user_number, cacheObj);
  // }
  localApi.setObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME, cacheObj);
}

export const delPatient = (patient_id) => {
  // 患者情報を削除
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
  if(cacheObj == null) return;
  if(cacheObj[user_number] == undefined) return;
  if(cacheObj[user_number][patient_id] == undefined) return;
  delete cacheObj[user_number][patient_id];
  // シール印刷も削除
  delAllSealVal(patient_id);
  localApi.setObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME, cacheObj);
}

export const delSubVal = (patient_id, key, subkey) => {
  delSealSubVal(patient_id, key, subkey);
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
  if(cacheObj == null) return;
  if(cacheObj[user_number] == undefined) return;
  if(cacheObj[user_number][patient_id] == undefined) return;
  if(cacheObj[user_number][patient_id][key] == undefined) return;
  if(cacheObj[user_number][patient_id][key][subkey] == undefined) return;
  delete cacheObj[user_number][patient_id][key][subkey];
  if(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT] !== undefined){
    let sort_data = cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT];
    Object.keys(sort_data).map(sort_index=>{
      if(sort_data[sort_index]['order_key'] == key+':'+subkey){
        delete sort_data[sort_index];
      }
    });
    if(Object.keys(sort_data).length === 0)
      delete cacheObj[user_number][patient_id][CACHE_LOCALNAMES.ORDER_SORT];
  }
  let sub_arr = Object.keys(cacheObj[user_number][patient_id][key]);
  if(sub_arr.length == 0)
    delete cacheObj[user_number][patient_id][key];
  
  let arr = Object.keys(cacheObj[user_number][patient_id]);
  if(arr.length == 0) {
    delete cacheObj[user_number][patient_id];
    delAllSealVal(patient_id);
  }
  localApi.setObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME, cacheObj);
}

export const delUserVal = () => {
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  if (auth_info == null) return;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
  if(cacheObj == null) return;
  if(cacheObj[user_number] == undefined) return;
  delete cacheObj[user_number];
  localApi.setObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME, cacheObj);
}

export const existVal = (patient_id, key) => {
  let ret = getVal(patient_id, key);
  return ret == null ? false : true;
}

export const setPatient = (patient_id, value) => {
  setVal(patient_id, CACHE_LOCALNAMES.PATIENT_INFORMATION, value);
  //処方・注射・SOAPの左ツリー width
  let _val={
    prescription:{
      left: {size: 350, minSize:180, maxSize:400, resize: "dynamic"},
      right: {minSize:600, resize: "stretch"},
    },
    injection:{
      left: {size: 350, minSize:180, maxSize:400, resize: "dynamic"},
      right: {minSize:600, resize: "stretch"},
    },
    inspection:{
      left: {size: 350, minSize:180, maxSize:400, resize: "dynamic"},
      right: {minSize:600, resize: "stretch"},
    },
    soap:{
      left: {size: 350, minSize:200, maxSize:400, resize: "dynamic"},
      middle: {minSize:400, resize: "stretch"},
      right: {size: 450, minSize:390, resize: "dynamic"},
    }
  };
  let tree_width=getVal(patient_id, CACHE_LOCALNAMES.TREE_WIDTH);
  if (tree_width != undefined && tree_width != null) return;
  setVal(patient_id, CACHE_LOCALNAMES.TREE_WIDTH, JSON.stringify(_val));
}

export const getPatient = (patient_id) => {
  return getVal(patient_id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
}

export const existPatient = (patient_id) => {
  return existVal(patient_id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
}

// export const getPatients = () => {
//   let auth_info = getAuthInfo();
//   let user_number = auth_info.user_number;
//   let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
//   if(cacheObj == null) return null;
//   if(cacheObj[user_number] == undefined) return null;
// }

export const getEditPatientList = () => {
  // const { $updatePatientsList } = useContext(Context);
  let arr_patients = [];
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  if (auth_info == null || auth_info == undefined) return null;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
  if(cacheObj == null || cacheObj[user_number] == undefined || cacheObj[user_number]  == null)
    return arr_patients;
  Object.keys(cacheObj[user_number]).map(ele =>{
    let data = cacheObj[user_number][ele]["patient"];
    if (data != null && data != undefined) {
      let insertData = {
        system_patient_id: ele,
        kana: data.kana,
        name: data.name,
        user_number: user_number,
        receId: data.receId
      };
      arr_patients.push(insertData);
    }
  });
  return arr_patients;
  // this.context.$updatePatientsList(arr_patients);
  // localApi.setObject(CACHE_LOCALNAMES.PATIENTSLIST, arr_patients);
}

export const updateEditPatientList = (user_number, cacheObj) => {
  // const { $updatePatientsList } = useContext(Context);
  // let auth_info = getAuthInfo();
  // if (auth_info == null || auth_info == undefined) return null;
  // let user_number = auth_info.user_number;
  // let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
  let arr_patients = [];
  Object.keys(cacheObj[user_number]).map(ele =>{
    if(cacheObj[user_number][ele]["patient"] == undefined) return;
    let data = cacheObj[user_number][ele]["patient"];
    if (data != null && data != undefined) {
      let insertData = {
        system_patient_id: ele,
        kana: data.kana,
        name: data.name,
        user_number: user_number
      };
      arr_patients.push(insertData);
    }
  });
  // this.context.$updatePatientsList(arr_patients);
  localApi.setObject(CACHE_LOCALNAMES.PATIENTSLIST, arr_patients);
}

/*
●YJ209 複数の患者を開いているとき、最新の1人を閉じるとカルテ外ページの閉じるボタンがなくなる不具合
・カルテ外の閉じるボタンは、保存して閉じるや破棄でカルテを閉じても、開いている患者がいる場合は表示するように。
・戻り先は、開いている患者の中で一番最後に開いていた患者というルールは同じ。
*/

export const getLatestVisitPatientInfo = () => {
  let result = null;
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return result;
  if (auth_info == null || auth_info == undefined) return result;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
  if(cacheObj == null || cacheObj[user_number] == undefined || cacheObj[user_number]  == null)
    return result;
  Object.keys(cacheObj[user_number]).map(ele =>{
    let data = cacheObj[user_number][ele]["patient"];
    if (data != null && data != undefined) {
      if (result == null || (result.enter_time != undefined && data.enter_time != undefined && result.enter_time < data.enter_time)) {
        data.patient_id = ele;
        result = data;
      }
    }
  });
  return result;
}



/**
 *
 **/
//シール印刷の場合、チェックボックスの状態取得
export const getSealSubVal = (patient_id, key, sub_key=null ) => {
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.HARUKA_SEAL_PRINT);
  if(cacheObj == null) return null;
  if(cacheObj[user_number] == undefined) return null;
  if(cacheObj[user_number][patient_id] == undefined) return null;
  if(cacheObj[user_number][patient_id][key] == undefined) return null;
  if(sub_key == null) {
    return cacheObj[user_number][patient_id][key];
  }
  if(cacheObj[user_number][patient_id][key][sub_key] == undefined) return null;
  return cacheObj[user_number][patient_id][key][sub_key];
}

//シール印刷の場合、チェックボックスの状態設定 (密偵)
// export const setSealSubVal = (patient_id, key, value, sub_key=null) => {
// const { currentPatientInfo } = useContext(Context);
// let auth_info = getAuthInfo();
// let user_number = auth_info.user_number;
// let cacheObj = localApi.getObject(CACHE_LOCALNAMES.HARUKA_SEAL_PRINT);
// if(cacheObj == null) cacheObj = {};
// if(cacheObj[user_number] == undefined) cacheObj[user_number] = {};
// if(cacheObj[user_number][patient_id] == undefined) cacheObj[user_number][patient_id] = {};
// cacheObj[user_number][patient_id][key] = JSON.parse(value);
// localApi.setObject(CACHE_LOCALNAMES.HARUKA_SEAL_PRINT, cacheObj);
// }

//シール印刷の場合、チェックボックスの状態取得
export const getSealAllVal = (patient_id) => {
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.HARUKA_SEAL_PRINT);
  if(cacheObj == null) return null;
  if(cacheObj[user_number] == undefined) return null;
  if(cacheObj[user_number][patient_id] == undefined) return null;
  return cacheObj[user_number][patient_id];
}

//シール印刷の場合、チェックボックスの状態設定
export const setSealAllVal = (patient_id, value) => {
  // const { currentPatientInfo } = useContext(Context);
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.HARUKA_SEAL_PRINT);
  if(cacheObj == null) cacheObj = {};
  if(cacheObj[user_number] == undefined) cacheObj[user_number] = {};
  if(cacheObj[user_number][patient_id] == undefined) cacheObj[user_number][patient_id] = {};
  cacheObj[user_number][patient_id] = value;
  localApi.setObject(CACHE_LOCALNAMES.HARUKA_SEAL_PRINT, cacheObj);
}

//カルテを閉じるする場合、API成功後にcacheから該当オーダーの内容を削除する
export const delSealSubVal = (patient_id, key, sub_key=null) => {
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.HARUKA_SEAL_PRINT);
  if(cacheObj == null) return null;
  if(cacheObj[user_number] == undefined) return null;
  if(cacheObj[user_number][patient_id] == undefined) return null;
  if(cacheObj[user_number][patient_id][key] == undefined) return null;
  if(sub_key == null) {
    delete cacheObj[user_number][patient_id][key];
  } else {
    if(cacheObj[user_number][patient_id][key][sub_key] == undefined) return null;
    delete cacheObj[user_number][patient_id][key][sub_key];
  }
  localApi.setObject(CACHE_LOCALNAMES.HARUKA_SEAL_PRINT, cacheObj);
}
//カルテの全て内容を削除する場合、CALLする
export const delAllSealVal = (patient_id) => {
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.HARUKA_SEAL_PRINT);
  if(cacheObj == null) return null;
  if(cacheObj[user_number] == undefined) return null;
  if(cacheObj[user_number][patient_id] == undefined) return null;
  delete cacheObj[user_number][patient_id];
  localApi.setObject(CACHE_LOCALNAMES.HARUKA_SEAL_PRINT, cacheObj);
}

//set value to all key of cache
export const setObjectToCache = (patient_id, obj) => {
  let array_key = [
    CACHE_LOCALNAMES.PRESCRIPTION_DELETE,
    CACHE_LOCALNAMES.INJECTION_DELETE,
    CACHE_LOCALNAMES.EXAM_DELETE,
    CACHE_LOCALNAMES.INSPECTION_DELETE,
    CACHE_LOCALNAMES.TREATMENT_DELETE,
    CACHE_LOCALNAMES.ALLERGY_DELETE,
    CACHE_LOCALNAMES.GUIDANCE_DELETE,
    CACHE_LOCALNAMES.RIHABILY_DELETE,
    CACHE_LOCALNAMES.RADIATION_DELETE,
    CACHE_LOCALNAMES.PRESCRIPTION_EDIT,
    CACHE_LOCALNAMES.INJECTION_EDIT,
    CACHE_LOCALNAMES.EXAM_EDIT,
    CACHE_LOCALNAMES.INSPECTION_EDIT,
    CACHE_LOCALNAMES.TREATMENT_EDIT,
    CACHE_LOCALNAMES.GUIDANCE_EDIT,
    CACHE_LOCALNAMES.ALLERGY_EDIT,
    CACHE_LOCALNAMES.RIHABILY_EDIT,
    CACHE_LOCALNAMES.RADIATION_EDIT,
  ];
  
  array_key.map(key=>{
    setObjectToKey(patient_id, key, obj);
  });
}

// check exist deleted data in cache
export const hasDeletedDataFromCache = (patient_id) => {
  let result = false;
  
  let array_key = [
    CACHE_LOCALNAMES.PRESCRIPTION_DELETE,
    CACHE_LOCALNAMES.INJECTION_DELETE,
    CACHE_LOCALNAMES.EXAM_DELETE,
    CACHE_LOCALNAMES.INSPECTION_DELETE,
    CACHE_LOCALNAMES.TREATMENT_DELETE,
    CACHE_LOCALNAMES.ALLERGY_DELETE,
    CACHE_LOCALNAMES.GUIDANCE_DELETE,
    CACHE_LOCALNAMES.RIHABILY_DELETE,
    CACHE_LOCALNAMES.RADIATION_DELETE,
  ];
  
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  
  array_key.map(key=>{
    if (cacheObj != null && cacheObj[user_number] != undefined && cacheObj[user_number][patient_id] != undefined && cacheObj[user_number][patient_id][key] != undefined && cacheObj[user_number][patient_id][key].length > 0) {
      result = true;
    }
  });
  
  return result;
}


//set value to key of cache
export const setObjectToKey = (patient_id, key, obj) => {
  if (Object.keys(obj).length <= 0) return null;
  
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
  if(cacheObj == null) return null;
  if(cacheObj[user_number] == undefined) return null;
  if(cacheObj[user_number][patient_id] == undefined) return null;
  if(cacheObj[user_number][patient_id][key] == undefined){
    return null;
  }
  else {
    if (Object.keys(cacheObj[user_number][patient_id][key]).length > 0) {
      Object.keys(cacheObj[user_number][patient_id][key]).map(subkey=>{
        if(cacheObj[user_number][patient_id][key][subkey] != undefined){
          Object.keys(obj).map(item=>{
            if (key == CACHE_LOCALNAMES.PRESCRIPTION_EDIT || key == CACHE_LOCALNAMES.INJECTION_EDIT) {
              cacheObj[user_number][patient_id][key][subkey][0][item] = obj[item];
            } else if (key == CACHE_LOCALNAMES.EXAM_EDIT) {
              cacheObj[user_number][patient_id][key][item] = obj[item];
            } else {
              cacheObj[user_number][patient_id][key][subkey][item] = obj[item];
            }
          });
        }
      });
    } else {
      Object.keys(obj).map(item=>{
        cacheObj[user_number][patient_id][key][item] = obj.item;
      });
    }
  }
  
  localApi.setObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME, cacheObj);
}
//delete order category(prescription, injection) by cacheNumber group from cache
export const delCachePrescriptionByCacheNumber = (patient_id, key1, key2, cache_number) => {
  
  // let array_del_prescription_number = [];
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
  if (cacheObj != null && cacheObj[user_number] != undefined && cacheObj[user_number][patient_id] != undefined && cacheObj[user_number][patient_id][key1] != undefined && cacheObj[user_number][patient_id][key1].length > 0) {
    
    // ex: CACHE_LOCALNAMES.PRESCRIPTION_DELETE
    let del_array = cacheObj[user_number][patient_id][key1].filter(item=>{
      if (item.cacheSerialNumber != cache_number) {
        // array_del_prescription_number.push(item.number);
        return true;
      }
    });
    cacheObj[user_number][patient_id][key1] = del_array;
    
    // ex: CACHE_LOCALNAMES.PRESCRIPTION_DELETE_HISTORY
    if(cacheObj[user_number][patient_id][key2] != undefined && cacheObj[user_number][patient_id][key2].length > 0){
      let del_history_array = cacheObj[user_number][patient_id][key2].filter(item=>{
        if (item.cacheSerialNumber != cache_number) {
          // array_del_prescription_number.push(item.number);
          return true;
        }
      });
      
      cacheObj[user_number][patient_id][key2] = del_history_array;
    }
  }
  
  localApi.setObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME, cacheObj);
}

// check exist input or edit data
export const existInputOrEditData = (patient_id, key, cache_number) => {
  let ret = getVal(patient_id, key);
  
  if (ret == null || ret == undefined) return false;
  if (ret[cache_number] == undefined || ret[cache_number] == null) {
    return false;
  }
  
  return true;
}

// check exist delete data
export const existDeleteData = (patient_id, key, cache_number) => {
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  
  let result = {
    exist: false,
    numbers: 0
  };
  
  let _existtNumbers = 0;
  if (cacheObj != null &&
    cacheObj[user_number] != undefined &&
    cacheObj[user_number][patient_id] != undefined &&
    cacheObj[user_number][patient_id][key] != undefined &&
    cacheObj[user_number][patient_id][key].length > 0) {
    cacheObj[user_number][patient_id][key].map(ele=>{
      if (ele.cacheSerialNumber == cache_number) {
        result.exist = true;
        _existtNumbers ++;
      }
    });
  }
  result.numbers = _existtNumbers;
  
  return result;
}

const creatSealCache = (patient_id, key, subkey=0) =>{
  let fixed_val = null
  // ●YJ983 訪問診療では、登録時に印刷せず後で一括印刷できるように
  let patient_info = getVal(patient_id, "patient");  
  if (patient_info != undefined && patient_info != null && patient_info.karte_status != undefined && patient_info.karte_status.code != undefined && (patient_info.karte_status.code == "2" || patient_info.karte_status.code == 2)) {        
    fixed_val = 0;
  }
  
  let conf_data = sessApi.getObjectValue('init_status', "conf_data");
  let sticker_print_mode = conf_data.sticker_print_mode;
  if (sticker_print_mode == undefined || sticker_print_mode == null){
    return;
  }
  if(key == CACHE_LOCALNAMES.IN_HOSPITAL_EDIT){
    let cache_data = getVal(patient_id, CACHE_LOCALNAMES.IN_HOSPITAL_EDIT);
    if(cache_data.hospital_type == "in_decision"){
      key = "hospital_decision";
    } else {
      key = "hospital_application";
    }
  }
  if(key == CACHE_LOCALNAMES.DOCUMENT_CREATE){
    key = "document";
  }
  if(key == CACHE_LOCALNAMES.NUTRITION_GUIDANCE){
    key = "guidance_nutrition_order";
  }
  if (sticker_print_mode[key] == undefined) return;
  if (sticker_print_mode[key] == 0) return;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.HARUKA_SEAL_PRINT);
  if (cacheObj == null) cacheObj = {};
  let seal_value = getSealAllVal(patient_id);
  if (seal_value != null && Object.keys(seal_value).length > 0 && seal_value[key] != undefined && seal_value[key] != null &&
    Object.keys(seal_value[key]).length > 0 && seal_value[key][subkey] != undefined && seal_value[key][subkey] != null) return;
  if (seal_value == null || seal_value == undefined || seal_value.length == 0) seal_value = {};
  if (subkey == 0) {
    seal_value[key] = {[subkey]: sticker_print_mode[key] == 2 ? 1 : 0};
    if (fixed_val != null) seal_value[key] = fixed_val;
  } else {
    if (seal_value[key] == undefined || seal_value[key] == null || Object.keys(seal_value[key]).length == 0) {
      seal_value[key] = {[subkey]: sticker_print_mode[key] == 2 ? 1 : 0};
      if (fixed_val != null) seal_value[key] = fixed_val;
    }
    else {
      if (seal_value[key][subkey] == undefined || seal_value[key][subkey] == null || Object.keys(seal_value[key][subkey]).length == 0){
        seal_value[key][subkey] = sticker_print_mode[key] == 2 ? 1 : 0;
        if (fixed_val != null) seal_value[key][subkey] = fixed_val;
      }
    }
  }
  setSealAllVal(patient_id, seal_value);
}

// 死亡自、新規オーダーは禁止ですが、編集で処方内容を退院日付（＝死亡日付）までに短くしたり、退院一括削除で予約を取り消すような動作は必要なので、閲覧のみモードしか使えない形ではなく、オーダー発行機能を無効にするように
export const isDeathPatient = (patient_id) =>{
  let patient_info = getVal(patient_id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
  if (patient_info != null && patient_info != undefined && patient_info.is_death != undefined && patient_info.is_death == 1) {
    return true;
  }
  return false;
}


// ●期間の重複について
// 一旦下記のように、重複を同時登録しようとすることはできないように。
export const checkMealPeriod = (patient_id=null, _dateStart=null, _dateEnd=null, _cacheKey=null) =>{
  let result = true;
  if(patient_id == null || _dateStart == null) return false;
  
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return result;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.KARTE_CACHE_NAME);
  if(cacheObj == null) return result;
  if(cacheObj[user_number] == undefined) return result;
  if(cacheObj[user_number][patient_id] == undefined) return result;
  if(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.MEAL_EDIT] == undefined &&
    cacheObj[user_number][patient_id][CACHE_LOCALNAMES.MEAL_GROUP_EDIT] == undefined) return result;
  
  // check meal_edit
  if (cacheObj[user_number][patient_id][CACHE_LOCALNAMES.MEAL_EDIT] != undefined && Object.keys(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.MEAL_EDIT]).length > 0) {
    Object.keys(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.MEAL_EDIT]).map(key=>{
      if ((_cacheKey != null && _cacheKey != key) || _cacheKey == null) {
        if (_dateEnd == null) { // change meal check
          if (_dateStart == cacheObj[user_number][patient_id][CACHE_LOCALNAMES.MEAL_EDIT][key].start_date) {
            result = false;
          }
        } else { // group meal check
          let _dateStart_time = new Date(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.MEAL_EDIT][key].start_date.split("-").join("/") + " 00:00:00").getTime();
          let from_date = new Date(_dateStart.split("-").join("/") + " 00:00:00").getTime();
          let to_date = new Date(_dateEnd.split("-").join("/") + " 00:00:00").getTime();
          if (_dateStart_time >= from_date && _dateStart_time <= to_date) {
            result = false;
          }
        }
      }
    });
  }
  
  // check meal_group_edit
  if (cacheObj[user_number][patient_id][CACHE_LOCALNAMES.MEAL_GROUP_EDIT] != undefined && Object.keys(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.MEAL_GROUP_EDIT]).length > 0) {
    Object.keys(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.MEAL_GROUP_EDIT]).map(key=>{
      if ((_cacheKey != null && _cacheKey != key) || _cacheKey == null) {
        if (_dateEnd == null) { // change meal check
          let _dateStart_time = new Date(_dateStart.split("-").join("/") + " 00:00:00").getTime();
          let from_date = new Date(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.MEAL_GROUP_EDIT][key].start_date.split("-").join("/") + " 00:00:00").getTime();
          let to_date = new Date(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.MEAL_GROUP_EDIT][key].start_date_to.split("-").join("/") + " 00:00:00").getTime();
          if (_dateStart_time >= from_date && _dateStart_time <= to_date) {
            result = false;
          }
        } else { // group meal check
          let _dateStart_time = new Date(_dateStart.split("-").join("/") + " 00:00:00").getTime();
          let _dateEnd_time = new Date(_dateEnd.split("-").join("/") + " 00:00:00").getTime();
          let from_date = new Date(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.MEAL_GROUP_EDIT][key].start_date.split("-").join("/") + " 00:00:00").getTime();
          let to_date = new Date(cacheObj[user_number][patient_id][CACHE_LOCALNAMES.MEAL_GROUP_EDIT][key].start_date_to.split("-").join("/") + " 00:00:00").getTime();
          if ((_dateStart_time >= from_date && _dateStart_time <= to_date) || (_dateEnd_time >= from_date && _dateEnd_time <= to_date)) {
            result = false;
          }
          if ((from_date >= _dateStart_time && from_date <= _dateEnd_time) || (to_date >= _dateStart_time && to_date <= _dateEnd_time)) {
            result = false;
          }
        }
        
      }
    });
  }
  return result;
}

export const setPatientBeforePage=(patient_id, page_name)=>{
  let page_names = getVal(patient_id, CACHE_LOCALNAMES.BEFORE_PAGE);
  if(page_names === undefined || page_names == null){page_names = [];}
  page_names.push(page_name);
  setVal(patient_id, CACHE_LOCALNAMES.BEFORE_PAGE, JSON.stringify(page_names));
}

export const getPatientBeforePage=(patient_id)=>{
  let before_page = null;
  let page_names = getVal(patient_id, CACHE_LOCALNAMES.BEFORE_PAGE);
  if(page_names === undefined || page_names == null || page_names.length === 0){return before_page;}
  before_page = page_names[page_names.length - 1];
  delete page_names[page_names.length - 1];
  if(page_names.length === 0){
    delVal(patient_id, CACHE_LOCALNAMES.BEFORE_PAGE);
  } else {
    setVal(patient_id, CACHE_LOCALNAMES.BEFORE_PAGE, JSON.stringify(page_names));
  }
  return before_page;
}