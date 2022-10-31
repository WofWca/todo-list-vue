<script setup>
import { onMounted, ref } from 'vue';

const emit = defineEmits(['create', 'close']);

const dialogEl = ref();
onMounted(() => {
  dialogEl.value.showModal();
});

/**
 * @typedef {import('../todosStorage.js').TodoItem} TodoItem
 */

function onFormSubmit(e) {
  const data = new FormData(e.target);
  const text = data.get('text');

  /** @type {TodoItem} */
  const newTask = {
    done: false,
    subtasks: [],
    text,
  };
  emit('create', newTask);
}
</script>

<template>
  <dialog
    ref="dialogEl"
    @close="emit('close')"
  >
    <form
      method="dialog"
      @submit="onFormSubmit"
    >
      <h3>Create TODO</h3>
      <input
        name="text"
      />
      <section class="controls">
        <!-- TODO do we add cancel confirmation dialog, as well as with editing? -->
        <button
          type="button"
          @click="dialogEl.close()"
        >Cancel</button>
        <button value="create">✨ Add TODO</button>
      </section>
    </form>
  </dialog>
</template>

<style scoped>
.controls {
  text-align: end;
}
</style>