import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import {formatDateSlash, formatDateLine} from "~/helpers/date"
import * as sessApi from "~/helpers/cacheSession-utils";
import {Dial_tab_index} from "~/helpers/dialConstants";

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  width: 50%;
  height: calc( 100vh - 13rem);
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 10px;
  overflow-y: auto;
  label {
      text-align: right;
  }
  table {
    overflow-y: auto;
    .record:hover{
      background:#e2e2e2;
    }
    td {
      padding: 0;
      padding-top: 4px;
      font-size:0.8rem;
    }
    th {
      position: sticky;
      text-align: center;
      padding: 0;
      padding-top: 3px;
      font-size:0.9rem;
    }
    .menu-name {
        width: 8.5rem;
    }
    .menu-section {
        width: 5.5rem;
    }
    .date-area {
        width: 5.5rem;
    }
    .text-center label {
      margin-left: 4px;
      margin-right: 0px;
    }
    .text-center{
      text-align:center;
    }
    .tr{
        text-align:right;
        padding-right:2px;
    }
    .tl{
        text-align:left;
        padding-left:2px;
    }
  }
 `;
 const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);    
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
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
    padding: 0px;
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

 const ContextMenu = ({ visible, x,  y, system_patient_id, parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction(system_patient_id,"dr_karte")}>Drカルテへ</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class GuideTableTSAT extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table_data: this.props.table_data,         
        }
    }

    contextMenuAction = (system_patient_id, type) => {
      if (type == 'dr_karte'){
        var url = "/dial/board/system_setting";
        var date = formatDateLine(new Date());
        sessApi.setObjectValue("from_print", "schedule_date", date);
        sessApi.setObjectValue("from_print", "system_patient_id", system_patient_id);
        sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.DRMedicalRecord);
        setTimeout(()=>{
          this.props.history.replace(url);
        }, 500);
      }
    }

    handleClick = (e, system_patient_id) => {
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
            x: e.clientX - 200,
            y: e.clientY + window.pageYOffset,
            system_patient_id,
          },
          
        });
      }
    }

    render() {
        let {table_data} = this.props;
        return (
            <Wrapper>
                <table className="table table-bordered table-striped table-hover" id="code-table">
                    <tr>
                        <th className="menu-name">漢字氏名</th>
                        <th className="date-area">検査日</th>
                        <th className="menu-section">セクション</th>
                        <th className="" style={{width:'4rem'}}>TSAT</th>
                        <th className="" style={{width:'5rem'}}>フェリチン</th>
                        <th className="" style={{width:'4rem'}}>ALB</th>
                        <th>鉄</th>
                    </tr>
                    {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                        table_data.map((item) => {
                            return (
                                <>
                                    <tr className={'record record-'+item.section_no}
                                      onContextMenu={e => this.handleClick(e, item.system_patient_id)}                                      
                                      onClick = {e => this.handleClick(e, item.system_patient_id)}
                                      onMouseOver={e => this.props.addColor(e, item.section_no, true)} 
                                      onMouseOut = {e => this.props.removeColor(e, item.section_no, true)}
                                    >
                                      <td className="tl">{item.patient_name}</td>
                                      <td className="text-left">{ formatDateSlash(item.examination_date) }</td>
                                      <td className="text-right">{item.section_no}</td>
                                      <td className="tr">{item.tsat}</td>
                                      <td className="tr">{item.ferr}</td>
                                      <td className="tr">{item.alb}</td>                                        
                                      <td className="tr">{item.fe}</td>
                                    </tr>
                                </>
                            )
                        })
                    )}
                </table>
                <ContextMenu
                  {...this.state.contextMenu}
                  parent={this}            
                />
            </Wrapper>
        )
    }
}
GuideTableTSAT.contextType = Context;

GuideTableTSAT.propTypes = {
    table_data: PropTypes.array,
    addColor:PropTypes.func,
    removeColor: PropTypes.func,
    history: PropTypes.object
};
export default GuideTableTSAT