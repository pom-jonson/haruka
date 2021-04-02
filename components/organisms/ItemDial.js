import React from "react";
// import Button from "../atoms/Button";
import PropTypes from "prop-types";
import ItemElement from "./ItemElement";
import Context from "~/helpers/configureStore";
import { dialGroups, dialItems } from "~/helpers/navigationMaps";

class ItemDial extends React.Component {
  static propTypes = {
    history: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = {
      isExaminationPopupOpen: false,
      isDiseasePopupOpen: false,
      favouriteMenuType: 0
    };
  } 

  render() {
    return (
        <>
          <ItemElement
            tab_id={this.props.tab_id}
            onGoto={this.props.onGoto}
            groups={dialGroups}
            items={dialItems}
            favouriteList={this.props.favouriteList}
            updateFavouriteList={this.props.updateFavouriteList}
          />       
        </>
    );
  }
}

ItemDial.contextType = Context;

ItemDial.propTypes = {
  tab_id: PropTypes.number,
  onGoto: PropTypes.func,
  updateFavouriteList: PropTypes.func,
  favouriteList: PropTypes.array
};

export default ItemDial;
