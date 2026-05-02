import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import './index.css';

function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', asistencia: 'sí', mensaje: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const audioRef = useRef(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date("2026-05-16T15:00:00-06:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);


  const enterParty = () => {
    setHasEntered(true);
    // Try to play audio immediately after user interaction
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Start with 50% volume so it's not too loud
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.log("Audio play failed on enter:", e);
      });
    }
  };

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
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffb6c1', '#a8e6cf', '#ffd700']
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error enviando datos:', error);
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
      {/* Overlay to bypass autoplay restrictions */}
      {!hasEntered && (
        <div className="party-overlay">
          <h1>¡Estás Invitado!</h1>
          <button className="enter-btn" onClick={enterParty}>Entrar a la Fiesta 🎸</button>
        </div>
      )}

      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        loop 
        src={`${import.meta.env.BASE_URL}Lunares_y_cuero.mp3`} 
      />

      <div className="audio-hint">
        {isPlaying ? 'Silenciar ⏸' : 'Música ▶'}
      </div>
      <button className="audio-control" onClick={toggleAudio} aria-label="Toggle Music">
        {isPlaying ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        )}
      </button>

      <div className="app-container">
        
        <header>
          <h1 className="title">¡MARIA LUISA!</h1>
          <h2 className="subtitle">CUMPLE 80 AÑOS</h2>
          
          <div className="turntable-container">
            
            <div className="turntable-platter">
              <div className={`vinyl-grooves ${!isPlaying ? 'paused' : ''}`}></div>
              <div className="vinyl-label"></div>
              <div className="vinyl-hole"></div>

            </div>
            
            <div className={`tonearm ${!isPlaying ? 'paused' : ''}`}>
              <div className="tonearm-base"></div>
              <div className="tonearm-head"></div>
            </div>
          </div>
        </header>

        {/* Section 1: Bienvenida */}
        <section className="glass-card">
          <div className="card-decor decor-note decor-note-1">♫</div>
          <h2 className="section-title">¡Vamos a Rockear!</h2>
          <p className="section-text">
            Prepárate para viajar en el tiempo. Celebraremos 80 años de vida, amor, familia y por supuesto... ¡mucho Rock & Roll! Nos encantaría que nos acompañes en este día tan especial para Maria Luisa.
          </p>
        </section>

        {/* Section 1.5: Countdown */}
        <section className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--vintage-pink)' }}>La fiesta comienza en:</h2>
          <div className="countdown-container">
            <div className="countdown-box">
              <span className="countdown-number">{timeLeft.days}</span>
              <span className="countdown-label">Días</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-number">{timeLeft.hours}</span>
              <span className="countdown-label">Hrs</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-number">{timeLeft.minutes}</span>
              <span className="countdown-label">Min</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-number">{timeLeft.seconds}</span>
              <span className="countdown-label">Seg</span>
            </div>
          </div>
        </section>

        {/* Section 2: Detalles del Evento */}
        <section className="glass-card">
          <div className="card-decor decor-note decor-note-2">♪</div>
          <h2 className="section-title">Detalles de la Fiesta</h2>
          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/>
                </svg>
              </div>
              <span className="detail-title">Fecha</span>
              <p className="detail-text">16 de Mayo</p>
            </div>
            <div className="detail-item">
              <div className="detail-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
              </div>
              <span className="detail-title">Hora</span>
              <p className="detail-text">3:00 PM</p>
            </div>
            <div className="detail-item">
              <div className="detail-icon-wrapper">
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

        {/* Section 3: Código de Vestimenta */}
        <section className="glass-card" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Código de Vestimenta</h2>
          <p className="section-text">
            <strong>¡Años 60s!</strong> Saca tus faldas de lunares, chaquetas de cuero, lentes oscuros y peinados altos. ¡Ven listo para brillar en la pista de baile!
          </p>
        </section>

        {/* Section 4: Formulario */}
        <section className="glass-card">
          <h2 className="section-title">Confirma tu Asistencia</h2>
          
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--vintage-cyan)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem' }}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Rye', color: 'var(--vintage-pink)' }}>¡Gracias!</h3>
              <p className="detail-text">Tu lugar en la pista de baile está asegurado.</p>
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
      </div>
    </>
  );
}

export default App;
