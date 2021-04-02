import React from "react";
import PropTypes from "prop-types";

const ExamineButton = ({ examining, onClick }) => {
  return examining ? (
    <button onClick={onClick} type="button" className="btn btn-danger">
      診察終了
    </button>
  ) : (
    <button onClick={onClick} type="button" className="btn btn-primary">
      診察開始
    </button>
  );
};
ExamineButton.propTypes = {
  examining: PropTypes.bool,
  onClick: PropTypes.func
};
export default ExamineButton;
