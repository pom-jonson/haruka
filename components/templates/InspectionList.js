import React, { Component } from "react";
import axios from "axios";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedoAlt } from "@fortawesome/pro-regular-svg-icons";
import PatientsTable from "../organisms/PatientsTable";
import SearchBar from "../molecules/SearchBar";
import SelectorWithLabel from "../molecules/SelectorWithLabel";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import Button from "../atoms/Button";
registerLocale("ja", ja);

import { formatDate4API } from "../../helpers/date";
import auth from "~/api/auth";
import {setDateColorClassName} from "~/helpers/dialConstants";

const IS_DEVELOP = process.env.NODE_ENV !== "production";

const PatientsWrapper = styled.div`
  width: 100%;
  margin: auto;
`;

const Flex = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: center;
  padding: 24px 0;
  position: fixed;
  top: 49px;
  width: calc(100% - 240px);
  z-index: 100;

  .label-title {
    text-align: right;
    width: auto;
    margin: 0 8px 0 24px;
  }

  select {
    width: 120px;
  }

  label {
    margin: 0;
  }

  button {
    min-width: auto;
    margin-left: 24px;
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

const Redo = styled(FontAwesomeIcon)`
  color: ${colors.midEmphasis};
  font-size: 12px;
  margin-left: 4px;
`;

const options = [
  {
    id: 0,
    value: "全て"
  },
  {
    id: 1,
    value: "内科"
  },
  {
    id: 2,
    value: "外科"
  },
  {
    id: 3,
    value: "整形外科"
  },
  {
    id: 4,
    value: "精神科"
  },
  {
    id: 5,
    value: "訪問科"
  },
  {
    id: 6,
    value: "リハビリ科"
  },
  {
    id: 7,
    value: "呼吸器内科"
  },
  {
    id: 8,
    value: "スポーツ内科"
  },
  {
    id: 9,
    value: "皮膚科"
  },
  {
    id: 10,
    value: "老健科"
  }
];

const diOptions = [
  {
    id: 1,
    value: "全て"
  },
  {
    id: 2,
    value: "未診療あり"
  },
  {
    id: 3,
    value: "診療済み"
  }
];

class InspectionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      examining: false,
      patientsList: [],
      schVal: "",
      treatStatus: 0,
      departmentStatus: 0,
      dateStatus: new Date(),
      pageStatus: 1,
      limitStatus: 20
    };
  }

  updatePatientsList = async () => {
    /* eslint-disable no-console */
    const { data } = await axios.get("/app/api/v2/patients/received");
    if (IS_DEVELOP) console.log("updatePatientsList / patient", data);
    return data;
  };

  async componentDidMount() {
    const patientsList = await this.updatePatientsList();
      auth.refreshAuth(location.pathname+location.hash);
      this.setState({ patientsList });
  }

  getPatientsListSearchResult = async () => {
    let dateStr = this.state.dateStatus
      ? formatDate4API(this.state.dateStatus)
      : "";
    let apitxt = "/app/api/v2/patients/received?";

    apitxt =
      apitxt +
      (this.state.schVal != "" ? "keyword=" + this.state.schVal + "&" : "");
    apitxt = apitxt + (dateStr != "" ? "date=" + dateStr + "&" : "");
    apitxt =
      apitxt +
      (this.state.departmentStatus
        ? "department=" + this.state.departmentStatus + "&"
        : "department=0&");
    apitxt =
      apitxt +
      (this.state.treatStatus
        ? "status=" + this.state.treatStatus + "&"
        : "status=0&");
    apitxt =
      apitxt +
      (this.state.pageStatus ? "page=" + this.state.pageStatus : "page=1");
    apitxt =
      apitxt +
      (this.state.limitStatus != 20 ? "&limit=" + this.state.limitStatus : "");
    apitxt =
      apitxt +
      (this.state.treatStatus == 2 ? "&all_medical_treatment_end=1" : "");

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
      this.searchPatientsList();
    }
  };

  getTreatSelect = e => {
    this.setState({ treatStatus: parseInt(e.target.id) });
  };

  getDepartmentSelect = e => {
    this.setState({ departmentStatus: parseInt(e.target.id) });
  };

  getDate = value => {
    this.setState({ dateStatus: value });
  };

  searchPatientsList = async () => {
    const patientsList = await this.getPatientsListSearchResult();
    this.setState({ patientsList });
  };

  render() {
    return (
      <PatientsWrapper>
        <Flex>
          <SearchBar
            placeholder="患者ID / 患者名"
            search={this.search}
            enterPressed={this.enterPressed}
          />
          <SelectorWithLabel
            options={diOptions}
            title="状態"
            getSelect={this.getTreatSelect}
          />
          <SelectorWithLabel
            options={options}
            title="担当科"
            getSelect={this.getDepartmentSelect}
          />
          <InputBox>
            <label>日付選択</label>
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
          <Button type="mono" onClick={this.searchPatientsList.bind(this)}>
            更新
            <Redo icon={faRedoAlt} />
          </Button>
        </Flex>
        <PatientsTable patientsList={this.state.patientsList} />
      </PatientsWrapper>
    );
  }
}

export default InspectionList;
