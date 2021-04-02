import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import Checkbox from "~/components/molecules/Checkbox";
import * as methods from "../../Dial/DialMethods";
import * as sessApi from "~/helpers/cacheSession-utils";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 80%;  
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 10px;  
  label {
      text-align: right;
  }
  table {
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
          padding: 0.25rem;
      }
      th {
          position: sticky;
          text-align: center;
          padding: 0.3rem;
      }
      .item-no {
        width: 50px;
      }
      .bed_number {
        width: 150px;
        font-size: 16px;
      }
      .start_page {
        width: 150px;
        font-size: 16px;
      }
      .use_status {
        width: 100px;
        font-size: 16px;
      }
      .ip_address {
        font-size: 16px;
        width: calc(100% - 550px);
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
    font-size: 14px;
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
  .text-center .gHLxSm {
    margin:0;
  }
`;

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


class TerminalSetting extends Component {
    constructor(props) {
        super(props);
        Object.entries(methods).forEach(([name, fn]) =>
            name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
        );
        this.state = {
            table_data: this.props.table_data,

            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message:"",
        }
    }

    componentDidMount () {
        var bed_data = sessApi.getObjectValue("dial_common_master","bed_master");
        let bed_number_data = [];
        if (bed_data != undefined && bed_data != null && bed_data.length > 0) {
            bed_data.map(item=>{
                bed_number_data[item.number] = item.name;
            })
        }
        this.setState({bed_data, bed_number_data});
    }

    getRadio = (name) => {
        if (name === "check") {
            // console.log(name)
        }
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

    contextMenuAction = (index, type) => {
        if (type === "edit"){
            this.props.editData(index);
        }
        if (type === "delete"){
            this.setState({selected_number:this.props.table_data[index].number}, () => {
                this.props.delete(this.state.selected_number);
            })
        }
    };

    render() {
        let {table_data} = this.props;
        let {bed_number_data} = this.state;
        return (
            <Wrapper>
                <table className="table table-bordered table-hover">
                    <thead>
                    <tr>
                        <th className="item-no"/>
                        <th className="use_status">表示</th>
                        <th className="ip_address">IPアドレス</th>
                        <th className="start_page">初期ページ設定</th>
                        <th className="bed_number">ベッド指定</th>
                    </tr>
                    </thead>
                    <tbody id="code-table">
                    {this.state.bed_data !== undefined && table_data !== undefined && table_data !== null && table_data.length > 0 && (
                        table_data.map((item, index) => {
                            return (
                                <>
                                    <tr onContextMenu={e => this.handleClick(e, index)}>
                                        <td className="text-right item-no">{index+1}</td>
                                        <td className="text-center use_status">
                                            <Checkbox
                                                label=""
                                                // getRadio={this.getRadio.bind(this)}
                                                isDisabled={true}
                                                value={item.is_enabled}
                                                name="check"
                                            />
                                        </td>
                                        <td className="ip_address">{item.ip_addr}</td>
                                        <td className="start_page">{item.start_page}</td>
                                        <td className="bed_number">{bed_number_data != undefined && bed_number_data.length > 0 && item.bed_number > 0 && bed_number_data[item.bed_number] != undefined ? bed_number_data[item.bed_number] : ""}</td>
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
        )
    }
}
TerminalSetting.contextType = Context;

TerminalSetting.propTypes = {
    table_data: PropTypes.array,
    editData: PropTypes.func,
    deleteData: PropTypes.func,
    delete:PropTypes.func,
};
export default TerminalSetting