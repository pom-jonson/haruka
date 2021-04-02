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
// import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
  input {
    width: 400px;
    font-size: 1rem;
  }
  
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 1rem;
    width: 120px;
    text-align: right;
    margin-right: 8px;
    margin-top: 10px;
   }
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {
    margin-top:10px;
    padding-left: 120px;
    label{
        font-size: 1rem;
        width: 180px;
    }
    .label-title{
      width:5rem;
    }
    div{
      margin-top:0;
    }
  }
  .short-input-group{
    display:flex;
    input{
        width:130px;
    }
  }
  .name_area {
    padding-top: 20px;
  }  
  .pullbox {
    margin-top: 8px;
  }
  .pullbox-title{
    margin-top:0;
  }
 `;

class EditAddItemModal extends Component {
    constructor(props) {
        super(props);
        this.change_flag = false;        

        let modal_data = this.props.modal_data;        
        this.state = {
          is_enabled: modal_data != null?modal_data.is_enabled:1,
          number: modal_data != null ? modal_data.number : 0,
          order: modal_data != null ? modal_data.order : null,
          name:modal_data != null?modal_data.name:"",
          unit_id:modal_data != null?modal_data.unit_id:0,
          tier_1st_id:this.props.tier_1st_id,
          tier_2nd_id:this.props.tier_2nd_id,
          tier_3rd_id:this.props.tier_3rd_id,
          target:this.props.target,          

          unit_options:[{id:0, value:''}],
          
          isUpdateConfirmModal: false,
          isCloseConfirmModal:false,
          confirm_message:"",
       }
    }
    componentDidMount() {
      this.getUnitMaster();
    }

    async getUnitMaster(){
      var path = "/app/api/v2/master/nurse/get_unit_master";
      var post_data = {params:{}};
      await apiClient.post(path, post_data).then((res)=>{
        if (res.length > 0){
          var unit_options = this.state.unit_options;
          res.map(item => {
            unit_options.push({id:item.number,value:item.name})
          })
          this.setState({unit_options})
        }
      })
    }

    async registerMaster()  {
        var path = "/app/api/v2/master/nurse/register_elapsed_select_item";
        const post_data = {
            params: this.state
        };
        
        await apiClient.post(path, post_data).then(()=>{
          if (this.props.modal_data != null){
            window.sessionStorage.setItem("alert_messages", '変更しました。');
          } else {
            window.sessionStorage.setItem("alert_messages", '登録しました。');
          }
          this.change_flag = false;
        });
    }

    handleOk = () => {
      if (this.change_flag != true) return;
        if(this.state.name == ''){
            window.sessionStorage.setItem("alert_messages", '名称を入力してください。');
            return;
        }

        if(this.props.modal_data !== null){
            this.setState({
                isUpdateConfirmModal : true,
                confirm_message: "マスタ情報を変更しますか?",
            });
        } else {
          this.setState({
            isUpdateConfirmModal : true,
            confirm_message: "マスタ情報を登録しますか?",
        });
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
            isCloseConfirmModal:false,
            confirm_message: "",
        });
    }

    getInputNumber = (name, e) => {
        this.setState({[name]: parseInt(e)})
        this.change_flag = true;
    };

    getCheckBox = (name, value) => {
      this.setState({[name]:value});
      this.change_flag = true;
    }    
    
    getInputText = (name, e) => {
      this.setState({[name]:e.target.value});
      this.change_flag = true;
    }

    getSelect = (name, e) => {
      this.setState({[name]:e.target.id});
      this.change_flag = true;
    }

    closeThisModal = () => {
      if (this.change_flag) {
        this.setState({
          isCloseConfirmModal: true,
          confirm_message:
            "登録していない内容があります。\n変更内容を破棄して移動しますか？",
          confirm_title: "入力中",
        });
      } else {
        this.props.closeModal();
      }
    }

    render() {
      var title = '';      
        return  (
            <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>{title}{this.props.modal_data != null?'編集':'登録'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className="checkbox_area flex">
                          <div style={{paddingTop:'10px'}}>
                            <Checkbox
                                label="有効化"
                                getRadio={this.getCheckBox.bind(this)}
                                value={this.state.is_enabled}
                                checked = {this.state.is_enabled ===1}
                                name="is_enabled"
                            />
                          </div>
                            {/* <NumericInputWithUnitLabel
                                label="表示順"
                                value={this.state.order}
                                getInputText={this.getInputNumber.bind(this, 'order')}
                                inputmode="numeric"
                            /> */}
                        </div>
                        <InputWithLabel
                            label={'名称'}
                            type="text"
                            className="name-area"
                            getInputText={this.getInputText.bind(this, 'name')}
                            diseaseEditData={this.state.name}
                        />
                        <SelectorWithLabel
                          options={this.state.unit_options}
                          title="単位"
                          getSelect={this.getSelect.bind(this, 'unit_id')}
                          departmentEditCode={this.state.unit_id}
                        />                  
                    </Wrapper>                    
                    {this.state.isUpdateConfirmModal !== false && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.register.bind(this)}
                            confirmTitle= {this.state.confirm_message}
                        />
                    )}
                    {this.state.isCloseConfirmModal && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.props.closeModal}
                            confirmTitle= {this.state.confirm_message}
                        />
                    )}                    
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel-btn" onClick={this.closeThisModal.bind(this)}>キャンセル</Button>
                    <Button className={this.change_flag?'red-btn':'disable-btn'} onClick={this.handleOk}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

EditAddItemModal.contextType = Context;

EditAddItemModal.propTypes = {
  closeModal : PropTypes.func,
  handleOk : PropTypes.func,
  modal_data : PropTypes.object,
  tier_1st_id: PropTypes.number,
  tier_2nd_id: PropTypes.number,
  tier_3rd_id: PropTypes.number,
  target: PropTypes.number
};

export default EditAddItemModal;
