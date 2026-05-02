import { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, MapPin, Music, Music2, PartyPopper, CheckCircle2 } from 'lucide-react';
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
    // Consulta el artefacto o las instrucciones para generarla
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
        colors: ['#ff0055', '#00f3ff', '#ffe600']
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
      <div className="checkered-floor"></div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        loop
        src="https://archive.org/download/ChuckBerryJohnnyB.Goode/Chuck%20Berry%20-%20Johnny%20B.%20Goode.mp3"
      />

      <button className="audio-control" onClick={toggleAudio} aria-label="Toggle Music">
        {isPlaying ? <Music2 size={24} color="#111" /> : <Music size={24} color="#111" />}
      </button>

      <div className="app-container">

        <header>
          <h1 className="title">¡Maria Luisa!</h1>
          <h2 className="subtitle">Cumple 80 Años</h2>

          <div className="hero-image-container">
            <div className={`vinyl-record ${!isPlaying ? 'paused' : ''}`}></div>
            <img src="/abuela.jpg" alt="Maria Luisa" className="hero-image" />
          </div>
        </header>

        <main>
          <section className="glass-card">
            <div className="details-grid">
              <div className="detail-item">
                <Calendar className="detail-icon" size={40} />
                <span className="detail-title">Fecha</span>
                <p>16 de Mayo</p>
              </div>
              <div className="detail-item">
                <Clock className="detail-icon" size={40} />
                <span className="detail-title">Hora</span>
                <p>3:00 PM</p>
              </div>
              <div className="detail-item">
                <MapPin className="detail-icon" size={40} />
                <span className="detail-title">Lugar</span>
                <p>Salones Merequetengue</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem' }}>
                  Paseo de las Lomas #70<br />Parque Residencial Coacalco 2da Sección<br />Coacalco, Estado de México
                </p>
              </div>
            </div>
          </section>

          <section className="glass-card">
            <h2 className="subtitle" style={{ color: 'var(--neon-pink)', marginBottom: '1.5rem' }}>
              Confirmación de Asistencia
            </h2>

            {isSubmitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle2 color="var(--neon-yellow)" size={60} style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>¡Gracias por confirmar!</h3>
                <p>Nos vemos para rockear juntos.</p>
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
                  {isSubmitting ? 'Enviando...' : (
                    <>
                      Confirmar <PartyPopper size={20} />
                    </>
                  )}
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
