import React, { Component } from "react";
import DialSideBar from "./DialSideBar";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import { FAMILY_CLASS } from "~/helpers/constants";
import PersonCell from "./PersonCell"
import {Row, Col } from "react-bootstrap";
import Button from "../../atoms/Button";
import FamilyModal from "./modals/FamilyModal"
// import { Line, SteppedLineTo } from 'react-lineto';
import * as apiClient from "~/api/apiClient";
// import * as methods from "~/components/templates/Dial/DialMethods";
import * as sessApi from "~/helpers/cacheSession-utils";
import DialPatientNav from "./DialPatientNav";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialFamilyPrintPreview from './DialFamilyPrintPreview';
import {makeList_code, makeList_codeName} from "~/helpers/dialConstants";
import PropTypes from "prop-types";
import $ from 'jquery';

const Card = styled.div`
  position: fixed;  
  top: 70px;
  width: calc(100% - 390px);
  left:200px;
  margin: 0px;
  height: 100%;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }
  .others {
    position:absolute;
    right:1.25rem;
    button {
        margin-left: 0.2rem;
        margin-bottom: 0px;
        margin-top: 0.3rem;
    }
    span {
        font-size: 1rem;
    }
  }
  .disable-button {
    background: rgb(101, 114, 117);
    cursor: auto;
  }
  ul{
    margin-bottom: 0px;
  }
`;
 const Wrapper = styled.div`
  height: calc( 98vh - 8rem - 70px);
  padding-top:0px;
  width:100%;
  .left{
    float:left;
  }
  .right{
    float:right;
  }
  .flex{
    display:flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .padding-50{
    margin-left:3.125rem;
    width:90%;
  }
  .row{
    margin-top: -5px;
    height:6.25rem;
  }
  .topic{
    margin-top:1.875rem;
  }
  .between-row{    
    margin-left:-15px;    
  }
  .topic.row{
    text-align: right;
    padding-right: 1.25rem;
    vertical-align: middle;
    display: block;
    padding-top: 2.2rem;
  }
 `;

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);    
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;    
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;


const ContextMenu = ({ visible, x,  y,  parent,  row_index, col_index}) => {
  if (visible) {
      return (
          <ContextMenuUl>
              <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                  <li><div onClick={() => parent.contextMenuAction(row_index, col_index, "edit")}>編集</div></li>
                  <li><div onClick={() => parent.contextMenuAction(row_index, col_index, "delete")}>クリア</div></li>
              </ul>
          </ContextMenuUl>
      );
  } else {
      return null;
  }
};
const odd_row =[0,1,2,3,4,5,6,7,8];
const even_row =[0,1,2,3,4,5,6,7];
class DialFamilyBody extends Component {
  constructor() {
    super();
    // Object.entries(methods).forEach(([name, fn]) =>        
    //   name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    // );

    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    var familyMasterData = code_master['家族歴'];    
    familyMasterData = familyMasterData.filter(x=>x.name != '本人');    
    this.state = {      
      isCreateFamilyModal:false,
      row_index:null,
      col_index:null,
      person_info:null,  
      family_info:[],
      isOpenPrintPreview:false,
      isConfirmMoveOtherPage:false,
      familyMasterData,
      family_codes:makeList_code(familyMasterData),
      family_code_options:makeList_codeName(familyMasterData, 1),
      confirm_alert_title:'',
      isDeleteConfirmModal:false,

      trigger_flag:false,
    };
    this.change_flag = 0;
    this.go_otherUrl = '';
  }  

