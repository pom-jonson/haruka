import React, { Component } from "react";

import styled from "styled-components";
import DialSideBar from "../DialSideBar1";

const Card = styled.div`
    position: fixed;  
    top: 0px;
    width: calc(100% - 390px);
    left: 200px;
    margin: 0px;
    height: 100vh;
    float: left;
    background-size: cover;
    background-color: white;
    padding: 20px;
    .card-body {
        width: 60%;
        margin-left: 20%;
        margin-right: 20%;
        padding: 0;
    }
    .title {
        font-size: 2rem;
        padding-left: 7px;
        border-left: solid 5px #69c8e1;
    }
`;
const Wrapper = styled.div`
  width: 100%;
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  float: left;
  height: 65vh;
  .flex {
    display: -webkit-flex; /* Safari */
    -webkit-flex-wrap: wrap; /* Safari 6.1+ */
    display: flex;
    flex-wrap: wrap;
  }
  .patient_info {
    .patient_name {
        padding-left: 100px;
        font-size: 45px;
        font-weight: bold;
        letter-spacing: 0.3em;
    }
    .patient_number {
      padding-left: 40px;
      padding-top: 15px;
      font-size: 25px;
    }
    .unit {
        font-size: 22px;
        padding-left: 15px;
        padding-top: 30px;
    }
  }
  .tl {
      text-align: left;
  }
  .tr {
      text-align: right;
  }
  .tc {
      text-align: center;
  }
  .box-detail {
    height: 50px;
    margin: 2%;
    width: 46%;
    border-width: 1px;
    border-style: solid;
    border-color: #8d8f90;
    background-color: white;
    display: flex;
    flex-wrap: wrap;
    font-size: 20px;
    letter-spacing: 0.1em;
    span {
        padding-right:30px;
    }
  }
  .border-weight-prev {
    height: 50px;
    margin: 2%;
    width: 46%;
    border-width: 3px;
    border-color: #f5700e;
    border-style: dotted;
    height: 80px;
    display: flex;
    flex-wrap: wrap;
    letter-spacing: 0.1em;
  }
  .border-weight-next {
    height: 50px;
    margin: 2%;
    width: 46%;
    border-width: 3px;
    border-color: rgb(5, 241, 47);;
    border-style: solid;
    height: 80px;
    display: flex;
    flex-wrap: wrap;
    letter-spacing: 0.1em;
  }
  .w50 {
    width: 50%;
  }
  .description {
    padding-top: 15px;
    padding-bottom: 15px;
    font-size: 30px;
  }
  .padding {
    padding: 10px;
  }
  .w96 {
    width: 96%;
  }
  .top-label {
        font-size: 35px;
        font-weight: bold;
        width: 50%;
        padding: 10px;
  }
 `;

class ReCalculate extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <>
                <DialSideBar
                    selectWeight={this.changeWeightType.bind(this)}
                 />
            <Card>
                <div className="card-body">
                    <Wrapper>
                        <div className="patient_info flex">
                            <div className="patient_number">451</div>
                            <div className="patient_name">透析 太郎</div>
                            <div className="unit">様</div>
                        </div>
                        <div className="tc description">体重計にお乗りください</div>
                        <div className="flex">
                            <div className="border-weight-prev">
                                <div className="tl top-label">前体重</div>
                                <div className="tr top-label">66.4㎏</div>
                            </div>
                            <div className="border-weight-next">
                                <div className="tl top-label">後体重</div>
                                <div className="tr top-label">--.-㎏</div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="box-detail">
                                <div className="tl w50 padding">DW</div>
                                <div className="tr w50 padding">64.0㎏</div>
                            </div>
                            <div className="box-detail">
                                <div className="tl w50 padding">増加量</div>
                                <div className="tr w50 padding">2.3㎏</div>
                            </div>
                        </div>
                        <div padding>
                            <div className="box-detail w96">
                                <div className="tl w50 padding"><span>車椅子</span>なし</div>
                                <div className="tr w50 padding">--.-㎏</div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="box-detail">
                                <div className="tl w50 padding">風袋①</div>
                                <div className="tr w50 padding">0.6㎏</div>
                            </div>
                            <div className="box-detail">
                                <div className="tl w50 padding">補食</div>
                                <div className="tr w50 padding">--.-㎏</div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="box-detail">
                                <div className="tl w50 padding">風袋②</div>
                                <div className="tr w50 padding">--.-㎏</div>
                            </div>
                            <div className="box-detail">
                                <div className="tl w50 padding">補液</div>
                                <div className="tr w50 padding">0.1㎏</div>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="box-detail">
                                <div className="tl w50 padding">目標除水量</div>
                                <div className="tr w50 padding">--.-㎏</div>
                            </div>
                            <div className="box-detail">
                                <div className="tl w50 padding">実除水量</div>
                                <div className="tr w50 padding">--.-㎏</div>
                            </div>
                        </div>
                    </Wrapper>
                </div>
            </Card>
                </>
        )
    }
}

export default ReCalculate