import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Radiobox from "~/components/molecules/Radiobox";
import * as apiClient from "~/api/apiClient";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import TagListModal from "./TagListModal";
import Spinner from "react-bootstrap/Spinner";

const Wrapper = styled.div`
    display: block;
    font-size: 1rem;
    width: 100%;
    overflow-y: auto;
    height: 100%;
    overflow-y: auto;
    textarea{
      height: 10rem;
    }
    .flex {
        display: flex;
    }
    .sticky-note-color {
        width: 30px;
        height: 25px;
    }
    .type-area {
      padding-bottom: 0.5rem;
      width:100%;
        div {
            padding-bottom:5px;
            label {
                font-size: 16px;
                input {
                    top:2px;
                }
            }
        }
    }
    .public-range {
        padding-left: 10px;
        margin-top: 5px;
        padding-bottom: 0;
    }
    
    .title-area {
        padding-bottom: 0.5rem;
        .label-title {
          width: 0;
          margin-right: 0;
        }
        input {
          height: 2.3rem;
        }
    }
    .input-title {
      font-size: 1.25rem;
      text-align: left;
      margin-bottom: 0;
    }
    .enable-area {
        label {
          width: 8rem;
          font-size: 1rem;
          line-height: 38px;
          input {
            top:2px;
          }
        }
        div {
            width: calc(100% - 260px);
        }
        button {
            span {
                font-size: 16px;
            }
        }
    }
 `;

 const SpinnerWrapper = styled.div`
   height: 200px;
   display: flex;
   justify-content: center;
   align-items: center;
 `;

class AddTagModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sticky_note_types:[{sticky_note_type_id:null, name:"なし", color:"", font_color:""}],
      title:this.props.sticky_data != null ? this.props.sticky_data.title : '',
      body:this.props.sticky_data != null ? this.props.sticky_data.body : '',
      is_enabled:this.props.sticky_data != null ? !this.props.sticky_data.is_enabled : 0,
      // flag_icon:this.props.sticky_data != null ? this.props.sticky_data.flag_icon : 0,
      sticky_note_type_id:(this.props.sticky_data != null && this.props.sticky_data.sticky_note_type_id != null) ? this.props.sticky_data.sticky_note_type_id : '',
      public_range:(this.props.sticky_data != null && this.props.sticky_data.public_range != null) ? this.props.sticky_data.public_range : 0,
      alert_messages:"",
      istagListModal:false,
      load_flag:false,
    }
  }
  componentDidMount() {
    this.getStickyNoteType();
  }

  getStickyNoteType =async()=>{
    let path = "/app/api/v2/master/tag";
    let post_data = {
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if (res) {
          let sticky_note_types = this.state.sticky_note_types;
          res.sticky_note_type.map(item=>{
            sticky_note_types.push(item);
          })
          this.setState({
            sticky_note_types,
            load_flag:true,
          });
        }
      })
      .catch(() => {
      });
  }

  setBody = (e) => {
    this.setState({body: e.target.value,})
  };

  setStickyNoteType = (e) => {
    let sticky_note_type = this.state.sticky_note_types[parseInt(e.target.value)];
    this.setState({
      sticky_note_type_id:sticky_note_type.sticky_note_type_id,
      color:sticky_note_type.color,
      font_color:sticky_note_type.font_color,
    });
  };

  setPublicRange = e => {
    this.setState({public_range: parseInt(e.target.value)});
  };

  setTitle = e => {
    this.setState({title: e.target.value});
  };

  getAlwaysShow = (name, value) => {
    if(name==="alwaysShow"){
      this.setState({is_enabled: value})
    }
  };

  setFlagIcon = (name, value) => {
    if(name==="flag_icon"){
      this.setState({flag_icon: value})
    }
  };

  saveTag =async()=>{
    let tag_data = {};
    tag_data['number'] = this.props.sub_key != null ? this.props.sub_key : 0;
    tag_data['karte_tree_number'] = this.props.karte_tree_number;
    tag_data['public_range'] = this.state.public_range;
    tag_data['sticky_note_type_id'] = this.state.sticky_note_type_id;
    if(this.state.sticky_note_type_id === '' && this.state.title === ''){
        this.setState({alert_messages: "種類を選択するか、タイトル・概要を入力してください。"});
        return;
    }
    tag_data['title'] = this.state.title;
    tag_data['body'] = this.state.body;
    tag_data['is_enabled'] = this.state.is_enabled;
    // tag_data['flag_icon'] = this.state.flag_icon;
    tag_data['system_patient_id'] = this.props.patientId;

    let path = "/app/api/v2/order/tag/register";
    await apiClient
      ._post(path, {
          params: tag_data
      })
      .then((res) => {
        this.props.setTagData(this.props.karte_tree_number, res[this.props.karte_tree_number], this.props.sub_key);
      })
      .catch(

      );
  }

  closeModal =()=>{
    this.setState({
      alert_messages: "",
      istagListModal:false,
    });
  }

  openTagListModal =()=>{
    this.setState({istagListModal: true});
  }

  render() {        
    return  (
      <Modal show={true} className="custom-modal-sm first-view-modal tag-add-modal">
        <Modal.Header><Modal.Title>付箋追加</Modal.Title></Modal.Header>
        <Modal.Body>
          <Wrapper>
            {this.state.load_flag ? (
              <>
                <div className="enable-area flex">
                  <Checkbox
                    label="非表示にする"
                    getRadio={this.getAlwaysShow.bind(this)}
                    value={this.state.is_enabled}
                    checked = {this.state.is_enabled === 1}
                    name="alwaysShow"
                  />
                  <div></div>
                  <Button onClick={this.openTagListModal.bind(this)}>一覧表示</Button>
                </div>
                <div className="type-area flex">
                  <label className="input-title">公開範囲</label>
                  <div className={'public-range flex'}>
                    <Radiobox
                      label={'全体'}
                      value={0}
                      getUsage={this.setPublicRange.bind(this)}
                      checked={this.state.public_range === 0 ? true : false}
                      name={`public_range`}
                    />
                    <Radiobox
                      label={'本人のみ'}
                      value={1}
                      getUsage={this.setPublicRange.bind(this)}
                      checked={this.state.public_range === 1 ? true : false}
                      name={`public_range`}
                    />
                  </div>
                </div>
                <div className="type-area">
                  <label className="input-title">種類</label>
                  {this.state.sticky_note_types.length > 0 && (
                    this.state.sticky_note_types.map((item, index)=>{
                      return (
                        <>
                          <div className={'flex'}>
                            <Radiobox
                              label={item.name}
                              value={index}
                              getUsage={this.setStickyNoteType.bind(this)}
                              checked={this.state.sticky_note_type_id === item.sticky_note_type_id ? true : false}
                              name={`sticky_note_type`}
                            />
                            <div className={'sticky-note-color'} style={{backgroundColor:item.color}}></div>
                          </div>
                        </>
                      );
                    })
                  )}
                </div>
                {/*<div className="enable-area w-100 flex" style={{paddingBottom:"10px"}}>
                    <Checkbox
                        label="旗アイコン表示"
                        getRadio={this.setFlagIcon.bind(this)}
                        value={this.state.flag_icon}
                        checked = {this.state.flag_icon === 1}
                        name="flag_icon"
                    />
                </div>*/}
                <div className="title-area" style={{width:"100%"}}>
                  <label className="input-title">タイトル・概要</label>
                  <InputWithLabel
                    type="text"
                    getInputText={this.setTitle.bind(this)}
                    diseaseEditData={this.state.title}
                  />
                </div>
                <div style={{width:"100%"}}>
                  <label className="input-title">本文</label>
                  <textarea
                    onChange={this.setBody.bind(this)}
                    value={this.state.body}
                    style={{width:"100%"}}
                  />
                </div>
              </>
            ):(
              <div>
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              </div>
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          <Button className='red-btn' onClick={this.saveTag.bind(this)}>保存</Button>
        </Modal.Footer>
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
          />
        )}
        {this.state.istagListModal && (
          <TagListModal
            closeModal={this.closeModal}
            sticky_note_type_id={this.props.sub_key != null ? this.state.sticky_note_type_id : 0}
            sticky_note_types={this.state.sticky_note_types}
            system_patient_id={this.props.patientId}
          />
        )}
      </Modal>
    );
  }
}

AddTagModal.contextType = Context;

AddTagModal.propTypes = {
    closeModal: PropTypes.func,
    patientId: PropTypes.number,
    karte_tree_number: PropTypes.number,
    sticky_data: PropTypes.object,
    sub_key:PropTypes.number,
    setTagData:PropTypes.func,
};

export default AddTagModal;
