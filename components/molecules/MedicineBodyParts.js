import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import Button from "../atoms/Button";
import { KEY_CODES } from "../../helpers/constants";
import { Modal } from "react-bootstrap";

const MedicineBodyPartsContent = styled.div`
  background-color: ${colors.surface};
  border: 1px solid #ced4da;
  box-sizing: border-box;
  padding: 10px 10px 0;
  width: 100%;
  max-height: 560px;

  .btn-box {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
    padding-bottom: 10px;
    button {
      width: 80px;
      height: 30px;
      min-width: 80px;
      line-height: 28px;
      padding: 0;
      margin-right: 46px;
    }
    .focus {
      border: 1px solid #ff0000;
    }
  }
  .cancel-btn {
    background: #ffffff;
    border: solid 2px #7e7e7e;
    span {
      color: #7e7e7e;
    }
  }
  .cancel-btn:hover {
    border: solid 2px #000000;
    background: #ffffff;
    span {
      color: #000000;
    }
  }
  .red-btn {
    background: #cc0000 !important;
    span {
      color: #ffffff !important;
    }
  }
  .red-btn:hover {
    background: #e81123 !important;
    span {
      color: #ffffff !important;
    }
  }
  .del_btn_box {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    padding-bottom: 10px;
    button {
      width: 100px;
      height: 30px;
      min-width: 80px;
      line-height: 28px;
      padding: 0;
      // margin-right: 46px;
    }
    .focus {
      border: 1px solid #ff0000;
    }
    .alldel{
      margin-right:408px;
    }
  }

  .body-part {
    display: flex;
    padding: 5px;
    span {
      line-height: 40px;
      width: 60px;
    }

    input {
      width: 100%;
      background: #f1f3f4;
      border: 1px solid #000;
      margin-right: 46px;
      margin-left: 46px;
      padding: 0 8px;
      height: 2rem;
    }
  }

  .usage-title {
    padding: 5px;
    width: 100%;
    margin: auto;
    text-align: center;

    span {
      line-height: 30px;
      padding: 5px 10px;
      border: 1px solid #000;
    }
  }

  .notice {
    margin-right: 46px;
    text-align: right;
  }

  .body-parts {
    padding: 10px 25px;
    margin: 10px auto;

    span {
      line-height: 35px;
      border: 1px solid #000;
      border-radius: 4px;
      display: inline-block;
      text-align: center;
      margin: 8px;
      cursor: pointer;
      width: 40px;
      &:hover {
        background: #ccc;
      }
      &:nth-child(32) {
        margin-right: 121px;
      }
      &:nth-child(11) ,
      &:nth-child(19) ,
      &:nth-child(41) ,
      &:nth-child(42) ,
      &:nth-child(20) {
        margin-right: 64px;
      }
    }

    .focus {
      border: 1px solid #ff0000;
    }

    .selected {
      background: #ccc;
    }
  }
`;

const BTN_INDEX_LAST_BODY_PART = 52;
const BTN_INDEX_CANCEL  = BTN_INDEX_LAST_BODY_PART + 1;
const BTN_INDEX_CONFIRM = BTN_INDEX_LAST_BODY_PART + 2;
const BTN_INDEX_ALLDELL = BTN_INDEX_LAST_BODY_PART + 3;
const BTN_INDEX_ONEDELL = BTN_INDEX_LAST_BODY_PART + 4;

let big_hirakana = Array(
    'あ','い','う','え','お',
    'か','き','く','け','こ',
    'さ','し','す','せ','そ',
    'た','ち','つ','て','と',
    'な','に','ぬ','ね','の',
    'は','ひ','ふ','へ','ほ',
    'ま','み','む','め','も',
    'や','い','ゆ'
);
let big_murky_hirakana = Array(
    '','','','','',
    'が','ぎ','ぐ','げ','ご',
    'ざ','じ','ず','ぜ','ぞ',
    'だ','ぢ','づ','で','ど',
    '','','','','',
    'ば','び','ぶ','べ','ぼ',
    '','','','','',
    '','','','','',
    '','','','','',
    '','',''
);
let big_semivarous_hirakana = Array(
    '','','','','',
    '','','','','',
    '','','','','',
    '','','','','',
    '','','','','',
    'ぱ','ぴ','ぷ','ぺ','ぽ',
    '','','','','',
    '','','','','',
    '','','','','',
    '','',''
);

