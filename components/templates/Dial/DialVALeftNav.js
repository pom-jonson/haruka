import React from "react";
import styled from "styled-components";
import * as colors from "../../_nano/colors";
// import * as activeIndicator from "../../_nano/activeIndicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import arrow from "~/components/_demo/arrow.png";
import Button from "~/components/atoms/Button";
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss'
// import med from "~/components/_demo/arms.png";
// import useImage from 'use-image';

import Img from './Img';
import PropTypes from "prop-types";

import { Stage, Layer, Arrow, Circle, Line, Text} from "react-konva";
import { 
  faEdit, 
  faEraser,   
  faTimes
} from "@fortawesome/pro-regular-svg-icons";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import { dial_background_image_array} from "~/helpers/DialImageResource";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const Icon = styled(FontAwesomeIcon)`
  font-size: 16px;
  margin: auto;
`;

const FlexHaruka = styled.div`
  border-bottom: 1px solid #dedede;
  border-left: 1px solid #ddd;
  background-color: ${colors.surface};
  display: flex;
  justify-content: space-between;
  top: 0;
  // width: 860px;  
  width:100%;
  // height: 540px; 
  height: 100%;
  // overflow-y: auto; 
  margin: 0px;
  border: none;
  z-index: 101;
  float: right;
  right: 0px;

  span{
    font-weight: lighter;
  }  

  .div-block{
    width: 100%;
    overflow: hidden;
    // border-bottom: 1px solid #ddd;
    border: 1px solid #ddd;
  }

  .block-1{
    height: 10%;
    display: flex;
    svg{
      font-size: 50px;
      padding: 10px 0px;      
    }
  }

  .block-2{
    // height: 25%; 
    padding: 5px;
    .pullbox-title{
      text-align: right;
      padding-right: 20px;
    }
    .pullbox{
      // margin-right: 20px;
    }
    select{
      width: 100px;
    }

    .div-color{
      margin: 5px auto;
      .color-title{
        width: 100px;
        text-align: right;
        padding-right: 20px;
        display: inline-block;
        font-size: 1.1rem;
        line-height: 2.3rem !important;
        height: 2.3rem !important;
        letter-spacing: 0.4px;
        color: rgb(0, 0, 0);
      }
    }

  }

  .block-3{
    // height: 40%;
    img{
      width: 45px;
    }
    p{
      text-align: center;
      letter-spacing: 3px;
      font-size: 25px;
      font-weight: bold;
      margin-left: 10px;
    }
  }

  .block-4{
    height: 25%;
    background: rgb(238, 238, 238);
    .dv-input{
      margin-top: 10px;
      margin-left: 30px;
    }
    label{
      width: 0px;
    }
    input{
      width: 70%;
      margin-left: 30px;
    }
    button{
      width: 70%;
      margin: 10px 0px 10px 38px;
    }
  }
  .arrow-rotate-1{
    transform: rotate(135deg);
  }
  .arrow-rotate-2{
    transform: rotate(180deg);
  }
  .arrow-rotate-3{
    transform: rotate(225deg);
  }
  .arrow-rotate-4{
    transform: rotate(90deg);
  }
  .arrow-rotate-5{
    transform: rotate(270deg);
  }
  .arrow-rotate-6{
    transform: rotate(45deg);
  }
  .arrow-rotate-7{
    transform: rotate(360deg);
  }
  .arrow-rotate-8{
    transform: rotate(315deg);
  }
  
  .dv-table{
    display: flex;
    table{
      margin: 0px auto;
      width: 87%;
      margin-left: 25px;
      img{
        cursor: pointer;
      }
    }
  }

  .div-parent{
    background: #eee;
    width: 220px;    
    margin-right: 5px;
    height: 535px;
    svg{
      cursor: pointer;
    }
  }

  .div-paint{
    // width: calc(100% - 270px) !important;
    // margin-left:1rem;
    width:486px !important;
    height: 402px !important;
    border: 1px solid #aaa;
    // margin-right: 5px;
    canvas{
      width:480px !important;
      height: 400px !important;
    }
    .konvajs-content{
      width:486px !important;
      height: 402px !important;
    }
    .load-pic {
      width: 100%;
      border: 1px solid #aaa;
      text-align: center;
      margin-bottom: 10px;
      padding: 5px;
      cursor: pointer;
    }
    .label-comment {
      padding-top: 5px;
      padding-bottom: 5px;
    }
    .pic-comment {
      textarea {
        width: 100%;
        margin: 0px;
        height: 60px;
      }
    }
    .konvajs-content{
      // border: 1px solid #aaa;
      // width: 100% !important;
      // height: 100% !important;
      // canvas{
      //   width: 100% !important;
      //   height: 100% !important;
      // }
    }
  }

  .selected{
    background: #69c8e1;
  }

  
`;

