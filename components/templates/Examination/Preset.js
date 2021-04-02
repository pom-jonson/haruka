import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "../../_nano/colors";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";
import SelectExaminationModal from "./components/SelectExaminationModal";
import * as apiClient from "~/api/apiClient";
import Button from "../../atoms/Button";
import Spinner from "react-bootstrap/Spinner";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import auth from "~/api/auth";

const PrescriptionWrapper = styled.div`
  width: 100%;
  padding-top: 162px;
`;

const PrescriptionMain = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 162px);
  overflow-y: none;
`;
const MedicineSelectionWrapper = styled.div`
  width: 100%;
  height: auto;
  max-height: 650px;
  background-color: #ffffff;
  border: 1px solid ${colors.disable};
  border-top: none;
  overflow-y: scroll;
  -ms-overflow-style: none;
  margin-top: 10px;
`;

const MedicineListWrapper = styled.div`
  font-size: 12px;

  p {
    margin-bottom: 0;
  }

  .row {
    border-top: 1px solid ${colors.disable};
    margin: 0;
  }

  .box {
    border-top: 1px solid ${colors.disable};
    border-right: 1px solid ${colors.disable};
    float: left;
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${colors.disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 75px;
    }
    &:after {
      content: "";
      background-color: ${colors.disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 80px;
    }
  }

  .table-row {
    border-bottom: 1px solid ${colors.disable};
    font-size: 14px;
    line-height: 1.3;
    padding: 4px;
    &:nth-child(2n) {
      background-color: ${colors.secondary200};
    }
    &:last-child {
      border-bottom: none;
    }
  }

  .number {
    margin-right: 8px;
    width: 75px;
  }

  .text-right {
    width: calc(100% - 88px);
  }

  .w80 {
    text-align: right;
    width: 80px;
    margin-left: 8px;
  }

  .flex {
    display: flex;
    margin-bottom: 0;

    &.between {
      justify-content: space-between;

      div {
        margin-right: 0;
      }
    }

    div {
      margin-right: 8px;
    }

    .date {
      margin-left: auto;
      margin-right: 24px;
    }
  }

  .hidden {
    display: none;
  }
`;
const ListItemWrapper = styled.div`
  background-color: ${colors.onSecondaryLight};
  border-bottom: 1px solid ${colors.disable};
  font-family: "Noto Sans JP", sans-serif;
  align-items: baseline;
  width: 100%;
  padding: 8px 32px 8px 0;
  cursor: pointer;
  position: relative;

  &.open {
    &:before {
      content: "";
      background-color: ${colors.error};
      width: 8px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .date {
      padding-left: 16px;
    }

    .angle {
      transform: rotate(180deg);
    }
  }
  &.edit {
    background: #eee;
  }

  &.deleted {
    background: #ddd;
  }

  .angle {
    margin: auto;
    position: absolute;
    top: 0;
    right: 8px;
    bottom: 0;
`;

const Date = styled.span`
  color: ${colors.onSecondaryDark};
  display: inline-block;
  font-family: NotoSansJP;
  font-size: 14px;
  padding: 0 8px;
`;

const Angle = styled(FontAwesomeIcon)`
  color: ${colors.onSurface};
  cursor: pointer;
  display: inline-block;
  font-size: 25px;
`;

const Col = styled.div`
  width: 100%;
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
    number
  }) => {
    if (visible) {
      return (
        <ContextMenuUl>
          <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
            <li><div onClick={() =>parent.contextMenuAction("preset_edit", number)}>編集</div></li>
            <li><div onClick={() =>parent.contextMenuAction("preset_delete", number)}>削除</div></li>
          </ul>
        </ContextMenuUl>
      );
    } else {
      return null;
    }
  };

class Preset extends Component {
  constructor(props) {
    super(props);   
    this.state = {
        preset: [],
        isExaminationPopupOpen: false,
        isLoadData: false,
        contextMenu: {
            visible: false,
            x: 0,
            y: 0,
          },
    } 
  }
  async componentDidMount() {   
    let preset;
    await apiClient.get("/app/api/v2/order/examination/preset").then((res) => {
        preset = res;
    });
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.setState({
        preset: preset,
        isLoadData: true,
        featureAuths: authInfo.feature_auth
    });
      auth.refreshAuth(location.pathname+location.hash);

  }

  closeModal = () => {
    this.setState({isLoadData:false});
    this.componentDidMount();
    this.setState({
        isExaminationPopupOpen: false
    }, () => {
      let preset;
      apiClient.get("/app/api/v2/order/examination/preset").then((res) => {
          preset = res;
          let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
          this.setState({
              preset: preset,
              isLoadData: true,
              featureAuths: authInfo.feature_auth
          });
    
      });
    });
  }
  onAngleClicked(e, number) {
    if (e.type == 'click') {
      this.setState({
        number,
        isExaminationPopupOpen: true
      });
    }
  }
    
  registerPreset = () => {
    let isCanRegister = this.context.$canDoAction(this.context.FEATURES.PRESETEXAM,this.context.AUTHS.REGISTER) ? 1 : 0;
    if (!isCanRegister){
        window.sessionStorage.setItem("alert_messages", "権限がありません。");
        return;
    }
    this.setState({
      isExaminationPopupOpen: true,
      number: -1
    });
  }
  cancelExamination = () => this.props.history.replace("/preset/examination");
  handleClick = (e, idx) => {
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
          .getElementById("medicine_selection_wrapper")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("medicine_selection_wrapper")
              .removeEventListener(`scroll`, onScrollOutside);
          });  
      this.setState({
        contextMenu: {
          visible: true,
          number:idx,
          x: e.clientX,
          y: e.clientY + window.pageYOffset
        }
      });
    }
  }

  contextMenuAction = (act, number) => {   
    let isCanEdit = this.context.$canDoAction(this.context.FEATURES.PRESETEXAM,this.context.AUTHS.EDIT) ? 1 : 0;
    let isCanDelete = this.context.$canDoAction(this.context.FEATURES.PRESETEXAM,this.context.AUTHS.DELETE) ? 1 : 0; 
    if (act === "preset_edit") {
        if (isCanEdit === 0){
            window.sessionStorage.setItem("alert_messages","権限がありません。");
            return;
        }
        this.setState({
            number,
            isExaminationPopupOpen: true
        });
    }
    if (act === "preset_delete") {
        if (isCanDelete === 0){
            window.sessionStorage.setItem("alert_messages","権限がありません。");
            return;
        }
        this.presetDelete(number);
    }
  };

  async presetDelete(number) {
    let path = "/app/api/v2/order/examination/preset/delete";
    const post_data = this.state.preset[number].number;
    await apiClient
      ._post(path, {
        preset_number: post_data
      })
      .then((res) => {
        if (res)
          window.sessionStorage.setItem("alert_messages", res.alert_message);
      })
      .catch((err) => {
        if (err)
        window.sessionStorage.setItem("alert_messages", "通信に失敗しました。");
      });
      let preset;
    await apiClient.get("/app/api/v2/order/examination/preset").then((res) => {
        preset = res;
    });
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.setState({
        preset: preset,
        isLoadData: true,
        featureAuths: authInfo.feature_auth
    });
  }

  render() {
    let rate="";
    if(this.state.isLoadData) {
      rate = this.state.preset.map((item, idx)=>{
        return (
          <ListItemWrapper
            className="row open" key={idx}
            onContextMenu={e =>this.handleClick(e,idx)}
            onClick={e => this.onAngleClicked(e, idx)}
          >
          <Date className="date">
            {item.name}
          </Date>                    
          <Angle className="angle" icon={faAngleDown} />
         </ListItemWrapper>
        )
      })
    } else {
      rate = <SpinnerWrapper><Spinner animation="border" variant="secondary" /></SpinnerWrapper>
    }
    // let isContext = this.context.$canDoAction(this.context.FEATURES.PRESETEXAM,this.context.AUTHS.EDIT) ||
    //                 this.context.$canDoAction(this.context.FEATURES.PRESETEXAM,this.context.AUTHS.DELETE) ? 1: 0;
    // let isRegister = this.context.$canDoAction(this.context.FEATURES.PRESETEXAM,this.context.AUTHS.REGISTER) ? 1: 0;
    return (
      <div>
        <PrescriptionWrapper id="medicine_selection_wrapper">          
          <PrescriptionMain> 
            <Col>
              {/* {isRegister &&  */}
                <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick={this.registerPreset}>新規登録</Button>
              <MedicineSelectionWrapper>
                <MedicineListWrapper>
                  {rate}
                </MedicineListWrapper>
              </MedicineSelectionWrapper>
              {this.state.isExaminationPopupOpen && (
                <SelectExaminationModal
                    closeExamination={this.closeModal}
                    handleOk={this.closeModal}
                    number={this.state.number}
                />
            )}
            </Col>
            {/* {isContext && ( */}
                <ContextMenu
                {...this.state.contextMenu}
                parent={this}
            />
            {/* )} */}
          </PrescriptionMain>
        </PrescriptionWrapper>
      </div>      
    );
  }
}

Preset.contextType = Context;

Preset.propTypes = {
  history: PropTypes.object
};
export default Preset;
