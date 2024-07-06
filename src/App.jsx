import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);
  const [db, setDb] = useState(null);
  const [loadedFromDB, setLoadedFromDB] = useState(false);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Inicializa o IndexedDB
  useEffect(() => {
    const request = indexedDB.open('nofap_db', 1);

    request.onerror = function (event) {
      console.error('Erro ao abrir o banco de dados:', event.target.errorCode);
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      setDb(db);
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      db.createObjectStore('timer', { keyPath: 'id' });
    };
  }, []);

  // Recupera o tempo salvo do IndexedDB ao montar o componente
  useEffect(() => {
    async function getTimeFromDB() {
      if (db && !loadedFromDB) {
        const transaction = db.transaction(['timer'], 'readonly');
        const store = transaction.objectStore('timer');
        const request = store.get(1);

        request.onsuccess = function (event) {
          const savedTime = event.target.result?.time || 0;
          setTime(savedTime); // Define o tempo inicial
          timerRef.current = savedTime; // Atualiza o valor de timerRef.current com o tempo salvo
          startTimer(savedTime); // Inicia o cronômetro com o tempo inicial recuperado
          setLoadedFromDB(true); // Marca como carregado do IndexedDB
        };

        request.onerror = function (event) {
          console.error('Erro ao recuperar o tempo do IndexedDB:', event.target.error);
        };
      }
    }
    getTimeFromDB();
    startTimer();
  }, [db, loadedFromDB]);

  // Salva o tempo atual no IndexedDB sempre que 'time' muda
  useEffect(() => {
    async function saveTimeToDB() {
      if (db && loadedFromDB) {
        const transaction = db.transaction(['timer'], 'readwrite');
        const store = transaction.objectStore('timer');
        await store.put({ id: 1, time });
        console.log('Tempo salvo com sucesso no IndexedDB:', time);
      }
    }
    saveTimeToDB();
  }, [time, db, loadedFromDB]);

  const startTimer = (initialTime) => {
    if (timerRef.current === null) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);

      // Ajusta o tempo inicial se necessário
      if (initialTime > 0) {
        setTime(initialTime);
      }
    }
  };

  const resetTimer = async () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setTime(0); // Reseta o tempo localmente para zero
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center justify-center mt-10">
        <header className="text-4xl font-bold mb-8">NOFAP COUNTER</header>
      </div>

      <main className="flex flex-col items-center">
        <div className="text-9xl font-bold mb-8">{formatTime(time)}</div>

        <div className="w-full max-w-2xl">
          <div className="relative h-12 bg-gray-300 mb-4">
            <div
              className="absolute h-12 bg-gray-700"
              style={{ width: `${((time % 86400) / 86400) * 100}%` }}
            >
              <span className="absolute left-0 right-0 text-white text-lg font-bold text-center mt-2 ml-4">
                {(((time % 86400) / 86400) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="flex justify-between text-lg">
            <span>0</span>
            <span>{Math.floor(time / 86400)} Dias</span>
            <span>90</span>
          </div>
        </div>

        <div className="flex space-x-8 mt-8">
          <button
            onClick={() => startTimer(time)}
            className="w-48 h-32 rounded bg-blue-700 text-white text-xl transition duration-300 ease-in-out transform hover:bg-blue-800 hover:shadow-md focus:outline-none"
          >
            Iniciar
          </button>
          <button
            onClick={resetTimer}
            className="w-48 h-32 rounded bg-red-700 text-white text-xl transition duration-300 ease-in-out transform hover:bg-red-800 hover:shadow-md focus:outline-none"
          >
            Resetar
          </button>
        </div>
      </main>

      <footer className="text-lg mt-16">Desenvolvido por @devRukasu</footer>
    </div>
  );
}

export default App;
