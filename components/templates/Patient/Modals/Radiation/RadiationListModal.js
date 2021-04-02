import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Spinner from "react-bootstrap/Spinner";
import {secondary} from "../../../../_nano/colors";
import { surface } from "~/components/_nano/colors";
import {formatDateLine, formatJapan, formatJapanDateSlash} from "../../../../../helpers/date";
import * as apiClient from "~/api/apiClient";
import axios from "axios/index";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Papa from 'papaparse';
import encoding from 'encoding-japanese';
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";

const Wrapper = styled.div`
    height: 100%;
    .flex {
        display: flex;
    }
    .head-area {
        .condition {
            width: calc(100% - 320px);
            label {
                width: 100px;
                text-align: right;
                padding-right: 5px;
            }
            button {
                height: 30px;
            }
        }
    
    }
    .table-area {
        height: calc(100% - 130px);
        margin-bottom:0;
        thead{
          display: table;
          width:100%;
        }
        tbody{
          height: calc(100vh - 300px);  
          overflow-y:auto;
          display:block;
        }
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        tr{
          display: table;
          width: 100%;
          box-sizing: border-box;
        }
        td {
            padding: 0.25rem;
            text-align: left;
        }
        th {
            background-color: ${secondary};
            color: ${surface};
            text-align: center;
            padding: 0.3rem;
        }      
        .tl {
            text-align: left;
        }      
        .tr {
            text-align: right;
        }
        .no-result {
          padding: 200px;
          text-align: center;
          span {
            padding: 10px;
            border: 2px solid #aaa;
          }
        }
    }
`;

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 100px;
  margin-left: 47%;
  display: table-caption;
  position: absolute;
  top: 230px;
