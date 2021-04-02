import axios from "axios";
import {makeList_code, makeList_codeName} from "~/helpers/dialConstants";
import {code_antiItems} from "~/helpers/dialConstants";
import {extract_enabled} from "~/helpers/dialConstants";
import {code_data} from "~/helpers/dialConstants";

export default async function () {
    let path = "/app/api/v2/dial/master/material_search";
    let post_data = {
        table_kind: 3,
        order:'sort_number'
    };
    let { data } = await axios.post(path, {params: post_data});
    this.setState({
        anticoagulation_master_pattern_whole : data,
        anticoagulation_master_pattern: extract_enabled(data),        
        anticoagulation_master_pattern_list_whole:makeList_code(data),
        anticoagulation_master_pattern_list:makeList_code(extract_enabled(data)),
        anticoagulation_master_pattern_list_select:makeList_codeName(extract_enabled(data)),
        anticoagulation_items:code_antiItems(extract_enabled(data)),
        code_antianticoagulation_master_pattern : code_data(extract_enabled(data)), 
    });
}


