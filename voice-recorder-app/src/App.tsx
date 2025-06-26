import React from 'react';
import VoiceRecorder from './components/VoiceRecorder';

function App() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>웹 음성 녹음 서비스</h1>
      <VoiceRecorder />
    </div>
  );
}

export default App;
