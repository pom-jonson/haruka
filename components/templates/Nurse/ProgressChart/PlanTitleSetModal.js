import React, { Component} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Modal } from "react-bootstrap";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
// import {getStaffName} from "~/helpers/constants";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import Checkbox from "~/components/molecules/Checkbox";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import * as apiClient from "~/api/apiClient";
import Radiobox from "~/components/molecules/Radiobox";

  const Popup = styled.div`
    height: 96%;
    // padding:1.5rem;
    .label-title{
      width:auto;
      margin-top:3px;
      margin-left:10px;
    }
    .clickable{
      cursor:pointer;
    }
    table {
      margin-bottom:0px;
      thead{
        display:table;
        width:100%;
      }
      tbody{
        display:block;
        overflow-y: auto;
        height: 13rem;
        width:100%;
      }
      tr{
        display: table;
        width: 100%;
      }
      tr:nth-child(even) {background-color: #f2f2f2;}      
      td {
        word-break: break-all;
        padding: 0.25rem;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      } 
      .no{
        label{
          margin-right:0;
        }
        width:6rem;
      }
      .date{
        width:12rem;
        text-align:center;
      }
      .content{
        width:25rem;
      }
      .updated_by{
        width:15rem;
      }
      .part{
        width:8rem;
        text-align:center;
        input{
          width:97%;
          height:2rem;
        }
      }
      .side{
        input[type="text"]{
          height:2rem;
          width:4.5rem;
        }
      }
    }
    .selected{
      background: lightblue!important;
    }
  `;

  const ContextMenuUl = styled.ul`
    margin-bottom:0;
    .context-menu {
      animation-name: fadeIn;
      animation-duration: 0.4s;
      background-clip: padding-box;
      background-color: #fff;
      border-radius: 0.5rem;
      box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);    
      list-style-type: none;
      margin: 0;
      outline: none;
      padding: 0;
      position: absolute;
      text-align: left;
      top: 84px;
      overflow: hidden;
      -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
      z-index: 200;
    }
    .context-menu li {
      clear: both;
      color: rgba(0, 0, 0, 0.65);
      cursor: pointer;
      font-size: 1rem;
      font-weight: normal;
      line-height: 1.5rem;
      margin: 0;
      padding: 0px;
      transition: all 0.3s;
      white-space: nowrap;
      -webkit-transition: all 0.3s;
      div {
        padding: 0.3rem 0.75rem;
      }
    }
    .context-menu li:hover {
      background-color: #e6f7ff;
    }
    .context-menu li > i {
      margin-right: 0.5rem;
    }
    .blue-text {
      color: blue;
    }
`;

