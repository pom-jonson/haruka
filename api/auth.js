import axios from "axios";
import { IS_DEVELOP } from "~/helpers/constants";
import * as localApi from "~/helpers/cacheLocal-utils";
import { CACHE_LOCALNAMES} from "~/helpers/constants";

const fakeAuthClient = ({ id, password }) =>
  new Promise(resolve => {
    if (id === "test" && password === "pass") {
      setTimeout(
        () =>
          resolve({
            status: 200,
            data: {
              token: "dummyToken",
              expiresAt: Math.floor(
                (new Date().getTime() + 1000 * 60 * 60 * 8) / 1000
              )
            }
          }),
        1500
      );
    } else {
      window.alert(
        "以下のID, Password を使用してください。\n ID: test / Pass: pass"
      );
      resolve({ status: 500, data: 'ID: "test" / Password: "pass"' });
    }
  });

class Auth {
  initialAuthState = {
    token: "",
    expiresAt: Math.floor(new Date().getTime() / 1000)
  };
  
  authState = this.initialAuthState;
  
  _setState({
              persist,
              state: {
                token,
                expiresAt,
                name,
                department,
                medical_department_name,
                staff_category,
                doctor_code,
                doctor_number,
                duties_department,
                duties_department_name,
                user_number,
                user_ward_id,
                feature_auth,
                common_auth,
                menu_auth,
                ip_addr,
                operationTimeout,
                operationWarningTime,
                default_prescription_start_date_offset,
                karte_entrance_page,
                enable_screen_capture,
                screen_capture_type,
                screen_capture_maxwidth,
                home_page,
                screen_capture_maxkb,
                timeout_json,
                auth_ward_id
              }
            }) {
    const newState = {
      ...this.authState,
      token,
      expiresAt,
      name,
      department,
      medical_department_name,
      staff_category,
      doctor_code,
      doctor_number,
      duties_department,
      duties_department_name,
      user_number,
      user_ward_id,
      feature_auth,
      common_auth,
      menu_auth,
      ip_addr,
      operationTimeout,
      operationWarningTime,
      default_prescription_start_date_offset,
      karte_entrance_page,
      enable_screen_capture,
      screen_capture_type,
      screen_capture_maxwidth,
      home_page,
      screen_capture_maxkb,
      timeout_json,
      auth_ward_id,
    };
    this.authState = newState;
    const newStateStr = JSON.stringify(newState);
    window.sessionStorage.setItem("haruka", newStateStr);
    if (persist) window.localStorage.setItem("haruka", newStateStr);
  }
  
  _validateStatus(status) {
    return 200 <= status && status < 300;
  }
  
