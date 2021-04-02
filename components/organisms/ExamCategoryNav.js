import React from "react";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import styled from "styled-components";
import ExamTab from "../molecules/ExamTab";

const Ul = styled.ul`
  text-align: center;
  width: 100%;
  border: none;

  &.nav {
    padding-left: 3px;
  }  

  > li > div {
    cursor: pointer;
    padding: 3px;
  }

  > li > a {
    color: #bbbbbb;
    padding: 4px 14px;
  }

  > li > a.active {
    color: ${colors.onSurface};    
  }
`;

const ExamCategoryNav = ({ selectUsageKind, id, diagnosis }) => {
  const usages = diagnosis.map(usage => (
    <ExamTab
      key={usage.id}
      id={usage.id}
      active={usage.id == id}
      name={usage.name}
      selectTab={selectUsageKind}
    />
  ));

  return (    
    <>
      <Ul className="nav nav-tabs">{usages}</Ul>
    </>
  );
};

ExamCategoryNav.propTypes = {
  selectUsageKind: PropTypes.func,
  id: PropTypes.number,
  diagnosis: PropTypes.array
};

export default ExamCategoryNav;
