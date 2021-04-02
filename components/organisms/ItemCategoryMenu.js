import React from "react";
// import NotConsentedModal from "./NotConsentedModal";
import PropTypes from "prop-types";
import ItemMenu from "./ItemMenu";
// import { commonGroups, commonItems } from "~/helpers/navigationMaps";

class ItemCategoryMenu extends React.Component {
  constructor(props) {
    super(props);
    let curScreenWidth = window.innerWidth;
    this.state = {      
      screen_w: curScreenWidth < this.props.sp_width ? "window_1200" : "window_1920"
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ screen_w: nextProps.screen_width });
  }
  
  render() {          
    
    return (
      <>    
        <ItemMenu
          onGoto={this.props.onGoto}
          groups={commonGroups}
          items={commonItems}
          tab_id={this.props.tab_id}
          favouriteList={this.props.favouriteList}
          updateFavouriteList={this.props.updateFavouriteList}
          screen_width={this.state.screen_w}
          sp_width={this.props.sp_width}
        />                                     
      </>
    );
  }
}
ItemCategoryMenu.propTypes = {
  onGoto: PropTypes.func,
  updateFavouriteList: PropTypes.func,  
  favouriteList: PropTypes.array,
  screen_width: PropTypes.string,
  sp_width: PropTypes.number,
  tab_id: PropTypes.number,
};
export default ItemCategoryMenu;
