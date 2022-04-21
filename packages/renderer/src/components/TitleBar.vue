<template>
	<div class="container">
		<div class="close round" @click="close()">
			<div class="close-svg">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
			</div>
		</div>
		<div class="mini round" @click="minimize()">
			<div class="mini-svg">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M400 288h-352c-17.69 0-32-14.32-32-32.01s14.31-31.99 32-31.99h352c17.69 0 32 14.3 32 31.99S417.7 288 400 288z"/></svg>
			</div>
		</div>
		<div class="max round">
			<!-- TODO 最大化图标 -->
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";

export default defineComponent({
	name: 'titleBar',
	setup() {

		// 通知上层组件 关闭应用
		const close: any = inject('close')

		// 通知上层组件 最小化应用
		const minimize: any = inject('minimize')
		
		return { close, minimize }

	}
})
</script>

<style lang="scss" scoped>
.container {
	width: 1350px;
	height: 38px;
	background-color: rgba($color: #f2f2f2, $alpha: .2);
	display: flex;
	justify-content: flex-start;
	align-items: center;
	// 设置可拖动
	-webkit-app-region: drag;
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
	.round {
		box-sizing: border-box;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		cursor: pointer;
		-webkit-app-region: no-drag;
	}
	.mini {
		margin-left: 6px;
		border: 1px solid #edc166;
		background-color: #ffbf2b;
		position: relative;
		&:hover {
			.mini-svg {
				opacity: 1;
			}
		}
		.mini-svg {
			width: 100%;
			height: 100%;
			position: relative;
			opacity: 0;
			transition: opacity .07s;
			svg {
				position: absolute;
				top: 1px;
				left: -2px;
				width: 18px;
				height: 12px;
			}
		}
	}
	.close {
		margin-left: 12px;
		border: 1px solid #e66256;
		background-color: #fd6458;
		text-align: center;
		line-height: 11px;
		&:hover {
			.close-svg {
				opacity: 1;
			}
		}
		.close-svg {
			width: 100%;
			height: 100%;
			position: relative;
			opacity: 0;
			transition: opacity .07s;
			svg {
				position: absolute;
				top: 1px;
				left: -2px;
				width: 18px;
				height: 12px;
			}
		}
	}
	.max {
		margin-left: 6px;
		border: 1px solid #5ec150;
		background-color: #24cc3d;
		cursor: not-allowed;
	}
}
</style>