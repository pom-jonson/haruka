import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "../_nano/colors";
import Button from "../atoms/Button";
import { KEY_CODES } from "../../helpers/constants";

const DoubleModal = styled.div`
  font-family: NotoSansJP;
  font-size: 20px;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 4px 4px 4px 0;
  margin: 0;
  p{
    margin-bottom: 5px !important;
  }
  max-height: 70vh;
  overflow-y: auto;
`;

class DiagnosisRpModal extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this);    
    this.state = {
      curFocus: 1,
    }
    this.btns = [];  
    this.flag = 1;
  }

  async componentDidMount() {
    this.btns = ["diagnosis_btn_Cancel","diagnosis_btn_Ok"];      
    if (
      document.getElementById("usage_alert_dlg") !== undefined &&
      document.getElementById("usage_alert_dlg") !== null
    ) {
      document.getElementById("usage_alert_dlg").focus();
    }    

    let modal_container = document.getElementsByClassName("usage-alert-modal")[0];    
    if(modal_container !== undefined && modal_container != null){
        let modal_content = document.getElementsByClassName("modal-content")[0];
        if (modal_content !== undefined && modal_content != null) {
          let margin_top = parseInt((modal_container.offsetHeight - modal_content.offsetHeight) / 2);
          modal_container.style['margin-top'] = margin_top.toString()+"px";          
        }
    } 
  }

  //
  onKeyPressed(e) {
    if (e.keyCode === KEY_CODES.left || e.keyCode === KEY_CODES.right) {      
      let fnum = this.flag; 
      if(e.keyCode === KEY_CODES.left){
        fnum = (this.flag - 1 + this.btns.length) % this.btns.length; 
      }else{
        fnum = (this.flag + 1) % this.btns.length; 
      }      

      this.setState({curFocus : fnum});
      this.flag = fnum;   
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      if (this.flag === 0) {
        this.props.handleOk();
      }else if(this.flag === 1){
        this.props.handleCancel();
      }   
    }
  }


  render() { 
    let content = "用法の区分と異なる薬剤が登録されているRpがあります。このまま処方してよろしいですか？\n\n";
    if (this.props.messageType == "duplicate") {
      content = "同一薬剤が登録されています。\n\n";
    }
    Object.keys(this.props.diagnosisData).map(rpIdx=>{
      let medicines = this.props.diagnosisData[rpIdx];
      let rpNo = parseInt(rpIdx) + 1;
      if (this.props.messageType == "duplicate") {
        content += "◆Rp" + rpNo + "\n";
      } else {
        content += "◆Rp" + rpNo + ": " + this.props.presData[rpIdx].usage_category_name 
      }
      let order = this.props.presData[rpIdx].medicines;
      medicines.map(item=>{
        content += "・"+ order[item].medicineName + "\n";
      });
      content += "\n";
    });    

    return (
      <Modal
        show={true}       
        id="usage_alert_dlg"
        // onHide={this.props.hideModal}
        // className = "usage-alert-modal usage-med-alert-modal"
        className = "alert-modal"
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >

        <Modal.Body>
          <div className="auto-logout">  
              <DoubleModal>
              <div>              
                {content.replace(/[\n\r]+/g, '\\n').split("\\n").map((item, key) => {
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
          {this.props.messageType == "" ? (
            <>                
              <Button className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"} id="diagnosis_btn_Cancel" onClick={this.props.handleCancel}>キャンセル</Button>
              <Button className={this.state.curFocus === 0?"red-btn focus": "red-btn"} id="diagnosis_btn_Ok" onClick={this.props.handleOk}>OK</Button>
            </>
          ):(
            <>                
              <Button className={this.state.curFocus === 0?"red-btn focus": "red-btn"} id="diagnosis_btn_Ok" onClick={this.props.handleOk}>OK</Button>
            </>
          )} 
          
        </Modal.Footer>
      </Modal>
    );
  }
}

DiagnosisRpModal.propTypes = {  
  hideModal: PropTypes.func,
  diagnosisData : PropTypes.object,
  presData : PropTypes.array,
  handleCancel : PropTypes.func,
  messageType : PropTypes.string,
  handleOk : PropTypes.func,
};

export default DiagnosisRpModal;
