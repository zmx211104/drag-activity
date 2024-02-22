<template>
    <div class="attr-container">
        <p class="title">画布属性</p>
        <el-form style="padding: 20px;">
            <el-form-item v-for="(key, index) in Object.keys(options)" :key="index" :label="options[key]">
                <el-color-picker v-if="isIncludesColor(key)" v-model="canvasStyleData[key]" show-alpha></el-color-picker>
				<div class="material" v-if="key=='backgroundImage'">
				  <div class="material-body" v-if="materialList.length>0">
					  <el-row class="material-row"  v-for="(item,index) in materialList" :key="item.id">
						<el-col>
						  <div class="material" style="margin-left:60px">
							<img class="material-image" :src="item.imgSrc">
							<div class="material-replace" @click="openMaterialDialog(item.elemtCode)">替换</div>
						  </div>
						</el-col>
					  </el-row>
					</div>
					<div class="material-body" v-else>
						<el-row class="material-row">
							<el-col style="width:100px;">
							  <div class="material" style="width:100px;height:100px;display:flex;align-items:center">
								<img class="material-image" style="height:50px;line-height:100px" :src="upLoadSrc" @click="openMaterialDialog()">
							  </div>
							</el-col>
						</el-row>
					</div>
				</div>
			</el-form-item>
        </el-form>
		<!-- 选择素材 -->
		   <el-dialog title="选择素材" :visible.sync="materialDialog" width="980px">
		     <el-form ref="refForm" label-width="120px">
		       <div class="m-body">
		         <el-form ref="refField" v-model="fieldData" style="margin: 10px;display:flex;align-items:center">
		             <el-form-item prop="materialName" style="width:30%">
						 <el-input v-model="fieldData.materialName" placeholder="素材名称" name="materialName"></el-input>
					 </el-form-item>
		             <el-form-item prop="fieldData.groupCode" style="width:30%;margin-left:10px">
						 <el-select placeholder="分组类型" v-model="groupCode">
							 <el-option
							       v-for="option in materialGroupData"
							       :key="option.key"
							       :label="option.value"
							       :value="option.key"
							     ></el-option>
						 </el-select>
					 </el-form-item>
		             <div class="btn-group">
		               <el-button-group>
		                 <el-button type="primary" icon="search" @click="searchFn">查询</el-button>
		                 <el-button type="primary" icon="edit" @click="resetFn" style="margin-left:20px">重置</el-button>
		               </el-button-group>
		             </div>
		         </el-form>
		         <div class="m-main">
		             <div class="material-body">
		                 <el-row>
		                   <el-col :span="8" v-for="(item,index) in items" :key="item.id" style="border: 1px dotted #888;">
		                     <div class="material">
		                       <div @click="selectMaterial(item,index)" :class="{ materActive:maActiveIndex === index }">
		                         <img v-if="false" class="material-image" :src="item.imgThumbNail">
		                         <img class="material-image" :src="item.imgsrc">
		                       </div>
		                     </div>
		                   </el-col>
		                 </el-row>
		               </div>
		         </div>
		       </div>
		       <!-- 分页 -->
		       <div class="block">
		         <el-pagination
		           @size-change="handleSizeChange"
		           @current-change="handleCurrentChange"
		           :current-page="currentPage"
		           :page-sizes="pageGroup"
		           :page-size="pageSize"
		           layout="total, sizes, prev, pager, next, jumper"
		           >
		         </el-pagination>
		       </div>
		       <div class="yu-grpButton">
		         <el-button icon="check" type="primary" @click="upadateMateria()">确定</el-button>
		         <el-button icon="yx-undo2" type="primary" @click="materialDialog = false">取消</el-button>
		       </div>
		     </el-form>
		   </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import http from '@/utils/http'
import {
  groupTree,
  findList,
} from '@/api/marketApi';

