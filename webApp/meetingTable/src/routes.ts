import CalendarScreen from "./components/calendar-screen/CalendarScreen.svelte";
import Callback from "./components/navigation/Callback.svelte";
import LoginScreen from "./components/LoginScreen.svelte";
import AdminCalendarScreen from "./components/admin-screen/AdminCalendarScreen.svelte";
import AdminSettings from "./components/admin-screen/AdminSettings.svelte";

export const routes = {
    "/login": LoginScreen,
    "/calendar": CalendarScreen,
    "/admin_calendar": AdminCalendarScreen,
    "/admin_settings": AdminSettings,
    "/callback/:user_email": Callback
}