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

class PatientDetailPopup2 extends Component {
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
              label={this.props.label_positive}
              getRadio={this.getRadio.bind(this)}
              value={this.props.status_positive}
              name={this.props.name_positive}
              img={this.props.img_positive}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Checkbox
              label={this.props.label_no}
              getRadio={this.getRadio.bind(this)}
              value={this.props.status_no}
              name={this.props.name_no}
              img={this.props.img_no}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Checkbox
              label={this.props.label_unknown}
              getRadio={this.getRadio.bind(this)}
              value={this.props.status_unknown}
              name={this.props.name_unknown}
              img={this.props.img_unknown}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <Checkbox
              label={this.props.label_negative}
              getRadio={this.getRadio.bind(this)}
              value={this.props.status_negative}
              name={this.props.name_negative}
              img={this.props.img_negative}
            />
          </div>
        </div>
      </Popup>
    );
  }
}

PatientDetailPopup2.propTypes = {
  title: PropTypes.string,
  label_positive: PropTypes.string,
  label_no: PropTypes.string,
  label_unknown: PropTypes.string,
  label_negative: PropTypes.string,
  status_positive: PropTypes.bool,
  status_no: PropTypes.bool,
  status_unknown: PropTypes.bool,
  status_negative: PropTypes.bool,
  img_positive: PropTypes.object,
  img_no: PropTypes.object,
  img_unknown: PropTypes.object,
  img_negative: PropTypes.object,
  name_positive: PropTypes.string,
  name_no: PropTypes.string,
  name_unknown: PropTypes.string,
  name_negative: PropTypes.string,
  getRadio: PropTypes.func
};

export default PatientDetailPopup2;
