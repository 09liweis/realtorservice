<script lang="ts">
  import { supabase } from "$lib/supabase";
  import { user } from "$lib/stores/auth";
  import { createEventDispatcher } from "svelte";

  export let images: string[] = [];
  export let maxImages = 30;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  let uploading = false;
  let dragOver = false;
  let fileInput: HTMLInputElement;

  // Handle file selection
  async function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files) {
      await uploadFiles(Array.from(files));
    }
  }

  // Handle drag and drop
  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragOver = true;
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault();
    dragOver = false;
  }

  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragOver = false;

    const files = Array.from(event.dataTransfer?.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length > 0) {
      await uploadFiles(imageFiles);
    }
  }

  // Upload files to Supabase storage
  async function uploadFiles(files: File[]) {
    if (!$user || uploading) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    uploading = true;

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(
            `File ${file.name} is too large. Maximum size is 5MB.`,
          );
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`File ${file.name} is not an image.`);
        }

        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${$user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        // Upload to Supabase storage
        const { data, error } = await supabase.storage
          .from("listing-images")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) throw error;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(fileName);

        return urlData.publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];

      dispatch("update", newImages);
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      uploading = false;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  }

  // Remove image
  async function removeImage(index: number) {
    const imageUrl = images[index];

    try {
      // Extract filename from URL to delete from storage
      const urlParts = imageUrl.split("/");
      const fileName = urlParts.slice(-2).join("/"); // Get user_id/filename part

      // Delete from Supabase storage
      await supabase.storage.from("listing-images").remove([fileName]);
    } catch (error) {
      console.error("Error deleting image from storage:", error);
    }

    // Remove from local array
    const newImages = images.filter((_, i) => i !== index);
    dispatch("update", newImages);
  }

  // Trigger file input
  function triggerFileInput() {
    if (!disabled && fileInput) {
      fileInput.click();
    }
  }
</script>

<div class="space-y-4">
  <div class="flex items-center justify-between">
    <label class="block text-sm font-medium text-gray-700">
      Property Images ({images.length}/{maxImages})
    </label>
    {#if images.length < maxImages}
      <button
        type="button"
        onclick={triggerFileInput}
        disabled={disabled || uploading}
        class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {#if uploading}
          <svg
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Uploading...
        {:else}
          <svg
            class="-ml-1 mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Add Images
        {/if}
      </button>
    {/if}
  </div>

  <!-- Hidden file input -->
  <input
    bind:this={fileInput}
    type="file"
    multiple
    accept="image/*"
    onchange={handleFileSelect}
    class="hidden"
    disabled={disabled || uploading}
  />

  <!-- Drag and drop area -->
  {#if images.length < maxImages}
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors {dragOver
        ? 'border-blue-400 bg-blue-50'
        : ''}"
      ondragover={handleDragOver}
      ondragleave={handleDragLeave}
      ondrop={handleDrop}
      role="button"
      tabindex="0"
      onclick={triggerFileInput}
      onkeydown={(e) => e.key === "Enter" && triggerFileInput()}
    >
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
      >
        <path
          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <div class="mt-4">
        <p class="text-sm text-gray-600">
          <span
            class="font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
            >Click to upload</span
          >
          or drag and drop
        </p>
        <p class="text-xs text-gray-500 mt-1">
          PNG, JPG, GIF up to 5MB each (max {maxImages} images)
        </p>
      </div>
    </div>
  {/if}

  <!-- Image preview grid -->
  {#if images.length > 0}
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {#each images as image, index}
        <div class="relative group">
          <img
            src={image}
            alt="Property image {index + 1}"
            class="w-full h-32 object-cover rounded-lg border border-gray-200"
            loading="lazy"
          />
          <button
            type="button"
            onclick={() => removeImage(index)}
            {disabled}
            class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove image"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
          <div
            class="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded"
          >
            {index + 1}
          </div>
        </div>
      {/each}
    </div>
  {/if}

  {#if images.length >= maxImages}
    <p
      class="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md p-3"
    >
      Maximum number of images ({maxImages}) reached. Remove some images to add
      new ones.
    </p>
  {/if}
</div>
