<script setup>
import { onMounted, ref } from 'vue';

const emit = defineEmits(['confirm', 'close']);

const dialogEl = ref();
onMounted(() => {
  dialogEl.value.showModal();
});
</script>

<template>
  <dialog
    ref="dialogEl"
    @close="emit('close')"
  >
    <form method="dialog">
      <h3>Delete TODO</h3>
      <p>Are you sure you want to delete this task?</p>
      <section class="controls">
        <button>Cancel</button>
        <button
          @click="emit('confirm')"
        >🗑️ Delete</button>
      </section>
    </form>
  </dialog>
</template>

<style scoped>
.controls {
  text-align: end;
}
</style>