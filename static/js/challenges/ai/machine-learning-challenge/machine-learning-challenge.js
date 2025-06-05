class AIChallenge {
    static currentPhase = 'data-prep';

    static load(titleElement, contentElement) {
        titleElement.textContent = "AI Laboratory - Machine Learning";
        Hints.setChallenge('ai');
        
        // Initialize data preparation
        DataPreparation.generateTrainingData();
        
        this.render(contentElement);
    }

    static render(container) {
        container.innerHTML = `
            <div class="puzzle-container">
                <div class="mb-6">
                    <h4 class="text-2xl font-bold mb-3 text-purple-400 flex items-center">
                        <i class="bi bi-robot mr-3 text-3xl"></i>
                        Machine Learning Pipeline
                    </h4>
                    <p class="text-gray-300 mb-4 text-lg">
                        🤖 Build and train an AI model to classify files by type. Complete all phases to master machine learning!
                    </p>
                </div>

                <div class="flex mb-6 bg-gray-800 rounded-lg p-1">
                    <button onclick="AIChallenge.switchPhase('data-prep')" 
                            class="phase-tab flex-1 px-4 py-3 rounded-lg transition-all duration-200 ${this.currentPhase === 'data-prep' ? 'bg-purple-600 text-white' : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-700'}">
                        <i class="bi bi-database mr-2"></i> 
                        <span class="font-semibold">Data Preparation</span>
                        <div class="text-xs opacity-75">Sort training data</div>
                    </button>
                    <button onclick="AIChallenge.switchPhase('training')" 
                            class="phase-tab flex-1 px-4 py-3 rounded-lg transition-all duration-200 ${this.currentPhase === 'training' ? 'bg-purple-600 text-white' : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-700'}">
                        <i class="bi bi-gear mr-2"></i> 
                        <span class="font-semibold">Model Training</span>
                        <div class="text-xs opacity-75">Configure & train</div>
                    </button>
                    <button onclick="AIChallenge.switchPhase('testing')" 
                            class="phase-tab flex-1 px-4 py-3 rounded-lg transition-all duration-200 ${this.currentPhase === 'testing' ? 'bg-purple-600 text-white' : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-700'}">
                        <i class="bi bi-check-square mr-2"></i> 
                        <span class="font-semibold">Model Testing</span>
                        <div class="text-xs opacity-75">Evaluate performance</div>
                    </button>
                </div>

                <div id="phase-content" class="bg-gray-800 rounded-xl p-6 shadow-2xl">
                    ${this.renderCurrentPhase()}
                </div>

                <div class="mt-6">
                    ${this.renderProgressIndicator()}
                </div>
            </div>
        `;
        
        // Setup initial phase interactions
        if (this.currentPhase === 'data-prep') {
            setTimeout(() => DataPreparation.setupDragAndDrop(), 100);
        }
    }

    static renderCurrentPhase() {
        switch(this.currentPhase) {
            case 'data-prep':
                return DataPreparation.render();
            case 'training':
                return ModelTraining.render();
            case 'testing':
                return ModelTesting.render();
            default:
                return '<div class="text-red-400">Unknown phase</div>';
        }
    }

    static renderProgressIndicator() {
        const dataScore = DataPreparation.getValidationScore();
        const modelTrained = ModelTraining.isModelTrained();
        const testResults = ModelTesting.getTestResults();
        
        return `
            <div class="bg-gray-800 rounded-lg p-4">
                <h5 class="font-bold mb-3 text-purple-400">Pipeline Progress</h5>
                <div class="grid grid-cols-3 gap-4">
                    <div class="text-center">
                        <div class="text-2xl mb-1">
                            ${dataScore >= 80 ? '✅' : '⏳'}
                        </div>
                        <div class="text-sm font-semibold">Data Prep</div>
                        <div class="text-xs text-gray-400">${dataScore}% accuracy</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl mb-1">
                            ${modelTrained ? '✅' : '⏳'}
                        </div>
                        <div class="text-sm font-semibold">Training</div>
                        <div class="text-xs text-gray-400">
                            ${modelTrained ? 'Complete' : 'Pending'}
                        </div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl mb-1">
                            ${testResults.accuracy >= 67 ? '✅' : '⏳'}
                        </div>
                        <div class="text-sm font-semibold">Testing</div>
                        <div class="text-xs text-gray-400">
                            ${testResults.total > 0 ? `${testResults.accuracy}%` : 'Pending'}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static switchPhase(phase) {
        // Validate phase transition
        if (phase === 'training' && DataPreparation.getValidationScore() < 80) {
            this.showValidationWarning('Complete data preparation with 80%+ accuracy first!');
            return;
        }
        
        if (phase === 'testing' && !ModelTraining.isModelTrained()) {
            this.showValidationWarning('Train your model first before testing!');
            return;
        }

        this.currentPhase = phase;
        const content = document.getElementById('phase-content');
        content.innerHTML = this.renderCurrentPhase();
        
        // Update tab appearances
        document.querySelectorAll('.phase-tab').forEach(tab => {
            tab.className = tab.className.replace(/bg-purple-600 text-white|bg-transparent text-gray-400 hover:text-white hover:bg-gray-700/g, '');
            if (tab.onclick.toString().includes(phase)) {
                tab.className += ' bg-purple-600 text-white';
            } else {
                tab.className += ' bg-transparent text-gray-400 hover:text-white hover:bg-gray-700';
            }
        });
        
        // Setup phase-specific interactions
        if (phase === 'data-prep') {
            setTimeout(() => DataPreparation.setupDragAndDrop(), 100);
        }

        // Update progress indicator
        const progressElement = document.querySelector('.mt-6');
        if (progressElement) {
            progressElement.innerHTML = this.renderProgressIndicator();
        }
    }

    static showValidationWarning(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-yellow-600 text-white p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-exclamation-triangle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    static completePuzzle() {
        const reward = {
            item: {
                id: 'ai-processor',
                name: 'AI Processor',
                icon: '🤖',
                description: 'Advanced machine learning compute unit',
                quantity: 1
            },
            message: 'AI model successfully trained! You earned an AI Processor!',
            unlock: null
        };
        
        setTimeout(() => {
            window.game.completeChallenge('ai', reward);
        }, 2000);
    }
}
