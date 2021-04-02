import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import ItemDial from "./ItemDial";
import ItemMaintenance from "./ItemMaintenance";
import ItemPrint from "./ItemPrint";
import Context from "~/helpers/configureStore";

const BodyWrapper = styled.div`
  background-color: ${colors.surface};  
  padding: 0.625rem 0px 0px 0.625rem;;
  float: left;
  vertical-align: top;  
  height: 80vh;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: flex-start;

  .menu-item {
    display: inline-block;
    margin-right: 0.625rem !important;
    height: auto;
    width: 13.5rem;
    float: left;    
    .item-title {
      background: #f2ede9;
      border: 1px solid #b9b7b7;
      border-bottom: 1px;
      text-align: center;
      padding: 0.25rem;
      margin-bottom: 0px;
      color: #303e58;
      font-size: 1.125rem;
    }
    .item-content {
      margin-bottom: 1.25rem;
      button {
        width: 100%;
        margin-bottom: 0px;
        border-radius: 0px;
        margin-right: auto;        
        // background-color: #f3f8fb;
        background-color: white;
        border: 1px solid #b9b7b7;
        border-bottom-width: 0px;
        padding: 0.375rem 0.5rem;        
        box-sizing: border-box;
        text-align: left;
        span {
          font-weight: normal;
          font-size: 1rem;
          color: black;
        }
      }
      button:hover{
        background: #d7f9ec !important;
      }
      button:last-child{
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

  .dv-group{
    float: left;
    width: 200px;
    height: 80vh;
  }
`;

class MenuDialModalBody extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  canShowMaintenance = () => {
      if(this.context.$canDoAction(this.context.FEATURES.MAINTENANCE,
          this.context.AUTHS.READ
      )){
        return true;
      }
      return false;
  }

  render() {
    const tab_id = this.props.tab_id;

    return (
      <BodyWrapper>        
        {tab_id == 6 && (
          <ItemDial
            tab_id={this.props.tab_id}
            onGoto={this.props.onGoto} 
            updateFavouriteList={this.props.updateFavouriteList}
            favouriteList={this.props.favouriteList}           
          />
        )}
        {tab_id == 7 && this.canShowMaintenance() && (
          <ItemMaintenance
            tab_id={this.props.tab_id}
            onGoto={this.props.onGoto} 
            updateFavouriteList={this.props.updateFavouriteList}
            favouriteList={this.props.favouriteList}           
          />
        )}
        {tab_id == 8 && (
          <ItemPrint
            tab_id={this.props.tab_id}
            onGoto={this.props.onGoto} 
            updateFavouriteList={this.props.updateFavouriteList}
            favouriteList={this.props.favouriteList}           
          />
        )}
      </BodyWrapper>
    )
  }
}

MenuDialModalBody.contextType = Context;

MenuDialModalBody.propTypes = {
  tab_id: PropTypes.number,
  onGoto: PropTypes.func,
  updateFavouriteList: PropTypes.func,
  favouriteList: PropTypes.array
};

export default MenuDialModalBody;
