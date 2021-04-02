import * as apiClient from "~/api/apiClient";
import { getCurrentDate } from "../../../../helpers/date";
export default function(soap) {

      let path = "/app/api/v2/soap/register";

      apiClient
        .post(path, {
          params: soap
        })
        .then((res) => {
            if(res.alert_message) {
                alert(res.alert_message + "\n");
            }

          soap.number =  res.number;
          let soapList = this.state.soapList;
          let insertIndex = 0;
          insertIndex = this.state.soapList;
          if(soap.isNew === true) {
            soap.isNew = false;
            soap.soap_start_at =  getCurrentDate("-");
            soapList.splice(insertIndex, 0, soap);  
          } else if(soap.isUpdated === true) {
            soap.isUpdated = false;
            soapList.splice(this.state.updateIndex, 1);
            soapList.splice(this.state.updateIndex, 0, soap);  
          }

          this.setState({soapList: soapList});
          this.getSoapHistoryData({
            id: this.props.match.params.id,
            department_code: this.context.department.code
          });
        })
        .catch(() => {
          window.sessionStorage.removeItem("isCallingAPI");
          this.closeModal();
        });

      this.setState({ isForUpdate: false });
      this.resetCacheData();

      return true;    
}

