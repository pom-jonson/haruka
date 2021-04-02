import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import {addRedBorder, removeRedBorder, addRequiredBg, removeRequiredBg} from '~/helpers/dialConstants'

export const patternValidate = (pattern, value, view_type="border") => {
  let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
  let dial_pattern_validate = init_status.dial_pattern_validate;
  let error_str_arr = [];
  let first_tag_id = '';
  let ret_val = {
    error_str_arr,
    first_tag_id,
  };
  if (pattern == undefined || pattern == null || pattern == "" ) return ret_val;
  if (value == undefined || value == null || value == '') return ret_val;
  if (dial_pattern_validate == undefined || dial_pattern_validate == null || dial_pattern_validate == '') return ret_val;
  let pattern_validate = dial_pattern_validate[pattern];
  if (pattern_validate == undefined || pattern_validate == null || Object.keys(pattern_validate).length == 0) return ret_val;
  if (view_type == 'border'){
  Object.keys(pattern_validate).map(index=>{
    // require
    if(pattern_validate[index].is_required == 1){
      if (value[index] == undefined || value[index] == null || value[index] == '' || value[index] == 0) {
        error_str_arr.push(pattern_validate[index].requierd_message);
        addRedBorder(index + '_id');
        if (first_tag_id == '') first_tag_id = index + '_id';
      }
    }
    // length overflow
    if(pattern_validate[index].length != ''){
      if (value[index] !== undefined && value[index] != null && value[index] != '' && value[index].toString().length > pattern_validate[index].length) {
        error_str_arr.push(pattern_validate[index].overflow_message)
        addRedBorder(index + '_id');
        if (first_tag_id == '') first_tag_id = index + '_id';
      }
    }
  });
  ret_val.error_str_arr = error_str_arr;
  ret_val.first_tag_id = first_tag_id;
  return ret_val;
  } else if(view_type === "background"){
    Object.keys(pattern_validate).map(index=>{
      // require
      if(pattern_validate[index].is_required == 1){
        if (value[index] == undefined || value[index] == null || value[index] == '' ) {
          addRequiredBg(index + '_id');
        } else {
          removeRequiredBg(index + '_id');
        }
      }
    });
  }
};

export const masterValidate = (master, value, view_type="border") => {
  let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
  let dial_master_validate = init_status.dial_master_validate;
  let error_str_arr = [];
  let first_tag_id = '';
  let ret_val = {
    error_str_arr,
    first_tag_id,
  };
  if (master == undefined || master == null || master == "" ) return ret_val;
  if (value == undefined || value == null || value == '') return ret_val;
  if (dial_master_validate == undefined || dial_master_validate == null || dial_master_validate == '') return ret_val;
  let master_validate = dial_master_validate[master];
  if (master_validate == undefined || master_validate == null || Object.keys(master_validate).length == 0) return ret_val;
  if (view_type == 'border') {
    Object.keys(master_validate).map(index=>{
      // require
      if(master_validate[index].is_required == 1){
        if (value[index] == undefined || value[index] == null || value[index] == '' ) {
          error_str_arr.push(master_validate[index].requierd_message);
          addRedBorder(index + '_id');
          if (first_tag_id == '') first_tag_id = index + '_id';
        }
      }
      // length overflow
      if(master_validate[index].length != ''){
        if (value[index] !== undefined && value[index] != null && value[index] != '' && value[index].toString().length > master_validate[index].length) {
          error_str_arr.push(master_validate[index].overflow_message)
          addRedBorder(index + '_id');
          if (first_tag_id == '') first_tag_id = index + '_id';
        }
      }
    });
    ret_val.error_str_arr = error_str_arr;
    ret_val.first_tag_id = first_tag_id;
    return ret_val;
  } else if(view_type === "background"){
    Object.keys(master_validate).map(index=>{
      // require
      if(master_validate[index].is_required == 1){
        if (value[index] == undefined || value[index] == null || value[index] == '' ) {
          addRequiredBg(index + '_id');
        } else {
          removeRequiredBg(index + '_id');
        }
      }
    });
  }
};

