<template>
  <div class="flex flex-col justify-center items-center">

    <Head>
      <Title>Qariy</Title>
      <Meta name="description" content="A quran audio player" />
    </Head>
    <div class="px-5 py-3 flex items-center justify-between gap-2 bg-gradient-to-b from-neutral-600 to-neutral-700 border-b-2 border-b-neutral-800/70 w-full max-w-4xl">
      <div class="h-14 text-neutral-400 pl-3 pb-1" aria-label="qariy.com">
        <Logo />
      </div>
      <div class="relative flex items-center">
        <select name="qari" id="qari" :value="currentQariData
          ? currentQariData.id
          : 5
          " @change="changeQari($event)"
          class="focus:outline-none px-3 py-2 overflow-ellipsis bg-neutral-800/80 font-[420] hover:opacity-80 text-neutral-300 rounded-lg pr-8 indent-7 truncate">
          <option v-for="reciter in reciters.reciters.sort(
          (x, y) =>
            x.name.localeCompare(
              y.name
            )
        )" :value="reciter.id">
            {{ reciter.name }}
          </option>
        </select>
        <Icon name="lucide:user" class="absolute left-3 text-neutral-400" />
        <Icon name="lucide:chevron-down" class="absolute right-0 mr-4 text-neutral-400" />
      </div>
    </div>
    <div class="flex flex-col max-w-4xl w-full flex-grow bg-neutral-900">
      <QariList />
      <SurahList />
    </div>
    <div class="flex justify-center items-center px-8 py-5 flex-col gap-y-3 text-center  bg-neutral-800 w-full max-w-4xl">
      <p class="text-neutral-400 text-sm">Built by <a class="font-medium text-blue-500"
          href="https://github.com/k11q">Khairul Haaziq</a> with ❤️ from 🇲🇾. If you have
        any ideas to make this app better or
        interested in collaborating with me for any project, feel free to reach me at <a
          class="font-medium text-blue-500" href="mailto:khairul@haaziq.com">khairul@haaziq.com</a>.</p>
      <p class="text-neutral-400 text-sm"><a class="font-medium text-blue-500"
          href="https://github.com/khairulhaaziq/qariy.com">Github</a></p>
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
  surah_list: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114",
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
        surah_list: "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114",
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
  const moshaf = reciterData.moshaf[reciterData.moshaf.length - 1];
  const link = moshaf.server;
  const surah_list = moshaf.surah_list;
  currentQariData.value = {
    id: id,
    name: name,
    link: link,
    surah_list: surah_list,
  };
  storage = null;
  localStorage.setItem(
    "qari-store",
    JSON.stringify({
      id: id,
      name: name,
      link: link,
      surah_list: surah_list,
    })
  );
}

const { data: reciters } = await useAsyncData("reciters", async () =>
  $fetch("https://mp3quran.net/api/v3/reciters?language=eng")
);
</script>
