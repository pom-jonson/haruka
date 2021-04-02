import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import InputKeyWord from "~/components/molecules/InputKeyWord";
import * as apiClient from "~/api/apiClient";
import Button from "~/components/atoms/Button";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import * as methods from "~/components/templates/Patient/SOAP/methods";
import * as cacheApi from "~/helpers/cacheLocal-utils";
import {formatDateLine} from "~/helpers/date";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    .flex {
        display: flex;
    }
`;

export class InputNameModal extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>{
            if(name == "createCacheOrderData" || name == "createInjectCacheOrderData") {
                this[name] = fn.bind(this);
            }
        });
        this.state={
            alert_messages:"",
            name:props.type === "change_name" ? props.set_name : "",
            register_status:false,
            duplicate_check_data:[],
            confirm_message:"",
        }
    }

    async componentDidMount() {
        let path = "";
        let post_data = {};
        if (this.props.type === "category") {
            path = "/app/api/v2/set/get_category_name_list";
            post_data = {
                register_category: this.props.register_category,
                register_key: this.props.register_key,
            };
        }
        if (this.props.type === "set" || this.props.type === "change_name") {
            path = "/app/api/v2/set/get_set_name_list";
            post_data = {
                register_category: this.props.register_category,
                register_key: this.props.register_key,
            };
            if (this.props.type === "change_name") {
                post_data.set_name = this.props.set_name;
            }
        }
        await apiClient
            .post(path, {
                params: post_data
            })
            .then((res) => {
                this.setState({duplicate_check_data:res});
            })
            .catch(() => {

            });
    }

    hideModal=()=>{};

    getInputWord = e => {
        this.setState({
            name: e.target.value,
            register_status:false,
        });
    };

    onInputKeyPressed = (e) => {
        if(e.keyCode === 13){
            if(this.state.register_status){
                this.confirmSave();
            } else {
                this.setState({register_status:true})
            }
        }
    };

    confirmSave=()=>{
        if(this.state.name === ""){
            this.setState({alertMsg:(this.props.type === "category" ? "分類" : "文書")+"名を入力してください。"});
            return;
        }
        let exit_name = false;
        if(this.state.duplicate_check_data.length > 0){
            this.state.duplicate_check_data.map(item=>{
                if(this.state.name === item.name){
                    exit_name = true;
                }
            })
        }
        if(exit_name){
            this.setState({alertMsg:"同じ"+ (this.props.type === "category" ? "分類" : "文書") +"名が存在します。"});
            return;
        }
        let confirm_message = "";
        if (this.props.type === "category") {
            confirm_message = "分類名を登録しますか？";
        }
        if (this.props.type === "set"){
            confirm_message = "文書名を登録しますか？";
        }
        if(this.props.type === "change_name"){
            confirm_message = "文書名を変更しますか？";
        }
        this.setState({confirm_message});
    };

    register=async()=>{
        let path = "";
        let post_data = {};
        if(this.props.type === "category"){
            path = "/app/api/v2/set/register_category";
            post_data = {
                name:this.state.name,
                register_category: this.props.register_category,
                register_key: this.props.register_key,
            };
        }
        if(this.props.type === "change_name"){
            path = "/app/api/v2/set/change_name";
            post_data = {
                number:this.props.number,
                name:this.state.name,
            };
        }
        if(this.props.type === "set"){
            let sort_data = karteApi.getVal(this.props.patientId, CACHE_LOCALNAMES.ORDER_SORT);
            let order_datas = [];
            Object.keys(sort_data).map(sort_index=>{
                let key = sort_data[sort_index]['order_key'].split(':')[0];
                let subkey = sort_data[sort_index]['order_key'].split(':')[1];
                let table_name;
                let cache_data;
                if(subkey !== undefined){
                    cache_data = karteApi.getSubVal(this.props.patientId, key, subkey);
                } else {
                    cache_data = karteApi.getVal(this.props.patientId, key);
                }
                switch (key){
                    case CACHE_LOCALNAMES.SOAP_EDIT:
                        table_name = "soap";
                        break;
                    case CACHE_LOCALNAMES.INSPECTION_EDIT:
                        table_name = "inspection";
                        break;
                    case CACHE_LOCALNAMES.TREATMENT_EDIT:
                        table_name = "treatment";
                        break;
                    case CACHE_LOCALNAMES.ALLERGY_EDIT:
                        table_name = "allergy";
                        break;
                    case CACHE_LOCALNAMES.RADIATION_EDIT:
                        table_name = "radiation";
                        break;
                    case CACHE_LOCALNAMES.RIHABILY_EDIT:
                        table_name = "rihabily";
                        break;
                    case CACHE_LOCALNAMES.GUIDANCE_EDIT:
                        table_name = "guidance";
                        break;
                    case CACHE_LOCALNAMES.EXAM_EDIT:
                    case CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT:
                    case CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT:
                    case CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT:
                        table_name = "examination";
                        break;
                    case CACHE_LOCALNAMES.PRESCRIPTION_EDIT:
                        table_name = "prescription";
                        break;
                    case CACHE_LOCALNAMES.INJECTION_EDIT:
                        table_name = "injection";
                        break;
                    case CACHE_LOCALNAMES.MEDICINE_GUIDANCE_EDIT:
                        table_name = "medicine_guidance";
                        break;
                }
                let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
                if(key === CACHE_LOCALNAMES.PRESCRIPTION_EDIT){
                    let _state_presData = cache_data[0].presData;
                    let orderData = this.createCacheOrderData(_state_presData);
                    if (orderData.length > 0 && orderData[0] !== undefined && orderData[0].med.length != 0) {
                        let isUsageCommentError = false;
                        orderData.map(med => {
                            if (med.usage_name.toString() === "" && med.med.length != 0) {
                                isUsageCommentError = true;
                            }
                        });
                        let karte_status = 1;
                        if (this.context.karte_status.name === "訪問診療") {
                            karte_status = 2;
                        } else if(this.context.karte_status.name === "入院") {
                            karte_status = 3;
                        }
                        if (!isUsageCommentError) {
                            let postData = {
                                number: undefined,
                                system_patient_id: this.props.patientId, //HARUKA患者番号
                                insurance_type: 0, //保険情報現状固定
                                order_data: orderData,
                                psychotropic_drugs_much_reason: cache_data[0].psychotropic_drugs_much_reason, //向精神薬多剤投与理由
                                poultice_many_reason: cache_data[0].poultice_many_reason, //湿布薬多剤投与理由
                                free_comment: Array.isArray(cache_data[0].free_comment) ? cache_data[0].free_comment : [cache_data[0].free_comment], //備考
                                department_code: parseInt(cache_data[0].department_code), //this.state.departmentId,
                                department: cache_data[0].department, //this.state.department,
                                is_internal_prescription: cache_data[0].is_internal_prescription,
                                med_consult: cache_data[0].bulk.med_consult,
                                supply_med_info: cache_data[0].bulk.supply_med_info,
                                diagnosis_valid: cacheApi.getValue(CACHE_LOCALNAMES.DIAGNOSIS) == null ? 0 : 1,
                                additions:cache_data[0].additions,
                                item_details:cache_data[0].item_details,
                                karte_status,
                                potion: karte_status == 3 ? cache_data[0].potion : undefined,
                                hospital_opportunity_disease: karte_status == 3 ? cache_data[0].hospital_opportunity_disease : undefined,
                                is_seal_print:  0,
                            };

                            if (authInfo.category === 2 || this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER_PROXY)) {
                                postData.doctor_name = this.context.selectedDoctor.name;
                                postData.doctor_code = this.context.selectedDoctor.code;
                                postData.substitute_name = cache_data[0].substitute_name;
                            }
                            let set_data = {order_table:table_name, order_data:postData};
                            order_datas.push(set_data);
                        }
                    }
                }
                else if(key === CACHE_LOCALNAMES.INJECTION_EDIT){
                    let _state_injectData = cache_data[0].injectData;
                    let orderData = this.createInjectCacheOrderData(_state_injectData);
                    if(orderData.length > 0){
                        let karte_status = 1;
                        if (this.context.karte_status.name === "訪問診療") {
                            karte_status = 2;
                        }
                        let postData = {
                            number: undefined,
                            system_patient_id: this.props.patientId, //HARUKA患者番号
                            insurance_type: 0, //保険情報現状固定
                            order_data: orderData,
                            free_comment: Array.isArray(cache_data[0].free_comment) ? cache_data[0].free_comment : [cache_data[0].free_comment], //備考
                            department_code: parseInt(cache_data[0].department_code), //this.state.departmentId,
                            department: cache_data[0].department, //this.state.department,
                            is_completed: cache_data[0].is_completed,
                            additions:cache_data[0].additions,
                            item_details:cache_data[0].item_details,
                            karte_status,
                            is_seal_print:  0,
                            location_id: cache_data[0].location_id,
                            drip_rate: cache_data[0].drip_rate,
                            water_bubble: cache_data[0].water_bubble,
                            exchange_cycle: cache_data[0].exchange_cycle,
                            require_time: cache_data[0].require_time,
                            schedule_date: cache_data[0].is_completed == 1 ? null : formatDateLine(cache_data[0].schedule_date),
                        };
                        if (authInfo.category === 2 || this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.REGISTER_PROXY)) {
                            postData.doctor_name = this.context.selectedDoctor.name;
                            postData.doctor_code = this.context.selectedDoctor.code;
                        }
                        let set_data = {order_table:table_name, order_data:postData};
                        order_datas.push(set_data);
                    }
                }
                else {
                    let set_data = {order_table:table_name, order_data:cache_data};
                    order_datas.push(set_data);
                }
            });

            path = "/app/api/v2/set/register_set";
            post_data = {
                name:this.state.name,
                category_name:this.props.category_name,
                register_category: this.props.register_category,
                register_key: this.props.register_key,
                number: this.props.number,
                order_datas,
            };
        }
        await apiClient
            .post(path, {
                params: post_data
            })
            .then((res) => {
                window.sessionStorage.setItem("alert_messages", res.alert_message);
                this.props.closeModal("register");
            })
            .catch(() => {

            });
    };

    confirmCancel=()=>{
        this.setState({confirm_message:""});
    };

    render() {
        return (
            <Modal
                show={true}
                onHide={this.hideModal}
                tabIndex="0"
                id="prescription_dlg"
                className="custom-modal-sm patient-exam-modal first-view-modal input-name-modal"
            >
                <Modal.Header>
                    <Modal.Title>{this.props.type === "category" ? "分類" : "文書"}名入力</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>
                        <div>
                            {this.state.alertMsg !== "" && (
                                <span style={{color:"red"}}>{this.state.alertMsg}</span>
                            )}
                        </div>
                        <div className={'input-name'}>
                            <InputKeyWord
                                id={'input_name'}
                                type="text"
                                label=""
                                onChange={this.getInputWord.bind(this)}
                                onKeyPressed={this.onInputKeyPressed}
                                value={this.state.name}
                            />
                        </div>
                    </Wrapper>
                </Modal.Body>
                <Modal.Footer>
                  <Button className={'cancel-btn'} onClick={this.props.closeModal}>キャンセル</Button>
                  <Button className={'red-btn'} onClick={this.confirmSave}>確定</Button>
                </Modal.Footer>
                {this.state.confirm_message !== "" && (
                    <SystemConfirmModal
                        hideConfirm= {this.confirmCancel.bind(this)}
                        confirmCancel= {this.confirmCancel.bind(this)}
                        confirmOk= {this.register.bind(this)}
                        confirmTitle= {this.state.confirm_message}
                    />
                )}
            </Modal>
        );
    }
}

InputNameModal.contextType = Context;

InputNameModal.propTypes = {
    closeModal: PropTypes.func,
    type: PropTypes.string,
    patientId: PropTypes.number,
    number: PropTypes.number,
    register_category: PropTypes.number,
    register_key: PropTypes.number,
    category_name: PropTypes.string,
    set_name: PropTypes.string,
};

export default InputNameModal;