  componentDidMount() {
    if(this.props.patientInfo != undefined && this.props.patientInfo != null){
      this.selectPatient(this.props.patientInfo);
    }
    this.cell_width = 100;
    this.gap_height = 30;
    this.gap_between_cell_width = 0;
    this.block_width = 0;
    let html_obj = document.getElementsByTagName("html")[0];
    let width = html_obj.offsetWidth;
    if(parseInt(width) < 1367){
      this.cell_width = 12.5 * 7;
      this.gap_height = 12.5 * 1.875;
    } else if(parseInt(width) < 1441){
      this.cell_width = 13 * 7;
      this.gap_height = 13 * 1.875;
    } else if(parseInt(width) < 1601){
      this.cell_width = 14 * 7;
      this.gap_height = 14 * 1.875;
    } else if(parseInt(width) < 1681){
      this.cell_width = 15 * 7;
      this.gap_height = 15 * 1.875;
    } else if(parseInt(width) > 1919){
      this.cell_width = 16 * 7;
      this.gap_height = 16 * 1.875;
    }
    this.block_width = (width - 390) * 11/12- 30;
    this.gap_between_cell_width = (this.block_width - this.cell_width * 9)/8;    

    // eslint-disable-next-line consistent-this
    const that = this;
    $(document).ready(function(){
      $(window).resize(function(){
        let html_obj = document.getElementsByTagName("html")[0];
        let width = html_obj.offsetWidth;
        if(parseInt(width) < 1367){
          that.cell_width = 12.5 * 7;
          that.gap_height = 12.5 * 1.875;
        } else if(parseInt(width) < 1441){
          that.cell_width = 13 * 7;
          that.gap_height = 13 * 1.875;
        } else if(parseInt(width) < 1601){
          that.cell_width = 14 * 7;
          that.gap_height = 14 * 1.875;
        } else if(parseInt(width) < 1681){
          that.cell_width = 15 * 7;
          that.gap_height = 15 * 1.875;
        } else if(parseInt(width) > 1919){
          that.cell_width = 16 * 7;
          that.gap_height = 16 * 1.875;
        }
        that.block_width = (width - 390) * 11/12 - 30;        
        that.gap_between_cell_width = (that.block_width - that.cell_width * 9)/8;
        that.drawLine('resize');
      });
    });
  }

  componentDidUpdate() {
    this.drawLine('update');
  }

  drawLine = () => {
    this.top_pairs = [];
    this.bottom_pairs = [];
    this.top_bottom_pairs = [];
    var top_pairs = null;
    var bottom_pairs = null;
    var top_single_colors = null;
    var bottom_single_colors = null;
    var top_bottom_pairs = null;
    for (var i = 0;i < 4; i++){
      top_pairs = this.getTopColors(i).pairs_result;
      this.top_pairs.push(top_pairs);
      bottom_pairs = this.getBottomColors(i).pairs_result;
      this.bottom_pairs.push(bottom_pairs);
      top_single_colors = this.getTopColors(i).single_result;
      bottom_single_colors = this.getBottomColors(i).single_result;
      top_bottom_pairs = this.matchTopBottomPairs(top_single_colors, bottom_single_colors);      
      this.top_bottom_pairs.push(top_bottom_pairs);

      var ctx = $('.between-row')[i];
      if (ctx != undefined){
        ctx = $('.between-row')[i].getContext('2d');
        ctx.clearRect(0, 0, $('.between-row')[i].offsetWidth, $('.between-row')[i].offsetHeight);
        if (top_pairs != null) {          
          top_pairs.map(item => {
            ctx.beginPath();
            ctx.strokeStyle = item.color;
            ctx.lineWidth = 2;
            ctx.moveTo(item.first_x_position, this.gap_height);
            ctx.lineTo(item.first_x_position, this.gap_height/2);
            ctx.lineTo(item.second_x_position, this.gap_height/2);
            ctx.lineTo(item.second_x_position, this.gap_height);          
            ctx.stroke();
          })
        }
        if (bottom_pairs != null) {
          bottom_pairs.map(item => {
            ctx.beginPath();
            ctx.strokeStyle = item.color;
            ctx.lineWidth = 2;
            ctx.moveTo(item.first_x_position, 0);
            ctx.lineTo(item.first_x_position, this.gap_height/2);
            ctx.lineTo(item.second_x_position, this.gap_height/2);
            ctx.lineTo(item.second_x_position, 0);
            ctx.stroke();
          })
        }
        if (top_bottom_pairs != null && top_bottom_pairs.length > 0){
          top_bottom_pairs.map(item => {
            ctx.beginPath();
            ctx.strokeStyle = item.color;
            ctx.lineWidth = 2;
            ctx.moveTo(item.bottom_x_position, 0);
            ctx.lineTo(item.bottom_x_position, this.gap_height/2);
            ctx.lineTo(item.top_x_position, this.gap_height/2);
            ctx.lineTo(item.top_x_position, this.gap_height);
            ctx.stroke();
          })
        }
      }      
    }
  }

