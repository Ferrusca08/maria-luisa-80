import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import './index.css';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', asistencia: 'sí', mensaje: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const audioRef = useRef(null);

  // Toggle Audio
  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.submitter?.blur(); // Removes focus from button
    e.preventDefault();
    setIsSubmitting(true);
    
    // Configura tu URL de Google Apps Script aquí
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyyapuaRXY2dhis0p9mG2UlrkQK1Ge2Tn3ezALERpkFsivp1wcV6NK8nNuz4TCTUE_d6A/exec';
    
    try {
      // Intento de enviar a Google Sheets
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Necesario para Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      // Lanzar confeti!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffb6c1', '#a8e6cf', '#ffd700']
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error enviando datos:', error);
      // Fallback para demostración: Mostramos confeti de todas formas
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        loop 
        src="https://archive.org/download/ChuckBerryJohnnyB.Goode/Chuck%20Berry%20-%20Johnny%20B.%20Goode.mp3" 
      />

      <button className="audio-control" onClick={toggleAudio} aria-label="Toggle Music">
        {isPlaying ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        )}
      </button>

      <div className="app-container">
        
        <header>
          <h1 className="title">¡MARIA LUISA!</h1>
          <h2 className="subtitle">CUMPLE 80 AÑOS</h2>
          
          <div className="turntable-container">
            <div className="suspended-mic">
              <div className="mic-cable"></div>
              <div className="mic-head"></div>
            </div>
            
            <div className="turntable-platter">
              <div className={`vinyl-grooves ${!isPlaying ? 'paused' : ''}`}></div>
              <div className="vinyl-label"></div>
              <div className="vinyl-hole"></div>
              <div className={`vinyl-label-text ${!isPlaying ? 'paused' : ''}`}>
                <svg viewBox="0 0 100 100">
                  <path id="curve" d="M 12 50 A 38 38 0 1 1 88 50 A 38 38 0 1 1 12 50" fill="transparent" />
                  <text width="100%" fill="#fff" fontSize="8" fontWeight="bold" letterSpacing="0.5">
                    <textPath href="#curve" startOffset="0%"> MARIA LUISA'S ROCKIN' 80TH BIRTHDAY MIX </textPath>
                  </text>
                </svg>
              </div>
            </div>
            
            <div className={`tonearm ${!isPlaying ? 'paused' : ''}`}>
              <div className="tonearm-base"></div>
              <div className="tonearm-head"></div>
            </div>
          </div>
        </header>

        <main style={{width: '100%'}}>
          <section className="glass-card">
            <div className="card-decor decor-note decor-note-1">♫</div>
            <div className="card-decor decor-note decor-note-2">♪</div>
            
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-icon-wrapper">
                  {/* Retro Calendar SVG */}
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/>
                  </svg>
                </div>
                <span className="detail-title">Fecha</span>
                <p className="detail-text">16 de Mayo</p>
              </div>
              <div className="detail-item">
                <div className="detail-icon-wrapper">
                  {/* Retro Clock SVG */}
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                </div>
                <span className="detail-title">Hora</span>
                <p className="detail-text">3:00 PM</p>
              </div>
              <div className="detail-item">
                <div className="detail-icon-wrapper">
                  {/* Retro Route/Sign SVG */}
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <span className="detail-title">Lugar</span>
                <p className="detail-text">Salones Merequetengue</p>
                <p style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '0.5rem' }}>
                  Paseo de las Lomas #70<br />Parque Residencial Coacalco 2da Sección<br />Coacalco, Estado de México
                </p>
              </div>
            </div>
          </section>

          <section className="glass-card">
            <h2 className="subtitle" style={{ width: '100%', marginBottom: '1.5rem', background: 'transparent', border: 'none', boxShadow: 'none' }}>
              Confirmación de Asistencia
            </h2>
            
            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--vintage-pink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem' }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Rye', color: 'var(--vintage-cyan)' }}>¡Gracias!</h3>
                <p className="detail-text">Nos vemos para rockear juntos.</p>
              </div>
            ) : (
              <form className="rsvp-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre Completo</label>
                  <input 
                    type="text" 
                    id="nombre" 
                    name="nombre" 
                    required 
                    placeholder="Tu nombre aquí..."
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="asistencia">¿Asistirás?</label>
                  <select 
                    id="asistencia" 
                    name="asistencia" 
                    value={formData.asistencia}
                    onChange={handleInputChange}
                  >
                    <option value="sí">¡Oh sí, ahí estaré!</option>
                    <option value="no">No podré asistir :(</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="mensaje">Mensaje para Maria Luisa (Opcional)</label>
                  <input 
                    type="text" 
                    id="mensaje" 
                    name="mensaje" 
                    placeholder="Escribe tus buenos deseos..."
                    value={formData.mensaje}
                    onChange={handleInputChange}
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Confirmar 🎸'}
                </button>
              </form>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

export default App;
