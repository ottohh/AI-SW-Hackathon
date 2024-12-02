<script lang="ts">
  import { goto } from '$app/navigation';
  import { any } from 'zod';

  let { data } = $props();
  console.log('products', data.products);
</script>

<main>
  <button
    onclick={() => {
      goto('/upload');
    }}>Upload data sets</button
  >
  <div class="flex items-center justify-center w-full">
    <h1
      class="flex flex-column items-center justify-center my-2 text-6xl"
      style="margin-bottom:20px;"
    >
      Sellable Datasets
    </h1>
  </div>
  <div class="flex items-center w-max-lg px-10 flex-wrap gap-4">
    {#each data.products as product}
      <section>
        <div
          class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
        >
          {#if product.productImagePath}
            <a href="#">
              <img
                class="rounded-t-lg"
                src={product.productImagePath}
                alt="no image"
              />
            </a>
          {/if}
          <div class="p-5">
            <a href="#">
              <h5
                class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
              >
                {(product.metadata as any).title}
              </h5>
            </a>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {(product.metadata as any).subject}
            </p>
            <a
              href="/home/{product.id}"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Read more
              <svg
                class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>
    {/each}
  </div>
</main>
