import { useState } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');
  const [preview, setPreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    
    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      alert('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      console.log('Processing image...');
      const response = await axios.post('/api/processImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data.result);
    } catch (error) {
      console.error('Error processing image:', error);
      setResult('Error: ' + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Image Processor</h1>
      
      <div className="space-y-4">
        <div>
          <input 
            type="file" 
            onChange={handleImageChange} 
            accept="image/*"
            className="mb-2"
          />
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Process Image
          </button>
        </div>

        {preview && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Selected Image:</h3>
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-md rounded shadow"
            />
          </div>
        )}

        {result && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Result:</h3>
            <div className="p-4 border rounded bg-gray-50">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default App
