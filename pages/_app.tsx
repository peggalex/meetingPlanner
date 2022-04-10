import '../styles/globals.css'
import type { AppProps } from 'next/app'
import '../styles/tailwindColours.css';
import '../styles/fonts.css';
import { createContext, useEffect, useState } from 'react';

export const MouseDownContext = createContext({ isMouseDown: false});

function MyApp({ Component, pageProps }: AppProps) {
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    ['mousedown', 'touchstart'].forEach(evtName =>
      document.addEventListener(evtName, () => setIsMouseDown(true))
    );

    ['mouseup', 'touchend', 'visibilitychange'].forEach(evtName => 
      document.addEventListener(evtName, () => {
          console.log('mouseup caused by', evtName);
          setIsMouseDown(false);
      })
    ); // don't use 'mouseleave' here, doesn't work with DeleteHoverWrapper
    document.body.addEventListener('mouseup', () => {
      setIsMouseDown(false);
    });
  }, []);

  return <MouseDownContext.Provider value={{isMouseDown}}>
    <Component {...pageProps} />
  </MouseDownContext.Provider>;
}

export default MyApp
