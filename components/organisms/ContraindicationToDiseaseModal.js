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

class ContraindicationToDiseaseModal extends Component {
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
  let data = this.props.diseaseData;
  let content = Object.keys(data).map((key)=>{
     return (
      <div key={key}>
        <div>◆{data[key].medicineName}</div>  
         {Object.keys(data[key].disease).map((keyword)=>{
            // YJ600 病名禁忌で、同じ病名キーワードに対する同じ文言のものを一旦非表示にする
            let disease_item_container = [];
            return (
                <div key={keyword}>
                  <div>●対象病名:{keyword}</div>
                  {data[key].disease[keyword].map((item, index)=>{
                    if (!disease_item_container.includes(item[0])) {
                      disease_item_container.push(item[0]);                      
                      return <div key={index}>・{item[1]}:{item[0]}</div>
                    }
                  })}
                <br />
                </div>
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

        <Modal.Body>
          <div className="auto-logout">  
              <DoubleModal>
                {this.props.messageType == "" ? (
                  <>                
                    <div>病名に関連する禁忌薬情報の候補がありますが、薬剤を追加しますか？</div>
                    <br />
                  </>
                ):(
                  <>                
                    <div>禁忌情報があります。</div>
                    <br />
                  </>
                )}
                {content}
              </DoubleModal>
          </div>
        </Modal.Body>        
        <Modal.Footer> 
          {this.props.messageType == "" ? (
            <>                
              <Button id="btnCancel" className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"} onClick={this.props.handleCancel}>キャンセル</Button>
              <Button id="btnOk" className={this.state.curFocus === 0?"red-btn focus": "red-btn"} onClick={this.props.handleOk}>OK</Button>
            </>
          ):(
            <>                
              <Button id="btnOk" className={this.state.curFocus === 0?"red-btn focus": "red-btn"} onClick={this.props.handleOk}>OK</Button>
            </>
          )}         
          
        </Modal.Footer>
      </Modal>
    );
  }
}
ContraindicationToDiseaseModal.propTypes = {  
  hideModal: PropTypes.func,
  handleCancel: PropTypes.func,
  handleOk: PropTypes.func,
  diseaseData: PropTypes.object,
  messageType: PropTypes.string,
};

export default ContraindicationToDiseaseModal;
