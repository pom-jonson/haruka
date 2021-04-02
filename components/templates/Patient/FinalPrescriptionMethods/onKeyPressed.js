import { KEY_CODES } from "../../../../helpers/constants";

export default function({ keyCode, target }) {
  if (keyCode === KEY_CODES.left) {
    this.setState(
      {
        tab:
          this.state.tab >= 1
            ? this.state.tab - 1
            : this.state.diagnosis.length - 1,
        usageSelectIndex: -1
      },
      function() {
        this.setState({ medical_business_diagnosing_type: this.state.tab });
      }
    );
  }

  if (keyCode === KEY_CODES.right) {
    this.setState(
      {
        tab:
          this.state.tab + 1 === this.state.diagnosis.length
            ? 0
            : this.state.tab + 1,
        usageSelectIndex: -1
      },
      function() {
        this.setState({ medical_business_diagnosing_type: this.state.tab });
      }
    );
  }

  if (
    keyCode === KEY_CODES.down ||
    keyCode === KEY_CODES.up ||
    keyCode === KEY_CODES.enter
  ) {
    let data = [];
    switch (this.state.medical_business_diagnosing_type) {
      case 0:
        data = this.state.usageData.internal.times_1;
        break;
      case 1:
        data = this.state.usageData.internal.times_2;
        break;
      case 2:
        data = this.state.usageData.internal.times_3;
        break;
      case 3:
        data = this.state.usageData.internal.internal_other;
        break;
      case 4:
        data = this.state.usageData.when_necessary.all;
        break;
      case 5:
        data = this.state.usageData.external.all;
        break;
      case 6:
        data = this.state.usageData.injection.all;
        break;
    }

    if (keyCode === KEY_CODES.up) {
      this.setState({
        usageSelectIndex:
          this.state.usageSelectIndex >= 1
            ? this.state.usageSelectIndex - 1
            : data.length - 1
      });
    }

    if (keyCode === KEY_CODES.down) {
      this.setState({
        usageSelectIndex:
          this.state.usageSelectIndex + 1 == data.length
            ? 0
            : this.state.usageSelectIndex + 1
      });
    }

    if (keyCode === KEY_CODES.enter) {
      if (this.state.usageSelectIndex < 0) return;

      const original = this.state.presData;

      original[original.length - 1].usageName =
        data[this.state.usageSelectIndex].name;
      original[original.length - 1].usage =
        data[this.state.usageSelectIndex].code;

      this.modal_obj.usageName = data[this.state.usageSelectIndex].name;
      this.modal_obj.usage = parseInt(target.id);
      this.modal_obj.usageOpen = false;
      this.modal_obj.isDaysOpen = true;
      this.modal_obj.daysInitial = 0;
      this.modal_obj.daysLabel = "";
      this.modal_obj.daysSuffix = "";

      this.patientModalRef.current.testPatientModalRender(this.state, this.modal_obj);
      this.setState({
        // usageName: data[this.state.usageSelectIndex].name,
        // usage: parseInt(target.id),
        presData: original,
        // usageOpen: false,
        // isDaysOpen: true,
        // daysInitial: 0,
        // daysLabel: "",
        // daysSuffix: "",
        lengthId: this.state.presData.length - 1,
        rp: this.state.rp + 1
      });
    }
  }
}
