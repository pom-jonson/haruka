import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import { onSecondaryDark } from "../_nano/colors";
import Button from "../atoms/Button";
import { KEY_CODES } from "../../helpers/constants";
import $ from "jquery";

const DoubleModal = styled.div`
  font-family: NotoSansJP;
  font-size: 20px;
  line-height: 1.33;
  letter-spacing: 0.4px;
  color: ${onSecondaryDark};
  padding: 4px 4px 4px 0;
  margin: 0;
  .med-alert-list{
    // max-height: 150px;
    max-height: 70vh;
    overflow-y: auto;
  }
  .selected{
  
  }
`;

class MedicinePeriodDuplicateModal extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this);    
    this.state = {
      curFocus: 1,
      selected_index:1,
    };
    this.btns = []; 
    this.flag = 1;
  }

  async componentDidMount() {    
    this.btns = ["btnDropCancel", "btnDropOK"];
    if (
      document.getElementById("drop_dlg") !== undefined &&
      document.getElementById("drop_dlg") !== null
    ) {
      document.getElementById("drop_dlg").focus();
    }   
    // let modal_container = document.getElementsByClassName("alert-modal")[0];    
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
        this.props.handleCancel();
      }      
    }
      if (e.keyCode === KEY_CODES.up || e.keyCode === KEY_CODES.down) {
          let data = [];
          if (this.props.duplicateList != null && this.props.duplicateList != undefined && this.props.duplicateList.length > 0) {
              data = this.props.duplicateList;
          }
          this.setState(
              {
                  selected_index:
                      this.state.selected_index >= 1
                          ? this.state.selected_index - 1
                          : data.length - 1
              },
              () => {
                  this.scrollToelement();
              }
          );
      }
  }
    scrollToelement = () => {
        const els = $(".alert-modal .selected");
        const pa = $(".alert-modal .med-alert-list");
        if (els.length > 0 && pa.length > 0) {
            const elHight = $(els[0]).height();
            const elTop = $(els[0]).position().top;
            const paHeight = $(pa[0]).height();
            const scrollTop = elTop - (paHeight - elHight) / 2;
            $(pa[0]).scrollTop(scrollTop);
        }
    };

  render() {    
    
    return (
      <Modal
        show={true}       
        id="drop_dlg"
        // onHide={this.props.hideModal}
        className = "alert-modal"
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >
        <Modal.Header><Modal.Title>注意</Modal.Title></Modal.Header>
        <Modal.Body>
          <div className="auto-logout">  
              <DoubleModal>
                {this.props.modalType === "prescription" ? (
                  <div>
                    同じ薬剤を含む定期処方が開始日より後に既に存在します。このまま登録しますか？
                  </div>            
                ):(
                  <div>
                    注射ならちゃんと注射に。このまま登録しますか？
                  </div>            
                )}
                <br />                            
                <div className="med-alert-list">
                  <div>対象の薬品</div>
                  {this.props.duplicateList.map(element =>{
                    return (
                      <>                      
                      <div>・{element}</div><br />                      
                      </>
                    )
                  })}
                </div>
            </DoubleModal>                                    
          </div>
        </Modal.Body>        
        <Modal.Footer>          
          <Button id="btnDropCancel" className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"} onClick={this.props.handleCancel}>キャンセル</Button>
          <Button id="btnDropOk" className={this.state.curFocus === 0?"red-btn focus": "red-btn"} onClick={this.props.handleOk}>OK</Button>           
        </Modal.Footer>
      </Modal>
    );
  }
}
MedicinePeriodDuplicateModal.propTypes = {  
  duplicateList: PropTypes.array,
  rejectList: PropTypes.array,
  alertList: PropTypes.array,
  hideModal: PropTypes.func,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  modalType: PropTypes.string,
};

export default MedicinePeriodDuplicateModal;