const ContextMenu = ({ visible, x,  y,  parent,  row_index}) => {  
  if (visible) {
      return (
          <ContextMenuUl>
              <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                <li><div onClick={() => parent.copyRow(row_index)}>複製</div></li>
              </ul>
          </ContextMenuUl>
      );
  } else {
      return null;
  }
};
  
  class PlanTitleSetModal extends Component {
    constructor(props) {
      super(props);      
      this.state = {
        start_date:'',
        end_date:'',
        alert_messages:'',
        confirm_message:'',
        confirm_alert_title:'',
        plan_results:[]
      }
      this.old_results = [];
    }

    async componentDidMount () {      
      let path = "/app/api/v2/nurse/getPlanTitles";
      let post_data = {
        elapsed_plan_ids:this.props.elapsed_plan_ids,
        system_patient_id:this.props.system_patient_id
      };
      await apiClient._post(path, {params: post_data})
        .then (res => {
          var origin_results = [];
          if (res.length > 0){            
            var plan_results = {};
            this.old_results = [];
            res.map(item => {
              if (item.start_date != undefined && item.start_date != null) item.is_checked = true;
            })
            origin_results = JSON.parse(JSON.stringify(res));

            res.map(item => {              
              if (plan_results[item.number] == undefined && plan_results[item.number] == null) {
                plan_results[item.number] = item;
              } else {                
                if (plan_results[item.number].left_side != 1 && item.left_side == 1) plan_results[item.number].left_side = item.left_side;
                if (plan_results[item.number].right_side != 1 && item.right_side == 1) plan_results[item.number].right_side = item.right_side;
                if (plan_results[item.number].other_side != 1 && item.other_side == 1) {
                  plan_results[item.number].other_side = item.other_side;
                  plan_results[item.number].other_side_value = item.other_side_value;
                }
              }
            })
            
            var temp = [];
            if (plan_results != {}){
              Object.keys(plan_results).map(key => {
                temp.push(plan_results[key]);
              })
            }
            plan_results = temp;
          }
          this.setState({
            plan_results,             
            origin_results,
          })
        })
    }

    handleOk = () => {
      if (this.state.plan_results == undefined || this.state.plan_results == null || this.state.plan_results.length == 0) return;
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
      var plan_results = this.state.plan_results;
      var checked_flag = false;
      plan_results.map(item => {
        if (item.is_checked) checked_flag = true;
      })
      if (checked_flag == false){
        this.setState({
          alert_messages:'登録する項目がありません。'
        })
        return;
      }
      
      this.setState({
        confirm_message:'一括登録しますか？',
        confirm_alert_title:'登録確認'
      })
    }

    confirmOk = async() => {
      this.confirmCancel();
      let path = "/app/api/v2/nurse/progress_chart/register_elapsed_title_multi";      
      var plan_results = this.state.plan_results;      
      var checked_plans = [];
      plan_results.map(item => {        
        if (item.is_checked) {
          var temp = JSON.parse(JSON.stringify(item));
          var check_side_flag = false;
          if (item.left_side){
            temp.side = '左';
            check_side_flag = true;
            checked_plans.push(temp);
          }
          temp = JSON.parse(JSON.stringify(item));
          if (item.right_side){
            temp.side = '右';
            check_side_flag = true;
            checked_plans.push(temp);
          }
          temp = JSON.parse(JSON.stringify(item));
          if (item.other_side && item.other_side_value != ''){
            temp.side = item.other_side_value;
            check_side_flag = true;
            checked_plans.push(temp);
          }
          temp = JSON.parse(JSON.stringify(item));
          if (check_side_flag == false) checked_plans.push(temp);
        }
        // checked_plans.push(item);
      });      
      var post_data = {
        start_date:this.state.start_date,
        end_date: this.state.end_date,
        system_patient_id : this.props.system_patient_id,
        plan_data:checked_plans
      }
      await apiClient.post(path, {params:post_data})
      this.props.closeModal();
    }

    getInputdate = (name, value) => {
      this.setState({[name]:value});
      this.change_flag = true;
    }

    getRadio = (number, name, value) => {      
      var {plan_results} = this.state;
      var index = '';
      if (name == 'title'){
        index = plan_results.findIndex(x => x.number == number);
        if (index > -1){
          plan_results[index].is_checked = value;
        }
      }
      // if (name == 'old_title'){        
      //   index = old_results.findIndex(x => x.title_id == number);
      //   if (index > -1){
      //     old_results[index].is_checked = value;
      //   }
      // }
      this.setState({plan_results})
    }

    confirmCancel = () => {
      this.setState({
        alert_messages:'', 
        confirm_message:'',
        confirm_alert_title:''
      })
    }

    // getSide = (index, e) => {
    //   var plan_results = this.state.plan_results;
    //   if (e.target.value == '左' || e.target.value =='右'){
    //     plan_results[index].side = e.target.value;
    //     plan_results[index].other_side = false;
    //   } else {
    //     plan_results[index].other_side =  plan_results[index].other_side == true?false:true;
    //     plan_results[index].side = '';
    //   }
      
    //   this.setState({plan_results})
    // }

    getSide = (index, name,  value) => {
      var plan_results = this.state.plan_results;
      plan_results[index][name] = value;
      this.setState({plan_results})
    }

    getInputText = (index, name, e) => {
      var plan_results = this.state.plan_results;
      plan_results[index][name] = e.target.value;      
      this.setState({plan_results})
    }

    handleClick = (e, index) => {
      if (e.type === "contextmenu") {
        e.preventDefault();
        // eslint-disable-next-line consistent-this
        const that = this;
        document.addEventListener(`click`, function onClickOutside() {
          that.setState({ contextMenu: { visible: false } });
          document.removeEventListener(`click`, onClickOutside);
        });
        window.addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          window.removeEventListener(`scroll`, onScrollOutside);
        });
        document
            .getElementById("table-body-titles")
            .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                contextMenu: { visible: false }
              });
              document
                .getElementById("table-body-titles")
                .removeEventListener(`scroll`, onScrollOutside);
            });
        var modal = document.getElementsByClassName('notice-modal')[0];
        var modal_body = document.getElementById('plan-set-modal');        
        this.setState({
          contextMenu: {
            visible: true,
            x: e.clientX - modal_body.offsetLeft,
            y: e.clientY - modal.offsetTop - modal_body.offsetTop,
          },
          row_index: index
        });
      }
    }

    copyRow = (row_index) => {
      var plan_results = this.state.plan_results;
      var add_item = JSON.parse(JSON.stringify(plan_results[row_index]));
      add_item.title_id = null;
      plan_results = [...plan_results.slice(0,row_index + 1), add_item, ...plan_results.slice(row_index + 1, plan_results.length)];
      this.setState({plan_results})
    }

    getStopingResult() {
      var plan_results = this.state.plan_results;      
      var origin_results = this.state.origin_results;
      this.old_results = [];
      if (origin_results != undefined && origin_results != null && origin_results.length > 0){
        origin_results.map(origin_item => {
          if (origin_item.is_checked){
            var index = plan_results.findIndex(x => {
              var res = true;
              // if (!x.is_checked) res = false;
              if (x.number != origin_item.number) res = false;
              if (x.left_side != 1 && origin_item.left_side) res = false;
              if (x.right_side != 1 && origin_item.right_side) res = false;
              if (x.other_side != 1 && origin_item.other_side) res = false;
              if (origin_item.other_side && x.other_side == origin_item.other_side && x.other_side_value != origin_item.other_side_value) res = false;
              return res;            
            });
            
            if (index == -1) {              
              this.old_results.push(origin_item);
            }
          }
        })
      }
      
    }
    
    render() {      
      var {plan_results} = this.state;      
      this.getStopingResult();      
      return (   
        <>     
          <Modal
            show={true}          
            id="plan-set-modal"
            className="custom-modal-sm notice-modal first-view-modal"
          >
            <Modal.Header>
                <Modal.Title style={{width:'20rem'}}>観察項目一括登録</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup id = 'main-body'>
                <div className='flex'>
                  <InputWithLabelBorder style={{marginRight:'10px'}}
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
                
                <table className="table-scroll table table-bordered">
                  <thead>
                    <tr>
                      <th className='no'>継続・開始</th>
                      <th className='content'>名称</th>
                      <th className='date'>開始・終了日</th>
                      <th className='part'>部位</th>
                      <th classna='side'>位相</th>
                    </tr>
                  </thead>
                  <tbody id = 'table-body-titles'>
                    {plan_results != undefined && plan_results != null && plan_results.length > 0 && (
                      plan_results.map((item, index) => {                        
                        return (
                          <>
                            <tr 
                              // onContextMenu={e => this.handleClick(e, index)}
                            >
                              <td className='no text-center'>
                                <Checkbox
                                  label=""
                                  getRadio={this.getRadio.bind(this, item.number)}
                                  value={item.is_checked}
                                  name="title"
                                />
                              </td>
                              <td className='content'>{item.tier_2nd_name + ' ＞ ' + item.tier_3rd_name}</td>
                              <td className='date'>
                                {item.start_date!= undefined && item.start_date != null?item.start_date + '～':''}
                                {item.end_date!= undefined && item.end_date != null?item.end_date:''}
                              </td>
                              <td className = "part">
                                <input onChange={this.getInputText.bind(this, index, 'part')} value = {item.part}></input>
                              </td>
                              <td className = "side">
                                {/* <Radiobox
                                  id = {'left_' + index}
                                  label={'左'}
                                  value={'左'}
                                  getUsage={this.getSide.bind(this, index)}
                                  checked={item.side == '左' ? true : false}
                                  name={`side_`+ index}
                                />
                                <Radiobox
                                  id = {'right_' + index}
                                  label={'右'}
                                  value={'右'}
                                  getUsage={this.getSide.bind(this, index)}
                                  checked={item.side == '右' ? true : false}
                                  name={`side_`+ index}
                                />
                                <Radiobox
                                  id = {'other_' + index}
                                  label={''}
                                  value={item.other_side}
                                  getUsage={this.getSide.bind(this, index)}
                                  checked = {item.other_side?true:false}
                                  name={`side_`+ index}
                                /> */}
                                <Checkbox
                                  label="左"
                                  getRadio={this.getSide.bind(this, index)}
                                  value={item.left_side}
                                  name={"left_side"}
                                />
                                <Checkbox
                                  label="右"
                                  getRadio={this.getSide.bind(this, index)}
                                  value={item.right_side}
                                  name={"right_side"}
                                />
                                <Checkbox
                                  label=""
                                  getRadio={this.getSide.bind(this, index)}
                                  value={item.other_side}
                                  name={"other_side"}
                                />
                                <input type="text" onChange={this.getInputText.bind(this, index, 'other_side_value')} value = {item.other_side_value} disabled={item.other_side ==true?false:true}/>
                              </td>
                            </tr>
                          </>
                        )
                      })
                    )}
                  </tbody>
                </table>
                <div style={{fontSize:'1rem', marginTop:'1rem', marginBottom:'1rem'}} className='flex'>
                  <div style={{marginTop:'9px', marginLeft:'1rem'}}>一括中止</div>                  
                  {/* <InputWithLabelBorder
                    label="終了日"
                    type="date"
                    getInputText={this.getInputdate.bind(this, 'old_end_date')}
                    diseaseEditData={this.state.old_end_date}
                  /> */}
                </div>
                
                <table className="table-scroll table table-bordered">
                  <thead>                    
                    <tr>
                      <th className='no'>継続・開始</th>
                      <th className='content'>名称</th>
                      <th className='date'>開始・終了日</th>
                      <th className='part'>部位</th>
                      <th classna='side'>位相</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.old_results != undefined && this.old_results != null && this.old_results.length > 0 && (
                      this.old_results.map((item, index) => {
                        if (item.is_checked){
                          return(
                            <tr>
                              <td className='no text-center'>
                                <Checkbox
                                  label=""
                                  getRadio={this.getRadio.bind(this, item.title_id)}
                                  value={item.is_checked}
                                  isDisabled={true}
                                  name="old_title"
                                />
                              </td>
                              <td className='content'>{item.tier_2nd_name + ' ＞ ' + item.tier_3rd_name}</td>
                              <td className='date'>
                                {item.start_date!= undefined && item.start_date != null?item.start_date + '～':''}
                                {item.end_date!= undefined && item.end_date != null?item.end_date:''}
                              </td>
                              <td className = "part">{item.part}</td>
                              <td className = "side">
                                <Radiobox
                                  id = {'left_' + index}
                                  label={'左'}
                                  value={'左'}
                                  getUsage={this.getSide.bind(this, index)}
                                  checked={item.side == '左' ? true : false}
                                  name={`side_`+ index}
                                  isDisabled = {true}
                                />
                                <Radiobox
                                  id = {'right_' + index}
                                  label={'右'}
                                  value={'右'}
                                  getUsage={this.getSide.bind(this, index)}
                                  checked={item.side == '右' ? true : false}
                                  name={`side_`+ index}
                                  isDisabled = {true}
                                />
                                <Radiobox
                                  id = {'other_' + index}
                                  label={''}
                                  value={item.other_side}
                                  getUsage={this.getSide.bind(this, index)}
                                  checked = {item.other_side?true:false}
                                  name={`side_`+ index}
                                  isDisabled = {true}
                                />
                                {item.other_side_value != undefined && item.other_side_value != null && item.other_side_value != '' && item.other_side?item.other_side_value:''}
                                </td>
                            </tr>
                          )
                        }
                      })
                  )}
                  </tbody>
                </table>
              </Popup>
            </Modal.Body>
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
              row_index={this.state.row_index}
            />
            <Modal.Footer>
                <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
                <Button className={(plan_results != undefined && plan_results != null && plan_results.length > 0)?'red-btn':'disable-btn'} onClick={this.handleOk}>確定</Button>
            </Modal.Footer>
            {this.state.alert_messages !== "" && (
              <SystemAlertModal
                hideModal= {this.confirmCancel.bind(this)}
                handleOk= {this.confirmCancel.bind(this)}
                showMedicineContent= {this.state.alert_messages}
              />
            )}
            {this.state.confirm_message != '' && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.confirmOk}
                confirmTitle={this.state.confirm_message}
                title = {this.state.confirm_alert_title}
              />
            )}            
          </Modal>
        </>
      );
    }
  }
  PlanTitleSetModal.contextType = Context;
  
  PlanTitleSetModal.propTypes = {    
    closeModal: PropTypes.func,
    elapsed_plan_ids:PropTypes.array,
    system_patient_id:PropTypes.number,    
  };
  
  export default PlanTitleSetModal;