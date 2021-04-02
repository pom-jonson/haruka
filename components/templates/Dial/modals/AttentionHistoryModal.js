import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import {textareaBreakStr} from "~/helpers/dialConstants";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
// import RadioButton from "~/components/molecules/RadioInlineButton";
// import SelectorWithLabelIndex from "~/components/molecules/SelectorWithLabelIndex";
// import {formatDateLine} from "~/helpers/date"

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  height: 100%;
  float: left;
  .add-button {
      text-align: center;
      .first {
        margin-left: -30px;
      }
  }

  .modal-content{
    height: 500px;
  }
  .move-list {
      width: 100%;
      height: 40vh;
      overflow-y: auto;
      border-radius: 4px;
      border-width: 1px;
      border-style: solid;
      border-color: rgb(206, 212, 218);
      border-image: initial;
      .move-period {
          width: 50%;
      }
      .move-note {
          width: 30%;
      }
      .attention-note {
          width: 80%;
          white-space: pre;
          text-align: left;
      }
      .move-times {
          width: 20%;
      }
      .attention-times {
          width: 20%;
      }
      .move-list-title {
        display: flex;
        font-size: 20px;
        text-align: center;
      }
      .move-list-content{
        font-size: 20px;
      }
      .move-log {
        display: flex;
        width: 100%;
        text-align: center;
      }
  }
  .footer {
    display: flex;
    margin-top: 10px;
    text-align: center;
    .add-button {
        margin: auto;
    }
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;
      margin-right: 30px;
    }
    
    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
}
.flex {
  display: flex;
  flex-wrap: wrap;
}
  .patient_info {
    font-size: 25px;
    padding-bottom: 20px;
  }
  .left-area {
    width: calc(100% - 80px);
    .react-datepicker-wrapper {
        width: 100%;
        .react-datepicker__input-container {
            width: 100%;
            input {
                font-size: 16px;
                width: 100%;
                height: 38px;
                border-radius: 4px;
                border-width: 1px;
                border-style: solid;
                border-color: rgb(206, 212, 218);
                border-image: initial;
                padding: 0px 8px;
            }
        } 
    }
      .pullbox-select {
          font-size: 16px;
          width:100%;
      }
      .pullbox .pullbox-label {
          height: 38px;
          width: calc(100% - 65px);
          margin-right: 0px;
      }
      .pullbox .label-title {
        width: 70px;
        text-align: right;
        font-size: 18px;
        margin-right: 10px;
        margin-top: 5px;
      }
      .search-btn {
        border: 1px solid rgb(206, 212, 218);;    
        font-size: 16px;
        margin-top: 8px;
        margin-left: 5px;
        padding: 8px 10px 0 10px;
      }
      .select-day {
        width: 250px;
        .react-datepicker-wrapper{
            width: calc(100% - 75px);
        }
      }
      .input-title {
        width: calc(100% - 75px);
        input {
            width: calc(100% - 70px);
        }
      }
        .display-day {
            width: 50%;
            margin-top: 3px;
            font-size: 18px;
            .display-day-label {
                width: 90px;
                margin-right: 10px;
                margin-top: 12px;
                float: left;
                font-size: 18px;
                text-align: right;
            }
            .radio-btn {
                label{width:70px;}
            }
        }
      .description {
        width: 100%;
        padding-top: 15px;
        .label-title {
            width: 70px;
            font-size: 18px;
            text-align: right;
            margin-right: 10px;
        }
        .input-text-area {
            width: calc(100% - 80px);
            textarea {
                font-size:16px;
                width: 100%;
                height: 100px;
            }
        }
        
      }
  }
  label {
    width: 70px;
    font-size: 16px;
    text-align: right;
    margin-top: 9px;    
    margin-right: 10px;
  }

  .radio-btn label{
    font-size: 16px;
    width: 55px;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 4px;
    padding: 4px 5px;
    text-align:center;
    margin-right: 10px;
  }
  .right-area {
    width: 30%;
    position: relative;
    min-height: 200px;
    .confirm-area {
        position: absolute;
        bottom: 0;
        left: 0;
      .select-day {
        .label-title {
            width: 85px;
        }
        input {
            width: calc(100% - 100px);
        }
      }
      .checkbox-label {
        margin-right: 10px;
        width: 85px;
        text-align: right;
        margin-top: 10px;
      }
      .checkbox_area {
        label {
            width:0;
        }
      }
    }
  }
 `;

class AttentionHistoryModal extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;        
        this.state={
            modal_data
        }
    }

    closeModal = () => {
        this.props.closeModal();
    };    

    formatDateBySlash = dateStr => {
        if (!dateStr || dateStr.length < 8) return "";
        dateStr = "" + dateStr;
        return dateStr.substring(0,4) + "/" + dateStr.substring(5,7) + "/" +dateStr.substring(8,10);
    };

    onHide=()=>{}

    render() {
        let attentionListData ='';
        attentionListData = this.state.modal_data !== null && this.state.modal_data !== undefined && this.state.modal_data.length > 0 && 
            (this.state.modal_data.map((item, index)=>{
            return (
              <>
              <div className="move-log">                
                <div className="attention-times">{this.formatDateBySlash(item.regist_date)}</div>
                <div className="attention-note" id={index}>{textareaBreakStr(item.attention)}</div>
                </div>
              </>
            )
          }));
        return  (
            <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal add-infection-modal">
                <Modal.Header>
                    <Modal.Title>注意点</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className="flex">
                              <div className="move-list">
                                <div className="move-list-title">
                                    <div className="attention-times">日付</div>                                
                                    <div className="attention-note">注意点</div>
                                </div>
                                <div className="move-list-content" id="div-attention">
                                    {attentionListData}
                                </div>
                              </div>
                        </div>
                        <div className="footer-buttons">
                                <Button  className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                        </div>
                    </Wrapper>
                </Modal.Body>
            </Modal>
        );
    }
}

AttentionHistoryModal.contextType = Context;

AttentionHistoryModal.propTypes = {
    modal_data: PropTypes.object,
    closeModal: PropTypes.func,    
};

export default AttentionHistoryModal;
