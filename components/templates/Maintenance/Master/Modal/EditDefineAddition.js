import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
// import Checkbox from "~/components/molecules/Checkbox";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import RadioGroupButton from "~/components/molecules/RadioGroup";
import Checkbox from "~/components/molecules/Checkbox";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  height: 100%;
  float: left;
  label {
      text-align: right;
    //   width: 80px;
  }
  input {
    width: 400px;
    font-size: 18px;
  }
  
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 18px;
    width: 170px;
    text-align:right!important;
    margin-right:10px;
   }
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {
    padding-left: 15px;
    label{
        font-size: 18px;
        width: 260px;
    }
  }
  .short-input-group{
    display:flex;
    input{
        width:130px;
    }
  }
  
  .kana_area {
    padding-top: 10px;
  }
  .name_area {
    padding-top: 20px;
  }
  .gender {
    font-size: 18px;
    margin-top: 10px;
    margin-left: 15px;
    margin-bottom: 10px;
    .gender-label {
      width: 100px;
      margin-top: 8px;
      float: left;
    }
    .radio-group-btn label{
        font-size: 14px;
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
  }
  
  .footer {
    display: flex;    
    margin-top: 10px;
    text-align: center;    
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
 `;

const function_categories = [
    {id:0, value:''},
    {id:1, value:'処方'},
    {id:2, value:'注射'},
    {id:3, value:'処置'},
    {id:4, value:'検査'},
    {id:5, value:'汎用オーダー'},
    {id:7, value:'放射線'},
    {id:9, value:'リハビリ'},
]
const sending_categories = [
    {id:0, value:''},
    {id:1, value:'送信する'},
    {id:2, value:'送信しない'},
    {id:3, value:'ユーザ選択'},
]
class EditDefineAddition extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;
        
        this.state = {
            addition_id:this.props.addition_id,
            is_enabled: modal_data !== null?modal_data.is_enabled:1,
            number: modal_data !== null ? modal_data.number : 0,
            addition_define_id:modal_data !== null?modal_data.addition_define_id:undefined,            
            function_category_id:modal_data !== null?modal_data.function_category_id:0,
            function_id:modal_data !== null?modal_data.function_id:0,
            medical_business_diagnosing_type:modal_data !== null?modal_data.medical_business_diagnosing_type:null,
            sending_category:modal_data !== null?modal_data.sending_category:0,
            
            title:'追加項目制御定義',
            
            isUpdateConfirmModal: false,
            confirm_message:"",
            detail_functions:[{id:0, value:''}],
        }
    }

    componentDidMount = () => {
        if (this.state.function_category_id >0) this.getDetailFunctions(this.state.function_category_id);
    }

    getDetailFunctions = async(function_category_id) => {
        var detail_functions = this.state.detail_functions;
        let path = "/app/api/v2/master/addition/searchFunctionsByCategory";
        let post_data = {
            params:{is_enabled:1, function_category_id:function_category_id}
        }

        await apiClient.post(path, post_data).then((res)=>{
            if(res.length > 0){
                res.map(item => {
                    detail_functions.push({id:item.id, value:item.name})
                })
            }
        })
        this.setState({detail_functions})
    }

    getAlwaysShow = (name, value) => {
        if(name==="alwaysShow"){
            this.setState({is_enabled: value})
        }
        if (name == 'left_right'){
            this.setState({radiation_left_right_flag:value})
        }
    };
    getMasterID = e => {
        this.setState({addition_define_id:parseInt(e)});        
    };

    getBuissinessType = e => {
        this.setState({medical_business_diagnosing_type:parseInt(e)});
    };
    getFunctionCategoryID = e => {
        this.setState({
            function_category_id:e.target.id,
            function_id:0,
            detail_functions:[{id:0, value:''}],
        }, () => {            
            this.getDetailFunctions(this.state.function_category_id);
        });
    }

    getFunctionID = e => {
        this.setState({function_id:e.target.id});
    }

    getSendingCategory = e => {
        this.setState({sending_category:e.target.id});
    }

    getReceiptKey = e => {
        this.setState({receipt_key: e.target.value})
    };

    getName = e => {
        this.setState({name:e.target.value});        
    };
    getOrder = e => {
        this.setState({order: parseInt(e)})
    };
    

    async registerMaster()  {
        let path = "/app/api/v2/master/addition/registerDefineAddition";
        
        const post_data = {
            params: this.state
        };
        await apiClient.post(path, post_data).then((res)=>{
          if (res)
                window.sessionStorage.setItem("alert_messages", res.alert_message);
        });
    }

    handleOk = () => {

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
            confirm_message: "",
        });
    }    

    render() {        
        let {detail_functions} = this.state;
        return  (
            <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>{this.state.title}マスタ編集</Modal.Title>
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
                        <div style={{marginBottom:'10px'}}>
                            <NumericInputWithUnitLabel
                                label={this.state.title+'ID'}
                                value={this.state.addition_define_id}
                                disabled = {this.props.modal_data!=null?true:false}
                                getInputText={this.getMasterID.bind(this)}
                                inputmode="numeric"
                            />
                        </div>

                        <SelectorWithLabel
                            options={function_categories}
                            title={'機能分類'}
                            getSelect={this.getFunctionCategoryID.bind(this)}
                            departmentEditCode={this.state.function_category_id}
                        />

                        {detail_functions != undefined && detail_functions != null && detail_functions.length>0 && (
                            <SelectorWithLabel
                                options={detail_functions}
                                title={'機能名'}
                                getSelect={this.getFunctionID.bind(this)}
                                departmentEditCode={this.state.function_id}
                            />
                        )}
                        

                        <SelectorWithLabel
                            options={sending_categories}
                            title={'送信制御区分'}
                            getSelect={this.getSendingCategory.bind(this)}
                            departmentEditCode={this.state.sending_category}
                        />

                        <div style={{marginBottom:'10px'}}>
                            <NumericInputWithUnitLabel
                                label={'診療区分'}
                                value={this.state.medical_business_diagnosing_type}                                
                                getInputText={this.getBuissinessType.bind(this)}
                                inputmode="numeric"
                            />
                        </div>
                        
                        <div className="footer">
                            <div className="add-button">
                                <Button type="mono" onClick={this.handleOk}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>
                                <Button type="mono" onClick={this.props.closeModal}>閉じる</Button>
                            </div>
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
                </Modal.Body>
            </Modal>
        );
    }
}

EditDefineAddition.contextType = Context;

EditDefineAddition.propTypes = {
    closeModal: PropTypes.func,
    handleOk:   PropTypes.func,    
    modal_data:PropTypes.object,
    addition_id: PropTypes.number,
};

export default EditDefineAddition;