export default {
    data() {
        return {
            options: {
                backgroundColor: '背景色',
                backgroundImage: '背景图片',
            },
			 selectElemtCode: '', // 选中的图片素材elemtCode
			materialList: [], // 页面素材列表
			materialDialog: false, // 素材展示框
			materialGroupData: [], // 素材分组
			selectMaterialGroup: '', // 选择的分组
			items: [], // 素材items
			currentRow: 0, // 选中的分组
			maActiveIndex: '', // 素材选中效果
			selectMaImgSrc: '', // 选中图的图片src
			fieldData: {}, // 素材查询表单数据
			currentPage: 1, // 查询起始页
			pageSize: 12,
			pageGroup: [12, 16, 20],
			totalSize: '', // 总条数
			flag: true, // 定义刷新数组开关
			reflashArray: [] ,// iframe刷新数组
			materialName:'',
			groupCode:'',
			upLoadSrc:'https://yuac.aimsys.com.cn/actImages/material/upload.png'
        }
    },
    computed: mapState([
        'canvasStyleData',
    ]),
	mounted: function(){
		//从后台取之前配置的图片，或者从首页传过来
		//先默认给一个
		//this.materialList = [{"type": "背景", "imgSrc": "https://yuac.aimsys.com.cn/actImages/material/wKgkEGJY0B6AePRXAAGSRzlHWd8588.png", "moduleId": "YQHDSY0", "elemtCode": "913a5033598e11eca1d60242ac12180b"}];
		this.materialList =this.$store.state.materialList;
	},
    methods: {
        isIncludesColor(str) {
            return str.toLowerCase().includes('color')
        },
		 // 替换按钮-打开素材弹窗
		      openMaterialDialog: function (elemtCode) {
		        // 当前选中的tabIndex及selectElemtCode
		        this.selectElemtCode = elemtCode;
		        console.log('需要替换的图片素材：', this.selectElemtCode);
		        // 初始化选中的素材
		        this.materialDialog = true;
		        this.maActiveIndex = '';
		        // 获取组别
		        this.groupTree();
		        // 查询素材接口 先清空再查询
		        this.fieldData.groupCode = '';
		        this.findList(this.currentPage, this.pageSize, this);
		      },
		      // 获取素材组别
		      groupTree: function () {
		        var _this = this;
				groupTree({}).then((res) => {
				  console.log("res111===",res)
				  if (res.code == 0) {
				    var groupList = res.data;
					console.log("groupList---",groupList)
				    // 清空组别列表
				    _this.materialGroupData.splice(0, _this.materialGroupData.length);
				    // 加入组别信息
				    for (var i = 0; i < groupList.length; i++) {
				      _this.materialGroupData.push(groupList[i]);
				    }
				  }
				}).catch((err)=>{
					console.log("err===",err)
				});
				
		      },
		      // 设置item
		      setItems: function (response, items) {
		        // 清空数组数据
		        items.splice(0, items.length);
		        var _this = this;
		        var materialData = response.data.list;
		        for (var i = 0; i < materialData.length; i++) {
		          // 图片背景展示缩略图
		          // imgsrc为itmes中展示缩略图地址
		          // if (materialData[i].materialType == '1' || materialData[i].materialType == '4' || materialData[i].materialType == '6') {
		          let imgThumbNailId = materialData[i].imgThumbNailId || materialData[i].imgThumbnailId;
		          materialData[i].imgThumbNail = _this.fileIdToURL(imgThumbNailId);
		          materialData[i].uploadFile = _this.fileIdToURL(materialData[i].uploadFileId);
		          materialData[i].imgsrc = 'https://yuac.aimsys.com.cn' + '/yump-file/' + materialData[i].imgThumbNailId;
		          // }
		          items.push(materialData[i]);
		        }
		      },
		      // 获取图片URL
		      fileIdToURL: function (fileId) {
		       /* var url = yufp.settings.ssl ? 'https://' : 'http://';
		        url += yufp.settings.url;
		        url += backend.marketingService; */
				var url = 'https://yuac.aimsys.com.cn/yxcentersit/yu-ebank-marketing-service';
		        url += '/api/file/provider/newDownload?fileId=' + fileId;
		        return url;
		      },
		      // 搜索素材列表
		      searchFn: function () {
				this.fieldData.groupCode = this.groupCode;
		        this.remoteMaterial(this.fieldData);
		        this.currentPage = 1;
		      },
		      // 刷新素材列表
		      remoteMaterial: function (data) {
		        data.naturalSize = '';
				data.applyDpt = '';
				data.applyOrg = '500';
				console.log("this.fieldData===",this.fieldData)
		        this.findList(1, this.pageGroup[0], this);
		      },
		      // 重置素材列表
		      resetFn: function () {
		        this.$refs.refField.resetFields();
		      },
		      // 分页
		      handleSizeChange: function (val) {
		        var _this = this;
		        _this.pageSize = val;
		        _this.currentPage = 1;
		        _this.findList(_this.currentPage, _this.pageSize, _this);
		      },
		      handleCurrentChange: function (val) {
		        var _this = this;
		        _this.currentPage = val;
		        _this.findList(_this.currentPage, _this.pageSize, _this);
		      },
		      // 分页查询工具方法
		      findList: function (currentPage, pageSize, _this) {
		        _this.fieldData.applyDpt = '';
		        _this.fieldData.applyOrg = '500';
		        _this.fieldData.page = currentPage;
		        _this.fieldData.size = pageSize;
		        var param = {
		          condition: JSON.stringify(_this.fieldData),
		          page: currentPage,
		          size: pageSize
		        };
				findList(param).then((res) => {
				  console.log("res===",res)
				  if (res.code == 0) {
				    _this.totalSize = res.data.total;
				    _this.setItems(res, _this.items);
				  }
				});
		      },
		      // 选择素材
		      selectMaterial: function (item, index) {
		        this.maActiveIndex = index;
		        this.selectMaImgSrc = 'https://yuac.aimsys.com.cn' + '/yump-file/' + item.imgThumbNailId;
		        console.log('选中的素材', index + '--' + this.selectMaImgSrc);
		      },
		      // 更新图片素材
		      upadateMateria: function () {
		        let _this = this;
		        if (_this.maActiveIndex === '') {
		          this.$message({
		            type: 'warning',
		            message: '请选择想要添加的图片素材!'
		          });
		          return;
		        }
		        console.log('更新素材', this.selectElemtCode + '--' + this.selectMaImgSrc);
		        let that = this;
		       /* this.tempPageList[Number(that.tabIndex)].pageData.filter(function (item, index) {
		          if (item.elemtCode == that.selectElemtCode) {
		            // 获取下标，并替换参数
		            console.log('item的下标：' + index);
		            //更新
					
		          }
		        }); */
				 this.$store.commit('setCanvasImg', this.selectMaImgSrc)
				 this.materialList=[{"type": "背景", "imgSrc": this.selectMaImgSrc, "moduleId": "YQHDSY0", "elemtCode": this.selectElemtCode}];
				 this.$store.state.materialList =  [{"type": "背景", "imgSrc": this.selectMaImgSrc, "moduleId": "YQHDSY0", "elemtCode": this.selectElemtCode}];
		        this.materialDialog = false;
		      },
    },
}
</script>

