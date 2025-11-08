<template>
	<view>
		<!-- header start -->
		<view>
			<u-swiper :list="bannerList" mode="rect" height="700" border-radius="0"></u-swiper>
		</view>
		<!-- header end -->

		<!-- body start -->
		<view class="body">
			<u-grid :col="2" :border="false">
				<u-grid-item @click="orderFood(0)">
					<u-image src="/static/index/service.jpg" width="150" height="150"></u-image>
					<view class="body__text">门店堂食</view>
				</u-grid-item>
				<u-grid-item @click="orderFood(1)">
					<u-image src="/static/index/takeaway.jpg" width="150" height="150"></u-image>
					<view class="body__text">外卖派送</view>
				</u-grid-item>
			</u-grid>
		</view>
		<!-- body end -->

		<!-- slot start -->
		<u-gap height="20" bg-color="#fafafa"></u-gap>
		<!-- slot end -->

		<!-- integral start -->
		<view class="integral">
			<view>
				<u-image src="/static/index/integral.jpg" width="200" height="200"></u-image>
			</view>
			<view>
				<view class="integral__nav">我的积分：<text>777</text></view>
				<view class="integral__desc">可兑换现金优惠券和周边礼品 ></view>
			</view>
		</view>
		<!-- integral end -->

		<!-- slot start -->
		<u-gap height="20" bg-color="#fafafa"></u-gap>
		<!-- slot end -->

		<!-- head start -->
		<view>
			<u-grid :col="3" :border="false">
				<u-grid-item>
					<view class="grid-text">积分商城</view>
					<view class="grid-desc">好多神秘好礼等你</view>
					<u-image src="/static/index/integralShop.png" width="120" height="120"></u-image>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-text">会员中心</view>
					<view class="grid-desc">享受会员的特异功能</view>
					<u-image src="/static/index/vipCenter.png" width="120" height="120"></u-image>
				</u-grid-item>
				<u-grid-item>
					<view class="grid-text">活动中心</view>
					<view class="grid-desc">更多活动等你参加</view>
					<u-image src="/static/index/activityCenter.png" width="120" height="120"></u-image>
				</u-grid-item>
			</u-grid>
		</view>
		<!-- head end -->

		<!-- 扫码选择就餐人数弹窗 start -->
		<u-popup v-model="showTableModal" mode="center" border-radius="20">
			<view class="table-modal">
				<view class="table-modal__header">
					<text class="table-modal__title">欢迎光临</text>
					<text class="table-modal__close" @click="closeTableModal">×</text>
				</view>

				<view class="table-modal__content">
					<view class="table-info">
						<text class="table-info__label">桌号：</text>
						<text class="table-info__value">{{ currentTable }}</text>
					</view>

					<view class="people-count">
						<text class="people-count__label">请选择就餐人数</text>
						<view class="people-count__options">
							<view
								v-for="count in peopleCountOptions"
								:key="count"
								class="people-count__item"
								:class="{ 'people-count__item--active': selectedPeopleCount === count }"
								@click="selectPeopleCount(count)"
							>
								{{ count }}人
							</view>
						</view>
					</view>
				</view>

				<view class="table-modal__footer">
					<button class="table-modal__btn" @click="confirmTableInfo">确认并开始点餐</button>
				</view>
			</view>
		</u-popup>
		<!-- 扫码选择就餐人数弹窗 end -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// bannerlist
				bannerList: [
					'/static/index/banner.jpg'
				],
				// 桌号弹窗相关
				showTableModal: false,
				currentTable: '',
				selectedPeopleCount: 2,
				peopleCountOptions: [1, 2, 3, 4, 5, 6, 7, 8]
			}
		},
		onLoad(options) {
			// 处理扫码进入的场景
			this.handleScanScene(options);
		},
		onShow() {
			// 每次显示页面时检查是否有场景值
			// 在某些情况下，onLoad 可能获取不到 scene
			const scene = decodeURIComponent(this.$mp.query.scene || '');
			if (scene) {
				this.parseSceneAndShowModal(scene);
			}
		},
		methods: {
			/**
			 * 处理扫码场景
			 */
			handleScanScene(options) {
				console.log('页面参数：', options);

				// 获取 scene 参数（扫码进入会携带）
				let scene = '';

				// 方式1：从 options 中获取
				if (options.scene) {
					scene = decodeURIComponent(options.scene);
				}
				// 方式2：从 query 中获取（兼容不同版本）
				else if (options.q) {
					// q 是完整的二维码内容
					const sceneMatch = options.q.match(/scene=([^&]+)/);
					if (sceneMatch) {
						scene = decodeURIComponent(sceneMatch[1]);
					}
				}

				console.log('解析的 scene：', scene);

				if (scene) {
					this.parseSceneAndShowModal(scene);
				}
			},

			/**
			 * 解析场景值并显示弹窗
			 */
			parseSceneAndShowModal(scene) {
				// 解析 scene 参数：格式为 table=桌号
				const params = {};
				scene.split('&').forEach(item => {
					const [key, value] = item.split('=');
					if (key && value) {
						params[key] = value;
					}
				});

				console.log('解析的参数：', params);

				// 获取桌号
				if (params.table) {
					this.currentTable = params.table;
					this.showTableModal = true;

					// 更新桌号状态为使用中
					this.updateTableStatus(params.table, 1);
				}
			},

			/**
			 * 更新桌号状态
			 */
			async updateTableStatus(tableNumber, status) {
				try {
					const zhuohaoObj = uniCloud.importObject('zhuohao');
					const result = await zhuohaoObj.updateTableStatus(tableNumber, status);
					console.log('更新桌号状态：', result);
				} catch (error) {
					console.error('更新桌号状态失败：', error);
				}
			},

			/**
			 * 选择就餐人数
			 */
			selectPeopleCount(count) {
				this.selectedPeopleCount = count;
			},

			/**
			 * 关闭弹窗
			 */
			closeTableModal() {
				this.showTableModal = false;
			},

			/**
			 * 确认桌号和就餐人数，开始点餐
			 */
			confirmTableInfo() {
				// 保存桌号和就餐人数到本地存储
				uni.setStorageSync('currentTable', this.currentTable);
				uni.setStorageSync('peopleCount', this.selectedPeopleCount);
				uni.setStorageSync('subCurrent', 0); // 0-门店堂食

				// 关闭弹窗
				this.showTableModal = false;

				// 提示用户
				uni.showToast({
					title: `已选择${this.currentTable}，${this.selectedPeopleCount}人用餐`,
					icon: 'success',
					duration: 2000
				});

				// 跳转到点餐页面
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/menu/menu'
					});
				}, 1500);
			},

			// spotmeal
			orderFood(param) {
				uni.setStorageSync('subCurrent', param);
				uni.switchTab({
					url: '/pages/menu/menu'
				})
			}
		}
	}
