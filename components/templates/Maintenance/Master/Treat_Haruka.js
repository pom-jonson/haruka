import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import TreatModal from "./Modal/TreatModal";
import axios from "axios";
import Checkbox from "~/components/molecules/Checkbox";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import auth from "~/api/auth";
import Spinner from "react-bootstrap/Spinner";
const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
`;
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
    border-left: solid 5px #69c8e1;
  }
  table {
    margin-bottom:0;
    thead{
      display: table;
      width: calc(100% - 17px);
    }
    tbody{
      height: calc(100vh - 17rem);
      overflow-y:scroll;
      display:block;
    }
    tr{
      display: table;
      width: 100%;
      box-sizing: border-box;
    }
    td {
        padding: 0.25rem;
        text-align: center;
    }
    th {
        text-align: center;
        padding: 0.3rem;
        border-bottom-width: 1px;
        border-top:-width: 0;
    }
    th:last{
        border-right: none;
    }
    .tl {
        text-align: left;
    }      
    .tr {
        text-align: right;
    }
 }
.table-check {
    width: 60px;
    label{margin-right:0;}
}
.item-no {
  width: 25px;
}
.code-number{
    width:150px;
}
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  height: 5.5rem;
  width: 100%;
  height: 70px;
  padding: 20px;
  float: left;
  .list-title {
    margin-top: 20px;
    font-size: 1rem;
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
  .pullbox-title{font-size:1rem;}
  .pullbox-select {
      font-size: 1rem;
      width: 150px;
  }
 `;
