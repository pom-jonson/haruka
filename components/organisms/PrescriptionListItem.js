import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";

const ListItemWrapper = styled.div`
  background-color: ${colors.onSecondaryLight};
  border: solid 1px ${colors.disable};
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 35px;
  padding-right: 16px;

  .name {
    font-size: 14px;
    padding-left: 16px;
    line-height: 35px;
  }

  .order-date {
    margin-right: 16px;
  }

  &.open {
    .name {
      border-left: 8px solid ${colors.error};
      margin: -1px 0 0 -1px;
    }

    .angle {
      transform: rotate(180deg);
    }
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;

  .login-user {
    margin-right: 20px;
  }
`;

const Angle = styled(FontAwesomeIcon)`
  color: ${colors.onSurface};
  cursor: pointer;
  display: inline-block;
  font-size: 20px;
`;

class PrescriptionListItem extends Component {
  render() {
    return (
      <ListItemWrapper className="row open">
        <div className="name">患者 太郎</div>
        <Flex>
          <span className="order-date">2019年3月3日 15:15</span>
          <Angle className="angle" icon={faAngleDown} />
        </Flex>
      </ListItemWrapper>
    );
  }
}

export default PrescriptionListItem;
