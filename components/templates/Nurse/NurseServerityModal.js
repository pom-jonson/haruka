import React, { 
    Component, 
    // useContext
   } from "react";
  import PropTypes from "prop-types";
  import styled from "styled-components";
//   import * as colors from "~/components/_nano/colors";
  import { Modal } from "react-bootstrap";
  import Context from "~/helpers/configureStore";
  import * as apiClient from "~/api/apiClient";
  // import Radiobox from "~/components/molecules/Radiobox";  
  // import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";  
  // import InputWithLabel from "~/components/molecules/InputWithLabel";
  import Button from "~/components/atoms/Button";
  import $ from "jquery";  
  import {formatJapanDate, formatDateTimeIE} from "~/helpers/date";
  // import Checkbox from "~/components/molecules/Checkbox";
  import DecisionModal from "./DecisionModal";
  import LevelReferenceModal from "./LevelReferenceModal";
  import DetailHistoryModal from "./DetailHistoryModal";
  // import DatePicker, { registerLocale } from "react-datepicker";
  // import ja from "date-fns/locale/ja";
  // registerLocale("ja", ja);

  const Popup = styled.div`    
    .flex {
      display: flex;
    }
    height: 96%;
    .nurse-header{
      padding-bottom:3px;
      border-bottom:1px solid;
      justify-content: space-between;
      .big-label-title{
        min-width:2rem;
        padding-top:5px;
        font-size:1.2rem;
        width:auto;
        text-align:center; 
        padding-left:10px;
        padding-right:10px;
        border:1px solid;
      }
      .label-title{
        font-size:1rem;
        width:5rem;
        text-align:right;
        margin-right:5px;
      }
      .pullbox-label, .pullbox-select{
        width:12.5rem;
        font-size:1rem;
        margin-right:1.25rem;
      }
      .example-custom-input{
        font-size:1.25rem;
        border:1px solid;
        padding:3px;
      }
      .checkbox-area{
        padding-top:5px;
        label{
          font-size:1rem;
        }
        margin-right:30px;
      }      
    }
    button{
      height:36px;         
    }
    .sub-header{
      padding-top:10px;
      padding-bottom:10px;
      padding-left:3rem;
      .checkbox-area{
        font-size:1rem;
        label{
          margin-right:20px;
        }
        margin-right:30px;
        padding-top:7px;
        margin-left:30px;
      }
      button{
        margin-right:20px;
      }      
    }
    .no-border-td{
      border-top:none;
      border-left:noen;
      border-bottom:none;
      width:7.5rem;
    }
    .small-row{
      width:75%;
    }
    .main-content{
      justify-content: space-between;
      padding-right:4rem;
      .one-blog{
        width:27rem;
      }
      th{
        background:lightgray;
        text-align:center;
      }
      .blog-header{
        height:20px;
      }
      .blog-title{
        height:20px;
        margin-left:15px;
      }
      .main-level{
        font-size: 2rem;
        margin-left: 3rem;
        height:40px;
      }
      .table-content{
        margin-left:3rem;
      }
    }

    .panel-menu {
      width: 100%;
      margin-bottom: 1rem;
      font-weight: bold;
      .menu-btn {
          width:auto;
          text-align: center;
          border-bottom: 1px solid black;
          background-color: rgba(200, 194, 194, 0.22);
          padding: 5px 10px;
          cursor: pointer;
      }
      .active-menu {
          width:auto;
          text-align: center;
          border-top: 1px solid black;
          border-right: 1px solid black;
          border-left: 1px solid black;
          padding: 5px 10px;
      }
      .no-menu {
          width: calc(100% - 600px);
          border-bottom: 1px solid black;
          background-color: rgba(200, 194, 194, 0.22);
      }
    }
    .work-area{      
      overflow-x:auto;
      overflow-y:auto;
      button{
        margin-right:15px;
      }
      .no-break{
        td {
          word-break: keep-all;
          vertical-align:middle;
        }
      }
      td{
        button{
          height:24px;
          margin-right:0;
        }
        vertical-align:middle;
      }
      th{
        background:lightgray;
        text-align:center;
      }
    }
    .selected {
      background:lightblue;
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
    width:11.25rem;
  }
  .context-menu li {
    clear: both;
    width: 11.25rem;
    border-radius: 0.25rem;
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
    color:black;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({visible,x,y,parent,index, kind}) => {
  if (visible) {
      return (
          <ContextMenuUl>
              <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>              
                <li><div onClick={() =>parent.contextMenuAction("add", index, kind)}>項目追加</div></li>
                <li><div onClick={() =>parent.contextMenuAction("edit", index, kind)}>項目変更</div></li>
                <li><div onClick={() => parent.contextMenuAction("delete",index, kind)}>項目削除</div></li>
                <li><div onClick={() => parent.contextMenuAction("sort",index, kind)}>並び替え</div></li>
              </ul>
          </ContextMenuUl>
      );
  } else { return null; }
};
  
  class NurseServerityModal extends Component {
    constructor(props) {
      super(props);    
      this.state = {        
        departmentCode:1,        
        number:0,
        tab_id:0,        
        isOpenDecideModal:false,
        isOpenLevelReferenceModal:false,
        isOpenDetailHistoryModal:false,
        search_date:new Date(),
      }
      this.evalution_table_options = {
        1:'一般評価票',
        2:'HCU評価票',
        3:'ICU評価票',
      }      
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }  
    componentDidMount(){
      this.getSearchResult();
    }

    UNSAFE_componentWillReceiveProps () {
      this.forceUpdate();
    }

    getSearchResult = async() => {
      let path = "/app/api/v2/master/nurse/require_search";
      let post_data = {};
      await apiClient.post(path, post_data)
      .then((res) => {        
        this.setState({
          nurse_require_master:res,
        })
      });
    }

    handleClick = (e, index, kind) => {
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
          .getElementById("wordList-table")
          .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                  contextMenu: { visible: false }
              });
              document
                  .getElementById("wordList-table")
                  .removeEventListener(`scroll`, onScrollOutside);
          });
      this.setState({
          contextMenu: {
              visible: true,              
              x: e.clientX -$('#outpatient').offset().left,
              y: e.clientY -$('#outpatient').offset().top - 35,
              index: index,
              kind:kind,
          },
          contextMenu_define:{visible:false}
      });
      }
    };

    // contextMenuAction = (act, index, kind) => {
    contextMenuAction = (act) => {      
      switch(act){
        case 'add':
          break;
        case 'edit':
          break;
        case 'delete':
          break;
        case 'sort':          
          break;
      }
    };

    closeModal = () => {
      this.setState({                
        isOpenDecideModal:false,
        isOpenLevelReferenceModal:false,
        isOpenDetailHistoryModal:false,
      })
    }

    getCategory (e){
      this.setState({select_category_code:e.target.id})
    }

    selectSearchKind = (e) => {
      this.setState({
        search_kind:e.target.value,
      })
    }

    getDate = (value) => {
      this.setState({
        search_date:value
      })
    }

    getWardInfo = (e) => {
      this.setState({
        ward_info:e.target.id,
      })
    }

    getPatientInfo = (e) => {
      this.setState({
        patients_info:e.target.id
      })
    }
    switchDisplay = (name, value) => {
      switch(name){
        case 'display_all':
          this.setState({display_all:value})
          break;
        case 'display_absent':
          this.setState({display_absent:value})
          break;
        case 'HCU':
          this.setState({hcu_flag:value})
          break;
        case 'ICU':
          this.setState({icu_flag:value})
          break;
        case 'general':
          this.setState({general_flag:value})
          break;
      }
    }

    setTab = ( e, val ) => {      
      this.setState({
          tab_id:parseInt(val),
      });
    };

    openServerity = () => {
      
    }

    openDecideModal = () => {
      this.setState({
        isOpenDecideModal:true,
      })
    }

    selectTh = (category, nursing_need_class) => {
      var nurse_require_master = this.state.nurse_require_master;
      Object.keys(nurse_require_master[nursing_need_class]).map(key => {
        var item = nurse_require_master[nursing_need_class][key];
        for (var i = 1; i <= 5; i++){
          if (i != category){
            if (item[i] != undefined) item[i].is_selected = false;
          }
        }
        if (item[category] != undefined){
          item[category].is_selected = item[category].is_selected != undefined ? !item[category].is_selected:true;
        }
      })
      this.setState({nurse_require_master});
    }

    selectTd = (key, category, nursing_need_class) => {
      var nurse_require_master = this.state.nurse_require_master;
      var item = nurse_require_master[nursing_need_class][key];
      for (var i = 1; i <= 5; i++){
        if (i != category){
          if (item[i] != undefined) item[i].is_selected = false;
        }
      }
      if (item[category] != undefined){
        item[category].is_selected = item[category].is_selected != undefined ? !item[category].is_selected:true;
      }
      this.setState({nurse_require_master});
    }

    save =()=> {
      this.props.closeModal();
      this.props.handleOk(this.state.nurse_require_master, 'from_decision');
    }

    movePrev = () => {
      this.props.movePrev();
    }

    moveNext = () => {
      this.props.moveNext();
    }

    openLevelReference = () => {
      this.setState({
        isOpenLevelReferenceModal:true
      })
    }

    openDetailHistory = (item) => {
      var first_item = item[Object.keys(item)[0]];
      this.setState({
        isOpenDetailHistoryModal:true,
        selected_detail_name:first_item.name,
      })
    }
  
    render() {         
      var selected_item = this.props.selected_item;      
      var birthday = selected_item.birthday;
      var birth_year = birthday.split('-')[0];
      var age = new Date().getFullYear() - birth_year;
      var {nurse_require_master} = this.state;
      
      return (
        <>
          <Modal
            show={true}          
            id="outpatient"
            className="custom-modal-sm patient-exam-modal bed-control-modal first-view-modal"
          >
            <Modal.Header>
              <Modal.Title style={{width:'25rem'}}>重症度・看護必要度に関わる評価</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup>
                <div className='nurse-header flex'>
                  <label className='big-label-title'>{this.props.ward_master[selected_item.first_ward_id]}</label>
                  <label className='big-label-title'>{selected_item.system_patient_id}</label>
                  <label className='big-label-title'>{selected_item.patient_number}</label>
                  <label className='big-label-title'>{selected_item.patient_name}</label>
                  <label className='big-label-title'>{selected_item.gender==1?'男性':'女性'}</label>
                  <label className='big-label-title'>{this.props.department_options[selected_item.department_id]}</label>
                  <label className='big-label-title'>{age}歳</label>
                  <label className='big-label-title'>{formatJapanDate(formatDateTimeIE(selected_item.date_and_time_of_hospitalization))}</label>
                  {this.props.workzone_name != undefined && this.props.workzone_name != '' && (
                    <label className='big-label-title'>{this.props.workzone_name}</label>
                  )}
                </div>
                <div className='flex sub-header'>
                  <button onClick = {this.movePrev.bind(this)}>前患者</button>
                  <button onClick = {this.moveNext.bind(this)}>次患者</button>
                  {/* <div className='checkbox-area'>
                    <Checkbox
                      label = "ICU絞り込み"
                      getRadio={this.switchDisplay.bind(this)}
                      value={this.state.icu_flag}
                      name="ICU"
                    />
                    <Checkbox
                      label = "HCU絞り込み"
                      getRadio={this.switchDisplay.bind(this)}
                      value={this.state.hcu_flag}
                      name="HCU"
                    />                    
                    <Checkbox
                      label = "一般絞り込み"
                      getRadio={this.switchDisplay.bind(this)}
                      value={this.state.general_flag}
                      name="general"
                    />
                  </div> */}
                </div>
                <div className='main-content flex'>
                    <div className='one-blog'>
                      <div className='blog-header'>Total Score</div>
                      <div className='blog-title'>＜患者分類＞</div>
                      <div className='main-level'>
                        {selected_item.nursing_need_level_id == null ? '未入力' 
                          :(this.props.need_level_options !=undefined && this.props.need_level_options != null)? this.props.need_level_options[selected_item.nursing_need_level_id]:''}
                      </div>
                      <div className='blog-title'>＜ＩＣＵ基準＞</div>
                      <div className='table-content'>
                        <table className = 'table table-bordered no-break'>
                          <tr>
                            <th>A</th>
                            <th>B</th>
                          </tr>
                          <tr>
                            <td style={{textAlign:'center'}}>{selected_item.icu_judgment_flag && selected_item.A_field_point_sum>0?selected_item.A_field_point_sum:0}</td>
                            <td style={{textAlign:'center'}}>{selected_item.icu_judgment_flag && selected_item.B_field_point_sum>0?selected_item.B_field_point_sum:0}</td>
                          </tr>
                        </table>
                        {/* <div>A得点：3点以上またはB得点：3点以上</div> */}
                      </div>                      
                    </div>
                    <div className='one-blog'>
                      <div className='blog-header'></div>
                      <div className='blog-title'></div>
                      <div className='main-level'></div>
                      <div className='blog-title'>＜ＨＣＵ基準＞</div>
                      <div className='table-content'>
                        <table className = 'table table-bordered no-break'>
                          <tr>
                            <th>A</th>
                            <th>B</th>
                          </tr>
                          <tr>
                            <td style={{textAlign:'center'}}>{selected_item.hcu_judgment_flag && selected_item.A_field_point_sum>0?selected_item.A_field_point_sum:0}</td>
                            <td style={{textAlign:'center'}}>{selected_item.hcu_judgment_flag && selected_item.B_field_point_sum>0?selected_item.B_field_point_sum:0}</td>
                          </tr>
                        </table>
                        {/* <div>A得点：3点以上またはB得点：7点以上</div> */}
                      </div>
                    </div>
                    <div className='one-blog'>
                      <div className='blog-header'>選択中の評価表は</div>
                      <div className='blog-title'>{this.evalution_table_options[selected_item.eval_flag]}</div>
                      <div className='main-level'></div>
                      <div className='blog-title'>＜一般基準＞</div>
                      <div className='table-content'>
                        <table className = 'table table-bordered no-break'>
                          <tr>
                            <th>A</th>
                            <th>B</th>
                          </tr>
                          <tr>
                            <td style={{textAlign:'center'}}>{selected_item.general_judgment_flag && selected_item.A_field_point_sum>0?selected_item.A_field_point_sum:0}</td>
                            <td style={{textAlign:'center'}}>{selected_item.general_judgment_flag && selected_item.B_field_point_sum>0?selected_item.B_field_point_sum:0}</td>
                          </tr>
                        </table>
                        {/* <div>A得点：2点以上かつB得点：3点以上</div> */}
                      </div>
                    </div>
                </div>

                <div className="panel-menu flex" style={{marginTop:'5px'}}>
                  { this.state.tab_id === 0 ? (
                      <><div className="active-menu">Ａモニタリング及び処置</div></>
                  ) : (
                      <><div className="menu-btn" onClick={e => {this.setTab(e, 0);}}>Ａモニタリング及び処置</div></>
                  )}
                  { this.state.tab_id === 1 ? (
                      <><div className="active-menu">B 患者の状況等</div></>
                  ) : (
                      <><div className="menu-btn" onClick={e => {this.setTab(e, 1);}}>B 患者の状況等</div></>
                  )}
                  { this.state.tab_id === 2 ? (
                      <><div className="active-menu">必要度独自項目</div></>
                  ) : (
                      <><div className="menu-btn" onClick={e => {this.setTab(e, 2);}}>必要度独自項目</div></>
                  )}
                  <div className="no-menu"/>
                </div>
                <div className="work-area">
                  {/* <button>データ参照</button> */}
                  <button onClick={this.openLevelReference.bind(this)}>レベル歴参照</button>
                  <button onClick={this.openDecideModal.bind(this)}>判定支援</button><br/><br/>
                {this.state.tab_id === 0 && (
                  <>
                  <table className='table table-bordered no-break'>
                    <thead>
                      <tr>
                        <th></th>
                        <th>ガイド</th>
                        <th>歴参照</th>
                        <th>ICＵ</th>
                        <th>HCＵ</th>
                        <th>一般</th>
                        <th>アセスメント項目</th>
                        <th onClick={this.selectTh.bind(this,1, 1)} className='clickable'>カテゴリ１</th>
                        <th onClick={this.selectTh.bind(this,2, 1)} className='clickable'>カテゴリ２</th>
                        <th onClick={this.selectTh.bind(this,3, 1)} className='clickable'>カテゴリ３</th>
                        <th onClick={this.selectTh.bind(this,4, 1)} className='clickable'>カテゴリ４</th>
                        <th onClick={this.selectTh.bind(this,5, 1)} className='clickable'>カテゴリ５</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nurse_require_master != undefined && nurse_require_master != null && nurse_require_master[1] != undefined && nurse_require_master[1]!=null && (
                        Object.keys(nurse_require_master[1]).map((key, index) => {
                          var item = nurse_require_master[1][key];
                          var first_item = item[Object.keys(item)[0]];                          
                          return(
                            <>
                            <tr>
                              <td>{index + 1}</td>
                              <td style={{textAlign:'center'}}><button>ガイド</button></td>
                              <td style={{textAlign:'center'}}><button onClick={this.openDetailHistory.bind(this, item)}>歴</button></td>
                              <td style={{textAlign:'center'}}>{selected_item.icu_judgment_flag?'*':''}</td>
                              <td style={{textAlign:'center'}}>{selected_item.hcu_judgment_flag?'*':''}</td>
                              <td style={{textAlign:'center'}}>{selected_item.general_judgment_flag?'*':''}</td>
                              <td>{first_item.name}</td>
                              <td style={{textAlign:'center'}} onClick={this.selectTd.bind(this, key, 1, 1)} className={item[1] != undefined && item[1].is_selected?'selected clickable':'clickable'}>{item[1] != undefined? item[1].category_name:''}</td>
                              <td style={{textAlign:'center'}} onClick={this.selectTd.bind(this, key, 2, 1)} className={item[2] != undefined && item[2].is_selected?'selected clickable':'clickable'}>{item[2] != undefined? item[2].category_name:''}</td>
                              <td style={{textAlign:'center'}} onClick={this.selectTd.bind(this, key, 3, 1)} className={item[3] != undefined && item[3].is_selected?'selected clickable':'clickable'}>{item[3] != undefined? item[3].category_name:''}</td>
                              <td style={{textAlign:'center'}} onClick={this.selectTd.bind(this, key, 4, 1)} className={item[4] != undefined && item[4].is_selected?'selected clickable':'clickable'}>{item[4] != undefined? item[4].category_name:''}</td>
                              <td style={{textAlign:'center'}} onClick={this.selectTd.bind(this, key, 5, 1)} className={item[5] != undefined && item[5].is_selected?'selected clickable':'clickable'}>{item[5] != undefined? item[5].category_name:''}</td>
                            </tr>
                            </>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                  </>
                )}
                {this.state.tab_id === 1 && (
                  <>
                  <table className='table table-bordered no-break'>
                    <thead>
                      <tr>
                        <th></th>
                        <th>ガイド</th>
                        <th>歴参照</th>
                        <th>ICＵ</th>
                        <th>HCＵ</th>
                        <th>一般</th>
                        <th>アセスメント項目</th>
                        <th onClick={this.selectTh.bind(this,1, 2)} className='clickable'>カテゴリ１</th>
                        <th onClick={this.selectTh.bind(this,2, 2)} className='clickable'>カテゴリ２</th>
                        <th onClick={this.selectTh.bind(this,3, 2)} className='clickable'>カテゴリ３</th>
                        <th onClick={this.selectTh.bind(this,4, 2)} className='clickable'>カテゴリ４</th>
                        <th onClick={this.selectTh.bind(this,5, 2)} className='clickable'>カテゴリ５</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nurse_require_master != undefined && nurse_require_master != null && nurse_require_master[2] != undefined && nurse_require_master[2]!=null && (
                        Object.keys(nurse_require_master[2]).map((key, index) => {
                          var item = nurse_require_master[2][key];
                          var first_item = item[Object.keys(item)[0]];                          
                          return(
                            <>
                            <tr>
                              <td>{index + 1}</td>
                              <td style={{textAlign:'center'}}><button>ガイド</button></td>
                              <td style={{textAlign:'center'}}><button onClick={this.openDetailHistory.bind(this, item)}>歴</button></td>
                              <td style={{textAlign:'center'}}>{selected_item.icu_judgment_flag?'*':''}</td>
                              <td style={{textAlign:'center'}}>{selected_item.hcu_judgment_flag?'*':''}</td>
                              <td style={{textAlign:'center'}}>{selected_item.general_judgment_flag?'*':''}</td>
                              <td>{first_item.name}</td>
                              <td style={{textAlign:'center'}} onClick={this.selectTd.bind(this, key,1, 2)} className={item[1] != undefined && item[1].is_selected?'selected clickable':'clickable'}>{item[1] != undefined? item[1].category_name:''}</td>
                              <td style={{textAlign:'center'}} onClick={this.selectTd.bind(this, key,2, 2)} className={item[2] != undefined && item[2].is_selected?'selected clickable':'clickable'}>{item[2] != undefined? item[2].category_name:''}</td>
                              <td style={{textAlign:'center'}} onClick={this.selectTd.bind(this, key,3, 2)} className={item[3] != undefined && item[3].is_selected?'selected clickable':'clickable'}>{item[3] != undefined? item[3].category_name:''}</td>
                              <td style={{textAlign:'center'}} onClick={this.selectTd.bind(this, key,4, 2)} className={item[4] != undefined && item[4].is_selected?'selected clickable':'clickable'}>{item[4] != undefined? item[4].category_name:''}</td>
                              <td style={{textAlign:'center'}} onClick={this.selectTd.bind(this, key,5, 2)} className={item[5] != undefined && item[5].is_selected?'selected clickable':'clickable'}>{item[5] != undefined? item[5].category_name:''}</td>
                            </tr>
                            </>
                          )
                        })
                      )}
                    </tbody>                    
                  </table>
                  </>
                )}
                {this.state.tab_id === 2 && (
                  <>
                  <table className='table table-bordered no-break'>
                    <thead>
                      <tr>
                        <th></th>
                        <th>ガイド</th>
                        <th>歴参照</th>
                        <th>ICＵ</th>
                        <th>HCＵ</th>
                        <th>一般</th>
                        <th>アセスメント項目</th>
                        <th onClick={this.selectTh.bind(this,1, 3)} className='clickable'>カテゴリ１</th>
                        <th onClick={this.selectTh.bind(this,2, 3)} className='clickable'>カテゴリ２</th>
                        <th onClick={this.selectTh.bind(this,3, 3)} className='clickable'>カテゴリ３</th>
                        <th onClick={this.selectTh.bind(this,4, 3)} className='clickable'>カテゴリ４</th>
                        <th onClick={this.selectTh.bind(this,5, 3)} className='clickable'>カテゴリ５</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nurse_require_master != undefined && nurse_require_master != null && nurse_require_master[3] != undefined && nurse_require_master[3]!=null && (
                        Object.keys(nurse_require_master[3]).map((key, index) => {
                          var item = nurse_require_master[3][key];
                          var first_item = item[Object.keys(item)[0]];
                          return(
                            <>
                            <tr>
                              <td>{index + 1}</td>
                              <td style={{textAlign:'center'}}><button>ガイド</button></td>
                              <td style={{textAlign:'center'}}><button onClick={this.openDetailHistory.bind(this, item)}>歴</button></td>
                              <td style={{textAlign:'center'}}>{selected_item.icu_judgment_flag?'*':''}</td>
                              <td style={{textAlign:'center'}}>{selected_item.hcu_judgment_flag?'*':''}</td>
                              <td style={{textAlign:'center'}}>{selected_item.general_judgment_flag?'*':''}</td>
                              <td>{first_item.name}</td>
                              <td style={{textAlign:'center'}} onClick={this.selectTd.bind(this, key,1, 3)} className={item[1] != undefined && item[1].is_selected?'selected clickable':'clickable'}>{item[1] != undefined? item[1].category_name:''}</td>
                              <td style={{textAlign:'center'}} onClick={this.selectTd.bind(this, key,2, 3)} className={item[2] != undefined && item[2].is_selected?'selected clickable':'clickable'}>{item[2] != undefined? item[2].category_name:''}</td>
                              <td style={{textAlign:'center'}} onClick={this.selectTd.bind(this, key,3, 3)} className={item[3] != undefined && item[3].is_selected?'selected clickable':'clickable'}>{item[3] != undefined? item[3].category_name:''}</td>
                              <td style={{textAlign:'center'}} onClick={this.selectTd.bind(this, key,4, 3)} className={item[4] != undefined && item[4].is_selected?'selected clickable':'clickable'}>{item[4] != undefined? item[4].category_name:''}</td>
                              <td style={{textAlign:'center'}} onClick={this.selectTd.bind(this, key,5, 3)} className={item[5] != undefined && item[5].is_selected?'selected clickable':'clickable'}>{item[5] != undefined? item[5].category_name:''}</td>
                            </tr>
                            </>
                          )
                        })
                      )}
                    </tbody>                    
                  </table>
                  </>
                )}
                <div className='sub-footer'>{'各項目の"＊"は、各評価票の対象項目です。 ”カテゴリ1～5”のタイトル部をクリックすると、全ての項目が選択されます。'}</div>
                </div>
                
              </Popup>
            </Modal.Body>
            <Modal.Footer>
                <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
                <Button className="red-btn" onClick={this.save.bind(this)}>確定</Button>
            </Modal.Footer>            
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
            />            
          </Modal>
          {this.state.isOpenDecideModal && (
            <DecisionModal
              closeModal = {this.closeModal}
              nurse_require_master = {this.state.nurse_require_master}
              selected_item = {this.props.selected_item}
              ward_master  = {this.props.ward_master}
              department_options = {this.props.department_options}
              workzone_name = {this.props.workzone_name}
              handleOk = {this.save}
              necessary_master = {this.props.necessary_master}
            />
          )}
          {this.state.isOpenLevelReferenceModal && (
            <LevelReferenceModal
              closeModal = {this.closeModal}
              selected_item = {this.props.selected_item}
              necessary_master = {this.props.necessary_master}
            />
          )}
          {this.state.isOpenDetailHistoryModal && (            
            <DetailHistoryModal
              closeModal = {this.closeModal}
              selected_detail_name = {this.state.selected_detail_name}
              necessary_master = {this.props.necessary_master}
              patientId = {this.props.selected_item.system_patient_id}              
            />
          )}
        </>
      );
    }
  }
  NurseServerityModal.contextType = Context;
  
  NurseServerityModal.propTypes = {  
    handleOk :  PropTypes.func,
    closeModal: PropTypes.func,
    patientId: PropTypes.number,
    selected_item: PropTypes.object,
    ward_master: PropTypes.array,
    department_options:PropTypes.object,
    workzone_name:PropTypes.string,
    need_level_options:PropTypes.object,
    icu_count : PropTypes.number,
    hcu_count : PropTypes.number,
    general_count : PropTypes.number,
    moveNext: PropTypes.func,
    movePrev: PropTypes.func,
    necessary_master: PropTypes.object
  };
  
  export default NurseServerityModal;
  