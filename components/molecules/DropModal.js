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

class DropModal extends Component {
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
    let rejectDuplicateList = this.props.duplicateList.map((item,key)=>{
      return (
        <>
          {item.if_duplicate == "reject" && (
            <p className={this.state.selected_index==key?"selected":""}>◆{item.item_name != "" ? item.item_name : item.name != "" ? item.name : ""}は既に存在します。</p>
          )}    
        </>
      )
    })
    let alertDuplicateList = this.props.duplicateList.map((item,key)=> {
    return ( 
    <>  
      {item.if_duplicate == "alert" && (
        <p className={this.state.selected_index==key?"selected":""}>◆{item.item_name != "" ? item.item_name : item.name != "" ? item.name : ""}は既に存在します。</p>
      )}       
    </>
    )})  

    return (
      <Modal
        show={true}       
        id="drop_dlg"
        // onHide={this.props.hideModal}
        className = "alert-modal"
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >

        <Modal.Body>
          <div className="auto-logout">  
              {this.props.modalType === "stepDuplicateReject" && (
              <DoubleModal>
              <div>
                  下記の条件のため追加できません。
                </div>            
              <br />            
              <div className="med-alert-list">
                {rejectDuplicateList}
              </div>
              <div className="med-alert-list">
                {this.props.rejectList.map((element, key) =>{
                  return (
                    <>
                    <div key={key}>
                    <div>◆{element.item.item_name} は併用禁忌の情報があります。</div><br />
                    <div>対象の薬品</div>
                    {element.reject.map((ele, key) => {
                      return(
                        <p key={key}>・{ele.medicineName}</p>  
                      )
                    })}
                    </div>
                    </>
                  )
                })}
              </div>
              </DoubleModal>
              )}
              {this.props.modalType === "stepAlert" && (
                <DoubleModal>
                  <div>
                    下記の情報がありますが、追加してよろしいですか？
                  </div><br />
                  <div className="med-alert-list">
                    {alertDuplicateList}
                  </div>
                  <div className="med-alert-list">
                    {this.props.alertList.map((element, key) =>{
                      return (
                        <>
                        <div key={key}>
                        <div>◆{element.item.item_name} は併用禁忌・相互作用の情報があります。</div><br />
                        <div>対象の薬品</div>
                        {element.alert.map((ele, key) => {
                          return(
                            <p key={key}>・{ele.medicineName}</p>  
                          )
                        })}
                        </div>
                        </>
                      )
                    })}
                  </div>
                </DoubleModal>

              )}              
          </div>
        </Modal.Body>        
        <Modal.Footer>
          {this.props.modalType === "stepAlert" ? (
            <>
          <Button id="btnDropCancel" className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"} onClick={this.props.handleCancel}>キャンセル</Button>
          <Button id="btnDropOk" className={this.state.curFocus === 0?"red-btn focus": "red-btn"} onClick={this.props.handleOk}>OK</Button>
            </>
          ):(
            <Button id="btnDropOk" className="red-btn focus" onClick={this.props.handleCancel}>OK</Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}
DropModal.propTypes = {  
  duplicateList: PropTypes.array,
  rejectList: PropTypes.array,
  alertList: PropTypes.array,
  hideModal: PropTypes.func,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  modalType: PropTypes.string,
};

export default DropModal;
