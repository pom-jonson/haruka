import axios from "axios";

/**
 * GETリクエストを送信します.
 * @param {*} path 呼び出しURL
 * @param {*} params パラメータ
 */
export const get = async (path, params) => {
  let res;
  try {
    res = await axios.get(path, params);
  } catch (error) {
    handleError(error);
  }
  return res.data;
};

export const _get = async (path, params) => {
  let res;
  try {
    res = await axios.get(path, params);
  } catch (error) {
    if (error.response.data) {
      const { error_action } = error.response.data;
      if (error_action && "force_logout" === error_action) {
        window.sessionStorage.setItem("force_logout", "1");
        this.context.$forceLogout();
      }
    }
    throw error;
  }
  return res.data;
};


export const post = async (path, params) => {
  let res;
  try {
    res = await axios.post(path, params);
  } catch (error) {
    handleError(error);
  }
  return res.data;
};

export const _post = async (path, params) => {
  let res;
  try {
    res = await axios.post(path, params);
  } catch (error) {
    if (error.response.data) {
      const { error_action } = error.response.data;
      if (error_action && "force_logout" === error_action) {
        window.sessionStorage.setItem("force_logout", "1");
        this.context.$forceLogout();
      }
    }
    throw error;
  }
  return res.data;
};

const handleError = error => {
  /* eslint-disable no-console */
  // console.log("apiClient GET failed.", error);
  if (error.response.data) {
    const { error_action, error_messages } = error.response.data;
    if (error_action && "force_logout" === error_action) {
      window.sessionStorage.setItem("force_logout", "1");
      if(this.context != undefined){
        this.context.$forceLogout();
      }
    } else if (error_messages) {
      window.sessionStorage.setItem("alert_messages", error_messages);
    } else {
      window.sessionStorage.setItem("alert_messages", "通信に失敗しました。");
    }
  }
  throw error;
};
