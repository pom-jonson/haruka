import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Radiobox from "~/components/molecules/Radiobox";
import Spinner from "react-bootstrap/Spinner";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  font-size: 1rem;
  .flex {display:flex;}
  .div-title {
    line-height:2rem;
  }
  .sticky-category {
    label {
      font-size:1rem;
      line-height: 2rem;
      margin-right: 0.5rem;
      max-width: calc(100% - 4.5rem);
    }
    .sticky-note-color {
      width:4rem;
      height:2rem;
    }
  }
  .title-area {
    margin-top:0.5rem;
    div {margin-top:0;}
    .label-title {
      width: 3rem;
      margin: 0;
      line-height: 2rem;
      font-size: 1rem;
    }
    input {
      width: calc(100% - 3rem);
      height:2rem;
      font-size:1rem;
    }
  }
 `;

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;


class PatientStickyNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patient_sticky_note_master:[],
      sticky_note_id:0,
      title:"",
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:"",
      is_loaded:false,
    };
    this.change_flag = 0;
  }

  async componentDidMount () {
    await this.getPatientStickyNoteMaster();
  }

  getPatientStickyNoteMaster=async()=>{
    let path = "/app/api/v2/ward/get/patient_sticky_note_master";
    let post_data = {
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          patient_sticky_note_master:res,
          is_loaded:true,
        });
      })
      .catch(() => {

      });

  }

  setStickyNote = (e) => {
    this.change_flag = 1;
    this.setState({
      sticky_note_id:parseInt(e.target.value),
    });
  };

  getTitle = e => {
    this.change_flag = 1;
    this.setState({title: e.target.value})
  };

  register=async()=>{
    let path = "/app/api/v2/ward/register/patient_sticky_note";
    let post_data = {
      system_patient_id:this.props.system_patient_id,
      sticky_note_id:this.state.sticky_note_id,
      title:this.state.title,
      category:"map_bed_color",
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        window.sessionStorage.setItem("alert_messages", res.alert_message);
        this.props.closeModal('register');
      })
      .catch(() => {

      });
  }

  handleOk =()=> {
    this.setState({
      confirm_type:"register",
      confirm_message:"登録しますか？",
    });
  };

  closeModal=()=>{
    this.setState({
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:""
    });
  }

  confirmClose=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"close",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  }

  confirmOk=()=>{
    if(this.state.confirm_type == "register"){
      this.register();
    } else if(this.state.confirm_type == "close") {
      this.props.closeModal();
    }
  }

  render() {
    return  (
      <Modal show={true} id="add_contact_dlg"  className="first-view-modal patient-sticky-note">
        <Modal.Header>
          <Modal.Title>ベッド背景色</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            {this.state.is_loaded ? (
              <>
                <div className={'div-title'}>種類</div>
                <div className={'sticky-category'}>
                  <div className={'flex'}>
                    <Radiobox
                      label={'無し'}
                      value={0}
                      getUsage={this.setStickyNote.bind(this)}
                      checked={this.state.sticky_note_id === 0}
                      name={`sticky_note`}
                    />
                  </div>
                  {this.state.patient_sticky_note_master.length > 0 && (
                    this.state.patient_sticky_note_master.map((item)=>{
                      return (
                        <>
                          <div className={'flex'}>
                            <Radiobox
                              label={item.name}
                              value={item.sticky_note_id}
                              getUsage={this.setStickyNote.bind(this)}
                              checked={this.state.sticky_note_id === item.sticky_note_id}
                              name={`sticky_note`}
                            />
                            <div className={'sticky-note-color'} style={{backgroundColor:item.color_code}}> </div>
                          </div>
                        </>
                      )
                    }))
                  }
                </div>
                <div className={'title-area'}>
                  <InputWithLabel
                    label='概要'
                    type="text"
                    getInputText={this.getTitle.bind(this)}
                    diseaseEditData={this.state.title}
                  />
                </div>
              </>
            ):(
              <>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </>
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.confirmClose}>キャンセル</Button>
          <Button className={"red-btn"} onClick={this.handleOk}>{"登録"}</Button>
        </Modal.Footer>
        {this.state.confirm_message !== "" && (
          <SystemConfirmJapanModal
            hideConfirm= {this.closeModal.bind(this)}
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title= {this.state.confirm_alert_title}
          />
        )}
      </Modal>
    );
  }
}

PatientStickyNote.contextType = Context;

PatientStickyNote.propTypes = {
  closeModal: PropTypes.func,
  system_patient_id: PropTypes.number,
};

export default PatientStickyNote;
