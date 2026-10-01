<template>
	<slot />
</template>

<script>
export default {
	name: 'AudioRegistry',
	data() {
		return { audios: new Set() }
	},
	provide() {
		return {
			audioRegistry: {
				register: this.register,
				unregister: this.unregister,
				pauseOthers: this.pauseOthers,
				// setVolumeAll: this.setVolumeAll,
			},
		}
	},
	methods: {
		register(el) { if (el) this.audios.add(el) },
		unregister(el) { if (el) this.audios.delete(el) },
		pauseOthers(current) {
			this.audios.forEach((el) => {
				if (el !== current && !el.paused) el.pause()
			})
		},
		// setVolumeAll(volume, except) {
		// 	this.audios.forEach((el) => {
		// 		if (el !== except) el.volume = volume
		// 	})
		// },
	},
}
</script>