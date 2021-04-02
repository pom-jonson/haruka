import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import UsageModal from "../modals/UsageModal";
import MasterUsage from "./MasterUsage"
import DialSideBar from "../DialSideBar";
import axios from "axios";
import RadioButton from "~/components/molecules/RadioInlineButton";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";

const Card = styled.div`
  position: fixed;  
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
  z-index:100;
  .others {
    position:absolute;
    right:1.25rem;
    top:12px;
    button {
        margin-left: 0.2rem;
        margin-bottom: 0px;
        margin-top: 0.3rem;
    }
    span {
        font-size: 1rem;
    }
    .disable-button {
        background: rgb(101, 114, 117);
    }
  }
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;}
    .footer {
        position: absolute;
        bottom: 2.5rem;
        left: 45%;
        text-align: center;
        button {
          text-align: center;
          border-radius: 0.25rem;
          background: rgb(105, 200, 225); 
          border: none;
          margin-right: 1.875rem;
        }
        
        span {
          color: white;
          font-size: 1.25rem;
          font-weight: 100;
        }
    }
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 4.375rem;
  padding: 1.25rem;
  float: left;
  margin-bottom:8px;
  .list-title {
    margin-top: 1.25rem;
    font-size: 1.25rem;
    width: 20%;
  }
  .search-box {
      width: 100%;
      display: flex;
  }  
  .label-title {
    width: 6rem;
    text-align: right;
    margin-right: 0.625rem;
  }
    .pullbox-title{font-size:1rem;}
  .pullbox-select {
      font-size: 1rem;
      width: 7.5rem;
  }
  .gender {
    font-size: 1rem;
    margin-left: 1rem;
    .radio-btn label{
        width: auto;
        font-size: 1rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.3rem;
        padding: 0.25rem 0.3rem;
        padding-left:1rem
        padding-right:1rem;        
    }
  }
 `;
const display_order = [    
    { id: 0, value: "表示順", field_name:"sort_number"},
    { id: 1, value: "コード順", field_name:"code"},
    { id: 2, value: "カナ順", field_name:"name_kana"},
    { id: 3, value: "名称順", field_name:"name"},
];
const display_class = [
    { id: 0, value: "全て" },
    { id: 1, value: "表示のみ" },
    { id: 2, value: "非表示のみ" },
];

class Usage extends Component {
    constructor(props) {
        super(props);
        let usage_item = ["内服", "頓服", "外用","処置","麻酔","インスリン",""];
        this.state = {
            schVal: "",
            table_data: [],
            isOpenModal: false,
            isLoaded: false,
            modal_data: {},
            search_order: 2,        //表示順
            search_class: 1,        //表示区分
            type: "",
            usage_item,
            schCategory: "",

            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,            
            confirm_message: "",
        }
    }

    async componentDidMount(){
        await this.getUsageGroup()
        await this.getSearchResult();

    }

