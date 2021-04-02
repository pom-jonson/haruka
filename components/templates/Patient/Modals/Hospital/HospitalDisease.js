import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1.12rem;
  width: 100%;
  height: 100%;
  float: left;
  .flex{
      display:flex;
      margin-bottom:5px;
  }
  .sub-title{
    
  }  
  textarea{
    width:95%;
  }
  .content{
    padding-left:5%;
    padding-left:5%;
  }
  .label-title{
    width:4.5rem;
    font-size: 1rem;
    margin-right:0.5rem;
    text-align:right;
    margin-left: 1rem;
  }
  .pullbox-select{
    width:4rem;
  }
}
 `;

class HospitalDisease extends Component {
    constructor(props) {
        super(props);        
        this.state = {            
            confirm_action: '',
            isConfirmModal: false,
            confirm_message:"",
            body_text: '',
            tpha: '',
            hbs_ag: '',
            hcv_Ab: '',
            hiv: '',
            exam_text: '',
        }
        this.init_state = {            
            body_text: '',
            tpha: '',
            hbs_ag: '',
            hcv_Ab: '',
            hiv: '',
            exam_text: '',
        }
        this.sampleOptions = [
            {id:0, value:''},
            {id:1, value:'(+)'},
            {id:2, value:'(-)'},
            {id:3, value:'(±)'},
        ];
        this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }

    getAlwaysShow = (name, value) => {
        if(name==="alwaysShow"){
            this.setState({is_enabled: value})
        }
    };

    confirmCancel() {
        this.setState({
            isConfirmModal: false,
            confirm_message: "",
            confirm_action: '',
            confirm_title: ''
        });
    }
    confirmOK = () => {
      let {confirm_action} = this.state;
      if (confirm_action == 'clear') {
        this.setState({
          body_text: '',
          tpha: '',
          hbs_ag: '',
          hcv_Ab: '',
          hiv: '',
          exam_text: '',
          isConfirmModal: false,
          confirm_message: '',
          confirm_action: '',
        });
      } else if (confirm_action == "cancel") {
        this.props.closeModal();
      }
    }
    clearContent = () => {
      let changed = false;
      Object.keys(this.init_state).map(index=>{
        if (this.init_state[index] != this.state[index]) {
          changed = true;
        }
      });
      if (!changed) {
        return;
      }
      this.setState({
        confirm_message: "入力内容をクリアします。よろしいですか？",
        isConfirmModal: true,
        confirm_action: "clear"
      })
    }
    getValue = (key, e) => {
      this.setState({[key]:e.target.value});
    }
    closeModal = () => {
      let changed = false;
      Object.keys(this.init_state).map(index=>{
        if (this.init_state[index] != this.state[index]) {
          changed = true;
        }
      });
      if (!changed) {
        this.props.closeModal();
        return;
      }
      this.setState({
        confirm_message: "入力内容を消去しますか？",
        confirm_title: '消去確認',
        isConfirmModal: true,
        confirm_action: "cancel"
      });
    }

    render() {
      let clear_disable = false;
      Object.keys(this.init_state).map(index=>{
        if (this.init_state[index] != this.state[index]) {
          clear_disable = true;
        }
      });
        return  (
            <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal hospital-disease-modal">
                <Modal.Header>
                    <Modal.Title>入院時現症</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                      <div className='content'>
                        <div className='sub-title'>入院時身体所見</div>
                        <textarea onChange={this.getValue.bind(this, "body_text")} value={this.state.body_text}></textarea>
                        <div className='sub-title'>入院時検査所見</div>
                        <div className='flex'>
                          <SelectorWithLabel
                              title="TPHA"
                              options={this.sampleOptions}
                              getSelect={this.getValue.bind(this, "tpha")}
                              departmentEditCode={this.state.tpha}                    
                          />
                          <SelectorWithLabel
                              title="HBs-Ag"
                              options={this.sampleOptions}
                              getSelect={this.getValue.bind(this, "hbs_ag")}
                              departmentEditCode={this.state.hbs_ag}                    
                          />
                          <SelectorWithLabel
                              title="HCV-Ab"
                              options={this.sampleOptions}
                              getSelect={this.getValue.bind(this, "hcv_Ab")}
                              departmentEditCode={this.state.hcv_Ab}                    
                          />
                          <SelectorWithLabel
                              title="HIV"
                              options={this.sampleOptions}
                              getSelect={this.getValue.bind(this, "hiv")}
                              departmentEditCode={this.state.hiv}                    
                          />
                        </div>                          
                        <textarea onChange={this.getValue.bind(this, "exam_text")} value={this.state.exam_text}></textarea>
                      </div>                      
                    </Wrapper>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel-btn" onClick = {this.closeModal}>キャンセル</Button>
                    <Button className={!clear_disable?"disable-btn":"cancel-btn"} onClick={this.clearContent.bind(this)}>クリア</Button>
                    <Button className="red-btn">カルテを展開</Button>
                </Modal.Footer>
                {this.state.isConfirmModal !== false && (
                  <SystemConfirmJapanModal
                    hideConfirm= {this.confirmCancel.bind(this)}
                    confirmCancel= {this.confirmCancel.bind(this)}
                    confirmOk= {this.confirmOK.bind(this)}
                    confirmTitle= {this.state.confirm_message}
                    title={this.state.confirm_title}
                  />
                )}
            </Modal>
        );
    }
}

HospitalDisease.contextType = Context;

HospitalDisease.propTypes = {
    patientId: PropTypes.number,    
    closeModal: PropTypes.func,
    cache_index:PropTypes.number,
    patientInfo:PropTypes.object,
};

export default HospitalDisease;