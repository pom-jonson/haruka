import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { secondary, onSurface } from "~/components/_nano/colors";
import Context from "~/helpers/configureStore";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {faPlus} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "~/components/atoms/Button";
// import * as localApi from "~/h/cacheLocal-utils";
import {
    OPERATION_TYPE,
    // PERMISSION_TYPE,
    // SOAP_TREE_CATEGORY,
    // TREE_FLAG,
    CACHE_LOCALNAMES,
    // FUNCTION_ID_CATEGORY,
    KARTEMODE, 
    CACHE_SESSIONNAMES,
    // Karte_Types,
} from "~/helpers/constants";
import $ from "jquery";

const H2 = styled.h2`
  border-left: 4px solid ${secondary};
  color: ${onSurface};
  font-family: NotoSansJP;
  font-size: 14px;
  padding-left: 4px;  
`;

const PresH2 = styled.h2`
  border-left: 4px solid ${secondary};
  color: ${onSurface};
  font-family: NotoSansJP;
  font-size: 14px;
  padding-left: 4px;
  width: 20rem;
  float:left; 
`;

const DivBtn = styled.div`
  .no-selected{
    border: 1px solid darkgrey;
    padding: 4px 8px;
    background-color: white;
    span {
      color: black;
      font-weight: normal;
    }
    float:right;
    margin-top:-0.2rem;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  margin-right: 4px;
`;

const defaultProps = {
  title: ""
};

const ContextMenuUl = styled.ul`
  margin-bottom: 0px;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
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
`;

