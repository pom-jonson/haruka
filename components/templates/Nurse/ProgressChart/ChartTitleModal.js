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
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Checkbox from "~/components/molecules/Checkbox";

const Wrapper = styled.div`
  width:100%;
  height: 100%;
  font-size:1rem;
  display:block;
  .flex {
    display:flex;
    flex-wrap: wrap;
  }
  .content-data{
    width: 100%;
    height: calc(100% - 7.5rem);
    display:flex;
    align-items: flex-start;
    justify-content: space-between;
  }
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
      ime-mode: active;
    }
    button {
      width:4rem;
      height:2rem;
      margin-left:0.5rem;
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
    width: 32%;
    height: 100%;
    display: block;
    .title{
      width:100%;
      height:2rem;
      line-height:2rem;
    }
    .content{
      width:100%;
      height: calc(75vh - 23.5rem);
      display: block;
      overflow-y: scroll;
      border: solid 1px gray;
      margin-bottom: 0.5rem;
      padding: 0.2rem;
      p{cursor: pointer;}
    }
    .selected {
      background: lightblue;
    }
  }
  .date-area{
    width:70%;
    div{margin-top:0;}
    .react-datepicker-popper {
      margin-top:10px;
    }
    .label-title{
      width:auto;
      font-size:1rem;
      text-align:right;
      margin-right:0.5rem;
      margin-top:0;
      margin-bottom: 0;
      line-height: 2rem;
    }
    input{
      height:2rem;
      margin-right:1rem;
      font-size: 1rem;
      width: 6rem;
    }
  }
  .free-area{
    margin-top:0.5rem;
    div{margin-top:0;}
    .label-title{
      width:4.5rem;
      margin-top:0;
      margin-bottom: 0;
      line-height: 2rem;
      font-size: 1rem;
    }
    input{
      width:calc(100% - 4.5rem);
      height:2rem;
      font-size: 1rem;
    }
  }
  .sort-number-area{
    margin-left:0.5rem;
    div{margin-top:0;}
    .label-title{
      width:3.5rem;
      text-align:right;
      margin-top:0;
      margin-bottom: 0;
      line-height: 2rem;
      margin-right:5px;
      font-size: 1rem;
    }
    input{
      height:2rem;
      ime-mode:inactive;
      width:15rem;
    }
  }
  .part-side-area{
    width:30%;
  }
  .side-area{
    label {
      line-height: 2rem;
      font-size: 1rem;
      input {height: 15px !important;}
    }
    input{
      width:calc(100% - 9rem);
      height: 2rem;
      font-size: 1rem;
    }
  }
  .part-area{
    margin-top:0.5rem;
    div {margin-top:0;}
    .label-title{
      width:3.5rem;
      font-size:1rem;
      margin-right:5px;
      margin-top:0;
      margin-bottom: 0;
      line-height: 2rem;
    }
    input{
      width:calc(100% - 3.5rem);
      height:2rem;
      font-size:1rem;
    }
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TooltipMenuUl = styled.ul`
  margin-bottom:0;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
    width: 20rem;
    opacity: 1;
    border: 2px solid #807f7f;    
  }
  .tooltip-item{
    display: flex;
  }
  .item-title{
    width: 7rem;
    text-align: right;
    padding: 5px 6px !important;
  }
  .item-content{
    width: 13rem;
    word-break: break-all;
  }
  .tooltip-content-area{
    line-height: 1rem;
    background: #050404;
    color: white;
  }
  .context-menu li {
    font-size: 1rem;
    // line-height: 1.875rem;
    clear: both;
    color: black;
    // cursor: pointer;
    font-weight: normal;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    // border-bottom: solid 1px #888;
    -webkit-transition: all 0.3s;
    div {
      padding: 0px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #3c3c87;
    color: white;
  }
`;

const Tooltip = ({visible,x, y,height,title, content}) => {
  if (visible) {
    return(
      <TooltipMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px`, height:`${height}px` }}>
          <li style={{borderBottom:'1px solid'}}>{title}</li>
          {content.map(item => {
            return (
              <>
              <li><div>{item.name}</div></li>
              </>
            )
          })}
        </ul>

      </TooltipMenuUl>
    )
  } else {
    return null;
  }
}

class ChartTitleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search_word:'',
      tier_master_1st:[],
      tier_master_2nd:[],
      tier_master_3rd:[],
      tier_1st:[],
      tier_2nd:[],
      tier_3rd:[],
      plan_master:[],
      filtered_plan_master:[],
      first_number: '',
      second_number: '',
      third_number: '',
      third_name:"",
      comment: '',
      alert_messages: '',
      isSaveConfirmModal:false,
      confirm_message:'',

      start_date:'',
      end_date:'',
      free_category:'',
      title:'',
      sort_number:'',
      part:'',
      left_side:false,
      right_side:false,
      other_side:false,
      other_side_value:'',
      is_loaded:false,
    };
  }

  async componentDidMount () {
    await this.getMasterData();
  }

  getMasterData = async() => {
    let path = "/app/api/v2/nurse/get_elapsed_master";
    let post_data = {name:this.state.search_word, from_source: this.props.from_source};
    if (this.state.is_loaded){
      this.setState({is_loaded: false});
    }
    await apiClient.post(path, post_data)
      .then((res) => {
        this.setState({
          tier_master_1st:res.tier_master_1st,
          tier_1st:res.tier_master_1st,
          tier_master_2nd:res.tier_master_2nd,
          // tier_2nd:res.tier_master_2nd,
          tier_master_3rd:res.tier_master_3rd,
          elapsed_select_item_master: res.elapsed_select_item_master,
          plan_master:res.plan_master,
          filtered_plan_master:[],
          tier_3rd:[],
          first_number: '',
          second_number: '',
          second_name: '',
          third_number: '',
          third_name: '',
          plan_number: '',
          is_loaded: true
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
    let tier_3rd = [];
    this.state.tier_master_2nd.map(second_item=>{
      if (second_item.tier_1st_id == item.number){
        tier_2nd.push(second_item);
      }
    });
    this.setState({
      first_number: item.number,
      tier_2nd,
      tier_3rd,
      second_number:"",
      third_number:"",
      third_name:"",
      free_category:'',
      title:''
    });
  };
  selectSecondMaster = (item) =>{    
    let tier_3rd = [];
    this.state.tier_master_3rd.map(second_item=>{
      if (second_item.tier_2nd_id == item.number){
        tier_3rd.push(second_item);
      }
    });
    this.setState({
      second_number: item.number,
      second_name: item.name,
      tier_3rd,
      third_number:"",
      third_name:"",

      free_category:'',
      title:''
    });
  };
  selectThirdMaster = (item) =>{
    if (this.props.from_source == "plan") {
      let filtered_plan_master = [];
      this.state.plan_master.map(third_item=>{
        if (third_item.tier_3rd_id == item.number)
          filtered_plan_master.push(third_item);
      });
      this.setState({filtered_plan_master});
    }
    this.setState({
      third_number: item.number,
      third_name:item.name,
      result_type: item.result_type,
      title:item.name
    });
  };
  selectPlanMaster = (item) =>{
    this.setState({
      plan_number: item.number,
      plan_name:item.name
    });
  };

  save = () => {
    if (this.state.start_date == ''){
      this.setState({
        alert_messages:'開始日を入力してください。'
      })
      return;
    }
    if (this.state.start_date != '' && this.state.end_date != ''){
      if (this.state.start_date.getTime() > this.state.end_date.getTime()){
        this.setState({
          alert_messages:'終了日開始日以降で入力してください。'
        })
        return;
      }
    }

    if(this.state.title == ""){
      this.setState({alert_messages: '項目名を入力してください。'});
      return;
    }
    this.setState({
      isSaveConfirmModal:true,
      confirm_message: "登録しますか?",
    })
  }

  confirmCancel = () => {
    this.setState({
      confirm_message:'',
      isSaveConfirmModal:false,
      isCloseConfirmModal:false,
      alert_messages: '',
      confirm_alert_title:''
    })
  }

  confirmOk=()=>{
    var post_data = [];
    let post_data_item = {
      tier_1st_id: this.state.first_number,
      tier_2nd_id: this.state.second_number,
      tier_2nd_name: this.state.second_name,
      tier_3rd_id: this.state.third_number,
      tier_3rd_name: this.state.third_name,
      title:this.state.title,
      free_category:this.state.free_category,
      tier_3rd_free_comment: this.state.comment,
      start_date:this.state.start_date,
      end_date:this.state.end_date,
      result_type: this.state.result_type,
      sort_number : this.state.sort_number,
    };
    if (this.state.part != ''){
      post_data_item.part = this.state.part;
    }
    var temp;
    if (this.state.left_side){
      temp = JSON.parse(JSON.stringify(post_data_item));
      temp.side = '左';
      post_data.push(temp);
    }
    if (this.state.right_side){
      temp = JSON.parse(JSON.stringify(post_data_item));
      temp.side = '右';
      post_data.push(temp);
    }
    if (this.state.other_side && this.state.other_side_value != ''){
      temp = JSON.parse(JSON.stringify(post_data_item));
      temp.side = this.state.other_side_value;
      post_data.push(temp);
    }
    if (post_data.length == 0) post_data.push(post_data_item);
    if (this.props.from_source == "plan") {
      if (this.state.plan_number == "") {
        this.setState({alert_messages: '看護計画を選択してください。'});
        return;
      }
      post_data = {
        tier_1st_id: this.state.first_number,
        tier_2nd_id: this.state.second_number,
        tier_2nd_name: this.state.second_name,
        tier_3rd_id: this.state.third_number,
        tier_3rd_name: this.state.third_name,
        title:this.state.third_name,
        result_type: this.state.result_type,
        nurse_plan_master_id: this.state.plan_number,
      };
      this.props.insertPlanTitle(post_data);
    }
    this.props.handletitleOk(post_data);
  }

  closeModal=()=>{
    this.setState({
      alert_messages: '',
    })
  }

  getInputdate = (name, value) => {
    this.setState({[name]:value});
    this.change_flag = true;
  }

  getInputText = (name, e) => {
    this.setState({[name]:e.target.value});
    if (name == 'free_category'){
      this.setState({
        free_category:e.target.value,
        second_number:"",
        second_name:'',
        third_number:"",
        third_name:"",
        tier_3rd:[]
      })
    }
    if (name == 'title'){
      this.setState({
        title:e.target.value,
        third_number:"",
        third_name:"",
      })
    }
    this.change_flag = true;
  }

  getNumericInput = (name, e) => {
    let input_value = e.target.value.replace(/[^0-9０-９]/g, "");
    if (input_value != "") {
      input_value = parseInt(input_value);
    }
    this.setState({[name]:input_value});
    this.change_flag = true;
  }

  getRadio = (name, value) => {
    this.setState({[name]:value});
  }

  showSelectItmes = (e, item) => {    
    if (item.result_type != 0 && item.result_2_type != 0) return;
    var elapsed_select_item_master = this.state.elapsed_select_item_master;
    var res = elapsed_select_item_master.filter(x => x.tier_1st_id == item.tier_1st_id && x.tier_2nd_id == item.tier_2nd_id && x.	tier_3rd_id== item.number);
    if (res.length == 0) {
      this.hideTooltip();      
    } else {      
      var modal_header = document.getElementsByClassName('chart-title-modal')[0].getElementsByClassName('modal-header')[0];
      var third_area = document.getElementsByClassName('third-area')[0];
      var third_area_content = document.getElementsByClassName('third-area')[0].getElementsByClassName('content')[0];
      this.setState({
        tooltip:{
          visible:true,
          x:third_area.offsetLeft + third_area.offsetWidth,
          y:modal_header.offsetHeight + third_area_content.offsetTop,
          height:third_area_content.offsetHeight,
          title:item.name,
          content:res,
        }
      })
    }
  }

  hideTooltip = () => {
    this.setState({ tooltip: { visible: false} });
  };

  render() {
    let {tier_1st, tier_2nd, tier_3rd, filtered_plan_master} = this.state;    
    return (
      <>
        <Modal show={true} className={"custom-modal-sm  chart-title-modal first-view-modal " + (this.props.from_source === "plan" ? "observation-edit-modal" : "")}>
          <Modal.Header><Modal.Title>{this.props.from_source === "plan" ? "タイトル選択" : "観察項目選択"}</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              {this.props.from_source === "title" ? (
                <>
                  {this.state.is_loaded ? (
                    <>
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
                        <Button type="common" onClick={this.getMasterData.bind(this)}>検索</Button>
                        <div className='sort-number-area'>
                          <InputWithLabelBorder
                            label="表示順"
                            type="text"
                            getInputText={this.getNumericInput.bind(this, 'sort_number')}
                            diseaseEditData={this.state.sort_number}
                          />
                        </div>
                      </div>
                      <div className="content-data">
                        <div className="list-area">
                          <div className="title">第一階層</div>
                          <div className="content">
                            {tier_1st != undefined && tier_1st.length > 0 && tier_1st.map(item=>{
                              return (
                                <>
                                  <p style={{width:"100%", margin:0}} onClick={this.selectFirstMaster.bind(this, item)} className={this.state.first_number == item.number ? "selected" : ''}>
                                    {item.name}
                                  </p>
                                </>
                              )
                            })}
                          </div>
                        </div>
                        <div className="list-area">
                          <div className="title">第二階層</div>
                          <div className="content">
                            {tier_2nd != undefined && tier_2nd.length > 0 && tier_2nd.map(item=>{
                              return (
                                <>
                                  <p style={{width:"100%", margin:0}} 
                                    onClick={this.selectSecondMaster.bind(this, item)} 
                                    className={this.state.second_number == item.number ? "selected" : ''}                                    
                                  >
                                    {item.name}
                                  </p>
                                </>
                              )
                            })}
                          </div>
                          <div className='free-area'>
                            <InputWithLabelBorder
                              label="カテゴリ"
                              type="text"
                              getInputText={this.getInputText.bind(this, 'free_category')}
                              diseaseEditData={this.state.free_category}
                            />
                          </div>
                        </div>
                        <div className="list-area third-area">
                          <div className="title">第三階層</div>
                          <div className="content">
                            {tier_3rd != undefined && tier_3rd.length > 0 && tier_3rd.map(item=>{
                              return (
                                <>
                                  <p style={{width:"100%", margin:0}} 
                                    onClick={this.selectThirdMaster.bind(this, item)}
                                    className={this.state.third_number == item.number ? "selected" : ''}
                                    onMouseOver={e => this.showSelectItmes(e, item)}
                                    onMouseOut={this.hideTooltip}>
                                    {item.name}
                                  </p>
                                </>
                              )
                            })}
                          </div>
                          <div className='free-area'>
                            <InputWithLabelBorder
                              label="項目名"
                              type="text"
                              getInputText={this.getInputText.bind(this, 'title')}
                              diseaseEditData={this.state.title}
                            />
                          </div>
                        </div>
                      </div>
                      <div className='flex' style={{width:'100%', marginTop:'0.5rem'}}>
                        <div className='date-area flex'>
                          <InputWithLabelBorder
                            label="開始日"
                            type="date"
                            getInputText={this.getInputdate.bind(this, 'start_date')}
                            diseaseEditData={this.state.start_date}
                          />
                          <InputWithLabelBorder
                            label="終了日"
                            type="date"
                            getInputText={this.getInputdate.bind(this, 'end_date')}
                            diseaseEditData={this.state.end_date}
                          />
                        </div>
                        <div className='part-side-area'>
                          <div className='flex side-area'>
                            <Checkbox
                              label="左"
                              getRadio={this.getRadio.bind(this)}
                              value={this.state.left_side}
                              name="left_side"
                            />
                            <Checkbox
                              label="右"
                              getRadio={this.getRadio.bind(this)}
                              value={this.state.right_side}
                              name="right_side"
                            />
                            <Checkbox
                              label=""
                              getRadio={this.getRadio.bind(this)}
                              value={this.state.other_side}
                              name="other_side"
                            />
                            <input value={this.state.other_side_value} disabled={this.state.other_side?false:true} onChange={this.getInputText.bind(this, 'other_side_value')}></input>
                          </div>
                          <div className='part-area'>
                            <InputWithLabelBorder
                              label="部位"
                              type="text"
                              getInputText={this.getInputText.bind(this, 'part')}
                              diseaseEditData={this.state.part}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  ):(
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  )}
                </>
              ):(
                <>
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
                  </div>
                  {this.state.Load === false ? (
                    <>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </>
                  ) : (
                    <div className="w-100 flex content-data">
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
                      <div className="list-area third-area" style={{marginLeft:"5%"}}>
                        <div className="title">第三階層</div>
                        <div className="content">
                          {tier_3rd != undefined && tier_3rd.length > 0 && tier_3rd.map((item,index)=>{
                            return (
                              <div key={index} onClick={this.selectThirdMaster.bind(this, item)} 
                                className={this.state.third_number == item.number ? "selected" : ''}
                                onMouseOver={e => this.showSelectItmes(e, item)}
                                onMouseOut={this.hideTooltip}
                              >
                                {item.name}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div className="list-area" style={{marginLeft:"5%"}}>
                        <div className="title">看護計画</div>
                        <div className="content">
                          {filtered_plan_master != undefined && filtered_plan_master.length > 0 && filtered_plan_master.map((item,index)=>{
                            return (
                              <div key={index} onClick={this.selectPlanMaster.bind(this, item)} 
                                className={this.state.plan_number == item.number ? "selected" : ''}
                              >
                                {item.name}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            {this.props.from_source === "title" ? (
              <Button className="red-btn" onClick={this.save}>反映</Button>
            ):(
              <Button className="red-btn" onClick={this.confirmOk}>確定</Button>
            )}
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.isSaveConfirmModal && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.confirmOk.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
          <Tooltip
            {...this.state.tooltip}
            parent={this}            
          />
        </Modal>
      </>
    );
  }
}

ChartTitleModal.contextType = Context;
ChartTitleModal.propTypes = {
  closeModal: PropTypes.func,
  handletitleOk: PropTypes.func,
  insertPlanTitle: PropTypes.func,
  from_source: PropTypes.string,
};

export default ChartTitleModal;