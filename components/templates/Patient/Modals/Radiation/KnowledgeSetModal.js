import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import Checkbox from "~/components/molecules/Checkbox";
import SelectBranchModal from "./SelectBranchModal";
import * as apiClient from "~/api/apiClient";

const Header = styled.div`
  button{
    padding-top:0.5rem;
    padding-bottom:0.5rem;
  }
  label{
    margin-top:7px;
  }
`

const Wrapper = styled.div`
    height: 100%;
    .flex {
        display: flex;
    }
    
    .panel-menu {
        width: 100%;
        margin-bottom: 20px;
        font-weight: bold;
        .menu-btn {
            width:33%;
            text-align: center;
            border-bottom: 1px solid #aaa;
            background-color: rgba(200, 194, 194, 0.22);
            padding: 5px 0;
            cursor: pointer;
        }
        .active-menu {
            width:34%;
            text-align: center;
            border-top: 1px solid #aaa;
            border-right: 1px solid #aaa;
            border-left: 1px solid #aaa;
            padding: 5px 0;
        }
    }
    .work-area {
        width: 100%;
        overflow-x:hidden;
        overflow-y: auto;
        height: calc(100% - 30px);
        border-bottom: 1px solid #aaa;
        border-left: 1px solid #aaa;
        border-right: 1px solid #aaa;
        margin-top: -20px;
        .checkbox-area{
            margin-top:3px;
            margin-bottom:3px;
            padding-left:10px;
        }        
    }
    .block{
        border:1px solid gray;
        margin-right:5px;
        min-width:100px;
        height:100px;
    }
    .row-item {
        cursor:pointer;
    }
    .selected{
        background: bisque;
    }
    .select-btn-area {
      width: calc(100% - 200px);
      padding-left: 0px;      
      .btn-item {
          cursor:pointer;
          border:1px solid #aaa;
          padding-left: 5px;
          padding-right: 5px;
          margin-right: 5px;
      }
      .btn-area{
        width:100%;
        height:100%;
        overflow-y: auto;
        p{
          margin-top:0;
          margin-bottom:0;
        }
      }
    }
    .tab-area {
        width: 100%;
        height: calc(100% - 5rem);
        margin: 10px;
        border: 1px solid #aaa;
        .sub-title{
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            background-color: #a0ebff;
        }
        .shooting-classific {
            border-right: 1px solid #aaa;
            width: 200px;
            overflow-y: auto;
        }
    }
`;

class KnowledgeSetModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab_id:0,
            radiation_classific_data:props.radiation_classific_data,
            radiation_part_data:props.radiation_part_data,
            selected_classific_id:'',
            selected_classific_name:'',
            display_order_data:null,
            selected_part_id:'',
            selected_part_name:'',
            recent_order: this.props.recent_order,
            isOpenSelectBranchModal:false,

            comment:true,
        }
    }

    async componentDidMount() {
        let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
        this.department_id = this.context.department.code == 0 ? 1 : this.context.department.code;
        this.doctor_code = authInfo.staff_category == 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
        this.refresh();
    }

    refresh = async() => {
      let path = "/app/api/v2/order/radiation/getFavoriteOrder";
      let post_data = {
        radiation_id: this.props.radiation_id,
        department_id: this.department_id,
        doctor_code:this.doctor_code,
      };
      await apiClient._post(path, {params: post_data}).then((res) => {        
        if (res != null){
          this.setState({
            departemnt_favorites:res.department,
            docotr_favorites:res.doctor,
          })
        } else {
          this.setState({
            departemnt_favorites:undefined,
            docotr_favorites:undefined,
          })
        }
      })
      .catch(()=> {
        this.setState({
          departemnt_favorites:undefined,
          docotr_favorites:undefined,
        })
      })
    }

    setTab = ( e, val ) => {
      var display_order_data = this.state.display_order_data;
      var display_departemnt_favorites = this.state.display_departemnt_favorites;
      var display_docotr_favorites = this.state.display_docotr_favorites;
      var selected_classific_id = this.state.selected_classific_id;
      if (selected_classific_id > 0){
        switch(parseInt(val)){
          case 0:
            if (this.state.recent_order != undefined && this.state.recent_order != null && this.state.recent_order.length > 0){
              display_order_data = this.state.recent_order.filter(x=>x.classfic_id == parseInt(selected_classific_id));
            }
            break;
          case 1:
            if (this.state.docotr_favorites != undefined && this.state.docotr_favorites != null && this.state.docotr_favorites.length > 0){
              display_docotr_favorites = this.state.docotr_favorites.filter(x=>x.classfic_id == parseInt(selected_classific_id));
            }
            break;
          case 2:
            if (this.state.departemnt_favorites != undefined && this.state.departemnt_favorites != null && this.state.departemnt_favorites.length > 0){
              display_departemnt_favorites = this.state.departemnt_favorites.filter(x=>x.classfic_id == parseInt(selected_classific_id));
            }
            break;
        }
        this.setState({
          tab_id:parseInt(val),
          selected_order:undefined,
          display_order_data,
          display_docotr_favorites,
          display_departemnt_favorites,
        })
      } else {
        this.setState({
          tab_id:parseInt(val),
          selected_order:undefined
        });
      }
        
    };

    closeModal = () => {
      this.setState({
        isOpenSelectBranchModal:false,
      })
    }

    selectClassfic = (item, type) => {
      let order_data = undefined;
      var display_order_data = this.state.display_order_data;
      var display_departemnt_favorites = this.state.display_departemnt_favorites;
      var display_docotr_favorites = this.state.display_docotr_favorites;
      switch(type){
        case 0:
          order_data = this.state.recent_order;          
          display_order_data = order_data.filter(x=>x.classfic_id == parseInt(item.radiation_shooting_classific_id));          
          break;
        case 1:
          order_data = this.state.docotr_favorites;
          display_docotr_favorites = order_data.filter(x=>x.classfic_id == parseInt(item.radiation_shooting_classific_id));
          break;
        case 2:
          order_data = this.state.departemnt_favorites;
          display_departemnt_favorites = order_data.filter(x=>x.classfic_id == parseInt(item.radiation_shooting_classific_id));
          break;
      }
        
        this.setState({
            selected_classific_id : item.radiation_shooting_classific_id,
            selected_classific_name : item.radiation_shooting_classific_name,
            display_order_data,
            display_departemnt_favorites,
            display_docotr_favorites,
            selected_order:undefined,
        })
    };

    getRadio = (name, value) => {
        switch(name){
            case 'setting':
                this.setState({setting:value})
                break;
            case 'display':
                this.setState({display:value})
                break;
            case 'comment':
                this.setState({comment:value})
                break;
        }
    }

    selectOrder = (item) => {
      this.setState({
        selected_order:item,
      })
    }

    getClass(item) {
      if (this.state.selected_order == undefined) return '';
      if (JSON.stringify(item) == JSON.stringify(this.state.selected_order)) return 'selected'; else return '';
    }

    handleOK = () => {
      if (this.state.selected_order == undefined || this.state.selected_order == null){
        window.sessionStorage.setItem("alert_messages", '項目を選択してください。');
        return;
      }
      this.props.handleOk(this.state.selected_order);
    }
    saveRecentOrder = () => {
      if (this.state.selected_order == undefined || this.state.selected_order == null){
        // window.sessionStorage.setItem("alert_messages", '項目を選択してください。');
        return;
      }
      this.setState({
        isOpenSelectBranchModal:true,
      })
    }

    saveToDB = async(type)=> {
      this.closeModal();
      let path = "/app/api/v2/order/radiation/saveFavoriteOrder";
      let post_data = {
        radiation_id: this.props.radiation_id,
        department_id: this.department_id,
        doctor_code:this.doctor_code,
        selected_order : this.state.selected_order,
      };
      if (type == 'department'){
        post_data.kind = 2;
      } else {
        post_data.kind = 1;
      }
      await apiClient._post(path, {params: post_data}).then(() => {
        this.refresh();
        window.sessionStorage.setItem("alert_messages", '保存しました。');
      })
      .catch(() => {
        window.sessionStorage.setItem("alert_messages", '失敗しました。');
      })
    }

    render() {
      var tooltip = '';
      if (this.state.selected_order == undefined || this.state.selected_order == null){
        tooltip = '項目を選択してください。' ;
      } else {
        tooltip = '';
      }
        return (
            <>
                <Modal show={true} className="custom-modal-sm patient-exam-modal knowledge-set-modal first-view-modal">
                    <Modal.Header><Modal.Title>
                      <Header>
                        {this.props.radiation_name}
                        <div className='title-right-area haruka-buttons'>
                            {/* <Checkbox
                                label={'初期起動画面に設定'}
                                getRadio={this.getRadio}
                                value = {this.state.setting}
                                name="setting"
                            /> */}
                        </div>
                      </Header>
                    </Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                            <div className="panel-menu flex">
                                { this.state.tab_id === 0 ? (
                                    <div className="active-menu">利用者ナレッジ</div>
                                ) : (
                                    <div className="menu-btn" onClick={e => {this.setTab(e, 0);}}>利用者ナレッジ</div>
                                )}
                                { this.state.tab_id === 1 ? (
                                    <div className="active-menu">利用者セット</div>
                                ) : (
                                    <div className="menu-btn" onClick={e => {this.setTab(e, 1);}}>利用者セット</div>
                                )}
                                { this.state.tab_id === 2 ? (
                                    <div className="active-menu">自科セット</div>
                                ) : (
                                    <div className="menu-btn" onClick={e => {this.setTab(e, 2);}}>自科セット</div>
                                )}
                            </div>
                            <div className="work-area">
                                {this.state.tab_id === 0 && (
                                    <>
                                        <div className='flex checkbox-area'>
                                            {/* <Checkbox
                                                label={'このタブを最前面に表示'}
                                                getRadio={this.getRadio}
                                                value = {this.state.display}
                                                name="display"
                                            /> */}
                                            <Checkbox
                                                label={'コメントを含めて展開'}
                                                getRadio={this.getRadio}
                                                value = {this.state.comment}
                                                name="comment"
                                            />
                                        </div>
                                        <div className={'tab-area flex'}>
                                            <div className={'shooting-classific'}>
                                                <div className={'sub-title'}>撮影区分</div>
                                                {this.state.radiation_classific_data != null && this.state.radiation_classific_data.length>0 && (
                                                    this.state.radiation_classific_data.map(item => {
                                                        return(
                                                            <>
                                                                <div className={this.state.selected_classific_id == item.radiation_shooting_classific_id ? 'row-item selected' : 'row-item'} onClick={this.selectClassfic.bind(this, item,0)}>
                                                                    {item.radiation_shooting_classific_name}
                                                                </div>
                                                            </>
                                                        )
                                                    })
                                                )}
                                            </div>
                                            <div className={'select-btn-area'}>
                                                <div className={'sub-title'}></div>
                                                <div className={'btn-area'}>
                                                    {this.state.display_order_data != null && this.state.display_order_data.length>0 &&(
                                                        this.state.display_order_data.map((item) => {
                                                            return(
                                                                <>
                                                                    <label className={'block ' + this.getClass(item)} onClick={this.selectOrder.bind(this, item)}>
                                                                        <span style={{color:'blue'}}>{item.part_name}</span><br/>
                                                                        <span>{item.left_right_name}</span><br/>
                                                                        <span>{item.method_name}</span><br/>
                                                                        <span></span>
                                                                    </label>                                                                    
                                                                </>
                                                            )
                                                        })
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {this.state.tab_id === 1 && (
                                    <>
                                        <div className={'tab-area flex'}>
                                            <div className={'shooting-classific'}>
                                                <div className={'sub-title'}>撮影区分</div>
                                                {this.state.radiation_classific_data != null && this.state.radiation_classific_data.length>0 && (
                                                    this.state.radiation_classific_data.map(item => {
                                                        return(
                                                            <>
                                                                <div className={this.state.selected_classific_id == item.radiation_shooting_classific_id ? 'row-item selected' : 'row-item'} onClick={this.selectClassfic.bind(this, item, 1)}>
                                                                    {item.radiation_shooting_classific_name}
                                                                </div>
                                                            </>
                                                        )
                                                    })
                                                )}
                                            </div>
                                            <div className={'select-btn-area'}>
                                                <div className={'sub-title'}></div>
                                                <div className={'btn-area'}>
                                                    {this.state.display_docotr_favorites != null && this.state.display_docotr_favorites.length>0 &&(
                                                        this.state.display_docotr_favorites.map((item) => {                                                            
                                                            return(
                                                                <>
                                                                    <label className={'block ' + this.getClass(item)} onClick={this.selectOrder.bind(this, item)}>
                                                                        <span style={{color:'blue'}}>{item.part_name}</span><br/>
                                                                        <span>{item.left_right_name}</span><br/>
                                                                        <span>{item.method_name}</span><br/>
                                                                        <span></span>
                                                                    </label>                                                                    
                                                                </>
                                                            )
                                                        })
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {this.state.tab_id === 2 && (
                                    <>
                                    <div className={'tab-area flex'}>
                                        <div className={'shooting-classific'}>
                                            <div className={'sub-title'}>撮影区分</div>
                                            {this.state.radiation_classific_data != null && this.state.radiation_classific_data.length>0 && (
                                                this.state.radiation_classific_data.map(item => {
                                                    return(
                                                        <>
                                                            <div className={this.state.selected_classific_id == item.radiation_shooting_classific_id ? 'row-item selected' : 'row-item'} onClick={this.selectClassfic.bind(this, item, 2)}>
                                                                {item.radiation_shooting_classific_name}
                                                            </div>
                                                        </>
                                                    )
                                                })
                                            )}
                                        </div>
                                        <div className={'select-btn-area'}>
                                            <div className={'sub-title'}></div>
                                            <div className={'btn-area'}>
                                                {this.state.display_departemnt_favorites != null && this.state.display_departemnt_favorites.length>0 &&(
                                                    this.state.display_departemnt_favorites.map((item)=> {                                                            
                                                        return(
                                                            <>
                                                                <label className={'block ' + this.getClass(item)} onClick={this.selectOrder.bind(this, item)}>
                                                                  <span style={{color:'blue'}}>{item.part_name}</span><br/>
                                                                  <span>{item.left_right_name}</span><br/>
                                                                  <span>{item.method_name}</span><br/>
                                                                  <span></span>
                                                                </label>                                                                
                                                            </>
                                                        )
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                                )}
                            </div>
                        </Wrapper>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button className='cancel-btn' onClick={this.props.closeModal}>キャンセル</Button>
                      <Button tooltip={tooltip} className={tooltip == ''?'red-btn':'disable-btn'}  onClick={this.saveRecentOrder}>条件保存</Button>
                      <Button className='red-btn' onClick={this.handleOK}>確定</Button>
                    </Modal.Footer>
                </Modal>
                {this.state.isOpenSelectBranchModal && (
                  <SelectBranchModal
                    closeModal = {this.closeModal}
                    confirmOk = {this.saveToDB}
                  />
                )}
            </>
        );
    }
}
KnowledgeSetModal.contextType = Context;
KnowledgeSetModal.propTypes = {
    closeModal: PropTypes.func,
    radiation_id: PropTypes.number,
    radiation_name: PropTypes.string,
    patientId: PropTypes.number,
    patientInfo: PropTypes.array,
    radiation_classific_data: PropTypes.array,
    radiation_part_data: PropTypes.array,
    recent_order: PropTypes.array,
    handleOk: PropTypes.func,
};

export default KnowledgeSetModal;
