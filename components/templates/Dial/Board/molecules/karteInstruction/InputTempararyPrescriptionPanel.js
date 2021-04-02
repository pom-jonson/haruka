import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import EditPrescript from "~/components/templates/Dial/Board/molecules/EditPrescript";
import {disable} from "../../../../../_nano/colors";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import InputWithLabel from "../../../../../molecules/InputWithLabel";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import PrescriptMedicineSelectModal from "../../../modals/PrescriptMedicineSelectModal";
import SelectUsageModal from "../../../modals/SelectUsageModal";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  height: 100%;
  .work-area{
    height: 97%;
    .selected p{
        background-color: rgb(38, 159, 191);
        border-color: rgb(38, 159, 191); 
    }
  }
`;

const Table = styled.table`
  font-size: 1rem;
  font-family: "Noto Sans JP", sans-serif;
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
  display: inline-block;
    .changed-area{
    background: lightcoral;
  }
  th{
    position: sticky;
    top: 0px;
  }
  th, td {
    border: 1px solid ${disable};
    padding: 4px;
    button{width: 100%;}
  }
  td {
    .label-title{
        width: 0;
    }
    .label-unit {
        font-size: 1rem;
        line-height: 2rem;
        width: 4.5rem !important;
    }
  }
  .med-area {
    input{
        width: 200px;
    }
  }
  .usage-area {
    input{
        width: 150px;
    }
  }
  
