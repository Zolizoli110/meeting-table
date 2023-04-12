<script lang="ts">
    import { users } from "../../stores/api.store";
    import type { Data, User } from "../../types";
    import SearchResult from "./SearchResult.svelte";

    export let data: User[] = [];

    let searchValue = "";
    let suggestions: User[] = [];

    function suggestData() {
        suggestions = data.filter((d) =>
            d.user_email.toLowerCase().includes(searchValue.toLowerCase())
        );
    }
</script>

<input type="search" bind:value={searchValue} on:input={suggestData} />
{#if searchValue}
    <ul class="suggestions">
        {#each suggestions as suggestion}
            <SearchResult data={suggestion} />
        {/each}
    </ul>
{/if}
