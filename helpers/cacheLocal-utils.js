
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
  let cache = _getValue(key);
  if(cache == null) cache = {};
  cache[subkey] = value;
  _setValue(key, JSON.stringify(cache));
};

export const getObjectValue = (key, subkey) => {
  let cache = _getValue(key);
  if(cache == null) return null;
  cache = JSON.parse(cache);

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
  return window.localStorage.getItem(key);
}

const _setValue = (key, value) => {
  /*@cc_on _win = window; eval ( 'var window = _win') @*/
 window.localStorage.setItem(key, value); 
}

const _remove = (key) => {
  /*@cc_on _win = window; eval ( 'var window = _win') @*/
 window.localStorage.removeItem(key); 
}


