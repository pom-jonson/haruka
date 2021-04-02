
export default function(usageId) {
	let ret = "";
	if(usageId === "" || usageId === undefined) return "";
	let usageData;
	usageId = parseInt(usageId);
	Object.keys(this.state.usageData).map((kind)=>{
		usageData = this.state.usageData[kind];	
	Object.keys(usageData).map((idx)=>{
		usageData[idx].map((item)=>{
			if(item.code === usageId){
				ret = item.diagnosis_division;	
			} 
		})
	});
	})
	
	return ret;
}
