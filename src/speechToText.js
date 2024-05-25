import React, { useState, useEffect } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import './App.css';

const SpeechToText = () => {
  const [listening, setListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [currentChat, setCurrentChat] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }
    
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript + ' ';
        }
      }
      setFinalTranscript((prev) => prev + final);
      setInterimTranscript(interim);
    };

    recognition.onend = () => {
      setCurrentChat((prevChat) => prevChat + finalTranscript);
      setFinalTranscript('');
      setInterimTranscript('');
    };

    if (listening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [listening, finalTranscript]);

  const toggleListening = () => {
    setListening(prev => !prev);
  };

  // Function to count the number of words in the transcript
  const countWords = (text) => {
    return text.trim().split(/\s+/).length;
  };

  return (
    <div className="speech-to-text">
      <h1>Speech to Text Converter</h1>
      <div className={`microphone-button ${listening ? 'listening' : ''}`} onClick={toggleListening}>
        <div className={`circle ${listening ? 'animate' : ''}`}>
          <FaMicrophone className="mic-icon" />
        </div>
      </div>
      <textarea
        className="text-area"
        value={currentChat + interimTranscript} 
        readOnly
        style={{ minHeight: countWords(currentChat + interimTranscript) > 500 ? 'auto' : '200px' }}
        aria-label="Transcript"
      />
    </div>
  );
};

export default SpeechToText;