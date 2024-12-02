<script lang="ts">
  import { goto } from '$app/navigation';
  import type { DublinCoreMetadata } from '../../../server/GPT/schema';

  let { data } = $props();
  console.log('data', data);

  let metadata = $derived(data.metadata as DublinCoreMetadata);
</script>

<main>
  <div>
    <button
      onclick={() => {
        goto('/home/' + data.id + '/edit');
      }}>Edit</button
    >
    <button
      onclick={() => {
        goto('/home');
      }}>Home</button
    >
  </div>
  <div class="flex w-full justify-center flex-col">
    <h1 class="text-5xl font-bold">{metadata.title}</h1>
    <p class="max-w-96">{metadata.description}</p>
    <div class="flex flex-col">
      {#each Object.entries(metadata) as [key, value]}
        <div class="grid grid-cols-3">
          <strong>{key}:</strong>

          <p class=" col-span-2">{value}</p>
        </div>
      {/each}
    </div>
  </div>
</main>
