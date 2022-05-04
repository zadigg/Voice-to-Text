import "./App.css";
import { useState, useEffect } from "react";
import options from "./Languages";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();
mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";
// u can change the mic language to the language u want
//ourcodeworld.com/articles/read/362/getting-started-with-the-speech-recognition-api-in-javascript

function App() {
  const [language, setLanguage] = useState("en-US");
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);

  var str = "";

  if (savedNotes.length > 0) {
    for (var i = 0; i < savedNotes.length; i++) {
      str += savedNotes[i] + "\n";
    }
  }

  console.log(str);
  useEffect(() => {
    handleListen();
  }, [isListening]);

  function handleLanguageChange(e) {
    setLanguage(e.target.value);
  }
  const handleListen = () => {
    if (isListening) {
      mic.lang = language;
      mic.start();
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
      <h1 className="text-[25px] font-bold p-8">Voice Notes {language}</h1>
      <div className="px-8 pb-5">
        <select
          value={language}
          onChange={handleLanguageChange}
          className=" appearance-none block w-[20%] px-3 py-1.5  text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition  ease-in-out m-0
      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        >
          {options.map((option) =>
            option.countryCodes.map((country) => (
              <option key={country.country} value={country.langCode}>
                {option.language === "English" ||
                option.language === "Español" ||
                option.language === "Português"
                  ? country.country
                  : option.language}
              </option>
            ))
          )}
        </select>
      </div>
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
          <div className="flex items-center justify-between ">
            <div className="text-[20px] font-bold pb-6">Notes</div>
            <div
              className="bg-gray-100 px-2 py-1 rounded-md hover:animate-pulse cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(str);
              }}
            >
              Copy
            </div>
          </div>
          {savedNotes.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
