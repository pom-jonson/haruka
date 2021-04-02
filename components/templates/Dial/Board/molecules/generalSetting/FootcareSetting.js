import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import RadioButton from "~/components/molecules/RadioInlineButton";
import Button from "../../../../../atoms/Button";


const Wrapper = styled.div`
  display:flex;
  width:95%;
  padding-top:20px;
  background-color: ${surface};
  .radio-title-label{
      margin-right:15px;   
      width:65px;
      text-align:right;   
  }
  .radio-btn{
      width:135px;
      background-color:black;
      label{
        margin-bottom: 0px;
        color: white;
      }
      input:checked + label {
          border-radius:0px;
          background:red;
      }
  }
  .radio_area{
      margin-bottom:15px;
  }
  .left-area {
    width: 60%;
    overflow-y: auto;
    .table-title {
        text-align: left;
         font-size: 14px;
    }
    table {
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        td {
            padding: 0.25rem;
            text-align: center;
            input {
                margin: 0;
            }
        }
        th {
            text-align: center;
            padding: 0.3rem;
        }
        .table-check {
            width: 60px;
        }
        .table-content {
            width: 65%;
        }
    }
    .tl {
        text-align: left;
    }
    .tr {
        text-align: right;
    }
    
  }
  .right-area {
    width: 40%;
    .amount-box {
        width: 100%;
        height: 200px;
        border: 1px solid black;
        p {
            text-align: left;
            margin: 0;
        }
    }
    .btn-area {
        width: 90px;
        position: relative;
        .btn-add {
            position: absolute;
            bottom: 30px;
        }
        .btn-delete {
            position: absolute;
            bottom: 0;
        }
        button {
            margin-right: 15px;
            min-width: 50px;
            margin-left: 5px;
            border-radius: 0;
            background-color: blue;
            padding: 3px 0 3px 0;
            span {
                color: white;
            }
        }
    }
  }
  
`;
class PrescriptionSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            weight_set:0,
            water_set:0,
        }
    }

    getWeightSet = (e) =>{
        this.setState({weight_set:parseInt(e.target.value)});
    }
    getWaterSet = (e) =>{
        this.setState({water_set:parseInt(e.target.value)});
    }

    render() {
        return (
            <>
                <Wrapper>
                    <div className="left-area">
                        <div className="table-title">フットケア基本情報</div>
                        <div className="table-area">
                            <table className="table-scroll table table-bordered" id="medical-record-table">
                                <thead>
                                    <tr>
                                        <th className="text-center">表示名称</th>
                                        <th className="text-center">右足 検査項目</th>
                                        <th className="text-center">左足 検査項目</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-center">ABI</td>
                                        <td className="text-center">ABI右</td>
                                        <td className="text-center">ABI左</td>
                                    </tr>
                                    <tr>
                                        <td className="text-center">SPP</td>
                                        <td className="text-center">SPP右</td>
                                        <td className="text-center">SPP左</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="right-area">
                        <div className="flex radio_area">
                            <label className="radio-title-label">DM有無</label>
                            <RadioButton
                                id="male"
                                value={0}
                                label="表示する"
                                name="increse-weight"
                                getUsage={this.getWeightSet.bind(this)}
                                checked={this.state.weight_set == 0 ? true : false}
                            />
                            <RadioButton
                                id="femaie"
                                value={1}
                                label="表示しない"
                                name="increse-weight"
                                getUsage={this.getWaterSet}
                                checked={this.state.water_set == 1 ? true : false}
                            />
                        </div>
                        <div className="flex radio_area">
                            <label className="radio-title-label">抗血栓薬</label>
                            <RadioButton
                                id="water_1"
                                value={0}
                                label="表示する"
                                name="decrease-water"
                                getUsage={this.getWaterSet.bind(this)}
                                checked={this.state.water_set == 0 ? true : false}
                            />
                            <RadioButton
                                id="water_2"
                                value={1}
                                label="表示しない"
                                name="decrease-water"
                                getUsage={this.getWaterSet.bind(this)}
                                checked={this.state.water_set == 1 ? true : false}
                            />
                        </div>
                        <div className="flex">
                            <div className="btn-area">
                                <div className="btn-add">
                                    <Button type="mono">追加</Button>
                                </div>
                                <div className="btn-delete">
                                    <Button type="mono">削除</Button>
                                </div>
                            </div>
                            <div className="amount-box">
                                <p>バイアスビリン錠100㎎</p>
                                <p>ワーファリン錠0.5㎎</p>
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </>
        )
    }
}

export default PrescriptionSetting