import React from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import ItemElementCommon from "./ItemElementCommon";
import { nurseServiceGroups, nurseServiceItems } from "~/helpers/navigationMaps";

class ItemNurseService extends React.Component {
  static propTypes = {
    history: PropTypes.object
  };
  constructor(props) {
    super(props);
    let curScreenWidth = window.innerWidth;
    this.state = {
      favouriteMenuType: 0,
      screen_w: curScreenWidth < this.props.sp_width ? "window_1200" : "window_1920"
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ screen_w: nextProps.screen_width });
  }

  render() { 

    return (
      <>
        {this.props.tab_id == 3 && (
          <ItemElementCommon
            onGoto={this.props.onGoto}
            groups={nurseServiceGroups}
            items={nurseServiceItems}
            tab_id={this.props.tab_id}
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

ItemNurseService.contextType = Context;

ItemNurseService.propTypes = {
  onGoto: PropTypes.func,
  tab_id: PropTypes.number,
  screen_width: PropTypes.string,
  sp_width: PropTypes.number,
  updateFavouriteList: PropTypes.func,
  favouriteList: PropTypes.array
};

export default ItemNurseService;
