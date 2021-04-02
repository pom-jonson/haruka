import React, { Component } from "react";
import styled from "styled-components";
// import * as colors from "../_nano/colors";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "../atoms/Button";
import {getDifferentTime} from "~/helpers/date";

const ModalContent = styled.div`
  &.modal-content {
  }
  .table-scroll{
    overflow-y: auto;

  }
  .currentuser{
    background-color: rgb(240,252,255);
  }
  .current_time {
    margin-bottom: 5px;
    margin-left: 30px;
  }
  table {
    margin:auto;
    width: 95%;
  }
  .name {
    width: 30%;
  }
`;

class ConcurrentuserModal extends Component {
  constructor(props) {
    super(props);
  }


  async componentDidMount() {
    const concurrentInfo = this.props.concurrentInfo;
    this.setState({ concurrentInfo});
  }

  isMounted = false;

  async componentWillUnmount() {
    this.isMounted = false;
  }

  diffTime(firtsttime) {
    var currentTime = new Date();
    firtsttime = firtsttime.split("-").join("/");
    var diff = getDifferentTime(currentTime, firtsttime);
    var diff_second = Math.floor(diff / 1000);
    var diff_min =  Math.floor(diff_second / 60);
    var diff_hour = 0;
    if(diff_min >= 60) {
      diff_hour = Math.floor(diff_min / 60);
    }
    diff_min = diff_min % 60;
    if (diff_hour > 0) {
      return diff_hour + "時間" + diff_min + "分前";
    } else {
      return diff_min + "分前";
    }
  }

  gethours(str) {
    return str.substring(11,13);
  }

  getminutes(str) {
    return str.substring(14,16);
  }

  render() {
    const concurrentInfo  = this.props.concurrentInfo;
    const { closeConcurrentModal } = this.props;

    let time = new Date();
    let usernumber = JSON.parse(window.sessionStorage.getItem("haruka")).user_number;

    return (
      <Modal show={true} size="xl" className="concurrent-modal">
        <Modal.Header>
          <Modal.Title>この患者を表示中のユーザー</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModalContent>
            <div className="current_time">
              確認時刻 {(time.getHours() < 10 ? '0' : '') + time.getHours()} : {(time.getMinutes() < 10 ? '0' : '') + time.getMinutes()}
            </div>
            <table className="table-scroll table table-bordered">
            {concurrentInfo.length > 0 && (
              concurrentInfo.map( (info, index) => (
              <tr className={`${( usernumber == info.staff_number) ? "currentuser table-row ": ""}`} key={index}>
                <td className="table-item name">{info.name}</td>
                <td className="table-item">
                  {this.gethours(info.updated_at)}:{this.getminutes(info.updated_at)}&nbsp; 
                    ({this.diffTime(info.updated_at)})</td>
              </tr>
              ))
            )}
            </table>
          </ModalContent>
        </Modal.Body>
        <Modal.Footer>
          <Button className='cancel-btn' id="close" onClick={closeConcurrentModal}>閉じる</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ConcurrentuserModal.propTypes = {
  closeConcurrentModal: PropTypes.func,
  patientId: PropTypes.number,
  concurrentInfo: PropTypes.array,
  detailedPatientInfo: PropTypes.object
};

export default ConcurrentuserModal;
