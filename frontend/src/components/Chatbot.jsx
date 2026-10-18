import { useEffect } from 'react';

// Chatbot de atención (widget de Elfsight). Carga su script una sola vez.
export default function Chatbot() {
  useEffect(() => {
    if (document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) return;

    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="elfsight-app-aadee34f-2ce1-44a2-8f2b-f12d0742c2a5"
      data-elfsight-app-lazy
    ></div>
  );
}