const thickList = [
  {
    id: 1,
    value: 1
  },
  {
    id: 2,
    value: 2
  },
  {
    id: 3,
    value: 3
  },
  {
    id: 4,
    value: 4
  },
  {
    id: 5,
    value: 5
  }
];

// const colorList = [
//   {
//     id: 1,
//     value: "Red"
//   },
//   {
//     id: 2,
//     value: "Blue"
//   },
//   {
//     id: 3,
//     value: "Green"
//   },
//   {
//     id: 4,
//     value: "White"
//   },
//   {
//     id: 5,
//     value: "Black"
//   }
// ];

const sizeList = [
  {
    id: 2,
    value: 2
  },
  {
    id: 4,
    value: 4
  },
  {
    id: 6,
    value: 6
  },
  {
    id: 8,
    value: 8
  },
  {
    id: 10,
    value: 10
  },
  {
    id: 12,
    value: 12
  },
  {
    id: 14,
    value: 14
  },
  {
    id: 16,
    value: 16
  },
  {
    id: 18,
    value: 18
  },
  {
    id: 24,
    value: 24
  },
  {
    id: 28,
    value: 28
  },
  {
    id: 32,
    value: 32
  },
  {
    id: 36,
    value: 36
  },
  {
    id: 42,
    value: 42
  },
  {
    id: 46,
    value: 46
  },
  {
    id: 48,
    value: 48
  },
  {
    id: 52,
    value: 52
  },
  {
    id: 64,
    value: 64
  },
  {
    id: 78,
    value: 78
  }
];

class Drawable {
  constructor(startx, starty) {
    this.startx = startx;
    this.starty = starty;
    this.id = new Date().getTime();
  }
}

// class ArrowDrawable extends Drawable {
//   constructor(startx, starty, color) {
//     super(startx, starty, color);
//     this.x = startx;
//     this.y = starty;
//     this.color = color;
//   }
//   registerMovement(x, y, color) {
//     this.x = x;
//     this.y = y;
//     this.color = color;
//   }
//   render() {
//     const points = [this.startx, this.starty, this.x, this.y];
//     return <Arrow points={points} fill={this.color} stroke="black" />;
//   }
// }

class ArrowDrawable extends Drawable {
  constructor(startx, starty, color, thick, size, nType, targetX, targetY, parent) {    
    super(startx, starty, color, thick, size, nType, targetX, targetY, parent);
    this.x = startx;
    this.y = starty;
    this.color = color;
    this.nType = nType;
    this.thick = thick;
    this.size = size;
    this.targetX = targetX;
    this.targetY = targetY;
    this.visible = 1;
    this.parent_state = parent;
  }
  registerMovement(x, y, color, thick, size, nType, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.nType = nType;
    this.thick = thick;    
    this.size = size;
    this.targetX = targetX;
    this.targetY = targetY;
  }
  handleMouseOver = () => {
  }

  handleMouseDown = () => {
    // sessApi.setValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_SYMBOL_TIME, this.id);
    let selectedTool = sessApi.getValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_TOOL);
    if (selectedTool == "erase") {
      this.visible = 0;
      this.parent_state.setState({
        selectedTool: "erase"
      });
    } else {
      this.parent_state.isMoving = 1;
    }
  }

  getEndPosition = () => {
    let pos = {};
    pos.x = this.targetX + this.size * Math.sin(parseInt(this.nType) * Math.PI/4);
    pos.y = this.targetY + this.size * Math.cos(parseInt(this.nType) * Math.PI/4);
    return pos;
  }
  render() {        
    let pos = this.getEndPosition();    
    const points = [this.targetX, this.targetY, pos.x, pos.y];    
    let moveStyle = {cursor: 'pointer'};
    return (
      <>
      {this.visible == 1 ? (
        <Arrow style={moveStyle} points={points} fill={this.color} stroke={this.color} draggable={true} onMouseDown={this.handleMouseDown} onMouseOver={this.handleMouseOver} strokeWidth = {this.thick}/>
      ) : (
        <></>
      )}
      </>      
    );
  }
}

