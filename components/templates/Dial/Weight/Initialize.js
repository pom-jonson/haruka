import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "../../../_nano/colors";
import Button from "../../../atoms/Button";
import DialSideBar from "../DialSideBar1";

const Card = styled.div`
    padding: 20px;
    position: fixed;  
    top: 0px;
    width: calc(100% - 390px);
    left: 200px;
    margin: 0px;
    height: 100vh;
    float: left;
    background-color: ${surface};
    .title {
        font-size: 2rem;
        padding-left: 7px;
        border-left: solid 5px #69c8e1;
    }
`;

const Wrapper = styled.div`
  width: 100%;
  display: -webkit-flex;
  -webkit-flex-wrap: wrap;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  height: 100%;
  padding: 20px;
  float: left;
  input {
    border-radius: 0px;
  }
  div {
    margin-top: -1px;
  }
  label {
      text-align: right;
  }
  .initialize {
    width: 20%;
    float: left;
    border: 1px solid rgb(136, 136, 136);
    height: calc(100vh - 200px);
    overflow-y: auto;
    .initialize-content {
      display: grid;
      margin-top: 5px;
      p {
        margin: 0;
      }
    }
  }
  .initialize-form {
    width: 80%;
  }
  .flex-area {
    display: -webkit-flex;
    -webkit-flex-wrap: wrap;
    display: flex;
    flex-wrap: wrap;
    .initialize_left {
        width: 33%;
        padding: 0 20px 20px 20px;
    }
    .initialize_center {
        width: 33%;
        padding: 0 20px 20px 20px;
    }
    .initialize_right {
        width: 33%;
        padding: 0 20px 20px 20px;
    }
    .label-area {
        text-align: left;
    }
    .print-area {
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        text-align: right;
        background-color: #b8edfb;
        height: 35px;
        font-size: 20px;
    }
  }
  .add-button {
      width: 100%;
      text-align: center;
  }
  .pb-20 {
    padding-bottom:20px;
  }
 `;

class Initialize extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <>
                <DialSideBar />
            <Card>
                <div className="title">端末設定</div>
                <Wrapper>
                  <div className="initialize">
                    <div className="initialize-content">
                      <div>
                          <p>A&D AD-6105</p>
                          <p>-2400,2,7,1</p>
                          <p>全文長-15</p>
                          <p>M-6</p>
                          <p>バイト長-7</p>
                          <p>..........................</p>
                        </div>
                      <div>
                          <p>A&D AD-6105W</p>
                          <p>-9600,2,7,2</p>
                          <p>全文長-30</p>
                          <p>M-5</p>
                          <p>バイト長-7</p>
                          <p>..........................</p>
                        </div>
                      <div>
                          <p>A&D AD-6105NP</p>
                          <p>-9600,2,7,2</p>
                          <p>全文長-17</p>
                          <p>M-5</p>
                          <p>バイト長-8</p>
                        </div>
                    </div>
                  </div>
                  <div className="initialize-form">
                    <div className="flex-area">
                        <div className="initialize_left">
                            <div className="pb-20">
                                <div className="label-area">体重計ポート</div>
                                <div className="print-area">0</div>
                            </div>
                            <div className="pb-20">
                                <div className="label-area">設定</div>
                                <div className="print-area"> </div>
                            </div>
                            <div className="pb-20">
                                <div className="label-area">タイムアウト</div>
                                <div className="print-area">0</div>
                            </div>
                            <div>
                                <div className="label-area">カード</div>
                                <div className="print-area">0</div>
                            </div>
                        </div>
                        <div className="initialize_center">
                            <div className="pb-20">
                                <div className="label-area">全文長</div>
                                <div className="print-area">0</div>
                            </div>
                            <div className="pb-20">
                                <div className="label-area">項目1</div>
                                <div className="print-area">0</div>
                            </div>
                            <div>
                                <div className="label-area">体重バイト長</div>
                                <div className="print-area">0</div>
                            </div>
                        </div>
                        <div className="initialize_right">
                            <div className="pb-20">
                                <div className="label-area">音声（名前）</div>
                                <div className="print-area">0</div>
                            </div>
                            <div className="pb-20">
                                <div className="label-area">音声（体重）</div>
                                <div className="print-area">0</div>
                            </div>
                            <div className="pb-20">
                                <div className="label-area">音声遅延防止</div>
                                <div className="print-area">0</div>
                            </div>
                            <div className="pb-20">
                                <div className="label-area">音量</div>
                                <div className="print-area">0</div>
                            </div>
                            <div>
                                <div className="label-area">読み上げ速度</div>
                                <div className="print-area">0</div>
                            </div>
                        </div>
                    </div>
                  </div>
                <div className="add-button">
                    <Button type="mono">登録</Button>
                </div>
                </Wrapper>
            </Card>
                </>
        )
    }
}

export default Initialize;
