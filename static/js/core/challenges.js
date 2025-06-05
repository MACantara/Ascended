class ChallengeManager {
    constructor(game) {
        this.game = game;
        this.currentChallenge = null;
        this.hintLevel = 0;
        this.setupEventListeners();
    }

    setupEventListeners() {
        const closeBtn = document.getElementById('close-challenge');
        const hintBtn = document.getElementById('hint-btn');
        const submitBtn = document.getElementById('submit-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeChallenge());
        }

        if (hintBtn) {
            hintBtn.addEventListener('click', () => this.showHint());
        }

        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitChallenge());
        }
    }

    async loadChallenge(challengeType, challengeId) {
        try {
            const response = await fetch(`/api/challenges/${challengeType}/${challengeId}`);
            if (!response.ok) {
                throw new Error(`Challenge not found: ${challengeType}/${challengeId}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to load challenge:', error);
            return null;
        }
    }

    async startChallenge(challengeType, challengeId) {
        const challengeData = await this.loadChallenge(challengeType, challengeId);
        if (!challengeData) return;

        this.currentChallenge = challengeData;
        this.hintLevel = 0;
        this.displayChallenge(challengeData);
        this.showChallengePanel();
    }

    displayChallenge(challengeData) {
        const titleEl = document.getElementById('challenge-title');
        const contentEl = document.getElementById('challenge-content');
        
        if (titleEl) {
            titleEl.textContent = challengeData.title;
        }

        if (contentEl) {
            // Load appropriate challenge renderer based on type
            switch (challengeData.type) {
                case 'coding':
                    contentEl.innerHTML = this.renderCodingChallenge(challengeData);
                    this.setupCodingChallenge(challengeData);
                    break;
                case 'cybersecurity':
                    contentEl.innerHTML = this.renderCyberChallenge(challengeData);
                    break;
                case 'networking':
                    contentEl.innerHTML = this.renderNetworkChallenge(challengeData);
                    break;
                case 'hardware':
                    contentEl.innerHTML = this.renderHardwareChallenge(challengeData);
                    break;
                case 'ai':
                    contentEl.innerHTML = this.renderAIChallenge(challengeData);
                    break;
                default:
                    contentEl.innerHTML = this.renderGenericChallenge(challengeData);
            }
        }
    }

    renderCodingChallenge(data) {
        return `
            <div class="coding-challenge">
                <div class="mb-4">
                    <h4 class="font-bold mb-2">Problem:</h4>
                    <p class="text-sm text-gray-300">${data.problem}</p>
                </div>
                
                <div class="mb-4">
                    <h4 class="font-bold mb-2">Available Code Blocks:</h4>
                    <div id="code-blocks" class="space-y-2 max-h-40 overflow-y-auto">
                        ${data.codeBlocks ? data.codeBlocks.map((block, index) => `
                            <div class="code-block bg-blue-600 p-2 rounded cursor-move text-xs" 
                                 draggable="true" data-block="${index}">
                                <code>${block}</code>
                            </div>
                        `).join('') : ''}
                    </div>
                </div>
                
                <div class="mb-4">
                    <h4 class="font-bold mb-2">Your Solution:</h4>
                    <div id="solution-area" class="min-h-24 bg-gray-700 border-2 border-dashed border-gray-500 p-4 rounded">
                        <div class="text-gray-400 text-center text-sm">Drag code blocks here</div>
                    </div>
                </div>
            </div>
        `;
    }

    setupCodingChallenge(data) {
        const solutionArea = document.getElementById('solution-area');
        const codeBlocks = document.querySelectorAll('.code-block');

        if (!solutionArea || !codeBlocks.length) return;

        codeBlocks.forEach(block => {
            block.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.block);
            });
        });

        solutionArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            solutionArea.classList.add('border-blue-400');
        });

        solutionArea.addEventListener('dragleave', () => {
            solutionArea.classList.remove('border-blue-400');
        });

        solutionArea.addEventListener('drop', (e) => {
            e.preventDefault();
            const blockIndex = e.dataTransfer.getData('text/plain');
            this.addBlockToSolution(parseInt(blockIndex), data);
            solutionArea.classList.remove('border-blue-400');
        });
    }

    addBlockToSolution(blockIndex, data) {
        const solutionArea = document.getElementById('solution-area');
        if (!solutionArea || !data.codeBlocks) return;

        const block = data.codeBlocks[blockIndex];
        
        if (solutionArea.querySelector('.text-gray-400')) {
            solutionArea.innerHTML = '';
        }

        const blockElement = document.createElement('div');
        blockElement.className = 'bg-green-600 p-2 rounded mb-2 flex justify-between items-center';
        blockElement.innerHTML = `
            <code class="text-xs">${block}</code>
            <button class="text-red-400 hover:text-red-300 ml-2" onclick="this.parentElement.remove()">
                <i class="bi bi-x"></i>
            </button>
        `;
        
        solutionArea.appendChild(blockElement);
    }

    renderGenericChallenge(data) {
        return `
            <div class="generic-challenge">
                <div class="mb-4">
                    <p class="text-sm text-gray-300">${data.description || data.problem || 'Challenge loading...'}</p>
                </div>
                <div class="mb-4">
                    <input type="text" id="challenge-answer" 
                           class="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                           placeholder="Enter your answer...">
                </div>
            </div>
        `;
    }

    renderCyberChallenge(data) {
        return this.renderGenericChallenge(data);
    }

    renderNetworkChallenge(data) {
        return this.renderGenericChallenge(data);
    }

    renderHardwareChallenge(data) {
        return this.renderGenericChallenge(data);
    }

    renderAIChallenge(data) {
        return this.renderGenericChallenge(data);
    }

    async showHint() {
        if (!this.currentChallenge) return;

        this.hintLevel++;
        try {
            const response = await fetch(
                `/api/challenges/${this.currentChallenge.type}/${this.currentChallenge.id}/hint?level=${this.hintLevel}`
            );
            
            if (response.ok) {
                const data = await response.json();
                this.displayFeedback(data.hint, 'info');
            } else {
                this.displayFeedback('No more hints available', 'warning');
            }
        } catch (error) {
            console.error('Failed to get hint:', error);
            this.displayFeedback('Failed to load hint', 'error');
        }
    }

    async submitChallenge() {
        if (!this.currentChallenge) return;

        let answer;
        
        if (this.currentChallenge.type === 'coding') {
            const solutionBlocks = Array.from(document.querySelectorAll('#solution-area code'))
                .map(code => code.textContent);
            answer = solutionBlocks;
        } else {
            const answerInput = document.getElementById('challenge-answer');
            answer = answerInput ? answerInput.value : '';
        }

        try {
            const response = await fetch(
                `/api/challenges/${this.currentChallenge.type}/${this.currentChallenge.id}/validate`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ answer })
                }
            );

            if (response.ok) {
                const result = await response.json();
                this.handleChallengeResult(result);
            }
        } catch (error) {
            console.error('Failed to submit challenge:', error);
            this.displayFeedback('Failed to submit answer', 'error');
        }
    }

    handleChallengeResult(result) {
        if (result.correct) {
            this.displayFeedback(result.feedback || 'Correct! Well done!', 'success');
            this.game.completeChallenge(this.currentChallenge.id);
            
            // Award tool if specified
            if (this.currentChallenge.reward && this.currentChallenge.reward.tool) {
                this.game.addToInventory(this.currentChallenge.reward.tool);
            }
        } else {
            this.displayFeedback(result.feedback || 'Incorrect. Try again!', 'error');
        }
    }

    displayFeedback(message, type) {
        const feedbackEl = document.getElementById('challenge-feedback');
        if (!feedbackEl) return;

        const colors = {
            success: 'bg-green-600',
            error: 'bg-red-600',
            warning: 'bg-yellow-600',
            info: 'bg-blue-600'
        };

        feedbackEl.innerHTML = `
            <div class="${colors[type] || colors.info} p-3 rounded text-white text-sm">
                ${message}
            </div>
        `;

        // Clear feedback after 5 seconds
        setTimeout(() => {
            feedbackEl.innerHTML = '';
        }, 5000);
    }

    showChallengePanel() {
        const panel = document.getElementById('challenge-panel');
        if (panel) {
            panel.classList.remove('hidden');
        }
    }

    closeChallenge() {
        const panel = document.getElementById('challenge-panel');
        if (panel) {
            panel.classList.add('hidden');
        }
        this.currentChallenge = null;
        this.hintLevel = 0;
    }
}
