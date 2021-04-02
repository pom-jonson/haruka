import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import axios from "axios";
import Checkbox from "~/components/molecules/Checkbox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { faMinusCircle } from "@fortawesome/pro-solid-svg-icons";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 1rem;
  margin-right: 5px;
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
  max-height: 35rem;
  overflow-y: auto;
  .flex{
      display:flex;
  }
  label {
      text-align: right;
      width: 80px;
  }
  input {
    width: 400px;
    font-size: 1rem;
    height: 2.375rem;
  }
  
  .checkbox-label{
    width: 30%;
    text-align: left;
  }
  .label-title{
    font-size: 1rem;
    width: 120px;
    text-align:right;
    margin-right:8px;
    line-height: 2.375rem;
    margin-top: 0;
    margin-bottom: 0;
   }
   .pullbox-label, .pullbox-select{
       width:400px;
       margin-bottom: 0;
       height: 2.375rem;
   }
  .add-button {
      text-align: center;
      width:100%;
  }
  .checkbox_area {
    margin-left: 128px;
    label{
        font-size: 1rem;
        width: 100px;
        text-align: left;
    }
    input {
        height: 15px;
    }
  }
  .short-input-group{
    display:flex;
    input{
        width:130px;
    }
  }
  .delete_icon{
    margin-left:10px;
    cursor:pointer;
  }
  table {
      th {
        padding: 0.25rem;
        border-bottom-width: 0;
        border-top-width: 0;
      }
  }
  
  #unit-table{
    width: 80%;
    margin-left: 10%;
    td {
        padding: 0.25rem;
    }
  }
  .unit-group{
    input{
        height: 2.375rem;
    }
    .unit_id{
        .label-title{
            width:60px;
        }
        input{
            width:70px;
        }
        .label-unit{
            display: none;
        }
    }
    .unit_name{
        .label-title{
            width:60px;
        }
        input{
            width:100px;
        }
    }
    .unit_ratio{
        .label-title{
            width:100px;
        }
        input{
            width:70px;
        }
    }
    .plus-unit{
        padding-top: 8px;
        padding-left: 10px;
        cursor:pointer;
        span {
            line-height: 2.375rem;
        }
    }
  }
