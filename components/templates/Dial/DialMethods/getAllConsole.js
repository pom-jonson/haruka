import axios from "axios";

export default async function () {
    let path = "/app/api/v2/dial/master/material_search";
    let post_data = {
        table_kind: 4, //コンソールテーブル
        order:'sort_number'
    };
    let { data } = await axios.post(path, {params: post_data});
    this.setState({console_list: data});
    return data;
}

