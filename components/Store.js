import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import * as methods from "~/components/methods/StoreMethods";
import AutoLogoutModal from "./molecules/AutoLogoutModal";
import SystemAlertModal from "./molecules/SystemAlertModal";
import auth from "~/api/auth";
import { withRouter } from "react-router-dom";
import html2canvas from 'html2canvas';
import {CACHE_SESSIONNAMES, CACHE_LOCALNAMES, KARTEMODE} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
// import * as localApi from "~/helpers/cacheLocal-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import * as localApi from "~/helpers/cacheLocal-utils";

// import { image } from "html2canvas/dist/types/css/types/image";

class Store extends Component {
  updateAuths = methods.updateAuths.bind(this);
  canDoAction = methods.canDoAction.bind(this);
  resetState = methods.resetState.bind(this);
  sendLog = methods.sendLog.bind(this);
  setOperationLog = methods.setOperationLog.bind(this);

  static propTypes = {
    children: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.curPage = "";
    this.bed_timeout = 1800;
    this.bed_warning_time = 1680;
    this.weight_timeout = 1800;
    this.weight_warning_time = 1680;
    this.other_timeout = 1800;
    this.other_warning_time = 1680;
    this.operationTimeout = 1800;
    this.operationWarningTime = 1680;
    this.autoLogoutModalShow = false;
    this.last_action_time = parseInt(new Date().getTime() / 1000);
    this.state = {
      timer: undefined,
      operationTimeout: 300,
      operationWarningTime: 180,
      autoLogoutModalShow: false,
      alert_messages: "",
      alert_messages_title: "",
      preserve_date: "",
      AUTHS: {},
      FEATURES: {},
      OperationURL: {
        PRESCRIPTION: 1001, // 処方   
        INJECTION: 1002, // 注射
        SOAP: 1009, // SOAP
        INSPECTION: 1010, // 検査結果
      },
      selectedDoctor: {
        code: 0,
        name: ""
      },
      medical_department_name: undefined,
      duties_department_name: undefined,
      department: {
        code: 0,
        name: ""
      },
      karte_status: {
        code: 0,
        name: "外来"
      },
      featureAuths: [],
      commonAuths: [],
      medicineChangeHistory: [],
      insuranceTypeList: [],
      consentedList: [],
      consentedAllOrderList: [],
      patientsList: [],
      bookmarksList: [],
      linkHistoryList: [],
      consentedFromNav: "",
      rightSideTab: "favourite",
      favouriteHistoryType: "",
      staff_category: 1,
      linkHistoryMaxshows: 12,
      dropSoapNumber: 0,
      editDropSoapNumber: 0,
      needSelectDoctor: false,
      needMenuModal: false,
      currentSystem: "",
      dateStatus: new Date(),
      departmentStatus: 0,
      currentPatientInfo: {},
      treatStatus: 2,
      pageStatus: 1,
      limitStatus: 20,
      page: 1,
      processing: false,
      stopGetHistory: false,
      reserved_patient:"",
      hasUnconsentedConfirmed: false,
      preDepartmentCode: 0,
      preDoctorCode: 0,
      acceptedData: {
        accepted_number: 0,
        accepted_department_code: 0,
        accepted_date: "",
        status: 0,
      },
      isUpdateExaminationOrder: 0,
      addition_condition:undefined,
      font_props:1,

      $updateFontProp: this.updateFontProp,
      $selectDoctor: this.selectDoctor,
      $selectMenuModal: this.selectMenuModal,
      $updateDoctor: this.updateDoctor,
      $updateStaffCategory: this.updateStaffCategory,
      $updateLinkHistoryMaxshows: this.updateLinkHistoryMaxshows,
      $updateDropSoapNumber: this.updateDropSoapNumber,
      $updateEditDropSoapNumber: this.updateEditDropSoapNumber,
      $updateDepartmentName: this.updateDepartmentName,
      $updateDepartment: this.updateDepartment,
      $updateKarteStatus: this.updateKarteStatus,
      $updateKarteStatusDepartment: this.updateKarteStatusDepartment,
      $updatePatientsList: this.updatePatientsList,
      $updateBookmarksList: this.updateBookmarksList,
      $updateLinkHistoryList: this.updateLinkHistoryList,
      $updateConsentedFromNav: this.updateConsentedFromNav,
      $updateRightSideTab: this.updateRightSideTab,
      $updateFavouriteHistoryType: this.updateFavouriteHistoryType,
      $getKarteMode: this.getKarteMode,
      $updateCurrentPatientInfo: this.updateCurrentPatientInfo,
      $updateReservedPatient: this.updateReservedPatient,
      $updateMedicineChangeHistory: this.updateMedicineChangeHistory,
      $updateInsuranceTypeList: this.updateInsuranceTypeList,
      $updateConsentedList: this.updateConsentedList,
      $updateConsentedAllOrderList: this.updateConsentedAllOrderList,
      $updatePreserveDate: this.updatePreserveDate,
      $updateAuths: this.updateAuths,
      $updateSchKanaVal: this.updateSchKanaVal,
      $updateDateStatus: this.updateDateStatus,
      $updateDepartmentStatus: this.updateDepartmentStatus,
      $updateCurrentSystem: this.updateCurrentSystem,
      $updateCurrentPage: this.updateCurrentPage,
      $updateTreatStatus: this.updateTreatStatus,
      $canDoAction: this.canDoAction,
      $resetState: this.resetState,
      $updateScrollTop: this.updateScrollTop,
      $updatePageNumber: this.updatePageNumber,
      $updateProcessing: this.updateProcessing,
      $updateStopGetHistory: this.updateStopGetHistory,
      $setUnconsentedConfirmed: this.setUnconsentedConfirmed,
      $getMedicineChangeHistory: this.getMedicineChangeHistory,
      $updateTimeout: this.updateTimeout,
      $forceLogout: this.forceLogout,
      $screenCapture: this.screenCapture,
      $setExaminationOrderFlag: this.setExaminationOrderFlag,
      $updateAdditionCondition: this.updateAdditionCondition,
      $logonSetValue: this.logonSetValue,
      $getLastEventTime: this.getLastEventTime,
      $setLastEventTime: this.setLastEventTime
    };
    this.AutoLogoutModalRef = React.createRef();
    this.last_event_time = new Date().getTime();
  }
  componentDidMount() {
    this.setState({
      remainingTime: this.operationTimeout,
      timer: setInterval(() => {
        this.countDown();
      }, 1000),
      curPage: "home"
    });
    this.countIndex = 0;
    document.addEventListener("keydown", (e) => {
      this.last_event_time = new Date().getTime();
      if (
        window.localStorage.getItem("deactive_all_event") === undefined ||
        window.localStorage.getItem("deactive_all_event") === null
      ) {
        this.closeAutoLogoutModal();
      }
      if (e.target.tagName !== "BODY") {
        if(!auth.isAuthenticated()) return;
        this.setOperationLog("keydown", e.key);           
      }
    });

    document.addEventListener("mousemove", () => {
      if (
        window.localStorage.getItem("deactive_all_event") === undefined ||
        window.localStorage.getItem("deactive_all_event") === null
      ) {
        this.closeAutoLogoutModal();
      }
      this.last_event_time = new Date().getTime();

    });
    document.addEventListener("mousedown", (e) => {
      this.last_event_time = new Date().getTime();
      if(!auth.isAuthenticated()) return;
      if (e.target.tagName !== "BODY") {
        let obj = e.target;        
        do {
          if (obj.getAttribute("class") !== null && typeof(obj.className) != "object"){
            if(obj.className.indexOf("__") > -1){
              let classList = obj.className.split(" ");
              classList.map((item)=>{
                if(item.indexOf("__") > -1) {
                    var component_names = item.split("-");
                    var component_name = component_names[0];
                    var event_name = "";
                    if(e.button == 0) {
                      event_name = "mouse_left_click";
                      if(component_name.indexOf("ContextMenuUl") > -1 
                        || component_name.indexOf("Button") > -1 
                        || component_name.indexOf("BodyParts") > -1 
                        || component_name.indexOf("Calc") > -1  
                      ) {
                        component_name += ": " + e.target.innerText;
                      }


                    } else if(e.button == 2) {
                      event_name = "mouse_right_click";
                    } else {
                      event_name = "mouse_click";
                    }                  
                    this.setOperationLog(event_name, component_name);      
                    
                }
              });
              return;
            }
          }
          obj = obj.parentElement;

          if (obj == null || obj == undefined) break;

        } while(obj.tagName !== "BODY")
      }
    });   


  }
  
