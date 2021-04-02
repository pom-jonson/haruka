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
import Radiobox from "~/components/molecules/Radiobox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import EditAddItemModal from "./EditAddItemModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
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
  label {
    text-align: right;    
    font-size: 1rem;
    margin-bottom: 0px;
    margin-top: 0px;
  }
  input[type="text"] {
    width: 400px;
    font-size: 1rem;
    height: 2rem;
  }
  .label-title{
    height: 2rem;
    line-height: 2rem;
    width:100px;
  }
  .pullbox-title{
    height: 2rem;
    line-height: 2rem;
    margin-right: 8px !important;    
    font-size: 1rem;
  }
  .pullbox-select{
    height: 2rem;
    font-size: 1rem;
  }
  .react-datepicker-wrapper {
    width: 400px;
    .react-datepicker__input-container {
      width: 100%;
      input {
        font-size: 1rem;
        width: 100%;
        height: 2rem;
        border-radius: 4px;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 8px;
      }
    }
  }

  .checkbox-label {
    width: 30%;
    text-align: left;
  }
  .add-button {
    text-align: center;
  }
  .checkbox_area {    
    label {
      font-size: 1rem;
      text-align: left;
      margin-left: 110px;
      width: auto;
      height: 15px;
      line-height: 15px;
      input{
        font-size: 1rem;
        height: 15px !important;
      }
    }
  }
  .add-button {
      text-align: center;
      width:100%;
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
  .tr {    
    text-align:right;
  }
  table {
    margin-bottom:0px;
    thead{
      display:table;
      width:100%;
    }
    tbody{
      display:block;
      overflow-y: auto;
      height: 7rem;
      width:100%;
    }
    tr{
      display: table;
      width: 100%;
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
    td {
      word-break: break-all;
      padding: 0.25rem;
    }
    th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
    }
    .name{
      width:25rem;
    }    
  }
  .disabled{
    opacity: 0.7;
  }
  .block-area {
    font-size:1rem;
    border: 1px solid #aaa;
    padding: 10px;
    position: relative;
    margin-top:15px;
    label{
      font-size:1rem;
    }
  }
  .block-title {
    position: absolute;
    top: -10px;
    left: 10px;
    font-size: 1rem;
    background-color: white;
    padding-left: 5px;
    padding-right: 5px;
  }
  .numerical-area{
    div{
      margin-top:0;
    }    
    .label-title{
      margin-top:4px;
      width:3.5rem;
    }
    input{
      height:2rem;
      font-size:1rem;
    }
    .label-unit{
      display:none;
    }    
  }
  .right-box-area{
    position:absolute;
    right:8px;
    top:15px;
  }
  .radio-group{
    margin-bottom:10px;
  }
 `;

 const ContextMenuUl = styled.ul`
  margin-bottom:0;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
    width:180px;
  }
  .context-menu li {
    clear: both;
    width: 180px;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
    color:black;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({visible,x,y,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() =>parent.contextMenuAction("edit")}>変更</div></li>
          {/* <li><div onClick={() => parent.contextMenuAction("delete")}>削除</div></li> */}
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class EditObservationModal extends Component {
    constructor(props) {
        super(props);
        this.change_flag = false;

        let modal_data = this.props.modal_data;        
        this.state = {          

          is_enabled: modal_data != null?modal_data.is_enabled:1,
          is_always_available: modal_data != null?modal_data.is_always_available:0,
          result_2_is_enabled: modal_data != null?modal_data.result_2_is_enabled:0,
          number: modal_data != null ? modal_data.number : 0,
          order: modal_data != null ? modal_data.order : null,
          name : modal_data != null ? modal_data.name : '',
          tier_1st_id : this.props.selected_first_layer_number,
          tier_2nd_id : this.props.selected_second_layer_number,
          is_once_a_day: modal_data != null?modal_data.is_once_a_day:0,
          result_type:modal_data != null && modal_data.result_type != undefined ? modal_data.result_type : undefined,
          result_2_type:modal_data != null && modal_data.result_2_type != undefined ? modal_data.result_2_type : undefined,
          result_length:modal_data != null && modal_data.result_length != undefined ? modal_data.result_length : undefined,
          result_2_length:modal_data != null && modal_data.result_2_length != undefined ? modal_data.result_2_length : undefined,
          
          isUpdateConfirmModal: false,
          isDeleteConfirmModal:false,
          isCloseConfirmModal:false,
          confirm_message:"",
          isOpenAddItemModal:false,
          selected_add_item:null,
          alert_messages:''
       }
       this.double_click = false;
    }
    componentDidMount() {
      if (this.props.type == 3 && this.state.number > 0){
        this.getAddItem();
      }
    }

    getAddItem = async() => {
      this.confirmCancel();
      var path = "/app/api/v2/master/nurse/get_elapsed_select_item";
      var post_data = {
        params:{
          tier_1st_id:this.state.tier_1st_id,
          tier_2nd_id:this.state.tier_2nd_id,
          tier_3rd_id:this.state.number,
        }
      }
      await apiClient.post(path, post_data).then((res)=>{
        if (res.length != 0)
        this.setState({
          add_items:res[1],
          add_2_items:res[2],
        })
      })
    }

    async registerMaster()  {
      if (this.double_click == true) return;
      this.double_click = true;
        var path = '';
        const post_data = {
            params: this.state
        };
        switch(this.props.type){
          case 1:
            path = "/app/api/v2/master/nurse/register_first_elapsed_title";
            break;
          case 2:
            path = "/app/api/v2/master/nurse/register_second_elapsed_title";
            break;
          case 3:
            path = "/app/api/v2/master/nurse/register_third_elapsed_title";
            break;
        }
        
        await apiClient.post(path, post_data).then((res)=>{
          if (this.props.modal_data != null){            
            this.setState({alert_messages:'変更しました。'})
            this.props.handleOk();
          } else {            
            this.setState({alert_messages:'登録しました。'});
            this.props.handleOk(res.new_id);
          }
          this.change_flag = false;
        })
        .finally(() => {
          this.double_click = false;
        });
    }

    handleOk = () => {
      if (this.change_flag != true) return;
        if(this.state.name == undefined || this.state.name == null || this.state.name == ''){
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
            isDeleteConfirmModal:false,
            isCloseConfirmModal:false,
            confirm_message: "",
            isOpenAddItemModal:false,
            selected_add_item:null,
            alert_messages:'',
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

    setRadioState = (e) => {
      this.change_flag = 1;
      this.setState({[e.target.name]:parseInt(e.target.value)})
    }

    openAddItemModal = (target) => {
      if (this.props.modal_data == null) return;
      this.setState({
        isOpenAddItemModal:true,
        selected_add_item:null,
        selected_target:target,
      })
    }

    contextMenuAction = (act) => {
      if( act === "edit") {
        this.setState({
          isOpenAddItemModal:true,
        })
      } else if (act === "delete") {
        var name = '';
        if (this.state.selected_add_item != null) name = this.state.selected_add_item.name;
        this.setState({
          isDeleteConfirmModal : true,
          confirm_message:'「' + name +'」　' + "このマスタを削除しますか?",
        })
      }
    };

    deleteData = async() => {
      this.confirmCancel();
      var path = "/app/api/v2/master/nurse/delete_elapsed_select_item";
      var post_data = {params:{number: this.state.selected_add_item.number}}
      await apiClient.post(path, post_data).then(()=>{
        this.setState({alert_messages:'削除しました。'})        
        this.setState({selected_add_item:null})
      })
    }

    handleClick = (e, item, target) => {
      if (e.type === "contextmenu"){
        e.preventDefault();
        // eslint-disable-next-line consistent-this
        const that = this;
        document.addEventListener(`click`, function onClickOutside() {
          that.setState({ contextMenu: { visible: false } });
          document.removeEventListener(`click`, onClickOutside);
        });
        window.addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          window.removeEventListener(`scroll`, onScrollOutside);
        });
        document
          .getElementById("add-item-table")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("add-item-table")
              .removeEventListener(`scroll`, onScrollOutside);
            });
        var obj_modal = document.getElementById('edit-third-layer-modal');
        this.setState({
          contextMenu: {
            visible: true,
            x: e.clientX - obj_modal.offsetLeft,
            y: e.clientY - obj_modal.offsetTop,
          },
          selected_add_item:item,
          selected_target:target
        });
      }
    };

    render() {
      var title = '第一階層マスタ';
      if (this.props.type == 1) title = '第一階層マスタ';
      if (this.props.type == 2) title = '第二階層マスタ';
      if (this.props.type == 3) title = '第三階層マスタ';
        return  (
            <Modal show={true} id="edit-third-layer-modal"  className="medicine-modal first-view-modal">
                <Modal.Header>
                    <Modal.Title>{title}{this.props.modal_data != null?'編集':'登録'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div className="checkbox_area flex">
                            <div>
                              <Checkbox
                                label="有効化"
                                getRadio={this.getCheckBox.bind(this)}
                                value={this.state.is_enabled}
                                checked = {this.state.is_enabled == 1}
                                name="is_enabled"
                              />
                            </div>
                            <div className='numerical-area'>
                              <NumericInputWithUnitLabel
                                label="表示順"
                                value={this.state.order}
                                getInputText={this.getInputNumber.bind(this, 'order')}
                                inputmode="numeric"
                              />
                            </div>                            
                        </div>
                        <InputWithLabel
                            label={'名称'}
                            type="text"
                            className="name-area"
                            getInputText={this.getInputText.bind(this, 'name')}
                            diseaseEditData={this.state.name}
                        />
                        {this.props.type == 1 && (
                          <>
                          <div className= 'checkbox_area'>
                            <Checkbox
                                label="熱型表に常に表示する"
                                getRadio={this.getCheckBox.bind(this)}
                                value={this.state.is_always_available}
                                checked = {this.state.is_always_available == 1}
                                name="is_always_available"
                              />
                          </div>
                          </>
                        )}
                        {this.props.type == 3 && (
                          <>
                          <div className='block-area'>
                            <div className={'block-title'}>結果1</div>
                            <div className="radio-group flex" style={{marginLeft:'10px', marginTop:'10px'}}>
                              <Radiobox
                                label={'選択式'}
                                value={0}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.result_type === 0}
                                name={`result_type`}
                              />
                              <Radiobox
                                label={'テキスト式'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.result_type === 1}
                                name={`result_type`}
                              />
                              <Radiobox
                                label={'数値テキスト'}
                                value={2}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.result_type === 2}
                                name={`result_type`}
                              />
                              <div className='numerical-area right-box-area'>
                                <NumericInputWithUnitLabel
                                  label="文字数"
                                  value={this.state.result_length}
                                  getInputText={this.getInputNumber.bind(this, 'result_length')}
                                  inputmode="numeric"
                                />
                              </div>
                            </div>
                            <div className='radio-group' style={{marginLeft:'10px', marginTop:'10px'}}>
                              <label style={{marginRight:'10px'}}>1日の回数</label>
                              <Radiobox
                                label={'時間枠ごとに1回'}
                                value={0}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.is_once_a_day === 0}
                                name={`is_once_a_day`}
                              />
                              <Radiobox
                                label={'1日1回'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.is_once_a_day === 1}
                                name={`is_once_a_day`}
                              />
                            </div>
                            <div className='item-table'>
                              <div className={this.props.modal_data ==null?"tr disabled":'tr clickable'} onClick={this.openAddItemModal.bind(this, 1)}><Icon icon={faPlus} />追加</div>
                              <table className="table-scroll table table-bordered" id = 'add-item-table'>
                                <thead>
                                  <tr>
                                    <th className='name'>名称</th>
                                    <th>単位</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.result_type === 0 && this.state.add_items != undefined && this.state.add_items != null && this.state.add_items.length > 0 && (
                                    this.state.add_items.map(item => {
                                      return(
                                      <>
                                        <tr onContextMenu={e => this.handleClick(e,item, 1)}>
                                          <td className='name'>{item.name}</td>
                                          <td>{item.unit_name}</td>
                                        </tr>
                                      </>
                                      )
                                    })
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className='block-area'>
                            <div className={'block-title'}>結果2</div>
                            <div style={{paddingTop:'10px', marginLeft:'10px'}}>
                              <Checkbox
                                label="結果2を使用"
                                getRadio={this.getCheckBox.bind(this)}
                                value={this.state.result_2_is_enabled}
                                checked = {this.state.result_2_is_enabled == 1}
                                name="result_2_is_enabled"
                              />
                            </div>
                            <div className="radio-group flex" style={{marginLeft:'10px', marginTop:'10px'}}>
                              <Radiobox
                                label={'選択式'}
                                value={0}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.result_2_type === 0}
                                name={`result_2_type`}
                              />
                              <Radiobox
                                label={'テキスト式'}
                                value={1}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.result_2_type === 1}
                                name={`result_2_type`}
                              />
                              <Radiobox
                                label={'数値テキスト'}
                                value={2}
                                getUsage={this.setRadioState.bind(this)}
                                checked={this.state.result_2_type === 2}
                                name={`result_2_type`}
                              />
                              <div className='numerical-area right-box-area'>
                                <NumericInputWithUnitLabel
                                  label="文字数"
                                  value={this.state.result_2_length}
                                  getInputText={this.getInputNumber.bind(this, 'result_2_length')}
                                  inputmode="numeric"
                                />
                              </div>
                            </div>
                            <div className='item-table'>
                              <div className={this.props.modal_data ==null?"tr disabled":'tr clickable'} onClick={this.openAddItemModal.bind(this, 2)}><Icon icon={faPlus} />追加</div>
                              <table className="table-scroll table table-bordered" id = 'add-item-table'>
                                <thead>
                                  <tr>
                                    <th className='name'>名称</th>
                                    <th>単位</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.result_2_type === 0 && this.state.add_2_items != undefined && this.state.add_2_items != null && this.state.add_2_items.length > 0 && (
                                    this.state.add_2_items.map(item => {
                                      return(
                                      <>
                                        <tr onContextMenu={e => this.handleClick(e,item, 2)}>
                                          <td className='name'>{item.name}</td>
                                          <td>{item.unit_name}</td>
                                        </tr>
                                      </>
                                      )
                                    })
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          </>
                        )}
                    </Wrapper>                    
                    {this.state.isUpdateConfirmModal && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.register.bind(this)}
                            confirmTitle= {this.state.confirm_message}
                        />
                    )}
                    {this.state.isDeleteConfirmModal && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.deleteData.bind(this)}
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
                    {this.state.isOpenAddItemModal && (
                      <EditAddItemModal
                        closeModal = {this.confirmCancel.bind(this)}
                        handleOk = {this.getAddItem.bind(this)}
                        modal_data = {this.state.selected_add_item}
                        tier_1st_id = {this.props.selected_first_layer_number}
                        tier_2nd_id = {this.props.selected_second_layer_number}
                        tier_3rd_id = {this.state.number}
                        target = {this.state.selected_target}
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
                <ContextMenu
                  {...this.state.contextMenu}
                  parent={this}                  
                />
            </Modal>
        );
    }
}

EditObservationModal.contextType = Context;

EditObservationModal.propTypes = {
    closeModal : PropTypes.func,
    handleOk : PropTypes.func,
    modal_data : PropTypes.object,    
    type : PropTypes.string,
    selected_first_layer_number: PropTypes.number,
    selected_second_layer_number : PropTypes.number,    
};

export default EditObservationModal;
