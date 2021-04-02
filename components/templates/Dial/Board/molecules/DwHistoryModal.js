import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios/index";
import * as methods from "~/components/templates/Dial/DialMethods";
import {formatJapanDateSlash, formatTimeIE} from "~/helpers/date";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 12px;
  width: 100%;
  height: 400px;
  overflow-y: auto;
  flex-direction: column;
  display: flex;
  text-align: center;
  .no-result {
    padding: 120px;
  }
  table {
    margin:0;
    tbody{
      display:block;
      overflow-y: scroll;
      height: calc(400px - 3rem);
      width:100%;
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
    }
    tr{
      display: table;
      width: 100%;
    }
    thead{
      display:table;
      width:100%;
      border-bottom: 1px solid #dee2e6;
      tr{width: calc(100% - 17px);}
    }
    td {
      padding: 0.25rem;
      word-break: break-all;
      font-size: 1rem;
      vertical-align: middle;
      text-align:left;
    }
    th {
      position: sticky;
      text-align: center;
      padding: 0.25rem;
      font-size: 1rem;
      white-space:nowrap;
      border:1px solid #dee2e6;
      border-bottom:none;
      border-top:none;
      font-weight: normal;
    }
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class DwHistoryModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      is_loaded: false,
      history_data: null,
    };
  }
  async componentDidMount() {
      await this.getStaffs();
    if (
      this.props.patientInfo !== undefined &&
      this.props.patientInfo !== null &&
      this.props.patientInfo.system_patient_id !== undefined
    ) {
      let path = "/app/api/v2/dial/schedule/getDwHistory";
      let post_data = {
        system_patient_id: this.props.patientInfo.system_patient_id,
      };
      const { data } = await axios.post(path, { params: post_data });
      this.setState({
        history_data: data,
        is_loaded: true,
      });
    }
  }

  onHide = () => {};

  render() {
    const { closeModal } = this.props;
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="temperature_dlg"
        className="master-modal"
      >
        <Modal.Header>
          <Modal.Title style={{ fontSize: "25px" }}>DW履歴</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className={"flex table-area"} style={{ width: "100%" }}>
              <table className="table-scroll table table-bordered " id="temperature-table">
                <thead>
                  <tr>
                    <th style={{width:"3rem"}}/>
                    <th style={{width:"10rem"}}>変更日時</th>
                    <th style={{width:"5rem"}}>DW</th>
                    <th>スタッフ</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.is_loaded ? (
                    <>
                      {this.state.history_data != null && this.state.history_data.length > 0 ? (
                        this.state.history_data.map((item, index) => {
                          if (item.updated_at != null){
                            return (
                              <>
                                <tr>
                                  <td style={{width:"3rem", textAlign:"right"}}>{index + 1}</td>
                                  <td style={{width:"10rem"}}>
                                    {item.updated_at != null ? (formatJapanDateSlash(item.updated_at.split(" ")[0]) + " " + formatTimeIE(new Date(item.updated_at.split("-").join('/')))): ""}
                                  </td>
                                  <td style={{width:"5rem", textAlign:"right"}}>{item.dw > 0 ? parseFloat(item.dw).toFixed(1): ""}</td>
                                  <td>
                                    {this.state.staff_list_by_number !== undefined && this.state.staff_list_by_number != null && this.state.staff_list_by_number[item.updated_by] !== undefined ?
                                      this.state.staff_list_by_number[item.updated_by] : ""}
                                  </td>
                                </tr>
                              </>
                            );
                          }
                        })
                      ) : (
                        <tr>
                          <td colSpan={4}>データがありません。</td>
                        </tr>
                      )}
                    </>
                  ):(
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  )}
                </tbody>
              </table>
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <div onClick={closeModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
            <span>閉じる</span>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

DwHistoryModal.contextType = Context;

DwHistoryModal.propTypes = {
  closeModal: PropTypes.func,
  patientInfo: PropTypes.array,
  schedule_date: PropTypes.string,
};

export default DwHistoryModal;
