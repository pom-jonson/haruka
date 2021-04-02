import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import CreateTerminalModal from "./CreateTerminalModal";
import TerminalSetting from "./TerminalSetting"
import axios from "axios";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import auth from "~/api/auth";

const Card = styled.div`
  position: fixed;  
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 20px;
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;}
    .footer {
        position: absolute;
        bottom: 40px;
        left: 47%;
        text-align: center;
        button {
          text-align: center;
          border-radius: 4px;
          background: rgb(105, 200, 225); 
          border: none;
          margin-right: 30px;
        }
        
        span {
          color: white;
          font-size: 16px;
          font-weight: 100;
        }
    }
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 100%;
  height: 70px;
  padding: 20px;
  float: left;
  .list-title {
    margin-top: 20px;
    font-size: 20px;
    width: 20%;
  }
  .search-box {
      width: 80%;
      display: flex;
  }
  .label-title {
    width: 95px;
    text-align: right;
    margin-right: 10px;
  }
  .pullbox-select {
      font-size: 14px;
      width: 150px;
  }
 `;
const List = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 16px;
  width: 18%;
  margin-right: 2%;
  height: calc( 100vh - 250px);
  overflow-y:scroll;
  padding: 2px;
  float: left;
  overflow-y: auto;
  border: solid 1px lightgrey;
  .selected {
    background: rgb(105, 200, 225) !important;
    color: white;
  }
  .table-row {
    cursor: pointer;
    font-size: 16px;
    margin: 0;
    padding: 5px 15px;
    &:nth-child(2n) {
      background-color: #f2f2f2;
    }
  }
 `;

const display_order = [
    { id: 0, value: "" },
    { id: 1, value: "IPアドレス", field_name:"ip_addr"},
    { id: 2, value: "ベッド指定", field_name:"bed_number"},
];
const display_class = [
    { id: 0, value: "全て" },
    { id: 1, value: "表示のみ" },
    { id: 2, value: "非表示のみ" },
];

class SystemSettingMaster extends Component {
    constructor(props) {
        super(props);
        let list_array = [
            {0 : "端末設定"},
        ];
        let list_category = [];
        this.state = {
            schVal: "",
            list_array,
            table_data: [],
            isOpenModal: false,
            selected_index: 0,
            list_index: 0,
            modal_data: {},
            search_order: 0,        //表示順
            search_class: 1,        //表示区分
            type: "",
            list_category,
            category:'',

            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            isSpecialDeleteConfirmModal:false,
            confirm_message:"",
        }


    }

    componentDidMount() {
        if(!this.context.$canDoAction(this.context.FEATURES.SYSTEM_SETTING, this.context.AUTHS.READ)) {
            this.props.history.replace("/");
        }
        auth.refreshAuth(location.pathname+location.hash);
    }

    async UNSAFE_componentWillMount(){
        this.getSearchResult();
    }

    // 検索
    getSearchResult = async () => {
        let path = "/app/api/v2/dial/system_master/master_search";
        let post_data = {
            keyword: this.state.schVal,
            is_enabled: this.state.search_class,
            table_kind: this.state.list_index,
            category:this.state.category,
            order:display_order[this.state.search_order].field_name,
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({table_data: data});
    };

    deleteData = async () => {
        let path = "/app/api/v2/dial/system_master/master_delete";
        let post_data = {
            number: this.state.selected_number,
            table_kind: this.state.list_index,
            type: "delete"
        };
        await axios.post(path,  post_data).then(() => {
          window.sessionStorage.setItem("alert_messages", '削除完了##削除しました。');
        });
        this.confirmCancel();
        this.getSearchResult();
    };

    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
            this.getSearchResult();
        }
    };
    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };
    getOrderSelect = e => {                 //表示順
        this.setState({ search_order: parseInt(e.target.id) }, () => {
            this.getSearchResult();
        });
    };
    getClassSelect = e => {                 //表示区分
        this.setState({ search_class: parseInt(e.target.id) }, () => {
            this.getSearchResult();
        });
    };

    // モーダル
    openModal = () => {
        this.setState({
            modal_data: null,
            row_index: -1,
            isOpenModal: true,
        });
    };
    closeModal = () => {
        this.setState({isOpenModal: false});
    };
    handleOk = (str_msg) => {
        this.getSearchResult().then(() => {
            if (str_msg == "update") {
                window.sessionStorage.setItem("alert_messages", "変更完了##" + "変更しました。");
            } else {
                window.sessionStorage.setItem("alert_messages", "登録完了##" + "登録しました。");
            }
            this.setState({
                isOpenModal: false
            });
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

    contextMenuAction = (index, type) => {
        if (type === "edit"){
            this.updateData(index);
        }
        if (type === "delete"){
            this.setState({selected_number:this.state.table_data[index].number}, () => {
                this.delete();
            })
        }
    };

    confirmCancel() {
        this.setState({
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            isSpecialDeleteConfirmModal:false,
            confirm_message: "",
        });
    }

    delete = () => {
        this.setState({
            isDeleteConfirmModal : true,
            confirm_message: this.state.list_array[this.state.list_index][0]  + "マスタ情報を削除しますか?",
        });
    }

    delete_special = (number) => {
        this.setState({
            isSpecialDeleteConfirmModal:true,
            confirm_message: this.state.list_array[this.state.list_index][0]  + "マスタ情報を削除しますか?",
            selected_number:number,
        })
    }

    common_deleteData = async () => {
        let path = "/app/api/v2/dial/master/common_material_delete";
        let post_data = {
            params: this.state.selected_number,
        };
        await axios.post(path,  post_data);
        this.confirmCancel();
        this.getSearchResult();
    };

    handleClick = (e, type) => {
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
            document
                .getElementById("code-table")
                .addEventListener("scroll", function onScrollOutside() {
                    that.setState({
                        contextMenu: { visible: false }
                    });
                    document
                        .getElementById("code-table")
                        .removeEventListener(`scroll`, onScrollOutside);
                });
            this.setState({
                contextMenu: {
                    visible: true,
                    x: e.clientX,
                    y: e.clientY + window.pageYOffset
                },
                favouriteMenuType: type
            });
        }
    };

    render() {
        let {list_array, table_data} = this.state;
        let selected_category = list_array[this.state.selected_index];
        selected_category = selected_category[Object.keys(selected_category)[0]];
        return (
                <Card>
                    <div className="title">システム設定マスタ: {selected_category}</div>
                    <SearchPart>
                        <div className="list-title"></div>
                        <div className="search-box">
                            <SearchBar
                                placeholder=""
                                search={this.search}
                                enterPressed={this.enterPressed}
                            />
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
                    <List>
                        {list_array !== undefined && list_array !== null && list_array.length>0 && (
                            list_array.map((item, index) => {
                                let key = Object.keys(item)[0];
                                return (
                                    <div key={index} className={index === this.state.selected_index ? "selected table-row" : "table-row"} onClick={()=>this.setList(key, index, item[key])}>
                                        {item[key]}
                                    </div>)
                            })
                        )}

                    </List>
                    {this.state.list_index === 0 && (
                        <TerminalSetting
                            table_data={table_data}
                            editData={this.updateData}
                            deleteData={this.deleteData}
                            delete = {this.delete_special}
                        />
                    )}
                    <div className="footer-buttons">                        
                        <Button className="red-btn" onClick={this.openModal}>新規作成</Button>                        
                    </div>
                    {this.state.isOpenModal && (
                        <CreateTerminalModal
                            modal_data={this.state.modal_data}
                            handleOk={this.handleOk}
                            closeModal={this.closeModal}
                            modalType={this.state.list_index}
                            category={this.state.category}
                        />
                    )}
                    {this.state.isDeleteConfirmModal !== false && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.common_deleteData.bind(this)}
                            confirmTitle= {this.state.confirm_message}
                        />
                    )}

                    {this.state.isSpecialDeleteConfirmModal !== false && (
                        <SystemConfirmJapanModal
                            hideConfirm= {this.confirmCancel.bind(this)}
                            confirmCancel= {this.confirmCancel.bind(this)}
                            confirmOk= {this.deleteData.bind(this)}
                            confirmTitle= {this.state.confirm_message}
                        />
                    )}
                </Card>
        )
    }
}
SystemSettingMaster.contextType = Context;

SystemSettingMaster.propTypes = {
    history: PropTypes.object
};

export default SystemSettingMaster