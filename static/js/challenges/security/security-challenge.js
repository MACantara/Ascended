class SecurityChallenge {
    static currentChallenge = 'cipher';
    static attempts = 0;

    static load(titleElement, contentElement) {
        titleElement.textContent = "Security Console - Cyber Defense";
        Hints.setChallenge('security');
        this.render(contentElement);
    }

    static render(container) {
        container.innerHTML = `
            <div class="puzzle-container">
                <div class="flex mb-4">
                    <button onclick="SecurityChallenge.switchChallenge('cipher')" 
                            class="challenge-tab mr-2 px-4 py-2 rounded ${this.currentChallenge === 'cipher' ? 'bg-red-600' : 'bg-gray-600'}">
                        <i class="bi bi-key"></i> Cipher Decoder
                    </button>
                    <button onclick="SecurityChallenge.switchChallenge('threats')" 
                            class="challenge-tab px-4 py-2 rounded ${this.currentChallenge === 'threats' ? 'bg-red-600' : 'bg-gray-600'}">
                        <i class="bi bi-bug"></i> Threat Detection
                    </button>
                </div>

                <div id="challenge-content">
                    ${this.currentChallenge === 'cipher' ? this.renderCipherChallenge() : this.renderThreatChallenge()}
                </div>
            </div>
        `;
    }

    static renderCipherChallenge() {
        return `
            <div>
                <h4 class="text-lg font-bold mb-2">Decode the Encrypted Message</h4>
                <p class="text-gray-300 mb-4">
                    A suspicious encrypted message was intercepted. Decode it to reveal the hidden information.
                </p>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <h5 class="font-bold mb-2">Encrypted Message</h5>
                        <div class="bg-red-900 border border-red-600 p-4 rounded font-mono text-red-200">
                            URYYB JBEYQ! GUVF VF N FRPERG ZRFFNTR.
                        </div>

                        <div class="mt-4">
                            <h5 class="font-bold mb-2">Cipher Type</h5>
                            <select id="cipher-type" class="w-full bg-gray-700 border border-gray-600 rounded p-2">
                                <option value="">Select cipher type...</option>
                                <option value="caesar">Caesar Cipher</option>
                                <option value="atbash">Atbash Cipher</option>
                                <option value="reverse">Reverse Cipher</option>
                            </select>
                        </div>

                        <div class="mt-4">
                            <h5 class="font-bold mb-2">Shift Value (for Caesar)</h5>
                            <input type="range" id="shift-value" min="1" max="25" value="13" 
                                   class="w-full" oninput="SecurityChallenge.updateShiftDisplay()">
                            <div class="flex justify-between text-sm text-gray-400 mt-1">
                                <span>1</span>
                                <span id="shift-display">13</span>
                                <span>25</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h5 class="font-bold mb-2">Decoded Message</h5>
                        <div id="decoded-output" class="bg-gray-900 border border-gray-600 p-4 rounded font-mono min-h-[100px]">
                            <span class="text-gray-500">Select a cipher type and adjust settings...</span>
                        </div>

                        <div class="mt-4">
                            <button onclick="SecurityChallenge.decodeCipher()" 
                                    class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded mr-2">
                                <i class="bi bi-unlock"></i> Decode
                            </button>
                            <button onclick="SecurityChallenge.submitDecoded()" 
                                    class="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
                                <i class="bi bi-check-circle"></i> Submit
                            </button>
                        </div>

                        <div id="cipher-feedback" class="mt-4 text-sm"></div>
                    </div>
                </div>
            </div>
        `;
    }

    static renderThreatChallenge() {
        const threats = [
            { id: 1, type: 'malware', content: 'suspicious_file.exe', risk: 'high', isReal: true },
            { id: 2, type: 'phishing', content: 'urgent_payment_required.email', risk: 'medium', isReal: true },
            { id: 3, type: 'legitimate', content: 'system_update.msi', risk: 'low', isReal: false },
            { id: 4, type: 'malware', content: 'game_crack.zip', risk: 'high', isReal: true },
            { id: 5, type: 'legitimate', content: 'document.pdf', risk: 'low', isReal: false }
        ];

        return `
            <div>
                <h4 class="text-lg font-bold mb-2">Identify Security Threats</h4>
                <p class="text-gray-300 mb-4">
                    Review the following files and emails. Mark suspicious items as threats.
                </p>

                <div class="space-y-3">
                    ${threats.map(threat => `
                        <div class="threat-item bg-gray-800 border border-gray-600 p-4 rounded" data-threat="${threat.id}">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <i class="bi bi-${this.getThreatIcon(threat.type)} text-2xl mr-3"></i>
                                    <div>
                                        <div class="font-mono text-sm">${threat.content}</div>
                                        <div class="text-xs text-gray-400">Risk Level: 
                                            <span class="risk-${threat.risk}">${threat.risk.toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex space-x-2">
                                    <button onclick="SecurityChallenge.markThreat(${threat.id}, true)" 
                                            class="threat-btn bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">
                                        Threat
                                    </button>
                                    <button onclick="SecurityChallenge.markThreat(${threat.id}, false)" 
                                            class="safe-btn bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">
                                        Safe
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="mt-6">
                    <button onclick="SecurityChallenge.submitThreatAnalysis()" 
                            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                        <i class="bi bi-shield-check"></i> Submit Analysis
                    </button>
                </div>

                <div id="threat-results" class="mt-4"></div>
            </div>
        `;
    }

    static switchChallenge(type) {
        this.currentChallenge = type;
        const container = document.getElementById('challenge-content');
        container.innerHTML = type === 'cipher' ? this.renderCipherChallenge() : this.renderThreatChallenge();
    }

    static updateShiftDisplay() {
        const value = document.getElementById('shift-value').value;
        document.getElementById('shift-display').textContent = value;
        this.decodeCipher();
    }

    static decodeCipher() {
        const encryptedText = "URYYB JBEYQ! GUVF VF N FRPERG ZRFFNTR.";
        const cipherType = document.getElementById('cipher-type').value;
        const shift = parseInt(document.getElementById('shift-value').value);
        const output = document.getElementById('decoded-output');

        let decoded = '';
        
        switch(cipherType) {
            case 'caesar':
                decoded = this.caesarCipher(encryptedText, shift);
                break;
            case 'atbash':
                decoded = this.atbashCipher(encryptedText);
                break;
            case 'reverse':
                decoded = encryptedText.split('').reverse().join('');
                break;
            default:
                output.innerHTML = '<span class="text-gray-500">Select a cipher type...</span>';
                return;
        }

        output.innerHTML = `<span class="text-green-400">${decoded}</span>`;
    }

    static caesarCipher(text, shift) {
        return text.replace(/[A-Z]/g, char => {
            return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
        });
    }

    static atbashCipher(text) {
        return text.replace(/[A-Z]/g, char => {
            return String.fromCharCode(90 - (char.charCodeAt(0) - 65));
        });
    }

    static submitDecoded() {
        const output = document.getElementById('decoded-output').textContent.trim();
        const feedback = document.getElementById('cipher-feedback');
        
        if (output === "HELLO WORLD! THIS IS A SECRET MESSAGE.") {
            feedback.innerHTML = '<div class="text-green-400">✅ Correct! Message decoded successfully.</div>';
            this.completeCipherChallenge();
        } else {
            this.attempts++;
            feedback.innerHTML = `<div class="text-red-400">❌ Incorrect decoding. Attempts: ${this.attempts}/3</div>`;
            
            if (this.attempts >= 3) {
                feedback.innerHTML += '<div class="text-yellow-400 mt-2">Hint: Try ROT13 (shift value 13)</div>';
            }
        }
    }

    static markThreat(threatId, isThreat) {
        const threatElement = document.querySelector(`[data-threat="${threatId}"]`);
        threatElement.dataset.marked = isThreat;
        
        // Visual feedback
        threatElement.classList.remove('border-red-400', 'border-green-400');
        threatElement.classList.add(isThreat ? 'border-red-400' : 'border-green-400');
    }

    static submitThreatAnalysis() {
        const correctAnswers = { 1: true, 2: true, 3: false, 4: true, 5: false };
        const results = document.getElementById('threat-results');
        let correct = 0;
        let total = Object.keys(correctAnswers).length;

        const analysis = Object.keys(correctAnswers).map(threatId => {
            const element = document.querySelector(`[data-threat="${threatId}"]`);
            const marked = element?.dataset.marked === 'true';
            const expected = correctAnswers[threatId];
            const isCorrect = marked === expected;
            
            if (isCorrect) correct++;
            
            return { threatId, marked, expected, isCorrect };
        });

        results.innerHTML = `
            <div class="bg-gray-800 p-4 rounded">
                <h5 class="font-bold mb-2">Analysis Results: ${correct}/${total} Correct</h5>
                ${analysis.map(item => `
                    <div class="text-sm mb-1 ${item.isCorrect ? 'text-green-400' : 'text-red-400'}">
                        Threat ${item.threatId}: ${item.isCorrect ? '✅' : '❌'} 
                        (You marked: ${item.marked ? 'Threat' : 'Safe'}, 
                        Correct: ${item.expected ? 'Threat' : 'Safe'})
                    </div>
                `).join('')}
            </div>
        `;

        if (correct === total) {
            setTimeout(() => this.completeThreatChallenge(), 1500);
        }
    }

    static getThreatIcon(type) {
        const icons = {
            malware: 'bug-fill',
            phishing: 'envelope-exclamation',
            legitimate: 'file-earmark-check'
        };
        return icons[type] || 'question-circle';
    }

    static completeCipherChallenge() {
        const reward = {
            item: {
                id: 'encryption-key',
                name: 'Encryption Key',
                icon: '🔐',
                description: 'Decrypts secure communications',
                quantity: 1
            },
            message: 'Cipher decoded! You earned an Encryption Key!',
            unlock: null
        };
        
        setTimeout(() => {
            window.game.completeChallenge('security', reward);
            window.game.closeChallenge();
        }, 2000);
    }

    static completeThreatChallenge() {
        const reward = {
            item: {
                id: 'security-scanner',
                name: 'Security Scanner',
                icon: '🛡️',
                description: 'Detects security vulnerabilities',
                quantity: 1
            },
            message: 'Threats identified! You earned a Security Scanner!',
            unlock: null
        };
        
        setTimeout(() => {
            window.game.completeChallenge('security', reward);
            window.game.closeChallenge();
        }, 2000);
    }
}