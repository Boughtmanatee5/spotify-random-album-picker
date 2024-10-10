<script lang="ts">
	import type { Artist, SimplifiedAlbum } from "@spotify/web-api-ts-sdk";
	import { API_STATUS_ERROR, API_STATUS_SUCCESS, useGetAlbumsForArtists } from "./apiHooks";
	import Loader from "$lib/loader/Loader.svelte";
    
    export let artist: Artist;
    let album: SimplifiedAlbum | null = null;
    let backgroundImage = '';
    let error: Error | null = null;
    let loading = true;
    const { subscribe, refresh } = useGetAlbumsForArtists(artist.id);
    subscribe((v) => {
        switch (v.status) {
            case API_STATUS_SUCCESS:
                loading = false;
                error = null;
                const albums = v.data as SimplifiedAlbum[];
                album = albums[Math.floor(Math.random()*albums.length)];
                backgroundImage = album ? album.images[0].url : '';
                break;
            case API_STATUS_ERROR:
                loading = false;
                error = v.error as Error;
                album = null;
                break;
            default:
                loading = true
                album = null;
                error = null;
                break;
        }
    })

    $: {
        refresh(artist.id);
    }
</script>
<div>
    {#if loading}
        <Loader />
    {/if}
    {#if album}
        <div class="album-image">
            <img src={backgroundImage} alt={album.name} />
        </div>
        <h3>
            <a href={album.external_urls.spotify}>
                {album.name}
            </a>
        </h3>
    {/if}
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .album-image {
        position: relative;
        height: 640px;
        width: 640px;
        background: radial-gradient(circle, rgba(30,215,96,1) 10%, rgba(0,0,0,1) 90%);;
    }
    .album-image img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>
