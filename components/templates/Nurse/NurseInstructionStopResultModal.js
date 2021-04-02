import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
// import DatePicker, { registerLocale } from "react-datepicker";
// import ja from "date-fns/locale/ja";
import { withRouter } from "react-router-dom";
// registerLocale("ja", ja);
// import WorkSheetModal from "./WorkSheetModal";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  
  flex-direction: column;
  display: flex;
  text-align: center;
  .content{
    // height: 500px;
    height: 35rem;
    overflow-y: auto;
    text-align: left;
    textarea{
        height: 180px !important;
    }
  }
  .title-area{
    margin-top: 2rem;
    font-size: 1rem;
  }
  .footer {
    margin: 0 auto;
    button {
      margin-top: 10px;
    }
    span {
      font-size: 18px;
      font-weight: normal;
    }
   }
   .radio-group{
    label {font-size: 16px;}
   }
   .content-area{
    border: 1px solid #aaa;
    height: 42vh;
    margin: 1rem auto;
    overflow-y: auto;
    width: 80%;
   }
   .comment-area{
    border: 1px solid #aaa;
    height: 8vh;
    margin: 1rem auto;
    overflow-y: auto;
    width: 80%;
   }
   .item-ele:hover{
    background: #ddd;
    cursor: pointer;
   }
   .item-ele{
    padding: 3px;
   }
   .sel-ele{
    background: #bbb;
   }
   .date-label{
    float: left;
    margin-right: 10px;
    line-height: 30px;
    margin-left: 1.5rem;
   }
   .react-datepicker-wrapper{
    float:left;
   }
 `;

class NurseInstructionStopResultModal extends Component {
  constructor(props) {
    super(props);
      this.state = {
       course_date:"",       
       selectedWorkSheet:null,
       isOpenWorksheetModal:false,
       work_sheet_master: []
    }   
  }
  async componentDidMount() {      
    // await this.getWorkSheetMaster();
  }   

  cancelModal = () => {
    this.props.closeModal();
  }        

  render() {
    return  (
        <Modal show={true} id="done-order-modal"  className="custom-modal-sm allergy-modal first-view-modal nurse-course-modal">          
          <Modal.Body>
            <Wrapper>
                <div className="content w-100">
                    <div className="title-area">
                      下記の指示の止め処理を行いました。
                    </div>                    
                    <div className="content-area">
                      {this.props.instructions_array.length > 0 && this.props.instructions_array.map(item=>{
                        return(
                          <>
                            <div style={{padding:"0.3rem"}}>{item.name}</div>
                          </>
                        );
                      })}                      
                    </div>                    
                </div>                
            </Wrapper>             
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.cancelModal}>閉じる</Button>            
          </Modal.Footer>
        </Modal>
    );
  }
}

NurseInstructionStopResultModal.contextType = Context;

NurseInstructionStopResultModal.propTypes = {
  closeModal: PropTypes.func,
  instructions_array: PropTypes.array,
};

export default withRouter(NurseInstructionStopResultModal);