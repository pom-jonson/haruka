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
  import Radiobox from "~/components/molecules/Radiobox";
  import EvaluationDetailModal from "~/components/templates/Nurse/EvaluationDetailModal";
  import ProblemDetailModal from "~/components/templates/Nurse/ProblemDetailModal";
  // import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";  
  // import InputWithLabel from "~/components/molecules/InputWithLabel";
  import Button from "~/components/atoms/Button";
  import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
  import {formatJapanDate, formatDateTimeIE} from "~/helpers/date";
  // import $ from "jquery";
  
  const Popup = styled.div`
    display:flex;
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
    .left-area{
      width:48%;
      margin-right:2%;
    }
    .right-area{
      width:49%;
      margin-top:-12px;
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
    }
      
    .label-title {
      padding-left:4px;
      padding-top:4px;
      // text-align: left;
      width: 6rem;
      font-size: 1rem;
      margin-top: 0;  
      vertical-align:middle;  
      text-align: right;
      padding-right: 10px;        
    }
    .label-content{
      text-align:left;
      border-right:1px solid;
      border-top:1px solid;
      border-left:1px solid;
      border-color: #aaa;
      padding:4px;
      height: 2rem;
      padding-top:0.2rem;
    }
    
    .label-big-content{
      border-right:1px solid;
      border-top:1px solid;
      border-left:1px solid;
      border-color: #aaa;
      padding:4px;
      height: 45px;
      width:calc(100% - 6rem);
    }
    .bottom-border{
      border-bottom:1px solid;
      border-color: #aaa;
    }
    .blog{
      margin-top:10px;
      margin-bottom:10px;      
    }
    .sub-title{
      border-right:1px solid;
      border-top:1px solid;
      border-left:1px solid;
      border-color: #aaa;
      padding-left: 5px;
      width : 200px;
      font-size:1.2rem;      
      background-color: rgb(160, 235, 255);
    }
    .left-td-title{
      width:calc(50% - 9px);
      border-left:1px solid;
      border-top:1px solid;
      border-color: #aaa;
      padding-left: 5px;
      background-color: rgb(160, 235, 255);
    }
    .right-td-title{
      width:calc(50% + 9px);
      border-left:1px solid;
      border-top:1px solid;
      border-right:1px solid;
      border-color: #aaa;
      padding-left: 5px;
      background-color: rgb(160, 235, 255);
    }
    .title-left-th{
      width: 400px !important;
      background-color: rgb(160, 235, 255);
    }
    .left-th{
      width:100px;
      border-right:1px solid;     
      border-color: #aaa; 
      padding-left: 5px;
    }
    .right-th{
      border-right:1px solid;
      border-color: #aaa;
      width:300px;
    }
    .instruction-mark{
      width:20px;
      border-right:1px solid;
      border-color: #aaa;
    }
    .sub-content{
      border-right:1px solid;
      border-top:1px solid;
      border-left:1px solid;
      border-bottom:1px solid;
      border-color: #aaa;
      width:100%;
      height:8rem;
      overflow-y:scroll;
      .left-td{
        width:50%;
        border-right:1px solid;
        border-bottom:1px solid;
        border-color: #aaa;
        padding-left: 5px;
      }
      .right-td{
        width:50%;
        border-bottom:1px solid;
        border-color: #aaa;
        padding-left: 5px;
      }
      .left-th{
        width:100px;
        border-right:1px solid;
        border-bottom: 1px solid;     
        border-color: #aaa;   
      }
      .right-th{
        border-right:1px solid;
        border-color: #aaa;
        width:300px;
      }
      .instruction-mark{
        width:20px;
        border-right:1px solid;
        border-color: #aaa;
      }
      .evaluation-date{        
        width:calc(100% - 420px);
      }
      .evaluation-date-td{        
        width:calc(100% - 320px);
      }
      .sub-item {
        width:300px;
        border-right:1px solid;
        border-color: #aaa;
        padding-left: 5px;
      }
    }
    .sub-big-content{
      height:250px;      
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
    .list-area{
      margin-top:10px;
      border:1px solid;
      border-color: #aaa;
      max-height:37rem;
    }    
    .radio-area{
      label{
        margin-right:10px;
        font-size:1.2rem;
      }
    }
    .last-th-row{
      border:1px solid;
      border-bottom:none;
      border-color: #aaa;
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
  
  class BigPlanModal extends Component {
    constructor(props) {
      super(props);
      this.problem_plan_list = this.props.nurse_problem_item != undefined? this.props.nurse_problem_item.plan_data:undefined;
      this.state = {
        departmentCode:1,   
        nurse_problem_item: this.props.nurse_problem_item,     
        number:0,
        tab_id:0,
        isOpenEvaluationDetailModal:false,
        isOpenProblemDetailModal:false,
        isAddConfirmModal:false,
        confirm_message: "",
        search_kind: '全て', 
        plan_list_array:this.problem_plan_list,
      }
      this.nurse_tab_data = [];
      this.tab_data = [];

      this.categoryOptions = [
        {id:0, value:''},
    ];
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }  
    async componentDidMount(){
      // get only tab info
      await this.getSearchTabResult();      
      // get nurse problem's plan info
      // await this.getNurseProblemPlanInfo();
      // update problem's plan info
      await this.updateProblemPlanInfo();

      // if (this.props.patientInfo.hospitalization_id > 0){
      //   this.getNurseInstructionInfo(this.props.patientInfo.hospitalization_id);
      // }
    }

    // getNurseInstructionInfo = async(hospitalization_id) => {
    //   let path = "/app/api/v2/nurse/getNurseInstructions";
    //   let post_data = {
    //     hospitalization_id:hospitalization_id,
    //   }
    //   await apiClient._post(path, {params:post_data})
    //   .then(res => {        
    //   })
    // }

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

    handleClick = (e, item, kind) => {
      if (e.type === "contextmenu"){
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
      this.setState({
          contextMenu: {
              visible: true,              
              x: e.clientX - 80,
              y: e.clientY,
              item: item,
              kind:kind,
          },
      });
      }
    };

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
      })
    }

    getCategory (e){
      this.setState({select_category_code:e.target.id})
    }

    selectSearchKind = (e) => {
      this.setState({
        search_kind:e.target.value,
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
      var nurse_problem_item = this.state.nurse_problem_item;
      nurse_problem_item.evaluation_name = nurse_problem_info.evaluation_name;
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
      var nurse_problem_item = this.state.nurse_problem_item;      
      this.props.handleOk(nurse_problem_item.number, this.state.plan_list_array);
    }

    saveData = async () => {
      // save problem      
      let path = "/app/api/v2/master/nurse/save_problem";
      var nurse_problem_item = this.state.nurse_problem_item;
      nurse_problem_item.system_patient_id = this.props.patientId;
      await apiClient
        ._post(path, {
          params: this.state.nurse_problem_item
        })
        .then((res) => {
          // suucess
          if (res.alert_message == "success") {            
            // console.log(res);
          }
        })
        .catch((err) => {
          if (err.response.data) {
            // const { error_messages } = err.response.data;
            // error_msg = error_messages;
          }          
        });

      // save plan
      if (this.state.plan_list_array.length < 1) {        
        this.props.closeModal('refresh');
      }

      let save_plan_datas = this.state.plan_list_array;
      let post_data = {
        plans: save_plan_datas
      };

      path = "/app/api/v2/master/nurse/save_plan";            
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then((res) => {
          // suucess
          if (res.alert_message == "success") {            
            // count ++;
            window.sessionStorage.setItem("alert_messages", "登録しました。");
          }
        })
        .catch((err) => {
          if (err.response.data) {
            // const { error_messages } = err.response.data;
            // error_msg = error_messages;
          }          
        });
      this.props.closeModal();              
    }

    confirmCancel = () => {
      this.setState({
        isAddConfirmModal: false,
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
                <div className='left-area'>
                  {/*<div className = 'button-area'>
                    <button style={{marginRight:'20px'}}>ガイダンス</button>
                    <button>評価記録</button>
                  </div>*/}
                  <div className='problem-area'>
                    <div className='one-row'>
                      <label className='label-title'>問題番号</label>
                      <label className='label-content bottom-border' style={{width:'3rem'}}>{nurse_problem_item.number}</label>
                      <label className='label-title'>登録日</label>
                      <label className='label-content' style={{width:'12rem'}}>{formatJapanDate(formatDateTimeIE(nurse_problem_item.created_at))}</label>
                      <label className='label-title'>登録者</label>
                      <label className='label-content' style={{width:'10rem'}}>{nurse_problem_item.creater_name}</label>
                    </div>
                    <div className='one-row' style={{marginBottom:"10px"}}>
                      <label className='label-title'></label>
                      <label className='' style={{width:'3rem'}}></label>
                      <label className='label-title'>評価日</label>
                      <label onClick={this.openProblemDetailModal.bind(this)} className='clickable label-content bottom-border' style={{width:'12rem'}}>{formatJapanDate(formatDateTimeIE(nurse_problem_item.evaluation_class_date))}</label>
                      <label className='label-title'>評価</label>
                      <label onClick={this.openProblemDetailModal.bind(this)} className='label-content bottom-border clickable' style={{width:'10rem'}}>{nurse_problem_item.evaluation_name}</label>
                    </div>
                    <div className='one-row'>
                      <label className='label-title'>看護問題</label>
                      <label className='label-big-content clickable' onClick={this.openProblemDetailModal.bind(this)}>{nurse_problem_item.name}</label>
                    </div>
                    {/* <div className='one-row'>
                      <label className='label-title'>Nursing Problems</label>
                      <label style={{height:"auto"}} className='label-big-content clickable' onClick={this.openProblemDetailModal.bind(this)}>{nurse_problem_item.english_name}</label>
                    </div> */}
                    <div className='one-row'>
                      <label className='label-title'>定義</label>
                      <label className='label-big-content bottom-border clickable' onClick={this.openProblemDetailModal.bind(this)}>{nurse_problem_item.definition}</label>
                    </div>
                  </div>
                  <div className='blog'>
                    <div className='sub-title'>コメント</div>
                    <div className='sub-content bottom-border'>
                      {nurse_problem_item.comment}              
                    </div>
                  </div>

                  {result_tab != undefined && Object.keys(result_tab).length > 0 && (
                    Object.keys(result_tab).map((key, index)=> {
                      if (index < 2){
                        var item = result_tab[key];
                        return(
                          <>
                            <div className='blog'>
                              <div className='sub-title'>{key}</div>                              
                                <div className='flex'>
                                  <div className='left-td-title'>{key}</div>
                                  <div className='right-td-title'>コメント</div>
                                </div>
                                <div className='sub-content'>
                                {item.length > 0 && (
                                  item.map(sub_item => {
                                    return(
                                      <>
                                      <div className='flex'>
                                        <div 
                                          onClick={()=>this.editPlan(sub_item, 'nurse_plan')} 
                                          className='left-td plan-ele'
                                          onContextMenu={e => this.handleClick(e, sub_item, "problem")}
                                        >
                                          {sub_item.name}
                                        </div>
                                        <div className='right-td'>{sub_item.comment?sub_item.comment:""}</div>
                                      </div>
                                      </>
                                    )
                                  })
                                )}
                              </div>
                            </div>
                          </>
                        )
                      }  
                    })
                  )}
                </div>
                  
                <div className='right-area'>
                {result_tab != undefined && Object.keys(result_tab).length > 0 && (
                    Object.keys(result_tab).map((key, index)=> {
                      if (index >= 2){
                        var item = result_tab[key];
                        return(
                          <>
                            <div className='blog'>
                              <div className='sub-title'>{key}</div>
                              <div className='flex'>
                                <div className='left-td-title'>{key}</div>
                                <div className='right-td-title'>コメント</div>
                              </div>
                              <div className='sub-content'>                                
                                {item.length > 0 && (
                                  item.map(sub_item => {
                                    return(
                                      <>
                                      <div className='flex'>
                                        <div 
                                          onClick={()=>this.editPlan(sub_item, "nurse_plan")} 
                                          className='left-td plan-ele'
                                          onContextMenu={e => this.handleClick(e, sub_item, "problem")}
                                        >
                                            {sub_item.name}
                                          </div>
                                        <div className='right-td'>{sub_item.comment?sub_item.comment:""}</div>
                                      </div>
                                      </>
                                    )
                                  })
                                )}
                              </div>
                            </div>
                          </>
                        )
                      }  
                    })
                  )}

                  {result_nurse_plan != undefined && result_nurse_plan != null && Object.keys(result_nurse_plan).length > 0 && (
                    <>
                      <div className='radio-area'>
                        <label style={{marginRight:'15px'}}>表示切替</label>
                        <Radiobox
                          label = '全て表示'
                          value = {'全て'}
                          name = 'search_kind'
                          checked = {this.state.search_kind=='全て'}
                          getUsage = {this.selectSearchKind.bind(this)}
                        />
                        {Object.keys(result_nurse_plan).map(key=>{
                          return(
                            <>
                            <Radiobox
                              label = {key+ 'のみ'}
                              value = {key}
                              name = 'search_kind'
                              getUsage = {this.selectSearchKind.bind(this)}
                              checked = {this.state.search_kind == key}
                            />
                            </>
                          )
                        })}
                      </div>
                      <div className='blog'>
                        <div className='sub-title'>看護計画</div>
                        <div className='flex last-th-row' style={{backgroundColor: 'rgb(160, 235, 255)'}}>
                          <div className='left-th title-left-th'>看護計画</div>
                          <div className='instruction-mark' style={{backgroundColor: 'rgb(160, 235, 255)'}}></div>
                          <div className='evaluation-date'>コメント</div>
                        </div>
                        <div className='sub-content sub-big-content'>                          
                        {Object.keys(result_nurse_plan).map(key=> {
                          var item = result_nurse_plan[key];
                          if (key == this.state.search_kind || this.state.search_kind == "全て") {                            
                            return(
                              <>
                                {item != undefined && item != null && item.length>0 && (
                                  <>
                                    <div className='flex'>
                                      <div className={`left-th bottom-border ${key == "OP" ? "op-color": key == "TP" ? "tp-color":"ep-color"}`}>{key}</div>
                                      <div style={{width:'calc(100% - 100px'}}>
                                      {item != undefined && item != null && item.length>0 && (
                                        item.map(sub_item=> {
                                          return(
                                            <>
                                            <div className='flex' style={{width:'100%'}}>
                                              <div 
                                                onClick={()=>this.editPlan(sub_item, "result_nurse_plan")} 
                                                className='bottom-border sub-item plan-ele'
                                                onContextMenu={e => this.handleClick(e, sub_item, "plan")}
                                              >
                                                {sub_item.name}
                                              </div>
                                              <div className='instruction-mark bottom-border text-center'>{this.getInstructionMark(sub_item)}</div>
                                              <div className='evaluation-date-td bottom-border'>{sub_item.comment}</div>
                                            </div>
                                            </>
                                          )
                                        })
                                      )}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </>
                            )
                          }
                        })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Popup>
            </Modal.Body>
            <Modal.Footer>
                <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
                <Button className="red-btn" onClick={this.handleOk}>確定</Button>
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
            {this.state.isAddConfirmModal !== false && (
              <SystemConfirmJapanModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.saveData.bind(this)}
                  confirmTitle= {this.state.confirm_message}
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
  BigPlanModal.contextType = Context;
  
  BigPlanModal.propTypes = {  
    handleOk :  PropTypes.func,
    closeModal: PropTypes.func,
    patientId: PropTypes.number,     
    nurse_problem_item:PropTypes.object,
    tab_data : PropTypes.object,
    nurse_plan: PropTypes.object,
    planDataFromNormalPlanModal: PropTypes.array,
    patientInfo:PropTypes.object,
  };
  
  export default BigPlanModal;
  