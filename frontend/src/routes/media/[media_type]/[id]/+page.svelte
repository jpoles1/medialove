<script lang="ts">
	import { onMount } from 'svelte';
	import Tv from './Tv.svelte';
    import Movie from './Movie.svelte';
	import Book from './Book.svelte';

    export let data;
    let media_type = data.media_type;
    let id = data.id;
    let media_data = data.media_data;

</script>

{#if media_type == "tv"}
<Tv id={id} {media_data} />
{:else if media_type == "movie"}
<Movie id={id} {media_data} />
{:else if media_type == "book"}
<Book id={id} {media_data} />
{/if}