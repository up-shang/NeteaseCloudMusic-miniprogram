function req(obj) {
	return new Promise((resolve, reject) => {
		const HOST = 'http://82.156.71.207:3000';
		const method = obj.method || "GET";
		const url = HOST + obj.url || "";
		const data = obj.data || {};
		let header = {
			'Content-Type': obj.contentType || 'application/json'
		};
		wx.request({
			url: url,
			data: data,
			method: method,
			header: header,
			success: ((result) => {
				const res = result.data
				if (res.code && res.code !== 200) {
					// 错误处理，返回登录页
					wx.showToast({
						duration: 1000,
						title: res.msg,
						icon: 'none'
					})
					return reject(res.msg)
				} else {
					return resolve(res)
				}
			}),
			fail: ((err) => {
				reject(err)
			})
		})
	})
}
export default req