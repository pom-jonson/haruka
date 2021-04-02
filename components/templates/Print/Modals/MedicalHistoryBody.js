import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { formatJapanDateSlash } from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";
import { displayLineBreak } from "~/helpers/dialConstants";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as sessApi from "~/helpers/cacheSession-utils";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1rem;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .content-area {
    height: calc(100% - 80px);
  }
  .left-area {
    width: 30%;
    margin-right: 5%;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    th {
      text-align: center;
    }
    th,
    td {
      padding: 0;
      padding-left: 5px;
      padding-right: 5px;
    }
  }

  .div-style1 {
    display: block;
    overflow: hidden;
    .label-type1 {
      float: left;
      font-size: 1.25rem;
    }
    .label-type2 {
      font-size: 1.25rem;
      float: right;
      cursor: pointer;
    }
  }

  .middle-area {
    width: 30%;
    margin-right: 5%;
    height: 100%;
    .disease-history {
      font-size: 1.25rem;
      overflow-y: auto;
      border: 1px solid #aaa;
      height: 25%;
    }
  }
  .right-area {
    width: 30%;
    height: 100%;
    textarea {
      width: 100%;
      height: 50%;
    }
  }
  .footer {
    text-align: right !important;
    margin-top: 0px !important;
    button span {
      font-size: 1.25rem;
    }
  }
  .selected {
    background: rgb(105, 200, 225) !important;
  }
  .row-item {
    cursor: pointer;
  }
  .row-item:hover {
    background: lightblue !important;
  }

  input:disabled {
    color: black !important;
    background: white;
  }
  select:disabled {
    color: black !important;
    background: white;
    opacity:1;
  }
