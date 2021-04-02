import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import Radiobox from "~/components/molecules/Radiobox";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    .flex {
        display: flex;
    }
    .react-datepicker-wrapper {
        width: 100%;
        .react-datepicker__input-container {
            width: 100%;
            input {
                font-size: 14px;
                width: 100%;
                height: 38px;
                border-radius: 4px;
                border-width: 1px;
                border-style: solid;
                border-color: rgb(206, 212, 218);
                border-image: initial;
                padding: 0px 8px;
            }
        } 
    }
    .div-title {
        line-height: 38px;
        margin-top: 8px;
        margin-right: 8px;
        margin-left: 8px;
    }
    .inspection-period {
        .from-to{
            padding-left:5px;                
            padding-right:5px;    
            line-height: 38px;
            margin-top: 8px;            
        }
        .label-title {
            width: 0;
            margin: 0;
        }
    }
    .block-area {
        margin-top: 10px;
        border:1px solid #aaa;
        .div-content {
            border:1px solid #aaa;
            margin-left: 20px;
            margin-bottom: 10px;
            margin-right: 20px;
            height: 100px;
            overflow-y: auto;
        }
    }
    .row-item {
        cursor:pointer;
        padding-left: 5px;
    }
    .selected{
        background: lightblue;
    }
    .select-box-area {
        margin-top: 10px;
        .label-title {
            width: 55px;
            text-align: right;
            margin-right: 10px;
        }
        select {
            width: 150px;
        }
    }
    .output-btn {
        border: 1px solid #aaa;
        margin-top: 20px;
        padding-left: 40px;
        padding-right: 40px;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .input-count {
        margin-bottom: 10px;
        .label-title {
            width: 80px;
            text-align: right;
            line-height: 30px;
            margin-bottom: 0;
        }
    }
`;

const Footer = styled.div`
  span{
    color: white;
    font-size: 16px;
  }
  button{
    float: right;
    padding: 5px;
    font-size: 16px;
    margin-right: 16px;
  }
`;

class OutExamCooperationRequestOutputModal extends Component {
    constructor(props) {
        super(props);
        let cur_date = new Date();
        this.state = {
            start_date:new Date(),
            end_date:cur_date.setDate(cur_date.getDate() + 1),
            first_list:[
                {id:1,value:"外注先1"},
                {id:2,value:"外注先2"},
                {id:3,value:"外注先3"},
            ],
            selected_item1_id:'',
            selected_item1_name:'',
            output_type:1,
            item_create_type:0,
            item_create_type_condition:'',
            department_code:0,
            ward_id:0,
            output_count:""
        };
        this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }

    async componentDidMount() {

    }

    setPeriod=(key,value)=>{
        this.setState({[key]:value});
    };

    selectFirst = (item) => {
        this.setState({
            selected_item1_id : item.id,
            selected_item1_name : item.value,
        })
    };

    setOutputType = (e) => {
        this.setState({output_type:parseInt(e.target.value)});
    }

    setItemCreateType = (e) => {
        this.setState({item_create_type:parseInt(e.target.value)});
    }

    setItemCreateTypeCondition = (e) => {
        this.setState({item_create_type_condition:parseInt(e.target.value)});
    }

    setDepartment = (e) => {
        this.setState({
            department_code:parseInt(e.target.id),
        });
    };

    setWard = (e) => {
        this.setState({
            ward_id:parseInt(e.target.id),
        });
    };

    setOutputCount = e => {
        this.setState({output_count: e.target.value})
    };

    render() {
        return (
            <>
                <Modal show={true} className="custom-modal-sm patient-exam-modal out-exam-cooperation-request-output-modal">
                    <Modal.Header><Modal.Title>外注検査連携依頼出力</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                            <div className={'inspection-period flex'}>
                                <div className={'div-title'} style={{marginTop:"8px"}}>受付日</div>
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
                            <div className={'block-area'}>
                                <div className={'div-title'}>外注先</div>
                                <div className={'div-content'}>
                                    {this.state.first_list != null && this.state.first_list.length > 0 && (
                                        this.state.first_list.map(item => {
                                            return(
                                                <>
                                                    <div className={this.state.selected_item1_id == item.id ? 'row-item selected' : 'row-item'} onClick={this.selectFirst.bind(this, item)}>
                                                        {item.value}
                                                    </div>
                                                </>
                                            )
                                        })
                                    )}
                                </div>
                            </div>
                            <div className={'block-area'}>
                                <div className={'div-title'}>出力先区分</div>
                                <div className={'flex'} style={{marginLeft:"25px", marginBottom:"15px"}}>
                                    <Radiobox
                                        label={'ファイルのみ'}
                                        value={1}
                                        getUsage={this.setOutputType.bind(this)}
                                        checked={this.state.output_type === 1}
                                        name={`output_type`}
                                    />
                                    <Radiobox
                                        label={'帳票のみ'}
                                        value={2}
                                        getUsage={this.setOutputType.bind(this)}
                                        checked={this.state.output_type === 2}
                                        name={`output_type`}
                                    />
                                    <Radiobox
                                        label={'ファイル＆帳票'}
                                        value={0}
                                        getUsage={this.setOutputType.bind(this)}
                                        checked={this.state.output_type === 0}
                                        name={`output_type`}
                                    />
                                </div>
                            </div>
                            <div className={'block-area'}>
                                <div className={'div-title'}>項目作成区分</div>
                                <div style={{marginLeft:"25px"}}>
                                    <Radiobox
                                        label={'新規'}
                                        value={0}
                                        getUsage={this.setItemCreateType.bind(this)}
                                        checked={this.state.item_create_type === 0}
                                        name={`item_create_type`}
                                    />
                                </div>
                                <div style={{marginLeft:"25px"}}>
                                    <Radiobox
                                        label={'新規（追加）'}
                                        value={1}
                                        getUsage={this.setItemCreateType.bind(this)}
                                        checked={this.state.item_create_type === 1}
                                        name={`item_create_type`}
                                    />
                                </div>
                                <div style={{marginLeft:"25px"}}>
                                    <Radiobox
                                        label={'再出力（条件なし）'}
                                        value={2}
                                        getUsage={this.setItemCreateType.bind(this)}
                                        checked={this.state.item_create_type === 2}
                                        name={`item_create_type`}
                                    />
                                </div>
                                <div style={{marginLeft:"25px"}}>
                                    <Radiobox
                                        label={'再出力（条件設定）'}
                                        value={3}
                                        getUsage={this.setItemCreateType.bind(this)}
                                        checked={this.state.item_create_type === 3}
                                        name={`item_create_type`}
                                    />
                                    <div className={'flex'} style={{marginLeft:"25px"}}>
                                        <Radiobox
                                            label={'外来'}
                                            value={0}
                                            getUsage={this.setItemCreateTypeCondition.bind(this)}
                                            checked={this.state.item_create_type_condition === 0}
                                            name={`item_create_type_condition`}
                                            isDisabled={this.state.item_create_type !== 3}
                                        />
                                        <Radiobox
                                            label={'入院'}
                                            value={1}
                                            getUsage={this.setItemCreateTypeCondition.bind(this)}
                                            checked={this.state.item_create_type_condition === 1}
                                            name={`item_create_type_condition`}
                                            isDisabled={this.state.item_create_type !== 3}
                                        />
                                    </div>
                                </div>
                                <div className={'flex select-box-area'}>
                                    <div style={{paddingLeft:"10px"}}>
                                        <SelectorWithLabel
                                            title="診療科"
                                            options={this.departmentOptions}
                                            getSelect={this.setDepartment}
                                            departmentEditCode={this.state.department_code}
                                        />
                                    </div>
                                    <div style={{paddingLeft:"10px"}}>
                                        <SelectorWithLabel
                                            title="病棟"
                                            options={[]}
                                            getSelect={this.setWard}
                                            departmentEditCode={this.state.ward_id}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={'block-area'}>
                                <div className={'div-title'}>帳票出力設定</div>
                                <div className={'input-count'}>
                                    <NumericInputWithUnitLabel
                                        label='出力枚数'
                                        value={this.state.output_count}
                                        getInputText={this.setOutputCount.bind(this)}
                                        inputmode="numeric"
                                    />
                                </div>
                            </div>
                            <div className={'flex'}>
                                <div style={{width:"calc(100% - 114px)", paddingTop:"40px"}}>処理を選択後、出力ボタンを押してください。</div>
                                <div className={'output-btn'}>出力</div>
                            </div>
                        </Wrapper>
                    </Modal.Body>
                    <Modal.Footer>
                        <Footer>
                            <Button className="cancel" onClick={this.props.closeModal}>閉じる</Button>
                        </Footer>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}
OutExamCooperationRequestOutputModal.contextType = Context;
OutExamCooperationRequestOutputModal.propTypes = {
    closeModal: PropTypes.func,
};

export default OutExamCooperationRequestOutputModal;