<style lang="scss">
.attr-container {
    .title {
        text-align: center;
        margin-bottom: 10px;
        height: 40px;
        line-height: 40px;
        border-bottom: 2px solid #e4e7ed;
        font-size: 14px;
        font-weight: 500;
        color: #303133;
    }
	.m-main {
	  width: 930px;
	  height: 400px;
	  padding: 5px;
	  overflow: auto;
	  /* background-color: blue; */
	}
	
	.m-main::-webkit-scrollbar {
	  /*滚动条整体样式*/
	  width: 5px;
	  /*高宽分别对应横竖滚动条的尺寸*/
	}
	
	.m-main::-webkit-scrollbar-thumb {
	  /*滚动条里面小方块*/
	  border-radius: 4px;
	  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
	  background: rgba(0, 0, 0, 0.2);
	}
	
	.m-main::-webkit-scrollbar-track {
	  /*滚动条里面轨道*/
	  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
	  border-radius: 0;
	  background: rgba(0, 0, 0, 0.1);
	}
	
	.m-main .material-body .material{
	  position: relative;
	  padding: 5px;
	}
	.m-main .material-body .material .material-image{
	  height: 150px;
	  max-width: 100%;
	  margin: auto;
	  float: none;
	  display: block;
	}
	
	.m-main .material-body .material .materActive {
	  box-shadow: 0 0 0 4px #55aaff;
	  background-color: #ebf3ff;
	  /* color: #5999fc; */
	}
	
	.m-main .material-body .material .materActive:before {
	  content: '';
	  position: absolute;
	  right: 0;
	  bottom: 0;
	  border: 12px solid #5999fc;
	  border-top-color: transparent;
	  border-left-color: transparent;
	}
	
	.m-main .material-body .material .materActive:after {
	  content: '';
	  width: 4px;
	  height: 10px;
	  position: absolute;
	  right: 3px;
	  bottom: 3px;
	  border: 2px solid #fff;
	  border-top-color: transparent;
	  border-left-color: transparent;
	  transform: rotate(40deg);
	}
	
	/* table 滑动样式和选中样式修改 */
	.el-table--enable-row-hover .el-table__body tr:hover>td{
		background-color: transparent;
	}
	/* .material-body {
	  height: 400px;
	  overflow-y: auto;
	} */
	
	.material-bank {
	  height: 400px;
	  text-align: center;
	  padding: 100px;
	}
	.material-bank .bank-text{
	  font-size: 16px;
	  padding: 30px;
	  border: 1px dashed #979292;
	}
	
	 .material-body .material{
	  padding: 5px;
	  border: 1px dashed #888;
	  position: relative;
	}
	
	 .material-body .material:hover{
	  border: 1px dashed rgb(9, 111, 245);
	}
	
	.material-body .material .material-image{
	  height: 100px;
	  max-width: 100%;
	  float: none;
	  margin: auto;
	  display: block;
	}
	
	.material-body .material .material-replace{
	  position: absolute;
	  bottom: 4px;
	  right: 4px;
	  width: 40px;
	  height: 18px;
	  text-align: center;
	  cursor: pointer;
	  font-size: 12px;
	  background: rgba(0,0,0,.6);
	  color: #fff;
	  border-radius: 12px;
	  line-height:18px
	}
	
	.material-body .material-row{
	  margin-bottom: 10px;
	  padding: 10px;
	}
	
	.material-row .material-title{
	  font-size: 16px;
	  margin-top: 30px;
	}
	
	.material-row .material-size{
	  font-size: 14px;
	  color: #888;
	  margin-top: 10px;
	}
	
	/* 修改素材弹窗 */
	.m-body {
	  /* display: flex; */
	  width: 100%;
	  height: 500px;
	  margin-top: 20px;
	}
	
	.m-aside {
	  width: 200px;
	  height: 400px;
	  overflow: auto;
	  /* background-color: red; */
	}
	
	.m-aside::-webkit-scrollbar {
	  /*滚动条整体样式*/
	  width: 5px;
	  /*高宽分别对应横竖滚动条的尺寸*/
	}
	
	.m-aside::-webkit-scrollbar-thumb {
	  /*滚动条里面小方块*/
	  border-radius: 4px;
	  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
	  background: rgba(0, 0, 0, 0.2);
	}
	
	.m-aside::-webkit-scrollbar-track {
	  /*滚动条里面轨道*/
	  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
	  border-radius: 0;
	  background: rgba(0, 0, 0, 0.1);
	}
	.yu-grpButton{display: block; text-align: center;height: 35px;padding: 10px;}
	  .btn-group {
	   margin-left:20px;
	   margin-top:-20px
	  }
}
</style>
