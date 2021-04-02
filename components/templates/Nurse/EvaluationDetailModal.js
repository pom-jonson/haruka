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
  import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
  import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
  import { makeList_data } from "~/helpers/dialConstants";
  import {
    formatDateTimeIE,
    formatJapanDate,
    // formatDateLine, 
    // formatDateSlash
  } from "~/helpers/date";
  import Button from "~/components/atoms/Button";  
  import SystemAlertModal from "~/components/molecules/SystemAlertModal";
  import {
    addRedBorder,
    // addRequiredBg,
    // removeRequiredBg,
    removeRedBorder
  } from '~/helpers/dialConstants'
  // import DatePicker, { registerLocale } from "react-datepicker";
  // import ja from "date-fns/locale/ja";  
  // registerLocale("ja", ja);
  import ValidateAlertModal from '~/components/molecules/ValidateAlertModal'
  
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
    .content-height-style{
      height: 32px;
      line-height: 32px;
    }
    .register-label{
      div:first-child{
        margin-top: 0px;
      }
      input{
        height: 32px;
        line-height: 32px;
        border: 1px solid #aaa;
      }
    }
    textarea{
      border-color: #aaa;
    }
    .one-row{
      display:flex;
      margin-top:10px;
      margin-bottom:10px;
      .label-title{
        width:100px;
        text-align:left;
        height: 32px;
        line-height: 32px;
        font-size:1.2rem;
      }
      .label-content{
        border:1px solid #aaa;
        width:12rem;
        .label-title{
          display:none;
        }
        .react-datepicker-wrapper, .react-datepicker__input-container{
          width:100%;
          margin-top:0px;
        }
        input{
          width:100%;
          border:none
        }
        label{
          margin-bottom:0px;
        }
        .pullbox{
          width:100%;
        }
        .pullbox-select{
          height: 32px;
          line-height: 32px;
          border: 1px solid #aaa;
        }
        .pullbox-select, .pullbox-label{
          width:100%;         
        }
      }
      .label-big-content{
        width:500px;
        textarea{
          width:100%;
        }
      }
      .nurse_plan_area{
        border: 1px solid #aaa;
        height: 4rem;
      }
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
  
  class EvaluationDetailModal extends Component {
    constructor(props) {
      super(props);    
      let nurse_plan_item = this.props.nurse_plan_item;      
      this.state = {        
        departmentCode:1,        
        number:0,
        select_category_code:0,
        // item_info: this.props.item_info,
        created_at : nurse_plan_item.created_at!='0000-00-00:00:00:00' && nurse_plan_item.created_at != undefined && nurse_plan_item.created_at != null
          ? formatDateTimeIE(nurse_plan_item.created_at) : new Date(),
        evaluation_class_date : nurse_plan_item.evaluation_class_date!='0000-00-00:00:00:00' && nurse_plan_item.evaluation_class_date != undefined
         && nurse_plan_item.evaluation_class_date != null ? formatDateTimeIE(nurse_plan_item.evaluation_class_date) : null,
        next_evaluate_date : nurse_plan_item.next_evaluate_date!='0000-00-00:00:00:00' && nurse_plan_item.next_evaluate_date != undefined
         && nurse_plan_item.next_evaluate_date != null ? formatDateTimeIE(nurse_plan_item.next_evaluate_date) : null,
        nurse_plan_item,
        evaluation:nurse_plan_item.evaluation_class_id,
        alert_messages:'',
        validate_alert_message:''
      }
      this.change_flag = false;
      this.categoryOptions = [
        {id:0, value:''},
    ];
      this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }  
    componentDidMount(){
      this.getEvaluationMasters();
    }

    getEvaluationMasters = async() => {
      let path = "/app/api/v2/master/nurse/evaluation_master_search";
      let post_data = {};      
      await apiClient.post(path, post_data)
      .then((res) => {        
        this.setState({
          evaluation_class_master_options:makeList_data(res, 1),
        })
      });
    }

    // contextMenuAction = (act, index, kind) => {
    contextMenuAction = (act) => {      
      switch(act){
        case 'add':
          break;
        case 'edit':
          break;
        case 'delete':
          break;
        case 'sort':          
          break;
      }
    };

    closeModal = () => {
      this.setState({alert_messages:'', validate_alert_message:''});
    }

    getRegisterDate = (e) => {
      this.setState({
        created_at:e
      })
    }

    getEvaluateDate = (e) => {
      this.change_flag = true;
      let nurse_plan_item = this.state.nurse_plan_item;
      nurse_plan_item.evaluation_class_date = e;
      this.setState({
        evaluation_class_date:e,
        nurse_plan_item,
      })
    }

    getNextEvaluateDate = (e) => {
      this.change_flag = true;
      let nurse_plan_item = this.state.nurse_plan_item;
      nurse_plan_item.next_evaluate_date = e;
      this.setState({
        next_evaluate_date:e,
        nurse_plan_item,
      })
    }

    getEvaluation = (e) => {
      this.change_flag = true;
      let nurse_plan_item = this.state.nurse_plan_item;
      nurse_plan_item.evaluation_class_id = parseInt(e.target.id);
      nurse_plan_item.evaluation_name = e.target.value;
      this.setState({
        evaluation:e.target.id,
        nurse_plan_item
      })
    }

    getComment = (e) => {
      this.change_flag = true;
      let nurse_plan_item = this.state.nurse_plan_item;
      nurse_plan_item.comment = e.target.value;      
      this.setState({
        nurse_plan_item
      })
      // this.setState({comment:e.target.value})
    }

    initRedBorder() {
      removeRedBorder('evaluation_class_date_id');
      removeRedBorder('next_evaluate_date_id');
      removeRedBorder('evaluation_id');
    }

    checkValidation = () => {
      this.initRedBorder();
      let error_str_arr = [];
      var now = 0;
      var next = 0;
      if (this.state.evaluation_class_date == undefined || this.state.evaluation_class_date == null || this.state.evaluation_class_date == ''){
        error_str_arr.push("評価日を入力してください");
        addRedBorder('evaluation_class_date_id');
      } else {
        now = new Date(this.state.evaluation_class_date).getTime();
      }

      if (this.state.next_evaluate_date == undefined || this.state.next_evaluate_date == null || this.state.next_evaluate_date == ''){
        error_str_arr.push("次回評価日を入力してください");
        addRedBorder('next_evaluate_date_id');
      } else {
        next = new Date(this.state.next_evaluate_date).getTime();
      }

      if (!(this.state.evaluation > 0)){
        error_str_arr.push("評価を選択してください");
        addRedBorder('evaluation_id');
      }

      if (now > 0 && next > 0 && now > next ){
        error_str_arr.push("評価日と次回評価日を正しく入力してください");
        addRedBorder('evaluation_class_date_id');
        addRedBorder('next_evaluate_date_id');
      }

      return error_str_arr;
    }

    confirmOk = () => {
      if (this.change_flag != true) return;
      let error_str_array = this.checkValidation();
      if (error_str_array.length > 0) {
        this.setState({ validate_alert_message: error_str_array.join('\n') })
        return
      }
      this.props.confirmPlanOk(this.state.nurse_plan_item, this.props.item_type);
    }
  
    render() {
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));      
      return (
        <>
          <Modal
            show={true}          
            id="outpatient"
            className="custom-modal-sm notice-modal first-view-modal"
          >
            <Modal.Header>
                <Modal.Title style={{width:'20rem'}}>詳細編集</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Popup>
                <div className='one-row'>
                  <div className='label-title'>登録日</div>
                  <div className='label-content register-label' style={{width:"10rem", paddingTop:'0.5rem', paddingLeft:'0.5rem'}}>
                    {formatJapanDate(formatDateTimeIE(this.state.created_at))}
                    {/* <InputWithLabelBorder
                      label=""
                      type="date"                        
                      getInputText={this.getRegisterDate.bind(this)}
                      diseaseEditData={this.state.created_at}
                    /> */}
                  </div>
                  <div className='label-title' style={{marginLeft:"1rem"}}>登録者</div>
                  <div className='label-content content-height-style'>
                    {this.state.nurse_plan_item.creater_name != undefined && this.state.nurse_plan_item.creater_name != null && this.state.nurse_plan_item.creater_name != ''?this.state.nurse_plan_item.creater_name:authInfo.name}
                  </div>
                </div>
                {/* <div className='one-row'>
                  <div className='label-title'>最終更新日</div>
                  <div className='label-content content-height-style' style={{width:"10rem"}}>
                    
                  </div>
                  <div className='label-title' style={{marginLeft:"1rem"}}>最終更新者</div>
                  <div className='label-content content-height-style'></div>
                </div> */}
                <div className='one-row'>
                  <div className='label-title'>評価</div>
                  <div className='label-content register-label' style={{border:"none"}}>
                    <SelectorWithLabel
                      title=""
                      options={this.state.evaluation_class_master_options}
                      value={this.state.nurse_plan_item.evaluation_name}
                      getSelect={this.getEvaluation}
                      departmentEditCode={this.state.evaluation}
                      id = {'evaluation_id'}
                    />
                  </div>
                </div>
                <div className='one-row'>
                  <div className='label-title'>評価日</div>
                  <div className='label-content register-label' style={{width:"10rem"}}>
                    <InputWithLabelBorder
                      label=""
                      type="date"                        
                      getInputText={this.getEvaluateDate.bind(this)}
                      diseaseEditData={this.state.evaluation_class_date}
                      id = {'evaluation_class_date_id'}
                    />
                  </div>                  
                </div>
                <div className='one-row'>
                  <div className='label-title'>次回評価日</div>
                  <div className='label-content register-label' style={{width:"10rem"}}>
                    <InputWithLabelBorder
                      label=""
                      type="date"                        
                      getInputText={this.getNextEvaluateDate.bind(this)}
                      diseaseEditData={this.state.next_evaluate_date}
                      id = {'next_evaluate_date_id'}
                    />
                  </div>
                </div>
                <div className='one-row'>
                  <div className='label-title'>{this.state.nurse_plan_item.plan_class_name}</div>
                  <div className='label-big-content nurse_plan_area content-height-style'>
                    {this.state.nurse_plan_item.name}
                  </div>
                </div>
                <div className='one-row'>
                  <div className='label-title'>コメント</div>
                  <div className='label-big-content'>
                    <textarea onChange = {this.getComment.bind(this)} value = {this.state.nurse_plan_item.comment}></textarea>
                  </div>                  
                </div>
              </Popup>
            </Modal.Body>
            <Modal.Footer>
                <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
                <Button className={this.change_flag == true?"red-btn":'disable-btn'} onClick={this.confirmOk}>確定</Button>
            </Modal.Footer>
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
            />            
          </Modal>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.validate_alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeModal}
              alert_meassage={this.state.validate_alert_message}
            />
          )}
        </>
      );
    }
  }
  EvaluationDetailModal.contextType = Context;
  
  EvaluationDetailModal.propTypes = {  
    handleOk :  PropTypes.func,
    closeModal: PropTypes.func,
    confirmPlanOk: PropTypes.func,
    patientId: PropTypes.number, 
    modal_data : PropTypes.object,
    nurse_plan_item: PropTypes.object,
    item_type: PropTypes.string,
    // item_info: PropTypes.object,
  };
  
  export default EvaluationDetailModal;
  