<script lang="ts">
  export let products: { id: number; metadata: any }[];

  console.log('products', products);
</script>

<main>
  <h1>All Product Metadata</h1>
  {#each products as product}
    <section>
      <h2>Product ID: {product.id}</h2>
      <pre>{JSON.stringify(product.metadata, null, 2)}</pre>
    </section>
  {/each}
</main>
