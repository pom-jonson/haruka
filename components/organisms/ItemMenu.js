import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {
  faBookUser,
  faCapsules,
  faSquare,
  faMicroscope,
  faSyringe,
  // faLaptopMedical,
  faNotesMedical,
  // faAllergies,
  // faDisease,
  // faPills,
  faBookMedical,
} from "@fortawesome/pro-regular-svg-icons";
import { patientModalEvent } from "../../events/PatientModalEvent";
import StaffSettingModal from "~/components/templates/Dial/Board/molecules/StaffSettingModal"
import GeneralSettingModal from "~/components/templates/Dial/Board/molecules/GeneralSettingModal"
import TerminalSettingModal from "~/components/templates/Dial/Board/molecules/TerminalSettingModal"
import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES, KARTEMODE} from "~/helpers/constants";
// import karte_201 from "~/components/_demo/201.png";
import { karte_image_array} from "~/helpers/kartePageResource";
import { getUrlFromMenuItem, getInspectionItemId, getRadiationItemId, getAllergyItemId, getExaminationItemId} from "~/helpers/getUrlFromMenuItem";
import * as localApi from "~/helpers/cacheLocal-utils";

const Icon = styled(FontAwesomeIcon)`
font-size: 16px;
margin: 0 10px 0 10px;
`;

