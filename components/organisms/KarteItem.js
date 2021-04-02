import React from "react";
import Button from "../atoms/Button";
import PropTypes from "prop-types";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import { patientModalEvent } from "../../events/PatientModalEvent";
import SelectExaminationModal from "../templates/Patient/components/SelectExaminationModal";

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
}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction("name")
              }
            >
              お気に入り追加
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class KarteItem extends React.Component {
  static propTypes = {
    history: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = {
      isExaminationPopupOpen: false,
      isDiseasePopupOpen: false,
    };
  }

  onOpenPrescription = () => {
    this.props.onGoto("prescription");
  }

  onOpenInjection = () => {
    this.props.onGoto("injection");
  }

  onOpenSoap = () => {
    this.props.onGoto("soap");
  }

  onOpenExamination = () => {
    this.getInsuranceTypeList();
    this.setState({isExaminationPopupOpen: true});
  }

  onOpenDisease = () => {
    patientModalEvent.emit("clickOpenDetailedPatientPopup", "8");
    event.stopPropagation();
  }
  
  closeExamination = () => {
    this.setState({isExaminationPopupOpen: false});
  }

  closeModal = () => {
    this.setState({isDiseasePopupOpen: false});
  }

  getInsuranceTypeList = () => {
    let patientInfo = [];
    patientInfo.insurance_type_list = this.context.insuranceTypeList;
    this.setState({patientInfo});
  };

  handleClick = e => {
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
      });
    }
  }

  contextMenuAction = (act) => {   
    if (act === "insurance_edit") {
      // console.log("context menu click")
    }
  };

  render() {
    return (
      <>
        <div className="menu-item">
            <div className="item-title">
            記載①
            </div>
            <div className="item-content">
            <Button 
              onContextMenu={e => this.handleClick(e)}
              onClick={this.onOpenDisease}>病名</Button>
              <Button className="disable-button">テスト１</Button>
              <Button className="disable-button">テスト２</Button>
            </div>
          </div>
          <div className="menu-item">
            <div className="item-title">
            記載②
            </div>
            <div className="item-content">
            <Button 
              onContextMenu={e => this.handleClick(e)}
              onClick={this.onOpenSoap}>新規カルテ記述</Button>
              <Button className="disable-button">テスト１</Button>
              <Button className="disable-button">テスト２</Button>
            </div>
          </div>
          <div className="menu-item">
            <div className="item-title">
            予約・外来
            </div>
            <div className="item-content">
              <Button 
                onContextMenu={e => this.handleClick(e)}
                onClick={this.onOpenPrescription}>
                  外来処方</Button>
              <Button
                onContextMenu={e => this.handleClick(e)}
                onClick={this.onOpenInjection}>外来注射</Button>
                <Button className="disable-button">テスト１</Button>
                <Button className="disable-button">テスト２</Button>
            </div>
          </div>
          <div className="menu-item">
            <div className="item-title">
            入院
            </div>
            <div className="item-content">
              <Button
                onContextMenu={e => this.handleClick(e)}
                onClick={this.onOpenPrescription}>入院処方</Button>
              <Button
                onContextMenu={e => this.handleClick(e)}
                onClick={this.onOpenInjection}>実施済注射</Button>
                <Button className="disable-button">テスト１</Button>
                <Button className="disable-button">テスト２</Button>
            </div>
          </div>
          <div className="menu-item">
            <div className="item-title">
            検体検査
            </div>
            <div className="item-content">
            <Button
                onContextMenu={e => this.handleClick(e)}
                onClick={this.onOpenExamination}>検体検査</Button>
                <Button className="disable-button">テスト１</Button>
                <Button className="disable-button">テスト２</Button>
            </div>
          </div>
          {this.state.isExaminationPopupOpen && (
            <SelectExaminationModal
              closeExamination={this.closeExamination}
              patientInfo={this.state.patientInfo}
              selectExaminationFromModal={this.selectExaminationFromModal}
              handleOk={this.closeExamination}
            />
          )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
      </>
    );
  }
}

KarteItem.contextType = Context;

KarteItem.propTypes = {
  onGoto: PropTypes.func,
};

export default KarteItem;
