import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import {addRedBorder, removeRedBorder} from "~/helpers/dialConstants";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1rem;
  .flex{display: flex;}
  .input-div {
    div {margin-top:0;}
    .label-title {display:none;}
    input {
      width:20rem;
      font-size:1rem;
      height:2rem;
    }
  }
  .btn-area {
    margin-top:0.5rem;
    button {margin-right:0.5rem;}
  }
  .checkbox-area {
    margin-top:0.5rem;
    label {
      font-size:1rem;
      line-height:2rem;
    }
 }
 .table-area {
    margin-top:0.5rem;
    table {
      margin:0;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc(60vh - 24rem);
        width:100%;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
      }
      tr{
        display: table;
        width: 100%;
      }
      thead{
        display:table;
        width:100%;
        border-bottom: 1px solid #dee2e6;
        tr{width: calc(100% - 17px);}
      }
      td {
        padding: 0.3rem;
        word-break: break-all;
        font-size: 1rem;
        vertical-align: middle;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.25rem;
          font-size: 1rem;
          white-space:nowrap;
          border:1px solid #dee2e6;
          border-bottom:none;
          border-top:none;
          font-weight: normal;
      }
    }
    .td-check {
      width:3rem;
      text-align: center;
      label, input {
        margin: 0;
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

class DisplayConditionModal extends Component {
  constructor(props) {
    super(props);
    this.state={
      display_condition_id:props.display_condition_id,
      instruction_book_subcatergory_master:[],
      condition_name: "",
      default_condition_flag:false,
      simple_display_flag:false,
      only_current_valid_indication_flag:false,
      condition_detail:[],
      load_flag:false,
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:'',
      alert_messages:'',
      alert_type:'',
    };
    this.init_state = {
      condition_name: "",
      default_condition_flag:false,
      simple_display_flag:false,
      only_current_valid_indication_flag:false,
      condition_detail:[],
    };
  }
  
  async componentDidMount() {
    let path = "/app/api/v2/instruction_book/get/display_condition_info";
    let post_data = {
      display_condition_id:this.state.display_condition_id,
    };
    let instruction_book_subcatergory_master = [];
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        instruction_book_subcatergory_master = res.instruction_book_subcatergory_master;
        this.init_state = {
          condition_name:res.display_condition.name != undefined ? res.display_condition.name : "",
          default_condition_flag:res.display_condition.default_condition_flag != undefined ? res.display_condition.default_condition_flag : false,
          simple_display_flag:res.display_condition.simple_display_flag != undefined ? res.display_condition.simple_display_flag : false,
          only_current_valid_indication_flag:res.display_condition.only_current_valid_indication_flag != undefined ? res.display_condition.only_current_valid_indication_flag : false,
          condition_detail:res.condition_detail,
        };
      })
      .catch(() => {
      
      });
    let state_data = JSON.parse(JSON.stringify(this.init_state));
    state_data.load_flag = true;
    state_data.instruction_book_subcatergory_master = instruction_book_subcatergory_master;
    this.setState(state_data);
  }
  
  getConditionName = e => {
    this.setState({condition_name: e.target.value.length > 15 ? this.state.condition_name : e.target.value});
  };
  
  setDefaultCondition = (name, value) => {
    if(name == "default_condition_flag"){
      this.setState({default_condition_flag: value})
    }
  };
  
  selectSlipId =(name, number)=>{
    if(name == "condition_detail"){
      let condition_detail = this.state.condition_detail;
      let index = condition_detail.indexOf(number);
      if(index === -1){
        condition_detail.push(number);
      } else {
        condition_detail.splice(index, 1);
      }
      this.setState({
        condition_detail,
      });
    }
  };
  
  selectAll=(value)=>{
    let condition_detail = [];
    if(value){
      this.state.instruction_book_subcatergory_master.map(slip=>{
        condition_detail.push(slip.number);
      });
    }
    this.setState({condition_detail});
  }
  
  setFlag=(flag_name)=>{
    this.setState({[flag_name]:!this.state[flag_name]});
  }
  
  confirmClose=()=>{
    this.setState({
      confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
      confirm_type:"modal_close",
      confirm_alert_title:'入力中',
    });
  }
  
  closeModal=()=>{
    if(this.state.alert_type == "condition_search"){
      this.props.searchCondition();
    }
    removeRedBorder("condition_name_id");
    this.setState({
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
      alert_messages:"",
    });
  }
  
  confirmOk=()=>{
    removeRedBorder("condition_name_id");
    if(this.state.confirm_type == "modal_close"){
      this.props.closeModal();
    }
    if(this.state.confirm_type == "create" || this.state.confirm_type == "update"){
      this.register(this.state.confirm_type);
    }
    if(this.state.confirm_type == "delete"){
      this.delete();
    }
  }
  
  confrimSave=(act)=>{
    if(this.state.condition_name == ""){
      addRedBorder("condition_name_id");
      return;
    }
    this.setState({
      confirm_type:act,
      confirm_title:"保存確認",
      confirm_message:"表示条件を"+(act == "create" ? "登録" : "編集") + "しますか？",
    });
  }
  
  register=async(act)=>{
    this.setState({
      confirm_title:"",
      confirm_message:"",
      confirm_type:"",
      load_flag:false,
    });
    let path = "/app/api/v2/instruction_book/register/display_condition";
    let psot_data = {
      display_condition_id:act == "update" ? this.state.display_condition_id : 0,
      condition_name: this.state.condition_name,
      default_condition_flag:this.state.default_condition_flag ? 1 : 0,
      simple_display_flag:this.state.simple_display_flag ? 1 : 0,
      only_current_valid_indication_flag:this.state.only_current_valid_indication_flag,
      condition_detail:this.state.condition_detail,
    };
    await apiClient.post(path, {params: psot_data})
      .then(res => {
        this.setState({
          alert_messages:res.alert_message != undefined ? res.alert_message : res.error_message,
          alert_type:res.alert_message != undefined ? "condition_search" : "",
          load_flag:true,
        });
      })
      .catch(()=> {
      });
  }
  
  delete=async()=>{
    this.setState({
      confirm_title:"",
      confirm_message:"",
      confirm_type:"",
      load_flag:false,
    });
    let path = "/app/api/v2/instruction_book/delete/display_condition";
    let psot_data = {
      display_condition_id:this.state.display_condition_id,
    };
    await apiClient.post(path, {params: psot_data})
      .then(res => {
        this.setState({
          alert_messages:res.alert_message != undefined ? res.alert_message : res.error_message,
          alert_type:res.alert_message != undefined ? "condition_search" : "",
          load_flag:true,
        });
      })
      .catch(()=> {
      });
  }
  
  confirmDelete=()=>{
    if(this.state.display_condition_id == 0){return;}
    this.setState({
      confirm_type:"delete",
      confirm_title:"削除確認",
      confirm_message:"表示条件を削除しますか？",
    });
    }
  
  render() {
    let change_flag = false;
    if(this.state.load_flag){
      Object.keys(this.init_state).map((k) => {
        if(!change_flag && (k == "condition_detail")){
          if(this.init_state[k].length != this.state[k].length){
            change_flag = true;
          }
          if(!change_flag && this.init_state[k].length >0){
            this.init_state[k].map(value=>{
              if(!(this.state[k].includes(value))){
                change_flag = true;
              }
            });
          }
        } else {
          if (!change_flag && (this.init_state[k] !== this.state[k])) {
            change_flag = true;
          }
        }
      });
    }
    return (
      <>
        <Modal show={true} id="outpatient" className="custom-modal-sm dislay-condition-modal">
          <Modal.Header><Modal.Title>表示条件編集画面</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'input-div flex'}>
                <InputWithLabel
                  id="condition_name_id"
                  label=""
                  type="text"
                  getInputText={this.getConditionName.bind(this)}
                  diseaseEditData={this.state.condition_name}
                />
                <div style={{lineHeight:"2rem", marginLeft:"0.3rem"}}>※全角15文字まで</div>
              </div>
              <div className={'checkbox-area'}>
                <Checkbox
                  label="初期条件として保存する"
                  getRadio={this.setDefaultCondition.bind(this)}
                  value={this.state.default_condition_flag}
                  checked = {this.state.default_condition_flag === 1}
                  name="default_condition_flag"
                />
              </div>
              <div className={'btn-area flex'}>
                <button style={{backgroundColor:this.state.simple_display_flag ? "#FFA500" : ""}} onClick={this.setFlag.bind(this, 'simple_display_flag')}>簡易表示</button>
                <button style={{backgroundColor:this.state.only_current_valid_indication_flag ? "#FFA500" : ""}} onClick={this.setFlag.bind(this, 'only_current_valid_indication_flag')}>現在有効指示のみ</button>
              </div>
              <div className={'btn-area flex'}>
                <button onClick={this.selectAll.bind(this, true)}>全選択</button>
                <button onClick={this.selectAll.bind(this, false)}>全解除</button>
              </div>
              <div className={'table-area'}>
                <table className="table-scroll table table-bordered">
                  <thead>
                  <tr>
                    <th className={'td-check'}>表示</th>
                    <th>伝票表示</th>
                  </tr>
                  </thead>
                  <tbody>
                  {this.state.load_flag ? (
                    <>
                      {this.state.instruction_book_subcatergory_master.length > 0 && (
                        this.state.instruction_book_subcatergory_master.map(slip=>{
                          return (
                            <>
                              <tr>
                                <td className={'td-check'}>
                                  <Checkbox
                                    getRadio={this.selectSlipId.bind(this)}
                                    value={(this.state.condition_detail.includes(slip.number))}
                                    number={slip.number}
                                    name="condition_detail"
                                  />
                                </td>
                                <td>{slip.name}</td>
                              </tr>
                            </>
                          )
                        })
                      )}
                    </>
                  ):(
                    <>
                      <tr>
                        <td colSpan={'2'}>
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                        </td>
                      </tr>
                    </>
                  )}
                  </tbody>
                </table>
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            {change_flag ? (
              <>
                <Button className="cancel-btn" onClick={this.confirmClose}>キャンセル</Button>
              </>
            ):(
              <>
                <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
              </>
            )}
            <Button className={this.state.display_condition_id != 0 ? "delete-btn" : "disable-btn"} onClick={this.confirmDelete}>削除</Button>
            {(change_flag && this.state.display_condition_id != 0) ? (
              <>
                <Button className={'red-btn'} onClick={this.confrimSave.bind(this, "update")}>更新</Button>
              </>
            ):(
              <>
                <Button className={'disable-btn'}>更新</Button>
              </>
            )}
            {change_flag ? (
              <>
                <Button className={'red-btn'} onClick={this.confrimSave.bind(this, "create")}>新規保存</Button>
              </>
            ):(
              <>
                <Button className={'disable-btn'}>新規保存</Button>
              </>
            )}
          </Modal.Footer>
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title= {this.state.confirm_title}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal}
              handleOk= {this.closeModal}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>
      </>
    );
  }
}

DisplayConditionModal.propTypes = {
  closeModal: PropTypes.func,
  searchCondition: PropTypes.func,
  display_condition_id:PropTypes.number,
};

export default DisplayConditionModal;
