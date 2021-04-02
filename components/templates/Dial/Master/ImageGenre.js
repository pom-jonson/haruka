import React, { Component, useContext } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Checkbox from "~/components/molecules/Checkbox";
import Button from "~/components/atoms/Button";
import ImageGenreModal from "../modals/ImageGenreModal";
import RadioButton from "~/components/molecules/RadioInlineButton";
import axios from "axios";
import Context from "~/helpers/configureStore";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 20rem;
  display: flex;
`;

const Card = styled.div`
  position: fixed;  
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  float: left;
  background-color: ${surface};
  padding: 1.25rem;
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;}
    .footer {
        margin-top: 0.625rem;
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
  padding: 0.625rem;
  float: left;
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
      width: 9rem;
  }
  .gender {
    font-size: 1rem;
    margin-left: 1rem;
    .radio-btn label{
        width: 4.7rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.3rem;
        padding: 0.25rem 0.3rem;
    }
  }
 `;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  // height: calc( 100vh - 15.625rem);
  border: solid 1px lightgrey;
  margin-bottom: 0.625rem;
  // overflow-y: scroll;
  label {
      text-align: right;
      margin: 0;
  }
  table {
    margin-bottom:0px;
    thead{
      display:table;
      width:100%;
    }
    tbody{
      display:block;
      overflow-y: auto;
      height: calc( 100vh - 16rem);
      width:100%;
    }
    tr{
      display: table;
      width: 100%;
    }
    tr:nth-child(even) {background-color: #f2f2f2;}
    tr:hover{background-color:#e2e2e2 !important;}
    td {
      word-break: break-all;
      padding: 0.25rem;
    }
    th {
        position: sticky;
        text-align: center;
        padding: 0.3rem;
    }
    .table-check {
        width: 3.75rem;
    }
    .item-no {
      width: 3.125rem;
    }
    .code-number {
        width: 6.5rem;
    }
    .name{
      width:23rem;
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
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0 0rem;
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
  .blue-text {
    color: blue;
  }
`;


const display_order = [
  { id: 0, value: "ジャンル名称", field_name:"name"},
  { id: 1, value: "カナ名称", field_name:"name_kana"},
  { id: 2, value: "コード順", field_name:"number"},
];
const display_class = [
  { id: 0, value: "全て" },
  { id: 1, value: "表示のみ" },
  { id: 2, value: "非表示のみ" },    
];

const ContextMenu = ({ visible, x,  y,  parent,  favouriteMenuType,}) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
  if (visible) {
      return (
          <ContextMenuUl>
              <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                {$canDoAction(FEATURES.DIAL_IMAGE_GENRE_MASTER,AUTHS.EDIT,0) != false && (
                  <li><div onClick={() => parent.contextMenuAction(favouriteMenuType,"edit")}>編集</div></li>
                )}
                {$canDoAction(FEATURES.DIAL_IMAGE_GENRE_MASTER,AUTHS.DELETE,0) != false && (
                  <li><div onClick={() => parent.contextMenuAction(favouriteMenuType, "delete")}>削除</div></li>
                )}
              </ul>
          </ContextMenuUl>
      );
  } else {
      return null;
  }
};

const usage_item = ["画像", "書類", '全て'];
class ImageGenre extends Component {
    constructor(props) {
        super(props);
        
        let list_item = [];
        this.state = {
            schVal: "",
            list_item,
            isOpenCodeModal: false,
            isLoaded: false,
            category: 2,
            modal_data:{},
            sort_order:1,
            display_item:1,
            isDeleteConfirmModal:false,
        }
    }

    async componentDidMount(){
      this.searchImageData();
    }

