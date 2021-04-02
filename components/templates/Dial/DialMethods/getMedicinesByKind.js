import axios from "axios";
import {makeList_code} from "~/helpers/dialConstants";

export default async function (medicine_kind,sort_order="name",sort_order2="", name='', name_search_type=1, is_antithrombotic = 0) {
    let path = "/app/api/v2/dial/master/medicine_search";
    let post_data = {
        category:medicine_kind,
        order:sort_order,
        order2:sort_order2,
        name,
        name_search_type,
        is_antithrombotic
    };
    await axios.post(path, {params: post_data}).
        then((res) => {             
            this.setState({
                medicineList: res.data,
                medicine_list: makeList_code(res.data),    //variables for SelectBox List
            });
            return res.data;
        })
        .catch(() => {
            return false;
        });
}


