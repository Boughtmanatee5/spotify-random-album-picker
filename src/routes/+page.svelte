<script lang="ts">
	import { createSpotifyApi } from '$lib/spotify/helpers';
	import RandomArtist from '$lib/spotify/RandomArtist.svelte';
	import SpotifyLogin from '$lib/spotify/SpotifyLogin.svelte';
	import Loader from '$lib/loader/Loader.svelte';
	import { onMount, setContext } from 'svelte';

		
	const spotifyClient = createSpotifyApi();
	setContext('spotify-client', spotifyClient);

	const onLoginClick = () => {
		spotifyClient.authenticate();
	}

	let loading = true;
	let authenticated = false;
	onMount(async () => {
		const queryParams = new URLSearchParams(location.search);
		// finish authenication after redirect
		if (queryParams.get('code')) {
			try {
				await spotifyClient.authenticate();
				authenticated = true;
				loading = false;
			} catch (e) {
				const errorMsg = e instanceof Error ? e.message : 'unkown error';
				console.error('Error authenticating', errorMsg);
				authenticated = false;
				loading = false;
			}
		} else {
			authenticated = await spotifyClient.isAuthenticated();
			loading = false;
		};
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Select a random album from your spotify followed artists" />
</svelte:head>

<section>
	<h1>Spotify Album Picker</h1>
	{#if loading}
		<Loader />
	{:else}
		{#if authenticated}
			<RandomArtist />
		{:else}
			<SpotifyLogin onClick={onLoginClick} />
		{/if}
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