  matchTopBottomPairs (top_colors, bottom_colors) {
    if (top_colors == undefined || top_colors == null || top_colors.length == 0) return null;
    if (bottom_colors == undefined || bottom_colors == null || bottom_colors.length == 0) return null;
    var top_bottom_pairs = [];
    top_colors.map(top_item => {
      bottom_colors.map(bottom_item => {
        if (top_item.color == bottom_item.color) {
          var duplicate_item = top_bottom_pairs.filter(x => x.color == top_item.color);
          if (duplicate_item.length == 0){
            top_bottom_pairs.push({
              bottom_x_position:bottom_item.x_position,
              top_x_position:top_item.x_position,
              color:top_item.color,
              bottom_index:bottom_item.index,
              top_index:top_item.index,
            })
          }
        }
      })
    })
    return top_bottom_pairs;
  }

  getBottomColors = (index) => {
    var result = {};
    var pairs_result = [];
    var single_result = [];
    var targets = null;    
    switch(index){
      case 0:
        targets = $('.grandparents.contents').find('.bottom-color');        
        break;
      case 1:        
        targets = $('.parents.contents').find('.bottom-color');        
        break;
      case 2:        
        targets = $('.self.contents').find('.bottom-color');        
        break;
      case 3:
        targets = $('.child.contents').find('.bottom-color');        
        break;        
    }
    
    // eslint-disable-next-line consistent-this
    const that = this;
    targets.each(function(sub_index){      
      var bottom_backcolor = $(this).css( "background-color");      
      if (bottom_backcolor != 'rgb(169, 169, 169)'){
        var duplicate_item = single_result.filter(x => x.color == bottom_backcolor);
        var first_x_position, second_x_position;
        if (duplicate_item.length == 0){
          if ( index % 2 == 0){
            first_x_position = that.cell_width/2 + sub_index * (that.cell_width + that.gap_between_cell_width);            
          } else {
            first_x_position = that.cell_width + sub_index * (that.cell_width + that.gap_between_cell_width);            
          }
          single_result.push({index:sub_index, color:bottom_backcolor, x_position:first_x_position});
        } else {
          var first_index = duplicate_item[duplicate_item.length - 1].index;
          var second_index = sub_index;
          
          if ( index % 2 == 0){
            first_x_position = that.cell_width/2 + first_index * (that.cell_width + that.gap_between_cell_width);
            second_x_position = that.cell_width/2 + second_index * (that.cell_width + that.gap_between_cell_width);
          } else {
            first_x_position = that.cell_width + first_index * (that.cell_width + that.gap_between_cell_width);
            second_x_position = that.cell_width + second_index * (that.cell_width + that.gap_between_cell_width);
          }
          pairs_result.push({
            first_index:first_index,
            second_index:second_index,
            first_x_position,
            second_x_position,
            color:duplicate_item[duplicate_item.length - 1].color,
          })
        }
      }
    })
    result= {
      single_result : single_result,
      pairs_result : pairs_result,
    }
    return result;
  }

