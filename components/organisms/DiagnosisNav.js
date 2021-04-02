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

const diagnosis = [
  {
    id: 0,
    name: "無"
  },
  {
    id: 1,
    name: "(麻)"
  },
  {
    id: 2,
    name: "(毒)"
  },
  {
    id: 3,
    name: "(覚)"
  },
  {
    id: 5,
    name: "(向)"
  },
  {
    id: 9,
    name: "(生)"
  }
];

const InOutNav = ({ selectDiagnosis, id }) => {
  const usages = diagnosis.map(usage => (
    <UsageTab
      key={usage.id}
      id={usage.id}
      active={usage.id === id}
      name={usage.name}
      selectTab={selectDiagnosis}
    />
  ));

  return <Ul className="nav nav-tabs">{usages}</Ul>;
};

InOutNav.propTypes = {
  id: PropTypes.number,
  selectDiagnosis: PropTypes.func
};

export default InOutNav;
