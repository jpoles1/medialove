<script lang="ts">
	import { onMount } from "svelte";
	import { pb } from "./pocketbase";

    let lists = [];

    onMount(() => {
        lists = await pb.collection("medialist").getFullList()
    })
</script>