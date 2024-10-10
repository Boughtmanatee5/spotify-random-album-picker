<script lang="ts">
    export let onClick: () => void;
</script>
<div>
    <button on:click={onClick}>Authenticate with Spotify</button>
</div>
