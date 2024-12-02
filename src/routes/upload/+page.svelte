<script lang="ts">
  let fileName = ''; // Variable to hold the file name

  function handleFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      fileName = `${files[0].name}`;
    } else {
      fileName = ''; // Clear the file name if no file is selected
    }
  }
</script>

<div class="flex flex-col" style="margin-top:5%;">
  <div>
    <h1
      class="flex flex-column items-center justify-center w-full my-2 text-6xl"
      style="margin-bottom:20px;"
    >
      Upload
    </h1>
  </div>
  <div>
    <form method="post" action="?/upload" enctype="multipart/form-data">
      <div
        class="flex items-center justify-center w-full"
        style="margin-bottom:20px;"
      >
        <label
          for="dropzone-file"
          class="flex flex-col items-center justify-center w-80 h-40 border-2 border-secondary border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span class="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{fileName}</p>
          </div>
          <input
            accept=".zip"
            name="zip"
            id="dropzone-file"
            type="file"
            class="hidden"
            on:change={handleFileChange}
          />
        </label>
      </div>
      <div class="flex items-center justify-center">
        <button
          type="submit"
          class="w-40 border-2 border-primary text-primary rounded-full px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          >Submit</button
        >
      </div>
    </form>
  </div>
</div>
