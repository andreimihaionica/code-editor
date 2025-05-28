class RunButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.loading = false;
    }

    setLoading(isLoading) {
        this.loading = isLoading;
        const btn = this.shadowRoot.querySelector('button');
        if (btn) {
            btn.disabled = isLoading;
            btn.textContent = isLoading ? "Running..." : "Run Code";
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                button {
                    background: linear-gradient(90deg,#2563eb,#1e40af);
                    color: #fff;
                    border: none;
                    border-radius: 6px;
                    padding: 8px 18px;
                    font-size: 1rem;
                    cursor: pointer;
                    font-weight: 500;
                    box-shadow: 0 1px 8px rgba(44,62,80,0.08);
                    transition: background 0.2s, box-shadow 0.2s;
                }

                button:hover:not(:disabled) {
                    background: linear-gradient(90deg,#1e40af,#2563eb);
                    box-shadow: 0 2px 14px rgba(44,62,80,0.12);
                }
                    
                button:disabled {
                    background: #999;
                    cursor: not-allowed;
                }
            </style>

            <button type="button">Run Code</button>
        `;

        this.shadowRoot.querySelector('button').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('run', {
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define('run-button', RunButton);
