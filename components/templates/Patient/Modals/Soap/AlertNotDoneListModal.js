import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "~/components/_nano/colors";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import PatientNotDoneListModal from "~/components/templates/Patient/Modals/Soap/PatientNotDoneListModal";
import { KEY_CODES } from "~/helpers/constants";

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

class AlertNotDoneListModal extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.state = {
      curFocus: 0,
      alert_message: "実施予定を過ぎているオーダーがあります。確認して実施や中止を行ってください",
      title: "注意",
      visible: false,
      isOpenPatientNotDoneListModal: false,
    }
    this.btns = [];
    this.flag = 1;
  }

  componentDidUpdate() {
    if (
      document.getElementById("system_not_done_alert_dlg") !== undefined &&
      document.getElementById("system_not_done_alert_dlg") !== null
    ) {
      // console.log("system_not_done_alert_dlg focus --------------");
      document.getElementById("system_not_done_alert_dlg").focus();      
    }
  }

  async componentDidMount() {
    if (
      document.getElementById("system_not_done_alert_dlg") !== undefined &&
      document.getElementById("system_not_done_alert_dlg") !== null
    ) {
      // console.log("system_not_done_alert_dlg focus --------------");
      document.getElementById("system_not_done_alert_dlg").focus();      
    }
    this.btns = ["btnOK","btnCancel"];
    this.setState({
      curFocus: 0,
      visible: this.props.visible,
    });
    this.flag = 1;
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
    this.setState({visible: p_visible},()=>{
      if (this.state.visible == true) {        
        // console.log("callVisible: true");
        if (
          document.getElementById("system_not_done_alert_dlg") !== undefined &&
          document.getElementById("system_not_done_alert_dlg") !== null
        ) {
          // console.log("system_not_done_alert_dlg focus --------------");
          document.getElementById("system_not_done_alert_dlg").focus();
          // if (
          //   document.getElementById("system_not_dont_confirm_cancel") !== undefined &&
          //   document.getElementById("system_not_dont_confirm_cancel") !== null
          // ) {
          //   console.log("system_not_dont_confirm_cancel focus =========");
          //   document.getElementById("system_not_dont_confirm_cancel").focus();
          // }
        }
        this.btns = ["btnOK","btnCancel"];
        this.setState({
          curFocus: 0,          
        });
        this.flag = 1;
      }
    });
  }

  showNotDoneListModal = () => {
    this.setState({
      isOpenPatientNotDoneListModal: true,

    });
  }

  closeNotDoneListModal = () => {
    this.props.closeModal();
  }

  onKeyPressed(e) {
    // console.log("keypressed");
    if (e.keyCode === KEY_CODES.left || e.keyCode === KEY_CODES.right) {
      let fnum = (this.flag + 1) % this.btns.length;
      
      this.setState({curFocus : fnum});
      this.flag = fnum;
    }
    if (e.keyCode === KEY_CODES.enter) {
      // console.log("enter key");
      // console.log("this.flag", this.flag);
      e.stopPropagation();
      e.preventDefault();
      if (this.flag === 0) {
        this.showNotDoneListModal();
      }else{
        this.props.closeModal();
      }
    }
  }

  render() {
    let {title, alert_message} = this.state;
    // console.log("render ------------------ this.state.curFocus", this.state.curFocus);
    // console.log("this.flag", this.flag);
    // console.log("this.state.visible", this.state.visible);
    return (
      <Modal
        show={this.state.visible}
        id="system_not_done_alert_dlg"
        onHide={this.onHide}
        onKeyDown={this.onKeyPressed}
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
          {this.state.isOpenPatientNotDoneListModal && (
            <PatientNotDoneListModal
              closeModal={this.closeNotDoneListModal}
              // patientInfo={patientInfo}
              patientId={this.props.patientId}
            />
          )}
        </Modal.Body>        
        <Modal.Footer>       
          <div     
            id="system_not_dont_confirm_cancel"            
            className={this.state.curFocus === 0 ? "custom-modal-btn cancel-btn focus " : "custom-modal-btn cancel-btn"}
            onClick={this.props.closeModal}
            style={{background:this.props.OkBackground !== undefined ? this.props.OkBackground:"",cursor:"pointer"}}
          >
            <span>キャンセル</span>
          </div>
          <div     
            id="system_confirm_Ok"            
            className={this.state.curFocus === 1 ? "custom-modal-btn red-btn focus " : "custom-modal-btn red-btn"}
            onClick={this.showNotDoneListModal}
            style={{background:this.props.OkBackground !== undefined ? this.props.OkBackground:"",cursor:"pointer"}}
          >
            <span>詳細</span>
          </div>             
        </Modal.Footer>        
      </Modal>
    );
  }
}
AlertNotDoneListModal.defaultProps = {
  visible: false
};
AlertNotDoneListModal.propTypes = {
  closeModal: PropTypes.func,
  OkBackground: PropTypes.string,
  alert_message:PropTypes.string,
  title:PropTypes.string,
  patientId:PropTypes.number,
  visible:PropTypes.bool
};

export default AlertNotDoneListModal;