import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as colors from "../_nano/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserNurse, faBookmark } from "@fortawesome/pro-light-svg-icons";
import { faCapsules } from "@fortawesome/free-solid-svg-icons";
import LargeUserIcon from "../atoms/LargeUserIcon.js";
import Male from "../atoms/Male.js";
import Tag from "../atoms/Tag.js";
import Button from "../atoms/Button.js";
import TabLinkDrawer from "../molecules/TabLinkDrawer.js";
import UsageTab from "../molecules/UsageTab";

const Wrapper = styled.div`
  background-color: ${colors.surface};
  border-radius: 4px;
  width: 400px;
  padding: 8px;
`;

const Flex = styled.div`
  display: flex;
  align-items: ${props => (props.center ? "center" : "flex-end")};
  justify-content: space-between;
`;

const PatientId = styled.div`
  color: ${colors.midEmphasis};
  font-family: NotoSansJP;
  font-size: 10px;
  letter-spacing: 1px;
`;

const Kana = styled.div`
  color: ${colors.onSurface};
  font-family: NotoSansJP;
  font-size: 10px;
`;

const PatientName = styled.div`
  color: ${colors.onSurface};
  display: inline-block;
  font-family: NotoSansJP;
  font-size: 17px;
  letter-spacing: 2.1px;
`;

const Birthday = styled.div`
  color: ${colors.midEmphasis};
  font-family: NotoSansJP;
  font-size: 10px;
  letter-spacing: 1px;
`;

const PopupWrapper = styled.div`
  width: 500px;
  height: 500px;
  background-color: ${colors.midEmphasis};
`;

const PatientInfo = props => {
  const state = {
    isOpen: false
  };
  const openModal = () => {
    state.isOpen = state.isOpen ? false : true;
  };
  return (
    <>
      <Wrapper>
        <Flex center>
          <PatientId>#18</PatientId>
          <div>
            <TabLinkDrawer size="10px" LinkText="病気一覧" />
            <FontAwesomeIcon
              icon={faCapsules}
              size="xs"
              color={colors.midEmphasis}
              fixedWidth
            />
            <FontAwesomeIcon
              icon={faUserNurse}
              size="xs"
              color={colors.secondary}
              fixedWidth
            />
            <FontAwesomeIcon
              icon={faBookmark}
              size="xs"
              color={colors.midEmphasis}
              fixedWidth
            />
          </div>
        </Flex>
        <Flex>
          <LargeUserIcon size="5x" />
          <div>
            <Kana>{props.patientInfo.kana}</Kana>
            <div>
              <PatientName>
                {props.patientInfo.name}({props.patientInfo.age})
              </PatientName>
              <Male />
            </div>
            <Birthday>1994年1月1日生</Birthday>
            <Tag color={colors.error} tagText="外来" />
          </div>
          <Button onClick={openModal}>ポップアップ</Button>
          <Button>診察開始</Button>
        </Flex>
      </Wrapper>
      {state.isOpen ? <Popup /> : ""}
    </>
  );
};

//以下簡易ポップアップ応急処置なので絶対削除
const Popup = () => <PopupWrapper>{UsageNav}</PopupWrapper>;

const tabs = [
  {
    name: "患者情報"
  },
  {
    name: "住所情報"
  },
  {
    name: "保険パターン情報"
  },
  {
    name: "保険情報"
  }
];

const Ul = styled.ul`
  width: 649px;

  &.nav {
    padding-left: 8px;
  }

  > li > a {
    color: #bbbbbb;
    padding: 4px 14px;
  }

  > li > a.active {
    color: ${colors.onSurface};
  }
`;

const UsageNav = () => {
  const usages = tabs.forEach(tab => <UsageTab id={tab.id} name={tab.name} />);

  return <Ul className="nav nav-tabs">{usages}</Ul>;
};

PatientInfo.propTypes = {
  patientInfo: PropTypes.object
};

export default PatientInfo;
