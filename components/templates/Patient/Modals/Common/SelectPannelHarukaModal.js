import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import InputKeywordBody from "~/components/templates/Dial/modals/InputKeywordBody";
import InputKeyWord from "~/components/molecules/InputKeyWord";
// import Button from "~/components/atoms/Button";
import axios from "axios/index";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Spinner from "react-bootstrap/Spinner";
import {KEY_CODES, ALLERGY_CATEGORY_TITLE, BOILERPLATE_FUNCTION_ID_CATEGORY, FUNCTION_ID_CATEGORY} from "~/helpers/constants";
import $ from "jquery";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import RadioButton from "~/components/molecules/RadioInlineButton";
import Radiobox from "~/components/molecules/Radiobox";
import * as apiClient from "~/api/apiClient";
import Pagination from "~/components/molecules/Pagination";
import InputBoxTag from "../../../../molecules/InputBoxTag";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 0.875rem;
  display: flex;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .left-area {
    height: 100%;
    width: 60%;
    .medicine_type {
        font-size: 1rem;
        padding: 0px 8px;
        .radio-btn label{
            width: 85px;
            border: solid 1px rgb(206, 212, 218);
            border-radius: 4px;
            margin-right: 5px;
            padding: 4px 5px;
            font-size: 1rem;  
            margin-bottom: 0;
            height:2.3rem;
        }
    }
    .free-input {
      width: 100%;
      label{
        width: 0;
        margin-right: 0;
      }
      input {
        width: 100%;
      }
    }
    .history-list{
      font-size:1rem;      
      border:none!important;
      border: 1px solid #aaa;
      table {
        margin-bottom:0px;        
        thead{
          display:table;
          width:100%;
        }
        tbody {
          tr:nth-child(even) {background-color: #f2f2f2;}
          tr:hover{background-color:#e2e2e2 !important;}
          display:block;
          overflow-y: auto;
          height: 21rem;
        }
        tr{
          display: table;
          width: 100%;
        }
        td {
          word-break: break-all;
          padding: 0.25rem;
          text-align: left;  
          font-size: 1.rem;
        }
        th {
            text-align: center;
            padding: 0.3rem;  
            font-size: 1.25rem;
            font-weight: normal;
        }
        .text-center {
            text-align: center;
        }
      }
      .selected {
        background: rgb(105, 200, 225) !important;
        color: white;
      }
    }
  }
  .right-area {    
    height: 100%;
    width: 40%;    
    margin-left: 20px;
  }
  .cursor{
    cursor:pointer;
  }
  .search_word {
    width: 40%;
    label {
      width: 0;
      margin: 0;
    }
    input {
      font-size: 1rem;
      height:2.3rem;
      margin:0;
      ime-mode:active;
    }
  }
  .select-department {
    width: 30%;
    .label-title {
        font-size: 1rem;
        text-align: right;
        padding-right: 10px;
        width: 5rem;
        line-height: 2.3rem;
    }
    .pullbox-label {
        width: calc(100% - 5rem);
        margin-bottom: 0;
        select {
            width: 100%;
            height:2.3rem;
        }
    }
  }
  .select-visit-group {
    width: 50%;
    .label-title {
        width: 100px;
    }
    .pullbox-label {
        width: calc(100% - 100px);
    }
  }
  .mb-10 {
    margin-bottom: 0.5rem;
  }
  .search-btn {
    height: 2.3rem;
    margin-left: 1rem;
    button{
      padding: 0;
      height: 2.3rem;
    }
    // padding-left: 10px;
    span{
        color: white;
        font-size: 1rem;
        font-family: "Noto Sans JP", sans-serif;
        font-weight: bold;        
        // letter-spacing: 1.3px;
        text-align: center;
        display: block;
    }
    text-align: center;
    line-height: 2.3rem;
    display: inline-block;
    // padding: 6px 16px;
    border-radius: 4px;
    box-sizing: border-box;
    min-width: 91px;
    border: none;
    background-color: rgb(105, 200, 225);
  }
  .search-btn:hover{
    background-color: rgb(38, 159, 191);    
  }
  .search_type_no {
    padding-top:0.3rem;
    padding-bottom:0.3rem;
    label {
        font-size: 1rem;
    }
  }
  .pagination {
    margin-top: 1rem;
    margin-bottom: 0;
    float:right;
    margin-right:0px;
    .paginate_link{
      width: 35px;
      text-align:center;
      padding-left:2px;
      padding-right:2px;
    }    
  }
  .footer-select{
    text-align:left;
    float:left;
    width:auto;
    .pullbox-label{
      width:5rem;
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

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const medicine_type_name = ["内服", "外用"];

class SelectPannelHarukaModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MasterCodeData:null,
      Load:false,
      selected_index:-1,
      search_word:(this.props.searchInitName !== undefined && this.props.searchInitName !==null && this.props.searchInitName !== '') ? this.props.searchInitName : '',
      search_type:1,
      cur_caret_pos:0,
      department_id:this.props.department_id !== undefined && this.props.department_id != null ? this.props.department_id : 1,
      item_categories:[{ id: 0, value: ""},],
      item_category_id:props.item_category_id,
      medicine_category:"内服",
      alert_messages:"",
      screen_keyboard_use:JSON.parse(window.sessionStorage.getItem("init_status")).screen_keyboard_use,
      visit_place : [{ id: 0, value: "全て" },],
      visit_place_id:0,
      visit_group : [{ id: 0, value: "" },],
      display_id: 2,
      display_number: 20,
      visit_group_id:0,
      input_comment: props.selected_free_input != undefined && props.selected_free_input != "" ? props.selected_free_input :  "",
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.per_page = [{id:1,value:10}, {id:2, value:20},{id:3, value:50},{id:4, value:100},];
  }

  async componentDidMount() {
    if(this.state.screen_keyboard_use === 0){
      let modal_dialog = document.getElementsByClassName("prescript-medicine-select-modal")[0].getElementsByClassName("modal-dialog")[0];
      if(modal_dialog !== undefined && modal_dialog != null){
        modal_dialog.style['max-width'] = '55vw';
      }
      let modal_content = document.getElementsByClassName("prescript-medicine-select-modal")[0].getElementsByClassName("modal-content")[0];
      if(modal_content !== undefined && modal_content != null){
        modal_content.style['width'] = '55vw';
      }
    }
    if(this.props.MasterName === "品名"){
      let path = "/app/api/v2/order/treat/getItemCategories";
      let post_data = {
      };
      if(this.props.function_id !== undefined && this.props.function_id != null){
        path = "/app/api/v2/order/guidance/getItemCategories";
        post_data = {
          function_id:this.props.function_id,
        };
      }
      let { data } = await axios.post(path, {params: post_data});
      if(data.length > 0){
        let item_categories = this.state.item_categories;
        let index = 1;
        data.map(item=>{
          item_categories[index] = {id: item.item_category_id, value: item.name};
          index++;
        });
        this.setState({item_categories});
      }
    }
    if ((this.props.MasterName !== "病名")) {
      this.setCaretPosition('search_input', this.state.cur_caret_pos);
    } else {
      document.getElementById("select_pannel_modal").focus();
      this.setState({selected_index:0});
    }
    if(this.props.MasterName === "訪問診療患者"){
      await this.getPlaceGroup();
      await this.getVisitGroup();
    }
    if (this.props.MasterName !== "注射"  && this.props.MasterName !== "薬剤"){
      await this.getMasterData();
    } else  {
      this.setState({Load: true});
    }
    // let history_list = document.getElementsByClassName("prescript-medicine-select-modal")[0].getElementsByClassName("history-list")[0];
    var tbody = document.getElementsByClassName('tbody')[0];
    // if(history_list !== undefined && history_list != null){
    if(tbody !== undefined && tbody != null){
      if(this.props.MasterName === "訪問診療患者"){
        tbody.style['height'] = this.state.screen_keyboard_use === 0 ? 'calc(650px - 23rem)' : 'calc(650px - 20.7rem)';
      } else {
        // history_list.style['height'] = '320px';
        if (this.props.is_pagenation){
          tbody.style['height'] = '285px';
        } else {
          tbody.style['height'] = this.props.free_input ? '314px':'338px';
        }
      }
    }
    document.getElementById("search_input").focus();
  }

  getPlaceGroup =async()=>{
    let path = "/app/api/v2/visit/get/visit_place";
    let post_data = {
      is_enabled:1,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.length > 0){
          let visit_place = this.state.visit_place;
          res.map(item=>{
            let place = {};
            place.id = item.visit_place_id;
            place.value = item.name;
            visit_place.push(place);
          })
          this.setState({
            visit_place,
          });
        }
      })
      .catch(() => {
      });
  }

  getVisitGroup =async()=>{
    let path = "/app/api/v2/visit/get/visit_group";
    let post_data = {
      visit_place_id:this.state.visit_place_id,
      is_enabled:1,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.length > 0){
          let visit_group = this.state.visit_group;
          let group;
          if(this.state.visit_place_id === 0){
            group = { id: 0, value: "全て" };
          } else {
            group = { id: 0, value: "" };
          }
          visit_group.push(group);
          res.map(item=>{
            group = {};
            group.id = item.visit_group_id;
            group.value = item.name;
            visit_group.push(group);
          })
          this.setState({
            visit_group,
          });
        }

      })
      .catch(() => {
      });
  }

  onKeyPressed(e) {
    let data = [];
    if (this.state.MasterCodeData != null && this.state.MasterCodeData != undefined && this.state.MasterCodeData.length > 0) {
      if (this.state.pageOfItems != undefined && this.state.pageOfItems != null && this.state.pageOfItems.length > 0) {
        data = this.state.pageOfItems;  
      } else {
        data = this.state.MasterCodeData;
      }
    }
    let selected_index = this.state.selected_index;
    if (e.keyCode === KEY_CODES.up) {
      this.setState({selected_index:selected_index < 1 ? data.length - 1 : selected_index - 1},
        () => {
          this.scrollToelement();
        }
      );
      if (this.props.MasterName === "病名" || this.props.MasterName === "注射" || this.props.MasterName === "薬剤" || this.props.MasterName === "品名") {
        $("#search_input").blur();
        document.getElementById("select_pannel_modal").focus();
      }
    }
    if(e.keyCode === KEY_CODES.down) {
      this.setState({selected_index:(selected_index == (data.length - 1)) ? 0 : (selected_index + 1)},
        () => {
          this.scrollToelement();
        }
      );
      if(this.props.MasterName === "病名" || this.props.MasterName === "注射" || this.props.MasterName === "薬剤" || this.props.MasterName === "品名") {
        $("#search_input").blur();
        document.getElementById("select_pannel_modal").focus();
      }
    }
    if (e.keyCode === KEY_CODES.enter) {
      e.stopPropagation();
      e.preventDefault();
      if(this.props.MasterName === "病名" || this.props.MasterName === "注射" || this.props.MasterName === "薬剤" || this.props.MasterName === "品名") {
        let nFlag = $("#search_input").is(':focus');
        if(!nFlag){this.handleOk();}
      }
    }
  }

  scrollToelement = () => {
    // let scrollTop = 0;
    // let scrollHeight = 0;
    // let scroll_area_obj = document.getElementsByClassName("scroll-area")[0];
    // if(scroll_area_obj != undefined && scroll_area_obj != null){
    //   scrollTop = scroll_area_obj.scrollTop;
    //   scrollHeight = scroll_area_obj.offsetHeight;
    //   let tr_obj = document.getElementsByClassName("row-"+this.state.selected_index)[0];
    //   let selected_obj_Top = 0;
    //   let selected_obj_Height = 0;
    //   if(tr_obj != undefined && tr_obj != null){
    //     selected_obj_Top = tr_obj.offsetTop;
    //     selected_obj_Height = tr_obj.offsetHeight;
    //   }
    //   if(((selected_obj_Top - selected_obj_Height - scrollTop) > 0) && ((selected_obj_Top - scrollTop) > scrollHeight)){
    //     scroll_area_obj.scrollTop = selected_obj_Top - (selected_obj_Height * 2);
    //   }
    //   if((selected_obj_Top - selected_obj_Height - scrollTop) < 0){
    //     scroll_area_obj.scrollTop = selected_obj_Top - (selected_obj_Height * 3);
    //   }
    // }
    
    const els = $(".prescript-medicine-select-modal [class*=selected]");
    const pa = $(".prescript-medicine-select-modal .modal-body .scroll-area");
    const th = $(".prescript-medicine-select-modal .modal-body .thead-area");
    if (els.length > 0 && pa.length > 0 && th.length > 0) {
      const thHight = $(th[0]).height();
      const elHight = $(els[0]).height();
      // const elTop = $(els[0]).position().top;
      const elTop = thHight + (elHight+1)*this.state.selected_index;
      const paHeight = $(pa[0]).height();
      const scrollTop = elTop - (paHeight - elHight) / 2;
      $(pa[0]).scrollTop(scrollTop);
    }
  };

  getMasterData = async()  =>{
    let path = "";
    let post_data = {};
    if(this.state.Load){
      this.setState({Load:false});
    }
    if(this.props.MasterName === "行為"){
      path = "/app/api/v2/order/treat/searchPracticeByDepartment";
      post_data = {
        department_id:this.state.department_id,
        name:this.state.search_word,
        name_search_type:this.state.search_type,
      };
    }
    if(this.props.MasterName === "品名"){
      path = "/app/api/v2/order/treat/searchItem";
      post_data = {
        name:this.state.search_word,
        name_search_type:this.state.search_type,
        item_category_id:this.state.item_category_id,
      };
      if(this.props.function_id !== undefined && this.props.function_id != null){
        path = "/app/api/v2/order/guidance/searchItem";
        post_data = {
          function_id:this.props.function_id,
          name:this.state.search_word,
          name_search_type:this.state.search_type,
          item_category_id:this.state.item_category_id,
        };
      }
    }
    if(this.props.MasterName === "病名"){
      this.setState({cur_caret_pos: this.state.search_word.length});
      // this.setCaretPosition('search_input', this.state.search_word.length);
      path = "/app/api/v2/master/disease/search/disease_name";
      post_data = {
        word:this.state.search_word,
        name_search_type:this.state.search_type,
      };
    }
    if(this.props.MasterName === "注射" || this.props.MasterName === "薬剤"){
      let base_modal = document.getElementsByClassName("routine-input-panel-modal")[0];
      if(base_modal !== undefined && base_modal != null){
        base_modal.style['z-index'] = 1040;
      }
      this.setState({cur_caret_pos: this.state.search_word.length});
    }
    if(this.props.MasterName === "薬剤"){
      path = "/app/api/v2/master/point/search/index";
      post_data = {
        diagnosis_division:this.state.medicine_category === "内服" ? 21 : 23,
        word: this.state.search_word,
        name_search_type:this.state.search_type,
      };
    }
    if(this.props.MasterName === "注射"){
      path = "/app/api/v2/master/point/search/index";
      post_data = {
        word: this.state.search_word,
        mode: "injection",
        name_search_type:this.state.search_type,
      };
    }
    if(this.props.MasterName === "検査項目"){
      path = "/app/api/v2/master/search_examination_order";
      post_data = {
        name: this.state.search_word,
        name_search_type:this.state.search_type,
      };
    }
    if(this.props.MasterName === "訪問診療患者"){
      path = "/app/api/v2/visit/get/visit_patient";
      post_data = {
        name:this.state.search_word,
        name_search_type:this.state.search_type,
        visit_place_id:this.state.visit_place_id,
        visit_group_id:this.state.visit_group_id,
      };
    }
    if (this.props.MasterName === ALLERGY_CATEGORY_TITLE[this.props.item_category_id]){
      path = "/app/api/v2/master/allergy/search_master";
      post_data = {
        name:this.state.search_word,
        name_search_type:this.state.search_type,
        category_id: this.props.item_category_id
      };
    }
    if (this.props.bolierplate_search == true && this.props.function_id===BOILERPLATE_FUNCTION_ID_CATEGORY.ALLERGY){
      path = "/app/api/v2/master/allergy/search_comment_master";
      post_data = {
        name:this.state.search_word,
        name_search_type:this.state.search_type,
        function_id:BOILERPLATE_FUNCTION_ID_CATEGORY.ALLERGY,
        use_place: this.props.MasterName
      };
    }
    if (this.props.MasterName !== "注射" && this.props.MasterName !== "薬剤") {
      await axios.post(path, {params: post_data}).
      then((res) => {
        this.setState({
          MasterCodeData: res.data,
          Load:true,
        }, ()=>{
          document.getElementById("select_pannel_modal").focus();
        });
      })
        .catch(() => {
        });
    } else {
      await axios.get(path, {params: post_data}).
      then((res) => {
        this.setState({
          MasterCodeData: res.data,
          Load:true,
        });
      })
        .catch(() => {
        });
    }
  }

  handleOk = () => {
    if (this.state.selected_index !== -1) {
      if (this.props.free_input && this.props.function_id == BOILERPLATE_FUNCTION_ID_CATEGORY.ALLERGY && this.state.input_comment !== ""){
        this.props.selectMaster({name:this.state.input_comment});
      } else {
        if (this.state.pageOfItems != undefined && this.state.pageOfItems.length > 0) {
          this.props.selectMaster(this.state.pageOfItems[this.state.selected_index]);
        } else 
        this.props.selectMaster(this.state.MasterCodeData[this.state.selected_index]);
      }
    } else {
      var base_modal = document.getElementsByClassName("prescript-medicine-select-modal")[0];
      if(base_modal !== undefined && base_modal != null){
        base_modal.style['z-index'] = 1040;
      }
      if (this.props.free_input && this.props.function_id == BOILERPLATE_FUNCTION_ID_CATEGORY.ALLERGY && this.state.input_comment !== ""){
        this.props.selectMaster({name:this.state.input_comment});
        return;
      }
      this.setState({
        alert_messages: "選択されていません。",
      });
    }
  };

  selectMaster = (index) => {
    document.getElementById("select_pannel_modal").focus();
    this.setState({
      selected_index: index,
    });
  };

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

  addInputWord = (val) => {
    let search_word = this.state.search_word;
    let cur_caret_pos = this.state.cur_caret_pos;
    search_word = search_word.slice(0, cur_caret_pos) + val + search_word.slice(cur_caret_pos);
    this.setState({search_word, cur_caret_pos:cur_caret_pos + 1}, ()=>{
      var search_input_obj = document.getElementById("search_input");
      search_input_obj.onfocus = this.setCaretPosition('search_input', this.state.cur_caret_pos);
      search_input_obj = null;
      this.getMasterData();
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
        this.getMasterData();
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
      this.getMasterData();
    }
  }

  selectSearchType = (value) => {
    this.setState({ search_type: value}, ()=>{
      this.getMasterData();
    });
  };

  selectSearchTypeNo = (e) => {
    this.setState({ search_type: parseInt(e.target.value)}, ()=>{
      this.getMasterData();
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

  getDepartment = e => {
    this.setState({
      department_id:e.target.id,
    })
  };

  getItemCategory = e => {
    this.setState({
      item_category_id:e.target.id,
    })
  };

  closeModal =()=>{
    var base_modal = document.getElementsByClassName("prescript-medicine-select-modal")[0];
    if(base_modal !== undefined && base_modal != null){
      base_modal.style['z-index'] = 1050;
    }
    this.setState({
      alert_messages: "",
    });
  }

  selectCategory = (e) => {
    this.setState({ medicine_category: e.target.value}, ()=>{
      this.getMasterData();
    });
  };

  getPlaceSelect = e => {
    this.setState({
      visit_place_id: parseInt(e.target.id),
      visit_group_id: 0,
      visit_group: [],
    }, ()=>{
      this.getVisitGroup();
    });
  };

  getGroupSelect = e => {
    this.setState({
      visit_group_id: parseInt(e.target.id),
    });
  };

  getDisplayNumber = e => {
    this.setState({
      display_id:parseInt(e.target.id),
      display_number: parseInt(e.target.value)
    });
  };

  onChangePage(pageOfItems) {
    this.setState({ pageOfItems: pageOfItems });
  }

  getInputText =(e) =>{
    this.setState({input_comment:e.target.value});
  }

  selectItem=(index)=>{
    this.setState({selected_index: index}, ()=>{
      this.handleOk();
    });
  }


  render() {
    const {MasterCodeData, pageOfItems} = this.state;
    return  (
      <Modal
        show={true}
        id="select_pannel_modal"
        className="custom-modal-sm prescript-medicine-select-modal"
        onKeyDown={this.onKeyPressed}
      >
        <Modal.Header>
          <Modal.Title>{this.props.MasterName}選択パネル</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="left-area" style={{width:this.state.screen_keyboard_use === 0 ? "100%":"60%"}}>
              {this.props.MasterName === '訪問診療患者' && (
                <div className={'flex mb-10'}>
                  <div className = "select-department">
                    <SelectorWithLabel
                      options={this.state.visit_place}
                      title="施設"
                      getSelect={this.getPlaceSelect}
                      departmentEditCode={this.state.visit_place_id}
                    />
                  </div>
                  <div className = "select-department select-visit-group">
                    <SelectorWithLabel
                      options={this.state.visit_group}
                      title="グループ"
                      getSelect={this.getGroupSelect}
                      departmentEditCode={this.state.visit_group_id}
                    />
                  </div>
                </div>
              )}
              <div className={'flex mb-10'}>
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
                {this.props.MasterName === "行為" && (
                  <div className={'select-department'}>
                    <SelectorWithLabel
                      title="対象科"
                      options={this.departmentOptions}
                      getSelect={this.getDepartment}
                      departmentEditCode={this.state.department_id}
                    />
                  </div>
                )}
                {this.props.MasterName === "品名" && (
                  <div className={'select-department'}>
                    <SelectorWithLabel
                      title="分類"
                      options={this.state.item_categories}
                      getSelect={this.getItemCategory}
                      isDisabled = {(this.props.type == 'obtain_tech' || this.props.function_id == FUNCTION_ID_CATEGORY.ENDOSCOPE) ? true:false}
                      departmentEditCode={this.state.item_category_id}
                    />
                  </div>
                )}
                {this.props.MasterName === "薬剤" && (
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
                                checked={this.state.medicine_category === item ? true : false}
                              />
                            </>
                          );
                        })
                        }
                      </>
                    </div>
                  </div>
                )}                
                <div onClick={this.getMasterData.bind(this)} className={'search-btn'} style={{cursor:"pointer"}}><span>検索</span></div>
              </div>
              {this.state.screen_keyboard_use === 0 && (
                <div className={'search_type_no flex'}>
                  <Radiobox
                    value={0}
                    label={'前方一致'}
                    name="search_type_no"
                    getUsage={this.selectSearchTypeNo.bind(this)}
                    checked={this.state.search_type === 0}
                  />
                  <Radiobox
                    value={1}
                    label={'部分一致'}
                    name="search_type_no"
                    getUsage={this.selectSearchTypeNo.bind(this)}
                    checked={this.state.search_type === 1}
                  />
                </div>
              )}
              <div className="history-list">
                <table className="table-scroll table table-bordered" id={`inspection-pattern-table`}>
                  <thead className={'thead-area'}>
                  <tr>
                    {this.props.MasterName === '訪問診療患者' ? (
                      <>
                        <th style={{width:'8rem'}}>患者番号</th>
                        <th style={{width:'10rem'}}>氏名</th>
                        <th style={{width:'10rem'}}>カナ氏名</th>
                        <th style={{width:'4rem'}}>性別</th>
                        <th style={{width:'9rem'}}>訪問診療先</th>
                        <th>訪問診療グループ</th>
                      </>
                    ) : (
                      <th style={{width:"50%"}}>表示名称</th>
                    )}
                  </tr>
                  </thead>
                  <tbody className='tbody scroll-area'>
                  {this.state.Load === false ? (
                    <>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </>
                  ) : (
                    <>
                      {(!this.props.is_pagenation && MasterCodeData != null && MasterCodeData.length > 0) && (
                        MasterCodeData.map((item, index) => {
                          if(item.is_enabled !== 0){
                            return (
                              <>
                                <tr
                                  className={'row-'+index + ' '+(this.state.selected_index === index ? "selected cursor" : "cursor")}
                                  onClick={this.selectMaster.bind(this, index)}
                                  onDoubleClick={this.selectItem.bind(this, index)}
                                >
                                  {this.props.MasterName === '訪問診療患者' ? (
                                    <>
                                      <td style={{width:'8rem', textAlign:"right"}}>{item.patient_number}</td>
                                      <td style={{width:'10rem'}}>{item.patient_name}</td>
                                      <td style={{width:'10rem'}}>{item.patient_name_kana}</td>
                                      <td style={{width:'4rem'}}>{item.gender == 1 ? "男性":"女性"}</td>
                                      <td style={{width:'9rem'}}>{item.place_name}</td>
                                      <td>{item.group_name}</td>
                                    </>
                                  ):(
                                    <td>{item.name}</td>
                                  )}
                                </tr>
                              </>
                            )
                          }
                        })
                      )}
                      {(this.props.is_pagenation && pageOfItems != null && pageOfItems.length > 0) && (
                        pageOfItems.map((item, index) => {
                          if(item.is_enabled !== 0){
                            return (
                              <>
                                <tr
                                  className={'row-'+index + ' '+(this.state.selected_index === index ? "selected cursor" : "cursor")}
                                  onClick={this.selectMaster.bind(this, index)}
                                  onDoubleClick={this.selectItem.bind(this, index)}
                                >
                                  {this.props.MasterName === '訪問診療患者' ? (
                                    <>
                                      <td style={{width:'8rem'}} className={'text-center'}>{item.patient_number}</td>
                                      <td style={{width:'10rem'}}>{item.patient_name}</td>
                                      <td style={{width:'10rem'}}>{item.patient_name_kana}</td>
                                      <td style={{width:'4rem'}} className={'text-center'}>{item.gender == 1 ? "男性":"女性"}</td>
                                      <td style={{width:'9rem'}}>{item.place_name}</td>
                                      <td>{item.group_name}</td>
                                    </>
                                  ):(
                                    <td>{item.name}</td>
                                  )}
                                </tr>
                              </>
                            )
                          }
                        })
                      )}
                    </>
                  )}
                  </tbody>
                </table>
              </div>
              <div className="free-input">
              {this.props.free_input && (
                <InputBoxTag
                  label=""
                  type="text"
                  getInputText={this.getInputText.bind(this)}
                  value={this.state.input_comment}
                />
              )}
              </div>
              {this.state.Load === true && this.props.is_pagenation && (
                <>
                  <div className='flex'>
                    <div className={'select-department footer-select'} style={{marginTop:"1rem"}}>
                      <SelectorWithLabel
                        options={this.per_page}
                        title="表示件数"
                        getSelect={this.getDisplayNumber}
                        departmentEditCode={this.state.display_id}
                      />
                    </div>
                    <Pagination
                      items={MasterCodeData}
                      onChangePage={this.onChangePage.bind(this)}
                      pageSize={this.state.display_number}
                    />
                  </div>
                </>
              )}
            </div>
            {this.state.screen_keyboard_use === 1 && (
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
            )}
          </Wrapper>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          {/* <Button className="cancel-btn" id='select-haruka-cancel-id' onClick={this.props.closeModal}>キャンセル</Button>
          <Button className="red-btn" onClick={this.handleOk}>選択</Button> */}
          <div                 
            onClick={this.props.closeModal}
            className={this.state.curFocus === 1 ? "custom-modal-btn cancel-btn focus " : "custom-modal-btn cancel-btn"}
            style={{cursor:"pointer"}}
          >
            <span>キャンセル</span>
          </div>
          <div id="system_confirm_Ok" className={this.state.curFocus === 0 ? "custom-modal-btn red-btn focus " : "custom-modal-btn red-btn"}
            onClick={this.handleOk}
            style={{cursor:"pointer"}}
          >
            <span>選択</span>
            </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

SelectPannelHarukaModal.contextType = Context;

SelectPannelHarukaModal.propTypes = {
  closeModal: PropTypes.func,
  selectMaster: PropTypes.func,
  MasterName : PropTypes.string,
  item_category_id: PropTypes.number,
  searchInitName: PropTypes.string,
  function_id: PropTypes.number,
  department_id: PropTypes.number,
  type:PropTypes.string,
  selected_free_input:PropTypes.string,
  is_pagenation:PropTypes.bool,
  free_input:PropTypes.bool,
  bolierplate_search:PropTypes.bool,
};

export default SelectPannelHarukaModal;
