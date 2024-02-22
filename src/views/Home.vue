<template>
    <div class="home">
        <Toolbar />

        <main>
            <!-- 左侧组件列表 -->
            <section class="left">
                <ComponentList />
                <RealTimeComponentList />
            </section>
            <!-- 中间画布 -->
            <section class="center">
                <div
                    class="content"
                    @drop="handleDrop"
                    @dragover="handleDragOver"
                    @mousedown="handleMouseDown"
                    @mouseup="deselectCurComponent"
                >
                    <Editor />
                </div>
            </section>
            <!-- 右侧属性列表 -->
            <section class="right">
                <el-tabs v-if="curComponent" v-model="activeName">
                    <el-tab-pane label="属性" name="attr">
                        <component :is="curComponent.component + 'Attr'" />
                    </el-tab-pane>
                    <el-tab-pane label="动画" name="animation" style="padding-top: 20px;">
                        <AnimationList />
                    </el-tab-pane>
                    <el-tab-pane label="事件" name="events" style="padding-top: 20px;">
                        <EventList />
                    </el-tab-pane>
                </el-tabs>
               <CanvasAttrBg v-else></CanvasAttrBg>
            </section>
        </main>
    </div>
</template>

<script>
import Editor from '@/components/Editor/index'
import ComponentList from '@/components/ComponentList' // 左侧列表组件
import AnimationList from '@/components/AnimationList' // 右侧动画列表
import EventList from '@/components/EventList' // 右侧事件列表
import componentList from '@/custom-component/component-list' // 左侧列表数据
import Toolbar from '@/components/Toolbar'
import { deepCopy } from '@/utils/utils'
import { mapState,mapActions } from 'vuex'
import generateID from '@/utils/generateID'
import { listenGlobalKeyDown } from '@/utils/shortcutKey'
import RealTimeComponentList from '@/components/RealTimeComponentList'
import CanvasAttr from '@/components/CanvasAttr'
import CanvasAttrBg from '@/components/CanvasAttrBg'
import { changeComponentSizeWithScale } from '@/utils/changeComponentsSizeWithScale'
import { setDefaultcomponentData } from '@/store/snapshot'
import eventBus from '@/utils/eventBus'

