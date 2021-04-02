import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import SelectorWithLabel from "../../../../molecules/SelectorWithLabel";
import Radiobox from "~/components/molecules/Radiobox";
import InputWithLabel from "../../../../molecules/InputWithLabel";
import Checkbox from "../../../../molecules/Checkbox";
import SelectSearchConditionModal from "./SelectSearchConditionModal";
import NameSaveModal from "./NameSaveModal";
import axios from "axios";
import {formatDateLine} from "../../../../../helpers/date";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  // height: 62vh;
  overflow-y: auto;
  fieldset{
    padding: 0.5rem;
    border: 1px solid #aaa;
  }
  .no-margin {
    div {margin-top:0;}
  }
  label {font-size: 1rem;}
  .label-title{
    width: 30px;
    text-align: center;
    margin: 0;
    line-height: 2rem;
  }
  legend{
    width: auto;
    margin-left: 20px;
    margin-bottom: 0;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 1.2rem;
  }
  button{
    padding: 0;
    height: 2rem;
    min-width: 60px;
    margin-right: 14px;
    span {font-size:1rem;}
  }
  .react-datepicker-wrapper{
    input{ height: 2rem; }
  }
  .radio-area{
    .radio-title{
      width: 5.5rem;
      line-height: 2rem;
    }
  }
  .radio-groups{
      label{
        min-width: 6rem;
        font-size: 1rem;
        line-height: 2rem;
      }
  }
  .check-box-area{
    label{
        width: auto;
    }
  }
  .alternate-area{
    .radio-groups{
        label{ width: auto;}
    }
  }
  .detail-area{
    margin-left: 70px;
    min-height: 2rem;
    padding: 5px;
  }
 `;

const Header = styled.div`
  display: block;
  span{
    color: white;
    font-size: 1rem;
  }
  button{
    float: right;
    padding: 0;
    margin-right: 14px;
    height:2rem;
  }
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 0.5rem;
  margin: -25px -15px 0.5rem -15px;
  .pullbox-title{width: 20px;}
  .pullbox-label {margin-bottom: 0;}
  .pullbox-select {height:2rem;}
