<template>
  <div class="forgetPwd" v-show="isLoginShow">
    <van-field class="login-mobile field" style="background:center" v-model="mobile" label-class="filed-label" type="digit" maxlength="11" placeholder="请输入手机号" clearable>
    </van-field>
    <!-- 短信验证码 -->
    <sms-code class="m-top10" ref="forgetSmsCode" :noclick="disabled" :phone="mobile" :smsCode1="smsCode" :param="smsParam" :inStyle="inStyle"></sms-code>
   <div class="agreement_style">
   	<div class="agreement_style_font">
   		<div>
			<van-radio-group v-model="isSelect" @change="changmethod">
			    <van-radio :name="true" icon-size="15px" @click="clickmethod"></van-radio>
			</van-radio-group>
		</div>
		<div class="agreeAct" :class="{agreeActive:isAgree}">我已阅读并同意<span class="agreement"   @click.stop="toAgreement('openAgree')">《{{propValue.pdfName}}》</span></div>
   	</div>
   </div>
	<van-button round block type="info" class="submit-btn" :style="computedBtnStyles"   @click.stop="checkUserMobileInfo()">
		 <span :style="computedStyles">{{propValue.btnText}}</span>
	</van-button>
	<Views style="width:100%;height:400px;top:-50px" :isShow="isShowed" :pdfUrl="pdfUrl" @changeState="isShowed=false"></Views>
  </div>
</template>

<script>
import OnEvent from '../common/OnEvent'
import SmsCode from '@/components/smsCode.vue'
import eventBus from '@/utils/eventBus'
import {custoptinfo} from '@/utils/utils'
//引入预览的界面
import Views from '@/components/previewFile.vue'
import {
  loginApi
} from '@/api/marketApi';

export default {
    name:"login",
	extends: OnEvent,
	props: {
	    propValue: {
	        type: Object,
	        required: true,
	        default: () => {},
	    },
	},
	components: {
	  SmsCode,
	  Views
	},
    data(){
      return {
        mobile: '',
        smsCode: '',
        inStyle: {
          width: '90px',
          height: '28px',
          background: '#FFFFFF',
          color: '#0784EB',
          border: '1px solid #0784EB',
        },
        smsParam: {
          msgDesc: '请输入手机验证码',
          msgContent: '忘记密码',
          second: 60,
        },
		disabled:true,
		isAgree:false,
		isSelect: false,
		ischange: false,
		type: '', // 附件类型
		isShowed:false,
		pdfUrl:'',
		isLoginShow:true
      }
    },
	 computed: {
	    computedStyles() {
	      return {
	        fontWeight: this.propValue.fontWeight,
	        fontSize: this.propValue.fontSize+'px',
	      };
	    },
		computedBtnStyles() {
		  return {
		    width: this.propValue.width+'px',
		    height: this.propValue.height+'px',
			lineHeight:this.propValue.height+'px',
			background:this.propValue.backgroundColor,
			borderColor:this.propValue.borderColor,
			color:this.propValue.color,
			borderRadius:this.propValue.borderRadius+'px',
		  };
		},
	  },
    methods: {
		changmethod () {
		  this.ischange = true
		},
		clickmethod () {
		  this.isSelect = this.ischange ? this.isSelect : !this.isSelect
		  this.ischange = false
		},
		toAgreement (id) {
			if(this.disabled){
				return false;
			}
			 let curRoute = this.$route;
			 let sceneCode = 'click';
			 let eventType='2';
			 custoptinfo(sceneCode, curRoute, 0, "打开协议",eventType)
			//打开协议
			this.pdfUrl = this.propValue.pdfUrl;
			console.log("this.pdfUrl===",this.pdfUrl)
			this.type = 'pdf'
			if(this.pdfUrl){
				this.$nextTick(() => {
					this.isShowed = true;
				  })
			}
		},
		//登录
		checkUserMobileInfo() {
			if(this.disabled){
				return false;
			}
			console.log("this.isSelect===",this.isSelect)
			let curRoute = this.$route;
			let sceneCode = 'click';
			let eventType='2';
			custoptinfo(sceneCode, curRoute, 0, "注册登录",eventType)
		  let regSmsCode = this.$refs.forgetSmsCode.getSmsCode()
		  if (!regSmsCode) {
		    return
		  }
		  if(!this.isSelect){
		  	this.isAgree = true;
		  	setTimeout( () => {
		  		this.isAgree = false;		
		  	}, 400);
		  	return;
		  };
		  let _this = this;
		 //发送登录请求
		 let loginParams = {
			"actCode":this.GLOBAL.actCode,
			 "userPhone":this.mobile,
			 "channelCode":this.GLOBAL.channelCode,
			 "msgCode":regSmsCode,
			 "orgCode":this.GLOBAL.orgCode
		 }
		 loginApi(loginParams).then((res) => {
		   console.log("res111===",res)
		   if (res.code == 0) {
			   //登录成功后跳转
			   if(this.propValue.linkUrl){
				   window.location.href = this.propValue.linkUrl;
			   }
			   _this.isLoginShow = false;
		   }
		 }).catch((err)=>{
		 	console.log("err===",err)
		 });
		}
	},
    created() {
      if(!this.GLOBAL.disabled){
		  this.disabled = false;
	  }
    },
}
</script>

<style lang="scss">
	.forgetPwd {
	  background-color: #fff;
	  height: 100vh;
	  padding:2px;
	  .login-title {
	    font-size: 28px;
	    font-weight: 600;
	    color: #333333;
	    letter-spacing: 0;
	    line-height: 30px;
	    padding: 16px 24px 0 24px;
	  }
	  .login-mobile {
	    // margin-top: 64px;
	  }
	  .m-top10 {
	    margin-top: 10px;
	  }
	  .field {
	    padding: 17px 24px;
	    font-size: 16px;
	  }
	  .submit-btn {
	    width: 327px;
	    height: 48px;
	    margin: auto;
	    margin-top: 20px;
	    background-image: linear-gradient(90deg, #00b0ff 0%, #028de8 100%);
	    border-radius: 24px;
	    font-size: 20px;
	    color: #ffffff;
	    text-align: center;
	  }
	  .agreement_style{
	  	margin-top: 15px;
	  	.agreement_style_font{
	  		font-size: 12px;
	  		color: #333333;
	  		letter-spacing: 0;
	  		line-height: 9px;
	  		margin-left: 5px;
	  		display: flex;
	  		justify-content: center;
	  		align-items: center;
	  		.agreement{
	  			color: #FB432F
	  		}
	  	}
	  	.agreeAct{
	  		margin-left: 10px;
	  		margin-right: 10px;
	  		animation-timing-function: ease-in-out; /*动画的速度曲线*/
	  		animation-iteration-count: infinite;  /*动画播放的次数*/
	  		animation-duration: .1s;
	  	}
	  	.agreeActive{
	  		animation-name:scaleDraw;
	  	}
	  }
	}
	@keyframes scaleDraw {  /*抖动动效*/
			0%{
				transform: translate(2px,0);  
			}
			50%{
				transform: translate(-2px,0);
			}
			100%{
				transform: translate(2px,0);
			}
	 }
</style>