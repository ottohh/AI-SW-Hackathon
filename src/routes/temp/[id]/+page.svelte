<script lang="ts">
  let { data } = $props();
  console.log('data', data);
</script>

<main>
  <h1>Product Metadata</h1>
  <pre>{JSON.stringify(data.metadata, null, 2)}</pre>
</main>
