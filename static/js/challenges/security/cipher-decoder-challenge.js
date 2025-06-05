class CipherDecoderChallenge {
    static attempts = 0;

    static load(titleElement, contentElement) {
        titleElement.textContent = "Cipher Decoder";
        Hints.setChallenge('cipher');
        this.render(contentElement);
    }

    static render(container) {
        container.innerHTML = `
            <div class="puzzle-container">
                <div class="mb-4">
                    <h4 class="text-lg font-bold mb-2">Decode the Encrypted Message</h4>
                    <p class="text-gray-300 mb-4">
                        A suspicious encrypted message was intercepted. Decode it to reveal the hidden information.
                    </p>
                </div>

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
                                   class="w-full" oninput="CipherDecoderChallenge.updateShiftDisplay()">
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
                            <button onclick="CipherDecoderChallenge.decodeCipher()" 
                                    class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded mr-2">
                                <i class="bi bi-unlock"></i> Decode
                            </button>
                            <button onclick="CipherDecoderChallenge.submitDecoded()" 
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
            this.completePuzzle();
        } else {
            this.attempts++;
            feedback.innerHTML = `<div class="text-red-400">❌ Incorrect decoding. Attempts: ${this.attempts}/3</div>`;
            
            if (this.attempts >= 3) {
                feedback.innerHTML += '<div class="text-yellow-400 mt-2">Hint: Try ROT13 (shift value 13)</div>';
            }
        }
    }

    static completePuzzle() {
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
        }, 2000);
    }
}
