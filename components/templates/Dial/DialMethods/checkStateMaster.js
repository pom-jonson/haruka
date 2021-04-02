import axios from "axios";

export default async function (table_name, number, is_enabled) {
    let path = "/app/api/v2/dial/master/checkState";
    let post_data = {        
        table_name,
        number,
        is_enabled,
    };
    await axios.post(path, {params: post_data});
}


