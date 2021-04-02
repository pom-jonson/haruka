import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAlarmClock,
  faBalanceScaleRight,
  faBullhorn,
  faCalendarAlt,
  faEdit
} from "@fortawesome/pro-regular-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import IconWithCaption from "../molecules/IconWithCaption";

const WrapperItem = styled.div`
  width: 100%;
  padding: 8px;
  position: relative;
  background-color: #ffffff;

  &:hover {
    background-color: ${colors.secondary200};
    cursor: pointer;

    > h3 {
      color: ${colors.secondary};
      text-decoration: underline;
    }
  }
`;

const H3 = styled.h3`
  color: ${colors.onSurface};
  display: inline-block;
  font-family: NotoSansJP;
  font-size: 15px;
  font-weight: 500;
`;

const EditIcon = styled(FontAwesomeIcon)`
  color: ${colors.secondary};
  margin-left: 9px;
`;

const DeleteIcon = styled(FontAwesomeIcon)`
  color: ${colors.secondary};
  position: absolute;
  top: 16px;
  right: 16px;
`;

const PrescribeItem = props => (
  <WrapperItem>
    <H3>{props.medicineName}</H3>
    <EditIcon icon={faEdit} size="xs" />
    <DeleteIcon icon={faTrashAlt} size="xs" />
    <div className="pl-3">
      <IconWithCaption
        icon={faBalanceScaleRight}
        word={`1回${props.amount}${props.unit}`}
      />
      <IconWithCaption icon={faAlarmClock} word={`${props.usageName}`} />
      <IconWithCaption icon={faCalendarAlt} word={`${props.days}日分`} />
      <IconWithCaption icon={faBullhorn} word="2019年3月5日より服用開始" />
    </div>
  </WrapperItem>
);

PrescribeItem.propTypes = {
  medicineName: PropTypes.string,
  amount: PropTypes.number,
  unit: PropTypes.string,
  usageName: PropTypes.string,
  days: PropTypes.number
};

export default PrescribeItem;
