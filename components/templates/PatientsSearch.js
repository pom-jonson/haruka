import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import Button from "../atoms/Button";
import Context from "~/helpers/configureStore";
import * as apiClient from "../../api/apiClient";
import SearchBar from "../molecules/SearchBar";
import auth from "~/api/auth";
import {CACHE_SESSIONNAMES, getAutoReloadInfo, KEY_CODES} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import $ from "jquery";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import SelectModeModal from "~/components/templates/Patient/SelectModeModal";
import Checkbox from "~/components/molecules/Checkbox";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PatientsWrapper = styled.div`
  width: 100%;
  height: 100vh;
  margin: auto;
  .title-area {
    margin-left: 10px;
    padding-top: 10px;
    align-items: center;
    button {
      background-color: ${colors.surface};
      min-width: auto;
      margin-left: 0.5rem;
      padding: 0.5rem 0.5rem;
    }
    .button{
      span{
        word-break: keep-all;
      }
    }
    .tab-btn{
      background: rgb(208, 208, 208);
      span{
        font-weight: normal;
        color: black;
        font-size: 0.9rem;
      }
    }
    .active-btn{
      background: lightblue;
    }
    .disabled{
      background: rgb(208, 208, 208);
      span{
        font-weight: normal;
        color: grey !important;
        font-size: 0.9rem;
      }
    }
    .move-btn-area {
      margin-right:0;
      margin-left:auto;
      padding-top:0.5rem;
      .close-back-btn {margin-left:0.5rem;}
    }
  }
  .title {
    font-size: 1.875rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
  }
  .table-area {
    padding-left: 0.5rem;
    width: 100%;
    table {
      margin:0px;
      background-color: white;
      tbody{
        display:block;
        overflow-y: scroll;
        height: calc(100vh - 12rem);
        width:100%;
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
      }
      tr{
        display: table;
        width: 100%;
      }
      thead{
        display:table;
        width:100%;
        border-bottom: 1px solid #dee2e6;
        tr{width: calc(100% - 17px);}
      }
      td {
        word-break: break-all;
        font-size: 1rem;
        vertical-align: middle;
        padding: 0.25rem;
        font-size: 1rem;
      }
      th {
        position: sticky;
        text-align: center;
        font-size: 1.25rem;
        white-space:nowrap;
        font-weight: normal;
        padding: 0.3rem;
        border:1px solid #dee2e6;
        border-bottom:none;
        border-top:none;
        font-weight: normal;
      }
    }
  }
  .no-result {
    text-align: center;
    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
  .go-karte {
    cursor: pointer;
  }
  .go-karte:hover{
    background:lightblue!important;
  }
  .selected {
    background: rgb(105, 200, 225) !important;
    color: white;
  }
  .selected:hover {
    background: rgb(105, 200, 225) !important;
    color: white;
  }
`;

const FlexTop = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: center;
  padding: 10px 10px 10px 10px;
  width: 100%;
  z-index: 100;  
  .bvbKeA{
    display:block;
    width: 20%;
    .search-box{
        width:  100%;
        input {width: 100%;}
    }
  }
  #search_bar{
    ime-mode:active;
  }
  .search-box input {
    ime-mode:active;
  }
  .gana_search{
    margin-left: 0.5rem;
    button {
      height:38px;
      padding: 0px 0.5rem;
      background-color: rgb(255, 255, 255);
      span {font-size:1rem;}
    }
    input {
      ime-mode:active;
      height:38px;
    }
  }
  .auto-reload {
    margin-left: auto;
    margin-right: 0;
    text-align: right;
    label {font-size: 1rem;}
  }
