import React, { Component, useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import Checkbox from "~/components/molecules/Checkbox";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  justify-content: center;
  align-items: center;
  height: 20rem;
  display: flex;
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;    
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
        height: calc( 100vh - 20rem);
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
          width: 3rem;
      }
      .item-no {
        width: 2.5rem;
      }
      .code-number {
          width: 7rem;
      }
      .name{
          width:9rem;
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

const ContextMenu = ({ visible, x,  y,  parent,  favouriteMenuType,}) => {
    const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    {$canDoAction(FEATURES.DIAL_USAGE_MASTER,AUTHS.EDIT,0) != false && (
                    <li><div onClick={() => parent.contextMenuAction(favouriteMenuType,"edit")}>編集</div></li>
                    )}
                    {$canDoAction(FEATURES.DIAL_USAGE_MASTER,AUTHS.DELETE,0) != false && (
                    <li><div onClick={() => parent.contextMenuAction(favouriteMenuType, "delete")}>削除</div></li>
                    )}
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};

const dial_timings = ["なし", "透析開始前", "透析開始後", "透析終了前", "透析終了後"];

class MasterUsage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table_data: this.props.table_data
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
    getGroupName (group_code) {
        if (group_code == null || group_code == "") return "";
        let {usage_group} = this.props;
        if (usage_group == undefined || usage_group == null || usage_group.length == 0) return "";
        if (usage_group.findIndex(x=>x.id==group_code)>-1){
            return usage_group.find(x=>x.id==group_code).value;
        } else return "";
    }

    render() {
        let {table_data} = this.props;
        return (
            <Wrapper>
                <table className="table table-bordered table-hover">
                    <thead>
                    <tr>
                        <th className="item-no"/>
                        <th className="table-check">表示</th>
                        <th className="code-number">服用コード</th>
                        <th className="code-number">グループ名称</th>
                        <th className="name">表示名称</th>
                        <th className="name">略称</th>
                        <th className="name">カナ名称</th>
                        <th className="code-number">服用回数</th>
                        <th className="table-check">内服</th>
                        <th className="table-check">頓服</th>
                        <th className="table-check">外用</th>
                        <th className="table-check">処置</th>
                        <th className="table-check">麻酔</th>
                        <th style={{width:'6.5rem'}}>インスリン</th>
                        <th>透析中タイミング</th>
                    </tr>
                    </thead>
                    <tbody id="code-table">
                        {this.props.isLoaded == false ? (
                          <div className='spinner-disease-loading center'>
                            <SpinnerWrapper>
                              <Spinner animation="border" variant="secondary" />
                            </SpinnerWrapper>
                          </div>
                        ):(
                          <>
                            {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                                table_data.map((item, index) => {
                                    return (
                                        <>
                                            <tr onContextMenu={e => this.handleClick(e, index)}>
                                                <td className="item-no text-right">{index+1}</td>
                                                <td className="text-center table-check">
                                                    <Checkbox
                                                        getRadio={this.getRadio.bind(this)}
                                                        value={item.is_enabled}
                                                        checked={item.is_enabled === 1}
                                                        name="check"
                                                        isDisabled={true}
                                                    />
                                                </td>
                                                <td className="text-right code-number">{item.code}</td>
                                                <td className='code-number'>{this.getGroupName(item.usage_group_code)}</td>
                                                <td className='name'>{item.name}</td>
                                                <td className='name'>{item.name_short}</td>
                                                <td className='name'>{item.name_kana}</td>
                                                <td className='code-number text-right'>{item.count}</td>
                                                <td className="text-center table-check">
                                                    <Checkbox
                                                        getRadio={this.getRadio.bind(this)}
                                                        value={item.category.includes('内服') === true ? true : false}
                                                        name="check1"
                                                        isDisabled={true}

                                                    />
                                                </td>
                                                <td className="text-center table-check">
                                                    <Checkbox
                                                        label=""
                                                        getRadio={this.getRadio.bind(this)}
                                                        value={item.category.includes('頓服') === true ? true : false}
                                                        name="check"
                                                        isDisabled={true}
                                                    />
                                                </td>
                                                <td className="text-center table-check">
                                                    <Checkbox
                                                        getRadio={this.getRadio.bind(this)}
                                                        value={item.category.includes('外用') === true ? true : false}
                                                        name="check1"
                                                        isDisabled={true}
                                                    />
                                                </td>
                                                <td className="text-center table-check">
                                                    <Checkbox
                                                        getRadio={this.getRadio.bind(this)}
                                                        value={item.category.includes('処置') === true ? true : false}
                                                        name="check1"
                                                        isDisabled={true}
                                                    />
                                                </td>
                                                <td className="text-center table-check">
                                                    <Checkbox
                                                        getRadio={this.getRadio.bind(this)}
                                                        value={item.category.includes('麻酔') === true ? true : false}
                                                        name="check1"
                                                        isDisabled={true}
                                                    />
                                                </td>
                                                <td className="text-center" style={{width:'6.5rem'}}>
                                                    <Checkbox
                                                        getRadio={this.getRadio.bind(this)}
                                                        value={item.category.includes('インスリン') === true ? true : false}
                                                        name="check1"
                                                        isDisabled={true}
                                                    />
                                                </td>
                                                <td>
                                                    {(item.in_dialysis & Math.pow(2, 0)) > 0 ? dial_timings[0]+' ' : ''}
                                                    {(item.in_dialysis & Math.pow(2, 1)) > 0 ? dial_timings[1]+' ' : ''}
                                                    {(item.in_dialysis & Math.pow(2, 2)) > 0 ? dial_timings[2]+' ' : ''}
                                                    {(item.in_dialysis & Math.pow(2, 3)) > 0 ? dial_timings[3]+' ' : ''}
                                                    {(item.in_dialysis & Math.pow(2, 4)) > 0 ? dial_timings[4]+' ' : ''}
                                                </td>
                                            </tr>
                                        </>)
                                })
                            )}
                          </>
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
MasterUsage.contextType = Context;

MasterUsage.propTypes = {
    table_data: PropTypes.array,
    usage_group: PropTypes.array,
    isLoaded: PropTypes.bool,
    editData: PropTypes.func,
    delete: PropTypes.func,
};
export default MasterUsage