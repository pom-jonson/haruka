import React, { Component } from "react";
import Context from "~/helpers/configureStore";
import MyCalendarBody from "./MyCalendarBody";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import DialSideBar from "../../DialSideBar";
import DialPatientNav from "~/components/templates/Dial/DialPatientNav";
import Button from "~/components/atoms/Button";
import PropTypes from "prop-types";

const Title = styled.div`
    position: fixed;
    top: 70px;
    width: calc(100% - 390px);
    left: 200px;
    margin: 0px;
    float: left;
    background-color: ${surface};
    padding: 1.25rem;
    height: 90px;
    .title {
        font-size: 2rem;
        padding-left: 0.5rem;
        border-left: solid 0.3rem #69c8e1;
    }
    .body-component {
        position: fixed;
        height: calc(100vh - 160px);
        top: 160px;
        width: calc(100% - 390px);
        left: 200px;
        float: left;
        margin: 0px;
    }
  .other-pattern {
    position: absolute;
    right: 1.25rem;
    button {
      margin-left: 0.2rem;
      margin-bottom: 0px;
      margin-top: 0.3rem;
      padding: 8px 10px;
      min-width: 5rem;
    }
    span {
      font-size: 1rem;
    }
    .disable-button {
      background: rgb(101, 114, 117);
      cursor: auto;
    }
    .schedule-button {
      margin-right: 0.5rem;
    }
  }
}
`;

class MyCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientInfo: null,
    };
  }

  componentDidMount() {}

  selectPatient = (patientInfo) => {
    this.setState({
      patientInfo,
    });
  };
  goOtherPage(go_url) {
    this.props.history.replace(go_url);
  }

  render() {
    return (
      <>
        <DialSideBar onGoto={this.selectPatient} history = {this.props.history}/>
        <DialPatientNav patientInfo={this.state.patientInfo} history = {this.props.history}/>
        <Title>
          <div className="d-flex">
            <div className={"title"}>カレンダー</div>
            <div className={"other-pattern"}>
              <Button onClick={this.goOtherPage.bind(this, "/dial/schedule/Schedule")}>スケジュール</Button>
              <Button onClick={this.goOtherPage.bind(this, "/dial/others/patientPlanList")}>患者予定</Button>
              <Button className="disable-button">カレンダー</Button>
            </div>
          </div>
          <div className={"body-component"}>
            <MyCalendarBody patientInfo={this.state.patientInfo} />
          </div>
        </Title>
      </>
    );
  }
}
MyCalendar.propTypes = {
  history: PropTypes.object,
};
MyCalendar.contextType = Context;
export default MyCalendar;
