import React, { Component } from "react";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import SearchBar from "~/components/molecules/SearchBar"
import Button from "~/components/atoms/Button";
import MedicineModal from "../modals/MedicineModal";
import RadioButton from "~/components/molecules/RadioInlineButton";
import axios from "axios";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialUserSearchPreview from "~/components/templates/Dial/Master/DialUserSearchPreview";
import PropTypes from "prop-types";
import DialSideBar from "~/components/templates/Dial//DialSideBar";
import DialPatientNav from "~/components/templates/Dial/DialPatientNav";
import {getTimeZoneList} from "~/components/templates/Dial/DialMethods/getSystemTimeZone";
import SelectPannelModal from "~/components/templates/Dial/Common/SelectPannelModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import {Dial_tab_index} from "~/helpers/dialConstants";

const Card = styled.div`
  position: fixed;  
  top: 70px;
  // width: calc(100% - 190px);
  width: calc(100% - 390px);
  left: 200px;
  margin: 0px;
  // height: 100vh;
  height: 100%;
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
  .others {
    position:absolute;
    right:1.25rem;
    button {
        margin-left: 0.2rem;
        margin-bottom: 0px;
        margin-top: 0.3rem;
    }
    span {
        font-size: 1rem;
    }
  }
  .disable-button {
        background: rgb(101, 114, 117);
    }

  .search-group{
    margin-top: 1.5rem;
    width: 100%;
    display: block;
    input{
      width:19rem
    }
  }
  .search-type{
    font-size: 1rem;
    margin-left: 1rem;
    margin-top: 0.25rem;
    margin-bottom:0.25rem
    height: 2.5rem;
    .radio-btn label{
        width: 6rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.1rem;
        padding: 0.25rem 0.3rem;
        font-size: 1rem;  
    }
    .radio-btn:last-child {
        label {
            width: 6rem;
        }
    }
  }
  .label-style{
    padding: 0.4rem;
    float: left;
  }
`;
const SearchPart = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  // height: 4.375rem;
  // padding: 1.25rem;
  padding-top: 0.25rem;
  height: 3rem;
  float: left;
  .search-box {
      width: 100%;
      display: flex;
      justify-content: space-between;      
      input{
        width:19rem;
        height:38px;
      }
      button{
        margin-left: 3px;
        padding: 6px 8px;
        span{
          font-size: 1rem;
        }
      }
      .exam-item {
            border:1px solid #aaa;
            width: 20rem;
            padding-left:5px;
            // height: 30px;
            line-height: 30px;
            cursor:pointer;
            height: 2.25rem;
            border-radius: 5px;
        }
  }
  .label-title {
    width: 5rem;
    text-align: right;
    margin-right: 0.625rem;
  }
  .pullbox-title{font-size:1rem;}
  .pullbox-select {
      font-size: 1rem;
      width: 9.375rem;
  }
  .medicine_type {
    font-size: 1rem;
    margin-left: 1rem;
    .radio-btn label{
        width: 3rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin: 0 0.3rem;
        padding: 0.25rem 0.3rem;
        font-size: 1rem;  
    }
    .radio-btn:last-child {
        label {
            width: 6rem;
        }
    }
  }
 `;
const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;  
  float: left;
  border: solid 1px lightgrey;
  margin-bottom: 3px;  
  margin-top:7px;
  label {
      text-align: right;
  }
  table {
    margin-bottom:0;
    thead{
        display:table;
        width:100%;
    }
    tbody{
        display:block;
        overflow-y: auto;
        height: calc( 100vh - 30rem);
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
          width: 4.375rem;
      }
      .item-no {
        width: 3.125rem;
      }
      .code-number {
          width: 7.5rem;
      }
      .name{
          width:14rem;
      }
  }

 `;
 const sort_order = [
     { id: 0, value: "表示順", field_name:"sort_number"},
     { id: 1, value: "コード順", field_name:"code"},
     { id: 2, value: "カナ順", field_name:"name_kana"},
     { id: 3, value: "名称順", field_name:"name"},
  ];
