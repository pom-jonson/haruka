import axios from "axios";
import {makeList_code} from "~/helpers/dialConstants";

export default async function () {
    let path = "/app/api/v2/dial/master/material_search";
    let post_data = {        
        is_enabled: 1,        
        table_kind: 7,
        order:'sort_number'
    };
    await axios.post(path, {params: post_data})
        .then((res) => {             
            this.setState({
                diseaseData: res.data,
                disease_list: makeList_code(res.data),    //variables for SelectBox List
            });
            return res.data;
        })
        .catch(() => {
            return false;
        });
    
}


