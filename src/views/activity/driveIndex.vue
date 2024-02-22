<template>
    <div ref="container" class="bg">
        <div class="canvas-container">
            <div
                class="canvas"
                :style="{
                    ...getCanvasStyle(canvasStyleData),
                    width: '100%',
                    height: '100vh',
					'background-image': 'url('  + canvasStyleData.backgroundImg + ')',
					'background-size':'100%',
					'background-repeat':'no-repeat'
                }"
            >
                <ComponentWrapper
                    v-for="(item, index) in copyData"
                    :key="index"
                    :config="item"
                />
				<RuleDialog />
            </div>
        </div>
    </div>
</template>

<script>
import { getStyle, getCanvasStyle } from '@/utils/style'
import { mapState } from 'vuex'
import ComponentWrapper from '@/components/Editor/ComponentWrapper'
import RuleDialog from '@/components/RuleDialog'
import { changeStyleWithScale } from '@/utils/translate'
import { toPng } from 'html-to-image'
import { deepCopy } from '@/utils/utils'
import activityConfig from '@/utils/mixins/activityConfig'
import pageStatistics from '@/utils/mixins/pageStatistics'

export default {
    components: { ComponentWrapper,RuleDialog },
    props: {
        isScreenshot: {
            type: Boolean,
            default: false,
        },
    },
	mixins: [activityConfig,pageStatistics],
    data() {
        return {
            copyData: [],
			eventType:'0',
			remark:'拉新活动首页访问'
        }
    },
    computed: mapState([
        'componentData',
        'canvasStyleData',
    ]),
    created() {
	  this.GLOBAL.disabled = false;
    },
    methods: {
        getStyle,
        getCanvasStyle,
        changeStyleWithScale,

        close() {
            this.$emit('close')
        },
		setCopy(){
			console.log("this.componentData===",this.componentData)
			this.$set(this, 'copyData', deepCopy(this.componentData)) 
		},
        htmlToImage() {
            toPng(this.$refs.container.querySelector('.canvas'))
            .then(dataUrl => {
                const a = document.createElement('a')
                a.setAttribute('download', 'screenshot')
                a.href = dataUrl
                a.click()
            })
            .catch(error => {
                console.error('oops, something went wrong!', error)
            })
            .finally(this.close)
        },
    },
}
</script>

<style lang="scss" scoped>
.bg {

    .canvas-container {
     /*   width: calc(100% - 40px);
       // height: calc(100% - 120px);
	   height: 660px;
        overflow: auto; */

        .canvas {
            background: #fff;
            position: relative;
            margin: auto;
        }
    }

    .close {
        position: absolute;
        right: 20px;
        top: 20px;
    }
}
</style>
