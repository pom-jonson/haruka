import React, { Component, useContext } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Button from "~/components/atoms/Button";
import MaterialModal from "../modals/MaterialModal";
import MasterDialyzer from "./MasterDialyzer"
import DialMethod from "./DialMethod"
import MasterAnticoagulation from "./MasterAnticoagulation"
import MasterAnticoagulationPattern from "./MasterAnticoagulationPattern"
import MasterConsole from "./MasterConsole"
import axios from "axios";
import Checkbox from "~/components/molecules/Checkbox";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialMasterPrintPreview from "~/components/templates/Dial/Master/DialMasterPrintPreview";
import Context from "~/helpers/configureStore";

const Card = styled.div`
  position: fixed;  
  top: 0px;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;  
  background-color: ${surface};
  padding: 1.25rem;
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;}
    .footer {
        position: absolute;
        bottom: 2.5rem;
        left: 47%;
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
  .list-title {
    margin-top: 1.25rem;
    font-size: 1rem;
    width: 20%;
  }
  .search-box {
      width: 80%;
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
      width: 9.375rem;
  }
 `;
const List = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 13%;
  margin-right: 2%;
  height: calc( 100vh - 15.625rem);
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
    font-size: 1rem;
    margin: 0;
    padding: 0.3rem 1rem;
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
  width: 85%;
  float:left;
  border: solid 1px lightgrey;
  margin-bottom: 0.625rem;  
  label {
      text-align: right;
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
        height: calc( 100vh - 19rem);
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
          font-size:0.9rem;
          padding: 0.25rem;
      }
      th {
          font-size:0.9rem;
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      }
      .table-check {
          width: 3rem;
      }
      .item-no {
        width: 1.875rem;
      }
      .code-number {
          width: 5.625rem;
      }
      .name{
          width:10rem;
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

const ContextMenu = ({ visible, x,  y,  parent,  favouriteMenuType,}) => {
  const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    {$canDoAction(FEATURES.DIAL_MATERIAL_MASTER,AUTHS.EDIT,0) != false && (
                        <li><div onClick={() => parent.contextMenuAction(favouriteMenuType,"edit")}>編集</div></li>
                    )}
                    {$canDoAction(FEATURES.DIAL_MATERIAL_MASTER,AUTHS.DELETE,0) != false && (
                        <li><div onClick={() => parent.contextMenuAction(favouriteMenuType, "delete")}>削除</div></li>
                    )}
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};

class Material extends Component {
    constructor(props) {
        super(props);
        let list_array = [
            {0 : "ダイアライザ"},
            {'category' : '穿刺針'},
            {'category' : '透析液'},
            {1: "治療法"},
            {2: "抗凝固法"},
            {3: "抗凝固法パターン"},
            {'category' : '固定テープ'},
            {'category' : '消毒薬'},
            {4: "コンソール",},
            {'category' : '車椅子'}
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
            search_order: 2,        //表示順
            search_class: 1,        //表示区分
            type: "",
            list_category,
            category:'',

            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            isSpecialDeleteConfirmModal:false,
            isOpenPreviewModal:false,
            confirm_message:"",
        };
        this.table_head = {};
        this.modal_type = "dialyzer";
        this.table_head['code'] = "コード";
        this.table_head['name'] = "名称";
        this.table_head['name_kana'] = "カナ名称";
        this.table_head['name_short'] = "略称";
        this.table_head['jan_code'] = "JANコード";
        this.table_head['membrane_area'] = "膜面積";
        this.table_head['cl'] = "CL";
        this.table_head['blood_flow_rate'] = "血液流量";
        this.table_head['dialysate_flow_rate'] = "透析液流量";
        this.table_head['efficiency'] = "効率";
        this.table_head['flow_rate_ratio'] = "流量比";
        this.table_head['k'] = "K";
        this.table_head_style = {};
        this.table_head_style['code'] = "right";
        this.table_head_style['name'] = "left";
        this.table_head_style['name_kana'] = "left";
        this.table_head_style['name_short'] = "left";
        this.table_head_style['jan_code'] = "right";
        this.table_head_style['membrane_area'] = "right";
        this.table_head_style['cl'] = "right";
        this.table_head_style['blood_flow_rate'] = "right";
        this.table_head_style['dialysate_flow_rate'] = "right";
        this.table_head_style['efficiency'] = "right";
        this.table_head_style['flow_rate_ratio'] = "right";
        this.table_head_style['k'] = "right";
    }

    async componentDidMount(){
        this.getAllCategory();
        this.getSearchResult();
    }

    getAllCategory = async () => {
        let path = "/app/api/v2/dial/master/get_common_category";
        let post_data = {          
        };
        let { data } = await axios.post(path, {params: post_data});
        var temp = [...this.state.list_array, ...data];
        this.setState({list_array:temp});        
    };

    // 検索
    getSearchResult = async () => {
        let path = "/app/api/v2/dial/master/material_search";
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
       if (this.context.$canDoAction(this.context.FEATURES.DIAL_MATERIAL_MASTER,this.context.AUTHS.REGISTER, 0) === false) {
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
        this.setState({isOpenModal: false});
        if (this.state.list_index == 3) this.getSearchResult();
    };
    handleOk = () => {
        this.setState({
            isOpenModal: false
        });
        this.getSearchResult();
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
    setList = (key, index, category) => {
      if (key=='category'){
          this.table_head = {};
          this.table_head['code'] = "コード番号";
          this.table_head['name'] = "名称";
          this.table_head['name_short'] = "略称";
          if (category == '車椅子'){
            this.table_head['value'] = "重量(kg)";
          }
          this.table_head['name_kana'] = "カナ名称";          
          this.table_head_style = {};
          this.table_head_style['code'] = "right";
          this.table_head_style['name'] = "left";
          this.table_head_style['name_short'] = "left";
          if (category == '車椅子'){
            this.table_head_style['value'] = "right";
          }
          this.table_head_style['name_kana'] = "left";
          this.modal_type = "material";          
          this.setState({category:category, list_index:-1, selected_index: index}, () => {
              this.getSearchResult();
          })
      } else {
          let list_index = parseInt(key);
          this.table_head = {};
          this.table_head_style = {};
          switch (list_index){
              case 0:
                  this.modal_type = "dialyzer";
                  this.table_head['code'] = "コード";
                  this.table_head['name'] = "名称";
                  this.table_head['name_kana'] = "カナ名称";
                  this.table_head['name_short'] = "略称";
                  this.table_head['jan_code'] = "JANコード";
                  this.table_head['membrane_area'] = "膜面積";
                  this.table_head['cl'] = "CL";
                  this.table_head['blood_flow_rate'] = "血液流量";
                  this.table_head['dialysate_flow_rate'] = "透析液流量";
                  this.table_head['efficiency'] = "効率";
                  this.table_head['flow_rate_ratio'] = "流量比";
                  this.table_head['k'] = "K";
                  this.table_head_style = {};
                  this.table_head_style['code'] = "right";
                  this.table_head_style['name'] = "left";
                  this.table_head_style['name_kana'] = "left";
                  this.table_head_style['name_short'] = "left";
                  this.table_head_style['jan_code'] = "right";
                  this.table_head_style['membrane_area'] = "right";
                  this.table_head_style['cl'] = "right";
                  this.table_head_style['blood_flow_rate'] = "right";
                  this.table_head_style['dialysate_flow_rate'] = "right";
                  this.table_head_style['efficiency'] = "right";
                  this.table_head_style['flow_rate_ratio'] = "right";
                  this.table_head_style['k'] = "right";
                  break;
              case 1:
                  this.modal_type = "dial_method";
                  this.table_head['code'] = "コード番号";
                  this.table_head['name'] = "名称";
                  this.table_head['name_kana'] = "カナ名称";
                  this.table_head['name_short'] = "略称";
                  this.table_head['dialysis_method_category'] = "治療法区分";
                  this.table_head['mode_number'] = "共通送信プロトコル番号";
                  this.table_head_style['code'] = "right";
                  this.table_head_style['name'] = "left";
                  this.table_head_style['name_kana'] = "left";
                  this.table_head_style['name_short'] = "left";
                  this.table_head_style['dialysis_method_category'] = "left";
                  this.table_head_style['mode_number'] = "right";
                  break;
              case 2:
                  this.modal_type = "anticoagulation";
                  this.table_head['code'] = "コード番号";
                  this.table_head['name'] = "名称";
                  this.table_head['name_kana'] = "カナ名称";
                  this.table_head['name_short'] = "略称";
                  this.table_head['unit'] = "単位";
                  this.table_head['category'] = "区分";
                  this.table_head_style['code'] = "right";
                  this.table_head_style['name'] = "left";
                  this.table_head_style['name_kana'] = "left";
                  this.table_head_style['name_short'] = "left";
                  this.table_head_style['unit'] = "left";
                  this.table_head_style['category'] = "left";
                  break;
              case 3:
                  this.modal_type = "anticoagulation_pattern";
                  this.table_head['code'] = "コード番号";
                  this.table_head['name'] = "名称";
                  this.table_head['name_kana'] = "カナ名称";
                  this.table_head['name_short'] = "略称";
                  this.table_head_style['code'] = "right";
                  this.table_head_style['name'] = "left";
                  this.table_head_style['name_kana'] = "left";
                  this.table_head_style['name_short'] = "left";                  
                  break;
              case 4:
                  this.modal_type = "console";
                  this.table_head['code'] = "コード";
                  this.table_head['name'] = "名称";
                  this.table_head['name_kana'] = "カナ名称";
                  this.table_head['name_short'] = "略称";
                  this.table_head['manufacturer'] = "メーカー";
                  this.table_head['water_removal_speed_calculation'] = "除水速度計算";
                  this.table_head['has_builtin_sphygmomanometer'] = "血圧計内蔵";
                  this.table_head['protocol'] = "通信プロトコル";
                  this.table_head['communication_method'] = "通信方法";
                  this.table_head['ip_addr'] = "IPアドレス";
                  this.table_head['port'] = "ポート";
                  this.table_head['com_port'] = "COMポート";
                  this.table_head_style['code'] = "right";
                  this.table_head_style['name'] = "left";
                  this.table_head_style['name_kana'] = "left";
                  this.table_head_style['name_short'] = "left";
                  this.table_head_style['manufacturer'] = "left";
                  this.table_head_style['water_removal_speed_calculation'] = "left";
                  this.table_head_style['has_builtin_sphygmomanometer'] = "left";
                  this.table_head_style['protocol'] = "left";
                  this.table_head_style['communication_method'] = "left";
                  this.table_head_style['ip_addr'] = "left";
                  this.table_head_style['port'] = "right";
                  this.table_head_style['com_port'] = "right";
                  break;
            }
        this.setState({category:'', list_index, selected_index: index}, () => {
            this.getSearchResult();
        })
      }      
    };

    contextMenuAction = (index, type) => {
        if (type === "edit"){
            this.updateData(index);
        }
        if (type === "delete"){
            this.setState({selected_number:this.state.table_data[index].number}, () => {
                this.delete(this.state.table_data[index].name);
            })            
        }
    };

    confirmCancel=()=>{
        this.setState({
            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            isSpecialDeleteConfirmModal:false,
            confirm_message: "",
            isOpenPreviewModal: false,
        });
    };
  
    delete = (name) => {
        this.setState({
            isDeleteConfirmModal : true,
            confirm_message: "「" + name + "」" + " これを削除して良いですか？",
        });
    }    
    
    delete_special = (number, name) => {
        this.setState({
            isSpecialDeleteConfirmModal:true,
            confirm_message: "「" + name + "」" + " これを削除して良いですか？",
            selected_number:number,
        })
    }

    
    deleteData = async () => {
        let path = "/app/api/v2/dial/master/dial_method_register";
        let post_data = {
            params: this.state.selected_number,
            table_kind: this.state.list_index,
            type: "delete"
        };
        await axios.post(path,  post_data);
        window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
        this.confirmCancel();
        this.getSearchResult();
    };

    common_deleteData = async () => {
        let path = "/app/api/v2/dial/master/common_material_delete";
        let post_data = {
            params: this.state.selected_number,                    
        };
        await axios.post(path,  post_data);
        window.sessionStorage.setItem("alert_messages",  "削除完了##" + "削除しました。");
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

    openPreviewModal=()=>{
        this.setState({isOpenPreviewModal:true});
    };

    render() {
        let {list_array, table_data} = this.state;
        let selected_category = list_array[this.state.selected_index];
        selected_category = selected_category[Object.keys(selected_category)[0]];
        return (
            <>
            <Card>
                <div className="title">資材マスタ: {selected_category}</div>
                <SearchPart>
                    <div className="list-title">コード一覧</div>
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
                {this.state.list_index === 0 && (       //ダイアライザ
                    <MasterDialyzer
                        table_data={table_data}
                        editData={this.updateData}
                        deleteData={this.deleteData}
                        delete = {this.delete_special}
                    />
                )}
                {this.state.list_index === 1 && (       //治療法
                    <DialMethod
                        table_data={table_data}
                        editData={this.updateData}
                        deleteData={this.deleteData}
                        delete = {this.delete_special}
                    />
                )}
                {this.state.list_index === 2 && (       //抗凝固法
                    <MasterAnticoagulation
                        table_data={table_data}
                        editData={this.updateData}
                        deleteData={this.deleteData}
                        delete = {this.delete_special}
                    />
                )}
                {this.state.list_index === 3 && (       //抗凝固法パターン
                    <MasterAnticoagulationPattern
                        table_data={table_data}
                        editData={this.updateData}
                        deleteData={this.deleteData}
                        delete = {this.delete_special}
                    />
                )}
                {this.state.list_index === 4 && (       //コンソール
                    <MasterConsole
                        table_data={table_data}
                        editData={this.updateData}
                        deleteData={this.deleteData}
                        delete = {this.delete_special}
                    />
                )}

                {this.state.list_index === -1 && this.state.category != '' && (
                    <Wrapper>
                        <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th className="item-no"/>
                                <th className="table-check">表示</th>
                                <th className="code-number">コード番号</th>
                                <th style={{width:'20rem'}}>名称</th>
                                <th className="name">略称</th>
                                {this.state.category == '車椅子' && (
                                    <th style={{width:'8rem'}}>重量(kg)</th>
                                )}
                                <th>カナ名称</th>                                
                            </tr>
                        </thead>
                        <tbody id="code-table">
                            {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                                table_data.map((item, index) => {
                                    return (
                                    <>
                                    <tr onContextMenu={e => this.handleClick(e, index)}>
                                        <td className="item-no text-right">{index+1}</td>
                                        <td className="text-center table-check">
                                        <Checkbox
                                            label=""
                                            // getRadio={this.getRadio.bind(this)}
                                            isDisabled={true}
                                            value={item.is_enabled}                                        
                                            name="check"
                                        /> 
                                        </td>
                                        <td className="code-number text-right">{item.code}</td>
                                        <td style={{width:'20rem'}}>{item.name}</td>
                                        <td className="name">{item.name_short}</td>
                                        {this.state.category == '車椅子' && (
                                            <td style={{width:'8rem'}}>{item.value}</td>
                                        )}
                                        <td>{item.name_kana}</td>                                        
                                    </tr>
                                    </>)
                                })
                            )}
                        </tbody>
                        </table>
                        <ContextMenu
                            {...this.state.contextMenu}
                            parent={this}
                            favouriteMenuType={this.state.favouriteMenuType}
                        />
                    </Wrapper>
    
                )}
                <div className="footer-buttons">
                    <Button className="red-btn" onClick={this.openPreviewModal}>帳票プレビュー</Button>
                    <Button className="red-btn" onClick={this.openModal}>新規作成</Button>
                </div>
                {this.state.isOpenModal && (
                    <MaterialModal
                        modal_data={this.state.modal_data}
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        modalType={this.state.list_index}  
                        category={this.state.category}
                        selected_category = {selected_category}
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
                {this.state.isOpenPreviewModal && (
                    <DialMasterPrintPreview
                        closeModal={this.confirmCancel.bind(this)}
                        modal_title={selected_category}
                        modal_type={this.modal_type}
                        table_head={this.table_head}
                        table_head_style={this.table_head_style}
                        table_body={table_data}
                        sort_order = {display_order[this.state.search_order].value}
                        search_class = {display_class[this.state.search_class].value}
                        keyword = {this.state.schVal}
                    />
                )}
            </Card>
            </>
        )
    }
}
Material.contextType = Context;

export default Material