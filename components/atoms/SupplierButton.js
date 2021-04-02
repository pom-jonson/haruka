import React from "react";
import PropTypes from "prop-types";

const SupplierButton = ({ supplyPlace, fn, title, condition }) => {
  return (
    <button
      onClick={fn}
      type="button"
      className={`btn btn-${supplyPlace === null ? "outline-" : ""}${
        supplyPlace === condition ? "primary" : "secondary"
      }`}
    >
      {title}
    </button>
  );
};

SupplierButton.propTypes = {
  image: PropTypes.string,
  supplyPlace: PropTypes.string,
  fn: PropTypes.func,
  title: PropTypes.string,
  condition: PropTypes.string
};

export default SupplierButton;
