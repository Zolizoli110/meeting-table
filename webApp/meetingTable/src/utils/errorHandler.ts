import { push } from "svelte-spa-router";
import { loggedInUser } from "../stores/api.store"

export const HttpStatusHandler = (statusCode: number) => {
    if (statusCode === 401) {
        loggedInUser.set(undefined);
        push('/login')
    }
}