`;

class PatientsSearch extends Component {

  constructor(props) {
    super(props);
    let schVal = localApi.getValue('patient_list_schVal');
    let auto_reload = 1;
    this.reload_time = 60 * 1000;
    let auto_reload_info = getAutoReloadInfo("kana_patient_list");
    if(auto_reload_info != undefined && auto_reload_info != null){
      if(parseInt(auto_reload_info.reload_time) > 0){
        this.reload_time = parseInt(auto_reload_info.reload_time) * 1000;
      }
      auto_reload = auto_reload_info.status;
    }
    this.state = {
      patientsList: [],
      is_kana: 0,
      searchId:schVal != (undefined && schVal != null) ? schVal : "",
      schValKana:"",
      selected_index:-1,
      isOpenKarteModeModal: false,
      modal_data: {},
      auto_reload,
      load_flag:true,
    };
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.openModalStatus = 0;
  }

  async componentDidMount () {
    if(this.state.searchId != ""){
      await this.searchPatientsListKana();
    }
    document.getElementById("search_bar").focus();
    localApi.setValue("system_next_page", "/patients_search");
    localApi.setValue("system_before_page", "/patients_search");
    document.getElementById("search_bar").focus();
    this.reloadInterval = setInterval(async()=>{
      this.autoReload();
    }, this.reload_time);
    auth.refreshAuth(location.pathname+location.hash);
  }

  searchPatientsList=async(is_searched=true)=> {
    const patientsList = await this.getPatientsListSearchResult();
    this.setState({
      patientsList,
      is_searched,
      load_flag:true,
    });
  };

  autoReload=()=>{
    if(this.state.auto_reload == 1 && this.openModalStatus == 0){
      this.searchPatientsListKana();
    }
  }
  
  componentWillUnmount (){
    clearInterval(this.reloadInterval);
  }

  searchPatientsListKana = async () => {
    const patientsList = await this.getPatientsListSearchResult();
    this.setState({
      patientsList,
      is_searched: true,
      load_flag:true,
    }, ()=>{
      if(patientsList.length > 0){
        this.setState({selected_index:0}, ()=>{
          document.getElementById("list_area").focus();
        });
      }
    });
  };

  getPatientsListSearchResult = async () => {
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    const {pageStatus,limitStatus} = this.context;
    let treatStatus=2;
    let path = "/app/api/v2/patients/search_patient";
    let post_data = {};
    post_data.keyword = this.state.searchId != "" ? this.state.searchId : "";
    post_data.status = treatStatus ? treatStatus:0;
    post_data.page = pageStatus ? pageStatus:1;
    post_data.limit = limitStatus != 20 ? limitStatus : "";
    post_data.name_search_type = this.state.search_type;
    localApi.setValue("patient_list_schVal", this.state.searchId);
    return await apiClient.post(path,{params: post_data});
  };

  searchId = word => {
    word = word.toString().trim();
    // this.context.$updateSchIdVal(word);
    this.setState({
      // is_kana: 0,
      searchId:word
    });
  };

  searchKana = word => {
    word = word.toString().trim();
    // this.context.$updateSchKanaVal(word);
    this.setState({
      is_kana: 1,
      schValKana:word
    });
  };
  
  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.searchPatientsList();
    }
  };
  
  enterPressedKana = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.searchPatientsListKana();
    }
  };

  goToUrlFunc = (url) => {
    this.props.history.replace(url);
    this.closeModal();
  }

  onKeyPressed(e) {
    let data = [];
    if (this.state.patientsList != null && this.state.patientsList.length > 0) {
      data = this.state.patientsList;
    }
    if (e.keyCode === KEY_CODES.up) {
      this.setState({
        selected_index:this.state.selected_index >= 1 ? this.state.selected_index - 1 : data.length - 1
      },() => {
        this.scrollToelement();
      });
      $("#search_bar").blur();
      document.getElementById("list_area").focus();
    }
    if (e.keyCode === KEY_CODES.down) {
      this.setState({
        selected_index: this.state.selected_index + 1 == data.length ? 0 : this.state.selected_index + 1
      },() => {
        this.scrollToelement();
      });
      $("#search_bar").blur();
      document.getElementById("list_area").focus();
    }
    if (e.keyCode === KEY_CODES.enter) {
      let nFlag = $("#search_bar").is(':focus');
      if (nFlag == false) {
        let item = this.state.patientsList[this.state.selected_index];
        this.checkKarteMode(item);
      }
    }
  }
  
  scrollToelement = () => {
    const els = $(".scroll-area [class*=selected]");
    const pa = $(".scroll-area");
    if (els.length > 0 && pa.length > 0) {
      const elHight = $(els[0]).height();
      const elTop = (elHight+1)*this.state.selected_index;
      const paHeight = $(pa[0]).height();
      const scrollTop = elTop - (paHeight - elHight) / 2;
      $(pa[0]).scrollTop(scrollTop);
    }
  };

  checkKarteMode = (patient_info) => {
    if(patient_info === undefined){return;}
    let patients_list = this.context.patientsList;
    let isExist = 0;
    patients_list.map(item=>{
      if(item.system_patient_id == patient_info.systemPatientId){isExist = 1;}
    });
    if (patients_list !== undefined && patients_list != null && patients_list.length > 3 && isExist === 0) {
      window.sessionStorage.setItem("alert_messages", "4人以上の患者様を編集することはできません。");
      return;
    }
    if (isExist == 0) { // new patient connect
      this.openModalStatus = 1;
      this.setState({
        isOpenKarteModeModal: true,
        modal_data: patient_info
      });
    } else { // exist patient connect
      const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      const page = authInfo.karte_entrance_page == undefined || authInfo.karte_entrance_page == "" ? "soap" : authInfo.karte_entrance_page;
      this.goToUrlFunc("/patients/"+patient_info.systemPatientId+"/"+page);
    }
  }

  closeModal=()=> {
    this.openModalStatus = 0;
    this.setState({isOpenKarteModeModal: false});
  };

  gotoSoap = () => {
    let patient_info = karteApi.getLatestVisitPatientInfo();    
    if (patient_info == undefined || patient_info == null) {
      let current_system_patient_id = localApi.getValue("current_system_patient_id");
      current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
      if (current_system_patient_id > 0) {
        this.props.history.replace(`/patients/${current_system_patient_id}/soap`);
      }
    } else {
      this.props.history.replace(`/patients/${patient_info.patient_id}/soap`);
    }
  }

  setAutoReload = (name, value) => {
    if(name == "auto_reload"){
      this.setState({auto_reload:value});
    }
  };

  render() {
    let list_names = ["受付一覧","カナ検索","病棟一覧","救急一覧","予約一覧","診察振り分け ","病棟マップ", "訪問診療予定"];
    var list_urls = ["/patients", "/patients_search", "/hospital_ward_list", "/emergency_patients", "/reservation_list", "", "/hospital_ward_map", "/visit_schedule_list"];
    const menu_list_ids = ["1001","1002","1003","1006","1004","","1007", "1005"];
    let curUserInfo = JSON.parse(sessApi.getValue(CACHE_SESSIONNAMES.HARUKA));
    let arr_menu_permission = curUserInfo.menu_auth;
    return (
      <PatientsWrapper onKeyDown={this.onKeyPressed} id={'list_area'}>
        <div className="title-area flex">
          <div className={'title'}>カナ検索</div>
          <div className={'move-btn-area'}>
            {list_names.map((item, index) => {
              if (arr_menu_permission != undefined && arr_menu_permission != null){
                if (arr_menu_permission[menu_list_ids[index]] != undefined && arr_menu_permission[menu_list_ids[index]].includes(10)){
                  return(
                    <>
                      {item == "カナ検索" ? (
                        <Button className="button tab-btn active-btn">{item}</Button>
                      ):(
                        <Button className="button tab-btn" onClick={()=>this.goToUrlFunc(list_urls[index])}>{item}</Button>
                      )}
                    </>
                  )
                } else {
                  return(
                    <>
                      <Button className="disabled button">{item}</Button>
                    </>
                  )
                }
              }
            })}
            {karteApi.getEditPatientList() != undefined && karteApi.getEditPatientList() != null && karteApi.getEditPatientList().length > 0 && (
              <Button className="button tab-btn close-back-btn" onClick={this.gotoSoap}>閉じる</Button>
            )}
          </div>
        </div>
        <FlexTop>
            <SearchBar
              placeholder="患者ID / カナ氏名"
              search={this.searchId}
              enterPressed={this.enterPressedKana}
              value={this.state.searchId}
              id={'search_bar'}
            />
            <div className="gana_search">
              <Button type="mono" onClick={this.searchPatientsListKana}>検索</Button>
            </div>
          <div className={'auto-reload'}>
            <Checkbox
              label="自動更新"
              getRadio={this.setAutoReload.bind(this)}
              value={this.state.auto_reload === 1}
              name="auto_reload"
            />
          </div>
        </FlexTop>
        <div className={'table-area'}>
          <table className="table-scroll table table-bordered" id="code-table">
            <thead className={'thead-area'}>
            <tr>
              <th style={{width:"12rem"}}>患者ID</th>
              <th style={{width:"17rem"}}>氏名</th>
              <th style={{width:"17rem"}}>カナ氏名</th>
              <th>性別</th>
            </tr>
            </thead>
            <tbody className={'scroll-area'}>
            {this.state.load_flag ? (
              <>
                {this.state.patientsList.length === 0 ? (
                  this.state.is_searched && (
                    <tr style={{height:"calc(100vh - 13rem)"}}>
                      <td colSpan={'4'}>
                        <div className="no-result"><span>条件に一致する結果は見つかりませんでした。</span></div>
                      </td>
                    </tr>
                  )
                ) : (
                  this.state.patientsList.map((item, index) => {
                    return (
                      <>
                        <tr
                          className={'row-'+index + ' go-karte ' + (this.state.selected_index == index ? 'selected' : '')}
                          onClick={()=>this.checkKarteMode(item)}
                        >
                          <td style={{width:"12rem", textAlign:"right"}}>{item.patient_number}</td>
                          <td style={{width:"17rem"}}>{item.patient_name}</td>
                          <td style={{width:"17rem"}}>{item.patient_name_kana}</td>
                          <td>{item.gender == 1 ? '男' : '女'}</td>
                        </tr>
                      </>
                    )
                  })
                )}
              </>
            ):(
              <tr style={{height:"calc(100vh - 13rem)"}}>
                <td colSpan={'4'}>
                  <div className='spinner_area no-result'>
                    <SpinnerWrapper>
                      <Spinner animation="border" variant="secondary" />
                    </SpinnerWrapper>
                  </div>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        {this.state.isOpenKarteModeModal && (
          <SelectModeModal
            modal_data={this.state.modal_data}
            goToUrl={this.goToUrlFunc.bind(this)}
            closeModal={this.closeModal}
            modal_type={'kana_search'}
          />
        )}
      </PatientsWrapper>
    );
  }
}
PatientsSearch.contextType = Context;
PatientsSearch.propTypes = {
  history: PropTypes.object
};

export default PatientsSearch;
