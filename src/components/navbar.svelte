<script lang="ts">
import { ofetch } from "ofetch"
import { onMount } from "svelte"
import { derived, writable } from "svelte/store"
import MenuDrawer from "./menu-drawer.svelte"
const homePage = window.location.pathname === "/"

const ok = writable(true)
const showAlert = derived(ok, (ok) => !ok && homePage)

onMount(() => {
  const fetchOk = async () => {
    const data = JSON.parse(await ofetch("/api/healthcheck.json"))
    ok.set(data.ok)
  }
  fetchOk()
})
</script>

<nav class="fixed top-0 left-0 right-0 z-10">
    {#if $showAlert}
            <div
                role="alert"
                class="alert flex justify-between bg-secondary shadow-lg rounded-none"
            >
                <h3>Services are partially degraded at the moment.</h3>
                <a
                    href="https://get.pallad.co/status"
                    target="_blank"
                    rel="noreferrer noopener"
                    class="btn btn-sm"
                >
                    Check status
                </a>
            </div>
    {/if}
    <div class="container flex justify-between items-center pt-10">
        <a href="/">
            <img src="/logo.svg" alt="logo" class="w-10 h-10 lg:w-16 lg:h-16" />
        </a>
        <div class="flex items-center gap-4">
            <a
                href="https://get.pallad.co/extension"
                target="_blank"
                rel="noopener noreferrer"
                class="btn lg:btn-lg btn-primary text-sm">Add to Chrome</a
            >
            <MenuDrawer />
        </div>
    </div>
</nav>
