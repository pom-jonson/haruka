import axios from "axios";
// import { persistedState } from "../../../../helpers/cache";

export default function() {
    // let { soapData } = persistedState();
    
    // const authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));

    if (this.state.staff_category === 2) {
      if (this.context.selectedDoctor.code === 0) {
        alert("依頼医を選択してください");
        return false;
      }
    }

    let soapList = this.state.soapList.filter(item => {
        return item.isNew || item.isUpdate || item.isDeleted;
    });

    if (soapList !== undefined && soapList.length > 0) {
        // eslint-disable-next-line consistent-this
        let self = this;
        let posts = soapList.map(postData => {
            if (postData.isNew) {
                postData.system_patient_id = self.props.match.params.id;
            }
            return postData;
        })
        
        // let path = soapData.isForUpdate
        //     ? "/app/api/v2/soap/update"
        //     : "/app/api/v2/soap/register";
        let path = "/app/api/v2/soap/register";

        axios
            .post(path, {
                params: posts
            })
            .then(() => {

            })
            .catch(() => {
                alert("送信に失敗しました");
            });
    }

    return true;
}
  