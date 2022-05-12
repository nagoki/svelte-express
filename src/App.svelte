<script>
	import { writable } from "svelte/store";
	const userStore = writable(null);
	let token;
	async function getToken() {
		if(token) return token;
		let response = await fetch("/token")
		if(response.ok){
			let data = await response.json();
			token = data.token;
			return token;
		}
		return null;
	}

	async function getUser() {
		let accessToken = await getToken()
		if(!accessToken) return;
		
		let userResponse = await fetch('/user',{
			headers: {authorization: accessToken}
		})
		return userResponse.ok ? await userResponse.json() : null;
	}
	async function login() {
		await fetch("/login", {
			method: "POST",
			headers: {
				"Content-Type" : "application./json",
			},
			body: JSON.stringify({email: "user@email.com", pwd: "pwd"})
		})
		let user = await getUser();
		if(user) userStore.update(data => user);
	}
</script>

<main>
	<h1>Hello!</h1>
	{#if $userStore}
		<div>Logged In</div>
	{:else}
		<button on:click={() => login()}>Login</button>
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>