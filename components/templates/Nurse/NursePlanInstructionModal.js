import React, { 
    Component, 
    // useContext
   } from "react";
  import PropTypes from "prop-types";
  import styled from "styled-components";
  import * as colors from "~/components/_nano/colors";
  import { Modal } from "react-bootstrap";
  import Context from "~/helpers/configureStore";
  // import * as apiClient from "~/api/apiClient";
  // import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
  // import SearchBar from "~/components/molecules/SearchBar"
  // import InputWithLabel from "~/components/molecules/InputWithLabel";
  // import Button from "~/components/atoms/Button";
  // import $ from "jquery";  
  // import Radiobox from "~/components/molecules/Radiobox";  
  import Checkbox from "~/components/molecules/Checkbox";
  import Spinner from "react-bootstrap/Spinner";
  // import DatePicker, { registerLocale } from "react-datepicker";
  // import ja from "date-fns/locale/ja";  
  // registerLocale("ja", ja);

  // import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
  // import { 
  //   faPlus, 
  //   faMinus 
  // } from "@fortawesome/pro-solid-svg-icons";

  const SpinnerWrapper = styled.div`
    justify-content: center;
    align-items: center;
    height: 100%;
    display: flex;
  `;
  
  const Popup = styled.div`
    .flex {
      display: flex;
    }
    height: 96%;
  
    h2 {
      color: ${colors.onSurface};
      font-size: 1.1rem;
      font-weight: 500;
      margin: 6px 0;
    }

    .spinner-disease-loading{
      height: 20rem;
      overflow-y: auto;      
    }
    .table-scroll {
      width: 100%;
      height: 100%;
      max-height: 190px;

      .no-result {
        padding: 75px;
        text-align: center;

        p {
          padding: 10px;
          border: 2px solid #aaa;
        }
      }
    }
    
    .disease-header{
      .department-status{
        .pullbox-title{
          font-size: 1rem;
        }
      }
      overflow: hidden;
      display:flex;   
      margin-bottom:1rem   
    }    
      
    .label-title {
      float: left;
      text-align: right;
      width: 6rem;
      font-size: 1.2rem;
      margin-top: 0;
      &.pullbox-title {
        margin-right: 0.5rem;
      }
    }
    .tree_close{
      display:none;
    }
    
    .tree-area{
      margin-top:10px;
      height:85%;
      overflow-y:auto;
      ul, li{
        list-style:none;
        padding-inline-start:1rem;
      }
      .clickable:hover{
        background: #eee;
      }
    }
    .sel-star{
      position: absolute;
      left: 1rem;
    }

    .sel-li{
      background: #ddd;
    }

    .selected{
      background: lightblue;
    }

    .clickable{
      cursor:pointer;
    }
    .select-area{
      margin-right:2rem;
    }

    .center {
      text-align: center;
      button {
        height: 25px;
        padding: 0;
        line-height: 25px;
        span {
          color: ${colors.surface};
        }
      }
  
      span {
        color: rgb(241, 86, 124);
      }
  
      .black {
        color: #000;
      }
    }
    .red {
      color: rgb(241, 86, 124);
    }

    .table-title {
    margin-top: 0.5rem;
    label {
        margin-bottom: 0;
    }
    .table-name {
        border: 1px solid #aaa;
        width: 180px;
        text-align: center;
    }
    .table-color {
        width: 100px;
        text-align: center;
    }
    .table-request {
        width: 50px;
        text-align: center;
    }
    .table-ok {
        width: 50px;
        text-align: center;
        border: 1px solid #aaa;
    }
}

.table-area {
  table {
    font-size: 1rem;
    margin-bottom: 0;
  }
    
    thead{
      margin-bottom: 0;
      display:table;
      width:100%;        
      border: 1px solid #dee2e6;
      tr{
          width: calc(100% - 18px);
      }
    }
    tbody{
      height: 53vh;
      overflow-y: scroll;
      display:block;
      // tr:nth-child(even) {background-color: #f2f2f2;}
      // tr:hover{background-color:#e2e2e2;}
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        padding: 0.25rem;
        text-align: left;
        vertical-align: middle;
    }
    th {
        text-align: center;
        padding: 0.3rem;
    }      
    .tl {
        text-align: left;
    }      
    .tr {
        text-align: right;
    }
    .white-row:hover {background-color: #f2f2f2;}
    .purple-row {
      background-color: #A757A8;
      color:white;
    }
    .purple-row:hover {
      background-color: #f377f5;
      color:white;
    }
    .pink-row {
      background-color: #F8ABA6;
      color:white;
    }
    .pink-row:hover {
      background-color: #fb8078;
      color:white;
    }
}
.react-datepicker-popper {
  .react-datepicker {
    .react-datepicker__navigation--previous, .react-datepicker__navigation--next {
      height:10px !important;
    }
  }
}
    
  `;
  
  class NursePlanInstructionModal extends Component {
    constructor(props) {
      super(props);
      var problem_list = this.props.problem_list;
      var order_list = [];
      if (problem_list != undefined && problem_list.length > 0){
        problem_list.map(item => {
          item.plan_data.map(sub_item => {
            if(sub_item.instruction_name != null){
              order_list.push({
                system_patient_id:this.props.patientId,
                hospitalization_id:this.props.patientInfo.hospitalization_id,
                name:item.name,
                item_level_id:sub_item.item_level_id,
                plan_master_name:sub_item.name,
                instruction_slip_name:sub_item.instruction_slip_name,                
                instruction_name:sub_item.instruction_name,
                problem_number:item.number,
                implementation_interval_class:sub_item.implementation_interval_class,
                number_of_interval:sub_item.number_of_interval,
                weekly_bit:sub_item.weekly_bit,
                time_designation:sub_item.time_designation,
                number_of_times_per_day:sub_item.number_of_times_per_day,
                time_interval:sub_item.time_interval,
                evaluation_name:item.evaluation_name,
                evaluation_class_date:item.evaluation_class_date,
                next_evaluate_date:item.next_evaluate_date,
                comment:item.comment,
                is_checked:false,
              })
            }
          })
        })
      }
      this.usage_interval_class = {
        1:"単日",
        2:"毎日",
        3:"毎週"
      };

      this.state = {        
        order_list,
        isLoaded: true,
      }
    }

    applyPlan = () => {
      if (this.save_available != true) return;
      var order_list = this.state.order_list;
      var checked_list = [];
      if (order_list.length > 0){
        order_list.map(item => {
          if (item.is_checked == true) checked_list.push(item);
        })
      }
      this.props.applyPlan(checked_list);
      this.props.closeModal();
    }

    getRadio(index, name, value) {
      var order_list = this.state.order_list;
      if (name == 'check'){
        order_list[index].is_checked = value;
      }
      this.setState({order_list});
    }
  
    render() {
      this.save_available = false;
      if (this.state.order_list.length > 0){
        this.state.order_list.map(item => {
          if (item.is_checked) this.save_available = true;
        })
      }              
      return (
        <>
          <Modal
            show={true}          
            id="outpatient"
            className="custom-modal-sm notice-modal first-view-modal"
          >
            <Modal.Header>
                <Modal.Title style={{width:'20rem'}}>指示一覧画面</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup>
                <div className={'table-area'}>
                  <table className="table-scroll table table-bordered">
                    <thead>
                    <tr>
                      <th style={{width:"4rem",textAlign:"center"}}></th>
                      <th style={{width:"10rem"}}>看護計画</th>
                      <th style={{width:"7rem"}}>伝票</th>
                      <th>看護指示項目</th>
                      <th style={{width:"4rem"}}>No</th>
                      <th style={{width:"7rem"}}>区分</th>
                      <th style={{width:"10rem"}}>用法</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.isLoaded == false ? (
                        <div className='spinner-disease-loading center'>
                          <SpinnerWrapper>
                            <Spinner animation="border" variant="secondary" />
                          </SpinnerWrapper>
                      </div>
                    ):(
                      <>
                        {this.state.order_list.length > 0 && (
                          this.state.order_list.map((order, index)=>{                            
                            return (
                              <>
                                <tr>                      
                                  <td style={{width:"4rem",textAlign:"center"}}>
                                    <Checkbox
                                      label=""
                                      getRadio={this.getRadio.bind(this, index)}                                      
                                      value={order.is_checked}
                                      name="check"
                                    />
                                  </td>
                                  <td style={{width:"10rem"}}>{order.plan_master_name}</td>
                                  <td style={{width:"7rem"}}>{order.instruction_slip_name}</td>
                                  <td>{order.instruction_name}</td>
                                  <td style={{width:"4rem"}}>#{order.problem_number}</td>
                                  <td style={{width:"7rem"}}>追加</td>
                                  <td style={{width:"10rem"}}>{this.usage_interval_class[order.implementation_interval_class]}</td>
                                </tr>
                              </>
                            )
                          })
                        )}
                      </>
                    )}
                    </tbody>
                  </table>
                </div>
              </Popup>
            </Modal.Body>
            <Modal.Footer>
                {/* <Button className="red-btn" onClick={this.applyPlan}>反映</Button> */}
                <div className={"custom-modal-btn cancel-btn clickable"} onClick={this.props.closeModal}>
                  <span>閉じる</span>
                </div>
                <div className={this.save_available == true ?"custom-modal-btn red-btn clickable focus":"custom-modal-btn disable-btn"} 
                  onClick={this.applyPlan}>
                  <span>反映</span>
                </div>
            </Modal.Footer>
          </Modal>        
        </>
      );
    }
  }
  NursePlanInstructionModal.contextType = Context;
  
  NursePlanInstructionModal.propTypes = {  
    applyPlan :  PropTypes.func,
    closeModal: PropTypes.func,
    problem_list : PropTypes.array,
    patientId: PropTypes.number,
    patientInfo: PropTypes.object,
    // modal_data : PropTypes.object,
  };
  
  export default NursePlanInstructionModal;
  