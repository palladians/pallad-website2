<script lang="ts">
    import mermaid from "mermaid";
    import { onMount } from "svelte";

    export let chart: string;
    let result: HTMLSpanElement;

    onMount(async () => {
        mermaid.initialize({
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
        });
        const { svg } = await mermaid.render("mermaid", chart);
        result.innerHTML = svg;
    });
</script>

<div class="mermaid">
    <span bind:this={result}> </span>
</div>
