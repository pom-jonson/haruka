import React, { 
    Component, 
    // useContext
   } from "react";
  import PropTypes from "prop-types";
  import styled from "styled-components";
  import * as colors from "~/components/_nano/colors";
  import { Modal } from "react-bootstrap";
  import Context from "~/helpers/configureStore";
  import * as apiClient from "~/api/apiClient";  
  import EvaluationDetailModal from "~/components/templates/Nurse/EvaluationDetailModal";
  import ProblemDetailModal from "~/components/templates/Nurse/ProblemDetailModal";
  // import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";  
  // import InputWithLabel from "~/components/molecules/InputWithLabel";
  import Button from "~/components/atoms/Button";
  // import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
  import {formatJapanDate, formatDateTimeIE} from "~/helpers/date";
  import $ from "jquery";
  import ValidateAlertModal from '~/components/molecules/ValidateAlertModal';

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
    .problem-area{
      margin-bottom:2rem;
      .register-info{
        position:absolute;
        right:10px;
        text-align:right;
        display:flex;
        padding-top:2px;
      }
    }
    .left-area{
      width:50%;
      border:1px solid;
      border-right:none;
      border-top:none;
      .border-right{
        border-right:1px solid!important;
      }
    }
    .right-area{
      width:50%;
      border:1px solid;
      border-top:none;
      border-left:none;
    }
    .button-area{
      margin-bottom:16px;
    }
    .one-row{
      padding:0px;
      height:100%;
      display:flex;      
      label{
        margin-bottom:0px;
      }      
      position:relative;
    }
    .title-area{
      background:lightgray;
      text-align:center;
      font-size:1.2rem;
    }
    .name-th{
      padding:0.3rem;
      width:50%;
      border-right:1px solid #aaa;
      border-bottom:1px solid #aaa;
    }
    .comment-th{
      padding:0.3rem;
      width:40%;
      border-right:1px solid #aaa;
      border-bottom:1px solid #aaa;
    }
    .eval-th{
      padding:0.3rem;
      width:10%;
      border-bottom:1px solid #aaa;
    }
    .short-th-plan{
      width:5%;
      border-right:1px solid #aaa;
      border-bottom:1px solid #aaa;
    }
    .name-th-plan{
      padding:0.3rem;
      width:48%;
      border-right:1px solid #aaa;
      border-bottom:1px solid #aaa;
    }
    .comment-th-plan{
      padding:0.3rem;
      width:38%;
      border-right:1px solid #aaa;
      border-bottom:1px solid #aaa;
    }
    .eval-th-plan{
      padding:0.3rem;
      width:9%;
      border-bottom:1px solid #aaa;
    }
    .top-eval-area{
      background : lightblue;
      padding-left:5px;
      padding-right:10px;
      padding-top:3px;
      padding-bottom:3px;
      position:relative;
      .next-date-area{
        position:absolute;
        right:10px;
      }
    }
    .past-area{
      overflow-y:auto;
      max-height: 50vh;
      border-bottom:1px solid;
      div{
        word-wrap:break-word;
      }
    }
    .new-area{
      width:100%;      
      // border-top:1px solid;      
      // margin-top:10px;
      .top-eval-area{
        background : rgb(255, 230, 180);
        width:50%;
      }
      div{
        word-wrap:break-word;
      }
    }
    #new-area{      
      overflow-y:auto;
      max-height:19vh;
      border-bottom:1px solid;      
    }
    #new-area-title{
      width:100%;
    }
    
    .instruction-mark{
      width:20px;
      border-right:1px solid;
      border-color: #aaa;
    }
    .op-color{
      background:rgb(255, 254, 208);
    }
    .tp-color{
      background:rgb(229, 255, 219);
    }
    .ep-color{
      background:rgb(255, 229, 239);
    }

    .selected{
      background: lightblue;
    }

    .clickable{
      cursor:pointer;
    }

    .plan-ele:hover{
      cursor: pointer;
      background: #ddd;
    }
    
  `;

  const ContextMenuUl = styled.ul`
  margin-bottom: 0px;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);    
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;    
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
    width:60px;
  }
  .context-menu li {
    clear: both;
    width: 60px;
    border-radius: 0.25rem;
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
    color:black;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({visible,x,y,parent,item, kind}) => {
  if (visible) {
      return (
          <ContextMenuUl>
              <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>              
                <li><div onClick={() => parent.contextMenuAction("delete",item, kind)}>削除</div></li>
              </ul>
          </ContextMenuUl>
      );
  } else { return null; }
};
  
  class BigPlanModalNew extends Component {
    constructor(props) {
      super(props);
      this.problem_plan_list = this.props.nurse_problem_item != undefined? this.props.nurse_problem_item.plan_data:undefined;
      this.problem_history_data = this.props.nurse_problem_item != undefined? this.props.nurse_problem_item.history_data:undefined;        
      var nurse_problem_item = this.props.nurse_problem_item;
      if (formatDateTimeIE(nurse_problem_item.evaluation_class_date) != '') nurse_problem_item.evaluation_class_date = new Date(nurse_problem_item.evaluation_class_date);
      if (formatDateTimeIE(nurse_problem_item.next_evaluate_date) != '') nurse_problem_item.next_evaluate_date = new Date(nurse_problem_item.next_evaluate_date);
      this.state = {
        departmentCode:1,   
        nurse_problem_item,
        number:0,
        tab_id:0,
        isOpenEvaluationDetailModal:false,
        isOpenProblemDetailModal:false,        
        confirm_message: "",
        search_kind: '全て', 
        plan_list_array:this.problem_plan_list,
        validate_alert_message:''
      }
      this.nurse_tab_data = [];
      this.tab_data = [];

      this.categoryOptions = [
        {id:0, value:''},
    ];
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
      this.change_flag = false;
    }  
    async componentDidMount(){
      // get only tab info
      await this.getSearchTabResult();      
      // get nurse problem's plan info
      // await this.getNurseProblemPlanInfo();
      // update problem's plan info
      await this.updateProblemPlanInfo();      
      
      if (this.hasScrollBar('past-area') || this.hasScrollBar('new-area')){        
        $('#head-area').width('calc(100% - 17px)');
        if (!this.hasScrollBar('past-area')) $('#past-area').width('calc(100% - 17px)');
        if (!this.hasScrollBar('new-area')) $('#new-area').width('calc(100% - 17px)'); else $('#new-area').width('100%');
        $('#new-area-title').width('calc(100% - 17px)');
      } else{        
        $('#head-area').width('100%');
        $('#past-area').width('100%');
        $('#new-area').width('100%');
        $('#new-area-title').width('100%');
      }
    }

    hasScrollBar = (id) => {
      var obj = document.getElementById(id);      
      if (obj == null) return false;      
      if (obj.scrollHeight > obj.offsetHeight) return true;
      return false;
    }

    componentDidUpdate = () => {      
      if (this.hasScrollBar('past-area') || this.hasScrollBar('new-area')){
        $('#head-area').width('calc(100% - 17px)');
        if (!this.hasScrollBar('past-area')) $('#past-area').width('calc(100% - 17px)');
        if (!this.hasScrollBar('new-area')) $('#new-area').width('calc(100% - 17px)'); else $('#new-area').width('100%');
      } else{
        $('#head-area').width('100%');
        $('#past-area').width('100%');
        $('#new-area').width('100%');
      }
    }
    

    existPlanOfProblem = (_item) => {
      if (this.problem_plan_list == undefined || this.problem_plan_list == null || this.problem_plan_list.length < 1) return false;      
      let exist = 0;      
      this.problem_plan_list.map(item=>{        
        if (item.nurse_plan_id == _item.number || JSON.stringify(item) == JSON.stringify(_item)) {
          exist = 1;
        }
      });      

      if (exist == 1) {
        return true;
      }

      return false;

    }

    updateProblemPlanInfo = async () => {
      // get select plans from normal nurse plan modal
      let sel_plans_from_normal_plan = this.props.planDataFromNormalPlanModal;
      
      let result = [];
      // make array to save db by plan info
      if(sel_plans_from_normal_plan != null && sel_plans_from_normal_plan != undefined && sel_plans_from_normal_plan.length > 0){
        sel_plans_from_normal_plan.map((item)=>{          
          if (!this.existPlanOfProblem(item)) {
            let plan_blank={
              number: null,
              nursing_problems_id:this.state.nurse_problem_item.number,
              plan_class_id: null,
              nurse_plan_id: null,
              evaluation_class_id: null,
              evaluation_class_date: null,
              name: "",
              plan_class_name: "",
              comment: item.comment,
              is_enabled: 1,
              created_by: null,
              created_at: null,
              updated_by: null,
              updated_at: null,
            };
            plan_blank.plan_class_id = item.plan_class_id;
            plan_blank.nurse_plan_id = item.number;
            plan_blank.name = item.name;
            plan_blank.plan_class_name = this.getClassName(item.plan_class_id);
            plan_blank.attribute_code = item.attribute_code;
            plan_blank.attribute_name = item.attribute_name;
            plan_blank.instruction_name = item.instruction_name;
            plan_blank.nurse_instruction_slip_id = item.nurse_instruction_slip_id;
            
            result.push(plan_blank);        
          }
        });
      }
      
      // combine Two array origin plan and selected plans
      if (this.problem_plan_list != undefined && this.problem_plan_list != null && this.problem_plan_list.length > 0) {
        result = this.problem_plan_list.concat(result);
      }      
      this.setState({
        plan_list_array: result
      });      
    }

    getClassName = (_class_id) => {
      let tab_data = this.tab_data;
      let nurse_tab_data = this.nurse_tab_data;

      if (tab_data == null || tab_data == undefined) tab_data = [];
      if (nurse_tab_data == null || nurse_tab_data == undefined) nurse_tab_data = [];

      let list_array = tab_data.concat(nurse_tab_data);
      if (list_array.length < 1) return "";
      
      let result = "";
      
      list_array.map(item=>{
        if (item.number == _class_id) {
          result = item.name;
        }
      });

      return result;
    }

    getSearchTabResult = async() => {
      let path = "/app/api/v2/master/nurse/get_plan_class_master";
      let post_data = {};      
      await apiClient.post(path, post_data)
      .then((res) => {        
        this.nurse_tab_data = res.nurse_plan_data;
        this.tab_data = res.tab_data;
      });
    }

    // contextMenuAction = (act, index, kind) => {
    contextMenuAction = (act, item) => {            
      let result = [];
      if (act == "delete") {
        let plan_list_array = this.state.plan_list_array;
        result = plan_list_array.filter(ele=>{
          if (item.nurse_plan_id != ele.nurse_plan_id) {
            return ele;
          }
        });
      }      

      this.setState({
        plan_list_array: result
      });
    };

    closeModal = () => {
      this.setState({        
        isOpenEvaluationDetailModal:false,
        isOpenProblemDetailModal:false,
        validate_alert_message:''
      })
    }    

    openEvaluationModal = () => {
      this.setState({
        isOpenEvaluationDetailModal:true,
      })
    }

    openProblemDetailModal = () => {
      this.setState({
        isOpenProblemDetailModal:true,
      })
    }

    editPlan = (_item, _type=null) => {
      this.setState({
        isOpenEvaluationDetailModal: true,
        nurse_plan_item: _item,
        item_type: _type
      });     
    }

    updateNurseProblem = async (nurse_problem_info) => {
      this.change_flag = true;
      var nurse_problem_item = this.state.nurse_problem_item;
      nurse_problem_item.evaluation_name = nurse_problem_info.evaluation_name;
      nurse_problem_item.evaluation_class_id = nurse_problem_info.evaluation_class_id;
      nurse_problem_item.evaluation_class_date = nurse_problem_info.evaluation_class_date;
      nurse_problem_item.comment = nurse_problem_info.comment;
      this.setState({
        nurse_problem_info,
        nurse_problem_item,
        isOpenProblemDetailModal: false
      });
    }

    // udpateNursePlan = async (nurse_plan_info, item_info) => {
    udpateNursePlan = () => {
      this.change_flag = true;
      this.setState({
        // nurse_plan_info,
        isOpenEvaluationDetailModal: false
      });      
    }

    getTabDataArray = (_item) => {
      let result = [];
      if (this.state.plan_list_array != undefined && this.state.plan_list_array != null && this.state.plan_list_array.length > 0) {
        this.state.plan_list_array.map(ele=>{
          if (ele.plan_class_name != undefined && ele.plan_class_name == _item.name) {            
            // let arr = result_tab[ele.plan_class_name];
            // if(arr == undefined) arr = [];
            result.push(ele);
            // result_tab[ele.plan_class_name] = arr;
          }
        });
      }

      return result;
    }

    handleOk = () => {
      if(this.change_flag != true) return;
      var nurse_problem_item = this.state.nurse_problem_item;
      let error_str_arr = [];
      if (nurse_problem_item.evaluation_class_date == undefined || nurse_problem_item.evaluation_class_date == null || nurse_problem_item.evaluation_class_date == ''){
        error_str_arr.push("看護問題の評価日を入力してください");
      }
      if (nurse_problem_item.next_evaluate_date == undefined || nurse_problem_item.next_evaluate_date == null || nurse_problem_item.next_evaluate_date == ''){
        error_str_arr.push("看護問題の次回評価日を入力してください");
      }
      if (!(nurse_problem_item.evaluation_class_id > 0)){
        error_str_arr.push("看護問題の評価を入力してください");
      }
      if (error_str_arr.length > 0){
        this.setState({ validate_alert_message: error_str_arr.join('\n') })
        return
      }      
      this.props.handleOk(nurse_problem_item.number, this.state.plan_list_array);
      this.change_flag = false;
    }

    confirmCancel = () => {
      this.setState({        
        confirm_message: ''
      });
    }

    getInstructionMark = (item) => {          
      if (item.instruction_name != null) return '*';
      return '';
    }
  
    render() {
      var {nurse_problem_item} = this.state;      
      // make show list
      let result_tab = {};
      let result_nurse_plan = {};

      // op, tp, ep array
      if (this.nurse_tab_data.length > 0) {
        this.nurse_tab_data.map(item=>{
          result_nurse_plan[item.name] = this.getTabDataArray(item);
        });
      }

      if (this.tab_data != undefined && this.tab_data != null && this.tab_data.length > 0) {
        this.tab_data.map(item=>{
          result_tab[item.name] = this.getTabDataArray(item);
        });
      }
      
      return (
        <>
          <Modal
            show={true}          
            id="outpatient"
            className="custom-modal-sm patient-exam-modal bed-control-modal first-view-modal"
          >
            <Modal.Header>
              <Modal.Title style={{width:'20rem'}}>看護計画</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup>
                <div className='problem-area'>
                  <div className='one-row'>
                    {/* <div style={{fontSize:'1.2rem'}}>#{nurse_problem_item.number}&nbsp;&nbsp;{nurse_problem_item.name}</div> */}
                    <div style={{fontSize:'1.2rem', maxWidth:'55%'}}>#{this.props.selected_problem_index + 1}&nbsp;&nbsp;{nurse_problem_item.name}</div>
                    <div className='register-info'>
                      <div style={{marginRight:'1rem'}}>登録者 : {nurse_problem_item.creater_name}</div>
                      <div>登録日 : {formatJapanDate(formatDateTimeIE(nurse_problem_item.created_at))}</div>
                      
                    </div>
                  </div>
                </div>
                <div className = 'flex' id = 'head-area'
                  style={{width:'100%', borderTop:'1px solid'}}
                  // style={{width:'calc(100% - 17px)'}}
                 >
                  <div className='left-area'>
                    <div className='title-area border-right'>患者目標</div>
                    <div className='title-th-area flex border-right'>
                      <div className='name-th text-center'>患者目標</div>
                      <div className='comment-th text-center'>コメント</div>
                      <div className='eval-th text-center'>評価</div>
                    </div>
                  </div>
                  <div className='right-area'>
                    <div className='title-area'>看護計画</div>
                    <div className='title-th-area flex'>
                      <div className='short-th-plan'></div>
                      <div className='name-th-plan text-center'>看護計画</div>
                      <div className='comment-th-plan text-center'>コメント</div>
                      <div className='eval-th-plan text-center'>評価</div>
                    </div>
                  </div>
                </div>

                {this.problem_history_data != undefined && this.problem_history_data.length > 0 && (
                  <>
                  <div className='past-area' id = 'past-area'>
                    {this.problem_history_data.map(history_item => {
                      return(
                        <>
                        <div className = 'flex'>
                          <div className='left-area' style={{borderBottom:'none'}}>
                            <div className = 'top-eval-area'>評価日 : {formatJapanDate(formatDateTimeIE(history_item.evaluation_class_date))}</div>
                            {history_item.plan_data.length > 0 && (
                              history_item.plan_data.map(plan_item => {
                                var check_plan_exist = history_item.plan_data.filter(x => x.plan_class_name == 'OP' || x.plan_class_name == 'TP' || x.plan_class_name == 'EP').length > 0;
                                if (plan_item.plan_class_name == '患者目標'){
                                  return(
                                    <>
                                      <div className='flex'>
                                        <div className='name-th'>{plan_item.name}</div>
                                        <div className='comment-th'>{plan_item.comment?plan_item.comment:""}</div>
                                        <div className='eval-th' style={{borderRight:check_plan_exist?'none':'1px solid #aaa'}}>{plan_item.evaluation_name}</div>
                                      </div>
                                    </>
                                  )
                                }
                              })
                            )}
                          </div>
                          <div className='right-area' style={{borderBottom:'none'}}>
                            <div className = 'top-eval-area flex'>
                              <div>評価 : {history_item.evaluation_name}</div>
                              <div className='next-date-area'>次回評価日 : {formatJapanDate(formatDateTimeIE(history_item.next_evaluate_date))}</div>
                            </div>
                            {history_item.plan_data.length > 0 && (
                              history_item.plan_data.map(plan_item => {
                                if (plan_item.plan_class_name == 'OP' || plan_item.plan_class_name == 'TP' || plan_item.plan_class_name == 'EP'){
                                  var cls_name = plan_item.plan_class_name;
                                  return(
                                    <>
                                      <div className='flex border-right'>
                                        <div className={`short-th-plan ${cls_name == "OP" ? "op-color": cls_name == "TP" ? "tp-color":"ep-color"}`} style={{padding:'0.3rem', borderLeft:'1px solid #aaa'}}>{plan_item.plan_class_name}</div>
                                        <div className='name-th-plan'>{plan_item.name}</div>
                                        <div className='comment-th-plan'>{plan_item.comment?plan_item.comment:""}</div>
                                        <div className='eval-th-plan'>{plan_item.evaluation_name}</div>
                                      </div>
                                    </>
                                  )
                                }
                              })
                            )}
                          </div>
                        </div>
                        </>
                      )
                    })}
                  </div>
                  </>
                )}

                <div className='new-area'>
                  <div className='flex' id = 'new-area-title'>
                    <div onClick={this.openProblemDetailModal.bind(this)} className = 'top-eval-area clickable' style={{borderLeft:'1px solid'}}>
                      評価日 : {formatJapanDate(formatDateTimeIE(nurse_problem_item.evaluation_class_date))}
                    </div>
                    <div className = 'top-eval-area flex clickable' onClick={this.openProblemDetailModal.bind(this)} style={{borderRight:'1px solid'}}>
                      <div>評価 : {nurse_problem_item.evaluation_name}</div>
                      <div className='next-date-area'>次回評価日 : {formatJapanDate(formatDateTimeIE(nurse_problem_item.next_evaluate_date))}</div>
                    </div>
                  </div>
                  <div className='flex' id = 'new-area'>
                    <div className='left-area' style={{borderBottom:'none'}}>
                    {result_tab != undefined && Object.keys(result_tab).length > 0 && (
                      Object.keys(result_tab).map((key)=> {
                        var check_plan_exist = false;
                        if (result_nurse_plan != undefined && result_nurse_plan != null && Object.keys(result_nurse_plan).length > 0){
                          if (result_nurse_plan[Object.keys(result_nurse_plan)[0]].length > 0) check_plan_exist = true;
                        }
                        if (key == '患者目標'){
                          var item = result_tab[key];
                          return(
                            <>                            
                            {item.length > 0 && (
                              item.map(sub_item => {
                                return(
                                  <>
                                  <div className='flex clickable' onClick={()=>this.editPlan(sub_item, 'nurse_plan')}>
                                    <div className='name-th'>{sub_item.name}</div>
                                    <div className='comment-th'>{sub_item.comment?sub_item.comment:""}</div>
                                    <div className='eval-th' style={{borderRight:check_plan_exist?'none':'1px solid #aaa'}}>{sub_item.evaluation_name}</div>
                                  </div>
                                  </>
                                )
                              })
                            )}
                            </>
                          )
                        }  
                      })
                    )}
                    </div>
                    <div className='right-area' style={{borderBottom:'none'}}>
                    {result_nurse_plan != undefined && result_nurse_plan != null && Object.keys(result_nurse_plan).length > 0 && (
                        <>
                        {Object.keys(result_nurse_plan).map(key=> {
                          var item = result_nurse_plan[key];                      
                          return(
                            <>
                              {item != undefined && item != null && item.length>0 && (
                                item.map(sub_item=> {
                                  return(
                                    <>
                                    <div className='flex clickable' style={{width:'100%'}} onClick={()=>this.editPlan(sub_item, "result_nurse_plan")}>
                                      <div className={`short-th-plan ${key == "OP" ? "op-color": key == "TP" ? "tp-color":"ep-color"}`} style={{padding:'0.3rem', borderLeft:'1px solid #aaa'}}>{key}</div>
                                      <div className='name-th-plan'>{sub_item.name}&nbsp;&nbsp;{this.getInstructionMark(sub_item)}</div>
                                      <div className='comment-th-plan'>{sub_item.comment}</div>
                                      <div className='eval-th-plan'>{sub_item.evaluation_name}</div>
                                    </div>
                                    </>
                                  )
                                })
                              )}
                            </>
                          )
                        })}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Popup>
            </Modal.Body>
            <Modal.Footer>
                <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
                <Button className={this.change_flag == true?"red-btn":'disable-btn'} onClick={this.handleOk}>確定</Button>
            </Modal.Footer>
            {this.state.isOpenEvaluationDetailModal && (
              <EvaluationDetailModal
                closeModal = {this.closeModal}
                nurse_plan_item = {this.state.nurse_plan_item}
                confirmPlanOk={this.udpateNursePlan}
                item_type={this.state.item_type}
                // item_info = {this.state.item_info}
              />
            )}
            {this.state.isOpenProblemDetailModal && (
              <ProblemDetailModal
                closeModal = {this.closeModal}
                nurse_problem_item = {this.state.nurse_problem_item}
                confirmOk={this.updateNurseProblem}
              />
            )}            
            {this.state.validate_alert_message != "" && (
              <ValidateAlertModal
                handleOk={this.closeModal}
                alert_meassage={this.state.validate_alert_message}
              />
            )}
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
            />            
          </Modal>
        </>
      );
    }
  }
  BigPlanModalNew.contextType = Context;
  
  BigPlanModalNew.propTypes = {  
    handleOk :  PropTypes.func,
    closeModal: PropTypes.func,
    patientId: PropTypes.number,     
    nurse_problem_item:PropTypes.object,
    tab_data : PropTypes.object,
    nurse_plan: PropTypes.object,
    planDataFromNormalPlanModal: PropTypes.array,
    patientInfo:PropTypes.object,
    selected_problem_index:PropTypes.number,
  };
  
  export default BigPlanModalNew;
  