import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import { surface } from "~/components/_nano/colors";
import PropTypes from "prop-types";
import InputKeyBoard from "~/components/molecules/InputKeyBoard";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import InputKeyWord from "~/components/molecules/InputKeyWord";
import * as apiClient from "../../../../api/apiClient";
import Radiobox from "~/components/molecules/Radiobox";

const Card = styled.div`
  position: relative;  
  overflow: hidden; 
  overflow-y: auto;
  margin: 0px;
  float: left;
  width: 100%;
  height: 100%;
  background-color: ${surface};
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: calc(100% - 60px);
  font-size: 14px;
  display: flex;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .left-area {
    height: 100%;
    width: 60%;
    .history-list{
      overflow-y: auto;
      font-size:16px;
      border: 1px solid #aaa;
      table {
        tbody {
          tr:nth-child(even) {background-color: #f2f2f2;}
          tr:hover{background-color:#e2e2e2 !important;}
        }
        td {
            padding: 0.25rem;
            text-align: left;  
            font-size: 18px;
        }
        th {
            text-align: center;
            padding: 0.3rem;  
            font-size: 22px;
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
  .label-box {
    font-size: 16px;
    border: 1px solid #a0a0a0;
  }
  .cursor{
    cursor:pointer;
  }
  .change-no {
    padding-top: 15px;
    label {
        font-size: 16px;
    }
  }
  .search_word {
    display: flex;
    font-size: 18px;
    margin-bottom: 2px;
    button{
        padding: 4px;
        span{
            font-weight: 100;
            font-size: 16px;
        }
    }
    .select-id{
        width:40%;
        .dLPwli{
            width: 70%;
        }
        input {
          ime-mode:active;
        }
    }
    .select-word{
        width:60%;
        .dLPwli {
            width: 100%;
        }  
        input {
          ime-mode:active;
        }  
    }
    label {
        width: 0;
        margin-bottom: 3px;
    }
    input {
        font-size: 20px;
    }
  }
  .search_type_no {
    padding-top:5px;
    padding-bottom:5px;
    label {
        font-size: 14px;
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

class SelectPatientModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      patientsList: [],
      search_word:'',
      search_id:'',
      search_type:0,
      cur_caret_pos:0,
      is_kana: 0,
      showAlert: false,
      is_searched: false,
      showTitle: "",
      modal_data: {},
      screen_keyboard_use:JSON.parse(window.sessionStorage.getItem("init_status")).screen_keyboard_use,
    }
  }
  async componentDidMount() {
    if(this.state.screen_keyboard_use === 0){
      let modal_dialog = document.getElementsByClassName("select-patient-modal")[0].getElementsByClassName("modal-dialog")[0];
      if(modal_dialog !== undefined && modal_dialog != null){
        modal_dialog.style['max-width'] = '50vw';
      }
      let modal_content = document.getElementsByClassName("select-patient-modal")[0].getElementsByClassName("modal-content")[0];
      if(modal_content !== undefined && modal_content != null){
        modal_content.style['width'] = '50vw';
      }
      let history_list = document.getElementsByClassName("select-patient-modal")[0].getElementsByClassName("history-list")[0];
      if(history_list !== undefined && history_list != null){
        history_list.style['height'] = 'calc(100% - 90px)';
      }
    }
  }

  selectTitleTab = e => {
    this.setState({activeIndex: parseInt(e.target.id)});
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
    // this.context.$updateSchKanaVal(search_word);
    this.setState({search_word, cur_caret_pos:cur_caret_pos + 1}, ()=>{
      var search_input_obj = document.getElementById("search_input");
      search_input_obj.onfocus = this.setCaretPosition('search_input', this.state.cur_caret_pos);
      search_input_obj = null;
      this.searchPatientsListKana();
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
        this.searchPatientsListKana();
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
  };

  onInputKeyPressed = (e) => {
    if(e.keyCode === 13){
      this.searchPatientsListKana();
    }
  };

  selectSearchType = (value) => {
    this.setState({ search_type: value}, ()=>{
      this.searchPatientsListKana();
    });
  };

  selectSearchTypeNo = (e) => {
    this.setState({ search_type: parseInt(e.target.value)}, ()=>{
      this.searchPatientsListKana();
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
  };

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
  };

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
  };

  searchByWord = () => {
  };
  searchById = () => {
  };

  searchPatientsList = () => {
    this.setState({
      is_kana: 0,
    },() => {
      this.getPatientsListSearchResult();
    });
  };
  searchPatientsListKana = () => {
    this.setState({
      is_kana: 1,
    },() => {
      this.getPatientsListSearchResult();
    });
  };
  getPatientsListSearchResult = async () => {
    this.setState({systemPatientId: 0});
    const {
      pageStatus,
      limitStatus
    } = this.context;
    let schValId = this.state.search_id;
    let schValKana = this.state.search_word;
    let is_kana = this.state.is_kana;
    let treatStatus=2;

    let path = "/app/api/v2/patients/received";
    let post_data = {

    };

    if (!is_kana){
      post_data.keyword = schValId != "" ? schValId : "";
    } else {
      post_data.keywordKana = schValKana != "" ? schValKana : "";
    }
    post_data.status = treatStatus ? treatStatus:0;
    post_data.page = pageStatus ? pageStatus:1;
    post_data.limit = limitStatus != 20 ? limitStatus : "";
    post_data.name_search_type = this.state.search_type;

    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if (res) {
          this.setState({is_searched: true,  patientsList:res });
        }
      })
      .catch(() => {
      });
  };

  searchId = e => {
    var word = e.target.value;
    word = word.toString().trim();
    this.convertStr(word);
    // this.context.$updateSchIdVal(word);
    this.setState({
      is_kana: 0,
      search_id:word
    });
  };
  searchKana = e => {
    var word = e.target.value;
    let search_input_obj = document.getElementById("search_input");
    let cur_caret_pos = search_input_obj.selectionStart;
    word = word.toString().trim();
    // this.context.$updateSchKanaVal(word);
    this.setState({
      search_word:word,
      is_kana: 1,
      cur_caret_pos:cur_caret_pos
    });
  };
  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.searchPatientsList();
    }
  };
  enterPressedKana = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.searchPatientsListKana();
    }
  };

  convertStr = str => {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
  };

  selectPatient = (value) => {
    this.setState({
      systemPatientId: value.systemPatientId,
      select_number: value.systemPatientId,
      selected_patient_info: value
    })
  };

  handleOk = () =>{
    if (this.state.systemPatientId > 0) {
      let isExist = false;
      let patientsList = this.context.patientsList;
      if(patientsList != null && patientsList != undefined && patientsList.length > 0) {
        patientsList.map(item=>{
          if (item.system_patient_id == this.state.systemPatientId) {
            isExist = true;
          }
        });
      }
      if (patientsList != null && patientsList != undefined && patientsList.length > 3 && isExist == false) {
        this.setState({
          showAlert: true,
          showTitle: "4人以上の患者様を編集することはできません。"
        });
        return;
      }

      this.props.handleOk(this.state.selected_patient_info);
    } else {
      this.setState({
        showAlert: true
      });
    }
  };

  closeAlert = () => {
    this.setState({
      showAlert: false,
      showTitle: "",
    });
  }

  render() {
    let {patientsList} = this.state;
    return  (
      <Modal show={true} id="select_pannel_modal"  className="select-patient-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>患者選択</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <Wrapper>
              <div className="left-area" style={{width:this.state.screen_keyboard_use === 0 ? "100%":"60%"}}>
                <div className={'search_word'}>
                  <div className="select-id border d-flex p-1 border-dark">
                    <InputKeyWord
                      id={'search_input_id'}
                      type="text"
                      label=""
                      onChange={this.searchId.bind(this)}
                      onKeyPressed={this.enterPressed}
                      value={this.state.search_id}
                    />
                    <Button type="mono" className="search-btn ml-2" onClick={this.searchPatientsList.bind(this)}>ID指定</Button>
                  </div>
                  <div className="select-word d-flex ml-2 border p-1 border-dark">
                    <InputKeyWord
                      id={'search_input'}
                      type="text"
                      label=""
                      onChange={this.searchKana.bind(this)}
                      onKeyPressed={this.enterPressedKana}
                      onClick={this.onClickInputWord}
                      // value={this.context.schValKana}
                      value={this.state.search_word}
                    />
                    <Button type="mono" className="search-btn ml-2" onClick={this.searchPatientsListKana.bind(this)}>検索</Button>
                  </div>
                </div>

                {this.state.screen_keyboard_use === 0 && (
                  <div className={'search_type_no'}>
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

                <div className="history-list" style={{height: 'calc(100% - 51px)'}}>
                  <table className="table-scroll table table-bordered" id={`inspection-pattern-table`}>
                    <thead>
                    <tr>
                      <th>患者番号</th>
                      <th>氏名</th>
                      <th>カナ氏名</th>
                      <th>性別</th>
                    </tr>
                    </thead>
                    <tbody>
                    {(patientsList !== undefined && patientsList != null && patientsList.length > 0) ? (
                      patientsList.map((item, index) => {
                        if(item.is_enabled !== 0){
                          return (
                            <>
                              <tr key={index} className={this.state.select_number == item.systemPatientId ? "selected cursor" : "cursor"} onClick={this.selectPatient.bind(this,item)}>
                                <td>{item.patientNumber}</td>
                                <td>{item.name}</td>
                                <td>{item.patient_name_kana}</td>
                                <td>{item.sex === 1?"男性":"女性"}</td>
                              </tr>
                            </>)
                        }
                      })
                    ) : (
                      <>
                        {this.state.is_searched && (
                          <tr>
                            <td colSpan={'4'} className={'text-center'}>条件に一致する結果は見つかりませんでした。</td>
                          </tr>
                        )}
                      </>
                    )}
                    </tbody>
                  </table>
                </div>
              </div>
              {this.state.screen_keyboard_use === 1 && (
                <div className="right-area">
                  <InputKeyBoard
                    search_type={this.state.search_type}
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
          </Card>
          {this.state.showAlert && (
            <SystemAlertModal
              hideModal= {this.closeAlert}
              handleOk= {this.closeAlert}
              showMedicineContent= {this.state.showTitle == "" ? "患者様を選択してください。" : this.state.showTitle}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.props.closeModal} className={"custom-modal-btn cancel-btn"} style={{cursor:"pointer"}} id='cancel_btn'>
            <span>キャンセル</span>
          </div>
          <div onClick={this.handleOk} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}>
            <span>選択</span>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

SelectPatientModal.contextType = Context;

SelectPatientModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk:   PropTypes.func,
};

export default SelectPatientModal;
