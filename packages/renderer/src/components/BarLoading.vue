<template>
    <div :style="{
        width: width + 'px', 
        borderColor
    }" class="bar-container">
        <div :style="{
            background: typeof color == 'object' ? 'linear-gradient(to right, ' + color[0] + ', ' + color[1] + ')' : color,
            transform: 'scaleX(' + process / 100 + ')'
        }" class="bar"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
    name: 'BarLoading',
    props: {
        width: { type: Number, required: true },
        borderColor: { type: String, default: '#333' },
        color: { type: [ Array, String ], default: '#fff' },
        process: { type: Number, required: true }
    }
})
</script>

<style lang="scss" scoped>
.bar-container {
    border: 1px solid #333;
    height: 11px;
    border-radius: 6px;
    overflow: hidden;
    .bar {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        transform-origin: left center;
        transition: transform .15s ease-out;
    }
}
</style>