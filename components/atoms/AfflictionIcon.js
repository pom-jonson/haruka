import React from "react";
import PropTypes from "prop-types";

const AfflictionIcon = ({ image }) => {
  return (
    <div className="icon">
      <img src={image} />
    </div>
  );
};

AfflictionIcon.propTypes = {
  image: PropTypes.string
};

export default AfflictionIcon;
