import { useEffect, useRef } from 'react';
import './SiteFooter.css';



export default function SiteFooter() {
 

  return (
    <footer className="site-footer">

   

      {/* ── main content ── */}
      <div className="site-footer__inner">

        {/* left */}
        <div className="site-footer__project">
          <div className="site-footer__title">Measuring the Universe</div>
          <div className="site-footer__sub">
            How Edwin Hubble proved Andromeda was another galaxy
          </div>
          <div className="site-footer__credit">
            Built by{' '}
            <a
              href="https://github.com/mute1111"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__link"
            >
              Almgdad Z Hassan
            </a>
          </div>
        </div>

        {/* right */}
        <div className="site-footer__links">

          <a
            href="https://github.com/mute1111"
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer__icon-link"
            aria-label="GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            <span>mute1111</span>
          </a>

          <a
            href="mailto:mug.zuher@gmail.com"
            className="site-footer__icon-link site-footer__icon-link--email"
            aria-label="Send email"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M2 7l10 7 10-7"/>
            </svg>
            <span>mug.zuher@gmail.com</span>
          </a>

        </div>

      </div>

      {/* ── bottom bar ── */}
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Almgdad Z Hassan</span>
        <span className="site-footer__sep">·</span>
        <span>Science content based on the work of Hubble, Leavitt, Hertzsprung &amp; Goodricke</span>
      </div>

    </footer>
  );
}