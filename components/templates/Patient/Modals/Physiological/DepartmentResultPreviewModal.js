import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import {formatDateLine, formatJapanDateSlash} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios/index";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Papa from "papaparse";
import encoding from "encoding-japanese";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import Button from "~/components/atoms/Button";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    .flex {
        display: flex;
    }
    .list-area {
        margin-top: 10px;
        width: 100%;
        height: calc(100% - 50px);
        overflow-y: auto;    
        overflow-x: auto;   
        .table-menu {
            display: inline-flex;
            background-color: gainsboro;
        } 
        .inline-flex {
            display: inline-flex;
            margin-top: -1px;
        }
        .date-box {
            border:1px solid #aaa;
            width: 120px;
            padding-left: 5px;
        }
        .department-box {
            border:1px solid #aaa;
            padding-left: 5px;
            margin-left: -1px;

        }
        .inspection-type-box {
            border:1px solid #aaa;
            width: 148px;
            padding-left: 5px;    
            margin-left: -1px;
        }
        .count-box {
            border:1px solid #aaa;
            width: 50px;
            text-align: right;
            padding-left: 5px;   
            padding-right: 2px;
            margin-left: -1px;
        }
    }
    .no-result {
        padding: 60px;
        border: 1px solid #aaa;
        text-align: center;
        width: 100%;
        span {
            padding: 10px;
            border: 2px solid #aaa;
        }
    }
`;

const SpinnerWrapper = styled.div`
    padding: 0;
