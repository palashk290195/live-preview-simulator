"use client";
// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [previewHtml, setPreviewHtml] = useState('');

  // Handle file selection and save the file object.
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Convert the selected file to a Base64 string.
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // When the form is submitted, send the data to our API route.
  const handleSubmit = async (e) => {
    e.preventDefault();

    let base64Asset = '';
    if (file) {
      try {
        base64Asset = await convertFileToBase64(file);
      } catch (err) {
        console.error('Error converting file to Base64:', err);
      }
    }

    // Call the API route with the name and asset.
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, asset: base64Asset })
    });
    const html = await response.text();
    setPreviewHtml(html);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Live Preview Demo</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Name:{' '}
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              style={{ padding: '5px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Asset (Image):{' '}
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>
        <button type="submit" style={{ padding: '10px 15px' }}>Generate Preview</button>
      </form>

      <h2>Preview</h2>
      <iframe
        title="Live Preview"
        srcDoc={previewHtml}
        style={{ width: '100%', height: '300px', border: '1px solid #ccc' }}
      ></iframe>
    </div>
  );
}