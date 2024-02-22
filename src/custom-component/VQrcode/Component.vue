<template>
	<!-- <button class="v-button">{{ propValue }}</button> -->
		<!-- 二维码 -->
		<img class="codeImg" :src="codeImg" />
</template>

<script>
	import OnEvent from '../common/OnEvent'
	import Qrcode from 'qrious';

	export default {
		extends: OnEvent,
		props: {
			propValue: {
				type: String,
				default: '',
			},
			element: {
				type: Object,
				default: () => {},
			},
		},
		watch:{
			propValue(oldvalue,newvalue){
				console.log("newvalue---",newvalue)
			}
		},
		data() {
			return {
				codeImg: ''
			}
		},
		created() {
			let codeUrl = this.propValue;
			let qr = new Qrcode({
				value: codeUrl,
				background: 'white', // 背景色
				foreground: '#000000', // 二维码颜色
				level: 'L', // 二维码复杂程度
				size: 200, // 尺寸大小
				mime: 'image/png' // 图片类型
			});
			this.codeImg = qr.toDataURL();
			console.log("codeImg===",this.codeImg)
		}
	}
</script>

<style lang="scss" scoped>
	.v-button {
		display: inline-block;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		background: #fff;
		border: 1px solid #dcdfe6;
		color: #606266;
		-webkit-appearance: none;
		text-align: center;
		box-sizing: border-box;
		outline: 0;
		margin: 0;
		transition: .1s;
		font-weight: 500;
		width: 100%;
		height: 100%;
		font-size: 14px;

		&:active {
			color: #3a8ee6;
			border-color: #3a8ee6;
			outline: 0;
		}

		&:hover {
			background-color: #ecf5ff;
			color: #3a8ee6;
		}
	}

	.codeImg {
		width: 80px;
		height: 80px;
	}
</style>
