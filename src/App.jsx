import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [time, setTime] = useState(() => {
    const savedTime = localStorage.getItem('time');
    return savedTime ? parseInt(savedTime, 10) : 0;
  });

  const timerRef = useRef(null);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const startTimer = () => {
    if (timerRef.current !== null) return; // Prevent multiple timers
    timerRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setTime(0);
  };

  useEffect(() => {
    localStorage.setItem('time', time);
  }, [time]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const days = Math.floor(time / 86400);
  const percentage = ((time % 86400) / 86400) * 100;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center mt-10">
        <header className="text-4xl font-bold mb-8">NOFAP COUNTER</header>
      </div>

      <main className="flex flex-col items-center">
        <div className="text-9xl font-bold mb-8">{formatTime(time)}</div>

        <div className="w-full max-w-2xl">
          <div className="relative h-12 bg-gray-300  mb-4">
            <div className="absolute h-12 bg-gray-700 " style={{
              width: `${percentage}%`,
            }}>
              <span className="absolute left-0 right-0 text-white text-lg font-bold text-center mt-2 ml-5cls">{percentage.toFixed(2)}%</span>
            </div>
          </div>
          <div className="flex justify-between text-lg">
            <span>0</span>
            <span>{days} Dias</span>
            <span>90</span>
          </div>
        </div>

        <div className="flex space-x-8 mt-8">
          <button onClick={startTimer} className="w-48 h-32 rounded bg-blue-700 text-white text-xl">Iniciar</button>
          <button onClick={resetTimer} className="w-48 h-32 rounded bg-red-700 text-white text-xl">Resetar</button>
        </div>
      </main>

      <footer className="text-lg mt-16">Desenvolvido por @devRukasu</footer>
    </div>
  );
}

export default App;
