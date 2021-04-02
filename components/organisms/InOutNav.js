import React, { Component } from "react";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import styled from "styled-components";
import UsageTab from "../molecules/UsageTab";
import Checkbox from "../molecules/Checkbox";
import {KARTEMODE} from "~/helpers/constants"
// import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import * as karteApi from "~/helpers/cacheKarte-utils";
import { CACHE_LOCALNAMES } from "~/helpers/constants";

const Ul = styled.ul`
  width: 100%;

  &.nav {
    padding-left: 8px;
  }

  > li > div {
    cursor: pointer;
  }

  > li > a {
    color: #bbbbbb;
    padding: 4px 14px;
  }

  > li > a.active {
    color: ${colors.onSurface};
  }

  .row {
    width: 100%;
    padding-left: 24px;
    padding-top: 4px;
  }

  .no-selected{
    border: 1px solid darkgrey;
    padding: 4px 8px;
    background-color: white;
    span {
      color: black;
      font-weight: normal;
    }
  }
`;

const inOut = [
  {
    id: 0,
    name: "院外"
  },
  {
    id: 1,
    name: "院内"
  }
];

const inOutHospitalization = [
  {
    id: 0,
    name: "臨時"
  },
  {
    id: 1,
    name: "退院時"
  },
  {
    id: 2,
    name: "実施済"
  },
  {
    id: 3,
    name: "定期"
  },
  {
    id: 4,
    name: "つなぎ"
  },
  {
    id: 5,
    name: "持参薬"
  }
];

class InOutNav extends Component {
  constructor(props) {
    super(props);
    let cacheState = karteApi.getSubVal(parseInt(this.props.patientId), CACHE_LOCALNAMES.PRESCRIPTION_EDIT, this.props.cacheSerialNumber);
    let hasAdministratePeriod = false;
    if (cacheState != undefined && cacheState != null && cacheState[0].presData.length > 0) {
      cacheState[0].presData.map(item=>{
        if (item.administrate_period != undefined && item.administrate_period != null) {
          hasAdministratePeriod = true;
        }
      });
    }
    // YJ272 入院処方で、投与期間入力は「定期」でしか使えないように
    this.state = {
      id: this.props.id,
      unusedDrugSearch: this.props.unusedDrugSearch,
      profesSearch: this.props.profesSearch,
      normalNameSearch: this.props.normalNameSearch,
      // YJ272 入院処方で、投与期間入力は「定期」でしか使えないように
      existAdministratePeriod: hasAdministratePeriod
    };
  }

  getRadio = (name, value) => {
    this.props.getRadio(name, value);
  };

  testInOutRender = (inOut_status) => {
    this.setState(inOut_status);
  }

  selectInOut = (e) => {
    // YJ272 入院処方で、投与期間入力は「定期」でしか使えないように
    if (this.state.existAdministratePeriod == true) return;

    this.props.selectInOut(e);
  }

  render() {
    var path = window.location.href.split("/");
    var presetPath = path[path.length-2] + "/" + path[path.length-1];
    var is_patient = presetPath != "preset/prescription";
    let array_inOut = this.props.karteStatus == 1 ? inOutHospitalization : inOut;
    let karte_mode = this.context.$getKarteMode(this.props.patientId);
    const usages = array_inOut.map(usage => (
      <UsageTab
        key={usage.id}
        id={usage.id}
        active={usage.id === this.state.id}
        name={usage.name}
        selectTab={this.selectInOut}
      />
    ));

    return (
      <Ul className="nav nav-tabs">
        {usages}
        <div className="row">
          <div>
            <Checkbox
              label="登録外薬品を含む検索"
              name="unusedDrugSearch"
              getRadio={this.getRadio.bind(this)}
              value={this.state.unusedDrugSearch}
              isDisabled={karte_mode == KARTEMODE.READ && is_patient}
            />
          </div>
          <div>
            <Checkbox
              label="全文検索"
              name="profesSearch"
              getRadio={this.getRadio.bind(this)}
              value={this.state.profesSearch}
              isDisabled={karte_mode == KARTEMODE.READ && is_patient}
            />
          </div>
          <div>
            <Checkbox
              label="一般名検索"
              name="normalNameSearch"
              getRadio={this.getRadio.bind(this)}
              value={this.state.normalNameSearch}
              isDisabled={karte_mode == KARTEMODE.READ && is_patient}
            />
          </div>
        </div>
      </Ul>
    );
  }
}
InOutNav.contextType = Context;
InOutNav.propTypes = {
  id: PropTypes.number,
  selectInOut: PropTypes.func,
  unusedDrugSearch: PropTypes.bool,
  profesSearch: PropTypes.bool,
  normalNameSearch: PropTypes.bool,
  getRadio: PropTypes.func,
  karteStatus: PropTypes.number,
  patientId: PropTypes.number,
  cacheSerialNumber: PropTypes.number,
};

export default InOutNav;
