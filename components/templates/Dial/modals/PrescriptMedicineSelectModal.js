import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import { surface } from "~/components/_nano/colors";
import PropTypes from "prop-types";
import InputKeywordBody from "~/components/templates/Dial/modals/InputKeywordBody";
import * as methods from "../DialMethods";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import RadioButton from "~/components/molecules/RadioInlineButton";
import Checkbox from "~/components/molecules/Checkbox";
import InputKeyWord from "~/components/molecules/InputKeyWord";
import $ from "jquery";
import CalcDial from "~/components/molecules/CalcDial";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  height: 12.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
  height: 100%;
  font-size: 14px;
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
        .radio-btn label{
            width: 3.75rem;
            border: solid 1px rgb(206, 212, 218);
            border-radius: 0.25rem;
            margin-right: 0.3rem;
            padding: 0.25rem 0.3rem;
            font-size: 1rem;
            line-height: 2rem;
        }
        .last-label {
          width: 6.875rem !important;
        }
        .disable-item{
            label{
                background: #ddd;
            }
        }
    }
    .history-list{
      font-size:1rem;
      border: 1px solid #aaa;
      
        height: 100%;
        margin-bottom:0;
        table {
            margin-bottom: 0;
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
        }
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
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
    padding-top: 0.4rem;
    label {
        font-size: 1rem;
    }
  }
  .search_word {
    width: 70%;
    margin-bottom:0.62rem;
    label {
        width: 0;
        margin: 0;
    }
    input {
        font-size: 1.25rem;
        height: 2.5rem;
    }
 `;

const medicine_type_name = ["内服", "頓服", "外用", "処置", "麻酔", "インスリン"];

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

class PrescriptMedicineSelectModal extends Component {
  constructor(props) {
    super(props);
      Object.entries(methods).forEach(([name, fn]) =>
          name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
      );
        this.state = {
            activeIndex: 0,
            medicineList: [],
            item_code: "",
            item_name: "",
            amount: "",
            search_word:'',
            category: this.props.medicine_kind,
            search_type:1,
            change_no:0,
            cur_caret_pos:0,
            isOpenCalcModal: false,
            calcUnit: "",
            calcTitle: "",
            isBackConfirmModal: false,
            confirm_message: false,
            origin_index: '',
            is_loaded: false,
            selected_number: ""
        }
    }
    async componentDidMount() {
        await this.getMedicinesByKind(this.props.medicine_kind, 'name_kana');
        this.setCaretPosition('search_input', this.state.cur_caret_pos);
        if (this.state.medicineList !== undefined && this.state.medicineList != null && this.state.medicineList.length > 0 &&
            this.props.selected_medicine !== undefined && this.props.selected_medicine != null) {
            let medicine_item = this.state.medicineList.find(x=>x.code==this.props.selected_medicine.item_code);
            this.setState({
                medicine: this.props.selected_medicine,
                selected_number: medicine_item !== undefined ? medicine_item.number : "",
                change_no: this.props.selected_medicine.is_not_generic == 1
            });
            this.scrollToelement();
        }
        this.setState({is_loaded: true});
    }

    getRadio = (name) => {
        if (name === "check") {
            // console.log(name)
        }
    };

    selectTitleTab = e => {
        this.setState({activeIndex: parseInt(e.target.id)});
    }

    openAmountModal = (item) => {
        if (this.props.selected_medicine !== undefined && this.props.selected_medicine != null){
            let post_data = {
                item_code: item.code,
                item_name: item.name,
                unit: item.unit,
                amount:this.props.selected_medicine.amount,
                is_not_generic: this.state.change_no
            };
            this.props.handleOk(post_data,this.props.rp_number,0);
        } else {
            this.setState({
                medicine:item,
                isOpenCalcModal: true,
                calcInit: 0,
                calcValType: "",
                calcTitle: item.name,
                calcUnit: item.unit,
                selected_number: item.number,
            });
            this.modalBlack();      
        }
    };
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
      confirm_message: "",
      alert_messages: "",
      confirm_alert_title:'',
    });
    this.modalBlackBack();
  }

    inputAmount = (amount) => {
        let medicineList = this.state.medicineList;
        let medicine = medicineList.find(x=>x.number == this.state.selected_number);
        if (medicine != undefined) {
          let item_code = medicine.code;
          let item_name = medicine.name;
          let unit = medicine.unit;
  
          this.setState({
              // medicineList,
              item_code,
              item_name,
              amount,
              unit,
              // isOpenModal: false,
              isOpenCalcModal: false,
              calcValType: "",
              calcTitle: "",
              calcUnit: "",
              calcInit: 0,
          },()=>{
              this.handleOk();
          });
        }
        
    };

    handleOk = () => {
        if (this.state.selected_number === undefined || this.state.selected_number === null || this.state.selected_number === "" || this.state.amount == ""){
            window.sessionStorage.setItem("alert_messages", "薬剤を選択してください。");
            return;
        }
        let post_data = {
            item_code: this.state.item_code,
            item_name: this.state.item_name,
            amount: this.state.amount,
            unit: this.state.unit,
            is_not_generic: this.state.change_no
        };
        this.props.handleOk(post_data,this.props.rp_number,this.props.is_open_usage);
    };

    getInputWord = e => {
        let search_input_obj = document.getElementById("search_input");
        let cur_caret_pos = search_input_obj.selectionStart;
        this.setState({search_word: e.target.value, cur_caret_pos:cur_caret_pos, is_loaded: false},()=>{
            this.getMedicinesByKind(this.state.category, 'name_kana', '', this.state.search_word, this.state.search_type ).then(()=>{
                this.setState({is_loaded: true});
            });
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
            this.setState({
                is_loaded: false
            },()=>{
                this.getMedicinesByKind(this.state.category, 'name_kana', '', search_word, this.state.search_type ).then(()=>{
                this.setState({is_loaded: true});
            });
            })
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
                this.setState({is_loaded:false},()=>{
                    this.getMedicinesByKind(this.state.category, 'name_kana', '', this.state.search_word, this.state.search_type ).then(()=>{
                        this.setState({is_loaded: true})
                    });
                })
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

    selectMedicineType = (e) => {
        if (this.props.is_open_usage){
            this.setState({ 
                category: e.target.value,
                is_loaded: false
            },()=>{
                this.getMedicinesByKind(this.state.category, 'name_kana', '', this.state.search_word, this.state.search_type ).then(()=>{
                    this.setState({is_loaded: true});
                });
            });
        }
    };

    getChangeNo = (name, value) => {
        if (name === "change_no"){
            this.setState({change_no: value});
        }
    };

    onInputKeyPressed = (e) => {
        if(e.keyCode === 13){
            this.setState({ 
                is_loaded: false
            },()=>{
                this.getMedicinesByKind(this.state.category, 'name_kana', '', this.state.search_word, this.state.search_type ).then(()=>{
                    this.setState({is_loaded: true});
                });
            });
        }
    }

    selectSearchType = (value) => {
        this.setState({ search_type: value, is_loaded: false}, ()=>{
            this.getMedicinesByKind(this.state.category, 'name_kana', '', this.state.search_word, value ).then(()=>{
                this.setState({is_loaded:true})
            });
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

    onHide=()=>{};

    scrollToelement = () => {
        const els = $(".prescript-medicine-select-modal .selected");
        const pa = $(".prescript-medicine-select-modal .history-list");
        if (els.length > 0 && pa.length > 0) {
            const elHight = $(els[0]).height();
            const elTop = $(els[0]).position().top;
            const paHeight = $(pa[0]).height();
            const scrollTop = elTop - (paHeight - elHight) / 2;
            $(pa[0]).scrollTop(scrollTop);
        }
    };

    calcCancel = () => {
        this.setState({
            isOpenCalcModal: false,
            calcValType: "",
            calcTitle: "",
            calcUnit: "",
            calcInit: 0
        });
        this.modalBlackBack();
    }

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

  render() {
    let {medicineList} = this.state;
    return  (
      <Modal show={true} onHide={this.onHide} id="select_pannel_modal"  className="master-modal prescript-medicine-select-modal">
        <Modal.Header>
          <Modal.Title>薬剤選択パネル</Modal.Title>
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
                    <div className={'flex'}>
                        <div className="medicine_type flex">
                            <>
                                {medicine_type_name.map((item, index)=>{
                                    return (
                                        <>
                                            <div className={!this.props.is_open_usage && this.state.category !== item ? "disable-item" : ""}>
                                                <RadioButton
                                                    id={`prescript_usage_${index}`}
                                                    value={item}
                                                    label={item}
                                                    name="medicine_type"
                                                    getUsage={this.selectMedicineType}
                                                    checked={this.state.category === item ? true : false}
                                                    className={index == medicine_type_name.length - 1 ? "last-label": ""}
                                                />
                                            </div>
                                        </>
                                    );
                                })
                                }
                            </>
                        </div>
                        <div className={'change-no'}>
                            <Checkbox
                                label="後発薬品への変更不可"
                                getRadio={this.getChangeNo.bind(this)}
                                value={this.state.change_no}
                                name="change_no"
                            />
                        </div>
                    </div>
                        <div className="history-list" style={{height: 'calc(100% - 6.7rem)'}}>
                            <table className="table-scroll table table-bordered table-hover" id={`inspection-pattern-table`} style={{height: "100%", display:"block"}}>
                                <thead>
                                <tr>
                                    <th style={{width:"25vw"}}>表示名称</th>
                                    <th>一般名称</th>
                                </tr>
                                </thead>
                                {this.state.is_loaded ? (
                                <tbody>
                                {(medicineList !== undefined && medicineList != null && medicineList.length > 0) ? (
                                    medicineList.map((item, index) => {
                                        if(item.is_enabled !== 0){
                                            return (
                                                <>
                                                    <tr key={index} className={this.state.selected_number == item.number ? "selected cursor" : "cursor"} onClick={this.openAmountModal.bind(this, item)}>
                                                        <td style={{width:"25vw"}}>{item.name}</td>
                                                        <td>{item.generic_name}</td>
                                                    </tr>
                                                </>)
                                        }
                                    })
                                ) : (<>
                                    <tr>
                                        <td colSpan={'2'} className={'text-center'}>登録された薬剤がありません。</td>
                                    </tr>
                                    </>)}
                                </tbody>
                                ): (
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
          {this.state.isOpenCalcModal ? (
            <CalcDial
                  calcConfirm={this.inputAmount}
                  units={this.state.calcUnit}
                  calcCancel={this.calcCancel}
                  daysSelect={false}
                  daysInitial={0}
                  daysLabel=""
                  daysSuffix=""     
                  maxAmount={100000}         
                  calcTitle={this.state.calcTitle}  
                  calcInitData={this.state.calcInit}          
                />
          ) : (
            ""
          )}
          {this.state.isBackConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.closeConfirmModal}
              confirmTitle={this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )} 
        </Modal.Body>
          <Modal.Footer>            
            <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>              
            {/*<Button className="red-btn" onClick={this.handleOk}>選択</Button>*/}
          </Modal.Footer>
      </Modal>
    );
  }
}

PrescriptMedicineSelectModal.contextType = Context;

PrescriptMedicineSelectModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk:   PropTypes.func,
    modal_data:PropTypes.object,
    rp_number: PropTypes.number,
    is_open_usage: PropTypes.number,
    medicine_kind: PropTypes.string,
    selected_medicine:PropTypes.object
};

export default PrescriptMedicineSelectModal;