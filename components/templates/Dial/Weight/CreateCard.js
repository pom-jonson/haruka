import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import InputWithLabel from "../../../molecules/InputWithLabel";



const Card = styled.div`
    position: fixed;  
    top: 0px;
    width: calc(100% - 190px);
    margin: 0px;
    height: 100vh;
    float: left;
    background-color: ${surface};
    padding: 20px;
    .card-body {
        width: 80%;
        margin-left: 2%;
    }
    .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
    }
    .footer {
        text-align: center;
        button {
            text-align: center;
            border-radius: 4px;
            background: rgb(105, 200, 225); 
            border: none;
        }
        
        span {
            color: white;
            font-size: 0.8rem;
            font-weight: 100;
        }
    }
`;
const ListTitle = styled.div`
    align-items: flex-start;
    justify-content: space-between;
    font-size: 14px;
    width: 100%;
    height: 65px;
    float: left;
    .left-label {
        width: 28%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
    }
    .left-area {
        width: 28%;
        display: -webkit-flex; /* Safari */
        -webkit-flex-wrap: wrap; /* Safari 6.1+ */
        display: flex;
        flex-wrap: wrap;
        .label-title {
            width: 0;
        }
        div {
            width: 100%;
        }
        label {
            width: 100%;
        }
        select {
            width: 100%;
        }
    }
    .tl {
        width: 50%;
        text-align: left;
    }
    .tr {
        width: 50%;
        text-align: right;
        cursor: pointer;
        padding: 0;
    }
`;

const List = styled.div`
    display: block;
    align-items: flex-start;
    justify-content: space-between;
    font-size: 14px;
    width: 28%;
    margin-right: 2%;
    height: calc( 100vh - 250px);
    float: left;
    border: solid 1px lightgrey;
    table {
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        td {
            padding: 0.25rem;
        }
        .patient-number {
            width: 30%;
            text-align: right;
        }
        .patient-name {
            width: 70%;
            text-align: left;
        }
    }
    height: 65vh;

 `;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 70%;
  float: left;
  height: 65vh;
  margin-bottom: 30px;
  .button-area {
    margin-top: -45px;
    display: -webkit-flex; /* Safari */
    -webkit-flex-wrap: wrap; /* Safari 6.1+ */
    display: flex;
    flex-wrap: wrap;
    div {
        width: 50%;
    }
    button {
        width: 60%;
        margin-left: 15%;
        height: 50px;
        span {
            font-size: 20px;
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
    .card-form {
        padding-top: 35px;
        width: 60%;
        margin-left: 15%;
        input {
            margin-bottom: 20px;
        }
        label {
            font-size: 15px;
            margin-top: 5px;
            width: 100px;
        }
        .label-title {
            width: 100px;
            text-align: right;
        }
    }
 `;
 const display_order = [
    { id: 107, value: "透析　太郎" },
    { id: 537, value: "透析　朋子" },
    { id: 902, value: "確認　三郎" },
    { id: 954, value: "検証　次郎" }
  ];

class CreateCard extends Component {
    constructor(props) {
        super(props);
       let list_array = [
        { id: 0, origin_name: "ＰＴＨ－ＩＮＴ"},
        { id: 1, origin_name: "CTR"},
        { id: 2, origin_name: "CRP"},
        { id: 3, origin_name: "RD"},
        { id: 4, origin_name: "フェリチン"},
        { id: 5, origin_name: "HANP/BHP"},
       ];
        this.state = {
            list_array,
            patinetNumber: "",
            patientName: "",
            patientKana: "",
            patientBirth: "",
            patientGender: "",
        }
    }

    getPatientNumber = e => {
        this.setState({patientNumber: e.target.value})
    };
    getPatientName = e => {
        this.setState({patientName: e.target.value})
    };
    getPatientKana = e => {
        this.setState({patientKana: e.target.value})
    };
    getPatientBirth = value => {
        this.setState({patientBirth: value})
    };
    getPatientGender = e => {
        this.setState({patientGender: e.target.value})
    };

    render() {
        let {list_array} = this.state;
        return (
            <Card>
                <div className="title">カード作成</div>
                <div className="card-body">
                    <ListTitle>
                        <div className="left-label">
                            <div className="tl">患者一覧</div>
                            <div className="tr">検索</div>
                        </div>
                        <div className="left-area">
                            <SelectorWithLabel
                            options={display_order}
                            />
                        </div>
                    </ListTitle>
                    <List>
                        <table className="table-scroll table table-bordered">
                            <tbody>
                            {list_array !== undefined && list_array !== null && list_array.length > 0 && (
                                list_array.map((item) => {
                                    return (
                                    <>
                                    <tr>
                                        <td className="patient-number">{item.id}</td>
                                        <td className="patient-name">{item.origin_name}</td>
                                    </tr>
                                    </>)
                                })
                            )}
                            </tbody>
                        </table>
                    </List>
                    <Wrapper>
                        <div className="button-area">
                            <div>
                                <Button type="mono" className={this.state.curFocus === 1?"focus": ""}>体重カード</Button>
                            </div>
                            <div>
                                <Button type="mono" className={this.state.curFocus === 1?"focus": ""}>患者様カード</Button>
                            </div>
                        </div>
                        
                        <div className="card-form">
                            <InputWithLabel
                                label="患者番号"
                                type="text"
                                placeholder="患者番号を入力"
                                getInputText={this.getPatientNumber.bind(this)}
                                diseaseEditData={this.state.patientNumber}
                            />
                            <InputWithLabel
                                label="患者氏名"
                                type="text"
                                placeholder="患者氏名を入力"
                                getInputText={this.getPatientName.bind(this)}
                                diseaseEditData={this.state.patientName}
                            />
                            <InputWithLabel
                                label="カナ氏名"
                                type="text"
                                placeholder="カナ氏名を入力"
                                getInputText={this.getPatientKana.bind(this)}
                                diseaseEditData={this.state.patientKana}
                            />
                            <InputWithLabel
                                label="生年月日"
                                type="date"
                                placeholder="生年月日を入力"
                                getInputText={this.getPatientBirth.bind(this)}
                                diseaseEditData={this.state.patientBirth}
                            />
                            <InputWithLabel
                                label="性別"
                                type="text"
                                placeholder="性別を入力"
                                getInputText={this.getPatientGender.bind(this)}
                                diseaseEditData={this.state.patientGender}
                            />
                        </div>
                        
                    </Wrapper>
                    <div className="footer">
                        <Button type="mono" className={this.state.curFocus === 1?"focus": ""}>カード作成</Button>
                    </div>

                </div>
            </Card>
        )
    }
}

export default CreateCard