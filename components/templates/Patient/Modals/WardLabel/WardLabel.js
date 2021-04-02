import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import ja from "date-fns/locale/ja";
import { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import Radiobox from "~/components/molecules/Radiobox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel"
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import Button from "~/components/atoms/Button";
import WardLabelSlipModal from "./WardLabelSlipModal";

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
    .top-flex{
        display: flex;
        justify-content: space-between;
        .top-left{
            display: flex;
        }
        .ward{
            margin-top: 8px;
        }
        .input-patient{
            input{
                height: 30px;
            }
        }
        .sample-date{
            label{
                text-align: left;
                width: 50px;
            }
            input{
                height: 30px;
            }
        }
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
    fieldset{
        border: 1px solid #aaa;
        margin-right: 10px;
        width: 18rem;
        padding-bottom: 10px;
      }
      legend{
        width: auto;
        margin-left: 20px;
        padding-left: 10px;
        padding-right: 10px;
        font-size: 1rem;

      }
    .select-condition {
        border:1px solid #aaa;
        height: 150px;
        // width: calc(100% - 380px);
        width: 300px;
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
    .operate-condition{
        height: 150px;
        position: relative;
        .display-btn{
            bottom: 0px;
            position: absolute;
        }
    }
    .inspection-period {
        width: 360px;
        .div-title {
            line-height: 30px;
            margin-top: 8px;
            width: 80px;
            text-align: right;
            padding-right: 10px;
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
        padding-top:10px;
        table {
            height: calc(100% - 20px);
        }
        thead {
            height: 30px;
            display: table;
            width: 100%;
            tr{
                display: table;
                width: 100%;
                height: 30px;
            }
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
            width: 2.5rem;
            label {
                margin: 0;
            }
        }

        .td-id {
            width: 2.5rem;
        }
        .td-no {
            width: 7rem;
        }
        .td-patient-id {
            width: 12rem;
        }
        .td-name {
            width: 15rem;
        }
        .td-sex {
            width: 5rem;
        }
        .td-age {
            width: 9rem;
        }
        .td-birthday {
            width: 12rem;
        }   
        
        tbody{
            display: block;
            width: 100%;
            overflow-y: auto;
            height: calc(100% - 30px);
            tr{
                display: table;
                width: 100%;
            }
        }
    }       
    .outpatient-select-department{
        .pullbox{
            padding-left: 2px;
            margin-top: 2px;
        }
        .pullbox-title{
            padding-left: 0px;
            margin-right: 5px;
            width: 15px;
        }
        .pullbox-label{
            width: calc(100% - 15px);
        }
        .pullbox-select{
            width: 100%;
        }
    }
    .period-date-format{        
        line-height: 30px;
        margin-top: 8px;
    }
    .order-setting{
        width: 420px;
        height: 70px;
        position: relative;
        .order-set-content{
            width: 420px;
            bottom: 0px;
            position: absolute;
        }
    }
    .do-area{
        width: calc(100% - 420px);
        height: 70px;
        position: relative;
        .do-area-bottom{
            position: absolute;
            bottom: 0px;
            width: 100%;
        }
        button{
            width: 90px;
        }
    } 
    button{
        height: 30px;        
    }   
`;


class WardLabel extends Component {
    constructor(props) {
        super(props);        
        this.state = {
            result_list: [],
            isOpenWardLabelSlipModal: false,
            out_method: 1,
            out_type: 1,
            sample_date: new Date(),
            out_table_exam: 0,
            out_table_bacterial: 0,
            out_table_pathological: 0,
        };   
        this.ward_list=[
            {id:0, value:"病棟1"},
            {id:1, value:"病棟2"},
            {id:2, value:"病棟3"},            
        ]     
    }

    async componentDidMount() {        
        // 病棟検体ラベルデータ取得
        // await this.getWardLabelData();
    }    

    handleRefreshContent = () => {
        this.getWardLabelData();
    }

    handleAllCheck = () => {
        let prescription_list = this.state.prescription_list;
        Object.keys(prescription_list).map(key=>{
            prescription_list[key].checked = true;
        });
        this.setState({
            prescription_list
        });
    }

    handleAllUnCheck = () => {
        let prescription_list = this.state.prescription_list;
        Object.keys(prescription_list).map(key=>{
            prescription_list[key].checked = false;
        });
        this.setState({
            prescription_list
        });
    }

    setSampleDate = (value) => {    
        this.setState({ sample_date: value });
    };

    getWard = (e) => { 
        this.setState({ ward: parseInt(e.target.id) });
    };

    setOutType = (e) => {
        if (this.state.out_type == e.target.value) return;
        this.setState({out_type:parseInt(e.target.value)});
    };

    setOutMethod = (e) => {
        if (this.state.out_method == e.target.value) return;
        this.setState({out_method:parseInt(e.target.value)});
    };

    selectOrder =(name, value, number)=>{
        if (name == "select-order") {
            let result_list = this.state.result_list;
            Object.keys(result_list).map(key=>{
                if (key == number) {
                    result_list[key].checked = !result_list[key].checked;
                }
            });            
            this.setState({
                result_list
            });
        }

    };

    checkCategory =(name, value)=>{
        if(name == "out_table_exam"){
            this.setState({
                out_table_exam: value
            });
        } else if(name == "out_table_pathological"){
            this.setState({
                out_table_pathological: value
            });
        } else if(name == "out_table_bacterial"){
            this.setState({
                out_table_bacterial: value
            });
        }
    };

    openWardLabelSlip = () => {
        this.setState({
            isOpenWardLabelSlipModal: true
        });
    }

    cancelModal = () => {
        this.setState({
            isOpenWardLabelSlipModal: false
        });
    }

    render() {        
        return (
            <>
                <Modal
                    show={true}
                    className="custom-modal-sm patient-exam-modal move-meal-calendar first-view-modal"
                >
                    <Modal.Header><Modal.Title>病棟検体ラベル</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                            <div className={'top-flex'}>
                                <div className="top-left">
                                    <div className={'sample-date'}>
                                      <InputWithLabelBorder
                                        id="start_date_id"
                                        label="採取日"
                                        type="date"
                                        getInputText={this.setSampleDate.bind(this)}
                                        diseaseEditData={this.state.sample_date}
                                      />
                                    </div>
                                    <div className={'ward'}>
                                        <SelectorWithLabel
                                            title="病棟"
                                            options={this.ward_list}
                                            getSelect={this.getWard}
                                            departmentEditCode={this.state.ward}
                                        />
                                    </div>
                                </div>                                
                                <div className="top-right">
                                    <div className={'input-patient'}>
                                        <InputWithLabel
                                            label="患者ID"
                                            type="number"
                                            // getInputText={this.setChiefPhysician.bind(this)}
                                            diseaseEditData={this.state.patient_id}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={'flex'} style={{paddingTop:"10px"}}>
                                <fieldset className="field-1">
                                    <legend>出力方法</legend>
                                    <div style={{paddingLeft:"10px"}}>
                                        <Radiobox
                                            label={'患者毎出力'}
                                            value={1}
                                            getUsage={this.setOutMethod.bind(this)}
                                            checked={this.state.out_method === 1}
                                            disabled={true}
                                            name={`out_method`}
                                        />
                                    </div>
                                    <div style={{paddingLeft:"10px"}}>
                                        <Radiobox
                                            label={'病棟毎一括出力'}
                                            value={2}
                                            getUsage={this.setOutMethod.bind(this)}
                                            checked={this.state.out_method === 2}
                                            disabled={true}
                                            name={`out_method`}
                                        />
                                    </div>
                                </fieldset>
                                <fieldset className="field-1">
                                    <legend>出力モード</legend>
                                    <div style={{paddingLeft:"10px"}}>
                                        <Radiobox
                                            label={'未出力分のみ印刷'}
                                            value={1}
                                            getUsage={this.setOutType.bind(this)}
                                            checked={this.state.out_type === 1}
                                            disabled={true}
                                            name={`out_type`}
                                        />
                                    </div>
                                    <div style={{paddingLeft:"10px"}}>
                                        <Radiobox
                                            label={'出力済分のみ再印刷'}
                                            value={2}
                                            getUsage={this.setOutType.bind(this)}
                                            checked={this.state.out_type === 2}
                                            disabled={true}
                                            name={`out_type`}
                                        />
                                    </div>
                                    <div style={{paddingLeft:"10px"}}>
                                        <Radiobox
                                            label={'全て印刷'}
                                            value={3}
                                            getUsage={this.setOutType.bind(this)}
                                            checked={this.state.out_type === 3}
                                            disabled={true}
                                            name={`out_type`}
                                        />
                                    </div>
                                    <div style={{paddingLeft:"10px"}}>
                                        <Radiobox
                                            label={'検査伝票一覧の表示'}
                                            value={4}
                                            getUsage={this.setOutType.bind(this)}
                                            checked={this.state.out_type === 4}
                                            disabled={true}
                                            name={`out_type`}
                                        />
                                    </div>
                                </fieldset>  
                                <div style={{marginLeft:"10px"}}>
                                    <div>出力伝票</div>
                                    <div>
                                        <Checkbox
                                            label="検体検査"
                                            getRadio={this.checkCategory.bind(this)}
                                            value={this.state.out_table_exam}
                                            name="out_table_exam"
                                            checked={this.state.out_table_exam == 1}
                                        />
                                    </div>
                                    <div className="flex">
                                        <div>
                                            <Checkbox
                                                label="細菌検査"
                                                getRadio={this.checkCategory.bind(this)}
                                                value={this.state.out_table_bacterial}
                                                name="out_table_bacterial"
                                                checked={this.state.out_table_bacterial == 1}
                                            />
                                        </div>
                                        <div>
                                            <Checkbox
                                                label="病理検査"
                                                getRadio={this.checkCategory.bind(this)}
                                                value={this.state.out_table_pathological}
                                                name="out_table_pathological"
                                                checked={this.state.out_table_pathological == 1}
                                            />
                                        </div>
                                    </div>
                                    <div>検体ラベルを出力したい伝票を選択してください。</div>
                                </div>                                                      
                            </div>
                            <div className={'flex display-btn'} style={{paddingTop:"10px"}}>
                                <Button type="common" style={{width:"90px"}} onClick={this.handleRefreshContent}>最新表示</Button>
                                <Button type="common" style={{width:"110px",marginLeft:"20px"}}>選択クリア</Button>
                            </div>
                            <div className={'table-area'}>
                                <table className="table-scroll table table-bordered" id="code-table">
                                    <thead>
                                    <tr>
                                        <th className="td-check"></th>
                                        <th className="td-id"></th>
                                        <th className="td-no">番号</th>
                                        <th className="td-patient-id">患者ID</th>
                                        <th className="td-name">氏名</th>
                                        <th className="td-sex">性別</th>
                                        <th className="td-age">年齢</th>
                                        <th className="td-birthday">生年月日</th>
                                        <th className="td-department">診療科</th>                                    
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.result_list.length > 0 && this.state.result_list.map((item, index)=>{
                                            return(   
                                                <>
                                                    <tr>
                                                        <td className="td-check">
                                                            <Checkbox
                                                                getRadio={this.selectOrder.bind(this, index)}
                                                                value={item.checked}
                                                                number={index}
                                                                name="select-order"                                                                
                                                            />
                                                        </td>
                                                        <td className="td-id">{index + 1}</td>
                                                        <td className="td-no">{item.no}</td>
                                                        <td className="td-patient-id">{item.patient_id}</td>
                                                        <td className="td-name">{item.name}</td>
                                                        <td className="td-sex">{item.sex}</td>
                                                        <td className="td-age">{item.age}</td>
                                                        <td className="td-birthday">{item.birthday}</td>
                                                        <td className="td-department">{item.department_name}</td>
                                                    </tr>
                                                </>                                     
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>   
                            {this.state.isOpenWardLabelSlipModal == true && (
                                <WardLabelSlipModal 
                                    cancelModal={this.cancelModal}                                    
                                    // handleConfirmDate={this.handleConfirmDate}                                    
                                />
                            )}                                             
                        </Wrapper>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
                        <Button className="red-btn" onClick={this.openWardLabelSlip}>確認</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

WardLabel.contextType = Context;
WardLabel.propTypes = {
    closeModal: PropTypes.func,
    patientId: PropTypes.number,
};

export default WardLabel;
