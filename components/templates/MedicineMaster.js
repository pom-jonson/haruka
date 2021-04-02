import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import MedicineTable from "../organisms/MedicineTable";
import SearchBar from "../molecules/SearchBar";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import Button from "../atoms/Button";
import Checkbox from "../molecules/Checkbox";
import auth from "../../api/auth";
import SelectorWithLabel from "../molecules/SelectorWithLabel";
// import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {setDateColorClassName} from "~/helpers/dialConstants";

registerLocale("ja", ja);

const MedicineWrapper = styled.div`
  width: 100%;
  margin: auto;
`;

const Flex = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: center;
  padding: 24px 0;
  position: fixed;
  width: calc(100% - 190px);
  z-index: 100;

  label {
    margin: 0;
  }

  button {
    min-width: auto;
    margin-left: 24px;
    background: white;
  }
  .MyCheck {
    margin-left: 10px;
  }
  .csv-upload {
    margin-left: 10px;
  }
  select {
    width: 100px;
  }
  .label-title {
    width: 30px;
    margin-left: 20px;
  }
  .search-box{
    width: 18rem;
    input{
      width: 18rem;
    }
  }
  .pullbox-select{
    width: 6.25rem;
  }
  .react-datepicker-wrappper{
    input{
      width: 7.5rem;
    }
  }
`;

const InputBox = styled.div`
  display: flex;
  margin-left: 24px;

  label {
    color: ${colors.onSecondaryDark};
    font-size: 12px;
    line-height: 38px;
    letter-spacing: 0.4px;
    margin-right: 8px;
  }

  input {
    border-radius: 4px;
    border: solid 1px #ced4da;
    background: ${colors.surface};
    color: ${colors.onSecondaryDark};
    font-size: 12px;
    padding: 0 8px;
    width: 120px;
    height: 38px;
  }
