import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
// import Radiobox from "~/components/molecules/Radiobox";
import Button from "~/components/atoms/Button";
import * as colors from "~/components/_nano/colors";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios/index";

const Wrapper = styled.div`  
    .header{
        
    }
    .flex{
        display:flex;
    }
    .radio-area{
        width:45%;        
        margin-right: 10px;
        margin-top: 5px;
        border:1px solid darkgray;
        padding: 5px;    
        legend{
        font-size: 16px;
        width: auto;
        margin-bottom: 0;
        padding-left: 10px;
        margin-left: 10px;
        padding-right: 10px;
        }
        margin-bottom:10px;
        .radio-groups{
            label{
                margin-right:20px;
                margin-bottom:5px;
            }
        }
    }
    .medicine-list{
        border:1px solid lightgray;
    }
    .footer{
        margin-top:5px;
        text-align:right;
        button{
            margin-right:10px;
        }
    }
    
  table {
    font-size: 14px;
    vertical-align: middle;
    width: 100%;
  }

  .table-scroll {
    width: 100%;
    height: 100%;
    max-height: 190px;

    .no-result {
      padding: 75px;
      text-align: center;

      p {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
  }

  th {
    background-color: ${colors.midEmphasis};
    color: ${colors.surface};
    text-align: center;
    font-weight: normal;
    label {
      color: ${colors.surface};
    }
  }

  th,
  td {
    border: 1px solid ${colors.background};
    padding: 4px 8px;
  }
  .disease-row {
    cursor: pointer;
  }
  .selected {
    background: lightblue;
  }
 `;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-left: 33vh;
  display: table-caption;
  position: absolute;
  top: 230px;
