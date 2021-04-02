import React from "react";
// import Context from "~/helpers/configureStore";
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
import PropTypes from "prop-types";
// import med from "~/components/_demo/VA3.jpg";
import img_foot_left from "~/components/_demo/foot_left.png";
import img_foot_right from "~/components/_demo/foot_right.png";
// import useImage from 'use-image';
// import { render } from 'react-dom';
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";

import Img from './Img';

import { Stage, Layer, Arrow, Circle, Ellipse, Line, Text} from "react-konva";
import { 
  faEdit, 
  faEraser,   
  faTimes
} from "@fortawesome/pro-regular-svg-icons";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const Icon = styled(FontAwesomeIcon)`
  font-size: 16px;
  margin: auto;
`;

const FlexHaruka = styled.div`
  border-bottom: 1px solid #dedede;
  border-left: 1px solid #ddd;
  background-color: ${colors.surface};
  display: block;
  justify-content: space-between;
  top: 0;
  width: 100%;
  height: 550px; 
  overflow-y: auto; 
  margin-left: 10px;
  margin-right: 10px;
  border: none;
  z-index: 101;
  float: right;
  right: 0px;
  .ellipse-selected-btn{
    button{
      background: rgb(105, 200, 225);
    }
  }
  .ellipse-btn{
    button{
      border-radius: 50%;
      height: 25px;
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

  .foot-label {
      height: 40px;
      padding-top: 5px;
      width: 100%;
      text-align: center;
      background-color: #ddd;
      color: black;                    
      margin-bottom: 2px;
  }
  .selected_border_color{    
    border-color: #535353 !important;
  }
  .selected_foot{
    background-color: #4f95ef;
    color: white;
  }

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
      margin-right: 20px;
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
        font-size: 12px;
        line-height: 38px;
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
    span{
      cursor: pointer;
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
    height: 30%;
    // background: rgb(238, 238, 238);
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
  .konvajs-content{
    border: 1px solid #aaa;
    width: 402px !important;
    height: 502px !important;
  }

  .div-parent{
    // background: #eee;
    width: 230px;  
    height: 500px;  
    float: right;
    margin-left: 2px;
    svg{
      cursor: pointer;
    }
  }

  .div-paint{
    width: 402px !important;
    height: 550px !important;
    margin-left: 5px;
  }

  .div-disease{
    width: 120px;
    float: left;
    margin-left: 10px;    
    button{
      margin-bottom: 2px;
      display: block;
      padding: 2px 4px !important;
      width: 120px;
      span{
        text-align: left;
        font-size: 16px;
      }
    }
    img{
      width: 24px;
    }
  }


  .div-arrow{
    width: 40px;
    float: left;
    margin-left: 10px;
    button{
      display: block;
      width: 40px;
      min-width: 40px;
      margin-bottom: 10px;
      span{
        font-size: 16px;
        text-align: center;
        margin: -6px;
      }
    }
    img{
      width: 24px;
    }
  }

  .selected{
    background: #69c8e1;
  }
  .ellipse-area{
    stroke: black;
    stroke-width: 5px;
    width: 3rem;
    height: 100%;
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
    // return <Text text={this.strText} x={this.targetX} y={this.targetY} draggable={true} onClick={this.handleMouseDown} fill={this.color} fontSize={this.size} strokeWidth={this.thick} />;
    return (
      <>
      {this.visible == 1 ? (
        <Text text={this.strText} x={this.targetX} y={this.targetY} draggable={true} onMouseDown={this.handleMouseDown} fill={this.color} fontSize={this.size} strokeWidth={this.thick} />
      ) : (
        <></>
      )}
      </>  
    );
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

class EllipseDrawable extends ArrowDrawable {
  constructor(startx, starty, color, thick, size, radiusX, radiusY, parent) {  
    super(startx, starty, color, thick, size, radiusX, radiusY, parent);
    this.x = startx;
    this.y = starty;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.thick = thick;
    this.color = color;
    this.size = size;
    this.visible = 1;    
    this.parent_state = parent;
  }
  registerMovement(x, y, color, thick, size, radiusX, radiusY) {
    // this.x = x;
    // this.y = y;
    this.color = color;    
    this.thick = thick;    
    this.size = size;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
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
    // let isSelected = true;
    // React.useEffect(() => {
    //   if (isSelected) {
    //     // we need to attach transformer manually
    //     this.trRef.current.setNode(this.shapeRef.current);
    //     this.trRef.current.getLayer().batchDraw();
    //   }
    // }, [isSelected]);
    // {isSelected && <Transformer ref={this.trRef} />}        
    let pos_x = this.x;
    let pos_y = this.y;
    if (this.x > this.radiusX) {
      pos_x = this.radiusX;
    }
    if (this.y > this.radiusY) {
      pos_y = this.radiusY;
    }
    let radius_x = Math.abs(this.radiusX - this.x);
    let radius_y = Math.abs(this.radiusY - this.y);
    return (
      <>
      {this.visible == 1 ? (        
        <>
          <Ellipse x={pos_x} y={pos_y} strokeWidth={this.thick} radiusX={radius_x} radiusY={radius_y} fillEnabled={false} stroke={this.color} draggable={true} onMouseDown={this.handleMouseDown}/>          
        </>
      ) : (
        <></>
      )}
      </>
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

class DialFootcareNav extends React.Component {  
  constructor(props) {
    super(props);
    
    // ●DN574 フットケア画像の左端余白が極端に小さい
    let image_background_version = 1;
    let left_image_background = img_foot_left;
    let right_image_background = img_foot_right;
    if (this.props.imgBackroundVersion != undefined && this.props.imgBackroundVersion > 1) {
      image_background_version = this.props.imgBackroundVersion;
    }
    if (this.props.imgLeftBackgroundBase64 != undefined && this.props.imgLeftBackgroundBase64 != "") {
      left_image_background = this.props.imgLeftBackgroundBase64;
    }
    if (this.props.imgRightBackgroundBase64 != undefined && this.props.imgRightBackgroundBase64 != "") {
      right_image_background = this.props.imgRightBackgroundBase64;
    }

    this.zoom_number = 0.9;
    this.default_width = 400;
    this.default_height = 450;

    if (image_background_version > 1) {
      this.zoom_number = 1;
      this.default_height = 500;
    }


    let zoom_left = 1;
    let zoom_right = 1;
    let imgData_left = this.props.imgLeftBase64;
    let imgData_right = this.props.imgRightBase64;
    if (imgData_left == null || imgData_left == ""){
      imgData_left = left_image_background;
      zoom_left = this.zoom_number;
    }
    if (imgData_right == null || imgData_right == ""){
      imgData_right = right_image_background;
      zoom_right = this.zoom_number;
    }
    this.newImage_left = {
      path: "",
      width: this.default_width,
      height: this.default_height,
      zIndex: 0,
      src: imgData_left
    };

    this.newImage_right = {
      path: "",
      width: this.default_width,
      height: this.default_height,
      zIndex: 0,
      src: imgData_right
    };    

    let view_left = {
      width: this.newImage_left.width*zoom_left,
      height: this.newImage_left.height*zoom_left
    };

    let view_right = {
      width: this.newImage_right.width * zoom_right,
      height: this.newImage_right.height * zoom_right
    };

    this.newDefaultImage_left = {
      path: "",
      width: this.default_width,
      height: this.default_height,
      zIndex: 0,
      src: left_image_background
    };

    this.newDefaultImage_right = {
      path: "",
      width: this.default_width,
      height: this.default_height,
      zIndex: 0,
      src: right_image_background
    };   

    let defaultView_left = {
      width: this.newImage_left.width*this.zoom_number,
      height: this.newImage_left.height*this.zoom_number
    };

    let defaultView_right = {
      width: this.newImage_right.width * this.zoom_number,
      height: this.newImage_right.height * this.zoom_number
    }; 

    this.state = {
      drawables: [],
      symbolDrawables: [],
      drawablesLeft: [],
      symbolDrawablesLeft: [],
      newDrawable: [],
      newDrawableLeft: [],
      newDrawableType: "FreePathDrawable",
      arrowType: 0,
      va_color:{r:'0', g: '0', b: '0', a: '1'},
      displayColorPicker: false,
      color: {r: '0',g: '0',b: '0',a: '1',},
      colorHex: "#000000",
      canvasText: "",
      fontSize: 36,
      thick: 3,
      viewLeft: view_left,
      viewRight: view_right,
      newImageLeft: this.newImage_left,
      newImageRight: this.newImage_right,
      newDefaultImageLeft: this.newDefaultImage_left,
      newDefaultImageRight: this.newDefaultImage_right,
      defaultViewLeft: defaultView_left,
      defaultViewRight: defaultView_right,
      selectedTool: "pen",
      curPointX:100,
      curPointY: 100,
      selectedFootFlag: "left",
      isClearImageModal: false,
      change_flag: 0,      
    }  

    this.stageLeftRef = React.createRef();
    this.stageRightRef = React.createRef();

    this.symbolLeftRef = React.createRef();
    
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
          sessApi.setObjectValue('dial_change_flag', 'foot_care_modal', 1)
      } else {
          sessApi.remove('dial_change_flag');
      }
  };

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
      EllipseDrawable,
      ArrowDrawable,
      FreeTextDrawable,
      FreePathEraseDrawable
    };
    if (type == "EllipseDrawable") {      
      return new drawableClasses[type](x, y, this.state.colorHex, this.state.thick, this.state.fontSize, x, y, this);
    } else {
      return new drawableClasses[type](x, y, this.state.colorHex, this.state.thick, this.state.fontSize);
    }
  };

  handleMouseDown = e => {
    if (this.isMoving ==1) return;

    if (this.state.newDrawableType == "ArrowDrawable" || this.state.newDrawableType == "FreeTextDrawable") {
      return;
    }
    if (this.state.newDrawableType == "FreePathDrawable" || 
      this.state.newDrawableType == "FreePathEraseDrawable" || 
      this.state.newDrawableType == "EllipseDrawable") {
      this.mosue_clicked = 1;
      this.setChangeFlag(1);
    }
    const { newDrawable, newDrawableLeft } = this.state;
    let newComponent = newDrawable;
    if (this.state.selectedFootFlag == "left") {
      newComponent = newDrawableLeft;
    }
    if (newComponent.length === 0) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const newComponent = this.getNewDrawableBasedOnType(
        x,
        y,
        this.state.newDrawableType
      );
      if (this.state.selectedFootFlag == "right") {
        this.setState({
          newDrawable: [newComponent]
        });
      } else {
        this.setState({
          newDrawableLeft: [newComponent]
        });
      }
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
        if (this.state.newDrawableType == "EllipseDrawable") {
          drawableToAdd.registerMovement(x, y, this.state.colorHex, this.state.thick, this.state.fontSize, x, y, this);
        } else {
          drawableToAdd.registerMovement(x, y);          
        }   
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
    const { newDrawable, newDrawableLeft, drawables, drawablesLeft, symbolDrawables, symbolDrawablesLeft } = this.state;
    let container = drawables;
    let container_symbol = symbolDrawables;
    let newComponent = newDrawable;
    if (this.state.selectedFootFlag == "left") {
      container = drawablesLeft;
      container_symbol = symbolDrawablesLeft;
      newComponent = newDrawableLeft;      
    }
    if (newComponent.length == 1) {
      const { x, y } = e.target.getStage().getPointerPosition();
      const drawableToAdd = newComponent[0];   
      if (this.state.newDrawableType == "EllipseDrawable") {        
        drawableToAdd.registerMovement(x, y, this.state.colorHex, this.state.thick, this.state.fontSize, x, y, this);
        container_symbol.push(drawableToAdd);
      } else {
        drawableToAdd.registerMovement(x, y);
        container.push(drawableToAdd);
      }      
      if (this.state.selectedFootFlag == "right") {
        this.setState({
          newDrawable: [],
          drawables: container,
          symbolDrawables: container_symbol,
          curPointX: x,
          curPointY: y
        });
      } else {
        this.setState({
          newDrawableLeft: [],
          drawablesLeft: container,
          symbolDrawablesLeft: container_symbol,
          curPointX: x,
          curPointY: y
        });
      }
    }
    this.mosue_clicked = 0;
  };

  handleMouseMove = e => {
    if (this.state.newDrawableType == "FreePathDrawable" || 
      this.state.newDrawableType == "FreePathEraseDrawable" || 
      this.state.newDrawableType == "EllipseDrawable") {
      if (this.mosue_clicked != 1) return;
    }
    const { newDrawable, newDrawableLeft } = this.state;
    let newComponent = newDrawable;
    if (this.state.selectedFootFlag == "left") {
      newComponent = newDrawableLeft;
    }
    if (newComponent.length == 1) {
      const { x, y } = e.target.getStage().getPointerPosition();
      this.mousePosX = x;
      this.mousePosY = y;
      const updatedNewDrawable = newComponent[0];
      if (this.state.newDrawableType == "EllipseDrawable") {
        updatedNewDrawable.registerMovement(x, y, this.state.colorHex, this.state.thick, this.state.fontSize, x, y, this);
      } else {
        updatedNewDrawable.registerMovement(x, y);
      }
      if (this.state.selectedFootFlag == "right") {
        this.setState({
          newDrawable: [updatedNewDrawable]
        });
      } else {
        this.setState({
          newDrawableLeft: [updatedNewDrawable]
        });
      }
    }
  };

  // -------------------
  selectArrow = (nType) => {   
    this.setChangeFlag(1);
    let newDrawable = new ArrowDrawable(200, 300, this.state.colorHex, this.state.thick, this.state.fontSize, nType, this.state.curPointX, this.state.curPointY, this);
    const { symbolDrawables, symbolDrawablesLeft } = this.state;
    const drawableToAdd = newDrawable;          
    drawableToAdd.registerMovement(200, 300, this.state.colorHex, this.state.thick, this.state.fontSize, nType, this.state.curPointX, this.state.curPointY, this);
    // drawables.push(drawableToAdd);
    if (this.state.selectedFootFlag == "right") {
      symbolDrawables.push(drawableToAdd);
    } else {
      symbolDrawablesLeft.push(drawableToAdd);
    }
    this.setState({
      newDrawable: [],
      symbolDrawables,
      symbolDrawablesLeft,
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
      this.setChangeFlag(1);
    }
    let newDrawable = new FreeTextDrawable(200, 300, this.state.colorHex, this.state.fontSize, this.state.thick, strText, this.state.curPointX, this.state.curPointY, this);
    // const { drawables } = this.state;
    const { symbolDrawables, symbolDrawablesLeft } = this.state;
    const drawableToAdd = newDrawable;          
    drawableToAdd.registerMovement(200, 300, this.state.colorHex, this.state.fontSize, this.state.thick, strText, this.state.curPointX, this.state.curPointY, this);
    if (this.state.selectedFootFlag == "right") {
      symbolDrawables.push(drawableToAdd);
    } else {
      symbolDrawablesLeft.push(drawableToAdd);
    }
    this.setState({
      newDrawable: [],
      symbolDrawables,
      symbolDrawablesLeft,
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

  exchangeFoot = (footState) => {
    this.setState({
      selectedFootFlag: footState
    });
  }

  onDragStart = (e, strText) => {
    e.dataTransfer.setData(
      "text",
      "content:" + strText 
    );    
    e.stopPropagation();
  };

  onDragOver = e => {
      e.preventDefault();
  };

  onDropEvent = (e, type) => {            
        // 右足, 左足 <> selectedFootFlag 
        if (this.state.selectedFootFlag != type) {
          return;
        }
        this.stageRightRef.current.setPointersPositions(e);
        let pos_right = this.stageRightRef.current.getPointerPosition();   

        this.stageLeftRef.current.setPointersPositions(e);
        let pos_left = this.stageLeftRef.current.getPointerPosition();

        let data = e.dataTransfer.getData("text");
        let strText = this.state.canvasText;
        let strLetter = data.split(":")[1];
        if (strLetter != "") {
          strText = strLetter;
          this.setChangeFlag(1);
        }

        let x = pos_right.x;
        let y = pos_right.y;

        if (this.state.selectedFootFlag == "left") {
          x = pos_left.x;
          y = pos_left.y;
        }
        if (strLetter == '0' || strLetter == '2' || strLetter == '4' || strLetter == '6') { // arrow

          const { symbolDrawables, symbolDrawablesLeft } = this.state;
          let newDrawable = new ArrowDrawable(200, 300, this.state.colorHex, this.state.thick, this.state.fontSize, parseInt(strLetter), x, y, this);
          const drawableToAdd = newDrawable;          
          drawableToAdd.registerMovement(200, 300, this.state.colorHex, this.state.thick, this.state.fontSize, parseInt(strLetter), x, y, this);
          if (this.state.selectedFootFlag == "right") {
            symbolDrawables.push(drawableToAdd);
          } else {
            symbolDrawablesLeft.push(drawableToAdd);
          }
          this.setState({
            newDrawable: [],
            symbolDrawables,
            symbolDrawablesLeft,
            newDrawableType: "ArrowDrawable",
            arrowType: parseInt(strLetter),
            selectedTool: ""
          });
          sessApi.setValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_TOOL, "");
        } else { // text && symbol 

          const { symbolDrawables, symbolDrawablesLeft } = this.state;
          let newDrawable = new FreeTextDrawable(200, 300, this.state.colorHex, this.state.fontSize, this.state.thick, strText, x, y, this);
          const drawableToAdd = newDrawable;          
          drawableToAdd.registerMovement(200, 300, this.state.colorHex, this.state.fontSize, this.state.thick, strText, x, y, this);
          if (this.state.selectedFootFlag == "right") {
            symbolDrawables.push(drawableToAdd);
          } else {
            symbolDrawablesLeft.push(drawableToAdd);
          }
          this.setState({
            newDrawable: [],
            symbolDrawables,
            symbolDrawablesLeft,
            newDrawableType: "FreeTextDrawable",
            selectedTool: ""
          });
          sessApi.setValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_TOOL, "");
        }             
        
    }

  handleRemoveItem = () => {
    // remove symbol
    /*let selected_symbol_time = sessApi.getValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_SYMBOL_TIME);
    if (selected_symbol_time == null) return;
    let arr_symbol_left = this.state.symbolDrawablesLeft;
    let arr_symbol_right = this.state.symbolDrawables;
    let ret_l = [];    
    let ret_r = []; */   
    // arr_symbol.filter(item=>{
    //   if (item.id != selected_symbol_time) 
    //     ret.push(item);         
    // });
    if (this.state.selectedFootFlag == "right") {
        // if (this.state.drawables.length > 0 || this.state.symbolDrawables.length > 0) {          
        if ((JSON.stringify(this.state.newImageRight) != JSON.stringify(this.state.newDefaultImageRight)) || this.state.drawables.length > 0 || this.state.symbolDrawables.length > 0) {          
          this.setState({
            isClearImageModal: true,
            confirm_message: "右足編集画像を全削除しますか？",
          });
        }
      /*arr_symbol_right.map(item=>{
        if (item.id == selected_symbol_time) {
          item.show = false;
          ret_r.push(item);         
        } else {
          ret_r.push(item);
        }
      });
      this.setState({
        symbolDrawablesRight: ret_r
      });
      this.symbolRightRef.draw();
      sessApi.remove(CACHE_SESSIONNAMES.SHEMA_SELECTED_SYMBOL_TIME);*/
    }
    if (this.state.selectedFootFlag == "left") {      
      // if (this.state.drawablesLeft.length > 0 || this.state.symbolDrawablesLeft.length > 0) {          
      if ((JSON.stringify(this.state.newImageLeft) != JSON.stringify(this.state.newDefaultImageLeft)) || this.state.drawablesLeft.length > 0 || this.state.symbolDrawablesLeft.length > 0) {          
          this.setState({
            isClearImageModal: true,
            confirm_message: "左足編集画像を全削除しますか？",
          });
        }
      /*arr_symbol_left.map(item=>{
        if (item.id == selected_symbol_time) {
          item.show = false;
          ret_l.push(item);         
        } else {
          ret_l.push(item);
        }
      });
      
      this.setState({
        symbolDrawablesLeft: ret_l,
      });
      this.symbolLeftRef.draw();
      sessApi.remove(CACHE_SESSIONNAMES.SHEMA_SELECTED_SYMBOL_TIME);*/
    }

  }

  handleErase = () => {    
    this.setState({ 
      newDrawableType: "FreePathEraseDrawable", 
      selectedTool: "erase"
    });

    sessApi.setValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_TOOL, "erase");
    // remove symbol
    // this.handleRemoveItem();
  }

  confirmCancel = () => {
    this.setState({
      isClearImageModal: false,
      confirm_message: ""
    });
  }

  clearImage = () => {
    this.setChangeFlag(1);
    if (this.state.selectedFootFlag == "right") {    
      let view_right = {
        width: this.newImage_right.width*this.zoom_number,
        height: this.newImage_right.height*this.zoom_number
      };
      this.setState({
        isClearImageModal: false,
        confirm_message: "",
        drawables:[],
        symbolDrawables:[],
        newImageRight: this.newDefaultImage_right,
        // newDefaultImageRight: this.newDefaultImage_right,
        viewRight: view_right
      });    
    } else if(this.state.selectedFootFlag == "left") {
      let view_left = {
        width: this.newImage_left.width*this.zoom_number,
        height: this.newImage_left.height*this.zoom_number
      };
      this.setState({
        isClearImageModal: false,
        confirm_message: "",
        drawablesLeft:[],
        symbolDrawablesLeft:[],
        newImageLeft: this.newDefaultImage_left,
        // newDefaultImageLeft: this.newDefaultImage_left,
        viewLeft: view_left
      });    
    }
    // this.stageRef.current.clear();
  }  

  handleEllipse = () => {    
    if (this.state.selectedTool == "ellipse") {
      ArrowDrawable
    }
    this.setState({ 
      newDrawableType: this.state.selectedTool == "ellipse" ? "ArrowDrawable" : "EllipseDrawable", 
      selectedTool: this.state.selectedTool == "ellipse" ? "" : "ellipse"
    });

    sessApi.setValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_TOOL, "");
  }

  // handleEllipse = () => {
  //   console.log("handleEllipse");
  //   let newDrawable = new EllipseDrawable(200, 300, this.state.colorHex, this.state.fontSize, this.state.thick, 100, 50);
  //   // const { drawables } = this.state;
  //   const { symbolDrawables, symbolDrawablesLeft } = this.state;
  //   const drawableToAdd = newDrawable;          
  //   // drawableToAdd.registerMovement(200, 300, this.state.colorHex, this.state.fontSize, this.state.thick, strText, this.state.curPointX, this.state.curPointY, this);
  //   if (this.state.selectedFootFlag == "right") {
  //     symbolDrawables.push(drawableToAdd);
  //   } else {
  //     symbolDrawablesLeft.push(drawableToAdd);
  //   }
  //   this.setState({
  //     newDrawable: [],
  //     symbolDrawables,
  //     symbolDrawablesLeft,
  //     newDrawableType: "EllipseDrawable",
  //     selectedTool: ""
  //   });   
  //   sessApi.setValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_TOOL, "");
  // }

  render(){      
    const {va_color} = this.state;
    const drawables = [...this.state.drawables, ...this.state.newDrawable];
    const drawablesLeft = [...this.state.drawablesLeft, ...this.state.newDrawableLeft];
    const symbolDrawables = this.state.symbolDrawables;
    const symbolDrawablesLeft = this.state.symbolDrawablesLeft;
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
              height: '30px',
              margin: '5px 0px'
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
      },
  });   
    return (
      <>        
        <FlexHaruka>  
                    <div className={`div-paint ${this.state.selectedFootFlag == "left" ? "selected_border_color" : ""}`} 
                      onClick={()=>{this.exchangeFoot("left")}}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e=>this.onDropEvent(e, "left")}
                    >  
                      <div className={`foot-label ${this.state.selectedFootFlag == "left" ? "selected_foot" : ""}`}>左足</div>                      
                      <Stage
                        onMouseDown={this.state.selectedFootFlag == "left" && this.handleMouseDown}
                        onMouseUp={this.state.selectedFootFlag == "left" && this.handleMouseUp}
                        onMouseMove={this.state.selectedFootFlag == "left" && this.handleMouseMove}
                        width={this.default_width}
                        height={500}
                        ref={this.stageLeftRef}
                      >                          
                        <Layer>
                          <Img src={this.state.newImageLeft.src} width={this.state.viewLeft.width} height={this.state.viewLeft.height} space="fill"/>
                          {drawablesLeft.map(drawable => {
                            return drawable.render();
                          })}
                        </Layer>
                        <Layer>
                          <Img src={this.state.newDefaultImageLeft.src} width={this.state.defaultViewLeft.width} height={this.state.defaultViewLeft.height} space="fill"/>
                        </Layer>
                        <Layer ref={this.symbolLeftRef}>
                          {symbolDrawablesLeft.map(drawable => {
                            if (drawable.show != false) {                                
                              return drawable.render();
                            }
                          })}   
                        </Layer>
                      </Stage>
                    </div>                  
                    <div className={`div-paint ${this.state.selectedFootFlag == "right" ? "selected_border_color" : ""}`} 
                      onClick={()=>{this.exchangeFoot("right")}}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e=>this.onDropEvent(e, "right")}
                    >    
                        <div className={`foot-label ${this.state.selectedFootFlag == "right" ? "selected_foot" : ""}`}>右足</div>                    
                        <Stage
                          onMouseDown={this.state.selectedFootFlag == "right" && this.handleMouseDown}
                          onMouseUp={this.state.selectedFootFlag == "right" && this.handleMouseUp}
                          onMouseMove={this.state.selectedFootFlag == "right" && this.handleMouseMove}
                          width={this.default_width}
                          height={500}
                          ref={this.stageRightRef}
                        >                          
                          <Layer>
                            <Img src={this.state.newImageRight.src} width={this.state.viewRight.width} height={this.state.viewRight.height} space="fill"/>
                            {drawables.map(drawable => {
                              return drawable.render();
                            })}
                          </Layer>
                          <Layer>
                            <Img src={this.state.newDefaultImageRight.src} width={this.state.defaultViewRight.width} height={this.state.defaultViewRight.height} space="fill"/>
                          </Layer>
                          <Layer>
                            {symbolDrawables.map(drawable => {
                              if (drawable.show != false) {                                
                                return drawable.render();
                              }
                            })}                            
                          </Layer>
                        </Stage>
                      </div>                      
                      <div className="div-disease">
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('①')} 
                          onDragStart={e => this.onDragStart(e, '①')} 
                          draggable={true} 
                        >①白癬</Button>
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('②')}
                          onDragStart={e => this.onDragStart(e, '②')} 
                          draggable={true}
                        >②爪白癬</Button>
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('③')}
                          onDragStart={e => this.onDragStart(e, '③')} 
                          draggable={true}
                        >③巻爪</Button>
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('④')}
                          onDragStart={e => this.onDragStart(e, '④')} 
                          draggable={true}
                        >④胼胝</Button>
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('⑤')}
                          onDragStart={e => this.onDragStart(e, '⑤')} 
                          draggable={true}
                        >⑤鶏眼</Button>
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('⑥')}
                          onDragStart={e => this.onDragStart(e, '⑥')} 
                          draggable={true}
                        >⑥硬化・肥厚</Button>
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('⑦')}
                          onDragStart={e => this.onDragStart(e, '⑦')} 
                          draggable={true}
                        >⑦乾燥</Button>
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('⑧')}
                          onDragStart={e => this.onDragStart(e, '⑧')} 
                          draggable={true}
                        >⑧亀裂</Button>
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('⑨')}
                          onDragStart={e => this.onDragStart(e, '⑨')} 
                          draggable={true}
                        >⑨発赤</Button>
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('⑩')}
                          onDragStart={e => this.onDragStart(e, '⑩')} 
                          draggable={true}
                        >⑩水泡</Button>
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('⑪')}
                          onDragStart={e => this.onDragStart(e, '⑪')} 
                          draggable={true}
                        >⑪潰痬</Button>
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('⑫')}
                          onDragStart={e => this.onDragStart(e, '⑫')} 
                          draggable={true}
                        >⑫外傷</Button>
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('⑬')}
                          onDragStart={e => this.onDragStart(e, '⑬')} 
                          draggable={true}
                        >⑬浮腫</Button>
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('⑭')}
                          onDragStart={e => this.onDragStart(e, '⑭')} 
                          draggable={true}
                        >⑭変形</Button>
                      </div>
                      <div className="div-arrow">
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('×')}
                          onDragStart={e => this.onDragStart(e, '×')} 
                          draggable={true}
                        >✕</Button>
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('○')}
                          onDragStart={e => this.onDragStart(e, '○')} 
                          draggable={true}
                        >〇</Button>
                        <Button type="mono" 
                          onClick={()=>this.handlePreview('●')}
                          onDragStart={e => this.onDragStart(e, '●')} 
                          draggable={true}
                        >●</Button>
                        <Button type="mono"
                          onClick={() => this.selectArrow(4)}
                          onDragStart={e => this.onDragStart(e, '4')} 
                          draggable={true}
                        >
                          <img 
                            src={arrow} 
                            className="arrow-rotate-2"                             
                          />
                        </Button>
                        <Button type="mono"
                          onClick={() => this.selectArrow(0)}
                          onDragStart={e => this.onDragStart(e, '0')} 
                          draggable={true}
                        >
                          <img 
                            src={arrow} 
                            className="arrow-rotate-7"                             
                          />
                        </Button>
                        <Button type="mono"
                          onClick={() => this.selectArrow(6)}
                          onDragStart={e => this.onDragStart(e, '6')} 
                          draggable={true}
                        >
                          <img 
                            src={arrow} 
                            className="arrow-rotate-4"                              
                          />
                        </Button>
                        <Button type="mono"
                          onClick={() => this.selectArrow(2)}
                          onDragStart={e => this.onDragStart(e, '2')} 
                          draggable={true}
                        >
                          <img 
                            src={arrow} 
                            className="arrow-rotate-5"                             
                          />
                        </Button>                          
                      </div>
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
                    sessApi.setValue(CACHE_SESSIONNAMES.SHEMA_SELECTED_TOOL, "");
                  }}
                />
                <svg onClick={this.handleEllipse} className={this.state.selectedTool == "ellipse" ? "selected ellipse-area": "ellipse-area"} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 88.332 88.333">
                  <g>
                    <g>
                      <path d="M44.166,75.062C19.812,75.062,0,61.202,0,44.167C0,27.13,19.812,13.27,44.166,13.27c24.354,0,44.166,13.859,44.166,30.896
                        C88.332,61.204,68.52,75.062,44.166,75.062z M44.166,16.27C21.467,16.27,3,28.784,3,44.167c0,15.381,18.467,27.896,41.166,27.896
                        s41.166-12.515,41.166-27.896C85.332,28.785,66.865,16.27,44.166,16.27z"/>
                    </g>
                  </g>
                  <g>
                  </g>
                  <g>
                  </g>
                  <g>
                  </g>
                  <g>
                  </g>
                  <g>
                  </g>
                  <g>
                  </g>
                  <g>
                  </g>
                  <g>
                  </g>
                  <g>
                  </g>
                  <g>
                  </g>
                  <g>
                  </g>
                  <g>
                  </g>
                  <g>
                  </g>
                  <g>
                  </g>
                  <g>
                  </g>
                </svg>                
            </div>
            <div className="div-block block-2">
                <SelectorWithLabel
                  options={thickList}
                  title="線の太さ"
                  getSelect={this.getThick}
                  departmentEditCode={this.state.thick}
                />               
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

DialFootcareNav.propTypes = {      
    imgLeftBase64:PropTypes.string,    
    imgRightBase64:PropTypes.string,    
    imgBackroundVersion:PropTypes.number,    
    imgLeftBackgroundBase64:PropTypes.string,    
    imgRightBackgroundBase64:PropTypes.string,    
};

export default DialFootcareNav;
