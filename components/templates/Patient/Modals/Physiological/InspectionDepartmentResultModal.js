import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SearchConditionSelectModal from "./SearchConditionSelectModal";
import DepartmentResultPreviewModal from "./DepartmentResultPreviewModal";
import { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import { getInspectionNameList } from "~/helpers/constants";
import Papa from "papaparse";
import encoding from "encoding-japanese";
import {formatDateLine, formatJapanDateSlash} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

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
    .list-condition {
        width: calc(60% - 30px);
        padding-left: 20px;
        .condition-table {
            -webkit-box-pack: justify;
            justify-content: space-between;
        }
        .table-area {
            margin-top: 6px;
            height: 200px;
            margin-bottom:0;
            thead{
              display: table;
              width:100%;
            }
            tbody{
              height: 360px;
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
                background-color: #e2caff;
                color: black;
                text-align: center;
                padding: 0.3rem;
                font-weight: normal;
            } 
        }
    }
    .select-search-condition {
        width: 30px;
        border: 1px solid #aaa;
        padding-left: 5px;
        padding-right: 5px;
        height: 225px;
        margin-left: 10px;
        cursor: pointer;
        padding-top: 40px;
        padding-bottom: 40px;
        text-align: center;
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
`;

class InspectionDepartmentResultModal extends Component {
    constructor(props) {
        super(props);
        let cur_date = new Date();
        this.state = {
            order_kinds:getInspectionNameList(),
            start_date:new Date(),
            end_date:cur_date.setDate(cur_date.getDate() + 1),
            isSearchConditionSelectModal:false,
            isDepartmentResultPreviewModal:false,
            department_codes:[],
            inspection_types:[],
            alert_messages:"",
            complete_message:"",
        }
        this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }

    async componentDidMount() {

    }

    setInspectionPeriod=(key,value)=>{
        this.setState({[key]:value});
    };

    openSearchConditionSelectModal=()=>{
        this.setState({isSearchConditionSelectModal:true});
    }

    openDepartmentResultPreviewModal=()=>{
        this.setState({isDepartmentResultPreviewModal:true});
    }

    closeModal=()=>{
        this.setState({
            isSearchConditionSelectModal:false,
            isDepartmentResultPreviewModal:false,
            alert_messages:"",
        });
    }

    getCondition=(data)=>{
        this.setState({
            isSearchConditionSelectModal:false,
            start_date:data.start_date,
            end_date:data.end_date,
            department_codes:data.department_codes,
            inspection_types:data.inspection_types,
        });
    }

    searchData=async()=>{
        this.setState({complete_message:"検索中"});
        let path = "/app/api/v2/master/inspection/getDepartmentResult";
        let post_data = {
            start_date:formatDateLine(this.state.start_date),
            end_date:formatDateLine(this.state.end_date),
            department_codes:this.state.department_codes,
            inspection_types:this.state.inspection_types,
        };
        await apiClient._post(
            path,
            {params: post_data})
            .then((res) => {
                this.setState({complete_message:""});
                if(Object.keys(res).length > 0){
                    this.download_csv(res)
                } else {
                    this.setState({alert_messages:"条件に一致する結果は見つかりませんでした。"});
                }
            })
            .catch(() => {

            })
    }

    download_csv=(list_data)=> {
        let csv_data = [];
        let first_line = [];
        first_line.push('');
        this.departmentOptions.map(item=>{
            if(this.state.department_codes.includes(item.id)){
                first_line.push(item.value);
                for(let i=0; i<(this.state.inspection_types.length * 3) - 1; i++){
                    first_line.push('');
                }
            }
        });
        csv_data.push(first_line);
        let second_line = [];
        second_line.push('');
        for(let i=0; i < this.state.department_codes.length; i++){
            this.state.order_kinds.map(item=>{
                if(this.state.inspection_types.includes(item.id)){
                    second_line.push(item.value);
                    second_line.push('');
                    second_line.push('');
                }
            });
        }
        csv_data.push(second_line);
        let third_line = [];
        third_line.push('日付');
        for(let i=0; i < this.state.department_codes.length; i++){
            for(let j=0; j < this.state.inspection_types.length; j++){
                third_line.push('入院');
                third_line.push('外来');
                third_line.push('合計');
            }
        }
        csv_data.push(third_line);

        Object.keys(list_data).map((date)=> {
            let data = list_data[date];
            let csv_data_item = [];
            csv_data_item.push(formatJapanDateSlash(date));
            this.state.department_codes.map(department => {
                this.state.inspection_types.map(inspection => {
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

        aTag.download = '生理検査科別統計.csv';

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

    render() {
        return (
            <>
                <Modal show={true} className="custom-modal-sm patient-exam-modal first-view-modal inspection-department-result-modal">
                    <Modal.Header><Modal.Title>科別統計（生理検査）</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                            <div className={'flex'}>
                                <div className={'period-area'} style={{width:"40%"}}>
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
                                <div className={'list-condition'}>
                                    <div>一覧条件表示</div>
                                    <div className={'flex condition-table'}>
                                        <div className={'table-area'}>
                                            <table className="table-scroll table table-bordered">
                                                <thead>
                                                <tr>
                                                    <th style={{width:"200px"}}>伝票種別</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {this.state.inspection_types.length > 0 && (
                                                    this.state.order_kinds.map(item=>{
                                                        if(this.state.inspection_types.includes(item.id)){
                                                            return (
                                                                <tr>
                                                                    <td style={{width:"200px"}}>{item.value}</td>
                                                                </tr>
                                                            );
                                                        }
                                                    })
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className={'table-area'}>
                                            <table className="table-scroll table table-bordered">
                                                <thead>
                                                <tr>
                                                    <th style={{width:"200px"}}>診療科</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {this.state.department_codes.length > 0 && (
                                                    this.departmentOptions.map(item=>{
                                                        if(this.state.department_codes.includes(item.id)){
                                                            return (
                                                                <tr>
                                                                    <td style={{width:"200px"}}>{item.value}</td>
                                                                </tr>
                                                            );
                                                        }
                                                    })
                                                )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <div className={'select-search-condition'} onClick={this.openSearchConditionSelectModal}>検索条件選択</div>
                            </div>

                        </Wrapper>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                      <Button className="red-btn" onClick={this.searchData}>ファイル出力</Button>
                      <Button className="red-btn" onClick={this.openDepartmentResultPreviewModal}>印刷プレビュー</Button>
                    </Modal.Footer>
                    {this.state.isSearchConditionSelectModal && (
                        <SearchConditionSelectModal
                            closeModal={this.closeModal}
                            handleOk={this.getCondition}
                            condition_data={this.state}
                            order_type={'inspection'}
                        />
                    )}
                    {this.state.isDepartmentResultPreviewModal && (
                        <DepartmentResultPreviewModal
                            closeModal={this.closeModal}
                            condition_data={this.state}
                            order_type={'inspection'}
                        />
                    )}
                    {this.state.complete_message !== '' && (
                        <CompleteStatusModal
                            message = {this.state.complete_message}
                        />
                    )}
                    {this.state.alert_messages !== "" && (
                        <SystemAlertModal
                            hideModal= {this.closeModal.bind(this)}
                            handleOk= {this.closeModal.bind(this)}
                            showMedicineContent= {this.state.alert_messages}
                        />
                    )}
                </Modal>
            </>
        );
    }
}
InspectionDepartmentResultModal.contextType = Context;
InspectionDepartmentResultModal.propTypes = {
    closeModal: PropTypes.func,
};

export default InspectionDepartmentResultModal;
