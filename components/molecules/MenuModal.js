import React, { Component } from "react";
import styled from "styled-components";
// import * as activeIndicator from "../_nano/activeIndicator";
import * as colors from "../_nano/colors";
// import TitleTabs from "../organisms/TitleTabs";
// import Button from "../atoms/Button";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import MenuModalBody from "../organisms/MenuModalBody";
import { 
  commonTabColor,
  commonTabTitleColor,
  commonTabItemColor,
  karteTabColor,
  karteTabTitleColor,
  karteTabItemColor,
  nurseTabColor,
  nurseTabTitleColor,
  nurseTabItemColor,
  partTabColor,
  partTabTitleColor,
  partTabItemColor,
  maintenanceTabColor,
  maintenanceTabTitleColor,
  maintenanceTabItemColor,
  printTabColor,
  printTabTitleColor,
  printTabItemColor,
} from "~/components/_nano/colors";
import { CACHE_SESSIONNAMES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import * as localApi from "~/helpers/cacheLocal-utils";
// import { menuTaps, commonGroups, karteDescriptionGroups, nurseServiceGroups, departGroups } from "~/helpers/navigationMaps";


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
//     font-size: 13px;
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
  overflow-y:auto;
  top: 5px;
  border: none;
  // border: 1px solid #7c9ccb;;
  margin: 0px;
  height: 98vh;  
  position: absolute;    
  background: #f1f3f4;
  // background-color: ${colors.surface};  
  .title {
    padding: 5px 15px;
    background: white;
  }

  .dial-menu-left ul li span{
    font-weight: bold;
  }

  .dial-menu-right ul li span{
    font-weight: bold;
  }
  .nav li {
    width: auto !important;
    margin: 0px 10px;    
    h2 {
      border: none;
      text-align: center;
      width: auto;
      color: white;
      font-size: 1rem;
    }
    h2:hover {
      background: #797575;
      text-decoration: none;
    }
  }

  .selected{
    z-index: 101 !important;   
  }  

  .nav-modal-body{
    overflow: hidden;
    width: 100%;
  }

  .tag {
    background: #2a3943;
    padding: 5px 15px;
    height: 3em;
    padding-top: 15px;
    button {
      float: right;
      margin-top: -28px;
      border-radius: 0px;
      span {
        font-weight: normal;
        color: black;
      }
    }
    .active h2{
      text-decoration: underline;
      font-weight: bold;
    }
    .nav li{
      opacity: 1 !important;
    }
  }
  .nav-tabs {
    border-bottom: none;
  }

  .commonTabColor{
    background: ${commonTabColor} !important;    
    .nav-modal-body{
      background: ${commonTabColor} !important;
      .menu-item .item-content .btn-green{
        background: ${commonTabItemColor} !important;
      }
      .menu-item .item-content .false:hover{
        background: rgb(159, 229, 255) !important;
      }
      .menu-item .item-title{
        background: ${commonTabTitleColor} !important; 
      }
      .menu-item .item-content .fsBJgu{
        background: ${commonTabTitleColor} !important;  
      }
    }
    .dial-menu-title{
      background: ${commonTabTitleColor} !important; 
    }
  }  
  .karteTabColor{
    background: ${karteTabColor} !important;
    .nav-modal-body{
      background: ${karteTabColor} !important;
      .menu-item .item-content .btn-green{
        background: ${karteTabItemColor} !important;
      }
      .menu-item .item-content .false:hover{
        background: rgb(159, 229, 255) !important;
      }
      .menu-item .item-title{
        background: ${karteTabTitleColor} !important; 
      }
      .menu-item .item-content .fsBJgu{
        background: ${karteTabTitleColor} !important;  
      }
    }
    .dial-menu-title{
      background: ${karteTabTitleColor} !important; 
    }
  }
  .nurseTabColor{
    background: ${nurseTabColor} !important;
    .nav-modal-body{
      background: ${nurseTabColor} !important;
      .menu-item .item-content .btn-green{
        background: ${nurseTabItemColor} !important;
      }
      .menu-item .item-content .false:hover{
        background: rgb(159, 229, 255) !important;
      }
      .menu-item .item-title{
        background: ${nurseTabTitleColor} !important; 
      }
      .menu-item .item-content .fsBJgu{
        background: ${nurseTabTitleColor} !important;  
      }
    }
    .dial-menu-title{
      background: ${nurseTabTitleColor} !important; 
    }
  }
  .partTabColor{
    background: ${partTabColor} !important;
    .nav-modal-body{
      background: ${partTabColor} !important;
      .menu-item .item-content .btn-green{
        background: ${partTabItemColor} !important;
      }
      .menu-item .item-content .false:hover{
        background: rgb(159, 229, 255) !important;
      }
      .menu-item .item-title{
        background: ${partTabTitleColor} !important; 
      }
      .menu-item .item-content .fsBJgu{
        background: ${partTabTitleColor} !important;  
      }
    }
    .dial-menu-title{
      background: ${partTabTitleColor} !important; 
    }
  }
  .maintenanceTabColor{
    background: ${maintenanceTabColor} !important;
    .nav-modal-body{
      background: ${maintenanceTabColor} !important;
      .menu-item .item-content .btn-green{
        background: ${maintenanceTabItemColor} !important;
      }
      .menu-item .item-content .false:hover{
        background: rgb(159, 229, 255) !important;
      }
      .menu-item .item-title{
        background: ${maintenanceTabTitleColor} !important; 
      }
      .menu-item .item-content .fsBJgu{
        background: ${maintenanceTabTitleColor} !important;  
      }
    }
    .dial-menu-title{
      background: ${maintenanceTabTitleColor} !important; 
    }
  }
  .printTabColor{
    background: ${printTabColor} !important;
    .nav-modal-body{
      background: ${printTabColor} !important;
      .menu-item .item-content .btn-green{
        background: ${printTabItemColor} !important;
      }
      .menu-item .item-content .false:hover{
        background: rgb(159, 229, 255) !important;
      }
      .menu-item .item-title{
        background: ${printTabTitleColor} !important; 
      }
      .menu-item .item-content .fsBJgu{
        background: ${printTabTitleColor} !important;  
      }
    }
    .dial-menu-title{
      background: ${printTabTitleColor} !important; 
    }
  }

  .dial-menu-content{
    box-shadow: 0 -5px 5px -5px #8d8d8d;
    .tab-bg-color-1{
      background: ${commonTabColor};
    }
    .tab-bg-color-2{
      background: ${karteTabColor};
    }
    .tab-bg-color-3{
      background: ${nurseTabColor};
    }
    .tab-bg-color-4{
      background: ${partTabColor};
    }
    .tab-bg-color-5{
      background: ${maintenanceTabColor};
    }
    .tab-bg-color-6{
      background: ${printTabColor};
    }    

    .mn-style-0{
      z-index: 51;
    }
    .mn-style-1{
      z-index: 50;
    }
    .mn-style-2{
      z-index: 49;
    }
    .mn-style-3{
      z-index: 48;
    }
    .mn-style-4{
      z-index: 47;
    }
    .mn-style-5{
      z-index: 46;
    }
    .mn-style-6{
      z-index: 45;
    }
    .mn-style-7{
      z-index: 44;
    }
    .mn-style-8{
      z-index: 43;
    }
    .mn-style-9{
      z-index: 42;
    }
    .mn-style-10{
      z-index: 41;
    }
    .mn-style-11{
      z-index: 40;
    }
    .mn-style-12{
      z-index: 39;
    }
    .mn-style-13{
      z-index: 38;
    }
    .mn-style-14{
      z-index: 37;
    }
    .mn-style-15{
      z-index: 36;
    }

    .dial-menu-left ul, .dial-menu-right ul{
      display: inline-grid;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .dial-menu-left ul li, .dial-menu-right ul li{    
      :hover{
        cursor: pointer;
      }  
      text-orientation: upright;
      overflow: hidden;
      span{
        height: 5.2rem;
        display: block;
        writing-mode: tb-rl;
        font-size: 0.7rem;
        vertical-align: middle;
        text-align: center;
        padding: 0 1rem;
      }
    }


    .dial-menu-left{
      float: left;
      width: 3rem;
      z-index: 90;
      ul{
        li{
          position: relative;
          // box-shadow: -1px 3px 6px #8d8d8d;
          box-shadow: -4px 3px 5px 0px #8d8d8d;
        }
        li.selected {
          box-shadow: -3px 0px 3px 1px #8d8d8d !important;  
        }
      }

      .menu-left-radius{
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
      }
    }
    .dial-menu-right{
      z-index: 90;
      float: right;
      width: 3rem;
      ul{
        li{
          position: relative;
          // box-shadow: 1px 3px 6px #8d8d8d;
          box-shadow: 4px 3px 5px 0px #8d8d8d;
        }
        li.selected {
          position: relative;
          box-shadow: 3px 0px 3px 1px #8d8d8d !important; 
        }
      }

      .menu-right-radius{
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
      }
    }
    .second-right{
      width: 3rem;
      margin-right: 0.1rem;
    }
    .dial-menu-body{
      padding: 1rem;
      z-index: 100;
      position: relative;
      background: #c3e8fa;
      padding-top: 2.3rem;
      display: inline-block;
      width: calc(100% - 6.1rem);
      // box-shadow: 0px 0px 4px #6c6b6b;
      box-shadow: 0px 2px 7px #8d8d8d;
      overflow-y: auto;
      height: 97vh;
      .dial-menu-title{        
        height: 110px;
        background: #9cd3e7;
        position:relative;
        width:99.5%;
        p{
          width: 100%;
          text-align: center;
          font-size: 2.25rem;
          vertical-align: midde;
          padding-top: 27px;
        }
          span{
            // float: right;
            // padding: 0.5rem;
            // vertical-align: middle;
            // padding-top: 1.25rem;
 
            height: 60px;
            width: 60px;
            border-radius: 50%;
            display: inline-block;
            // line-height: 65px;
            padding-top: 20.5px;
            position: absolute;
            text-align: center;
            top: 2rem;
            right: 0px;
            margin: 1.5rem;
            box-shadow: 0px 0px 8px #6c6b6b;
            font-size: 16px;
            margin-top: 0px;
            background: white;
            :hover{
              cursor: pointer;
            }
          }
        
      }
    }
  }

`;

class MenuModal extends Component {
  static propTypes = {
    history: PropTypes.object
  }; 
  constructor(props) {
    super(props);
    // let curScreenWidth = window.innerWidth;
    let curScreenHeight = window.innerHeight;
    let sp_width = 1660;
    let initState = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.INIT_STATUS));
    let navigation_map = initState.navigation_map;
    let navigation_map_pc = [];
    let navigation_map_tablet = [];
    if (navigation_map != null && navigation_map != undefined) {
      if (navigation_map.pc_items != null && navigation_map.pc_items != undefined && navigation_map.pc_items.length > 0) {
        navigation_map_pc = navigation_map.pc_items;
      }
    }

    let tablet_items_count = 0;
    if (navigation_map != null && navigation_map != undefined) {
      if (navigation_map.tablet_items != null && navigation_map.tablet_items != undefined && navigation_map.tablet_items.length > 0) {
        navigation_map_tablet = navigation_map.tablet_items;
        tablet_items_count = navigation_map.tablet_items.length - 1;
      }
    }    

    // menu's menu design update
    let divide_pos = -1;
    // if (curScreenWidth < sp_width && tablet_items_count != 0) {
    if (tablet_items_count != 0) {
      let real_menu_height = curScreenHeight * 0.975;

      let menu_h = real_menu_height * 0.084;
      // let menu_h = 65;
      // if(curScreenWidth > sp_width) menu_h = 88;
      // console.log("menu_h", menu_h);

      let total_menu_height = parseInt(tablet_items_count) * menu_h;

      if (total_menu_height > real_menu_height) {
        divide_pos = tablet_items_count;
        for (var i = tablet_items_count - 1; i >= 0; i--) {

          total_menu_height = i * menu_h;

          if (total_menu_height > real_menu_height) {
            continue;
          }

          divide_pos = i;
          break;
        }
      }

    }

    this.state = {
      titleTab: 1,
      // screen_width: curScreenWidth < sp_width ? "window_1200" : "window_1920",
      screen_width: "window_1200",
      sp_width: sp_width,
      navigation_map_pc:navigation_map_pc,
      navigation_map_tablet:navigation_map_tablet,
      divide_pos: divide_pos
    }
    
  }

  componentDidMount() {    
    document.getElementById("calc_dlg").focus();
    window.addEventListener('resize', this.handleResize);
    let menu_info = localApi.getObject('select_menu_info');
    if (menu_info != null && menu_info != undefined && menu_info.menuTab != null && menu_info.menuTab != undefined) {
      this.setState({titleTab: menu_info.menuTab});
    }
  }

  handleResize = () => {
    // let curScreenWidth = window.innerWidth;
    // if (curScreenWidth < this.state.sp_width) {
    //   this.setState({
    //     screen_width: "window_1200"
    //   });
    // }
    // if (curScreenWidth > this.state.sp_width) {
    //   this.setState({
    //     screen_width: "window_1920"
    //   });
    // }
  }

  // selectTitleTab = e => {
  //   if(parseInt(e.target.id) == 1) {
  //     this.setState({ 
  //       titleTab: parseInt(e.target.id) ,
  //     });
  //   }
  //   if(parseInt(e.target.id) == 2) {
  //     this.setState({ 
  //       titleTab: parseInt(e.target.id) ,
  //     });
  //   }
  //   if(parseInt(e.target.id) == 3) {
  //     this.setState({ 
  //       titleTab: parseInt(e.target.id) ,
  //     });
  //   }
  //   if(parseInt(e.target.id) == 4) {
  //     this.setState({ 
  //       titleTab: parseInt(e.target.id) ,
  //     });
  //   }
  //   if(parseInt(e.target.id) == 111) {
  //     this.setState({ 
  //       titleTab: parseInt(e.target.id) ,
  //     });
  //   }
  //   if(parseInt(e.target.id) == 112) {
  //     this.setState({ 
  //       titleTab: parseInt(e.target.id) ,
  //     });
  //   }
  //   // if(parseInt(e.target.id) == 6) {
  //   //   this.setState({ 
  //   //     titleTab: parseInt(e.target.id) ,
  //   //   });
  //   // }
  // };

  selectTitleTab = tab => {
    // 閲覧権限
    if (tab.tab_name == "メンテナンス") {      
      if (!this.context.$canDoAction(this.context.FEATURES.MAINTENANCE, this.context.AUTHS.READ, 0)) {
        return;
      }
    }
    this.setState({
      titleTab: tab.tab_view_id
    });
    // if(id == 1) {
    //   this.setState({ 
    //     titleTab: id ,
    //   });
    // }
    // if(id == 2) {
    //   this.setState({ 
    //     titleTab: id ,
    //   });
    // }
    // if(id == 3) {
    //   this.setState({ 
    //     titleTab: id ,
    //   });
    // }
    // if(id == 4) {
    //   this.setState({ 
    //     titleTab: id ,
    //   });
    // }
    // if(id == 5) {
    //   this.setState({ 
    //     titleTab: id ,
    //   });
    // }

    // if(id == 111) {
    //   this.setState({ 
    //     titleTab: id ,
    //   });
    // }
    // if(id == 112) {
    //   this.setState({ 
    //     titleTab: id ,
    //   });
    // }
    // arrange(1, 2, 3, 4, 5, 6, 111, 112, 221, 222, 223)
    // if(parseInt(e.target.id) == 6) {
    //   this.setState({ 
    //     titleTab: parseInt(e.target.id) ,
    //   });
    // }
  };

  onCloseModal = () => {
    this.props.onCloseModal();
  }

  getTitle = () => {   
    let result = "";

    // // ------------------- test code ----------
    // let navigationMapArray = [
    //   {
    //     tab: {tab_id: 1, tab_view_id: 1, tab_name:"共通", tab_view_name: "共通", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 1, category_view_id: 1, category_name:"外来", category_view_name: "外来", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:146, name:"外来処方", url:"prescription", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:147, name:"外来注射", url:"injection", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:148, name:"外来処置", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0}              
    //         ]
    //       },
    //       {
    //         category: {category_id: 2, category_view_id: 2, category_name:"生理", category_view_name: "生理", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:149, name:"心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:150, name:"負荷心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:151, name:"ABI", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   },
    //   {
    //     tab: {tab_id: 2, tab_view_id: 2, tab_name:"部 門", tab_view_name: "部 門", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 3, category_view_id: 3, category_name:"薬剤", category_view_name: "薬剤", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:401, name:"処方受付", url:"/prescriptionList", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:402, name:"注射受付", url:"/injection/order_list", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //         ]
    //       },
    //       {
    //         category: {category_id: 4, category_view_id: 4, category_name:"訪問診療", category_view_name: "訪問診療", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:4008, name:"訪問診療グループ管理", url:"/visit/group_master", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:4005, name:"グループスケジュール登録", url:"visit_treatment_group", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:4006, name:"スケジュール登録", url:"visit_treatment_patient", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   }     
    // ];

    // let navigationMapTabletArray = [
    //   {
    //     tab: {tab_id: 1, tab_view_id: 1, tab_name:"共通", tab_view_name: "共通①", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 1, category_view_id: 1, category_name:"外来", category_view_name: "外来", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:146, name:"外来処方", url:"prescription", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:147, name:"外来注射", url:"injection", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:148, name:"外来処置", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0}              
    //         ]
    //       },
    //       {
    //         category: {category_id: 2, category_view_id: 2, category_name:"生理", category_view_name: "生理", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:149, name:"心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:150, name:"負荷心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:151, name:"ABI", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   },
    //   {
    //     tab: {tab_id: 1, tab_view_id: 2, tab_name:"共通", tab_view_name: "共通②", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 1, category_view_id: 2, category_name:"外来", category_view_name: "外来", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:146, name:"外来処方", url:"prescription", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:147, name:"外来注射", url:"injection", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:148, name:"外来処置", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0}              
    //         ]
    //       },
    //       {
    //         category: {category_id: 2, category_view_id: 3, category_name:"生理", category_view_name: "生理", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:149, name:"心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:150, name:"負荷心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:151, name:"ABI", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   },
    //   {
    //     tab: {tab_id: 2, tab_view_id: 3, tab_name:"部 門", tab_view_name: "部 門①", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 3, category_view_id: 4, category_name:"薬剤", category_view_name: "薬剤", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:401, name:"処方受付", url:"/prescriptionList", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:402, name:"注射受付", url:"/injection/order_list", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //         ]
    //       },
    //       {
    //         category: {category_id: 4, category_view_id: 5, category_name:"訪問診療", category_view_name: "訪問診療", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:4008, name:"訪問診療グループ管理", url:"/visit/group_master", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:4005, name:"グループスケジュール登録", url:"visit_treatment_group", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:4006, name:"スケジュール登録", url:"visit_treatment_patient", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   },
    //   {
    //     tab: {tab_id: 2, tab_view_id: 4, tab_name:"部 門", tab_view_name: "部 門②", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 3, category_view_id: 4, category_name:"薬剤", category_view_name: "薬剤", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:401, name:"処方受付", url:"/prescriptionList", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:402, name:"注射受付", url:"/injection/order_list", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //         ]
    //       },
    //       {
    //         category: {category_id: 4, category_view_id: 5, category_name:"訪問診療", category_view_name: "訪問診療", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:4008, name:"訪問診療グループ管理", url:"/visit/group_master", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:4005, name:"グループスケジュール登録", url:"visit_treatment_group", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:4006, name:"スケジュール登録", url:"visit_treatment_patient", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   }     
    // ];
    // if (this.state.screen_width == "window_1920") {
    //   navigationMapArray.map(item=>{
    //     if (this.state.titleTab == item.tab.tab_view_id) {
    //       result = item.tab.tab_name;
    //     }
    //   });
    // } else if(this.state.screen_width == "window_1200") {
    //   navigationMapTabletArray.map(item=>{
    //     if (this.state.titleTab == item.tab.tab_view_id) {
    //       result = item.tab.tab_name;
    //     }
    //   });
    // }
    // // ------------------- test code end----------

    if (this.state.screen_width == "window_1920") {
      if (this.state.navigation_map_pc.length > 0) {
        this.state.navigation_map_pc.map(item=>{
          if (this.state.titleTab == item.tab.tab_view_id) {
            // result = item.tab.tab_name;
            result = item.tab.tab_view_name;
          }
        });          
      }
    } else if(this.state.screen_width == "window_1200") {
      if (this.state.navigation_map_tablet.length > 0) {
        this.state.navigation_map_tablet.map(item=>{
          if (this.state.titleTab == item.tab.tab_view_id) {
            // result = item.tab.tab_name;
            result = item.tab.tab_view_name;
          }
        });          
      }
    }


    // if (this.state.titleTab == 1 || this.state.titleTab == 101 || this.state.titleTab == 111 || this.state.titleTab == 112 || this.state.titleTab == 113) {
    //   result = "共   通";
    // }
    // if (this.state.titleTab == 2 || this.state.titleTab == 221 || this.state.titleTab == 222 || this.state.titleTab == 223) {
    //   result = "カルテ記載";
    // }
    // if (this.state.titleTab == 3) {
    //   result = "看護業務";
    // }
    // if (this.state.titleTab == 4 || this.state.titleTab == 441 || this.state.titleTab == 442) {
    //   result = "部   門";
    // }
    // if (this.state.titleTab == 5 || this.state.titleTab == 551) {
    //   result = "メンテナンス";
    // }
    // if (this.state.titleTab == 6) {
    //   result = "印   刷";
    // }
    return result;
  }

  getTabColor = (nTab) => {   
    let tab_view_id = 0;
    // // ------------------- test code ----------
    // let navigationMapArray = [
    //   {
    //     tab: {tab_id: 1, tab_view_id: 1, tab_name:"共通", tab_view_name: "共通", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 1, category_view_id: 1, category_name:"外来", category_view_name: "外来", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:146, name:"外来処方", url:"prescription", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:147, name:"外来注射", url:"injection", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:148, name:"外来処置", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0}              
    //         ]
    //       },
    //       {
    //         category: {category_id: 2, category_view_id: 2, category_name:"生理", category_view_name: "生理", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:149, name:"心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:150, name:"負荷心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:151, name:"ABI", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   },
    //   {
    //     tab: {tab_id: 2, tab_view_id: 2, tab_name:"部 門", tab_view_name: "部 門", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 3, category_view_id: 3, category_name:"薬剤", category_view_name: "薬剤", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:401, name:"処方受付", url:"/prescriptionList", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:402, name:"注射受付", url:"/injection/order_list", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //         ]
    //       },
    //       {
    //         category: {category_id: 4, category_view_id: 4, category_name:"訪問診療", category_view_name: "訪問診療", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:4008, name:"訪問診療グループ管理", url:"/visit/group_master", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:4005, name:"グループスケジュール登録", url:"visit_treatment_group", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:4006, name:"スケジュール登録", url:"visit_treatment_patient", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   }     
    // ];

    // let navigationMapTabletArray = [
    //   {
    //     tab: {tab_id: 1, tab_view_id: 1, tab_name:"共通", tab_view_name: "共通①", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 1, category_view_id: 1, category_name:"外来", category_view_name: "外来", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:146, name:"外来処方", url:"prescription", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:147, name:"外来注射", url:"injection", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:148, name:"外来処置", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0}              
    //         ]
    //       },
    //       {
    //         category: {category_id: 2, category_view_id: 2, category_name:"生理", category_view_name: "生理", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:149, name:"心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:150, name:"負荷心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:151, name:"ABI", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   },
    //   {
    //     tab: {tab_id: 1, tab_view_id: 2, tab_name:"共通", tab_view_name: "共通②", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 1, category_view_id: 2, category_name:"外来", category_view_name: "外来", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:146, name:"外来処方", url:"prescription", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:147, name:"外来注射", url:"injection", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:148, name:"外来処置", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0}              
    //         ]
    //       },
    //       {
    //         category: {category_id: 2, category_view_id: 3, category_name:"生理", category_view_name: "生理", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:149, name:"心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:150, name:"負荷心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:151, name:"ABI", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   },
    //   {
    //     tab: {tab_id: 2, tab_view_id: 3, tab_name:"部 門", tab_view_name: "部 門①", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 3, category_view_id: 4, category_name:"薬剤", category_view_name: "薬剤", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:401, name:"処方受付", url:"/prescriptionList", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:402, name:"注射受付", url:"/injection/order_list", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //         ]
    //       },
    //       {
    //         category: {category_id: 4, category_view_id: 5, category_name:"訪問診療", category_view_name: "訪問診療", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:4008, name:"訪問診療グループ管理", url:"/visit/group_master", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:4005, name:"グループスケジュール登録", url:"visit_treatment_group", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:4006, name:"スケジュール登録", url:"visit_treatment_patient", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   },
    //   {
    //     tab: {tab_id: 2, tab_view_id: 4, tab_name:"部 門", tab_view_name: "部 門②", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 3, category_view_id: 4, category_name:"薬剤", category_view_name: "薬剤", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:401, name:"処方受付", url:"/prescriptionList", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:402, name:"注射受付", url:"/injection/order_list", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //         ]
    //       },
    //       {
    //         category: {category_id: 4, category_view_id: 5, category_name:"訪問診療", category_view_name: "訪問診療", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:4008, name:"訪問診療グループ管理", url:"/visit/group_master", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:4005, name:"グループスケジュール登録", url:"visit_treatment_group", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:4006, name:"スケジュール登録", url:"visit_treatment_patient", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   }     
    // ];
    // // PC
    // if (this.state.screen_width == "window_1920") {
    //   navigationMapArray.map(item=>{
    //     if (item.tab.tab_view_id == nTab) {
    //       tab_view_id = item.tab.tab_id;
    //     }
    //   });
    // } else {
    //   navigationMapTabletArray.map(item=>{
    //     if (item.tab.tab_view_id == nTab) {
    //       tab_view_id = item.tab.tab_id;
    //     }
    //   });
    // }
    // // ------------------- test code end----------
    if (this.state.screen_width == "window_1920") {
      if (this.state.navigation_map_pc.length > 0) {        
        this.state.navigation_map_pc.map(item=>{
          if (item.tab.tab_view_id == nTab) {
            tab_view_id = item.tab.tab_id;
          }
        });
      }
    } else {
      if (this.state.navigation_map_tablet.length > 0) {        
        this.state.navigation_map_tablet.map(item=>{
          if (item.tab.tab_view_id == nTab) {
            tab_view_id = item.tab.tab_id;
          }
        });
      }
    }
    let nColor = "commonTabColor";
    switch(tab_view_id){
      case 1:
        nColor = "commonTabColor";
        break;
      case 2:
        nColor = "karteTabColor";
        break;
      case 3:
        nColor = "nurseTabColor";
        break;
      case 4:
        nColor = "partTabColor";
        break;
      case 5:
        nColor = "maintenanceTabColor";
        break;
      case 6:
        nColor = "printTabColor";
        break;      
    }

    return nColor;
  }

  getTabStyle = (tab_id) => {
    if (tab_id == 1) return "mn-style-1";
    if (tab_id == 2) return "mn-style-2";
    if (tab_id == 3) return "mn-style-3";
    if (tab_id == 4) return "mn-style-4";
    if (tab_id == 5) return "mn-style-5";
    if (tab_id == 6) return "mn-style-6";
    if (tab_id == 7) return "mn-style-7";
    if (tab_id == 8) return "mn-style-8";
    if (tab_id == 9) return "mn-style-9";
    if (tab_id == 10) return "mn-style-10";
    if (tab_id == 11) return "mn-style-11";
    if (tab_id == 12) return "mn-style-12";
    if (tab_id == 13) return "mn-style-13";
    if (tab_id == 14) return "mn-style-14";
    if (tab_id == 15) return "mn-style-15";
  }

  getTabBgColor = (tab_id) => {
    if (tab_id == 1) return "tab-bg-color-1";
    if (tab_id == 2) return "tab-bg-color-2";
    if (tab_id == 3) return "tab-bg-color-3";
    if (tab_id == 4) return "tab-bg-color-4";
    if (tab_id == 5) return "tab-bg-color-5";
    if (tab_id == 6) return "tab-bg-color-6";
  }



  render() {  
    // // ------------------- test code ----------
    // let navigationMapArray = [
    //   {
    //     tab: {tab_id: 1, tab_view_id: 1, tab_name:"共通", tab_view_name: "共通", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 1, category_view_id: 1, category_name:"外来", category_view_name: "外来", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:146, name:"外来処方", url:"prescription", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:147, name:"外来注射", url:"injection", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:148, name:"外来処置", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0}              
    //         ]
    //       },
    //       {
    //         category: {category_id: 2, category_view_id: 2, category_name:"生理", category_view_name: "生理", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:149, name:"心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:150, name:"負荷心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:151, name:"ABI", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   },
    //   {
    //     tab: {tab_id: 2, tab_view_id: 2, tab_name:"部 門", tab_view_name: "部 門", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 3, category_view_id: 3, category_name:"薬剤", category_view_name: "薬剤", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:401, name:"処方受付", url:"/prescriptionList", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:402, name:"注射受付", url:"/injection/order_list", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //         ]
    //       },
    //       {
    //         category: {category_id: 4, category_view_id: 4, category_name:"訪問診療", category_view_name: "訪問診療", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:4008, name:"訪問診療グループ管理", url:"/visit/group_master", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:4005, name:"グループスケジュール登録", url:"visit_treatment_group", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:4006, name:"スケジュール登録", url:"visit_treatment_patient", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   }     
    // ];

    // let navigationMapTabletArray = [
    //   {
    //     tab: {tab_id: 1, tab_view_id: 1, tab_name:"共通", tab_view_name: "共通①", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 1, category_view_id: 1, category_name:"外来", category_view_name: "外来", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:146, name:"外来処方", url:"prescription", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:147, name:"外来注射", url:"injection", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:148, name:"外来処置", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0}              
    //         ]
    //       },
    //       {
    //         category: {category_id: 2, category_view_id: 2, category_name:"生理", category_view_name: "生理", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:149, name:"心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:150, name:"負荷心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:151, name:"ABI", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   },
    //   {
    //     tab: {tab_id: 1, tab_view_id: 2, tab_name:"共通", tab_view_name: "共通②", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 1, category_view_id: 2, category_name:"外来", category_view_name: "外来", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:146, name:"外来処方", url:"prescription", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:147, name:"外来注射", url:"injection", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:148, name:"外来処置", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0}              
    //         ]
    //       },
    //       {
    //         category: {category_id: 2, category_view_id: 3, category_name:"生理", category_view_name: "生理", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:149, name:"心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:150, name:"負荷心電図", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:151, name:"ABI", url:"", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:0, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   },
    //   {
    //     tab: {tab_id: 2, tab_view_id: 3, tab_name:"部 門", tab_view_name: "部 門①", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 3, category_view_id: 4, category_name:"薬剤", category_view_name: "薬剤", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:401, name:"処方受付", url:"/prescriptionList", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:402, name:"注射受付", url:"/injection/order_list", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //         ]
    //       },
    //       {
    //         category: {category_id: 4, category_view_id: 5, category_name:"訪問診療", category_view_name: "訪問診療", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:4008, name:"訪問診療グループ管理", url:"/visit/group_master", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:4005, name:"グループスケジュール登録", url:"visit_treatment_group", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:4006, name:"スケジュール登録", url:"visit_treatment_patient", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   },
    //   {
    //     tab: {tab_id: 2, tab_view_id: 4, tab_name:"部 門", tab_view_name: "部 門②", is_visibe:1, is_enable: 0, sort_number:0},
    //     categories:[
    //       {
    //         category: {category_id: 3, category_view_id: 4, category_name:"薬剤", category_view_name: "薬剤", is_visible:1, is_enable: 1, sort_number:0},
    //         items:[
    //           {id:401, name:"処方受付", url:"/prescriptionList", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:402, name:"注射受付", url:"/injection/order_list", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //         ]
    //       },
    //       {
    //         category: {category_id: 4, category_view_id: 5, category_name:"訪問診療", category_view_name: "訪問診療", is_visible:1, is_enable: 1, sort_number: 0},
    //         items:[
    //           {id:4008, name:"訪問診療グループ管理", url:"/visit/group_master", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:0, sort_number:0},
    //           {id:4005, name:"グループスケジュール登録", url:"visit_treatment_group", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},
    //           {id:4006, name:"スケジュール登録", url:"visit_treatment_patient", is_alias_for:null, enabled_in_patient_page:1, enabled_in_default_page:1, is_visible: 1, is_enable: 1, is_modal:1, sort_number:0},         
    //         ]
    //       }        
    //     ]
    //   }     
    // ];
    // // ------------------- test code end----------

    let navigationMapArray = this.state.navigation_map_pc;
    let navigationMapTabletArray = this.state.navigation_map_tablet;

    return (
      <MenuModalBox
        className="content"
        id="calc_dlg"
      >
      {/*--------- PC -------------*/}
      {this.state.screen_width == "window_1920" && (
        <div className="dial-menu-content" id={'haruka-menu-list'}>
          <div className="dial-menu-left">
            <ul>
              {navigationMapArray != null && navigationMapArray != undefined && navigationMapArray.length > 0 && navigationMapArray.map((item, key)=>{
                  if (item.tab.tab_view_name != "サイドバー")
                      return <li key={key} className={`${this.getTabStyle(item.tab.tab_view_id)} ${this.getTabBgColor(item.tab.tab_id)} menu-left-radius ${this.state.titleTab == item.tab.tab_view_id && "selected"}`} onClick={()=>this.selectTitleTab(item.tab)}><span>{item.tab.tab_view_name}</span></li>;
              })}
              {/*<li className={`mn-style-1 menu-left-radius ${this.state.titleTab == 1 && "selected"}`} onClick={()=>this.selectTitleTab(1)}><span>共   通</span></li>              
              <li className={`mn-style-2 menu-left-radius ${this.state.titleTab == 2 && "selected"}`} onClick={()=>this.selectTitleTab(2)}><span>カルテ記載</span></li>
              <li className={`mn-style-3 menu-left-radius ${this.state.titleTab == 3 && "selected"}`} onClick={()=>this.selectTitleTab(3)}><span>看護業務</span></li>
              <li className={`mn-style-4 menu-left-radius ${this.state.titleTab == 4 && "selected"}`} onClick={()=>this.selectTitleTab(4)}><span>部   門</span></li>
              <li className={`mn-style-5 menu-left-radius ${this.state.titleTab == 5 && "selected"}`} onClick={()=>this.selectTitleTab(5)}><span>メンテナンス</span></li>
              <li className={`mn-style-6 menu-left-radius ${this.state.titleTab == 6 && "selected"}`} onClick={()=>this.selectTitleTab(6)}><span>印   刷</span></li>*/}
            </ul>
          </div>
          <div className={`dial-menu-body ${this.getTabColor(this.state.titleTab)}`}>        
          <div className="dial-menu-title">
            <p>{this.getTitle()}</p>
            <span onClick={this.onCloseModal}>閉じる</span>
          </div>
          <div className="nav-modal-body">
            <MenuModalBody 
            tab_id={this.state.titleTab}
            onGoto={this.props.onGoto}
            updateFavouriteList={this.props.updateFavouriteList}
            favouriteList={this.props.favouriteList}
            screen_width={this.state.screen_width}          
            />
          </div>
          </div>
          <div className="dial-menu-right">
            <ul>
              {navigationMapArray != null && navigationMapArray != undefined && navigationMapArray.length > 0 && navigationMapArray.map((item, key)=>{
                if (item.tab.tab_view_name != "サイドバー")
                return <li key={key} className={`${this.getTabStyle(item.tab.tab_view_id)} ${this.getTabBgColor(item.tab.tab_id)} menu-right-radius ${this.state.titleTab == item.tab.tab_view_id && "selected"}`} onClick={()=>this.selectTitleTab(item.tab)}><span>{item.tab.tab_view_name}</span></li>;
              })}
              {/*<li className={`mn-style-1 menu-right-radius ${this.state.titleTab == 1 && "selected"}`} onClick={()=>this.selectTitleTab(1)}><span>共   通</span></li>              
              <li className={`mn-style-2 menu-right-radius ${this.state.titleTab == 2 && "selected"}`} onClick={()=>this.selectTitleTab(2)}><span>カルテ記載</span></li>
              <li className={`mn-style-3 menu-right-radius ${this.state.titleTab == 3 && "selected"}`} onClick={()=>this.selectTitleTab(3)}><span>看護業務</span></li>
              <li className={`mn-style-4 menu-right-radius ${this.state.titleTab == 4 && "selected"}`} onClick={()=>this.selectTitleTab(4)}><span>部   門</span></li>
              <li className={`mn-style-5 menu-right-radius ${this.state.titleTab == 5 && "selected"}`} onClick={()=>this.selectTitleTab(5)}><span>メンテナンス</span></li>
              <li className={`mn-style-6 menu-right-radius ${this.state.titleTab == 6 && "selected"}`} onClick={()=>this.selectTitleTab(6)}><span>印   刷</span></li>*/}
            </ul>
          </div>
        </div>   
      )}
      {/*--------- タブレット用 -------------*/}
      {this.state.screen_width == "window_1200" && (
        <div className="dial-menu-content" id={'haruka-menu-list'}>
          {this.state.divide_pos == -1 && (
            <div className="dial-menu-left">
              <ul>
                {navigationMapTabletArray != null && navigationMapTabletArray != undefined && navigationMapTabletArray.length > 0 && navigationMapTabletArray.map((item, key)=>{
                    if (item.tab.tab_view_name != "サイドバー")
                        return <li key={key} className={`${this.getTabStyle(item.tab.tab_view_id)} ${this.getTabBgColor(item.tab.tab_id)} menu-left-radius ${this.state.titleTab == item.tab.tab_view_id && "selected"}`} onClick={()=>this.selectTitleTab(item.tab)}><span>{item.tab.tab_view_name}</span></li>;
                })}
              </ul>
            </div>
          )}
          <div className={`dial-menu-body ${this.getTabColor(this.state.titleTab)}`}>        
          <div className="dial-menu-title">
            <p>{this.getTitle()}</p>
            <span onClick={this.onCloseModal}>閉じる</span>
          </div>
          <div className="nav-modal-body">
            <MenuModalBody 
            tab_id={this.state.titleTab}
            onGoto={this.props.onGoto}
            updateFavouriteList={this.props.updateFavouriteList}
            favouriteList={this.props.favouriteList}
            screen_width={this.state.screen_width}
            sp_width={this.state.sp_width}                    
            />
          </div>
          </div>
          {this.state.divide_pos != -1 ? (
            <>
              <div className="dial-menu-right second-right">
                <ul>
                  {navigationMapTabletArray != null && navigationMapTabletArray != undefined && navigationMapTabletArray.length > 0 && navigationMapTabletArray.filter((_ele, _idx)=>{
                    if (_idx >= this.state.divide_pos) return _ele;
                  }).map((item, key)=>{
                      if (item.tab.tab_view_name != "サイドバー")
                          return <li key={key} className={`${this.getTabStyle(item.tab.tab_view_id)} ${this.getTabBgColor(item.tab.tab_id)} menu-right-radius ${this.state.titleTab == item.tab.tab_view_id && "selected"}`} onClick={()=>this.selectTitleTab(item.tab)}><span>{item.tab.tab_view_name}</span></li>;
                  })}                  
                </ul>
              </div>
              <div className="dial-menu-right">
                <ul>
                  {navigationMapTabletArray != null && navigationMapTabletArray != undefined && navigationMapTabletArray.length > 0 && navigationMapTabletArray.filter((_item, _key)=>{
                    if (_key < this.state.divide_pos) return _item;
                  }).map((item, key)=>{
                      if (item.tab.tab_view_name != "サイドバー")
                          return <li key={key} className={`${this.getTabStyle(item.tab.tab_view_id)} ${this.getTabBgColor(item.tab.tab_id)} menu-right-radius ${this.state.titleTab == item.tab.tab_view_id && "selected"}`} onClick={()=>this.selectTitleTab(item.tab)}><span>{item.tab.tab_view_name}</span></li>;
                  })}                  
                </ul>
              </div>
            </>
          ):(
            <div className="dial-menu-right">
              <ul>
                {navigationMapTabletArray != null && navigationMapTabletArray != undefined && navigationMapTabletArray.length > 0 && navigationMapTabletArray.map((item, key)=>{
                    if (item.tab.tab_view_name != "サイドバー")
                        return <li key={key} className={`${this.getTabStyle(item.tab.tab_view_id)} ${this.getTabBgColor(item.tab.tab_id)} menu-right-radius ${this.state.titleTab == item.tab.tab_view_id && "selected"}`} onClick={()=>this.selectTitleTab(item.tab)}><span>{item.tab.tab_view_name}</span></li>;
                })}                
              </ul>
            </div>
          )}
        </div> 
      )}
      
      </MenuModalBox>
    );
  }
}

MenuModal.contextType = Context;

MenuModal.propTypes = {
  onCloseModal: PropTypes.func,
  onGoto: PropTypes.func,
  updateFavouriteList: PropTypes.func,
  favouriteList: PropTypes.array
};

export default MenuModal;
