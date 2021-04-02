
export const setValue =  (key, value) => {
  _setValue(key, value);
}

export const getValue = (key) => {
  return _getValue(key);
}

export const remove = (key) => {
  _remove(key);
}

export const setObject = (key, value) => {
  _setValue(key, JSON.stringify(value));
}

export const getObject = (key) => {
  let cache = _getValue(key);
  if(cache == null) return null;
  return JSON.parse(cache);
}

export const setObjectValue = (key, subkey, value) => {
  let cache = getObjectValue(key );
  if(cache == null) cache = {};
  // if(cache[subkey] == undefined) cache[subkey] = {};
  cache[subkey] = value;
  _setValue(key, JSON.stringify(cache));
};

export const getObjectValue = (key, subkey) => {
  let cache = _getValue(key);
  if(cache == null) return null;
  cache = JSON.parse(cache);
  if(subkey == undefined || subkey == null) return cache;
  if(cache[subkey] == undefined) return null;
  return cache[subkey];
};

export const delObjectValue = (key, subkey) => {
  let cache = _getValue(key);
  if(cache == null) return;
  cache = JSON.parse(cache);  
  if(cache[subkey] == undefined) return;
  delete cache[subkey];

  _setValue(key, JSON.stringify(cache));
};


const _getValue = (key) => {
  /*@cc_on _win = window; eval ( 'var window = _win') @*/
  return window.sessionStorage.getItem(key);
}

const _setValue = (key, value) => {
  /*@cc_on _win = window; eval ( 'var window = _win') @*/
 window.sessionStorage.setItem(key, value); 
}

const _remove = (key) => {
  /*@cc_on _win = window; eval ( 'var window = _win') @*/
 window.sessionStorage.removeItem(key); 
}

// 医師リスト取得
export const getDoctorList = () => {
    let init_status = getObject("init_status");
    if (init_status != null && init_status != undefined && init_status.doctors_list != undefined && init_status.doctors_list != null) {
            return init_status.doctors_list
    } else {
        return null;
    }
};

// staffリスト取得
export const getStaffList = (category=null) => {
    let init_status = getObject("init_status");
    if (init_status != null && init_status != undefined && init_status.staffs_list != undefined && init_status.staffs_list != null) {
      if(category != null){
        let nurse_list = [];
        if(Object.keys(init_status.staffs_list).length > 0){
          Object.keys(init_status.staffs_list).map(staff_number=>{
            if(init_status.staffs_list[staff_number]['category'] == 2){
              nurse_list.push({id:staff_number, value:init_status.staffs_list[staff_number]['name']});
            }
          })
        }
        return nurse_list;
      } else {
        return init_status.staffs_list;
      }
    } else {
        return null;
    }
};




