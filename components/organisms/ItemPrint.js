import React from "react";
// import Button from "../atoms/Button";
import PropTypes from "prop-types";
import ItemElement from "./ItemElement";
import Context from "~/helpers/configureStore";
import { printGroups, printItems } from "~/helpers/navigationMaps";

class ItemPrint extends React.Component {
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
            groups={printGroups}
            items={printItems}
            favouriteList={this.props.favouriteList}
            updateFavouriteList={this.props.updateFavouriteList}
          />       
        </>
    );
  }
}

ItemPrint.contextType = Context;

ItemPrint.propTypes = {
  tab_id: PropTypes.number,
  onGoto: PropTypes.func,
  updateFavouriteList: PropTypes.func,
  favouriteList: PropTypes.array
};

export default ItemPrint;