class FreeTextDrawable extends Drawable {
  constructor(startx, starty, color, size, thick, strText, targetX, targetY, parent) {
    super(startx, starty, color, size, thick, strText, targetX, targetY, parent);
    this.x = startx;
    this.y = starty;
    this.color = color;
    this.strText = strText;
    this.size = size;
    this.thick = thick;
    this.targetX = targetX;
    this.targetY = targetY;
    this.visible = 1;
    this.parent_state = parent;
  }
  registerMovement(x, y) {
    this.x = x;
    this.y = y;
  }
  handleMouseDown = () => {
    // sessApi.setValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_SYMBOL_TIME, this.id);
    let selectedTool = sessApi.getValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_TOOL);
    if (selectedTool == "erase") {
      this.visible = 0;
      this.parent_state.setState({
        selectedTool: "erase"
      });
    } else {
      this.parent_state.isMoving = 1;
    } 
  }
  render() {  
    return (
      <>
      {this.visible == 1 ? (
        <Text text={this.strText} x={this.targetX} y={this.targetY} onMouseDown={this.handleMouseDown} draggable={true} fill={this.color} fontSize={this.size} strokeWidth={this.thick} />
      ) : (
        <></>
      )}
      </>  
    );
    // return <Text text={this.strText} x={this.targetX} y={this.targetY} onClick={this.handleClick} draggable={true} fill={this.color} fontSize={this.size} strokeWidth={this.thick} />;
  }
}

class CircleDrawable extends ArrowDrawable {
  constructor(startx, starty, color) {
    super(startx, starty, color);
    this.x = startx;
    this.y = starty;
  }
  render() {
    const dx = this.startx - this.x;
    const dy = this.starty - this.y;
    const radius = Math.sqrt(dx * dx + dy * dy);
    return (
      <Circle radius={radius} x={this.startx} y={this.starty} fill={this.color} stroke="black" />
    );
  }
}

class FreePathDrawable extends Drawable {
  constructor(startx, starty, color, thick) {
    super(startx, starty, color);
    this.points = [startx, starty];
    this.color = color;
    this.thick = thick;    
  }
  registerMovement(x, y) {
    this.points = [...this.points, x, y];
  }
  render() {
    return <Line points={this.points} fill={this.color} stroke={this.color} strokeWidth={this.thick} />;
  }
}

class FreePathEraseDrawable extends Drawable {
  constructor(startx, starty, color, thick, size) {
    super(startx, starty);
    this.points = [startx, starty];    
    this.size = size;
  }
  registerMovement(x, y) {
    this.points = [...this.points, x, y];

  }
  render() {
    return (
      <>
        <Line points={this.points} fill="white" strokeWidth={this.size} stroke="white" />
      </>
    );
  }
}

