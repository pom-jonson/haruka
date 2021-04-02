import React, { Component } from "react";
import styled from "styled-components";
import * as colors from "../_nano/colors";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import * as apiClient from "~/api/apiClient";
import Context from "~/helpers/configureStore";

const ListItemWrapper = styled.div`
  background-color: ${colors.onSecondaryLight};
  border-bottom: 1px solid ${colors.disable};
  font-family: "Noto Sans JP", sans-serif;
  align-items: baseline;
  width: 100%;
  padding: 8px 32px 8px 0;
  cursor: pointer;
  position: relative;

  &.open {
    &:before {
      content: "";
      background-color: ${colors.error};
      width: 8px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .date {
      padding-left: 16px;
    }

    .angle {
      transform: rotate(180deg);
    }
  }
  &.edit {
    background: #ccc;
  }

  &.deleted {
    background: #ddd;
  }

  .doctor-name {
    margin-left: 0;
  }

  .not-consented {
    color: ${colors.error};
  }

  .angle {
    margin: auto;
    position: absolute;
    top: 0;
    right: 8px;
    bottom: 0;
`;

const Date = styled.span`
  color: ${colors.onSecondaryDark};
  display: inline-block;
  font-family: NotoSansJP;
  font-size: 14px;
  padding: 0 8px;
  word-break: break-all;
`;

const Angle = styled(FontAwesomeIcon)`
  color: ${colors.onSurface};
  cursor: pointer;
  display: inline-block;
  font-size: 25px;
`;

const ContextMenuUl = styled.div`
  .context-border{    
    .first-li{
      border-bottom: 1px solid;
    }
    span{
      padding-left: 20px;
    }
  }
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
    img {
      width: 30px;
      height: 30px;
    }
    svg {
      width: 30px;
      margin: 8px 0;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextUserMenu = ({
   visible,
   x,
   y,
   parent,
}) => {
  if ( visible ) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div
              onClick={() =>
                parent.contextUserMenuAction("delete_preset")
              }
            >削除
            </div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class SetListItem extends Component {
  constructor(props) {
    super(props);
    this.state={
      contextUserMenu: {
        visible: false,
        x: 0,
        y: 0
      },
      confirm_message: "",
      confirm_type: "",      
    }
  }

  handleUserClick = (e) => {

      if (e.type === "contextmenu") {
          if (this.props.patientId == null || this.props.patientId == undefined || this.props.patientId <= 0) return;
          e.preventDefault();
          // eslint-disable-next-line consistent-this
          const that = this;
          document.addEventListener(`click`, function onClickOutside() {
              that.setState({ contextUserMenu: { visible: false } });
              document.removeEventListener(`click`, onClickOutside);
          });
          window.addEventListener("scroll", function onScrollOutside() {
              that.setState({
                  contextUserMenu: { visible: false }
              });
              window.removeEventListener(`scroll`, onScrollOutside);
          });
          if(this.context.$canDoAction(this.context.FEATURES.PRESET_PATIENT_PRESCRIPTION, this.context.AUTHS.DELETE)) {
              this.setState({
                  contextUserMenu: {
                      visible: true,
                      x: e.clientX,
                      y: e.clientY + window.pageYOffset
                  },
              });
          }
      }
  }

  contextUserMenuAction = (act) => {
    if (act == "delete_preset") {
      this.setState({
        confirm_message: "削除しますか？",
        confirm_type: "delete_preset"
      });
    }
  };

  confirmCancel = () => {
    this.setState({
      confirm_message: "",
      confirm_type: ""
    });
  }

  confirmOk = () => {
    this.deletePatientPreset();
    this.setState({
      confirm_message: "",
      confirm_type: ""
    }); 
  }

  deletePatientPreset = async () => {
    // let path = "/app/api/v2/order/orderComplete";
    // let post_data = {
    //   number:this.props.number
    // };

    // await apiClient._post(
    //   path,
    //   {params: post_data})
    //   .then((res) => {
    //       if(res){          
    //         window.sessionStorage.setItem("alert_messages", "削除しました。");              
    //       }
    //   })
    //   .catch(() => {

    //   })

    const postData = {
      preset_number: this.props.number,
      type: "delete_patient"
    }; 
    let path = "/app/api/v2/order/prescription/preset/delete";

    apiClient
      .post(path, postData)
      .then((res) => {
        if(res.alert_message)  {
          window.sessionStorage.setItem("alert_messages", res.alert_message + "\n");
          this.props.presetRefresh();
        }         
      })
      .catch(() => {
      });  
  }

  render() {
    return (
      <>
        <ListItemWrapper
          className={
            "row " +
            this.props.class_name
          }
          onClick={e => this.props.onAngleClicked(e, this.props.number)}
          onContextMenu={e => this.handleUserClick(e)}
        >
          <Date className="date">
            {this.props.patientId != null && this.props.patientId != undefined && this.props.patientId > 0 ? "【患者別セット】 " : "" }
            {this.props.preset_name}          
          </Date>

          <Angle className="angle" icon={faAngleDown} />
        </ListItemWrapper>
        {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
          <SystemConfirmModal
            hideConfirm= {this.confirmCancel.bind(this)}
            confirmCancel= {this.confirmCancel.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        <ContextUserMenu
           {...this.state.contextUserMenu}
           parent={this}
         />
      </>
    );
  }
}
SetListItem.contextType = Context;
SetListItem.propTypes = {
    preset_name: PropTypes.string,
    class_name: PropTypes.string,
    onAngleClicked: PropTypes.func,
    presetRefresh: PropTypes.func,
    number: PropTypes.number,
    patientId: PropTypes.number,
};

export default SetListItem;
