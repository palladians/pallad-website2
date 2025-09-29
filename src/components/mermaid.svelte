<script lang="ts">
import mermaid from "mermaid"
import { onMount } from "svelte"
import { writable } from "svelte/store"

export let chart: string
const html = writable("<p>loading</p>")

onMount(async () => {
  mermaid.initialize({
    securityLevel: "sandbox",
    theme: "dark",
    themeVariables: {
      cScale0: "#F6C177",
      cScaleLabel0: "#000000",
      cScale1: "#D1B4F4",
      cScaleLabel1: "#000000",
      cScale2: "#A4DBE4",
      cScaleLabel2: "#000000",
      cScale3: "#F2BEBC",
      cScaleLabel3: "#000000",
    },
  })
  const { svg } = await mermaid.render("mermaid", chart)
  html.set(svg)
})
</script>

<div class="mermaid">
    {@html $html}
</div>