    // 検索
    getSearchResult = async () => {
        let path = "/app/api/v2/dial/master/material_search";
        let post_data = {
            keyword: this.state.schVal,
            sub_category: this.state.schCategory,
            order: display_order[this.state.search_order].field_name,
            is_enabled: this.state.search_class,
            table_kind: 5,            
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({
            table_data: data,
            isLoaded: true
        });
    };

    getUsageGroup = async () => {
        let path = "/app/api/v2/dial/master/material_search";
        let post_data = {
            is_enabled: 1,
            table_kind: 12,
            order:"sort_number"
        };
        let { data } = await axios.post(path, {params: post_data});
        let usage_group_codes = [{id:0,value:""}];
        data.map(item=>{
            let code = {};
            code.id = item.code;
            code.value = item.name;
            usage_group_codes.push(code);
        });
        this.setState({usage_group: usage_group_codes});
    };

    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
            this.setState({
              isLoaded: false
            },()=>{                                                    
                this.getSearchResult();
            });
        }
    };
    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };
    getOrderSelect = e => {                 //表示順
        this.setState({ search_order: parseInt(e.target.id), isLoaded: false }, () => {
            this.getSearchResult();
        });
    };
    getClassSelect = e => {                 //表示区分
        this.setState({ search_class: parseInt(e.target.id), isLoaded: false }, () => {
            this.getSearchResult();
        });
    };
    selectCategory = e => {
        this.setState({schCategory: e.target.value, isLoaded: false}, () => {
            this.getSearchResult();
        });
    };

    // モーダル
    openModal = () => {
        if (this.context.$canDoAction(this.context.FEATURES.DIAL_USAGE_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
            window.sessionStorage.setItem("alert_messages","登録権限がありません。");
            return;
        }
        this.setState({
            modal_data: null,
            row_index: -1,
            isOpenModal: true,
        });
    };
    closeModal = () => {
        this.setState({isOpenModal: false, isLoaded: false},()=>{
            this.getSearchResult();
        });
    };
    handleOk = () => {
        this.setState({
            isOpenModal: false,
            isLoaded: false
        },()=>{
            this.getSearchResult();
        });
    };
    continueRegister = () => {
        this.setState({
          isLoaded: false
        },()=>{                                                                
            this.getSearchResult();
        });
    };
    updateData = (index) => {
        let modal_data = this.state.table_data[index];
        this.setState({
            modal_data,
            row_index: index,
            isOpenModal: true
        });
    };

    confirmCancel() {
        this.setState({
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,            
            confirm_message: "",
        });
    }
  
    delete = (number, name) => {
        this.setState({
            isDeleteConfirmModal : true,
            confirm_message: "「" + name + "」" + " これを削除して良いですか？",
            selected_number:number,
        });
    }    
    // データ
    deleteData = async () => {
        let path = "/app/api/v2/dial/master/dial_method_register";
        let post_data = {
            params: this.state.selected_number,
            table_kind: 5,
            type: "delete"
        };
        await axios.post(path,  post_data);
        window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
        this.confirmCancel();
        this.setState({
          isLoaded: false
        },()=>{                                                    
            this.getSearchResult();
        });        
    };

    goOtherPage = (url) => {
        this.props.history.replace(url);
    }

    render() {
        let {table_data} = this.state;
        return (
            <><DialSideBar />
            <Card>
                <div className='flex'>
                    <div className="title">服用マスタ</div>
                    <div className='others'>
                        <Button className="disable-button">服用マスタ</Button>                        
                        <Button onClick={this.goOtherPage.bind(this,"/dial/master/usage_group")}>服用グループマスタ</Button>
                    </div>
                </div>
                <SearchPart>
                    <div className="search-box">
                    <SearchBar
                        placeholder=""
                        search={this.search}
                        enterPressed={this.enterPressed}
                    />
                    <div className="gender">
                        <>
                            {this.state.usage_item.map((item, key)=>{
                                return (
                                    <>
                                        <RadioButton
                                            id={`male_${key}`}
                                            value={item}
                                            label={item !== "" ?item:"全て"}
                                            name="usage"
                                            getUsage={this.selectCategory}
                                            checked={this.state.schCategory === item}
                                        />
                                    </>
                                );
                            })}
                        </>
                    </div>
                    <SelectorWithLabel
                    options={display_order}
                    title="表示順"
                    getSelect={this.getOrderSelect}
                    departmentEditCode={display_order[this.state.search_order].id}
                    />
                    <SelectorWithLabel
                    options={display_class}
                    title="表示区分"
                    getSelect={this.getClassSelect}
                    departmentEditCode={display_class[this.state.search_class].id}
                    />
                    </div>
                </SearchPart>
                <MasterUsage
                    table_data={table_data}
                    editData={this.updateData}
                    delete={this.delete}
                    isLoaded={this.state.isLoaded}
                    usage_group={this.state.usage_group}
                />
                <div className="footer-buttons">
                    {/* <Button className={this.state.curFocus === 1?"focus": ""}>帳票プレビュー</Button> */}
                  <Button className="red-btn" onClick={this.openModal}>新規作成</Button>
                    
                    {/* <Button 使用回数で並べ替え</Button> */}
                </div>
                {this.state.isOpenModal && (
                    <UsageModal
                        modal_data={this.state.modal_data}
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        continueRegister={this.continueRegister}
                        usage_group={this.state.usage_group}
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
            </Card>
            </>
        )
    }
}
Usage.contextType = Context;

Usage.propTypes = {    
    history: PropTypes.object
};

export default Usage