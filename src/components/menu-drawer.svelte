<script lang="ts">
import { XIcon } from "lucide-svelte"
import { writable } from "svelte/store"

export const drawerOpen = writable<boolean>(false)
</script>

<div class="drawer drawer-end">
    <input
        id="menu-drawer"
        type="checkbox"
        class="drawer-toggle"
        bind:checked={$drawerOpen}
    />
    <div class="flex drawer-content justify-end">
        <!-- Page content here -->
        <label
            for="menu-drawer"
            class="btn lg:btn-lg btn-secondary text-sm p-3 drawer-button"
            ><img
                src="/menu.svg"
                alt="Menu trigger"
                class="w-6 h-6 lg:w-10 lg:h-10"
            /></label
        >
    </div>
    <div class="drawer-side z-10">
        <label
            for="menu-drawer"
            aria-label="close sidebar"
            class={"drawer-overlay" + ($drawerOpen ? " backdrop-blur" : "")}
        ></label>
        <div
            class="w-full max-w-[710px] flex flex-col justify-between items-end min-h-full py-10 px-24 bg-secret-sauce text-base-content drop-shadow-2xl"
        >
            <div class="flex gap-2">
                <a
                    href="https://get.pallad.co/extension"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn bg-white border-none text-base-100 lg:btn-lg hover:bg-zinc-100"
                    >Add to Chrome</a
                >
                <button
                    type="button"
                    class="btn btn-circle bg-white border-none text-base-100 lg:btn-lg hover:bg-zinc-100"
                    on:click={() => drawerOpen.set(false)}><XIcon /></button
                >
            </div>
            <div class="flex flex-col gap-12 items-end">
                <a href="/" class="text-3xl lg:text-5xl font-[500]">Home</a>
                <a href="/faq" class="text-3xl lg:text-5xl font-[500]">FAQ</a>
                <a href="/support" class="text-3xl lg:text-5xl font-[500]"
                    >Support</a
                >
                <a href="/blog" class="text-3xl lg:text-5xl font-[500]">Blog</a>
                <a href="/roadmap" class="text-3xl lg:text-5xl font-[500]"
                    >Roadmap</a
                >
                <a
                    href="/docs"
                    target="_blank"
                    class="text-3xl lg:text-5xl font-[500]">Docs</a
                >
            </div>
        </div>
    </div>
</div>
