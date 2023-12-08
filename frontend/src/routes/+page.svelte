<script lang="ts">
    import { SelectField, TextField } from 'svelte-ux';
    import { onMount } from 'svelte';
	import { debounce } from '$lib/debounce';
    let search_term = "interstellar";
    let search_media_type = "movie";
    let page = 1;

    let search_result = {} as any
    
    let media_types = ["Movie", "TV", "Book"].map((type) => ({ name: type, value: type.toLowerCase() }))
    
    let media_search = async () => {
        let request_body = { 
            search_term,
            media_type: search_media_type,
            page,
        }
        fetch("/api/search", { method: "POST", body: JSON.stringify(request_body), headers: { "Content-Type": "application/json" } })
            .then(async (res) => { 
                search_result = await res.json() 
                console.log(search_result)
            })
    }

    let debounce_media_search = debounce(media_search, 500, 500)

    onMount(() => {
        media_search()
    })
</script>

<h1>Media Search</h1>

<div class="flex flex-row space-x-2 bg-wh">
    <SelectField label="Media Type" options={media_types} bind:value={search_media_type} on:change={debounce_media_search} />
    <TextField label="Search" class="flex-grow" bind:value={search_term} on:change={debounce_media_search}/>
</div>

{#if search_result.results}
<div class="flex flex-row flex-wrap items-center justify-around">
    {#each Object.entries(search_result.results) as [key, value]}
        <div class="w-[240px]">
            <a href={value.url} class="w-[240px] flex justify-center items-center flex-col text-center ">
                <div class="w-[200px]">
                    {#if value.poster_path}
                        <img src="https://image.tmdb.org/t/p/w200/{value.poster_path}"/>
                    {:else}
                        <img src="/placeholder.png"/>
                    {/if}
                </div>
                <h2>{value.title}</h2>
            </a>
        </div>   
    {/each}
</div>
{/if}