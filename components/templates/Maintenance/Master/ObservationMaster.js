import React from 'react'
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import * as apiClient from "~/api/apiClient";
// import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Checkbox from "~/components/molecules/Checkbox";
// import InputKeyWord from "~/components/molecules/InputKeyWord";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
//  import auth from "~/api/auth";
import EditObservationModal from "./Modal/EditObservationModal";
import PlanObservationMasterModal from "./Modal/PlanObservationMasterModal";
import PropTypes from "prop-types";
import Button from "~/components/atoms/Button";
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

  .search-word {
    margin-left:3rem;
    padding-top:0.7rem;
    .div-title {
      line-height: 2rem;
      width: 8rem;
    }
    input {
      font-size: 1rem;
      height:2rem;
      margin:0;
      width:20rem;
    }
    button {
      width:4rem;
      height:2rem;
      margin-left:0.5rem;
      margin-right:2rem;
    }
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

  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
    margin-bottom:10px;
    margin-left:1rem;
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
      width:22.5rem;      
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
          {type == 'plan' && (
            <li><div onClick={() => parent.openObservationModal()}>観察項目編集</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class ObservationMaster extends React.Component {
    constructor(props) {    
        super(props);
        let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
        this.departements = {};
        this.department_options = [{id:0, value:''}];
        if (departmentOptions != undefined && departmentOptions.length > 0) {
          departmentOptions.map(item=>{
            this.departements[item.id] = item;
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
          isOpenAddModal:false,
          isDeleteConfirmModal: false,
          isObservationModal:false,
          confirm_message:'',
          modal_data:null,
          all_show:0,
          order:0,
          alert_messages:''
        };
    }
    componentDidMount(){
      this.getFirstLayer();
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
            res.map(item => {
              this.plan_class_options.push({id:item.number, value:item.name})
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
        var selected_first_layer_number = this.state.selected_first_layer_number;
        var selected_second_layer_number = this.state.selected_second_layer_number;
        if (type == 1) selected_first_layer_number = item.number;
        if (type == 2) selected_second_layer_number = item.number;
        this.setState({
          contextMenu: {
            visible: true,
            x: e.clientX,
            y: e.clientY,            
          },
          modal_data: item,
          type,
          selected_first_layer_number,
          selected_second_layer_number
        }, () => {
          if (type == 1) this.getSecondLayer();
          if (type == 2) this.getThirdLayer();
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

    getFirstLayer = async () => {
      let path = "/app/api/v2/master/nurse/get_first_elapsed_title";
      await apiClient
        ._post(path, {
          params: {
            name:this.state.search_word, 
            all_show:this.state.all_show,
            order_field:this.order_object[this.state.order],
          }
        })
        .then(res => {
          if (res.length > 0){
            this.setState({
              first_layer_data:res,
              // selected_first_layer_number:this.state.selected_first_layer_number > 0? this.state.selected_first_layer_number: res[0].number,
              selected_first_layer_item:res[0],
              second_layer_data:undefined,
              selected_second_layer_number:0,
              third_layer_data:undefined,
            }, () => {
              // this.getSecondLayer();
            })
          } else {
            this.setState({
              first_layer_data:undefined,
              selected_first_layer_number:0,
              second_layer_data:undefined,
              selected_second_layer_number:0,
              third_layer_data:undefined,
            })
          }
        })
    }

    getSecondLayer = async () => {
      let path = "/app/api/v2/master/nurse/get_second_elapsed_title";
      await apiClient
        ._post(path, {
          params: {
            name:this.state.search_word,
            all_show:this.state.all_show,
            tier_1st_id:this.state.selected_first_layer_number,
            order_field:this.order_object[this.state.order],
          }
        })
        .then(res => {
          if (res.length > 0){
            this.setState({
              second_layer_data:res,
              // selected_second_layer_number:this.state.selected_second_layer_number > 0? this.state.selected_second_layer_number: res[0].number,              
              selected_second_layer_item:res[0],
              third_layer_data:undefined,
            }, () => {
              // this.getThirdLayer();
            })
          } else {
            this.setState({
              second_layer_data:undefined,
              selected_second_layer_number:0,
              third_layer_data:undefined,
            })
          }
        })
    }

    getThirdLayer = async () => {
      let path = "/app/api/v2/master/nurse/get_third_elapsed_title";
      await apiClient
        ._post(path, {
          params: {
            name:this.state.search_word,
            all_show:this.state.all_show,
            tier_1st_id:this.state.selected_first_layer_number,
            tier_2nd_id:this.state.selected_second_layer_number,
            order_field:this.order_object[this.state.order],
          }
        })
        .then(res => {
          if (res.length > 0){
            this.setState({
              third_layer_data:res,              
            })
          } else {
            this.setState({
              third_layer_data:undefined,              
            })
          }
        })
    }

    selectFirstItem = (item) => {
      this.setState({
        selected_first_layer_number:item.number,
        selected_first_layer_item:item,
        selected_second_layer_number:0
      }, () => {
        this.getSecondLayer();
      })
    }

    selectSecondItem = (item) => {
      this.setState({
        selected_second_layer_number:item.number,
        selected_second_layer_item:item,
      }, () => {
        this.getThirdLayer();
      })
    }

    openAddModal = (type) => {
      if (type == 2){
        if (!(this.state.selected_first_layer_number > 0)){
          this.setState({alert_messages:'第一階層を選択してください。'})
          return;
        }
      }
      if (type == 3){
        if (!(this.state.selected_second_layer_number > 0)){
          this.setState({alert_messages:'第二階層を選択してください。'})
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
        case 1:
          if (new_id > 0){
            this.setState({
              selected_first_layer_number:new_id
            }, () => {
              this.getFirstLayer();
              this.getSecondLayer();
            })
          } else {
            this.getFirstLayer();
            if (this.state.selected_first_layer_number > 0) this.getSecondLayer();
          }          
          break;
        case 2:
          if (new_id > 0){
            this.setState({selected_second_layer_number:new_id}, () => {
              this.getSecondLayer();
              this.getThirdLayer();
            })
          } else {
            this.getSecondLayer();
            if (this.state.selected_second_layer_number > 0) this.getThirdLayer();
          }
          
          break;
        case 3:
          this.getThirdLayer();
          break;
      }
      this.closeModal();
    }

    getInputWord = e => {
      let search_input_obj = document.getElementById("search_input");
      let cur_caret_pos = search_input_obj.selectionStart;
      this.setState({search_word: e.target.value, cur_caret_pos:cur_caret_pos});
    };

    onClickInputWord = () => {
      let search_input_obj = document.getElementById("search_input");
      let cur_caret_pos = search_input_obj.selectionStart;
      this.setState({cur_caret_pos});
    };

    onInputKeyPressed = (e) => {
      if(e.keyCode === 13){
        this.getFirstLayer();
      }
    };

    getCheckBox = (name, value) => {
      this.setState({[name]:value, selected_first_layer_number:0}, () => {
        this.getFirstLayer();
      });
    }

    goOtherPage = (url) => {
      this.props.history.replace(url);
    }

    getSelect = (name, e) => {
      this.setState({[name]:e.target.id, selected_first_layer_number:0}, () => {
        this.getFirstLayer();
      });
    }

    render() {
      return (
        <Card>
          <Wrapper>
            <div className='header flex'>
              <div className="title">観察項目マスタ</div>
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
                <Button className="" onClick={this.goOtherPage.bind(this,"/maintenance/diagnosis_master")}>看護計画診断マスタ</Button>
                <Button className="disable-button">観察項目マスタ</Button>
              </div>
            </div>
            <div className='main-content flex'>
              <div className='first-area list-block'>
                <div className='sub-title-area flex'>
                  <div className='sub-title tl'>第一階層</div>
                  <div className='tr clickable' onClick={this.openAddModal.bind(this, 1)}><Icon icon={faPlus} />追加</div>
                </div>
                <div className='list'>
                <table className="table-scroll table table-bordered" id="first-table">
                  <thead>
                    <tr>
                      <th className="td-no">ID</th>
                      <th className="name">名称</th>
                    </tr>
                  </thead>
                  <tbody>
                  {this.state.first_layer_data != undefined && this.state.first_layer_data!= null && this.state.first_layer_data.length > 0 && (
                    this.state.first_layer_data.map(item => {
                      return(
                        <>
                        <tr className={(this.state.selected_first_layer_number == item.number?'selected clickable ':'clickable ') + (item.is_enabled ? '' : 'disabled-record')}
                          onClick={this.selectFirstItem.bind(this, item)} onContextMenu={e => this.handleClick(e,item, 1)}>
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
              <div className='second-area list-block'>
                <div className='sub-title-area flex'>
                  <div className='sub-title tl'>第二階層</div>
                  <div className='tr clickable' onClick={this.openAddModal.bind(this, 2)}><Icon icon={faPlus} />追加</div>
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
                    {this.state.second_layer_data != undefined && this.state.second_layer_data!= null && this.state.second_layer_data.length > 0 && (
                      this.state.second_layer_data.map(item => {
                        return(
                          <>
                          <tr className={(this.state.selected_second_layer_number == item.number?'selected clickable ':'clickable ') + (item.is_enabled ? '' : 'disabled-record')} 
                            onClick={this.selectSecondItem.bind(this, item)} onContextMenu={e => this.handleClick(e,item, 2)}>
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
                  <div className='sub-title tl'>第三階層</div>
                  <div className='tr clickable' onClick={this.openAddModal.bind(this, 3)}><Icon icon={faPlus} />追加</div>
                </div>
                <div className='list' style={{marginRight:0}}>
                  <table className="table-scroll table table-bordered" id="third-table">
                    <thead>
                      <tr>
                        <th className="td-no">ID</th>
                        <th className="">名称</th>
                      </tr>
                    </thead>
                    <tbody>
                    {this.state.third_layer_data != undefined && this.state.third_layer_data!= null && this.state.third_layer_data.length > 0 && (
                      this.state.third_layer_data.map(item => {
                        return(
                          <>
                          <tr onContextMenu={e => this.handleClick(e,item, 3)} className={item.is_enabled ? '' : 'disabled-record'}>
                            <td className='td-no'>{item.number}</td>
                            <td className='text-left'>{item.name}</td>
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
            <EditObservationModal
              type = {this.state.type}              
              closeModal = {this.closeModal}
              modal_data = {this.state.modal_data}
              selected_first_layer_number = {this.state.selected_first_layer_number}
              selected_second_layer_number = {this.state.selected_second_layer_number}
              handleOk = {this.handleOk}              
            />
          )}
          {this.state.isObservationModal && (
            <PlanObservationMasterModal
              closeModal = {this.closeModal}
              modal_data = {this.state.modal_data}
              selected_first_layer_item = {this.state.selected_first_layer_item}
              selected_second_layer_item = {this.state.selected_second_layer_item}
            />
          )}
          {/* {this.state.isDeleteConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.deleteData.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )} */}
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

ObservationMaster.propTypes = {
  history: PropTypes.object
};
export default ObservationMaster