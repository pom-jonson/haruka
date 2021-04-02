import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
// import * as apiClient from "~/api/apiClient";
// import Spinner from "react-bootstrap/Spinner";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import {formatDateTimeIE} from "~/helpers/date";
const Wrapper = styled.div`
  width:100%;
  height: 100%;
  font-size:1rem;
  .label-title{
    width:5rem;
    font-size:1rem;
    text-align:right;
    margin-right:5px;
  }
  input{
    height:2.8rem;
    width:150px;
  }
  .title-area{
    input{
      width:87%;
    }
  }
`;

class CreateFreeTitleModal extends Component {
  constructor(props) {
    super(props);
    var selected_free_title = this.props.selected_free_title;
    var selected_title = this.props.selected_title;
    var title = '';
    var selected_item = null;
    if (selected_free_title != null){
      title = selected_free_title.title;
      selected_item = selected_free_title;
    }
    if (selected_title != null){
      if (selected_title.tier_3rd_name != null){
        title = selected_title.tier_2nd_name + ' ＞ ' + selected_title.tier_3rd_name;
      } else {
        title = selected_title.title;
      }
      selected_item = selected_title;
    }
    this.state = {
      // number:selected_item != null?selected_item.number:0,
      title,
      start_date:selected_item != null?formatDateTimeIE(selected_item.start_date):'',
      end_date:selected_item != null?formatDateTimeIE(selected_item.end_date):'',
      alert_messages: '',
      confirm_message:'',
      isSaveConfirmModal:false,
      isCloseConfirmModal:false,
      confirm_alert_title:'',

      selected_item,
    };
    this.change_flag = false;
  }

  onHide = () => {};
  
  confirmOk=()=>{
    var post_data = {};    
    var act = this.props.act;
    if (act == 'free_title_create' || act == 'free_title_edit'){
      post_data = {
        number:this.props.selected_free_title.title_id,
        title:this.state.title,
        start_date:this.state.start_date,
        end_date:this.state.end_date,
      };
      this.props.handletitleOk(post_data);
    } else {
      post_data = this.props.selected_title;
      post_data.number = this.props.selected_title.title_id;
      post_data.start_date = this.state.start_date;
      post_data.end_date = this.state.end_date;
      post_data.title =  this.props.selected_title.tier_3rd_name != null? this.props.selected_title.tier_3rd_name: this.props.selected_title.title;
      this.props.handletitleOk(post_data);
    }
  }

  getInputText = (name, e) => {
    this.setState({[name]:e.target.value})
    this.change_flag = true;
  }

  getInputdate = (name, value) => {
    this.setState({[name]:value});
    this.change_flag = true;
  }

  closeThisModal = () => {
    if (this.change_flag){
      this.setState({
        isCloseConfirmModal:true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title: "入力中",
      })
    } else {
      this.props.closeModal();
    }
  }

  save = () => {
    if (this.change_flag != true) return;
    if (this.state.title == ''){
      this.setState({
        alert_messages:'項目名を入力してください。'
      })
      return;
    }
    if (this.state.start_date == ''){
      this.setState({
        alert_messages:'開始日を入力してください。'
      })
      return;
    }
    if (this.state.start_date != '' && this.state.end_date != ''){
      if (this.state.start_date.getTime() > this.state.end_date.getTime()){
        this.setState({
          alert_messages:'終了日開始日以降で入力してください。'
        })
        return;
      }
    }
    this.setState({
      isSaveConfirmModal:true,
      confirm_message: "登録しますか?",
    })
  }

  confirmCancel = () => {
    this.setState({
      confirm_message:'',
      isSaveConfirmModal:false,
      isCloseConfirmModal:false,
      alert_messages: '',
      confirm_alert_title:''
    })
  }

  render() {
    var selected_item = this.state.selected_item;
    var act = this.props.act;
    var modal_title = '';
    if (act == 'free_title_create') modal_title = '観察項目追加（フリー入力）';
    if (act == 'free_title_edit' || act == 'title_edit') modal_title = '観察項目編集';
    if (act == 'title_stop') modal_title = '観察項目中止';
    var surfix = '';
    if (selected_item.side != null && selected_item.side != '') surfix += '(' + selected_item.side;
    if (selected_item.part != null && selected_item.part != '') {
      if (surfix =='') surfix += '(';
      surfix += selected_item.part;
    }
    if (surfix != '') surfix += ')';
    return (
      <>
        <Modal show={true} className="master-modal first-view-modal" onHide={this.onHide}>
          <Modal.Header><Modal.Title>{modal_title}</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>                
              <div className='title-area'>
                <InputWithLabelBorder
                  label="項目名"
                  type="text"                  
                  getInputText={this.getInputText.bind(this, 'title')}
                  diseaseEditData={this.state.title + surfix}
                  id="title_id"
                  // isDisabled = {act == 'title_edit' || act == 'title_stop'}
                  isDisabled = {true}
                />
              </div>
              <div className='date-area flex'>
                <InputWithLabelBorder
                  label="開始日"
                  type="date"
                  getInputText={this.getInputdate.bind(this, 'start_date')}
                  diseaseEditData={this.state.start_date}    
                  isDisabled = {act == 'title_stop'}
                />
                <InputWithLabelBorder
                  label="終了日"
                  type="date"
                  getInputText={this.getInputdate.bind(this, 'end_date')}
                  diseaseEditData={this.state.end_date}                   
                />
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.closeThisModal}>キャンセル</Button>
            <Button className={this.change_flag?"red-btn":'disable-btn'} onClick={this.save.bind(this)}>登録</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.isSaveConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.confirmOk.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
          {this.state.isCloseConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.props.closeModal}
              confirmTitle={this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}          
        </Modal>        
      </>
    );
  }
}

CreateFreeTitleModal.contextType = Context;
CreateFreeTitleModal.propTypes = {
  closeModal: PropTypes.func,
  handletitleOk: PropTypes.func,
  selected_free_title: PropTypes.object,
  selected_title:PropTypes.object,
  act:PropTypes.string,
};

export default CreateFreeTitleModal;