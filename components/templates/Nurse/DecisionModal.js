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
  import InputWithLabel from "~/components/molecules/InputWithLabel";
  import Button from "~/components/atoms/Button";
  // import $ from "jquery";  
  import {formatJapanDate, formatDateTimeIE} from "~/helpers/date";
  import Checkbox from "~/components/molecules/Checkbox";  
  // import DatePicker, { registerLocale } from "react-datepicker";
  // import ja from "date-fns/locale/ja";
  // registerLocale("ja", ja);
  import ProgressChart from "~/components/templates/Nurse/ProgressChart/ProgressChart";  
  import DetailHistoryModal from "./DetailHistoryModal";

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
        padding-top:5px;
        font-size:18px;
        width:auto;
        text-align:center; 
        padding-left:10px;
        padding-right:10px;
        border:1px solid;
      }
      .label-title{
        font-size:18px;
        width:80px;
        text-align:right;
        margin-right:5px;
      }
      .pullbox-label, .pullbox-select{
        width:200px;
        font-size:16px;
        margin-right:20px;
      }
      .example-custom-input{
        font-size:20px;
        border:1px solid;
        padding:3px;
      }
      .checkbox-area{
        padding-top:5px;
        label{
          font-size:16px;
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
      padding-left:20px;
      max-height:15rem;
      overflow:auto;
      th{
        background:lightgray;
        text-align:center;
      }
      .checkbox-area{
        font-size:16px;
        label{
          margin-right:20px;
        }
        margin-right:30px;
        padding-top:7px;
        margin-left:30px;
      }
      button{
        // margin-right:20px;
      }      
    }
    .no-border-td{
      border-top:none;
      border-left:noen;
      border-bottom:none;
      width:120px;
    }
    .small-row{
      width:75%;
    }
    .main-content{
      justify-content: space-between;
      .one-blog{
        width:250px;
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
        font-size: 25px;
        margin-left: 50px;
        height:40px;
      }
      .table-content{
        margin-left:50px;
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
      height: 23rem;
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
        }
        vertical-align:middle;
      }
      th{
        background:lightgray;
        text-align:center;
      }
    }
    .sub-footer{
      position:relative;
      .checker-area{
        position:absolute;
        right:10px;
        input[type="checkbox"]{
          margin-top:10px;
        }
        input[type="text"]{
          height:30px;
        }
        label{
          width:5rem;
          text-align:right;
          margin-right:10px;
        }
        .label-title{
          display:none;
        }
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
  
  class DecisionModal extends Component {
    constructor(props) {
      super(props);    
      this.state = {        
        departmentCode:1,        
        number:0,
        tab_id:0,        
        isOpenDecideModal:false,
        // nurse_require_master: this.props.nurse_require_master,
        confirm_flag:false,
        isOpenProgressChart:false,
        isOpenDetailHistoryModal:false,
      }      
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }

    componentDidMount(){
      this.getSearchResult();
    }

    getSearchResult = async() => {
      let path = "/app/api/v2/master/nurse/require_search";
      let post_data = {from_dicision:true};
      await apiClient.post(path, post_data)
      .then((res) => {
        this.setState({
          nurse_require_master:res,
        })
      });
    }

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
        isOpenProgressChart:false,
        isOpenDetailHistoryModal:false,
      })
    }

    openDecideModal = () => {
      this.setState({
        isOpenDecideModal:true,
      })
    }

    selectCheckbox = (name, value) => {
      this.setState({[name]:value});
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

    handleOk = () => {
      if (this.state.confirm_flag != true) return;
      this.props.closeModal();
      this.props.handleOk();
    }

    openProgressChart = () => {
      this.setState({
        isOpenProgressChart:true,
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
      var nurse_require_master = this.state.nurse_require_master;
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));      
      var user_name = authInfo.name
      return (
        <>
          <Modal
            show={true}          
            id="outpatient"
            className="custom-modal-sm patient-exam-modal bed-control-modal first-view-modal"
          >
            <Modal.Header>
              <Modal.Title style={{width:'25rem'}}>判定結果</Modal.Title>
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
                <div>判定内容を確認・修正後、「確認」にチェックを入れてから「保存」ボタンを押下してください。</div>
                <div className='sub-header'>
                  <table className = 'table table-bordered no-break'>
                    <thead>
                      <tr>
                        <th>ガイド</th>
                        <th>項目名</th>
                        <th>カテゴリ１</th>
                        <th>カテゴリ２</th>
                        <th>カテゴリ３</th>
                        <th>カテゴリ４</th>
                        <th>カテゴリ5</th>
                        <th>歴参照</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nurse_require_master != undefined && nurse_require_master != null && nurse_require_master[1] != undefined && nurse_require_master[1]!=null && (
                        Object.keys(nurse_require_master[1]).map((key) => {
                          var item = nurse_require_master[1][key];
                          var first_item = item[Object.keys(item)[0]];                          
                          return(
                            <>
                            <tr>                              
                              <td style={{textAlign:'center'}}><button>ガイド</button></td>
                              <td>{first_item.name}</td>
                              <td style={{textAlign:'center'}} className={item[1] != undefined && item[1].is_selected?'selected':''}>{item[1] != undefined? item[1].category_name:''}</td>
                              <td style={{textAlign:'center'}} className={item[2] != undefined && item[2].is_selected?'selected':''}>{item[2] != undefined? item[2].category_name:''}</td>
                              <td style={{textAlign:'center'}} className={item[3] != undefined && item[3].is_selected?'selected':''}>{item[3] != undefined? item[3].category_name:''}</td>
                              <td style={{textAlign:'center'}} className={item[4] != undefined && item[4].is_selected?'selected':''}>{item[4] != undefined? item[4].category_name:''}</td>
                              <td style={{textAlign:'center'}} className={item[5] != undefined && item[5].is_selected?'selected':''}>{item[5] != undefined? item[5].category_name:''}</td>
                              <td style={{textAlign:'center'}}><button onClick={this.openDetailHistory.bind(this, item)}>歴参照</button></td>
                            </tr>
                            </>
                          )
                        })
                      )}
                      {nurse_require_master != undefined && nurse_require_master != null && nurse_require_master[2] != undefined && nurse_require_master[2]!=null && (
                        Object.keys(nurse_require_master[2]).map((key) => {
                          var item = nurse_require_master[2][key];
                          var first_item = item[Object.keys(item)[0]];                          
                          return(
                            <>
                            <tr>                              
                              <td style={{textAlign:'center'}}><button>ガイド</button></td>
                              <td>{first_item.name}</td>
                              <td style={{textAlign:'center'}} className={item[1] != undefined && item[1].is_selected?'selected':''}>{item[1] != undefined? item[1].category_name:''}</td>
                              <td style={{textAlign:'center'}} className={item[2] != undefined && item[2].is_selected?'selected':''}>{item[2] != undefined? item[2].category_name:''}</td>
                              <td style={{textAlign:'center'}} className={item[3] != undefined && item[3].is_selected?'selected':''}>{item[3] != undefined? item[3].category_name:''}</td>
                              <td style={{textAlign:'center'}} className={item[4] != undefined && item[4].is_selected?'selected':''}>{item[4] != undefined? item[4].category_name:''}</td>
                              <td style={{textAlign:'center'}} className={item[5] != undefined && item[5].is_selected?'selected':''}>{item[5] != undefined? item[5].category_name:''}</td>
                              <td style={{textAlign:'center'}}><button onClick={this.openDetailHistory.bind(this, item)}>歴参照</button></td>
                            </tr>
                            </>
                          )
                        })
                      )}
                      {nurse_require_master != undefined && nurse_require_master != null && nurse_require_master[3] != undefined && nurse_require_master[3]!=null && (
                        Object.keys(nurse_require_master[3]).map((key) => {
                          var item = nurse_require_master[3][key];
                          var first_item = item[Object.keys(item)[0]];                          
                          return(
                            <>
                            <tr>                              
                              <td style={{textAlign:'center'}}><button>ガイド</button></td>
                              <td>{first_item.name}</td>
                              <td style={{textAlign:'center'}} className={item[1] != undefined && item[1].is_selected?'selected':''}>{item[1] != undefined? item[1].category_name:''}</td>
                              <td style={{textAlign:'center'}} className={item[2] != undefined && item[2].is_selected?'selected':''}>{item[2] != undefined? item[2].category_name:''}</td>
                              <td style={{textAlign:'center'}} className={item[3] != undefined && item[3].is_selected?'selected':''}>{item[3] != undefined? item[3].category_name:''}</td>
                              <td style={{textAlign:'center'}} className={item[4] != undefined && item[4].is_selected?'selected':''}>{item[4] != undefined? item[4].category_name:''}</td>
                              <td style={{textAlign:'center'}} className={item[5] != undefined && item[5].is_selected?'selected':''}>{item[5] != undefined? item[5].category_name:''}</td>
                              <td style={{textAlign:'center'}}><button onClick={this.openDetailHistory.bind(this, item)}>歴参照</button></td>
                            </tr>
                            </>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div>判定根拠</div>
                <div className="work-area">
                  <table className='table table-bordered no-break'>
                    <thead>
                      <tr>
                        <th>項目名</th>
                        <th>グループ</th>
                        <th>詳細</th>
                        <th>前日定時評価以降</th>
                        <th>当日深夜</th>
                        <th>当日定時評価</th>
                        <th>当日準夜</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nurse_require_master != undefined && nurse_require_master != null && nurse_require_master[1] != undefined && nurse_require_master[1]!=null && (
                        Object.keys(nurse_require_master[1]).map((key) => {
                          var item = nurse_require_master[1][key];
                          var first_item = item[Object.keys(item)[0]];
                          var key_len = Object.keys(item).length;
                          return(
                            Object.keys(item).map((sub_key, sub_index)=> {
                              var sub_item = item[sub_key];
                              return(
                                <>
                                <tr>
                                  {sub_index==0 && (
                                    <td rowSpan = {key_len}>{first_item.name}</td>
                                  )}
                                  <td>{sub_item.group}</td>
                                  <td>{sub_item.detail}</td>
                                  <td>&nbsp;</td>
                                  <td></td>
                                  <td></td>
                                  <td></td>
                                </tr>
                                </>
                              )
                            })
                          )
                        })
                      )}
                    </tbody>                    
                  </table>
                  </div>
                  <div className='sub-footer'>
                    <div>判定根拠には、文書内もしくはタイトル名に指定のキーワードが含まれている情報のみを表示しています。またはマウスカーソルを当てると詳細を表示します。</div>
                    <div>判定根拠のヘッダー部（勤務帯）の背景色が青色になっている勤務帯が判定対象となっている勤務帯になります。</div>
                    <div>判定根拠にて橙色の背景色がついている情報を判定対象としております。</div>
                    <div className='checker-area flex'>
                      <Checkbox
                        label = "確認"
                        getRadio={this.selectCheckbox.bind(this)}
                        value={this.state.confirm_flag}
                        name="confirm_flag"
                      />
                      <InputWithLabel
                        label=""
                        type="text"
                        // placeholder="パターンコードを入力"
                        // getInputText={this.getInstructName.bind(this)}
                        diseaseEditData={this.state.confirm_flag == true?user_name:''}
                      />
                    </div>
                </div>
                
              </Popup>
            </Modal.Body>
            <Modal.Footer>
              <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
              <Button className="red-btn" onClick={this.openProgressChart.bind(this)}>熱型表参照</Button>
              <Button className={this.state.confirm_flag == true? 'red-btn' :'disable-btn'} onClick={this.handleOk.bind(this)}>保存</Button>
            </Modal.Footer>            
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
            />    
            {this.state.isOpenProgressChart && (
              <ProgressChart
               closeModal = {this.closeModal}
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
          </Modal>
        </>
      );
    }
  }
  DecisionModal.contextType = Context;
  
  DecisionModal.propTypes = {  
    handleOk :  PropTypes.func,
    closeModal: PropTypes.func,
    patientId: PropTypes.number,
    // nurse_require_master: PropTypes.object,
    selected_item:PropTypes.object,
    ward_master: PropTypes.array,
    department_options:PropTypes.object,
    workzone_name: PropTypes.string,
    necessary_master: PropTypes.object
  };
  
  export default DecisionModal;
  