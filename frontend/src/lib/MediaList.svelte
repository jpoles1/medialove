<script lang="ts">
	import { onMount } from "svelte";
	import { pb } from "./pocketbase";
    onMount(() => {
        pb.collection("medialist").getFullList()
    })
</script>

