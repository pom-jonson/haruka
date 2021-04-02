import React, { Component } from "react";
import styled from "styled-components";
// import Button from "~/components/atoms/Button";
// import RadioButton from "~/components/molecules/RadioInlineButton"

const Card = styled.div`
  position: fixed;  
  top: 65px;
  height: calc(100vh - 80px);
  left: 20px;
  width: 200px;
  margin: 0px;
  float: left;
  overflow: auto;
  background: rgb(63,16,64);
  z-index: 200;
  .menu-title {
      font-size: 20px;
      color : white;
      font-weight: bolder;
    padding: 20px 7px 20px 7px;
      background: rgb(43,0,44);
  text-align: center;
    }
    .patient-item {
    font-size: 14px;
    text-align: left;
    margin-top: 5px;
    color: rgb(248, 250,252)! important;
    padding: 0 10px;
    display: flex;
    z-index: 200;
}
.patient-name {
     width: 70%;
     text-align:left;
}
.patient-id {
     width: 30%;
     text-align: right;
    }
    .patient-list {
    div:nth-child(odd) {background-color: rgb(77, 43, 77);}
    padding-top: 10px;
    // overflow-y: scroll;
    height: calc(100vh - 390px);
}
 p{
    margin: 0;
 }
 .list-title {
    display: flex;
    color: white;
    margin-left:15px;
    margin-right:7px;
 }
 .footer {
    color: white;
    text-align: center;
    .flex-title {
        display: flex;
    }
    .border {
        width: 33%;
        font-size: 14px;
        border: solid 1px #744e74 !important;
    }
 }
 .ptm-2 {
    padding: 15px 0;
     }
 .patient-item::-webkit-scrollbar-thumb {
  background-color: rgb(43,0,44);
  outline: 1px solid slategrey;
}
 `;
const patient_list = [
    {id: 169, kana:"ﾄｳｾｷ ﾀﾛｳ", name: "透析 太郎"},
    {id: 87, kana:"ﾄｳﾎｳ ﾄﾓｺ", name: "透析 朋子"},
    {id: 79, kana:"ﾄｳｾｷ ｻﾌﾞﾛｳ", name: "透析 三郎"},
    {id: 45, kana:"ﾄｳｾｷﾞﾏ ｲﾁﾀﾛｳ", name: "透析 一太郎 "},
    {id: 163, kana:"ﾄｳｾｷ ﾀﾛｳ", name: "透析 太郎"},
    {id: 871, kana:"ﾄｳﾎｳ ﾄﾓｺ", name: "透析 朋子"},
    {id: 719, kana:"ﾄｳｾｷ ｻﾌﾞﾛｳ", name: "透析 三郎"},
    {id: 435, kana:"ﾄｳｾｷ ｲﾁﾀﾛｳ", name: "透析 一太郎 "},
    {id: 169, kana:"ﾄｳｾｷ ﾀﾛｳ", name: "透析 太郎"},
    {id: 87, kana:"ﾄｳﾎｳ ﾄﾓｺ", name: "透析 朋子"},
    {id: 435, kana:"ﾄｳｾｷ ｲﾁﾀﾛｳ", name: "透析 一太郎 "},
    {id: 169, kana:"ﾄｳｾｷ ﾀﾛｳ", name: "透析 太郎"},
    {id: 87, kana:"ﾄｳﾎｳ ﾄﾓｺ", name: "透析 朋子"},
    {id: 79, kana:"ﾄｳｾｷ ｻﾌﾞﾛｳ", name: "透析 三郎"},
    {id: 45, kana:"ﾄｳｾｷﾞﾏ ｲﾁﾀﾛｳ", name: "透析 一太郎 "},
    {id: 163, kana:"ﾄｳｾｷ ﾀﾛｳ", name: "透析 太郎"},
    {id: 871, kana:"ﾄｳﾎｳ ﾄﾓｺ", name: "透析 朋子"},
];

class DialSideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            patientList: patient_list,
        }
    }

    render() {
        // const myScrollbar = {
        //     height: 400,
        // };
        const patientList = [];
        this.state.patientList.map((patient) => {
            patientList.push(
                <div className="patient-item">
                    <p className="patient-name">{patient.name}</p>
                    <p className="patient-id">{patient.id}</p>
                </div>
            );
        });
        return (
            <Card>
                <div className="menu-title">透析支援システム</div>
                <div className="list-title ptm-2">
                    <p className="patient-name">患者一覧</p>
                    <p className="patient-id">175名</p>
                </div>
                <div className="patient-list">
                    {patientList}
                </div>
                <div className="footer">
                    <div className="ptm-2">全患者</div>
                    <div className="flex-title">
                        <div className="border ptm-2">絞り込み</div>
                        <div className="border ptm-2">並び替え</div>
                        <div className="border ptm-2">設定</div>
                    </div>
                </div>
            </Card>
        )
    }
}

export default DialSideBar