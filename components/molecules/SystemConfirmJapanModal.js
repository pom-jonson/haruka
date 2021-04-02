import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "../_nano/colors";
import Button from "../atoms/Button";
import { KEY_CODES } from "../../helpers/constants";
import renderHTML from 'react-render-html';
import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";

const DoubleModal = styled.div`
  font-family: NotoSansJP;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 4px 4px 4px 0;
  margin: 0;
  font-size: 20px;
  font-weight: bold;

  .warning{
    color:red;
    max-height:15rem;
    overflow-y:auto;
  }
`;

class SystemConfirmJapanModal extends Component {
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
  
  enableHaruka = () => {
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    if (initState == null || initState == undefined) {
      return "haruka";
    }
    if(initState.enable_ordering_karte == 1) return "haruka";
    if(initState.enable_dialysis == 1) return "dialysis";
    return "haruka";
  }
 
  
  render() {
    // ●YJ1051 カルテ画面の入外切替や診療科切り替えでフリーズする => this.props.firstModal: true
    var title = this.props.title;
    if (title == undefined || title == null || title==''){
      var message = this.props.confirmTitle;
      if (message.indexOf('変更し') > -1) title = "変更確認";
      if (message.indexOf('登録し') > -1) title = "登録確認";
      if (message.indexOf('追加し') > -1) title = "追加確認";
      if (message.indexOf('削除し') > -1) title = "削除確認";
      if (message.indexOf('破棄し') > -1) title = "入力中";
    }
    return (
      <Modal
        show={true}
        id="system_alert_dlg"
        className ={`system-confirm master-modal ${this.props.firstModal == true ? "first-view-modal" : ""}`}
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >
        <Modal.Header><Modal.Title>{title!=undefined && title !=null && title!=''?title:renderHTML('&nbsp')}</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="auto-logout">
            <DoubleModal>
              <div>
                {this.props.confirmTitle.replace(/[\n\r]+/g, '\\n').split("\\n").map((item, key) => {
                  return (
                    <>
                      {item == "" ? (<br />) : (<p key={key}>{item}</p>) }
                    </>
                  )
                })}
              </div>
              {this.props.waring_message != undefined && this.props.waring_message != null && this.props.waring_message != '' && (
                <>
                <div className = 'warning'>                  
                  {this.props.waring_message.replace(/[\n\r]+/g, '\\n').split("\\n").map((item, key) => {
                    return (
                      <>
                        {item == "" ? (<br />) : (<p key={key}>・{item}</p>) }
                      </>
                    )
                  })}
                </div>
                </>
              )}
            </DoubleModal>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"} onClick={this.props.confirmCancel}>キャンセル</Button>
          <Button
            id="system_confirm_Ok" className={this.state.curFocus === 0?"red-btn focus": "red-btn"}
            style={{background:this.props.OkBackground !== undefined ? this.props.OkBackground:""}}
            onClick={this.props.confirmOk}
          >はい</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
SystemConfirmJapanModal.propTypes = {
  confirmOk: PropTypes.func,
  confirmCancel: PropTypes.func,
  confirmTitle: PropTypes.string,
  OkBackground: PropTypes.string,
  curFocus:PropTypes.number,
  title:PropTypes.string,
  firstModal:PropTypes.bool,
  waring_message: PropTypes.string,
};

export default SystemConfirmJapanModal;