`;

const diagnosisOption = [
  { id: 0, value: "すべて" },
  { id: 1, value: "内服" },
  { id: 2, value: "外用" },
  { id: 3, value: "注射" }
];

const diagnosisArray = [
  { id: 0, value: 0 },
  { id: 1, value: 21 },
  { id: 2, value: 23 },
  { id: 3, value: 30 }
];

class MedicineMaster extends Component {
  constructor(props) {
    super(props);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let medicineViewAuth = "900153";
    let medicineEditAuth = "900121";
    let featureAuth = authInfo.feature_auth.split(",");   
    let viewAuth = featureAuth.find(v => v === medicineViewAuth); 
    let editAuth = featureAuth.find(v => v === medicineEditAuth); 
    this.state = {
      medicineList: [],
      schVal: "",
      matching_mode: false,
      search_generic_name: 0,
      visible_no_number_item: 0,
      dateStatus: new Date(),
      pageStatus: 1,
      limitStatus: 20,
      authInfo: authInfo,
      viewAuth: viewAuth,
      diagnosisDivision: 0,
      editAuth: editAuth
    };
    if(!viewAuth)
    auth.refreshAuth(location.pathname);
  }

  updateMedicineList = async () => {
    const { data } = await axios.get("/app/api/v2/management/medicine_master/search");
    return data;
  };

  async componentDidMount() {
    const medicineList = await this.updateMedicineList();
      auth.refreshAuth(location.pathname+location.hash);
      this.setState({ medicineList });
  }

  formatDate  = dt => {
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var result = y + "-" + m + "-" + d;
    return result;
  };

  getMedicineListSearchResult = async () => {
    let dateStr = this.state.dateStatus
      ? this.formatDate(this.state.dateStatus)
      : "";
    let matching_mode = this.state.matching_mode ? "partial" : "forward";
    let diagnoisValue = diagnosisArray[this.state.diagnosisDivision].value;
    let apitxt = "/app/api/v2/management/medicine_master/search?";

    apitxt =
      apitxt +
      (this.state.schVal != "" ? "keyword=" + this.state.schVal + "&" : "");
    apitxt = apitxt + (dateStr != "" ? "date=" + dateStr + "&" : "");
    apitxt =
      apitxt +
      (this.state.search_generic_name
        ? "search_generic_name=" + this.state.search_generic_name + "&"
        : "search_generic_name=0&");
    apitxt =
      apitxt +
      (matching_mode
        ? "matching_mode=" + matching_mode + "&"
        : "matching_mode=0&");
    apitxt =
      apitxt +
      (this.state.visible_no_number_item
        ? "visible_no_number_item=" + this.state.visible_no_number_item + "&"
        : "visible_no_number_item=0&");
    apitxt =
      apitxt +
      (this.state.hidden_expired
        ? "hidden_expired=" + this.state.hidden_expired + "&"
        : "hidden_expired=0&");
    apitxt =
      apitxt +
      (this.state.diagnosisDivision
        ? "diagnosis_division=" + diagnoisValue + "&"
        : "diagnosis_division=0&");
    apitxt =
      apitxt +
      (this.state.pageStatus ? "page=" + this.state.pageStatus : "page=1");
    apitxt =
      apitxt +
      (this.state.limitStatus != 20 ? "&limit=" + this.state.limitStatus : "");
    const { data } = await axios.get(apitxt);
    return data;
  };

  search = word => {
    word = word.toString().trim();
    this.setState({ schVal: word });
  };

  enterPressed = e => {
    var code = e.keyCode || e.which;
    if (code === 13) {
      this.searchMedicineList();
    }
  };

  getRadio = (name, value) => {
    if (name === "searchall") {
      this.setState({ matching_mode: value });
    } else if (name === "searchgeneric") {
      this.setState({ search_generic_name: value });
    } else if (name === "searchvisible") {
      this.setState({ visible_no_number_item: value});
    } else if (name === "hidden_expired") {
      this.setState({ hidden_expired: value});
    }
  };

  getDate = value => {
    this.setState({ dateStatus: value });
  };

  searchMedicineList = async () => {
    const medicineList = await this.getMedicineListSearchResult();
    this.setState({ medicineList });
  };

  getPrescriptionSelect = e => {
    this.setState({ diagnosisDivision: parseInt(e.target.id) });
  };

  render() {
    return (
      <MedicineWrapper>
        <Flex>
          <SearchBar
            placeholder=""
            search={this.search}
            enterPressed={this.enterPressed}
          />
          <div className="MyCheck">
            <Checkbox
              label="全文検索"
              getRadio={this.getRadio.bind(this)}
              value={this.state.matching_mode}
              name="searchall"
            />
          </div>
          <div className="MyCheck">
            <Checkbox
              label="一般名検索"
              getRadio={this.getRadio.bind(this)}
              name="searchgeneric"
              value={this.state.search_generic_name}
            />
          </div>
          <SelectorWithLabel
              options={diagnosisOption}
              title="区分"
              getSelect={this.getPrescriptionSelect}
              departmentEditCode={
                diagnosisOption[this.state.diagnosisDivision].id
              }
            />
          <div className="MyCheck">
            <Checkbox
              label="品番未登録を含む"
              getRadio={this.getRadio.bind(this)}
              name="searchvisible"
              value={this.state.visible_no_number_item}
            />
          </div>
          <div className="MyCheck">
            <Checkbox
              label="期限切れを非表示"
              getRadio={this.getRadio.bind(this)}
              name="hidden_expired"
              value={this.state.hidden_expired}
            />
          </div>
          <InputBox>
            <DatePicker
              locale="ja"
              selected={this.state.dateStatus}
              onChange={this.getDate.bind(this)}
              dateFormat="yyyy/MM/dd"
              placeholderText="年/月/日"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              dayClassName = {date => setDateColorClassName(date)}
            />
          </InputBox>
          <Button type="mono" onClick={this.searchMedicineList.bind(this)}>
            検索
          </Button>
          <Link
          to="/management/medicine_master_csv/upload"
          className="csv-upload">
            <Button type="mono">一括アップロード</Button>
          </Link>
        </Flex>
        <MedicineTable medicineList={this.state.medicineList} />
      </MedicineWrapper>
    );
  }
}

export default MedicineMaster;