// prescription
const ContextMenu = ({
  visible,
  x,
  y,
  preset_do_deployment,
  preset_menu_array,
  categoryOperation,
  presData,
  parent
}) => {
  if (visible && categoryOperation !== undefined) {
      //処方Do展開
      let preset_do_deployment_array = [];
      let preset_do_deployment_count = 0;
      if (preset_do_deployment !== undefined && preset_do_deployment != null){
          preset_do_deployment_count = preset_do_deployment.length;
      }
      if (preset_do_deployment_count !== 0) {
          if(preset_do_deployment_count === 1) {
              preset_do_deployment_array.push("処方Do展開");
          }
          if(preset_do_deployment_count > 1) {
              for (let i=1; i<=preset_do_deployment_count; i++) {
                  let menu_str = "処方Do" + "(" + i +")" + "展開";
                  preset_do_deployment_array.push(menu_str);
              }
          }
      }

    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>          
          <>
            <li>              
              <div onClick={() => parent.contextMenuAction("doDeleteArea", categoryOperation)}>
                {categoryOperation == OPERATION_TYPE.REGIST?"入力を破棄":categoryOperation == OPERATION_TYPE.EDIT?"変更を破棄":"削除を取りやめ"}
              </div>
            </li>
            <li>
                <div onClick={() =>parent.contextMenuAction("last_prescription")}>前回処方</div>
            </li>
            {preset_do_deployment_array.length > 0 && preset_do_deployment_array.map((item,index)=>{
                return (<li key={index}><div onClick={() =>parent.contextMenuAction("prescription_do_deployment:"+index)}>{item}</div></li>)
            })}

            {preset_menu_array !== undefined && preset_menu_array != null && preset_menu_array.length > 0 && preset_menu_array.map((item,index)=>{
                return (<li key={index}><div onClick={() =>parent.contextMenuAction("prescription_do_set",presData,index)}><Icon icon={faPlus}/>{item}</div></li>)
            })}
          </>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

// injection
const ContextInjectionMenu = ({
  visible,
  x,
  y,  
  categoryOperation,
  parent
}) => {
  if (visible && categoryOperation !== undefined) {
    return (          
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>          
          <>
            <li>              
              <div onClick={() => parent.contextMenuAction("doDeleteArea", categoryOperation)}>
                {categoryOperation == OPERATION_TYPE.REGIST?"入力を破棄":categoryOperation == OPERATION_TYPE.EDIT?"変更を破棄":"削除を取りやめ"}
              </div>
            </li>
          </>                              
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class TitleHasMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,            
      },
      contextInjectionMenu: {
        visible: false,
        x: 0,
        y: 0,            
      },
      categoryOperation: -1,
      isForUpdate:props.isForUpdate != undefined ? props.isForUpdate : false,
    }
    this.titleCheck = this.titleCheck.bind(this);
  }

  titleCheck(title) {
    if (title === "処方歴") {
      this.props.allPrescriptionOpen();
    }
  }

  testTitleRender = (data) =>{
    this.setState({
      title: (data.title != undefined && data.title != "") ? data.title : this.props.title,
      isForUpdate:data.status != undefined ? data.status : this.props.isForUpdate,
    });
  }

  fnMouseDown = (e, menuType) => {
    if (this.context.$getKarteMode(this.props.patientId) == KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
      if(e.button == 2 && menuType == "prescription") { // if 右クリック
        e.preventDefault();
        e.target.click();
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
        if (
          document.getElementById("div-title") !== undefined &&
          document.getElementById("div-title") !== null
        ) {
          document
            .getElementById("div-title")
            .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                contextMenu: { visible: false }
              });
              document
                .getElementById("div-title")
                .removeEventListener(`scroll`, onScrollOutside);
            });
        }
        //  処方Do展開
        let preset_do_deployment_cache = karteApi.getVal(this.props.patientId,CACHE_LOCALNAMES.PRESET_DO_DEPLOYMENT);
        let preset_do_deployment;
        if (preset_do_deployment_cache !== undefined && preset_do_deployment_cache != null){
            let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
            let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
            let patient_do_get_mode = initState.patient_do_get_mode;
            if(patient_do_get_mode == 0 || authInfo.staff_category === 1){
                preset_do_deployment = preset_do_deployment_cache;
            } else {
                if(this.context.selectedDoctor.code > 0 && preset_do_deployment_cache[this.context.selectedDoctor.code] !== undefined){
                    preset_do_deployment = preset_do_deployment_cache[this.context.selectedDoctor.code];
                } else {
                    preset_do_deployment = null;
                }
            }
        }

        // 処方Do登録
        let preset_menu_array = [];
        let cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.m_cacheSerialNumber);
        if(cache_data !== undefined && cache_data != null && cache_data[0]['presData'][0]['medicines'][0]['medicineName'] !== ""){
            if (this.context.$canDoAction(this.context.FEATURES.PRESET_DO_PRESCRIPTION,this.context.AUTHS.REGISTER)){
                let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
                let patient_do_max_number = initState.patient_do_max_number;
                let preset_do_data = karteApi.getVal(this.props.patientId,CACHE_LOCALNAMES.PRESET_DO_PRESCRIPTION);
                let preset_do_count = 0;
                if (preset_do_data == undefined || preset_do_data == null || preset_do_data.length == 0){
                    preset_do_count = 1;
                } else {
                    preset_do_count = preset_do_data.length >= patient_do_max_number ? patient_do_max_number: preset_do_data.length + 1;
                }
                if (preset_do_count==1) {
                    preset_menu_array.push("処方Do登録");
                } else {
                    for (var i=1; i<=preset_do_count; i++) {
                        let menu_str = "処方Do" + "(" + i +")" + "登録";
                        preset_menu_array.push(menu_str);
                    }
                }
            }
        }

        this.setState({
          contextMenu: {
            visible: true,
            x: e.clientX - $('#div-history').offset().left,
            y: e.clientY + window.pageYOffset - 120,
            preset_do_deployment,
            preset_menu_array,
          },
          categoryOperation: this.state.isForUpdate ? OPERATION_TYPE.EDIT : OPERATION_TYPE.REGIST,
        });
      }

      if(e.button == 2 && menuType == "injection") { // if 右クリック
        e.preventDefault();
        e.target.click();
        // eslint-disable-next-line consistent-this
        const that = this;
        document.addEventListener(`click`, function onClickOutside() {
          that.setState({ contextInjectionMenu: { visible: false } });
          document.removeEventListener(`click`, onClickOutside);
        });
        window.addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextInjectionMenu: { visible: false }
          });
          window.removeEventListener(`scroll`, onScrollOutside);
        });
        if (
          document.getElementById("div-title") !== undefined &&
          document.getElementById("div-title") !== null
        ) {
          document
            .getElementById("div-title")
            .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                contextInjectionMenu: { visible: false }
              });
              document
                .getElementById("div-title")
                .removeEventListener(`scroll`, onScrollOutside);
            });
        }
        this.setState({
          contextInjectionMenu: {
            visible: true,
            x: e.clientX - $('#injection-div-history').offset().left,
            y: e.clientY + window.pageYOffset - 120          
          },
          categoryOperation: this.state.isForUpdate ? OPERATION_TYPE.EDIT : OPERATION_TYPE.REGIST
        });
      }
  }  

  contextMenuAction = (act, nCategoryOperation, preset_do_count=null) => {
    if (this.props.menuType == "prescription") {
      this.props.contextMenuAction(act, nCategoryOperation, preset_do_count);
    } else if(this.props.menuType == "injection") {
      this.props.contextMenuAction(act, nCategoryOperation);
    }
  }

  render() {
    return (
      <>
      {/*<H2 onClick={() => this.titleCheck(this.state.title)} onMouseDown={(e) => this.props.fnMouseDown(e, this.props.menuType)}>*/}
      {this.props.menuType == "prescription" ? (
        <PresH2 onClick={() => this.titleCheck(this.state.title)} onMouseDown={(e) => this.fnMouseDown(e, this.props.menuType)}>
          {this.state.title}
        </PresH2>
      ):(      
        <H2 onClick={() => this.titleCheck(this.state.title)} onMouseDown={(e) => this.fnMouseDown(e, this.props.menuType)}>
          {this.state.title}
        </H2>
      )}
      {this.props.menuType == "prescription" && (
        <DivBtn>
          <Button className="no-selected" onClick={this.props.changeAllRpDays}>投与日数一括変更</Button>
        </DivBtn>
      )}
      <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          categoryOperation={this.state.categoryOperation}
          presData={this.state.presData}
        />
      <ContextInjectionMenu
          {...this.state.contextInjectionMenu}
          parent={this}                  
          categoryOperation={this.state.categoryOperation}
        />       
      </>
    );
  }
}
TitleHasMenu.contextType = Context;
TitleHasMenu.defaultProps = defaultProps;
TitleHasMenu.propTypes = {
  title: PropTypes.string,
  allPrescriptionOpen: PropTypes.func.isRequired,
  menuType: PropTypes.string,
  isForUpdate: PropTypes.bool,
  patientId: PropTypes.number,
  fnMouseDown: PropTypes.func,
  contextMenuAction: PropTypes.func,
  changeAllRpDays: PropTypes.func
};

export default TitleHasMenu;
