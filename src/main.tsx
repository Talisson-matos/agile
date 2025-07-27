import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import Message from './Message.tsx';
import { BrowserRouter, Routes, Route } from "react-router";
import Formatador from './Formatador.tsx';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/message" element={<Message />} />
        <Route path="/formatador" element={<Formatador />} />
      </Routes>
    </BrowserRouter>

  </StrictMode>,
)
