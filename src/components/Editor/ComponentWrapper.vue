<template>
    <div @click="onClick" @mouseenter="onMouseEnter">
        <component
            :is="config.component"
            v-if="config.component.startsWith('SVG')"
            ref="component"
            class="component"
            :style="getSVGStyle(config.style)"
            :prop-value="config.propValue"
            :element="config"
            :request="config.request"
            :linkage="config.linkage"
        />

        <component
            :is="config.component"
            v-else
            ref="component"
            class="component"
            :style="getStyle(config.style,[],2)"
            :prop-value="config.propValue"
            :element="config"
            :request="config.request"
            :linkage="config.linkage"
        />
    </div>
</template>

<script>
import { getStyle, getSVGStyle } from '@/utils/style'
import runAnimation from '@/utils/runAnimation'
import { mixins } from '@/utils/events'
import eventBus from '@/utils/eventBus'

export default {
    mixins: [mixins],
    props: {
        config: {
            type: Object,
            required: true,
            default: () => {},
        },
    },
    mounted() {
		console.log("this.config===",this.config)
		//runAnimation(this.$refs.component.$el, this.config.animations)
    },
    methods: {
        getStyle,
        getSVGStyle,

        onClick() {
            const events = this.config.events
			if(this.config.propValue.beforeKey=='1'){
				//需要先登录，判断是否登录，未登录则toast提示
				
			}
            Object.keys(events).forEach(event => {
                this[event](events[event])
            })
			// eventBus.$emit('showClick', this.config.id)
            eventBus.$emit('v-click', this.config.id)
        },

        onMouseEnter() {
            eventBus.$emit('v-hover', this.config.id)
        },
    },
}
</script>

<style lang="scss" scoped>
.component {
    position: absolute;
}
</style>
