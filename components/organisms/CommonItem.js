import React from "react";
import Button from "../atoms/Button";
import styled from "styled-components";
import NotConsentedModal from "./NotConsentedModal";
import PropTypes from "prop-types";


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


const ContextMenu = ({
  visible,
  x,
  y,
  parent,
  favouriteMenuType
}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div
              onClick={() =>
                parent.contextMenuAction(favouriteMenuType)
              }
            >
              お気に入り追加
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class CommonItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasNotConsentedData: false,
      favouriteMenuType: 0
    };
  }

  consent = () => {
    this.setState({hasNotConsentedData: true});
  }

  closeNotConsentedModal = () => {
    this.setState({ hasNotConsentedData: false });
  };

  prescriptionList = () => {
    this.props.onGoto("/prescriptionList");
  }

  orderList = () => {
    this.props.onGoto("/examination/order_list");
  }

  userConfig = () => {
    this.props.onGoto("/mypage/config");
  }

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
          .getElementById("calc_dlg")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("calc_dlg")
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

  contextMenuAction = (act) => {   
    if (act === "insurance_edit") {
      // console.log("context menu click")
    }
  };
  
  render() {
    return (
      <>
        <div className="menu-item">
            <div className="item-title">
              患者情報
            </div>
            <div className="item-content">
              <Button onContextMenu={e => this.handleClick(e)}>患者提示</Button>
              <Button title="患者プロフィール情報です。" onContextMenu={e => this.handleClick(e)}>患者プロフィール</Button>
              <Button title="患者プロフィール情報です。" onContextMenu={e => this.handleClick(e)}>患者プロフィール</Button>
              <Button onContextMenu={e => this.handleClick(e)}>保険変更</Button>
              <Button className="disable-button">テスト１</Button>
              <Button className="disable-button">テスト２</Button>
            </div>
          </div>
          <div className="menu-item">
            <div className="item-title">
              患者情報
            </div>
            <div className="item-content">
              <Button onContextMenu={e => this.handleClick(e)}>患者提示</Button>
              <Button title="患者プロフィール情報です。" onContextMenu={e => this.handleClick(e)}>患者プロフィール</Button>
              <Button title="患者プロフィール情報です。" onContextMenu={e => this.handleClick(e)}>患者プロフィール</Button>
              <Button>保険変更</Button>
              <Button className="disable-button">テスト１</Button>
              <Button className="disable-button">テスト２</Button>
            </div>
          </div>
          <div className="menu-item">
            <div className="item-title">
            承認
            </div>
            <div className="item-content">
              <Button 
                title="委譲者オーダーを承認する。"
                onContextMenu={e => this.handleClick(e)}
                onClick={this.consent.bind(this)}>
                委譲者オーダー承認
              </Button>
              <Button 
                onContextMenu={e => this.handleClick(e, 101)}
                onClick={this.prescriptionList}>
                処方箋一覧
              </Button>
              <Button 
                onContextMenu={e => this.handleClick(e, 102)}
                onClick={this.orderList}>
                検査一覧
              </Button>
              <Button 
                onContextMenu={e => this.handleClick(e, 103)}
                onClick={this.userConfig}>
                ユーザー設定
              </Button>
              <Button className="disable-button">テスト１</Button>
              <Button className="disable-button">テスト２</Button>
            </div>
          </div>
          {this.state.hasNotConsentedData && (
            <NotConsentedModal
              patiendId={0}
              fromPatient={true}
              closeNotConsentedModal={this.closeNotConsentedModal}
            />
          )}
         <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          favouriteMenuType={this.state.favouriteMenuType}
        />
      </>
    );
  }
}
CommonItem.propTypes = {
  onGoto: PropTypes.func,
};
export default CommonItem;
