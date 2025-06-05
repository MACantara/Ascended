class ModelTesting {
    static testFiles = [
        { filename: 'unknown1.jpg', size: 1536, extension: 'jpg', actualType: 'image' },
        { filename: 'mystery.mp3', size: 3072, extension: 'mp3', actualType: 'audio' },
        { filename: 'file.pdf', size: 768, extension: 'pdf', actualType: 'document' },
        { filename: 'vacation_video.mp4', size: 9500, extension: 'mp4', actualType: 'video' },
        { filename: 'presentation.pptx', size: 2100, extension: 'pptx', actualType: 'document' },
        { filename: 'screenshot.png', size: 1200, extension: 'png', actualType: 'image' }
    ];
    static userClassifications = {};
    static modelPredictions = {};
    static evaluationResults = null;

    static render() {
        return `
            <div>
                <h4 class="text-lg font-bold mb-2">Model Testing & Evaluation</h4>
                <p class="text-gray-300 mb-4">
                    🧪 Test your trained model on new, unseen data. Compare AI predictions with manual classification to evaluate performance.
                </p>

                <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <!-- Test Files -->
                    <div>
                        <h5 class="font-bold mb-3 flex items-center">
                            <i class="bi bi-clipboard-data mr-2 text-blue-400"></i>
                            Test Dataset
                        </h5>
                        <div class="space-y-3 max-h-[500px] overflow-y-auto">
                            ${this.testFiles.map((file, index) => `
                                <div class="test-file bg-gray-800 border border-gray-600 rounded-lg p-4 hover:border-blue-400 transition-colors duration-200" data-file-index="${index}">
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center">
                                            <i class="bi bi-question-circle mr-2 text-yellow-400"></i>
                                            <span class="font-mono text-sm font-bold">${file.filename}</span>
                                        </div>
                                        <span class="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">${file.size}KB</span>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <div class="text-xs text-gray-400 mb-2">Your Classification:</div>
                                        <div class="grid grid-cols-2 gap-2">
                                            ${['image', 'document', 'audio', 'video'].map(type => `
                                                <button onclick="ModelTesting.classifyFile(${index}, '${type}')"
                                                        class="classify-btn bg-gray-700 hover:bg-blue-600 px-3 py-2 rounded text-xs transition-colors duration-200 border border-gray-600 hover:border-blue-400 flex items-center justify-center">
                                                    <i class="bi bi-${this.getTypeIcon(type)} mr-1"></i>
                                                    ${type}
                                                </button>
                                            `).join('')}
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <div class="text-xs text-gray-400 mb-2 flex items-center">
                                            <i class="bi bi-robot mr-1"></i>
                                            AI Prediction:
                                            <button onclick="ModelTesting.runAIPrediction(${index})" 
                                                    class="ml-auto text-purple-400 hover:text-purple-300 text-xs underline">
                                                Predict
                                            </button>
                                        </div>
                                        <div id="ai-prediction-${index}" class="ai-prediction text-xs bg-gray-700 px-2 py-1 rounded hidden">
                                            <span class="text-gray-400">Click predict to see AI classification</span>
                                        </div>
                                    </div>
                                    
                                    <div class="classification-result hidden"></div>
                                </div>
                            `).join('')}
                        </div>

                        <div class="mt-4 flex gap-2">
                            <button onclick="ModelTesting.runAllAIPredictions()" 
                                    class="flex-1 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded transition-colors duration-200 flex items-center justify-center">
                                <i class="bi bi-robot mr-2"></i> Run All AI Predictions
                            </button>
                            <button onclick="ModelTesting.evaluateModel()" 
                                    class="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors duration-200 flex items-center justify-center">
                                <i class="bi bi-check-circle mr-2"></i> Evaluate Performance
                            </button>
                        </div>
                    </div>

                    <!-- Performance Metrics -->
                    <div>
                        <h5 class="font-bold mb-3 flex items-center">
                            <i class="bi bi-graph-up mr-2 text-green-400"></i>
                            Performance Analysis
                        </h5>
                        <div id="model-results" class="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4">
                            <div class="text-gray-400 text-sm">
                                <i class="bi bi-info-circle mr-2"></i>
                                Make classifications and run AI predictions to see results...
                            </div>
                        </div>

                        <div class="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4">
                            <h6 class="font-bold mb-3 text-cyan-400">Confusion Matrix</h6>
                            <div id="confusion-matrix">
                                <div class="text-gray-400 text-sm">Run evaluation to see confusion matrix</div>
                            </div>
                        </div>

                        <div class="bg-gray-800 border border-gray-600 rounded-lg p-4">
                            <h6 class="font-bold mb-3 text-yellow-400">Classification Report</h6>
                            <div id="classification-report">
                                <div class="text-gray-400 text-sm">Detailed metrics will appear after evaluation</div>
                            </div>
                        </div>
                    </div>

                    <!-- Model Information & Analysis -->
                    <div>
                        <div class="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4">
                            <h5 class="font-bold mb-3 text-purple-400">Model Information</h5>
                            <div id="model-info">
                                ${this.renderModelInfo()}
                            </div>
                        </div>

                        <div class="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4">
                            <h5 class="font-bold mb-3 text-orange-400">Feature Importance</h5>
                            <div class="space-y-2 text-sm">
                                <div class="flex justify-between items-center">
                                    <span>File Extension</span>
                                    <div class="flex items-center">
                                        <div class="w-20 bg-gray-600 rounded-full h-2 mr-2">
                                            <div class="bg-blue-400 h-2 rounded-full" style="width: 85%"></div>
                                        </div>
                                        <span class="text-blue-400 text-xs">85%</span>
                                    </div>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>File Size</span>
                                    <div class="flex items-center">
                                        <div class="w-20 bg-gray-600 rounded-full h-2 mr-2">
                                            <div class="bg-green-400 h-2 rounded-full" style="width: 70%"></div>
                                        </div>
                                        <span class="text-green-400 text-xs">70%</span>
                                    </div>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span>Filename Keywords</span>
                                    <div class="flex items-center">
                                        <div class="w-20 bg-gray-600 rounded-full h-2 mr-2">
                                            <div class="bg-purple-400 h-2 rounded-full" style="width: 45%"></div>
                                        </div>
                                        <span class="text-purple-400 text-xs">45%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-800 border border-gray-600 rounded-lg p-4">
                            <h5 class="font-bold mb-3 text-red-400">Test Statistics</h5>
                            <div id="test-statistics" class="space-y-2 text-sm">
                                <div class="flex justify-between">
                                    <span>Total Test Samples:</span>
                                    <span class="text-cyan-400">${this.testFiles.length}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>User Classifications:</span>
                                    <span id="user-count" class="text-yellow-400">0</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>AI Predictions:</span>
                                    <span id="ai-count" class="text-purple-400">0</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Accuracy Agreement:</span>
                                    <span id="agreement" class="text-green-400">-</span>
                                </div>
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
            return `
                <div class="text-yellow-400 text-sm">
                    <i class="bi bi-exclamation-triangle mr-2"></i>
                    No model trained yet. Complete training phase first.
                </div>
            `;
        }

        return `
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span>Algorithm:</span>
                    <span class="text-purple-400 font-mono">${model.algorithm}</span>
                </div>
                <div class="flex justify-between">
                    <span>Training Accuracy:</span>
                    <span class="text-green-400 font-mono">${model.accuracy.toFixed(1)}%</span>
                </div>
                <div class="flex justify-between">
                    <span>Learning Rate:</span>
                    <span class="text-blue-400 font-mono">${model.learningRate}</span>
                </div>
                <div class="flex justify-between">
                    <span>Epochs:</span>
                    <span class="text-yellow-400 font-mono">${model.epochs}</span>
                </div>
                <div class="flex justify-between">
                    <span>Batch Size:</span>
                    <span class="text-cyan-400 font-mono">${model.batchSize}</span>
                </div>
                <div class="flex justify-between">
                    <span>Training Time:</span>
                    <span class="text-orange-400 font-mono">${model.trainingTime}s</span>
                </div>
            </div>
        `;
    }

    static classifyFile(fileIndex, classification) {
        const file = this.testFiles[fileIndex];
        const resultDiv = document.querySelector(`[data-file-index="${fileIndex}"] .classification-result`);
        const isCorrect = classification === file.actualType;
        
        // Store user classification
        this.userClassifications[fileIndex] = classification;
        
        // Update UI
        resultDiv.className = `classification-result mt-3 text-sm p-2 rounded ${isCorrect ? 'text-green-400 bg-green-900 bg-opacity-20' : 'text-red-400 bg-red-900 bg-opacity-20'}`;
        resultDiv.innerHTML = `
            <div class="flex items-center justify-between">
                <span>
                    <i class="bi bi-${isCorrect ? 'check-circle' : 'x-circle'} mr-1"></i>
                    Your choice: <strong>${classification}</strong>
                </span>
                <span>${isCorrect ? '✅' : '❌'}</span>
            </div>
            ${!isCorrect ? `<div class="text-xs text-gray-400 mt-1">Actual: ${file.actualType}</div>` : ''}
        `;
        resultDiv.classList.remove('hidden');
        
        // Update button states
        const fileElement = document.querySelector(`[data-file-index="${fileIndex}"]`);
        fileElement.querySelectorAll('.classify-btn').forEach(btn => {
            btn.classList.remove('bg-blue-600', 'border-blue-400');
            btn.classList.add('bg-gray-700', 'border-gray-600');
            if (btn.textContent.trim().includes(classification)) {
                btn.classList.remove('bg-gray-700', 'border-gray-600');
                btn.classList.add('bg-blue-600', 'border-blue-400');
            }
        });
        
        this.updateTestStatistics();
    }

    static runAIPrediction(fileIndex) {
        const model = ModelTraining.getTrainedModel();
        if (!model || !model.trained) {
            this.showNotification('No trained model available! Train a model first.', 'warning');
            return;
        }

        const file = this.testFiles[fileIndex];
        const predictionDiv = document.getElementById(`ai-prediction-${fileIndex}`);
        
        // Show loading state
        predictionDiv.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-gear animate-spin mr-2 text-purple-400"></i>
                <span class="text-gray-300">Analyzing...</span>
            </div>
        `;
        predictionDiv.classList.remove('hidden');
        
        // Simulate prediction delay
        setTimeout(() => {
            const prediction = this.generateAIPrediction(file, model);
            this.modelPredictions[fileIndex] = prediction;
            
            const confidence = prediction.confidence;
            const confidenceColor = confidence > 0.8 ? 'text-green-400' : confidence > 0.6 ? 'text-yellow-400' : 'text-red-400';
            
            predictionDiv.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <i class="bi bi-robot mr-2 text-purple-400"></i>
                        <span class="text-white font-semibold">${prediction.prediction}</span>
                    </div>
                    <span class="${confidenceColor} text-xs font-mono">${(confidence * 100).toFixed(1)}%</span>
                </div>
                <div class="mt-1 text-xs">
                    ${Object.entries(prediction.probabilities).map(([type, prob]) => 
                        `<span class="mr-2">${type}: ${(prob * 100).toFixed(1)}%</span>`
                    ).join('')}
                </div>
            `;
            
            this.updateTestStatistics();
        }, 800);
    }

    static runAllAIPredictions() {
        const model = ModelTraining.getTrainedModel();
        if (!model || !model.trained) {
            this.showNotification('No trained model available! Train a model first.', 'warning');
            return;
        }

        this.testFiles.forEach((_, index) => {
            if (!this.modelPredictions[index]) {
                setTimeout(() => this.runAIPrediction(index), index * 200);
            }
        });
    }

    static generateAIPrediction(file, model) {
        // Extract features similar to training
        const features = this.extractFeatures(file);
        
        // Use the trained model to make prediction
        const prediction = ModelTraining.predict(features);
        
        if (prediction) {
            const typeMap = ['image', 'document', 'audio', 'video'];
            return {
                prediction: typeMap[prediction.prediction],
                confidence: prediction.confidence,
                probabilities: {
                    image: prediction.probabilities[0],
                    document: prediction.probabilities[1],
                    audio: prediction.probabilities[2],
                    video: prediction.probabilities[3]
                }
            };
        }
        
        // Fallback: Rule-based prediction if model prediction fails
        return this.ruleBasedPrediction(file);
    }

    static extractFeatures(file) {
        // Same feature extraction as in data preparation
        return [
            this.hashExtension(file.extension),
            this.normalizeSize(file.size),
            file.filename.toLowerCase().includes('photo') || file.filename.toLowerCase().includes('image') || file.filename.toLowerCase().includes('picture') ? 1 : 0,
            file.filename.toLowerCase().includes('music') || file.filename.toLowerCase().includes('song') || file.filename.toLowerCase().includes('audio') ? 1 : 0,
            file.filename.toLowerCase().includes('video') || file.filename.toLowerCase().includes('movie') || file.filename.toLowerCase().includes('clip') ? 1 : 0
        ];
    }

    static ruleBasedPrediction(file) {
        // Fallback rule-based prediction
        const ext = file.extension.toLowerCase();
        const size = file.size;
        
        let prediction = 'document';
        let confidence = 0.6;
        let probabilities = { image: 0.25, document: 0.25, audio: 0.25, video: 0.25 };
        
        // Image extensions
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
            prediction = 'image';
            confidence = 0.9;
            probabilities = { image: 0.9, document: 0.03, audio: 0.03, video: 0.04 };
        }
        // Audio extensions
        else if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(ext)) {
            prediction = 'audio';
            confidence = 0.85;
            probabilities = { image: 0.05, document: 0.05, audio: 0.85, video: 0.05 };
        }
        // Video extensions
        else if (['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv'].includes(ext)) {
            prediction = 'video';
            confidence = 0.88;
            probabilities = { image: 0.04, document: 0.04, audio: 0.04, video: 0.88 };
        }
        // Document extensions
        else if (['pdf', 'doc', 'docx', 'txt', 'pptx', 'xlsx'].includes(ext)) {
            prediction = 'document';
            confidence = 0.82;
            probabilities = { image: 0.06, document: 0.82, audio: 0.06, video: 0.06 };
        }
        
        // Adjust confidence based on file size
        if ((prediction === 'video' && size > 5000) || 
            (prediction === 'audio' && size > 2000 && size < 10000) ||
            (prediction === 'image' && size > 500 && size < 5000) ||
            (prediction === 'document' && size < 3000)) {
            confidence += 0.1;
        }
        
        return { prediction, confidence: Math.min(confidence, 0.95), probabilities };
    }

    static evaluateModel() {
        const userCount = Object.keys(this.userClassifications).length;
        const aiCount = Object.keys(this.modelPredictions).length;
        
        if (userCount === 0) {
            this.showNotification('Please make some manual classifications first!', 'warning');
            return;
        }
        
        if (aiCount === 0) {
            this.showNotification('Please run AI predictions first!', 'warning');
            return;
        }
        
        this.evaluationResults = this.calculateMetrics();
        this.displayResults();
        this.displayConfusionMatrix();
        this.displayClassificationReport();
        
        // Check if model performs well enough to complete challenge
        if (this.evaluationResults.overall.accuracy >= 0.67 && userCount >= 4) {
            setTimeout(() => {
                this.showNotification('🎉 Excellent model performance! Challenge completed!', 'success');
                setTimeout(() => AIChallenge.completePuzzle(), 2000);
            }, 1500);
        }
    }

    static calculateMetrics() {
        const results = {
            userVsActual: { correct: 0, total: 0, accuracy: 0 },
            aiVsActual: { correct: 0, total: 0, accuracy: 0 },
            userVsAI: { agreement: 0, total: 0, agreementRate: 0 },
            overall: { accuracy: 0 },
            perClass: {}
        };
        
        const classes = ['image', 'document', 'audio', 'video'];
        classes.forEach(cls => {
            results.perClass[cls] = {
                truePositives: 0,
                falsePositives: 0,
                falseNegatives: 0,
                precision: 0,
                recall: 0,
                f1Score: 0
            };
        });
        
        // Calculate metrics
        this.testFiles.forEach((file, index) => {
            const actual = file.actualType;
            const userPred = this.userClassifications[index];
            const aiPred = this.modelPredictions[index]?.prediction;
            
            // User vs Actual
            if (userPred) {
                results.userVsActual.total++;
                if (userPred === actual) {
                    results.userVsActual.correct++;
                }
                
                // Per-class metrics for user predictions
                classes.forEach(cls => {
                    if (actual === cls && userPred === cls) {
                        results.perClass[cls].truePositives++;
                    } else if (actual !== cls && userPred === cls) {
                        results.perClass[cls].falsePositives++;
                    } else if (actual === cls && userPred !== cls) {
                        results.perClass[cls].falseNegatives++;
                    }
                });
            }
            
            // AI vs Actual
            if (aiPred) {
                results.aiVsActual.total++;
                if (aiPred === actual) {
                    results.aiVsActual.correct++;
                }
            }
            
            // User vs AI agreement
            if (userPred && aiPred) {
                results.userVsAI.total++;
                if (userPred === aiPred) {
                    results.userVsAI.agreement++;
                }
            }
        });
        
        // Calculate final metrics
        results.userVsActual.accuracy = results.userVsActual.total > 0 ? 
            results.userVsActual.correct / results.userVsActual.total : 0;
        results.aiVsActual.accuracy = results.aiVsActual.total > 0 ? 
            results.aiVsActual.correct / results.aiVsActual.total : 0;
        results.userVsAI.agreementRate = results.userVsAI.total > 0 ? 
            results.userVsAI.agreement / results.userVsAI.total : 0;
        
        // Overall accuracy (weighted average)
        results.overall.accuracy = (results.userVsActual.accuracy + results.aiVsActual.accuracy) / 2;
        
        // Per-class precision, recall, F1
        classes.forEach(cls => {
            const tp = results.perClass[cls].truePositives;
            const fp = results.perClass[cls].falsePositives;
            const fn = results.perClass[cls].falseNegatives;
            
            results.perClass[cls].precision = tp + fp > 0 ? tp / (tp + fp) : 0;
            results.perClass[cls].recall = tp + fn > 0 ? tp / (tp + fn) : 0;
            
            const p = results.perClass[cls].precision;
            const r = results.perClass[cls].recall;
            results.perClass[cls].f1Score = p + r > 0 ? 2 * (p * r) / (p + r) : 0;
        });
        
        return results;
    }

    static displayResults() {
        const results = this.evaluationResults;
        const resultsDiv = document.getElementById('model-results');
        
        const overallColor = results.overall.accuracy >= 0.8 ? 'text-green-400' : 
                           results.overall.accuracy >= 0.6 ? 'text-yellow-400' : 'text-red-400';
        
        resultsDiv.innerHTML = `
            <div class="space-y-4">
                <div class="text-center">
                    <div class="text-2xl font-bold ${overallColor} mb-2">
                        ${(results.overall.accuracy * 100).toFixed(1)}%
                    </div>
                    <div class="text-sm text-gray-300">Overall Model Accuracy</div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div class="bg-gray-700 p-3 rounded">
                        <div class="text-blue-400 font-semibold">Your Accuracy</div>
                        <div class="text-lg">${(results.userVsActual.accuracy * 100).toFixed(1)}%</div>
                        <div class="text-xs text-gray-400">${results.userVsActual.correct}/${results.userVsActual.total} correct</div>
                    </div>
                    <div class="bg-gray-700 p-3 rounded">
                        <div class="text-purple-400 font-semibold">AI Accuracy</div>
                        <div class="text-lg">${(results.aiVsActual.accuracy * 100).toFixed(1)}%</div>
                        <div class="text-xs text-gray-400">${results.aiVsActual.correct}/${results.aiVsActual.total} correct</div>
                    </div>
                </div>
                
                <div class="bg-gray-700 p-3 rounded">
                    <div class="text-green-400 font-semibold mb-1">Human-AI Agreement</div>
                    <div class="flex items-center">
                        <div class="flex-1 bg-gray-600 rounded-full h-2 mr-3">
                            <div class="bg-green-400 h-2 rounded-full transition-all duration-500" style="width: ${results.userVsAI.agreementRate * 100}%"></div>
                        </div>
                        <span class="text-sm font-mono">${(results.userVsAI.agreementRate * 100).toFixed(1)}%</span>
                    </div>
                    <div class="text-xs text-gray-400 mt-1">${results.userVsAI.agreement}/${results.userVsAI.total} predictions match</div>
                </div>
            </div>
        `;
    }

    static displayConfusionMatrix() {
        const matrix = this.buildConfusionMatrix();
        const matrixDiv = document.getElementById('confusion-matrix');
        
        const classes = ['image', 'document', 'audio', 'video'];
        const colors = ['blue', 'green', 'purple', 'red'];
        
        matrixDiv.innerHTML = `
            <div class="overflow-x-auto">
                <table class="w-full text-xs">
                    <thead>
                        <tr>
                            <th class="p-1"></th>
                            <th class="p-1 text-center" colspan="${classes.length}">Predicted</th>
                        </tr>
                        <tr>
                            <th class="p-1"></th>
                            ${classes.map((cls, i) => `<th class="p-1 text-${colors[i]}-400">${cls}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${classes.map((actualCls, i) => `
                            <tr>
                                ${i === 0 ? `<th rowspan="${classes.length}" class="p-1 writing-mode-vertical text-gray-400">Actual</th>` : ''}
                                <th class="p-1 text-${colors[i]}-400">${actualCls}</th>
                                ${classes.map(predCls => {
                                    const count = matrix[actualCls]?.[predCls] || 0;
                                    const isCorrect = actualCls === predCls;
                                    return `<td class="p-1 text-center ${isCorrect ? 'bg-green-900 text-green-200' : 'bg-gray-700'}">${count}</td>`;
                                }).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    static buildConfusionMatrix() {
        const matrix = {};
        const classes = ['image', 'document', 'audio', 'video'];
        
        // Initialize matrix
        classes.forEach(actual => {
            matrix[actual] = {};
            classes.forEach(predicted => {
                matrix[actual][predicted] = 0;
            });
        });
        
        // Fill matrix with user predictions
        this.testFiles.forEach((file, index) => {
            const actual = file.actualType;
            const predicted = this.userClassifications[index];
            
            if (predicted) {
                matrix[actual][predicted]++;
            }
        });
        
        return matrix;
    }

    static displayClassificationReport() {
        if (!this.evaluationResults) return;
        
        const reportDiv = document.getElementById('classification-report');
        const classes = ['image', 'document', 'audio', 'video'];
        const colors = ['blue', 'green', 'purple', 'red'];
        
        reportDiv.innerHTML = `
            <div class="space-y-2 text-xs">
                ${classes.map((cls, i) => {
                    const metrics = this.evaluationResults.perClass[cls];
                    return `
                        <div class="bg-gray-700 p-2 rounded">
                            <div class="text-${colors[i]}-400 font-semibold mb-1">${cls.toUpperCase()}</div>
                            <div class="grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <div class="text-xs text-gray-400">Precision</div>
                                    <div class="font-mono">${(metrics.precision * 100).toFixed(0)}%</div>
                                </div>
                                <div>
                                    <div class="text-xs text-gray-400">Recall</div>
                                    <div class="font-mono">${(metrics.recall * 100).toFixed(0)}%</div>
                                </div>
                                <div>
                                    <div class="text-xs text-gray-400">F1-Score</div>
                                    <div class="font-mono">${(metrics.f1Score * 100).toFixed(0)}%</div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    static updateTestStatistics() {
        document.getElementById('user-count').textContent = Object.keys(this.userClassifications).length;
        document.getElementById('ai-count').textContent = Object.keys(this.modelPredictions).length;
        
        const agreement = this.calculateAgreementRate();
        document.getElementById('agreement').textContent = agreement >= 0 ? `${(agreement * 100).toFixed(1)}%` : '-';
    }

    static calculateAgreementRate() {
        let agreements = 0;
        let total = 0;
        
        this.testFiles.forEach((_, index) => {
            const userPred = this.userClassifications[index];
            const aiPred = this.modelPredictions[index]?.prediction;
            
            if (userPred && aiPred) {
                total++;
                if (userPred === aiPred) {
                    agreements++;
                }
            }
        });
        
        return total > 0 ? agreements / total : -1;
    }

    // Utility methods
    static hashExtension(ext) {
        const extensions = ['jpg', 'png', 'gif', 'pdf', 'txt', 'docx', 'mp3', 'wav', 'flac', 'mp4', 'avi', 'mkv', 'pptx'];
        return extensions.indexOf(ext.toLowerCase()) / extensions.length;
    }

    static normalizeSize(size) {
        return Math.min(size / 20000, 1);
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

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            info: 'bg-blue-600',
            warning: 'bg-yellow-600',
            error: 'bg-red-600',
            success: 'bg-green-600'
        };
        
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-info-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    static getTestResults() {
        if (!this.evaluationResults) {
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
        
        return {
            correct: this.evaluationResults.userVsActual.correct,
            total: this.evaluationResults.userVsActual.total,
            accuracy: Math.round(this.evaluationResults.overall.accuracy * 100)
        };
    }
}
