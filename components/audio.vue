<template>
	<div
		v-for="(i, index) in chapters.suwar"
		class="flex flex-none items-center justify-center bg-neutral-900 px-6 py-4 cursor-default hover:bg-neutral-800"
		@click="handleFetch(i.id)"
	>
		<p class="w-16">{{ i.id }}</p>
		<p class="flex-grow">{{ i.id != 80 ? i.name : "Abasa" }}</p>
	</div>
	<div class="z-[999] sticky bottom-0 bg-neutral-800">
		<div class="p-4 flex flex-col">
		<p>Now playing: {{chapters.suwar[chapters.suwar.findIndex(i => i.id == audioPlaying)].name}}</p>
		
		<div class="flex items-center justify-center gap-3" v-show="audioPlaying">
			<div
				@click="
					() => {
						pause
							? playAudio()
							: pauseAudio();
					}
				"
				class="h-10 w-10 flex-none flex items-center justify-center rounded-full border border-neutral-700 aspect-square"
			>
				<span class="opacity-70"
					><Icon name="lucide:skip-back" size="1rem"
				/></span>
			</div>
			<div
				@click="
					() => {
						pause
							? playAudio()
							: pauseAudio();
					}
				"
				class="h-14 w-14 flex-none flex items-center justify-center rounded-full border border-neutral-700 aspect-square"
			>
				<span v-if="pause"
					><Icon name="lucide:play" size="1.5rem"
				/></span>
				<span v-if="!pause"
					><Icon
						name="lucide:pause"
						size="1.5rem"
				/></span>
			</div>
			<div
				@click="
					() => {
						pause
							? playAudio()
							: pauseAudio();
					}
				"
				class="h-10 w-10 flex-none flex items-center justify-center rounded-full border border-neutral-700 aspect-square"
			>
				<span class="opacity-70"
					><Icon name="lucide:skip-forward" size="1rem"
				/></span>
			</div>
			<!--
			<button @click="forward">Forward 10s</button>
			<button @click="backward">Backward 10s</button>
			<div>
				<label for="volume">Volume:</label>
				<input
					type="range"
					id="volume"
					name="volume"
					min="0"
					max="1"
					step="0.1"
					@input="changeVolume"
				/>
			</div>
			<div>
				<label for="seek">Seek:</label>
				<input
					type="range"
					id="seek"
					name="seek"
					min="0"
					:max="audioDuration"
					:step="1"
					:value="sliderValue"
					@input="seek"
				/>
			</div>
			-->
		</div>
	</div>
	</div>
</template>

<script setup>
const ctx = new AudioContext();
const audio = ref();
let playSound;
const startTime = ref(0);
const pauseTime = ref(0);
let audioPlaying = ref("");
const elapsedTime = ref(0);
const pause = ref(false);
let animationFrameId;
const duration = ref(0);

function playback(api) {
	if (playSound) {
		playSound.stop();
	}
	if (api && audioPlaying.value != api) {
		startTime.value = 0;
		pauseTime.value = 0;
		elapsedTime.value = 0;
		audioPlaying.value = api;
	}
	playSound = ctx.createBufferSource();
	playSound.buffer = audio.value;
	playSound.connect(ctx.destination);
	const offset = elapsedTime.value;
	startTime.value = ctx.currentTime;
	playSound.start(0, offset);
	pause.value = false;
}

const { data: chapters } = await useAsyncData("chapters", async () =>
	$fetch("https://mp3quran.net/api/v3/suwar?language=eng")
);

async function handleFetch(num) {
	let num2 = num > 99 ? `${num}` : num > 9 ? `0${num}` : `00${num}`;
	const api = `https://server11.mp3quran.net/yasser/${num2}.mp3`;
	await fetch(api)
		.then((data) => data.arrayBuffer())
		.then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
		.then((decodedAudio) => {
			audio.value = decodedAudio;
		});
	startTime.value = 0;
	elapsedTime.value = 0;
	playback(`${num}`);
}

function playAudio() {
	if (audio.value) {
		playback();
	}
}

function pauseAudio() {
	if (playSound) {
		playSound.stop();
		pauseTime.value += elapsedTime.value;
		pause.value = true;
	}
}

function forward() {
	if (ctx && audio.value) {
		ctx.currentTime = Math.min(
			ctx.currentTime + 10,
			audio.value.duration
		);
		playback();
	}
}

function backward() {
	if (ctx && audio.value) {
		ctx.currentTime = Math.max(ctx.currentTime - 10, 0);
		playback();
	}
}

function changeVolume(event) {
	if (ctx) {
		ctx.destination.channelInterpretation = event.target.value;
	}
}

const audioDuration = computed(() => {
	return audio.value ? audio.value.duration : 0;
});

const sliderValue = computed(() => {
	return elapsedTime.value;
});

function seek(event) {
	const newPosition = parseFloat(event.target.value);
	elapsedTime.value = newPosition;
	if (audio.value) {
		playback();
	}
}

function updateSliderPosition() {
	if (playSound && audio.value && !pause.value) {
		elapsedTime.value =
			ctx.currentTime - startTime.value + pauseTime.value;
		duration.value = audio.value.duration;
		console.log("playing");
		if (elapsedTime.value >= audio.value.duration) {
			playSound = null;
			audio.value = null;
			pauseTime.value = 0;
			audioPlaying.value = "";
			pause.value = false;
			console.log("done");
		}
	}

	animationFrameId = requestAnimationFrame(updateSliderPosition);
}

onMounted(() => {
	updateSliderPosition();
});
</script>
