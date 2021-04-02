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

class NoUnitOrderModal extends Component {
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
    this.btns = ["btnOK","btnCancel"];
    this.setState({
      curFocus: 1
    });
    this.flag = 1;   
    if (
      document.getElementById("disease_dlg") !== undefined &&
      document.getElementById("disease_dlg") !== null
    ) {
      document.getElementById("disease_dlg").focus();
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
      let fnum = (this.flag + 1) % this.btns.length; 

      this.setState({curFocus : fnum});
      this.flag = fnum;   
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      if (this.flag === 0) {
        this.props.handleOk();
      }else{
        this.props.handleCancel();
      }      
    }
  }

  render() {    
  let data = this.props.notHasUnitMedData;
  let content = Object.keys(data).map((key)=>{
     return (
      <div key={key}>
        <div>●RP{key}</div>  
         {Object.keys(data[key]).map((name)=>{
            return (
              <>
                <div>
                  <div>・{data[key][name]}</div>                  
                  <br />
                </div>
              </>
            )
         })}  
       </div>              
      )
    });
    return (
      <Modal
        show={true}       
        id="disease_dlg"
        // onHide={this.props.hideModal}
        className = "alert-modal"
        // className = "disease-modal"
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >
        <Modal.Header>
          エラー
        </Modal.Header>
        <Modal.Body>
          <div className="auto-logout">  
              <DoubleModal>
                        
                <div>現在利用できない単位名が使われています。新規に薬剤検索から追加してください。</div>
                <br />              
                {content}
              </DoubleModal>
          </div>
        </Modal.Body>        
        <Modal.Footer> 
          <Button id="btnOk" className={this.state.curFocus === 0?"red-btn focus": "red-btn"} onClick={this.props.handleOk}>OK</Button>            
        </Modal.Footer>
      </Modal>
    );
  }
}
NoUnitOrderModal.propTypes = {  
  hideModal: PropTypes.func,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  notHasUnitMedData: PropTypes.object,
  // messageType: PropTypes.string,
};

export default NoUnitOrderModal;
