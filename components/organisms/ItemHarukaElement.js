import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
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

class ItemHarukaElement extends React.Component {
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

  onGotoUrl = (url) => {    
    this.props.onGoto(url);
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

  render() {
    const { groups, items } = this.props;
    const commonGroupList = groups.map((item, index)=>{
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
                  let icon = this.getIcon(ele.icon);
                  let needPatientId = this.needPatientIdStatus(ele.url);
                  let existPatientId =  this.existPatientIdStatus();
                  //------------ test code start
                  needPatientId = false;
                  existPatientId = true;
                  if (ele.url == "") {
                    ele.url = "test";
                  }    
                  //------------ test code end
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
                              <button
                                  key={index}
                                  className={this.props.favouriteList.includes(ele.id) ? "favourite-button" : ""}
                                  onContextMenu={e => this.handleClick(e, ele.id)}
                          onClick={()=>{ele.url == "diseaseName" ? this.onOpenDisease : this.onGotoUrl(ele.url)}}>
                                  <a>
                                      <Icon icon={icon} />
                                      <span>{ele.value}</span>
                                  </a>
                              </button>
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
        </div>    
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
ItemHarukaElement.propTypes = {
  onGoto: PropTypes.func,
  groups: PropTypes.array,  
  items: PropTypes.array,
  updateFavouriteList: PropTypes.func, 
  favouriteList: PropTypes.array
};

export default ItemHarukaElement;
