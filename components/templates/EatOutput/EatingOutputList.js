import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import InputWithLabel from "../../molecules/InputWithLabel";
import auth from "~/api/auth";
import * as localApi from "~/helpers/cacheLocal-utils";


const PatientsWrapper = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  .flex {
    display: flex;
  }
 .title-area {
    margin-left: 10px;
    padding-top: 10px;
  }
  .title {
    font-size: 30px;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .hBWNut {
    padding-top: 90px!important;
  }
  .schedule-area {
      background-color: white;
  }
  .arrow{
    cursor:pointer;
    font-size:1rem;
  }
  .prev-month {
      padding-right: 5px;
  }
  .next-month {
    padding-left: 5px;
  }
  .schedule-area {
    width: 100%;
    height: calc(100% - 220px);
    overflow-y: auto;
    table {
        margin-bottom: 0;
          tr {
    &:nth-child(2n) {
      background-color: lightgrey;
    }
  }
    }
    td {
        padding:0;
        text-align: center;
        font-size: 16px;
        vertical-align: middle;
    }
    th {
        text-align: center;
        padding: 8px;
        font-size: 1rem;
        font-weight: normal;
        border-bottom: 1px solid #aaa;
        background-color: #e2caff;
    }
    .med-no {
        background-color: #e2caff;
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
 
  .sunday-border {
    border-right: 1px solid #aaa;
  }
  .tr-border {
    td {
        border-bottom: 1px solid #aaa;
    }
  }
  
  .med-name{
    font-size:0.875rem;
    width: 12%;
  }
  .med-unit{
    font-size:0.875rem;
    width: 4rem;
  }
`;

const Flex = styled.div`
  align-items: center;
  padding: 10px 0px 10px 10px;
  width: 100%;
  .search-box {
      width: 100%;
      display: flex;
  }
 .pullbox-select {
      font-size: 0.875rem;
      width: auto;
      padding-right: 2rem;
      height:30px;
  }
  .hvMNwk{
      margin-top: 0;
      .label-title{
          width: 0.5rem;
      }
  }
  .check-area{
      label {
          font-size: 0.875rem;
      }
  }
  .period{
      .react-datepicker-wrapper{
          input {
              width: 10rem;
          }
      }
  }
`;


class EatingOutputList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirm_message: "",
      complete_message:'',
      time_limit_from: new Date(),
      time_limit_to: new Date(new Date().setDate(new Date().getDate()+7)),
    };
  }
  
  async componentDidMount() {
    auth.refreshAuth(location.pathname+location.hash);
    localApi.setValue("system_next_page", "/nutrition");
    localApi.setValue("system_before_page", "/nutrition");
    await this.getSearchResult();
  }
  
  
  getSearchResult =async()=>{
    this.setState({
      table_list:[
        {patient_number:"000003", patient_name:"東朋　太郎", print_state:"●", reception_or_done:"▲", document_type:"食事オーダー", start_date: "2020年05月26日",consented_date:"2020年05月26日",hospital:"テスト病棟"},
        {patient_number:"999008", patient_name:"確認　八郎", print_state:"●", reception_or_done:"▲", document_type:"食事オーダー", start_date: "2020年05月26日",consented_date:"2020年05月26日",hospital:"テスト病棟"},
      
      ]
    });
  }
  
  gettime_limit_to = value => {
    if (value.getTime() - this.state.time_limit_from.getTime() < 0) {
      return;
    }
    this.setState({time_limit_to: value},()=>{
      this.getSearchResult();
    });
  };
  gettime_limit_from = value => {
    this.setState({time_limit_from: value},()=>{
      this.getSearchResult();
    });
  };
  
  render() {
    let {table_list} = this.state;
    return (
      <PatientsWrapper>
        <div className="title-area"><div className={'title'}>移動食事一覧 伝票内容確認一覧</div></div>
        <Flex>
          <div className="period d-flex">
            <label className="title-label">開始日</label>
            <InputWithLabel
              label=""
              type="date"
              getInputText={this.gettime_limit_from}
              diseaseEditData={this.state.time_limit_from}
            />
            <label className="title-label ml-2">~終了日</label>
            <InputWithLabel
              label=""
              type="date"
              getInputText={this.gettime_limit_to}
              diseaseEditData={this.state.time_limit_to}
            />
          </div>
        </Flex>
        <div className={'schedule-area'}>
          <table className="table-scroll table table-bordered" id="code-table">
            <thead>
            <tr>
              <th className="med-name">患者番号</th>
              <th className="med-unit">患者名称</th>
              <th className="med-unit">印刷</th>
              <th className="med-unit">依/実</th>
              <th className="med-unit">文書種別</th>
              <th className="med-unit">開始日</th>
              <th className="med-unit">依頼日</th>
              <th className="med-unit">病棟</th>
            </tr>
            </thead>
            <tbody>
            {table_list != null && table_list.length > 0 && table_list.map((item,key)=>{
              return (
                <tr key={key}>
                  <td>{item.patient_number}</td>
                  <td>{item.patient_name}</td>
                  <td>{item.print_state}</td>
                  <td>{item.reception_or_done}</td>
                  <td>{item.document_type}</td>
                  <td>{item.start_date}</td>
                  <td>{item.consented_date}</td>
                  <td>{item.hospital}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
        <div className={`d-flex btn-area mt-2`}>
          <button>戻る</button>
          <button>選択設定</button>
          <button>条件設定</button>
          <button>受付(F3)</button>
          <button>受付取消</button>
          <button>印刷</button>
          <button>再印刷</button>
          <button>ビッキング印刷</button>
          <button>一覧印刷</button>
          <button>患者選択</button>
          <button>ラベル印刷</button>
          <button>最新表示(F5)</button>
          <button>全選択</button>
          <button>全解除</button>
        </div>
        {this.state.complete_message !== '' && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
      </PatientsWrapper>
    );
  }
}

EatingOutputList.contextType = Context;
EatingOutputList.propTypes = {
  history: PropTypes.object,
}
export default EatingOutputList;