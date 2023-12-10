<script lang="ts">
	import { onMount } from 'svelte';
	import Tv from './Tv.svelte';
    import Movie from './Movie.svelte';
	import Book from './Book.svelte';
	import { pb, type ViewData } from '$lib/pocketbase';
	import { toast } from '@zerodevx/svelte-toast';

    export let data;
    let media_type = data.media_type;
    let id = data.id;
    let media_data = data.media_data;
    let view_data: ViewData[];
    
    onMount(() => {
        console.log(media_type)
        pb.collection("viewlist").getFullList({filter: `media_type="${media_type}" && mid="${id}"` }).then((list) => {
            view_data = list as any
        }).catch((e) => {
            console.error(e)
            toast.push(`Error loading view data: ${e}`, { classes: ["error"] })
        })
    })
</script>

{#if media_type == "tv"}
<Tv {id} {media_data} {view_data} />
{:else if media_type == "movie"}
<Movie {id} {media_data} {view_data} />
{:else if media_type == "book"}
<Book {id} {media_data} {view_data} />
{/if}