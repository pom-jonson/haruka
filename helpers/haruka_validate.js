import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES, checkSMPByUnicode} from "~/helpers/constants";
import {addRedBorder, removeRedBorder, addRequiredBg, removeRequiredBg} from '~/helpers/dialConstants'

export const harukaValidate = (category_type , page_type, page_name, value, view_type="border") => {
  var disable_utf_character = 1;
  let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
  if(initState !== undefined && initState != null && initState.conf_data !== undefined){
    if(initState.conf_data.disable_utf_character !== undefined){
      disable_utf_character = initState.conf_data.disable_utf_character;
    }
  }
  let haruka_validate = sessApi.getObject('haruka_validate');
  let validate_data = haruka_validate[category_type][page_type];
  let error_str_arr = [];
  let first_tag_id = '';
  let ret_val = {
    error_str_arr,
    first_tag_id,
  };
  if (page_name == undefined || page_name == null || page_name == "" ) return ret_val;
  if (value == undefined || value == null || value == '') return ret_val;
  if (validate_data == undefined || validate_data == null || validate_data == '') return ret_val;
  let page_validate = validate_data[page_name];
  if (page_validate == undefined || page_validate == null || Object.keys(page_validate).length == 0) return ret_val;
  if(view_type === "border"){
    Object.keys(page_validate).map(index=>{
      removeRedBorder(index + '_id');
    });
    Object.keys(page_validate).map(index=>{
      // require
      if(page_validate[index].is_required == 1){
        if (value[index] == undefined || value[index] == null || value[index] == '' ) {
          error_str_arr.push(page_validate[index].requierd_message);
          addRedBorder(index + '_id');
          if (first_tag_id == '') {
            first_tag_id = index + '_id';
          } 
        }
      }
      // length overflow
      if(page_validate[index].length != ''){
        if (value[index] !== undefined && value[index] != null && value[index] != '' && value[index].toString().length > page_validate[index].length) {
          error_str_arr.push(page_validate[index].overflow_message)
          addRedBorder(index + '_id');
          if (first_tag_id == '') {
            first_tag_id = index + '_id';
          } 
        }
      }
      // min
      if(page_validate[index].min != undefined){
        if (value[index] !== undefined && value[index] != null && value[index] != '' && parseFloat(value[index]) < parseFloat(page_validate[index].min)) {
          error_str_arr.push(page_validate[index].min_message)
          addRedBorder(index + '_id');
          if (first_tag_id == '') {
            first_tag_id = index + '_id';
          } 
        }
      }
      // max
      if(page_validate[index].max != undefined){
        if (value[index] !== undefined && value[index] != null && value[index] != '' && parseFloat(value[index]) > parseFloat(page_validate[index].max)) {
          error_str_arr.push(page_validate[index].max_message)
          addRedBorder(index + '_id');
          if (first_tag_id == '') {
            first_tag_id = index + '_id';
          } 
        }
      }
      //type error
      if (disable_utf_character == 1){
        if(page_validate[index].type_error_message != undefined && page_validate[index].type_error_message != ''){
          if (checkSMPByUnicode(value[index])){
            error_str_arr.push(page_validate[index].type_error_message);
              addRedBorder(index + '_id');
            if (first_tag_id == '') {
              first_tag_id = index + '_id';
            } 
          }
        }
      }
      
    });
    ret_val.error_str_arr = error_str_arr;
    ret_val.first_tag_id = first_tag_id;
    return ret_val;
  } else if(view_type === "background"){
    Object.keys(page_validate).map(index=>{
      // require
      if(page_validate[index].is_required == 1){
        if (value[index] == undefined || value[index] == null || value[index] == '' ) {
          addRequiredBg(index + '_id');          
        } else {
          removeRequiredBg(index + '_id');
        }
      }
    });
  }
};
