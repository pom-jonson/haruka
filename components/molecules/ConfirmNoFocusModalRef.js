import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "../_nano/colors";
import Button from "../atoms/Button";
import { KEY_CODES } from "../../helpers/constants";
import renderHTML from 'react-render-html';
import $ from "jquery";

const DoubleModal = styled.div`
  font-family: NotoSansJP;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 4px 4px 4px 0;
  margin: 0;
  font-size: 20px;
  font-weight: bold;
`;

class ConfirmNoFocusModalRef extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this); 
    this.state = {
      curFocus: props.curFocus !== undefined ? props.curFocus : 1,
      modal_show: false,      
    }    
    this.btns = [];
    this.flag = props.curFocus !== undefined ? props.curFocus : 0;
    this.timer = undefined;
  }

  async componentDidMount() {
    $("#no_focus_ref_cancel_btn").focus();
    this.btns = ["btnOK","btnCancel"];
    this.setState({
      curFocus: this.props.curFocus !== undefined ? this.props.curFocus : 1
    });
    this.flag = this.props.curFocus !== undefined ? this.props.curFocus : 1;
    
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
        this.confirmOk();
      }else{
        this.confirmCancel();
      }      
    }
  }
  testConfirmRender = (modal_show) =>{
    this.setState({modal_show:modal_show},()=>{
    this.timer = setInterval(() => {
      if (modal_show == true)
        $("#no_focus_ref_cancel_btn").focus();
    }, 500);

    });
  }

  confirmCancel = () => {
    this.setState({
      modal_show: false
    });
  }

  confirmOk = () => {
    this.setState({
      modal_show: false
    },()=>{
      this.props.confirmOk();
    });
  }
  onHide = () => {};
  
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
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
        show={this.state.modal_show}       
        id="confirm-no-focus"
        onHide={this.onHide}
        className = "system-confirm master-modal"
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
              </DoubleModal>
          </div>
        </Modal.Body>        
        <Modal.Footer>
          {/* <div                 
            onClick={this.confirmCancel}
            className={this.state.curFocus === 1 ? "custom-modal-btn cancel-btn focus " : "custom-modal-btn cancel-btn"}
            style={{cursor:"pointer"}}
          >
            <span>キャンセル</span>
          </div>
          <div     
            id="system_confirm_Ok"            
            className={this.state.curFocus === 0 ? "custom-modal-btn red-btn focus " : "custom-modal-btn red-btn"}
            onClick={this.confirmOk}
            style={{background:this.props.OkBackground !== undefined ? this.props.OkBackground:"",cursor:"pointer"}}
          >
            <span>はい</span>
          </div> */}
          <Button className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"} id="no_focus_ref_cancel_btn" onClick={this.confirmCancel}>キャンセル</Button>
          <Button id="system_confirm_Ok" className={this.state.curFocus === 0?"red-btn focus": "red-btn"} style={{background:this.props.OkBackground !== undefined ? this.props.OkBackground:""}} onClick={this.confirmOk}>はい</Button> 
        </Modal.Footer>
      </Modal>
    );
  }
}
ConfirmNoFocusModalRef.defaultProps = {
  visible: false
};

ConfirmNoFocusModalRef.propTypes = {
  hideConfirm: PropTypes.func,
  confirmOk: PropTypes.func,
  confirmCancel: PropTypes.func,
  confirmTitle: PropTypes.string,
  OkBackground: PropTypes.string,
  curFocus:PropTypes.number,
  title:PropTypes.string,
};

export default ConfirmNoFocusModalRef;
