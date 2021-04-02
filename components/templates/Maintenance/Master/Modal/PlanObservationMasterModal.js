import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import InputKeyWord from "~/components/molecules/InputKeyWord";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Checkbox from "~/components/molecules/Checkbox";

const Wrapper = styled.div`
  width:100%;
  height: 100%;
  font-size:1rem;
  .search-word {
    .div-title {
      line-height: 2rem;
      width: 8rem;
    }
    input {
      font-size: 1rem;
      height:2rem;
      margin:0;
      width:20rem;
    }
    button {
      width:4rem;
      height:2rem;
      margin-left:0.5rem;
    }
    .checkbox{
      input{
        height:15px;
      }
      label{
        margin-left:20px;
        padding-top:0.3rem;
      }
    }
  }
  .comment-area {
    width: 40%;
    label {
     width: 0 ;
     margin: 0;
    }
    input {
        font-size: 1rem;
        height:2rem;
        margin:0;
    }
  }
  .comment-area {
    width: 100%;
    div {
      width:calc(100% - 4rem);
      div {display:none;}
    }
    input {
      width: 100%;
    }
    button {
      margin-left:0.5rem;
      width:4rem;
    }
  }
  .list-area {
    width: 20%;
    .title{
      margin-top: 0.5rem;
    }
    .content{
      height: 20rem;
      overflow-y: auto;
      border: solid 1px gray;
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
      padding: 0.2rem;
      div{
        cursor: pointer;
      }
    }
    .selected {
      background: lightblue;
    }
  }
  .move-btn-area{
    padding-top:14%;
    margin-left:2%;
    button{
      font-size:1.2rem;
    }
  }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class PlanObservationMasterModal extends Component {
  constructor(props) {
    super(props);
    var modal_data = this.props.modal_data;
    this.state = {
      search_word:'',
      tier_master_1st:[],
      tier_master_2nd:[],
      tier_master_3rd:[],
      tier_1st:[],
      tier_2nd:[],
      tier_3rd:[],
      first_number: '',
      second_number: '',
      third_number: '',
      third_name:"",
      comment: '',
      alert_messages: '',
      confirm_title:'',
      confirm_message:'',
      alert_title:'',
      isCloseConfirmModal:false,
      isUpdateConfirmModal:false,

      selected_observe_indics:[],

      progress_item_flg: modal_data !=null?modal_data.progress_item_flg:1,
    };
    this.change_flag = false;
  }

  componentDidMount () {    
    this.getMasterData('init');
  }

  onHide = () => {};

  getMasterData = async(option = null) => {
    let path = "/app/api/v2/nurse/get_elapsed_master";
    let post_data = {
      name:this.state.search_word,
      nurse_plan_master_id:this.props.modal_data.number,
    };
    if (this.state.is_loaded) this.setState({is_loaded: false});    
    await apiClient.post(path, post_data)
      .then((res) => {
        this.setState({
          tier_master_1st:res.tier_master_1st,
          tier_1st:res.tier_master_1st,
          tier_master_2nd:res.tier_master_2nd,
          tier_2nd:[],
          tier_master_3rd:res.tier_master_3rd,
          tier_3rd:[],
          observe_data_list: option == 'init'? res.observe_data_list : this.state.observe_data_list,
          first_number: '',
          first_name:'',
          second_number: '',
          second_name:'',
          third_number: '',
          third_name: '',
          is_loaded: true,
        }, () => {
          if (option == 'init'){
            if(res.observe_data_list == undefined || res.observe_data_list == null || res.observe_data_list.length == 0){
              this.setState({progress_item_flg:1});
            }

          }
        })
      });
  }

  getInputWord = e => {
    let search_input_obj = document.getElementById("search_input");
    let cur_caret_pos = search_input_obj.selectionStart;
    this.setState({search_word: e.target.value, cur_caret_pos:cur_caret_pos});
  };

  onClickInputWord = () => {
    let search_input_obj = document.getElementById("search_input");
    let cur_caret_pos = search_input_obj.selectionStart;
    this.setState({cur_caret_pos});
  };
  onInputKeyPressed = (e) => {
    if(e.keyCode === 13){
      this.getMasterData();
    }
  };
  getComment = e => {
    this.setState({comment: e.target.value});
  };
  selectFirstMaster = (item) =>{
    let tier_2nd = [];
    this.state.tier_master_2nd.map(second_item=>{
      if (second_item.tier_1st_id == item.number)
        tier_2nd.push(second_item);
    });
    this.setState({
      first_number: item.number,
      first_name : item.name,
      tier_2nd,
      tier_3rd:[],
      second_number:"",
      third_number:"",
      third_name:"",
    });
  };
  selectSecondMaster = (item) =>{
    let tier_3rd = [];
    this.state.tier_master_3rd.map(second_item=>{
      if (second_item.tier_2nd_id == item.number)
        tier_3rd.push(second_item);
    });
    this.setState({
      second_number: item.number,
      second_name:item.name,
      tier_3rd,
      third_number:"",
      third_name:"",
    });
  };
  selectThirdMaster = (item) =>{
    this.setState({
      third_number: item.number,
      third_name:item.name,
      result_type: item.result_type
    });
  };

  confirmOk = () =>{
    if(this.state.first_number == ""){
      this.setState({alert_messages: '第一階層を選択してください。'});
      return;
    }
    if(this.state.second_number == ""){
      this.setState({alert_messages: '第二階層を選択してください。'});
      return;
    }
    if(this.state.third_number == ""){
      this.setState({alert_messages: '第三階層を選択してください。'});
      return;
    }
    var observe_data_list = this.state.observe_data_list;
    if (observe_data_list == undefined || observe_data_list == null) observe_data_list = [];
    observe_data_list.push({
      tier_1st_id:this.state.first_number,
      first_name:this.state.first_name,
      tier_2nd_id:this.state.second_number,
      second_name:this.state.second_name,
      tier_3rd_id:this.state.third_number,
      third_name:this.state.third_name,
    })
    this.setState({observe_data_list});
    this.change_flag = true;
  }

  closeModal=()=>{
    this.setState({
      alert_messages: '',
      confirm_title:'',
      confirm_message:'',
      alert_title:'',
      isCloseConfirmModal:false,
      isUpdateConfirmModal:false,
    })
  }

  save = () => {
    if (this.change_flag != true) return;
    this.setState({
      isUpdateConfirmModal:true,
      confirm_message:'看護計画の観察項目を登録しますか？',
    })
  }

  confirmSave = async() => {
    this.closeModal();
    let path = "/app/api/v2/nurse/register_elapsed_master";
    let post_data = {
      data_list:this.state.observe_data_list,
      nurse_plan_master_id:this.props.modal_data.number,
      progress_item_flg: this.state.progress_item_flg,
    };
    await apiClient.post(path, post_data)
      .then((res) => {
        if (res.error_message != undefined){
          this.setState({alert_messages:res.error_message, alert_title:''});
        }
        if (res.ok_message != undefined){
          this.setState({alert_messages:res.ok_message, alert_title:'登録完了'});
          this.change_flag = false;
          this.props.closeModal();
          this.props.handleOk();
        }
      })
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

  selectObserveMaster = (select_index) => {
    var selected_observe_indics = this.state.selected_observe_indics;    
    var find_index = selected_observe_indics.indexOf(select_index);    
    if (find_index != -1){      
      selected_observe_indics.splice(find_index, 1);
    } else {
      selected_observe_indics.push(select_index)
    }
    this.setState({
      selected_observe_indics,
    }) 
  }

  deleteObserveList = (option = null) => {
    if (option == 'all'){
      this.setState({
        observe_data_list:[],
        selected_observe_indics:[],
      });
      this.change_flag = true;
    } else {
      var selected_observe_indics = this.state.selected_observe_indics;
      if (selected_observe_indics.length == 0){
        this.setState({
          alert_messages:'削除するレコードを選択してください。'
        })
        return;
      } else {
        this.change_flag = true;
        var observe_data_list = this.state.observe_data_list;
        observe_data_list = observe_data_list.filter(function(value,index){          
          return !selected_observe_indics.includes(index);
        })

        this.setState({
          observe_data_list,
          selected_observe_indics:[],
        })
      }
    }
  }

  getCheckBox = (name, value) => {
    this.setState({[name]:value});
    this.change_flag = true;
  }

  render() {
    let {tier_1st, tier_2nd, tier_3rd, observe_data_list} = this.state;    
    return (
      <>
        <Modal show={true} className="first-view-modal observation-edit-modal" onHide={this.onHide}>
          <Modal.Header><Modal.Title>看護計画観察項目マスタ</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className='main-header' style={{marginBottom:'5px'}}>
                <div>{this.props.selected_diagnosis_level_item.name}&nbsp;/&nbsp;{this.props.selected_diagnosis_item.name}</div>
                <div>{this.props.modal_data.name}</div>
              </div>
              <div className={'search-word flex'}>
                <div className={'div-title'}>検索キーワード</div>
                <InputKeyWord
                  id={'search_input'}
                  type="text"
                  label=""
                  onChange={this.getInputWord.bind(this)}
                  onKeyPressed={this.onInputKeyPressed}
                  onClick={this.onClickInputWord}
                  value={this.state.search_word}
                />
                <button onClick={this.getMasterData.bind(this)}>検索</button>
                <div className='checkbox'>
                  <Checkbox
                      label="有効化"
                      getRadio={this.getCheckBox.bind(this)}
                      value={this.state.progress_item_flg}
                      checked = {this.state.progress_item_flg ===1}
                      name="progress_item_flg"
                  />
                </div>                
              </div>
              {this.state.Load === false ? (
                <>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </>
              ) : (
                <div className="w-100 d-flex">
                  <div className="list-area">
                    <div className="title">第一階層</div>
                    <div className="content">
                      {tier_1st != undefined && tier_1st.length > 0 && tier_1st.map((item,index)=>{
                        return (
                          <div key={index} onClick={this.selectFirstMaster.bind(this, item)} className={this.state.first_number == item.number ? "selected" : ''}>
                            {item.name}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="list-area" style={{marginLeft:"5%"}}>
                    <div className="title">第二階層</div>
                    <div className="content">
                      {tier_2nd != undefined && tier_2nd.length > 0 && tier_2nd.map((item,index)=>{
                        return (
                          <div key={index} onClick={this.selectSecondMaster.bind(this, item)} className={this.state.second_number == item.number ? "selected" : ''}>
                            {item.name}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="list-area" style={{marginLeft:"5%"}}>
                    <div className="title">第三階層</div>
                    <div className="content">
                      {tier_3rd != undefined && tier_3rd.length > 0 && tier_3rd.map((item,index)=>{
                        return (
                          <div key={index} onClick={this.selectThirdMaster.bind(this, item)} className={this.state.third_number == item.number ? "selected" : ''}>
                            {item.name}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className='move-btn-area'>
                      <button onClick={this.confirmOk.bind(this)}>≫</button>
                  </div>
                  <div className="list-area" style={{marginLeft:"2%"}}>
                  <div className="title">観察項目</div>
                    <button className="" style={{marginRight:'0.5rem'}} onClick = {this.deleteObserveList.bind(this)}>選択削除</button>
                    <button className="" onClick = {this.deleteObserveList.bind(this, 'all')}>全削除</button>
                    <div className="content" style={{height:'17.5rem'}}>
                      {observe_data_list != undefined && observe_data_list != null && observe_data_list.length > 0 && observe_data_list.map((item,index)=>{
                        return (
                          <div key={index} onClick={this.selectObserveMaster.bind(this, index)} className={this.state.selected_observe_indics.includes(index) ? "selected" : ''}>
                            {item.first_name} / {item.second_name} / {item.third_name}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}              
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>            
            <Button className="cancel-btn" onClick={this.closeThisModal.bind(this)}>キャンセル</Button>
            <Button className={this.change_flag?'red-btn':'disable-btn'} onClick={this.save.bind(this)}>確定</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
              title = {this.state.alert_title}
            />
          )}
          {this.state.isUpdateConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmSave.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_title}
            />
          )}
          {this.state.isCloseConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.props.closeModal}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_title}
            />
          )}
        </Modal>
      </>
    );
  }
}

PlanObservationMasterModal.contextType = Context;
PlanObservationMasterModal.propTypes = {
  closeModal: PropTypes.func,
  setElapsedTitle: PropTypes.func,
  modal_data : PropTypes.object,
  selected_diagnosis_level_item : PropTypes.object,
  selected_diagnosis_item : PropTypes.object,
  handleOk: PropTypes.func
};

export default PlanObservationMasterModal;