</script>

<style lang="scss">
	.body {
		position: relative;
		z-index: 99999;
		margin: -40rpx 30rpx 0 30rpx;
		padding: 0 15rpx;
		background-color: white;
		border-radius: 14rpx;

		&__text {
			font-weight: bold;
			font-size: 30rpx;
			margin-top: 15rpx;
		}
	}

	.integral {
		display: flex;
		align-items: flex-end;
		padding: 20rpx;

		&__nav {
			color: $u-main-color;
			font-weight: bold;
			margin-bottom: 20rpx;
			font-size: 30rpx;

			text {
				font-size: 38rpx;
			}
		}

		&__desc {
			font-size: 24rpx;
			color: $u-type-info;
			margin-bottom: 10rpx;
		}
	}

	.grid-text {
		font-size: 38rpx;
		font-weight: bold;
	}

	.grid-desc {
		font-size: 24rpx;
		color: $u-type-info;
		margin-bottom: 30rpx;
	}

	// 桌号弹窗样式
	.table-modal {
		width: 600rpx;
		background-color: #fff;
		border-radius: 20rpx;
		overflow: hidden;

		&__header {
			position: relative;
			padding: 40rpx 30rpx 30rpx;
			background: linear-gradient(135deg, #EE2F37 0%, #ff6b6b 100%);
			text-align: center;
		}

		&__title {
			font-size: 36rpx;
			font-weight: bold;
			color: #fff;
		}

		&__close {
			position: absolute;
			right: 20rpx;
			top: 20rpx;
			font-size: 50rpx;
			color: #fff;
			line-height: 1;
			padding: 10rpx;
		}

		&__content {
			padding: 40rpx 30rpx;
		}

		&__footer {
			padding: 0 30rpx 40rpx;
		}

		&__btn {
			width: 100%;
			height: 88rpx;
			line-height: 88rpx;
			background: linear-gradient(135deg, #EE2F37 0%, #ff6b6b 100%);
			color: #fff;
			border-radius: 44rpx;
			border: none;
			font-size: 32rpx;
			font-weight: bold;
		}
	}

	.table-info {
		text-align: center;
		margin-bottom: 40rpx;
		padding: 30rpx;
		background-color: #f8f8f8;
		border-radius: 16rpx;

		&__label {
			font-size: 28rpx;
			color: #666;
		}

		&__value {
			font-size: 48rpx;
			font-weight: bold;
			color: #EE2F37;
			margin-left: 10rpx;
		}
	}

	.people-count {
		&__label {
			display: block;
			font-size: 28rpx;
			color: #333;
			margin-bottom: 20rpx;
			text-align: center;
		}

		&__options {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
		}

		&__item {
			width: 22%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background-color: #f5f5f5;
			border-radius: 12rpx;
			margin-bottom: 20rpx;
			font-size: 28rpx;
			color: #666;
			transition: all 0.3s;

			&--active {
				background-color: #EE2F37;
				color: #fff;
				font-weight: bold;
				transform: scale(1.05);
			}
		}
	}
</style>