import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "../_nano/colors";
import Button from "../atoms/Button";
import { KEY_CODES } from "~/helpers/constants";
import { formatJapan} from "~/helpers/date";

const DoubleModal = styled.div`
  font-family: NotoSansJP;
  font-size: 20px;
  font-weight: bold;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 10px 20px;
  margin: 0;
  max-width: 60vw;
  p{
    margin-bottom: 5px !important;
  }

`;

class SamePatientAlertModal extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this); 
    this.state = {
      curFocus: props.curFocus !== undefined ? props.curFocus : 0,
    }    
    this.btns = [];
    this.flag = props.curFocus !== undefined ? props.curFocus : 0;
  }

  async componentDidMount() {
    if (
      document.getElementById("system_confirm_Ok") !== undefined &&
      document.getElementById("system_confirm_Ok") !== null
    ) {
      document.getElementById("system_confirm_Ok").focus();
    }

    this.btns = ["btnOK","btnCancel"];
    this.setState({
      curFocus: this.props.curFocus !== undefined ? this.props.curFocus : 0
    });
    this.flag = this.props.curFocus !== undefined ? this.props.curFocus : 0;
  }

  getMoveFlagName = (nFlag) => {
    let result = "";
    switch(nFlag){
      case 0:
        result = "透析中";
        break;
      case 1:        
        result = "転院";
        break;
      case 2:
        result = "治癒";
        break;
      case 3:
        result = "一時転出";
        break;
      case 4:
        result = "離脱";
        break;
      case 5:
        result = "死亡";
        break;
      case 6:
        result = "CAPD";
        break;
      case 7:
        result = "CAPD併用";
        break;
    }

    return result;
  }

  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.left || e.keyCode === KEY_CODES.right) {      
      let fnum = (this.flag + 1) % this.btns.length; 

      this.setState({curFocus : fnum});
      this.flag = fnum;   
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      if (this.flag === 0) {
        this.props.confirmOk();
      }else{
        this.props.confirmCancel();
      }      
    }
  }


  render() {    
    return (
      <Modal
        show={true}       
        id="system_alert_dlg"
        // onHide={this.props.hideModal}
        className = "register-alert-modal master-modal"
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >
        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>          
          <DoubleModal>
          <div>
            <p>{this.props.confirmTitle}</p>
            <ul>
            {this.props.data_list != undefined && this.props.data_list.length > 0 && this.props.data_list.map((item, key) => {
              let item_info = item.patient_number + "：" + item.patient_name + "（"+ item.kana_name +"）"+"様  " + formatJapan(new Date(item.birthday)) + "生"+"（"+item.age+"歳）" + " [移動："+ this.getMoveFlagName(item.move_flag) + "]";
              return (
                <>                
                  <li key = {key}>{item_info}</li>
                </>
              )
            })}
            </ul>
          </div>
          </DoubleModal>
        </Modal.Body>        
        <Modal.Footer>
          <Button className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"} onClick={this.props.confirmCancel}>キャンセル</Button>
          <Button id="system_confirm_Ok" className={this.state.curFocus === 0?"red-btn focus": "red-btn"} style={{background:this.props.OkBackground !== undefined ? this.props.OkBackground:""}} onClick={this.props.confirmOk}>はい</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
SamePatientAlertModal.propTypes = {  
  hideConfirm: PropTypes.func,
  confirmOk: PropTypes.func,
  confirmCancel: PropTypes.func,
  confirmTitle: PropTypes.string,
  OkBackground: PropTypes.string,
  curFocus:PropTypes.number,
  title:PropTypes.string,
  data_list: PropTypes.array,
};

export default SamePatientAlertModal;
