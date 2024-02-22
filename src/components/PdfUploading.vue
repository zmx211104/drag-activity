<template>
  <div class="PhotoUploading">
    <el-upload
      ref="upload"
      class="upload-demo"
      :action="actionsUrl"
	  :headers="myHeaders"
      :on-success="successFn"
      :before-upload="beforeUpload"
      :on-remove="beforeRemove"
      :on-change="onChangeFn"
      :file-list="fileLists"
      :on-error="onErrorFn"
      :accept="fileFormat"
      :limit="limitQuantity"
      drag
      multiple
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" style="font-size: 8px" slot="tip">
        格式 {{ strString }} 文档大小建议不超过 {{ sizeLimit }}MB
      </div>
    </el-upload>
  </div>
</template>

<script>
import { debounce } from "@/utils/index.js";
export default {
  data() {
    return {
      fileList: [], // 图片路径列表
      fileIdList: [], // 存储上传图片后的id值
      fileSize: 2097152, // 上传文件最大值 2MB=2097152  5MB=5242880
      limitList: [], // 选中的文件
      errList: [], //上传失败
      strString: "",
      fileLists: [], // 选中列表文件
	  myHeaders: {
		  Authorization: localStorage.getItem('token')
		},
    };
  },
  props: {
    // 上传路径 默认是系统设置里面的路径
    actionsUrl: {
      type: String,
      require: false,
      default:'',//上传路径
    },
    // 文件格式
    fileFormat: {
      type: String,
      require: false,
       default: ".jpg,.mp4,.gif,.pdf,.JPG,.MP4,.GIF,.PDF",
    },
    // 限制数量
    limitQuantity: {
      type: Number,
      require: false,
      default: 5,
    },
    // 文件大小限制
    sizeLimit: {
      type: Number,
      require: false,
      default: 1,
    },
  },
  mounted() {
  },
  created() {
    let str = this.fileFormat.split(",");
    this.strString = str.join(" ");
    let num = this.sizeLimit * 1024 * 1024;
    this.fileSize = num;
  },
  methods: {
    // 选中的图片
    onChangeFn(e, fileList) {
      this.limitList = fileList;
	  console.log("fileList===",fileList)
     // this.fileLists = this.fileLists.length ? this.fileLists : [];
      this.limitFn();
    },

    // 文件列表删除效果
    beforeRemove(file, fileList) {
      console.log(file, fileList);
      let list = fileList.filter((res) => {
        return res.name !== file.name;
      });
      this.fileLists = list;
    },

    // 文件上传之前的钩子
    beforeUpload(file) {
      console.log(file);
    },

    // 图片上传成功时的钩子
    successFn(response, file) {
		 this.$emit('fileId',file);
    },

    // 文件上传失败时的钩子
    onErrorFn(err, file) {
		console.log(888888,err)
      if (err.type === "error") {
        this.errList.push(file);
      }
      this.errorFn();
    },

    // 上传失败
    errorFn: debounce(function () {
      let errArr = [];
      this.errList.map((res) => {
        errArr.push(res.name);
      });
      this.$message({
        type: "error",
        message: `${errArr.map((res) => {
          return res + "/";
        })}上传失败`,
      });
    }, 500),

    limitFn: debounce(function () {
      let list = [],
        testList = [];
      // console.log(this.limitList);
      this.limitList.map((res) => {
        let name = res.name.substr(-4, 4);
        // 获取传递过来的文件要求
        let arr = this.fileFormat.split(",");
        let index = arr.map((item) => {
          return name !== item;
        });
        // 文件限制2MB和文件要求
        if (
          res.size < this.fileSize &&
          !index.every((items) => {
            return items === true;
          })
        ) {
          testList.push(res);
        } else {
          list.push(res);
        }
      });
      if (list.length)
        this.$message({
          type: "error",
          message: `只能上传  ${this.strString}  文件，每张不得超过 ${this.sizeLimit}MB,`,
        });
      // console.log(testList);
      this.fileLists = testList;
    }, 500),
  },
};
</script>

<style lang="scss" scoped>
.PhotoUploading {
  // width: 80%;
  ::v-deep .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }
}
</style>
