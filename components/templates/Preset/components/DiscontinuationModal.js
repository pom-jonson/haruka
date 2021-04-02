import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import IconWithCaption from "../../../molecules/IconWithCaption";
import Button from "../../../atoms/Button";
import { faAlarmClock } from "@fortawesome/pro-regular-svg-icons";
import styled from "styled-components";

import { formatDate, getCurrentDate } from "../../../../helpers/date";

const TabContent = styled.div`
  display: flex;
  max-width: 100%;
  width: 649px;
  height: auto;
  padding: 9px 9px 9px 2px;
  flex-direction: row;
  flex-wrap: nowrap;

  input {
    width: 100%;
  }

  div:first-child,
  div:nth-child(3) {
    width: 100px;
    margin-right: 20px;
  }
`;

const TabContentBig = styled.div`
  display: flex;
  max-width: 100%;
  width: 649px;
  height: auto;
  padding: 9px 9px 9px 2px;
  flex-direction: row;
  flex-wrap: nowrap;

  input {
    width: 100%;
  }

  div:first-child {
    width: 185px;
    margin-right: 20px;
  }
`;

const ButtonContent = styled.div`
  width: 100%;

  .float-right {
    float: right;
  }
`;

const TabRow = styled.div`
  width: 100px;
  margin-right: 20px;
  font-size: 14px;
  line-height: 26px;
`;

export class DiscontinuationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: []
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    const presData = this.props.presData;
    const presIndex = this.props.presIndex;

    let details = [];
    if (presIndex >= 0) {
      details.push({
        index: presIndex,
        start_date: presData[presIndex].start_date,
        end_date: this.addDate(
          presData[presIndex].start_date,
          presData[presIndex].days
        ),
        discontinuation_start_date:
          presData[presIndex].discontinuation_start_date !== undefined
            ? this.addDate(
                presData[presIndex].discontinuation_start_date,
                0,
                "-"
              )
            : getCurrentDate("-"),
        discontinuation_end_date:
          presData[presIndex].discontinuation_end_date !== undefined
            ? this.addDate(presData[presIndex].discontinuation_end_date, 0, "-")
            : this.addDate(getCurrentDate(), 1, "-"),
        comment:
          presData[presIndex].discontinuation_comment !== undefined
            ? presData[presIndex].discontinuation_comment
            : ""
      });
    } else {
      presData.map((data, index) => {
        details.push({
          index: index,
          start_date: data.start_date,
          end_date: this.addDate(data.start_date, data.days),
          discontinuation_start_date:
            data.discontinuation_start_date !== undefined
              ? this.addDate(data.discontinuation_start_date, 0, "-")
              : getCurrentDate("-"),
          discontinuation_end_date:
            data.discontinuation_end_date !== undefined
              ? this.addDate(data.discontinuation_end_date, 0, "-")
              : this.addDate(getCurrentDate(), 1, "-"),
          comment:
            data.discontinuation_comment !== undefined
              ? data.discontinuation_comment
              : ""
        });
      });
    }
    this.setState({
      details: details
    });
  }

  addDate = (dateStr, days, separator = "") => {
    dateStr = "" + dateStr;
    let addNewDate = new Date(
      dateStr.substring(0, 4),
      dateStr.substring(4, 6) - 1,
      dateStr.substring(6, 8)
    );
    addNewDate.setDate(addNewDate.getDate() + parseInt(days));
    let date = addNewDate.getDate();
    let month = addNewDate.getMonth() + 1;
    let year = addNewDate.getFullYear();

    return `${year}${separator}${
      month < 10 ? `0${month}` : `${month}`
    }${separator}${date < 10 ? `0${date}` : `${date}`}`;
  };

  confirmStop = () => {
    const presData = this.props.presData;
    this.state.details.map(data => {
      presData[
        data.index
      ].discontinuation_start_date = data.discontinuation_start_date
        .replace("-", "")
        .replace("-", "");
      presData[
        data.index
      ].discontinuation_end_date = data.discontinuation_end_date
        .replace("-", "")
        .replace("-", "");
      presData[data.index].discontinuation_comment = data.comment;
    });
    this.props.setDiscontinuation(presData);
  };

  handleChange = e => {
    let changeType = e.target.getAttribute("changeType");
    let changeIndex = e.target.getAttribute("changeIndex");
    let value = e.target.value;
    let details = this.state.details;
    if (changeType === "start_date") {
      details[changeIndex].discontinuation_start_date = value;
    }
    if (changeType === "end_date") {
      details[changeIndex].discontinuation_end_date = value;
    }
    if (changeType === "comment") {
      details[changeIndex].comment = value;
    }
    this.setState({
      details: details
    });
  };

  render() {
    return (
      <Modal
        show={true}        
        tabIndex="0"
        className="custom-modal-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>中止期間の設定</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.details.map((data, index) => {
            return (
              <div className="categoryContent" key={index}>
                <div>
                  {data.index + 1 < 10
                    ? "0" + (data.index + 1)
                    : data.index + 1}
                </div>
                <TabContent>
                  <IconWithCaption
                    className="categoryName"
                    icon={faAlarmClock}
                    word="用法開始日"
                  />
                  <TabRow>{formatDate(data.start_date)}</TabRow>
                  <IconWithCaption
                    className="categoryName"
                    icon={faAlarmClock}
                    word="用法終了日"
                  />
                  <TabRow>{formatDate(data.end_date)}</TabRow>
                </TabContent>
                <TabContentBig>
                  <IconWithCaption
                    className="categoryName"
                    icon={faAlarmClock}
                    word="中止期間の最初日"
                  />
                  <input
                    type="date"
                    onChange={this.handleChange}
                    changeIndex={index}
                    changeType="start_date"
                    value={data.discontinuation_start_date}
                  />
                </TabContentBig>
                <TabContentBig>
                  <IconWithCaption
                    className="categoryName"
                    icon={faAlarmClock}
                    word="中止期間の最後日"
                  />
                  <input
                    type="date"
                    onChange={this.handleChange}
                    changeIndex={index}
                    changeType="end_date"
                    value={data.discontinuation_end_date}
                  />
                </TabContentBig>
                <TabContentBig>
                  <IconWithCaption className="categoryName" word="コメント" />
                  <input
                    type="text"
                    onChange={this.handleChange}
                    changeIndex={index}
                    changeType="comment"
                    value={data.comment}
                  />
                </TabContentBig>
              </div>
            );
          })}
          <ButtonContent>
            <Button onClick={this.props.closeModal} type="mono">
              キャンセル
            </Button>
            <Button onClick={this.confirmStop} className="float-right">
              確定
            </Button>
          </ButtonContent>
        </Modal.Body>
      </Modal>
    );
  }
}

DiscontinuationModal.propTypes = {
  presData: PropTypes.array,
  presIndex: PropTypes.number,
  closeModal: PropTypes.func,
  setDiscontinuation: PropTypes.func
};

export default DiscontinuationModal;
