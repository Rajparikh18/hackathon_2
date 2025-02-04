import { useState } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [filePath, setFilePath] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      setMessage('Uploading...');
      const response = await axios.post('/api/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFilePath(response.data.file_path);
      setMessage('Upload successful!');
    } catch (error) {
      setMessage('Upload failed.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>Upload</button>
      {message && <p>{message}</p>}
      {filePath && (
        <div>
          <p>File uploaded successfully:</p>
          <a href={filePath} target="_blank" rel="noopener noreferrer">View File</a>
        </div>
      )}
    </div>
  );
}

export default App
