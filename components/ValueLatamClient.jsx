'use client';

import { useEffect, useMemo } from 'react';
import { valueLatamMarkup } from '@/lib/valueLatamMarkup';
import { valueLatamScripts } from '@/lib/valueLatamScripts';

function loadScript(def) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    if (def.type) script.type = def.type;
    script.dataset.valueLatamRuntime = 'true';
    if (def.src) {
      script.src = def.src;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error('No se pudo cargar ' + def.src));
    } else {
      script.textContent = def.content || '';
      setTimeout(resolve, 0);
    }
    document.body.appendChild(script);
  });
}

export default function ValueLatamClient() {
  const scripts = useMemo(() => JSON.parse(valueLatamScripts), []);

  useEffect(() => {
    if (window.__valueLatamBooted) return;
    window.__valueLatamBooted = true;

    let cancelled = false;
    (async () => {
      for (const def of scripts) {
        if (cancelled) return;
        try {
          await loadScript(def);
        } catch (error) {
          console.warn('[Value Latam]', error);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [scripts]);

  return <div dangerouslySetInnerHTML={{ __html: valueLatamMarkup }} />;
}
