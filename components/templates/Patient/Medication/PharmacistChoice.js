import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import * as apiClient from "~/api/apiClient";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    font-size: 1rem;
    .flex {
        display: flex;
    }
    .patient-name {
        .name-area {
            border: 1px solid #aaa;
            width: 250px;
            line-height: 30px;
            padding-left: 5px;
        }
        input {
            height: 30px;
        }
    }
    .label-title {
        width: 100px;
        text-align: right;
        line-height: 2.375rem;
        margin-top: 0;
        margin-right: 10px;
        margin-bottom: 0;
        font-size: 1rem;
    }
    .pullbox-label {
        .pullbox-select {
            width: 250px;
            height: 2.375rem;
        }
    }
    .table-area {
        height: calc(100% - 15rem);
        overflow-y: auto;
        td {
            padding:0.2rem;
            width: 50%;
            height:2rem;
        }
    }
`;

class PharmacistChoice extends Component {
    constructor(props) {
        super(props);
				let order_data = props.order_data;
        this.state = {
            staff_master:[{id:0, value:"未設定"}],
            pharmacist_id_1: order_data.pharmacist_id_1 != null ? order_data.pharmacist_id_1 : 0,
            pharmacist_id_2: order_data.pharmacist_id_2 != null ? order_data.pharmacist_id_2 : 0,
            pharmacist_id_3: order_data.pharmacist_id_3 != null ? order_data.pharmacist_id_3 : 0,
            order_data: props.order_data,
            confirm_message: '',
            confirm_alert_title: '',
            confirm_action: '',
            alert_messages: '',
            request_contents_array: order_data.order_data.order_data.request_contents_array != undefined ? order_data.order_data.order_data.request_contents_array : []
        };
        this.init_state = {
            pharmacist_id_1: order_data.pharmacist_id_1 != null ? order_data.pharmacist_id_1 : 0,
            pharmacist_id_2: order_data.pharmacist_id_2 != null ? order_data.pharmacist_id_2 : 0,
            pharmacist_id_3: order_data.pharmacist_id_3 != null ? order_data.pharmacist_id_3 : 0,
        }
    }

    async componentDidMount() {
    }

    setStaffId = (key, e) => {
        this.setState({[key]:e.target.id});
    }

		closeModal = () => {
			let changed = this.getChanged();
			if (changed) {
				this.setState({
					confirm_message: "登録していない内容があります。\n変更内容を破棄して移動しますか？",
					confirm_alert_title:'入力中',
					confirm_action: "cancel"
				});
        this.modalBlack();
				return;
			} else {
				this.props.closeModal();
			}
		};

		getChanged = () => {
			let changed = false;
			Object.keys(this.init_state).map(key=>{
				if (this.state[key] != this.init_state[key]) changed = true;
			});
			return changed;
		}

		saveData = () => {
      this.modalBlack();
			if (this.state.pharmacist_id_1 == 0 && this.state.pharmacist_id_2 == 0 && this.state.pharmacist_id_3 == 0) {
				this.setState({alert_messages: '薬剤師を選択してください。'});
				return;
			}
			let changed = this.getChanged();
			if (!changed) return;
      this.setState({
        confirm_message: "薬剤師を登録しますか？",
        confirm_action: "register"
      });
		}

		registerPharmacist = async () => {
        let params = {
          pharmacist_id_1: this.state.pharmacist_id_1,
          pharmacist_id_2: this.state.pharmacist_id_2,
          pharmacist_id_3: this.state.pharmacist_id_3,
          number: this.state.order_data.number
        };
        await apiClient.post("/app/api/v2/secure/medicine_guidance_request/register_pharmacist", params)
        .then((res) => {
          // window.sessionStorage.setItem("alert_messages", res.alert_messages);
          this.setState({alert_messages: res.alert_messages});
          this.props.closeModal(true);
        });
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
        this.registerPharmacist();
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
    getDisableValues = (disable_key) => {
      let disable_options = '';
      Object.keys(this.init_state).map(index=>{
        if (index != disable_key && this.state[index] != 0) {
          disable_options = disable_options + this.state[index] + ":";
        }
      });
      if (disable_options !=  "") {
        disable_options = disable_options.substring(0, disable_options.length - 1);
      }
      return disable_options;
    }

    render() {
			let {request_contents_array} = this.state;

			let changed = this.getChanged();
        let {order_data} = this.props;
        return (
            <>
                <Modal show={true} className="pharmacist-choice-modal" onHide={this.onHide}>
                    <Modal.Header><Modal.Title>薬剤師登録</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                            <div className={'patient-name flex'}>
                                <div className={'label-title'}>患者氏名</div>
                                <div className={'name-area'}>{order_data != undefined && order_data.patient_name != undefined ? order_data.patient_name.trim() : ''}</div>
                            </div>
                            <div className={'select-ward'} style={{paddingTop:"8px"}}>
                                <SelectorWithLabel
                                    title="担当薬剤師"
                                    options={this.props.doctor_list}
                                    getSelect={this.setStaffId.bind(this, 'pharmacist_id_1')}
                                    departmentEditCode={this.state.pharmacist_id_1}
                                    disabledValue={this.getDisableValues("pharmacist_id_1")}
                                />
                            </div>
                            <div className={'select-ward'}>
                                <SelectorWithLabel
                                    title=""
                                    options={this.props.doctor_list}
                                    getSelect={this.setStaffId.bind(this, 'pharmacist_id_2')}
                                    departmentEditCode={this.state.pharmacist_id_2}
                                    disabledValue={this.getDisableValues("pharmacist_id_2")}
                                />
                            </div>
                            <div className={'select-ward'}>
                                <SelectorWithLabel
                                    title=""
                                    options={this.props.doctor_list}
                                    getSelect={this.setStaffId.bind(this, 'pharmacist_id_3')}
                                    departmentEditCode={this.state.pharmacist_id_3}
                                    disabledValue={this.getDisableValues("pharmacist_id_3")}
                                />
                            </div>
                            <div style={{paddingTop:"10px"}}>服薬指導内容</div>

                            <div className={'table-area'}>
                                <table className="table-scroll table table-bordered" id="code-table">
                                    <tbody>
																			{request_contents_array != null && request_contents_array.length > 0 && request_contents_array.map((item, index)=> {
																				return (
																					<tr key={index}>
																						<td style={{width:"70%"}}>{item.guidance_medication_name}</td>
                                            <td style={{width:"30%"}}></td>
																					</tr>
																				)
																			})}
                                    
                                    </tbody>
                                </table>
                            </div>
                        </Wrapper>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
                        <Button className={changed ? "red-btn" : "disable-btn"} onClick={this.saveData}>確定</Button>
                    </Modal.Footer>
                </Modal>
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
										handleOk= {this.confirmCancel.bind(this)}
										showMedicineContent= {this.state.alert_messages}
									/>
								)}
            </>
        );
    }
}
PharmacistChoice.contextType = Context;
PharmacistChoice.propTypes = {
    closeModal: PropTypes.func,
    patient_name: PropTypes.string,
    doctor_list: PropTypes.array,
    order_data: PropTypes.objecet,
};

export default PharmacistChoice;