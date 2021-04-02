import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
// import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import { formatDateLine, formatDateSlash } from "~/helpers/date";
import axios from "axios/index";
import InspectionTimeSeriesModal from "~/components/organisms/InspectionTimeSeriesModal";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 15px;
  width: 95%;
  height: 50vh;
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 10px;
  label {
    text-align: right;
  }
  .flex {
    display: flex;
  }
  .inline-flex {
    display: inline-flex;
    border-bottom: 1px solid gray;
  }
  .fl {
    float: left;
  }
  table {
    overflow-y: auto;
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    tr:hover{background-color:#e2e2e2 !important;}
    td {
      padding: 0.25rem;
    }
    th {
      text-align: center;
      padding: 0.3rem;
    }
    .table-check {
      width: 90px;
      text-align: center;
    }
    .item-no {
      width: 50px;
    }
    .code-number {
      width: 120px;
    }
  }

  .table-area {
    height: 100%;
    width: 100%;
    border: solid 1px darkgray;
    overflow-y: auto;
    .table-menu {
      background-color: gainsboro;
      div {
        line-height: 30px;
      }
    }
    .exam_name {
      width: 19rem;
      border-right: 1px solid gray;
    }
    .exam_unit {
      width: 100px;
      border-right: 1px solid gray;
    }
    .exam_value {
      width: 50px;
      border-right: 1px solid gray;
    }
    .table-check {
      width: 93px;
      text-align: center;
    }
  }
  .footer {
    margin-top: 10px;
    text-align: center;
    button {
      text-align: center;
      border-radius: 4px;
      background: rgb(105, 200, 225);
      border: none;
      margin-right: 30px;
    }

    span {
      color: white;
      font-size: 20px;
      font-weight: 100;
    }
  }
`;

class InspectGraphModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schVal: "",
      curPatternCode: 0,
      exam_table_data: [],
      patientInfo: "",
      period_month: 6,
      period_month_text: "",
      isOpenPreviewModal: false,
      showTimeSeries: false,
      timeSeriesContent: [],
    };
    this.double_click = false;
  }
  componentDidMount() {
    this.getSearchResult();
  }

  getAlwaysShow = (name, value) => {
    if (name === "alwaysShow") {
      this.setState({ is_enabled: value });
    }
  };

  getSearchResult = async () => {
    if (this.props.patientInfo !== "") {
      let path =
        "/app/api/v2/dial/medicine_information/examination_data/getByDrkarte";
      let examination_end_date = this.props.schedule_date;
      let cur_date = this.props.schedule_date;
      let post_data = {
        system_patient_id: this.props.patientInfo.system_patient_id,
        examination_start_date: formatDateLine(cur_date),
        examination_end_date: formatDateLine(examination_end_date),
        curPatternCode: 0,
        type: "asc",
      };
      const { data } = await axios.post(path, { params: post_data });
      this.setState({
        exam_table_data: data,
      });
    }
  };

  onHide = () => {};

  getRadio = (number, name, value) => {
    if (name === "check") {
      let exam_table_data = this.state.exam_table_data;
      exam_table_data[1][number].is_graph = value;
      this.setState({ exam_table_data });
    }
  };

  openGraphModal = () => {
    let graph_data = this.makeGraphData(this.state.exam_table_data);
    if (graph_data == undefined || graph_data == null || graph_data.length == 0)
      return;
    this.setState({
      showTimeSeries: true,
      graph_data,
    });
  };
  closeTimeSeriesModal = () => {
    this.setState({
      showTimeSeries: false,
    });
  };

  makeGraphData(table_data) {
    if (table_data == null || Object.keys(table_data).length == 0) return;
    let graph_data = [];
    Object.keys(table_data[1]).map((index) => {
      let graph_item = {};
      let item = table_data[1][index];
      if (item.is_graph != undefined && item.is_graph == 1) {
        graph_item.label = item.name;
        let date_value = table_data[0];
        let values = [
          {
            x: date_value[0],
            y: item[date_value].value,
          },
        ];
        graph_item.values = values;
        graph_data.push(graph_item);
      }
    });
    return graph_data;
  }

  render() {
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal first-view-modal width-50vw-modal"
      >
        <Modal.Header>
          <Modal.Title>検査結果一覧表</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="table-area">
              {this.state.exam_table_data !== undefined &&
                this.state.exam_table_data !== null &&
                this.state.exam_table_data.length > 0 && (
                  <>
                    <div className={""}>
                      <div className={"inline-flex table-menu"}>
                        <div className="table-check">グラフに表示</div>
                        <div className="text-center exam_name">検査名</div>
                        <div className="text-center exam_unit">単位</div>
                        <div className="text-center exam_unit">基準値</div>
                        {this.state.exam_table_data[0] !== undefined &&
                          this.state.exam_table_data[0] !== null &&
                          this.state.exam_table_data[0].length > 0 &&
                          this.state.exam_table_data[0].map((item) => {
                            return (
                              <>
                                <div className="text-center exam_unit">
                                  {formatDateSlash(new Date(item))}
                                </div>
                              </>
                            );
                          })}
                      </div>
                    </div>
                    {this.state.exam_table_data[1] !== undefined &&
                      this.state.exam_table_data[1] !== null &&
                      Object.keys(this.state.exam_table_data[1]).map(
                        (index) => {
                          let item = this.state.exam_table_data[1][index];
                          return (
                            <>
                              <div>
                                <div className={"inline-flex"}>
                                  <div className="table-check">
                                    <Checkbox
                                      label=""
                                      getRadio={this.getRadio.bind(this, index)}
                                      value={item.is_graph}
                                      name="check"
                                    />
                                  </div>
                                  <div className="text-center exam_name">
                                    {item.name}
                                  </div>
                                  <div className="text-center exam_unit">
                                    {item.unit}
                                  </div>
                                  {this.state.patientInfo != null &&
                                  this.state.patientInfo.gender === 1 ? (
                                    <div className="text-center exam_unit">
                                      {item.reference_value_male != undefined &&
                                      item.reference_value_male != null &&
                                      item.reference_value_male !== ""
                                        ? "男:" + item.reference_value_male
                                        : (item.reference_value_male_min !=
                                            null &&
                                          item.reference_value_male_min != ""
                                            ? item.reference_value_male_min +
                                              "~"
                                            : "") +
                                          (item.reference_value_male_max != null
                                            ? item.reference_value_male_max
                                            : "")}
                                    </div>
                                  ) : (
                                    <div className="text-center exam_unit">
                                      {item.reference_value_female !=
                                        undefined &&
                                      item.reference_value_female != null &&
                                      item.reference_value_female !== ""
                                        ? "女:" + item.reference_value_female
                                        : (item.reference_value_female_min !=
                                            null &&
                                          item.reference_value_female_min != ""
                                            ? item.reference_value_female_min +
                                              "~"
                                            : "") +
                                          (item.reference_value_female_max !=
                                          null
                                            ? item.reference_value_female_max
                                            : "")}
                                    </div>
                                  )}
                                  {this.state.exam_table_data[0] !==
                                    undefined &&
                                    this.state.exam_table_data[0] !== null &&
                                    this.state.exam_table_data[0].length > 0 &&
                                    this.state.exam_table_data[0].map(
                                      (date) => {
                                        if (item[date] != undefined) {
                                          return (
                                            <>
                                              <div className="text-center exam_value">
                                                {item[date].value}
                                              </div>
                                              {item[date].value2 !=
                                              undefined ? (
                                                <div className="text-center exam_value">
                                                  {item[date].value2}
                                                </div>
                                              ) : (
                                                <div className="exam_value"></div>
                                              )}
                                            </>
                                          );
                                        } else {
                                          return (
                                            <>
                                              <div className="exam_value"></div>
                                              <div className="exam_value"></div>
                                            </>
                                          );
                                        }
                                      }
                                    )}
                                </div>
                              </div>
                            </>
                          );
                        }
                      )}
                  </>
                )}
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.props.closeModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
            <span>キャンセル</span>
          </div>
          <div onClick={this.openGraphModal} className="custom-modal-btn red-btn" style={{cursor:"pointer"}}>
            <span>グラフを表示</span>
          </div>

          {/* <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
          <Button className="red-btn" onClick={this.openGraphModal}>グラフを表示</Button> */}
        </Modal.Footer>
        {this.state.showTimeSeries && (
          <InspectionTimeSeriesModal
            closeTimeSeriesModal={this.closeTimeSeriesModal}
            showData={this.state.graph_data}
          />
        )}
      </Modal>
    );
  }
}

InspectGraphModal.contextType = Context;

InspectGraphModal.propTypes = {
  closeModal: PropTypes.func,
  patientInfo: PropTypes.object,
  schedule_date: PropTypes.string,
};

export default InspectGraphModal;
