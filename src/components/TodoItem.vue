<script setup>
/**
 * @typedef {import('../todosStorage.js').TodoItem} TodoItem
 */

defineProps({
  todoItem: {
    type: Object,
    required: true
  },
});
const emit = defineEmits([
  'createRequested',
  'editRequested',
  'deleteSelfRequested',
  'deleteSubtaskRequested',
]);
</script>

<template>
  <li>
    <section class="item-line">
      <!-- TODO don't mutate props directly - emit an event instead. -->
      <input
        type="checkbox"
        aria-label="Done"
        v-model="todoItem.done"
      />
      <span>{{ todoItem.text }}</span>
      <div class="spacer" />
      <button
        @click="emit('createRequested', todoItem)"
        aria-label="Add subtask"
      >➕</button>
      <button
        @click="emit('editRequested', todoItem)"
        aria-label="Edit"
      >✏️</button>
      <button
        @click="emit('deleteSelfRequested')"
        aria-label="Delete"
      >🗑️</button>
    </section>
    <ol class="list">
      <!-- TODO `:key`. Random IDs? -->
      <TodoItem
        v-for="(item, ind) in todoItem.subtasks"
        :todoItem="item"
        @createRequested="parent => emit('createRequested', parent)"
        @editRequested="item => emit('editRequested', item)"
        @deleteSelfRequested="() => emit('deleteSubtaskRequested', todoItem, ind)"
        @deleteSubtaskRequested="(parent, ind) => emit('deleteSubtaskRequested', parent, ind)"
      />
    </ol>
  </li>
</template>

<style scoped>
.list {
  list-style: none;
  padding-inline-start: 1rem;
}
.item-line {
  display: flex;
  align-items: center;
  border-bottom: 1px solid gray;
  border-left: 1px solid gray;
}
.spacer {
  flex-grow: 1;
}
button {
  padding: 0.125rem;
  margin: 0.25rem 0;
  margin-inline-start: 0.25rem;
}
</style>
