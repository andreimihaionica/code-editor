import { LANGUAGE_VERSIONS } from '../utils/constants.js';

class LanguageSelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const selected = this.getAttribute('language') || 'javascript';
        const theme = this.getAttribute('theme') || 'dark';
        
        this.shadowRoot.innerHTML = `
            <style>
                label {
                    font-size: 1rem;
                    font-weight: 500;
                    color: ${theme === 'light' ? '#2563eb' : '#aad3ff'};
                    margin-bottom: 5px;
                    display: inline-block;
                }

                select {
                    padding: 7px 14px;
                    font-size: 1rem;
                    border-radius: 8px;
                    border: 1px solid ${theme === 'light' ? '#c0c5ce' : '#383b42'};
                    background: ${theme === 'light' ? '#f6f8fa' : '#23272e'};
                    color: ${theme === 'light' ? '#2d3a4e' : '#e0e6ed'};
                    min-width: 140px;
                    cursor: pointer;
                    outline: none;
                    transition: border-color 0.3s;
                    box-shadow: 0 1px 5px rgba(44,62,80,0.04);
                }

                select:hover {
                    border-color: #2563eb;
                    background: ${theme === 'light' ? '#eef4fd' : '#272b33'};
                }

                select:focus {
                    border-color: #2563eb;
                    box-shadow: 0 0 6px 0 #2563eb66;
                    background: ${theme === 'light' ? '#dceafe' : '#232a3b'};
                }
            </style>
            
            <label>Language:</label><br/>
            <select id="language">
                ${Object.entries(LANGUAGE_VERSIONS).map(([lang, ver]) =>
                    `<option value="${lang}" ${lang === selected ? "selected" : ""}>
                    ${lang} (${ver})
                </option>`).join('')}
            </select>
        `;

        this.shadowRoot.querySelector('#language').addEventListener('change', e => {
            this.dispatchEvent(new CustomEvent('language-change', {
                detail: e.target.value,
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define('language-selector', LanguageSelector);
