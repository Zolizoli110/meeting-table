<script>
    import LoginScreen from "../components/LoginScreen.svelte";
    import Router from "svelte-spa-router";
    import { routes } from "../routes";
    let isLoggedIn = true;
</script>

<Router {routes} />
