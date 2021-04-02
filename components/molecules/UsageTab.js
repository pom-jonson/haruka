import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Item = styled.li`
  font-family: NotoSansJP;
  font-size: 12px;
`;

const UsageTab = props => (
  <Item className="nav-item" onClick={props.selectTab}>
    <div id={props.id} className={`nav-link ${props.active ? "active" : ""}`}>
      {props.name}
    </div>
  </Item>
);

UsageTab.propTypes = {
  selectTab: PropTypes.func,
  id: PropTypes.number,
  active: PropTypes.bool,
  name: PropTypes.string
};

export default UsageTab;
