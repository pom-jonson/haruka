import React from "react";
import PropTypes from "prop-types";

const PriorityChanger = ({ priority = 4, onClick }) => (
  <div className="btn-group">
    <button
      onClick={() => onClick(4)}
      className={`btn btn-sm btn-${priority === 4 ? "info" : "dark"}`}
    >
      一般
    </button>
    <button
      onClick={() => onClick(5)}
      className={`btn btn-sm btn-${priority === 5 ? "warning" : "dark"}`}
    >
      注意
    </button>
    <button
      onClick={() => onClick(6)}
      className={`btn btn-sm btn-${priority === 6 ? "danger" : "dark"}`}
    >
      重大
    </button>
  </div>
);
PriorityChanger.propTypes = {
  priority: PropTypes.number,
  onClick: PropTypes.func
};

export default PriorityChanger;