`;

class DepartmentResultPreviewModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list_data:null,
            alert_messages:"",
            complete_message:"",
            order_kinds:props.condition_data.order_kinds,
        }
        this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }

    async componentDidMount() {
        let path = "";
        let post_data = {
            start_date:formatDateLine(this.props.condition_data.start_date),
            end_date:formatDateLine(this.props.condition_data.end_date),
            department_codes:this.props.condition_data.department_codes,
            inspection_types:this.props.condition_data.inspection_types,
        };
        if(this.props.order_type === 'inspection' || this.props.order_type === 'endoscope'){
            path = "/app/api/v2/master/inspection/getDepartmentResult";
        } else if(this.props.order_type === 'radiation'){
            path = "/app/api/v2/order/radiation/getDepartmentResult";
        }
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
    }

    getStyle=(type)=>{
        var base_modal = document.getElementsByClassName("department-result-preview-modal")[0];
        if(base_modal !== undefined && base_modal != null){
            let modal_width = document.getElementsByClassName("department-result-preview-modal")[0].getElementsByClassName("modal-body")[0].offsetWidth;
            let table_width = this.props.condition_data.department_codes.length *((148*this.props.condition_data.inspection_types.length) - this.props.condition_data.inspection_types.length + 1) + 120;
            if(modal_width > table_width){
                if(type === 'float'){
                    return '';
                }
                if(type === 'display'){
                    return 'flex';
                }
                if(type === 'inspection'){
                    return "-1px";
                }
                if(type === 'count'){
                    return "-1px";
                }
            } else {
                if(type === 'float'){
                    return 'left';
                }
                if(type === 'display'){
                    return 'block';
                }
                if(type === 'inspection'){
                    return "-6px";
                }
                if(type === 'count'){
                    return "-7px";
                }
            }
        } else {
            return '';
        }
    };

    printPdf=async()=>{
        if(this.state.list_data != null && Object.keys(this.state.list_data).length > 0){
            let base_modal = document.getElementsByClassName("department-result-preview-modal")[0];
            if(base_modal !== undefined && base_modal != null){
                base_modal.style['z-index'] = 1040;
            }
            this.setState({complete_message:"印刷中"});
            let path = "/app/api/v2/master/inspection/department_result/print_pdf";
            let print_data = {};
            print_data.list_data = this.state.list_data;
            print_data.department_codes = this.props.condition_data.department_codes;
            print_data.inspection_types = this.props.condition_data.inspection_types;
            let order_type_names = [];
            this.state.order_kinds.map(inspection=>{
                order_type_names[inspection.id] = inspection.value;
            });
            print_data.order_type_names = order_type_names;
            axios({
                url: path,
                method: 'POST',
                data:{print_data},
                responseType: 'blob', // important
            }).then((response) => {
                let base_modal = document.getElementsByClassName("department-result-preview-modal")[0];
                if(base_modal !== undefined && base_modal != null){
                    base_modal.style['z-index'] = 1050;
                }
                this.setState({complete_message:""});
                const blob = new Blob([response.data], { type: 'application/octet-stream' });
                let file_name = "";
                if(this.props.order_type === 'inspection'){
                    file_name = '生理';
                }
                if(this.props.order_type === 'endoscope'){
                    file_name = '内視鏡';
                }
                if(window.navigator.msSaveOrOpenBlob) {
                    //IE11 & Edge
                    if(this.props.order_type === 'radiation'){
                        window.navigator.msSaveOrOpenBlob(blob, '放射線統計.pdf');
                    } else {
                        window.navigator.msSaveOrOpenBlob(blob, file_name+'検査科別統計.pdf');
                    }
                } else{
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    if(this.props.order_type === 'radiation'){
                        link.setAttribute('download', '放射線統計.pdf'); //or any other extension
                    } else {
                        link.setAttribute('download', file_name+'検査科別統計.pdf'); //or any other extension
                    }
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
            let base_modal = document.getElementsByClassName("department-result-preview-modal")[0];
            if(base_modal !== undefined && base_modal != null){
                base_modal.style['z-index'] = 1040;
            }
            this.setState({alert_messages:"条件に一致する結果は見つかりませんでした。"});
        }
    }

    closeModal=()=>{
        let base_modal = document.getElementsByClassName("department-result-preview-modal")[0];
        if(base_modal !== undefined && base_modal != null){
            base_modal.style['z-index'] = 1050;
        }
        this.setState({alert_messages:""});
    }

    download_csv=()=> {
        if(this.state.list_data != null && Object.keys(this.state.list_data).length > 0){
            let csv_data = [];
            let first_line = [];
            first_line.push('');
            this.departmentOptions.map(item=>{
                if(this.props.condition_data.department_codes.includes(item.id)){
                    first_line.push(item.value);
                    for(let i=0; i<(this.props.condition_data.inspection_types.length * 3) - 1; i++){
                        first_line.push('');
                    }
                }
            });
            csv_data.push(first_line);
            let second_line = [];
            second_line.push('');
            for(let i=0; i < this.props.condition_data.department_codes.length; i++){
                this.state.order_kinds.map(item=>{
                    if(this.props.condition_data.inspection_types.includes(item.id)){
                        second_line.push(item.value);
                        second_line.push('');
                        second_line.push('');
                    }
                });
            }
            csv_data.push(second_line);
            let third_line = [];
            third_line.push('日付');
            for(let i=0; i < this.props.condition_data.department_codes.length; i++){
                for(let j=0; j < this.props.condition_data.inspection_types.length; j++){
                    third_line.push('入院');
                    third_line.push('外来');
                    third_line.push('合計');
                }
            }
            csv_data.push(third_line);

            Object.keys(this.state.list_data).map((date)=> {
                let data = this.state.list_data[date];
                let csv_data_item = [];
                csv_data_item.push(formatJapanDateSlash(date));
                this.props.condition_data.department_codes.map(department => {
                    this.props.condition_data.inspection_types.map(inspection => {
                        let hospital_count = (data[department] !== undefined && data[department][inspection] !== undefined && data[department][inspection][3] !== undefined) ? data[department][inspection][3] : 0;
                        let exam_count = (data[department] !== undefined && data[department][inspection] !== undefined && data[department][inspection][1] !== undefined) ? data[department][inspection][1] : 0;
                        csv_data_item.push(hospital_count);
                        csv_data_item.push(exam_count);
                        csv_data_item.push(hospital_count + exam_count);
                    });
                });
                csv_data.push(csv_data_item);
            });

            const config = {
                delimiter: ',', // 区切り文字
                header: true, // キーをヘッダーとして扱う
                newline: '\r\n', // 改行
            };

            const delimiterString = Papa.unparse(csv_data, config);
            const strArray = encoding.stringToCode(delimiterString);
            const convertedArray = encoding.convert(strArray,'SJIS', 'UNICODE');
            const UintArray = new Uint8Array(convertedArray);
            const blobUrl = new Blob([UintArray], {type: 'text/csv'});
            const blob = blobUrl;
            const aTag = document.createElement('a');
            let file_name = "";
            if(this.props.order_type === 'inspection'){
                file_name = '生理';
            }
            if(this.props.order_type === 'endoscope'){
                file_name = '内視鏡';
            }
            aTag.download = file_name+'検査科別統計.csv';
            if(this.props.order_type === 'radiation'){
                aTag.download = '放射線統計.csv';
            }

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
    }

    render() {
        return (
            <>
                <Modal show={true} className="custom-modal-sm patient-exam-modal department-result-preview-modal">
                    <Modal.Header><Modal.Title>検査科別統計プレビュー</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                            <div className={'flex'}>
                                <div>期間設定</div>
                                <div style={{paddingLeft:"10px", width:"calc(100% - 310px)"}}>{formatJapanDateSlash(formatDateLine(this.props.condition_data.start_date))} ～ {formatJapanDateSlash(formatDateLine(this.props.condition_data.end_date))}</div>
                            </div>
                            <div className={'list-area'}>
                                {this.props.condition_data.department_codes.length > 0 && this.props.condition_data.inspection_types.length > 0 && (
                                    <>
                                        {this.state.list_data == null ? (
                                            <>
                                                <div className='no-result'>
                                                    <SpinnerWrapper>
                                                        <Spinner animation="border" variant="secondary" />
                                                    </SpinnerWrapper>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {Object.keys(this.state.list_data).length > 0 ? (
                                                    <>
                                                        <div style={{float:this.getStyle('float'), display:this.getStyle('display')}}>
                                                            <div className={'table-menu'}>
                                                                <div className={'date-box'}></div>
                                                                {this.departmentOptions.map(item=>{
                                                                    if(this.props.condition_data.department_codes.includes(item.id)){
                                                                        return (
                                                                            <div className={'department-box'} style={{width:((148*this.props.condition_data.inspection_types.length) - this.props.condition_data.inspection_types.length + 1)+"px"}}>{item.value}</div>
                                                                        )
                                                                    }
                                                                })
                                                                }
                                                            </div>
                                                        </div>
                                                        <div style={{float:this.getStyle('float'), display:this.getStyle('display')}}>
                                                            <div className={'table-menu'} style={{marginTop:this.getStyle('inspection')}}>
                                                                <div className={'date-box'}></div>
                                                                {this.props.condition_data.department_codes.map(department=>{
                                                                    return (
                                                                        <>
                                                                            {this.state.order_kinds.map(item=>{
                                                                                if(this.props.condition_data.inspection_types.includes(item.id)){
                                                                                    return (
                                                                                        <div key={department+'_'+item.id} className={'inspection-type-box'}>{item.value}</div>
                                                                                    )
                                                                                }
                                                                            })}
                                                                        </>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div style={{float:this.getStyle('float'), display:this.getStyle('display'), marginTop:this.getStyle('count')}}>
                                                            <div className={'table-menu'}>
                                                                <div className={'date-box'}>日付</div>
                                                                {this.props.condition_data.department_codes.map(department=>{
                                                                    return (
                                                                        this.props.condition_data.inspection_types.map(inspection=>{
                                                                            return (
                                                                                <>
                                                                                    <div key={department+'_'+inspection} className={'count-box text-left'}>入院</div>
                                                                                    <div key={department+'_'+inspection} className={'count-box text-left'}>外来</div>
                                                                                    <div key={department+'_'+inspection} className={'count-box text-left'}>合計</div>
                                                                                </>
                                                                            )
                                                                        })
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                        {Object.keys(this.state.list_data).map((date)=>{
                                                            let data = this.state.list_data[date];
                                                                return (
                                                                    <>
                                                                        <div style={{float:this.getStyle('float'), display:this.getStyle('display')}}>
                                                                            <div className={'inline-flex'}>
                                                                                <div className={'date-box'}>{formatJapanDateSlash(date)}</div>
                                                                                {this.props.condition_data.department_codes.map(department=>{
                                                                                    return (
                                                                                        this.props.condition_data.inspection_types.map(inspection=>{
                                                                                            let hospital_count = (data[department] !== undefined && data[department][inspection] !== undefined && data[department][inspection][3] !== undefined) ? data[department][inspection][3] : 0;
                                                                                            let exam_count = (data[department] !== undefined && data[department][inspection] !== undefined && data[department][inspection][1] !== undefined) ? data[department][inspection][1] : 0;
                                                                                            return (
                                                                                                <>
                                                                                                    <div className={'count-box'}>{hospital_count}</div>
                                                                                                    <div className={'count-box'}>{exam_count}</div>
                                                                                                    <div className={'count-box'}>{hospital_count + exam_count}</div>
                                                                                                </>
                                                                                            )
                                                                                        })
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )
                                                            // }
                                                        })}
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="no-result">
                                                            <span>条件に一致する結果は見つかりませんでした。</span>
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
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
                    <Modal.Footer>
                      <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                      <Button className="red-btn" onClick={this.download_csv}>ファイル出力</Button>
                      <Button className="red-btn" onClick={this.printPdf}>印刷</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}
DepartmentResultPreviewModal.contextType = Context;
DepartmentResultPreviewModal.propTypes = {
    closeModal: PropTypes.func,
    condition_data: PropTypes.array,
    order_type: PropTypes.string,
};

export default DepartmentResultPreviewModal;
