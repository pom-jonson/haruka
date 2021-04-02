import styled from "styled-components";
import * as colors from "../components/_nano/colors";

export const Flex = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const Input = styled.input`
  border: 1px solid #ced4da;
  border-radius: 4px;
  color: ${colors.onSurface};
  font-family: NotoSansJP;
  font-size: 14px;
  text-align: center;
  width: 50px;
  height: 38px;
`;
