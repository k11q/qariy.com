<template>
	<template v-if="chapters">
		<div
			v-for="(i, index) in chapters.suwar"
			:class="`flex flex-none gap-4 items-center justify-center pl-3 pr-6 h-11 cursor-default border-t-2 pb-0.5 ${
				i.id == currentPlayingId
					? 'bg-gradient-to-b from-neutral-800/90 to-neutral-800/40 text-[#89d666] border-neutral-800/30'
					: 'bg-neutral-600/40 even:bg-neutral-600/60 hover-hover:hover:bg-sky-200/80 hover-hover:hover:text-neutral-900 text-neutral-300 border-neutral-700/70'
			}`"
			@click="
				() => {
					i.id != currentPlayingId
						? playAudio(i.id)
						: '';
				}
			"
		>
			<div class="flex flex-none items-center">
				<p
					class="h-9 w-9 flex-none rounded-full flex items-center justify-center opacity-90 font-[320] text-neutral-500"
				>
					<Icon
						name="ion:volume-high"
						class="text-[#7ccf56]"
						v-if="i.id == currentPlayingId"
						size="1.75rem"
					/>
					{{
						i.id != currentPlayingId
							? i.id
							: ""
					}}
				</p>
			</div>
			<p class="flex-grow text-[17px] tracking-[0.005rem]">
				{{ i.name }}
			</p>
			<p
				:class="`w-20 flex-none text-right lining-nums tracking-wide ${
				i.id == currentPlayingId
					? ''
					: 'text-neutral-500'
			}`"
			>
				{{ formatTime(i.audio[0].duration) }}
			</p>
		</div>
	</template>
	<div
		class="z-[999] sticky bottom-0 border-t border-neutral-900/70 bg-gradient-to-b from-[#595959] to-[#505050] text-neutral-200"
		v-if="currentPlayingId || loading"
	>
		<div
			class="px-4 pb-4 pt-2.5 flex flex-row justify-between items-center text-lg tracking-[0.005rem]"
		>
			<div v-if="chapters || loading">
				<p :class="`${error ? 'text-red-500' : ''}`">
					{{
						error
							? "Error. Please select a different reciter."
							: loading
							? "loading..."
							: chapters.suwar[
									chapters.suwar.findIndex(
										(
											i
										) =>
											i.id ==
											currentPlayingId
									)
							  ].name
					}}
				</p>
				<p class="text-sm leading-none opacity-70">
					{{ currentQariData.name }}
				</p>
			</div>
			<div>
				<HeadlessSwitch
					v-model="autoplay"
					:class="
						autoplay
							? 'bg-[#6cbc46]'
							: 'bg-gradient-to-b from-neutral-600 to-neutral-700'
					"
					class="relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
				>
					<span class="sr-only">Autoplay</span>
					<span
						aria-hidden="true"
						:class="
							autoplay
								? 'translate-x-6'
								: 'translate-x-0'
						"
						class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-gradient-to-b from-neutral-100 to-neutral-200 shadow-sm ring-0 transition duration-400 ease-in-out"
					/>
				</HeadlessSwitch>
				<p class="text-xs opacity-70 leading-3">Autoplay</p>
			</div>
		</div>
		<div class="p-4 flex flex-col relative">
			<div
				class="grid grid-cols-9 items-center justify-center gap-3"
			>
				<p
					class="col-span-2 text-[15px] opacity-70 self-start lining-nums tracking-wide"
				>
					{{
						currentSeek
							? formatTime(
									currentSeek
							  )
							: "00:00"
					}}
				</p>
				<div
					class="flex col-span-5 items-center justify-center gap-2"
				>
					<div
						@click="
							() => {
								currentPlayingId
									? playPrevSurah(
											currentPlayingId
									  )
									: '';
							}
						"
						class="h-11 w-11 relative flex-none flex items-center justify-center rounded-full border-1 aspect-square hover-hover:hover:opacity-80 border-neutral-900/70 shadow-[0_1px_3px_0px_rgba(0,0,0,0.4)] hover-hover:hover:shadow-[0_2px_2px_0px_rgba(0,0,0,0.6)_inset] bg-gradient-to-b from-neutral-100/90 to-neutral-200/20 text-neutral-900"
					>
						<div class="-mt-[0.5px] flex">
							<Icon
								name="ion:md-skip-backward"
								size="1.25rem"
							/>
						</div>
					</div>
					<div
						@click="
							() => {
								pause
									? playAudio(
											currentPlayingId
									  )
									: pauseAudio();
							}
						"
						class="h-14 w-14 relative flex-none flex items-center justify-center rounded-full border-1 border-neutral-900/70 aspect-square shadow-[0_1px_3px_0_rgba(0,0,0,0.4)] hover-hover:hover:shadow-[0_2px_2px_0px_rgba(0,0,0,0.6)_inset] bg-gradient-to-b from-neutral-100/90 to-neutral-200/20 text-neutral-900 hover-hover:hover:opacity-80"
					>
						<div
							class="-mt-0.5 ml-[1px]"
							v-if="pause"
						>
							<Icon
								name="ion:md-play"
								size="1.875rem"
							/>
						</div>
						<div
							class="-mt-0.5"
							v-if="!pause"
						>
							<Icon
								name="ion:md-pause"
								size="1.875rem"
							/>
						</div>
					</div>
					<div
						@click="
							() => {
								currentPlayingId
									? playNextSurah(
											currentPlayingId
									  )
									: '';
							}
						"
						class="h-11 w-11 relative flex-none flex items-center justify-center rounded-full border-1 border-neutral-900/70 aspect-square shadow-[0_1px_3px_0_rgba(0,0,0,0.4)] hover-hover:hover:shadow-[0_2px_2px_0px_rgba(0,0,0,0.6)_inset] bg-gradient-to-b from-neutral-100/90 to-neutral-200/20 text-neutral-900 hover-hover:hover:opacity-80"
					>
						<div class="-mt-[0.5px] flex">
							<Icon
								name="ion:md-skip-forward"
								size="1.25rem"
							/>
						</div>
					</div>
				</div>
				<p
					class="col-span-2 text-right text-[15px] opacity-70 self-start lining-nums tracking-wide"
				>
					{{
						currentDuration
							? formatTime(
									currentDuration
							  )
							: "00:00"
					}}
				</p>
			</div>
			<div
				class="absolute left-0 top-0 -translate-y-1/2 right-0 flex items-center"
			>
				<div></div>
				<div
					class="relative bottom-0 h-2 hover-hover:hover:h-2 transition-all duration-75 w-full bg-gradient-to-t from-neutral-700/80 to-neutral-800/90 touch-none outline outline-1 outline-neutral-900/70"
				>
					<div
						v-if="sound && sound.duration()"
						class="absolute left-0 top-0 bottom-0 bg-[#82d85a] transition-all duration-75 touch-none"
						:style="`width: calc(${
							(currentSeek /
								currentDuration) *
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
					:max="currentDuration"
					:step="0.01"
					:value="currentSeek"
					@input="
						sound.seek($event.target.value);
						pause
							? (pause =
									false ||
									playAudio(
										currentPlayingId
									))
							: '';
					"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import { Howl } from "howler";
import chapters from "../db/chapters.json";

const currentQariData = useState("currentQariData");
const sound = useState("sound", () => null);
const currentPlayingId = useState("currentPlayingId", () => 0);
const pause = ref(false);
let animationFrameId;
let windowWidth = 100;
const loading = ref(false);
const currentDuration = ref(0);
const currentSeek = ref(0);
const playing = ref(false);
const error = useState("error");
const autoplay = ref(true);
onMounted(() => {
	windowWidth = window.innerWidth > 896 ? 896 : window.innerWidth;
});

function playAudio(id) {
	let num2 = id > 99 ? `${id}` : id > 9 ? `0${id}` : `00${id}`;
	loading.value = true;
	if (!sound.value || currentPlayingId.value != id) {
		console.log('playaudioin')
		if (sound.value) {
			sound.value.unload();
		}
		currentDuration.value = 0;
		currentSeek.value = 0;
		currentPlayingId.value = id;
		let url;
		if (currentQariData.value) {
			currentQariData.value = JSON.parse(
				localStorage.getItem("qari-store")
			);
			url = `${currentQariData.value.link}${num2}.mp3`;
		} else {
			url = `https://server10.mp3quran.net/ajm/${num2}.mp3`;
		}
		sound.value = new Howl({
			src: [url],
			html5: true,
			onload: () => {
				loading.value = false;
				pause.value = false;
				sound.value.play();
				playing.value = true;
			},
			preload: "metadata",
			onloaderror: () => {
				error.value = true;
			},
		});
	} else if(sound.value && pause.value){
		console.log("playing")
		sound.value.play()
		pause.value = false;
		playing.value = true;
	}
	loading.value = false;
}

watch(
	currentQariData,
	(curr, prev) => {
		if (prev && prev.id != curr.id) {
			if (currentPlayingId.value) {
				if (sound.value) {
					sound.value.unload();
					sound.value = null;
				}
				playAudio(currentPlayingId.value);
			}
		}
	},
	{ deep: true, immediate: true }
);

function pauseAudio() {
	if (sound.value) {
		pause.value = true;
		sound.value.pause();
	}
}

function playNextSurah(num) {
	if (num == 114) {
		playAudio(1);
	} else playAudio(num + 1);
}

function playPrevSurah(num) {
	if (num == 1) {
		playAudio(114);
	} else playAudio(num - 1);
}

function formatTime(time) {
	const minutes = Math.floor(time / 60);
	const seconds = Math.round(time % 60);
	return `${minutes > 9 ? `${minutes}` : `0${minutes}`}:${
		seconds > 9 ? `${seconds}` : `0${seconds}`
	}`;
}

function updateSliderPosition() {
	if (
		currentPlayingId.value &&
		sound.value &&
		playing.value &&
		!pause.value &&
		!loading.value
	) {
		currentSeek.value = sound.value.seek();
		if (sound.value.duration()) {
			if (!currentDuration.value) {
				currentDuration.value = sound.value.duration();
			}
		}
		if (
			currentSeek.value + 1 >= currentDuration.value &&
			currentDuration.value != 0 && autoplay.value
		) {
			loading.value = true;
			setTimeout(() => {
				playNextSurah(currentPlayingId.value);
			}, 1000);
			pause.value = false;
		}
	}
	loading.value ? (pause.value = true) : "";
	animationFrameId = requestAnimationFrame(updateSliderPosition);
}

onMounted(() => {
	updateSliderPosition();
});
</script>
