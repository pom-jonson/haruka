import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss'

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
  label {
      text-align: right;
      width: 80px;
  }
  .flex{
      display:flex;
  }
  input {
    width: 400px;
    font-size: 1rem;
    height: 2rem;    
  }
  .color-value{
    margin-left: 0.5rem;
    height: 2rem;
    line-height: 2rem;
  }
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 1rem;
    width: 130px;
    text-align: right;
    margin-right: 8px;
    margin-top: 0px;
    height: 2rem;
    line-height: 2rem;
   }
  .pullbox-title{
    height: 2rem;
    line-height: 2rem;
    font-size: 1rem;
  }
  .pullbox-select{
    height: 2rem;
    font-size: 1rem;
  }
  .checkbox_area {
    margin-top:10px;
    padding-left: 138px;
    label{
        font-size: 1rem;
        width: 180px;
    }
    div{
      margin-top: 0px;
    }
    .form-control{
      height: 2rem;
      line-height: 2rem;
      font-size: 1rem;
    }
    label {
      margin-top: 0.1rem;
      font-size: 1rem;
      text-align: left;      
      height: 2rem;
      line-height: 2rem;
      input{
        font-size: 1rem;
        height: 15px !important;
      }      
    }
  }
  .short-input-group{
    display:flex;
    input{
        width:130px;
        line-height: 0.5rem;        
    }
    b {
      right: 4px !important;
    }
  }
  
  .medicine_code {
    display: flex;
    flex-wrap: wrap;
    padding-top: 20px;
    margin-left: -20px;
    input {
      font-size: 1rem;
      width: 155px;
    }
    label {
      width: 120px;
      font-size: 1rem;
    }
    .husei-code label {
      width: 100px;
      margin-left: 10px;
    }
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225); 
      border: none;
      height: 2rem;
      margin-top: 8px;
      margin-left: 10px;
    }
    span {
      color: white;
    }
  }
  .kana_area {
    padding-top: 10px;
  }
  .name_area {
    padding-top: 20px;
  }
  .gender {
    font-size: 1rem;
    margin-top: 10px;
    margin-left: 15px;
    margin-bottom: 10px;
    .gender-label {
      width: 100px;
      margin-top: 8px;
      float: left;
    }
    .radio-group-btn label{
        font-size: 1rem;
        width: 45px;
        padding: 4px 4px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin-left: 5px;
    }
    .radio-group-btn:last-child {
        label {
            width: 85px;
        }
    }
  }
 `;


class EditStickyNoteModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;

    this.state = {
      is_enabled: modal_data !== null?modal_data.is_enabled:1,
      number: modal_data !== null ? modal_data.number : 0,
      sticky_note_type_id : modal_data !== null ? modal_data.sticky_note_type_id : undefined,
      name:modal_data !== null?modal_data.name:"",
      sort_number:modal_data !== null?modal_data.sort_number:0,
      color:modal_data !== null?modal_data.color:'#FFFFFF',
      font_color:modal_data !== null?modal_data.font_color:'#000000',

      title:'付箋タイプ',
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      confirm_message:"",

      displayColorPicker:false,
    }
    this.change_flag = 0;
  }

  getAlwaysShow = (name, value) => {
    if(name == "alwaysShow"){
      this.change_flag = 1;
      this.setState({is_enabled: value})
    }
    if (name == 'rapid'){
      this.change_flag = 1;
      this.setState({is_calculate_rapid_examination: value})
    }
  };
  getID = e => {
    this.change_flag = 1;
    this.setState({sticky_note_type_id: parseInt(e)})

  };
  getOrder = e => {
    this.change_flag = 1;
    this.setState({sort_number: parseInt(e)})
  };
  getName = e => {
    this.change_flag = 1;
    this.setState({name: e.target.value})
  };
  getColor = e => {
    this.change_flag = 1;
    this.setState({color: e.target.value})
  };
  getFontColor = e => {
    this.change_flag = 1;
    this.setState({font_color: e.target.value})
  }

  async registerMaster()  {
    let path = "/app/api/v2/master/tag/registerMaster";
    const post_data = {
      params: this.state
    };
    await apiClient.post(path, post_data).then(()=>{
      if (this.props.modal_data != null){
        window.sessionStorage.setItem("alert_messages", '変更しました。');
      } else {
        window.sessionStorage.setItem("alert_messages", '登録しました。');
      }

    });
  }

  handleOk = () => {
    if(this.state.sticky_note_type_id === undefined || this.state.sticky_note_type_id == '' || this.state.sticky_note_type_id <= 0){
      window.sessionStorage.setItem("alert_messages", 'IDを入力してください。');
      return;
    }

    if(this.state.name === ''){
      window.sessionStorage.setItem("alert_messages", '項目名を入力してください。');
      return;
    }

    if(this.props.modal_data !== null){
      this.setState({
        isUpdateConfirmModal : true,
        confirm_message: this.state.title + "マスタ情報を変更しますか?",
      });
    } else {
      this.register();
    }
  };

  register = () => {
    this.registerMaster().then(() => {
      this.confirmCancel();
      this.props.handleOk();
    });
  }

  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      confirm_message: "",
    });
  }

  handleClick_back = () => {
    this.change_flag = 1;
    this.setState({
      displayColorPicker_back: !this.state.displayColorPicker_back,
    })
  };

  handleClick_font = () => {
    this.change_flag = 1;
    this.setState({
      displayColorPicker_font: !this.state.displayColorPicker_font,
    })
  };

  handleClose = () => {
    this.change_flag = 1;
    this.setState({ displayColorPicker_back: false, displayColorPicker_font:false })
  };

  handleChange_font = (color) => {
    this.change_flag = 1;
    this.setState({font_color:color.hex});
  };

  handleChange_back = (color) => {
    this.setState({
      color:color.hex,
    })
  };

  handleCloseModal = () => {
    if (this.change_flag == 1) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。変更内容を破棄して移動しますか？",
      });
    } else {
      this.props.closeModal();
    }      
  }

  render() {
    let color_styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: this.state.font_color,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
          top:'25px'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
    let back_styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: this.state.color,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
          top:'25px'
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
    return  (
      <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>{this.state.title}マスタ{this.props.modal_data != null?'編集':'登録'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="checkbox_area">
              <Checkbox
                label="常に表示"
                getRadio={this.getAlwaysShow.bind(this)}
                value={this.state.is_enabled}
                checked = {this.state.is_enabled ===1}
                name="alwaysShow"
              />
            </div>
            <div className="short-input-group">
              <NumericInputWithUnitLabel
                label='付箋ID'
                value={this.state.sticky_note_type_id}
                disabled = {this.props.modal_data!=null?true:false}
                getInputText={this.getID.bind(this)}
                inputmode="numeric"
              />
              <NumericInputWithUnitLabel
                label='表示順'
                value={this.state.sort_number}
                getInputText={this.getOrder.bind(this)}
                inputmode="numeric"
              />
            </div>
            <InputWithLabel
              label='名称'
              type="text"
              className="name-area"
              getInputText={this.getName.bind(this)}
              diseaseEditData={this.state.name}
            />

            {/* <InputWithLabel
                            label='色'
                            type="text"
                            className="name-area"
                            getInputText={this.getColor.bind(this)}
                            diseaseEditData={this.state.color}
                        /> */}
            <div className="flex">
              <label className="label-title" style={{marginRight:'10px'}}>色</label>
              <div>
                {this.state.displayColorPicker_back?
                  <div style={ back_styles.popover }>
                    <div style={ back_styles.cover } onClick={ this.handleClose }/>
                    <SketchPicker color={ this.state.color } onChange={ this.handleChange_back.bind('color') } />
                  </div> : null }
                <div className="flex">
                  <div style={ back_styles.swatch } onClick={ this.handleClick_back.bind(this) }>
                    <div style={ back_styles.color } />
                  </div>
                  <div className="color-value">{this.state.color}</div>
                </div>
              </div>
            </div>
            {/* <InputWithLabel
                            label="フォントカラー"
                            type="text"
                            getInputText={this.getFontColor.bind(this)}
                            diseaseEditData={this.state.font_color}
                        /> */}
            <div className="flex">
              <label className="label-title" style={{marginRight:'10px'}}>フォントカラー</label>
              <div>
                {this.state.displayColorPicker_font?
                  <div style={ color_styles.popover }>
                    <div style={ color_styles.cover } onClick={ this.handleClose }/>
                    <SketchPicker color={ this.state.font_color } onChange={ this.handleChange_font } />
                  </div> : null }
                <div className="flex">
                  <div style={ color_styles.swatch } onClick={ this.handleClick_font.bind(this) }>
                    <div style={ color_styles.color } />
                  </div>
                  <div className="color-value">{this.state.font_color}</div>
                </div>
              </div>
            </div>
            <div className="flex">
              <label className="label-title"></label>
              <div style={{background:this.state.color, color:this.state.font_color, height:"2rem", lineHeight:"2rem"}}>サンプル</div>
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.handleCloseModal}>キャンセル</Button>
          <Button className={this.change_flag == 1 ? "red-btn":"disable-btn"} onClick={this.handleOk} isDisabled={this.change_flag == 0}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>                    
        </Modal.Footer>
        {this.state.isUpdateConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.register.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.isBackConfirmModal !== false && (
          <SystemConfirmJapanModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.props.closeModal}
            confirmTitle={this.state.confirm_message}
          />
        )}
      </Modal>
    );
  }
}

EditStickyNoteModal.contextType = Context;

EditStickyNoteModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk:   PropTypes.func,
  modal_data:PropTypes.object,
  first_kind_number : PropTypes.number,
  part_id : PropTypes.number,
};

export default EditStickyNoteModal;
