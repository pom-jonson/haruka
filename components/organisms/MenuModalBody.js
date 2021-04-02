import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import ItemMenu from "./ItemMenu";

// import ItemCommon from "./ItemCommon";
// import ItemCommonTwo from "./ItemCommonTwo";
// import ItemKarte from "./ItemKarte";
// import ItemPart from "./ItemPart";
// import ItemHarukaPrint from "./ItemHarukaPrint";
// import ItemHarukaMaintenance from "./ItemHarukaMaintenance";
// import ItemNurseService from "./ItemNurseService";

// ------- タブレット用 --------
// 共通
// import ItemCommonTabletOne from "./SmartPhone/ItemCommonTabletOne";
// import ItemCommonTabletTwo from "./SmartPhone/ItemCommonTabletTwo";
// import ItemCommonTabletThree from "./SmartPhone/ItemCommonTabletThree";

// カルテ記載


const BodyWrapper = styled.div`
.btn-green a, .btn-white a{
  padding: 0px !important;
  img{
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
}
  @media only screen and (max-width: 1660px) {
    width: 100%;
    // background: rgb(195, 232, 250);
    padding: 10px 0px 0px 0px;
    float: left;
    vertical-align: top;  
    // height: 77vh;
    overflow: hidden;
    // display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-content: flex-start;
    justify-content: space-between;

    .menu-item {
      display: inline-block;
      margin-right: 2px !important;
      height: auto;
      // width: 175px;
      width: 24.7%;
      float: left;    
      .item-title {
        // background: #f2ede9;      
        // border: 1px solid #b9b7b7;
        background: rgb(156, 211, 231);
        margin-bottom: 2px;
        border-bottom: 1px;
        text-align: center;
        padding: 6px 8px 8px;
        height: 2.5rem;
        // margin-bottom: 0px;
        color: #303e58;
        font-size: 1.25rem;
      }
      .item-content {
        margin-bottom: 20px;
        div {
          display: flex;
          width: 100%;
          margin-bottom: 0px;
          border-radius: 0px;
          margin-right: auto;               
          // background-color: #f3f8fb;
          // background-color: white;
          // border: 1px solid #b9b7b7;
          border-bottom-width: 0px;
          padding: 0px 4px;        
          box-sizing: border-box;
          text-align: left;
          border: none;
          // line-height: 35px;        
          height: 35px!important;
          cursor: pointer;
          span {
            font-weight: normal;
            font-size: 1rem;
            color: black;
            text-decoration: underline;
          }
          a {
            display: flex;
            padding-top: 5px;
            vertical-align: middle;
            svg {
              margin: 10px 8px 0px 5px!important;
            }
            img{

              margin-top: 2.5px;
            }
            span{
              margin-top: 8px;
            }
          }
        }
        .btn-white{
          background: white !important;      
        }

        .btn-green{
          background: #e1f4fb !important;
        }

        .flase:hover {
          background: rgb(159, 229, 255) !important;
        }
        
        .btn-blank{
          height: 33px;
          margin: 0px;
          cursor: default;
        }

        // .btn-blank ~ .btn-blank{
        //   margin-top: 0px !important;
        // }

        .btn-blank:first-child{
          margin-top: 0px !important;
        }      

        .fsBJgu{
          margin: 0;
          margin-right: 2px;
          background: #9cd3e7;
        }

        div:last-child{
          border-bottom-width: 1px;
        }
        .disable-button{
          background: #f0f0f0;
          span {
            color: #a5a2a2;
          }
        }
        .favourite-button{        
          background: #cbe8bdc7;
        }
      }
    }
    .nav {
      align-items: center;
      display: -webkit-box;
      margin-bottom: 0;
      list-style: none;
    }
    .nav li {
      width: 120px;
      font-size: 1rem !important;
    }

    a:hover {
      text-decoration: none;
    }
  }

  // --------------------------------------------------

@media only screen and (min-width: 1660px) {
  width: 100%;
  // background-color: ${colors.surface};  
  // background: rgb(195, 232, 250);
  padding: 10px 0px 0px 0px;
  float: left;
  vertical-align: top;  
  // height: 95%;
  overflow: hidden;
  // display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: flex-start;
  justify-content: space-between;

  .menu-item {
    display: inline-block;
    margin-right: 2px !important;
    height: auto;
    // width: 175px;
    // width: 12.37%;
    width: 24.77%;
    float: left;    
    .item-title {
      // background: #f2ede9;      
      // border: 1px solid #b9b7b7;
      background: rgb(156, 211, 231);
      margin-bottom: 2px;
      border-bottom: 1px;
      text-align: center;
      padding: 6px 4px 4px 4px;
      height: 2rem;
      // margin-bottom: 0px;
      color: #303e58;
      font-size: 0.875rem;
    }
    .item-content {
      margin-bottom: 20px;
      div {
        display: flex;
        width: 100%;
        margin-bottom: 0px;
        border-radius: 0px;
        margin-right: auto;               
        // background-color: #f3f8fb;
        // background-color: white;
        // border: 1px solid #b9b7b7;
        border-bottom-width: 0px;
        padding: 0px 4px;        
        box-sizing: border-box;
        text-align: left;
        border: none;
        height:35px!important;
        // line-height: 30px;
        cursor: pointer;
        span {
          font-weight: normal;
          font-size: 0.875rem;
          color: black;
          text-decoration: underline;
          line-height: 35px;
        }
        a {
          display: flex;
          padding-top: 2px;
          vertical-align: middle;
          svg {
            margin: 8px 8px 0px 5px!important;
          }          
          span{
            // margin-top: 6px;
          }
          img{
            width: 35px;
            height: 35px;
          }
        }
      }
      .btn-white{
        background: white !important;      
      }

      .btn-green{
        background: #e1f4fb !important;
      }
      .flase:hover {
        background: rgb(159, 229, 255) !important;
      }

      .btn-blank{
        height: 28px;        
        margin: 0px;
        cursor: default;
      }              
      .fsBJgu{
        margin: 0;
        margin-right: 2px;
        background: #9cd3e7;
      }

      div:last-child{
        border-bottom-width: 1px;
      }
      .disable-button{
        background: #f0f0f0;
        span {
          color: #a5a2a2;
        }
      }
      .favourite-button{        
        background: #cbe8bdc7;
      }
    }
  }
  .nav {
    align-items: center;
    display: -webkit-box;
    margin-bottom: 0;
    list-style: none;
  }
  .nav li {
    width: 120px;
    font-size: 1rem !important;
  }

  a:hover {
    text-decoration: none;
  }
}
`;

class MenuModalBody extends Component {
  constructor(props) {
    super(props);
    // let curScreenWidth = window.innerWidth;
    this.state = {
      // screen_w: curScreenWidth < this.props.sp_width ? "window_1200" : "window_1920"
      screen_w: "window_1200"
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ screen_w: nextProps.screen_width });
  }

  render() {    
    return (
      <BodyWrapper>
        <ItemMenu
          tab_id={this.props.tab_id}
          onGoto={this.props.onGoto}
          updateFavouriteList={this.props.updateFavouriteList}
          favouriteList={this.props.favouriteList}
          screen_width={this.state.screen_w}
          sp_width={this.props.sp_width}              
        />       
      </BodyWrapper>
    )
  }
}

MenuModalBody.propTypes = {
  tab_id: PropTypes.number,
  onGoto: PropTypes.func,
  updateFavouriteList: PropTypes.func,
  screen_width: PropTypes.string,
  sp_width: PropTypes.number,
  favouriteList: PropTypes.array,
};

export default MenuModalBody;