export const medicalInformationValidate = (master, value, view_type="border") => {
  let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
  let dial_master_validate = init_status.dial_medical_information_validate;
  let error_str_arr = [];
  let first_tag_id = '';
  let ret_val = {
    error_str_arr,
    first_tag_id,
  };
  if (master == undefined || master == null || master == "" ) return ret_val;
  if (value == undefined || value == null || value == '') return ret_val;
  if (dial_master_validate == undefined || dial_master_validate == null || dial_master_validate == '') return ret_val;
  let master_validate = dial_master_validate[master];
  if (master_validate == undefined || master_validate == null || Object.keys(master_validate).length == 0) return ret_val;
  if(view_type === "border"){
    Object.keys(master_validate).map(index=>{
      removeRedBorder(index + '_id');
    });
    Object.keys(master_validate).map(index=>{
      // require
      if(master_validate[index].is_required == 1){
        if (value[index] == undefined || value[index] == null || value[index] == '' ) {
          error_str_arr.push(master_validate[index].requierd_message);
          addRedBorder(index + '_id');
          if (first_tag_id == '') first_tag_id = index + '_id';
        }
      }
      // length overflow
      if(master_validate[index].length != ''){
        if (value[index] !== undefined && value[index] != null && value[index] != '' && value[index].toString().length > master_validate[index].length) {
          error_str_arr.push(master_validate[index].overflow_message)
          addRedBorder(index + '_id');
          if (first_tag_id == '') first_tag_id = index + '_id';
        }
      }
    });
    ret_val.error_str_arr = error_str_arr;
    ret_val.first_tag_id = first_tag_id;
    return ret_val;
  } else if(view_type === "background"){
    Object.keys(master_validate).map(index=>{
      // require
      if(master_validate[index].is_required == 1){
        if (value[index] == undefined || value[index] == null || value[index] == '' ) {
          addRequiredBg(index + '_id');
        } else {
          removeRequiredBg(index + '_id');
        }
      }
    });
  }
};

export const scheduleValidate = (master, value, view_type="border") => {
  let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
  let dial_schedule_validate = init_status.dial_schedule_validate;
  let error_str_arr = [];
  let first_tag_id = '';
  let ret_val = {
    error_str_arr,
    first_tag_id,
  };
  if (master == undefined || master == null || master == "" ) return ret_val;
  if (value == undefined || value == null || value == '') return ret_val;
  if (dial_schedule_validate == undefined || dial_schedule_validate == null || dial_schedule_validate == '') return ret_val;
  let master_validate = dial_schedule_validate[master];
  if (master_validate == undefined || master_validate == null || Object.keys(master_validate).length == 0) return ret_val;
  if(view_type === "border"){
    Object.keys(master_validate).map(index=>{
      removeRedBorder(index + '_id');
    });
    Object.keys(master_validate).map(index=>{
      // require
      if(master_validate[index].is_required == 1){
        if (value[index] == undefined || value[index] == null || value[index] == '' ) {
          error_str_arr.push(master_validate[index].requierd_message);
          addRedBorder(index + '_id');
          if (first_tag_id == '') first_tag_id = index + '_id';
        }
      }
      // length overflow
      if(master_validate[index].length != ''){
        if (value[index] !== undefined && value[index] != null && value[index] != '' && value[index].toString().length > master_validate[index].length) {
          error_str_arr.push(master_validate[index].overflow_message)
          addRedBorder(index + '_id');
          if (first_tag_id == '') first_tag_id = index + '_id';
        }
      }
    });
    ret_val.error_str_arr = error_str_arr;
    ret_val.first_tag_id = first_tag_id;
    return ret_val;
  } else if(view_type === "background"){
    Object.keys(master_validate).map(index=>{
      // require
      if(master_validate[index].is_required == 1){
        if (value[index] == undefined || value[index] == null || value[index] == '' ) {
          addRequiredBg(index + '_id');
        } else {
          removeRequiredBg(index + '_id');
        }
      }
    });
  }
};

