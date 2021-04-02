import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import axios from "axios";
import SelectorWithLabel from "../molecules/SelectorWithLabel";
import InputWithErrorLabel from "../molecules/InputWithErrorLabel";
import Button from "../atoms/Button";

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
    & > button {
      display: block;
      width: auto;
      margin: 10px auto;
    }
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

  table {
    font-size: 14px;
    vertical-align: middle;
    width: 100%;
  }

  th {
    background-color: ${colors.midEmphasis};
    color: ${colors.surface};
    text-align: center;
    font-weight: normal;
  }

  th,
  td {
    border: 1px solid ${colors.background};
    padding: 4px 8px;
  }
`;

const options = [
  {
    id: "O",
    value: "O"
  },
  {
    id: "A",
    value: "A"
  },
  {
    id: "B",
    value: "B"
  },
  {
    id: "AB",
    value: "AB"
  }
];

const init_errors = {
  irregular_antibody: "",
  height: "",
  weight: "",
  BMI: ""
};

const init_state = {
  blood_type: "O",
  irregular_antibody: "",
  height: "",
  weight: "",
  BMI: "",
  errors: init_errors
};

class PatientBaseInfoPopup extends Component {
  constructor(props) {
    super(props);
    this.state = init_state;
  }

  getSelect = e => {
    this.setState({
      blood_type: e.target.id
    });
  };

  getAntiBody = e => {
    this.setState({
      irregular_antibody: e.target.value
    });
  };

  getHeight = e => {
    this.setState({
      height: e.target.value
    });
  };

  getWeight = e => {
    this.setState({
      weight: e.target.value
    });
  };

  upDateErrors = errors => {
    if (errors == [] || errors == "") {
      return;
    } else {
      const update_errors = Object.assign({}, init_errors);
      for (const key in this.state.errors) {
        const error_key = "patient_base_data." + key;
        if (errors.hasOwnProperty(error_key)) {
          const obj = {};
          obj[key] = errors[error_key][0];
          Object.assign(update_errors, obj);
        }
      }
      this.setState({ errors: update_errors });
    }
  };

  updatePatientBaseInfo = async () => {
    const { data } = await axios.get("/app/api/v2/height_weight/find/latest", {
      params: {
        patient_id: this.props.patientId
      }
    });
    return data;
  };

  reset = () => {
    const update_state = Object.assign({}, init_state);
    this.setState(update_state);
  };

  register = () => {
    var basicInfo = {
      patient_base_data: {
        patient_id: this.props.patientId,
        blood_type: this.state.blood_type,
        irregular_antibody: this.state.irregular_antibody,
        height: this.state.height,
        weight: this.state.weight
      }
    };
    if (confirm("登録して良いですか？")) {
      this.registerOfPatientBaseInfo(basicInfo);
    }
  };

  registerOfPatientBaseInfo = async basicInfo => {
    const { data } = await axios.post(
      "/app/api/v2/patient_base_data/register",
      basicInfo
    );
    if (data.status == "ok") {
      this.reset();
      const patientBasicInfo = await this.updatePatientBaseInfo();
      this.setState({ BMI: patientBasicInfo.BMI });
    } else {
      // filed
      this.upDateErrors(data.errors);
    }
  };

  async componentDidMount() {
    const patientBasicInfo = await this.updatePatientBaseInfo();
    this.setState({ BMI: patientBasicInfo.BMI });
  }

  render() {
    return (
      <Popup>
        <div className="flex">
          <h2>患者基礎情報入力</h2>
        </div>
        <div className="flex">
          <div className="left-content">
            <SelectorWithLabel
              title="血液型"
              options={options}
              getSelect={this.getSelect}
              departmentEditCode={this.state.blood_type}
            />
            <InputWithErrorLabel
              label="不規則対"
              type="text"
              placeholder="不規則対"
              getInputText={this.getAntiBody}
              diseaseEditData={this.state.irregular_antibody}
              error={this.state.errors.irregular_antibody}
              handleKeyPress={() => {}}
            />
            <InputWithErrorLabel
              label="身長"
              type="text"
              placeholder="185.00"
              getInputText={this.getHeight}
              diseaseEditData={this.state.height}
              error={this.state.errors.height}
              handleKeyPress={() => {}}
            />
            <InputWithErrorLabel
              label="体重"
              type="text"
              placeholder="80.00"
              getInputText={this.getWeight}
              diseaseEditData={this.state.weight}
              error={this.state.errors.weight}
              handleKeyPress={() => {}}
            />
            <InputWithErrorLabel
              label="BMI"
              type="text"
              disabled="true"
              diseaseEditData={this.state.BMI}
              handleKeyPress={() => {}}
            />
            <Button onClick={this.register}>登録</Button>
          </div>
        </div>
      </Popup>
    );
  }
}

PatientBaseInfoPopup.propTypes = {
  patientId: PropTypes.number
};

export default PatientBaseInfoPopup;
