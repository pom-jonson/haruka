import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Checkbox from "~/components/molecules/Checkbox";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import SelectPannelHarukaModal from "../../templates/Patient/Modals/Common/SelectPannelHarukaModal";
import {ALLERGY_CATEGORY_TITLE,BOILERPLATE_FUNCTION_ID_CATEGORY, KARTEMODE} from "~/helpers/constants";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import $ from "jquery";
import Context from "~/helpers/configureStore";
import {setDateColorClassName} from "~/helpers/dialConstants";

registerLocale("ja", ja);

const Wrapper = styled.div`
  display:block;
  background:white;
  width:100%;
  height:100%;
  min-height: 40vh;
  .text-center{
    text-align:center;AllergyCauseModal
  }
  .check-box-style{
    label{
        margin-right: 0px;
    }
  }
  .check-cell{
		padding: 0.3rem;
      width:97px;
  }
  .title-cell{
		padding: 0.3rem;
      width:250px;
  }
  .date-cell{
		padding: 0.3rem;
      width:176px;
			input {
				width: 165px;
			}
  }
	.div-comment {
		padding: 0.3rem;
		width: calc(100% - 508px);
        word-break: break-all;
	}
	.content-area {
		height: 23rem;
		.div-comment {
			padding: 0.3rem;
			width: calc(100% - 491px);
		}
		overflow-y: scroll;
		.check-cell{
				padding: 0.3rem;
				width:80px;
		}
        .deleted {
            text-decoration: line-through;
        }
	}
`;
const ContextMenuUl = styled.ul`
    margin-bottom: 0;
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
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0 1.25rem;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
`;

const ContextMenu = ({ visible, x,  y,  parent,  row_index,}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li onClick={() => parent.contextMenuAction(row_index,"edit")}><div>編集</div></li>
          <li onClick={() => parent.contextMenuAction(row_index, "delete")}><div>削除</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};
class AllergyTable extends Component {
  
  constructor(props) {
    super(props);
    this.table_title = '';
    this.symptom_title = '';
    switch(this.props.allergy_kind){
      case 0:
        this.table_title = 'アレルギー薬剤';
        this.symptom_title = 'アレルギー症状';
        break;
      case 1:
        this.table_title = 'アレルギー食物';
        this.symptom_title = 'アレルギー症状';
        break;
      case 2:
        this.table_title = 'アレルギー造影剤';
        this.symptom_title = 'アレルギー症状';
        break;
      case 3:
        this.table_title = 'アレルゲン';
        this.symptom_title = 'アレルギー症状';
        break;
      case 4:
        this.table_title = '皮内テスト';
        this.symptom_title = '皮内テスト結果';
        break;
      case 5:
        this.table_title = '種類';
        this.symptom_title = 'インプラント部位';
        break;
    }
    this.state = {
      table_list:[{allergen_name:"", allergen_id: "", symptom: "", start_date: "", is_canceled:0, is_enabled:1,category_id:this.props.allergy_kind+1}],
      selected_item_index: -1,
      isOpenAllergyCauseModal:false,
      isOpenAllergySymptomModal:false,
      isUpdateConfirmModal:false,
      isDeleteConfirmModal:false,
    };
    this.master_data = null;
    this.allergy_title=ALLERGY_CATEGORY_TITLE[this.props.allergy_kind+1];
    this.insert_data = {allergen_name:"", allergen_id: "", symptom: "", start_date: "", is_canceled:0, is_enabled:1,category_id:this.props.allergy_kind+1};
    this.karte_mode = KARTEMODE.READ;
  }
  
  async UNSAFE_componentWillMount () {
    let props_allergy= this.props.allergy_data[this.props.allergy_kind+1];
    if (props_allergy !== undefined && props_allergy != null && props_allergy.length > 0 && props_allergy[props_allergy.length-1].allergen_name != "" && props_allergy[props_allergy.length-1].allergen_id>0)
      props_allergy.push({...this.insert_data});
    if (props_allergy !== undefined && props_allergy != null && props_allergy.length > 0) {
      props_allergy.map(item=>{
        if (item.start_date != null && item.start_date != '' && !(item.start_date instanceof Date))
          item.start_date = new Date(item.start_date);
      });
    } else {
      props_allergy = [{allergen_name:"", allergen_id: "", symptom: "", start_date: "", is_canceled:0, is_enabled:1,category_id:this.props.allergy_kind+1}];
    }
    this.karte_mode = this.context.$getKarteMode(this.props.patient_id);
    this.setState({table_list:props_allergy});
  }
  