export const printValidate = (master, value, view_type="border") => {
  let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
  let dial_print_validate = init_status.dial_print_validate;
  let error_str_arr = [];
  let first_tag_id = '';
  let ret_val = {
    error_str_arr,
    first_tag_id,
  };
  if (master == undefined || master == null || master == "" ) return ret_val;
  if (value == undefined || value == null || value == '') return ret_val;
  if (dial_print_validate == undefined || dial_print_validate == null || dial_print_validate == '') return ret_val;
  let master_validate = dial_print_validate[master];
  if (master_validate == undefined || master_validate == null || Object.keys(master_validate).length == 0) return ret_val;
  
  if(view_type === "border"){
    Object.keys(master_validate).map(index=>{
      // require
      if(master_validate[index].is_required == 1){        
        if (value[index] == undefined || value[index] == null || value[index] == '' ) {
          error_str_arr.push(master_validate[index].requierd_message);
          addRedBorder(index + '_id');
          if (first_tag_id == '') first_tag_id = index + '_id';
        }
      }
      // length overflow
      if(master_validate[index].length != ''){
        if (value[index] !== undefined && value[index] != null && value[index] != '' && value[index].toString().length > master_validate[index].length) {
          error_str_arr.push(master_validate[index].overflow_message)
          addRedBorder(index + '_id');
          if (first_tag_id == '') first_tag_id = index + '_id';
        }
      }
    });
  } else if(view_type === "background"){
    Object.keys(master_validate).map(index=>{
      // require
      if(master_validate[index].is_required == 1){
        if (value[index] == undefined || value[index] == null || value[index] == '' ) {
          addRequiredBg(index + '_id');
        } else {
          removeRequiredBg(index + '_id');
        }
      }
    });
  }
  
  ret_val.error_str_arr = error_str_arr;
  ret_val.first_tag_id = first_tag_id;
  return ret_val;
};

export const dialOtherValidate = (master, value, view_type="border") => {
  let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
  let dial_master_validate = init_status.dial_other_validate;
  let error_str_arr = [];
  let first_tag_id = '';
  let ret_val = {
    error_str_arr,
    first_tag_id,
  };
  if (master == undefined || master == null || master == "" ) return ret_val;
  if (value == undefined || value == null || value == '') return ret_val;
  if (dial_master_validate == undefined || dial_master_validate == null || dial_master_validate == '') return ret_val;
  let master_validate = dial_master_validate[master];
  if (master_validate == undefined || master_validate == null || Object.keys(master_validate).length == 0) return ret_val;
  if(view_type === "border"){
    Object.keys(master_validate).map(index=>{
      removeRedBorder(index + '_id');
    });
    Object.keys(master_validate).map(index=>{
      // require
      if(master_validate[index].is_required == 1){
        if (value[index] == undefined || value[index] == null || value[index] == '' ) {
          error_str_arr.push(master_validate[index].requierd_message);
          addRedBorder(index + '_id');
          if (first_tag_id == '') first_tag_id = index + '_id';
        }
      }
      // length overflow
      if(master_validate[index].length != ''){
        if (value[index] !== undefined && value[index] != null && value[index] != '' && value[index].toString().length > master_validate[index].length) {
          error_str_arr.push(master_validate[index].overflow_message)
          addRedBorder(index + '_id');
          if (first_tag_id == '') first_tag_id = index + '_id';
        }
      }
    });
    ret_val.error_str_arr = error_str_arr;
    ret_val.first_tag_id = first_tag_id;
    return ret_val;
  } else if(view_type === "background"){
    Object.keys(master_validate).map(index=>{
      // require
      if(master_validate[index].is_required == 1){
        if (value[index] == undefined || value[index] == null || value[index] == '' ) {
          addRequiredBg(index + '_id');
        } else {
          removeRequiredBg(index + '_id');
        }
      }
    });
  }
};