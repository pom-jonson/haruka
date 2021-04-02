import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import {Dial_tab_index, compareTwoObjects} from "~/helpers/dialConstants";
import Context from "~/helpers/configureStore";

const Ul = styled.ul`
  width: calc(100% - 9.3rem);
  &.nav {
    padding-left: 0rem;
    margin-bottom: 0rem;
    border-bottom: none;
    padding-bottom: 0.625rem;
    padding-right:0;
  }
`;

const Li = styled.li`
  // font-family: NotoSansJP;
  font-size: 1rem;
  // padding-bottom: 0.2rem;
  // padding-top: 0.2rem;
  vertical-align:middle;
  padding-right:0;
  padding-left:0;
  padding-top:0.2rem;
  padding-bottom:0rem;
  &.nav-link {
    width: 4.9rem;
    border: solid 1px;
    border-radius:0px;
  }
  &.active {
    h2{
      // font-weight: bold;
      border:3px dotted black;
      cursor: auto;
    }
    color: ${colors.onSurface};
    border-left: solid 1px #00f;
    border-bottom: none;
    border-right: solid 1px #00f;
    border-top: solid 1px #00f;
    border-color: #00f !important;
    outline: none;
    box-shadow: #888 0px -4px 4px 1px;
  }
  &:hover {
    cursor: pointer;
  }
`;

const H2 = styled.h2`
  color: ${colors.onSurface};
  font-family: NotoSansJP;
  font-size: 0.77rem;
  line-height: 1.5rem;
  margin-bottom: 0px;
  text-align:center;
  letter-spacing:1px;
`;

class DialTitleTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {};    
    this.prev_props = JSON.parse(JSON.stringify(this.props));
  }

  shouldComponentUpdate(nextprops, nextstate) {    
    nextprops = JSON.parse(JSON.stringify(nextprops));    
    if (compareTwoObjects(nextprops, this.prev_props) && compareTwoObjects(nextstate, this.state)) return false;
    this.prev_props = JSON.parse(JSON.stringify(nextprops));        
    return true;
  }
  
  setTabColor = (color_value, selected_flag) => {
    let tab_color = selected_flag?"transparent": '#efefef';
    if (color_value === 1) tab_color = "#0278d7";
    if (color_value === 2) tab_color = "#ff6a6a";
    return tab_color
  };
  
  selectTab =(tab_id)=>{
    this.props.selectTitleTab(tab_id);
  }
  
  render() {
    return <Ul className="nav nav-tabs">
      {this.props.tabs.map(tab=>{
        if(tab.id == Dial_tab_index.MyCalendar &&
          (!this.context.$canDoAction(this.context.FEATURES.MyCalendar, this.context.AUTHS.EDIT, 0) &&
            !this.context.$canDoAction(this.context.FEATURES.MyCalendar, this.context.AUTHS.EDIT, 0) &&
            !this.context.$canDoAction(this.context.FEATURES.MyCalendar, this.context.AUTHS.DELETE, 0)
          )){
          return (<></>);
        } else {
          return (
            <Li
              key={tab.id}
              onClick={this.selectTab.bind(this, tab.id)}
              className={`nav-link ${tab.id === this.props.id ? "active" : ""}`}
              style={{background: this.setTabColor(tab.tab_color, tab.id == this.props.id)}}
            >
              <H2 id={tab.id}>{tab.title}</H2>
            </Li>
          )
        }
      })}
    </Ul>;
  }
}

DialTitleTabs.contextType = Context;
DialTitleTabs.propTypes = {
  tabs: PropTypes.array,
  id: PropTypes.number,
  selectTitleTab: PropTypes.func,
};
export default DialTitleTabs;