  componentDidMount() {
    if (this.state.table_list == null || this.state.table_list.length == 0) {
      this.setState({table_list:[{allergen_name:"", allergen_id: "", symptom: "", start_date: "", is_canceled:0, is_enabled:1,category_id:this.props.allergy_kind+1}]});
    }
  }
  
  getDate = (index,value) => {
    if (this.karte_mode === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    let {table_list}=this.state;
    table_list[index].start_date=value;
    let insert_data = {...this.insert_data};
    if (table_list[table_list.length-1].allergen_name !== "" && table_list[table_list.length-1].symptom !== "" && table_list[table_list.length-1].start_date !== "") {
      table_list.push(insert_data);
    }
    this.setState({table_list});
    this.props.saveData(this.props.allergy_kind+1, this.state.table_list);
  };
  
  OpenAllergyCauseModal (index,type=null){
    if (this.karte_mode === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    let {table_list}=this.state;
    if (type==="symptom"){
      if (table_list[index].symptom=="")
        this.setState({
          isOpenAllergySymptomModal:true,
          selected_item_index:index
        });
    } else {
      if (table_list[index].allergen_name=="")
        this.setState({
          isOpenAllergyCauseModal:true,
          selected_item_index:index
        });
    }
  }
  
  closeModal = () => {
    this.setState({
      isOpenAllergyCauseModal:false,
      isOpenAllergySymptomModal:false
    })
  };
  
  selectMaster = (data) => {
    this.closeModal();
    if (this.state.selected_item_index !== -1) {
      let {table_list}=this.state;
      let insert_data = {...this.insert_data};
      table_list[this.state.selected_item_index].allergen_name=data.name;
      table_list[this.state.selected_item_index].allergen_id=data.allergen_id;
      if (table_list[table_list.length-1].allergen_name !== "" && table_list[table_list.length-1].symptom !== "" && table_list[table_list.length-1].start_date !== "") {
        table_list.push(insert_data);
      }
      this.setState({table_list});
      this.props.saveData(this.props.allergy_kind+1, this.state.table_list);
    }
  };
  selectSymptom = (data) => {
    if (this.karte_mode === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    this.closeModal();
    if (this.state.selected_item_index !== -1) {
      let {table_list}=this.state;
      table_list[this.state.selected_item_index].symptom=data.name;
      if (data.is_free_comment != undefined && data.is_free_comment == true) {
        table_list[this.state.selected_item_index].is_free_comment=true;
      }
      let insert_data = {...this.insert_data};
      if (table_list[table_list.length-1].allergen_name !== "" && table_list[table_list.length-1].symptom !== "" && table_list[table_list.length-1].start_date !== "") {
        table_list.push(insert_data);
      }
      this.setState({table_list});
      this.props.saveData(this.props.allergy_kind+1, this.state.table_list);
    }
  };
  getRadio = (index,name,value) => {
    if (this.karte_mode === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    if (name === "check") {
      let {table_list}=this.state;
      table_list[index].is_canceled=value;
      this.setState({table_list});
      this.props.saveData(this.props.allergy_kind+1, this.state.table_list);
    }
  };
  
  handleClick = (e, index, type=null) => {
    if (this.karte_mode === KARTEMODE.READ) return;   // 「閲覧のみ」を選択した場合
    if (e.type === "contextmenu") {
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
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX -$('.modal-dialog').offset().left,
          y: e.clientY -$('.modal-dialog').offset().top - 80,
        },
        row_index: index,
        selected_modal:type
      });
    }
  };
  
  contextMenuAction = (index, type) => {
    if (index !== -1){
      if (type === "edit"){
        this.setState({
          selected_item_index:index,
          selected_free_input: this.state.table_list[index].symptom,
          [this.state.selected_modal]:true
        })
      }
      if (type === "delete"){
        if (this.state.table_list[index].allergen_name == undefined || this.state.table_list[index].allergen_name == '' || this.state.table_list[index].allergen_name == null) {
          let {table_list} = this.state;
          table_list[index] = {allergen_name:"", allergen_id: "", symptom: "", start_date: "", is_canceled:0, is_enabled:1,category_id:this.props.allergy_kind+1};
          this.setState({table_list});
          this.props.saveData(this.props.allergy_kind+1, this.state.table_list);
          return;
        }
        this.setState({selected_item_index:index}, ()=> {
          this.delete(this.state.table_list[index].allergen_name);
        });
      }
    }
  };
  
  delete = () => {
    this.setState({
      isDeleteConfirmModal : true,
      confirm_message: "削除しますか？",
    });
  };
  
  deleteData = () => {
    this.confirmCancel();
    let index = this.state.selected_item_index;
    if (index !== -1){
      let {table_list}=this.state;
      table_list[index].is_enabled = 0;
      this.setState({table_list});
      this.props.saveData(this.props.allergy_kind+1, this.state.table_list);
    }
  };
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
    });
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    let props_allergy = nextProps.allergy_data[this.props.allergy_kind+1];
    if (props_allergy !== undefined && props_allergy != null && props_allergy.length > 0 && props_allergy[props_allergy.length-1].allergen_name != "" && props_allergy[props_allergy.length-1].allergen_id>0)
      props_allergy.push({allergen_name:"", allergen_id: "", symptom: "", start_date: "", is_canceled:0, is_enabled:1,category_id:this.props.allergy_kind+1});
    if (props_allergy !== undefined && props_allergy != null && props_allergy.length > 0) {
      props_allergy.map(item=>{
        if (item.start_date != null && item.start_date != '' && !(item.start_date instanceof Date))
          item.start_date = new Date(item.start_date);
      });
    } else {
      props_allergy = [{allergen_name:"", allergen_id: "", symptom: "", start_date: "", is_canceled:0, is_enabled:1,category_id:this.props.allergy_kind+1}];
    }
    this.setState({table_list:props_allergy});
  }
  
  render() {
    var kind = this.props.allergy_kind;
    let {table_list}=this.state;
    return (
      <Wrapper>
        <div className='table-area w-100'>
          <div className='d-flex w-100 border-bottom border-top'>
            <div className='title-cell text-center border-left border-right'>{this.table_title}</div>
            <div className='date-cell text-center border-right'>{kind !=4 && kind != 5?'開始日':kind==4?'診断日':'装着日'}</div>
            <div className='text-center div-comment border-right'>{kind !=4 && kind != 5?'症状':kind==4?'結果':'部位'}</div>
            {kind!=5 && (<div className='check-cell text-center'>中止</div>)}
          </div>
          <div className="content-area">
            {table_list != null && table_list.length > 0 && table_list.map((item,index)=>{
              return(
                <div key={index} className={item.is_enabled==0?"deleted d-flex w-100 border-bottom": "d-flex w-100 border-bottom"}>
                  <div onClick={this.OpenAllergyCauseModal.bind(this,index)} className="title-cell border-left border-right" onContextMenu={e => this.handleClick(e, index,"isOpenAllergyCauseModal")} >{item.allergen_name}</div>
                  <div onContextMenu={e => this.handleClick(e, index)} className="date-cell border-right">
                    <DatePicker
                      locale="ja"
                      selected={item.start_date}
                      onChange={this.getDate.bind(this,index)}
                      dateFormat="yyyy/MM/dd"
                      placeholderText="年/月/日"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      disabled={this.karte_mode === KARTEMODE.READ}
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                  </div>
                  <div className={'div-comment border-right'} onClick={this.OpenAllergyCauseModal.bind(this,index,"symptom")} onContextMenu={e => this.handleClick(e, index,"isOpenAllergySymptomModal")} >{item.symptom}</div>
                  {kind!=5&&(<div className={'text-center check-box-style check-cell border-right'} onContextMenu={e => this.handleClick(e, index)} >
                    <Checkbox
                      label=""
                      getRadio={this.getRadio.bind(this,index)}
                      value={item.is_canceled}
                      name="check"
                      isDisabled={this.karte_mode === KARTEMODE.READ}
                    />
                  </div>)}
                </div>
              )
            })}
          </div>
        </div>
        {this.state.isOpenAllergyCauseModal == true && (
          <SelectPannelHarukaModal
            selectMaster = {this.selectMaster}
            closeModal= {this.closeModal}
            MasterName= {this.allergy_title}
            item_category_id={this.props.allergy_kind+1}
          />
        )}
        {this.state.isOpenAllergySymptomModal == true && (
          <SelectPannelHarukaModal
            selectMaster = {this.selectSymptom}
            closeModal= {this.closeModal}
            MasterName= {this.symptom_title}
            function_id={BOILERPLATE_FUNCTION_ID_CATEGORY.ALLERGY}
            item_category_id={this.props.allergy_kind+1}
            free_input={true}
            selected_free_input={this.state.selected_free_input}
            bolierplate_search={true}
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
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          row_index={this.state.row_index}
        />
      </Wrapper>
    );
  }
}

AllergyTable.contextType = Context;

AllergyTable.propTypes = {
  allergy_kind:PropTypes.number,
  saveData:PropTypes.func,
  allergy_data:PropTypes.object,
  loaded:PropTypes.boolean,
  patient_id:PropTypes.number,
};

export default AllergyTable;