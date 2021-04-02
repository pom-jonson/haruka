import axios from "axios";
import {makeList_code} from "~/helpers/dialConstants";

export default async function () {
    let path = "/app/api/v2/dial/master/medicine_search";
    let post_data = {
        category: "インスリン"
        // is_enabled: 1,
        // table_kind: 6,
        // is_insulin: 1,
    };
    await axios.post(path, {params: post_data})
        .then((res) => {             
            this.setState({
                insulin_injectionData: res.data,
                insulin_injection_list: makeList_code(res.data),    //variables for SelectBox List
            });
            return res.data;
        })
        .catch(() => {
            return false;
        });
    
}


