<script>
    import LoginScreen from "../components/LoginScreen.svelte";
    import Router from "svelte-spa-router";
    import { routes } from "../routes";
    let isLoggedIn = true;
</script>

<Router {routes} />

<!-- {#if !isLoggedIn}
    <LoginScreen />
{:else}
    <h1>You're logged in</h1>
{/if} -->