`;

class SelectDiseaseModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            department:1,
            end_date:1,
            disease_list:null,
            isLoaded:false,
            disease_name:'',
            disease_number:0,
            isAddDiseaseNameModal: false,
        }
        this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }

    async componentDidMount(){
        await this.searchDiseaseName();
    }

    searchDiseaseName =async()=>{
        this.closeModal();
        const { data } = await axios.get(
            "/app/api/v2/disease_name/search_in_patient",
            {
                params: {
                    systemPatientId:this.props.system_patient_id,
                }
            }
        );
        this.setState({
            isLoaded: true,
            disease_list:(data.disease_list != null && data.disease_list !== undefined && data.disease_list.length > 0) ? data.disease_list: null,
        });
    }

    getDepartment = (e) => {
        this.setState({department:parseInt(e.target.value)});
    }

    getEndDate = (e) => {
        this.setState({end_date:parseInt(e.target.value)});
    }

    getDepartmentName = code => {
        let name = "";
        this.departmentOptions.map(item => {
            if (item.id === parseInt(code)) {
                name = item.value;
            }
        });
        return name;
    };

    handleClick(e, disease_name, disease_number) {
        this.setState({
            disease_name,
            disease_number,
        });
    }

    selectDiseaseName =()=>{
        let disease_list = this.state.disease_list;
        let disease_item = null;
        if(disease_list != null && disease_list != undefined && disease_list.length > 0) {
            disease_list.map(item=>{
                if (item.number ==  this.state.disease_number) {
                    disease_item = item;
                }
            });
        }
        if(this.state.disease_name === ''){
            window.sessionStorage.setItem("alert_messages", '病名を選択してください。');
        } else {            
            this.props.selectDiseaseName(disease_item);
            this.props.closeModal();
        }
    }

    showAddDiseaseNameModal = () => {
        this.setState({isAddDiseaseNameModal:true});
    }

    closeModal = () => {
        this.setState({
            isAddDiseaseNameModal:false
        });
    }

    render() {        
        return  (
            <Modal show={true} id=""  className="select-disease-name-modal">
                <Modal.Header>
                    <Modal.Title>病名</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Wrapper>                        
                        <div className="medicine-list" style ={{height:'400px', overflowY:'scroll'}}>
                            {this.state.isLoaded === false ? (
                                <div className='center'>
                                    <SpinnerWrapper>
                                        <Spinner animation="border" variant="secondary" />
                                    </SpinnerWrapper>
                                </div>
                            ) : (
                                <table>
                                    <tr>
                                        <th style={{width: 60}}>診療科</th>
                                        <th>病名</th>
                                        <th style={{width: 90}}>開始日</th>
                                        <th style={{width: 90}}>転帰日</th>
                                    </tr>
                                    {this.state.disease_list != null ? (
                                        this.state.disease_list.map(disease => {
                                            if(this.state.department === 1){
                                                if(this.state.end_date === 0){
                                                    if(disease.end_date == null){
                                                        return (
                                                            <>
                                                                <tr
                                                                    className={this.state.disease_number === disease.number ? 'disease-row selected' : 'disease-row'}
                                                                    onClick={e => this.handleClick(e, disease.disease_name, disease.number)}
                                                                >
                                                                    <td className={'text-center'}>{this.getDepartmentName(disease.department_code)}</td>
                                                                    <td>{disease.disease_name}</td>
                                                                    <td className={'text-center'}>{disease.start_date}</td>
                                                                    <td></td>
                                                                </tr>
                                                            </>
                                                        );
                                                    }
                                                } else {
                                                    return (
                                                        <>
                                                            <tr
                                                                className={this.state.disease_number === disease.number ? 'disease-row selected' : 'disease-row'}
                                                                onClick={e => this.handleClick(e, disease.disease_name, disease.number)}
                                                            >
                                                                <td className={'text-center'}>{this.getDepartmentName(disease.department_code)}</td>
                                                                <td>{disease.disease_name}</td>
                                                                <td className={'text-center'}>{disease.start_date}</td>
                                                                <td className={'text-center'}>{disease.end_date === null ? "" : disease.end_date}</td>
                                                            </tr>
                                                        </>
                                                    );
                                                }
                                            } else {
                                                if(disease.department_code == (this.context.department.code == 0 ? 1: this.context.department.code)){
                                                    if(this.state.end_date === 0){
                                                        if(disease.end_date == null){
                                                            return (
                                                                <>
                                                                    <tr
                                                                        className={this.state.disease_number === disease.number ? 'disease-row selected' : 'disease-row'}
                                                                        onClick={e => this.handleClick(e, disease.disease_name, disease.number)}
                                                                    >
                                                                        <td className={'text-center'}>{this.getDepartmentName(disease.department_code)}</td>
                                                                        <td>{disease.disease_name}</td>
                                                                        <td className={'text-center'}>{disease.start_date}</td>
                                                                        <td></td>
                                                                    </tr>
                                                                </>
                                                            );
                                                        }
                                                    } else {
                                                        return (
                                                            <>
                                                                <tr
                                                                    className={this.state.disease_number === disease.number ? 'disease-row selected' : 'disease-row'}
                                                                    onClick={e => this.handleClick(e, disease.disease_name, disease.number)}
                                                                >
                                                                    <td className={'text-center'}>{this.getDepartmentName(disease.department_code)}</td>
                                                                    <td>{disease.disease_name}</td>
                                                                    <td className={'text-center'}>{disease.start_date}</td>
                                                                    <td className={'text-center'}>{disease.end_date === null ? "" : disease.end_date}</td>
                                                                </tr>
                                                            </>
                                                        );
                                                    }
                                                }
                                            }
                                        })
                                    ) : (
                                        <>
                                            <tr>
                                                <td colSpan="6" className="center">
                                                    <div className="table-scroll"><div className="no-result"><p>条件に一致する結果は見つかりませんでした。</p></div></div>
                                                </td>
                                            </tr>
                                        </>
                                    )}
                                </table>
                            )}
                        </div>
                        <div className="footer">
                            <Button onClick={this.selectDiseaseName.bind(this)}>確定</Button>
                            <Button onClick={this.props.closeModal}>閉じる</Button>
                        </div>                        
                    </Wrapper>
                </Modal.Body>
            </Modal>
        );
    }
}

SelectDiseaseModal.contextType = Context;

SelectDiseaseModal.propTypes = {
    closeModal: PropTypes.func,
    selectDiseaseName: PropTypes.func,
    system_patient_id: PropTypes.number,
};

export default SelectDiseaseModal;
