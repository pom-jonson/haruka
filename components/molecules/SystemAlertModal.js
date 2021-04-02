import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "../_nano/colors";
import Button from "../atoms/Button";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";

const DoubleModal = styled.div`
  font-family: NotoSansJP;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 4px 4px 4px 0;
  margin: 0;
  p{
    margin-bottom: 5px !important;
    word-break: break-all;
  }
`;

class SystemAlertModal extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    if (
      document.getElementById("system_btn_Ok") !== undefined &&
      document.getElementById("system_btn_Ok") !== null
    ) {
      document.getElementById("system_btn_Ok").focus();
    }
  }

  enableHaruka = () => {    
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if (initState == null || initState == undefined) {
      return "haruka";
    }    
    if(initState.enable_ordering_karte == 1) return "haruka";
    if(initState.enable_dialysis == 1) return "dialysis";
    return "haruka";    
  }

  canShowTitle = () => {
    let result  = false;
    if(this.props.showTitle == true) result = true;
    return result;
  }

  render() {    
    return (
      <Modal
        show={true}       
        id="system_alert_dlg"
        // onHide={this.props.hideModal}
        className = {this.enableHaruka() != "haruka" ? "system-alert-modal windows-alert-message master-modal no-top-modal":"system-alert-modal windows-alert-message"}
        tabIndex="0"
      >
        {this.enableHaruka() != "haruka" && (
          <Modal.Header>
            <Modal.Title>{this.props.title != null && this.props.title != undefined && this.props.title != "" ? this.props.title: ""}</Modal.Title>
          </Modal.Header>
        )}
        {this.enableHaruka() == "haruka" && this.canShowTitle() == true && (
          <Modal.Header>
            <Modal.Title>{this.props.title != null && this.props.title != undefined && this.props.title != "" ? this.props.title: ""}</Modal.Title>
          </Modal.Header>
        )}
        <Modal.Body>
          <div className="auto-logout">  
              <DoubleModal>
              <div>              
                {this.props.showMedicineContent != undefined && this.props.showMedicineContent.replace(/[\n\r]+/g, '\\n').split("\\n").map((item, key) => {
                  return (
                    <>
                    {item == "" ? (<br />) : (<p key={key}>{item}</p>) }
                    </>
                  )
                })}
              </div>
              </DoubleModal>
          </div>
        </Modal.Body>        
        <Modal.Footer>          
            <Button className="red-btn" id="system_btn_Ok" onClick={this.props.handleOk}>OK</Button>
        </Modal.Footer>        
      </Modal>
    );
  }
}
SystemAlertModal.propTypes = {  
  hideModal: PropTypes.func,
  handleOk: PropTypes.func,
  showTitle: PropTypes.bool,
  showMedicineContent: PropTypes.string,
  title: PropTypes.string,
};

export default SystemAlertModal;
