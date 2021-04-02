import axios from "axios";
import {makeList_code, extract_enabled, makeList_codeName, code_data} from "~/helpers/dialConstants";

export default async function () {
    let path = "/app/api/v2/dial/master/material_search";
    let post_data = {
        table_kind: 2,
        order:'sort_number'
    };
    let { data } = await axios.post(path, {params: post_data});

    this.setState({
        all_anti_items: data,
        all_anti_items_list:makeList_code(data),
        all_anti_items_list_select:makeList_codeName(extract_enabled(data)),
        code_all_anti_items:code_data(data),
    });
}