  getTopColors = (index) => {
    var result = [];
    var targets = null;
    var pairs_result = [];
    var single_result = [];    
    switch(index){
      case 0:
        targets = $('.parents.contents').find('.top-color');        
        break;
      case 1:        
        targets = $('.self.contents').find('.top-color');        
        break;
      case 2:        
        targets = $('.child.contents').find('.top-color');        
        break;
      case 3:
        targets = $('.grandchild.contents').find('.top-color');        
        break;        
    }

    // eslint-disable-next-line consistent-this
    const that = this;
    targets.each(function(sub_index){
      var top_backcolor = $(this).css( "background-color");      
      if (top_backcolor != 'rgb(169, 169, 169)'){
        var duplicate_item = single_result.filter(x => x.color == top_backcolor);
        var first_x_position, second_x_position;
        if (duplicate_item.length == 0){
          if ( index % 2 == 1){
            first_x_position = that.cell_width/2 + sub_index * (that.cell_width + that.gap_between_cell_width);            
          } else {
            first_x_position = that.cell_width + sub_index * (that.cell_width + that.gap_between_cell_width);            
          }
          single_result.push({index:sub_index, color:top_backcolor, x_position:first_x_position});
        } else {
          var first_index = duplicate_item[duplicate_item.length - 1].index;
          var second_index = sub_index;          
          if ( index % 2 == 1){
            first_x_position = that.cell_width/2 + first_index * (that.cell_width + that.gap_between_cell_width);
            second_x_position = that.cell_width/2 + second_index * (that.cell_width + that.gap_between_cell_width);
          } else {
            first_x_position = that.cell_width + first_index * (that.cell_width + that.gap_between_cell_width);
            second_x_position = that.cell_width + second_index * (that.cell_width + that.gap_between_cell_width);
          }
          pairs_result.push({
            first_index:first_index,
            second_index:second_index,
            first_x_position,
            second_x_position,
            color:duplicate_item[duplicate_item.length - 1].color,
          })
        }
      }
    })
    result= {
      single_result : single_result,
      pairs_result : pairs_result,
    }
    return result;
  }

