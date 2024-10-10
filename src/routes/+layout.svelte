<script>
	import '../app.css';
	import githubIcon from '$lib/images/github-mark-white.svg';
</script>

<div class="app">
	<header>
		<a href="https://github.com/Boughtmanatee5/spotify-random-album-picker">
			<img src={githubIcon} alt="github icon" />
		</a>
	</header>
	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	header {
		display: flex;
		justify-content: flex-end;
		padding: 1rem;
	}

	header img {
		width: 30px;
		height: 30px;
	}
</style>
