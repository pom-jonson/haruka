import React from "react";
import NotConsentedModal from "./NotConsentedModal";
import PropTypes from "prop-types";
import ItemElementCommon from "./ItemElementCommon";
import { commonGroups, commonItems } from "~/helpers/navigationMaps";

class ItemCommon extends React.Component {
  constructor(props) {
    super(props);
    let curScreenWidth = window.innerWidth;
    this.state = {
      hasNotConsentedData: false,
      favouriteMenuType: 0,
      screen_w: curScreenWidth < this.props.sp_width ? "window_1200" : "window_1920"
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ screen_w: nextProps.screen_width });
  }

  consent = () => {
    this.setState({hasNotConsentedData: true});
  }

  closeNotConsentedModal = () => {
    this.setState({ hasNotConsentedData: false });
  };  
  
  render() {          
    
    return (
      <>    
        <ItemElementCommon
          onGoto={this.props.onGoto}
          groups={commonGroups}
          items={commonItems}
          tab_id={this.props.tab_id}
          favouriteList={this.props.favouriteList}
          updateFavouriteList={this.props.updateFavouriteList}
          screen_width={this.state.screen_w}
          sp_width={this.props.sp_width}
        />                             
        {this.state.hasNotConsentedData && (
          <NotConsentedModal
            patiendId={0}
            fromPatient={true}
            closeNotConsentedModal={this.closeNotConsentedModal}
          />
        )}         
      </>
    );
  }
}
ItemCommon.propTypes = {
  onGoto: PropTypes.func,
  updateFavouriteList: PropTypes.func,  
  favouriteList: PropTypes.array,
  screen_width: PropTypes.string,
  sp_width: PropTypes.number,
  tab_id: PropTypes.number,
};
export default ItemCommon;
