<script setup>
import { reactive, watch, onUnmounted } from 'vue';
import TodoItemComponent from './components/TodoItem.vue';
import TheCreateDialog from './components/TheCreateDialog.vue';
import TheEditDialog from './components/TheEditDialog.vue';
import TheDeleteDialog from './components/TheDeleteDialog.vue';
import { getTodos, onTodosUpdate } from './todosStorage';

const state = reactive({
  todos: getTodos(),
  numShowTodos: 20,
  /** @type {{ insertIn: TodoItem[], insertAt: number } | null} */
  createDialogData: null,
  /** @type {TodoItem | null} */
  editingDialogItem: null,
  /** @type {{ arr: TodoItem[], ind: number } | null} */
  deletingDialogData: null,
});

watch(
  () => state.todos,
  (n) => onTodosUpdate(n),
  { deep: true }
);

{
  // TODO maybe a bigger margin so the user can scroll the list without actually
  // having to bump the bottom of the page to get the next page to load.
  const pageBottomMarginPx = 100;
  const onScrollListener = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - pageBottomMarginPx) {
      // This assumes that new items get shown instantly. Otherwise it may increment it
      // twice.
      console.log('scroll');
      if (state.todos.length > state.numShowTodos) {
        state.numShowTodos += 10;
      }
    }
  }
  onScrollListener();
  // TODO maybe also watch window resize events. Better yet, use a library.
  window.addEventListener('scroll', onScrollListener, { passive: true });
  onUnmounted(() => {
    window.removeEventListener('scroll', onScrollListener);
  });
}
</script>

<template>
  <button
    @click="state.createDialogData = { insertIn: state.todos, insertAt: 0 }"
  >➕ Add TODO</button>

  <ol class="list">
    <TodoItemComponent
      v-for="(item, ind) in state.todos.slice(0, state.numShowTodos)"
      :todoItem="item"
      @editRequested="i => state.editingDialogItem = i"
      @deleteSelfRequested="state.deletingDialogData = { arr: state.todos, ind: ind }"
      @deleteSubtaskRequested="(parent, subtaskInd) => {
        state.deletingDialogData = { arr: parent.subtasks, ind: subtaskInd }
      }"
      @createRequested="parent => state.createDialogData = {
        insertIn: parent.subtasks,
        insertAt: parent.subtasks.length,
      }"
    />
  </ol>

  <TheCreateDialog
    v-if="state.createDialogData"
    @create="item => state.createDialogData.insertIn.splice(
      state.createDialogData.insertAt,
      0,
      item,
    )"
    @close="state.createDialogData = null"
  />

  <TheEditDialog
    v-if="state.editingDialogItem"
    :item="state.editingDialogItem"
    @update:itemDone="n => state.editingDialogItem.done = n"
    @update:itemText="n => state.editingDialogItem.text = n"
    @close="state.editingDialogItem = null"
  />

  <TheDeleteDialog
    v-if="state.deletingDialogData"
    @confirm="state.deletingDialogData.arr.splice(state.deletingDialogData.ind, 1)"
    @close="state.deletingDialogData = null"
  />
</template>

<style scoped>
.list {
  list-style: none;
  padding-inline-start: 0;
}
</style>
