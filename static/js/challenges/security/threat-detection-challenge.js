class ThreatDetectionChallenge {
    static load(titleElement, contentElement) {
        titleElement.textContent = "Threat Detection";
        Hints.setChallenge('threats');
        this.render(contentElement);
    }

    static render(container) {
        const threats = [
            { id: 1, type: 'malware', content: 'suspicious_file.exe', risk: 'high', isReal: true },
            { id: 2, type: 'phishing', content: 'urgent_payment_required.email', risk: 'medium', isReal: true },
            { id: 3, type: 'legitimate', content: 'system_update.msi', risk: 'low', isReal: false },
            { id: 4, type: 'malware', content: 'game_crack.zip', risk: 'high', isReal: true },
            { id: 5, type: 'legitimate', content: 'document.pdf', risk: 'low', isReal: false }
        ];

        container.innerHTML = `
            <div class="puzzle-container">
                <div class="mb-4">
                    <h4 class="text-lg font-bold mb-2">Identify Security Threats</h4>
                    <p class="text-gray-300 mb-4">
                        Review the following files and emails. Mark suspicious items as threats.
                    </p>
                </div>

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
                                    <button onclick="ThreatDetectionChallenge.markThreat(${threat.id}, true)" 
                                            class="threat-btn bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">
                                        Threat
                                    </button>
                                    <button onclick="ThreatDetectionChallenge.markThreat(${threat.id}, false)" 
                                            class="safe-btn bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">
                                        Safe
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="mt-6">
                    <button onclick="ThreatDetectionChallenge.submitThreatAnalysis()" 
                            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                        <i class="bi bi-shield-check"></i> Submit Analysis
                    </button>
                </div>

                <div id="threat-results" class="mt-4"></div>
            </div>
        `;
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
            setTimeout(() => this.completePuzzle(), 1500);
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

    static completePuzzle() {
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
        }, 2000);
    }
}
