import React from "react";
import PropTypes from "prop-types";
import { onSurface } from "../_nano/colors";
import styled from "styled-components";
import UsageTab from "../molecules/UsageTab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltSquareDown } from "@fortawesome/pro-solid-svg-icons";

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
    color: ${onSurface};
  }
`;

const DIV = styled.div`
  padding: 0 10px 10px 40px;
  width: 100%;
  font-size: 14px;
  font-family: "Noto Sans JP", sans-serif;
  position: relative;

  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    &:first-child {
      color: #ff0000;
    }
    &:last-child {
      color: #0000ff;
    }

    li {
      line-height: 1.3;
    }

    .date {
      width: 150px;
    }

    .doctor-name {
      width: calc(100% - 250px);
    }

    .department-name{
      text-align: right;
      width: 150px;
    }
  }
`;

const Arrow = styled(FontAwesomeIcon)`
  color: #000;
  display: block;
  font-size: 36px;
  line-height: 1.3;
  position: absolute;
  top: 0;
  left: 0;
`;

const propTypes = {
  tabObj: PropTypes.object.isRequired
};

function ChangeLog({ tabObj }) {
  return (
    <ul>
      <li className="date">{tabObj.date}</li>
      <li className="doctor-name">
        {tabObj.substitute_name !== "" && tabObj.substitute_name != undefined
          ? "依頼医: " +
            tabObj.doctor_name +
            "、 入力者: " +
            tabObj.substitute_name
          : tabObj.doctor_name}
      </li>
      <li className="department-name">診療科: {tabObj.department_name}</li>
    </ul>
  );
}

ChangeLog.propTypes = propTypes;

const ChangeLogTab = ({ selectTab, id, tabs }) => {
  const usages = tabs.map(tab => (
    <UsageTab
      key={tab.id}
      id={tab.id}
      active={tab.id === id}
      name={tab.label}
      selectTab={selectTab}
    />
  ));

  return (
    <div>
      <DIV>
        <ChangeLog tabObj={tabs[id].old} />

        <Arrow icon={faArrowAltSquareDown} />

        <ChangeLog tabObj={tabs[id].latest} />
      </DIV>
      <Ul className="nav nav-tabs">{usages}</Ul>
    </div>
  );
};

ChangeLogTab.propTypes = {
  selectTab: PropTypes.func,
  id: PropTypes.number,
  tabs: PropTypes.array
};

export default ChangeLogTab;