    // 検索
    searchImageData = async () => {
        let path = "/app/api/v2/dial/master/image_search";
        let post_data = {
            keyword: this.state.schVal,
            is_enabled: this.state.display_item!=0?this.state.display_item:'',
            order:display_order[this.state.sort_order].field_name,
            category: this.state.category ==2?undefined:usage_item[this.state.category],
            
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({list_item: data, isLoaded: true});
    };

    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === 13) {
          this.setState({
            isLoaded: false
          },()=>{                          
            this.searchImageData();
          });
        }
    };
    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };
    getSortOrder = e => {
      this.setState({ sort_order: parseInt(e.target.id), isLoaded: false}, () => {
        this.searchImageData();
      });
    }
  
    getDisplayClass = e => {
      this.setState({ display_item: parseInt(e.target.id), isLoaded: false}, () => {
        this.searchImageData();
      });
    }
    createCode = () => {
      if (this.context.$canDoAction(this.context.FEATURES.DIAL_IMAGE_GENRE_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
        return;
      }
        this.setState({
          isOpenCodeModal: true,
          modal_data:null
        });
    }
    closeModal = () => {
        this.setState({isOpenCodeModal: false})
    }    
    selectCategory = (e) => {
      this.setState({ category: parseInt(e.target.value), isLoaded: false}, () => {
        this.searchImageData();
      });
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
      }
    
      contextMenuAction = (index, type) => {
        if (type === "edit"){
            this.editData(index);
        }
        if (type === "delete"){
          this.setState({
            isDeleteConfirmModal:true,
            confirm_message:'削除しますか？',
            selected_number:this.state.list_item[index].number,
          })
        }
      };
  
      editData = (index) => {
        let modal_data = this.state.list_item[index];
        this.setState({
            modal_data,
            // row_index: index,
            isOpenCodeModal: true
        });
      };
  
      deleteData = async () => {
        this.confirmCancel();
        let path = "/app/api/v2/dial/master/image_delete";
        let post_data = {
            params: this.state.selected_number,
        };
        await axios.post(path,  post_data);
        window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
        this.setState({
          isLoaded: false
        },()=>{                        
          this.searchImageData();
        });
      };
      
    handleOk = () => {
      this.setState({
        isLoaded: false
      },()=>{                      
        this.searchImageData().then(() => {
          this.setState({
            isOpenCodeModal: false
          });
        });
      });
    }
    confirmCancel = () => {
      this.setState({
        confirm_message:'',
        isDeleteConfirmModal:false,
      })
    }
    render() {
      let tooltip = '';
      if (this.context.$canDoAction(this.context.FEATURES.DIAL_IMAGE_GENRE_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
        tooltip = "登録権限がありません。";
      }
        let {list_item} = this.state;
        return (
            <Card>
                <div className="title">画像ジャンルマスタ</div>
                <SearchPart>
                  <div className="search-box">
                    <SearchBar
                        placeholder=""
                        search={this.search}
                        enterPressed={this.enterPressed}
                    />
                    <div className="gender">
                      <>
                      {usage_item.map((item, key)=>{
                        return (
                          <>
                            <RadioButton
                              id={`male_${key}`}
                              value={key}
                              label={item}
                              name="usage"
                              getUsage={this.selectCategory}
                              checked={this.state.category == key ? true : false}
                            />
                        </>
                        );
                      })}
                    </>
                    </div>
                    <SelectorWithLabel
                      options={display_order}
                      title="表示順"
                      getSelect={this.getSortOrder}
                      departmentEditCode={this.state.sort_order}
                    />
                    <SelectorWithLabel
                      options={display_class}
                      title="表示区分"
                      getSelect={this.getDisplayClass}
                      departmentEditCode={this.state.display_item}
                    />                    
                  </div>
                </SearchPart>
                <Wrapper>
                    <table className="table table-bordered table-hover">
                      <thead>
                        <tr>
                          <th className="item-no"></th>
                          <th className="table-check">表示</th>
                          <th style={{width:'10rem'}}>VA画像履歴の表示</th>
                          <th className="code-number">コード番号</th>
                          <th className="name">ジャンル名称</th>
                          <th className='name'>カナ名称</th>
                          <th style={{width:'3rem'}}>区分</th>
                          <th>略称</th>
                        </tr>
                      </thead>
                      <tbody id="code-table">
                        {this.state.isLoaded == false ? (
                          <div className='spinner-disease-loading center'>
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          </div>
                        ):(
                          <>
                            {list_item !== undefined && list_item !== null && list_item.length > 0 && (
                              list_item.map((item, index) => {
                                return (
                                <>
                                  <tr onContextMenu={e => this.handleClick(e, index)}>
                                    <td className="item-no text-center">{index+1}</td>
                                    <td className="table-check text-center">
                                      <Checkbox
                                          label=""
                                          // getRadio={this.getRadio.bind(this)}
                                          isDisabled={true}
                                          value={item.is_enabled ===1}
                                          name="check"
                                      /> 
                                    </td>
                                    <td className="text-center" style={{width:'10rem'}}>
                                      <Checkbox
                                          label=""
                                          // getRadio={this.getRadio.bind(this)}
                                          isDisabled={true}
                                          value={item.is_va_record ===1}
                                          name="check"
                                      />
                                    </td>
                                    <td className="text-center code-number">{item.number}</td>
                                    <td className='name'>{item.name}</td>
                                    <td className='name'>{item.name_kana}</td>
                                    <td style={{width:'3rem'}} className="text-center">{item.category}</td>
                                    <td>{item.name_short}</td>
                                  </tr>
                                </>)
                              })
                            )}
                          </>
                        )}

                      </tbody>
                    </table>
                </Wrapper>
                <div className="footer-buttons">
                    <Button className={tooltip != '' ? "disable-btn" : "red-btn"} tooltip={tooltip} onClick={this.createCode}>新規作成</Button>
                </div>
                {this.state.isOpenCodeModal && (
                    <ImageGenreModal
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        usage_item = {usage_item}
                        modal_data = {this.state.modal_data}
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
                favouriteMenuType={this.state.favouriteMenuType}
                />
            </Card>
        )
    }
}
ImageGenre.contextType = Context;

export default ImageGenre;