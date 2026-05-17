const fs = require('fs');

// Only run on Vercel or CI environments
if (process.env.VERCEL) {
  const targetPath = './src/app/environments/environment.ts';
  const envConfigFile = `export const environment = {
  production: true,
  mapboxToken: '${process.env.MAPBOX_TOKEN || ''}',
  groqApiKey: '${process.env.GROQ_API_KEY || ''}',
  groqModel: 'llama-3.3-70b-versatile',
  groqApiUrl: 'https://api.groq.com/openai/v1/chat/completions',
  mapboxGeocodingUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places'
};
`;

  // Create the directory if it doesn't exist
  const dir = './src/app/environments';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write the file
  fs.writeFileSync(targetPath, envConfigFile);
  console.log(`Environment variables generated at ${targetPath}`);
}
