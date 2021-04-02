import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import RadioButtonOver from "../molecules/RadioButtonOver";
import styled from "styled-components";
import { KEY_CODES, KARTE_STATUS_TYPE } from "../../helpers/constants";
import Button from "../atoms/Button";
import $ from "jquery";

const TabContent = styled.div`
  display: block;
  max-width: 100%;
  width: 649px;
  height: calc(100% - 1rem);
  padding: 9px 9px 9px 2px;
  max-height: 700px;
  overflow: auto;
  position: relative;

  .usageListContainer {
    position: relative;
    label {
      font-size: 1rem;
    }
  }

  .usageListContainer > div {
    display: block;
  }
`;


export class KarteStatusModal extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      selectedKarteStatusIndex: -1,
      parent_karte_status: -1,
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
  }

  async componentDidMount() {
    // 外来: 0, 入院: 1, 訪問診療: 2
    let _karteStatusCode = this.props.karteStatusCode == 3 ? 1 : this.props.karteStatusCode == 2 ? 2 : 0
    this.setState({
      selectedKarteStatusIndex: _karteStatusCode,
      parent_karte_status: _karteStatusCode
    });
    if (
      document.getElementById("prescription_dlg") !== undefined &&
      document.getElementById("prescription_dlg") !== null
    ) {
      document.getElementById("prescription_dlg").focus();
    }
  }

  onKeyPressed(e) {
    if (
      e.keyCode === KEY_CODES.down ||
      e.keyCode === KEY_CODES.up ||
      e.keyCode === KEY_CODES.enter
    ) {      
      if (e.keyCode === KEY_CODES.up) {
        this.setState(
          {
            selectedKarteStatusIndex:
              this.state.selectedKarteStatusIndex >= 1
                ? this.state.selectedKarteStatusIndex - 1
                : KARTE_STATUS_TYPE.length - 1
          },
          () => {
            this.scrollToelement();
          }
        );
      }

      if (e.keyCode === KEY_CODES.down) {
        this.setState(
          {
            selectedKarteStatusIndex:
              this.state.selectedKarteStatusIndex + 1 == KARTE_STATUS_TYPE.length
                ? 0
                : this.state.selectedKarteStatusIndex + 1
          },
          () => {
            this.scrollToelement();
          }
        );
      }

      if (e.keyCode === KEY_CODES.enter) {        
        // e.preventDefault();
        // e.stopPropagation();
      }
    }
  } 

  scrollToelement = () => {
    const els = $(".med-modal [class*=focused]");
    const pa = $(".med-modal .modal-body .usageList");
    if (els.length > 0 && pa.length > 0) {
      const elHight = $(els[0]).height();
      const elTop = $(els[0]).position().top;
      const paHeight = $(pa[0]).height();
      const scrollTop = elTop - (paHeight - elHight) / 2;
      $(pa[0]).scrollTop(scrollTop);
    }
  };

  selectKarteStatus = (e) => {
    this.setState({
      selectedKarteStatusIndex: parseInt(e.target.id)
    });
  } 

  changeKarteStatus = () => {
    if (this.state.parent_karte_status == this.state.selectedKarteStatusIndex) return;
    if (KARTE_STATUS_TYPE[this.state.selectedKarteStatusIndex] != undefined) {
      let _changedKarteStatus = this.state.selectedKarteStatusIndex == 0 ? 1 : this.state.selectedKarteStatusIndex == 1 ? 3 : 2;
      this.props.handleChangeKarteStatus(_changedKarteStatus);
    }
  };
  onHide = () => {};

  getKarteStatusName = (_karteStatusCode) => {
    let result = "外来";
    result =_karteStatusCode == 1 ? "外来" : _karteStatusCode == 3 ? "入院" : "在宅";

    return result;
  }

  render() {
    const arrayKarteStatusList = [];    
    KARTE_STATUS_TYPE.map((karteStatus, index) => {
      arrayKarteStatusList.push(
        <RadioButtonOver
          key={index}
          index={index}
          id={index}
          label={karteStatus.value}
          getUsage={this.selectKarteStatus}
          name="karteStatus"          
          checked={index === this.state.selectedKarteStatusIndex}
          // onMouseOver={this.onMouseOver}
        />
      );
    });

    let karte_status_name = this.getKarteStatusName(this.props.karteStatusCode);
      
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        onKeyDown={this.onKeyPressed}
        tabIndex="0"
        id="prescription_dlg"
        className="custom-modal-sm med-modal karte-status-modal"
      >
        <Modal.Header>
          <Modal.Title>入外区分修正</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="info">
            <ul>              
              <li>元の入外区分:{karte_status_name}</li>
              <li>新しい入外区分を選んでください。</li>
            </ul>
          </div>
          <div className="categoryContent">           
            <TabContent className="usageList">
              <div className="usageListContainer">{arrayKarteStatusList}</div>
            </TabContent>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button id="btnCancel"className="cancel-btn" onClick={this.props.handleCancel}>キャンセル</Button>
          <Button id="btnOk" className={this.state.parent_karte_status == this.state.selectedKarteStatusIndex ? "disable-btn" : "red-btn"} onClick={this.changeKarteStatus}>確定</Button>
        </Modal.Footer>
      </Modal>
    );  
  }
}

KarteStatusModal.propTypes = {
  handleCancel: PropTypes.func,  
  hideModal: PropTypes.func,  
  handleChangeKarteStatus: PropTypes.func,    
  // karteStatusName: PropTypes.string,
  karteStatusCode: PropTypes.number,  
};

export default KarteStatusModal;
