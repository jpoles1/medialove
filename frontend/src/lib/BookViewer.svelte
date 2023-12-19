<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte";
	import { pb, type MediaID, type MediaFile, uaccount } from "./pocketbase";
	import { Button, Input } from "svelte-ux";
	import { PUBLIC_POCKETBASE_URL } from "$env/static/public";
    import PdfViewer from "svelte-pdf"
	import { toast } from "@zerodevx/svelte-toast";

    export let mdbid: MediaID;
    export let page: number;

    let file: MediaFile | undefined;
    let upload: any;

    const upload_file = async (u: any) => {
        console.log(upload[0])
        let formData = new FormData();
        formData.append('user', $uaccount.id);
        formData.append('media', mdbid);
        formData.append('file', upload[0]);
        await pb.collection('mediafile').create(formData).then((fdata: MediaFile) => {
            file = fdata
        }) //replace data accordingly
    }

    const delete_file = async () => {
        await pb.collection('mediafile').delete(file!.id!).catch((e) => {
            toast.push(`Error deleting file: ${e}`, { classes: ["error"] })
        }).then(() => {
            file = undefined
        })
    }

    onMount(async () => {
        file = await pb.collection("mediafile").getFirstListItem(`media="${mdbid}"`)
    })
    $: fileurl = file ? `${PUBLIC_POCKETBASE_URL}api/files/mediafile/${file.id}/${file.file}` : ""
    $: filetype = file ? file.file.split(".").slice(-1) : ""

    const dispatch = createEventDispatcher();

    $: {
        dispatch("change", {
            page 
        })
    }
</script>

{#if file != undefined}
    {#if filetype == "pdf"}
        <PdfViewer url={fileurl}  bind:pageNum={page} scale={1}/>
        <Button on:click={() => {delete_file()}}>Delete File</Button>
    {/if}
{:else}
    <input bind:files={upload} type="file" on:change={(e) => {upload_file(e.target)}} />
{/if}