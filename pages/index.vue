<template>
	<div class="flex flex-col justify-center items-center">
		<div
			class="h-60 px-4 py-6 flex items-end justify-between bg-neutral-800 w-full max-w-md"
		>
			<p class="text-3xl font-semibold">Qari</p>
				<select
					name="qari"
					id="qari"
					:value="reciterId"
					@change="changeQari($event)"
					class="bg-transparent focus:outline-none px-1 py-2 w-2/5 overflow-ellipsis"
				>
					<option
						v-for="reciter in (reciters.reciters).sort((x, y)=>x.name.localeCompare(y.name))"
						:value="reciter.id"
					>
						{{ reciter.name }}
					</option>
				</select>
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
const reciterId = ref(5)

let storage;
onMounted(() => {
	if (localStorage.getItem("qari-store")) {
		currentQari.value = JSON.parse(
			localStorage.getItem("qari-store")
		);
		const name = currentQari.value.name;
		const id = currentQari.value.id;
		reciterId.value = id
		const link = currentQari.value.link;
		const theDefault = {
			name: name,
			id: id,
			link: link,
		};
		//storage = useStorage("qari-store", theDefault);
	} else {
		localStorage.setItem("qari-store", JSON.stringify({
			id: 5,
			name: "AlAjmy",
			link: "https://server10.mp3quran.net/ajm/",
		}));
	}
});

function changeQari(event) {
	if (!reciters.value) {
		return;
	}
	const id = event.target.value;
	const reciterData = reciters.value.reciters.find((i) => i.id == id);
	console.log(reciterData);
	const name = reciterData.name;
	const link = reciterData.moshaf[reciterData.moshaf.length-1].server;
	storage = null;
	localStorage.setItem("qari-store", JSON.stringify({
		id: id,
		name: name,
		link: link,
	}));
}

const { data: reciters } = await useAsyncData("reciters", async () =>
	$fetch("https://mp3quran.net/api/v3/reciters?language=eng")
);
</script>
