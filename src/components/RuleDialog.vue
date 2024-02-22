<template>
<div>
  <van-popup ref="ruleDialog" type="dialog" v-model="show" style="border-radius:10px" closeable>
  	<div class="ruleDialog">
  		<div class="ruleTitle">活动规则</div>
  		<div class="innerDialog">
  			<div class="ruleBody">
  				<div style="height: 650rpx;" class="scroll-Y">
  					<div class="gz_content" v-html="gzText">
  					</div>
  				</div>
  			</div>
  		</div>
  	</div>
  </van-popup>
</div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import GLOBAL from './Global'
export default {
    name:"RuleDialog",
    data(){
      return {
        show:false,
		gzText:'1、活动时间：2022年11月20日-2022年12月31日。<br/>2、活动规则：每位用户每天可有一次开盲盒的机会，用户点击开启盲盒按钮参与活动。奖品如下：一等奖：爱奇艺视频黄金会员季卡；二等奖：爱奇艺视频黄金会员月卡；三等奖：爱奇艺视频黄金会员周卡；其他：抱歉，谢谢参与。兑换规则：用户点击“我的奖品”查看中奖记录，领取奖品。<br/>3、兑换规则：用户点击“我的奖品”查看中奖记录，领取奖品。<br/>4、本活动最终解释权归活动主办方所有。',
      }
    },
 
    methods: {
        showLoginForm(){
			console.log("GLOBAL.basicInfData222===",GLOBAL.basicInfData)
			this.gzText = GLOBAL.basicInfData.inviterRule;
            this.show = true
        },
        closeLoginForm(){
            this.show = false
        }
    },
    mounted() {
      //全局事件注册
      eventBus.$on("openDialog",this.showLoginForm)
      eventBus.$on("closeDialog",this.closeLoginForm)
	  //获取活动规则内容
	  console.log("GLOBAL.basicInfData===",GLOBAL.basicInfData)
	  this.gzText = GLOBAL.basicInfData.inviterRule;
    },
	beforeDestroy(){
		eventBus.$off("openDialog",this.showLoginForm)
		eventBus.$off("closeDialog",this.closeLoginForm)
	}
}
</script>

<style lang="scss">
	.ruleDialog {
		background: linear-gradient(-42deg, #F772D1 0%, #F19765 0%, #F772D1 0%, #FD5B6E 0%, #D81B5C 100%);
		width: 310px;
		height:350px;
		border-radius: 10px;
		.ruleTitle {
			text-align: center;
			font-size: 21px;
			height: 59px;
			color: #FFFFFF;
			line-height: 59px;
			font-weight: bold;
			text-shadow: 1px 1px #0C0700;
		}
	
		.ruleBody {
			padding: 20px;
			text-align: left;
			color:#333333;
			.gz_content{
				font-size: 13px;
				line-height: 18px;
				white-space: pre-wrap;
			}
		}
	}
	.innerDialog{
		width: 280px;
		height: 282px;
		font-size: 13px;
		font-weight: 400;
		color: #333333;
		line-height: 20px;
		background: #F9F4DF;
		border-radius: 5px;
		margin-left: 16px;
		overflow:auto
	}
	.closeRule {
		padding-top: 20px;
		width: 28px;
		height: 28px;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	
</style>