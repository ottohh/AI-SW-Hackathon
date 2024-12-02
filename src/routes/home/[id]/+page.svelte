<script lang="ts">
  import { goto } from '$app/navigation';
  import type { DublinCoreMetadata } from '../../../server/GPT/schema';

  let { data } = $props();
  console.log('data', data);

  let metadata = $derived(data.metadata as DublinCoreMetadata);
</script>

<main>
  <button
    onclick={() => {
      goto('/home');
    }}>Home</button
  >
  <h1>{metadata.title}</h1>
  <p>{metadata.description}</p>
  <div class="flex flex-col">
    {#each Object.entries(metadata) as [key, value]}
      <div class="grid grid-cols-3">
        <strong>{key}:</strong>

        <p class=" col-span-2">{value}</p>
      </div>
    {/each}
  </div>
</main>
