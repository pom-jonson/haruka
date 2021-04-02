import React, { Component } from "react";
import { Modal} from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import {makeList_codeID} from "~/helpers/dialConstants";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import * as sessApi from "~/helpers/cacheSession-utils";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { dialOtherValidate } from '~/helpers/validate'
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";

const Wrapper = styled.div`
    width: 100%;
    .flex{
        display:flex;
    }
    .content-body{
        overflow-x:hidden;
        overflow-y:auto;
        max-height:46rem;
        width: 100%;
    }
    .comment-area{
        justify-content: space-between;
    }    
    
    .blog{
        border: 1px solid;
        padding-left: 1.25rem;
        padding-right: 1.25rem;
        margin-bottom: 4px;

        .label-title{
            display:none;
        }
        input{
            height:25px;
        }
        textarea{
            margin-top:6px;
        }        
    }

    .area{
        margin-bottom: 2rem;
        .label-title{
            text-align: right;
            font-size: 1rem;
            margin-top: 0px;
            margin-right:10px;
            line-height: 38px;
        }
        .unit{
            margin-top: 10px;
            padding-left: 8px;
            line-height: 38px;
        }
    }

    .pullbox-label, .pullbox-select{
        width:12.5rem;
    }

    .sub-title{
        border-bottom: 1px solid;
    }
    .left-area {
        width: calc(100% - 30rem);
    }
    .right-area {
        width: 30rem;
        padding: 0 0.5rem;
    }
 `;

class GuidelineCriteriaModalTSAT extends Component {
  constructor(props) {
    super(props);

    var comment = new Array(9);
    var note = new Array(9);
    for (var i = 0; i <9;i++){
        note[i] = '';
        comment[i] = new Array(5);
        for(var j=0;j<5;j++){            
            comment[i][j]='';
        }
    }

    var inspection_master = sessApi.getObjectValue('dial_common_master',"inspection_master");
    
    let code = {
        "tsat":"1",
        "ferr" :"24",
        "alb":"10",
        "fe":"20"
    }

    this.state = {
        comment:this.props.comment != undefined && this.props.comment != null?this.props.comment:comment,
        note:this.props.note != undefined && this.props.note != null?this.props.note:note,
        TSAT_low:this.props.TSAT_low != undefined && this.props.TSAT_low != null?this.props.TSAT_low:'',
        TSAT_high:this.props.TSAT_high != undefined && this.props.TSAT_high != null?this.props.TSAT_high:'',
        FERR_low:this.props.FERR_low != undefined && this.props.FERR_low != null?this.props.FERR_low:'',
        FERR_high:this.props.FERR_high != undefined && this.props.FERR_high != null?this.props.FERR_high:'',
        code:this.props.code != undefined && this.props.code != null?this.props.code:code,

        ExamMasterList:inspection_master != undefined && inspection_master.length>0? makeList_codeID(inspection_master):[],
        isCloseConfirmModal:false,
        isSaveConfirmModal:false,
        confirm_message:'',
        confirm_alert_title:'',
        check_message:"",
    }
    this.change_flag = false;
  }

  async componentDidMount() {
    this.changeBackground();
  }

  componentDidUpdate () {
    this.changeBackground();
  }

  changeBackground = () => {
    dialOtherValidate("guideline_tsat", this.state, "background");
  }
  
  getComment = (section_no, item_no, e) => {
    var temp = this.state.comment;
    temp[section_no-1][item_no-1] = e.target.value;
    this.setState({comment:temp});
    this.change_flag = true;
  }

  getNote = (section_no, e) => {
    var temp = this.state.note;
    temp[section_no-1] = e.target.value;
    this.setState({note:temp});
    this.change_flag = true;
  }

  getPLow = (e)=>{
    this.setState({
        TSAT_low:e.target.value
    })
    this.change_flag = true;
  }

  getPHigh = (e)=>{
    this.setState({
        TSAT_high:e.target.value
    })
    this.change_flag = true;
  }

  getCaLow = (e)=>{
    this.setState({
        FERR_low:e.target.value
    })
    this.change_flag = true;
  }

  getCaHigh = (e)=>{
    this.setState({
        FERR_high:e.target.value
    })
    this.change_flag = true;
  }

  save = () =>{
    if (this.change_flag == false) return;
    let validate_data = dialOtherValidate("guideline_tsat", this.state);
    if (validate_data['error_str_arr'].length > 0 ) {
        this.setState({
          check_message:validate_data['error_str_arr'].join('\n'),
          first_tag_id:validate_data['first_tag_id']
        });
        return;
    }
    this.setState({
      isSaveConfirmModal:true,
      confirm_message:'登録しますか？'
    })
  }

  closeAlertModal = () => {
    this.setState({check_message: ''});
    $("#" + this.state.first_tag_id).focus();
  }

