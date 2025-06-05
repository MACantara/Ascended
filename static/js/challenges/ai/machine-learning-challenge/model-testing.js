class ModelTesting {
    static testFiles = [
        { filename: 'unknown1.jpg', size: 1536, extension: 'jpg', actualType: 'image' },
        { filename: 'mystery.mp3', size: 3072, extension: 'mp3', actualType: 'audio' },
        { filename: 'file.pdf', size: 768, extension: 'pdf', actualType: 'document' }
    ];
    static userClassifications = {};

    static render() {
        return `
            <div>
                <h4 class="text-lg font-bold mb-2">Test Your Model</h4>
                <p class="text-gray-300 mb-4">
                    Use your trained model to classify new, unseen files.
                </p>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h5 class="font-bold mb-3">Test Files</h5>
                        <div class="space-y-3">
                            ${this.testFiles.map((file, index) => `
                                <div class="test-file bg-gray-800 border border-gray-600 rounded p-4 hover:border-purple-400 transition-colors duration-200" data-file-index="${index}">
                                    <div class="flex items-center justify-between mb-3">
                                        <span class="font-mono text-sm font-bold">${file.filename}</span>
                                        <span class="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">${file.size}KB</span>
                                    </div>
                                    
                                    <div class="grid grid-cols-2 gap-2">
                                        ${['image', 'document', 'audio', 'video'].map(type => `
                                            <button onclick="ModelTesting.classifyFile(${index}, '${type}')"
                                                    class="classify-btn bg-gray-700 hover:bg-purple-600 px-3 py-2 rounded text-xs transition-colors duration-200 border border-gray-600 hover:border-purple-400">
                                                <i class="bi bi-${this.getTypeIcon(type)} mr-1"></i>${type}
                                            </button>
                                        `).join('')}
                                    </div>
                                    
                                    <div class="classification-result mt-3 text-sm hidden"></div>
                                </div>
                            `).join('')}
                        </div>

                        <button onclick="ModelTesting.evaluateModel()" 
                                class="w-full mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors duration-200">
                            <i class="bi bi-check-circle"></i> Evaluate Model Performance
                        </button>
                    </div>

                    <div>
                        <h5 class="font-bold mb-3">Model Performance</h5>
                        <div id="model-results" class="bg-gray-800 border border-gray-600 rounded p-4 mb-4">
                            <div class="text-gray-400">
                                <i class="bi bi-info-circle mr-2"></i>
                                Make classifications to see results...
                            </div>
                        </div>

                        <div>
                            <h5 class="font-bold mb-3">Feature Analysis</h5>
                            <div class="bg-gray-800 border border-gray-600 rounded p-4 text-sm">
                                <div class="mb-3"><strong class="text-purple-400">Key Features Used:</strong></div>
                                <ul class="text-gray-300 space-y-2">
                                    <li class="flex items-center">
                                        <i class="bi bi-file-earmark mr-2 text-blue-400"></i>
                                        File extension (.jpg, .mp3, .pdf, etc.)
                                    </li>
                                    <li class="flex items-center">
                                        <i class="bi bi-hdd mr-2 text-green-400"></i>
                                        File size (images/videos typically larger)
                                    </li>
                                    <li class="flex items-center">
                                        <i class="bi bi-alphabet mr-2 text-yellow-400"></i>
                                        Filename patterns and keywords
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="mt-4">
                            <h5 class="font-bold mb-3">Model Info</h5>
                            <div id="model-info" class="bg-gray-800 border border-gray-600 rounded p-4 text-sm">
                                ${this.renderModelInfo()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    static renderModelInfo() {
        const model = ModelTraining.getTrainedModel();
        if (!model) {
            return '<div class="text-gray-400">No model trained yet. Complete training phase first.</div>';
        }

        return `
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span>Algorithm:</span>
                    <span class="text-purple-400">${model.algorithm}</span>
                </div>
                <div class="flex justify-between">
                    <span>Training Accuracy:</span>
                    <span class="text-green-400">${model.accuracy.toFixed(1)}%</span>
                </div>
                <div class="flex justify-between">
                    <span>Learning Rate:</span>
                    <span class="text-blue-400">${model.learningRate}</span>
                </div>
                <div class="flex justify-between">
                    <span>Epochs:</span>
                    <span class="text-yellow-400">${model.epochs}</span>
                </div>
            </div>
        `;
    }

    static classifyFile(fileIndex, classification) {
        const file = this.testFiles[fileIndex];
        const resultDiv = document.querySelector(`[data-file-index="${fileIndex}"] .classification-result`);
        const isCorrect = classification === file.actualType;
        
        resultDiv.className = `classification-result mt-3 text-sm p-2 rounded ${isCorrect ? 'text-green-400 bg-green-900 bg-opacity-20' : 'text-red-400 bg-red-900 bg-opacity-20'}`;
        resultDiv.innerHTML = `
            <i class="bi bi-${isCorrect ? 'check-circle' : 'x-circle'} mr-1"></i>
            Classified as: <strong>${classification}</strong> ${isCorrect ? '✅' : '❌'}
            ${!isCorrect ? `<br><small class="text-gray-400">Actual: ${file.actualType}</small>` : ''}
        `;
        resultDiv.classList.remove('hidden');
        
        this.userClassifications[fileIndex] = classification;

        // Update button states
        const fileElement = document.querySelector(`[data-file-index="${fileIndex}"]`);
        fileElement.querySelectorAll('.classify-btn').forEach(btn => {
            btn.classList.remove('bg-purple-600', 'border-purple-400');
            if (btn.textContent.trim().includes(classification)) {
                btn.classList.add('bg-purple-600', 'border-purple-400');
            }
        });
    }

    static evaluateModel() {
        let correct = 0;
        let total = 0;
        
        Object.entries(this.userClassifications).forEach(([fileIndex, classification]) => {
            const file = this.testFiles[fileIndex];
            total++;
            if (classification === file.actualType) {
                correct++;
            }
        });
        
        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
        const resultsDiv = document.getElementById('model-results');
        
        const performanceLevel = accuracy >= 67 ? 'Excellent' : accuracy >= 34 ? 'Good' : 'Needs Improvement';
        const performanceColor = accuracy >= 67 ? 'green' : accuracy >= 34 ? 'yellow' : 'red';
        
        resultsDiv.innerHTML = `
            <div class="space-y-3">
                <div class="text-lg font-bold flex items-center">
                    <i class="bi bi-graph-up mr-2 text-purple-400"></i>
                    Model Evaluation Results
                </div>
                <div class="text-${performanceColor}-400 text-xl font-bold">
                    Accuracy: ${accuracy}% (${correct}/${total} correct)
                </div>
                <div class="text-sm text-gray-300">
                    Performance Level: <span class="text-${performanceColor}-400 font-semibold">${performanceLevel}</span>
                </div>
                
                ${total > 0 ? `
                    <div class="mt-4">
                        <div class="text-sm font-semibold mb-2">Classification Breakdown:</div>
                        ${Object.entries(this.userClassifications).map(([fileIndex, classification]) => {
                            const file = this.testFiles[fileIndex];
                            const isCorrect = classification === file.actualType;
                            return `
                                <div class="text-xs flex justify-between items-center py-1">
                                    <span>${file.filename}</span>
                                    <span class="${isCorrect ? 'text-green-400' : 'text-red-400'}">
                                        ${classification} ${isCorrect ? '✅' : '❌'}
                                    </span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        if (accuracy >= 67) {
            setTimeout(() => {
                resultsDiv.innerHTML += `
                    <div class="mt-4 p-3 bg-green-900 bg-opacity-30 border border-green-600 rounded">
                        <div class="text-green-400 font-bold">
                            🎉 Congratulations! Your model performs excellently!
                        </div>
                        <div class="text-sm text-gray-300 mt-1">
                            Proceeding to challenge completion...
                        </div>
                    </div>
                `;
                setTimeout(() => AIChallenge.completePuzzle(), 2000);
            }, 1000);
        }
    }

    static getTypeIcon(type) {
        const icons = { 
            image: 'image', 
            document: 'file-text', 
            audio: 'music-note', 
            video: 'camera-video' 
        };
        return icons[type] || 'file';
    }

    static getTestResults() {
        let correct = 0;
        let total = 0;
        
        Object.entries(this.userClassifications).forEach(([fileIndex, classification]) => {
            const file = this.testFiles[fileIndex];
            total++;
            if (classification === file.actualType) {
                correct++;
            }
        });
        
        return { correct, total, accuracy: total > 0 ? Math.round((correct / total) * 100) : 0 };
    }
}
