import React from "react";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import styled from "styled-components";
import UsageTab from "../molecules/UsageTab";

const Ul = styled.ul`
  text-align: center;
  width: 100%;

  &.nav {
    padding-left: 8px;
  }

  > li > div {
    cursor: pointer;
    padding: 8px;
  }

  > li > a {
    color: #bbbbbb;
    padding: 4px 14px;
  }

  > li > a.active {
    color: ${colors.onSurface};
  }

  .nav-item:hover{
    background: rgb(160, 235, 255) !important;
  }
  .active:hover{
    background: rgb(160, 235, 255) !important;
  }
`;

const UsageKindNav = ({ selectUsageKind, id, diagnosis }) => {
  const usages = diagnosis.map(usage => (
    <UsageTab
      key={usage.id}
      id={usage.id}
      active={usage.id === id}
      name={usage.name}
      selectTab={selectUsageKind}
    />
  ));

  return (
    <>
      <Ul className="nav nav-tabs">{usages.slice(0, 4)}</Ul>
      <Ul className="nav nav-tabs">{usages.slice(4)}</Ul>
    </>
  );
};

UsageKindNav.propTypes = {
  selectUsageKind: PropTypes.func,
  id: PropTypes.number,
  diagnosis: PropTypes.array
};

export default UsageKindNav;
