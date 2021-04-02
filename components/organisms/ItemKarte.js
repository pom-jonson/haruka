import React from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
// import SelectExaminationModal from "../templates/Patient/components/SelectExaminationModal";
// import ItemHarukaElement from "./ItemHarukaElement";
import ItemElementCommon from "./ItemElementCommon";
import { 
  karteDescriptionGroups, 
  karteDescriptionGroups_tableOne, 
  karteDescriptionGroups_tableTwo, 
  karteDescriptionGroups_tableThird, 
  karteDescriptionItems,
  karteDescriptionTabletOneItems,
  karteDescriptionTabletTwoItems,
  karteDescriptionTabletThirdItems
} from "~/helpers/navigationMaps";

// import PhysiologicalModal from "~/components/templates/Patient/Modals/Physiological/PhysiologicalModal";
// import EndoscopeModal from "~/components/templates/Patient/Modals/Endoscope/EndoscopeModal";
// import RadiationModal from "~/components/templates/Patient/Modals/Radiation/RadiationModal";
// import OutPatientModal from "~/components/templates/Patient/Modals/OutPatient/OutPatientModal";

class ItemKarte extends React.Component {
  static propTypes = {
    history: PropTypes.object
  };
  constructor(props) {
    super(props);
    let curScreenWidth = window.innerWidth;
    this.state = {
      // isExaminationPopupOpen: false,
      // isDiseasePopupOpen: false,
      favouriteMenuType: 0,
      // isPhysiologicalPopupOpen: false,
      // isEndoscopePopupOpen: false,
      // isRadiationPopupOpen: false,
      // isOutPatientPopupOpen: false,
      // type: "",
      // system_patient_id: 0,
      screen_w: curScreenWidth < this.props.sp_width ? "window_1200" : "window_1920"
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ screen_w: nextProps.screen_width });
  }

  // gotoUrl = (url) => {
  //   let urlParts = url.split("/");
  //   if (urlParts[0] != undefined &&  urlParts[0] == "physiological") {
  //     this.setState({
  //       type: urlParts[1],
  //       isPhysiologicalPopupOpen: true
  //     });
  //     return;
  //   }
  //   if (urlParts[0] != undefined &&  urlParts[0] == "endoscope") {
  //     this.setState({
  //       type: urlParts[1],
  //       isEndoscopePopupOpen: true
  //     });
  //     return;
  //   }
  //   if (urlParts[0] != undefined &&  urlParts[0] == "radiation") {
  //     this.setState({
  //       type: urlParts[1],
  //       isRadiationPopupOpen: true
  //     });
  //     return;
  //   }
  //   if (urlParts[0] != undefined &&  urlParts[0] == "outpatient") {
  //     this.setState({
  //       type: urlParts[1],
  //       isOutPatientPopupOpen: true
  //     });
  //     return;
  //   }
    
  //   this.props.onGoto(url);
  // }

  // closeModal = () => {
  //   this.setState({
  //     isPhysiologicalPopupOpen: false,
  //     isEndoscopePopupOpen: false,
  //     isRadiationPopupOpen: false,
  //     isOutPatientPopupOpen: false
  //   });
  // }

  render() {
    return (
      <>
      {this.props.tab_id == 2 && (
        <ItemElementCommon
          onGoto={this.props.onGoto}
          groups={karteDescriptionGroups}
          items={karteDescriptionItems}
          tab_id={this.props.tab_id}
          favouriteList={this.props.favouriteList}
          updateFavouriteList={this.props.updateFavouriteList}
          screen_width={this.state.screen_w}
          sp_width={this.props.sp_width}
        />                 
      )}
      {this.props.tab_id == 221 && (
        <ItemElementCommon
          onGoto={this.props.onGoto}
          groups={karteDescriptionGroups_tableOne}
          items={karteDescriptionTabletOneItems}
          tab_id={this.props.tab_id}
          favouriteList={this.props.favouriteList}
          updateFavouriteList={this.props.updateFavouriteList}
          screen_width={this.state.screen_w}
          sp_width={this.props.sp_width}
        />
      )}
      {this.props.tab_id == 222 && (
        <ItemElementCommon
          onGoto={this.props.onGoto}
          groups={karteDescriptionGroups_tableTwo}
          items={karteDescriptionTabletTwoItems}
          tab_id={this.props.tab_id}
          favouriteList={this.props.favouriteList}
          updateFavouriteList={this.props.updateFavouriteList}
          screen_width={this.state.screen_w}
          sp_width={this.props.sp_width}
        />
      )}
      {this.props.tab_id == 223 && (
        <ItemElementCommon
          onGoto={this.props.onGoto}
          groups={karteDescriptionGroups_tableThird}
          items={karteDescriptionTabletThirdItems}
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

ItemKarte.contextType = Context;

ItemKarte.propTypes = {
  onGoto: PropTypes.func,
  tab_id: PropTypes.number,
  screen_width: PropTypes.string,
  sp_width: PropTypes.number,
  updateFavouriteList: PropTypes.func,
  favouriteList: PropTypes.array
};

export default ItemKarte;