  handleOk = async() => {
    this.confirmCancel();
    let path = "/app/api/v2/dial/medicine_information/Guide/registerCriteria";
    let post_data = {
        'comment':this.state.comment,
        'note':this.state.note,
        'code':this.state.code,
        'TSAT_low':this.state.TSAT_low,
        'TSAT_high':this.state.TSAT_high,
        'FERR_low':this.state.FERR_low,
        'FERR_high':this.state.FERR_high,
    }
    await apiClient.post(path, {params:post_data});
    window.sessionStorage.setItem("alert_messages","登録完了##登録しました。");
    this.change_flag = false;
    this.props.handleOk();
  }

  getSelectCodeMaster = (name, e) => {      
      var temp = this.state.code;
      switch (name){
          case 'tsat':
             temp['tsat'] = e.target.id;
              break;
          case 'ferr':
            temp['ferr'] = e.target.id;
              break;
          case 'alb':
            temp['alb'] = e.target.id;
              break;
          case 'fe':
            temp['fe'] = e.target.id;
              break;
      }
      this.setState({code:temp});
      this.change_flag = true;
  }

  confirmCancel = () => {
    this.setState({
      confirm_message:'',
      isCloseConfirmModal:false,
      isSaveConfirmModal:false,
      confirm_alert_title:''
    })
  }

  close = () => {
    if (this.change_flag){
      this.setState({
        isCloseConfirmModal:true,
        confirm_message:'登録していない内容があります。\n変更を破棄して移動しますか？',
        confirm_alert_title:'入力中',
      })
    } else {
      this.closeModal();
    }
  }

  closeModal = () => {
    this.change_flag = false;
    this.confirmCancel();
    this.props.closeModal();
  }
  
  onHide=()=>{}

