import * as apiClient from "../../../../../api/apiClient";

export default async function() {
  let data = await apiClient.get("/app/api/v2/master/injection/usages");   
	// let result = [
	// {
	// "search_name": "皮下筋肉内注射",
	// "name": "皮下筋肉内注射",
	// "code": 3000008,
	// "diagnosis_division": "31",
	// "require_body_parts": 0,
	// "body_parts_position": "",
	// "is_convert_direct_comment": 0
	// },
	// {
	// "search_name": "静脈内注射",
	// "name": "静脈内注射",
	// "code": 3000009,
	// "diagnosis_division": "32",
	// "require_body_parts": 0,
	// "body_parts_position": "",
	// "is_convert_direct_comment": 0
	// },
	// {
	// "search_name": "点滴注射",
	// "name": "点滴注射その他（入院外）",
	// "code": 3000031,
	// "diagnosis_division": "33",
	// "require_body_parts": 0,
	// "body_parts_position": "",
	// "is_convert_direct_comment": 0
	// },
	// {
	// "search_name": "中心静脈注射",
	// "name": "中心静脈注射",
	// "code": 3000040,
	// "diagnosis_division": "33",
	// "require_body_parts": 0,
	// "body_parts_position": "",
	// "is_convert_direct_comment": 0
	// },
	// {
	// "search_name": "中心静脈注射用カテーテル挿入",
	// "name": "中心静脈注射用カテーテル挿入",
	// "code": 3000044,
	// "diagnosis_division": "33",
	// "require_body_parts": 1,
	// "body_parts_position": "separator",
	// "is_convert_direct_comment": 0
	// },
	// {
	// "search_name": "関節腔内注射",
	// "name": "関節腔内注射",
	// "code": 9800842,
	// "diagnosis_division": "34",
	// "require_body_parts": 1,
	// "body_parts_position": "head",
	// "is_convert_direct_comment": 0
	// },
	// {
	// "search_name": "トリガ－ポイント注射",
	// "name": "トリガ－ポイント注射",
	// "code": 5400143,
	// "diagnosis_division": "50",
	// "require_body_parts": 1,
	// "body_parts_position": "head",
	// "is_convert_direct_comment": 0
	// }
	// ];

	this.modal_obj.usageInjectData = data;
	
	this.setState({
		usageInjectData: data
	});

  window.localStorage.setItem("haruka_cache_usageInjectData", JSON.stringify(data));
  return data;
}