  handleClick = (e, col_index, row_index) => {
    if (e.type === "contextmenu") {
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
          .getElementById("right")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("right")
              .removeEventListener(`scroll`, onScrollOutside);
          });            
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX-200,
          y: this.props.type != undefined && this.props.type == "page" ? e.clientY + window.pageYOffset-50 : e.clientY + window.pageYOffset-100,
          col_index: col_index,
          row_index: row_index,
        },
        
      });
    }
  }
      
  contextMenuAction = (row_index, col_index, type) => {
    if (type === "edit"){
        this.editData(row_index, col_index);
    }
    if (type === "delete"){
      var family_info = this.state.family_info;
      var index = family_info.findIndex(item => (item.colmun_number == col_index && item.generation == row_index));
      if ( index == -1 ) return;
      this.setState({
        isDeleteConfirmModal:true,
        confirm_message:'この家族歴を削除しますか？',
        row_index,
        col_index,
      })
    }
  };

  editData = (row_index, col_index) => {
    // let modal_data = this.state.table_data[index];
    this.setState({
        row_index,
        col_index,        
        person_info:this.searchPersonInfo(row_index, col_index),
        isCreateFamilyModal: true,
    });
  };

  deleteData = async (row_index, col_index) => {
    this.cancelSave();
    let person_info = this.searchPersonInfo(row_index, col_index);
    if (person_info.is_this_patient){
      window.sessionStorage.setItem("alert_messages", '患者本人は削除できません。');
      return;
    }
    
    var family_info = this.state.family_info;
    var index = family_info.findIndex(item => (item.colmun_number == col_index && item.generation == row_index));
    if ( index == -1 ) return;
    family_info.splice(index,1);
    this.setState({family_info});
    if (person_info.id > 0){
      this.setChangeFlag(1);
    } else {
      family_info.map(item => {
        if (item.id == 0) {
          this.setChangeFlag(1);
        }
      })
    }
    // let path = "/app/api/v2/dial/patient/family/delete";
    // let post_data = {
    //     params: {id:person_info.id},
    // };
    // await apiClient.post(path,  post_data);
    // this.handleOk();
  };

  searchPersonInfo = (row_index, col_index) => {
    var i = 0;
    var person_info = null;
    let family_info = this.state.family_info;
    if (family_info.length>0){
      for (i = 0; i < family_info.length; i++){
        if(family_info[i].generation == row_index && family_info[i].colmun_number == col_index){
          person_info = family_info[i];
          break;
        } 
      }
      return person_info;
    } else {
      return null;
    }
    
  }

  setChangeFlag=(change_flag = 0)=>{
    this.change_flag = change_flag;
    if (change_flag == 1){      
      sessApi.setObjectValue('dial_change_flag', 'dial_family', 1);
    } else {      
      sessApi.remove('dial_change_flag');
    }
  }
  

  closeModal = () => {
    this.setState({isCreateFamilyModal:false, isOpenPrintPreview:false,})
  }

  handleOk = (data) => {
    this.closeModal();
    var family_info = this.state.family_info;     
    var index = family_info.findIndex(item => (item.colmun_number == data.colmun_number && item.generation == data.generation));    
    if (index != -1 && family_info.length > 0){
      Object.keys(data).map(key => {
        if (family_info[index][key] != data[key]){
          this.setChangeFlag(1);
        }
      })
      family_info[index] = data;
    } else {
      family_info.push(data);
      this.setChangeFlag(1);
    }
    this.setState({family_info});
    this.forceUpdate();
  }

  equalArray(prev, after){
    if (after == undefined || after == null) return false;
    if (prev.length != after.length) return false;
    var result = true;
    prev.map((item, index) => {
      Object.keys(item).map(key => {
        if (item[key] != after[index][key]) result = true;
      })
    })
    return result;
  }

  selectPatient = (patientInfo) =>{
    this.setState({
      family_info:[],
      patient:patientInfo,      
    }, () => {
      this.getFamilyInfo(patientInfo);
      this.setChangeFlag(0);
    });    
  }

  getFamilyInfo = async(patientInfo) => {
    let path = "/app/api/v2/dial/patient/family/search";
    await apiClient
      ._post(path, {
          params: {patient:patientInfo}
      })
      .then((res) => {        
        this.setState({family_info:res});        
      })
      .catch(() => {

      });
  }

  save = () => {
    if (this.state.patient == undefined || this.state.patient == null) {
      // window.sessionStorage.setItem("alert_messages", '患者様を選択してください。');
      return;
    }
    
    if (this.change_flag == 0){
      // window.sessionStorage.setItem("alert_messages", "内容は変更されていません。");
      return;
    }

    this.setState({
      isUpdateConfirm:true,
      confirm_message:'変更内容を保存しますか？'
    })
  }

  saveFamily = async() => {
    let path = "/app/api/v2/dial/patient/family/register";
    const post_data = {
        params: this.state.family_info,
    };
    await apiClient.post(path, post_data)
      .then(() => {
        window.sessionStorage.setItem("alert_messages", "変更完了##" + '家族歴情報を変更しました。');
        this.setChangeFlag(0);
        this.cancelSave();
      });
  }

  confirmCancel() {    
    this.setState({        
        isConfirmMoveOtherPage:false,
        confirm_message: "",
        confirm_alert_title:'',
        isOpenPrintPreview:false,
        new_patient:null,
    });    
  }

  cancelSave() {
    this.setState({
      isUpdateConfirm:false,
      isDeleteConfirmModal:false,
      confirm_message: "",      
    });
  }

  openPrintPreview () {
    if (this.state.patient == undefined || this.state.patient == null) {
      // window.sessionStorage.setItem("alert_messages", '患者様を選択してください。');
      return;
    }
    if (this.change_flag) return;

    this.setState({isOpenPrintPreview:true})
  }

  goOtherPage = (url) => {
    this.go_otherUrl = url;
    if (this.change_flag === 1){
      this.setState({
        isConfirmMoveOtherPage:true,
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中'
      })
    } else {
      if (this.props.type != undefined && this.props.type == "page"){
        this.props.history.replace(url);
      } else {
          this.props.goOtherPage(url);
      }      
    } 
  }

  moveOtherPage = () => {
    this.confirmCancel();
    if (this.props.type != undefined && this.props.type == "page"){
      this.props.history.replace(this.go_otherUrl);
    } else {
        this.props.goOtherPage(this.go_otherUrl);
    }
    this.go_otherUrl = '';
  }

  render() {
    let person_info = {};
    let {type} = this.props;

    let {family_info, patient} = this.state;
    var register_tip = '';
    var print_tip = '';
    if (this.change_flag){
      print_tip = '登録していない変更内容があります';
    } else {
      register_tip = '内容は変更されていません';
    }

    return (      
      <>
        {type != undefined && type == "page" && (<>
          <DialSideBar 
            onGoto={this.selectPatient}
            history = {this.props.history}
            // ref = {ref => this.sideBarRef = ref}
          />
          <DialPatientNav
            patientInfo={this.state.patient}
            history = {this.props.history}
          />
        </>)}
        <Card className={type=="modal"?"modal_card insurance-modal":""}>
          <div className='flex'>
              <div className="title">家族歴</div>
              <div className='others'>
                  <Button onClick={this.goOtherPage.bind(this,"/dial/dial_patient?from_other=1")}>透析患者マスタ</Button>
                  <Button onClick={this.goOtherPage.bind(this,"/dial/dial_insurance")}>保険情報</Button>    
                  <Button onClick={this.goOtherPage.bind(this,"/dial/dial_emergency")}>緊急連絡先</Button>
                  <Button className="disable-button">家族歴</Button>                    
              </div>
          </div> 
          <Wrapper className={type=="modal"?"family-wrapper":""}>
            <Col md="1" className="left">
              <Row className="grandparents topic"><span>祖父母</span></Row>
              <Row className="parents topic"><span>両親</span></Row>
              <Row className="self topic"><span>本人兄弟</span></Row>
              <Row className="child topic"><span>子供</span></Row>
              <Row className="grandchild topic"><span>孫</span></Row>                         
            </Col>
            <Col md="11" className="right" id="right">
              <Row className="grandparents contents flex" style={{marginTop:'1.875rem'}}>
                {family_info.length>0 && odd_row.map((item) => {
                  person_info = this.searchPersonInfo(FAMILY_CLASS.GRAND_PARENT, item);
                  return (
                    <div key = {item} onContextMenu={e => this.handleClick(e, item, FAMILY_CLASS.GRAND_PARENT)} className={`row-0-col-${item}`}>
                      <PersonCell person_info={person_info} family_codes={this.state.family_codes}/>
                    </div>
                  )
                })}
              </Row>
              <canvas className="canvas between-row" width={this.block_width} height={this.gap_height}></canvas>
              <Row className="parents contents flex padding-50">
                {family_info.length>0 && even_row.map((item) => {
                  person_info = this.searchPersonInfo(FAMILY_CLASS.PARENT, item);
                  return (
                    <div key = {item} className={`row-1-col-${item}`} onContextMenu={e => this.handleClick(e, item, FAMILY_CLASS.PARENT)}>
                      <PersonCell person_info={person_info} family_codes={this.state.family_codes}/>
                    </div>
                  )
                })}
              </Row>
              <canvas className="canvas between-row" width={this.block_width} height={this.gap_height}></canvas>
              <Row className="self contents flex">
                {family_info.length>0 && odd_row.map((item) => {                  
                  person_info = this.searchPersonInfo(FAMILY_CLASS.SAME, item);
                  return (
                    <div key = {item} className={`row-2-col-${item}`} onContextMenu={e => this.handleClick(e, item, FAMILY_CLASS.SAME)}>
                      <PersonCell person_info={person_info} family_codes={this.state.family_codes}/>
                    </div>
                  )
                })}
              </Row>
              <canvas className="canvas between-row" width={this.block_width} height={this.gap_height}></canvas>
              <Row className="child contents flex padding-50">
                {family_info.length>0 && even_row.map((item) => {
                  person_info = this.searchPersonInfo(FAMILY_CLASS.CHILD, item);
                  return (
                    <div key = {item} className={`row-3-col-${item}`} onContextMenu={e => this.handleClick(e, item, FAMILY_CLASS.CHILD)}>
                      <PersonCell person_info={person_info} family_codes={this.state.family_codes}/>
                    </div>
                  )
                })}
              </Row>
              <canvas className="canvas between-row" width={this.block_width} height={this.gap_height}></canvas>
              <Row className="grandchild contents flex">
                {family_info.length>0 && odd_row.map((item) => {
                  person_info = this.searchPersonInfo(FAMILY_CLASS.GRAND_CHILD, item);
                  return (
                    <div key = {item} className={`row-4-col-${item}`} onContextMenu={e => this.handleClick(e, item, FAMILY_CLASS.GRAND_CHILD)}>
                      <PersonCell person_info={person_info} family_codes={this.state.family_codes}/>
                    </div>
                  )
                })}
              </Row>
            </Col>
          </Wrapper>
          
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}            
          />           
          <div className="footer-buttons">
            {type != undefined && type == "modal" && (
                <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            )}            
              <Button className={`${patient !=undefined && patient!=null?(!this.change_flag?'red-btn':'disable-btn'):'disable-btn'}`} tooltip = {print_tip} onClick = {this.openPrintPreview.bind(this)}>帳票プレビュー</Button>
              <Button className={`${patient !=undefined && patient!=null?(this.change_flag?'red-btn':'disable-btn'):'disable-btn'}`} tooltip = {register_tip} onClick={this.save.bind(this)}>登録</Button>
          </div>  
          {this.state.isCreateFamilyModal && (
            <FamilyModal
                handleOk={this.handleOk}
                closeModal={this.closeModal}
                row_index={this.state.row_index}
                col_index={this.state.col_index}
                person_info={this.state.person_info}
                familyMasterData = {this.state.familyMasterData}
                family_codes = {this.state.family_codes}
                family_code_options = {this.state.family_code_options}
                system_patient_id = {this.state.patient.system_patient_id}
            />
          )}

          {this.state.isConfirmMoveOtherPage == true && (
              <SystemConfirmJapanModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.moveOtherPage.bind(this)}
                  confirmTitle= {this.state.confirm_message}
                  title = {this.state.confirm_alert_title}
              />
          )}

          {this.state.isUpdateConfirm == true && (
              <SystemConfirmJapanModal
                  hideConfirm= {this.cancelSave.bind(this)}
                  confirmCancel= {this.cancelSave.bind(this)}
                  confirmOk= {this.saveFamily.bind(this)}
                  confirmTitle= {this.state.confirm_message}                  
              />
          )}

          {this.state.isDeleteConfirmModal == true && (
              <SystemConfirmJapanModal
                  hideConfirm= {this.cancelSave.bind(this)}
                  confirmCancel= {this.cancelSave.bind(this)}
                  confirmOk= {this.deleteData.bind(this, this.state.row_index, this.state.col_index)}
                  confirmTitle= {this.state.confirm_message}                  
              />
          )}

          {this.state.isOpenPrintPreview == true && (
              <DialFamilyPrintPreview
                  closeModal = {this.closeModal}                  
                  content_data={this.state}
                  top_pairs = {this.top_pairs}
                  bottom_pairs = {this.bottom_pairs}
                  top_bottom_pairs = {this.top_bottom_pairs}
                  patient_info = {this.state.patient}
              />
          )}
          
        </Card>
      </>
    );
  }
}

DialFamilyBody.propTypes = {
  closeModal: PropTypes.func,
    history: PropTypes.object,
    goOtherPage: PropTypes.func,
    patientInfo: PropTypes.object,
    type:PropTypes.string
};
export default DialFamilyBody;
