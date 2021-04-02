import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import {formatDateLine} from "~/helpers/date";
import Button from "../../../../atoms/Button";
import * as apiClient from "~/api/apiClient";
import * as methods from "~/components/templates/Dial/DialMethods";
import axios from "axios/index";
import SelectPannelHarukaModal from "../Common/SelectPannelHarukaModal";
import Spinner from "react-bootstrap/Spinner";
import ContentEditable from 'react-contenteditable';
import reactCSS from 'reactcss';
import UserWordModal from "~/components/templates/Patient/Modals/Guidance/UserWordModal";
import $ from "jquery";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import {displayLineBreak} from "~/helpers/dialConstants";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenuUl = styled.div`
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
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
      font-size: 1rem;
      font-weight: bold;
    }
    img {
      width: 2rem;
      height: 2rem;
    }
    svg {
      width: 2rem;
      margin: 8px 0;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  height: 100%;
  float: left;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .fl {float: left;}
  .selected, .selected:hover{
    background:lightblue!important;
  }
  p{cursor:pointer;}
  .panel-menu {
    width: 100%;
    margin-bottom: 0.5rem;
    font-weight: bold;
    .menu-btn {
      width:100px;
      text-align: center;
      border-bottom: 1px solid black;
      background-color: rgba(200, 194, 194, 0.22);
      padding: 5px 0;
      cursor: pointer;
    }
    .active-menu {
      width:100px;
      text-align: center;
      border-top: 1px solid black;
      border-right: 1px solid black;
      border-left: 1px solid black;
      padding: 5px 0;
    }
    .no-menu {
      width: calc(100% - 100px);
      border-bottom: 1px solid black;
      background-color: rgba(200, 194, 194, 0.22);
    }
  }
  .work-area {
    width: 100%;
    .react-datepicker-wrapper {
      width: calc(100% - 90px);
      .react-datepicker__input-container {
        width: 100%;
        input {
          font-size: 14px;
          width: 100%;
          height: 38px;
          border-radius: 4px;
          border-width: 1px;
          border-style: solid;
          border-color: rgb(206, 212, 218);
          border-image: initial;
          padding: 0px 8px;
        }
      }
    }
    .left-area {
      width: calc(100% - 31rem);
      margin-right: 1rem;
      .work-list{
        width:100%;
        height: 32rem;
        display:flex;
        align-items: flex-start;
        justify-content: space-between;
        .row-border {border-bottom:1px solid #808080;}
      }
      .category-list {
        width: calc((100% - 31rem) / 2);
        height: 100%;
        overflow-y:auto;
        border:1px solid #aaa;
        p {
          margin: 0;
          padding-left: 5px;
        }
        p:hover {
          background-color: rgb(246, 252, 253);
        }
      }
      .template-list {
        width: calc((100% - 31rem) / 2);
        height: 100%;
        overflow-y:auto;
        border: 1px solid #aaa;
        p {
          margin: 0;
          padding: 0 0.3rem;
        }
        p:hover {
          background-color: rgb(246, 252, 253);
        }
        .word-area {
          width:100%;
          p {word-break:break-all;}
        }
        .word-space-area {width:100%;}
      }
      .preview-box {
        width: 30rem;
        height: 100%;
        overflow-y:auto;
        border: 1px solid #aaa;
        padding:0.3rem;
      }
      .ms-mono{font-family: MS Gothic,monospace;}
      .head-area {
        width:100%;
        height:30px;
        display:flex;
        align-items: flex-start;
        justify-content: space-between;
        .head-title {
          text-align: center;
          background-color: #a0ebff;
          font-size: 1rem;
          font-weight: bold;
          line-height:30px;
          padding: 0 !important;
          border: 1px solid #aaa;
          border-bottom: none;
          height: 30px;
          overflow: hidden;
        }
      }
    }
  }
  .right-area {
    width: 30rem;
    textarea {
      width: 100%;
      margin: 0px;
      height: 220px;
      max-height: 100%;
    }
    .content_editable_icon {
      height:30px;
      button {
        margin-left: 5px;
        width: 2.4rem;
        font-weight: bold;
        height:27px;
        line-height: 25px;
      }
      .color-icon {
        text-align: center;
        padding: 0;
      }
      .set-font-color {
        margin-bottom: 0;
        width: 100%;
        border-bottom: 2px solid;
        cursor: pointer;
        height: 100%;
        line-height: 25px;
      }
      .color_picker_area {
        .color-block-area {
          background-color: white;
          border: 1px solid #aaa;
        }
        .color-block {
          width: 15px;
          margin: 4px;
          height: 15px;
          cursor: pointer;
        }
      }
      .font_select_area {
        left: 140px!important;
        border: 1px solid #aaa;
        width: 30px;
        border-top: none;
        .font-block-area {
          background-color: white;
        }
        .font-block {
          cursor: pointer;
          border-top: 1px solid #aaa;
        }
      }
    }
    .content-edit {
      border: 1px solid #aaa;
      height: 32rem;
      overflow-x:hidden;
      .content_editable_area {
        height:100%;
        width:100%!important;
        padding: 0.3rem;
        overflow-y:auto;
        word-break: break-all;
        p{margin-bottom:0px;}
        font-family: MS Gothic,monospace;
      }
      em, i {
        font-family:"ＭＳ Ｐゴシック";
      }
    }
  }
  .master_btns{
    width: calc(100% - 210px);
    button{
      margin-left:10px;
      margin-right:10px;
      span{
        font-size:1rem;
      }
    }
  }
  .btn_names {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    button{
      margin-left:10px;
      margin-right:10px;
      span{
        font-size:1rem;
      }
    }
  }
`;

