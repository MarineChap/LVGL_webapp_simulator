import React, { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [manifest, setManifest] = useState(null)
  const [version, setVersion] = useState('')
  const [flavor, setFlavor] = useState('')
  const [status, setStatus] = useState('Loading manifest...')
  const [isRunning, setIsRunning] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}manifest.json`)
      .then(res => res.json())
      .then(data => {
        setManifest(data)
        const firstVersion = Object.keys(data.versions)[0]
        setVersion(firstVersion)
        setFlavor(data.versions[firstVersion][0])
        setStatus('Ready')
      })
      .catch(err => {
        console.error('Failed to load manifest:', err)
        setStatus('Error: Could not load manifest')
      })
  }, [])

  const handleRun = () => {
    if (!canvasRef.current) return;

    setIsRunning(true);
    setStatus(`Initializing ${flavor}...`)

    // Initialize global Module for Emscripten
    window.Module = {
      canvas: canvasRef.current,
      print: (text) => console.log(`[SIM] ${text}`),
      printErr: (text) => console.error(`[SIM ERROR] ${text}`),
      onRuntimeInitialized: () => {
        setStatus(`Running ${flavor} (${version})`);
      }
    };

    const script = document.createElement('script');
    script.id = 'simulator-script';
    script.src = `${import.meta.env.BASE_URL}assets/${version}/${flavor}/lvgl_sim.js`;
    document.body.appendChild(script);
  }

  const handleStop = () => {
    // Emscripten doesn't support clean unloading of a WASM module easily.
    // The safest and most common way in development is to reload.
    window.location.reload();
  }

  if (!manifest) return <div className="App"><div className="status-bar">{status}</div></div>

  return (
    <div className="App">
      <header className="header">
        <h1>LVGL UI Simulator</h1>
        <p>Project from the espressif_template_project used as an example</p>
      </header>

      <div className="controls">
        <div className="control-group">
          <label>Version</label>
          <select value={version} disabled={isRunning} onChange={(e) => {
            setVersion(e.target.value);
            setFlavor(manifest.versions[e.target.value][0]);
          }}>
            {Object.keys(manifest.versions).map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>System name</label>
          <select value={flavor} disabled={isRunning} onChange={(e) => setFlavor(e.target.value)}>
            {manifest.versions[version].map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="actions">
          {!isRunning ? (
            <button className="btn btn-start" onClick={handleRun}>
              <span>▶</span> Start Simulator
            </button>
          ) : (
            <button className="btn btn-stop" onClick={handleStop}>
              <span>⏹</span> Stop & Reset
            </button>
          )}
        </div>
      </div>

      <div className="display-area">
        <div className="simulator-outer">
          <div className="simulator-container">
            <canvas id="canvas" ref={canvasRef} width="480" height="800"></canvas>
          </div>
        </div>
      </div>

      <div className={`status-bar ${status.includes('Error') ? 'error' : ''}`}>
        {status}
      </div>
    </div>
  )
}

export default App
