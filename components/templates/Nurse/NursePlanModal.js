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
  // import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";  
  // import InputWithLabel from "~/components/molecules/InputWithLabel";
  // import Button from "~/components/atoms/Button";
  // import $ from "jquery";
  import Radiobox from "~/components/molecules/Radiobox";
  import OverlayTrigger from "react-bootstrap/OverlayTrigger";
  import Tooltip from "react-bootstrap/Tooltip";
  // import BigPlanModal from "~/components/templates/Nurse/BigPlanModal";
  // import DatePicker, { registerLocale } from "react-datepicker";
  // import ja from "date-fns/locale/ja";  
  // registerLocale("ja", ja);

  // import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
  // import { 
  //   faPlus, 
  //   faMinus 
  // } from "@fortawesome/pro-solid-svg-icons";

  // const Icon = styled(FontAwesomeIcon)`
  //   color: black;
  //   font-size: 15px;
  //   margin-right: 5px;
  // `;

  const renderTooltip = (props) => <Tooltip {...props}>{props}</Tooltip>;
  
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
    
    .panel-menu {
      width: 100%;
      margin-bottom: 1rem;
      font-weight: bold;
      .menu-btn {
          width:100px;
          text-align: center;
          border-bottom: 1px solid black;
          background-color: rgba(200, 194, 194, 0.22);
          padding: 5px 0;
          cursor: pointer;
      }
      .active-menu {
          width:100px;
          text-align: center;
          border-top: 1px solid black;
          border-right: 1px solid black;
          border-left: 1px solid black;
          padding: 5px 0;
      }
      .no-menu {
          width: calc(100% - 500px);
          border-bottom: 1px solid black;
          background-color: rgba(200, 194, 194, 0.22);
      }
    }
    .left-th{
      width:15%;
      border-right:1px solid;
      border-bottom: 1px solid;
      padding:5px;
    }
    .right-td{
      width:85%;
    }
    .list-area{
      margin-top:10px;
      border:1px solid;
      max-height:32rem;
      overflow-y:auto;
    }
    .bottom-border{
      border-bottom: 1px solid;
      padding:5px;
    }
    .radio-area{
      label{
        margin-right:10px;
        font-size:1.2rem;
      }
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
    .sel-item{
      background: #bbb;
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
  `;

  const ContextMenuUl = styled.ul`
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
    width:11.25rem;
  }
  .context-menu li {
    clear: both;
    width: 11.25rem;
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

const ContextMenu = ({visible,x,y,parent,index, kind}) => {
  if (visible) {
      return (
          <ContextMenuUl>
              <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>              
                <li><div onClick={() =>parent.contextMenuAction("add", index, kind)}>項目追加</div></li>
                <li><div onClick={() =>parent.contextMenuAction("edit", index, kind)}>項目変更</div></li>
                <li><div onClick={() => parent.contextMenuAction("delete",index, kind)}>項目削除</div></li>
                <li><div onClick={() => parent.contextMenuAction("sort",index, kind)}>並び替え</div></li>
              </ul>
          </ContextMenuUl>
      );
  } else { return null; }
};
  
  class NursePlanModal extends Component {
    constructor(props) {
      super(props);    
      this.state = {        
        departmentCode:1,        
        number:0,
        tab_id:0,        
        search_kind: '全て',
        tooltip_msg: "",
        // isOpenBigPlanModal:false,        
        selected_plan_list:this.props.nurse_problem_item.plan_data!=undefined?this.props.nurse_problem_item.plan_data:[],        
      }
      this.origin_selected_plan_list = this.props.selected_origin_item.plan_data!=undefined?this.props.selected_origin_item.plan_data:[],
      this.categoryOptions = [
        {id:0, value:''},        
      ];
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
      
    }  
    async componentDidMount(){      
      await this.getSearchResult();      
      await this.getNurseProblemPlanInfo();
    }

    getSearchResult = async() => {
      let path = "/app/api/v2/master/nurse/plan_class_search";

      let post_data = {diagnosis_master_id: this.props.nurse_problem_item.diagnosis_id};
      await apiClient.post(path, post_data)
      .then((res) => {
        this.setState({
          nurse_plan:res.nurse_plan,
          tab_data:res.tab_data,
        })
      });
    }

    getNurseProblemPlanInfo = async () => {
      let path = "/app/api/v2/master/nurse/get_problem_plan_info";
      let post_data = {
        problem_number: this.props.nurse_problem_item.number
      };      
      await apiClient.post(path, {
        params: post_data
      })
      .then((res) => {      
        if (res.alert_message == "success") {        
          this.setState({
            problem_plan_list: res.result
          })
        }
      });
    }

    setTab = (e, val ) => {
      this.setState({
          tab_id:parseInt(val),          
      });
    };

    selectSearchKind = (e) => {
      this.setState({
        search_kind:e.target.value,
      });
    }

    openBigPlanModal = () => {
      if (this.state.selected_plan_list.length < 1 ) return;
      this.props.openBigPlanModal(this.props.nurse_problem_item, this.state.selected_plan_list);
    }

    selectPlan = (_item) => {      
      if (this.includeInOriginItems(_item)) return;
      let sel_plan_arr = this.state.selected_plan_list;

      if (sel_plan_arr.length < 1) {
        sel_plan_arr.push(_item);
      } else {
        let existItem = 0;
        sel_plan_arr = sel_plan_arr.filter(item=>{
          if (item.nurse_plan_id == _item.number) {
            existItem = 1;
          } else {
            return item;
          }
        })        
        if (existItem == 0) sel_plan_arr.push(_item);
      }
      this.setState({
        selected_plan_list: sel_plan_arr
      });
    }

    includeInOriginItems = (_item = null) => {
      if (_item == null) return;

      let result = false;

      let origin_selected_plan_list = this.origin_selected_plan_list;      
      let exist = 0;
      if (origin_selected_plan_list.length > 0) {        
        origin_selected_plan_list.map(item=>{          
          if (item.nurse_plan_id == _item.number) {
            exist = 1;
          }
        });        
      }      
      if (exist == 1) {
        result = true;
      }
      return result;
    }

    includeInSelectedItems = (_item=null) => {
      if (_item == null) return;

      let result = false;

      let sel_plan_arr = this.state.selected_plan_list;      
      let exist = 0;
      if (sel_plan_arr.length > 0) {        
        sel_plan_arr.map(item=>{
          // if (item.number == _item.number) {
          if (item.nurse_plan_id == _item.number) {
            exist = 1;
          }
        });        
      }      
      if (exist == 1) {
        result = true;
      }
      return result;
    }

    getToolTip = () => {      
      if (this.state.selected_plan_list.length < 1){        
        this.setState({tooltip_msg : "看護計画を選択してください。"});        
      } else {
        this.setState({tooltip_msg : ""});        
      }
    }
  
    render() {      
      var {tab_data, nurse_plan} = this.state;
      let tooltip_msg = "看護計画を選択してください。";
      return (
        <>
          <Modal
            show={true}          
            id="outpatient"
            className="custom-modal-sm notice-modal first-view-modal"
          >
            <Modal.Header>
                <Modal.Title style={{width:'20rem'}}>標準看護計画</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup>                
                <div className="panel-menu flex">
                  {nurse_plan != undefined && nurse_plan != null && Object.keys(nurse_plan).length > 0 && this.state.tab_id === 0 && (
                      <><div className="active-menu">看護計画</div></>
                  )}
                  {nurse_plan != undefined && nurse_plan != null && Object.keys(nurse_plan).length > 0 && this.state.tab_id != 0 && (
                      <><div className="menu-btn" onClick={e => {this.setTab(e, 0);}}>看護計画</div></>
                  )}  
                    
                  {tab_data != undefined && tab_data != null && Object.keys(tab_data).length > 0 && (
                    Object.keys(tab_data).map((key, index)=> {
                      if (this.state.tab_id == index + 1){
                        return(
                          <><div className="active-menu">{key}</div></>  
                        )
                      } else {
                        return(
                          <><div className="menu-btn" onClick={e => {this.setTab(e, index+1);}}>{key}</div></>
                        )
                      }
                    })
                  )}
                  <div className="no-menu"/>
                </div>
                <div className="contents-area">
                  {nurse_plan != undefined && nurse_plan != null && Object.keys(nurse_plan).length > 0 && this.state.tab_id === 0 && (
                    <>
                      <div className='radio-area'>
                        <Radiobox
                          label = '全て'
                          value = {'全て'}
                          name = 'search_kind'
                          checked = {this.state.search_kind=='全て'}
                          getUsage = {this.selectSearchKind.bind(this)}
                        />
                        {Object.keys(nurse_plan).map(key=>{
                          return(
                            <>
                            <Radiobox
                              label = {key}
                              value = {key}
                              name = 'search_kind'
                              getUsage = {this.selectSearchKind.bind(this)}
                              checked = {this.state.search_kind == key}
                            />
                            </>
                          )
                        })}
                      </div>
                      <div className='list-area'>
                        {Object.keys(nurse_plan).map(key=> {
                          var item = nurse_plan[key];
                          if (key == this.state.search_kind || this.state.search_kind == "全て") {                            
                            return(
                              <>
                                <div className='flex'>
                                  <div className={`left-th bottom-border ${key == "OP" ? "op-color": key == "TP" ? "tp-color":"ep-color"}`}>{key}</div>
                                  <div className='right-td'>
                                  {item != undefined && item != null && item.length>0 && (
                                    item.map(sub_item=> {
                                      return(
                                        <><div onClick={()=>this.selectPlan(sub_item)} className={`bottom-border plan-ele ${this.includeInSelectedItems(sub_item) ? "sel-item" : ""}`}>{sub_item.name}</div></>
                                      )
                                    })
                                  )}
                                  </div>
                                </div>
                              </>
                            )
                          }
                        })}
                      </div>
                    </>
                  )}
                  {tab_data != undefined && tab_data != null && Object.keys(tab_data).length > 0 && (
                    Object.keys(tab_data).map((key, index)=> {
                      if (this.state.tab_id == index + 1){
                        var list_data = tab_data[key];                        
                        return(
                          <>
                          <div className='list-area'>
                          {list_data != undefined && list_data != null && list_data.length > 0 && (
                            list_data.map(item => {                              
                              return(
                                <><div onClick={()=>this.selectPlan(item)} className={`bottom-border plan-ele ${this.includeInSelectedItems(item) ? "sel-item" : ""}`}>{item.name}</div></>
                              )
                            })
                          )}
                          </div>
                          </>
                        )
                      }
                    })
                  )}                    
                </div>

              </Popup>
            </Modal.Body>
            <Modal.Footer>
                <div                 
                  onClick={this.props.closeModal}
                  className={"custom-modal-btn cancel-btn focus "}
                  style={{cursor:"pointer"}}
                >
                  <span>閉じる</span>
                </div>
                {this.state.selected_plan_list.length < 1 ? (
                  <OverlayTrigger
                    placement={"top"}
                    overlay={renderTooltip(tooltip_msg)}
                  >
                    <div     
                      id="system_confirm_Ok"            
                      className={this.state.selected_plan_list.length > 0 ? "custom-modal-btn red-btn focus " : "custom-modal-btn disable-btn"}
                      onClick={this.openBigPlanModal}                    
                      onMouseOver={this.getToolTip.bind(this)}
                      style={{cursor:"pointer"}}
                    >
                      <span>確定</span>
                    </div>
                  </OverlayTrigger>
                ):(                  
                    <div     
                      id="system_confirm_Ok"            
                      className={this.state.selected_plan_list.length > 0 ? "custom-modal-btn red-btn focus " : "custom-modal-btn disable-btn"}
                      onClick={this.openBigPlanModal}                    
                      style={{cursor:"pointer"}}
                    >
                      <span>確定</span>
                    </div>                  
                )}
                
                {/*<Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
                <Button className="red-btn" onClick={this.openBigPlanModal.bind(this)}>確定</Button>*/}
            </Modal.Footer>
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
            />            
          </Modal>          
        </>
      );
    }
  }
  NursePlanModal.contextType = Context;
  
  NursePlanModal.propTypes = {      
    closeModal: PropTypes.func,
    openBigPlanModal: PropTypes.func,
    patientId: PropTypes.number,     
    nurse_problem_item:PropTypes.object,
    selected_origin_item: PropTypes.object,
    patientInfo: PropTypes.object,    
  };
  
  export default NursePlanModal;
  