import * as apiClient from "~/api/apiClient";

export default async function() {
    let path = "/app/api/v2/dial/master/bed_search";
    let post_data = {
        order: 'name',
        // is_enabled: this.state.search_class,
    };
    await apiClient.post(path, {params: post_data}).then(res=>{
        this.setState({
            bed_data: res
        })
    });
}
