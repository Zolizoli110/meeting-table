<script lang="ts">
    import { push } from "svelte-spa-router";
    import { loggedInUser } from "../../stores/api.store";
    //@ts-nocheck
    import IoIosSettings from "svelte-icons/io/IoIosSettings.svelte";
    let isAdminPageClicked = false;
    let isAdmin = false;
    let isLoggedIn = false;
    $: {
        isLoggedIn = $loggedInUser;
        isAdmin = $loggedInUser && $loggedInUser.role_name === "admin";
    }
    let pageOpen = 0;

    const logOut = () => {
        localStorage.removeItem("user_info");
        $loggedInUser = undefined;
        push("/login");
    };
</script>

<div class="sidebar">
    <div class="nav-group items-center gap-4" id="profile-pic-group">
        <div class="nav-item profile-pic">MeetingTable</div>
    </div>
    <div class="nav-group" id="sidebar-tabs">
        <a
            class:openPage={pageOpen === 0}
            on:click={() => {
                pageOpen = 0;
                if (isAdminPageClicked) {
                    isAdminPageClicked = !isAdminPageClicked;
                }
            }}
            class="nav-item"
            href="http://localhost:5173/#/calendar"
        >
            book a reservation
        </a>
        {#if isAdmin}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <a
                href="http://localhost:5173/#/admin_calendar"
                class:openPage={pageOpen === 1}
                class="nav-item accordion"
                on:click={() => {
                    isAdminPageClicked = !isAdminPageClicked;
                    pageOpen = 2;
                }}
            >
                admin page
            </a>
            <a
                class:open={isAdminPageClicked}
                class:openPage={pageOpen === 2}
                on:click={() => {
                    pageOpen = 2;
                }}
                class="nav-item sub-option"
                href="http://localhost:5173/#/admin_calendar"
                ><span class="sub_option_decor"> --</span>admin calendar</a
            >
            <a
                class:openPage={pageOpen === 3}
                on:click={() => {
                    pageOpen = 3;
                }}
                class:open={isAdminPageClicked}
                class="nav-item sub-option"
                href="http://localhost:5173/#/admin_settings"
                ><span class="sub_option_decor"> --</span>admin settings</a
            >
        {/if}
    </div>
    <div id="settings-group" class="nav-group">
        <div class="logoutButton" on:click|preventDefault={logOut}>Log out</div>
        <!-- <p class="nav-item logged-in-email text-sm">
                {$loggedInUser.user_email}
            </p>
            <div class="nav-item" style="width: 30px; height: 30px;">
                <IoIosSettings />
            </div> -->
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
        background-color: orangered;
        display: grid;
        grid-template-rows: auto auto auto;
        justify-items: center;
    }
    .nav-group {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    #sidebar-tabs {
        gap: 2px;
    }
    .accordion {
        cursor: pointer;
    }
    .profile-pic {
        margin-top: 10px;
        font-size: 1.2rem;
        font-weight: 500;
        color: black;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background-color: white;
        width: 70px;
        height: 70px;
        box-shadow: 0 0 10px lightgray;
    }
    #settings-group {
        justify-content: end;
        align-items: start;
    }
    .logoutButton {
        margin: 5px;
        font-size: 1.1rem;
        color: black;
        font-weight: 500;
        cursor: pointer;
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
    .openPage {
        color: black;
    }
    /* .logged-in-email {
        transform: rotate(180deg);
        writing-mode: vertical-lr;
    } */
</style>