`;
const sortations = ["内服", "頓服", "外用", "処置", "麻酔", "インスリン"];
class InputTempararyPrescriptionPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditPrescriptModal: false,
            temporary_prescripiton_schedule: null,
            isDeleteConfirmModal: false,
            isOpenUsageModal: false,
            isOpenMedicineModal: false,
        }
    }

    componentDidMount() {
        this.initialize();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.temporary_prescription.prev === this.state.temporary_prescripiton_schedule) return;
        this.initialize();
    }
    initialize () {
        if (this.props.temporary_prescription.prev !== undefined){
            this.setState({temporary_prescripiton_schedule:this.props.temporary_prescription.prev})
        }
        if (this.props.temporary_prescription.after !== undefined && this.props.temporary_prescription.after.length > 0){
            this.setState({temporary_prescripiton_schedule:this.props.temporary_prescription.after})
        }
        if (this.props.temporary_prescription.after !== undefined && this.props.temporary_prescription.after.length === 0) {
            let new_presc_schedule = [];
            if (this.props.temporary_prescription.prev.length > 0) {
                this.props.temporary_prescription.prev.map((pres_item) => {
                    let row = {};
                    Object.keys(pres_item).map(idx => {
                        if (idx !== "data_json") {
                            row[idx] = pres_item[idx];
                            if(pres_item['pattern_number'] > 0) {
                                row['is_pattern'] = 1;
                            } else {
                                row['is_pattern'] = 0;
                            }
                        } else {
                            let row_json = [];
                            pres_item.data_json.map(rp_item => {
                                let rp_row = {};
                                Object.keys(rp_item).map(rp_idx => {
                                    rp_row[rp_idx] = rp_item[rp_idx];
                                    let medicines = [];
                                    if (rp_idx === "medicines") {
                                        rp_item.medicines.map(medi_item => {
                                            let medi_row = {};
                                            Object.keys(medi_item).map(medi_idx => {
                                                medi_row[medi_idx] = medi_item[medi_idx];
                                                medi_row.is_original = 1;
                                            });
                                            medicines.push(medi_row);
                                        });
                                        rp_row['medicines'] = medicines;
                                        rp_row.is_original = 1;
                                    }
                                });
                                row_json.push(rp_row);
                                row['data_json'] = row_json;
                            })
                        }

                    });
                    new_presc_schedule.push(row);
                });
            }
            this.setState({temporary_prescripiton_schedule:new_presc_schedule});
        }
    }

    showPrescript = () => {
        this.setState({isEditPrescriptModal: true});
    };

    closeModal = () => {
        this.setState({
            isEditPrescriptModal: false,
            isOpenUsageModal: false,
            isOpenMedicineModal: false,
        });
    };

    handleOk = async (data) => {
        this.closeModal();
        if (data == null || data.length === 0) return;
        data = data[0];
        let {temporary_prescripiton_schedule} = this.state;
        if (temporary_prescripiton_schedule !== undefined && temporary_prescripiton_schedule != null && temporary_prescripiton_schedule.length == 0){
            temporary_prescripiton_schedule.push(data);
        }
        if (temporary_prescripiton_schedule == undefined) {
            temporary_prescripiton_schedule = [];
            temporary_prescripiton_schedule.push(data);
        }
        var edit_index = temporary_prescripiton_schedule.findIndex(x=>x.regular_prescription_number == data.regular_prescription_number);
        Object.keys(data).map(index=>{
            if (edit_index > -1)
                temporary_prescripiton_schedule[edit_index][index] = data[index];
                if (temporary_prescripiton_schedule[edit_index].is_deleted  == 1)
                temporary_prescripiton_schedule[edit_index].is_deleted = 0;
                if (temporary_prescripiton_schedule[edit_index].data_json !== undefined && temporary_prescripiton_schedule[edit_index].data_json.findIndex(x=>x.is_deleted != 1 ) == -1) {
                    temporary_prescripiton_schedule[edit_index].is_deleted = 1;
                }
        });
        this.props.handleTemporaryOk(temporary_prescripiton_schedule);
        this.setState({temporary_prescripiton_schedule});
    };

    delete = (pres_key,rp_key,medi_key) => {
        let prev = this.state.temporary_prescripiton_schedule;
        let med_name = "";
        if (prev !== undefined && prev != null && prev.length >0)
            med_name = prev[pres_key].data_json[rp_key].medicines[medi_key]['item_name'];

        this.setState({
            isDeleteConfirmModal : true,
            confirm_message: "薬剤を削除しますか?",
            waring_message: med_name,
            pres_key,rp_key,medi_key
        });
    };

    delMedicine = async() => {
        let {pres_key,rp_key,medi_key} = this.state;
        let prev = this.state.temporary_prescripiton_schedule;
        if (prev !== undefined && prev != null && prev.length >0)
        prev[pres_key].data_json[rp_key].medicines[medi_key]['is_deleted']=1;
        if (prev[pres_key].data_json[rp_key].medicines.findIndex(x=>x.is_deleted!=1) == -1) {
            prev[pres_key].data_json[rp_key].is_deleted = 1;
        }
        if (prev[pres_key].data_json.findIndex(x=>x.is_deleted != 1 ) == -1) {
            prev[pres_key].is_deleted = 1;
        }
        
        this.props.handleTemporaryOk(prev);

        this.setState({
            temporary_prescripiton_schedule:prev,
            confirm_message: "",
            isDeleteConfirmModal:false,
            waring_message: ""
        });
    };

    confirmCancel() {
        this.setState({
            isDeleteConfirmModal: false,
            confirm_message: "",
            waring_message: "",
        });
    }

    handleUsageOk = (val) => {
        let {temporary_prescripiton_schedule} = this.state;
        temporary_prescripiton_schedule[this.state.presc_key].data_json[this.state.rp_key].usage_name = val.usage_name;
        temporary_prescripiton_schedule[this.state.presc_key].data_json[this.state.rp_key].usage_code = val.usage_code;
        temporary_prescripiton_schedule[this.state.presc_key].data_json[this.state.rp_key].days = val.days;
        this.setState({
            isOpenUsageModal: false,
            temporary_prescripiton_schedule,
        });
    };

    changeUsage = (prescription_category, presc_key, rp_key, medi_key) => {
        let {temporary_prescripiton_schedule} = this.state;
        if( temporary_prescripiton_schedule[presc_key] == null || temporary_prescripiton_schedule[presc_key].data_json == undefined) return;
        this.setState({
            isOpenUsageModal: true,
            medicine_kind: sortations.indexOf(prescription_category),
            presc_key,
            rp_key,
            medi_key,
        });
    };

    getAmount = (presc_key, rp_key, medi_key,e) => {
        if(parseFloat(e) < 0) e = 0;
        let {temporary_prescripiton_schedule} = this.state;
        if( temporary_prescripiton_schedule[presc_key] == null || temporary_prescripiton_schedule[presc_key].data_json == undefined) return;
        temporary_prescripiton_schedule[presc_key].data_json[rp_key].medicines[medi_key].amount = e;
        this.setState({
            temporary_prescripiton_schedule,
        });
        this.props.handleTemporaryOk(temporary_prescripiton_schedule);
    };

    handleMedicineOk= (medicine_data) => {
        let {temporary_prescripiton_schedule} = this.state;
        temporary_prescripiton_schedule[this.state.presc_key].data_json[this.state.rp_key].medicines[this.state.medi_key] = medicine_data;
        this.setState({
            isOpenMedicineModal: false,
            temporary_prescripiton_schedule,
        });
        this.props.handleTemporaryOk(temporary_prescripiton_schedule);
    };

    changeMedicine = (prescription_category, presc_key, rp_key, medi_key) => {
        let {temporary_prescripiton_schedule} = this.state;
        if( temporary_prescripiton_schedule[presc_key] == null || temporary_prescripiton_schedule[presc_key].data_json == undefined) return;
        this.setState({
            prescription_category,
            isOpenMedicineModal:true,
            presc_key,
            rp_key,
            medi_key,
        });
    };

    render() {
        let presc_list = this.state.temporary_prescripiton_schedule;
        return  (
            <Wrapper>
                <div className="">
                    <div><p className='border text-center selected' style={{cursor: "pointer",width:"7rem", fontSize: "1rem", lineHeight:"2.37rem"}} onClick={this.showPrescript}>臨時処方</p></div>
                    <div className={`w-100`}>
                        <Table>
                        <tr>
                            <th style={{width:"50%"}}>薬剤名</th>
                            <th style={{width: 100}}>一日量</th>
                            <th style={{width:"25%"}}>服用時点</th>
                            <th style={{width: 80}}/>
                        </tr>
                        {presc_list !== undefined && presc_list != null && presc_list.length > 0 && presc_list.map((pres_item,pres_key)=>{
                            return (
                                <>
                                {pres_item.data_json !== undefined && pres_item.data_json.length > 0 && pres_item.data_json.map((rp_item, rp_key)=>{
                                        return (
                                            <>
                                                {rp_item.medicines.length > 0 && rp_item.medicines.map((medi_item,medi_key)=>{
                                                    return (
                                                        <>
                                                            <tr className={(medi_item.is_deleted == 1 || rp_item.is_deleted == 1) ? "changed-area" : ""}>
                                                                <td>
                                                                    <div onClick={this.changeMedicine.bind(this, rp_item.prescription_category,pres_key,rp_key,medi_key)}>
                                                                        <InputWithLabel
                                                                            label=""
                                                                            type="text"
                                                                            diseaseEditData={medi_item.item_name + (medi_item.is_not_generic == 1 ? "【後発変更不可】": "" )}
                                                                        />
                                                                    </div>
                                                                    </td>
                                                                <td>
                                                                    <NumericInputWithUnitLabel
                                                                        label=''
                                                                        value={medi_item.amount}
                                                                        getInputText={this.getAmount.bind(this,pres_key,rp_key,medi_key)}
                                                                        inputmode="numeric"
                                                                        unit={medi_item.unit != undefined ? medi_item.unit: ''}
                                                                    />
                                                                </td>
                                                                <td>
                                                                    {medi_key === 0 ? (
                                                                        <div onClick={this.changeUsage.bind(this, rp_item.prescription_category,pres_key,rp_key,medi_key)}>
                                                                            <InputWithLabel
                                                                                label=""
                                                                                type="text"
                                                                                diseaseEditData={rp_item.usage_name !== undefined ? rp_item.usage_name +
                                                                                    (rp_item.disable_days_dosing == 0? "("+rp_item.days+(rp_item.prescription_category == "頓服"? "回分)" : "日分)") : "")  : ""}
                                                                            />
                                                                        </div>
                                                                    ):(<></>)}
                                                                </td>
                                                                <td><button onClick={this.delete.bind(this,pres_key,rp_key,medi_key)}>削除</button></td>
                                                            </tr>
                                                        </>
                                                    )
                                                })}
                                            </>
                                        )
                                    })}
                                 </>
                            )
                        })}
                    </Table>
                    </div>
                </div>
                {this.state.isEditPrescriptModal && (
                    <EditPrescript
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        schedule_date={this.props.schedule_date}
                        patientInfo={this.props.patientInfo}
                        editPrescriptType={1}
                        from_karte={1}
                        schedule_item={JSON.parse(JSON.stringify(presc_list))}
                    />
                )}
                {this.state.isDeleteConfirmModal !== false && (
                    <SystemConfirmJapanModal
                        hideConfirm= {this.confirmCancel.bind(this)}
                        confirmCancel= {this.confirmCancel.bind(this)}
                        confirmOk= {this.delMedicine.bind(this)}
                        confirmTitle= {this.state.confirm_message}
                        waring_message= {this.state.waring_message}
                    />
                )}
                {this.state.isOpenUsageModal && (
                    <SelectUsageModal
                        handleOk={this.handleUsageOk}
                        closeModal={this.closeModal}
                        medicine_kind={this.state.medicine_kind}
                        modal_data={this.state.modal_data}
                    />
                )}
                {this.state.isOpenMedicineModal && (
                    <PrescriptMedicineSelectModal
                        handleOk={this.handleMedicineOk}
                        closeModal={this.closeModal}
                        medicine_type_name={''}
                        modal_data={[]}
                        rp_number={this.state.rp_number}
                        is_open_usage={0}
                        medicine_kind={this.state.prescription_category}
                    />
                )}
            </Wrapper>
        )}
}

InputTempararyPrescriptionPanel.contextType = Context;

InputTempararyPrescriptionPanel.propTypes = {
    schedule_date:PropTypes.string,
    patientInfo:PropTypes.object,
    is_temporary:PropTypes.number,
    handleTemporaryOk:PropTypes.func,
    temporary_prescription:PropTypes.array,
};

export default InputTempararyPrescriptionPanel;