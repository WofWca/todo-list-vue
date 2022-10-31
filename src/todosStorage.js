/**
 * @typedef {{
 *   text: string,
 *   done: boolean,
 *   subtasks: TodoItem[],
 * }} TodoItem
 */

function* dummyTaskGenerator(numTasks) {
  for (let i = 0; i < numTasks; i++) {
    yield {
      text: (i + 1).toString(),
      subtasks: [],
      done: false,
    };
  }
}

/** @type {TodoItem} */
const initialTodos = [
  {
    text: "Groceries",
    subtasks: [],
    done: false,
  },
  {
    text: "Dishes",
    subtasks: [
      {
        text: "Plate",
        subtasks: [],
        done: false,
      },
      {
        text: "Cup",
        subtasks: [],
        done: true,
      },
      {
        text: "Pan",
        subtasks: [
          {
            text: "Handle. Make sure to thoroughly wash the joint and the screw as someone has apparently decided to try to scoop some butter with it and now it's stuck there. I tried to get it out of there but it solidified or something idk.",
            done: false,
            subtasks: [],
          },
          {
            text: "Body",
            done: false,
            subtasks: [],
          }
        ],
        done: false,
      },
    ],
    done: false,
  },
  {
    text: "Walk da dog",
    subtasks: [],
    done: false,
  },
  ...dummyTaskGenerator(70),
];

export function getTodos() {
  const fromStorage = localStorage.getItem('todos');
  if (!fromStorage) {
    return initialTodos;
  }
  return JSON.parse(fromStorage);
}
export function onTodosUpdate(todos) {
  // TODO debounce?
  localStorage.setItem('todos', JSON.stringify(todos));
}
