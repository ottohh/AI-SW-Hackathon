<script lang="ts">
  let { data } = $props();
  console.log('products', data.products);
</script>

<main>
  <h1>All Product Metadata</h1>
  {#each data.products as product}
    <section>
      <h2>Product ID: {product.id}</h2>
      <pre>{JSON.stringify(product.metadata, null, 2)}</pre>
    </section>
  {/each}
</main>
