import React from "react";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import styled from "styled-components";
import UsageTab from "../molecules/UsageTab";

const Ul = styled.ul`
  width: 100%;

  &.nav {
    padding-left: 8px;
  }

  > li > div {
    cursor: pointer;
  }

  > li > a {
    color: #bbbbbb;
    padding: 4px 14px;
  }

  > li > a.active {
    color: ${colors.onSurface};
  }
`;

const usagesData = [
  {
    id: 1,
    name: "内服"
  },
  {
    id: 2,
    name: "頓服"
  },
  {
    id: 3,
    name: "外用"
  },
  {
    id: 4,
    name: "自己注射"
  }
];

const UsageNav = ({ id, selectTab }) => {
  const usages = usagesData.map(usage => (
    <UsageTab
      key={usage.id}
      id={usage.id}
      active={usage.id === id}
      name={usage.name}
      selectTab={selectTab}
    />
  ));

  return <Ul className="nav nav-tabs">{usages}</Ul>;
};

UsageNav.propTypes = {
  id: PropTypes.number,
  selectTab: PropTypes.func
};

export default UsageNav;
