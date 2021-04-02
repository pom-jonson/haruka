import React from "react";
import styled from "styled-components";
import Img from "../_demo/logo.png";
import Card from "../atoms/Card";
import Button from "../atoms/Button";
import FormWithLabel from "../molecules/FormWithLabel";
import PropTypes from "prop-types";
import auth from "~/api/auth";
import { withRouter } from "react-router-dom";
import Context from "../../helpers/configureStore";
import * as methods from "~/components/methods/StoreMethods";
import axios from "axios";
import renderHTML from 'react-render-html';
import { CACHE_LOCALNAMES, CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import Spinner from "react-bootstrap/Spinner";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import { getUrlFromMenuItem, getInspectionItemId, getRadiationItemId, getAllergyItemId, getExaminationItemId} from "~/helpers/getUrlFromMenuItem";
import * as apiClient from "../../api/apiClient";
import accounting_order from "~/components/validation/haruka/karte/accounting_order.json";
import description from "~/components/validation/haruka/karte/description.json";
import examination from "~/components/validation/haruka/karte/examination.json";
import hospital from "~/components/validation/haruka/karte/hospital.json";
import inhome from "~/components/validation/haruka/karte/inhome.json";
import meal from "~/components/validation/haruka/karte/meal.json";
import medical_assistance from "~/components/validation/haruka/karte/medical_assistance.json";
import physiological from "~/components/validation/haruka/karte/physiological.json";
import radiation from "~/components/validation/haruka/karte/radiation.json";
import rehability from "~/components/validation/haruka/karte/rehability.json";
import reservation_out from "~/components/validation/haruka/karte/reservation_out.json";
import treatment from "~/components/validation/haruka/karte/treatment.json";
import ward from "~/components/validation/haruka/karte/ward.json";
import DialMain from "./Dial/Board/DialMain";
import {Dial_tab_index} from "~/helpers/dialConstants";

const Wrapper = styled.div`
  height: 100vh;
  overflow: hidden;
  left: 0px;
  width: 100%;
  position: absolute;
`;

const LeftLayout = styled.div`
  float:left;
  width: calc(100% - 190px) !important;
  padding-top: 15px;

  .buletin {
    background-color: white;
    height: 100vh;
    margin: 3px;
    padding: 10px;
  }
  .spiner-text{
    text-align: left !important;
    padding-left: 2rem;
    font-size: 20px;
  }
`;

const CenterBox = styled.div`
  position: relative;  

  .loginContainer {
    max-width: 100%;
    margin-right: auto;
    margin-left: auto;
  }

  .m-auto {
    float:right;
    width: 190px !important;
    height: 100vh;    
    padding-top: 10px !important;    
    padding-left: 7px !important;
    padding-right: 7px !important;
  }

  ${Card}, .warning {
    width: 303px;
  }

  .warning {
    position: absolute;
    width: 186px;
    right: 7px;
    top: 180px;
    .alert {
      font-size: 12px;
      padding: 0.75rem;
    }
  }

  input::-ms-clear {
    visibility: hidden;
  }

  input::-ms-reveal {
    visibility: hidden;
  }
  //
  // button {
  //   width: 100%;
  //   height: 50px;
  //   span {
  //     font-size: 12px;
  //   }
  // }

  .div-buttons{
    display: flex;
    justify-content: center;

    button {
      width: 33%;
      height: 50px;
      min-width: 30px !important;
      padding: 0px;
      span {
        font-size: 12px;
      }
      margin: 0 0px;
    }
  }

  #logout-button{
    margin: 0 1px !important;
  }

  .mb-2 input{
    height: 30px;
  }

  .btn-style1{
    background-color: rgb(242, 162, 80) !important;
    font-size: 14px;
  }

  .login-show{
    width:100% !important;
  }

  .temp-user{
    color: white;    
    margin-bottom: 10px;
    background: #e95b5b;
    text-align: center;
    font-size: 14px;    
    padding: 3px;
  }
`;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-left: 42vw;
  display: table-caption;
  position: absolute;
  top: 230px;
`;

class Login extends React.Component {
  sendLog = methods.sendLog.bind(this);
  setOperationLog = methods.setOperationLog.bind(this);
  getBookmarksInfor = methods.getBookmarksInfor.bind(this);
  getLinkHistoryInfor = methods.getLinkHistoryInfor.bind(this);
  getFavouriteHistoryType = methods.getFavouriteHistoryType.bind(this);

  state = {
    id: "",
    password: "",
    errMsg: "",
    message: "",
    // success: 0,
    userName: "",
    logout_msg: "",
  };

  static propTypes = {
    history: PropTypes.object
  };

  enterFullscreenMode = () => {
    if (document.body.msRequestFullscreen) document.body.msRequestFullscreen();
    else if (document.body.mozRequestFullScreen)
      document.body.mozRequestFullScreen();
    else if (document.body.webkitRequestFullscreen)
      document.body.webkitRequestFullscreen();
    else if (document.body.requestFullscreen) document.body.requestFullscreen();
  };

  exitFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
  };

  loginFunc = () => {
    if (this.state.is_loaded) {
      this.handleLogin();
    }
  }

  handleLogin = async () => {
    //curPage, favouriteHistoryType, code, name
    this.context.$logonSetValue("", "", 0, "", [], [], []);
    localApi.remove("select_menu_info");
    localApi.remove("current_system_patient_id");
    localApi.remove("patient_list_schVal");
    localApi.remove("patient_list_search_department");
    localApi.remove("visit_schedule_list_place");
    localApi.remove("visit_schedule_list_group");
    localApi.setValue("system_next_page", "");
    localApi.setValue("system_before_page", "");
    this.enterFullscreenMode();
    const success = await auth.signIn(this.state);
    if (success) {
      window.sessionStorage.setItem("current_user", this.state.id);
      //this.enterFullscreenMode();
      var sessionStorage = JSON.parse(window.sessionStorage.getItem("haruka"));
      this.context.$updateTimeout(
        sessionStorage.operationTimeout,
        sessionStorage.operationWarningTime
      );
      this.context.$updateAuths(
        sessionStorage.feature_auth,
        sessionStorage.common_auth
      );

      // ●YJ777 MySQLに保存するほうの操作ログの改善
      // ・切替モードから本人がログインするときはログインと区別する (・op_screen=一時利用、op_type=利用再開)
      // ・切替モードから本人以外がログインするときはログインと区別する (・op_screen=一時利用、op_type=一時利用開始)

      // let existTemporaryUser = this.isTemporaryUser();
      // if (existTemporaryUser == true) {
      //   console.log("切替モード");
      //   console.log("切替モードから本人がログインするときはログインと区別する");
      //   console.log("切替モードから本人以外がログインするときはログインと区別する");
      // }

      this.setOperationLog("login", this.state.id + "がログインした");
      this.sendLog();


      // デバッグモードになるユーザーがログインしたときは、上記デバッグモードON/OFF設定に関係なくデバッグモードがONになるように
      var initState = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
      if (initState != null && initState.debug_user == this.state.id){
        let conf_data = initState.conf_data;        
        conf_data.error_display = "ON";        
        initState.debug_mode = 1;
        initState.conf_data = conf_data;
        sessApi.setObject(CACHE_SESSIONNAMES.INIT_STATUS, initState);
      }
      // 医師の記載可能な診療科を制限
      let cur_system = this.enableHaruka(initState);
      if (cur_system == "haruka") {
        if (initState != null && initState.conf_data != undefined && sessionStorage.staff_category == 1 ){
          let data = sessApi.getDoctorList();
          data = data.find(x=>x.doctor_code==sessionStorage.doctor_code);
          if (data !== undefined && data != null){
            // 入外訪問記載区分制限 「無効」の場合 can_write_visiting_karte, can_write_hospitalization_karte=1
            if (initState.conf_data.doctor_outpatient_hospitalization_limit !== undefined &&
              initState.conf_data.doctor_outpatient_hospitalization_limit == false) {
              initState.can_write_outpatient_karte = 1;
              initState.can_write_visiting_karte = 1;
              initState.can_write_hospitalization_karte = 1;
            } else {
              initState.can_write_outpatient_karte = data.can_write_outpatient_karte;
              initState.can_write_visiting_karte = data.can_write_visiting_karte;
              initState.can_write_hospitalization_karte = data.can_write_hospitalization_karte;
            }
            // 「医師別の診療科制限」所属科の場合、diagnosis_code（1件）をdivision_codeの前に追加したものを代わりに使用。
            if (initState.conf_data.can_write_department_list == 2) {
              initState.can_write_department_list = data.diagnosis_code + "," + data.division_code;
            } else if (initState.conf_data.can_write_department_list == 1) {
              initState.can_write_department_list = data.can_write_department_list;
            } else if (initState.conf_data.can_write_department_list == 0) {
              initState.can_write_department_list = null;
            }
            sessApi.setObject(CACHE_SESSIONNAMES.INIT_STATUS, initState);
          }
        }
        await this.getAllDiseaseList();
        await this.getNotConsentedHistoryData();
        await this.getNotConsentedInjectionHistoryData();
        // await this.getNotConsentedAllOrderHistoryData();
        await this.getHarukaSortFieldData();
        this.getHarkaValidateData();
      }

      // お気に入りメニュー取得
      this.getBookmarksInfor(cur_system);
      this.getLinkHistoryInfor(cur_system);
      this.getFavouriteHistoryType();
      // force reload 2020/07/03
      // window.location.reload();
      let tmpUserInfo = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.TEMPORARYUSER));
      
      this.gotoPage(tmpUserInfo);
      setTimeout(()=>{
        window.sessionStorage.setItem("first_login", 1);
      }, 500);

      // remove temporary user
      if (tmpUserInfo !== null && tmpUserInfo !== undefined && tmpUserInfo.user_number == sessionStorage.user_number ) {
        localApi.remove(CACHE_LOCALNAMES.TEMPORARYUSER);
      }
      // else {
        // delete user's patient karte cache
        // karteApi.delUserVal();
      // }

      let post_log = {op_screen:"", op_type:""};    
    
      if (tmpUserInfo !== null && tmpUserInfo !== undefined && tmpUserInfo.statusTemporary != undefined && sessionStorage != undefined && sessionStorage != null) {
        if (tmpUserInfo.user_number == sessionStorage.user_number) {
          // ・切替モードから本人がログインするときはログインと区別する。
          post_log.op_screen = "一時利用";
          post_log.op_type = "利用再開";
        } else {
          // ・切替モードから本人以外がログインするときはログインと区別する。
          post_log.op_screen = "一時利用";
          post_log.op_type = "一時利用開始";
        }
      }

      // ●YJ777 MySQLに保存するほうの操作ログの改善
      let post_data = {
        params: post_log
      };
      apiClient.post("/app/api/v2/connection/sendLogInfo",  post_data);


      this.setState({
        // success: 1,
        userName: sessionStorage.name,
        errMsg: ""
      });

      if (cur_system != "haruka") {
        let dr_karte_cache = localApi.getObject("dr_karte_cache");
        if (dr_karte_cache !== undefined && dr_karte_cache != null && dr_karte_cache.user_number !== undefined && dr_karte_cache.user_number == sessionStorage.user_number) {
          var url = "/dial/board/system_setting";
          sessApi.setObjectValue("from_print", "schedule_date", dr_karte_cache.schedule_date);
          sessApi.setObjectValue("from_print", "system_patient_id", dr_karte_cache.system_patient_id);
          sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.DRMedicalRecord);
          this.props.history.replace(url);
          return;
        }
      }

    } else {
  
      let conf_data = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS)).conf_data;
      if (conf_data.logout_page_fullscreen_control != 1)
        this.exitFullscreen();
      this.setState({
        errMsg: "ログインに失敗しました。IDとパスワードを確認してください。",
        is_loaded: true,
      });
    }
  };

  gotoPage = (_tmpUserInfo) => {
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    var sessionStorage = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (this.enableHaruka(initState) == "haruka") {
      try{
        // ■YJ787 切替機能の調整
        
        if (_tmpUserInfo !== null && 
          _tmpUserInfo !== undefined && 
          _tmpUserInfo.user_number == sessionStorage.user_number && 
          _tmpUserInfo.page != undefined && 
          _tmpUserInfo.page != null && 
          _tmpUserInfo.page != "" ) {
          if (_tmpUserInfo.page == "soap") {
            this.props.history.replace(`/patients/${_tmpUserInfo.patientNumber}/soap`);
            return;
          } else if(_tmpUserInfo.page == "prescription") {
            if (_tmpUserInfo.cacheSerialNumber) {              
              karteApi.setSubVal(_tmpUserInfo.patientNumber, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription", _tmpUserInfo.cacheSerialNumber);
            }
            this.props.history.replace(`/patients/${_tmpUserInfo.patientNumber}/prescription`);
            return;
          }
        }

        let menu_id = sessionStorage.home_page;
        if (menu_id === undefined || menu_id == null || menu_id == "") {
          this.props.history.replace("/top");
          return;
        }
        let menu_data = initState.navigation_menu;
        if (menu_data === undefined && menu_data == null) {
          this.props.history.replace("/top");
          return;
        }
        let menu_item = menu_data.find(x=>x.id==menu_id);
        if (menu_item === undefined || menu_item == null) {
          this.props.history.replace("/top");
          return;
        }

        // let enablePatientPage = menu_item.enabled_in_patient_page == 1;
        // let enableDefaultPage = menu_item.enabled_in_default_page == 1;
        let permission_master=[801, 8011, 802];
        // お知らせ管理権限
        const permission_notice=[803];
        // システム設定権限
        const permission_system_setting=[804, 805, 806, 807, 808, 809,810, 811, 812, 813, 814, 815, 816, 817, 818, 819, 820, 821, 822, 823, 824, 825, 826, 827, 828, 829, 830, 831];
        // 訪問診療スケジュール権限
        const permission_visit_schedule_add=[4005, 4006];
        // 訪問診療スケジュール閲覧権限
        const permission_visit_schedule_view=[4007, 4008];
        // 委譲者オーダー承認
        const permission_NotConsented_View=[110, 229];
        // 予約カレンダー権限
        const permission_reservation_schedule_add=[294];
        // 予約カレンダー閲覧権限
        const permission_reservation_schedule_view=[219];
        let permission = true;

        // マスタ設定権限
        if(permission_master.includes(menu_item.id) && !this.context.$canDoAction(this.context.FEATURES.MASTER_SETTING, this.context.AUTHS.EDIT, 0)) {
          permission = false;
        }
        // お知らせ管理権限
        if(permission_notice.includes(menu_item.id) && !this.context.$canDoAction(this.context.FEATURES.NOTIFICATION, this.context.AUTHS.EDIT, 0)) {
          permission = false;
        }
        // システム設定権限
        if(permission_system_setting.includes(menu_item.id) && !this.context.$canDoAction(this.context.FEATURES.SYSTEM_SETTING, this.context.AUTHS.EDIT, 0)) {
          permission = false;
        }
        // 訪問診療スケジュール権限
        if(permission_visit_schedule_add.includes(menu_item.id) && !this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.REGISTER, 0)
        ) {
          permission = false;
        }
        // 訪問診療スケジュール閲覧権限
        if(permission_visit_schedule_view.includes(menu_item.id) && !(
          this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.READ, 0) ||
          this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.REGISTER, 0) ||
          this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.EDIT, 0) ||
          this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.DELETE, 0)
        )
        ) {
          permission = false;
        }
        // 委譲者オーダー承認
        if(permission_NotConsented_View.includes(menu_item.id)){
          let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
          permission = authInfo.staff_category === 1 ? true : false;
        }
        // 予約カレンダー権限
        if(permission_reservation_schedule_add.includes(menu_item.id) && !this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.REGISTER, 0)
        ) {
          permission = false;
        }
        // 予約カレンダー閲覧権限
        if(permission_reservation_schedule_view.includes(menu_item.id) && !(
          this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.READ, 0) ||
          this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.REGISTER, 0) ||
          this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.EDIT, 0) ||
          this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.DELETE, 0)
        )
        ) {
          permission = false;
        }
        if (permission == false) {
          this.props.history.replace("/top");
        }
        if (menu_item.enabled_in_patient_page == 1 && menu_item.enabled_in_default_page == 0) {  // karte page
          let url = menu_item.url;
          if (url == "" || url == null) {
            let modal_url = getUrlFromMenuItem(menu_item);
            if (modal_url == "") return;
            url = modal_url;
            menu_item.url = modal_url;
            if(url == "physiological" || url == "endoscope") { // 生理検査
              let inspection_id = getInspectionItemId(menu_item);
              menu_item.inspectionId = inspection_id;
            }
            else if(url == "radiation") { // 放射線
              let radiation_id = getRadiationItemId(menu_item);
              menu_item.radiation_id = radiation_id;
            } else if(url == "allergy") { // アレルギー関連
              let allergy_type = getAllergyItemId(menu_item);
              menu_item.allergy_type = allergy_type;
            } else if(url == "openExamination") { // 検体検査関連
              let examination_type = getExaminationItemId(menu_item);
              menu_item.examination_type = examination_type;
            }
          }
          if (menu_item.is_modal == 1) {
            menu_item.type = "modal";
          }
          menu_item.ele=menu_item;
          localApi.setObject("select_menu_info", menu_item);
          localApi.setValue("system_before_page", url);
          this.props.history.replace("/patients/0/soap");
        } else {

          // ■YJ781 ログイン時画面・ホームボタン関連の修正
          if (menu_item.name == "ベッドコントロール") {
            localApi.setValue("bed_control_open", 1);                      
            localApi.remove('ward_map_ward_id');            
            this.props.history.replace("/hospital_ward_map");
            return;
          } else if(
            menu_item.name == "グループスケジュール登録" || 
            menu_item.name == "スケジュール登録" || 
            menu_item.name == "予約登録") {
            localApi.setValue("home_special_modal_open", JSON.stringify(menu_item));
            this.props.history.replace("/top");
            return;            
          }

          if (menu_item.url != ""){
            this.props.history.replace(menu_item.url);
          } else {
            // ■YJ781 ログイン時画面・ホームボタン関連の修正
            localApi.setValue("home_normal_modal_open", JSON.stringify(menu_item));
            this.props.history.replace("/top");
          }
        }

      } catch (err) {
        /* eslint-disable no-console */
        console.error(err);
        this.props.history.replace("/top");
      }
    } else {
      if(initState.terminal_info != undefined && initState.terminal_info != null && initState.terminal_info.start_page != undefined){
        if (initState.terminal_info.start_page === "ベッドサイド"){
          sessApi.setValue("from_terminal", 1);
          setTimeout(()=>{
            this.props.history.replace("/dial/board/system_setting");
          }, 100);
        } else if(initState.terminal_info.start_page === "予約一覧") {
          this.props.history.replace("/dial/weight/patientList");
        }
        else {
          this.props.history.replace("/top");
        }
      } else {
        this.props.history.replace("/top");
      }
    }
  };

  handleTop = async () => {
    // if (this.state.success != 1) {
    //   return;
    // }
    this.props.history.replace("/top");
  }

  handleLogout = () => {
    // if (this.state.success != 1) {
    //   return;
    // }
    if (confirm("ログアウトします")) {
      // const $resetState = useContext(Context);
      //   sessApi.setObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "terminal_info", {});
      this.context.$resetState(0, "");
      this.exitFullscreen();
      auth.signOut();
      this.setState({
        id: "",
        password: "",
        errMsg: "",
        message: "",
        // success: 0,
        userName: "",
        is_loaded: false
      });
      this.props.history.replace("/");
    }
  }

  async componentDidMount() {

    document.body.onbeforeunload = function() {
      return "Really?";
    };
    // ナビゲーションマップの非表示操作
    this.context.$selectMenuModal(false)
    window.sessionStorage.removeItem("dial_change_flag");

    // if (auth.isAuthenticated()) this.props.history.replace("/patients");
    var auth_info =  JSON.parse(sessApi.getValue('haruka'));
    if (auth.isAuthenticated() && auth_info != undefined && auth_info != null && auth_info.name != undefined && auth_info.name != ''){
      let initStateTmp = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
      let error_auto_reload = false;
      if (initStateTmp != null && initStateTmp != undefined) {
        document.title = initStateTmp.title != undefined && initStateTmp.title != "" ? initStateTmp.title : "HARUKA";
        let conf_data = initStateTmp.conf_data;
        if (conf_data !== undefined && conf_data != null) {
          if (conf_data.error_auto_reload !== undefined && conf_data.error_auto_reload != null) {
            error_auto_reload = conf_data.error_auto_reload == "ON" ? true : false;
          }
        }
      }
      let last_url = window.sessionStorage.getItem("last_url");
      if (last_url !== undefined && last_url != null && last_url !== "" && error_auto_reload) {
        this.props.history.replace(last_url);
      } else {
        this.props.history.replace("/top");
      }
      return;
    }
    document.getElementById("user_id").focus();

    let { data } = await axios.get("/app/api/v2/top/message", {
      params: {
        limit: 10
      }
    });

    const initState = {
      message: data.message !== undefined?data.message:"",
      color: data.color !== undefined?data.color:"",
      enable_ordering_karte: data.enable_ordering_karte != undefined ? data.enable_ordering_karte:0,
      enable_dialysis: data.enable_dialysis != undefined ? data.enable_dialysis:0,
      link_history_maxshows: data.link_history_maxshows != undefined ? data.link_history_maxshows : 12,
      title: data.title != undefined && data.title != "" ? data.title : "HARUKA",
      dial_device_request_interval: data.dial_device_request_interval != undefined ? data.dial_device_request_interval : null,
      weight_calc_wheelchair_select_available: data.weight_calc_wheelchair_select_available != undefined ? data.weight_calc_wheelchair_select_available : "OFF",
      dial_drainage_set_hour: data.dial_drainage_set_hour != undefined ? data.dial_drainage_set_hour : null,
      dial_color: data.dial_color != undefined ? data.dial_color : null,
      dial_schedule_date_color: data.dial_schedule_date_color != undefined ? data.dial_schedule_date_color : null,
      terminal_info: data.terminal_info !== undefined?data.terminal_info:null,
      dial_timezone: data.dial_timezone !== undefined?data.dial_timezone:null,
      dial_method_default: data.dial_method_default !== undefined?data.dial_method_default:null,
      dial_timeout: data.dial_timeout !== undefined?data.dial_timeout:null,
      schema_background_list: data.schema_background_list !== undefined?data.schema_background_list:null,
      navigation_menu: data.navigation_menu !== undefined?data.navigation_menu:null,
      prescription_usage: data.prescription_usage !== undefined?data.prescription_usage:null,
      noon_time: data.noon_time !== undefined?data.noon_time:null,
      morning_time: data.morning_time !== undefined?data.morning_time:null,
      evening_time: data.evening_time !== undefined?data.evening_time:null,
      inspection_master: data.inspection_master !== undefined?data.inspection_master:null,
      injection_usage: data.injection_usage !== undefined?data.injection_usage:null,
      injection_usage_2: data.injection_usage_2 !== undefined?data.injection_usage_2:null,
      injection_body_parts: data.injection_body_parts !== undefined?data.injection_body_parts:null,
      prescription_body_parts: data.prescription_body_parts !== undefined?data.prescription_body_parts:null,
      doctors_list: data.doctors_list !== undefined?data.doctors_list:null,
      staffs_list: data.staffs_list !== undefined?data.staffs_list:null,
      diagnosis_treatment_department: data.diagnosis_treatment_department !== undefined ? data.diagnosis_treatment_department:null,
      screen_keyboard_use: data.screen_keyboard_use != undefined ? data.screen_keyboard_use:0,
      debug_mode: data.debug_mode != undefined ? data.debug_mode:1,
      error_mail_send: data.error_mail_send != undefined ? data.error_mail_send:0,
      debug_user: data.debug_user != undefined ? data.debug_user:"",
      patient_do_max_number: data.patient_do_max_number != undefined ? data.patient_do_max_number:1,
      patient_do_get_mode: data.patient_do_get_mode != undefined ? data.patient_do_get_mode:0,
      conf_data:data.conf,
      dial_master_validate:data.dial_master_validate,
      dial_common_config: data.dial_common_config != undefined ? data.dial_common_config : null,
      dial_patient_validate:data.dial_patient_validate,
      dial_pattern_validate:data.dial_pattern_validate,
      dial_print_validate:data.dial_print_validate,
      dial_schedule_validate:data.dial_schedule_validate,
      dial_medical_information_validate:data.dial_medical_information_validate,
      dial_other_validate:data.dial_other_validate,
      dial_footcare_version_info:data.dial_footcare_version_info,
      shoot_condition_default:data.shoot_condition_default,     //放射線 撮影条件
      shoot_done_validate:data.shoot_done_validate,             //放射線実施 validate
      institution:data.institution,                             //法人名 機関名
      visit_place_master:data.visit_place_master,
      radiation_master:data.radiation_master,
      radiation_classific_master:data.radiation_classific_master,
      radiation_part_master:data.radiation_part_master,
      radiation_direction_master:data.radiation_direction_master,
      radiation_left_right_master:data.radiation_left_right_master,
      ward_master:data.ward_master,
      radiation_pacs_flag : data.radiation_pacs_flag,
      haruka_color : data.haruka_color,
      auto_reload : data.auto_reload, // auto reload setting info
      list_status_row_color : data.list_status_row_color, //load list_status_row_color.json
      medical_reservation_timezone : data.medical_reservation_timezone, // auto reload setting info
      // routinely_prescription_save_mode=0は、今の、定期処方をオーダー自体全て分けているものです
      // mode1は、カルテツリーのレコードは1件で、order_data内に各投与日も持ちます。
      routinely_prescription_save_mode : data.routinely_prescription_save_mode,
      surface_formulas : data.surface_formulas,
      treat_oxygen_list : data.treat_oxygen_list,
    };
    document.title = initState.title;
    let cur_system = this.enableHaruka(initState);

    if (cur_system == "haruka") {
      let karte = {
        accounting_order,
        description,
        examination,
        hospital,
        inhome,
        meal,
        medical_assistance,
        physiological,
        radiation,
        rehability,
        reservation_out,
        treatment,
        ward,
      }
      let karte_validate = sessApi.setObjectValue("haruka_validate", "karte");
      if (karte_validate == undefined){
        sessApi.setObjectValue("haruka_validate", "karte", karte);
      }
      initState.navigation_map = data.navigation_map !== undefined?data.navigation_map:null;
      if (data.boilerplate_master != undefined) {
        sessApi.setObject("boilerplate_master", data.boilerplate_master);
      }
    }

    await this.getHolidays();

    if (cur_system != "haruka") {
      // get code master
      await this.getAllCategory();

      // get bed master
      await this.getBedMaster();

      // get material master
      await this.getMaterialMaster();

      // get medicine master
      await this.getMedicineMaster();

      // get usage master
      await this.getUsageMaster();

      // get injection master
      await this.getInjectionMaster();

      // get inspection master
      await this.getInspectionMaster();

      // //get console master
      await this.getConsoleMaster();

      // //get dial method master
      await this.getDialMethodMaster();

      //get examination master
      await this.getExaminationMaster();

      //get template master
      await this.getTemplateMaster();

      //get Facility master
      await this.getOtherFacilitiesInfo();

      //get Patient List
      // await this.getPatientList();
      
      setTimeout(()=>{
        this.setFirstPage(initState);
      }, 300);
      
    }


    this.context.$updateCurrentSystem(cur_system);

    // 履歴メニュー max shows
    this.context.$updateLinkHistoryMaxshows(data.link_history_maxshows != undefined ? data.link_history_maxshows : 12);
    const newStateStr = JSON.stringify(initState);
    window.sessionStorage.setItem("init_status", newStateStr);
    this.setState({
      message: data.entrance_bulletin_board.body !== undefined ? data.entrance_bulletin_board.body: "",
      is_loaded: true
    });
    // ログアウトしたときは、未ログイン画面に移動し「離席状態で○分経過したため、ログアウトされました」とアラートを表示  2020-04-14
    var logout_msg = window.sessionStorage.getItem("logout_msg");
    if (logout_msg !== undefined && logout_msg != null && logout_msg !== "") {
      this.setState({logout_msg});
      window.sessionStorage.removeItem("logout_msg");
    }

  }
  
  setFirstPage = (init_state) => {
    let conf_data = init_state.conf_data;
    if (conf_data == undefined || conf_data.login_page_use != "ON") return;
    let terminal_info = init_state.terminal_info;
    if (terminal_info == undefined || terminal_info == null || terminal_info.start_page != "ベッドサイド") return;
    sessApi.setValue("from_terminal", 1);
    this.setState({
      show_bedside: true,
      bed_no:terminal_info.bed_number
    });
  }

  getHarkaValidateData = async () => {
    let validate_data = await axios.get("/app/api/v2/top/haruka_validate_data", {
      params: {}
    });
    sessApi.setObject("haruka_validate", (validate_data !== undefined && validate_data.data !== undefined) ? validate_data.data:'');
  }

  getHarukaSortFieldData = async () => {
    let sort_data = await axios.get("/app/api/v2/top/haruka_sort_data", {
      params: {}
    });
    sessApi.setObjectValue("haruka_sort", "list", sort_data!=undefined && sort_data.data != undefined ?sort_data.data:'');
  }

  getBoilerplateMaster = (data) => {
    // let path = "/app/api/v2/master/boilerplate/searchAllBoilerplate";
    // let { data } = await axios.get(path);
    if (data == null || data == undefined) {
      return;
    }
    sessApi.setObject("boilerplate_master", data);
  };
  getAllDiseaseList = async () => {
    var auth_info = JSON.parse(window.sessionStorage.getItem("haruka"));
    let data = await apiClient.get(
      "/app/api/v2/disease_name/search_in_patient",
      {
        params: {
          systemPatientId: 0,
          doctor_code: auth_info.doctor_code,
          is_doctor_consented: 0
        }
      }
    );
    sessApi.setObject("disease_consented_list", data);
  };
  getNotConsentedAllOrderHistoryData = async () => {
    let params = {
      get_consent_pending: 1
    };
    let data = await apiClient.get("/app/api/v2/order/notConsented/findHistory", {
      params: params
    });
    sessApi.setObject("allOrder_consented_list", data);
  };
  getNotConsentedHistoryData = async () => {
    let params = {
      get_consent_pending: 1
    };
    let data = await apiClient.get("/app/api/v2/order/prescription/patient", {
      params: params
    });
    sessApi.setObject("prescription_consented_list", data);
  };

  getNotConsentedInjectionHistoryData = async () => {
    let params = {
      get_consent_pending: 1
    };
    let data = await apiClient.get("/app/api/v2/order/injection/find", {
      params: params
    });
    sessApi.setObject("injection_consented_list", data);
  };

  getHolidays = async () => {
    let path = "/app/api/v2/dial/master/get_holidays_info";
    let { data } = await axios.post(path, {params: {is_enabled:1}});
    if (data == null || data == undefined || data.length == 0) {
      return;
    }
    sessApi.setObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER, "holiday_master", data);
  }

  getAllCategory = async () => {
    let path = "/app/api/v2/dial/master/get_code_all_category";
    let post_data = {
      order:'sort_number'
    };
    let { data } = await axios.post(path, {params: post_data});
    if (data == null || data == undefined || data.length == 0) {
      return;
    }
    sessApi.setObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER, "code_master", data);
  };

  getTemplateMaster = async () => {
    let path = "/app/api/v2/dial/master/get_template_master";
    let post_data = {
      order:'name_kana'
    };
    let { data } = await axios.post(path, {params: post_data});
    if (data == null || data == undefined || data.length == 0) {
      return;
    }
    sessApi.setObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER, "template_master", data);
    // this.setState({
    //   is_loaded: true
    // })
  }

  getPatientList = async () => {
    let path = "/app/api/v2/dial/master/patient_list";
    let post_data = {
      order:'name_kana'
    };
    let { data } = await axios.post(path, {param: post_data});
    if (data.data == undefined|| data.data == null || data.datalength == 0) {
      return;
    }
    sessApi.setObjectValue('patient_list', "patient_list", data.data);
  }

  getOtherFacilitiesInfo = async () => {
    let path = "/app/api/v2/dial/master/getOtherFacilitiesOrder";
    let post_data = {
      order:'sort_number'
    };
    let { data } = await axios.post(path, {params: post_data});
    if (data == null || data == undefined || data.length == 0) {
      return;
    }
    sessApi.setObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER, "facility_master", data);
  }

  getBedMaster = async () => {
    let path = "/app/api/v2/dial/master/bed_all_search";
    let post_data = {
    };
    let { data } = await axios.post(path, {params: post_data});
    sessApi.setObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER, "bed_master", data);
  };

  getMaterialMaster = async () => {
    let path = "/app/api/v2/dial/master/get_common_all_category";
    let post_data = {
      order:'sort_number'
    };
    let { data } = await axios.post(path, {params: post_data});
    if (data == null || data == undefined || data.length == 0) {
      return;
    }
    sessApi.setObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER, "material_master", data);

  };

  getMedicineMaster = async () => {
    let path = "/app/api/v2/dial/master/medicine_all_search";
    let post_data = {
      order:'name_kana'
    };
    let { data } = await axios.post(path, {params: post_data});
    sessApi.setObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER, "medicine_master", data);
  };

  getUsageMaster = async () => {
    let path = "/app/api/v2/dial/master/usage_all_search";
    let post_data = {
      order:'sort_number'
    };
    let { data } = await axios.post(path, {params: post_data});
    sessApi.setObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER, "usage_master", data);
  };

  getInjectionMaster = async () => {
    let path = "/app/api/v2/dial/master/injection_all_search";
    let post_data = {
      order:'name_kana'
    };
    let { data } = await axios.post(path, {params: post_data});
    sessApi.setObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER, "injection_master", data);
  };

  getInspectionMaster = async () => {
    let path = "/app/api/v2/dial/master/inspection_all_search";
    let post_data = {order:'name_kana'};
    let { data } = await axios.post(path, {params: post_data});
    sessApi.setObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER, "inspection_master", data);
  };

  getConsoleMaster = async() => {
    let path = "/app/api/v2/dial/master/material_all_search";
    let post_data = {
      table_kind: 4,
      order: 'sort_number',
    }
    let { data } = await axios.post(path, {params: post_data});
    if (data == null || data == undefined || data.length == 0) {
      return;
    }
    sessApi.setObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER, "console_master", data);
  };

  getDialMethodMaster = async() => {
    let path = "/app/api/v2/dial/master/material_all_search";
    let post_data = {
      table_kind: 1,
      order:'sort_number',
    }
    let { data } = await axios.post(path, {params: post_data});
    if (data == null || data == undefined || data.length == 0) {
      return;
    }
    sessApi.setObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER, "dial_method_master", data);
  };

  getExaminationMaster = async() => {
    let path = "/app/api/v2/dial/master/searchAllExamination";
    let post_data = {      
      order:'sort_number'
    };
    let { data } = await axios.post(path, {params: post_data});
    if (data == null || data == undefined || data.length == 0) {
      return;
    }
    sessApi.setObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER, "examination_master", data);
  };
  // getCodeFromCategory = async(category) => {
  //   let path = "/app/api/v2/dial/master/get_code_from_category";
  //   let post_data = {
  //     category:category,
  //     all_code: "ok"
  //   };
  //   let { data } = await axios.post(path, {params: post_data});
  //   if (data == null || data == undefined || data.length == 0) {
  //     return;
  //   }
  //   return data;
  //   // sessApi.setObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER, "code_master", data);

  // }

  enableHaruka = (initState) => {
    if (initState == null || initState == undefined) {
      return "haruka";
    }
    if(initState.enable_ordering_karte == 1) return "haruka";
    if(initState.enable_dialysis == 1) return "dialysis";
    return "haruka";
    // if (((initState.enable_ordering_karte != null && initState.enable_ordering_karte != undefined && initState.enable_ordering_karte === "1") || (initState.enable_ordering_karte != null && initState.enable_ordering_karte !== undefined && initState.enable_ordering_karte !== "1" && initState.enable_dialysis != null && initState.enable_dialysis !== undefined && initState.enable_dialysis !== "1"))) {
    //   return "haruka";
    // }

    // if(initState.enable_dialysis != null && initState.enable_dialysis != undefined && initState.enable_dialysis === "1" && initState.enable_ordering_karte != null && initState.enable_ordering_karte !== undefined && initState.enable_ordering_karte !== "1") {
    //   return "dialysis";
    // }
    // return "haruka";
  }

  isTemporaryUser = () => {
    let userInfo = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.TEMPORARYUSER));
    if (userInfo !== null && userInfo !== undefined && userInfo.statusTemporary == 0 ) {
      return true;
    }
    return false;
  }

  handleChange = key => ({ target: { value } }) => {
    const convertStr = key == "id" ? this.convertStr(value) : value;
    this.setState({ [key]: convertStr });
  };

  handleKeyPressedId = e => {
    if (e.keyCode === 13) {
      document.getElementById("password-area").focus();
    }
  };

  handleKeyPressed = e => {
    if (e.keyCode === 13 && this.state.id !== "" && this.state.password !== "") {
      document.getElementById("login-button").focus();
    }
  };

  convertStr = str => {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
  };

  closeSystemAlertModal() {
    this.setState({logout_msg: ""});
  }
  logInFromDial = (state_data) => {
    if (state_data.id == "" || state_data.password == "") return;
    this.setState({
      id:state_data.id,
      password:state_data.password
    },()=>{
      this.handleLogin();
    });
  }
  render() {
    let existTemporaryUser = this.isTemporaryUser();
    // ●YJ782 離席/切替機能の調整
    let temporaryUserName = "";
    if (existTemporaryUser == true) {
      let userInfo = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.TEMPORARYUSER));
      if (userInfo !== undefined && userInfo !== null) {
        temporaryUserName = userInfo.name;
      }
    }
    return (
      <Wrapper>
        <CenterBox>
          <div className="loginContainer">
            {this.state.show_bedside ? (
              <DialMain
                bed_no={this.state.bed_no}
                from_source="login"
                handleLogIn={this.logInFromDial}
                />
            ):(
              <LeftLayout>
                <div className="text-center mb-3">
                  <img src={Img} alt="" width="200px" />
                </div>
                {this.state.is_loaded != undefined && this.state.is_loaded ? (
                  <div className="buletin">
                    {renderHTML(this.state.message)}
                  </div>
                ):(
                  <div className='text-center spiner-text'>
                    読み込み中…
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                )}
              </LeftLayout>
            )}
            <Card className={`p-3 m-auto`}>
              {existTemporaryUser === true && (<div className="temp-user">一時利用</div>)}
              <div className="mb-2">
                <FormWithLabel
                  type="text"
                  label="利用者ID"
                  onChange={this.handleChange("id")}
                  onKeyPressed={this.handleKeyPressedId}
                  value={this.state.id}
                  id="user_id"
                />
              </div>
              <div className="mb-2">
                <FormWithLabel
                  type="password"
                  label="パスワード"
                  onChange={this.handleChange("password")}
                  onKeyPressed={this.handleKeyPressed}
                  value={this.state.password}
                  id="password-area"
                />
              </div>
              <div className="div-buttons">
                <Button className="login-show" onClick={this.loginFunc} id="login-button">
                  ログイン
                </Button>
              </div>
              {existTemporaryUser === true && temporaryUserName != "" && (<div style={{marginTop:"0.5rem",fontSize:"14px"}}>{temporaryUserName}がログイン中</div>)}
              {this.state.errMsg && (
                <div style={{marginTop:"0.5rem"}}>
                  <div className="alert alert-danger" role="alert" style={{fontSize:"12px",padding:"0.75rem"}}>
                    {this.state.errMsg}
                  </div>
                </div>
              )}
            </Card>            
          </div>
        </CenterBox>
        {this.state.logout_msg !== "" && (
          <SystemAlertModal
            hideModal= {this.closeSystemAlertModal.bind(this)}
            handleOk= {this.closeSystemAlertModal.bind(this)}
            showMedicineContent= {this.state.logout_msg}
          />
        )}
      </Wrapper>
    );
  }
}
Login.contextType = Context;

export default withRouter(Login);
