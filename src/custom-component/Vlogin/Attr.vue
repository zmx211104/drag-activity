<template>
    <div class="attr-list">
        <CommonAttr></CommonAttr>
		<el-form>
			<el-form-item label="用户协议上传">
				<div class="material">
				<div class="UploadBox">
				      <PdfUploading
					    actionsUrl="https://yuac.aimsys.com.cn/yxcentersit/yu-ebank-resource-service/api/file/provider/uploadfile"
				        @fileId="fileListFn"
				        :is-width="'80%'"
				        :is-true="istrue"
				        :up-loads="upLoads"
				        :limitQuantity="1"
				        @disabledBtn="disFn"
				        file-format=".pdf,.PDF"
				      />
				    </div>
				</div>
			</el-form-item>
		</el-form>
		<el-form>
		    <el-form-item label="按钮文字">
		        <el-input v-model="curComponent.propValue.btnText" type="text" />
		    </el-form-item>
			<el-form-item label="按钮文字字号">
			    <el-input v-model="curComponent.propValue.fontSize" type="text" />
			</el-form-item>
			<el-form-item label="按钮文字字重">
			    <el-input v-model="curComponent.propValue.fontWeight" type="text" />
			</el-form-item>
			<el-form-item label="按钮宽度">
			    <el-input v-model="curComponent.propValue.width" type="text" />
			</el-form-item>
			<el-form-item label="按钮高度">
			    <el-input v-model="curComponent.propValue.height" type="text" />
			</el-form-item>
			<el-form-item label="按钮背景颜色">
				<el-color-picker  v-model="curComponent.propValue.backgroundColor" show-alpha></el-color-picker>
			</el-form-item>
			<el-form-item label="按钮边框颜色">
				<el-color-picker  v-model="curComponent.propValue.borderColor" show-alpha></el-color-picker>
			</el-form-item>
			<el-form-item label="按钮文字颜色">
				<el-color-picker  v-model="curComponent.propValue.color" show-alpha></el-color-picker>
			</el-form-item>
			<el-form-item label="按钮圆角值">
				<el-input v-model="curComponent.propValue.borderRadius" type="text" />
			</el-form-item>
			<el-form-item label="登录成功跳转链接">
				<el-input v-model="curComponent.propValue.linkUrl" type="text" />
			</el-form-item>
		</el-form>
    </div>
</template>

<script>
import CommonAttr from '@/custom-component/common/CommonAttr.vue'
import PdfUploading from "@/components/PdfUploading";
export default {
    components: { CommonAttr ,PdfUploading},
    computed: {
        curComponent() {
            return this.$store.state.curComponent
        },
    },
	data() {
	    return {
	       istrue:false,
	       upLoads:''
	    }
	},
	methods:{
		 disFn(res) {
		      // console.log(res);
		      this.disisTrue = res;
		    },
		    // 图片上传返回的列表
		    fileListFn(fileList) {
				console.log("fileList===",fileList)
		      this.fileList = fileList;
			  this.curComponent.propValue.pdfUrl = 'https://yuac.aimsys.com.cn/yump-file/' + fileList.response.data.fullPath;
		       this.curComponent.propValue.pdfName = fileList.name;
		    },
		  },
	}
</script>
