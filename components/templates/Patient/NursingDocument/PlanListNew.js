import React, { 
    Component, 
    // useContext
   } from "react";
  import PropTypes from "prop-types";
  import styled from "styled-components";
  // import * as colors from "~/components/_nano/colors";  
  import Context from "~/helpers/configureStore";
  import * as apiClient from "~/api/apiClient";      
  import {formatJapanDate, formatDateTimeIE} from "~/helpers/date";  
  import $ from "jquery";
  
  const Popup = styled.div`
    padding:5px;
    padding-bottom:20px;
    // border-bottom: 1px solid gray;
    font-size:${props=>(props.font_props != undefined ? (props.font_props + 'rem'):'1rem')};    
    .problem-area{
      margin-bottom:0.8rem;
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
      border-top:none;
      border-right:none;
      .border-right{
        border-right:1px solid!important;
      }
    }
    .right-area{
      width:50%;
      border:1px solid;
      border-left:none;
      border-top:none;
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
      font-size:${props=>(props.font_props != undefined ? (1.2 * props.font_props + 'rem'):'1.2rem')};
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
      width:7%;
      border-right:1px solid #aaa;
      border-bottom:1px solid #aaa;
    }
    .name-th-plan{
      padding:0.3rem;
      width:46%;
      border-right:1px solid #aaa;
      border-bottom:1px solid #aaa;
    }
    .comment-th-plan{
      padding:0.3rem;
      width:37%;
      border-right:1px solid #aaa;
      border-bottom:1px solid #aaa;
    }
    .eval-th-plan{
      padding:0.3rem;
      width:10%;
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
      position:relative;
      overflow-y:auto;
      // max-height: calc(100% - 5.5rem);
      border-bottom:1px solid;
      div{
        word-wrap:break-word;
      }
    }
    .new-area{
      overflow-y:scroll;
      max-height: 30%;
      border-top:1px solid;
      margin-top:10px;
      .top-eval-area{
        background : rgb(255, 230, 180);
      }
      div{
        word-wrap:break-word;
      }
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

    .plan-ele:hover{
      cursor: pointer;
      background: #ddd;
    }
    
  `;
  
  class PlanListNew extends Component {
    constructor(props) {
      super(props);
      this.problem_plan_list = this.props.nurse_problem_item != undefined? this.props.nurse_problem_item.plan_data:undefined;
      this.problem_history_data = this.props.nurse_problem_item != undefined? this.props.nurse_problem_item.history_data:undefined;
      this.state = {
        departmentCode:1,   
        nurse_problem_item: this.props.nurse_problem_item,     
        number:0,
        tab_id:0,
        confirm_message: "",
        search_kind: '全て', 
        plan_list_array:this.problem_plan_list
      }
      this.nurse_tab_data = [];
      this.tab_data = [];
      
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;      
    }
    async componentDidMount(){
      // get only tab info
      await this.getSearchTabResult();      
      // get nurse problem's plan info      
      // update problem's plan info
      await this.updateProblemPlanInfo();
      var index = this.props.problem_index;
      if (this.hasScrollBar('past-area_' + index)){
        $('#head-area_' + index).width('calc(100% - 17px)');        
      } else{
        $('#head-area_' + index).width('100%');
      }
    }

    hasScrollBar = (id) => {
      var obj = document.getElementById(id);
      if (obj == null) return false;      
      if (obj.scrollHeight > obj.offsetHeight) return true;
      return false;
    }

    componentDidUpdate = () => {
      var index = this.props.problem_index;
      if (this.hasScrollBar('past-area_' + index)){
        $('#head-area_' + index).width('calc(100% - 17px)');        
      } else{
        $('#head-area_' + index).width('100%');
      }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
      this.problem_plan_list = nextProps.nurse_problem_item != undefined? nextProps.nurse_problem_item.plan_data:undefined;
      this.problem_history_data = nextProps.nurse_problem_item != undefined? nextProps.nurse_problem_item.history_data:undefined;
      this.setState({
        nurse_problem_item: nextProps.nurse_problem_item,
        plan_list_array:this.problem_plan_list
      })
    }

    updateProblemPlanInfo = async () => {
      let result = [];
      
      // combine Two array origin plan and selected plans
      if (this.problem_plan_list != undefined && this.problem_plan_list != null && this.problem_plan_list.length > 0) {
        result = this.problem_plan_list.concat(result);
      }      
      this.setState({
        plan_list_array: result
      });
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

    getTabDataArray = (_item) => {
      let result = [];
      if (this.state.plan_list_array != undefined && this.state.plan_list_array != null && this.state.plan_list_array.length > 0) {
        this.state.plan_list_array.map(ele=>{
          if (ele.plan_class_name != undefined && ele.plan_class_name == _item.name) {
            result.push(ele);            
          }
        });
      }
      return result;
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

      var index = this.props.problem_index;
      return (
        <>
          <Popup font_props = {this.props.font_props}>
            <div className='problem-area'>
              <div className='one-row'>
                <div style={{fontSize: this.props.font_props != undefined ? 1.2 * this.props.font_props + 'rem' : '1.2rem', maxWidth:'55%'}}>
                  {/* #{nurse_problem_item.number} */}
                  #{this.props.problem_index + 1}
                  &nbsp;&nbsp;{nurse_problem_item.name}
                </div>
                <div className='register-info'>
                  <div style={{marginRight:'1rem'}}>登録者 : {nurse_problem_item.creater_name}</div>
                  <div>登録日 : {formatJapanDate(formatDateTimeIE(nurse_problem_item.created_at))}</div>
                  
                </div>
              </div>
            </div>
            <div className = 'flex' id = {'head-area_' + index}
            // style={{width:'calc(100% - 17px)'}}
            style={{width:'100%', borderTop:'1px solid'}}
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
              <div className='past-area' id = {'past-area_' + index} style={{maxHeight:this.props.font_props == undefined ?'calc(84vh - 21rem)':'calc(100vh - 22rem)'}}>
              {this.problem_history_data.map(history_item => {
                return(
                  <>
                  <div className = 'flex'>
                    <div className='left-area' style={{borderBottom:'none'}}>
                      <div className = 'top-eval-area'>評価日 : {formatJapanDate(formatDateTimeIE(history_item.evaluation_class_date))}</div>
                      {history_item.plan_data.length > 0 && (
                        history_item.plan_data.map(plan_item => {
                          if (plan_item.plan_class_name == '患者目標'){
                            return(
                              <>
                                <div className='flex border-right'>
                                  <div className='name-th'>{plan_item.name}</div>
                                  <div className='comment-th'>{plan_item.comment?plan_item.comment:""}</div>
                                  <div className='eval-th'>{plan_item.evaluation_name}</div>
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
                                  <div className={`short-th-plan ${cls_name == "OP" ? "op-color": cls_name == "TP" ? "tp-color":"ep-color"}`} style={{paddingTop:'0.3rem',paddingLeft:'1px', borderLeft:'1px solid #aaa'}}>{plan_item.plan_class_name}</div>
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
            )}
          </Popup>
        </>
      );
    }
  }
  PlanListNew.contextType = Context;
  
  PlanListNew.propTypes = {    
    nurse_problem_item:PropTypes.object,
    font_props: PropTypes.number,
    problem_index:PropTypes.number
  };
  
  export default PlanListNew;
  