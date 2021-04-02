import React, {Component} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "~/components/_nano/colors";
import { Modal } from "react-bootstrap";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
import $ from "jquery";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import MaterialModal from "~/components/templates/MasterMaintenance/Bacillus/MaterialModal";
import PatientStateModal from "~/components/templates/MasterMaintenance/Bacillus/PatientStateModal";
import TargetBacillusModal from "~/components/templates/MasterMaintenance/Bacillus/TargetBacillusModal";
import AntiMedicineModal from "~/components/templates/MasterMaintenance/Bacillus/AntiMedicineModal";
import {formatDateLine, formatTimeIE, formatTimePicker} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import { harukaValidate } from "~/helpers/haruka_validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import {removeRedBorder,setDateColorClassName} from '~/helpers/dialConstants';
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Popup = styled.div`
    .flex {
      display: flex;
      margin-bottom:5px;
    }
    height: 96%;
  
    h2 {
      color: ${colors.onSurface};
      font-size: 17px;
      font-weight: 500;
      margin: 6px 0;
    }
    .case {
      select{
        width: 600px;
      }
    }
    button{
        margin-bottom:5px;
        margin-top:5px;
    }
    
    .disease-header{
      .department-status{
        .pullbox-title{
          font-size: 16px;
        }
      }
      padding-left:15px;
      overflow: hidden;
      display:flex;
      margin-bottom:1rem;
      button{
          margin-left:10px;
          margin-top:-1px;
          font-size:0.9rem;
      }
      input{
          margin-right:15px;
      }
      .label-title{
        width:5rem;
      }
      .collect-date{
        width: 6rem;
      }
      .collect-time{
        width:3.3rem;
      }
    }
    
    .label-title {
      float: left;
      width: 10rem;
      font-size: 1.2rem;
      margin-top: 0;
      margin-right:10px;
      &.pullbox-title {
        margin-right: 0.5rem;
      }
      button{
        font-size:1.1rem;
        margin-top:0px;
        margin-bottom:0px;
      }
    }

    .label-content{
      width: calc(100% - 10rem);
      border:1px solid lightgray;
    }

    .selected{
      background: lightblue;
    }

    .clickable{
      cursor:pointer;
    }
    
    .list{
        width:100%;
        overflow-y:auto;
        border:1px solid lightgray;
    }

    .state-list{
        min-height:100px;
    }
    .inspection-item-list{
        width:calc(100%- 5.5rem);
        min-height:130px;
        margin-left:15px;
    }
    .left-area, .right-area{
        width:48%;
        padding-left:15px;
        padding-right:15px;
        button{
            width:100%;
        }
    }
    .right-border{
        border-right:3px solid;
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

class BacillusInspection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentCode:1,
      number:0,
      height_weight:[],
      isOpenMaterialModal:false,
      isOpenAntiMedicineModal:false,
      isOpenPatientStateModal:false,
      isOpenTargetBacillusModal:false,
      isUpdateConfirmModal:false,
      confirm_message:'',
      alert_message:'',
    }
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
  }
  
  componentDidMount = async() => {
    let path = "/app/api/v2/patients/basic_data/search";
    let post_data = {
      system_patient_id: this.props.patientId,
      measure_date: formatDateLine(new Date()),
      limit:1
    };
    var number = 0;
    var isForUpdate = 0;
    var done_order = 0;
    var created_at = '';
    var collected_date = undefined;
    var collected_time = undefined;
    var gather_part = undefined;
    var gather_part_name = undefined;
    var material = undefined;
    var material_name = undefined;
    var detail_part = undefined;
    var detail_part_name = undefined;
    var inspection_target = undefined;
    var inspection_target_name = undefined;
    var inspection_item = undefined;
    
    var free_comment = undefined;
    var basic_disease = undefined;
    var basic_disease_name = undefined;
    var travel_history = undefined;
    var travel_history_name = undefined;
    var infectious = undefined;
    var infectious_name = undefined;
    var request_comment = undefined;
    var target_bacillus = undefined;
    var anti_data = undefined;
    var height = undefined;
    var weight = undefined;
    
    await apiClient.post(path, {
      params: post_data
    }).then((res) => {
      if (res.height_weight != undefined && res.height_weight != null && res.height_weight.length > 0){
        height = res.height_weight[0].height;
        weight = res.height_weight[0].weight;
        this.setState({
          height_weight:res.height_weight[0],
          height,
          weight,
        })
      }
    })
    if (this.props.cache_index != null) {
      var cache_data = karteApi.getSubVal(this.props.patientId, CACHE_LOCALNAMES.BACILLUS_EDIT, this.props.cache_index);
      number = cache_data['number'];
      isForUpdate = number > 0 ? 1 : 0;
      done_order = cache_data['done_order'];
      created_at = cache_data['created_at'];
      
      collected_date = new Date(cache_data['collected_date']);
      collected_time = formatTimePicker(cache_data['collected_time']);
      gather_part = cache_data['gather_part'];
      gather_part_name = gather_part != undefined && gather_part != null && gather_part != ''?gather_part.name:'';
      material = cache_data['material'];
      material_name = material != undefined && material != null && material != ''?material.name:'';
      detail_part = cache_data['detail_part'];
      detail_part_name = detail_part != undefined && detail_part != null && detail_part != ''?detail_part.name:'';
      inspection_target = cache_data['inspection_target'];
      inspection_target_name = inspection_target != undefined && inspection_target != null && inspection_target != ''?inspection_target.name:'';
      inspection_item = cache_data['inspection_item'];
      free_comment = cache_data['free_comment'];
      basic_disease = cache_data['basic_disease'];
      basic_disease_name = basic_disease != undefined && basic_disease != null && basic_disease != ''?basic_disease.name:'';
      travel_history = cache_data['travel_history'];
      travel_history_name = travel_history != undefined && travel_history != null && travel_history != ''?travel_history.name:'';
      infectious = cache_data['infectious'];
      infectious_name = infectious != undefined && infectious != null && infectious != ''?infectious.name:'';
      request_comment = cache_data['request_comment'];
      target_bacillus = cache_data['target_bacillus'];
      anti_data = cache_data['anti_data'];
      height = cache_data['height'];
      weight = cache_data['weight'];
    }
    this.setState({
      number,
      isForUpdate,
      done_order,
      created_at,
      collected_date,
      collected_time,
      gather_part,
      gather_part_name,
      material,
      material_name,
      detail_part,
      detail_part_name,
      inspection_target,
      inspection_target_name,
      inspection_item,
      free_comment,
      basic_disease,
      basic_disease_name,
      travel_history,
      travel_history_name,
      infectious,
      infectious_name,
      request_comment,
      target_bacillus,
      anti_data,
      height,
      weight,
    })
  }
  
  getDepartment = (e) => {
    this.setState({departmentCode:parseInt(e.target.id)});
  }
  
  handleClick = (e, index, kind) => {
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
        .getElementById("wordList-table")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false }
          });
          document
            .getElementById("wordList-table")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX -$('#outpatient').offset().left,
          y: e.clientY -$('#outpatient').offset().top - 35,
          index: index,
          kind:kind,
        },
        contextMenu_define:{visible:false}
      });
    }
  };
  
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
    this.setState({
      isOpenMaterialModal:false,
      isOpenAntiMedicineModal:false,
      isOpenPatientStateModal:false,
      isOpenTargetBacillusModal:false,
    })
  }
  
  openMaterialMoal(){
    this.setState({
      isOpenMaterialModal:true,
    })
  }
  
  openPatientStateModal(){
    this.setState({
      isOpenPatientStateModal:true,
    })
  }
  
  openAntiMedicineModal(){
    this.setState({
      isOpenAntiMedicineModal:true,
    })
  }
  
  openTargetBacillusModal(){
    this.setState({
      isOpenTargetBacillusModal:true,
    })
  }
  
  getDate = value => {
    this.setState({
      collected_date: value
    });
  };
  
  getInputTime = value => {
    this.setState({collected_time:value})
  }
  
  setNowTime() {
    this.setState({collected_time:new Date()})
  }
  
  noneSetTime(){
    this.setState({collected_time:''})
  }
  
  handleAntiOk = (anti_data) => {
    this.closeModal();
    this.setState({
      anti_data,
    })
  }
  
  handleMaterialOk =(material_data)=>{
    this.setState({
      gather_part:material_data.gather_part,
      gather_part_name:material_data.gather_part!=undefined && material_data.gather_part!=null && material_data.gather_part!=''?material_data.gather_part.name:'',
      material:material_data.material,
      material_name:material_data.material!=undefined && material_data.material!=null && material_data.material!=''?material_data.material.name:'',
      detail_part:material_data.detail_part,
      detail_part_name:material_data.detail_part!=undefined && material_data.detail_part!=null && material_data.detail_part!=''?material_data.detail_part.name:'',
      inspection_target:material_data.inspection_target,
      inspection_target_name:material_data.inspection_target!=undefined && material_data.inspection_target!=null && material_data.inspection_target!=''?material_data.inspection_target.name:'',
      inspection_item:material_data.inspection_item,
    })
    this.closeModal();
  }
  
  handlePatientOk = (patient_data => {
    this.setState({
      basic_disease:patient_data.basic_disease,
      basic_disease_name:patient_data.basic_disease!=undefined && patient_data.basic_disease!=null && patient_data.basic_disease!=''?patient_data.basic_disease.name:'',
      travel_history:patient_data.travel_history,
      travel_history_name:patient_data.travel_history!=undefined && patient_data.travel_history!=null && patient_data.travel_history!=''?patient_data.travel_history.name:'',
      infectious:patient_data.infectious,
      infectious_name:patient_data.infectious!=undefined && patient_data.infectious!=null && patient_data.infectious!=''?patient_data.infectious.name:'',
      request_comment:patient_data.request_comment,
    });
    this.closeModal();
  })
  
  handleTargetBacillusOK = (data)=> {
    
    this.setState({
      target_bacillus:data.target_bacillus,
    })
    this.closeModal();
  }
  
  getComment = (e) => {
    this.setState({free_comment:e.target.value})
  }
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal:false,
      confirm_message: "",
    });
  }
  
  componentDidUpdate () {
    this.changeBackground();
  }
  
  changeBackground = () => {
    harukaValidate('karte', 'examination', 'bacillus', this.state, 'background');
  }
  
  initRedBorder = () => {
    removeRedBorder('collected_date_id');
    removeRedBorder('gather_part_name_id');
    removeRedBorder('material_name_id');
    removeRedBorder('detail_part_name_id');
    removeRedBorder('free_comment_id');
    
  }
  
  checkValidation = () => {
    this.initRedBorder();
    let error_str_arr = [];
    let first_tag_id = '';
    let validate_data = '';
    validate_data = harukaValidate('karte', 'examination', 'bacillus', this.state);
    
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != '') {
      first_tag_id = validate_data.first_tag_id;
    }
    this.setState({first_tag_id});
    return error_str_arr;
  }
  
  closeAlertModal = () => {
    this.setState({ alert_message: '' });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }
  
  save=()=> {
    let error_str_array = this.checkValidation()
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return;
    }
    this.setState({
      isUpdateConfirmModal:true,
      confirm_message:'登録しますか？',
    })
  }
  
  saveData = () => {
    this.confirmCancel();
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let bacillus_exam = {};
    bacillus_exam['number'] = this.state.number;
    bacillus_exam['system_patient_id'] = this.props.patientId;
    bacillus_exam['doctor_code'] = authInfo.staff_category == 1 ? authInfo.doctor_code : this.context.selectedDoctor.code;
    bacillus_exam['doctor_name'] = authInfo.staff_category == 1 ? authInfo.name : this.context.selectedDoctor.name;
    bacillus_exam['department_code'] = this.context.department.code == 0 ? 1 : this.context.department.code;
    if (authInfo.staff_category != 1){
      bacillus_exam['substitute_name'] = authInfo.name;
    }
    bacillus_exam['isForUpdate'] = this.state.isForUpdate;
    bacillus_exam['done_order'] = this.state.done_order;
    bacillus_exam['collected_date'] = formatDateLine(this.state.collected_date);    //採取日付
    bacillus_exam['collected_time'] = typeof this.state.collected_time =='object' ? formatTimeIE(this.state.collected_time) : this.state.collected_time;  //採取時刻
    bacillus_exam['gather_part'] = this.state.gather_part;                          //材料選択：採取部位
    bacillus_exam['material'] = this.state.material;                                //材料選択：材料
    bacillus_exam['detail_part'] = this.state.detail_part;                          //材料選択：詳細部位情報
    bacillus_exam['inspection_target'] = this.state.inspection_target;              //材料選択：検査項目
    bacillus_exam['free_comment'] = this.state.free_comment;                        //フリーコメント
    bacillus_exam['basic_disease'] = this.state.basic_disease;                      //基礎疾患
    bacillus_exam['travel_history'] = this.state.travel_history;                    //渡航履歴
    bacillus_exam['infectious'] = this.state.infectious;                            //指定感染症
    bacillus_exam['request_comment'] = this.state.request_comment;                  //依頼コメント
    bacillus_exam['inspection_item'] = this.state.inspection_item;                  //検査項目
    bacillus_exam['target_bacillus'] = this.state.target_bacillus;                  //目的菌
    bacillus_exam['anti_data'] = this.state.anti_data;                              //使用中抗菌剤
    bacillus_exam['height'] = this.state.height;                              //使用中抗菌剤
    bacillus_exam['weight'] = this.state.weight;                              //使用中抗菌剤
    if(this.props.cache_index != null){
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.BACILLUS_EDIT, this.props.cache_index, JSON.stringify(bacillus_exam), 'insert');
    } else {
      karteApi.setSubVal(this.props.patientId, CACHE_LOCALNAMES.BACILLUS_EDIT, new Date().getTime(), JSON.stringify(bacillus_exam), 'insert');
    }
    this.props.closeModal();
    this.context.$setExaminationOrderFlag(1);
  }
  
  render() {
    return (
      <>
        <Modal
          show={true}
          id="outpatient"
          className="custom-modal-sm patient-exam-modal first-view-modal"
        >
          <Modal.Header>
            <Modal.Title style={{width:'20rem'}}>細菌検査</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DatePickerBox>
              <Popup>
                <div className="disease-header flex" style={{marginTop:12}}>
                  <div className="label-title" >採取日付</div>
                  <DatePicker
                    locale="ja"
                    selected={this.state.collected_date}
                    onChange={this.getDate.bind(this)}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="年/月/日"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    id='collected_date_id'
                    className='collect-date'
                    dayClassName = {date => setDateColorClassName(date)}
                  />
                  <div>
                    <DatePicker
                      locale="ja"
                      selected={this.state.collected_time}
                      onChange={this.getInputTime}
                      showTimeSelect
                      showTimeSelectOnly
                      placeholderText = '時:分'
                      timeIntervals={10}
                      dateFormat="HH:mm"
                      timeFormat="HH:mm"
                      className='collect-time'
                      timeCaption="時間"
                    />
                  </div>
                  <button onClick={this.setNowTime.bind(this)}>現在時刻</button>
                  <button onClick = {this.noneSetTime.bind(this)}>時刻なし</button>
                  
                  {/* <InputWithLabel
                          label="注意事項"
                          type="text"
                          getInputText={this.getNotice.bind(this)}
                          diseaseEditData={this.state.notice}
                      /> */}
                </div>
                <div className='flex'>
                  <div className='left-area'>
                    <div className='flex'>
                      <div className='label-title'>
                        <button onClick={this.openMaterialMoal.bind(this)}>採取部位</button>
                      </div>
                      <div className = 'label-content' id = 'gather_part_name_id'>
                        {this.state.gather_part!=undefined && this.state.gather_part!=null && this.state.gather_part.name}
                      </div>
                    </div>
                    <div className='flex'>
                      <div className='label-title'>材料</div>
                      <div className = 'label-content' id = 'material_name_id'>
                        {this.state.material!=undefined && this.state.material!=null && this.state.material.name}
                      </div>
                    </div>
                    <div className='flex'>
                      <div className='label-title'>詳細部位情報</div>
                      <div className = 'label-content' id = 'detail_part_name_id'>
                        {this.state.detail_part!=undefined && this.state.detail_part!=null && this.state.detail_part.name}
                      </div>
                    </div>
                    <div className='flex'>
                      <div className='label-title'>検査目的</div>
                      <div className = 'label-content' id = 'inspection_target_name_id'>
                        {this.state.inspection_target!=undefined && this.state.inspection_target!=null && this.state.inspection_target.name}
                      </div>
                    </div>
                    <div className='flex'>
                      <div className='label-title'>フリーコメント</div>
                      <input
                        value = {this.state.free_comment}
                        onChange={this.getComment.bind(this)}
                        className = 'label-content'
                        id='free_comment_id'/>
                    </div>
                    {/* <div className='flex'>
                              <div className='label-title'></div>
                              <div className = 'label-content'>{this.state.free_comment!=undefined && this.state.free_comment!=null && this.state.free_comment.name}</div>
                          </div> */}
                    
                    <button style={{width:'100%'}} onClick={this.openPatientStateModal.bind(this)}>患者状態</button>
                    <div className='list state-list'>
                      <div id='basic_disease_name_id'>
                        {this.state.basic_disease!=undefined && this.state.basic_disease!=null && this.state.basic_disease.name}
                      </div>
                      <div id='travel_history_name_id'>
                        {this.state.travel_history!=undefined && this.state.travel_history!=null && this.state.travel_history.name}
                      </div>
                      <div id='infectious_name_id'>
                        {this.state.infectious!=undefined && this.state.infectious!=null && this.state.infectious.name}
                      </div>
                    </div>
                    <button style={{width:'100%'}} onClick={this.openAntiMedicineModal.bind(this)}>使用中抗菌剤</button>
                    <div>
                      <table className='table-scroll table table-bordered'>
                        <thead>
                        <tr>
                          <th/>
                          <th className='text-center'>系</th>
                          <th className='text-center'>薬剤名</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.anti_data != undefined && this.state.anti_data != null && this.state.anti_data.length > 0 && (
                          this.state.anti_data.map((item, index) => {
                            return (
                              <>
                                <tr>
                                  <td>{index + 1}</td>
                                  <td>{item.category_name}</td>
                                  <td>{item.name}</td>
                                </tr>
                              </>
                            )
                          })
                        )}
                        </tbody>
                      
                      </table>
                    </div>
                  </div>
                  <div className='right-area'>
                    <div className='table-area'>
                      <table className='table-scroll table table-bordered'>
                        <thead>
                        <tr>
                          <th>項目名</th>
                          <th>結果</th>
                          <th className='right-border'>測定日</th>
                          <th>項目名</th>
                          <th>結果</th>
                          <th>測定日</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                          <td>身長</td>
                          <td>{this.state.height}</td>
                          <td className='right-border'>{this.state.height != undefined ? this.state.height_weight.measure_date:''}</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>体重</td>
                          <td>{this.state.weight}</td>
                          <td className='right-border'>{this.state.weight != undefined? this.state.height_weight.measure_date:''}</td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>CRP</td>
                          <td></td>
                          <td className='right-border'></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        <tr>
                          <td>WBC</td>
                          <td></td>
                          <td className='right-border'></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className = 'flex'>
                      <div className='label-title'>検査項目</div>
                      <div className='list inspection-item-list'>
                        {this.state.inspection_item!=undefined && this.state.inspection_item!=null && this.state.inspection_item.length > 0 && (
                          this.state.inspection_item.map(item=> {
                            return(
                              <>
                                <div>{item.name}</div>
                              </>
                            )
                          })
                        )}
                      </div>
                    </div>
                    <div className = 'flex'>
                      <div className='label-title'><button onClick={this.openTargetBacillusModal.bind(this)}>目的菌</button></div>
                      <div className='list inspection-item-list'>
                        {this.state.target_bacillus != undefined && this.state.target_bacillus != null && this.state.target_bacillus != '' && this.state.target_bacillus.name}
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
            <Button className="red-btn" onClick={this.save.bind(this)}>確定</Button>
          </Modal.Footer>
          {this.state.isOpenMaterialModal && (
            <MaterialModal
              handleOk = {this.handleMaterialOk}
              closeModal={this.closeModal}
            />
          )}
          {this.state.isOpenAntiMedicineModal && (
            <AntiMedicineModal
              handleOk = {this.handleAntiOk}
              closeModal={this.closeModal}
            />
          )}
          {this.state.isOpenTargetBacillusModal && (
            <TargetBacillusModal
              handleOk = {this.handleTargetBacillusOK}
              closeModal={this.closeModal}
            />
          )}
          {this.state.isOpenPatientStateModal && (
            <PatientStateModal
              handleOk = {this.handlePatientOk}
              closeModal={this.closeModal}
            />
          )}
          {this.state.isUpdateConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.saveData.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.alert_message !== "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
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
BacillusInspection.contextType = Context;

BacillusInspection.propTypes = {
  closeModal : PropTypes.func,
  patientId : PropTypes.number,
  modal_data : PropTypes.object,
  cache_index : PropTypes.number,
};

export default BacillusInspection;
