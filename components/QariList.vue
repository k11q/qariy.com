<template>
	<HeadlessDialog
		:open="openModal"
		@close="setOpenModal"
		class="relative z-50 text-white"
	>
		<div class="fixed inset-0 bg-black/30" aria-hidden="true" />

		<div class="fixed inset-0 flex items-center justify-center p-4">
			<HeadlessDialogPanel
				class="w-full max-w-md overflow-scroll max-h-screen bg-neutral-800"
			>
				<div v-for="reciter in reciters.reciters">
					{{ reciter.name }}
				</div>
                        <button>Hello</button>
			</HeadlessDialogPanel>
		</div>
	</HeadlessDialog>
</template>

<script setup>
const { data: reciters } = await useAsyncData("reciters", async () =>
	$fetch("https://mp3quran.net/api/v3/reciters?language=eng")
);

const openModal = useState("openModal", () => false);
const currentQari = useState("qari", () => 5);

function setOpenModal() {
	openModal.value = false;
}
</script>
