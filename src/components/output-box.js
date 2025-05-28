import { executeCode } from '../utils/api.js';

class OutputBox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.language = this.getAttribute('language') || 'javascript';
        this.theme = this.getAttribute('theme') || 'dark';
        this.editorInstance = null;
    }

    connectedCallback() {
        this.render();
    }

    setLanguage(language) {
        this.language = language;
    }

    setEditor(editor) {
        this.editorInstance = editor;
    }

    async runCode() {
        if (!this.editorInstance) return;

        const code = this.editorInstance.getValue();
        this.setLoading(true);

        try {
            const { run: result } = await executeCode(this.language, code);
            const output = result.output.split("\n").map(line => `<div>${line}</div>`).join("");
            const isError = !!result.stderr;
            this.shadowRoot.querySelector("#output").innerHTML = output || "No output";
            this.shadowRoot.querySelector("#output").className = isError ? "output-container error" : "output-container";
        } catch (err) {
            this.shadowRoot.querySelector("#output").innerHTML = "Error: " + err.message;
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(loading) {
        const outputDiv = this.shadowRoot.querySelector("#output");
        if (loading) {
            outputDiv.innerHTML = 'Running...';
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }

                :host([theme="light"]) .output-container {
                    background: #f6f8fa;
                    color: #222;
                    border: 1px solidrgb(24, 24, 24);
                }

                h3 {
                    margin-bottom: 0.5rem;
                    color: ${this.theme === "light" ? "#2563eb" : "#aad3ff"};
                    font-size: 1.1rem;
                    font-weight: 500;
                }

                .output-container {
                    border-radius: 7px;
                    margin-top: 2px;
                    padding: 14px 16px;
                    border: 1px solid #222430;
                    background: #191b1f;
                    color: #f6f6f6;
                    min-height: 120px;
                    max-height: 220px;
                    overflow-y: auto;
                    white-space: pre-wrap;
                    font-family: 'Fira Mono', 'Consolas', monospace;
                    font-size: 1.05rem;
                    letter-spacing: 0.01em;
                    box-shadow: 0 0.5px 2px rgba(40,40,40,0.06);
                }

                .output-container.error {
                    border: 2px solid #fa7b7b;
                    color: #ffaeae;
                    background: #2c1d1d;
                }

                .output-container::-webkit-scrollbar {
                    width: 10px;
                }

                .output-container::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #334155 60%, #475569 100%);
                    border-radius: 7px;
                }

                .output-container::-webkit-scrollbar-track {
                    background: #222430;
                    border-radius: 7px;
                }

                .output-container::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #2563eb 30%, #1e40af 90%);
                }
            </style>
            
            <div id="host">
                <h3>Output</h3>
                <div id="output" class="output-container">Click "Run Code" to see the output here.</div>
            </div>
        `;
    }
}

customElements.define('output-box', OutputBox);
