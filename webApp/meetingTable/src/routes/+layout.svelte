<script>
    import "../app.css";
    import Sidebar from "../components/Sidebar.svelte";
</script>

<Sidebar />
<div class="page">
    <slot />
</div>

<style>
    .page {
        margin-left: 150px;
    }
</style>