`;

class RadiationListModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list_data:null,
            alert_messages:"",
            complete_message:"",
        };
        this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }

    async componentDidMount() {
        await this.searchList();
    }

    searchList = async () => {
        if(this.state.list_data != null){
            this.setState({ list_data:null });
        }
        let path = "/app/api/v2/master/inspection/searchByCondition";
        let post_data = {
            target_table:"order",
            state:this.props.conditions.inspection_state,
            group_code:this.props.conditions.inspection_id,
            frame_codes:this.props.conditions.frame_codes,
            start_date:this.props.conditions.start_date !== '' ? formatDateLine(this.props.conditions.start_date) : '' ,
            end_date:this.props.conditions.end_date !== '' ? formatDateLine(this.props.conditions.end_date) : '' ,
            karte_status:this.props.conditions.karte_status,
            department_codes:this.props.conditions.department_codes
        };

        await apiClient._post(
            path,
            {params: post_data})
            .then((res) => {
                if(res){
                    this.setState({ list_data:res });
                }
            })
            .catch(() => {

            })
    };

    getFrameNames=(type=null)=>{
        let html = [];
        let frame_data = '';
        if(this.props.conditions.frame_master.length > 0){
            this.props.conditions.frame_master.map(frame=>{
                if(this.props.conditions.frame_codes.includes(frame['frame_code'])){
                    if(html.length > 0){
                        frame_data = frame_data+'、'+frame['frame_name'];
                        html.push(
                            <>
                                <span>{'、'+frame['frame_name']}</span>
                            </>

                        )
                    } else {
                        frame_data = frame_data+frame['frame_name'];
                        html.push(
                            <>
                                <span>{frame['frame_name']}</span>
                            </>

                        )
                    }
                }
            })
        }
        if(type === 'html'){
            return html;
        } else {
            return frame_data;
        }
    };

    printPdf=async()=>{
        if(this.state.list_data != null && this.state.list_data.length > 0){
            let base_modal = document.getElementsByClassName("inspection-list-modal")[0];
            if(base_modal !== undefined && base_modal != null){
                base_modal.style['z-index'] = 1040;
            }
            this.setState({complete_message:"印刷中"});
            let path = "/app/api/v2/master/inspection/reservation_list/print_pdf";
            let print_data = {};
            print_data.list_data = this.state.list_data;
            print_data.period = formatJapanDateSlash(formatDateLine(this.props.conditions.start_date))+'～'+formatJapanDateSlash(formatDateLine(this.props.conditions.end_date));
            print_data.inspection_name = this.props.conditions.inspection_name === '' ? '全て' : this.props.conditions.inspection_name;
            print_data.frame = this.getFrameNames();
            print_data.frame_master = this.props.conditions.frame_master;
            print_data.order_type = "radiation";
            axios({
                url: path,
                method: 'POST',
                data:{print_data},
                responseType: 'blob', // important
            }).then((response) => {
                let base_modal = document.getElementsByClassName("inspection-list-modal")[0];
                if(base_modal !== undefined && base_modal != null){
                    base_modal.style['z-index'] = 1050;
                }
                this.setState({complete_message:""});
                const blob = new Blob([response.data], { type: 'application/octet-stream' });
                if(window.navigator.msSaveOrOpenBlob) {
                    //IE11 & Edge
                    window.navigator.msSaveOrOpenBlob(blob, '放射線検査予約一覧.pdf');
                }
                else{
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', '放射線検査予約一覧.pdf'); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                }
            })
            .catch(() => {
                this.setState({
                    complete_message:"",
                    alert_messages:"印刷失敗",
                });
            })
        } else {
            let base_modal = document.getElementsByClassName("inspection-list-modal")[0];
            if(base_modal !== undefined && base_modal != null){
                base_modal.style['z-index'] = 1040;
            }
            this.setState({alert_messages:"条件に一致する結果は見つかりませんでした。"});
        }
    }

    closeModal=()=>{
        let base_modal = document.getElementsByClassName("inspection-list-modal")[0];
        if(base_modal !== undefined && base_modal != null){
            base_modal.style['z-index'] = 1050;
        }
        this.setState({alert_messages:""});
    }

    download_csv=()=> {
        if(this.state.list_data != null && this.state.list_data.length > 0){
            let data = [
                ['伝票種別', '実施日', '開始', '予約枠', '患者ID', '漢字氏名', 'カナ氏名', '性別', '年齡', '生年月日'],
            ];
            this.state.list_data.map(item=>{
                let frame_name = "";
                if(this.props.conditions.frame_master.length > 0){
                    this.props.conditions.frame_master.map(frame=>{
                        if(frame.frame_code == item.frame_code){
                            frame_name = frame.frame_name;
                        }
                    })
                }
                let data_item = [
                    item.order_data.order_data.radiation_name,
                    item.completed_at != null ? (item.completed_at.substr(0, 4))+'/'+(item.completed_at.substr(5, 2))+'/'+(item.completed_at.substr(8, 2)): '',
                    item.order_data.order_data.reserve_time,
                    frame_name,
                    item.patient_number,
                    item.patient_name,
                    item.patient_name_kana,
                    item.gender === 1 ? '男性':'女性',
                    item.birthday != null ? (item.age)+'歳 '+(item.age_month)+'ヶ月':'',
                    item.birthday != null ? formatJapan(item.birthday):'',
                ];
                data.push(data_item);
            });

            const config = {
                delimiter: ',', // 区切り文字
                header: true, // キーをヘッダーとして扱う
                newline: '\r\n', // 改行
            };

            const delimiterString = Papa.unparse(data, config);
            const strArray = encoding.stringToCode(delimiterString);
            const convertedArray = encoding.convert(strArray,'SJIS', 'UNICODE');
            const UintArray = new Uint8Array(convertedArray);
            const blobUrl = new Blob([UintArray], {type: 'text/csv'});
            const blob = blobUrl;
            const aTag = document.createElement('a');

            aTag.download = '放射線検査予約一覧.csv';

            // 各ブラウザに合わせ、CSVをダウンロード
            if (window.navigator.msSaveBlob) {
                // for IE
                window.navigator.msSaveBlob(blob, aTag.download);
            } else if (window.URL && window.URL.createObjectURL) {
                // for Firefox
                aTag.href = window.URL.createObjectURL(blob);
                document.body.appendChild(aTag);
                aTag.click();
                document.body.removeChild(aTag);
            } else if (window.webkitURL && window.webkitURL.createObject) {
                // for Chrome
                aTag.href = (window.URL || window.webkitURL).createObjectURL(blob);
                aTag.click();
            } else {
                // for Safari
                window.open(
                    `data:type/csv;base64,${window.Base64.encode(this.state.content)}`,
                    '_blank'
                );
            }
        }
    };

    render() {
        return (
            <>
                <Modal
                    show={true}                    
                    className="custom-modal-sm patient-exam-modal physiological-modal inspection-list-modal"
                >
                    <Modal.Header><Modal.Title>放射線検査予約一覧</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                            <div className={'head-area flex'}>
                                <div className={'condition'}>
                                    <div><label>期間 :</label>{formatJapanDateSlash(formatDateLine(this.props.conditions.start_date))}～{formatJapanDateSlash(formatDateLine(this.props.conditions.end_date))}</div>
                                    <div><label>伝票種別 :</label>{this.props.conditions.inspection_name === '' ? '全て' : this.props.conditions.inspection_name}</div>
                                    <div><label>予約枠 :</label>{this.getFrameNames('html')}</div>
                                </div>
                                <div className={'flex'} style={{paddingTop:"60px"}}>
                                    <button onClick={this.searchList}>最新</button>
                                    <button onClick={this.printPdf}>印刷</button>
                                    <button onClick={this.download_csv}>ファイル出力</button>
                                    <button onClick={this.props.closeModal} style={{marginLeft:"20px"}}>閉じる</button>
                                </div>
                            </div>
                            <div>検索結果 {this.state.list_data == null ? 0 : (this.state.list_data.length)}件</div>
                            <div className={'table-area'}>
                                <table className="table-scroll table table-bordered">
                                    <thead>
                                    <tr>
                                        <th style={{width:"200px"}}>伝票種別</th>
                                        <th style={{width:"110px"}}>実施日</th>
                                        <th style={{width:"50px"}}>開始</th>
                                        <th style={{width:"200px"}}>予約枠</th>
                                        <th style={{width:"80px"}}>患者ID</th>
                                        <th style={{width:"170px"}}>漢字氏名</th>
                                        <th style={{width:"170px"}}>カナ氏名</th>
                                        <th style={{width:"50px"}}>性別</th>
                                        <th style={{width:"130px"}}>年齡</th>
                                        <th>生年月日</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.list_data == null ? (
                                        <div className='text-center'>
                                            <SpinnerWrapper>
                                                <Spinner animation="border" variant="secondary" />
                                            </SpinnerWrapper>
                                        </div>
                                    ) : (
                                        this.state.list_data.length > 0 ? (
                                            this.state.list_data.map((item, key) => {
                                                return (
                                                    <>
                                                        <tr key={key}>
                                                            <td className={'text-center'} style={{width:"200px"}}>{item.order_data.order_data.radiation_name}</td>
                                                            <td className={'text-center'} style={{width:"110px"}}>{item.completed_at != null ?
                                                                (item.completed_at.substr(0, 4))+'/'+(item.completed_at.substr(5, 2))+'/'+(item.completed_at.substr(8, 2))
                                                                : ''
                                                            }</td>
                                                            <td className={'text-center'} style={{width:"50px"}}>{item.order_data.order_data.reserve_time}</td>
                                                            <td className={'text-center'} style={{width:"200px"}}>
                                                                {this.props.conditions.frame_master.length > 0 && (
                                                                    this.props.conditions.frame_master.map(frame=>{
                                                                        if(frame.frame_code == item.frame_code){
                                                                            return (frame.frame_name);
                                                                        }
                                                                    })
                                                                )}
                                                            </td>
                                                            <td className={'text-center'} style={{width:"80px"}}>{item.patient_number}</td>
                                                            <td className={'text-left'} style={{width:"170px"}}>{item.patient_name}</td>
                                                            <td className={'text-left'} style={{width:"170px"}}>{item.patient_name_kana}</td>
                                                            <td className={'text-center'} style={{width:"50px"}}>{item.gender === 1 ? '男性':'女性'}</td>
                                                            <td className={'text-center'} style={{width:"130px"}}>{item.birthday != null ? (item.age)+'歳 '+(item.age_month)+'ヶ月':''}</td>
                                                            <td className={'text-center'}>{item.birthday != null ? formatJapan(item.birthday):''}</td>
                                                        </tr>
                                                    </>)
                                            })
                                        ):(
                                            <tr><td colSpan={'10'}><div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div></td></tr>
                                        )
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </Wrapper>
                    </Modal.Body>
                    {this.state.alert_messages !== "" && (
                        <SystemAlertModal
                            hideModal= {this.closeModal.bind(this)}
                            handleOk= {this.closeModal.bind(this)}
                            showMedicineContent= {this.state.alert_messages}
                        />
                    )}
                    {this.state.complete_message !== '' && (
                        <CompleteStatusModal
                            message = {this.state.complete_message}
                        />
                    )}
                </Modal>
            </>
        );
    }
}

RadiationListModal.contextType = Context;
RadiationListModal.propTypes = {
    closeModal: PropTypes.func,
    conditions: PropTypes.array,
};

export default RadiationListModal;
