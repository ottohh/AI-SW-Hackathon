<script lang="ts">
  let { metadata } = $props();
</script>

<main>
  <h1>Product Metadata</h1>
  <pre>{JSON.stringify(metadata, null, 2)}</pre>
</main>
