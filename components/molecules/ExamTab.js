import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Item = styled.li`
  font-family: NotoSansJP;
  font-size: 12px;  
  border: 1px solid rgb(136,136,136);
  border-radius: 7px 7px 0px 0px;  
  .active{
    background: rgb(160, 235, 255) !important;
  }
`;

const ExamTab = props => (
  <Item className="nav-item" onClick={props.selectTab}>
    <div id={props.id} className={`nav-link ${props.active ? "active" : ""}`}>
      {props.name}
    </div>
  </Item>
);

ExamTab.propTypes = {
  selectTab: PropTypes.func,
  id: PropTypes.number,
  active: PropTypes.bool,
  name: PropTypes.string
};

export default ExamTab;
