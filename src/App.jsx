import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false
    };
    
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="container">
      <div className="todo-card">
        <header>
          <h1>✨ My Tasks</h1>
          <p className="subtitle">오늘의 할 일을 멋지게 관리해보세요.</p>
        </header>

        <form onSubmit={addTodo} className="input-group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="할 일을 입력하세요..."
            className="todo-input"
          />
          <button type="submit" className="add-button">
            추가
          </button>
        </form>

        <ul className="todo-list">
          {todos.length === 0 ? (
            <li className="empty-state">할 일이 없습니다. 새로운 일을 추가해보세요!</li>
          ) : (
            todos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <div className="todo-content" onClick={() => toggleTodo(todo.id)}>
                  <span className="checkbox"></span>
                  <span className="todo-text">{todo.text}</span>
                </div>
                <button 
                  className="delete-button"
                  onClick={() => deleteTodo(todo.id)}
                  aria-label="삭제"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                  </svg>
                </button>
              </li>
            ))
          )}
        </ul>

        {todos.length > 0 && (
          <footer className="todo-footer">
            <span>남은 할 일: {todos.filter(t => !t.completed).length}개</span>
          </footer>
        )}
      </div>
    </div>
  )
}

export default App
