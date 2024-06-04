<script lang="typescript">
import mixpanel from "mixpanel-browser"
import { onMount } from "svelte"

onMount(() => {
  mixpanel.init("ee1f7980362645f72b80bfdd0c7be4a8", {
    track_pageview: true,
  })
})
</script>
