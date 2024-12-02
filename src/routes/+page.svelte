<script lang="ts">
</script>

<form method="post" action="?/upload" enctype="multipart/form-data">
  <input type="file" required name="zip" accept=".zip" />
  <button type="submit">Upload</button>
</form>

<form method="post" action="?/save" enctype="multipart/form-data">
  <input type="text" name="name" placeholder="Name" required />
  <!-- TODO metadata -->
  <label for="image">Upload an image</label>
  <input type="file" name="image" accept="image/*" />
  <button type="submit">Save</button>
</form>
