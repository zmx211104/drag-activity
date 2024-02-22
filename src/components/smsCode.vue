<template>
  <van-field
    v-model="smsCode"
    center
    type="digit"
    maxlength="6"
    clearable
    :label="label"
    :placeholder="param.msgDesc || '请输入验证码'"
    :style="{
      padding: outStyle.padding,
      'font-size': outStyle.fontSize
    }"
  >
    <template #button>
      <div class="right-text inStyle" :class="{ 'div-disabled': disabled }" v-preventReClick="{ remark: '发送验证码' }"  @click.stop="sendMsgCode()">
        {{ smsContent }}
      </div>
    </template>
  </van-field>
</template>

<script>
import { Field } from 'vant'
import http from '@/utils/http'
import {
 sendMsgToCst
} from '@/api/marketApi';
import { isMobile } from '@/utils/check'
export default {
  name: 'SmsCode',
  props: {
    phone: {
      type: String
    },
    smsCode1: {
      type: String,
      default: ''
    },
    param: {
      type: Object
    },
    label: {
      type: String,
      default: ''
    },
	noclick: {
		type:Boolean,
		default:false
	},
    outStyle: {
      type: Object,
      default: () => {
        return {
          padding: '17px 24px',
          fontSize: '16px'
        }
      }
    },
    inStyle: {
      type: Object,
      default: () => {
        return {
          width: '102px',
          height: '28px',
          background: '#028de8',
          color: '#ffffff',
          border: ''
        }
      }
    }
  },
  data() {
    return {
      smsContent: '发送验证码',
      disabled: false, // 发动短信按钮被点击
      smsCode: this.smsCode1,
      smsSetTimeout: null
    }
  },
  components: {
    [Field.name]: Field
  },
  mounted(){
	  if(this.noclick){
		  this.disabled=true;
	  }
  },
  methods: {
    // 发送短信验证码
    sendMsgCode() {
      let _this = this
      if (!_this.phone) {
        _this.$dialog.alert({ title: '温馨提示', message: '请输入手机号' })
        return
      }
      if (!isMobile(_this.phone)) {
        _this.$dialog.alert({ title: '温馨提示', message: '请输入正确格式的手机号' })
        return
      }
      let secd = Number(_this.param.second) ? Number(_this.param.second) : 60 //如果参数中设定时间
      _this.disabled = true
      sendMsgToCst({
        userPhone: _this.phone,
		actCode:_this.GLOBAL.actCode
      })
        .then((res) => {
          _this.sendMessage(secd)
        })
        .catch((err) => {
          console.log(err)
          _this.disabled = false
        })
    },
    // 计算倒计时
    sendMessage(second) {
      let _this = this
      if (second >= 0) {
        _this.smsContent = second + 's'
        second--
        this.smsSetTimeout = setTimeout(function () {
          _this.sendMessage(second)
        }, 1000)
      } else {
        _this.smsContent = '重新获取'
        _this.disabled = false
      }
    },
    //获取验证码
    getSmsCode() {
      if (!this.phone) {
        this.$dialog.alert({ title: '温馨提示', message: '请输入手机号' })
        return
      }
      if (!isMobile(this.phone)) {
        this.$dialog.alert({ title: '温馨提示', message: '请输入正确格式的手机号' })
        return
      }
      if (!this.smsCode || this.smsCode.length != 6) {
        this.$dialog.alert({
          title: '温馨提示',
          message: '请输入6位短信验证码'
        })
        return
      }
      return this.smsCode
    },
    //清理倒计时
    clearSmsTime() {
      clearTimeout(this.smsSetTimeout)
      this.smsContent = '发送验证码'
      this.disabled = false
    }
  },
  destroyed() {
    clearTimeout(this.smsSetTimeout)
  }
}
</script>

<style lang="scss" scoped>
.sms-code {
  padding: 17px 24px;
  font-size: 16px;
}

.right-text {
  border-radius: 18px;
  text-align: center;
  font-size: 14px;
  line-height: 28px;
}

.inStyle {
  width: 90px;
  height: 28px;
  background: #ffffff;
  color: #0784eb;
  border: 1px solid #0784eb;
}

.div-disabled {
  pointer-events: none;
  // background: #d8d8d8;
}
</style>
