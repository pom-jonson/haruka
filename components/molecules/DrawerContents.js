import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { secondary } from "../_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/pro-regular-svg-icons";

const Ul = styled.ul`
  display: inline-block;
  padding-left: 0px;
  padding-top: 8px;
  margin-left: 21px;
  list-style: none;
  width: 310px;
  height: 273px;
  border-radius: 4px;
  box-shadow: 1px 1px 0 0 rgba(223, 223, 223, 0.5);
`;

const Li = styled.li`
  margin-top: 8px;
`;

const Pin = styled(FontAwesomeIcon)`
  display: inline-block;
  margin-left: auto;
  padding-right: 8px;
  font-size: 30px;
  cursor: pointor;
  margin-right: 8px;
`;

const TextCopy10 = styled.div`
  width: 25px;
  height: 16px;
  font-size: 8px;
  line-height: 1.33;
  letter-spacing: 0.4px;
  display: inline-block;
`;

const propTypes = {
  listText: PropTypes.string.isRequired
};

function DrawerContentsList({ listText }) {
  return (
    <Li className="row">
      <TextCopy10>{listText}</TextCopy10>
      <Pin icon={faThumbtack} color={secondary} />
    </Li>
  );
}

DrawerContentsList.propTypes = propTypes;

const DrawerContentsListTexts = [
  "処方",
  "注射",
  "放射線検査",
  "臨床検査",
  "生理検査",
  "超音波検査",
  "透析",
  "指導管理依頼",
  "輸血"
];

function DrawerContents() {
  return (
    <Ul className="flex-column">
      {DrawerContentsListTexts.map((listText, key) => {
        <DrawerContentsList listText={listText} key={key} />;
      })}
    </Ul>
  );
}

export default DrawerContents;
