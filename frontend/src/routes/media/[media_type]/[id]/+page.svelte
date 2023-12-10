<script lang="ts">
	import { onMount } from 'svelte';
	import Tv from './Tv.svelte';
    import Movie from './Movie.svelte';
	import Book from './Book.svelte';
	import { pb, type ViewData } from '$lib/pocketbase';

    export let data;
    let media_type = data.media_type;
    let id = data.id;
    let media_data = data.media_data;
    let view_data: ViewData[];

    pb.collection("viewlist").getFullList({ media_type, id }).then((list) => {
        view_data = list
    })
</script>

{#if media_type == "tv"}
<Tv id={id} {media_data} {view_data} />
{:else if media_type == "movie"}
<Movie id={id} {media_data} {view_data} />
{:else if media_type == "book"}
<Book id={id} {media_data} {view_data} />
{/if}