import React from "react";
import PropTypes from "prop-types";
import { Flex, Input } from "../../style/common";

const propTypes = {
  fn: PropTypes.func,
  span: PropTypes.string,
  name: PropTypes.string
};

const CategoryContent = ({ fn, span, name }) => {
  return (
    <div className="categoryContent">
      <Flex>
        <Input type="checkbox" name={name} onChange={fn} />
        <span>{span}</span>
      </Flex>
    </div>
  );
};

CategoryContent.propTypes = propTypes;

export default CategoryContent;
