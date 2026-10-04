import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production HTML is prerendered (see scripts/prerender.mjs) → hydrate it; dev server renders on the client
if (container.dataset.ssr !== undefined) hydrateRoot(container, app)
else createRoot(container).render(app)
