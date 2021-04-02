import React from "react";
import styled from "styled-components";

const TagFemale = styled.div`
  border-radius: 2px;
  border: 1px solid #f0baed;
  box-sizing: border-box;
  color: #f0baed;
  display: inline-block;
  font-size: 11px;
  font-family: NotoSansJP;
  text-align: center;
  letter-spacing: 2.18px;
  width: 38.3px;
`;

function Female() {
  return <TagFemale>女性</TagFemale>;
}

export default Female;