`;

class TreatModal extends Component {
    constructor(props) {
        super(props);
        let modal_data = this.props.modal_data;
        var id ="";
        var title = "";        
        switch(parseInt(this.props.modal_type)){
            case 0:     //実施場所
                id = modal_data != null?modal_data.location_id:'';
                title = '実施場所'
                break;
            case 1:     //部位
                id = modal_data != null?modal_data.part_id:'';
                title = '部位';
                break;
            case 2:     //左右
                id = modal_data != null?modal_data.side_id:'';
                title = '左右';
                break;
            case 3:     //品名
                id = modal_data != null?modal_data.item_id:'';
                title = '品名';
                break;
            case 4:     //品名分類
                id = modal_data != null?modal_data.item_category_id:'';
                title = '品名分類';
                break;
        }
        
        this.state = {
            is_enabled: modal_data !== null?modal_data.is_enabled:1,
            number: modal_data !== null ? modal_data.number : 0,
            id,
            title,
            name:modal_data !== null?modal_data.name:"",
            order:modal_data !== null?modal_data.order:undefined,
            receipt_key:modal_data !== null?modal_data.receipt_key:undefined,
            main_unit : modal_data !== null?modal_data.main_unit:undefined,
            units : modal_data != null && modal_data.units != null && modal_data.units.length>0?modal_data.units:[],
            item_category_id : modal_data != null && modal_data.item_category_id != null?modal_data.item_category_id:'',
            
            table_kind:this.props.modal_type,
            confirm_message:"",
            alert_messages: ""
        }
        this.change_flag = 0;
    }

    componentDidMount(){
        this.getItemCategory();
    }


    async getItemCategory() {
        let path = "/app/api/v2/master/treat/search";
        let post_data = {            
            is_enabled: 1,
            table_kind: 4,            
        };
        let { data } = await axios.post(path, {params: post_data});
        var item_category_list = [{id:0,value:''}];
        if (data.length>0){
            data.map(item => {
                item_category_list.push({id:item.item_category_id, value:item.name});                    
            })
        }
        this.setState({item_category_list});
    }

    getAlwaysShow = (name, value) => {
        if(name==="alwaysShow"){
            this.setState({is_enabled: value})
            this.change_flag = 1;
        }
    };
    getMasterID = e => {
        this.setState({id: parseInt(e)})
        this.change_flag = 1;
    };
    getOrder = e => {
        this.setState({order: parseInt(e)})
        this.change_flag = 1;
    };
    getName = e => {
        this.setState({name: e.target.value})
        this.change_flag = 1;
    };
    getReceiptKey = e => {
        this.setState({receipt_key: e.target.value})
        this.change_flag = 1;
    }
    getMainUnit = e => {
        this.setState({main_unit: e.target.value})
        this.change_flag = 1;
    }

    getUnitID = e => {
        this.setState({unit_id: parseInt(e)})
        this.change_flag = 1;
    }
    getUnitName = e => {
        this.setState({unit_name: e.target.value})
        this.change_flag = 1;
    }
    getRatio = e => {
        this.setState({receipt_magnification: e.target.value})
        this.change_flag = 1;
    }
    addUnitGroup = () => {
        if (this.state.unit_id == undefined || this.state.unit_id == null || this.state.unit_id == ''){
            this.setState({alert_messages: '単位IDを入力してください。'});
            return;
        }
        if (this.state.unit_name == undefined || this.state.unit_name == null || this.state.unit_name == ''){
            this.setState({alert_messages: '単位名を入力してください。'});
            return;
        }
        var temp = this.state.units;
        temp.push({unit_id:this.state.unit_id, name:this.state.unit_name, receipt_magnification:this.state.receipt_magnification});
        this.setState({
            units:temp,
            unit_id:'',
            unit_name:'',
            receipt_magnification:'',
        });
        this.change_flag = 1;
    }
    deleteUnit = (index) => {
        var temp = this.state.units;
        temp.splice(index, 1);
        this.setState({units:temp});
        this.change_flag = 1;
    }

    async registerMaster()  {
        let path = "/app/api/v2/master/treat/registerMasterData";
        const post_data = {
            params: this.state
        };        
        await apiClient.post(path, post_data).then(()=>{
            let alert_messages = this.props.modal_data !== undefined && this.props.modal_data != null ? "変更しました。": "登録しました。";
            this.setState({alert_messages, alert_action: "close"});
        });
    }

    handleOk = () => {
        if(this.state.id === '' || this.state.id <= 0){
            this.setState({alert_messages: 'IDを入力してください。'});
            return;
        }
        if(this.state.name === ''){
            this.setState({alert_messages: '名称を入力してください。'});
            return;
        }

        if(this.props.modal_data !== null){
            this.setState({
                confirm_message: this.state.title + "マスタ情報を変更しますか?",
                confirm_action: "register"
            });
        } else {
            this.setState({
                confirm_message: this.state.title + "マスタ情報を登録しますか?",
                confirm_action: "register"
            });
        }
    };

    register = () => {
        this.registerMaster();
    }
    
    confirmCancel() {
        this.setState({
            confirm_message: "",
            confirm_alert_title: "",
            confirm_action: "",
            alert_messages: "",
            alert_action: ""
        });
        if (this.state.alert_action === "close") {
            this.props.handleOk();
        }
    }
    getItemCategoryID = e => {
        this.setState({item_category_id:e.target.id});
    }
    
    confirmOk = () => {
        this.confirmCancel();
        if (this.state.confirm_action === "close") {
            this.props.closeModal();
        } else if (this.state.confirm_action === "register") {
            this.register();
        }
    }
    
    closeModal = () => {
        if(this.change_flag == 1) {
            this.setState({
                confirm_message: "登録していない内容があります。\n変更内容を破棄して移動しますか？",
                confirm_alert_title:'入力中',
                confirm_action: "close"
            });
            return;
        } else {
            this.props.closeModal();
        }
    }

    render() {        
        return  (
            <Modal show={true} id="add_contact_dlg"  className="medicine-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>{this.state.title}マスタ{this.state.modal_data!=null?'編集':'登録'}</Modal.Title>
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
                                label={this.state.title+"ID"}
                                value={this.state.id}
                                disabled = {this.props.modal_data!=null?true:false}
                                getInputText={this.getMasterID.bind(this)}
                                inputmode="numeric"
                            />

                            <NumericInputWithUnitLabel
                                label="表示順"                                
                                value={this.state.order}
                                getInputText={this.getOrder.bind(this)}
                                inputmode="numeric"
                            />

                        </div>                        
                        <InputWithLabel
                            label={this.state.title + "名"}
                            type="text"
                            className="name-area"
                            getInputText={this.getName.bind(this)}
                            diseaseEditData={this.state.name}
                        />
                        {this.props.modal_type == 3 && (
                        <>
                            {this.state.item_category_list != undefined && this.state.item_category_list != null && (
                                <>
                                <div className='category'>
                                    <SelectorWithLabel
                                        options={this.state.item_category_list}
                                        title='品名分類'
                                        getSelect={this.getItemCategoryID}
                                        departmentEditCode={this.state.item_category_id}
                                    />
                                </div>
                                </>
                            )}
                            <div>
                                <InputWithLabel
                                    label="会計用キー"
                                    type="text"
                                    getInputText={this.getReceiptKey.bind(this)}
                                    diseaseEditData={this.state.receipt_key}
                                />
                            </div>
                            <div>
                                <InputWithLabel
                                    label="主単位名"
                                    type="text"
                                    getInputText={this.getMainUnit.bind(this)}
                                    diseaseEditData={this.state.main_unit}
                                />
                            </div>
                            <table className="table table-bordered table-striped table-hover mt-2">
                                <thead>
                                    <th/>
                                    <th className="text-center">単位ID</th>
                                    <th className="text-center">単位名</th>
                                    <th className="text-center">会計用倍率</th>
                                </thead>
                                <tbody id="unit-table">
                                {this.state.units != undefined && this.state.units != null && this.state.units.length>0 && (
                                    this.state.units.map((item, index) => {
                                        return(
                                            <>
                                                <tr>
                                                    <td><span className="delete_icon" onClick={this.deleteUnit.bind(this, index)}><Icon icon={faMinusCircle} /></span></td>
                                                    <td>{item.unit_id}</td>                                                    
                                                    <td>{item.name}</td>
                                                    <td>{item.receipt_magnification}</td>
                                                </tr>
                                            </>
                                        )
                                    })        
                                )}
                                </tbody>
                            </table>
                            <div className="flex unit-group">
                                <div className="unit_id">
                                    <NumericInputWithUnitLabel
                                        label="単位ID"
                                        value={this.state.unit_id}
                                        getInputText={this.getUnitID.bind(this)}
                                        inputmode="numeric"
                                    />                                    
                                </div>
                                <div className='unit_name'>                                    
                                    <InputWithLabel
                                        label="単位名"
                                        type="text"
                                        getInputText={this.getUnitName.bind(this)}
                                        diseaseEditData={this.state.unit_name}
                                    />
                                </div>
                                <div className='unit_ratio'>
                                    <InputWithLabel
                                        label="会計用倍率"
                                        type="number"
                                        getInputText={this.getRatio.bind(this)}
                                        diseaseEditData={this.state.receipt_magnification}
                                    />
                                </div>
                                <div className='plus-unit'>
                                    <span onClick={this.addUnitGroup.bind(this)}><Icon icon={faPlus} />単位追加</span>
                                </div>                                
                            </div>
                        </>
                        )}
                    </Wrapper>
                    {this.state.confirm_message !== "" && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.confirmOk.bind(this)}
                            confirmTitle= {this.state.confirm_message}
                            title={this.state.confirm_alert_title}
                        />
                    )}
                    {this.state.alert_messages !== "" && (
                      <AlertNoFocusModal
                        hideModal= {this.confirmCancel.bind(this)}
                        handleOk= {this.confirmCancel.bind(this)}
                        showMedicineContent= {this.state.alert_messages}
                      />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel-btn" onClick={this.closeModal}>閉じる</Button>
                    <Button className={this.change_flag == 1 ? "red-btn" :"disable-btn"} onClick={this.handleOk}>{this.props.modal_data !== null ? "変更" : "登録"}</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

TreatModal.contextType = Context;

TreatModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk:   PropTypes.func,    
    modal_data:PropTypes.object,
    modal_type : PropTypes.number,
};

export default TreatModal;