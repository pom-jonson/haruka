import React from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import SelectExaminationModal from "../templates/Patient/components/SelectExaminationModal";
// import ItemElement from "./ItemElement";
import ItemElementCommon from "./ItemElementCommon";
import { 
  departGroups, 
  departGroups_tableOne,
  departGroups_tableTwo,
  departItems,
  departTabletOneItems,
  departTabletTwoItems
} from "~/helpers/navigationMaps";

class ItemPart extends React.Component {
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
        {this.props.tab_id == 4 && (
          <ItemElementCommon
            onGoto={this.props.onGoto}
            groups={departGroups}
            items={departItems}
            tab_id={this.props.tab_id}
            favouriteList={this.props.favouriteList}
            updateFavouriteList={this.props.updateFavouriteList}
            screen_width={this.state.screen_w}
            sp_width={this.props.sp_width}
          />
        )}
        {this.props.tab_id == 441 && (
          <ItemElementCommon
            onGoto={this.props.onGoto}
            groups={departGroups_tableOne}
            items={departTabletOneItems}
            tab_id={this.props.tab_id}
            favouriteList={this.props.favouriteList}
            updateFavouriteList={this.props.updateFavouriteList}
            screen_width={this.state.screen_w}
            sp_width={this.props.sp_width}
          />
        )}
        {this.props.tab_id == 442 && (
          <ItemElementCommon
            onGoto={this.props.onGoto}
            groups={departGroups_tableTwo}
            items={departTabletTwoItems}
            tab_id={this.props.tab_id}
            favouriteList={this.props.favouriteList}
            updateFavouriteList={this.props.updateFavouriteList}
            screen_width={this.state.screen_w}
            sp_width={this.props.sp_width}
          />
        )}
        {this.state.isExaminationPopupOpen && (
          <SelectExaminationModal
            closeExamination={this.closeExamination}
            patientInfo={this.state.patientInfo}
            selectExaminationFromModal={this.selectExaminationFromModal}
            handleOk={this.closeExamination}
          />
        )}        
      </>
    );
  }
}

ItemPart.contextType = Context;

ItemPart.propTypes = {
  onGoto: PropTypes.func,
  tab_id: PropTypes.number,
  screen_width: PropTypes.string,
  sp_width: PropTypes.number,
  updateFavouriteList: PropTypes.func,
  favouriteList: PropTypes.array
};

export default ItemPart;
