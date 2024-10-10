import { getContext } from "svelte";
import { writable } from "svelte/store";
import type { SpotifyApiWrapper } from "./helpers";
import type { Artist, SimplifiedAlbum } from "@spotify/web-api-ts-sdk";

export const API_STATUS_LOADING = 'loading';
export const API_STATUS_SUCCESS = 'success';
export const API_STATUS_ERROR = 'error';

type APIStatus = typeof API_STATUS_LOADING | typeof API_STATUS_SUCCESS | typeof API_STATUS_ERROR;

interface APIStore<T> {
    status: APIStatus;
    data: T | null;
    error: Error | null;
}

function createAPIStore<T>() {
    return writable<APIStore<T>>({
        status: API_STATUS_LOADING,
        data: null,
        error: null,
    })
}

export function useGetFollowedArtists() {
    const spotifyClient = getContext<SpotifyApiWrapper>('spotify-client');
    const {subscribe, set} = createAPIStore<Artist[]>();

    (async function() {
        try {
            let artistResponse = await spotifyClient.getFavoriteArtists();
            let artists = artistResponse.artists.items;
            let next: string | null = artists[artists.length-1].id;
            while (next !== null) {
                artistResponse = await spotifyClient.getFavoriteArtists(next);
                artists = [...artists, ...artistResponse.artists.items];
                next = artistResponse.artists.total != artists.length ? artists[artists.length-1].id : null;
            }
            set({
                status: API_STATUS_SUCCESS,
                data: artists,
                error: null,
            });
        } catch (e) {
            const error = e instanceof Error ? e : new Error('unkown error');
            set({
                status: API_STATUS_ERROR,
                data: null,
                error,
            });
        }
        
    }());

    return { subscribe };
}

export function useGetAlbumsForArtists(artistId: string) {
    const spotifyClient = getContext<SpotifyApiWrapper>('spotify-client');
    const {subscribe, set} = createAPIStore<SimplifiedAlbum[]>();

    async function getAlbumsForArtist(id: string) {
        try {
            let albumsResponse = await spotifyClient.getAlbumsForArtist(id, 0);
            const total = albumsResponse.total;
            let albums = albumsResponse.items;
            let offset = albums.length-1;
            while (total > offset) {
                albumsResponse = await spotifyClient.getAlbumsForArtist(id, 0);
                albums = [...albums, ...albumsResponse.items];
                offset = albums.length-1;
            }
            set({
                status: API_STATUS_SUCCESS,
                data: albums,
                error: null,
            });
        } catch (e) {
            const error = e instanceof Error ? e : new Error('Unkown error');
            set({
                status: API_STATUS_ERROR,
                data: null,
                error,
            });
        }
    };

    const refresh = (id: string) => {
        set({ status: API_STATUS_LOADING, data: null, error: null});
        getAlbumsForArtist(id);
    }

    getAlbumsForArtist(artistId);

    return { subscribe, refresh };
}
