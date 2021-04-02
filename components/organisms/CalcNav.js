import React from "react";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import styled from "styled-components";
import UsageTab from "../molecules/UsageTab";

const MedicineLabel = styled.div`
  width: 100%;
  text-align: center;
  font-size: 12px;
  border: 1px solid #000;
  padding: 5px;
  border-radius: 5px;
`;

const Ul = styled.ul`
  width: 100%;
  padding-top: 10px;

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
    name: "数値入力"
  },
  {
    id: 2,
    name: "不均等投与"
  } //,
  // {
  //   id: 3,
  //   name: "部位指定"
  // }
];

const CalcNav = ({ id, selectInOut, showedPresData }) => {
  const usages = usagesData.map(usage => (
    <UsageTab
      key={usage.id}
      id={usage.id}
      active={usage.id === id}
      name={usage.name}
      selectTab={selectInOut}
    />
  ));

  return (
    <>
      {showedPresData !== undefined && (
        <MedicineLabel>{showedPresData.medicineName}</MedicineLabel>
      )}
      <Ul className="nav nav-tabs">{usages}</Ul>
    </>
  );
};

CalcNav.propTypes = {
  id: PropTypes.number,
  selectInOut: PropTypes.func,
  showedPresData: PropTypes.object
};

export default CalcNav;
