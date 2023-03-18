<template>
	<div class="flex flex-col justify-center items-center">
		<Head>
			<Title>Qariy</Title>
			<Meta
				name="description"
				content="A quran audio player"
			/>
		</Head>
		<div
			class="h-52 px-5 py-5 flex flex-col justify-end items-start gap-4 bg-neutral-800 w-full max-w-lg"
		>
			<p class="text-3xl font-semibold ml-3">Qariy</p>
			<div class="relative w-full flex items-center">
				<select
					name="qari"
					id="qari"
					:value="
						currentQariData
							? currentQariData.id
							: 5
					"
					@change="changeQari($event)"
					class="focus:outline-none px-3 py-3 w-full overflow-ellipsis bg-gradient-to-b from-neutral-600 to-neutral-700 hover:opacity-80 border-2 border-neutral-900/70 rounded-md"
				>
					<option
						class="bg-neutral-900"
						v-for="reciter in reciters.reciters.sort(
							(x, y) =>
								x.name.localeCompare(
									y.name
								)
						)"
						:value="reciter.id"
					>
						{{ reciter.name }}
					</option>
				</select>
				<Icon
					name="lucide:chevron-down"
					class="absolute right-0 mr-4"
				/>
			</div>
		</div>
		<div
			class="flex flex-col max-w-lg w-full flex-grow bg-neutral-900"
		>
			<QariList />
			<SurahList />
		</div>
	</div>
</template>

<style>
select::-ms-expand {
	display: none;
}

select {
	-webkit-appearance: none;
	-moz-appearance: none;
	text-indent: 1px;
	text-overflow: "";
}
</style>

<script setup>
const openModal = useState("openModal");
const currentQariData = useState("currentQariData", () => null);
currentQariData.value = {
	id: 5,
	name: "Ahmad Al-Ajmy",
	link: "https://server10.mp3quran.net/ajm/",
};
const error = useState("error", () => false);

let storage;
onMounted(() => {
	if (localStorage.getItem("qari-store")) {
		currentQariData.value = JSON.parse(
			localStorage.getItem("qari-store")
		);
	} else {
		localStorage.setItem(
			"qari-store",
			JSON.stringify({
				id: 5,
				name: "Ahmad Al-Ajmy",
				link: "https://server10.mp3quran.net/ajm/",
			})
		);
	}
});

function changeQari(event) {
	if (error.value) {
		error.value = false;
	}
	if (!reciters.value) {
		return;
	}
	const id = event.target.value;
	const reciterData = reciters.value.reciters.find((i) => i.id == id);
	const name = reciterData.name;
	const link = reciterData.moshaf[reciterData.moshaf.length - 1].server;
	currentQariData.value = {
		id: id,
		name: name,
		link: link,
	};
	storage = null;
	localStorage.setItem(
		"qari-store",
		JSON.stringify({
			id: id,
			name: name,
			link: link,
		})
	);
}

const { data: reciters } = await useAsyncData("reciters", async () =>
	$fetch("https://mp3quran.net/api/v3/reciters?language=eng")
);
</script>
