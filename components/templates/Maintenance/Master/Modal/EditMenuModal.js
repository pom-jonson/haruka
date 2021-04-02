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
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import MenuListModal from "./MenuListModal";

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
    height: 2rem;
    line-height: 2rem;
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
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {
    margin-top:10px;
    padding-left: 128px;
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
  .pullbox {
    margin-top: 8px;
  }
 `;

class EditMenuModal extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;        
        this.state = {        
            is_enabled: modal_data !== null?modal_data.is_enabled:1,
            number: modal_data !== null ? modal_data.number : 0,
            sort_number: modal_data !== null ? modal_data.sort_number : undefined,
            tab_id: modal_data != null?modal_data.tab_id:this.props.tab_id,
            category_id: modal_data != null?modal_data.category_id:this.props.category_id,
            tab: modal_data != null?modal_data.tab:this.props.tab,
            category: modal_data != null?modal_data.category:this.props.category,
            name:modal_data !== null?modal_data.name:"",
            id:modal_data !== null?modal_data.id:"",
            is_alias_for:modal_data !== null?modal_data.is_alias_for:null,
            url:modal_data !== null?modal_data.url:'',

            enabled_karte:modal_data !== null?modal_data.enabled_karte:1,
            enabled_in_patient_page:modal_data !== null?modal_data.enabled_in_patient_page:1,
            enabled_in_default_page:modal_data !== null?modal_data.enabled_in_default_page:1,
            is_available_in_outpatient_karte:modal_data !== null?modal_data.is_available_in_outpatient_karte:1,
            is_available_in_visiting_karte:modal_data !== null?modal_data.is_available_in_visiting_karte:1,
            is_available_in_hospitalization_karte:modal_data !== null?modal_data.is_available_in_hospitalization_karte:1,
            is_visible:modal_data !== null?modal_data.is_visible:1,
            is_modal:modal_data !== null?modal_data.is_modal:0,

            tab_options:[],
            category_options:[],
            isMenuListModal:false,
            isUpdateConfirmModal: false,
            isBackConfirmModal: false,
            confirm_message:"",
       }
       this.change_flag = 0;
    }
    componentDidMount() {
        this.makeTabSelectList(this.props.tab_list);       
        this.makeCategorySelectList(this.props.category_list);
    }    

    makeTabSelectList(data){
        if (data == undefined || data == null || data.length == 0 ) return;
        var tab_options = [];
        data.map(item => {            
            tab_options.push({id:item.tab_id, value:item.tab_name})
        })        
        this.setState({tab_options});
    }

    makeCategorySelectList(data){
        if (data == undefined || data == null || data.length ==0 ) return;
        var category_options = [];
        data.map(item => {
            category_options.push({id:item.category_id, value:item.category_name})
        })
        this.setState({category_options});
    }

    getAlwaysShow = (name, value) => {
      this.change_flag = 1;
        switch(name){
            case 'enabled':
                this.setState({is_enabled: value})
                break;
            case 'visible':
                this.setState({is_visible: value})
                break;
            case 'patient_page':
                this.setState({enabled_in_patient_page: value})
                break;
            case 'default_page':
                this.setState({enabled_in_default_page: value})
                break;
            case 'modal_page':
                this.setState({is_modal: value})
                break;
            case 'enabled_karte':
                this.setState({enabled_karte: value})
                break;
            case 'is_available_in_outpatient_karte':
                this.setState({is_available_in_outpatient_karte: value})
                break;
            case 'is_available_in_visiting_karte':
                this.setState({is_available_in_visiting_karte: value})
                break;
            case 'is_available_in_hospitalization_karte':
                this.setState({is_available_in_hospitalization_karte: value})
                break;
        }
    };
    getMasterID = e => {       
      this.change_flag = 1; 
      this.setState({id:parseInt(e) })
    };
    
    getName = e => {
      this.change_flag = 1; 
      this.setState({name: e.target.value})
    };
    getURL = e => {
      this.change_flag = 1; 
        this.setState({url: e.target.value})
    };

    getTab = e => {
      this.change_flag = 1; 
      this.setState({tab_id:e.target.id, tab: e.target.value}, () => {
        this.getCategoryList();
      })
    };
    getCategoryList = async() => {
        let path = '';
        let post_data;        
        path = "/app/api/v2/master/menu/searchCategory";
        post_data = {tab_id:this.state.tab_id};
        
        await apiClient
          ._post(path, {
              params: post_data
          })
          .then((res) => {
            if (res.length>0){
                this.makeCategorySelectList(res);
                this.setState({
                    category_id:res[0].category_id,
                    category:res[0].category_name,
                });
            } else {
                this.setState({
                    category_options:[],
                    category_id:0,
                    category:'',
                })
            }
          })
          .catch(() => {

          });
    }

    getCategory = e => {
        this.setState({category_id:e.target.id, category: e.target.value})
    };

    async registerMaster()  {
        var path = '';
        const post_data = {
            params: this.state
        };
        path = "/app/api/v2/master/menu/registerMenu";
        
        await apiClient.post(path, post_data).then(()=>{
          if (this.props.modal_data != null){
            window.sessionStorage.setItem("alert_messages", '変更しました。');
          } else {
            window.sessionStorage.setItem("alert_messages", '登録しました。');
          }     
        });
    }

    handleOk = () => {
        if(this.state.id === undefined || this.state.id === '' || this.state.id <= 0){
            window.sessionStorage.setItem("alert_messages", 'IDを入力してください。');
            return;
        }        
        if(this.state.tab == ''){
            window.sessionStorage.setItem("alert_messages", 'タブを入力してください。');
            return;
        }
        if(this.state.category == ''){
            window.sessionStorage.setItem("alert_messages", 'カテゴリーを入力してください。');
            return;
        }
        if(this.state.name === ''){
            window.sessionStorage.setItem("alert_messages", '名称を入力してください。');
            return;
        }

        if(this.props.modal_data !== null){
            this.setState({
                isUpdateConfirmModal : true,
                confirm_message: "メニュー情報を変更しますか?",
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

    getSortNumber = e => {
      this.change_flag = 1;
        this.setState({sort_number: parseInt(e)})
    };

    getAlias = e => {
      this.change_flag = 1; 
        if (e.target.value != '') return;
        this.setState({is_alias_for:e.target.value});
    }

    openMenuListModal(){
        this.setState({
            isMenuListModal:true,
        })
    }

    closeModal = () => {
        this.setState({
            isMenuListModal:false,
        })
    }

    selectMenu = (item) =>{
        this.setState({
            is_alias_for:item.id,
            alias_name:item.name,
        })
        this.closeModal();
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
            <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>メニュー{this.props.modal_data != null?'編集':'登録'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className="checkbox_area">
                            <Checkbox
                                label="有効化"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.is_enabled}
                                checked = {this.state.is_enabled ===1}
                                name="enabled"
                            />
                            <Checkbox
                                label="常に表示"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.is_visible}
                                checked = {this.state.is_visible ===1}
                                name="visible"
                            />
                        </div>
                        <div className="short-input-group">
                            <NumericInputWithUnitLabel
                                label={"メニューID"}
                                value={this.state.id}
                                disabled = {this.props.modal_data!=null?true:false}
                                getInputText={this.getMasterID.bind(this)}
                                inputmode="numeric"
                            /> 
                            <NumericInputWithUnitLabel
                                label="表示順"
                                value={this.state.sort_number}
                                getInputText={this.getSortNumber.bind(this)}
                                inputmode="numeric"
                            />
                        </div>
                        <SelectorWithLabel
                            options={this.state.tab_options}
                            title="タブ"
                            getSelect={this.getTab.bind(this)}
                            departmentEditCode={this.state.tab_id}
                        />                        
                        <SelectorWithLabel
                            options={this.state.category_options}
                            title="カテゴリ"
                            getSelect={this.getCategory.bind(this)}
                            departmentEditCode={this.state.category_id}
                        />                        
                        <InputWithLabel
                            label={'メニュー名'}
                            type="text"
                            className="name-area"
                            getInputText={this.getName.bind(this)}
                            diseaseEditData={this.state.name}
                        />
                        <InputWithLabel
                            label={'URL'}
                            type="text"
                            className="name-area"
                            getInputText={this.getURL.bind(this)}
                            diseaseEditData={this.state.url}
                        />
                        <div onClick={this.openMenuListModal.bind(this)}>
                            <InputWithLabel
                                label={'エイリアス先'}
                                type="text"
                                className="name-area"
                                getInputText={this.getAlias.bind(this)}
                                diseaseEditData={this.state.is_alias_for}
                            />
                        </div>
                        <div className="checkbox_area">
                            <Checkbox
                                label="カルテの記載を行う"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.enabled_karte}
                                checked = {this.state.enabled_karte ===1}
                                name="enabled_karte"
                            />
                            <Checkbox
                                label="患者ページで使用"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.enabled_in_patient_page}
                                checked = {this.state.enabled_in_patient_page ===1}
                                name="patient_page"
                            />
                        </div>
                        <div className="checkbox_area">
                            <Checkbox
                                label="その他のページで使用"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.enabled_in_default_page}
                                checked = {this.state.enabled_in_default_page ===1}
                                name="default_page"
                            />
                            <Checkbox
                                label="モータル"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.is_modal}
                                checked = {this.state.is_modal ===1}
                                name="modal_page"
                            />
                        </div>
                        <div className="checkbox_area">
                            <Checkbox
                                label="外来カルテで利用可能"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.is_available_in_outpatient_karte}
                                checked = {this.state.is_available_in_outpatient_karte ===1}
                                name="is_available_in_outpatient_karte"
                            />
                            <Checkbox
                                label="訪問カルテで利用可能"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.is_available_in_visiting_karte}
                                checked = {this.state.is_available_in_visiting_karte ===1}
                                name="is_available_in_visiting_karte"
                            />
                        </div>
                        <div className="checkbox_area">
                            <Checkbox
                                label="入院カルテで利用可能"
                                getRadio={this.getAlwaysShow.bind(this)}
                                value={this.state.is_available_in_hospitalization_karte}
                                checked = {this.state.is_available_in_hospitalization_karte ===1}
                                name="is_available_in_hospitalization_karte"
                            />                           
                        </div>
                    </Wrapper>
                    {this.state.isMenuListModal !== false && (
                        <MenuListModal
                            selectMenu= {this.selectMenu}
                            closeModal={this.closeModal}                            
                        />
                    )}
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
                    <Button className={this.change_flag == 1 ? "red-btn":"disable-btn"} onClick={this.handleOk} isDisabled={this.change_flag == 0}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

EditMenuModal.contextType = Context;

EditMenuModal.propTypes = {
    closeModal : PropTypes.func,
    handleOk : PropTypes.func,    
    modal_data : PropTypes.object,
    tab_id : PropTypes.string,
    category_id : PropTypes.string,
    tab : PropTypes.string,
    category : PropTypes.string,
    tab_list : PropTypes.array,
    category_list: PropTypes.array,
};

export default EditMenuModal;
