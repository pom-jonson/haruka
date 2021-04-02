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
  max-height: 70vh;
  overflow-y: auto;
`;

class PeriodModal extends Component {
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
    this.btns = ["btnCancel", "btnOK"];    
    if (
      document.getElementById("period_dlg") !== undefined &&
      document.getElementById("period_dlg") !== null
    ) {
      document.getElementById("period_dlg").focus();
    }

    // let modal_container = document.getElementsByClassName("disease-modal")[0];    
    // if(modal_container !== undefined && modal_container != null){
    //     let modal_content = document.getElementsByClassName("modal-content")[0];
    //     if (modal_content !== undefined && modal_content != null) {
    //       let margin_top = parseInt((modal_container.offsetHeight - modal_content.offsetHeight) / 2);
    //       modal_container.style['margin-top'] = margin_top.toString()+"px";          
    //     }
    // }
  }

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
      }else{
        this.props.hideModal();
      }      
    }
  }

  render() {    
  let data = this.props.periodData;
  let content = Object.keys(data).map((key)=>{
     return (
      <div key={key}>
        <div>◆{data[key][0]}</div>
        {data[key][1] !== "" && (
        <div>（{data[key][1]}）</div>
        )}
       </div>              
      )
    });
    return (
      <Modal
        show={true}       
        id="period_dlg"
        // className = "disease-modal"
        className = "alert-modal"
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >

        <Modal.Body>
          <div className="auto-logout">  
              <DoubleModal>
                <div>有効期間外の薬品があります。処方前に削除または別の製品に変更してください。</div>
                <br />
                {content}
              </DoubleModal>
          </div>
        </Modal.Body>        
        <Modal.Footer>          
          <Button className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"} id="btnCancel" onClick={this.props.hideModal}>キャンセル</Button>
          <Button id="btnOk" className={this.state.curFocus === 0?"red-btn focus": "red-btn"} onClick={this.props.handleOk}>OK</Button>
          {/*<Button className="cancel ml-2" onClick={this.props.hideModal}>キャンセル</Button>*/}
        </Modal.Footer>
      </Modal>
    );
  }
}
PeriodModal.propTypes = {  
  hideModal: PropTypes.func,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  periodData: PropTypes.object,
  modalType: PropTypes.string,
};

export default PeriodModal;
