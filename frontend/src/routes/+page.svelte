<script lang="ts">
    import { NumberStepper, SelectField, TextField } from 'svelte-ux';
    import { onMount } from 'svelte';
	import { debounce } from '$lib/debounce';
    //let search_term = "children of time";
    //let search_media_type = "book";

    let search_term = "scavengers reign";
    let search_media_type = "tv";

    let page = 1;
    let max_pages = 1;

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
                max_pages = search_result.total_pages || 1
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
<div class="flex flex-row flex-wrap items-stretch justify-around space-x-2 space-y-2">
    {#each Object.entries(search_result.results) as [key, value]}
        <div class="p-2 rounded shadow-md">
            <a href="/media/{search_media_type}/{value.id}" class="w-[200px] flex justify-center items-center flex-col text-center">
                <div class="w-[200px]">
                    {#if value.poster_path}
                        <img src="https://image.tmdb.org/t/p/w200/{value.poster_path}" onerror="this.onerror=null;this.src='/placeholder.png';"/>
                    {:else}
                        <img src="/placeholder.png"/>
                    {/if}
                </div>
                <h2>{value.title || value.name}</h2>
                Score {value.vote_average}/10 <span class="italic text-xs">({value.vote_count} votes)</span>
            </a>
        </div>
    {/each}
</div>
<hr class="my-4">
<div class="flex flex-row items-center justify-center my-6">
    Page &nbsp; <NumberStepper bind:value={page} on:change={debounce_media_search} min={1} max={max_pages}/> &nbsp; of {max_pages}
</div>
{/if}

{#if search_result.docs}
<div class="flex flex-row flex-wrap items-stretch justify-around space-x-2 space-y-2">
    {#each Object.entries(search_result.docs) as [key, value]}
        <div class="p-2 rounded shadow-md">
            <a href={value.url} class="w-[200px] flex justify-center items-center flex-col text-center">
                <div class="w-[200px]">
                    {#if value.cover_edition_key}
                        <img src="https://covers.openlibrary.org/a/id/{value.cover_i}-L.jpg?default=false" onerror="this.onerror=null;this.src='/placeholder.png';"/>
                    {:else}
                        <img src="/placeholder.png"/>
                    {/if}
                </div>
                <h2>{value.title}</h2>
                {#if value.author_name}
                    <span class="italic text-sm">{value.author_name.join(", ")}</span>
                {/if}
                <span class="text-sm">Score {value.ratings_average || "?"}/5</span><span class="italic text-xs">({value.ratings_count || 0} votes)</span>
            </a>
        </div>
    {/each}
</div>
<hr class="my-4">
<div class="flex flex-row items-center justify-center my-6">
    Page &nbsp; <NumberStepper bind:value={page} on:change={debounce_media_search} min={1} max={max_pages}/> &nbsp; of {max_pages}
</div>
{/if}