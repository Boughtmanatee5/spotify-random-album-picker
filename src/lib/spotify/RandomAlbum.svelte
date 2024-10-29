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

    let imageLoaded = false;

    const onLoad = () => {
        imageLoaded = true;
    }

    $: {
        refresh(artist.id);
        imageLoaded = false;
    }
</script>
<div>
    {#if loading}
        <Loader />
    {/if}
    {#if album}
        <div class="album-image">
            <img class={imageLoaded ? 'loaded' : ''} src={backgroundImage} alt={album.name} on:load={onLoad} />
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
        height: 640px;
        width: 640px;
    }
    .album-image {
        position: relative;
        height: 100%;
    }
    .album-image img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 250ms ease-in-out;

        &.loaded {
            opacity: 1;
        }
    }
</style>
