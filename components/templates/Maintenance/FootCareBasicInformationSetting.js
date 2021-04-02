import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import SelectPannelModal from "~/components/templates/Dial/Common/SelectPannelModal";
import * as apiClient from "~/api/apiClient";
import Spinner from "react-bootstrap/Spinner";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import * as sessApi from "~/helpers/cacheSession-utils";

const Card = styled.div`
  position: fixed;
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  background-color: ${surface};
  padding: 20px;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
`;

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  margin-top:1rem;
  margin-bottom: 1rem;
  .table-area {
    table {
      font-size: 1rem;
      margin-bottom: 0;
    }
    thead{
      margin-bottom: 0;
      display:table;
      width:100%;
      tr{width: calc(100% - 17px);}
    }
    tbody{
      height: calc(100vh - 15rem);
      overflow-y: scroll;
      display:block;
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
      padding: 0.25rem;
      text-align: left;
      vertical-align: middle;
      border-bottom: 1px solid #dee2e6;
      word-break: break-all;
    }
    th {
        text-align: center;
        padding: 0.3rem;
        border-bottom: 1px solid #dee2e6;
    }
    .item-title {
      width:35rem;
      div {
        width:100%;
        margin-top:0;
      }
      .label-title {display:none;}
      input {
        width:100%;
        height:2rem;
        font-size:1rem;
        ime-mode: active;
      }
    }
    .item-name {
      width:30rem;
    }
  }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenuUl = styled.ul`
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
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({ visible, x, y, parent, selected_item_name}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction("delete_item")}>削除</div></li>
          {selected_item_name != null && (
            <li><div onClick={() => parent.contextMenuAction("clear_item")}>クリア</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class FootCareBasicInformationSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      item_list:[],
      isOpenSelectExamItem:false,
      selected_item:null,
      selected_item_name:null,
      load_foot_care_examination:false,
      confirm_message:"",
      confirm_type:"",
      confirm_alert_title:"",
      alert_messages:"",
    };
    this.init_item_list = [];
    this.can_edit = 0;
  }
  
  async componentDidMount () {
    if(this.context.$canDoAction(this.context.FEATURES.FOOT_CARE_BASIC_INFORMATION_SETTING,this.context.AUTHS.EDIT, 0)){
      this.can_edit = 1;
    }
    await this.getFootCareExamination();
  }
  
  getFootCareExamination=async()=>{
    if(this.state.load_foot_care_examination){
      this.setState({load_foot_care_examination:false});
    }
    let path = "/app/api/v2/dial/board/footcare/get/basic_set_info";
    await apiClient
      ._post(path, {params: {}})
      .then((res) => {
        res.push({title:"", left_item_code:"", left_item_code_name:"", right_item_code:"", right_item_code_name:"", is_enabled:1});
        this.init_item_list = JSON.parse(JSON.stringify(res));
        this.setState({
          item_list:res,
          load_foot_care_examination:true,
        });
      })
      .catch(() => {});
  }
  
  setItemTitle=(index, e)=>{
    let item_list = this.state.item_list;
    item_list[index]['title'] = e.target.value;
    let last_item = null;
    item_list.map(item=>{
      if(item.is_enabled == 1){
        last_item = item;
      }
    })
    if(last_item == null || (last_item != null && (
      (last_item.title != undefined && last_item.title != "")
      || (last_item.left_item_code_name != undefined && last_item.left_item_code_name != "")
      || (last_item.right_item_code_name != undefined && last_item.right_item_code_name != "")
    )))
    {
      item_list.push({
        title:"", left_item_code:"", left_item_code_name:"", right_item_code:"", right_item_code_name:"", is_enabled:1
      });
    }
    this.setState({item_list});
  }
  
  selectExamCode=(index, item_name)=>{
    if(this.can_edit == 0){
      return;
    }
    this.setState({
      isOpenSelectExamItem:true,
      selected_item:index,
      selected_item_name:item_name,
    });
  }
  
  selectMaster=(item)=>{
    let item_list = this.state.item_list;
    item_list[this.state.selected_item][this.state.selected_item_name] = item.code;
    item_list[this.state.selected_item][this.state.selected_item_name+'_name'] = item.name;
    let last_item = null;
    item_list.map(item=>{
      if(item.is_enabled == 1){
        last_item = item;
      }
    })
    if(last_item == null || (last_item != null && (
      (last_item.title != undefined && last_item.title != "")
      || (last_item.left_item_code_name != undefined && last_item.left_item_code_name != "")
      || (last_item.right_item_code_name != undefined && last_item.right_item_code_name != "")
    )))
    {
      item_list.push({
        title:"", left_item_code:"", left_item_code_name:"", right_item_code:"", right_item_code_name:"", is_enabled:1
      });
    }
    this.setState({
      item_list,
      isOpenSelectExamItem:false,
    });
  };
  
  handleClick=(e, index, item_name=null)=>{
    if(this.can_edit == 0){
      return;
    }
    if(this.state.item_list[index]['title'] == "" && this.state.item_list[index]['left_item_code_name'] == "" && this.state.item_list[index]['right_item_code_name'] == ""){
      return;
    }
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY + window.pageYOffset,
        },
        selected_item:index,
        selected_item_name:item_name,
      })
    }
  };
  
  contextMenuAction = (type) => {
    if (type === "delete_item"){
      this.setState({
        confirm_message:"削除しますか？",
        confirm_alert_title:"削除確認",
        confirm_type:type,
      });
    } else if(type == "clear_item"){
      this.setState({
        confirm_message:"クリアしますか？",
        confirm_alert_title:"クリア確認",
        confirm_type:type,
      });
    }
  };
  
  confirmOk=()=>{
    let state_data = {
      confirm_message:"",
      confirm_alert_title:"",
      confirm_type:""
    };
    if (this.state.confirm_type == "delete_item"){
      let item_list = [];
      let last_item = null;
      this.state.item_list.map((item, index)=>{
        if(index == this.state.selected_item){
          item.is_enabled = 0;
        }
        item_list.push(item);
        if(item.is_enabled == 1){
          last_item = item;
        }
      });
      if(last_item == null || (last_item != null && (
        (last_item.title != undefined && last_item.title != "")
        || (last_item.left_item_code_name != undefined && last_item.left_item_code_name != "")
        || (last_item.right_item_code_name != undefined && last_item.right_item_code_name != "")
      )))
      {
        item_list.push({
          title:"", left_item_code:"", left_item_code_name:"", right_item_code:"", right_item_code_name:"", is_enabled:1
        });
      }
      state_data['item_list'] = item_list;
    }
    if(this.state.confirm_type == "clear_item"){
      let item_list = this.state.item_list;
      item_list[this.state.selected_item][this.state.selected_item_name] = "";
      item_list[this.state.selected_item][this.state.selected_item_name+"_name"] = "";
      state_data['item_list'] = item_list;
    }
    if(this.state.confirm_type == "register"){
      this.register();
      return;
    }
    this.setState(state_data);
  }
  
  closeModal=()=>{
    this.setState({
      isOpenSelectExamItem:false,
      confirm_message:"",
      confirm_alert_title:"",
      confirm_type:"",
      alert_messages:""
    });
  }
  
  confirmRegister=()=>{
    this.setState({
      confirm_message:"登録しますか？",
      confirm_alert_title:"登録確認",
      confirm_type:'register',
    });
  }
  
  register=async()=>{
    this.closeModal();
    let path = "/app/api/v2/dial/board/footcare/set/basic_set_info";
    await apiClient
      ._post(path, {params: {
        item_list:this.state.item_list,
        }})
      .then((res) => {
        this.setState({
          alert_messages:res.alert_messages,
          confirm_alert_title:"登録完了",
        }, ()=>{
          this.getFootCareExamination();
        });
      })
      .catch(() => {});
  }
  
  render() {
    let change_flag = false;
    this.state.item_list.map((item, index)=>{
      if(this.init_item_list[index] == undefined){
        change_flag = true;
        return;
      }
      let init_item = this.init_item_list[index];
      if((item.title != init_item.title) || (item.is_enabled != init_item.is_enabled) || (item.left_item_code != init_item.left_item_code)
        || (item.left_item_code_name != init_item.left_item_code_name) || (item.right_item_code != init_item.right_item_code)
        || (item.right_item_code_name != init_item.right_item_code_name)
      ){
        change_flag = true;
        return;
      }
    });
    if(change_flag){
      sessApi.setObjectValue("dial_change_flag", "foot_care_basic_information_setting", 1);
    } else {
      sessApi.remove("dial_change_flag");
    }
    return (
      <Card>
        <div className="title">フットケア基本情報設定</div>
        <Wrapper>
          <div className={'table-area'}>
            <table className="table table-bordered table-hover" id="code-table">
              <thead>
              <tr>
                <th className="item-title">項目名</th>
                <th className="item-name">検査項目名（左）</th>
                <th>検査項目名（右）</th>
              </tr>
              </thead>
              <tbody>
              {this.state.load_foot_care_examination ? (
                <>
                  {this.state.item_list.map((item, index)=>{
                    if(item.is_enabled == 1){
                      return (
                        <>
                          <tr key={index}>
                            {this.can_edit == 1 ? (
                              <td className="item-title" style={{padding:0}} onContextMenu={e => this.handleClick(e, index)}>
                                <InputWithLabelBorder
                                  id={'item-title-'+index}
                                  type="text"
                                  getInputText={this.setItemTitle.bind(this, index)}
                                  diseaseEditData={item.title}
                                />
                              </td>
                            ):(
                              <td className="item-title">{item.title}&nbsp;</td>
                            )}
                            <td
                              className="item-name" style={{cursor:"pointer"}}
                              onClick={this.selectExamCode.bind(this, index, 'left_item_code')}
                              onContextMenu={e => this.handleClick(e, index, (item.left_item_code_name == "" ? null : 'left_item_code'))}
                            >
                              {item.left_item_code_name}
                            </td>
                            <td
                              style={{cursor:"pointer"}}
                              onClick={this.selectExamCode.bind(this, index, 'right_item_code')}
                              onContextMenu={e => this.handleClick(e, index, (item.right_item_code_name == "" ? null : 'right_item_code'))}
                            >
                              {item.right_item_code_name}
                            </td>
                          </tr>
                        </>
                      )
                    }
                  })}
                </>
              ):(
                <tr>
                  <td colSpan={'3'}>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </td>
                </tr>
              )}
              </tbody>
            </table>
          </div>
        </Wrapper>
        <div className="footer-buttons">
          {(change_flag && this.state.load_foot_care_examination) ? (
            <Button className={"red-btn"} onClick={this.confirmRegister}>登録</Button>
          ):(
            <Button className={"disable-btn"}>登録</Button>
          )}
          
        </div>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          selected_item_name={this.state.selected_item_name}
        />
        {this.state.isOpenSelectExamItem && (
          <SelectPannelModal
            selectMaster = {this.selectMaster}
            closeModal={this.closeModal}
            MasterName = {'検査項目'}
          />
        )}
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm= {this.closeModal.bind(this)}
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.confirmOk}
            confirmTitle= {this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title={this.state.confirm_alert_title}
          />
        )}
      </Card>
    )
  }
}

FootCareBasicInformationSetting.contextType = Context;

FootCareBasicInformationSetting.propTypes = {
  history: PropTypes.object
};

export default FootCareBasicInformationSetting