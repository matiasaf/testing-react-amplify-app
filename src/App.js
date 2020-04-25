import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState(null);
  const [newTodo, setNewTodo] = useState(null);
  const [loader, setLoader] = useState(null);
  const getItems = async () => {
    setLoader(true);
    const res = await axios.get(
      'https://m8occ5xqx1.execute-api.us-east-2.amazonaws.com/dev/todos'
    );    
    setLoader(false);
    setTodos(res.data);
  };
  const handleChangeValue = async (todo) => {
    const _todos = todos.map((_todo) => {
      if (_todo.id == todo.id) return { ...todo, checked: !todo.checked };
      else return _todo;
    });
    setTodos(_todos);
    await axios.put(
      `https://m8occ5xqx1.execute-api.us-east-2.amazonaws.com/dev/todos/${todo.id}`,
      {
        id: todo.id,
        text: todo.text,
        checked: !todo.checked,
      }
    );
  };
  const handleDeleteItem = async (todo) => {
    const _todos = todos.filter((_todo) => _todo.id !== todo.id);
    setTodos(_todos);
    await axios.delete(
      `https://m8occ5xqx1.execute-api.us-east-2.amazonaws.com/dev/todos/${todo.id}`
    );
  };
  const handleChangeText = (value) => setNewTodo(value);
  const handleCreateTodo = async () => {
    setLoader(true);
    const res = await axios.post(
      'https://m8occ5xqx1.execute-api.us-east-2.amazonaws.com/dev/todos',
      { text: newTodo }
    );
    setLoader(false);
    setTodos([...todos, res.data]);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <div className="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
      <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
        <div className="mb-4">
          <h1 className="text-grey-darkest">Todo List</h1>
          <div className="flex mt-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
              placeholder="Add Todo"
              value={newTodo ? newTodo : ''}
              onChange={(e) => handleChangeText(e.target.value)}
            />
            <button
              onClick={() => handleCreateTodo()}
              className="flex-no-shrink p-2 border-2 rounded text-teal border-teal hover:text-white hover:bg-teal"
            >
              Add
            </button>
          </div>
        </div>
        <div>
          {todos &&
            todos.map((todo) => (
              <div className="flex mb-4 items-center" key={todo.id}>
                <p
                  className={
                    todo.checked
                      ? 'w-full line-through text-green'
                      : 'w-full text-grey-darkest'
                  }
                >
                  {todo.text}
                </p>
                {todo.checked && (
                  <button
                    onClick={() => handleChangeValue(todo)}
                    className="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-green border-green hover:bg-green"
                  >
                    Not Done
                  </button>
                )}
                {!todo.checked && (
                  <button
                    onClick={() => handleChangeValue(todo)}
                    className="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-grey border-grey hover:bg-grey"
                  >
                    Done
                  </button>
                )}
                <button
                  onClick={() => handleDeleteItem(todo)}
                  className="flex-no-shrink p-2 ml-2 border-2 rounded text-red border-red hover:text-white hover:bg-red"
                >
                  Remove
                </button>
              </div>
            ))}
          {loader && <i className="fas fa-circle-notch fa-spin fa-5x spinner"></i>}
        </div>
      </div>
    </div>
  );
}

export default App;
