import "./App.css";
import { useState, useEffect } from "react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();
mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";
// u can change the mic language to the language u want
// https://ourcodeworld.com/articles/read/362/getting-started-with-the-speech-recognition-api-in-javascript

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("stopped Mic on Click");
      };
    }
    mic.onstart = () => {
      console.log("Mics on");
    };
    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      console.log(transcript);
      setNote(transcript);
      mic.onerror = (event) => {
        console.log(event.error);
      };
    };
  };

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note]);
    setNote("");
  };
  return (
    <div className="bg-gray-200 h-[100vh]">
      <h1 className="text-[25px] font-bold p-8">Voice Notes</h1>
      <div className="w-[90%] mx-auto sm:flex space-y-5  sm:space-x-5 sm:space-y-0 ">
        <div className="sm:w-1/2 bg-white h-[343px] p-6  shadow-xl shadow-zinc-700 rounded-md">
          <h2 className="text-[20px] font-bold pb-6 ">Current Note</h2>
          <div className="flex justify-between items-center">
            <div>{isListening ? <span>🎙</span> : <span>🛑</span>}</div>
            <div className="space-x-3 ">
              <button
                onClick={handleSaveNote}
                disabled={!note}
                className="text-sm border p-1 rounded-md cursor-pointer"
              >
                Save Note
              </button>
              <button
                onClick={() => setIsListening((prevState) => !prevState)}
                className="text-sm border p-1 rounded-md"
              >
                Start/Stop
              </button>
            </div>
          </div>
          <p>{note}</p>
        </div>

        <div className="sm:w-1/2 bg-white h-[343px] p-6  shadow-xl shadow-zinc-700 rounded-md">
          <h2 className="text-[20px] font-bold pb-6 ">Notes</h2>
          {savedNotes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
