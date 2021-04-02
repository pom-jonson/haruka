import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import * as methods from "../DialMethods";
import Checkbox from "~/components/molecules/Checkbox";
import * as apiClient from "~/api/apiClient";
import { displayLineBreak } from "~/helpers/dialConstants";
import Spinner from "react-bootstrap/Spinner";
import renderHTML from 'react-render-html';

const SpinnerWrapper = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  float: left;
  height: 100%;
  flex-direction: column;
  display: flex;
  text-align: center;
  p {
    margin-bottom: 0;
  }
  .history-list {
    width: 100%;
    height:10rem;
    font-size: 1rem;
    table {
      margin-bottom: 0;
      thead{
        display:table;
        width:100%;
      }
      tbody{
          display:block;
          overflow-y: scroll;
          height: 10rem;
          width:100%;
      }
      tr{
          display: table;
          width: 100%;
      }
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
      td {
        word-break: break-all;
          padding: 0.25rem;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      }
      .check {
          width: 2rem;
          label {
            margin-right: 0;
          }
      }
      .date {
          width: 10rem;
      }
      .version {
          width: 3rem;
      }
      .w-3 {
        width: 3rem;
      }
      .w-5 {
        width: 5rem;
      }
      .name{
        width:20rem;
      }
    }
  }
  .history-content {
    width: 100%;
    font-size:1rem;
    height:33rem;
    .content-header {
      background: lightblue;
      text-align: left;
    }
    .w100{
      width:100%;
      border:1px solid lightgray;
      text-align:left;
    }.top-div {
        margin-top: -1.5rem;
       }
    .w50{
      width:50%;      
    }
    .content-body {
      overflow-y: scroll;
      height: 31rem;
      border: solid 1px lightgray;
      .blue-div {
        color: blue;
      }
      .deleted {
        background-position: 0px 50%;
        color: black;
        text-decoration: none;
        background-image: linear-gradient(rgb(0,0,0), rgb(0,0,0));
        background-repeat: repeat-x;
        background-size: 100% 1px;
      }
      del div {
        text-decoration: line-through;
      }
    }
    .delete-item {
      color: black !important;
      text-decoration: line-through !important;
      div {
        text-decoration: line-through !important;
      }
    }
    .content-title {
      .left-div {
        width: calc(50% - 8.5px);
      }
      .right-div {
        width: calc(50% + 8.5px);
      }
    }
  }
 `;

export class ChangeRadiationLogModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
        name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    this.state = {
      is_loaded : false,
    };
    this.version_map = {};
  }

  componentDidMount = async() => {
    await this.getDoctors();
    await this.getDrKarteStyle();
    await this.getStaffs();
    this.getHistoryList(this.props.history_numbers);
  }
  getDrKarteStyle = async () => {
    let path = "/app/api/v2/management/config/get_drkarte_style";
    await apiClient.post(path).then(res=>{
      this.setState({drkarte_style: res});
    })
  }

  getHistoryList = async(history_numbers) => {
    if (history_numbers== undefined || history_numbers == null) return;
    if (!(typeof history_numbers == 'number')){
      history_numbers = history_numbers.split(',');
    } else {
      history_numbers = [history_numbers];
    }    
    let path = "/app/api/v2/dial/board/Soap/search_by_numbers";
    await apiClient._post(path, {params: {numbers:history_numbers, order_karte_type:this.props.order_karte_type}})
    .then(res => {      
        if (res != null){
          let sub_detail = [];
          if (res.sub_detail != undefined && res.sub_detail != null && res.sub_detail.length > 0) sub_detail = res.sub_detail;          
          let history_list = [];
          res.instruction.map((item) => {
            history_list.push({
              number: item.number,
              timeline_number: item.timeline_number,
              body: item.body,
              body_2: item.body_2,
              category_1: item.category_1,
              category_2: item.category_2,
              instruction_doctor_number: item.instruction_doctor_number,
              updated_by: item.updated_by,
              updated_at: item.updated_at,
              is_doctor_consented: item.is_doctor_consented,
              is_enabled: item.is_enabled,
              relation: item.relation,
              enable_show: true
            });
          });
          
          this.outputs = [];
          if (history_list.length > 0 && sub_detail.length > 0) {
            history_list.map(item => {
              var relation_data = sub_detail.filter(x=> x.relation == item.number);
              item.relation_data = relation_data;
            })           
          }
          
          let result = JSON.parse(JSON.stringify(history_list));
          result.reverse();
          result.map((item, index) => {
            item.enable_show = true;
            item.new = true;
            let prev = undefined;
            let change_history = [];
            if (index > 0) {
              prev = result[index - 1];              
              if (prev.body != item.body) {
                item.prev_body = prev.body;
                item.new = true;
              } else {
                item.new = false;
              }


              let prev_relation = result[index - 1].relation_data;
              if (item.relation_data !== undefined && item.relation_data.length > 0) {
                if (prev_relation !== undefined && prev_relation.length > 0) {
                  item.relation_data.map(sub_item => {
                    var index = prev_relation.findIndex(x => x.category_2 == sub_item.category_2 && x.export_relation == sub_item.export_relation);
                    if (index > -1){
                      if (sub_item.body != prev_relation[index].body){
                        sub_item.prev_body = prev_relation[index].body;
                        sub_item.new = true;                        
                      } else{
                        sub_item.new = false;
                      }
                    } else {
                      sub_item.new = true;
                    }
                  })                  
                } else {
                  item.relation_data.map(sub_item => {
                    sub_item.new = true;
                  })
                }                
              }

              if (prev_relation != undefined && prev_relation.length > 0){
                if (item.relation_data == undefined || item.relation_data.length == 0){
                  item.prev_relation_data = prev_relation;
                } else {
                  item.prev_relation_data = [];
                  prev_relation.map(sub_item => {
                    var index = item.relation_data.findIndex(x => x.category_2 == sub_item.category_2 && x.export_relation == sub_item.export_relation && x.category_2 != '経過');
                    if (index == -1) item.prev_relation_data.push(sub_item);
                  })
                }
              }
              
            } else {
              if (item.relation_data !== undefined && item.relation_data.length > 0) {
                item.relation_data.map(sub_item => {
                  sub_item.new = true;
                })
              }
            }            
            item.change_history = change_history;
            this.outputs.push(item);
          });
          if (this.outputs !== undefined && this.outputs != null && this.outputs.length > 0) {
            this.outputs.map((item, index)=> {
              if (index > 0) {
                item.prev_data = this.outputs[index-1];
              }
            })
          }
          this.outputs.reverse();
          this.setState({
            history_list,
            sub_detail,            
            is_loaded:true
          })
        } else {
            this.setState({
              history_list:null,
              sub_detail:null,
              is_loaded:true
            })
        }
    })
    .catch(()=> {
        this.setState({
          history_list:null,
          sub_detail:null,          
          is_loaded:true
        })
    })
  }
  
  getRadio = async (number,name,value) => {
    if (name === "check") {
      let {sub_detail, history_list} = this.state;
      history_list.find(x=>x.number == number).enable_show = value;
      this.outputs.find(x=>x.number == number).enable_show = value;
      // sub_detail[number].enable_show = value;
      this.setState({sub_detail});
    }
  };
  
  prescriptionRender = (pres_array) => {
    let max_length = this.state.drkarte_style !== undefined && this.state.drkarte_style.drkarte_display_width !== undefined ? this.state.drkarte_style.drkarte_display_width : 80;
    return (pres_array.map(item=> {
      let lines = parseInt(item.left_str.length / max_length);
      let mods = (item.left_str.length % max_length + item.right_str.length) > max_length;
      let topstyle = lines > 0 && !mods;
      return (
        <div className="" key={item} style={{clear:"both"}}>
          <div className="left-div" style={(item.rp_key === undefined || item.rp_key >0) ? {float:"left"}:{float: "left", marginLeft:"1.5rem"}}>{item.left_str}</div>
          <div className={topstyle?"top-div":""} style={item.is_usage == 1 ? {float:"right", marginRight:"3rem"}:{float:"right"}}>{item.right_str}</div>
        </div>
      )
    }))
  }
  IsJsonString = (str) => {
    try {
      var json = JSON.parse(str);
      return (typeof json === 'object');
    } catch (e) {
      return false;
    }
  }

  render() {    
    var {history_list,doctor_list_by_number, staff_list_by_number} = this.state;    
    return (
      <Modal show={true} size="lg" className="modal-history-drkarte master-modal">
        <Modal.Header>
          <Modal.Title>変更履歴</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="history-list">
              <table className="table table-bordered table-hover">
                <thead>
                  <tr>
                    <th className="check"></th>
                    <th className="version">版数</th>
                    <th className="w-3">進捗</th>
                    <th className="date">変更日時</th>
                    <th className="">変更者</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.is_loaded == false && (
                    <>
                    <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                    </>
                  )}
                  {this.state.is_loaded == true && history_list !== undefined && history_list !== null && history_list.length > 0 &&
                    doctor_list_by_number != undefined && staff_list_by_number != undefined && 
                    history_list.map((item, index) => {
                      index = history_list.length - index;
                      this.version_map[item.number] = index;
                      return (
                        <>
                          <tr>
                            <td className="text-center check">
                              <Checkbox
                                label=""
                                getRadio={this.getRadio.bind(this, item.number)}
                                value={item.enable_show}
                                name="check"
                              />
                            </td>
                            <td className="version">
                              {index == 1 ? "初版" : parseInt(index).toString() + "版"}
                            </td>
                            <td className="w-3">
                              {index == 1 ? "新規" : "修正"}
                            </td>
                            <td className="date">
                              {item.updated_at.split('-').join('/')}
                            </td>
                            <td className="text-left">
                              {doctor_list_by_number[item.instruction_doctor_number]}
                              {item.updated_by != null && staff_list_by_number[item.updated_by]!= doctor_list_by_number[item.instruction_doctor_number] && ("、 入力者: " + staff_list_by_number[item.updated_by])}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </table>
            </div>    
            <div className="history-content">              
              <div className="w-100 flex content-title">
                <div className="left-div text-center border-left border-top border-right border-bottom p-1">経過</div>
                <div className="right-div text-center border-top border-right border-bottom p-1">指示・処方・処置</div>
              </div>
              <div className="content-body">
              {this.state.is_loaded == true && this.outputs != undefined && this.outputs != null && this.outputs.length > 0 && 
                this.outputs.map((item, index) => {
                  
                  index = this.outputs.length - index;
                  if(item.enable_show){                    
                    return(
                      <>
                      <div className="content-header pl-1">
                        <span className="mr-3">{index == 1 ? "初版" : parseInt(index).toString() + "版"}</span>
                        <span className="mr-3">{index == 1 ? "新規" : "修正"}</span>                            
                        <span className="mr-3">{item.updated_at.split('-').join('/')}</span>
                        <span className="mr-3">
                          {doctor_list_by_number[item.instruction_doctor_number]}
                          {item.updated_by != null && staff_list_by_number[item.updated_by]!= doctor_list_by_number[item.instruction_doctor_number] && ("、 入力者: " + staff_list_by_number[item.updated_by])}
                        </span>
                      </div>
                      <div className='w100 flex'>
                        <div className='w50' style={{borderRight:'1px solid lightgray'}}>
                          {item.relation_data !== undefined && item.relation_data.length > 0 && (
                            item.relation_data.map(sub_item => {
                              if (sub_item.category_2 == '経過'){
                                return(
                                  <>
                                    <div className={`m-1 ${sub_item.new == true ? 'blue-div' : ''}`}>{displayLineBreak(renderHTML(sub_item.body))}</div>
                                    {sub_item.prev_body != undefined && sub_item.prev_body != "" && (
                                      <del className='m-1 deleted'>{displayLineBreak(renderHTML(sub_item.prev_body))}</del>
                                    )}
                                  </>
                                )
                              }
                            })
                          )}
                        </div>
                        <div className='w50'>
                          <>
                          {item.category_2 !='経過' && item.body != "" && (
                            <>
                            <div className={`m-1 ${item.new == true ? 'blue-div' : ''}`}>{this.IsJsonString(item.body) ? (
                              <>
                              <div>{this.prescriptionRender(JSON.parse(item.body))}</div>
                              <div style={{clear:'both'}}></div>
                              </>
                            ):(
                              <>
                                {item.category_2 == "指示" ? (
                                  <div style={{clear:'both'}}>{displayLineBreak(renderHTML(item.body))}</div>
                                ):(
                                  <div style={{clear:'both'}}>{displayLineBreak(renderHTML(item.body))}</div>
                                )}
                              </>
                            )}
                            </div>
                            {item.prev_body != undefined && item.prev_body != "" && (
                              <>
                                {this.IsJsonString(item.prev_body) ? (
                                  <del>{this.prescriptionRender(JSON.parse((item.prev_body)))}</del>
                                ):(
                                  <del className='m-1 deleted'>{displayLineBreak(renderHTML(item.prev_body))}</del>
                                )}
                                <div style={{clear:'both'}}></div>
                                </>
                            )}
                            </>
                          )}
                          {item.relation_data != undefined && item.relation_data.length > 0 && (
                            item.relation_data.map(sub_item => {
                              if (sub_item.category_2 != '経過'){
                                return(
                                  <>
                                  <div className={`m-1 ${sub_item.new != true ? '':'blue-div'}`}>
                                    {this.IsJsonString(sub_item.body) ? (<div>{this.prescriptionRender(JSON.parse(sub_item.body))}</div>)
                                    :(<div style={{clear:'both'}}>{displayLineBreak(renderHTML(sub_item.body))}</div>)}
                                  </div>
                                  <div style={{clear:'both'}}></div>
                                  {sub_item.prev_body != undefined && sub_item.prev_body != '' && (
                                    <>
                                    {this.IsJsonString(sub_item.prev_body) ? (
                                      <del>{this.prescriptionRender(JSON.parse((sub_item.prev_body)))}</del>
                                    ):(
                                      <del className='m-1 deleted'>{displayLineBreak(renderHTML(sub_item.prev_body))}</del>
                                    )}
                                    <div style={{clear:'both'}}></div>
                                    </>
                                  )}
                                  </>
                                )
                              }
                            })
                          )}
                          {item.prev_relation_data != undefined && item.prev_relation_data.length > 0 && (
                            item.prev_relation_data.map(sub_item => {
                              if (sub_item.category_2 != '経過'){
                                return(
                                  <>                                    
                                  {sub_item.body != undefined && sub_item.body != '' && (
                                    <>
                                    {this.IsJsonString(sub_item.body) ? (
                                      <del>{this.prescriptionRender(JSON.parse((sub_item.body)))}</del>
                                    ):(
                                      <del className='m-1 deleted'>{displayLineBreak(renderHTML(sub_item.body))}</del>
                                    )}
                                    <div style={{clear:'both'}}></div>
                                    </>
                                  )}
                                  </>
                                )
                              }
                            })
                          )}
                          </>
                        </div>
                      </div>
                      </>
                    )
                  }
                })
               }
               {this.state.is_loaded == false && (
                <>
                <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
                </>
              )}
            </div>
            </div>        
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <div onClick={this.props.closeModal} className="custom-modal-btn cancel-btn" style={{cursor:"pointer"}}>
            <span>閉じる</span>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}
ChangeRadiationLogModal.contextType = Context;

ChangeRadiationLogModal.propTypes = {
  closeModal: PropTypes.func,  
  history_numbers: PropTypes.array,
  order_karte_type: PropTypes.string
};

export default ChangeRadiationLogModal;