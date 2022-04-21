<template>
    <div class="ring-container" :style="{ position: 'relative' }">
        <div class="circle-box-1" :style="{ clip: 'rect(0, ' + internalDiameter / 2 + 'px, ' + internalDiameter + 'px, ' + '0)' }">
            <div class="circle-1" 
                :style="{ 
                    border: width + 'px solid' + color, 
                    clip: 'rect(0, ' + internalDiameter + 'px, ' + internalDiameter + 'px, ' + internalDiameter / 2 + 'px)',
                    transform: 'rotate(' + state.angleLeft + 'deg)',
                }"
            ></div>
        </div>
        <div class="circle-box-2" :style="{ clip: 'rect(0, ' + internalDiameter + 'px, ' + internalDiameter + 'px, ' + internalDiameter / 2 + 'px)' }">
            <div class="circle-2" 
                :style="{
                    border: width + 'px solid' + color, 
                    clip: 'rect(0, ' + internalDiameter / 2 + 'px, ' + internalDiameter + 'px, ' + '0)',
                    transform: 'rotate(' + state.angleRight + 'deg)',
                }"
            ></div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
import { computed, reactive } from '@vue/runtime-core'
export default {
    name: 'ringLoading',
    props: {
        width: { type: Number, required: true },
        color: { type: String, required: true },
        percentage: { type: Number, required: true },
        internalDiameter: { type: Number, required: true }
    },
    setup(props) {
        
        const state = reactive({
            angleLeft: computed(() => props.percentage > 50 ? 180 : props.percentage * 3.6),
            angleRight: computed(() => props.percentage > 50 ? (props.percentage - 50) * 3.6 : 0)
        })

        return {
            state
        }

    }
}
</script>

<style lang="scss" scoped>
.ring-container {
    width: 100%;
    height: 100%;
    .circle-box-1 {
        position: absolute;
        width: 100%;
        height: 100%;
        .circle-1 {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-sizing: border-box;
        }
    }
    .circle-box-2 {
        position: absolute;
        width: 100%;
        height: 100%;
        .circle-2 {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-sizing: border-box;
        }
    }
}
</style>