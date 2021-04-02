import React, { Component, useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import Checkbox from "~/components/molecules/Checkbox";

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
        padding: 0.25rem;
        font-size:0.8rem;
        label{
            margin-right:0px;
        }
    }
    th {
        font-size:0.8rem;
        position: sticky;
        text-align: center;
        padding: 0.3rem;
    }
    .table-check {
        width: 2.5rem;
    }
    .item-no {
        width: 1.875rem;
    }
    .code-number {
        width: 4rem;
    }
    .name{
        width:7.5rem;
    }
    .name-short{
        width:4rem;
    }
  }
 `;

const ContextMenuUl = styled.ul`
margin-bottom:0;
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


class MasterDialyzer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table_data: this.props.table_data,

            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            confirm_message:"",
        }
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
                this.props.delete(this.state.selected_number, this.props.table_data[index].name);
            })                        
        }
    };

    render() {
        let {table_data} = this.props;
        return (
            <Wrapper>
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th className="item-no"/>
                            <th className="table-check">表示</th>
                            <th className="code-number">コード</th>
                            <th className="name">名称</th>
                            <th className="name">カナ名称</th>
                            <th className="name-short">略称</th>
                            <th className="name">JANコード</th>
                            <th className="code-number">膜面積</th>
                            <th className="table-check">CL</th>
                            <th className="name">血液流量</th>
                            <th className="name">透析液流量</th>
                            <th className="table-check">効率</th>
                            <th className="code-number">流量比</th>
                            <th>K</th>
                        </tr>
                    </thead>
                    <tbody id="code-table">
                    {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                        table_data.map((item, index) => {
                            return (
                                <>
                                    <tr onContextMenu={e => this.handleClick(e, index)}>
                                        <td className="item-no text-right">{index+1}</td>
                                        <td className="table-check text-center">
                                            <Checkbox
                                                getRadio={this.getRadio.bind(this)}
                                                value={item.is_enabled}
                                                checked={item.is_enabled === 1}
                                                name="check"
                                                isDisabled={true}
                                            />
                                        </td>
                                        <td className="code-number text-right">{item.code}</td>
                                        <td className="name">{item.name}</td>
                                        <td className="name">{item.name_kana}</td>
                                        <td className='name-short'>{item.name_short}</td>
                                        <td className="name text-right">{item.jan_code}</td>
                                        <td className="code-number text-right">{item.membrane_area}</td>
                                        <td className="table-check text-right">{item.cl}</td>
                                        <td className="name text-right">{item.blood_flow_rate}</td>
                                        <td className="name text-right">{item.dialysate_flow_rate}</td>
                                        <td className="table-check">{item.efficiency}</td>
                                        <td className="code-number text-right">{item.flow_rate_ratio}</td>
                                        <td className='text-right'>{item.k}</td>
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
MasterDialyzer.contextType = Context;

MasterDialyzer.propTypes = {
    table_data: PropTypes.array,
    editData: PropTypes.func,
    deleteData: PropTypes.func,
    delete:PropTypes.func,
};
export default MasterDialyzer