  getLastEventTime = () => {
    return this.last_event_time;
  }
  setLastEventTime = () => {
    this.last_event_time = new Date().getTime();
  }

  isTemporaryUser = () => {
    let userInfo = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.TEMPORARYUSER));
    if (userInfo !== null && userInfo !== undefined && (userInfo.statusTemporary == 0 || userInfo.statusTemporary == 1)) {
      return true;
    }
    return false;
  }

  removeTemporaryUserInfo = () => {
    let userInfo = JSON.parse(localApi.getValue(CACHE_LOCALNAMES.TEMPORARYUSER));
    userInfo.statusTemporary = 0;
    localApi.setValue(CACHE_LOCALNAMES.TEMPORARYUSER, JSON.stringify(userInfo));
  }


  countDown() {    
    if (window.sessionStorage.getItem("force_logout") === "1") {
      this.forceLogout();
      sessApi.remove(CACHE_SESSIONNAMES.LOCK_SCREEN);
      return;
    }    
    if (auth.isAuthenticated()) {

      let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));

      // alert message
      if (window.sessionStorage.getItem("alert_messages") !== "" && window.sessionStorage.getItem("alert_messages") !== null) {
        if(initState !== undefined && initState != null){
          if(initState.enable_dialysis == 1) { // Dial
            let str_msg = window.sessionStorage.getItem("alert_messages");
            let str_msg_arr = null;
            if (str_msg.includes("##")) {
              str_msg_arr = str_msg.split('##');
              this.setState({
                alert_messages : str_msg_arr[1],
                alert_messages_title: str_msg_arr[0],
              });
            } else {
              this.setState({
                alert_messages : window.sessionStorage.getItem("alert_messages"),
                alert_messages_title: "",
              });
            }
          } else { // Haruka
            let str_msg = window.sessionStorage.getItem("alert_messages");
            let str_msg_arr = null;
            if (str_msg.includes("##")) {
              str_msg_arr = str_msg.split('##');
              this.setState({
                alert_messages : str_msg_arr[1],
                alert_messages_title: "",
              });
            } else {
              this.setState({
                alert_messages : window.sessionStorage.getItem("alert_messages"),
                alert_messages_title: "",
              });
            }            
          }
        }
        window.sessionStorage.setItem("alert_messages", "");
      }

      // update patientList
      this.updatePatientList();      
      // if (bEqual == false) {
      //   this.setState({
      //     patientsList: localApi.getValue(CACHE_LOCALNAMES.PATIENTSLIST)
      //   });
      // }

      var path = this.getPath();   
      if (this.curPage !== path) {

        // 右側サイドバータブ
        // let isPatientPage_curPage = this.isPatientPage(path);
        // let isPatientPage_beforPage = this.isPatientPage(this.state.curPage);
        
        // if (isPatientPage_curPage == true && isPatientPage_beforPage == false) {
        //   this.setState({
        //     rightSideTab: "karte"
        //   });
        // }

        // this.screenCapture();
        this.setOperationLog("page", path);
        // window.localStorage.setItem("page", path);
        // this.setState({curPage: path});
        this.curPage = path;
        this.sendLog(this.curPage);
        this.countIndex = 0;

        // from dialsys bedside
        // let is_bedside = 0;
        // let is_weight = 0;
        
        // if(initState.enable_dialysis == 1 && initState.terminal_info != undefined &&
        //     initState.terminal_info != null && initState.terminal_info.start_page != undefined){
        //   if (initState.terminal_info.start_page === "ベッドサイド"){
        //     is_bedside = 1;
        //   } else if(initState.terminal_info.start_page === "予約一覧") {
        //     is_weight = 1;
        //   }
        // }

        if(initState !== undefined && initState != null && initState.dial_timeout != undefined && initState.dial_timeout != null){
          let op_timeout = initState.dial_timeout;
          if (op_timeout.bedside != null && op_timeout.bedside != undefined) {
            this.bed_timeout = op_timeout.bedside.timeout != null && op_timeout.bedside.timeout != undefined && op_timeout.bedside.timeout > 0 ? op_timeout.bedside.timeout : this.bed_timeout;
            this.bed_warning_time = op_timeout.bedside.warning_time != null && op_timeout.bedside.warning_time != undefined && op_timeout.bedside.warning_time > 0 ? op_timeout.bedside.warning_time : this.bed_warning_time;
          }
          if (op_timeout.weight != null && op_timeout.weight != undefined) {
            this.weight_timeout = op_timeout.weight.timeout != null && op_timeout.weight.timeout != undefined && op_timeout.weight.timeout > 0 ? op_timeout.weight.timeout : this.weight_timeout;
            this.weight_warning_time = op_timeout.weight.warning_time != null && op_timeout.weight.warning_time != undefined && op_timeout.weight.warning_time > 0 ? op_timeout.weight.warning_time : this.weight_warning_time;
          }
          if (op_timeout.other != null && op_timeout.other != undefined) {
            this.other_timeout = op_timeout.other.timeout != null && op_timeout.other.timeout != undefined && op_timeout.other.timeout > 0 ? op_timeout.other.timeout : this.other_timeout;
            this.other_warning_time = op_timeout.other.warning_time != null && op_timeout.other.warning_time != undefined && op_timeout.other.warning_time > 0 ? op_timeout.other.warning_time : this.other_warning_time;
          }
        }        

        let curPage = this.changeLogoutTime();
        if(initState !== undefined && initState != null && initState.enable_dialysis == 1) {
          if (curPage == "bedside") {
            this.operationTimeout = this.bed_timeout;
            this.operationWarningTime = this.bed_warning_time;
          } else if(curPage == "weight") {
            this.operationTimeout = this.weight_timeout;
            this.operationWarningTime = this.weight_warning_time;
          } else {
            this.operationTimeout = this.other_timeout;
            this.operationWarningTime = this.other_warning_time;
          }
        } else {
          this.operationTimeout = this.other_timeout;
          this.operationWarningTime = this.other_warning_time;
        }
      }

      // auth.refreshAuth(location.pathname+location.hash);
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      if(initState !== undefined && initState != null && initState.enable_ordering_karte == 1){
        if (authInfo.timeout_json != undefined && authInfo.timeout_json != null){
          if (authInfo.timeout_json.timeout > 0) this.operationTimeout = authInfo.timeout_json.timeout;
          if (authInfo.timeout_json.warning_time > 0) this.operationWarningTime = authInfo.timeout_json.warning_time;
        }
      }

      this.countIndex += 1;
      if (this.countIndex == 60) {
        this.sendLog(this.curPage);
        this.countIndex = 0;
      } 

      let newRemainigTime = parseInt(new Date().getTime() / 1000) - this.last_action_time;      


      if (newRemainigTime >= this.operationTimeout) {
        let conf_data = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS)).conf_data;
        if (conf_data.logout_page_fullscreen_control != 1) {
          if (document.exitFullscreen) document.exitFullscreen();
          else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
          else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
          else if (document.msExitFullscreen) document.msExitFullscreen();
        }
        this.autoLogoutModalShow = false;
        // this.setState({
        //   autoLogoutModalShow: false
        // });
        window.sessionStorage.removeItem("dial_change_flag");
        window.sessionStorage.setItem("alert_messages", "");        
        this.AutoLogoutModalRef.current.callVisible(false);

        // ●YJ777 MySQLに保存するほうの操作ログの改善
        // ・無操作での自動ログアウトは区別して記録する
        // ・一時利用中のユーザーが自動でログアウトも区別する
        
        // 一時利用 check;
        let existTemporaryUser = this.isTemporaryUser();

        this.setState({alert_messages: ""},()=>{
          if (existTemporaryUser == true) {
            auth.signOut("temporary_login", null, "auto_logOut");
            this.removeTemporaryUserInfo();
          } else {
            auth.signOut("", null, "auto_logOut");
          }
        });
        sessApi.remove(CACHE_SESSIONNAMES.LOCK_SCREEN);
        this.props.history.replace("/");
        clearInterval(this.timer);
      }

      let auth_expirteAt = 0;      
      if (authInfo != null && authInfo != undefined && authInfo.expiresAt != null && authInfo.expiresAt != undefined) {
        auth_expirteAt = authInfo.expiresAt;
      }
      var diff = auth_expirteAt - Math.floor(new Date().getTime() / 1000) ;      
      if(  diff == 115 ) {
        auth.refreshAuth(location.pathname+location.hash);
      }

      // if( diff == 3590) {
      //  auth.refreshAuth(location.pathname+location.hash); 
      // }

      if (newRemainigTime == this.operationWarningTime) {
        window.localStorage.setItem("deactive_all_event", 1);
        
        this.autoLogoutModalShow = true;        

        this.AutoLogoutModalRef.current.callRender(this.operationTimeout - this.operationWarningTime, true);
        this.last_action_time = parseInt(new Date().getTime() / 1000) - this.operationWarningTime;
        // window.localStorage.setItem(
        //   "last_action_time",
        //   parseInt(new Date().getTime() / 1000) -
        //     this.operationWarningTime
        // );
        // this.setState(
        //   {
        //     autoLogoutModalShow: true,
        //     remainingTime: newRemainigTime - this.operationWarningTime
        //   },
        //   () => {
        //     window.localStorage.setItem(
        //       "last_action_time",
        //       parseInt(new Date().getTime() / 1000) -
        //         this.operationWarningTime
        //     );
        //   }
        // );

        setTimeout(function() {
          window.localStorage.removeItem("deactive_all_event");
        }, 1000);
      }
      // if (newRemainigTime > this.operationWarningTime) {
      //   this.setState({
      //     remainingTime: this.operationTimeout - newRemainigTime
      //   });
      // }
    }
  }

  componentDidUpdate() {    
    if (!this.autoLogoutModalShow) {
      this.last_action_time = parseInt(new Date().getTime() / 1000);
      // window.localStorage.setItem(
      //   "last_action_time",
      //   parseInt(new Date().getTime() / 1000)
      // );
    }
  }
  
  componentWillUnmount() {
    clearInterval(this.timer);
    document.removeEventListener("keydown", () => {
      this.closeAutoLogoutModal();
    });
    document.removeEventListener("mousemove", () => {
      this.closeAutoLogoutModal();
    });
  }  

  updateMedicineChangeHistory = medicineChangeHistory => {
    const newStateStr = JSON.stringify(medicineChangeHistory);
    window.sessionStorage.setItem("medicine_change_history", newStateStr);
  };

  getMedicineChangeHistory = () => {
    const medicine_change_history = JSON.parse(
      window.sessionStorage.getItem("medicine_change_history") ||
        window.localStorage.getItem("medicine_change_history")
    );

    if (medicine_change_history && Array.isArray(medicine_change_history)) {
      return medicine_change_history;
    }

    return [];
  };

  updateDoctor = (code, name, medical_department_name = "") =>
    this.setState(s => ({
      ...s,
      selectedDoctor: { code, name },
      medical_department_name
    }));
  
  updateFontProp = (font_props) =>{    
    this.setState(s => ({
      ...s,
      font_props:font_props
    }));
  }
    

  selectDoctor = needSelectDoctor => {
    if(needSelectDoctor){
        setTimeout(()=>{
            this.setState({ needSelectDoctor });
        }, 500);
    } else {
        this.setState({ needSelectDoctor });
    }
  }
  selectMenuModal = needMenuModal => this.setState({ needMenuModal });
  updateLinkHistoryMaxshows = linkHistoryMaxshows => this.setState({ linkHistoryMaxshows });
  // SOAP画面からInsertDragAndDrop追加操作
  updateDropSoapNumber = dropSoapNumber => this.setState({ dropSoapNumber });
  // SOAP画面からEditDragAndDrop追加操作
  updateEditDropSoapNumber = editDropSoapNumber => this.setState({ editDropSoapNumber });
  updateStaffCategory = staff_category => this.setState({ staff_category });
  updateDepartmentName = (medical_department_name, duties_department_name) =>
    this.setState({ medical_department_name, duties_department_name });

  updateCurrentPatientInfo = currentPatientInfo => this.setState({ currentPatientInfo });

  updateReservedPatient = reserved_patient => this.setState({ reserved_patient });
  
  setExaminationOrderFlag = (nVal) =>
  this.setState({ isUpdateExaminationOrder:nVal });

  updateDepartment = (code = 0, name = "", patientId=null) => {
    this.setState(s => ({
      ...s,
      department: {
        code,
        name
      }
    }));
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    let patient_id = patientId != null ? patientId : current_system_patient_id;
    let patient_data = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
    if(patient_data != undefined && patient_data != null){
      // patient_data.karte_status = {code: code, name: name};
      patient_data.department = {code: code, name: name};
      karteApi.setPatient(patient_id, JSON.stringify(patient_data));
    }
  }

  isEditOfPrescriptionAndInjection = (_page) => {
    let result = false;
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    let active_key = karteApi.getSubVal(current_system_patient_id, CACHE_LOCALNAMES.ACTIVE_KEY, "prescription");

    if (_page == "injection") {
      active_key = karteApi.getSubVal(current_system_patient_id, CACHE_LOCALNAMES.ACTIVE_KEY, "injection");
    }      

    if (active_key == null) return result;

    let cacheData = karteApi.getSubVal(current_system_patient_id, _page == "prescription" ? CACHE_LOCALNAMES.PRESCRIPTION_EDIT : CACHE_LOCALNAMES.INJECTION_EDIT, active_key);

    if (cacheData == undefined || cacheData == null || cacheData[0] == undefined || cacheData[0] == null) return result;

    if (cacheData[0].isUpdate != undefined && cacheData[0].isUpdate == 1) result = true;

    return result;

  }

  updateKarteStatus = (code = 0, name = "", patientId=null, patientKarteStatus=null) => {
    // patientId => use when exchange patient (ex: select patient on right sidebar)
    this.setState(s => ({
      ...s,
      karte_status: {
        code,
        name
      }
    }));

    // 処方と注射の編集時の入外区分について
    //  ・処方や注射を「編集」で開いた際
    //  ・現在入院中かどうかなどは関係なく、編集しようとしているレコードの区分を選択。

    // check current page "prescription" and "injection" and edit status
    let isEditPageOfPresInject = false;

    let path = window.location.href.split("/");    
    if (path[path.length - 1] == "prescription" || path[path.length - 1] == "injection") {
      isEditPageOfPresInject = this.isEditOfPrescriptionAndInjection(path[path.length - 1]);
    }
    if (isEditPageOfPresInject) return;
    if (patientKarteStatus != null && patientKarteStatus == "no_patient_karte_status" ) return;
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    let patient_id = patientId != null ? patientId : current_system_patient_id;
    let patient_data = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
    if(patient_data != undefined && patient_data != null){
      patient_data.karte_status = {code: code, name: name};
      patient_data.department = {code: this.state.department.code, name: this.state.department.name};
      karteApi.setPatient(patient_id, JSON.stringify(patient_data));
    }
  }
  
  updateKarteStatusDepartment=(patient_id, karte_status, karte_status_name, department_code, department_name)=>{
    this.setState(s => ({
      ...s,
      karte_status: {
        code:karte_status,
        name:karte_status_name
      },
      department: {
        code:department_code,
        name:department_name
      }
    }));
    let isEditPageOfPresInject = false;
    let path = window.location.href.split("/");
    if (path[path.length - 1] == "prescription" || path[path.length - 1] == "injection") {
      isEditPageOfPresInject = this.isEditOfPrescriptionAndInjection(path[path.length - 1]);
    }
    if (isEditPageOfPresInject) return;
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    patient_id = patient_id != null ? patient_id : current_system_patient_id;
    let patient_data = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
    if(patient_data != undefined && patient_data != null){
      patient_data.karte_status = {code: karte_status, name: karte_status_name};
      patient_data.department = {code: department_code, name: department_name};
      karteApi.setPatient(patient_id, JSON.stringify(patient_data));
    }
  }

  updatePatientsList = patientsList => this.setState({ patientsList });
  updateBookmarksList = bookmarksList => this.setState({ bookmarksList });
  updateLinkHistoryList = linkHistoryList => this.setState({ linkHistoryList });
  updateConsentedFromNav = consentedFromNav => this.setState({ consentedFromNav });

  // 右側サイドバータブ
  updateRightSideTab = rightSideTab => this.setState({ rightSideTab });

  // favourite history design type  value=>"list":1(DB), "icon":0(DB)
  updateFavouriteHistoryType = favouriteHistoryType => this.setState({ favouriteHistoryType });

  // 0: 閲覧モード, 1: 記載モード
  getKarteMode=(patient_id)=>{
    let patient_data = karteApi.getVal(patient_id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
    if(patient_data != undefined && patient_data != null && patient_data.karte_mode != undefined){
      return patient_data.karte_mode;
    } else {
      return KARTEMODE.READ;
    }
  }

  updateInsuranceTypeList = insuranceTypeList =>
    this.setState({ insuranceTypeList });
  updateConsentedList = consentedList => this.setState({ consentedList });
  updateConsentedAllOrderList = consentedAllOrderList => this.setState({ consentedAllOrderList });
  updateSchKanaVal = schValKana => this.setState({ schValKana });
  updateDateStatus = dateStatus => this.setState({ dateStatus });
  updateDepartmentStatus = departmentStatus =>
    this.setState({ departmentStatus });
  updateCurrentSystem = currentSystem =>this.setState({ currentSystem });
  updateCurrentPage = curPage =>this.curPage = curPage;
  updatePreserveDate = preserve_date =>this.setState({ preserve_date });
  updateTreatStatus = treatStatus => this.setState({ treatStatus });
  updatePageNumber = page => this.setState({ page });
  updateProcessing = processing => this.setState({ processing });
  updateStopGetHistory = stopGetHistory => this.setState({ stopGetHistory });
  setUnconsentedConfirmed = hasUnconsentedConfirmed => this.setState({ hasUnconsentedConfirmed });
  updateTimeout = (operationTimeout, operationWarningTime) => {
    this.operationTimeout = operationTimeout;
    this.operationWarningTime = operationWarningTime;
  };
  logonSetValue = (curPage, favouriteHistoryType, code, name, bookmarksList, linkHistoryList, patientsList) =>{
    this.curPage = curPage;
    this.setState(s => ({
      ...s,
      selectedDoctor: { code, name },
      favouriteHistoryType,
      bookmarksList,
      linkHistoryList,
      patientsList
    }));
  }

  closeAutoLogoutModal() {
    if (this.autoLogoutModalShow) {
      this.autoLogoutModalShow = false;
      this.AutoLogoutModalRef.current.callVisible(false);
      // this.setState({ autoLogoutModalShow: false });
    } else {
      this.last_action_time = parseInt(new Date().getTime() / 1000);
      // window.localStorage.setItem(
      //   "last_action_time",
      //   parseInt(new Date().getTime() / 1000)
      // );
    }
  }  

  closeSystemAlertModal() {
    this.setState({
      alert_messages: "",
      alert_messages_title: "",
    });
  }

  forceLogout() {
    clearInterval(this.timer);
    let existTemporaryUser = this.isTemporaryUser();
    if (existTemporaryUser == true) {
      auth.signOut("temporary_login");      
      this.removeTemporaryUserInfo();
    } else {
      auth.signOut();
    }
    auth.signOut();
    this.props.history.replace("/");
  }

  getPath() {
    var path = window.location.href.split("/");
    let result = "";
    for (var i = 3; i < path.length; i++) {
      result += "/" + path[i];
    }
    return result;
  }

  changeLogoutTime() {
    // var path = window.location.href.split("/");
    var path = window.location.href;
    // let lastLetter = path[path.length - 1];
    if (path.indexOf("dial/board/system_setting") > 0) {
      return "bedside";
    } else if (path.indexOf("dial/weight") > 0) {
      return "weight";
    } else {
      return "default";
    }   
  }  

  screenCapture = async () => {
    const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));   
    const is_capture = authInfo.enable_screen_capture;
    let filetype = authInfo.screen_capture_type;

    if (!is_capture) return;
    if (filetype == "PNG") return;
    if (filetype == "jpeg" || filetype == "jpg") filetype = "JPEG";
    else if (filetype == "png") filetype = "PNG";
    else filetype = "JPEG";
    let imgData = await html2canvas(document.body).then(function(canvas) {
      var imgData = canvas.toDataURL();
      imgData = imgData.replace(/^data:image\/(png|jpg);base64,/, "");
      return imgData;
    });
    if (imgData !== undefined && imgData !== null) {
      this.setOperationLog("image/" + authInfo.screen_capture_type, imgData);
      this.sendLog(this.curPage);
      window.localStorage.removeItem("operation_log");  
    }
  }

  updatePatientList = () => {

    let cache_patients_list = karteApi.getEditPatientList();  
    if (cache_patients_list != null && cache_patients_list != undefined && cache_patients_list.length != this.state.patientsList.length) {
      this.setState({
        patientsList: cache_patients_list
      });
    }
  }

  isPatientPage = (url) => {
    let re = /patients[/]\d+/;
    let isPatientPage = re.test(url);
    if (!isPatientPage) { // if patientId no exist
      return false;
    } else {
      return true;
    }
  }

  updateAdditionCondition = val => {this.setState({addition_condition:val})};


  render() {
    const { children } = this.props;
    return (
      <Context.Provider value={this.state}>
        {children}
        <AutoLogoutModal
          ref={this.AutoLogoutModalRef}
          closeAutoLogoutModal={this.closeAutoLogoutModal.bind(this)}
          remainingTime={this.operationTimeout - this.operationWarningTime}
          // warningTime={
          //   this.operationTimeout - this.operationWarningTime
          // }
        />
        
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeSystemAlertModal.bind(this)}
            handleOk= {this.closeSystemAlertModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title={this.state.alert_messages_title}
          />
        )}

              
      </Context.Provider>
    );
  }
}
Store.propTypes = {
  history: PropTypes.object
};

export default withRouter(Store);
