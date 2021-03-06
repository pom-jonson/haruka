import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";

const Item = styled.li`
  cursor: pointer;
`;

const PageNav = ({ items, location: { pathname } }) => (
  <ul>
    {items.map(({ route, displayName }) => (
      <Item key={route} className="nav-item">
        <Link
          to={route}
          className={`nav-link ${route === pathname ? "active" : ""}`}
        >
          {displayName}
        </Link>
      </Item>
    ))}
  </ul>
);
PageNav.propTypes = {
  items: PropTypes.array,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};
export default withRouter(PageNav);
