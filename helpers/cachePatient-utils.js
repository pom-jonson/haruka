import * as localApi from "~/helpers/cacheLocal-utils";
import { CACHE_LOCALNAMES} from "~/helpers/constants";

const getAuthInfo = () => {
  /*@cc_on _win = window; eval ( 'var window = _win') @*/
  return JSON.parse(window.sessionStorage.getItem("haruka"));
}

export const setVal = (patient_id, key, value) => {
  let auth_info = getAuthInfo();
  if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
  let user_number = auth_info.user_number;
  let cacheObj = localApi.getObject(CACHE_LOCALNAMES.PATIENT_CACHE_NAME);
  if(cacheObj == null) cacheObj = {};
  if(cacheObj[user_number] == undefined) cacheObj[user_number] = {};
  if(cacheObj[user_number][patient_id] == undefined) cacheObj[user_number][patient_id] = {};  
  cacheObj[user_number][patient_id][key] = JSON.parse(value);    
  localApi.setObject(CACHE_LOCALNAMES.PATIENT_CACHE_NAME, cacheObj);
}

export const getVal = (patient_id, key) => {
    let auth_info = getAuthInfo();
    if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
    let user_number = auth_info.user_number;
    let cacheObj = localApi.getObject(CACHE_LOCALNAMES.PATIENT_CACHE_NAME);
    if(cacheObj == null) return null;
    if(cacheObj[user_number] == undefined) return null;
    if(cacheObj[user_number][patient_id] == undefined) return null;
    if(cacheObj[user_number][patient_id][key] == undefined) return null;
    return cacheObj[user_number][patient_id][key];
}

export const delVal = (patient_id, key) => {
    let auth_info = getAuthInfo();
    if (auth_info == undefined || auth_info == null || auth_info.user_number == undefined || auth_info.user_number == null) return;
    let user_number = auth_info.user_number;
    let cacheObj = localApi.getObject(CACHE_LOCALNAMES.PATIENT_CACHE_NAME);
    if(cacheObj == null) return;
    if(cacheObj[user_number] == undefined) return;
    if(cacheObj[user_number][patient_id] == undefined) return;
    if(cacheObj[user_number][patient_id][key] == undefined) return;
    delete cacheObj[user_number][patient_id][key];   

    let arr = Object.keys(cacheObj[user_number][patient_id]);
    if(arr.length == 0) {
      delete cacheObj[user_number][patient_id];      
    }   
    localApi.setObject(CACHE_LOCALNAMES.PATIENT_CACHE_NAME, cacheObj);
}
