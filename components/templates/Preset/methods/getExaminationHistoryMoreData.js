import axios from "axios";

export default async function(params) {
    let { data } = await axios.get("/app/api/v2/order/prescription/patient", {
        params: {
          patient_id: params.id,
          limit: 1000,
          offset: this.state.medicineDBHistory.length,
          search_date: params.search_date != undefined && params.search_date != "" ? params.search_date : null,
          karte_status: params.karte_status != undefined && params.karte_status != null && params.karte_status != "" ? params.karte_status : 0,
          department: params.department,
          latest_flag: params.latest_flag
        }
    });

    if (data) {
        let medicineDBHistory = this.state.medicineDBHistory;
        data.map(item => {
          medicineDBHistory.push(item);
          if (item.history != "") {
            this.getTrackData(item.number);
          }
        })
        this.setState({ 
          medicineDBHistory,
          isLoaded: true
        });
    } else {
      this.setState({
        isLoaded: true
      });
    }
}
  