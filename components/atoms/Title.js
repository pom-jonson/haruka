import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { secondary, onSurface } from "../_nano/colors";

const H2 = styled.h2`
  border-left: 4px solid ${secondary};
  color: ${onSurface};
  font-family: NotoSansJP;
  font-size: 14px;
  padding-left: 4px;
`;

const propTypes = {
  title: PropTypes.string,
  allPrescriptionOpen: PropTypes.func.isRequired,
  menuType: PropTypes.string,
  fnMouseDown: PropTypes.func
};

const defaultProps = {
  title: ""
};

class Title extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title
    }
    this.titleCheck = this.titleCheck.bind(this);
  }

  titleCheck(title) {
    if (title === "処方歴") {
      this.props.allPrescriptionOpen();
    }
  }

  testTitleRender = (strTitle) =>{
    this.setState({
      title: strTitle != "" && strTitle != undefined ? strTitle : this.props.title
    });
  }

  render() {
    return (
      <H2 onClick={() => this.titleCheck(this.state.title)} onMouseDown={(e) => this.props.fnMouseDown(e, this.props.menuType)}>
        {this.state.title}
      </H2>
    );
  }
}

Title.propTypes = propTypes;
Title.defaultProps = defaultProps;

export default Title;
