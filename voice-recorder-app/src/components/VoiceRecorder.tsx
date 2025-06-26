import React, { Component } from 'react';

interface VoiceRecorderState {
  recordedBlob: Blob | null;
  recording: boolean;
}

class VoiceRecorder extends Component<{}, VoiceRecorderState> {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: BlobPart[] = [];
  constructor(props: {}) {
    super(props);
    this.state = {
      recordedBlob: null,
      recording: false,
    };
  }

  startRecording = async () => {
    if (this.state.recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.setState({ recordedBlob: blob, recording: false });
      };
      this.mediaRecorder.start();
      this.setState({ recording: true, recordedBlob: null });
    } catch (err) {
      console.error('녹음 오류:', err);
      alert('마이크 권한을 허용했는지 확인해주세요.');
    }
  };

  stopRecording = () => {
    if (this.mediaRecorder && this.state.recording) {
      this.mediaRecorder.stop();
    }
  };

  _downloadRecording = () => {
    const { recordedBlob } = this.state;
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'recording.webm';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  render() {
    const { recordedBlob } = this.state;
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>음성 녹음기</h2>
        <button
          onClick={this.state.recording ? this.stopRecording : this.startRecording}
          style={{ padding: '10px 20px', margin: '10px' }}
        >
          {this.state.recording ? '녹음 종료' : '녹음 시작'}
        </button>
        {recordedBlob && (
          <div>
            <audio controls src={URL.createObjectURL(recordedBlob)} style={{ margin: '10px' }} />
            <button onClick={this._downloadRecording} style={{ padding: '10px 20px' }}>
              다운로드
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default VoiceRecorder;
