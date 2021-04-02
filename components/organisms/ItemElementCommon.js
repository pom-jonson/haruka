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
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
// import karte_201 from "~/components/_demo/201.png";
import { karte_image_array} from "~/helpers/kartePageResource";
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

class ItemElementCommon extends React.Component {
  constructor(props) {
    super(props);  
    let curScreenWidth = window.innerWidth;
    this.state = {      
      favouriteMenuType: 0,
      screen_w: curScreenWidth < this.props.sp_width ? "window_1200" : "window_1920",
      default_category_number: curScreenWidth < this.props.sp_width ? 8 : 16,
      default_item_number: curScreenWidth < this.props.sp_width ? 5 : 10,
    };
  }  

  UNSAFE_componentWillReceiveProps(nextProps) {
    // this.setState({ screen_w: nextProps.screen_width });
    if (nextProps.screen_width == "window_1920") {
      this.setState({        
        screen_w: nextProps.screen_width,
        default_category_number: 16,
        default_item_number: 10,
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
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset
        },
        favouriteMenuType: type
      });
    }
  }

  onGotoUrl = (ele, permission) => {
    //実施済み注射
    if (ele.id == 238) window.sessionStorage.setItem('completed_injection', 1);
    if (permission == false) {
      return;
      // window.sessionStorage.setItem("alert_messages", "権限がありません。");
    }

    if (ele.url == "") return;
    let menu_item = this.getNavigationMenuInfoById(ele.id);
    if (menu_item != null && menu_item != undefined) {
      menu_item.ele = ele;
    }
    localApi.setObject("select_menu_info", menu_item);
    this.props.onGoto(ele.url, ele.id, menu_item);
  };

  onGotoPatientUrl = (ele, permission) => {
    if (permission == false) {
      return;
      // window.sessionStorage.setItem("alert_messages", "権限がありません。");
    }

    if (ele.url == "") return;
    let menu_item = this.getNavigationMenuInfoById(ele.id);
    if (menu_item != null && menu_item != undefined) {
      menu_item.ele = ele;
      menu_item.menuTab = this.props.tab_id;
    }
    localApi.setObject("select_menu_info", menu_item);
    this.props.onGoto(ele.url, ele.id, menu_item);
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
  
  isPatientPage = () => {
    let path = window.location.href.split("/");
    if (path[path.length-1] == "nursing_document"){
      return false;
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


  render() {
    const { groups, items } = this.props;
    // マスタ設定権限
    const permission_master=[801, 8011, 802]; 
    // お知らせ管理権限
    const permission_notice=[803]; 
    // システム設定権限
    const permission_system_setting=[804, 805, 806, 807, 808, 809,810, 811, 812, 813, 814, 815, 816, 817, 818, 819, 820, 821, 822, 823, 824, 825, 826, 827, 828, 829];
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
      // let blank_menu = {id: -1, title: ""};
    // let default_menu_items = [blank_menu, blank_menu, blank_menu, blank_menu, blank_menu, blank_menu, blank_menu, blank_menu, blank_menu, blank_menu, blank_menu, blank_menu, blank_menu, blank_menu, blank_menu, blank_menu];
    // if (this.state.screen_w == "window_1200") { // window_1200
    //   default_menu_items = [blank_menu, blank_menu, blank_menu, blank_menu, blank_menu, blank_menu, blank_menu, blank_menu];      
    // }

    // console.log("default_menu_items", default_menu_items);
    // console.log("groups", groups);
    // console.log("items", items);
    // let diff_menu_number = this.state.default_category_number - groups.length;
    // console.log("diff_menu_number", diff_menu_number);
    // let groups_array = [];
    // if(diff_menu_number > 0){
    //   groups_array = default_menu_items.filter((item, index)=>{
    //     if(index >= groups.length){
    //       return item;
    //     }
    //   });                
    // }
    // console.log("groups_array", groups_array);
    // let groups_origin = groups;
    // if (groups_array.length > 0) {
    //   groups_array.map(item=>{
    //     groups_origin.push(item);    
    //   });
    // }
    // console.log("groups_origin", groups_origin);
    let blank_item_01 = <div className="btn-green btn-blank disable-button">&nbsp;</div>
    let blank_item_02 = <div className="btn-white btn-blank disable-button">&nbsp;</div>
    let default_blank_items = [blank_item_01,blank_item_02,blank_item_01,blank_item_02,blank_item_01,blank_item_02,blank_item_01,blank_item_02,blank_item_01,blank_item_02];
    if (this.state.screen_w == "window_1200") { // window_1200
      default_blank_items = [blank_item_01,blank_item_02,blank_item_01,blank_item_02,blank_item_01];
    }
    const commonGroupList = groups.map((item, index)=>{
      // check group's items visible status
      let noExistData = false;
      let group_items;
      items.map(element=>{
        if (element.groupId == item.id) {
          group_items = element.items;
        }
      });
      if (group_items.length > 0) {
        let tmp_group_items = group_items.filter(ele=>{
          if (this.isVisibleMenuItem(ele) == false) 
            return true;
          else
            return false;
        });        
        if (group_items.length == tmp_group_items.length) {
          noExistData = true;
        }
      } else {
        noExistData = true;
      }

      return(
        <>
          {noExistData == true ? (
            <></>
          ) : (          
            <div key={index} className="menu-item">            
              <div className="item-title">
                {item.title}
              </div>
              <div className="item-content">
                {items.map(element=>{
                  // get group's items
                  let commonItemList = [];
                  if (element.groupId == item.id) {
                    commonItemList = element.items;
                  }
                  let result = [];
                  let result_remain = [];
                  if (commonItemList.length > 0) {
                    result = commonItemList.filter(item=>{
                      if (this.isVisibleMenuItem(item) == true){
                        return true;
                      } else{
                        return false;
                      }
                    }).map((ele, idx)=>{
                      let icon = this.getIcon(ele.icon != undefined && ele.icon != null ? ele.icon : "");
                      let enablePatientPage = this.isEnablePatientPage(ele);
                      let enableDefaultPage = this.isEnableDefaultPage(ele);
                      let patientPage =  this.isPatientPage();
                      
                      let permission = true;

                      // if(element.groupId == 3  && item.title== "システム設定" && !this.context.$canDoAction(this.context.FEATURES.SYSTEM_SETTING,
                      //     this.context.AUTHS.READ
                      // )) {
                      //     permission = false;
                      // }

                      // メインテナンス > その他設定 > お知らせ管理

                      // マスタ設定権限                  
                      if(permission_master.includes(ele.id) && !this.context.$canDoAction(this.context.FEATURES.MASTER_SETTING, this.context.AUTHS.EDIT)) {
                          permission = false;
                      }
                      // お知らせ管理権限
                      if(permission_notice.includes(ele.id) && !this.context.$canDoAction(this.context.FEATURES.NOTIFICATION, this.context.AUTHS.EDIT)) {
                          permission = false;
                      }
                      // システム設定権限
                      if(permission_system_setting.includes(ele.id) && !this.context.$canDoAction(this.context.FEATURES.SYSTEM_SETTING, this.context.AUTHS.EDIT)) {
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
                      if (this.isEnableMenuItem(ele) == false) {
                        permission = false;
                      }
                      let icon_img = null;                      
                      karte_image_array.map(item=>{
                        if (item.id == ele.id) {
                          icon_img = item.img;
                        }
                      });
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
                                  onClick={()=>this.onGotoPatientUrl(ele, permission)}>
                                  <a>
                                    {icon_img != null ? (
                                      <img src={icon_img} />
                                    ) : (                                    
                                      <Icon icon={icon} />
                                    )}
                                    <span>{ele.value}</span>
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
                                      <span>{ele.value}</span>
                                  </a>
                              </div>
                            ) : (                            
                              <div
                                  className={`menu-clickable-item  ${idx % 2 == 0 ? "btn-green" : "btn-white"}`}
                                  key={index}>
                                  <a>
                                      <Icon icon={icon} />
                                      <span>{ele.value}</span>
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
                                      <span>{ele.value}</span>
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
                                    onClick={()=>this.onGotoPatientUrl(ele, permission)}>
                                    <a>
                                        {icon_img != null ? (
                                          <img src={icon_img} />
                                        ) : (                                   
                                          <Icon icon={icon} />
                                        )}
                                        <span>{ele.value}</span>
                                    </a>
                                </div>
                              ) : (
                              <div
                                  className={`disable-button ${idx % 2 == 0 ? "btn-green" : "btn-white"}`}
                                  key={index}>
                                  <a>
                                      <Icon icon={icon} />
                                      <span>{ele.value}</span>
                                  </a>
                              </div>
                            )}
                            </>
                          )}                      
                        </>
                          )}                      
                        </>
                      );
                    });
                  }       
                  if (element.groupId == item.id) {
                    // count blank menu items
                    let commonVisibleItems = commonItemList.filter(ele=>{
                      if (this.isVisibleMenuItem(ele) == true) 
                        return true;
                      else
                        return false;
                    })
                    let diff_number = this.state.default_item_number - commonVisibleItems.length;
                    if(diff_number > 0){
                      result_remain = default_blank_items.filter((item, index)=>{
                        if(index >= commonVisibleItems.length){
                          return item;
                        }
                      });                
                    }
                  }      
                  return(
                    <>{result}{result_remain}</>
                  );
                })}
                {item.id == -1 && (              
                    <>{default_blank_items}</>              
                )}            
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
          ) }
        </>
      )
    });        
    
    return (
      <>                          
        {commonGroupList}
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
ItemElementCommon.propTypes = {
  onGoto: PropTypes.func,
  groups: PropTypes.array,  
  items: PropTypes.array,
  updateFavouriteList: PropTypes.func, 
  favouriteList: PropTypes.array,
  screen_width: PropTypes.string,
  sp_width: PropTypes.number,
  tab_id: PropTypes.number,
};

ItemElementCommon.contextType = Context;
export default ItemElementCommon;
