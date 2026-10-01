<template>
	<audio
		ref="audio"
		controls
		:src="src"
		class="w-full rounded-2xl bg-mist-950"
		@play="onPlay"
		@volumechange="onVolumeChange"
	/>
</template>

<script>
export default {
	name: 'AudioPlayer',
	props: {
		src: { type: String, required: true },
	},
	inject: ['audioRegistry'],
	mounted() {
		this.audioRegistry.register(this.$refs.audio)
		this.applySavedVolume()
	},
	beforeUnmount() {
		this.audioRegistry.unregister(this.$refs.audio)
	},
	methods: {
		applySavedVolume() {
			const saved = localStorage.getItem('audioVolume')
			if (saved !== null) {
				const v = parseFloat(saved)
				if (!isNaN(v) && v >= 0 && v <= 1) {
					this.$refs.audio.volume = v
				}
			}
		},
		onVolumeChange(e) {
			const v = e.currentTarget.volume
			localStorage.setItem('audioVolume', String(v))
			this.audioRegistry.setVolumeAll(v, e.currentTarget)
		},
		onPlay(e) {
			this.audioRegistry.pauseOthers(e.currentTarget)
			this.applySavedVolume()
		},
	},
}
</script>