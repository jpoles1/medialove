<script lang="ts">
	import { onMount } from 'svelte';
	import Tv from './Tv.svelte';
    import Movie from './Movie.svelte';
	import Book from './Book.svelte';
	import { pb, type ViewData } from '$lib/pocketbase';
	import { toast } from '@zerodevx/svelte-toast';

    export let data;
    let media_type = data.media_type;
    let mid = data.mid;
    let mdbid = data.mdbid; 
    let media_data = data.media_data;
    let view_data: ViewData[];
    
    onMount(() => {
        console.log(media_type)
        pb.collection("viewing").getFullList({expand: "media", filter: `media="${mdbid}"` }).then((list) => {
            view_data = list as any
        }).catch((e) => {
            console.error(e)
            toast.push(`Error loading view data: ${e}`, { classes: ["error"] })
        })
    })
</script>

{#if media_type == "tv"}
<Tv {mid} {mdbid} {media_data} {view_data} />
{:else if media_type == "movie"}
<Movie {mid} {mdbid} {media_data} {view_data} />
{:else if media_type == "book"}
<Book {mid}  {mdbid} {media_data} {view_data} />
{/if}