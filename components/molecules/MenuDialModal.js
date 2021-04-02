import React, { Component } from "react";
import styled from "styled-components";
// import * as activeIndicator from "../_nano/activeIndicator";
import * as colors from "../_nano/colors";
import TitleTabs from "../organisms/TitleTabs";
import Button from "../atoms/Button";
import PropTypes from "prop-types";
import MenuDialModalBody from "../organisms/MenuDialModalBody";
// import { dialGroups, maintenanceGroups, printGroups } from "~/helpers/navigationMaps";
// import {staff_category} from "~/helpers/dialConstants"
import Context from "~/helpers/configureStore";
// const Flex = styled.div`
//   border-bottom: 1px solid #dedede;
//   color: white;
//   display: flex;
//   background: #f2ede9;

//   .nav {
//     align-items: center;
//     display: -webkit-box;
//     margin-bottom: 0;
//     list-style: none;
//     height: 40px;
//   }
//   .nav li {
//     width: 120px;
//     text-align: center;
//     font-weight: normal;
//     font-size: 1.125rem;
//     color: #303e58;
//   }

//   a:hover {
//     ${activeIndicator.activeIndicator};
//     text-decoration: none;
//   }
// `;

const MenuModalBox = styled.div`

  width: calc(100vw - 205px);
  left: calc(-100vw + 198px);
  top: 10px;
  border: 1px solid #7c9ccb;;
  margin: 0px;
  height: 98vh;  
  position: absolute;    
  background-color: ${colors.surface};  
  .title {
    padding: 0.3rem 0.9rem;
    background: white;
    font-size: 1.5rem;
  }
  .nav li {
    width: auto !important;
    margin: 0px 10px;    
    h2 {
      border: none;
      text-align: center;
      width: auto;
      color: #aaa;
      font-size: 1.25rem;
    }
    h2:hover {
      background: #797575;
      text-decoration: none;
    }
  }
  .tag {
    background: #2a3943;
    height: 3rem;
    display: flex;
    padding: 0.3rem 0.9rem;
    button {
      height: 2.5rem;
      padding: 0.5rem 1rem;
      float: right;
      // margin-top: -28px;
      border-radius: 0px;
      span {
        font-weight: normal;
        color: black;
        font-size:1.1rem;
      }
    }
    .active h2{
      text-decoration: underline;
      font-weight: bold;
      color: white;
    }
    .nav li{
      opacity: 1 !important;
    }
  }
  .nav-tabs {
    border-bottom: none;
  }

`;

class MenuDialModal extends Component {
  static propTypes = {
    history: PropTypes.object
  }; 
  constructor(props) {
    super(props);
    this.state = {
      titleTab: 6
    }
    
  }

  componentDidMount() {
 
  }
  canShowMaintenance = () => {
      if(this.context.$canDoAction(this.context.FEATURES.MAINTENANCE,
          this.context.AUTHS.READ
      )){
          return true;
      }
      return false;
  }

  selectTitleTab = e => {
  // let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if(parseInt(e.target.id) > 5) {
      if(e.target.id == 7 && !this.canShowMaintenance()) {
        return;
      }
      this.setState({
        titleTab: parseInt(e.target.id) ,
      });
    }
  };

  onCloseModal = () => {
    this.props.onCloseModal();
  }

  render() {
    const menuTapList = [
      {
        id: 6,
        title: "透析"
      },    
      {
        id: 7,
        title: "メンテナンス"
      },    
      {
        id: 8,
        title: "印刷"
      }        
    ];

    return (
      <MenuModalBox
        className="content"
        id="calc_dlg"
      >
        <div className="title">
          ナビゲーションマップ
        </div>
        <div className="tag">
          <TitleTabs
            tabs={menuTapList}
            selectTitleTab={this.selectTitleTab}
            id={this.state.titleTab}
          />
          <Button type="mono" onClick={this.onCloseModal}>閉じる</Button>
        </div>                      
        <MenuDialModalBody 
          tab_id={this.state.titleTab}
          onGoto={this.props.onGoto}
          updateFavouriteList={this.props.updateFavouriteList}
          favouriteList={this.props.favouriteList}
        />
      </MenuModalBox>
    );

  }
}

MenuDialModal.contextType = Context;
MenuDialModal.propTypes = {
  onCloseModal: PropTypes.func,
  onGoto: PropTypes.func,
  updateFavouriteList: PropTypes.func,
  favouriteList: PropTypes.array
};

export default MenuDialModal;
