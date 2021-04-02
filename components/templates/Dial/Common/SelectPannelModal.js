import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import InputKeywordBody from "~/components/templates/Dial/modals/InputKeywordBody";
import InputKeyWord from "~/components/molecules/InputKeyWord";
import * as methods from "../DialMethods";
import Button from "~/components/atoms/Button";
import {surface} from "~/components/_nano/colors";
import axios from "axios/index";
import RadioButton from "~/components/molecules/RadioInlineButton";
import Spinner from "react-bootstrap/Spinner";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const SpinnerWrapper = styled.div`
  height: 12.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Card = styled.div`
  position: relative;
  overflow: hidden;
  overflow-y: hidden;
  margin: 0px;
  float: left;
  width: 100%;
  height: 100%;
  background-color: ${surface};
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1rem;
  display: flex;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .left-area {
    height: 100%;
    width: 60%;
    .injection_type {
        font-size: 1rem;
        .radio-btn label{
            width: 5.625rem;
            border: solid 1px rgb(206, 212, 218);
            border-radius: 0.25rem;
            margin-right: 0.3rem;
            padding: 0.25rem 0.3rem;
            font-size: 1rem;
            line-height: 2rem;
        }
    }
    .medicine_type {
        font-size: 1rem;
        .radio-btn label{
            width: 3.75rem;
            border: solid 1px rgb(206, 212, 218);
            border-radius: 0.25rem;
            margin-right: 0.3rem;
            padding: 0.25rem 0.3rem;
            font-size: 1rem;
            line-height: 2rem;
        }
        .radio-btn:last-child {
            label {
                width: 6.875rem;
                line-height: 2rem;
            }
        }
        .disable-item{
            label{
                background: #ddd;
            }
        }
    }
    .history-list{
      // overflow-y: auto;
      font-size:1rem;
      border: 1px solid #aaa;

        // .table-area {
            height: 100%;
            margin-bottom:0;
            table {
                margin-bottom: 0;
                display: block;
            }
            thead{
              display: table;
              width:100%;
              margin-bottom: 0;
            }
            tbody{
              overflow-y:auto;
              display:block;
              height: calc(100% - 3.2rem);
              tr:nth-child(even) {background-color: #f2f2f2;}
              tr:hover{background-color:#e2e2e2 !important;}
            }
            tr{
              display: table;
              width: 100%;
              box-sizing: border-box;
            }
            td {
                padding: 0.25rem;
                text-align: left;
                font-size: 1rem;
            }
            th {
                text-align: center;
                padding: 0.3rem;
                font-size: 1.5rem;
                font-weight: normal;
            }
            .tl {
                text-align: left;
            }
            .tr {
                text-align: right;
            }
        // }
      .selected {
        background: rgb(105, 200, 225) !important;
        color: white;
      }
    }
  }
  .right-area {
    height: 100%;
    width: 40%;
    margin-left: 1.25rem;
  }
  .cursor{
    cursor:pointer;
  }
  .search_word {
    width: 70%;
    margin-bottom: 0.625rem;
    label {
        width: 0;
        margin: 0;
    }
    input {
        font-size: 1.25rem;
        height: 2.5rem;
    }
  }
`;

let big_Kana = Array(
  'ア','イ','ウ','エ','オ',
  'カ','キ','ク','ケ','コ',
  'サ','シ','ス','セ','ソ',
  'タ','チ','ツ','テ','ト',
  'ナ','ニ','ヌ','ネ','ノ',
  'ハ','ヒ','フ','ヘ','ホ',
  'マ','ミ','ム','メ','モ',
  'ヤ','ヰ','ユ','ヱ','ヨ',
  'ラ','リ','ル','レ','ロ',
  'ワ','ヲ','ン'
);
let small_Kana = Array(
  'ァ','ィ','ゥ','ェ','ォ',
  'ヵ','','','ヶ','',
  '','ㇱ','ㇲ','','',
  '','','ッ','','ㇳ',
  '','','ㇴ','','',
  'ㇵ','ㇶ','ㇷ','ㇸ','ㇹ',
  '','','ㇺ','','',
  'ャ','','ュ','','ョ',
  'ㇻ','ㇼ','ㇽ','ㇾ','ㇿ',
  'ヮ','',''
);
let big_murky_Kana = Array(
  '','','','','',
  'ガ','ギ','グ','ゲ','ゴ',
  'ザ','ジ','ズ','ゼ','ゾ',
  'ダ','ヂ','ヅ','デ','ド',
  '','','','','',
  'バ','ビ','ブ','ベ','ボ',
  '','','','','',
  '','','','','',
  '','','','','',
  '','',''
);
let big_semivarous_Kana = Array(
  '','','','','',
  '','','','','',
  '','','','','',
  '','','','','',
  '','','','','',
  'パ','ピ','プ','ペ','ポ',
  '','','','','',
  '','','','','',
  '','','','','',
  '','',''
);

const injection_category = ["静注", "筋注", "点滴", "処置薬剤", "麻酔", "処置行為", '全て'];
const medicine_type_name = ["内服", "頓服", "外用", "処置", "麻酔", "インスリン"];
class SelectPannelModal extends Component {
  constructor(props) {
    super(props);
    let category = '';
    if(this.props.MasterName === '注射'){
      category = 6;
    }
    if(this.props.MasterName === '薬剤' && props.master_category !== undefined){
      category = props.master_category;
    }
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    
    let search_word = this.props.user_search_name;
    
    this.state = {
      MasterCodeData:[],
      selected_index:undefined,
      search_word:search_word != undefined && search_word != null ? search_word : '',
      search_type:1,
      cur_caret_pos:0,
      category,
      is_loaded:false,
      isBackConfirmModal: false,
      isSelectConfirmModal: false,
      confirm_message: "",
      alert_messages: "",
      confirm_alert_title:'',
      origin_index: ''
    }
  }
  async componentDidMount() {
    if(this.props.MasterName === '薬剤'){
      let is_antithrombotic = this.props.is_antithrombotic?1:0;
      await this.getMedicinesByKind(this.state.category, 'name_kana', '', this.state.search_word, this.state.search_type, is_antithrombotic );
      this.setState({is_loaded:true});
    } else {
      await this.getMasterData();
    }
    this.setCaretPosition('search_input', this.state.cur_caret_pos);
    var obj = document.getElementsByClassName('history-list');    
    if (obj != undefined && obj.length > 0){      
      obj[0].addEventListener("keydown", e => {        
        if (e.keyCode == 13) {        
          this.handleOk();
        }
      })
    }
  }
  
  getMasterData = async()  =>{
    let path = "";
    let post_data = {};
    this.setState({is_loaded:false})
    if(this.props.MasterName === '注射'){
      path = "/app/api/v2/dial/master/material_search";
      post_data = {
        name:this.state.search_word,
        name_search_type:this.state.search_type,
        order:'name_kana',
        order2:'',
        is_enabled: 1,
        table_kind: 6,
        injection_category:this.state.category == 6 ? '' : injection_category[this.state.category],
      };
    }
    if(this.props.MasterName === 'VA名称' || this.props.MasterName === 'VA手術'){
      path = "/app/api/v2/dial/master/getCommonCodeData";
      post_data = {
        category : this.props.MasterName,
        name:this.state.search_word,
        name_search_type:this.state.search_type,
        order:'sort_number'
      };
    }
    if(this.props.MasterName === '検査項目'){
      path = "/app/api/v2/dial/master/search_exam_item";
      post_data = {
        name:this.state.search_word,
        name_search_type:this.state.search_type,
        order:'name_kana'
      };
    }
    if(this.props.MasterName === '検査'){
      path = "/app/api/v2/dial/master/search_periodic_exam_item";
      post_data = {
        name:this.state.search_word,
        name_search_type:this.state.search_type,
        order:'sort_number'
      };
    }
    if (this.props.MasterName == '他施設') {
      path = "/app/api/v2/dial/master/getOtherFacilitiesOrder";
      post_data = {
        name:this.state.search_word,
        name_search_type:this.state.search_type,
        order:'sort_number'
      };
    }
    await axios.post(path, {params: post_data}).
      then((res) => {
        this.setState({
          MasterCodeData: res.data,
          is_loaded: true,
        });
      })
      .catch(() => {
      });
  };
  
  handleOk = () => {    
    if (this.state.selected_index >=0) {
      if(this.props.MasterName === '薬剤') {
        if (this.props.is_antithrombotic) {
          this.modalBlack();
          this.setState({
            isSelectConfirmModal: true,
            confirm_message:"抗血栓薬情報を登録しますか？",
            title: "登録確認",
          });
          return;
        }
        this.props.selectMaster(this.state.medicineList[this.state.selected_index]);
      } else {
        this.props.selectMaster(this.state.MasterCodeData[this.state.selected_index]);
      }
    } else {      
      window.sessionStorage.setItem("alert_messages", "薬剤を選択してください。");
      return;
    }
  };
  
  selectAndOk = (index) => {
    this.setState({
      selected_index: index,
    }, () => {
      this.handleOk();
    });
  }
  selectMaster = (index) => {
    this.setState({
      selected_index: index,
    });
  };
  
  getInputWord = e => {
    let search_input_obj = document.getElementById("search_input");
    let cur_caret_pos = search_input_obj.selectionStart;
    let MasterName = this.props.MasterName;
    this.setState({search_word: e.target.value, cur_caret_pos:cur_caret_pos}, () => {
      if(MasterName === '薬剤'){
        this.setState({is_loaded:false}, ()=>{
          this.getMedicinesByKind(this.state.category, 'name_kana', '', this.state.search_word, this.state.search_type ).then(()=>{
            this.setState({is_loaded:true});
          });
        });
      } else {
        this.getMasterData();
      }
    });
  };
  
  onClickInputWord = () => {
    let search_input_obj = document.getElementById("search_input");
    let cur_caret_pos = search_input_obj.selectionStart;
    this.setState({cur_caret_pos});
  };
  
  addInputWord = (val) => {
    let search_word = this.state.search_word;
    let cur_caret_pos = this.state.cur_caret_pos;
    search_word = search_word.slice(0, cur_caret_pos) + val + search_word.slice(cur_caret_pos);
    this.setState({search_word, cur_caret_pos:cur_caret_pos + 1}, ()=>{
      var search_input_obj = document.getElementById("search_input");
      search_input_obj.onfocus = this.setCaretPosition('search_input', this.state.cur_caret_pos);
      search_input_obj = null;
      if(this.props.MasterName === '薬剤'){
        this.setState({is_loaded:false}, ()=>{
          this.getMedicinesByKind(this.state.category, 'name_kana', '', this.state.search_word, this.state.search_type ).then(()=>{
            this.setState({is_loaded:true});
          });
        });
      } else {
        this.getMasterData();
      }
      
    });
  };
  
  removeInputWord = () => {
    let search_word = this.state.search_word;
    let cur_caret_pos = this.state.cur_caret_pos;
    if(cur_caret_pos !== 0){
      search_word = search_word.replace(search_word[cur_caret_pos - 1], "");
      this.setState({search_word, cur_caret_pos:cur_caret_pos - 1}, ()=>{
        var search_input_obj = document.getElementById("search_input");
        search_input_obj.onfocus = this.setCaretPosition('search_input', this.state.cur_caret_pos);
        search_input_obj = null;
        if(this.props.MasterName === '薬剤'){
          this.setState({is_loaded:false}, ()=>{
            this.getMedicinesByKind(this.state.category, 'name_kana', '', this.state.search_word, this.state.search_type ).then(()=>{
              this.setState({is_loaded:true});
            });
          });
        } else {
          this.getMasterData();
        }
        
      });
    } else {
      var search_input_obj = document.getElementById("search_input");
      search_input_obj.onfocus = this.setCaretPosition('search_input', this.state.cur_caret_pos);
      search_input_obj = null;
    }
  };
  
  moveCaretPosition = (type) => {
    var search_input_obj = document.getElementById("search_input");
    let cur_caret_pos = this.state.cur_caret_pos;
    let search_word = this.state.search_word;
    if(type === 'next'){
      if(cur_caret_pos !== search_word.length){
        search_input_obj.onfocus = this.setCaretPosition('search_input', cur_caret_pos + 1);
        this.setState({cur_caret_pos:cur_caret_pos + 1});
      } else {
        search_input_obj.onfocus = this.setCaretPosition('search_input', cur_caret_pos);
      }
    } else {
      if(cur_caret_pos !== 0){
        search_input_obj.onfocus = this.setCaretPosition('search_input', cur_caret_pos - 1);
        this.setState({cur_caret_pos:cur_caret_pos - 1});
      } else {
        search_input_obj.onfocus = this.setCaretPosition('search_input', cur_caret_pos);
      }
    }
    search_input_obj = null;
  };
  
  setCaretPosition =(elemId, caretPos)=> {
    var elem = document.getElementById(elemId);
    var range;
    if(elem != null) {
      if(elem.createTextRange) {
        range = elem.createTextRange();
        range.move('character', caretPos);
        range.select();
      } else {
        elem.focus();
        if(elem.selectionStart !== undefined) {
          elem.setSelectionRange(caretPos, caretPos);
        }
      }
    }
  }
  
  onInputKeyPressed = (e) => {
    if(e.keyCode === 13){
      if(this.props.MasterName === '薬剤'){
        this.setState({is_loaded:false}, ()=>{
          this.getMedicinesByKind(this.state.category, 'name_kana', '', this.state.search_word, this.state.search_type ).then(()=>{
            this.setState({is_loaded:true});
          });
        });
      } else {
        this.getMasterData();
      }
    }
  }
  
  selectSearchType = (value) => {
    this.setState({ search_type: value}, ()=>{
      if(this.props.MasterName === '薬剤'){
        if (this.props.master_category !== undefined) return;
        this.setState({is_loaded:false}, ()=>{
          this.getMedicinesByKind(this.state.category, 'name_kana', '', this.state.search_word, value ).then(()=>{
            this.setState({is_loaded:true});
          });
        });
      } else {
        this.getMasterData();
      }
    });
  };
  
  convertBigSmallKana =(type)=>{
    let search_word = this.state.search_word;
    let cur_caret_pos = this.state.cur_caret_pos;
    if(type === 'japan'){
      if(big_Kana.includes(search_word[cur_caret_pos - 1])){
        let index = big_Kana.indexOf(search_word[cur_caret_pos - 1]);
        if(small_Kana[index] !== ''){
          search_word = search_word.substr(0, cur_caret_pos - 1) + small_Kana[index] + search_word.substr(cur_caret_pos);
        }
      } else if(small_Kana.includes(search_word[cur_caret_pos - 1])){
        let index = small_Kana.indexOf(search_word[cur_caret_pos - 1]);
        search_word = search_word.substr(0, cur_caret_pos - 1) + big_Kana[index] + search_word.substr(cur_caret_pos);
      }
    } else {
      if (search_word[cur_caret_pos - 1] >= 'A' && search_word[cur_caret_pos - 1] <= 'Z'){
        search_word = search_word.substr(0, cur_caret_pos - 1) + search_word[cur_caret_pos - 1].toLocaleLowerCase() + search_word.substr(cur_caret_pos);
      } else if (search_word[cur_caret_pos - 1] >= 'a' && search_word[cur_caret_pos - 1] <= 'z'){
        search_word = search_word.substr(0, cur_caret_pos - 1) + search_word[cur_caret_pos - 1].toLocaleUpperCase() + search_word.substr(cur_caret_pos);
      }
    }
    if(search_word !== this.state.search_word){
      this.setState({search_word}, ()=>{
        var search_input_obj = document.getElementById("search_input");
        search_input_obj.onfocus = this.setCaretPosition('search_input', this.state.cur_caret_pos);
        search_input_obj = null;
      });
    } else {
      var search_input_obj = document.getElementById("search_input");
      search_input_obj.onfocus = this.setCaretPosition('search_input', this.state.cur_caret_pos);
      search_input_obj = null;
    }
  }
  
  convertMurkyKana =()=>{
    let search_word = this.state.search_word;
    let cur_caret_pos = this.state.cur_caret_pos;
    if(big_Kana.includes(search_word[cur_caret_pos - 1])){
      let index = big_Kana.indexOf(search_word[cur_caret_pos - 1]);
      if(big_murky_Kana[index] !== ''){
        search_word = search_word.substr(0, cur_caret_pos - 1) + big_murky_Kana[index] + search_word.substr(cur_caret_pos);
      }
    } else if(big_murky_Kana.includes(search_word[cur_caret_pos - 1])){
      let index = big_murky_Kana.indexOf(search_word[cur_caret_pos - 1]);
      search_word = search_word.substr(0, cur_caret_pos - 1) + big_Kana[index] + search_word.substr(cur_caret_pos);
    }
    if(search_word !== this.state.search_word){
      this.setState({search_word}, ()=>{
        var search_input_obj = document.getElementById("search_input");
        search_input_obj.onfocus = this.setCaretPosition('search_input', this.state.cur_caret_pos);
        search_input_obj = null;
      });
    } else {
      var search_input_obj = document.getElementById("search_input");
      search_input_obj.onfocus = this.setCaretPosition('search_input', this.state.cur_caret_pos);
      search_input_obj = null;
    }
  }
  
  convertSemivarousKana =()=>{
    let search_word = this.state.search_word;
    let cur_caret_pos = this.state.cur_caret_pos;
    if(big_Kana.includes(search_word[cur_caret_pos - 1])){
      let index = big_Kana.indexOf(search_word[cur_caret_pos - 1]);
      if(big_semivarous_Kana[index] !== ''){
        search_word = search_word.substr(0, cur_caret_pos - 1) + big_semivarous_Kana[index] + search_word.substr(cur_caret_pos);
      }
    } else if(big_semivarous_Kana.includes(search_word[cur_caret_pos - 1])){
      let index = big_semivarous_Kana.indexOf(search_word[cur_caret_pos - 1]);
      search_word = search_word.substr(0, cur_caret_pos - 1) + big_Kana[index] + search_word.substr(cur_caret_pos);
    }
    if(search_word !== this.state.search_word){
      this.setState({search_word}, ()=>{
        var search_input_obj = document.getElementById("search_input");
        search_input_obj.onfocus = this.setCaretPosition('search_input', this.state.cur_caret_pos);
        search_input_obj = null;
      });
    } else {
      var search_input_obj = document.getElementById("search_input");
      search_input_obj.onfocus = this.setCaretPosition('search_input', this.state.cur_caret_pos);
      search_input_obj = null;
    }
  }
  
  selectCategory = (e) => {
    if (this.props.master_category !== undefined) return;
    let MasterName = this.props.MasterName;
    this.setState({ category: e.target.value}, ()=>{
      if(MasterName === '薬剤'){
        this.setState({is_loaded:false}, ()=>{
          this.getMedicinesByKind(this.state.category, 'name_kana', '', this.state.search_word, this.state.search_type ).then(()=>{
            this.setState({is_loaded:true});
          });
        });
      } else {
        this.getMasterData();
      }
    });
  };
  
  modalBlack() {
    var base_modal = document.getElementsByClassName("prescript-medicine-select-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1040;
  }
  modalBlackBack() {
    var base_modal = document.getElementsByClassName("prescript-medicine-select-modal")[0];
    if (base_modal !== undefined && base_modal != null)
      base_modal.style["z-index"] = 1050;
  }
  closeModal = () => {
    this.props.closeModal();
  };
  closeConfirmModal = () =>{
    this.confirmCancel();
    this.props.closeModal();
  }
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isBackConfirmModal: false,
      isSelectConfirmModal: false,
      confirm_message: "",
      alert_messages: "",
      confirm_alert_title:'',
    });
    this.modalBlackBack();
  }
  confirmOk = () => {
    this.confirmCancel();
    this.props.selectMaster(this.state.medicineList[this.state.selected_index]);
  }
  
  render() {
    let {MasterCodeData} = this.state;
    if(this.props.MasterName === '薬剤'){
      MasterCodeData = this.state.medicineList;
    }
    return  (
      <Modal show={true} id="select_pannel_modal"  className="master-modal prescript-medicine-select-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>{this.props.MasterName}選択パネル</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Wrapper>
              <div className="left-area">
                <div className={'search_word'}>
                  <InputKeyWord
                    id={'search_input'}
                    type="text"
                    label=""
                    onChange={this.getInputWord.bind(this)}
                    onKeyPressed={this.onInputKeyPressed}
                    onClick={this.onClickInputWord}
                    value={this.state.search_word}
                  />
                </div>
                {(this.props.MasterName === '注射') && (
                  <div className={'flex'}>
                    <div className="injection_type">
                      <>
                        {injection_category.map((item, index)=>{
                          return (
                            <>
                              <RadioButton
                                id={`male_${index}`}
                                value={index}
                                label={item}
                                name="injection_category"
                                getUsage={this.selectCategory}
                                checked={this.state.category == index ? true : false}
                              />
                            </>
                          );
                        })
                        }
                      </>
                    </div>
                  </div>
                )}
                {(this.props.MasterName === '薬剤' && !this.props.is_antithrombotic) && (
                  <>
                    {this.props.user_search_category == "インスリン" ? (
                      <div className={'flex'}>
                        <div className="medicine_type flex">
                          <>
                            {medicine_type_name.map((item, index)=>{
                              return (
                                <>
                                  <div className={`${this.props.user_search_category != item ? "disable-item" : "" }`}>
                                    <RadioButton
                                      id={`male_${index}`}
                                      value={item}
                                      label={item}
                                      name="medicine_type"
                                      getUsage={"インスリン" != item ? "" : this.selectCategory}
                                      checked={this.state.category == item ? true : false}
                                    />
                                  </div>
                                </>
                              );
                            })
                            }
                          </>
                        </div>
                      </div>
                    ):(
                      <div className={'flex'}>
                        <div className="medicine_type">
                          <>
                            {medicine_type_name.map((item, index)=>{
                              return (
                                <>
                                  <RadioButton
                                    id={`male_${index}`}
                                    value={item}
                                    label={item}
                                    name="medicine_type"
                                    getUsage={this.selectCategory}
                                    checked={this.state.category == item ? true : false}
                                  />
                                </>
                              );
                            })
                            }
                          </>
                        </div>
                      </div>
                    )}
                  
                  </>
                )}
                <div tabIndex="-1" className="history-list" style={{height: (this.props.MasterName === '注射' || (this.props.MasterName === '薬剤' && !this.props.is_antithrombotic)) ? 'calc(100% - 6.7rem)' : 'calc(100% - 3.5rem)'}}>
                  <table className="table-scroll table table-bordered table-hover h-100" id={`inspection-pattern-table`} style={{borderBottom: "none"}}>
                    <thead>
                    <tr>
                      {(this.props.MasterName === '注射' || this.props.MasterName === '薬剤') ? (
                        <>
                          <th style={{width:"25vw"}}>表示名称</th>
                          <th>一般名称</th>
                        </>
                      ) : (
                        <th>表示名称</th>
                      )}
                    </tr>
                    </thead>
                    {this.state.is_loaded ? (
                      <tbody className={`list-table-tbody`}>
                      {(MasterCodeData !== undefined && MasterCodeData != null && MasterCodeData.length > 0 && this.state.is_loaded === true) && (
                        MasterCodeData.map((item, index) => {
                          if(item.is_enabled !== 0){
                            return (
                              <>
                                <tr className={this.state.selected_index === index ? "selected cursor" : "cursor"}
                                   onClick={this.selectMaster.bind(this, index)}
                                   onDoubleClick = {this.selectAndOk.bind(this, index)}
                                > 
                                  {(this.props.MasterName === '注射' || this.props.MasterName === '薬剤') ? (
                                    <>
                                      <td style={{width:"25vw"}}>{item.name}</td>
                                      <td>{item.generic_name}</td>
                                    </>
                                  ) : (
                                    <td>{item.name}</td>
                                  )}
                                </tr>
                              </>)
                          }
                        })
                      )}
                      {this.state.is_loaded === true && (MasterCodeData == undefined || MasterCodeData == null || MasterCodeData.length ==0) && (
                        <>
                          <tr><td colSpan = '2'>登録されたデータがありません。</td></tr>
                        </>
                      )}
                      </tbody>
                    ):(
                      <>
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      </>
                    )}
                  </table>
                </div>
              </div>
              <div className="right-area">
                <InputKeywordBody
                  selectSearchType={this.selectSearchType}
                  inputWord={this.addInputWord}
                  removeWord={this.removeInputWord}
                  moveCaret={this.moveCaretPosition}
                  convertKana={this.convertBigSmallKana}
                  murkyKana={this.convertMurkyKana}
                  semivarousKana={this.convertSemivarousKana}
                />
              </div>
            </Wrapper>
          </Card>
          {this.state.isBackConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.closeConfirmModal}
              confirmTitle={this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
          {this.state.isSelectConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.confirmOk.bind(this)}
              confirmTitle={this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
          <Button className="red-btn" onClick={this.handleOk}>選択</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

SelectPannelModal.contextType = Context;

SelectPannelModal.propTypes = {
  closeModal: PropTypes.func,
  selectMaster: PropTypes.func,
  MasterName : PropTypes.string,
  master_category : PropTypes.string,
  user_search_category : PropTypes.string,
  user_search_name : PropTypes.string,
  is_antithrombotic : PropTypes.bool,
};

export default SelectPannelModal;
