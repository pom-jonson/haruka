import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import Button from "../atoms/Button";
import { KEY_CODES } from "../../helpers/constants";
import $ from "jquery";
import { Modal } from "react-bootstrap";

const BodyPartsContent = styled.div`
  background-color: ${colors.surface};
  border: 1px solid #ced4da;
  box-sizing: border-box;
  padding: 10px 10px 0;
  width: 100%;
  z-index: 999;
  margin: auto;  

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
      margin-right: 40px;
      padding: 0 8px;
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

  .body-parts {
    padding: 5px 46px;
    height: 100%;
    margin: 10px auto;
    margin-top: 0;
    span {
      line-height: 2rem;
      border: 1px solid #000;
      border-radius: 4px;
      display: inline-block;
      text-align: center;
      margin: 0.4rem;
      margin-bottom: 0.3rem;
      cursor: pointer;
      width: 70px;
      &:hover {
        background: #ccc;
      }
      &:nth-child(2),
      &:nth-child(8) {
        margin-right: 240px;
      }
      &:nth-child(11) ,
      &:nth-child(18) ,
      &:nth-child(21) ,
      &:nth-child(24) ,
      &:nth-child(27) ,
      &:nth-child(30) ,
      &:nth-child(41) {
        margin-right: 160px;
      }
      &:nth-child(6) ,
      &:nth-child(15),
      &:nth-child(34),
      &:nth-child(38) {
        margin-right: 80px;
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

const BTN_INDEX_LAST_BODY_PART = 43;
const BTN_INDEX_CANCEL  = BTN_INDEX_LAST_BODY_PART + 1;
const BTN_INDEX_CONFIRM = BTN_INDEX_LAST_BODY_PART + 2;

class BodyParts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      body_part: this.props.body_part,
      partData: [],         
      itemIndex: 0
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.onInputKeyPressed = this.onInputKeyPressed.bind(this);
  }

  componentDidMount() {
    const { bodyPartData } = this.props;
    const { body_part } = this.state;
    let parts = body_part.split("、");
    if(bodyPartData != null && bodyPartData.length > 0){
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
    }
    document.getElementById("body_part_dlg").focus();
    document.getElementById("input_selectedParts").focus();
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
          if (itemIndex >= 0 && itemIndex <= 1) {
            itemIndex = BTN_INDEX_LAST_BODY_PART - 2 + itemIndex;
          } else if (itemIndex <= 5 ) {
            itemIndex = Math.min(itemIndex-2, 1);
          } else if (itemIndex >= 6 && itemIndex <= 7 ) {
            itemIndex -= 4;
          } else if (itemIndex >= 8 && itemIndex <= 10 ) {
            itemIndex = Math.min(itemIndex-2, 7);
          } else if (itemIndex >= 14 && itemIndex <= 17 ) {
            itemIndex -= 4;
          } else if (itemIndex >= 33 && itemIndex <= 40) {
            itemIndex = itemIndex - 4;
          } else {
            itemIndex = itemIndex - 3;
          }
        }
        e.preventDefault();
        e.stopPropagation();
      } else if (e.keyCode === KEY_CODES.down) {
        if (itemIndex > BTN_INDEX_LAST_BODY_PART) {
          itemIndex = 0;
        } else {
          if (itemIndex >= 0 && itemIndex <= 1) {
            itemIndex = itemIndex + 2;
          } else if (itemIndex >= 2 && itemIndex <= 5) {
            itemIndex = itemIndex + 4 > 7 ? 7 : itemIndex + 4;
          } else if (itemIndex >= 6 && itemIndex <= 7) {
            itemIndex = itemIndex + 2;
          } else if (itemIndex >= 11 && itemIndex <= 14) {
            itemIndex = itemIndex + 4 > 17 ? 17 : itemIndex + 4;
          } else if (itemIndex >= 30 && itemIndex <= 37) {
            itemIndex = itemIndex + 4 > 40 ? 40 : itemIndex + 4;
          } else if (itemIndex >= (BTN_INDEX_LAST_BODY_PART - 3) && itemIndex <= BTN_INDEX_LAST_BODY_PART) {
            itemIndex = BTN_INDEX_CANCEL;            
          } else {
            itemIndex = itemIndex + 3;
          }
        }
        e.preventDefault();
        e.stopPropagation();
      }     
      if(itemIndex<=BTN_INDEX_LAST_BODY_PART){
        this.scrollToPos(itemIndex); 
      }
      this.setState({ itemIndex });
    }
  }

  onInputKeyPressed(e) {
    this.onKeyPressed(e);
  }

  cancelFunc() {
    this.props.closeBodyParts();
  }

  confirmFunc() {
    this.props.bodyPartConfirm(this.state.body_part);
  }

  scrollToPos(nId) {       
    let bodyPartsHeight = document.getElementById("bodyPartsDiv").offsetHeight;
    let focusObjHeight = document.getElementById("focus_"+nId).offsetHeight;
    let focusObjTop = document.getElementById("focus_"+nId).offsetTop;           
    $(".body-parts").scrollTop(focusObjHeight + focusObjTop - bodyPartsHeight);        
  }

  changeText = e => {
    let temp = e.target.value.split("、");
    let value = undefined;
    let partData = this.state.partData.map(item => {
      value = temp.find(t => t === item.value);
      if (value) {
        item.class_name = "selected";
      } else {
        item.class_name = "";
      }
      return item;
    });
    this.setState({ body_part: e.target.value, partData });
  };

  selectBody(body) {
    document.getElementById("input_selectedParts").focus();
    let parts = this.state.body_part.split("、");
    let partData = this.state.partData.map(item => {
      if (item.value === body.value) {
        item.class_name = item.class_name === "selected" ? "" : "selected";
      }
      return item;
    });
    let value = undefined;
    let temp = parts.filter(part => {
      value = partData.find(p => p.value === part);
      return (
        part !== "" &&
        (value === undefined ||
          (value !== undefined && value.class_name === "selected"))
      );
    });

    partData.map(part => {
      if (part.class_name === "selected") {
        value = temp.find(p => p === part.value);
        if (value === undefined) {
          temp.push(part.value);
        }
      }
    });
    this.setState({
      body_part: temp.join("、")
    });
  }

  handleClick(body, index){
    this.setState({itemIndex: index});
    this.selectBody(body);
  }

  setFocus() {
    document.getElementById("input_selectedParts").focus();
  }

  render() {
    const { usageName } = this.props;
    const { body_part, partData } = this.state;
    return (
        <Modal show={true} className="body-part-modal">
            <Modal.Body>
              <BodyPartsContent
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
                  <span>部位</span>
                  <input
                    id="input_selectedParts"
                    type="text"
                    value={body_part}
                    onChange={e => this.changeText(e)}
                    onKeyDown={this.onInputKeyPressed}
                  />
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
              </BodyPartsContent>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.cancelFunc.bind(this)} className={this.state.itemIndex == BTN_INDEX_CANCEL ? "cancel-btn focus " : "cancel-btn"}>キャンセル</Button>
              <Button onClick={this.confirmFunc.bind(this)} className={this.state.itemIndex == BTN_INDEX_CONFIRM ? "red-btn focus " : "red-btn"}>確定</Button>
            </Modal.Footer>
        </Modal>
    );
  }
}

BodyParts.propTypes = {
  bodyPartData: PropTypes.array,
  usageName: PropTypes.string,
  body_part: PropTypes.string,
  closeBodyParts: PropTypes.func,
  bodyPartConfirm: PropTypes.func
};
export default BodyParts;
