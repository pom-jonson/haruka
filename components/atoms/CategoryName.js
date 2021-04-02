import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { midEmphasis } from "../_nano/colors";

const Title = styled.div`
  color: ${midEmphasis};
  font-family: OpenSans;
  font-size: 20px;
  font-weight: 600;
  transform: rotate(-90deg);
  line-height: 0.8;
  letter-spacing: 0.7px;
  position: absolute;
`;

const propTypes = {
  categoryName: PropTypes.string
};

const defaultProps = {
  categoryName: ""
};

function CategoryName({ categoryName }) {
  return <Title className="category-name">{categoryName}</Title>;
}

CategoryName.propTypes = propTypes;
CategoryName.defaultProps = defaultProps;

export default CategoryName;