// const display_class = [
//     { id: 0, value: "全て" },
//     { id: 1, value: "表示のみ"},
//     { id: 2, value: "非表示のみ"},
// ];

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

const ContextMenu = ({ visible, x,  y, menu_item, parent}) => {
    if (visible) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    <li><div onClick={() => parent.contextMenuAction(menu_item,"pattern")}>{menu_item.title1}</div></li>
                    {menu_item.title2 != undefined && menu_item.title2 != null && menu_item.title2 != "" && (
                        <li><div onClick={() => parent.contextMenuAction(menu_item, "dr_karte")}>{menu_item.title2}</div></li>
                    )}
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};

const medicine_type_name = ["内服", "頓服", "外用", "処置", "麻酔", "インスリン"];
class DialUserSearch extends Component {
    constructor(props) {
        super(props);

       let table_data = [];
        this.state = {
            alert_messages:"",
            schVal: "",
            table_data,
            isOpenCodeModal: false,
            category: '',
            modal_data:{},
            search_order: 2,        //表示順
            search_class: 1,        //表示区分

            isUpdateConfirmModal: false,
            isDeleteConfirmModal: false,
            isOpenPreviewModal: false,
            confirm_message:"",

            cur_object: "パターン",// 対象
            cur_days: "すべて",// 曜日
            cur_times: "すべて",// 時間帯
            cur_depart: "すべて",// 区分
            timezone: 0,

            cur_page_type: "medicine", 
            isOpenMedicinePanel: false,
            isOpenPrescriptionMedicineModal: false,
            user_search_category: "", //インスリン検索

            medicine_item: {
              code: 0,
              name: ""
            },

            /*------cur_page_type--------*/
            // 薬剤使用者検索: "medicine"
            // 透析中処方使用者検索: "dialPrescription"
            // 注射使用者検索: "injection"
            // 検査実施者検索: "inspection"

            cur_sort_type: "kana_name", // 並び

            /*--------cur_sort_type--------*/
            // カナ氏名: "kana_name"
            // 患者番号: "patient_number"

        };
        // 薬剤使用者検索
        this.search_options = {
          medicine:{// 薬剤使用者検索
            object:["パターン", "明細"],//対象,
            days:["月水金", "火木土", "すべて"],//曜日,
            times:["午前", "午後", "夜間", "深夜", "すべて"],//時間帯,
            depart:["定期1", "定期2", "定期3", "臨時", "すべて"],//区分
            record:{
              title:{
                  patient_number:"患者番号",
                  patient_name:"氏名",
                  medicine_code:"薬剤コード",
                  medicine_name:"薬剤名称",
                  usage_name:"服用",
                  amount:"数量",
                  unit:"単位",
                  time_limit_from:"パターン変更日",
              },
              align:{
                  patient_number:"right",
                  patient_name:"left",
                  medicine_code:"right",
                  medicine_name:"left",
                  usage_name:"left",
                  amount:"right",
                  unit:"left",
                  time_limit_from:"left",
              },
              width:{
                  patient_number:"6rem",
                  patient_name:"14rem",
                  medicine_code:"7rem",
                  medicine_name:"14rem",
                  usage_name:"14rem",
                  amount:"3rem",
                  unit:"4rem",
                  time_limit_from:"",
              },
            }
          },
          dialPrescription:{// 透析中処方使用者検索
            object:["パターン", "明細"],//対象,
            days:["月水金", "火木土", "すべて"],//曜日,
            times:["午前", "午後", "夜間", "深夜", "すべて"],//時間帯,
            depart:[],//区分
            record:{
              title:{
                  patient_number:"患者番号",
                  patient_name:"氏名",
                  medicine_code:"薬剤コード",
                  medicine_name:"薬剤名称",
                  amount:"数量",
                  unit:"単位",
                  weekday:"曜日",
                  timing_name:"タイミング",
                  time_limit_from:"期間",
              },
              align:{
                  patient_number:"right",
                  patient_name:"left",
                  medicine_code:"right",
                  medicine_name:"left",
                  amount:"right",
                  unit:"left",
                  weekday:"left",
                  timing_name:"left",
                  time_limit_from:"left",
              },
              width:{
                  patient_number:"7.5rem",
                  patient_name:"14rem",
                  medicine_code:"9rem",
                  medicine_name:"14rem",
                  amount:"4rem",
                  unit:"4rem",
                  weekday:"3rem",
                  timing_name:"6rem",
                  time_limit_from:"",
              },
            }
          },
          injection:{// 注射使用者検索
            object:["パターン", "明細"],//対象,
            days:["月水金", "火木土", "すべて"],//曜日,
            times:["午前", "午後", "夜間", "深夜", "すべて"],//時間帯,
            depart:["定期", "臨時", "すべて"],//区分
            record:{
              title:{
                  patient_number:"患者番号",
                  patient_name:"氏名",
                  medicine_code:"注射コード",
                  medicine_name:"注射名称",
                  amount:"数量",
                  unit:"単位",
                  week_interval:"実施間隔",
                  time_limit_from:"期間",
              },
              align:{
                  patient_number:"right",
                  patient_name:"left",
                  medicine_code:"right",
                  medicine_name:"left",
                  amount:"right",
                  unit:"left",
                  week_interval:"left",
                  time_limit_from:"left",
              },
              width:{
                  patient_number:"7.5rem",
                  patient_name:"14rem",
                  medicine_code:"9rem",
                  medicine_name:"14rem",
                  amount:"4rem",
                  unit:"4rem",
                  week_interval:"9rem",
                  time_limit_from:"",
              },
            }
          },
          inspection:{// 検査実施者検索
            object:["パターン", "明細"],//対象,
            days:["月水金", "火木土", "すべて"],//曜日,
            times:["午前", "午後", "夜間", "深夜", "すべて"],//時間帯,
            depart:["定期", "臨時", "すべて"],//区分
            record:{
              title:{
                  patient_number:"患者番号",
                  patient_name:"氏名",
                  medicine_code:"検査コード",
                  medicine_name:"検査名称",
                  timing_name:"タイミング",
                  week_interval:"実施間隔",
                  time_limit_from:"期間",
              },
              align:{
                  patient_number:"right",
                  patient_name:"left",
                  medicine_code:"right",
                  medicine_name:"left",
                  timing_name:"left",
                  week_interval:"left",
                  time_limit_from:"left",
              },
              width:{
                  patient_number:"7.5rem",
                  patient_name:"14rem",
                  medicine_code:"9rem",
                  medicine_name:"14rem",
                  timing_name:"9rem",
                  week_interval:"9rem",
                  time_limit_from:"",
              },
            }
          }
        };

        this._object=["パターン", "明細"];//対象
        this._days=["月水金", "火木土", "すべて"];//曜日
        this._times=["午前", "午後", "夜間", "深夜", "すべて"];//時間帯
        this._depart=["定期1", "定期2", "定期3", "臨時", "すべて"];//区分
    }
    
