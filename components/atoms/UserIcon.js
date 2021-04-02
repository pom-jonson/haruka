import Img from "../_demo/small_user_icon.png";
import styled from "styled-components";
import { surface } from "../_nano/colors";

const Icon = styled.img`
  background-color: ${surface};
  display: inline-block;
  width: ${({ w }) => w};
  height: ${({ h }) => h};
`;
Icon.defaultProps = {
  src: Img,
  w: "28px",
  h: "auto"
};

export default Icon;
