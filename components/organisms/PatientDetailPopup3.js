import React, { Component } from "react";
import PropTypes from "prop-types";
import Checkbox from "../molecules/Checkbox";
import styled from "styled-components";
import * as colors from "../_nano/colors";

const Popup = styled.div`
  .flex {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  h2 {
    color: ${colors.onSurface};
    font-size: 17px;
    font-weight: 500;
    margin: 6px 0;
  }

  .left-content {
    width: 55%;
  }

  .right-content {
    width: 43%;
  }

  label {
    margin: 0;
  }

  .label-title {
    text-align: right;
    width: 70px;
    line-height: 38px;
    margin-right: 8px;
  }

  select,
  input {
    width: 250px;
  }

  .disease-name {
    div,
    button {
      display: inline-block;
    }

    button {
      min-width: auto;
      margin-left: 8px;
    }
  }

  .result-list {
    width: 250px;
    padding: 0;
    margin: 0 0 0 78px;
    li {
      background-color: ${colors.secondary200};
      border: 1px solid ${colors.background};
      font-size: 14px;
      list-style-type: none;
      padding: 4px 8px;
      margin-top: -1px;
    }
  }
`;

class PatientDetailPopup3 extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getRadio = (name, value) => {
    this.props.getRadio(name, value);
  };

  render() {
    return (
      <Popup>
        <div className="flex">
          <h2>{this.props.title}</h2>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Checkbox
              label={this.props.label}
              getRadio={this.getRadio.bind(this)}
              value={this.props.status}
              name={this.props.name}
              img={this.props.img}
            />
          </div>
        </div>
      </Popup>
    );
  }
}

PatientDetailPopup3.propTypes = {
  title: PropTypes.string,
  label: PropTypes.string,
  status: PropTypes.bool,
  img: PropTypes.object,
  name: PropTypes.string,
  getRadio: PropTypes.func
};

export default PatientDetailPopup3;
