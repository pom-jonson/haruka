import React from "react";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faEllipsisH } from "@fortawesome/free-solid-svg-icons";

const PagerWrapper = styled.div`
  width: 232px;
  height: 22px;

  &.row {
    margin: auto;
  }

  .col {
    padding: 0 8px;
  }
`;

const StyledFaEllipsisH = styled(FontAwesomeIcon)`
  font-size: 10px;
`;

const AngleLeft = styled(FontAwesomeIcon)`
  transform: rotate(90deg);
  font-size: 14px;
`;

const AngleRight = styled(FontAwesomeIcon)`
  transform: rotate(-90deg);
  font-size: 14px;
`;

const PageBox = styled.div`
  cursor: pointer;
  text-align: center;
  width: 22px;
  font-size: 12px;
  color: ${colors.secondary};
`;

const Pager = () => {
  return (
    <PagerWrapper className="row align-items-center">
      <PageBox className="col">
        <AngleLeft icon={faAngleDown} color={colors.secondary} />
      </PageBox>
      <PageBox className="col">1</PageBox>
      <PageBox className="col">
        <StyledFaEllipsisH icon={faEllipsisH} color={colors.midEmphasis} />
      </PageBox>
      <PageBox className="col">2</PageBox>
      <PageBox className="col">3</PageBox>
      <PageBox className="col">4</PageBox>
      <PageBox className="col">
        <StyledFaEllipsisH icon={faEllipsisH} color={colors.midEmphasis} />
      </PageBox>
      <PageBox className="col">
        <AngleRight icon={faAngleDown} color={colors.secondary} />
      </PageBox>
    </PagerWrapper>
  );
};

export default Pager;
