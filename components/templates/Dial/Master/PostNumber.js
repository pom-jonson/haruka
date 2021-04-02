import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Pagination from "~/components/molecules/Pagination";
// import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import AddressModal from "../modals/AddressModal";
import axios from "axios";

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
        margin-top: 10px;
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
          font-size: 20px;
          font-weight: 100;
        }
    }
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  height: 70px;
  padding: 20px;
  float: left;
  .list-title {
    margin-top: 20px;
    font-size: 18px;
    width: 20%;
  }
  .search-box {
      width: 100%;
      display: block;
  }  
  .label-title {
    width: 95px;
    text-align: right;
    margin-right: 10px;
  }
  .pullbox-title{font-size:18px;}
  .pullbox-select {
      font-size: 18px;
      width: 200px;
      float:right;
  }
  button{
    height: min-content;
    margin-left: 60px;
  }
  .pullbox{
      float:right;
  }
  .search-bar{
      float:left;
  }
 `; 
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 18px;
  width: 100%;
  height: calc( 100vh - 300px);
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 10px;
  label {
      text-align: right;
  }
  table {
      tr:nth-child(even) {background-color: #f2f2f2;}
      tr:hover{background-color:#e2e2e2 !important;}
      td {
          padding: 0.25rem;
      }
      th {
          text-align: center;
          padding: 0.3rem;
      }
      .table-check {
          width: 60px;
      }
      .item-no {
        width: 50px;
      }
      .code-number {
          width: 120px;
      }
  }

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
    font-size: 16px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
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
 
const sort_order = [
    { id: 0, value: "郵便番号", field_name:"zip_code"},
    { id: 1, value: "都道府県", field_name:"prefecture"},
    { id: 2, value: "市町村", field_name:"city"},
    { id: 3, value: "番地", field_name:"address"}
];
const ContextMenu = ({ visible, x,  y,  parent,  row_index,}) => {
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    <li><div onClick={() => parent.contextMenuAction(row_index,"edit")}>編集</div></li>
                    <li><div onClick={() => parent.contextMenuAction(row_index, "delete")}>削除</div></li>
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};
class PostNumber extends Component {
    constructor(props) {
        super(props);       
        let list_item = [];
        let prefecture_list = [];
        this.state = {
            schVal: "",            
            list_item,
            pageOfItems: [],
            modal_data:{},
            search_order:0, 
            search_prefecture:"",
            prefecture_list, 
            isEditAddressModal:false,      
        }
        this.getPrefectureList();        
    }

    async UNSAFE_componentWillMount(){
        this.searchAddress();
    }

    getPrefectureList = async () => {
        let path = "/app/api/v2/dial/master/prefecture_search";        
        let { data } = await axios.post(path, {params: ""});
        var tmp=[{id:'', value:''}];
        data.map((item) => {
            tmp.push({id:item.prefecture, value:item.prefecture});
        })
        this.setState({prefecture_list: tmp});
    }
    // 検索
    searchAddress = async () => {
        let path = "/app/api/v2/dial/master/zipcode_search";
        let post_data = {
            keyword: this.state.schVal,    
            prefecture:this.state.search_prefecture,                    
            order: sort_order[this.state.search_order].field_name,
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({list_item: data});
    };
    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
        this.searchAddress();
        }
    };
    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };

    onChangePage(pageOfItems) {    
        this.setState({ pageOfItems: pageOfItems });
    }

    getOrderSelect = e => {                 //表示順
        this.setState({ search_order: parseInt(e.target.id) }, () => {
            this.searchAddress();
        });
    };

    getPrefecture = e => {
        this.setState({ search_prefecture: e.target.value }, () => {
            this.searchAddress();
        });
    }

    handleClick = (e, index) => {
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
            row_index: index
          });
        }
    }
          
    contextMenuAction = (index, type) => {
      if (type === "edit"){
          this.editData(index);
      }
      if (type === "delete"){
          this.deleteData(this.state.list_item[index].number);
      }
    };

    closeModal = () => {
        this.setState({isEditAddressModal: false})
    };

    handleOk = () => {
        this.searchAddress().then(() => {
            this.setState({
                isEditAddressModal: false
            });
        });
      }; 
    editData = (index) => {
      let modal_data = this.state.list_item[index];
      this.setState({
          modal_data,
          // row_index: index,
          isEditAddressModal: true
      });
    };

    deleteData = async (index) => {
      let path = "/app/api/v2/dial/master/zipcode_delete";
      let post_data = {
          params: index,                    
      };
      await axios.post(path,  post_data);
      this.searchAddress();
    };
    render() {
        let {list_item, pageOfItems} = this.state;
        return (
            <Card>
                <div className="title">郵便番号更新</div>
                <SearchPart>
                    
                    <div className="search-box">
                        <div className="search-bar">
                            <SearchBar
                                placeholder=""
                                search={this.search}
                                enterPressed={this.enterPressed}                                                
                            />
                        </div>
                    {/* <Button type="mono" className={this.state.curFocus === 1?"focus": ""}>岡山</Button> */}
                                    
                    <SelectorWithLabel
                        options={sort_order}
                        title="表示順"
                        getSelect={this.getOrderSelect}
                        departmentEditCode={sort_order[this.state.search_order].id}
                    />
                    <SelectorWithLabel
                        options={this.state.prefecture_list}
                        title=""
                        getSelect={this.getPrefecture}
                        departmentEditCode={this.state.search_prefecture}
                    />
                    </div>
                </SearchPart>                
                <Wrapper>
                    <table className="table-scroll table table-bordered" id="code-table">
                        <thead>
                        <tr>
                            <th  className="item-no"></th>
                            <th className="table-check">郵便番号</th>
                            <th className="code-number">都道府県</th>
                            <th className="name">市町村</th>
                            <th className="">番地</th>
                            {/* <th>カナ</th> */}
                        </tr>
                        </thead>
                        <tbody>
                        
                        {pageOfItems !== undefined && pageOfItems !== null && pageOfItems.length > 0 && (
                            pageOfItems.map((item, index) => {
                                return (
                                <>
                                <tr onContextMenu={e => this.handleClick(e, index)}>
                                    <td className="text-center">{index+1}</td>
                                    <td className="text-center">{item.zip_code}</td>
                                    <td className="text-center">{item.prefecture}</td>
                                    <td className="text-center">{item.city}</td>
                                    <td className="text-center">{item.address}</td>
                                    {/* <td>{item.kana_address}</td> */}
                                </tr>
                                </>)
                            })
                        )}
                        </tbody>
                    </table>                    
                </Wrapper>                
                <Pagination 
                        items={list_item}
                        onChangePage={this.onChangePage.bind(this)} 
                    />
                <div className="footer">
                    <Button type="mono" className={this.state.curFocus === 1?"focus": ""}>最新マスターに変更</Button>                    
                </div>    
                {this.state.isEditAddressModal && (
                    <AddressModal
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}                        
                        modal_data = {this.state.modal_data}
                    />
                )} 
                <ContextMenu
                {...this.state.contextMenu}
                parent={this}
                row_index={this.state.row_index}
                />          
            </Card>
        )
    }
}

export default PostNumber