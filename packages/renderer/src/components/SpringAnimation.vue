<template>
    <div :style="animationState.style" class="animation-box">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watchEffect, CSSProperties, onMounted } from 'vue';

export default defineComponent({
    name: 'springAnimation',
    props: {
        on: { required: true, type: Boolean, default: false },
        type: { required: true, type: String },
        range: { required: true, type: Array }
    },
    setup(props, { emit }) {

        const animationType = {
            'up': (distance: number): string => `translateY(-${distance}px)`,
            'down': (distance: number): string => `translateY(${distance}px)`,
            'left': (distance: number): string => `translateX(-${distance}px)`,
            'right': (distance: number): string => `translateX(${distance}px)`,
            'zoom-in': (scale: number): string => `scale(${scale})`,
            'zoom-out': (scale: number): string => `scale(${scale})`,
        }
        const E = 2.71828
        const animationState = reactive({
            startFlg: computed(() => props.on),
            motionRange: computed((): number[] => props.range as number[]),
            pointer: null as NodeJS.Timer | null,
            style: {} as CSSProperties,
            array: [] as number[]
        })
        const assembleStyle = (arg: number): CSSProperties => {
            return {
                transform: animationType[props.type as keyof typeof animationType](arg)
            }
        }
        watchEffect(() => {
            if(animationState.startFlg) {
                let i: number = 0
                animationState.pointer = setInterval(() => {
                    if(i === 100) {
                        animationState.pointer && clearInterval(animationState.pointer)
                        emit('animationEnd')
                    }
                    animationState.style = assembleStyle(animationState.array[i])
                    i += 1
                }, 10)
            } else {
                animationState.pointer && clearInterval(animationState.pointer)
                animationState.style = {
                    transition: 'transform .15s ease-in',
                    transfrom: animationType[props.type as keyof typeof animationType](animationState.motionRange[0])
                }
                
            }
        })
        // 
        const springWobbly = (arg: number): number => 
        -0.5 * Math.pow(E, (-6 * arg)) * (-2 * Math.pow(E, (6 * arg)) + Math.sin(12 * arg) + 2 * Math.cos(12 * arg))
        const lerp = (a: number, b: number, p: number): number => a + p * (b - a)
        const init = (): void => {
            for(let i = 0; i < 100; i++) {
                const tmp: number = lerp(animationState.motionRange[0], animationState.motionRange[1], springWobbly(i / 100))
                animationState.array.push(tmp)
            }
        }
        onMounted(init)
        return {
            animationState,
        }
    }
})



</script>

<style lang="scss" scoped>
.animation-box {
}

</style>