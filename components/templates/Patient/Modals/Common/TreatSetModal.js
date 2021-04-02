import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as apiClient from "~/api/apiClient";
import SelectPannelHarukaModal from "../Common/SelectPannelHarukaModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import axios from "axios/index";
import Radiobox from "~/components/molecules/Radiobox";
import {toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const Wrapper = styled.div`
    width: 100%;
    overflow-y: auto;
    .flex{
        display:flex;
    }
    .main-value {
        .label-title {
            width: 5rem;
            font-size: 1rem;
            line-height: 2rem;
            text-align: right;
            margin-top: 0;
            margin-bottom: 0;
        }
        div {
          margin-top: 0;
        }
        .checkbox_area {
            padding-left: 1rem;
            height: 2rem;
            label{
                font-size: 1rem;
                line-height: 2rem;
            }
            input {
                height: 1.1rem;
            }
        }
        input {
            width: calc(100% - 5rem);
            font-size: 1rem;
            height: 2rem;
        }
        .label-unit {display:none;}
        .form-control {width: 4rem !important;}
    }
    .selected, .selected:hover{
        background:lightblue!important;
    }
    .set-detail-area {
        width: 100%;
        margin-top:0.25rem;
        td{padding:0;}
        .table-menu {
            background-color: #e2caff;
        }
        .td-no {
            background-color: #e2caff;
        }
        td {
            vertical-align: middle;
        }
        .td-check {
          text-align: center;
            label {
                margin-right: 0;
            }
        }
        .pullbox-label {
            width: 100%;
            margin: 0;
        }
        .label-title {
            width: 0;
            margin: 0;
        }
        .label-unit {
            width: 0;
            margin: 0;
        }
        .select-unit {
            select{width:100%;}
        }
        .select-class{
          .pullbox-select{
            width:100%;
            height:2rem;
          }
        }
        .input-lot {
            input {
                ime-mode: inactive;
                width: 8rem;
            }
        }
        .input-comment {
          input {
           width: 10rem;
          }
        }
        .input-td {
          div {
            margin-top: 0;
          }
          input {
            height: 2rem;
          }
        }
        button {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 2rem;
        }
    }
    .comment-area{
        .label-title {
            width: 35rem;
            font-size: 1rem;
            line-height:2rem;
            margin-top: 0;
            margin-bottom: 0;
        }
        input {
          height: 2rem;
          font-size: 1rem;
        }
        div {
          margin-top: 0;
        }
        .clear-button {
            min-width: 2rem !important;
            height: 2rem !important;
            width: 2rem !important;
            background-color: buttonface;
            border: 1px solid #7e7e7e;
            padding: 0 !important;
            span{
              color:black;
              font-size: 1rem !important;
            }
        }
    }
    .mt5{margin-top:5px;}
    .select-btn {
        button {
          padding: 0.5rem 1rem;
            margin-right: 5px;
            span {
              font-size: 0.875rem;
            }
        }
    }
    .work-list{
        height: 12rem;
        width: 100%;
        margin-top:0.25rem;
        margin-bottom: 1rem;
        .area-1 {
            height: 100%;
            margin-right: 3px;
            .title{
                text-align: center;
                font-size: 1rem;
                background-color: #a0ebff;
                border: solid 1px lightgray;
                border-bottom: none;
            }
            .content{
                height: 90%;
                border:1px solid lightgray;
                p {
                    margin: 0;
                    cursor: pointer;
                    padding-left: 5px;
                }
                p:hover {
                    background-color: rgb(246, 252, 253);
                }
                overflow-y:auto;
            }
        }
    }
    .practice-search {
        width: 50%;
        text-align: right;
        button {
          padding: 0.5rem 1rem;
        }
        span {
          font-size: 0.875rem;
        }
    }
    .select-radio {
      display: flex;
      label {
        display: flex;
        font-size: 1rem;
        line-height: 2rem;
      }
    }
 `;

class TreatSetModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    let set_detail = [
      { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "", comment: '' },
      { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "", comment: '' },
      { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "", comment: '' },
      { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "", comment: '' },
      { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "", comment: '' },
      { number: 0, check: 0, classfic: 0, classfic_name:'', item_id: 0, item_name: "", count: "", unit_id: 0, unit_name: "", main_unit: "", lot: "", comment: '' },
    ];
    let detail_unit = [
      [{ id: 0, value: "" },],
      [{ id: 0, value: "" },],
      [{ id: 0, value: "" },],
      [{ id: 0, value: "" },],
      [{ id: 0, value: "" },],
      [{ id: 0, value: "" },]
    ];
    this.state = {
      number:modal_data != null ? modal_data.number : 0,
      id:modal_data != null ? modal_data.treat_set_detail_id : '',
      is_enabled:modal_data != null ? modal_data.is_enabled : 1,
      use_flag:modal_data != null ? modal_data.use_flag : 0,
      name:modal_data != null ? modal_data.treat_set_name : '',
      classification_id:modal_data != null ? modal_data.classification_id : 0,
      practice_id:modal_data != null ? modal_data.practice_id : 0,
      free_comment:modal_data != null ? modal_data.free_comment : '',
      sort_number:modal_data != null ? modal_data.sort_number : 0,
      is_auto_deployment:modal_data != null ? modal_data.is_auto_deployment : 0,
      confirm_message:"",
      alert_messages:"",
      isPracticeSelectModal:false,
      isItemSelectModal:false,
      set_detail,
      detail_unit,
      cur_index:0,
      item_count:[0,1,2,3,4,5],
      treat_dtail_item:[],
      item_categories:[{ id: 0, value: ""},],
      practice_name:'',
    }
    this.change_flag = 0;
  }
  
  async componentDidMount() {
    let path = "/app/api/v2/master/treat";
    let post_data = {
      treat_id: this.state.treat_id,
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if (res) {
          let set_detail = this.state.set_detail;
          let detail_unit = this.state.detail_unit;
          if(res.treat_item_unit.length >0){
            Object.keys(set_detail).map((index) => {
              if (set_detail[index]['item_id'] !== 0) {
                res.treat_item_unit.map(item=>{
                  if(item.item_id === set_detail[index]['item_id']){
                    detail_unit[index].push({id:item.unit_id, value: item.name})
                  }
                })
              }
            });
          }
          this.setState({
            all_data:res,
            classification_master:res.treat_classification,
            treat_item_unit:res.treat_item_unit,
            treat_item:res.treat_item,
            detail_unit,
          });
        }
      })
      .catch(() => {
      });
    
    let item_categories = this.state.item_categories;
    let item_categories_name = [];
    path = "/app/api/v2/order/treat/getItemCategories";
    post_data = {};
    let { data } = await axios.post(path, {params: post_data});
    if(data.length){
      data.map((item, index)=>{
        item_categories[index + 1] = {id: item.item_category_id, value: item.name};
        item_categories_name[item.item_category_id] = item.name;
      });
    }
    let set_detail = this.state.set_detail;
    if(this.props.modal_data != null && this.props.modal_data.treat_dtail_item.length > 0){
      this.props.modal_data.treat_dtail_item.map((item, index)=>{
        let detail = {};
        detail['number'] = item.number;
        detail['check'] = 1;
        detail['classfic'] = item.item_category_id;
        if((Object.keys(item_categories_name).length > 0) && item_categories_name[item.item_category_id] !== undefined){
          detail['classfic_name'] =  item_categories_name[item.item_category_id];
        } else {
          detail['classfic_name'] =  '';
        }
        detail['item_id'] = item.item_id;
        detail['item_name'] = item.name;
        detail['count'] = item.count != null ? item.count : 0;
        detail['unit_id'] = item.unit_id != null ? item.unit_id : 0;
        detail['unit_name'] = item.unit_id != null ? item.unit_id : '';
        detail['main_unit'] = item.main_unit != null ? item.main_unit : '';
        detail['lot'] = item.lot != null ? item.lot : '';
        detail['comment'] = item.comment != null ? item.comment : '';
        set_detail[index] = detail;
      })
    }
    this.setState({
      item_categories,
      set_detail,
    });
    if(this.props.modal_data != null){
      this.selectClassification(this.state.classification_id);
      this.selectPractice(this.props.modal_data.practice_id);
    }
  }
  
  setCheckValue = (name, value) => {
    this.setState({[name]: value});
    this.change_flag = 1;
  };
  
  getMasterID = e => {
    this.change_flag = 1;
    this.setState({id:e.target.value})
  };
  
  getName = e => {
    this.change_flag = 1;
    this.setState({name: e.target.value})
  };
  
  selectClassification = (id) => {
    let master_data = this.state.all_data.treat_practice;
    let filteredArray = master_data.filter(item => {
      if (item.classification_id === id) return item;
    });
    this.change_flag = 1;
    this.setState({
      classification_id: id,
      practice_master:filteredArray,
      practice_id: 0,
    })
  };
  
  selectPractice = (id) => {
    this.change_flag = 1;
    this.setState({practice_id: id})
  };
  
  openPracticeSelectModal = () => {
    this.setState({
      isPracticeSelectModal:true,
    })
  };
  
  closeModal = () => {
    this.setState({
      isPracticeSelectModal:false,
      isItemSelectModal: false,
    });
  };
  
  setPractice=(data)=>{
    this.closeModal();
    this.selectClassification(data['classification_id']);
    this.change_flag = 1;
    this.selectPractice(data['practice_id']);
  };
  
  handleOk = () => {
    if (this.change_flag == 0) return;
    if(this.state.id === ''){
      this.setState({alert_messages: 'セットIDを入力してください。'});
      return;
    }
    if(this.state.name === ''){
      this.setState({alert_messages: 'セット名を入力してください。'});
      return;
    }
    if(this.state.classification_id === 0){
      this.setState({alert_messages: '分類を選択してください。'});
      return;
    }
    if(this.state.practice_id === 0){
      this.setState({alert_messages: '行為名を選択してください。'});
      return;
    }
    
    let treat_dtail_item = [];
    let validate_res = true;
    Object.keys(this.state.set_detail).map((index) => {
      if (this.state.set_detail[index]['check'] === 1) {
        if(this.state.set_detail[index]['count'] != null && this.state.set_detail[index]['count'] !== "" && (this.state.set_detail[index]['count'] > 1000000 || this.state.set_detail[index]['count'] < 0)){
          validate_res = false;
          this.setState({alert_messages: '個別指示項目の数量を正確に入力してください。'});
          return;
        }
        if(this.state.set_detail[index]['lot'] != null && this.state.set_detail[index]['lot'] !== "") {
          if (!this.state.set_detail[index]['lot'].match(/^[A-Za-z0-9]*$/)) {
            validate_res = false;
            this.setState({alert_messages: '個別指示項目のロットを半角英数で入力してください。'});
            return;
          }
        }
      }
      treat_dtail_item.push(this.state.set_detail[index]);
    });
    if(!validate_res){
      return;
    }
    this.setState({
      treat_dtail_item,
    }, ()=>{
      if(this.props.modal_data !== null){
        this.setState({
          confirm_message: "処置セットマスタ情報を変更しますか?",
          confirm_action: "register"
        });
      } else {
        this.setState({
          confirm_message: "処置セットマスタ情報を登録しますか?",
          confirm_action: "register"
        });
      }
    });
  };
  
  register =async()=> {
    this.confirmCancel();
    let post_data = {
      number:this.state.number,
      department_id: 0,
      treat_set_detail_id: this.state.id,
      treat_set_name: this.state.name,
      classification_id: this.state.classification_id,
      practice_id: this.state.practice_id,
      free_comment: this.state.free_comment,
      is_enabled: this.state.is_enabled,
      use_flag: this.state.use_flag,
      sort_number: this.state.sort_number,
      is_auto_deployment: this.state.is_auto_deployment,
      treat_dtail_item: this.state.treat_dtail_item,
    };
    
    let path = "/app/api/v2/master/treat/registerTreatSet";
    apiClient.post(path, {
      params: post_data
    }).then(() => {
      let alert_messages = this.props.modal_data !== undefined && this.props.modal_data != null ? "変更しました。": "登録しました。";
      this.setState({alert_messages, alert_action: "close"});
    });
  }
  
  getRadio = (name, index) => {
    if (name === "check") {
      let set_detail = this.state.set_detail;
      if(set_detail[index]['item_id'] === 0){
        this.setState({alert_messages: "品名を入力してください。"});
        return;
      }
      if(set_detail[index]['check']){
        set_detail[index]['check'] = 0;
      } else {
        set_detail[index]['check'] = 1;
      }
      this.change_flag = 1;
      this.setState({set_detail});
    }
  };
  
  getCount =(index, e)=>{
    let set_detail = this.state.set_detail;
    set_detail[index]['count'] = e;
    this.setState({set_detail});
    this.change_flag = 1;
  }
  
  getLot =(index, e)=>{
    let set_detail = this.state.set_detail;
    set_detail[index]['lot'] = e.target.value;
    this.setState({set_detail});
    this.change_flag = 1;
  }
  getFreeComment =(index, e)=>{
    let set_detail = this.state.set_detail;
    set_detail[index]['comment'] = e.target.value;
    this.setState({set_detail});
    this.change_flag = 1;
  }
  
  setItemName = (data) => {
    let set_detail = this.state.set_detail;
    set_detail[this.state.cur_index]['check'] = 1;
    set_detail[this.state.cur_index]['classfic'] = data.treat_item_category_id;
    set_detail[this.state.cur_index]['classfic_name'] = (this.state.item_categories.find(x => x.id === data.treat_item_category_id) != undefined) ? this.state.item_categories.find(x => x.id === data.treat_item_category_id).value : '';
    set_detail[this.state.cur_index]['item_id'] = data.item_id;
    set_detail[this.state.cur_index]['unit_id'] = 0;
    set_detail[this.state.cur_index]['item_name'] = data.name;
    set_detail[this.state.cur_index]['main_unit'] = data.main_unit;
    set_detail[this.state.cur_index]['receipt_key'] = data.receipt_key;
    let detail_unit = this.state.detail_unit;
    if(this.state.treat_item_unit.length >0){
      this.state.treat_item_unit.map(item=>{
        if(item.item_id === data.item_id){
          detail_unit[this.state.cur_index].push({id:item.unit_id, value: item.name})
        }
      })
    }
    this.setState({set_detail, detail_unit});
    this.change_flag = 1;
    this.closeModal();
  };
  
  getUnitId =(index, e)=>{
    let set_detail = this.state.set_detail;
    set_detail[index]['unit_id'] = e.target.id;
    set_detail[index]['unit_name'] = e.target.value;
    this.setState({set_detail});
    this.change_flag = 1;
  }
  
  selectAllSetDetail =()=>{
    let set_detail = this.state.set_detail;
    let select_count = 0;
    Object.keys(this.state.set_detail).map((index) => {
      if(set_detail[index]['item_id'] !== 0){
        set_detail[index]['check'] = 1;
        select_count ++;
      }
    });
    if(select_count){
      this.setState({set_detail});
      this.change_flag = 1;
    } else {
      this.setState({alert_messages: "個別指示項目の品名を入力してください。"});
      return;
    }
  }
  
  unSelectAllSetDetail =()=>{
    let set_detail = this.state.set_detail;
    Object.keys(this.state.set_detail).map((index) => {
      set_detail[index]['check'] = 0;
    });
    this.setState({set_detail});
    this.change_flag = 1;
  }
  
  openItemSelectModal = (value) => {
    this.setState({
      isItemSelectModal: true,
      cur_index: value,
    })
  };
  
  getComment = e => {
    if (e.target.value.length > 25) {
      this.setState({alert_messages:"処置フリーコメントは全角25文字以上入力できません。"});
      return;
    }
    this.setState({free_comment: e.target.value});
    this.change_flag = 1;
  };
  
  clearComment = () => {
    this.setState({free_comment: ""})
  };
  
  getItemCategory =(index, e)=>{
    let set_detail = this.state.set_detail;
    set_detail[index]['classfic'] = e.target.id;
    this.setState({set_detail});
    this.change_flag = 1;
  }
  
  setRadioState = (e) => {
    this.setState({use_flag:parseInt(e.target.value)});
    this.change_flag = 1;
  }
  
  setSortNumber =(e)=>{
    let RegExp = /^[0-9０-９]*$/;
    if(e === null){e = "";}
    if (e !== "" && !RegExp.test(e)){
      this.setState({sort_number: this.state.sort_number});
    } else {
      this.setState({sort_number: toHalfWidthOnlyNumber(e)});
    }
    this.change_flag = 1;
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
  confirmOk = () => {
    this.confirmCancel();
    if (this.state.confirm_action === "close") {
      this.props.closeModal();
    } else if (this.state.confirm_action === "register") {
      this.register();
    }
  }
  
  maincloseModal = () => {
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
    let {classification_master, practice_master} = this.state;
    return  (
      <Modal show={true} id=""  className="treat-set-master-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>処置セット{this.props.modal_data != null ? '編集' : '登録'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className={'main-value flex'}>
              <InputWithLabel
                label={'セットID'}
                type="number"
                getInputText={this.getMasterID.bind(this)}
                isDisabled = {this.props.modal_data != null ? true:false}
                diseaseEditData={this.state.id}
              />
              <InputWithLabel
                label={'セット名'}
                type="text"
                className="name-area"
                getInputText={this.getName.bind(this)}
                diseaseEditData={this.state.name}
              />
              <div className="checkbox_area flex">
                <Checkbox
                  label="常に表示"
                  getRadio={this.setCheckValue.bind(this)}
                  value={this.state.is_enabled}
                  checked = {this.state.is_enabled === 1}
                  name="is_enabled"
                />
              </div>
              <div className={'select-radio'}>
                <Radiobox
                  label={'個別指示'}
                  value={0}
                  getUsage={this.setRadioState.bind(this)}
                  checked={this.state.use_flag === 0}
                  name={`use_flag`}
                />
                <Radiobox
                  label={'実施情報'}
                  value={1}
                  getUsage={this.setRadioState.bind(this)}
                  checked={this.state.use_flag === 1}
                  name={`use_flag`}
                />
                <Radiobox
                  label={'共通'}
                  value={2}
                  getUsage={this.setRadioState.bind(this)}
                  checked={this.state.use_flag === 2}
                  name={`use_flag`}
                />
              </div>
              <NumericInputWithUnitLabel
                label={'表示順'}
                className="form-control"
                value={this.state.sort_number}
                getInputText={this.setSortNumber.bind(this)}
                inputmode="numeric"
              />
              <div className="checkbox_area flex">
                <Checkbox
                  label="自動展開"
                  getRadio={this.setCheckValue.bind(this)}
                  value={this.state.is_auto_deployment}
                  checked = {this.state.is_auto_deployment === 1}
                  name="is_auto_deployment"
                />
              </div>
            </div>
            <div className={'practice-search mt-2'}>
              <Button className="ml-2" onClick={this.openPracticeSelectModal.bind(this)}>行為名検索</Button>
            </div>
            <div className="flex work-list">
              <div className="area-1" style={{width:"20%"}}>
                <div className="title">分類</div>
                <div className="content">
                  {classification_master !== undefined && classification_master.length>0 && (
                    classification_master.map(item => {
                      return (
                        <p className={item.classification_id === this.state.classification_id ? "selected" : ""}
                           onClick = {this.selectClassification.bind(this, item.classification_id)}
                           key = {item.id}>{item.name}</p>
                      )
                    })
                  )}
                </div>
              </div>
              <div className="area-1" style={{width:"30%"}}>
                <div className="title">行為名</div>
                <div className="content">
                  {practice_master !== undefined && practice_master.length>0 && (
                    practice_master.map(item => {
                      return (
                        <p className={item.practice_id===this.state.practice_id ? "selected" : ""}
                           onClick = {this.selectPractice.bind(this, item.practice_id)} key = {item.id}
                        >{item.name}</p>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="mr-1">個別指示項目</div>
              <div>【実施時間の入力方法】整数部に時間を小数部に分を入力してください。例⇒30分＝0.3、１時間50分＝1.5</div>
            </div>
            <div className="flex select-btn mt5">
              <Button onClick={this.selectAllSetDetail.bind(this)}>全選択</Button>
              <Button onClick={this.unSelectAllSetDetail.bind(this)}>全解除</Button>
            </div>
            <div className={'set-detail-area'}>
              <table className="table-scroll table table-bordered mt5" id="code-table">
                <tr className={'table-menu'}>
                  <td style={{width:"30px"}}/>
                  <td className="text-center" style={{width:"5rem"}}>チェック</td>
                  <td className="text-center" style={{width:"12rem"}}>分類</td>
                  <td className="text-center" style={{width:"4rem"}}>検索</td>
                  <td className="text-center">品名/名称</td>
                  <td className="text-center" style={{width:"105px"}}>数量</td>
                  <td className="text-center" style={{width:"105px"}}>単位</td>
                  <td className="text-center" style={{width:"8rem"}}>ロット</td>
                  <td className="text-center" style={{width:"10rem"}}>フリーコメント</td>
                </tr>
                {this.state.item_count.map(index=>{
                  return (
                    <tr key={index}>
                      <td className="text-center td-no">{index + 1}</td>
                      <td className="td-check">
                        <Checkbox
                          label=""
                          number={index}
                          getRadio={this.getRadio.bind(this)}
                          value={this.state.set_detail[index]['check']}
                          name="check"
                        />
                      </td>
                      <td className="text-center select-class">
                        {this.state.set_detail[index]['item_id'] !== 0 ? (
                          <div className="text-center">{this.state.set_detail[index]['classfic_name']}</div>
                        ) : (
                          <SelectorWithLabel
                            title=""
                            options={this.state.item_categories}
                            getSelect={this.getItemCategory.bind(this, index)}
                            departmentEditCode={this.state.set_detail[index]['classfic']}
                          />
                        )}
                      </td>
                      <td className="text-center">
                        <div className="w-100">
                          <Button type="common" onClick={this.openItemSelectModal.bind(this,index)}>検索</Button>
                        </div>
                      </td>
                      <td className="text-center">{this.state.set_detail[index]['item_name']}</td>
                      <td className="text-center input-td">
                        <NumericInputWithUnitLabel
                          className="form-control"
                          value={this.state.set_detail[index]['count']}
                          getInputText={this.getCount.bind(this, index)}
                          inputmode="numeric"
                        />
                      </td>
                      <td className="text-center select-unit">
                        {this.state.detail_unit[index] !== undefined && Object.keys(this.state.detail_unit[index]).length > 1 ? (
                          <SelectorWithLabel
                            options={this.state.detail_unit[index]}
                            title=""
                            getSelect={this.getUnitId.bind(this, index)}
                            departmentEditCode={this.state.set_detail[index]['unit_id']}
                          />
                        ) : (
                          <div className="text-center">{this.state.set_detail[index]['main_unit']}</div>
                        )}
                      </td>
                      <td className="input-td input-lot">
                        <InputWithLabel
                          label=""
                          type="text"
                          getInputText={this.getLot.bind(this, index)}
                          diseaseEditData={this.state.set_detail[index]['lot']}
                        />
                      </td>
                      <td className="input-td input-comment">
                        <InputWithLabel
                          label=""
                          type="text"
                          getInputText={this.getFreeComment.bind(this, index)}
                          diseaseEditData={this.state.set_detail[index]['comment']}
                        />
                      </td>
                    </tr>
                  )
                })}
              </table>
            </div>
            <div className="flex comment-area mt5">
              <InputWithLabel
                label="処置フリーコメント（全角25文字まで）"
                type="text"
                getInputText={this.getComment.bind(this)}
                diseaseEditData={this.state.free_comment}
              />
              <Button className="clear-button ml-2" onClick={this.clearComment.bind(this)}>C</Button>
            </div>
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
          {this.state.isPracticeSelectModal && (
            <SelectPannelHarukaModal
              selectMaster = {this.setPractice}
              closeModal= {this.closeModal}
              MasterName= {'行為'}
            />
          )}
          {this.state.isItemSelectModal && (
            <SelectPannelHarukaModal
              selectMaster = {this.setItemName}
              closeModal= {this.closeModal}
              MasterName= {'品名'}
              item_category_id={this.state.set_detail[this.state.cur_index]['classfic']}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.maincloseModal}>キャンセル</Button>
          <Button className ={this.change_flag == 1 ? "red-btn":"disable-btn"} onClick={this.handleOk}>保存</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

TreatSetModal.contextType = Context;

TreatSetModal.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.array,
  handleOk: PropTypes.func,
};

export default TreatSetModal;