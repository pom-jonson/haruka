import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import TitleTabItem from "../atoms/TitleTabItem";

const Ul = styled.ul`
  width: 100%;
  &.nav {
    padding-left: 0px;
  }
`;

class TitleTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const tabs = this.props.tabs.map(tab => (
      <TitleTabItem
        key={tab.id}
        tab_id={tab.id}
        selected_id={this.props.id}
        title={tab.title}
        selectTitleTab={this.props.selectTitleTab}
        tabType={this.props.tabType}
        contextMenuAction={this.props.contextMenuAction}
      />
    ));

    return <Ul className="nav nav-tabs">{tabs}</Ul>;
  }
}

TitleTabs.propTypes = {
  title: PropTypes.string,
  tabType: PropTypes.string,
  tabs: PropTypes.array,
  id: PropTypes.number,
  selectTitleTab: PropTypes.func,
  contextMenuAction: PropTypes.func,
};

export default TitleTabs;