  render() {    
    let {ExamMasterList, code} = this.state;
    return  (
      <Modal show={true} onHide={this.onHide} id="add_contact_dlg"  className="master-modal edit-injection-modal first-view-modal">
        <Modal.Header>
          <Modal.Title>基準値設定</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Wrapper>
              <div className="flex content-body">
                <div className="left-area">
                    <div className = "flex comment-area">
                        <div className="blog">
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,7, 1)}
                                value={this.state.comment[6][0]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,7, 2)}
                                value={this.state.comment[6][1]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,7, 3)}
                                value={this.state.comment[6][2]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,7, 4)}
                                value={this.state.comment[6][3]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,7, 5)}
                                value={this.state.comment[6][4]}
                            />
                            <textarea onChange={this.getNote.bind(this, 7)} value = {this.state.note[6]}></textarea>
                        </div>
                        <div className="blog">
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,4, 1)}
                                value={this.state.comment[3][0]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,4, 2)}
                                value={this.state.comment[3][1]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,4, 3)}
                                value={this.state.comment[3][2]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,4, 4)}
                                value={this.state.comment[3][3]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,4, 5)}
                                value={this.state.comment[3][4]}
                            />
                            <textarea onChange={this.getNote.bind(this, 4)} value = {this.state.note[3]}></textarea>
                        </div>
                        <div className="blog">
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,1, 1)}
                                value={this.state.comment[0][0]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,1, 2)}
                                value={this.state.comment[0][1]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,1, 3)}
                                value={this.state.comment[0][2]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,1, 4)}
                                value={this.state.comment[0][3]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,1, 5)}
                                value={this.state.comment[0][4]}
                            />
                            <textarea onChange={this.getNote.bind(this, 1)} value = {this.state.note[0]}></textarea>
                        </div>
                    </div>
                    <div className = "flex comment-area">
                        <div className="blog">
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,8, 1)}
                                value={this.state.comment[7][0]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,8, 2)}
                                value={this.state.comment[7][1]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,8, 3)}
                                value={this.state.comment[7][2]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,8, 4)}
                                value={this.state.comment[7][3]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,8, 5)}
                                value={this.state.comment[7][4]}
                            />
                            <textarea onChange={this.getNote.bind(this, 8)} value = {this.state.note[7]}></textarea>
                        </div>
                        <div className="blog">
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,5, 1)}
                                value={this.state.comment[4][0]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,5, 2)}
                                value={this.state.comment[4][1]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,5, 3)}
                                value={this.state.comment[4][2]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,5, 4)}
                                value={this.state.comment[4][3]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,5, 5)}
                                value={this.state.comment[4][4]}
                            />
                            <textarea onChange={this.getNote.bind(this, 5)} value = {this.state.note[4]}></textarea>
                        </div>
                        <div className="blog">
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,2, 1)}
                                value={this.state.comment[1][0]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,2, 2)}
                                value={this.state.comment[1][1]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,2, 3)}
                                value={this.state.comment[1][2]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,2, 4)}
                                value={this.state.comment[1][3]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,2, 5)}
                                value={this.state.comment[1][4]}
                            />
                            <textarea onChange={this.getNote.bind(this, 2)} value = {this.state.note[1]}></textarea>
                        </div>
                    </div>
                    <div className = "flex comment-area">
                        <div className="blog">
                        <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,9, 1)}
                                value={this.state.comment[8][0]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,9, 2)}
                                value={this.state.comment[8][1]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,9, 3)}
                                value={this.state.comment[8][2]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,9, 4)}
                                value={this.state.comment[8][3]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,9, 5)}
                                value={this.state.comment[8][4]}
                            />
                            <textarea onChange={this.getNote.bind(this, 9)} value = {this.state.note[8]}></textarea>
                        </div>
                        <div className="blog">
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,6, 1)}
                                value={this.state.comment[5][0]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,6, 2)}
                                value={this.state.comment[5][1]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,6, 3)}
                                value={this.state.comment[5][2]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,6, 4)}
                                value={this.state.comment[5][3]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,6, 5)}
                                value={this.state.comment[5][4]}
                            />
                            <textarea onChange={this.getNote.bind(this, 6)} value = {this.state.note[5]}></textarea>
                        </div>
                        <div className="blog">
                        <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,3, 1)}
                                value={this.state.comment[2][0]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,3, 2)}
                                value={this.state.comment[2][1]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,3, 3)}
                                value={this.state.comment[2][2]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,3, 4)}
                                value={this.state.comment[2][3]}
                            />
                            <InputBoxTag
                                label=""
                                type="text"
                                getInputText={this.getComment.bind(this,3, 5)}
                                value={this.state.comment[2][4]}
                            />
                            <textarea onChange={this.getNote.bind(this, 3)} value = {this.state.note[2]}></textarea>
                        </div>                        
                    </div>
                </div>
                <div className="right-area">
                    <div className="items_area area">
                        <div className="sub-title">検査項目コードの設定</div>
                        <SelectorWithLabel
                            options={ExamMasterList}
                            title="フェリチン"
                            getSelect={this.getSelectCodeMaster.bind(this, 'ferr')}
                            departmentEditCode={code['ferr']}
                        />
                        <SelectorWithLabel
                            options={ExamMasterList}
                            title="TSAT"
                            getSelect={this.getSelectCodeMaster.bind(this, 'tsat')}
                            departmentEditCode={code['tsat']}
                        />
                        <SelectorWithLabel
                            options={ExamMasterList}
                            title="アルブミン"
                            getSelect={this.getSelectCodeMaster.bind(this, 'alb')}
                            departmentEditCode={code['alb']}
                        />
                        <SelectorWithLabel
                            options={ExamMasterList}
                            title="鉄"
                            getSelect={this.getSelectCodeMaster.bind(this, 'fe')}
                            departmentEditCode={code['fe']}
                        />
                    </div>
                    <div className="P_area area">
                        <div className="sub-title">TSAT</div>
                        <div className="flex">
                            <InputBoxTag
                                label="≦"
                                type="number"
                                id='TSAT_low_id'
                                getInputText={this.getPLow.bind(this)}
                                value={this.state.TSAT_low}
                            />
                            <div className="unit">mg/dL</div>
                        </div>
                        <div className="flex">
                            <InputBoxTag
                                label="≦"
                                type="number"
                                getInputText={this.getPHigh.bind(this)}
                                value={this.state.TSAT_high}
                            />
                            <div className="unit">mg/dL</div>
                        </div>                        
                    </div>
                    <div className="Ca_area area">
                        <div className="sub-title">フェリチン</div>
                        <div className="flex">
                            <InputBoxTag
                                label="≦"
                                type="number"
                                id='FERR_low_id'
                                getInputText={this.getCaLow.bind(this)}
                                value={this.state.FERR_low}
                            />
                            <div className="unit">mg/dL</div>
                        </div>
                        <div className="flex">
                            <InputBoxTag
                                label="≦"
                                type="number"
                                getInputText={this.getCaHigh.bind(this)}
                                value={this.state.FERR_high}
                            />
                            <div className="unit">mg/dL</div>
                        </div>                        
                    </div>
                </div>
              </div>
            </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.close}>キャンセル</Button>
            <Button className={this.change_flag?'red-btn':'disable-btn'} onClick={this.save}>登録</Button>
        </Modal.Footer>   
        {this.state.isCloseConfirmModal !== false && (
          <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.closeModal.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.isSaveConfirmModal !== false && (
          <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.handleOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.check_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.check_message}
          />
        )}  
      </Modal>
    );
  }
}

GuidelineCriteriaModalTSAT.contextType = Context;

GuidelineCriteriaModalTSAT.propTypes = {    
    closeModal: PropTypes.func,
    handleOk: PropTypes.func,
    note : PropTypes.array,
    comment : PropTypes.array,
    TSAT_low : PropTypes.number,
    TSAT_high : PropTypes.number,
    FERR_low : PropTypes.number,
    FERR_high : PropTypes.number,
    code : PropTypes.object,
    
};

export default GuidelineCriteriaModalTSAT;
