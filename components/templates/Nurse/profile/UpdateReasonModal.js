import React, { 
    Component, 
    // useContext
   } from "react";
  import PropTypes from "prop-types";
  import styled from "styled-components";
  import * as colors from "~/components/_nano/colors";
  import { Modal } from "react-bootstrap";
  import Context from "~/helpers/configureStore";
  import Button from "~/components/atoms/Button";  
  
  const Popup = styled.div`
    .flex {
      display: flex;
    }
    height: 96%;
  
    h2 {
      color: ${colors.onSurface};
      font-size: 1.1rem;
      font-weight: 500;
      margin: 6px 0;
    }
    .textarea{
      height:12rem;
      textarea{
        height:100%;
        width:100%;
      }
    }

    .selected{
      background: lightblue;
    }

    .clickable{
      cursor:pointer;
    }
    .select-area{
      margin-right:2rem;
    }

    .center {
      text-align: center;
      button {
        height: 25px;
        padding: 0;
        line-height: 25px;
        span {
          color: ${colors.surface};
        }
      }
  
      span {
        color: rgb(241, 86, 124);
      }
  
      .black {
        color: #000;
      }
    }
    .red {
      color: rgb(241, 86, 124);
    }
    
  `;
  class UpdateReasonModal extends Component {
    constructor(props) {
      super(props);    
      this.state = {
        general_data:this.props.general_data,
        reason_for_renewal:this.props.general_data.reason_for_renewal,
      }      
    }

    getReason = (e) => {
      this.setState({reason_for_renewal:e.target.value})
    }

    handleOk = () => {
      if (this.state.reason_for_renewal == undefined || this.state.reason_for_renewal == null || this.state.reason_for_renewal == '') {
        window.sessionStorage.setItem("alert_messages","更新理由を入力して下さい。");
        return;
      }
      var general_data = this.state.general_data;
      general_data.reason_for_renewal = this.state.reason_for_renewal;
      this.props.handleGeneralOk(general_data);
      this.props.closeModal();
    }
    
    render() {
      return (
        <>
          <Modal
            show={true}          
            id="outpatient"
            className="custom-modal-sm update-reason-modal first-view-modal"
          >
            <Modal.Header>
                <Modal.Title style={{width:'20rem'}}>更新理由</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup>
                <div style={{fontSize:'1.5rem'}}>更新理由を入力して下さい。</div>
                <div className='textarea'>
                  <textarea onChange={this.getReason.bind(this)}>{this.state.reason_for_renewal}</textarea>
                </div>

              </Popup>
            </Modal.Body>
            <Modal.Footer>
                <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                <Button className="red-btn" onClick={this.handleOk.bind(this)}>確定</Button>
            </Modal.Footer>            
          </Modal>        
        </>
      );
    }
  }
  UpdateReasonModal.contextType = Context;
  
  UpdateReasonModal.propTypes = {  
    patientId: PropTypes.number,
    patientInfo: PropTypes.object,  
    closeModal: PropTypes.func,
    cache_index:PropTypes.number,
    general_data: PropTypes.object,
    handleGeneralOk: PropTypes.func,
  };
  
  export default UpdateReasonModal;
  