export default {
    components: { Editor, ComponentList, AnimationList, EventList, Toolbar, RealTimeComponentList, CanvasAttr, CanvasAttrBg },
    data() {
        return {
            activeName: 'attr',
            reSelectAnimateIndex: undefined,
			materialDialog: false, // 素材展示框
			materialList: [], // 页面素材列表
			selectElemtCode: '', // 选中的图片素材elemtCode
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
        }
    },
    computed: mapState([
        'componentData',
        'curComponent',
        'isClickComponent',
        'canvasStyleData',
        'editor',
		'containerStyle'
    ]),
    created() {
		// 监听父页面传来的参数
		let _this = this;
		window.addEventListener('message', function(e) {
			console.log('监听message' + JSON.stringify(e.data));
			//更新时传整个tempPageList，其实新增时传下也无所谓吧
			if (e.data.tempPageList) {
				console.log("999000999===",JSON.parse(e.data.tempPageList)[0].pageUrl)
				_this.GLOBAL.pageUrl = JSON.parse(e.data.tempPageList)[0].pageUrl;
				//-------更新页面素材------
				if(e.data.token){
					//放缓存中
					_this.GLOBAL.sessionId = e.data.token;
					localStorage.setItem('token',e.data.token)
				}
				console.log("_this.GLOBAL.sessionId===",_this.GLOBAL.sessionId)
				//-------更新页面素材------
				_this.restore(JSON.parse(e.data.tempPageList)[0])
			}
		})
        // 全局监听按键事件
        listenGlobalKeyDown()
    },
    methods: {
        restore(pageData) {
            // 用保存的数据恢复画布
			//从传来的 tempPageList 取数据
			if(pageData.pageData.canvasData){
				setDefaultcomponentData(pageData.pageData.canvasData)
				this.$store.commit('setComponentData', pageData.pageData.canvasData)
			}
         /* if (localStorage.getItem('canvasData')) {
                setDefaultcomponentData(JSON.parse(localStorage.getItem('canvasData')))
                this.$store.commit('setComponentData', JSON.parse(localStorage.getItem('canvasData')))
            } */
			console.log("canvasData===",pageData.pageData.canvasData)
			console.log("canvasStyle---",pageData.pageData.canvasStyle)
			console.log("materialList===",pageData.pageData.materialList)
			if(pageData.pageData.canvasStyle){
				this.$store.commit('setCanvasStyle', pageData.pageData.canvasStyle)
			}
			if(pageData.pageData.materialList){
				this.$store.state.materialList = pageData.pageData.materialList
			}
         /* if (localStorage.getItem('canvasStyle')) {
                this.$store.commit('setCanvasStyle', JSON.parse(localStorage.getItem('canvasStyle')))
            }
		 if(localStorage.getItem('materialList')){
			 this.$store.state.materialList = JSON.parse(localStorage.getItem('materialList'))
		 } */
		 // eventBus.$emit('closeClick', '111')
        },

        handleDrop(e) {
            e.preventDefault()
            e.stopPropagation()

            const index = e.dataTransfer.getData('index')
            const rectInfo = this.editor.getBoundingClientRect()
            if (index) {
                const component = deepCopy(componentList[index])
                component.style.top = e.clientY - rectInfo.y
                component.style.left = e.clientX - rectInfo.x
                component.id = generateID()

                // 根据画面比例修改组件样式比例
                changeComponentSizeWithScale(component)

                this.$store.commit('addComponent', { component })
                this.$store.commit('recordSnapshot')
            }
        },

        handleDragOver(e) {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'copy'
        },

        handleMouseDown(e) {
            e.stopPropagation()
            this.$store.commit('setClickComponentStatus', false)
            this.$store.commit('setInEditorStatus', true)
        },

        deselectCurComponent(e) {
            if (!this.isClickComponent) {
                this.$store.commit('setCurComponent', { component: null, index: null })
            }

            // 0 左击 1 滚轮 2 右击
            if (e.button != 2) {
                this.$store.commit('hideContextMenu')
            }
        },
		handleFileChange(e) {
		    const file = e.target.files[0]
		    if (!file.type.includes('image')) {
		        toast('只能插入图片')
		        return
		    }
		
		    const reader = new FileReader()
		    reader.onload = (res) => {
		        const fileResult = res.target.result
		        const img = new Image()
		        img.onload = () => {
		            const component = {
		                ...commonAttr,
		                id: generateID(),
		                component: 'VButton',
		                label: '背景图片',
		                icon: '',
		                propValue: {
							text:'按钮',
							aaa:fileResult,
		                },
		                style: {
		                    ...commonStyle,
		                    top: 0,
		                    left: 0,
		                    width: img.width,
		                    height: img.height,
		                },
		            }
		
		           /* // 根据画面比例修改组件样式比例 https://github.com/woai3c/visual-drag-demo/issues/91
		            changeComponentSizeWithScale(component)
		
		            this.$store.commit('addComponent', { component })
		            this.$store.commit('recordSnapshot')
		
		            // 修复重复上传同一文件，@change 不触发的问题
		            $('#input').setAttribute('type', 'text')
		            $('#input').setAttribute('type', 'file') */
		        }
		
		      //  img.src = fileResult
		    }
		
		   // reader.readAsDataURL(file)
		},
		handleAvatarSuccess(res, file) {
		   // this.setBackgroundimageUrl(URL.createObjectURL(file.raw));
			//store.commit('setBackgroundimageUrl',URL.createObjectURL(file.raw))
		},
		beforeAvatarUpload(file){
			//store.commit('setBackgroundimageUrl',URL.createObjectURL(file))
		    var reader  = new FileReader();
		    reader.addEventListener("load", function () {
		    }, false);
		    reader.readAsDataURL(file);
		
		}
    },
}
</script>

<style lang="scss">
.home {
    height: 100vh;
    background: #fff;

    main {
        height: calc(100% - 64px);
        position: relative;

        .left {
            position: absolute;
            height: 100%;
            width: 300px;
            left: 0;
            top: 0;
			background:#FFFFFF;
            & > div {
                overflow: auto;

                &:first-child {
                    border-bottom: 1px solid #ddd;
                }
            }
        }

        .right {
            position: absolute;
            height: 100%;
            width: 288px;
            right: 0;
            top: 0;
            .el-select {
                width: 100%;
            }
        }

        .center {
            margin-left: 280px;
            margin-right: 288px;
            background: #f5f5f5;
            height: 100%;
            overflow: auto;
            padding: 20px;

            .content {
                width: 100%;
                height: 100%;
                overflow: auto;
            }
        }
    }

    .placeholder {
        text-align: center;
        color: #333;
    }

    .global-attr {
        padding: 10px;
    }
	.avatar-uploader .el-upload {
	  border: 1px dashed #d9d9d9;
	  border-radius: 6px;
	  cursor: pointer;
	  position: relative;
	  overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
	  border-color: #409EFF;
	}
	.avatar-uploader-icon {
	  font-size: 28px;
	  color: #8c939d;
	  width: 80px;
	  height: 80px;
	  line-height: 80px;
	  text-align: center;
	}
	.avatar {
	  width: 200;
	  height: 360px;
	  display: block;
	}
}
</style>