`;

class MedicalHistoryBody extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
      diagnostic: props.diagnostic,
      past_history: "",
      disease_history: "",
      instruction_doctor_number:
        authInfo.category === 1 ? authInfo.doctor_number : 0,
      disease_codes: [],
      write_date: new Date(),
      selected_history_number: 0,
      alert_messages: "",
      disease_result: "",
      isOpenConfirmModal: false,
      confirm_message: "",
      change_flag: 0
    };
  }

  async UNSAFE_componentWillMount() {
    await this.getDoctors();
    await this.getDiseases();
    await this.setDoctors();
    this.initializeInfo(this.props.patientInfo.system_patient_id);
  }
  
  componentWillUnmount() {
    sessApi.delObjectValue('dial_change_flag', 'medical_history_body');
  }

  componentDidMount() {
    this.setChangeFlag(0);
    if (this.context.selectedDoctor.code > 0) {
      this.setState({
        instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
        directer_name: this.context.selectedDoctor.name,
      });
    }
  }

  setChangeFlag=(change_flag)=>{      
      this.setState({change_flag});
      if (change_flag){
          sessApi.setObjectValue('dial_change_flag', 'medical_history_body', 1)
      } else {
          sessApi.remove('dial_change_flag');
      }
  };

  initializeInfo = (patient_id) => {
    if (patient_id !== 0) {
      this.setState({
        selected_history_number: 0,
        past_history: "",
        disease_history: "",
        instruction_doctor_number: 0,
        disease_codes: [],
        disease_history_data: null,
        write_date: new Date(),
        directer_name: "",
      });
      this.getDiseaseHistoryInfo(patient_id);
      this.setDoctors();
    }
  };

  selectHistory = (number) => {
    let disease_history_data = this.state.disease_history_data;
    let disease_codes_list = this.state.disease_codes_list;
    this.setState({
      selected_history_number: number,
      instruction_doctor_number: disease_history_data[number]["doctor_number"],
      directer_name: this.state.doctor_list_by_number[
        disease_history_data[number]["doctor_number"]
      ],
      past_history: disease_history_data[number][0].past_history,
      disease_history: disease_history_data[number][0].disease_history,
      write_date: disease_history_data[number]["date"],
      disease_codes: disease_codes_list[number],
    });
  };

  async getDiseaseHistoryInfo(patient_id) {
    let path = "/app/api/v2/dial/medicine_information/getDiseaseHistory";
    const post_data = {
      patient_id: patient_id,
    };
    await apiClient
      .post(path, {
        params: post_data,
      })
      .then((res) => {
        if (Object.keys(res).length > 0) {
          var disease_history_data = res[Object.keys(res)[0]];
          var disease_codes_list = {};
          Object.keys(disease_history_data).map((key) => {
            var temp = disease_history_data[key];
            var one_codes_list_array = [];
            temp.map((item) => {
              one_codes_list_array.push(item.disease_name_code);
            });
            disease_codes_list[key] = one_codes_list_array;
            disease_history_data[key]["date"] =
              temp[Object.keys(temp)[0]]["write_date"];
            disease_history_data[key]["doctor_number"] =
              temp[Object.keys(temp)[0]]["doctor_number"];
          });

          this.setState({
            disease_history_data,
            disease_codes_list,
          });
        }
      })
      .catch(() => {});
  }

  handleInsert = () => {
    if(this.state.change_flag == 0){
      return;
    }
    this.props.handleOk(this.state.diagnostic);
  };

  confirmCancel() {
    this.setState({
      alert_messages: "",
      isOpenConfirmModal: false
    });
  }

  getAllDiseaseName = (his_data) => {
    let disease_name = "";
    if (his_data.length > 0) {
      his_data.map((disease) => {
        if (disease_name === "") {
          disease_name = disease_name + disease.name;
        } else {
          disease_name = disease_name + "、" + disease.name;
        }
      });
    }
    return disease_name;
  };

  setDiagnostic = (e) => {
    this.setChangeFlag(1);
    this.setState({ diagnostic: e.target.value });
  };

  insertDiseaseName = (name) => {
    if (name === "") {
      return;
    }
    this.setChangeFlag(1);
    let diagnostic = this.state.diagnostic;
    diagnostic = diagnostic === "" ? name : diagnostic + "\n" + name;
    this.setState({ diagnostic });
  };

  closeModal = () => {
    if (this.state.change_flag == 1) {
      this.setState({
        isOpenConfirmModal: true,
        confirm_message: "登録していない内容があります。変更内容を破棄して閉じますか？"
      });
      return;
    }
    this.props.closeModal();
  }

  confirmCloseOk = () => {
    this.setState({
      isOpenConfirmModal: false,
      confirm_message: ""
    },()=>{
      this.props.closeModal();
    });
  }

  render() {
    let { disease_codes, disease_history_data } = this.state;
    return (
      <>
        <Wrapper>
          <div className="flex content-area">
            <div className="left-area">
              <table className="table-scroll table table-bordered">
                <tr>
                  <th style={{ width: "130px" }}>日付</th>
                  <th>病名</th>
                </tr>
                {disease_history_data !== undefined &&
                  disease_history_data !== null &&
                  Object.keys(disease_history_data).map((key) => {
                    let his_data = disease_history_data[key];
                    return (
                      <>
                        <tr
                          className={
                            "row-item " +
                            (this.state.selected_history_number ===
                            his_data[0].number
                              ? "selected"
                              : "")
                          }
                          onClick={this.selectHistory.bind(
                            this,
                            his_data[0].number
                          )}
                        >
                          <td style={{ textAlign: "center" }}>
                            {formatJapanDateSlash(
                              disease_history_data[key].date
                            )}
                          </td>
                          <td>{this.getAllDiseaseName(his_data)}</td>
                        </tr>
                      </>
                    );
                  })}
              </table>
            </div>
            <div className="middle-area">
              <div className="div-style1">
                <div className="label-type1">病名</div>
              </div>
              <div className="disease-history">
                {disease_codes !== undefined &&
                  disease_codes !== null &&
                  disease_codes.length > 0 &&
                  disease_codes.map((code) => {
                    return (
                      <div
                        key={code}
                        className={"disease-name row-item"}
                        onClick={this.insertDiseaseName.bind(
                          this,
                          this.state.disease_list[code]
                        )}
                      >
                        {this.state.disease_list[code]}
                      </div>
                    );
                  })}
              </div>
              <div className="div-style1">
                <div className="label-type1">既往歴</div>
              </div>
              <div
                className="disease-history row-item"
                onClick={this.insertDiseaseName.bind(
                  this,
                  this.state.past_history
                )}
              >
                {this.state.past_history !== ""
                  ? displayLineBreak(this.state.past_history)
                  : ""}
              </div>
              <div className="div-style1">
                <div className="label-type1">持病歴</div>
              </div>
              <div
                className="disease-history row-item"
                onClick={this.insertDiseaseName.bind(
                  this,
                  this.state.disease_history
                )}
              >
                {this.state.disease_history !== ""
                  ? displayLineBreak(this.state.disease_history)
                  : ""}
              </div>
            </div>
            <div className="right-area">
              <textarea
                onChange={this.setDiagnostic.bind(this)}
                value={this.state.diagnostic}
              ></textarea>
            </div>
          </div>
          <div className="footer-buttons">
            <Button className={'cancel-btn'} onClick={this.closeModal}>キャンセル</Button>
            <Button className={this.state.change_flag == 0 ? "disable-btn": "red-btn"} onClick={this.handleInsert}>{"確定"}</Button>
          </div>
        </Wrapper>
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal={this.confirmCancel.bind(this)}
            handleOk={this.confirmCancel.bind(this)}
            showMedicineContent={this.state.alert_messages}
          />
        )}
        {this.state.isOpenConfirmModal !== false &&  (
            <SystemConfirmJapanModal
                hideConfirm= {this.confirmCancel.bind(this)}
                confirmCancel= {this.confirmCancel.bind(this)}
                confirmOk= {this.confirmCloseOk}
                confirmTitle= {this.state.confirm_message}
            />
        )}
      </>
    );
  }
}

MedicalHistoryBody.contextType = Context;

MedicalHistoryBody.propTypes = {
  patientInfo: PropTypes.array,
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  diagnostic: PropTypes.string,  
};

export default MedicalHistoryBody;
