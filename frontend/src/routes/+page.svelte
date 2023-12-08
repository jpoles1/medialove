<script lang="ts">
    import { onMount } from 'svelte';
    let search_result = {};
    onMount(() => {
        fetch("/api/search", { method: "POST", body: JSON.stringify({ query: "Interstellar" }), headers: { "Content-Type": "application/json" } })
            .then(async (res) => { 
                search_result = await res.json() 
                console.log(search_result)
            })
    })
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{JSON.stringify(search_result)}