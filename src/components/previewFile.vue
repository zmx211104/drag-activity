<template>
  <div class="viewBox" v-show="isShow">
    <!-- pdf预览 -->
    <div class="wrap-pdf">
      <div class="pdf">
	  <div class="pdf-tab">
	    <div
	      class="btn-def"
	      @click.stop="prePage"><span>上一页</span>
	    </div>
	    <div
	      class="btn-def"
	      @click.stop="nextPage"><span>下一页</span>
	    </div>
	  </div>
	  <div style="text-align: center;">{{pageNum}}/{{pageTotalNum}}</div>
	  <div class="any-scroll-view">
	    <div ref="body">
	      <pdf
	        id="pdfPreview"
	        ref="pdf"
	        :src="pdfUrl"
	        :page="pageNum"
	        :rotate="pageRotate"
	        @password="password"
	        @progress="loadedRatio = $event"
	        @page-loaded="pageLoaded($event)"
	        @num-pages="pageTotalNum=$event"
	        @error="pdfError($event)"
	        @link-clicked="page = $event">
	      </pdf>
	    </div>
	  </div>
	</div>
      <!-- <pdf v-for="item in numPages" :key="item" :src="pdfSrc" :page="item"/> -->
    </div>
		<!-- 关闭按钮 -->
      <van-icon class="closeBtn" name="cross" @click="changeShow()" />
	</div>
</template>

<script>
import { ImagePreview } from 'vant'
import pdf from 'vue-pdf' 
export default {
  name: 'PreviewFile',
  components: {
    pdf
  },
  props: {
    isShow: {
        type: Boolean,
        default: false,
    },
	pdfUrl:{
		type: String,
		default: '',
	},
    type: {}
  },
  data() {
    return {
      numPages: 1,
      pdfSrc: 'https://yuac.aimsys.com.cn/mbankImages/openEccAgree.pdf',
      sheetNames: [],
      pageNum: 1,
      wsObj: {},
        pageTotalNum:1,
        pageRotate:0,
        // 加载进度
        loadedRatio:0,
        curPageNum:0,
    }
  },
  mounted(){
	   //this.pdfSrc = pdf.createLoadingTask(this.pdfUrl)
  },
  methods: {
    showFile(newVal) {
      console.log('----', newVal)
       this.pdfSrc = pdf.createLoadingTask(this.datas.newVal)
    },
    prePage(){
        var p = this.pageNum
        p = p>1?p-1:this.pageTotalNum
        this.pageNum = p
      },
      nextPage(){
        var p = this.pageNum
        p = p<this.pageTotalNum?p+1:1
        this.pageNum = p
      },
      password(updatePassword, reason) {
        updatePassword(prompt('password is "123456"'))
      },
      pageLoaded(e){
        this.curPageNum = e
      },
      pdfError(error){
        console.error(error)
      },
	  changeShow(){
		   this.$emit('changeState',false);
	  }
  }
}
</script>

<style lang="scss" scoped>
.excel-container {
  width: 100%;
}
table {
    display: table;
    border-collapse: collapse;
    box-sizing: border-box;
    border:  1px solid #929292;
    width: auto;height: auto;color: #333333;// 合并边框
    th,tr{
      white-space: nowrap;overflow: hidden;text-overflow: ellipsis;background: #ffffff;padding: 10px;border:1px solid #929292;
      td{
        font-weight: normal;
        text-align: center;
        border:1px solid #929292;
      }
    }
}
.tableBox {width: 100vw;height: calc(100vh - 44px);overflow: auto;
}// 表格边框
.pdf-tab {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    padding: 0 .4rem;
    -ms-flex-pack: justify;
    justify-content: space-between;
}
.pdf-tab .btn-def {
    border-radius: .2rem;
    font-size: 0.5rem;
    // height: 40px;
    margin-top: 40px;
    // width: 6.4rem;
    text-align: center;
    // line-height: 1.93333rem;
    background: #409eff;
    color: #fff;
    // margin-bottom: 1.26667rem;
}
.pdf-total {
    text-align: center;
    font-size: 1.45333rem;
}
.pdf-process, .pdf-total {
    text-align: center;
    font-size: 1.45333rem;
}
.pdf-num {
    margin-bottom: 1.2rem;
}

.pdf-box, .word-box, .table-box, .txt-box {
  width: 100vw;
  height: 100vh;
}
.viewBox {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #ffffff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  .closeBtn {
    position: absolute;
      top: 10px;
      right: 10px;
      z-index: 10;
      font-size: 24px;
  }
}
.any-scroll-view{
	height:300px;
	overflow:scroll
}
</style>