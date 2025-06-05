class Hints {
    static currentChallenge = null;
    static hintLevel = 0;

    static setChallenge(challengeType) {
        this.currentChallenge = challengeType;
        this.hintLevel = 0;
    }

    static getHint(level = null) {
        if (!this.currentChallenge) return null;
        
        const targetLevel = level || this.hintLevel + 1;
        const hints = this.getHintsForChallenge(this.currentChallenge);
        
        if (hints && hints[targetLevel - 1]) {
            this.hintLevel = Math.max(this.hintLevel, targetLevel);
            Progress.useHint();
            return {
                level: targetLevel,
                hint: hints[targetLevel - 1],
                isLastHint: targetLevel >= hints.length
            };
        }
        
        return null;
    }

    static getHintsForChallenge(challengeType) {
        const hintData = {
            coding: [
                "Look at the function name and think about what it should return.",
                "Check if you're handling all the edge cases, like empty inputs.",
                "The missing code should check if the array length is greater than 0."
            ],
            networking: [
                "Start by identifying which devices need to connect to the router.",
                "Remember that switches connect multiple devices, while routers connect networks.",
                "The server should connect to the switch, and the switch should connect to the router."
            ],
            security: [
                "Caesar ciphers shift each letter by a fixed number of positions.",
                "Try different shift values. Common ones are 3, 13, or 25.",
                "The shift value for this cipher is 13 (ROT13)."
            ],
            hardware: [
                "Check if all power connections are properly seated.",
                "RAM issues often cause boot failures - try reseating the memory.",
                "The loose RAM stick in slot 2 is causing the boot failure."
            ],
            ai: [
                "Look at the patterns in the training data to understand the categories.",
                "Features like file size and extension are good indicators.",
                "Images typically have extensions like .jpg, .png and larger file sizes."
            ]
        };

        return hintData[challengeType];
    }

    static render(container) {
        container.innerHTML = `
            <div class="slide-in">
                <h3 class="text-xl font-bold mb-4 text-cyan-400">
                    <i class="bi bi-lightbulb"></i> Tech Assistant
                </h3>
                
                ${this.currentChallenge ? this.renderActiveHints() : this.renderGeneralHelp()}
            </div>
        `;
    }

    static renderActiveHints() {
        const hints = this.getHintsForChallenge(this.currentChallenge);
        const challengeNames = {
            coding: 'Code Terminal',
            networking: 'Network Configuration',
            security: 'Security Console',
            hardware: 'Hardware Diagnostics',
            ai: 'AI Laboratory'
        };

        return `
            <div class="bg-gray-700 p-4 rounded mb-4">
                <h4 class="font-bold mb-2">
                    Current Challenge: ${challengeNames[this.currentChallenge]}
                </h4>
                <p class="text-sm text-gray-300 mb-3">
                    Need help? Get hints below, but using them may affect your score.
                </p>
                
                <div class="space-y-3">
                    ${hints.map((hint, index) => {
                        const level = index + 1;
                        const isRevealed = level <= this.hintLevel;
                        const canReveal = level === this.hintLevel + 1;
                        
                        return `
                            <div class="bg-gray-800 p-3 rounded">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="font-medium">Hint Level ${level}</span>
                                    ${canReveal ? `
                                        <button onclick="Hints.revealHint(${level})" 
                                                class="bg-yellow-600 hover:bg-yellow-700 px-2 py-1 rounded text-xs">
                                            Reveal Hint
                                        </button>
                                    ` : ''}
                                </div>
                                <div class="${isRevealed ? '' : 'blur-sm select-none'} text-sm">
                                    ${isRevealed ? hint : 'Click "Reveal Hint" to see this guidance.'}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            
            <div class="text-center">
                <button onclick="Hints.clearChallenge()" 
                        class="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded text-sm">
                    <i class="bi bi-arrow-left"></i> Back to General Help
                </button>
            </div>
        `;
    }

    static renderGeneralHelp() {
        return `
            <div class="space-y-4">
                <div class="bg-gray-700 p-4 rounded">
                    <h4 class="font-bold mb-2">
                        <i class="bi bi-info-circle"></i> How to Play
                    </h4>
                    <ul class="text-sm space-y-1 text-gray-300">
                        <li>• Click on interactive elements to start challenges</li>
                        <li>• Solve puzzles to earn tools and unlock new areas</li>
                        <li>• Use your inventory items to solve advanced puzzles</li>
                        <li>• Complete challenges to earn badges and progress</li>
                    </ul>
                </div>

                <div class="bg-gray-700 p-4 rounded">
                    <h4 class="font-bold mb-2">
                        <i class="bi bi-controller"></i> Controls
                    </h4>
                    <ul class="text-sm space-y-1 text-gray-300">
                        <li>• <kbd class="bg-gray-800 px-1 rounded">ESC</kbd> - Close current challenge</li>
                        <li>• <kbd class="bg-gray-800 px-1 rounded">Click</kbd> - Interact with objects</li>
                        <li>• <kbd class="bg-gray-800 px-1 rounded">Drag</kbd> - Move items in puzzles</li>
                    </ul>
                </div>

                <div class="bg-blue-900 p-4 rounded border border-blue-600">
                    <h4 class="font-bold mb-2">
                        <i class="bi bi-lightbulb-fill"></i> Need Help?
                    </h4>
                    <p class="text-sm text-blue-100">
                        Start a challenge to get specific hints and guidance for that puzzle!
                    </p>
                </div>
            </div>
        `;
    }

    static revealHint(level) {
        const hint = this.getHint(level);
        if (hint) {
            // Re-render to show the revealed hint
            const container = document.getElementById('side-panel');
            if (container.dataset.panel === 'hints') {
                this.render(container);
            }
        }
    }

    static clearChallenge() {
        this.currentChallenge = null;
        this.hintLevel = 0;
        
        // Re-render if hints panel is active
        const container = document.getElementById('side-panel');
        if (container.dataset.panel === 'hints') {
            this.render(container);
        }
    }
}
