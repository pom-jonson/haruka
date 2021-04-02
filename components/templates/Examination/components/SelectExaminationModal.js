import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import ExamRadioButton from "../../..//molecules/ExamRadioButton";
import * as colors from "~/components/_nano/colors";

import styled from "styled-components";
import ExamCategoryNav from "../../../organisms/ExamCategoryNav";
import $ from "jquery";
import * as apiClient from "~/api/apiClient";
import ExamCheckbox from "../../../molecules/ExamCheckbox";
import SelectExaminationSetModal from "./SelectExaminationSetModal";
import Button from "../../../atoms/Button";
import Context from "~/helpers/configureStore";
import { CACHE_SESSIONNAMES } from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import Spinner from "react-bootstrap/Spinner";
// import { Input } from "../../../../style/common";

const TabContent = styled.div`
  display: flex;
  max-width: 100%;
  // width: 649px;
  height: auto;
  padding-top: 8px;
  flex-direction: row;
`;

const ExamRowElement = styled.div`
  font-size: 18px;
  border: 1px solid #888;     
  margin: 0 3px;
  width: 33%;
  border-radius: 5px;
  label{
    margin-bottom: 0px;
    margin-right: 0px;
    text-align: center;
    display: block;
    line-height: 2;
    border-radius: 5px;
    input{
      display: none;
    }
  }  
  .checked{
    background:rgb(207, 226, 243);
  }
`;