    async componentDidMount(){      
      let timeZoneList = getTimeZoneList();
      timeZoneList.push({id: 0, value:"すべて"});
      this.setState({
          time_zone_list: timeZoneList,
      });
    }

    // 検索
    searchMedicineList = async () => {
        let path = "/app/api/v2/dial/master/medicine_search";
        let post_data = {
            keyword: this.state.schVal,
            category:this.state.category,
            weekday:this.state.cur_days,
            order: sort_order[this.state.cur_sort_type].field_name,
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({table_data: data});
    };

    getPageTitle = () => {
      let result = "薬剤名";
      if (this.state.cur_page_type == "injection") {
        result = "注射名";
      } else if(this.state.cur_page_type == "inspection") {
        result = "検査名";
      }
      return result;
    }

    // 検索
    searchMedicineListByKind = async () => {
        if(this.state.medicine_item.code === 0){
            // this.setState({alert_messages:this.getPageTitle() + "を選択してください。"});
            return;
        }
        let path = "/app/api/v2/dial/medicine_user/search";
        let post_data = {
            keyword: this.state.medicine_item.code,
            type: this.getObjectType(),
            kind: this.state.cur_page_type,
            timezone: this.state.timezone,
            weekday:this.getDaysType(),
            category:this.getCategoryType(),
            order: this.state.cur_sort_type,
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({table_data: data});
    };

    //対象
    getObjectType = () => {
      let result = 0;// パターン
      if (this.state.cur_object == "明細") {
        result = 1;
      }
      return result;
    }

    //曜日
    getDaysType = () => {
      let result = 0;// パターン
      if (this.state.cur_days == "月水金") {
        result = 1;
      }
      if (this.state.cur_days == "火木土") {
        result = 2;
      }
      return result;
    }

    //区分
    getCategoryType = () => {
      let result = -1;// すべて    
      if (this.state.cur_page_type == "medicine") {
        if (this.state.cur_depart == "定期1") result = 1;
        if (this.state.cur_depart == "定期2") result = 2;
        if (this.state.cur_depart == "定期3") result = 3;
        if (this.state.cur_depart == "臨時") result = 0;
        if (this.state.cur_depart == "すべて") result = -1;
      } else {
        if (this.state.cur_depart == "臨時") result = 1;
        if (this.state.cur_depart == "定期") result = 0;
        if (this.state.cur_depart == "すべて") result = -1;
      }
      
      return result;
    }

    enterPressed = e => {
        var code = e.keyCode || e.which;        
        if (code === 13) {
          // this.searchMedicineList();
          this.openMedicinePanel();
        }
    };
    search = word => {
        word = word.toString().trim();
        let medicine_item = this.state.medicine_item;
        medicine_item.name = word;
        this.setState({
          medicine_item
        });
        // this.setState({ schVal: word });
    };

    handleOk = () => {
        this.setState({
            isOpenCodeModal: false
        });
        this.searchMedicineList();
    };    
    createCode = () => {
        this.setState({
          isOpenCodeModal: true,
          modal_data:null
        });
    };

    getPrescriptionClassificList = async () => {
        let path = "/app/api/v2/dial/master/get_prescription_category";
        let post_data = {
            is_enabled: 1,
        };
        let { data } = await axios.post(path, {params: post_data});
        this.setState({modal_data: data});
    };
    openPrescription = () => {
        this.props.history.replace("/dial/master/prescription_set");
        // this.setState({ isOpenPrescription: true }, () => {
        //     this.getPrescriptionClassificList();
        // });
    };
    closeModal = () => {
        this.setState({
            isOpenCodeModal: false,
            isOpenPrescription: false,
            isOpenMedicinePanel: false,
            isOpenPrescriptionMedicineModal: false,
            alert_messages: "",
            user_search_category: "",
        })
    };

    selectMedicineType = (e) => {
      this.setState({ category: e.target.value}, () => {
        this.searchMedicineList();
      });
    };
   
    // 対象
    selectObjectType = (e) => {
      this.setState({ cur_object: e.target.value},()=>{
        this.searchMedicineListByKind();
      });
    };

    // 曜日
    selectDaysType = (e) => {
      this.setState({ cur_days: e.target.value},()=>{
        this.searchMedicineListByKind();
      });
    };

    // 時間帯
    /*selectTimesType = (e) => {
      this.setState({ cur_times: e.target.value}, () => {
        this.searchMedicineListByKind();
      });
    };*/
    selectTimezone = (e) => {
        this.setState({ timezone: parseInt(e.target.value)},()=>{
        this.searchMedicineListByKind();
      })
    };

    // 区分
    selectDepartType = (e) => {
      this.setState({ cur_depart: e.target.value},()=>{
        this.searchMedicineListByKind();
      });
    };

    // 並び
    selectSortType = (e) => {
      this.setState({ cur_sort_type: e.target.value},()=>{
        this.searchMedicineListByKind();
      });
    };

    getOrderSelect = e => {                 //表示順
        this.setState({ search_order: parseInt(e.target.id) }, () => {
            this.searchMedicineList();
        });
    };
    getClassSelect = e => {                 //表示区分
        this.setState({ search_class: parseInt(e.target.id) }, () => {
            this.searchMedicineList();
        });
    };

    handleClick = (e, index) => {
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
          let menu_item = this.state.table_data[index];
            menu_item.cur_page_type = this.state.cur_page_type;
            menu_item.cur_object = this.state.cur_object;
            let preview_title = "";
            switch (this.state.cur_page_type){
                case "medicine":
                    preview_title = "処方";
                    break;
                case "dialPrescription":
                    preview_title = "透析中処方";
                    break;
                case "injection":
                    preview_title = "注射";
                    break;
                case "inspection":
                    preview_title = "薬剤";
                    break;
            }
            
            if (this.state.cur_object == "パターン") {
                preview_title = preview_title + 'パターンへ';
                menu_item.title1 = preview_title;
            } else {
                preview_title = preview_title + 'スケジュールへ';
                menu_item.title1 = preview_title;
                menu_item.title2 = 'Drカルテ';
            }
            

          this.setState({
            contextMenu: {
              visible: true,
              x: e.clientX - 200,
              y: e.clientY + window.pageYOffset - 70,
              menu_item
            },
            row_index: index
          });
        }
    }

    contextMenuAction = (menu_item, type) => {
        if (type === "pattern"){
            let patientInfo = menu_item.all_data;
            sessApi.setObjectValue("dial_setting", "patient", patientInfo);
            if (this.state.cur_object == "パターン") {
                if (this.state.cur_page_type == 'medicine') {
                    this.props.history.replace("/dial/pattern/prescription");
                } else if (this.state.cur_page_type == 'dialPrescription') {
                    this.props.history.replace("/dial/pattern/dialPrescript");
                } else if (this.state.cur_page_type == 'injection') {
                    this.props.history.replace("/dial/pattern/injection");
                } else if (this.state.cur_page_type == 'inspection') {
                    this.props.history.replace("/dial/pattern/inspection");
                }
            } else {
                let sch_date = menu_item.schedule_date;
                sessApi.setObjectValue("dial_schedule_table", "schedule_date", sch_date);
                sessApi.setObjectValue("dial_schedule_table", "open_tab", this.state.cur_page_type);
                this.props.history.replace("/dial/schedule/Schedule");
            }

        }
        if (type === "dr_karte"){
            let sch_date = menu_item.schedule_date;
            let system_patient_id = menu_item.system_patient_id;
            sessApi.setObjectValue("from_print", "schedule_date", sch_date);
            sessApi.setObjectValue("from_print", "system_patient_id", system_patient_id);
            sessApi.setObjectValue("from_print", "tab_id", Dial_tab_index.DRMedicalRecord);
            this.props.history.replace("/dial/board/system_setting");
        }
    };

    confirmCancel=()=> {
      this.setState({
          isUpdateConfirmModal: false,
          isDeleteConfirmModal: false,
          isOpenPreviewModal: false,
          confirm_message: "",
      });
    }

    delete = (name) => {
      this.setState({
          isDeleteConfirmModal : true,
          confirm_message: "「" + name + "」" + " これを削除して良いですか？",
      });
    }      

    editData = (index) => {
      let modal_data = this.state.table_data[index];
      this.setState({
          modal_data,
          // row_index: index,
          isOpenCodeModal: true
      });
    };

    deleteData = async () => {
      let path = "/app/api/v2/dial/master/medicine_delete";
      let post_data = {
          params: this.state.selected_number,                    
      };
      await axios.post(path,  post_data);
      this.confirmCancel();
      this.searchMedicineList();
    };

    openPreviewModal=()=>{
        this.setState({isOpenPreviewModal:true});
    };

    selectPageType = (type) => {
      if (this.state.cur_page_type == type) return;

      switch(type){
        case "medicine":
          break;
        case "dialPrescription":
          break;
        case "injection":
          break;
        case "inspection":
          break;  
      }

      this.setState({
        cur_page_type: type,
        cur_object: "パターン",// 対象
        cur_days: "すべて",// 曜日
        cur_times: "すべて",// 時間帯
        cur_depart: "すべて",// 区分
        timezone: 0,
        cur_sort_type: "kana_name", // 並び
        schVal: "",
        medicine_item:{
          code: 0,
          name: ""
        },
        table_data: []
      }, ()=>{
        this.searchMedicineListByKind();
      });
    }

    // open select medicine panel
    openMedicinePanel=(param = null)=>{
      if (param != null) {
        this.setState({
          isOpenMedicinePanel:true,
          user_search_category: param
        });
      } else {        
        this.setState({
          isOpenMedicinePanel:true,
          user_search_category: "",
        });
      }
        // if (this.state.cur_page_type == "medicine" || this.state.cur_page_type == "dialPrescription") {
        //   this.setState({
        //     isOpenPrescriptionMedicineModal:true
        //   });
        // } else {          
        //   this.setState({
        //     isOpenMedicinePanel:true
        //   });
        // }
    };

    selectMaster = (item) => {
        let medicine_item = this.state.medicine_item;
        medicine_item.code = item.code;
        medicine_item.name = item.name;
        this.setState({
          medicine_item,
          isOpenMedicinePanel: false,
          user_search_category: "",
        },()=>{
          this.searchMedicineListByKind();
        })
    };

    // selectPrescriptionMaster = (medicine_data, rp_number,is_open_usage) => {
      // console.log("medicine_data, rp_number,is_open_usage", medicine_data, rp_number,is_open_usage);
      // if(is_open_usage ===1 ) {
      //     let data_json_item = {...this.state.data_json_item};
      //     let medicine = {...medicine_data};
      //     data_json_item.medicines.push(medicine);
      //     this.setState({
      //         data_json_item,
      //         isOpenMedicineModal: false,
      //         isOpenUsageModal: true,
      //     });
      //     return;
      // } else {
      //     let data_json = this.state.data_json;
      //     let data_json_item = {...this.state.data_json[rp_number]};
      //     let medicines = data_json_item.medicines;
      //     if(this.state.selected_medicine !== undefined && this.state.selected_medicine != null &&
      //         this.state.change_med_index !== undefined && this.state.change_med_index != null) {
      //         medicines[this.state.change_med_index]=medicine_data;
      //         this.setState({
      //             change_med_index: null,
      //             selected_medicine: null
      //         });
      //     } else {
      //         medicines.push(medicine_data);
      //     }
      //     data_json_item.medicines = medicines;
      //     data_json[rp_number] = data_json_item;
      //     this.setState({
      //         data_json,
      //         isOpenMedicineModal: false,
      //     });
      // }
    // };

    getMedicinePanelType = () =>{
      let result = "注射";
      if (this.state.cur_page_type == "injection") {
        result = "注射";
      } else if(this.state.cur_page_type == "inspection") {
        result = "検査";
      } else {
        result = "薬剤";
      }
      return result;
    }    

    render() {        
        let {table_data} = this.state;
        let record_info = this.search_options[this.state.cur_page_type]['record'];
        let preview_title = "";
        switch (this.state.cur_page_type){
            case "medicine":
                preview_title = "薬剤使用者検索";
                break;
            case "dialPrescription":
                preview_title = "透析中処方使用者検索";
                break;
            case "injection":
                preview_title = "注射使用者検索";
                break;
            case "inspection":
                preview_title = "検査実施者検索";
                break;
        }
        return (
          <>        
              <DialSideBar
                  onGoto={this.selectPatient}
                  history = {this.props.history}
              />
              <DialPatientNav
                  patientInfo={this.state.patientInfo}
                  history = {this.props.history}
              />
            <Card>                
                <div className='flex'>                        
                  <div className="title">{preview_title}</div>
                  <div className='others'>
                      <Button onClick={()=>this.selectPageType("medicine")} className={`${this.state.cur_page_type == "medicine" ? "disable-button" : ""}`}>薬剤使用者検索</Button>                   
                      <Button onClick={()=>this.selectPageType("dialPrescription")} className={`${this.state.cur_page_type == "dialPrescription" ? "disable-button" : ""}`}>透析中処方使用者検索</Button>
                      <Button onClick={()=>this.selectPageType("injection")} className={`${this.state.cur_page_type == "injection" ? "disable-button" : ""}`}>注射使用者検索</Button>
                      <Button onClick={()=>this.selectPageType("inspection")} className={`${this.state.cur_page_type == "inspection" ? "disable-button" : ""}`}>検査実施者検索</Button>                        
                  </div>
                </div>   
                <div className="search-group">
                  <div className="search-type">
                      <div className="label-style">対象</div>
                      {this.search_options[this.state.cur_page_type].object.map((item, index)=>{
                              return (
                                  <>
                                      <RadioButton
                                          id={`object_${index}`}
                                          value={item}
                                          label={item}
                                          name="object_type"
                                          getUsage={this.selectObjectType}
                                          checked={this.state.cur_object == item ? true : false}
                                      />
                                  </>
                              );
                          })
                      }
                    </div>
                    <div className="search-type" style={{display:"flex"}}>
                      <div>
                        <div className="label-style">曜日</div>
                        {this.search_options[this.state.cur_page_type].days.map((item, index)=>{
                                return (
                                    <>
                                        <RadioButton
                                            id={`days_${index}`}
                                            value={item}
                                            label={item}
                                            name="days_type"
                                            getUsage={this.selectDaysType}
                                            checked={this.state.cur_days == item ? true : false}
                                        />
                                    </>
                                );
                            })
                        }
                      </div>
                      <div style={{marginLeft:"2rem"}}>
                        <div className="label-style">時間帯</div>
                        {this.state.time_zone_list != undefined && this.state.time_zone_list.length>0 &&(
                            this.state.time_zone_list.map((item)=>{
                                return (
                                    <>
                                        <RadioButton
                                            id={`time_${item.id}`}
                                            value={item.id}
                                            label={item.value}
                                            name="usage"
                                            getUsage={this.selectTimezone}
                                            checked={this.state.timezone === item.id ? true : false}
                                        />
                                    </>
                                );
                            })
                        )}
                        {/*{this.search_options[this.state.cur_page_type].times.map((item, index)=>{
                                return (
                                    <>
                                        <RadioButton
                                            id={`times_${index}`}
                                            value={item}
                                            label={item}
                                            name="times_type"
                                            getUsage={this.selectTimesType}
                                            checked={this.state.cur_times == item ? true : false}
                                        />
                                    </>
                                );
                            })
                        }*/}
                      </div>
                    </div>                    
                    <div className="search-type">
                      {this.search_options[this.state.cur_page_type].depart.length > 0 && (
                        <>
                          <div className="label-style">区分</div>
                          {this.search_options[this.state.cur_page_type].depart.map((item, index)=>{
                                  return (
                                      <>
                                          <RadioButton
                                              id={`depart_${index}`}
                                              value={item}
                                              label={item}
                                              name="depart_type"
                                              getUsage={this.selectDepartType}
                                              checked={this.state.cur_depart == item ? true : false}
                                          />
                                      </>
                                  );
                              })
                          }
                        </>
                      )}
                    </div>
                </div>
                <SearchPart>                    
                  <div className="search-box">
                    <div className="">
                      <div className="label-style">{this.getPageTitle()}</div>
                      <div style={{float: "left"}} className='search-bar'>
                        {/*<div className={'exam-item'} onClick={this.openMedicinePanel}>{this.state.medicine_item.name}</div>*/}
                        <SearchBar
                            placeholder=""
                            search={this.search}
                            value={this.state.medicine_item.name}
                            enterPressed={this.enterPressed}
                        />
                      </div>
                      {(this.state.cur_page_type == "medicine" || this.state.cur_page_type == "dialPrescription") && (
                        <>
                          <Button onClick={this.openMedicinePanel}>薬剤検索</Button>
                          <Button onClick={()=>this.openMedicinePanel("インスリン")}>インスリン検索</Button> 
                        </>
                      )}
                      {(this.state.cur_page_type == "injection") && (
                        <>
                          <Button onClick={this.openMedicinePanel}>注射検索</Button>                          
                        </>
                      )}
                      {(this.state.cur_page_type == "inspection") && (
                        <>
                          <Button onClick={this.openMedicinePanel}>検索</Button>                          
                        </>
                      )}
                    </div>
                    <div className="search-type" style={{display:"flex"}}>
                      <div className="label-style">並び</div>
                      <div>
                        <RadioButton
                          id={`sort_1`}
                          value={'kana_name'}
                          label={'カナ氏名'}
                          name="sort_type"
                          getUsage={this.selectSortType}
                          checked={this.state.cur_sort_type == 'kana_name' ? true : false}
                        />
                        <RadioButton
                          id={`sort_2`}
                          value={'patient_number'}
                          label={'患者番号'}
                          name="sort_type"
                          getUsage={this.selectSortType}
                          checked={this.state.cur_sort_type == 'patient_number' ? true : false}
                        />
                      </div>                     
                    </div>                    
                  </div>
                </SearchPart>
                <Wrapper>
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th className="item-no"/>
                                {Object.keys(this.search_options[this.state.cur_page_type]['record']['title']).map(title=>{
                                    return (
                                        <>
                                            <th style={{width:record_info['width'][title]}}>{record_info['title'][title]}</th>
                                        </>
                                    )
                                })}
                            </tr>
                        </thead>
                        <tbody id="code-table">
                        {table_data !== undefined && table_data !== null && table_data.length > 0 && (
                            table_data.map((item, index) => {
                                return (
                                    <>
                                    <tr onContextMenu={e => this.handleClick(e, index)}>                                    
                                        <td className="item-no text-right">{index+1}</td>
                                        {Object.keys(this.search_options[this.state.cur_page_type]['record']['title']).map(title=>{
                                            return (
                                                <>
                                                    <td style={{textAlign:record_info['align'][title], width:record_info['width'][title]}}>{ item[title]}</td>
                                                </>
                                            )
                                        })}
                                    </tr>
                                    </>
                                )
                            })
                        )}
                        </tbody>
                    </table>
                </Wrapper>
                <div className="footer-buttons">
                    <Button className='red-btn' onClick={this.openPreviewModal}>帳票プレビュー</Button>                    
                </div>
                {this.state.isOpenCodeModal && (
                    <MedicineModal
                        handleOk={this.handleOk}
                        closeModal={this.closeModal}
                        medicine_type_name = {medicine_type_name}
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
                row_index={this.state.row_index}
                />
                {this.state.isOpenPreviewModal && (
                    <DialUserSearchPreview
                        closeModal={this.confirmCancel.bind(this)}
                        modal_title={preview_title}
                        modal_type={"medicine_user_search"}
                        table_head={record_info['title']}
                        table_head_style={record_info['align']}
                        table_body={table_data}
                        cur_object={this.state.cur_object}
                        cur_days={this.state.cur_days}
                        time_zone={this.state.timezone}
                        cur_depart={this.state.cur_depart}
                    />
                )}
                {this.state.isOpenMedicinePanel && (
                  <>
                  {this.state.user_search_category == "インスリン" ? (
                    <SelectPannelModal
                        selectMaster = {this.selectMaster}
                        closeModal={this.closeModal}
                        MasterName = {this.getMedicinePanelType()}
                        master_category={this.state.user_search_category}
                        user_search_category={this.state.user_search_category}
                        user_search_name={this.state.medicine_item.name}
                    />
                  ):(                  
                    <SelectPannelModal
                        selectMaster = {this.selectMaster}
                        closeModal={this.closeModal}
                        MasterName = {this.getMedicinePanelType()}                        
                        user_search_name={this.state.medicine_item.name}
                    />
                  )}
                  </>
                )}
                {this.state.alert_messages !== "" && (
                    <SystemAlertModal
                        hideModal= {this.closeModal.bind(this)}
                        handleOk= {this.closeModal.bind(this)}
                        showMedicineContent= {this.state.alert_messages}
                    />
                )}
            </Card>
          </>
        )
    }
}

DialUserSearch.propTypes = {
    history: PropTypes.object,
}
export default DialUserSearch