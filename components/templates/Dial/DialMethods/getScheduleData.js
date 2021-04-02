import axios from "axios/index";
import {formatDateLine} from "~/helpers/date";

export default async function() {
    let path = "/app/api/v2/dial/schedule/dial_get_schedule";
    let post_data = {
        cur_day: formatDateLine(this.state.schedule_date),
        system_patient_id: this.state.patientInfo.system_patient_id,
        time_zone:this.state.timezone+1,
        bed_number: this.state.bed_number
    };
    let schedule_data = [];
    await axios.post(path, {params: post_data}).then(res=>{
        schedule_data = res.data[0];
    });
    return schedule_data;
}
