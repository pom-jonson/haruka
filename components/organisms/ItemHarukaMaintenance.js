import React from "react";
// import Button from "../atoms/Button";
import PropTypes from "prop-types";
import ItemElementCommon from "./ItemElementCommon";
import Context from "~/helpers/configureStore";
import { 
  maintenanceHarukaGroups, 
  maintenanceHarukaItems,
  maintenanceHarukaGroups_tableOne,
  maintenanceHarukaTabletOneItems
} from "~/helpers/navigationMaps";

class ItemHarukaMaintenance extends React.Component {
  static propTypes = {
    history: PropTypes.object
  };
  constructor(props) {
    super(props);
    let curScreenWidth = window.innerWidth;
    this.state = {
      isExaminationPopupOpen: false,
      isDiseasePopupOpen: false,
      screen_w: curScreenWidth < this.props.sp_width ? "window_1200" : "window_1920",
      favouriteMenuType: 0
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ screen_w: nextProps.screen_width });
  }

  render() {
    return (
        <>
          {this.props.tab_id == 5 && (
            <ItemElementCommon
              onGoto={this.props.onGoto}
              groups={maintenanceHarukaGroups}
              items={maintenanceHarukaItems}
              favouriteList={this.props.favouriteList}
              updateFavouriteList={this.props.updateFavouriteList}
              screen_width={this.state.screen_w}
              sp_width={this.props.sp_width}
            />
          )}
          {this.props.tab_id == 551 && (
            <ItemElementCommon
              onGoto={this.props.onGoto}
              groups={maintenanceHarukaGroups_tableOne}
              items={maintenanceHarukaTabletOneItems}
              favouriteList={this.props.favouriteList}
              updateFavouriteList={this.props.updateFavouriteList}
              screen_width={this.state.screen_w}
              sp_width={this.props.sp_width}
            />
          )}
        </>
    );
  }
}

ItemHarukaMaintenance.contextType = Context;

ItemHarukaMaintenance.propTypes = {
  onGoto: PropTypes.func,
  updateFavouriteList: PropTypes.func,  
  favouriteList: PropTypes.array,
  screen_width: PropTypes.string,
  sp_width: PropTypes.number,
  tab_id: PropTypes.number,
};

export default ItemHarukaMaintenance;
