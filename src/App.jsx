import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    // 기존 데이터에 날짜가 없을 경우 오늘 날짜를 기본값으로 설정
    const today = new Date().toISOString().split('T')[0];
    const parsedTodos = savedTodos ? JSON.parse(savedTodos) : [];
    return parsedTodos.map(todo => ({
      ...todo,
      date: todo.date || today
    }));
  });

  const [inputValue, setInputValue] = useState('');
  const [inputTime, setInputTime] = useState('09:00'); // 기본 시간 설정
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      time: inputTime, // 시간 추가
      completed: false,
      date: selectedDate
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

  // 달력 관련 로직
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    return { firstDay, days };
  };

  const { firstDay, days } = getDaysInMonth(currentMonth);
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= days; i++) calendarDays.push(i);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  // 할 일을 시간순으로 정렬
  const filteredTodos = todos
    .filter(todo => todo.date === selectedDate)
    .sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));

  const formatMonth = (date) => {
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day + 1)
      .toISOString().split('T')[0];
    setSelectedDate(dateStr);
  };

  const hasTodo = (day) => {
    if (!day) return false;
    const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day + 1)
      .toISOString().split('T')[0];
    return todos.some(t => t.date === dateStr);
  };

  return (
    <div className="container">
      <div className="app-grid">
        <div className="calendar-card">
          <div className="calendar-header">
            <button onClick={prevMonth}>&lt;</button>
            <h2>{formatMonth(currentMonth)}</h2>
            <button onClick={nextMonth}>&gt;</button>
          </div>
          <div className="calendar-grid">
            {['일', '월', '화', '수', '목', '금', '토'].map(d => <div key={d} className="weekday">{d}</div>)}
            {calendarDays.map((day, i) => {
              const dateStr = day ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day + 1).toISOString().split('T')[0] : null;
              const isSelected = dateStr === selectedDate;
              return (
                <div 
                  key={i} 
                  className={`day ${!day ? 'empty' : ''} ${isSelected ? 'selected' : ''} ${hasTodo(day) ? 'has-todo' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  {day}
                  {hasTodo(day) && <span className="dot"></span>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="todo-card">
          <header>
            <h1>📅 {selectedDate}</h1>
            <p className="subtitle">이 날의 할 일을 관리하세요.</p>
          </header>

          <form onSubmit={addTodo} className="input-group">
            <div className="input-row">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="할 일을 입력하세요..."
                className="todo-input"
              />
              <input
                type="time"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className="time-input"
              />
            </div>
            <button type="submit" className="add-button">추가</button>
          </form>

          <ul className="todo-list">
            {filteredTodos.length === 0 ? (
              <li className="empty-state">이 날은 할 일이 없습니다.</li>
            ) : (
              filteredTodos.map(todo => (
                <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <div className="todo-content" onClick={() => toggleTodo(todo.id)}>
                    <span className="checkbox"></span>
                    <div className="todo-info">
                      <span className="todo-time">{todo.time || '시간 미지정'}</span>
                      <span className="todo-text">{todo.text}</span>
                    </div>
                  </div>
                  <button className="delete-button" onClick={() => deleteTodo(todo.id)} aria-label="삭제">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </li>
              ))
            )}
          </ul>

          {filteredTodos.length > 0 && (
            <footer className="todo-footer">
              <span>남은 할 일: {filteredTodos.filter(t => !t.completed).length}개</span>
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
