<script lang="ts">
	import type { Artist } from '@spotify/web-api-ts-sdk';
	import RandomAlbum from './RandomAlbum.svelte';
	import { API_STATUS_ERROR, API_STATUS_SUCCESS, useGetFollowedArtists } from './apiHooks';
	import Loader from '$lib/loader/Loader.svelte';

    let loading = true;
    let error: Error | null = null;
    let artists: Artist[] = [];
    const { subscribe } = useGetFollowedArtists();
    subscribe((v) => {
        switch (v.status) {
            case API_STATUS_SUCCESS:
                error = null
                artists = v.data as Artist[];
                loading = false;
                break;
            case API_STATUS_ERROR:
                loading = false;
                error = v.error as Error;
                artists = [];
                break;
            default:
                loading = true
                break;
        }
    });

    let artist: Artist | null = null;
    const onGetRandomAlbum = () => {
        artist = artists[Math.floor(Math.random()*artists.length)]
    }

</script>

<div>
    {#if loading}
        <Loader />
    {:else}
        {#if (artist)}
            <h2>
                <a href={artist.external_urls.spotify}>
                    {artist.name}
                </a>
            </h2>
            <RandomAlbum artist={artist} />
        {/if}
        <button on:click={onGetRandomAlbum}>Get Random Album</button>
    {/if}
</div>

<style>
    div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>
