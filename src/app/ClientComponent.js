"use client";
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ClientComponent({ initialConfig }) {
  const [name, setName] = useState(initialConfig.name);
  const [asset, setAsset] = useState(initialConfig.asset);
  const [previewHtml, setPreviewHtml] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert to Base64
      const reader = new FileReader();
      reader.onload = () => {
        setAsset(reader.result); // Base64 data
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate a local preview
  const generatePreview = () => {
    const html = `
      <html>
        <body style="font-family: sans-serif; text-align: center;">
          <h1>Hello ${name}, how are you?</h1>
          ${asset ? `<img src="${asset}" style="max-width:300px;" />` : ''}
        </body>
      </html>
    `;
    setPreviewHtml(html);
  };

  // Save changes to Supabase
  const saveChanges = async () => {
    try {
      const config = {
        name,
        asset
      };

      console.log('Sending config:', config); // Debug log

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      console.log('Config saved successfully:', data);
    } catch (error) {
      console.error('Error saving config:', error);
      // Optionally show error to user
      alert(`Failed to save: ${error.message}`);
    }
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Name:{' '}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
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
      <button onClick={generatePreview} style={{ marginRight: '10px' }}>
        Generate Preview
      </button>
      <button onClick={saveChanges}>Save to DB</button>

      <h2>Preview</h2>
      <iframe
        title="Live Preview"
        srcDoc={previewHtml}
        style={{ width: '100%', height: '300px', border: '1px solid #ccc' }}
      />
    </div>
  );
}