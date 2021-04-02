import axios from "axios";

export default async function(params, first=true) {
    let { data } = await axios.get("/app/api/v2/order/injection/find", {
        params: {
          patient_id: params.id,
          limit: 1000,
          offset: this.state.injectionDBHistory.length,
          search_date: params.search_date != undefined && params.search_date != "" ? params.search_date : null,
          karte_status: params.karte_status != undefined && params.karte_status != null && params.karte_status != "" ? params.karte_status : 0,
          department: params.department,
          latest_flag: params.latest_flag
        }
    });

    if (data) {
        let injectionDBHistory = this.state.injectionDBHistory;
        data.map(item => {
          injectionDBHistory.push(item);
          if (item.history != "") {
            this.getTrackData(item.number);
          }
        })
        this.modal_obj.getHistoryEnd = 1;
        this.setState({ 
          injectionDBHistory,
          isLoaded: first,
          getHistoryEnd: 1
        });
    } else {
      this.modal_obj.getHistoryEnd = 1;
      this.setState({
        isLoaded: first,
        getHistoryEnd: 1
      });
    }
}
  