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
const Icon = styled(FontAwesomeIcon)`
font-size: 16px;
margin: 0 10px 0 10px;
`;

const Wrapper = styled.div`
  display: flex;
  .menu-block{
    width: 14rem;
    height: 100%;
  }
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

class ItemElement extends React.Component {
  constructor(props) {
    super(props);  
    this.state = {      
      favouriteMenuType: 0
    };  
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

  onGotoUrl = (url, id) => {
    let url_array = url.split("/");
    if (url_array[1] === "modal"){
      this.managementModal(url_array[2]);
      return;
    }
    this.props.onGoto(url, id);
  };

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

  needPatientIdStatus = (url) => {

    // 透析->カルテの表示
    if (this.context.currentSystem == "dialysis") return false;

    if(url == "soap" || url == "prescription" || url == "injection" || url == "openExamination" || url == "diseaseName"){
      return true;
    }
    return false;    
  }

  existPatientIdStatus = () => {
    let re = /patients[/]\d+/;
    let bPatientsId = re.test(window.location.href);
    return bPatientsId ? true : false;
  }

  getMenuItem = (type) => {
    let { groups, items } = this.props;
    let patient_obj = sessApi.getObjectValue("dial_setting", "patient");
    let commonGroupList = groups.filter(ele=>{
      if (type == 0) {
        return ele;
      } else if (type == 1) {
        if (ele.title == "患者情報登録" || ele.title == "パターン登録") {
          return ele;
        }
      } else if(type == 2){
        if (ele.title == "スケジュール") {
          return ele;
        }
      } else if(type == 3){
        if (ele.title == "診療情報入力" || ele.title == "カルテ" || ele.title == "体重計") {
          return ele;
        }
      } else if(type == 4){
        if (ele.title == "ベッドサイド" || ele.title == "その他機能") {
          return ele;
        }
      }
    }).map((item, index)=>{
      return(
        <div key={index} className="menu-item">            
          <div className="item-title">
            {item.title}
          </div>
          <div className="item-content">
            {items.map(element=>{
              let commonItemList = [];
              if (element.groupId == item.id) {
                commonItemList = element.items;
              }
              let result = [];
              if (commonItemList.length > 0) {
                result = commonItemList.map(ele=>{
                  let icon = this.getIcon(ele.icon != undefined && ele.icon != null ? ele.icon : "");
                  let needPatientId = this.needPatientIdStatus(ele.url);
                  let existPatientId =  this.existPatientIdStatus();
                  let permission = true;
                  if(element.groupId == 3  && item.title== "システム設定" && !this.context.$canDoAction(this.context.FEATURES.SYSTEM_SETTING,
                      this.context.AUTHS.READ
                  )) {
                      permission = false;
                  }
                  if(ele.id == 501 && !this.context.$canDoAction(this.context.FEATURES.DIAL_FACILITY_MASTER,this.context.AUTHS.REGISTER, 0)) {
                      permission = false;
                  }
                  if(ele.id == 502 && !this.context.$canDoAction(this.context.FEATURES.DIAL_BED_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 5380 && !this.context.$canDoAction(this.context.FEATURES.DIAL_CODE_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 503 && !this.context.$canDoAction(this.context.FEATURES.DIAL_MATERIAL_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 562 && !this.context.$canDoAction(this.context.FEATURES.DIAL_INSPECTION_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 504 && !this.context.$canDoAction(this.context.FEATURES.DIAL_MEDICINE_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 569 && !this.context.$canDoAction(this.context.FEATURES.DIAL_USAGE_GROUP_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 505 && !this.context.$canDoAction(this.context.FEATURES.DIAL_USAGE_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 506 && !this.context.$canDoAction(this.context.FEATURES.DIAL_INJECTION_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 507 && !this.context.$canDoAction(this.context.FEATURES.DIAL_MEDICINES_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 508 && !this.context.$canDoAction(this.context.FEATURES.DIAL_INSPECTION_ITEM_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 509 && !this.context.$canDoAction(this.context.FEATURES.DIAL_INSPECTION_PATTERN,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 576 && !this.context.$canDoAction(this.context.FEATURES.DIAL_COMPLIATION_INSPECTION,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 510 && !this.context.$canDoAction(this.context.FEATURES.DIAL_DISEASE_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 513 && !this.context.$canDoAction(this.context.FEATURES.DIAL_ADMINFEE_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 560 && !this.context.$canDoAction(this.context.FEATURES.DIAL_HOLIDAY_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 561 && !this.context.$canDoAction(this.context.FEATURES.DIAL_OTHER_FACILITY_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 563 && !this.context.$canDoAction(this.context.FEATURES.DIAL_PRES_SET_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 568 && !this.context.$canDoAction(this.context.FEATURES.DIAL_INJECTION_SET_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 564 && !this.context.$canDoAction(this.context.FEATURES.DIAL_CLINICAL_MASTER,this.context.AUTHS.EDIT, 0)) {
                      permission = false;
                  }
                  if(ele.id == 601 && !this.context.$canDoAction(this.context.FEATURES.DIAL_STAFF_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 602 && !this.context.$canDoAction(this.context.FEATURES.DIAL_WORD_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 511 && !this.context.$canDoAction(this.context.FEATURES.DIAL_IMAGE_GENRE_MASTER,this.context.AUTHS.READ, 0)) {
                      permission = false;
                  }
                  if(ele.id == 613 && !(this.context.$canDoAction(this.context.FEATURES.FOOT_CARE_BASIC_INFORMATION_SETTING,this.context.AUTHS.READ, 0)
                    || this.context.$canDoAction(this.context.FEATURES.FOOT_CARE_BASIC_INFORMATION_SETTING,this.context.AUTHS.EDIT, 0))) {
                      permission = false;
                  }
                  // メインテナンス > その他設定 > お知らせ管理
                  if(ele.id == 603 &&  !this.context.$canDoAction(this.context.FEATURES.NOTIFICATION,
                      this.context.AUTHS.EDIT)) {
                      permission = false;
                  }

                  if(ele.id == 579 && (!this.context.$canDoAction(this.context.FEATURES.MyCalendar, this.context.AUTHS.EDIT, 0) &&
                      !this.context.$canDoAction(this.context.FEATURES.MyCalendar, this.context.AUTHS.EDIT, 0) &&
                      !this.context.$canDoAction(this.context.FEATURES.MyCalendar, this.context.AUTHS.DELETE, 0)
                  )) {
                      permission = false;
                  }

                  // ナビゲーションマップ 現在患者様指定時は透析患者マスタ[新規登録]は、クリック時にアラートを出していますが、アラートではなく、グレーアウトで押せなくしてください
                  
                  if (patient_obj != null && patient_obj != undefined && ele.id == 719) {                    
                    permission = false;
                  }
                  // console.log(element);
                  return(
                    <>
                      {ele.url == "" || (needPatientId == true && existPatientId == false) ? (
                        <button
                          disabled
                          className="disable-button"
                          key={index}>
                          <a>
                            <Icon icon={icon} />
                            <span>{ele.value}</span>
                          </a>
                        </button>
                      ):(
                          <>
                          {(permission === true) ? (
                              <button
                                  key={index}
                                  className={this.props.favouriteList.includes(ele.id) ? "favourite-button" : ""}
                                  onContextMenu={e => this.handleClick(e, ele.id)}
                                  onClick={()=>{ele.url == "diseaseName" ? this.onOpenDisease : this.onGotoUrl(ele.url, ele.id)}}>
                                  <a>
                                      <Icon icon={icon} />
                                      <span>{ele.value}</span>
                                  </a>
                              </button>

                          ) : (
                              <button
                                  disabled
                                  className="disable-button"
                                  key={index}>
                                  <a>
                                      <Icon icon={icon} />
                                      <span>{ele.value}</span>
                                  </a>
                              </button>
                          )}
                          </>
                      )}

                    </>
                  );
                });
              }
              return(
                <>{result}</>
              );
            })}
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
      )
    });
    return(
      <>
        {commonGroupList}
      </>
    );
  }

  render() {
    // this.props.tab_id == 6 => 透析
    // this.props.tab_id == 7 => メンテナンス
    // this.props.tab_id == 8 => 印刷
    let block_00 = "";
    let block_01 = "";
    let block_02 = "";
    let block_03 = "";
    let block_04 = "";
    
    if (this.props.tab_id == 6) {
      block_01 = this.getMenuItem(1);        
      block_02 = this.getMenuItem(2);        
      block_03 = this.getMenuItem(3);        
      block_04 = this.getMenuItem(4);  
    }

    if (this.props.tab_id != 6) {
      block_00 = this.getMenuItem(0);  
    }

    
    return (
      <Wrapper>                          
        {this.props.tab_id == 6 && (
          <>
          <div className="menu-block">{block_01}</div>
          <div className="menu-block">{block_02}</div>
          <div className="menu-block">{block_03}</div>
          <div className="menu-block">{block_04}</div>        
          </>
        )}
        {this.props.tab_id != 6 && (
          <>{block_00}</>
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          favouriteMenuType={this.state.favouriteMenuType}
          favouriteList={this.props.favouriteList}
        />
      </Wrapper>
    );
  }
}
ItemElement.propTypes = {
  tab_id: PropTypes.number,
  onGoto: PropTypes.func,
  groups: PropTypes.array,  
  items: PropTypes.array,
  updateFavouriteList: PropTypes.func, 
  favouriteList: PropTypes.array
};

ItemElement.contextType = Context;
export default ItemElement;