class MedicineBodyParts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body_part: (props.body_part !== undefined && props.body_part != null) ? this.props.body_part : '',
      partData: [],         
      itemIndex: 0
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.onInputKeyPressed = this.onInputKeyPressed.bind(this);
    this.carpos= (this.props.body_part != undefined && this.props.body_part != "") ? this.props.body_part.length : 0;
  }

  componentDidMount() {
    const { bodyPartData } = this.props;    
    const { body_part } = this.state;
    let parts = body_part.split("、");
    let partData = bodyPartData.map(item => {
      let value = parts.find(v => v === item.value);
      return {
        id: item.id,
        label: item.label,
        value: item.value,
        class_name: value ? "selected" : ""
      };
    });    
    this.setState({ partData });
    document.getElementById("body_part_dlg").focus();
    document.getElementById("input_selectedParts").focus();
    this.setCaretPosition(
        document.getElementById("input_selectedParts"),
        this.carpos
      );
  }

  onKeyPressed(e) {
    if (e.target === e.currentTarget) {
      let itemIndex = this.state.itemIndex;
      if (e.keyCode === KEY_CODES.enter) {
        e.preventDefault();
        e.stopPropagation();
        if (itemIndex == BTN_INDEX_CANCEL) {
          this.cancelFunc();
        } else if (itemIndex == BTN_INDEX_CONFIRM) {
          this.confirmFunc();
        } else if (itemIndex == BTN_INDEX_ALLDELL) {
          this.allDelFunc();
        } else if (itemIndex == BTN_INDEX_ONEDELL) {
          this.oneDelFunc();
        } else {
          this.selectBody(this.state.partData[this.state.itemIndex]);
        }
        return;
      } else if (e.keyCode === KEY_CODES.left) {
        if (itemIndex == BTN_INDEX_CONFIRM) {
          itemIndex = BTN_INDEX_CANCEL;
        } else if (itemIndex == BTN_INDEX_CANCEL) {
          itemIndex = BTN_INDEX_LAST_BODY_PART;
        } else if(itemIndex === 0) {
          itemIndex = BTN_INDEX_CONFIRM;
        }else{
          itemIndex -= 1;
        }
        e.preventDefault();
        e.stopPropagation();
      } else if (e.keyCode === KEY_CODES.right) {
        if (itemIndex == BTN_INDEX_LAST_BODY_PART) {
          itemIndex = BTN_INDEX_CANCEL;
        } else if (itemIndex == BTN_INDEX_CANCEL) {
          itemIndex = BTN_INDEX_CONFIRM;
        } else if (itemIndex == BTN_INDEX_CONFIRM) {
          itemIndex = 0;
        } else {
          itemIndex =
            itemIndex === this.state.partData.length - 1 ? 0 : itemIndex + 1;
        }
        e.preventDefault();
        e.stopPropagation();
      } else if (e.keyCode === KEY_CODES.up) {
        if (itemIndex > BTN_INDEX_LAST_BODY_PART) {
          // for cancel and ok button
          itemIndex = BTN_INDEX_LAST_BODY_PART;
        } else {
          if (itemIndex >= 0 && itemIndex <= 9) {
            itemIndex = BTN_INDEX_ONEDELL;
          } else if (itemIndex === 10 || itemIndex === 19) {
            itemIndex -= 9;
          } else if (itemIndex >= 11 && itemIndex < 17 ) {
            itemIndex -= 11;
          } else if ((itemIndex >= 20 && itemIndex <= 40) || itemIndex === 18) {
            if (itemIndex === 39) itemIndex -= 20;
            else if (itemIndex === 29) itemIndex -= 11;
            else if (itemIndex === 38) itemIndex -= 9;
            else itemIndex -= 10;
          } else if (itemIndex >= 41 && itemIndex <= 52 ) {
            if (itemIndex === 50) itemIndex -= 41;
            else if (itemIndex === 49) itemIndex -= 11;
            else itemIndex -= 12;
          } else {
              itemIndex -= 2;
          }
        }
        e.preventDefault();
        e.stopPropagation();
      } else if (e.keyCode === KEY_CODES.down) {
        if (itemIndex > BTN_INDEX_LAST_BODY_PART) {
          itemIndex = 0;
        } else {
            if (itemIndex >= 0 && itemIndex <= 8) {
              if (itemIndex === 8) itemIndex += 10;
              else itemIndex += 11;
            } else if (itemIndex === 9 ) {
                itemIndex += 41;
            }
            else if (itemIndex === 10 ) {
                itemIndex += 9;
            }  else if (itemIndex >= 11 && itemIndex <= 39 ) {
              if (itemIndex === 19) itemIndex += 20;
              else if (itemIndex === 18) itemIndex += 11;
              else if (itemIndex === 29) itemIndex += 9;
              else if (itemIndex === 38) itemIndex += 11;
              else if (itemIndex === 39) itemIndex += 12;
              else itemIndex += 10;
            } else if (itemIndex === 40 ) {
                itemIndex += 12;
            } else if (itemIndex >= 41 && itemIndex <= 52 ) {
                itemIndex = BTN_INDEX_LAST_BODY_PART + 1;
            }
        }
        e.preventDefault();
        e.stopPropagation();
      }     
      this.setState({ itemIndex });
    }
  }

  onInputKeyPressed(e) {
    this.onKeyPressed(e);
  }

  cancelFunc() {
    this.props.closeMedicineBodyParts();
  }

  confirmFunc() {
    this.props.medicinebodyPartConfirm(this.state.body_part);
  }

  changeText = e => {
    this.setState({ body_part: e.target.value });
  };

  oneDelFunc = () => {
    let str = this.state.body_part;
    let res = str.substring(0, str.length-1);
    this.setState({
      body_part: res
    });
  };
  allDelFunc = () => {
    this.setState({
      body_part: ""
    });
  };

  selectBody(body) {
    document.getElementById("input_selectedParts").focus();
    let temp = (this.state.body_part != undefined && this.state.body_part != null) ? this.state.body_part : "";
      switch(body.value) {
          case "゛":
              temp = this.convertMuddle(temp);
              break;
          case "゜":
              temp = this.convertSemi(temp);
              break;
          default:
              temp = temp + body.value;
              break;
      }
    this.setState({
      body_part: temp
    });
  }

  convertMuddle = (str) => {
    let return_str = str;
    if (str=="") return str;
    let last_letter = str.charAt(str.length-1);
    if (big_hirakana.includes(last_letter)) {
      let index = big_hirakana.indexOf(last_letter);
      if (big_murky_hirakana[index] != "") {
          return_str = str.substr(0,str.length -1) + big_murky_hirakana[index];
      }
    } else if (big_murky_hirakana.includes(last_letter)) {
        let index = big_murky_hirakana.indexOf(last_letter);
        if (big_hirakana[index] != "") {
            return_str = str.substr(0, str.length - 1) + big_hirakana[index];
        }
    }
    return return_str;
  };

  convertSemi = (str) => {
    let return_str = str;
    if (str=="") return str;
    let last_letter = str.charAt(str.length-1);
    if (big_hirakana.includes(last_letter)) {
      let index = big_hirakana.indexOf(last_letter);
      if (big_semivarous_hirakana[index] != "") {
          return_str = str.substr(0,str.length -1) + big_semivarous_hirakana[index];
      }
    } else if (big_semivarous_hirakana.includes(last_letter)) {
        let index = big_semivarous_hirakana.indexOf(last_letter);
        if (big_hirakana[index] != "") {
            return_str = str.substr(0,str.length -1) + big_hirakana[index];
        }
    }
    return return_str;
  };

  handleClick(body, index){
    this.setState({itemIndex: index});
    this.selectBody(body);
  }

  setFocus() {
    document.getElementById("input_selectedParts").focus();
  }
  setCaretPosition = (elem, caretPos) => {
    var range;
    if (elem != null) {
      if (elem.createTextRange) {
        range = elem.createTextRange();
        range.move("character", caretPos);
        range.select();
      } else {
        elem.focus();
        if (elem.selectionStart !== undefined) {
          elem.setSelectionRange(caretPos, caretPos);
        }
      }
    }
  };

  render() {
    const usageName  = "検索キーワード入力";
    const notice = "3文字以上入力してください"
    const { body_part, partData } = this.state;
    return (
      <Modal show={true} className = "input-keyword-modal">
      <Modal.Body>
      <MedicineBodyPartsContent
        className="content"
        tabIndex="0"
        id="body_part_dlg"
        onClick={this.setFocus}
        onKeyDown={this.onKeyPressed}
      >
        <div className="usage-title">
          <span>{usageName}</span>
        </div>
        
        <div className="body-part">
          <input
            id="input_selectedParts"
            type="text"
            value={body_part}
            onChange={e => this.changeText(e)}
            onKeyDown={this.onInputKeyPressed}
          />
        </div>
        <div className="notice">
          <span>{notice}</span>
        </div>
        <div className="del_btn_box">
          <Button onClick={this.allDelFunc.bind(this)} className={this.state.itemIndex == BTN_INDEX_ALLDELL ? " focus alldel " : "alldel"} type="mono">
            全て削除
          </Button>
          <Button onClick={this.oneDelFunc.bind(this)} className={this.state.itemIndex == BTN_INDEX_ONEDELL ? " focus " : ""} type="mono">
            末尾から削除
          </Button>
        </div>
        <div className="body-parts" id="bodyPartsDiv">
          {partData.map((body, index) => {
            return (
              <span
                key={index}
                onClick={() => this.handleClick(body, index)}
                className={
                  body.class_name +
                  (this.state.itemIndex === index ? " focus " : "")
                }
                id={"focus_" + index}
              >
                {body.value}
              </span>
            );
          })}
        </div>
      </MedicineBodyPartsContent>
      </Modal.Body>        
        <Modal.Footer>
          <Button onClick={this.cancelFunc.bind(this)} className={this.state.itemIndex == BTN_INDEX_CANCEL ? "cancel-btn focus " : "cancel-btn"}>キャンセル</Button>
          <Button onClick={this.confirmFunc.bind(this)} className={this.state.itemIndex == BTN_INDEX_CONFIRM ? "red-btn focus " : "red-btn"}>確定</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

MedicineBodyParts.propTypes = {
  bodyPartData: PropTypes.array,
  usageName: PropTypes.string,
  body_part: PropTypes.string,
  closeMedicineBodyParts: PropTypes.func,
  medicinebodyPartConfirm: PropTypes.func
};

export default MedicineBodyParts;
