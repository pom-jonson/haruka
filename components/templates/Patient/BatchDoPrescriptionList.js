import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import ja from "date-fns/locale/ja";
import { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel"
import Checkbox from "~/components/molecules/Checkbox";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    .flex {
        display: flex;
    }
    label {
        line-height: 30px;
        font-size: 16px;
    }
    .patient-id {
        div {
            margin-top: 0;
            .label-title {
                font-size: 16px;
                text-align: left;
                width: 60px;
                margin-right: 0;
            }
            input {
                height: 30px;
                width: calc(100% - 60px);
            }
        }
    }
    .pullbox-label {
        margin-bottom: 0;
        .pullbox-select {
            width: 140px;
            height: 30px;   
        }
    }
    .label-title {
        width: 70px;
        text-align: right;
        line-height: 30px;
        margin-top: 0;
        margin-right: 10px;
        margin-bottom: 0;
        font-size: 16px;
    }
    .select-ward {
        .label-title {
            width: 100px;
        }
    }
    .select-condition {
        border:1px solid #aaa;
        height: 150px;
        width: calc(100% - 380px);
        margin-right: 20px;
        .border-right {
            border-right: 1px solid #aaa;
        }
        .border-bottom {
            border-bottom: 1px solid #aaa;
        }
        div {
            padding-left: 5px;
        }
    }
    .inspection-period {
        width: 360px;
        .div-title {
            line-height: 30px;
            margin-top: 8px;
            width: 80px;
            text-align: center;
        }
        .from-to{
            padding-left:5px;                
            padding-right:5px;    
            line-height: 30px;
            margin-top: 8px;            
        }
        .label-title {
            width: 0;
            margin: 0;
        }
        input {
            width: 120px;
        }
    }
    
    .table-area {
        height: calc(100% - 280px);
        overflow-y: auto;
        padding-top:10px;
        table {
            height: calc(100% - 20px);
        }
        thead {
            height: 30px;
        }
        th {
            text-align: center;
            padding:0;
        }
        td {
            padding:0;
            padding-left:5px;
        }
        .td-check {
            text-align: center;
            width: 25px;
            label {
                margin: 0;
            }
        }
    }
    .chief-physician {
        div {
            margin-top: 0;
            .label-title {
                font-size: 16px;
                text-align: right;
                width: 100px;
                margin-right: 10;
            }
            input {
                height: 30px;
                width: calc(100% - 110px);
            }
        }
    }
    .select-group {
        .label-title {
            width: 110px;
        }
    }
    .select-category {
        .label-title {
            width: 0px;
        }
    }
`;


class BatchDoPrescriptionList extends Component {
    constructor(props) {
        super(props);
        let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
        let department_codes = [{id:0, value:"全て"}];
        let diagnosis = {};
        departmentOptions.map(department=>{
            department_codes.push(department);
            diagnosis[parseInt(department.id)] = department.value;
        });
        this.state = {
            department_codes,
            diagnosis,
            search_patient:0,
            department_id:0,
            first_ward_id:0,
            patient_id:'',
            chief_physician:'',
            start_date: new Date(),
            end_date: new Date(),
            classific:[
                {id:0, value:""},
            ],
            classific_id:0,
            order_category:[
                {id:0, value:""},
            ],
            order_category_id:0,
        };
    }

    async componentDidMount() {
    }

    setSearchPatient = (e) => {
        this.setState({search_patient:parseInt(e.target.value)});
    };

    getDepartment = e => {
        this.setState({
            department_id:e.target.id,
        })
    };

    setWard=(e)=>{
        this.setState({first_ward_id:e.target.id});
    };

    setPatientId = e => {
        this.setState({patient_id: e.target.value})
    };

    setChiefPhysician = e => {
        this.setState({chief_physician: e.target.value})
    };

    setPeriod=(key,value)=>{
        this.setState({[key]:value});
    };

    selectOrder =(name)=>{
        if(name == "select-order"){
            //
        }
    };

    checkWard =(name)=>{
        if(name == "check_ward"){
            //
        }
    };

    checkDepartment =(name)=>{
        if(name == "check_department"){
            //
        }
    };

    setClassific = e =>{
        this.setState({
            classific_id: parseInt(e.target.id),
        });
    };

    setOrderCategory =e=>{
        this.setState({
            order_category_id: parseInt(e.target.id),
        });
    };

    render() {
        return (
            <>
                <Modal
                    show={true}
                    className="custom-modal-sm patient-exam-modal move-meal-calendar first-view-modal"
                >
                    <Modal.Header><Modal.Title>一括Do処方一覧</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                            <div className={'flex'}>
                                <div className={'patient-id flex'}>
                                    <Radiobox
                                        value={1}
                                        getUsage={this.setSearchPatient.bind(this)}
                                        checked={this.state.search_patient === 1}
                                        disabled={true}
                                        name={`search_patient`}
                                    />
                                    <InputWithLabel
                                        label="患者ID"
                                        type="number"
                                        getInputText={this.setPatientId.bind(this)}
                                        diseaseEditData={this.state.patient_id}
                                        isDisabled={this.state.search_patient === 0}
                                    />
                                </div>
                                <div className={'select-department'}>
                                    <SelectorWithLabel
                                        title="依頼科"
                                        options={this.state.department_codes}
                                        getSelect={this.getDepartment}
                                        departmentEditCode={this.state.department_id}
                                    />
                                </div>
                                <div className={'select-ward'}>
                                    <SelectorWithLabel
                                        title="病棟"
                                        options={this.state.ward_master}
                                        getSelect={this.setWard}
                                        departmentEditCode={this.state.first_ward_id}
                                    />
                                </div>
                                <div className={'chief-physician'}>
                                    <InputWithLabel
                                        label="主治医"
                                        type="number"
                                        getInputText={this.setChiefPhysician.bind(this)}
                                        diseaseEditData={this.state.chief_physician}
                                    />
                                </div>
                            </div>
                            <div className={'flex'} style={{paddingTop:"10px"}}>
                                <div className={'select-condition flex'}>
                                    <div className={'border-right'} style={{width:"20%", padding:"0px"}}>
                                        <div className={'border-bottom'}> 入院検索</div>
                                        <div>
                                            <Radiobox
                                                label={'担当患者'}
                                                value={2}
                                                getUsage={this.setSearchPatient.bind(this)}
                                                checked={this.state.search_patient === 2}
                                                disabled={true}
                                                name={`search_patient`}
                                            />
                                        </div>
                                        <div>
                                            <Radiobox
                                                label={'全患者'}
                                                value={3}
                                                getUsage={this.setSearchPatient.bind(this)}
                                                checked={this.state.search_patient === 3}
                                                disabled={true}
                                                name={`search_patient`}
                                            />
                                        </div>
                                        <div>
                                            <Checkbox
                                                label="病棟"
                                                getRadio={this.checkWard.bind(this)}
                                                value={0}
                                                name="check_ward"
                                            />
                                        </div>
                                        <div>
                                            <Checkbox
                                                label="科"
                                                getRadio={this.checkDepartment.bind(this)}
                                                value={0}
                                                name="check_department"
                                            />
                                        </div>
                                    </div>
                                    <div className={'border-right'} style={{width:"20%", padding:"0px"}}>
                                        <div className={'border-bottom'}> 外来検索</div>
                                        <div className={'border-bottom'}>予約日</div>
                                    </div>
                                    <div className={'border-right'} style={{width:"30%", padding:"0px"}}>
                                        <div className={'border-bottom'}> 共通CMフォルダー</div>
                                    </div>
                                    <div style={{width:"30%", padding:"0px"}}>
                                        <div className={'border-bottom'}> 本人用CMフォルダー</div>
                                    </div>
                                </div>
                                <div>
                                    <div className={'inspection-period flex'}>
                                        <div className={'div-title'}>日付設定</div>
                                        <InputWithLabel
                                            type="date"
                                            getInputText={this.setPeriod.bind(this, 'start_date')}
                                            diseaseEditData={this.state.start_date}
                                        />
                                        <div className={'from-to'}>～</div>
                                        <InputWithLabel
                                            type="date"
                                            getInputText={this.setPeriod.bind(this, 'end_date')}
                                            diseaseEditData={this.state.end_date}
                                        />
                                    </div>
                                    <div className={'flex'} style={{paddingTop:"80px", textAlign:"right"}}>
                                        <button style={{width:"60px"}}>表示</button>
                                        <div style={{width:"calc(100% - 170px)", textAlign:"center"}}>件数: 0件</div>
                                        <button style={{width:"110px"}}>案件クリア</button>
                                    </div>
                                </div>
                            </div>
                            <div className={'table-area'}>
                                <table className="table-scroll table table-bordered" id="code-table">
                                    <thead>
                                    <tr>
                                        <th className={'td-check'}> </th>
                                        <th>患者ID</th>
                                        <th>患者氏名</th>
                                        <th>前回処方</th>
                                        <th>前回検査</th>
                                        <th>前回汎用</th>
                                        <th>前回画像</th>
                                        <th>病棟</th>
                                        <th>病室</th>
                                        <th>依頼課</th>
                                        <th>主治医</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <Checkbox
                                                getRadio={this.selectOrder.bind(this)}
                                                value={0}
                                                name="select-order"
                                            />
                                        </td>
                                        <td>3</td>
                                        <td>東朋 太郎</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>病棟4</td>
                                        <td>404号</td>
                                        <td>内科</td>
                                        <td>テスト ドクター</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div style={{textAlign:"right", paddingTop:"10px"}}>
                                <button>全選択</button>
                                <button style={{marginLeft:"10px"}}>全削除</button>
                                <button style={{marginLeft:"10px"}}>表示条件</button>
                                <button style={{marginLeft:"10px"}}>Do</button>
                            </div>
                            <div className={'flex'} style={{paddingTop:"10px"}}>
                                <div className={'flex'} style={{width:"420px"}}>
                                    <div className = "select-group">
                                        <SelectorWithLabel
                                            options={this.state.classific}
                                            title="オーダー設定"
                                            getSelect={this.setClassific}
                                            departmentEditCode={this.state.classific_id}
                                        />
                                    </div>
                                    <div className = "select-category">
                                        <SelectorWithLabel
                                            options={this.state.order_category}
                                            getSelect={this.setOrderCategory}
                                            departmentEditCode={this.state.order_category_id}
                                            isDisabled={this.state.classific_id === 0}
                                        />
                                    </div>
                                </div>
                                <div style={{textAlign:"right", width:"calc(100% - 420px)"}}>
                                    <button onClick={this.props.closeModal}>閉じる</button>
                                </div>
                            </div>
                        </Wrapper>
                    </Modal.Body>
                </Modal>
            </>
        );
    }
}

BatchDoPrescriptionList.contextType = Context;
BatchDoPrescriptionList.propTypes = {
    closeModal: PropTypes.func,
};

export default BatchDoPrescriptionList;
