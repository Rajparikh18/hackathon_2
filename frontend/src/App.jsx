import { useState } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [image, setImage] = useState(null)

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
    console.log(e.target.files[0]);
  }

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('image', image)

    try {
      console.log('Uploading image...')
      const response = await axios.post('/api/captureimage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(response.data)
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  return (
    <>
      <div>
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleSubmit}>Capture Image</button>
      </div>
    </>
  )
}

export default App
