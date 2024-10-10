import { SpotifyApi, type MaxInt } from '@spotify/web-api-ts-sdk';

const requiredScopes = ['user-read-private', 'user-read-email', 'user-follow-read'];
import { PUBLIC_SPOTIFY_API_CLIENT_ID } from '$env/static/public';

export function createSpotifyApi() {
    const redirectUri = 'http://localhost:5173/';
    return new SpotifyApiWrapper(SpotifyApi.withUserAuthorization(PUBLIC_SPOTIFY_API_CLIENT_ID, redirectUri, requiredScopes));
}

export class SpotifyApiWrapper {
    spotifyApi: SpotifyApi;
    constructor(spotifyApi: SpotifyApi) {
        this.spotifyApi = spotifyApi;
    }

    async authenticate() {
        const authResponse = await this.spotifyApi.authenticate()
        console.log('authResponse', authResponse);
    }

    async getAccessToken() {
        const accessToken = await this.spotifyApi.getAccessToken();
        console.log('accessToken', accessToken);
    }

    async isAuthenticated() {
        const accessToken = await this.spotifyApi.getAccessToken();
        console.log('accessToken', accessToken);
        return accessToken !== null;
    }

    async getFavoriteArtists(after?: string, limit?: MaxInt<50>) {
        const artists = await this.spotifyApi.currentUser.followedArtists(after, limit);
        return artists;
    }

    async getAlbumsForArtist(id: string, offset?: number, limit?: MaxInt<50>) {
        const albums = await this.spotifyApi.artists.albums(id, 'album', undefined, limit, offset);
        return albums
    }
}
