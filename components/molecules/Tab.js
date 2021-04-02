import React from "react";
import styled from "styled-components";
import TabLink from "../molecules/TabLink.js";
import * as activeIndicator from "../_nano/activeIndicator";

const Wrapper = styled.div`
  border-bottom: 1px solid #d6d6d6;
`;

const Ul = styled.ul`
  margin: auto;
`;

const Li = styled.li`
  padding: 0 13px;
  a:hover,
  .drawer:hover {
    ${activeIndicator.activeIndicator};
  }
`;

const Tab = () => (
  <Wrapper>
    <Ul className="nav container">
      <Li>
        <TabLink active={true} LinkText="処方" />
      </Li>
    </Ul>
  </Wrapper>
);

export default Tab;
