<template>
	<div>{{ state.text }}</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, watchEffect } from "vue";

export default defineComponent({
	name: 'loading',
	setup() {

		const state = reactive({
			text: '',
			array: ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'],
			t: 0,
			tIndex: 0,
		})

		onMounted(() => {

			state.t = window.setInterval(() => {
				state.text = state.array[state.tIndex % 13]
				state.tIndex === 13 ? state.tIndex = 0 : state.tIndex += 1
			}, 80)
		})

		onUnmounted(() => {
			clearInterval(state.t)
		})

		return { state }

	}
})
</script>

<style>

</style>