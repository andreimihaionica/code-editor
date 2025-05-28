import { CODE_SNIPPETS } from '../utils/constants.js';

class CodeEditor extends HTMLElement {
    constructor() {
        super();
        this.language = this.getAttribute('language') || 'javascript';
        this.theme = this.getAttribute('theme') || 'dark';
        this.editor = null;
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
                label, select, h3 {
                    font-family: roboto, sans-serif;
                    color: white;
                }

                .editor-wrapper {
                    background: #23272e;
                    border-radius: 14px;
                    box-shadow: 0 4px 32px rgba(0,0,0,0.25), 0 1.5px 8px rgba(0,0,0,0.16);
                    width: 640px;
                    max-width: 100vw;
                    padding: 2rem 2rem 1.2rem 2rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-bottom: 2rem;
                }

                .editor-topbar {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 0.3rem;
                    gap: 1rem;
                }

                .editor-container {
                    height: 340px;
                    padding: 0;
                    border-radius: 10px;
                    border: 1px solid #383b42;
                    background: #22242a;
                    box-shadow: 0 0 4px 1px #23232344;
                    color: #fff;
                    overflow: hidden;
                    transition: box-shadow 0.2s;
                }

                .editor-container:focus-within {
                    box-shadow: 0 0 8px 2px #2563eb88;
                    border-color: #2563eb;
                }

                #editor {
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                }

                output-box {
                    width: 100%;
                    display: block;
                }

                /* Ligt mode styles */
                .editor-wrapper.light {
                    background: #f6f8fa;
                    box-shadow: 0 4px 32px rgba(40,40,40,0.09), 0 1.5px 8px rgba(80,80,80,0.07);
                }
                .editor-wrapper.light .editor-container {
                    border: 1px solid #c0c5ce;
                    background: #fff;
                    color: #333;
                }
                .editor-wrapper.light label,
                .editor-wrapper.light select,
                .editor-wrapper.light h3 {
                    color: #2d3a4e;
                }

                /* Responsive styles */
                @media (max-width: 700px) {
                    .editor-wrapper {
                        width: 98vw;
                        min-width: 0;
                        padding: 1rem 0.5rem 1rem 0.5rem;
                    }
                    .editor-container {
                        height: 250px;
                    }
                }
            </style>
            
            <div class="editor-wrapper${this.theme === 'light' ? ' light' : ''}">
                <div class="editor-topbar">
                    <language-selector language="${this.language}" theme="${this.theme}"></language-selector>
                    <run-button></run-button>
                </div>

                <div class="editor-container">
                    <div id="editor"></div>
                </div>

                <output-box language="${this.language}" theme="${this.theme}"></output-box>
            </div>
        `;

        this.langSelector = this.querySelector('language-selector');
        this.runBtn = this.querySelector('run-button');
        this.editorContainer = this.querySelector('#editor');
        this.outputBox = this.querySelector('output-box');

        this.addEventListener('language-change', e => {
            this.language = e.detail;
            this.editor.setValue(CODE_SNIPPETS[this.language]);
            this.editor.getModel().setLanguage(this.language);
            this.outputBox.setLanguage(this.language);
        });

        this.runBtn.addEventListener('run', async () => {
            this.runBtn.setLoading(true);
            try {
                await this.outputBox.runCode();
            } finally {
                this.runBtn.setLoading(false);
            }
        });

        require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@latest/min/vs' } });
        require(['vs/editor/editor.main'], () => {
            this.editor = monaco.editor.create(this.editorContainer, {
                value: CODE_SNIPPETS[this.language],
                language: this.language,
                theme: this.theme === 'light' ? 'vs-light' : 'vs-dark',
                minimap: { enabled: false },
                fontSize: 15,
                fontFamily: 'Fira Mono, Consolas, monospace',
                lineNumbers: 'on',
                padding: { top: 12, bottom: 12 }
            });
            this.outputBox.setEditor(this.editor);
        });
    }
}

customElements.define('code-editor', CodeEditor);
