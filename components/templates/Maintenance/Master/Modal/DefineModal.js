import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  div{margin-top:0;}
  .label-title{
    font-size: 1rem;
    width: 7rem;
    line-height:2rem;
    text-align:right;
    margin:0;
    margin-right:0.5rem;
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
  .short-input-group{    
    input{        
        line-height: 0.5rem;        
    }
    b {
      right: 4px !important;
    }
  }
  .selectbox-area {
    margin-bottom:0.5rem;
    .pullbox-label {
      width:calc(100% - 7.5rem);
      margin:0;
      .pullbox-select {
        width:100%;
        height:2rem;
        font-size:1rem;
      }
    }
  }
  .checkbox_area {
    padding-left:7.5rem;
    label{
        font-size: 1rem;
        width: 100px;
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
      width: 100px;
      height: 2rem;
      line-height: 2rem;
      input{
        font-size: 1rem;
        height: 15px !important;
      }      
    }
  }
  .react-numeric-input input{height:2rem;}
  .label-unit {display:none;}
`;

class DefineModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    var title = "";
    var id, label;
    switch(this.props.table_kind){
      case 0:
        id = modal_data != null?modal_data.purpose_id:'';
        title = '検査目的定義';
        label = '検査目的';
        break;
      case 1:
        id = modal_data != null?modal_data.symptoms_id:'';
        title = '現症定義';
        label = '現症';
        break;
      case 2:
        id = modal_data != null?modal_data.request_id:'';
        title = '依頼区分定義';
        label = '依頼区分';
        break;
      case 3:
        id = modal_data != null?modal_data.movement_id:'';
        title = '患者移動形態定義';
        label = '患者移動形態';
        break;
      case 4:
        id = modal_data != null?modal_data.risk_factors_id:'';
        title = '冠危険因子定義';
        label = '冠危険因子';
        break;
      case 5:
        id = modal_data != null ? modal_data.sick_history_id : '';
        title = '現病歴定義';
        label = '現病歴';
        break;
    }
    this.state = {
      is_enabled: modal_data !== null?modal_data.is_enabled:1,
      number: modal_data !== null ? modal_data.number : 0,
      inspection_id : this.props.inspection_id,
      title,
      id,
      label,
      order:modal_data !== null?modal_data.order:"",
      table_kind: this.props.table_kind,
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      confirm_message:"",
    }
    this.change_flag = 0;
  }
  
  async componentDidMount(){
    let path = "/app/api/v2/master/inspection/search";
    let post_data = {
      params:{is_enabled:1, table_kind:this.state.table_kind, }
    };
    await apiClient.post(path, post_data).then((res)=>{
      var master_list = [{id:0,value:''}];
      if(res.length > 0){
        res.map(item => {
          switch(this.props.table_kind){
            case 0:
              master_list.push({id:item.purpose_id, value:item.name});
              break;
            case 1:
              master_list.push({id:item.symptoms_id, value:item.name});
              break;
            case 2:
              master_list.push({id:item.request_id, value:item.name});
              break;
            case 3:
              master_list.push({id:item.movement_id, value:item.name});
              break;
            case 4:
              master_list.push({id:item.risk_factors_id, value:item.name});
              break;
            case 5:
              master_list.push({id:item.sick_history_id, value:item.name});
              break;
          }
        })
      }
      this.setState({master_list})
    });
    
  }
  getAlwaysShow = (name, value) => {
    if(name==="alwaysShow"){
      this.change_flag = 1;
      this.setState({is_enabled: value})
    }
  };
  
  getOrder = e => {
    this.change_flag = 1;
    this.setState({order: parseInt(e)})
  };
  
  getMasterID = e => {
    this.change_flag = 1;
    this.setState({id:e.target.id});
  }
  
  async registerMaster()  {
    let path = "/app/api/v2/master/inspection/registerDefineMaster";
    const post_data = {
      params: this.state
    };
    await apiClient.post(path, post_data).then((res)=>{
      if(res){
        window.sessionStorage.setItem("alert_messages", res.alert_message);
      }
    });
  }
  
  handleOk = () => {
    if(this.state.id === undefined || this.state.id == '' || this.state.id <= 0){
      window.sessionStorage.setItem("alert_messages", 'マスタを選択してください。');
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
    return  (
      <Modal show={true} id="add_contact_dlg"  className="inspection-define-master-edit first-view-modal">
        <Modal.Header>
          <Modal.Title>{this.state.title}マスタ{this.state.modal_data == null?'登録':'編集'} － {this.props.inspection_name}</Modal.Title>
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
            <div className="selectbox-area">
              {this.state.master_list != undefined && this.state.master_list != null && (
                <SelectorWithLabel
                  options={this.state.master_list}
                  title={this.state.label}
                  getSelect={this.getMasterID}
                  departmentEditCode={this.state.id}
                />
              )}
            </div>
            <div className="short-input-group">
              <NumericInputWithUnitLabel
                label="表示順"
                value={this.state.order}
                getInputText={this.getOrder.bind(this)}
                inputmode="numeric"
              />
            </div>
          </Wrapper>
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
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.handleCloseModal}>キャンセル</Button>
          <Button className={this.change_flag === 1 ? "red-btn" : "disable-btn"} onClick={this.handleOk} isDisabled={this.change_flag == 0}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>          
        </Modal.Footer>
      </Modal>
    );
  }
}

DefineModal.contextType = Context;
DefineModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk:   PropTypes.func,
  modal_data:PropTypes.object,
  first_kind_number : PropTypes.number,
  table_kind : PropTypes.number,
  inspection_id:PropTypes.string,
  inspection_name: PropTypes.string,
};

export default DefineModal;
