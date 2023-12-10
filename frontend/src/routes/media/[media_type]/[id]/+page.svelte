<script lang="ts">
	import { onMount } from 'svelte';
	import Tv from './tv.svelte';

    export let data;
    let media_type = data.media_type;
    let id = data.id;
    let media_data = data.media_data;

</script>

Media Type: {media_type}
ID: {id}

{#if media_type == "tv"}
<Tv id={id} {media_data} />

{:else if media_type == "movie"}

{:else if media_type == "book"}

{/if}