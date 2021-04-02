import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import $ from "jquery";

const Li = styled.li`
  font-family: NotoSansJP;
  font-size: 12px;
  width: 33.3%;
  padding: 0px;
  background-color: transparent !important;
  opacity: 0.5;

  &.nav-link {
    border: none;
  }

  &.active {
    opacity: 1;
    color: ${colors.onSurface};
  }

  &:hover {
    cursor: pointer;
  }
`;

const H2 = styled.h2`
  border-left: 4px solid ${colors.secondary};
  color: ${colors.onSurface};
  font-family: NotoSansJP;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 0px;
  padding: 0 0 0 4px;
`;

const ContextMenuUl = styled.ul`
  margin-bottom: 0px;
  position: absolute;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 0px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 0px;
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
`;

const ContextMenu = ({
  visible,
  x,
  y,
  parent
}) => {
  if (visible) {      
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>          
          <>
            <li>              
              <div onClick={() => parent.contextMenuAction("pdfPrint")}>PDF印刷</div>
            </li>            
          </>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class TabTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick = (e) => {
    // if (this.props.tabType != "prescription" && this.props.tabType != "injection") return;
    if (this.props.tabType != "prescription") return;
    if (this.props.tab_id != this.props.selected_id) return;
    if (this.props.title != "処方歴" && this.props.title != "よく使う薬剤" && this.props.tabType == "prescription") return;
    // if (this.props.title != "注射履歴" && this.props.title != "よく使う薬剤" && this.props.tabType == "injection") return;

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
        if (
          document.getElementById("title-tab-li") !== undefined &&
          document.getElementById("title-tab-li") !== null
        ) {
          document
            .getElementById("title-tab-li")
            .addEventListener("scroll", function onScrollOutside() {
              that.setState({
                contextMenu: { visible: false }
              });
              document
                .getElementById("title-tab-li")
                .removeEventListener(`scroll`, onScrollOutside);
            });
        }
        
        let html_obj = document.getElementsByTagName("html")[0];        
        let h_width = html_obj.offsetWidth;

        let min_width = 0;
        if (this.props.tabType == "injection") {
          min_width = $('#injection-div-history').offset().left + 200;
        } else if(this.props.tabType == "prescription") {
          min_width = $('#div-history').offset().left + 200;
        }
        if (this.props.title == "よく使う薬剤") {
          min_width = min_width + $('#title-tab-li').width();
        }        
        if (h_width <= 1680 && h_width > 1440) {
          min_width = min_width - 40;
        } else if(h_width <= 1440) {
          min_width = min_width - 100;
        }
        this.setState({
          contextMenu: {
            visible: true,
            x: e.clientX - min_width,
            y: e.clientY + window.pageYOffset - 130
          }
        });
      }
  }

  contextMenuAction = (act) => {
    if (this.props.tabType == "prescription" || this.props.tabType == "injection") {
      if (act == "pdfPrint") {
        this.props.contextMenuAction(act, this.props.tab_id, this.props.title);
      }
    }
  }

  render() {
    return (
      <>
        <Li
          onContextMenu={e =>this.handleClick(e)}
          id="title-tab-li"
          onClick={this.props.selectTitleTab}
          className={`nav-link ${
            this.props.tab_id == this.props.selected_id ? "active" : ""
          }`}
        >
          <H2 id={this.props.tab_id}>{this.props.title}</H2>
        </Li>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}          
        />
      </>
    );
  }
}

TabTitle.propTypes = {
  title: PropTypes.string,
  tabType: PropTypes.string,
  tab_id: PropTypes.number,
  selected_id: PropTypes.number,
  selectTitleTab: PropTypes.func,
  contextMenuAction: PropTypes.func,
};

export default TabTitle;
