import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import { formatDateLine, getNextDayByJapanFormat } from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import WeightBloodChart from "~/components/organisms/WeightBloodChart";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import FormWithLabel from "~/components/molecules/FormWithLabel";
import RadioButton from "~/components/molecules/RadioInlineButton";
import Spinner from "react-bootstrap/Spinner";
const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 67vh;
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 10px;
  .chat-image {
    width: 95%;
    margin-left: 0.625rem;
  }
  table {
    font-size: 1rem;
    thead {
      display: table;
      width: 100%;
    }
    tbody {
      display: block;
      overflow-y: auto;
      height: calc(60vh - 5rem);
      width: 100%;
    }
    tr {
      display: table;
      width: 100%;
    }
    tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    tr:hover{background-color:#e2e2e2 !important;}
    td {
      word-break: break-all;
      font-size: 1rem;
      padding: 0.25rem;
    }
    th {
      font-size: 0.9rem;
      position: sticky;
      text-align: center;
      padding: 0.3rem;
    }
    .code-number {
      width: 18%;
    }
    .name {
      width: 18%;
    }
  }
  .max-min-input {
    button {
      padding: 0.22rem;
      min-width: 2rem;
      span {
        font-size: 1rem;
      }
    }
  }
  .graph-select {
    .pullbox-title {
      width: 33%;
    }
  }
  .average-field {
    position: absolute;
    z-index: 1;
    margin-left: 100px;
  }
  .notice {
    position: absolute;
    right:1.5rem;
    top: 3rem;
    label {
      color: red;
      margin-bottom: 0;
    }
  }
  .crease-notice {
    text-align: right;
    margin-right: 0.5rem;
    margin-top: -2rem;
    .green-label, .blue-label {
      width: 2rem;
      height: 0.5rem;
      background: green;
      line-height: 0.5rem;
    }
    .blue-label {
      background: blue;
    }
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  button {
    span {
      color: white;
      font-size: lrem;
    }
    float: right;
    padding: 5px;
  }
  .date-area{
    display: flex;
  }
  .radio-btn label {
    font-size: 1rem;
    width: 4.5rem;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 4px;
    padding: 4px 5px;
    text-align: center;
    margin: 0 5px;
    margin-bottom: 0;
  }
  .month-input {
    div {
      display: flex;
      flex-direction: row;
      div {
        line-height: 2.5rem;
        width: 9rem;
      }
    }
    .gender-label {
      margin-top: 7px;
      width: 3rem;
    }
    input {
      display: block;
      width: 4rem;
      margin-top: 0;
    }
  }
`;

class WeightBloodGraphModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schVal: "",
      curPatternCode: 0,
      exam_table_data: [],
      patientInfo: "",
      period_month: 1,
      period_month_text: 1,
      isOpenPreviewModal: false,
      showTimeSeries: false,
      timeSeriesContent: [],
      show_mode: 0,
      graph_data: [],
      weight_graph_max: 200,
      weight_graph_min: 40,
      blood_graph_min: 40,
      before_blood_min: 40,
      blood_graph_max: 250,
      before_blood_max: 250,
      is_loaded: false,
      graph_type: 0,
    };
    this.grah_max_value = 250;
    this.graph_min_value = 0;
    this.double_click = false;
    this.max_value = 999;
    this.step = 1;
    this.graph_type = [
      { id: 0, value: "体重+血圧前グラフ" },
      { id: 1, value: "体重+血圧後グラフ" },
      { id: 2, value: "血圧前+血圧後グラフ" },
      { id: 3, value: "体重+増加・除水量グラフ" },
    ];
  }
  async UNSAFE_componentWillMount() {
    this.getWeightBlood(
      this.props.patientInfo.system_patient_id,
      this.props.schedule_date
    );
  }

  getAlwaysShow = (name, value) => {
    if (name === "alwaysShow") {
      this.setState({ is_enabled: value });
    }
  };

  getWeightBlood = async (system_patient_id, schedule_date) => {
    let path = "/app/api/v2/dial/schedule/getWeightBlood";
    const post_data = {
      system_patient_id: system_patient_id,
      schedule_date: formatDateLine(schedule_date),
      all_data: 1,
    };
    await apiClient._post(path, { params: post_data }).then((res) => {
      let table_data = res;
      if (Object.keys(table_data).lenth == 0) return;
      let first_date = Object.keys(table_data)[0];
      let filteredArr = {};
      Object.keys(table_data).map((key) => {
        let first_dt = new Date(first_date).getTime();
        let second_dt = new Date(key).getTime();
        if (
          parseInt(
            Math.abs(first_dt - second_dt) / (1000 * 60 * 60 * 24 * 30)
          ) < this.state.period_month
        ) {
          filteredArr[key] = table_data[key];
        }
      });
      if (Object.keys(filteredArr).length == 0) return;
      this.makeWeightGraphData(filteredArr);
      this.makeBloodGraphData(filteredArr);
      this.setState({
        table_data: res,
        is_loaded: true,
      });
    });
  };
  onHide = () => {};

  getRadio = (number, name, value) => {
    if (name === "check") {
      let exam_table_data = this.state.exam_table_data;
      exam_table_data[1][number].is_graph = value;
      this.setState({ exam_table_data });
    }
  };

  countUp = (key) => {
    if (parseFloat(this.state[key]) >= parseFloat(this.grah_max_value)) return;
    let step = 1;
    if (key.includes('weight')) step = 1;
    this.setState({
      [key]: parseFloat(this.state[key]) + parseFloat(step),
    });
  };
  countDown = (key) => {
    let step = 1;
    if (key.includes('weight')) step = 1;
    if (
      this.state[key] <= this.grah_max_value &&
      this.state[key] - step > this.graph_min_value
    ) {
      this.setState({
        [key]: this.state[key] - step,
      });
    } else {
      this.setState({
        [key]: this.graph_min_value,
      });
    }
  };

  makeWeightGraphData(table_data) {
    if (table_data == null || Object.keys(table_data).length == 0) return;
    let graph_data = [
      { values: [], label: "体重" },
      { values: [], label: "DW" },
    ];
    let crease_data = [
      { values: [], label: "増加量" },
    ];
    let weight_array = [];
    let weight_after_array = [];
    let weight_before_array = [];
    let dw_array = [];
    let end_date = Object.keys(table_data)[0];
    let start_date = Object.keys(table_data)[Object.keys(table_data).length-1];
    let now_date = start_date;
    let weight_before;
    let weight_after;
    let dw_1;
    let dw;
    let increase;
    let decrease;
    if ((new Date(end_date).getTime() - new Date(start_date).getTime()) >= 0) {
      do {
        let item = table_data[now_date];
        let time = now_date;
        if (item != undefined && item != null) {
          weight_before = {
            x: time + " 01:00",
            y: parseFloat(item.weight_before).toFixed(1),
          };
          weight_after = {
            x: time + " 02:00",
            y: isNaN(parseFloat(item.weight_after)) ? null : parseFloat(item.weight_after).toFixed(1),
            markerColor:"blue",
          };
          dw_1 = { x: time + " 02:00", y: parseFloat(item.dw).toFixed(1) };
          dw = { x: time + " 01:00", y: parseFloat(item.dw).toFixed(1) };
          // 増加
          if (item.increase_amount != undefined) {
            increase = { x: time + " 01:00", y: item.increase_amount, label: "増加量", color: "green" };
          } else {
            increase = { x: time + " 01:00", y: null, label: "増加量", color: "green" };
          }
          // 除水量
          if (item.decrease_amount != undefined) {
            decrease = { x: time + " 02:00", y: item.decrease_amount, label: "除水量", color: "blue" };
          } else {
            decrease = { x: time + " 02:00", y: null, label: "除水量", color: "blue" };
          }

          if (!isNaN(parseFloat(item.weight_after))) {
            weight_array.push(parseFloat(item.weight_after));
            weight_after_array.push(parseFloat(item.weight_after));
          }
          if (!isNaN(parseFloat(item.weight_before))) {
            weight_array.push(parseFloat(item.weight_before));
            weight_before_array.push(parseFloat(item.weight_before));
          }
          if (!isNaN(parseFloat(item.dw))) {
            weight_array.push(parseFloat(item.dw));
            dw_array.push(parseFloat(item.dw));
          }
        } else {
          weight_before = {
            x: time + " 01:00",
            y: null,
          };
          weight_after = {
            x: time + " 02:00",
            y: null,
          };
          dw_1 = { x: time + " 02:00", y: null };
          dw = { x: time + " 01:00", y: null };

          increase = { x: time + " 01:00", y: null, label: "増加量", color: "green" };
          decrease = { x: time + " 02:00", y: null, label: "除水量", color: "blue" };
        }
        now_date = getNextDayByJapanFormat(now_date);
        now_date = formatDateLine(now_date);

        graph_data[0].values.push(weight_before);
        graph_data[0].values.push(weight_after);
        graph_data[1].values.push(dw);
        graph_data[1].values.push(dw_1);

        crease_data[0].values.push(increase);
        crease_data[0].values.push(decrease);

      } while ((new Date(now_date).getTime() <= new Date(end_date).getTime()));
    }    
    let max_value = weight_array.length > 0 ? Math.max(...weight_array) : null;
    let min_value = weight_array.length > 0 ? Math.min(...weight_array) : null;    
    let weight_graph_max = max_value > 0 ? Math.round(max_value + 10) : this.grah_max_value;
    let weight_graph_min = min_value > 0 ? Math.round(min_value) - 2 : this.graph_min_value;
    let weight_after_average = weight_after_array.reduce((a,b) => a + b, 0) / weight_after_array.length;
    let weight_before_average = weight_before_array.reduce((a,b) => a + b, 0) / weight_before_array.length;
    let first_dw = dw_array.length > 0 ? dw_array[0] : null;
    if (first_dw != null) {
      weight_graph_max = first_dw % 1 == 0 ? parseInt(first_dw) + 7 : Math.round(first_dw) + 7;
      weight_graph_min = first_dw % 1 == 0 ?  parseInt(first_dw) -2 : Math.round(first_dw) - 2;
    }
    this.setState({
      weight_graph_data: graph_data,
      crease_data,
      weight_graph_max,
      weight_graph_min: weight_graph_min < 0 ? 0 : weight_graph_min,
      weight_after_average: parseFloat(weight_after_average).toFixed(1),
      weight_before_average: parseFloat(weight_before_average).toFixed(1)
    });
    return graph_data;
  }
  makeBloodGraphData(table_data) {
    if (table_data == null || Object.keys(table_data).length == 0) return;
    let before_blood_graph = [
      { values: [], label: "透析前血圧" },
      { values: [], label: "透析前血圧", blue_line: true, y_value:[] },
      { values: [], label: "blank" },
    ];
    let after_blood_graph = [
      { values: [], label: "透析後血圧" },
      { values: [], label: "透析後血圧", blue_line: true, y_value:[] },
      { values: [], label: "blank" },
    ];
    let before_after_blood_graph = [
      { values: [], label: "透析前後血圧" },
      { values: [], label: "透析前後血圧", blue_line: true, y_value:[] },
      { values: [], label: "blank" },
    ];
    let before_blood_max = 0;
    let before_blood_min = 0;
    let after_blood_max = 0;
    let after_blood_min = 0;
    let before_array = [];
    let after_array = [];

    let end_date = Object.keys(table_data)[0];
    let start_date = Object.keys(table_data)[Object.keys(table_data).length-1];
    let now_date = start_date;

    let blood_add_min_value;
    let blood_add_min_value_01;
    let blood_add_min_value_1;
    let blood_add_min_value_1_01;
    let after_blood_add_min_value;
    let after_blood_add_min_value_01;
    let after_blood_add_min_value_1;
    let after_blood_add_min_value_1_01;
    
    if ((new Date(end_date).getTime() - new Date(start_date).getTime()) >= 0) {
      do {
          let item = table_data[now_date];
          let time = now_date;
          if (item != undefined && item != null && 
            item.before_pressure_min != undefined &&
            item.before_pressure_min != null &&
            item.before_pressure_max != undefined &&
            item.before_pressure_max != null
          ){
            blood_add_min_value = {
              x: time + " 01:00",
              y: [
                parseInt(item.before_pressure_min),
                parseInt(item.before_pressure_max),
              ],
            };
            
            blood_add_min_value_01 = {
              x: time + " 01:00",
              y: [
                null,
                null,
              ],
            };
            blood_add_min_value_1 = {
              x: time + " 01:00",
              y: parseInt(item.before_pressure_min),
            };
            blood_add_min_value_1_01 = {
              x: time + " 01:00",
              y: null,
            };

            before_blood_graph[0].values.push(blood_add_min_value);
            before_blood_graph[0].values.push(blood_add_min_value_01);
            before_blood_graph[1].values.push(blood_add_min_value_1);
            before_blood_graph[1].values.push(blood_add_min_value_1_01);
            
            before_after_blood_graph[0].values.push(blood_add_min_value);            
            before_after_blood_graph[1].values.push(blood_add_min_value_1);

            before_blood_graph[2].values.push({x:time + " 01:00", y:null });
            before_blood_graph[2].values.push({ x: time + " 01:00", y: null });            
            before_after_blood_graph[2].values.push({x: time + " 01:00", y: 0,});
            before_after_blood_graph[2].values.push({x: time + " 01:00",y: 0,});

            before_blood_graph[1].y_value = [ parseInt(item.before_pressure_min), parseInt(item.before_pressure_max)];
            before_after_blood_graph[1].y_value = [ parseInt(item.before_pressure_min), parseInt(item.before_pressure_max)];

            if (item.before_pressure_max != undefined && item.before_pressure_max != null) before_array.push(parseInt(item.before_pressure_max));
            if (item.before_pressure_min != undefined && item.before_pressure_min != null) before_array.push(parseInt(item.before_pressure_min));            
          }

          if (item != undefined && item != null && 
            item.after_pressure_min != undefined &&
            item.after_pressure_min != null &&
            item.after_pressure_max != undefined &&
            item.after_pressure_max != null
          ){
            after_blood_add_min_value = {
              x: time + " 01:00",
              y: [
                parseInt(item.after_pressure_min),
                parseInt(item.after_pressure_max),
              ],
            };
            after_blood_add_min_value_01 = {
              x: time +" 01:00",
              y: [
                null,
                null,
              ],
            };
            after_blood_add_min_value_1 = {
              x: time + " 01:00",
              y: parseInt(item.after_pressure_min),
            };
            after_blood_add_min_value_1_01 = {
              x: time + " 01:00",
              y: null,
            };

            after_blood_graph[0].values.push(after_blood_add_min_value);
            after_blood_graph[0].values.push(after_blood_add_min_value_01);
            after_blood_graph[1].values.push(after_blood_add_min_value_1);
            after_blood_graph[1].values.push(after_blood_add_min_value_1_01);

            before_after_blood_graph[0].values.push(after_blood_add_min_value);            
            before_after_blood_graph[1].values.push(after_blood_add_min_value_1);
            
            after_blood_graph[2].values.push({ x: time + " 01:00", y: null });
            after_blood_graph[2].values.push({ x: time + " 01:00", y: null });
            before_after_blood_graph[2].values.push({x: time + " 01:00", y: 0,});
            before_after_blood_graph[2].values.push({x: time + " 01:00",y: 0,});

            before_after_blood_graph[1].y_value = [ parseInt(item.after_pressure_min), parseInt(item.after_pressure_max)];
            after_blood_graph[1].y_value = [ parseInt(item.after_pressure_min), parseInt(item.after_pressure_max)];

            if (item.after_pressure_max != undefined && item.after_pressure_max != null) after_array.push(parseInt(item.after_pressure_max));
            if (item.after_pressure_min != undefined && item.after_pressure_min != null) after_array.push(parseInt(item.after_pressure_min));            
          }
          if ((item == undefined || item == null) ||
            (item.before_pressure_min == undefined || item.before_pressure_min == null) && 
            (item.before_pressure_max == undefined || item.before_pressure_max == null) && 
            (item.after_pressure_min == undefined || item.after_pressure_min == null) && 
            (item.after_pressure_max == undefined || item.after_pressure_max == null)
          ){
            before_blood_graph[2].values.push({x:time + " 01:00", y:null });
            before_blood_graph[2].values.push({ x: time + " 01:00", y: null });
            after_blood_graph[2].values.push({ x: time + " 01:00", y: null });
            after_blood_graph[2].values.push({ x: time + " 01:00", y: null });
            before_after_blood_graph[2].values.push({x: time + " 01:00", y: 0,});
            before_after_blood_graph[2].values.push({x: time + " 01:00",y: 0,});

            after_blood_graph[0].values.push({x:time + " 01:00", y:null });
            after_blood_graph[0].values.push({ x: time + " 01:00", y: null });
            after_blood_graph[1].values.push({x:time + " 01:00", y:null });
            after_blood_graph[1].values.push({ x: time + " 01:00", y: null });

            before_blood_graph[0].values.push({x:time + " 01:00", y:null });
            before_blood_graph[0].values.push({ x: time + " 01:00", y: null });
            before_blood_graph[1].values.push({x:time + " 01:00", y:null });
            before_blood_graph[1].values.push({ x: time + " 01:00", y: null });

            before_after_blood_graph[0].values.push({x:time + " 01:00", y:null });
            before_after_blood_graph[0].values.push({ x: time + " 01:00", y: null });
            before_after_blood_graph[1].values.push({x:time + " 01:00", y:null });
            before_after_blood_graph[1].values.push({ x: time + " 01:00", y: null });
          }
            // 最大値の初期値は、範囲内の血圧と前体重の中の最大、最小値の初期値は、範囲内の血圧と後体重の最小
          now_date = getNextDayByJapanFormat(now_date);
          now_date = formatDateLine(now_date);
        } while ((new Date(now_date).getTime() <= new Date(end_date).getTime()));
    }

    before_blood_min = before_array.length > 0 ? Math.min(...before_array) : 0;
    before_blood_max =
      before_array.length > 0 ? Math.max(...before_array) : this.grah_max_value;
    after_blood_min = after_array.length > 0 ? Math.min(...after_array) : 0;
    after_blood_max =
      after_array.length > 0 ? Math.max(...after_array) : this.grah_max_value;

    let blood_graph_max = 0;
    let blood_graph_min = 0;

    if (this.state.graph_type == 0) {
      blood_graph_max = parseInt(before_blood_max) + 2;
      blood_graph_min = before_blood_min > 2 ? before_blood_min - 2 : 0;
    } else if (this.state.graph_type == 1) {
      blood_graph_max = parseInt(after_blood_max) + 2;
      blood_graph_min = after_blood_min > 2 ? after_blood_min - 2 : 0;
    } else if (this.state.graph_type == 2) {
      blood_graph_max = Math.max(before_blood_max, after_blood_max) + 2;
      blood_graph_min = Math.min(before_blood_min, after_blood_min) - 2;
    } else if (this.state.graph_type == 3) {
      blood_graph_max = 10;
      blood_graph_min = 0;
    }

    this.setState({
      before_blood_graph,
      after_blood_graph,
      before_after_blood_graph,
      blood_graph_max:
        isNaN(blood_graph_max) || blood_graph_max > this.grah_max_value
          ? this.grah_max_value
          : blood_graph_max,
      blood_graph_min:
        isNaN(blood_graph_min) || blood_graph_min < 0 ? 0 : blood_graph_min,
    }, ()=>{
      this.setState({
        before_blood_min: this.state.blood_graph_min,
        before_blood_max: this.state.blood_graph_max
      })
    });
  }

  openGraphModal = () => {
    this.setState({ show_mode: this.state.show_mode == 1 ? 0 : 1 });
  };

  getGraphSelect = (e) => {
    this.setState({ graph_type: parseInt(e.target.id) }, () => {
      let { table_data } = this.state;
      if (Object.keys(table_data).lenth == 0) return;
      if (!(parseInt(this.state.period_month) > 0)) return;
      let first_date = Object.keys(table_data)[0];
      let filteredArr = {};
      Object.keys(table_data).map((key) => {
        let first_dt = new Date(first_date).getTime();
        let second_dt = new Date(key).getTime();
        if (
          parseInt(
            Math.abs(first_dt - second_dt) / (1000 * 60 * 60 * 24 * 30)
          ) < this.state.period_month
        ) {
          filteredArr[key] = table_data[key];
        }
      });
      if (Object.keys(filteredArr).length == 0) return;
      this.makeWeightGraphData(filteredArr);
      this.makeBloodGraphData(filteredArr);
    });
  };
  getPeriodMonths = (e) => {
    if (
      !(parseInt(e.target.value) > 0 && parseInt(e.target.value) < 100) &&
      e.target.value !== ""
    ) {
      return;
    }
    this.setState({
      period_month_text: e.target.value,
    });
  };
  getPeriod = (value) => {
    this.setState({
      period_month: value,
      period_month_text: "",
    });
    let { table_data } = this.state;
    if (Object.keys(table_data).lenth == 0) return;
    let first_date = Object.keys(table_data)[0];
    let filteredArr = {};
    Object.keys(table_data).map((key) => {
      let first_dt = new Date(first_date).getTime();
      let second_dt = new Date(key).getTime();
      if (
        parseInt(Math.abs(first_dt - second_dt) / (1000 * 60 * 60 * 24 * 30)) <
        value
      ) {
        filteredArr[key] = table_data[key];
      }
    });
    if (Object.keys(filteredArr).length == 0) return;
    this.makeWeightGraphData(filteredArr);
    this.makeBloodGraphData(filteredArr);
  };

  onInputKeyPressed = (e) => {
    if (
      e.keyCode === 13 &&
      this.state.period_month_text !== "" &&
      !isNaN(parseInt(this.state.period_month_text))
    ) {
      this.setState(
        {
          period_month: parseInt(this.state.period_month_text),
        },
        () => {
          let { table_data } = this.state;
          if (Object.keys(table_data).lenth == 0) return;
          let first_date = Object.keys(table_data)[0];
          let filteredArr = {};
          Object.keys(table_data).map((key) => {
            let first_dt = new Date(first_date).getTime();
            let second_dt = new Date(key).getTime();
            if (
              parseInt(
                Math.abs(first_dt - second_dt) / (1000 * 60 * 60 * 24 * 30)
              ) < this.state.period_month
            ) {
              filteredArr[key] = table_data[key];
            }
          });
          if (Object.keys(filteredArr).length == 0) return;
          this.makeWeightGraphData(filteredArr);
          this.makeBloodGraphData(filteredArr);
        }
      );
    }
  };

  render() {
    let { table_data, graph_type } = this.state;
    let graph_title = "透析前血圧";
    if (this.state.graph_type == 1 || this.state.graph_type == 2) graph_title = "透析後血圧";
    else if (this.state.graph_type == 3) graph_title = "増加・除水量[kg]";
    let graph_date_array = null;
    if (table_data != undefined && table_data != null && Object.keys(table_data).length > 0) graph_date_array = Object.keys(table_data);    
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal width-70vw-modal top-5-modal"
      >
        <Modal.Header>
          <Modal.Title>体重/血圧グラフ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            {this.state.is_loaded ? (
              <>
                {this.state.show_mode !== 0 ? (
                  <div className="table-area p-1">
                    <table
                      className="table table-bordered table-hover"
                      id="code-table"
                    >
                      <thead>
                        <tr>
                          <th className="name">測定日</th>
                          <th className="code-number">前体重</th>
                          <th className="code-number">後体重</th>
                          <th className="code-number">最高血圧</th>
                          <th>最低血圧</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table_data != undefined &&
                          table_data != null &&
                          Object.keys(table_data).length > 0 &&
                          Object.keys(table_data).map((index) => {
                            let item = table_data[index];
                            return (
                              <tr key={index}>
                                <td className="name">{index}</td>
                                <td className="code-number text-right">
                                  {item.weight_before != null &&
                                  item.weight_before >0
                                    ? parseFloat(item.weight_before).toFixed(1) + "kg"
                                    : ""}
                                </td>
                                <td className="code-number text-right">
                                  {item.weight_after != null &&
                                  item.weight_after >0
                                    ? parseFloat(item.weight_after).toFixed(1) + "kg"
                                    : ""}
                                </td>
                                <td className="code-number text-right">
                                  {item.bp_pressure_max}
                                </td>
                                <td className={`text-right`}>
                                  {item.bp_pressure_min}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <>
                    <div className="mt-2 graph-select">
                      <SelectorWithLabel
                        options={this.graph_type}
                        title=""
                        getSelect={this.getGraphSelect}
                        departmentEditCode={
                          this.graph_type[this.state.graph_type].id
                        }
                      />
                    </div>
                    {graph_type == 2 ? (
                      <div className="ml-5 mt-2">透析前血圧</div>
                    ) : (
                    <div className="ml-5 mt-2">体重[kg]</div>
                    )}
                    {graph_type != 2 && (
                      <div className="notice">
                        <div>
                          {/* <label style={{fontSize:"1.3rem"}}>●</label> */}
                          <label style={{letterSpacing:"-0.64rem", marginRight:"0.5rem"}}>・・・・・・</label>
                          {/* <label style={{fontSize:"1.3rem"}}>●</label> */}
                          <label style={{color:"black", marginLeft:"0.5rem"}}>増加</label>
                        </div>
                        <div>
                          {/* <label style={{fontSize:"1.3rem"}}>●</label> */}
                          <label style={{marginLeft:"6px"}}>――</label>
                          {/* <label style={{fontSize:"1.3rem", color:"blue"}}>●</label> */}
                          <label style={{color:"black", marginLeft:"10px"}}>除水</label>
                        </div>
                      </div>
                    )}
                    <div style={{position:"relative"}}>
                      {graph_type != 2 && (
                        <div className="average-field">
                          <div style={{color:"red"}}>前体重平均：{this.state.weight_before_average >0 ? this.state.weight_before_average + "kg" : ""}</div>
                          <div className="mt-1" style={{color:"blue"}}>後体重平均：{this.state.weight_after_average >0 ? this.state.weight_after_average + "kg" : ""}</div>
                        </div>
                      )}
                      <div className={`d-flex w-100 ml-2 mt-2`}>
                        <div className={`max-min-input`}>
                          <Button
                            onClick={() => this.countUp(graph_type == 2 ? "before_blood_max" : "weight_graph_max")}
                          >
                            ▲
                          </Button>
                          <div
                            className={`mt-1 mb-1 text-center`}
                            style={{ fontSize: "1.25rem", width: "2.5rem", letterSpacing: "-1px" }}
                          >
                            {graph_type == 2 ? this.state.before_blood_max : Math.round(this.state.weight_graph_max)}
                          </div>
                          <Button
                            onClick={() => this.countDown(graph_type == 2 ? "before_blood_max" : "weight_graph_max")}
                          >
                            ▼
                          </Button>
                          <div style={{ height: 10 }} />
                          <Button
                            onClick={() => this.countUp(graph_type == 2 ? "before_blood_min" : "weight_graph_min")}
                          >
                            ▲
                          </Button>
                          <div
                            className={`mt-1 mb-1 text-center`}
                            style={{ fontSize: "1.25rem", width: "2.5rem" }}
                          >
                            {graph_type == 2 ? this.state.before_blood_min : Math.round(this.state.weight_graph_min)}
                          </div>
                          <Button
                            onClick={() => this.countDown(graph_type == 2 ? "before_blood_min" : "weight_graph_min")}
                          >
                            ▼
                          </Button>
                        </div>
                        <div className="chat-image ml-1">
                        {graph_type == 2 ? (
                          <WeightBloodChart
                            showData={this.state.before_blood_graph}
                            height={25}
                            min_y={this.state.before_blood_min}
                            max_y={this.state.before_blood_max}
                            graph_date_array={graph_date_array}
                          />
                        ):(
                          <WeightBloodChart
                            showData={this.state.weight_graph_data}
                            height={25}
                            min_y={this.state.weight_graph_min}
                            max_y={this.state.weight_graph_max}
                            graph_date_array={graph_date_array}
                            markerSize={10}
                          />
                        )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 mt-2">{graph_title}</div>
                    {graph_type == 3 && (
                      <div className="crease-notice">
                        <div>
                          <label className='green-label'>&nbsp;</label>
                          <label style={{color:"black", marginLeft:"0.5rem"}}>増加量</label>
                        </div>
                        <div>
                          <label className='blue-label'>&nbsp;</label>
                          <label style={{color:"black", marginLeft:"0.5rem"}}>除水量</label>
                        </div>
                      </div>
                    )}
                    <div className={`d-flex w-100 ml-2 mt-2`}>
                      <div className={`max-min-input`}>
                        <Button onClick={() => this.countUp("blood_graph_max")}>
                          ▲
                        </Button>
                        <div
                          className={`mt-1 mb-1 text-center`}
                          style={{ fontSize: "1.25rem", width: "2.5rem", letterSpacing: "-1px" }}
                        >
                          {this.state.blood_graph_max}
                        </div>
                        <Button
                          onClick={() => this.countDown("blood_graph_max")}
                        >
                          ▼
                        </Button>
                        <div style={{ height: 10 }} />
                        <Button onClick={() => this.countUp("blood_graph_min")}>
                          ▲
                        </Button>
                        <div
                          className={`mt-1 mb-1 text-center`}
                          style={{ fontSize: "1.25rem", width: "2.5rem" }}
                        >
                          {this.state.blood_graph_min}
                        </div>
                        <Button
                          onClick={() => this.countDown("blood_graph_min")}
                        >
                          ▼
                        </Button>
                      </div>
                      <div className="chat-image ml-1">
                        {graph_type == 0 && (
                          <WeightBloodChart
                            showData={this.state.before_blood_graph}
                            height={25}
                            min_y={this.state.blood_graph_min}
                            max_y={this.state.blood_graph_max}
                            graph_date_array={graph_date_array}
                          />
                        )}
                        {graph_type == 1 && (
                          <WeightBloodChart
                            showData={this.state.after_blood_graph}
                            height={25}
                            min_y={this.state.blood_graph_min}
                            max_y={this.state.blood_graph_max}
                            graph_date_array={graph_date_array}
                          />
                        )}
                        {graph_type == 2 && (
                          <WeightBloodChart
                            // showData={this.state.before_after_blood_graph}
                            showData={this.state.after_blood_graph}
                            height={25}
                            min_y={this.state.blood_graph_min}
                            max_y={this.state.blood_graph_max}
                            graph_date_array={graph_date_array}
                          />
                        )}
                        {graph_type == 3 && (
                          <WeightBloodChart
                            showData={this.state.crease_data}
                            height={25}
                            min_y={this.state.blood_graph_min}
                            max_y={this.state.blood_graph_max}
                            graph_date_array={graph_date_array}
                          />
                        )}
                      </div>
                    </div>
                    <div className="footer">
                      {/* <Button onClick={this.openPreviewModal}>帳票プレビュー</Button> */}
                    </div>
                  </>
                )}
              </>
            ) : (
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary"/>
              </SpinnerWrapper>
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Footer>
          <div className="date-area">
            <div className={"d-flex"}>
              <div className="flex month-input">
                <FormWithLabel
                  type="number"
                  label="最終透析日から"
                  onChange={this.getPeriodMonths.bind(this)}
                  onKeyPressed={this.onInputKeyPressed}
                  value={this.state.period_month_text}
                />
              </div>
              <label
                className="mr-2 gender-label"
                style={{ marginTop: "0.5rem" }}
              >
                ヶ月
              </label>
            </div>
            <RadioButton
              id="period_1"
              value={0}
              label="３ヶ月"
              name="period"
              getUsage={this.getPeriod.bind(this, 3)}
              checked={this.state.period_month === 3 ? true : false}
            />
            <RadioButton
              id="period_2"
              value={1}
              label="６ヶ月"
              name="period"
              getUsage={this.getPeriod.bind(this, 6)}
              checked={this.state.period_month === 6 ? true : false}
            />
            <RadioButton
              id="period_3"
              value={2}
              label="１年"
              name="period"
              getUsage={this.getPeriod.bind(this, 12)}
              checked={this.state.period_month === 12 ? true : false}
            />
            </div>
          <div>
            <div onClick={this.props.closeModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
              <span>キャンセル</span>
            </div>
            {/* <Button className={'cancel-btn'}  onClick={this.props.closeModal}>キャンセル</Button> */}
          </div>
          </Footer>
        </Modal.Footer>
      </Modal>
    );
  }
}

WeightBloodGraphModal.contextType = Context;

WeightBloodGraphModal.propTypes = {
  closeModal: PropTypes.func,
  patientInfo: PropTypes.object,
  schedule_date: PropTypes.string,
};

export default WeightBloodGraphModal;
