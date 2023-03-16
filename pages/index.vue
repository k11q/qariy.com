<template>
	<div class="flex flex-col justify-center items-center">
		<div
			class="h-60 px-4 py-6 flex items-end justify-between bg-neutral-800 w-full max-w-md"
		>
			<p class="text-3xl font-semibold">Qari</p>
			<button
				@click="openModal = !openModal"
			>
				{{ currentQari.name }}
			</button>
		</div>
		<div
			class="flex flex-col max-w-md w-full flex-grow bg-neutral-900"
		>
			<QariList />
			<SurahList />
		</div>
	</div>
</template>

<script setup>
const openModal = useState("openModal");
const currentQari = useState("currentQari");

await useFetch("https://mp3quran.net/api/v3/reciters?language=eng", {
	onResponse({ request, response, options }) {
		currentQari.value = response._data.reciters.filter(
			(i) => i.id == 5
		)[0];
	},
});
</script>
