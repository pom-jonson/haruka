export default function(usageId) {
	let ret = {};
	if(usageId === "" || usageId === undefined) return ret;
	let usageData;
	Object.keys(this.state.usageData).map((kind)=>{
		usageData = this.state.usageData[kind];	
		Object.keys(usageData).map((idx)=>{
			usageData[idx].map((item)=>{
				if(item.code === parseInt(usageId)){
					ret = item;
				}
			})
		});
	});
	return ret;
}
