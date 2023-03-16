<template>
	<template v-if="chapters">
		<div
			v-for="(i, index) in chapters.suwar"
			:class="`flex flex-none gap-6 items-center justify-center bg-neutral-900 px-6 py-3 cursor-default hover:bg-neutral-800 ${
				i.id == audioPlaying
					? 'opacity-60 bg-neutral-800'
					: ''
			}`"
			@click="()=>{i.id != audioPlaying ? handleFetch(i.id) : ''}"
		>
			<div class="flex flex-none">
				<p
					class="h-9 w-9 flex-none bg-neutral-700 rounded flex items-center justify-center opacity-70 text-[13px]"
				>
					{{ i.id }}
				</p>
			</div>
			<p class="flex-grow">
				{{ i.id != 80 ? i.name : "Abasa" }}
			</p>
		</div>
	</template>
	<div
		class="z-[999] sticky bottom-0 bg-neutral-800 border-t border-neutral-700"
		v-show="audioPlaying"
	>
		<div class="px-4 py-3 flex flex-row">
			<div v-if="chapters && audioPlaying">
				<p class="text-[11px] leading-4 opacity-70">
					Now playing:
				</p>
				<p>
					{{
						loading ? 'loading...' : audioPlaying != 80
							? chapters.suwar[
									chapters.suwar.findIndex(
										(
											i
										) =>
											i.id ==
											audioPlaying
									)
							  ].name
							: "Abasa"
					}}
				</p>
			</div>
		</div>
		<div class="p-4 flex flex-col relative">
			<div
				class="grid grid-cols-9 items-center justify-center gap-3"
				v-show="audioPlaying"
			>
				<p
					class="col-span-2 text-[13px] opacity-70 self-start"
				>
					{{
						parseFloat(
							(elapsedTime +
								seekValue) *
								0.01
						).toFixed(2)
					}}
				</p>
				<div
					class="flex col-span-5 items-center justify-center gap-4"
				>
					<div
						@click="
							() => {audioPlaying ? playPrevSurah(parseInt(audioPlaying)) : ''}
						"
						class="h-10 w-10 relative flex-none flex items-center justify-center rounded-full border border-neutral-700 aspect-square"
					>
						<div
							class="opacity-70 -mt-[0.5px] flex"
						>
							<Icon
								name="lucide:skip-back"
								size="1rem"
							/>
						</div>
					</div>
					<div
						@click="
							() => {
								pause
									? playAudio()
									: pauseAudio();
							}
						"
						class="h-14 w-14 relative flex-none flex items-center justify-center rounded-full border border-neutral-700 aspect-square"
					>
						<div
							class="-mt-0.5 ml-[1px]"
							v-if="pause"
						>
							<Icon
								name="lucide:play"
								size="1.5rem"
							/>
						</div>
						<div
							class="-mt-0.5"
							v-if="!pause"
						>
							<Icon
								name="lucide:pause"
								size="1.5rem"
							/>
						</div>
					</div>
					<div
						@click="
							() => {audioPlaying ? playNextSurah(parseInt(audioPlaying)) : ''}
						"
						class="h-10 w-10 relative flex-none flex items-center justify-center rounded-full border border-neutral-700 aspect-square"
					>
						<div
							class="opacity-70 -mt-[0.5px] flex"
						>
							<Icon
								name="lucide:skip-forward"
								size="1rem"
							/>
						</div>
					</div>
				</div>
				<p
					class="col-span-2 text-right text-[13px] opacity-70 self-start"
				>
					{{
						parseFloat(
							duration * 0.01
						).toFixed(2)
					}}
				</p>
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
			-->
			</div>
			<div
				class="absolute left-0 top-0 -translate-y-1/2 right-0 flex items-center"
			>
				<div></div>
				<div
					class="relative bottom-0 h-1 hover:h-2 transition-all duration-75 w-full bg-neutral-600 touch-none"
				>
					<div
						class="absolute left-0 top-0 bottom-0 bg-green-500 transition-all duration-75 touch-none"
						:style="`width: calc(${
							(elapsedTime /
								duration) *
							windowWidth
						}px)`"
					></div>
				</div>
				<input
					class="w-full absolute left-0 right-0 h-6 mb-1 opacity-0"
					type="range"
					id="seek"
					name="seek"
					min="0"
					:max="audioDuration"
					:step="0.01"
					:value="elapsedTime"
					@input="seek"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
let ctx;
const audio = ref();
let playSound;
const startTime = ref(0);
const pauseTime = ref(0);
const audioPlaying = ref("");
const elapsedTime = ref(0);
const pause = ref(false);
let animationFrameId;
const duration = ref(0);
let windowWidth = 100;
const loading = ref(false);
const audioDuration = computed(() => {
	return audio.value ? audio.value.duration : 0;
});
let seekValue = 0;
onMounted(() => {
	ctx = new AudioContext();
	windowWidth = window.innerWidth > 448 ? 448 : window.innerWidth;
});

function playback(api) {
	if (playSound) {
		playSound.stop();
	}
	if (api && audioPlaying.value != api) {
		startTime.value = 0;
		pauseTime.value = 0;
		elapsedTime.value = 0;
		seekValue = 0;
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
	loading.value = true;
	const api = `https://server10.mp3quran.net/ajm/${num2}.mp3`;
	await fetch(api)
		.then((data) => data.arrayBuffer())
		.then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
		.then((decodedAudio) => {
			audio.value = decodedAudio;
		});
	startTime.value = 0;
	elapsedTime.value = 0;
	loading.value = false;
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
		pauseTime.value = elapsedTime.value;
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

function playNextSurah(num) {
	if (num == 114) {
		handleFetch(1);
	} else handleFetch(num + 1);
}

function playPrevSurah(num) {
	if (num == 1) {
		handleFetch(114);
	} else handleFetch(num - 1);
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

function seek(event) {
	const newPosition =
		parseInt(event.target.value) +
		((parseFloat(event.target.value) % 1) * 100) / 60;
	console.log(newPosition);
	seekValue =
		newPosition -
		(ctx.currentTime - startTime.value + pauseTime.value);
	console.log(seekValue);
	if (audio.value) {
		playback();
	}
}

function updateSliderPosition() {
	if (playSound && audio.value && !pause.value && !loading.value) {
		elapsedTime.value =
			ctx.currentTime -
			startTime.value +
			pauseTime.value +
			seekValue;
		duration.value = audio.value.duration;
		console.log("playing");
		if (elapsedTime.value >= audio.value.duration) {
			playSound = null;
			audio.value = null;
			pauseTime.value = 0;
			audioPlaying.value = "";
			pause.value = false;
			seekValue = 0;
			playNextSurah(parseInt(audioPlaying.value))
			console.log("done");
		}
	}
	loading.value ? pause.value = true : ''

	animationFrameId = requestAnimationFrame(updateSliderPosition);
}

onMounted(() => {
	updateSliderPosition();
});
</script>