const InputBox = styled.div`
  display: flex;
  margin-left: 24px;
  float: left;
  label {
    color: ${colors.onSecondaryDark};
    font-size: 12px;
    line-height: 38px;
    letter-spacing: 0.4px;
    margin-right: 8px;
  }
  input {
    border-radius: 4px;
    border: solid 1px #ced4da;
    background: ${colors.surface};
    color: ${colors.onSecondaryDark};
    font-size: 12px;
    padding: 0 8px;
    width: 120px;
    height: 38px;
  }
  input::-ms-clear {
    visibility: hidden;
  }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export class SelectExaminationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      examinations: [],
      tab: 0, // select examination tab
      exam_tab: 0, // select order tab 
      usageSelectIndex: -1,
      tabs: [],
      preset_name: '',
      is_loaded: false,
      preset: [],
      sel_exams: [],
      order_comment: "",
      free_comment: "",
      datefocus: false,
      can_insurance_edit: false,
      
    };
  }

  async componentDidMount() {
    let examinations, preset;
    await apiClient.get("/app/api/v2/master/examination_order").then((res) => {
      examinations = res;
    });
    await apiClient.get("/app/api/v2/order/examination/preset").then((res) => {
      preset = res;
    });
    
    let tabs = [];
    // let cache = sessApi.getObject(CACHE_SESSIONNAMES.PATIENT_EXAM);
    let exam_tab  = 0;
    let sel_exams  = [];
    let free_comment = "";
    let order_comment = "";
    let number = this.props.number;
    let preset_name = '';
    // if(cache != null) {
    //   exam_tab = cache.is_completed == undefined ? 0 : cache.is_completed;
    //   sel_exams =  cache.examinations == undefined ? [] : cache.examinations;
    //   free_comment = cache.free_comment;
    //   order_comment = cache.order_comment;
    // }
    if (number >= 0){
      sel_exams = preset[number].examinations;
      preset_name = preset[number].name;
      free_comment = preset[number].free_comment !== undefined ? preset[number].free_comment : "";
      order_comment = preset[number].order_comment !== undefined ? preset[number].order_comment : "";
    }

    examinations = examinations.map((items, index)=>{
      let exam = items.examinations.map(item => {
        item.is_selected = false;
        sel_exams.map(exam=>{
          if(item.examination_code == exam.examination_code) {
            item.is_selected = true;
          }
        });
        return item;
      });
      items.examinations = exam;
        tabs.push({
        id: index,
        name: items.tab_name,
        examinations: items.examinations
        });
      
      return items;
    });

    this.setState({ 
      tab: 0,  
      exam_tab,
      tabs: tabs, 
      examinations,
      preset,
      is_loaded: true,
      sel_exams,
      free_comment,
      order_comment,
      preset_name,
    });
  }


  selectUsageKind = e => {
    this.setState({ tab: parseInt(e.target.id), usageSelectIndex: -1 });
    if (
      document.getElementById("prescription_dlg") !== undefined &&
      document.getElementById("prescription_dlg") !== null
    ) {
      document.getElementById("prescription_dlg").focus();
    }
  };

  scrollToelement = () => {
    const els = $(".med-modal [class*=focused]");
    const pa = $(".med-modal .modal-body");
    if (els.length > 0 && pa.length > 0) {
      const scrollTop = 29 * this.state.usageSelectIndex;
      $(pa[0]).scrollTop(scrollTop);
    }
  };

  getRadio = (index, value) => {
    let examinations = this.state.examinations;
    examinations[this.state.tab].examinations[index].is_selected = value;
    this.setState({
      examinations,
    }, () =>{
      this.storeDataInCache();
    })
  }

  getPresetRadio = (e) => {
    const selectPresetData = this.state.preset[parseInt(e.target.id)];
    this.setState({ 
      isExaminationSetPopupOpen: true,
      selectPresetData: selectPresetData
    });
  }

  storeDataInCache = () => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let sel_exams = [];
    this.state.examinations.map(exams=>{
      exams.examinations.map(item=>{
        if(item.is_selected) {
          var trimname = item.name.trim();
          var trimlabel = item.label.trim();
          item.name=trimname;
          item.label = trimlabel;
          sel_exams.push(item);
        }
      });
    });
    this.setState({sel_exams});
    let examOrder = sessApi.getObject(CACHE_SESSIONNAMES.PATIENT_EXAM);
    let isForUpdate = 0;
    let number = 0;
    if (examOrder !== null && examOrder.isForUpdate !== undefined && examOrder.isForUpdate !== null && examOrder.isForUpdate == 1) {
      isForUpdate = 1;
      number = examOrder.number;
    }

    let params = {
      department_code: this.context.department.code == 0 ? 1 : this.context.department.code,
      is_completed: this.state.exam_tab,
      examinations: sel_exams,
      substitute_name:authInfo.name,
      order_comment: this.state.order_comment,
      free_comment: this.state.free_comment,
      isForUpdate: isForUpdate,    
      number: number  
    };
    if(authInfo.staff_category == 1) {
      params.doctor_code = authInfo.doctor_code;
      params.doctor_name =  authInfo.doctor_name;
    } else {
      params.doctor_code = this.context.selectedDoctor.code;
      params.doctor_name =  this.context.selectedDoctor.name;
      params.substitute_name = this.context.selectedDoctor.name;
    }
  }

  closeExaminationSet = () => {
    this.setState({ isExaminationSetPopupOpen: false});
  }

  confirm = (array) => {
    let {examinations} = this.state;
    examinations.forEach(function(item){
      item.examinations.forEach(function(item1){
        array.forEach(function(array_item){
          if(item1.examination_code === array_item.examination_code && array_item.is_selected) {
            item1.is_selected = array_item.is_selected;
          }
        })
      })
    });
    this.setState({ 
      isExaminationSetPopupOpen: false,
      examinations: examinations,
    }, () => {
      this.storeDataInCache();
    });
  }

  handleOk = () => {
    this.storeDataInCache();
    this.context.$setExaminationOrderFlag(1);
    if (this.state.sel_exams === undefined || this.state.sel_exams.length === 0) {
      window.sessionStorage.setItem("alert_messages", "検査項目が選択されていないので確定できません");
      return;
    }
    if (this.state.preset_name === undefined || this.state.preset_name.length === 0) {
      window.sessionStorage.setItem("alert_messages", "セット名が未設定です");
      return;
    }
    this.register();
    this.props.handleOk();
  }

  async register() {
    let path = "/app/api/v2/order/examination/preset/register";
    const post_data = {
      preset_name : this.state.preset_name,
      examinations: this.state.sel_exams,
      order_comment: this.state.order_comment,
      free_comment: this.state.free_comment,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res)
          window.sessionStorage.setItem("alert_messages", res.alert_message);
      })
      .catch((err) => {
        window.sessionStorage.setItem("alert_messages", err);
      });
  }

  delAllItem = () => {
    this.setState({
      sel_exams: []
    }, () =>{
      this.storeDataInCache();
    });
  }

  handleOrderComment = e => {
    this.setState({
      order_comment: e.target.value
    });
  }

  handleFreeComment = e => {
    this.setState({
      free_comment: e.target.value
    });
  }
  changeName = e => {
    this.setState({
      preset_name: e.target.value
    });
  }



  clearOrderComment = () => {
    this.setState({order_comment: ""})
  }

  clearFreeComment = () => {
    this.setState({free_comment: ""})
  }

  render() {
    const count = this.state.sel_exams !== undefined && this.state.sel_exams.length > 0 ? this.state.sel_exams.length : 0;
    const examList = [];
    let examRowList = [];
    let pressetList = [];
    if(this.state.is_loaded && this.state.examinations.length > 0) {
      this.state.examinations[this.state.tab].examinations.map((exam, index) => {       
        if ((index % 3 == 0 && index != 0) || index == (this.state.examinations[this.state.tab].examinations.length - 1)) {
          if (index == (this.state.examinations[this.state.tab].examinations.length - 1)) {
          if (index % 3 == 0) {
            examList.push(
              <TabContent>
                {examRowList}
              </TabContent>
            );
            examRowList = [];
          }
          examRowList.push(
            <ExamRowElement>
              <ExamCheckbox                             
                key={index}
                id={exam.examination_code}
                label={exam.label.trim()}
                title={exam.name.trim()}
                name={index}
                usageType={this.state.tab}
                getRadio={this.getRadio}
                value={exam.is_selected}
              />
            </ExamRowElement>
          );
        }
        examList.push(
          <TabContent>
            {examRowList}
          </TabContent>
        );
        examRowList = [];
      }      
      examRowList.push(
        <ExamRowElement>
          <ExamCheckbox                             
            key={index}
            id={exam.examination_code}
            label={exam.label.trim()}
            title={exam.name.trim()}
            name={index}
            usageType={this.state.tab}
            getRadio={this.getRadio}
            value={exam.is_selected}
          />
        </ExamRowElement>
      );
    });

      
    this.state.preset.map((preset, index) => {
      pressetList.push(
        <>
        <ExamRadioButton
          key={index}
          index={index}
          id={index}
          label={preset.name}
          getUsage={this.getPresetRadio}
          name="deparment"          
          checked={index === this.state.usageSelectIndex}
        />        
        </>
      );
    });

    }

    return (
      <Modal
        show={true}        
        onKeyDown={this.onKeyPressed}
        tabIndex="0"
        id="prescription_dlg"
        className="custom-modal-sm exa-modal"
      >
        <Modal.Header>
          <Modal.Title>
            <span>検査セット登録編集</span>
          </Modal.Title>
        </Modal.Header>
        {this.state.is_loaded ? (
        <>
        <Modal.Body>
          <div className="data-input">
            <div className="collect">
              <InputBox>
                <label>セットの名</label>
                <input type="text" value={this.state.preset_name} onChange={this.changeName}/>
              </InputBox>
            </div>
          </div>
          <div className="btn-group">
            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick="">外注：生化学</Button>
            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick="">外注：アイソザイム</Button>
            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick="">外注：内分泌</Button>
            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick="">外注：腫瘍マーカー</Button>
            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick="">外注：血漿蛋白</Button>
            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick="">外注：アレルギー</Button>
            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick="">外注：免疫血液</Button>
            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick="">外注：自己抗体</Button>
            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick="">外注：感染症（肝炎）</Button>
            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick="">外注：感染症（その他）</Button>
            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick="">外注：薬剤血中濃度</Button>
            <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick="">外注：一般検査</Button>
            <Button type="mono" className={this.state.curFocus === 1?"focus search-btn": "search-btn"} onClick="">項目検索</Button>

          </div>
          <div className="preset">
            <div className="preset-title">検査セット</div>
            <div className="preset-content">{pressetList}</div>
          </div>
          <div className="categoryContent">
            <ExamCategoryNav
              selectUsageKind={this.selectUsageKind}
              id={this.state.tab}
              diagnosis={this.state.tabs}
            />
            <div className="categoryName">
              <span className="">{this.state.examinations[this.state.tab].tab_name}</span>
            </div>
            <div className="exam-list">
            {examList}
          </div>
          </div>
          <div className="selected-exam">
            <div className="del-btn-group">
              <div className="selected-count">選択中の検査項目数 {count}</div>
              <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick={this.delSelectedItem}>選択削除</Button>
              <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick={this.delAllItem}>全削除</Button>
              <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick={this.delDuplicateItem}>重複削除</Button>
            </div>
            <div className="selected-items">
              <div className="table-header">
                <span className="exam-name">項目名称</span>
                <span className="exam-material">材料</span>
              </div>
              {/* <div className='table-content'> */}
                {this.state.sel_exams !== undefined && this.state.sel_exams !== null && this.state.sel_exams.length > 0 ? (
                  this.state.sel_exams.map(exam => {
                    return (
                      <>
                      <div>
                        <span className="exam-name">{exam.name.trim()}</span>
                        <span className="exam-material">&nbsp;</span>
                      </div>
                      </>
                    )
                  })
                ) : (
                  <div className="no-select">選択された項目がありません。</div>
                )}
              {/* </div> */}
            </div>
            <div className="comment">
              <div className="order-comment">
                <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick="">依頼コメント</Button>
                <input
                  type="text"
                  value={this.state.order_comment }
                  // onKeyPress={this.handleUssageConfirmComment}
                  onChange={this.handleOrderComment}
                /> 
                <Button type="mono" className={this.state.curFocus === 1?"focus clear": "clear"} onClick={this.clearOrderComment}>C</Button>
              </div>
              <div className="free-comment">
                <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick="">フリーコメント</Button>
                <textarea
                  value={this.state.free_comment }
                  // onKeyPress={this.handleUssageConfirmComment}
                  onChange={this.handleFreeComment}
                /> 
              <Button type="mono" className={this.state.curFocus === 1?"focus clear": "clear"} onClick={this.clearFreeComment}>C</Button>
              </div>
            </div>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <Button type="mono" className={this.state.curFocus === 1?"focus": ""} onClick={this.props.closeExamination}>キャンセル</Button>
          <Button id="btnOk" className={this.state.curFocus === 0?"focus": ""} onClick={this.handleOk}>確定</Button>
        </Modal.Footer>
        </>
            ) : (
            <>
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            </>
            )}
        {this.state.isExaminationSetPopupOpen && (
          <SelectExaminationSetModal
            closeExaminationSet={this.closeExaminationSet}
            preset={this.state.selectPresetData}
            handleOk={this.confirm}
          />
        )}
        
      </Modal>
      
    );
  }
}
SelectExaminationModal.contextType = Context;
SelectExaminationModal.propTypes = {
  selectDoctorFromModal: PropTypes.func,
  closeExamination: PropTypes.func,
  examinations: PropTypes.array,
  preset: PropTypes.array,
  handleOk: PropTypes.func,
  number: PropTypes.number
};

export default SelectExaminationModal;
