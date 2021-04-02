import React, { Component } from "react";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import styled from "styled-components";
import UsageTab from "../molecules/UsageTab";

const Ul = styled.ul`
  width: 649px;

  &.nav {
    padding-left: 8px;
  }

  > li > a {
    color: #bbbbbb;
    padding: 4px 14px;
  }

  > li > a.active {
    color: ${colors.onSurface};
  }
`;

const patientTags = [
  {
    id: 1,
    name: "患者情報"
  },
  {
    id: 2,
    name: "住所情報"
  },
  {
    id: 3,
    name: "保険情報"
  },
  {
    id: 4,
    name: "保険パターン"
  }
];

class DetailedNav extends Component {
  render() {
    const { selectTab } = this.props;
    const tags = patientTags.map(tag => (
      <UsageTab
        key={tag.id}
        id={tag.id}
        name={tag.name}
        selectTab={selectTab}
      />
    ));

    return <Ul className="nav nav-tabs">{tags}</Ul>;
  }
}

DetailedNav.propTypes = {
  selectTab: PropTypes.func
};

export default DetailedNav;
