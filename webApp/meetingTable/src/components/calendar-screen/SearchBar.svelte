<script lang="ts">
    import { users } from "../../stores/api.store";
    import type { User } from "../../types";
    import SearchResult from "./SearchResult.svelte";

    export let data: User[] = [];
    export let onAddAction: (data: User) => void;

    let searchValue = "";
    let suggestions: User[] = [];

    function suggestData() {
        suggestions = data.filter((d) =>
            d.user_email.toLowerCase().includes(searchValue.toLowerCase())
        );
    }
</script>

<div class="searchBar">
    <input
        style="width: 100%;"
        type="search"
        bind:value={searchValue}
        on:input={suggestData}
    />
</div>
{#if searchValue}
    <ul class="suggestions">
        {#each suggestions as suggestion}
            <SearchResult data={suggestion} {onAddAction} />
        {/each}
    </ul>
{/if}

<style>
    .searchBar {
        width: 100%;
        border: 1px solid black;
    }
</style>
