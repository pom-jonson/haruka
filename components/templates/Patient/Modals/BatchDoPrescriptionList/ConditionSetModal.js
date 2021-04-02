import React, { Component } from "react";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Button from "~/components/atoms/Button";
import { KEY_CODES } from "~/helpers/constants";
// import { CACHE_SESSIONNAMES} from "~/helpers/constants";
// import * as sessApi from "~/helpers/cacheSession-utils";
import InputBoxTag from "~/components/molecules/InputBoxTag";

const Wrapper = styled.div`
  .content{
    padding-top: 15px;
    .div-title{
      text-align: center;
      font-size: 16px;
      margin-bottom: 5px;
    }

    .div-condition{
      display: flex;
      justify-content: center;

      .div-date{
        line-height: 38px;
        font-size: 16px;
      }

      .div-period{
        div{
          margin-top: 0px;
        }
        .label-title{
          margin-top: 0.5rem;
          font-size: 14px;
          width: 60px;
        }
        input{
          width: 50px;
        }
      }
      .div-label{
        line-height: 38px;
      }
    }
  }
`;

class ConditionSetModal extends Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this); 
    this.state = {
      curFocus: 1,
      period_date: 90,
    }    
    this.btns = [];
    this.flag = 1; 
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
      curFocus: 1
    });
    this.flag = 1;
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

  confirmOk = () => {
    if (this.state.period_date < 0) return;

    this.props.confirmOk(this.state.period_date);
  }

  confirmCancel = () => {
    this.props.confirmCancel();
  }

  getDate = (e) => {
    this.setState({
      period_date: e.target.value
    });
  }

  render() {
    return (
      <Modal
        show={true}       
        id="system_alert_dlg"        
        className = "system-confirm windows-alert-message master-modal"
        tabIndex="0"
        onKeyDown={this.onKeyPressed}
      >        
        <Modal.Header>
          <Modal.Title>表示条件選択</Modal.Title>
        </Modal.Header>       
        <Modal.Body>
          <Wrapper>
            <div className="content">  
              <div className="div-title">表示期間</div>              
              <div className="div-condition">
                <div className="div-date">
                  {this.props.end_date}
                </div>
                <div className="div-period">
                    <InputBoxTag
                      label="から過去"
                      type="text"
                      placeholder=""
                      className = "patient-id-input half_letter input_tag"
                      getInputText={this.getDate.bind(this)}
                      value={this.state.period_date}
                      id = 'patient_number_id'
                    />
                </div>
                <div className="div-label">日間</div>
              </div>              
            </div>
          </Wrapper>
        </Modal.Body>        
        <Modal.Footer>
          <Button className={this.state.curFocus === 1?"cancel-btn focus": "cancel-btn"} onClick={this.confirmCancel}>キャンセル</Button>
          <Button className={this.state.curFocus === 0?"red-btn focus": "red-btn"} onClick={this.confirmOk}>確認</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
ConditionSetModal.propTypes = {  
  hideConfirm: PropTypes.func,
  confirmOk: PropTypes.func,
  confirmCancel: PropTypes.func,
  end_date: PropTypes.string,
};

export default ConditionSetModal;
