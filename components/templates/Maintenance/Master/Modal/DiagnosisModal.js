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
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

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
    margin-top:0px;
  }
 `;

class DiagnosisModal extends Component {
    constructor(props) {
        super(props);
        this.change_flag = false;
        let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
        this.departements = {};
        this.department_options = [{id:0, value:''}];
        if (departmentOptions != undefined && departmentOptions.length > 0) {
          departmentOptions.map(item=>{
            this.departements[item.id] = item;
            this.department_options.push({id:item.id, value:item.value})
          })
        }

        let modal_data = this.props.modal_data;        
        this.state = {
          department_id : modal_data != null && modal_data.department_id > 0 ? modal_data.department_id : this.props.department_id,

          is_enabled: modal_data != null?modal_data.is_enabled:1,
          number: modal_data != null ? modal_data.number : 0,
          order: modal_data != null ? modal_data.order : null,

          up_diagnosis_level_id: modal_data != null && modal_data.up_diagnosis_level_id > 0?modal_data.up_diagnosis_level_id:0,
          level: modal_data != null && modal_data.level > 0?modal_data.level:0,
          name:modal_data != null?modal_data.name:"",

          diagnosis_level_id:modal_data != null?modal_data.diagnosis_level_id:this.props.diagnosis_level_id,
          english_name:modal_data != null?modal_data.english_name:undefined,          
          definition:modal_data != null?modal_data.definition:undefined,
          expand_flag:modal_data != null?modal_data.expand_flag:1,

          diagnosis_master_id:modal_data != null?modal_data.diagnosis_master_id:this.props.diagnosis_master_id,

          plan_class_id:modal_data != null?modal_data.plan_class_id:0,
          problem_list_disp_flg:modal_data != null?modal_data.problem_list_disp_flg:1,
          plan_list_disp_flg:modal_data != null?modal_data.plan_list_disp_flg:1,
          nurse_plan_list_disp_flg:modal_data != null?modal_data.nurse_plan_list_disp_flg:1,
          progress_item_flg:modal_data != null?modal_data.progress_item_flg:0,          
          item_level_id:modal_data != null?modal_data.item_level_id:undefined,
          
          isUpdateConfirmModal: false,
          isCloseConfirmModal:false,
          confirm_message:"",
          alert_messages:'',
       }
       this.double_click = false;
    }
    componentDidMount() {
    }

    async registerMaster()  {
      if (this.double_click == true) return;
      this.double_click = true;
        var path = '';
        const post_data = {
            params: this.state
        };
        switch(this.props.type){
          case 'level':
            path = "/app/api/v2/master/nurse/registerDiagnosisLevel";
            break;
          case 'diagnosis':
            path = "/app/api/v2/master/nurse/registerDiagnosis";
            break;
          case 'plan':
            path = "/app/api/v2/master/nurse/registerPlan";
            break;
        }        
        
        await apiClient.post(path, post_data).then((res)=>{
          if (this.props.modal_data != null){
            this.props.handleOk();
            this.setState({alert_messages:'変更しました。'})            
          } else {
            this.props.handleOk(res.new_id);
            this.setState({alert_messages:'登録しました。'})            
          }
          this.change_flag = false;          
        })
        .finally(() => {
          this.double_click = false;
        });
    }

    handleOk = () => {
      if (this.change_flag != true) return;
        if(this.state.name == ''){
            this.setState({alert_messages:'名称を入力してください。'})            
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
        });
    }

    confirmCancel() {
        this.setState({
            isUpdateConfirmModal: false,
            isCloseConfirmModal:false,
            confirm_message: "",
            alert_messages:''
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
      var title = '診断階層マスタ';
      if (this.props.type == 'level') title = '診断階層マスタ';
      if (this.props.type == 'diagnosis') title = '診断マスタ';
      if (this.props.type == 'plan') title = '看護計画マスタ';
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
                            <NumericInputWithUnitLabel
                                label="表示順"
                                value={this.state.order}
                                getInputText={this.getInputNumber.bind(this, 'order')}
                                inputmode="numeric"
                            />                            
                        </div>
                        <InputWithLabel
                            label={'名称'}
                            type="text"
                            className="name-area"
                            getInputText={this.getInputText.bind(this, 'name')}
                            diseaseEditData={this.state.name}
                        />
                        {this.props.type == 'level' && (
                          <>
                          <SelectorWithLabel
                            options={this.department_options}
                            title="診療科"
                            getSelect={this.getSelect.bind(this, 'department_id')}
                            departmentEditCode={this.state.department_id}
                          />
                          <div className="short-input-group">
                            <NumericInputWithUnitLabel
                                label={"上階層診断ID"}
                                value={this.state.up_diagnosis_level_id}                                
                                getInputText={this.getInputNumber.bind(this, 'up_diagnosis_level_id')}
                                inputmode="numeric"
                            />
                            <NumericInputWithUnitLabel
                                label={"階層"}
                                value={this.state.level}                                
                                getInputText={this.getInputNumber.bind(this, 'level')}
                                inputmode="numeric"
                            />
                          </div>
                          </>
                        )}
                        {this.props.type == 'diagnosis' && (
                          <>
                          {/* <InputWithLabel
                            label={'英語名称'}
                            type="text"
                            className="name-area"
                            getInputText={this.getInputText.bind(this, 'english_name')}
                            diseaseEditData={this.state.english_name}
                          /> */}
                          {/* <InputWithLabel
                            label={'定義'}
                            type="text"
                            className="name-area"
                            getInputText={this.getInputText.bind(this, 'definition')}
                            diseaseEditData={this.state.definition}
                          /> */}
                          <div className="checkbox_area">
                            <Checkbox
                              label="展開フラグ"
                              getRadio={this.getCheckBox.bind(this)}
                              value={this.state.expand_flag}
                              checked = {this.state.expand_flag ===1}
                              name="expand_flag"
                            />
                          </div>
                          </>
                        )}
                        {this.props.type == 'plan' && (
                          <>
                          <SelectorWithLabel
                            options={this.props.plan_class_options}
                            title="計画区分"
                            getSelect={this.getSelect.bind(this, 'plan_class_id')}
                            departmentEditCode={this.state.plan_class_id}
                          />
                          <div className="checkbox_area">
                            <Checkbox
                                label="問題リストを表示"
                                getRadio={this.getCheckBox.bind(this)}
                                value={this.state.problem_list_disp_flg}
                                checked = {this.state.problem_list_disp_flg ===1}
                                name="problem_list_disp_flg"
                            />
                            <Checkbox
                                label="計画リストを表示"
                                getRadio={this.getCheckBox.bind(this)}
                                value={this.state.plan_list_disp_flg}
                                checked = {this.state.plan_list_disp_flg ===1}
                                name="plan_list_disp_flg"
                            />
                          </div>
                          <div className="checkbox_area">
                            <Checkbox
                                label="看護計画タブ表示"
                                getRadio={this.getCheckBox.bind(this)}
                                value={this.state.nurse_plan_list_disp_flg}
                                checked = {this.state.nurse_plan_list_disp_flg ===1}
                                name="nurse_plan_list_disp_flg"
                            />
                            <Checkbox
                                label="観察項目を有効化"
                                getRadio={this.getCheckBox.bind(this)}
                                value={this.state.progress_item_flg}
                                checked = {this.state.progress_item_flg ===1}
                                name="progress_item_flg"
                            />
                          </div>
                          <div className="short-input-group">
                            <NumericInputWithUnitLabel
                                label={"項目階層ID"}
                                value={this.state.item_level_id}                                
                                getInputText={this.getInputNumber.bind(this, 'item_level_id')}
                                inputmode="numeric"
                            />
                          </div>
                          </>
                        )}
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
                    {this.state.alert_messages != "" && (
                      <SystemAlertModal
                        hideModal= {this.confirmCancel.bind(this)}
                        handleOk= {this.confirmCancel.bind(this)}
                        showMedicineContent= {this.state.alert_messages}
                        title = {this.state.alert_title}
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

DiagnosisModal.contextType = Context;

DiagnosisModal.propTypes = {
    closeModal : PropTypes.func,
    handleOk : PropTypes.func,
    modal_data : PropTypes.object,
    department_id : PropTypes.number,
    type : PropTypes.string,
    diagnosis_level_id: PropTypes.number,
    diagnosis_master_id : PropTypes.number,
    plan_class_options: PropTypes.array,
};

export default DiagnosisModal;
