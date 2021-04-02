import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import axios from "axios";
import Context from "~/helpers/configureStore";
import InjectionListTable from "../organisms/InjectionListTable";
import SearchBar from "./../molecules/SearchBar";
import SelectorWithLabel from "./../molecules/SelectorWithLabel";
import DatePicker from "react-datepicker";
import Button from "./../atoms/Button";
import * as colors from "../_nano/colors";
import { KEY_CODES } from "../../helpers/constants";
import auth from "~/api/auth";
import * as sessApi from "~/helpers/cacheSession-utils";
import {setDateColorClassName} from "~/helpers/dialConstants";

const PrescriptionWrapper = styled.div`
  width: 100%;
  padding-top: 86px;
`;

const PrescriptionMain = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
//   max-height: calc(100vh - 100px);
  height: calc(100vh - 100px);
  padding-left: 10px;
  font-size:1rem;
  overflow-y:auto;
`;

const Flex = styled.div`
  background: ${colors.background};
  display: flex;
  align-items: center;
  padding: 24px 0;
  position: fixed;
  top: 0px;
  width: calc(100% - 190px);
  padding-left: 10px;
  z-index: 100;

  svg{
    font-size:1rem;
  }

  .label-title {
    text-align: right;
    width:7rem;
    margin: 0 0.5rem 0 1.5rem;
    font-size:1rem;
    line-height:2.4rem;
    height:2.4rem;
  }

  .pullbox-label,select {
    width: 100%;
    font-size:1rem;
    height:2.4rem;
    line-height:2.4rem;
  }

  label {
    margin: 0;
  }

  button {
    background-color: ${colors.surface};
    min-width: auto;
    margin-left: 1.5rem;
    span{
        font-size:1rem;
    }
    height:2.4rem;
        padding:0;
        padding-left:1rem;
        padding-right:1rem;
    }
  .react-datepicker__navigation{
    background:none;
  }
  .react-datepicker{
    button{
      height:0;
      margin-left:0;
      padding:0;
    }
  }
`;

const InputBox = styled.div`
  display: flex;
  margin-left: 1.5rem;

  label {
    color: ${colors.onSecondaryDark};
    font-size: 1rem;
    line-height: 2.4rem;
    height: 2.4rem;
    letter-spacing: 0.4px;
    margin-right: 8px;
  }

  input {
    border-radius: 4px;
    border: solid 1px #ced4da;
    background: ${colors.surface};
    color: ${colors.onSecondaryDark};
    font-size: 1rem;
    padding: 0 8px;
    width: 7.5rem;
    height: 2.4rem;
    line-height: 2.4rem;
  }
`;

const Col = styled.div`
  width: 100%;
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

const karteStatusOptions = [
    {
        id: 0,
        value: "全て"
    },
    {
        id: 1,
        value: "未実施"
    },
    {
        id: 2,
        value: "実施"
    }
];

// @enhance
class InjectionList extends Component {
    constructor(props) {
        super(props);
        let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
        this.state = {
            doctors: [],
            staff_category: authInfo.staff_category || 2,
            medicineHistory: [],
            schVal: "",
            treatStatus: 0,
            departmentStatus: 0,
            prescriptionType: 1,
            dateStatus: new Date()
        };
    }

    getDoctorsList = async () => {
        let d_data = sessApi.getDoctorList();
        if(d_data == null) {
            const { data } = await axios.get(`/app/api/v2/secure/doctor/search?`);
            d_data = data;
        }
        this.setState({doctors:d_data});
        return d_data;
    };

    getHistoryData = async () => {
        const { data } = await axios.get(
            "/app/api/v2/order/injection/injections?type=1"
        );
        return data;
    };

    async componentDidMount() {
        const medicineHistory = await this.getHistoryData();
        this.context.$updateStaffCategory(this.state.staff_category);
        this.changeHistory(medicineHistory);
        await this.getDoctorsList();
        auth.refreshAuth(location.pathname+location.hash);
    }

    changeHistory(medicineHistory) {
        if (medicineHistory && medicineHistory.length > 0) {
            medicineHistory.map((item, index) => {
                if (index < 3) {
                    item.prescription.order_data.class_name = "open";
                } else {
                    item.prescription.order_data.class_name = "";
                }
            });
        }

        this.setState({
            medicineHistory: medicineHistory
        });
    }

    enterPressed = e => {
        var code = e.keyCode || e.which;
        if (code === KEY_CODES.enter) {
            this.searchInjectionList();
        }
    };

    getTreatSelect = e => {
        this.setState({ treatStatus: parseInt(e.target.id) });
    };

    getDepartmentSelect = e => {
        this.setState({ departmentStatus: parseInt(e.target.id) });
    };

    getKarteStatusSelect = e => {
        this.setState({ karteStatusType: parseInt(e.target.id) });
    };

    getDate = value => {
        this.setState({ dateStatus: value });
    };

    search = word => {
        word = word.toString().trim();
        this.setState({ schVal: word });
    };

    formatDate4API = dt => {
        var y = dt.getFullYear();
        var m = ("00" + (dt.getMonth() + 1)).slice(-2);
        var d = ("00" + dt.getDate()).slice(-2);
        var result = y + m + d;
        return result;
    };

    searchInjectionList = async () => {
        let dateStr = this.state.dateStatus
            ? this.formatDate4API(this.state.dateStatus)
            : "";
        let apitxt = "/app/api/v2/order/injection/injections?";

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
            (this.state.karteStatusType
                ? "status=" + this.state.karteStatusType + "&"
                : "status=0&");
        apitxt =
            apitxt +
            (this.state.prescriptionType
                ? "type=" + this.state.prescriptionType
                : "type=0");
        apitxt =
            apitxt +
            (this.state.treatStatus == 2 ? "&all_medical_treatment_end=1" : "");
        const { data } = await axios.get(apitxt);
        this.changeHistory(data);
        return data;
    };

    render() {
        const { medicineHistory } = this.state;
        return (
            <>
                <PrescriptionWrapper>
                    <Flex>
                        <SearchBar
                            placeholder="患者ID"
                            search={this.search}
                            enterPressed={this.enterPressed}
                        />
                        <SelectorWithLabel
                            options={karteStatusOptions}
                            title="状態"
                            getSelect={this.getKarteStatusSelect}
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
                        <Button
                            type="mono"
                            onClick={this.searchInjectionList.bind(this)}
                        >
                            検索
                        </Button>
                    </Flex>
                    <PrescriptionMain>
                        <Col>
                            <InjectionListTable injectionList={medicineHistory}
                                                searchInjectionList={this.searchInjectionList}
                                                doctors={this.state.doctors}
                            />
                        </Col>
                    </PrescriptionMain>
                </PrescriptionWrapper>
            </>
        );
    }
}
InjectionList.contextType = Context;

InjectionList.propTypes = {
    patientInfo: PropTypes.object.isRequired,
    patientId: PropTypes.number.isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.node
        }).isRequired
    }).isRequired,
    history: PropTypes.object
};

export default InjectionList;
