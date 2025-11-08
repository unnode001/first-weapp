// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129

const db = uniCloud.database();
const dbCmd = db.command;

module.exports = {
	_before: function () { // 通用预处理器
		// 可以在这里进行权限校验等
	},

	/**
	 * 生成桌号小程序码并保存到数据库
	 * @param {string} tableNumber 桌号
	 * @param {number} seatCount 座位数，默认4
	 * @returns {object} 返回生成结果
	 */
	async generateTableQRCode(tableNumber, seatCount = 4) {
		// 参数校验
		if (!tableNumber) {
			return {
				code: 400,
				message: '桌号不能为空'
			}
		}

		try {
			// 检查桌号是否已存在
			const existTable = await db.collection('zhuohao').where({
				table_number: tableNumber
			}).get();

			if (existTable.data && existTable.data.length > 0) {
				return {
					code: 400,
					message: '该桌号已存在'
				}
			}

			// 获取小程序的 access_token
			const accessTokenRes = await uniCloud.getWXAccessToken();
			if (!accessTokenRes || !accessTokenRes.accessToken) {
				return {
					code: 500,
					message: '获取 access_token 失败'
				}
			}

			const accessToken = accessTokenRes.accessToken;

			// 调用微信 API 生成小程序码
			// scene 参数用于携带桌号信息，格式：table=桌号
			const scene = `table=${tableNumber}`;
			const qrcodeUrl = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;

			const qrcodeResult = await uniCloud.httpclient.request(qrcodeUrl, {
				method: 'POST',
				data: {
					scene: scene,
					page: 'pages/index/index', // 扫码后进入的页面
					width: 430,
					auto_color: false,
					line_color: { "r": 238, "g": 47, "b": 55 }, // 品牌红色
					is_hyaline: false
				},
				dataType: 'buffer' // 返回二进制数据
			});

			// 检查是否生成成功
			if (qrcodeResult.status !== 200) {
				return {
					code: 500,
					message: '生成小程序码失败',
					error: qrcodeResult.data
				}
			}

			// 将小程序码上传到云存储
			const uploadResult = await uniCloud.uploadFile({
				cloudPath: `qrcode/table_${tableNumber}_${Date.now()}.png`,
				fileContent: qrcodeResult.data
			});

			if (!uploadResult.fileID) {
				return {
					code: 500,
					message: '上传小程序码到云存储失败'
				}
			}

			// 保存到数据库
			const dbResult = await db.collection('zhuohao').add({
				table_number: tableNumber,
				qrcode_url: uploadResult.fileID,
				qrcode_file_id: uploadResult.fileID,
				seat_count: seatCount,
				status: 0, // 0-空闲
				create_date: Date.now()
			});

			if (!dbResult.id) {
				return {
					code: 500,
					message: '保存到数据库失败'
				}
			}

			// 返回成功结果
			return {
				code: 200,
				message: '生成桌号小程序码成功',
				data: {
					id: dbResult.id,
					table_number: tableNumber,
					qrcode_url: uploadResult.fileID,
					seat_count: seatCount
				}
			}

		} catch (error) {
			console.error('生成桌号小程序码失败：', error);
			return {
				code: 500,
				message: '生成桌号小程序码失败',
				error: error.message
			}
		}
	},

	/**
	 * 获取所有桌号列表
	 * @returns {object} 返回桌号列表
	 */
	async getTableList() {
		try {
			const result = await db.collection('zhuohao')
				.orderBy('table_number', 'asc')
				.get();

			return {
				code: 200,
				message: '获取成功',
				data: result.data
			}
		} catch (error) {
			console.error('获取桌号列表失败：', error);
			return {
				code: 500,
				message: '获取桌号列表失败',
				error: error.message
			}
		}
	},

	/**
	 * 根据桌号获取桌号信息
	 * @param {string} tableNumber 桌号
	 * @returns {object} 返回桌号信息
	 */
	async getTableInfo(tableNumber) {
		if (!tableNumber) {
			return {
				code: 400,
				message: '桌号不能为空'
			}
		}

		try {
			const result = await db.collection('zhuohao').where({
				table_number: tableNumber
			}).get();

			if (!result.data || result.data.length === 0) {
				return {
					code: 404,
					message: '桌号不存在'
				}
			}

			return {
				code: 200,
				message: '获取成功',
				data: result.data[0]
			}
		} catch (error) {
			console.error('获取桌号信息失败：', error);
			return {
				code: 500,
				message: '获取桌号信息失败',
				error: error.message
			}
		}
	},

	/**
	 * 更新桌号状态
	 * @param {string} tableNumber 桌号
	 * @param {number} status 状态：0-空闲，1-使用中，2-已预订
	 * @returns {object} 返回更新结果
	 */
	async updateTableStatus(tableNumber, status) {
		if (!tableNumber) {
			return {
				code: 400,
				message: '桌号不能为空'
			}
		}

		if (![0, 1, 2].includes(status)) {
			return {
				code: 400,
				message: '状态值无效'
			}
		}

		try {
			const result = await db.collection('zhuohao').where({
				table_number: tableNumber
			}).update({
				status: status
			});

			return {
				code: 200,
				message: '更新成功',
				data: result
			}
		} catch (error) {
			console.error('更新桌号状态失败：', error);
			return {
				code: 500,
				message: '更新桌号状态失败',
				error: error.message
			}
		}
	},

	/**
	 * 删除桌号
	 * @param {string} tableNumber 桌号
	 * @returns {object} 返回删除结果
	 */
	async deleteTable(tableNumber) {
		if (!tableNumber) {
			return {
				code: 400,
				message: '桌号不能为空'
			}
		}

		try {
			// 先获取桌号信息，删除云存储中的二维码
			const tableInfo = await this.getTableInfo(tableNumber);
			if (tableInfo.code === 200 && tableInfo.data.qrcode_file_id) {
				await uniCloud.deleteFile({
					fileList: [tableInfo.data.qrcode_file_id]
				});
			}

			// 删除数据库记录
			const result = await db.collection('zhuohao').where({
				table_number: tableNumber
			}).remove();

			return {
				code: 200,
				message: '删除成功',
				data: result
			}
		} catch (error) {
			console.error('删除桌号失败：', error);
			return {
				code: 500,
				message: '删除桌号失败',
				error: error.message
			}
		}
	}
}
