<script setup>
import { onMounted, reactive, ref, watch } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  }
});
const emit = defineEmits(['close', 'update:itemText', 'update:itemDone']);

const dialogEl = ref();
onMounted(() => {
  dialogEl.value.showModal();
});

const confirmCancelDialog = ref();

let unsavedChanges = false;

const draft = reactive({
  // Dummy values, to be replaced in the watcher below.
  text: '',
  done: false,
});
watch(
  () => props.item,
  (n) => {
    draft.done = n.done;
    draft.text = n.text;

    unsavedChanges = false;
  },
  { deep: true, immediate: true }
);

// Doing this once (on the first event only) is not enough because `unsavedChanges`
// may become `false` (see above).
function onSomeInput() {
  unsavedChanges = true;
}
function onEditDialogCancel(e) {
  if (unsavedChanges) {
    e.preventDefault();
    confirmCancelDialog.value.showModal();
  }
}
function onFormSubmit(e) {
  emit('update:itemDone', draft.done);
  emit('update:itemText', draft.text);
}
</script>

<template>
  <dialog
    ref="dialogEl"
    @input="onSomeInput"
    @cancel="onEditDialogCancel"
    @close="emit('close')"
  >
    <h3>Edit TODO</h3>
    <form
      method="dialog"
      @submit="onFormSubmit"
    >
      <input
        type="checkbox"
        v-model="draft.done"
        aria-label="Done"
      />
      <input
        v-model="draft.text"
      />
      <section class="controls">
        <!-- Explicit "cancel" button. Close the dialog without confirmation. -->
        <button
          @click="dialogEl.close()"
          type="button"
        >❌ Cancel</button>
        <button
          type="submit"
        >✔️ Save</button>
      </section>
    </form>
  </dialog>

  <!-- Make sure to close this dialog before closing the outer one in order
  to cause no focus-related issues. -->
  <dialog
    ref="confirmCancelDialog"
    @close="e => {
      if (e.target.returnValue === 'discard') {
        dialogEl.close();
      }
    }"
  >
    <form method="dialog">
      <p>Discard changes?</p>
      <button>Continue editing</button>
      <button
        value="discard"
      >❌ Discard changes</button>
    </form>
  </dialog>
</template>

<style scoped>
.controls {
  text-align: end;
}
</style>