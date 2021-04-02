import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import Button from "../atoms/Button";
import { KEY_CODES, CACHE_SESSIONNAMES } from "../../helpers/constants";
import $ from "jquery";
import { Modal } from "react-bootstrap";
import * as sessApi from "~/helpers/cacheSession-utils";

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
      width: 7rem;
      &:hover {
        background: #ccc;
      }      
    }

    .focus {
      border: 1px solid #ff0000;
    }

    .selected {
      background: #ccc;
    }
  }

  .one-line{
    padding: 5px 10px !important;
    overflow-y: auto;
    height: 75.5vh;    
    .full-span{
      width: 30.4rem !important;
    }
  }
  button.focus{
    border-color: #aaa !important;
  }

`;

// const BTN_INDEX_LAST_BODY_PART = 43;
// const BTN_INDEX_LAST_BODY_PART = 47;
// const BTN_INDEX_CANCEL  = BTN_INDEX_LAST_BODY_PART + 1;
// const BTN_INDEX_CONFIRM = BTN_INDEX_LAST_BODY_PART + 2;

// injection
const default_bodyPartData = [
    [
        "顔", "頭部"
    ],
    [
        "眼", "右眼", "左眼", "両眼"
    ],
    [
        "鼻", "首"
    ],
    [
        "右肩", "左肩", "両肩"
    ],
    [
        "胸", "腹", "背中", "腰"
    ],
    [
        "臀部", "右臀部", "左臀部"
    ],
    [
        "右上腕", "左上腕", "両上腕"
    ],
    [
        "右肘", "左肘", "両肘"
    ],
    [
        "右前腕", "左前腕", "両前腕"
    ],
    [
        "右手首", "左手首", "両手首"
    ],
    [
        "手", "右手", "左手", "両手"
    ],
    [
        "膝", "右膝", "左膝", "両膝"
    ],
    [
        "右足", "左足", "両足"
    ],
    [
        "右踵", "左踵", "両踵"
    ]
];

// prescription
const default_prescription_bodyPartData = [
    [
        "顔", "頭部"
    ],
    [
        "眼", "右眼", "左眼", "両眼"
    ],
    [
        "鼻", "頚部"
    ],
    [
        "右肩", "左肩", "両肩"
    ],
    [
        "胸", "腹", "背中", "腰"
    ],
    [
        "臀部", "右臀部", "左臀部"
    ],
    [
        "右上腕", "左上腕", "両上腕"
    ],
    [
        "右肘", "左肘", "両肘"
    ],
    [
        "右前腕", "左前腕", "両前腕"
    ],
    [
        "右手首", "左手首", "両手首"
    ],
    [
        "手", "右手", "左手", "両手"
    ],
    [
        "膝", "右膝", "左膝", "両膝"
    ],
    [
        "右足", "左足", "両足"
    ],
    [
        "右踵", "左踵", "両踵"
    ]
];

class BodyPartsOneLine extends Component {
  constructor(props) {
    super(props);
    // get injection usage
    // YJ533 注射の手技によって、違う内容の部位選択パネルを選べるように
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let cache_body_part = null;
    if(initState !== undefined && initState != null && initState.injection_body_parts !== undefined && initState.injection_body_parts.length > 0){
      let usage_body_part = null;
      initState.injection_body_parts.map(item=>{        
        if (this.props.usageName == item.name) {          
          usage_body_part = item.body_part_master;
        }
      });

      if (usage_body_part != null && usage_body_part != undefined && usage_body_part.length > 0) {                
        cache_body_part = usage_body_part;
      }
    }

    let _default_bodyPartData = default_bodyPartData;
    
    // ●YJ768 処方の部位指定コメントパネルの調整
    if (this.props.modal_type != undefined && this.props.modal_type == "prescription") {      
      if(initState !== undefined && initState != null && initState.prescription_body_parts !== undefined && initState.prescription_body_parts.length > 0){
        let usage_body_part = null;
        initState.prescription_body_parts.map(item=>{        
          if (this.props.usageName == item.name || (this.props.usageCode != undefined && this.props.usageCode != null && parseInt(this.props.usageCode) == parseInt(item.code))) {          
            usage_body_part = item.body_part_master;
          }
        });

        if (usage_body_part != null && usage_body_part != undefined && usage_body_part.length > 0) {                
          cache_body_part = usage_body_part;
        }
      }

      _default_bodyPartData = default_prescription_bodyPartData;      
    }

    let body_part_master = cache_body_part != null ? cache_body_part : _default_bodyPartData;
    this.state = {
      body_part: this.props.body_part,
      body_part_master: body_part_master,
      // cache_body_part: cache_body_part,
      partData: [],         
      itemIndex: 0,
      sel_i: 0,
      sel_j: 0
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.onInputKeyPressed = this.onInputKeyPressed.bind(this);

    this.BTN_INDEX_LAST_BODY_PART = body_part_master.length - 1;
    this.BTN_INDEX_CANCEL  = this.BTN_INDEX_LAST_BODY_PART + 1;
    this.BTN_INDEX_CONFIRM = this.BTN_INDEX_LAST_BODY_PART + 2;

  }

  componentDidMount() {
    const { body_part_master } = this.state;
    const { body_part } = this.state;
    let parts = body_part.split("、");
    let partData = body_part_master.filter(item=>{
      if (item != undefined && item != null && item.length > 0) {
        let count = 0;
        item.map(ele=>{
          if (ele.trim() != "") {
            count ++;
          }
        });
        if (count > 0) {
          return true;
        } else {
          return false;
        }        
      }
    }).map(item => {
      if (item != null && item != undefined && item.length > 0) {
        let _item = item.map(ele=>{
          let value = parts.find(v => v === ele);          
          return {            
            value: ele,
            class_name: value ? "selected" : ""
          };
        });
        return _item;
      }
    });
    this.setState({ partData });
    document.getElementById("body_part_dlg").focus();
    document.getElementById("input_selectedParts").focus();
  }

  onKeyPressed(e) {
    if (e.target === e.currentTarget) {
      let row = this.state.sel_i;
      let col = this.state.sel_j;
    
      // row : 100 col : 0 => cancel button
      // row : 100 col : 1 => ok button
      if (e.keyCode === KEY_CODES.enter) {
        e.preventDefault();
        e.stopPropagation();
        if (row == 100 && col == 0) { // cancel button
          this.cancelFunc();
        } else if (row == 100 && col == 1) { // ok button
          this.confirmFunc();
        } else {          
          this.selectBody(this.state.partData[this.state.sel_i][this.state.sel_j]);
        }
        return;
      } else if (e.keyCode === KEY_CODES.left) {
        if (row == 100 && col == 1) { // ok button
          col= 0; // set cancel button
        } else if (row == 100 && col == 0) {
          row = this.state.partData.length - 1;
          col = this.state.partData[this.state.partData.length - 1].length - 1;
        } else if(row == 0 && col == 0) {
          // set ok button
          row = 100;
          col = 1;
        }else{
          if(col == 0) {
            row -= 1;
            col = this.state.partData[row].length - 1;
          } else {
            col -= 1;
          }          
        }
        e.preventDefault();
        e.stopPropagation();
      } else if (e.keyCode === KEY_CODES.right) {
        if (row == this.state.partData.length - 1 && col == this.state.partData[this.state.partData.length - 1].length - 1) {
          // set cancel button
          row = 100;
          col = 0;
        } else if (row == 100 && col == 0) { // cancel button
          col = 1;
        } else if (row == 100 && col == 1) { // ok button
          row = 0;
          col = 0;
        } else {
          if (col == this.state.partData[row].length - 1) {
            row += 1;
            col = 0;
          } else {
            col += 1;
          }          
        }
        e.preventDefault();
        e.stopPropagation();
      } else if (e.keyCode === KEY_CODES.up) {
        if (row == 100) {
          // for cancel and ok button
          row = this.state.partData.length - 1;
          col = this.state.partData[row].length - 1;
        } else {
          if (row == 0) {
            row = this.state.partData.length - 1;
            if (col > this.state.partData[row].length - 1) {
              col = this.state.partData[row].length - 1;
            }
          } else {
            row -= 1;
          }

          if (col > this.state.partData[row].length - 1) {
            col = this.state.partData[row].length - 1;
          }
          
        }
        e.preventDefault();
        e.stopPropagation();
      } else if (e.keyCode === KEY_CODES.down) {
        if (row == 100) {
          row = 0;
          col = 0;
        } else {
          if (row == this.state.partData.length - 1) {
            row = 100;
            col = 0;
          } else {
            row += 1
            if (col > this.state.partData[row].length - 1) {
              col = this.state.partData[row].length - 1;
            }          
          }
        }
        e.preventDefault();
        e.stopPropagation();
      }     
      if(row<=this.state.partData.length - 1){
        this.scrollToPos(row, col); 
      }
      this.setState({ 
        sel_i: row,
        sel_j: col
      });
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

  scrollToPos(row, col) {       
    let bodyPartsHeight = document.getElementById("bodyPartsDiv").offsetHeight;
    let focusObjHeight = document.getElementById("focus_" + row + "_" + col).offsetHeight;
    let focusObjTop = document.getElementById("focus_" + row + "_" + col).offsetTop;           
    $(".body-parts").scrollTop(focusObjHeight + focusObjTop - bodyPartsHeight);        
  }

  changeText = e => {
    let temp = e.target.value.split("、");
    let value = undefined;
    let partData = this.state.partData.map(row => {
      if(row.length > 0){
        let _row = row.map(col=>{          
          value = temp.find(t => t === col.value);
          if (value) {
            col.class_name = "selected";
          } else {
            col.class_name = "";
          }
          return col;
        });        
        return _row;
      }
    });
    this.setState({ body_part: e.target.value, partData });
  };

  selectBody(body) {
    document.getElementById("input_selectedParts").focus();
    let parts = this.state.body_part.split("、");
    // let partData = this.state.partData.map(item => {
    //   if (item.value === body.value) {
    //     item.class_name = item.class_name === "selected" ? "" : "selected";
    //   }
    //   return item;
    // });
    let partData = this.state.partData.map(row => {
      if (row.length > 0) {
        let _row = row.map(col=>{          
          if(col.value == body.value){
            col.class_name = col.class_name === "selected" ? "" : "selected";
          }
          return col;
        });        
        return _row;
      }
    });


    let value = undefined;
    let temp = parts.filter(part => {
      partData.map(row=>{
        row.map(col=>{
          if(col.value == part){
            value = col;
          }
        });
      });      
      return (
        part !== "" &&
        (value === undefined ||
          (value !== undefined && value.class_name === "selected"))
      );
    });

    partData.map(row=>{
      row.map(col=>{
        if(col.class_name === "selected"){
          value = temp.find(p => p === col.value);
          if (value === undefined) {
            temp.push(col.value);
          }
        }
      });
    });

    this.setState({
      body_part: temp.join("、")
    });
  }

  handleClick(body, row, col){
    this.setState({
      sel_i: row,
      sel_j: col
    });
    this.selectBody(body);
  }

  setFocus() {
    document.getElementById("input_selectedParts").focus();
  }

  render() {
    const { usageName } = this.props;
    const { body_part, partData } = this.state;

    return (
        <Modal show={true} className="body-part-modal body-part-one-line-modal">
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
                
                <div className="body-parts one-line" id="bodyPartsDiv">
                  {partData.map((row, i) => {
                    return (
                      <>
                        <div>
                          {row.map((col, j)=>{
                            return (
                              <span                          
                                key={i + "_" + j}
                                onClick={() => this.handleClick(col, i, j)}
                                className={
                                  col.class_name +
                                  (this.state.sel_i === i && this.state.sel_j === j ? " focus " : "") + (row.length == 1 ? " full-span" : "")
                                }
                                id={"focus_" + i + "_" + j}
                              >
                                {col.value}
                              </span>
                            );
                          })}
                        </div>
                      </>
                    );
                  })}                  
                </div>                
                
              </BodyPartsContent>
            </Modal.Body>
            <Modal.Footer>
              <Button
                  onClick={this.cancelFunc.bind(this)}
                  className={this.state.itemIndex == this.BTN_INDEX_CANCEL ? "cancel-btn focus " : "cancel-btn"}
              >
                  キャンセル
              </Button>
              <Button
                  onClick={this.confirmFunc.bind(this)}
                  className={this.state.itemIndex == this.BTN_INDEX_CONFIRM ? "red-btn focus " : "red-btn"}
              >
                  確定
              </Button>
            </Modal.Footer>
        </Modal>
    );
  }
}

BodyPartsOneLine.propTypes = {
  bodyPartData: PropTypes.array,
  usageName: PropTypes.string,
  body_part: PropTypes.string,
  modal_type: PropTypes.string,
  usageCode: PropTypes.string,
  closeBodyParts: PropTypes.func,
  bodyPartConfirm: PropTypes.func
};

export default BodyPartsOneLine;