`;

let original_data = {};
class SearchConditionModal extends Component {
  constructor(props) {
      super(props);
      this.state = {
          isOpenSelectModal: false,
          isNameSaveModal: false,
          condition_option_array:[{ id: 0, value: ""}],
          search_condition_array:[],
          isUpdateConfirmModal: false,
          confirm_message: "",
      };
      this.karte_status_array = {
          title: "入外",
          name: "karte_status",
          type_array: {0: "全て", 1: "外来", 2:"入院", 3:"訪問診療"}
      };
      this.department_status_array = {
          title: "診療科",
          name: "department_status",
          type_array: {0: "全科", 1: "自科のみ", 2:"詳細"},
          div_array:"department"
      };
      this.hospital_status_array = {
          title: "病棟",
          name: "hospital_status",
          type_array: {0: "全病棟", 1:"詳細"},
          div_array:"hospital"
      };
      this.insurance_status_array = {
          title: "病棟",
          name: "insurance_status",
          type_array: {0: "指定なし", 1:"指定する"},
          div_array:"insurance"
      };
      this.document_array = [
          {title: "診療記録",name: "note_status", type_array: {0: "全て", 1:"非表示", 2:"詳細"}, check_array:["関連するカルテで絞り込む"], check_name:["related_karte_status"],div_array:"note"},
          {title: "記載内容",name: "content_status", type_array: {0: "全て", 1:"非表示", 2:"詳細"},div_array:"content"},
          {title: "オーダー",name: "order_status", type_array: {0: "全て", 1:"非表示", 2:"詳細"},check_title:"状態", check_array:["依頼","実施"], check_name:["request_status","done_status"],div_array:"orders"},
          {title: "結果・報告",name: "result_status", type_array: {0: "全て", 1:"非表示", 2:"検体検査", 3:"画像検査", 4:"レポート", 5:"詳細"},div_array:"result"},
      ];
      this.alternate_status_array = {
          name: "alternate_status",
          type_array: {0: "含む", 1:"含まない", 2:"代行入力のみ"},
          check_array:["未承認","承認済み"],
          check_name:["notconsented_status","consented_status"]
      };
  }

  UNSAFE_componentWillMount() {
      this.getCondition();
  }

  async getCondition () {
      const {data} = await axios.get("/app/api/v2/search_condition/search");
      let condition_option_array = this.getSearchConditionOption(data);
      this.setState({condition_option_array, search_condition_array: data});
  }

  componentDidMount() {
      this.formatData();
  }

  setValue = (key, e) => {
      this.setState({[key]:e.target.value});
  };

  setCheckValue = (key,name,value) => {
      this.setState({[key]:value});
  };

  setDateValue = (key,value) => {
      this.setState({[key]:value});
  };

  openSelectModal = (modal_type, modal_title) => {
      let status_key = "";
      let status_value = "";
      if (modal_type == "department") {
          status_key = "department_status";
          status_value = 2;
      } else if (modal_type == "hospital") {
          status_key = "hospital_status";
          status_value = 1;
      } else if (modal_type == "insurance") {
          status_key = "insurance_status";
          status_value = 1;
      } else if (modal_type == "note") {
          status_key = "note_status";
          status_value = 2;
      } else if (modal_type == "content") {
          status_key = "content_status";
          status_value = 2;
      } else if (modal_type == "orders") {
          status_key = "order_status";
          status_value = 2;
      } else if (modal_type == "result") {
          status_key = "result_status";
          status_value = 5;
      }
    this.setState({
        isOpenSelectModal: true,
        modal_type,
        modal_title,
        [status_key]:status_value
    });
  };

  closeModal = () =>{
      this.setState({
          isOpenSelectModal: false,
          isNameSaveModal: false,
      });
  };

  getBeforeDate(compare_date){
    if(!(compare_date instanceof Date)) return " ";
    let today= new Date();
    let diffTime = Math.abs(today.getTime() - compare_date.getTime());
    let return_val = (diffTime / (1000 * 60 * 60 * 24))<1 ? " ": parseInt(diffTime / (1000 * 60 * 60 * 24));
    // return parseInt(diffTime / (1000 * 60 * 60 * 24)) + today.getTime() > compare_date.getTime() ? "日前": "日後";
    return return_val;
  }

  setFromToDate = () => {
      this.setState({
          from_date:new Date(),
          end_date: new Date()
      })
    };

  handleOk = (data) => {
      this.setState({
          isOpenSelectModal:false,
          [this.state.modal_type]:data
      });
  };

  getDetailInfo (data) {
    if(data == null || data.length == 0) return "";
    let name_array = [];
    data.map(item=>{name_array.push(item.value)});
    return name_array.join(",");
  }

  saveData = async (save_name) => {
      this.closeModal();
      let post_data = {...this.state};
      if (post_data.from_date !== undefined && post_data.from_date != null) post_data.from_date = formatDateLine(post_data.from_date);
      if (post_data.end_date !== undefined && post_data.end_date != null) post_data.end_date = formatDateLine(post_data.end_date);
      if (save_name !== undefined && save_name != null) {
          post_data.search_condition_name = save_name;
          if (this.state.original_name !== undefined && this.state.original_name != null) {  // rename
              post_data.original_name = undefined;
              this.setState({original_name:undefined});
          } else { // register
              post_data.number = undefined;
          }
      }
      post_data.search_condition_array = undefined;
      post_data.condition_option_array = undefined;
      post_data.isUpdateConfirmModal = undefined;
      post_data.confirm_message = undefined;
      post_data.isOpenSelectModal = undefined;
      post_data.isNameSaveModal = undefined;
      await axios.post("/app/api/v2/search_condition/register",{params: post_data}).then((res)=>{
          // window.sessionStorage.setItem("alert_messages","保存しました。");
          this.getCondition();
          if(res.data > 0) this.setState({number: res.data});
      }).catch();
  };

  registerData = () => {
      this.setState({isNameSaveModal:true});
  };

  getSearchConditionOption (data) {
      let return_data = [{ id: 0, value: ""}];
      if (data != undefined && data.length>0 ){
          data.map((item, index) => {
              let temp = {id: item.number, value: item.search_condition_name};
              return_data[index+1]= temp;
          });
      }
      return return_data;
  }

  setSearchCondition = e => {
      let find_data = this.state.search_condition_array.find(x=>x.number==e.target.id);
      if(find_data === undefined || find_data == null) {
          this.setState({number:undefined});
          this.formatData();
          return;
      }
      if(find_data.from_date != null) find_data.from_date = new Date(find_data.from_date);
      if(find_data.end_date != null) find_data.end_date = new Date(find_data.end_date);
      this.setState(find_data);
      original_data = find_data;
  };

  updateData = () => {
      if (this.state.number === undefined || this.state.number == null) return;
      if (JSON.stringify(this.state) == JSON.stringify(original_data)) {
          // window.sessionStorage.setItem("alert_messages","変更した項目がありません。");
          return;
      }
      this.openConfirm();
  };

  openConfirm = () => {
        this.setState({
            isUpdateConfirmModal : true,
            confirm_message: "変更しますか？",
        });
    };

  confirmCancel() {
        this.setState({
            isUpdateConfirmModal: false,
            confirm_message: "",
        });
    }

  confirmRegister = () => {
        this.confirmCancel();
        this.saveData();
    };

  renameData = () => {
        if (this.state.number === undefined || this.state.number == null) return;
        this.setState({isNameSaveModal: true,original_name: this.state.search_condition_name});
    };

  clearData = () => {
        if (this.state.number > 0) this.setState(original_data);
        else this.formatData();
    };

  deleteData = async () => {
        if (this.state.number === undefined || this.state.number == null) return;
        await axios.post("/app/api/v2/search_condition/delete",{params: {number: this.state.number}}).then(()=>{
            // window.sessionStorage.setItem("alert_messages","保存しました。");
            this.getCondition();
        }).catch();
    };

  formatData () {
        this.setState({
            [this.karte_status_array.name]:0,
            [this.karte_status_array.div_array]:null,
            [this.department_status_array.name]:0,
            [this.department_status_array.div_array]:null,
            [this.hospital_status_array.name]:0,
            [this.hospital_status_array.div_array]:null,
            [this.insurance_status_array.name]:0,
            [this.insurance_status_array.div_array]:null,
            [this.alternate_status_array.name]:0,
            [this.document_array[0].name]:0,
            [this.document_array[1].name]:0,
            [this.document_array[2].name]:0,
            [this.document_array[3].name]:0,
            [this.document_array[0].div_array]:null,
            [this.document_array[1].div_array]:null,
            [this.document_array[2].div_array]:null,
            [this.document_array[3].div_array]:null,
            no_date:0,
            related_karte_status:0,
            request_status:0,
            done_status:0,
            notconsented_status:0,
            consented_status:0,
            history_status:0,
            from_date:null,
            end_date: null,
        });
    }

  searchExecute = (e) => {
      let post_data = {...this.state};
      if (post_data.from_date !== undefined && post_data.from_date != null) post_data.from_date = formatDateLine(post_data.from_date);
      if (post_data.end_date !== undefined && post_data.end_date != null) post_data.end_date = formatDateLine(post_data.end_date);
      post_data.search_condition_array = undefined;
      post_data.condition_option_array = undefined;
      post_data.isUpdateConfirmModal = undefined;
      post_data.confirm_message = undefined;
      post_data.isOpenSelectModal = undefined;
      post_data.isNameSaveModal = undefined;
      this.props.searchExecute(e,post_data);
      this.props.closeModal();
  };

  render() {
    let {condition_option_array} = this.state;
    return  (
        <Modal show={true} className="outpatient-modal search-condition-modal first-view-modal" size="lg" id="search-condition-modal">
          <Modal.Header>
            <Modal.Title>
                詳細検索
            </Modal.Title>
              <br />
          </Modal.Header>
          <Modal.Body>
              <Header>
                  <div className={`search-condition`}>
                      <div style={{marginLeft:20}}>検索条件</div>
                      <div className={`d-flex`}>
                          <SelectorWithLabel
                              options={condition_option_array}
                              title=""
                              getSelect={this.setSearchCondition.bind(this)}
                              departmentEditCode={this.state.number}
                          />
                          <div className={`btn-area d-flex`}  style={{marginLeft:20}}>
                              <Button className="mr-2" onClick={this.registerData}>新   規</Button>
                              <Button className="mr-2" onClick={this.updateData}>更   新</Button>
                              <Button className="mr-2" onClick={this.renameData}>名称変更</Button>
                              <Button className="mr-2" onClick={this.clearData}>クリア</Button>
                              <Button onClick={this.deleteData}>削除</Button>
                          </div>
                      </div>
                  </div>
              </Header>
            <Wrapper>
                <div className={`first-area w-100 d-flex`}>
                    <div className={`left-area w-50 mr-3`}>
                        <fieldset className="field-1">
                            <legend className="blog-title">期間</legend>
                            <div className="d-flex">
                            <Button onClick={this.setFromToDate}>本日</Button>
                            <div className={'no-margin'}>
                              <InputWithLabel
                                type="date"
                                getInputText={this.setDateValue.bind(this,"from_date")}
                                diseaseEditData={this.state.from_date}
                              />
                            </div>
                            <div className={'no-margin'}>
                              <InputWithLabel
                                label="~"
                                type="date"
                                getInputText={this.setDateValue.bind(this,"end_date")}
                                diseaseEditData={this.state.end_date}
                              />
                            </div>
                            </div>
                            <div className="d-flex" style={{marginLeft:100,fontSize:14}}>
                            <div>今日から{this.getBeforeDate(this.state.from_date)}日前</div>
                            <div style={{marginLeft:"20%"}}>今日から{this.getBeforeDate(this.state.end_date)}日前</div>
                            </div>
                            <div style={{marginLeft:100}}>
                            <Checkbox
                                label="日未定を表示する"
                                getRadio={this.setCheckValue.bind(this,"no_date")}
                                value={this.state.no_date}
                                name="urgent"
                            />
                            </div>
                        </fieldset>
                        <fieldset className="radio-area">
                            <legend className="blog-title">入外/科</legend>
                            <div className = "radio-groups d-flex">
                                <div className="radio-title">{this.karte_status_array.title}</div>
                                {Object.keys(this.karte_status_array.type_array).map(index=>{
                                    return (
                                        <>
                                            <Radiobox
                                                label={this.karte_status_array.type_array[index]}
                                                value={index}
                                                getUsage={this.setValue.bind(this, this.karte_status_array.name)}
                                                checked={this.state[this.karte_status_array.name] == index ? true : false}
                                                name={this.karte_status_array.name}
                                            />
                                        </>
                                    );
                                })}
                            </div>
                            <div className = "radio-groups d-flex">
                                <div className="radio-title">{this.department_status_array.title}</div>
                                {Object.keys(this.department_status_array.type_array).map(index=>{
                                    return (
                                        <>
                                            <Radiobox
                                                label={this.department_status_array.type_array[index]}
                                                value={index}
                                                getUsage={this.setValue.bind(this, this.department_status_array.name)}
                                                checked={this.state[this.department_status_array.name] == index ? true : false}
                                                name={this.department_status_array.name}
                                            />
                                        </>
                                    );
                                })}
                                <Button onClick={this.openSelectModal.bind(this,this.department_status_array.div_array, this.department_status_array.title)}>選択</Button>
                            </div>
                            <div className="border mt-1 detail-area">{this.getDetailInfo(this.state[this.department_status_array.div_array])}</div>
                            <div className = "radio-groups d-flex mt-1">
                                <div className="radio-title">{this.hospital_status_array.title}</div>
                                {Object.keys(this.hospital_status_array.type_array).map(index=>{
                                    return (
                                        <>
                                            <Radiobox
                                                label={this.hospital_status_array.type_array[index]}
                                                value={index}
                                                getUsage={this.setValue.bind(this, this.hospital_status_array.name)}
                                                checked={this.state[this.hospital_status_array.name] == index ? true : false}
                                                name={this.hospital_status_array.name}
                                            />
                                        </>
                                    );
                                })}
                                <Button onClick={this.openSelectModal.bind(this,this.hospital_status_array.div_array, this.hospital_status_array.title)}>選択</Button>
                            </div>
                            <div className="border mt-1 detail-area">{this.getDetailInfo(this.state[this.hospital_status_array.div_array])}</div>
                        </fieldset>
                    </div>
                    <div className={`w-50`}>
                        <fieldset className="field-1">
                            <legend className="blog-title">履歴</legend>
                            <div style={{marginLeft:10}}>
                                <Checkbox
                                    label="履歴・削除文書を表示する"
                                    getRadio={this.setCheckValue.bind(this,"history_status")}
                                    value={this.state.history_status}
                                    name="period"
                                />
                            </div>
                        </fieldset>
                        <fieldset className="field-1 radio-area">
                            <legend className="blog-title">保険</legend>
                            <div className = "radio-groups d-flex">
                                {Object.keys(this.insurance_status_array.type_array).map(index=>{
                                    return (
                                        <>
                                            <Radiobox
                                                label={this.insurance_status_array.type_array[index]}
                                                value={index}
                                                getUsage={this.setValue.bind(this, this.insurance_status_array.name)}
                                                checked={this.state[this.insurance_status_array.name] == index ? true : false}
                                                name={this.insurance_status_array.name}
                                            />
                                        </>
                                    );
                                })}
                                <Button onClick={this.openSelectModal.bind(this,this.insurance_status_array.div_array, this.insurance_status_array.title)}>選択</Button>
                            </div>
                            <div className="border mt-1 detail-area" style={{marginLeft:0}}>{this.getDetailInfo(this.state[this.insurance_status_array.div_array])}</div>
                        </fieldset>
                {/* <div className="w-25 alternate-area"> */}
                        <fieldset className="radio-area">
                            <legend className="blog-title">代行入力</legend>
                            <div className = "radio-groups d-flex">
                                {Object.keys(this.alternate_status_array.type_array).map(index=>{
                                    return (
                                        <>
                                            <Radiobox
                                                label={this.alternate_status_array.type_array[index]}
                                                value={index}
                                                getUsage={this.setValue.bind(this, this.alternate_status_array.name)}
                                                checked={this.state[this.alternate_status_array.name] == index ? true : false}
                                                name={this.alternate_status_array.name}
                                            />
                                        </>
                                    );
                                })}
                            </div>
                            <div className={`d-flex`}>
                                {this.alternate_status_array.check_array.map((subitem,subindex)=>{ return(
                                    <Checkbox
                                        label={subitem}
                                        getRadio={this.setCheckValue.bind(this,this.alternate_status_array.check_name[subindex])}
                                        value={this.state[this.alternate_status_array.check_name[subindex]]}
                                        name={this.alternate_status_array.check_name[subindex]}
                                        key={subindex}
                                    />
                                )})}
                            </div>
                        </fieldset>
                {/* </div> */}
                    </div>
                </div>
                <div className="w-100">
                    <fieldset className="radio-area">
                        <legend className="blog-title">文書</legend>
                        {this.document_array.map((item, index)=>{
                            return (
                                <>
                                    <div className = {"radio-groups d-flex " + (index != 0 ? "mt-1" : "")}>
                                        <div className="radio-title">{item.title}</div>
                                        {Object.keys(item.type_array).map(index=>{
                                            return (
                                                <>
                                                    <Radiobox
                                                        label={item.type_array[index]}
                                                        value={index}
                                                        getUsage={this.setValue.bind(this, item.name)}
                                                        checked={this.state[item.name] == index ? true : false}
                                                        name={item.name}
                                                    />
                                                </>
                                            );
                                        })}
                                        <Button onClick={this.openSelectModal.bind(this,item.div_array, item.title)}>選択</Button>
                                        {item.check_array != undefined && (
                                            <div className="check-box-area">
                                                {item.check_title != undefined &&(
                                                    <label className="mr-2">{item.check_title}</label>
                                                )}
                                                {item.check_array.map((subitem,subindex)=>{ return(
                                                    <Checkbox
                                                        label={subitem}
                                                        getRadio={this.setCheckValue.bind(this,item.check_name[subindex])}
                                                        value={this.state[item.check_name[subindex]]}
                                                        name={item.check_name[subindex]}
                                                        key={subindex}
                                                    />
                                                )})}
                                            </div>
                                        )}
                                    </div>
                                    <div className="border mt-1 detail-area">{this.getDetailInfo(this.state[item.div_array])}</div>
                                </>
                            )
                        })}
                    </fieldset>
                </div>
            </Wrapper>
          </Modal.Body>
            <Modal.Footer>
                <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
                <Button className="red-btn" onClick={e=>this.searchExecute(e,this)}>検索実行</Button>
            </Modal.Footer>
            {this.state.isOpenSelectModal && (
                <SelectSearchConditionModal
                    handleOk={this.handleOk}
                    closeModal={this.closeModal}
                    modal_title={this.state.modal_title}
                    modal_type={this.state.modal_type}
                />
            )}
            {this.state.isNameSaveModal && (
                <NameSaveModal
                    saveName={this.saveData}
                    closeModal={this.closeModal}
                    save_name={this.state.original_name}
                />
            )}
            {this.state.isUpdateConfirmModal !== false && (
                <SystemConfirmJapanModal
                    hideConfirm= {this.confirmCancel.bind(this)}
                    confirmCancel= {this.confirmCancel.bind(this)}
                    confirmOk= {this.confirmRegister.bind(this)}
                    confirmTitle= {this.state.confirm_message}
                />
            )}
        </Modal>
    );
  }
}

SearchConditionModal.contextType = Context;

SearchConditionModal.propTypes = {
  closeModal: PropTypes.func,
  searchExecute:PropTypes.func,
};

export default SearchConditionModal;
