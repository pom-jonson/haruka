import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "../_nano/colors";
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

class AlertNoFocusNoRenderModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curFocus: 0,
      alert_message: "実施予定を過ぎているオーダーがあります。確認して実施や中止を行ってください",
      title: "注意",
      visible: false,
    }
  }

  async componentDidMount() {
    if (
      document.getElementById("system_alert_dlg") !== undefined &&
      document.getElementById("system_alert_dlg") !== null
    ) {
      document.getElementById("system_alert_dlg").focus();
    }
    this.setState({
      curFocus: 0,
      visible: this.props.visible,
    });
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
  onHide = () => {};
  
  callVisible = (p_visible) => {
    this.setState({visible: p_visible});
  }

  render() {
    let {title, alert_message} = this.state;
    return (
      <Modal
        show={this.state.visible}
        id="system_alert_dlg"
        onHide={this.onHide}
        className = {this.enableHaruka() != "haruka" ? "system-alert-modal windows-alert-message master-modal no-top-modal":"system-alert-modal windows-alert-message"}
      >
        {title != null && title != undefined && title != "" && (
          <Modal.Header>
            <Modal.Title>{title != null && title != undefined && title != "" ? title: ""}</Modal.Title>
          </Modal.Header>
        )}
        <Modal.Body>
          <div className="auto-logout">  
              <DoubleModal>
              <div>              
                {alert_message !== undefined && alert_message !== "" && alert_message.replace(/[\n\r]+/g, '\\n').split("\\n").map((item, key) => {
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
          <div     
            id="system_confirm_Ok"            
            className={this.state.curFocus === 0 ? "custom-modal-btn red-btn focus " : "custom-modal-btn red-btn"}
            onClick={this.props.handleOk}
            style={{background:this.props.OkBackground !== undefined ? this.props.OkBackground:"",cursor:"pointer"}}
          >
            <span>OK</span>
          </div>             
        </Modal.Footer>        
      </Modal>
    );
  }
}
AlertNoFocusNoRenderModal.defaultProps = {
  visible: false
};
AlertNoFocusNoRenderModal.propTypes = {
  handleOk: PropTypes.func,
  OkBackground: PropTypes.string,
  alert_message:PropTypes.string,
  title:PropTypes.string,
  visible:PropTypes.bool
};

export default AlertNoFocusNoRenderModal;