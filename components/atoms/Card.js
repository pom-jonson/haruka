import styled from "styled-components";
import { surface, onSurface, secondary } from "../_nano/colors";

const PatientCardWrapper = styled.div`
  border-radius: 4px;
  box-shadow: 1px 1px 0 0 rgba(223, 223, 223, 0.5);
  background-color: ${surface};

  &.balloon {
    color: ${onSurface};
    font-size: 12px;
    margin-left: 16px;
    padding: 8px 32px 8px 16px;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      top: 50%;
      left: -16px;
      margin-top: -8px;
      border: 8px solid transparent;
      border-right: 8px solid ${surface};
    }

    &.todo {
      color: ${secondary};
      font-size: 20px;
    }
  }

  dl {
    display: flex;
    font-size: 12px;
    line-height: 1.3;
    letter-spacing: 0.4px;
    margin: 8px 0;
  }

  dt {
    font-weight: normal;
  }

  dd {
    margin: 0 0 0 16px;
  }
`;

export default PatientCardWrapper;
