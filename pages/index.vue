<template>
	<div class="flex flex-col justify-center items-center">
		<Head>
			<Title>Qariy</Title>
			<Meta
				name="description"
				content="A quran audio player"
			/>
		</Head>
		<div class="px-5 py-3 flex items-center justify-between gap-2 bg-neutral-600 w-full max-w-4xl"
		>
      <div class="h-14 text-neutral-400 pl-3 pb-1" aria-label="qariy.com">
      <Logo />
    </div>
			<div class="relative flex items-center">
				<select
					name="qari"
					id="qari"
					:value="
						currentQariData
							? currentQariData.id
							: 5
					"
					@change="changeQari($event)"
					class="focus:outline-none px-3 py-2 overflow-ellipsis bg-neutral-800/80 font-[420] hover:opacity-80 text-neutral-300 rounded-lg pr-8 indent-7 truncate"
				>
					<option
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
        <Icon name="lucide:user" class="absolute left-3 text-neutral-400" />
				<Icon
					name="lucide:chevron-down"
					class="absolute right-0 mr-4 text-neutral-400"
				/>
			</div>
		</div>
		<div
			class="flex flex-col max-w-4xl w-full flex-grow bg-neutral-900"
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
