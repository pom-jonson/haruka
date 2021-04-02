import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import { withRouter } from "react-router-dom";
import * as apiClient from "~/api/apiClient";
import { getTimeZoneList } from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import * as sessApi from "~/helpers/cacheSession-utils";

const Card = styled.div`
  position: fixed;  
  top: 0px;
  width: 200px;
  margin: 0px;
  height: 100vh;
  float: left;
  background: rgb(63,16,64);
.title {
  font-size: 50px;
  color : white;
  font-weight: bolder;
  padding: 20px 7px 20px 7px;
  background: rgb(43,0,44);
  text-align: center;
}
.patient-item {
    font-size: 28px;
    text-align: left;
    margin-top: 5px;
    color: rgb(248, 250,252)! important;
    padding: 10px 10px;
    display: flex;
}
.patient-name {
     text-align:left;
     cursor: pointer;
}
.patient-id {
     width: 30%;
     text-align: right;
}
.patient-list {
    div:nth-child(even) {background-color: rgb(77, 43, 77);}
    padding-top: 10px;
    overflow-y: auto;
    height: calc(100vh - 400px);
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
        font-size: 28px;
        border: solid 1px #744e74 !important;
    }
    .patient-num{
        width: 67%;
        font-size: 28px;
        border-width: 1px !important;
        border-style: solid !important;
        border-color: rgb(116, 78, 116) !important;
        border-image: initial !important;
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
    {id: "", kana:"ﾄｳｾｷ ﾀﾛｳ", name: "予約患者一覧", url:"/dial/weight/patientList"},
    // {id: "", kana:"ﾄｳｾｷ ﾀﾛｳ", name: "測定者選択", url:"/dial/weight/initialize"},
    // {id: "", kana:"ﾄｳﾎｳ ﾄﾓｺ", name: "風袋差し引き", url: "calculateminusclothes"},
    // {id: "", kana:"ﾄｳｾｷ ｻﾌﾞﾛｳ", name: "前後切替", url: "recalculate"},
    // {id: "", kana:"ﾄｳﾎｳ ﾄﾓｺ", name: "データ手入力", url: "/dial/weight/inputweight"},
];

class DialSideBar extends Component {
    static propTypes = {
        history: PropTypes.object,
        activeLink: PropTypes.string,
        gotoPage: PropTypes.func,
        selectWeight: PropTypes.func,
    };
    constructor(props) {
        super(props);
        this.state = {
            patientList: patient_list,
            patient_count_list:{},
            time_zone_list:getTimeZoneList(),
            confirm_message: "",
            next_url: "",
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.schedule_date != undefined && nextProps.schedule_date != null && nextProps.schedule_date !== ""){
            this.getCountDialPatient(nextProps.schedule_date);
        }
    }

    async getCountDialPatient( schedule_date){
        let path = "/app/api/v2/dial/getCountDialPatient";
        const post_data = {
            schedule_date: schedule_date,
        };
        await apiClient
            ._post(path, {
                params: post_data
            })
            .then((res) => {
                if (res)
                    this.setState({
                        patient_count_list : res,
                    });
            })
            .catch(() => {

            });
    }

    gotoUrl = (url) => {
        if (url == "calculateminusclothes" || url == "recalculate") {
            this.props.selectWeight(url);
        } else {
            var dial_change_flag = sessApi.getObjectValue('dial_change_flag');
            if(dial_change_flag !== undefined && dial_change_flag != null){
                this.setState({
                    confirm_message: "登録していない内容があります。\n変更内容を破棄して移動しますか？",
                    next_url: url
                });                        
            } else {
                this.props.history.replace(url);
            }
        }
    };

    confirmCancel = () => {
        this.setState({
            confirm_message: "",
            next_url: ""            
        });
    }

    confirmOk = () => {
        this.setState({
            confirm_message: ""
        },()=>{
            sessApi.remove('dial_change_flag');
            this.props.history.replace(this.state.next_url);
        });
    }

    render() {
        let count = (this.state.patient_count_list != undefined && this.state.patient_count_list !=null && this.state.patient_count_list.length > 0) ? this.state.patient_count_list : 0;

        return (
            <Card>
                <div className="title" onClick={()=>this.props.selectWeight()}>体重計</div>
                {/*<div className="list-title ptm-2">*/}
                    {/*<p className="patient-name">患者一覧</p>*/}
                    {/*<p className="patient-id">175名</p>*/}
                {/*</div>*/}
                {/*<ReactScrollbar style={myScrollbar}>*/}
                <div className="patient-list">
                    {this.state.patientList.map((patient,index) => {
                        return (
                            <div className="patient-item" key={index}>
                                <p className="patient-name"  onClick={()=>this.gotoUrl(patient.url)}>{patient.name}</p>
                            </div>
                        )
                    })}
                </div>
                <div className="footer">
                    {this.state.time_zone_list != undefined && this.state.time_zone_list.length>0 &&(
                        this.state.time_zone_list.map((item)=>{
                            return (
                                <>
                                    <div className="flex-title">
                                        <div className="border ptm-2 click">{item.value}</div>
                                        <div className="patient-num ptm-2">{count === 0 ? 0: count[item.id][0]} / {count === 0 ? 0: count[item.id][1]}名</div>
                                    </div>
                                </>
                            );
                        })
                    )}
                    {/*<div className="flex-title">*/}
                        {/*<div className="border ptm-2 click">午前</div>*/}
                        {/*<div className="patient-num ptm-2">{count === 0 ? 0: count[1][0]} / {count === 0 ? 0: count[1][1]}名</div>*/}
                    {/*</div>*/}
                    {/*<div className="flex-title">*/}
                        {/*<div className="border ptm-2 click">午後</div>                        */}
                        {/*<div className="patient-num ptm-2">{count === 0 ? 0: count[2][0]} / {count === 0 ? 0: count[2][1]}名</div>*/}
                    {/*</div>*/}
                    {/*<div className="flex-title">*/}
                        {/*<div className="border ptm-2 click">夜間</div>                        */}
                        {/*<div className="patient-num ptm-2">{count === 0 ? 0: count[3][0]} / {count === 0 ? 0: count[3][1]}名</div>*/}
                    {/*</div>*/}
                    {/*<div className="flex-title">*/}
                        {/*<div className="border ptm-2 click">深夜</div>*/}
                        {/*<div className="patient-num ptm-2">{count === 0 ? 0: count[4][0]} / {count === 0 ? 0: count[4][1]}名</div>*/}
                    {/*</div>*/}
                </div>
                {this.state.confirm_message !== "" && (
                      <SystemConfirmModal
                          hideConfirm= {this.confirmCancel.bind(this)}
                          confirmCancel= {this.confirmCancel.bind(this)}
                          confirmOk= {this.confirmOk}
                          confirmTitle= {this.state.confirm_message}
                      />
                  )}
            </Card>
        )
    }
}
DialSideBar.contextType = Context;

DialSideBar.propTypes = {
    onGoto: PropTypes.func,
    selectWeight: PropTypes.func,
    updateFavouriteList: PropTypes.func,
    schedule_date: PropTypes.string,
};
export default withRouter(DialSideBar)