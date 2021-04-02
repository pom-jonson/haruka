import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import {formatDateLine, formatJapan} from "~/helpers/date";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    font-size: 1rem;
    .flex {
        display: flex;
    }
    .date-title {
      padding: 0.5rem 0.5rem;
      background: lightskyblue;
      font-size: 1.2rem;
    }
    .table-area {
        overflow-y: auto;
        td {
            padding:0.2rem;
            width: 50%;
            height:20px;
            font-size: 1rem;
        }
        th {
          padding: 0.2rem;
        }
        .selected {
          background: lightblue;
        }
      .gray {
        background: #7f7f7f;
      } 
      .orange {
        background: #ffc000;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
      }
    }
    .checkbox-area{
      label {
        width: 50%;
        font-size: 1rem;
      }
      .color-label {
        width: 1.5rem;
        height: 1.5rem;
      }
      .blue {
        background: lightblue;
      }
      .orange {
        background: #ffc000;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
      }
      .gray {
        background: #7f7f7f;
      }
    }
`;

class MedicineReservationModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
          time_master: [],
          is_loaded: false,
          order_item:props.select_order,
          select_date:props.select_date,
          confirm_message: '',
          confirm_alert_title: '',
          confirm_action: '',
          alert_messages: '',
          all_count: 0
        };
    }

    async componentDidMount() {
    }

    async UNSAFE_componentWillMount(){
      await this.getSearchResult();
    }
    getSearchResult = async () => {
      let params = {
        order_item: this.state.order_item,
        select_date: formatDateLine(this.state.select_date)
			};
			await apiClient.post("/app/api/v2/secure/medicine_guidance_request/get_reservation", params)
      .then((res) => {
        let time_master = res;
        let count = 0;
        if(time_master.length > 0) {
          time_master.map(item=>{
            count += item.current_count;
          });
        }
        this.setState({
          time_master,
          all_count: count,
          is_loaded: true
        });
      });
    }
    selectTime = (item) => {
      this.setState({selected_item: item});
    }
    getClassName = (item) => {
      if (item.current_count == item.max_count) return 'orange';
      if (this.state.selected_item != undefined && this.state.selected_item.number == item.number) {
        return 'selected'
      }
      return '';
    }
    registerTime = () => {
      
    }
    saveData = () => {
      if (this.state.selected_item == undefined || this.state.selected_item == null) {
        return;
      }
      this.modalBlack();
      this.setState({
        confirm_message: "予約時間を登録しますか？",
        confirm_action: "register"
      });
    }
    registerReservationTime = async () => {
        let params = {
          guidance_medication_request_id: this.state.order_item.number,
          guidance_date: formatDateLine(this.state.select_date),
          group_code: this.state.selected_item.group_code,
          frame_code: this.state.selected_item.frame_code,
          day_code: this.state.selected_item.day_code,
          time_id: this.state.selected_item.time_id,
          start_time: this.state.selected_item.start_time,
          end_time: this.state.selected_item.end_time,
          category: 1
        };
        // await apiClient.post("/app/api/v2/secure/medicine_guidance_request/register_reservation_time", params)
        // .then((res) => {
        //   this.setState({
        //     alert_messages: res.alert_messages,
        //     confirm_action:'close'
        //   });
        //   this.modalBlack();
        // });
        this.props.handleOk(params);
		}

		confirmCancel = () => {
      this.modalBlackBack();
			this.setState({
				confirm_message: '',
				confirm_alert_title: '',
				confirm_action: '',
				alert_messages: ''
			});
		}

    confirmOk = () => {
      this.confirmCancel();
      if (this.state.confirm_action == "cancel") {
        this.props.closeModal();
      } else if (this.state.confirm_action == "register") {
        this.registerReservationTime();
      } else if (this.state.confirm_action == "close") {
        this.props.closeModal(true);
      }
    }

    onHide = () => {};

    modalBlack = () => {
      let base_modal = document.getElementsByClassName("pharmacist-choice-modal")[0];
      if(base_modal !== undefined && base_modal != null){
          base_modal.style['z-index'] = 1040;
      }
    }
    modalBlackBack = () => {
      let base_modal = document.getElementsByClassName("pharmacist-choice-modal")[0];
      if(base_modal !== undefined && base_modal != null){
          base_modal.style['z-index'] = 1050;
      }
    }

    render() {
      let {time_master} = this.state;
        return (
            <>
                <Modal show={true} className="pharmacist-choice-modal">
                    <Modal.Body>
                    {this.state.is_loaded ? (
                      <Wrapper>
                          <div className="date-title">{formatJapan(this.state.select_date)} の予約時間</div>
                          <div className={'table-area'}>
                          <div className="w-100 d-flex mt-3" style={{fontSize: "1.125rem"}}>
                            <div className="w-50 text-center">修正モード</div>
                            <div className="w-50 text-center">服薬指導予約</div>
                          </div>
                          <div className="w-100 d-flex mt-2">
                            <div className="ml-3">予約取得数  {this.state.all_count != undefined ? this.state.all_count : ''}</div>
                          </div>
                          <div className="w-100 d-flex mt-2">
                            <div className="w-50">&nbsp;</div>
                            <div className="text-center w-50">（加算表示）</div>
                          </div>
                              <table className="table-scroll table table-bordered" id="code-table">
                                <thead>
                                  <tr>
                                      <td className="text-center">時間</td>
                                      <td className="text-center">取得人数</td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {time_master != null && time_master.length > 0 && time_master.map((item, index)=>{
                                    return (
                                      <tr key={index} onClick={this.selectTime.bind(this, item)} className={this.getClassName(item)} style={{cursor:"pointer"}}>
                                          <td className="text-center">{item.start_time != null && item.start_time != "" ? item.start_time.substr(0,5) : '' } ~ {item.end_time != null && item.end_time != "" ? item.end_time.substr(0,5):""}</td>
                                          <td className="text-center">{item.current_count}/{item.max_count}</td>
                                      </tr>
                                    )
                                  })}
                                </tbody>
                              </table>
                          </div>
                          <div className="checkbox-area mb-2">
                            <div className="flex w-100">
                              <span className="color-label blue"> </span>
                              <label className="label-title">選択中</label>
                              <span className="color-label orange"> </span>
                              <label className="label-title">予約済み</label>
                            </div>
                            <div className="flex w-100 mt-1">
                              <span className="color-label gray"> </span>
                              <label className="label-title">締め切り</label>
                          </div>
                          </div>
                      </Wrapper>
                    ):(
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    )}
                    </Modal.Body>
                    <Modal.Footer>
                      <div className="custom-modal-btn cancel-btn" onClick={this.props.closeModal} style={{cursor:"pointer"}}><span>キャンセル</span></div>
                      <div className={this.state.selected_item != undefined ? "custom-modal-btn red-btn" : "custom-modal-btn disable-btn"} onClick={this.saveData} style={{cursor:"pointer"}}><span>確定</span></div>
                    </Modal.Footer>
                    {this.state.confirm_message != '' ? (
                      <ConfirmNoFocusModal
                        hideConfirm={this.confirmCancel.bind(this)}
                        confirmCancel={this.confirmCancel.bind(this)}
                        confirmOk={this.confirmOk}
                        confirmTitle={this.state.confirm_message}
                        title={this.state.confirm_alert_title}
                      />
                    ):(<></>)}
                    {this.state.alert_messages !== "" && (
                      <AlertNoFocusModal
                        hideModal= {this.confirmCancel.bind(this)}
                        handleOk= {this.confirmOk.bind(this)}
                        showMedicineContent= {this.state.alert_messages}
                      />
                    )}
                </Modal>
            </>
        );
    }
}
MedicineReservationModal.contextType = Context;
MedicineReservationModal.propTypes = {
    closeModal: PropTypes.func,
    select_date:PropTypes.object,
    select_order:PropTypes.object,
    handleOk:PropTypes.func
};

export default MedicineReservationModal;