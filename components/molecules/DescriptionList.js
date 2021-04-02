import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";

const Dl = styled.dl`
  border-bottom: solid 1px ${colors.disable};
  color: ${colors.onSecondaryDark};
  font-family: NotoSansJP;
  font-size: 14px;
  padding-bottom: 10px;

  dt {
    font-weight: normal;
  }

  dd {
    font-size: 12px;
    letter-spacing: 0.1px;
    margin: 0 0 0 16px;
  }
`;

const DescriptionList = props => (
  <Dl>
    <dt>{props.dtName}</dt>
    <dd>{props.ddName}</dd>
  </Dl>
);

DescriptionList.propTypes = {
  dtName: PropTypes.string,
  ddName: PropTypes.string
};

export default DescriptionList;