const List = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 18%;
  margin-right: 2%;
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
    font-size: 1rem;
    margin: 0;
    padding: 5px 15px;
    &:nth-child(2n) {
      background-color: #f2f2f2;
    }
  }
 `;

 const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 80%;  
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 10px;  
  label {
      text-align: right;
  }  
 `;

 const ContextMenuUl = styled.ul`
    margin-bottom: 0;
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
    padding: 0 20px;
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

const display_order = [
    // { id: 0, value: "" },
     { id: 0, value: "表示順", field_name:"order"},
     { id: 1, value: "コード順", field_name:"code"},
];
const display_class = [
    { id: 0, value: "全て" },
    { id: 1, value: "表示のみ" },
    { id: 2, value: "非表示のみ" },
];

const ContextMenu = ({ visible, x,  y,  parent,  favouriteMenuType,}) => {
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    <li><div onClick={() => parent.contextMenuAction(favouriteMenuType,"edit")}>編集</div></li>
                    <li><div onClick={() => parent.contextMenuAction(favouriteMenuType, "delete")}>削除</div></li>
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};

class Treat_Haruka extends Component {
    constructor(props) {
        super(props);
        let list_array = [
            {0 : "実施場所"},
            // {1 : "部位"},
            {2 : "左右"},
            {3 : "品名"},
            {4 : "品名分類"}
        ];
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
            category:'',
            is_loaded: false,
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,            
            confirm_message:"",
        }
    }

    async componentDidMount(){
        auth.refreshAuth(location.pathname+location.hash);
        this.getSearchResult();
    }
    // 検索
    getSearchResult = async () => {
        let path = "/app/api/v2/master/treat/search";
        let post_data = {
            keyword: this.state.schVal,
            is_enabled: this.state.search_class,
            table_kind: this.state.list_index,
            order:display_order[this.state.search_order].field_name,
        };
        this.setState({is_loaded: false});
        let { data } = await axios.post(path, {params: post_data});
        this.setState({table_data: data, is_loaded: true});
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
    handleOk = () => {
        this.getSearchResult().then(() => {
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

    // データ
    setList = (index) => {      
        this.setState({list_index:index, selected_index: index}, () => {
            this.getSearchResult();
        })
    };

    contextMenuAction = (index, type) => {
        if (type === "edit"){
            this.updateData(index);
        }
        if (type === "delete"){
            this.setState({
                selected_number:this.state.table_data[index].number,
                isDeleteConfirmModal : true,
                confirm_message: "「" + this.state.table_data[index].name + "」" + " これを削除して良いですか？",
            })
        }
    };

    confirmCancel() {
        this.setState({
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,            
            confirm_message: "",
        });
    }
    
    deleteData = async () => {
        let path = "/app/api/v2/master/treat/delete";
        let post_data = {
            params:{
                number: this.state.selected_number,
                table_kind: this.state.list_index, 
            }
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
        return (
            <>
            <Card>
                <div className="title">処置関連マスタ</div>
                <SearchPart>
                    <div className="list-title">マスター覧</div>
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
                        <div key={index} className={key == this.state.selected_index ? "selected table-row" : "table-row"} onClick={()=>this.setList(key)}>
                            {item[key]}
                        </div>)
                  })
                )}

                </List>                
                <Wrapper>
                    {this.state.list_index == 0 && (        //実施場所マスタ
                      <table className="table table-bordered table-striped table-hover">
                      <thead>
                          <tr>
                              <th className="item-no"/>
                              <th className="table-check">表示</th>
                              <th className="code-number">実施場所ID</th>
                              <th className="name">実施場所名</th>
                          </tr>
                      </thead>
                          <tbody id="code-table">
                          {this.state.is_loaded ? (
                            <>
                              {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                                  table_data.map((item, index) => {
                                      return (
                                      <>
                                      <tr onContextMenu={e => this.handleClick(e, index)}>
                                          <td className="item-no">{index+1}</td>
                                          <td className="text-center table-check">
                                          <Checkbox
                                              label=""
                                              // getRadio={this.getRadio.bind(this)}
                                              isDisabled={true}
                                              value={item.is_enabled}
                                              name="check"
                                          />
                                          </td>
                                          <td className="code-number text-right">{item.location_id}</td>
                                          <td className="text-left">{item.name}</td>
                                      </tr>
                                      </>)
                                  })
                              )}
                            </>
                          ):(
                            <div style={{width:"100%", height: "100%"}}>
                                <SpinnerWrapper>
                                    <Spinner animation="border" variant="secondary" />
                                </SpinnerWrapper>
                            </div>
                          )}
                          </tbody>
                      </table>
                    )}
                    {this.state.list_index == 1 && (        //部位マスタ
                      <table className="table table-bordered table-striped table-hover">
                      <thead>
                          <tr>
                              <th className="item-no"/>
                              <th className="table-check">表示</th>
                              <th className="code-number">部位ID</th>
                              <th className="name border-right">部位名</th>
                          </tr>
                      </thead>
                      <tbody id="code-table">
                      {this.state.is_loaded ? (
                        <>
                          {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                              table_data.map((item, index) => {
                                  return (
                                  <>
                                  <tr onContextMenu={e => this.handleClick(e, index)}>
                                      <td className="item-no">{index+1}</td>
                                      <td className="text-center table-check">
                                      <Checkbox
                                          label=""
                                          // getRadio={this.getRadio.bind(this)}
                                          isDisabled={true}
                                          value={item.is_enabled}
                                          name="check"
                                      />
                                      </td>
                                      <td className="code-number">{item.part_id}</td>
                                      <td>{item.name}</td>
                                  </tr>
                                  </>)
                              })
                          )}
                        </>
                      ):(
                        <div style={{width:"100%", height: "100%"}}>
                            <SpinnerWrapper>
                                <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                        </div>
                      )}
                      </tbody>
                      </table>      
                    )}
                    {this.state.list_index == 2 && (        //左右マスタ
                      <table className="table table-bordered table-striped table-hover">
                      <thead>
                          <tr>
                              <th className="item-no"/>
                              <th className="table-check">表示</th>
                              <th className="code-number">左右ID</th>
                              <th className="name">左右名</th>
                          </tr>
                      </thead>
                      <tbody id="code-table">
                      {this.state.is_loaded ? (
                        <>
                          {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                              table_data.map((item, index) => {
                                  return (
                                  <>
                                  <tr onContextMenu={e => this.handleClick(e, index)}>
                                      <td className="item-no">{index+1}</td>
                                      <td className="text-center table-check">
                                      <Checkbox
                                          label=""
                                          // getRadio={this.getRadio.bind(this)}
                                          isDisabled={true}
                                          value={item.is_enabled}
                                          name="check"
                                      />
                                      </td>
                                      <td className="code-number">{item.side_id}</td>
                                      <td>{item.name}</td>
                                  </tr>
                                  </>)
                              })
                          )}
                       </>
                      ):(
                        <div style={{width:"100%", height: "100%"}}>
                            <SpinnerWrapper>
                                <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                        </div>
                      )}
                      </tbody>
                      </table>
                    )}
                    {this.state.list_index == 3 && (        //品名マスタ
                      <table className="table table-bordered table-striped table-hover">
                      <thead>
                          <tr>
                              <th className="item-no"/>
                              <th className="table-check">表示</th>
                              <th className="code-number">品名ID</th>
                              <th className="name">品名</th>
                              <th style={{width:'5rem'}}>単位名</th>
                          </tr>
                      </thead>
                      <tbody id="code-table">
                      {this.state.is_loaded ? (
                        <>
                          {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                              table_data.map((item, index) => {
                                  return (
                                  <>
                                  <tr onContextMenu={e => this.handleClick(e, index)}>
                                      <td className="item-no">{index+1}</td>
                                      <td className="text-center table-check">
                                      <Checkbox
                                          label=""
                                          // getRadio={this.getRadio.bind(this)}
                                          isDisabled={true}
                                          value={item.is_enabled}
                                          name="check"
                                      />
                                      </td>
                                      <td className="code-number">{item.item_id}</td>
                                      <td>{item.name}</td>
                                      <td style={{width:'5rem'}}>{item.unit_name!=null?item.unit_name:item.main_unit}</td>
                                  </tr>
                                  </>)
                              })
                          )}
                          </>
                      ):(
                        <div style={{width:"100%", height: "100%"}}>
                            <SpinnerWrapper>
                                <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                        </div>
                      )}
                          </tbody>
                      </table>      
                    )}
                    {this.state.list_index == 4 && (        //品名分類マスタ
                      <table className="table table-bordered table-striped table-hover">
                      <thead>
                          <tr>
                              <th className="item-no"/>
                              <th className="table-check">表示</th>
                              <th className="code-number">分類ID</th>
                              <th className="name">分類名</th>
                          </tr>
                      </thead>
                      <tbody id="code-table">
                      {this.state.is_loaded ?(
                        <>
                        {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                              table_data.map((item, index) => {
                                  return (
                                  <>
                                  <tr onContextMenu={e => this.handleClick(e, index)}>
                                      <td className="item-no">{index+1}</td>
                                      <td className="text-center table-check">
                                      <Checkbox
                                          label=""
                                          // getRadio={this.getRadio.bind(this)}
                                          isDisabled={true}
                                          value={item.is_enabled}
                                          name="check"
                                      />
                                      </td>
                                      <td className="code-number">{item.item_category_id}</td>
                                      <td>{item.name}</td>
                                  </tr>
                                  </>)
                              })
                          )}
                        </>
                      ):(
                        <div style={{width:"100%", height: "100%"}}>
                            <SpinnerWrapper>
                                <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                        </div>
                      )}
                      </tbody>
                      </table>      
                    )}
                    <ContextMenu
                        {...this.state.contextMenu}
                        parent={this}
                        favouriteMenuType={this.state.favouriteMenuType}
                    />
                </Wrapper>

                <div className="footer-buttons">
                    {/* <Button type="mono" className={this.state.curFocus === 1?"focus": ""}>帳票プレビュー</Button> */}
                    <Button onClick={this.openModal} className="red-btn">新規作成</Button>
                </div>
                {this.state.isOpenModal && (
                    <TreatModal
                        modal_data={this.state.modal_data}
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        modal_type={this.state.list_index}
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

export default Treat_Haruka