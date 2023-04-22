<script lang="ts">
    import { loggedInUser } from "../../stores/api.store";
    import IoIosSettings from "svelte-icons/io/IoIosSettings.svelte";
    let isAdminPageClicked = false;
    let isAdmin = false;
    $: {
        isAdmin = $loggedInUser && $loggedInUser.role_name === "admin";
    }
</script>

<div class="sidebar">
    <div id="profile-pic-group" class="nav-group">
        <div class="nav-item profile-pic" />
    </div>
    <div class="nav-group" id="sidebar-tabs">
        <a class="nav-item" href="http://localhost:5173/#/calendar">
            book a reservation
        </a>
        {#if isAdmin}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
                class="nav-item accordion"
                on:click={() => {
                    isAdminPageClicked = !isAdminPageClicked;
                }}
            >
                admin page
            </div>
            <a
                class:open={isAdminPageClicked}
                class="nav-item sub-option"
                href="http://localhost:5173/#/admin_calendar">admin calendar</a
            >
            <a
                class:open={isAdminPageClicked}
                class="nav-item sub-option"
                href="http://localhost:5173/#/admin_settings">admin settings</a
            >
        {/if}
    </div>
    <div id="settings-group" class="nav-group" style="align-self: end">
        <div class="nav-item">
            <IoIosSettings />
        </div>
    </div>
</div>

<style>
    .sidebar {
        height: 100%;
        width: 150px;
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        overflow-x: hidden;
        color: white;
        background-color: brown;
        display: grid;
        grid-template-rows: auto auto auto;
    }
    .nav-group {
        display: flex;
        flex-direction: column;
    }

    .accordion {
        cursor: pointer;
    }
    .profile-pic {
        height: 75px;
        width: 75px;
        background-color: blueviolet;
        border: 2px solid purple;
        border-radius: 100%;
    }
    .sub-option {
        visibility: hidden;
    }
    .open {
        visibility: visible;
    }
    #sidebar-tabs {
        justify-content: center;
    }
</style>
