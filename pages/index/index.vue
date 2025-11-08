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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// bannerlist
				bannerList: [
					'/static/index/banner.jpg'
				]
			}
		},
		methods: {
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
	
	.grid-text{
		font-size: 38rpx;
		font-weight: bold;
	}
	
	.grid-desc{
		font-size: 24rpx;
		color: $u-type-info;
		margin-bottom: 30rpx;
	}
</style>