import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES, checkSMPByUnicode} from "~/helpers/constants";
import {addRedBorder, removeRedBorder, addRequiredBg, removeRequiredBg} from '~/helpers/dialConstants'

export const haruka_validate_state_to_config = (category_type , page_type, page_name, state_data, view_type="border") => { //ステータス変数を基準に判定
  let disable_utf_character = 1;
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
  if (page_name === undefined || page_name == null || page_name === ""){return ret_val;}
  if (state_data === undefined || state_data == null || state_data === ''){return ret_val;}
  if (validate_data === undefined || validate_data == null || validate_data === ''){return ret_val;}
  let page_validate = validate_data[page_name];
  if (page_validate === undefined || page_validate == null || Object.keys(page_validate).length === 0){return ret_val;}
  if(view_type === "border"){
    Object.keys(page_validate).map(index=>{
      removeRedBorder(index + '_id');
    });
    Object.keys(state_data).map(state_name=>{
      if(page_validate[state_name] !== undefined){
        if(page_validate[state_name].is_required == 1){ // require
          if(state_data[state_name] === undefined || state_data[state_name] == null || state_data[state_name] == '') {
            error_str_arr.push(page_validate[state_name].requierd_message);
            addRedBorder(state_name + '_id');
            if(first_tag_id === ''){first_tag_id = state_name + '_id';}
          }
          if(page_validate[state_name].length != ''){ // length overflow
            if (state_data[state_name] !== undefined && state_data[state_name] != null && state_data[state_name] != '' && state_data[state_name].toString().length > page_validate[state_name].length) {
              error_str_arr.push(page_validate[state_name].overflow_message);
              addRedBorder(state_name + '_id');
              if(first_tag_id === ''){first_tag_id = state_name + '_id';}
            }
          }
        }
        if(page_validate[state_name].min !== undefined){ // min
          if(state_data[state_name] !== undefined && state_data[state_name] != null && state_data[state_name] != '' && parseFloat(state_data[state_name]) < parseFloat(page_validate[state_name].min)){
            error_str_arr.push(page_validate[state_name].min_message);
            addRedBorder(state_name + '_id');
            if(first_tag_id === ''){first_tag_id = state_name + '_id';}
          }
        }
        if(page_validate[state_name].max !== undefined){ // max
          if(state_data[state_name] !== undefined && state_data[state_name] != null && state_data[state_name] != '' && parseFloat(state_data[state_name]) > parseFloat(page_validate[state_name].max)) {
            error_str_arr.push(page_validate[state_name].max_message);
            addRedBorder(state_name + '_id');
            if(first_tag_id === ''){first_tag_id = state_name + '_id';}
          }
        }
        if(disable_utf_character == 1 && page_validate[state_name].type_error_message !== undefined && page_validate[state_name].type_error_message != ''){//type error
          if(checkSMPByUnicode(state_data[state_name])){
            error_str_arr.push(page_validate[state_name].type_error_message);
            addRedBorder(state_name + '_id');
            if(first_tag_id === ''){first_tag_id = state_name + '_id';}
          }
        }
      }
    });
    ret_val.error_str_arr = error_str_arr;
    ret_val.first_tag_id = first_tag_id;
    return ret_val;
  } else if(view_type === "background"){
    Object.keys(state_data).map(state_name=>{
      if(page_validate[state_name] !== undefined && page_validate[state_name].is_required == 1){
        if(state_data[state_name] === undefined || state_data[state_name] == null || state_data[state_name] == '') {
          addRequiredBg(state_name + '_id');
        } else {
          removeRequiredBg(state_name + '_id');
        }
      }
    });
  }
};
