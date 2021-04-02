import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import Context from "~/helpers/configureStore";
import Checkbox from "../molecules/Checkbox";

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
    float: left;
    text-align: right;
    width: 70px;
    line-height: 38px;
    margin-right: 8px;
  }

  select,
  input {
    width: 250px;
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
    label {
      color: ${colors.surface};
    }
    word-break: keep-all;
  }

  th,
  td {
    border: 1px solid ${colors.background};
    padding: 4px 8px;    
  }
  .no-break{
    word-break: keep-all;
  }

  .center {
    text-align: center;
    button {
      height: 25px;
      padding: 0;
      line-height: 25px;
      span {
        color: ${colors.surface};
      }
    }

    span {
      color: rgb(241, 86, 124);
    }

    .black {
      color: #000;
    }
  }

  .red {
    color: rgb(241, 86, 124);
  }

  .right {
    text-align: right;
  }
`;

class DiseaseConsentPopup extends Component {
  constructor(props) {
    super(props);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.state = {
      departmentOptions,
      diseaseList: this.props.diseaseList,
      authInfo: authInfo,
      allChecked: false
    };
  }

  async componentDidMount() {
    let diseaseList = this.props.diseaseList;
    let allChecked = true;
    diseaseList.map(item => {
      item.checked = item.is_doctor_consented === 0 ? false : true;
      if (item.checked === false) {
        allChecked = false;
      }
    });
    this.setState({ diseaseList, allChecked });
  }

  getDepartmentName = code => {
    let name = "";
    this.state.departmentOptions.map(item => {
      if (item.id === parseInt(code)) {
        name = item.value;
      }
    });
    return name;
  };

  getRadio = (name, value) => {
    if (name === "notConsentedDataOneSelect") {
      let diseaseList = this.state.diseaseList;
      let allChecked = true;
      diseaseList.map(item => {
        if (item.number === value) {
          item.checked = !item.checked;
        }
        if (item.checked === false) {
          allChecked = false;
        }
      });

      this.setState({ diseaseList, allChecked });
    } else if (name === "notConsentedDataAllSelect") {
      let allChecked = !this.state.allChecked;
      let diseaseList = this.state.diseaseList;
      diseaseList.map(item => {
        item.checked = allChecked;
      });
      this.setState({ diseaseList, allChecked });
    }
  };

  render() {
    return (
      <Popup>
        {this.context.$canDoAction(
          this.context.FEATURES.DISEASE,
          this.context.AUTHS.CONFIRM
        ) && (
          <>
            <div className="flex">
              <h2>病名一覧</h2>
            </div>
            <div className="flex">
              <table>
                <tr>
                  <th>
                    <Checkbox
                      label=""
                      getRadio={this.getRadio.bind(this)}
                      value={this.state.allChecked}
                      name="notConsentedDataAllSelect"
                    />
                  </th>
                  <th>患者ID</th>
                  <th>診療科</th>
                  <th style={{minWidth:'130px'}}>名前</th>
                  <th>病名</th>
                  <th style={{minWidth:'90px'}}>開始日</th>
                  <th style={{minWidth:'150px'}}>入力者</th>
                </tr>
                {this.state.diseaseList != undefined ? (
                  this.state.diseaseList.map(disease => (
                    <tr key={disease.number}>
                      {disease.is_doctor_consented === 0 ? (
                        <td className="center">
                          {this.context.$canDoAction(
                            this.context.FEATURES.DISEASE,
                            this.context.AUTHS.CONFIRM
                          ) ? (
                            <Checkbox
                              ref={ref => (this.selectAll = ref)}
                              label=""
                              getRadio={this.getRadio.bind(this)}
                              value={disease.checked}
                              number={disease.number}
                              name="notConsentedDataOneSelect"
                            />
                          ) : (
                            <span className="red">未承認</span>
                          )}
                        </td>
                      ) : (
                        <td className="center">
                          <span className="black">承認済み</span>
                        </td>
                      )}
                      <td className='no-break'>{disease.patient_number}</td>
                      <td className='no-break'>{this.getDepartmentName(disease.department_code)}</td>
                      <td className='no-break'>{disease.patient_name}</td>
                      <td>{disease.disease_name}</td>
                      <td className='no-break'>{disease.start_date}</td>
                      <td className='no-break'>{disease.created_by_name}</td>
                    </tr>
                  ))
                ) : (
                  <tr />
                )}
              </table>
            </div>
          </>
        )}
      </Popup>
    );
  }
}
DiseaseConsentPopup.contextType = Context;

DiseaseConsentPopup.propTypes = {
  diseaseList: PropTypes.array
};

export default DiseaseConsentPopup;
