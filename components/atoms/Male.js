import React from "react";
import styled from "styled-components";

const TagMale = styled.div`
  border-radius: 2px;
  border: 1px solid #9eaeda;
  box-sizing: border-box;
  color: #9eaeda;
  display: inline-block;
  font-size: 11px;
  font-family: NotoSansJP;
  text-align: center;
  letter-spacing: 2.18px;
  width: 38.3px;
`;

function Male() {
  return <TagMale>男性</TagMale>;
}

export default Male;
