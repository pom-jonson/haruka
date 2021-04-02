import React, { Component } from "react";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import styled from "styled-components";
import UsageTab from "../molecules/UsageTab";

const Ul = styled.ul`
  width: 100%;

  &.nav {
    border-bottom: none;
    padding-left: 8px;
  }

  > li > div {
    background-color: ${colors.surface};
    box-shadow: 0 -1px 0 0 #e3e3e3, -1px 0 0 0 #e3e3e3, 1px 0 0 0 #e3e3e3,
      0 1px 0 0 ${colors.onSecondaryLight};
    color: #bbbbbb;
    cursor: pointer;
    padding: 4px 14px;

    &.nav-link.active,
    &.nav-link:hover,
    &.nav-link:focus {
      border-color: transparent;
      color: ${colors.onSurface};
    }
  }
`;

const usagesData = [
  {
    id: 1,
    name: "処方歴"
  },
  {
    id: 2,
    name: "投薬"
  }
];

class PrescriptionNav extends Component {
  constructor(props) {
    super(props);
    this.selectTab = this.selectTab.bind(this);
  }

  selectTab(e) {
    this.props.getTabId(e.target.id);
  }

  render() {
    const usages = usagesData.map(usage => (
      <UsageTab
        key={usage.id}
        id={usage.id}
        name={usage.name}
        selectTab={this.selectTab}
      />
    ));

    return <Ul className="nav nav-tabs">{usages}</Ul>;
  }
}

PrescriptionNav.propTypes = {
  getTabId: PropTypes.func
};
export default PrescriptionNav;
