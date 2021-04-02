import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCapsules,
  faLaptopMedical,
  faNotesMedical,
  faBookUser,
  faAllergies,
  faDisease,
  faPills,
  faBookMedical,
  faMicroscope,
  faSyringe
} from "@fortawesome/pro-regular-svg-icons";
import PropTypes from "prop-types";
import { patientModalEvent } from "../../events/PatientModalEvent";

const PanelWrapper = styled.div`
  border: 1px solid #ced4da;
  background-color: ${colors.surface};
  box-shadow: 1px 1px 0 0 rgba(223, 223, 223, 0.5);
  width: 120px;
  height: calc(100% - 48px);
  position: fixed;
  top: 48px;
  right: 0;

  ul {
    border-top: 1px solid #ced4da;
    font-size: 0;
    padding: 8px;
    margin: 0;
    .active {
      color: ${colors.operationSelectedColor}
    }
  }

  .examination {
    color: ${colors.surface};
    font-size: 22px;
    font-weight: bold;
    line-height: 1.2;
    width: 100%;
    padding: 8px;
    a {
      background-color: ${colors.error};
      &:hover {
        background-color: ${colors.error};
        opacity: 0.8;
      }
    }
  }

  li {
    display: inline-block;
    list-style-type: none;
    margin-bottom: 1px;
    width: 50%;
  }

  a {
    cursor: pointer;
    display: block;
    text-align: center;
    padding: 4px 0;

    &:hover {
      background-color: ${colors.background};
    }

    span {
      font-size: 10px;
      display: block;
    }
  }
`;

const Icon = styled(FontAwesomeIcon)`
  font-size: 16px;
  margin: auto;
`;

const propTypes = {
  operationListInfoObj: PropTypes.object.isRequired,
  activeLink: PropTypes.string,
  clickFn: PropTypes.func
};

function OperationItem({ operationListInfoObj,  activeLink, clickFn }) {
  return (
    <li className={(operationListInfoObj.link && operationListInfoObj.link === activeLink) ? 'active' : ''} onClick={() => clickFn(operationListInfoObj)}>
      <a>
        <Icon icon={operationListInfoObj.icon} />
        <span>{operationListInfoObj.iconLabel}</span>
      </a>
    </li>
  );
}

OperationItem.propTypes = propTypes;

const operationListInfo = [
  {
    icon: faCapsules,
    iconLabel: "処方",
    click: self => {      
      self.props.gotoPage(1001);
    }
  },
  {
    icon: faSyringe,
    iconLabel: "注射",
    click: self => {      
      self.props.gotoPage(1002);
    }
  },
  {
    icon: faLaptopMedical,
    iconLabel: "PACS",
    click: self => {
      const url =
        "http://TFS-C054/01Link/start.aspx?UserID=miyakojima&Password=miyakojima&ApplicationID=1600&RedirectURL=PatID%3d" +
        self.props.patientId;
      window.open(url, "OpenPACS", "height=600,width=600");
      self.props.PACSOn();
    }
  },
  {
    icon: faNotesMedical,
    iconLabel: "病名病歴",
    click: (self, event) => {
      patientModalEvent.emit("clickOpenDetailedPatientPopup", "8");
      event.stopPropagation();
    }
  },
  {
    icon: faBookUser,
    iconLabel: "患者基本",
    click: (self, event) => {
      patientModalEvent.emit("clickOpenDetailedPatientPopup", "1");
      event.stopPropagation();
    }
  },
  {
    icon: faAllergies,
    iconLabel: "アレルギー"
  },
  {
    icon: faDisease,
    iconLabel: "感染症"
  },
  {
    icon: faPills,
    iconLabel: "禁忌薬"
  },
  {
    icon: faBookMedical,
    iconLabel: "SOAP",
    click: self => {      
      self.props.gotoPage(1009);
    }
  },
  {
    icon: faMicroscope,
    iconLabel: "検査結果",
    click: self => {      
      self.props.gotoPage(1010);
    }
  },
  {
    icon: faMicroscope,
    iconLabel: "検査オーダー",
    click: () => {
      patientModalEvent.emit("clickOpenExaminationPopup", "1");
      // event.stopPropagation();
    }
  }
];

class OperationPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pacsOn: false
    };
  }

  openPACS = () => {
    const url =
      "http://TFS-C054/01Link/start.aspx?UserID=miyakojima&Password=miyakojima&ApplicationID=1600&RedirectURL=PatID%3d" +
      this.props.patientId;
    window.open(url, "OpenPACS", "height=600,width=600");
    this.props.PACSOn();
  };

  changeTab = (obj) => {
    if (obj.link !== undefined) {
      this.props.changeOperationTab(obj.link)
    }
  }

  render() {  
    var mapFunc = (operationList, key) => {
      var clickFunc =
        typeof operationList.click == "function"
          ? event => {
              operationList.click(this, event);
            }
          : (operationList)=>{this.changeTab(operationList)};
      return (
        <OperationItem
          clickFn={clickFunc}
          operationListInfoObj={operationList}
          activeLink={this.props.activeLink}
          key={key}
        />
      );
    };
    mapFunc.bind(this);
    const operationLists = operationListInfo.map(mapFunc);

    return (
      <PanelWrapper>
        <div className="examination">
          <a onClick={this.props.openModal}>カルテを閉じる</a>
        </div>
        <ul>{operationLists}</ul>
      </PanelWrapper>
    );
  }
}

OperationPanel.propTypes = {
  openModal: PropTypes.func,
  activeLink: PropTypes.string,
  patientId: PropTypes.number,
  gotoPage: PropTypes.func,
  PACSOn: PropTypes.func,
  onSelectDoctor: PropTypes.func,
  changeOperationTab: PropTypes.func,
};

export default OperationPanel;