  async refreshAuth(page) {
    const { data, status } = await axios.post(
      "/app/api/v2/connection/regenerate_token",
      { page }
    );
    if (!this._validateStatus(status)) {
      throw new Error(
        `[${status}] Failed Re-generate token. ${
          typeof data === "string" ? data : ""
          }`
      );
    }
    const { token, expiresAt, concurrent_access_users } = data;
    this.authState.token = token;
    this.authState.expiresAt = expiresAt;
    const newStateStr = JSON.stringify(this.authState);
    window.sessionStorage.setItem("haruka", newStateStr);
    window.sessionStorage.setItem("concurrent_access_users", JSON.stringify(concurrent_access_users));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  
  checkPatientReadingState = async(patient_id) => {
    const { data } = await axios.post(
      "/app/api/v2/connection/checkPatients", {patient_id:patient_id});
    var {concurrent_access_users} = data;
    window.sessionStorage.setItem("concurrent_access_users", JSON.stringify(concurrent_access_users));
  }
  
  async _fetchAuth({ id, password, token }) {
    /* (2019/03/28) Use http://localhost/app/api/v2/auth/login to test with back-end on local env. */    

    const { data, status } = IS_DEVELOP
      ? await fakeAuthClient({ id, password, token })
      : await axios.post("/app/api/v2/auth/login", {
        id,
        password,
        token
      });
    
    if (!this._validateStatus(status))
      throw new Error(
        `[${status}] Failed Sign-in. ${typeof data === "string" ? data : ""}`
      );
    
    const {
      token: newToken,
      expiresAt,
      name,
      department,
      medical_department_name,
      staff_category,
      doctor_code,
      doctor_number,
      duties_department,
      duties_department_name,
      user_number,
      user_ward_id,
      feature_auth,
      common_auth,
      menu_auth,
      ip_addr,
      operationTimeout,
      operationWarningTime,
      default_prescription_start_date_offset,
      karte_entrance_page,
      enable_screen_capture,
      screen_capture_type,
      screen_capture_maxwidth,
      home_page,
      screen_capture_maxkb,
      timeout_json,
      auth_ward_id,
    } = data;
    return {
      token: newToken,
      expiresAt,
      name,
      department,
      medical_department_name,
      staff_category,
      doctor_code,
      doctor_number,
      duties_department,
      duties_department_name,
      user_number,
      user_ward_id,
      feature_auth,
      common_auth,
      menu_auth,
      ip_addr,
      operationTimeout,
      operationWarningTime,
      default_prescription_start_date_offset,
      karte_entrance_page,
      enable_screen_capture,
      screen_capture_type,
      screen_capture_maxwidth,
      home_page,
      screen_capture_maxkb,
      timeout_json,
      auth_ward_id,
    };
  }
  
  _activateAuth({
                  token,
                  expiresAt,
                  name,
                  department,
                  medical_department_name,
                  stayLogin,
                  staff_category,
                  doctor_code,
                  doctor_number,
                  duties_department,
                  duties_department_name,
                  user_number,
                  user_ward_id,
                  feature_auth,
                  common_auth,
                  menu_auth,
                  ip_addr,
                  operationTimeout,
                  operationWarningTime,
                  default_prescription_start_date_offset,
                  karte_entrance_page,
                  enable_screen_capture,
                  screen_capture_type,
                  screen_capture_maxwidth,
                  home_page,
                  screen_capture_maxkb,
                  timeout_json,
                  auth_ward_id,
                }) {
    this._setState({
      persist: stayLogin,
      state: {
        token,
        expiresAt,
        name,
        department,
        medical_department_name,
        staff_category,
        doctor_code,
        doctor_number,
        duties_department,
        duties_department_name,
        user_number,
        user_ward_id,
        feature_auth,
        common_auth,
        menu_auth,
        ip_addr,
        operationTimeout,
        operationWarningTime,
        default_prescription_start_date_offset,
        karte_entrance_page,
        enable_screen_capture,
        screen_capture_type,
        screen_capture_maxwidth,
        home_page,
        screen_capture_maxkb,
        timeout_json,
        auth_ward_id,
      }
    });
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  
  isAuthenticated = () => {
    return Math.floor(new Date().getTime() / 1000) < this.authState.expiresAt;
  };
  
  silentAuth = () => {
    const persistState = JSON.parse(
      window.sessionStorage.getItem("haruka") ||
      window.localStorage.getItem("haruka")
    );
    if (!persistState) return;
    this._activateAuth({ stayLogin: true, ...persistState });
  };
  
  signIn = async (arg = {}) => {
    axios.defaults.headers.common["Authorization"] = "";
    window.localStorage.removeItem("haruka");
    window.sessionStorage.removeItem("haruka");
    window.sessionStorage.removeItem("is_logout");
    const defaultArg = { id: "", password: "", stayLogin: false };
    const { id, password, stayLogin } = { ...defaultArg, ...arg };
    
    try {
      const {
        token,
        expiresAt,
        name,
        department,
        medical_department_name,
        staff_category,
        doctor_code,
        doctor_number,
        duties_department,
        duties_department_name,
        user_number,
        user_ward_id,
        feature_auth,
        common_auth,
        menu_auth,
        ip_addr,
        operationTimeout,
        operationWarningTime,
        default_prescription_start_date_offset,
        karte_entrance_page,
        enable_screen_capture,
        screen_capture_type,
        screen_capture_maxwidth,
        home_page,
        screen_capture_maxkb,
        timeout_json,
        auth_ward_id,
      } = await this._fetchAuth({ id, password });
      this._activateAuth({
        token,
        expiresAt,
        name,
        department,
        medical_department_name,
        stayLogin,
        staff_category,
        doctor_code,
        doctor_number,
        duties_department,
        duties_department_name,
        user_number,
        user_ward_id,
        feature_auth,
        common_auth,
        menu_auth,
        ip_addr,
        operationTimeout,
        operationWarningTime,
        default_prescription_start_date_offset,
        karte_entrance_page,
        enable_screen_capture,
        screen_capture_type,
        screen_capture_maxwidth,
        home_page,
        screen_capture_maxkb,
        timeout_json,
        auth_ward_id,
      });
      window.sessionStorage.setItem("first_login", 1);
      return true;
    } catch (err) {
      /* eslint-disable no-console */
      if (IS_DEVELOP) console.error(err);
      return false;
    }
  };

  getLogType = (type="", signOutType="") => {
    let result = {op_screen:"", op_type:""};

      // ・手動ログアウト実行も記録する（ログアウト直前にsqlite用ログ提出と一緒に行うなど）
      if (type == "force_out") {
        result.op_screen = "ログアウト";
        result.op_type = "ログアウト";
      }

      // ・切替モードに変更する仮ログアウト動作は区別して記録する
      if (type == "temporary_login" && signOutType == "temp_logOut") {
        result.op_screen = "一時利用";
        result.op_type = "一時ログアウト";
      }      

      // ・一時利用中のユーザーの手動ログアウトも区別する。
      if (type == "temporary_login" && signOutType == "force_logOut") {
        result.op_screen = "一時利用";
        result.op_type = "一時利用終了";
      }

      if (signOutType == "auto_logOut") {
        if (type == "temporary_login") {
          // ・一時利用中のユーザーが自動でログアウトも区別する。
          result.op_screen = "一時利用";
          result.op_type = "自動ログアウト";
        } else {
          // ・無操作での自動ログアウトは区別して記録する。
          result.op_screen = "ログアウト";
          result.op_type = "自動ログアウト";
        }
      }

    return result;

  }
  
  signOut = (type=null, temporaryUserInfo=null, signOutType=null) => {

    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let init_status = JSON.parse(window.sessionStorage.getItem("init_status"));
    if (type == "reload" ) {
      if (init_status == undefined || init_status == null) return;
      let conf_data = init_status.conf_data;
      if (conf_data !== undefined && conf_data != null && conf_data.error_auto_reload == "ON") {
        let last_path = window.location.href;
        last_path = last_path.split("#");
        let last_path_url = last_path[1];
        let count_error = window.sessionStorage.getItem("count_error");
        if (count_error !== undefined && count_error != null && count_error > 0) {
          window.sessionStorage.removeItem("count_error");
        } else {
          window.sessionStorage.setItem("last_url", last_path_url);
          window.sessionStorage.setItem("count_error", 1);
          return;
        }
      }
    }

    // ●YJ777 MySQLに保存するほうの操作ログの改善
    let log_type = this.getLogType(type, signOutType);


    if (authInfo != undefined && authInfo != null && authInfo.user_number != undefined && authInfo.user_number != null) {
      let path = "/app/api/v2/connection/log_out";
      axios.post(
        path,
        { staff_number: authInfo.user_number, log_type: log_type}
      );
    }
    this.authState = this.initialAuthState;
    axios.defaults.headers.common["Authorization"] = "";
    let conf_data = init_status != null ? init_status.conf_data : null;
    if (conf_data !== undefined && conf_data != null && conf_data.enable_ordering_karte == "ON") {
      if (type != "temporary_login") {
        if (type != "force_out") {
          let haruka_cache_karte = localApi.getObject("haruka_cache_karte");
          window.sessionStorage.clear();
          window.localStorage.clear();
          window.sessionStorage.setItem("is_logout",1);
          localApi.setObject("haruka_cache_karte", haruka_cache_karte);
        } else {
          window.sessionStorage.clear();
          window.localStorage.clear();
          window.sessionStorage.setItem("is_logout",1);
        }
      } else {
        window.localStorage.removeItem("haruka");
        window.sessionStorage.removeItem("haruka");
      }
    } else {
      let dr_karte_cache = localApi.getObject('dr_karte_cache');
      window.sessionStorage.clear();
      window.localStorage.clear();
      if (dr_karte_cache !== undefined && dr_karte_cache != null) localApi.setObject("dr_karte_cache", dr_karte_cache);
    }
    // ●YJ782 離席/切替機能の調整
    if (temporaryUserInfo != null) {
      localApi.setValue(CACHE_LOCALNAMES.TEMPORARYUSER, JSON.stringify(temporaryUserInfo));
    }
    //一覧系患者ID、名 削除
    localApi.remove('patient_list_schVal');
    //受付一覧の担当科 削除
    localApi.remove('patient_list_search_department');
    localApi.remove('select_menu_info');
    localApi.remove("current_system_patient_id");
  };
}

export default new Auth();