const fontAwesomeIconList = [
  {
    type: "faCapsules",
    icon: faCapsules
  },
  {
    
    type: "faSyringe",
    icon: faSyringe
  },
  {
    
    type: "faBookMedical",
    icon: faBookMedical
  },
  {
    
    type: "faMicroscope",
    icon: faMicroscope
  },
  {
    
    type: "faNotesMedical",
    icon: faNotesMedical
  },
  {
    
    type: "faBookUser",
    icon: faBookUser
  },
  {
    
    type: "faSquare,",
    icon: faSquare,
  }
];

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({
                       visible,
                       x,
                       y,
                       parent,
                       favouriteMenuType,
                       favouriteList
                     }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            {favouriteList.includes(favouriteMenuType) ?
              (<div
                onClick={() =>
                  parent.contextMenuAction(favouriteMenuType, "delete")
                }
              >
                お気に入り解除
              </div>)
              : (<div
                onClick={() =>
                  parent.contextMenuAction(favouriteMenuType)
                }
              >
                お気に入り追加
              </div>)}
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class ItemMenu extends React.Component {
  constructor(props) {
    super(props);
    // let curScreenWidth = window.innerWidth;
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let navigation_map = initState.navigation_map;
    let navigation_map_pc = [];
    let navigation_map_tablet = [];
    if (navigation_map != null && navigation_map != undefined) {
      if (navigation_map.pc_items != null && navigation_map.pc_items != undefined && navigation_map.pc_items.length > 0) {
        navigation_map_pc = navigation_map.pc_items;
      }
    }
    if (navigation_map != null && navigation_map != undefined) {
      if (navigation_map.tablet_items != null && navigation_map.tablet_items != undefined && navigation_map.tablet_items.length > 0) {
        navigation_map_tablet = navigation_map.tablet_items;
      }
    }
    this.state = {
      favouriteMenuType: 0,
      // screen_w: curScreenWidth < this.props.sp_width ? "window_1200" : "window_1920",
      screen_w: "window_1200",
      // default_category_number: curScreenWidth < this.props.sp_width ? 8 : 16,
      default_category_number: 8,
      // default_item_number: curScreenWidth < this.props.sp_width ? 5 : 10,
      default_item_number: 5,
      navigation_map_pc:navigation_map_pc,
      navigation_map_tablet:navigation_map_tablet
    };
    
    // カルテのみのメニューに関する制御の追加 default: 1 (using karte page) 患者以外のページで患者メニューを使用
    this.patient_menu_enable_in_not_patient_page = 1;
    let _flag = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").patient_menu_enable_in_not_patient_page;
    if (_flag != undefined && _flag != null) {
      this.patient_menu_enable_in_not_patient_page = _flag == "OFF" ? 0 : 1;
    }
    this.view_soap_focus_menu = 0;
    if(initState !== undefined && initState != null && initState.conf_data !== undefined && initState.conf_data != null && initState.conf_data.view_soap_focus_menu !== undefined){
      this.view_soap_focus_menu = initState.conf_data.view_soap_focus_menu;
    }
    
    this.ignore_menu_ids = [189];
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    // this.setState({ screen_w: nextProps.screen_width });
    if (nextProps.screen_width == "window_1920") {
      this.setState({
        screen_w: nextProps.screen_width,
        default_category_number: 8,
        // default_category_number: 16,
        default_item_number: 5,
        // default_item_number: 10,
      });
    }
    if (nextProps.screen_width == "window_1200") {
      this.setState({
        screen_w: nextProps.screen_width,
        default_category_number: 8,
        default_item_number: 5,
      });
    }
  }
  
  contextMenuAction = (act, type) => {
    this.props.updateFavouriteList(act, type);
  };
  
  handleClick = (e, type) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("calc_dlg")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("calc_dlg")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      
      let clientY = e.clientY;
      let clientX = e.clientX;
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX-65,
          y: e.clientY + window.pageYOffset
        },
        favouriteMenuType: type
      }, () => {
        let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
        let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
        let window_height = window.innerHeight;
        let window_width = window.innerWidth;
        if (clientY + menu_height > window_height && clientX + menu_width> window_width-260) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX-60-menu_width,
              y: clientY + window.pageYOffset-menu_height
            },
            favouriteMenuType: type
          });
        } else if (clientY + menu_height > window_height && clientX + menu_width < window_width-260) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX-60,
              y: clientY + window.pageYOffset-menu_height
            },
            favouriteMenuType: type
          });
        } else if (clientY + menu_height < window_height && clientX + menu_width > window_width-260) {
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX-60-menu_width,
              y: clientY + window.pageYOffset
            },
            favouriteMenuType: type
          });
        }
      });
      
      
    }
  }
  
  // onGotoUrl = (ele, permission) => {
  //   if (permission == false) {
  //     return;
  //     // window.sessionStorage.setItem("alert_messages", "権限がありません。");
  //   }
  
  //   let url = ele.url;
  
  //   if (url == "" || url == null) {
  //     let modal_url = getUrlFromMenuItem(ele);
  
  //     if (modal_url == "") return;
  //     url = modal_url;
  //     ele.url = modal_url;
  
  //     if(url == "physiological") { // 生理検査
  //       let inspection_id = getInspectionItemId(ele);
  //       ele.inspectionId = inspection_id;
  //     }
  //     else if(url == "radiation") { // 放射線
  //       let radiation_id = getRadiationItemId(ele);
  //       ele.radiation_id = radiation_id;
  //     } else if(url == "allergy") { // アレルギー関連
  
  //     }
  
  //     // if (inspection_id > 0) {
  //     //   ele.inspectionId = inspection_id;
  //     // }
  //     // if (radiation_id > 0){
  //     //   ele.radiation_id = radiation_id;
  //     // }
  //   }
  //   if (ele.is_modal == 1) {
  //     ele.type = "modal";
  //   }
  //   let menu_item = this.getNavigationMenuInfoById(ele.id);
  //   if (menu_item != null && menu_item != undefined) {
  //     menu_item.ele = ele;
  //   }
  //   this.props.onGoto(url, ele.id, menu_item);
  // };
  
  onGotoUrl = (ele, permission) => {
    /* eslint-disable no-console */
    console.log("menu clicked ", new Date().getTime());
    //実施済み注射
    if (ele.id == 238) window.sessionStorage.setItem('completed_injection', 1);
    if (permission == false) {
      return;
    }
    let url = ele.url;
    if (url == "" || url == null) {
      let modal_url = getUrlFromMenuItem(ele);
      if (modal_url == "") return;
      url = modal_url;
      ele.url = modal_url;
      if(url == "physiological" || url == "endoscope") { // 生理検査
        let inspection_id = getInspectionItemId(ele);
        ele.inspectionId = inspection_id;
      }
      else if(url == "radiation") { // 放射線
        let radiation_id = getRadiationItemId(ele);
        ele.radiation_id = radiation_id;
      } else if(url == "allergy") { // アレルギー関連
        let allergy_type = getAllergyItemId(ele);
        ele.allergy_type = allergy_type;
      } else if(url == "openExamination") { // 検体検査関連
        let examination_type = getExaminationItemId(ele);
        ele.examination_type = examination_type;
      }
    }
    if (ele.is_modal == 1) {
      ele.type = "modal";
    }
    let menu_item = this.getNavigationMenuInfoById(ele.id);
    if (menu_item != null && menu_item != undefined) {
      menu_item.ele = ele;
      menu_item.menuTab = this.props.tab_id;
    }
    localApi.setObject("select_menu_info", menu_item);
    this.props.onGoto(url, ele.id, menu_item);
  }
  
  managementModal(modal_name){
    if (modal_name === "staff_setting"){
      this.setState({openStaffSettingModal: true});
    } else if (modal_name === "general_setting"){
      this.setState({openGeneralSettingModal: true});
    } else if (modal_name === "terminal_setting"){
      this.setState({openTerminalSettingModal: true});
    }
  }
  
  closeModal = () => {
    this.setState({
      openTerminalSettingModal: false,
      openGeneralSettingModal: false,
      openStaffSettingModal: false,
    })
  }
  
  
  onOpenDisease = () => {
    patientModalEvent.emit("clickOpenDetailedPatientPopup", "8");
  }
  
  getIcon = (type) => {
    if (type == null || type == undefined || type == "") return faSquare;
    let result = fontAwesomeIconList.filter(item=>{
      if (type == item.type || item.icon == type) {
        return item.icon != undefined && item.icon != null ? item.icon : "";
      }
    });
    if (result == "") {
      return "";
    } else {
      return result[0].icon;
    }
  }
  
  getNavigationMenuInfoById = (id) => {
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let navigation_menu = initState.navigation_menu;
    let result = null;
    navigation_menu.map(item=>{
      if (item.id == id) {
        result = item;
      }
    });
    return result;
  }
  
  isEnablePatientPage = (item) => {
    let menu_item_info = this.getNavigationMenuInfoById(item.id);
    if (menu_item_info == null || menu_item_info == undefined) return false;
    
    if (menu_item_info.enabled_in_patient_page == 1)
      return true;
    else
      return false;
  }
  
  isEnableDefaultPage = (item) => {
    let menu_item_info = this.getNavigationMenuInfoById(item.id);
    if (menu_item_info == null || menu_item_info == undefined) return false;
    
    if (menu_item_info.enabled_in_default_page == 1)
      return true;
    else
      return false;
  }
  
  isEnableMenuItem = (item) => {
    let menu_item_info = this.getNavigationMenuInfoById(item.id);
    if (menu_item_info == null || menu_item_info == undefined) return false;
    if (menu_item_info.is_enabled == 1)
      return true;
    else
      return false;
    
  }
  
  isPatientPage = (tab_id=null) => {
    let path = window.location.href.split("/");
    if (path[path.length-1] == "nursing_document"){
      return tab_id == 3 ? true : false;
    }
    let re = /patients[/]\d+/;
    let isPatientPage = re.test(window.location.href);
    return isPatientPage ? true : false;
  }
  
  isVisibleMenuItem = (item) => {
    let menu_item_info = this.getNavigationMenuInfoById(item.id);
    if (menu_item_info == null || menu_item_info == undefined) return false;
    return menu_item_info.is_visible == 1 ? true : false;
  }
  
  onDragStart = (e, item_id) => {
    
    e.dataTransfer.setData("text", item_id.toString());
    // e.dataTransfer.setData("out_text", item_id.toString());
    e.stopPropagation();
  };
  
  checkMenuHasPermission = (_checkType, _menuId) => {
    //メニュー権限設定無視--------------------------
    if (this.ignore_menu_ids.includes(_menuId)) return true;
    //-----------------------------------------
    let userInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    if (userInfo == undefined ||
      userInfo == null ||
      userInfo.menu_auth == undefined ||
      userInfo.menu_auth == null) return false;
    
    let arr_menu_permission = userInfo.menu_auth;
    
    let result = false;
    if (Object.keys(arr_menu_permission).length > 0 &&
      arr_menu_permission[_menuId] != null &&
      arr_menu_permission[_menuId] != null &&
      arr_menu_permission[_menuId].length > 0 &&
      arr_menu_permission[_menuId].includes(_checkType)) {
      result = true;
    }
    
    return result;
  }
  
  getEnableKarteStatus = (ele) => {
    // ・is_available_in_outpatient_karte 外来カルテで利用可能
    // ・is_available_in_visiting_karte 訪問カルテで利用可能
    // ・is_available_in_hospitalization_karte 入院カルテで利用可能
    
    let result = true;
    
    if (!this.isPatientPage()) return result;
    
    // 1231-18 入外区分によって機能が使えるかどうかを設定できるように(1)
    // この依頼では、「処方」「注射」「処置」のオーダーを登録する機能にだけ判定をつけてください。
    // 【例】
    // ・外来処方は 外来のみ1・入院/訪問は0に設定し、プルダウンが外来でない時は押せなくなる。
    // ・外来と訪問診療だけ1になっているメニューなら、入院を選んでいるときは押せなくなる。
    
    // get current karte status
    let karte_status = this.context.karte_status.code;
    // 0:外来 1:入院 2:訪問
    
    // 外来処方, 外来注射, 外来処置
    // const out_patient_ids = [146, 221, 147, 223, 148, 224];
    // 入院処方, 入院注射, 入院処置
    // const hospitalize_patient_ids = [233, 2003, 2006, 240];
    // 在宅処方, 在宅注射, 在宅処置
    // const home_patient_ids = [185, 292, 186, 293, 183, 279];
    
    // if (out_patient_ids.includes(ele.id) || hospitalize_patient_ids.includes(ele.id) || home_patient_ids.includes(ele.id)) {
    if (ele.enabled_in_default_page == 0 && ele.enabled_in_patient_page == 1) {
      if (karte_status == 0 && ele.is_available_in_outpatient_karte != 1) {
        result = false;
      }
      
      if (karte_status == 1 && ele.is_available_in_hospitalization_karte != 1) {
        result = false;
      }
      
      if (karte_status == 2 && ele.is_available_in_visiting_karte != 1) {
        result = false;
      }
    }
    
    return result;
  }
  
  render() {
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    // const { groups, items } = this.props;
    // マスタ設定権限
    const permission_master=[801, 8011, 802];
    // お知らせ管理権限
    const permission_notice=[189,803];
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
    
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let navigation_map = initState.navigation_map;
    let navigation_map_pc = [];
    let navigation_map_tablet = [];
    if (navigation_map != null && navigation_map != undefined) {
      if (navigation_map.pc_items != null && navigation_map.pc_items != undefined && navigation_map.pc_items.length > 0) {
        navigation_map_pc = navigation_map.pc_items;
      }
    }
    if (navigation_map != null && navigation_map != undefined) {
      if (navigation_map.tablet_items != null && navigation_map.tablet_items != undefined && navigation_map.tablet_items.length > 0) {
        navigation_map_tablet = navigation_map.tablet_items;
      }
    }
    let navigationMapArray = navigation_map_pc;
    let navigationMapTabletArray = navigation_map_tablet;
    let categoryArray = [];
    if (this.state.screen_w == "window_1920") {
      if (navigationMapArray.length > 0) {
        navigationMapArray.map(item=>{
          if (item.tab.tab_view_id == this.props.tab_id) {
            categoryArray = item.categories;
          }
        });
      }
    }
    if (this.state.screen_w == "window_1200") {
      if (navigationMapTabletArray.length > 0) {
        navigationMapTabletArray.map(item=>{
          if (item.tab.tab_view_id == this.props.tab_id) {
            categoryArray = item.categories;
          }
        });
      }
    }
    
    let blank_item_01 = <div className="btn-green btn-blank disable-button">&nbsp;</div>
    let blank_item_02 = <div className="btn-white btn-blank disable-button">&nbsp;</div>
    // let default_blank_items = [blank_item_01,blank_item_02,blank_item_01,blank_item_02,blank_item_01,blank_item_02,blank_item_01,blank_item_02,blank_item_01,blank_item_02];
    let default_blank_items = [blank_item_01,blank_item_02,blank_item_01,blank_item_02,blank_item_01];
    // if (this.state.screen_w == "window_1200") { // window_1200
    //   default_blank_items = [blank_item_01,blank_item_02,blank_item_01,blank_item_02,blank_item_01];
    // }
    
    let menuItemArray = <></>;
    let test = <></>;
    if (categoryArray.length > 0) {
      menuItemArray = categoryArray.map((category_item, index)=>{
        
        // get blank menu item
        let result_remain = [];
        let diff_number = this.state.default_item_number - category_item.items.length;
        if(diff_number > 0){
          result_remain = default_blank_items.filter((item, item_index)=>{
            if(item_index >= category_item.items.length){
              return item;
            }
          });
        }
        return(
          <>
            <div key={index} className="menu-item">
              <div className="item-title">
                {category_item.category.category_view_name}
              </div>
              <div className="item-content">
                {category_item.items.map((ele, idx)=>{
                  if(this.view_soap_focus_menu == 1 && ele.id == 307){
                    ele.name = "ＳＯＡＰ＆フォーカス";
                  }
                  let enablePatientPage = ele.enabled_in_patient_page == 1;
                  let enableDefaultPage = ele.enabled_in_default_page == 1;
                  let patientPage =  this.isPatientPage(ele.tab_id);
                  let permission = true;
                  // 入外区分によって機能が使えるかどうかを設定できるように(1)
                  let enableKarteStatus = this.getEnableKarteStatus(ele);
                  if (!enableKarteStatus) {
                    permission = false;
                  }
                  // マスタ設定権限
                  if(permission_master.includes(ele.id) && !this.context.$canDoAction(this.context.FEATURES.MASTER_SETTING, this.context.AUTHS.EDIT, 0)) {
                    permission = false;
                  }
                  // お知らせ管理権限
                  if(permission_notice.includes(ele.id) && !this.context.$canDoAction(this.context.FEATURES.NOTIFICATION, this.context.AUTHS.EDIT, 0)) {
                    permission = false;
                  }
                  // システム設定権限
                  if(permission_system_setting.includes(ele.id) && !this.context.$canDoAction(this.context.FEATURES.SYSTEM_SETTING, this.context.AUTHS.EDIT, 0)) {
                    permission = false;
                  }
                  // 訪問診療スケジュール権限
                  if(permission_visit_schedule_add.includes(ele.id) && !this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.REGISTER, 0)
                  ) {
                    permission = false;
                  }
                  // 訪問診療スケジュール閲覧権限
                  if(permission_visit_schedule_view.includes(ele.id) && !(
                    this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.READ, 0) ||
                    this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.REGISTER, 0) ||
                    this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.EDIT, 0) ||
                    this.context.$canDoAction(this.context.FEATURES.VISIT_SCHEDULE, this.context.AUTHS.DELETE, 0)
                  )
                  ) {
                    permission = false;
                  }
                  // 委譲者オーダー承認
                  
                  
                  if(permission_NotConsented_View.includes(ele.id)){
                    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
                    permission = authInfo.staff_category === 1 ? true : false;
                  }
                  // 予約カレンダー権限
                  if(permission_reservation_schedule_add.includes(ele.id) && !this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.REGISTER, 0)
                  ) {
                    permission = false;
                  }
                  // 予約カレンダー閲覧権限
                  if(permission_reservation_schedule_view.includes(ele.id) && !(
                    this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.READ, 0) ||
                    this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.REGISTER, 0) ||
                    this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.EDIT, 0) ||
                    this.context.$canDoAction(this.context.FEATURES.RESERVATION_SCHEDULE, this.context.AUTHS.DELETE, 0)
                  )
                  ) {
                    permission = false;
                  }
                  
                  // カルテの記載を行うメニューが1の項目は、閲覧モードではdisabled
                  if (patientPage && current_system_patient_id > 0 && this.context.$getKarteMode(current_system_patient_id) == KARTEMODE.READ && ele.enabled_karte == 1) {
                    if (ele.id != 290) { // PACS enable in read mode
                      permission = false;
                    }
                  }
                  
                  // カルテのみのメニューに関する制御の追加
                  if (this.patient_menu_enable_in_not_patient_page == 0 && enablePatientPage == true && enableDefaultPage != true && patientPage != true) {
                    permission = false;
                  }
                  
                  // check menu permission (only 閲覧:10)
                  if (!this.checkMenuHasPermission(10, ele.id)) {
                    permission = false;
                  }
                  
                  // check menu enable
                  // if (this.isEnableMenuItem(ele) == false) {
                  if (ele.is_enabled != 1) {
                    permission = false;
                  }
                  // menu icon
                  let icon_img = null;
                  karte_image_array.map(item=>{
                    if (item.id == ele.id) {
                      icon_img = item.img;
                    }
                  });
                  
                  // default menu icon
                  
                  let icon = this.getIcon(ele.icon != undefined && ele.icon != null ? ele.icon : "");
                  
                  //看護プロフィール メニュー name
                  if (ele.id == 305){
                    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
                    this.nurse_profile_simple = 1;
                    if(initState !== undefined && initState != null && initState.conf_data !== undefined && initState.conf_data.nurse_profile_simple !== undefined){
                      this.nurse_profile_simple = initState.conf_data.nurse_profile_simple;
                    }
                    if (this.nurse_profile_simple == 1) ele.name = 'データベース';
                  }
                  
                  return(
                    <>
                      {patientPage == true ? (
                        <>
                          {enablePatientPage == true && enableDefaultPage != true ? (
                            <div
                              key={index}
                              className={`menu-clickable-item ${this.props.favouriteList.includes(ele.id) ? "favourite-button" : ""} ${idx % 2 == 0 ? "btn-green" : "btn-white"} ${permission == false && "disable-button"}`}
                              onContextMenu={e => this.handleClick(e, ele.id)}
                              draggable={'true'}
                              onDragStart={e => this.onDragStart(e, ele.id)}
                              onClick={()=>this.onGotoUrl(ele, permission)}>
                              <a>
                                {icon_img != null ? (
                                  <img src={icon_img} />
                                ) : (
                                  <Icon icon={icon} />
                                )}
                                <span>{ele.name}</span>
                              </a>
                            </div>
                          ) : (
                            <>
                              {enableDefaultPage == true ? (
                                <div
                                  key={index}
                                  className={`menu-clickable-item ${this.props.favouriteList.includes(ele.id) ? "favourite-button" : ""} ${idx % 2 == 0 ? "btn-green" : "btn-white"} ${permission == false && "disable-button"}`}
                                  onContextMenu={e => this.handleClick(e, ele.id)}
                                  draggable={'true'}
                                  onDragStart={e => this.onDragStart(e, ele.id)}
                                  onClick={()=>this.onGotoUrl(ele, permission)}>
                                  <a>
                                    {icon_img != null ? (
                                      <img src={icon_img} />
                                    ) : (
                                      <Icon icon={icon} />
                                    )}
                                    <span>{ele.name}</span>
                                  </a>
                                </div>
                              ) : (
                                <div
                                  className={`menu-clickable-item  ${idx % 2 == 0 ? "btn-green" : "btn-white"}`}
                                  key={index}>
                                  <a>
                                    <Icon icon={icon} />
                                    <span>{ele.name}</span>
                                  </a>
                                </div>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {enableDefaultPage == true ? (
                            <div
                              key={index}
                              className={`menu-clickable-item ${this.props.favouriteList.includes(ele.id) ? "favourite-button" : ""} ${idx % 2 == 0 ? "btn-green" : "btn-white"} ${permission == false && "disable-button"}`}
                              onContextMenu={e => this.handleClick(e, ele.id)}
                              draggable={'true'}
                              onDragStart={e => this.onDragStart(e, ele.id)}
                              onClick={()=>this.onGotoUrl(ele, permission)}>
                              <a>
                                {icon_img != null ? (
                                  <img src={icon_img} />
                                ) : (
                                  <Icon icon={icon} />
                                )}
                                <span>{ele.name}</span>
                              </a>
                            </div>
                          ) : (
                            <>
                              {enablePatientPage == true ? (
                                <div
                                  key={index}
                                  className={`menu-clickable-item ${this.props.favouriteList.includes(ele.id) ? "favourite-button" : ""} ${idx % 2 == 0 ? "btn-green" : "btn-white"} ${permission == false && "disable-button"}`}
                                  onContextMenu={e => this.handleClick(e, ele.id)}
                                  draggable={'true'}
                                  onDragStart={e => this.onDragStart(e, ele.id)}
                                  onClick={()=>this.onGotoUrl(ele, permission)}>
                                  <a>
                                    {icon_img != null ? (
                                      <img src={icon_img} />
                                    ) : (
                                      <Icon icon={icon} />
                                    )}
                                    <span>{ele.name}</span>
                                  </a>
                                </div>
                              ) : (
                                <div
                                  className={`disable-button ${idx % 2 == 0 ? "btn-green" : "btn-white"}`}
                                  key={index}>
                                  <a>
                                    <Icon icon={icon} />
                                    <span>{ele.name}</span>
                                  </a>
                                </div>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  );
                  
                })}
                {result_remain}
              </div>
              {this.state.openStaffSettingModal && (
                <StaffSettingModal
                  closeModal={this.closeModal}
                />
              )}
              {this.state.openGeneralSettingModal && (
                <GeneralSettingModal
                  closeModal={this.closeModal}
                />
              )}
              {this.state.openTerminalSettingModal && (
                <TerminalSettingModal
                  closeModal={this.closeModal}
                />
              )}
            </div>
          </>
        )
      });
    }
    
    return (
      <>
        {test}
        {menuItemArray}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          favouriteMenuType={this.state.favouriteMenuType}
          favouriteList={this.props.favouriteList}
        />
      </>
    );
  }
}
ItemMenu.propTypes = {
  onGoto: PropTypes.func,
  groups: PropTypes.array,
  items: PropTypes.array,
  updateFavouriteList: PropTypes.func,
  favouriteList: PropTypes.array,
  screen_width: PropTypes.string,
  sp_width: PropTypes.number,
  tab_id: PropTypes.number,
};

ItemMenu.contextType = Context;
export default ItemMenu;