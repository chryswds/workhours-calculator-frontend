// App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [workDays, setWorkDays] = useState([
    { day: 'Monday', startTime: '08:00', endTime: '17:00' },
    { day: 'Tuesday', startTime: '08:00', endTime: '14:00' },
    { day: 'Wednesday', startTime: '', endTime: '' },
    { day: 'Thursday', startTime: '', endTime: '' },
    { day: 'Friday', startTime: '', endTime: '' },
    { day: 'Saturday', startTime: '', endTime: '' },
    { day: 'Sunday', startTime: '', endTime: '' }
  ]);
  
  const [totalHours, setTotalHours] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (index, field, value) => {
    const updatedWorkDays = [...workDays];
    updatedWorkDays[index] = { ...updatedWorkDays[index], [field]: value };
    setWorkDays(updatedWorkDays);
  };

  const calculateHours = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Filter out days with empty times
      const filledWorkDays = workDays.filter(day => 
        day.startTime.trim() !== '' && day.endTime.trim() !== ''
      );
      
      const response = await fetch('http://localhost:8080/calculate-hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ workDays: filledWorkDays }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to calculate work hours');
      }
      
      const data = await response.json();
      setTotalHours(data.totalHours);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Weekly Work Hours Calculator</h1>
      
      <div className="work-schedule">
        <div className="header-row">
          <div className="day-column">Day</div>
          <div className="time-column">Start Time</div>
          <div className="time-column">End Time</div>
        </div>
        
        {workDays.map((workDay, index) => (
          <div className="day-row" key={workDay.day}>
            <div className="day-column">{workDay.day}</div>
            <div className="time-column">
              <input
                type="time" 
                value={workDay.startTime}
                onChange={(e) => handleInputChange(index, 'startTime', e.target.value)}
              />
            </div>
            <div className="time-column">
              <input
                type="time" 
                value={workDay.endTime}
                onChange={(e) => handleInputChange(index, 'endTime', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      
      <button 
        className="calculate-button" 
        onClick={calculateHours}
        disabled={loading}
      >
        {loading ? 'Calculating...' : 'Calculate Total Hours'}
      </button>
      
      {error && <div className="error-message">Error: {error}</div>}
      
      {totalHours !== null && (
        <div className="result">
          <h2>Total Weekly Hours: {totalHours.toFixed(2)}</h2>
        </div>
      )}
    </div>
  );
}

export default App;