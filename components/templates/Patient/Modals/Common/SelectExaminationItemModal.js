import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Radiobox from "~/components/molecules/Radiobox";
import InputKeyWord from "~/components/molecules/InputKeyWord";
import Button from "~/components/atoms/Button";
import {surface} from "~/components/_nano/colors";
import axios from "axios/index";
import Spinner from "react-bootstrap/Spinner";
import * as apiClient from "~/api/apiClient";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const Card = styled.div`
  position: relative;  
  overflow: hidden; 
  overflow-y: auto;
  margin: 0px;
  float: left;
  width: 100%;
  height: 100%;
  background-color: ${surface};
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 14px;
  display: flex;
  .flex {
    display: flex;
    flex-wrap: wrap;
  }
  .letter-div-style{
    label{
        font-size: 1rem;
        line-height: 2.3rem;
    }
  }
  .left-area {
    height: 100%;
    .search-word-label {
      margin-right:0.5rem;
      line-height:2.3rem;
      font-size:1rem;
    }
    .medicine_type {
        font-size: 1rem;
        padding-top: 10px;
        padding-bottom: 10px;
        .radio-btn label{
            width: 85px;
            border: solid 1px rgb(206, 212, 218);
            border-radius: 4px;
            margin-right: 5px;
            padding: 4px 5px;
            font-size: 1rem;  
        }
    }
    .history-list{
      overflow-y: auto;
      font-size:1rem;
      height:calc(100% - 4rem);
      border: 1px solid #aaa;
      table {
        margin-bottom: 0;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        td {
            padding: 0.25rem;
            text-align: left;  
            font-size: 1rem;
        }
        th {
            text-align: center;
            padding: 0.3rem;  
            font-size: 22px;
            font-weight: normal;
            width: 50%;
        }
        .text-center {
            text-align: center;
        }
      }
      .selected {
        background: rgb(105, 200, 225) !important;
        color: white;
      }
    }
    
    .no-result {    
      height:calc(100% - 1px);
      width:100%;
      div{
        height:100%;
        width:100%;
        text-align: center;
        vertical-align:middle;
        display:flex;
        align-items:center;
        justify-content:center; 
      }
      
      span {
        padding: 10px;
        border: 2px solid #aaa;
      }
    }
    .move-next {
        text-align: center;
        font-size: 40px;
        font-weight: bold;
        margin: auto;
        div {
            cursor: pointer;
            border: 1px solid #aaa;
            text-align: center;
            margin-left: auto;
            margin-right: auto;
            width: 50%;
            padding-left: 0.8rem;
        }
    }
    .btn-area {
      margin-bottom:0.5rem;
      button {
        height:2.3rem;
        padding:0;
        span {font-size:1rem;}
      }
    }
  }
  .cursor{
    cursor:pointer;
  }
  .search_word {
    width: 320px;
    label {
        width: 0;
        margin: 0;
    }
    input {
        font-size: 1rem;
        height:2.3rem;
        margin-top:0px;
    }
  }
  .select-department {
    width: 30%;
    .label-title {
        font-size: 16px;
        text-align: right;
        padding-right: 10px;
        width: 70px;
    }
    .pullbox-label {
        width: calc(100% - 70px);
        margin-bottom: 0;
        select {
            width: 100%;
        }
    }
  }
  .mb-10 {
    margin-bottom: 10px;
  }
  .search-btn {
    margin-left: 0.5rem;
    button {
      height:2.3rem;
      width: 4rem;
      padding:0;
      span{
        font-size: 1rem;
      }
    }
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class SelectExaminationItemModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            MasterCodeData:null,
            selected_index:'',
            search_word:'',
            search_type: this.props.from_source === "order-modal" ? 1 :0,
            cur_caret_pos:0,
            selected_exams:[],
            Load:false,
            alert_messages:"",
            examinations:[],
            confirm_examinations:[],
            confirm_message:"",
            is_loaded: true,
            isBackConfirmModal: false
        };
        this.delete_type = null;
        this.change_flag = 0;
    }

    async componentDidMount() {
        let modal_dialog = document.getElementsByClassName("prescript-medicine-select-modal")[0].getElementsByClassName("modal-dialog")[0];
        if(modal_dialog !== undefined && modal_dialog != null){
            modal_dialog.style['max-width'] = '60vw';
        }
        let modal_content = document.getElementsByClassName("prescript-medicine-select-modal")[0].getElementsByClassName("modal-content")[0];
        if(modal_content !== undefined && modal_content != null){
            modal_content.style['width'] = '60vw';
        }
        let path = "/app/api/v2/master/search_examination_order";
        let post_data = {
            name:this.state.search_word,
            name_search_type:this.state.search_type,
        };
        await axios.post(path, {params: post_data}).
        then((res) => {
            let MasterCodeData = res.data;
            let exam_codes = [];
            let confirm_examinations = [];
            if(this.props.sel_exams !== undefined && this.props.sel_exams != null && this.props.sel_exams.length > 0 && MasterCodeData.length > 0){
                if(this.props.type === "category" || this.props.type === "set"){
                    this.props.sel_exams.map(exam=>{
                        exam_codes.push(exam.code);
                    })
                } else {
                    this.props.sel_exams.map(exam=>{
                        exam_codes.push(exam.examination_code);
                    })
                }
                MasterCodeData.map(item=>{
                    if(exam_codes.includes(item.examination_code)){
                        item.is_confirm = 0;
                        confirm_examinations.push(item);
                    }
                })
            }

            let examinations = MasterCodeData.map(item=>{
                item.is_selected = 0;
                return item;
            });

            this.setState({
                confirm_examinations,
                MasterCodeData,
                examinations,
                Load: true,
                is_loaded: false
            });
        })
            .catch(() => {
              this.setState({
                is_loaded: false
              });
            });
    }

    getMasterData = async()  =>{
        let path = "/app/api/v2/master/search_examination_order";
        let post_data = {
            name:this.state.search_word,
            name_search_type:this.state.search_type,
        };
        await axios.post(path, {params: post_data}).
        then((res) => {
            let MasterCodeData = res.data;
            let examinations = MasterCodeData.map(item=>{
                item.is_selected = 0;
                return item;
            });
            this.setState({
                MasterCodeData,
                examinations,
                Load:true,
                is_loaded: false
            });
        })
            .catch(() => {
              this.setState({
                is_loaded: false
              });
            });
    };

    closeModal =()=>{
        var base_modal = document.getElementsByClassName("prescript-medicine-select-modal")[0];
        if(base_modal !== undefined && base_modal != null){
            base_modal.style['z-index'] = 1050;
        }
        this.setState({
            alert_messages: "",
        });
    }

    registerMaster =async(selected_data)=>  {
        var path = '';
        let post_data = {
            outsourcing_inspection_category_id:this.props.category_id,
            outsourcing_inspection_tab_id:this.props.tab_id,
            selected_data,
        };
        path = "/app/api/v2/master/examination/registerExamItem";

        await apiClient.post(path, {params: post_data}).then((res)=>{
            if (res){
                window.sessionStorage.setItem("alert_messages", res.alert_message);
                this.props.selectMaster();
            }
        });
    }

    registerSetMaster =async(selected_data)=>  {
        var path = '';
        let post_data = {
            outsourcing_inspection_set_id:this.props.set_id,
            selected_data,
        };
        path = "/app/api/v2/master/examination/registerExamSetItem";

        await apiClient.post(path, {params: post_data}).then((res)=>{
            if (res){
                window.sessionStorage.setItem("alert_messages", res.alert_message);
                this.props.selectMaster();
            }

        });
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
            this.setState({
              is_loaded: true
            },()=> {
              this.getMasterData();
            });
        }
    };

    selectSearchType = (e) => {
        this.setState({ 
          search_type: parseInt(e.target.value),
          is_loaded: true
        }, ()=>{
            this.getMasterData();
        });
    };

    selectSelExams = (index, value) => {
        let examinations = [...this.state.examinations];
        examinations[index].is_selected = value === 1 ? 0 : 1;
        this.setState({
            examinations,
        })
    };

    selectConfirmExams = (index) => {
        this.change_flag = 1;
        let confirm_examinations = this.state.confirm_examinations;
        confirm_examinations[index].is_confirm = confirm_examinations[index].is_confirm === 0 ? 1 : 0;
        this.setState({
            confirm_examinations,
        })
    };

    confirmDelete=(type)=>{
        if(this.state.confirm_examinations.length === 0){
            return;
        }
        let confirm_message = "選択した項目を削除しますか？";
        if(type != null){
            confirm_message = "選択中の項目を全て削除しますか？"
        }
        let base_modal = document.getElementsByClassName("prescript-medicine-select-modal")[0];
        if(base_modal !== undefined && base_modal != null){
            base_modal.style['z-index'] = 1040;
        }
        this.delete_type = type;
        this.setState({
            confirm_message,
        })
    }

    confirmCancel=()=>{
        let base_modal = document.getElementsByClassName("prescript-medicine-select-modal")[0];
        if(base_modal !== undefined && base_modal != null){
            base_modal.style['z-index'] = 1050;
        }
        this.setState({
            confirm_message:"",
            isBackConfirmModal:false,
        })
    }

    deleteExams = () => {
        this.change_flag = 1;
        let tmp_confirm_examinations = [];
        let tmp_examinations = [];
        let confirm_examinations = this.state.confirm_examinations;
        let examinations = this.state.examinations
        if(this.delete_type == null){
            let delete_exams = [];
            if(confirm_examinations.length > 0){
                confirm_examinations.map(item=>{
                    if(item.is_confirm === 0){
                        tmp_confirm_examinations.push(item);
                    } else {
                        delete_exams.push(item.examination_code);
                    }
                })
            }
            if(delete_exams.length > 0){
                tmp_examinations = examinations.map(item=>{
                    if(delete_exams.includes(item.examination_code)){
                        item.is_selected = 0;
                    }
                    return item;
                })
            }
        } else {
            let delete_exams = [];
            if(confirm_examinations.length > 0){
                confirm_examinations.map(item=>{
                    delete_exams.push(item.examination_code);
                })
            }
            if(delete_exams.length > 0){
                tmp_examinations = examinations.map(item=>{
                    if(delete_exams.includes(item.examination_code)){
                        item.is_selected = 0;
                    }
                    return item;
                })
            } else {
                tmp_examinations = examinations;
            }

        }
        this.setState({
            confirm_examinations:tmp_confirm_examinations,
            examinations:tmp_examinations,
        })
        this.confirmCancel();
    };

    handleOk = () => {
        if (this.state.confirm_examinations.length >0) {
            if(this.props.type != null){
                if(this.props.type === 'category'){
                    this.registerMaster(this.state.confirm_examinations);
                } else {
                    this.registerSetMaster(this.state.confirm_examinations);
                }
            } else {
                this.props.selectMaster(this.state.confirm_examinations);
            }
        } else {
            var base_modal = document.getElementsByClassName("prescript-medicine-select-modal")[0];
            if(base_modal !== undefined && base_modal != null){
                base_modal.style['z-index'] = 1040;
            }
            this.setState({
                alert_messages: "選択されていません。",
            });
        }
    };

    moveConfirmArea=()=>{        
        let confirm_examinations = this.state.confirm_examinations;
        let confirm_examinations_code = [];
        if(confirm_examinations.length > 0){
            confirm_examinations.map(item=>{
                confirm_examinations_code.push(item.examination_code);
            })
        }
        let examinations = this.state.examinations;
        let tmp_codes = [];
        if(examinations.length > 0){
            examinations.map(item=>{
                if(item.is_selected == 1 && !confirm_examinations_code.includes(item.examination_code)){
                  tmp_codes.push(item.examination_code);
                }
            })
        }
        if(tmp_codes.length > 0){
            this.change_flag = 1;
            this.state.MasterCodeData.map(item=>{
                if(tmp_codes.includes(item.examination_code)){
                    item.is_confirm = 0;
                    confirm_examinations.push(item);
                }
            })
        }
        this.setState({
            confirm_examinations,
        });
    }

    handleCloseModal = () => {
      if (this.change_flag == 1) {
        this.setState({
          isBackConfirmModal: true,
          confirm_message:
            "登録していない内容があります。変更内容を破棄して移動しますか？",
        });
      } else {
        this.props.closeModal();
      }      
    }

    handleGetMasterData = () => {
      this.setState({
        is_loaded: true
      }, () => {
        this.getMasterData();
      });
    }

    render() {
        const {examinations, confirm_examinations} = this.state;
        return  (
            <Modal
                show={true}
                id="select_pannel_modal"
                className="custom-modal-sm prescript-medicine-select-modal"
            >
                <Modal.Header>
                    <Modal.Title>{this.props.MasterName}選択パネル</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Wrapper>
                            <div className="left-area" style={{width:"100%"}}>
                                <div className={'flex'} style={{marginBottom:"0.5rem"}}>
                                    <div className={'search-word-label'}>検索文字列</div>
                                    <div className={'search_word'}>
                                        <InputKeyWord
                                            id={'search_input'}
                                            type="text"
                                            label=""
                                            onChange={this.getInputWord.bind(this)}
                                            onKeyPressed={this.onInputKeyPressed}
                                            onClick={this.onClickInputWord}
                                            value={this.state.search_word}
                                        />
                                    </div>
                                    <div className={'search-btn'}>
                                        <Button type="common" onClick={this.handleGetMasterData}>検索</Button>
                                    </div>
                                </div>
                                <div className={'flex'} style={{height:"calc(100% - 3.5rem)"}}>
                                    <div style={{width:"45%", height:"100%"}}>
                                        <div className={'flex'} style={{marginBottom:"0.5rem"}}>
                                            <div className="search-word-label">検索条件</div>
                                            <div className={'flex letter-div-style'}>
                                                <Radiobox
                                                    label={'前方一致検索'}
                                                    value={0}
                                                    getUsage={this.selectSearchType.bind(this)}
                                                    checked={this.state.search_type === 0}
                                                    name={`search_type`}
                                                />
                                                <Radiobox
                                                    label={'部分一致検索'}
                                                    value={1}
                                                    getUsage={this.selectSearchType.bind(this)}
                                                    checked={this.state.search_type === 1}
                                                    name={`search_type`}
                                                />
                                            </div>
                                        </div>
                                        <div className="history-list">
                                            {this.state.is_loaded == true ? (
                                              <div style={{height:'100%',width:'100%', verticalAlign:'middle', textAlign:'center'}}>
                                                <SpinnerWrapper>
                                                  <Spinner animation="border" variant="secondary" />
                                                </SpinnerWrapper>
                                              </div>
                                            ):(
                                              <>
                                                <table className="table-scroll table table-bordered">
                                                  {(examinations != null && examinations.length > 0) && (
                                                      examinations.map((exam,index) => {
                                                          if(exam.is_enabled !== 0){
                                                              return (
                                                                  <>
                                                                      <tr className={(exam.is_selected === 1) ? "selected cursor" : "cursor"}
                                                                          onClick={this.selectSelExams.bind(this,index, exam.is_selected)}>
                                                                          <td>{exam.name.trim()}{exam.can_order_off_hours === 1 ? '※' : ''}</td>
                                                                      </tr>
                                                                  </>)
                                                          }
                                                      })
                                                  )}
                                                </table>                                            
                                                {examinations !== undefined &&
                                                examinations !== null &&
                                                examinations.length < 1 && (
                                                  <div className="no-result"><div><span>条件に一致する結果は見つかりませんでした。</span></div></div>
                                                )}
                                              </>
                                            )}
                                        </div>
                                        <div>※印は夜間・休日に測定可能な項目です。</div>
                                    </div>
                                    <div style={{width:"10%", marginTop:"2.8rem", height:"calc(100% - 90px)"}}>
                                        <div style={{height:"calc(50% - 31px)"}}> </div>
                                        <div className={'move-next'} onClick={this.moveConfirmArea}><div>〉</div></div>
                                    </div>
                                    <div style={{width:"45%", height:"100%"}}>
                                        <div className={'flex btn-area'}>
                                            <Button type="mono" style={{marginRight:"10px"}} onClick={this.confirmDelete.bind(this, null)}>選択削除</Button>
                                            <Button type="mono" onClick={this.confirmDelete.bind(this, "all")}>全削除</Button>
                                        </div>
                                        <div className="history-list">
                                            <table className="table-scroll table table-bordered">
                                                {(confirm_examinations.length > 0) && (
                                                    confirm_examinations.map((confirm_exam,index) => {
                                                        return (
                                                            <>
                                                                <tr className={(confirm_exam.is_confirm === 1) ? "selected cursor" : "cursor"}
                                                                    onClick={this.selectConfirmExams.bind(this,index)}>
                                                                    <td>{confirm_exam.name.trim()}{confirm_exam.can_order_off_hours === 1 ? '※' : ''}</td>
                                                                </tr>
                                                            </>)
                                                    })
                                                )}
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Wrapper>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel-btn" onClick={this.handleCloseModal}>キャンセル</Button>
                    <Button className={this.change_flag == 1 ? "red-btn":"disable-btn"} onClick={this.handleOk} isDisabled={this.change_flag == 0}>確定</Button>                              
                </Modal.Footer>
                {this.state.alert_messages !== "" && (
                    <SystemAlertModal
                        hideModal= {this.closeModal.bind(this)}
                        handleOk= {this.closeModal.bind(this)}
                        showMedicineContent= {this.state.alert_messages}
                    />
                )}
                {this.state.confirm_message !== "" && (
                    <SystemConfirmJapanModal
                        hideConfirm= {this.confirmCancel.bind(this)}
                        confirmCancel= {this.confirmCancel.bind(this)}
                        confirmOk= {this.deleteExams.bind(this)}
                        confirmTitle= {this.state.confirm_message}
                    />
                )}
                {this.state.isBackConfirmModal !== false && (
                  <SystemConfirmJapanModal
                    hideConfirm={this.confirmCancel.bind(this)}
                    confirmCancel={this.confirmCancel.bind(this)}
                    confirmOk={this.props.closeModal}
                    confirmTitle={this.state.confirm_message}
                  />
                )}
            </Modal>
        );
    }
}

SelectExaminationItemModal.defaultProps = {
    type: null,
    category_id: null,
    tab_id: null,
    set_id: null,
};
SelectExaminationItemModal.contextType = Context;

SelectExaminationItemModal.propTypes = {
    closeModal: PropTypes.func,
    selectMaster: PropTypes.func,
    MasterName : PropTypes.string,
    category_id : PropTypes.number,
    tab_id : PropTypes.number,
    set_id : PropTypes.number,
    type: PropTypes.string,
    sel_exams: PropTypes.array,
    from_source: PropTypes.string,
};

export default SelectExaminationItemModal;