class DialLeftNav extends React.Component {  
  constructor(props) {
    super(props);       
    // let zoom = 1;
    // dial_background_image_array
    let default_img = "";    
    // let img_version = this.props.img_version > 0 ? this.props.img_version : Dial_VA_Version.version;
    let img_version = this.props.img_version > 0 ? this.props.img_version : 0;
    dial_background_image_array.map(item=>{
      if (item.bg_img_version != undefined && item.bg_img_version == img_version) {
        default_img = item.img;
      }
    });
    let imgData = this.props.imgBase64;
    if (imgData == null || imgData == ""){
      // imgData = med;
      imgData = default_img;
      // zoom = 0.5;
    }    
    let newImage = {
      path: "",
      width: 484,
      height: 400,
      zIndex: 0,
      src: imgData
    };    

    let view = {
      width: newImage.width,
      height: newImage.height
    };

    let newDefaultImage = {
      path: "",
      width: 484,
      height: 400,
      zIndex: 0,      
      src: default_img
    };   

    let defaultView = {
      width: newImage.width * 1,
      height: newImage.height * 1
    };    
    this.state = {
      drawables: [],
      symbolDrawables: [],
      newDrawable: [],
      newDrawableType: "FreePathDrawable",
      arrowType: 0,
      va_color:{r:'0', g: '0', b: '0', a: '1'},
      displayColorPicker: false,
      color: {r: '0',g: '0',b: '0',a: '1',},
      colorHex: "#000000",
      canvasText: "",
      fontSize: 36,
      thick: 3,
      comment: this.props.image_comment != undefined && this.props.image_comment != null ? this.props.image_comment : "",
      // zoom,
      view,
      newImage,
      newDefaultImage,
      defaultView,
      selectedTool: "pen",
      curPointX:100,
      curPointY: 100,
      isClearImageModal: false
    }  

    this.stageRef = React.createRef();   

    // change image flag
    this.updated = 0;    

    // check mouse clicked when mouse moving (pen and erase moving)
    this.mosue_clicked = 0;

    // ●DN676 シェーマの楕円機能の挙動の修正
    this.isMoving = 0;
  }   