const btn_names = ["薬剤マスタ", "注射マスタ"];

const ContextMenu = ({visible, x, y, word_info, user_number, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction("add_word", null)}>追加</div></li>
          {word_info != null && user_number == word_info.created_by && (
            <>
              <li><div onClick={() => parent.contextMenuAction("edit_word", word_info)}>編集</div></li>
              <li><div onClick={() => parent.contextMenuAction("delete_word", word_info)}>削除</div></li>
            </>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class RoutineInputPanel extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let cur_date = new Date();
    //soap指示 編集時
    let body_soap = {
      'S':(props.presData !== undefined && props.presData.s_text !== undefined) ? props.presData.s_text : '',
      'O':(props.presData !== undefined && props.presData.o_text !== undefined) ? props.presData.o_text : '',
      'A':(props.presData !== undefined && props.presData.a_text !== undefined) ? props.presData.a_text : '',
      'P':(props.presData !== undefined && props.presData.p_text !== undefined) ? props.presData.p_text : '',
    };
    this.state = {
      tab_id: 0,
      implementationIntervalType: "",
      entry_time: "",
      exam_pattern_code: 0,
      examination_start_date:new Date(cur_date.getFullYear(), cur_date.getMonth(), 1),
      examination_end_date:cur_date,
      showWeight: false,
      showDW: false,
      word_pattern_list:[],
      word_list:[],
      selected_word_number:0,
      selected_word:"",
      selected_pattern_number:0,
      body:"",
      body_soap,
      usable_page:'',
      exam_table_data:[],
      confirm_type:"",
      confirm_title:"",
      confirm_message: "",
      isUpdateConfirmModal: false,
      source : this.props.source,
      handover_relation : this.props.handover_relation,
      is_loaded:false,
      value:this.props.value,
      kind:props.kind,
      isAlertModal:false,
      isOpenUserWordModal:false,
      alert_message:"",
    };
    this.soap_font_color = "#000000";
    this.change_flag = 0;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.user_number = authInfo.user_number;
  }
  
  async componentDidMount() {
    await this.setInputKind(this.props.kind);
    let elements = document.getElementsByClassName("content_editable_area");
    for (let i = 0; i < elements.length; i++) {
      elements[i].addEventListener('click', this.getSeleteTag, false);
    }
  }
  
  setInputKind = async(kind = undefined) => {
    await this.getWordInfo(kind);
    this.setState({kind:kind});
  }
  
  getSeleteTag=()=>{
    let parentNode_name = window.getSelection().anchorNode.parentNode.tagName;
    let bold_btn = document.getElementsByClassName("bold-btn")[1];
    let italic_btn = document.getElementsByClassName("italic-btn")[1];
    let font_color_btn = document.getElementsByClassName("set-font-color")[1];
    if(bold_btn !== undefined && bold_btn != null){
      if(parentNode_name == "STRONG" || parentNode_name == "B"){
        bold_btn.style['background-color'] = "#aaa";
      } else {
        bold_btn.style['background-color'] = "";
      }
    }
    if(italic_btn !== undefined && italic_btn != null){
      if(parentNode_name == "EM" || parentNode_name == "I"){
        italic_btn.style['background-color'] = "#aaa";
      } else {
        italic_btn.style['background-color'] = "";
      }
    }
    if(font_color_btn !== undefined && font_color_btn != null){
      if(parentNode_name == "FONT"){
        let font_color =  window.getSelection().anchorNode.parentNode.color;
        if(font_color !== undefined && font_color != null && font_color != ""){
          this.changeBtnColor(font_color);
        }
      } else {
        this.changeBtnColor("#000000");
      }
    }
    // document.execCommand("ForeColor", false, this.soap_font_color);
  }
  
  getWordInfo = async(kind) => {
    let path = "/app/api/v2/dial/board/searchWordPattern";
    let usable_page = '';
    switch(kind){
      case 'S':
        usable_page = "処置モニタ/S";
        break;
      case 'O':
        usable_page = "処置モニタ/O";
        break;
      case 'A':
        usable_page = "処置モニタ/A";
        break;
      case 'P':
        usable_page = "処置モニタ/P";
        break;
      default:
        usable_page = "処置モニタ/S";
        break;
    }
    await apiClient
      ._post(path, {
        params: {is_enabled:1, usable_page}
      })
      .then((res) => {
        if (res.length > 0){
          this.setState({
            usable_page,
            word_pattern_list:res,
            selected_pattern_number:res[0].number,
          }, () => {
            this.getWordsFromPattern(this.state.selected_pattern_number);
          })
        } else {
          this.setState({
            usable_page,
            word_pattern_list:[],
            word_list:[],
            selected_pattern_number:0,
          })
        }
      })
      .catch(() => {
      
      });
  }
  
  getWordsFromPattern = async(pattern_number) => {
    if(this.state.is_loaded){
      this.setState({is_loaded:false});
    }
    let path = "/app/api/v2/dial/board/searchWords";
    let post_data = {
      pattern_number:pattern_number,
      is_enabled:1,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          word_list:res,
          selected_pattern_number:pattern_number,
          is_loaded:true
        });
      })
      .catch(() => {
      
      });
  }
  
  showMasterModal = (index) => {
    switch(index){
      case 0:
        this.setState({isMedicineMaster:true});
        break;
      case 1:
        this.setState({isInjectionMaster:true});
        break;
    }
  }
  
  closeModal = () => {
    this.setState({
      isMedicineMaster:false,
      isInjectionMaster:false,
      isAlertModal:false,
      isOpenUserWordModal:false,
      confirm_type:"",
      confirm_title:"",
      confirm_message:"",
      alert_message:"",
    }, ()=>{
      document.getElementById("routine_input_panel_modal").focus();
    })
  }
  
  checkPrefix = (prefix, body) => {
    if (body != undefined && body != null && body != '' && prefix != undefined && prefix != null && prefix != ''){
      return body.indexOf(prefix)==0;
    } else return false;
  }
  
  checkBody = (prefix, body) => {
    if (body != undefined && body != null && prefix != undefined && prefix != null && prefix != ''){
      if (body.replace(prefix, '') != '') return true;
      else return false;
    } else return false;
    
  }
  
  saveBody = () => {
    if(this.change_flag == 0){
      return;
    }
    if (this.props.title =="soap"){
      var flag = false;
      let body_soap = this.state.body_soap;
      Object.keys(body_soap).map(key => {
        if (body_soap[key] != '') flag = true;
      })
      if (flag == false) {
        this.setState({isAlertModal:true});
        return false;
      }
      this.props.setValue(body_soap);
    } else {
      if (this.state.value == undefined || this.state.value == null || this.state.value == ''){
        this.setState({isAlertModal:true})
        return false;
      }
      this.props.setValue(this.state.value);
    }
  }
  
  addWord = (word) => {
    if (this.props.title =="soap"){
      let word_arr = word.split('\r\n');
      let word_arr_length = word_arr.length;
      if(word_arr_length > 0){
        word = "";
        word_arr.map((item, index)=>{
          word += item;
          if(index != word_arr_length - 1){
            word = word + '<br>';
          }
        });
      }
      word_arr = word.split('\n');
      word_arr_length = word_arr.length;
      if(word_arr_length > 0){
        word = "";
        word_arr.map((item, index)=>{
          word += item;
          if(index != word_arr_length - 1){
            word = word + '<br>';
          }
        });
      }
      let body_soap = this.state.body_soap;
      let html_data = body_soap[this.state.kind];
      html_data = html_data == '<br>' ? '' : html_data;
      if(html_data !== ''){
        if (window.navigator.msSaveBlob) { // for IE
          let index = html_data.lastIndexOf("<p><br></p>");
          if(index != -1 && ((index + 11) == html_data.length)){
            html_data = html_data.substr(0, index);
            html_data += "<p>";
            html_data += word.split(" ").join('&nbsp;');
            html_data += "</p>";
          } else {
            html_data += word.split(" ").join('&nbsp;');
          }
        } else if (window.webkitURL && window.webkitURL.createObject) { // for Chrome
          let index = html_data.lastIndexOf("<div><br></div>");
          if(index != -1 && ((index + 15) == html_data.length)){
            html_data = html_data.substr(0, index);
            html_data += "<div>";
            html_data += word.split(" ").join('&nbsp;');
            html_data += "</div>";
          } else {
            html_data += word.split(" ").join('&nbsp;');
          }
        } else {
          html_data += word.split(" ").join('&nbsp;');
        }
      } else {
        html_data += word.split(" ").join('&nbsp;');
      }
      body_soap[this.state.kind] = html_data;
      this.change_flag = 1;
      this.setState({body_soap});
    } else {
      let temp = this.state.body;
      temp = temp + word;
      this.change_flag = 1;
      this.setState({body:temp});
    }
  }
  
  getTextBody = evt => {
    this.change_flag = 1;
    if (this.props.title =="soap"){
      let body_soap = this.state.body_soap;
      body_soap[this.state.kind] = evt.target.value;
      this.setState({body_soap});
    } else {
      this.setState({value:evt.editor.getData()});
    }
  }
  
  selectPattern = (selected_pattern_number) => {
    this.setState({
      selected_pattern_number,
      selected_word_number:0,
      selected_word:"",
    }, () => {
      this.getWordsFromPattern(this.state.selected_pattern_number);
    });
  }
  
  selectword = (selected_word_number, selected_word) => {
    let name_arr = selected_word.split('<br>' + '\r\n');
    if(name_arr.length > 1){
      selected_word = "";
      name_arr.map((word, index)=>{
        selected_word += word;
        if(index != name_arr_length - 1){
          selected_word += '\n';
        }
      });
    }
    name_arr = selected_word.split('<br>' + '\n');
    if(name_arr.length > 1){
      selected_word = "";
      name_arr.map((word, index)=>{
        selected_word += word;
        if(index != name_arr_length - 1){
          selected_word += '\n';
        }
      });
    }
    name_arr = selected_word.split('<br>');
    let name_arr_length = name_arr.length;
    if(name_arr_length > 1){
      selected_word = "";
      name_arr.map((word, index)=>{
        selected_word += word;
        if(index != name_arr_length - 1){
          selected_word += '\n';
        }
      });
    }
    this.setState({
      selected_word_number,
      selected_word
    });
  }
  
  selectMaster = (master) => {
    if (this.props.title =="soap"){
      let body_soap = this.state.body_soap;
      let word = master.name;
      body_soap[this.state.kind] += word.split(" ").join('&nbsp;');
      this.setState({body_soap});
    } else {
      this.setState({
        body:this.state.body + master.name,
      })
    }
    this.closeModal();
  };
  
  SetImplementationIntervalType = value => {
    this.setState({implementationIntervalType: value})
  };
  
  getInputTime = value => {
    this.setState({entry_time: value});
  };
  
  setTab = ( e, val ) => {
    this.setState({ tab_id:val });
  };
  
  getExamPatternCode = e => {
    this.setState({exam_pattern_code:e.target.id})
  };
  
  getExamCodes= () => {
    this.getExamDataList();
  }
  
  getExamDataList = async () => {
    let path = "/app/api/v2/dial/medicine_information/examination_data/getByDrkarte";
    let post_data = {
      system_patient_id: this.props.patient_id,
      examination_start_date: formatDateLine(this.state.examination_start_date),
      examination_end_date: formatDateLine(this.state.examination_end_date),
      curPatternCode: this.state.exam_pattern_code,
    };
    const { data } = await axios.post(path, {params: post_data});
    this.setState({
      exam_table_data: data,
    });
  };
  
  getStartdate = value => {
    this.setState(
      {examination_start_date: value}
      , () => {this.getExamDataList()})
  };
  
  getEnddate = value => {
    this.setState({examination_end_date: value}
      , () => {this.getExamDataList()})
  };
  
  boldBtnClicked =()=>{
    let bold_btn = document.getElementsByClassName("bold-btn")[1];
    if(bold_btn.style['background-color'] == "rgb(170, 170, 170)"){
      bold_btn.style['background-color'] = "";
    } else {
      bold_btn.style['background-color'] = "#aaa";
    }
  }
  
  italicBtnClicked = ()=>{
    let italic_btn = document.getElementsByClassName("italic-btn")[1];
    if(italic_btn.style['background-color'] == "rgb(170, 170, 170)"){
      italic_btn.style['background-color'] = "";
    } else {
      italic_btn.style['background-color'] = "#aaa";
    }
  }
  
  colorPickerHover = (e) => {
    let color_picker_area = document.getElementsByClassName("color_picker_area")[1];
    let font_select_area = document.getElementsByClassName("font_select_area")[1];
    // eslint-disable-next-line consistent-this
    // const that = this;
    e.preventDefault();
    document.addEventListener(`click`, function onClickOutside(e) {
      var obj = e.target;
      do {
        if( obj.id !== undefined && obj.id != null && obj.id == "color_sel_icon") return;
        obj = obj.parentElement;
      } while(obj.tagName.toLowerCase() !== "body");
      color_picker_area.style['display'] = "none";
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      color_picker_area.style['display'] = "none";
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    color_picker_area.style['display'] = "block";
    font_select_area.style['display'] = "none";
  };
  
  fontPickerHover = (e) => {
    let font_select_area = document.getElementsByClassName("font_select_area")[1];
    let color_picker_area = document.getElementsByClassName("color_picker_area")[1];
    // eslint-disable-next-line consistent-this
    // const that = this;
    e.preventDefault();
    document.addEventListener(`click`, function onClickOutside(e) {
      var obj = e.target;
      do {
        if( obj.id != null && obj.id == "font_sel_icon") return;
        obj = obj.parentElement;
      } while(obj.tagName.toLowerCase() !== "body");
      font_select_area.style['display'] = "none";
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      font_select_area.style['display'] = "none";
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    font_select_area.style['display'] = "block";
    color_picker_area.style['display'] = "none";
  };
  
  changeBtnColor=(color)=>{
    let set_font_color_obj = document.getElementsByClassName("set-font-color")[1];
    if(set_font_color_obj !== undefined && set_font_color_obj != null){
      set_font_color_obj.style['border-color'] = color;
      this.soap_font_color = color;
    }
  }
  
  confirmClose=()=>{
    if(this.change_flag == 0){
      this.props.closeModal();
    } else {
      this.setState({
        confirm_type:"modal_close",
        confirm_title:"入力中",
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
      })
    }
  }
  
  stripHtml=(html)=>{
    if(this.props.title =="soap"){
      html = html.split(" ").join('&nbsp;');
    }
    /*@cc_on _d = document; eval ( 'var document = _d') @*/
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }
  
  handleClick=(e, word_info=null)=>{
    if(this.props.title !== "soap" || this.state.selected_pattern_number == 0){return;}
    if (!this.context.$canDoAction(this.context.FEATURES.USER_WORD_REGISTER,this.context.AUTHS.REGISTER)) {return;}
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("word_list_area")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: {visible: false}
          });
          document
            .getElementById("word_list_area")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      let modal_left = document.getElementsByClassName("routine-input-panel-modal")[0].getElementsByClassName("modal-dialog")[0].offsetLeft;
      let table_left = document.getElementsByClassName("work-list")[0].offsetLeft;
      let table_top = document.getElementsByClassName("panel-menu")[0].offsetHeight;
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - modal_left - table_left,
          y: e.clientY + window.pageYOffset - table_top,
          word_info,
          user_number:this.user_number
        }
      });
    }
  };
  
  contextMenuAction = (act, word_info) => {
    if(act === "add_word" || act === "edit_word") {
      this.setState({
        word_info,
        isOpenUserWordModal:true,
      });
    } else if(act === "delete_word"){
      this.setState({
        word_info,
        confirm_type:act,
        confirm_title:"削除確認",
        confirm_message:"削除しますか？",
      });
    }
  };
  
  componentDidUpdate=()=>{
    let space_area = document.getElementsByClassName("word-space-area")[0];
    if(space_area !== undefined && space_area != null){
      let list_area_obj = document.getElementsByClassName("template-list")[0];
      let word_area_obj = document.getElementsByClassName("word-area")[0];
      if(list_area_obj !== undefined && list_area_obj != null && word_area_obj !== undefined && word_area_obj != null){
        let list_area_obj_height = $(list_area_obj).height();
        let word_area_obj_height = $(word_area_obj).height();
        if(list_area_obj_height > word_area_obj_height){
          space_area.style['height'] = (list_area_obj_height - word_area_obj_height)+"px";
        } else {
          space_area.style['height'] = "0px";
        }
      }
    }
  }
  
  confirmOk=()=>{
    if(this.state.confirm_type === "modal_close"){
      this.props.closeModal();
    } else if(this.state.confirm_type === "delete_word"){
      this.deleteWord();
    }
  }
  
  deleteWord=async()=>{
    let path = "/app/api/v2/dial/board/word_delete";
    let post_data = {
      params: {
        number:this.state.word_info.number,
        kind:0,
        type:"user_word"
      },
    };
    await apiClient.post(path,  post_data);
    this.setState({
      confirm_title:"削除完了",
      confirm_type:"",
      confirm_message:"",
      alert_message:"削除しました。",
    }, ()=>{
      this.selectPattern(this.state.word_info.pattern_number);
    });
  }
  
  render() {
    let {word_pattern_list, word_list} = this.state;
    let color_styles = reactCSS({
      'default': {
        popover: {
          position: 'absolute',
          zIndex: '1050',
          top:'30px',
          display: 'none',
          left: '65px',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
      },
    });
    return (
      <Modal show={true} className="custom-modal-sm wordPattern-modal routine-input-panel-modal" id="routine_input_panel_modal">
        <Modal.Header>
          <Modal.Title>{this.props.title === "soap" ? ("SOAPー" + this.state.kind) : (this.props.title +"定型")}入力</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="panel-menu flex">
              {this.state.tab_id === 0 ? (
                <div className="active-menu">テンプレート</div>
              ) : (
                <div className="menu-btn" onClick={e => {this.setTab(e, "0");}}>単語リスト</div>
              )}
              <div className="no-menu"/>
            </div>
            <div className="work-area flex">
              <div className="left-area">
                {this.state.tab_id === 0 && (
                  <>
                    <div className={'head-area'}>
                      <div className="category-list head-title">分類</div>
                      <div className={'template-list head-title'}>テンプレート一覧</div>
                      <div className="preview-box head-title">プレビュー</div>
                    </div>
                    <div className="work-list">
                      <div className="category-list">
                        {word_pattern_list.length > 0 && (
                          word_pattern_list.map(item => {
                            return (
                              <>
                                <p
                                  className={'row-border ' + (item.number == this.state.selected_pattern_number ? "selected" : "")}
                                  onClick={this.selectPattern.bind(this, item.number)}
                                >{item.name}</p>
                              </>
                            )
                          })
                        )}
                      </div>
                      <div className="template-list" id={'word_list_area'}>
                        {this.state.is_loaded ? (
                          <>
                            <div className={'word-area'}>
                              {word_list.length>0 && (
                                word_list.map(item => {
                                  return (
                                    <>
                                      <p
                                        className={'row-border ' + (item.number == this.state.selected_word_number ? "selected" : "")}
                                        onClick = {this.selectword.bind(this, item.number, item.word)}
                                        onDoubleClick = {this.addWord.bind(this, item.word)}
                                        onContextMenu={e => this.handleClick(e, item)}
                                        style={{color:item.created_by == this.user_number ? "blue" : ""}}
                                      >
                                        {item.title !== "" ? this.stripHtml(item.title) : this.stripHtml(item.word)}
                                      </p>
                                    </>
                                  )
                                })
                              )}
                            </div>
                            <div className={'word-space-area'} onContextMenu={e => this.handleClick(e, null)}/>
                          </>
                        ):(
                          <>
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          </>
                        )}
                      </div>
                      <div className="preview-box ms-mono">
                        {displayLineBreak(this.state.selected_word)}
                      </div>
                    </div>
                    <div className="btn_names">
                      <>
                        {btn_names.map((item, key)=>{
                          return (
                            <>
                              <Button key={key} onClick={this.showMasterModal.bind(this, key)}>{item}</Button>
                            </>
                          );
                        })}
                      </>
                    </div>
                  </>
                )}
              </div>
              <div className="right-area">
                {this.props.title =="soap" ? (
                  <>
                    <div className={'content_editable_icon flex'} style={{position:"relative"}}>
                      <button
                        className={'bold-btn'}
                        style={{backgroundColor:""}}
                        onMouseDown={evt => {
                          evt.preventDefault(); // Avoids loosing focus from the editable area
                          document.execCommand("bold", false, ""); // Send the command to the browser
                          this.boldBtnClicked(evt)
                        }}
                      >B</button>
                      <button
                        className={'italic-btn'}
                        style={{fontStyle:"italic", backgroundColor:""}}
                        onMouseDown={evt => {
                          evt.preventDefault(); // Avoids loosing focus from the editable area
                          document.execCommand("italic", false, ""); // Send the command to the browser
                          this.italicBtnClicked(evt)
                        }}
                      >I</button>
                      <button
                        className="d-flex color-icon" id={'color_sel_icon'}
                        onClick={(e) => {this.colorPickerHover(e)}}
                      >
                        <label className="set-font-color" style={{borderColor:this.soap_font_color}}>A<sup>▾</sup></label>
                      </button>
                      <div style={ color_styles.popover  } className={'color_picker_area'} id={'color_picker_area'}>
                        <div className={'color-block-area'}>
                          <div className={'d-flex '}>
                            <div className={'color-block'} style={{backgroundColor:"#d0021b"}} onMouseDown={e=>{
                              e.preventDefault();
                              document.execCommand("ForeColor", false, "#d0021b");
                              this.changeBtnColor("#d0021b");
                            }}> </div>
                            <div className={'color-block'} style={{backgroundColor:"#f5a623"}} onMouseDown={e=>{
                              e.preventDefault();
                              document.execCommand("ForeColor", false, "#f5a623");
                              this.changeBtnColor("#f5a623");
                            }}> </div>
                            <div className={'color-block'} style={{backgroundColor:"#f8e71c"}} onMouseDown={e=>{
                              e.preventDefault();
                              document.execCommand("ForeColor", false, "#f8e71c");
                              this.changeBtnColor("#f8e71c");
                            }}> </div>
                            <div className={'color-block'} style={{backgroundColor:"#8b572a"}} onMouseDown={e=>{
                              e.preventDefault();
                              document.execCommand("ForeColor", false, "#8b572a");
                              this.changeBtnColor("#8b572a");
                            }}> </div>
                            <div className={'color-block'} style={{backgroundColor:"#7ed321"}} onMouseDown={e=>{
                              e.preventDefault();
                              document.execCommand("ForeColor", false, "#7ed321");
                              this.changeBtnColor("#7ed321");
                            }}> </div>
                            <div className={'color-block'} style={{backgroundColor:"#417505"}} onMouseDown={e=>{
                              e.preventDefault();
                              document.execCommand("ForeColor", false, "#417505");
                              this.changeBtnColor("#417505");
                            }}> </div>
                            <div className={'color-block'} style={{backgroundColor:"#bd10e0"}} onMouseDown={e=>{
                              e.preventDefault();
                              document.execCommand("ForeColor", false, "#bd10e0");
                              this.changeBtnColor("#bd10e0");
                            }}> </div>
                            <div className={'color-block'} style={{backgroundColor:"#9013fe"}} onMouseDown={e=>{
                              e.preventDefault();
                              document.execCommand("ForeColor", false, "#9013fe");
                              this.changeBtnColor("#9013fe");
                            }}> </div>
                          </div>
                          <div className={'d-flex'}>
                            <div className={'color-block'} style={{backgroundColor:"#4a90e2"}} onMouseDown={e=>{
                              e.preventDefault();
                              document.execCommand("ForeColor", false, "#4a90e2");
                              this.changeBtnColor("#4a90e2");
                            }}> </div>
                            <div className={'color-block'} style={{backgroundColor:"#50e3c2"}} onMouseDown={e=>{
                              e.preventDefault();
                              document.execCommand("ForeColor", false, "#50e3c2");
                              this.changeBtnColor("#50e3c2");
                            }}> </div>
                            <div className={'color-block'} style={{backgroundColor:"#b8e986"}} onMouseDown={e=>{
                              e.preventDefault();
                              document.execCommand("ForeColor", false, "#b8e986");
                              this.changeBtnColor("#b8e986");
                            }}> </div>
                            <div className={'color-block'} style={{backgroundColor:"#000000"}} onMouseDown={e=>{
                              e.preventDefault();
                              document.execCommand("ForeColor", false, "#000000");
                              this.changeBtnColor("#000000");
                            }}> </div>
                            <div className={'color-block'} style={{backgroundColor:"#4a4a4a"}} onMouseDown={e=>{
                              e.preventDefault();
                              document.execCommand("ForeColor", false, "#4a4a4a");
                              this.changeBtnColor("#4a4a4a");
                            }}> </div>
                            <div className={'color-block'} style={{backgroundColor:"#9b9b9b"}} onMouseDown={e=>{
                              e.preventDefault();
                              document.execCommand("ForeColor", false, "#9b9b9b");
                              this.changeBtnColor("#9b9b9b");
                            }}> </div>
                            <div className={'color-block'} style={{backgroundColor:"#FFFFFF"}} onMouseDown={e=>{
                              e.preventDefault();
                              document.execCommand("ForeColor", false, "#FFFFFF");
                              this.changeBtnColor("#FFFFFF");
                            }}> </div>
                          </div>
                        </div>
                      </div>
                      <button
                        id={'font_sel_icon'}
                        style={{position:"relative", padding:"0"}}
                        onClick={(e) => {this.fontPickerHover(e)}}
                      >
                        <span style={{position:"absolute", left:"5px", top:"0px"}}>A</span>
                        <span style={{position:"absolute", left:"14px", top:"5px"}}>▾</span>
                        <span style={{position:"absolute", left:"14px", top:"-5px"}}>▴</span>
                      </button>
                      <div style={ color_styles.popover} className={'font_select_area'}>
                        <div className={'font-block-area'}>
                          <div className={'font-block'} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("fontSize", false, 1);
                          }}>10</div>
                          <div className={'font-block'} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("fontSize", false, 2);
                          }}>14</div>
                          <div className={'font-block'} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("fontSize", false, 3);
                          }}>16</div>
                          <div className={'font-block'} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("fontSize", false, 4);
                          }}>18</div>
                          <div className={'font-block'} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("fontSize", false, 5);
                          }}>24</div>
                          <div className={'font-block'} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("fontSize", false, 6);
                          }}>32</div>
                          <div className={'font-block'} onMouseDown={e=>{
                            e.preventDefault();
                            document.execCommand("fontSize", false, 7);
                          }}>48</div>
                        </div>
                      </div>
                    </div>
                    <div className={'content-edit'}>
                      <ContentEditable
                        className="content_editable_area"
                        html={this.state.body_soap[this.state.kind]}
                        disabled={false}
                        onChange={e=>this.getTextBody(e)} // handle innerHTML chang
                        tagName='article'
                      />
                    </div>
                  </>
                ):(
                  <textarea
                    onChange={this.getTextBody.bind(this)}
                    value = {this.state.value}
                  />
                )}
              </div>
            </div>
            <div className={'flex'}>
              {this.props.title === "soap" && (
                <div className="master_btns">
                  <label className="continue_input">続けて入力</label>
                  <Button type="mono" className = {this.state.kind =="S"?"selected":""} onClick={this.setInputKind.bind(this, "S")}>S 訴え</Button>
                  <Button type="mono" className = {this.state.kind =="O"?"selected":""} onClick={this.setInputKind.bind(this, "O")}>O 所見</Button>
                  <Button type="mono" className = {this.state.kind =="A"?"selected":""} onClick={this.setInputKind.bind(this, "A")}>A 問題点</Button>
                  <Button type="mono" className = {this.state.kind =="P"?"selected":""} onClick={this.setInputKind.bind(this, "P")}>P 対応</Button>
                </div>
              )}
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className={'cancel-btn'} onClick={this.confirmClose}>キャンセル</Button>
          <Button className={this.change_flag == 1 ? 'red-btn' : 'disable-btn'} onClick={this.saveBody}>登録</Button>
        </Modal.Footer>
        {this.state.isMedicineMaster && (
          <SelectPannelHarukaModal
            selectMaster = {this.selectMaster}
            closeModal= {this.closeModal}
            MasterName= {'薬剤'}
          />
        )}
        {this.state.isInjectionMaster && (
          <SelectPannelHarukaModal
            selectMaster = {this.selectMaster}
            closeModal= {this.closeModal}
            MasterName= {'注射'}
          />
        )}
        {this.state.isAlertModal && (
          <AlertNoFocusModal
            showMedicineContent = "本文を入力してください。"
            hideModal = {this.closeModal}
            handleOk = {this.closeModal}
          />
        )}
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm= {this.closeModal.bind(this)}
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_title}
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        {this.state.isOpenUserWordModal && (
          <UserWordModal
            closeModal={this.closeModal.bind(this)}
            modal_data={this.state.word_info}
            handleOk={this.selectPattern}
            pattern_number={this.state.selected_pattern_number}
          />
        )}
        {this.state.alert_message !== "" && (
          <AlertNoFocusModal
            showMedicineContent={this.state.alert_message}
            hideModal={this.closeModal.bind(this)}
            handleOk={this.closeModal.bind(this)}
            title={this.state.confirm_title}
          />
        )}
      </Modal>
    );
  }
}

RoutineInputPanel.contextType = Context;

RoutineInputPanel.propTypes = {
  closeModal: PropTypes.func,
  title:PropTypes.string,
  value:PropTypes.string,
  setValue:PropTypes.func,
  presData:PropTypes.object,
  kind:PropTypes.string,
  handleOk:PropTypes.func,
  patient_id:PropTypes.number,
  patientInfo:PropTypes.array,
  schedule_date:PropTypes.string,
  source : PropTypes.string,
  handover_relation : PropTypes.number,
};

export default RoutineInputPanel;
