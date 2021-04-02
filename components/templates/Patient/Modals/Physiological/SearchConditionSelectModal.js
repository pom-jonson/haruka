import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Checkbox from "~/components/molecules/Checkbox";

const Wrapper = styled.div`
  overflow-y: auto;
  height: 100%;
  .flex {
    display: flex;
  }
  .period-area {
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
  table {
    td {padding:0;}
    .td-check {
      text-align: center;
      width: 25px;
      label {margin: 0;}
    }
  }
  .div-border {border: 1px solid #aaa;}
  .medical_department-ward {
    height: calc(100% - 80px);
    padding-top: 15px;
    width: 100%;
    .medical-department {
      width: 50%;
      .medical-department-list {
        width: calc(100% - 20px);
        margin: auto;
        margin-top: 10px;
        height: calc(100% - 60px);
      }
    }
    .ward {
      width: 50%;
      .ward-list {
        width: calc(100% - 20px);
        margin: auto;
        margin-top: 10px;
        height: calc(100% - 60px);
      }
    }
  }
`;

class SearchConditionSelectModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start_date:props.condition_data.start_date,
            end_date:props.condition_data.end_date,
            department_codes:props.condition_data.department_codes,
            inspection_types:props.condition_data.inspection_types,
            order_kinds:this.props.condition_data.order_kinds,
        }
        this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }

    selectDepartmentAll =(act)=>{
        let department_codes = [];
        if(act == "select"){
            this.departmentOptions.map(item=>{
                department_codes.push(item.id);
            });
        }
        this.setState({
            department_codes,
        });
    }

    selectInspectionAll =(act)=>{
        let inspection_types = [];
        if(act == "select"){
            this.state.order_kinds.map(item=>{
                if(item.id != 0){
                    inspection_types.push(item.id);
                }
            });
        }
        this.setState({
            inspection_types,
        });
    }

    setInspectionPeriod=(key,value)=>{
        this.setState({[key]:value});
    };

    selectDepartmentCode =(name, number)=>{
        if(name == "department_code"){
            let department_codes = this.state.department_codes;
            let index = department_codes.indexOf(number);
            if(index === -1){
                department_codes.push(number);
            } else {
                department_codes.splice(index, 1);
            }
            this.setState({
                department_codes,
            });
        }
    }

    selectInspectionType =(name, number)=>{
        if(name == "inspection_type"){
            let inspection_types = this.state.inspection_types;
            let index = inspection_types.indexOf(number);
            if(index === -1){
                inspection_types.push(number);
            } else {
                inspection_types.splice(index, 1);
            }
            this.setState({
                inspection_types,
            });
        }
    }

    createDepartmentTable=()=>{
        let html = [];
        for(let index = 0; index < this.departmentOptions.length; index+=2){
            html.push(
                <tr>
                    <td className={'td-check'}>
                        {this.departmentOptions[index] !== undefined && this.departmentOptions[index] != null && (
                            <Checkbox
                                getRadio={this.selectDepartmentCode.bind(this)}
                                value={(this.state.department_codes.includes(this.departmentOptions[index]['id']))}
                                number={this.departmentOptions[index]['id']}
                                name="department_code"
                            />
                        )}
                    </td>
                    <td>{this.departmentOptions[index] !== undefined && this.departmentOptions[index] != null ? this.departmentOptions[index]['value'] : ''}</td>
                    <td className={'td-check'}>
                        {this.departmentOptions[index+1] !== undefined && this.departmentOptions[index+1] != null && (
                            <Checkbox
                                getRadio={this.selectDepartmentCode.bind(this)}
                                value={(this.state.department_codes.includes(this.departmentOptions[index+1]['id']))}
                                number={this.departmentOptions[index+1]['id']}
                                name="department_code"
                            />
                        )}
                    </td>
                    <td>{this.departmentOptions[index+1] !== undefined && this.departmentOptions[index+1] != null ? this.departmentOptions[index+1]['value'] : ''}</td>
                </tr>
            )
        }
        return html;
    }

    createInspectionTypeTable=()=>{
      let html = [];
      for(let index = (this.props.order_type === 'inspection' ? 1 : 0); index < this.state.order_kinds.length; index+=2){
          html.push(
              <tr>
                  <td className={'td-check'}>
                      {this.state.order_kinds[index] !== undefined && this.state.order_kinds[index] != null && (
                          <Checkbox
                              getRadio={this.selectInspectionType.bind(this)}
                              value={(this.state.inspection_types.includes(this.state.order_kinds[index]['id']))}
                              number={this.state.order_kinds[index]['id']}
                              name="inspection_type"
                          />
                      )}
                  </td>
                  <td>{this.state.order_kinds[index] !== undefined && this.state.order_kinds[index] != null ? this.state.order_kinds[index]['value'] : ''}</td>
                  <td className={'td-check'}>
                      {this.state.order_kinds[index+1] !== undefined && this.state.order_kinds[index+1] != null && (
                          <Checkbox
                              getRadio={this.selectInspectionType.bind(this)}
                              value={(this.state.inspection_types.includes(this.state.order_kinds[index+1]['id']))}
                              number={this.state.order_kinds[index+1]['id']}
                              name="inspection_type"
                          />
                      )}
                  </td>
                  <td>{this.state.order_kinds[index+1] !== undefined && this.state.order_kinds[index+1] != null ? this.state.order_kinds[index+1]['value'] : ''}</td>
              </tr>
          )
      }
      return html;
    }

    handleOk=()=>{
        this.props.handleOk(this.state);
    }

    render() {
        return (
            <>
                <Modal show={true} className="custom-modal-sm patient-exam-modal inspection-department-result-modal">
                    <Modal.Header><Modal.Title>検索条件選択</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                            <div className={'period-area'}>
                                <div>期間設定</div>
                                <div className={'inspection-period flex'}>
                                    <InputWithLabel
                                        type="date"
                                        getInputText={this.setInspectionPeriod.bind(this, 'start_date')}
                                        diseaseEditData={this.state.start_date}
                                    />
                                    <div className={'from-to'}>～</div>
                                    <InputWithLabel
                                        type="date"
                                        getInputText={this.setInspectionPeriod.bind(this, 'end_date')}
                                        diseaseEditData={this.state.end_date}
                                    />
                                </div>
                            </div>
                            <div className={'medical_department-ward'}>
                                <div style={{paddingLeft:"5px"}}>一覧条件表示</div>
                                <div className={'div-border flex'} style={{height:"calc(100% - 30px)"}}>
                                    <div className={'ward'}>
                                        <div className={'flex'} style={{paddingTop:"10px"}}>
                                            <div style={{paddingLeft:"10px", width:"calc(100% - 220px)", lineHeight:"30px"}}>伝票種別</div>
                                            <button onClick={this.selectInspectionAll.bind(this, 'select')} style={{marginRight:"10px"}}>すべて選択</button>
                                            <button onClick={this.selectInspectionAll.bind(this, 'delete')}>すべて削除</button>
                                        </div>
                                        <div className={'ward-list div-border'}>
                                            <table className="table-scroll table table-bordered">
                                                {this.createInspectionTypeTable()}
                                            </table>

                                        </div>
                                    </div>
                                    <div className={'medical-department'}>
                                        <div className={'flex'} style={{paddingTop:"10px"}}>
                                            <div style={{paddingLeft:"10px", width:"calc(100% - 220px)", lineHeight:"30px"}}>診療科</div>
                                            <button onClick={this.selectDepartmentAll.bind(this, 'select')} style={{marginRight:"10px"}}>すべて選択</button>
                                            <button onClick={this.selectDepartmentAll.bind(this, 'delete')}>すべて削除</button>
                                        </div>
                                        <div className={'medical-department-list div-border'}>
                                            <table className="table-scroll table table-bordered">
                                                {this.createDepartmentTable()}
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Wrapper>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                      <Button className="red-btn" onClick={this.handleOk}>確定</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}
SearchConditionSelectModal.contextType = Context;
SearchConditionSelectModal.propTypes = {
    closeModal: PropTypes.func,
    handleOk: PropTypes.func,
    condition_data: PropTypes.array,
    order_type: PropTypes.string,
};

export default SearchConditionSelectModal;
