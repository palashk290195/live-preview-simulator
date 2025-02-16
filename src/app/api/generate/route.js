// src/app/api/generate/route.js
export async function POST(request) {
    const { name, asset } = await request.json();
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <h1>Hello ${name}, how are you?</h1>
          ${asset ? `<img src="${asset}" alt="Uploaded Asset" />` : ''}
        </body>
      </html>
    `;
    return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html' } });
  }