  componentDidMount() {
    document.addEventListener("keydown", this._handleKeyDown);
    document.body.addEventListener('mouseup', this.handleBodyMouseUp);
    // for symbol delete
    sessApi.setValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_TOOL, "");
    this.setChangeFlag(0);
  }
  
  componentWillUnmount() {
    document.removeEventListener("keydown", this._handleKeyDown);
    document.body.removeEventListener("mouseup", this.handleBodyMouseUp);
  }

  setChangeFlag=(change_flag)=>{      
      this.setState({change_flag});
      if (change_flag){
          sessApi.setObjectValue('dial_change_flag', 'dial_va_left_nav', 1)
      } else {
          sessApi.remove('dial_change_flag');
      }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {    
    let default_img = "";    
    // let img_version = this.props.img_version > 0 ? this.props.img_version : Dial_VA_Version.version;
    let img_version = this.props.img_version > 0 ? this.props.img_version : 0;
    dial_background_image_array.map(item=>{
      if (item.bg_img_version != undefined && item.bg_img_version == img_version) {
        default_img = item.img;
      }
    });        
    let imgData = nextProps.imgBase64;
    if (imgData == null || imgData == ""){
      imgData = default_img;
    }    
    let newImage = {
      path: "",
      width: 484,
      height: 400,
      zIndex: 0,
      src: imgData
    };    

    let view = {
      width: newImage.width,
      height: newImage.height
    };    

    this.setState({
      drawables: [],
      symbolDrawables: [],
      newDrawable: [],
      // newDrawableType: "FreePathDrawable",
      // arrowType: 0,
      // va_color:{r:'0', g: '0', b: '0', a: '1'},
      // displayColorPicker: false,
      // color: {r: '0',g: '0',b: '0',a: '1',},
      // colorHex: "#000000",
      // canvasText: "",
      // fontSize: 36,
      // thick: 3,
      comment: nextProps.image_comment != undefined && nextProps.image_comment != null ? nextProps.image_comment : "",
      // zoom,
      view,
      newImage,
      // newDefaultImage,
      // defaultView,
      // selectedTool: "pen",
      // curPointX:100,
      // curPointY: 100,
      isClearImageModal: false
    });

    this.stageRef = React.createRef();

    // change image flag
    this.updated = 0;
  }

  _handleKeyDown = (event) => {
    // keyCode 46: "Delete"
    switch( event.keyCode ) {
        case 46:
            // this.handleRemoveItem();
            break;
        default: 
            break;
    }
  }

  getNewDrawableBasedOnType = (x, y, type) => {
    if (this.state.newDrawableType == "ArrowDrawable") {
      return;
    }
    const drawableClasses = {
      FreePathDrawable,      
      CircleDrawable,
      ArrowDrawable,
      FreeTextDrawable,
      FreePathEraseDrawable
    };
    return new drawableClasses[type](x, y, this.state.colorHex, this.state.thick, this.state.fontSize);
  };

  handleMouseDown = e => {
    if (this.isMoving ==1) return;

    if (this.state.newDrawableType == "ArrowDrawable" || this.state.newDrawableType == "FreeTextDrawable") {    
      return;
    }
    if (this.state.newDrawableType == "FreePathDrawable" || 
      this.state.newDrawableType == "FreePathEraseDrawable") {
      this.updated = 1;
      this.mosue_clicked = 1;
      this.setChangeFlag(1);
    }

    const { newDrawable } = this.state;
    if (newDrawable.length === 0) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const newDrawable = this.getNewDrawableBasedOnType(
        x,
        y,
        this.state.newDrawableType
      );
      this.setState({
        newDrawable: [newDrawable]
      });
    }
  };

  handleBodyMouseUp = () => {
    this.isMoving = 0;
    if (this.mosue_clicked == 1) {
      this.mosue_clicked = 0;

      const { newDrawable, drawables } = this.state;
      if (newDrawable.length === 1) {
        let x = this.mousePosX;
        let y = this.mousePosY;
        const drawableToAdd = newDrawable[0];          
        drawableToAdd.registerMovement(x, y);
        drawables.push(drawableToAdd);
        this.setState({
          newDrawable: [],
          drawables,
          curPointX: x,
          curPointY: y
        });
      }
    }
  }

  handleMouseUp = e => {
    this.isMoving = 0;
    if (this.state.newDrawableType == "ArrowDrawable" || this.state.newDrawableType == "FreeTextDrawable") {      
      let { x, y } = e.target.getStage().getPointerPosition();
      this.setState({
        curPointX: x,
        curPointY: y  
      });
      return;
    }    

    const { newDrawable, drawables } = this.state;
    if (newDrawable.length === 1) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const drawableToAdd = newDrawable[0];          
      drawableToAdd.registerMovement(x, y);
      drawables.push(drawableToAdd);
      this.setState({
        newDrawable: [],
        drawables,
        curPointX: x,
        curPointY: y
      });
    }
    this.mosue_clicked = 0;
  };

  handleMouseMove = e => {
    if (this.state.newDrawableType == "FreePathDrawable" || 
      this.state.newDrawableType == "FreePathEraseDrawable") {
      if (this.mosue_clicked != 1) return;
    }
    const { newDrawable } = this.state;
    if (newDrawable.length === 1) {
      const { x, y } = e.target.getStage().getPointerPosition();
      this.mousePosX = x;
      this.mousePosY = y;
      const updatedNewDrawable = newDrawable[0];
      updatedNewDrawable.registerMovement(x, y);
      this.setState({
        newDrawable: [updatedNewDrawable]
      });
    }
  };

  // -------------------
  selectArrow = (nType) => {   
    this.updated = 1;
    this.setChangeFlag(1);

    let newDrawable = new ArrowDrawable(200, 300, this.state.colorHex, this.state.thick, this.state.fontSize, nType, this.state.curPointX, this.state.curPointY, this);
    const { symbolDrawables } = this.state;
    const drawableToAdd = newDrawable;          
    drawableToAdd.registerMovement(200, 300, this.state.colorHex, this.state.thick, this.state.fontSize, nType, this.state.curPointX, this.state.curPointY, this);
    // drawables.push(drawableToAdd);
    symbolDrawables.push(drawableToAdd);
    this.setState({
      newDrawable: [],
      symbolDrawables,
      newDrawableType: "ArrowDrawable",
      arrowType: nType,
      selectedTool: ""
    });    
    sessApi.setValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_TOOL, "");
  }

  handlePreview = (strLetter = "") => {
    let strText = this.state.canvasText;
    if (strLetter != "") {
      strText = strLetter;
    }
    if (strText != "") {
      this.updated = 1;
      this.setChangeFlag(1);
    }
    let newDrawable = new FreeTextDrawable(200, 300, this.state.colorHex, this.state.fontSize, this.state.thick, strText, this.state.curPointX, this.state.curPointY, this);
    // const { drawables } = this.state;
    const { symbolDrawables } = this.state;
    const drawableToAdd = newDrawable;          
    drawableToAdd.registerMovement(200, 300, this.state.colorHex, this.state.fontSize, this.state.thick, strText, this.state.curPointX, this.state.curPointY, this);
    symbolDrawables.push(drawableToAdd);
    this.setState({
      newDrawable: [],
      symbolDrawables,
      newDrawableType: "FreeTextDrawable",
      selectedTool: ""
    });   
    sessApi.setValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_TOOL, "");
  }

  handleChange = (color) => {
    this.setState({
        va_color: color.rgb,
        color: color.rgb
    })
  };

  handleChangeComplete = (color) => {    
    this.setState({
      colorHex: color.hex
    });
  }

  handleClick = () => {
    this.setState({
      displayColorPicker: !this.state.displayColorPicker,
    })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };  

  getTextValue = e => {
    this.setState({canvasText: e.target.value})
  };

  getFontSize = e => {
    this.setState({fontSize: e.target.value})
  };

  getThick = e => {
    this.setState({thick: e.target.value})
  };

  onDragStart = (e, strText) => {
    e.dataTransfer.setData(
      "text",
      "content:" + strText 
    );    
    e.stopPropagation();
  };

  onDropEvent = (e) => {            
        this.stageRef.current.setPointersPositions(e);

        let data = e.dataTransfer.getData("text");
        let strText = this.state.canvasText;
        let strLetter = data.split(":")[1];
        if (strLetter != "" && strLetter != undefined) {
          strText = strLetter;

          this.updated = 1;
          this.setChangeFlag(1);
        }

        const {x, y} = this.stageRef.current.getPointerPosition();
        if (parseInt(strLetter) >= 0 && parseInt(strLetter) <= 7) { // arrow

          const { symbolDrawables } = this.state;
          let newDrawable = new ArrowDrawable(200, 300, this.state.colorHex, this.state.thick, this.state.fontSize, parseInt(strLetter), x, y, this);
          const drawableToAdd = newDrawable;          
          drawableToAdd.registerMovement(200, 300, this.state.colorHex, this.state.thick, this.state.fontSize, parseInt(strLetter), x, y, this);
          symbolDrawables.push(drawableToAdd);
          this.setState({
            newDrawable: [],
            symbolDrawables,
            newDrawableType: "ArrowDrawable",
            arrowType: parseInt(strLetter),
            selectedTool: ""
          });
          sessApi.setValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_TOOL, "");
        } else { // text && symbol 

          const { symbolDrawables } = this.state;
          let newDrawable = new FreeTextDrawable(200, 300, this.state.colorHex, this.state.fontSize, this.state.thick, strText, x, y, this);
          const drawableToAdd = newDrawable;          
          drawableToAdd.registerMovement(200, 300, this.state.colorHex, this.state.fontSize, this.state.thick, strText, x, y, this);
          symbolDrawables.push(drawableToAdd);
          this.setState({
            newDrawable: [],
            symbolDrawables,
            newDrawableType: "FreeTextDrawable",
            selectedTool: ""
          });
          sessApi.setValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_TOOL, "");
        }       
        
    }

    handleRemoveItem = () => {
      // if (this.updated == 1) {
      if ((JSON.stringify(this.state.newImage) != JSON.stringify(this.state.newDefaultImage)) || this.state.drawables.length > 0 || this.state.symbolDrawables.length > 0) {
        this.setState({
          isClearImageModal: true,
          confirm_message: "編集画像を全削除しますか？",
        });        
      }
      /*let selected_symbol_time = sessApi.getValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_SYMBOL_TIME);
      if (selected_symbol_time == null) return;
      let arr_symbol = this.state.symbolDrawables;
      let ret = [];    
      arr_symbol.map(item=>{
        if (item.id == selected_symbol_time) {
          item.show = false;
        } 
        ret.push(item);
      });
      this.setState({
        symbolDrawables: ret
      });
      // this.symbolRightRef.draw();
      sessApi.remove(CACHE_SESSIONNAMES.SHEMA_SELECTED_SYMBOL_TIME);*/
  }

  handleErase = () => {    
    this.setState({ 
      newDrawableType: "FreePathEraseDrawable", 
      selectedTool: "erase"
    });

    sessApi.setValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_TOOL, "erase");
    // this.handleRemoveItem();
  }

  getComment = e => {
    this.setChangeFlag(1);
    this.setState({comment:e.target.value});
  }

  confirmCancel = () => {
    this.setState({
      isClearImageModal: false,
      confirm_message: ""
    });
  }

  clearImage = () => {    
    this.setChangeFlag(1);
    this.setState({
      isClearImageModal: false,
      confirm_message: "",
      drawables:[],
      symbolDrawables:[],
      view: this.state.defaultView,
      newImage: this.state.newDefaultImage
    });    

    this.props.clearImageRef();
    // this.stageRef.current.clear();
  }  

  render(){      
    // let imageObj = useImage(med);
    const {va_color} = this.state;
    const drawables = [...this.state.drawables, ...this.state.newDrawable];
    const symbolDrawables = this.state.symbolDrawables;
    let styles = reactCSS({
      'default': {
          color: {
              width: '100%',
              height: '100%',
              borderRadius: '2px',
              background: `rgba(${ va_color.r }, ${ va_color.g }, ${ va_color.b }, ${ va_color.a } )`,
          },
          swatch: {
              padding: '5px',
              background: '#fff',
              borderRadius: '1px',
              boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
              display: 'inline-block',
              cursor: 'pointer',
              width: '100px',
              height: '2.3rem',
          },
          popover: {
              position: 'absolute',
              zIndex: '200',
              top:'25px'
          },
          cover: {
              position: 'fixed',
              top: '0px',
              right: '0px',
              bottom: '0px',
              left: '0px',
          },  
          fullWidthHeight: {
            width: '100%',
            height: '100%'
          }
      },
  });    

    return (
      <>        
        <FlexHaruka>                                        
          <div className="div-parent">
            <div className="div-block block-1">
                <Icon className="fa-lg" icon={faTimes} onClick={this.handleRemoveItem} />
                <Icon className={`fa-lg ${this.state.selectedTool == "erase" ? "selected": ""}`}
                  icon={faEraser} 
                  onClick={this.handleErase}
                />
                <Icon                   
                  className={`fa-lg ${this.state.selectedTool == "pen" ? "selected": ""}`} 
                  icon={faEdit} 
                  onClick={() => {
                    this.setState({ newDrawableType: "FreePathDrawable", selectedTool: "pen" });
                  }}
                />
            </div>
            <div className="div-block block-2">
                <SelectorWithLabel
                  options={thickList}
                  title="線の太さ"
                  getSelect={this.getThick}
                  departmentEditCode={this.state.thick}
                />
                {/*<SelectorWithLabel
                  options={colorList}
                  title="カラー"
                  getSelect={this.getTreatSelect}
                  departmentEditCode={this.context.treatStatus}
                />*/}
                <div className="div-color flex">
                  <div className="color-title">
                    カラー
                  </div>
                  <div style={ styles.swatch } onClick={this.handleClick.bind(this)}>
                    <div style={ styles.color } />
                  </div>  
                </div>
                {this.state.displayColorPicker ? (
                  <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleClose }/>
                    <SketchPicker color={ this.state.color } onChange={ this.handleChange } onChangeComplete={ this.handleChangeComplete } />
                  </div>
                ):(
                  null
                )}
                <div className="flex">                                
                </div>
                <SelectorWithLabel
                  options={sizeList}
                  title="サイズ"
                  getSelect={this.getFontSize}
                  departmentEditCode={this.state.fontSize}
                />
            </div>
            <div className="div-block block-3">
              <p> 
                <span onClick={()=>this.handlePreview('A')} onDragStart={e =>this.onDragStart(e,'A')} draggable={true}>A</span>
                <span 
                  onClick={()=>this.handlePreview('V')}
                  onDragStart={e => this.onDragStart(e, 'V')}
                  draggable={true}
                >V</span>
                <span 
                  onClick={()=>this.handlePreview('×')}
                  onDragStart={e => this.onDragStart(e, '×')}
                  draggable={true}
                > ✕ </span> 
                <span 
                  onClick={()=>this.handlePreview('○')}
                  onDragStart={e => this.onDragStart(e, '○')}
                  draggable={true}
                > 〇 </span>
              </p>
              <div className="dv-table">
                <table>
                    <tr>
                        <td>
                          <img 
                            src={arrow} 
                            className="arrow-rotate-1" 
                            onClick={() => this.selectArrow(5)}
                            onDragStart={e => this.onDragStart(e, '5')} 
                            draggable={true} 
                          />
                        </td>
                        <td>
                          <img 
                            src={arrow} 
                            className="arrow-rotate-2" 
                            onClick={() => this.selectArrow(4)}
                            onDragStart={e => this.onDragStart(e, '4')} 
                            draggable={true} 
                          />
                        </td>
                        <td>
                          <img 
                            src={arrow} 
                            className="arrow-rotate-3" 
                            onClick={() => this.selectArrow(3)}
                            onDragStart={e => this.onDragStart(e, '3')} 
                            draggable={true} 
                          />
                        </td>
                    </tr>
                    <tr>
                        <td>
                          <img 
                            src={arrow} 
                            className="arrow-rotate-4" 
                            onClick={() => this.selectArrow(6)}
                            onDragStart={e => this.onDragStart(e, '6')} 
                            draggable={true} 
                          />
                        </td>
                        <td></td>
                        <td>
                          <img 
                            src={arrow} 
                            className="arrow-rotate-5" 
                            onClick={() => this.selectArrow(2)}
                            onDragStart={e => this.onDragStart(e, '2')} 
                            draggable={true} 
                          />
                        </td>
                    </tr>
                    <tr>
                        <td>
                          <img 
                            src={arrow} 
                            className="arrow-rotate-6" 
                            onClick={() => this.selectArrow(7)}
                            onDragStart={e => this.onDragStart(e, '7')} 
                            draggable={true} 
                          />
                        </td>
                        <td>
                          <img 
                            src={arrow} 
                            className="arrow-rotate-7" 
                            onClick={() => this.selectArrow(0)}
                            onDragStart={e => this.onDragStart(e, '0')} 
                            draggable={true} 
                          />
                        </td>
                        <td>
                          <img 
                            src={arrow} 
                            className="arrow-rotate-8" 
                            onClick={() => this.selectArrow(1)}
                            onDragStart={e => this.onDragStart(e, '1')} 
                            draggable={true} 
                          />
                        </td>
                    </tr>
                </table>
              </div>
            </div>
            <div className="div-block block-4">
                <div className="dv-input">自由入力</div>
                <InputWithLabel
                  label=""
                  type="text"
                  getInputText={this.getTextValue.bind(this)}                  
                />
                <Button type="mono" onClick={()=>this.handlePreview()}>作成</Button>
            </div>
          </div>
          <div className="div-paint" id="resetCanvas"
            onDragOver={e => e.preventDefault()}
            onDrop={e=>this.onDropEvent(e)}
          >                        
            <Stage
              onMouseDown={this.handleMouseDown}
              onMouseUp={this.handleMouseUp}
              onMouseMove={this.handleMouseMove}                   
              ref={this.stageRef}
              width={484}
              height={400}              
            >
              <Layer>
                <Img src={this.state.newImage.src} width={this.state.view.width} height={this.state.view.height} space="fill"/>
                {drawables.map(drawable => {
                  return drawable.render();
                })}
              </Layer>
              <Layer>
                <Img src={this.state.newDefaultImage.src} width={this.state.defaultView.width} height={this.state.defaultView.height} space="fill"/>
              </Layer>
              <Layer>
                {symbolDrawables.map(drawable => {
                  if (drawable.show != false) {                                
                    return drawable.render();
                  }
                })}                            
              </Layer>
            </Stage>
            <div className={'label-comment'}>コメント</div>
            <div className={'pic-comment'}>
              <textarea
                onChange={this.getComment.bind(this)}
                value={this.state.comment}
              />
            </div>
          </div>
          {this.state.isClearImageModal !== false && (
              <SystemConfirmJapanModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.clearImage}
                  confirmTitle= {this.state.confirm_message}
              />
          )}
        </FlexHaruka>
      </>
    );
  }
  
}

DialLeftNav.propTypes = {      
    imgBase64:PropTypes.string,    
    image_comment:PropTypes.string,    
    img_version:PropTypes.number,    
    clearImageRef:PropTypes.func,    
};

export default DialLeftNav;
