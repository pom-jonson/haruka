import React from 'react'
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
//  import auth from "~/api/auth";
import DiagnosisModal from "./Modal/DiagnosisModal";
import PlanObservationMasterModal from "./Modal/PlanObservationMasterModal";
import PropTypes from "prop-types";
import Button from "~/components/atoms/Button";
import Checkbox from "~/components/molecules/Checkbox";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
`;

const Card = styled.div`
 position: fixed; 
 width: calc(100% - 190px);

`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 100%;
  padding: 20px;
  background-color: ${surface};

  border-width: 1px;
  border-style: solid;
  border-color: rgb(213, 213, 213);
  border-image: initial;
  border-radius: 4px;
  padding: 8px 8px 8px 0px;

  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
    margin-bottom:10px;
    margin-left:1rem;
  }

  .checkbox-area{
    margin-left:2rem;
    padding-top:0.7rem;
  }
  .disable-button {
    background: rgb(101, 114, 117);
    margin-left:5px;
    margin-right:5px;
  }

  .pullbox{
    height:2.5rem;
    padding-top:0.5rem;
    .label-title{
      font-size:1rem;
      width:auto;
      margin-right:0.5rem;
      margin-left:5rem;
      height:2.5rem;
      margin-bottom:0;
    }
    .pullbox-label{
      height:2.5rem;
    }
    .pullbox-select {
      font-size: 1rem;
      min-width: 9rem;
      height: 2.5rem;
      padding-right:1.5rem;
      width:auto;
    }
    .pullbox-title{
      margin-top:-2px;
    }
  }

  .main-content{
    padding-left:1rem;
    padding-right:1rem;
  }
  .list{
    width:auto;
    margin-right:1rem;
  }
  .sub-title-area{
    position:relative;
    .tr {
      position:absolute;
      right:1rem;
    }
  }
  .third-area {
    width:calc(100% - 54rem);
  }

  .tl {
    text-align: left;
  }
  .tr {
      text-align: right;
  }
  table {
    margin-bottom:0;
    thead{
      display: table;
      width:100%;
    }
    tbody{
      height: calc(100vh - 150px);
      overflow-y:auto;
      display:block;
    }
    tr:nth-child(even) {background-color: #f2f2f2;}    
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        padding: 0.25rem;
        text-align: center;
        font-size:1rem;
        word-break: break-all;
    }
    th {
      text-align: center;
      padding: 0.3rem;
      font-size:1.1rem;
    }    
    .td-no{
      width:3rem;
    }
    .td-up-level{
      width:4.5rem
    }
    .td-level{
      width:3rem;
    }
    .name{
      width:20rem;      
    }
  }
  .selected{
    background:lightblue!important;
  }
  .disabled-record{
    background:#a0a0a0!important;
    text-decoration: line-through;
  }
 `;

 const ContextMenuUl = styled.ul`
  margin-bottom:0;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
    width:180px;
  }
  .context-menu li {
    clear: both;
    width: 180px;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
    color:black;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({visible,x,y,parent, type}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() =>parent.contextMenuAction("edit")}>変更</div></li>
          <li><div onClick={() => parent.contextMenuAction("delete")}>削除</div></li>
          {type == 'plan' && (
            <li><div onClick={() => parent.openObservationModal()}>観察項目編集</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class DiagnosisMaster extends React.Component {
    constructor(props) {    
        super(props);
        let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
        this.departements = {};
        this.department_options = [{id:0, value:'全科'}];
        if (departmentOptions != undefined && departmentOptions.length > 0) {
          departmentOptions.map(item=>{
            this.departements[item.id] = item.value;
            this.department_options.push({id:item.id, value:item.value})
          })
        }
        this.plan_class_options = [{id:0, value:''}];
        this.order_options = [
          {id:0, value:'表示順'},
          {id:1, value:'ID順'},
        ]
        this.order_object = {
          0:'order',
          1:'number'
        }
        this.state = {
          department_id:0,
          isOpenAddModal:false,
          isDeleteConfirmModal: false,
          isObservationModal:false,
          confirm_message:'',
          modal_data:null,
          all_show:0,
          order:0,
          alert_messages:'',
        };
    }
    componentDidMount(){
      this.getSearchMasters();
      this.getPlanClassMaster();
    }

    getPlanClassMaster = async() => {
      let path = "/app/api/v2/master/nurse/searchPlanClass";
      await apiClient
        ._post(path, {
          params: {}
        })
        .then(res => {
          if (res.length > 0){
            this.plan_classes = {};
            res.map(item => {
              this.plan_class_options.push({id:item.number, value:item.name});
              this.plan_classes[item.number] = item.name;
            })
          }
        })
    }

    confirmCancel() {
      this.setState({        
        isDeleteConfirmModal: false,
        confirm_message: "",
      });
    }

    handleClick = (e, item, type) => {
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
        document
          .getElementById("first-table")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("first-table")
              .removeEventListener(`scroll`, onScrollOutside);
            });
        document
          .getElementById("second-table")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("second-table")
              .removeEventListener(`scroll`, onScrollOutside);
            });
        document
          .getElementById("third-table")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("third-table")
              .removeEventListener(`scroll`, onScrollOutside);
            });
        var selected_diagnosis_level_number = this.state.selected_diagnosis_level_number;
        var selected_diagnosis_number = this.state.selected_diagnosis_number;
        if (type == 'level') selected_diagnosis_level_number = item.number;
        if (type == 'diagnosis') selected_diagnosis_number = item.number;
        this.setState({
          contextMenu: {
            visible: true,
            x: e.clientX,
            y: e.clientY,            
          },
          modal_data: item,
          type,
          selected_diagnosis_level_number,
          selected_diagnosis_number
        }, () => {
          if (type == 'level') this.getDiagnosisMaster();
          if (type == 'diagnosis') this.getNursePlanMaster();
        });
      }
    };

    contextMenuAction = (act) => {
      if( act === "edit") {
        this.setState({
          isOpenAddModal:true,
        })
      } else if (act === "delete") {
        var name = '';
        if (this.state.modal_data != null) name = this.state.modal_data.name;
        this.setState({
          isDeleteConfirmModal : true,
          confirm_message:'「' + name +'」　' + "このマスタを削除しますか?",
        })
      }
    };

    openObservationModal = () => {
      this.setState({isObservationModal:true})
    }

    deleteData = async () => {
      this.confirmCancel();
      let path = '';
      switch(this.state.type){
        case 'level':
          path = "/app/api/v2/master/nurse/deleteDiagnosisLevel";
          break;
        case 'diagnosis':
          path = "/app/api/v2/master/nurse/deleteDiagnosis";
          break;
        case 'plan':
          path = "/app/api/v2/master/nurse/deletePlan";
          break;
        default:
          path = "/app/api/v2/master/nurse/deleteDiagnosisLevel";
      }
      var number = this.state.modal_data != null? this.state.modal_data.number:0;
      await apiClient
        ._post(path, {
          params: {number: number}
        })
        .then(() => {
          switch(this.state.type){
            case 'level':
              this.setState({selected_diagnosis_level_number:0})
              this.getSearchMasters();
              break;
            case 'diagnosis':
              this.setState({selected_diagnosis_number:0})
              this.getDiagnosisMaster();
              break;
            case 'plan':
              this.getNursePlanMaster();
              break;
          }
          this.setState({alert_messages:'削除しました。'})          
        })

    }

    getSearchMasters = async () => {
      let path = "/app/api/v2/master/nurse/searchDiagnosisLevel";
      await apiClient
        ._post(path, {
          params: {
            department_id: this.state.department_id, 
            all_show:this.state.all_show,
            order_field:this.order_object[this.state.order],
          }
        })
        .then(res => {
          if (res.length > 0){
            this.setState({
              diagnosis_level_masters:res,
              // selected_diagnosis_level_number:this.state.selected_diagnosis_level_number >0? this.state.selected_diagnosis_level_number: res[0].number,
              selected_diagnosis_level_item:res[0],
              diagnosis_masters:undefined,
              selected_diagnosis_number:0,
              plan_masters:undefined,
            }, () => {
              // this.getDiagnosisMaster();
            })
          } else {
            this.setState({
              diagnosis_level_masters:undefined,
              selected_diagnosis_level_number:0,
              diagnosis_masters:undefined,
              selected_diagnosis_number:0,
              plan_masters:undefined,
            })
          }
        })
    }

    getDiagnosisMaster = async () => {
      let path = "/app/api/v2/master/nurse/searchDiagnosis";
      await apiClient
        ._post(path, {
          params: {
            diagnosis_level_id:this.state.selected_diagnosis_level_number, 
            all_show:this.state.all_show,
            order_field:this.order_object[this.state.order],
          }
        })
        .then(res => {
          if (res.length > 0){
            this.setState({
              diagnosis_masters:res,
              // selected_diagnosis_number:this.state.selected_diagnosis_number>0?this.state.selected_diagnosis_number:res[0].number,
              selected_diagnosis_item:res[0],
              plan_masters:undefined,
            }, () => {
              // this.getNursePlanMaster();
            })
          } else {
            this.setState({
              diagnosis_masters:undefined,
              selected_diagnosis_number:0,
              plan_masters:undefined,
            })
          }
        })
    }

    getNursePlanMaster = async () => {
      let path = "/app/api/v2/master/nurse/searchPlanMaster";
      await apiClient
        ._post(path, {
          params: {
            diagnosis_master_id:this.state.selected_diagnosis_number,
            all_show:this.state.all_show,
            order_field:this.order_object[this.state.order]
          }
        })
        .then(res => {
          if (res.length > 0){
            this.setState({
              plan_masters:res,              
            })
          } else {
            this.setState({
              plan_masters:undefined,              
            })
          }
        })
    }

    getSelect = (name, e) => {      
      this.setState({
        [name]:e.target.id,
        selected_diagnosis_level_number: 0
      }, () => {        
        this.getSearchMasters();
      });
    }

    selectDiagnosisLevel = (item) => {
      this.setState({
        selected_diagnosis_level_number:item.number,
        selected_diagnosis_level_item:item,
        selected_diagnosis_number:0,        
      }, () => {
        this.getDiagnosisMaster();
      })
    }

    selectDiagnosis = (item) => {
      this.setState({
        selected_diagnosis_number:item.number,
        selected_diagnosis_item:item,        
      }, () => {
        this.getNursePlanMaster();
      })
    }

    openAddModal = (type) => {
      if (type == 'diagnosis'){
        if (!(this.state.selected_diagnosis_level_number > 0)){
          this.setState({
            alert_messages:'診断階層マスタを選択してください。'
          })
          return;
        }
        
      }
      if (type == 'plan'){
        if (!(this.state.selected_diagnosis_number > 0)){
          this.setState({
            alert_messages:'診断マスタを選択してください。'
          })
          return;
        }
      }
      this.setState({
        type,
        isOpenAddModal:true,
        modal_data:null,
      })
    }

    closeModal = () => {
      this.setState({
        isOpenAddModal:false,
        isObservationModal:false,
        alert_messages:''
      })
    }

    handleOk = (new_id) => {
      switch(this.state.type){
        case 'level':
          if (new_id > 0){
            this.setState({selected_diagnosis_level_number:new_id}, () => {
              this.getSearchMasters();
              this.getDiagnosisMaster();
            })
          } else {
            this.getSearchMasters();
            if (this.state.selected_diagnosis_level_number > 0) this.getDiagnosisMaster();
          }          
          break;
        case 'diagnosis':
          if (new_id > 0){
            this.setState({selected_diagnosis_number:new_id}, () => {
              this.getDiagnosisMaster();
              this.getNursePlanMaster();
            })
          } else {
            this.getDiagnosisMaster();
            if (this.state.selected_diagnosis_number > 0) this.getNursePlanMaster();
          }          
          break;
        case 'plan':
          this.getNursePlanMaster();
          break;
      }
      this.closeModal();
    }

    getCheckBox = (name, value) => {
      this.setState({[name]:value, selected_diagnosis_level_number:0}, () => {
        this.getSearchMasters();
      });
    }

    goOtherPage = (url) => {
      this.props.history.replace(url);
    }

    render() {
      return (
        <Card>
          <Wrapper>
            <div className='header flex'>
              <div className="title">看護計画診断マスタ</div>
              <SelectorWithLabel
                options={this.department_options}
                title="診療科"
                getSelect={this.getSelect.bind(this, 'department_id')}
                departmentEditCode={this.state.department_id}
              />
              <SelectorWithLabel
                options={this.order_options}
                title="表示順"
                getSelect={this.getSelect.bind(this, 'order')}
                departmentEditCode={this.state.order}
              />
              <div className ='checkbox-area'>
                <Checkbox
                  label="非表示の項目も表示"
                  getRadio={this.getCheckBox.bind(this)}
                  value={this.state.all_show}
                  checked = {this.state.all_show ==1}
                  name="all_show"
                />
              </div>

              <div style={{position:'absolute', right:'15px'}}>
                <Button className="disable-button">看護計画診断マスタ</Button>
                <Button className="" onClick={this.goOtherPage.bind(this,"/maintenance/observation_master")}>観察項目マスタ</Button>
              </div>
            </div>
            <div className='main-content flex'>
              <div className='first-area list-block'>
                <div className='sub-title-area flex'>
                  <div className='sub-title tl'>診断階層マスタ</div>
                  <div className='tr clickable' onClick={this.openAddModal.bind(this, 'level')}><Icon icon={faPlus} />追加</div>
                </div>
                <div className='list'>
                <table className="table-scroll table table-bordered" id="first-table">
                  <thead>
                    <tr>
                      <th className="td-no">ID</th>
                      <th className="td-up-level">上階層</th>
                      <th className="td-level">階層</th>
                      <th style={{width:'7rem'}}>診療科</th>
                      <th className="name" style={{width:'13rem'}}>名称</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.diagnosis_level_masters != undefined && this.state.diagnosis_level_masters!= null && this.state.diagnosis_level_masters.length > 0 && (
                    this.state.diagnosis_level_masters.map(item => {
                      return(
                        <>
                        <tr className={(this.state.selected_diagnosis_level_number == item.number?'selected clickable ':'clickable ') + (item.is_enabled ? '' : 'disabled-record')}
                          onClick={this.selectDiagnosisLevel.bind(this, item)} onContextMenu={e => this.handleClick(e,item, 'level')}>
                          <td className='td-no'>{item.number}</td>
                          <td className='td-up-level'>{item.up_diagnosis_level_id}</td>
                          <td className='td-level'>{item.level>0?item.level:0}</td>
                          <td style={{width:'7rem'}}>{item.department_id > 0 ? this.departements[item.department_id]:''}</td>
                          <td className='name text-left' style={{width:'13rem'}}>{item.name}</td>
                        </tr>
                        </>
                      )
                    })
                  )}
                  </tbody>
                </table>
                </div>
              </div>
              <div className='second-area list-block'>
                <div className='sub-title-area flex'>
                  <div className='sub-title tl'>診断マスタ</div>
                  <div className='tr clickable' onClick={this.openAddModal.bind(this, 'diagnosis')}><Icon icon={faPlus} />追加</div>
                </div>
                <div className='list'>
                  <table className="table-scroll table table-bordered" id="second-table">
                    <thead>
                      <tr>
                        <th className="td-no">ID</th>
                        <th className="name">名称</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.diagnosis_masters != undefined && this.state.diagnosis_masters!= null && this.state.diagnosis_masters.length > 0 && (
                      this.state.diagnosis_masters.map(item => {
                        return(
                          <>
                          <tr className={(this.state.selected_diagnosis_number == item.number?'selected clickable ':'clickable ') + (item.is_enabled ? '' : 'disabled-record')}
                            onClick={this.selectDiagnosis.bind(this, item)} onContextMenu={e => this.handleClick(e,item, 'diagnosis')}>
                            <td className='td-no'>{item.number}</td>
                            <td className='name text-left'>{item.name}</td>
                          </tr>
                          </>
                        )
                      })
                    )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className='third-area list-block'>
                <div className='sub-title-area flex'>
                  <div className='sub-title tl'>看護計画マスタ</div>
                  <div className='tr clickable' onClick={this.openAddModal.bind(this, 'plan')}><Icon icon={faPlus} />追加</div>
                </div>
                <div className='list' style={{marginRight:0}}>
                  <table className="table-scroll table table-bordered" id="third-table">
                    <thead>
                      <tr>
                        <th className="td-no">ID</th>
                        <th style={{width:'6rem'}}>計画区分</th>
                        <th className="">名称</th>
                        <th style={{width:'7rem'}}>観察項目数</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.plan_masters != undefined && this.state.plan_masters!= null && this.state.plan_masters.length > 0 && (
                      this.state.plan_masters.map(item => {
                        return(
                          <>
                          <tr onContextMenu={e => this.handleClick(e,item, 'plan')} className={item.is_enabled ? '' : 'disabled-record'}>
                            <td className='td-no'>{item.number}</td>
                            <td style={{width:'6rem'}}>{this.plan_classes[item.plan_class_id]}</td>
                            <td className='text-left'>{item.name}</td>
                            <td style={{width:'7rem'}}>{item.observe_data.length}</td>
                          </tr>
                          </>
                        )
                      })
                    )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Wrapper>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            type = {this.state.type}
          />
          {this.state.isOpenAddModal && (
            <DiagnosisModal
              type = {this.state.type}
              department_id = {this.state.department_id}
              closeModal = {this.closeModal}
              modal_data = {this.state.modal_data}
              diagnosis_level_id = {this.state.selected_diagnosis_level_number}
              diagnosis_master_id = {this.state.selected_diagnosis_number}
              handleOk = {this.handleOk}
              plan_class_options = {this.plan_class_options}
            />
          )}
          {this.state.isObservationModal && (
            <PlanObservationMasterModal
              closeModal = {this.closeModal}
              modal_data = {this.state.modal_data}
              selected_diagnosis_level_item = {this.state.selected_diagnosis_level_item}
              selected_diagnosis_item = {this.state.selected_diagnosis_item}
              handleOk = {this.getNursePlanMaster}
            />
          )}
          {this.state.isDeleteConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.deleteData.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.alert_messages != "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
              title = {this.state.alert_title}
            />
          )}
        </Card>
      )
    }
}

DiagnosisMaster.propTypes = {
  history: PropTypes.object
};
export default DiagnosisMaster