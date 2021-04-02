import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import { KEY_CODES } from "~/helpers/constants";

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

class OverwriteConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this); 
    this.state = {
      curFocus: 0,
    }    
    this.btns = [];
    this.flag = 0; 
  }

  async componentDidMount() {
    // if (
    //   document.getElementById("system_confirm_Ok") !== undefined &&
    //   document.getElementById("system_confirm_Ok") !== null
    // ) {
    //   document.getElementById("system_confirm_Ok").focus();
    // }
    if (this.props.kind == 1){
        this.btns = ["re-edit", "overwirte","create"];
    } else {
        this.btns = ["overwirte","create"];
    }
    this.setState({
      curFocus: 0
    });
    this.flag = 0;
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
    //   if (this.flag === 0) {
    //     this.props.overwrite();
    //   }else{
    //     this.props.create();
    //   }      
    }
  }


  render() {
    return (
      <Modal
        show={true}       
        id="system_alert_dlg"
        onHide={this.props.closeModal}
        className = "system-confirm"
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >

        <Modal.Body>
          <div className="auto-logout">  
              <DoubleModal>
              <div>申し送り側の内容を上書きしますか？</div>
              </DoubleModal>
          </div>
        </Modal.Body>        
        <Modal.Footer>
            {this.props.kind == 1 && (
                <Button id="re-edit"  onClick={this.props.re_edit}>再編集</Button>  
            )}
            <Button id="overwrite"  onClick={this.props.overwrite}>上書きして保存</Button>
            <Button id="create" onClick={this.props.create}>新規で保存</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
OverwriteConfirmModal.propTypes = {
    closeModal : PropTypes.func,
    re_edit : PropTypes.func,
    overwrite: PropTypes.func,
    create : PropTypes.func,
    kind : PropTypes.number,
};

export default OverwriteConfirmModal;
