import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [assistantSettings, setAssistantSettings] = useState({
    voice: 'female',
    speed: 1.0,
    pitch: 1.0,
    volume: 0.8,
    language: 'en-US'
  });
  const [currentSession, setCurrentSession] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);

  useEffect(() => {
    initializeVoiceRecognition();
    initializeSpeechSynthesis();
    startNewSession();
  }, []);

  const initializeVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = assistantSettings.language;
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          processVoiceCommand(finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        Swal.fire('Error', 'Speech recognition failed. Please try again.', 'error');
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      Swal.fire('Error', 'Speech recognition is not supported in this browser.', 'error');
    }
  };

  const initializeSpeechSynthesis = () => {
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    } else {
      Swal.fire('Error', 'Speech synthesis is not supported in this browser.', 'error');
    }
  };

  const startNewSession = () => {
    const sessionId = `VOICE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCurrentSession({
      sessionId,
      startTime: new Date(),
      commands: []
    });
    setConversation([]);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const processVoiceCommand = async (command) => {
    setIsProcessing(true);
    
    // Add user message to conversation
    const userMessage = {
      type: 'user',
      text: command,
      timestamp: new Date()
    };
    setConversation(prev => [...prev, userMessage]);

    try {
      // Process command with AI
      const response = await axios.post('http://localhost:4451/api/voice/process-command', {
        command,
        sessionId: currentSession.sessionId,
        context: {
          currentAppointment: null,
          currentMedication: [],
          lastVitals: null,
          roomSettings: null
        }
      });

      const aiResponse = response.data;
      
      // Add AI response to conversation
      const aiMessage = {
        type: 'assistant',
        text: aiResponse.response,
        timestamp: new Date(),
        intent: aiResponse.intent,
        confidence: aiResponse.confidence
      };
      setConversation(prev => [...prev, aiMessage]);

      // Speak the response
      speakText(aiResponse.response);

      // Update session
      setCurrentSession(prev => ({
        ...prev,
        commands: [...prev.commands, {
          command,
          intent: aiResponse.intent,
          confidence: aiResponse.confidence,
          response: aiResponse.response,
          timestamp: new Date()
        }]
      }));

    } catch (error) {
      console.error('Error processing voice command:', error);
      const errorMessage = {
        type: 'assistant',
        text: "I'm sorry, I couldn't process that command. Please try again.",
        timestamp: new Date(),
        isError: true
      };
      setConversation(prev => [...prev, errorMessage]);
      speakText("I'm sorry, I couldn't process that command. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text) => {
    if (synthesisRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = assistantSettings.speed;
      utterance.pitch = assistantSettings.pitch;
      utterance.volume = assistantSettings.volume;
      
      // Try to set voice
      const voices = synthesisRef.current.getVoices();
      const selectedVoice = voices.find(voice => 
        voice.name.includes(assistantSettings.voice === 'female' ? 'Female' : 'Male')
      );
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      synthesisRef.current.speak(utterance);
    }
  };

  const getIntentIcon = (intent) => {
    switch (intent) {
      case 'schedule_appointment': return '📅';
      case 'check_medication': return '💊';
      case 'update_vitals': return '📊';
      case 'emergency_call': return '🚨';
      case 'nurse_call': return '👩‍⚕️';
      case 'doctor_call': return '👨‍⚕️';
      case 'room_control': return '🏠';
      case 'information_query': return '❓';
      case 'medication_reminder': return '⏰';
      default: return '🤖';
    }
  };

  const getIntentColor = (intent) => {
    switch (intent) {
      case 'emergency_call': return 'text-red-600 bg-red-100';
      case 'nurse_call': return 'text-blue-600 bg-blue-100';
      case 'doctor_call': return 'text-green-600 bg-green-100';
      case 'schedule_appointment': return 'text-purple-600 bg-purple-100';
      case 'check_medication': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">🎤 Voice-Controlled Medical Assistant</h1>
                <p className="text-purple-100">Natural language processing for medical commands</p>
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                ⚙️
              </button>
            </div>
          </div>
        </div>

        {/* Voice Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <div className="mb-6">
              <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-6xl transition-all duration-300 ${
                isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : isProcessing 
                    ? 'bg-yellow-500 text-white animate-spin' 
                    : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600'
              }`}>
                {isListening ? '🎤' : isProcessing ? '⏳' : '🤖'}
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Ready to Help'}
              </h2>
              
              <div className="flex justify-center space-x-4">
                {!isListening ? (
                  <button
                    onClick={startListening}
                    disabled={isProcessing}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🎤 Start Listening
                  </button>
                ) : (
                  <button
                    onClick={stopListening}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200"
                  >
                    ⏹️ Stop Listening
                  </button>
                )}
                
                <button
                  onClick={startNewSession}
                  className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                >
                  🔄 New Session
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversation History</h3>
          
          {conversation.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">💬</div>
              <p>Start a conversation by clicking "Start Listening" and speaking your command.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                        : message.isError
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'assistant' && (
                        <span className="text-lg">{getIntentIcon(message.intent)}</span>
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.text}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-75">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                          {message.confidence && (
                            <span className="text-xs opacity-75">
                              {Math.round(message.confidence * 100)}% confidence
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Commands */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Commands</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { command: 'Schedule my next appointment', intent: 'schedule_appointment' },
              { command: 'What medications do I need?', intent: 'check_medication' },
              { command: 'Update my vital signs', intent: 'update_vitals' },
              { command: 'Call the nurse', intent: 'nurse_call' },
              { command: 'Call the doctor', intent: 'doctor_call' },
              { command: 'Emergency call', intent: 'emergency_call' },
              { command: 'What\'s my condition?', intent: 'information_query' },
              { command: 'Set medication reminder', intent: 'medication_reminder' }
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => processVoiceCommand(item.command)}
                disabled={isProcessing}
                className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${getIntentColor(item.intent)}`}
              >
                <div className="text-lg mb-1">{getIntentIcon(item.intent)}</div>
                <div className="text-xs">{item.command}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Voice Settings</h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Voice</label>
                    <select
                      value={assistantSettings.voice}
                      onChange={(e) => setAssistantSettings({...assistantSettings, voice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Speed: {assistantSettings.speed}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={assistantSettings.speed}
                      onChange={(e) => setAssistantSettings({...assistantSettings, speed: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pitch: {assistantSettings.pitch}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={assistantSettings.pitch}
                      onChange={(e) => setAssistantSettings({...assistantSettings, pitch: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Volume: {Math.round(assistantSettings.volume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={assistantSettings.volume}
                      onChange={(e) => setAssistantSettings({...assistantSettings, volume: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      value={assistantSettings.language}
                      onChange={(e) => setAssistantSettings({...assistantSettings, language: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="en-US">English (US)</option>
                      <option value="en-GB">English (UK)</option>
                      <option value="es-ES">Spanish</option>
                      <option value="fr-FR">French</option>
                      <option value="de-DE">German</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowSettings(false);
                      if (recognitionRef.current) {
                        recognitionRef.current.lang = assistantSettings.language;
                      }
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VoiceAssistant;

