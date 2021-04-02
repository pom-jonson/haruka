import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import { faPlus, faMinus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

const Wrapper = styled.div`
  width:100%;
  height: 90%;
  font-size:1rem;
  align-items: flex-start;
  justify-content: space-between;
  .selected {
    background: lightblue;
  }
  .right-area {
    display:block;
    width: 49%;
    height: 100%;
    border: solid 1px gray;
    .tier-3rd {cursor:pointer;}
    .tier-3rd:hover {background-color:#e2e2e2;}
    table {
      width: 100%;
      margin-bottom:0;
      td {
        vertical-align: middle;
        padding: 0.3rem;
      }
    }
  }
  .date-area{
    .label-title{
      width:auto;
      font-size:1rem;
      text-align:right;
      margin-right:5px;
      margin-top:5px;
    }
    input{
      height:2rem;
      margin-right:1rem;
    }
  }
`;

const Col = styled.div`
  width: 49%;
  height: 100%;
  overflow: auto;
  border: 1px solid #aaa;
  nav ul li{
    padding-right: 0 !important;
  }
  li{
    cursor: default;
  }
  li span{
    cursor: pointer;
    white-space: nowrap;
  }
  nav {
    padding: 0.3rem;
    width:100%;
    ul {
      padding-left: 0;
      margin-bottom: 0;
      &:before {
        content: "";
        border-left: 1px solid #ccc;
        display: block;
        width: 0;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
      }
      .selected {
        background: #ddd;
      }
      ul {
        margin-left: 10px;
        position: relative;
        margin-bottom: 0px;
        li {
          padding: 0px 12px;
          &:before {
            content: "";
            border-top: 1px solid #ccc;
            display: block;
            width: 8px;
            height: 0;
            position: absolute;
            top: 10px;
            left: 0;
          }
          &:last-child:before {
            background: #fff;
            height: auto;
            top: 10px;
            bottom: 0;
          }
          ul {
            margin-bottom: 0px;
            li {
              padding: 0px 12px;
              ul {
                margin-bottom: 0px;
                li {
                  padding: 0px 12px;
                }
              }
            }
          }
        }
      }
      li {
        margin: 0;
        padding: 0.2rem 0.5rem;
        text-decoration: none;
        text-transform: uppercase;
        font-size: 0.8125‬rem;
        line-height: 20px;
        position: relative;
      }
    }

    li {
      cursor: pointer;
      list-style-type: none;
    }
  }  
`;

const Icon = styled(FontAwesomeIcon)`
  color: black;
  font-size: 15px;
  margin-right: 5px;
`;

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class ProgressChartSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tree_data:{},
      cur_tier_2nd:{},
      selected_tier_1st_id:'',
      selected_tier_3rd_id:'',
      tier_3rd_name:'',
      alert_messages:'',
      load_data:false,
      set_data: [],
      start_date:'',
      end_date:'',
      confirm_message:''
    };
  }

  async componentDidMount () {
    this.getChartSetData();
  }

  getChartSetData=async()=>{
    let path = "/app/api/v2/nurse/get/chart_set";
    let post_data = {
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          tree_data:Object.keys(res).length > 0 ? res :{},
          load_data:true,
        })
      })
      .catch(() => {

      });
  }

  onHide = () => {};

  selectTier1st=(tier_1st_data, department_id)=>{
    this.setState({
      selected_tree_index:department_id+":"+tier_1st_data.tier_1st_id,
      cur_tier_2nd:(tier_1st_data.tier_2nd != undefined && Object.keys(tier_1st_data.tier_2nd).length > 0) ? tier_1st_data.tier_2nd : {},
      selected_tier_3rd_id:'',
      tier_3rd_name:''
    })
  }

  changeTree=(className, type)=>{
    if(type == "open"){
      let tree_obj = document.getElementsByClassName(className)[0];
      if(tree_obj !== undefined && tree_obj != null){
        tree_obj.style['display'] = "none";
      }
      tree_obj = document.getElementsByClassName(className)[1];
      if(tree_obj !== undefined && tree_obj != null){
        tree_obj.style['display'] = "block";
      }
    } else {
      let tree_obj = document.getElementsByClassName(className)[0];
      if(tree_obj !== undefined && tree_obj != null){
        tree_obj.style['display'] = "block";
      }
      tree_obj = document.getElementsByClassName(className)[1];
      if(tree_obj !== undefined && tree_obj != null){
        tree_obj.style['display'] = "none";
      }
    }
  }

  setTier3rd=(tier_3rd)=>{
    let {set_data} = this.state;
    let find_index = set_data.findIndex(x=>x.tier_3rd_id == tier_3rd.tier_3rd_id);
    if (find_index == -1) {
      set_data.push({
        tier_1st_id: tier_3rd.tier_1st_id,
        tier_2nd_id: tier_3rd.tier_2nd_id,
        tier_3rd_id: tier_3rd.tier_3rd_id,
        tier_3rd_name: tier_3rd.tier_3rd_name,
        result_type: tier_3rd.result_type,
      })
    } else {
      set_data.splice(find_index, 1);
    }
    this.setState({set_data});
  }

  getSelected = (tier_3rd_id) => {
    let {set_data} = this.state;
    let find_index = set_data.findIndex(x=>x.tier_3rd_id == tier_3rd_id);
    if (find_index == -1) return false;
    else return true;
  }

  save = () => {    
    if(this.state.set_data.length == 0){
      return;
    }
    if (this.state.start_date == ''){
      this.setState({
        alert_messages:'開始日を入力してください。'
      })
      return;
    }
    if (this.state.start_date != '' && this.state.end_date != ''){
      if (this.state.start_date.getTime() > this.state.end_date.getTime()){
        this.setState({
          alert_messages:'終了日開始日以降で入力してください。'
        })
        return;
      }
    }

    this.setState({      
      confirm_message: "登録しますか?",
    })
  }

  confirmCancel = () => {
    this.setState({
      confirm_message:'',      
      alert_messages: '',
      confirm_alert_title:''
    })
  }

  confirmOk = async() =>{
    this.confirmCancel();
    var set_data = this.state.set_data;
    var elapsed_result_data = this.props.elapsed_result_data;
    var selected_items = [];
    if (elapsed_result_data != undefined && elapsed_result_data != null && elapsed_result_data.length > 0){
      set_data.map(set_item => {
        var index = elapsed_result_data.findIndex(x => {
          if (x.tier_2nd_id == set_item.tier_2nd_id && x.tier_3rd_id == set_item.tier_3rd_id){
            return true;
          }
          return false;
        })
        if (index == -1) selected_items.push(set_item);
      })
    } else {
      selected_items = set_data;
    }    
    
    var post_data = {
      system_patient_id:this.props.system_patient_id,
      start_date:this.state.start_date,
      end_date:this.state.end_date,
      title_data:selected_items,
    }
    var path = "/app/api/v2/nurse/progress_chart/register_elapsed_title_set";
    await apiClient._post(path, {params:post_data})
      .then(() => {
        this.props.handleOk();
        this.props.closeModal();
      })
  }
  getInputdate = (name, value) => {
    this.setState({[name]:value});
    this.change_flag = true;
  }

  render() {
    return (
      <>
        <Modal show={true} className="progress-chart-set-modal first-view-modal" onHide={this.onHide}>
          <Modal.Header><Modal.Title>セット選択</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className='flex' style={{height:'100%', width:'100%'}}>
                <Col id="set_tree">
                  {this.state.load_data ? (
                      <nav>
                        {Object.keys(this.state.tree_data).length > 0 && (
                          Object.keys(this.state.tree_data).map(department_id=>{
                            let department_data = this.state.tree_data[department_id];
                            return (
                              <>
                                <ul>
                                  <li className={'department:'+department_id}>
                                  <span onClick={this.changeTree.bind(this, ('department:'+department_id), "open")}>
                                    <Icon icon={faPlus} />{department_data['department_name']}
                                  </span>
                                  </li>
                                  <li className={'department:'+department_id} style={{display:"none"}}>
                                  <span onClick={this.changeTree.bind(this, ('department:'+department_id), "close")}>
                                    <Icon icon={faMinus} />{department_data['department_name']}
                                  </span>
                                    {Object.keys(department_data['tier_1st']).length > 0 && (
                                      Object.keys(department_data['tier_1st']).map(tier_1st_id=>{
                                        let tier_1st_data = department_data['tier_1st'][tier_1st_id];
                                        return (
                                          <>
                                            <ul>
                                              <li>
                                              <span
                                                className={this.state.selected_tree_index == department_id+":"+tier_1st_id ? 'selected':""}
                                                onClick={this.selectTier1st.bind(this, tier_1st_data, department_id)}
                                              >{tier_1st_data['tier_1st_name']}</span>
                                              </li>
                                            </ul>
                                          </>
                                        )
                                      })
                                    )}
                                  </li>
                                </ul>
                              </>
                            )
                          })
                        )}
                      </nav>
                    ):(
                    <div style={{width:"100%", height:"100%"}}>
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    </div>
                  )}
                </Col>
                <div className="right-area">
                  <table className="table-scroll table table-bordered">
                    <tbody>
                      {Object.keys(this.state.cur_tier_2nd).length > 0 && (
                        Object.keys(this.state.cur_tier_2nd).map(tier_2nd_id=>{
                          let tier_2nd = this.state.cur_tier_2nd[tier_2nd_id];
                          return (
                            <>
                              <tr>
                                <td>{tier_2nd.tier_2nd_name}</td>
                                <td>
                                  {(tier_2nd.tier_3rd != undefined && Object.keys(tier_2nd.tier_3rd).length > 0) && (
                                    Object.keys(tier_2nd.tier_3rd).map(tier_3rd_id=>{
                                      let tier_3rd = tier_2nd.tier_3rd[tier_3rd_id];
                                      return (
                                        <>
                                          <div
                                            className={this.getSelected(tier_3rd_id) == true ? 'selected' : "tier-3rd"}
                                            onClick={this.setTier3rd.bind(this, tier_3rd)}
                                          >{tier_3rd.tier_3rd_name}</div>
                                        </>
                                      )
                                    })
                                  )}
                                </td>
                              </tr>
                            </>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className='date-area flex'>
                <InputWithLabelBorder
                  label="開始日"
                  type="date"
                  getInputText={this.getInputdate.bind(this, 'start_date')}
                  diseaseEditData={this.state.start_date}                  
                />
                <InputWithLabelBorder
                  label="終了日"
                  type="date"
                  getInputText={this.getInputdate.bind(this, 'end_date')}
                  diseaseEditData={this.state.end_date}                  
                />
              </div>
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={this.state.set_data.length > 0 ? 'red-btn' : "disable-btn"} onClick={this.save}>確定</Button>
          </Modal.Footer>
          {this.state.confirm_message != '' && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.confirmOk.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>
      </>
    );
  }
}

ProgressChartSet.contextType = Context;
ProgressChartSet.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  elapsed_result_data:PropTypes.array,
  system_patient_id:PropTypes.number
};

export default ProgressChartSet;
